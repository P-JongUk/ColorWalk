import { Frame, Lock, Sparkles, Stamp, Ticket } from 'lucide-react'

import { getUnlockedBadges } from '@/lib/collection'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { Locale, Post } from '@/types'

type BadgeShelfProps = {
  locale: Locale
  streak: number
  posts?: Post[]
  compact?: boolean
}

function RewardIcon({ days }: { days: number }) {
  if (days === 3) return <Sparkles aria-hidden="true" />
  if (days === 7) return <Stamp aria-hidden="true" />
  if (days === 14) return <Ticket aria-hidden="true" />
  return <Frame aria-hidden="true" />
}

export function BadgeShelf({ locale, streak, posts = [], compact = false }: BadgeShelfProps) {
  return (
    <div className={cn('badge-shelf', compact && 'badge-shelf-compact')}>
      {getUnlockedBadges(streak, posts, locale).map((badge) => {
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
              <RewardIcon days={badge.days} />
              {!badge.unlocked ? <Lock className="streak-token-lock" aria-hidden="true" /> : null}
            </span>
            <strong>{locale === 'ko' ? `${badge.days}일` : `${badge.days}d`}</strong>
            <small>{badge.unlocked ? badge.reward : t(locale, 'badgeLocked')}</small>
          </div>
        )
      })}
    </div>
  )
}
