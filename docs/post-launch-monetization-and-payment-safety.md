# 출시 후 수익화·결제 업데이트 안전 계약

마지막 갱신: 2026-07-28 KST
상태: **approved**

## 1. 결정

- Hueday 버전 1은 결제 모듈 없이 무료로 출시한다.
- 결제는 무기한 보류가 아니라, 버전 1의 실제 인플레이스 업데이트와 사용자 데이터 보존을 확인한 뒤 진행하는 우선 후속 업데이트다.
- 첫 결제 상품은 반복 서버 비용이 거의 없는 `Hueday Studio` 1회 구매를 기본안으로 한다. 실제 상품 범위와 가격은 구현 계획 승인 때 다시 확정한다.
- `Hueday Cloud` 구독은 실제 사진 바이트·저장량·재다운로드 트래픽·복구 수요를 측정하고 자동 백업·기기 복구·휴지통 계약을 완성할 수 있을 때만 별도 단계로 연다.
- 무료 사용자의 기존 사진, 기록, Deck, 기본 Hueprint·Capsule·Story, 기본 내보내기와 계정 복구를 결제 뒤로 옮기지 않는다.

## 2. 출시 후에 붙이는 이유

결제와 entitlement는 기존 `posts`, IndexedDB `daily-record`/`media-asset`, local master, Story 데이터와 분리된 **additive 권한 계층**으로 추가할 수 있다. 먼저 무료 버전의 설치·업데이트 보존을 실사용 조건에서 확인하면 결제 문제와 기존 저장 문제를 분리해 진단할 수 있다.

결제를 첫 출시와 묶으면 Play 상품 등록, 구매·보류·취소·환불·복원, 계정 귀속, 실기기 라이선스 테스트와 유료 콘텐츠 제작이 동시에 출시 차단 요인이 된다. 실제 구매 의향 없이 이 범위를 먼저 만들지 않는다.

## 3. 절대 바꾸지 않는 데이터 경계

- Android package ID `com.colorwalk.app`, Play App Signing 계보와 Supabase `auth.users.id`를 유지한다.
- 결제 추가를 이유로 기존 Post, 사진 경로, local master, draft, Deck/Hueprint 파생 규칙을 backfill·재작성·삭제하지 않는다.
- entitlement는 별도 additive table 또는 검증된 결제 공급자의 CustomerInfo에서 읽는다. 브라우저/앱 클라이언트가 스스로 유료 권한을 쓰거나 승격할 수 없어야 한다.
- 구매자 연결 키는 이메일이나 사용자명 대신 로그인한 Supabase user ID를 사용한다. 로그아웃·계정 전환 때 이전 계정의 권한 캐시를 노출하지 않는다.
- 결제 실패, 보류, 환불, 구독 만료가 기존 무료 데이터의 읽기·내보내기·삭제를 막지 않는다.
- 유료 기능을 비활성화하거나 결제 공급자를 교체해도 기존 사용자 데이터와 무료 핵심 경로는 동작해야 한다.

## 4. 구현 시작 트리거와 자동 절차

사용자가 `유료 업데이트`, `결제 모듈`, `Hueday Studio`, `Hueday Cloud`, `구매 복원`, `paywall`, `entitlement` 중 하나를 요청하면 다음 순서를 자동으로 따른다.

1. 이 문서, 성장 전략의 `Monetization Model`, 출시/업데이트 안전 계약, 저장 전략, release readiness, 보안 감사와 AI memory를 읽는다.
2. 최신 main, package/signing 계보, Supabase Auth ID, 현재 앱 버전과 기존 데이터 fixture를 확인한다.
3. 구현 전에 실제 판매 상품·가격·무료/유료 경계·Android만 우선할지 iOS/PWA까지 묶을지를 사용자에게 제시하고 승인을 받는다.
4. `feature/post-launch-monetization` 같은 별도 브랜치에서 결제 공급자와 entitlement를 기존 데이터와 분리해 구현한다.
5. 스토어 상품과 앱 entitlement ID를 버전 가능한 고정 ID로 매핑한다. 표시 가격은 스토어에서 조회하고 앱에 하드코딩하지 않는다.
6. 구매 성공 콜백만으로 권한을 만들지 않는다. 스토어 또는 검증 공급자의 확인 뒤 권한을 열고 보류 상태에는 열지 않는다.
7. 구매·사용자 취소·보류 후 완료·복원·환불/취소 후 권한 회수·로그아웃/계정 전환을 검증한다.
8. 기존 설치본 위에 `adb install -r`로 후보 APK를 덮어 설치해 로그인, 1/8 draft/master, 8/8 기록, Deck, Hueprint/Capsule, Story와 무료 내보내기가 그대로인지 확인한다. uninstall·data clear로 통과시키지 않는다.
9. additive DB/RLS가 필요하면 기존 앱의 읽기/쓰기를 깨지 않는 expand 단계만 먼저 적용한다. DROP, 기존 데이터 변환, 접근 확대, 대량 backfill은 별도 승인을 받는다.
10. 실제 결과와 결제 수수료·환불·스토리지 비용을 문서, AI memory, release readiness와 문제해결 기록에 남긴 뒤 단계적 배포한다.

## 5. 권장 최소 기술 구조

- Android 디지털 상품은 Google Play Billing을 사용한다.
- Capacitor Android/iOS 공통 구매·복원·entitlement가 필요하면 RevenueCat Capacitor SDK를 우선 비교한다. Play Billing과 StoreKit 검증을 각각 직접 구현하는 대안은 운영 통제 필요가 비용을 정당화할 때만 선택한다.
- Supabase는 앱 계정과 필요한 최소 entitlement mirror, owner RLS, webhook/Edge Function 경계에만 사용한다. 결제를 위해 상시 Railway/Render 서버를 추가하지 않는다.
- webhook secret, store service credential, RevenueCat secret key는 브라우저 번들에 넣지 않고 서버 환경 변수에만 둔다. 앱에는 공급자가 공개용으로 명시한 SDK 키만 둔다.
- PWA 결제를 추가할 경우 Play 배포 앱에서 외부 결제로 유도하는 흐름을 먼저 만들지 않는다. 플랫폼별 최신 결제 정책을 구현 직전에 공식 문서로 다시 확인한다.

2026-07-28 확인 기준: Google Play 앱 내 디지털 기능은 원칙적으로 Play Billing 대상이며 구매 검증 후 entitlement를 지급한다. Apple 앱은 StoreKit In-App Purchase를 사용한다. 정책과 SDK 가격은 바뀔 수 있으므로 구현 시점에 Google Play, Apple Developer, RevenueCat 공식 문서를 다시 확인한다.

## 6. 상품 단계

### 1차 — Hueday Studio 1회 구매

- 기존 무료 결과물을 빼앗지 않고, 고급 Hueprint/Capsule/Story 스타일·고급 표지/레이아웃·고해상도/인쇄 내보내기처럼 기기 내 추가 가치를 판다.
- 구매 복원과 계정 귀속이 필수다. `평생 모든 미래 기능`이나 Cloud·AI·모든 시즌 팩 포함을 약속하지 않는다.
- 실제 유료 에셋과 기능이 승인되기 전에는 빈 paywall이나 결제만 가능한 placeholder 상품을 출시하지 않는다.

### 2차 — Hueday Cloud 구독

- 자동 고화질 백업, 기기 간 복구, 고화질 다시 받기, 용량 표시와 휴지통처럼 반복 비용이 있는 가치에만 구독을 붙인다.
- 실제 파일 바이트와 storage/egress, 복구 성공률, 해지 후 보존 기간을 측정하기 전에는 용량·가격을 확정하지 않는다.
- Cloud 중단·만료 뒤에도 작은 preview, 구조화 기록과 무료 내보내기는 남는다. 유일한 원본을 경고 없이 삭제하지 않는다.

## 7. 출시 완료 조건

- 스토어 sandbox/license tester에서 구매와 복원이 실제 기기에서 통과한다.
- 보류 구매에는 권한이 열리지 않고, 완료 뒤 중복 지급 없이 열린다.
- 환불·취소·만료·계정 전환 뒤 권한이 올바르게 갱신된다.
- 오프라인에서는 마지막 검증 권한을 제한된 grace/cache 규칙으로 처리하고 무료 핵심은 계속 동작한다.
- 기존 버전 사용자 데이터가 채워진 인플레이스 업데이트에서 기록 손실·중복·잠금이 없다.
- 개인정보처리방침, Play Data Safety, 상품 설명, 가격·자동 갱신 조건, 구매 복원과 문의 경로가 실제 구현과 일치한다.
- 결제 분석은 allowlist된 paywall view → purchase start → purchase complete와 복원/실패 집계만 사용하며 구매 토큰·사진·일기 내용을 product event에 넣지 않는다.

## 8. 보류와 재개 조건

- 지금은 결제 SDK, entitlement table, webhook, store product, paywall을 미리 만들지 않는다.
- 버전 1 출시와 최소 한 번의 실제 인플레이스 업데이트 보존 확인 뒤 `M8M`을 시작한다.
- 사용자가 출시 전에 유료를 다시 요구하면 이 계약과 출시 지연·QA 영향을 제시하고 무료/유료 경계를 재승인받는다.
- Cloud는 실제 비용 표본과 자동 복구 범위가 승인될 때 별도 계획으로 진행한다.
