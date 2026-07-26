# 다음 할 일

> ## 진행 중 작업 인계
>
> - **작업명·목표:** 완료 — M2-2 `feature/local-master-offline-sync`: 2560px Hueday 로컬 고화질 master, 기존 IndexedDB `drafts` store 내부의 `daily-record`/`media-asset` kind, preview-only Supabase sync와 재실행 복구.
> - **현재 브랜치 / 기준 main:** M2-2는 `e495501`까지 `main == origin/main`에 fast-forward 통합 완료. feature 브랜치는 동일 커밋을 가리키며 별도 후속 작업은 새 feature 브랜치에서 시작한다.
> - **현재 체크포인트:** CP5 문서 정합화까지 완료. CP4 PWA/Capacitor QA와 새 debug APK는 확인했지만, AVD가 ADB-ready가 되지 않아 Android 실경로 QA는 남아 있다.
> - **완료한 내용:** Graphify로 draft→압축→Storage/Post→복구 경로를 확인했다. staging 원본을 먼저 저장하고 2560px WebP master를 검증한 뒤 staging을 지우는 helper, PWA Blob/Android `Directory.Data` 분기, assetId 기반 preview 경로, 완료 기록 유지, pending/error index 조회의 기반 코드를 작성했다. 4개 bitmap 표본에서 0.86/0.90/0.92 후보를 측정했고 0.90을 beta preset으로 선택했다.
> - **마지막 통과 검증:** 기존 lint/Vitest(10 files/25 tests)/production build/live Supabase verification 결과, 이번 `npm run cap:sync`, 430×932 PWA Home/Camera smoke, debug APK 17,955,823 bytes.
> - **다음 작업:** Hue Canvas의 430×932 시각·조작과 실제 Canvas 2D 성능 프로토타입을 검증하고 사용자 승인을 받는다. 빈 탭/Coming Soon 화면은 만들지 않는다. 승인 뒤 local master 수동 정리(자동 삭제 금지·복구 불가 경고·사용자 확인)와 최소 미션 팩을 진행한다.
> - **범위 밖:** `grid_images` migration/backfill/repair, archive, account export/delete, Cloud backup, SQLite, 자동 master 삭제.

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
- [ ] M2: 가입 → 촬영 → 저장의 안정성·E2E·최소 이벤트와 화면 조회·foreground 체류·핵심 CTA·D1/D7/D30 집계 계약, 로컬 고화질 마스터·preview·archive 기반 완성하기
- [ ] M4 우선: Hue Canvas 빈/Palette/자유 작업/도안 크기/완성·export 430x932와 실제 Canvas 2D 성능 스파이크를 검증하고 사용자 승인받기. 빈 탭/Coming Soon 화면 금지
- [ ] M2-3: 승인 뒤 정상 동기화된 날짜의 local master 수동 정리 구현하기. 자동 삭제 금지, preview만 남으면 복구 불가 경고와 사용자 확인. Android capture → force-stop → offline/online retry는 출시 전 필수 QA로 유지
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
## 2026-07-26 — Hue Canvas G1 승인 대기

- 사용자에게 `.design-references/07-found-color-content/hue-canvas-gate-2026-07-26/01-empty-and-palette/`와 `02-free-canvas/`의 430×932 캡처를 보여 주고, D — Chromatic Archive 외부 UI·유리 질감 강도·자유 Canvas 조작·Palette 수량 카피·하단 도구 배치를 승인받는다.
- G1 승인 전에는 도안 3종, 도안 크기 재계산, resize 복사본, 완성·리믹스·export, Android 실기기 성능, production AppTab/BottomNav 통합을 구현하지 않는다.
- 승인 뒤 G2a에서만 기하학 창·잎·수평선/도시 실루엣의 Path2D/mask 3종과 색칠 전 크기 계산, 저장·완성·리믹스·direct recipe export·PWA/emulator 검증을 진행한다. G2b 실제 Android 기기 QA는 production 승격 전 별도 gate다.
