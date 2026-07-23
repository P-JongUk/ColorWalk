import { CalendarDays, Camera, ChevronLeft, ChevronRight, Share2 } from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'

import { GridCollage } from '@/components/GridCollage'
import { StoryStudio } from '@/components/StoryStudio'
import { Button } from '@/components/ui/button'
import { getMonthlyCollection } from '@/lib/collection'
import { formatDisplayDate, getLocalDateKey, getMonthMatrix } from '@/lib/date'
import { getPostGridImages } from '@/lib/grid'
import { t } from '@/lib/i18n'
import { DEFAULT_STORY_DESIGN, normalizeTemplateId, parseStoryStickers } from '@/lib/story'
import { cn } from '@/lib/utils'
import type { CaptureDraft, Locale, Post } from '@/types'

type CalendarViewProps = {
  locale: Locale
  posts: Post[]
  currentDraft?: CaptureDraft | null
}

export function CalendarView({ locale, posts, currentDraft }: CalendarViewProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey())
  const [showStoryStudio, setShowStoryStudio] = useState(false)
  const postsByDate = useMemo(() => new Map(posts.map((post) => [post.local_date, post])), [posts])
  const selectedPost = postsByDate.get(selectedDate)
  const days = getMonthMatrix(visibleMonth)
  const localeCode = locale === 'ko' ? 'ko-KR' : 'en-US'
  const monthly = getMonthlyCollection(posts, visibleMonth)
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

  useEffect(() => {
    document.body.classList.toggle('story-mode-active', showStoryStudio)
    return () => document.body.classList.remove('story-mode-active')
  }, [showStoryStudio])

  if (showStoryStudio && selectedStoryData) {
    return (
      <main className="screen-flow story-screen-page">
        <header className="story-page-header">
          <Button type="button" variant="ghost" size="icon" onClick={() => setShowStoryStudio(false)} aria-label="Back">
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
        <StoryStudio locale={locale} data={selectedStoryData} initialDesign={selectedStoryDesign} />
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
                  setShowStoryStudio(false)
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
            <Button type="button" variant="outline" size="sm" className="history-detail-story-button" onClick={() => setShowStoryStudio(true)}>
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
