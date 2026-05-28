# Release Readiness Notes

## What Must Pass Before Sharing

- `npm run lint`
- `npm test -- --run`
- `npm run build`
- `npm run verify:supabase`
- `npm run seed:test-account`
- `npm run cap:sync`

## PWA Beta

- Current HTTPS beta URL: `https://colorwalk-tau.vercel.app`
- Current friend invite code: `colorwalk-friends`
- Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_AUTH_EMAIL_DOMAIN`, and `VITE_BETA_INVITE_CODE`.
- Share the HTTPS URL plus invite code with friends.
- Android Chrome users can install from browser menu -> Add to Home screen / Install app.
- iOS users can install from Safari Share -> Add to Home Screen.
- Preferred free deployment path: Vercel Git import of `P-JongUk/ColorWalk`, with the env vars above configured in Vercel.
- Fallback path: GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.

## Security Checklist

- No `service_role` key in browser code or committed env files.
- RLS enabled on exposed public tables.
- Storage paths remain owner-scoped under `{auth.uid()}/...`.
- Uploads are WebP-only and size-guarded before storage upload.
- Invite code is a beta gate only; do not treat it as strong authentication.
- Keep `docs/*.private.md`, `.env*`, `.design-references/`, and `.lazyweb/` out of git.

## GitHub

This repository is connected to:

```text
https://github.com/P-JongUk/ColorWalk.git
```

Push beta work to `main` unless a dedicated review branch is requested.

## Remaining Manual QA

- Android emulator QA on `ColorWalkPixel7` passed for location permission, camera permission, camera capture, journal save, same-day replacement confirm, history, native story share sheet, notification permission, and immediate test notification display.
- Real physical phone QA is still recommended for PWA install, camera feel, share targets installed on the user's phone, and notification behavior while the phone is locked.
- Android daily reminder delivery may be delayed by exact-alarm policy on Android 12+. The profile "테스트 알림 보내기" button verifies notification permission/channel/display immediately.
