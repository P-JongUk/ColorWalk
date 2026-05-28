with palettes(hex, family, locale, roots, tones) as (
  values
    ('#FF8A7A', 'coral', 'ko', array['코랄', '살구', '피치', '노을'], array['따뜻한', '말랑한', '햇살 닮은', '필름 속', '산책길의', '작은', '포근한', '느린']),
    ('#FF8A7A', 'coral', 'en', array['Coral', 'Apricot', 'Peach', 'Sunset'], array['Warm', 'Soft', 'Sunlit', 'Film', 'Walkway', 'Tiny', 'Cozy', 'Slow']),
    ('#F6A7B5', 'pink', 'ko', array['분홍', '벚꽃', '딸기우유', '장미'], array['몽글한', '봄날의', '구름 같은', '햇살 묻은', '말간', '작은', '수줍은', '달콤한']),
    ('#F6A7B5', 'pink', 'en', array['Pink', 'Cherry Blossom', 'Strawberry Milk', 'Rose'], array['Mongle', 'Spring', 'Cloudy', 'Sun-kissed', 'Clear', 'Tiny', 'Shy', 'Sweet']),
    ('#F4C7B8', 'peach', 'ko', array['복숭아', '크림', '라떼', '살구'], array['흐린', '부드러운', '따뜻한', '오후의', '종이 위', '안개 낀', '차분한', '말랑한']),
    ('#F4C7B8', 'peach', 'en', array['Peach', 'Cream', 'Latte', 'Apricot'], array['Misty', 'Soft', 'Warm', 'Afternoon', 'Paper', 'Foggy', 'Calm', 'Mellow']),
    ('#FFD07A', 'yellow', 'ko', array['버터', '망고', '노란빛', '햇살'], array['맑은', '반짝이는', '오후의', '필름 속', '달콤한', '가벼운', '따뜻한', '작은']),
    ('#FFD07A', 'yellow', 'en', array['Butter', 'Mango', 'Yellow', 'Sun'], array['Clear', 'Sparkly', 'Afternoon', 'Film', 'Sweet', 'Light', 'Warm', 'Tiny']),
    ('#D8D19B', 'olive', 'ko', array['올리브', '허브', '풀잎', '이끼'], array['차분한', '느린', '비 온 뒤', '공원 속', '흐린', '햇빛 바랜', '조용한', '작은']),
    ('#D8D19B', 'olive', 'en', array['Olive', 'Herb', 'Leaf', 'Moss'], array['Calm', 'Slow', 'After-rain', 'Park', 'Cloudy', 'Sun-faded', 'Quiet', 'Tiny']),
    ('#A8D8C8', 'green', 'ko', array['민트', '세이지', '연두', '초록'], array['맑은', '숨 쉬는', '차분한', '몽글한', '산책길의', '부드러운', '아침의', '작은']),
    ('#A8D8C8', 'green', 'en', array['Mint', 'Sage', 'Soft Leaf', 'Green'], array['Clear', 'Breathing', 'Calm', 'Mongle', 'Walkway', 'Soft', 'Morning', 'Tiny']),
    ('#8FBFAF', 'sage', 'ko', array['세이지', '민트그린', '공원', '잎사귀'], array['기본 위치의', '흐린 날의', '조용한', '물빛 섞인', '차분한', '느린', '포근한', '말간']),
    ('#8FBFAF', 'sage', 'en', array['Sage', 'Mint Green', 'Park', 'Leaf'], array['Default', 'Cloudy-day', 'Quiet', 'Watery', 'Calm', 'Slow', 'Cozy', 'Clear']),
    ('#9BC8E5', 'sky', 'ko', array['하늘', '구름', '아침', '파랑'], array['말간', '얇은', '세탁한', '햇빛 묻은', '조용한', '가벼운', '맑은', '먼']),
    ('#9BC8E5', 'sky', 'en', array['Sky', 'Cloud', 'Morning', 'Blue'], array['Clear', 'Thin', 'Washed', 'Sunlit', 'Quiet', 'Light', 'Bright', 'Distant']),
    ('#7E9CCB', 'blue', 'ko', array['비 온 뒤', '골목', '유리', '바다'], array['차가운', '젖은', '깊은', '조용한', '흐린', '선명한', '느린', '저녁의']),
    ('#7E9CCB', 'blue', 'en', array['After-rain', 'Alley', 'Glass', 'Sea'], array['Cool', 'Wet', 'Deep', 'Quiet', 'Cloudy', 'Clear', 'Slow', 'Evening']),
    ('#9A88B8', 'purple', 'ko', array['라벤더', '보라', '새벽', '자수정'], array['흐린', '몽글한', '꿈같은', '조용한', '밤의', '포근한', '희미한', '느린']),
    ('#9A88B8', 'purple', 'en', array['Lavender', 'Violet', 'Dawn', 'Amethyst'], array['Misty', 'Mongle', 'Dreamy', 'Quiet', 'Night', 'Cozy', 'Faint', 'Slow']),
    ('#78606B', 'mauve', 'ko', array['잉크', '자두', '말린 장미', '밤'], array['새벽 전', '깊은', '조용한', '흐린', '차분한', '낮게 깔린', '필름 속', '느린']),
    ('#78606B', 'mauve', 'en', array['Ink', 'Plum', 'Dried Rose', 'Night'], array['Pre-dawn', 'Deep', 'Quiet', 'Cloudy', 'Calm', 'Low', 'Film', 'Slow']),
    ('#CDBBB0', 'neutral', 'ko', array['라떼', '종이', '돌담', '밀크티'], array['따뜻한', '차분한', '오래된', '햇빛 바랜', '조용한', '부드러운', '느린', '작은']),
    ('#CDBBB0', 'neutral', 'en', array['Latte', 'Paper', 'Stone Wall', 'Milk Tea'], array['Warm', 'Calm', 'Old', 'Sun-faded', 'Quiet', 'Soft', 'Slow', 'Tiny']),
    ('#3A3A3A', 'charcoal', 'ko', array['차콜', '그림자', '잉크', '밤'], array['깊은', '조용한', '골목의', '작은', '묵직한', '새벽의', '필름 속', '낮은']),
    ('#3A3A3A', 'charcoal', 'en', array['Charcoal', 'Shadow', 'Ink', 'Night'], array['Deep', 'Quiet', 'Alley', 'Tiny', 'Heavy', 'Dawn', 'Film', 'Low'])
),
generated as (
  select
    hex,
    family,
    locale,
    case
      when locale = 'ko' then tone || ' ' || root
      else tone || ' ' || root
    end as name,
    'generated' as mood
  from palettes
  cross join lateral unnest(roots) as root
  cross join lateral unnest(tones) as tone
)
insert into public.color_name_suggestions (hex, family, locale, name, mood)
select hex, family, locale, name, mood
from generated
on conflict (hex, locale, name) do nothing;
