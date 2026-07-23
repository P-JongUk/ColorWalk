import { getLocalDateKey } from '@/lib/date'
import type { CaptureDraft, GridDraftImage } from '@/types'

const DB_NAME = 'colorwalk-cache'
const DB_VERSION = 1
const STORE_NAME = 'drafts'
const LEGACY_TODAY_DRAFT_KEY = 'today-grid-draft'

type StoredGridDraftImage = Omit<GridDraftImage, 'previewUrl'>

type StoredCaptureDraft = Omit<CaptureDraft, 'gridImages'> & {
  key: string
  ownerId: string
  localDate: string
  gridImages: StoredGridDraftImage[]
}

function draftKey(ownerId: string, localDate: string) {
  return `daily-grid-draft:${ownerId}:${localDate}`
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
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'key' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Failed to open draft cache'))
  })
}

function runDraftTransaction<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T> | void) {
  return openDraftDb().then((db) => new Promise<T | undefined>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode)
    const request = callback(transaction.objectStore(STORE_NAME))
    let result: T | undefined
    if (request) {
      request.onsuccess = () => { result = request.result }
      request.onerror = () => reject(request.error ?? new Error('Draft cache request failed'))
    }
    transaction.oncomplete = () => { db.close(); resolve(result) }
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Draft cache transaction failed')) }
  }))
}

function toStoredDraft(draft: CaptureDraft, ownerId: string): StoredCaptureDraft {
  return {
    ...draft,
    key: draftKey(ownerId, draft.localDate),
    ownerId,
    gridImages: draft.gridImages.map((image) => Object.fromEntries(
      Object.entries(image).filter(([key]) => key !== 'previewUrl'),
    ) as StoredGridDraftImage),
  }
}

function fromStoredDraft(stored: StoredCaptureDraft): CaptureDraft {
  return {
    ...stored,
    gridImages: stored.gridImages.map((image) => ({ ...image, previewUrl: URL.createObjectURL(image.imageBlob) })),
  }
}

async function migrateLegacyDraft(ownerId: string) {
  const legacy = await runDraftTransaction<StoredCaptureDraft>('readonly', (store) => store.get(LEGACY_TODAY_DRAFT_KEY))
  if (!legacy?.gridImages?.length) return
  const localDate = legacy.localDate || getLocalDateKey()
  const migrated: StoredCaptureDraft = {
    ...legacy,
    key: draftKey(ownerId, localDate),
    ownerId,
    localDate,
    syncState: legacy.syncState ?? 'pending',
  }
  await runDraftTransaction('readwrite', (store) => {
    store.put(migrated)
    return store.delete(LEGACY_TODAY_DRAFT_KEY)
  })
}

export async function saveCachedDraft(draft: CaptureDraft, ownerId: string) {
  await runDraftTransaction('readwrite', (store) => store.put(toStoredDraft(draft, ownerId)))
}

export async function loadCachedDraft(ownerId: string, localDate = getLocalDateKey()) {
  await migrateLegacyDraft(ownerId)
  const stored = await runDraftTransaction<StoredCaptureDraft>('readonly', (store) => store.get(draftKey(ownerId, localDate)))
  return stored ? fromStoredDraft(stored) : null
}

export async function loadCachedDrafts(ownerId: string) {
  await migrateLegacyDraft(ownerId)
  const stored = await runDraftTransaction<StoredCaptureDraft[]>('readonly', (store) => store.getAll()) ?? []
  return stored
    .filter((draft) => draft.ownerId === ownerId)
    .map(fromStoredDraft)
    .sort((a, b) => b.localDate.localeCompare(a.localDate))
}

export async function clearCachedDraft(ownerId: string, localDate = getLocalDateKey()) {
  await runDraftTransaction('readwrite', (store) => store.delete(draftKey(ownerId, localDate)))
}
