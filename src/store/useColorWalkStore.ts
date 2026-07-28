import { create } from 'zustand'

import { loadLocalePreference, resolveEffectiveLocale, saveLocalePreference } from '@/lib/i18n'
import type { AppTab, CaptureDraft, LocalePreference, Locale, Mission, Post } from '@/types'

type ColorWalkState = {
  locale: Locale
  localePreference: LocalePreference
  activeTab: AppTab
  mission: Mission | null
  usedFallbackLocation: boolean
  draft: CaptureDraft | null
  posts: Post[]
  selectedDate: string | null
  setLocalePreference: (preference: LocalePreference) => void
  setActiveTab: (tab: AppTab) => void
  setMission: (mission: Mission, usedFallbackLocation: boolean) => void
  setDraft: (draft: CaptureDraft | null) => void
  setPosts: (posts: Post[]) => void
  setSelectedDate: (date: string | null) => void
}

const initialLocalePreference = loadLocalePreference()

export const useColorWalkStore = create<ColorWalkState>((set) => ({
  locale: resolveEffectiveLocale(initialLocalePreference),
  localePreference: initialLocalePreference,
  activeTab: 'today',
  mission: null,
  usedFallbackLocation: false,
  draft: null,
  posts: [],
  selectedDate: null,
  setLocalePreference: (preference) => {
    saveLocalePreference(preference)
    set({ localePreference: preference, locale: resolveEffectiveLocale(preference) })
  },
  setActiveTab: (activeTab) => set({ activeTab }),
  setMission: (mission, usedFallbackLocation) => set({ mission, usedFallbackLocation }),
  setDraft: (draft) => set({ draft }),
  setPosts: (posts) => set({ posts }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}))
