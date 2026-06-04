# Hueday Beta Completion Audit

Last updated: 2026-06-04 KST.

This file tracks the current beta-finishing goal requirement by requirement. Treat local files, command output, live deployment checks, and Android build outputs as the source of truth.

| # | Requirement | Current evidence | Status |
|---|---|---|---|
| 1 | Use the selected Hueday app icon, header mark, and wordmark throughout the app | Public icon assets are under `public/favicon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`, and `public/brand/hueday-app-icon.png`. Header/internal mark and wordmark are under `public/brand/hueday-mark-transparent.png` and `public/brand/hueday-wordmark.png`. Live manifest returns `name: Hueday`, `display: standalone`, and 3 icons. | Complete |
| 2 | Keep story/journal capture-location saving removed | `src/App.tsx`, `scripts/verify-supabase.mjs`, and `scripts/seed-beta-test-account.mjs` intentionally write `location_*` fields as `null`. `npm run verify:supabase` returned `locationMetadataDisabled: true`. Docs state location is used only for mission generation. | Complete |
| 3 | Keep backend/API and security release checks intact | `npm run verify:supabase` passed anonymous sign-in, anonymous write denial, profile upsert, color name suggestions, post CRUD, storage upload, signed URL, cross-user post denial, and cross-user storage denial. `rg` found service role usage only in `supabase/functions/beta-signup/index.ts` and docs. Private docs/env/design references are git-ignored. | Complete |
| 4 | Provide a dummy beta account and seeded data for routine QA | `npm run seed:test-account` passed for `colorwalk_test_01` and seeded 2026-06-04 through 2026-05-31. Credentials remain only in `docs/beta-test-account.private.md`, which is ignored by git. | Complete |
| 5 | Free PWA beta is deployed for phone testing | Live URL is `https://colorwalk-tau.vercel.app`. Latest production deployment id is `dpl_2mbPWqdts4UGREosLrDHSQ5yFpnZ`. HTTP checks returned 200 for app shell, manifest, service worker, `CameraView-CMOIOuyQ.js`, and `StoryStudio-DlUvm79N.js`. | Complete |
| 6 | PWA camera does not force the phone's native camera app from the main shutter | `src/components/CameraView.tsx` now captures from the active `getUserMedia` stream. Supported browsers get zoom presets/slider through `MediaStreamTrack.applyConstraints({ zoom })`; the native camera file input remains only as a small fallback button. `src/lib/camera.test.ts` covers non-square preview constraints and zoom normalization. Live chunk contains `In-app camera` and `applyConstraints`. | Complete |
| 7 | Story templates, stickers, Hueday watermark, and export/share flow are available | `StoryStudio` enables template/sticker tools by default unless `VITE_SIMPLE_STORY_EDITOR=true`. `StoryCard` renders branding and sticker decorations. Live browser QA logged in, opened history, opened story editor, and confirmed template names, sticker packs, `3x3 저장`, `스토리 저장`, `공유하기`, and `Hueday` watermark. | Complete |
| 8 | Daily diary experiment is present but easy to remove | `src/components/DailyDiaryPanel.tsx` is isolated and mounted from `JournalView`. Daily diary references are saved under `.design-references/06-daily-diary-references/`. Removing the experiment is localized to the component and one render location. | Complete |
| 9 | Android/Play Store internal testing artifacts are prepared | `npm run cap:sync`, Android `:app:assembleDebug`, and Android `:app:bundleRelease` passed. Latest outputs are `android/app/build/outputs/apk/debug/app-debug.apk` and `android/app/build/outputs/bundle/release/app-release.aab`. `docs/play-store-internal-testing.md` contains build commands, Play Console steps, store copy, permission copy, and updated release notes. | Complete |
| 10 | Verification commands pass after final changes | Latest current-state checks passed on 2026-06-04 KST: `npm run lint`, `npm test -- --run` (17 tests), `npm run build`, `npm run verify:supabase`, `npm run seed:test-account`, `npm run cap:sync`, Android debug APK build, Android release AAB build, live deployment asset checks, and live login/history/story QA. | Complete |
| 11 | Work is committed and pushed to GitHub | Latest pushed branch is `codex/pwa-polish-grid-fixes`. Recent commits include `517827b Improve PWA camera capture and zoom`, `8f76855 Restore story template and sticker tools`, and `213c361 Update internal testing release notes`. | Complete |

## Manual / External Follow-Up

These are not repo-code blockers, but they cannot be fully completed from this local Codex session:

- Physical phone PWA QA: install from the live HTTPS URL, allow camera, test lens/zoom behavior, capture quality, story save/share targets, and notification behavior on the actual device.
- Play Console internal testing: upload `app-release.aab`, complete the Google Play required app-content sections, add tester emails, and roll out the internal track from the user's Play Console account.
- Supabase dashboard: Security Advisor previously reported leaked password protection disabled. Enable it when the Supabase plan supports the feature.
- Supabase schema cleanup: apply `20260529200000_add_grid_images.sql` later with authenticated admin access so the live project can move from `client_meta.gridImages` fallback to the dedicated `posts.grid_images` column.
