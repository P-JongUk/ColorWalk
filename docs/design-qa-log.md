# Design QA Log

Local reference screenshots are stored under `.design-references/` and ignored by git.

Overall visual contract: `docs/hueday-product-blueprint.md`
Hue Room element contract: `docs/hue-room-product-spec.md`

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

- Before visual production, compare the product blueprint, growth strategy, reward system, and Hue Room decisions; surface any conflict instead of silently changing the product contract.
- Gate 2 uses the same content and partial-progress state for four directions: Modern Editorial Photo, Cozy Tactile Healing, Soft Paper Editorial / Diorama, and Chromatic Archive.
- Produce only one moodboard, one 430x932 home, one 430x932 center-color 3x3, and one partial Hue Room texture sample per direction; select the top two before expanding screens.
- Keep all moodboard sources and large rendered images under `.design-references/06-design-direction/` and `.lazyweb/` as ignored local artifacts.
