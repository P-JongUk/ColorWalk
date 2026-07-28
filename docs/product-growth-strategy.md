# Hueday Product Growth Strategy

> **최신 성장·수익화 기준(2026-07-27):** 첫 출시 성장 루프는 개인 Color Hunt → M3 Living Hue Deck 1/3/5/8 성장 → canonical Color Volume → M4 명시적 pack-ID 제한 컬렉션 → M5 Hueprint·기존 Story 공유다. 출시 후에는 Hue Canvas를 초기 필수 기능 업데이트로 제공해 발견 색의 능동적 사용을 확장하고, Hue Drop은 첫 소셜 업데이트로 검증한다. 무료 핵심은 기록·Deck·기본 Hueprint/Story·기본 Hue Canvas·로컬 고화질 보존이며, 가격은 선택형 팩 1,500–3,900원·Studio 14,900/19,900원 후보·Cloud 월 1,500원/연 9,900원 5GB 후보로만 유지한다. 상세은 `docs/launch-scope-and-update-safety-contract.md`.

## 2026-07-26 출시 전 성장 가설 정렬

### 살리는 요소

- **색 찾기의 즉시성:** 1장의 사진도 오늘을 남기며, 다음 사진이 카드의 모습을 바꾼다.
- **누적의 의미:** 완성한 같은 색은 Color Volume으로 쌓여 “또 이 색을 만나고 싶다”는 가벼운 수집 이유를 만든다.
- **공유 가능한 결과:** 매일의 3×3, 성장 카드, 주간 Hueprint는 타인의 사진을 소비하는 피드가 아니라 내 일상의 결과를 공유하게 한다.
- **일상 확장:** 미션 팩은 산책에 한정하지 않고 통학·비·실내·카페 같은 평범한 하루에서 색을 찾게 한다.

### 빼는 요소

- 그림을 잘 그려야 보상이 생기는 Canvas 중심 루프
- streak·랭킹·마감·희귀도·가챠로 만드는 압박
- 초반 바이럴만 기대하는 공개 릴레이/낯선 사람 사진 피드
- AI 이미지/도안 생성처럼 비용·대기·개인정보 부담이 큰 첫 출시 기능

### 출시 후 순서

1. 개인 루프가 재방문·공유를 만드는지 측정한다.
2. 업데이트 안전 gate를 통과한 Hue Canvas를 초기 기능 업데이트로 제공한다.
3. 초대 전용 Hue Drop을 첫 소셜 업데이트의 작은 베타로 연다.
4. Canvas 사용·Hue Drop 초대 수락·완성·안전·비용 신호를 확인한 뒤 다른 후보를 비교한다.

친구 기능이 없다는 이유만으로 첫 출시 완성도를 낮추지 않는다. 반대로 개인 루프가 검증되기 전 친구/공개 기능을 앞당겨 운영 위험을 만들지도 않는다.

마지막 코드·시장 대조: 2026-07-23 KST
상위 전략과 현재 구현 진단: `docs/hueday-breakout-strategy.md`
전체 제품 합의: `docs/hueday-product-blueprint.md`
실제 실행 순서와 상태: `docs/hueday-development-roadmap.md`
Hue Canvas 상세 계약: `docs/hue-canvas-product-spec.md`
발견 색 확장 후보·보류: `docs/discovered-color-content-strategy.md`

이 문서는 Hueday가 베타 이후 어떤 성장 루프를 키울지 정리한 living document다. 새 기능을 추가할 때는 단순히 유행 앱을 따라 만들지 말고, 아래의 고유 루프를 강화하는지 먼저 확인한다.

> 일상 미션 색 -> 현실에서 비슷한 색 찾기 -> 중앙 색 3x3 컬렉션 -> 발견 색 창작/Hueprint 정체성 -> 스토리/Relay 공유

## Product North Star

Hueday는 사진 SNS가 아니라, 현실에서 발견한 색을 가볍게 수집하고 자기만의 무드 정체성으로 쌓아가는 color diary다.

- Main target: 한국 베타 사용자, 특히 10대와 20대 초반.
- Core emotion: 산책을 포함한 일상 속 색 발견, 감성적인 기록, 내 색을 작품 재료로 조합하고 친구에게 보여주고 싶은 기쁨.
- Core habit: 현지 날짜마다 새 추천 색을 고르고 첫 사진으로 확정한 뒤, 1장만으로도 그날의 기록을 남기고 원하면 같은 날 8장을 채워 3x3 한 페이지를 완성하는 것.
- Core sharing: 얼굴/원본 사진보다 색, 무드, 작은 이야기 중심의 공유.
- Core safety: 공개 랭킹, 비교 피드, 압박형 streak를 피하고 가까운 사람끼리의 낮은 부담을 유지한다.

## Korean/English launch reach

- The first release permits English UI and downloads outside Korea, while initial marketing and customer-support priority remains Korean users.
- Assess overseas performance only through the existing privacy-preserving aggregate events and aggregate queries: country-level installs where the store provides them, first saved record, return, 8-photo completion, and successful export. Do not add an analytics SDK, raw-content collection, device fingerprinting, or a country-specific server to answer this question.
- Do not pre-build country-specific functionality, content, or infrastructure. Revisit only when aggregate evidence and support demand justify it.
- English ASO should express Hueday's differentiation as `Color Hunt → 3×3 collection → Hueprint`, rather than generic photo-diary or social-network language.

## Reference Principles

### 2026-07-23 KST 차별화와 검증 기준

- 개인 기록은 혼자서 완결되고, 3×3/9:16 결과 카드는 편집 부담 없이 공유할 수 있어야 한다. 공유·친구 참여·공동 결과물은 무료 성장 행동이다.
- 경쟁 사례가 공통으로 제공하는 일일 색과 3×3 자체를 차별점으로 주장하지 않는다. Hueday는 비처벌형 부분 기록, 개인화, 발견 색의 창작 재료화, 비교 없는 Relay를 검증한다.
- 첫 베타 지표: 첫 사진 전환, 다음 날 재방문, 8장 완료, 자동 카드 export, 공유 링크 생성, 링크 열기→첫 촬영, 친구 참여 후 공동 결과물 확인.
- 공개 리더보드, 색 매칭 점수, 강제 streak는 성장 수단으로 추가하지 않는다.

아래 서비스는 구조를 참고하되, 기능을 그대로 복제하지 않는다.

| Reference | 참고할 점 | ColorWalk식 변형 | 그대로 복붙하면 안 되는 점 |
| --- | --- | --- | --- |
| Locket | 가까운 사람에게 자주 보이는 루프, 작고 친밀한 공유 | 친구에게 오늘의 컬러 카드 링크를 보내고, 상대는 가볍게 오늘 색을 본다 | 홈 화면 사진 위젯/친구 사진 피드 복제 |
| BeReal | 매일 자연스러운 계기, 즉흥적인 기록 | 날씨/시간 기반 오늘의 색 미션을 매일의 계기로 삼는다 | 강제 알림, 친구 비교, dual-camera SNS 구조 |
| Setlog | 소규모 친구가 같은 날 올린 2초 안팎 영상을 하나의 group vlog로 묶는 낮은 부담 | 친구의 작은 색 발견이 한 장의 공동 팔레트로 모이게 한다 | 연락처 기반 영상 그룹·원본 영상 피드 복제 |
| Story apps | 공유하기 쉬운 9:16 결과물 | ColorWalk 전용 스토리 프레임, 스탬프, 월간 리캡으로 발전시킨다 | 범용 템플릿 앱처럼 복잡한 편집기를 만드는 것 |

## Core Growth Loops

### 1. Daily Color Mission Loop

매일 앱을 열 이유를 만든다.

1. 앱이 날씨/시간/선택적 대략 위치에 맞는 색을 추천하고, 최대 3회의 문맥 재추천 뒤에는 전체 큐레이션 색에서 균등하게 다른 색을 보여준다.
2. 사용자는 색을 고른 뒤 주변에서 비슷한 무드의 색을 찾는다. 첫 사진을 확정하면 그날의 색도 잠긴다.
3. 카메라 또는 앨범으로 3x3 컬렉션을 채운다.
4. 짧은 컬러 이름과 mood sentence를 남긴다.
5. 저장된 기록이 히스토리, 프로필, 배지, 리캡의 원천이 된다.

구현 기준:

- `posts.local_date`와 저장된 grid/photo metadata를 source of truth로 둔다.
- daily mission은 첫 추천과 3회 재추천까지 날씨/시간/선택적 대략 위치 문맥을 유지하고, 이후에는 현재 표시 색을 제외한 전체 큐레이션 색을 같은 확률로 뽑는다.
- 기기 현지 날짜가 바뀌면 새 색을 선택한다. 전날 1–7장 기록을 오늘의 활성 미션으로 넘기지 않는다.
- 사용자가 하루를 놓쳐도 실패감을 주지 않는다. "새 색길을 시작"하는 톤을 유지한다.

### 2. Shareable Color Identity Loop

사용자가 친구에게 보여주고 싶게 만든다.

1. 저장 후 바로 9:16 스토리 또는 컬러 카드 링크를 만들 수 있다.
2. 결과물은 사진 원본보다 색, 이름, mood, 3x3 컬렉션이 주인공이다.
3. 친구가 링크를 열면 로그인 없이도 제한된 오늘의 컬러 카드만 볼 수 있다.
4. 친구가 앱을 써보고 싶으면 beta account/signup flow로 이어진다.

구현 기준:

- 공유 링크는 revocable, expirable, private-by-default로 설계한다.
- 위치, 원본 사진, 사용자 ID는 기본 공개하지 않는다.
- 공유는 친구 초대보다 먼저 "내 오늘 색을 보여주기"여야 한다.

### 3. Collection Completion Loop

기록을 많이 쓰는 부담 대신 "채우고 싶다"는 마음을 만든다.

1. 첫 사진은 그날의 미션 색을 확정하고 안전하게 남기는 유효한 `오늘의 색 기록`이다.
2. 같은 날 2–7장은 더 풍부한 일상 장면이며, 8장을 채운 3x3은 오늘의 한 페이지와 주요 보상을 완성한다.
3. 현지 자정에는 현재 장수 그대로 그날 기록을 닫고 다음 날 새 색을 제안한다. 미완성에 실패·손실·연속일 초기화를 사용하지 않으며 전날 기록을 오늘 미션으로 이월하지 않는다.
4. 한 달이 끝나면 월간 컬러 리캡이 생성된다.
5. 프로필에는 사용자의 색 정체성이 축적된다.

구현 기준:

- 배지는 점수나 순위가 아니라 creative unlock이어야 한다.
- unlocked item은 스토리/프로필/리캡에서 실제로 쓸 수 있어야 한다.
- 놓친 날 때문에 보상, 색 재료, 작품이 줄어들지 않아야 한다.
- 자세한 배지 원칙은 `docs/colorwalk-reward-system.md`를 따른다.

### 4. Found-Color Creation Identity Loop

사용자가 새 색을 찾을수록 직접 만들고 리믹스할 수 있는 개인 작품의 조합 가능성이 넓어진다.

1. 완성된 3x3의 `mission_hex`가 Hue Palette에 들어가고 같은 색 발견 횟수가 한 작품의 타일 배치량이 된다.
2. 사용자는 큰 Hue Canvas에 자유롭게 그리거나 크기 조절 가능한 선 도안을 반투명 유리 타일로 채운다.
3. 작품의 색을 누르면 해당 3x3 기록과 일기로 돌아간다.
4. 색은 영구 소모하지 않으며, 새 색을 얻으면 과거 작품을 리믹스하고 월간 Hueprint에 함께 보관한다.
5. Relay는 서로 한 색씩 보태는 공동 Canvas·엽서로 확장할 수 있다.

구현 기준:

- 색상별 에셋이나 생성형 AI 없이 결정적 SVG/Canvas 규칙을 우선한다.
- 색과 작품은 접속하지 않아도 줄거나 망가지지 않는다.
- 공개 인기 순위나 친구 비교보다 개인 기억과 표현을 우선한다.
- 제품·승인 기준은 `docs/hue-canvas-product-spec.md`, 확장 후보는 `docs/discovered-color-content-strategy.md`를 따른다.
- Hue Room은 완전히 별도의 출시 후 가설이며 대체 콘텐츠 안에 축소 형태로 넣지 않는다.

## Current Master Sequencing

아래 Priority와 Phased Roadmap은 성장 아이디어의 상세 backlog다. 실제 구현 순서는 `docs/hueday-development-roadmap.md`의 M0~M10을 따른다. 현재 핵심 순서는 컬러 헌트 규칙 정렬 → 안정성·측정 → 일상 미션 팩 → 발견 색 대표 콘텐츠·보상 → Hueprint/Capsule → Color Relay → 통합 출시 검증이다.

## Priority Features

### Priority 1. 친구와 공유하는 오늘의 컬러 카드 링크

목표: 친구에게 "오늘 내 색 이거야"를 부담 없이 보여주는 첫 공유 루프를 만든다.

MVP UX:

- journal save 이후 `오늘의 컬러 카드 공유` 버튼을 보여준다.
- 공유 화면은 9:16 이미지 export와 링크 공유를 분리한다.
- 링크를 받은 친구는 웹에서 다음만 본다:
  - 오늘의 mission color
  - 사용자가 찾은 대표 색
  - 3x3 컬렉션 썸네일 또는 대표 이미지
  - custom color name
  - 짧은 mood sentence
  - ColorWalk watermark
- 친구에게는 댓글/좋아요보다 `나도 오늘 색 찾기` CTA를 우선한다.

Backend/API 후보:

- `shared_cards`
  - `id uuid primary key`
  - `owner_id uuid references auth.users`
  - `post_id uuid references posts`
  - `slug text unique`
  - `expires_at timestamptz`
  - `revoked_at timestamptz`
  - `view_count integer default 0`
  - `created_at timestamptz`
- RLS:
  - owner는 본인 share row 생성/폐기 가능.
  - public read는 Edge Function 또는 carefully scoped view를 통해 제한된 필드만 반환.
  - storage signed URL은 짧은 만료 시간으로 생성한다.

Risks:

- 미성년 사용자 대상 서비스이므로 공유 링크에 민감 정보가 섞이면 안 된다.
- exact location, raw EXIF, private account metadata는 링크 응답에 포함하지 않는다.
- 링크를 받은 사람이 post owner의 다른 기록으로 이동할 수 없어야 한다.

Success metrics:

- 저장 후 공유 버튼 클릭률.
- 생성된 링크 수.
- 링크 open rate.
- 링크를 통해 가입/로그인 또는 첫 capture까지 이어진 비율.

### Priority 2. 월간 컬러 리캡

목표: "나는 이번 달 이런 색을 모았다"는 정체성 축적을 만든다.

MVP UX:

- 월말 또는 월간 히스토리 상단에서 `이번 달 리캡 만들기`를 보여준다.
- 리캡은 9:16 export 중심이다.
- 구성:
  - 이번 달 대표 팔레트 5-9개
  - 가장 많이 수집한 color family
  - favorite custom color name
  - 저장한 날 수
  - 3x3 완료 수
  - 대표 사진 1-3장 또는 컬러칩 중심 버전
  - badge/stamp overlay

Backend/API 후보:

- 첫 MVP는 client-side 계산으로 충분하다.
- scale 이후 `monthly_recaps` 캐시 테이블을 고려한다.
  - `owner_id`
  - `month`
  - `dominant_colors jsonb`
  - `post_count`
  - `grid_complete_count`
  - `template_id`
  - `export_metadata jsonb`

Design 방향:

- album recap보다 color passport/report 느낌.
- 텍스트 과밀 금지. 친구가 스토리에서 1초 만에 이해해야 한다.
- premium 후보는 seasonal recap frames, monthly typography, palette packs.

Success metrics:

- 월간 리캡 화면 진입률.
- export/download/share rate.
- 리캡을 본 다음 달 D1/D7 retention.

### Priority 3. Color Rhythm으로 발견 색 창작·스토리·Hueprint 해금

목표: 연속 숫자 압박이 아니라 일상 속 색 발견이 실제 창작 재료와 예쁜 결과물을 열게 한다.

MVP UX:

- 오늘의 색 기록: 첫 사진부터 저장 확인과 같은 날 이어하기 입구를 제공한다. 1–7장은 유효한 일일 기록이지만 주요 완료 보상으로 표시하지 않는다.
- 완성 3x3 누적: 해당 미션 색의 Hue Canvas 배치량, 기본 도안·도구.
- 주간 2/3/5일 Color Rhythm: 유리 재질 변형·soft story detail.
- 미션 팩 완성: 학교·집·통학·카페 문맥의 스탬프·텍스처.
- 월간 참여: Hueprint 표지·recap frame.
- 출시 전 실제 사용자가 없으므로 기존 3·7·14·30 배지는 완성 3x3 페이지 수 기준으로 즉시 전환한다.
- 스토리 편집기에서 잠금/해금 상태를 자연스럽게 보여준다.
- 잠긴 아이템은 과도하게 아쉽게 보이지 않게 하고, "3일 색길을 채우면 열려요" 정도의 부드러운 문구를 사용한다.

Implementation rule:

- unlock state는 `posts.local_date`, grid completion count, mission pack metadata, future saved activity metadata에서 계산한다.
- asset id가 바뀌어도 milestone meaning은 유지한다.
- 배지 보상 수정 시 `docs/colorwalk-reward-system.md`와 `src/lib/collection.ts`를 함께 갱신한다.

Success metrics:

- milestone 도달률.
- unlocked asset 사용률.
- badge detail sheet -> story export 전환률.

### Priority 4. 집·학교·통학·카페·여행·계절별 일상 컬러 미션

목표: 한국 사용자에게 익숙한 생활 문맥으로 매일의 미션을 더 재미있게 만든다.

Mission pack 예시:

- School:
  - 등굣길 하늘색
  - 급식실 따뜻한 노랑
  - 체육복 초록
  - 야자 끝 밤색
- Travel:
  - 기차역 은색
  - 공항 새벽 블루
  - 바다 앞 유리색
  - 여행 가방 포인트 컬러
- Season:
  - 봄 벚꽃 핑크
  - 장마 유리 회색
  - 비 오는 날 우산색
  - 물웅덩이 반사색
  - 여름 편의점 민트
  - 겨울 코트 브라운
- Mood:
  - 시험 끝 해방감
  - 늦은 밤 산책
  - 친구 기다리는 시간
  - 집 가는 버스 창가

Backend/API 후보:

- `mission_packs`
  - `id`
  - `type` (`school`, `travel`, `season`, `mood`)
  - `locale`
  - `active_from`, `active_to`
  - `missions jsonb`
  - `is_premium boolean default false`
- 초기에는 static config로 두고, 베타 안정 후 remote config/table로 이동한다.

UX rules:

- 사용자가 직접 pack을 고를 수 있게 하되, 첫 추천과 최대 3회의 재추천은 오늘 날씨/시간/선택적 대략 위치와 활성 pack 문맥을 사용한다. 이후 무작위 단계에서는 모든 큐레이션 색을 같은 확률로 노출한다.
- 학교/여행 pack은 사적인 장소 노출을 유도하지 않도록 exact location을 요구하지 않는다.
- "친구와 같은 미션"은 가능하지만 랭킹은 만들지 않는다.

### Priority 5. 친구끼리 비교가 아닌 서로의 오늘 색 보기

목표: 가까운 사람과의 친밀함은 만들되, 비교와 순위를 피한다.

MVP UX:

- 사용자는 3-8명 정도의 close circle을 만든다.
- circle 화면은 feed가 아니라 `오늘 색 보드`에 가깝다.
- 각 친구 카드에는 다음만 작게 보인다:
  - color chip
  - custom color name
  - optional mood sentence
  - optional blurred/thumbnail image if explicitly shared
- 반응은 좋아요 수가 아니라 작은 color reply, stamp reply 정도로 제한한다.

Backend/API 후보:

- `circles`
  - `id`
  - `owner_id`
  - `name`
  - `created_at`
- `circle_members`
  - `circle_id`
  - `user_id`
  - `status`
  - `created_at`
- `post_visibility`
  - `post_id`
  - `visibility` (`private`, `shared_card`, `circle`)
  - `circle_id nullable`
- `color_reactions`
  - `post_id`
  - `from_user_id`
  - `reaction_type`

Safety:

- 기본값은 private.
- close circle 공유는 사용자가 명확히 켜야 한다.
- follower count, public profile, 인기순 정렬은 만들지 않는다.

### Priority 6. 사진 원본보다 색/무드 중심의 가벼운 피드

목표: SNS 피드가 아니라 "색들이 지나가는 작은 창"처럼 만들기.

MVP UX:

- public feed 대신 close-circle 또는 내 기록 중심으로 시작한다.
- card priority:
  1. color swatch
  2. color name
  3. mood sentence
  4. optional small photo/grid
- 사진은 큰 원본 프레임보다 색의 근거처럼 작게 둔다.
- 하루에 여러 장 올리는 경쟁을 만들지 않고, 하루 컬렉션 하나를 중심으로 한다.

Risks:

- 사진 피드가 커질수록 ColorWalk의 색 정체성이 흐려질 수 있다.
- feed 체류시간보다 capture/share/recap 전환을 더 중요하게 본다.

### Priority 7. 익명 집계 색 트렌드, 인기 팔레트, 리캡 생성

목표: 충분한 사용자가 모인 뒤, 개인 데이터가 아니라 익명화된 색 흐름으로 서비스의 확장성을 만든다.

Post-beta ideas:

- 오늘 서울에서 많이 수집된 색 family.
- 장마철 인기 팔레트.
- 시험기간 mood color trend.
- 계절별 ColorWalk recap gallery.
- "이번 주 한국의 색" 같은 editorial 콘텐츠.

Privacy rules:

- 개인 사진 원본은 집계에 사용하지 않는다.
- precise location은 기본 수집하지 않는다.
- 집계는 최소 threshold 이상에서만 노출한다.
- 특정 학교/동네/소수 그룹이 식별될 수 있는 단위는 피한다.

Backend 후보:

- Edge Function 또는 scheduled job으로 aggregate table 생성.
- `anonymous_color_trends`
  - `period`
  - `region_bucket`
  - `weather_bucket`
  - `color_family`
  - `count`
  - `sample_palette jsonb`
  - `created_at`

## Phased Roadmap

이 절은 성장 기능의 논리적 묶음을 보존한다. 현재 단계와 체크박스는 `docs/hueday-development-roadmap.md`에서만 관리해 두 로드맵의 상태가 갈라지지 않게 한다.

### Phase 0. Beta Stabilization

목표: 친구에게 PWA 링크를 보내도 기본 흐름이 깨지지 않는 상태.

- 카메라 품질, 3x3 capture, 저장, history image loading 안정화.
- story export/download/share 안정화.
- Supabase RLS/storage signed URL 검증 유지.
- PWA install, mobile Safari/Chrome, Android Capacitor QA.
- 디자인 QA는 430x932 기준 `.design-references`와 비교.

### Phase 1. Share Card MVP

목표: 첫 viral loop를 만든다.

- 오늘의 컬러 카드 링크.
- share-card public view.
- link revocation/expiration.
- Web Share API + copy link fallback.
- analytics event 최소화.

### Phase 2. Recap + Creative Unlocks

목표: retention과 share quality를 동시에 올린다.

- monthly recap 9:16 export.
- badge detail sheet.
- badge-unlocked story frames/stamps.
- profile color identity section.

### Phase 3. Close Friend Color Board

목표: 가까운 사람에게 자주 보이는 루프를 만든다.

- close circle.
- 서로의 오늘 색 보기.
- color/stamp reply.
- public ranking 없이 친밀한 daily signal 유지.

### Phase 4. Aggregated Color Culture

목표: ColorWalk만의 데이터 경험을 만든다.

- anonymous color trends.
- seasonal/editorial palette reports.
- popular palette packs.
- generated monthly/yearly recaps.

## Monetization Model

이 절은 Hueday 수익화의 실행 기준이다. 시장 사례와 판단 근거는 `docs/hueday-breakout-strategy.md`에서 관리하고, 실제 상품 범위·도입 순서·측정 기준은 이 절을 source of truth로 삼는다.

### Current Status

- 2026-07-23 현재 결제, 구독, 광고, 스폰서 미션은 구현되어 있지 않다.
- 버전 1은 daily mission, 촬영, 기록, history, 기본 Hueprint/Capsule/story export와 공유를 무료로 출시한다.
- 결제는 무료 버전의 실제 인플레이스 업데이트에서 데이터 보존을 확인한 뒤 첫 우선 업데이트로 진행한다. 구현·복원·entitlement·기존 데이터 불변 계약은 `docs/post-launch-monetization-and-payment-safety.md`를 따른다.
- 리텐션과 공유 루프가 검증되기 전에는 광고나 core paywall을 추가하지 않는다.
- 디지털 상품을 실제 앱에서 판매할 때는 Apple In-App Purchase와 Google Play Billing 정책을 구현 시점에 다시 확인한다.

### Monetization Principles

1. 사용자의 사진, 과거 기록, 계정 복구를 갑자기 잠그지 않는다.
2. 돈은 `더 예쁘게 만들기`, `더 오래 보존하기`, `특별한 맥락에서 함께하기`에서 번다.
3. 친구 초대와 공유처럼 성장을 만드는 행동은 무료로 둔다.
4. 배지로 획득한 보상은 유료 팩이 생겨도 실제로 쓸 수 있는 무료 creative item으로 남긴다.
5. 구독은 매달 새 가치와 운영 비용이 함께 생길 때만 도입한다. 단순 템플릿 몇 개를 구독으로 포장하지 않는다.
6. 광고를 도입하더라도 개인 일기 화면을 방해하지 않고, 사용자가 선택하는 명시적 브랜드 미션을 우선한다.

### Free Product Promise

다음은 Hueday의 무료 핵심 약속으로 유지한다.

- 매일 기본 color mission 받기.
- 1컷 진행의 안전한 저장·복구와 3x3 한 페이지 완성.
- 기본 색 이름과 짧은 journal.
- calendar/history에서 내 기록 다시 보기.
- 기본 9:16 story와 3x3 이미지 export.
- 친구가 공유한 color card 보기와 `나도 이 색 찾기` 참여.
- Color Rhythm과 누적 발견으로 획득한 기본 frame, stamp, sticker 사용.
- 기본 Hue Palette와 Hue Canvas, 기본 스테인드글라스 재질, 기본 도안, 로컬 저장과 기본 export.
- 현재 기기의 고화질 기록, 작은 클라우드 메타데이터·미리보기, 수동 `.hueday` archive 내보내기·가져오기.

### Revenue Ladder

| 단계 | 수익 모델 | 판매 가치 | 시작 조건 |
| --- | --- | --- | --- |
| Version 1 | 무료 | 결제 없음. core loop와 공유 행동 측정 | 저장 안정성과 실제 인플레이스 업데이트 보존 확인 |
| Post-launch M8M | Hueday Studio 1회 구매 | 고급 Hueprint/Capsule/Story 스타일·편집·고해상도 내보내기 후보 | 구매 가치 승인, Play Billing·복원·환불/회수·계정 귀속·업데이트 보존 완성 |
| 1 | 1회 구매 Creative Pack | 계절·여행·커플·졸업 palette, 도안, frame, typography, sticker | recap/story/Canvas의 반복 사용과 구매 의향 확인 |
| 2 | Hueday Studio 1회 구매 | 고급 Hue Canvas 재질·도안·레이어·편집·로컬 이력·고해상도 창작 export | 창작 도구 가치와 store 1회 결제 의향 확인 |
| 3 | Hueday Cloud 구독 | 5GB 고화질 백업, 자동 기기 복구, 고화질 다시 받기, 30일 휴지통 | 복구 신뢰와 사용자당 storage/egress 비용 확인 |
| 4 | Physical Memory | 월간 엽서, 미니 컬러 북, 연간 Hueprint book | digital recap 저장·공유 수요와 인쇄 마진 확인 |
| 5 | B2B Mission Pack | 미술관·카페·축제·캠퍼스의 기간 한정 color walk | 소규모 커뮤니티 pilot의 참여율과 재계약 의향 확인 |
| 6 | 선택형 Sponsorship | 명확히 표시된 브랜드 color mission과 한정 creative item | 충분한 활성 사용자, 브랜드 안전, 미성년자 보호 기준 확보 |

### First Products To Test

#### 1. One-Time Creative Pack

- 가장 먼저 시험할 유료 상품이다.
- 서버 기능 없이 기존 story template/sticker 구조를 확장할 수 있어 구현·운영 비용이 작다.
- 예시: 벚꽃 산책, 장마의 색, 여름 여행, 졸업 앨범, 둘만의 팔레트.
- 구매하지 않아도 기본 export와 배지 보상은 온전히 사용할 수 있어야 한다.
- 첫 가격 탐색 범위는 1,500~3,900원이지만 확정 가격이 아니라 구매 의향 인터뷰용 가설이다.

#### 2. Hueday Studio — 1회 구매

- 가격 가설은 19,900원이며 초기 반응 확인용 출시 프로모션 14,900원을 검토할 수 있다.
- 서버 반복 비용이 거의 없는 기기 내 고급 창작 도구를 묶는다.
- 후보 범위: 고급 유리 재질, 추가 도안, 레이어, 선택·복제·일괄 재채색, 로컬 고급 편집 이력, 고해상도 Hue Canvas/Hueprint/Story export.
- 구매 당시의 Studio 도구와 이후 핵심 편집 도구 개선은 계속 사용할 수 있게 한다.
- 무기한 클라우드 저장, 요청당 비용이 드는 AI, 실물 상품, 외부 라이선스 협업, 모든 미래 시즌 팩을 포함한다고 약속하지 않는다.

#### 3. Hueday Cloud — 구독

- 월 1,500원, 연간 출시 가설 9,900원으로 시작하고 가치가 확인된 뒤 정상가 12,000원을 검토한다.
- 5GB 고화질 백업, Wi-Fi 자동 백업, 기기 간 자동 복구, 클라우드 고화질 다시 받기, 30일 휴지통, 저장 공간 표시를 제공한다.
- 창작 팩을 억지로 끼워 월 가격을 높이지 않는다.
- 반복 storage/egress/복구 운영 비용이 있으므로 평생 이용권으로 판매하지 않는다.
- 해지 시 새 백업을 멈추되 유예 기간·export를 제공하고, 작은 메타데이터·미리보기·로컬 기록을 즉시 잠그거나 삭제하지 않는다.
- 판매 전에 데이터 export, account deletion, 복구 정책, 비용 측정, 업로드 실패 복구를 완성한다.

#### 4. Physical Memory

- 디지털 기록이 충분히 쌓인 사용자에게만 자연스럽게 제안한다.
- 월말 recap을 엽서나 접이식 미니북으로 주문하는 가장 작은 pilot부터 시작한다.
- 인쇄·배송·재제작·환불 비용을 포함한 건당 공헌이익이 확인되기 전 자동 주문 시스템을 만들지 않는다.

#### 5. B2B Color Walk

- 광고 배너 대신 특정 공간을 직접 탐색하게 만드는 sponsored mission을 판매한다.
- 예시: 미술관 전시 팔레트, 카페 시즌 컬러, 지역 축제 color hunt, 대학 축제 공동 Hueprint.
- 위치 추적이나 사용자 명단 판매가 아니라 mission 제작, 한정 디자인, 익명 집계 결과에 과금한다.
- 익명 집계는 작은 그룹이 식별되지 않는 최소 표본과 명시적 개인정보 기준을 충족해야 한다.

### Launch Gates

유료 기능은 버전 1의 실제 인플레이스 업데이트 보존을 확인한 뒤, 아래 증거와 안전 조건이 생겼을 때 연다.

- 핵심 저장/복구 실패가 베타 운영을 방해하지 않는다.
- 사용자가 한 달 동안 반복해서 기록하고 recap 또는 story를 다시 만든다.
- 무료 공유가 신규 사용자의 첫 capture로 연결된다.
- 최소 10명 이상의 목표 사용자가 구체적인 상품과 가격을 보고 구매 의향 또는 거절 이유를 말해준다.
- 상품별 서버·결제·스토리지·CS 비용을 계산할 수 있다.
- store billing, 환불, 개인정보, 계정 삭제 정책을 구현 범위에 포함했다.

### Monetization Metrics

- paywall view → purchase start → purchase complete conversion.
- pack별 구매율, 실제 사용률, 30일 후 재사용률.
- trial start, trial cancellation timing, paid renewal, refund rate.
- ARPPU와 결제 수수료·스토리지·인쇄/배송을 뺀 contribution margin.
- 유료 기능 도입 전후의 capture, save, share, D7/D30 변화.
- 무료 사용자와 유료 사용자 모두의 기록 export·account deletion 성공률.
- B2B pilot의 참여율, mission completion, 재계약 의향.

매출이 늘어도 capture/save/retention이 악화되면 성공으로 보지 않는다. Hueday의 수익화는 core habit 위에 붙어야 하며 core habit을 대신해서는 안 된다.

## Data And Security Checklist

새 성장 기능을 구현할 때 반드시 확인한다.

- Browser code에는 Supabase publishable key만 사용한다.
- service role key는 Supabase Edge Function 또는 local admin tooling에만 둔다.
- RLS는 owner 기준이며, close-sharing 기능은 별도 visibility 모델을 둔다.
- 공유 링크는 post owner의 다른 records를 노출하지 않는다.
- signed URL 만료 시간을 짧게 둔다.
- exact location은 opt-in이며, 공유/export에는 기본 포함하지 않는다.
- 미성년 사용자 문맥에서 public discovery, public DM, ranking, location-based exposure를 조심한다.
- `npm run verify:supabase`가 새 테이블/정책을 검증하도록 확장한다.

## Metrics

기능을 추가할 때는 최소한 어떤 지표를 볼지 함께 정의한다.

### 수집 원칙과 지표 정의

- 전체 클릭 스트림은 수집하지 않는다. 제품 결정을 바꿀 수 있는 화면 조회와 주요 CTA만 enum allowlist로 기록한다.
- `screen_viewed`: 허용된 화면 이름별 진입 횟수와 사용자·현지 날짜 기준 고유 조회를 계산한다. 사진·일기 제목 같은 사용자 콘텐츠는 payload에 넣지 않는다.
- `session_summary`: 앱이 foreground였던 활성 초를 한 세션당 한 번 요약한다. background 시간은 체류시간에 포함하지 않고, 비정상 종료로 누락될 수 있음을 지표 설명에 남긴다.
- `primary_cta_clicked`: 촬영 시작, 사진 확정, 부분 저장, 완성 저장, Story export/share, M4의 `mission_pack_selected_indoor`/`mission_pack_selected_commute`/`mission_pack_selected_rainy_window`/`mission_pack_cleared`처럼 명시된 핵심 CTA만 기록한다. 모든 버튼과 좌표를 수집하지 않는다. M4는 이 필드에 새 `mission_pack_id` 같은 payload key를 추가하지 않고 기존 `cta` enum 값만 확장했다.
- M4의 `screen_viewed`는 `mission_pack_collection_indoor`/`mission_pack_collection_commute`/`mission_pack_collection_rainy_window`를 추가한다. 추천 배지 노출, lazy finalization, 사진 내용은 별도 이벤트로 수집하지 않는다.
- 재방문은 첫 유효 기록일을 cohort 기준으로 한 D1/D7/D30 활성 사용자 비율로 계산한다. 같은 날 여러 실행은 한 번으로 중복 제거한다.
- 조회수는 맥락을 구분한다. 앱 화면 조회와 향후 공개 공유 링크 열람을 하나의 숫자로 합치지 않는다. 공유 링크가 생길 때는 IP·기기 fingerprint 없이 일별 익명 중복 제거 기준을 별도로 승인한다.
- 모든 비율은 분자·분모·기간·플랫폼·이벤트 schema version을 함께 표시한다. 표본이 작으면 사용자 수를 같이 표시하고 성급한 인과 결론을 내리지 않는다.

### 운영 열람 순서

1. 베타와 출시 직후에는 Supabase의 versioned 집계 SQL과 CSV로 주 단위 점검한다.
2. 같은 쿼리를 반복 실행하는 운영 비용이 확인되면 aggregate-only Edge Function과 관리자 전용 웹 화면을 만든다.
3. 관리자 화면은 funnel, D1/D7/D30, active time, 핵심 CTA, 저장/업로드 오류, 플랫폼·앱 버전 분포만 제공한다.
4. 실시간 BI, 외부 analytics SDK, 데이터 웨어하우스, 모든 클릭 수집은 현재 범위에서 제외한다.

Activation:

- signup/login 완료율.
- 첫 카메라 허용률.
- 첫 사진 기록 안전 저장률과 같은 날 재진입률.
- 첫 3x3 한 페이지 완료율.
- 첫 journal save 완료율.

Retention:

- D1/D7/D30 return.
- weekly saved days.
- current streak보다 saved post frequency를 우선 본다.
- monthly recap open rate.

Sharing:

- story export rate.
- native share/download rate.
- color card link creation rate.
- share link open rate.
- share link -> new capture conversion.

Quality:

- camera permission denial rate.
- image compression failure.
- Supabase upload/save failure.
- storage signed URL failure.
- PWA install issues.

Design:

- 430x932 visual QA pass/fail.
- story export visual QA.
- template/sticker usage rate.
- share preview readability in actual Instagram/KakaoTalk contexts.

## Future-Codex Feature Contract

기능을 추가하기 전 다음 질문에 답한다.

1. 이 기능은 핵심 루프 중 무엇을 강화하는가?
   - daily mission
   - 3x3 collection
   - story sharing
   - color identity
   - close friend loop
   - monthly recap
   - found-color creation identity
   - everyday mission packs
2. 사용자에게 더 많은 부담을 주는가, 더 쉽게 기록하게 하는가?
3. 사진 원본 중심이 아니라 색/무드 중심을 유지하는가?
4. 필요한 persisted data는 무엇이고, RLS는 어떻게 보호하는가?
5. 공유되는 정보와 private 정보가 명확히 분리되는가?
6. 430x932 모바일 화면에서 목업 품질을 해치지 않는가?
7. story export나 profile/reward surface에 실제로 쓸 수 있는가?
8. `docs/hueday-breakout-strategy.md`, `docs/colorwalk-reward-system.md`, `plan.md`, helper/config 문서가 함께 갱신되어야 하는가?
9. `docs/hueday-product-blueprint.md`의 전체 약속과 현재 마스터 단계에 맞는가?
10. 검증 명령은 무엇인가?
   - `npm run lint`
   - `npm test -- --run`
   - `npm run build`
   - `npm run verify:supabase`
   - browser QA
   - Android/PWA QA when needed

## What Not To Build Yet

베타 전 또는 초기 베타에서 피한다.

- 광고 monetization.
- public ranking, leaderboard, streak competition.
- follower count 중심 social graph.
- 사진 원본 중심 infinite feed.
- exact location 기반 공개 탐색.
- 무거운 전문 편집기 수준의 story editor.
- direct Instagram native integration을 필수 경로로 만드는 것.
- premium-only core loop.

## Implementation Seeds

나중에 기능 추가를 시작할 때 우선순위별 첫 작업 단위는 다음이 좋다.

1. Color Hunt contract:
   - 현지 날짜별 새 색, 문맥 추천 1회와 재추천 3회, 이후 전체 색 균등 무작위, 첫 사진 잠금, 1–7장 일일 기록, 8장 완료 규칙을 코드·카피에 일치.
   - 사진 색 추출·매칭률 UI 제거.
2. Everyday mission pack config:
   - 집/학교/통학/카페/비 오는 날/날씨/시간/컬러 산책 정적 pack.
   - remote DB pack은 운영 필요가 생긴 뒤 이동.
3. Hue Canvas prototype and reward loop:
   - 빈/Palette/자유 작업/도안 크기/완성·export를 같은 데이터로 시안화하고 실제 Canvas 2D로 재현.
   - 시각·조작 승인 뒤 sparse recipe 저장, 발견 횟수 배치량, 리믹스, 실제 unlock 순으로 확장.
4. Monthly recap client MVP:
   - 현재 월 posts와 저장 작품을 가져와 9:16 recap과 Hueprint 표지 생성.
   - 서버 캐시는 나중에.
5. `shared_cards` MVP:
   - post에서 제한된 public card를 만들고 링크로 공유.
   - Edge Function 또는 public-safe view로 최소 필드만 반환.
   - link revoke/expire 포함.
6. Close friend today color:
   - public feed보다 circle/private board로 작게 시작.
   - friend comparison이 아니라 "서로의 오늘 색 보기"만 구현.

이 문서는 기능이 바뀔 때마다 실제 코드와 대조해 갱신한다. 수익화 상품·도입 조건·측정 기준은 이 문서의 `Monetization Model`에서 관리하고, 시장 근거·Setlog 분석·iOS 출시 경로·냉정한 제품 진단은 `docs/hueday-breakout-strategy.md`에서 관리한다. ColorWalk의 성장은 사진 SNS를 따라가는 것이 아니라, 사용자가 현실에서 발견한 색을 자기만의 정체성으로 쌓아가게 만드는 방향이어야 한다.
