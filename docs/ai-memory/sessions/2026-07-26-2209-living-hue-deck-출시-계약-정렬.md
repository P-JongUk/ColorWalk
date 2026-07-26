# Session record - 2026-07-26-2209 - Living Hue Deck 출시 계약 정렬

## Goal

Living Hue Deck 출시 계약 정렬

## Scope and success conditions

첫 출시 대표 콘텐츠를 Living Hue Deck으로 고정하고 Hue Canvas를 보류하며 Hue Drop을 출시 후 우선순위 1로 문서화한다. 보상, 저장, 보안, 수익화, 업데이트 안전 문서가 같은 계약을 참조하면 완료다.

## Graphify findings

Graphify 질의에서 기존 Hue Canvas prototype과 hueCanvasStorage, daily draftStorage/local master 경로가 별도 구조로 확인됐다. 따라서 현재 코드와 미래 Deck/Hue Drop을 섞지 않고 문서 계약만 정렬했다.

## Decision

첫 출시는 개인 Color Hunt와 자동 성장 Deck으로 완결한다. Canvas G1은 보존 후 보류하고, 익명 공개 UGC 위험 때문에 친구 기능은 인증 초대형 Hue Drop으로 출시 후에만 검토한다.

## Changes

Living Hue Deck, Hue Drop, 출시 범위·업데이트 안전 source of truth 문서를 추가하고 AGENTS, workflow, 로드맵, 청사진, 보상, 저장, 보안, 출시, 성장, 디자인, AI memory, 경력 기록을 정렬했다.

## Changed files at finish

~~~text
 M .codex/skills/hueday-development-workflow/SKILL.md
 M .codex/skills/hueday-development-workflow/scripts/ai-workflow.ps1
 M AGENTS.md
 M docs/ai-memory/00-current-state.md
 M docs/ai-memory/01-decisions.md
 M docs/ai-memory/02-next-tasks.md
 M docs/career-problem-solving-log.md
 M docs/colorwalk-reward-system.md
 M docs/data-storage-sync-and-cost-strategy.md
 M docs/design-qa-log.md
 M docs/design-reference-index.md
 M docs/development-reference-guide.md
 M docs/discovered-color-content-strategy.md
 M docs/hue-canvas-product-spec.md
 M docs/hueday-breakout-strategy.md
 M docs/hueday-development-roadmap.md
 M docs/hueday-product-blueprint.md
 M docs/product-growth-strategy.md
 M docs/release-readiness.md
 M docs/security-audit.md
 M plan.md
?? docs/hue-drop-post-launch-spec.md
?? docs/launch-scope-and-update-safety-contract.md
?? docs/living-hue-deck-product-spec.md
~~~

## Verification

ai-workflow check 통과, git diff --check 통과, 새 source document 경로와 기존 참조를 점검했다. 코드·DB·배포 변경은 없다.

## Quantitative evidence

코드/DB 수치 변경은 없다. 문서 변경 3개 신규 source of truth와 기존 18개 관련 문서/워크플로 정렬이다. 향후 Deck은 재방문, 원본 재진입, Hueprint 열기, Story export를 측정하고 Hue Drop은 초대 수락, 완성, 신고, 이미지 비용을 측정한다.

## Failed or deferred approaches

graphify update의 --code-only 옵션은 현재 CLI에 없어 실패했고, finish workflow의 기본 update 경로로 갱신했다. Hue Canvas와 공개 Relay를 첫 출시로 유지하는 방안은 사용자 경험·운영 안전 대비 과도해 보류했다.

## Documentation impact

AGENTS, roadmap, blueprint, launch scope, Deck/Hue Drop specs, reward, storage, security, release readiness, growth, design, AI memory, career log, plan, workflow를 갱신했다.

## Career evidence impact

CW-014에 출시 범위·UGC 안전·업데이트 안전 트레이드오프를 근거와 향후 측정으로 기록했다.

## Next tasks

M2-3 local master 수동 정리와 Android/PWA 인플레이스 업데이트 보존 QA를 마친 뒤 Living Hue Deck 디자인·구현을 새 feature 브랜치에서 시작한다.
