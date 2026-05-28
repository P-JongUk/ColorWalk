import { cn } from '@/lib/utils'

type ColorWalkMarkProps = {
  className?: string
  compact?: boolean
}

export function ColorWalkMark({ className, compact = false }: ColorWalkMarkProps) {
  return (
    <span className={cn('colorwalk-mark', compact && 'colorwalk-mark-compact', className)} aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img" fill="none">
        <path d="M24 20c2.6-7.5 10.8-8.6 13.2-3.6 2.5 5.1-3.8 10.5-10.4 7.8 7.1 3.6 6.4 11.9.9 13.5-5.3 1.5-8.2-6.2-4.7-12.1-4.1 6.3-12.4 5.1-13.6-.5-1.1-5.3 6.5-7.7 12.1-3.8-5.3-5.2-2.4-12.8 3.2-12.4 5 .4 5.4 8.1-.7 11.1Z" fill="currentColor" opacity=".18" />
        <path d="M24.2 21.3c2-5.9 8.4-6.9 10.2-2.9 1.9 4-3.1 8.1-8.2 5.9 5.6 2.8 5 9.3.8 10.5-4.2 1.2-6.5-4.8-3.7-9.5-3.2 4.9-9.7 4-10.6-.4-.9-4.2 5.1-6.1 9.5-3.1-4.2-4.1-1.9-10 2.5-9.7 3.9.3 4.2 6.2-.5 9.2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" />
        <circle cx="24" cy="24" r="3.8" fill="currentColor" />
      </svg>
    </span>
  )
}
