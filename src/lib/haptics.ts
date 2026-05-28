import { Haptics, ImpactStyle } from '@capacitor/haptics'

export async function pulseForMatch(matchRate: number) {
  if (matchRate < 90) return

  try {
    if (matchRate >= 95) {
      await Haptics.impact({ style: ImpactStyle.Heavy })
      window.setTimeout(() => void Haptics.impact({ style: ImpactStyle.Light }), 120)
      return
    }

    await Haptics.impact({ style: ImpactStyle.Light })
  } catch {
    if ('vibrate' in navigator) {
      navigator.vibrate(matchRate >= 95 ? [45, 80, 60] : 25)
    }
  }
}
