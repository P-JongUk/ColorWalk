import { getPostGridImages } from '@/lib/grid'
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
  const complete = gridImages.length >= 8
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
    client_meta: {
      colorHunt: {
        version: 1,
        status: complete ? 'completed' : 'recorded',
        photoCount: gridImages.length,
        lockedAt: draft.lockedAt,
        closedAt: draft.closedAt,
      },
      localSyncState: draft.lastSyncError ?? (draft.localRevision === draft.serverRevision ? 'synced' : 'pending'),
    },
  }
}

export function mergeDailyRecords(posts: Post[], drafts: CaptureDraft[], userId: string, locale: Locale) {
  const byDate = new Map(posts.map((post) => [post.local_date, post]))
  drafts.filter((draft) => draft.gridImages.length > 0).forEach((draft) => {
    byDate.set(draft.localDate, draftToDailyPost(draft, userId, locale))
  })
  return [...byDate.values()].sort((a, b) => b.local_date.localeCompare(a.local_date))
}

export function isCompletedDailyRecord(post: Post) {
  return getPostGridImages(post).length >= 8
}
