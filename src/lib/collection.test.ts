import { describe, expect, it } from 'vitest'

import { getHueprintDetailTier, getMissionPackCollections, getMonthlyCollection, getMoodColorSuggestions, getUnlockedBadges } from '@/lib/collection'
import { buildColorHuntMeta, createFreeModeSelection, createMissionPackSelection, finalizeMissionPackSelection } from '@/lib/missionPacks'
import type { Post } from '@/types'

function post(local_date: string, mission_hex = '#8BC6E8'): Post {
  return {
    id: local_date,
    user_id: 'user',
    created_at: `${local_date}T00:00:00Z`,
    local_date,
    mission_hex,
    captured_hex: mission_hex,
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
  }
}

describe('collection helpers', () => {
  it('unlocks badges only from completed 8-photo pages', () => {
    const completed = Array.from({ length: 3 }, (_, index) => ({
      ...post(`2026-05-${String(index + 1).padStart(2, '0')}`),
      grid_images: Array.from({ length: 8 }, (_, slot) => ({ id: `${index}-${slot}`, slot: slot < 4 ? slot : slot + 1, path: `image-${index}-${slot}.webp` })),
    }))
    const partial = { ...post('2026-05-04'), grid_images: [{ id: 'partial', slot: 0, path: 'partial.webp' }] }
    expect(getUnlockedBadges([...completed, partial]).map((badge) => badge.unlocked)).toEqual([true, false, false, false])
  })

  it('collects colors for the visible month', () => {
    const monthly = getMonthlyCollection(
      [post('2026-05-01', '#111111'), post('2026-06-01', '#222222')],
      new Date('2026-05-28T12:00:00'),
    )

    expect(monthly.count).toBe(1)
    expect(monthly.colors).toEqual(['#111111'])
  })

  it('returns localized color name suggestions', () => {
    const ko = getMoodColorSuggestions('#8BC6E8', 'ko')
    const en = getMoodColorSuggestions('#8BC6E8', 'en')

    expect(ko).toHaveLength(4)
    expect(en).toHaveLength(4)
    expect(new Set(ko).size).toBe(4)
    expect(new Set(en).size).toBe(4)
    expect(ko.every((name) => name.length > 2)).toBe(true)
    expect(en.every((name) => name.length > 2)).toBe(true)
  })
})

function completedPosts(count: number): Post[] {
  return Array.from({ length: count }, (_, index) => ({
    ...post(`2026-${String(1 + (index % 12)).padStart(2, '0')}-${String(1 + (index % 28)).padStart(2, '0')}`),
    id: `completed-${index}`,
    grid_images: Array.from({ length: 8 }, (_, slot) => ({ id: `${index}-${slot}`, slot: slot < 4 ? slot : slot + 1, path: `image-${index}-${slot}.webp` })),
  }))
}

describe('getHueprintDetailTier', () => {
  it.each([
    [0, 0], [2, 0], [3, 1], [6, 1], [7, 2], [13, 2], [14, 3], [29, 3], [30, 4], [31, 4],
  ] as const)('maps %s completed grids to tier %s', (completedCount, tier) => {
    expect(getHueprintDetailTier(completedPosts(completedCount))).toBe(tier)
  })

  it('never changes getUnlockedBadges results', () => {
    const posts = completedPosts(7)
    expect(getUnlockedBadges(posts).map((badge) => badge.unlocked)).toEqual([true, true, false, false])
  })
})

function postWithColorHunt(localDate: string, colorHunt: Record<string, unknown> | undefined, photoCount = 8): Post {
  return {
    ...post(localDate),
    grid_images: Array.from({ length: photoCount }, (_, slot) => ({ id: `${localDate}-${slot}`, slot: slot < 4 ? slot : slot + 1, path: `${localDate}-${slot}.webp` })),
    client_meta: colorHunt ? { colorHunt } : {},
  }
}

describe('mission pack collections', () => {
  it('counts only closed records with a finalized matching pack, per pack', () => {
    const finalizedIndoor = buildColorHuntMeta({ photoCount: 8, missionPack: finalizeMissionPackSelection(createMissionPackSelection('indoor-hunt'), '2026-07-25T00:00:00.000Z') })
    const finalizedIndoorPartial = buildColorHuntMeta({ photoCount: 3, missionPack: finalizeMissionPackSelection(createMissionPackSelection('indoor-hunt'), '2026-07-24T00:00:00.000Z') })
    const openIndoor = buildColorHuntMeta({ photoCount: 2, missionPack: createMissionPackSelection('indoor-hunt') })
    const finalizedFreeMode = buildColorHuntMeta({ photoCount: 8, missionPack: finalizeMissionPackSelection(createFreeModeSelection(), '2026-07-23T00:00:00.000Z') })

    const posts = [
      postWithColorHunt('2026-07-25', finalizedIndoor, 8),
      postWithColorHunt('2026-07-24', finalizedIndoorPartial, 3),
      postWithColorHunt('2026-07-26', openIndoor, 2),
      postWithColorHunt('2026-07-23', finalizedFreeMode, 8),
      postWithColorHunt('2026-07-22', undefined, 8),
      postWithColorHunt('2026-07-21', { version: 1, status: 'recorded', photoCount: 8 }, 8),
    ]

    const collections = getMissionPackCollections(posts)
    const indoor = collections.find((collection) => collection.id === 'indoor-hunt')
    const commute = collections.find((collection) => collection.id === 'commute-hunt')
    const rainyWindow = collections.find((collection) => collection.id === 'rainy-window')

    expect(indoor).toMatchObject({ closedCount: 2, completedCount: 1 })
    expect(commute).toMatchObject({ closedCount: 0, completedCount: 0 })
    expect(rainyWindow).toMatchObject({ closedCount: 0, completedCount: 0 })
  })

  it('returns all three packs with zero counts for an empty history', () => {
    expect(getMissionPackCollections([]).map((collection) => collection.id)).toEqual(['indoor-hunt', 'commute-hunt', 'rainy-window'])
    expect(getMissionPackCollections([]).every((collection) => collection.closedCount === 0 && collection.completedCount === 0)).toBe(true)
  })
})
