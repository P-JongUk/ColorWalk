# ColorWalk AI Memory

이 폴더는 Obsidian에서 바로 열 수 있는 프로젝트 작업 기록 공간입니다.

## 사용 방법

Obsidian에서 `D:\JongUk\Documents\ColorWalk\docs\ai-memory` 폴더를 vault로 엽니다.

- [[00-current-state]]: 현재 제품과 저장소 상태
- [[01-decisions]]: 계속 유지해야 하는 결정과 제약
- [[02-next-tasks]]: 다음 작업 후보
- [[03-session-template]]: 작업 종료 시 복사해 쓰는 세션 기록 양식
- [[../hueday-product-blueprint|Hueday 전체 제품 청사진]]: 지금까지 합의한 전체 제품 방향
- [[../hueday-development-roadmap|Hueday 전체 개발 마스터 로드맵]]: 현재 단계와 다음 한 작업
- [[../development-reference-guide|개발 참고 문서 가이드]]: 작업 유형별 필수 문서와 갱신 대상
- [[../hue-room-product-spec|Hue Room 제품·디자인 명세]]: Hue Room 상세 기준
- [[../hue-room-development-roadmap|Hue Room 개발 로드맵]]: Hue Room 하위 구현 순서
- [[../ai-model-selection-guide|AI 모델·추론·모드 선택 가이드]]: 작업 시작 전 비용·품질에 맞는 설정과 프롬프트 선택 기준
- `sessions/`: 각 개발 작업의 목표, 변경 파일, 검증 결과, 실패/보류 접근, 다음 할 일

코드 구조 그래프는 로컬 생성물인 `graphify-out/obsidian/`에 저장됩니다. Graphify 그래프는 코드 변경 후 hook으로 갱신됩니다.

Codex는 새 세션이 시작될 때 `.codex/hooks.json`의 `SessionStart` hook으로 전체 마스터 단계, 다음 한 작업, 핵심 참고 문서를 불러옵니다. 의미 있는 작업을 시작할 때 질문 키워드에 따라 필요한 하위 문서를 라우팅하고, Graphify로 범위를 좁히고, Ponytail의 최소 변경 원칙으로 구현한 뒤, 검증 결과를 이 vault에 남깁니다.

프로젝트의 캐시와 빌드 데이터는 가능한 한 D 드라이브를 사용합니다. 현재 Obsidian vault, Graphify, Codex 프로젝트 스킬, npm/pip/uv 캐시, Playwright 브라우저, Android SDK/AVD, Gradle 캐시가 D에 있습니다. Obsidian 실행 파일과 JDK, Codex 전역 플러그인 캐시는 정상 작동을 위해 C에 유지합니다.

## 기록 원칙

- 현재 상태와 다음 행동은 짧고 구체적으로 기록합니다.
- 중요한 결정에는 이유와 대안을 함께 남깁니다.
- 실패한 접근도 다시 시도하지 않도록 기록합니다.
- 로드맵 체크박스는 코드·검증·문서가 모두 끝난 항목만 완료 처리합니다.
- 비밀키, 계정 비밀번호, 개인 문서는 기록하지 않습니다.
