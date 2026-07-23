# Hueday 개발 참고 문서 가이드

마지막 갱신: 2026-07-22 KST
목적: Codex가 매 작업에서 필요한 문서만 먼저 읽고, 변경 뒤 맞는 문서만 갱신하도록 하는 라우팅 기준

## 1. 모든 의미 있는 작업에서 먼저 읽기

1. `AGENTS.md` — 저장소 전체 규칙, 보안, Git, D 드라이브, AI 워크플로
2. `docs/hueday-product-blueprint.md` — 전체 제품 합의와 바꾸면 안 되는 핵심 경험
3. `docs/hueday-development-roadmap.md` — 현재 마스터 단계와 다음 한 작업
4. `docs/ai-model-selection-guide.md` — 모델·추론·Plan/Goal/Fast 선택
5. `docs/ai-memory/00-current-state.md` — 현재 구현과 운영 상태
6. `docs/ai-memory/01-decisions.md` — 되돌리면 안 되는 결정
7. `docs/ai-memory/02-next-tasks.md` — 현재 다음 작업과 우선순위
8. 이 문서의 작업 유형별 추가 문서

모든 문서를 매번 전체 탐색하지 않는다. Graphify에서 관련 구조를 질의하고 아래 표의 문서만 추가로 읽는다.

## 2. 작업 유형별 라우팅

| 작업 유형/키워드 | 구현 전 필수 문서 | 완료 시 영향 확인 |
| --- | --- | --- |
| 전체 제품 방향, 기능 우선순위, 출시 범위 | `docs/hueday-product-blueprint.md`, `docs/hueday-development-roadmap.md`, breakout/growth strategy | 마스터 단계·다음 작업, plan, AI memory, 영향받은 하위 명세 |
| Hue Canvas, 발견 색, Palette, 유리 타일, 도안, 작품, 리믹스 | `docs/hue-canvas-product-spec.md`, `docs/discovered-color-content-strategy.md`, `docs/colorwalk-reward-system.md`, 저장 전략, 디자인 인덱스 | 승인 계약, 마스터 M4~M5, 보상 helper, AI memory |
| Hue Room, 색방, 방, 가구, 꾸미기, 재채색 | `docs/hue-room-product-spec.md`, `docs/hue-room-development-roadmap.md`, 발견 색 전략 | 보류·재개 조건 확인. 새 사용자 승인 없이는 구현·시안 제작 금지 |
| 미션, 카메라, 1컷/8컷, 3x3, 색 찾기 | `docs/hueday-breakout-strategy.md`, 발견 색 전략의 결정 상태, `docs/colorwalk-reward-system.md` | 제품 진실, 보상 연결, 계획 |
| 색 리듬, 배지, 보상, 레벨, 해금 | `docs/colorwalk-reward-system.md`, 발견 색 전략, 성장 전략 | reward helper, M4~M5, 무료/유료 경계 |
| 미션 팩, 성장, 리텐션, 친구, Relay, Hueprint | `docs/hueday-breakout-strategy.md`, `docs/product-growth-strategy.md`, 발견 색 전략 | 성장 우선순위, 수익화, 보상, 로드맵 |
| 스토리, 스티커, 템플릿, 공유 | 성장 전략, 보상 문서, `docs/release-readiness.md` | Story/Reward 연결, 실제 공유 QA, 디자인 QA |
| 디자인, CSS, 반응형, 접근성 | `docs/design-reference-index.md`, `.design-references/00-target-mockup/`, `docs/design-qa-log.md`, 관련 제품 명세 | D 자료 상태, 430x932 캡처, 실제 프로토타입, 접근성 결과 |
| 로컬 저장, 사진 품질, 동기화, 기기 이전, 비용 | `docs/data-storage-sync-and-cost-strategy.md`, `docs/security-audit.md`, `docs/release-readiness.md` | 구현/목표 구분, migration, 복구, RLS, 비용 측정 |
| Supabase, Auth, RLS, Storage, migration | `docs/security-audit.md`, `docs/release-readiness.md`, `AGENTS.md`의 Supabase 절 | migration, verify script, 보안 문서, fallback 종료 조건 |
| Android, PWA, 카메라 권한, 알림 | `docs/android-local-environment.md`, `docs/release-readiness.md`, 관련 QA 기록 | 실기기/에뮬레이터 결과와 검증 날짜 |
| 배포, 출시, 스토어, iOS | `docs/release-readiness.md`, `docs/hueday-breakout-strategy.md`, `plan.md` | 실제 배포 상태, 사용자 수동 작업, 보안/스토어 요구사항 |
| 수익화, 결제, 유료 팩 | `docs/product-growth-strategy.md`의 Monetization Model, 보상 문서 | 무료 약속, store billing, 보상 가치, 출시 gate |
| AI 워크플로, Graphify, Obsidian, 도구 저장 | Hueday workflow skill, AI memory README, `AGENTS.md` | 자동화 검증, D 드라이브, 취업 기록 |

## 3. 문서의 역할과 우선순위

문서가 충돌하면 다음 순서로 실제 상태를 확인한다.

1. 실제 코드·DB migration·실행한 검증 결과
2. `AGENTS.md`의 안전·보안·Git 규칙
3. 기능별 source of truth
4. `docs/ai-memory/01-decisions.md`의 지속 결정
5. 로드맵과 `plan.md`
6. 과거 세션 기록

기능별 source of truth:

| 영역 | 기준 문서 |
| --- | --- |
| 전체 제품 합의·출시 핵심 패키지 | `docs/hueday-product-blueprint.md` |
| 전체 기능 의존 순서·현재 진행 상태 | `docs/hueday-development-roadmap.md` |
| 제품 진단·차별화·iOS·시장 근거 | `docs/hueday-breakout-strategy.md` |
| 성장 기능·수익화 | `docs/product-growth-strategy.md` |
| 발견 색 콘텐츠 결정·후보·보류 | `docs/discovered-color-content-strategy.md` |
| Hue Canvas 상세 계약 | `docs/hue-canvas-product-spec.md` |
| 저장·동기화·비용 | `docs/data-storage-sync-and-cost-strategy.md` |
| 디자인 자료 상태·경로·품질 | `docs/design-reference-index.md` |
| 보류된 Hue Room 가설 | `docs/hue-room-product-spec.md`, `docs/hue-room-development-roadmap.md` |
| 색 리듬·배지·아이템 해금 | `docs/colorwalk-reward-system.md` |
| 전체 개발 현황 | `plan.md` |
| 배포·검증 사실 | `docs/release-readiness.md` |
| 보안 | `docs/security-audit.md` |
| 작업별 현재 기억 | `docs/ai-memory/` |
| 취업용 문제해결 사례 | `docs/career-problem-solving-log.md` |

문서가 코드와 다르면 코드를 무조건 정답으로 간주해 조용히 문서를 덮어쓰지 않는다. 의도된 구현인지, 미완성인지, 문서가 오래된 것인지 확인하고 사실·결정·실험을 분리한다.

## 4. 자동 실행 방식

`.codex/hooks.json`의 `SessionStart`가 `ai-workflow.ps1 -Mode session-start`를 실행한다.

세션 시작 출력에는 다음이 포함되어야 한다.

- 현재 에이전트만 사용한다는 규칙
- 항상 읽을 핵심 문서
- 전체 마스터 단계와 다음 한 작업
- 현재 발견 색 대표 콘텐츠 게이트와 다음 한 작업
- Graphify 사용 안내
- D 드라이브 작업 경로

의미 있는 작업 시작 시 다음 명령을 사용한다.

```powershell
.codex/skills/hueday-development-workflow/scripts/ai-workflow.ps1 -Mode start -Question "<집중된 질문>"
```

스크립트는 질문 키워드에 따라 이 문서의 필수 참고 문서를 출력한다. 출력은 문서를 대신하지 않으며 Codex가 해당 문서를 실제로 읽어야 한다.

작업 종료 시 다음 명령을 사용한다.

```powershell
.codex/skills/hueday-development-workflow/scripts/ai-workflow.ps1 -Mode finish `
  -Title "<작업명>" `
  -Scope "<범위와 성공 조건>" `
  -GraphifyFinding "<확인한 노드와 의존 관계>" `
  -Changes "<실제 변경 내용>" `
  -Verification "<검증 명령과 결과>" `
  -Decision "<결정>" `
  -Failure "<실패 또는 보류>" `
  -Next "<다음 한 작업>" `
  -Documentation "<갱신 문서와 영향 없음 이유>" `
  -Career "<문제해결 기록 영향>"
```

종료 스크립트는 변경 파일을 보고 문서 누락 가능성을 경고하고 세션 기록을 만든다. 의미를 이해하지 못한 자동 텍스트 생성으로 기준 문서를 덮어쓰지는 않는다. Codex가 실제 diff와 검증 결과를 바탕으로 문서를 갱신해야 한다.

세션 기록을 만들지 않고 문서 계약만 검사하려면 다음을 실행한다.

```powershell
.codex/skills/hueday-development-workflow/scripts/ai-workflow.ps1 -Mode check
```

## 5. 발견 색 대표 콘텐츠의 특별 계약

- Hue Room을 축소하거나 다른 이름의 방으로 만들지 않는다.
- 코드 전에 `docs/hue-canvas-product-spec.md`의 승인 상태와 `docs/discovered-color-content-strategy.md`의 후보/보류 상태를 확인한다.
- Hue Canvas 제품·재질은 승인됐지만 첫 430x932 시각·조작은 미승인이다. HC-2 승인 전에는 대형 migration, 복잡한 렌더러, 전체 에셋 세트를 만들지 않는다.
- 발견 색은 사진 추출값이 아니라 완성 기록의 미션 색이다.
- 색은 영구 소모하지 않되 한 작품의 배치 가능량은 해당 색 발견 횟수로 제한하고, 모든 작품에서 원본 3x3으로 돌아갈 수 있어야 한다.
- 첫 프로토타입은 샘플 데이터, 기존 helper, SVG/Canvas, 로컬 상태를 우선한다.
- 디자인 변경은 `docs/design-reference-index.md`의 상태 기록과 430x932 캡처 없이 완료 처리하지 않는다. Hue Canvas는 실제 Canvas 2D/SVG 재현을 추가로 요구한다.
- 검증된 로드맵 항목만 `[x]`로 바꾸고 단계가 끝나면 `현재 단계`와 `다음 한 작업`을 갱신한다.

Hue Room 문서는 역사적 가설로만 읽는다. 사용자가 재개를 명시적으로 승인하기 전에는 HR 단계나 로컬 시안을 다음 작업으로 자동 선택하지 않는다.

## 6. 방향 변경 승인 계약

작업 시작 시 관련 항목을 `승인`, `후보`, `보류`, `역사적`, `구현 사실`로 분류한다.

- 후보를 승인으로 바꾸거나 보류 기능을 재개하지 않는다.
- 현재 코드가 다르다는 이유로 승인된 제품 계약을 코드에 맞춰 약화하지 않는다.
- 핵심 루프, Hue Canvas, 디자인 방향, 보상 경제, 무료/유료 경계, 저장 모델, 패키지 ID, 출시 범위를 바꿔야 한다면 현재 결정·충돌 근거·영향·선택지를 먼저 사용자에게 보여 준다.
- 명시적 승인 뒤 기준 문서, 로드맵, AI memory, 관련 코드를 같은 체크포인트에서 정렬한다.
- 승인된 계약을 보존하는 세부 구현 선택과 버그 수정은 Codex가 최소 변경으로 진행하고 검증한다.

## 7. 작업 종료 문서 영향표

| 실제 변경 | 최소 확인 문서 |
| --- | --- |
| 제품 행동·카피 | breakout strategy, product spec, plan, AI memory |
| Hue Canvas·Palette·도안·작품·리믹스 | Hue Canvas spec, found-color strategy, reward system, design index/QA, AI memory |
| 로컬 저장·동기화·사진 품질·기기 이전 | storage strategy, security audit, release readiness, roadmap, AI memory |
| Hue Room 재개 결정 | Hue Room spec/roadmap, found-color strategy, master roadmap, AI memory |
| 보상·미션 팩 | reward system, growth strategy, found-color strategy |
| DB·RLS·Storage | security audit, release readiness, roadmap, verify script |
| 공유·분석 | growth strategy, security, release readiness, metrics |
| 중요한 제약·트레이드오프 해결 | career problem-solving log |

영향 없는 문서를 억지로 고치지 않는다. 대신 세션 기록에 `영향 없음`과 이유를 남긴다.
