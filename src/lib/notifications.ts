import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

import type { Locale } from '@/types'

const REMINDER_STORAGE_KEY = 'colorwalk:daily-reminder'
const REMINDER_NOTIFICATION_ID = 1314
const REMINDER_TEST_NOTIFICATION_ID = 1315

type ReminderSettings = {
  enabled: boolean
  time: string
}

let webReminderTimer: number | null = null

function parseTime(time: string) {
  const [hour, minute] = time.split(':').map(Number)
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return { hour: 20, minute: 30 }
  return {
    hour: Math.min(23, Math.max(0, hour)),
    minute: Math.min(59, Math.max(0, minute)),
  }
}

function getNotificationCopy(locale: Locale) {
  return {
    title: locale === 'ko' ? '오늘의 색을 찾으러 갈 시간' : "Time for today's color walk",
    body:
      locale === 'ko'
        ? '지금 주변에서 오늘의 무드 컬러를 한 장 찍어볼까요?'
        : 'Take one tiny photo of the mood color around you.',
  }
}

function nextReminderDelay(time: string) {
  const { hour, minute } = parseTime(time)
  const now = new Date()
  const next = new Date()
  next.setHours(hour, minute, 0, 0)
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1)
  }

  return next.getTime() - now.getTime()
}

export function getReminderSettings(): ReminderSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem(REMINDER_STORAGE_KEY) || '{}') as Partial<ReminderSettings>
    return {
      enabled: Boolean(parsed.enabled),
      time: typeof parsed.time === 'string' ? parsed.time : '20:30',
    }
  } catch {
    return { enabled: false, time: '20:30' }
  }
}

function saveReminderSettings(settings: ReminderSettings) {
  localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(settings))
}

export async function cancelDailyReminder() {
  saveReminderSettings({ ...getReminderSettings(), enabled: false })

  if (webReminderTimer) {
    window.clearTimeout(webReminderTimer)
    webReminderTimer = null
  }

  if (Capacitor.isNativePlatform()) {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_NOTIFICATION_ID }] })
  }
}

export function startWebReminderScheduler(locale: Locale) {
  if (webReminderTimer) {
    window.clearTimeout(webReminderTimer)
    webReminderTimer = null
  }

  const settings = getReminderSettings()
  if (!settings.enabled || typeof Notification === 'undefined' || Notification.permission !== 'granted') return

  webReminderTimer = window.setTimeout(() => {
    const copy = getNotificationCopy(locale)
    new Notification(copy.title, {
      body: copy.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'colorwalk-daily-reminder',
    })
    startWebReminderScheduler(locale)
  }, nextReminderDelay(settings.time))
}

export async function scheduleDailyReminder(time: string, locale: Locale) {
  const { hour, minute } = parseTime(time)
  const normalizedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  saveReminderSettings({ enabled: true, time: normalizedTime })

  const copy = getNotificationCopy(locale)

  if (Capacitor.isNativePlatform()) {
    const permission = await LocalNotifications.requestPermissions()
    if (permission.display !== 'granted') throw new Error(locale === 'ko' ? '알림 권한이 꺼져 있어요.' : 'Notification permission is off.')

    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_NOTIFICATION_ID }] })
    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_NOTIFICATION_ID,
          title: copy.title,
          body: copy.body,
          schedule: {
            on: { hour, minute },
            repeats: true,
            allowWhileIdle: true,
          },
        },
      ],
    })

    return { platform: 'native' as const, time: normalizedTime }
  }

  if (typeof Notification === 'undefined') {
    throw new Error(locale === 'ko' ? '이 브라우저는 알림을 지원하지 않아요.' : 'This browser does not support notifications.')
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error(locale === 'ko' ? '알림 권한이 꺼져 있어요.' : 'Notification permission is off.')
  startWebReminderScheduler(locale)

  return { platform: 'web' as const, time: normalizedTime }
}

export async function sendTestReminderNotification(locale: Locale) {
  const copy = getNotificationCopy(locale)

  if (Capacitor.isNativePlatform()) {
    const permission = await LocalNotifications.requestPermissions()
    if (permission.display !== 'granted') throw new Error(locale === 'ko' ? '알림 권한이 꺼져 있어요.' : 'Notification permission is off.')

    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_TEST_NOTIFICATION_ID,
          title: locale === 'ko' ? 'ColorWalk 테스트 알림' : 'ColorWalk test reminder',
          body: copy.body,
          autoCancel: true,
        },
      ],
    })

    return { platform: 'native' as const }
  }

  if (typeof Notification === 'undefined') {
    throw new Error(locale === 'ko' ? '이 브라우저는 알림을 지원하지 않아요.' : 'This browser does not support notifications.')
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error(locale === 'ko' ? '알림 권한이 꺼져 있어요.' : 'Notification permission is off.')

  new Notification(locale === 'ko' ? 'ColorWalk 테스트 알림' : 'ColorWalk test reminder', {
    body: copy.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'colorwalk-test-reminder',
  })

  return { platform: 'web' as const }
}
