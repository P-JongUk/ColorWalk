import { describe, expect, it } from 'vitest'

import { canPlaceHueCanvasColor, getHueCanvasColorUsage, getHueCanvasPalette, HUE_CANVAS_CELLS_PER_COMPLETED_PAGE, toHueCanvasCellIndex } from '@/lib/hueCanvas'
import type { Post } from '@/types'

function post(id: string, hex: string, imageCount: number): Post {
  return {
    id,
    user_id: 'user',
    created_at: '2026-07-26T00:00:00.000Z',
    local_date: `2026-07-${id.padStart(2, '0')}`,
    mission_hex: hex,
    captured_hex: hex,
    match_rate: 0,
    image_path: 'image.webp',
    custom_color_name: '세이지 그린',
    journal_answer: null,
    locale: 'ko',
    weather_code: null,
    weather_group: 'clear',
    time_bucket: 'day',
    mission_label: null,
    mission_prompt: null,
    abuse_warning: false,
    grid_images: Array.from({ length: imageCount }, (_, index) => ({ id: `${id}-${index}`, slot: index < 4 ? index : index + 1, path: `${id}-${index}.webp`, source: 'camera' as const, createdAt: null })),
  }
}

describe('Hue Canvas palette contract', () => {
  it('grants eight cells only for each completed 3x3 and returns capacity after erase', () => {
    const palette = getHueCanvasPalette([post('1', '#8bc6e8', 8), post('2', '#8BC6E8', 8), post('3', '#8BC6E8', 7)])
    expect(palette).toEqual([expect.objectContaining({ hex: '#8BC6E8', completedPages: 2, usableCells: 16, sourcePostIds: ['1', '2'] })])
    expect(HUE_CANVAS_CELLS_PER_COMPLETED_PAGE).toBe(8)
    const usage = getHueCanvasColorUsage([[0, '#8BC6E8'], [1, '#8BC6E8']])
    expect(canPlaceHueCanvasColor(palette[0], usage)).toBe(true)
    usage.delete('#8BC6E8')
    expect(canPlaceHueCanvasColor(palette[0], usage)).toBe(true)
  })

  it('keeps the 256×256 sparse coordinate boundary', () => {
    expect(toHueCanvasCellIndex(255, 255)).toBe(65_535)
    expect(toHueCanvasCellIndex(256, 0)).toBeNull()
  })
})
