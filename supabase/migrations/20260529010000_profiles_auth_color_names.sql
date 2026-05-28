alter table public.profiles
  add column if not exists username text,
  add column if not exists nickname text,
  add column if not exists gender text,
  add column if not exists birth_year integer,
  add column if not exists auth_method text not null default 'anonymous';

alter table public.profiles
  drop constraint if exists profiles_username_format_check,
  add constraint profiles_username_format_check
    check (username is null or username ~ '^[a-z0-9_][a-z0-9_.]{2,19}$'),
  drop constraint if exists profiles_gender_check,
  add constraint profiles_gender_check
    check (gender is null or gender in ('female', 'male', 'nonbinary', 'prefer_not_to_say')),
  drop constraint if exists profiles_birth_year_check,
  add constraint profiles_birth_year_check
    check (birth_year is null or birth_year between 1930 and 2026),
  drop constraint if exists profiles_auth_method_check,
  add constraint profiles_auth_method_check
    check (auth_method in ('anonymous', 'password'));

create unique index if not exists profiles_username_lower_unique
on public.profiles (lower(username))
where username is not null;

create table if not exists public.color_name_suggestions (
  id bigserial primary key,
  hex varchar(7) not null check (hex ~ '^#[0-9A-Fa-f]{6}$'),
  family text not null,
  locale text not null check (locale in ('ko', 'en')),
  name text not null,
  mood text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (hex, locale, name)
);

alter table public.color_name_suggestions enable row level security;

drop policy if exists "Authenticated users can read color names." on public.color_name_suggestions;
create policy "Authenticated users can read color names."
on public.color_name_suggestions for select to authenticated
using (true);

insert into public.color_name_suggestions (hex, family, locale, name, mood)
values
  ('#FF8A7A', 'coral', 'ko', '따뜻한 코랄빛', 'warm'),
  ('#FF8A7A', 'coral', 'ko', '피치 멜로우', 'soft'),
  ('#FF8A7A', 'coral', 'ko', '노을 살구', 'sunset'),
  ('#FF8A7A', 'coral', 'en', 'Warm Coral', 'warm'),
  ('#FF8A7A', 'coral', 'en', 'Peach Mellow', 'soft'),
  ('#FF8A7A', 'coral', 'en', 'Apricot Sunset', 'sunset'),
  ('#F6A7B5', 'pink', 'ko', '벚꽃 코랄', 'spring'),
  ('#F6A7B5', 'pink', 'ko', '분홍 구름', 'cloud'),
  ('#F6A7B5', 'pink', 'ko', '딸기 우유빛', 'cute'),
  ('#F6A7B5', 'pink', 'en', 'Cherry Blossom', 'spring'),
  ('#F6A7B5', 'pink', 'en', 'Pink Cloud', 'cloud'),
  ('#F6A7B5', 'pink', 'en', 'Strawberry Milk', 'cute'),
  ('#F4C7B8', 'peach', 'ko', '복숭아 안개', 'soft'),
  ('#F4C7B8', 'peach', 'ko', '살구 크림', 'cream'),
  ('#F4C7B8', 'peach', 'ko', '햇살 베이지', 'calm'),
  ('#F4C7B8', 'peach', 'en', 'Peach Fog', 'soft'),
  ('#F4C7B8', 'peach', 'en', 'Apricot Cream', 'cream'),
  ('#F4C7B8', 'peach', 'en', 'Sunlit Beige', 'calm'),
  ('#FFD07A', 'yellow', 'ko', '버터 햇살', 'bright'),
  ('#FFD07A', 'yellow', 'ko', '망고 오후', 'happy'),
  ('#FFD07A', 'yellow', 'ko', '노란 필름', 'retro'),
  ('#FFD07A', 'yellow', 'en', 'Butter Sun', 'bright'),
  ('#FFD07A', 'yellow', 'en', 'Mango Afternoon', 'happy'),
  ('#FFD07A', 'yellow', 'en', 'Yellow Film', 'retro'),
  ('#D8D19B', 'olive', 'ko', '올리브 산책', 'calm'),
  ('#D8D19B', 'olive', 'ko', '풀잎 베이지', 'nature'),
  ('#D8D19B', 'olive', 'ko', '느린 허브', 'slow'),
  ('#D8D19B', 'olive', 'en', 'Olive Walk', 'calm'),
  ('#D8D19B', 'olive', 'en', 'Leaf Beige', 'nature'),
  ('#D8D19B', 'olive', 'en', 'Slow Herb', 'slow'),
  ('#A8D8C8', 'green', 'ko', '민트 숨결', 'fresh'),
  ('#A8D8C8', 'green', 'ko', '세이지 물결', 'calm'),
  ('#A8D8C8', 'green', 'ko', '연두 산책', 'fresh'),
  ('#A8D8C8', 'green', 'en', 'Mint Breath', 'fresh'),
  ('#A8D8C8', 'green', 'en', 'Sage Ripple', 'calm'),
  ('#A8D8C8', 'green', 'en', 'Soft Leaf Walk', 'fresh'),
  ('#8FBFAF', 'sage', 'ko', '기본 위치의 세이지', 'base'),
  ('#8FBFAF', 'sage', 'ko', '차분한 민트그린', 'calm'),
  ('#8FBFAF', 'sage', 'ko', '흐린 공원의 초록', 'cloudy'),
  ('#8FBFAF', 'sage', 'en', 'Default Sage', 'base'),
  ('#8FBFAF', 'sage', 'en', 'Quiet Mint Green', 'calm'),
  ('#8FBFAF', 'sage', 'en', 'Cloudy Park Green', 'cloudy'),
  ('#9BC8E5', 'blue', 'ko', '하늘 세탁물', 'clear'),
  ('#9BC8E5', 'blue', 'ko', '아침 블루', 'morning'),
  ('#9BC8E5', 'blue', 'ko', '얇은 구름색', 'airy'),
  ('#9BC8E5', 'blue', 'en', 'Laundry Sky', 'clear'),
  ('#9BC8E5', 'blue', 'en', 'Morning Blue', 'morning'),
  ('#9BC8E5', 'blue', 'en', 'Thin Cloud Blue', 'airy'),
  ('#7E9CCB', 'blue', 'ko', '비 온 뒤 파랑', 'rain'),
  ('#7E9CCB', 'blue', 'ko', '골목 블루', 'street'),
  ('#7E9CCB', 'blue', 'ko', '차가운 유리빛', 'cool'),
  ('#7E9CCB', 'blue', 'en', 'After-Rain Blue', 'rain'),
  ('#7E9CCB', 'blue', 'en', 'Alley Blue', 'street'),
  ('#7E9CCB', 'blue', 'en', 'Cool Glass', 'cool'),
  ('#9A88B8', 'purple', 'ko', '라벤더 그림자', 'quiet'),
  ('#9A88B8', 'purple', 'ko', '보라 새벽', 'night'),
  ('#9A88B8', 'purple', 'ko', '몽글 퍼플', 'dreamy'),
  ('#9A88B8', 'purple', 'en', 'Lavender Shadow', 'quiet'),
  ('#9A88B8', 'purple', 'en', 'Violet Dawn', 'night'),
  ('#9A88B8', 'purple', 'en', 'Mongle Purple', 'dreamy'),
  ('#78606B', 'mauve', 'ko', '새벽 전 잉크블루', 'night'),
  ('#78606B', 'mauve', 'ko', '자두 그림자', 'deep'),
  ('#78606B', 'mauve', 'ko', '밤의 말린 장미', 'moody'),
  ('#78606B', 'mauve', 'en', 'Pre-Dawn Ink', 'night'),
  ('#78606B', 'mauve', 'en', 'Plum Shadow', 'deep'),
  ('#78606B', 'mauve', 'en', 'Dried Rose Night', 'moody'),
  ('#CDBBB0', 'neutral', 'ko', '종이 라떼', 'neutral'),
  ('#CDBBB0', 'neutral', 'ko', '따뜻한 돌담', 'calm'),
  ('#CDBBB0', 'neutral', 'ko', '밀크티 그림자', 'warm'),
  ('#CDBBB0', 'neutral', 'en', 'Paper Latte', 'neutral'),
  ('#CDBBB0', 'neutral', 'en', 'Warm Stone Wall', 'calm'),
  ('#CDBBB0', 'neutral', 'en', 'Milk Tea Shade', 'warm'),
  ('#3A3A3A', 'neutral', 'ko', '차콜 밤', 'dark'),
  ('#3A3A3A', 'neutral', 'ko', '골목 그림자', 'street'),
  ('#3A3A3A', 'neutral', 'ko', '잉크 포켓', 'dark'),
  ('#3A3A3A', 'neutral', 'en', 'Charcoal Night', 'dark'),
  ('#3A3A3A', 'neutral', 'en', 'Alley Shadow', 'street'),
  ('#3A3A3A', 'neutral', 'en', 'Ink Pocket', 'dark')
on conflict (hex, locale, name) do nothing;
