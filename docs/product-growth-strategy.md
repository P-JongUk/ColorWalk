# Hueday Product Growth Strategy

마지막 코드·시장 대조: 2026-07-22 KST
상위 전략과 현재 구현 진단: `docs/hueday-breakout-strategy.md`

이 문서는 Hueday가 베타 이후 어떤 성장 루프를 키울지 정리한 living document다. 새 기능을 추가할 때는 단순히 유행 앱을 따라 만들지 말고, 아래의 고유 루프를 강화하는지 먼저 확인한다.

> 오늘의 색 미션 -> 현실에서 색 찾기 -> 3x3 컬렉션 -> 스토리 공유 -> 내 색 정체성 축적

## Product North Star

Hueday는 사진 SNS가 아니라, 현실에서 발견한 색을 가볍게 수집하고 자기만의 무드 정체성으로 쌓아가는 color diary다.

- Main target: 한국 베타 사용자, 특히 10대와 20대 초반.
- Core emotion: 부담 없는 산책, 감성적인 기록, 친구에게 보여주고 싶은 오늘의 색.
- Core habit: 매일 완벽한 글을 쓰는 것이 아니라, 오늘의 색을 발견하고 3x3 컬렉션을 채우는 것.
- Core sharing: 얼굴/원본 사진보다 색, 무드, 작은 이야기 중심의 공유.
- Core safety: 공개 랭킹, 비교 피드, 압박형 streak를 피하고 가까운 사람끼리의 낮은 부담을 유지한다.

## Reference Principles

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

1. 앱이 날씨/시간/계절에 맞는 색 미션을 보여준다.
2. 사용자는 주변에서 비슷한 무드의 색을 찾는다.
3. 카메라 또는 앨범으로 3x3 컬렉션을 채운다.
4. 짧은 컬러 이름과 mood sentence를 남긴다.
5. 저장된 기록이 히스토리, 프로필, 배지, 리캡의 원천이 된다.

구현 기준:

- `posts.local_date`와 저장된 grid/photo metadata를 source of truth로 둔다.
- daily mission은 랜덤만으로 만들지 말고 날씨/시간/계절 문맥을 유지한다.
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

1. 하루 기록은 3x3 컬렉션으로 완성감을 준다.
2. 3일/7일/14일/30일 milestone은 story frame, stamp, sticker 같은 창작 보상을 연다.
3. 한 달이 끝나면 월간 컬러 리캡이 생성된다.
4. 프로필에는 사용자의 색 정체성이 축적된다.

구현 기준:

- 배지는 점수나 순위가 아니라 creative unlock이어야 한다.
- unlocked item은 스토리/프로필/리캡에서 실제로 쓸 수 있어야 한다.
- 자세한 배지 원칙은 `docs/colorwalk-reward-system.md`를 따른다.

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

### Priority 3. 배지로 스토리 프레임/스탬프 해금

목표: streak가 숫자 압박이 아니라 예쁜 결과물을 열어주는 이유가 되게 한다.

MVP UX:

- 3일: tiny stamp / empty grid filler 1종.
- 7일: weekly seal / soft story detail 1종.
- 14일: modern frame / richer color-name label 1종.
- 30일: signature clover passport stamp / monthly recap frame 1종.
- 스토리 편집기에서 잠금/해금 상태를 자연스럽게 보여준다.
- 잠긴 아이템은 과도하게 아쉽게 보이지 않게 하고, "3일 색길을 채우면 열려요" 정도의 부드러운 문구를 사용한다.

Implementation rule:

- unlock state는 `posts.local_date`, grid completion count, future saved activity metadata에서 계산한다.
- asset id가 바뀌어도 milestone meaning은 유지한다.
- 배지 보상 수정 시 `docs/colorwalk-reward-system.md`와 `src/lib/collection.ts`를 함께 갱신한다.

Success metrics:

- milestone 도달률.
- unlocked asset 사용률.
- badge detail sheet -> story export 전환률.

### Priority 4. 학교/여행/계절별 컬러 미션

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

- 사용자가 직접 pack을 고를 수 있게 하되, 기본 추천은 오늘 날씨/시간에 맞춘다.
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

- 2026-07-22 현재 결제, 구독, 광고, 스폰서 미션은 구현되어 있지 않다.
- 베타에서는 daily mission, 촬영, 기록, history, 기본 story export와 공유를 무료로 유지한다.
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
- 1컷 기록과 3x3 컬렉션 완성.
- 기본 색 이름과 짧은 journal.
- calendar/history에서 내 기록 다시 보기.
- 기본 9:16 story와 3x3 이미지 export.
- 친구가 공유한 color card 보기와 `나도 이 색 찾기` 참여.
- streak/milestone으로 획득한 기본 frame, stamp, sticker 사용.

### Revenue Ladder

| 단계 | 수익 모델 | 판매 가치 | 시작 조건 |
| --- | --- | --- | --- |
| Beta | 무료 | 결제 없음. core loop와 공유 행동 측정 | 저장 안정성과 D1/D7 사용 패턴 확인 |
| 1 | 1회 구매 Creative Pack | 계절·여행·커플·졸업 palette, premium frame, typography, sticker | recap/story export의 반복 사용과 구매 의향 확인 |
| 2 | Hueday Plus | 장기 원본 백업, 기기 간 복구, 연간 Hueprint, 고급 export, 정기 premium pack | 매달 제공할 가치와 사용자당 저장 비용 확인 |
| 3 | Physical Memory | 월간 엽서, 미니 컬러 북, 연간 Hueprint book | digital recap 저장·공유 수요와 인쇄 마진 확인 |
| 4 | B2B Mission Pack | 미술관·카페·축제·캠퍼스의 기간 한정 color walk | 소규모 커뮤니티 pilot의 참여율과 재계약 의향 확인 |
| 5 | 선택형 Sponsorship | 명확히 표시된 브랜드 color mission과 한정 creative item | 충분한 활성 사용자, 브랜드 안전, 미성년자 보호 기준 확보 |

### First Products To Test

#### 1. One-Time Creative Pack

- 가장 먼저 시험할 유료 상품이다.
- 서버 기능 없이 기존 story template/sticker 구조를 확장할 수 있어 구현·운영 비용이 작다.
- 예시: 벚꽃 산책, 장마의 색, 여름 여행, 졸업 앨범, 둘만의 팔레트.
- 구매하지 않아도 기본 export와 배지 보상은 온전히 사용할 수 있어야 한다.
- 첫 가격 탐색 범위는 1,500~4,900원이지만 확정 가격이 아니라 구매 의향 인터뷰용 가설이다.

#### 2. Hueday Plus

- 월 구독은 `매달 달라지는 결과`와 `지속적인 저장 비용`이 있을 때만 성립한다.
- 후보 가치: 원본 장기 백업, multi-device restore, 월간·연간 Hueprint, 고해상도/무워터마크 export, 매월 새 creative pack.
- 월 3,900원 또는 연 29,000원은 초기 가격 가설일 뿐이며, 무료 사용자의 기록·기본 공유를 제한하는 근거로 사용하지 않는다.
- 장기 백업을 판매하기 전 데이터 export, account deletion, 복구 정책을 먼저 완성한다.

#### 3. Physical Memory

- 디지털 기록이 충분히 쌓인 사용자에게만 자연스럽게 제안한다.
- 월말 recap을 엽서나 접이식 미니북으로 주문하는 가장 작은 pilot부터 시작한다.
- 인쇄·배송·재제작·환불 비용을 포함한 건당 공헌이익이 확인되기 전 자동 주문 시스템을 만들지 않는다.

#### 4. B2B Color Walk

- 광고 배너 대신 특정 공간을 직접 탐색하게 만드는 sponsored mission을 판매한다.
- 예시: 미술관 전시 팔레트, 카페 시즌 컬러, 지역 축제 color hunt, 대학 축제 공동 Hueprint.
- 위치 추적이나 사용자 명단 판매가 아니라 mission 제작, 한정 디자인, 익명 집계 결과에 과금한다.
- 익명 집계는 작은 그룹이 식별되지 않는 최소 표본과 명시적 개인정보 기준을 충족해야 한다.

### Launch Gates

유료 기능은 일정 날짜가 아니라 아래 증거가 생겼을 때 연다.

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

Activation:

- signup/login 완료율.
- 첫 카메라 허용률.
- 첫 3x3 컬렉션 완료율.
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
2. 사용자에게 더 많은 부담을 주는가, 더 쉽게 기록하게 하는가?
3. 사진 원본 중심이 아니라 색/무드 중심을 유지하는가?
4. 필요한 persisted data는 무엇이고, RLS는 어떻게 보호하는가?
5. 공유되는 정보와 private 정보가 명확히 분리되는가?
6. 430x932 모바일 화면에서 목업 품질을 해치지 않는가?
7. story export나 profile/reward surface에 실제로 쓸 수 있는가?
8. `docs/hueday-breakout-strategy.md`, `docs/colorwalk-reward-system.md`, `plan.md`, helper/config 문서가 함께 갱신되어야 하는가?
9. 검증 명령은 무엇인가?
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

1. `shared_cards` MVP:
   - post에서 제한된 public card를 만들고 링크로 공유.
   - Edge Function 또는 public-safe view로 최소 필드만 반환.
   - link revoke/expire 포함.
2. Monthly recap client MVP:
   - 현재 월 posts를 가져와 9:16 recap export.
   - 서버 캐시는 나중에.
3. Badge unlock usage:
   - 이미 계산된 badge state를 story frame/stamp 선택지와 연결.
   - 잠금 아이템 UX를 부드럽게 표현.
4. Mission pack config:
   - static school/travel/season pack부터 추가.
   - remote DB pack은 운영 필요가 생긴 뒤 이동.
5. Close friend today color:
   - public feed보다 circle/private board로 작게 시작.
   - friend comparison이 아니라 "서로의 오늘 색 보기"만 구현.

이 문서는 기능이 바뀔 때마다 실제 코드와 대조해 갱신한다. 수익화 상품·도입 조건·측정 기준은 이 문서의 `Monetization Model`에서 관리하고, 시장 근거·Setlog 분석·iOS 출시 경로·냉정한 제품 진단은 `docs/hueday-breakout-strategy.md`에서 관리한다. ColorWalk의 성장은 사진 SNS를 따라가는 것이 아니라, 사용자가 현실에서 발견한 색을 자기만의 정체성으로 쌓아가게 만드는 방향이어야 한다.
