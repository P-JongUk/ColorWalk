import { describe, expect, it } from 'vitest'

import { getMonthlyCollection, getMoodColorSuggestions, getUnlockedBadges } from '@/lib/collection'
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
