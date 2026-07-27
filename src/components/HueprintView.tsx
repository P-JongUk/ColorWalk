import { ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react'
import { type CSSProperties, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ColorWalkMark } from '@/components/ColorWalkMark'
import { Button } from '@/components/ui/button'
import { getHueprintDetailTier } from '@/lib/collection'
import { formatDisplayDate } from '@/lib/date'
import {
  getColorCapsules,
  getColorMemoryCard,
  getWeeklyHueprint,
  getWeekNavigation,
  isInvalidOnlyWeek,
  resolveHueprintCover,
  type ColorCapsule,
  type HueprintCover,
  type HueprintDay,
  type WeeklyHueprint,
} from '@/lib/hueprint'
import { t } from '@/lib/i18n'
import { deliverExport, exportElementToPngFile, exportTimestampFilename, shareDialogCopy, type ExportDelivery } from '@/lib/shareImage'
import type { Locale, Post } from '@/types'

function localeCode(locale: Locale) {
  return locale === 'ko' ? 'ko-KR' : 'en-US'
}

function dayThumbUrl(day: HueprintDay) {
  const restorable = day.images.find((image) => image.signedUrl ?? image.previewUrl)
  return restorable ? (restorable.signedUrl ?? restorable.previewUrl) : undefined
}

function DayList({ locale, days, onOpenDay }: { locale: Locale; days: HueprintDay[]; onOpenDay: (day: HueprintDay) => void }) {
  return (
    <div className="hueprint-day-list">
      {days.map((day) => {
        const thumbUrl = dayThumbUrl(day)
        return (
          <button key={day.localDate} type="button" className="hueprint-day-row" onClick={() => onOpenDay(day)}>
            {thumbUrl ? <span className="hueprint-day-thumb" style={{ backgroundImage: `url("${thumbUrl}")` }} /> : <span className="hueprint-day-thumb" style={{ backgroundColor: day.missionHex }} />}
            <span className="min-w-0 flex-1">
              <strong className="block truncate">{formatDisplayDate(day.localDate, localeCode(locale))}</strong>
              <span>{day.photoCount}/8 · {day.missionHex}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Offscreen 9:16 export source shared by Hueprint week and Color Capsule month exports.
 * Rendered off-screen (not inside the visible scroll flow) purely as an html2canvas
 * source - never inside the daily Story Studio's template/sticker model.
 */
function ExportCard9x16({
  exportRef,
  title,
  subtitle,
  coverUrl,
  accentHex,
  palette,
  stat1,
  stat2,
}: {
  exportRef: React.Ref<HTMLDivElement>
  title: string
  subtitle: string
  coverUrl?: string
  accentHex?: string | null
  palette: string[]
  stat1: { label: string; value: number }
  stat2: { label: string; value: number }
}) {
  return (
    <div ref={exportRef} className="hueprint-export-card" style={accentHex ? ({ '--hueprint-accent': accentHex } as CSSProperties) : undefined}>
      <div className="hueprint-export-cover">
        {coverUrl ? <div className="hueprint-export-cover-image" style={{ backgroundImage: `url("${coverUrl}")` }} /> : null}
      </div>
      <div className="hueprint-export-body">
        <p className="hueprint-export-subtitle">{subtitle}</p>
        <h2 className="hueprint-export-title">{title}</h2>
        <div className="hueprint-export-stats">
          <span><strong>{stat1.value}</strong>{stat1.label}</span>
          <span><strong>{stat2.value}</strong>{stat2.label}</span>
        </div>
        <div className="hueprint-export-palette">
          {palette.slice(0, 14).map((hex, index) => (
            <span key={`${hex}-${index}`} style={{ backgroundColor: hex }} />
          ))}
        </div>
      </div>
      <footer className="hueprint-export-footer">
        <ColorWalkMark compact />
        <span>Hueday</span>
      </footer>
    </div>
  )
}

type ExportArtifact = 'hueprint' | 'color_capsule'

type ExportPanelProps = {
  locale: Locale
  artifact: ExportArtifact
  filenamePrefix: string
  label: string
  card: {
    title: string
    subtitle: string
    coverUrl?: string
    accentHex?: string | null
    palette: string[]
    stat1: { label: string; value: number }
    stat2: { label: string; value: number }
  }
  onExported?: (delivery: ExportDelivery) => void
  onShareOpened?: () => void
}

/**
 * Renders the offscreen export card plus save/share buttons. Success analytics
 * (`onExported`) fires only after deliverExport actually resolves; a failed render,
 * failed file write, or cancelled/rejected share never calls it.
 */
function ExportPanel({ locale, artifact, filenamePrefix, label, card, onExported, onShareOpened }: ExportPanelProps) {
  const exportRef = useRef<HTMLDivElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  async function runExport(mode: ExportDelivery) {
    const target = exportRef.current
    if (!target || isExporting) return
    setIsExporting(true)
    try {
      const file = await exportElementToPngFile(target, exportTimestampFilename(filenamePrefix), { width: 1080, height: 1920 })
      if (mode === 'share') onShareOpened?.()
      await deliverExport(file, mode, artifact === 'hueprint' ? 'hueprint' : 'color-capsule', shareDialogCopy(locale, label, mode))
      onExported?.(mode)
      toast.success(t(locale, 'storySaved'))
    } catch (error) {
      console.error(error)
      toast.error(t(locale, 'saveFailed'))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <div className="hueprint-export-source" aria-hidden="true">
        <ExportCard9x16 exportRef={exportRef} {...card} />
      </div>
      <div className="hueprint-actions">
        <Button type="button" variant="outline" disabled={isExporting} onClick={() => void runExport('download')}>
          <Download data-icon="inline-start" aria-hidden="true" />
          {t(locale, 'download')}
        </Button>
        <Button type="button" disabled={isExporting} onClick={() => void runExport('share')}>
          <Share2 data-icon="inline-start" aria-hidden="true" />
          {t(locale, 'share')}
        </Button>
      </div>
    </>
  )
}

type HueprintWeekViewProps = {
  locale: Locale
  ownerId: string
  posts: Post[]
  weekKey: string
  onChangeWeek: (weekKey: string) => void
  onOpenDay: (day: HueprintDay) => void
  onChangeCover: (week: WeeklyHueprint) => void
  onOpenHistory: () => void
  onOpenCapsule: () => void
  onExported?: (delivery: ExportDelivery) => void
  onShareOpened?: () => void
}

function weekRangeLabel(locale: Locale, week: WeeklyHueprint) {
  const start = formatDisplayDate(week.startDate, localeCode(locale))
  const end = formatDisplayDate(week.endDate, localeCode(locale))
  return `${start} – ${end}`
}

export function HueprintWeekView({ locale, ownerId, posts, weekKey, onChangeWeek, onOpenDay, onChangeCover, onOpenHistory, onOpenCapsule, onExported, onShareOpened }: HueprintWeekViewProps) {
  const week = getWeeklyHueprint(posts, weekKey)
  const navigation = getWeekNavigation(posts, weekKey)
  const cover = resolveHueprintCover(ownerId, week)
  const tier = getHueprintDetailTier(posts)
  const invalidOnly = !week.recordedDayCount && isInvalidOnlyWeek(posts, weekKey)

  return (
    <section className={`hueprint-screen hueprint-tier-${tier}`}>
      <div className="hueprint-week-nav">
        <Button type="button" variant="ghost" size="icon" disabled={!navigation.canGoPrevious} onClick={() => navigation.previousWeekKey && onChangeWeek(navigation.previousWeekKey)} aria-label={locale === 'ko' ? '이전 주' : 'Previous week'}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <h2>{weekRangeLabel(locale, week)}</h2>
        <Button type="button" variant="ghost" size="icon" disabled={!navigation.canGoNext} onClick={() => navigation.nextWeekKey && onChangeWeek(navigation.nextWeekKey)} aria-label={locale === 'ko' ? '다음 주' : 'Next week'}>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>

      {!week.recordedDayCount ? (
        <div className={`hueprint-empty-week ${invalidOnly ? 'hueprint-invalid-week' : ''}`}>
          {invalidOnly ? (
            <>
              <p>{locale === 'ko' ? '이 주의 기록은 기록함에서 그대로 볼 수 있어요' : 'You can still see this week in your records'}</p>
              <Button type="button" size="sm" onClick={onOpenHistory}>{locale === 'ko' ? '기록함에서 보기' : 'Open records'}</Button>
            </>
          ) : (
            <>
              <p>{locale === 'ko' ? '이번 주는 아직 비어 있어요.' : 'This week is still empty.'}</p>
              <Button type="button" size="sm" onClick={onOpenHistory}>{locale === 'ko' ? '오늘의 색 찾기' : "Find today's color"}</Button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="hueprint-card">
            <div className="hueprint-cover" style={week.accentHex ? ({ '--hueprint-accent': week.accentHex } as CSSProperties) : undefined}>
              {cover?.imageUrl ? (
                <div className="hueprint-cover-image" style={{ backgroundImage: `url("${cover.imageUrl}")` }} />
              ) : (
                <div className="hueprint-cover-empty">{locale === 'ko' ? '표지 사진을 불러올 수 없어요' : 'Cover photo unavailable'}</div>
              )}
              <div className="hueprint-cover-meta">
                <span>{week.accentHex ?? ''}</span>
                <span>{week.photoCount} {locale === 'ko' ? '장의 장면' : 'photos'}</span>
              </div>
            </div>

            <div className="hueprint-stats-row">
              <div className="hueprint-stat">
                <strong>{week.recordedDayCount}</strong>
                <span>{locale === 'ko' ? '기록한 날' : 'Recorded days'}</span>
              </div>
              <div className="hueprint-stat">
                <strong>{week.completedGridCount}</strong>
                <span>{locale === 'ko' ? '완성한 페이지' : 'Completed pages'}</span>
              </div>
            </div>

            <div className="hueprint-palette" aria-label={locale === 'ko' ? '이번 주 기록한 색' : 'Colors recorded this week'}>
              {week.palette.map((hex, index) => (
                <span key={`${hex}-${index}`} className="hueprint-palette-swatch" style={{ backgroundColor: hex }} />
              ))}
            </div>

            <DayList locale={locale} days={week.days} onOpenDay={onOpenDay} />

            <ExportPanel
              locale={locale}
              artifact="hueprint"
              filenamePrefix="hueday-hueprint"
              label="Hueprint"
              card={{
                title: locale === 'ko' ? '이번 주 Hueprint' : 'This week\'s Hueprint',
                subtitle: weekRangeLabel(locale, week),
                coverUrl: cover?.imageUrl,
                accentHex: week.accentHex,
                palette: week.palette,
                stat1: { value: week.recordedDayCount, label: locale === 'ko' ? '기록한 날' : ' recorded' },
                stat2: { value: week.completedGridCount, label: locale === 'ko' ? '완성한 페이지' : ' complete' },
              }}
              onExported={onExported}
              onShareOpened={onShareOpened}
            />
          </div>

          <div className="hueprint-actions hueprint-actions-secondary">
            <Button type="button" variant="outline" onClick={() => onChangeCover(week)}>
              {locale === 'ko' ? '표지 바꾸기' : 'Change cover'}
            </Button>
          </div>
        </>
      )}

      <div className="hueprint-actions hueprint-actions-secondary">
        <Button type="button" variant="outline" onClick={onOpenCapsule}>
          {locale === 'ko' ? 'Color Capsule 보기' : 'View Color Capsule'}
        </Button>
      </div>
    </section>
  )
}

type ColorCapsuleArchiveViewProps = {
  locale: Locale
  posts: Post[]
  onOpenMonth: (monthKey: string) => void
  onOpenDay: (day: HueprintDay) => void
  onOpenHistory: () => void
}

export function ColorCapsuleArchiveView({ locale, posts, onOpenMonth, onOpenDay, onOpenHistory }: ColorCapsuleArchiveViewProps) {
  const capsules = getColorCapsules(posts)
  const memory = getColorMemoryCard(posts)

  return (
    <section className="capsule-screen">
      <header className="deck-header">
        <p>{locale === 'ko' ? '월간 아카이브' : 'Monthly archive'}</p>
        <h1>Color Capsule</h1>
      </header>

      {memory ? (
        <button type="button" className="color-memory-card" onClick={() => onOpenDay(memory.day)}>
          {memory.cover.imageUrl ? <span className="color-memory-photo" style={{ backgroundImage: `url("${memory.cover.imageUrl}")` }} /> : <span className="color-memory-photo" style={{ backgroundColor: memory.day.missionHex }} />}
          <span className="min-w-0 flex-1 text-left">
            <strong className="block">
              {memory.kind === 'same-day'
                ? (locale === 'ko' ? `${memory.yearsAgo}년 전 오늘` : `${memory.yearsAgo} year${memory.yearsAgo === 1 ? '' : 's'} ago today`)
                : (locale === 'ko' ? '한 달 전 이맘때' : 'About a month ago')}
            </strong>
            <span>{formatDisplayDate(memory.day.localDate, localeCode(locale))} · {memory.day.missionHex}</span>
          </span>
        </button>
      ) : null}

      {capsules.length ? (
        <div className="capsule-tile-list">
          {capsules.map((capsule) => (
            <button key={capsule.monthKey} type="button" className="capsule-tile" onClick={() => onOpenMonth(capsule.monthKey)}>
              <span className="capsule-tile-photos">
                {capsule.representativePhotos.slice(0, 3).map((cover: HueprintCover) => (
                  <span key={cover.imageId} style={cover.imageUrl ? { backgroundImage: `url("${cover.imageUrl}")` } : undefined} />
                ))}
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block">{capsule.monthKey}</strong>
                <span className="capsule-tile-meta">
                  {locale === 'ko'
                    ? `기록한 날 ${capsule.recordedDayCount}일 · 완성 ${capsule.completedGridCount}개`
                    : `${capsule.recordedDayCount} recorded · ${capsule.completedGridCount} complete`}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="hueprint-empty-week">
          <p>{locale === 'ko' ? '아직 완성된 월간 기록이 없어요.' : 'No monthly archive yet.'}</p>
          <Button type="button" size="sm" onClick={onOpenHistory}>{locale === 'ko' ? '오늘의 색 찾기' : "Find today's color"}</Button>
        </div>
      )}
    </section>
  )
}

type ColorCapsuleMonthViewProps = {
  locale: Locale
  capsule: ColorCapsule
  onBack: () => void
  onOpenDay: (day: HueprintDay) => void
  onExported?: (delivery: ExportDelivery) => void
  onShareOpened?: () => void
}

export function ColorCapsuleMonthView({ locale, capsule, onBack, onOpenDay, onExported, onShareOpened }: ColorCapsuleMonthViewProps) {
  const representativeCover = capsule.representativePhotos[0]

  return (
    <section className="capsule-screen">
      <button type="button" className="deck-back-button" onClick={onBack}>
        <ChevronLeft aria-hidden="true" />
        {locale === 'ko' ? 'Color Capsule' : 'Color Capsule'}
      </button>
      <header className="deck-header">
        <p>{capsule.isCurrentMonth ? (locale === 'ko' ? '진행 중인 달' : 'This month') : (locale === 'ko' ? '지난 달' : 'Past month')}</p>
        <h1>{capsule.monthKey}</h1>
      </header>

      <div className="hueprint-card">
        <div className="hueprint-stats-row">
          <div className="hueprint-stat">
            <strong>{capsule.recordedDayCount}</strong>
            <span>{locale === 'ko' ? '기록한 날' : 'Recorded days'}</span>
          </div>
          <div className="hueprint-stat">
            <strong>{capsule.completedGridCount}</strong>
            <span>{locale === 'ko' ? '완성한 페이지' : 'Completed pages'}</span>
          </div>
        </div>

        <div className="hueprint-palette">
          {capsule.palette.map((hex, index) => (
            <span key={`${hex}-${index}`} className="hueprint-palette-swatch" style={{ backgroundColor: hex }} />
          ))}
        </div>

        <DayList locale={locale} days={capsule.days} onOpenDay={onOpenDay} />

        <ExportPanel
          locale={locale}
          artifact="color_capsule"
          filenamePrefix="hueday-color-capsule"
          label="Color Capsule"
          card={{
            title: capsule.monthKey,
            subtitle: locale === 'ko' ? 'Color Capsule' : 'Color Capsule',
            coverUrl: representativeCover?.imageUrl,
            accentHex: capsule.palette[capsule.palette.length - 1] ?? null,
            palette: capsule.palette,
            stat1: { value: capsule.recordedDayCount, label: locale === 'ko' ? '기록한 날' : ' recorded' },
            stat2: { value: capsule.completedGridCount, label: locale === 'ko' ? '완성한 페이지' : ' complete' },
          }}
          onExported={onExported}
          onShareOpened={onShareOpened}
        />
      </div>
    </section>
  )
}
