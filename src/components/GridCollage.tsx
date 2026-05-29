import type { CSSProperties } from 'react'
import { Plus } from 'lucide-react'

import { GRID_ALL_SLOTS, GRID_CENTER_SLOT, getGridImageUrl } from '@/lib/grid'
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

  return (
    <div className={cn('color-grid', `color-grid-${variant}`, className)} style={{ '--grid-color': missionHex } as CSSProperties}>
      {GRID_ALL_SLOTS.map((slot) => {
        if (slot === GRID_CENTER_SLOT) {
          return (
            <div key="center" className="color-grid-chip">
              <div className="color-grid-chip-color" />
              <div className="color-grid-chip-label">
                <strong>{label}</strong>
                <span>{missionHex}</span>
              </div>
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

        return (
          <button
            key={slot}
            type="button"
            className="color-grid-empty"
            onClick={onEmptyClick}
            disabled={!onEmptyClick}
            aria-label={locale === 'ko' ? '사진 추가' : 'Add photo'}
          >
            {variant === 'camera' ? <Plus aria-hidden="true" /> : null}
          </button>
        )
      })}
    </div>
  )
}
