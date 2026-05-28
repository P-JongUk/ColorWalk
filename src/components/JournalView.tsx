import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, MapPin } from 'lucide-react'

import { ReceiptCard } from '@/components/ReceiptCard'
import { StoryStudio } from '@/components/StoryStudio'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_STORY_DESIGN } from '@/lib/story'
import { getMoodColorSuggestions } from '@/lib/collection'
import { getJournalPrompt } from '@/lib/journal'
import { t } from '@/lib/i18n'
import { getCurrentSavedLocation } from '@/lib/location'
import { fetchColorNameSuggestions } from '@/lib/supabase'
import type { CaptureDraft, Locale, Mission, SavedLocation, StoryDesign } from '@/types'

type JournalViewProps = {
  locale: Locale
  mission: Mission
  draft: CaptureDraft | null
  isSaving: boolean
  onOpenCamera: () => void
  onSave: (payload: { colorName: string; journalAnswer: string; storyDesign: StoryDesign; location: SavedLocation | null }) => Promise<void>
}

export function JournalView({ locale, mission, draft, isSaving, onOpenCamera, onSave }: JournalViewProps) {
  const [colorName, setColorName] = useState('')
  const [journalAnswer, setJournalAnswer] = useState('')
  const [storyDesign, setStoryDesign] = useState<StoryDesign>(DEFAULT_STORY_DESIGN)
  const [savePlace, setSavePlace] = useState(false)
  const [placeName, setPlaceName] = useState('')
  const [location, setLocation] = useState<SavedLocation | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [remoteSuggestions, setRemoteSuggestions] = useState<string[]>([])
  const activeHex = draft?.capturedHex ?? mission.hex
  const prompt = useMemo(
    () => getJournalPrompt(activeHex, locale),
    [activeHex, locale],
  )
  const fallbackSuggestions = useMemo(
    () => getMoodColorSuggestions(activeHex, locale),
    [activeHex, locale],
  )
  const suggestions = remoteSuggestions.length ? remoteSuggestions : fallbackSuggestions
  const colorNameLimit = locale === 'ko' ? 20 : 28
  const placeLimit = locale === 'ko' ? 24 : 32
  const savePayload = {
    colorName,
    journalAnswer,
    storyDesign,
    location: savePlace
      ? {
          name: placeName.trim() || location?.name || null,
          latitude: location?.latitude ?? null,
          longitude: location?.longitude ?? null,
          accuracyMeters: location?.accuracyMeters ?? null,
        }
      : null,
  }
  const dateLabel = new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date())
  const storyData = {
    imageUrl: draft?.previewUrl,
    dateLabel,
    missionLabel: mission.label[locale],
    missionHex: mission.hex,
    capturedHex: draft?.capturedHex ?? mission.hex,
    matchRate: draft?.matchRate ?? 0,
    colorName,
    moodText: journalAnswer,
    placeName: savePayload.location?.name ?? undefined,
  }

  useEffect(() => {
    let cancelled = false

    fetchColorNameSuggestions(activeHex, locale).then((names) => {
      if (!cancelled) setRemoteSuggestions(names)
    })

    return () => {
      cancelled = true
    }
  }, [activeHex, locale])

  async function requestPlace() {
    setSavePlace(true)
    setIsLocating(true)
    setLocationError(null)

    try {
      const nextLocation = await getCurrentSavedLocation()
      setLocation(nextLocation)
    } catch {
      setLocationError(locale === 'ko' ? '위치 권한이 꺼져 있어요. 장소 이름만 저장할 수 있어요.' : 'Location permission is off. You can still save a place name.')
    } finally {
      setIsLocating(false)
    }
  }

  if (!draft) {
    return (
      <main className="screen-flow">
        <section className="passport-panel flex min-h-[70svh] flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-lg font-black">{t(locale, 'noDraft')}</p>
          <Button type="button" onClick={onOpenCamera}>
            {t(locale, 'goCamera')}
          </Button>
        </section>
      </main>
    )
  }

  return (
    <main className="screen-flow journal-screen">
      <header className="journal-header">
        <Button type="button" variant="ghost" size="icon" onClick={onOpenCamera} aria-label={t(locale, 'camera')}>
          <ArrowLeft aria-hidden="true" />
        </Button>
        <div>
          <h1>{locale === 'ko' ? '저널 작성' : 'Write journal'}</h1>
          <div className="journal-progress" aria-hidden="true">
            <span>✓</span>
            <span>✓</span>
            <span>✓</span>
            <b>3</b>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          disabled={isSaving}
          onClick={() => void onSave(savePayload)}
        >
          {isSaving ? t(locale, 'saving') : t(locale, 'save')}
        </Button>
      </header>

      <section className="journal-summary-card">
        <div className="journal-match">
          <small>{t(locale, 'match')}</small>
          <span
            className="journal-match-dial"
            style={{ '--match-angle': `${Math.min(100, Math.max(0, draft.matchRate)) * 3.6}deg` } as CSSProperties}
          >
            <strong>{draft.matchRate}%</strong>
          </span>
        </div>
        <div className="journal-mini-swatch">
          <span style={{ backgroundColor: mission.hex }} />
          <small>{t(locale, 'target')}</small>
          <b>{mission.hex}</b>
        </div>
        <ArrowRight aria-hidden="true" />
        <div className="journal-mini-swatch">
          <span style={{ backgroundColor: draft.capturedHex }} />
          <small>{t(locale, 'sampled')}</small>
          <b>{draft.capturedHex}</b>
        </div>
      </section>

      <section className="journal-capture">
        <img src={draft.previewUrl} alt="" />
      </section>

      <section className="journal-form-card">
        <label className="journal-field">
          <span>{t(locale, 'colorName')}</span>
          <div className="journal-input-action">
            <Input
              value={colorName}
              onChange={(event) => setColorName(event.target.value)}
              placeholder={suggestions[0] ?? t(locale, 'colorNamePlaceholder')}
              maxLength={colorNameLimit}
            />
            <button type="button" onClick={() => void requestPlace()} aria-label={locale === 'ko' ? '위치 스탬프' : 'Place stamp'}>
              <MapPin aria-hidden="true" />
            </button>
          </div>
          <small>{colorName.length}/{colorNameLimit}</small>
        </label>

        <div className="journal-place-card">
          <button
            type="button"
            className={savePlace ? 'journal-place-toggle is-active' : 'journal-place-toggle'}
            onClick={() => {
              if (savePlace) {
                setSavePlace(false)
                setLocationError(null)
                return
              }
              void requestPlace()
            }}
            aria-pressed={savePlace}
          >
            <MapPin aria-hidden="true" />
            <span>{locale === 'ko' ? '찍은 장소도 함께 저장' : 'Save where I found it'}</span>
            <strong>{savePlace ? (locale === 'ko' ? '켜짐' : 'On') : (locale === 'ko' ? '선택' : 'Optional')}</strong>
          </button>
          {savePlace ? (
            <div className="journal-place-fields">
              <Input
                value={placeName}
                onChange={(event) => setPlaceName(event.target.value)}
                placeholder={locale === 'ko' ? '예: 학교 앞 골목, 한강 산책길' : 'ex. School alley, riverside walk'}
                maxLength={placeLimit}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => void requestPlace()} disabled={isLocating}>
                {isLocating ? (locale === 'ko' ? '찾는 중' : 'Locating') : (locale === 'ko' ? '현재 위치' : 'Use location')}
              </Button>
              {location ? (
                <small>
                  {locale === 'ko' ? '좌표 저장됨' : 'Coordinates saved'}
                  {location.accuracyMeters ? ` · ±${location.accuracyMeters}m` : ''}
                </small>
              ) : null}
              {locationError ? <small className="journal-place-error">{locationError}</small> : null}
            </div>
          ) : null}
        </div>

        <div className="suggestion-row">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => setColorName(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>

        <label className="journal-field">
          <span>{prompt}</span>
          <Textarea value={journalAnswer} onChange={(event) => setJournalAnswer(event.target.value)} placeholder={t(locale, 'journalAnswer')} maxLength={120} />
          <small>{journalAnswer.length}/120</small>
        </label>

      </section>

      <section className="flex flex-col gap-3">
        <ReceiptCard
          locale={locale}
          mission={mission}
          capturedHex={draft.capturedHex}
          matchRate={draft.matchRate}
          colorName={colorName}
          journalAnswer={journalAnswer}
          locationName={savePayload.location?.name ?? undefined}
        />
        <Button type="button" size="lg" className="journal-save-cta" disabled={isSaving} onClick={() => void onSave(savePayload)}>
          {isSaving ? t(locale, 'saving') : locale === 'ko' ? '기록 저장' : t(locale, 'save')}
          <Bookmark data-icon="inline-end" aria-hidden="true" />
        </Button>
      </section>

      <section className="journal-story-section">
        <StoryStudio
          locale={locale}
          data={storyData}
          initialDesign={storyDesign}
          onDesignChange={setStoryDesign}
        />
      </section>

    </main>
  )
}
