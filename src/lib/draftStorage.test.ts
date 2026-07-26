import { describe, expect, it } from 'vitest'

import { buildDraftRecords } from '@/lib/draftStorage'
import type { CaptureDraft } from '@/types'

function legacyDraft(imageCount: number): CaptureDraft {
  return {
    localDate: '2026-07-26',
    abuseWarning: false,
    mission: {
      id: 'blue', hex: '#123456', weatherGroup: 'clear', timeBucket: 'day', source: 'fallback',
      label: { ko: '파랑', en: 'Blue' }, prompt: { ko: '파랑을 찾아요', en: 'Find blue' }, hint: { ko: '힌트', en: 'Hint' },
    },
    journal: { colorName: '파랑', journalAnswer: '오늘의 색 기록', storyDesign: { templateId: 'soft-passport', stickers: [] } },
    gridImages: Array.from({ length: imageCount }, (_, index) => ({
      id: `legacy-${index + 1}`,
      slot: index,
      imageBlob: new Blob([`photo-${index + 1}`], { type: 'image/jpeg' }),
      width: 100,
      height: 100,
      bytes: 10,
      quality: null,
      source: 'camera' as const,
      createdAt: `2026-07-26T0${index}:00:00.000Z`,
      colorHex: '#123456',
    })),
  }
}

describe('legacy daily record promotion shape', () => {
  it.each([1, 7, 8])('keeps %i photos, date, journal, and stable asset ids', (imageCount) => {
    const draft = legacyDraft(imageCount)
    const { daily, assets } = buildDraftRecords(draft, 'owner-1')

    expect(daily).toMatchObject({
      key: 'daily-record:owner-1:2026-07-26',
      kind: 'daily-record',
      localDate: '2026-07-26',
      journal: { journalAnswer: '오늘의 색 기록' },
    })
    expect(daily.gridImages).toHaveLength(imageCount)
    expect(assets).toHaveLength(imageCount)
    expect(assets.map((asset) => asset.assetId)).toEqual(draft.gridImages.map((image) => image.id))
    expect(new Set(assets.map((asset) => asset.key)).size).toBe(imageCount)
  })

  it('is idempotent for the same legacy record', () => {
    const draft = legacyDraft(8)
    expect(buildDraftRecords(draft, 'owner-1')).toEqual(buildDraftRecords(draft, 'owner-1'))
  })
})
