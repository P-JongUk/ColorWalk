import { describe, expect, it } from 'vitest'

import { exportTimestampFilename, shareDialogCopy } from '@/lib/shareImage'

describe('shareImage helpers', () => {
  it('builds a timestamped PNG filename from a prefix', () => {
    const filename = exportTimestampFilename('hueday-hueprint')
    expect(filename.startsWith('hueday-hueprint-')).toBe(true)
    expect(filename.endsWith('.png')).toBe(true)
  })

  it('builds locale-appropriate share dialog copy for download vs share', () => {
    const download = shareDialogCopy('ko', 'Hueprint', 'download')
    const share = shareDialogCopy('en', 'Hueprint', 'share')
    expect(download.title).toBe('Hueprint')
    expect(download.dialogTitle).toContain('저장')
    expect(share.dialogTitle.toLowerCase()).toContain('share')
  })
})
