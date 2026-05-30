# ColorWalk polish goal audit - 2026-05-30

This note records the evidence for the 12-item polish goal before commit and web beta deployment.

## Requirement evidence

| # | Requirement | Evidence |
|---|---|---|
| 1 | Future dates in history must not show colors. | `CalendarView` only applies `--calendar-color` when `!isFuture`; browser QA confirmed May 31 and next-month future cells have no inline color style. |
| 2 | Fix the notification error. | `TodayView` now wraps `new Notification(...)` in `try/catch` and falls back to a toast when the browser cannot show an immediate notification. Browser console QA after clicking Notifications returned zero errors. |
| 3 | Lock today's color after photos are taken. | `TodayView` disables the shuffle button when a draft has photos or a post exists today. Browser QA confirmed `다른 색` is disabled after one cached draft photo. |
| 4 | First four shuffles use weather/time recommendations; later shuffles use the full palette. | `App.shuffleMission()` stores a date-scoped shuffle count and calls `getRandomMission(..., { broaden: count >= 4 })`; `mission.ts` supports both scoped and full-palette random selection. |
| 5 | Captured photos must survive app exit/reopen. | Added IndexedDB draft cache in `src/lib/draftStorage.ts`. Browser QA added an album photo, reloaded the app, and confirmed the `1/8컷 모으는 중` draft remained. |
| 6 | Journal current location should register. | `JournalView.requestPlace()` now sets `현재 위치` / `Current location` fallback names and saves coordinates. Browser QA with granted geolocation populated the input with `현재 위치` and showed coordinates saved. |
| 7 | Remove/explain the confusing Pantone top-right circle. | The grid center chip now uses a flat color block in the final grid override; the previous decorative highlight circle is no longer used in the active 3x3 grid. |
| 8 | Temporarily remove story template/frame/sticker selection without deleting code; do not place ColorWalk name in story. | `StoryStudio` gates decoration controls behind `STORY_DECORATION_TOOLS_ENABLED = false`. `StoryCard` hides branding/decorations. Browser QA shows only simple preview plus save/share actions, with no template/sticker UI and no ColorWalk text. |
| 9 | Empty photo cells should be filled with stylish randomized designs. | Added `gridFillers.ts` with 22 deterministic filler variants and Tailwind safelist. Browser QA confirmed variant backgrounds are present in computed CSS and visible in `.design-references/07-grid-polish-2026-05-30/journal-final-local-430x932.png`. |
| 10 | Recolor app/header icons to match the main point color. | Recolored `public/brand/colorwalk-app-icon.png`, `public/brand/colorwalk-mark.png`, favicon/PWA icons, and aligned primary CTA/active states to coral. |
| 11 | Make the 3x3 grid equal, square, flush, modern, and simple. | Final CSS sets zero grid gap, square aspect ratio, equal rows/columns, straighter corners, and no decorative card gaps. Browser QA captured home/journal/camera/history screens at 430x932. |
| 12 | Redesign camera capture UI to match the grid direction. | Camera overlay is now a simple 3x3 square guide, and the footer preview uses the same 3x3 grid. Browser QA captured `.design-references/07-grid-polish-2026-05-30/camera-local-430x932.png`. |

## Verification run

- `npm run lint` passed.
- `npm test -- --run` passed: 5 files, 14 tests.
- `npm run build` passed with split chunks and no 500KB main chunk warning.
- `npm run verify:supabase` passed: anonymous sign-in, anonymous write denial, profile upsert, color suggestions, storage upload/signed URL, post upsert/select, story metadata, grid metadata fallback, location metadata, post RLS denial, and storage RLS denial.
- `npm run seed:test-account` passed for `colorwalk_test_01`.
- `npm run cap:sync` passed after rebuilding.

## Remaining launch note

The live Supabase project still reports `gridImageStorage: client_meta_fallback`. The app handles this path, but applying the pending `grid_images` migration later will move grid metadata into the first-class column.
