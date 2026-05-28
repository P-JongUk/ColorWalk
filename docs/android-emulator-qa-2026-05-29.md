# Android Emulator QA - 2026-05-29 KST

Device: `ColorWalkPixel7` AVD  
SDK: `D:\Android\Sdk`  
AVD home: `D:\Android\Avd`  
App id: `com.colorwalk.app`

## Result

The Android emulator path is usable again from the D-drive SDK/AVD setup. The debug app installed and the main app-first flows were verified.

## Verified Flows

- Location permission prompt appeared and was allowed.
- Supabase session persisted in the Android WebView after beta test account sign-in.
- Camera permission prompt appeared and was allowed.
- Camera preview opened with the emulator camera feed.
- Capture moved into journal with sampled color, match rate, receipt, and location toggle.
- Same-day save showed the replacement confirmation dialog.
- Save succeeded and history showed the updated post.
- History story editor opened with 9:16 template/export UI.
- Native Android story share opened the system share sheet with a PNG preview after adding Capacitor Filesystem/Share.
- Profile daily reminder permission prompt appeared and was allowed.
- Profile test notification displayed immediately in the Android notification shade.

## Evidence

Screenshots and dumps are stored under `.design-references/01-current-screens/`:

- `android-after-location-emulator.png`
- `android-camera-emulator.png`
- `android-journal-after-capture-emulator.png`
- `android-history-after-save-emulator.png`
- `android-story-editor-emulator.png`
- `android-share-sheet-emulator.png`
- `android-notification-after-tap.png`
- `android-notification-enabled.png`
- `android-test-notification-shade.png`
- `android-test-notification-dumpsys.txt`

## Notes

- Direct adb typing into the React username/password form was unreliable, so session recovery was verified through WebView DevTools after `npm run seed:test-account` confirmed the account.
- Repeating daily notifications are queued through Android alarm manager. On Android 12+, exact-alarm policy may delay the visible notification; the beta-facing "테스트 알림 보내기" action verifies notification permission/channel/display immediately.
- Physical phone QA is still recommended for PWA install, installed share targets, camera feel, and lock-screen notification behavior.
