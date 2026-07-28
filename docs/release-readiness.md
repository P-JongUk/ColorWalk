# Hueday Release Readiness Notes

## Post-launch payment update gate (approved 2026-07-28)

- Version 1 launches without billing. Payment is the priority `M8M` update only after one real in-place update preserves the signed-in user's draft/master, history, Deck, Hueprint/Capsule, Story, and free export.
- Follow `docs/post-launch-monetization-and-payment-safety.md`. Add billing and entitlement separately from Posts, media assets, and local masters; do not pass the gate by uninstalling or clearing app data.
- Before rollout, verify Play license-tester purchase, cancellation, pending-to-purchased, restore, refund/revocation, logout/account switch, and the unchanged free path on a physical device.
- Hueday Cloud is not part of this gate until measured storage/egress and backup/restore/retention behavior are separately approved.

## Launch-scope and update-safety gate (2026-07-26)

- First release is a personal product: Color Hunt, local-first recovery, Living Hue Deck, Color Volume, M4 explicit-pack collections, M5 Hueprint, and existing Story export. Hue Canvas, Hue Drop, Relay, public feeds, and anonymous UGC are out of scope.
- Before a version that changes persistence ships, verify one Android in-place update and one PWA Service Worker update with existing login, daily draft/master, history, Deck source record, and Story retained. Additive DB changes must preserve ordinary reads/writes from a supported prior app version.
- The release journey to verify is login → mission → capture/recover → Deck state → source 3×3/history → existing Story export; add M5 Hueprint only after it exists. Do not substitute a future social flow for this gate.

## M3 Living Hue Deck checkpoint (2026-07-27)

- No DB schema or migration changed. Deck derives cards from the merged daily records and uses the existing `grid_images → client_meta.gridImages → image_path` recovery chain.
- A 430×932 local-only browser fixture covered `기록 / Deck`, 1/3/5/8, canonical Color Volume, device-only 8/8 labeling, Volume → source history, and existing Story Studio. The captured artifact paths are in `docs/design-qa-log.md`.
- Final branch gates passed: lint; Vitest 12 files/40 tests; production build; live `verify:supabase` (including product-event dedupe, anonymous and cross-user denial); Capacitor sync; and `:app:assembleDebug` (BUILD SUCCESSFUL). Physical Android in-place update QA remains the pre-release gate described above.

## Hue Canvas post-launch update gate (2026-07-26)

- Hue Canvas is a mandatory early post-launch feature update, not part of version 1. Hue Drop remains the first social update.
- Build the release candidate from a fresh production branch; review and selectively port G1 code from `feature/hue-canvas-prototype` instead of merging the prototype branch wholesale.
- Test an in-place Android update signed through the same package/signing lineage and a PWA Service Worker update using a populated prior-version fixture. Retain auth, 1/7/8-photo records, pending/error sync state, local masters, history, Deck, journal, and Story.
- Palette must be derived from existing completed records. Do not rewrite Posts or local masters into Canvas data.
- Recipe migrations must keep the previous readable copy until the new version is opened, rendered, saved, closed, and reopened successfully.
- A feature-gate rollback may hide Canvas but must not delete recipes. Additive cloud schema, if required, must keep prior app Color Hunt/Post reads and writes working.

## M2 observability gate (2026-07-26)

- Core funnel events and local outbox are implemented on `feature/core-funnel-observability`; `20260724030000_add_product_events.sql` is live on `nhsvmypztjyhqunixxeg`. `npm run verify:supabase` confirmed `productEvents.ready`, owner read, duplicate safety, anonymous-write denial, and cross-user read denial. No additional analytics deployment is required for beta aggregate queries.
- `20260529200000_add_grid_images.sql` and the older remote migration-history discrepancy remain a separate follow-up. Keep the current `client_meta_fallback`; do not apply, repair, backfill, or retire it as part of M2-1.
- The local 430×932 Playwright core-funnel runner uses `VITE_E2E_LOCAL_ONLY=true` and no private account. It verifies capture→first-photo reload recovery→8 photos→permission-denied album recovery→journal save→Story download. Real Android device/AVD QA remains a separate release gate.

## M2-2 local master / offline sync gate (2026-07-26)

- `npm run cap:sync` rebuilt the web bundle and synchronized Android assets/plugins. A fresh debug APK was generated (17,955,823 bytes).
- The supplied checkpoint results remain passing and were not rerun: lint, Vitest (10 files/25 tests), production build, and live Supabase verification including RLS, Storage, product-events, and the expected `grid_images` client-meta fallback.
- A 430×932 local PWA smoke pass reached Home and Camera; the camera collection controls rendered without a blocking layout failure.
- `ColorWalkPixel7` first missed the 60-second ADB-ready window; after boot it rejected the fresh APK with `INSTALL_FAILED_UPDATE_INCOMPATIBLE` (existing package has another signature) and System UI ANR became the active window. Current Android install/camera/offline/retry QA is therefore still required on a clean stable AVD or physical device; do not treat this as a passing Android checkpoint.

## M2-3 local master cleanup / update safety gate (2026-07-26)

- Code and narrow tests cover the normal confirmed cleanup path plus preview-preflight refusal, restart-safe `cleaned`/`cleanup-pending` lifecycle handling, partial Android deletion result separation, remaining-ready retry, and daily record/uploadPath/journal/Story metadata/revision preservation. Full merge verification passed: lint, 11 Vitest files/31 tests, production build, live Supabase verification, Capacitor sync, and Android debug APK build.
- PWA populated-fixture update passed on the fixed `http://127.0.0.1:5180` origin. After rebuilding baseline v3 with the same browser-only Supabase configuration, the password-user session remained `Cloud sync`; baseline displayed the seeded 8/8 record, journal, and Story editor, then created a logged-in 1/8 draft with a 44,214-byte IndexedDB master Blob. Replacing the served build with candidate v4, calling `registration.update()`, and reloading replaced `hueday-shell-v3-safe-icons` with `hueday-shell-v4-master-cleanup` under an active controller. The same user-owned 1/8/master, 8/8 history (8 recorded days, 3 complete grids, 38 photos), journal, and Story editor remained readable. A separate offline toggle retained the v4 cache plus that IndexedDB draft/master; this only verifies local metadata/cache retention, not original-quality restore or high-quality Story regeneration after cleanup.
- Android in-place QA remains a release gate, with app and environment evidence kept separate. `ColorWalkM1QA` booted from the D-drive SDK/AVD and accepted the baseline APK via `adb install -r`, but the D SDK Gradle build stalled while provisioning Build-Tools 35, and the baseline album-import attempt ended when the emulator/System UI disconnected ADB. `ColorWalkPixel7` booted but refused the exact non-destructive baseline install with `INSTALL_FAILED_UPDATE_INCOMPATIBLE` because its pre-existing `com.colorwalk.app` has a different signature. Both baseline/candidate debug APKs themselves use `com.colorwalk.app`, versionCode 1/versionName 1.0 unchanged, and the same debug certificate SHA-256 `4d270595c837ca18f577412ca664c7327ffe263bfc132f909899d90f0ba7e7a8`; no uninstall or app-data deletion was performed. These failures precede the M2-3 cleanup code path and are environment/signing failures, not evidence of an app preservation defect.
- Minimum remaining physical-device procedure: install the baseline signed from the same debug/release signing lineage, sign in, make one 1/8 draft/master and one synced 8/8 record with journal/Story; run `adb install -r <candidate.apk>` without uninstall or clear-data; verify login, both records, journal, and Story; clean one verified record, force-stop immediately after confirmation, reopen, and verify only `cleanup-pending` reconciliation occurred and record/preview/sync metadata remains intact. Play upload-key/App Signing and a real Play release remain separate gates.
- Actual Play release signing/versioning and HTTPS beta deployment are intentionally outside this checkpoint. No DB migration, server deletion, automatic cleanup, bulk cleanup, Cloud backup, or future feature infrastructure was added.

## What Must Pass Before Sharing

- `npm run lint`
- `npm test -- --run`
- `npm run build`
- `npm run verify:supabase`
- `npm run seed:test-account`
- `npm run cap:sync`

Latest full release verification: 2026-06-04 KST. `lint`, `test`, `build`, `verify:supabase`, `seed:test-account`, `cap:sync`, Android debug APK build, Android release AAB build, and Vercel production deploy passed after the safe-zone launcher icon, unlocked shuffle button explanation, post-save draft cleanup, and natural one-line journal UX changes.

Latest code/document alignment audit: 2026-07-22 KST. This audit corrected stale product, auth, Git, storage, and iOS statements; it does not replace the full release verification date above.

Latest development preflight: 2026-07-23 KST. `lint`, six test files/17 tests, production `build`, `cap:sync`, live `verify:supabase`, and Android release AAB generation passed. The generated `app-release.aab` is unsigned, and account seeding, physical-device QA, Play Console upload, and deployment were not rerun, so this is not a store-release checkpoint.

M1 final pre-merge verification: 2026-07-24 KST on `feature/color-hunt-contract`. `npm run lint`, 8 test files/19 tests, production `build`, live `verify:supabase`, `cap:sync`, Android debug APK, and release AAB passed. The shared test account was reseeded with five M1 `colorHunt` demo records on 2026-07-23 through 19 so today starts empty. 430×932 browser QA covered Color Hunt start/reroll/capture confirmation/recovery/progress/completion/date boundary and journal/story/history/profile. A separate `ColorWalkM1QA` AVD verified actual camera permission, capture/retake/confirmation, 1/8 save, background/foreground recovery, and 2/8·5/8 sequential capture without touching `ColorWalkPixel7`. A global date mock was not valid for Android date QA because it advanced Supabase authentication time; afterward, a clean `wipe-data` cold boot reproduced ANRs in System UI, phone, and Google Play services before the app was installed. The remaining Android 7/8·8/8 completion/badge, foreground date transition, journal save, and native Story share checks remain required on a stable emulator or physical device. This is not a store-release checkpoint and does not replace physical-device QA.

## 2026-07-23 Google Play Structure Audit

Ready foundations:

- Capacitor Android app exists and production web assets sync successfully.
- `namespace` and `applicationId` are `com.colorwalk.app`; public app name is `Hueday`.
- `minSdk 24`, `compileSdk 36`, `targetSdk 36`, `versionCode 1`, `versionName 1.0`.
- Release AAB was generated at `android/app/build/outputs/bundle/release/app-release.aab`.
- Korean/English locale types and copy exist. Korean-first default and manual language selection are suitable for the first Korean beta.

Must close before first Play upload:

- Confirm that `com.colorwalk.app` is the permanent package identity and available in the intended Play Console account. Do not rename it automatically.
- Create and protect an upload key, enable Play App Signing, and add a reproducible release signing path. The 2026-07-23 local AAB is unsigned.
- Define versionCode/versionName increment rules.
- Add an in-app account deletion path and a public web deletion-request path.
- Complete Play Data Safety answers and a public privacy policy using actual Auth, photo, journal, location, analytics, backup, deletion, and retention behavior.
- Review `android:allowBackup="true"` against private diary data and the explicit Hueday archive/Cloud policy; OS backup is not a substitute for product backup.
- Run Play pre-launch report and physical Android QA after signing.

## Korean/English locale and international Play release gate (approved, not yet implemented or submitted)

App locale — M6 implementation and QA:

- Detect the device/browser language for first launch. `시스템 설정`, `한국어`, and `English` resolve one effective locale; an explicit choice is stored only on the device.
- Confirm whether Android per-app language settings are connected to the same contract; do not claim this is complete until a real Android device verifies it.
- Check Korean and English UI at 430×932, 360px, and 200% zoom, plus a real Android device. Include date/time, weather, notifications, errors, accessibility labels, and Story/Hueprint/Capsule exports.
- User-authored journals, color-name suggestions, and existing records are never automatically translated or rewritten.

Play Console and policy — M7 release gate:

- Choose the Play Console default language and complete both Korean and English store listings: app name, short description, full description, screenshots, feature graphic, and release notes.
- Confirm supported countries/regions and the intended availability for each release track.
- Publish Korean and English privacy-policy and support pages, then reconcile them with actual camera, photo, authentication, approximate-location/weather, analytics, retention, and deletion behavior.
- Complete and re-check Data Safety, target audience, IARC content rating, no-ads declaration, review login account/access instructions, and every in-app disclosure against actual behavior.

Language follow-up:

- `Locale` currently supports `ko` and `en`, but first launch defaults to `ko` unless a saved preference exists and several screens still use inline locale ternaries.
- This does not block a Korean-first Play beta.
- Before any international listing, complete the M6/M7 gate above; this audit is not evidence that locale implementation, policy materials, or Play submission is complete.
- M1 must remove legacy walk-only, match-rate, and streak wording that conflicts with the approved product direction.

Official policy references were rechecked on 2026-07-23:

- Google Play target API policy: <https://support.google.com/googleplay/android-developer/answer/16561298?hl=en>
- Account deletion: <https://support.google.com/googleplay/android-developer/answer/13327111?hl=en-EN>
- Data Safety: <https://support.google.com/googleplay/android-developer/answer/10787469?hl=en>
- Play App Signing: <https://support.google.com/googleplay/android-developer/answer/9842756?hl=en>

## PWA Beta

- Current HTTPS beta URL: `https://colorwalk-tau.vercel.app`
- Latest production deployment id: `dpl_G5ZcjDLTykUB4DNJsRXM5s7FBGGG`
- Browser invite-code gate: disabled.
- Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_AUTH_EMAIL_DOMAIN`.
- Share the HTTPS URL with friends and have them sign up or sign in through the username/password beta flow.
- Android Chrome users can install from browser menu -> Add to Home screen / Install app.
- iOS users can install the PWA from Safari Share -> Add to Home Screen. This is not an App Store release. Native iOS support is not yet scaffolded because `@capacitor/ios` and an `ios/` project are absent; see `docs/hueday-breakout-strategy.md` for the macOS build/signing paths.
- PWA camera now defaults to in-app `getUserMedia` capture instead of opening the phone's native camera app from the shutter. Supported mobile browsers expose an in-app zoom slider through `MediaStreamTrack.applyConstraints({ zoom })`; unsupported browsers keep in-app capture and show a small native camera fallback button.
- PWA camera quality still depends on each browser/device. `ImageCapture.takePhoto()` is used when available for higher-resolution stills, then save-time WebP compression protects storage size. Physical phone QA remains required for lens choice, zoom range, low-light quality, and share-sheet behavior.
- Installed PWA icons use padded maskable-safe artwork. If a phone still shows the cropped old icon, remove the old home-screen app and reinstall because Android/iOS launchers cache installed icons aggressively.
- Story template/sticker tools are enabled by default. Set `VITE_SIMPLE_STORY_EDITOR=true` only if a beta build needs the simplified export-only story editor.
- Preferred free deployment path: Vercel Git import of `P-JongUk/ColorWalk`, with the env vars above configured in Vercel. Public product name is Hueday; repository/project names may still use the original ColorWalk codename.
- Fallback path: GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.

## Security Checklist

- No `service_role` key in browser code or committed env files.
- RLS enabled on exposed public tables.
- Storage paths remain owner-scoped under `{auth.uid()}/...`.
- Uploads are WebP-only and size-guarded before storage upload.
- Journal/story saves no longer persist the user's current capture location. Location permission is only used for weather/time mission generation.
- Do not treat the old invite-code gate as security; beta access depends on the authenticated account flow.
- Keep `docs/*.private.md`, `.env*`, `.design-references/`, and `.lazyweb/` out of git.
- Local-first storage is an approved target, not current implementation. Before migration, preserve existing Supabase records and document rollback/compatibility.

## GitHub

This repository is connected to:

```text
https://github.com/P-JongUk/ColorWalk.git
```

Use `main` as the integration branch. Start large features from the latest `main` on `feature/<feature-name>` without a `codex/` prefix, commit in focused Korean checkpoints, push the feature branch, verify the full diff, and then merge it into `main`.

## Remaining Manual QA

- Manual QA follows the repository risk tiers: verify the reachable core journey and one likely recovery path for the changed feature. Keep security, cross-user denial, secret exposure, signing, account deletion, and data-loss checks even when rare. Defer impossible UI inputs, unsupported environments, arbitrary catalog-external values, and exhaustive state/device/network combinations until evidence makes them relevant.
- Android emulator QA on `ColorWalkPixel7` passed for location permission, camera permission, camera capture, journal save, same-day replacement confirm, history, native story share sheet, notification permission, and immediate test notification display.
- Latest Android outputs:
  - `android/app/build/outputs/apk/debug/app-debug.apk`
  - `android/app/build/outputs/bundle/release/app-release.aab`
- The 2026-07-23 release AAB build succeeded but `jarsigner -verify` reported `jar is unsigned`; it cannot be submitted until release signing is configured.
- Real physical phone QA is still recommended for PWA install, camera feel, share targets installed on the user's phone, and notification behavior while the phone is locked.
- Android daily reminder delivery may be delayed by exact-alarm policy on Android 12+. The profile "테스트 알림 보내기" button verifies notification permission/channel/display immediately.
