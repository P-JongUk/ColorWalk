import { hexToRgb, rgbToHex } from '@/lib/colors'
import { getPostGridImages } from '@/lib/grid'
import { readMissionPackFromClientMeta } from '@/lib/missionPacks'
import type { GridImage, MissionPackId, Post } from '@/types'

export type DeckStage = 1 | 3 | 5 | 8
export type DeckSyncState = 'synced' | 'device' | 'pending'

export type LivingHueDeckCard = {
  post: Post
  images: GridImage[]
  photoCount: number
  stage: DeckStage
  /** Canonical uppercase mission_hex, or null when the record's mission_hex is not a valid 6-digit hex. */
  canonicalMissionHex: string | null
  syncState: DeckSyncState
  /** Finalized pack ID for this record, or null for free mode/legacy/still-open records. */
  missionPackId: MissionPackId | null
}

export type ColorVolume = {
  missionHex: string
  cards: LivingHueDeckCard[]
}

export function getDeckStage(photoCount: number): DeckStage {
  if (photoCount >= 8) return 8
  if (photoCount >= 5) return 5
  if (photoCount >= 3) return 3
  return 1
}

/**
 * Returns the canonical uppercase mission_hex, or null when hex is not a valid 6-digit hex.
 * Never throws - invalid legacy mission_hex records must not break Deck/Hueprint/Capsule
 * screens. Callers must not substitute captured_hex, image pixels, weather, or a color name.
 */
export function canonicalizeMissionHex(hex: string): string | null {
  if (!/^#?[0-9a-fA-F]{6}$/.test(hex)) return null
  return rgbToHex(hexToRgb(hex))
}

function getDeckSyncState(post: Post): DeckSyncState {
  const state = post.client_meta?.localSyncState
  if (state === 'synced') return 'synced'
  if (state === 'pending' || state === 'upload' || state === 'post') return 'pending'
  if (post.id.startsWith('local:') || state === 'local') return 'device'
  return 'synced'
}

export function getLivingHueDeckCards(posts: Post[]): LivingHueDeckCard[] {
  return posts.flatMap((post) => {
    const images = getPostGridImages(post)
    if (!images.length) return []

    const missionPack = readMissionPackFromClientMeta(post.client_meta)
    return [{
      post,
      images,
      photoCount: images.length,
      stage: getDeckStage(images.length),
      canonicalMissionHex: canonicalizeMissionHex(post.mission_hex),
      syncState: getDeckSyncState(post),
      missionPackId: missionPack?.finalizedAt ? missionPack.id : null,
    }]
  })
}

export function getColorVolumes(cards: LivingHueDeckCard[]): ColorVolume[] {
  const volumes = new Map<string, LivingHueDeckCard[]>()

  // Invalid-color cards (canonicalMissionHex === null) stay visible as regular Deck cards
  // but are excluded from Color Volume grouping - no fake substitute color is invented.
  cards.filter((card) => card.stage === 8 && card.canonicalMissionHex).forEach((card) => {
    const grouped = volumes.get(card.canonicalMissionHex!) ?? []
    grouped.push(card)
    volumes.set(card.canonicalMissionHex!, grouped)
  })

  return [...volumes.entries()]
    .map(([missionHex, groupedCards]) => ({ missionHex, cards: groupedCards }))
    .sort((a, b) => b.cards[0].post.local_date.localeCompare(a.cards[0].post.local_date))
}
