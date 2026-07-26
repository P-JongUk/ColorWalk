# Design QA Log

## 2026-07-26 product-direction gate

- Hue Canvas G1 captures remain preserved evidence for the mandatory early post-launch update, but are not a version-1 visual approval or production integration approval.
- Next design gate is Living Hue Deck: D exterior UI, 1/3/5/8 card growth, Color Volume, original 3×3, and existing Story export at 430×932. Collections move to M4 only after an explicit mission-pack ID; Hueprint moves to M5.
- No Hue Drop, public community, or Canvas G2 design QA is scheduled before version-1 launch and update-safety readiness. After launch, Canvas G2 resumes before production integration.

Local reference screenshots are stored under `.design-references/` and ignored by git.

Overall visual contract: `docs/hueday-product-blueprint.md`
Found-color content contract: `docs/discovered-color-content-strategy.md`
Hue Canvas detail: `docs/hue-canvas-product-spec.md`
Reference status/index: `docs/design-reference-index.md`
Hue Room concepts: deferred historical references only

Latest 430x932 captures:

- `.design-references/01-current-screens/home-seeded-430x932.png`
- `.design-references/01-current-screens/camera-430x932.png`
- `.design-references/01-current-screens/journal-empty-430x932.png`
- `.design-references/01-current-screens/story-from-history-430x932.png`
- `.design-references/01-current-screens/history-seeded-430x932.png`
- `.design-references/01-current-screens/profile-seeded-430x932.png`

## 2026-07-27 — M3 Living Hue Deck 430×932 QA

- Captures: `.design-references/01-current-screens/m3-living-hue-deck-2026-07-27/` (ignored local artifact): `00-history-switch-430x932.png`, `01-deck-1-3-5-8-volume-430x932.png`, `02-color-volume-430x932.png`, `03-source-record-430x932.png`, `04-existing-story-studio-430x932.png`, `05-empty-deck-430x932.png`.
- Local-only fixture verified empty Deck, the short `기록 / Deck` switch, 1/3/5/8 cards, one canonical `#ff0000`/`#FF0000` Color Volume, an 8/8 `기기 저장` card, Volume → original 3×3/history, and the existing Story Studio. Opening Studio alone did not take an export action; clicking existing `스토리 저장` produced a PNG download and `공유하기` completed without console warnings.
- D — Chromatic Archive was retained. This session did not have a callable Lazyweb tool, so no new external evidence was claimed; only confirmed repository CSS/tokens and `earth-soft-border.webp` were reused.

## Latest Findings

- Home, history, profile, and story editor render from the seeded Supabase account.
- Bottom navigation and system icons now use the sage accent instead of leftover coral active states.
- Camera QA in browser uses the browser camera surface. Real-device camera permission/capture still needs a connected phone or emulator.
- Journal empty state is intentionally simple until a captured draft exists.
- Story editor is functional from History via the saved post and shows template selection, export actions, sticker search/tabs, and controls.

## 2026-07-24 — M1 Color Hunt 430×932 final browser QA

- Captures: `.design-references/01-current-screens/m1-final-qa/` (ignored local QA artifact). Verified captures are `00-start-430x932.png`, `01-context-reroll-430x932.png`, `03-context-reroll-430x932.png`, `04-catalog-reroll-430x932.png`, `06-photo-preview-430x932.png`, `07-retake-430x932.png`, `08-first-seed-confirmed-430x932.png`, `10-first-seed-recovered-430x932.png`, `11-page-progress-430x932.png`, `12-complete-430x932.png`, `13-journal-430x932.png`, `14-calendar-merged-430x932.png`, `15-story-430x932.png`, `16-profile-430x932.png`, `19-date-transition-fresh-mission-430x932.png`, `20-closed-partial-calendar-430x932.png`.
- 0장 시작 전, 1~3회 날씨·시간 문맥 재추천, 네 번째 전체 큐레이션 재추천, 촬영 미리보기·다시 찍기·`이 사진 사용` 확정, 1장 씨앗 재시작 복구, 2~7장 진행, 8장 완료, 저널, Story, 기록함, 프로필을 실제 브라우저에서 확인했다.
- 달력은 동일 `local_date`의 로컬 최신 기록과 서버 Post를 한 항목으로 보여 주었고, QA 계정에서는 8/8 완료 일일 기록이 중복되지 않았다.
- Playwright의 이전 캡처 지연은 `document.fonts.ready`를 무한 대기한 앱 문제가 아니라 QA 스크립트의 대기 방식이었다. `document.fonts.status`는 `loaded`였으며, 직접 `page.screenshot`으로 제한 시간 없는 폰트 대기를 제거했다. 앱 표시 코드는 변경하지 않았다.
- Android 별도 QA AVD의 실제 캡처는 `android-camera-active.png`, `android-photo-preview.png`, `android-first-saved.png`, `android-recovery.png`에 남겼다. 2026-07-24 KST 추가 시도는 `.design-references/01-current-screens/m1-android-qa-2026-07-24/`에 `camera-active.png`, `preview-1.png`, `retake.png`, `seed-confirmed.png`, `foreground-recovered-1.png`, `progress-2.png`, `progress-5.xml`을 남겼다. 실제 카메라 권한·촬영·다시 찍기·확정, 1/8 저장·background/foreground 복구, 2/8·5/8 순차 촬영까지 확인했다. 다만 전역 날짜 mock은 Supabase 인증 시간과 충돌하므로 유효한 Android 날짜 전환 검증으로 쓰지 않았고, 그 뒤 clean `wipe-data` cold boot에서 앱 설치 전 System UI·전화·Google Play services ANR이 재발했다(`clean-boot-system-anr.log`). 7/8·8/8 완료/배지, foreground 날짜 전환, 저널 저장·Story 네이티브 공유 시트는 미통과 상태로 실제 Android 기기 QA에 남긴다.

## 2026-07-22 — Design Direction Gate 1

- Compared two 430x932 low-fidelity flows using the same content and states: A `one photo completes today` and B `one photo starts progress, eight photos complete the mission`.
- Approved B. The center remains the mission color; the first surrounding photo is safely stored as `첫 색 발견` and `오늘의 색 씨앗`, while all eight surrounding photos complete the mission and one 3x3 page.
- Partial progress must remain resumable without failure, lost rewards, streak reset, guilt copy, or visible color-matching scores.
- Current one-photo save, journal entry, and draft recovery support burden-free intermediate persistence; they do not define product completion.
- Local comparison artifacts:
  - `.design-references/06-design-direction/gate-1-m1-meaning/option-a-flow.png`
  - `.design-references/06-design-direction/gate-1-m1-meaning/option-b-flow.png`
  - `.design-references/06-design-direction/gate-1-m1-meaning/first-capture-comparison.png`

## 2026-07-23 — Hue Canvas Product Gate

- Approved product direction: Hue Canvas with a large pan/zoom grid, per-color placement budget based on completed 3x3 discovery count, free drawing, resizable outline templates, and a translucent stained-glass material.
- Product approval is not visual approval. Existing Hue Studio and Hue Charm images are exploratory references, not the final Hue Canvas screen.
- Keep all large assets on D and record status in `docs/design-reference-index.md`.

## Next Visual Pass

## 2026-07-26 — M2-2 CP4 local master smoke QA

- PWA: local Vite app at `127.0.0.1:4173` was checked at a 430×932 viewport. Home rendered the device-storage state and current mission; Camera navigation rendered the 8-slot collection, album selection, capture, camera switch, and disabled journal state without a layout or console-blocking failure.
- Capacitor: `npm run cap:sync` completed after the prior terminal result could not be recovered. It rebuilt the web bundle, copied it into Android assets, and updated the three configured plugins.
- Android: `:app:assembleDebug` produced a new debug APK (17,955,823 bytes, 2026-07-26 14:31 KST). `ColorWalkPixel7` initially missed the 60-second ADB-ready window; once it booted, `adb install -r` was rejected with `INSTALL_FAILED_UPDATE_INCOMPATIBLE` because the existing `com.colorwalk.app` used a different signature. The installed older app launched, but System UI ANR was the current focus. Install/camera/offline/retry QA was not repeated or claimed as passed. This is emulator/signing evidence, not an app QA result.
- Existing automated gates were supplied as already passed for this checkpoint and were intentionally not rerun: lint, 25-test Vitest run, production build, and Supabase verification. `git diff --check` passed with only existing Android generated-file CRLF warnings.

- Keep D — Chromatic Archive as the working direction for the external app UI.
- Hue Room H1/H2/H3 boards are not approved launch screens. Preserve them locally and stop room/furniture/2.5D/3D production until the post-launch hypothesis is explicitly reopened.
- Before visual production, compare the product blueprint, growth strategy, reward system, and found-color replacement strategy; surface any conflict instead of silently changing the product contract.
- Gate HC-2 compares empty, Hue Palette, free-canvas, template-resize, color-shortage, complete, remix, and export states using the same source 3x3 data.
- Produce a real Canvas 2D/SVG interaction prototype with the representative 430x932 states; do not expand the full screen set before the user approves the visual and first interaction.
- Verify extreme light/dark/desaturated HEX values, tile boundaries, remaining-use copy, touch pan/zoom, system insets, and Android performance.
- Keep design-direction boards under `.design-references/06-design-direction/`, Hue Canvas work under `.design-references/07-found-color-content/`, and research under `.lazyweb/` as ignored local artifacts.
