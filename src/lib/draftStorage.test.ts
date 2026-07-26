import { describe, expect, it } from 'vitest'

import { buildDraftRecords, getMasterCleanupAvailability, getMasterCleanupLifecycle, recoverMasterCleanupLifecycle, resolvePendingMasterCleanup, withMasterCleanupLifecycle } from '@/lib/draftStorage'
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

  it('keeps a cleaned asset as an intentional no-master state', () => {
    const draft = legacyDraft(1)
    draft.recordLifecycle = 'closed'
    draft.localRevision = 2
    draft.serverRevision = 2
    draft.gridImages[0] = {
      ...draft.gridImages[0],
      uploadPath: 'owner-1/2026-07-26/legacy-1-preview-v1.webp',
      masterState: 'ready',
      masterCleanupLifecycle: 'cleaned',
      masterBytes: 1234,
      imageBlob: undefined,
    }

    const { daily, assets } = buildDraftRecords(draft, 'owner-1')
    expect(daily).toMatchObject({
      localRevision: 2,
      serverRevision: 2,
      journal: { journalAnswer: draft.journal?.journalAnswer },
      gridImages: [{ uploadPath: 'owner-1/2026-07-26/legacy-1-preview-v1.webp', masterCleanupLifecycle: 'cleaned' }],
    })
    expect(assets[0]).toMatchObject({ masterCleanupLifecycle: 'cleaned' })
    expect(assets[0].masterBlob).toBeUndefined()
    expect(assets[0].masterPath).toBeUndefined()
    expect(getMasterCleanupAvailability(draft)).toMatchObject({ eligible: false, reason: 'cleaned' })
  })

  it('keeps cleanup separate from sync and retries only remaining ready masters', () => {
    const draft = legacyDraft(2)
    draft.recordLifecycle = 'closed'
    draft.localRevision = 2
    draft.serverRevision = 2
    draft.gridImages = draft.gridImages.map((image, index) => ({
      ...image,
      uploadPath: `owner-1/2026-07-26/${image.id}-preview-v1.webp`,
      masterState: 'ready' as const,
      masterCleanupLifecycle: index === 0 ? 'cleaned' as const : 'ready' as const,
      masterBytes: index === 0 ? 100 : 200,
    }))

    expect(getMasterCleanupLifecycle({ ...draft.gridImages[1], masterCleanupLifecycle: undefined })).toBe('ready')
    expect(getMasterCleanupAvailability(draft)).toMatchObject({ eligible: true, masterCount: 1, masterBytes: 200 })
    expect(recoverMasterCleanupLifecycle('cleanup-pending', true)).toBe('ready')
    expect(recoverMasterCleanupLifecycle('cleanup-pending', false)).toBe('cleaned')
  })

  it('separates a partial Android deletion failure and retains daily metadata', () => {
    const draft = legacyDraft(2)
    draft.recordLifecycle = 'closed'
    draft.localRevision = 3
    draft.serverRevision = 3
    draft.gridImages = draft.gridImages.map((image) => ({
      ...image,
      uploadPath: `owner-1/2026-07-26/${image.id}-preview-v1.webp`,
      masterState: 'ready' as const,
      masterCleanupLifecycle: 'ready' as const,
      masterBytes: 200,
    }))

    const firstCleaned = withMasterCleanupLifecycle(draft, 'legacy-1', 'cleaned')
    const secondPending = withMasterCleanupLifecycle(firstCleaned, 'legacy-2', 'cleanup-pending')
    const recovered = resolvePendingMasterCleanup(secondPending, 'legacy-2', true)

    expect(recovered.gridImages.map((image) => image.masterCleanupLifecycle)).toEqual(['cleaned', 'ready'])
    expect(getMasterCleanupAvailability(recovered)).toMatchObject({ eligible: true, masterCount: 1, masterBytes: 200 })
    expect(recovered).toMatchObject({
      localRevision: 3,
      serverRevision: 3,
      journal: { journalAnswer: draft.journal?.journalAnswer, storyDesign: draft.journal?.storyDesign },
      gridImages: [
        { uploadPath: draft.gridImages[0].uploadPath, masterCleanupLifecycle: 'cleaned' },
        { uploadPath: draft.gridImages[1].uploadPath, masterCleanupLifecycle: 'ready' },
      ],
    })
  })
})
