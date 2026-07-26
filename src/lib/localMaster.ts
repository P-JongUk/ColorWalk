import { Capacitor } from '@capacitor/core'
import { Directory, Filesystem } from '@capacitor/filesystem'

import { createLocalMasterWebP, readImageDimensions } from '@/lib/image'

export type LocalMaster = {
  blob?: Blob
  path?: string
  width: number
  height: number
  bytes: number
  mimeType: string
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result ?? '')
      resolve(value.includes(',') ? value.split(',')[1] : value)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read local master'))
    reader.readAsDataURL(blob)
  })
}

function base64ToBlob(value: string, mimeType: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return new Blob([bytes], { type: mimeType })
}

function masterPath(ownerId: string, localDate: string, assetId: string) {
  return `hueday/masters/${ownerId}/${localDate}/${assetId}.webp`
}

export function isNativeMasterStorage() {
  return Capacitor.isNativePlatform()
}

export async function prepareLocalMaster(ownerId: string, localDate: string, assetId: string, stagingBlob: Blob): Promise<LocalMaster> {
  const encoded = await createLocalMasterWebP(stagingBlob)
  const mimeType = encoded.blob.type || 'image/webp'
  const dimensions = await readImageDimensions(encoded.blob)
  if (dimensions.width !== encoded.width || dimensions.height !== encoded.height) throw new Error('Local master verification failed')

  if (!isNativeMasterStorage()) {
    return { blob: encoded.blob, width: encoded.width, height: encoded.height, bytes: encoded.bytes, mimeType }
  }

  const path = masterPath(ownerId, localDate, assetId)
  await Filesystem.writeFile({ path, directory: Directory.Data, data: await blobToBase64(encoded.blob), recursive: true })
  const stored = await Filesystem.readFile({ path, directory: Directory.Data })
  const verified = typeof stored.data === 'string' ? base64ToBlob(stored.data, mimeType) : stored.data
  const verifiedDimensions = await readImageDimensions(verified)
  if (verified.size !== encoded.bytes || verifiedDimensions.width !== encoded.width || verifiedDimensions.height !== encoded.height) {
    throw new Error('Local master verification failed')
  }
  return { path, width: encoded.width, height: encoded.height, bytes: encoded.bytes, mimeType }
}

export async function readLocalMaster(path: string, mimeType = 'image/webp') {
  const result = await Filesystem.readFile({ path, directory: Directory.Data })
  return typeof result.data === 'string' ? base64ToBlob(result.data, mimeType) : result.data
}

export function isStorageFullError(error: unknown) {
  const failure = error as { name?: string; code?: string; message?: string }
  const message = String(failure?.message ?? error).toLowerCase()
  return failure?.name === 'QuotaExceededError'
    || failure?.code === 'ENOSPC'
    || message.includes('quota')
    || message.includes('no space')
    || message.includes('enospc')
    || message.includes('storage full')
}
