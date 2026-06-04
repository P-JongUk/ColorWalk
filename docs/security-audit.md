# Security Audit Notes

Last checked: 2026-06-04 KST.

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

## Remaining Manual Dashboard Item

Supabase Security Advisor still reports `Leaked Password Protection Disabled`.

Supabase documents this under Auth password security and notes that leaked password protection is available on Pro plan and above. Enable it in Supabase Dashboard -> Auth -> Providers -> Email when the project plan supports it.

Reference: https://supabase.com/docs/guides/auth/password-security

## Local Environment Risk

The C drive currently has no free space. This blocks npm's default cache/log writing and Android emulator system image installation.

Current workaround:

```powershell
$env:npm_config_cache='D:\JongUk\Documents\ColorWalk\.npm-cache'
```

Before long-term development, free C drive space or move npm/Android SDK/AVD cache paths to D.
