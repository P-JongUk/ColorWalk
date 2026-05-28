import type { Rgb } from '@/types'

export function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

export function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace('#', '')

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b]
    .map((channel) => clampColorChannel(channel).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase()
}

export function getColorDistance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}

type Lab = {
  l: number
  a: number
  b: number
}

function pivotRgb(channel: number) {
  const normalized = channel / 255
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4
}

function pivotXyz(value: number) {
  return value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116
}

function rgbToLab({ r, g, b }: Rgb): Lab {
  const linearR = pivotRgb(r)
  const linearG = pivotRgb(g)
  const linearB = pivotRgb(b)

  const x = (linearR * 0.4124564 + linearG * 0.3575761 + linearB * 0.1804375) / 0.95047
  const y = linearR * 0.2126729 + linearG * 0.7151522 + linearB * 0.072175
  const z = (linearR * 0.0193339 + linearG * 0.119192 + linearB * 0.9503041) / 1.08883

  const fx = pivotXyz(x)
  const fy = pivotXyz(y)
  const fz = pivotXyz(z)

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  }
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI
}

function hueDegrees(a: number, b: number) {
  if (a === 0 && b === 0) return 0
  const value = radiansToDegrees(Math.atan2(b, a))
  return value >= 0 ? value : value + 360
}

function deltaHue(h1: number, h2: number, c1: number, c2: number) {
  if (c1 * c2 === 0) return 0
  const difference = h2 - h1
  if (Math.abs(difference) <= 180) return difference
  return difference > 180 ? difference - 360 : difference + 360
}

function averageHue(h1: number, h2: number, c1: number, c2: number) {
  if (c1 * c2 === 0) return h1 + h2
  if (Math.abs(h1 - h2) <= 180) return (h1 + h2) / 2
  return h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2
}

export function getPerceptualDeltaE(a: Rgb, b: Rgb) {
  const lab1 = rgbToLab(a)
  const lab2 = rgbToLab(b)

  const c1 = Math.sqrt(lab1.a ** 2 + lab1.b ** 2)
  const c2 = Math.sqrt(lab2.a ** 2 + lab2.b ** 2)
  const averageC = (c1 + c2) / 2
  const averageC7 = averageC ** 7
  const g = 0.5 * (1 - Math.sqrt(averageC7 / (averageC7 + 25 ** 7)))
  const a1Prime = (1 + g) * lab1.a
  const a2Prime = (1 + g) * lab2.a
  const c1Prime = Math.sqrt(a1Prime ** 2 + lab1.b ** 2)
  const c2Prime = Math.sqrt(a2Prime ** 2 + lab2.b ** 2)
  const h1Prime = hueDegrees(a1Prime, lab1.b)
  const h2Prime = hueDegrees(a2Prime, lab2.b)

  const deltaLPrime = lab2.l - lab1.l
  const deltaCPrime = c2Prime - c1Prime
  const deltaHPrime =
    2 *
    Math.sqrt(c1Prime * c2Prime) *
    Math.sin(degreesToRadians(deltaHue(h1Prime, h2Prime, c1Prime, c2Prime) / 2))

  const averageLPrime = (lab1.l + lab2.l) / 2
  const averageCPrime = (c1Prime + c2Prime) / 2
  const averageHPrime = averageHue(h1Prime, h2Prime, c1Prime, c2Prime)
  const t =
    1 -
    0.17 * Math.cos(degreesToRadians(averageHPrime - 30)) +
    0.24 * Math.cos(degreesToRadians(2 * averageHPrime)) +
    0.32 * Math.cos(degreesToRadians(3 * averageHPrime + 6)) -
    0.2 * Math.cos(degreesToRadians(4 * averageHPrime - 63))
  const deltaTheta = 30 * Math.exp(-(((averageHPrime - 275) / 25) ** 2))
  const averageCPrime7 = averageCPrime ** 7
  const rC = 2 * Math.sqrt(averageCPrime7 / (averageCPrime7 + 25 ** 7))
  const sL = 1 + (0.015 * (averageLPrime - 50) ** 2) / Math.sqrt(20 + (averageLPrime - 50) ** 2)
  const sC = 1 + 0.045 * averageCPrime
  const sH = 1 + 0.015 * averageCPrime * t
  const rT = -Math.sin(degreesToRadians(2 * deltaTheta)) * rC

  return Math.sqrt(
    (deltaLPrime / sL) ** 2 +
      (deltaCPrime / sC) ** 2 +
      (deltaHPrime / sH) ** 2 +
      rT * (deltaCPrime / sC) * (deltaHPrime / sH),
  )
}

type Hsl = {
  h: number
  s: number
  l: number
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const normalizedR = r / 255
  const normalizedG = g / 255
  const normalizedB = b / 255
  const max = Math.max(normalizedR, normalizedG, normalizedB)
  const min = Math.min(normalizedR, normalizedG, normalizedB)
  const delta = max - min
  const lightness = (max + min) / 2

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness }
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue = 0

  if (max === normalizedR) hue = ((normalizedG - normalizedB) / delta) % 6
  if (max === normalizedG) hue = (normalizedB - normalizedR) / delta + 2
  if (max === normalizedB) hue = (normalizedR - normalizedG) / delta + 4

  return {
    h: (hue * 60 + 360) % 360,
    s: saturation,
    l: lightness,
  }
}

function getHueSimilarity(a: Hsl, b: Hsl) {
  const chromaGate = Math.min(1, Math.max(a.s, b.s) * 1.65)
  const distance = Math.abs(a.h - b.h)
  const shortestDistance = Math.min(distance, 360 - distance)

  return 1 - Math.min(1, (shortestDistance / 180) * chromaGate)
}

export function getMatchRate(targetHex: string, capturedHex: string) {
  const target = hexToRgb(targetHex)
  const captured = hexToRgb(capturedHex)
  const deltaE = getPerceptualDeltaE(target, captured)
  const targetHsl = rgbToHsl(target)
  const capturedHsl = rgbToHsl(captured)
  const perceptualScore = 1 - Math.min(1, deltaE / 44)
  const channelScore = 1 - Math.min(1, getColorDistance(target, captured) / 255)
  const hueScore = getHueSimilarity(targetHsl, capturedHsl)
  const lightnessScore = 1 - Math.min(1, Math.abs(targetHsl.l - capturedHsl.l) / 0.72)
  const blendedScore =
    perceptualScore * 0.68 +
    channelScore * 0.16 +
    hueScore * 0.1 +
    lightnessScore * 0.06
  const score = 100 * Math.max(0, blendedScore) ** 1.18

  return Math.max(0, Math.min(100, Math.round(score)))
}

export type ColorFamily =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'neutral'

export function getColorFamily(hex: string): ColorFamily {
  const { r, g, b } = hexToRgb(hex)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  if (delta < 22) return 'neutral'

  let hue = 0
  if (max === r) hue = ((g - b) / delta) % 6
  if (max === g) hue = (b - r) / delta + 2
  if (max === b) hue = (r - g) / delta + 4
  hue = (hue * 60 + 360) % 360

  if (hue < 12 || hue >= 346) return 'red'
  if (hue < 48) return 'orange'
  if (hue < 72) return 'yellow'
  if (hue < 168) return 'green'
  if (hue < 246) return 'blue'
  if (hue < 295) return 'purple'
  return 'pink'
}

export function getReadableTextColor(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

  return luminance > 0.62 ? '#241F1A' : '#FFFDF8'
}
