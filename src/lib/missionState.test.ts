import { describe, expect, it } from 'vitest'

import { getMission } from '@/lib/mission'
import { loadDailyMissionState, saveDailyMissionState } from '@/lib/missionState'
import { createMissionPackSelection } from '@/lib/missionPacks'

describe('daily mission state', () => {
  it('persists a user and local-date scoped selection before any photo exists', () => {
    const mission = getMission('clear', 'day', 'live', 0)
    saveDailyMissionState('user-a', { localDate: '2026-07-23', mission, rerollCount: 3, selectedAt: '2026-07-23T10:00:00.000Z' })
    expect(loadDailyMissionState('user-a', '2026-07-23')?.rerollCount).toBe(3)
    expect(loadDailyMissionState('user-a', '2026-07-24')).toBeNull()
    expect(loadDailyMissionState('user-b', '2026-07-23')).toBeNull()
  })

  it('normalizes legacy state with no missionPack field to explicit free mode, and never carries a pack to a new date', () => {
    const mission = getMission('clear', 'day', 'live', 0)
    // Simulate a pre-M4 record with no missionPack field at all.
    saveDailyMissionState('user-c', { localDate: '2026-07-23', mission, rerollCount: 0, selectedAt: '2026-07-23T10:00:00.000Z' })
    expect(loadDailyMissionState('user-c', '2026-07-23')?.missionPack).toEqual({ id: null, version: 1 })

    saveDailyMissionState('user-c', { localDate: '2026-07-24', mission, rerollCount: 0, selectedAt: '2026-07-24T09:00:00.000Z', missionPack: createMissionPackSelection('commute-hunt') })
    // A brand-new date's state is independent; loading a different date never inherits yesterday's pack.
    expect(loadDailyMissionState('user-c', '2026-07-25')).toBeNull()
    expect(loadDailyMissionState('user-c', '2026-07-24')?.missionPack).toEqual({ id: 'commute-hunt', version: 1 })
  })
})
