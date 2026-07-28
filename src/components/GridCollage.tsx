import type { CSSProperties } from 'react'
import { Plus } from 'lucide-react'

import { GRID_ALL_SLOTS, GRID_CENTER_SLOT, getGridImageUrl } from '@/lib/grid'
import { getReadableTextColor } from '@/lib/colors'
import { cn } from '@/lib/utils'
import type { GridDraftImage, GridImage, Locale } from '@/types'

type GridCollageProps = {
  locale: Locale
  missionHex: string
  colorName?: string
  images: Array<GridImage | GridDraftImage>
  variant?: 'home' | 'camera' | 'journal' | 'story' | 'mini'
  onEmptyClick?: () => void
  className?: string
}

/** Home and Camera are the only interactive capture surfaces; every other
 * surface renders the same Editorial Contact Sheet without the `+` glyph. */
const INTERACTIVE_VARIANTS: ReadonlySet<GridCollageProps['variant']> = new Set(['home', 'camera'])

function getImageForSlot(images: Array<GridImage | GridDraftImage>, slot: number) {
  return images.find((image) => image.slot === slot)
}

export function GridCollage({
  locale,
  missionHex,
  colorName,
  images,
  variant = 'journal',
  onEmptyClick,
  className,
}: GridCollageProps) {
  const label = colorName?.trim() || (locale === 'ko' ? '오늘의 색' : "Today's color")
  const centerTextColor = getReadableTextColor(missionHex)
  const isInteractive = INTERACTIVE_VARIANTS.has(variant)

  return (
    <div className={cn('color-grid', `color-grid-${variant}`, className)} style={{ '--grid-color': missionHex } as CSSProperties}>
      {GRID_ALL_SLOTS.map((slot) => {
        if (slot === GRID_CENTER_SLOT) {
          return (
            <div
              key="center"
              className="color-grid-chip"
              style={{ backgroundColor: missionHex, color: centerTextColor }}
            >
              <strong>{label}</strong>
              <span>{missionHex}</span>
            </div>
          )
        }

        const image = getImageForSlot(images, slot)
        const imageUrl = getGridImageUrl(image as GridImage | undefined)

        if (imageUrl) {
          return (
            <div key={slot} className="color-grid-photo" style={{ backgroundImage: `url("${imageUrl}")` }} />
          )
        }

        // Editorial Contact Sheet: one deterministic empty-slot treatment.
        // Interactive Home/Camera surfaces show a centered "+"; every static
        // surface (Journal/History/Story/export) shows a quiet slot number
        // instead so registration reads as intentional, not decorative.
        if (isInteractive) {
          return (
            <button
              key={slot}
              type="button"
              className="color-grid-empty"
              onClick={onEmptyClick}
              disabled={!onEmptyClick}
              aria-label={locale === 'ko' ? '사진 추가' : 'Add photo'}
            >
              <Plus aria-hidden="true" />
            </button>
          )
        }

        return (
          <div key={slot} className="color-grid-empty color-grid-empty-static" aria-hidden="true">
            <span className="color-grid-empty-slot-number">{slot + 1}</span>
          </div>
        )
      })}
    </div>
  )
}
