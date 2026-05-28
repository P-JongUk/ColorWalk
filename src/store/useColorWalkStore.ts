import { create } from 'zustand'

import { detectLocale, persistLocale } from '@/lib/i18n'
import type { AppTab, CaptureDraft, Locale, Mission, Post } from '@/types'

type ColorWalkState = {
  locale: Locale
  activeTab: AppTab
  mission: Mission | null
  usedFallbackLocation: boolean
  draft: CaptureDraft | null
  posts: Post[]
  selectedDate: string | null
  setLocale: (locale: Locale) => void
  setActiveTab: (tab: AppTab) => void
  setMission: (mission: Mission, usedFallbackLocation: boolean) => void
  setDraft: (draft: CaptureDraft | null) => void
  setPosts: (posts: Post[]) => void
  setSelectedDate: (date: string | null) => void
}

export const useColorWalkStore = create<ColorWalkState>((set) => ({
  locale: detectLocale(),
  activeTab: 'today',
  mission: null,
  usedFallbackLocation: false,
  draft: null,
  posts: [],
  selectedDate: null,
  setLocale: (locale) => {
    persistLocale(locale)
    set({ locale })
  },
  setActiveTab: (activeTab) => set({ activeTab }),
  setMission: (mission, usedFallbackLocation) => set({ mission, usedFallbackLocation }),
  setDraft: (draft) => set({ draft }),
  setPosts: (posts) => set({ posts }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}))
