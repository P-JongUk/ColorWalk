import type { Locale, MissionPackId, MissionPackSelection, TimeBucket, WeatherGroup } from '@/types'

/**
 * M4 static mission packs. Exactly three packs plus the "no pack" free mode.
 * See docs/living-hue-deck-product-spec.md and the M4 plan for the approved contract:
 * packs are a whole-day intent, never a per-photo classifier, and never gate color choice.
 */
export type { MissionPackId, MissionPackSelection }

export type MissionPackConfig = {
  id: MissionPackId
  version: 1
  label: Record<Locale, string>
  description: Record<Locale, string>
}

export const MISSION_PACK_SELECTION_VERSION = 1 as const

export const MISSION_PACKS: readonly MissionPackConfig[] = [
  {
    id: 'indoor-hunt',
    version: 1,
    label: { ko: '실내 한 바퀴', en: 'Indoor Loop' },
    description: {
      ko: '집·교실·도서관·카페의 익숙한 물건을 색 보물찾기로 바꿔요.',
      en: 'Turn familiar objects at home, in class, the library, or a cafe into a color hunt.',
    },
  },
  {
    id: 'commute-hunt',
    version: 1,
    label: { ko: '오가는 길', en: 'On the Way' },
    description: {
      ko: '가방·좌석·표지판·창문·신호등처럼 통학·이동 중 반복되는 장면을 다시 봐요.',
      en: 'Look again at bags, seats, signs, windows, and signals along your commute.',
    },
  },
  {
    id: 'rainy-window',
    version: 1,
    label: { ko: '비 오는 창가', en: 'Rainy Window' },
    description: {
      ko: '우산·젖은 바닥·물웅덩이·창문 반사처럼 날씨가 만든 색을 찾아요.',
      en: 'Find colors made by weather: umbrellas, wet ground, puddles, window reflections.',
    },
  },
] as const

const MISSION_PACK_BY_ID = new Map(MISSION_PACKS.map((pack) => [pack.id, pack]))

export function getMissionPackConfig(id: MissionPackId | null | undefined) {
  if (!id) return null
  return MISSION_PACK_BY_ID.get(id) ?? null
}

export function isMissionPackId(value: unknown): value is MissionPackId {
  return typeof value === 'string' && MISSION_PACK_BY_ID.has(value as MissionPackId)
}

/**
 * "오늘 추천" badge mapping. This never auto-selects a pack; it only marks one
 * candidate as recommended based on the current weather/time context.
 */
export function getRecommendedMissionPackId(weatherGroup: WeatherGroup, timeBucket: TimeBucket): MissionPackId | null {
  if (weatherGroup === 'rain' || weatherGroup === 'storm') return 'rainy-window'
  if (timeBucket === 'morning' || timeBucket === 'sunset') return 'commute-hunt'
  if (timeBucket === 'day' || timeBucket === 'night') return 'indoor-hunt'
  return null
}

export function createFreeModeSelection(): MissionPackSelection {
  return { id: null, version: MISSION_PACK_SELECTION_VERSION }
}

export function createMissionPackSelection(id: MissionPackId | null): MissionPackSelection {
  return { id, version: MISSION_PACK_SELECTION_VERSION }
}

export function finalizeMissionPackSelection(selection: MissionPackSelection | null | undefined, finalizedAt: string): MissionPackSelection {
  return { id: selection?.id ?? null, version: MISSION_PACK_SELECTION_VERSION, finalizedAt }
}

/**
 * Parses an unknown value (from DailyMissionState, CaptureDraft, or client_meta.colorHunt)
 * into a MissionPackSelection. Returns null when the field is absent (legacy/pre-M4),
 * distinct from an explicit free-mode `{ id: null }` selection.
 */
export function parseMissionPackSelection(value: unknown): MissionPackSelection | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  // Unknown/invalid non-null id values fall back to free mode rather than inventing a pack.
  const id = isMissionPackId(record.id) ? record.id : null
  const finalizedAt = typeof record.finalizedAt === 'string' ? record.finalizedAt : undefined
  return { id, version: MISSION_PACK_SELECTION_VERSION, ...(finalizedAt ? { finalizedAt } : {}) }
}

/**
 * `posts.client_meta.colorHunt` contract. version 2 adds `missionPack`; version 1 and
 * records without `colorHunt` at all are legacy and are never inferred/backfilled here.
 */
export type ColorHuntMeta = {
  version: 2
  status: 'recorded' | 'completed'
  photoCount: number
  lockedAt?: string
  closedAt?: string
  missionPack: MissionPackSelection
}

export const COLOR_HUNT_VERSION = 2 as const

export function buildColorHuntMeta(params: {
  photoCount: number
  lockedAt?: string
  closedAt?: string
  missionPack: MissionPackSelection
}): ColorHuntMeta {
  return {
    version: COLOR_HUNT_VERSION,
    status: params.photoCount >= 8 ? 'completed' : 'recorded',
    photoCount: params.photoCount,
    lockedAt: params.lockedAt,
    closedAt: params.closedAt,
    missionPack: params.missionPack,
  }
}

/**
 * Merges known M4 colorHunt fields into an existing client_meta object without dropping
 * unknown client_meta or unknown colorHunt sub-fields. Never replaces either object wholesale.
 */
export function mergeColorHuntIntoClientMeta(
  existingClientMeta: Record<string, unknown> | null | undefined,
  colorHunt: ColorHuntMeta,
): Record<string, unknown> {
  const existingColorHunt = existingClientMeta?.colorHunt
  const existingColorHuntRecord = existingColorHunt && typeof existingColorHunt === 'object'
    ? existingColorHunt as Record<string, unknown>
    : {}
  return {
    ...(existingClientMeta ?? {}),
    colorHunt: {
      ...existingColorHuntRecord,
      ...colorHunt,
    },
  }
}

/**
 * Reads the mission pack selection out of `client_meta.colorHunt`. Returns null for
 * version 1, legacy records with no `colorHunt`, or any other non-v2 shape. Never infers
 * a pack for those records.
 */
export function readMissionPackFromClientMeta(clientMeta: Record<string, unknown> | null | undefined): MissionPackSelection | null {
  const colorHunt = clientMeta?.colorHunt
  if (!colorHunt || typeof colorHunt !== 'object') return null
  const record = colorHunt as Record<string, unknown>
  if (record.version !== 2) return null
  return parseMissionPackSelection(record.missionPack)
}

/**
 * Fixed allowlisted analytics cta suffixes. See docs plan section 3 "Analytics 최소 확장":
 * mission_pack_selected_indoor / _commute / _rainy_window / mission_pack_cleared. No new
 * event name or payload key is introduced; only these primary_cta_clicked.cta values.
 */
export const MISSION_PACK_ANALYTICS_SUFFIX: Record<MissionPackId, string> = {
  'indoor-hunt': 'indoor',
  'commute-hunt': 'commute',
  'rainy-window': 'rainy_window',
}

export function getMissionPackAnalyticsCta(id: MissionPackId | null) {
  return id ? `mission_pack_selected_${MISSION_PACK_ANALYTICS_SUFFIX[id]}` : 'mission_pack_cleared'
}

export function getMissionPackCollectionScreen(id: MissionPackId) {
  return `mission_pack_collection_${MISSION_PACK_ANALYTICS_SUFFIX[id]}` as const
}
