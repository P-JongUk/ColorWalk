# Hueday Play Store Internal Testing

Use this when you want friends to install Hueday through Google Play instead of sideloading an APK.

## What You Need

- A Google Play Console developer account.
- The Hueday app created in Play Console.
- Tester Google account emails.
- A signed release `.aab` file.
- A confirmed permanent package ID and upload key.

## Build Locally

Capacitor Android currently needs JDK 21 for this project. On this PC, use:

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_HOME='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\Avd'
$env:GRADLE_USER_HOME='D:\GradleCacheColorWalk'
$env:TEMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:TMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:GRADLE_OPTS='-Djava.io.tmpdir=D:\JongUk\Documents\ColorWalk\.tmp'
```

```powershell
npm run build
npx cap sync android
cd android
.\gradlew.bat --console=plain --no-daemon --max-workers=1 --no-watch-fs --no-build-cache :app:bundleRelease
```

Expected output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Latest local AAB build: 2026-07-23 KST, using `D:\GradleCacheColorWalk` and D-drive temp paths. The build succeeded with `targetSdk 36`, but `jarsigner -verify` confirmed that the current release AAB is unsigned. Configure an upload key and Play App Signing before upload.

Current identity:

- Public app name: `Hueday`
- Current package/application ID: `com.colorwalk.app`
- Current version: `versionCode 1`, `versionName 1.0`

Confirm `com.colorwalk.app` before creating the first Play app. A package ID should be treated as permanent after the first upload. Increase `versionCode` for every uploaded bundle.

## Play Console Steps

### Korean/English listing and international release preparation (M7; do not perform before the app locale gate)

1. In Store presence, set the default language deliberately, then add Korean and English translations. Enter each language's app name, short description, full description, screenshots, feature graphic, and release notes; do not reuse Korean text as English placeholder copy.
2. Prepare language-specific screenshots and graphic assets that show the matching Korean or English app UI. Keep source files and final asset dimensions traceable for review.
3. Set release notes separately for Korean and English for the selected release.
4. Configure supported countries/regions independently from track selection. Internal, closed, open, and production tracks control tester/audience progression; country/region availability controls where a released listing can be distributed.
5. Add a review login account and clear access instructions. Verify that it reaches the requested app experience without relying on unpublished credentials or personal accounts.
6. On a device with an overseas/non-Korean locale, verify that the English listing appears where available and that the installed app resolves to English under `시스템 설정`; also verify the explicit `한국어` and `English` app choices.

1. Open Play Console.
2. Create or open the Hueday app.
3. Complete the required app content sections, privacy policy, Data Safety, account deletion, and permission declarations.
4. Go to Testing -> Internal testing.
5. Create a testers list with friend Google account emails.
6. Upload `app-release.aab`.
7. Add release notes:

```text
Hueday friend beta: daily color mission, in-app camera capture with supported zoom controls, journal, history, story templates, stickers, and 9:16 story export/share.
```

8. Roll out to internal testing.
9. Share the opt-in link with testers.

## Store Copy Draft

Short description:

```text
오늘의 색을 찾고, 3x3 컬러 그리드와 9:16 스토리로 기록하는 데일리 컬러 다이어리.
```

Permission explanation:

```text
Hueday uses camera access to capture real-world colors and location access only to choose a weather/time-based daily color mission. The app does not save the user's capture location in journal or story entries.
```

Privacy note:

```text
Hueday stores each tester's entries under their Supabase user ID. Entries are private and protected by owner-scoped database and storage policies.
```

## Notes

- Internal testing is easier for friends than APK sideloading, but it still requires Play Console setup.
- The web beta remains the fastest path for same-day feedback.
- Direct Instagram Stories native integration is not part of this beta. Testers can save/share the generated story image manually.
- `android:allowBackup="true"` still needs a privacy/data-extraction review before store release; Hueday's explicit local archive/Cloud design is the product backup contract.
