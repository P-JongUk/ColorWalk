import { CalendarDays, Camera, ChevronLeft, ChevronRight, Share2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import { GridCollage } from '@/components/GridCollage'
import { ColorVolumeView, LivingHueDeckView } from '@/components/LivingHueDeckView'
import { StoryStudio } from '@/components/StoryStudio'
import { Button } from '@/components/ui/button'
import { getMonthlyCollection } from '@/lib/collection'
import { formatDisplayDate, getLocalDateKey, getMonthMatrix } from '@/lib/date'
import { getPostGridImages } from '@/lib/grid'
import { t } from '@/lib/i18n'
import { getColorVolumes, getLivingHueDeckCards, type DeckStage, type LivingHueDeckCard } from '@/lib/livingHueDeck'
import { DEFAULT_STORY_DESIGN, normalizeTemplateId, parseStoryStickers } from '@/lib/story'
import { cn } from '@/lib/utils'
import type { CaptureDraft, Locale, Post } from '@/types'

type DeckEvent = 'entered' | 'volume_opened' | 'source_opened' | 'story_opened'

type CalendarViewProps = {
  locale: Locale
  posts: Post[]
  currentDraft?: CaptureDraft | null
  masterCleanupByDate?: Record<string, { eligible: boolean; masterCount: number; masterBytes?: number }>
  onCleanupMaster?: (localDate: string) => Promise<void>
  onStartCamera?: () => void
  onDeckEvent?: (event: DeckEvent, sessionId: string) => void
  onDeckStageVisible?: (stage: DeckStage, sessionId: string) => void
  onStoryExported?: (post: Post, kind: 'story' | 'grid', delivery: 'download' | 'share') => void
  onStoryShareOpened?: (post: Post, kind: 'story' | 'grid') => void
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function createDeckSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `deck-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function CalendarView({ locale, posts, currentDraft, masterCleanupByDate = {}, onCleanupMaster, onStartCamera, onDeckEvent, onDeckStageVisible, onStoryExported, onStoryShareOpened }: CalendarViewProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey())
  const [showStoryStudio, setShowStoryStudio] = useState(false)
  const [contentView, setContentView] = useState<'record' | 'deck' | 'volume'>('record')
  const [storyReturnView, setStoryReturnView] = useState<'record' | 'deck' | 'volume'>('record')
  const [selectedVolumeHex, setSelectedVolumeHex] = useState<string | null>(null)
  const [deckVisit, setDeckVisit] = useState(0)
  const [showMasterCleanupConfirm, setShowMasterCleanupConfirm] = useState(false)
  const [isCleaningMaster, setIsCleaningMaster] = useState(false)
  const [masterCleanupError, setMasterCleanupError] = useState<string | null>(null)
  const postsByDate = useMemo(() => new Map(posts.map((post) => [post.local_date, post])), [posts])
  const selectedPost = postsByDate.get(selectedDate)
  const masterCleanup = masterCleanupByDate[selectedDate]
  const days = getMonthMatrix(visibleMonth)
  const localeCode = locale === 'ko' ? 'ko-KR' : 'en-US'
  const monthly = getMonthlyCollection(posts, visibleMonth)
  const deckCards = useMemo(() => getLivingHueDeckCards(posts), [posts])
  const colorVolumes = useMemo(() => getColorVolumes(deckCards), [deckCards])
  const selectedVolume = colorVolumes.find((volume) => volume.missionHex === selectedVolumeHex)
  const deckSessionRef = useRef<string | null>(null)
  const seenDeckStagesRef = useRef(new Set<DeckStage>())
  const todayKey = getLocalDateKey()
  const todayOriginalDraftImages =
    selectedDate === todayKey && currentDraft?.gridImages.length
      ? currentDraft.gridImages
      : null
  const selectedGridImages = todayOriginalDraftImages ?? getPostGridImages(selectedPost)
  const selectedStoryData = selectedPost
    ? {
        dateLabel: formatDisplayDate(selectedPost.local_date, localeCode),
        missionLabel: selectedPost.mission_label || t(locale, 'todayColor'),
        missionHex: selectedPost.mission_hex,
        colorName: selectedPost.custom_color_name ?? undefined,
        moodText: selectedPost.journal_answer ?? undefined,
        gridImages: selectedGridImages,
      }
    : null
  const selectedStoryDesign = selectedPost
    ? {
        templateId: normalizeTemplateId(selectedPost.story_template_id),
        stickers: parseStoryStickers(selectedPost.story_stickers).length
          ? parseStoryStickers(selectedPost.story_stickers)
          : DEFAULT_STORY_DESIGN.stickers,
      }
    : DEFAULT_STORY_DESIGN

  function shiftMonth(delta: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  const openDeck = useCallback(() => {
    deckSessionRef.current = createDeckSessionId()
    seenDeckStagesRef.current.clear()
    setDeckVisit((visit) => visit + 1)
    setContentView('deck')
    setShowStoryStudio(false)
  }, [])

  const handleDeckEntered = useCallback(() => {
    const sessionId = deckSessionRef.current ?? createDeckSessionId()
    deckSessionRef.current = sessionId
    onDeckEvent?.('entered', sessionId)
  }, [onDeckEvent])

  const handleDeckStageVisible = useCallback((stage: DeckStage) => {
    const sessionId = deckSessionRef.current
    if (!sessionId || seenDeckStagesRef.current.has(stage)) return
    seenDeckStagesRef.current.add(stage)
    onDeckStageVisible?.(stage, sessionId)
  }, [onDeckStageVisible])

  function openDeckRecord(card: LivingHueDeckCard) {
    if (deckSessionRef.current) onDeckEvent?.('source_opened', deckSessionRef.current)
    setSelectedDate(card.post.local_date)
    setContentView('record')
    setShowStoryStudio(false)
  }

  function openDeckStory(card: LivingHueDeckCard) {
    if (deckSessionRef.current) onDeckEvent?.('story_opened', deckSessionRef.current)
    setSelectedDate(card.post.local_date)
    setStoryReturnView(contentView)
    setShowStoryStudio(true)
  }

  function openVolume(missionHex: string) {
    if (deckSessionRef.current) onDeckEvent?.('volume_opened', deckSessionRef.current)
    setSelectedVolumeHex(missionHex)
    setContentView('volume')
  }

  useEffect(() => {
    document.body.classList.toggle('story-mode-active', showStoryStudio)
    return () => document.body.classList.remove('story-mode-active')
  }, [showStoryStudio])

  if (showStoryStudio && selectedStoryData) {
    return (
      <main className="screen-flow story-screen-page">
        <header className="story-page-header">
          <Button type="button" variant="ghost" size="icon" onClick={() => { setShowStoryStudio(false); setContentView(storyReturnView) }} aria-label="Back">
            <ChevronLeft aria-hidden="true" />
          </Button>
          <h1>{locale === 'ko' ? '스토리 만들기' : 'Make story'}</h1>
          <Button
            type="button"
            variant="ghost"
            onClick={() => document.querySelector<HTMLButtonElement>('.story-export-actions button')?.click()}
          >
            {t(locale, 'save')}
          </Button>
        </header>
        <div className="story-ratio-tabs" aria-label="Story ratio">
          <span className="is-active">9:16</span>
        </div>
        <StoryStudio
          locale={locale}
          data={selectedStoryData}
          initialDesign={selectedStoryDesign}
          onExported={(kind, delivery) => onStoryExported?.(selectedPost!, kind, delivery)}
          onShareOpened={(kind) => onStoryShareOpened?.(selectedPost!, kind)}
        />
      </main>
    )
  }

  if (contentView === 'volume' && selectedVolume) {
    return (
      <main className="screen-flow history-screen deck-history-screen">
        <ColorVolumeView locale={locale} volume={selectedVolume} onBack={() => setContentView('deck')} onOpenRecord={openDeckRecord} onOpenStory={openDeckStory} />
      </main>
    )
  }

  if (contentView === 'deck') {
    return (
      <main className="screen-flow history-screen deck-history-screen">
        <header className="app-header">
          <div><h1>{t(locale, 'calendar')}</h1></div>
        </header>
        <div className="history-view-switch" role="tablist" aria-label={locale === 'ko' ? '히스토리 보기' : 'History view'}>
          <button type="button" role="tab" aria-selected={false} onClick={() => setContentView('record')}>{locale === 'ko' ? '기록' : 'Records'}</button>
          <button type="button" role="tab" aria-selected className="is-active">Deck</button>
        </div>
        <LivingHueDeckView
          key={deckVisit}
          locale={locale}
          cards={deckCards}
          volumes={colorVolumes}
          onStartCamera={() => onStartCamera?.()}
          onOpenRecord={openDeckRecord}
          onOpenStory={openDeckStory}
          onOpenVolume={(volume) => openVolume(volume.missionHex)}
          onDeckEntered={handleDeckEntered}
          onCardStageVisible={handleDeckStageVisible}
        />
      </main>
    )
  }

  return (
    <main className="screen-flow history-screen">
      <header className="app-header">
        <div>
          <h1>{t(locale, 'calendar')}</h1>
        </div>
      </header>

      <div className="history-view-switch" role="tablist" aria-label={locale === 'ko' ? '히스토리 보기' : 'History view'}>
        <button type="button" role="tab" aria-selected className="is-active">{locale === 'ko' ? '기록' : 'Records'}</button>
        <button type="button" role="tab" aria-selected={false} onClick={openDeck}>Deck</button>
      </div>

      <section className="calendar-panel">
        <div className="calendar-header">
          <Button type="button" variant="ghost" size="icon" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            <ChevronLeft aria-hidden="true" />
          </Button>
          <h2>{new Intl.DateTimeFormat(localeCode, { month: 'long', year: 'numeric' }).format(visibleMonth)}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={() => shiftMonth(1)} aria-label="Next month">
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>

        <div className="weekday-row">
          {(locale === 'ko' ? ['일', '월', '화', '수', '목', '금', '토'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']).map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day) => {
            const key = getLocalDateKey(day)
            const post = postsByDate.get(key)
            const isCurrentMonth = day.getMonth() === visibleMonth.getMonth()
            const isFuture = key > todayKey
            const isSelected = key === selectedDate

            return (
              <button
                key={key}
                type="button"
                className={cn(
                  'calendar-day',
                  isSelected && 'calendar-day-selected',
                  !isCurrentMonth && 'calendar-day-muted',
                  !post && 'calendar-day-empty',
                  isFuture && 'calendar-day-future',
                )}
                style={isCurrentMonth && post && !isFuture ? ({ '--calendar-color': post.mission_hex } as CSSProperties) : undefined}
                onClick={() => {
                  setSelectedDate(key)
                  setContentView('record')
                  setShowStoryStudio(false)
                  setShowMasterCleanupConfirm(false)
                  setMasterCleanupError(null)
                }}
                aria-label={key}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      </section>

      <div className="history-drag-handle" aria-hidden="true" />

      <section className="history-detail">
        <div className="section-heading">
          <div>
            <p>{t(locale, 'selectedDay')}</p>
            <h2>{formatDisplayDate(selectedDate, localeCode)}</h2>
          </div>
          {selectedPost ? (
            <Button type="button" variant="outline" size="sm" className="history-detail-story-button" onClick={() => { setStoryReturnView('record'); setShowStoryStudio(true) }}>
              <Share2 aria-hidden="true" />
              {locale === 'ko' ? '스토리' : 'Story'}
            </Button>
          ) : null}
        </div>

        {selectedPost ? (
          <div className="history-entry history-entry-grid">
            <GridCollage
              locale={locale}
              missionHex={selectedPost.mission_hex}
              colorName={selectedPost.custom_color_name || selectedPost.mission_label || undefined}
              images={selectedGridImages}
              variant="mini"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-black">{selectedPost.custom_color_name || selectedPost.mission_label || selectedPost.mission_hex}</p>
              <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                {selectedGridImages.length}/8 · {selectedPost.mission_hex}
              </p>
              {selectedPost.journal_answer ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{selectedPost.journal_answer}</p> : null}
            </div>
          </div>
        ) : (
          <p className="rounded-[16px] bg-white/70 p-4 text-sm font-semibold text-muted-foreground">{t(locale, 'noEntry')}</p>
        )}

        {selectedPost && masterCleanup?.eligible && onCleanupMaster ? (
          <div className="mt-4 rounded-[16px] border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-sm font-black text-amber-950">기기 원본 정리</p>
            <p className="mt-1 text-xs leading-5 text-amber-900">동기화된 미리보기는 남기고 이 날짜의 고화질 원본만 기기에서 정리해요.</p>
            {!showMasterCleanupConfirm ? (
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setShowMasterCleanupConfirm(true)}>
                원본 정리하기
              </Button>
            ) : (
              <div className="mt-3 rounded-xl bg-white/85 p-3" role="alertdialog" aria-label="원본 정리 확인">
                <p className="text-sm font-bold text-slate-900">
                  고화질 원본 {masterCleanup.masterCount}장을 이 기기에서 삭제할까요?
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-700">
                  {masterCleanup.masterBytes === undefined ? '예상 용량 확인 불가' : `약 ${formatBytes(masterCleanup.masterBytes)} 확보`}. 기록, 저널, Story와 온라인 미리보기는 남지만 원본 품질로 복구할 수 없어요. 오프라인에서는 고화질 Story 재생성을 보장하지 않아요.
                </p>
                {masterCleanupError ? <p className="mt-2 text-xs font-bold text-rose-700">{masterCleanupError}</p> : null}
                <div className="mt-3 flex gap-2">
                  <Button type="button" variant="outline" size="sm" disabled={isCleaningMaster} onClick={() => { setShowMasterCleanupConfirm(false); setMasterCleanupError(null) }}>
                    취소
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isCleaningMaster}
                    onClick={() => {
                      setIsCleaningMaster(true)
                      setMasterCleanupError(null)
                      void onCleanupMaster(selectedDate)
                        .then(() => setShowMasterCleanupConfirm(false))
                        .catch((error) => setMasterCleanupError(error instanceof Error ? error.message : '원본 정리를 완료하지 못했어요.'))
                        .finally(() => setIsCleaningMaster(false))
                    }}
                  >
                    {isCleaningMaster ? '정리 중…' : '원본 삭제'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </section>

      <section className="history-stats-card" aria-label={locale === 'ko' ? '히스토리 통계' : 'History stats'}>
        <div>
          <CalendarDays aria-hidden="true" />
          <strong>{monthly.count}</strong>
          <span>{locale === 'ko' ? '기록한 날' : 'Recorded days'}</span>
        </div>
        <div>
          <CalendarDays aria-hidden="true" />
          <strong>{monthly.completedGridCount}</strong>
          <span>{locale === 'ko' ? '완성 그리드' : 'Grids'}</span>
        </div>
        <div>
          <Camera aria-hidden="true" />
          <strong>{monthly.photoCount}</strong>
          <span>{t(locale, 'photoRecord')}</span>
        </div>
      </section>
    </main>
  )
}
