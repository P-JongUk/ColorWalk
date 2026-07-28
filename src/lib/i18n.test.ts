import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { loadLocalePreference, resolveEffectiveLocale, saveLocalePreference } from '@/lib/i18n'

const originalLanguage = navigator.language
const originalLanguages = navigator.languages

function setNavigatorLanguage(languages: string[]) {
  Object.defineProperty(navigator, 'language', { value: languages[0], configurable: true })
  Object.defineProperty(navigator, 'languages', { value: languages, configurable: true })
}

describe('locale preference', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    setNavigatorLanguage([originalLanguage, ...(originalLanguages ?? [])])
  })

  it('defaults to system when nothing is saved yet', () => {
    expect(loadLocalePreference()).toBe('system')
  })

  it('resolves system preference to Korean when the device language is Korean', () => {
    setNavigatorLanguage(['ko-KR', 'ko'])
    expect(resolveEffectiveLocale('system')).toBe('ko')
  })

  it('resolves system preference to English for every unsupported device language', () => {
    setNavigatorLanguage(['fr-FR', 'fr'])
    expect(resolveEffectiveLocale('system')).toBe('en')
  })

  it('an explicit choice overrides the system language until system is chosen again', () => {
    setNavigatorLanguage(['ko-KR'])
    saveLocalePreference('en')
    expect(loadLocalePreference()).toBe('en')
    expect(resolveEffectiveLocale('en')).toBe('en')

    saveLocalePreference('system')
    expect(loadLocalePreference()).toBe('system')
    expect(resolveEffectiveLocale('system')).toBe('ko')
  })

  it('treats a pre-M6 legacy ko/en value as an explicit preference, not a system reset', () => {
    localStorage.setItem('colorwalk-locale', 'en')
    expect(loadLocalePreference()).toBe('en')
  })
})
