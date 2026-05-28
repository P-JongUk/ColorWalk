alter table public.posts
  add column if not exists story_template_id text not null default 'passport',
  add column if not exists story_stickers jsonb not null default '[]'::jsonb,
  add column if not exists client_meta jsonb not null default '{}'::jsonb,
  add column if not exists location_name text,
  add column if not exists location_latitude double precision,
  add column if not exists location_longitude double precision,
  add column if not exists location_accuracy_m integer;

alter table public.posts
  drop constraint if exists posts_story_template_id_check,
  add constraint posts_story_template_id_check
    check (story_template_id in ('mongle', 'travel', 'modern', 'newspaper', 'polaroid', 'passport', 'receipt', 'minimal')),
  drop constraint if exists posts_story_stickers_array_check,
  add constraint posts_story_stickers_array_check
    check (jsonb_typeof(story_stickers) = 'array'),
  drop constraint if exists posts_client_meta_object_check,
  add constraint posts_client_meta_object_check
    check (jsonb_typeof(client_meta) = 'object'),
  drop constraint if exists posts_location_latitude_check,
  add constraint posts_location_latitude_check
    check (location_latitude is null or location_latitude between -90 and 90),
  drop constraint if exists posts_location_longitude_check,
  add constraint posts_location_longitude_check
    check (location_longitude is null or location_longitude between -180 and 180),
  drop constraint if exists posts_location_accuracy_check,
  add constraint posts_location_accuracy_check
    check (location_accuracy_m is null or location_accuracy_m between 0 and 100000);
