import type {
  Locale,
  StoryDesign,
  StoryStickerCategory,
  StoryStickerDefinition,
  StoryStickerItem,
  StoryTemplateId,
} from '@/types'

export type StoryTemplateCategory = 'recommended' | 'mongle' | 'travel' | 'editorial' | 'minimal'

export type StoryTemplate = {
  id: StoryTemplateId
  category: StoryTemplateCategory
  name: Record<Locale, string>
  caption: Record<Locale, string>
  className: string
}

const stickerBase = '/stickers/colorwalk-doodles'

export const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: 'passport',
    category: 'recommended',
    name: { ko: '컬러 패스포트', en: 'Passport' },
    caption: { ko: '오늘 발견한 색을 스탬프처럼', en: 'A color stamp from today' },
    className: 'story-template-passport',
  },
  {
    id: 'mongle',
    category: 'mongle',
    name: { ko: '몽글', en: 'Mongle' },
    caption: { ko: '구름처럼 부드러운 오늘', en: 'Cloud-soft daily mood' },
    className: 'story-template-mongle',
  },
  {
    id: 'travel',
    category: 'travel',
    name: { ko: '비행기 여행', en: 'Air Trip' },
    caption: { ko: '오늘 색으로 떠나는 작은 여행', en: 'A tiny color trip' },
    className: 'story-template-travel',
  },
  {
    id: 'modern',
    category: 'minimal',
    name: { ko: '모던', en: 'Modern' },
    caption: { ko: '깔끔한 컬러 포스터', en: 'Clean color poster' },
    className: 'story-template-modern',
  },
  {
    id: 'newspaper',
    category: 'editorial',
    name: { ko: '신문', en: 'Newsprint' },
    caption: { ko: '오늘의 컬러 뉴스', en: 'Today color news' },
    className: 'story-template-newspaper',
  },
  {
    id: 'polaroid',
    category: 'editorial',
    name: { ko: '폴라로이드', en: 'Polaroid' },
    caption: { ko: '사진 한 장과 색 조각', en: 'A photo and two color chips' },
    className: 'story-template-polaroid',
  },
  {
    id: 'receipt',
    category: 'editorial',
    name: { ko: '영수증', en: 'Receipt' },
    caption: { ko: '오늘만의 컬러 영수증', en: 'Color receipt' },
    className: 'story-template-receipt',
  },
  {
    id: 'minimal',
    category: 'minimal',
    name: { ko: '미니멀', en: 'Minimal' },
    caption: { ko: '색만 남기는 조용한 카드', en: 'Only the color remains' },
    className: 'story-template-minimal',
  },
]

export const TEMPLATE_CATEGORIES: Array<{ id: StoryTemplateCategory; label: Record<Locale, string> }> = [
  { id: 'recommended', label: { ko: '추천', en: 'For you' } },
  { id: 'mongle', label: { ko: '몽글', en: 'Mongle' } },
  { id: 'travel', label: { ko: '여행', en: 'Travel' } },
  { id: 'editorial', label: { ko: '에디토리얼', en: 'Editorial' } },
  { id: 'minimal', label: { ko: '모던', en: 'Modern' } },
]

export const STICKER_CATEGORIES: Array<{ id: StoryStickerCategory; label: Record<Locale, string> }> = [
  { id: 'all', label: { ko: '전체', en: 'All' } },
  { id: 'mongle', label: { ko: '몽글', en: 'Mongle' } },
  { id: 'daily', label: { ko: '데일리', en: 'Daily' } },
  { id: 'weather', label: { ko: '날씨', en: 'Weather' } },
  { id: 'travel', label: { ko: '여행', en: 'Trip' } },
  { id: 'color', label: { ko: '컬러', en: 'Color' } },
]

function sticker(
  id: string,
  pack: Exclude<StoryStickerCategory, 'all'>,
  label: string,
  keywords: string[],
  defaultScale = 1,
): StoryStickerDefinition {
  return {
    id,
    category: pack,
    pack,
    label,
    assetUrl: `${stickerBase}/${id}.png`,
    keywords,
    defaultScale,
  }
}

export const STORY_STICKERS: StoryStickerDefinition[] = [
  sticker('soft-cloud', 'mongle', 'soft cloud', ['cloud', 'soft', 'mongle', '구름'], 1.04),
  sticker('happy-bubble', 'mongle', 'happy bubble', ['bubble', 'smile', '말풍선'], 1.02),
  sticker('heart-outline', 'mongle', 'heart outline', ['heart', 'love', '하트'], 1),
  sticker('sparkle-stars', 'mongle', 'sparkle stars', ['star', 'sparkle', '별'], 0.92),
  sticker('rainbow-clouds', 'mongle', 'rainbow clouds', ['rainbow', 'cloud', '무지개'], 0.92),
  sticker('flower', 'mongle', 'flower', ['flower', 'spring', '꽃'], 0.94),

  sticker('new-post', 'daily', 'new post', ['new', 'post', '새 기록'], 0.98),
  sticker('bored-word', 'daily', 'bored', ['bored', 'mood', '지루함'], 0.95),
  sticker('coffee-time', 'daily', 'coffee time', ['coffee', 'cafe', '커피'], 1),
  sticker('today-mood', 'daily', 'today mood', ['today', 'mood', '오늘'], 1),
  sticker('cat-face', 'daily', 'cat face', ['cat', 'cute', '고양이'], 0.94),
  sticker('lemon-face', 'daily', 'lemon face', ['lemon', 'fresh', '레몬'], 0.96),
  sticker('moon-stars', 'daily', 'moon stars', ['moon', 'night', '밤'], 0.94),

  sticker('rain-drops', 'weather', 'rain drops', ['rain', 'drop', '비'], 0.88),
  sticker('wavy-lines', 'weather', 'wavy lines', ['wave', 'wind', '바람'], 0.9),
  sticker('highlight-lines', 'weather', 'highlight lines', ['shine', 'line', '빛'], 0.9),
  sticker('sun-face', 'weather', 'sun face', ['sun', 'clear', '해'], 0.9),
  sticker('paint-blob', 'weather', 'paint blob', ['blob', 'drop', '물감'], 0.9),

  sticker('airplane', 'travel', 'airplane', ['plane', 'trip', '비행기'], 0.92),
  sticker('dotted-route', 'travel', 'dotted route', ['route', 'path', '길'], 0.9),
  sticker('map-pin', 'travel', 'map pin', ['pin', 'place', '위치'], 0.92),
  sticker('travel-ticket', 'travel', 'travel ticket', ['ticket', 'pass', '티켓'], 0.95),
  sticker('passport-stamp', 'travel', 'passport stamp', ['stamp', 'passport', '스탬프'], 0.92),

  sticker('color-palette', 'color', 'color palette', ['palette', 'swatch', '팔레트'], 0.92),
  sticker('washi-tape', 'color', 'washi tape', ['tape', 'paper', '테이프'], 0.9),
  sticker('tiny-camera', 'color', 'tiny camera', ['camera', 'photo', '카메라'], 0.88),
  sticker('color-walk-word', 'color', 'color walk', ['colorwalk', 'logo', '컬러워크'], 0.95),
]

export const DEFAULT_STORY_DESIGN: StoryDesign = {
  templateId: 'passport',
  stickers: [
    { uid: 'default-stamp', stickerId: 'passport-stamp', x: 82, y: 78, scale: 0.58, rotation: -12 },
  ],
}

export function getStoryTemplate(id: StoryTemplateId) {
  return STORY_TEMPLATES.find((template) => template.id === id) ?? STORY_TEMPLATES[0]
}

export function getStickerDefinition(id: string) {
  return STORY_STICKERS.find((sticker) => sticker.id === id) ?? STORY_STICKERS[0]
}

export function createStickerItem(stickerId: string, index: number): StoryStickerItem {
  const definition = getStickerDefinition(stickerId)

  return {
    uid: `${stickerId}-${Date.now()}-${index}`,
    stickerId,
    x: 18 + ((index * 17) % 54),
    y: 22 + ((index * 13) % 52),
    scale: definition.defaultScale ?? 1,
    rotation: [-8, 6, -3, 10][index % 4],
  }
}

export function parseStoryStickers(value: unknown): StoryStickerItem[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is StoryStickerItem => {
      if (!item || typeof item !== 'object') return false
      const candidate = item as StoryStickerItem
      return (
        typeof candidate.uid === 'string' &&
        typeof candidate.stickerId === 'string' &&
        typeof candidate.x === 'number' &&
        typeof candidate.y === 'number' &&
        typeof candidate.scale === 'number' &&
        typeof candidate.rotation === 'number'
      )
    })
    .map((item) => ({
      ...item,
      x: Math.min(94, Math.max(4, item.x)),
      y: Math.min(94, Math.max(4, item.y)),
      scale: Math.min(2.2, Math.max(0.45, item.scale)),
      rotation: Math.min(32, Math.max(-32, item.rotation)),
    }))
}

export function normalizeTemplateId(value: unknown): StoryTemplateId {
  return STORY_TEMPLATES.some((template) => template.id === value)
    ? (value as StoryTemplateId)
    : DEFAULT_STORY_DESIGN.templateId
}
