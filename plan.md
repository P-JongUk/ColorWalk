# ColorWalk MVP Development Plan

## Status
- [x] Lazyweb setup and reference verification
- [x] React/Vite/TypeScript project scaffold
- [x] Tailwind and shadcn-style UI foundation
- [x] Supabase schema, RLS, and storage setup
- [x] Supabase migration files and verification script
- [x] Open-Meteo mission logic
- [x] Camera eyedropper and match engine
- [x] WebP image compression and upload
- [x] Journal, receipt export, and sharing
- [x] Calendar/history view
- [x] Korean/English localization
- [x] Capacitor Android scaffold
- [x] Android SDK/JDK setup and debug APK build
- [x] Tests and browser QA
- [x] Supabase cloud verification after Anonymous sign-ins is enabled

## Product Direction
ColorWalk is a private daily color-hunting ritual. The user receives a daily color mission based on local weather and time, finds the color with a camera eyedropper, captures it, writes a short reflection, and keeps a visual calendar of collected colors. There is no social feed, ranking, or comparison loop.

The final visual direction is Candidate 3: soft emotional warmth with restrained trendy color-ticket details. The interface should feel youthful, collectible, and share-worthy, while staying calm enough for daily use in Korean and English markets.

## Technical Stack
- React + Vite + TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Zustand
- Supabase Auth, Database, Storage
- Open-Meteo weather API with browser/Android geolocation
- Capacitor Android wrapper
- html2canvas for receipt export
- Vitest for unit tests

## Core Implementation Notes
- Anonymous Supabase Auth is the MVP identity model.
- Images are compressed in-browser to WebP before upload, targeting 100KB or lower.
- Mission color selection is deterministic and zero-AI: weather group plus local time bucket maps to static color missions.
- Camera color matching uses RGB sampling from the center aim area and Euclidean distance scoring.
- Haptics use Capacitor Haptics on native Android and `navigator.vibrate` on web.
- Calendar cells use collected color data, not social data.
- Receipt export uses code-native UI rendered to image.

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
  - color conversion and match percentage
  - weather/time mission mapping
  - journal prompt selection
  - image compression helper boundaries where testable
- Browser QA:
  - desktop and mobile layout
  - location/weather fallback
  - camera denied state
  - capture to journal to save flow
  - calendar selection
  - receipt export/download fallback
- Android scaffold:
  - Capacitor config
  - Android platform
  - permission declarations
  - build and sync verification

## Future Roadmap

### Monetization Direction
- Keep beta free and avoid in-app ads. Ads conflict with the calm daily ritual and make the first impression feel cheap.
- Use a freemium path after retention is proven:
  - Free: daily mission, camera capture, basic journal, calendar, basic receipt/ticket export.
  - Paid one-time packs: premium receipt templates, seasonal palette packs, special typography styles, icon/sticker overlays.
  - Paid subscription only if there is enough ongoing value: monthly color report, long-term backup, advanced calendar insights, multi-device sync, exclusive monthly templates.
- Store policy note: paid digital templates, reports, and premium app features should be implemented through Apple In-App Purchase / Google Play Billing when distributed through those stores.

### Teen Audience Expansion
- Beta-safe additions:
  - Trendier 9:16 story templates with color ticket, mission color, captured color, match rate, and short mood text.
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
  - 3 days: tiny doodle stickers, sparkle marks, seed/leaf stamps.
  - 7 days: weekly color passport stamp, "Color Walk Week" sticker, one soft story decoration.
  - 14 days: ticket corner details, collection frame, richer color-name sticker.
  - 30 days: signature clover mark sticker, premium-feeling story frame, monthly passport stamp.
- UX direction:
  - Keep badges private, collectible, and share-friendly.
  - Avoid leaderboards, public comparison, harsh missed-day copy, or rewards that only protect a number.
  - Tapping a badge should eventually show the period palette/photos and offer a story-making path.
- Implementation direction: derive badge state from saved `posts.local_date` whenever possible. If templates, sticker packs, or badge visuals change later, preserve the milestone-to-creative-reward relationship.
- Detailed design note: `docs/colorwalk-reward-system.md`.

### Instagram / SNS Sharing
- Current MVP: receipt export through `html2canvas`, Web Share API when available, and image download fallback.
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
