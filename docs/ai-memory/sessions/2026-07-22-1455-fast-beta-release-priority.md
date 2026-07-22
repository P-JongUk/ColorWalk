# Session record - 2026-07-22-1455 - fast-beta-release-priority

## Goal

Hueday 계획을 장기 로드맵이 아니라 안전한 외부 베타 출시까지의 최단 실행 경로로 전환한다.

## Scope and success conditions

- Scope: 모델 선택 프롬프트, 제품 실행 순서, MVP 계획과 AI memory의 출시 시간축을 정렬한다.
- Success conditions: 3개월 계획이 제거되고, 출시 차단 요소만 해결한 뒤 즉시 배포한다는 원칙과 필수 품질 게이트가 모든 관련 문서에서 일치한다.

## Graphify findings

- 현재 출시 프롬프트는 `docs/ai-model-selection-guide.md`, 실행 순서는 `docs/hueday-breakout-strategy.md`, 실제 검증 기준은 `docs/release-readiness.md`에 연결되어 있다.
- `plan.md`의 기존 베타 우선순위에는 이미 구현된 스토리 템플릿과 배지가 남아 있어 현재 출시 critical path와 맞지 않았다.

## Decision

Hueday 계획을 3개월 로드맵이 아니라 필수 출시 게이트를 통과하는 즉시 외부 베타를 배포하는 critical path로 전환했다. 지속 목표가 생겼으므로 큰 출시 계획에는 Goal mode를 추천하되, 속도를 이유로 보안·데이터 보호·실기기 QA를 생략하지 않는다.

## Changes

- 출시 계획 프롬프트를 3개월 로드맵에서 의존 관계 중심의 최단 출시 계획으로 교체하고 Goal mode를 켰다.
- `AGENTS.md`와 AI memory에 필수 출시 게이트 통과 즉시 외부 베타를 배포한다는 지속 원칙을 추가했다.
- 전략 문서의 Phase를 달력 일정이 아닌 의존 순서로 명시하고 Phase 1 이후 기능을 출시 조건에서 제외했다.
- `plan.md`와 다음 작업을 MVP 동결 → 규칙 정렬 → 전체 검증 → 실기기 QA → 배포 순서로 갱신했다.

## Changed files at finish

~~~text
 M AGENTS.md
 M docs/ai-memory/00-current-state.md
 M docs/ai-memory/01-decisions.md
 M docs/ai-memory/02-next-tasks.md
 M docs/ai-model-selection-guide.md
 M docs/hueday-breakout-strategy.md
 M plan.md
~~~

## Verification

Graphify로 출시 계획 문서 연결을 확인했다. git diff --check 통과. 3개월/최단 출시 표현과 AGENTS, plan, 전략, AI memory 사이의 정합성을 rg로 점검했다. 코드 변경이 없어 npm 검증은 실행하지 않았다.

## Failed or deferred approaches

임의 출시 날짜를 만들거나 출시 전 성장 기능을 추가하지 않았다. PWA 외부 베타·Android 배포·스토어 출시 중 최종 완료 지점은 사용자 선택이 필요한 후속 항목으로 남겼다.

## Documentation impact

AGENTS.md, docs/ai-model-selection-guide.md, docs/hueday-breakout-strategy.md, plan.md와 AI memory 현재 상태·결정·다음 작업을 최단 출시 기준으로 갱신했다. release-readiness와 security-audit의 검증 사실은 바뀌지 않아 수정하지 않았다.

## Career evidence impact

제품 일정 과잉 확장을 막고 품질 게이트를 유지한 우선순위 결정이지만 아직 구현 문제 해결 결과가 아니므로 career-problem-solving-log는 변경하지 않았다.

## Next tasks

최단 출시 계획에서 정확한 출시 채널을 확정하고, 출시 차단 요소만 분류한 뒤 전체 release-readiness 검증과 실제 휴대폰 핵심 여정 QA를 실행한다.
