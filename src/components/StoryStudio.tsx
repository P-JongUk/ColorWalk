import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { Capacitor } from '@capacitor/core'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { Download, Eraser, Minus, Plus, RotateCcw, Search, Share2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { GridCollage } from '@/components/GridCollage'
import { StoryCard, type StoryCardData } from '@/components/StoryCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createStickerItem,
  DEFAULT_STORY_DESIGN,
  getStickerDefinition,
  STORY_STICKERS,
  STORY_TEMPLATES,
  STICKER_CATEGORIES,
  TEMPLATE_CATEGORIES,
  type StoryTemplateCategory,
} from '@/lib/story'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { Locale, StoryDesign, StoryStickerCategory, StoryStickerItem, StoryTemplateId } from '@/types'

const STORY_DECORATION_TOOLS_ENABLED = false
const SIMPLE_STORY_TEMPLATE_ID: StoryTemplateId = 'modern-grid'

type StoryStudioProps = {
  locale: Locale
  data: Omit<StoryCardData, 'locale' | 'templateId'>
  initialDesign?: StoryDesign
  onDesignChange?: (design: StoryDesign) => void
}

async function exportElement(element: HTMLElement, filename: string, size = { width: 1080, height: 1920 }) {
  const { default: html2canvas } = await import('html2canvas')
  const bounds = element.getBoundingClientRect()
  const scale = size.width / bounds.width
  element.classList.add('story-exporting')
  let sourceCanvas: HTMLCanvasElement
  try {
    sourceCanvas = await html2canvas(element, {
      backgroundColor: null,
      scale,
      useCORS: true,
    })
  } finally {
    element.classList.remove('story-exporting')
  }
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Failed to render story')
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height)

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to render story'))
        return
      }

      resolve(new File([blob], filename, { type: 'image/png' }))
    }, 'image/png')
  })
}

function exportFilename(kind: 'story' | 'grid') {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return kind === 'grid' ? `colorwalk-3x3-${stamp}.png` : `colorwalk-story-${stamp}.png`
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result ?? '')
      resolve(value.includes(',') ? value.split(',')[1] : value)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read story file'))
    reader.readAsDataURL(file)
  })
}

async function shareNativeStory(file: File, locale: Locale, mode: 'download' | 'share', kind: 'story' | 'grid') {
  const path = `${kind === 'grid' ? 'grids' : 'stories'}/${file.name}`

  await Filesystem.mkdir({
    path: kind === 'grid' ? 'grids' : 'stories',
    directory: Directory.Cache,
    recursive: true,
  }).catch(() => undefined)

  await Filesystem.writeFile({
    path,
    directory: Directory.Cache,
    data: await fileToBase64(file),
    recursive: true,
  })

  const { uri } = await Filesystem.getUri({
    path,
    directory: Directory.Cache,
  })

  await Share.share({
    title: kind === 'grid' ? 'ColorWalk 3x3' : 'ColorWalk Story',
    dialogTitle:
      mode === 'download'
        ? locale === 'ko'
          ? kind === 'grid' ? '3x3 이미지 저장 또는 공유' : '스토리 사진 저장 또는 공유'
          : kind === 'grid' ? 'Save or share 3x3 image' : 'Save or share story image'
        : locale === 'ko'
          ? kind === 'grid' ? '3x3 공유하기' : '스토리 공유하기'
          : kind === 'grid' ? 'Share 3x3' : 'Share story',
    files: [uri],
  })
}

export function StoryStudio({ locale, data, initialDesign, onDesignChange }: StoryStudioProps) {
  const exportRef = useRef<HTMLDivElement | null>(null)
  const gridExportRef = useRef<HTMLDivElement | null>(null)
  const cardBoundsRef = useRef<DOMRect | null>(null)
  const stickerIndexRef = useRef(0)
  const [templateId, setTemplateId] = useState<StoryTemplateId>(STORY_DECORATION_TOOLS_ENABLED ? initialDesign?.templateId ?? DEFAULT_STORY_DESIGN.templateId : SIMPLE_STORY_TEMPLATE_ID)
  const [stickers, setStickers] = useState<StoryStickerItem[]>(STORY_DECORATION_TOOLS_ENABLED ? initialDesign?.stickers ?? DEFAULT_STORY_DESIGN.stickers : [])
  const [selectedStickerUid, setSelectedStickerUid] = useState<string | null>(stickers[0]?.uid ?? null)
  const [activeCategory, setActiveCategory] = useState<StoryStickerCategory>('all')
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<StoryTemplateCategory>('recommended')
  const [query, setQuery] = useState('')

  const visibleTemplates = useMemo(() => {
    if (activeTemplateCategory === 'recommended') return STORY_TEMPLATES
    return STORY_TEMPLATES.filter((template) => template.category === activeTemplateCategory || template.category === 'recommended')
  }, [activeTemplateCategory])

  const visibleStickers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return STORY_STICKERS.filter((sticker) => {
      const matchesCategory = activeCategory === 'all' || sticker.pack === activeCategory
      const matchesQuery =
        !normalizedQuery ||
        sticker.label.toLowerCase().includes(normalizedQuery) ||
        sticker.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  function publish(nextTemplateId: StoryTemplateId, nextStickers: StoryStickerItem[]) {
    onDesignChange?.({ templateId: nextTemplateId, stickers: nextStickers })
  }

  function selectTemplate(nextTemplateId: StoryTemplateId) {
    setTemplateId(nextTemplateId)
    publish(nextTemplateId, stickers)
  }

  function setNextStickers(nextStickers: StoryStickerItem[]) {
    setStickers(nextStickers)
    publish(templateId, nextStickers)
  }

  function addSticker(stickerId: string) {
    stickerIndexRef.current += 1
    const next = [...stickers, createStickerItem(stickerId, stickerIndexRef.current)]
    setSelectedStickerUid(next[next.length - 1].uid)
    setNextStickers(next)
  }

  function updateSelected(patch: Partial<StoryStickerItem>) {
    if (!selectedStickerUid) return
    setNextStickers(
      stickers.map((sticker) =>
        sticker.uid === selectedStickerUid
          ? {
              ...sticker,
              ...patch,
              scale: Math.min(2.2, Math.max(0.45, patch.scale ?? sticker.scale)),
              rotation: Math.min(32, Math.max(-32, patch.rotation ?? sticker.rotation)),
            }
          : sticker,
      ),
    )
  }

  function removeSelected() {
    if (!selectedStickerUid) return
    const next = stickers.filter((sticker) => sticker.uid !== selectedStickerUid)
    setSelectedStickerUid(next[0]?.uid ?? null)
    setNextStickers(next)
  }

  function beginDrag(event: PointerEvent<HTMLButtonElement>, target: StoryStickerItem) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setSelectedStickerUid(target.uid)
    cardBoundsRef.current = exportRef.current?.getBoundingClientRect() ?? null
  }

  function moveSelected(event: PointerEvent<HTMLDivElement>) {
    if (!selectedStickerUid || !cardBoundsRef.current || event.buttons !== 1) return
    const bounds = cardBoundsRef.current
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setNextStickers(
      stickers.map((sticker) =>
        sticker.uid === selectedStickerUid
          ? { ...sticker, x: Math.min(94, Math.max(6, x)), y: Math.min(94, Math.max(6, y)) }
          : sticker,
      ),
    )
  }

  async function saveOrShare(mode: 'download' | 'share', kind: 'story' | 'grid' = 'story') {
    const target = kind === 'grid' ? gridExportRef.current : exportRef.current
    if (!target) return

    try {
      const file = await exportElement(
        target,
        exportFilename(kind),
        kind === 'grid' ? { width: 1080, height: 1080 } : { width: 1080, height: 1920 },
      )
      if (Capacitor.isNativePlatform()) {
        await shareNativeStory(file, locale, mode, kind)
        toast.success(t(locale, 'storySaved'))
        return
      }

      if (mode === 'share' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: kind === 'grid' ? 'ColorWalk 3x3' : 'ColorWalk Story' })
        return
      }

      const url = URL.createObjectURL(file)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = file.name
      anchor.click()
      URL.revokeObjectURL(url)
      toast.success(t(locale, 'storySaved'))
    } catch (error) {
      console.error(error)
      toast.error(t(locale, 'saveFailed'))
    }
  }

  const selectedSticker = stickers.find((sticker) => sticker.uid === selectedStickerUid)

  return (
    <section className="story-studio">
      <div className="section-heading story-studio-heading">
        <div>
          <p>{t(locale, 'story')}</p>
          <h2>{t(locale, 'storyMaker')}</h2>
        </div>
        <span>9:16</span>
      </div>

      <div className="story-preview-wrap" onPointerMove={moveSelected}>
        <StoryCard
          {...data}
          locale={locale}
          templateId={templateId}
          stickers={STORY_DECORATION_TOOLS_ENABLED ? stickers : []}
          exportRef={exportRef}
          selectedStickerUid={selectedStickerUid}
          onStickerPointerDown={beginDrag}
          onSelectSticker={setSelectedStickerUid}
        />
      </div>

      <div className="story-grid-export-source" aria-hidden="true">
        <div ref={gridExportRef} className="grid-export-card">
          <GridCollage
            locale={locale}
            missionHex={data.missionHex}
            colorName={data.colorName || data.missionLabel}
            images={data.gridImages}
            variant="story"
            className="color-grid-export-square"
          />
        </div>
      </div>

      {STORY_DECORATION_TOOLS_ENABLED ? (
      <div className="template-gallery">
        <div className="template-tabs">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={cn(activeTemplateCategory === category.id && 'is-active')}
              onClick={() => setActiveTemplateCategory(category.id)}
            >
              {category.label[locale]}
            </button>
          ))}
        </div>
        <div className="template-strip" aria-label={t(locale, 'storyTemplate')}>
          {visibleTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={cn('template-card', templateId === template.id && 'template-card-active')}
              onClick={() => selectTemplate(template.id)}
            >
              <div className={cn('template-thumb', template.className)}>
                <span className="template-thumb-grid" style={{ backgroundColor: data.missionHex }} />
                <b>{template.id === 'air-trip' ? 'AIR' : template.id === 'newsprint' ? 'NEWS' : template.id === 'life-cut' ? 'CUT' : 'GRID'}</b>
              </div>
              <strong>{template.name[locale]}</strong>
              <small>{template.caption[locale]}</small>
            </button>
          ))}
        </div>
      </div>
      ) : null}

      <div className="story-export-actions">
        <Button type="button" variant="outline" onClick={() => void saveOrShare('download', 'grid')}>
          <Download data-icon="inline-start" aria-hidden="true" />
          {locale === 'ko' ? '3x3 저장' : 'Save 3x3'}
        </Button>
        <Button type="button" variant="outline" onClick={() => void saveOrShare('download', 'story')}>
          <Download data-icon="inline-start" aria-hidden="true" />
          {t(locale, 'saveStory')}
        </Button>
        <Button type="button" onClick={() => void saveOrShare('share', 'story')}>
          <Share2 data-icon="inline-start" aria-hidden="true" />
          {t(locale, 'shareStory')}
        </Button>
      </div>

      {STORY_DECORATION_TOOLS_ENABLED ? (
      <div className="sticker-drawer">
        <label className="sticker-search">
          <Search aria-hidden="true" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t(locale, 'storySearch')} />
        </label>
        <div className="sticker-tabs">
          {STICKER_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={cn(activeCategory === category.id && 'is-active')}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label[locale]}
            </button>
          ))}
        </div>
        <p>{t(locale, 'stickerHint')}</p>
        <div className="sticker-grid">
          {visibleStickers.map((sticker) => {
            const definition = getStickerDefinition(sticker.id)
            return (
              <button key={sticker.id} type="button" onClick={() => addSticker(sticker.id)} aria-label={definition.label}>
                <img src={definition.assetUrl} alt="" draggable={false} />
              </button>
            )
          })}
        </div>
      </div>
      ) : null}

      {STORY_DECORATION_TOOLS_ENABLED ? (
      <div className="story-controls">
        <Button
          type="button"
          variant="outline"
          disabled={!selectedSticker}
          onClick={() => updateSelected({ scale: (selectedSticker?.scale ?? 1) + 0.12 })}
        >
          <Plus data-icon="inline-start" aria-hidden="true" />
          {locale === 'ko' ? '크게' : 'Bigger'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!selectedSticker}
          onClick={() => updateSelected({ scale: (selectedSticker?.scale ?? 1) - 0.12 })}
        >
          <Minus data-icon="inline-start" aria-hidden="true" />
          {locale === 'ko' ? '작게' : 'Smaller'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!selectedSticker}
          onClick={() => updateSelected({ rotation: (selectedSticker?.rotation ?? 0) + 6 })}
        >
          <RotateCcw data-icon="inline-start" aria-hidden="true" />
          {locale === 'ko' ? '회전' : 'Rotate'}
        </Button>
        <Button type="button" variant="outline" disabled={!selectedSticker} onClick={removeSelected}>
          <Trash2 data-icon="inline-start" aria-hidden="true" />
          {locale === 'ko' ? '삭제' : 'Delete'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSelectedStickerUid(DEFAULT_STORY_DESIGN.stickers[0]?.uid ?? null)
            setNextStickers(DEFAULT_STORY_DESIGN.stickers)
          }}
        >
          <Eraser data-icon="inline-start" aria-hidden="true" />
          {t(locale, 'resetStickers')}
        </Button>
      </div>
      ) : null}
    </section>
  )
}
