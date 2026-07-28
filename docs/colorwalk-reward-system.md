# Hueday Color Rhythm·Reward System Direction

> **최신 보상 우선순위(2026-07-26):** 첫 출시의 주 보상은 완성 3×3이 자동으로 만드는 Living Hue Deck 봉인 카드와 Color Volume 누적이다. 1/3/5장은 가벼운 시각 성장, 8장은 주요 완성 단위이며 어느 단계도 streak·벌점·소모 재화가 아니다. 출시 후 Hue Canvas에서는 완성 페이지 1개당 중앙 미션 색 8칸의 작품별 비소모성 사용량을 제공한다. Hue Drop 참여 보상은 첫 소셜 업데이트 검증 전에는 만들지 않는다.

## 출시 보상 계약 정렬 (2026-07-26)

| 행동 | 즉시 결과 | 누적 결과 | 하지 않는 것 |
| --- | --- | --- | --- |
| 첫 사진 | Deck 씨앗 카드 | 오늘 기록을 이어갈 이유 | 당일 실패/점수/연속일 계산 |
| 3·5번째 사진 | 카드 프레임·질감 성장 | 개인 색 아카이브의 풍성함 | 랜덤 재화·희귀도 추첨 |
| 8번째 사진 | 유리 봉인 완성 카드 | Color Volume, 완료 페이지 배지, Hueprint 원본 | 보상 회수·다음날 숙제 |
| 같은 색의 또 다른 완성 | 새 날짜 카드 유지 | 같은 색 Volume 확장 | 중복 색 폐기/소모 |
| 주간 회고 열기·Story 내보내기 | 내 기록의 재발견 | 자연스러운 개인 공유 | 강제 초대/친구 초대 보상 |

향후 Studio/팩은 기본 기록의 가치를 높이는 선택형 스타일·도구여야 한다. 이미 찾은 색, 무료 카드, 기본 내보내기, 누적 배지를 결제로 잠그지 않는다.

전체 제품 기준: `docs/hueday-product-blueprint.md`
발견 색 대표 콘텐츠 기준: `docs/discovered-color-content-strategy.md`
현재 구현 순서: `docs/hueday-development-roadmap.md`

## Product Principle

Hueday의 보상은 연속 일수 점수, 순위, 압박 루프로 취급하지 않는다. 유연한 Color Rhythm과 누적 발견이 실제 색 재료와 창작 옵션으로 이어지는 시스템이어야 한다.

> 보상은 사용자가 발견한 색을 작품 재료로 조합하고, 다시 편집하고, 원할 때 공유하게 해 주는 실제 열쇠다.

This keeps Hueday aligned with the core product direction: private, emotional, collectible, camera-first, and share-worthy without becoming competitive.

## Color Hunt Completion Contract

- 미션 색은 3x3 중앙에 고정하고, 사용자는 일상에서 비슷한 색을 찾아 주변 8칸을 채운다.
- 사용자 기기의 현지 날짜마다 새 미션 색을 선택한다. 첫 추천 뒤 `다른 색`은 최대 6회이며 1~3회는 맥락 추천, 4~6회는 당일 이미 본 색을 제외한 전체 목록 균등 랜덤이다.
- Story의 중앙 색 이름·HEX 표시 여부는 표현 선택일 뿐 보상·해금·발견 색 수를 바꾸지 않는다. 이름을 숨겨도 사용 가능한 Story 프레임과 기존 보상은 동일하다.
- 첫 사진 사용을 확정하면 그날의 미션 색을 잠근다. 첫 사진은 안전하게 보존되는 `오늘의 색 발견`이자 유효한 일일 기록이지만 3x3 페이지 완료로 계산하지 않는다.
- 2~7장도 그날 모은 색 장면으로 보존하며 실패나 미완성으로 부르지 않는다.
- 8장을 모두 채운 완성 3x3을 오늘의 미션과 한 페이지 완료로 계산한다.
- 주요 보상 축은 완성 3x3이다. 비소모성 색 재료, Hueprint 반영, 창작 재질·구도, 완성형 공유 프레임·결과물을 여기에 연결한다.
- 현지 자정이 지나면 1~7장 기록도 당시 사진 수로 닫고 다음 날은 새 색을 선택한다. 닫힌 기록을 오늘 미션으로 이어 채우지 않는다.
- 1~7장 때문에 보상을 회수하거나 연속 일수를 초기화하지 않으며 실패·죄책감 카피를 사용하지 않는다.
- 첫 사진 기록에는 칸 채움, 저장 확인, 부드러운 촉각·시각 피드백을 줄 수 있지만 주요 아이템 해금처럼 3×3 완료로 오해할 보상은 주지 않는다.

## Why Badges Matter

보상의 가치는 연속 숫자가 아니라 반복한 색 발견이 눈에 보이는 정체성, 공간, 창작 자산으로 바뀌는 데 있다.

Good badge rewards should make users think:

- "I collected this."
- "This feels like my color passport."
- "I can make a prettier story now."
- "I want to keep filling my private collection."

Avoid rewards that make users think:

- "I am falling behind."
- "Other people are better than me."
- "I must open the app only to protect a number."
- "This is a cheap game mechanic."

## Color Rhythm and Progress Tracks

### 주간 색 리듬

- 사용자가 한 주 2일·3일·5일 중 목표를 선택한다.
- 연속일이 아니라 해당 주 안에 기록한 서로 다른 날짜 수를 본다.
- 목표 미달이어도 `이번 주 발견 2개`처럼 사실만 보여 주고 실패·파손 문구를 쓰지 않는다.
- 휴식 후에도 평생 누적과 열린 보상은 유지된다.

### 누적 진행 축

| 진행 축 | 예시 | 보상 방향 |
| --- | --- | --- |
| 오늘의 색 기록 | 현지 날짜에 사진 1장 이상 | 달력·기록함 보존, 저장 확인, 진행 피드백 |
| 완성한 3x3 | 1·3·5·10페이지 등 | 해당 미션 색의 Hue Canvas 배치량·기본 도안/도구 |
| 미션 팩 | M4에서 저장된 명시적 pack ID(`indoor-hunt`/`commute-hunt`/`rainy-window`) | 최대 3개 상황 컬렉션(종료 기록 수·8장 완성 수만 표시). Pack 전용 배지·해금 아이템·별도 reward economy는 만들지 않았다. 주요 보상은 기존 8장 Deck 카드·Color Volume·완성 페이지 배지를 그대로 사용한다. |
| 주간 색 리듬 | 선택한 2/3/5일 목표 | 재질·장식·작은 공간 효과 |
| 월간 참여 | 한 달 안의 유연한 참여 | Hueprint 포스터·벽지·리캡 프레임 |
| Color Relay | 친구와 같은 색 발견 | 엽서·짝 컬러 타일 |

출시 전 실사용자가 없으므로 기존 연속 기록 계산을 과도기 호환으로 유지하지 않는다. 3·7·14·30 배지는 완료한 3x3 페이지 수를 기준으로 즉시 전환하며, 테스트 계정과 데모 데이터는 새 기준으로 다시 시드할 수 있다.

## Badge Utility Model

사용자가 보상을 얻으면 앱은 `지금 무엇을 할 수 있는가?`에 즉시 답해야 한다. 각 보상은 최소 하나의 실제 사용 표면을 연다.

- Story/export surface: filler pattern set, frame detail, simple title stamp, or recap layout.
- Profile: passport stamp, identity label, collected-period badge, or favorite color mark.
- History detail: period palette, representative photos, and a shortcut to make a story from that badge.
- Monthly recap: a generated 9:16 card that uses the unlocked badge art as a seal or frame.
- Found-color creation: 발견 색 재료, 새로운 재질·구도, Hueprint 표지 또는 Relay Duet Print.

Do not ship a badge that only changes a locked/unlocked icon. The reward can be small, but it should be usable, visible, and emotionally connected to the user's saved colors.

## Reward System Maintenance Contract

This reward system should move with the product whenever the core capture, story, profile, or monetization feature changes. Do not treat the current streak UI, monthly color shelf, story templates, or sticker IDs as the permanent system.

The permanent rule is:

> 반복한 일상 속 색 발견은 더 개인적이고 예쁘며 공유 가능한 색 조합·작품·기억 방식을 열어야 한다.

When a feature changes, update rewards by preserving these relationships:

- `habit milestone -> creative unlock`
- `partial color seed -> resumable progress without completion reward`
- `completed 3x3 -> primary creative unlock`
- `saved completed mission color -> Hue Palette count and Canvas tile budget`
- `saved posts -> source of truth`
- `collected colors/photos -> shareable memory`
- `free earned reward -> genuinely useful creative item`

Examples:

- A first-photo seed may receive a saved-state mark or gentle progress feedback, but not the main reward reserved for a completed page.
- Completed 3x3 pages should increase the matching Hue Canvas color budget and may unlock grid frames, recap layouts, or other meaningful creative assets.
- The primary reward should be immediately usable in the approved found-color content, with story/profile art as a secondary use. Hue Room is a deferred post-launch hypothesis, not a launch reward target.
- If the monthly shelf is removed, badge detail sheets should still show the relevant period palette/photos and offer a story-making path.
- If story template names or assets change, keep the milestone meaning stable and remap each milestone to the nearest new creative asset.
- If monetization adds paid packs later, earned badge rewards should remain useful free items, not previews that immediately feel locked or inferior.
- If a feature is removed, migrate the reward to the nearest surviving surface instead of removing the user's reason to care.

Remapping examples:

| Product change | Keep the badge valuable by moving the reward to |
| --- | --- |
| Story templates are paused or redesigned | New simple export frame layers, grid filler sets, or recap layouts |
| Sticker packs are paused or replaced | Equivalent ColorWalk-native marks, seals, or filler assets at the same milestones |
| Profile is redesigned | Passport stamp row, identity label, or collected-period badge section |
| Monthly color shelf is removed | Badge detail sheet, history filter, or monthly recap story |
| Travel mode is added | Route/map stamp, trip story frame, or travel-color recap |
| Paid template packs are added | Free earned badge templates that still feel complete, plus paid extras as optional expansion |

Implementation rule:

- Derive unlock state from persisted user activity, preferably `posts.local_date` plus future post metadata such as grid completion count.
- The current post/draft model does not yet distinguish a resumable color seed from a completed page. Add that distinction in the M1 implementation instead of weakening the approved product meaning to match current code.
- Keep the reward mapping in one helper/config layer so design assets can be renamed without rewriting the product loop.
- When changing capture, story, profile, or monetization features, update this document and the reward mapping in the same PR/commit.
- Current helper/config location: `src/lib/collection.ts`. Keep the badge reward labels and unlock conditions aligned with this document.
- Future helper/config should support multiple progress tracks without hard-coding every rule into UI components.

## Feature Change Checklist

Before shipping a change that touches camera, journal, story export, profile, history, templates, stickers, or monetization, answer these questions in the PR/commit notes:

- Does each milestone still unlock something the user can see, place, recolor, or use?
- Is the unlock based on saved posts rather than a fragile local counter?
- Can the reward help the user make a better story, recap, profile stamp, or memory card?
- Are free earned rewards still desirable after adding premium packs?
- Did this document, the Hueday roadmap, found-color strategy, `plan.md`, and the reward helper/config stay in sync?

## Reward Types

### 1. Hue Canvas Colors and Creative Options

발견 색을 직접 써 보는 창작 자산을 가장 강한 장기 보상으로 사용한다.

- 완성된 3x3의 저장된 미션 색이 원본 기록과 연결된 Hue Palette 색이 되고 해당 색의 작품별 배치 가능량이 1 늘어난다.
- 색은 영구 소모하지 않는다. 지우거나 바꾸면 작품 내 사용량이 돌아오며 여러 Canvas·Hueprint·Story 결과물에 반복 사용한다.
- 새 색을 얻으면 과거 작품의 한 색을 교체해 리믹스할 수 있다.
- 사진 1장 이상은 그날의 색 기록으로 남고, 완성 3x3·미션 팩·월간 참여가 Canvas 색 수량·도안·재질·도구·표지 같은 실제 옵션을 연다.
- 접속하지 않아도 색, 작품, 열린 보상은 줄거나 망가지지 않는다.

세부 후보·승인 게이트는 `docs/discovered-color-content-strategy.md`를 따른다.

### 2. Story Stickers

Stickers are the highest-ROI badge reward because they connect habit retention to sharing.

Examples:

- 3 days: tiny sparkle, seed, "today color", small crayon dot
- 7 days: "color walk week", soft stamp, hand-drawn ribbon
- 14 days: passport stamp, ticket border, swatch label
- 30 days: ColorWalk clover sticker, special frame corner, monthly seal

When sticker packs change, keep this rule:

> Earned stickers should feel like ColorWalk-native mementos, not generic emoji chips.

### 3. Story Templates

Badge rewards can unlock a small number of story template variations without making the app feel paywalled.

Recommended beta mapping:

- 7 days unlocks one soft/mongle template detail.
- 14 days unlocks one polaroid or ticket variant.
- 30 days unlocks one passport/newspaper/monthly recap style.

Future monetization can add paid packs, but earned badge templates should remain available as a goodwill loop.

### 4. Color Passport Stamps

Badges should appear like passport stamps or collected seals on the home/profile surfaces.

Tap behavior can evolve, but the preferred behavior is:

- Tapping a badge opens a small badge detail sheet.
- The sheet shows the milestone period, collected colors, and representative photos if available.
- The sheet offers "make story from this badge" when enough post data exists.

This makes the badge useful even if the monthly color shelf is removed or redesigned later.

### 5. Identity Names and Hue Chapters

이름은 승패형 업적보다 부드러운 정체성 챕터처럼 느껴져야 한다. 최종 명칭과 임계값은 사용자 카피 검증 뒤 확정한다.

Candidate Korean labels:

- 3 days: 작은 산책가
- 7 days: 색 수집가
- 14 days: 무드 큐레이터
- 30 days: Color Walker

Candidate English labels:

- 3 days: Tiny Walker
- 7 days: Color Collector
- 14 days: Mood Curator
- 30 days: Color Walker

## UX Rules

- Do not add public ranking, leaderboard, feed pressure, or friend comparison for badge rewards.
- Do not punish missed days or weeks with harsh copy, broken-chain visuals, reward loss, or a sick/withering room.
- Prefer `새 아이템이 열렸어요`, `이번 주 색 발견 2/3`, `새 색이 기다리고 있어요` over `streak broken`.
- Let the user recover emotionally: missed streak states should suggest starting a new color path, not failure.
- Keep rewards visually useful in the story editor and profile, not only decorative on the home screen.
- Badge reward state should be derived from saved posts whenever possible, not from an easily corrupted local-only counter.

## Implementation Notes

M1의 3·7·14·30 배지는 `local_date`별 8장 완성 페이지 수만으로 계산한다. 연속 기록, 그 손실, 또는 일별 색 정확도는 보상 입력이 아니다.

Current beta implementation:

- `getCompletedGridCount(posts)`는 8장 이상인 저장·병합 일일 기록만 센다.
- `getUnlockedBadges(posts)`는 3·7·14·30 완성 페이지 기준으로만 해금한다.
- 로컬 동기화 대기 완료도 서버 Post와 병합해 즉시 계산하며, 서버 동기화 후 같은 날짜를 중복 계산하지 않는다.
- 현재 보상 화면은 milestone 표시 상태다. 실제 창작 자산은 M5에서 연결한다.
- Color Rhythm, Hue Canvas color budgets, mission-pack rewards, and reward migration are not implemented yet.

Target implementation:

- `posts.local_date`에서 주간 색 리듬과 평생 발견일을 계산한다.
- 8장 그리드 완료 수, 미션 팩 metadata, 월간 참여를 별도 진행 축으로 계산한다.
- unlock 결과는 Hue Canvas color/tool/template ID, Story asset ID, Hueprint asset ID 같은 실제 사용 대상을 반환한다.
- UI component는 조건을 다시 계산하지 않고 한 reward helper/config의 결과를 사용한다.
- 기존 badge unlock의 streak 호환 계층은 출시 전 전환 정책에 따라 만들지 않는다.

Potential helper shape:

```ts
type BadgeReward = {
  milestone: 3 | 7 | 14 | 30
  unlocked: boolean
  labelKo: string
  labelEn: string
  stickerPackIds: string[]
  templateIds: string[]
  passportStampId: string
}
```

If story templates, sticker packs, or badge visuals are renamed later, keep the milestone-to-creative-reward relationship. The asset names can change; the product loop should not.

## Future Extensions

- Monthly recap story generated from all colors collected in a month.
- Badge detail sheet with period palette and favorite captured photo.
- Seasonal badge art for school break, spring flowers, rain season, exams, and travel.
- Premium packs that complement earned rewards, without replacing the free badge unlocks.
- Color Relay postcard and paired Duet Print styles.
- 월간 Hueprint에서 얻는 표지·재질·구도.

## M1 구현 상태 — 2026-07-23 KST

- `src/lib/collection.ts`은 3·7·14·30 배지를 8장 완성 일일 기록 수로만 계산한다.
- 배지 입력은 Supabase 동기화 여부와 관계없이 로컬·서버 병합 결과다. 로컬에서 완성했지만 동기화가 실패한 페이지도 즉시 해금에 반영되며, 이후 서버 Post가 생겨도 같은 `local_date` 기록은 한 번만 계산한다.
- 1~7장 기록은 유효한 일일 기록이지만 주요 완성 보상과 페이지 배지에는 포함하지 않는다.
- 현재 보상 화면은 milestone 표시에 머물며, 실제 Hue Canvas/Hueprint 창작 자산 연결은 M5 범위다.
