import { describe, expect, it } from 'vitest'

import { HUE_CANVAS_PROTOTYPE_DB_NAME, HUE_CANVAS_PROTOTYPE_STORE_NAME } from '@/lib/hueCanvasStorage'

describe('Hue Canvas prototype storage boundary', () => {
  it('uses a dedicated database rather than the daily-record and sync-retry cache', () => {
    expect(HUE_CANVAS_PROTOTYPE_DB_NAME).toBe('hue-canvas-prototype')
    expect(HUE_CANVAS_PROTOTYPE_DB_NAME).not.toBe('colorwalk-cache')
    expect(HUE_CANVAS_PROTOTYPE_STORE_NAME).toBe('recipes')
  })
})
