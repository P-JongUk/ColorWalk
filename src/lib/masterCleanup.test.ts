import { describe, expect, it, vi } from 'vitest'

import { runMasterCleanupAfterPreviewVerification, verifySyncedPreviewRecord } from '@/lib/masterCleanup'
import type { CaptureDraft, Post } from '@/types'

function draft(): CaptureDraft {
  return {
    localDate: '2026-07-26',
    abuseWarning: false,
    recordLifecycle: 'closed',
    localRevision: 2,
    serverRevision: 2,
    mission: {
      id: 'blue', hex: '#123456', weatherGroup: 'clear', timeBucket: 'day', source: 'fallback',
      label: { ko: '파랑', en: 'Blue' }, prompt: { ko: '파랑을 찾아요', en: 'Find blue' }, hint: { ko: '힌트', en: 'Hint' },
    },
    gridImages: [{
      id: 'asset-1', assetId: 'asset-1', slot: 0, width: 100, height: 100, bytes: 100, quality: null,
      source: 'camera', createdAt: '2026-07-26T10:00:00.000Z', uploadPath: 'owner/2026-07-26/asset-1-preview-v1.webp',
      masterState: 'ready', masterCleanupLifecycle: 'ready', masterBytes: 100,
    }],
  }
}

function post(): Post {
  return {
    id: 'post-1', user_id: 'owner', created_at: '2026-07-26T10:00:00.000Z', local_date: '2026-07-26',
    mission_hex: '#123456', captured_hex: '#123456', match_rate: 0, image_path: 'owner/2026-07-26/asset-1-preview-v1.webp',
    custom_color_name: null, journal_answer: '기록', locale: 'ko', weather_code: null, weather_group: 'clear', time_bucket: 'day',
    mission_label: '파랑', mission_prompt: '파랑을 찾아요', abuse_warning: false,
    story_template_id: 'soft-passport', story_stickers: [],
    grid_images: [{ id: 'asset-1', slot: 0, path: 'owner/2026-07-26/asset-1-preview-v1.webp', signedUrl: 'https://preview.example/asset-1', source: 'camera', createdAt: '2026-07-26T10:00:00.000Z' }],
    client_meta: {},
  }
}

describe('master cleanup preview preflight', () => {
  it('does not invoke cleanup when a server preview cannot be read', async () => {
    const cleanup = vi.fn(async () => draft())

    await expect(runMasterCleanupAfterPreviewVerification({
      draft: draft(), posts: [post()], readPreview: async () => false, cleanup,
    })).rejects.toThrow('미리보기')

    expect(cleanup).not.toHaveBeenCalled()
  })

  it('requires matching date, asset paths, and readable signed previews before cleanup', async () => {
    const readPreview = vi.fn(async () => true)
    await expect(verifySyncedPreviewRecord(draft(), [post()], readPreview)).resolves.toBeUndefined()
    expect(readPreview).toHaveBeenCalledWith('https://preview.example/asset-1')
  })
})
