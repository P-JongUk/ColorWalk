import { describe, expect, it } from 'vitest'

import { createProductEvent } from '@/lib/productEvents'

describe('product event contract', () => {
  it('creates a stable owner-scoped outbox key without private record contents', () => {
    const event = createProductEvent({
      ownerId: 'user-1',
      eventName: 'primary_cta_clicked',
      dedupeKey: '2026-07-24:primary_cta_clicked:photo_confirmed',
      localDate: '2026-07-24',
      platform: 'web',
      payload: { cta: 'photo_confirmed' },
      occurredAt: '2026-07-24T01:02:03.000Z',
    })

    expect(event.key).toBe('user-1:2026-07-24:primary_cta_clicked:photo_confirmed')
    expect(event.appVersion).toBe(1)
    expect(event.payload).toEqual({ cta: 'photo_confirmed' })
  })

  it('rejects private or otherwise non-allowlisted payload fields', () => {
    expect(() => createProductEvent({
      ownerId: 'user-1',
      eventName: 'primary_cta_clicked',
      dedupeKey: '2026-07-24:primary_cta_clicked:journal_saved',
      localDate: '2026-07-24',
      platform: 'web',
      payload: { journal: 'private text' },
    })).toThrow('Product event payload key is not allowed: journal')
  })
})
