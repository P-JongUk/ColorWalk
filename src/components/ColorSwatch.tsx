import { getReadableTextColor } from '@/lib/colors'
import { cn } from '@/lib/utils'

type ColorSwatchProps = {
  hex: string
  label?: string
  className?: string
  showHex?: boolean
}

export function ColorSwatch({ hex, label, className, showHex = true }: ColorSwatchProps) {
  return (
    <div
      className={cn('flex min-h-20 flex-col justify-end rounded-[16px] p-3 shadow-sm', className)}
      style={{
        backgroundColor: hex,
        color: getReadableTextColor(hex),
      }}
    >
      {label ? <span className="text-xs font-semibold opacity-85">{label}</span> : null}
      {showHex ? <span className="font-mono text-sm font-bold">{hex}</span> : null}
    </div>
  )
}
