import type { Locale, Post } from '@/types'
import { getColorFamily, type ColorFamily } from '@/lib/colors'
import { getPostGridImageCount } from '@/lib/grid'

export const STREAK_BADGES = [3, 7, 14, 30] as const

export type StreakBadgeDays = (typeof STREAK_BADGES)[number]

// Keep this mapping aligned with docs/colorwalk-reward-system.md.
// Streaks should unlock creative memory tools, not score pressure.
const badgeRewards: Record<StreakBadgeDays, Record<Locale, string>> = {
  3: { ko: '작은 스티커팩', en: 'Tiny sticker pack' },
  7: { ko: '위클리 프레임', en: 'Weekly frame' },
  14: { ko: '포토부스 테두리', en: 'Photobooth border' },
  30: { ko: '시그니처 프레임', en: 'Signature frame' },
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getCurrentStreak(posts: Post[], today = new Date()) {
  const dates = new Set(posts.map((post) => post.local_date))
  const cursor = new Date(today)
  let streak = 0

  while (dates.has(toDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function getCompletedGridCount(posts: Post[]) {
  return posts.filter((post) => getPostGridImageCount(post) >= 8).length
}

export function getTotalGridPhotoCount(posts: Post[]) {
  return posts.reduce((sum, post) => sum + getPostGridImageCount(post), 0)
}

export function getUnlockedBadges(streak: number, posts: Post[] = [], locale: Locale = 'ko') {
  const completedGrids = getCompletedGridCount(posts)

  return STREAK_BADGES.map((days) => ({
    days,
    unlocked: streak >= days || completedGrids >= days,
    reward: badgeRewards[days][locale],
    completedGrids,
  }))
}

export function getMonthlyCollection(posts: Post[], month = new Date()) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const monthlyPosts = posts
    .filter((post) => {
      const date = new Date(`${post.local_date}T12:00:00`)
      return date.getFullYear() === year && date.getMonth() === monthIndex
    })
    .sort((a, b) => a.local_date.localeCompare(b.local_date))

  return {
    count: monthlyPosts.length,
    completedGridCount: getCompletedGridCount(monthlyPosts),
    photoCount: getTotalGridPhotoCount(monthlyPosts),
    colors: monthlyPosts.map((post) => post.mission_hex || post.captured_hex),
    posts: monthlyPosts,
  }
}

export function getMoodColorSuggestions(hex: string, locale: Locale) {
  const family = getColorFamily(hex)
  const pool = moodNamePools[family][locale]
  const start = Math.abs(hashMoodSeed(hex)) % pool.length

  return Array.from({ length: 4 }, (_, index) => pool[(start + index * 3) % pool.length])
}

const moodNamePools: Record<ColorFamily, Record<Locale, string[]>> = {
  red: {
    ko: ['노을빛 코랄', '따뜻한 체리', '골목 토마토', '필름 레드', '작은 사과빛', '저녁 루비', '장미 그림자', '햇살 로즈'],
    en: ['Sunset Coral', 'Warm Cherry', 'Alley Tomato', 'Film Red', 'Tiny Apple', 'Dusk Ruby', 'Rose Shadow', 'Sunlit Rouge'],
  },
  orange: {
    ko: ['피치 멜로우', '버스정류장 살구', '주머니 캐러멜', '오후의 테라코타', '따뜻한 빵봉투', '가을 벤치', '햇살 귤빛', '포켓 코랄'],
    en: ['Peach Mellow', 'Bus Stop Apricot', 'Pocket Caramel', 'Afternoon Terracotta', 'Warm Bread Bag', 'Autumn Bench', 'Sunlit Tangerine', 'Pocket Coral'],
  },
  yellow: {
    ko: ['창가의 레몬티', '버터 노트', '작은 전구빛', '주말 크림', '꿀빛 조각', '포스트잇 햇살', '바닐라 골드', '책갈피 옐로우'],
    en: ['Window Lemon Tea', 'Butter Note', 'Tiny Bulb Light', 'Weekend Cream', 'Honey Slice', 'Post-it Sunlight', 'Vanilla Gold', 'Bookmark Yellow'],
  },
  green: {
    ko: ['비 온 뒤 세이지', '발코니 민트', '가방 속 올리브', '초여름 잎맥', '산책길 모스', '바람 탄 잎빛', '조용한 허브', '유리창 그린'],
    en: ['After-rain Sage', 'Balcony Mint', 'Pocket Olive', 'Early Leaf Vein', 'Walkway Moss', 'Wind-touched Leaf', 'Quiet Herb', 'Window Green'],
  },
  blue: {
    ko: ['새벽 전 잉크블루', '빗방울 버스창', '유리컵 하늘', '이어폰 블루', '가벼운 숨의 파랑', '복도 끝 스카이', '물병 속 하늘', '밤 산책 블루'],
    en: ['Before-dawn Ink Blue', 'Rainy Bus Window', 'Glass Sky', 'Earbud Blue', 'Light-breath Blue', 'Hallway Sky', 'Bottle-held Sky', 'Night-walk Blue'],
  },
  purple: {
    ko: ['구름 뒤 라벤더', '달빛 모브', '조용한 플레이리스트', '밤 산책 라일락', '필름 보라 그림자', '잠들기 전 포도빛', '비밀 노트 바이올렛', '마른 꽃잎 퍼플'],
    en: ['Cloud-back Lavender', 'Moonlit Mauve', 'Quiet Playlist', 'Night-walk Lilac', 'Film Violet Shadow', 'Before-sleep Grape', 'Secret Note Violet', 'Dried Petal Purple'],
  },
  pink: {
    ko: ['벚꽃 코랄', '말랑한 메시지 핑크', '딸기우유 그림자', '따뜻한 편지 로즈', '저녁 블러시', '작은 하트 온도', '구름 아래 핑크', '기분 좋은 살몬'],
    en: ['Blossom Coral', 'Soft Message Pink', 'Strawberry Milk Shadow', 'Warm Letter Rose', 'Dusk Blush', 'Tiny Heart Temperature', 'Pink Under Clouds', 'Good-mood Salmon'],
  },
  neutral: {
    ko: ['접힌 편지 베이지', '후드집업 그림자', '아침 책상 그레이', '오래된 필름 브라운', '조용한 카페 라떼', '안개 낀 리넨', '주머니 조약돌', '문틈 사이 차콜'],
    en: ['Folded Letter Beige', 'Hoodie Shadow', 'Morning Desk Gray', 'Old Film Brown', 'Quiet Cafe Latte', 'Foggy Linen', 'Pocket Pebble', 'Door-crack Charcoal'],
  },
}

function hashMoodSeed(value: string) {
  return value
    .replace('#', '')
    .split('')
    .reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261)
}

export function getCollectionSummary(posts: Post[], locale: Locale, today = new Date()) {
  const streak = getCurrentStreak(posts, today)
  const monthly = getMonthlyCollection(posts, today)

  if (locale === 'ko') {
    return `${streak}일 연속 · 이번 달 ${monthly.completedGridCount}그리드`
  }

  return `${streak} day streak · ${monthly.completedGridCount} grids this month`
}
