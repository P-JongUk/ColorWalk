import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

async function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const fullPath = path.join(root, file)
    if (!existsSync(fullPath)) continue
    const content = await readFile(fullPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [key, ...rest] = trimmed.split('=')
      if (!process.env[key]) process.env[key] = rest.join('=').trim()
    }
  }
}

async function loadPrivateTestAccountEnv() {
  const fullPath = path.join(root, 'docs', 'beta-test-account.private.md')
  if (!existsSync(fullPath)) return

  const content = await readFile(fullPath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*(username|password|nickname|birth_year|gender):\s*(.+?)\s*$/)
    if (!match) continue
    const [, key, value] = match
    const envKey = `COLORWALK_TEST_${key.toUpperCase()}`
    if (!process.env[envKey]) process.env[envKey] = value
  }
}

function getTestAccount() {
  const username = process.env.COLORWALK_TEST_USERNAME
  const password = process.env.COLORWALK_TEST_PASSWORD

  if (!username || !password) {
    throw new Error(
      'Missing COLORWALK_TEST_USERNAME or COLORWALK_TEST_PASSWORD. See docs/beta-test-account.private.md.',
    )
  }

  return {
    username,
    password,
    nickname: process.env.COLORWALK_TEST_NICKNAME || '테스트 워커',
    gender: process.env.COLORWALK_TEST_GENDER || 'prefer_not_to_say',
    birthYear: Number(process.env.COLORWALK_TEST_BIRTH_YEAR || 2008),
    locale: process.env.COLORWALK_TEST_LOCALE || 'ko',
  }
}

function usernameToEmail(username) {
  const domain = process.env.VITE_AUTH_EMAIL_DOMAIN || 'gmail.com'
  const emailSafeUsername = username.replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '')
  return `colorwalk.beta.${emailSafeUsername}@${domain}`
}

function toDateKey(offsetDays) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() - offsetDays)
  return date.toISOString().slice(0, 10)
}

const assetPool = [
  'mongle-bloom.webp',
  'earth-soft-border.webp',
  'mongle-edge.webp',
  'earth-fiber-line.webp',
  'mongle-tape.webp',
  'earth-stamp-ring.webp',
  'earth-washi-line.webp',
  'mongle-dust.webp',
]

function needsLegacyPostFallback(error) {
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

function toLegacyTemplateId(templateId) {
  return {
    'soft-passport': 'passport',
    'life-cut': 'minimal',
    'air-trip': 'travel',
    'modern-grid': 'modern',
    newsprint: 'newspaper',
    'polaroid-grid': 'polaroid',
    'sponsor-clean': 'minimal',
    'color-ticket': 'receipt',
  }[templateId] ?? 'passport'
}

function toLegacyPostPayload(payload) {
  const { grid_images: gridImages = [], story_template_id: storyTemplateId, client_meta: clientMeta, ...rest } = payload

  return {
    ...rest,
    story_template_id: toLegacyTemplateId(storyTemplateId),
    client_meta: {
      ...(clientMeta ?? {}),
      storyTemplateId,
      gridImages,
      gridImagesStorage: 'client_meta_fallback',
    },
  }
}

async function upsertPostWithFallback(client, payload) {
  const upsert = await client.from('posts').upsert(payload, { onConflict: 'user_id,local_date' })
  if (!upsert.error || !needsLegacyPostFallback(upsert.error)) {
    return { ...upsert, usedFallback: false }
  }

  const fallback = await client.from('posts').upsert(toLegacyPostPayload(payload), { onConflict: 'user_id,local_date' })
  return { ...fallback, usedFallback: true }
}

function collectImagePathsFromPosts(posts) {
  return Array.from(new Set(
    posts.flatMap((post) => [
      post.image_path,
      ...(Array.isArray(post.grid_images) ? post.grid_images : []),
      ...(Array.isArray(post.client_meta?.gridImages) ? post.client_meta.gridImages : []),
    ])
      .map((item) => (typeof item === 'string' ? item : item?.path))
      .filter((item) => typeof item === 'string' && item && !/^(blob:|data:image\/|https?:\/\/)/.test(item)),
  ))
}

async function fetchExistingSeedPostImagePaths(client, userId, localDates) {
  const fullSelect = await client
    .from('posts')
    .select('image_path,grid_images,client_meta')
    .eq('user_id', userId)
    .in('local_date', localDates)

  if (!needsLegacyPostFallback(fullSelect.error)) {
    if (fullSelect.error) throw fullSelect.error
    return collectImagePathsFromPosts(fullSelect.data ?? [])
  }

  const fallbackSelect = await client
    .from('posts')
    .select('image_path,client_meta')
    .eq('user_id', userId)
    .in('local_date', localDates)

  if (fallbackSelect.error) throw fallbackSelect.error
  return collectImagePathsFromPosts(fallbackSelect.data ?? [])
}

const seedPosts = [
  {
    offset: 0,
    missionHex: '#FF8A7A',
    customColorName: '피치 멜로우',
    journalAnswer: '따뜻한 햇살 아래에서 마음이 느긋해진 오후. 8컷으로 오늘의 산책을 묶어뒀다.',
    missionLabel: '따뜻한 코랄빛',
    missionPrompt: '오늘은 따뜻한 색을 찾아봐요.',
    storyTemplateId: 'life-cut',
    locationName: '서울 성수동',
    weatherGroup: 'clear',
    timeBucket: 'sunset',
    photoCount: 8,
  },
  {
    offset: 1,
    missionHex: '#A7C8B3',
    customColorName: '비 온 뒤 세이지',
    journalAnswer: '길가 잎사귀에 남은 빛이 조용해서 천천히 멈춰 보게 됐다.',
    missionLabel: '부드러운 세이지',
    missionPrompt: '오늘은 차분한 초록을 찾아봐요.',
    storyTemplateId: 'soft-passport',
    locationName: '서울숲 근처',
    weatherGroup: 'clouds',
    timeBucket: 'day',
    photoCount: 6,
  },
  {
    offset: 2,
    missionHex: '#A9CBE4',
    customColorName: '유리창 하늘',
    journalAnswer: '창문에 비친 파랑이 오늘 기분을 조금 가볍게 만들어줬다.',
    missionLabel: '맑은 하늘 블루',
    missionPrompt: '오늘은 맑은 파랑을 찾아봐요.',
    storyTemplateId: 'air-trip',
    locationName: '학교 산책로',
    weatherGroup: 'clear',
    timeBucket: 'day',
    photoCount: 8,
  },
  {
    offset: 3,
    missionHex: '#F4C56E',
    customColorName: '주말 크림 골드',
    journalAnswer: '작은 조명 아래에서 본 노란빛이 생각보다 포근했다.',
    missionLabel: '작은 전구빛',
    missionPrompt: '오늘은 은은한 노랑을 찾아봐요.',
    storyTemplateId: 'newsprint',
    locationName: '동네 카페',
    weatherGroup: 'clear',
    timeBucket: 'night',
    photoCount: 5,
  },
  {
    offset: 4,
    missionHex: '#D7C2E8',
    customColorName: '구름 뒤 라벤더',
    journalAnswer: '흐린 오후의 보라빛이 평소보다 조금 더 선명하게 남았다.',
    missionLabel: '몽글 라벤더',
    missionPrompt: '오늘은 부드러운 보라를 찾아봐요.',
    storyTemplateId: 'polaroid-grid',
    locationName: '집 근처 골목',
    weatherGroup: 'clouds',
    timeBucket: 'sunset',
    photoCount: 8,
  },
]

async function getAssetBlob(fileName) {
  const fullPath = path.join(root, 'public', 'design', fileName)
  return new Blob([await readFile(fullPath)], { type: 'image/webp' })
}

async function main() {
  await loadEnv()
  await loadPrivateTestAccountEnv()

  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  const inviteCode = process.env.VITE_BETA_INVITE_CODE
  const testAccount = getTestAccount()

  if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.')

  const supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const email = usernameToEmail(testAccount.username)

  let loginResult = await supabase.auth.signInWithPassword({
    email,
    password: testAccount.password,
  })

  if (loginResult.error) {
    const signup = await supabase.functions.invoke('beta-signup', {
      body: {
        username: testAccount.username,
        password: testAccount.password,
        nickname: testAccount.nickname,
        gender: testAccount.gender,
        birthYear: testAccount.birthYear,
        locale: testAccount.locale,
        inviteCode,
      },
    })

    if (signup.error) throw signup.error
    if (signup.data?.error) throw new Error(String(signup.data.error))

    loginResult = await supabase.auth.signInWithPassword({
      email,
      password: testAccount.password,
    })
  }

  const { data: login, error: loginError } = loginResult
  if (loginError) throw loginError
  const userId = login.session?.user.id
  if (!userId) throw new Error('Test account login did not return a user id.')

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    locale: testAccount.locale,
    username: testAccount.username,
    nickname: testAccount.nickname,
    gender: testAccount.gender,
    birth_year: testAccount.birthYear,
    auth_method: 'password',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' })
  if (profileError) throw profileError

  const seedDates = seedPosts.map((seed) => toDateKey(seed.offset))
  const existingPostImagePaths = await fetchExistingSeedPostImagePaths(supabase, userId, seedDates)

  const list = await supabase.storage.from('post-images').list(userId, { limit: 200 })
  if (list.error) throw list.error
  const oldSeedFiles = (list.data ?? [])
    .map((item) => `${userId}/${item.name}`)
    .filter((name) => name.includes('-seed-'))
  const filesToRemove = Array.from(new Set([...oldSeedFiles, ...existingPostImagePaths]))
  if (filesToRemove.length) {
    const removed = await supabase.storage.from('post-images').remove(filesToRemove)
    if (removed.error) throw removed.error
  }

  const seededDates = []
  let fallbackPostCount = 0

  for (const seed of seedPosts) {
    const localDate = toDateKey(seed.offset)
    const gridImages = []

    for (let index = 0; index < seed.photoCount; index += 1) {
      const asset = assetPool[(index + seed.offset) % assetPool.length]
      const imagePath = `${userId}/${localDate}-seed-${index + 1}-${asset}`
      const blob = await getAssetBlob(asset)

      const upload = await supabase.storage.from('post-images').upload(imagePath, blob, {
        contentType: 'image/webp',
        upsert: true,
      })
      if (upload.error) throw upload.error

      const slotOrder = [0, 8, 2, 6, 1, 3, 7, 5]
      gridImages.push({
        id: `seed-${localDate}-${index + 1}`,
        slot: slotOrder[index],
        path: imagePath,
        width: 1080,
        height: 1080,
        bytes: blob.size,
        source: 'seed',
        createdAt: new Date(Date.now() - index * 1000).toISOString(),
      })
    }

    const { error: postError, usedFallback } = await upsertPostWithFallback(supabase, {
      user_id: userId,
      local_date: localDate,
      mission_hex: seed.missionHex,
      captured_hex: seed.missionHex,
      match_rate: 0,
      image_path: gridImages[0]?.path,
      grid_images: gridImages,
      custom_color_name: seed.customColorName,
      journal_answer: seed.journalAnswer,
      locale: testAccount.locale,
      weather_code: 0,
      weather_group: seed.weatherGroup,
      time_bucket: seed.timeBucket,
      mission_label: seed.missionLabel,
      mission_prompt: seed.missionPrompt,
      abuse_warning: false,
      story_template_id: seed.storyTemplateId,
      story_stickers: [
        { uid: `seed-${localDate}-stamp`, stickerId: 'passport-stamp', x: 82, y: 82, scale: 0.52, rotation: -10 },
      ],
      location_name: seed.locationName,
      location_latitude: 37.5446,
      location_longitude: 127.0557,
      location_accuracy_m: 120,
      client_meta: {
        app: 'colorwalk',
        seed: true,
        seedVersion: 2,
        feature: '3x3-grid',
        source: 'scripts/seed-beta-test-account.mjs',
      },
    })
    if (postError) throw postError
    if (usedFallback) fallbackPostCount += 1
    seededDates.push(localDate)
  }

  await supabase.auth.signOut()

  console.log(JSON.stringify({
    ok: true,
    username: testAccount.username,
    userId,
    seededDates,
    gridImageStorage: fallbackPostCount ? 'client_meta_fallback' : 'grid_images',
    fallbackPostCount,
    credentialsFile: 'docs/beta-test-account.private.md',
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
