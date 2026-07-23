# Hueday MVP Development Plan

Last code/document alignment: 2026-07-22 KST. The latest full release verification remains recorded separately in `docs/release-readiness.md`.

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
- [x] Helper-level unit tests and historical browser QA baseline
- [x] Supabase cloud verification for password users, anonymous-write denial, owner CRUD/storage, and cross-user denial
- [ ] Automated integration/E2E coverage for signup -> capture -> save -> story share

## Product Direction
Hueday is a private everyday color-discovery ritual. The user receives or chooses a contextual mission color, finds objects that feel similar, collects eight surrounding photos into a 3x3 grid around that center color, writes a short reflection, and uses accumulated colors as creative materials for Hueprints, stories, and optional safe Color Relay sharing. There is no color-match score, public ranking, or comparison loop.

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
- Username/password beta accounts are the current app identity model. Signup calls the deployed `beta-signup` Edge Function and then opens a password session. Anonymous sign-in remains only as a compatibility/security verification target; the app rejects anonymous sessions and RLS denies anonymous app-data writes.
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
  - `public.color_name_suggestions`
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

The overall agreed product lives in `docs/hueday-product-blueprint.md`, and the only current execution status board is `docs/hueday-development-roadmap.md`. The complete Hue Room replacement exploration lives in `docs/discovered-color-content-strategy.md`; the old Hue Room spec and sub-roadmap are preserved as deferred post-launch evidence. The code-grounded diagnosis, monetization sequence, market references, and Windows-to-iOS release options remain in `docs/hueday-breakout-strategy.md` and `docs/product-growth-strategy.md`. This file must not claim proposals are implemented until code and verification exist.

### Product Growth Strategy
- Growth principle: do not clone Locket, BeReal, Setlog, or generic story-template apps. Use them only as reference patterns for close sharing, low-burden logging, and daily prompts.
- Hueday's unique loop is `daily color mission -> real-world color finding -> 3x3 collection -> story/share card -> accumulated color identity`.
- Priority growth bets:
  - Clear center-mission-color 3x3 Color Hunt without extraction or match percentage.
  - Home/school/commute/cafe/weather/walk mission packs for everyday discovery.
  - A found-color creative system where completed 3x3 colors become reusable, non-consumable materials linked to their source memories.
  - Flexible Color Rhythm and cumulative rewards that unlock real room/story/Hueprint items.
  - Monthly Hueprint and minimum Color Capsule recall.
  - Friend-shared "today color card" links and safe Color Relay.
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
  - Flexible weekly Color Rhythm and cumulative discovery rewards that unlock real Hueprint, story, and found-color creation options.
  - Share-friendly color identity labels such as "today's mood color" and editable custom color names.
  - Lightweight friend prompt copy, without a public feed or leaderboard.
- Post-beta additions:
  - Friend-to-friend missions using invite links or deep links.
  - Seasonal school/vacation/event palette packs.
  - Optional account linking for backup and device transfer.
- Safety/privacy note: if directly targeting users under 14 in Korea or under 13 in the US, add age gating, parental consent review, privacy copy, and a stricter data-minimization design before launch.

### Color Rhythm and Found-Color Reward System
- Product principle: reward repeated discovery without making consecutive-day streak loss the main emotion.
- Users can choose a flexible weekly 2/3/5-day Color Rhythm; missed days do not remove accumulated progress, rooms, chapters, or items.
- Saved mission colors become a reusable creative-material library. Completed 3x3 colors can be combined and reused without consuming them, and every material links back to its source record.
- Cumulative discovery days, completed 3x3 pages, mission packs, weekly rhythm, monthly participation, and Relay can unlock real Hueprint, story, composition, material, and export assets.
- Existing 3/7/14/30 rewards must migrate without taking already-earned value away.
- Any capture, mission, story, profile, found-color content, or monetization change must check `docs/colorwalk-reward-system.md`, `docs/discovered-color-content-strategy.md`, the master roadmap, and the reward helper/config.

### Instagram / SNS Sharing
- Current MVP: 9:16 story export through `html2canvas`, Web Share API when available, and image download fallback.
- Beta-safe improvement: add native 9:16 story export templates that save/share cleanly even without direct Instagram integration.
- Native Instagram Stories integration is not implemented yet. Future implementation should add:
  - Android native intent path for Instagram Stories.
  - iOS URL scheme / pasteboard path after iOS platform support exists.
  - Meta/Facebook App ID configuration if required by Instagram Stories sharing.
  - Fallback to Web Share API or image download when Instagram is not installed or rejects the intent.

### Beta Priority Recommendation
1. Follow `docs/hueday-development-roadmap.md` from its current master phase; do not invent a separate order in feature conversations.
2. Align the Color Hunt contract, then stabilize/measure, add everyday mission packs, approve and implement the complete found-color replacement with Color Rhythm rewards, build Hueprint/Color Capsule, add safe Color Relay, and finish integrated release QA.
3. Treat this as a compressed release critical path, not a three-month roadmap and not a stripped-down minimum beta.
4. Implement each meaningful checkpoint on a focused `feature/<name>` branch and update only verified roadmap checkboxes.
5. Rerun `docs/release-readiness.md`, then verify signup -> capture -> save -> found-color creation -> Hueprint -> Relay/share on a physical phone and launch when the complete package passes.

## Current Follow-Ups
- Current master phase and next action are maintained only in `docs/hueday-development-roadmap.md`.
- Password-user profile upsert, post CRUD, owner storage access, anonymous-write denial, and cross-user denial passed the last recorded live Supabase verification. Anonymous sign-in is not the product entry flow.
- Android Gradle build now succeeds locally with Android SDK 36 and JDK 21. Debug APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.
- Apply `20260529200000_add_grid_images.sql` to the live Supabase project through an authenticated admin path, then plan removal of the `client_meta.gridImages` compatibility fallback after migration verification.
- Align the product promise around one-photo progress versus eight-photo 3x3 completion; the current camera allows completion after one image while product copy emphasizes eight shots.
