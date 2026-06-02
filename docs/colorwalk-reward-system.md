# ColorWalk Reward System Direction

## Product Principle

ColorWalk streak badges should not be treated as a score, ranking, or pressure loop. They should work as a soft creative reward system:

> A badge is a key that unlocks prettier ways to remember and share the colors the user already collected.

This keeps ColorWalk aligned with the core product direction: private, emotional, collectible, camera-first, and share-worthy without becoming competitive.

## Why Badges Matter

The value of a streak badge is not the number itself. The value is that the user can turn repeated color walks into visible identity and creative assets.

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

## Badge Milestones

Use the existing 3, 7, 14, and 30 day streak milestones. The exact visuals can evolve, but the reward meaning should stay consistent.

| Milestone | Meaning | Reward Direction |
| --- | --- | --- |
| 3 days | First tiny habit | Extra empty-grid filler patterns, tiny marks, seed/leaf stamps |
| 7 days | One color week | Weekly grid seal, "Color Walk Week" stamp, one subtle export detail |
| 14 days | Mood collection | Modern grid border, collection frame, richer color-name label |
| 30 days | Color Walker identity | Signature clover seal, premium-feeling grid frame, monthly passport stamp |

## Badge Utility Model

When a user earns a badge, the app should answer "what can I do with this now?" clearly. A badge should unlock or highlight at least one of these useful surfaces:

- Story/export surface: filler pattern set, frame detail, simple title stamp, or recap layout.
- Profile: passport stamp, identity label, collected-period badge, or favorite color mark.
- History detail: period palette, representative photos, and a shortcut to make a story from that badge.
- Monthly recap: a generated 9:16 card that uses the unlocked badge art as a seal or frame.

Do not ship a badge that only changes a locked/unlocked icon. The reward can be small, but it should be usable, visible, and emotionally connected to the user's saved colors.

## Reward System Maintenance Contract

This reward system should move with the product whenever the core capture, story, profile, or monetization feature changes. Do not treat the current streak UI, monthly color shelf, story templates, or sticker IDs as the permanent system.

The permanent rule is:

> Repeated ColorWalk activity should unlock more personal, prettier, and more shareable ways to remember what the user collected.

When a feature changes, update rewards by preserving these relationships:

- `habit milestone -> creative unlock`
- `saved posts -> source of truth`
- `collected colors/photos -> shareable memory`
- `free earned reward -> genuinely useful creative item`

Examples:

- If the app stays as a single-photo color diary, badge rewards should unlock marks, passport/ticket details, color-name labels, and simple export treatments based on saved daily posts.
- If the app moves to a 3x3 grid system, badge rewards should unlock grid frame styles, empty-cell filler patterns, subtle border treatments, and recap layouts based on completed grid days.
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
- Keep the reward mapping in one helper/config layer so design assets can be renamed without rewriting the product loop.
- When changing capture, story, profile, or monetization features, update this document and the reward mapping in the same PR/commit.
- Current helper/config location: `src/lib/collection.ts`. Keep the badge reward labels and unlock conditions aligned with this document.

## Feature Change Checklist

Before shipping a change that touches camera, journal, story export, profile, history, templates, stickers, or monetization, answer these questions in the PR/commit notes:

- Does each milestone still unlock something the user can see or use?
- Is the unlock based on saved posts rather than a fragile local counter?
- Can the reward help the user make a better story, recap, profile stamp, or memory card?
- Are free earned rewards still desirable after adding premium packs?
- Did `docs/colorwalk-reward-system.md`, `plan.md`, and the reward helper/config stay in sync?

## Reward Types

### 1. Story Stickers

Stickers are the highest-ROI badge reward because they connect habit retention to sharing.

Examples:

- 3 days: tiny sparkle, seed, "today color", small crayon dot
- 7 days: "color walk week", soft stamp, hand-drawn ribbon
- 14 days: passport stamp, ticket border, swatch label
- 30 days: ColorWalk clover sticker, special frame corner, monthly seal

When sticker packs change, keep this rule:

> Earned stickers should feel like ColorWalk-native mementos, not generic emoji chips.

### 2. Story Templates

Badge rewards can unlock a small number of story template variations without making the app feel paywalled.

Recommended beta mapping:

- 7 days unlocks one soft/mongle template detail.
- 14 days unlocks one polaroid or ticket variant.
- 30 days unlocks one passport/newspaper/monthly recap style.

Future monetization can add paid packs, but earned badge templates should remain available as a goodwill loop.

### 3. Color Passport Stamps

Badges should appear like passport stamps or collected seals on the home/profile surfaces.

Tap behavior can evolve, but the preferred behavior is:

- Tapping a badge opens a small badge detail sheet.
- The sheet shows the milestone period, collected colors, and representative photos if available.
- The sheet offers "make story from this badge" when enough post data exists.

This makes the badge useful even if the monthly color shelf is removed or redesigned later.

### 4. Identity Names

Badge names should feel like soft identity labels rather than achievements.

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
- Do not punish missed days with harsh copy or scary visuals.
- Prefer "new item opened" over "streak broken".
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
