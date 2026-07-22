export type FacingMode = 'environment' | 'user'

export type CameraZoomRange = {
  min: number
  max: number
  step: number
}

type RawCameraZoomRange = {
  min?: number
  max?: number
  step?: number
}

type ViewportSize = {
  width: number
  height: number
}

function getViewportSize(): ViewportSize {
  if (typeof window === 'undefined') return { width: 430, height: 932 }

  return {
    width: window.innerWidth || 430,
    height: window.innerHeight || 932,
  }
}

export function buildCameraVideoConstraints(facingMode: FacingMode, viewport = getViewportSize()): MediaTrackConstraints {
  const isPortrait = viewport.height >= viewport.width

  return {
    facingMode: { ideal: facingMode },
    width: { ideal: isPortrait ? 1080 : 1920 },
    height: { ideal: isPortrait ? 1920 : 1080 },
    aspectRatio: { ideal: isPortrait ? 9 / 16 : 16 / 9 },
    resizeMode: { ideal: 'none' },
  } as MediaTrackConstraints
}

export function normalizeZoomRange(rawRange?: RawCameraZoomRange | null): CameraZoomRange | null {
  const min = Number(rawRange?.min)
  const max = Number(rawRange?.max)
  const rawStep = Number(rawRange?.step)

  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return null

  return {
    min,
    max,
    step: Number.isFinite(rawStep) && rawStep > 0 ? Math.min(rawStep, max - min) : 0.1,
  }
}

export function clampZoom(value: number, range: CameraZoomRange) {
  if (!Number.isFinite(value)) return range.min
  return Math.min(range.max, Math.max(range.min, value))
}

export function getDefaultZoom(range: CameraZoomRange) {
  return clampZoom(1, range)
}

export function getZoomPresetValues(range: CameraZoomRange) {
  const candidates = [getDefaultZoom(range), 2, 3]
  const values = candidates.map((value) => clampZoom(value, range))

  return values.filter((value, index) => values.findIndex((candidate) => Math.abs(candidate - value) < 0.05) === index)
}

export function formatZoomValue(value: number) {
  return value >= 10 ? String(Math.round(value)) : value.toFixed(1).replace(/\.0$/, '')
}
