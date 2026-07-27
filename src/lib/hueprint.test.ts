import { beforeEach, describe, expect, it } from 'vitest'

import {
  getWeekKey,
  getWeeklyHueprint,
  getWeekNavigation,
  isInvalidOnlyWeek,
  loadHueprintCoverPreference,
  resolveHueprintCover,
  saveHueprintCoverPreference,
} from '@/lib/hueprint'
import type { GridImage, Post } from '@/types'

function images(count: number): GridImage[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `image-${index}`,
    slot: index < 4 ? index : index + 1,
    path: `photo-${index}.webp`,
    signedUrl: `https://cdn.example/${index}.webp`,
  }))
}

function post(localDate: string, missionHex: string, photoCount = 1, overrides: Partial<Post> = {}): Post {
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
    grid_images: images(photoCount),
    ...overrides,
  }
}

describe('getWeekKey', () => {
  it('resolves the Monday of the week for any weekday, including Sunday', () => {
    expect(getWeekKey(new Date('2026-07-27T12:00:00'))).toBe('2026-07-27') // Monday
    expect(getWeekKey(new Date('2026-07-29T12:00:00'))).toBe('2026-07-27') // Wednesday
    expect(getWeekKey(new Date('2026-08-02T12:00:00'))).toBe('2026-07-27') // Sunday, same week
    expect(getWeekKey(new Date('2026-08-03T12:00:00'))).toBe('2026-08-03') // next Monday
  })

  it('handles month and year boundaries', () => {
    expect(getWeekKey(new Date('2026-01-01T12:00:00'))).toBe('2025-12-29') // Thursday, week starts prior year
    expect(getWeekKey(new Date('2026-03-01T12:00:00'))).toBe('2026-02-23')
  })
})

describe('getWeeklyHueprint - canonical mission_hex-only contract', () => {
  it('derives palette, recorded/completed counts, accent, and default cover from mixed valid records only', () => {
    const posts = [
      post('2026-07-27', '#8bc6e8', 2), // Monday, partial
      post('2026-07-29', 'not-a-color', 5), // invalid mission_hex, excluded entirely
      post('2026-07-30', '#FF00AA', 8), // completed
      post('2026-08-03', '#111111', 1), // next week, excluded
    ]

    const week = getWeeklyHueprint(posts, '2026-07-27', '2026-07-30')

    expect(week.days.map((day) => day.localDate)).toEqual(['2026-07-27', '2026-07-30'])
    expect(week.palette).toEqual(['#8BC6E8', '#FF00AA'])
    expect(week.recordedDayCount).toBe(2)
    expect(week.completedGridCount).toBe(1)
    expect(week.photoCount).toBe(10)
    expect(week.accentHex).toBe('#FF00AA') // most recent valid record
    expect(week.defaultCover?.postLocalDate).toBe('2026-07-30') // most recent valid record, first restorable photo
  })

  it('never substitutes captured_hex, image pixels, or any other fallback for an invalid mission_hex', () => {
    const posts = [post('2026-07-27', 'zzzzzz', 3, { captured_hex: '#123456' })]
    const week = getWeeklyHueprint(posts, '2026-07-27', '2026-07-30')
    expect(week.days).toHaveLength(0)
    expect(week.palette).toHaveLength(0)
    expect(week.accentHex).toBeNull()
    expect(week.defaultCover).toBeNull()
  })

  it('includes today\'s open 1-7 photo record in the current week and grows as photos are added', () => {
    const today = '2026-07-29'
    const partial = getWeeklyHueprint([post(today, '#8BC6E8', 2)], '2026-07-27', today)
    expect(partial.recordedDayCount).toBe(1)
    expect(partial.completedGridCount).toBe(0)

    const grown = getWeeklyHueprint([post(today, '#8BC6E8', 8)], '2026-07-27', today)
    expect(grown.completedGridCount).toBe(1)
  })

  it('excludes a future-dated record even if it has a valid mission_hex', () => {
    const week = getWeeklyHueprint([post('2026-07-31', '#8BC6E8', 3)], '2026-07-27', '2026-07-29')
    expect(week.days).toHaveLength(0)
  })
})

describe('week navigation', () => {
  it('never opens a future week and disables previous before the oldest valid record', () => {
    const posts = [post('2026-07-13', '#8BC6E8', 8)]
    const currentWeekKey = getWeekKey(new Date('2026-07-29T12:00:00'))
    const nav = getWeekNavigation(posts, currentWeekKey, '2026-07-29')
    expect(nav.canGoNext).toBe(false)
    expect(nav.nextWeekKey).toBeNull()

    const oldestWeekNav = getWeekNavigation(posts, '2026-07-13', '2026-07-29')
    expect(oldestWeekNav.canGoPrevious).toBe(false)
    expect(oldestWeekNav.previousWeekKey).toBeNull()
  })
})

describe('isInvalidOnlyWeek', () => {
  it('distinguishes an invalid-mission_hex-only week from a plain no-record week', () => {
    const invalidOnly = [post('2026-07-28', 'not-a-color', 3)]
    expect(isInvalidOnlyWeek(invalidOnly, '2026-07-27', '2026-07-29')).toBe(true)
    expect(isInvalidOnlyWeek([], '2026-07-27', '2026-07-29')).toBe(false)
    expect(isInvalidOnlyWeek([post('2026-07-28', '#8BC6E8', 3)], '2026-07-27', '2026-07-29')).toBe(false)
  })
})

describe('local cover preference', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips a saved preference for the same owner/week', () => {
    const week = getWeeklyHueprint([post('2026-07-27', '#8BC6E8', 3), post('2026-07-28', '#FF00AA', 8)], '2026-07-27', '2026-07-30')
    const chosen = week.coverCandidates.find((cover) => cover.postLocalDate === '2026-07-27')!
    expect(saveHueprintCoverPreference('owner-1', week.weekKey, chosen)).toBe(true)
    expect(loadHueprintCoverPreference('owner-1', week)).toEqual(chosen)
    expect(resolveHueprintCover('owner-1', week)).toEqual(chosen)
  })

  it('ignores a stale preference pointing at a deleted photo and falls back to the default cover', () => {
    const week = getWeeklyHueprint([post('2026-07-27', '#8BC6E8', 3)], '2026-07-27', '2026-07-30')
    localStorage.setItem('hueday:hueprint-cover:v1:owner-1:2026-07-27', JSON.stringify({ version: 1, postLocalDate: '2026-07-27', imageId: 'deleted-image' }))
    expect(loadHueprintCoverPreference('owner-1', week)).toBeNull()
    expect(resolveHueprintCover('owner-1', week)).toEqual(week.defaultCover)
  })

  it('ignores malformed preference JSON without throwing', () => {
    const week = getWeeklyHueprint([post('2026-07-27', '#8BC6E8', 3)], '2026-07-27', '2026-07-30')
    localStorage.setItem('hueday:hueprint-cover:v1:owner-1:2026-07-27', '{not-json')
    expect(() => loadHueprintCoverPreference('owner-1', week)).not.toThrow()
    expect(loadHueprintCoverPreference('owner-1', week)).toBeNull()
  })

  it('keeps preferences isolated per owner and per week', () => {
    const week = getWeeklyHueprint([post('2026-07-27', '#8BC6E8', 3)], '2026-07-27', '2026-07-30')
    const cover = week.coverCandidates[0]
    saveHueprintCoverPreference('owner-1', week.weekKey, cover)
    expect(loadHueprintCoverPreference('owner-2', week)).toBeNull()

    const otherWeek = getWeeklyHueprint([post('2026-08-03', '#8BC6E8', 3)], '2026-08-03', '2026-08-05')
    expect(loadHueprintCoverPreference('owner-1', otherWeek)).toBeNull()
  })
})
