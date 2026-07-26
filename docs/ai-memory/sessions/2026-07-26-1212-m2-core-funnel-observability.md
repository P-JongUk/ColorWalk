# Session record - 2026-07-26-1212 - m2-core-funnel-observability

## Goal

m2-core-funnel-observability

## Scope and success conditions

M2-1 허용 이벤트 세 개, IndexedDB outbox, additive product_events migration 준비, 430x932 핵심 퍼널 E2E와 카메라 권한 거절 뒤 앨범 복구를 검증했다. grid_images cutover와 다른 M2 브랜치는 제외했다.

## Graphify findings

Graphify query는 App, productEvents, draftStorage, product_events migration, Supabase verify, core funnel E2E가 하나의 관측성 경로로 연결됨을 확인했고 AST update는 1631 nodes, 1629 edges, 179 communities로 완료했다.

## Decision

외부 분석 SDK나 대시보드 없이 Supabase 집계 SQL을 사용하고, screen_viewed/session_summary/primary_cta_clicked 및 네 payload 키만 허용한다. D1/D7/D30은 저장 이벤트 집계다.

## Changes

이벤트 계약과 DB check를 allowlist로 좁히고, Vite preview를 Node 직접 실행과 점유 포트 fail-fast로 안정화했다. 권한 거절 상태에서도 저장된 앨범 사진이 있으면 기존 onComplete로 저널에 진행하게 했다.

## Changed files at finish

~~~text
 M docs/ai-memory/00-current-state.md
 M docs/ai-memory/01-decisions.md
 M docs/ai-memory/02-next-tasks.md
 M docs/career-problem-solving-log.md
 M docs/hueday-development-roadmap.md
 M docs/release-readiness.md
 M docs/security-audit.md
 M scripts/e2e-core-funnel.ps1
 M scripts/verify-supabase.mjs
 M src/App.tsx
 M src/components/CameraView.tsx
 M src/lib/productEvents.test.ts
 M src/lib/productEvents.ts
 M src/lib/weather.ts
 M supabase/migrations/20260724030000_add_product_events.sql
?? scripts/e2e-core-funnel.mjs
~~~

## Verification

npx eslint 대상 파일, productEvents Vitest 2 tests, node --check, 430x932 e2e-core-funnel.ps1 -Port 4206 1회 통과. 최종 npm run lint, npm test -- --run (9 files/21 tests), npm run build, npm run verify:supabase, git diff --check 통과.

## Quantitative evidence

2026-07-26 KST 430x932 production preview E2E 1회가 첫 사진 새로고침 복구, 8장, 앨범 권한 복구, Story download, 저널 저장을 통과했다. 전환율·성능 수치는 아직 측정하지 않음; 출시 후 Supabase allowlist 집계로 측정한다.

## Failed or deferred approaches

SUPABASE_ACCESS_TOKEN 및 service-role 관리자 경로가 없어 product_events live migration은 migration_pending이다. grid_images fallback은 의도적으로 유지했다. 초기 E2E는 점유 포트와 카메라 권한 오류 카드를 드러냈고 최소 수정으로 해결했다.

## Documentation impact

00-current-state, 01-decisions, 02-next-tasks, roadmap, security audit, release readiness, career log를 실제 범위와 검증 결과로 갱신했다. `docs/colorwalk-reward-system.md`는 1장/8장 보상 계약을 바꾸지 않았으므로 영향 없음이다.

## Career evidence impact

CW-012에 앨범 복구 경로 결함, 선택지, 430x932 E2E 1회 근거와 아직 측정하지 않은 전환율을 기록했다.

## Next tasks

검증된 변경을 한글 commit과 origin feature push로 보존한다. 이후 product_events migration은 인증된 관리자 경로가 있을 때 additive 규칙에 따라 적용·검증한다.
