import { Bell, Camera, CloudSun, Flame, Info, Shuffle } from 'lucide-react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'

import { BadgeShelf } from '@/components/BadgeShelf'
import { ColorWalkMark } from '@/components/ColorWalkMark'
import { GridCollage } from '@/components/GridCollage'
import { Button } from '@/components/ui/button'
import { getCurrentStreak } from '@/lib/collection'
import { getLocalDateKey } from '@/lib/date'
import { getPostGridImages } from '@/lib/grid'
import { t } from '@/lib/i18n'
import type { Locale, Mission, Post } from '@/types'

type TodayViewProps = {
  locale: Locale
  mission: Mission | null
  usedFallbackLocation: boolean
  isLocalOnly: boolean
  posts: Post[]
  onStartCamera: () => void
  onToggleLocale: () => void
  onShuffleMission: () => void
}

export function TodayView({
  locale,
  mission,
  usedFallbackLocation,
  isLocalOnly,
  posts,
  onStartCamera,
  onShuffleMission,
}: TodayViewProps) {
  const streak = getCurrentStreak(posts)
  const todayPost = posts.find((post) => post.local_date === getLocalDateKey())
  const todayGridImages = getPostGridImages(todayPost)

  async function handleNotifications() {
    if (!('Notification' in window)) {
      toast.message(locale === 'ko' ? '이 브라우저에서는 알림을 지원하지 않아요.' : 'Notifications are not supported in this browser.')
      return
    }

    const permission = Notification.permission === 'default'
      ? await Notification.requestPermission()
      : Notification.permission

    if (permission === 'granted') {
      new Notification('ColorWalk', {
        body: locale === 'ko' ? '오늘의 컬러 산책을 잊지 않게 알려드릴게요.' : "We'll remind you to take a color walk.",
      })
      toast.success(locale === 'ko' ? '알림 권한이 켜졌어요.' : 'Notifications are enabled.')
      return
    }

    toast.message(locale === 'ko' ? '알림 권한이 꺼져 있어요.' : 'Notification permission is off.')
  }

  return (
    <main className="screen-flow home-screen">
      <header className="home-hero">
        <div>
          <h1>
            Color Walk
            <ColorWalkMark compact className="text-coral" />
          </h1>
          <p>{locale === 'ko' ? '오늘을 물들이는 작은 색의 발견' : 'A tiny color ritual for today'}</p>
        </div>
        <div className="home-header-actions">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={() => void handleNotifications()}
          >
            <Bell aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="status-row">
        <div className="status-card">
          <CloudSun aria-hidden="true" />
          <div>
            <strong>{mission?.hint[locale] ?? t(locale, 'loadingMission')}</strong>
            <span>{mission?.source === 'live' ? t(locale, 'missionSourceLive') : t(locale, 'missionSourceFallback')}</span>
          </div>
        </div>
        <div className="status-card">
          <Flame aria-hidden="true" />
          <div>
            <strong>{locale === 'ko' ? `연속 ${streak || 0}일` : `${streak || 0} day streak`}</strong>
            <span>{isLocalOnly ? t(locale, 'localOnlyShort') : 'Cloud sync'}</span>
          </div>
        </div>
      </div>

      {mission ? (
        <>
          <section className="home-section-title">
            <h2>{t(locale, 'todayColor')}</h2>
            <div className="home-title-actions">
              <button
                type="button"
                className="home-info-button"
                aria-label={locale === 'ko' ? '오늘의 무드 컬러 설명' : 'About today mood color'}
                onClick={() =>
                  toast.message(
                    locale === 'ko'
                      ? '오늘의 날씨와 시간에 맞춰 산책 미션 컬러를 골라요.'
                      : "Today's mission color is picked from the current weather and time.",
                  )
                }
              >
                <Info aria-hidden="true" />
              </button>
              <button
                type="button"
                className="mission-shuffle-button"
                onClick={onShuffleMission}
                aria-label={locale === 'ko' ? '오늘의 색 다시 고르기' : 'Shuffle today color'}
              >
                <Shuffle aria-hidden="true" />
                <span>{locale === 'ko' ? '다른 색' : 'Shuffle'}</span>
              </button>
            </div>
          </section>

          <section
            className="mission-ticket mission-ticket-grid"
            style={{
              '--mission-color': mission.hex,
            } as CSSProperties}
          >
            <div className="ticket-copy">
              <p>TODAY COLOR</p>
              <h2>{mission.label[locale]}</h2>
              <strong>{mission.hex}</strong>
            </div>
            <div className="ticket-grid-preview">
              <GridCollage
                locale={locale}
                missionHex={mission.hex}
                colorName={mission.label[locale]}
                images={todayGridImages}
                variant="home"
              />
            </div>
          </section>

          <section className="prompt-card">
            <span>“</span>
            <div>
              <strong>{mission.prompt[locale]}</strong>
              <p>{locale === 'ko' ? '옷, 간판, 과일, 의자 같은 것들에서 8컷을 모아보세요.' : 'Try signs, fruit, chairs, or evening light.'}</p>
            </div>
          </section>

          {(usedFallbackLocation || isLocalOnly) && (
            <p className="soft-note">{usedFallbackLocation ? t(locale, 'locationFallback') : t(locale, 'cloudPending')}</p>
          )}

          <section className="plain-block">
            <div className="section-heading">
              <div>
                <h2>{locale === 'ko' ? '컬러 리워드 배지' : 'Color reward badges'}</h2>
              </div>
            </div>
            <BadgeShelf locale={locale} streak={streak} posts={posts} />
          </section>

          <Button type="button" size="lg" className="camera-cta" onClick={onStartCamera}>
            <Camera data-icon="inline-start" aria-hidden="true" />
            {t(locale, 'findColor')}
          </Button>
        </>
      ) : (
        <section className="passport-panel flex min-h-96 flex-col items-center justify-center gap-4 p-8 text-center">
          <ColorWalkMark className="text-coral" />
          <p className="font-semibold">{t(locale, 'loadingMission')}</p>
        </section>
      )}
    </main>
  )
}
