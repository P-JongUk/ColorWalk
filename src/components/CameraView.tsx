import { useEffect, useRef, useState } from 'react'
import { Check, Images, RotateCcw, X, Zap } from 'lucide-react'
import { toast } from 'sonner'

import { GridCollage } from '@/components/GridCollage'
import { Button } from '@/components/ui/button'
import { capturePhotoBlob, fileToDraftImageBlob } from '@/lib/image'
import { t } from '@/lib/i18n'
import { getNextGridSlot, MAX_GRID_IMAGES } from '@/lib/grid'
import type { CaptureDraft, GridDraftImage, Locale, Mission } from '@/types'

type CameraViewProps = {
  locale: Locale
  mission: Mission
  initialDraft: CaptureDraft | null
  onBack: () => void
  onDraftChange: (draft: CaptureDraft) => void
  onComplete: (draft: CaptureDraft) => void
}

function buildDraft(mission: Mission, images: GridDraftImage[], compression?: CaptureDraft['compression']): CaptureDraft {
  return {
    mission,
    gridImages: images,
    abuseWarning: false,
    compression,
  }
}

type CameraCapabilities = MediaTrackCapabilities & {
  torch?: boolean
  zoom?: { min?: number; max?: number; step?: number }
}

function shouldUseNativeCameraFileCapture() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false

  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
}

export function CameraView({ locale, mission, initialDraft, onBack, onDraftChange, onComplete }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const backdropVideoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraFileInputRef = useRef<HTMLInputElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [images, setImages] = useState<GridDraftImage[]>(() => initialDraft?.gridImages ?? [])
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [torchOn, setTorchOn] = useState(false)
  const [hasTorch, setHasTorch] = useState(false)

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
        stopStream()

        let stream: MediaStream
        try {
          const videoConstraints = {
            facingMode: { ideal: facingMode },
            width: { ideal: 4096 },
            height: { ideal: 4096 },
            resizeMode: { ideal: 'none' },
          } as MediaTrackConstraints
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
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
        if (capabilities?.zoom?.min !== undefined) {
          await track.applyConstraints({ advanced: [{ zoom: capabilities.zoom.min } as MediaTrackConstraintSet] }).catch(() => undefined)
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

  function commitImages(nextImages: GridDraftImage[], compression?: CaptureDraft['compression']) {
    const nextDraft = buildDraft(mission, nextImages, compression)
    setImages(nextImages)
    onDraftChange(nextDraft)
    if (nextImages.length === MAX_GRID_IMAGES) {
      toast.success(locale === 'ko' ? '8컷을 모두 채웠어요.' : 'All 8 shots are collected.')
    }
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
      commitImages([...images, nextImage], {
        width: imageMeta.width,
        height: imageMeta.height,
        bytes: imageMeta.bytes,
        quality: 1,
        source,
        stage: 'draft',
      })
    } finally {
      setIsCapturing(false)
    }
  }

  async function capture() {
    if (shouldUseNativeCameraFileCapture()) {
      cameraFileInputRef.current?.click()
      return
    }

    if (!videoRef.current) return
    const [track] = streamRef.current?.getVideoTracks() ?? []
    if (!track) return

    const photo = await capturePhotoBlob(track, videoRef.current)
    await addBlobToGrid(photo.blob, photo, 'camera')
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
            <Button type="button" variant="ghost" onClick={onBack}>
              {t(locale, 'today')}
            </Button>
          </div>
        ) : null}
      </div>

      {!error ? (
        <footer className="camera-footer camera-footer-grid">
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
            disabled={!canComplete}
            onClick={() => onComplete(buildDraft(mission, images))}
          >
            <Check data-icon="inline-start" aria-hidden="true" />
            {locale === 'ko' ? '저널 쓰기' : 'Write journal'}
          </Button>
        </footer>
      ) : null}
    </main>
  )
}
