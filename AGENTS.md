# ColorWalk Codex Handoff

Read this file before coding in this repository.

## Current Product Direction

- Main target: Korean beta users, especially teens and young adults.
- Experience goal: soft, emotional, polished color diary/PWA with a camera-first habit loop.
- Visual source of truth: the original mobile mockups saved locally under `.design-references/00-target-mockup/`. These folders are local-only and ignored by git because they contain heavy screenshots/reference assets.
- Do not add ad monetization before beta. Future monetization ideas are premium story templates, palette packs, and monthly reports.

## Local Commands

If the C drive is full, route npm cache and temp writes to D before running npm commands:

```powershell
$env:npm_config_cache='D:\JongUk\Documents\ColorWalk\.npm-cache'
$env:TEMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:TMP='D:\JongUk\Documents\ColorWalk\.tmp'
New-Item -ItemType Directory -Force .tmp | Out-Null
```

```powershell
npm run lint
npm test -- --run
npm run build
npm run verify:supabase
npm run seed:test-account
npm run cap:sync
```

Android build commands require JDK 21:

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
cd android
.\gradlew.bat :app:assembleDebug --console=plain
.\gradlew.bat :app:bundleRelease --console=plain
```

## Environment

Required browser env vars:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_AUTH_EMAIL_DOMAIN
VITE_BETA_INVITE_CODE
```

Only publishable Supabase keys may be used in Vite/browser code. Service role keys are allowed only in Supabase Edge Functions or local admin tooling and must never be committed.

## Supabase

- Project id: `nhsvmypztjyhqunixxeg`
- App tables: `profiles`, `posts`, `color_name_suggestions`
- Storage bucket: `post-images`
- Account creation path: username/password form calls the deployed `beta-signup` Edge Function, then signs in through Supabase Auth.
- RLS/storage policies are owner-scoped by `auth.uid()`.
- `npm run verify:supabase` must keep checking anonymous sign-in, anonymous data-write denial, password-user profile upsert, post CRUD, signed storage read, and cross-user denial.

## Beta Test Account

Use `npm run seed:test-account` to create/update the shared beta test account and seed demo posts. The private credentials are stored in `docs/beta-test-account.private.md` and should stay out of git.

When coding or QA-ing account-specific flows, sign in with that account unless the task specifically needs a fresh signup.

## Android Local Paths

- JDK 21: `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`
- Android SDK: `C:\Users\JongUk\AppData\Local\Android\Sdk`
- ADB: `C:\Users\JongUk\AppData\Local\Android\Sdk\platform-tools\adb.exe`
- Debug APK: `D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk`
- Release AAB: `D:\JongUk\Documents\ColorWalk\android\app\build\outputs\bundle\release\app-release.aab`

Current emulator blocker: the C drive has no free space, so Android system image/AVD creation failed. Keep future emulator storage on D drive by setting `ANDROID_SDK_ROOT`/`ANDROID_AVD_HOME` to D-drive folders or free C-drive space before installing system images.

## Design QA Routine

1. Capture 430x932 screenshots for auth, home, camera, journal, story editor, history, and profile.
2. Save current captures under `.design-references/01-current-screens/`.
3. Compare against `.design-references/00-target-mockup/` before deciding a design pass is done.
4. For story/sticker UX, compare against `.design-references/02-lazyweb-story-editor/`, `.design-references/03-stickers/`, and `.design-references/04-template-gallery/`.

## Release Rules

- PWA must be served over HTTPS for camera/location/install behavior.
- Invite code is a friend-only beta gate, not security.
- Browser build must not expose service role keys or local private docs.
- Before sharing a URL, run lint/test/build/Supabase verification and one browser QA path from login to story export.
