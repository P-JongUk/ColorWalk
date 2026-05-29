import { Camera, Flame, Gauge, ChevronLeft, ChevronRight, MapPin, Share2 } from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'

import { StoryStudio } from '@/components/StoryStudio'
import { Button } from '@/components/ui/button'
import { getCurrentStreak, getMonthlyCollection } from '@/lib/collection'
import { formatDisplayDate, getLocalDateKey, getMonthMatrix } from '@/lib/date'
import { t } from '@/lib/i18n'
import { DEFAULT_STORY_DESIGN, normalizeTemplateId, parseStoryStickers } from '@/lib/story'
import { cn } from '@/lib/utils'
import type { Locale, Post } from '@/types'

const calendarPalette = ['#F5A8AD', '#F5C765', '#FFA88D', '#8FD3C0', '#ABD5EF', '#C7B8E8', '#D9D894', '#F2B7B7', '#9AD9C8']

function calendarTint(day: number) {
  return calendarPalette[(day - 1) % calendarPalette.length]
}

function resolvePostImageUrl(post: Post | undefined) {
  if (!post) return undefined
  if (post.signedImageUrl) return post.signedImageUrl
  if (/^(blob:|data:image\/|https?:\/\/)/.test(post.image_path)) return post.image_path
  return undefined
}

type CalendarViewProps = {
  locale: Locale
  posts: Post[]
}

export function CalendarView({ locale, posts }: CalendarViewProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey())
  const [showStoryStudio, setShowStoryStudio] = useState(false)
  const [brokenImages, setBrokenImages] = useState<Record<string, true>>({})
  const postsByDate = useMemo(() => new Map(posts.map((post) => [post.local_date, post])), [posts])
  const selectedPost = postsByDate.get(selectedDate)
  const selectedImageUrl = resolvePostImageUrl(selectedPost)
  const days = getMonthMatrix(visibleMonth)
  const localeCode = locale === 'ko' ? 'ko-KR' : 'en-US'
  const monthly = getMonthlyCollection(posts, visibleMonth)
  const streak = getCurrentStreak(posts)
  const selectedStoryData = selectedPost
    ? {
        imageUrl: selectedImageUrl,
        dateLabel: formatDisplayDate(selectedPost.local_date, localeCode),
        missionLabel: selectedPost.mission_label || t(locale, 'todayColor'),
        missionHex: selectedPost.mission_hex,
        capturedHex: selectedPost.captured_hex,
        matchRate: selectedPost.match_rate,
        colorName: selectedPost.custom_color_name ?? undefined,
        moodText: selectedPost.journal_answer ?? undefined,
        placeName: selectedPost.location_name ?? undefined,
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
          <h1 className="inline-flex items-center gap-1">
            {t(locale, 'calendar')}
            <MapPin className="title-accent-icon history-title-pin" aria-hidden="true" />
          </h1>
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
                )}
                style={isCurrentMonth ? ({ '--calendar-color': post ? post.captured_hex : calendarTint(day.getDate()) } as CSSProperties) : undefined}
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
          <div className="history-entry">
            {selectedImageUrl && !brokenImages[selectedPost.id] ? (
              <img
                src={selectedImageUrl}
                alt=""
                onError={() => setBrokenImages((current) => ({ ...current, [selectedPost.id]: true }))}
              />
            ) : (
              <div className="history-entry-fallback" style={{ backgroundColor: selectedPost.captured_hex }} />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-black">{selectedPost.custom_color_name || selectedPost.mission_label || selectedPost.captured_hex}</p>
              <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                {selectedPost.mission_hex} → {selectedPost.captured_hex}
              </p>
              {selectedPost.location_name ? <p className="history-place">{locale === 'ko' ? '장소' : 'Place'} · {selectedPost.location_name}</p> : null}
              <p className="mt-2 text-sm font-bold">
                {selectedPost.match_rate}% {t(locale, 'match')}
              </p>
              {selectedPost.journal_answer ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{selectedPost.journal_answer}</p> : null}
            </div>
            <div
              className="history-entry-match"
              style={{ '--match-angle': `${Math.min(100, Math.max(0, selectedPost.match_rate)) * 3.6}deg` } as CSSProperties}
              aria-label={`${selectedPost.match_rate}% ${t(locale, 'match')}`}
            >
              <strong>{selectedPost.match_rate}%</strong>
            </div>
          </div>
        ) : (
          <p className="rounded-[16px] bg-white/70 p-4 text-sm font-semibold text-muted-foreground">{t(locale, 'noEntry')}</p>
        )}
      </section>

      <section className="history-stats-card" aria-label={locale === 'ko' ? '히스토리 통계' : 'History stats'}>
        <div>
          <Flame aria-hidden="true" />
          <strong>{streak}</strong>
          <span>{t(locale, 'streak')}</span>
        </div>
        <div>
          <Gauge aria-hidden="true" />
          <strong>{monthly.count}</strong>
          <span>{locale === 'ko' ? '수집한 색' : 'Colors'}</span>
        </div>
        <div>
          <Camera aria-hidden="true" />
          <strong>{posts.length}</strong>
          <span>{t(locale, 'photoRecord')}</span>
        </div>
      </section>
    </main>
  )
}
