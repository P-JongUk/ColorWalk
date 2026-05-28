import { describe, expect, it } from 'vitest'

import { getJournalPrompt } from '@/lib/journal'

describe('journal prompts', () => {
  it('returns deterministic localized prompts for a date and color', () => {
    const seed = new Date('2026-05-27T12:00:00')

    expect(getJournalPrompt('#647E6F', 'ko', seed)).toBe(
      getJournalPrompt('#647E6F', 'ko', seed),
    )
    expect(getJournalPrompt('#647E6F', 'en', seed)).not.toBe(
      getJournalPrompt('#647E6F', 'ko', seed),
    )
  })
})
