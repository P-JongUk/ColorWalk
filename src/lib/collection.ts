import type { Locale, Post } from '@/types'
import { getColorFamily, type ColorFamily } from '@/lib/colors'

export const STREAK_BADGES = [3, 7, 14, 30] as const

export type StreakBadgeDays = (typeof STREAK_BADGES)[number]

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

export function getUnlockedBadges(streak: number) {
  return STREAK_BADGES.map((days) => ({
    days,
    unlocked: streak >= days,
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
    colors: monthlyPosts.map((post) => post.captured_hex),
    posts: monthlyPosts,
  }
}

export function getMoodColorSuggestions(hex: string, locale: Locale) {
  const family = getColorFamily(hex)
  const pool = [...moodNamePools[family][locale], ...extraMoodNamePools[family][locale]]
  const start = Math.abs(hashMoodSeed(hex)) % pool.length

  return Array.from({ length: 4 }, (_, index) => pool[(start + index * 3) % pool.length])
}

const moodNamePools: Record<ColorFamily, Record<Locale, string[]>> = {
  red: {
    ko: [
      '석양에 물든 체리',
      '심장 가까운 코랄',
      '골목 끝 토마토빛',
      '필름 속 레드오렌지',
      '따뜻한 경고등',
      '손끝에 남은 장미',
      '노을 아래 벽돌색',
      '운동장 뒤 라즈베리',
      '하루의 마지막 불빛',
      '살짝 뜨거운 루즈',
    ],
    en: [
      'Sunset Cherry',
      'Close-Heart Coral',
      'Alley Tomato',
      'Film Red Orange',
      'Warm Signal Light',
      'Rose on Fingertips',
      'Dusk Brick',
      'Raspberry Field',
      'Last Light',
      'Soft Hot Rouge',
    ],
  },
  orange: {
    ko: [
      '오후 네 시 살구',
      '버스정류장 피치',
      '햇살에 데운 귤',
      '노을 묻은 테라코타',
      '따뜻한 빵 봉투',
      '포켓 속 카라멜',
      '창가의 복숭아 숨',
      '주황빛 산책 온도',
      '주말 아침 오렌지',
      '갈색 앞의 코랄',
    ],
    en: [
      'Four-PM Apricot',
      'Bus Stop Peach',
      'Sun-Warmed Tangerine',
      'Dusk Terracotta',
      'Warm Bread Bag',
      'Pocket Caramel',
      'Window Peach Breath',
      'Orange Walk Temperature',
      'Weekend Orange',
      'Almost-Brown Coral',
    ],
  },
  yellow: {
    ko: [
      '등굣길 레몬 조각',
      '창문 위 꿀 한 방울',
      '포스트잇 햇살',
      '작은 가게 전구빛',
      '오후의 버터 노트',
      '비타민 같은 노랑',
      '햇볕 말린 바닐라',
      '문틈 사이 골드',
      '웃음 끝에 남은 빛',
      '따뜻한 크림 옐로',
    ],
    en: [
      'School-Run Lemon Slice',
      'Honey on the Window',
      'Post-It Sunlight',
      'Tiny Shop Bulb',
      'Afternoon Butter Note',
      'Vitamin Yellow',
      'Sun-Dried Vanilla',
      'Doorway Gold',
      'After-Smile Light',
      'Warm Cream Yellow',
    ],
  },
  green: {
    ko: [
      '비 온 뒤 난간 초록',
      '베란다 세이지',
      '가방 속 올리브',
      '초여름 잎맥',
      '조용한 편의점 민트',
      '유리컵에 비친 풀빛',
      '운동장 가장자리 그린',
      '새벽 공원 이끼',
      '느린 산책의 초록',
      '바람 지난 잎사귀',
    ],
    en: [
      'After-Rain Railing Green',
      'Balcony Sage',
      'Bag-Pocket Olive',
      'Early-Summer Leaf Vein',
      'Quiet Store Mint',
      'Glass-Reflected Green',
      'Field Edge Green',
      'Dawn Park Moss',
      'Slow Walk Green',
      'Wind-Touched Leaf',
    ],
  },
  blue: {
    ko: [
      '옥상 위 숨은 하늘',
      '비 온 뒤 버스창',
      '유리컵 낮빛',
      '이어폰 속 블루',
      '가벼운 숨의 파랑',
      '새벽 전 공기색',
      '복도 끝 스카이블루',
      '물병에 담긴 하늘',
      '손 씻은 뒤의 민트블루',
      '잠깐 멈춘 바다빛',
    ],
    en: [
      'Rooftop Hidden Sky',
      'After-Rain Bus Window',
      'Glass Daylight Blue',
      'Earbud Blue',
      'Light-Breath Blue',
      'Before-Dawn Air',
      'Hallway Sky Blue',
      'Bottle-Held Sky',
      'Washed-Hand Mint Blue',
      'Paused Sea Light',
    ],
  },
  purple: {
    ko: [
      '새벽 알림의 라벤더',
      '구름 뒤 바이올렛',
      '달빛 묻은 모브',
      '조용한 플레이리스트 퍼플',
      '밤 산책 라일락',
      '필름 속 보라 그림자',
      '잠들기 전 포도빛',
      '비밀 노트 바이올렛',
      '하교길 라벤더 그늘',
      '어두운 꽃잎 퍼플',
    ],
    en: [
      'Dawn-Notification Lavender',
      'Behind-Cloud Violet',
      'Moonlit Mauve',
      'Quiet Playlist Purple',
      'Night Walk Lilac',
      'Film Violet Shadow',
      'Before-Sleep Grape',
      'Secret Note Violet',
      'After-School Lavender Shade',
      'Dark Petal Purple',
    ],
  },
  pink: {
    ko: [
      '볼에 닿은 복숭아',
      '벚꽃 끝 코랄',
      '말랑한 메시지 핑크',
      '딸기우유 그림자',
      '따뜻한 손편지 로즈',
      '해 질 무렵 블러셔',
      '꽃잎 사이 햇살',
      '작은 하트의 온도',
      '구름 아래 핑크빛',
      '기분 좋아진 살몬',
    ],
    en: [
      'Cheek-Touched Peach',
      'Cherry-Blossom Coral',
      'Soft Message Pink',
      'Strawberry Milk Shadow',
      'Warm Letter Rose',
      'Dusk Blush',
      'Sun Between Petals',
      'Tiny Heart Temperature',
      'Pink Under Clouds',
      'Good-Mood Salmon',
    ],
  },
  neutral: {
    ko: [
      '접힌 편지의 베이지',
      '후드집업 그림자',
      '아침 책상 그레이',
      '오래된 필름 브라운',
      '조용한 카페 라떼',
      '안개 낀 리넨',
      '주머니 속 조약돌',
      '따뜻한 먼지빛',
      '문 닫힌 방의 차콜',
      '낮잠 전 우드톤',
    ],
    en: [
      'Folded Letter Beige',
      'Hoodie Shadow',
      'Morning Desk Gray',
      'Old Film Brown',
      'Quiet Cafe Latte',
      'Foggy Linen',
      'Pocket Pebble',
      'Warm Dust Light',
      'Closed-Room Charcoal',
      'Before-Nap Wood',
    ],
  },
}

const extraMoodNamePools: Record<ColorFamily, Record<Locale, string[]>> = {
  red: {
    ko: [
      '젖은 도로의 테일라이트',
      '우산 끝에 맺힌 빨강',
      '노을에 데운 벽돌',
      '가방 속 작은 사과',
      '비밀 편지의 씰링왁스',
      '겨울 볼끝의 체리',
      '횡단보도 옆 신호빛',
      '오래 입은 니트의 로즈',
      '창문에 비친 레드',
      '필름 가장자리 루비',
      '해질녘 자전거 후미등',
      '따뜻하게 닫힌 문틈',
    ],
    en: [
      'Wet Road Tail Light',
      'Umbrella-Tip Red',
      'Sun-Warmed Brick',
      'Small Apple in a Bag',
      'Sealing-Wax Letter',
      'Winter Cheek Cherry',
      'Crosswalk Signal Glow',
      'Worn-Knit Rose',
      'Window-Reflected Red',
      'Film-Edge Ruby',
      'Dusk Bicycle Light',
      'Warm Door-Crack Red',
    ],
  },
  orange: {
    ko: [
      '흙길 위 살구빛',
      '노을 묻은 종이봉투',
      '손난로 같은 귤빛',
      '오래된 지붕기와',
      '카페 조명 아래 테라코타',
      '산책 후 남은 복숭아',
      '구운 밤 껍질 오렌지',
      '햇볕 든 나무계단',
      '비 그친 뒤 생강빛',
      '문구점 크래프트 코랄',
      '오후 네 시 당근잎 그림자',
      '가을 벤치의 온도',
    ],
    en: [
      'Apricot on a Dirt Path',
      'Sunset Paper Bag',
      'Hand-Warmer Tangerine',
      'Old Roof Tile',
      'Cafe-Lamp Terracotta',
      'Post-Walk Peach',
      'Roasted Chestnut Orange',
      'Sunlit Wooden Stairs',
      'After-Rain Ginger',
      'Stationery Kraft Coral',
      'Four-PM Carrot Shade',
      'Autumn Bench Warmth',
    ],
  },
  yellow: {
    ko: [
      '은행잎 접은 골드',
      '비 오는 날 레인코트',
      '버터 종이의 빛',
      '골목 빵집 전구',
      '햇볕 말린 밀짚',
      '아침 버스 손잡이',
      '연필로 칠한 꿀빛',
      '창가에 놓인 레몬차',
      '잔잔한 주말 옐로',
      '눈 위에 얹힌 꿀',
      '책갈피 끝 바닐라',
      '낮잠 전 크림 골드',
    ],
    en: [
      'Folded Ginkgo Gold',
      'Rain-Day Raincoat',
      'Butter-Paper Light',
      'Alley Bakery Bulb',
      'Sun-Dried Straw',
      'Morning Bus Handle',
      'Penciled Honey',
      'Window Lemon Tea',
      'Quiet Weekend Yellow',
      'Honey on Snow',
      'Bookmark Vanilla',
      'Before-Nap Cream Gold',
    ],
  },
  green: {
    ko: [
      '젖은 풀잎의 숨',
      '나무벤치 아래 이끼',
      '찻잎을 닮은 올리브',
      '비 그친 산책로 세이지',
      '손바닥 위 허브 그림자',
      '오래된 캔버스백 그린',
      '창가 화분의 낮잠',
      '운동장 끝 잔디빛',
      '안개 속 고사리',
      '가로등 밑 블랙올리브',
      '겨울 코트의 세이지',
      '강변 바람의 민트',
    ],
    en: [
      'Wet Leaf Breath',
      'Moss Under a Bench',
      'Tea-Leaf Olive',
      'After-Rain Path Sage',
      'Herb Shadow in Your Palm',
      'Old Canvas-Bag Green',
      'Window-Plant Nap',
      'Field-Edge Grass',
      'Fern in Fog',
      'Black Olive Under Lamps',
      'Winter-Coat Sage',
      'Riverside Mint Wind',
    ],
  },
  blue: {
    ko: [
      '빗방울 너머 버스창',
      '새벽 전 옥상 공기',
      '세탁한 셔츠의 파랑',
      '물병 속 낮하늘',
      '유리컵 가장자리 블루',
      '흐린 날 이어폰빛',
      '멀리 식은 강물',
      '잠깐 열린 창문색',
      '서리 낀 스카이블루',
      '비 온 뒤 표지판 그림자',
      '조용한 복도 끝 하늘',
      '밤 산책의 잉크 블루',
    ],
    en: [
      'Bus Window Through Rain',
      'Pre-Dawn Rooftop Air',
      'Washed-Shirt Blue',
      'Day Sky in a Bottle',
      'Glass-Rim Blue',
      'Cloudy Earbud Blue',
      'Distant Cool River',
      'Briefly Open Window',
      'Frosted Sky Blue',
      'After-Rain Sign Shadow',
      'Hallway-End Sky',
      'Night-Walk Ink Blue',
    ],
  },
  purple: {
    ko: [
      '자두빛 나무그늘',
      '안개 낀 라벤더',
      '달빛 아래 모브노트',
      '밤공기 속 포도빛',
      '비 오는 날의 보라 우산',
      '잠들기 전 플레이리스트',
      '창문 밖 희미한 라일락',
      '필름 사진의 퍼플 그림자',
      '말린 꽃잎 바이올렛',
      '조용한 알림의 라벤더',
      '먹구름 틈 블랙베리',
      '오후의 연필 보라',
    ],
    en: [
      'Plum Tree Shade',
      'Fogged Lavender',
      'Moonlit Mauve Note',
      'Grape in Night Air',
      'Rain-Day Purple Umbrella',
      'Before-Sleep Playlist',
      'Faint Lilac Outside',
      'Film-Photo Purple Shadow',
      'Dried-Petal Violet',
      'Quiet Notification Lavender',
      'Blackberry Between Clouds',
      'Afternoon Pencil Purple',
    ],
  },
  pink: {
    ko: [
      '비에 씻긴 벚꽃',
      '따뜻한 손바닥 피치',
      '노을 아래 블러셔',
      '우유팩 옆 딸기빛',
      '작은 꽃집의 살몬',
      '창문에 번진 로즈',
      '장갑 속 복숭아',
      '편지 봉투의 핑크',
      '구름 사이 말랑 코랄',
      '걷다 발견한 꽃잎',
      '기분 좋은 첫 메시지',
      '겨울 목도리 로즈',
    ],
    en: [
      'Rain-Washed Blossom',
      'Warm-Palm Peach',
      'Dusk Blusher',
      'Strawberry Beside Milk',
      'Small Florist Salmon',
      'Window-Spread Rose',
      'Peach Inside Mittens',
      'Envelope Pink',
      'Soft Coral Between Clouds',
      'Found Petal on a Walk',
      'First Good Message',
      'Winter-Scarf Rose',
    ],
  },
  neutral: {
    ko: [
      '다이어리 종이 베이지',
      '나무책상 가장자리',
      '젖기 전 아스팔트',
      '닫힌 카페 월넛',
      '오래된 필름의 그레인',
      '안개 낀 크래프트',
      '코코아 식은 브라운',
      '주머니 속 따뜻한 조약돌',
      '울코트 그림자',
      '문틈 사이 라떼빛',
      '한지에 스민 아침',
      '밤 산책의 바크그레이',
    ],
    en: [
      'Diary-Paper Beige',
      'Wooden-Desk Edge',
      'Almost-Wet Asphalt',
      'Closed-Cafe Walnut',
      'Old Film Grain',
      'Hazy Kraft',
      'Cooled Cocoa Brown',
      'Warm Pocket Pebble',
      'Wool-Coat Shadow',
      'Latte Through a Door',
      'Rice-Paper Morning',
      'Night-Walk Bark Gray',
    ],
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
    return `${streak}일 연속 · 이번 달 ${monthly.count}색`
  }

  return `${streak} day streak · ${monthly.count} colors this month`
}
