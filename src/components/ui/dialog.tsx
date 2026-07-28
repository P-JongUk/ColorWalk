import * as React from 'react'

import { cn } from '@/lib/utils'

type HuedayDialogProps = {
  open: boolean
  onClose: () => void
  titleId: string
  title: React.ReactNode
  closeLabel: string
  children: React.ReactNode
  className?: string
}

/**
 * Minimal native-<dialog> wrapper shared by camera preview and confirmation
 * flows. Native <dialog> already gives focus containment and top-layer
 * stacking; this component adds entry focus, Escape close (native default),
 * and trigger-focus restore so call sites do not each reimplement it.
 */
export function HuedayDialog({ open, onClose, titleId, title, closeLabel, children, className }: HuedayDialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const triggerFocusRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      triggerFocusRef.current = document.activeElement as HTMLElement | null
      dialog.showModal()
      // Move entry focus to a meaningful, always-present first action
      // instead of relying on the browser's dialog-element fallback focus.
      closeButtonRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    function handleClose() {
      onClose()
      triggerFocusRef.current?.focus?.()
    }

    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  return (
    <dialog ref={dialogRef} className={cn('hd-dialog', className)} aria-labelledby={titleId}>
      <div className="hd-dialog-body">
        <button ref={closeButtonRef} type="button" className="hd-dialog-close" onClick={() => dialogRef.current?.close()} aria-label={closeLabel}>
          ×
        </button>
        <h2 id={titleId} className="hd-dialog-title">{title}</h2>
        {children}
      </div>
    </dialog>
  )
}
