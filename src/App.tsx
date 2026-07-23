import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Toaster, toast } from 'sonner'
import type { Session } from '@supabase/supabase-js'

import { AuthGate } from '@/components/AuthGate'
import { BottomNav } from '@/components/BottomNav'
import { TodayView } from '@/components/TodayView'
import { getLocalDateKey } from '@/lib/date'
import { draftToDailyPost, mergeDailyRecords } from '@/lib/dailyRecord'
import { clearCachedDraft, loadCachedDraft, loadCachedDrafts, saveCachedDraft } from '@/lib/draftStorage'
import { getPostImagePaths, toStoredGridImages } from '@/lib/grid'
import { t } from '@/lib/i18n'
import { compressBlobToHistoryWebP } from '@/lib/image'
import { getRandomMission } from '@/lib/mission'
import { loadDailyMissionState, saveDailyMissionState } from '@/lib/missionState'
import { startWebReminderScheduler } from '@/lib/notifications'
import { deletePostImage, ensureProfile, fetchPosts, fetchProfile, isSupabaseConfigured, supabase, uploadPostImage, upsertPostWithGridFallback } from '@/lib/supabase'
import { loadTodayMission } from '@/lib/weather'
import { useColorWalkStore } from '@/store/useColorWalkStore'
import type { CaptureDraft, Post, StoryDesign, UserProfile } from '@/types'

const LOCAL_POSTS_KEY = 'colorwalk:local-posts'

const CalendarView = lazy(() => import('@/components/CalendarView').then((module) => ({ default: module.CalendarView })))
const CameraView = lazy(() => import('@/components/CameraView').then((module) => ({ default: module.CameraView })))
const JournalView = lazy(() => import('@/components/JournalView').then((module) => ({ default: module.JournalView })))
const ProfileView = lazy(() => import('@/components/ProfileView').then((module) => ({ default: module.ProfileView })))

function readLocalPosts(): Post[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || '[]') as Post[] } catch { return [] }
}

function writeLocalPosts(posts: Post[]) {
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts))
}

function App() {
  const { locale, activeTab, mission, usedFallbackLocation, draft, posts, setLocale, setActiveTab, setMission, setDraft, setPosts } = useColorWalkStore()
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured)
  const [isSaving, setIsSaving] = useState(false)
  const [isLocalOnly, setIsLocalOnly] = useState(!isSupabaseConfigured)
  const [dailyDrafts, setDailyDrafts] = useState<CaptureDraft[]>([])
  const ownerId = session?.user.id ?? 'local'
  const displayPosts = useMemo(() => mergeDailyRecords(posts, dailyDrafts, ownerId, locale), [dailyDrafts, locale, ownerId, posts])

  async function hydrateAuthenticatedSession(nextSession: Session) {
    if (nextSession.user.is_anonymous) {
      await supabase?.auth.signOut()
      setSession(null)
      setProfile(null)
      setPosts([])
      return
    }
    await ensureProfile(nextSession, locale)
    const [remotePosts, nextProfile] = await Promise.all([fetchPosts(nextSession.user.id), fetchProfile(nextSession.user.id)])
    setSession(nextSession)
    setProfile(nextProfile)
    setPosts(remotePosts)
    setIsLocalOnly(false)
  }

  useEffect(() => {
    let active = true
    async function bootMission() {
      try {
        const [weather, cachedDraft, cachedDrafts] = await Promise.all([loadTodayMission(locale), loadCachedDraft(ownerId), loadCachedDrafts(ownerId)])
        if (!active) return
        setDailyDrafts(cachedDrafts)
        if (cachedDraft) {
          setDraft(cachedDraft)
          setMission(cachedDraft.mission, weather.usedFallbackLocation)
          return
        }
        const localDate = getLocalDateKey()
        const stored = loadDailyMissionState(ownerId, localDate)
        if (stored) {
          setMission(stored.mission, weather.usedFallbackLocation)
          return
        }
        saveDailyMissionState(ownerId, { localDate, mission: weather.mission, rerollCount: 0, selectedAt: new Date().toISOString() })
        setMission(weather.mission, weather.usedFallbackLocation)
      } catch {
        toast.error(t(locale, 'loadingMission'))
      }
    }
    void bootMission()
    return () => { active = false }
  }, [locale, ownerId, setDraft, setMission])

  useEffect(() => {
    let active = true
    async function bootSupabase() {
      if (!isSupabaseConfigured) {
        setPosts(readLocalPosts())
        setIsLocalOnly(true)
        return
      }
      try {
        const { data: { session: nextSession } } = await supabase!.auth.getSession()
        if (!nextSession || nextSession.user.is_anonymous) {
          if (nextSession?.user.is_anonymous) await supabase!.auth.signOut()
          if (active) { setSession(null); setProfile(null); setPosts([]) }
          return
        }
        await hydrateAuthenticatedSession(nextSession)
      } catch {
        if (active) { setPosts(readLocalPosts()); setIsLocalOnly(true) }
      } finally {
        if (active) setIsAuthLoading(false)
      }
    }
    void bootSupabase()
    const { data } = supabase?.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!nextSession) { setProfile(null); setPosts([]) }
    }) ?? {}
    return () => { active = false; data?.subscription.unsubscribe() }
  // Auth boot intentionally runs once per locale; the helper reads the current locale/session state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, setPosts])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [activeTab])
  useEffect(() => { startWebReminderScheduler(locale) }, [locale, session])

  async function syncDraft(nextDraft: CaptureDraft, clearWhenComplete = false) {
    const localPost = draftToDailyPost(nextDraft, ownerId, locale)
    if (!supabase || !session) {
      const nextPosts = [localPost, ...posts.filter((post) => post.local_date !== nextDraft.localDate)]
      setPosts(nextPosts)
      writeLocalPosts(nextPosts)
      return
    }

    let uploadDraft = nextDraft
    for (const image of nextDraft.gridImages) {
      if (image.uploadPath) continue
      const compressed = await compressBlobToHistoryWebP(image.imageBlob)
      const uploadPath = await uploadPostImage(session.user.id, nextDraft.localDate, compressed.blob)
      uploadDraft = {
        ...uploadDraft,
        gridImages: uploadDraft.gridImages.map((candidate) => candidate.id === image.id
          ? { ...candidate, uploadPath, width: compressed.width, height: compressed.height, bytes: compressed.bytes, quality: compressed.quality }
          : candidate),
      }
      await saveCachedDraft(uploadDraft, ownerId)
    }
    const gridImages = toStoredGridImages(uploadDraft.gridImages, uploadDraft.gridImages.map((image) => image.uploadPath ?? ''))
    const existing = posts.find((post) => post.local_date === uploadDraft.localDate)
    const { error } = await upsertPostWithGridFallback({
      user_id: session.user.id,
      local_date: uploadDraft.localDate,
      mission_hex: uploadDraft.mission.hex,
      captured_hex: uploadDraft.mission.hex,
      match_rate: 0,
      image_path: gridImages[0]?.path ?? '',
      custom_color_name: uploadDraft.journal?.colorName || null,
      journal_answer: uploadDraft.journal?.journalAnswer || null,
      locale,
      weather_code: uploadDraft.mission.weatherCode ?? null,
      weather_group: uploadDraft.mission.weatherGroup,
      time_bucket: uploadDraft.mission.timeBucket,
      mission_label: uploadDraft.mission.label[locale],
      mission_prompt: uploadDraft.mission.prompt[locale],
      abuse_warning: uploadDraft.abuseWarning,
      location_name: null,
      location_latitude: null,
      location_longitude: null,
      location_accuracy_m: null,
      story_template_id: uploadDraft.journal?.storyDesign.templateId ?? null,
      story_stickers: uploadDraft.journal?.storyDesign.stickers ?? [],
      grid_images: gridImages,
      client_meta: {
        ...(existing?.client_meta ?? {}),
        app: 'colorwalk',
        feature: '3x3-grid',
        gridPhotoCount: gridImages.length,
        colorHunt: {
          version: 1,
          status: gridImages.length >= 8 ? 'completed' : 'recorded',
          photoCount: gridImages.length,
          lockedAt: uploadDraft.lockedAt,
          closedAt: uploadDraft.closedAt,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
    })
    if (error) throw error
    const uploadPaths = new Set(gridImages.map((image) => image.path))
    await Promise.all(getPostImagePaths(existing).filter((path) => !uploadPaths.has(path)).map((path) => deletePostImage(path).catch(() => undefined)))
    setPosts(await fetchPosts(session.user.id))
    const synced = { ...uploadDraft, syncState: 'synced' as const }
    if (clearWhenComplete && synced.gridImages.length >= 8) {
      await clearCachedDraft(ownerId, synced.localDate)
      setDailyDrafts((current) => current.filter((candidate) => candidate.localDate !== synced.localDate))
      setDraft(null)
      return
    }
    await saveCachedDraft(synced, ownerId)
    if (synced.localDate === getLocalDateKey()) setDraft(synced)
    setDailyDrafts((current) => [synced, ...current.filter((candidate) => candidate.localDate !== synced.localDate)])
  }

  async function handleDraftChange(nextDraft: CaptureDraft) {
    if (nextDraft.localDate !== getLocalDateKey()) {
      toast.message(locale === 'ko' ? '날짜가 바뀌었어요. 오늘의 색으로 새 사진을 찍어 주세요.' : 'The date changed. Take a new photo for today’s color.')
      if (draft?.gridImages.length) {
        const closed = { ...draft, closedAt: new Date().toISOString(), syncState: 'pending' as const }
        await saveCachedDraft(closed, ownerId)
        setDailyDrafts((current) => [closed, ...current.filter((candidate) => candidate.localDate !== closed.localDate)])
        setDraft(null)
        void syncDraft(closed).catch((error) => console.warn('Closed daily record sync will retry later', error))
      }
      const weather = await loadTodayMission(locale)
      const localDate = getLocalDateKey()
      const selected = loadDailyMissionState(ownerId, localDate)
      const nextMission = selected?.mission ?? weather.mission
      if (!selected) saveDailyMissionState(ownerId, { localDate, mission: nextMission, rerollCount: 0, selectedAt: new Date().toISOString() })
      setMission(nextMission, weather.usedFallbackLocation)
      setActiveTab('today')
      return false
    }
    try {
      await saveCachedDraft(nextDraft, ownerId)
      setDraft(nextDraft)
      setDailyDrafts((current) => [nextDraft, ...current.filter((candidate) => candidate.localDate !== nextDraft.localDate)])
      const selected = loadDailyMissionState(ownerId, nextDraft.localDate)
      if (selected && !selected.lockedAt) saveDailyMissionState(ownerId, { ...selected, lockedAt: nextDraft.lockedAt ?? new Date().toISOString() })
      void syncDraft(nextDraft).catch((error) => console.warn('Daily record sync will retry later', error))
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async function saveEntry({ colorName, journalAnswer, storyDesign }: { colorName: string; journalAnswer: string; storyDesign: StoryDesign }) {
    if (!draft?.gridImages.length) return
    setIsSaving(true)
    try {
      const journalDraft: CaptureDraft = { ...draft, journal: { colorName, journalAnswer, storyDesign }, syncState: 'pending' }
      await saveCachedDraft(journalDraft, ownerId)
      setDraft(journalDraft)
      setDailyDrafts((current) => [journalDraft, ...current.filter((candidate) => candidate.localDate !== journalDraft.localDate)])
      await syncDraft(journalDraft, journalDraft.gridImages.length >= 8)
      setActiveTab('calendar')
      toast.success(t(locale, 'saved'))
    } catch (error) {
      console.error(error)
      toast.error(t(locale, 'saveFailed'))
    } finally {
      setIsSaving(false)
    }
  }

  function persistJournal({ colorName, journalAnswer, storyDesign }: { colorName: string; journalAnswer: string; storyDesign: StoryDesign }) {
    if (!draft?.gridImages.length) return
    const nextDraft: CaptureDraft = { ...draft, journal: { colorName, journalAnswer, storyDesign } }
    setDraft(nextDraft)
    setDailyDrafts((current) => [nextDraft, ...current.filter((candidate) => candidate.localDate !== nextDraft.localDate)])
    void saveCachedDraft(nextDraft, ownerId).catch((error) => console.warn('Failed to persist journal draft', error))
  }

  function shuffleMission() {
    if (!mission) return
    const localDate = getLocalDateKey()
    const selected = loadDailyMissionState(ownerId, localDate)
    if (selected?.lockedAt || draft?.gridImages.length || displayPosts.some((post) => post.local_date === localDate)) {
      toast.message(locale === 'ko' ? '이 사진 사용을 확정한 뒤에는 오늘의 색을 바꿀 수 없어요.' : "Today's color locks after you use a photo.")
      return
    }
    const rerollCount = selected?.rerollCount ?? 0
    const broaden = rerollCount >= 3
    const nextMission = getRandomMission(mission.weatherGroup, mission.timeBucket, mission.source, mission.weatherCode, {
      broaden,
      excludeId: mission.id,
      excludeHex: mission.hex,
    })
    saveDailyMissionState(ownerId, { localDate, mission: nextMission, rerollCount: rerollCount + 1, selectedAt: new Date().toISOString() })
    setMission(nextMission, usedFallbackLocation)
    toast.success(locale === 'ko' ? (broaden ? '전체 큐레이션에서 다른 색을 골랐어요.' : '오늘의 날씨와 시간에 맞는 다른 색을 골랐어요.') : "Today's color was shuffled.")
  }

  useEffect(() => {
    async function closePastDraft() {
      if (!draft || draft.localDate === getLocalDateKey()) return
      const closed = { ...draft, closedAt: new Date().toISOString(), syncState: 'pending' as const }
      await saveCachedDraft(closed, ownerId)
      setDailyDrafts((current) => [closed, ...current.filter((candidate) => candidate.localDate !== closed.localDate)])
      setDraft(null)
      void syncDraft(closed).catch((error) => console.warn('Closed daily record sync will retry later', error))
    }
    const onForeground = () => { if (document.visibilityState !== 'hidden') void closePastDraft() }
    window.addEventListener('pageshow', onForeground)
    document.addEventListener('visibilitychange', onForeground)
    return () => { window.removeEventListener('pageshow', onForeground); document.removeEventListener('visibilitychange', onForeground) }
  // Foreground handling is keyed to the active draft and device date, not each sync callback recreation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, ownerId])

  function toggleLocale() { setLocale(locale === 'ko' ? 'en' : 'ko') }
  async function handleAuthenticated(nextSession: Session) {
    setIsAuthLoading(true)
    try { await hydrateAuthenticatedSession(nextSession); setActiveTab('today') } finally { setIsAuthLoading(false) }
  }
  async function signOut() {
    await supabase?.auth.signOut()
    setSession(null); setProfile(null); setPosts([]); setDraft(null); setDailyDrafts([]); setActiveTab('today')
  }

  const content = (() => {
    if (activeTab === 'camera' && mission) return <CameraView locale={locale} mission={mission} initialDraft={draft} onBack={() => setActiveTab('today')} onDraftChange={handleDraftChange} onComplete={() => setActiveTab('journal')} />
    if (activeTab === 'journal' && mission) return <JournalView locale={locale} mission={mission} draft={draft} isSaving={isSaving} onOpenCamera={() => setActiveTab('camera')} onPersistJournal={persistJournal} onSave={saveEntry} />
    if (activeTab === 'calendar') return <CalendarView locale={locale} posts={displayPosts} currentDraft={draft} />
    if (activeTab === 'profile') return <ProfileView locale={locale} posts={displayPosts} profile={profile} isLocalOnly={isLocalOnly} onToggleLocale={toggleLocale} onSignOut={signOut} />
    return <TodayView locale={locale} mission={mission} usedFallbackLocation={usedFallbackLocation} isLocalOnly={isLocalOnly} posts={displayPosts} onStartCamera={() => setActiveTab('camera')} onToggleLocale={toggleLocale} onShuffleMission={shuffleMission} canShuffleMission={!loadDailyMissionState(ownerId, getLocalDateKey())?.lockedAt && !displayPosts.some((post) => post.local_date === getLocalDateKey())} />
  })()

  if (isSupabaseConfigured && isAuthLoading) return <div className="phone-shell flex justify-center"><div className="app-frame"><main className="screen-flow"><section className="passport-panel flex min-h-[70svh] items-center justify-center p-8 text-center"><p className="font-black">{t(locale, 'loadingMission')}</p></section></main></div></div>
  if (isSupabaseConfigured && !session) return <div className="phone-shell flex justify-center"><div className="app-frame"><AuthGate locale={locale} onAuthenticated={handleAuthenticated} /></div></div>
  return <div className="phone-shell flex justify-center"><div className="app-frame flex flex-col"><div className="flex-1"><Suspense fallback={<main className="screen-flow"><section className="passport-panel flex min-h-[60svh] items-center justify-center p-8 text-center"><p className="font-black">{t(locale, 'loadingMission')}</p></section></main>}>{content}</Suspense></div>{activeTab !== 'camera' ? <BottomNav locale={locale} activeTab={activeTab} onChange={setActiveTab} /> : null}</div><Toaster richColors position="top-center" /></div>
}

export default App
