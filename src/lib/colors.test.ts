import { describe, expect, it } from 'vitest'

import { getColorFamily, hexToRgb, rgbToHex } from '@/lib/colors'

describe('color helpers', () => {
  it('converts hex and rgb values', () => {
    expect(hexToRgb('#F6C56F')).toEqual({ r: 246, g: 197, b: 111 })
    expect(rgbToHex({ r: 246, g: 197, b: 111 })).toBe('#F6C56F')
  })

  it('detects broad color families', () => {
    expect(getColorFamily('#F39A7A')).toBe('orange')
    expect(getColorFamily('#647E6F')).toBe('green')
    expect(getColorFamily('#303A59')).toBe('blue')
  })
})
