import { CalendarDays, Camera, Home, PenLine, Smile } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { AppTab, Locale } from '@/types'

const navItems: Array<{ tab: AppTab; icon: typeof Home; labelKey: 'today' | 'camera' | 'journal' | 'calendar' | 'profile' }> = [
  { tab: 'today', icon: Home, labelKey: 'today' },
  { tab: 'journal', icon: PenLine, labelKey: 'journal' },
  { tab: 'camera', icon: Camera, labelKey: 'camera' },
  { tab: 'calendar', icon: CalendarDays, labelKey: 'calendar' },
  { tab: 'profile', icon: Smile, labelKey: 'profile' },
]

type BottomNavProps = {
  locale: Locale
  activeTab: AppTab
  onChange: (tab: AppTab) => void
}

export function BottomNav({ locale, activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(({ tab, icon: Icon, labelKey }) => (
          <Button
            key={tab}
            type="button"
            variant="ghost"
            size="sm"
            className={cn('bottom-nav-item h-12 flex-col gap-1 rounded-[16px] text-[11px]', activeTab === tab && 'bottom-nav-item-active')}
            onClick={() => onChange(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            <Icon aria-hidden="true" />
            <span>{t(locale, labelKey)}</span>
          </Button>
        ))}
      </div>
    </nav>
  )
}
