# ColorWalk Reward System Direction

## Product Principle

ColorWalk streak badges should not be treated as a score, ranking, or pressure loop. They should work as a soft creative reward system:

> A badge is a key that unlocks prettier ways to remember and share the colors the user already collected.

This keeps ColorWalk aligned with the core product direction: private, emotional, collectible, camera-first, and share-worthy without becoming competitive.

## Why Badges Matter

The value of a streak badge is not the number itself. The value is that the user can turn their repeated color walks into visible identity and creative assets.

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
| 3 days | First tiny habit | Small doodle stickers, sparkle marks, seed/leaf stamps |
| 7 days | One color week | Weekly color passport stamp, "Color Walk Week" sticker, one soft story decoration |
| 14 days | Mood collection | Ticket corner details, collection frame, richer color-name sticker |
| 30 days | Color Walker identity | Signature clover mark sticker, premium-feeling story frame, monthly passport stamp |

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

