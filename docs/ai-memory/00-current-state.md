# 현재 상태

## 제품

- 공개 브랜드: Hueday
- 내부 저장소/패키지/Supabase 이름: ColorWalk 유지
- 핵심 루프: 일일 색 미션 → 현실에서 색 찾기 → 3x3 컬렉션 → 스토리/공유 카드 → 색 정체성 축적
- 현재 구현: 아이디/비밀번호 인증, 날씨·시간 미션, 최대 8장 촬영과 로컬 초안 복구, Supabase 저장, 짧은 일기, 9:16 스토리/3x3 공유, 달력, 배지 표시, 로컬 알림, PWA/Android
- 현재 미구현: 공개 안전 공유 링크, 친구/close circle, 월간 Hueprint 결과물, 실제 배지 아이템 해금, 행동 분석, 결제, 네이티브 iOS
- 현재 제품 불일치: 카메라는 1장부터 완료할 수 있지만 UI와 전략은 8컷 완성을 강조함
- 제품·시장·수익화·iOS 기준 문서: `docs/hueday-breakout-strategy.md`
- 상세 성장 backlog: `docs/product-growth-strategy.md`
- 취업용 문제해결 기록: `docs/career-problem-solving-log.md`

## 저장소

- 통합 브랜치: `main`
- 대형 기능 브랜치 규칙: `feature/<기능명>`
- 커밋 메시지: 한글, 가능하면 `feat:`, `fix:`, `docs:` 등의 접두사 사용
- 현재 그래프: Graphify 0.9.23, 1,001개 노드와 1,004개 연결, 120개 community (2026-07-22 갱신)
- Graphify 실행 환경: `D:\JongUk\Documents\ColorWalk\.graphify-venv`
- Codex CLI 실행 환경: `D:\JongUk\Documents\ColorWalk\.codex-cli`
- Graphify 생성물: `D:\JongUk\Documents\ColorWalk\graphify-out\`
- Obsidian 기록 vault: `D:\JongUk\Documents\ColorWalk\docs\ai-memory\`

## 작업 방식

0. 모든 작업은 현재 Codex 에이전트가 직접 수행하며 하위 에이전트를 생성하거나 위임하지 않습니다.
1. Graphify로 관련 구조와 의존 관계를 먼저 확인합니다.
2. 범위와 성공 조건을 정합니다.
3. 가장 작은 변경을 구현합니다.
4. 관련 검증을 실행합니다.
5. 결정, 결과, 실패한 접근, 다음 할 일을 이 vault에 기록합니다.

## 자동화 상태

- 프로젝트 스킬: `.codex/skills/hueday-development-workflow/`
- 새 Codex 세션 시작 시 `.codex/hooks.json`의 `SessionStart` hook이 작업 체크리스트를 출력합니다.
- Graphify의 post-commit/post-checkout hook이 코드 구조 그래프를 갱신합니다.
- 작업 종료 스크립트가 `docs/ai-memory/sessions/`에 세션 기록을 만들고 Graphify를 갱신합니다.
- 작업 종료 기록에는 기준 문서 영향과 취업 사례 영향이 포함됩니다. 알려진 코드/문서 모순을 남기지 않고, 변경이 없으면 이유를 기록합니다.
- Ponytail 프로젝트 스킬은 `.codex/skills/ponytail*`에 연결되어 있습니다.
- npm/pip/uv/Playwright 캐시와 Gradle/Android/Vercel 작업 데이터는 D 드라이브 우선 환경 변수로 고정되어 있습니다.
- Playwright 브라우저 캐시는 `C:\Users\JongUk\AppData\Local\ms-playwright`에서 `D:\JongUk\Documents\ColorWalk\.playwright-browsers`로 이동했습니다.
- Obsidian 실행 파일, JDK, Codex 전역 플러그인 캐시는 시스템 통합을 위해 C 드라이브에 유지합니다.
