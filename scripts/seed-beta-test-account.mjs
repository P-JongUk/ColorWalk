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
    nickname: process.env.COLORWALK_TEST_NICKNAME || '테스트워커',
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

const seedPosts = [
  {
    offset: 0,
    asset: 'mongle-bloom.webp',
    missionHex: '#FF8A7A',
    capturedHex: '#F6B59B',
    matchRate: 84,
    customColorName: '피치 멜로우',
    journalAnswer: '따뜻한 햇살 아래에서 괜히 마음이 느긋해졌던 오후. 좋은 음악과 함께 걷기 딱 좋았어.',
    missionLabel: '따뜻한 코랄빛',
    missionPrompt: '오늘은 따뜻한 색을 찾아봐요. 노을, 간판, 과일, 의자 같은 것들!',
    storyTemplateId: 'passport',
    storyStickers: [
      { uid: 'seed-passport-stamp', stickerId: 'passport-stamp', x: 79, y: 75, scale: 0.58, rotation: -10 },
      { uid: 'seed-soft-cloud', stickerId: 'soft-cloud', x: 10, y: 14, scale: 0.78, rotation: -6 },
    ],
    locationName: '서울 성수동',
    weatherGroup: 'clear',
    timeBucket: 'sunset',
  },
  {
    offset: 1,
    asset: 'earth-soft-border.webp',
    missionHex: '#A7C8B3',
    capturedHex: '#B8D6C8',
    matchRate: 91,
    customColorName: '비 온 뒤 세이지',
    journalAnswer: '길가 잎사귀에 남은 빛이 조용해서 잠깐 멈춰 보고 싶었다.',
    missionLabel: '부드러운 세이지',
    missionPrompt: '오늘은 차분한 초록을 찾아봐요. 잎, 컵, 가방, 표지판처럼 작은 초록들!',
    storyTemplateId: 'mongle',
    storyStickers: [
      { uid: 'seed-leaf-lines', stickerId: 'wavy-lines', x: 15, y: 70, scale: 0.72, rotation: 8 },
    ],
    locationName: '서울숲 근처',
    weatherGroup: 'clouds',
    timeBucket: 'day',
  },
  {
    offset: 2,
    asset: 'mongle-edge.webp',
    missionHex: '#A9CBE4',
    capturedHex: '#9EC4DA',
    matchRate: 88,
    customColorName: '유리창 하늘',
    journalAnswer: '창문에 비친 하늘색이 오늘 기분을 조금 가볍게 만들었다.',
    missionLabel: '맑은 하늘 블루',
    missionPrompt: '오늘은 맑은 파랑을 찾아봐요. 하늘, 유리, 옷, 포장지 속 파랑!',
    storyTemplateId: 'travel',
    storyStickers: [
      { uid: 'seed-plane', stickerId: 'airplane', x: 68, y: 18, scale: 0.78, rotation: 12 },
      { uid: 'seed-route', stickerId: 'dotted-route', x: 59, y: 25, scale: 0.7, rotation: -8 },
    ],
    locationName: '한강 산책로',
    weatherGroup: 'clear',
    timeBucket: 'day',
  },
  {
    offset: 3,
    asset: 'earth-fiber-line.webp',
    missionHex: '#F4C56E',
    capturedHex: '#F1CF88',
    matchRate: 79,
    customColorName: '주말 크림 골드',
    journalAnswer: '작은 조명 아래에서 본 노란빛이 생각보다 포근했다.',
    missionLabel: '작은 노란빛',
    missionPrompt: '오늘은 환한 노랑을 찾아봐요. 조명, 과일, 문구류, 간판 속 노랑!',
    storyTemplateId: 'newspaper',
    storyStickers: [
      { uid: 'seed-stars', stickerId: 'sparkle-stars', x: 72, y: 18, scale: 0.7, rotation: -4 },
    ],
    locationName: '동네 카페',
    weatherGroup: 'clear',
    timeBucket: 'night',
  },
  {
    offset: 4,
    asset: 'mongle-tape.webp',
    missionHex: '#D7C2E8',
    capturedHex: '#CDBDE6',
    matchRate: 86,
    customColorName: '구름 뒤 라벤더',
    journalAnswer: '느린 오후의 보라빛이 평소보다 조금 특별하게 느껴졌다.',
    missionLabel: '몽글 라벤더',
    missionPrompt: '오늘은 부드러운 보라를 찾아봐요. 꽃, 노트, 포스터, 그림자 속 보라!',
    storyTemplateId: 'polaroid',
    storyStickers: [
      { uid: 'seed-heart', stickerId: 'heart-outline', x: 12, y: 65, scale: 0.7, rotation: -12 },
    ],
    locationName: '집 근처 골목',
    weatherGroup: 'clouds',
    timeBucket: 'sunset',
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

  const list = await supabase.storage.from('post-images').list(userId, { limit: 100 })
  if (list.error) throw list.error
  const oldSeedFiles = (list.data ?? [])
    .map((item) => `${userId}/${item.name}`)
    .filter((name) => name.includes('-seed-'))
  if (oldSeedFiles.length) {
    const removed = await supabase.storage.from('post-images').remove(oldSeedFiles)
    if (removed.error) throw removed.error
  }

  const seededDates = []

  for (const seed of seedPosts) {
    const localDate = toDateKey(seed.offset)
    const imagePath = `${userId}/${localDate}-seed-${seed.asset}`
    const blob = await getAssetBlob(seed.asset)

    const upload = await supabase.storage.from('post-images').upload(imagePath, blob, {
      contentType: 'image/webp',
      upsert: true,
    })
    if (upload.error) throw upload.error

    const { error: postError } = await supabase.from('posts').upsert({
      user_id: userId,
      local_date: localDate,
      mission_hex: seed.missionHex,
      captured_hex: seed.capturedHex,
      match_rate: seed.matchRate,
      image_path: imagePath,
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
      story_stickers: seed.storyStickers,
      location_name: seed.locationName,
      location_latitude: 37.5446,
      location_longitude: 127.0557,
      location_accuracy_m: 120,
      client_meta: {
        app: 'colorwalk',
        seed: true,
        seedVersion: 1,
        source: 'scripts/seed-beta-test-account.mjs',
      },
    }, { onConflict: 'user_id,local_date' })
    if (postError) throw postError
    seededDates.push(localDate)
  }

  await supabase.auth.signOut()

  console.log(JSON.stringify({
    ok: true,
    username: testAccount.username,
    password: testAccount.password,
    email,
    userId,
    seededDates,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
