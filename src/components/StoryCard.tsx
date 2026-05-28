import type { PointerEvent, Ref } from 'react'

import { ColorWalkMark } from '@/components/ColorWalkMark'
import { getStickerDefinition, getStoryTemplate } from '@/lib/story'
import { cn } from '@/lib/utils'
import type { Locale, StoryStickerItem, StoryTemplateId } from '@/types'

export type StoryCardData = {
  locale: Locale
  templateId: StoryTemplateId
  imageUrl?: string
  dateLabel: string
  missionLabel: string
  missionHex: string
  capturedHex: string
  matchRate: number
  colorName?: string
  moodText?: string
  placeName?: string
}

type StoryCardProps = StoryCardData & {
  stickers: StoryStickerItem[]
  exportRef?: Ref<HTMLDivElement>
  selectedStickerUid?: string | null
  onStickerPointerDown?: (event: PointerEvent<HTMLButtonElement>, sticker: StoryStickerItem) => void
  onSelectSticker?: (uid: string) => void
}

function Barcode() {
  return (
    <div className="story-barcode" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, index) => (
        <span key={index} style={{ width: `${index % 5 === 0 ? 4 : index % 3 === 0 ? 2 : 1}px` }} />
      ))}
    </div>
  )
}

export function StoryCard({
  locale,
  templateId,
  imageUrl,
  dateLabel,
  missionLabel,
  missionHex,
  capturedHex,
  matchRate,
  colorName,
  moodText,
  placeName,
  stickers,
  exportRef,
  selectedStickerUid,
  onStickerPointerDown,
  onSelectSticker,
}: StoryCardProps) {
  const template = getStoryTemplate(templateId)
  const title = colorName?.trim() || missionLabel
  const mood = moodText?.trim() || (locale === 'ko' ? '오늘 산책에서 발견한 작은 색.' : "A tiny color found on today's walk.")

  return (
    <div ref={exportRef} className={cn('story-card', template.className)} data-template={templateId}>
      <div className="story-paper-grain" />
      <div className="story-template-decor" aria-hidden="true">
        {templateId === 'travel' ? (
          <>
            <img className="decor-airplane" src="/stickers/colorwalk-doodles/airplane.png" alt="" />
            <img className="decor-route" src="/stickers/colorwalk-doodles/dotted-route.png" alt="" />
            <span className="decor-label">AIR TRIP</span>
          </>
        ) : null}
        {templateId === 'mongle' ? (
          <>
            <img className="decor-cloud" src="/stickers/colorwalk-doodles/soft-cloud.png" alt="" />
            <img className="decor-heart" src="/stickers/colorwalk-doodles/heart-outline.png" alt="" />
          </>
        ) : null}
        {templateId === 'newspaper' ? <span className="decor-news">COLOR WALK DAILY</span> : null}
        {templateId === 'polaroid' ? <img className="decor-tape" src="/stickers/colorwalk-doodles/washi-tape.png" alt="" /> : null}
        {templateId === 'modern' ? <span className="decor-modern">COLOR / WALK</span> : null}
        {templateId === 'receipt' ? <span className="decor-receipt">RECEIPT NO. {dateLabel}</span> : null}
        {templateId === 'minimal' ? <span className="decor-minimal">mood color archive</span> : null}
      </div>
      <div className="story-photo" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}>
        {!imageUrl ? <ColorWalkMark className="text-coral" /> : null}
        <div className="story-photo-date">{dateLabel}</div>
        <div className="story-photo-title">
          <small>TODAY'S COLOR</small>
          <strong>{title}</strong>
        </div>
      </div>

      <div className="story-polaroids" aria-hidden="true">
        <div>
          <span style={{ backgroundColor: missionHex }} />
          <small>{locale === 'ko' ? '미션 컬러' : 'MISSION'}</small>
          <b>{missionHex}</b>
        </div>
        <div>
          <span style={{ backgroundColor: capturedHex }} />
          <small>{locale === 'ko' ? '찾은 컬러' : 'FOUND'}</small>
          <b>{capturedHex}</b>
        </div>
      </div>

      <div className="story-ticket">
        <div className="story-ticket-row">
          <span>MATCH RATE</span>
          <strong>{matchRate}%</strong>
        </div>
        {placeName ? (
          <div className="story-ticket-row">
            <span>{locale === 'ko' ? 'PLACE' : 'PLACE'}</span>
            <strong>{placeName}</strong>
          </div>
        ) : null}
        <p>{mood}</p>
        <Barcode />
      </div>

      <div className="story-footer-mark">
        <ColorWalkMark compact className="text-coral" />
        <span>ColorWalk</span>
      </div>

      {stickers.map((sticker) => {
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
      })}
    </div>
  )
}
