import { getPostGridImages } from '@/lib/grid'
import { buildColorHuntMeta, createFreeModeSelection, finalizeMissionPackSelection, mergeColorHuntIntoClientMeta } from '@/lib/missionPacks'
import type { CaptureDraft, GridImage, Locale, Post } from '@/types'

export function draftToDailyPost(draft: CaptureDraft, userId: string, locale: Locale): Post {
  const gridImages: GridImage[] = draft.gridImages.map((image) => ({
    id: image.id,
    slot: image.slot,
    path: image.uploadPath ?? image.previewUrl ?? '',
    signedUrl: image.uploadPath ? undefined : image.previewUrl,
    previewUrl: image.previewUrl,
    width: image.width,
    height: image.height,
    bytes: image.bytes,
    source: image.source,
    createdAt: image.createdAt,
  }))
  const colorHunt = buildColorHuntMeta({
    photoCount: gridImages.length,
    lockedAt: draft.lockedAt,
    closedAt: draft.closedAt,
    missionPack: draft.missionPack ?? createFreeModeSelection(),
  })
  return {
    id: `local:${userId}:${draft.localDate}`,
    user_id: userId,
    created_at: draft.lockedAt ?? gridImages[0]?.createdAt ?? new Date().toISOString(),
    local_date: draft.localDate,
    mission_hex: draft.mission.hex,
    captured_hex: draft.mission.hex,
    match_rate: 0,
    image_path: gridImages[0]?.path ?? '',
    custom_color_name: draft.journal?.colorName || null,
    journal_answer: draft.journal?.journalAnswer || null,
    locale,
    weather_code: draft.mission.weatherCode ?? null,
    weather_group: draft.mission.weatherGroup,
    time_bucket: draft.mission.timeBucket,
    mission_label: draft.mission.label[locale],
    mission_prompt: draft.mission.prompt[locale],
    abuse_warning: draft.abuseWarning,
    story_template_id: draft.journal?.storyDesign.templateId,
    story_stickers: draft.journal?.storyDesign.stickers,
    grid_images: gridImages,
    client_meta: mergeColorHuntIntoClientMeta(
      { localSyncState: draft.lastSyncError ?? (draft.localRevision === draft.serverRevision ? 'synced' : 'pending') },
      colorHunt,
    ),
  }
}

function isOpenRecord(draft: CaptureDraft) {
  return (draft.recordLifecycle ?? (draft.closedAt ? 'closed' : 'active')) !== 'closed'
}

/**
 * Finds every cached daily record whose localDate is before today and that has not been
 * closed yet. Used by lazy finalization at boot, foreground, and before the next capture -
 * never by a timer or server job.
 */
export function findOpenPastRecords(drafts: CaptureDraft[], todayLocalDate: string) {
  return drafts.filter((candidate) => candidate.localDate < todayLocalDate && isOpenRecord(candidate))
}

/**
 * Closes one open record: stamps closedAt, marks recordLifecycle closed, and finalizes the
 * explicit/free mission pack selection. Idempotent - returns the same draft unchanged if it
 * is already closed, so callers can safely re-run this on every boot/foreground check.
 */
export function finalizeOpenRecord(draft: CaptureDraft, finalizedAt = new Date().toISOString()): CaptureDraft {
  if (!isOpenRecord(draft)) return draft
  return {
    ...draft,
    closedAt: draft.closedAt ?? finalizedAt,
    recordLifecycle: 'closed',
    missionPack: finalizeMissionPackSelection(draft.missionPack, finalizedAt),
    localRevision: (draft.localRevision ?? 0) + 1,
    lastSyncError: undefined,
  }
}

export function mergeDailyRecords(posts: Post[], drafts: CaptureDraft[], userId: string, locale: Locale) {
  const byDate = new Map(posts.map((post) => [post.local_date, post]))
  drafts.filter((draft) => draft.gridImages.length > 0).forEach((draft) => {
    const local = draftToDailyPost(draft, userId, locale)
    const serverPreviews = new Map(getPostGridImages(byDate.get(draft.localDate)).map((image) => [image.path, image.signedUrl]))
    const gridImages = (local.grid_images ?? []).map((image) => ({
      ...image,
      signedUrl: image.signedUrl ?? serverPreviews.get(image.path),
    }))
    byDate.set(draft.localDate, {
      ...local,
      grid_images: gridImages,
      signedImageUrl: gridImages[0]?.signedUrl,
    })
  })
  return [...byDate.values()].sort((a, b) => b.local_date.localeCompare(a.local_date))
}

export function isCompletedDailyRecord(post: Post) {
  return getPostGridImages(post).length >= 8
}
