import { createFreeModeSelection, parseMissionPackSelection } from '@/lib/missionPacks'
import type { Mission, MissionPackSelection } from '@/types'

const PREFIX = 'colorwalk:daily-mission'

export type DailyMissionState = {
  localDate: string
  mission: Mission
  rerollCount: number
  shownMissionIds?: string[]
  selectedAt: string
  lockedAt?: string
  /** Absent on pre-M4 state read back from storage; callers should treat that as free mode. */
  missionPack?: MissionPackSelection
}

function key(userId: string, localDate: string) {
  return `${PREFIX}:${userId}:${localDate}`
}

export function loadDailyMissionState(userId: string, localDate: string) {
  try {
    const value = localStorage.getItem(key(userId, localDate))
    if (!value) return null
    const parsed = JSON.parse(value) as DailyMissionState
    // Legacy state (pre-M4) has no missionPack field. Normalize it to explicit free mode
    // so callers never need to special-case "field absent" vs "free mode".
    return { ...parsed, shownMissionIds: Array.from(new Set([...(parsed.shownMissionIds ?? []), parsed.mission.id])), missionPack: parseMissionPackSelection(parsed.missionPack) ?? createFreeModeSelection() }
  } catch {
    return null
  }
}

export function saveDailyMissionState(userId: string, state: DailyMissionState) {
  localStorage.setItem(key(userId, state.localDate), JSON.stringify(state))
}
