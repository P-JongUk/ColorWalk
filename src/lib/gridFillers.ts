export type GridFillerVariant =
  | 'matte'
  | 'sage-wash'
  | 'fine-grid'
  | 'paper-line'
  | 'split-surface'
  | 'soft-stripe'
  | 'negative-frame'
  | 'quiet-dot'

export const GRID_FILLER_VARIANTS: GridFillerVariant[] = [
  'matte',
  'sage-wash',
  'fine-grid',
  'paper-line',
  'split-surface',
  'soft-stripe',
  'negative-frame',
  'quiet-dot',
]

function hash(value: string) {
  return value.split('').reduce((sum, char) => Math.imul(sum ^ char.charCodeAt(0), 16777619), 2166136261)
}

export function getGridFillerVariant(seed: string, slot: number) {
  const index = Math.abs(hash(`${seed}:${slot}`)) % GRID_FILLER_VARIANTS.length
  return GRID_FILLER_VARIANTS[index]
}
