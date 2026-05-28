import { MapPin } from 'lucide-react'

import { ColorWalkMark } from '@/components/ColorWalkMark'
import { t } from '@/lib/i18n'
import type { Locale, Mission } from '@/types'

type ReceiptCardProps = {
  locale: Locale
  mission: Mission
  capturedHex: string
  matchRate: number
  colorName?: string
  journalAnswer?: string
  locationName?: string
  dateLabel?: string
}

export function ReceiptCard({
  locale,
  mission,
  capturedHex,
  matchRate,
  colorName,
  journalAnswer,
  locationName,
  dateLabel = new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date()),
}: ReceiptCardProps) {
  const displayName = colorName?.trim() || mission.label[locale]

  return (
    <article className="ticket-edge receipt-card-v2">
      <div className="receipt-topline">
        <div>
          <p>{t(locale, 'receipt')}</p>
          <h3>{displayName}</h3>
        </div>
        <div className="receipt-stamp">
          <MapPin aria-hidden="true" />
          <span>COLOR WALK</span>
        </div>
      </div>

      <div className="receipt-rows">
        <div>
          <span>DATE</span>
          <strong>{dateLabel}</strong>
        </div>
        <div>
          <span>MISSION</span>
          <b style={{ backgroundColor: mission.hex }} />
          <strong>{mission.label[locale]}</strong>
          <em>{mission.hex}</em>
        </div>
        <div>
          <span>FOUND</span>
          <b style={{ backgroundColor: capturedHex }} />
          <strong>{displayName}</strong>
          <em>{capturedHex}</em>
        </div>
        <div>
          <span>MATCH RATE</span>
          <strong>{matchRate}%</strong>
        </div>
        {locationName ? (
          <div>
            <span>PLACE</span>
            <strong>{locationName}</strong>
          </div>
        ) : null}
      </div>

      <div className="receipt-bottom">
        <div className="receipt-barcode" aria-hidden="true">
          {Array.from({ length: 38 }).map((_, index) => (
            <i key={index} style={{ width: `${index % 7 === 0 ? 4 : index % 3 === 0 ? 2 : 1}px` }} />
          ))}
        </div>
        <ColorWalkMark compact />
      </div>

      {journalAnswer ? <p className="receipt-note">{journalAnswer}</p> : null}
    </article>
  )
}
