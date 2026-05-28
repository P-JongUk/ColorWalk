import { useEffect, useRef, useState } from 'react'
import { Images, RotateCcw, Sparkles, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getMatchRate } from '@/lib/colors'
import { pulseForMatch } from '@/lib/haptics'
import {
  compressCanvasToWebP,
  drawImageFileToCanvas,
  drawVideoToCanvas,
  sampleCanvasCenter,
  sampleVideoCenter,
} from '@/lib/image'
import { t } from '@/lib/i18n'
import type { CaptureDraft, Locale, Mission } from '@/types'

type CameraViewProps = {
  locale: Locale
  mission: Mission
  onBack: () => void
  onCaptured: (draft: CaptureDraft) => void
}

export function CameraView({ locale, mission, onBack, onCaptured }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastPulseRef = useRef(0)
  const [sampledHex, setSampledHex] = useState('#FFFFFF')
  const [matchRate, setMatchRate] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [torchOn, setTorchOn] = useState(false)
  const [hasTorch, setHasTorch] = useState(false)

  useEffect(() => {
    let animationFrame = 0
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
        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        const [track] = stream.getVideoTracks()
        const capabilities = track?.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean }
        setHasTorch(Boolean(capabilities?.torch))

        const tick = () => {
          if (!isMounted || !videoRef.current) return

          const sample = sampleVideoCenter(videoRef.current)
          const nextMatch = getMatchRate(mission.hex, sample.hex)
          setSampledHex(sample.hex)
          setMatchRate(nextMatch)

          if (nextMatch >= 90 && Date.now() - lastPulseRef.current > 1600) {
            lastPulseRef.current = Date.now()
            void pulseForMatch(nextMatch)
          }

          animationFrame = window.requestAnimationFrame(tick)
        }

        animationFrame = window.requestAnimationFrame(tick)
      } catch {
        setError(t(locale, 'permissionDenied'))
      }
    }

    void startCamera()

    return () => {
      isMounted = false
      window.cancelAnimationFrame(animationFrame)
      stopStream()
    }
  }, [facingMode, locale, mission.hex])

  async function capture() {
    if (!videoRef.current) return

    setIsCapturing(true)
    try {
      const canvas = drawVideoToCanvas(videoRef.current)
      const compressed = await compressCanvasToWebP(canvas)
      const previewUrl = URL.createObjectURL(compressed.blob)

      onCaptured({
        previewUrl,
        imageBlob: compressed.blob,
        capturedHex: sampledHex,
        matchRate,
        abuseWarning: false,
        compression: {
          width: compressed.width,
          height: compressed.height,
          bytes: compressed.bytes,
          quality: compressed.quality,
          source: 'camera',
        },
      })
    } finally {
      setIsCapturing(false)
    }
  }

  async function captureFromAlbum(file: File) {
    if (!file.type.startsWith('image/')) {
      setError(t(locale, 'imageOnly'))
      return
    }

    setIsCapturing(true)
    try {
      const canvas = await drawImageFileToCanvas(file)
      const sample = sampleCanvasCenter(canvas)
      const nextMatch = getMatchRate(mission.hex, sample.hex)
      const compressed = await compressCanvasToWebP(canvas)
      const previewUrl = URL.createObjectURL(compressed.blob)

      setSampledHex(sample.hex)
      setMatchRate(nextMatch)

      onCaptured({
        previewUrl,
        imageBlob: compressed.blob,
        capturedHex: sample.hex,
        matchRate: nextMatch,
        abuseWarning: false,
        compression: {
          width: compressed.width,
          height: compressed.height,
          bytes: compressed.bytes,
          quality: compressed.quality,
          source: 'album',
        },
      })
    } catch {
      setError(t(locale, 'imageLoadFailed'))
    } finally {
      setIsCapturing(false)
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

  const glow = matchRate >= 95 ? 'camera-ring-glow' : ''

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
          <span>{locale === 'ko' ? '조명을 잘 비춰서 비춰보세요' : 'Catch the light softly'}</span>
          <Sparkles className="camera-pill-icon" aria-hidden="true" />
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
          <div className="camera-target">
            <div className={`camera-ring absolute inset-0 ${glow}`} style={{ backgroundColor: `${sampledHex}18` }} />
            <div className="camera-crosshair" />
          </div>
        )}
      </div>

      {!error ? (
        <footer className="camera-footer">
          <div className="camera-sample-help">{locale === 'ko' ? '탭하면 색을 샘플링해요' : 'Tap to sample this color'}</div>
          <div className="camera-match-card">
            <div className="camera-swatch-block">
              <span style={{ backgroundColor: mission.hex }} />
              <small>{t(locale, 'target')}</small>
              <strong>{mission.hex}</strong>
            </div>
            <div className="camera-match-ring">
              <b>{matchRate}%</b>
              <small>{t(locale, 'match')}</small>
            </div>
            <div className="camera-swatch-block">
              <span style={{ backgroundColor: sampledHex }} />
              <small>{t(locale, 'sampled')}</small>
              <strong>{sampledHex}</strong>
            </div>
          </div>
          <Progress value={matchRate} className="sr-only" />
          <div className="camera-actions">
            <Button type="button" variant="soft" size="icon" onClick={openAlbumPicker} disabled={isCapturing} aria-label={t(locale, 'albumSelect')}>
              <Images aria-hidden="true" />
            </Button>
            <button type="button" className="camera-shutter" onClick={() => void capture()} disabled={isCapturing} aria-label={t(locale, 'capture')} />
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
        </footer>
      ) : null}
    </main>
  )
}
