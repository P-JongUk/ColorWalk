import { Bell, Camera, CloudSun, Images, Info, Shuffle } from 'lucide-react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'

import { BadgeShelf } from '@/components/BadgeShelf'
import { ColorWalkMark } from '@/components/ColorWalkMark'
import { GridCollage } from '@/components/GridCollage'
import { HuedayWordmark } from '@/components/HuedayWordmark'
import { Button } from '@/components/ui/button'
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
  canShuffleMission: boolean
}

export function TodayView({ locale, mission, usedFallbackLocation, isLocalOnly, posts, onStartCamera, onShuffleMission, canShuffleMission }: TodayViewProps) {
  const todayPost = posts.find((post) => post.local_date === getLocalDateKey())
  const todayGridImages = getPostGridImages(todayPost)
  const photoCount = todayGridImages.length
  const stateLabel = photoCount === 0
    ? (locale === 'ko' ? '시작 전' : 'Not started')
    : photoCount === 1
      ? (locale === 'ko' ? '첫 색 발견 · 오늘의 색 씨앗' : 'First color found · today’s seed')
      : photoCount < 8
        ? (locale === 'ko' ? '페이지 진행 중' : 'Page in progress')
        : (locale === 'ko' ? '3×3 한 페이지 완성' : '3×3 page complete')

  async function requestNotifications() {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') await Notification.requestPermission()
    toast.message(locale === 'ko' ? '알림 권한을 확인했어요.' : 'Notification permission checked.')
  }

  if (!mission) return <main className="screen-flow"><section className="passport-panel flex min-h-96 flex-col items-center justify-center gap-4 p-8 text-center"><ColorWalkMark /><p className="font-semibold">{t(locale, 'loadingMission')}</p></section></main>

  return (
    <main className="screen-flow home-screen">
      <header className="home-hero">
        <div><h1><HuedayWordmark /><ColorWalkMark compact /></h1><p>{locale === 'ko' ? '오늘을 물들이는 작은 색의 발견' : 'A tiny color ritual for today'}</p></div>
        <Button type="button" variant="ghost" size="icon" aria-label="Notifications" onClick={() => void requestNotifications()}><Bell aria-hidden="true" /></Button>
      </header>
      <div className="status-row">
        <div className="status-card"><CloudSun aria-hidden="true" /><div><strong>{mission.hint[locale]}</strong><span>{mission.source === 'live' ? t(locale, 'missionSourceLive') : t(locale, 'missionSourceFallback')}</span></div></div>
        <div className="status-card"><Images aria-hidden="true" /><div><strong>{stateLabel}</strong><span>{photoCount ? (locale === 'ko' ? '이 기기에 저장했어요. 같은 날 이어서 채울 수 있어요.' : 'Saved on this device. Continue the same day.') : (isLocalOnly ? t(locale, 'localOnlyShort') : 'Cloud sync')}</span></div></div>
      </div>
      <section className="home-section-title">
        <h2>{t(locale, 'todayColor')}</h2>
        <div className="home-title-actions">
          <button type="button" className="home-info-button" aria-label="Mission info" onClick={() => toast.message(locale === 'ko' ? '오늘의 색은 현재 날씨와 시간에 맞춰 골라요.' : 'Today’s color uses the current weather and time.')}><Info aria-hidden="true" /></button>
          <button type="button" className="mission-shuffle-button" onClick={onShuffleMission} data-locked={!canShuffleMission || undefined} disabled={!canShuffleMission}><Shuffle aria-hidden="true" /><span>{locale === 'ko' ? '다른 색' : 'Shuffle'}</span></button>
        </div>
      </section>
      <section className="mission-ticket mission-ticket-grid" style={{ '--mission-color': mission.hex } as CSSProperties}>
        <div className="ticket-copy"><p>TODAY COLOR</p><h2>{mission.label[locale]}</h2><strong>{mission.hex}</strong></div>
        <div className="ticket-grid-preview"><GridCollage locale={locale} missionHex={mission.hex} colorName={mission.label[locale]} images={todayGridImages} variant="home" /></div>
      </section>
      <section className="prompt-card"><span>●</span><div><strong>{mission.prompt[locale]}</strong><p>{locale === 'ko' ? '주변에서 같은 결의 색을 발견해 보세요.' : 'Find a color with the same feeling around you.'}</p></div></section>
      {(usedFallbackLocation || isLocalOnly) ? <p className="soft-note">{usedFallbackLocation ? t(locale, 'locationFallback') : t(locale, 'cloudPending')}</p> : null}
      <section className="plain-block"><div className="section-heading"><div><h2>{locale === 'ko' ? '완성 페이지 배지' : 'Completed page badges'}</h2></div></div><BadgeShelf locale={locale} posts={posts} /></section>
      <Button type="button" size="lg" className="camera-cta" onClick={onStartCamera} disabled={photoCount >= 8}><Camera data-icon="inline-start" aria-hidden="true" />{photoCount >= 8 ? (locale === 'ko' ? '오늘의 페이지를 완성했어요' : 'Today’s page is complete') : t(locale, 'findColor')}</Button>
    </main>
  )
}
