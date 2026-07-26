import type { HueCanvasRecipe } from '@/lib/hueCanvas'

export const HUE_CANVAS_PROTOTYPE_DB_NAME = 'hue-canvas-prototype'
export const HUE_CANVAS_PROTOTYPE_STORE_NAME = 'recipes'
const DB_VERSION = 1

function openPrototypeDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'))
    const request = indexedDB.open(HUE_CANVAS_PROTOTYPE_DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const store = request.result.objectStoreNames.contains(HUE_CANVAS_PROTOTYPE_STORE_NAME)
        ? request.transaction!.objectStore(HUE_CANVAS_PROTOTYPE_STORE_NAME)
        : request.result.createObjectStore(HUE_CANVAS_PROTOTYPE_STORE_NAME, { keyPath: 'id' })
      if (!store.indexNames.contains('ownerId')) store.createIndex('ownerId', 'ownerId')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Failed to open Hue Canvas prototype storage'))
  })
}

function runRecipeTransaction<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T> | void) {
  return openPrototypeDb().then((db) => new Promise<T | undefined>((resolve, reject) => {
    const transaction = db.transaction(HUE_CANVAS_PROTOTYPE_STORE_NAME, mode)
    const request = callback(transaction.objectStore(HUE_CANVAS_PROTOTYPE_STORE_NAME))
    let result: T | undefined
    if (request) {
      request.onsuccess = () => { result = request.result }
      request.onerror = () => reject(request.error ?? new Error('Hue Canvas prototype storage request failed'))
    }
    transaction.oncomplete = () => { db.close(); resolve(result) }
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Hue Canvas prototype storage transaction failed')) }
  }))
}

export async function saveHueCanvasPrototypeRecipe(recipe: HueCanvasRecipe) {
  await runRecipeTransaction('readwrite', (store) => store.put(recipe))
}

export async function loadHueCanvasPrototypeRecipes(ownerId: string) {
  const recipes = await runRecipeTransaction<HueCanvasRecipe[]>('readonly', (store) => store.index('ownerId').getAll(ownerId)) ?? []
  return recipes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function loadHueCanvasPrototypeRecipe(ownerId: string, id: string) {
  const recipe = await runRecipeTransaction<HueCanvasRecipe>('readonly', (store) => store.get(id))
  return recipe?.ownerId === ownerId ? recipe : null
}
