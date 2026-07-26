import { enqueueProductEvent, loadPendingProductEvents, removePendingProductEvents } from '@/lib/draftStorage'
import { supabase } from '@/lib/supabase'

export type ProductEventName =
  | 'screen_viewed'
  | 'session_summary'
  | 'primary_cta_clicked'

export type ProductEventPayload = Record<string, string | number | boolean>

export type ProductEvent = {
  id: string
  key: string
  ownerId: string
  eventName: ProductEventName
  dedupeKey: string
  localDate: string
  occurredAt: string
  platform: 'web' | 'android'
  appVersion: 1
  payload: ProductEventPayload
}

export type CreateProductEventInput = Omit<ProductEvent, 'id' | 'key' | 'occurredAt' | 'appVersion'> & {
  occurredAt?: string
}

const ALLOWED_PAYLOAD_KEYS = new Set(['screen', 'foreground_seconds', 'cta', 'delivery'])

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `event-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function assertSafePayload(payload: ProductEventPayload) {
  for (const [key, value] of Object.entries(payload)) {
    if (!ALLOWED_PAYLOAD_KEYS.has(key)) throw new Error(`Product event payload key is not allowed: ${key}`)
    if (!['string', 'number', 'boolean'].includes(typeof value)) throw new Error(`Invalid product event payload value: ${key}`)
    if (typeof value === 'string' && value.length > 64) throw new Error(`Product event payload value is too long: ${key}`)
  }
}

export function createProductEvent(input: CreateProductEventInput): ProductEvent {
  assertSafePayload(input.payload)
  return {
    ...input,
    id: createId(),
    key: `${input.ownerId}:${input.dedupeKey}`,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    appVersion: 1,
  }
}

export async function flushProductEvents(ownerId: string) {
  if (!supabase || ownerId === 'local') return false
  const events = await loadPendingProductEvents(ownerId)
  if (!events.length) return true

  const { error } = await supabase.from('product_events').upsert(
    events.map((event) => ({
      id: event.id,
      owner_id: event.ownerId,
      event_name: event.eventName,
      dedupe_key: event.dedupeKey,
      local_date: event.localDate,
      occurred_at: event.occurredAt,
      platform: event.platform,
      app_version: event.appVersion,
      payload: event.payload,
    })),
    { onConflict: 'owner_id,dedupe_key', ignoreDuplicates: true },
  )
  if (error) throw error
  await removePendingProductEvents(events.map((event) => event.key))
  return true
}

export async function trackProductEvent(input: CreateProductEventInput) {
  if (input.ownerId === 'local') return false
  try {
    await enqueueProductEvent(createProductEvent(input))
    await flushProductEvents(input.ownerId)
    return true
  } catch (error) {
    console.warn('Product event will remain in the local outbox until a later retry.', error)
    return false
  }
}
