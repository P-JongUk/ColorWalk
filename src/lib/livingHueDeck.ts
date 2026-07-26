import { hexToRgb, rgbToHex } from '@/lib/colors'
import { getPostGridImages } from '@/lib/grid'
import type { GridImage, Post } from '@/types'

export type DeckStage = 1 | 3 | 5 | 8
export type DeckSyncState = 'synced' | 'device' | 'pending'

export type LivingHueDeckCard = {
  post: Post
  images: GridImage[]
  photoCount: number
  stage: DeckStage
  canonicalMissionHex: string
  syncState: DeckSyncState
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

export function canonicalizeMissionHex(hex: string) {
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

    return [{
      post,
      images,
      photoCount: images.length,
      stage: getDeckStage(images.length),
      canonicalMissionHex: canonicalizeMissionHex(post.mission_hex),
      syncState: getDeckSyncState(post),
    }]
  })
}

export function getColorVolumes(cards: LivingHueDeckCard[]): ColorVolume[] {
  const volumes = new Map<string, LivingHueDeckCard[]>()

  cards.filter((card) => card.stage === 8).forEach((card) => {
    const grouped = volumes.get(card.canonicalMissionHex) ?? []
    grouped.push(card)
    volumes.set(card.canonicalMissionHex, grouped)
  })

  return [...volumes.entries()]
    .map(([missionHex, groupedCards]) => ({ missionHex, cards: groupedCards }))
    .sort((a, b) => b.cards[0].post.local_date.localeCompare(a.cards[0].post.local_date))
}
