import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator)
    const value = trimmed.slice(separator + 1).replace(/^["']|["']$/g, '')
    process.env[key] ||= value
  }
}

function loadPrivateTestAccount(filePath) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(username|password|nickname|birth_year|gender):\s*(.+?)\s*$/)
    if (!match) continue
    const [, key, value] = match
    process.env[`COLORWALK_TEST_${key.toUpperCase()}`] ||= value
  }
}

loadEnvFile(path.resolve('.env.local'))
loadEnvFile(path.resolve('.env'))
loadPrivateTestAccount(path.resolve('docs/beta-test-account.private.md'))

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const inviteCode = process.env.VITE_BETA_INVITE_CODE

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.')
}

const testUsername = process.env.COLORWALK_TEST_USERNAME
const testPassword = process.env.COLORWALK_TEST_PASSWORD

if (!testUsername || !testPassword) {
  throw new Error('Missing COLORWALK_TEST_USERNAME or COLORWALK_TEST_PASSWORD. See docs/beta-test-account.private.md.')
}

function usernameToEmail(username) {
  const domain = process.env.VITE_AUTH_EMAIL_DOMAIN || 'gmail.com'
  const emailSafeUsername = username.replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '')
  return `colorwalk.beta.${emailSafeUsername}@${domain}`
}

async function ensurePasswordUser(client, profile) {
  const email = usernameToEmail(profile.username)
  let login = await client.auth.signInWithPassword({ email, password: profile.password })

  if (login.error) {
    const signup = await client.functions.invoke('beta-signup', {
      body: {
        username: profile.username,
        password: profile.password,
        nickname: profile.nickname,
        gender: profile.gender,
        birthYear: profile.birthYear,
        locale: profile.locale,
        inviteCode,
      },
    })
    if (signup.error) throw signup.error
    if (signup.data?.error) throw new Error(String(signup.data.error))

    login = await client.auth.signInWithPassword({ email, password: profile.password })
  }

  if (login.error) throw login.error
  if (!login.data.session?.user.id) throw new Error(`No user id returned for ${profile.username}.`)
  return login.data.session.user.id
}

const mainClient = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const otherClient = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const anonClient = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const onePixelWebP = Uint8Array.from([
  82, 73, 70, 70, 26, 0, 0, 0, 87, 69, 66, 80, 86, 80, 56, 32, 14, 0, 0, 0,
  16, 0, 0, 0, 157, 1, 42, 1, 0, 1, 0, 2, 0, 52, 37, 164, 0, 3, 112, 0, 254,
  251, 253, 80, 0,
])

const verifyDate = '2000-01-02'
let userId = null
let otherUserId = null
let imagePath = null

try {
  const anonymous = await anonClient.auth.signInAnonymously()
  if (anonymous.error) {
    throw new Error(
      `Anonymous sign-in failed: ${anonymous.error.message}. Enable Supabase Auth > Providers > Anonymous sign-ins.`,
    )
  }

  const anonymousProfileWrite = await anonClient.from('profiles').upsert({
    id: anonymous.data.user.id,
    locale: 'en',
    username: `anonymous_${Date.now()}`,
    auth_method: 'anonymous',
  })
  if (!anonymousProfileWrite.error) {
    throw new Error('Anonymous users can still write profiles. RLS should block this.')
  }

  userId = await ensurePasswordUser(mainClient, {
    username: testUsername,
    password: testPassword,
    nickname: process.env.COLORWALK_TEST_NICKNAME || 'Test Walker',
    gender: process.env.COLORWALK_TEST_GENDER || 'prefer_not_to_say',
    birthYear: Number(process.env.COLORWALK_TEST_BIRTH_YEAR || 2008),
    locale: 'en',
  })

  otherUserId = await ensurePasswordUser(otherClient, {
    username: `${testUsername}_other`.slice(0, 20),
    password: testPassword,
    nickname: 'Verify Other',
    gender: 'prefer_not_to_say',
    birthYear: 2008,
    locale: 'en',
  })

  const profile = await mainClient
    .from('profiles')
    .upsert(
      {
        id: userId,
        locale: 'en',
        username: testUsername,
        nickname: process.env.COLORWALK_TEST_NICKNAME || 'Test Walker',
        gender: 'prefer_not_to_say',
        birth_year: 2008,
        auth_method: 'password',
      },
      { onConflict: 'id' },
    )
  if (profile.error) throw profile.error

  const profileRead = await mainClient
    .from('profiles')
    .select('username,nickname,gender,birth_year,auth_method')
    .eq('id', userId)
    .single()
  if (profileRead.error) throw profileRead.error
  if (profileRead.data.username !== testUsername || profileRead.data.auth_method !== 'password') {
    throw new Error('Profile beta metadata was not persisted for a password user.')
  }

  const colorNames = await mainClient
    .from('color_name_suggestions')
    .select('name,hex,locale')
    .eq('locale', 'en')
    .limit(250)
  if (colorNames.error) throw colorNames.error
  if ((colorNames.data?.length ?? 0) < 200) {
    throw new Error('Color name suggestions are not sufficiently seeded.')
  }

  imagePath = `${userId}/verify-${Date.now()}.webp`
  const upload = await mainClient.storage
    .from('post-images')
    .upload(imagePath, new Blob([onePixelWebP], { type: 'image/webp' }), {
      contentType: 'image/webp',
      upsert: false,
    })
  if (upload.error) throw upload.error

  const upsert = await mainClient.from('posts').upsert(
    {
      user_id: userId,
      local_date: verifyDate,
      mission_hex: '#8BC6E8',
      captured_hex: '#8BC6E8',
      match_rate: 0,
      image_path: imagePath,
      grid_images: [
        {
          id: 'verify-grid-image',
          slot: 0,
          path: imagePath,
          width: 1,
          height: 1,
          bytes: onePixelWebP.length,
          source: 'camera',
          createdAt: new Date().toISOString(),
        },
      ],
      locale: 'en',
      weather_group: 'clear',
      time_bucket: 'day',
      mission_label: 'Verification',
      mission_prompt: 'Verification prompt',
      location_name: 'Verify Place',
      location_latitude: 37.5665,
      location_longitude: 126.978,
      location_accuracy_m: 50,
      story_template_id: 'soft-passport',
      story_stickers: [
        {
          uid: 'verify-sticker',
          stickerId: 'passport-stamp',
          x: 30,
          y: 30,
          scale: 1,
          rotation: 0,
        },
      ],
      client_meta: {
        verify: true,
      },
    },
    { onConflict: 'user_id,local_date' },
  )
  if (upsert.error) throw upsert.error

  const select = await mainClient
    .from('posts')
    .select('id,image_path,grid_images,story_template_id,story_stickers,client_meta,location_name,location_latitude,location_longitude,location_accuracy_m')
    .eq('user_id', userId)
    .eq('local_date', verifyDate)
  if (select.error) throw select.error
  if (!select.data?.length) throw new Error('Post select returned no rows.')
  if (select.data[0].story_template_id !== 'soft-passport') {
    throw new Error('Story template metadata was not persisted.')
  }
  if (!Array.isArray(select.data[0].grid_images) || select.data[0].grid_images[0]?.path !== imagePath) {
    throw new Error('3x3 grid image metadata was not persisted.')
  }
  if (select.data[0].location_name !== 'Verify Place' || select.data[0].location_latitude !== 37.5665) {
    throw new Error('Location metadata was not persisted.')
  }

  const signed = await mainClient.storage.from('post-images').createSignedUrl(imagePath, 60)
  if (signed.error || !signed.data?.signedUrl) throw signed.error ?? new Error('Signed URL was not created.')

  const otherSelect = await otherClient
    .from('posts')
    .select('id')
    .eq('user_id', userId)
  if (otherSelect.error) throw otherSelect.error
  if (otherSelect.data?.length) throw new Error('RLS failed: another user could read this post.')

  const otherSigned = await otherClient.storage.from('post-images').createSignedUrl(imagePath, 60)
  if (!otherSigned.error && otherSigned.data?.signedUrl) {
    throw new Error('Storage RLS failed: another user could create a signed URL for this image.')
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        anonymousSignIn: true,
        anonymousDataWriteBlocked: true,
        passwordProfileUpsert: true,
        profileBetaMetadata: true,
        colorNameSuggestions: true,
        storageUpload: true,
        storageSignedUrl: true,
        postUpsertAndSelect: true,
        storyMetadata: true,
        gridImageMetadata: true,
        locationMetadata: true,
        postRlsBlocksOtherUser: true,
        storageRlsBlocksOtherUser: true,
        otherUserId,
      },
      null,
      2,
    ),
  )
} finally {
  if (userId) await mainClient.from('posts').delete().eq('user_id', userId).eq('local_date', verifyDate)
  if (imagePath) await mainClient.storage.from('post-images').remove([imagePath])
  await mainClient.auth.signOut()
  await otherClient.auth.signOut()
  await anonClient.auth.signOut()
}
