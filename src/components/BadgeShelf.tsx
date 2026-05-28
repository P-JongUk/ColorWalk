import { Lock } from 'lucide-react'

import { getUnlockedBadges } from '@/lib/collection'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { Locale } from '@/types'

type BadgeShelfProps = {
  locale: Locale
  streak: number
  compact?: boolean
}

function PlantBadgeIcon({ days }: { days: number }) {
  if (days === 3) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path className="plant-line" d="M18 30c-3.7-5.1-2.9-12.6 4.7-18.1 7.1 5.8 8 13.5 4 18.4-2.4 3-6.2 3.8-8.7-.3Z" />
        <path className="plant-fill" d="M21.9 16.6c-3.4 3.4-4 8.2-1.8 11.3 1.6 2.2 3.8 2.1 5.3.2 2.3-2.9 1.7-7.8-3.5-11.5Z" />
      </svg>
    )
  }

  if (days === 7) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path className="plant-line" d="M24 35V22" />
        <path className="plant-line" d="M24 25c-6.7.4-10.3-3.2-10.9-8.6 6.1-.6 10.7 1.9 11.5 8.2" />
        <path className="plant-fill" d="M15.5 18c3.8-.1 6.3 1.4 7.2 4.5-3.5-.1-5.9-1.4-7.2-4.5Z" />
      </svg>
    )
  }

  if (days === 14) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path className="plant-line" d="M24 37V18" />
        <path className="plant-line" d="M24 24c-6.8.4-10.5-3.5-11.2-9 6.2-.6 10.9 2.1 11.8 8.6" />
        <path className="plant-line" d="M25 29c6.5-.2 10-3.8 10.7-9-6.2-.4-10.3 2.3-11.1 8.6" />
        <path className="plant-fill" d="M15.5 16.7c3.9 0 6.3 1.6 7.4 4.8-3.7-.1-6.1-1.6-7.4-4.8Z" />
        <path className="plant-fill" d="M33.1 21.6c-3.7.2-6 1.8-7 4.8 3.5-.1 5.8-1.5 7-4.8Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path className="plant-line" d="M24 38V19" />
      <path className="plant-line" d="M24 27c-6 .1-9.5-2.9-10.3-7.8 5.6-.7 9.6 1.7 10.4 7.4" />
      <path className="plant-line" d="M24.5 30c5.8-.2 9.2-3.2 10-8-5.5-.4-9.1 1.9-10 7.5" />
      <path className="plant-line" d="M24 18c-2.9-4.1-1.8-8.4 2.2-10.6 4.1 2.6 4.7 7 .7 10.4" />
      <circle className="plant-fill" cx="26" cy="12.9" r="2.8" />
    </svg>
  )
}

export function BadgeShelf({ locale, streak, compact = false }: BadgeShelfProps) {
  return (
    <div className={cn('badge-shelf', compact && 'badge-shelf-compact')}>
      {getUnlockedBadges(streak).map((badge) => {
        return (
          <div
            key={badge.days}
            className={cn(
              'streak-token',
              `streak-token-${badge.days}`,
              badge.unlocked && 'streak-token-unlocked',
            )}
          >
            <span className="streak-token-icon">
              <PlantBadgeIcon days={badge.days} />
              {!badge.unlocked ? <Lock className="streak-token-lock" aria-hidden="true" /> : null}
            </span>
            <strong>{locale === 'ko' ? `${badge.days}일` : `${badge.days}d`}</strong>
            <small>{badge.unlocked ? t(locale, 'badgeUnlocked') : t(locale, 'badgeLocked')}</small>
          </div>
        )
      })}
    </div>
  )
}
