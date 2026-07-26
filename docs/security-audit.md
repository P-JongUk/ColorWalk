# Security Audit Notes

## Product boundary update (2026-07-26)

- First release has no public/anonymous user-generated image surface, feed, Relay, or Hue Drop. This is an intentional safety boundary, not a missing implementation.
- If Hue Drop is approved after launch, invite viewing must be isolated from public discovery and authenticated membership must be required before upload. Add member-scoped RLS, atomic server-side slot reservation, file/type/size checks, EXIF location stripping, invite revocation, remove/report/block controls, and member-only preview reads before rollout. These controls are planned, not implemented or live.
- Deck screens must derive from existing owner records and analytics must not contain photos, journal text, exact location, tokens, or device fingerprints.

## Maintenance and verification scope (2026-07-26)

- Initial architecture protects likely harm: owner isolation, unauthenticated write denial, duplicate-safe writes, offline recovery, and update compatibility. It does not pretend to operate a 100-million-user social network before there are users.
- QA prioritizes the changed normal journey and one likely recovery journey. Fuzzing impossible UI inputs, exhaustive device-state matrices, and speculative scale/load work are P2 until a security boundary, telemetry, beta report, or release incident justifies them.
- A future public image community requires a separate moderation, abuse-response, retention, and operating-cost approval; it is not unlocked merely by adding report buttons.

## M2 product events (2026-07-26)

- `product_events` migration은 새 table/index와 authenticated owner-only select/insert RLS만 추가한다. event name은 `screen_viewed`, `session_summary`, `primary_cta_clicked`로 제한하고 payload JSON은 `screen`, `foreground_seconds`, `cta`, `delivery` 키만 허용한다. 따라서 사진·일기·정확 위치·비밀번호·토큰·device fingerprint는 앱과 DB 계약 모두에서 거절된다. 앱은 전송 실패 시 IndexedDB outbox를 보존한다.
- `20260724030000_add_product_events.sql`은 2026-07-26에 live project `nhsvmypztjyhqunixxeg`에 적용됐다. `npm run verify:supabase`가 `productEvents.ready`, owner read, duplicate safety, anonymous-write denial, cross-user read denial을 확인했다. 비파괴적 비활성화 경로는 앱 flush 제거 또는 새 table insert 권한 revoke이며, table drop은 destructive 승인 대상이다.
- `grid_images` migration과 과거 remote migration history 불일치는 별도 후속 작업이다. 이 관측성 변경은 기존 Post, Storage, RLS를 repair하거나 변경하지 않는다.
- 베타 분석은 allowlist 이벤트와 집계 SQL만 사용한다. 출시 후 관리자 웹 화면을 만들 경우 browser에 service role을 두지 않고 aggregate-only Edge Function, 관리자 UID allowlist, 원시 사진·일기·정확 위치 비노출을 보안 gate로 둔다.

Last checked: 2026-07-26 KST.

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

M2-2 local-first/high-quality storage is implemented without a new cloud table, RLS-policy change, or raw/master upload: owner-scoped local records keep PWA Blob/Android `Directory.Data` masters and Supabase receives preview-only WebP plus existing Post metadata. The remaining manual archive and account export/delete work must still preserve cloud records, avoid logging photo/journal/canvas content, and include deletion tests.

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
