# Hueday Color Rhythm·Reward System Direction

전체 제품 기준: `docs/hueday-product-blueprint.md`
발견 색 대표 콘텐츠 기준: `docs/discovered-color-content-strategy.md`
현재 구현 순서: `docs/hueday-development-roadmap.md`

## Product Principle

Hueday의 보상은 연속 일수 점수, 순위, 압박 루프로 취급하지 않는다. 유연한 Color Rhythm과 누적 발견이 실제 색 재료와 창작 옵션으로 이어지는 시스템이어야 한다.

> 보상은 사용자가 발견한 색을 작품 재료로 조합하고, 다시 편집하고, 원할 때 공유하게 해 주는 실제 열쇠다.

This keeps Hueday aligned with the core product direction: private, emotional, collectible, camera-first, and share-worthy without becoming competitive.

## Color Hunt Completion Contract

- 미션 색은 3x3 중앙에 고정하고, 사용자는 일상에서 비슷한 색을 찾아 주변 8칸을 채운다.
- 첫 사진은 안전하게 보존되는 `첫 색 발견`이자 `오늘의 색 씨앗`이다. 진행 시작으로 인정하지만 미션·오늘 기록·3x3 페이지 완료로 계산하지 않는다.
- 8장을 모두 채운 완성 3x3을 오늘의 미션과 한 페이지 완료로 계산한다.
- 주요 보상 축은 완성 3x3이다. 비소모성 색 재료, Hueprint 반영, 창작 재질·구도, 완성형 공유 프레임·결과물을 여기에 연결한다.
- 부분 진행은 당일 완료를 강제하지 않고 나중에 이어 채울 수 있게 보존한다.
- 미완성 때문에 기존 보상을 회수하거나 연속 일수를 초기화하지 않으며 실패·죄책감 카피를 사용하지 않는다.
- 첫 색 씨앗에는 칸 채움, 저장 확인, 부드러운 촉각·시각 피드백을 줄 수 있지만 주요 아이템 해금처럼 완료로 오해할 보상은 주지 않는다.

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
| 첫 색 씨앗·발견 시작 | 안전하게 저장된 부분 진행 | 저장 확인, 진행 피드백, 이어하기 입구 |
| 완성한 3x3 | 1·3·5·10페이지 등 | 해당 미션 색의 Hue Canvas 배치량·기본 도안/도구 |
| 미션 팩 | 집·학교·통학·카페 pack 진행 | 문맥별 대표 아이템 |
| 주간 색 리듬 | 선택한 2/3/5일 목표 | 재질·장식·작은 공간 효과 |
| 월간 참여 | 한 달 안의 유연한 참여 | Hueprint 포스터·벽지·리캡 프레임 |
| Color Relay | 친구와 같은 색 발견 | 엽서·짝 컬러 타일 |

기존 3·7·14·30 UI와 계산은 새 체계가 구현될 때까지 호환 상태로 남는다. 전환 시 기존 사용자의 획득 상태를 회수하지 않고 누적 발견 또는 완성 3x3 기준으로 같은 가치 이상의 무료 아이템을 지급한다.

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
- 첫 색 씨앗은 안전한 진행으로 남고, 완성 3x3·미션 팩·월간 참여가 Canvas 색 수량·도안·재질·도구·표지 같은 실제 옵션을 연다.
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

The current app can derive streaks from `posts.local_date`. Future reward logic should continue to use persisted posts as the source of truth.

Current beta implementation:

- Milestones are fixed at 3, 7, 14, and 30.
- `getCurrentStreak(posts)` counts consecutive saved `posts.local_date` values backward from today.
- `getCompletedGridCount(posts)` counts saved posts with 8 or more grid images.
- `getUnlockedBadges(streak, posts)` unlocks a milestone when either the current streak reaches the milestone or the user has completed that many full 3x3 grids.
- This means a user can unlock rewards through daily consistency or through enough completed color grids, but the unlock still comes from persisted posts rather than a fragile local counter.
- Current visible rewards are still mostly labels and badge states. The next product step should make each unlocked milestone visibly usable in story/export/profile surfaces.
- Color Rhythm, Hue Canvas color budgets, mission-pack rewards, and reward migration are not implemented yet.

Target implementation:

- `posts.local_date`에서 주간 색 리듬과 평생 발견일을 계산한다.
- 8장 그리드 완료 수, 미션 팩 metadata, 월간 참여를 별도 진행 축으로 계산한다.
- unlock 결과는 Hue Canvas color/tool/template ID, Story asset ID, Hueprint asset ID 같은 실제 사용 대상을 반환한다.
- UI component는 조건을 다시 계산하지 않고 한 reward helper/config의 결과를 사용한다.
- 기존 badge unlock은 새 reward ledger에 무손실로 매핑한다.

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
