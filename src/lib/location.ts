import type { SavedLocation } from '@/types'

export function canUseBrowserLocation() {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

export function getCurrentSavedLocation(): Promise<SavedLocation> {
  if (!canUseBrowserLocation()) {
    return Promise.reject(new Error('Geolocation is unavailable'))
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          name: null,
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracyMeters: Math.round(position.coords.accuracy),
        })
      },
      () => reject(new Error('Location permission was denied')),
      {
        enableHighAccuracy: false,
        maximumAge: 1000 * 60 * 5,
        timeout: 9000,
      },
    )
  })
}

