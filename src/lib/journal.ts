import type { Locale } from '@/types'
import { type ColorFamily, getColorFamily } from '@/lib/colors'

const prompts: Record<ColorFamily, Record<Locale, string[]>> = {
  red: {
    ko: ['이 색을 봤을 때 가장 먼저 온 감정은 뭐였나요?', '오늘 나를 조금 움직이게 한 순간은 언제였나요?'],
    en: ['What feeling arrived first when you saw this color?', 'What gave you a little spark today?'],
  },
  orange: {
    ko: ['오늘 하루에서 가장 따뜻했던 장면을 적어볼까요?', '이 색에 붙여주고 싶은 별명은 무엇인가요?'],
    en: ['What was the warmest moment of your day?', 'What nickname would you give this color?'],
  },
  yellow: {
    ko: ['오늘 작게 웃었던 순간을 떠올려볼까요?', '이 색은 어떤 소리와 닮았나요?'],
    en: ['Remember a tiny moment that made you smile.', 'What sound does this color remind you of?'],
  },
  green: {
    ko: ['오늘 나를 편하게 만든 것은 무엇이었나요?', '이 색을 어디에 오래 두고 싶나요?'],
    en: ['What made you feel settled today?', 'Where would you keep this color for a while?'],
  },
  blue: {
    ko: ['오늘 마음이 조용해진 순간이 있었나요?', '이 색은 어떤 날씨와 어울리나요?'],
    en: ['Was there a moment when your mind got quiet?', 'What weather belongs with this color?'],
  },
  purple: {
    ko: ['오늘 조금 특별하게 느껴진 장면을 기록해요.', '이 색이 노래라면 어떤 분위기일까요?'],
    en: ['Capture something that felt a little special today.', 'If this color were a song, what mood would it have?'],
  },
  pink: {
    ko: ['오늘 다정하다고 느낀 순간을 적어봐요.', '이 색으로 누군가에게 어떤 말을 건네고 싶나요?'],
    en: ['Write down a tender moment from today.', 'What would this color say to someone?'],
  },
  neutral: {
    ko: ['오늘의 온도를 한 문장으로 남겨봐요.', '조용하지만 기억하고 싶은 순간은 무엇인가요?'],
    en: ["Leave today's temperature in one sentence.", 'What quiet moment do you want to remember?'],
  },
}

export function getJournalPrompt(hex: string, locale: Locale, seed = new Date()) {
  const family = getColorFamily(hex)
  const options = prompts[family][locale]
  const index = Math.abs(seed.getDate() + seed.getMonth() + hex.charCodeAt(1)) % options.length

  return options[index]
}
