import { getLocalDateKey } from '@/lib/date'
import { prepareLocalMaster, readLocalMaster } from '@/lib/localMaster'
import type { ProductEvent } from '@/lib/productEvents'
import type { CaptureDraft, GridDraftImage } from '@/types'

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
  if (!image.imageBlob && !image.masterPath) return null
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
  }
  if (image.masterState === 'ready') {
    return { ...base, stagingBlob: undefined, masterBlob: image.masterPath ? undefined : image.imageBlob }
  }
  return { ...base, masterPath: undefined, masterBlob: undefined, stagingBlob: image.imageBlob }
}

async function readDailyRecord(ownerId: string, localDate: string) {
  return runDraftTransaction<StoredDailyRecord>('readonly', (store) => store.get(dailyRecordKey(ownerId, localDate)))
}

async function readAsset(ownerId: string, id: string) {
  return runDraftTransaction<StoredMediaAsset>('readonly', (store) => store.get(assetKey(ownerId, id)))
}

async function fromStoredDailyRecord(stored: StoredDailyRecord): Promise<CaptureDraft> {
  const gridImages = await Promise.all(stored.gridImages.map(async (image) => {
    const id = image.assetId ?? image.id
    const asset = await readAsset(stored.ownerId, id)
    let imageBlob = asset?.masterBlob ?? asset?.stagingBlob
    if (!imageBlob && asset?.masterPath) imageBlob = await readLocalMaster(asset.masterPath, asset.masterMimeType).catch(() => undefined)
    return {
      ...image,
      assetId: id,
      imageBlob,
      masterState: asset?.masterBlob || asset?.masterPath ? 'ready' as const : 'staging' as const,
      masterPath: asset?.masterPath ?? image.masterPath,
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

export async function saveCachedDraft(draft: CaptureDraft, ownerId: string) {
  const daily = toStoredDailyRecord(draft, ownerId)
  const assets = draft.gridImages.map((image) => toStoredAsset(image, ownerId, draft.localDate)).filter(Boolean) as StoredMediaAsset[]
  const existingAssets = await Promise.all(assets.map((asset) => readAsset(ownerId, asset.assetId)))
  await runDraftTransaction('readwrite', (store) => {
    existingAssets.forEach((existing, index) => store.put({ ...existing, ...assets[index] }))
    store.put(daily)
  })
}

export async function loadCachedDraft(ownerId: string, localDate = getLocalDateKey()) {
  await migrateLegacyDraft(ownerId)
  const stored = await readDailyRecord(ownerId, localDate)
  return stored ? fromStoredDailyRecord(stored) : null
}

export async function loadCachedDrafts(ownerId: string) {
  await migrateLegacyDraft(ownerId)
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
    if (image.masterState === 'ready') return image
    const stagingBlob = image.imageBlob ?? (await readAsset(ownerId, assetId(image)))?.stagingBlob
    if (!stagingBlob) throw new Error('Local staging image is missing')
    const master = await prepareLocalMaster(ownerId, draft.localDate, assetId(image), stagingBlob)
    changed = true
    return {
      ...image,
      assetId: assetId(image),
      imageBlob: master.blob ?? stagingBlob,
      masterState: 'ready' as const,
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
