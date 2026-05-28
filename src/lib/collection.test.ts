import { describe, expect, it } from 'vitest'

import { getCurrentStreak, getMonthlyCollection, getMoodColorSuggestions, getUnlockedBadges } from '@/lib/collection'
import type { Post } from '@/types'

function post(local_date: string, captured_hex = '#FF6B61'): Post {
  return {
    id: local_date,
    user_id: 'user',
    created_at: `${local_date}T00:00:00Z`,
    local_date,
    mission_hex: '#8BC6E8',
    captured_hex,
    match_rate: 88,
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
  it('calculates current streak from today backwards', () => {
    const today = new Date('2026-05-28T12:00:00')
    expect(getCurrentStreak([post('2026-05-28'), post('2026-05-27'), post('2026-05-25')], today)).toBe(2)
  })

  it('unlocks streak badges at thresholds', () => {
    expect(getUnlockedBadges(7).map((badge) => badge.unlocked)).toEqual([true, true, false, false])
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
