# ColorWalk V2 기존 프로젝트 감사 — 진행 중

기준일: 2026-10-03 KST. V1 baseline: `e54ffadb7c0cba7609b1174c6968381624f658db`.
V2 작업 브랜치: `v2/product-redesign`. 이 문서는 완료된 감사 보고서가 아니라 실제 독해 범위와 확인한 충돌을 보존하는 checkpoint다.

## 승인과 실행 범위

사용자는 V2 전체 개편과 가역적인 제품·디자인 선택을 근거 조사 후 자율 실행하도록 명시 승인했다. V1의 재승인 규칙을 다시 묻는 이유로 사용하지 않는다. production DB mutation, 실제 결제 활성화, 공개 배포/store publish, destructive Git, 새 secret/account credential은 계속 외부 승인 gate다. 현재 에이전트만 사용한다.

최우선 목표는 첫 매력, Hunt, 디자인, SNS에 올리고 싶은 3×3, 공유물의 유입, 반복 사용, 유료 반복 가치다. master는 local-only `.ai-context/COLORWALK_V2_MASTER_ROADMAP_v0_2.md`이며 1,813줄을 처음부터 끝까지 읽었다. 파일명과 내부 제목 `v0.1`이 다르지만 본문을 실제 기준으로 삼고 버전 차이를 추측하지 않는다. Phase 0–9와 완료 조건은 `.ai-context/long-run-plan.md`/`quota-task.json`에서 관리한다.

## Git 확인

- 시작 HEAD와 baseline은 동일했다. tracked 변경 없음.
- `git fetch origin` 성공. 기존 V1 branch와 remote checkpoint는 그대로다.
- `git switch -c v2/product-redesign e54ffad` 성공. `main`을 병합하거나 baseline을 움직이지 않았다.
- 기존 미추적 `.tmp ` 디렉터리, `diff.patch`, `output/`는 사용자 작업으로 보존한다.
- 초기 `git diff --check` 성공. 제품 코드 변경·production 변경은 없다.

## 문서 인벤토리와 실제 독해 상태

`rg --files --hidden --no-ignore -g '*.md'`로 ignored 디자인 자료까지 재귀 조사했다. vendor/dependency, Git, dist/build, cache, Graphify 생성물, browser scratch/output를 제외한 초기 인벤토리는 **161개**다. 기존 credential 문서는 내용 출력·로그·커밋에서 제외한다. 파일을 나열하는 것은 읽은 것으로 계산하지 않는다.

정확한 경로·bytes·독해 상태는 local-only `.ai-context/v2-document-reading-ledger.json`에 있다. 첫 checkpoint 기준 **7개 full-read, 6개 partial**, 나머지는 pending 또는 명시 제외다. 부분 독해는 출력 잘림을 보수적으로 반영했다. 전체 Markdown 독해 완료를 주장하지 않는다.

| 문서 | 확인한 문제/결정 | 현재 상태와 다음 대조 |
| --- | --- | --- |
| V2 master roadmap | 제품 매력·Hunt·공유·반복 가치 중심의 단계별 개편 | full; Phase 0부터 실행. 모든 Phase 아직 미완료 |
| `docs/hueday-product-blueprint.md` | V1 핵심 의도, 비처벌형 기록, Deck/창작/개인정보/무료 코어 | full; 상단 최신 계약과 아래 historical Canvas/Relay 출시 서술을 구분. 코드 대조 pending |
| `docs/development-reference-guide.md` | 기능별 문서 라우팅과 영향 검사 | full; V1의 selective-read 기본보다 이번 사용자의 전체 독해 요청 우선 |
| `.codex/skills/hueday-development-workflow/SKILL.md` | 단일 agent, Graphify, 검증, memory/문서 계약 | full; 가역적 V2 선택 승인과 사용자 지정 branch 우선 |
| `.codex/skills/ponytail/SKILL.md` | 기존 helper/플랫폼 우선, 작은 root-cause 변경 | full; 재사용 판단은 흐름 이해 후 수행 |
| `.ai-context/current-task.md`, `handoff-snapshot.md` | 온보딩 실제 검증과 dev EBUSY | 이전 내용 full; 지난 lint/103 tests/build와 preview smoke는 과거 증거. 이번에 재실행하지 않음 |
| `docs/hueday-development-roadmap.md` | 최신 M6.5→M7과 예전 M7 Relay/M8 디자인 순서 공존 | partial; 출력 잘린 구간을 재확인한 후 full로 승격 |
| `docs/ai-model-selection-guide.md` | 모호성/영향/가역성/검증 비용에 따른 설정 | partial; 오래된 모델명/외부 사실은 최신으로 주장하지 않음 |
| `docs/ai-memory/00-current-state.md` | M1–M6.5 진행과 중간 시점 요약 공존 | partial; 최신 상단과 과거 상태를 구분, 현재 코드 대조 pending |
| `docs/ai-memory/01-decisions.md` | 8장/중앙색, 저장 경계, Canvas/Deck, 결제 출시 순서 | partial; 날짜만으로 결론 내리지 않고 명시 supersession 대조 |
| `docs/ai-memory/02-next-tasks.md` | 최신 M7와 옛 미완료 체크리스트 공존 | partial; historical 체크박스를 현재 미구현으로 단정하지 않음 |
| `.codex/skills/graphify/SKILL.md` | 구조 질의, code-only update, 단일 agent override | partial; query 실행 확인, semantic extraction/subagent 없음 |

미독해 그룹은 root `README.md`/`DESIGN.md`/`plan.md`/실제 `AGENTS.md`, 나머지 product/growth/monetization/storage/security/release/reward/QA 문서, **모든 기존 session**, ignored `.design-references/**`의 Markdown, 나머지 repository skill/reference다. 각 의미 있는 문서는 전체 독해 후 의도·현재/역사·코드 정합성·충돌·재사용 가치·만료 가정을 이 문서에 추가한다. 새 checkpoint/session 문서는 기존 corpus와 구분한다.

## 구조 근거

Graphify query `HomeScreen CameraView captureDraft localPhotoMaster storyCanvas livingHueDeck useAppStore`를 실행했다. `CaptureDraft`/`CameraView`/`App`/`livingHueDeck.ts`, draft 이미지 타입과 `getDeckStage`/`getLivingHueDeckCards`/`getColorVolumes`가 연결된다. 이는 읽을 코드의 지도이며 실제 동작 검증이나 코드 감사 완료를 뜻하지 않는다.

## 확인한 충돌과 판단 보류

1. V1은 중앙 미션색 + 사진 8장, 부분 1–7장 보존, 8장 주요 보상이다. V2 brief는 `0/9 → 9/9` 예시가 있다. 9개 시각 칸과 사진 수를 혼동하지 않도록 Phase 1에서 기존 데이터·완성 부담·실제 경쟁 공유물 비교 후 결정한다. 현재 데이터는 변환하지 않는다.
2. V1은 Hueday 공개 브랜드/ColorWalk 내부 이름이다. 이번 V2는 ColorWalk라고 부르지만 이를 영구 package/브랜드 migration 승인으로 추정하지 않는다. 공개 이름은 연구 대상으로 두고 내부 identity를 보존한다.
3. V1 최신 출시 경로는 Deck, Canvas 필수 후속, Hue Drop 별도 소셜이다. 아래 Canvas/Relay 출시 절은 역사다. V2 challenge/deep-link는 새 후보이며 공개 사진/친구 DB 뼈대를 선제 추가하지 않는다.
4. V1 Studio 1회 구매/Cloud 구독은 후보 가격과 안전 계약이다. V2는 반복 creative/collection 가치 자체를 연구한다. 기존 가격을 확정값으로 쓰거나 simple utility에 구독을 붙이지 않는다.
5. `.tmp` Chromium Cookies 감시 EBUSY와 weather 정밀좌표 문제는 이전 관찰이다. 원인 재현·현재 코드 확인 전 수정 완료로 주장하지 않는다.

## 영역별 처분 상태

최종 KEEP / REFINE / SIMPLIFY / REPLACE / REMOVE / DEFER 판정은 **전체 문서 독해와 실제 코드 대조 뒤** 작성한다. 현재는 baseline 보존과 안전 경계 KEEP만 확정했다. Hunt/촬영, IA/navigation, draft/master, History/Deck/Story, share composition, visual language, onboarding/auth, offline/Supabase, notification/challenges, monetization, analytics의 판정은 pending이다. 새것/매몰비용 어느 쪽도 채택 이유가 아니다.

## 재개점과 검증

Quota Guard 공식 조회: 시작 5h 19% / weekly 87%, 중단 gate 5h 11% / weekly 86%. 5h ≤12% 규칙으로 PAUSE_PENDING, 실제 reset `2026-10-03 01:52:53 KST`, +120초 재개 확인 `01:54:53 KST`. Mode C는 알림 후 같은 chat의 `$quota-resume`이며 자동 모델 실행을 하지 않는다.

재개 시 Git/guard를 확인하고 partial 문서 출력 누락부터 복구한다. 이어 ledger의 나머지 모든 relevant Markdown을 끝까지 읽고, Graphify로 scoped source를 대조한 뒤 Phase 0의 lint/test/build·현재 화면·performance·dev watcher 검증을 수행한다. Phase 0은 완료 처리하지 않았다. fresh external research, 제품 변경, 실제 렌더링, Android/Supabase 검증과 Notion milestone 기록은 아직 시작하지 않았다.

정량 제품 성과: **아직 측정하지 않음**. 다음 측정은 baseline bundle/시작·화면 렌더·Hunt/실제 export 경로이며 문서 수를 사용자 성과로 취급하지 않는다.
