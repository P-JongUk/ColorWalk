# Hueday Play Store Internal Testing

Use this when you want friends to install Hueday through Google Play instead of sideloading an APK.

## What You Need

- A Google Play Console developer account.
- The Hueday app created in Play Console.
- Tester Google account emails.
- A release `.aab` file.

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

Latest local AAB build: 2026-06-04 KST, using `D:\GradleCacheColorWalk` and D-drive temp paths because C drive had 0 GB free.

## Play Console Steps

1. Open Play Console.
2. Create or open the Hueday app.
3. Complete required app content sections enough for internal testing.
4. Go to Testing -> Internal testing.
5. Create a testers list with friend Google account emails.
6. Upload `app-release.aab`.
7. Add release notes:

```text
Hueday friend beta: daily color mission, camera color capture, journal, history, and story export.
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
