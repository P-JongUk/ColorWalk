# 지속 결정

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
