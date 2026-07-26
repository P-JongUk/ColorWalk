# 현재 상태

## 제품

- 공개 브랜드: Hueday
- 내부 저장소/패키지/Supabase 이름: ColorWalk 유지
- 현재 최우선 목표: 전체 마스터 로드맵을 따라 Color Hunt 규칙, 안정성·측정, 일상 미션 팩, 발견 색 대표 창작 콘텐츠·Color Rhythm 보상, Hueprint/Color Capsule, 안전한 Color Relay를 완성하고 품질·보안·실기기 QA를 통과해 최대한 빠르게 출시
- 핵심 루프: 개인 일일 색 기록 → 편집 없이도 공유하고 싶은 3×3/9:16 카드 → 받은 친구의 나도 이 색 찾기 → 두 결과의 공동 팔레트·엽서·Hueprint → 다음 기록으로 재진입. 개인 기록은 단독으로 완결되고 공유·친구 참여는 무료 성장 행동이다.
- 현재 구현: 아이디/비밀번호 인증, 사용자·현지 날짜별 mission/재추천 상태, 촬영 미리보기 후 `이 사진 사용` 확정, 1~7장 날짜별 IndexedDB 초안·서버 Post 병합, 8장 완성 페이지 배지, Supabase 저장, 짧은 일기, 9:16 스토리/3x3 공유, 달력, 로컬 알림, PWA/Android
- 백엔드 공급자 결정: 출시와 초기 성장에는 검증된 Supabase Auth·Postgres·RLS·Storage를 유지한다. R2는 유료 고화질 백업 비용이 측정된 뒤, Railway는 장시간 서버 작업이 실제로 필요할 때만 보조 도입한다.
- M2-1 구현 완료: 최소 분석 이벤트·IndexedDB outbox·핵심 E2E와 live `product_events` 수집. 2026-07-26 `npm run verify:supabase`에서 ready·owner read·dedupe·anonymous/cross-user denial을 확인했다. 그 밖에 일상 미션 팩 선택, Hue Palette/Canvas·리믹스, 로컬 우선 저장·Cloud 계층, Color Rhythm, 공개 안전 Relay 링크, 월간 Hueprint/Capsule, 실제 창작 옵션 해금, 결제, 네이티브 iOS는 미구현이다.
- 확정된 Color Hunt 의미: 기기 현지 날짜마다 날씨·시간·선택적 대략 위치 기반 색을 새로 추천하고 최대 3회까지 같은 문맥으로 바꾼 뒤 전체 큐레이션 색 균등 무작위를 제공한다. 첫 사진을 확정하면 그날 색이 잠긴다. 1–7장도 유효한 일일 기록이며 8장만 3×3 한 페이지와 주요 보상을 완성한다. 현지 자정에는 현재 장수로 닫고 다음 날 새 색을 선택한다.
- M1 구현 상태: `feature/color-hunt-contract`의 날짜별 Color Hunt 계약·복구·QA 결과를 `c22d7a3`으로 `main`에 통합했다. 2026-07-24 KST lint·19개 unit test·build·라이브 Supabase 검증·Capacitor sync·Android debug/release build와 430×932 브라우저 QA를 통과했고, 병합된 `main`에서도 lint·19개 test·production build·`git diff --check`를 다시 통과했다. 별도 `ColorWalkM1QA` AVD에서는 실제 카메라 촬영·다시 찍기·확정, 1/8 저장·background/foreground 복구와 2/8·5/8 순차 촬영까지 확인했다. 전역 날짜 mock은 Supabase 인증 시간과 충돌해 Android 날짜 QA의 유효한 방법이 아니었고, clean `wipe-data` cold boot에서는 앱 설치 전 System UI·전화·Google Play services ANR이 반복됐다. 따라서 Android 7/8·8/8 완료/배지·foreground 날짜 전환·저널/Story 네이티브 공유는 실제 기기 또는 안정적인 AVD에서 남아 있다. 기존 `ColorWalkPixel7` 데이터는 건드리지 않았다.
- 현재 마스터 단계: M2 안정성·데이터·측정 기반. M2-1 관측성·E2E·live event 수집을 완료했고 다음 저장 안정성 하위 작업을 준비한다.
- 현재 디자인 결정: 외부 앱 UI는 D — Chromatic Archive를 작업 방향으로 유지한다. Hue Room H1/H2/H3 시안은 승인된 출시 화면이 아니며 모든 방·가구·2.5D/3D 작업을 중단했다.
- 현재 다음 작업: main에 병합된 M2-1 다음으로 local master·offline sync의 별도 범위를 승인받는다. `grid_images` migration과 과거 remote migration history 불일치는 별도 DB 전환 gate로 기록만 유지하고, 이번에는 적용·repair하지 않는다. M1 Android 잔여 항목은 실제 기기 또는 안정적인 AVD가 확보되는 즉시 병행 검증하되, 출시 전에는 반드시 닫는다.
- 제품·시장·수익화·iOS 기준 문서: `docs/hueday-breakout-strategy.md`
- 상세 성장 backlog: `docs/product-growth-strategy.md`
- 취업용 문제해결 기록: `docs/career-problem-solving-log.md`
- 작업별 모델·추론·계획/목표 모드 선택 기준: `docs/ai-model-selection-guide.md`
- 전체 제품 합의: `docs/hueday-product-blueprint.md`
- 현재 마스터 단계·다음 한 작업: `docs/hueday-development-roadmap.md`
- 작업 유형별 문서 라우팅: `docs/development-reference-guide.md`
- Hue Canvas 상세 계약: `docs/hue-canvas-product-spec.md`
- 발견 색 후보·보류·확장: `docs/discovered-color-content-strategy.md`
- 저장·동기화·비용: `docs/data-storage-sync-and-cost-strategy.md`
- 디자인 자료 상태·D 경로: `docs/design-reference-index.md`
- Hue Room 역사적 보류 자료: `docs/hue-room-product-spec.md`, `docs/hue-room-development-roadmap.md`

## 저장소

- 통합 브랜치: `main`
- 최근 완료 기능 브랜치: `feature/color-hunt-contract` — M1 날짜별 Color Hunt 계약·기록 복구·QA를 `c22d7a3`으로 `main`에 통합
- 다음 개발 브랜치: `feature/core-funnel-observability`
- 대형 기능 브랜치 규칙: `feature/<기능명>`
- 커밋 메시지: 한글, 가능하면 `feat:`, `fix:`, `docs:` 등의 접두사 사용
- 현재 그래프: Graphify 0.9.23, 1,569개 노드와 1,563개 연결, 161개 community (2026-07-24 코드 전용 갱신)
- Graphify 실행 환경: `D:\JongUk\Documents\ColorWalk\.graphify-venv`
- Codex CLI 실행 환경: `D:\JongUk\Documents\ColorWalk\.codex-cli`
- Graphify 생성물: `D:\JongUk\Documents\ColorWalk\graphify-out\`
- Obsidian 기록 vault: `D:\JongUk\Documents\ColorWalk\docs\ai-memory\`

## 작업 방식

0. 모든 작업은 현재 Codex 에이전트가 직접 수행하며 하위 에이전트를 생성하거나 위임하지 않습니다.
1. 작업의 모호성·영향·되돌리기 비용·검증 난이도로 모델, 추론, 계획/목표 모드를 고릅니다.
2. Graphify로 관련 구조와 의존 관계를 먼저 확인합니다.
3. 범위와 성공 조건을 정합니다.
4. 가장 작은 변경을 구현합니다.
5. 관련 검증을 실행합니다.
6. 결정, 결과, 실패한 접근, 다음 할 일을 이 vault에 기록합니다.

## 자동화 상태

- 프로젝트 스킬: `.codex/skills/hueday-development-workflow/`
- `AGENTS.md`가 의미 있는 작업 전 `docs/ai-model-selection-guide.md`를 확인하고, 설정 변경이 유의미할 때 사용자에게 추천하도록 규정합니다.
- 새 Codex 세션 시작 시 `.codex/hooks.json`의 `SessionStart` hook이 작업 체크리스트를 출력합니다.
- SessionStart가 전체 마스터 단계·다음 한 작업·핵심 문서를 표시하고, 작업 시작 질문이 있으면 기능별 문서를 자동 라우팅합니다.
- 작업 종료 시 필수 문서 존재와 코드 변경별 문서 누락 가능성을 검사합니다.
- Graphify의 post-commit/post-checkout hook이 코드 구조 그래프를 갱신합니다.
- 작업 종료 스크립트가 `docs/ai-memory/sessions/`에 세션 기록을 만들고 Graphify를 갱신합니다.
- 작업 종료 기록에는 기준 문서 영향과 취업 사례 영향이 포함됩니다. 알려진 코드/문서 모순을 남기지 않고, 변경이 없으면 이유를 기록합니다.
- Ponytail 프로젝트 스킬은 `.codex/skills/ponytail*`에 연결되어 있습니다.
- npm/pip/uv/Playwright 캐시와 Gradle/Android/Vercel 작업 데이터는 D 드라이브 우선 환경 변수로 고정되어 있습니다.
- Playwright 브라우저 캐시는 `C:\Users\JongUk\AppData\Local\ms-playwright`에서 `D:\JongUk\Documents\ColorWalk\.playwright-browsers`로 이동했습니다.
- Obsidian 실행 파일, JDK, Codex 전역 플러그인 캐시는 시스템 통합을 위해 C 드라이브에 유지합니다.
