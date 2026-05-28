import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'

import { getPerceptualDeltaE, hexToRgb } from '@/lib/colors'
import { parseStoryStickers, normalizeTemplateId } from '@/lib/story'
import type { Locale, Post, ProfileGender, UserProfile } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined
const authEmailDomain = (import.meta.env.VITE_AUTH_EMAIL_DOMAIN as string | undefined) || 'gmail.com'
const MAX_UPLOAD_BYTES = 420 * 1024

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

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
  inviteCode,
}: {
  username: string
  password: string
  nickname: string
  gender: ProfileGender
  birthYear: number
  locale: Locale
  inviteCode?: string
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
      inviteCode,
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
    story_template_id: normalizeTemplateId(post.story_template_id),
    story_stickers: parseStoryStickers(post.story_stickers),
    client_meta: post.client_meta ?? {},
  }))

  return Promise.all(
    posts.map(async (post) => {
      if (/^(blob:|data:image\/|https?:\/\/)/.test(post.image_path)) {
        return {
          ...post,
          signedImageUrl: post.image_path,
        }
      }

      const { data: signed } = await supabase.storage
        .from('post-images')
        .createSignedUrl(post.image_path, 60 * 60)

      return {
        ...post,
        signedImageUrl: signed?.signedUrl ?? undefined,
      }
    }),
  )
}

export async function uploadPostImage(userId: string, localDate: string, blob: Blob) {
  if (!supabase) throw new Error('Supabase is not configured')
  if (blob.type !== 'image/webp') throw new Error('Only WebP uploads are allowed')
  if (blob.size > MAX_UPLOAD_BYTES) throw new Error('Image is too large to upload')

  const path = `${userId}/${localDate}-${crypto.randomUUID()}.webp`
  const { error } = await supabase.storage.from('post-images').upload(path, blob, {
    contentType: 'image/webp',
    upsert: false,
  })

  if (error) throw error

  return path
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
