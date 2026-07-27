# Hueday 문제해결·의사결정 기록

마지막 검토: 2026-07-28 KST

## CW-011 — local master 보존과 preview 동기화의 데이터 손실 경계

### 문제와 영향

촬영 원본만 즉시 1440px preview로 압축하면 사용자에게 남는 유일한 기억 품질이 낮아질 수 있고, 업로드 실패·강제 종료에서 staging을 너무 이르게 지우면 기록 자체를 잃을 수 있었다. raw/master를 서버에 모두 올리면 beta Storage 비용과 민감한 이미지 노출 범위도 불필요하게 커진다.

### 선택과 구현

- 기존 IndexedDB `drafts` store를 additive하게 재사용해 `daily-record`/`media-asset`을 분리했고, PWA Blob 또는 Android `Directory.Data`의 2560px 이하 WebP master를 검증한 뒤에만 staging 원본을 정리했다.
- Supabase에는 assetId 기반 preview와 기존 Post metadata만 upsert했다. pending/error 기록만 재시도하고 owner+localDate lock 및 preview 경로 재사용으로 중복 sync를 줄였다.
- SQLite, 새 backend, raw/master cloud upload, 자동 master 삭제는 추가하지 않았다. 정상 sync 뒤 수동 정리와 Cloud backup은 별도 승인 작업이다.

### 검증과 결과

- 네 개 bitmap 표본에서 0.86/0.90/0.92를 비교해 0.90을 beta preset으로 선택했다. byte/encode-ms 원시값은 보존되지 않아 아직 측정하지 않음; 다음 실제 Android/브라우저 카메라 네 표본에서 파일 크기(bytes), encode 시간(ms), 전체/100% crop/1080×1920 Story를 기록한다.
- `npm run cap:sync` 통과, 새 Android debug APK 17,955,823 bytes 생성, 430×932 PWA Home/Camera smoke 통과. 기존 lint/Vitest 10 files/25 tests/build/live Supabase verification은 이번 마감에서 재실행하지 않았다.
- `ColorWalkPixel7`은 처음 60초 안에 ADB-ready가 되지 않았고, 이후에는 다른 서명의 기존 패키지 때문에 fresh APK 설치가 거부되었으며 System UI ANR이 나타났다. 앱 ANR로 단정하지 않았으며, clean stable AVD 또는 실기기에서 force-stop 및 offline→online retry를 재검증한다.

### 남은 부채

- Android 실제 capture→force-stop→reopen, offline capture→online sync, owner 교체, Filesystem 공간 부족 안내를 재현 가능한 환경에서 검증한다.
- 수동 local-master 정리 UX에는 preview만 남을 때 복구 불가 경고와 사용자 확인을 포함한다.

### 2026-07-26 M2-3 후속 — 사용자가 지우는 고화질 원본의 복구 경계

- 문제: sync 상태만 보고 master를 정리하면 stale/local-only preview나 앱 종료 중인 Android 파일 삭제에서 사용자의 유일한 원본과 기록 상태를 함께 잃을 수 있다.
- 선택: 별도 `ready`/`cleanup-pending`/`cleaned` lifecycle, 최종 signed-preview read preflight, PWA atomic metadata+Blob 갱신, Android durable marker+파일 존재 복구를 사용했다. 서버 Post/preview, 자동·일괄 삭제, DB migration은 추가하지 않았다.
- 정량 근거: 2026-07-26 Windows local에서 좁은 관련 Vitest 3 files/11 tests와 병합 전 전체 11 files/31 tests를 통과했다. localhost baseline→candidate PWA에서 cache 이름 1개가 `v3`에서 `v4`로 교체되고 controller가 유지됐다. Android debug baseline/candidate certificate SHA-256은 동일했다. 실제 로그인 fixture/ADB in-place/force-stop 결과는 아직 측정하지 않음 — 다음 측정: stable AVD 또는 physical device 1대에서 1/8·8/8 fixture 각 1회와 cleanup/force-stop recovery 각 1회.

이 문서는 Hueday 개발 중 마주친 실제 문제와 판단을 나중에 이력서, 자기소개서, 포트폴리오, 면접에서 근거 있게 설명하기 위한 기록이다. 단순 작업 목록이 아니라 `왜 어려웠고, 무엇을 비교했고, 어떻게 검증했는지`를 남긴다.

## 기록 원칙

- 버그 수정, 성능·보안·배포 문제, 중요한 UX 트레이드오프, 운영 자동화처럼 판단이 있었던 작업을 기록한다.
- “열심히 했다”가 아니라 증상, 제약, 원인, 대안, 결정, 검증, 결과를 적는다.
- 수치가 없으면 만들지 않는다. `아직 측정하지 않음`이라고 쓰고 다음 측정 항목을 남긴다.
- 숫자는 반드시 단위, 측정 날짜, 환경/기기, 실행 명령 또는 근거 파일, 표본 수와 함께 적는다. 전후 비교가 가능한 문제는 baseline과 변경 후 값을 모두 남긴다.
- 테스트 개수·빌드 시간·요청 수·p50/p95·오류율·저장 크기·비용·재현 횟수처럼 문제에 맞는 수치를 우선하고, 단 한 번의 성공을 일반 성능처럼 표현하지 않는다.
- 실패한 접근과 보류 이유를 숨기지 않는다. 면접에서 가장 가치 있는 부분은 선택의 근거다.
- 비밀번호, API 키, 개인 계정, 비공개 사용자 데이터는 절대 적지 않는다.
- 세션 로그는 작업 단위의 원자료이고, 이 문서는 다시 설명할 가치가 있는 사례만 압축한 장기 기록이다.

### 사례별 정량 근거 형식

- 기준선: 변경 전 값, 단위, 날짜, 환경, 표본 수
- 변경 후: 같은 조건의 값과 차이
- 재현/검증: 명령, 로그·캡처·커밋 경로
- 사용자/사업 지표: 실제 데이터가 생긴 뒤에만 기록
- 미측정: `아직 측정하지 않음 — 다음 측정: ...`

## 사례 색인

| ID | 날짜 | 주제 | 보여주는 역량 | 상태 |
| --- | --- | --- | --- | --- |
| CW-001 | 2026-07-22 | C 드라이브 제약 속 D 드라이브 우선 개발 환경 | 개발환경·운영 안정성 | 완료, 지속 관찰 |
| CW-002 | 2026-06-04 | 익명 쓰기를 막으면서 베타 계정 흐름 유지 | 인증·RLS·보안 검증 | 완료 |
| CW-003 | 2026-05~07 | 라이브 DB 마이그레이션 지연에 대한 3x3 저장 호환 | 데이터 호환·점진 배포 | 임시 호환 운영 중 |
| CW-004 | 2026-07-22 | Graphify·Ponytail·Obsidian 기반 AI 개발 기억 체계 | 개발 생산성·문서화 | 완료, 지속 개선 |
| CW-005 | 2026-07-22 | 프로젝트 임시 폴더가 앱 테스트에 섞인 문제 | 테스트 격리·원인 분석 | 완료 |
| CW-006 | 2026-07-22 | 대화형 제품 아이디어를 전체 청사진·단계형 로드맵·자동 문서 라우팅으로 전환 | 제품 설계·개발 프로세스·확장성 | 완료, 실제 개발에서 지속 검증 |
| CW-007 | 2026-07-22 | 구현 편의 중심의 UX 판단을 제품 기준 중심으로 교정 | 제품 판단·UX 트레이드오프·문서 정합성 | 결정 완료, 구현 후속 |
| CW-008 | 2026-07-23 | 대표 보상이 별도 꾸미기 게임으로 팽창하는 범위를 교정 | 제품 범위·재사용 설계·의사결정 | 결정 완료, 프로토타입 후속 |
| CW-009 | 2026-07-23 | 사진 품질·복구·클라우드 비용을 분리한 로컬 우선 구조 | 데이터 아키텍처·비용·복구 | 결정 완료, 구현 후속 |
| CW-010 | 2026-07-23 | 매일 새 색의 기대감과 8컷 부담을 함께 해결한 일일 기록 계약 | 제품 설계·리텐션·상태 경계 | 결정 완료, 구현·검증 후속 |
| CW-011 | 2026-07-24 | 기록 복구의 이미지 서명 요청 폭주를 배치화 | 복구 성능·최소 변경·회귀 검증 | 구현·브라우저 QA 완료, Android 잔여 QA |
| CW-017 | 2026-07-28 | 사진 상태를 건드리지 않는 부분 업데이트와 서버 타이머 없는 마감 | 데이터 아키텍처·동시성 경계·최소 변경 | 구현·전체 검증·430×932 QA 완료, Android 실기기 QA 후속 |
| CW-018 | 2026-07-28 | 9:16 export의 html2canvas CSS 미지원과 analytics outbox 동시 flush race | 실기 브라우저 QA·CSS 렌더링 제약·동시성 버그 진단 | 구현·수정·브라우저 QA 완료 |

## CW-018 — 9:16 export의 html2canvas CSS 미지원과 analytics outbox 동시 flush race

### 문제와 영향

M5 Hueprint/Color Capsule의 9:16 export 카드에 기존 Deck 스타일과 동일하게 `color-mix(in srgb, ...)` CSS를 재사용했더니, html2canvas가 이 CSS 함수를 파싱하지 못해 "Attempting to parse an unsupported color function" 예외를 던지며 모든 Hueprint/Capsule export가 조용히 실패했다(실제 로그인 계정으로 430×932 Playwright QA를 하기 전까지는 코드 리뷰만으로 드러나지 않았다). 동시에, 새 Hueprint/Capsule 탭 탐색이 늘어난 화면 조회 이벤트 빈도 때문에 기존 `flushProductEvents()`가 owner당 동시성 보호 없이 매 `trackProductEvent()` 호출마다 pending outbox를 독립적으로 읽고 Supabase에 upsert하는 구조적 약점이 실제로 드러났다. 같은 pending row가 두 flush에서 동시에 전송되면 `(owner_id, dedupe_key)` unique 제약의 `ignoreDuplicates`가 막아주지 못하는 `product_events_pkey`(id) 충돌이 발생해 해당 analytics 이벤트가 outbox에 영구히 남아 재시도마다 같은 409를 반복할 위험이 있었다.

### 선택과 구현

- html2canvas가 실제로 렌더하는 export 카드(`.hueprint-export-card`, `.hueprint-export-cover`)의 배경만 `color-mix()`에서 고정 색상(`#f2ede1`)으로 교체했다. 화면에만 보이는 `.deck-*` 스타일(html2canvas 대상이 아님)은 그대로 두어 기존 Deck UI에 영향이 없음을 확인했다.
- `productEvents.ts`의 `flushProductEvents()`에 owner별 in-flight `Promise` 잠금(`flushLocksRef` Map)을 추가해, 같은 owner의 동시 flush 호출이 첫 번째 작업을 기다리도록 했다. `draftStorage.ts`의 IndexedDB 레벨 dedupe(`enqueueProductEvent`가 `event.key` 존재 시 add를 skip)는 그대로 두어 이중 방어를 유지했다.
- 두 문제 모두 새 패키지나 새 재시도 아키텍처 없이, 기존 App.tsx의 `syncLocksRef` re-entrancy lock 패턴을 `productEvents.ts` 내부로 그대로 옮겨와 최소 변경으로 해결했다.

### 검증과 결과

- CSS 수정 전: Playwright 콘솔에서 `html2canvas.js` 스택트레이스가 있는 `Error: Attempting to parse an unsupported color function "color"`가 export 클릭마다 재현됐다(2026-07-28 KST, `D:\JongUk\Documents\ColorWalk\.playwright-cli\console-2026-07-27T18-13-06-335Z.log`).
- CSS 수정 후: 같은 export 클릭에서 콘솔 에러 0건, 실제 다운로드된 PNG가 1080×1920, 584,224 bytes(Hueprint)와 1080×1920, 982,800 bytes(Color Capsule)로 확인됐다(같은 세션, `System.Drawing.Image`로 실측).
- productEvents 잠금 추가 뒤 신규 이벤트(`hueprint_exported`, `hueprint_share_opened`, `color_capsule_exported`, `hueprint_cover_changed`)는 모두 Supabase에 201로 성공했다. 잠금 추가 전 발생한 stale outbox row 2건은 여전히 409로 재시도되는 것을 확인했는데, 이는 잠금 추가 이전에 이미 로컬에 캐시된 pending row이므로 예상된 잔존 현상이며 신규 이벤트 경로에는 영향이 없음을 네트워크 로그로 확인했다.
- `npm run lint`(0 errors), `npm test -- --run`(15 files/90 tests) 통과.

### 남은 부채

- `flushProductEvents()` 동시 호출 회귀를 방지하는 자동화 테스트가 없다. IndexedDB를 모킹하는 테스트 하네스가 이 프로젝트에 아직 없어서(기존 `productEvents.test.ts`도 순수 함수만 테스트) 신규 인프라를 추가하지 않고 브라우저 QA로만 검증했다. 다음 트리거: IndexedDB 테스트 인프라가 추가되면 이 회귀 테스트를 추가한다.
- 이번 수정 이전에 이미 생성된 stale 로컬 outbox row(정확한 개수는 세지 않음, 실기기별로 다름)는 자동 정리되지 않는다. 실사용자 기기에서 실제로 누적되는지, 누적된다면 정리가 필요한지는 아직 측정하지 않음 — 다음 측정: 베타 운영 중 Supabase `product_events` 429/409 오류율을 주 단위로 확인한다.

## CW-001 — D 드라이브 우선 개발 환경

### 상황과 문제

LG Gram의 C 드라이브 용량 부족이 npm 캐시, Android SDK/AVD, Gradle, Playwright 브라우저, 임시 빌드 파일 생성을 막을 수 있었다. 단순히 파일 몇 개를 지우는 방식은 다음 설치와 빌드에서 같은 문제가 반복된다.

### 제약

- 프로젝트는 `D:\JongUk\Documents\ColorWalk`에서 정상 작동해야 했다.
- JDK, Obsidian 실행 파일, Codex 전역 플러그인 캐시처럼 Windows 사용자 프로필·시스템 통합을 요구하는 항목은 무리하게 옮기면 안 됐다.
- 팀이나 다음 Codex 세션도 같은 경로 규칙을 알아야 했다.

### 비교한 접근

- C 드라이브를 매번 수동 정리: 빠르지만 재발 방지가 안 된다.
- 모든 사용자 폴더를 강제로 D로 이동: 영향 범위와 복구 위험이 크다.
- 프로젝트별 캐시와 대용량 SDK/AVD만 D로 고정: 위험이 작고 반복 가능하다.

### 결정과 구현

세 번째 방식을 선택했다. npm, pip, uv, Playwright, Gradle, Android SDK/AVD, Vercel 작업 데이터를 D 경로로 두고 프로젝트 hook과 워크플로 스크립트가 관련 환경 변수를 설정하도록 했다. 시스템 통합이 필요한 소규모 전역 항목은 C에 유지했다.

### 검증과 결과

- 프로젝트 `AGENTS.md`와 `docs/ai-memory/`에 경로와 명령을 고정했다.
- Playwright 브라우저 캐시를 D의 프로젝트 경로로 옮겼다.
- Graphify 가상환경과 Codex CLI 패키지도 D 프로젝트 내부에 유지했다.
- 관련 체크포인트: `efabf21 chore: D 드라이브 우선 개발 환경 고정`.

### 배운 점과 다음 측정

용량 문제는 일회성 청소보다 쓰기 경로를 설계하는 운영 문제다. 이후 도구를 설치할 때 설치 파일 크기뿐 아니라 캐시, 임시 디렉터리, 에뮬레이터 이미지 경로까지 확인한다.

## CW-002 — 익명 쓰기 차단과 베타 계정 전환

### 상황과 문제

초기 MVP는 Supabase 익명 세션을 사용했지만, 실제 베타는 사용자 이름·비밀번호 계정으로 기록을 안전하게 복구해야 했다. 익명 로그인을 그대로 허용한 RLS는 소유자 조건이 있더라도 원치 않는 익명 데이터 쓰기를 가능하게 했다.

### 핵심 판단

브라우저에 service role 키를 노출하지 않고, 가입에 필요한 관리 권한은 Supabase `beta-signup` Edge Function에만 둔다. 앱은 합성 이메일을 내부적으로 사용하되 사용자에게는 아이디·비밀번호 흐름을 제공한다. 익명 로그인 기능은 호환성 검증 대상으로 남겨도 익명 사용자의 앱 테이블·스토리지 쓰기는 RLS가 거부하게 한다.

### 검증과 결과

`npm run verify:supabase`가 다음을 함께 검증하도록 유지했다.

- 익명 세션 생성 자체는 가능하지만 앱 데이터 쓰기는 거부됨
- 비밀번호 사용자의 profile upsert와 post CRUD
- 소유자 Storage 업로드·signed URL 읽기
- 다른 사용자의 post 읽기와 signed URL 생성 거부
- 브라우저 코드에 service role 키가 없음

2026-06-04의 전체 검증은 통과했다. 현재 앱 진입은 익명 세션을 거부하고 아이디·비밀번호 인증 화면을 사용한다.

### 배운 점

“로그인 기능이 켜져 있다”와 “권한 모델이 안전하다”는 별개다. 정상 사용자 경로뿐 아니라 익명 사용자와 다른 사용자라는 공격자 관점의 실패 조건을 자동 검증해야 한다.

## CW-003 — 3x3 이미지 스키마의 점진적 호환

### 상황과 문제

초기 `posts`는 대표 `image_path` 한 개를 중심으로 설계됐고, 제품이 최대 8장의 3x3 컬렉션으로 발전하면서 `grid_images` JSON 배열이 필요해졌다. 로컬 마이그레이션 파일은 준비됐지만 라이브 프로젝트에 즉시 적용할 인증된 관리 경로가 항상 보장되지는 않았다.

### 비교한 접근

- 마이그레이션 전까지 기능 배포 중단: 구조는 깨끗하지만 사용자 테스트가 막힌다.
- 기존 테이블에 별도 post row를 여러 개 생성: 날짜당 한 기록 제약과 조회 모델이 깨진다.
- 이미 존재하는 `client_meta` JSON에 임시 저장하고 새 column이 있으면 우선 사용: 호환성이 높고 제거 경로가 명확하다.

### 결정과 구현

저장 시 `grid_images` column을 우선 사용하고 column 부재 오류가 나면 동일 데이터를 `client_meta.gridImages`에 저장한다. 읽기·삭제 helper는 두 구조를 정규화한다. 대표 `image_path`는 기존 코드와 스키마 호환을 위해 첫 이미지로 유지한다.

### 검증과 남은 일

- unit test와 Supabase 검증이 현재 데이터 경로를 보호한다.
- `20260529200000_add_grid_images.sql`을 라이브에 적용한 뒤 기존 fallback 데이터를 옮기고, 충분한 관찰 기간 후 fallback 제거 여부를 결정해야 한다.
- 이 사례는 “임시 호환”에 종료 조건이 없으면 영구 부채가 된다는 점을 문서와 다음 작업에 함께 남긴다.

## CW-004 — AI가 프로젝트를 매번 다시 읽지 않게 만든 구조

### 상황과 문제

긴 프로젝트에서 AI가 매 세션 전체 코드를 다시 탐색하면 토큰과 시간이 들고, 이전 결정이나 실패한 접근을 잊어 같은 시도를 반복할 수 있다. 짧은 프롬프트만으로는 이 문제가 해결되지 않는다.

### 결정

- Graphify: 파일·함수·의존 관계 지도를 먼저 질의해 필요한 코드만 연다.
- 카파시식 4원칙과 Ponytail: 범위와 성공 조건을 정하고 가장 작은 안전한 변경에서 멈춘다.
- Obsidian 호환 `docs/ai-memory/`: 현재 상태, 결정, 실패, 다음 작업을 세션 사이에 보존한다.
- 프로젝트 hook과 finish script: 새 세션 체크리스트, 세션 기록, Graphify 갱신을 반복 가능하게 만든다.

### 결과와 한계

- 프로젝트 범위 스킬과 D 드라이브 저장 위치가 저장소 문서에 고정됐다.
- 관련 체크포인트: `4fb6747 chore: AI 개발 워크플로 자동화`.
- 토큰 절감률은 아직 측정하지 않았으므로 효과를 수치로 주장하지 않는다. 향후 같은 유형 작업에서 읽은 파일 수, Graphify 질의 수, 재작업 횟수, 완료 시간을 비교한다.

## CW-005 — 프로젝트 임시 폴더가 앱 테스트에 섞인 문제

### 상황과 재현

D 드라이브 우선 설치 과정에서 `.tmp/ponytail-source-20260722`에 외부 플러그인 소스와 자체 `*.test.js`가 남아 있었다. `npm test -- --run`을 실행하자 Vitest가 이 파일들까지 Hueday 테스트로 수집해 19개 suite를 실패로 표시했다. 반면 `npx vitest run src`는 Hueday의 6개 파일, 17개 테스트를 모두 통과했다.

### 원인과 결정

외부 테스트가 실패한 것이 Hueday 코드 회귀를 뜻하지는 않았지만, 검증 명령이 환경에 따라 거짓 실패를 내는 상태였다. `.tmp`를 지우는 일회성 처리는 다음 설치 때 재발하므로 Vitest 기본 제외 목록을 유지하면서 `.tmp/**`를 추가했다. 테스트 위치를 `src`로 강제하는 방식보다 향후 저장소 루트의 정당한 테스트를 막지 않는다는 장점이 있다.

### 검증과 결과

- 변경 전: `npm test -- --run`이 `.tmp/ponytail-source-20260722`를 수집해 실패
- 원인 분리: `npx vitest run src`에서 Hueday 6개 파일, 17개 테스트 통과
- 변경: `vite.config.ts`의 Vitest `exclude`에 `.tmp/**` 추가
- 변경 후: 전체 `npm test -- --run`이 Hueday 6개 파일, 17개 테스트만 수집하고 통과

### 면접 한 문장

외부 도구 설치 뒤 발생한 테스트 실패를 앱 회귀와 테스트 탐색 범위 문제로 분리하고, 임시 폴더 삭제가 아닌 runner 설정으로 재발을 막았다.

## CW-006 — 제품 아이디어를 실행 가능한 개발 체계로 전환

> 후속 상태: 이 사례의 Hue Room 출시 우선순위와 렌더 계획은 2026-07-23 `CW-008` 결정으로 보류됐다. 당시의 설계·자동화 판단을 보존하는 역사적 기록이다.

### 상황과 사용자/사업 영향

Hueday의 Color Hunt, 일상 미션 팩, 비처벌형 보상, Hue Room, Hueprint, Color Capsule, Color Relay, 수익화와 출시 방향이 여러 대화와 문서에 나뉘어 있었다. 개별 아이디어의 품질은 높아도 다음 개발 세션이 어떤 문서를 우선하고 어떤 순서로 구현할지 다르면 재작업과 제품 방향 이탈이 생길 수 있었다.

Hue Room에서도 사용자가 발견할 수 있는 모든 색마다 모든 아이템 이미지를 제작하면 `아이템 수 × 색상 수`로 에셋과 저장 비용이 늘어나는 조합 폭발 문제가 있었다.

### 제약과 성공 조건

- 빠르게 출시하되 성공 가능성을 만드는 핵심 기능을 임의로 제거하지 않아야 했다.
- Hue Room은 요소별 시각 품질을 보장하면서도 색상별 에셋을 만들지 않아야 했다.
- Codex는 하위 에이전트 없이 현재 작업에서만 진행해야 했다.
- 새 세션에서 전체 대화를 다시 읽지 않고 현재 단계와 필요한 문서를 알아야 했다.
- 자동화가 의미를 추측해 제품 기준 문서를 잘못 덮어쓰면 안 됐다.

### 비교한 대안

1. 기존 성장 전략 문서 하나에 모든 내용을 계속 추가: 파일은 적지만 제품 합의, 실행 상태, 기능 상세가 섞여 갱신 충돌이 커진다.
2. 기능별 문서만 만들기: 상세성은 좋지만 전체 우선순위와 현재 다음 작업이 다시 분산된다.
3. 최상위 청사진과 마스터 로드맵을 두고, Hue Room 같은 복합 기능만 하위 명세·로드맵으로 연결: 전체 방향과 세부 품질을 동시에 관리할 수 있다.

Hue Room 에셋은 색상별 PNG, 외부 SVG 색상 파일, 동적 인라인 SVG를 비교했다. 기존 React·색 helper·Canvas 흐름을 재사용할 수 있고 조합 폭발이 없는 동적 SVG를 선택했다.

### 결정과 구현

- 전체 제품 합의를 `docs/hueday-product-blueprint.md`에 모았다.
- 실제 현재 단계와 다음 한 작업은 `docs/hueday-development-roadmap.md` 한 곳에서 관리한다.
- Hue Room은 제품·디자인 명세와 하위 로드맵으로 분리하되 마스터 단계에서 진입·종료 조건을 관리한다.
- 작업 유형별 필수 문서와 갱신 대상을 `docs/development-reference-guide.md`에 라우팅했다.
- SessionStart와 시작/종료 스크립트가 전체 단계, 다음 작업, 관련 문서, 누락 가능성을 자동으로 알려 주게 했다.
- 기준 문서는 자동 생성으로 덮어쓰지 않고 Codex가 실제 diff와 검증을 바탕으로 의미를 갱신하게 했다.

### 검증과 결과

- SessionStart가 전체 마스터 단계, 다음 한 작업, Hue Room 하위 단계와 핵심 문서를 출력하는지 확인했다.
- `Hue Room 재채색 구현`과 `Color Relay RLS 설계` 질문이 서로 다른 필수 문서 묶음으로 라우팅되는지 확인했다.
- 문서 계약 검사와 hook JSON 파싱을 통과했고, Git diff 공백 검사를 함께 사용했다.
- 자동화 전후의 재작업 감소나 토큰 절감률은 아직 측정하지 않았다.
- Hue Room 렌더링의 실제 에셋·성능 절감은 5개 SVG 스파이크 전이므로 설계 가설로 남긴다.

### 실패·보류·트레이드오프

- 처음에는 사용자의 요청을 Hue Room 문서화로만 좁게 해석했다. 사용자 교정 뒤 범위를 Hueday 전체 제품 체계로 확장하고, 기존 Hue Room 문서는 하위 명세로 재배치했다.
- Windows PowerShell 5가 BOM 없는 UTF-8 스크립트의 한글 정규식을 잘못 읽어 라우팅 검사에서 예외가 발생했다. 스크립트를 UTF-8 BOM으로 유지하고 오류를 즉시 실패로 처리하도록 설정한 뒤 같은 질문으로 재검증했다.
- 문서를 여러 겹으로 나누면 중복 위험이 생기므로 각 문서의 역할과 충돌 시 우선순위를 reference guide에 고정했다.
- 자동 경고는 누락 가능성을 찾을 수 있지만 제품 의미까지 자동 판정할 수 없으므로 사람/Codex의 diff 검토를 유지한다.

### 다음 단계와 면접 한 문장

- M1부터 실제 기능 개발에서 로드맵 단계 갱신과 문서 라우팅이 방향 이탈을 줄이는지 관찰한다.
- Hue Room 핵심 5개 SVG로 색 조합, Android, 9:16 export를 검증한 뒤 아이템 수를 늘린다.
- 면접 한 문장: 분산된 제품 아이디어를 최상위 청사진·검증 가능한 의존 로드맵·기능별 명세·자동 문서 라우팅으로 구조화하고, 색상별 에셋 조합 폭발은 동적 SVG 설계로 제거했다.

## CW-007 — 구현 편의보다 제품 기준을 우선한 Color Hunt 의미 교정

> 후속 상태: 1장/8장 의미는 유지되지만, 완성 보상의 Hue Room 부분은 2026-07-23 `CW-008`에서 발견 색 창작 재료로 교체됐다.

### 상황과 사용자/사업 영향

M1의 `1장 진행/8장 완성` 의미를 비교할 때 현재 코드가 첫 사진부터 저장·저널 진입·초안 복구를 지원한다는 이유로 A안 `한 장으로 오늘 기록 완료`를 먼저 추천했다. 빠른 첫 결과는 진입 부담을 줄일 수 있지만, 그대로 채택하면 Hueday의 핵심인 중앙 미션 색 주위 8칸 수집과 완성 페이지 보상이 선택 장식으로 약해질 위험이 있었다.

### 근거와 원인

- 제품 청사진은 이미 `1장은 진행 시작, 8장은 한 페이지 완성과 주요 보상`을 기준으로 두고 있었다.
- 성장 전략은 `1컷은 오늘의 색 씨앗, 8컷은 오늘의 한 페이지 완성`으로 설명했다.
- 보상 시스템은 완성된 3×3을 Hue Room·Hueprint·공유 결과의 주요 보상 축으로 사용했다.
- 초기 추천은 이 제품 근거보다 현재 구현 편의와 빠른 첫 결과를 과대평가했다. 구현 가능성을 제품 의미의 근거로 잘못 사용한 것이 원인이었다.

### 비교한 대안

1. A — 첫 사진으로 오늘 기록 완료, 나머지 7장은 선택 확장: 빠른 성취감은 강하지만 3×3 완성과 주요 보상의 의미가 약해진다.
2. B — 첫 사진은 안전한 진행 저장, 8장이 미션과 한 페이지 완성: 중간 이탈 부담을 낮추면서 Hueday 고유 수집 루프와 보상 축을 보존한다.

### 결정과 구현

B안을 확정했다. 첫 사진을 `첫 색 발견`과 `오늘의 색 씨앗`으로 저장하되 완료로 부르지 않고, 8장을 모두 채운 시점에 오늘의 미션·3×3 한 페이지·주요 보상이 완성되도록 제품 문서를 정렬했다. 현재 코드의 저장·복구 기능은 B안의 부담 없는 중간 저장 기반으로 재해석하고, 부분 진행/완성 구분은 M1 후속 구현 항목으로 분리했다.

A안은 실패로 지우지 않고 빠른 첫 결과라는 장점과 채택하지 않은 이유를 디자인 결정 문서에 남겼다.

### 검증과 결과

- 제품 청사진, breakout/growth 전략, 보상 시스템, Hue Room 명세와 로드맵의 용어와 보상 시점을 대조했다.
- 게이트 1의 동일 조건 430×932 저해상도 비교 시안을 근거로 사용자 승인을 받았다.
- 런타임 코드는 이번 디자인 브랜치에서 수정하지 않았다. 코드·카피·데이터 계약 검증은 M1 기능 브랜치에서 수행한다.

### 남은 일과 배운 점

- M1에서 부분 저장·재진입, 완성 상태, 주요 보상 이벤트를 명시적으로 구분한다.
- 게이트 2부터는 제품 청사진·성장 전략·보상 시스템·Hue Room 결정을 현재 코드보다 먼저 대조한다.
- 새 제안이 기존 결정과 충돌하면 임의로 바꾸지 않고 충돌과 선택지를 먼저 제시한다.
- 면접 한 문장: 구현된 경로를 제품 의도로 오인한 UX 판단을 문서·보상 구조·사용자 승인으로 교정하고, 구현 부채를 별도 후속 계약으로 분리했다.

## CW-008 — 대표 보상이 별도 꾸미기 게임으로 팽창하는 범위를 교정

### 상황과 사용자/사업 영향

Hueday의 장기 보상으로 계획한 Hue Room을 더 예쁘게 만들기 위해 H3 구조와 H2 패브릭을 결합하고 가구 레퍼런스를 높이는 과정에서, 결과가 사실적인 2.5D/3D 가구와 꾸미기 게임 수준으로 이동했다. 이 흐름을 계속하면 카메라 기반 색 발견보다 공간·가구·배치 아트 제작이 더 큰 제품이 되고, 첫 출시 속도와 Hueday의 차별점이 동시에 약해질 위험이 있었다.

### 재현과 근거

- 지정 Codex 작업 `019f8974-f4c6-7f12-9fb8-a2a9cd3e7b6e`에서 사실적인 스타일드 가구·인테리어 레퍼런스 탐색과 이미지 제작을 진행했다.
- 현재 코드와 DB에는 Hue Room 구현이 전혀 없지만 제품 청사진, 마스터 M4~M5, 보상, 성장, 디자인 QA, AI memory가 모두 Hue Room을 출시 필수로 전제했다.
- Hue Room은 방 시안, 가구 에셋, 배치 상호작용, 동적 색, 저장/RLS, 공유 렌더까지 별도 제품 수준의 의존성을 만들었다.
- 반면 현재 코드에는 `posts.mission_hex`, 3×3 사진, 월간 collection helper, Story 9:16 내보내기처럼 발견 색을 직접 창작 재료로 바꿀 수 있는 기반이 이미 있었다.

### 제약과 성공 조건

- Hue Room을 어설프게 축소해 출시하거나 이름만 바꾼 방으로 남기지 않는다.
- 발견 색으로 무언가를 소유·누적·변형·공유하고 과거 기록에 재진입하는 가치는 완전히 대체한다.
- 연속 일수, 소멸, 방치 죄책감, 희귀도 경쟁을 도입하지 않는다.
- 사용자 승인 전에는 저장 migration, 대형 렌더러, 전체 화면·에셋 제작을 시작하지 않는다.
- 기존 Hue Room 조사와 시안은 삭제하지 않고 출시 후 가설의 근거로 보존한다.

### 비교한 대안

1. Hue Room의 사실적 품질을 계속 높이기: 꾸미기 욕구는 강하지만 제품 중심과 제작 비용이 공간 게임으로 이동한다.
2. 단순 팔레트나 색 카드 선반으로 축소하기: 구현은 작지만 배지 목록과 다르지 않아 Hue Room이 주려던 조작·성장·공유 가치를 대체하지 못한다.
3. 펫·정원·생명체로 바꾸기: 애착은 강하지만 흔한 육성 구조, 에셋 증가, 방치 죄책감이 다시 생긴다.
4. 발견 색을 비소모성 창작 재료로 쓰는 Hue Studio: 기존 데이터와 내보내기 기반을 재사용하면서 조합·리믹스·원본 기억·공유를 하나의 루프로 연결한다.

### 결정과 구현

- Hue Room을 첫 출시와 현재 critical path에서 완전히 제외하고 HR 로드맵 전체를 `PAUSED`로 바꿨다.
- 제품 청사진과 마스터 M4~M5를 `발견 색 대표 콘텐츠 승인·프로토타입 → 발견 색 창작·Color Rhythm 보상`으로 재설계했다.
- 대체 후보를 별도 전략 문서에 비교하고 `Color Archive → Hue Studio → Hueprint Gallery`를 1순위 가설로 제안했다.
- 완성 3×3의 `mission_hex`를 원본 기록이 붙은 비소모성 Hue Material로 만들고, 2~5색을 Glass/Ink/Loom 규칙으로 조합·리믹스하는 최소 경험을 정의했다.
- 이름, 첫 재질, 첫 조작은 사용자 승인 전 실험으로 남겼다.

### 검증과 결과

- Graphify로 Hue Room 의존 문서와 기존 재사용 코드 경로를 먼저 좁혔다.
- 제품 청사진, 마스터 로드맵, 성장, 보상, 디자인 결정, QA, reference guide, 모델 프롬프트, AI memory를 같은 결정으로 정렬했다.
- Hue Room 명세와 로드맵 상단에 보류·재개 조건을 추가하고 첫 출시 포함 항목을 제거했다.
- 앱 코드와 DB는 변경하지 않았으므로 런타임 회귀는 없고, 실제 재미와 시각 품질은 M4의 사용자 승인·프로토타입 검증으로 남아 있다.

### 실패·보류·트레이드오프

- 사실적인 레퍼런스를 더 찾으면 품질 문제가 해결될 것이라는 접근은 시각 품질은 높여도 제품 범위를 더 키웠다.
- Hue Studio는 현재 가장 강한 가설일 뿐 사용자 승인과 조작 테스트 전에는 확정 기능이 아니다.
- Hue Room은 폐기하지 않았다. 실제 사용자가 꾸미기 공간을 명시적으로 원하고 제작 비용 대비 반복 사용 근거가 생길 때만 출시 후 재검토한다.

### 다음 단계와 면접 한 문장

- 동일한 발견 색으로 Color Archive, 2~5색 선택, Glass/Ink/Loom, 리믹스, 원본 3×3 재진입을 비교하고 대표 콘텐츠를 승인받는다.
- 승인 뒤 샘플 데이터와 결정적 SVG/Canvas로 먼저 재미와 Android/9:16 출력을 검증한다.
- 면접 한 문장: 핵심 보상이 별도 꾸미기 게임으로 팽창하는 신호를 코드·문서 의존성과 제작 비용으로 포착하고, 기존 색·사진·공유 인프라를 재사용하는 창작 루프로 제품 범위를 재설계했다.

## CW-009 — 사진 앱의 품질·복구·클라우드 비용을 분리한 로컬 우선 구조

### 상황과 사용자/사업 영향

현재 앱은 촬영 이미지를 최대 1440px·목표 약 420KB WebP로 압축해 Supabase Storage에 올린다. 작은 베타에는 단순하지만 사용자가 늘면 달력 재열람의 egress와 장기 storage 비용이 계속 생기고, 반대로 압축본만 남기면 사용자의 유일한 기억 품질이 낮아질 위험이 있다. 모든 데이터를 로컬에만 두면 비용은 줄지만 기기 분실·변경 때 기록을 잃는다.

### 재현과 근거

- 현재 이미지 압축 preset과 Supabase 업로드 경로를 코드에서 확인했다.
- 2026-07-23 `npm run verify:supabase`로 Auth, owner CRUD/Storage, signed URL, anonymous/cross-user denial을 실제 검증했다.
- 라이브 `posts.grid_images` migration이 없어 `client_meta.gridImages` fallback이 사용되는 상태를 확인했다.
- 사용자는 달력 고화질 재다운로드 같은 반복 비용은 저가 구독으로 분리하고, 현재 기기 저장과 수동 이전은 무료로 유지하는 방향을 요청했다.

### 제약과 성공 조건

- 사용자의 유일한 고화질 사본을 파괴하지 않는다.
- 오프라인에서도 최근 기록과 Hue Canvas 작업을 연다.
- 기기 변경 무료 경로와 자동 Cloud 복구를 분리한다.
- 사진·일기·정확한 위치를 분석 payload에 넣지 않는다.
- 모든 사진을 매 화면마다 서버에서 다시 받지 않는다.
- 새 저장 구조는 기존 Supabase 기록을 무손실 이관하고 owner RLS를 유지한다.

### 비교한 대안

1. 전부 클라우드: 구현이 단순하고 복구가 쉽지만 storage/egress 비용과 네트워크 의존이 계속 증가한다.
2. 전부 로컬: 비용은 작지만 분실·삭제·기기 변경의 데이터 손실이 크다.
3. 로컬 우선 + 작은 무료 cloud + 선택형 고화질 Cloud: 구현 단계는 늘지만 품질·복구·비용을 각 데이터의 가치에 맞게 분리한다.

### 결정과 구현

- 기기의 고화질 마스터, 무료 작은 메타데이터/preview, 유료 고화질 Cloud, 재생성 가능한 export를 네 계층으로 분리했다.
- 무료 `.hueday` archive 이전과 유료 자동 복구를 함께 둬 기록을 구독에 인질로 잡지 않는다.
- 초기 구현은 새 SQLite 의존성보다 IndexedDB metadata + Capacitor Filesystem을 우선한다.
- Hue Canvas는 칠한 셀만 저장하는 sparse recipe와 디바운스된 로컬 snapshot을 사용하고 매 타일 네트워크 쓰기를 금지한다.
- Hueday Cloud는 월 1,500원·연 9,900원·5GB 가격 가설, Hueday Studio는 서버 반복 비용이 작은 도구의 19,900원 1회 구매 가설로 분리했다.

### 검증과 결과

- 6개 테스트 파일 17개 테스트, lint, production build, Capacitor sync를 통과했다.
- Android API 36 release AAB 생성에 성공했다.
- AAB가 unsigned라는 제출 전 blocker를 `jarsigner -verify`로 확인해 release 문서에 분리했다.
- 이번 체크포인트는 아키텍처 계약 문서화이며 로컬 우선 migration 자체는 구현하지 않았다.

### 실패·보류·트레이드오프

- 모든 사진을 강하게 압축해 클라우드 하나만 source of truth로 만드는 방법은 단순하지만 품질 손실과 비용 모델이 결합된다.
- SQLite는 장기적으로 유용할 수 있으나 현재 데이터 규모 증거 없이 도입하면 웹/PWA 이중 구현과 migration 비용이 커져 보류했다.
- 구체적인 압축 품질, 5GB 공헌이익, 10,000셀 recipe 크기는 실제 샘플 측정 뒤 확정해야 한다.

### 다음 단계와 면접 한 문장

- M2에서 로컬 manifest, offline queue, 목적별 이미지 파생본, archive 복구, migration rollback을 구현·측정한다.
- 면접 한 문장: 사진 다이어리의 고화질 보존·기기 복구·클라우드 원가를 하나의 저장 정책으로 뭉치지 않고 데이터 계층별로 분리해, 무료 소유권과 지속 가능한 유료 백업을 동시에 설계했다.

## CW-010 — 매일 새 색과 비처벌형 3×3을 함께 살린 기록 경계

### 상황과 사용자/사업 영향

기존 결정은 첫 사진을 진행 시작, 8장을 완성으로 구분하면서도 하나의 미완성 미션을 날짜가 지나도 계속 채우게 했다. 이 방식은 데이터 복구에는 단순하지만 다음 날 새 컬러를 만나는 일일 기대감을 막고, 미완성 페이지가 밀린 숙제처럼 느껴질 위험이 있었다. 반대로 매일 8장을 강제하면 촬영 부담과 실패감 때문에 이탈할 수 있었다.

### 근거와 제약

- Hueday의 핵심은 `매일 다른 색으로 일상을 다시 보게 하는 의식`과 중앙색 3×3의 수집 완성감을 함께 유지하는 것이다.
- 출시 전 실제 사용자는 없어 기존 기록이나 해금 상태를 보존하기 위한 과도기 migration은 필요하지 않다.
- 날씨·위치·시간 문맥은 유용하지만 사용자가 마음에 들지 않는 색을 피할 자유와 위치 최소 수집 원칙을 지켜야 한다.
- 결정 단계이므로 리텐션 향상을 실측 결과로 주장하지 않고 베타 검증 가설로 남긴다.

### 비교한 대안

1. 미완성 3×3을 여러 날 이어 채우기: 사진을 잃지 않고 8장 완성률을 높일 수 있지만 새 날짜의 미션을 막고 backlog 죄책감을 만들 수 있다.
2. 매일 8장 필수 후 자정 초기화: 일일 경계는 선명하지만 바쁜 날의 실패감과 기록 포기를 키운다.
3. 매일 새 색 + 1장부터 유효 기록 + 8장 보너스 완성: 일일 새로움, 낮은 진입 부담, 수집 완성감을 동시에 보존하되 기록 상태와 보상 단위를 분리해야 한다.

### 결정과 구현 범위

- 기기 현지 날짜마다 새 색을 추천하고 첫 사진 확정 시 그날 색을 잠근다.
- 첫 추천과 최대 3회 재추천은 날씨·시간·선택적 대략 위치 문맥을 사용하고, 이후에는 현재 색을 제외한 전체 큐레이션 색에서 균등 무작위로 뽑는다.
- 1–7장도 유효한 일일 기록으로 보존하며 8장만 3×3 완료와 주요 보상으로 계산한다.
- 현지 자정에는 현재 장수로 기록을 닫고 다음 날 새 색을 시작한다. 미완성 실패, 보상 소멸, 연속 일수 초기화는 사용하지 않는다.
- 이번 체크포인트는 제품 문서 정렬이며 실제 상태 모델·저장·UI 구현은 M1 `feature/color-hunt-contract`에서 검증한다.

### 검증과 남은 위험

- 코드 구현 전 문서의 제품 계약, 로드맵, 보상, 저장 전략, 디자인 결정, AI 기억을 같은 규칙으로 정렬한다.
- 베타에서 색 변경 횟수, 첫 사진 전환율, 1–7장 저장률, 8장 완료율, 다음 날 재방문을 측정해야 한다.
- 현지 자정 직전 카메라 사용, 시간대 변경, 오프라인 재진입, 중복 일일 기록을 구현 단계에서 테스트해야 한다.

### 면접 한 문장

일일 새로움을 위해 미완성 기록을 버리거나 8컷을 강제하는 양자택일 대신, 1장부터 유효한 일일 기록으로 인정하고 8장만 보너스 완성으로 분리해 리텐션 계기와 비처벌형 UX를 함께 설계했다.

## 새 사례 템플릿

아래 블록을 복사해 사례를 추가한다.

```markdown
## CW-NNN — 제목

### 상황과 사용자/사업 영향

- 언제 어떤 증상이 있었는가?
- 누가 어떤 손해를 보았는가?

### 재현과 근거

- 재현 절차:
- 로그, 테스트, 스크린샷, 관련 파일/커밋:
- 최초 상태의 수치:

### 제약과 성공 조건

- 기술·시간·비용·보안·호환성 제약:
- 성공 조건:

### 원인과 가설

- 확인된 원인:
- 검토했지만 틀린 가설:

### 비교한 대안

1. 대안과 장단점
2. 대안과 장단점

### 결정과 구현

- 선택한 이유:
- 최소 변경 범위:

### 검증과 결과

- 실행한 명령/QA:
- 변경 후 수치:
- 회귀·보안 확인:

### 실패·보류·트레이드오프

- 실패한 시도와 배운 점:
- 의도적으로 남긴 부채와 종료 조건:

### 다음 단계와 면접 한 문장

- 후속 작업:
- STAR 요약 한 문장:
```

## CW-009 — 부분 일일 기록을 잃지 않는 날짜별 Color Hunt 저장 계약

### 문제와 증거

기존 촬영 흐름은 셔터 직후 사진을 확정하고 당일 단일 초안만 저장했으며, 날짜가 지나면 초안을 삭제했다. 따라서 1~7장을 유효한 기록으로 남기고, 업로드/Post 저장 실패 뒤 8장 완성을 복구하며, 같은 날짜의 로컬과 서버 기록을 하나로 보여주는 승인 계약을 만족하지 못했다.

### 선택지와 결정

1. 새 Supabase 테이블·migration으로 초안 상태를 모델링한다.
2. 기존 IndexedDB object store와 `posts(user_id, local_date)` upsert/fallback을 확장한다.

M1은 2를 선택했다. 날짜별 IndexedDB key와 `client_meta.colorHunt`를 추가하고 기존 `grid_images`/`client_meta.gridImages` fallback을 유지했다. 이는 출시 전 사용자 데이터 migration 없이 로컬 우선 복구와 날짜별 단일 기록 병합을 제공하는 최소 구조다.

### 구현과 검증

- 0장 mission/재추천 상태는 사용자 ID+현지 날짜 localStorage에 저장한다.
- 사진은 `이 사진 사용` 확정 뒤 IndexedDB에 먼저 저장하고, 새 사진만 업로드한다. 업로드 경로는 Post 실패 뒤에도 보존한다.
- 로컬 초안은 같은 `local_date`의 서버 Post보다 최신 상태로 병합되며, 8장 로컬 완성도 배지에 즉시 반영된다.
- 2026-07-24 KST에 `npm run lint`, `npm test -- --run`(8 files/19 tests), `npm run build`, `npm run verify:supabase`, `npm run cap:sync`, Android debug/release build를 다시 통과했다. 430×932 브라우저에서 재추천, 촬영 확정, 1장 복구, 2~7장, 8장, 달력 단일 병합, 저널·Story·프로필과 날짜 mock 경계를 확인했다. 별도 AVD에서 실제 카메라 촬영·확정·1/8 저장·강제 종료 복구도 확인했다.

### 남은 부채

- 동기화 재시도 스케줄링과 충돌 관찰은 M2에서 관측 이벤트와 함께 강화한다.
- 안정적인 Android AVD 또는 실기기에서 2~8장, 완료 배지, foreground 날짜 전환, 저널 저장, Story 네이티브 공유를 수행한다. 2026-07-24의 별도 AVD는 System UI ANR로 이 항목을 끝내지 못했으며, 기존 Pixel 7 데이터는 보존했다.

## CW-011 — 기록 복구의 이미지 서명 요청 폭주를 배치화

### 문제와 증거

430×932 브라우저에서 1장 저장 후 새로고침 복구를 실제로 확인하던 중, 기록 목록의 각 `grid_images` 경로마다 개별 Signed URL 요청이 발생했다. QA 계정의 여러 3×3 기록에서는 요청이 누적되고 한 요청이 504가 되어 복구가 약 48초까지 지연됐다. 저장 데이터는 남아 있었지만, 첫 색 발견을 바로 다시 볼 수 있다는 M1 복구 경험을 훼손했다.

### 비교와 결정

1. 화면마다 요청 수를 그대로 두고 timeout만 늘린다.
2. 이미 읽어온 Post의 고유 경로를 모아 Storage의 `createSignedUrls` 한 번으로 서명하고, 기존 읽기 모델에 매핑한다.

2를 선택했다. 새 저장소·캐시·의존성을 만들지 않고 기존 Supabase Storage API와 `normalizeGridImages`를 재사용하므로, fallback Post와 `image_path` 호환을 유지하는 최소 변경이다.

### 검증과 결과

- `fetchPosts`가 중복을 제거한 경로 목록을 한 번에 서명하고 grid/대표 이미지에 동일한 URL 맵을 사용하도록 변경했다.
- 변경 후 1장 씨앗을 새로고침해 복구 화면을 다시 확인했다. `document.fonts.ready` 무한 대기가 아닌 직접 screenshot 방식으로 QA 캡처 대기도 분리했다.
- lint, 19개 unit test, production build, 라이브 Supabase 검증, Capacitor sync, Android debug/release build를 통과했다.

### 남은 일

- 실제 저속 네트워크와 많은 고유 이미지 수에서 복구 시간·실패율을 측정하지 않았으므로 성능 수치로 주장하지 않는다.

## CW-012 — 카메라 권한 거절 뒤 앨범 기록이 저널로 이어지지 않던 복구 경로

### 문제와 증거

2026-07-26 KST, 430×932 Playwright 핵심 퍼널에서 브라우저 카메라 권한이 거절된 뒤 앨범 파일로 8장을 확정하면 IndexedDB 초안은 `8/8`까지 저장됐지만 `CameraView`가 권한 오류 카드만 렌더해 저널 이동 버튼을 숨겼다. 저장된 사진으로 계속 기록할 수 있어야 하는 P1 복구 경로가 막혔다.

### 비교와 결정

1. E2E만 카메라 권한을 흉내 내어 오류 UI를 피한다.
2. 권한 오류 카드에서 이미 저장된 앨범 사진이 하나 이상이면 기존 저널 이동 콜백을 노출한다.

2를 선택했다. 새 상태·패키지·추상화 없이 기존 `canComplete`, `buildDraft`, `onComplete`를 그대로 재사용하므로 카메라 정상 경로와 M1 Color Hunt 계약을 바꾸지 않는다.

### 검증과 결과

- 430×932 production preview에서 앨범 사진 1장 확정 후 새로고침 복구, 8장 완료, 권한 거절 카드의 저널 이동, Story download, 저널 저장을 한 경로로 통과했다.
- 명령: `scripts/e2e-core-funnel.ps1 -Port 4206`; 결과: 1회 통과, 최종 스크린샷 `.design-references/01-current-screens/m2-core-funnel-430x932-2026-07-26.png`.
- lint·전체 test·build·Supabase 검증의 최종 결과는 이 브랜치 완료 체크포인트에서 다시 기록한다. 전환율·성능 개선 수치는 아직 측정하지 않음; 출시 후 allowlist 이벤트 집계에서 recovery 경로의 실패율을 확인한다.

## CW-014 — 초기 개인 앱에서 공개 UGC와 과도한 창작 구조를 출시 범위에서 분리

### 문제와 근거

발견 색 콘텐츠를 Hue Canvas 중심으로 출시하려던 계획은 사용자가 그림을 그려야만 장기 보상을 얻는 구조였다. 동시에 친구 릴레이·익명 참여 아이디어는 성적/유해 이미지가 노출될 수 있는 공개 UGC 위험과 실시간 슬롯 충돌, 이미지 전송 비용을 만들었다. 아직 출시 전이고 운영 인력·자동 모더레이션·실사용 데이터가 없는 상태에서 이 위험을 첫 출시로 가져가는 것은 제품 가설보다 운영 복잡도를 키우는 선택이었다.

### 비교와 결정

1. Canvas와 공개/익명 Relay를 한 번에 출시해 기능 수와 바이럴 가능성을 높인다.
2. 개인 Color Hunt 결과가 자동 성장하는 Living Hue Deck을 대표 콘텐츠로 출시하고, Canvas는 G1 실험으로 보존하며, 친구 기능은 초대 전용 Hue Drop으로 출시 후 검증한다.

2를 선택했다. 사진을 찾는 핵심 행동에 별도 창작 숙제를 얹지 않으면서도 1/3/5/8 카드·Color Volume·주간 Hueprint라는 누적 보상을 만들 수 있다. 공개 UGC를 열지 않아 모더레이션 실패가 초기 브랜드를 훼손할 위험도 줄인다.

### 유지보수·안전 설계

- Deck은 기존 일일 기록에서 파생하고 별도 카드 이미지·미래 친구 테이블·Realtime 뼈대를 미리 만들지 않는다.
- 저장 형식 변경은 copy-forward와 검증 뒤 이전 형식을 제거하고, Android/PWA 인플레이스 업데이트 보존 QA를 출시 게이트로 둔다.
- Hue Drop 도입 시에만 인증 멤버·원자 슬롯 예약·EXIF 제거·초대 취소·차단/신고·멤버 전용 preview를 구현한다.

### 검증과 남은 측정

- 이 사례는 출시 전 제품·아키텍처 결정이며 사용자 지표를 아직 주장하지 않는다.
- 출시 후에는 Deck 재방문, 원본 3×3 재진입, Hueprint 열기, Story 내보내기와 Hue Drop 베타의 초대 수락/완성/신고/이미지 비용을 기록해 가설을 재평가한다.

### 2026-07-26 후속 결정 — Canvas를 안전한 초기 업데이트로 재배치

사용자는 Hue Canvas를 포기하거나 사용 근거가 생길 때까지 무기한 보류하는 대신, 버전 1 출시 후 가능한 한 빠르게 반드시 제공하기로 확정했다. 기능을 앞당기는 대신 기존 사용자의 기록을 위험에 노출하지 않도록 다음 경계를 추가했다.

- 영구 package ID·동일 signing 계보의 인플레이스 업데이트
- 기존 Post/draft/local master/Deck/Story를 migration하지 않고 Palette source로만 읽기
- prototype 브랜치 전체 병합 금지와 production 코드 선별 이식
- versioned recipe, copy-forward, 실패 시 원본 보존, 기능 gate 롤백 시 recipe 보존
- cloud recipe가 필요할 때만 additive schema와 owner RLS 추가

출시 후 첫 Canvas 후보 버전에서 Android/PWA 이전 버전 데이터 fixture의 보존 수와 migration 성공/실패 결과를 수치로 기록한다.

## CW-015 — 업데이트 보존 QA에서 앱 결함과 Android 환경 결함을 분리

### 문제와 증거

2026-07-26 KST M2-3에서 실제 데이터가 있는 baseline Android APK를 candidate APK로 `adb install -r` 업데이트해 보존을 검증해야 했다. D-drive `ColorWalkM1QA`는 Android 16까지 안정적으로 부팅하고 baseline APK 설치를 수락했지만, D SDK Gradle은 Build-Tools 35 자동 provisioning 단계에서 진행하지 않았다. legacy SDK로 빌드한 baseline을 설치한 뒤 앨범 import 중에는 System UI/ADB가 끊겼다. 기존 `ColorWalkPixel7`은 앱 데이터를 지우지 않은 상태에서 정확히 `adb install -r`를 실행했고, `INSTALL_FAILED_UPDATE_INCOMPATIBLE`로 실패했다. 이미 설치된 `com.colorwalk.app`의 서명이 debug APK와 달랐기 때문이다.

### 비교와 결정

1. 문제를 앱 보존 결함으로 처리하거나, AVD를 wipe/uninstall해 새 설치만 확인한다.
2. package ID·version·certificate fingerprint를 독립 확인하고, 데이터 파괴 없이 실패 지점을 기록한 뒤 실제 기기의 동일 signing-lineage 업데이트를 남은 출시 gate로 둔다.

2를 선택했다. baseline/candidate 모두 `com.colorwalk.app`, versionCode 1/versionName 1.0, SHA-256 `4d270595c837ca18f577412ca664c7327ffe263bfc132f909899d90f0ba7e7a8`임을 확인했고, AVD의 기존 서명 충돌·SDK provisioning·System UI disconnect는 M2-3 cleanup 로직보다 앞선 환경 조건이었다. 사용자의 기존 앱 데이터는 uninstall·clear-data·wipe로 바꾸지 않았다.

### 검증과 결과

- 같은 `127.0.0.1:5180` origin에서 password-user PWA baseline v3→candidate v4 업데이트는 별도로 통과했다. v4 controller/cache와 1/8 master Blob, 8/8 기록·저널·Story가 남았다.
- Android 인플레이스 보존과 cleanup 확인 직후 force-stop 복구는 아직 실제 기기에서 측정하지 않음이다. 다음 측정은 같은 signing lineage의 baseline/candidate로 1/8, synced 8/8, cleanup confirmation 직후 force-stop/reopen을 한 번 수행하는 것이다.

## CW-016 — 파생 아카이브를 새 저장 구조 없이 기존 기록으로 연결

### 문제와 증거

2026-07-27 KST, Living Hue Deck은 완료 카드와 Color Volume을 보여야 했지만 새 카드 이미지·DB·migration을 더하면 기존 local/remote 기록의 복구 계약과 비용이 불필요하게 커진다. legacy Post는 `image_path`만 갖거나 `client_meta.gridImages` fallback을 가질 수 있어, 원시 문자열 색 비교나 고정 1장 가정도 실제 기록 수를 왜곡할 수 있었다.

### 비교와 결정

1. Deck 전용 테이블·합성 카드 이미지·별도 색 그룹을 만든다.
2. 병합된 일일 Post와 기존 `getPostGridImages()`를 읽어 1/3/5/8과 Color Volume을 순수 파생한다.

2를 선택했다. 사진 수는 `grid_images → client_meta.gridImages → image_path` 실제 복원 결과로 계산하고, 같은 색은 기존 `hexToRgb`/`rgbToHex`로 검증된 정상 6자리 HEX만 canonicalize한다. 이로써 `#ff0000`과 `#FF0000`은 한 Volume이고 색 유사도·임의 문자열 복구는 만들지 않는다.

### 검증과 결과

- 단위 테스트는 1/2/3/4/5/7/8 장 경계, legacy `image_path`, fallback 다중 grid, HEX casing, local pending 8/8 Volume 포함을 확인한다.
- 430×932 local-only fixture에서 빈 Deck, `기록 / Deck`, 1/3/5/8, `기기 저장`, Color Volume, 원본 History, 기존 Story Studio와 실제 PNG export/download, share action을 확인했다. 캡처 6장은 `.design-references/01-current-screens/m3-living-hue-deck-2026-07-27/`에 있다.
- 최종 lint, Vitest 12 files/40 tests, production build, live Supabase verification, Capacitor sync, Android debug build가 통과했다.
- 수치 성능은 아직 측정하지 않음이다. 다음 측정은 beta aggregate query에서 Deck 세션별 실제 visible stage, source reopen, Story export callback을 집계하는 것이다.

### 남은 일

- M4에서 저장된 명시적 mission-pack ID가 생길 때만 최대 3개 컬렉션을 추가한다. M3에서 날씨·시간·위치로 과거 카드를 재분류하지 않는다.
- Android 업데이트 보존 QA는 별도 release gate로 남는다.

## CW-017 — 사진 상태를 건드리지 않는 부분 업데이트와 서버 타이머 없는 마감

### 문제와 증거

2026-07-28 KST, M4 선택형 미션 팩은 하루 페이지 전체에 적용되는 사용자 의도(pack)를 1–7장 상태에서 자유롭게 바꾸거나 해제할 수 있어야 했다. 하지만 기존 `saveCachedDraft()`는 daily-record와 media-asset을 함께 재파생하는 넓은 쓰기여서, pack만 바꾸는 매 상호작용에도 매번 사진 Blob·master/preview·업로드 경로를 다시 읽고 다시 쓸 위험이 있었다. 동시에 1–7장 기록은 사용자가 앱을 다시 열 때까지 얼마든지 열려 있을 수 있어, "현지 자정에 닫는다"는 계약을 서버 Cron이나 클라이언트 타이머 없이 지켜야 했다.

### 비교와 결정

1. pack 변경도 기존 `saveCachedDraft()` 경로로 처리한다 — 구현이 빠르지만 사진 상태를 매번 재검증·재파생하게 되어 의도치 않은 재압축·재업로드 위험을 늘린다.
2. daily-record 단일 행만 읽고 쓰는 별도 metadata-only IndexedDB transaction(`updateMissionPackSelection()`)을 추가하고, media-asset store는 절대 열지 않는다.
3. 자정 서버 작업이나 클라이언트 타이머로 지난 날짜 기록을 닫는다 — PWA/Android 모두에서 백그라운드 실행이 보장되지 않아 신뢰할 수 없다.
4. `findOpenPastRecords()`/`finalizeOpenRecord()`를 만들고 boot 직후, `pageshow`/`visibilitychange` foreground 복귀, 다음 촬영 전 날짜 검사 이 세 지점에서만 호출하는 lazy finalization을 쓴다.

2와 4를 선택했다. `updateMissionPackSelection()`은 `store.get()` → `missionPack`만 교체 → `store.put()`을 한 transaction에서 수행하며 `gridImages`, Blob, master/preview path, uploadPath, asset ID를 전혀 다루지 않는다. `finalizeOpenRecord()`는 이미 닫힌 기록을 그대로 반환하는 idempotent 함수라서 세 호출 지점 중 어디서 먼저 실행되어도 안전하다.

### 검증과 결과

- 단위 테스트로 pack 변경 전후 `gridImages` 배열의 참조/내용 동일성, `updateMissionPackSelection()`이 media-asset store를 열지 않음, `finalizeOpenRecord()`의 idempotency, 전날 pack이 새 `DailyMissionState`로 이월되지 않음을 확인했다(`missionPacks.test.ts` 15개, `dailyRecord.test.ts` 7개, `draftStorage.test.ts` 7개, `missionState.test.ts` 2개, 2026-07-28 KST 전체 통과).
- 430×932 Playwright QA에서 IndexedDB에 3장/8장 daily-record를 직접 seed해 실제 카메라 없이 UI 경로를 확인했다: 1–7장 pack 변경/해제 시 정확한 확인 문구와 확인 후에만 적용되는 동작, 8장 종료 후 모든 pack chip이 disabled로 전환되고 읽기전용 안내가 표시되는 것을 확인했다.
- 전체 lint 0 errors, Vitest 13 files/64 tests, `tsc -b && vite build` 성공, `npm run verify:supabase` 전체 `ok:true`, `npm run cap:sync` 성공, Android debug build `BUILD SUCCESSFUL in 2m 16s`(129 tasks, `app-debug.apk` 17,960,631 bytes)를 통과했다.
- `colorHunt` v2 추가가 v1/legacy Post와 알 수 없는 `client_meta` 필드를 훼손하지 않는지는 `mergeColorHuntIntoClientMeta()`의 deep-merge 단위 테스트로 확인했다(기존 top-level 키와 `colorHunt`의 알 수 없는 하위 필드가 보존되는 것을 어설션으로 검증).

### 남은 일

- Android 실기기(에뮬레이터 아닌 물리 기기) 인플레이스 업데이트에서 pack 선택이 새 APK 설치 후에도 보존되는지는 아직 측정하지 않음이다. 다음 측정은 M7 출시 gate에서 실기기에 baseline→candidate APK를 순서대로 설치하고 로그인·1–7장 기록·pack 선택을 확인하는 것이다.
- `feature/everyday-mission-packs`는 아직 `main`에 병합하지 않았다. 병합 시점은 M5 진행과 별도로 결정한다.

## CW-018 — 결제를 첫 출시에서 분리하면서도 안전한 후속 수익화 경로를 고정

### 문제와 근거

첫 출시부터 결제를 넣으면 완성본처럼 보이지만, 아직 실제 사용자가 없는 상태에서 상품 가치·가격을 확정해야 하고 Play 상품 등록, 구매 보류·환불·복원·계정 귀속과 실기기 라이선스 QA가 모두 출시 차단 요인이 된다. 반대로 결제를 나중에 바이브 코딩으로 추가할 때 기존 사진·기록이 유실되거나 업데이트가 깨질 수 있다는 우려가 있었다.

### 비교와 결정

1. 버전 1에 결제 SDK와 entitlement DB를 미리 넣어 미래 변경을 줄인다.
2. 버전 1은 무료로 출시하고 실제 인플레이스 업데이트 보존을 확인한 뒤, 결제를 기존 데이터와 분리된 additive entitlement 계층으로 추가한다.

2를 선택했다. 결제는 기존 Post·사진·IndexedDB/local master를 변환할 필요가 없으므로 package/signing과 Supabase user ID를 유지하고 별도 권한 경계로 붙이는 편이 더 작고 진단 가능하다. 결제를 무기한 보류하지 않도록 `M8M` 우선 업데이트와 자동 재개 키워드도 고정했다.

### 안전 설계와 검증 계획

- 첫 상품 기본안은 반복 서버 비용이 작은 Hueday Studio 1회 구매이며 Cloud는 실제 storage/egress와 복구 수요를 측정한 뒤 별도 승인한다.
- 클라이언트 구매 콜백만으로 권한을 승격하지 않고 검증된 store/provider 상태를 사용한다.
- 실제 기존 데이터 fixture 위 `adb install -r`, 구매·취소·보류 후 완료·복원·환불/회수·로그아웃/계정 전환을 P0로 검증한다.
- 정량 결과는 아직 측정하지 않음이다. 다음 측정은 무료 버전의 실제 인플레이스 업데이트에서 보존된 기록 수/종류와 M8M sandbox 구매 상태별 권한 결과, 소요 시간, 실패 수를 기록하는 것이다.

## 작업 종료 시 갱신 규칙

다음 중 하나라도 해당하면 새 사례를 추가하거나 기존 사례를 갱신한다.

- 사용자 데이터 손실·보안·권한·개인정보 위험을 해결했다.
- 배포, 빌드, 기기, 브라우저, 외부 서비스 제약을 우회했다.
- 두 가지 이상의 설계를 비교하고 중요한 트레이드오프를 결정했다.
- 재현이 어려운 오류의 원인을 증거로 좁혔다.
- 성능, 전환율, 안정성, 저장 비용을 측정해 개선했다.
- 실패한 접근이 다음 작업에 유용한 학습을 남겼다.

단순 문구 수정이나 근거 없는 아이디어는 사례로 부풀리지 않는다. 의미 있는 작업인데 사례화하지 않았다면 세션 기록의 `취업 사례 영향`에 그 이유를 적는다.
