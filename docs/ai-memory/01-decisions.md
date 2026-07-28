# 지속 결정

## 2026-07-29 — M7 전 제품 마감과 사진·위치 보안 (approved)

- M6 디자인 방향은 다시 열지 않는다. M7 store asset/전체 release QA 전에 실제 브라우저로 M6.5를 수행해 승인 시안과 다른 부분만 수정한다.
- 최초 문맥 추천은 횟수에 포함하지 않고 `다른 색`은 첫 사진 확정 전 하루 최대 6회다. 1~3회는 같은 날씨·시간·coarse-location 문맥, 4~6회는 전체 catalog 균등 무작위이며 그날 이미 보여 준 모든 색을 제외한다. 첫 사진 확정 뒤 잠금과 자정 초기화는 그대로다.
- Story에는 `중앙 색 이름 표시`를 추가한다. 기본은 켜짐이고, 끄면 Story 중앙 타일의 이름·HEX만 숨긴다. 원본 Post, mission identity, Story header, 다른 화면은 변경하지 않는다. legacy metadata는 켜짐으로 읽는다.
- 추천 색 이름은 감성보다 먼저 자연스럽고 이해 가능해야 한다. ID·HEX는 바꾸지 않고 한국어/영어 label만 전수 검토한다. 예: `소리 낮춘 고사리`는 `차분한 고사리빛`, `소리 낮춘 살구빛`은 `은은한 살구빛`, `소리 낮춘 테라코타`는 `차분한 테라코타` 같은 자연스러운 표현으로 교정한다. 기존 기록 label은 backfill하지 않는다.
- 첫 출시 보안은 private diary의 실제 위험에 맞춘다. raw/local master는 기기, cloud는 owner-private preview, RLS와 짧은 signed URL, analytics/log 개인정보 차단을 유지한다. M7에서 preview EXIF 위치 제거와 weather provider coarse 좌표 전달을 검증·구현하고 정확 좌표/장소명을 저장하지 않는다. 증거 없는 enterprise 보안·초대형 scale 구조는 보류한다.

## 2026-07-28 — M6 Modern Warm Archive CP1~CP4 구현 완료 (implementation fact, contract unchanged)

- CP0에서 승인된 DESIGN.md `Modern Warm Archive` 계약을 재해석하거나 축소하지 않고 그대로 구현했다. `feature/integrated-design-accessibility-performance`(base `main` `102b2de`, 시작 HEAD `944ceed`)의 CP1(`1b1e132`)/CP2(`4bfa8fe`)/CP3(`755dc01`)/CP4(`b61b8ee`)가 각각 canonical token/App shell, Auth·Today·Camera·Journal, History·Deck·Hueprint·Capsule·Story·Profile, 접근성·모션·성능 baseline을 담당했다.
- `LocalePreference`(`system`/`ko`/`en`) 3단 계약은 DESIGN.md 8절과 정확히 일치하게 신설했다. 기존 `colorwalk-locale` 값은 legacy fallback으로만 읽고 마이그레이션·삭제하지 않는다. 사용자 저널/색 이름 제안/서버 기록은 locale 변경으로 건드리지 않는다(diff로 확인).
- 색 대비는 DESIGN.md 2절의 WCAG relative-luminance+contrast-ratio 알고리즘을 `getReadableTextColor`/`getReadableTextContrast`로 그대로 구현했다. 임의 임계값이나 mission-color derived text color는 사용하지 않는다.
- 새 DB, migration, package, 서버, analytics SDK는 추가하지 않았다(diff로 확인). Daily Color Hunt·local-first draft/master·Supabase Post/client_meta/grid_images fallback·Living Hue Deck/Hueprint/Capsule 파생 규칙은 변경하지 않았다.
- Playwright 미설치로 인한 실제 브라우저 QA 제약은 계약 자체를 바꾸지 않는다 — CP5/M7에서 재시도가 필요한 별도 검증 공백으로 기록했다(`docs/design-qa-log.md`, `docs/release-readiness.md`).

## 2026-07-28 — 한국어·영어 UI와 해외 Google Play 준비 (approved)

- Hueday는 한국어와 영어 UI를 동시에 지원하고, 한국 외 Google Play 배포를 준비한다. 초기 마케팅과 고객 지원의 우선순위는 한국 사용자이며, 해외 성공이나 시장 규모는 이 결정만으로 주장하지 않는다.
- `시스템 설정` / `한국어` / `English` 3가지를 채택한다. 첫 실행은 기기·브라우저 언어를 따르되, 명시 선택은 기기 로컬에 저장해 사용자가 예측 가능하게 재설정할 수 있다. 한국어 이외의 지원하지 않는 시스템 locale은 영어로 fallback한다.
- UI와 Hueday가 작성한 날짜·시간·날씨·알림·오류·접근성·export copy만 하나의 effective locale로 바꾼다. 저널, 색 이름 제안, 기존 사용자 콘텐츠는 의미·개인 표현·서버 기록을 보존하기 위해 자동 번역하거나 재작성하지 않는다.
- M6은 앱 locale 구현과 UI 검증, M7은 Play Console 현지화·정책·언어별 실제 기기/출시 QA를 맡는다. store listing 번역은 앱 locale 구현 완료의 증거가 아니다.

## 2026-07-28 — M5 Hueprint·Color Capsule execution contract (approved and implemented)

- 대표 이름은 `Hueprint`로 확정하고 `Color DNA`는 기능명·진단명으로 사용하지 않는다. Hueprint/Capsule 파생은 오직 canonical `mission_hex`만 사용하며, 무효 `mission_hex`를 `captured_hex`, 이미지 픽셀, 날씨, 색 이름으로 절대 보정하지 않는다.
- `canonicalizeMissionHex()`를 throw하는 함수에서 `string | null`을 반환하는 안전한 함수로 바꿨다. 무효 legacy `mission_hex` 기록은 History/Deck/Story 진입을 그대로 유지하되 Hueprint/Capsule 파생과 Color Volume 그룹화에서만 제외한다. 가짜 대체색을 UI에 주입하지 않고 `LivingHueDeckView`에 neutral archive 배경(`deck-photo-mosaic-neutral`)만 추가했다.
- 로컬 표지 preference key는 `hueday:hueprint-cover:v1:<ownerId>:<weekKey>`로, `{version, postLocalDate, imageId}`만 저장한다. Supabase/IndexedDB daily-record/media-asset schema는 변경하지 않았다. stale 참조는 best-effort로 무시·삭제하고 결정적 기본 표지로 복구한다.
- 월간 Color Capsule은 종료 판정(8장 완성, `client_meta.colorHunt.closedAt` 존재, 또는 `local_date < 오늘`)이 있는 Hueprint-valid 기록만 포함한다. 오늘의 열린 1–7장 기록은 주간 Hueprint에는 보이지만 Capsule에는 종료 전까지 넣지 않는다.
- `다시 만난 색`은 (1) 동일 월·일의 가장 가까운 과거 연도, (2) 없으면 이전 달의 같은 날짜(월말 clamp) ±3일 중 최소 거리·최근 우선 순으로 후보를 고른다. 후보가 없으면 카드를 완전히 숨긴다.
- `getHueprintDetailTier()`는 기존 완료 페이지 수(`getCompletedGridCount()`)에서 파생한 단일 0~4 tier이며, 기존 3/7/14/30 배지 계약과 `getUnlockedBadges()` 결과를 변경하지 않는다. UI는 정확히 하나의 `.hueprint-tier-N` class만 적용한다.
- 전용 9:16 export는 `src/lib/shareImage.ts`로 StoryStudio의 기존 html2canvas→PNG, 웹 download/Web Share, Capacitor Filesystem/Share 패턴을 그대로 공용화했다. StoryStudio 자체의 관찰 가능한 콜백 타이밍/이벤트 의미는 변경하지 않았다(기존에도 native/web-share 경로는 `onExported`/`onShareOpened`를 실제 완료 전에 호출하는 낙관적 순서였고, 이 순서를 그대로 보존했다).
- Export 성공 analytics는 기존 세 이벤트 이름(`screen_viewed`/`session_summary`/`primary_cta_clicked`)만 재사용하고 `screen`/`cta`/`delivery` allowlist 값만 추가했다. `*_exported`는 `deliverExport()`가 실제로 resolve한 뒤에만 호출되며, dedupe key는 Hueprint `hueprint:<weekKey>:hueprint_exported:<delivery>`, Capsule `color_capsule:<monthKey>:color_capsule_exported:<delivery>`로 owner+기간+artifact+delivery를 인코딩한다(owner는 upsert의 `owner_id` 컬럼과 outbox key prefix로 이미 분리됨).
- 실행 중 두 개의 실제 버그를 발견·수정했다: (1) `.hueprint-export-card`의 `color-mix()` CSS가 html2canvas 파서에서 "unsupported color function" 예외를 던져 모든 Hueprint/Capsule export가 실패했다 — 고정 배경(`#f2ede1`)으로 교체해 해결. (2) `flushProductEvents()`가 owner당 in-flight 잠금 없이 매 `trackProductEvent()` 호출마다 독립적으로 pending outbox를 읽고 upsert해, 빠른 연속 화면 전환(Hueprint/Capsule 탐색으로 빈도가 늘어남) 시 같은 pending row가 두 번 전송되어 Supabase `product_events_pkey`(id) 충돌을 유발했다 — owner별 `Promise` 기반 재진입 잠금을 추가해 해결. 두 버그 모두 430×932 Playwright QA(실제 로그인 계정, 실제 Supabase)에서 콘솔 에러로 발견했다.
- Living Hue Deck spec의 "M3 카드에서는 기존 원본 Post의 Story Studio를 연다"는 그대로 유지된다. Hueprint/Capsule은 별도 Deck 이미지 포맷이나 업로드를 만들지 않는다.

## 2026-07-27 — 다중 계정 모델 풀을 비용 효율적으로 사용

- 상태: approved
- 결정: ChatGPT Plus, Kiro 유료 계정, Copilot Student, Gemini 학생 Pro 혜택을 별도 사용량 풀로 보고, 작업 영향도·역할·실제 도구 권한에 따라 가장 낮은 충분 모델을 고른다.
- 운영: 큰 방향 대화는 Codex Sol medium, 승인 계획은 Sol high+계획 모드, 승인된 다중 파일 구현은 Kiro Sonnet 5 high(Sonnet 4.6 안정형 fallback), 읽기 전용 독립 검토는 Antigravity Gemini 3.1 Pro high, 최종 통합은 Codex Terra medium을 기본으로 한다. Copilot Student는 Auto/월 200 credits이므로 장시간 agent 대신 무제한 completion과 작은 작업에 쓴다.
- 세션: 기능마다 계획 1회·구현 담당 1개·독립 검토 1회·최종 통합 1회만 두고, 역할 전환 전 commit·push한다. 동일 worktree 동시 수정, Kiro의 제품 방향 재결정, Antigravity의 파일 수정, 검증 없는 자동 병합은 금지한다.
- 이유: ChatGPT 고성능 사용량은 되돌리기 비싼 판단에 남기고, 학생 제공 사용량으로 저위험 작업을 처리하되 Hueday의 보안·데이터 보호·검증 품질은 낮추지 않는다.
- 근거: 사용자가 제공한 Kiro/OpenCodex 모델 목록, Copilot Student 사용량 화면과 보유 계정 정보(2026-07-27). 실제 한도·도구 권한은 provider UI에서 작업마다 확인한다.

## 2026-07-27 — M3 Living Hue Deck execution contract (approved and implemented)

- Color Volume is exact canonical six-digit mission HEX only: shared `hexToRgb`/`rgbToHex` normalizes normal casing such as `#ff0000` and `#FF0000`; no similarity grouping or speculative invalid-string recovery is added.
- A Deck visit receives a fresh random session ID. Entry, visible 1/3/5/8 stages, source/Story CTA, and Volume use the existing product-event schema and only allowlisted `screen`/`cta` payloads. Owner ID is not duplicated in the dedupe key; visible stages remain once per Deck session even when returning from Volume.
- M3 reuses only confirmed D-direction repository assets/CSS. Lazyweb was unavailable, so no unverified exterior reference or asset is invented.

## 2026-07-26 — Hue Canvas 출시 후 초기 필수 업데이트와 데이터 보존 (approved)

- Hue Canvas는 버전 1에는 포함하지 않지만 출시 후 가능한 한 빠르게 반드시 기능 업데이트한다. Hue Drop의 “우선순위 1”은 첫 소셜 업데이트라는 의미로 좁혀 두 기능의 충돌을 없앤다.
- 앱 업데이트는 `com.colorwalk.app`과 동일한 Play App Signing 계보를 유지하고 재설치·데이터 삭제·새 package를 요구하지 않는다.
- 기존 Color Hunt Post, 일일 draft, local master, Deck, Story는 Canvas migration 대상이 아니다. Palette는 완료 3×3에서 파생하고 발견 색을 소모하지 않는다.
- G1 prototype 브랜치는 main에 통째로 병합하지 않는다. 출시 후 새 production 브랜치에서 필요한 코드만 가져오고 versioned recipe, copy-forward migration, 실패 시 원본 보존, 기능 gate 롤백을 구현한다.
- 미래 Canvas DB를 버전 1에 미리 만들지 않는다. cloud recipe가 실제로 필요할 때 additive schema와 owner RLS를 추가하고 구버전 Color Hunt 읽기/쓰기를 보존한다.

## 2026-07-26 — Living Hue Deck 출시 전환과 Hue Drop 보류 (approved)

- 첫 출시의 발견 색 대표 콘텐츠는 Hue Canvas가 아니라 Living Hue Deck이다. Color Hunt 일일 기록은 1/3/5/8의 자동 카드 성장, Color Volume, 최대 3개 초기 컬렉션, 주간 Hueprint로 보상한다. 그림 실력·별도 창작 노동·streak·랜덤 가챠는 핵심 루프가 아니다.
- Hue Canvas G1 프로토타입과 상세 계약은 보존하되 출시에서 제외한다. G2·탭·도안/resize/export·Studio 수익화는 출시 후 사용 근거와 명시 재개 승인 전까지 시작하지 않는다.
- Hue Drop은 출시 후 우선순위 1이다. 중앙 미션 색과 주변 8개 `+` 슬롯을 초대받은 인증 사용자가 원하는 수만큼 채우는 친구 전용 구조다. 공개 검색·익명 참여·피드·댓글/좋아요는 유해 이미지와 운영 위험 때문에 만들지 않는다.
- 업데이트 안전은 출시 기능의 일부다. local copy-forward/검증/이전 형식 제거, 서버 expand/contract, Android 인플레이스 업데이트, PWA Service Worker 업데이트의 기록 보존을 저장 변경마다 확인한다. 미래 Hue Drop/Canvas용 DB·Realtime 뼈대는 미리 만들지 않는다.
- 무료 핵심은 Color Hunt·Deck·기본 Hueprint/Story·로컬 고화질 기록이다. 가격은 선택형 팩 1,500–3,900원, Studio 14,900/19,900원 후보, Cloud 월 1,500원/연 9,900원 5GB 후보로만 유지하며 실제 반응 전 확정·구현하지 않는다.

## 2026-07-24 — additive Supabase 변경의 자동 적용 경계 (approved)

- 새 테이블·새 nullable/default-safe 컬럼·새 인덱스·새 테이블의 owner-scoped RLS처럼 기존 데이터를 삭제·덮어쓰기·재해석하지 않는 되돌리기 쉬운 변경은 migration diff, 대상 project, 현재 schema, 비파괴적 비활성화/rollback, 비밀정보 부재를 확인하고 검증하면 별도 승인 없이 적용한다.
- DROP/TRUNCATE·기존 데이터 삭제·type/rename·기존 행을 실패시킬 수 있는 강한 제약·대량 backfill/변환·기존 RLS/Storage/Auth 접근 확대 또는 의미 변경·비용/보안/복구 영향이 큰 변경은 계속 적용 직전 명시 승인이 필요하다. 불확실하면 승인 대상으로 분류한다.
- Edge Function 배포와 실제 계정 삭제 QA의 별도 게이트는 유지한다. `product_events`는 이 기준의 additive 후보이나, 현재 환경에는 Supabase 관리자 access token이 없어 live apply 전 상태다.

## 2026-07-22 — Git 작업 방식

- `main`은 통합 전용으로 사용합니다.
- 큰 기능은 `feature/<기능명>` 브랜치에서 작업합니다.
- 의미 있는 검증 지점마다 한글 커밋을 만들고 푸시합니다.
- 기존 기능, 보안 규칙, 보상/배지 루프, 관련 문서를 함께 보존합니다.

## 2026-07-22 — AI 컨텍스트 방식

- Graphify는 코드 전체를 매번 읽는 대신 구조 그래프에서 필요한 부분을 찾는 데 사용합니다.
- Ponytail의 최소 변경 원칙은 프로젝트 규칙으로 흡수했습니다.
- Obsidian 기록의 기준 폴더는 `docs/ai-memory/`입니다.
- Graphify 생성물은 로컬 전용이며 Git에 커밋하지 않습니다.
- Graphify와 Obsidian 작업 데이터는 C 드라이브 용량을 아끼기 위해 D 드라이브에 둡니다.
- Ponytail CLI의 전역 lifecycle hook 대신 프로젝트 범위의 공식 Ponytail skill 파일을 `.codex/skills/`에 등록했습니다. Codex 재시작 후 `@ponytail-review` 등을 사용할 수 있습니다.
- 매 의미 있는 개발 작업에는 `hueday-development-workflow`를 적용합니다. 시작 시 Graphify와 기존 메모리를 확인하고, 종료 시 검증 결과와 세션 기록을 남깁니다.
- Obsidian vault UI 설정(`docs/ai-memory/.obsidian/`)과 Graphify 생성물은 로컬 전용으로 유지하고 Git에 커밋하지 않습니다.
- 프로젝트 관련 캐시는 D 드라이브로 고정하되, Windows 전역 TEMP/TMP와 시스템 통합이 필요한 Obsidian/JDK/Codex 전역 데이터는 안전성을 위해 C에 유지합니다.

## 2026-07-26 — 개발 작업 지속·중단 기준 (approved)

- 중간 commit·push는 종료 조건이 아닌 복구 체크포인트다. context compaction 뒤에는 AI memory와 Git 상태를 다시 읽고 현재 완료 조건까지 계속한다. 이는 실제 시스템 종료 뒤 자동 재개를 주장하는 것이 아니라 실행 가능한 동안 자진 종료하지 않는 원칙이다.
- 미검증 WIP나 단일 테스트 실패만으로 종료하지 않는다. 실제 사용자 흐름 범위에서 원인을 좁혀 수정하고, 환경 문제면 근거를 남긴 뒤 가능한 다음 작업을 계속한다. 좁은 검증 뒤 다음 체크포인트를 commit·push한다.
- 실행 중인 lint/build/Gradle/Capacitor 등은 중간 상태를 final 답변으로 보내지 않고 결과를 회수한다. 사용자가 사용량을 걱정한다고 명시하지 않은 한 작업이 길다는 이유로 멈추지 않는다.
- 실제 시스템 사용량·시간 제한이 실행을 끝내면 Git checkpoint와 AI memory 인계를 남긴다. 중단은 제품 방향의 사용자 선택, 파괴적 DB 변경·데이터 삭제·권한 확대 승인, 사용자만 할 수 있는 로그인·실기기 조작, 실제 시스템 제한, 또는 안전한 대안을 소진한 같은 환경 차단 반복일 때만 한다.

## 2026-07-22 — 제품 차별화와 실행 순서

- Hueday의 차별점은 SNS 피드가 아니라 `현실에서 오늘의 색 발견 → 3x3 수집 → 공유 가능한 결과 → Hueprint 축적`입니다.
- 첫 제품 개선은 대형 소셜 기능이 아니라 1컷 진행과 8컷 완성의 규칙 정렬, 첫 결과 시간 단축, 최소 행동 측정입니다.
- 다음 성장 기능은 공개 피드가 아니라 만료·폐기 가능한 오늘의 색 공유 링크와 `나도 이 색 찾기` 릴레이입니다.
- 베타 코어는 무료이며 광고를 넣지 않습니다. 리텐션 이후 1회 창작 팩·Studio 도구, 반복 저장 비용과 복구 가치가 확인된 뒤 Cloud, 이후 실물/B2B 미션을 검토합니다.
- 수익화 상품 범위, 무료 약속, 출시 조건, 측정 지표의 기준은 `docs/product-growth-strategy.md`의 `Monetization Model`에서 관리합니다.
- iOS 개발은 Windows에서 공통 코드를 유지하고 Mac 빌드 환경과 실기기 QA를 결합합니다. 현재 PWA 홈 화면 설치는 App Store 출시로 간주하지 않습니다.

## 2026-07-22 — 문서 정합성 계약

- 의미 있는 작업마다 실제 diff를 기준으로 제품 전략, 성장, 보상, 출시, 보안, 계획, AI memory 문서의 영향을 확인합니다.
- 오류·제약·보안·배포·중요한 트레이드오프 해결은 `docs/career-problem-solving-log.md`에 근거와 함께 남깁니다.
- 검증하지 않은 최신 상태나 외부 사실은 추측해 자동 작성하지 않습니다. 변경이 없으면 세션 기록에 영향 없음과 이유를 남깁니다.

## 2026-07-22 — 단일 에이전트 실행

- 모든 프로젝트 작업은 현재 Codex 작업의 에이전트가 직접 수행합니다.
- 하위 에이전트, worker agent, parallel agent를 생성하거나 작업을 위임하지 않습니다.
- Graphify의 기존 그래프 조회와 코드 전용 갱신은 현재 에이전트에서 실행합니다. 의미 추출이 하위 에이전트를 요구하면 이미 설정된 Gemini 또는 현재 에이전트의 최소 대체 경로만 사용하고, 대체가 불가능하면 생략 사실을 알립니다.
- 이 규칙은 사용자가 명시적으로 변경하기 전까지 유지합니다.

## 2026-07-22 — 작업별 모델과 실행 모드 선택

- 모델은 고정 최고 사양이 아니라 작업별 성공 조건을 만족하는 가장 낮은 충분한 사양을 선택합니다.
- Luna는 명확하고 반복적인 작업, Terra는 일반 개발의 비용·성능 균형, Sol은 모호하고 고가치이거나 되돌리기 어려운 판단에 사용합니다.
- 추론은 medium을 균형점으로 보고, 다단계·다자료·트레이드오프가 있을 때 high, 최고난도 품질 우선 작업에만 xhigh/Max를 검토합니다.
- 계획 모드는 모호성·의존 단계·재작업 비용이 큰 경우에만, 목표 모드는 여러 차례에 걸쳐 하나의 완료 목표를 추적할 때만 사용합니다.
- 하위 에이전트를 쓰는 Ultra는 프로젝트의 단일 에이전트 원칙과 충돌하므로 사용하지 않습니다.
- 세부 기준과 현재 Hueday 계획용 프롬프트는 `docs/ai-model-selection-guide.md`를 기준으로 갱신합니다.

## 2026-07-26 — M2-2 local master preset과 보존 경계

- 네 개 bitmap 표본의 0.86/0.90/0.92 비교에서 시각 기준을 충족한 0.90을 beta WebP master preset으로 유지한다. 정확한 byte/encode-ms 원시값은 보존되지 않았으므로 새 수치를 주장하지 않고, 다음 실제 카메라 표본 측정에서 기록한다.
- 검증된 local master만 staging 원본을 대체한다. raw/staging/master는 Supabase나 product-events에 보내지 않고 preview와 기존 Post metadata만 sync한다.
- Android AVD의 이번 부팅 실패와 System UI ANR, 기존 다른 서명 앱의 install 충돌은 제품 ANR이나 QA 통과로 해석하지 않는다. clean stable AVD 또는 실제 기기에서 capture → force-stop → offline/online retry를 다시 확인하는 것이 출시 전 gate다.

## 2026-07-26 — M2-3 manual master cleanup lifecycle (approved implementation)

- local master 정리는 sync 상태가 아니라 독립 `masterCleanupLifecycle`(`ready`/`cleanup-pending`/`cleaned`)로 추적한다. 기존 Blob/path 레코드는 ready로 읽되, cleaned는 staging·승격·재압축·재업로드 후보로 되돌리지 않는다.
- 사용자 확인 직후 같은 owner/date의 Post, 동기화 revision, 사진 수와 asset/path 집합, 모든 uploadPath, signed preview 실제 읽기를 검증해야 한다. 검증 실패면 local/서버 어느 쪽도 삭제하지 않는다.
- PWA는 atomic IndexedDB 정리, Android는 durable pending marker와 파일 존재 기반 재시작 복구를 쓴다. 복구는 새 delete를 호출하지 않으며 부분 실패 뒤 남은 ready만 재시도한다.
- CalendarView는 UI만 담당한다. 용량은 기존 masterBytes만 합산하고, 값 누락 시 원본 read/decode 없이 불가를 표시한다. preview 기반 온라인 사용과 오프라인 고화질 한계를 확인 문구로 고지한다.

## 2026-07-28 — M4 선택형 일상 미션 팩 최종 범위 (approved, 구현 완료)

- Static pack은 정확히 3개(`indoor-hunt` 실내 한 바퀴, `commute-hunt` 오가는 길, `rainy-window` 비 오는 창가)와 자유 모드(`id: null`)만 존재한다. 학교/캠퍼스·카페/편의점은 실내/이동 팩에 흡수하고, 컬러 산책·여행·계절·패션·음식·관심사 pack은 사용 근거가 쌓이기 전까지 만들지 않는다.
- Pack은 하루 페이지 전체에 적용되는 사용자 의도이며 사진별 분류자가 아니다. 색 후보 제한, 이미지 분석, 적합성 점수, 실패/경고/벌점을 만들지 않는다.
- "오늘 추천" 배지는 날씨/시간 문맥에 따라 표시만 하며 자동 선택하지 않는다.
- 1–7장에서 pack 변경/해제는 metadata-only이며 사진 Blob·master/preview/uploadPath·asset 레코드를 절대 건드리지 않는다. 8장 확정 시 즉시, 이전 날짜의 열린 기록은 boot/foreground/다음 촬영에서 lazy finalization하며 자정 타이머·서버 작업은 두지 않는다.
- Pack 전용 배지·해금 아이템·재화·별도 reward economy·유료 pack 경계는 M4에서 만들지 않는다. 주요 보상은 기존 8장 Deck 카드·Color Volume·완성 페이지 배지 계약을 그대로 사용한다.
- Analytics는 기존 `primary_cta_clicked.cta`/`screen_viewed.screen` allowlist만 확장하며 새 event name이나 `mission_pack_id` 같은 payload key를 추가하지 않는다.
- `feature/everyday-mission-packs`에서 구현·전체 검증·430×932 QA를 통과했으나(checkpoint 1 `5eeaf91`, checkpoint 2 `b3128c1`), `main` 병합은 별도 결정으로 남긴다.

## 2026-07-26 — Hue Canvas 프로토타입 우선순위 (approved)

- 공개 출시에는 최소하지만 완성된 Hue Canvas를 포함한다. 빈 Hue Canvas 탭이나 Coming Soon 전용 탭은 만들지 않는다.
- M2-2 저장 안정성 완료 뒤에는 전체 미션 팩보다 Hue Canvas의 시각·조작·실제 Canvas 2D 성능 프로토타입을 먼저 검증한다.
- 프로토타입 승인 뒤 local master 수동 정리와 최소 미션 팩을 진행한다. local master 정리는 출시 전 필수이며 자동 삭제를 금지하고, preview만 남아 복구할 수 없는 경우 경고와 사용자 확인을 사용한다.
- 이후 출시용 Hue Canvas·Palette·Color Rhythm 보상을 완성한다. Android capture → force-stop → offline/online retry는 출시 전 필수 QA로 유지하며, 현재 M2-2 구현 사실과 미통과 Android 실경로 QA를 바꾸지 않는다.

## 2026-07-22 — 빠르고 완성도 있는 출시

- 현재 계획의 시간축은 3개월 로드맵이 아니라 완성도 있는 제품 출시까지의 압축된 critical path입니다.
- `빠른 출시`를 `최소 기능만 출시`로 해석하지 않습니다. Color Hunt, 핵심 퍼널 측정, 안전한 Color Relay, Hueprint/Color Capsule, 실제 배지 보상처럼 성공 가능성을 만드는 실현 가능한 요소는 출시 범위에 포함합니다.
- 후순위는 close circle·공개 피드·복잡한 실시간 협업·대규모 운영 인프라처럼 구현 또는 운영 난도가 출시 가치에 비해 지나치게 큰 항목으로 제한하고, 제외 근거를 기록합니다.
- 속도를 이유로 제품 규칙의 일관성, 인증/RLS, 개인정보 보호, 데이터 손실 방지, 필수 빌드 검증과 실제 기기 핵심 여정 QA를 생략하지 않습니다.
- 계획에는 출시 전 필수, 병렬 가능, 난도 때문에 후순위를 명확히 나누고 기능별 성공 조건, 의존 순서, 자동 검증과 사용자 수동 작업을 기록합니다.

## 2026-07-22 — 전체 제품 청사진과 마스터 로드맵

- 지금까지 합의한 전체 제품 방향의 최상위 기준은 `docs/hueday-product-blueprint.md`입니다.
- 실제 현재 단계, 다음 한 작업, 기능별 완료 조건은 `docs/hueday-development-roadmap.md` 한 곳에서 관리합니다.
- Hue Room은 2026-07-23 결정으로 첫 출시와 현재 critical path에서 완전히 제외했습니다. 기존 상세 명세와 하위 로드맵은 출시 후 가설의 역사적 자료로만 유지합니다.
- 중앙 미션 색과 주변 8장 3x3을 유지하고, 사진 색 추출과 매칭률은 제품 판단에서 제외합니다.
- Hueday는 산책 전용이 아니라 집·학교·통학·카페·날씨·여행을 포함한 일상 속 색 발견 서비스입니다.
- 연속 일수보다 유연한 Color Rhythm과 누적 발견을 사용하며, 보상은 실제 Hue Canvas·Story·Hueprint 창작 옵션이어야 합니다.
- 발견 색은 저장된 `mission_hex`이며, 색은 소모하지 않고 여러 작품에 재사용하며 새 색으로 과거 작품을 리믹스할 수 있어야 합니다.
- 색상별 에셋 파일이나 생성형 AI 결과 저장에 의존하지 않고 결정적 SVG/Canvas 규칙을 우선합니다.
- SessionStart와 시작/종료 스크립트가 전체 단계·문서 라우팅·문서 누락 경고를 제공하되, 기준 문서의 의미는 Codex가 실제 diff를 보고 갱신합니다.

## 2026-07-22 — 1장 진행과 8장 완성 의미 정렬

- 게이트 1에서 B안, `1장은 진행 시작이고 8장은 오늘의 미션과 3×3 한 페이지 완성`으로 확정했습니다.
- 미션 색은 3×3 중앙에 두고 사용자가 일상에서 비슷한 색을 찾아 주변 8칸을 채웁니다. 색 매칭 점수나 정확도는 사용자에게 노출하지 않습니다.
- 첫 사진은 안전하게 저장되는 `첫 색 발견`이자 `오늘의 색 씨앗`입니다. 오늘 기록이나 미션의 최종 완료로 부르지 않습니다.
- 8장을 채우면 오늘의 미션과 한 페이지가 완성되고 발견 색 재료, Hueprint, 공유 결과물 같은 주요 보상으로 연결합니다.
- 당시에는 당일 완성을 강제하지 않고 나중에 이어서 채우는 안으로 기록했습니다. 이 중 `여러 날짜에 걸친 이어 채우기`는 2026-07-23 후속 결정으로 대체됐고, 1장과 8장의 보상 의미 구분은 유지합니다.
- A안 `한 장으로 오늘 기록 완료, 나머지는 선택 확장`은 실패안이 아니라 비교 검토한 대안으로 남깁니다. 빠른 성취감은 장점이지만 3×3 완성의 제품 의미와 주요 보상 축을 약화하므로 채택하지 않았습니다.
- 현재 코드의 1장 저장·저널 진입·초안 복구는 같은 날짜 안에서 부담 없이 기록하고 이어갈 수 있다는 구현 기반입니다. 날짜 경계와 부분 기록·완성 상태를 구분하지 않는 차이는 M1 후속 개발 항목입니다.
- 이전 판단에서 기존 제품 문서보다 현재 구현 편의와 빠른 첫 결과를 과대평가해 A안을 추천한 것은 판단 오류였습니다. 이후 디자인 결정은 승인된 제품 방향을 먼저 기준으로 삼고 구현 차이는 후속 개발 항목으로 분리합니다.
- 새 디자인 제안이 제품 청사진·성장 전략·보상 시스템·발견 색 대표 콘텐츠 결정과 충돌하면 임의로 바꾸지 않고 충돌 내용과 선택지를 먼저 제시합니다.

## 2026-07-23 — 현지 날짜별 새 컬러와 비처벌형 일일 기록

> 2026-07-29 변경: 아래 3회 이후 무제한 교체 규칙은 상단의 `M7 전 제품 마감` 결정으로 대체됐다. 현재 승인 계약은 `다른 색` 최대 6회와 당일 노출 색 전체 제외다. 나머지 첫 사진 잠금·부분 기록·자정 종료 결정은 유지한다.

- 기기 현지 날짜마다 새 미션 색 선택을 시작합니다. 국가를 추정해 시간대를 강제하지 않습니다.
- 첫 추천은 날씨·시간·선택적 대략 위치를 사용하고, `다른 색` 최대 3회도 같은 문맥에서 다른 색을 제안합니다.
- 네 번째 변경부터는 현재 표시 색을 제외한 전체 큐레이션 색에서 모든 색을 같은 확률로 뽑습니다.
- 첫 사진을 촬영한 것만으로 잠그지 않고 사용자가 그 사진을 확정한 순간 그날의 미션 색을 잠급니다.
- 1–7장도 유효한 그날 기록입니다. 8장을 채운 경우에만 3×3 한 페이지와 주요 보상을 완성합니다.
- 현지 자정에는 현재 사진 수로 그날 기록을 닫고 다음 날 새 색을 제안합니다. 카메라 사용 중 자정이 되었다고 화면을 강제로 끊지 않고 앱 재진입이나 다음 촬영 시 날짜를 확인합니다.
- 전날 기록을 오늘의 활성 미션으로 이월하지 않으며, 8장을 못 채운 것을 실패·손실·연속 일수 초기화로 표현하지 않습니다.
- 출시 전 실제 사용자가 없으므로 3·7·14·30 배지는 완성 3×3 페이지 수 기준으로 즉시 전환하고 과도기 호환 보상은 만들지 않습니다.

## 2026-07-23 — Hue Room 완전 보류와 대체 콘텐츠 탐색

- Hue Room을 간소화해 출시하는 것이 아니라 첫 출시 핵심에서 완전히 제외하고 나중으로 보류합니다.
- H3 구조와 제한적인 H2 패브릭 선호를 따라 레퍼런스를 높이는 과정이 사실적인 2.5D/3D 가구와 꾸미기 게임 수준으로 커진 것은 제품 중심을 벗어난 범위 팽창으로 판단했습니다.
- D — Chromatic Archive의 외부 UI 방향은 유지하되, 그 안의 대표 콘텐츠는 방·가구·배치가 아닌 발견 색 완전 대체 콘텐츠로 다시 정합니다.
- 대체 콘텐츠는 소유감, 누적감, 변형, 원본 기억 재진입, 공유, 복귀 이유를 모두 제공해야 합니다.
- 초기 1순위였던 Hue Studio는 이후 사용자 아이디어와 현실성 검토를 거쳐 Hue Canvas로 대체했습니다.
- Hue Room 문서와 로컬 시안은 삭제하지 않지만, 새 사용자 승인과 실제 수요 근거 없이는 HR 작업을 재개하지 않습니다.

## 2026-07-23 — Hue Canvas와 발견 색 사용량

- 발견 색 대표 콘텐츠 이름은 Hue Canvas입니다.
- 완성 3x3의 `mission_hex`를 Hue Palette에 넣고, 같은 색을 완성한 횟수가 한 작품에서 사용할 수 있는 해당 색 타일 수가 됩니다.
- 색은 영구 소모하지 않습니다. 지우거나 바꾸면 작품 내 사용량이 돌아오고 여러 작품에서 재사용합니다.
- 4x4 고정판 대신 확대·축소 가능한 큰 가상 격자를 사용합니다.
- 자유 캔버스와 검은 선 도안을 모두 제공하며, 도안 크기를 칠하기 전에 바꾸면 필요한 셀 수가 자동 조절됩니다.
- 기본 재질은 반투명 스테인드글라스입니다. HEX별 에셋을 만들지 않고 공통 Canvas/SVG 렌더 규칙에 색을 주입합니다.
- Hue Charm과 Hue Deck은 우선 추후 확장 후보, Hue Bouquet·Loom·Glass 등은 재질/도안 또는 장기 후보입니다.

## 2026-07-23 — 로컬 우선 저장과 수익화

- 저장은 로컬 고화질 마스터 + 작은 필수 클라우드 + 선택형 유료 고화질 백업으로 분리합니다.
- 무료 사용자는 작은 메타데이터·preview 동기화와 수동 `.hueday` archive 이전을 사용할 수 있어야 합니다.
- Hueday Cloud 가격 가설은 월 1,500원·연 9,900원, 5GB 백업·자동 복구·고화질 다시 받기·30일 휴지통입니다. 반복 비용 때문에 평생 Cloud 이용권은 판매하지 않습니다.
- Hueday Studio 1회 구매 가격 가설은 19,900원, 출시 프로모션 14,900원 검토입니다. 고급 기기 내 창작 도구를 제공하되 Cloud·AI·실물·모든 미래 팩은 포함하지 않습니다.
- 기본 Hue Canvas, 얻은 색, 기본 재질/도안, 로컬 저장/export는 무료로 유지합니다.

## 2026-07-28 — 결제는 무료 버전 출시 후 additive 업데이트 (approved)

- 버전 1에는 결제 모듈을 넣지 않고 무료 핵심 경험과 인플레이스 업데이트 보존을 먼저 검증합니다.
- 결제는 무기한 보류가 아니라 첫 우선 후속 업데이트 `M8M`입니다. 사용자가 유료 업데이트·Studio·Cloud·paywall·entitlement를 요청하면 `docs/post-launch-monetization-and-payment-safety.md`를 자동으로 읽고 그 절차를 따릅니다.
- 첫 상품 기본안은 반복 서버 비용이 작은 Hueday Studio 1회 구매입니다. Cloud는 실제 storage/egress와 복구 수요를 측정한 뒤 별도 승인합니다.
- 결제 권한은 기존 Post·사진·IndexedDB/local master와 분리된 additive 계층이며 Supabase user ID에 귀속합니다. 결제 도입을 이유로 기존 사용자 데이터를 backfill·변환·삭제하지 않습니다.
- 구매 실패·보류·환불·취소·만료가 무료 기록 열람, 기본 내보내기와 계정 삭제를 막지 않습니다.

## 2026-07-23 — 백엔드 공급자 역할

- 현재 Supabase Auth·Postgres·RLS·Storage 결합과 검증 자산을 유지하며 Railway로 선제 이전하지 않습니다.
- Cloudflare R2는 Hueday Cloud 고화질 백업의 저장량·전송량 비용이 실제로 커질 때 객체 저장만 분리하는 후보입니다.
- Railway는 이미지 처리·예약 작업·알림 등 장시간 백엔드 작업이 생길 때 보조 실행 환경으로만 검토합니다.
- 측정된 병목 없이 Neon·Firebase·Appwrite 또는 다중 공급자 추상화를 도입하지 않습니다.

## 2026-07-23 — 방향 변경 승인 계약

- 제품 결정은 승인·후보·보류·역사적·구현 사실로 구분합니다.
- Codex는 후보를 자동 승격하거나, 보류 기능을 재개하거나, 현재 코드에 맞추려고 승인 계약을 약화하지 않습니다.
- 핵심 루프, Hue Canvas, 디자인, 보상 경제, 무료/유료 경계, 저장 모델, 패키지 ID, 출시 범위를 바꾸려면 현재 결정·충돌 근거·영향·선택지를 먼저 보여 주고 명시적 승인을 받습니다.

## 2026-07-26 — 최소 제품 분석과 초기 운영 구조

- 조회수·체류시간·D1/D7/D30 재방문·핵심 CTA·저장 오류를 측정하되 모든 클릭을 수집하지 않고 allowlist 이벤트와 집계 지표만 사용합니다.
- 구현 계약은 `screen_viewed`, `session_summary`, `primary_cta_clicked` 세 이벤트뿐이다. D1/D7/D30은 별도 이벤트가 아니라 저장된 이벤트의 cohort 집계로 계산한다. payload 키는 `screen`, `foreground_seconds`, `cta`, `delivery`만 허용한다.
- 베타와 출시 직후에는 Supabase 집계 SQL로 운영하고, 반복 수동 작업이 확인된 뒤 aggregate-only Edge Function과 비공개 관리자 웹 화면을 만듭니다.
- 관리자 화면은 원시 사진·일기·정확 위치나 service role을 브라우저에 노출하지 않습니다.
- Vercel 정적 CDN + Supabase Auth/Postgres/RLS/Storage 구조를 유지합니다. 실제 병목 없이 Railway, 외부 analytics SDK, 메시지 큐, 마이크로서비스, 데이터 웨어하우스를 추가하지 않습니다.
- 초기 용량은 추정 사용자 수로 주장하지 않고 초대 베타 예상 peak의 2배를 M9에서 측정합니다.
- 취업용 문제해결 기록에는 실제 전후 수치·단위·환경·날짜·표본·증거를 자동 점검하고, 값이 없으면 `아직 측정하지 않음`과 다음 측정을 적습니다.

## 2026-07-26 — 현실 사용자 흐름 중심 QA

- QA는 도달 가능성·발생 가능성·사용자 피해를 기준으로 P0/P1/P2로 나눕니다.
- 실제 핵심 사용자 흐름과 인증·권한·비밀정보·결제·데이터 손실 경계는 필수로 유지합니다.
- 일반 기능은 변경된 happy path 1개와 현실적으로 가장 가능성 높은 실패·복구 path 1개부터 검증합니다.
- UI에서 만들 수 없는 입력, 큐레이션 밖 임의 값, 미지원 환경, 모든 timing race와 상태·기기·네트워크 전수 조합은 실제 제보·telemetry·지원 요구·보안 근거가 생길 때까지 보류합니다.
- 가정성 엣지케이스를 위해 새 framework·dependency·범용 abstraction·대형 fixture matrix를 만들지 않습니다.
- 검증이 승인된 성공 조건을 충족하면 멈추고 다음 사용자 가치 작업으로 이동해 토큰·시간을 아낍니다.
