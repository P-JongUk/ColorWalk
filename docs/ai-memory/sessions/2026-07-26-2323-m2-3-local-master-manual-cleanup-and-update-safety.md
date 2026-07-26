# Session record - 2026-07-26-2323 - M2-3 local master manual cleanup and update safety

## Goal

M2-3 local master manual cleanup and update safety

## Scope and success conditions

정상 동기화된 날짜의 master만 사용자가 정리한다. 자동·일괄·서버 삭제, DB migration, 미래 기능 기반은 제외한다. cleaned가 staging/sync 대상으로 되돌아가지 않고, 실패·종료 뒤 record와 preview metadata가 보존되는 것이 성공 조건이다.

## Graphify findings

Graphify query로 daily-record/media-asset 저장, promoteDraftMasters, App sync lock, CalendarView, Capacitor Filesystem 경로를 확인했다. 저장/복원과 UI를 App domain 경계로 분리했다.

## Decision

독립 masterCleanupLifecycle과 signed preview 최종 읽기 preflight를 선택했다. PWA는 IndexedDB atomic 저장, Android는 cleanup-pending durable marker와 파일 존재 확인 복구를 사용한다.

## Changes

StoredMediaAsset/GridDraftImage lifecycle 저장·복원·승격 제외, cleanup domain helper, App-owned eligibility/preflight/command, Calendar confirmation UI, signed preview merge, SW cache v4, focused tests를 추가했다.

## Changed files at finish

~~~text
 M docs/ai-memory/00-current-state.md
 M docs/ai-memory/01-decisions.md
 M docs/ai-memory/02-next-tasks.md
 M docs/career-problem-solving-log.md
 M docs/data-storage-sync-and-cost-strategy.md
 M docs/hueday-development-roadmap.md
 M docs/launch-scope-and-update-safety-contract.md
 M docs/release-readiness.md
~~~

## Verification

좁은 3 files/11 tests와 병합 전 lint, 11 Vitest files/31 tests, build, live verify:supabase, cap:sync, Android debug build가 통과했다. localhost 127.0.0.1:5180에서 `registration.update()` 뒤 SW cache v3→v4/controller 교체를 확인했다.

## Quantitative evidence

2026-07-26 Windows local: focused 3 files/11 tests, full 11 files/31 tests, baseline/candidate debug APK signing SHA-256 동일. PWA cache 1개가 v3에서 v4로 교체됐다. populated Android/PWA fixture의 실제 보존 결과는 아직 측정하지 않음; stable AVD 또는 physical device 1대에서 각 path 1회가 다음 측정이다.

## Failed or deferred approaches

ADB devices 목록이 비어 있어 adb install -r와 force-stop recovery를 수행하지 못했다. 자동 브라우저 세션에는 password-user populated fixture가 없어 PWA auth/draft/history/Story 보존은 수동 release gate로 남겼다. 기존 사용자 dev server가 4173/4174를 점유해 QA port 5180을 baseline/candidate에 고정했다.

## Documentation impact

storage strategy, launch/update contract, roadmap, release readiness, ai-memory, career log를 실제 결과와 미통과 release gate로 갱신했다. security-audit 영향 없음: RLS, Storage policy, DB, server deletion, analytics 변경이 없다.

## Career evidence impact

CW-011에 lifecycle/preflight와 실제 test·PWA/Android signing evidence, 미측정 device fixture 다음 측정을 기록했다.

## Next tasks

password-user populated fixture로 Android adb install -r와 cleanup 후 force-stop recovery, 같은 localhost PWA 로그인/draft/master/history/Story/offline metadata 보존을 확인한다. Play signing/versioning과 HTTPS beta deploy는 별도 gate다.
