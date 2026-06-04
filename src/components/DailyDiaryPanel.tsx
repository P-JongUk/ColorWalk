import type { Locale } from '@/types'

type DailyDiaryPanelProps = {
  locale: Locale
  dateLabel: string
  missionHex: string
  missionLabel: string
  value: string
  onChange: (value: string) => void
}

const diaryMoodSeeds = {
  ko: ['몽글한', '차분한', '가벼운', '선명한'],
  en: ['soft', 'calm', 'light', 'vivid'],
} satisfies Record<Locale, string[]>

function joinMood(value: string, mood: string, locale: Locale) {
  const trimmed = value.trim()
  if (trimmed.includes(mood)) return value
  if (!trimmed) return locale === 'ko' ? `${mood} 색을 만난 하루.` : `A ${mood} color kind of day.`
  return locale === 'ko' ? `${trimmed} ${mood}.` : `${trimmed} ${mood}.`
}

export function DailyDiaryPanel({
  locale,
  dateLabel,
  missionHex,
  missionLabel,
  value,
  onChange,
}: DailyDiaryPanelProps) {
  const moods = diaryMoodSeeds[locale]

  return (
    <section className="daily-diary-panel" aria-label={locale === 'ko' ? '오늘의 일기' : 'Daily diary'}>
      <div className="daily-diary-stamp">
        <span>{locale === 'ko' ? '오늘의 일기' : 'Daily note'}</span>
        <strong>{dateLabel}</strong>
      </div>
      <div className="daily-diary-color">
        <span style={{ backgroundColor: missionHex }} aria-hidden="true" />
        <div>
          <p>{missionLabel}</p>
          <small>{missionHex}</small>
        </div>
      </div>
      <div className="daily-diary-chips">
        {moods.map((mood) => (
          <button key={mood} type="button" onClick={() => onChange(joinMood(value, mood, locale))}>
            {mood}
          </button>
        ))}
      </div>
    </section>
  )
}
