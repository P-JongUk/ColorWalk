import { Textarea } from '@/components/ui/textarea'
import type { Locale } from '@/types'

type DailyDiaryPanelProps = {
  locale: Locale
  dateLabel: string
  missionHex: string
  missionLabel: string
  prompt: string
  value: string
  onChange: (value: string) => void
}

export function DailyDiaryPanel({
  locale,
  dateLabel,
  missionHex,
  missionLabel,
  prompt,
  value,
  onChange,
}: DailyDiaryPanelProps) {
  const maxLength = locale === 'ko' ? 140 : 180

  return (
    <section className="daily-diary-panel" aria-label={locale === 'ko' ? '오늘의 일기' : 'Daily diary'}>
      <div className="daily-diary-head">
        <div className="daily-diary-color">
          <span style={{ backgroundColor: missionHex }} aria-hidden="true" />
          <div>
            <p>{locale === 'ko' ? '오늘의 한 줄' : 'Today in one line'}</p>
            <small>
              {dateLabel} · {missionLabel} · {missionHex}
            </small>
          </div>
        </div>
        <span className="daily-diary-count">
          {value.length}/{maxLength}
        </span>
      </div>

      <label className="daily-diary-writing">
        <span>{prompt}</span>
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            locale === 'ko'
              ? '예: 집 앞 골목에서 이 색을 만났는데, 오늘 기분이 조금 말랑해졌다.'
              : 'ex. I found this color on my way home, and the day felt softer.'
          }
          maxLength={maxLength}
        />
      </label>

      <div className="daily-diary-footnote">
        <strong>{locale === 'ko' ? '길게 안 써도 돼요.' : 'Keep it light.'}</strong>
        <span>
          {locale === 'ko'
            ? '색을 만난 장소, 떠오른 장면, 오늘 기분 중 하나만 남겨도 충분해요.'
            : 'A place, a scene, or one feeling is enough for today.'}
        </span>
      </div>
    </section>
  )
}
