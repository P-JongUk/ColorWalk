import { Capacitor } from '@capacitor/core'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

import type { Locale } from '@/types'

/**
 * Shared 9:16/1:1 PNG export + Web Share/Android Share helper. Extracted from
 * StoryStudio's existing exportElement/shareNativeStory so Hueprint and Color Capsule can
 * reuse the exact same DOM->PNG, download, and native-share behavior without changing
 * Story's own callback timing or public event meaning.
 *
 * Success contract: the returned promise resolves only after the chosen delivery path
 * (download anchor click, or a completed navigator.share()/Capacitor Share.share()) has
 * actually completed. A share cancel/reject or any PNG/file-write failure rejects instead
 * of resolving, so callers must only record a completion analytics event after this
 * promise resolves - never on rejection.
 */

export type ExportSize = { width: number; height: number }

export async function exportElementToPngFile(element: HTMLElement, filename: string, size: ExportSize): Promise<File> {
  const { default: html2canvas } = await import('html2canvas')
  const bounds = element.getBoundingClientRect()
  const scale = size.width / bounds.width
  element.classList.add('story-exporting')
  let sourceCanvas: HTMLCanvasElement
  try {
    sourceCanvas = await html2canvas(element, {
      backgroundColor: null,
      scale,
      useCORS: true,
    })
  } finally {
    element.classList.remove('story-exporting')
  }
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Failed to render export')
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height)

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to render export'))
        return
      }
      resolve(new File([blob], filename, { type: 'image/png' }))
    }, 'image/png')
  })
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result ?? '')
      resolve(value.includes(',') ? value.split(',')[1] : value)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read export file'))
    reader.readAsDataURL(file)
  })
}

export type ShareDialogCopy = {
  title: string
  dialogTitle: string
}

/**
 * Writes the file to the Capacitor cache dir under `directoryName/` and calls the native
 * Share sheet. Rejects (without ever resolving) on any Filesystem/Share failure or if the
 * user cancels the native sheet - Capacitor's Share.share() rejects on cancel on Android.
 */
export async function shareNativeFile(file: File, directoryName: string, copy: ShareDialogCopy) {
  const path = `${directoryName}/${file.name}`

  await Filesystem.mkdir({
    path: directoryName,
    directory: Directory.Cache,
    recursive: true,
  }).catch(() => undefined)

  await Filesystem.writeFile({
    path,
    directory: Directory.Cache,
    data: await fileToBase64(file),
    recursive: true,
  })

  const { uri } = await Filesystem.getUri({
    path,
    directory: Directory.Cache,
  })

  await Share.share({
    title: copy.title,
    dialogTitle: copy.dialogTitle,
    files: [uri],
  })
}

export type ExportDelivery = 'download' | 'share'

/**
 * Delivers an already-rendered PNG File via download or share, resolving only once the
 * delivery has actually completed:
 * - Android (Capacitor native): cache write + Share.share() must both resolve.
 * - Web share: navigator.share() must resolve (cancel/reject rejects this promise).
 * - Web download: the anchor click must run without throwing.
 * Never resolves on a cancelled/failed share - callers must not record completion analytics
 * from a rejected promise.
 */
export async function deliverExport(file: File, mode: ExportDelivery, directoryName: string, copy: ShareDialogCopy) {
  if (Capacitor.isNativePlatform()) {
    await shareNativeFile(file, directoryName, copy)
    return
  }

  if (mode === 'share' && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: copy.title })
    return
  }

  const url = URL.createObjectURL(file)
  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.name
    anchor.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function exportTimestampFilename(prefix: string) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefix}-${stamp}.png`
}

export function shareDialogCopy(locale: Locale, label: string, mode: ExportDelivery): ShareDialogCopy {
  return {
    title: label,
    dialogTitle: mode === 'download'
      ? (locale === 'ko' ? `${label} 저장 또는 공유` : `Save or share ${label}`)
      : (locale === 'ko' ? `${label} 공유하기` : `Share ${label}`),
  }
}
