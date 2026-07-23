# Hueday 전체 개발 마스터 로드맵

마지막 갱신: 2026-07-23 KST
제품 기준: `docs/hueday-product-blueprint.md`
로드맵 성격: 빠르고 완성도 있는 출시를 위한 의존 순서와 검증 gate

## 현재 진행 위치

- 마스터 단계: **M1 — 컬러 헌트 제품 진실 정렬**
- 현재 작업: D — Chromatic Archive 외부 UI, Hue Canvas 제품 계약, 로컬 우선 저장·수익화·출시 전제의 문서 기준을 확정하고 실제 개발에 넘기는 체크포인트
- 다음 한 작업: **최신 `main`에서 `feature/color-hunt-contract`를 만들고 현지 날짜별 새 색 선택·첫 사진 잠금·1~7장 일일 기록·8장 완성 보상·매칭률 제거를 실제 코드에 반영하기**
- 최종 목표: 성공 가능성을 만드는 핵심 경험과 안전·품질 기준을 갖춘 Hueday를 최대한 빨리 출시

## 완료 판정 규칙

- `[ ]` 시작 전
- `[-]` 진행 중
- `[x]` 구현·검증·문서까지 완료
- `[!]` 사용자 선택 또는 외부 권한 필요

다음 단계로 넘어가는 조건:

1. 현재 단계의 성공 조건이 모두 충족됐다.
2. 관련 테스트·빌드·QA가 통과했다.
3. 알려진 실패와 보류가 기록됐다.
4. source of truth와 AI memory가 실제 상태와 일치한다.
5. 의미 있는 체크포인트가 한글 커밋으로 저장·푸시됐다.

## 전체 순서

```text
M0 문서·자동화 기반
→ M1 컬러 헌트 제품 진실 정렬
→ M2 안정성·데이터·측정 기반
→ M3 일상 미션 팩
→ M4 발견 색 대표 콘텐츠 승인·프로토타입
→ M5 발견 색 창작·Color Rhythm 보상 완성
→ M6 Hueprint·Color Capsule
→ M7 Color Relay·안전한 공유 성장
→ M8 통합 디자인·접근성·성능 완성
→ M9 전체 실기기·보안·출시 검증
→ M10 출시 후 데이터 기반 확장
```

독립 작업을 병렬화할 수 있어도 현재 프로젝트는 하위 에이전트를 사용하지 않는다. 현재 에이전트가 한 번에 한 체크포인트를 끝내고 다음으로 이동한다. 외부 권한 때문에 막히면 의존하지 않는 다음 준비 작업으로 이동하고 로드맵에 사유를 남긴다.

## M0 — 제품 청사진·로드맵·자동 참고 체계

목표: 다음 세션의 Codex가 대화를 다시 추측하지 않고 같은 방향과 순서로 작업하게 한다.

### 작업

- [x] 전체 합의를 `docs/hueday-product-blueprint.md`에 정리
- [x] 전체 의존 순서를 이 문서에 정리
- [x] 발견 색 대표 콘텐츠 전략과 보류된 Hue Room 문서 연결
- [x] Hue Canvas 제품 명세·저장/동기화 전략·D 드라이브 디자인 인덱스 연결
- [x] 승인·후보·보류·역사 상태와 사용자 재승인 없는 방향 변경 금지 계약
- [x] 기존 breakout/growth/reward/plan 문서의 모순 제거
- [x] `docs/development-reference-guide.md`를 전체 기능 라우팅 기준으로 확장
- [x] SessionStart가 핵심 문서와 현재 단계·다음 작업을 자동 출력
- [x] 작업 시작 질문에 따라 관련 문서를 자동 추천
- [x] 작업 종료 시 변경 경로에 따른 문서 누락 경고
- [x] AI memory와 취업용 문제해결 기록 갱신
- [x] 스크립트·링크·Git diff 검증

### 성공 조건

- 새 세션에서 전체 제품 기준, 현재 단계, 다음 한 작업이 자동으로 보인다.
- 발견 색 창작 콘텐츠를 포함한 모든 주요 작업 유형이 문서 라우팅 표에 있다.
- 같은 내용을 여러 문서에 복제할 때 역할과 우선순위가 명확하다.
- 문서가 존재하지 않거나 링크가 끊기면 자동 검사에서 경고한다.

### 검증

- `ai-workflow.ps1 -Mode session-start`
- `ai-workflow.ps1 -Mode start -Question "발견 색 Hueprint 리믹스 구현"`
- `ai-workflow.ps1 -Mode start -Question "Color Relay RLS 설계"`
- Markdown 경로 존재 검사
- `git diff --check`

## M1 — 컬러 헌트 제품 진실 정렬

목표: Hueday의 대표 행동을 모든 화면과 데이터에서 한 문장으로 설명할 수 있게 한다.

권장 브랜치: `feature/color-hunt-contract`

### 작업

#### 구현·최종 QA 상태 — 2026-07-24 KST

`feature/color-hunt-contract`의 `e6036c5`, `f135aae`, `326276e`가 아래 제품 계약을 구현했다. 2026-07-24 KST에 lint·19개 unit test·production build·라이브 Supabase 검증·Capacitor sync·Android debug/release build를 다시 통과했다. 아래 상태가 같은 의미의 과거 미체크 항목을 대체한다.

- [x] 사용자 ID+현지 날짜별 0장 mission/재추천 상태, 첫 추천과 3회 문맥 재추천 뒤 HEX 중복 제거·현재 색 제외 전체 선택
- [x] 촬영 미리보기와 `이 사진 사용` 확정 뒤 첫 사진 잠금
- [x] 1~7장 날짜별 IndexedDB 기록, 재시작 복구, 로컬 우선 서버 병합, 달력·기록함 단일 일일 기록
- [x] 업로드 성공/Post 실패 재시도 경로와 8장 완성 초안 보존
- [x] foreground/다음 사진 확정 시 현지 날짜 마감·비이월
- [x] match-rate 제품 UI·streak 계산/보상 제거, `match_rate: 0` DB 호환 유지
- [x] 3·7·14·30 배지를 병합된 완성 3×3 일일 기록 수로 계산
- [x] 430×932 브라우저: 시작 전, 1~3회 문맥 재추천, 네 번째 전체 큐레이션 재추천, 촬영 미리보기·다시 찍기·확정, 1장 복구, 2~7장, 8장 완성, 저널·스토리·달력 단일 병합·프로필 확인
- [x] 브라우저 날짜 mock: 전날 1장 기록의 마감·비이월·새 날짜 새 mission과 달력의 닫힌 부분 기록 확인
- [x] 테스트 계정 재시드: 오늘을 비워 M1 시작 상태를 재현하고, 2026-07-23~19의 5개 데모 일일 기록을 M1 `colorHunt` 메타데이터로 갱신
- [!] 별도 `ColorWalkM1QA` AVD: 실제 카메라 권한, 촬영→미리보기→다시 찍기→`이 사진 사용`, 1/8 저장, background/foreground 뒤 1장 복구와 2/8·5/8 순차 촬영까지 확인했다. 날짜를 전역 `Date`로 바꾸는 QA mock은 Supabase 인증 시간을 미래로 인식시켜 유효한 2~8 완주 방법이 아니었으며, 그 전환 중 WebView 권한 콜백 예외가 한 번 발생했다. 이어 clean `wipe-data` cold boot에서는 앱 설치 전 `com.android.systemui`·`com.android.phone`·Google Play services ANR이 다시 발생했다. 따라서 7/8·8/8 완료/배지, foreground 날짜 전환, 저널 저장·Story 네이티브 공유 시트는 통과로 처리하지 않고 안정적인 환경 또는 실제 Android 기기 QA로 남긴다. 기존 `ColorWalkPixel7` 앱·데이터는 삭제하거나 변경하지 않았다. 근거는 무시되는 `.design-references/01-current-screens/m1-android-qa-2026-07-24/`에 보존했다.

확정된 의미:

- 첫 사진을 사용하기로 확정하면 그 현지 날짜의 미션 색을 잠근다. 1장 이상은 유효한 오늘의 색 기록이고 8장 페이지 완료와 구분한다.
- 첫 색은 날씨·시간·선택적 대략 위치에 맞춰 추천한다. 다른 색 3회까지 맥락 추천을 제공하고 이후에는 전체 색 목록에서 현재 색을 제외한 각 색을 같은 확률로 보여 준다.
- 중앙 미션 색 주위의 8칸을 모두 채우면 오늘의 미션과 3×3 한 페이지가 완성되고 발견 색 재료·Hueprint·공유 결과물의 주요 보상으로 연결된다.
- 1~7장은 실패가 아니라 그날 모은 장면으로 보존한다. 현지 자정이 지나면 당시 사진 수로 기록을 닫고 다음 날 새 색을 선택하며, 과거 기록을 오늘의 활성 미션으로 이어 채우지 않는다.
- 미완성 실패, 보상 손실, 연속 일수 초기화, 죄책감 카피, 색 매칭 점수는 사용하지 않는다.
- 현재 1장 저장·저널 진입·초안 복구 구현은 유효한 일일 기록의 기반이다. 날짜별 종료, 추천 횟수, 색 잠금, 1~7장 기록과 8장 보상의 차이는 이 단계에서 구현한다.
- 디자인 조사 자료는 `feature/design-direction`에 보존한다. M1에 필요한 1장/8장 제품 의미와 D 외부 UI는 승인됐으므로 Hue Canvas HC-2를 기다리지 않고 별도 `feature/color-hunt-contract`에서 구현한다.

### 성공 조건

- 사용자는 1장과 8장의 차이를 한 번에 이해한다.
- 사용자는 날짜가 바뀌면 새 색을 선택하고 어제 기록이 안전하게 닫혔음을 이해한다.
- 어떤 사진도 자동 정답/오답 평가를 받지 않는다.
- 저장된 대표 색은 일관되게 미션 색이다.
- 홈·카메라·저널·스토리·히스토리·보상이 같은 규칙을 말한다.
- 초안과 저장 데이터가 손실되지 않는다.

### 검증

- 관련 helper/component 테스트
- `npm run lint`
- `npm test -- --run`
- `npm run build`
- 브라우저 추천·3회 교체·균등 랜덤·첫 사진 잠금·자정 전환·1~7장 기록·8장 완성 QA
- Android 촬영·복구 QA

### 관련 문서

- 전체 제품 청사진
- `docs/hueday-breakout-strategy.md`
- `docs/colorwalk-reward-system.md`
- `docs/discovered-color-content-strategy.md`
- `plan.md`

## M2 — 안정성·데이터·측정 기반

목표: 새 기능을 붙이기 전에 가입부터 저장까지의 실패를 보호하고 무엇이 작동하는지 측정할 기반을 만든다.

권장 브랜치: `feature/core-funnel-observability`

### 작업

- [ ] `mission_viewed`, `capture_started`, `first_photo_taken`, `grid_completed`, `journal_saved`, `story_exported`, `share_opened` 이벤트 계약
- [ ] 개인정보 없는 최소 payload 정의
- [ ] 중복 이벤트와 재시도 처리
- [ ] 가입 → 촬영 → 초안 → 저장 → 히스토리 → 공유의 자동 E2E 최소 경로
- [ ] `grid_images` 라이브 migration 적용 권한과 fallback 종료 조건
- [ ] 저장·업로드 실패와 초안 복구 UX 재검증
- [ ] 로컬 고화질 마스터·무료 작은 preview·cloud 고화질 백업 계층 분리
- [ ] IndexedDB metadata + Capacitor Filesystem 기반 offline-first 저장과 동기화 큐
- [ ] 암호화된 `.hueday` 수동 archive 내보내기·가져오기
- [ ] 계정 삭제·데이터 export·복구 정책과 앱/웹 진입점
- [ ] 이미지 품질 샘플 비교와 목적별 압축 preset
- [ ] 이벤트 도구를 선택하기 전 비용·개인정보·웹/Android 호환 비교

### 성공 조건

- 첫 사진과 첫 저장까지의 이탈 위치를 알 수 있다.
- 분석 payload에 사진·일기·정확한 위치·계정 비밀 정보가 없다.
- E2E 한 경로가 주요 회귀를 검출한다.
- 라이브 스키마 fallback의 종료 조건이 명확하다.
- 네트워크 없이 최근 기록과 로컬 사진을 열 수 있고 앱 종료 뒤 초안이 복구된다.
- 사용자의 유일한 고화질 사본을 검증 없이 파괴하지 않는다.
- 무료 수동 기기 이전과 유료 자동 Cloud 복구의 경계가 동작한다.

### 검증

- 단위·통합/E2E 테스트
- `npm run verify:supabase`
- 브라우저 이벤트 중복 확인
- Android/PWA 핵심 여정
- 보안 문서 검토

## M3 — 일상 미션 팩

목표: 걷지 않는 날에도 오늘의 상황에서 색을 찾고, 이후 발견 색 창작 보상과 연결할 문맥을 만든다.

권장 브랜치: `feature/everyday-mission-packs`

### 작업

- [ ] 집·학교·캠퍼스·통학·카페·비 오는 날·날씨·시간·관심사·컬러 산책 정적 pack 구조
- [ ] 날씨·시간 기본 추천과 사용자 직접 선택
- [ ] 위치 권한 없이 모든 pack 사용
- [ ] 미션 팩별 카피와 대표 재질·스탬프 mapping 초안
- [ ] mission ID 변경과 과거 기록 호환 규칙
- [ ] 한국어·영어 번역
- [ ] 미션 팩 선택 이벤트

### 성공 조건

- 컬러 산책이 유일한 사용 상황처럼 보이지 않는다.
- 사용자가 현재 상황과 맞지 않는 추천을 쉽게 바꿀 수 있다.
- 정확한 위치나 학교 이름을 입력하지 않아도 된다.
- 과거 미션 기록이 pack 변경으로 깨지지 않는다.

### 검증

- 미션 선택/날짜/날씨 fallback 테스트
- 430x932 홈·선택 화면 QA
- 위치 거부 상태 QA
- Android/PWA 검증

## M4 — 발견 색 대표 콘텐츠 승인·프로토타입

목표: 승인된 Hue Canvas가 사용자가 찾은 색으로 실제로 만들고 다시 찾고 공유하게 하는 대표 콘텐츠인지 실제 렌더와 조작으로 증명한다.

핵심 문서: `docs/hue-canvas-product-spec.md`, `docs/discovered-color-content-strategy.md`

### 작업

- [x] Hue Room을 첫 출시 critical path에서 완전히 제외하고 출시 후 가설로 보류
- [x] Hue Studio, Hue Loom, Hue Glass, Hue Cinema, Hue Constellation, Hue Deck, Hue Soundscape 등 대안 발산
- [x] 대표 시스템 Hue Canvas, 큰 가상 격자, 발견 횟수 사용량, 스테인드글라스 재질 사용자 승인
- [ ] 빈 상태·Palette·자유 작업·도안 크기 조절·완성/export 430x932 흐름 시안
- [ ] 같은 데이터로 생성 시안과 실제 Canvas 2D 렌더를 비교해 재현성 검증
- [ ] 256x256 희소 격자와 10,000개 채운 셀 저장·복구·pan/zoom 스파이크
- [ ] 극단 HEX, 색 부족, 기록 1개/많음, Android, 9:16 내보내기 검증
- [ ] 기존 D — Chromatic Archive 외부 UI와 내비게이션 연결안
- [!] Hue Canvas 첫 시각·조작 프로토타입 사용자 승인

### 성공 조건

- 선택한 발견 색과 발견 횟수가 유리 타일의 색·배치 가능량으로 즉시 보인다.
- 큰 캔버스와 도안 채우기가 단순 팔레트 선반이나 다른 이름의 방이 아닌 창작 재미를 준다.
- 결과물의 각 색에서 원본 3x3과 일기로 돌아갈 수 있다.
- 색상별 에셋 복제와 생성형 AI 없이 임의 HEX를 안정적으로 처리한다.
- 작은 화면에서 색 선택·수량·칠하기·이동·저장·리믹스가 이해하기 쉽다.
- 시각·조작 승인 전에는 전체 에셋, 대형 migration, 복잡한 렌더러를 만들지 않는다.

## M5 — 발견 색 창작·Color Rhythm 보상 완성

목표: 승인된 대체 콘텐츠를 실제 retention loop로 구현하고, 완성한 3x3이 사용 가능한 창작 재료와 표현 옵션으로 돌아오게 한다.

권장 브랜치: `feature/hue-canvas-core`

### 작업

- [ ] `posts.mission_hex`와 원본 post 기반 Hue Palette·발견 횟수
- [ ] 완성 3x3만 해당 색의 Canvas 사용량을 +1 하는 상태 계약
- [ ] 자유 캔버스·기본 도안·스테인드글라스 렌더·칠하기·지우기·undo/redo
- [ ] sparse recipe 로컬 저장·복구·삭제와 작은 cloud snapshot·owner RLS
- [ ] 새 색으로 과거 작품 리믹스
- [ ] 작품의 색 타일/Palette에서 원본 기록 열기
- [ ] 9:16 저장·공유와 프로필 대표 작품
- [ ] 주간 2/3/5 색 리듬
- [ ] 누적 발견·완성 3x3·미션 팩 기반 창작 옵션 unlock
- [ ] 출시 전 3·7·14·30 배지를 완성 3×3 페이지 수 기준으로 즉시 전환

### 성공 조건

- 기록을 완성하면 해당 색을 Hue Canvas에서 한 칸 더 사용할 수 있고 실제 창작 옵션이 열린다.
- 놓친 날 때문에 색, 작품, 보상이 줄거나 망가지지 않는다.
- 사용량은 작품별 배치 한도이며 영구 소모되지 않고, 여러 작품에 재사용하고 새 색으로 리믹스한다.
- 다른 사용자가 개인 작품 recipe나 source post를 읽지 못한다.
- 새로고침·로그인·기기 재실행 뒤 작품과 원본 연결이 복구된다.

## M6 — Hueprint·Color Capsule

목표: 색이 쌓일수록 개인 가치가 커지고 과거 기록을 다시 찾게 한다.

권장 브랜치: `feature/hueprint-capsule`

### 작업

- [ ] 기존 monthly collection helper 기반 월간 Hueprint
- [ ] 대표 팔레트·완성 3x3·자주 붙인 색 이름·대표 사진
- [ ] 9:16 월간 리캡
- [ ] 사용자가 만든 Hue Canvas 작품과 월간 자동 Hueprint 연결
- [ ] 30일 뒤 과거 기록을 보여 주는 최소 Capsule
- [ ] 빈 달·1개 기록·많은 기록 상태
- [ ] 감정/성격을 단정하지 않는 카피
- [ ] 리캡·회고 이벤트

### 성공 조건

- 서버 AI 없이 기존 저장 데이터로 첫 리캡을 만든다.
- 기록 수가 적어도 깨지지 않는 결과가 나온다.
- Hueprint가 Story, Profile, Hue Palette/Canvas에서 같은 색 정체성을 보여 준다.
- 과거 기록 공유 시 개인정보 기본값을 유지한다.

### 검증

- 월 경계와 데이터 수별 helper 테스트
- 9:16 내보내기 QA
- 430x932 캡처
- Android/PWA 회고·공유 QA

## M7 — Color Relay·안전한 공유 성장

목표: 공유 카드 하나가 다음 사람의 색 발견으로 이어지는 작은 네트워크 효과를 만든다.

권장 브랜치: `feature/color-relay`

### 작업

- [ ] `shared_cards` 또는 동등한 최소 공개 모델 설계
- [ ] 만료·폐기 가능한 slug
- [ ] 제한된 공개 카드 view/Edge Function
- [ ] 짧은 signed URL과 source post 격리
- [ ] 로그인 없는 카드 보기
- [ ] `나도 이 색 찾기`와 로컬 첫 체험 범위
- [ ] 가입 시 로컬 체험을 안전하게 이어 저장
- [ ] 두 결과의 공동 팔레트·엽서·Duet Print
- [ ] 카카오톡·인스타그램 DM·문자 링크 미리보기
- [ ] Relay 이벤트와 abuse 기본 방어

### 성공 조건

- 링크로 다른 비공개 기록이나 위치를 찾을 수 없다.
- owner가 링크를 폐기하면 더 이상 열리지 않는다.
- 받은 사용자는 가입 전 Hueday의 핵심 행동을 이해한다.
- 결과에 승패·퍼센트·좋아요 수가 없다.
- Relay가 없어도 개인 기록과 발견 색 창작 경험이 완전하다.

### 검증

- owner/anonymous/other-user RLS 및 API 테스트
- 만료·폐기·잘못된 slug
- 공유 미리보기와 모바일 CTA
- 가입 전후 데이터 경계
- `npm run verify:supabase`

## M8 — 통합 디자인·접근성·성능 완성

목표: 기능은 많지만 서로 다른 앱처럼 보이는 상태를 막고 하나의 세련된 제품으로 완성한다.

권장 브랜치: `feature/release-polish`

### 작업

- [ ] auth, home, mission packs, camera, journal, story, history, Hue Palette/Canvas, Hueprint, Relay, profile 430x932 전수 캡처
- [ ] `.design-references/00-target-mockup/`과 전후 비교
- [ ] 컬러·타이포·여백·버튼·상태·모션 통일
- [ ] 로딩·빈 상태·권한 거부·오류·오프라인 상태
- [ ] 스크린리더·키보드·터치 영역·모션 줄이기
- [ ] 번들·이미지·첫 작품 렌더·저사양 Android 성능
- [ ] 한국어·영어 잘림과 안전 영역
- [ ] 실제 공유 결과 가독성

### 성공 조건

- 모든 화면이 Hueday 하나의 디자인 시스템으로 느껴진다.
- 핵심 기능에 막다른 빈 화면이 없다.
- 접근성 기본 경로와 오류 복구가 있다.
- 새 기능이 기존 카메라·저장·스토리 성능을 눈에 띄게 악화시키지 않는다.

## M9 — 전체 실기기·보안·출시 검증

목표: 문서상 완성이 아니라 실제 출시 후보에서 전체 핵심 여정을 통과한다.

### 자동 검증

- [ ] `npm run lint`
- [ ] `npm test -- --run`
- [ ] `npm run build`
- [ ] `npm run verify:supabase`
- [ ] 가입 → 촬영 → 저장 → 발견 색 창작 → Hueprint → Relay E2E
- [ ] `npm run cap:sync`
- [ ] Android debug/release build

### 실제 QA

- [ ] Chrome/PWA 설치
- [ ] Android 에뮬레이터
- [!] 실제 Android 휴대폰
- [ ] 카메라·위치·앨범·알림·공유 권한
- [ ] 네트워크 중단과 복구
- [ ] 계정 교차 접근·링크 만료·폐기
- [ ] 스토리·작품·Hueprint 실제 공유
- [ ] 430x932 디자인 전수 비교

### 출시 판정

- 데이터 손실·권한 우회·다른 사용자 노출이 없다.
- 가입부터 핵심 결과 공유까지 막히지 않는다.
- 발견 색 보상은 실제 창작에 사용할 수 있다.
- 핵심 이벤트가 중복이나 개인정보 없이 기록된다.
- `docs/release-readiness.md`에 실제 검증 날짜와 결과가 있다.
- 알려진 부채는 사용자 피해, 종료 조건, 후속 작업과 함께 기록된다.

## M10 — 출시 후 데이터 기반 확장

출시 전에는 만들지 않되, 실제 사용 증거가 생기면 아래 순서로 검토한다.

1. 첫 이탈 구간과 저장 실패 개선
2. 가장 많이 쓰는 미션 팩과 창작 재질·구도 확장
3. Hueprint 공유가 검증되면 연간/실물 결과물
4. Relay가 검증되면 2~8명 close circle
5. 구매 의향이 확인되면 Creative Pack
6. 창작 도구 구매 의향이 생기면 Studio, 반복 저장 비용과 복구 가치가 생기면 Cloud
7. 커뮤니티 파일럿 뒤 B2B 미션
8. 충분한 표본과 개인정보 기준 뒤 익명 색 트렌드
9. 사용자가 꾸미기 공간을 명시적으로 원하고 제작 비용 대비 반복 사용 증거가 생길 때만 Hue Room 가설 재검토
10. Mac 빌드 환경과 Apple 계정 준비 뒤 iOS/TestFlight/App Store

공개 피드, 팔로워 수, 인기 순위, 실시간 공동 편집, 3D 방, 아이템 거래는 별도 증거 없이 자동으로 다음 단계가 되지 않는다.

## 단계별 문서·브랜치·모델 규칙

| 단계 | 핵심 문서 | 권장 모델/추론 | Plan | 주요 브랜치 |
| --- | --- | --- | --- | --- |
| M0 | 전체 청사진, 전체 로드맵, reference guide | Terra high | 켬 | `feature/product-roadmap-system` |
| M1 | blueprint, breakout, reward | Terra high | 필요 | `feature/color-hunt-contract` |
| M2 | release, security, metrics | Terra/Sol high | 켬 | `feature/core-funnel-observability` |
| M3 | growth, mission code | Terra high | 필요 | `feature/everyday-mission-packs` |
| M4 | found-color strategy, design QA | Sol high | 켬 | `feature/design-direction` |
| M5 | approved content spec, reward, Supabase | Terra/Sol high | 켬 | 승인 뒤 이름 결정 |
| M6 | growth, Hueprint, story | Terra high | 필요 | `feature/hueprint-capsule` |
| M7 | growth, security, release | Sol high | 켬 | `feature/color-relay` |
| M8 | design QA, release | Terra high | 필요 | `feature/release-polish` |
| M9 | release, security | Sol high/xhigh | 켬 | 출시 후보 branch |

명확한 반복 구현은 Luna/Terra로 낮추고, 사용자 선택이 필요한 시각·제품 결정과 보안·출시 판정만 Sol을 사용한다. Ultra와 하위 에이전트는 사용하지 않는다.

## Codex가 매 작업에서 따를 절차

1. SessionStart 출력에서 현재 마스터 단계와 다음 한 작업을 확인한다.
2. `docs/development-reference-guide.md`로 관련 문서를 고른다.
3. Graphify로 현재 단계와 관련된 코드만 질의한다.
4. 범위, 성공 조건, 예상 파일, 최소 구현을 먼저 말한다.
5. 최신 `main`에서 `feature/<기능명>` 브랜치를 만든다.
6. 한 기능의 한 검증 지점만 구현한다.
7. 좁은 테스트부터 전체 필수 검증으로 넓힌다.
8. 시각 변경이면 430x932 캡처를 남긴다.
9. 검증된 체크박스만 완료하고 `현재 진행 위치`와 `다음 한 작업`을 갱신한다.
10. 관련 source of truth, AI memory, 필요 시 취업 기록을 갱신한다.
11. 한글 커밋을 만들고 검증된 체크포인트를 푸시한다.
12. 단계 gate를 통과한 뒤 다음 단계로 이동한다.

## 사용자에게 확인이 필요한 지점

Codex가 임의로 확정하지 않고 사용자에게 결과를 먼저 보여 줄 항목:

- 1장/8장 최종 제품 규칙
- 발견 색 대표 콘텐츠와 첫 재질·조작 범위
- 내비게이션에서 Hue Palette/Canvas의 위치
- Hue Chapter 최종 명칭과 보상 속도
- 공개 카드에 포함할 사진 범위
- 실제 Android 휴대폰 QA 결과
- Apple Developer 가입, Mac 빌드 환경, 결제 계정 같은 외부 등록
- 유료 상품과 가격

그 외 안전하고 되돌릴 수 있는 구현·테스트·문서 갱신은 이 로드맵과 프로젝트 규칙에 따라 Codex가 계속 진행한다.

## 매 단계 종료 체크리스트

- [ ] 성공 조건을 실제 결과로 확인했다.
- [ ] 실패·보류·의도적 부채를 기록했다.
- [ ] 관련 테스트와 QA를 실행했다.
- [ ] 문서가 코드보다 앞서 구현 완료를 주장하지 않는다.
- [ ] AI memory 현재 상태·결정·다음 작업을 갱신했다.
- [ ] 중요한 트레이드오프를 취업 기록에 남겼거나 영향 없음 이유를 적었다.
- [ ] Graphify를 갱신했다.
- [ ] diff를 검토하고 한글 체크포인트 커밋·푸시를 완료했다.
