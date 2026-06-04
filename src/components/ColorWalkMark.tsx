import { cn } from '@/lib/utils'

type ColorWalkMarkProps = {
  className?: string
  compact?: boolean
}

export function ColorWalkMark({ className, compact = false }: ColorWalkMarkProps) {
  return (
    <span className={cn('colorwalk-mark', compact && 'colorwalk-mark-compact', className)} aria-hidden="true">
      <img src="/brand/hueday-mark-transparent.png" alt="" draggable={false} />
    </span>
  )
}
