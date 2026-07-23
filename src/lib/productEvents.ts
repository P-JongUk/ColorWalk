export type ProductEventName =
  | 'signup_completed'
  | 'mission_viewed'
  | 'capture_started'
  | 'first_photo_confirmed'
  | 'partial_record_saved'
  | 'grid_completed'
  | 'journal_saved'
  | 'story_exported'
  | 'story_share_opened'

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

type CreateProductEventInput = Omit<ProductEvent, 'id' | 'key' | 'occurredAt' | 'appVersion'> & {
  occurredAt?: string
}

const SENSITIVE_PAYLOAD_KEYS = new Set([
  'photo', 'photos', 'image', 'images', 'diary', 'journal', 'location', 'latitude', 'longitude', 'accuracy', 'password', 'token', 'authorization',
])

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `event-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function assertSafePayload(payload: ProductEventPayload) {
  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE_PAYLOAD_KEYS.has(key.toLowerCase())) throw new Error(`Sensitive product event payload key: ${key}`)
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
