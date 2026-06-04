import { lazy, Suspense, useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import type { Session } from '@supabase/supabase-js'

import { AuthGate } from '@/components/AuthGate'
import { BottomNav } from '@/components/BottomNav'
import { TodayView } from '@/components/TodayView'
import { getLocalDateKey } from '@/lib/date'
import { clearCachedDraft, loadCachedDraft, saveCachedDraft } from '@/lib/draftStorage'
import { getPostImagePaths, toStoredGridImages } from '@/lib/grid'
import { t } from '@/lib/i18n'
import { compressBlobToHistoryWebP } from '@/lib/image'
import { getRandomMission } from '@/lib/mission'
import { startWebReminderScheduler } from '@/lib/notifications'
import { deletePostImage, ensureProfile, fetchPosts, fetchProfile, isSupabaseConfigured, supabase, uploadPostImage, upsertPostWithGridFallback } from '@/lib/supabase'
import { loadTodayMission } from '@/lib/weather'
import { useColorWalkStore } from '@/store/useColorWalkStore'
import type { GridImage, Locale, Post, StoryDesign, UserProfile } from '@/types'

const LOCAL_POSTS_KEY = 'colorwalk:local-posts'
const MISSION_SHUFFLE_PREFIX = 'colorwalk:mission-shuffle-count'

const CalendarView = lazy(() => import('@/components/CalendarView').then((module) => ({ default: module.CalendarView })))
const CameraView = lazy(() => import('@/components/CameraView').then((module) => ({ default: module.CameraView })))
const JournalView = lazy(() => import('@/components/JournalView').then((module) => ({ default: module.JournalView })))
const ProfileView = lazy(() => import('@/components/ProfileView').then((module) => ({ default: module.ProfileView })))

function readLocalPosts(): Post[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || '[]') as Post[]
  } catch {
    return []
  }
}

function writeLocalPosts(posts: Post[]) {
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts))
}

function App() {
  const {
    locale,
    activeTab,
    mission,
    usedFallbackLocation,
    draft,
    posts,
    setLocale,
    setActiveTab,
    setMission,
    setDraft,
    setPosts,
  } = useColorWalkStore()
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured)
  const [isSaving, setIsSaving] = useState(false)
  const [isLocalOnly, setIsLocalOnly] = useState(!isSupabaseConfigured)

  async function hydrateAuthenticatedSession(nextSession: Session) {
    if (nextSession.user.is_anonymous) {
      await supabase?.auth.signOut()
      setSession(null)
      setProfile(null)
      setPosts([])
      return
    }

    await ensureProfile(nextSession, locale)
    const [remotePosts, nextProfile] = await Promise.all([
      fetchPosts(nextSession.user.id),
      fetchProfile(nextSession.user.id),
    ])

    setSession(nextSession)
    setProfile(nextProfile)
    setIsLocalOnly(false)
    setPosts(remotePosts)
  }

  useEffect(() => {
    let isMounted = true

    async function boot() {
      try {
        const [nextMission, cachedDraft] = await Promise.all([
          loadTodayMission(locale),
          loadCachedDraft(),
        ])
        if (!isMounted) return
        if (cachedDraft) {
          setDraft(cachedDraft)
          setMission(cachedDraft.mission, nextMission.usedFallbackLocation)
          return
        }
        setMission(nextMission.mission, nextMission.usedFallbackLocation)
      } catch {
        toast.error(t(locale, 'loadingMission'))
      }
    }

    void boot()

    return () => {
      isMounted = false
    }
  }, [locale, setDraft, setMission])

  useEffect(() => {
    let isMounted = true

    async function bootSupabase() {
      if (!isSupabaseConfigured) {
        setIsLocalOnly(true)
        setPosts(readLocalPosts())
        toast.message(t(locale, 'demoMode'))
        return
      }

      try {
        setIsAuthLoading(true)
        const {
          data: { session: nextSession },
        } = await supabase!.auth.getSession()

        if (!nextSession || nextSession.user.is_anonymous) {
          if (nextSession?.user.is_anonymous) await supabase!.auth.signOut()
          if (!isMounted) return
          setSession(null)
          setProfile(null)
          setPosts([])
          setIsLocalOnly(false)
          return
        }

        await ensureProfile(nextSession, locale)
        const [remotePosts, nextProfile] = await Promise.all([
          fetchPosts(nextSession.user.id),
          fetchProfile(nextSession.user.id),
        ])

        if (!isMounted) return
        setSession(nextSession)
        setProfile(nextProfile)
        setIsLocalOnly(false)
        setPosts(remotePosts)
      } catch {
        if (!isMounted) return
        setIsLocalOnly(true)
        setPosts(readLocalPosts())
        toast.message(t(locale, 'demoMode'))
      } finally {
        if (isMounted) setIsAuthLoading(false)
      }
    }

    void bootSupabase()

    const { data } =
      supabase?.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
        if (!nextSession) {
          setProfile(null)
          setPosts([])
        }
      }) ?? {}

    return () => {
      isMounted = false
      data?.subscription.unsubscribe()
    }
  }, [locale, setPosts])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeTab])

  useEffect(() => {
    startWebReminderScheduler(locale)
  }, [locale, session])

  function toggleLocale() {
    const nextLocale: Locale = locale === 'ko' ? 'en' : 'ko'
    setLocale(nextLocale)
  }

  async function handleAuthenticated(nextSession: Session) {
    setIsAuthLoading(true)
    try {
      await hydrateAuthenticatedSession(nextSession)
      setActiveTab('today')
    } finally {
      setIsAuthLoading(false)
    }
  }

  async function signOut() {
    await supabase?.auth.signOut()
    setSession(null)
    setProfile(null)
    setPosts([])
    setDraft(null)
    void clearCachedDraft()
    setActiveTab('today')
  }

  function handleDraftChange(nextDraft: typeof draft) {
    setDraft(nextDraft)
    void saveCachedDraft(nextDraft)
  }

  async function saveEntry({
    colorName,
    journalAnswer,
    storyDesign,
  }: {
    colorName: string
    journalAnswer: string
    storyDesign: StoryDesign
  }) {
    if (!mission || !draft || draft.gridImages.length === 0) return

    const activeMission = draft.mission ?? mission
    const localDate = getLocalDateKey()
    const existingTodayPost = posts.find((post) => post.local_date === localDate)

    if (existingTodayPost) {
      const shouldReplace = window.confirm(
        locale === 'ko'
          ? '오늘 기록을 새 그리드로 바꿀까요? 기존 사진은 히스토리에서 교체돼요.'
          : "Replace today's entry with this new grid? The previous photos will be replaced in history.",
      )
      if (!shouldReplace) return
    }

    setIsSaving(true)

    try {
      if (supabase && session) {
        const compressedGridImages = await Promise.all(
          draft.gridImages.map(async (image) => ({
            source: image,
            compressed: await compressBlobToHistoryWebP(image.imageBlob),
          })),
        )
        const uploadPaths = await Promise.all(
          compressedGridImages.map(({ compressed }) => uploadPostImage(session.user.id, localDate, compressed.blob)),
        )
        const uploadDraftImages = compressedGridImages.map(({ source, compressed }) => ({
          ...source,
          imageBlob: compressed.blob,
          width: compressed.width,
          height: compressed.height,
          bytes: compressed.bytes,
          quality: compressed.quality,
        }))
        const gridImages = toStoredGridImages(uploadDraftImages, uploadPaths)
        const imagePath = gridImages[0]?.path ?? uploadPaths[0]
        const payload = {
          user_id: session.user.id,
          local_date: localDate,
          mission_hex: activeMission.hex,
          captured_hex: activeMission.hex,
          match_rate: 0,
          image_path: imagePath,
          custom_color_name: colorName || null,
          journal_answer: journalAnswer || null,
          locale,
          weather_code: activeMission.weatherCode ?? null,
          weather_group: activeMission.weatherGroup,
          time_bucket: activeMission.timeBucket,
          mission_label: activeMission.label[locale],
          mission_prompt: activeMission.prompt[locale],
          abuse_warning: draft.abuseWarning,
          location_name: null,
          location_latitude: null,
          location_longitude: null,
          location_accuracy_m: null,
          story_template_id: storyDesign.templateId,
          story_stickers: storyDesign.stickers,
          grid_images: gridImages,
          client_meta: {
            app: 'colorwalk',
            savedFrom: 'journal',
            feature: '3x3-grid',
            version: 'beta-3x3',
            gridPhotoCount: gridImages.length,
            compression: {
              stage: 'upload',
              images: compressedGridImages.map(({ source, compressed }) => ({
                id: source.id,
                source: source.source,
                originalWidth: source.originalWidth ?? source.width,
                originalHeight: source.originalHeight ?? source.height,
                originalBytes: source.originalBytes ?? source.bytes,
                uploadWidth: compressed.width,
                uploadHeight: compressed.height,
                uploadBytes: compressed.bytes,
                uploadQuality: compressed.quality,
              })),
            },
          },
        }

        const { error } = await upsertPostWithGridFallback(payload)

        if (error) throw error

        await Promise.all(
          getPostImagePaths(existingTodayPost)
            .filter((path) => !uploadPaths.includes(path))
            .map((path) =>
              deletePostImage(path).catch((error) => {
                console.warn('Failed to remove replaced post image', error)
              }),
            ),
        )

        setPosts(await fetchPosts(session.user.id))
      } else {
        const localGridImages: GridImage[] = draft.gridImages.map((image) => ({
          id: image.id,
          slot: image.slot,
          path: image.previewUrl,
          signedUrl: image.previewUrl,
          previewUrl: image.previewUrl,
          width: image.width,
          height: image.height,
          bytes: image.bytes,
          source: image.source,
          createdAt: image.createdAt,
        }))
        const primaryImage = localGridImages[0]?.previewUrl ?? ''
        const localPost: Post = {
          id: crypto.randomUUID(),
          user_id: 'local',
          created_at: new Date().toISOString(),
          local_date: localDate,
          mission_hex: activeMission.hex,
          captured_hex: activeMission.hex,
          match_rate: 0,
          image_path: primaryImage,
          signedImageUrl: primaryImage,
          custom_color_name: colorName || null,
          journal_answer: journalAnswer || null,
          locale,
          weather_code: activeMission.weatherCode ?? null,
          weather_group: activeMission.weatherGroup,
          time_bucket: activeMission.timeBucket,
          mission_label: activeMission.label[locale],
          mission_prompt: activeMission.prompt[locale],
          abuse_warning: draft.abuseWarning,
          location_name: null,
          location_latitude: null,
          location_longitude: null,
          location_accuracy_m: null,
          story_template_id: storyDesign.templateId,
          story_stickers: storyDesign.stickers,
          grid_images: localGridImages,
          client_meta: {
            app: 'colorwalk',
            savedFrom: 'local-journal',
            feature: '3x3-grid',
            version: 'beta-3x3',
            gridPhotoCount: localGridImages.length,
            compression: draft.compression ?? null,
          },
        }
        const nextPosts = [localPost, ...posts.filter((post) => post.local_date !== localDate)]
        setPosts(nextPosts)
        writeLocalPosts(nextPosts)
      }

      void saveCachedDraft(draft)
      setActiveTab('calendar')
      toast.success(t(locale, 'saved'))
    } catch (error) {
      console.error(error)
      toast.error(t(locale, 'saveFailed'))
    } finally {
      setIsSaving(false)
    }
  }

  function shuffleMission() {
    if (!mission) return
    const localDate = getLocalDateKey()
    const hasCapturedToday = Boolean(draft?.gridImages.length) || posts.some((post) => post.local_date === localDate)

    if (hasCapturedToday) {
      toast.message(
        locale === 'ko'
          ? '사진을 찍은 뒤에는 오늘의 색을 바꿀 수 없어요.'
          : "Today's color is locked after you start capturing.",
      )
      return
    }

    const storageKey = `${MISSION_SHUFFLE_PREFIX}:${localDate}`
    const storedCount = Number(localStorage.getItem(storageKey) ?? '0')
    const count = Number.isFinite(storedCount) ? Math.max(0, storedCount) : 0
    const broaden = count >= 4

    setMission(
      getRandomMission(mission.weatherGroup, mission.timeBucket, mission.source, mission.weatherCode, {
        broaden,
        excludeId: mission.id,
      }),
      usedFallbackLocation,
    )
    localStorage.setItem(storageKey, String(count + 1))
    toast.success(locale === 'ko' ? (broaden ? '전체 팔레트에서 새 색을 골랐어요.' : '오늘 날씨에 맞는 다른 색을 골랐어요.') : "Today's color was shuffled.")
  }

  const content = (() => {
    if (activeTab === 'camera' && mission) {
      return (
        <CameraView
          locale={locale}
          mission={mission}
          initialDraft={draft}
          onBack={() => setActiveTab('today')}
          onDraftChange={handleDraftChange}
          onComplete={(nextDraft) => {
            handleDraftChange(nextDraft)
            setActiveTab('journal')
          }}
        />
      )
    }

    if (activeTab === 'journal' && mission) {
      return (
        <JournalView
          locale={locale}
          mission={mission}
          draft={draft}
          isSaving={isSaving}
          onOpenCamera={() => setActiveTab('camera')}
          onSave={saveEntry}
        />
      )
    }

    if (activeTab === 'calendar') {
      return <CalendarView locale={locale} posts={posts} currentDraft={draft} />
    }

    if (activeTab === 'profile') {
      return (
        <ProfileView
          locale={locale}
          posts={posts}
          profile={profile}
          isLocalOnly={isLocalOnly}
          onToggleLocale={toggleLocale}
          onSignOut={signOut}
        />
      )
    }

    return (
      <TodayView
        locale={locale}
        mission={mission}
        usedFallbackLocation={usedFallbackLocation}
        isLocalOnly={isLocalOnly}
        posts={posts}
        onStartCamera={() => setActiveTab('camera')}
        onToggleLocale={toggleLocale}
        onShuffleMission={shuffleMission}
        canShuffleMission={!draft?.gridImages.length && !posts.some((post) => post.local_date === getLocalDateKey())}
      />
    )
  })()

  const showNav = activeTab !== 'camera'

  if (isSupabaseConfigured && isAuthLoading) {
    return (
      <div className="phone-shell flex justify-center">
        <div className="app-frame">
          <main className="screen-flow">
            <section className="passport-panel flex min-h-[70svh] items-center justify-center p-8 text-center">
              <p className="font-black">{t(locale, 'loadingMission')}</p>
            </section>
          </main>
        </div>
      </div>
    )
  }

  if (isSupabaseConfigured && !session) {
    return (
      <div className="phone-shell flex justify-center">
        <div className="app-frame">
          <AuthGate locale={locale} onAuthenticated={handleAuthenticated} />
        </div>
      </div>
    )
  }

  return (
    <div className="phone-shell flex justify-center">
      <div className="app-frame flex flex-col">
        <div className="flex-1">
          <Suspense
            fallback={
              <main className="screen-flow">
                <section className="passport-panel flex min-h-[60svh] items-center justify-center p-8 text-center">
                  <p className="font-black">{t(locale, 'loadingMission')}</p>
                </section>
              </main>
            }
          >
            {content}
          </Suspense>
        </div>
        {showNav ? (
          <BottomNav locale={locale} activeTab={activeTab} onChange={setActiveTab} />
        ) : null}
      </div>
      <Toaster richColors position="top-center" />
    </div>
  )
}

export default App
