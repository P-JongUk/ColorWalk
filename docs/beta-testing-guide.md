# ColorWalk Beta Testing Guide

이 문서는 친구 테스트와 로컬 QA를 빠르게 반복하기 위한 기준 문서입니다.

## 1. PWA 베타

가장 간단한 친구 테스트 경로는 HTTPS로 배포된 웹 링크를 공유하고, 각자 브라우저에서 홈 화면에 추가하는 방식입니다.

1. 배포 환경에 필수 Vite env를 설정합니다.
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_AUTH_EMAIL_DOMAIN`
   - `VITE_BETA_INVITE_CODE`
2. `VITE_BETA_INVITE_CODE`를 켜면 초대 코드를 아는 친구만 입장할 수 있습니다.
3. Supabase Auth에서 Email provider가 켜져 있어야 합니다.
4. `beta-signup` Edge Function이 배포되어 있어야 합니다. 서비스 롤 키는 이 함수 안에서만 사용합니다.
5. 친구는 링크 접속 후 초대 코드, 회원가입 또는 로그인, 카메라 권한 허용 순서로 사용할 수 있습니다.

PWA 설치:

- Android Chrome: 메뉴 -> Add to Home screen 또는 Install app
- iOS Safari: 공유 -> 홈 화면에 추가

PWA 카메라와 설치 동작은 HTTPS에서만 안정적으로 검증됩니다.

## 2. 공유 테스트 계정

반복 QA용 계정과 3x3-grid 데모 데이터를 준비하려면:

```powershell
npm run seed:test-account
```

실제 비공개 계정 정보는 `docs/beta-test-account.private.md`에만 보관합니다. 이 파일은 git에 올리지 않습니다.

## 3. 핵심 QA 흐름

- 초대 코드 입력
- 회원가입 또는 로그인
- 홈에서 오늘의 무드 컬러 확인
- 카메라 권한 허용
- 오늘의 색 주변에서 최대 8컷 수집
- 앨범 선택 fallback 확인
- 저널에서 컬러 이름, 무드 문장, 장소 저장 여부 입력
- 같은 날짜 재저장 시 교체 확인
- 히스토리에서 저장된 3x3 기록 확인
- 히스토리 또는 저널에서 스토리 만들기 열기
- 프레임 선택, 스티커 검색/추가/이동/삭제
- 1080x1920 스토리 이미지 저장/공유
- 프로필에서 보상 배지와 테스트 알림 확인

## 4. Android APK 직접 설치

현재 debug APK 출력 위치:

```text
D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk
```

기기 준비:

1. Android 설정에서 개발자 옵션을 켭니다.
2. USB 디버깅을 켭니다.
3. 휴대폰을 PC에 USB로 연결합니다.
4. 휴대폰에 USB 디버깅 허용 팝업이 뜨면 허용합니다.

연결 확인:

```powershell
D:\Android\Sdk\platform-tools\adb.exe devices
```

설치:

```powershell
D:\Android\Sdk\platform-tools\adb.exe install -r D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk
```

## 5. Android 빌드

이 PC에서는 JDK 21과 D드라이브 Android SDK/AVD를 사용합니다.

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_HOME='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\Avd'
```

빌드:

```powershell
npm run build
npm run cap:sync
cd android
.\gradlew.bat :app:assembleDebug --console=plain
.\gradlew.bat :app:bundleRelease --console=plain
```

출력:

```text
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/bundle/release/app-release.aab
```

## 6. Emulator QA

D드라이브 SDK/AVD를 사용합니다.

```powershell
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_HOME='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\Avd'
Start-Process -FilePath 'D:\Android\Sdk\emulator\emulator.exe' -ArgumentList '-avd ColorWalkPixel7 -no-snapshot -no-audio -no-boot-anim -camera-back emulated -gpu swiftshader_indirect' -WindowStyle Hidden
```

ADB:

```powershell
D:\Android\Sdk\platform-tools\adb.exe devices
```

3x3-grid rebuild 이후에는 카메라, 저널 저장, 히스토리, 스토리 export/share, 알림까지 다시 검증해야 합니다.
