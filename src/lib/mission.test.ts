import { describe, expect, it } from 'vitest'

import { getDailyMission, getMission, getRandomMission, getTimeBucket, mapWeatherCodeToGroup } from '@/lib/mission'

describe('mission helpers', () => {
  it('maps Open-Meteo weather codes to supported groups', () => {
    expect(mapWeatherCodeToGroup(0)).toBe('clear')
    expect(mapWeatherCodeToGroup(3)).toBe('clouds')
    expect(mapWeatherCodeToGroup(61)).toBe('rain')
    expect(mapWeatherCodeToGroup(75)).toBe('snow')
    expect(mapWeatherCodeToGroup(95)).toBe('storm')
    expect(mapWeatherCodeToGroup(45)).toBe('fog')
  })

  it('maps local hours to expected buckets', () => {
    expect(getTimeBucket(new Date('2026-05-27T06:00:00'))).toBe('morning')
    expect(getTimeBucket(new Date('2026-05-27T13:00:00'))).toBe('day')
    expect(getTimeBucket(new Date('2026-05-27T18:00:00'))).toBe('sunset')
    expect(getTimeBucket(new Date('2026-05-27T23:00:00'))).toBe('night')
  })

  it('returns localized mission copy', () => {
    const mission = getMission('rain', 'night', 'live', 61)

    expect(mission.hex).toBe('#2F4F4F')
    expect(mission.label.ko).toBeTruthy()
    expect(mission.label.en).toBeTruthy()
    expect(mission.weatherCode).toBe(61)
  })

  it('rotates daily missions for the same weather and time bucket', () => {
    const ids = [
      '2026-05-28T08:00:00',
      '2026-05-29T08:00:00',
      '2026-05-30T08:00:00',
      '2026-05-31T08:00:00',
      '2026-06-01T08:00:00',
    ].map((date) => getDailyMission('rain', 'morning', 'live', 61, new Date(date)).id)

    expect(new Set(ids).size).toBeGreaterThan(1)
  })

  it('uses a deterministic RNG after three contextual rerolls and never keeps the current hex', () => {
    const contextual = getRandomMission('rain', 'morning', 'live', 61, { excludeHex: '#5F7F83', rng: () => 0 })
    const broad = getRandomMission('rain', 'morning', 'live', 61, { broaden: true, excludeHex: '#5F7F83', rng: () => 0.999999 })
    expect(contextual.hex).not.toBe('#5F7F83')
    expect(broad.hex).not.toBe('#5F7F83')
  })
})
