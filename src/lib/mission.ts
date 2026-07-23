import type { Locale, Mission, TimeBucket, WeatherGroup } from '@/types'

const missionMap: Record<WeatherGroup, Record<TimeBucket, Omit<Mission, 'source' | 'weatherCode'>>> = {
  clear: {
    morning: {
      id: 'clear-morning',
      hex: '#F6C56F',
      weatherGroup: 'clear',
      timeBucket: 'morning',
      label: { ko: '햇살 버터', en: 'Sunlit Butter' },
      prompt: { ko: '아침빛이 살짝 묻은 물건을 찾아봐요.', en: 'Find something touched by morning light.' },
      hint: { ko: '맑음 · 아침', en: 'Clear · Morning' },
    },
    day: {
      id: 'clear-day',
      hex: '#8BC6E8',
      weatherGroup: 'clear',
      timeBucket: 'day',
      label: { ko: '가벼운 하늘', en: 'Easy Sky' },
      prompt: { ko: '오늘 하늘처럼 가벼운 파랑을 찾아봐요.', en: 'Look for a blue that feels open and easy.' },
      hint: { ko: '맑음 · 낮', en: 'Clear · Day' },
    },
    sunset: {
      id: 'clear-sunset',
      hex: '#F39A7A',
      weatherGroup: 'clear',
      timeBucket: 'sunset',
      label: { ko: '피치 아워', en: 'Peach Hour' },
      prompt: { ko: '하루가 부드럽게 접히는 색을 찾아봐요.', en: 'Find a color that folds the day softly.' },
      hint: { ko: '맑음 · 노을', en: 'Clear · Sunset' },
    },
    night: {
      id: 'clear-night',
      hex: '#303A59',
      weatherGroup: 'clear',
      timeBucket: 'night',
      label: { ko: '밤공기 잉크', en: 'Night Ink' },
      prompt: { ko: '조용한 밤공기처럼 깊은 색을 찾아봐요.', en: 'Find a deep color that feels like quiet air.' },
      hint: { ko: '맑음 · 밤', en: 'Clear · Night' },
    },
  },
  clouds: {
    morning: {
      id: 'clouds-morning',
      hex: '#D7CFC1',
      weatherGroup: 'clouds',
      timeBucket: 'morning',
      label: { ko: '구름 우유', en: 'Cloud Milk' },
      prompt: { ko: '포근한 회색빛이 도는 색을 찾아봐요.', en: 'Find a soft color with a cloudy hush.' },
      hint: { ko: '흐림 · 아침', en: 'Cloudy · Morning' },
    },
    day: {
      id: 'clouds-day',
      hex: '#B9C4BE',
      weatherGroup: 'clouds',
      timeBucket: 'day',
      label: { ko: '창밖 세이지', en: 'Window Sage' },
      prompt: { ko: '차분하지만 지루하지 않은 색을 찾아봐요.', en: 'Look for something calm but not plain.' },
      hint: { ko: '흐림 · 낮', en: 'Cloudy · Day' },
    },
    sunset: {
      id: 'clouds-sunset',
      hex: '#CFA7A3',
      weatherGroup: 'clouds',
      timeBucket: 'sunset',
      label: { ko: '말랑 로즈', en: 'Soft Rose' },
      prompt: { ko: '구름 뒤에 숨어 있는 분홍빛을 찾아봐요.', en: 'Find a rose tone hiding behind the clouds.' },
      hint: { ko: '흐림 · 노을', en: 'Cloudy · Sunset' },
    },
    night: {
      id: 'clouds-night',
      hex: '#545965',
      weatherGroup: 'clouds',
      timeBucket: 'night',
      label: { ko: '담요 회색', en: 'Blanket Gray' },
      prompt: { ko: '오늘 밤을 덮어주는 회색을 찾아봐요.', en: 'Find a gray that feels like a blanket.' },
      hint: { ko: '흐림 · 밤', en: 'Cloudy · Night' },
    },
  },
  rain: {
    morning: {
      id: 'rain-morning',
      hex: '#5F7F83',
      weatherGroup: 'rain',
      timeBucket: 'morning',
      label: { ko: '비 오는 창가', en: 'Rainy Window' },
      prompt: { ko: '물기 어린 차분한 색을 찾아봐요.', en: 'Find a calm color with a little rain in it.' },
      hint: { ko: '비 · 아침', en: 'Rain · Morning' },
    },
    day: {
      id: 'rain-day',
      hex: '#647E6F',
      weatherGroup: 'rain',
      timeBucket: 'day',
      label: { ko: '젖은 잎사귀', en: 'Wet Leaf' },
      prompt: { ko: '비를 머금은 초록을 찾아봐요.', en: 'Look for a green that has held the rain.' },
      hint: { ko: '비 · 낮', en: 'Rain · Day' },
    },
    sunset: {
      id: 'rain-sunset',
      hex: '#986F6D',
      weatherGroup: 'rain',
      timeBucket: 'sunset',
      label: { ko: '젖은 코랄', en: 'Washed Coral' },
      prompt: { ko: '조금 흐려져서 더 예쁜 코랄을 찾아봐요.', en: 'Find a coral softened by the weather.' },
      hint: { ko: '비 · 노을', en: 'Rain · Sunset' },
    },
    night: {
      id: 'rain-night',
      hex: '#2F4F4F',
      weatherGroup: 'rain',
      timeBucket: 'night',
      label: { ko: '빗방울 딥틸', en: 'Deep Rain Teal' },
      prompt: { ko: '우산 속 빗방울과 어울리는 색을 찾아봐요.', en: 'Find a shade that belongs on a wet umbrella.' },
      hint: { ko: '비 · 밤', en: 'Rain · Night' },
    },
  },
  snow: {
    morning: {
      id: 'snow-morning',
      hex: '#E6EEF0',
      weatherGroup: 'snow',
      timeBucket: 'morning',
      label: { ko: '첫눈 우윳빛', en: 'First Snow' },
      prompt: { ko: '하얗지만 따뜻한 색을 찾아봐요.', en: 'Find a white that still feels warm.' },
      hint: { ko: '눈 · 아침', en: 'Snow · Morning' },
    },
    day: {
      id: 'snow-day',
      hex: '#C9DDE6',
      weatherGroup: 'snow',
      timeBucket: 'day',
      label: { ko: '눈빛 하늘', en: 'Snow Sky' },
      prompt: { ko: '차갑고 맑은 파스텔을 찾아봐요.', en: 'Find a pastel that feels crisp and bright.' },
      hint: { ko: '눈 · 낮', en: 'Snow · Day' },
    },
    sunset: {
      id: 'snow-sunset',
      hex: '#E7B9A8',
      weatherGroup: 'snow',
      timeBucket: 'sunset',
      label: { ko: '살구 눈빛', en: 'Apricot Snow' },
      prompt: { ko: '차가운 공기 위에 얹힌 살구빛을 찾아봐요.', en: 'Find an apricot glow on something cool.' },
      hint: { ko: '눈 · 노을', en: 'Snow · Sunset' },
    },
    night: {
      id: 'snow-night',
      hex: '#667385',
      weatherGroup: 'snow',
      timeBucket: 'night',
      label: { ko: '눈길 그림자', en: 'Snow Shadow' },
      prompt: { ko: '눈 내린 밤의 그림자 색을 찾아봐요.', en: 'Find the shadow color of a snowy night.' },
      hint: { ko: '눈 · 밤', en: 'Snow · Night' },
    },
  },
  storm: {
    morning: {
      id: 'storm-morning',
      hex: '#68707E',
      weatherGroup: 'storm',
      timeBucket: 'morning',
      label: { ko: '먹구름 실버', en: 'Storm Silver' },
      prompt: { ko: '흔들리지 않는 단단한 색을 찾아봐요.', en: 'Find a color that stays steady.' },
      hint: { ko: '폭풍 · 아침', en: 'Storm · Morning' },
    },
    day: {
      id: 'storm-day',
      hex: '#4F6670',
      weatherGroup: 'storm',
      timeBucket: 'day',
      label: { ko: '천둥 틸', en: 'Thunder Teal' },
      prompt: { ko: '짙지만 생기가 있는 색을 찾아봐요.', en: 'Find a dark color with a pulse.' },
      hint: { ko: '폭풍 · 낮', en: 'Storm · Day' },
    },
    sunset: {
      id: 'storm-sunset',
      hex: '#8A656E',
      weatherGroup: 'storm',
      timeBucket: 'sunset',
      label: { ko: '번개 로즈', en: 'Lightning Rose' },
      prompt: { ko: '조금 드라마틱한 장밋빛을 찾아봐요.', en: 'Find a rose with a little drama.' },
      hint: { ko: '폭풍 · 노을', en: 'Storm · Sunset' },
    },
    night: {
      id: 'storm-night',
      hex: '#252D3C',
      weatherGroup: 'storm',
      timeBucket: 'night',
      label: { ko: '눈길 번개', en: 'Afterstorm' },
      prompt: { ko: '깊고 선명한 밤색을 찾아봐요.', en: 'Find a night color with sharp edges.' },
      hint: { ko: '폭풍 · 밤', en: 'Storm · Night' },
    },
  },
  fog: {
    morning: {
      id: 'fog-morning',
      hex: '#D8D6CC',
      weatherGroup: 'fog',
      timeBucket: 'morning',
      label: { ko: '안개 리넨', en: 'Fog Linen' },
      prompt: { ko: '흐릿해서 더 부드러운 색을 찾아봐요.', en: 'Find a color softened by haze.' },
      hint: { ko: '안개 · 아침', en: 'Fog · Morning' },
    },
    day: {
      id: 'fog-day',
      hex: '#C8D3CF',
      weatherGroup: 'fog',
      timeBucket: 'day',
      label: { ko: '흐린 민트', en: 'Hazy Mint' },
      prompt: { ko: '선명하지 않아도 기분 좋은 민트를 찾아봐요.', en: 'Find a mint that does not need to shout.' },
      hint: { ko: '안개 · 낮', en: 'Fog · Day' },
    },
    sunset: {
      id: 'fog-sunset',
      hex: '#D0AFA3',
      weatherGroup: 'fog',
      timeBucket: 'sunset',
      label: { ko: '필터 살몬', en: 'Filtered Salmon' },
      prompt: { ko: '필름처럼 흐린 노을색을 찾아봐요.', en: 'Find a sunset color with a film-soft blur.' },
      hint: { ko: '안개 · 노을', en: 'Fog · Sunset' },
    },
    night: {
      id: 'fog-night',
      hex: '#60646B',
      weatherGroup: 'fog',
      timeBucket: 'night',
      label: { ko: '안개 그림자', en: 'Fog Shadow' },
      prompt: { ko: '경계가 부드러운 밤색을 찾아봐요.', en: 'Find a night color with soft edges.' },
      hint: { ko: '안개 · 밤', en: 'Fog · Night' },
    },
  },
}

type MissionCore = Omit<Mission, 'source' | 'weatherCode'>
type MissionVariant = Pick<MissionCore, 'id' | 'hex' | 'label' | 'prompt'>

const missionVariants: Partial<Record<WeatherGroup, Partial<Record<TimeBucket, MissionVariant[]>>>> = {
  clear: {
    morning: [
      {
        id: 'clear-morning-window-honey',
        hex: '#F7C874',
        label: { ko: '창문에 번진 꿀빛', en: 'Window Honey' },
        prompt: { ko: '아침 창가에 살짝 녹아든 노란빛을 찾아봐요.', en: 'Find a yellow glow melting into the morning window.' },
      },
      {
        id: 'clear-morning-school-lemon',
        hex: '#F3D46D',
        label: { ko: '등굣길 레몬 햇살', en: 'School-Run Lemon' },
        prompt: { ko: '하루가 막 시작될 때 반짝이는 레몬빛을 찾아봐요.', en: 'Look for a lemon tone that feels like the day just started.' },
      },
    ],
    day: [
      {
        id: 'clear-day-rooftop-sky',
        hex: '#8FD0EE',
        label: { ko: '옥상 위 숨은 하늘', en: 'Rooftop Sky' },
        prompt: { ko: '눈높이보다 조금 높은 곳에 숨어 있는 파랑을 찾아봐요.', en: 'Find a blue hiding a little above eye level.' },
      },
      {
        id: 'clear-day-glass-blue',
        hex: '#A5D9ED',
        label: { ko: '유리컵에 담긴 낮', en: 'Glass Daylight' },
        prompt: { ko: '투명하고 깨끗한 낮의 색을 주변에서 찾아봐요.', en: 'Find a clean daylight color that feels almost transparent.' },
      },
    ],
    sunset: [
      {
        id: 'clear-sunset-alley-coral',
        hex: '#F18274',
        label: { ko: '저녁 골목 코랄', en: 'Alley Coral' },
        prompt: { ko: '노을이 골목 끝에 잠깐 남긴 코랄을 찾아봐요.', en: 'Find a coral the sunset left at the end of the street.' },
      },
      {
        id: 'clear-sunset-peach-shadow',
        hex: '#F4A082',
        label: { ko: '복숭아 그림자', en: 'Peach Shadow' },
        prompt: { ko: '따뜻하지만 살짝 그림자가 섞인 복숭아빛을 찾아봐요.', en: 'Find a peach shade with a little shadow tucked inside.' },
      },
    ],
    night: [
      {
        id: 'clear-night-before-dawn',
        hex: '#2E3655',
        label: { ko: '새벽 전 잉크블루', en: 'Before-Dawn Ink' },
        prompt: { ko: '아직 잠들지 않은 밤의 잉크빛을 찾아봐요.', en: 'Find an ink blue that has not quite fallen asleep.' },
      },
      {
        id: 'clear-night-window-navy',
        hex: '#343754',
        label: { ko: '불 꺼진 창문 남색', en: 'Quiet Window Navy' },
        prompt: { ko: '조용한 창문처럼 깊고 차분한 남색을 찾아봐요.', en: 'Look for a navy as quiet as a dark window.' },
      },
    ],
  },
  clouds: {
    morning: [
      {
        id: 'clouds-morning-oat-mist',
        hex: '#D9D1C3',
        label: { ko: '오트밀 안개빛', en: 'Oat Mist' },
        prompt: { ko: '부드러운 아침 공기처럼 흐린 베이지를 찾아봐요.', en: 'Find a cloudy beige as soft as morning air.' },
      },
      {
        id: 'clouds-morning-paper-cream',
        hex: '#E1D8C9',
        label: { ko: '접힌 편지 크림', en: 'Folded Letter Cream' },
        prompt: { ko: '새 종이보다 조금 더 따뜻한 크림색을 찾아봐요.', en: 'Find a cream warmer than a fresh sheet of paper.' },
      },
    ],
    day: [
      {
        id: 'clouds-day-balcony-sage',
        hex: '#AFC4B7',
        label: { ko: '베란다 세이지', en: 'Balcony Sage' },
        prompt: { ko: '흐린 낮에도 싱그러움이 남아 있는 세이지를 찾아봐요.', en: 'Find a sage that still feels fresh on a cloudy day.' },
      },
      {
        id: 'clouds-day-quiet-mint',
        hex: '#BFD1C9',
        label: { ko: '말수 적은 민트', en: 'Soft-Spoken Mint' },
        prompt: { ko: '튀지 않지만 계속 보고 싶은 민트빛을 찾아봐요.', en: 'Look for a mint that stays quiet but keeps your eye.' },
      },
    ],
    sunset: [
      {
        id: 'clouds-sunset-filter-rose',
        hex: '#D4A19B',
        label: { ko: '필름 속 로즈빛', en: 'Film Rose' },
        prompt: { ko: '필름 사진처럼 살짝 흐린 장밋빛을 찾아봐요.', en: 'Find a rose tone with a soft film-photo blur.' },
      },
      {
        id: 'clouds-sunset-cotton-coral',
        hex: '#DBADA2',
        label: { ko: '솜구름 코랄', en: 'Cotton Cloud Coral' },
        prompt: { ko: '구름 사이에 남은 말랑한 코랄을 찾아봐요.', en: 'Find a soft coral caught between the clouds.' },
      },
    ],
    night: [
      {
        id: 'clouds-night-hoodie-gray',
        hex: '#59606A',
        label: { ko: '후드집업 그림자', en: 'Hoodie Shadow' },
        prompt: { ko: '편하게 걸친 옷처럼 차분한 회색을 찾아봐요.', en: 'Find a gray as easy as a favorite hoodie.' },
      },
      {
        id: 'clouds-night-soft-asphalt',
        hex: '#4E565F',
        label: { ko: '젖기 전 아스팔트', en: 'Almost-Rain Asphalt' },
        prompt: { ko: '비 오기 직전의 길처럼 묵직한 회색을 찾아봐요.', en: 'Find a heavy gray like the street just before rain.' },
      },
    ],
  },
  rain: {
    morning: [
      {
        id: 'rain-morning-bus-window',
        hex: '#6F8C90',
        label: { ko: '버스 창문 물빛', en: 'Bus Window Blue' },
        prompt: { ko: '물방울 너머로 흐릿해진 파란빛을 찾아봐요.', en: 'Find a blue blurred through drops on a window.' },
      },
      {
        id: 'rain-morning-umbrella-teal',
        hex: '#5C7880',
        label: { ko: '우산 안쪽 틸', en: 'Inside-Umbrella Teal' },
        prompt: { ko: '우산 아래에서 더 깊어지는 틸색을 찾아봐요.', en: 'Find a teal that gets deeper under an umbrella.' },
      },
    ],
    day: [
      {
        id: 'rain-day-wet-moss',
        hex: '#5F7C68',
        label: { ko: '비 머금은 이끼', en: 'Rain-Soaked Moss' },
        prompt: { ko: '물기를 머금고 진해진 초록을 찾아봐요.', en: 'Look for a green made richer by rain.' },
      },
      {
        id: 'rain-day-puddle-sage',
        hex: '#789080',
        label: { ko: '웅덩이에 비친 세이지', en: 'Puddle Sage' },
        prompt: { ko: '젖은 바닥에 비친 차분한 초록빛을 찾아봐요.', en: 'Find a calm green reflected on the wet ground.' },
      },
    ],
    sunset: [
      {
        id: 'rain-sunset-washed-peach',
        hex: '#B77A74',
        label: { ko: '비에 씻긴 피치', en: 'Rain-Washed Peach' },
        prompt: { ko: '비가 한 겹 씻어낸 듯한 피치빛을 찾아봐요.', en: 'Find a peach tone softened by rain.' },
      },
      {
        id: 'rain-sunset-umbrella-rose',
        hex: '#A97178',
        label: { ko: '우산 끝 로즈', en: 'Umbrella-Tip Rose' },
        prompt: { ko: '젖은 손잡이와 어울리는 로즈빛을 찾아봐요.', en: 'Find a rose that belongs near a wet umbrella handle.' },
      },
    ],
    night: [
      {
        id: 'rain-night-neon-teal',
        hex: '#315B5E',
        label: { ko: '네온 아래 빗물틸', en: 'Neon Rain Teal' },
        prompt: { ko: '가로등 아래 반짝이는 짙은 틸을 찾아봐요.', en: 'Find a dark teal glinting under streetlights.' },
      },
      {
        id: 'rain-night-wet-navy',
        hex: '#283F46',
        label: { ko: '젖은 밤 남청', en: 'Wet Night Navy' },
        prompt: { ko: '비 때문에 더 깊어진 밤색을 찾아봐요.', en: 'Find a night color made deeper by rain.' },
      },
    ],
  },
  snow: {
    morning: [
      {
        id: 'snow-morning-milk-glass',
        hex: '#EFF3F0',
        label: { ko: '우유 유리창', en: 'Milk Glass' },
        prompt: { ko: '차갑지만 투명하게 빛나는 흰색을 찾아봐요.', en: 'Find a cold white that still shines softly.' },
      },
      {
        id: 'snow-morning-cream-snow',
        hex: '#ECE8DB',
        label: { ko: '크림 묻은 첫눈', en: 'Cream-Touched Snow' },
        prompt: { ko: '완전한 흰색보다 조금 더 따뜻한 눈빛을 찾아봐요.', en: 'Find a snowy white with a little warmth in it.' },
      },
    ],
    day: [
      {
        id: 'snow-day-ice-blue',
        hex: '#BED9E8',
        label: { ko: '얼음컵 하늘', en: 'Ice-Cup Sky' },
        prompt: { ko: '맑고 차가운 유리 같은 파랑을 찾아봐요.', en: 'Find a blue as clear and cold as glass.' },
      },
      {
        id: 'snow-day-frost-mint',
        hex: '#D5E7E5',
        label: { ko: '서리 낀 민트', en: 'Frosted Mint' },
        prompt: { ko: '손끝이 살짝 시린 민트빛을 찾아봐요.', en: 'Find a mint that feels cool at your fingertips.' },
      },
    ],
    sunset: [
      {
        id: 'snow-sunset-apricot-breath',
        hex: '#EAB29E',
        label: { ko: '입김 위 살구빛', en: 'Apricot Breath' },
        prompt: { ko: '차가운 공기 위에 얹힌 살구빛을 찾아봐요.', en: 'Find an apricot glow floating over cold air.' },
      },
      {
        id: 'snow-sunset-winter-coral',
        hex: '#E3A8A0',
        label: { ko: '겨울 코랄 스카프', en: 'Winter Coral Scarf' },
        prompt: { ko: '추운 날 더 선명해지는 코랄을 찾아봐요.', en: 'Find a coral that feels brighter in the cold.' },
      },
    ],
    night: [
      {
        id: 'snow-night-blue-shadow',
        hex: '#5C6E83',
        label: { ko: '눈길의 푸른 그림자', en: 'Blue Snow Shadow' },
        prompt: { ko: '눈 위에 길게 내려앉은 푸른 그림자를 찾아봐요.', en: 'Find a blue shadow stretched over snow.' },
      },
      {
        id: 'snow-night-cold-slate',
        hex: '#6B7483',
        label: { ko: '차가운 슬레이트 밤', en: 'Cold Slate Night' },
        prompt: { ko: '차갑지만 부드러운 회청색을 찾아봐요.', en: 'Find a cool slate tone with a soft edge.' },
      },
    ],
  },
  storm: {
    morning: [
      {
        id: 'storm-morning-metal-cloud',
        hex: '#717886',
        label: { ko: '금속빛 먹구름', en: 'Metal Cloud' },
        prompt: { ko: '빛을 조금 머금은 단단한 회색을 찾아봐요.', en: 'Find a firm gray with a little light in it.' },
      },
      {
        id: 'storm-morning-quiet-steel',
        hex: '#656E7A',
        label: { ko: '조용한 스틸블루', en: 'Quiet Steel Blue' },
        prompt: { ko: '폭풍 전 조용히 가라앉은 푸른 회색을 찾아봐요.', en: 'Find a blue-gray that settles before the storm.' },
      },
    ],
    day: [
      {
        id: 'storm-day-deep-harbor',
        hex: '#465F69',
        label: { ko: '깊은 항구 틸', en: 'Deep Harbor Teal' },
        prompt: { ko: '짙은데 생기가 남아 있는 틸색을 찾아봐요.', en: 'Find a dark teal that still has a pulse.' },
      },
      {
        id: 'storm-day-slate-green',
        hex: '#536D6C',
        label: { ko: '번개 전 슬레이트그린', en: 'Pre-Lightning Slate' },
        prompt: { ko: '녹색과 회색 사이에서 흔들리는 색을 찾아봐요.', en: 'Find a color wavering between green and gray.' },
      },
    ],
    sunset: [
      {
        id: 'storm-sunset-dramatic-mauve',
        hex: '#946A73',
        label: { ko: '드라마틱 모브', en: 'Dramatic Mauve' },
        prompt: { ko: '오늘을 영화처럼 보이게 하는 모브빛을 찾아봐요.', en: 'Find a mauve that makes today feel cinematic.' },
      },
      {
        id: 'storm-sunset-smoked-rose',
        hex: '#805F6B',
        label: { ko: '연기 묻은 로즈', en: 'Smoked Rose' },
        prompt: { ko: '장밋빛에 어두운 연기가 섞인 색을 찾아봐요.', en: 'Find a rose tone with a smoky edge.' },
      },
    ],
    night: [
      {
        id: 'storm-night-blackberry-sky',
        hex: '#273044',
        label: { ko: '블랙베리 밤하늘', en: 'Blackberry Sky' },
        prompt: { ko: '검정에 가까운데 은근히 보랏빛이 도는 색을 찾아봐요.', en: 'Find an almost-black shade with a violet undertone.' },
      },
      {
        id: 'storm-night-afterimage',
        hex: '#202839',
        label: { ko: '번개 잔상 네이비', en: 'Lightning Afterimage' },
        prompt: { ko: '잠깐 번쩍인 뒤 더 깊어진 남색을 찾아봐요.', en: 'Find a navy that feels deeper after a flash.' },
      },
    ],
  },
  fog: {
    morning: [
      {
        id: 'fog-morning-rice-paper',
        hex: '#DDD8CC',
        label: { ko: '한지에 스민 아침', en: 'Rice-Paper Morning' },
        prompt: { ko: '종이에 물이 스민 듯 부드러운 색을 찾아봐요.', en: 'Find a soft color like water sinking into paper.' },
      },
      {
        id: 'fog-morning-wool-linen',
        hex: '#D3D2C6',
        label: { ko: '울니트 리넨빛', en: 'Wool Linen' },
        prompt: { ko: '니트처럼 포근한 흐린 리넨색을 찾아봐요.', en: 'Find a hazy linen tone as cozy as knitwear.' },
      },
    ],
    day: [
      {
        id: 'fog-day-blurred-mint',
        hex: '#C1D3CC',
        label: { ko: '초점 흐린 민트', en: 'Blurred Mint' },
        prompt: { ko: '초점이 살짝 나간 듯한 민트빛을 찾아봐요.', en: 'Find a mint with a gentle out-of-focus softness.' },
      },
      {
        id: 'fog-day-glass-sage',
        hex: '#B9C8C3',
        label: { ko: '안개 낀 유리 세이지', en: 'Fogged Glass Sage' },
        prompt: { ko: '유리 너머로 보이는 차분한 세이지를 찾아봐요.', en: 'Find a sage seen through fogged glass.' },
      },
    ],
    sunset: [
      {
        id: 'fog-sunset-powder-salmon',
        hex: '#D8AA9D',
        label: { ko: '파우더 살몬 노을', en: 'Powder Salmon' },
        prompt: { ko: '노을에 파우더를 얹은 듯한 살몬빛을 찾아봐요.', en: 'Find a salmon sunset dusted with powder.' },
      },
      {
        id: 'fog-sunset-muted-apricot',
        hex: '#D6B39F',
        label: { ko: '소리 낮춘 살구빛', en: 'Muted Apricot' },
        prompt: { ko: '크게 말하지 않아 더 예쁜 살구빛을 찾아봐요.', en: 'Find an apricot tone made prettier by staying quiet.' },
      },
    ],
    night: [
      {
        id: 'fog-night-soft-charcoal',
        hex: '#5B6068',
        label: { ko: '몽글한 차콜 밤', en: 'Soft Charcoal Night' },
        prompt: { ko: '경계가 흐려진 차콜색을 찾아봐요.', en: 'Find a charcoal shade with blurred edges.' },
      },
      {
        id: 'fog-night-hazy-navy',
        hex: '#56606B',
        label: { ko: '안개 낀 남청', en: 'Hazy Navy' },
        prompt: { ko: '선명하지 않아서 더 분위기 있는 남청을 찾아봐요.', en: 'Find a navy made moodier by haze.' },
      },
    ],
  },
}

const missionVariantExpansions: Partial<Record<WeatherGroup, Partial<Record<TimeBucket, MissionVariant[]>>>> = {
  clear: {
    morning: [
      variant('clear-morning-olive-strap', '#8A8F52', '캔버스백 올리브', 'Canvas Bag Olive', '아침 산책길에 오래 들고 다닌 가방 같은 올리브를 찾아봐요.', 'Find an olive tone like a canvas bag on a morning walk.'),
      variant('clear-morning-toast-brown', '#B7895F', '토스트 가장자리 브라운', 'Toast-Edge Brown', '햇살에 살짝 구워진 듯한 갈색을 찾아봐요.', 'Find a brown that feels lightly toasted by the sun.'),
      variant('clear-morning-herb-shadow', '#789260', '허브 그림자 그린', 'Herb Shadow Green', '화분이나 잎사귀 아래 숨어 있는 부드러운 초록을 찾아봐요.', 'Look for a soft green hiding under leaves or pots.'),
      variant('clear-morning-cream-note', '#EAD9B8', '아침 노트 크림', 'Morning Note Cream', '새 하루를 적기 좋은 종이빛 크림을 찾아봐요.', 'Find a paper-cream tone that feels ready for a new day.'),
    ],
    day: [
      variant('clear-day-ginkgo-yellow', '#D8B84E', '은행잎 골드', 'Ginkgo Gold', '맑은 낮에 가장 눈에 걸리는 따뜻한 노랑을 담아봐요.', 'Capture a warm yellow that catches your eye on a clear day.'),
      variant('clear-day-park-bench', '#9C7753', '공원 벤치 우드', 'Park Bench Wood', '햇볕을 받은 나무 벤치 같은 갈색을 찾아봐요.', 'Find a brown like a sunlit wooden bench.'),
      variant('clear-day-river-sage', '#8EA58A', '강변 세이지', 'Riverside Sage', '물가 근처에서 차분하게 식은 세이지빛을 찾아봐요.', 'Find a calm sage tone cooled near water.'),
      variant('clear-day-white-shirt', '#F3EBDD', '말린 셔츠 아이보리', 'Sun-Dried Ivory', '햇빛에 잘 마른 셔츠처럼 깨끗한 아이보리를 찾아봐요.', 'Find a clean ivory like a shirt dried in sunlight.'),
    ],
    sunset: [
      variant('clear-sunset-bark-glow', '#9E6C4C', '노을 묻은 나무결', 'Sunset Woodgrain', '나무결 위에 노을이 얹힌 듯한 따뜻한 갈색을 찾아봐요.', 'Find warm brown like sunset resting on woodgrain.'),
      variant('clear-sunset-olive-afterlight', '#7F8743', '저녁빛 올리브', 'Afterlight Olive', '노을을 지나 조금 깊어진 올리브색을 찾아봐요.', 'Find an olive tone deepened by afterlight.'),
      variant('clear-sunset-brick-rose', '#B16E5D', '낡은 벽돌 로즈', 'Old Brick Rose', '골목 벽돌처럼 오래 머문 장밋빛을 찾아봐요.', 'Find a rose tone that lingers like old brick.'),
      variant('clear-sunset-kraft-ticket', '#C89B68', '산책 티켓 크래프트', 'Walk Ticket Kraft', '작은 티켓 종이처럼 손에 잡히는 크래프트색을 찾아봐요.', 'Find a kraft-paper tone that feels like a tiny walking ticket.'),
    ],
    night: [
      variant('clear-night-walnut-shadow', '#4B372A', '월넛 그림자', 'Walnut Shadow', '검정보다 따뜻한 깊은 갈색을 찾아봐요.', 'Find a deep brown warmer than black.'),
      variant('clear-night-moss-lamp', '#59633E', '가로등 아래 이끼', 'Lamp-Lit Moss', '밤 조명 아래 조용히 살아 있는 초록을 찾아봐요.', 'Find a quiet green still alive under night lighting.'),
      variant('clear-night-paper-lantern', '#C9A66B', '종이등 골드', 'Paper Lantern Gold', '어둠 속에서 은근히 켜진 골드빛을 찾아봐요.', 'Find a gold that glows gently in the dark.'),
      variant('clear-night-cocoa-note', '#5D4337', '코코아빛 밤노트', 'Cocoa Night Note', '잠들기 전 적어두고 싶은 코코아빛을 찾아봐요.', 'Find a cocoa tone worth writing down before sleep.'),
    ],
  },
  clouds: {
    morning: [
      variant('clouds-morning-clay-mug', '#B89576', '흐린 날 머그컵 클레이', 'Cloudy Mug Clay', '흐린 아침 손에 쥔 머그컵 같은 흙빛을 찾아봐요.', 'Find an earthy clay tone like a mug on a cloudy morning.'),
      variant('clouds-morning-sage-knit', '#9BA48B', '세이지 니트 그늘', 'Sage Knit Shade', '니트처럼 폭 감기는 세이지 그늘을 찾아봐요.', 'Find a sage shade that feels as soft as knitwear.'),
      variant('clouds-morning-brown-pencil', '#8B6B4F', '갈색 연필심', 'Brown Pencil Lead', '다이어리에 눌러 쓴 연필 같은 갈색을 찾아봐요.', 'Find a brown like a pencil pressed into a diary.'),
      variant('clouds-morning-pear-cream', '#E5D5B5', '배꽃 크림', 'Pear Blossom Cream', '흐린 빛에서도 은은한 크림색을 찾아봐요.', 'Find a cream tone that stays gentle in cloudy light.'),
    ],
    day: [
      variant('clouds-day-dusty-olive', '#7F8558', '먼지 앉은 올리브', 'Dusty Olive', '선명하지 않아서 더 자연스러운 올리브를 찾아봐요.', 'Find an olive made more natural by dustiness.'),
      variant('clouds-day-bookstore-paper', '#D8C5A3', '책방 종이 베이지', 'Bookstore Paper Beige', '오래 넘긴 책장 같은 베이지를 찾아봐요.', 'Find a beige like pages in a small bookstore.'),
      variant('clouds-day-fern-muted', '#7C936C', '소리 낮춘 고사리', 'Muted Fern', '초록인데 조용히 숨을 고르는 색을 찾아봐요.', 'Find a green that quietly catches its breath.'),
      variant('clouds-day-roof-tile', '#A07358', '젖기 전 지붕기와', 'Almost-Wet Roof Tile', '비 오기 전 지붕기와처럼 묵직한 흙색을 찾아봐요.', 'Find an earthy tone like roof tile before rain.'),
    ],
    sunset: [
      variant('clouds-sunset-wood-rose', '#A97967', '나무그늘 로즈', 'Woodshade Rose', '나무그늘에 눌린 듯 차분한 로즈를 찾아봐요.', 'Find a rose tone softened by tree shade.'),
      variant('clouds-sunset-fig-brown', '#82614E', '무화과 브라운', 'Fig Brown', '달콤하지만 차분한 무화과빛 브라운을 찾아봐요.', 'Find a fig-brown that feels sweet but calm.'),
      variant('clouds-sunset-sage-coral', '#9D8C65', '세이지에 섞인 노을', 'Sage Afterglow', '초록과 노을 사이 어딘가의 색을 찾아봐요.', 'Find a color somewhere between sage and afterglow.'),
      variant('clouds-sunset-cotton-paper', '#D6B995', '솜종이 베이지', 'Cotton Paper Beige', '구름처럼 폭신한 베이지를 찾아봐요.', 'Find a beige as soft as cotton paper.'),
    ],
    night: [
      variant('clouds-night-bark-gray', '#514941', '나무껍질 그레이', 'Bark Gray', '회색이지만 나무처럼 따뜻한 색을 찾아봐요.', 'Find a gray that feels warm like tree bark.'),
      variant('clouds-night-olive-coat', '#4E563E', '밤 산책 올리브 코트', 'Night Walk Olive Coat', '밤 산책에 어울리는 묵직한 올리브를 찾아봐요.', 'Find a weighty olive fit for a night walk.'),
      variant('clouds-night-cafe-walnut', '#5B4032', '닫힌 카페 월넛', 'Closed Cafe Walnut', '문 닫힌 카페 안쪽처럼 조용한 갈색을 찾아봐요.', 'Find a quiet brown like the inside of a closed cafe.'),
      variant('clouds-night-foggy-kraft', '#8A7560', '안개 낀 크래프트', 'Hazy Kraft', '밤공기 속에서 흐려진 크래프트색을 찾아봐요.', 'Find a kraft tone softened by night air.'),
    ],
  },
  rain: {
    morning: [
      variant('rain-morning-asphalt-charcoal', '#2F4F4F', '빗방울 아스팔트 차콜', 'Rain-Drop Asphalt Charcoal', '우산 위로 떨어지는 빗방울과 어울리는 차분한 색을 찾아봐요.', 'Find a calm shade that belongs with raindrops on an umbrella.'),
      variant('rain-morning-red-umbrella', '#A3483D', '빨간 우산 안쪽', 'Inside Red Umbrella', '비 오는 날 오히려 더 선명해지는 빨간색을 찾아봐요.', 'Find a red that gets brighter because it is raining.'),
      variant('rain-morning-yellow-raincoat', '#C9A23E', '비옷 주머니 옐로', 'Raincoat Pocket Yellow', '흐린 아침을 살짝 밝혀주는 노랑을 찾아봐요.', 'Find a yellow that quietly lights up a rainy morning.'),
      variant('rain-morning-wet-paper', '#BFA886', '젖은 종이 베이지', 'Wet Paper Beige', '비에 살짝 눅눅해진 종이빛을 찾아봐요.', 'Find a paper beige softened by rain.'),
    ],
    day: [
      variant('rain-day-leaf-bronze', '#8A7048', '젖은 잎의 브론즈', 'Wet Leaf Bronze', '초록 옆에서 반짝이는 브론즈빛을 찾아봐요.', 'Find a bronze glimmering beside wet green.'),
      variant('rain-day-cafe-awning', '#6F7A4D', '카페 차양 올리브', 'Cafe Awning Olive', '비를 피한 차양 아래의 올리브색을 찾아봐요.', 'Find an olive shade under a rain shelter.'),
      variant('rain-day-brick-puddle', '#955F4E', '웅덩이 옆 벽돌빛', 'Puddle Brick', '젖은 바닥 옆에서 더 진해진 벽돌색을 찾아봐요.', 'Find a brick tone made deeper beside puddles.'),
      variant('rain-day-warm-window', '#C59A67', '비 오는 창가 라떼', 'Rainy Window Latte', '빗소리와 어울리는 따뜻한 라떼색을 찾아봐요.', 'Find a warm latte tone that sits well with rain sound.'),
    ],
    sunset: [
      variant('rain-sunset-tail-light', '#B84C42', '젖은 도로 테일라이트', 'Wet Road Tail Light', '젖은 길 위에 번지는 빨간빛을 찾아봐요.', 'Find a red light spreading across wet pavement.'),
      variant('rain-sunset-ginger-cloud', '#B67E51', '생강빛 비구름', 'Ginger Raincloud', '비구름 사이로 묻어나는 생강빛을 찾아봐요.', 'Find a ginger tone leaking through rainclouds.'),
      variant('rain-sunset-olive-umbrella', '#687647', '접힌 우산 올리브', 'Folded Umbrella Olive', '비가 그친 뒤 접힌 우산 같은 올리브를 찾아봐요.', 'Find an olive like a folded umbrella after rain.'),
      variant('rain-sunset-rose-concrete', '#9B6B63', '콘크리트 위 로즈', 'Rose on Concrete', '회색 바닥 위에서 더 부드러운 로즈를 찾아봐요.', 'Find a rose tone made softer against concrete.'),
    ],
    night: [
      variant('rain-night-taxi-amber', '#B88333', '택시 불빛 앰버', 'Taxi Light Amber', '비 오는 밤 유리창에 번지는 앰버빛을 찾아봐요.', 'Find an amber light smearing across rainy glass.'),
      variant('rain-night-red-signal', '#8F3E37', '빗속 신호등 레드', 'Rain Signal Red', '밤비 속에서 작게 번지는 빨간 신호를 찾아봐요.', 'Find a red signal softly blooming in night rain.'),
      variant('rain-night-wet-olive', '#45543B', '젖은 올리브 골목', 'Wet Olive Alley', '젖은 골목 안쪽의 깊은 올리브를 찾아봐요.', 'Find a deep olive in a wet alley.'),
      variant('rain-night-espresso-asphalt', '#3F3028', '에스프레소 아스팔트', 'Espresso Asphalt', '검정보다 따뜻한 젖은 아스팔트색을 찾아봐요.', 'Find a wet asphalt tone warmer than black.'),
    ],
  },
  snow: {
    morning: [
      variant('snow-morning-oat-wool', '#DED4BE', '눈 오는 아침 오트울', 'Snowy Oat Wool', '눈빛 사이에서 포근한 오트색을 찾아봐요.', 'Find a cozy oat tone inside snowy light.'),
      variant('snow-morning-pine-green', '#667A4A', '소나무 끝 그린', 'Pine-Tip Green', '하얀 배경 위에서 더 또렷한 초록을 찾아봐요.', 'Find a green made clearer by a white background.'),
      variant('snow-morning-cinnamon-door', '#A8714E', '계피빛 현관문', 'Cinnamon Door', '추운 아침을 덜 차갑게 만드는 갈색을 찾아봐요.', 'Find a brown that makes a cold morning less cold.'),
      variant('snow-morning-cream-scarf', '#EFE0C2', '목도리 크림', 'Scarf Cream', '부드러운 목도리 같은 크림색을 찾아봐요.', 'Find a cream tone as soft as a scarf.'),
    ],
    day: [
      variant('snow-day-cedar-shadow', '#6B7158', '눈 위 삼나무 그림자', 'Cedar Snow Shadow', '눈 위에 내려앉은 녹갈색 그림자를 찾아봐요.', 'Find a green-brown shadow resting on snow.'),
      variant('snow-day-warm-window', '#D2A961', '겨울 창문 골드', 'Winter Window Gold', '차가운 날 더 따뜻해 보이는 골드빛을 찾아봐요.', 'Find a gold that looks warmer on a cold day.'),
      variant('snow-day-paper-bag', '#C6A57B', '눈길 종이봉투', 'Snow-Walk Paper Bag', '겨울 산책에 들고 나선 종이봉투색을 찾아봐요.', 'Find a paper-bag tone carried on a winter walk.'),
      variant('snow-day-muted-sage', '#A8B49A', '서리 낀 세이지', 'Frosted Sage', '차가운 공기로 한 겹 흐려진 세이지를 찾아봐요.', 'Find a sage softened by cold air.'),
    ],
    sunset: [
      variant('snow-sunset-wood-cabin', '#9A6A4C', '겨울 오두막 우드', 'Winter Cabin Wood', '눈 속에서 더 따뜻하게 보이는 나무색을 찾아봐요.', 'Find a wood tone that looks warmer in snow.'),
      variant('snow-sunset-rose-mitten', '#B77A70', '장갑 속 로즈', 'Mitten Rose', '손끝을 따뜻하게 하는 로즈빛을 찾아봐요.', 'Find a rose tone that warms your fingertips.'),
      variant('snow-sunset-honey-snow', '#D0A850', '눈 위 꿀빛', 'Honey on Snow', '하얀 눈 위에 얹힌 꿀빛을 찾아봐요.', 'Find a honey tone resting on snow.'),
      variant('snow-sunset-olive-wool', '#777D55', '울코트 올리브', 'Wool Coat Olive', '겨울 코트처럼 차분한 올리브를 찾아봐요.', 'Find a calm olive like a winter wool coat.'),
    ],
    night: [
      variant('snow-night-cabin-window', '#A77B49', '오두막 창문 앰버', 'Cabin Window Amber', '눈 오는 밤 멀리 켜진 앰버빛을 찾아봐요.', 'Find an amber light glowing far away on a snowy night.'),
      variant('snow-night-pine-charcoal', '#3F493C', '소나무 차콜그린', 'Pine Charcoal Green', '어두운 밤에도 생기가 남은 녹색을 찾아봐요.', 'Find a green that stays alive in the dark.'),
      variant('snow-night-cocoa-wool', '#5D4538', '코코아 울브라운', 'Cocoa Wool Brown', '따뜻한 음료처럼 깊은 브라운을 찾아봐요.', 'Find a deep brown like a warm drink.'),
      variant('snow-night-dim-gold', '#8F7747', '눈길 희미한 골드', 'Dim Snow Gold', '눈길 위에서 낮게 빛나는 골드를 찾아봐요.', 'Find a low gold glowing over a snowy street.'),
    ],
  },
  storm: {
    morning: [
      variant('storm-morning-bark-steady', '#5F5144', '흔들림 없는 나무껍질', 'Steady Bark', '바람이 불어도 묵직하게 남아 있는 갈색을 찾아봐요.', 'Find a brown that stays steady in the wind.'),
      variant('storm-morning-olive-raincoat', '#626A40', '폭풍 전 올리브 코트', 'Storm-Ready Olive', '폭풍 전 단단해 보이는 올리브색을 찾아봐요.', 'Find an olive that feels ready for the storm.'),
      variant('storm-morning-rust-sign', '#9D6041', '녹슨 표지판 러스트', 'Rust Sign', '흐린 공기 속에서도 눈에 들어오는 러스트색을 찾아봐요.', 'Find a rust tone that still catches the eye in heavy air.'),
      variant('storm-morning-kraft-cloud', '#A38B6D', '구겨진 크래프트 구름', 'Crumpled Kraft Cloud', '구겨진 종이처럼 결이 있는 베이지를 찾아봐요.', 'Find a textured beige like crumpled paper.'),
    ],
    day: [
      variant('storm-day-deep-cedar', '#3F5A4B', '폭풍 속 삼나무', 'Storm Cedar', '짙은 날씨 안에서도 살아 있는 초록을 찾아봐요.', 'Find a green still alive inside stormy weather.'),
      variant('storm-day-copper-flash', '#A66A3F', '번개 전 구리빛', 'Pre-Lightning Copper', '어두운 하늘 아래 잠깐 뜨는 구리빛을 찾아봐요.', 'Find a copper tone flashing under a dark sky.'),
      variant('storm-day-red-postbox', '#8E3F35', '먹구름 아래 우체통', 'Postbox Under Clouds', '칙칙한 날씨 속에서 단단히 서 있는 빨강을 찾아봐요.', 'Find a red standing firm under heavy clouds.'),
      variant('storm-day-stone-beige', '#9C907A', '비바람 스톤베이지', 'Storm Stone Beige', '바람에 다듬어진 돌 같은 베이지를 찾아봐요.', 'Find a beige like stone shaped by wind.'),
    ],
    sunset: [
      variant('storm-sunset-plum-bark', '#72514D', '자두빛 나무그늘', 'Plum Bark Shade', '보라와 갈색 사이의 깊은 그늘을 찾아봐요.', 'Find a deep shade between plum and bark.'),
      variant('storm-sunset-copper-rose', '#9E6252', '구리빛 로즈', 'Copper Rose', '드라마틱하지만 따뜻한 로즈브라운을 찾아봐요.', 'Find a dramatic but warm rose-brown.'),
      variant('storm-sunset-olive-smoke', '#606345', '연기 섞인 올리브', 'Smoked Olive', '연기처럼 흐려진 올리브색을 찾아봐요.', 'Find an olive softened like smoke.'),
      variant('storm-sunset-amber-crack', '#B88743', '구름 틈 앰버', 'Cloud-Crack Amber', '먹구름 사이로 잠깐 드러난 앰버빛을 찾아봐요.', 'Find amber briefly showing through a crack in the clouds.'),
    ],
    night: [
      variant('storm-night-burnt-wood', '#332820', '비바람 탄 나무', 'Burnt Storm Wood', '깊고 거친 나무색을 찾아봐요.', 'Find a deep rough wood tone.'),
      variant('storm-night-olive-black', '#2F392B', '블랙올리브 밤', 'Black Olive Night', '검정 가까이에 숨어 있는 올리브를 찾아봐요.', 'Find an olive hiding near black.'),
      variant('storm-night-rain-copper', '#765136', '빗물에 젖은 구리', 'Rain-Wet Copper', '젖어서 더 어두워진 구리빛을 찾아봐요.', 'Find copper darkened by rain.'),
      variant('storm-night-warning-amber', '#A97936', '멀리 켜진 경고등', 'Far Warning Amber', '무섭지 않고 따뜻하게 보이는 앰버빛을 찾아봐요.', 'Find amber that feels warm rather than harsh.'),
    ],
  },
  fog: {
    morning: [
      variant('fog-morning-mulberry-paper', '#C9B89A', '닥종이 안개베이지', 'Mulberry Paper Beige', '안개에 젖은 종이 같은 베이지를 찾아봐요.', 'Find a beige like paper softened by fog.'),
      variant('fog-morning-sage-breath', '#A6B19A', '입김 섞인 세이지', 'Breath-Mixed Sage', '입김처럼 흐려진 세이지색을 찾아봐요.', 'Find a sage blurred like your breath in the air.'),
      variant('fog-morning-wooden-pencil', '#9A795A', '나무연필 브라운', 'Wooden Pencil Brown', '손에 오래 쥔 연필 같은 갈색을 찾아봐요.', 'Find a brown like a wooden pencil warmed by your hand.'),
      variant('fog-morning-soft-gold', '#CAB16C', '안개 속 낮은 골드', 'Low Fog Gold', '안개 너머 낮게 번지는 골드를 찾아봐요.', 'Find a low gold spreading through fog.'),
    ],
    day: [
      variant('fog-day-tea-olive', '#85895F', '찻잎 올리브', 'Tea Leaf Olive', '따뜻한 차 향처럼 은은한 올리브를 찾아봐요.', 'Find an olive as subtle as warm tea.'),
      variant('fog-day-paper-shadow', '#B8AA92', '종이 아래 그림자', 'Under-Paper Shadow', '종이 밑으로 비치는 차분한 그림자를 찾아봐요.', 'Find a calm shadow showing through paper.'),
      variant('fog-day-muted-terracotta', '#A0715B', '소리 낮춘 테라코타', 'Muted Terracotta', '선명하지 않아 더 다정한 테라코타를 찾아봐요.', 'Find a terracotta made gentler by being muted.'),
      variant('fog-day-fern-fade', '#819678', '흐려진 고사리빛', 'Faded Fern', '안개 속에서 윤곽이 부드러워진 초록을 찾아봐요.', 'Find a green with softened edges in fog.'),
    ],
    sunset: [
      variant('fog-sunset-warm-kraft', '#C49B70', '따뜻한 크래프트 노을', 'Warm Kraft Dusk', '노을을 머금은 크래프트색을 찾아봐요.', 'Find a kraft tone holding dusk light.'),
      variant('fog-sunset-dried-flower', '#A97969', '말린 꽃 로즈브라운', 'Dried Flower Rose Brown', '말린 꽃잎처럼 조용한 로즈브라운을 찾아봐요.', 'Find a quiet rose-brown like dried petals.'),
      variant('fog-sunset-sage-peach', '#B4A275', '세이지 피치 먼지', 'Sage Peach Dust', '피치와 세이지가 섞여 먼지처럼 부드러운 색을 찾아봐요.', 'Find a dusty blend of peach and sage.'),
      variant('fog-sunset-honey-linen', '#D0B178', '꿀빛 리넨', 'Honey Linen', '안개 속에서도 따뜻한 리넨 골드를 찾아봐요.', 'Find a warm linen-gold inside fog.'),
    ],
    night: [
      variant('fog-night-brown-fog', '#51443A', '갈색 안개 밤', 'Brown Fog Night', '밤안개에 섞인 부드러운 갈색을 찾아봐요.', 'Find a soft brown mixed into night fog.'),
      variant('fog-night-sage-lamp', '#5D6749', '안개등 세이지', 'Fog Lamp Sage', '조명 아래 희미하게 살아나는 세이지를 찾아봐요.', 'Find sage gently returning under a lamp.'),
      variant('fog-night-caramel-shadow', '#7A5A3E', '카라멜 그림자', 'Caramel Shadow', '달지 않고 깊은 카라멜 그림자를 찾아봐요.', 'Find a caramel shadow that feels deep, not sweet.'),
      variant('fog-night-paper-charcoal', '#4B4942', '종이 차콜', 'Paper Charcoal', '차갑지 않은 차콜색을 찾아봐요.', 'Find a charcoal that does not feel cold.'),
    ],
  },
}

const missionVariantSceneExpansions: Partial<Record<WeatherGroup, Partial<Record<TimeBucket, MissionVariant[]>>>> = {
  clear: {
    morning: [
      variant('clear-morning-dew-wood', '#9F7A55', '이슬 마른 나무손잡이', 'Dew-Dried Wood Handle', '아침 이슬이 마른 뒤 남은 따뜻한 나무색을 찾아봐요.', 'Find a warm wood tone left after morning dew dries.'),
    ],
    day: [
      variant('clear-day-market-canvas', '#C4B18A', '시장 가방 캔버스', 'Market Canvas Bag', '햇빛 아래 오래 들고 다닌 천가방 같은 색을 찾아봐요.', 'Find a sunlit canvas tone like a well-used market bag.'),
    ],
    sunset: [
      variant('clear-sunset-copper-railing', '#A76B45', '노을 난간 코퍼', 'Sunset Railing Copper', '노을을 받아 잠깐 붉어진 난간의 코퍼빛을 찾아봐요.', 'Find copper warmed for a moment by sunset.'),
    ],
    night: [
      variant('clear-night-warm-sign', '#9E7A42', '밤 골목 간판불', 'Warm Alley Sign', '밤 골목에서 무섭지 않게 켜진 따뜻한 불빛을 찾아봐요.', 'Find a warm sign light that makes a night alley feel gentle.'),
    ],
  },
  clouds: {
    morning: [
      variant('clouds-morning-rice-paper-cream', '#E6DDC9', '흐린 아침 한지크림', 'Cloudy Rice-Paper Cream', '흐린 빛을 부드럽게 머금은 한지 같은 크림색을 찾아봐요.', 'Find a rice-paper cream holding cloudy morning light.'),
    ],
    day: [
      variant('clouds-day-olive-notebook', '#8D8E63', '노트 위 올리브잉크', 'Notebook Olive Ink', '노트 위에 오래 말라붙은 올리브 잉크 같은 색을 찾아봐요.', 'Find an olive ink tone dried into a notebook page.'),
    ],
    sunset: [
      variant('clouds-sunset-plum-kraft', '#8F6657', '크래프트 위 자두빛', 'Plum on Kraft', '갈색 종이 위에 살짝 번진 자두빛을 찾아봐요.', 'Find a plum tone softly spread over kraft paper.'),
    ],
    night: [
      variant('clouds-night-quiet-cocoa', '#4F3B31', '구름 낀 밤 코코아', 'Clouded Night Cocoa', '흐린 밤을 덜 차갑게 만드는 코코아 브라운을 찾아봐요.', 'Find a cocoa brown that makes a cloudy night less cold.'),
    ],
  },
  rain: {
    morning: [
      variant('rain-morning-subway-cream', '#D2C3A6', '지하철 조명 크림', 'Subway Light Cream', '비 오는 아침 지하철 안쪽의 따뜻한 크림빛을 찾아봐요.', 'Find the warm cream light inside a rainy-morning subway.'),
    ],
    day: [
      variant('rain-day-red-awning', '#9E473B', '비 맞은 빨간 차양', 'Rainy Red Awning', '젖어서 더 선명해진 빨간 차양 같은 색을 찾아봐요.', 'Find a red awning made richer by rain.'),
    ],
    sunset: [
      variant('rain-sunset-bus-stop-amber', '#B98245', '정류장 앰버 노을', 'Bus-Stop Amber Dusk', '비 오는 저녁 정류장 유리에 번지는 앰버빛을 찾아봐요.', 'Find amber spreading over a rainy bus-stop window.'),
    ],
    night: [
      variant('rain-night-paper-cup-latte', '#8B674B', '비 오는 밤 종이컵 라떼', 'Rain-Night Paper-Cup Latte', '차가운 밤비 옆에서 따뜻하게 보이는 라떼색을 찾아봐요.', 'Find a latte tone that feels warm beside cold night rain.'),
    ],
  },
  snow: {
    morning: [
      variant('snow-morning-wool-button', '#B49A78', '울코트 단추 브라운', 'Wool-Coat Button Brown', '눈 오는 아침 코트 단추처럼 작고 따뜻한 갈색을 찾아봐요.', 'Find a small warm brown like a coat button on a snowy morning.'),
    ],
    day: [
      variant('snow-day-red-scarf', '#A84D45', '눈밭 위 빨간 목도리', 'Red Scarf on Snow', '하얀 배경 위에서 더 다정해지는 빨강을 찾아봐요.', 'Find a red that becomes gentler against snow.'),
    ],
    sunset: [
      variant('snow-sunset-caramel-window', '#C18B52', '겨울 창가 카라멜', 'Winter Window Caramel', '눈 내린 저녁 창가에 남은 카라멜빛을 찾아봐요.', 'Find caramel light lingering by a snowy window.'),
    ],
    night: [
      variant('snow-night-cedar-lamp', '#566141', '눈밤 삼나무 조명', 'Snow-Night Cedar Lamp', '눈 오는 밤 조명 아래 살아 있는 삼나무빛을 찾아봐요.', 'Find cedar green still alive under snowy night light.'),
    ],
  },
  storm: {
    morning: [
      variant('storm-morning-pressed-leather', '#6F4E37', '비바람 눌린 가죽', 'Weather-Pressed Leather', '거친 날씨에도 손에 익은 가죽 같은 갈색을 찾아봐요.', 'Find a leather brown that still feels familiar in rough weather.'),
    ],
    day: [
      variant('storm-day-yellow-line', '#C2A13D', '먹구름 아래 노란 차선', 'Yellow Line Under Storm Clouds', '무거운 하늘 아래서도 길을 알려주는 노랑을 찾아봐요.', 'Find a yellow that still guides the way under heavy clouds.'),
    ],
    sunset: [
      variant('storm-sunset-rust-rose', '#935844', '폭풍 뒤 러스트로즈', 'After-Storm Rust Rose', '폭풍 뒤에 남은 녹슨 장밋빛을 찾아봐요.', 'Find a rusty rose left behind after storm weather.'),
    ],
    night: [
      variant('storm-night-candle-brown', '#7C5734', '정전 속 촛불브라운', 'Power-Out Candle Brown', '어두운 밤을 조금 안심시키는 촛불 브라운을 찾아봐요.', 'Find a candle brown that calms a dark storm night.'),
    ],
  },
  fog: {
    morning: [
      variant('fog-morning-soft-moss', '#8D9676', '안개에 젖은 연한 이끼', 'Fog-Soft Moss', '윤곽이 흐려져 더 포근한 이끼빛을 찾아봐요.', 'Find moss green made softer by foggy edges.'),
    ],
    day: [
      variant('fog-day-warm-stone', '#AA9678', '안개 속 따뜻한 돌', 'Warm Stone in Fog', '차갑지 않은 돌처럼 조용한 베이지를 찾아봐요.', 'Find a quiet beige like stone that does not feel cold.'),
    ],
    sunset: [
      variant('fog-sunset-cinnamon-paper', '#B7855D', '시나몬 종이노을', 'Cinnamon Paper Dusk', '종이 위에 시나몬을 살짝 털어낸 듯한 노을색을 찾아봐요.', 'Find a dusk tone like cinnamon dusted over paper.'),
    ],
    night: [
      variant('fog-night-walnut-lamp', '#5A4435', '안개등 아래 월넛', 'Walnut Under Fog Lamps', '안개등 아래 낮게 빛나는 월넛 브라운을 찾아봐요.', 'Find walnut brown glowing low under fog lamps.'),
    ],
  },
}

function variant(
  id: string,
  hex: string,
  koLabel: string,
  enLabel: string,
  koPrompt: string,
  enPrompt: string,
): MissionVariant {
  return {
    id,
    hex,
    label: { ko: koLabel, en: enLabel },
    prompt: { ko: koPrompt, en: enPrompt },
  }
}

function toMissionDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function hashString(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

function getMissionCandidates(weatherGroup: WeatherGroup, timeBucket: TimeBucket) {
  return [
    missionMap[weatherGroup][timeBucket],
    ...(missionVariants[weatherGroup]?.[timeBucket] ?? []).map((variant) => ({
      ...missionMap[weatherGroup][timeBucket],
      ...variant,
    })),
    ...(missionVariantExpansions[weatherGroup]?.[timeBucket] ?? []).map((variant) => ({
      ...missionMap[weatherGroup][timeBucket],
      ...variant,
    })),
    ...(missionVariantSceneExpansions[weatherGroup]?.[timeBucket] ?? []).map((variant) => ({
      ...missionMap[weatherGroup][timeBucket],
      ...variant,
    })),
  ]
}

function getAllMissionCandidates() {
  return (Object.keys(missionMap) as WeatherGroup[]).flatMap((weatherGroup) =>
    (Object.keys(missionMap[weatherGroup]) as TimeBucket[]).flatMap((timeBucket) => getMissionCandidates(weatherGroup, timeBucket)),
  )
}

export function chooseMissionCandidate(
  candidates: MissionCore[],
  options: { excludeId?: string; excludeHex?: string; rng?: () => number } = {},
) {
  const withoutCurrent = candidates.filter((candidate) =>
    candidate.id !== options.excludeId && candidate.hex.toUpperCase() !== options.excludeHex?.toUpperCase(),
  )
  const filtered = withoutCurrent.length ? withoutCurrent : candidates
  const index = Math.min(filtered.length - 1, Math.floor((options.rng ?? Math.random)() * filtered.length))

  return filtered[index] ?? candidates[0]
}

export function getTimeBucket(date = new Date()): TimeBucket {
  const hour = date.getHours()

  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'sunset'
  return 'night'
}

export function mapWeatherCodeToGroup(code?: number): WeatherGroup {
  if (code === undefined) return 'clear'
  if ([0, 1].includes(code)) return 'clear'
  if ([2, 3].includes(code)) return 'clouds'
  if ([45, 48].includes(code)) return 'fog'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([95, 96, 99].includes(code)) return 'storm'
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 80 && code <= 82) return 'rain'
  return 'clouds'
}

export function getMission(
  weatherGroup: WeatherGroup,
  timeBucket: TimeBucket,
  source: Mission['source'],
  weatherCode?: number,
): Mission {
  return {
    ...missionMap[weatherGroup][timeBucket],
    source,
    weatherCode,
  }
}

export function getDailyMission(
  weatherGroup: WeatherGroup,
  timeBucket: TimeBucket,
  source: Mission['source'],
  weatherCode?: number,
  date = new Date(),
): Mission {
  const candidates = getMissionCandidates(weatherGroup, timeBucket)
  const seed = `${toMissionDateKey(date)}:${weatherGroup}:${timeBucket}:${weatherCode ?? 'local'}`
  const selected = candidates[hashString(seed) % candidates.length]

  return {
    ...selected,
    source,
    weatherCode,
  }
}

export function getRandomMission(
  weatherGroup: WeatherGroup,
  timeBucket: TimeBucket,
  source: Mission['source'],
  weatherCode?: number,
  options: { broaden?: boolean; excludeId?: string; excludeHex?: string; rng?: () => number } = {},
): Mission {
  const candidates = options.broaden
    ? Array.from(new Map(getAllMissionCandidates().map((candidate) => [candidate.hex.toUpperCase(), candidate])).values())
    : getMissionCandidates(weatherGroup, timeBucket)
  const selected = chooseMissionCandidate(candidates, options)

  return {
    ...selected,
    source,
    weatherCode,
  }
}

export function getFallbackMission(locale: Locale) {
  const timeBucket = getTimeBucket()
  const weatherGroup: WeatherGroup = locale === 'ko' ? 'clouds' : 'clear'

  return getDailyMission(weatherGroup, timeBucket, 'fallback')
}
