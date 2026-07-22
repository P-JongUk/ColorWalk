# 현재 상태

## 제품

- 공개 브랜드: Hueday
- 내부 저장소/패키지/Supabase 이름: ColorWalk 유지
- 현재 최우선 목표: 전체 마스터 로드맵을 따라 Color Hunt 규칙, 안정성·측정, 일상 미션 팩, Hue Room·Color Rhythm 보상, Hueprint/Color Capsule, 안전한 Color Relay를 완성하고 품질·보안·실기기 QA를 통과해 최대한 빠르게 출시
- 핵심 루프: 일상 미션 색 → 현실에서 비슷한 색 찾기 → 중앙 색 3x3 컬렉션 → Hue Room/Hueprint 정체성 → 스토리/Relay 공유
- 현재 구현: 아이디/비밀번호 인증, 날씨·시간 미션, 최대 8장 촬영과 로컬 초안 복구, Supabase 저장, 짧은 일기, 9:16 스토리/3x3 공유, 달력, 배지 표시, 로컬 알림, PWA/Android
- 현재 미구현: 일상 미션 팩 선택, Hue Room·색 보관함·재채색, Color Rhythm, 공개 안전 Relay 링크, 월간 Hueprint/Capsule, 실제 아이템 해금, 행동 분석, 결제, 네이티브 iOS
- 현재 제품 불일치: 카메라는 1장부터 완료할 수 있지만 UI와 전략은 8컷 완성을 강조함
- 현재 마스터 단계: M1 컬러 헌트 제품 진실 정렬. 다음은 1장 진행과 8장 완성의 의미를 코드 근거와 함께 사용자에게 제안하고 승인받는 작업
- 제품·시장·수익화·iOS 기준 문서: `docs/hueday-breakout-strategy.md`
- 상세 성장 backlog: `docs/product-growth-strategy.md`
- 취업용 문제해결 기록: `docs/career-problem-solving-log.md`
- 작업별 모델·추론·계획/목표 모드 선택 기준: `docs/ai-model-selection-guide.md`
- 전체 제품 합의: `docs/hueday-product-blueprint.md`
- 현재 마스터 단계·다음 한 작업: `docs/hueday-development-roadmap.md`
- 작업 유형별 문서 라우팅: `docs/development-reference-guide.md`
- Hue Room 상세: `docs/hue-room-product-spec.md`, `docs/hue-room-development-roadmap.md`

## 저장소

- 통합 브랜치: `main`
- 현재 작업 브랜치: `feature/product-roadmap-system`
- 대형 기능 브랜치 규칙: `feature/<기능명>`
- 커밋 메시지: 한글, 가능하면 `feat:`, `fix:`, `docs:` 등의 접두사 사용
- 현재 그래프: Graphify 0.9.23, 1,280개 노드와 1,280개 연결, 133개 community (2026-07-22 갱신)
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
