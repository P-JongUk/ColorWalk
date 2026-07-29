import { Bell, Camera, CloudSun, Images, Info, Lock, Shuffle } from 'lucide-react'
import { useId, useState } from 'react'
import { toast } from 'sonner'

import { BadgeShelf } from '@/components/BadgeShelf'
import { ColorWalkMark } from '@/components/ColorWalkMark'
import { GridCollage } from '@/components/GridCollage'
import { HuedayWordmark } from '@/components/HuedayWordmark'
import { Button } from '@/components/ui/button'
import { HuedayDialog } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { getReadableTextColor } from '@/lib/colors'
import { getLocalDateKey } from '@/lib/date'
import { getPostGridImages } from '@/lib/grid'
import { t } from '@/lib/i18n'
import { MISSION_PACKS, getRecommendedMissionPackId } from '@/lib/missionPacks'
import type { Locale, Mission, MissionPackId, MissionPackSelection, Post } from '@/types'

type TodayViewProps = {
  locale: Locale
  mission: Mission | null
  usedFallbackLocation: boolean
  isLocalOnly: boolean
  posts: Post[]
  missionPack: MissionPackSelection
  onSelectMissionPack: (id: MissionPackId | null) => void
  onStartCamera: () => void
  onShuffleMission: () => void
  canShuffleMission: boolean
  rerollCount: number
}

function MissionPackSelector({ locale, mission, photoCount, isClosed, missionPack, onSelectMissionPack }: {
  locale: Locale
  mission: Mission
  photoCount: number
  isClosed: boolean
  missionPack: MissionPackSelection
  onSelectMissionPack: (id: MissionPackId | null) => void
}) {
  const [pendingId, setPendingId] = useState<MissionPackId | null | undefined>(undefined)
  const confirmDialogTitleId = useId()
  const recommendedId = getRecommendedMissionPackId(mission.weatherGroup, mission.timeBucket)

  function requestSelect(id: MissionPackId | null) {
    if (id === missionPack.id) return
    // With 0 photos, changing the whole-day pack intent needs no confirmation.
    if (photoCount === 0) { onSelectMissionPack(id); return }
    setPendingId(id)
  }

  function confirmSelect() {
    if (pendingId === undefined) return
    onSelectMissionPack(pendingId)
    setPendingId(undefined)
  }

  const pendingConfig = pendingId ? MISSION_PACKS.find((pack) => pack.id === pendingId) : null

  return (
    <section className="plain-block mission-pack-panel">
      <div className="section-heading">
        <div>
          <h2>{locale === 'ko' ? '오늘의 미션 팩' : "Today's mission pack"}</h2>
          <p className="mission-pack-hint">
            {isClosed
              ? (locale === 'ko' ? '이 기록은 종료됐어요. 팩은 더 바꿀 수 없어요.' : 'This record is closed. The pack can no longer change.')
              : (locale === 'ko' ? '색 선택은 그대로예요. 팩은 오늘 하루의 테마일 뿐이에요.' : 'Color choice stays the same. A pack is just a theme for today.')}
          </p>
        </div>
      </div>
      <div className="mission-pack-chip-row" role="radiogroup" aria-label={locale === 'ko' ? '미션 팩 선택' : 'Mission pack selection'}>
        <button
          type="button"
          role="radio"
          className="mission-pack-chip"
          data-active={missionPack.id === null || undefined}
          disabled={isClosed}
          aria-checked={missionPack.id === null}
          onClick={() => requestSelect(null)}
        >
          {locale === 'ko' ? '테마 없이 자유롭게' : 'No theme, free mode'}
        </button>
        {MISSION_PACKS.map((pack) => (
          <button
            type="button"
            role="radio"
            key={pack.id}
            className="mission-pack-chip"
            data-active={missionPack.id === pack.id || undefined}
            disabled={isClosed}
            aria-checked={missionPack.id === pack.id}
            onClick={() => requestSelect(pack.id)}
          >
            {pack.label[locale]}
            {recommendedId === pack.id ? <span className="mission-pack-recommended-badge">{locale === 'ko' ? '오늘 추천' : 'Recommended'}</span> : null}
          </button>
        ))}
      </div>
      {pendingId !== undefined ? (
        <HuedayDialog
          open={pendingId !== undefined}
          onClose={() => setPendingId(undefined)}
          titleId={confirmDialogTitleId}
          title={locale === 'ko' ? '미션 팩 변경 확인' : 'Mission pack change confirmation'}
          closeLabel={locale === 'ko' ? '취소' : 'Cancel'}
        >
          <p>
            {pendingId
              ? (locale === 'ko'
                ? `지금까지 모은 ${photoCount}장이 모두 '${pendingConfig?.label.ko}' 하루 페이지로 묶여요.`
                : `All ${photoCount} photos so far will be grouped into the '${pendingConfig?.label.en}' day page.`)
              : (locale === 'ko'
                ? '팩을 해제하면 이 기록은 종료 후 팩 컬렉션에서 제외돼요.'
                : 'Clearing the pack means this record will be excluded from pack collections once closed.')}
          </p>
          <div className="hd-dialog-actions">
            <Button type="button" variant="outline" size="sm" onClick={() => setPendingId(undefined)}>{locale === 'ko' ? '취소' : 'Cancel'}</Button>
            <Button type="button" size="sm" onClick={confirmSelect}>{locale === 'ko' ? '확인' : 'Confirm'}</Button>
          </div>
        </HuedayDialog>
      ) : null}
    </section>
  )
}

export function TodayView({ locale, mission, usedFallbackLocation, isLocalOnly, posts, missionPack, onSelectMissionPack, onStartCamera, onShuffleMission, canShuffleMission, rerollCount }: TodayViewProps) {
  const todayPost = posts.find((post) => post.local_date === getLocalDateKey())
  const todayGridImages = getPostGridImages(todayPost)
  const photoCount = todayGridImages.length
  const isRecordClosed = photoCount >= 8 || Boolean(missionPack.finalizedAt)
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
        <div className="home-title-actions" data-reroll-count={rerollCount}>
          <button type="button" className="home-info-button" aria-label="Mission info" onClick={() => toast.message(locale === 'ko' ? '오늘의 색은 현재 날씨와 시간에 맞춰 골라요.' : 'Today’s color uses the current weather and time.')}><Info aria-hidden="true" /></button>
          {canShuffleMission ? (
            <button type="button" className="mission-shuffle-button" onClick={onShuffleMission}><Shuffle aria-hidden="true" /><span>{locale === 'ko' ? '다른 색' : 'Shuffle'}</span></button>
          ) : null}
        </div>
      </section>
      {(canShuffleMission || (rerollCount >= 6 && photoCount === 0 && !isRecordClosed)) ? (
        <p className="mission-shuffle-status">
          {canShuffleMission
            ? (rerollCount < 3
              ? (locale === 'ko' ? `같은 추천 ${3 - rerollCount}회 남음` : `${3 - rerollCount} contextual choices left`)
              : (locale === 'ko' ? `전체 색 ${6 - rerollCount}회 남음` : `${6 - rerollCount} catalog choices left`))
            : (locale === 'ko' ? '오늘의 후보를 모두 골랐어요. 이 색으로 시작해볼까요?' : 'You have seen every choice for today. Ready to begin?')}
        </p>
      ) : null}
      <section className="mission-frame-artifact">
        <p className="mission-frame-label">{locale === 'ko' ? '3×3 한 페이지' : '3×3, one page'}</p>
        <div className="mission-frame-row">
          <div
            className="mission-frame"
            style={{ backgroundColor: mission.hex, color: getReadableTextColor(mission.hex) }}
          >
            <p className="mission-frame-eyebrow">{locale === 'ko' ? '오늘의 미션 색' : "Today's mission color"}</p>
            <h2 className="mission-frame-name">{mission.label[locale]}</h2>
            <div className="mission-frame-meta">
              <span className="mission-frame-hex">{mission.hex}</span>
              {isRecordClosed || photoCount > 0 ? (
                <span className="mission-frame-lock"><Lock aria-hidden="true" />{locale === 'ko' ? '색 잠금' : 'Locked'}</span>
              ) : null}
            </div>
          </div>
          <div className="mission-frame-grid"><GridCollage locale={locale} missionHex={mission.hex} colorName={mission.label[locale]} images={todayGridImages} variant="home" /></div>
        </div>
        <div className="mission-frame-progress">
          <div className="mission-frame-progress-row">
            <span className="mission-frame-fraction">{photoCount}/8</span>
            <Progress value={(photoCount / 8) * 100} aria-label={locale === 'ko' ? '3×3 진행률' : '3×3 progress'} />
          </div>
          <p className="mission-frame-state">{stateLabel}</p>
        </div>
      </section>
      <section className="prompt-card"><span>●</span><div><strong>{mission.prompt[locale]}</strong><p>{locale === 'ko' ? '주변에서 같은 결의 색을 발견해 보세요.' : 'Find a color with the same feeling around you.'}</p></div></section>
      {(usedFallbackLocation || isLocalOnly) ? <p className="soft-note">{usedFallbackLocation ? t(locale, 'locationFallback') : t(locale, 'cloudPending')}</p> : null}
      <MissionPackSelector
        locale={locale}
        mission={mission}
        photoCount={photoCount}
        isClosed={isRecordClosed}
        missionPack={missionPack}
        onSelectMissionPack={onSelectMissionPack}
      />
      <section className="plain-block"><div className="section-heading"><div><h2>{locale === 'ko' ? '완성 페이지 배지' : 'Completed page badges'}</h2></div></div><BadgeShelf locale={locale} posts={posts} /></section>
      <Button type="button" size="lg" className="camera-cta" onClick={onStartCamera} disabled={photoCount >= 8}><Camera data-icon="inline-start" aria-hidden="true" />{photoCount >= 8 ? (locale === 'ko' ? '오늘의 페이지를 완성했어요' : 'Today’s page is complete') : t(locale, 'findColor')}</Button>
    </main>
  )
}
