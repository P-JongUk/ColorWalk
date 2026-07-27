# 세션 기록 — 2026-07-28 — M5 Hueprint·Color Capsule 구현

## 목표

- 승인된 M5 최종 구현 계획(`Hueday M5 — Hueprint·Color Capsule 최종 구현 계획`) 전체를 네 체크포인트로 구현·검증·문서 정렬한다.
- 기존 Living Hue Deck/Story/analytics 계약을 회귀 없이 재사용해 canonical `mission_hex`-only 주간 Hueprint와 월간 Color Capsule을 완성한다.

## 범위와 성공 조건

- 범위: `src/lib/hueprint.ts`(신규), `src/lib/shareImage.ts`(신규), `src/components/HueprintView.tsx`(신규), `src/lib/livingHueDeck.ts`/`LivingHueDeckView.tsx`(nullable canonical HEX), `src/lib/collection.ts`(tier helper), `src/components/CalendarView.tsx`/`StoryStudio.tsx`/`App.tsx`(통합), `src/index.css`(D — Chromatic Archive 스타일), `src/lib/productEvents.ts`(동시성 버그 수정).
- 성공 조건: 승인 계획의 데이터 계약·UI·export·analytics·QA 섹션을 그대로 구현하고, main/DB/결제/Canvas/Drop을 건드리지 않으며, 네 체크포인트 모두 focused test·전체 검증·430×932 QA를 통과해 커밋·push한다.

## Graphify에서 확인한 구조

- `graphify query "mergeDailyRecords displayPosts getPostGridImages relationship"`로 `dailyRecord.ts`(`mergeDailyRecords`, `draftToDailyPost`)와 `grid.ts`(`getPostGridImages`, `normalizeGridImages`, `sortGridImages`)의 의존 관계를 확인해, Hueprint가 App.tsx의 기존 `displayPosts`(=`mergeDailyRecords()` 출력)를 그대로 입력받도록 설계했다.
- 코드 지도(`generate_codebase_overview`)로 `livingHueDeck.ts`(`canonicalizeMissionHex`), `collection.ts`(`getCompletedGridCount`/`getUnlockedBadges`), `StoryStudio.tsx`(`exportElement`/`shareNativeStory`/`saveOrShare`), `productEvents.ts`(`trackProductEvent`/`flushProductEvents`)의 기존 시그니처와 데이터 흐름을 먼저 읽고 재사용 지점을 정했다.

## 결정

- `01-decisions.md`의 "2026-07-28 — M5 Hueprint·Color Capsule execution contract" 항목에 상세 기록. 핵심: canonical mission_hex-only, nullable `canonicalizeMissionHex()`, `hueday:hueprint-cover:v1:*` preference key, Capsule 종료 판정 3가지, 다시 만난 색 후보 규칙, tier helper와 배지 불변, export helper 공용화, dedupe key 스킴.

## 로드맵 영향

- 시작한 마스터/하위 단계: M5 Hueprint·Color Capsule (`docs/hueday-development-roadmap.md`의 2026-07-28 실행 순서 정정 블록에 이미 명시된 단계).
- 검증 후 완료한 체크박스: `docs/hueday-development-roadmap.md`에 "M5 Hueprint·Color Capsule 완료 조건" 섹션 9개 항목을 신설하고 모두 `[x]`로 기록. `docs/ai-memory/02-next-tasks.md`의 M5 체크리스트 항목을 완료로 변경하고 main 병합·Color Rhythm 후속 항목을 추가.
- 새 현재 단계와 다음 한 작업: M5는 feature 브랜치에서 구현·검증·문서 정렬 완료, main 병합은 사용자 검토 뒤 별도 단계. 다음은 M6 통합 디자인·접근성·성능.

## 변경 내용

- `src/lib/hueprint.ts`(신규): `HueprintDay`/`WeeklyHueprint`/`ColorCapsule`/`ColorMemoryCard` 타입과 `getWeekKey`/`getWeeklyHueprint`/`getWeekNavigation`/`isInvalidOnlyWeek`/`getColorCapsules`/`getMonthNavigation`/`getColorMemoryCard`/`loadHueprintCoverPreference`/`saveHueprintCoverPreference`/`resolveHueprintCover` 순수 함수.
- `src/lib/livingHueDeck.ts`: `canonicalizeMissionHex(): string | null`로 변경(더 이상 throw), `LivingHueDeckCard.canonicalMissionHex: string | null`, `getColorVolumes()`가 null을 건너뛴다.
- `src/components/LivingHueDeckView.tsx`: 무효 색 카드에 `deck-photo-mosaic-neutral` 배경, 표지 그리드는 원본 `post.mission_hex`를 그대로 사용(변경 없음).
- `src/lib/collection.ts`: `getHueprintDetailTier(posts): 0|1|2|3|4` 추가(완료 페이지 0-2/3-6/7-13/14-29/30+ 매핑), 기존 배지 로직 불변.
- `src/components/HueprintView.tsx`(신규): `HueprintWeekView`, `ColorCapsuleArchiveView`, `ColorCapsuleMonthView`, 공용 `ExportPanel`/`ExportCard9x16`.
- `src/components/CalendarView.tsx`: `contentView`에 `hueprint`/`capsule`/`capsule-month` 추가, 3탭 스위치(`history-view-switch-3`), 표지 변경·export 콜백 연결.
- `src/components/StoryStudio.tsx`/`src/lib/shareImage.ts`(신규): export 로직을 `exportElementToPngFile`/`deliverExport`/`shareDialogCopy`/`exportTimestampFilename`로 추출해 StoryStudio와 HueprintView가 공용화. StoryStudio의 관찰 가능한 콜백 타이밍은 그대로 보존.
- `src/App.tsx`: `ownerId`를 CalendarView에 전달, `recordHueprintScreenViewed`/`recordHueprintCtaClicked`/`recordHueprintExported`/`recordHueprintShareOpened`/`recordColorCapsuleExported`/`recordColorCapsuleShareOpened` 추가.
- `src/lib/productEvents.ts`: `flushProductEvents()`에 owner별 in-flight Promise 잠금 추가(발견한 동시성 버그 수정).
- `src/index.css`: `.hueprint-*`/`.capsule-*`/`.color-memory-*`/`.hueprint-tier-0~4`/`.history-view-switch-3`/`.deck-photo-mosaic-neutral` 추가.

## 검증

- 명령: `npm test -- --run src/lib/hueprint.test.ts src/lib/livingHueDeck.test.ts src/lib/collection.test.ts`(체크포인트 1), `npm run lint`, `npm test -- --run`, `npm run build`, `npm run verify:supabase`, `npm run cap:sync`, Android `gradlew.bat :app:assembleDebug`, `git diff --check`, `graphify update .`.
- 결과: 체크포인트 1 focused 39/39 통과. 전체 스위트 15 files/90 tests 통과(체크포인트 2·3 재실행 포함). lint 0 errors. `tsc -b && vite build` 통과. `verify:supabase`의 `ok: true`와 6개 세부 체크 모두 통과(스키마 불변, `grid_images`는 여전히 `client_meta_fallback`). `cap:sync` 성공. Android `assembleDebug` `BUILD SUCCESSFUL`, 최종 APK 17,982,899 bytes(2026-07-27 23:12 로컬 타임스탬프). `git diff --check` 출력 없음(공백 오류 없음). Graphify code-only update: 2117 nodes, 2182 edges, 221 communities.

## 정량 근거

- 기준선: M4 완료 시점(2026-07-28 이전) 테스트 파일 13개/64 tests, Android APK 17,960,631 bytes.
- 변경 후: 테스트 파일 15개(`hueprint.test.ts`, `shareImage.test.ts` 신규)/90 tests, Android debug APK 17,982,899 bytes(+22,268 bytes, M5 UI/로직 추가분).
- 실제 export 파일 크기(430×932 Playwright QA, 2026-07-28 KST, 로컬 dev server+실제 Supabase 계정 `colorwalk_test_01`): Hueprint 주간 export PNG 1080×1920, 584,224 bytes; Color Capsule 월간 export PNG 1080×1920, 982,800 bytes. 두 파일 모두 워터마크 없음(육안 확인, `.design-references/01-current-screens/m5-hueprint-capsule-2026-07-28/`에 화면 캡처 보존, PNG 원본은 검증 후 로컬 삭제).
- Android 실기기(에뮬레이터 아님) export/공유 크기와 성능은 아직 측정하지 않음. 다음 측정: M7 출시 gate에서 실제 Android 기기의 Hueprint/Capsule export 파일 크기와 공유 시트 전달 시간을 기록한다.

## 실패했거나 보류한 접근

- `.hueprint-export-card`에 `.deck-*` 스타일과 동일하게 `color-mix(in srgb, ...)`를 그대로 재사용하려 했으나, html2canvas가 `color` CSS 함수를 파싱하지 못해 모든 export가 예외로 실패했다(콘솔에서 실제로 확인). 고정 배경(`#f2ede1`)으로 대체해 해결했고, 기존 `.deck-*` 스타일은 일반 UI 렌더(html2canvas 대상 아님)라서 영향이 없음을 확인했다.
- 표지 변경 재렌더 트리거로 `setHueprintWeekKey(week.weekKey)`(같은 값 재설정)을 먼저 시도했으나 React가 동일 상태 갱신을 bail-out해 재렌더가 발생하지 않았다. 별도 `hueprintCoverVersion` 카운터 state로 교체해 해결했다.
- `productEvents.test.ts`에 동시성 회귀 테스트를 추가하려 했으나 IndexedDB mock 없이는 의미 있는 테스트를 작성할 수 없어(기존 테스트 스위트도 IndexedDB를 모킹하지 않음) 새 테스트 하네스를 만들지 않고 브라우저 QA로 대체 검증했다. 트리거: 향후 IndexedDB 테스트 인프라가 추가되면 `flushProductEvents()` 동시 호출 회귀 테스트를 추가한다.
- Playwright CLI의 `open --device=...` 조합이 시스템 Chrome 채널을 시도해 데몬 크래시를 반복했다(환경 제약, 앱 결함 아님). 이미 열려 있던 기본 세션(`open http://localhost:5173`)을 재사용하고 `resize 430 932`로 뷰포트를 맞춰 우회했다.

## 문서 영향

- 갱신한 기준 문서: `docs/hueday-development-roadmap.md`(M5 완료 조건 신설, 현재 진행 위치, Color DNA 명칭 정리), `docs/living-hue-deck-product-spec.md`(주간 회고 섹션을 완료 상태로 갱신), `docs/launch-scope-and-update-safety-contract.md`(Color DNA 명칭 정리), `docs/ai-memory/00-current-state.md`/`01-decisions.md`/`02-next-tasks.md`.
- 영향 없음으로 판단한 문서와 이유: `AGENTS.md`(DB·RLS·권한 계약 불변), `docs/security-audit.md`(보안 경계 불변, 새 클라이언트 전용 파생 로직만 추가), `docs/post-launch-monetization-and-payment-safety.md`(결제 계약 미변경, M5는 결제 UI 없음), `docs/product-growth-strategy.md`(승인된 M5 analytics 계약을 그대로 구현했을 뿐 성장·수익화 전략 자체는 변경 없음), `docs/data-storage-sync-and-cost-strategy.md`(새 저장소·스키마 없음, localStorage 표지 preference는 기존 `missionState.ts` 패턴과 동일한 device-local 저장), `docs/design-reference-index.md`/`docs/design-qa-log.md`(이번 세션의 QA 캡처는 `.design-references/01-current-screens/m5-hueprint-capsule-2026-07-28/`에 저장했으나 index/log 문서 자체의 구조 변경은 필요 없음), `plan.md`(하위 레벨 계획 문서 없음, 로드맵이 source of truth), `docs/discovered-color-content-strategy.md`(Hue Canvas 후보 지도, M5와 무관), `docs/release-readiness.md`(feature 브랜치 단계, 별도 출시 게이트에서 재확인).

## 취업 사례 영향

- `docs/career-problem-solving-log.md`에 CW-018(9:16 export의 html2canvas CSS 미지원과 analytics outbox 동시 flush race)을 추가했다. 실제 재현 로그 경로, 수정 전/후 콘솔 상태, PNG 실측 크기를 근거로 남겼다.

## 다음 할 일

- M5 feature 브랜치를 사용자 검토 뒤 `main`에 병합한다.
- M6 통합 디자인·접근성·성능 작업을 시작한다.
- Color Rhythm 2/3/5일 목표 설정(M5 후속)은 별도 승인 전까지 보류한다.
- Android 실기기에서 Hueprint/Capsule export 공유 시트, 표지 변경 지속성, 실제 파일 전달을 M7 출시 gate에서 확인한다.
