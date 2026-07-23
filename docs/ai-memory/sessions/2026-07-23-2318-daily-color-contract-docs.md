# Session record - 2026-07-23-2318 - daily-color-contract-docs

## Goal

daily-color-contract-docs

## Scope and success conditions

앱 코드는 변경하지 않고 현지 날짜별 새 컬러 선택, 문맥 재추천 3회, 이후 균등 무작위, 첫 사진 확정 잠금, 1~7장 일일 기록, 8장 완성, 자정 마감의 제품 계약과 학교·비 오는 날 미션 팩 로드맵을 기준 문서에 정렬한다.

## Graphify findings

Graphify 질의에서 mission.ts와 weather.ts의 현재 날씨·시간 미션 경로, collection.ts의 보상 계산, 제품 청사진·보상·성장·로드맵의 Color Hunt 및 미션 팩 노드를 확인했다. 기존 문서는 여러 날 이어 채우기를 전제해 새 결정과 충돌했다.

## Decision

기기 현지 날짜마다 새 색을 시작하고 첫 추천과 3회 변경은 날씨·시간·선택적 대략 위치 문맥을 사용한다. 이후에는 현재 색을 제외한 큐레이션 목록에서 균등 무작위로 고른다. 첫 사진 사용 확정 시 색을 잠그며 1~7장도 정상 일일 기록, 8장만 3x3 완료와 주요 보상이다. 자정에는 현재 장수로 닫고 이월하지 않는다.

## Changes

AGENTS, 제품 청사진, 마스터 로드맵, 성장·시장·보상·저장·디자인 결정, plan, AI memory를 같은 계약으로 갱신했다. 학교·캠퍼스·통학·카페·비 오는 날·날씨·시간 팩을 M3와 성장 전략에 명시했고 CW-010 의사결정 사례를 추가했다.

## Changed files at finish

~~~text
 M AGENTS.md
 M docs/ai-memory/00-current-state.md
 M docs/ai-memory/01-decisions.md
 M docs/ai-memory/02-next-tasks.md
 M docs/career-problem-solving-log.md
 M docs/colorwalk-reward-system.md
 M docs/data-storage-sync-and-cost-strategy.md
 M docs/hueday-breakout-strategy.md
 M docs/hueday-design-direction.md
 M docs/hueday-development-roadmap.md
 M docs/hueday-product-blueprint.md
 M docs/product-growth-strategy.md
 M plan.md
~~~

## Verification

git diff --check 통과. 핵심 13개 문서에서 현지 날짜, 재추천 3회, 균등 무작위, 첫 사진 잠금, 1~7장 기록, 8장 완료, 비 오는 날·학교 팩 문구를 교차 검색했다. 문서 전용 변경이므로 앱 lint/test/build는 실행하지 않았다.

## Failed or deferred approaches

기존 여러 날 이어 채우기 안은 매일 새 색의 기대감을 막고 backlog 죄책감을 만들 수 있어 후속 결정으로 대체했다. 매일 8장 강제안은 바쁜 날 실패감을 키워 채택하지 않았다. 실제 리텐션 효과는 출시 전이라 측정하지 않았고 베타 지표로 검증한다.

## Documentation impact

핵심 제품·성장·보상·저장·디자인·실행 문서와 AGENTS, plan, Obsidian AI memory를 갱신했다. Hue Room 문서는 보류된 역사 자료이므로 재작성하지 않았다. 코드·DB·release/security 문서는 런타임 변경이 없어 영향 없음이다.

## Career evidence impact

중요한 UX·상태 경계 트레이드오프를 CW-010으로 추가했다. 선택지, 제약, 미측정 가설, 구현 후 검증 항목을 구분해 기록했다.

## Next tasks

문서 브랜치를 main에 병합한 뒤 feature/color-hunt-contract를 최신 main에서 만들고 상태 모델·저장·UI·보상·자정 경계와 테스트를 구현한다. 베타에서 색 변경 횟수, 첫 사진 전환, 1~7장 저장, 8장 완료, 다음 날 재방문을 측정한다.
