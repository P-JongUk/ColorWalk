# ColorWalk Beta Testing Guide

이 문서는 ColorWalk를 친구들과 테스트할 때 필요한 가장 빠른 경로를 정리합니다.

## 1. PWA 베타

가장 간단한 방법은 HTTPS로 배포한 링크를 친구에게 보내는 것입니다.

1. 배포 환경에 `.env.local`과 같은 값을 설정합니다.
2. `VITE_BETA_INVITE_CODE`를 켜면 초대 코드를 아는 친구만 들어올 수 있습니다.
3. Supabase Auth에서 Email provider가 켜져 있어야 합니다.
4. `beta-signup` Edge Function이 배포되어 있어야 합니다. 이 함수는 서버에서만 service role key를 사용해 아이디 기반 가입 사용자를 confirmed 상태로 생성합니다.
5. 친구들은 링크 접속 후 회원가입/로그인을 하고 바로 사용할 수 있습니다.
6. PWA 설치:
   - Android Chrome: 메뉴 -> Add to Home screen 또는 Install app
   - iOS Safari: 공유 -> 홈 화면에 추가

PWA 알림은 브라우저 권한과 실행 상태의 영향을 받습니다. Android 네이티브 빌드는 Capacitor Local Notifications로 매일 알림을 예약합니다.

## 2. 공유 테스트 계정

반복 QA용 계정은 로컬 비공개 문서에 보관합니다.

```powershell
npm run seed:test-account
```

명령을 실행하면 테스트 계정이 생성/갱신되고 최근 5일치 기록이 Supabase에 들어갑니다. 실제 자격 증명은 `docs/beta-test-account.private.md`에 있습니다.

## 3. Android APK 직접 설치

현재 debug APK 출력 위치:

```text
D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk
```

휴대폰 준비:

1. Android 설정에서 개발자 옵션을 켭니다.
2. USB 디버깅을 켭니다.
3. 휴대폰을 PC에 USB로 연결합니다.
4. 휴대폰에 USB 디버깅 허용 팝업이 뜨면 허용합니다.

PC에서 연결 확인:

```powershell
C:\Users\JongUk\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
```

설치:

```powershell
C:\Users\JongUk\AppData\Local\Android\Sdk\platform-tools\adb.exe install -r D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk
```

## 4. Android 빌드

Capacitor 8/Android Gradle 설정은 JDK 21이 필요합니다. 이 PC에서 확인된 JDK:

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

그 다음:

```powershell
npm run build
npm run cap:sync
cd android
.\gradlew.bat :app:assembleDebug
.\gradlew.bat :app:bundleRelease
```

출력:

```text
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/bundle/release/app-release.aab
```

## 5. 에뮬레이터 QA

ADB가 PATH에 없으면 전체 경로를 사용합니다.

```powershell
C:\Users\JongUk\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
```

현재 이 PC는 Android SDK는 있지만 등록된 AVD가 없습니다. Android 36 system image 설치는 C 드라이브 공간 부족으로 실패했습니다. 다음 에뮬레이터 작업 전에 `docs/android-local-environment.md`를 읽고 SDK/AVD 위치를 D 드라이브로 정리하세요.

## 6. 빠른 QA 체크리스트

- 초대 코드
- 회원가입/로그인/자동 로그인
- 오늘의 색 셔플 변경
- 카메라 권한 허용 후 색 샘플
- 카메라 권한 거부 후 앨범 선택
- 저장 장소 선택/미선택
- 같은 날 다시 저장할 때 갱신 확인 팝업
- 저장 후 히스토리에서 최신 기록 확인
- 저널/히스토리에서 스토리 템플릿 변경, 스티커 추가/이동/삭제
- 9:16 스토리 이미지 저장/공유
- 프로필에서 매일 알림 시간 설정
