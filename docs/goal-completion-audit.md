# Goal Completion Audit

Last updated: 2026-05-29 KST.

This file tracks the active goal requirement by requirement. Do not mark the goal complete until every row is proven by current evidence.

| # | Requirement | Current evidence | Status |
|---|---|---|---|
| 0 | Today ticket shows pattern/illustration before capture and today's photo after capture | `TodayView` uses `ticketImageUrl` only from today's post; CSS fallback draws the ticket/photo pattern when absent. Browser home screenshot exists in `.design-references/01-current-screens/home-seeded-430x932.png`. | Implemented; browser verified |
| 0b | Remove duplicate month collection strip from Today/History | `TodayView` has no monthly color strip. `CalendarView` has calendar, selected record card, and compact stats only. | Implemented |
| 1 | Reduce AI-looking design with reference-driven polish | Reference folders and QA routine documented in `AGENTS.md`; latest 430x932 captures saved; final CSS layer unifies soft sage accents/cards. | Partially implemented; visual taste can always be iterated |
| 2 | Use soft green/sage theme for primary CTA and icons | `camera-cta`, active bottom nav, status icons, story export CTA, selected calendar ring, match ring use sage final overrides. | Implemented; browser screenshots verify |
| 3 | Fix History collection box overlap | History month collection box was removed; selected record + stats remain. | Implemented |
| 4 | Unify card backgrounds and borders | Final CSS layer unifies main cards to `#fffefa`/soft border treatment. | Implemented |
| 5 | Replace seed badge dot, make 14-day leaf more grown, tone down 30-day badge | `BadgeShelf` uses custom plant SVGs for 3/7/14/30 days and toned-down 30-day styling. | Implemented |
| 6 | Daily reminder notification | `ProfileView`/`notifications.ts` support web notifications and Capacitor Local Notifications. Android build includes `@capacitor/local-notifications`. | Implemented; real device notification QA not yet proven |
| 7 | Many color names in DB | `color_name_suggestions` migration seeded hundreds; `verify:supabase` checks at least 200 English suggestions and previous remote count was over 400 each locale. | Implemented; Supabase verified |
| 8 | Shuffle today's color | `TodayView` exposes shuffle button; `App.shuffleMission` replaces mission and shows toast. | Implemented; browser verified |
| 9 | Multiple same-day captures ask whether to replace and keep only latest in history | `App.saveEntry` checks existing same-day post, confirms replacement, upserts on `user_id,local_date`, and deletes replaced image. | Implemented; code verified, browser same-day replacement not re-run this pass |
| 10 | App-first behavior and Android compatibility | `cap:sync`, `assembleDebug`, and `bundleRelease` pass; APK/AAB exist. | Partially verified; no connected Android device/emulator, so real camera/notification permission QA remains |
| 11 | Remove "screen vs real object color" warning | User-facing copy and screen-abuse detection logic removed; camera always records `abuseWarning: false`. | Implemented |
| 12 | Restore story template/sticker UX in Journal/History | `StoryStudio` works from History; browser screenshot `story-from-history-430x932.png` shows templates, stickers, search, export. Journal shows editor once a draft exists. | Implemented; History verified, Journal-with-draft needs real capture/album QA |
| 13 | PWA account flow with Supabase username/password/profile metadata | `AuthGate`, `beta-signup`, `profiles` columns, PWA manifest/service worker, seeded test account, and Supabase verify script. Live URL `https://colorwalk-tau.vercel.app` was verified through invite code, login, home, history, and story editor. | Implemented; live browser verified |
| 14 | Main chunk >500KB warning | Vite code splitting keeps largest chunks around 200KB. `npm run build` has no 500KB warning. | Implemented; build verified |

## Current Non-Code Blockers

- No physical Android device or AVD is connected. `adb devices` returns no devices.
- C drive has very low free space, which blocks Android system image/AVD installation unless SDK/AVD/cache paths move to D.
- Public/free PWA deployment is live at `https://colorwalk-tau.vercel.app`. The successful path used local Vite build output packaged as Vercel Build Output API artifacts because `vercel build` hit Windows `node_modules` file locks.

## Do Next

1. Connect a phone or create a D-drive AVD, then run camera/album/location/notification QA.
2. Run real-device PWA install QA on the user's phone from `https://colorwalk-tau.vercel.app`.
3. Re-run story export/share on the physical phone after PWA install.
