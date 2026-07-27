import { ArrowUpRight, Camera, ChevronLeft, Layers3, Share2 } from 'lucide-react'
import { useEffect, useRef, type CSSProperties } from 'react'

import { GridCollage } from '@/components/GridCollage'
import { Button } from '@/components/ui/button'
import { getGridImageUrl } from '@/lib/grid'
import type { ColorVolume, DeckStage, LivingHueDeckCard } from '@/lib/livingHueDeck'
import { formatDisplayDate } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { Locale } from '@/types'

type LivingHueDeckViewProps = {
  locale: Locale
  cards: LivingHueDeckCard[]
  volumes: ColorVolume[]
  onStartCamera: () => void
  onOpenRecord: (card: LivingHueDeckCard) => void
  onOpenStory: (card: LivingHueDeckCard) => void
  onOpenVolume: (volume: ColorVolume) => void
  onDeckEntered: () => void
  onCardStageVisible: (stage: DeckStage) => void
}

function syncLabel(locale: Locale, state: LivingHueDeckCard['syncState']) {
  if (state === 'device') return locale === 'ko' ? '기기 저장' : 'Saved on this device'
  if (state === 'pending') return locale === 'ko' ? '동기화 대기' : 'Waiting to sync'
  return null
}

function cardTitle(locale: Locale, card: LivingHueDeckCard) {
  return card.post.custom_color_name || card.post.mission_label || (locale === 'ko' ? '오늘의 색' : "Today's color")
}

function DeckCard({ locale, card, onOpenRecord, onOpenStory, onVisible }: {
  locale: Locale
  card: LivingHueDeckCard
  onOpenRecord: () => void
  onOpenStory: () => void
  onVisible: () => void
}) {
  const cardRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = cardRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      onVisible()
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
        onVisible()
        observer.disconnect()
      }
    }, { threshold: [0.5] })
    observer.observe(node)
    return () => observer.disconnect()
  }, [onVisible])

  const visibleImages = card.images.slice(0, card.stage === 1 ? 1 : card.stage === 3 ? 3 : 5)
  const status = syncLabel(locale, card.syncState)
  const date = formatDisplayDate(card.post.local_date, locale === 'ko' ? 'ko-KR' : 'en-US')

  return (
    <article ref={cardRef} className={cn('deck-card', `deck-card-stage-${card.stage}`, card.stage === 8 && 'deck-card-sealed')}>
      <button type="button" className="deck-card-main" onClick={onOpenRecord} aria-label={locale === 'ko' ? `${date} 기록 열기` : `Open ${date}`}>
        {card.stage === 8 ? (
          <div className="deck-card-sealed-grid">
            <GridCollage locale={locale} missionHex={card.canonicalMissionHex} colorName={cardTitle(locale, card)} images={card.images} variant="mini" />
          </div>
        ) : (
          <div className="deck-photo-mosaic" style={{ '--deck-color': card.canonicalMissionHex } as CSSProperties}>
            {visibleImages.map((image) => {
              const imageUrl = getGridImageUrl(image)
              return imageUrl ? <span key={image.id} style={{ backgroundImage: `url("${imageUrl}")` }} /> : null
            })}
          </div>
        )}
        <div className="deck-card-copy">
          <div>
            <p>{date}</p>
            <h2>{cardTitle(locale, card)}</h2>
          </div>
          <span className="deck-stage-mark">{card.stage}/8</span>
        </div>
      </button>
      <div className="deck-card-footer">
        <span>{status ?? (card.stage === 8 ? (locale === 'ko' ? '한 페이지 완성' : 'A page complete') : (locale === 'ko' ? '오늘의 색 기록' : 'Today\'s color record'))}</span>
        <Button type="button" variant="ghost" size="sm" className="deck-story-button" onClick={onOpenStory}>
          <Share2 aria-hidden="true" />
          {locale === 'ko' ? '스토리' : 'Story'}
        </Button>
      </div>
    </article>
  )
}

export function LivingHueDeckView({ locale, cards, volumes, onStartCamera, onOpenRecord, onOpenStory, onOpenVolume, onDeckEntered, onCardStageVisible }: LivingHueDeckViewProps) {
  const visibleStages = useRef(new Set<DeckStage>())
  const entered = useRef(false)

  useEffect(() => {
    if (entered.current) return
    entered.current = true
    onDeckEntered()
  }, [onDeckEntered])

  function handleVisible(stage: DeckStage) {
    if (visibleStages.current.has(stage)) return
    visibleStages.current.add(stage)
    onCardStageVisible(stage)
  }

  if (!cards.length) {
    return (
      <section className="deck-empty-state">
        <span className="deck-empty-swatch" aria-hidden="true" />
        <p>{locale === 'ko' ? 'Living Hue Deck' : 'Living Hue Deck'}</p>
        <h1>{locale === 'ko' ? '첫 색을 담으면 카드가 시작돼요.' : 'Your first color starts a card.'}</h1>
        <Button type="button" onClick={onStartCamera}>
          <Camera aria-hidden="true" />
          {locale === 'ko' ? '오늘의 색 찾기' : "Find today's color"}
        </Button>
      </section>
    )
  }

  return (
    <section className="deck-screen">
      <header className="deck-header">
        <p>{locale === 'ko' ? '나의 색 아카이브' : 'My color archive'}</p>
        <h1>Living Hue Deck</h1>
        <span>{locale === 'ko' ? `${cards.length}개의 오늘이 쌓였어요.` : `${cards.length} days collected.`}</span>
      </header>

      <div className="deck-card-list">
        {cards.map((card) => (
          <DeckCard
            key={card.post.id}
            locale={locale}
            card={card}
            onOpenRecord={() => onOpenRecord(card)}
            onOpenStory={() => onOpenStory(card)}
            onVisible={() => handleVisible(card.stage)}
          />
        ))}
      </div>

      {volumes.length ? (
        <section className="deck-volume-section">
          <div className="section-heading">
            <div>
              <p>{locale === 'ko' ? '완성한 색' : 'Completed colors'}</p>
              <h2>{locale === 'ko' ? 'Color Volume' : 'Color Volume'}</h2>
            </div>
            <Layers3 aria-hidden="true" />
          </div>
          <div className="deck-volume-list">
            {volumes.map((volume) => (
              <button key={volume.missionHex} type="button" className="deck-volume-row" onClick={() => onOpenVolume(volume)}>
                <span className="deck-volume-swatch" style={{ backgroundColor: volume.missionHex }} />
                <span>
                  <strong>{volume.cards[0].post.custom_color_name || volume.cards[0].post.mission_label || volume.missionHex}</strong>
                  <small>{locale === 'ko' ? `${volume.cards.length}개의 완성 페이지` : `${volume.cards.length} completed pages`}</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}

type ColorVolumeViewProps = {
  locale: Locale
  volume: ColorVolume
  onBack: () => void
  onOpenRecord: (card: LivingHueDeckCard) => void
  onOpenStory: (card: LivingHueDeckCard) => void
}

export function ColorVolumeView({ locale, volume, onBack, onOpenRecord, onOpenStory }: ColorVolumeViewProps) {
  return (
    <section className="deck-volume-detail">
      <button type="button" className="deck-back-button" onClick={onBack}>
        <ChevronLeft aria-hidden="true" />
        {locale === 'ko' ? 'Deck' : 'Deck'}
      </button>
      <header className="deck-header">
        <span className="deck-volume-swatch" style={{ backgroundColor: volume.missionHex }} />
        <p>{locale === 'ko' ? '같은 미션 색의 완성 페이지' : 'Completed pages in one mission color'}</p>
        <h1>Color Volume</h1>
      </header>
      <div className="deck-card-list">
        {volume.cards.map((card) => (
          <DeckCard key={card.post.id} locale={locale} card={card} onOpenRecord={() => onOpenRecord(card)} onOpenStory={() => onOpenStory(card)} onVisible={() => undefined} />
        ))}
      </div>
    </section>
  )
}

type MissionPackCollectionViewProps = {
  locale: Locale
  title: string
  cards: LivingHueDeckCard[]
  onBack: () => void
  onOpenRecord: (card: LivingHueDeckCard) => void
  onOpenStory: (card: LivingHueDeckCard) => void
  onStartCamera: () => void
}

/**
 * A pack collection only ever shows closed records with a finalized selection matching
 * this pack (already filtered by the caller via missionPackId). It reuses the same
 * DeckCard 1/3/5/8 stage rendering as the main Deck/Color Volume views.
 */
export function MissionPackCollectionView({ locale, title, cards, onBack, onOpenRecord, onOpenStory, onStartCamera }: MissionPackCollectionViewProps) {
  return (
    <section className="deck-volume-detail">
      <button type="button" className="deck-back-button" onClick={onBack}>
        <ChevronLeft aria-hidden="true" />
        {locale === 'ko' ? '컬렉션' : 'Collections'}
      </button>
      <header className="deck-header">
        <p>{locale === 'ko' ? '미션 팩 컬렉션' : 'Mission pack collection'}</p>
        <h1>{title}</h1>
      </header>
      {cards.length ? (
        <div className="deck-card-list">
          {cards.map((card) => (
            <DeckCard key={card.post.id} locale={locale} card={card} onOpenRecord={() => onOpenRecord(card)} onOpenStory={() => onOpenStory(card)} onVisible={() => undefined} />
          ))}
        </div>
      ) : (
        <div className="mission-pack-collection-empty">
          <p>{locale === 'ko' ? '홈에서 이 팩을 고르고 하루를 닫으면 카드가 모여요.' : 'Pick this pack on Home and close a day to collect a card here.'}</p>
          <Button type="button" size="sm" onClick={onStartCamera}>
            <Camera aria-hidden="true" />
            {locale === 'ko' ? '오늘의 색 찾기' : "Find today's color"}
          </Button>
        </div>
      )}
    </section>
  )
}
