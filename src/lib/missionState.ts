import type { Mission } from '@/types'

const PREFIX = 'colorwalk:daily-mission'

export type DailyMissionState = {
  localDate: string
  mission: Mission
  rerollCount: number
  selectedAt: string
  lockedAt?: string
}

function key(userId: string, localDate: string) {
  return `${PREFIX}:${userId}:${localDate}`
}

export function loadDailyMissionState(userId: string, localDate: string) {
  try {
    const value = localStorage.getItem(key(userId, localDate))
    return value ? JSON.parse(value) as DailyMissionState : null
  } catch {
    return null
  }
}

export function saveDailyMissionState(userId: string, state: DailyMissionState) {
  localStorage.setItem(key(userId, state.localDate), JSON.stringify(state))
}
