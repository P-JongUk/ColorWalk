# Hueday Release Readiness Notes

## What Must Pass Before Sharing

- `npm run lint`
- `npm test -- --run`
- `npm run build`
- `npm run verify:supabase`
- `npm run seed:test-account`
- `npm run cap:sync`

Latest verification: 2026-06-04 KST. `lint`, `test`, `build`, `verify:supabase`, `seed:test-account`, `cap:sync`, Android debug APK build, Android release AAB build, and Vercel production deploy passed after the Hueday brand asset, no-location-story-save, and in-app PWA camera/zoom changes.

## PWA Beta

- Current HTTPS beta URL: `https://colorwalk-tau.vercel.app`
- Latest production deployment id: `dpl_C8P7CJvjmZHJNQm1NSjTrDXhxi49`
- Browser invite-code gate: disabled.
- Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_AUTH_EMAIL_DOMAIN`.
- Share the HTTPS URL with friends and have them sign up or sign in through the username/password beta flow.
- Android Chrome users can install from browser menu -> Add to Home screen / Install app.
- iOS users can install from Safari Share -> Add to Home Screen.
- PWA camera now defaults to in-app `getUserMedia` capture instead of opening the phone's native camera app from the shutter. Supported mobile browsers expose an in-app zoom slider through `MediaStreamTrack.applyConstraints({ zoom })`; unsupported browsers keep in-app capture and show a small native camera fallback button.
- PWA camera quality still depends on each browser/device. `ImageCapture.takePhoto()` is used when available for higher-resolution stills, then save-time WebP compression protects storage size. Physical phone QA remains required for lens choice, zoom range, low-light quality, and share-sheet behavior.
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

## GitHub

This repository is connected to:

```text
https://github.com/P-JongUk/ColorWalk.git
```

Push beta work to `main` unless a dedicated review branch is requested.

## Remaining Manual QA

- Android emulator QA on `ColorWalkPixel7` passed for location permission, camera permission, camera capture, journal save, same-day replacement confirm, history, native story share sheet, notification permission, and immediate test notification display.
- Latest Android outputs:
  - `android/app/build/outputs/apk/debug/app-debug.apk`
  - `android/app/build/outputs/bundle/release/app-release.aab`
- Real physical phone QA is still recommended for PWA install, camera feel, share targets installed on the user's phone, and notification behavior while the phone is locked.
- Android daily reminder delivery may be delayed by exact-alarm policy on Android 12+. The profile "테스트 알림 보내기" button verifies notification permission/channel/display immediately.
