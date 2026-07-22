import { cn } from '@/lib/utils'

type HuedayWordmarkProps = {
  className?: string
}

export function HuedayWordmark({ className }: HuedayWordmarkProps) {
  return (
    <span className={cn('hueday-wordmark', className)} aria-label="Hueday">
      <img src="/brand/hueday-wordmark.png" alt="Hueday" draggable={false} />
    </span>
  )
}
