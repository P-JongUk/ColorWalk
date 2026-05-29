import type { GridDraftImage, GridImage, GridImageSource, Post } from '@/types'

export const GRID_CENTER_SLOT = 4
export const GRID_PHOTO_SLOTS = [0, 8, 2, 6, 1, 3, 7, 5] as const
export const GRID_ALL_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
export const MAX_GRID_IMAGES = GRID_PHOTO_SLOTS.length

export function getNextGridSlot(imageCount: number) {
  return GRID_PHOTO_SLOTS[Math.min(Math.max(imageCount, 0), GRID_PHOTO_SLOTS.length - 1)]
}

export function sortGridImages<T extends { slot: number; createdAt?: string | null }>(images: T[]) {
  return [...images].sort((a, b) => {
    const slotDelta = GRID_PHOTO_SLOTS.indexOf(a.slot as (typeof GRID_PHOTO_SLOTS)[number]) - GRID_PHOTO_SLOTS.indexOf(b.slot as (typeof GRID_PHOTO_SLOTS)[number])
    if (slotDelta !== 0) return slotDelta
    return String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? ''))
  })
}

export function normalizeGridImages(value: unknown): GridImage[] {
  if (!Array.isArray(value)) return []

  return sortGridImages(
    value
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
      .map((item, index) => {
        const slot = Number(item.slot)
        const safeSlot = GRID_PHOTO_SLOTS.includes(slot as (typeof GRID_PHOTO_SLOTS)[number])
          ? slot
          : getNextGridSlot(index)
        const path = typeof item.path === 'string'
          ? item.path
          : typeof item.previewUrl === 'string'
            ? item.previewUrl
            : ''

        const source: GridImageSource =
          item.source === 'camera' || item.source === 'album' || item.source === 'seed' || item.source === 'legacy'
            ? item.source
            : 'camera'

        return {
          id: typeof item.id === 'string' ? item.id : `grid-image-${index}`,
          slot: safeSlot,
          path,
          signedUrl: typeof item.signedUrl === 'string' ? item.signedUrl : undefined,
          previewUrl: typeof item.previewUrl === 'string' ? item.previewUrl : undefined,
          width: typeof item.width === 'number' ? item.width : null,
          height: typeof item.height === 'number' ? item.height : null,
          bytes: typeof item.bytes === 'number' ? item.bytes : null,
          source,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : null,
        }
      })
      .filter((item) => item.path)
      .slice(0, MAX_GRID_IMAGES),
  )
}

export function getGridImageUrl(image: Partial<Pick<GridImage, 'signedUrl' | 'previewUrl' | 'path'>> | undefined) {
  if (!image) return undefined
  if (image.signedUrl) return image.signedUrl
  if (image.previewUrl) return image.previewUrl
  if (image.path && /^(blob:|data:image\/|https?:\/\/)/.test(image.path)) return image.path
  return undefined
}

export function getPostGridImages(post: Post | undefined): GridImage[] {
  if (!post) return []

  const normalized = normalizeGridImages(post.grid_images)
  if (normalized.length) return normalized

  const fallbackUrl = post.signedImageUrl || (/^(blob:|data:image\/|https?:\/\/)/.test(post.image_path) ? post.image_path : undefined)
  if (!fallbackUrl && !post.image_path) return []

  return [
    {
      id: `${post.id}-legacy-image`,
      slot: GRID_PHOTO_SLOTS[0],
      path: post.image_path,
      signedUrl: fallbackUrl,
      source: 'legacy',
      createdAt: post.created_at,
    },
  ]
}

export function getPostGridImageCount(post: Post | undefined) {
  return getPostGridImages(post).length
}

export function getPostImagePaths(post: Post | undefined) {
  if (!post) return []

  return Array.from(
    new Set(
      [
        post.image_path,
        ...normalizeGridImages(post.grid_images).map((image) => image.path),
      ].filter((path) => path && !/^(blob:|data:image\/|https?:\/\/)/.test(path)),
    ),
  )
}

export function toStoredGridImages(images: GridDraftImage[], paths: string[]): GridImage[] {
  return images.map((image, index) => ({
    id: image.id,
    slot: image.slot,
    path: paths[index] ?? '',
    width: image.width,
    height: image.height,
    bytes: image.bytes,
    source: image.source,
    createdAt: image.createdAt,
  })).filter((image) => image.path)
}
