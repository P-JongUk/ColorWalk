alter table public.posts
  add column if not exists grid_images jsonb not null default '[]'::jsonb;

alter table public.posts
  drop constraint if exists posts_grid_images_array_check,
  add constraint posts_grid_images_array_check
    check (jsonb_typeof(grid_images) = 'array'),
  drop constraint if exists posts_story_template_id_check,
  add constraint posts_story_template_id_check
    check (
      story_template_id in (
        'mongle',
        'travel',
        'modern',
        'newspaper',
        'polaroid',
        'passport',
        'receipt',
        'minimal',
        'soft-passport',
        'life-cut',
        'air-trip',
        'modern-grid',
        'newsprint',
        'polaroid-grid',
        'sponsor-clean',
        'color-ticket'
      )
    );
