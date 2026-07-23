import { describe, expect, it } from 'vitest'

import { createProductEvent } from '@/lib/productEvents'

describe('product event contract', () => {
  it('creates a stable owner-scoped outbox key without private record contents', () => {
    const event = createProductEvent({
      ownerId: 'user-1',
      eventName: 'first_photo_confirmed',
      dedupeKey: '2026-07-24:first_photo_confirmed',
      localDate: '2026-07-24',
      platform: 'web',
      payload: { source: 'camera' },
      occurredAt: '2026-07-24T01:02:03.000Z',
    })

    expect(event.key).toBe('user-1:2026-07-24:first_photo_confirmed')
    expect(event.appVersion).toBe(1)
    expect(event.payload).toEqual({ source: 'camera' })
  })

  it('rejects private payload fields and non-primitive values', () => {
    expect(() => createProductEvent({
      ownerId: 'user-1',
      eventName: 'journal_saved',
      dedupeKey: '2026-07-24:journal_saved',
      localDate: '2026-07-24',
      platform: 'web',
      payload: { journal: 'private text' },
    })).toThrow('Sensitive product event payload key')
  })
})
