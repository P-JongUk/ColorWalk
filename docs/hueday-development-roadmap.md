# Hueday 전체 개발 마스터 로드맵

마지막 갱신: 2026-07-22 KST
제품 기준: `docs/hueday-product-blueprint.md`
로드맵 성격: 빠르고 완성도 있는 출시를 위한 의존 순서와 검증 gate

## 현재 진행 위치

- 마스터 단계: **M1 — 컬러 헌트 제품 진실 정렬**
- 현재 작업: 게이트 1에서 확정한 `1장은 오늘의 색 씨앗과 진행 시작, 8장은 오늘의 미션과 3×3 한 페이지 완성` 계약을 기준으로 디자인 방향 게이트 2 조사
- 다음 한 작업: **제품 청사진·성장 전략·보상 시스템·Hue Room 기준을 먼저 대조하고 네 디자인 방향의 1차 시안 비교**
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
→ M4 Hue Room 시각 검증·렌더 기반
→ M5 Hue Room 저장·재채색·보상 완성
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
- [x] Hue Room 상세 명세와 하위 로드맵 연결
- [x] 기존 breakout/growth/reward/plan 문서의 모순 제거
- [x] `docs/development-reference-guide.md`를 전체 기능 라우팅 기준으로 확장
- [x] SessionStart가 핵심 문서와 현재 단계·다음 작업을 자동 출력
- [x] 작업 시작 질문에 따라 관련 문서를 자동 추천
- [x] 작업 종료 시 변경 경로에 따른 문서 누락 경고
- [x] AI memory와 취업용 문제해결 기록 갱신
- [x] 스크립트·링크·Git diff 검증

### 성공 조건

- 새 세션에서 전체 제품 기준, 현재 단계, 다음 한 작업이 자동으로 보인다.
- Hue Room뿐 아니라 모든 주요 작업 유형이 문서 라우팅 표에 있다.
- 같은 내용을 여러 문서에 복제할 때 역할과 우선순위가 명확하다.
- 문서가 존재하지 않거나 링크가 끊기면 자동 검사에서 경고한다.

### 검증

- `ai-workflow.ps1 -Mode session-start`
- `ai-workflow.ps1 -Mode start -Question "Hue Room 재채색 구현"`
- `ai-workflow.ps1 -Mode start -Question "Color Relay RLS 설계"`
- Markdown 경로 존재 검사
- `git diff --check`

## M1 — 컬러 헌트 제품 진실 정렬

목표: Hueday의 대표 행동을 모든 화면과 데이터에서 한 문장으로 설명할 수 있게 한다.

권장 브랜치: `feature/color-hunt-contract`

### 작업

- [ ] 현재 홈·카메라·저널·저장·히스토리의 1장/8장 동작 추적
- [x] 1장 진행과 8장 완성의 최종 의미 사용자 승인 — B안 확정
- [ ] 중앙 미션 색 + 주변 8장 규칙을 모든 카피에 일치
- [ ] 사진 색 추출과 매칭률 UI·스토리·히스토리 잔재 제거
- [ ] legacy `match_rate`는 DB 호환과 제거 migration 계획을 분리
- [ ] 부분 진행을 허용하면 같은 날 이어 채우는 안전한 복귀 흐름 구현
- [ ] 8장 완성 상태가 보상·Hue Room unlock에 전달될 계약 정의
- [ ] `오늘의 색 찾기` 중심 CTA와 `산책 전용` 카피 제거

확정된 의미:

- 첫 사진은 안전하게 저장되는 `첫 색 발견`이자 `오늘의 색 씨앗`이다. 진행 시작이며 오늘 기록이나 미션의 최종 완료가 아니다.
- 중앙 미션 색 주위의 8칸을 모두 채우면 오늘의 미션과 3×3 한 페이지가 완성되고 Hue Room·Hueprint·공유 결과물의 주요 보상으로 연결된다.
- 부분 진행은 당일 완성을 강제하지 않고 나중에 이어서 채울 수 있다. 미완성 실패, 보상 손실, 연속 일수 초기화, 죄책감 카피, 색 매칭 점수는 사용하지 않는다.
- 현재 1장 저장·저널 진입·초안 복구 구현은 B안의 부담 없는 중간 저장 기반이다. 완료 의미와 보상 계약의 차이는 이 단계의 후속 구현으로 해결한다.
- 디자인 조사 게이트 2·3은 `feature/design-direction`에서 문서와 로컬 시안만 다루며, M1 런타임 구현은 최종 디자인 승인 뒤 별도 기능 브랜치에서 이어간다.

### 성공 조건

- 사용자는 1장과 8장의 차이를 한 번에 이해한다.
- 어떤 사진도 자동 정답/오답 평가를 받지 않는다.
- 저장된 대표 색은 일관되게 미션 색이다.
- 홈·카메라·저널·스토리·히스토리·보상이 같은 규칙을 말한다.
- 초안과 저장 데이터가 손실되지 않는다.

### 검증

- 관련 helper/component 테스트
- `npm run lint`
- `npm test -- --run`
- `npm run build`
- 브라우저 1장 진행·8장 완성·재진입 QA
- Android 촬영·복구 QA

### 관련 문서

- 전체 제품 청사진
- `docs/hueday-breakout-strategy.md`
- `docs/colorwalk-reward-system.md`
- Hue Room 명세
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
- [ ] 이벤트 도구를 선택하기 전 비용·개인정보·웹/Android 호환 비교

### 성공 조건

- 첫 사진과 첫 저장까지의 이탈 위치를 알 수 있다.
- 분석 payload에 사진·일기·정확한 위치·계정 비밀 정보가 없다.
- E2E 한 경로가 주요 회귀를 검출한다.
- 라이브 스키마 fallback의 종료 조건이 명확하다.

### 검증

- 단위·통합/E2E 테스트
- `npm run verify:supabase`
- 브라우저 이벤트 중복 확인
- Android/PWA 핵심 여정
- 보안 문서 검토

## M3 — 일상 미션 팩

목표: 걷지 않는 날에도 오늘의 상황에서 색을 찾고, 이후 Hue Room 보상과 연결할 문맥을 만든다.

권장 브랜치: `feature/everyday-mission-packs`

### 작업

- [ ] 집·학교·통학·카페·날씨·시간·관심사·컬러 산책 정적 pack 구조
- [ ] 날씨·시간 기본 추천과 사용자 직접 선택
- [ ] 위치 권한 없이 모든 pack 사용
- [ ] 미션 팩별 카피와 대표 아이템 mapping 초안
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

## M4 — Hue Room 시각 검증·렌더 기반

목표: 대량 제작 전에 Hueday다운 공간과 무한 색 조합이 실제로 아름답게 작동하는지 증명한다.

세부 순서: `docs/hue-room-development-roadmap.md`의 HR-0~HR-2

### 작업

- [ ] 세 가지 430x932 스타일 시안
- [!] 사용자 메인 스타일 승인
- [ ] 핵심 5개 아이템 요소별 디자인 계약
- [ ] 동적 SVG와 톤 생성 helper
- [ ] 극단 색과 9:16 내보내기 스파이크
- [ ] 방 캔버스, 배치 슬롯, 하단 트레이
- [ ] Hue Room 진입 구조 확정

### 성공 조건

- 색상별 에셋 복제 없이 임의 HEX를 적용한다.
- 기존 목업과 시각 언어가 이어지고 싸이월드 복제품처럼 보이지 않는다.
- 브라우저·Android·공유 이미지에서 핵심 5개가 동일하게 보인다.
- 작은 화면에서 배치와 선택이 안정적이다.

## M5 — Hue Room 저장·재채색·보상 완성

목표: 기록이 실제 공간 변화로 돌아오고 안전하게 저장되는 핵심 retention loop를 완성한다.

세부 순서: Hue Room 로드맵의 HR-3~HR-6

### 작업

- [ ] room state migration과 owner RLS
- [ ] 저장·복구·오류 상태
- [ ] `posts.mission_hex` 기반 색 보관함
- [ ] 탄생 색·현재 색·원본 기록 연결
- [ ] 재채색·보관·복원
- [ ] 주간 2/3/5 색 리듬
- [ ] 누적 발견·완성 3x3·미션 팩 기반 unlock
- [ ] 기존 3·7·14·30 보상 무손실 전환
- [ ] 고품질 기본 아이템 목표 16개

### 성공 조건

- 기록을 저장하면 방에서 눈에 보이는 변화가 생긴다.
- 놓친 날 때문에 보상이나 방이 줄지 않는다.
- 발견 색을 여러 아이템에 자유롭게 적용한다.
- 다른 사용자가 방이나 source post를 읽지 못한다.
- 새로고침·로그인·기기 재실행 뒤 상태가 복구된다.

## M6 — Hueprint·Color Capsule

목표: 색이 쌓일수록 개인 가치가 커지고 과거 기록을 다시 찾게 한다.

권장 브랜치: `feature/hueprint-capsule`

### 작업

- [ ] 기존 monthly collection helper 기반 월간 Hueprint
- [ ] 대표 팔레트·완성 3x3·자주 붙인 색 이름·대표 사진
- [ ] 9:16 월간 리캡
- [ ] Hue Room 포스터·벽지 연결
- [ ] 30일 뒤 과거 기록을 보여 주는 최소 Capsule
- [ ] 빈 달·1개 기록·많은 기록 상태
- [ ] 감정/성격을 단정하지 않는 카피
- [ ] 리캡·회고 이벤트

### 성공 조건

- 서버 AI 없이 기존 저장 데이터로 첫 리캡을 만든다.
- 기록 수가 적어도 깨지지 않는 결과가 나온다.
- Hueprint가 Story, Profile, Hue Room에서 같은 색 정체성을 보여 준다.
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
- [ ] 두 결과의 공동 팔레트·엽서·Hue Room 타일
- [ ] 카카오톡·인스타그램 DM·문자 링크 미리보기
- [ ] Relay 이벤트와 abuse 기본 방어

### 성공 조건

- 링크로 다른 비공개 기록이나 위치를 찾을 수 없다.
- owner가 링크를 폐기하면 더 이상 열리지 않는다.
- 받은 사용자는 가입 전 Hueday의 핵심 행동을 이해한다.
- 결과에 승패·퍼센트·좋아요 수가 없다.
- Relay가 없어도 개인 기록과 Hue Room이 완전하다.

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

- [ ] auth, home, mission packs, camera, journal, story, history, Hue Room, Hueprint, Relay, profile 430x932 전수 캡처
- [ ] `.design-references/00-target-mockup/`과 전후 비교
- [ ] 컬러·타이포·여백·버튼·상태·모션 통일
- [ ] 로딩·빈 상태·권한 거부·오류·오프라인 상태
- [ ] 스크린리더·키보드·터치 영역·모션 줄이기
- [ ] 번들·이미지·방 첫 렌더·저사양 Android 성능
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
- [ ] 가입 → 촬영 → 저장 → 방 → Hueprint → Relay E2E
- [ ] `npm run cap:sync`
- [ ] Android debug/release build

### 실제 QA

- [ ] Chrome/PWA 설치
- [ ] Android 에뮬레이터
- [!] 실제 Android 휴대폰
- [ ] 카메라·위치·앨범·알림·공유 권한
- [ ] 네트워크 중단과 복구
- [ ] 계정 교차 접근·링크 만료·폐기
- [ ] 스토리·방·Hueprint 실제 공유
- [ ] 430x932 디자인 전수 비교

### 출시 판정

- 데이터 손실·권한 우회·다른 사용자 노출이 없다.
- 가입부터 핵심 결과 공유까지 막히지 않는다.
- Hue Room 보상은 실제 사용 가능하다.
- 핵심 이벤트가 중복이나 개인정보 없이 기록된다.
- `docs/release-readiness.md`에 실제 검증 날짜와 결과가 있다.
- 알려진 부채는 사용자 피해, 종료 조건, 후속 작업과 함께 기록된다.

## M10 — 출시 후 데이터 기반 확장

출시 전에는 만들지 않되, 실제 사용 증거가 생기면 아래 순서로 검토한다.

1. 첫 이탈 구간과 저장 실패 개선
2. 가장 많이 쓰는 미션 팩과 Hue Room 아이템 확장
3. Hueprint 공유가 검증되면 연간/실물 결과물
4. Relay가 검증되면 2~8명 close circle
5. 구매 의향이 확인되면 Creative Pack
6. 반복 가치와 저장 비용이 생기면 Plus
7. 커뮤니티 파일럿 뒤 B2B 미션
8. 충분한 표본과 개인정보 기준 뒤 익명 색 트렌드
9. Mac 빌드 환경과 Apple 계정 준비 뒤 iOS/TestFlight/App Store

공개 피드, 팔로워 수, 인기 순위, 실시간 공동 편집, 3D 방, 아이템 거래는 별도 증거 없이 자동으로 다음 단계가 되지 않는다.

## 단계별 문서·브랜치·모델 규칙

| 단계 | 핵심 문서 | 권장 모델/추론 | Plan | 주요 브랜치 |
| --- | --- | --- | --- | --- |
| M0 | 전체 청사진, 전체 로드맵, reference guide | Terra high | 켬 | `feature/product-roadmap-system` |
| M1 | blueprint, breakout, reward | Terra high | 필요 | `feature/color-hunt-contract` |
| M2 | release, security, metrics | Terra/Sol high | 켬 | `feature/core-funnel-observability` |
| M3 | growth, mission code | Terra high | 필요 | `feature/everyday-mission-packs` |
| M4 | Hue Room spec/roadmap, design QA | Sol high | 켬 | `feature/hue-room-renderer` |
| M5 | Hue Room, reward, Supabase | Terra/Sol high | 켬 | 단계별 feature branch |
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
- Hue Room 세 시안 중 메인 스타일
- 내비게이션에서 Hue Room의 위치
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
