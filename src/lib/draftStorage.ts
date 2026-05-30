import { getLocalDateKey } from '@/lib/date'
import type { CaptureDraft, GridDraftImage } from '@/types'

const DB_NAME = 'colorwalk-cache'
const DB_VERSION = 1
const STORE_NAME = 'drafts'
const TODAY_DRAFT_KEY = 'today-grid-draft'

type StoredGridDraftImage = Omit<GridDraftImage, 'previewUrl'>

type StoredCaptureDraft = Omit<CaptureDraft, 'gridImages'> & {
  key: string
  localDate: string
  gridImages: StoredGridDraftImage[]
}

function canUseIndexedDb() {
  return typeof indexedDB !== 'undefined' && typeof URL !== 'undefined'
}

function openDraftDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!canUseIndexedDb()) {
      reject(new Error('IndexedDB unavailable'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Failed to open draft cache'))
  })
}

function runDraftTransaction<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void,
) {
  return openDraftDb().then((db) =>
    new Promise<T | undefined>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode)
      const store = transaction.objectStore(STORE_NAME)
      const request = callback(store)
      let result: T | undefined

      if (request) {
        request.onsuccess = () => {
          result = request.result
        }
        request.onerror = () => reject(request.error ?? new Error('Draft cache request failed'))
      }

      transaction.oncomplete = () => {
        db.close()
        resolve(result)
      }
      transaction.onerror = () => {
        db.close()
        reject(transaction.error ?? new Error('Draft cache transaction failed'))
      }
    }),
  )
}

export async function saveCachedDraft(draft: CaptureDraft | null) {
  if (!draft || draft.gridImages.length === 0) {
    await clearCachedDraft()
    return
  }

  const stored: StoredCaptureDraft = {
    ...draft,
    key: TODAY_DRAFT_KEY,
    localDate: getLocalDateKey(),
    gridImages: draft.gridImages.map((image) => ({
      id: image.id,
      slot: image.slot,
      imageBlob: image.imageBlob,
      width: image.width,
      height: image.height,
      bytes: image.bytes,
      quality: image.quality,
      source: image.source,
      createdAt: image.createdAt,
    })),
  }

  await runDraftTransaction('readwrite', (store) => store.put(stored)).catch((error) => {
    console.warn('Failed to persist camera draft', error)
  })
}

export async function loadCachedDraft() {
  const stored = await runDraftTransaction<StoredCaptureDraft>('readonly', (store) => store.get(TODAY_DRAFT_KEY)).catch(
    (error) => {
      console.warn('Failed to read camera draft', error)
      return undefined
    },
  )

  if (!stored) return null

  if (stored.localDate !== getLocalDateKey()) {
    await clearCachedDraft()
    return null
  }

  return {
    mission: stored.mission,
    abuseWarning: stored.abuseWarning,
    compression: stored.compression,
    gridImages: stored.gridImages.map((image) => ({
      ...image,
      previewUrl: URL.createObjectURL(image.imageBlob),
    })),
  } satisfies CaptureDraft
}

export async function clearCachedDraft() {
  await runDraftTransaction('readwrite', (store) => store.delete(TODAY_DRAFT_KEY)).catch((error) => {
    console.warn('Failed to clear camera draft', error)
  })
}
