import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type SignupBody = {
  username?: unknown
  password?: unknown
  nickname?: unknown
  gender?: unknown
  birthYear?: unknown
  locale?: unknown
}

type ProfileGender = 'female' | 'male' | 'nonbinary' | 'prefer_not_to_say'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function normalizeUsername(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, '')
}

function normalizeNickname(value: unknown) {
  return String(value ?? '').trim().slice(0, 20)
}

function usernameToEmail(username: string) {
  const domain = Deno.env.get('COLORWALK_AUTH_EMAIL_DOMAIN') || 'gmail.com'
  const emailSafeUsername = username.replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '')
  return `colorwalk.beta.${emailSafeUsername}@${domain}`
}

function parseGender(value: unknown): ProfileGender {
  return value === 'female' || value === 'male' || value === 'nonbinary' || value === 'prefer_not_to_say'
    ? value
    : 'prefer_not_to_say'
}

function parseLocale(value: unknown) {
  return value === 'en' ? 'en' : 'ko'
}

function parseBirthYear(value: unknown) {
  const birthYear = Number(value)
  const currentYear = new Date().getFullYear()
  if (!Number.isInteger(birthYear) || birthYear < 1930 || birthYear > currentYear) {
    throw new Error('태어난 연도를 다시 확인해 주세요.')
  }
  return birthYear
}

function validateBody(body: SignupBody) {
  const username = normalizeUsername(body.username)
  const password = String(body.password ?? '')
  const nickname = normalizeNickname(body.nickname)
  const gender = parseGender(body.gender)
  const birthYear = parseBirthYear(body.birthYear)
  const locale = parseLocale(body.locale)

  if (!/^[a-z0-9][a-z0-9_.]{2,19}$/.test(username)) {
    throw new Error('아이디는 영문/숫자로 시작하고 3-20자로 입력해 주세요.')
  }
  if (password.length < 6 || password.length > 72) {
    throw new Error('비밀번호는 6-72자로 입력해 주세요.')
  }
  if (!nickname) {
    throw new Error('닉네임을 입력해 주세요.')
  }

  return {
    username,
    password,
    nickname,
    gender,
    birthYear,
    locale,
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Signup service is not configured.' }, 500)
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    const body = (await req.json()) as SignupBody
    const profile = validateBody(body)
    const email = usernameToEmail(profile.username)

    const { data: existingProfile, error: existingProfileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .ilike('username', profile.username)
      .maybeSingle()

    if (existingProfileError) throw existingProfileError
    if (existingProfile) {
      return json({ error: '이미 사용 중인 아이디예요.' }, 409)
    }

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: profile.password,
      email_confirm: true,
      user_metadata: {
        username: profile.username,
        nickname: profile.nickname,
        gender: profile.gender,
        birth_year: profile.birthYear,
      },
    })

    if (createError) {
      const message = createError.message?.toLowerCase().includes('already')
        ? '이미 사용 중인 아이디예요.'
        : createError.message
      return json({ error: message }, 400)
    }

    const userId = created.user?.id
    if (!userId) throw new Error('User was not created.')

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      locale: profile.locale,
      username: profile.username,
      nickname: profile.nickname,
      gender: profile.gender,
      birth_year: profile.birthYear,
      auth_method: 'password',
    })

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
      if (profileError.code === '23505') {
        return json({ error: '이미 사용 중인 아이디예요.' }, 409)
      }
      throw profileError
    }

    return json({ ok: true, email })
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : '가입에 실패했어요.'
    return json({ error: message }, 400)
  }
})
