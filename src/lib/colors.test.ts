import { describe, expect, it } from 'vitest'

import { getColorFamily, getReadableTextColor, getReadableTextContrast, hexToRgb, rgbToHex } from '@/lib/colors'

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

  it('picks the higher-contrast canonical text color for dark and light mission colors', () => {
    // Very dark mission color: canonical Paper (#FFFDF8) must win over Ink.
    expect(getReadableTextColor('#0B1420')).toBe('#FFFDF8')
    // Very light mission color: canonical Ink (#211D1B) must win over Paper.
    expect(getReadableTextColor('#F7F2E8')).toBe('#211D1B')
  })

  it('reaches at least the 4.5:1 WCAG normal-text ratio for representative curated colors', () => {
    const sampleMissionColors = ['#FF625B', '#3F776C', '#F6C56F', '#211D1B', '#FFFDF8', '#8FCFBD', '#526331']
    for (const hex of sampleMissionColors) {
      expect(getReadableTextContrast(hex)).toBeGreaterThanOrEqual(4.5)
    }
  })
})
