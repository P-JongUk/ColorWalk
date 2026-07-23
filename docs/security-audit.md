# Security Audit Notes

Last checked: 2026-07-23 KST.

## Completed

- Browser code uses only `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Supabase service role key appears only in the `beta-signup` Edge Function.
- `posts`, `profiles`, `color_name_suggestions`, and `post-images` storage policies now reject anonymous Supabase users even though anonymous sign-in remains enabled for compatibility checks.
- `npm run verify:supabase` verifies:
  - anonymous sign-in still works
  - anonymous users cannot write profile data
  - password users can upsert profile metadata
  - color name suggestions are seeded
  - post insert/select/update path works
  - storage upload and signed URL work for the owner
  - another user cannot read the post or create a signed URL
- Journal/story saves intentionally write `null` for capture-location metadata. Location permission remains only for weather/time mission generation.

## 2026-06-04 Check

- `rg` found no `service_role`/`SUPABASE_SERVICE_ROLE_KEY` usage in browser code.
- `docs/*.private.md`, `.env*`, `.design-references/`, `.lazyweb/`, and Vercel local cache paths are ignored by git and Vercel upload rules.
- Supabase MCP Advisor could not run in this Codex session because the connector token had expired. The local `verify:supabase` script passed and still covers Auth, RLS, Storage owner checks, post CRUD, and signed URL denial for another user.

## 2026-07-23 Live Verification

`npm run verify:supabase` loaded the local browser environment without printing credentials and passed:

- anonymous sign-in compatibility
- anonymous data-write denial
- password-user profile upsert and beta metadata
- color-name suggestions
- owner storage upload and signed URL
- post upsert/select, story metadata, and grid image metadata
- cross-user post and storage denial
- capture-location metadata disabled

The live project still lacks the `posts.grid_images` migration and the app used `client_meta_fallback`. Apply `20260529200000_add_grid_images.sql` through an authenticated admin path, verify it live, then retire the fallback in a later compatible change.

The local-first/high-quality storage design in `docs/data-storage-sync-and-cost-strategy.md` is not implemented yet. Its migration must preserve existing cloud records, add owner RLS for new snapshots, avoid logging photo/journal/canvas content, and include export/account-deletion tests.

## Remaining Manual Dashboard Item

Supabase Security Advisor still reports `Leaked Password Protection Disabled`.

Supabase documents this under Auth password security and notes that leaked password protection is available on Pro plan and above. Enable it in Supabase Dashboard -> Auth -> Providers -> Email when the project plan supports it.

Reference: https://supabase.com/docs/guides/auth/password-security

## Local Environment Risk

The original C-drive capacity blocker has been mitigated at project level as of 2026-07-22. Capacity can still regress, so large project-generated data must remain on D.

Current persistent routing includes:

```powershell
$env:npm_config_cache='D:\JongUk\Documents\ColorWalk\.npm-cache'
$env:PIP_CACHE_DIR='D:\JongUk\Documents\ColorWalk\.pip-cache'
$env:PLAYWRIGHT_BROWSERS_PATH='D:\JongUk\Documents\ColorWalk\.playwright-browsers'
$env:GRADLE_USER_HOME='D:\GradleCacheColorWalk'
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\Avd'
```

The project workflow also routes task-specific `TEMP`/`TMP` and Vercel data to D. Windows-global temporary folders, Obsidian/JDK executables, and Codex's small global plugin registry remain on C to avoid breaking unrelated applications and desktop integration.
