import type { Locale, Mission } from '@/types'
import { getDailyMission, getFallbackMission, getTimeBucket, mapWeatherCodeToGroup } from '@/lib/mission'

const SEOUL_COORDS = {
  latitude: 37.5665,
  longitude: 126.978,
}

type Coordinates = {
  latitude: number
  longitude: number
}

function getPosition(timeout = 6500): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is unavailable'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      reject,
      {
        enableHighAccuracy: false,
        maximumAge: 1000 * 60 * 30,
        timeout,
      },
    )
  })
}

async function fetchWeatherCode({ latitude, longitude }: Coordinates) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('current', 'weather_code')
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Open-Meteo request failed: ${response.status}`)

  const payload = (await response.json()) as { current?: { weather_code?: number } }

  return payload.current?.weather_code
}

export async function loadTodayMission(locale: Locale): Promise<{
  mission: Mission
  usedFallbackLocation: boolean
}> {
  const timeBucket = getTimeBucket()

  try {
    const coords = await getPosition()
    const weatherCode = await fetchWeatherCode(coords)
    const weatherGroup = mapWeatherCodeToGroup(weatherCode)

    return {
      mission: getDailyMission(weatherGroup, timeBucket, 'live', weatherCode),
      usedFallbackLocation: false,
    }
  } catch {
    try {
      const weatherCode = await fetchWeatherCode(SEOUL_COORDS)
      const weatherGroup = mapWeatherCodeToGroup(weatherCode)

      return {
        mission: getDailyMission(weatherGroup, timeBucket, 'fallback', weatherCode),
        usedFallbackLocation: true,
      }
    } catch {
      return {
        mission: getFallbackMission(locale),
        usedFallbackLocation: true,
      }
    }
  }
}
