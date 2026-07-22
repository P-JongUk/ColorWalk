# 세션 기록 — 2026-07-22-1354 — D 드라이브 우선 개발 환경 구성

## 목표

D 드라이브 우선 개발 환경과 설치 경로 구성

## 범위와 성공 조건

- 범위: 프로젝트 캐시, 빌드 도구, Playwright, 환경 변수, 문서
- 성공 조건: 새 PowerShell에서 핵심 경로가 D를 가리키고, lint와 Graphify가 통과함

## Graphify에서 확인한 구조

- 기존 D 드라이브 경로와 `AGENTS.md`의 Android/Gradle/Vercel 환경 설정을 확인했습니다.
- 변경 후 Graphify가 865개 노드, 874개 연결, 115개 커뮤니티로 갱신됐습니다.

## 결정

프로젝트 캐시와 빌드 데이터는 D에 고정하고, Obsidian 실행 파일·JDK·Codex 전역 플러그인 캐시는 시스템 통합을 위해 C에 유지합니다.

## 변경 내용

- Playwright 캐시를 C에서 D로 이동하고 `PLAYWRIGHT_BROWSERS_PATH`를 설정했습니다.
- npm, pip, uv, Gradle, Android SDK/AVD, Vercel 관련 사용자 환경 변수를 D 경로로 고정했습니다.
- 워크플로 스크립트와 `AGENTS.md`, Obsidian 문서에 D 드라이브 정책을 추가했습니다.
- `.tmp` 생성물이 lint 대상이 되지 않도록 ESLint ignore를 보강했습니다.

## 검증

- 새 PowerShell 환경 변수 상속 확인
- Playwright 원본 경로 없음 및 D 대상 경로 존재 확인
- `npm run lint` 통과
- `graphify update .` 통과

## 실패했거나 보류한 접근

초기 lint가 `.tmp`의 Ponytail 임시 JavaScript를 검사해 실패했으므로 ESLint에서 `.tmp`를 제외했습니다. 기능 소스는 변경하지 않았습니다.

## 다음 할 일

새 터미널을 열어 D 환경 변수를 상속한 뒤 다음 기능을 `feature/<기능명>`에서 시작합니다.
