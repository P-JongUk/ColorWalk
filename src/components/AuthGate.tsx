import { useMemo, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { LockKeyhole, Sparkles, UserRound } from 'lucide-react'

import { ColorWalkMark } from '@/components/ColorWalkMark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getStoredInviteCode } from '@/lib/betaGate'
import { normalizeUsername, signInWithUsername, signUpWithUsername } from '@/lib/supabase'
import type { Locale, ProfileGender } from '@/types'

type AuthGateProps = {
  locale: Locale
  onAuthenticated: (session: Session) => Promise<void>
}

type Mode = 'signup' | 'login'

const currentYear = new Date().getFullYear()

export function AuthGate({ locale, onAuthenticated }: AuthGateProps) {
  const [mode, setMode] = useState<Mode>('signup')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState<ProfileGender>('prefer_not_to_say')
  const [birthYear, setBirthYear] = useState('2008')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const normalizedUsername = useMemo(() => normalizeUsername(username), [username])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const session =
        mode === 'signup'
          ? await signUpWithUsername({
              username,
              password,
              nickname,
              gender,
              birthYear: Number(birthYear),
              locale,
              inviteCode: getStoredInviteCode(),
            })
          : await signInWithUsername(username, password, locale)

      if (!session) {
        setError(
          locale === 'ko'
            ? '가입은 되었지만 세션이 바로 열리지 않았어요. Supabase Auth의 이메일 확인 설정을 꺼야 아이디 가입이 바로 작동해요.'
            : 'The account was created, but no session opened. Disable email confirmation in Supabase Auth for username-only beta login.',
        )
        return
      }

      await onAuthenticated(session)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : locale === 'ko' ? '로그인에 실패했어요.' : 'Sign-in failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-brand">
          <ColorWalkMark />
          <div>
            <p>{locale === 'ko' ? '친구 베타' : 'Friend beta'}</p>
            <h1>Color Walk</h1>
          </div>
        </div>
        <p className="auth-copy">
          {locale === 'ko'
            ? '오늘의 색을 찾고, 기록하고, 스토리로 공유해요.'
            : 'Find today’s color, keep a tiny journal, and share it as a story.'}
        </p>

        <div className="auth-mode-tabs">
          <button type="button" className={mode === 'signup' ? 'is-active' : ''} onClick={() => setMode('signup')}>
            {locale === 'ko' ? '회원가입' : 'Sign up'}
          </button>
          <button type="button" className={mode === 'login' ? 'is-active' : ''} onClick={() => setMode('login')}>
            {locale === 'ko' ? '로그인' : 'Log in'}
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <label>
            <span>{locale === 'ko' ? '아이디' : 'Username'}</span>
            <div className="auth-input-wrap">
              <UserRound aria-hidden="true" />
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                inputMode="text"
                placeholder="colorwalker"
                required
              />
            </div>
            {username && normalizedUsername !== username.trim().toLowerCase() ? (
              <small>{locale === 'ko' ? `저장될 아이디: ${normalizedUsername}` : `Saved as: ${normalizedUsername}`}</small>
            ) : null}
          </label>

          <label>
            <span>{locale === 'ko' ? '비밀번호' : 'Password'}</span>
            <div className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" />
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={6}
                required
              />
            </div>
          </label>

          {mode === 'signup' ? (
            <>
              <label>
                <span>{locale === 'ko' ? '닉네임' : 'Nickname'}</span>
                <Input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder={locale === 'ko' ? '예: 유나' : 'ex. Yuna'}
                  maxLength={20}
                  required
                />
              </label>

              <div className="auth-row">
                <label>
                  <span>{locale === 'ko' ? '성별' : 'Gender'}</span>
                  <select value={gender} onChange={(event) => setGender(event.target.value as ProfileGender)}>
                    <option value="prefer_not_to_say">{locale === 'ko' ? '선택 안 함' : 'Prefer not to say'}</option>
                    <option value="female">{locale === 'ko' ? '여성' : 'Female'}</option>
                    <option value="male">{locale === 'ko' ? '남성' : 'Male'}</option>
                    <option value="nonbinary">{locale === 'ko' ? '논바이너리' : 'Non-binary'}</option>
                  </select>
                </label>
                <label>
                  <span>{locale === 'ko' ? '태어난 연도' : 'Birth year'}</span>
                  <Input
                    value={birthYear}
                    onChange={(event) => setBirthYear(event.target.value)}
                    type="number"
                    min={1930}
                    max={currentYear}
                    required
                  />
                </label>
              </div>
            </>
          ) : null}

          {error ? <p className="auth-error">{error}</p> : null}

          <Button type="submit" size="lg" className="auth-submit" disabled={isSubmitting}>
            <Sparkles data-icon="inline-start" aria-hidden="true" />
            {isSubmitting
              ? locale === 'ko'
                ? '확인 중'
                : 'Checking'
              : mode === 'signup'
                ? locale === 'ko'
                  ? 'ColorWalk 시작하기'
                  : 'Start ColorWalk'
                : locale === 'ko'
                  ? '다시 들어가기'
                  : 'Enter'}
          </Button>
        </form>
      </section>
    </main>
  )
}
