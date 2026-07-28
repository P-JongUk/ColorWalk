# 다음 할 일

> ## 2026-07-29 M6 재검토·병합 순서
>
> - [x] 독립 검토 P1 세 건의 수정 커밋 `551b818`과 feature push를 완료했다.
> - [x] 수정된 파일의 읽기 전용 재검토에서 P0/P1 없음·`병합 가능` 판정을 받았다.
> - [x] 최신 검증을 재사용해 `main`에 fast-forward 통합했다.
> - 실제 430×932/360px/200% 확대, Android TalkBack·실기기 QA는 M7 release gate로 유지한다.

> ## 최신 재개 지점 (2026-07-28, M6)
>
> - **기준:** M6 Modern Warm Archive 통합은 `feature/integrated-design-accessibility-performance`(base `main` `102b2de`, 시작 HEAD `944ceed`)에서 CP1(`1b1e132`)~CP4(`b61b8ee`)까지 구현·검증·push 완료했다. CP5(전체 user-flow QA·문서·AI memory·Graphify 정렬)가 진행 중이다.
> - **다음 구현 작업:** CP5 커밋(`docs: M6 검증 결과와 출시 준비 상태 정렬`) 후 push, 이어서 최종 gate(`npm run lint`/`test`/`build`/`verify:supabase`/`cap:sync`/Android debug build/`git diff --check`)를 순서대로 foreground 실행한다.
> - **그 다음:** Hueday finish workflow 스크립트 실행 후 session note를 실제 내용으로 채운다. main 병합은 사용자 검토 뒤 별도 결정이다. M5(`feature/hueprint-color-capsule`)와 M6이 모두 main 병합을 기다리는 상태이므로 병합 순서를 사용자와 먼저 확인한다.
> - **미해결 제약:** Playwright가 프로젝트 의존성에 없어 실제 430×932/360px/200%줌 브라우저 스크린샷 QA를 수행하지 못했다. M7 또는 별도 환경 준비 후 재시도가 필요하다.
> - **유지:** Android capture → force-stop → offline/online retry는 여전히 출시 전 필수 QA다.


> ## M6 진행 인계 (CP1~CP4 완료, CP5 진행 중, 2026-07-28)
>
> - **작업명·목표:** 진행 중 — M6 `feature/integrated-design-accessibility-performance`: DESIGN.md `Modern Warm Archive` 계약을 App shell/Button(CP1), Auth/Today/Camera/Journal(CP2), History/Deck/Hueprint/Capsule/Story/Profile(CP3), 접근성/모션/성능(CP4) 순으로 구현.
> - **기준:** `feature/integrated-design-accessibility-performance`는 `main` `102b2de`에서 분기했고 시작 HEAD는 `944ceed`(CP0 디자인 승인+해외 출시 문서 정렬 커밋)다. main 병합은 아직 진행하지 않았다.
> - **체크포인트:** CP1 `1b1e132`(canonical token, App shell/BottomNav/Button, HuedayDialog), CP2 `4bfa8fe`(Auth/Today/Camera/Journal, LocalePreference 신설), CP3 `755dc01`(History/Deck/Hueprint/Capsule/Story/Profile), CP4 `b61b8ee`(접근성 시맨틱+reduced-motion+44px+성능 baseline), CP5(이 커밋, 문서 정렬).
> - **각 체크포인트 검증(2026-07-28 KST):** lint 0 errors, vitest(CP1 15 files/90 tests → CP2~CP4 16 files/97 tests), production build(dist CSS 128.14kB→122.36kB raw), `git diff --check` 통과. 최종 gate(verify:supabase/cap:sync/Android build)는 CP5 이후 별도 실행한다.
> - **실행 중 발견·수정한 실제 버그(디자인과 무관):** CameraView의 mojibake 저널 버튼 라벨, CalendarView Story 헤더의 `document.querySelector` 오작동(3×3 저장이 대신 실행), JournalView의 중복 저장 버튼. 상세 근거는 `docs/career-problem-solving-log.md` CW-019.
> - **범위 밖으로 남긴 것:** Playwright 실제 브라우저 QA(환경 제약, M7 후속), Android 실기기 인플레이스 QA(M7 gate), main 병합, DB migration, production 배포.


> ## M5 진행 인계 (완료, 2026-07-28)
>
> - **작업명·목표:** 완료 — M5 `feature/hueprint-color-capsule`: canonical `mission_hex`-only 주간 Hueprint, 로컬 표지 preference, 무효 색 legacy 보존, 월간 Color Capsule(1–7장 포함, 8장 완성 구분), `다시 만난 색`, `getHueprintDetailTier()` 단일 tier, 전용 9:16 export 공용 helper(`shareImage.ts`), 성공 기반 export analytics.
> - **통합 기준:** `feature/hueprint-color-capsule`는 `origin/main` `099b07b0c7bf37fe1c0bf4e6ad26dcd728f5362c`를 기반으로 했다. main 병합은 아직 진행하지 않았다.
> - **체크포인트:** checkpoint 1 `b898c30`(주간 Hueprint 데이터 계약, 로컬 표지 선택, nullable canonical HEX, tier helper), checkpoint 2 `999b672`(월간 Color Capsule, 다시 만난 색, CalendarView 3탭 통합), checkpoint 3 `4543e65`(전용 export, `shareImage.ts` 공용화, 성공 기반 analytics, `product_events` 동시 flush race 수정), checkpoint 4(문서·AI memory 정렬, 이 커밋).
> - **마지막 통과 검증(2026-07-28 KST):** lint 0 errors, Vitest 15 files/90 tests, build, `verify:supabase` 전체 ok, `cap:sync`, `git diff --check`, Android debug build(`app-debug.apk` 17,982,899 bytes), 430×932 Playwright QA(현재/과거/혼합 주, partial-only 최고령 주, 표지 변경·재로드 지속, Hueprint/Capsule 1080×1920 PNG 다운로드 실측, Web Share 실패 시 완료 이벤트 미기록 확인).
> - **실행 중 발견·수정한 버그:** (1) `.hueprint-export-card`의 `color-mix()` CSS가 html2canvas에서 파싱 실패 → 고정 배경으로 교체. (2) `flushProductEvents()`가 동시 호출 시 같은 pending row를 중복 upsert해 `product_events_pkey` 충돌 → owner별 in-flight Promise lock 추가.
> - **범위 밖으로 남긴 것:** Android 실기기 인플레이스 QA(M7 gate), DB migration, production 배포, main 병합, Color Rhythm 2/3/5일 목표 설정(M5 후속), 계절/연간 Capsule·PDF·인쇄·2160×3840 이상 export(Studio 후보).


> ## M4 진행 인계 (완료, 2026-07-28)
>
> - **작업명·목표:** 완료 — M4 `feature/everyday-mission-packs`: `indoor-hunt`/`commute-hunt`/`rainy-window` 3개 static pack + 자유 모드, `colorHunt` v2 metadata 계약, metadata-only pack 변경, lazy finalization, pack 컬렉션.
> - **통합 기준:** `feature/everyday-mission-packs`는 `origin/main` `b17b5e9`를 기반으로 했고, `a49caf6`까지 fast-forward로 `main` 및 `origin/main`에 통합됐다.
> - **체크포인트:** checkpoint 1 `5eeaf91`(타입/config/v2 reader/metadata-only update/deep-merge test), checkpoint 2 `b3128c1`(8장·lazy finalization/UI/Deck 컬렉션/analytics/QA), checkpoint 3(문서·AI memory 정렬, 이 커밋).
> - **마지막 통과 검증(2026-07-28 KST):** lint 0 errors, Vitest 13 files/64 tests, build, `verify:supabase` 전체 ok, `cap:sync`, `git diff --check`, Android debug build(`app-debug.apk` 17,960,631 bytes), 430×932 Playwright QA(자유 기본/추천 배지/0장 무확인/1–7장 확인 다이얼로그/8장 읽기전용/collection tile 3개/8·8 카드+Story).
> - **범위 밖으로 남긴 것:** Android 실기기 인플레이스 QA(M7 gate), DB migration, production 배포.

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
- [x] M4 구현: `feature/everyday-mission-packs`에서 `indoor-hunt`/`commute-hunt`/`rainy-window` 3개 static pack + 자유 모드, `colorHunt` v2 metadata 계약, metadata-only 0–7장 pack 선택/변경/해제, 8장 즉시 finalization과 boot/foreground/다음 촬영 lazy finalization, 명시적 pack ID 기반 최대 3개 컬렉션을 구현하기 (checkpoint 1 `5eeaf91`, checkpoint 2 `b3128c1`)
- [x] M4 검증: 전체 lint/test/build/Supabase verification/Capacitor sync/Android debug build/git diff --check와 430×932 Playwright QA(자유 기본, 추천 배지, 0장 무확인, 1–7장 확인 다이얼로그, 8장 읽기전용, collection tile, 8/8 카드+Story)를 통과하기 (2026-07-28 KST)
- [x] M4 문서·AI memory 정렬: blueprint/roadmap/living-hue-deck-spec/growth-strategy/reward-system/storage-strategy/design-reference-index/design-qa-log/plan.md와 이 vault를 실제 diff·검증 결과에 맞춰 갱신하기 (checkpoint 3)
- [x] M4 후속: `feature/everyday-mission-packs`를 `a49caf6`까지 fast-forward로 `main`에 통합. Android 실기기 인플레이스 QA는 M7 출시 gate로 유지
- [x] M5 Hueprint/Color Capsule: 기존 원본 Post/Deck 데이터 위에서 주간 회고와 공유를 연결하고, 완성 강제·연속 출석·랜덤 보상은 넣지 않기 (`feature/hueprint-color-capsule`, checkpoint 1 `b898c30`/checkpoint 2 `999b672`/checkpoint 3 `4543e65`)
- [ ] M5 후속 Color Rhythm 체크포인트: 2/3/5일 목표 설정을 별도 승인 뒤 구현하기 (M5에는 사실값 "이번 주 기록한 날 N일"만 제공, 목표 설정은 보류)
- [ ] M5 통합: `feature/hueprint-color-capsule`를 사용자 검토 뒤 `main`에 병합하기
- [ ] 무료 버전 1 출시 뒤 실제 인플레이스 업데이트에서 기존 로그인·draft/master·기록함·Deck·Hueprint/Capsule·Story 보존 확인
- [ ] M8M 결제 업데이트: 상품·가격·무료/유료 경계 재승인 → Hueday Studio 1회 구매 → 검증된 entitlement → 구매 복원·보류·환불/회수·계정 전환 → 기존 데이터 보존 QA 순서로 진행
- [ ] Hueday Cloud는 실제 master 바이트·storage/egress·복구 수요·해지 후 보존 계약을 측정·승인한 뒤 별도 계획
- [ ] M2: 가입 → 촬영 → 저장의 안정성·E2E·최소 이벤트와 화면 조회·foreground 체류·핵심 CTA·D1/D7/D30 집계 계약, 로컬 고화질 마스터·preview·archive 기반 완성하기
- [ ] M4 우선: Hue Canvas 빈/Palette/자유 작업/도안 크기/완성·export 430x932와 실제 Canvas 2D 성능 스파이크를 검증하고 사용자 승인받기. 빈 탭/Coming Soon 화면 금지
- [ ] M2-3 release QA: password-user populated baseline에서 Android `adb install -r`로 로그인·1/8 draft/master·synced 8/8 history/journal/Story 보존, 정리 happy path와 확인 직후 force-stop 복구를 확인한다. PWA는 같은 localhost origin에서 로그인된 draft/master/history/Story와 offline metadata/cache를 확인한다. 구현·단위 검증·SW controller/cache 교체는 완료했으며 Android capture → force-stop → offline/online retry는 출시 전 필수 QA로 유지
- [ ] M3 최소: M2-3 뒤 집·학교·캠퍼스·통학·카페·비 오는 날·날씨·시간·컬러 산책의 최소 일상 미션 팩 구현하기
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
- [ ] 출시 직후 Supabase 집계 SQL로 funnel·조회·active time·D1/D7/D30·오류를 주 단위 확인하고, 반복 운영 비용이 생길 때만 aggregate-only 관리자 웹 화면 구현하기
- [ ] 초대 베타 규모를 정한 뒤 M9에서 예상 peak의 2배를 검증하고 p95·오류율·기록 손실/중복 결과를 수치로 남기기
- [ ] 첫 대형 성장 기능으로 만료·폐기 가능한 오늘의 색 공유 링크를 `feature/share-color-card`에서 설계하기
- [ ] `20260529200000_add_grid_images.sql`을 라이브 Supabase에 적용할 인증된 admin 경로를 마련하고 fallback 종료 조건 정하기
- [ ] 최초 Play 업로드 전에 `com.colorwalk.app` 영구 사용을 확정하고 업로드 키/Play App Signing, versionCode, 계정 삭제, 개인정보처리방침, Data Safety를 완성하기
- [ ] 실제 iPhone/App Store가 필요해질 때 Apple Developer 가입과 Mac mini/단기 Mac/cloud CI 중 초기 빌드 경로 확정하기

## 2026-07-28 한국어·영어 및 해외 Play 다음 작업

- M6: `시스템 설정` / `한국어` / `English` UI, 하나의 effective locale, hardcoded copy 정렬을 구현한다. 사용자 저널·색 이름 제안·기존 콘텐츠는 자동 번역하지 않는다.
- M7: Play Console 한국어·영어 listing, 정책/지원 페이지, Data Safety·대상 연령·IARC·광고 없음·심사 계정, 언어별 Android/PWA QA를 마감한다.
- 출시 전: 영문 제품 카피를 교정하고 한국어·영어 Store screenshot/feature graphic/release notes를 제작한다.
