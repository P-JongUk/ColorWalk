# 다음 할 일

> ## 최신 재개 지점 (2026-07-28)
>
> - **기준:** M4 선택형 일상 미션 팩은 `feature/everyday-mission-packs`(checkpoint 1 `5eeaf91`, checkpoint 2 `b3128c1`)에서 구현·전체 검증·430×932 QA·문서 정렬(checkpoint 3)까지 완료했다. 아직 `main`에 병합하지 않았다.
> - **첫 구현 작업:** M5 주간 `Hueprint`/`Color DNA`와 월간 `Color Capsule`을 기존 원본 Post/Deck 데이터 위에서 설계한다. 완성 강제·연속 출석·랜덤 보상은 넣지 않는다. M3 카드에서는 기존 Story Studio를 그대로 열고 별도 Deck 이미지 포맷/업로드를 만들지 않는다.
> - **그 다음:** `feature/everyday-mission-packs`를 `main`에 병합할 시점과 순서(M5 이전/이후)를 사용자와 확인한다. Android 실기기 인플레이스 QA는 M7 출시 gate로 유지한다.
> - **M5 모델·세션:** 큰 방향 대화는 Sol medium, 고위험 계획 확정은 Sol high+계획 모드, 승인된 구현은 Kiro Sonnet 5 high 단일-agent, 검토는 Antigravity Gemini 3.1 Pro high 읽기 전용, 통합은 Codex Terra medium을 기본으로 유지한다. 각 전환 전에 commit·push하고 같은 worktree를 동시에 수정하지 않는다.
> - **출시 후:** Hue Drop만 친구 기능 우선순위 1이며, 개인 출시 지표와 업데이트 안전을 확인하기 전에는 설계·DB migration을 시작하지 않는다.
> - **유지:** Android capture → force-stop → offline/online retry는 여전히 출시 전 필수 QA다.
> - **출시 후 필수:** `feature/hue-canvas-production`에서 G1 코드를 선별 이식하고, 기존 사용자 데이터가 채워진 Android/PWA 인플레이스 업데이트, Palette 재파생, versioned recipe 복구, 기능 gate 롤백을 통과한 뒤 Hue Canvas를 배포한다.
> - **첫 소셜 업데이트:** Hue Drop은 Canvas와 별도 release로 진행하고 공개/익명 UGC를 열지 않는다.


> ## M4 진행 인계 (완료, 2026-07-28)
>
> - **작업명·목표:** 완료 — M4 `feature/everyday-mission-packs`: `indoor-hunt`/`commute-hunt`/`rainy-window` 3개 static pack + 자유 모드, `colorHunt` v2 metadata 계약, metadata-only pack 변경, lazy finalization, pack 컬렉션.
> - **현재 브랜치 / 기준:** `feature/everyday-mission-packs`, `origin/feature/everyday-mission-packs`와 동기화. base는 `origin/main` `b17b5e9`. `main`에는 아직 병합하지 않았다.
> - **체크포인트:** checkpoint 1 `5eeaf91`(타입/config/v2 reader/metadata-only update/deep-merge test), checkpoint 2 `b3128c1`(8장·lazy finalization/UI/Deck 컬렉션/analytics/QA), checkpoint 3(문서·AI memory 정렬, 이 커밋).
> - **마지막 통과 검증(2026-07-28 KST):** lint 0 errors, Vitest 13 files/64 tests, build, `verify:supabase` 전체 ok, `cap:sync`, `git diff --check`, Android debug build(`app-debug.apk` 17,960,631 bytes), 430×932 Playwright QA(자유 기본/추천 배지/0장 무확인/1–7장 확인 다이얼로그/8장 읽기전용/collection tile 3개/8·8 카드+Story).
> - **범위 밖으로 남긴 것:** Android 실기기 인플레이스 QA(M7 gate), `main` 병합, DB migration, production 배포.

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
- [ ] M4 후속: `feature/everyday-mission-packs`를 `main`에 병합할 시점 확정. Android 실기기 인플레이스 QA는 M7 출시 gate로 유지
- [ ] M5 Hueprint/Color DNA/Color Capsule: 기존 원본 Post/Deck 데이터 위에서 주간 회고와 공유를 연결하고, 완성 강제·연속 출석·랜덤 보상은 넣지 않기
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
