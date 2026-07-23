import { describe, expect, it } from 'vitest'

import { mergeDailyRecords } from '@/lib/dailyRecord'
import { getUnlockedBadges } from '@/lib/collection'
import { getMission } from '@/lib/mission'
import type { CaptureDraft, Post } from '@/types'

function draft(count: number): CaptureDraft {
  return {
    mission: getMission('clear', 'day', 'live', 0),
    localDate: '2026-07-23',
    lockedAt: '2026-07-23T10:00:00.000Z',
    abuseWarning: false,
    gridImages: Array.from({ length: count }, (_, index) => ({
      id: `local-${index}`,
      slot: index < 4 ? index : index + 1,
      previewUrl: `blob:${index}`,
      imageBlob: new Blob(['photo']),
      width: 1,
      height: 1,
      bytes: 5,
      quality: 1,
      source: 'camera' as const,
      createdAt: '2026-07-23T10:00:00.000Z',
    })),
  }
}

describe('daily record merge', () => {
  it('uses the latest local record over the server record and counts a local completed page once', () => {
    const server = { id: 'server', user_id: 'user', created_at: '2026-07-23T10:00:00Z', local_date: '2026-07-23', mission_hex: '#8BC6E8', captured_hex: '#8BC6E8', match_rate: 0, image_path: 'one.webp', custom_color_name: null, journal_answer: null, locale: 'ko', weather_code: 0, weather_group: 'clear', time_bucket: 'day', mission_label: null, mission_prompt: null, abuse_warning: false } satisfies Post
    const merged = mergeDailyRecords([server], [draft(8)], 'user', 'ko')
    expect(merged).toHaveLength(1)
    expect(getUnlockedBadges(merged).find((badge) => badge.days === 3)?.completedGrids).toBe(1)
  })
})
