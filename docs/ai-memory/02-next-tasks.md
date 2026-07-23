# 다음 할 일

> ## 진행 중 작업 인계
>
> - **작업명·목표:** M2-1 `feature/core-funnel-observability` — 핵심 퍼널의 개인정보 최소 이벤트 계약, IndexedDB 중복 방지 outbox, additive `product_events` 수집, 최소 회귀 E2E를 구현한다.
> - **현재 브랜치 / 기준 main:** `feature/core-funnel-observability` / `f76710a` (`origin/main`과 일치 확인)
> - **현재 HEAD / 마지막 원격 push:** `f76710a` / `f76710a` (`origin/feature/core-funnel-observability` 생성·push 완료)
> - **현재 체크포인트:** CP1 완료 대기 — 이벤트 계약·영속 outbox 기반. 다음 CP2는 Supabase 수집 함수와 additive migration 준비이며 예상 수정은 `src/lib/productEvents.ts`, `src/lib/supabase.ts`, `supabase/migrations/`, `scripts/verify-supabase.mjs`, 관련 테스트다. `grid_images` 전환·backfill·fallback 종료는 범위 밖이다.
> - **완료한 내용:** 깨끗한 작업 트리와 `main == origin/main == f76710a` 확인, feature 원격 브랜치 생성, Graphify 관측 경로 조회, draft DB v2의 `product-events` object store 및 안전 payload 이벤트 계약 구현 완료.
> - **수정 중이거나 dirty인 파일:** `docs/ai-memory/02-next-tasks.md`, `src/lib/draftStorage.ts`, `src/lib/productEvents.ts`, `src/lib/productEvents.test.ts`
> - **마지막 통과 검증:** `npm test -- --run src/lib/productEvents.test.ts` (2 tests), `npm run lint`.
> - **실패한 검증과 이유:** 없음.
> - **다음 한 가지 작업:** CP1의 `git diff --check`를 실행하고 검증된 변경을 한국어 커밋·원격 push한다.
> - **사용자 승인·외부 권한 필요:** additive `product_events` 테이블·인덱스·새 테이블 owner-scoped RLS는 migration diff, 프로젝트 `nhsvmypztjyhqunixxeg`, 현재 스키마, rollback/비활성화 경로, 비밀정보 부재를 확인하고 검증하면 자동 적용할 수 있다. `grid_images` migration/cutover처럼 기존 행을 변경하는 작업은 이 브랜치에서 실행하지 않는다.

현재 순서의 source of truth는 `docs/hueday-development-roadmap.md`입니다. 이 목록은 세션 재개용 요약이며 서로 다른 우선순위를 만들지 않습니다.

- [x] Obsidian을 설치하고 `docs/ai-memory/`를 vault로 열기
- [x] Codex SessionStart와 Graphify hook 설정
- [x] 매 작업용 Hueday Development Workflow 스킬과 종료 스크립트 추가
- [x] Hueday 전체 청사진·마스터 로드맵·자동 참고 체계를 문서와 스크립트에 연결하고 검증하기
- [x] M1 게이트 1: B안 `1장은 오늘의 색 씨앗과 진행 시작, 8장은 미션과 3×3 한 페이지 완성` 승인·문서 정렬
- [x] M1 후속 제품 계약: 현지 날짜마다 새 색, 문맥 재추천 3회, 이후 전체 색 균등 무작위, 첫 사진 확정 잠금, 1–7장 일일 기록, 8장 완성, 자정 마감 승인·문서 정렬
- [x] 디자인 게이트 2: 네 외부 UI 방향 비교 뒤 D — Chromatic Archive를 작업 방향으로 선택
- [x] Hue Room을 첫 출시에서 완전히 보류하고 기존 시안·명세를 출시 후 역사적 가설로 전환
- [x] 발견 색 대표 콘텐츠를 Hue Canvas로 확정하고 큰 가상 격자·발견 횟수 사용량·자유/도안·스테인드글라스 계약 문서화
- [x] 로컬 우선 저장·Hueday Cloud·Hueday Studio·D 드라이브 디자인 자료 관리 계약 문서화
- [x] M1 구현: `feature/color-hunt-contract`에서 현지 날짜별 새 색, 문맥 재추천 3회와 이후 균등 무작위, 첫 사진 확정 잠금, 1–7장 일일 기록, 같은 날 재진입, 자정 마감, 8장 주요 보상, 매칭률 제거 계약을 코드와 카피에 반영하기
- [x] M1 통합: 구현·브라우저 QA·Android 환경 진단 결과를 `c22d7a3`으로 `main`에 병합하고 lint·19개 test·production build·diff 검사를 다시 통과해 원격에 푸시
- [ ] M1 Android 잔여 QA: 안정적인 별도 AVD 또는 실제 기기에서 7/8·8/8 이어서 촬영·완료 배지, foreground 날짜 전환, 저널 저장, Story 네이티브 공유 시트를 확인하기. 2026-07-24 KST에 430×932 브라우저 전체 흐름, 테스트 재시드, Android 실제 카메라 권한·촬영·다시 찍기·확정·1/8 저장·background/foreground 복구·2/8·5/8 순차 촬영, lint·19개 test·build·라이브 Supabase·Capacitor sync·Android debug/release build는 통과했다. 전역 날짜 mock은 Supabase 인증 시간과 충돌해 사용하지 않으며, clean `ColorWalkM1QA` AVD cold boot는 앱 설치 전 System UI·전화·Google Play services ANR을 재현했다. 남은 항목은 통과로 기록하지 않고 실제 Android 기기 출시 전 필수 QA로 유지한다.
- [ ] 출시 전 브랜드 게이트: Hueday와 국내 컬러워크·Daily Hue의 상표/스토어 검색/ASO 혼동 검토. 별도 승인 전 브랜드 변경 금지
- [ ] M2: 가입 → 촬영 → 저장의 안정성·E2E·최소 이벤트, 로컬 고화질 마스터·preview·archive 기반 완성하기
- [ ] M3: 집·학교·캠퍼스·통학·카페·비 오는 날·날씨·시간·컬러 산책 일상 미션 팩 구현하기
- [ ] M4: Hue Canvas 빈/Palette/자유 작업/도안 크기/완성·export 430x932와 실제 Canvas 2D 성능 스파이크를 검증하고 사용자 승인받기
- [ ] M5: Hue Palette 발견 횟수, sparse recipe 저장·복구, 원본 기록, Color Rhythm·실제 창작 보상 완성하기
- [ ] M6: 월간 Hueprint와 최소 Color Capsule 구현하기
- [ ] M7: 만료·폐기 가능한 안전한 Color Relay 구현하기
- [ ] M8~M9: 통합 디자인·접근성·성능·보안·실기기 출시 검증 통과하기
- [ ] `docs/release-readiness.md`의 전체 검증을 현재 출시 후보 커밋에서 다시 실행하기
- [ ] 실제 휴대폰에서 가입 → 촬영 → 저장 → 발견 색 창작 → 공유·Relay·Hueprint 핵심 여정을 확인하고 통과 즉시 출시하기
- [x] 전체 로드맵 문서 작업을 `feature/product-roadmap-system` 브랜치에서 시작
- [ ] 다음 대형 기능을 최신 `main`의 `feature/<기능명>` 브랜치에서 시작
- [ ] 첫 기능 작업 전 `graphify query`로 관련 구조 확인
- [x] 전체 로드맵 체계 작업 완료 후 세션 기록과 검증 결과 저장
- [ ] 각 후속 작업 완료 후 세션 기록을 남기고 검증 결과를 커밋 메시지와 함께 저장
- [ ] 베타 사용자에게 하루 새 색 선택, 재추천 만족도, 1–7장 기록의 부담감, 8컷 완성감을 검증하고 후속 카피·버튼·보상 강도를 조정하기
- [ ] 가입 → 첫 사진 → 저장 → 공유의 최소 이벤트와 기준 시간을 정의하기
- [ ] 첫 대형 성장 기능으로 만료·폐기 가능한 오늘의 색 공유 링크를 `feature/share-color-card`에서 설계하기
- [ ] `20260529200000_add_grid_images.sql`을 라이브 Supabase에 적용할 인증된 admin 경로를 마련하고 fallback 종료 조건 정하기
- [ ] 최초 Play 업로드 전에 `com.colorwalk.app` 영구 사용을 확정하고 업로드 키/Play App Signing, versionCode, 계정 삭제, 개인정보처리방침, Data Safety를 완성하기
- [ ] 실제 iPhone/App Store가 필요해질 때 Apple Developer 가입과 Mac mini/단기 Mac/cloud CI 중 초기 빌드 경로 확정하기
