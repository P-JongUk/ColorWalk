import { getLocalDateKey } from '@/lib/date'
import { deleteLocalMaster, isNativeMasterStorage, localMasterExists, prepareLocalMaster, readLocalMaster } from '@/lib/localMaster'
import type { ProductEvent } from '@/lib/productEvents'
import type { CaptureDraft, GridDraftImage, MasterCleanupLifecycle, MissionPackSelection } from '@/types'

const DB_NAME = 'colorwalk-cache'
const DB_VERSION = 3
const DRAFT_STORE_NAME = 'drafts'
const PRODUCT_EVENT_STORE_NAME = 'product-events'
const LEGACY_TODAY_DRAFT_KEY = 'today-grid-draft'

type StoredGridDraftImage = Omit<GridDraftImage, 'previewUrl' | 'imageBlob'>

type StoredDailyRecord = Omit<CaptureDraft, 'gridImages'> & {
  key: string
  kind: 'daily-record'
  ownerId: string
  localDate: string
  ownerSyncState: string
  gridImages: StoredGridDraftImage[]
}

type StoredMediaAsset = {
  key: string
  kind: 'media-asset'
  ownerId: string
  assetId: string
  localDate: string
  stagingBlob?: Blob
  masterBlob?: Blob
  masterPath?: string
  masterWidth?: number
  masterHeight?: number
  masterBytes?: number
  masterMimeType?: string
  masterCleanupLifecycle?: MasterCleanupLifecycle
}

type LegacyStoredDraft = Omit<CaptureDraft, 'gridImages'> & {
  key: string
  ownerId?: string
  localDate: string
  gridImages: Array<Omit<GridDraftImage, 'previewUrl'>>
}

function dailyRecordKey(ownerId: string, localDate: string) {
  return `daily-record:${ownerId}:${localDate}`
}

function assetKey(ownerId: string, assetId: string) {
  return `media-asset:${ownerId}:${assetId}`
}

function canUseIndexedDb() {
  return typeof indexedDB !== 'undefined' && typeof URL !== 'undefined'
}

function openDraftDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!canUseIndexedDb()) return reject(new Error('IndexedDB unavailable'))
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      const drafts = db.objectStoreNames.contains(DRAFT_STORE_NAME)
        ? request.transaction!.objectStore(DRAFT_STORE_NAME)
        : db.createObjectStore(DRAFT_STORE_NAME, { keyPath: 'key' })
      if (!drafts.indexNames.contains('ownerKind')) drafts.createIndex('ownerKind', ['ownerId', 'kind'])
      if (!drafts.indexNames.contains('ownerSyncState')) drafts.createIndex('ownerSyncState', 'ownerSyncState')
      if (!db.objectStoreNames.contains(PRODUCT_EVENT_STORE_NAME)) db.createObjectStore(PRODUCT_EVENT_STORE_NAME, { keyPath: 'key' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Failed to open draft cache'))
  })
}

function runDraftTransaction<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T> | void) {
  return openDraftDb().then((db) => new Promise<T | undefined>((resolve, reject) => {
    const transaction = db.transaction(DRAFT_STORE_NAME, mode)
    const request = callback(transaction.objectStore(DRAFT_STORE_NAME))
    let result: T | undefined
    if (request) {
      request.onsuccess = () => { result = request.result }
      request.onerror = () => reject(request.error ?? new Error('Draft cache request failed'))
    }
    transaction.oncomplete = () => { db.close(); resolve(result) }
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Draft cache transaction failed')) }
  }))
}

function assetId(image: GridDraftImage) {
  return image.assetId ?? image.id
}

export type MasterCleanupAvailability = {
  eligible: boolean
  masterCount: number
  masterBytes?: number
  reason?: 'active' | 'unsynced' | 'pending-cleanup' | 'cleaned' | 'master-unavailable'
}

export function getMasterCleanupLifecycle(image: GridDraftImage): MasterCleanupLifecycle | undefined {
  if (image.masterCleanupLifecycle) return image.masterCleanupLifecycle
  if (image.masterState === 'ready' && (image.imageBlob || image.masterPath)) return 'ready'
  return undefined
}

export function recoverMasterCleanupLifecycle(lifecycle: MasterCleanupLifecycle | undefined, masterExists: boolean) {
  if (lifecycle !== 'cleanup-pending') return lifecycle
  return masterExists ? 'ready' as const : 'cleaned' as const
}

export function getMasterCleanupAvailability(draft: CaptureDraft): MasterCleanupAvailability {
  if ((draft.recordLifecycle ?? (draft.closedAt ? 'closed' : 'active')) !== 'closed') return { eligible: false, masterCount: 0, reason: 'active' }
  if (getDraftSyncState(draft) !== 'synced') return { eligible: false, masterCount: 0, reason: 'unsynced' }

  const pending = draft.gridImages.some((image) => getMasterCleanupLifecycle(image) === 'cleanup-pending')
  if (pending) return { eligible: false, masterCount: 0, reason: 'pending-cleanup' }

  const ready = draft.gridImages.filter((image) => getMasterCleanupLifecycle(image) === 'ready')
  if (!ready.length) return { eligible: false, masterCount: 0, reason: 'cleaned' }
  if (ready.some((image) => !image.imageBlob && !image.masterPath)) {
    return { eligible: false, masterCount: ready.length, reason: 'master-unavailable' }
  }

  const bytes = ready.every((image) => typeof image.masterBytes === 'number')
    ? ready.reduce((total, image) => total + (image.masterBytes ?? 0), 0)
    : undefined
  return { eligible: true, masterCount: ready.length, masterBytes: bytes }
}

export function getDraftSyncState(draft: CaptureDraft) {
  if (draft.lastSyncError) return 'error' as const
  if (draft.gridImages.some((image) => !image.uploadPath)) return 'pending' as const
  return draft.localRevision === draft.serverRevision ? 'synced' as const : 'pending' as const
}

function toStoredDailyRecord(draft: CaptureDraft, ownerId: string): StoredDailyRecord {
  const localRevision = draft.localRevision ?? 1
  const stored: Omit<StoredDailyRecord, 'ownerSyncState'> = {
    ...draft,
    key: dailyRecordKey(ownerId, draft.localDate),
    kind: 'daily-record',
    ownerId,
    localRevision,
    serverRevision: draft.serverRevision ?? 0,
    recordLifecycle: draft.recordLifecycle ?? (draft.closedAt ? 'closed' : 'active'),
    gridImages: draft.gridImages.map((image) => Object.fromEntries(
      Object.entries(image).filter(([key]) => key !== 'previewUrl' && key !== 'imageBlob'),
    ) as StoredGridDraftImage),
  }
  const state = getDraftSyncState({ ...stored, gridImages: draft.gridImages })
  return { ...stored, ownerSyncState: `${ownerId}:${state}` }
}

function toStoredAsset(image: GridDraftImage, ownerId: string, localDate: string): StoredMediaAsset | null {
  const id = assetId(image)
  const masterCleanupLifecycle = getMasterCleanupLifecycle(image)
  if (!image.imageBlob && !image.masterPath && masterCleanupLifecycle !== 'cleaned') return null
  const base: StoredMediaAsset = {
    key: assetKey(ownerId, id),
    kind: 'media-asset',
    ownerId,
    assetId: id,
    localDate,
    masterPath: image.masterPath,
    masterWidth: image.masterWidth,
    masterHeight: image.masterHeight,
    masterBytes: image.masterBytes,
    masterMimeType: image.masterMimeType,
    masterCleanupLifecycle,
  }
  if (masterCleanupLifecycle === 'cleaned') {
    return { ...base, stagingBlob: undefined, masterBlob: undefined, masterPath: undefined }
  }
  if (image.masterState === 'ready') {
    return { ...base, stagingBlob: undefined, masterBlob: image.masterPath ? undefined : image.imageBlob }
  }
  return { ...base, masterPath: undefined, masterBlob: undefined, stagingBlob: image.imageBlob }
}

function storedAssetsForDraft(draft: CaptureDraft, ownerId: string) {
  return draft.gridImages
    .map((image) => toStoredAsset(image, ownerId, draft.localDate))
    .filter(Boolean) as StoredMediaAsset[]
}

export function buildDraftRecords(draft: CaptureDraft, ownerId: string) {
  return { daily: toStoredDailyRecord(draft, ownerId), assets: storedAssetsForDraft(draft, ownerId) }
}

function putDraftRecords(store: IDBObjectStore, draft: CaptureDraft, ownerId: string) {
  const { daily, assets } = buildDraftRecords(draft, ownerId)
  assets.forEach((asset) => store.put(asset))
  store.put(daily)
}

async function readDailyRecord(ownerId: string, localDate: string) {
  return runDraftTransaction<StoredDailyRecord>('readonly', (store) => store.get(dailyRecordKey(ownerId, localDate)))
}

async function readAsset(ownerId: string, id: string) {
  return runDraftTransaction<StoredMediaAsset>('readonly', (store) => store.get(assetKey(ownerId, id)))
}

async function saveStoredAsset(asset: StoredMediaAsset) {
  await runDraftTransaction('readwrite', (store) => store.put(asset))
}

async function recoverPendingMasterCleanup(asset: StoredMediaAsset) {
  if (asset.masterCleanupLifecycle !== 'cleanup-pending') return asset

  // Recovery only reconciles the marker with the file that already exists. It never deletes a file.
  const exists = asset.masterPath ? await localMasterExists(asset.masterPath) : Boolean(asset.masterBlob)
  const lifecycle = recoverMasterCleanupLifecycle(asset.masterCleanupLifecycle, exists)
  const recovered: StoredMediaAsset = lifecycle === 'cleaned'
    ? { ...asset, masterCleanupLifecycle: lifecycle, masterBlob: undefined, masterPath: undefined }
    : { ...asset, masterCleanupLifecycle: lifecycle }
  await saveStoredAsset(recovered)
  return recovered
}

async function fromStoredDailyRecord(stored: StoredDailyRecord): Promise<CaptureDraft> {
  const gridImages = await Promise.all(stored.gridImages.map(async (image) => {
    const id = image.assetId ?? image.id
    const storedAsset = await readAsset(stored.ownerId, id)
    const asset = storedAsset ? await recoverPendingMasterCleanup(storedAsset) : undefined
    const masterCleanupLifecycle = image.masterCleanupLifecycle
      ?? asset?.masterCleanupLifecycle
      ?? ((asset?.masterBlob || asset?.masterPath || image.masterPath) ? 'ready' as const : undefined)
    const intentionallyCleaned = masterCleanupLifecycle === 'cleaned'
    let imageBlob = intentionallyCleaned ? undefined : asset?.masterBlob ?? asset?.stagingBlob
    if (!imageBlob && asset?.masterPath && !intentionallyCleaned) {
      imageBlob = await readLocalMaster(asset.masterPath, asset.masterMimeType).catch(() => undefined)
    }
    const hasMaster = !intentionallyCleaned && Boolean(asset?.masterBlob || asset?.masterPath || image.masterPath)
    return {
      ...image,
      assetId: id,
      imageBlob,
      masterState: intentionallyCleaned || hasMaster ? 'ready' as const : 'staging' as const,
      masterCleanupLifecycle,
      masterPath: intentionallyCleaned ? undefined : (asset?.masterPath ?? image.masterPath),
      masterWidth: asset?.masterWidth ?? image.masterWidth,
      masterHeight: asset?.masterHeight ?? image.masterHeight,
      masterBytes: asset?.masterBytes ?? image.masterBytes,
      masterMimeType: asset?.masterMimeType ?? image.masterMimeType,
      previewUrl: imageBlob ? URL.createObjectURL(imageBlob) : undefined,
    }
  }))
  return { ...stored, gridImages }
}

async function migrateLegacyDraft(ownerId: string) {
  const legacy = await runDraftTransaction<LegacyStoredDraft>('readonly', (store) => store.get(LEGACY_TODAY_DRAFT_KEY))
  if (!legacy?.gridImages?.length) return
  const localDate = legacy.localDate || getLocalDateKey()
  const draft: CaptureDraft = {
    ...legacy,
    localDate,
    localRevision: legacy.localRevision ?? 1,
    serverRevision: legacy.serverRevision ?? 0,
    recordLifecycle: legacy.closedAt ? 'closed' : 'active',
    gridImages: legacy.gridImages.map((image) => ({ ...image, assetId: image.assetId ?? image.id, masterState: 'staging' })),
  }
  await saveCachedDraft(draft, ownerId)
  await runDraftTransaction('readwrite', (store) => store.delete(LEGACY_TODAY_DRAFT_KEY))
}

async function migrateLegacyDailyRecords(ownerId: string) {
  const legacyRecords = await runDraftTransaction<LegacyStoredDraft[]>('readonly', (store) => store.getAll()) ?? []
  const candidates = legacyRecords.filter((record) =>
    record.key?.startsWith(`daily-grid-draft:${ownerId}:`) && Array.isArray(record.gridImages),
  )
  for (const legacy of candidates) {
    const draft: CaptureDraft = {
      ...legacy,
      localDate: legacy.localDate,
      localRevision: legacy.localRevision ?? 1,
      serverRevision: legacy.serverRevision ?? 0,
      recordLifecycle: legacy.closedAt ? 'closed' : 'active',
      gridImages: legacy.gridImages.map((image) => ({ ...image, assetId: image.assetId ?? image.id, masterState: 'staging' })),
    }
    await runDraftTransaction('readwrite', (store) => {
      // The old record remains until both the daily record and every asset are queued.
      putDraftRecords(store, draft, ownerId)
      return store.delete(legacy.key)
    })
  }
}

export async function saveCachedDraft(draft: CaptureDraft, ownerId: string) {
  await runDraftTransaction('readwrite', (store) => {
    putDraftRecords(store, draft, ownerId)
  })
}

export type MissionPackUpdateResult = { localRevision: number; serverRevision: number }

/**
 * Metadata-only mission pack select/change/clear for a 0-7 photo daily record.
 * Reads and writes only the single daily-record row in one transaction; never touches
 * the media-asset store, so Blob/master/preview/uploadPath data is untouched. This is
 * intentionally separate from saveCachedDraft, which also re-derives asset rows from
 * gridImages and would be a wider write than this metadata-only contract allows.
 */
export async function updateMissionPackSelection(
  ownerId: string,
  localDate: string,
  missionPack: MissionPackSelection,
): Promise<MissionPackUpdateResult | null> {
  const db = await openDraftDb()
  return new Promise<MissionPackUpdateResult | null>((resolve, reject) => {
    const transaction = db.transaction(DRAFT_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(DRAFT_STORE_NAME)
    const getRequest = store.get(dailyRecordKey(ownerId, localDate))
    let result: MissionPackUpdateResult | null = null
    getRequest.onsuccess = () => {
      const existing = getRequest.result as StoredDailyRecord | undefined
      if (!existing) return
      const localRevision = (existing.localRevision ?? 0) + 1
      const serverRevision = existing.serverRevision ?? 0
      const updated: StoredDailyRecord = { ...existing, missionPack, localRevision, lastSyncError: undefined }
      // getDraftSyncState only reads uploadPath/localRevision/serverRevision/lastSyncError,
      // all present on the stored (asset-less) shape, so no asset rehydration is needed here.
      const state = getDraftSyncState(updated as unknown as CaptureDraft)
      store.put({ ...updated, ownerSyncState: `${ownerId}:${state}` })
      result = { localRevision, serverRevision }
    }
    getRequest.onerror = () => reject(getRequest.error ?? new Error('Draft cache request failed'))
    transaction.oncomplete = () => { db.close(); resolve(result) }
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Draft cache transaction failed')) }
  })
}

export async function loadCachedDraft(ownerId: string, localDate = getLocalDateKey()) {
  await migrateLegacyDraft(ownerId)
  await migrateLegacyDailyRecords(ownerId)
  const stored = await readDailyRecord(ownerId, localDate)
  return stored ? fromStoredDailyRecord(stored) : null
}

export async function loadCachedDrafts(ownerId: string) {
  await migrateLegacyDraft(ownerId)
  await migrateLegacyDailyRecords(ownerId)
  const stored = await runDraftTransaction<StoredDailyRecord[]>('readonly', (store) => store.index('ownerKind').getAll(IDBKeyRange.only([ownerId, 'daily-record']))) ?? []
  return Promise.all(stored.sort((a, b) => b.localDate.localeCompare(a.localDate)).map(fromStoredDailyRecord))
}

export async function loadPendingCachedDrafts(ownerId: string) {
  const states = await Promise.all(['pending', 'error'].map((state) => runDraftTransaction<StoredDailyRecord[]>('readonly', (store) => store.index('ownerSyncState').getAll(`${ownerId}:${state}`))))
  return Promise.all(states.flat().filter((record): record is StoredDailyRecord => Boolean(record)).map(fromStoredDailyRecord))
}

export async function promoteDraftMasters(draft: CaptureDraft, ownerId: string) {
  let changed = false
  const gridImages = await Promise.all(draft.gridImages.map(async (image) => {
    const cleanupLifecycle = getMasterCleanupLifecycle(image)
    if (cleanupLifecycle === 'cleaned' || cleanupLifecycle === 'cleanup-pending' || image.masterState === 'ready') return image
    const stagingBlob = image.imageBlob ?? (await readAsset(ownerId, assetId(image)))?.stagingBlob
    if (!stagingBlob) throw new Error('Local staging image is missing')
    const master = await prepareLocalMaster(ownerId, draft.localDate, assetId(image), stagingBlob)
    changed = true
    return {
      ...image,
      assetId: assetId(image),
      imageBlob: master.blob ?? stagingBlob,
      masterState: 'ready' as const,
      masterCleanupLifecycle: 'ready' as const,
      masterPath: master.path,
      masterWidth: master.width,
      masterHeight: master.height,
      masterBytes: master.bytes,
      masterMimeType: master.mimeType,
      previewUrl: master.blob ? URL.createObjectURL(master.blob) : image.previewUrl,
    }
  }))
  const promoted = changed ? { ...draft, gridImages } : draft
  if (changed) await saveCachedDraft(promoted, ownerId)
  return promoted
}

export function withMasterCleanupLifecycle(draft: CaptureDraft, targetAssetId: string, lifecycle: MasterCleanupLifecycle): CaptureDraft {
  return {
    ...draft,
    gridImages: draft.gridImages.map((image) => {
      if (assetId(image) !== targetAssetId) return image
      if (lifecycle === 'cleaned') {
        return {
          ...image,
          imageBlob: undefined,
          previewUrl: undefined,
          masterPath: undefined,
          masterCleanupLifecycle: lifecycle,
          // "ready" keeps cleanup distinct from a missing staging source.
          masterState: 'ready' as const,
        }
      }
      return { ...image, masterCleanupLifecycle: lifecycle }
    }),
  }
}

export function resolvePendingMasterCleanup(draft: CaptureDraft, targetAssetId: string, masterExists: boolean) {
  return withMasterCleanupLifecycle(draft, targetAssetId, masterExists ? 'ready' : 'cleaned')
}

export async function cleanupLocalMasters(ownerId: string, localDate: string, expectedRevision: number) {
  const draft = await loadCachedDraft(ownerId, localDate)
  if (!draft || draft.localRevision !== expectedRevision || draft.serverRevision !== expectedRevision) {
    throw new Error('The synced record changed before cleanup')
  }

  const availability = getMasterCleanupAvailability(draft)
  if (!availability.eligible) throw new Error('This record is not ready for master cleanup')

  if (!isNativeMasterStorage()) {
    const cleaned = draft.gridImages
      .filter((image) => getMasterCleanupLifecycle(image) === 'ready')
      .reduce((current, image) => withMasterCleanupLifecycle(current, assetId(image), 'cleaned'), draft)
    await saveCachedDraft(cleaned, ownerId)
    return cleaned
  }

  let current = draft
  for (const image of draft.gridImages) {
    if (getMasterCleanupLifecycle(current.gridImages.find((candidate) => assetId(candidate) === assetId(image)) ?? image) !== 'ready') continue

    current = withMasterCleanupLifecycle(current, assetId(image), 'cleanup-pending')
    await saveCachedDraft(current, ownerId)

    const pendingImage = current.gridImages.find((candidate) => assetId(candidate) === assetId(image))
    try {
      if (!pendingImage?.masterPath) throw new Error('Local master path is unavailable')
      await deleteLocalMaster(pendingImage.masterPath)
      current = withMasterCleanupLifecycle(current, assetId(image), 'cleaned')
      await saveCachedDraft(current, ownerId)
    } catch {
      const exists = pendingImage?.masterPath ? await localMasterExists(pendingImage.masterPath) : true
      current = resolvePendingMasterCleanup(current, assetId(image), exists)
      await saveCachedDraft(current, ownerId)
    }
  }
  return current
}

export async function clearCachedDraft(ownerId: string, localDate = getLocalDateKey()) {
  // Kept only for explicit future deletion flows. Completed local records must not call this.
  await runDraftTransaction('readwrite', (store) => store.delete(dailyRecordKey(ownerId, localDate)))
}

export async function enqueueProductEvent(event: ProductEvent) {
  const db = await openDraftDb()
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(PRODUCT_EVENT_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(PRODUCT_EVENT_STORE_NAME)
    const existing = store.get(event.key)
    existing.onsuccess = () => { if (!existing.result) store.add(event) }
    existing.onerror = () => reject(existing.error ?? new Error('Product event lookup failed'))
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Product event cache transaction failed')) }
  })
}

export async function loadPendingProductEvents(ownerId: string) {
  const db = await openDraftDb()
  return new Promise<ProductEvent[]>((resolve, reject) => {
    const transaction = db.transaction(PRODUCT_EVENT_STORE_NAME, 'readonly')
    const request = transaction.objectStore(PRODUCT_EVENT_STORE_NAME).getAll()
    request.onsuccess = () => resolve((request.result as ProductEvent[]).filter((event) => event.ownerId === ownerId))
    request.onerror = () => reject(request.error ?? new Error('Product event cache read failed'))
    transaction.oncomplete = () => db.close()
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Product event cache transaction failed')) }
  })
}

export async function removePendingProductEvents(keys: string[]) {
  if (!keys.length) return
  const db = await openDraftDb()
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(PRODUCT_EVENT_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(PRODUCT_EVENT_STORE_NAME)
    keys.forEach((key) => store.delete(key))
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Product event cache transaction failed')) }
  })
}
