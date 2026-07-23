-- Additive M2 funnel observability only. It does not read, rewrite, or delete posts.
create table public.product_events (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null check (event_name in (
    'signup_completed',
    'mission_viewed',
    'capture_started',
    'first_photo_confirmed',
    'partial_record_saved',
    'grid_completed',
    'journal_saved',
    'story_exported',
    'story_share_opened'
  )),
  dedupe_key text not null,
  local_date date not null,
  occurred_at timestamptz not null,
  platform text not null check (platform in ('web', 'android')),
  app_version integer not null check (app_version = 1),
  payload jsonb not null default '{}'::jsonb check (
    jsonb_typeof(payload) = 'object'
    and octet_length(payload::text) <= 1024
  ),
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (owner_id, dedupe_key)
);

create index product_events_event_name_occurred_at_idx
  on public.product_events (event_name, occurred_at desc);

alter table public.product_events enable row level security;

revoke all on table public.product_events from anon, authenticated;
grant select, insert on table public.product_events to authenticated;

create policy "Users can read own product events."
on public.product_events for select to authenticated
using (
  ((select auth.uid()) = owner_id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

create policy "Users can insert own product events."
on public.product_events for insert to authenticated
with check (
  ((select auth.uid()) = owner_id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);
