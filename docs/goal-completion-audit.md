# Goal Completion Audit

Last updated: 2026-05-29 KST.

This file tracks the active 3x3-grid rebuild goal requirement by requirement. Do not mark the goal complete until every row is proven by current evidence.

| # | Requirement | Current evidence | Status |
|---|---|---|---|
| 1 | Work on a new branch | Current branch is `codex/3x3-grid-rebuild`. | Implemented |
| 2 | Remove color match-rate judgment from the product flow | Camera, journal, history, and story UI use 3x3 photo collection instead of match scoring. `getMatchRate`, match haptics, and old receipt component were removed. Legacy `posts.match_rate` remains as `0` for existing schema compatibility. | Implemented locally |
| 3 | Replace the core feature with 3x3 color-grid capture | `CaptureDraft`, `Post`, `GridCollage`, `CameraView`, `JournalView`, `CalendarView`, `StoryCard`, and `StoryStudio` now support grid images around the mission color. | Implemented locally |
| 4 | Redesign camera and app surfaces to fit the new feature while preserving the soft ColorWalk direction | Reference folders and current 430x932 captures exist under `.design-references/06-3x3-grid-rebuild/`. This pass captured home, camera permission fallback, camera after album photo, journal, story preview/editor, history, and profile. | Implemented locally; DB save path still pending remote migration |
| 5 | Update badge system for the new feature | `docs/colorwalk-reward-system.md`, `plan.md`, `AGENTS.md`, and `src/lib/collection.ts` define milestones as creative unlocks for stickers, weekly frames, photobooth borders, and signature frames. | Implemented locally |
| 6 | Use generated/user-provided icon images if copyright-safe | App/PWA icons and internal mark use local PNG assets under `public/brand/`, `public/favicon.png`, `public/icon-192.png`, `public/icon-512.png`, and `public/apple-touch-icon.png`. Browser profile/header captures show the internal mark. | Implemented locally |
| 7 | Rebuild story editor for 3x3/Life4Cuts-style frames | `StoryStudio`, `StoryCard`, and `src/lib/story.ts` use 3x3-oriented frames and sticker editing. Lazyweb references are stored under `.lazyweb/design-research/colorwalk-3x3-photobooth-2026-05-29/` and `.design-references/06-3x3-grid-rebuild/`. Browser QA exported a `1080x1920` PNG story successfully. | Implemented locally |
| 8 | Update test seed data for the new feature | `scripts/seed-beta-test-account.mjs` seeds grid images and new story template ids. | Implemented locally; remote run blocked until Supabase migration/auth is available |
| 9 | Add backend/API persistence for grid metadata | Migration `supabase/migrations/20260529200000_add_grid_images.sql` adds `posts.grid_images` and expands template ids. `src/lib/supabase.ts` signs grid image paths. | Implemented locally; remote migration not applied |
| 10 | Keep security intact | Frontend uses Vite publishable Supabase key only; service role remains local/Edge tooling only. RLS/storage policy model remains owner-scoped. `npm run verify:supabase` currently fails before policy checks because the remote schema is missing `posts.grid_images`. | Partially verified; remote migration required |
| 11 | Run verification | `npm run lint`, `npm test -- --run`, `npm run build`, `npm run cap:sync`, Android `:app:assembleDebug`, Android `:app:bundleRelease`, browser console check, and 1080x1920 story export passed. `npm run verify:supabase` failed with `PGRST204` because remote `posts.grid_images` is missing. | Mostly passed; Supabase blocked |
| 12 | Commit and push important finished features | No commit/push has been made for this active branch yet. | Pending |
| 13 | Redeploy free PWA beta | Deployment must wait until remote Supabase migration and verification pass, otherwise saving grid posts would fail on production. | Pending |

## Current Blocker

Supabase MCP authentication is expired:

```text
Provided authentication token is expired. token_expired 401
```

Until Supabase MCP is re-authenticated or another admin SQL path is provided, the remote `posts.grid_images` migration cannot be applied and the live PWA cannot be safely redeployed.

## Do Next

1. Re-authenticate Supabase MCP or provide a DB admin path, then apply `20260529200000_add_grid_images.sql`.
2. Run `npm run verify:supabase` and `npm run seed:test-account`.
3. Re-run browser save path from camera/album -> journal save -> history reshare.
4. Commit/push once the local 3x3 package is staged cleanly.
5. Redeploy the Vercel PWA only after remote Supabase verification passes.
