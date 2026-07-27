import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Toaster, toast } from 'sonner'
import type { Session } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'

import { AuthGate } from '@/components/AuthGate'
import { BottomNav } from '@/components/BottomNav'
import { TodayView } from '@/components/TodayView'
import { getLocalDateKey } from '@/lib/date'
import { draftToDailyPost, findOpenPastRecords, finalizeOpenRecord, mergeDailyRecords } from '@/lib/dailyRecord'
import { cleanupLocalMasters, getMasterCleanupAvailability, loadCachedDraft, loadCachedDrafts, loadPendingCachedDrafts, promoteDraftMasters, saveCachedDraft, updateMissionPackSelection } from '@/lib/draftStorage'
import { getPostImagePaths, toStoredGridImages } from '@/lib/grid'
import { t } from '@/lib/i18n'
import { compressBlobToHistoryWebP } from '@/lib/image'
import { isStorageFullError } from '@/lib/localMaster'
import { runMasterCleanupAfterPreviewVerification } from '@/lib/masterCleanup'
import { getRandomMission } from '@/lib/mission'
import {
  buildColorHuntMeta,
  createFreeModeSelection,
  createMissionPackSelection,
  getMissionPackAnalyticsCta,
  getMissionPackCollectionScreen,
  mergeColorHuntIntoClientMeta,
} from '@/lib/missionPacks'
import { loadDailyMissionState, saveDailyMissionState } from '@/lib/missionState'
import { startWebReminderScheduler } from '@/lib/notifications'
import { flushProductEvents, trackProductEvent, type ProductEventName, type ProductEventPayload } from '@/lib/productEvents'
import { deletePostImage, ensureProfile, fetchPosts, fetchProfile, isSupabaseConfigured, supabase, updatePostColorHuntMetadata, uploadPostImage, upsertPostWithGridFallback } from '@/lib/supabase'
import { loadTodayMission } from '@/lib/weather'
import { useColorWalkStore } from '@/store/useColorWalkStore'
import type { CaptureDraft, MissionPackId, MissionPackSelection, Post, StoryDesign, UserProfile } from '@/types'

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
  const [activeMissionPack, setActiveMissionPack] = useState<MissionPackSelection>(createFreeModeSelection())
  const analyticsSessionRef = useRef<{ id: string; activeSince: number; activeSeconds: number; ended: boolean } | null>(null)
  const syncLocksRef = useRef(new Map<string, Promise<void>>())
  const authenticatedOwnerRef = useRef<string | null>(null)
  authenticatedOwnerRef.current = session?.user.is_anonymous ? null : session?.user.id ?? null
  const ownerId = session?.user.id ?? 'local'
  const displayPosts = useMemo(() => mergeDailyRecords(posts, dailyDrafts, ownerId, locale), [dailyDrafts, locale, ownerId, posts])
  // Source of truth for the pack shown on Today: the open today-draft's own missionPack
  // once photos exist (metadata-only updates write there directly), otherwise the 0-photo
  // DailyMissionState selection tracked in activeMissionPack.
  const effectiveMissionPack = draft?.gridImages.length ? (draft.missionPack ?? createFreeModeSelection()) : activeMissionPack
  const masterCleanupByDate = useMemo(() => Object.fromEntries(
    dailyDrafts.map((dailyDraft) => [dailyDraft.localDate, getMasterCleanupAvailability(dailyDraft)]),
  ), [dailyDrafts])

  const recordProductEvent = useCallback((
    eventName: ProductEventName,
    dedupeKey: string,
    payload: ProductEventPayload,
    localDate = getLocalDateKey(),
    eventSession = session,
  ) => {
    if (!eventSession || eventSession.user.is_anonymous) return
    void trackProductEvent({
      ownerId: eventSession.user.id,
      eventName,
      dedupeKey,
      localDate,
      platform: Capacitor.isNativePlatform() ? 'android' : 'web',
      payload,
    })
  }, [session])

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
        const weatherPromise = loadTodayMission(locale)
        const draftsPromise = Promise.all([loadCachedDraft(ownerId), loadCachedDrafts(ownerId)])
        const weather = import.meta.env.VITE_E2E_LOCAL_ONLY === 'true' ? await weatherPromise : null
        if (weather && active) setMission(weather.mission, weather.usedFallbackLocation)

        const [cachedDraft, cachedDrafts] = await draftsPromise
        const resolvedWeather = weather ?? await weatherPromise
        if (!active) return
        // Boot-time lazy finalization: close any record left open from a previous local date
        // before it is ever shown as "today's" record. cachedDraft is always keyed to today's
        // date already, so it is never itself a stale open record.
        const { records: finalizedDrafts } = await finalizeOpenPastRecords(cachedDrafts)
        setDailyDrafts(finalizedDrafts)
        if (cachedDraft) {
          setDraft(cachedDraft)
          setMission(cachedDraft.mission, resolvedWeather.usedFallbackLocation)
          setActiveMissionPack(cachedDraft.missionPack ?? createFreeModeSelection())
          return
        }
        const localDate = getLocalDateKey()
        const stored = loadDailyMissionState(ownerId, localDate)
        if (stored) {
          setMission(stored.mission, resolvedWeather.usedFallbackLocation)
          setActiveMissionPack(stored.missionPack ?? createFreeModeSelection())
          return
        }
        // A brand-new DailyMissionState always starts in free mode; yesterday's pack never carries over.
        saveDailyMissionState(ownerId, { localDate, mission: resolvedWeather.mission, rerollCount: 0, selectedAt: new Date().toISOString(), missionPack: createFreeModeSelection() })
        setMission(resolvedWeather.mission, resolvedWeather.usedFallbackLocation)
        setActiveMissionPack(createFreeModeSelection())
      } catch {
        toast.error(t(locale, 'loadingMission'))
      }
    }
    void bootMission()
    return () => { active = false }
  // finalizeOpenPastRecords is a stable per-render helper closing over ownerId/syncDraft;
  // this boot effect intentionally runs once per locale/ownerId change, not on every recreation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (!session || session.user.is_anonymous) return
    const flush = () => { void flushProductEvents(session.user.id).catch((error) => console.warn('Product event outbox retry failed', error)) }
    flush()
    window.addEventListener('online', flush)
    return () => window.removeEventListener('online', flush)
  }, [session])

  useEffect(() => {
    if (!session || session.user.is_anonymous) return
    let active = true
    const flushPending = async () => {
      const pending = await loadPendingCachedDrafts(session.user.id)
      for (const record of pending) {
        if (!active) return
        await syncDraft(record).catch((error) => console.warn('Daily record sync will retry later', error))
      }
    }
    const onOnline = () => { void flushPending() }
    void flushPending()
    window.addEventListener('online', onOnline)
    const onForeground = () => { if (document.visibilityState !== 'hidden') void flushPending() }
    document.addEventListener('visibilitychange', onForeground)
    return () => {
      active = false
      document.removeEventListener('visibilitychange', onForeground)
      window.removeEventListener('online', onOnline)
    }
  // syncDraft is a function declaration; retries are intentionally owner-scoped.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    if (!session || session.user.is_anonymous) return
    const localDate = getLocalDateKey()
    recordProductEvent('screen_viewed', `${localDate}:screen_viewed:${activeTab}`, { screen: activeTab }, localDate)
  }, [activeTab, recordProductEvent, session])

  useEffect(() => {
    if (!session || session.user.is_anonymous) return
    const start = () => {
      analyticsSessionRef.current = { id: String(Date.now()), activeSince: Date.now(), activeSeconds: 0, ended: false }
    }
    const finish = () => {
      const current = analyticsSessionRef.current
      if (!current || current.ended) return
      current.activeSeconds += (Date.now() - current.activeSince) / 1000
      current.ended = true
      recordProductEvent('session_summary', `session_summary:${current.id}`, {
        foreground_seconds: Math.max(1, Math.round(current.activeSeconds)),
      })
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') finish()
      else if (analyticsSessionRef.current?.ended) start()
    }
    start()
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pagehide', finish)
    return () => {
      finish()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', finish)
    }
  }, [recordProductEvent, session])

  async function syncDraft(nextDraft: CaptureDraft) {
    const syncOwnerId = session?.user.id
    if (supabase && (!syncOwnerId || session.user.is_anonymous)) return
    const lockKey = `${ownerId}:${nextDraft.localDate}`
    const existing = syncLocksRef.current.get(lockKey)
    if (existing) return existing
    const task = syncDraftUnlocked(nextDraft, syncOwnerId)
    syncLocksRef.current.set(lockKey, task)
    try {
      await task
    } finally {
      if (syncLocksRef.current.get(lockKey) === task) syncLocksRef.current.delete(lockKey)
    }
  }

  async function syncDraftUnlocked(nextDraft: CaptureDraft, syncOwnerId?: string) {
    let uploadDraft: CaptureDraft
    try {
      uploadDraft = await promoteDraftMasters(nextDraft, ownerId)
    } catch (error) {
      await saveCachedDraft({ ...nextDraft, lastSyncError: 'local' }, ownerId).catch(() => undefined)
      throw error
    }
    const localPost = draftToDailyPost(uploadDraft, ownerId, locale)
    if (!supabase || !syncOwnerId) {
      const nextPosts = [localPost, ...posts.filter((post) => post.local_date !== nextDraft.localDate)]
      setPosts(nextPosts)
      writeLocalPosts(nextPosts)
      return
    }

    for (const image of uploadDraft.gridImages) {
      if (authenticatedOwnerRef.current !== syncOwnerId) return
      if (image.uploadPath) continue
      if (!image.imageBlob) throw new Error('Local master is unavailable')
      let compressed: Awaited<ReturnType<typeof compressBlobToHistoryWebP>>
      let uploadPath: string
      try {
        compressed = await compressBlobToHistoryWebP(image.imageBlob)
        uploadPath = await uploadPostImage(syncOwnerId, nextDraft.localDate, compressed.blob, image.assetId ?? image.id)
      } catch (error) {
        await saveCachedDraft({ ...uploadDraft, lastSyncError: 'upload' }, ownerId).catch(() => undefined)
        throw error
      }
      uploadDraft = {
        ...uploadDraft,
        gridImages: uploadDraft.gridImages.map((candidate) => candidate.id === image.id
          ? { ...candidate, uploadPath, previewWidth: compressed.width, previewHeight: compressed.height, previewBytes: compressed.bytes, previewQuality: compressed.quality }
          : candidate),
      }
      await saveCachedDraft(uploadDraft, ownerId)
    }
    if (authenticatedOwnerRef.current !== syncOwnerId) return
    const gridImages = toStoredGridImages(uploadDraft.gridImages, uploadDraft.gridImages.map((image) => image.uploadPath ?? ''))
    const existing = posts.find((post) => post.local_date === uploadDraft.localDate)
    const { error } = await upsertPostWithGridFallback({
      user_id: syncOwnerId,
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
      client_meta: mergeColorHuntIntoClientMeta(
        { ...(existing?.client_meta ?? {}), app: 'colorwalk', feature: '3x3-grid', gridPhotoCount: gridImages.length },
        buildColorHuntMeta({
          photoCount: gridImages.length,
          lockedAt: uploadDraft.lockedAt,
          closedAt: uploadDraft.closedAt,
          missionPack: uploadDraft.missionPack ?? createFreeModeSelection(),
        }),
      ),
    })
    if (error) {
      await saveCachedDraft({ ...uploadDraft, lastSyncError: 'post' }, ownerId).catch(() => undefined)
      throw error
    }
    if (authenticatedOwnerRef.current !== syncOwnerId) return
    const uploadPaths = new Set(gridImages.map((image) => image.path))
    await Promise.all(getPostImagePaths(existing).filter((path) => !uploadPaths.has(path)).map((path) => deletePostImage(path).catch(() => undefined)))
    setPosts(await fetchPosts(syncOwnerId))
    const synced = { ...uploadDraft, serverRevision: uploadDraft.localRevision, lastSyncError: undefined }
    await saveCachedDraft(synced, ownerId)
    if (synced.localDate === getLocalDateKey()) setDraft(synced)
    setDailyDrafts((current) => [synced, ...current.filter((candidate) => candidate.localDate !== synced.localDate)])
  }

  /**
   * Lazy finalization: never a timer/server job. This closes every open past-date record
   * in one local transaction per record (closedAt + recordLifecycle:closed + finalized pack
   * first), then attempts a Post sync per record and leaves failures on the existing
   * pending/error retry path. Called at boot, on foreground, and before the next capture.
   */
  async function finalizeOpenPastRecords(drafts: CaptureDraft[]) {
    const openPast = findOpenPastRecords(drafts, getLocalDateKey())
    if (!openPast.length) return { records: drafts, finalizedAny: false }
    let records = drafts
    for (const record of openPast) {
      const finalized = finalizeOpenRecord(record)
      await saveCachedDraft(finalized, ownerId)
      records = [finalized, ...records.filter((candidate) => candidate.localDate !== finalized.localDate)]
      void syncDraft(finalized).catch((error) => console.warn('Lazy finalization sync will retry later', error))
    }
    return { records, finalizedAny: true }
  }

  async function handleDraftChange(nextDraft: CaptureDraft) {
    if (nextDraft.localDate !== getLocalDateKey()) {
      toast.message(locale === 'ko' ? '날짜가 바뀌었어요. 오늘의 색으로 새 사진을 찍어 주세요.' : 'The date changed. Take a new photo for today’s color.')
      const { records } = await finalizeOpenPastRecords(draft ? [draft, ...dailyDrafts.filter((candidate) => candidate.localDate !== draft.localDate)] : dailyDrafts)
      setDailyDrafts(records)
      if (draft && draft.localDate !== getLocalDateKey()) setDraft(null)
      const weather = await loadTodayMission(locale)
      const localDate = getLocalDateKey()
      const selected = loadDailyMissionState(ownerId, localDate)
      const nextMission = selected?.mission ?? weather.mission
      if (!selected) saveDailyMissionState(ownerId, { localDate, mission: nextMission, rerollCount: 0, selectedAt: new Date().toISOString(), missionPack: createFreeModeSelection() })
      setMission(nextMission, weather.usedFallbackLocation)
      setActiveMissionPack(selected?.missionPack ?? createFreeModeSelection())
      setActiveTab('today')
      return false
    }
    try {
      // The 8th photo immediately finalizes both the pack state and the daily record,
      // per the plan's "8번째 사진을 확정하면 pack 상태와 일일 기록을 즉시 종료·확정한다".
      const finalizedDraft = nextDraft.gridImages.length >= 8 ? finalizeOpenRecord(nextDraft) : nextDraft
      await saveCachedDraft(finalizedDraft, ownerId)
      setDraft(finalizedDraft)
      setDailyDrafts((current) => [finalizedDraft, ...current.filter((candidate) => candidate.localDate !== finalizedDraft.localDate)])
      if (finalizedDraft.gridImages.length === 1) {
        recordProductEvent('primary_cta_clicked', `${finalizedDraft.localDate}:primary_cta_clicked:photo_confirmed`, {
          cta: 'photo_confirmed',
        }, finalizedDraft.localDate)
      }
      if (finalizedDraft.gridImages.length === 8) {
        recordProductEvent('primary_cta_clicked', `${finalizedDraft.localDate}:primary_cta_clicked:grid_completed`, { cta: 'grid_completed' }, finalizedDraft.localDate)
      }
      const selected = loadDailyMissionState(ownerId, finalizedDraft.localDate)
      if (selected && !selected.lockedAt) saveDailyMissionState(ownerId, { ...selected, lockedAt: finalizedDraft.lockedAt ?? new Date().toISOString() })
      void syncDraft(finalizedDraft).catch(async (error) => {
        console.warn('Daily record sync will retry later', error)
        await saveCachedDraft({ ...finalizedDraft, lastSyncError: 'upload' }, ownerId).catch(() => undefined)
      })
      return true
    } catch (error) {
      console.error(error)
      toast.error(isStorageFullError(error)
        ? (locale === 'ko' ? '저장 공간이 부족해요. 공간을 확보한 뒤 다시 저장해 주세요.' : 'Storage is full. Free space and try again.')
        : (locale === 'ko' ? '기기에 사진을 저장하지 못했어요. 다시 시도해 주세요.' : 'Could not save the photo on this device. Try again.'))
      return false
    }
  }

  async function saveEntry({ colorName, journalAnswer, storyDesign }: { colorName: string; journalAnswer: string; storyDesign: StoryDesign }) {
    if (!draft?.gridImages.length) return
    setIsSaving(true)
    try {
      const journalDraft: CaptureDraft = { ...draft, journal: { colorName, journalAnswer, storyDesign }, recordLifecycle: draft.gridImages.length >= 8 ? 'closed' : draft.recordLifecycle, localRevision: (draft.localRevision ?? 0) + 1, lastSyncError: undefined }
      await saveCachedDraft(journalDraft, ownerId)
      setDraft(journalDraft)
      setDailyDrafts((current) => [journalDraft, ...current.filter((candidate) => candidate.localDate !== journalDraft.localDate)])
      recordProductEvent('primary_cta_clicked', `${journalDraft.localDate}:primary_cta_clicked:journal_saved`, {
        cta: 'journal_saved',
      }, journalDraft.localDate)
      if (journalDraft.gridImages.length < 8) {
        recordProductEvent('primary_cta_clicked', `${journalDraft.localDate}:primary_cta_clicked:partial_record_saved`, {
          cta: 'partial_record_saved',
        }, journalDraft.localDate)
      }
      await syncDraft(journalDraft)
      setActiveTab('calendar')
      toast.success(t(locale, 'saved'))
    } catch (error) {
      console.error(error)
      toast.error(t(locale, 'saveFailed'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleMasterCleanup(localDate: string) {
    if (!session || session.user.is_anonymous || !supabase) throw new Error('로그인한 뒤 다시 시도해 주세요.')
    const displayed = dailyDrafts.find((candidate) => candidate.localDate === localDate)
    if (!displayed || !getMasterCleanupAvailability(displayed).eligible) throw new Error('이 기록은 아직 원본 정리를 할 수 없어요.')

    const expectedRevision = displayed.localRevision ?? 0
    const [remotePosts, current] = await Promise.all([
      fetchPosts(session.user.id),
      loadCachedDraft(session.user.id, localDate),
    ])
    if (!current || current.localRevision !== expectedRevision || current.serverRevision !== expectedRevision) {
      throw new Error('기록이 바뀌었어요. 다시 확인해 주세요.')
    }
    if (!getMasterCleanupAvailability(current).eligible) throw new Error('이 기록은 아직 원본 정리를 할 수 없어요.')

    const cleaned = await runMasterCleanupAfterPreviewVerification({
      draft: current,
      posts: remotePosts,
      readPreview: async (url) => {
        const response = await fetch(url, { cache: 'no-store' })
        if (!response.ok) return false
        await response.blob()
        return true
      },
      cleanup: () => cleanupLocalMasters(session.user.id, localDate, expectedRevision),
    })
    setDailyDrafts((existing) => [cleaned, ...existing.filter((candidate) => candidate.localDate !== localDate)])
    if (draft?.localDate === localDate) setDraft(cleaned)
  }

  async function handleSelectMissionPack(id: MissionPackId | null) {
    const localDate = getLocalDateKey()
    const selection = createMissionPackSelection(id)
    recordProductEvent('primary_cta_clicked', `${localDate}:primary_cta_clicked:${getMissionPackAnalyticsCta(id)}`, { cta: getMissionPackAnalyticsCta(id) }, localDate)

    if (!draft?.gridImages.length) {
      // 0-photo state: the whole-day intent lives in DailyMissionState only.
      const stored = loadDailyMissionState(ownerId, localDate)
      if (stored) saveDailyMissionState(ownerId, { ...stored, missionPack: selection })
      setActiveMissionPack(selection)
      return
    }

    // 1-7 photo state: metadata-only IndexedDB update. Never touches gridImages, Blob,
    // master/preview paths, or asset records; never calls promoteDraftMasters/uploadPostImage.
    const result = await updateMissionPackSelection(ownerId, localDate, selection).catch((error) => {
      console.warn('Mission pack metadata update failed locally', error)
      return null
    })
    if (!result) return
    const nextDraft: CaptureDraft = { ...draft, missionPack: selection, localRevision: result.localRevision, lastSyncError: undefined }
    setDraft(nextDraft)
    setDailyDrafts((current) => [nextDraft, ...current.filter((candidate) => candidate.localDate !== nextDraft.localDate)])
    setActiveMissionPack(selection)

    const syncOwnerId = session?.user.id
    if (!supabase || !syncOwnerId || session?.user.is_anonymous) return
    try {
      const colorHunt = buildColorHuntMeta({
        photoCount: nextDraft.gridImages.length,
        lockedAt: nextDraft.lockedAt,
        closedAt: nextDraft.closedAt,
        missionPack: selection,
      })
      const updated = await updatePostColorHuntMetadata(syncOwnerId, localDate, colorHunt)
      if (!updated) return // No remote post yet; the next full sync will include this metadata.
      const synced: CaptureDraft = { ...nextDraft, serverRevision: nextDraft.localRevision }
      await saveCachedDraft(synced, ownerId)
      setDraft(synced)
      setDailyDrafts((current) => [synced, ...current.filter((candidate) => candidate.localDate !== synced.localDate)])
      setPosts(posts.map((post) => (post.local_date === localDate ? { ...post, client_meta: updated } : post)))
    } catch (error) {
      // Network/remote failure: keep the local selection and leave it pending for the
      // existing owner+localDate retry path (loadPendingCachedDrafts -> syncDraft).
      console.warn('Mission pack metadata remote sync will retry later', error)
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
    saveDailyMissionState(ownerId, { localDate, mission: nextMission, rerollCount: rerollCount + 1, selectedAt: new Date().toISOString(), missionPack: selected?.missionPack ?? createFreeModeSelection() })
    setMission(nextMission, usedFallbackLocation)
    toast.success(locale === 'ko' ? (broaden ? '전체 큐레이션에서 다른 색을 골랐어요.' : '오늘의 날씨와 시간에 맞는 다른 색을 골랐어요.') : "Today's color was shuffled.")
  }

  useEffect(() => {
    async function closePastDrafts() {
      const localDate = getLocalDateKey()
      const combined = draft ? [draft, ...dailyDrafts.filter((candidate) => candidate.localDate !== draft.localDate)] : dailyDrafts
      const { records, finalizedAny } = await finalizeOpenPastRecords(combined)
      if (!finalizedAny) return
      setDailyDrafts(records)
      if (draft && draft.localDate !== localDate) setDraft(null)
    }
    const onForeground = () => { if (document.visibilityState !== 'hidden') void closePastDrafts() }
    window.addEventListener('pageshow', onForeground)
    document.addEventListener('visibilitychange', onForeground)
    return () => { window.removeEventListener('pageshow', onForeground); document.removeEventListener('visibilitychange', onForeground) }
  // Foreground handling is keyed to the active draft/dailyDrafts and device date, not each sync callback recreation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, dailyDrafts, ownerId])

  function toggleLocale() { setLocale(locale === 'ko' ? 'en' : 'ko') }
  async function handleAuthenticated(nextSession: Session, mode: 'signup' | 'login') {
    setIsAuthLoading(true)
    try {
      await hydrateAuthenticatedSession(nextSession)
      if (mode === 'signup') recordProductEvent('primary_cta_clicked', 'primary_cta_clicked:signup_completed', { cta: 'signup_completed' }, getLocalDateKey(), nextSession)
      setActiveTab('today')
    } finally { setIsAuthLoading(false) }
  }
  function startCamera() {
    const localDate = getLocalDateKey()
    recordProductEvent('primary_cta_clicked', `${localDate}:primary_cta_clicked:capture_started`, { cta: 'capture_started' }, localDate)
    setActiveTab('camera')
  }
  function recordStoryExportForDate(localDate: string, kind: 'story' | 'grid', delivery: 'download' | 'share') {
    recordProductEvent('primary_cta_clicked', `${localDate}:primary_cta_clicked:${kind}_exported`, {
      cta: `${kind}_exported`,
      delivery,
    }, localDate)
  }
  function recordStoryExport(kind: 'story' | 'grid', delivery: 'download' | 'share') {
    if (!draft) return
    recordStoryExportForDate(draft.localDate, kind, delivery)
  }
  function recordStoryExportForPost(post: Post, kind: 'story' | 'grid', delivery: 'download' | 'share') {
    recordStoryExportForDate(post.local_date, kind, delivery)
  }
  function recordStoryShareOpenedForPost(post: Post, kind: 'story' | 'grid') {
    recordProductEvent('primary_cta_clicked', `${post.local_date}:primary_cta_clicked:${kind}_share_opened`, { cta: `${kind}_share_opened` }, post.local_date)
  }
  function recordStoryShareOpened(kind: 'story' | 'grid') {
    if (!draft) return
    recordProductEvent('primary_cta_clicked', `${draft.localDate}:primary_cta_clicked:${kind}_share_opened`, { cta: `${kind}_share_opened` }, draft.localDate)
  }
  function recordDeckEvent(event: 'entered' | 'volume_opened' | 'source_opened' | 'story_opened', sessionId: string) {
    const localDate = getLocalDateKey()
    const dedupeKey = `deck:${sessionId}:${event}`
    if (event === 'entered') {
      recordProductEvent('screen_viewed', dedupeKey, { screen: 'deck' }, localDate)
      return
    }
    if (event === 'volume_opened') {
      recordProductEvent('screen_viewed', dedupeKey, { screen: 'color_volume' }, localDate)
      return
    }
    recordProductEvent('primary_cta_clicked', dedupeKey, { cta: event === 'source_opened' ? 'deck_source_opened' : 'deck_story_opened' }, localDate)
  }
  function recordDeckStageVisible(stage: 1 | 3 | 5 | 8, sessionId: string) {
    recordProductEvent('screen_viewed', `deck:${sessionId}:stage:${stage}`, { screen: `deck_stage_${stage}` }, getLocalDateKey())
  }
  function recordMissionPackCollectionOpened(id: MissionPackId) {
    const localDate = getLocalDateKey()
    const screen = getMissionPackCollectionScreen(id)
    recordProductEvent('screen_viewed', `${localDate}:screen_viewed:${screen}`, { screen }, localDate)
  }
  function recordHueprintScreenViewed(screen: 'hueprint_week' | 'color_capsule_archive' | 'color_capsule_month') {
    const localDate = getLocalDateKey()
    recordProductEvent('screen_viewed', `${localDate}:screen_viewed:${screen}`, { screen }, localDate)
  }
  function recordHueprintCtaClicked(cta: 'hueprint_cover_changed' | 'hueprint_source_opened' | 'color_capsule_source_opened' | 'color_memory_source_opened') {
    const localDate = getLocalDateKey()
    recordProductEvent('primary_cta_clicked', `${localDate}:primary_cta_clicked:${cta}`, { cta }, localDate)
  }
  async function signOut() {
    await supabase?.auth.signOut()
    setSession(null); setProfile(null); setPosts([]); setDraft(null); setDailyDrafts([]); setActiveTab('today')
  }

  const content = (() => {
    if (activeTab === 'camera' && mission) return <CameraView locale={locale} mission={mission} initialDraft={draft} activeMissionPack={activeMissionPack} onBack={() => setActiveTab('today')} onDraftChange={handleDraftChange} onComplete={() => setActiveTab('journal')} />
    if (activeTab === 'journal' && mission) return <JournalView locale={locale} mission={mission} draft={draft} isSaving={isSaving} onOpenCamera={startCamera} onPersistJournal={persistJournal} onSave={saveEntry} onStoryExported={recordStoryExport} onStoryShareOpened={recordStoryShareOpened} />
    if (activeTab === 'calendar') return <CalendarView locale={locale} ownerId={ownerId} posts={displayPosts} currentDraft={draft} masterCleanupByDate={masterCleanupByDate} onCleanupMaster={session && !session.user.is_anonymous ? handleMasterCleanup : undefined} onStartCamera={startCamera} onDeckEvent={recordDeckEvent} onDeckStageVisible={recordDeckStageVisible} onStoryExported={recordStoryExportForPost} onStoryShareOpened={recordStoryShareOpenedForPost} onMissionPackCollectionOpened={recordMissionPackCollectionOpened} onHueprintScreenViewed={recordHueprintScreenViewed} onHueprintCtaClicked={recordHueprintCtaClicked} />
    if (activeTab === 'profile') return <ProfileView locale={locale} posts={displayPosts} profile={profile} isLocalOnly={isLocalOnly} onToggleLocale={toggleLocale} onSignOut={signOut} />
    return <TodayView locale={locale} mission={mission} usedFallbackLocation={usedFallbackLocation} isLocalOnly={isLocalOnly} posts={displayPosts} missionPack={effectiveMissionPack} onSelectMissionPack={(id) => void handleSelectMissionPack(id)} onStartCamera={startCamera} onToggleLocale={toggleLocale} onShuffleMission={shuffleMission} canShuffleMission={!loadDailyMissionState(ownerId, getLocalDateKey())?.lockedAt && !displayPosts.some((post) => post.local_date === getLocalDateKey())} />
  })()

  if (isSupabaseConfigured && isAuthLoading) return <div className="phone-shell flex justify-center"><div className="app-frame"><main className="screen-flow"><section className="passport-panel flex min-h-[70svh] items-center justify-center p-8 text-center"><p className="font-black">{t(locale, 'loadingMission')}</p></section></main></div></div>
  if (isSupabaseConfigured && !session) return <div className="phone-shell flex justify-center"><div className="app-frame"><AuthGate locale={locale} onAuthenticated={handleAuthenticated} /></div></div>
  return <div className="phone-shell flex justify-center"><div className="app-frame flex flex-col"><div className="flex-1"><Suspense fallback={<main className="screen-flow"><section className="passport-panel flex min-h-[60svh] items-center justify-center p-8 text-center"><p className="font-black">{t(locale, 'loadingMission')}</p></section></main>}>{content}</Suspense></div>{activeTab !== 'camera' ? <BottomNav locale={locale} activeTab={activeTab} onChange={setActiveTab} /> : null}</div><Toaster richColors position="top-center" /></div>
}

export default App
