import { useId, useState } from 'react'
import { Bell, BellOff, Cloud, Globe2, LogOut, ShieldCheck, Smartphone } from 'lucide-react'
import { toast } from 'sonner'

import { BadgeShelf } from '@/components/BadgeShelf'
import { ColorWalkMark } from '@/components/ColorWalkMark'
import { HuedayWordmark } from '@/components/HuedayWordmark'
import { Button } from '@/components/ui/button'
import { HuedayDialog } from '@/components/ui/dialog'
import { getMonthlyCollection } from '@/lib/collection'
import { t } from '@/lib/i18n'
import { cancelDailyReminder, getReminderSettings, scheduleDailyReminder, sendTestReminderNotification } from '@/lib/notifications'
import type { Locale, LocalePreference, Post, UserProfile } from '@/types'

type ProfileViewProps = {
  locale: Locale
  localePreference: LocalePreference
  onChangeLocalePreference: (preference: LocalePreference) => void
  posts: Post[]
  profile: UserProfile | null
  isLocalOnly: boolean
  onSignOut: () => void | Promise<void>
}

const LOCALE_PREFERENCE_LABEL: Record<LocalePreference, Record<Locale, string>> = {
  system: { ko: '시스템 설정', en: 'System setting' },
  ko: { ko: '한국어', en: '한국어 (Korean)' },
  en: { ko: 'English', en: 'English' },
}

export function ProfileView({ locale, localePreference, onChangeLocalePreference, posts, profile, isLocalOnly, onSignOut }: ProfileViewProps) {
  const monthly = getMonthlyCollection(posts)
  const initialReminder = getReminderSettings()
  const [reminderTime, setReminderTime] = useState(initialReminder.time)
  const [reminderEnabled, setReminderEnabled] = useState(initialReminder.enabled)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false)
  const languageDialogTitleId = useId()

  async function saveReminder() {
    setIsScheduling(true)
    try {
      const result = await scheduleDailyReminder(reminderTime, locale)
      setReminderEnabled(true)
      setReminderTime(result.time)
      toast.success(locale === 'ko' ? `${result.time}에 알림을 보낼게요.` : `Reminder set for ${result.time}.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, 'saveFailed'))
    } finally {
      setIsScheduling(false)
    }
  }

  async function turnOffReminder() {
    await cancelDailyReminder()
    setReminderEnabled(false)
    toast.message(locale === 'ko' ? '매일 알림을 껐어요.' : 'Daily reminder is off.')
  }

  async function sendTestNotification() {
    setIsSendingTest(true)
    try {
      await sendTestReminderNotification(locale)
      toast.success(locale === 'ko' ? '테스트 알림을 보냈어요.' : 'Test reminder sent.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, 'saveFailed'))
    } finally {
      setIsSendingTest(false)
    }
  }

  return (
    <main className="screen-flow profile-screen">
      <header className="app-header">
        <div>
          <p>{t(locale, 'profile')}</p>
          <h1>{profile?.nickname || t(locale, 'profileTitle')}</h1>
        </div>
        <ColorWalkMark />
      </header>

      <section className="profile-card">
        <ColorWalkMark className="mx-auto" />
        <h2><HuedayWordmark /></h2>
        <p>{profile?.nickname ? `${profile.nickname} · ${t(locale, 'profileSubtitle')}` : t(locale, 'profileSubtitle')}</p>
        <div className="profile-stats">
          <div>
            <strong>{monthly.count}</strong>
            <span>{locale === 'ko' ? '기록한 날' : 'Recorded days'}</span>
          </div>
          <div>
            <strong>{monthly.completedGridCount}</strong>
            <span>{t(locale, 'monthCollection')}</span>
          </div>
          <div>
            <strong>{monthly.photoCount}</strong>
            <span>{t(locale, 'photoRecord')}</span>
          </div>
        </div>
      </section>

      <section className="soft-section">
        <div className="section-heading">
          <div>
            <p>{locale === 'ko' ? '완성 페이지' : 'Completed pages'}</p>
            <h2>{locale === 'ko' ? '컬러 리워드 배지' : 'Color reward badges'}</h2>
          </div>
        </div>
        <BadgeShelf locale={locale} posts={posts} />
      </section>

      <section className="soft-section">
        <div className="settings-list">
          <button type="button" onClick={() => setIsLanguageDialogOpen(true)}>
            <Globe2 aria-hidden="true" />
            <span>{locale === 'ko' ? '언어' : 'Language'}</span>
            <strong>{LOCALE_PREFERENCE_LABEL[localePreference][locale]}</strong>
          </button>
          <div>
            <Cloud aria-hidden="true" />
            <span>{locale === 'ko' ? '클라우드 저장' : 'Cloud saving'}</span>
            <strong>{isLocalOnly ? t(locale, 'localOnlyShort') : 'Supabase'}</strong>
          </div>
          <div>
            <ShieldCheck aria-hidden="true" />
            <span>{locale === 'ko' ? '베타 접근' : 'Beta access'}</span>
            <strong>{t(locale, 'betaReady')}</strong>
          </div>
          <div>
            <Smartphone aria-hidden="true" />
            <span>{locale === 'ko' ? '설치 테스트' : 'Install test'}</span>
            <strong>{t(locale, 'webBeta')}</strong>
          </div>
        </div>
      </section>

      <section className="soft-section reminder-section">
        <div className="section-heading">
          <div>
            <p>{locale === 'ko' ? '매일 알림' : 'Daily reminder'}</p>
            <h2>{locale === 'ko' ? '오늘의 색을 찾을 시간' : "Time for today's color"}</h2>
          </div>
          {reminderEnabled ? <Bell aria-hidden="true" /> : <BellOff aria-hidden="true" />}
        </div>
        <div className="reminder-card">
          <label>
            <span>{locale === 'ko' ? '알림 시간' : 'Reminder time'}</span>
            <input type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} />
          </label>
          <div className="reminder-actions">
            <Button type="button" onClick={() => void saveReminder()} disabled={isScheduling}>
              {isScheduling ? (locale === 'ko' ? '설정 중' : 'Saving') : locale === 'ko' ? '알림 켜기' : 'Turn on'}
            </Button>
            <Button type="button" variant="outline" onClick={() => void turnOffReminder()}>
              {locale === 'ko' ? '끄기' : 'Off'}
            </Button>
          </div>
          <Button type="button" variant="ghost" onClick={() => void sendTestNotification()} disabled={isSendingTest}>
            {isSendingTest ? (locale === 'ko' ? '전송 중' : 'Sending') : locale === 'ko' ? '테스트 알림 보내기' : 'Send test reminder'}
          </Button>
          <p>
            {locale === 'ko'
              ? 'Android 앱에서는 기기 로컬 알림을 예약해요. 웹/PWA에서는 브라우저 권한과 실행 상태에 따라 달라질 수 있어요.'
              : 'On Android, this schedules a native local notification. On web/PWA, delivery depends on browser permission and whether the app can run.'}
          </p>
        </div>
      </section>

      <section className="soft-section">
        <button type="button" className="profile-signout" onClick={() => void onSignOut()}>
          <LogOut aria-hidden="true" />
          <span>{locale === 'ko' ? '로그아웃' : 'Log out'}</span>
        </button>
      </section>

      <HuedayDialog
        open={isLanguageDialogOpen}
        onClose={() => setIsLanguageDialogOpen(false)}
        titleId={languageDialogTitleId}
        title={locale === 'ko' ? '언어' : 'Language'}
        closeLabel={locale === 'ko' ? '닫기' : 'Close'}
      >
        <div role="radiogroup" aria-labelledby={languageDialogTitleId} className="language-preference-options">
          {(['system', 'ko', 'en'] as const).map((preference) => (
            <button
              key={preference}
              type="button"
              role="radio"
              aria-checked={localePreference === preference}
              className="language-preference-option"
              data-active={localePreference === preference || undefined}
              onClick={() => {
                onChangeLocalePreference(preference)
                setIsLanguageDialogOpen(false)
              }}
            >
              {LOCALE_PREFERENCE_LABEL[preference][locale]}
            </button>
          ))}
        </div>
      </HuedayDialog>
    </main>
  )
}
