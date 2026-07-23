# Design QA Log

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

## 2026-07-23 — Hue Canvas Product Gate

- Approved product direction: Hue Canvas with a large pan/zoom grid, per-color placement budget based on completed 3x3 discovery count, free drawing, resizable outline templates, and a translucent stained-glass material.
- Product approval is not visual approval. Existing Hue Studio and Hue Charm images are exploratory references, not the final Hue Canvas screen.
- Keep all large assets on D and record status in `docs/design-reference-index.md`.

## Next Visual Pass

- Keep D — Chromatic Archive as the working direction for the external app UI.
- Hue Room H1/H2/H3 boards are not approved launch screens. Preserve them locally and stop room/furniture/2.5D/3D production until the post-launch hypothesis is explicitly reopened.
- Before visual production, compare the product blueprint, growth strategy, reward system, and found-color replacement strategy; surface any conflict instead of silently changing the product contract.
- Gate HC-2 compares empty, Hue Palette, free-canvas, template-resize, color-shortage, complete, remix, and export states using the same source 3x3 data.
- Produce a real Canvas 2D/SVG interaction prototype with the representative 430x932 states; do not expand the full screen set before the user approves the visual and first interaction.
- Verify extreme light/dark/desaturated HEX values, tile boundaries, remaining-use copy, touch pan/zoom, system insets, and Android performance.
- Keep design-direction boards under `.design-references/06-design-direction/`, Hue Canvas work under `.design-references/07-found-color-content/`, and research under `.lazyweb/` as ignored local artifacts.
