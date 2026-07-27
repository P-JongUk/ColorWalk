import { describe, expect, it } from 'vitest'

import {
  MISSION_PACKS,
  buildColorHuntMeta,
  createFreeModeSelection,
  finalizeMissionPackSelection,
  getRecommendedMissionPackId,
  mergeColorHuntIntoClientMeta,
  parseMissionPackSelection,
  readMissionPackFromClientMeta,
} from '@/lib/missionPacks'

describe('mission pack config', () => {
  it('has exactly three static packs', () => {
    expect(MISSION_PACKS.map((pack) => pack.id)).toEqual(['indoor-hunt', 'commute-hunt', 'rainy-window'])
  })

  it.each([
    ['rain', 'morning', 'rainy-window'],
    ['storm', 'day', 'rainy-window'],
    ['clear', 'morning', 'commute-hunt'],
    ['clouds', 'sunset', 'commute-hunt'],
    ['clear', 'day', 'indoor-hunt'],
    ['fog', 'night', 'indoor-hunt'],
  ] as const)('recommends %s for %s/%s without auto-selecting it', (weatherGroup, timeBucket, expected) => {
    expect(getRecommendedMissionPackId(weatherGroup, timeBucket)).toBe(expected)
  })
})

describe('mission pack selection parsing', () => {
  it('treats a missing field as null (legacy), distinct from explicit free mode', () => {
    expect(parseMissionPackSelection(undefined)).toBeNull()
    expect(parseMissionPackSelection(null)).toBeNull()
    expect(parseMissionPackSelection(createFreeModeSelection())).toEqual({ id: null, version: 1 })
  })

  it('parses a valid pack id and preserves finalizedAt', () => {
    expect(parseMissionPackSelection({ id: 'indoor-hunt', version: 1, finalizedAt: '2026-07-27T00:00:00.000Z' }))
      .toEqual({ id: 'indoor-hunt', version: 1, finalizedAt: '2026-07-27T00:00:00.000Z' })
  })

  it('falls back to free mode for an unknown id instead of inventing a pack', () => {
    expect(parseMissionPackSelection({ id: 'travel-hunt', version: 1 })).toEqual({ id: null, version: 1 })
  })

  it('finalizes a selection with a timestamp, defaulting to free mode when absent', () => {
    expect(finalizeMissionPackSelection(undefined, '2026-07-27T00:00:00.000Z')).toEqual({ id: null, version: 1, finalizedAt: '2026-07-27T00:00:00.000Z' })
    expect(finalizeMissionPackSelection({ id: 'commute-hunt', version: 1 }, '2026-07-27T00:00:00.000Z'))
      .toEqual({ id: 'commute-hunt', version: 1, finalizedAt: '2026-07-27T00:00:00.000Z' })
  })
})

describe('colorHunt v2 client_meta contract', () => {
  it('reads a v2 missionPack and returns null for v1/legacy/no-colorHunt records without inferring a pack', () => {
    const v2 = { colorHunt: { version: 2, status: 'recorded', photoCount: 3, missionPack: { id: 'indoor-hunt', version: 1 } } }
    expect(readMissionPackFromClientMeta(v2)).toEqual({ id: 'indoor-hunt', version: 1 })
    expect(readMissionPackFromClientMeta({ colorHunt: { version: 1, status: 'recorded', photoCount: 3 } })).toBeNull()
    expect(readMissionPackFromClientMeta({})).toBeNull()
    expect(readMissionPackFromClientMeta(null)).toBeNull()
  })

  it('builds v2 colorHunt meta with completed status only at 8 photos', () => {
    const missionPack = createFreeModeSelection()
    expect(buildColorHuntMeta({ photoCount: 7, missionPack }).status).toBe('recorded')
    expect(buildColorHuntMeta({ photoCount: 8, missionPack }).status).toBe('completed')
    expect(buildColorHuntMeta({ photoCount: 8, missionPack }).version).toBe(2)
  })

  it('deep-merges colorHunt without dropping unknown client_meta or unknown colorHunt sub-fields', () => {
    const existing = {
      app: 'colorwalk',
      unknownTopLevel: 'keep-me',
      colorHunt: { version: 1, status: 'recorded', photoCount: 2, unknownColorHuntField: 'keep-me-too' },
    }
    const next = buildColorHuntMeta({ photoCount: 3, missionPack: createFreeModeSelection() })
    const merged = mergeColorHuntIntoClientMeta(existing, next)

    expect(merged.app).toBe('colorwalk')
    expect(merged.unknownTopLevel).toBe('keep-me')
    expect((merged.colorHunt as Record<string, unknown>).unknownColorHuntField).toBe('keep-me-too')
    expect((merged.colorHunt as Record<string, unknown>).version).toBe(2)
    expect((merged.colorHunt as Record<string, unknown>).photoCount).toBe(3)
  })

  it('stores an explicit id:null for a free-mode finalized record, distinct from an absent field', () => {
    const meta = buildColorHuntMeta({ photoCount: 5, missionPack: createFreeModeSelection() })
    expect(meta.missionPack).toEqual({ id: null, version: 1 })
    expect(readMissionPackFromClientMeta({ colorHunt: meta })).toEqual({ id: null, version: 1 })
  })
})
