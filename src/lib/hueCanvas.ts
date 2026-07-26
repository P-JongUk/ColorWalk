import { getPostGridImageCount } from '@/lib/grid'
import type { Post } from '@/types'

export const HUE_CANVAS_LOGICAL_SIZE = 256
export const HUE_CANVAS_CELLS_PER_COMPLETED_PAGE = 8

export type HueCanvasPaletteColor = {
  hex: string
  label: string
  completedPages: number
  usableCells: number
  sourcePostIds: string[]
}

export type HueCanvasRecipe = {
  id: string
  ownerId: string
  title: string
  cells: Array<[number, string]>
  viewport: { zoom: number; offsetX: number; offsetY: number }
  createdAt: string
  updatedAt: string
  version: 1
}

function normalizeHex(value: string) {
  const normalized = value.trim().toUpperCase()
  return /^#[0-9A-F]{6}$/.test(normalized) ? normalized : null
}

export function getHueCanvasPalette(posts: Post[]): HueCanvasPaletteColor[] {
  const palette = new Map<string, HueCanvasPaletteColor>()

  posts.forEach((post) => {
    const hex = normalizeHex(post.mission_hex)
    if (!hex || getPostGridImageCount(post) < 8) return
    const existing = palette.get(hex)
    if (existing) {
      existing.completedPages += 1
      existing.usableCells += HUE_CANVAS_CELLS_PER_COMPLETED_PAGE
      existing.sourcePostIds.push(post.id)
      return
    }
    palette.set(hex, {
      hex,
      label: post.custom_color_name || post.mission_label || hex,
      completedPages: 1,
      usableCells: HUE_CANVAS_CELLS_PER_COMPLETED_PAGE,
      sourcePostIds: [post.id],
    })
  })

  return [...palette.values()].sort((a, b) => b.completedPages - a.completedPages || a.hex.localeCompare(b.hex))
}

export function getHueCanvasColorUsage(cells: Iterable<[number, string]>) {
  const usage = new Map<string, number>()
  for (const [, color] of cells) usage.set(color, (usage.get(color) ?? 0) + 1)
  return usage
}

export function canPlaceHueCanvasColor(color: HueCanvasPaletteColor | undefined, usage: Map<string, number>) {
  return Boolean(color && (usage.get(color.hex) ?? 0) < color.usableCells)
}

export function toHueCanvasCellIndex(x: number, y: number) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= HUE_CANVAS_LOGICAL_SIZE || y >= HUE_CANVAS_LOGICAL_SIZE) return null
  return y * HUE_CANVAS_LOGICAL_SIZE + x
}

export function createHueCanvasRecipe(ownerId: string): HueCanvasRecipe {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    ownerId,
    title: '새 자유 캔버스',
    cells: [],
    viewport: { zoom: 18, offsetX: 0, offsetY: 0 },
    createdAt: now,
    updatedAt: now,
    version: 1,
  }
}
