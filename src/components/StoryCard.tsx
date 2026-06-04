import type { PointerEvent, Ref } from 'react'

import { ColorWalkMark } from '@/components/ColorWalkMark'
import { GridCollage } from '@/components/GridCollage'
import { getStickerDefinition, getStoryTemplate } from '@/lib/story'
import { cn } from '@/lib/utils'
import type { GridDraftImage, GridImage, Locale, StoryStickerItem, StoryTemplateId } from '@/types'

const SHOW_STORY_BRANDING = false
const SHOW_STORY_DECORATIONS = false

export type StoryCardData = {
  locale: Locale
  templateId: StoryTemplateId
  dateLabel: string
  missionLabel: string
  missionHex: string
  colorName?: string
  moodText?: string
  gridImages: Array<GridImage | GridDraftImage>
}

type StoryCardProps = StoryCardData & {
  stickers: StoryStickerItem[]
  exportRef?: Ref<HTMLDivElement>
  selectedStickerUid?: string | null
  onStickerPointerDown?: (event: PointerEvent<HTMLButtonElement>, sticker: StoryStickerItem) => void
  onSelectSticker?: (uid: string) => void
}

export function StoryCard({
  locale,
  templateId,
  dateLabel,
  missionLabel,
  missionHex,
  colorName,
  moodText,
  gridImages,
  stickers,
  exportRef,
  selectedStickerUid,
  onStickerPointerDown,
  onSelectSticker,
}: StoryCardProps) {
  const template = getStoryTemplate(templateId)
  const title = colorName?.trim() || missionLabel
  const mood = moodText?.trim() || (locale === 'ko' ? '오늘 산책에서 모은 작은 색의 조각들.' : "Small color pieces from today's walk.")
  const photoCount = gridImages.length

  return (
    <div ref={exportRef} className={cn('story-card', 'story-card-grid', template.className)} data-template={templateId}>
      <div className="story-paper-grain" />
      <div className="story-frame-line" aria-hidden="true" />
      <header className="story-grid-header">
        <div>
          <strong>{title}</strong>
          <small>{missionHex}</small>
        </div>
        <span>{dateLabel} · {photoCount}/8</span>
      </header>

      <div className="story-grid-stage">
        <GridCollage
          locale={locale}
          missionHex={missionHex}
          colorName={title}
          images={gridImages}
          variant="story"
        />
      </div>

      <div className="story-grid-note">
        <p>{mood}</p>
      </div>

      {SHOW_STORY_BRANDING ? (
        <footer className="story-footer-mark">
          <ColorWalkMark compact />
          <span>Hueday</span>
        </footer>
      ) : null}

      {SHOW_STORY_DECORATIONS ? stickers.map((sticker) => {
        const definition = getStickerDefinition(sticker.stickerId)
        return (
          <button
            key={sticker.uid}
            type="button"
            className={cn(
              'story-sticker',
              selectedStickerUid === sticker.uid && 'story-sticker-selected',
              !onStickerPointerDown && 'pointer-events-none',
            )}
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            }}
            onPointerDown={(event) => onStickerPointerDown?.(event, sticker)}
            onClick={() => onSelectSticker?.(sticker.uid)}
            aria-label={definition.label}
          >
            <img src={definition.assetUrl} alt="" draggable={false} />
          </button>
        )
      }) : null}
    </div>
  )
}
