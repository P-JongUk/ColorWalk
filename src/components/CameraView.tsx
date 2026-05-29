import { useEffect, useRef, useState } from 'react'
import { Check, Images, RotateCcw, X, Zap } from 'lucide-react'
import { toast } from 'sonner'

import { GridCollage } from '@/components/GridCollage'
import { Button } from '@/components/ui/button'
import { compressCanvasToWebP, drawImageFileToCanvas, drawVideoToCanvas } from '@/lib/image'
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

function buildDraft(images: GridDraftImage[], compression?: CaptureDraft['compression']): CaptureDraft {
  return {
    gridImages: images,
    abuseWarning: false,
    compression,
  }
}

export function CameraView({ locale, mission, initialDraft, onBack, onDraftChange, onComplete }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
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
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 1920 },
            },
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

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        const [track] = stream.getVideoTracks()
        const capabilities = track?.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean }
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
    const nextDraft = buildDraft(nextImages, compression)
    setImages(nextImages)
    onDraftChange(nextDraft)
    if (nextImages.length === MAX_GRID_IMAGES) {
      toast.success(locale === 'ko' ? '8컷을 모두 채웠어요.' : 'All 8 shots are collected.')
    }
  }

  async function addCanvasToGrid(canvas: HTMLCanvasElement, source: 'camera' | 'album') {
    if (images.length >= MAX_GRID_IMAGES) {
      toast.message(locale === 'ko' ? '오늘 그리드는 이미 가득 찼어요.' : "Today's grid is already full.")
      return
    }

    setIsCapturing(true)
    try {
      const compressed = await compressCanvasToWebP(canvas)
      const previewUrl = URL.createObjectURL(compressed.blob)
      const nextImage: GridDraftImage = {
        id: crypto.randomUUID(),
        slot: getNextGridSlot(images.length),
        previewUrl,
        imageBlob: compressed.blob,
        width: compressed.width,
        height: compressed.height,
        bytes: compressed.bytes,
        quality: compressed.quality,
        source,
        createdAt: new Date().toISOString(),
      }
      commitImages([...images, nextImage], {
        width: compressed.width,
        height: compressed.height,
        bytes: compressed.bytes,
        quality: compressed.quality,
        source,
      })
    } finally {
      setIsCapturing(false)
    }
  }

  async function capture() {
    if (!videoRef.current) return
    await addCanvasToGrid(drawVideoToCanvas(videoRef.current), 'camera')
  }

  async function captureFromAlbum(file: File) {
    if (!file.type.startsWith('image/')) {
      setError(t(locale, 'imageOnly'))
      return
    }

    try {
      await addCanvasToGrid(await drawImageFileToCanvas(file), 'album')
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
      {!error ? <video ref={videoRef} className="absolute inset-0 size-full object-cover" playsInline muted /> : null}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (file) void captureFromAlbum(file)
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
        ) : (
          <div className="camera-grid-ghost">
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
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
            onClick={() => onComplete(buildDraft(images))}
          >
            <Check data-icon="inline-start" aria-hidden="true" />
            {locale === 'ko' ? '저널 쓰기' : 'Write journal'}
          </Button>
        </footer>
      ) : null}
    </main>
  )
}
