import { useId } from 'react'
import { cn } from '@/lib/utils'

type ColorWalkMarkProps = {
  className?: string
  compact?: boolean
}

export function ColorWalkMark({ className, compact = false }: ColorWalkMarkProps) {
  const crayonFilterId = `${useId().replace(/:/g, '')}-cw-mark-crayon`

  return (
    <span className={cn('colorwalk-mark', compact && 'colorwalk-mark-compact', className)} aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img" fill="none">
        <defs>
          <filter id={crayonFilterId} x="-18%" y="-18%" width="136%" height="136%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="1.05" numOctaves="2" seed="12" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale=".42" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#${crayonFilterId})`} strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M23.8 22.5c-4.6-6.2-12-6.1-13 .2-.9 5.6 6.7 7.9 12.3 3.3"
            stroke="var(--cw-mark-line, #6FA893)"
            strokeWidth="4"
          />
          <path
            d="M24.3 22.5c.9-7.7 8.2-10.5 11.5-6.6 3.2 3.7-1.7 9.4-9.6 7.8"
            stroke="var(--cw-mark-line, #6FA893)"
            strokeWidth="4"
          />
          <path
            d="M23.5 24c-6.2 2.8-8.5 9.7-4.5 12.4 4 2.8 8.6-2.8 5.6-10.9"
            stroke="var(--cw-mark-line, #6FA893)"
            strokeWidth="4"
          />
          <path
            d="M25 24c6.5 2.4 9.5 9.1 5.8 12.3-3.7 3-8.8-2.2-6.4-10.6"
            stroke="var(--cw-mark-line, #6FA893)"
            strokeWidth="4"
          />
          <path
            d="M24.1 27.1c-.9 5.4-5.3 8.5-11.8 10.3 6.3.4 13.5.5 21.6 5.1"
            stroke="var(--cw-mark-line, #6FA893)"
            strokeWidth="3.6"
          />
          <path
            d="M14 22.6c2.8-2.2 6-1.7 8.7 1"
            stroke="var(--cw-mark-highlight, #FFF8EE)"
            strokeWidth="1.2"
            opacity=".7"
          />
          <circle cx="24" cy="24.7" r="2.5" fill="var(--cw-mark-paper, #FFF8EE)" stroke="var(--cw-mark-line, #6FA893)" strokeWidth="2.1" />
        </g>
        <circle cx="35.5" cy="37" r="2.2" fill="var(--cw-mark-coral, #FF7B70)" />
        <circle cx="39.8" cy="32.5" r="1.6" fill="var(--cw-mark-butter, #F3C669)" />
      </svg>
    </span>
  )
}
