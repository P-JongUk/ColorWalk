-- Tighten beta data access so anonymous Supabase users cannot read/write app data.
-- Anonymous sign-in can remain enabled for future flows, but ColorWalk beta data
-- should require a permanent username/password session.

alter policy "Profiles are viewable by owner."
on public.profiles
using (
  ((select auth.uid()) = id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can insert own profile."
on public.profiles
with check (
  ((select auth.uid()) = id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can update own profile."
on public.profiles
using (
  ((select auth.uid()) = id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
)
with check (
  ((select auth.uid()) = id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Posts are viewable by owner."
on public.posts
using (
  ((select auth.uid()) = user_id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can insert own posts."
on public.posts
with check (
  ((select auth.uid()) = user_id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can update own posts."
on public.posts
using (
  ((select auth.uid()) = user_id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
)
with check (
  ((select auth.uid()) = user_id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can delete own posts."
on public.posts
using (
  ((select auth.uid()) = user_id)
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Authenticated users can read color names."
on public.color_name_suggestions
using (
  coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can read own post images."
on storage.objects
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = ((select auth.uid()))::text
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can upload own post images."
on storage.objects
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = ((select auth.uid()))::text
  and storage.extension(name) = 'webp'
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can update own post images."
on storage.objects
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = ((select auth.uid()))::text
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
)
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = ((select auth.uid()))::text
  and storage.extension(name) = 'webp'
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

alter policy "Users can delete own post images."
on storage.objects
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = ((select auth.uid()))::text
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);
