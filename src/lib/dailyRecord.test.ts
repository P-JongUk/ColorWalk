import { describe, expect, it } from 'vitest'

import { draftToDailyPost, finalizeOpenRecord, findOpenPastRecords, mergeDailyRecords } from '@/lib/dailyRecord'
import { getUnlockedBadges } from '@/lib/collection'
import { getMission } from '@/lib/mission'
import { createMissionPackSelection, readMissionPackFromClientMeta } from '@/lib/missionPacks'
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

  it('keeps a cleaned local master on the synced preview path instead of recreating staging', () => {
    const local = draft(1)
    local.localRevision = 2
    local.serverRevision = 2
    local.recordLifecycle = 'closed'
    local.gridImages[0] = {
      ...local.gridImages[0],
      imageBlob: undefined,
      previewUrl: undefined,
      uploadPath: 'owner/2026-07-23/local-0-preview-v1.webp',
      masterState: 'ready',
      masterCleanupLifecycle: 'cleaned',
    }
    const server = { id: 'server', user_id: 'user', created_at: '2026-07-23T10:00:00Z', local_date: '2026-07-23', mission_hex: '#8BC6E8', captured_hex: '#8BC6E8', match_rate: 0, image_path: 'owner/2026-07-23/local-0-preview-v1.webp', custom_color_name: null, journal_answer: null, locale: 'ko', weather_code: 0, weather_group: 'clear', time_bucket: 'day', mission_label: null, mission_prompt: null, abuse_warning: false, grid_images: [{ id: 'local-0', slot: 0, path: 'owner/2026-07-23/local-0-preview-v1.webp', signedUrl: 'https://preview.example/local-0' }], client_meta: {} } satisfies Post

    const merged = mergeDailyRecords([server], [local], 'user', 'ko')
    expect(merged[0].grid_images?.[0]?.path).toBe('owner/2026-07-23/local-0-preview-v1.webp')
    expect(merged[0].grid_images?.[0]?.signedUrl).toBe('https://preview.example/local-0')
    expect(merged[0].client_meta?.localSyncState).toBe('synced')
  })
})

describe('daily record finalization', () => {
  it('finalizes an open record with closedAt, closed lifecycle, and a finalized pack selection', () => {
    const open = { ...draft(3), missionPack: createMissionPackSelection('indoor-hunt') }
    const finalized = finalizeOpenRecord(open, '2026-07-24T00:00:00.000Z')

    expect(finalized.recordLifecycle).toBe('closed')
    expect(finalized.closedAt).toBe('2026-07-24T00:00:00.000Z')
    expect(finalized.missionPack).toEqual({ id: 'indoor-hunt', version: 1, finalizedAt: '2026-07-24T00:00:00.000Z' })
    expect(finalized.localRevision).toBe((open.localRevision ?? 0) + 1)
  })

  it('is idempotent: re-finalizing an already-closed record is a no-op', () => {
    const open = draft(2)
    const finalized = finalizeOpenRecord(open, '2026-07-24T00:00:00.000Z')
    const reFinalized = finalizeOpenRecord(finalized, '2026-07-25T00:00:00.000Z')

    expect(reFinalized).toBe(finalized)
    expect(reFinalized.closedAt).toBe('2026-07-24T00:00:00.000Z')
  })

  it('finalizes a free-mode (no pack) record as an explicit id:null selection', () => {
    const finalized = finalizeOpenRecord(draft(1), '2026-07-24T00:00:00.000Z')
    expect(finalized.missionPack).toEqual({ id: null, version: 1, finalizedAt: '2026-07-24T00:00:00.000Z' })
  })

  it('finds only open records strictly before today, leaving today and already-closed records alone', () => {
    const openYesterday = { ...draft(2), localDate: '2026-07-22' }
    const openTwoDaysAgo = { ...draft(1), localDate: '2026-07-21' }
    const closedYesterday = { ...draft(3), localDate: '2026-07-22', recordLifecycle: 'closed' as const, closedAt: '2026-07-22T23:00:00.000Z' }
    const openToday = { ...draft(2), localDate: '2026-07-23' }

    const openPast = findOpenPastRecords([openYesterday, openTwoDaysAgo, closedYesterday, openToday], '2026-07-23')
    expect(openPast.map((record) => record.localDate).sort()).toEqual(['2026-07-21', '2026-07-22'])
  })

  it('carries the finalized pack into the v2 colorHunt Post metadata after lazy finalization', () => {
    const open = { ...draft(5), localDate: '2026-07-22', missionPack: createMissionPackSelection('rainy-window') }
    const finalized = finalizeOpenRecord(open, '2026-07-23T00:05:00.000Z')
    const post = draftToDailyPost(finalized, 'user', 'ko')
    const missionPack = readMissionPackFromClientMeta(post.client_meta)

    expect(missionPack).toEqual({ id: 'rainy-window', version: 1, finalizedAt: '2026-07-23T00:05:00.000Z' })
    expect((post.client_meta?.colorHunt as { status: string }).status).toBe('recorded')
  })
})
