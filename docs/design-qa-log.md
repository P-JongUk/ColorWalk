# Design QA Log

Local reference screenshots are stored under `.design-references/` and ignored by git.

Overall visual contract: `docs/hueday-product-blueprint.md`
Found-color content contract: `docs/discovered-color-content-strategy.md`
Hue Room concepts: deferred historical references only

Latest 430x932 captures:

- `.design-references/01-current-screens/home-seeded-430x932.png`
- `.design-references/01-current-screens/camera-430x932.png`
- `.design-references/01-current-screens/journal-empty-430x932.png`
- `.design-references/01-current-screens/story-from-history-430x932.png`
- `.design-references/01-current-screens/history-seeded-430x932.png`
- `.design-references/01-current-screens/profile-seeded-430x932.png`

## Latest Findings

- Home, history, profile, and story editor render from the seeded Supabase account.
- Bottom navigation and system icons now use the sage accent instead of leftover coral active states.
- Camera QA in browser uses the browser camera surface. Real-device camera permission/capture still needs a connected phone or emulator.
- Journal empty state is intentionally simple until a captured draft exists.
- Story editor is functional from History via the saved post and shows template selection, export actions, sticker search/tabs, and controls.

## 2026-07-22 — Design Direction Gate 1

- Compared two 430x932 low-fidelity flows using the same content and states: A `one photo completes today` and B `one photo starts progress, eight photos complete the mission`.
- Approved B. The center remains the mission color; the first surrounding photo is safely stored as `첫 색 발견` and `오늘의 색 씨앗`, while all eight surrounding photos complete the mission and one 3x3 page.
- Partial progress must remain resumable without failure, lost rewards, streak reset, guilt copy, or visible color-matching scores.
- Current one-photo save, journal entry, and draft recovery support burden-free intermediate persistence; they do not define product completion.
- Local comparison artifacts:
  - `.design-references/06-design-direction/gate-1-m1-meaning/option-a-flow.png`
  - `.design-references/06-design-direction/gate-1-m1-meaning/option-b-flow.png`
  - `.design-references/06-design-direction/gate-1-m1-meaning/first-capture-comparison.png`

## Next Visual Pass

- Keep D — Chromatic Archive as the working direction for the external app UI.
- Hue Room H1/H2/H3 boards are not approved launch screens. Preserve them locally and stop room/furniture/2.5D/3D production until the post-launch hypothesis is explicitly reopened.
- Before visual production, compare the product blueprint, growth strategy, reward system, and found-color replacement strategy; surface any conflict instead of silently changing the product contract.
- Gate 3 compares Color Archive, 2–5 color selection, Glass/Ink/Loom output, remix, and 9:16 Hueprint states using the same source 3x3 data.
- Produce a small interaction prototype and representative 430x932 states first; do not expand the full screen set before the user approves the replacement content and first material.
- Keep all moodboard sources and large rendered images under `.design-references/06-design-direction/` and `.lazyweb/` as ignored local artifacts.
