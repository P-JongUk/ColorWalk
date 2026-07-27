import { canonicalizeMissionHex, getDeckStage, type DeckStage } from '@/lib/livingHueDeck'
import { getPostGridImages } from '@/lib/grid'
import { getLocalDateKey } from '@/lib/date'
import type { GridImage, Post } from '@/types'

/**
 * M5 Hueprint/Color Capsule domain. Pure client-side derivation over the same merged
 * `displayPosts` (mergeDailyRecords output) the rest of the app already uses. No new
 * table, migration, server render, or upload is introduced here.
 *
 * Canonical mission_hex-only contract: a record only becomes Hueprint-valid when its
 * mission_hex is a real 6-digit hex. Invalid mission_hex is never backfilled from
 * captured_hex, image pixels, weather, or a color name - the record stays visible in
 * History/Deck/Story but is excluded from every Hueprint/Capsule derivation below.
 */

export type HueprintCover = {
  postLocalDate: string
  imageId: string
  imageUrl: string | undefined
}

export type HueprintDay = {
  post: Post
  localDate: string
  missionHex: string
  images: GridImage[]
  photoCount: number
  stage: DeckStage
  completed: boolean
}

export type WeeklyHueprint = {
  weekKey: string
  startDate: string
  endDate: string
  days: HueprintDay[]
  palette: string[]
  recordedDayCount: number
  completedGridCount: number
  photoCount: number
  accentHex: string | null
  coverCandidates: HueprintCover[]
  defaultCover: HueprintCover | null
}

export type ColorCapsule = {
  monthKey: string
  days: HueprintDay[]
  palette: string[]
  recordedDayCount: number
  completedGridCount: number
  representativePhotos: HueprintCover[]
  isCurrentMonth: boolean
}

export type ColorMemoryCard = {
  day: HueprintDay
  cover: HueprintCover
  kind: 'same-day' | 'month-window'
  yearsAgo?: number
}

function toLocalNoon(localDate: string) {
  return new Date(`${localDate}T12:00:00`)
}

function firstRestorableImage(images: GridImage[]) {
  for (const image of images) {
    const url = image.signedUrl ?? image.previewUrl
    if (url) return { image, url }
  }
  return null
}

/**
 * A Hueprint-valid record: at least one restorable photo, a non-future local date, and a
 * canonical mission_hex. Returns null for every other record - callers must simply skip it,
 * never substitute a fallback color.
 */
function toHueprintDay(post: Post, todayLocalDate: string): HueprintDay | null {
  if (post.local_date > todayLocalDate) return null
  const canonicalHex = canonicalizeMissionHex(post.mission_hex)
  if (!canonicalHex) return null
  const images = getPostGridImages(post)
  if (!images.length) return null

  const photoCount = images.length
  return {
    post,
    localDate: post.local_date,
    missionHex: canonicalHex,
    images,
    photoCount,
    stage: getDeckStage(photoCount),
    completed: photoCount >= 8,
  }
}

function getHueprintValidDays(posts: Post[], todayLocalDate = getLocalDateKey()): HueprintDay[] {
  return posts
    .map((post) => toHueprintDay(post, todayLocalDate))
    .filter((day): day is HueprintDay => day !== null)
    .sort((a, b) => a.localDate.localeCompare(b.localDate))
}

/** Device-local Monday of the week containing `date`, as a YYYY-MM-DD key. */
export function getWeekKey(date: Date) {
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + mondayOffset)
  return getLocalDateKey(monday)
}

function shiftWeekKey(weekKey: string, deltaWeeks: number) {
  const monday = toLocalNoon(weekKey)
  monday.setDate(monday.getDate() + deltaWeeks * 7)
  return getLocalDateKey(monday)
}

function buildCoverCandidate(day: HueprintDay): HueprintCover | null {
  const restorable = firstRestorableImage(day.images)
  if (!restorable) return null
  return { postLocalDate: day.localDate, imageId: restorable.image.id, imageUrl: restorable.url }
}

/**
 * Builds the Hueprint for one Monday-start week. `weekKey` must be a Monday YYYY-MM-DD
 * (use getWeekKey). Days outside [weekKey, weekKey+6] are ignored. The current week
 * naturally grows as today's open record gains photos, because callers simply pass the
 * latest `displayPosts` snapshot in - there is no separate "closed" gate for the week view.
 */
export function getWeeklyHueprint(posts: Post[], weekKey: string, todayLocalDate = getLocalDateKey()): WeeklyHueprint {
  const startDate = weekKey
  const endDate = getLocalDateKey(new Date(toLocalNoon(weekKey).setDate(toLocalNoon(weekKey).getDate() + 6)))
  const allDays = getHueprintValidDays(posts, todayLocalDate)
  const days = allDays.filter((day) => day.localDate >= startDate && day.localDate <= endDate)

  const palette = days.map((day) => day.missionHex)
  const completedGridCount = days.filter((day) => day.completed).length
  const photoCount = days.reduce((sum, day) => sum + day.photoCount, 0)
  const mostRecent = days[days.length - 1] ?? null
  const accentHex = mostRecent?.missionHex ?? null

  const coverCandidates = [...days]
    .reverse()
    .map(buildCoverCandidate)
    .filter((cover): cover is HueprintCover => cover !== null)

  return {
    weekKey,
    startDate,
    endDate,
    days,
    palette,
    recordedDayCount: days.length,
    completedGridCount,
    photoCount,
    accentHex,
    coverCandidates,
    defaultCover: coverCandidates[0] ?? null,
  }
}

export type WeekNavigation = {
  canGoPrevious: boolean
  canGoNext: boolean
  previousWeekKey: string | null
  nextWeekKey: string | null
}

/**
 * Previous/next week navigation. Never opens a future week, and disables "previous"
 * before the oldest Hueprint-valid record's week.
 */
export function getWeekNavigation(posts: Post[], weekKey: string, todayLocalDate = getLocalDateKey()): WeekNavigation {
  const currentWeekKey = getWeekKey(toLocalNoon(todayLocalDate))
  const validDays = getHueprintValidDays(posts, todayLocalDate)
  const oldestWeekKey = validDays.length ? getWeekKey(toLocalNoon(validDays[0].localDate)) : currentWeekKey

  const nextWeekKey = shiftWeekKey(weekKey, 1)
  const previousWeekKey = shiftWeekKey(weekKey, -1)

  return {
    canGoNext: nextWeekKey <= currentWeekKey,
    canGoPrevious: previousWeekKey >= oldestWeekKey,
    nextWeekKey: nextWeekKey <= currentWeekKey ? nextWeekKey : null,
    previousWeekKey: previousWeekKey >= oldestWeekKey ? previousWeekKey : null,
  }
}

/**
 * True when a week has zero Hueprint-valid days AND at least one raw post whose local_date
 * falls in that week - i.e. an invalid-mission_hex-only week, distinct from a plain
 * no-record week. Callers use this to show the "이 주의 기록은 기록함에서 그대로 볼 수 있어요"
 * History/Deck CTA instead of the generic empty state.
 */
export function isInvalidOnlyWeek(posts: Post[], weekKey: string, todayLocalDate = getLocalDateKey()): boolean {
  const startDate = weekKey
  const endDate = getLocalDateKey(new Date(toLocalNoon(weekKey).setDate(toLocalNoon(weekKey).getDate() + 6)))
  const hasValidDay = getHueprintValidDays(posts, todayLocalDate).some((day) => day.localDate >= startDate && day.localDate <= endDate)
  if (hasValidDay) return false
  return posts.some((post) => post.local_date >= startDate && post.local_date <= endDate)
}

/** Whether a Hueprint-valid day counts as a *closed* record for Color Capsule purposes. */
function isClosedForCapsule(day: HueprintDay, todayLocalDate: string) {
  if (day.completed) return true
  const colorHunt = day.post.client_meta?.colorHunt
  const closedAt = colorHunt && typeof colorHunt === 'object' ? (colorHunt as Record<string, unknown>).closedAt : undefined
  if (typeof closedAt === 'string' && closedAt) return true
  return day.localDate < todayLocalDate
}

function getMonthKey(localDate: string) {
  return localDate.slice(0, 7)
}

function shiftMonthKey(monthKey: string, deltaMonths: number) {
  const [year, month] = monthKey.split('-').map(Number)
  const shifted = new Date(year, month - 1 + deltaMonths, 1)
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Builds every Color Capsule month that has at least one closed Hueprint-valid record.
 * Sorted newest month first. Today's still-open 1-7 photo record is excluded until it
 * closes (8 photos, explicit closedAt, or the local date has passed).
 */
export function getColorCapsules(posts: Post[], todayLocalDate = getLocalDateKey()): ColorCapsule[] {
  const currentMonthKey = getMonthKey(todayLocalDate)
  const validDays = getHueprintValidDays(posts, todayLocalDate)
  const closedDays = validDays.filter((day) => isClosedForCapsule(day, todayLocalDate))

  const byMonth = new Map<string, HueprintDay[]>()
  closedDays.forEach((day) => {
    const monthKey = getMonthKey(day.localDate)
    const grouped = byMonth.get(monthKey) ?? []
    grouped.push(day)
    byMonth.set(monthKey, grouped)
  })

  return [...byMonth.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, days]) => {
      const sortedDays = [...days].sort((a, b) => a.localDate.localeCompare(b.localDate))
      const representativeSourceDays = sortedDays.filter((day) => firstRestorableImage(day.images))
      const representativeIndexes = representativeSourceDays.length <= 1
        ? [0]
        : representativeSourceDays.length === 2
          ? [0, 1]
          : [0, Math.floor((representativeSourceDays.length - 1) / 2), representativeSourceDays.length - 1]
      const representativePhotos = [...new Set(representativeIndexes)]
        .map((index) => representativeSourceDays[index])
        .filter((day): day is HueprintDay => Boolean(day))
        .map(buildCoverCandidate)
        .filter((cover): cover is HueprintCover => cover !== null)

      return {
        monthKey,
        days: sortedDays,
        palette: sortedDays.map((day) => day.missionHex),
        recordedDayCount: sortedDays.length,
        completedGridCount: sortedDays.filter((day) => day.completed).length,
        representativePhotos,
        isCurrentMonth: monthKey === currentMonthKey,
      }
    })
}

export type MonthNavigation = {
  canGoPrevious: boolean
  canGoNext: boolean
  previousMonthKey: string | null
  nextMonthKey: string | null
}

export function getMonthNavigation(capsules: ColorCapsule[], monthKey: string, todayLocalDate = getLocalDateKey()): MonthNavigation {
  const currentMonthKey = getMonthKey(todayLocalDate)
  const availableKeys = new Set(capsules.map((capsule) => capsule.monthKey))
  const nextMonthKey = shiftMonthKey(monthKey, 1)
  const previousMonthKey = shiftMonthKey(monthKey, -1)

  return {
    canGoNext: nextMonthKey <= currentMonthKey && availableKeys.has(nextMonthKey),
    canGoPrevious: availableKeys.has(previousMonthKey),
    nextMonthKey: nextMonthKey <= currentMonthKey && availableKeys.has(nextMonthKey) ? nextMonthKey : null,
    previousMonthKey: availableKeys.has(previousMonthKey) ? previousMonthKey : null,
  }
}

function daysBetween(a: Date, b: Date) {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000)
}function lastDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

/**
 * "다시 만난 색" candidate selection - see the approved plan's exact rule order:
 * 1. Same month/day in a previous year, closest year first.
 * 2. Otherwise the same day-of-month in the previous local month (clamped to that
 *    month's last day), +/-3 days, closest absolute distance; ties favor the more recent date.
 * Returns null when no candidate has both a valid mission color and a restorable cover photo.
 */
export function getColorMemoryCard(posts: Post[], todayLocalDate = getLocalDateKey()): ColorMemoryCard | null {
  const validDays = getHueprintValidDays(posts, todayLocalDate).filter((day) => day.localDate < todayLocalDate)
  if (!validDays.length) return null

  const today = toLocalNoon(todayLocalDate)
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  const sameMonthDayMatches = validDays
    .map((day) => {
      const date = toLocalNoon(day.localDate)
      if (date.getMonth() !== todayMonth || date.getDate() !== todayDate) return null
      const yearsAgo = today.getFullYear() - date.getFullYear()
      return yearsAgo > 0 ? { day, yearsAgo } : null
    })
    .filter((match): match is { day: HueprintDay; yearsAgo: number } => match !== null)
    .sort((a, b) => a.yearsAgo - b.yearsAgo)

  if (sameMonthDayMatches.length) {
    const best = sameMonthDayMatches[0]
    const cover = buildCoverCandidate(best.day)
    if (!cover) return null
    return { day: best.day, cover, kind: 'same-day', yearsAgo: best.yearsAgo }
  }

  const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const clampedDay = Math.min(todayDate, lastDayOfMonth(previousMonthDate.getFullYear(), previousMonthDate.getMonth()))
  const anchor = new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth(), clampedDay, 12)

  const windowMatches = validDays
    .map((day) => {
      const date = toLocalNoon(day.localDate)
      const distance = Math.abs(daysBetween(date, anchor))
      return distance <= 3 ? { day, distance } : null
    })
    .filter((match): match is { day: HueprintDay; distance: number } => match !== null)
    .sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance
      return b.day.localDate.localeCompare(a.day.localDate)
    })

  if (!windowMatches.length) return null
  const best = windowMatches[0]
  const cover = buildCoverCandidate(best.day)
  if (!cover) return null
  return { day: best.day, cover, kind: 'month-window' }
}

// --- Local cover preference -------------------------------------------------------------
// key: hueday:hueprint-cover:v1:<ownerId>:<weekKey>. Stores only { version, postLocalDate,
// imageId } - never a URL/path/Blob/HEX/journal. Single-device only; no Supabase/IndexedDB
// daily-record/media-asset schema is touched. Best-effort: a write failure keeps the current
// on-screen selection but does not persist it, so the next visit falls back to the
// deterministic default cover.

const COVER_PREFERENCE_PREFIX = 'hueday:hueprint-cover:v1'

type HueprintCoverPreference = {
  version: 1
  postLocalDate: string
  imageId: string
}

function coverPreferenceKey(ownerId: string, weekKey: string) {
  return `${COVER_PREFERENCE_PREFIX}:${ownerId}:${weekKey}`
}

function isValidCoverPreference(value: unknown): value is HueprintCoverPreference {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return record.version === 1 && typeof record.postLocalDate === 'string' && typeof record.imageId === 'string'
}

/**
 * Reads the saved cover preference for a week, validated against that week's actual
 * Hueprint-valid days. A stale preference (deleted photo, different week, malformed JSON)
 * is ignored and best-effort removed so it does not resurface later.
 */
export function loadHueprintCoverPreference(ownerId: string, week: WeeklyHueprint): HueprintCover | null {
  const storageKey = coverPreferenceKey(ownerId, week.weekKey)
  let raw: string | null
  try {
    raw = localStorage.getItem(storageKey)
  } catch {
    return null
  }
  if (!raw) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = null
  }

  if (!isValidCoverPreference(parsed)) {
    try { localStorage.removeItem(storageKey) } catch { /* best-effort cleanup only */ }
    return null
  }

  const day = week.days.find((candidate) => candidate.localDate === parsed.postLocalDate)
  const image = day?.images.find((candidate) => candidate.id === parsed.imageId)
  const url = image ? (image.signedUrl ?? image.previewUrl) : undefined
  if (!day || !image || !url) {
    try { localStorage.removeItem(storageKey) } catch { /* best-effort cleanup only */ }
    return null
  }

  return { postLocalDate: day.localDate, imageId: image.id, imageUrl: url }
}

/**
 * Saves a cover preference chosen from `week.coverCandidates`. Silently no-ops on write
 * failure (private mode, quota) - the current screen selection still applies until the
 * next visit, per the plan's "쓰기 실패 시 현재 화면 선택은 유지하고 다음 진입에서는
 * 결정적 기본 표지로 복구한다".
 */
export function saveHueprintCoverPreference(ownerId: string, weekKey: string, cover: HueprintCover) {
  const preference: HueprintCoverPreference = { version: 1, postLocalDate: cover.postLocalDate, imageId: cover.imageId }
  try {
    localStorage.setItem(coverPreferenceKey(ownerId, weekKey), JSON.stringify(preference))
    return true
  } catch {
    return false
  }
}

/** Resolves the cover actually shown: saved preference if still valid, else the default. */
export function resolveHueprintCover(ownerId: string, week: WeeklyHueprint): HueprintCover | null {
  return loadHueprintCoverPreference(ownerId, week) ?? week.defaultCover
}
