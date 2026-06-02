import { rgbToHex } from '@/lib/colors'
import type { Rgb } from '@/types'

export type CompressedImage = {
  blob: Blob
  width: number
  height: number
  quality: number
  bytes: number
}

export type DraftImageBlob = {
  blob: Blob
  width: number
  height: number
  bytes: number
  mimeType: string
}

type ImageCaptureLike = {
  takePhoto: () => Promise<Blob>
}

type WindowWithImageCapture = Window & {
  ImageCapture?: new (track: MediaStreamTrack) => ImageCaptureLike
}

export const HISTORY_UPLOAD_IMAGE_OPTIONS = {
  maxWidth: 1440,
  targetBytes: 420 * 1024,
  minWidth: 900,
  minQuality: 0.6,
} as const

function canvasToBlob(canvas: HTMLCanvasElement, quality: number, type = 'image/webp'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to encode image'))
          return
        }
        resolve(blob)
      },
      type,
      quality,
    )
  })
}

function getCanvasContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not available')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  return context
}

export function drawVideoFrameToCanvas(video: HTMLVideoElement) {
  const sourceWidth = video.videoWidth || 720
  const sourceHeight = video.videoHeight || 1280
  const canvas = document.createElement('canvas')
  canvas.width = sourceWidth
  canvas.height = sourceHeight

  const context = getCanvasContext(canvas)
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  return canvas
}

export function readImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(blob)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(imageUrl)
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl)
      reject(new Error('Could not read image dimensions'))
    }

    image.src = imageUrl
  })
}

export async function canvasToDraftImageBlob(canvas: HTMLCanvasElement): Promise<DraftImageBlob> {
  const blob = await canvasToBlob(canvas, 0.92, 'image/png')

  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    bytes: blob.size,
    mimeType: blob.type || 'image/png',
  }
}

export async function fileToDraftImageBlob(file: File): Promise<DraftImageBlob> {
  const { width, height } = await readImageDimensions(file)

  return {
    blob: file,
    width,
    height,
    bytes: file.size,
    mimeType: file.type || 'image/*',
  }
}

export async function capturePhotoBlob(track: MediaStreamTrack, video: HTMLVideoElement): Promise<DraftImageBlob> {
  const ImageCaptureCtor = (window as WindowWithImageCapture).ImageCapture

  if (ImageCaptureCtor) {
    try {
      const blob = await new ImageCaptureCtor(track).takePhoto()
      const { width, height } = await readImageDimensions(blob)

      return {
        blob,
        width,
        height,
        bytes: blob.size,
        mimeType: blob.type || 'image/jpeg',
      }
    } catch {
      // Some browsers expose ImageCapture but reject takePhoto for the active track.
    }
  }

  return canvasToDraftImageBlob(drawVideoFrameToCanvas(video))
}

export async function blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(blob)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(imageUrl)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, image.naturalWidth)
      canvas.height = Math.max(1, image.naturalHeight)

      try {
        const context = getCanvasContext(canvas)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas)
      } catch (error) {
        reject(error)
      }
    }

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl)
      reject(new Error('Could not load image'))
    }

    image.src = imageUrl
  })
}

export async function compressCanvasToWebP(
  source: HTMLCanvasElement,
  options: { maxWidth?: number; targetBytes?: number; minWidth?: number; minQuality?: number } = {},
): Promise<CompressedImage> {
  const targetBytes = options.targetBytes ?? 420 * 1024
  let maxWidth = options.maxWidth ?? 1440
  const minWidth = options.minWidth ?? 900
  const minQuality = options.minQuality ?? 0.6
  let quality = 0.84

  for (let attempt = 0; attempt < 14; attempt += 1) {
    const ratio = Math.min(1, maxWidth / source.width)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(source.width * ratio))
    canvas.height = Math.max(1, Math.round(source.height * ratio))
    const context = getCanvasContext(canvas)
    context.drawImage(source, 0, 0, canvas.width, canvas.height)

    const blob = await canvasToBlob(canvas, quality)
    if (blob.size <= targetBytes || (quality <= minQuality && maxWidth <= minWidth)) {
      return {
        blob,
        width: canvas.width,
        height: canvas.height,
        quality,
        bytes: blob.size,
      }
    }

    if (quality > minQuality) {
      quality = Math.max(minQuality, quality - 0.05)
    } else {
      maxWidth = Math.max(minWidth, Math.round(maxWidth * 0.88))
      quality = 0.72
    }
  }

  const fallback = document.createElement('canvas')
  const ratio = Math.min(1, minWidth / source.width)
  fallback.width = Math.max(1, Math.round(source.width * ratio))
  fallback.height = Math.max(1, Math.round(source.height * ratio))
  getCanvasContext(fallback).drawImage(source, 0, 0, fallback.width, fallback.height)
  const blob = await canvasToBlob(fallback, minQuality)

  return {
    blob,
    width: fallback.width,
    height: fallback.height,
    quality: minQuality,
    bytes: blob.size,
  }
}

export async function compressBlobToHistoryWebP(blob: Blob) {
  return compressCanvasToWebP(await blobToCanvas(blob), HISTORY_UPLOAD_IMAGE_OPTIONS)
}

export function sampleVideoCenter(video: HTMLVideoElement) {
  const canvas = document.createElement('canvas')
  const sampleSize = 96
  canvas.width = sampleSize
  canvas.height = sampleSize

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context || !video.videoWidth || !video.videoHeight) {
    return {
      hex: '#FFFFFF',
    }
  }

  context.drawImage(video, 0, 0, sampleSize, sampleSize)
  const fullPixels = context.getImageData(0, 0, sampleSize, sampleSize)

  return {
    hex: rgbToHex(sampleWeightedCenter(fullPixels.data, sampleSize, sampleSize)),
  }
}

export function sampleCanvasCenter(source: HTMLCanvasElement) {
  const sampleSize = 96
  const canvas = document.createElement('canvas')
  canvas.width = sampleSize
  canvas.height = sampleSize

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context || !source.width || !source.height) {
    return {
      hex: '#FFFFFF',
    }
  }

  context.drawImage(source, 0, 0, sampleSize, sampleSize)
  const fullPixels = context.getImageData(0, 0, sampleSize, sampleSize)

  return {
    hex: rgbToHex(sampleWeightedCenter(fullPixels.data, sampleSize, sampleSize)),
  }
}

function getRelativeLuminance({ r, g, b }: Rgb) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function sampleWeightedCenter(data: Uint8ClampedArray, width: number, height: number): Rgb {
  const centerX = (width - 1) / 2
  const centerY = (height - 1) / 2
  const radius = Math.min(width, height) * 0.17
  const candidates: Array<Rgb & { luminance: number; weight: number }> = []

  for (let y = Math.floor(centerY - radius); y <= Math.ceil(centerY + radius); y += 1) {
    for (let x = Math.floor(centerX - radius); x <= Math.ceil(centerX + radius); x += 1) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue

      const distance = Math.hypot(x - centerX, y - centerY)
      if (distance > radius) continue

      const index = (y * width + x) * 4
      const alpha = data[index + 3]
      if (alpha < 120) continue

      const pixel = {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
      }
      candidates.push({
        ...pixel,
        luminance: getRelativeLuminance(pixel),
        weight: 0.35 + 0.65 * (1 - distance / radius),
      })
    }
  }

  if (!candidates.length) {
    return { r: 255, g: 255, b: 255 }
  }

  const sorted = [...candidates].sort((a, b) => a.luminance - b.luminance)
  const trim = Math.min(Math.floor(sorted.length * 0.12), Math.floor((sorted.length - 1) / 2))
  const trimmed = sorted.slice(trim, sorted.length - trim)
  let r = 0
  let g = 0
  let b = 0
  let totalWeight = 0

  for (const pixel of trimmed) {
    r += pixel.r * pixel.weight
    g += pixel.g * pixel.weight
    b += pixel.b * pixel.weight
    totalWeight += pixel.weight
  }

  return {
    r: r / totalWeight,
    g: g / totalWeight,
    b: b / totalWeight,
  }
}
