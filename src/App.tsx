import { lazy, Suspense, useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import type { Session } from '@supabase/supabase-js'

import { AuthGate } from '@/components/AuthGate'
import { BottomNav } from '@/components/BottomNav'
import { InviteGate } from '@/components/InviteGate'
import { TodayView } from '@/components/TodayView'
import { hasBetaAccess, isBetaGateEnabled } from '@/lib/betaGate'
import { getLocalDateKey } from '@/lib/date'
import { getPostImagePaths, toStoredGridImages } from '@/lib/grid'
import { t } from '@/lib/i18n'
import { getRandomMission } from '@/lib/mission'
import { startWebReminderScheduler } from '@/lib/notifications'
import { deletePostImage, ensureProfile, fetchPosts, fetchProfile, isSupabaseConfigured, supabase, uploadPostImage, upsertPostWithGridFallback } from '@/lib/supabase'
import { loadTodayMission } from '@/lib/weather'
import { useColorWalkStore } from '@/store/useColorWalkStore'
import type { GridImage, Locale, Post, SavedLocation, StoryDesign, UserProfile } from '@/types'

const LOCAL_POSTS_KEY = 'colorwalk:local-posts'

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
  const [betaUnlocked, setBetaUnlocked] = useState(() => hasBetaAccess())

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
        const nextMission = await loadTodayMission(locale)
        if (!isMounted) return
        setMission(nextMission.mission, nextMission.usedFallbackLocation)
      } catch {
        toast.error(t(locale, 'loadingMission'))
      }
    }

    void boot()

    return () => {
      isMounted = false
    }
  }, [locale, setMission])

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
    setActiveTab('today')
  }

  async function saveEntry({
    colorName,
    journalAnswer,
    storyDesign,
    location,
  }: {
    colorName: string
    journalAnswer: string
    storyDesign: StoryDesign
    location: SavedLocation | null
  }) {
    if (!mission || !draft || draft.gridImages.length === 0) return

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
        const uploadPaths = await Promise.all(
          draft.gridImages.map((image) => uploadPostImage(session.user.id, localDate, image.imageBlob)),
        )
        const gridImages = toStoredGridImages(draft.gridImages, uploadPaths)
        const imagePath = gridImages[0]?.path ?? uploadPaths[0]
        const payload = {
          user_id: session.user.id,
          local_date: localDate,
          mission_hex: mission.hex,
          captured_hex: mission.hex,
          match_rate: 0,
          image_path: imagePath,
          custom_color_name: colorName || null,
          journal_answer: journalAnswer || null,
          locale,
          weather_code: mission.weatherCode ?? null,
          weather_group: mission.weatherGroup,
          time_bucket: mission.timeBucket,
          mission_label: mission.label[locale],
          mission_prompt: mission.prompt[locale],
          abuse_warning: draft.abuseWarning,
          location_name: location?.name || null,
          location_latitude: location?.latitude ?? null,
          location_longitude: location?.longitude ?? null,
          location_accuracy_m: location?.accuracyMeters ?? null,
          story_template_id: storyDesign.templateId,
          story_stickers: storyDesign.stickers,
          grid_images: gridImages,
          client_meta: {
            app: 'colorwalk',
            savedFrom: 'journal',
            feature: '3x3-grid',
            version: 'beta-3x3',
            gridPhotoCount: gridImages.length,
            compression: draft.compression ?? null,
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
          mission_hex: mission.hex,
          captured_hex: mission.hex,
          match_rate: 0,
          image_path: primaryImage,
          signedImageUrl: primaryImage,
          custom_color_name: colorName || null,
          journal_answer: journalAnswer || null,
          locale,
          weather_code: mission.weatherCode ?? null,
          weather_group: mission.weatherGroup,
          time_bucket: mission.timeBucket,
          mission_label: mission.label[locale],
          mission_prompt: mission.prompt[locale],
          abuse_warning: draft.abuseWarning,
          location_name: location?.name || null,
          location_latitude: location?.latitude ?? null,
          location_longitude: location?.longitude ?? null,
          location_accuracy_m: location?.accuracyMeters ?? null,
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

      setDraft(null)
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

    setMission(
      getRandomMission(mission.weatherGroup, mission.timeBucket, mission.source, mission.weatherCode),
      usedFallbackLocation,
    )
    toast.success(locale === 'ko' ? '오늘의 색을 다시 골랐어요.' : "Today's color was shuffled.")
  }

  const content = (() => {
    if (activeTab === 'camera' && mission) {
      return (
        <CameraView
          locale={locale}
          mission={mission}
          initialDraft={draft}
          onBack={() => setActiveTab('today')}
          onDraftChange={setDraft}
          onComplete={(nextDraft) => {
            setDraft(nextDraft)
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
      return <CalendarView locale={locale} posts={posts} />
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
      />
    )
  })()

  const showNav = activeTab !== 'camera'

  if (isBetaGateEnabled() && !betaUnlocked) {
    return (
      <div className="phone-shell flex justify-center">
        <div className="app-frame">
          <InviteGate locale={locale} onUnlock={() => setBetaUnlocked(true)} />
        </div>
      </div>
    )
  }

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
