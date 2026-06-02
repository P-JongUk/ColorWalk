# ColorWalk MVP Development Plan

## Status
- [x] Lazyweb setup and reference verification
- [x] React/Vite/TypeScript project scaffold
- [x] Tailwind and shadcn-style UI foundation
- [x] Supabase schema, RLS, and storage setup
- [x] Supabase migration files and verification script
- [x] Open-Meteo mission logic
- [x] Camera 3x3 color-grid capture flow
- [x] WebP image compression and upload
- [x] Journal, 9:16 story export, and sharing
- [x] Calendar/history view
- [x] Korean/English localization
- [x] Capacitor Android scaffold
- [x] Android SDK/JDK setup and debug APK build
- [x] Tests and browser QA
- [x] Supabase cloud verification after Anonymous sign-ins is enabled

## Product Direction
ColorWalk is a private daily color-walk ritual. The user receives a daily mood color mission based on local weather and time, collects up to eight surrounding photos into a 3x3 grid around that color, writes a short reflection, and keeps a visual history of collected color days. There is no social feed, ranking, or comparison loop.

The final visual direction is Candidate 3: soft emotional warmth with restrained trendy color-ticket details. The interface should feel youthful, collectible, and share-worthy, while staying calm enough for daily use in Korean and English markets.

## Technical Stack
- React + Vite + TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Zustand
- Supabase Auth, Database, Storage
- Open-Meteo weather API with browser/Android geolocation
- Capacitor Android wrapper
- html2canvas for 9:16 story export
- Vitest for unit tests

## Core Implementation Notes
- Anonymous Supabase Auth is the MVP identity model.
- Images are compressed in-browser to WebP before upload, targeting a beta-friendly mobile payload while preserving enough detail for story export.
- Mission color selection is deterministic and zero-AI: weather group plus local time bucket maps to static color missions.
- The old color-match scoring flow is removed from the product UI. The legacy `posts.match_rate` column is retained as `0` only for schema compatibility until a later cleanup migration.
- Calendar cells use collected color data, not social data.
- Story export uses code-native 9:16 frames rendered to image.

## Supabase Plan
- Use existing project: `ColorWalk` (`nhsvmypztjyhqunixxeg`).
- Tables:
  - `public.profiles`
  - `public.posts`
- Storage bucket:
  - `post-images`
- RLS:
  - Users can only read/write their own profile.
  - Users can only read/write their own posts.
  - Users can only upload/read files in their own storage folder.

## Verification Plan
- Unit tests:
  - color conversion and color family helpers
  - weather/time mission mapping
  - journal prompt selection
  - image compression helper boundaries where testable
- Browser QA:
  - desktop and mobile layout
  - location/weather fallback
  - camera denied state
  - capture to journal to save flow
  - calendar selection
  - 9:16 story export/download fallback
- Android scaffold:
  - Capacitor config
  - Android platform
  - permission declarations
  - build and sync verification

## Future Roadmap

### Product Growth Strategy
- Growth principle: do not clone Locket, BeReal, Setlog, or generic story-template apps. Use them only as reference patterns for close sharing, low-burden logging, and daily prompts.
- ColorWalk's unique loop is `daily color mission -> real-world color finding -> 3x3 collection -> story/share card -> accumulated color identity`.
- Priority growth bets:
  - Friend-shared "today color card" links.
  - Monthly color recap.
  - Badge rewards that unlock story frames/stamps.
  - School/travel/seasonal color mission packs.
  - Close-friend "see each other's today color" without ranking or comparison.
  - Color/mood-first lightweight feed after private and close sharing are proven.
  - Anonymous aggregate color trends only after enough usage and privacy safeguards.
- Detailed living roadmap: `docs/product-growth-strategy.md`.

### Monetization Direction
- Keep beta free and avoid in-app ads. Ads conflict with the calm daily ritual and make the first impression feel cheap.
- Use a freemium path after retention is proven:
  - Free: daily mission, 3x3 grid capture, basic journal, history, and basic story frame export.
  - Paid one-time packs: premium story frames, seasonal palette packs, special typography styles, icon/sticker overlays.
  - Paid subscription only if there is enough ongoing value: monthly color report, long-term backup, advanced calendar insights, multi-device sync, exclusive monthly templates.
- Store policy note: paid digital templates, reports, and premium app features should be implemented through Apple In-App Purchase / Google Play Billing when distributed through those stores.

### Teen Audience Expansion
- Beta-safe additions:
  - Trendier 9:16 story templates with 3x3 grid frames, mission color, mood name, and short mood text.
  - Collection badges for 3-day, 7-day, 14-day, and 30-day streaks.
  - Share-friendly color identity labels such as "today's mood color" and editable custom color names.
  - Lightweight friend prompt copy, without a public feed or leaderboard.
- Post-beta additions:
  - Friend-to-friend missions using invite links or deep links.
  - Seasonal school/vacation/event palette packs.
  - Optional account linking for backup and device transfer.
- Safety/privacy note: if directly targeting users under 14 in Korea or under 13 in the US, add age gating, parental consent review, privacy copy, and a stricter data-minimization design before launch.

### Streak Badge Reward System
- Product principle: streak badges are not scores or pressure mechanics. They are creative keys that unlock prettier ways to remember and share the colors the user already collected.
- Preferred reward loop:
  - 3 days: extra empty-grid filler patterns, tiny marks, seed/leaf stamps.
  - 7 days: weekly grid seal, "Color Walk Week" stamp, one soft export detail.
  - 14 days: modern grid border, collection frame, richer color-name label.
  - 30 days: signature clover seal, premium-feeling grid frame, monthly passport stamp.
- Why a badge matters:
  - It should give the user a visible creative benefit, not just a number.
  - It should make the story editor, profile, history detail, or monthly recap feel more personal.
  - It should turn "I used the app several days" into "I unlocked a nicer way to show my collected colors."
  - It should stay private and self-expressive unless the user chooses to export/share it.
- UX direction:
  - Keep badges private, collectible, and share-friendly.
  - Avoid leaderboards, public comparison, harsh missed-day copy, or rewards that only protect a number.
  - Tapping a badge should eventually show the period palette/photos and offer a story-making path.
- Implementation direction: derive badge state from saved `posts.local_date` whenever possible. If templates, sticker packs, or badge visuals change later, preserve the milestone-to-creative-reward relationship.
- Maintenance rule: whenever the core capture/story/profile/monetization feature changes, update the reward mapping with it so streak milestones keep unlocking creative memory tools rather than becoming a stale counter.
- Living-system rule: do not hard-code the current badge UI as the product loop. The stable loop is `saved color-walk activity -> milestone -> creative unlock -> story/profile memory`. If ColorWalk changes from one-photo capture to 3x3 grids, monthly recap, travel mode, or paid template packs, remap each milestone to the closest useful free creative item instead of deleting the reward meaning.
- Feature-change contract:
  - If the story editor changes, remap badge rewards to the new filler/frame/export surfaces.
  - If the profile changes, keep badge stamps or identity labels visible somewhere personal.
  - If the monthly shelf is removed, preserve the same memory value through a badge detail sheet or recap story.
  - If paid packs are added, earned badge rewards must remain genuinely useful free creative items.
  - Any PR that changes capture, story, profile, history, templates, stickers, or monetization should update `docs/colorwalk-reward-system.md` and the reward mapping helper in the same change.
- Detailed design note: `docs/colorwalk-reward-system.md`.

### Instagram / SNS Sharing
- Current MVP: 9:16 story export through `html2canvas`, Web Share API when available, and image download fallback.
- Beta-safe improvement: add native 9:16 story export templates that save/share cleanly even without direct Instagram integration.
- Native Instagram Stories integration is not implemented yet. Future implementation should add:
  - Android native intent path for Instagram Stories.
  - iOS URL scheme / pasteboard path after iOS platform support exists.
  - Meta/Facebook App ID configuration if required by Instagram Stories sharing.
  - Fallback to Web Share API or image download when Instagram is not installed or rejects the intent.

### Beta Priority Recommendation
1. Add 9:16 story templates and stronger share preview first.
2. Add streak/collection badges and mood color naming second.
3. Defer paid features until beta retention and sharing behavior are measured.
4. Defer direct Instagram Stories native integration until Android beta sharing demand is proven, because the current Web Share/download route is simpler and more robust for early testing.

## Current Follow-Ups
- Supabase anonymous sign-in, profile upsert, storage upload, and post upsert/select verification now pass against the live ColorWalk project.
- Android Gradle build now succeeds locally with Android SDK 36 and JDK 21. Debug APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.
- Supabase advisors currently warn that anonymous signed-in users can access owner-scoped `profiles`, `posts`, and `post-images` policies. This is expected for the anonymous-auth MVP, but account linking should revisit the policy model.
