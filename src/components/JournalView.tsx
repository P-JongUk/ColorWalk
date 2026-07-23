import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Bookmark } from 'lucide-react'

import { DailyDiaryPanel } from '@/components/DailyDiaryPanel'
import { GridCollage } from '@/components/GridCollage'
import { StoryStudio } from '@/components/StoryStudio'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getMoodColorSuggestions } from '@/lib/collection'
import { getJournalPrompt } from '@/lib/journal'
import { DEFAULT_STORY_DESIGN } from '@/lib/story'
import { t } from '@/lib/i18n'
import { fetchColorNameSuggestions } from '@/lib/supabase'
import type { CaptureDraft, Locale, Mission, StoryDesign } from '@/types'

type JournalViewProps = {
  locale: Locale
  mission: Mission
  draft: CaptureDraft | null
  isSaving: boolean
  onOpenCamera: () => void
  onPersistJournal: (payload: { colorName: string; journalAnswer: string; storyDesign: StoryDesign }) => void
  onSave: (payload: { colorName: string; journalAnswer: string; storyDesign: StoryDesign }) => Promise<void>
  onStoryExported: (kind: 'story' | 'grid', delivery: 'download' | 'share', platform: 'web' | 'android') => void
  onStoryShareOpened: (kind: 'story' | 'grid', platform: 'web' | 'android') => void
}

export function JournalView({ locale, mission, draft, isSaving, onOpenCamera, onPersistJournal, onSave, onStoryExported, onStoryShareOpened }: JournalViewProps) {
  const [colorName, setColorName] = useState(() => draft?.journal?.colorName ?? '')
  const [journalAnswer, setJournalAnswer] = useState(() => draft?.journal?.journalAnswer ?? '')
  const [storyDesign, setStoryDesign] = useState<StoryDesign>(() => draft?.journal?.storyDesign ?? DEFAULT_STORY_DESIGN)
  const [remoteSuggestions, setRemoteSuggestions] = useState<string[]>([])
  const activeHex = mission.hex
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
  const savePayload = {
    colorName,
    journalAnswer,
    storyDesign,
  }
  const dateLabel = new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date())
  const storyData = {
    dateLabel,
    missionLabel: mission.label[locale],
    missionHex: mission.hex,
    colorName,
    moodText: journalAnswer,
    gridImages: draft?.gridImages ?? [],
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

  function updateColorName(value: string) {
    setColorName(value)
    onPersistJournal({ colorName: value, journalAnswer, storyDesign })
  }

  function updateJournalAnswer(value: string) {
    setJournalAnswer(value)
    onPersistJournal({ colorName, journalAnswer: value, storyDesign })
  }

  function updateStoryDesign(value: StoryDesign) {
    setStoryDesign(value)
    onPersistJournal({ colorName, journalAnswer, storyDesign: value })
  }

  if (!draft || draft.gridImages.length === 0) {
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
            <span />
            <span />
            <b>{draft.gridImages.length}</b>
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

      <section className="journal-grid-panel">
        <div className="section-heading">
          <div>
            <p>{locale === 'ko' ? `${draft.gridImages.length}/8컷` : `${draft.gridImages.length}/8 shots`}</p>
            <h2>{mission.label[locale]}</h2>
          </div>
          <span className="journal-hex">{mission.hex}</span>
        </div>
        <GridCollage
          locale={locale}
          missionHex={mission.hex}
          colorName={colorName || mission.label[locale]}
          images={draft.gridImages}
          variant="journal"
          onEmptyClick={onOpenCamera}
        />
      </section>

      <section className="journal-form-card">
        <label className="journal-field">
          <span>{t(locale, 'colorName')}</span>
          <div className="journal-input-action">
            <Input
              value={colorName}
              onChange={(event) => updateColorName(event.target.value)}
              placeholder={suggestions[0] ?? t(locale, 'colorNamePlaceholder')}
              maxLength={colorNameLimit}
            />
          </div>
          <small>{colorName.length}/{colorNameLimit}</small>
        </label>

        <div className="suggestion-row">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => updateColorName(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>

        <DailyDiaryPanel
          locale={locale}
          dateLabel={dateLabel}
          missionHex={mission.hex}
          missionLabel={mission.label[locale]}
          prompt={prompt}
          value={journalAnswer}
          onChange={updateJournalAnswer}
        />
      </section>

      <Button type="button" size="lg" className="journal-save-cta" disabled={isSaving} onClick={() => void onSave(savePayload)}>
        {isSaving ? t(locale, 'saving') : locale === 'ko' ? '그리드 저장' : t(locale, 'save')}
        <Bookmark data-icon="inline-end" aria-hidden="true" />
      </Button>

      <section className="journal-story-section">
        <StoryStudio
          locale={locale}
          data={storyData}
          initialDesign={storyDesign}
          onDesignChange={updateStoryDesign}
          onExported={onStoryExported}
          onShareOpened={onStoryShareOpened}
        />
      </section>
    </main>
  )
}
