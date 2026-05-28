# Android Local Environment

This machine has the Android build toolchain split across C and D drives.

## Confirmed Paths

- JDK 21: `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`
- Android SDK: `C:\Users\JongUk\AppData\Local\Android\Sdk`
- ADB: `C:\Users\JongUk\AppData\Local\Android\Sdk\platform-tools\adb.exe`
- Project: `D:\JongUk\Documents\ColorWalk`
- Debug APK: `D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk`
- Release AAB: `D:\JongUk\Documents\ColorWalk\android\app\build\outputs\bundle\release\app-release.aab`

## Build

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
npm run cap:sync
cd android
.\gradlew.bat :app:assembleDebug --console=plain
.\gradlew.bat :app:bundleRelease --console=plain
```

## Device QA

```powershell
C:\Users\JongUk\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
C:\Users\JongUk\AppData\Local\Android\Sdk\platform-tools\adb.exe install -r D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk
```

## Current Emulator Blocker

`adb devices` currently returns no connected devices, and no AVD is registered. Attempting to install an Android 36 emulator image failed because the C drive had 0 bytes free. D drive has enough space.

Recommended next fix:

```powershell
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_HOME='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\.android\avd'
```

Then install command-line tools/system images into the D-drive SDK or create an AVD from Android Studio after moving SDK/AVD locations to D.
