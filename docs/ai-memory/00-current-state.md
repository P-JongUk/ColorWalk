# 현재 상태

> **2026-07-29 M6 독립 검토 P1 수정 완료:** `feature/integrated-design-accessibility-performance`의 읽기 전용 병합 검토에서 발견한 mission-color 전체 카탈로그 대비, 원본 정리 dialog focus 복귀, Tailwind token cascade 세 문제를 최소 수정했다. mission HEX와 기존 기록은 바꾸지 않았고, 전체 카탈로그 대비 테스트를 추가했다. lint, Vitest 16 files/98 tests, production build가 통과했다. main 병합 전 수정 diff에 대한 좁은 재검토와 최종 Git 검사가 남아 있다.

> **2026-07-28 M6 Modern Warm Archive 통합 — CP1~CP4 구현·검증·push 완료(main 병합 전):** `feature/integrated-design-accessibility-performance`(base `main` 102b2de, 시작 HEAD `944ceed`)에서 DESIGN.md의 `Modern Warm Archive` 계약을 적용했다. CP1(`1b1e132`) canonical `--hd-*` token layer+App shell/BottomNav/Button 정렬+`HuedayDialog` 네이티브 `<dialog>` helper, CP2(`4bfa8fe`) Auth/Today/Camera/Journal의 mission-frame-artifact(코너폴드+mission color 풀배경)+Editorial Contact Sheet 빈 슬롯+`LocalePreference`(system/ko/en) 3단 계약 신설, CP3(`755dc01`) History/Deck/Hueprint/Capsule/Story/Profile 정렬+월 라벨 로컬라이즈+스티커 키보드 이동+벤더명(Supabase) 노출 제거, CP4(`b61b8ee`) 접근성 시맨틱 수정+reduced-motion 전면 적용+44px 터치타겟+성능 baseline 실측(병목 없음, 별도 성능 커밋 없음)을 각각 좁은 검증 후 push했다. 디자인과 무관한 실제 버그 3건도 발견·수정: CameraView의 mojibake 저널 버튼, CalendarView Story 헤더의 잘못된 `document.querySelector` 클릭(3×3 저장이 대신 실행되던 버그), JournalView의 중복 저장 버튼. 각 체크포인트에서 lint 0 errors, vitest(최종 16 files/97 tests), production build를 통과했다. Playwright가 프로젝트 의존성에 없어(새 패키지 설치 금지) 실제 430×932 브라우저 스크린샷 QA는 CSS 산출물 검사·유닛 테스트·수식 검증으로 대체했다. CP5(문서·AI memory·Graphify 정렬)와 최종 gate(verify:supabase/cap:sync/Android build)가 다음 작업이다. main 병합은 별도 사용자 검토 뒤 진행한다.

> **2026-07-28 M5 Hueprint·Color Capsule — 구현·검증·문서 정렬 완료(main 병합 전):** `feature/hueprint-color-capsule`(체크포인트 1 `b898c30`, 체크포인트 2 `999b672`, 체크포인트 3 `4543e65`)에서 canonical `mission_hex`-only 주간 Hueprint(`src/lib/hueprint.ts`)와 월간 Color Capsule을 기존 `mergeDailyRecords()` 출력 위에서 파생했다. 무효 `mission_hex` 기록은 History/Deck/Story 진입을 유지한 채 Hueprint/Capsule 파생·Color Volume에서만 제외되도록 `canonicalizeMissionHex()`를 nullable로 바꾸고 `LivingHueDeckView`에 neutral archive 상태를 추가했다. 로컬 표지 preference(`hueday:hueprint-cover:v1:<ownerId>:<weekKey>`), `다시 만난 색`(동일 월·일 최근 연도 → 이전 달 ±3일), `getHueprintDetailTier()` 단일 tier class, 전용 9:16 export(`src/lib/shareImage.ts`가 기존 StoryStudio의 html2canvas/download/Web Share/Capacitor Share 패턴을 공용화)를 구현했다. Export 성공 analytics(`hueprint_exported`/`color_capsule_exported`/`*_share_opened`)는 `owner+week/month+artifact+delivery` dedupe key로 성공 완료 뒤에만 기록되고 실패·취소는 기록하지 않음을 430×932 Playwright QA로 실제 확인했다(html2canvas `color-mix()` 미지원 버그와 `flushProductEvents()` 동시 호출 시 `product_events_pkey` 충돌 race를 모두 발견·수정). 전체 lint(0 errors), Vitest 15 files/90 tests, build, live Supabase verification, Capacitor sync, Android debug build(`app-debug.apk` 17,982,899 bytes), `git diff --check`를 통과했다. main 병합은 별도 사용자 검토 뒤 진행한다.

> **2026-07-28 출시 후 결제 업데이트 결정:** 버전 1은 무료로 출시한다. 실제 Android/PWA 인플레이스 업데이트에서 기존 로그인·draft/master·기록함·Deck·Hueprint/Capsule·Story 보존을 확인한 뒤 `M8M`에서 Hueday Studio 1회 구매를 우선 구현한다. 결제는 기존 Post/사진/로컬 저장을 변환하지 않는 additive entitlement 계층으로 분리하고, 구매·복원·보류·환불/회수·계정 전환을 실제 스토어 테스트로 검증한다. Cloud 구독은 저장/전송 비용과 자동 복구 범위가 승인될 때 별도 진행한다. 자동 재개 계약은 `docs/post-launch-monetization-and-payment-safety.md`다.

> **2026-07-28 M4 선택형 일상 미션 팩 — checkpoint 3 문서 정렬 및 main 통합 완료:** `feature/everyday-mission-packs`(checkpoint 1 `5eeaf91`, checkpoint 2 `b3128c1`)에서 `indoor-hunt`/`commute-hunt`/`rainy-window` 3개 static pack과 자유 모드를 구현했다. `posts.client_meta.colorHunt` v2가 `missionPack`을 추가하며 v1/legacy Post는 추론·backfill 없이 그대로 읽힌다. 0장은 `DailyMissionState`, 1–7장은 `updateMissionPackSelection()`의 metadata-only IndexedDB transaction(media-asset/Blob/master/preview/uploadPath 불변)에 저장한다. 8장 확정은 즉시 finalization, 이전 날짜의 열린 기록은 boot/foreground/다음 촬영에서 `findOpenPastRecords()`/`finalizeOpenRecord()`로 lazy finalization한다(자정 타이머·서버 작업 없음). Pack 컬렉션은 `missionPack.finalizedAt` 있는 닫힌 기록만 포함하고 종료 기록 수·8장 완성 수만 표시하며, pack 전용 배지·해금·재화는 추가하지 않았다. 2026-07-28 KST에 전체 lint(0 errors), Vitest 13 files/64 tests, build, live Supabase verification, Capacitor sync, Android debug build(BUILD SUCCESSFUL, 2m16s, app-debug.apk 17,960,631 bytes), `git diff --check`, 430×932 Playwright QA(자유 기본, 추천 배지, 0장 무확인 선택, 1–7장 변경/해제 확인 다이얼로그, 8장 종료 후 읽기전용, collection tile 3개 빈 상태+populated, 8/8 카드+Story 복귀)를 모두 통과했다. `a49caf6`이 fast-forward로 `main`에 통합됐고 `main == origin/main`이다.

> **2026-07-27 M3 Living Hue Deck — main 통합 완료:** `5582e46`은 merged daily records에서 Deck을 파생한다. `getPostGridImages()`는 `grid_images → client_meta.gridImages → image_path`로 1/3/5/8을 정하고, 유효한 여섯 자리 mission HEX는 공유 helper로 canonicalize해 정확한 Color Volume을 만든다. 히스토리 전환은 `기록 / Deck`이며, 완료 local/pending 기록은 `기기 저장` 또는 `동기화 대기`로만 표시한다. 새 table, migration, image format/upload, Canvas, social, collection, Hueprint, AI는 추가하지 않았다. M4가 명시적 mission-pack-ID 컬렉션을, M5가 Hueprint/Capsule을 맡는다. lint, Vitest 12 files/40 tests, build, live Supabase verification, Capacitor sync, Android debug build, 430×932 Deck QA를 통과했다. Android 인플레이스 업데이트 실기기 QA는 출시 gate로 남는다.

> **현재 실행 순서:** M2-3 Android/PWA 인플레이스 QA는 M7 출시 gate로 유지한다. M3/M4는 `main`에 통합 완료됐고, M5 Hueprint·Color Capsule과 M6 통합 디자인·접근성·성능(Modern Warm Archive)은 각각 별도 feature 브랜치에서 구현·검증·문서 정렬까지 완료해 사용자 검토 뒤 main 병합을 기다린다. 다음은 M6 CP5(전체 QA·문서 정렬) → 최종 gate(verify:supabase/cap:sync/Android build) → M7 출시 검증 → 버전 1 출시다. Hue Canvas는 출시 후 필수 초기 업데이트, Hue Drop은 별도 첫 소셜 업데이트다.

## 제품

- 모델 운용: 큰 방향 대화는 Codex Sol medium, 고위험 계획 확정은 Sol high+계획 모드, 승인된 기능 구현은 Kiro Sonnet 5 high, 독립 diff 검토는 Antigravity Gemini 3.1 Pro high, 최종 통합은 Codex Terra medium을 기본으로 한다. 역할 전환마다 Git checkpoint를 만들고 같은 worktree를 동시에 수정하지 않는다.

- 공개 브랜드: Hueday
- 내부 저장소/패키지/Supabase 이름: ColorWalk 유지
- 현재 최우선 목표: 전체 마스터 로드맵을 따라 Color Hunt 규칙, 안정성·측정, 일상 미션 팩, 발견 색 대표 창작 콘텐츠·Color Rhythm 보상, Hueprint/Color Capsule, 안전한 Color Relay를 완성하고 품질·보안·실기기 QA를 통과해 최대한 빠르게 출시
- 핵심 루프: 개인 일일 색 기록 → 편집 없이도 공유하고 싶은 3×3/9:16 카드 → 받은 친구의 나도 이 색 찾기 → 두 결과의 공동 팔레트·엽서·Hueprint → 다음 기록으로 재진입. 개인 기록은 단독으로 완결되고 공유·친구 참여는 무료 성장 행동이다.
- 현재 구현: 아이디/비밀번호 인증, 사용자·현지 날짜별 mission/재추천 상태, 촬영 미리보기 후 `이 사진 사용` 확정, 1~7장 날짜별 IndexedDB 초안·서버 Post 병합, 8장 완성 페이지 배지, Supabase 저장, 짧은 일기, 9:16 스토리/3x3 공유, 달력, 로컬 알림, PWA/Android
- 백엔드 공급자 결정: 출시와 초기 성장에는 검증된 Supabase Auth·Postgres·RLS·Storage를 유지한다. R2는 유료 고화질 백업 비용이 측정된 뒤, Railway는 장시간 서버 작업이 실제로 필요할 때만 보조 도입한다.
- M2-1 구현 완료: 최소 분석 이벤트·IndexedDB outbox·핵심 E2E와 live `product_events` 수집. 2026-07-26 `npm run verify:supabase`에서 ready·owner read·dedupe·anonymous/cross-user denial을 확인했다. 그 밖에 일상 미션 팩 선택, Hue Palette/Canvas·리믹스, 로컬 우선 저장·Cloud 계층, Color Rhythm, 공개 안전 Relay 링크, 월간 Hueprint/Capsule, 실제 창작 옵션 해금, 결제, 네이티브 iOS는 미구현이다.
- 확정된 Color Hunt 의미: 기기 현지 날짜마다 날씨·시간·선택적 대략 위치 기반 색을 새로 추천하고 최대 3회까지 같은 문맥으로 바꾼 뒤 전체 큐레이션 색 균등 무작위를 제공한다. 첫 사진을 확정하면 그날 색이 잠긴다. 1–7장도 유효한 일일 기록이며 8장만 3×3 한 페이지와 주요 보상을 완성한다. 현지 자정에는 현재 장수로 닫고 다음 날 새 색을 선택한다.
- M1 구현 상태: `feature/color-hunt-contract`의 날짜별 Color Hunt 계약·복구·QA 결과를 `c22d7a3`으로 `main`에 통합했다. 2026-07-24 KST lint·19개 unit test·build·라이브 Supabase 검증·Capacitor sync·Android debug/release build와 430×932 브라우저 QA를 통과했고, 병합된 `main`에서도 lint·19개 test·production build·`git diff --check`를 다시 통과했다. 별도 `ColorWalkM1QA` AVD에서는 실제 카메라 촬영·다시 찍기·확정, 1/8 저장·background/foreground 복구와 2/8·5/8 순차 촬영까지 확인했다. 전역 날짜 mock은 Supabase 인증 시간과 충돌해 Android 날짜 QA의 유효한 방법이 아니었고, clean `wipe-data` cold boot에서는 앱 설치 전 System UI·전화·Google Play services ANR이 반복됐다. 따라서 Android 7/8·8/8 완료/배지·foreground 날짜 전환·저널/Story 네이티브 공유는 실제 기기 또는 안정적인 AVD에서 남아 있다. 기존 `ColorWalkPixel7` 데이터는 건드리지 않았다.
- 현재 마스터 단계: M2 안정성·데이터·측정 기반. M2-1 관측성·E2E·live event 수집을 완료했고 다음 저장 안정성 하위 작업을 준비한다.
- 현재 디자인 결정: 외부 앱 UI는 D — Chromatic Archive를 작업 방향으로 유지한다. Hue Room H1/H2/H3 시안은 승인된 출시 화면이 아니며 모든 방·가구·2.5D/3D 작업을 중단했다.
- 현재 다음 작업: main에 병합된 M2-1 다음으로 local master·offline sync의 별도 범위를 승인받는다. `grid_images` migration과 과거 remote migration history 불일치는 별도 DB 전환 gate로 기록만 유지하고, 이번에는 적용·repair하지 않는다. M1 Android 잔여 항목은 실제 기기 또는 안정적인 AVD가 확보되는 즉시 병행 검증하되, 출시 전에는 반드시 닫는다.
- 제품·시장·수익화·iOS 기준 문서: `docs/hueday-breakout-strategy.md`
- 상세 성장 backlog: `docs/product-growth-strategy.md`
- 취업용 문제해결 기록: `docs/career-problem-solving-log.md`
- 작업별 모델·추론·계획/목표 모드 선택 기준: `docs/ai-model-selection-guide.md`
- 전체 제품 합의: `docs/hueday-product-blueprint.md`
- 현재 마스터 단계·다음 한 작업: `docs/hueday-development-roadmap.md`
- 작업 유형별 문서 라우팅: `docs/development-reference-guide.md`
- Hue Canvas 상세 계약: `docs/hue-canvas-product-spec.md`
- 발견 색 후보·보류·확장: `docs/discovered-color-content-strategy.md`
- 저장·동기화·비용: `docs/data-storage-sync-and-cost-strategy.md`
- 디자인 자료 상태·D 경로: `docs/design-reference-index.md`
- Hue Room 역사적 보류 자료: `docs/hue-room-product-spec.md`, `docs/hue-room-development-roadmap.md`

## 2026-07-26 M2-2 local master·offline sync

- `feature/local-master-offline-sync`에서 2560px WebP local master, preview-only Supabase sync, pending/error 복구와 owner+localDate 중복 실행 방지를 구현했고, `e495501`까지 2026-07-26 KST에 `main`으로 fast-forward 통합했다.
- CP4에서 Capacitor sync, 새 debug APK(17,955,823 bytes), 430×932 PWA Home/Camera smoke QA를 확인했다. Android AVD는 처음 60초 내 ADB-ready가 되지 않았고, 이후 기존 다른 서명 앱 때문에 fresh APK 설치가 거부된 뒤 System UI ANR이 나타나 실경로 QA는 미통과로 남긴다.
- 다음 M2 필수 작업은 정상 동기화된 날짜의 로컬 고화질 원본 수동 정리 계약이다. 자동 삭제·Cloud backup·archive/export/delete·`grid_images` migration repair는 이번 범위에 포함하지 않았다.

## 2026-07-26 M2-3 local master 수동 정리·업데이트 안전

- `masterCleanupLifecycle`을 sync와 분리해 `ready`/`cleanup-pending`/`cleaned`로 저장·복원한다. cleaned는 master가 의도적으로 없는 상태이며 staging 또는 sync 재시도 후보로 되돌아가지 않는다.
- CalendarView는 App이 계산한 날짜별 상태와 콜백만 받는다. 최종 서버 Post/preview 검증을 통과한 경우에만 PWA Blob 또는 Android 파일을 정리하고, record·uploadPath·journal·Story metadata·revision·server preview/Post는 보존한다.
- 2026-07-26 전체 lint, 11 Vitest files/31 tests, production build, live Supabase verification, Capacitor sync, Android debug build가 통과했다. PWA `127.0.0.1:5180` baseline→candidate에서 Service Worker cache `v3`→`v4`와 controller 교체를 확인했다.
- Android baseline/candidate debug APK의 package ID와 SHA-256 signing fingerprint는 동일했으나 ADB device가 없어 `adb install -r`와 populated fixture의 login/draft/master/history/Story 보존, force-stop recovery는 미통과 release gate로 남긴다. 실제 beta HTTPS 배포와 Play signing/versioning도 이 작업 범위 밖이다.

## 2026-07-28 M4 선택형 일상 미션 팩

- `feature/everyday-mission-packs`에서 checkpoint 1(`5eeaf91` — 타입/config, v2 호환 reader, metadata-only local/remote update, deep merge 테스트)과 checkpoint 2(`b3128c1` — 8장 finalization, lazy finalization, UI, Deck 컬렉션, analytics, 430×932 QA)를 구현했다.
- `src/lib/missionPacks.ts`: 3개 static pack config, `getRecommendedMissionPackId()`(자동 선택 없는 "오늘 추천" 배지 매핑: rain/storm→rainy-window, morning/sunset→commute-hunt, day/night→indoor-hunt), `parseMissionPackSelection()`/`readMissionPackFromClientMeta()`(v1/legacy는 null, 알 수 없는 id는 자유 모드로 fallback), `mergeColorHuntIntoClientMeta()`(알려진 필드만 덮어쓰고 나머지는 보존), analytics cta/screen 이름 상수.
- `src/lib/dailyRecord.ts`: `findOpenPastRecords()`/`finalizeOpenRecord()`가 lazy finalization의 단일 진입점이다. idempotent하며 이미 닫힌 기록은 그대로 반환한다.
- `src/lib/draftStorage.ts`: `updateMissionPackSelection()`이 daily-record 단일 행만 읽고 쓰는 별도 IndexedDB transaction으로 media-asset store·Blob·master/preview/uploadPath를 전혀 건드리지 않는다. `saveCachedDraft()`(asset도 재파생하는 넓은 쓰기)와 명확히 분리했다.
- `src/App.tsx`: boot 시 `loadCachedDrafts()` 직후, `pageshow`/`visibilitychange` foreground 복귀, 다음 촬영 전 날짜 검사에서 같은 `finalizeOpenPastRecords()` helper를 호출한다. 8번째 사진 확정은 `handleDraftChange()`에서 `finalizeOpenRecord()`를 즉시 적용한다. `handleSelectMissionPack()`은 0장이면 `DailyMissionState`만, 1–7장이면 `updateMissionPackSelection()` 뒤 remote post가 있을 때만 `updatePostColorHuntMetadata()`로 별도 동기화하고 실패는 기존 pending/error 재시도에 남긴다.
- `src/lib/collection.ts`의 `getMissionPackCollections()`는 `missionPack.finalizedAt` 있고 `id`가 유효한 닫힌 기록만 세어 종료 기록 수·8장 완성 수만 반환한다. Pack 전용 배지·해금·재화·별도 reward table은 추가하지 않았다.
- 2026-07-28 KST 검증: lint 0 errors, Vitest 13 files/64 tests(전체) 및 5 files/39 tests(focused: missionPacks/dailyRecord/missionState/collection/livingHueDeck) 통과, `tsc -b && vite build` 성공, `npm run verify:supabase` 전체 `ok:true`(anon signin/write-block, profile upsert, storage upload/signed url, post CRUD, grid metadata, RLS cross-user block, product events 모두 통과, `gridImageStorage`는 기존과 동일하게 `client_meta_fallback`), `npm run cap:sync` 성공, `git diff --check b17b5e9 b3128c1` 공백 오류 없음, Android debug build(JDK21, D-drive Gradle cache, `--no-daemon --max-workers=1`) `BUILD SUCCESSFUL in 2m 16s`(129 tasks)로 `app-debug.apk` 17,960,631 bytes 생성 확인.
- 430×932 Playwright QA(Chrome for Testing v1232, D-drive `.playwright-browsers` cache, `colorwalk_test_01` 계정 로그인): 자유 기본 모드, "오늘 추천" 배지(clouds/night→실내 한 바퀴), 0장 pack 선택/해제 시 확인 다이얼로그 없음. IndexedDB에 3장(비 오는 창가) 및 8장(실내 한 바퀴, closed) draft를 직접 seed해 실제 카메라 없이 UI 경로만 확인: 1–7장 변경/해제 시 각각 정확한 확인 문구("지금까지 모은 N장이 모두 '...' 하루 페이지로 묶여요" / 해제 경고) 노출과 확인 후에만 적용, 8장 종료 후 모든 chip disabled와 "이 기록은 종료됐어요. 팩은 더 바꿀 수 없어요." 문구, Deck 뷰에 `mission-pack-collection-tile` 3개(빈 상태: "홈에서 이 팩을 고르고 하루를 닫으면 카드가 모여요"+카메라 진입점; populated: "종료된 기록 1 · 완성 1"+8/8 카드+스토리 버튼)를 확인했다. 콘솔의 button-in-button nesting 경고는 `GridCollage.tsx`/`DeckCard` 관련 기존 이슈로 M4 diff(`git diff b17b5e9 b3128c1 --stat -- src/components/GridCollage.tsx` 결과 없음) 밖이라 수정하지 않았다. QA 스크립트/스크린샷은 `.tmp/m4-qa.mjs`, `.tmp/m4-qa-2.mjs`, `.tmp/m4-qa/*.png`에 scratch로만 보존(커밋 대상 아님).
- 갱신한 문서: `docs/hueday-product-blueprint.md`(5.2 절에 M4 실제 범위 참고 추가), `docs/hueday-development-roadmap.md`(M4를 완료로 표시, 실제 구현 작업/성공 조건/검증으로 재작성), `docs/living-hue-deck-product-spec.md`(상황 컬렉션 M4 완료 반영), `docs/product-growth-strategy.md`(analytics allowlist에 M4 cta/screen 값 반영), `docs/colorwalk-reward-system.md`(미션 팩 행의 "문맥별 대표 아이템" 오기 수정 — pack 전용 unlock 없음), `docs/data-storage-sync-and-cost-strategy.md`(M4 구현 사실 섹션 추가), `docs/design-reference-index.md`(M4 완료 배너 추가, 새 시각 언어 없음), `docs/design-qa-log.md`(M4 430×932 QA 기록 추가), `plan.md`(status 체크리스트와 최근 정렬 날짜 갱신).
- `AGENTS.md`, Supabase migration, RLS 정책, 보안 검토, breakout positioning, Hue Room 문서는 이번 작업으로 바뀌지 않았다 — 영향 없음(새 DB 스키마·정책 변경·시장 포지셔닝 변화가 없기 때문).

## 저장소

- 통합 브랜치: `main`
- 현재 진행 기능 브랜치: `feature/everyday-mission-packs` — M4 선택형 일상 미션 팩. checkpoint 1 `5eeaf91`, checkpoint 2 `b3128c1`, checkpoint 3(문서 정렬) 진행 중. `origin/feature/everyday-mission-packs`와 동기화 상태에서 이어감. **(2026-07-28 갱신: 이후 M5는 `feature/hueprint-color-capsule`, M6은 `feature/integrated-design-accessibility-performance`에서 각각 진행·완료했다. 이 줄은 M4 시점 기록으로 보존한다.)**
- 최근 `main` 통합 기능: `feature/local-master-offline-sync`(M2-2), `feature/living-hue-deck`(M3, `5582e46`)
- 대형 기능 브랜치 규칙: `feature/<기능명>`
- 커밋 메시지: 한글, 가능하면 `feat:`, `fix:`, `docs:` 등의 접두사 사용
- 현재 그래프: Graphify 0.9.23, 1,569개 노드와 1,563개 연결, 161개 community (2026-07-24 코드 전용 갱신)
- Graphify 실행 환경: `D:\JongUk\Documents\ColorWalk\.graphify-venv`
- Codex CLI 실행 환경: `D:\JongUk\Documents\ColorWalk\.codex-cli`
- Graphify 생성물: `D:\JongUk\Documents\ColorWalk\graphify-out\`
- Obsidian 기록 vault: `D:\JongUk\Documents\ColorWalk\docs\ai-memory\`

## 작업 방식

0. 모든 작업은 현재 Codex 에이전트가 직접 수행하며 하위 에이전트를 생성하거나 위임하지 않습니다.
1. 작업의 모호성·영향·되돌리기 비용·검증 난이도로 모델, 추론, 계획/목표 모드를 고릅니다.
2. Graphify로 관련 구조와 의존 관계를 먼저 확인합니다.
3. 범위와 성공 조건을 정합니다.
4. 가장 작은 변경을 구현합니다.
5. 관련 검증을 실행합니다.
6. 결정, 결과, 실패한 접근, 다음 할 일을 이 vault에 기록합니다.

## 자동화 상태

- 프로젝트 스킬: `.codex/skills/hueday-development-workflow/`
- `AGENTS.md`가 의미 있는 작업 전 `docs/ai-model-selection-guide.md`를 확인하고, 설정 변경이 유의미할 때 사용자에게 추천하도록 규정합니다.
- 새 Codex 세션 시작 시 `.codex/hooks.json`의 `SessionStart` hook이 작업 체크리스트를 출력합니다.
- SessionStart가 전체 마스터 단계·다음 한 작업·핵심 문서를 표시하고, 작업 시작 질문이 있으면 기능별 문서를 자동 라우팅합니다.
- 작업 종료 시 필수 문서 존재와 코드 변경별 문서 누락 가능성을 검사합니다.
- Graphify의 post-commit/post-checkout hook이 코드 구조 그래프를 갱신합니다.
- 작업 종료 스크립트가 `docs/ai-memory/sessions/`에 세션 기록을 만들고 Graphify를 갱신합니다.
- 작업 종료 기록에는 기준 문서 영향과 취업 사례 영향이 포함됩니다. 알려진 코드/문서 모순을 남기지 않고, 변경이 없으면 이유를 기록합니다.
- Ponytail 프로젝트 스킬은 `.codex/skills/ponytail*`에 연결되어 있습니다.
- npm/pip/uv/Playwright 캐시와 Gradle/Android/Vercel 작업 데이터는 D 드라이브 우선 환경 변수로 고정되어 있습니다.
- Playwright 브라우저 캐시는 `C:\Users\JongUk\AppData\Local\ms-playwright`에서 `D:\JongUk\Documents\ColorWalk\.playwright-browsers`로 이동했습니다.
- Obsidian 실행 파일, JDK, Codex 전역 플러그인 캐시는 시스템 통합을 위해 C 드라이브에 유지합니다.

# 2026-07-28 — 한국어·영어 및 해외 Google Play 문서 계약

- 승인 결정은 한국어·영어 UI와 한국 외 Google Play 배포 준비다. M6은 `시스템 설정` / `한국어` / `English`와 하나의 effective locale의 앱 구현·copy 정렬을 맡고, M7은 Play Console 현지화·정책·실기기 언어 QA를 맡는다.
- 이 작업은 문서만 변경했다. production `src/`, CSS, package, Android 설정, DB, env, Play Console과 live 서비스는 변경·검증하지 않았다. 실제 locale 구현, Store listing, 정책 페이지, 해외 배포는 아직 완료로 주장하지 않는다.
- 사용자 저널·색 이름 제안·기존 사용자 콘텐츠는 자동 번역하거나 재작성하지 않는다.
