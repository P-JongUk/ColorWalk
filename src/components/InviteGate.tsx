import { useState, type FormEvent } from 'react'
import { KeyRound } from 'lucide-react'

import { ColorWalkMark } from '@/components/ColorWalkMark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BETA_GATE_KEY, BETA_INVITE_VALUE_KEY, getInviteCode } from '@/lib/betaGate'
import { t } from '@/lib/i18n'
import type { Locale } from '@/types'

type InviteGateProps = {
  locale: Locale
  onUnlock: () => void
}

export function InviteGate({ locale, onUnlock }: InviteGateProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (value.trim() === getInviteCode()) {
      localStorage.setItem(BETA_GATE_KEY, 'true')
      localStorage.setItem(BETA_INVITE_VALUE_KEY, value.trim())
      onUnlock()
      return
    }
    setError(true)
  }

  return (
    <main className="invite-shell">
      <form className="invite-card" onSubmit={submit}>
        <ColorWalkMark className="mx-auto text-coral" />
        <p className="text-xs font-black uppercase text-coral">{t(locale, 'betaBadge')}</p>
        <h1>Color Walk</h1>
        <p className="text-sm leading-6 text-muted-foreground">{t(locale, 'inviteDescription')}</p>
        <label className="mt-4 flex flex-col gap-2 text-left">
          <span className="text-sm font-bold">{t(locale, 'inviteCode')}</span>
          <Input
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setError(false)
            }}
            placeholder={t(locale, 'invitePlaceholder')}
            autoComplete="one-time-code"
          />
        </label>
        {error ? <p className="text-sm font-bold text-coral">{t(locale, 'inviteError')}</p> : null}
        <Button type="submit" size="lg" className="w-full">
          <KeyRound data-icon="inline-start" aria-hidden="true" />
          {t(locale, 'inviteSubmit')}
        </Button>
      </form>
    </main>
  )
}
