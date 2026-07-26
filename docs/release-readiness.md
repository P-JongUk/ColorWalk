# Hueday Release Readiness Notes

## M2 observability gate (2026-07-24)

- Core funnel events and local outbox are implemented on `feature/core-funnel-observability`; live `product_events` collection remains pending until an authenticated Supabase admin path is available. Before enabling it, rerun migration diff/project/schema/rollback checks and `npm run verify:supabase`.
- The local 430×932 Playwright core-funnel runner uses `VITE_E2E_LOCAL_ONLY=true` and no private account. It is a regression path for M1 capture→8 photos→journal save; real Android device/AVD QA remains a separate release gate.

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

Language follow-up:

- `Locale` currently supports `ko` and `en`, but first launch defaults to `ko` unless a saved preference exists and several screens still use inline locale ternaries.
- This does not block a Korean-first Play beta.
- Before an international listing, detect supported device locale on first launch, centralize remaining inline copy, and run 430x932 Korean/English clipping and accessibility screenshots.
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
