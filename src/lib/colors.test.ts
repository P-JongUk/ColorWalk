import { describe, expect, it } from 'vitest'

import { getColorFamily, getMatchRate, hexToRgb, rgbToHex } from '@/lib/colors'

describe('color helpers', () => {
  it('converts hex and rgb values', () => {
    expect(hexToRgb('#F6C56F')).toEqual({ r: 246, g: 197, b: 111 })
    expect(rgbToHex({ r: 246, g: 197, b: 111 })).toBe('#F6C56F')
  })

  it('scores exact matches as 100', () => {
    expect(getMatchRate('#8BC6E8', '#8BC6E8')).toBe(100)
  })

  it('keeps distant colors lower than close colors', () => {
    expect(getMatchRate('#8BC6E8', '#88C4E7')).toBeGreaterThan(
      getMatchRate('#8BC6E8', '#2F4F4F'),
    )
  })

  it('detects broad color families', () => {
    expect(getColorFamily('#F39A7A')).toBe('orange')
    expect(getColorFamily('#647E6F')).toBe('green')
    expect(getColorFamily('#303A59')).toBe('blue')
  })
})
