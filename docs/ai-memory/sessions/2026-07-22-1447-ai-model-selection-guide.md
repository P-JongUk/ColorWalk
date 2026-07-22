# Session record - 2026-07-22-1447 - ai-model-selection-guide

## Goal

Hueday 작업마다 비용과 품질을 고려해 모델, 추론 단계, 계획/목표 모드와 프롬프트를 일관되게 추천하는 기준을 만든다.

## Scope and success conditions

- Scope: 사용자 제공 비용-성능 그래프, OpenAI 최신 모델 가이드, 현재 프로젝트 작업 원칙을 하나의 선택 체계로 연결한다.
- Success conditions: 선택표와 승급 규칙, 모드 판단 기준, 현재 큰 방향 계획 추천, 복사 가능한 프롬프트가 문서화되고 `AGENTS.md`와 AI memory에서 자동 참조된다.

## Graphify findings

- AI 작업 규칙은 `AGENTS.md`와 `docs/ai-memory/`에 연결되어 있어 새 선택 가이드를 이 두 진입점에서 참조하는 것이 가장 작은 지속 변경이다.
- 제품 전략 기준 문서는 `docs/hueday-breakout-strategy.md`, 상세 backlog는 `docs/product-growth-strategy.md`이므로 큰 방향 계획 프롬프트의 선행 맥락으로 지정했다.

## Decision

작업 적합성을 우선하고 사용자 제공 비용-성능 그래프를 보조 근거로 쓰는 Luna/Terra/Sol 승급 체계를 채택했다. 계획 모드는 모호하고 재작업 비용이 큰 작업, 목표 모드는 여러 턴에 걸친 명시적 완료 목표에만 사용하며 Ultra는 단일 에이전트 규칙상 제외한다.

## Changes

- `docs/ai-model-selection-guide.md`에 Luna/Terra/Sol, 추론 강도, 계획/목표/Fast/Ultra 판단 기준과 현재 계획용 프롬프트를 추가했다.
- `AGENTS.md`에 의미 있는 작업 전 선택 가이드를 확인하고 유의미한 설정 변경을 안내하는 규칙을 추가했다.
- AI memory의 현재 상태, 지속 결정, vault 안내에 새 기준과 자동 참조 관계를 기록했다.
- 작업 종료 후 Graphify 코드 전용 갱신을 실행하고 현재 그래프 수치를 맞췄다.

## Changed files at finish

~~~text
 M AGENTS.md
 M docs/ai-memory/00-current-state.md
 M docs/ai-memory/01-decisions.md
 M docs/ai-memory/README.md
?? docs/ai-model-selection-guide.md
~~~

## Verification

OpenAI 최신 모델 resolver와 Codex 매뉴얼을 확인했고, 사용자 제공 그래프를 원본 해상도로 검토했다. git diff --check 통과. 문서 링크와 AGENTS/AI memory 연결을 수동 검토했다.

## Failed or deferred approaches

외부 벤치마크의 종합 점수나 API cost를 개별 Hueday 작업의 실제 비용·품질로 직접 환산하지 않았다. 현재 대화 모델을 자동 변경하거나 모든 작업을 Sol로 고정하지 않았다.

## Documentation impact

AGENTS.md, docs/ai-model-selection-guide.md, docs/ai-memory/00-current-state.md, 01-decisions.md, README.md를 갱신했다. 제품·성장·보상 문서에는 제품 방향 변경이 없어 영향 없음.

## Career evidence impact

모델 운영 정책을 정리한 문서 작업으로 제품 오류 해결 사례는 아니므로 docs/career-problem-solving-log.md 영향 없음.

## Next tasks

다음 의미 있는 작업부터 docs/ai-model-selection-guide.md 기준으로 필요한 경우 설정과 작업 전용 프롬프트를 먼저 안내한다.
