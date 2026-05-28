# Android Local Environment

This machine has the Android build toolchain split across C and D drives.

## Confirmed Paths

- JDK 21: `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`
- Primary Android SDK: `D:\Android\Sdk`
- Primary AVD home: `D:\Android\Avd`
- Working AVD: `ColorWalkPixel7`
- ADB: `D:\Android\Sdk\platform-tools\adb.exe`
- Legacy C-drive SDK: `C:\Users\JongUk\AppData\Local\Android\Sdk`
- Project: `D:\JongUk\Documents\ColorWalk`
- Debug APK: `D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk`
- Release AAB: `D:\JongUk\Documents\ColorWalk\android\app\build\outputs\bundle\release\app-release.aab`

## Build

```powershell
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_HOME='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\Avd'
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
npm run cap:sync
cd android
.\gradlew.bat :app:assembleDebug --console=plain
.\gradlew.bat :app:bundleRelease --console=plain
```

## Device QA

```powershell
D:\Android\Sdk\platform-tools\adb.exe devices
D:\Android\Sdk\platform-tools\adb.exe install -r D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk
```

## Emulator

The C drive was previously full, so the working emulator setup is on D.

Start the current AVD:

```powershell
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_HOME='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\Avd'
Start-Process -FilePath 'D:\Android\Sdk\emulator\emulator.exe' -ArgumentList '-avd ColorWalkPixel7 -no-snapshot -no-audio -no-boot-anim -camera-back emulated -gpu swiftshader_indirect' -WindowStyle Hidden
```

Verified on `ColorWalkPixel7`: location permission, camera permission, camera preview/capture, journal save, same-day replacement confirm, history, native story share sheet, notification permission, and immediate test notification display.
