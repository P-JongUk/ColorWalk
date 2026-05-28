create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  current_streak integer not null default 0,
  locale text not null default 'ko' check (locale in ('ko', 'en'))
);

alter table public.profiles enable row level security;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  local_date date not null,
  mission_hex varchar(7) not null check (mission_hex ~ '^#[0-9A-Fa-f]{6}$'),
  captured_hex varchar(7) not null check (captured_hex ~ '^#[0-9A-Fa-f]{6}$'),
  match_rate integer not null check (match_rate between 0 and 100),
  image_path text not null,
  custom_color_name text,
  journal_answer text,
  locale text not null default 'ko' check (locale in ('ko', 'en')),
  weather_code integer,
  weather_group text,
  time_bucket text,
  mission_label text,
  mission_prompt text,
  abuse_warning boolean not null default false,
  unique (user_id, local_date)
);

alter table public.posts enable row level security;

drop policy if exists "Profiles are viewable by owner." on public.profiles;
create policy "Profiles are viewable by owner."
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile." on public.profiles;
create policy "Users can insert own profile."
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Posts are viewable by owner." on public.posts;
create policy "Posts are viewable by owner."
on public.posts for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own posts." on public.posts;
create policy "Users can insert own posts."
on public.posts for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own posts." on public.posts;
create policy "Users can update own posts."
on public.posts for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own posts." on public.posts;
create policy "Users can delete own posts."
on public.posts for delete to authenticated
using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-images', 'post-images', false, 524288, array['image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read own post images." on storage.objects;
create policy "Users can read own post images."
on storage.objects for select to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can upload own post images." on storage.objects;
create policy "Users can upload own post images."
on storage.objects for insert to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and storage.extension(name) = 'webp'
);

drop policy if exists "Users can update own post images." on storage.objects;
create policy "Users can update own post images."
on storage.objects for update to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and storage.extension(name) = 'webp'
);

drop policy if exists "Users can delete own post images." on storage.objects;
create policy "Users can delete own post images."
on storage.objects for delete to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
