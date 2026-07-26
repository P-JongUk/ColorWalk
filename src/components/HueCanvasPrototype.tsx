import { Archive, ArrowLeft, Brush, Eraser, Hand, Palette, Redo2, Undo2, ZoomIn, ZoomOut } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent } from 'react'

import '@/components/HueCanvasPrototype.css'
import { GridCollage } from '@/components/GridCollage'
import { canPlaceHueCanvasColor, createHueCanvasRecipe, getHueCanvasColorUsage, getHueCanvasPalette, HUE_CANVAS_LOGICAL_SIZE, type HueCanvasPaletteColor, type HueCanvasRecipe } from '@/lib/hueCanvas'
import { loadHueCanvasPrototypeRecipes, saveHueCanvasPrototypeRecipe } from '@/lib/hueCanvasStorage'
import { getPostGridImages } from '@/lib/grid'
import type { Locale, Post } from '@/types'

type HueCanvasPrototypeProps = { ownerId: string; posts: Post[]; locale: Locale }
type CanvasTool = 'paint' | 'erase' | 'pan'
type CanvasCommit = Pick<HueCanvasRecipe, 'cells' | 'viewport'>
type Stroke = Array<[number, string | undefined, string | undefined]>
type SurfaceHandle = { undo: () => void; redo: () => void; zoomBy: (factor: number) => void }

function formatCount(value: number) { return new Intl.NumberFormat('ko-KR').format(value) }

export function HueCanvasPrototype({ ownerId, posts, locale }: HueCanvasPrototypeProps) {
  const [screen, setScreen] = useState<'entry' | 'palette' | 'canvas'>('entry')
  const [recipes, setRecipes] = useState<HueCanvasRecipe[]>([])
  const [recipe, setRecipe] = useState<HueCanvasRecipe | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [tool, setTool] = useState<CanvasTool>('paint')
  const [usage, setUsage] = useState(new Map<string, number>())
  const [history, setHistory] = useState({ undo: false, redo: false })
  const [notice, setNotice] = useState<string | null>(null)
  const [sourcePostId, setSourcePostId] = useState<string | null>(null)
  const surfaceRef = useRef<SurfaceHandle | null>(null)
  const palette = useMemo(() => getHueCanvasPalette(posts), [posts])
  const paletteByHex = useMemo(() => new Map(palette.map((color) => [color.hex, color])), [palette])
  const activeColor = selectedColor && paletteByHex.has(selectedColor) ? selectedColor : palette[0]?.hex ?? null
  const selectedPaletteColor = activeColor ? paletteByHex.get(activeColor) : undefined
  const sourcePost = posts.find((post) => post.id === sourcePostId)

  useEffect(() => {
    let active = true
    void loadHueCanvasPrototypeRecipes(ownerId).then((stored) => { if (active) setRecipes(stored) }).catch(() => undefined)
    return () => { active = false }
  }, [ownerId])

  function commitRecipe(next: HueCanvasRecipe) {
    setRecipe(next)
    setRecipes((current) => [next, ...current.filter((candidate) => candidate.id !== next.id)])
    void saveHueCanvasPrototypeRecipe(next).catch(() => setNotice('이 기기에는 저장하지 못했어요. 계속 그릴 수 있어요.'))
  }

  function startFreeCanvas() {
    const next = createHueCanvasRecipe(ownerId)
    setUsage(new Map())
    setHistory({ undo: false, redo: false })
    setRecipe(next)
    setScreen('canvas')
    void saveHueCanvasPrototypeRecipe(next).then(() => setRecipes((current) => [next, ...current])).catch(() => setNotice('이 기기에는 저장하지 못했어요. 계속 그릴 수 있어요.'))
  }

  function continueRecipe(next: HueCanvasRecipe) {
    setRecipe(next)
    setUsage(getHueCanvasColorUsage(next.cells))
    setHistory({ undo: false, redo: false })
    setScreen('canvas')
  }

  function handleCanvasCommit(next: CanvasCommit) {
    if (!recipe) return
    const saved = { ...recipe, ...next, updatedAt: new Date().toISOString() }
    setUsage(getHueCanvasColorUsage(saved.cells))
    commitRecipe(saved)
  }

  if (screen === 'palette') {
    return (
      <main className="hue-canvas-prototype">
        <PrototypeHeader title="Hue Palette" onBack={() => setScreen(recipe ? 'canvas' : 'entry')} />
        <section className="hue-canvas-palette-intro"><span>COLOR MATERIAL ARCHIVE</span><h1>완성한 색으로<br />작품을 채워요.</h1><p>3×3을 완성할 때마다 그 중앙 색을 이 작품에서 8칸 더 쓸 수 있어요.</p></section>
        <section className="hue-canvas-palette-list" aria-label="Hue Palette">
          {palette.map((color) => <PaletteRow key={color.hex} color={color} used={usage.get(color.hex) ?? 0} selected={activeColor === color.hex} onSelect={() => { setSelectedColor(color.hex); setSourcePostId(color.sourcePostIds[0] ?? null) }} />)}
          {!palette.length ? <div className="hue-canvas-empty-material"><Palette aria-hidden="true" /><strong>아직 완성한 3×3이 없어요.</strong><p>주변의 색 장면 8장을 모으면 중앙 미션 색 8칸이 Hue Palette에 들어와요.</p></div> : null}
        </section>
        {sourcePost ? <section className="hue-canvas-source-card"><div><span>ORIGINAL 3×3</span><strong>{sourcePost.local_date} · {sourcePost.mission_hex}</strong></div><GridCollage locale={locale} missionHex={sourcePost.mission_hex} colorName={sourcePost.custom_color_name || sourcePost.mission_label || undefined} images={getPostGridImages(sourcePost)} variant="mini" /></section> : null}
      </main>
    )
  }

  if (screen === 'canvas' && recipe) {
    const used = selectedPaletteColor ? usage.get(selectedPaletteColor.hex) ?? 0 : 0
    return (
      <main className="hue-canvas-prototype hue-canvas-workspace">
        <PrototypeHeader title="자유 캔버스" onBack={() => setScreen('entry')} action={<button type="button" className="hue-canvas-palette-trigger" onClick={() => setScreen('palette')}><Palette aria-hidden="true" />Palette</button>} />
        <div className="hue-canvas-workspace-meta"><span>{recipe.title}</span><span>{recipe.cells.length} CELLS · AUTO SAVED</span></div>
        <HueCanvasSurface
          ref={surfaceRef}
          recipe={recipe}
          palette={paletteByHex}
          selectedColor={activeColor}
          tool={tool}
          onCommit={handleCanvasCommit}
          onHistoryChange={setHistory}
          onLimit={() => setNotice(selectedPaletteColor ? `${selectedPaletteColor.label}은 이 작품에서 ${selectedPaletteColor.usableCells}칸까지 쓸 수 있어요.` : 'Hue Palette에서 색을 골라 주세요.')}
        />
        <section className="hue-canvas-active-color">
          <button type="button" className="hue-canvas-active-swatch" style={{ background: selectedPaletteColor?.hex ?? '#D8D6D0' }} onClick={() => setScreen('palette')} aria-label="Open palette" />
          <div><strong>{selectedPaletteColor?.label ?? 'Hue Palette에서 색 선택'}</strong><span>{selectedPaletteColor ? `이 작품에서 ${used}/${selectedPaletteColor.usableCells}칸 사용 · ${selectedPaletteColor.usableCells - used}칸 남음` : '완성한 3×3의 색을 선택해 주세요.'}</span></div>
        </section>
        <nav className="hue-canvas-tools" aria-label="Canvas tools">
          <button type="button" className={tool === 'paint' ? 'is-active' : ''} onClick={() => setTool('paint')}><Brush aria-hidden="true" /><span>칠하기</span></button>
          <button type="button" className={tool === 'erase' ? 'is-active' : ''} onClick={() => setTool('erase')}><Eraser aria-hidden="true" /><span>지우기</span></button>
          <button type="button" className={tool === 'pan' ? 'is-active' : ''} onClick={() => setTool('pan')}><Hand aria-hidden="true" /><span>이동</span></button>
          <button type="button" disabled={!history.undo} onClick={() => surfaceRef.current?.undo()}><Undo2 aria-hidden="true" /><span>되돌리기</span></button>
          <button type="button" disabled={!history.redo} onClick={() => surfaceRef.current?.redo()}><Redo2 aria-hidden="true" /><span>다시</span></button>
        </nav>
        <div className="hue-canvas-zoom-buttons"><button type="button" onClick={() => surfaceRef.current?.zoomBy(0.82)} aria-label="Zoom out"><ZoomOut aria-hidden="true" /></button><button type="button" onClick={() => surfaceRef.current?.zoomBy(1.22)} aria-label="Zoom in"><ZoomIn aria-hidden="true" /></button></div>
        {notice ? <button type="button" className="hue-canvas-notice" onClick={() => setNotice(null)}>{notice}</button> : null}
      </main>
    )
  }

  return (
    <main className="hue-canvas-prototype hue-canvas-entry">
      <header className="hue-canvas-entry-header"><span>HUE CANVAS · PROTOTYPE</span><Archive aria-hidden="true" /></header>
      <section className="hue-canvas-entry-hero"><p>FOUND COLOR ARCHIVE</p><h1>오늘 찾은 색을<br />내 그림으로.</h1><span>완성한 3×3의 중앙 색이 반투명 유리 타일 재료가 됩니다.</span></section>
      <section className="hue-canvas-start-grid" aria-label="Choose a Hue Canvas start">
        <button type="button" className="hue-canvas-start-card hue-canvas-free-card" onClick={startFreeCanvas}><span>01</span><strong>자유 캔버스 시작</strong><small>빈 격자에서 내 방식으로 그리기</small><i aria-hidden="true" /></button>
        <button type="button" className="hue-canvas-start-card hue-canvas-template-card" onClick={() => setNotice('도안으로 시작은 G2a에서 기하학 창·잎·수평선 도안과 연결합니다.')}><span>02</span><strong>도안으로 시작</strong><small>검은 선 안을 발견 색으로 채우기</small><i aria-hidden="true" /></button>
      </section>
      <section className="hue-canvas-entry-palette"><div><span>HUE PALETTE</span><strong>완성한 색 {formatCount(palette.length)}개</strong><small>완료 페이지마다 해당 색 8칸</small></div><button type="button" onClick={() => setScreen('palette')}>열기 <Palette aria-hidden="true" /></button></section>
      <section className="hue-canvas-drafts"><div className="hue-canvas-section-label"><span>SAVED DRAFTS</span><strong>{recipes.length ? '이어 그리기' : '저장된 draft 없음'}</strong></div>{recipes.slice(0, 2).map((draft) => <button type="button" key={draft.id} onClick={() => continueRecipe(draft)}><i style={{ background: draft.cells[0]?.[1] ?? '#D8D6D0' }} /><span><strong>{draft.title}</strong><small>{draft.cells.length}칸 · {new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(new Date(draft.updatedAt))}</small></span><ArrowLeft aria-hidden="true" /></button>)}</section>
      {notice ? <button type="button" className="hue-canvas-notice" onClick={() => setNotice(null)}>{notice}</button> : null}
    </main>
  )
}

function PrototypeHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: ReactNode }) {
  return <header className="hue-canvas-header"><button type="button" onClick={onBack} aria-label="Back"><ArrowLeft aria-hidden="true" /></button><strong>{title}</strong>{action ?? <span />}</header>
}

function PaletteRow({ color, used, selected, onSelect }: { color: HueCanvasPaletteColor; used: number; selected: boolean; onSelect: () => void }) {
  return <button type="button" className={`hue-canvas-palette-row${selected ? ' is-selected' : ''}`} onClick={onSelect}><i style={{ background: color.hex }} /><span><strong>{color.label} · {color.completedPages}번 완성</strong><small>이 작품에서 {used}/{color.usableCells}칸 사용 · {color.usableCells - used}칸 남음</small></span><em>{color.hex}</em></button>
}

const HueCanvasSurface = forwardRef<SurfaceHandle, { recipe: HueCanvasRecipe; palette: Map<string, HueCanvasPaletteColor>; selectedColor: string | null; tool: CanvasTool; onCommit: (next: CanvasCommit) => void; onHistoryChange: (history: { undo: boolean; redo: boolean }) => void; onLimit: () => void }>(function HueCanvasSurface({ recipe, palette, selectedColor, tool, onCommit, onHistoryChange, onLimit }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cellsRef = useRef(new Map<number, string>())
  const viewportRef = useRef({ ...recipe.viewport })
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const strokeRef = useRef(new Map<number, [string | undefined, string | undefined]>())
  const lastCellRef = useRef<number | null>(null)
  const undoRef = useRef<Stroke[]>([])
  const redoRef = useRef<Stroke[]>([])
  const rafRef = useRef<number | null>(null)

  const render = () => {
    rafRef.current = null
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.round(rect.width * dpr))
    const height = Math.max(1, Math.round(rect.height * dpr))
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height }
    const context = canvas.getContext('2d')
    if (!context) return
    const viewport = viewportRef.current
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, rect.width, rect.height)
    context.fillStyle = '#EAE9E3'
    context.fillRect(0, 0, rect.width, rect.height)
    const minX = Math.max(0, Math.floor(-viewport.offsetX / viewport.zoom) - 1)
    const maxX = Math.min(HUE_CANVAS_LOGICAL_SIZE, Math.ceil((rect.width - viewport.offsetX) / viewport.zoom) + 1)
    const minY = Math.max(0, Math.floor(-viewport.offsetY / viewport.zoom) - 1)
    const maxY = Math.min(HUE_CANVAS_LOGICAL_SIZE, Math.ceil((rect.height - viewport.offsetY) / viewport.zoom) + 1)
    for (const [index, color] of cellsRef.current) {
      const x = index % HUE_CANVAS_LOGICAL_SIZE
      const y = Math.floor(index / HUE_CANVAS_LOGICAL_SIZE)
      if (x < minX || x > maxX || y < minY || y > maxY) continue
      const left = viewport.offsetX + x * viewport.zoom
      const top = viewport.offsetY + y * viewport.zoom
      context.fillStyle = color
      context.fillRect(left, top, viewport.zoom, viewport.zoom)
      context.fillStyle = 'rgba(255,255,255,.20)'
      context.fillRect(left + 1, top + 1, Math.max(0, viewport.zoom - 2), Math.max(1, viewport.zoom * .21))
      context.fillStyle = 'rgba(22,37,42,.16)'
      context.fillRect(left, top + viewport.zoom - 1, viewport.zoom, 1)
    }
    if (viewport.zoom >= 8) {
      context.strokeStyle = 'rgba(22,37,42,.14)'
      context.lineWidth = 1
      context.beginPath()
      for (let x = minX; x <= maxX; x += 1) { const left = viewport.offsetX + x * viewport.zoom; context.moveTo(left, viewport.offsetY + minY * viewport.zoom); context.lineTo(left, viewport.offsetY + maxY * viewport.zoom) }
      for (let y = minY; y <= maxY; y += 1) { const top = viewport.offsetY + y * viewport.zoom; context.moveTo(viewport.offsetX + minX * viewport.zoom, top); context.lineTo(viewport.offsetX + maxX * viewport.zoom, top) }
      context.stroke()
    }
  }

  const requestRender = () => { if (rafRef.current === null) rafRef.current = requestAnimationFrame(render) }

  const commit = () => onCommit({ cells: [...cellsRef.current.entries()], viewport: { ...viewportRef.current } })
  const updateHistory = () => onHistoryChange({ undo: undoRef.current.length > 0, redo: redoRef.current.length > 0 })

  useEffect(() => {
    cellsRef.current = new Map(recipe.cells)
    viewportRef.current = { ...recipe.viewport }
    undoRef.current = []
    redoRef.current = []
    const canvas = canvasRef.current
    if (canvas && !recipe.viewport.offsetX && !recipe.viewport.offsetY) {
      const rect = canvas.getBoundingClientRect()
      viewportRef.current = { zoom: 18, offsetX: rect.width / 2 - 128 * 18, offsetY: rect.height / 2 - 128 * 18 }
    }
    updateHistory(); requestRender()
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  // Recipe identity is the only time the engine should replace its internal sparse map.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.id])

  useEffect(() => {
    const observer = new ResizeObserver(requestRender)
    if (canvasRef.current) observer.observe(canvasRef.current)
    return () => observer.disconnect()
  // requestRender owns a stable ref-based renderer.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function paintCell(index: number, next: string | undefined) {
    const previous = cellsRef.current.get(index)
    if (previous === next) return
    if (next) {
      const color = palette.get(next)
      const usage = getHueCanvasColorUsage(cellsRef.current)
      if (!canPlaceHueCanvasColor(color, usage) && previous !== next) { onLimit(); return }
      cellsRef.current.set(index, next)
    } else cellsRef.current.delete(index)
    const recorded = strokeRef.current.get(index)
    strokeRef.current.set(index, [recorded?.[0] ?? previous, next])
  }

  function paintTo(point: { x: number; y: number }) {
    if (tool === 'pan') return
    if (tool === 'paint' && !selectedColor) { onLimit(); return }
    const viewport = viewportRef.current
    const x = Math.floor((point.x - viewport.offsetX) / viewport.zoom)
    const y = Math.floor((point.y - viewport.offsetY) / viewport.zoom)
    if (x < 0 || y < 0 || x >= HUE_CANVAS_LOGICAL_SIZE || y >= HUE_CANVAS_LOGICAL_SIZE) return
    const index = y * HUE_CANVAS_LOGICAL_SIZE + x
    const previous = lastCellRef.current
    const drawIndex = (cell: number) => paintCell(cell, tool === 'erase' ? undefined : selectedColor ?? undefined)
    if (previous === null) drawIndex(index)
    else {
      const fromX = previous % HUE_CANVAS_LOGICAL_SIZE; const fromY = Math.floor(previous / HUE_CANVAS_LOGICAL_SIZE)
      const steps = Math.max(Math.abs(x - fromX), Math.abs(y - fromY), 1)
      for (let step = 0; step <= steps; step += 1) drawIndex(Math.round(fromY + (y - fromY) * step / steps) * HUE_CANVAS_LOGICAL_SIZE + Math.round(fromX + (x - fromX) * step / steps))
    }
    lastCellRef.current = index
    requestRender()
  }

  function finishStroke() {
    const changes = [...strokeRef.current.entries()].map(([index, [before, after]]) => [index, before, after] as [number, string | undefined, string | undefined]).filter(([, before, after]) => before !== after)
    if (changes.length) {
      undoRef.current.push(changes)
      let diffCount = undoRef.current.reduce((total, stroke) => total + stroke.length, 0)
      while (undoRef.current.length > 50 || diffCount > 20_000) diffCount -= undoRef.current.shift()!.length
      redoRef.current = []
      updateHistory()
      commit()
    }
    strokeRef.current.clear(); lastCellRef.current = null
  }

  function pointFor(event: ReactMouseEvent<HTMLCanvasElement> | ReactPointerEvent<HTMLCanvasElement> | ReactWheelEvent<HTMLCanvasElement>) { const rect = event.currentTarget.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top } }
  function pinch() {
    const points = [...pointersRef.current.values()]
    if (points.length !== 2) return
    const [a, b] = points; const distance = Math.hypot(b.x - a.x, b.y - a.y); const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    const last = (pinch as typeof pinch & { last?: { distance: number; center: { x: number; y: number } } }).last
    if (last) {
      const viewport = viewportRef.current; const scale = Math.max(.8, Math.min(1.25, distance / last.distance)); const nextZoom = Math.max(5, Math.min(52, viewport.zoom * scale))
      viewport.offsetX = center.x - (last.center.x - viewport.offsetX) * (nextZoom / viewport.zoom) + center.x - last.center.x
      viewport.offsetY = center.y - (last.center.y - viewport.offsetY) * (nextZoom / viewport.zoom) + center.y - last.center.y
      viewport.zoom = nextZoom; requestRender()
    }
    ;(pinch as typeof pinch & { last?: { distance: number; center: { x: number; y: number } } }).last = { distance, center }
  }

  useImperativeHandle(ref, () => ({
    undo() { const stroke = undoRef.current.pop(); if (!stroke) return; stroke.forEach(([index, before]) => before ? cellsRef.current.set(index, before) : cellsRef.current.delete(index)); redoRef.current.push(stroke); updateHistory(); requestRender(); commit() },
    redo() { const stroke = redoRef.current.pop(); if (!stroke) return; stroke.forEach(([index,, after]) => after ? cellsRef.current.set(index, after) : cellsRef.current.delete(index)); undoRef.current.push(stroke); updateHistory(); requestRender(); commit() },
    zoomBy(factor) { const canvas = canvasRef.current; if (!canvas) return; const rect = canvas.getBoundingClientRect(); const viewport = viewportRef.current; const nextZoom = Math.max(5, Math.min(52, viewport.zoom * factor)); viewport.offsetX = rect.width / 2 - (rect.width / 2 - viewport.offsetX) * nextZoom / viewport.zoom; viewport.offsetY = rect.height / 2 - (rect.height / 2 - viewport.offsetY) * nextZoom / viewport.zoom; viewport.zoom = nextZoom; requestRender(); commit() },
  }))

  return <canvas ref={canvasRef} className="hue-canvas-surface" onWheel={(event) => { event.preventDefault(); const viewport = viewportRef.current; const factor = event.deltaY > 0 ? .88 : 1.14; const nextZoom = Math.max(5, Math.min(52, viewport.zoom * factor)); const point = pointFor(event); viewport.offsetX = point.x - (point.x - viewport.offsetX) * nextZoom / viewport.zoom; viewport.offsetY = point.y - (point.y - viewport.offsetY) * nextZoom / viewport.zoom; viewport.zoom = nextZoom; requestRender(); commit() }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); const point = pointFor(event); pointersRef.current.set(event.pointerId, point); if (pointersRef.current.size === 1) { strokeRef.current.clear(); lastCellRef.current = null; paintTo(point) } else pinch() }} onPointerMove={(event) => { const point = pointFor(event); const previous = pointersRef.current.get(event.pointerId); pointersRef.current.set(event.pointerId, point); if (pointersRef.current.size >= 2) { pinch(); return } if (!previous) return; if (tool === 'pan') { viewportRef.current.offsetX += point.x - previous.x; viewportRef.current.offsetY += point.y - previous.y; requestRender() } else paintTo(point) }} onPointerUp={(event) => { pointersRef.current.delete(event.pointerId); delete (pinch as typeof pinch & { last?: unknown }).last; if (!pointersRef.current.size) finishStroke() }} onPointerCancel={(event) => { pointersRef.current.delete(event.pointerId); delete (pinch as typeof pinch & { last?: unknown }).last; if (!pointersRef.current.size) finishStroke() }} />
})
