export type GridFillerVariant =
  | 'soft-gradient'
  | 'tiny-dots'
  | 'paper-fold'
  | 'sun-arc'
  | 'quiet-check'
  | 'corner-orbit'
  | 'thin-stripes'
  | 'color-field'
  | 'half-moon'
  | 'mini-swatch'
  | 'window-light'
  | 'soft-noise'
  | 'paper-note'
  | 'split-tone'
  | 'corner-ticket'
  | 'pencil-grid'
  | 'soft-rings'
  | 'mini-label'
  | 'diagonal-block'
  | 'quiet-spark'
  | 'blurred-wash'
  | 'thin-frame'

export const GRID_FILLER_VARIANTS: GridFillerVariant[] = [
  'soft-gradient',
  'tiny-dots',
  'paper-fold',
  'sun-arc',
  'quiet-check',
  'corner-orbit',
  'thin-stripes',
  'color-field',
  'half-moon',
  'mini-swatch',
  'window-light',
  'soft-noise',
  'paper-note',
  'split-tone',
  'corner-ticket',
  'pencil-grid',
  'soft-rings',
  'mini-label',
  'diagonal-block',
  'quiet-spark',
  'blurred-wash',
  'thin-frame',
]

function hash(value: string) {
  return value.split('').reduce((sum, char) => Math.imul(sum ^ char.charCodeAt(0), 16777619), 2166136261)
}

export function getGridFillerVariant(seed: string, slot: number) {
  const index = Math.abs(hash(`${seed}:${slot}`)) % GRID_FILLER_VARIANTS.length
  return GRID_FILLER_VARIANTS[index]
}
