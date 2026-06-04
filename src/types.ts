export type Locale = 'ko' | 'en'

export type WeatherGroup = 'clear' | 'clouds' | 'rain' | 'snow' | 'storm' | 'fog'

export type TimeBucket = 'morning' | 'day' | 'sunset' | 'night'

export type Rgb = {
  r: number
  g: number
  b: number
}

export type Mission = {
  id: string
  hex: string
  weatherGroup: WeatherGroup
  timeBucket: TimeBucket
  weatherCode?: number
  label: Record<Locale, string>
  prompt: Record<Locale, string>
  hint: Record<Locale, string>
  source: 'live' | 'fallback'
}

export type CaptureDraft = {
  mission: Mission
  gridImages: GridDraftImage[]
  abuseWarning: boolean
  compression?: {
    width: number
    height: number
    bytes: number
    quality: number
    source: 'camera' | 'album'
    stage?: 'draft' | 'upload'
  }
}

export type GridImageSource = 'camera' | 'album' | 'seed' | 'legacy'

export type GridDraftImage = {
  id: string
  slot: number
  previewUrl: string
  imageBlob: Blob
  width: number
  height: number
  bytes: number
  quality: number | null
  mimeType?: string
  originalWidth?: number
  originalHeight?: number
  originalBytes?: number
  source: Extract<GridImageSource, 'camera' | 'album'>
  createdAt: string
}

export type GridImage = {
  id: string
  slot: number
  path: string
  signedUrl?: string
  previewUrl?: string
  width?: number | null
  height?: number | null
  bytes?: number | null
  source?: GridImageSource
  createdAt?: string | null
}

export type Post = {
  id: string
  user_id: string
  created_at: string
  local_date: string
  mission_hex: string
  captured_hex: string
  match_rate: number
  image_path: string
  custom_color_name: string | null
  journal_answer: string | null
  locale: Locale
  weather_code: number | null
  weather_group: WeatherGroup | null
  time_bucket: TimeBucket | null
  mission_label: string | null
  mission_prompt: string | null
  abuse_warning: boolean
  location_name?: string | null
  location_latitude?: number | null
  location_longitude?: number | null
  location_accuracy_m?: number | null
  story_template_id?: StoryTemplateId | null
  story_stickers?: StoryStickerItem[] | null
  grid_images?: GridImage[] | null
  client_meta?: Record<string, unknown> | null
  signedImageUrl?: string
}

export type ProfileGender = 'female' | 'male' | 'nonbinary' | 'prefer_not_to_say'

export type UserProfile = {
  id: string
  created_at?: string
  updated_at?: string
  current_streak?: number
  locale: Locale
  username?: string | null
  nickname?: string | null
  gender?: ProfileGender | null
  birth_year?: number | null
  auth_method?: 'anonymous' | 'password' | string
}

export type StoryTemplateId =
  | 'soft-passport'
  | 'life-cut'
  | 'air-trip'
  | 'modern-grid'
  | 'newsprint'
  | 'polaroid-grid'
  | 'sponsor-clean'
  | 'color-ticket'

export type StoryStickerCategory =
  | 'all'
  | 'mongle'
  | 'daily'
  | 'weather'
  | 'travel'
  | 'color'

export type StoryStickerDefinition = {
  id: string
  category: StoryStickerCategory
  pack: StoryStickerCategory
  label: string
  assetUrl: string
  keywords: string[]
  defaultScale?: number
}

export type StoryStickerItem = {
  uid: string
  stickerId: string
  x: number
  y: number
  scale: number
  rotation: number
}

export type StoryDesign = {
  templateId: StoryTemplateId
  stickers: StoryStickerItem[]
}

export type AppTab = 'today' | 'camera' | 'journal' | 'calendar' | 'profile'
