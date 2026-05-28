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
| 6 | Daily reminder notification | `ProfileView`/`notifications.ts` support web notifications, Capacitor Local Notifications, and a beta test-notification button. Android emulator evidence: `android-notification-after-tap.png`, `android-notification-enabled.png`, `android-test-notification-shade.png`, and `android-test-notification-dumpsys.txt`. Daily reminder is queued in Android alarm manager; exact wall-clock delivery can be delayed by Android exact-alarm policy. | Implemented; emulator verified |
| 7 | Many color names in DB | `color_name_suggestions` migration seeded hundreds; `verify:supabase` checks at least 200 English suggestions and previous remote count was over 400 each locale. | Implemented; Supabase verified |
| 8 | Shuffle today's color | `TodayView` exposes shuffle button; `App.shuffleMission` replaces mission and shows toast. | Implemented; browser verified |
| 9 | Multiple same-day captures ask whether to replace and keep only latest in history | `App.saveEntry` checks existing same-day post, confirms replacement, upserts on `user_id,local_date`, and deletes replaced image. Android emulator showed the same-day replacement confirm before save. | Implemented; emulator verified |
| 10 | App-first behavior and Android compatibility | `ColorWalkPixel7` on D-drive AVD verified location permission, camera permission, camera preview/capture, journal save/replace, history, story editor, native story share sheet, notification permission, and immediate test notification display. `cap:sync`, `assembleDebug`, and `bundleRelease` pass; APK/AAB exist. | Implemented; emulator verified, physical phone still recommended |
| 11 | Remove "screen vs real object color" warning | User-facing copy and screen-abuse detection logic removed; camera always records `abuseWarning: false`. | Implemented |
| 12 | Restore story template/sticker UX in Journal/History | `StoryStudio` works from History; browser screenshot `story-from-history-430x932.png` shows templates, stickers, search, export. Android emulator opened story editor from History and native share sheet displayed the exported PNG. Journal shows editor once a draft exists. | Implemented; browser and emulator verified |
| 13 | PWA account flow with Supabase username/password/profile metadata | `AuthGate`, `beta-signup`, `profiles` columns, PWA manifest/service worker, seeded test account, and Supabase verify script. Live URL `https://colorwalk-tau.vercel.app` was redeployed and returns 200 with the manifest. | Implemented; live browser verified |
| 14 | Main chunk >500KB warning | Vite code splitting keeps largest chunks around 200KB. `npm run build` has no 500KB warning. | Implemented; build verified |

## Current Non-Code Blockers

- Physical phone PWA install/share/camera QA is still user-side.
- Android daily repeating notifications are scheduled through Android alarm manager. On Android 12+ exact-alarm policy can delay wall-clock delivery; use the profile "테스트 알림 보내기" button to verify permission/channel/display immediately.
- Public/free PWA deployment is live at `https://colorwalk-tau.vercel.app`. The successful path used local Vite build output packaged as Vercel Build Output API artifacts because `vercel build` hit Windows `node_modules` file locks.

## Do Next

1. Run real-device PWA install QA on the user's phone from `https://colorwalk-tau.vercel.app`.
2. Re-run camera, story export/share, and notification test on the physical phone after PWA install.
3. If Play Store internal testing is used, upload the latest `app-release.aab` and reuse the same beta account/invite code.
