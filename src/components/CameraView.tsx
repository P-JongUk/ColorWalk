import { useEffect, useId, useRef, useState } from 'react'
import { Camera as CameraIcon, Check, Images, RotateCcw, X, Zap } from 'lucide-react'
import { toast } from 'sonner'

import { GridCollage } from '@/components/GridCollage'
import { Button } from '@/components/ui/button'
import { HuedayDialog } from '@/components/ui/dialog'
import {
  buildCameraVideoConstraints,
  clampZoom,
  formatZoomValue,
  getDefaultZoom,
  getZoomPresetValues,
  normalizeZoomRange,
  type CameraZoomRange,
} from '@/lib/camera'
import { capturePhotoBlob, fileToDraftImageBlob } from '@/lib/image'
import { t } from '@/lib/i18n'
import { getLocalDateKey } from '@/lib/date'
import { getNextGridSlot, MAX_GRID_IMAGES } from '@/lib/grid'
import type { CaptureDraft, GridDraftImage, Locale, Mission, MissionPackSelection } from '@/types'

type CameraViewProps = {
  locale: Locale
  mission: Mission
  initialDraft: CaptureDraft | null
  /** Current whole-day pack selection (0-photo state). Only used for a brand-new draft;
   * an existing draft already carries its own locked-in missionPack. */
  activeMissionPack?: MissionPackSelection
  onBack: () => void
  onDraftChange: (draft: CaptureDraft) => Promise<boolean>
  onComplete: (draft: CaptureDraft) => void
}

function buildDraft(
  mission: Mission,
  images: GridDraftImage[],
  compression?: CaptureDraft['compression'],
  previous?: CaptureDraft | null,
  localDate = previous?.localDate ?? getLocalDateKey(),
  activeMissionPack?: MissionPackSelection,
): CaptureDraft {
  return {
    mission,
    gridImages: images,
    abuseWarning: previous?.abuseWarning ?? false,
    localDate,
    lockedAt: previous?.lockedAt ?? new Date().toISOString(),
    closedAt: previous?.closedAt,
    recordLifecycle: previous?.recordLifecycle ?? (previous?.closedAt ? 'closed' : 'active'),
    localRevision: (previous?.localRevision ?? 0) + 1,
    serverRevision: previous?.serverRevision ?? 0,
    lastSyncError: undefined,
    journal: previous?.journal,
    compression,
    // The first photo carries today's 0-photo pack selection into the record. Once the
    // draft exists, its own missionPack is the source of truth (metadata-only updates
    // change it directly), so a new active selection never overwrites an existing draft.
    missionPack: previous?.missionPack ?? activeMissionPack,
  }
}

type CameraCapabilities = MediaTrackCapabilities & {
  torch?: boolean
  zoom?: { min?: number; max?: number; step?: number }
}

type CameraSettings = MediaTrackSettings & {
  zoom?: number
}

export function CameraView({ locale, mission, initialDraft, activeMissionPack, onBack, onDraftChange, onComplete }: CameraViewProps) {
  const previewDialogTitleId = useId()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const backdropVideoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraFileInputRef = useRef<HTMLInputElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const openedLocalDate = useRef(getLocalDateKey())
  const [images, setImages] = useState<GridDraftImage[]>(() => initialDraft?.gridImages ?? [])
  const [pendingImage, setPendingImage] = useState<{ image: GridDraftImage; compression: NonNullable<CaptureDraft['compression']> } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [torchOn, setTorchOn] = useState(false)
  const [hasTorch, setHasTorch] = useState(false)
  const [zoomRange, setZoomRange] = useState<CameraZoomRange | null>(null)
  const [zoomValue, setZoomValue] = useState(1)

  useEffect(() => {
    let isMounted = true

    function stopStream() {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    async function startCamera() {
      try {
        setError(null)
        setHasTorch(false)
        setTorchOn(false)
        setZoomRange(null)
        setZoomValue(1)
        stopStream()

        let stream: MediaStream
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: buildCameraVideoConstraints(facingMode),
            audio: false,
          })
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })
        }
        if (!isMounted) return
        streamRef.current = stream

        if (backdropVideoRef.current) {
          backdropVideoRef.current.srcObject = stream
          await backdropVideoRef.current.play()
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        const [track] = stream.getVideoTracks()
        const capabilities = track?.getCapabilities?.() as CameraCapabilities
        const nextZoomRange = normalizeZoomRange(capabilities?.zoom)
        if (track && nextZoomRange) {
          const settings = track.getSettings?.() as CameraSettings | undefined
          const nextZoomValue = clampZoom(settings?.zoom ?? getDefaultZoom(nextZoomRange), nextZoomRange)
          setZoomRange(nextZoomRange)
          setZoomValue(nextZoomValue)
          await track.applyConstraints({ advanced: [{ zoom: nextZoomValue } as MediaTrackConstraintSet] }).catch(() => undefined)
        }
        setHasTorch(Boolean(capabilities?.torch))
      } catch {
        setError(t(locale, 'permissionDenied'))
      }
    }

    void startCamera()

    return () => {
      isMounted = false
      stopStream()
    }
  }, [facingMode, locale])

  async function commitImages(nextImages: GridDraftImage[], compression?: CaptureDraft['compression']) {
    const nextDraft = buildDraft(mission, nextImages, compression, initialDraft, initialDraft?.localDate ?? openedLocalDate.current, activeMissionPack)
    const saved = await onDraftChange(nextDraft)
    if (!saved) return false
    setImages(nextImages)
    if (nextImages.length === MAX_GRID_IMAGES) {
      toast.success(locale === 'ko' ? '8컷을 모두 채웠어요.' : 'All 8 shots are collected.')
    }
    return true
  }

  async function addBlobToGrid(
    imageBlob: Blob,
    imageMeta: { width: number; height: number; bytes: number; mimeType: string },
    source: 'camera' | 'album',
  ) {
    if (images.length >= MAX_GRID_IMAGES) {
      toast.message(locale === 'ko' ? '오늘 그리드는 이미 가득 찼어요.' : "Today's grid is already full.")
      return
    }

    setIsCapturing(true)
    try {
      const previewUrl = URL.createObjectURL(imageBlob)
      const nextImage: GridDraftImage = {
        id: crypto.randomUUID(),
        slot: getNextGridSlot(images.length),
        previewUrl,
        imageBlob,
        width: imageMeta.width,
        height: imageMeta.height,
        bytes: imageMeta.bytes,
        quality: null,
        mimeType: imageMeta.mimeType,
        originalWidth: imageMeta.width,
        originalHeight: imageMeta.height,
        originalBytes: imageMeta.bytes,
        source,
        createdAt: new Date().toISOString(),
      }
      setPendingImage({ image: nextImage, compression: {
        width: imageMeta.width,
        height: imageMeta.height,
        bytes: imageMeta.bytes,
        quality: 1,
        source,
        stage: 'draft',
      } })
    } finally {
      setIsCapturing(false)
    }
  }

  async function acceptPendingImage() {
    if (!pendingImage) return
    setIsCapturing(true)
    const accepted = await commitImages([...images, pendingImage.image], pendingImage.compression)
    if (accepted) setPendingImage(null)
    else toast.error(locale === 'ko' ? '이 사진을 기기에 저장하지 못했어요. 다시 시도해 주세요.' : 'Could not save this photo on this device. Try again.')
    setIsCapturing(false)
  }

  function discardPendingImage() {
    if (pendingImage?.image.previewUrl) URL.revokeObjectURL(pendingImage.image.previewUrl)
    setPendingImage(null)
  }

  async function capture() {
    if (!videoRef.current) return
    const [track] = streamRef.current?.getVideoTracks() ?? []
    if (!track) return

    setIsCapturing(true)
    try {
      const photo = await capturePhotoBlob(track, videoRef.current)
      await addBlobToGrid(photo.blob, photo, 'camera')
    } catch {
      setError(locale === 'ko' ? '사진을 찍지 못했어요. 기본 카메라나 앨범을 사용해보세요.' : 'Could not take a photo. Try the native camera or album.')
    } finally {
      setIsCapturing(false)
    }
  }

  async function captureFromFile(file: File, source: 'camera' | 'album') {
    if (!file.type.startsWith('image/')) {
      setError(t(locale, 'imageOnly'))
      return
    }

    try {
      const image = await fileToDraftImageBlob(file)
      await addBlobToGrid(image.blob, image, source)
    } catch {
      setError(t(locale, 'imageLoadFailed'))
    }
  }

  function openAlbumPicker() {
    fileInputRef.current?.click()
  }

  function openNativeCameraCapture() {
    cameraFileInputRef.current?.click()
  }

  async function applyCameraZoom(nextValue: number) {
    if (!zoomRange) return
    const [track] = streamRef.current?.getVideoTracks() ?? []
    if (!track) return

    const nextZoomValue = clampZoom(nextValue, zoomRange)
    setZoomValue(nextZoomValue)

    try {
      await track.applyConstraints({ advanced: [{ zoom: nextZoomValue } as MediaTrackConstraintSet] })
    } catch {
      setZoomRange(null)
      toast.message(locale === 'ko' ? '이 브라우저에서는 줌 조절이 불안정해요.' : 'Zoom controls are not stable in this browser.')
    }
  }

  async function toggleTorch() {
    const [track] = streamRef.current?.getVideoTracks() ?? []
    if (!track || !hasTorch) return

    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] })
      setTorchOn((current) => !current)
    } catch {
      setHasTorch(false)
    }
  }

  const canComplete = images.length > 0
  const zoomPresets = zoomRange ? getZoomPresetValues(zoomRange) : []
  const zoomLabel = formatZoomValue(zoomValue)

  return (
    <main className="camera-screen">
      {!error ? (
        <>
          <video ref={backdropVideoRef} className="camera-video-backdrop absolute inset-0 size-full" playsInline muted />
          <video ref={videoRef} className="camera-video absolute inset-0 size-full" playsInline muted />
        </>
      ) : null}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (file) void captureFromFile(file, 'album')
        }}
      />
      <input
        ref={cameraFileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (file) void captureFromFile(file, 'camera')
        }}
      />
      <div className="camera-vignette" />

      {pendingImage ? (
        <HuedayDialog
          open={Boolean(pendingImage)}
          onClose={discardPendingImage}
          titleId={previewDialogTitleId}
          title={locale === 'ko' ? '이 사진을 오늘의 색 기록에 사용할까요?' : 'Use this photo for today’s color?'}
          closeLabel={locale === 'ko' ? '다시 찍기' : 'Retake'}
        >
          <img src={pendingImage.image.previewUrl} alt={locale === 'ko' ? '촬영한 사진 미리보기' : 'Captured photo preview'} className="aspect-[3/4] w-full rounded-[16px] object-cover" />
          <div className="hd-dialog-actions">
            <Button type="button" variant="outline" onClick={discardPendingImage} disabled={isCapturing}>
              {locale === 'ko' ? '다시 찍기' : 'Retake'}
            </Button>
            <Button type="button" onClick={() => void acceptPendingImage()} disabled={isCapturing}>
              {locale === 'ko' ? '이 사진 사용' : 'Use photo'}
            </Button>
          </div>
        </HuedayDialog>
      ) : null}

      <header className="camera-header">
        <Button type="button" variant="soft" size="icon" onClick={onBack} aria-label="Back">
          <X aria-hidden="true" />
        </Button>
        <div className="camera-pill">
          <span>{locale === 'ko' ? `${images.length}/8컷 모으는 중` : `${images.length}/8 shots`}</span>
        </div>
        <Button
          type="button"
          variant="soft"
          size="icon"
          onClick={() => void toggleTorch()}
          disabled={!hasTorch}
          aria-pressed={torchOn}
          aria-label={locale === 'ko' ? '플래시' : 'Flash'}
        >
          <Zap aria-hidden="true" />
        </Button>
      </header>

      <div className="camera-stage">
        {error ? (
          <div className="camera-permission-card">
            <p>{error}</p>
            <Button type="button" onClick={openAlbumPicker} disabled={isCapturing}>
              {t(locale, 'albumSelect')}
            </Button>
            {canComplete ? (
              <Button type="button" onClick={() => onComplete(buildDraft(mission, images, undefined, initialDraft, initialDraft?.localDate ?? openedLocalDate.current, activeMissionPack))}>
                <Check data-icon="inline-start" aria-hidden="true" />
                {locale === 'ko' ? '저널 쓰기' : 'Write journal'}
              </Button>
            ) : null}
            <Button type="button" variant="ghost" onClick={onBack}>
              {t(locale, 'today')}
            </Button>
          </div>
        ) : null}
      </div>

      {!error ? (
        <footer className="camera-footer camera-footer-grid">
          <div className="camera-zoom-panel">
            {zoomRange ? (
              <>
                <div className="camera-zoom-presets" aria-label={locale === 'ko' ? '줌 배율' : 'Zoom presets'}>
                  {zoomPresets.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      className={Math.abs(preset - zoomValue) < 0.05 ? 'is-active' : undefined}
                      onClick={() => void applyCameraZoom(preset)}
                    >
                      {formatZoomValue(preset)}x
                    </button>
                  ))}
                </div>
                <label className="camera-zoom-slider">
                  <span>{zoomLabel}x</span>
                  <input
                    type="range"
                    min={zoomRange.min}
                    max={zoomRange.max}
                    step={zoomRange.step}
                    value={zoomValue}
                    aria-label={locale === 'ko' ? '카메라 줌 조절' : 'Adjust camera zoom'}
                    onChange={(event) => void applyCameraZoom(Number(event.currentTarget.value))}
                  />
                </label>
              </>
            ) : (
              <span>{locale === 'ko' ? '인앱 카메라' : 'In-app camera'}</span>
            )}
            <button type="button" className="camera-native-link" onClick={openNativeCameraCapture}>
              <CameraIcon aria-hidden="true" />
              {locale === 'ko' ? '기본 카메라' : 'Native'}
            </button>
          </div>
          <div className="camera-grid-card">
            <div>
              <strong>{mission.label[locale]}</strong>
              <span>{t(locale, 'captureTip')}</span>
            </div>
            <GridCollage
              locale={locale}
              missionHex={mission.hex}
              colorName={mission.label[locale]}
              images={images}
              variant="camera"
              onEmptyClick={openAlbumPicker}
            />
          </div>
          <div className="camera-actions">
            <Button type="button" variant="soft" size="icon" onClick={openAlbumPicker} disabled={isCapturing} aria-label={t(locale, 'albumSelect')}>
              <Images aria-hidden="true" />
            </Button>
            <button type="button" className="camera-shutter" onClick={() => void capture()} disabled={isCapturing || images.length >= MAX_GRID_IMAGES} aria-label={t(locale, 'capture')} />
            <Button
              type="button"
              variant="soft"
              size="icon"
              onClick={() => setFacingMode((current) => (current === 'environment' ? 'user' : 'environment'))}
              aria-label={locale === 'ko' ? '카메라 전환' : 'Switch camera'}
            >
              <RotateCcw aria-hidden="true" />
            </Button>
          </div>
          <Button
            type="button"
            className="camera-done-button"
            disabled={!canComplete || Boolean(pendingImage)}
            onClick={() => onComplete(buildDraft(mission, images, undefined, initialDraft, initialDraft?.localDate ?? openedLocalDate.current, activeMissionPack))}
          >
            <Check data-icon="inline-start" aria-hidden="true" />
            {locale === 'ko' ? '저널 쓰기' : 'Write journal'}
          </Button>
        </footer>
      ) : null}
    </main>
  )
}
