import { describe, expect, it } from 'vitest'

import { getColorVolumes, getDeckStage, getLivingHueDeckCards } from '@/lib/livingHueDeck'
import type { GridImage, Post } from '@/types'

function post(localDate: string, missionHex: string, images: GridImage[] = []): Post {
  return {
    id: localDate,
    user_id: 'user',
    created_at: `${localDate}T00:00:00Z`,
    local_date: localDate,
    mission_hex: missionHex,
    captured_hex: missionHex,
    match_rate: 0,
    image_path: '',
    custom_color_name: null,
    journal_answer: null,
    locale: 'ko',
    weather_code: null,
    weather_group: 'clear',
    time_bucket: 'day',
    mission_label: null,
    mission_prompt: null,
    abuse_warning: false,
    grid_images: images,
  }
}

function images(count: number): GridImage[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `image-${index}`,
    slot: index < 4 ? index : index + 1,
    path: `photo-${index}.webp`,
  }))
}

describe('Living Hue Deck', () => {
  it.each([
    [1, 1], [2, 1], [3, 3], [4, 3], [5, 5], [7, 5], [8, 8],
  ] as const)('derives %s photos as the %s-stage card', (count, stage) => {
    expect(getDeckStage(count)).toBe(stage)
  })

  it('uses the actual grid fallback count and canonicalizes normal hex casing for Color Volume', () => {
    const legacy = { ...post('2026-07-20', '#FF0000'), image_path: 'legacy.webp' }
    const fallbackGrid = { ...post('2026-07-20', '#ff0000'), grid_images: null, client_meta: { gridImages: images(5) } }
    const cards = getLivingHueDeckCards([
      legacy,
      fallbackGrid,
      post('2026-07-21', '#ff0000', images(8)),
      post('2026-07-22', '#FF0000', images(8)),
      post('2026-07-23', '#FF0001', images(8)),
    ])

    expect(cards.find((card) => card.post.local_date === '2026-07-20')?.photoCount).toBe(1)
    expect(cards.find((card) => card.post.local_date === '2026-07-20')?.stage).toBe(1)
    expect(cards.find((card) => card.post === fallbackGrid)?.photoCount).toBe(5)
    expect(cards.find((card) => card.post === fallbackGrid)?.stage).toBe(5)
    expect(getColorVolumes(cards).map((volume) => [volume.missionHex, volume.cards.length])).toEqual([
      ['#FF0001', 1], ['#FF0000', 2],
    ])
  })

  it('keeps local completed records in Color Volume while exposing their device-only state', () => {
    const local = {
      ...post('2026-07-24', '#8bc6e8', images(8)),
      id: 'local:user:2026-07-24',
      client_meta: { localSyncState: 'pending' },
    }
    const cards = getLivingHueDeckCards([local])

    expect(cards[0].syncState).toBe('pending')
    expect(getColorVolumes(cards)[0].cards).toHaveLength(1)
  })
})
