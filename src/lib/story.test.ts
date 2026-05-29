import { describe, expect, it } from 'vitest'

import { createStickerItem, normalizeTemplateId, parseStoryStickers, STORY_TEMPLATES } from '@/lib/story'

describe('story helpers', () => {
  it('normalizes unknown template ids', () => {
    expect(normalizeTemplateId('passport')).toBe('soft-passport')
    expect(normalizeTemplateId('life-cut')).toBe('life-cut')
    expect(normalizeTemplateId('unknown')).toBe('soft-passport')
    expect(STORY_TEMPLATES).toHaveLength(8)
  })

  it('parses sticker layouts defensively', () => {
    const stickers = parseStoryStickers([
      { uid: 'a', stickerId: 'word-good-day', x: 120, y: -10, scale: 5, rotation: 90 },
      { nope: true },
    ])

    expect(stickers).toHaveLength(1)
    expect(stickers[0]).toMatchObject({ x: 94, y: 4, scale: 2.2, rotation: 32 })
  })

  it('creates bounded default sticker items', () => {
    const sticker = createStickerItem('soft-cloud', 2)

    expect(sticker.stickerId).toBe('soft-cloud')
    expect(sticker.x).toBeGreaterThanOrEqual(0)
    expect(sticker.y).toBeGreaterThanOrEqual(0)
  })
})
