import { describe, expect, it } from 'vitest'

import { getMission } from '@/lib/mission'
import { loadDailyMissionState, saveDailyMissionState } from '@/lib/missionState'

describe('daily mission state', () => {
  it('persists a user and local-date scoped selection before any photo exists', () => {
    const mission = getMission('clear', 'day', 'live', 0)
    saveDailyMissionState('user-a', { localDate: '2026-07-23', mission, rerollCount: 3, selectedAt: '2026-07-23T10:00:00.000Z' })
    expect(loadDailyMissionState('user-a', '2026-07-23')?.rerollCount).toBe(3)
    expect(loadDailyMissionState('user-a', '2026-07-24')).toBeNull()
    expect(loadDailyMissionState('user-b', '2026-07-23')).toBeNull()
  })
})
