import { describe, expect, it } from 'vitest'

import {
  buildCameraVideoConstraints,
  clampZoom,
  formatZoomValue,
  getDefaultZoom,
  getZoomPresetValues,
  normalizeZoomRange,
} from '@/lib/camera'

describe('camera helpers', () => {
  it('builds portrait preview constraints without forcing an over-zoomed square stream', () => {
    const constraints = buildCameraVideoConstraints('environment', { width: 430, height: 932 })

    expect((constraints.facingMode as ConstrainDOMStringParameters).ideal).toBe('environment')
    expect((constraints.width as ConstrainULongRange).ideal).toBe(1080)
    expect((constraints.height as ConstrainULongRange).ideal).toBe(1920)
    expect((constraints.aspectRatio as ConstrainDoubleRange).ideal).toBeCloseTo(9 / 16)
  })

  it('normalizes and clamps camera zoom ranges defensively', () => {
    const range = normalizeZoomRange({ min: 1, max: 4, step: 0.25 })

    expect(range).toEqual({ min: 1, max: 4, step: 0.25 })
    expect(range ? getDefaultZoom(range) : null).toBe(1)
    expect(range ? clampZoom(8, range) : null).toBe(4)
    expect(range ? clampZoom(0.2, range) : null).toBe(1)
  })

  it('returns stable zoom labels and presets', () => {
    const range = normalizeZoomRange({ min: 1, max: 2.6 })

    expect(range ? getZoomPresetValues(range) : []).toEqual([1, 2, 2.6])
    expect(formatZoomValue(1)).toBe('1')
    expect(formatZoomValue(2.5)).toBe('2.5')
  })
})
