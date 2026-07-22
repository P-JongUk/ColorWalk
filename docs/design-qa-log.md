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

## Next Visual Pass

- Replace seeded demo images with stronger real-photo-like beta examples if the test account should look less placeholder-like.
- Continue comparing against the initial mockup crops before any future design changes.
- Create `.design-references/05-hue-room/` locally for 430x932 Soft Paper Diorama, Minimal Editorial Vector, and Game-like Soft 2.5D concepts.
- Before producing the full Hue Room item set, compare five hero items across light, dark, saturated, and neutral discovered colors and record the approved direction.
