import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'

import { getPerceptualDeltaE, hexToRgb } from '@/lib/colors'
import { normalizeGridImages } from '@/lib/grid'
import { parseStoryStickers, normalizeTemplateId, toLegacyDatabaseTemplateId } from '@/lib/story'
import type { GridImage, Locale, Post, ProfileGender, UserProfile } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined
const authEmailDomain = (import.meta.env.VITE_AUTH_EMAIL_DOMAIN as string | undefined) || 'gmail.com'
const MAX_UPLOAD_BYTES = 500 * 1024

export const isSupabaseConfigured = import.meta.env.VITE_E2E_LOCAL_ONLY !== 'true' && Boolean(supabaseUrl && supabaseKey)

type GlobalWithSupabase = typeof globalThis & {
  __colorWalkSupabaseClient?: SupabaseClient
}

function createColorWalkSupabaseClient() {
  return createClient(supabaseUrl!, supabaseKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? ((globalThis as GlobalWithSupabase).__colorWalkSupabaseClient ??= createColorWalkSupabaseClient())
  : null

type PostUpsertPayload = Record<string, unknown> & {
  grid_images?: GridImage[]
  story_template_id?: string | null
  client_meta?: Record<string, unknown> | null
}

let pendingAnonymousSession: Promise<Session | null> | null = null

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '')
}

function usernameToEmail(username: string) {
  const emailSafeUsername = username.replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '')
  return `colorwalk.beta.${emailSafeUsername}@${authEmailDomain}`
}

function profilePayload(
  session: Session,
  locale: Locale,
  profile?: {
    username?: string | null
    nickname?: string | null
    gender?: ProfileGender | null
    birthYear?: number | null
    authMethod?: 'anonymous' | 'password'
  },
) {
  const metadata = session.user.user_metadata ?? {}

  return {
    id: session.user.id,
    locale,
    updated_at: new Date().toISOString(),
    username: profile?.username ?? metadata.username ?? undefined,
    nickname: profile?.nickname ?? metadata.nickname ?? undefined,
    gender: profile?.gender ?? metadata.gender ?? undefined,
    birth_year: profile?.birthYear ?? metadata.birth_year ?? undefined,
    auth_method: profile?.authMethod ?? (session.user.is_anonymous ? 'anonymous' : 'password'),
  }
}

export async function ensureAnonymousSession() {
  if (!supabase) return null

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) return session

  pendingAnonymousSession ??= supabase.auth
    .signInAnonymously()
    .then(({ data, error }) => {
      if (error) throw error
      return data.session
    })
    .finally(() => {
      pendingAnonymousSession = null
    })

  return pendingAnonymousSession
}

export async function ensureProfile(
  session: Session,
  locale: Locale,
  profile?: {
    username?: string | null
    nickname?: string | null
    gender?: ProfileGender | null
    birthYear?: number | null
    authMethod?: 'anonymous' | 'password'
  },
) {
  if (!supabase) return

  const payload = Object.fromEntries(
    Object.entries(profilePayload(session, locale, profile)).filter(([, value]) => value !== undefined),
  )

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })

  if (error) throw error
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data as UserProfile | null
}

export async function signUpWithUsername({
  username,
  password,
  nickname,
  gender,
  birthYear,
  locale,
}: {
  username: string
  password: string
  nickname: string
  gender: ProfileGender
  birthYear: number
  locale: Locale
}) {
  if (!supabase) throw new Error('Supabase is not configured')

  const normalizedUsername = normalizeUsername(username)
  if (!/^[a-z0-9][a-z0-9_.]{2,19}$/.test(normalizedUsername)) {
    throw new Error('아이디는 영문/숫자로 시작하고 3-20자로 입력해 주세요.')
  }
  if (password.length < 6) throw new Error('비밀번호는 6자 이상으로 입력해 주세요.')

  const { data: edgeData, error: edgeError } = await supabase.functions.invoke('beta-signup', {
    body: {
      username: normalizedUsername,
      password,
      nickname: nickname.trim(),
      gender,
      birthYear,
      locale,
    },
  })

  if (edgeError) throw edgeError
  if (edgeData?.error) throw new Error(String(edgeData.error))

  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(edgeData?.email || usernameToEmail(normalizedUsername)),
    password,
  })

  if (error) throw error
  if (!data.session) throw new Error('No session returned')

  await ensureProfile(data.session, locale, {
    username: normalizedUsername,
    nickname: nickname.trim(),
    gender,
    birthYear,
    authMethod: 'password',
  })

  return data.session
}

export async function signInWithUsername(username: string, password: string, locale: Locale) {
  if (!supabase) throw new Error('Supabase is not configured')

  const normalizedUsername = normalizeUsername(username)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(normalizedUsername),
    password,
  })

  if (error) throw error
  if (!data.session) throw new Error('No session returned')

  await ensureProfile(data.session, locale)
  return data.session
}

export async function fetchPosts(userId: string): Promise<Post[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('local_date', { ascending: false })

  if (error) throw error

  const posts = ((data ?? []) as Post[]).map((post) => ({
    ...post,
    story_template_id: normalizeTemplateId(post.client_meta?.storyTemplateId ?? post.story_template_id),
    story_stickers: parseStoryStickers(post.story_stickers),
    grid_images: normalizeGridImages(post.grid_images).length
      ? normalizeGridImages(post.grid_images)
      : normalizeGridImages(post.client_meta?.gridImages),
    client_meta: post.client_meta ?? {},
  }))

  const imagePaths = Array.from(new Set(
    posts.flatMap((post) => [
      post.image_path,
      ...normalizeGridImages(post.grid_images).map((image) => image.path),
    ]).filter((path) => path && !/^(blob:|data:image\/|https?:\/\/)/.test(path)),
  ))
  const { data: signedUrls } = imagePaths.length
    ? await supabase.storage.from('post-images').createSignedUrls(imagePaths, 60 * 60)
    : { data: [] }
  const signedUrlByPath = new Map((signedUrls ?? []).map((item) => [item.path, item.signedUrl]))

  return posts.map((post) => {
    function signPath(path: string) {
      if (/^(blob:|data:image\/|https?:\/\/)/.test(path)) return path
      return signedUrlByPath.get(path)
    }

    const signedGridImages: GridImage[] = normalizeGridImages(post.grid_images).map((image) => ({
      ...image,
      signedUrl: signPath(image.path) ?? undefined,
    }))
    const signedImageUrl = post.image_path
      ? signPath(post.image_path)
      : signedGridImages[0]?.signedUrl

    return {
      ...post,
      grid_images: signedGridImages,
      signedImageUrl: signedImageUrl ?? undefined,
    }
  })
}

export async function uploadPostImage(userId: string, localDate: string, blob: Blob, assetId: string) {
  if (!supabase) throw new Error('Supabase is not configured')
  if (blob.type !== 'image/webp') throw new Error('Only WebP uploads are allowed')
  if (blob.size > MAX_UPLOAD_BYTES) throw new Error('Image is too large to upload')

  const path = `${userId}/${localDate}/${assetId}-preview-v1.webp`
  const { error } = await supabase.storage.from('post-images').upload(path, blob, {
    contentType: 'image/webp',
    upsert: true,
  })

  if (error) throw error

  return path
}

function needsLegacyPostFallback(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false
  const message = error.message ?? ''
  return (
    error.code === 'PGRST204' && message.includes('grid_images')
  ) || (
    error.code === '42703' && message.includes('grid_images')
  ) || (
    error.code === '23514' && message.includes('posts_story_template_id_check')
  )
}

function toLegacyPostPayload(payload: PostUpsertPayload): PostUpsertPayload {
  const { grid_images: gridImages = [], story_template_id: storyTemplateId, client_meta: clientMeta, ...rest } = payload

  return {
    ...rest,
    story_template_id: toLegacyDatabaseTemplateId(storyTemplateId),
    client_meta: {
      ...(clientMeta ?? {}),
      storyTemplateId: normalizeTemplateId(storyTemplateId),
      gridImages,
      gridImagesStorage: 'client_meta_fallback',
    },
  }
}

export async function upsertPostWithGridFallback(payload: PostUpsertPayload) {
  if (!supabase) throw new Error('Supabase is not configured')

  const result = await supabase
    .from('posts')
    .upsert(payload, { onConflict: 'user_id,local_date' })

  if (!result.error || !needsLegacyPostFallback(result.error)) return result

  return supabase
    .from('posts')
    .upsert(toLegacyPostPayload(payload), { onConflict: 'user_id,local_date' })
}

export async function deletePostImage(path: string) {
  if (!supabase) return
  if (!path || /^(blob:|data:image\/|https?:\/\/)/.test(path)) return

  const { error } = await supabase.storage.from('post-images').remove([path])
  if (error) throw error
}

export async function fetchColorNameSuggestions(hex: string, locale: Locale, limit = 6) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('color_name_suggestions')
    .select('name, hex, locale')
    .eq('locale', locale)
    .limit(500)

  if (error || !data?.length) return []

  const target = hexToRgb(hex)
  return [...new Set(
    data
      .map((item) => ({
        name: String(item.name),
        distance: getPerceptualDeltaE(target, hexToRgb(String(item.hex))),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.name),
  )].slice(0, limit)
}
