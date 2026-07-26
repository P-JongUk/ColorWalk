import { getPostGridImages } from '@/lib/grid'
import type { CaptureDraft, Post } from '@/types'

type ReadPreview = (url: string) => Promise<boolean>

function sameSet(left: Iterable<string>, right: Iterable<string>) {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === rightSet.size && [...leftSet].every((value) => rightSet.has(value))
}

export async function verifySyncedPreviewRecord(draft: CaptureDraft, posts: Post[], readPreview: ReadPreview) {
  if (draft.localRevision !== draft.serverRevision) throw new Error('기록 동기화 상태가 바뀌었어요. 다시 확인해 주세요.')

  const post = posts.find((candidate) => candidate.local_date === draft.localDate)
  const remoteImages = getPostGridImages(post)
  const localImages = draft.gridImages.map((image) => ({ id: image.assetId ?? image.id, path: image.uploadPath }))
  if (!post || localImages.some((image) => !image.path) || remoteImages.length !== localImages.length) {
    throw new Error('동기화된 미리보기를 다시 확인하지 못했어요.')
  }
  if (!sameSet(localImages.map((image) => image.id), remoteImages.map((image) => image.id))
    || !sameSet(localImages.map((image) => image.path!), remoteImages.map((image) => image.path))) {
    throw new Error('동기화된 사진 구성이 달라졌어요.')
  }

  const remoteByPath = new Map(remoteImages.map((image) => [image.path, image]))
  await Promise.all(localImages.map(async ({ path }) => {
    const signedUrl = remoteByPath.get(path!)?.signedUrl
    if (!signedUrl || !(await readPreview(signedUrl))) throw new Error('동기화된 미리보기를 읽을 수 없어요.')
  }))
}

export async function runMasterCleanupAfterPreviewVerification({
  draft,
  posts,
  readPreview,
  cleanup,
}: {
  draft: CaptureDraft
  posts: Post[]
  readPreview: ReadPreview
  cleanup: () => Promise<CaptureDraft>
}) {
  await verifySyncedPreviewRecord(draft, posts, readPreview)
  return cleanup()
}
