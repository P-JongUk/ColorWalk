# Hueday Design System — Modern Warm Archive

> Status: M6 D3 approved on 2026-07-28. `Modern Warm Archive` is the approved implementation direction refining D — Chromatic Archive. CP1–CP5 may use this document and the approved targets as production implementation input; CP0 itself does not change `src/`, production CSS, configuration, packages, or database code.

## 1. Product intent

Hueday is a camera-first personal color diary for Korean beta users. The single visual direction is `Modern Warm Archive`: about 70–75% modern, clean, and precise, balanced by about 25–30% warmth and gentle emotion. From a distance it reads as a refined photo-recording app; in repeated use it feels like a personal color diary with affection and memory.

The modern share comes from system typography, exact alignment and ratios, generous regular spacing, thin borders, minimal layered shadow, and fast restrained feedback. The warm share comes from ivory canvas/paper, restrained sage, natural Korean color names and copy, subtle color transitions, and small reassuring state feedback. Warmth never comes from characters, toy-like controls, large speech bubbles, excessive pastel, or decorative clutter.

Use iOS only as a quality reference for hierarchy, system typography, alignment, proportion, spacing, thin borders, restrained shadow, and responsive feedback. Do not copy its visual chrome, navigation, materials, or component styling.

The visual hierarchy is always:

1. Mission color and the user's photographs.
2. The next meaningful action: capture, resume, save, reopen, or export.
3. Record state and recovery information.
4. Collections, rewards, decoration, and explanatory copy.

The interface must not resemble a game room, sticker game, gacha, AI generator, generic glass dashboard, or pixel-art product. Photographs and mission color remain the strongest visual elements. Avoid pure white, cold gray, heavy shadow, excessive glass, oversized pills, generic gradients, and game-like collection chrome.

`Modern Warm Archive` and `Chromatic Archive` are internal design-direction names used only in this specification and design-evidence documents. App headers and user-facing surfaces show the product brand `Hueday` without either direction label.

There is no launch-time `modern / warm` theme selector. `Modern Warm Archive` is one coherent product design. If real post-launch demand appears, visual variation may be reconsidered only as Story/Hueprint frame or theme-pack candidates without changing the app shell.

### Modern / warm allocation

| Layer | Modern precision | Warm emotion | Implementation expression |
|---|---:|---:|---|
| Layout and hierarchy | 85% | 15% | Exact grid, alignment, spacing, one dominant artifact |
| Typography and controls | 85% | 15% | System type, restrained weights, thin boundaries, fast feedback |
| Surface and elevation | 75% | 25% | Ivory paper and minimal layered shadow instead of cold white or heavy depth |
| Color | 70% | 30% | Archive ink structure, restrained sage states, mission color as content |
| Copy and state feedback | 60% | 40% | Natural Korean color language and small reassuring recovery/progress copy |
| Overall target | 72% | 28% | Refined photo archive first, affectionate color diary on closer use |

## 2. Canonical color tokens

| Token | Value | Required use |
|---|---:|---|
| `--hd-canvas` | `#FBF8F1` | App background |
| `--hd-paper` | `#FFFDF8` | Primary paper surface and fixed photo-overlay surface |
| `--hd-paper-muted` | `#F2EDE1` | Recessed archive area and secondary surface |
| `--hd-ink` | `#211D1B` | Normal text and dark icons |
| `--hd-archive-ink` | `#132F39` | Primary CTA, archive headings, strong structural accent |
| `--hd-muted` | `#786B5E` | Secondary text only at a compliant size and weight |
| `--hd-sage-action` | `#3F776C` | Selected state and secondary action accent |
| `--hd-sage-soft` | `#ECF8F4` | Selected or positive background |
| `--hd-sage-decorative` | `#8FCFBD` | Decorative accent only; not normal text on light paper |
| `--hd-olive` | `#526331` | Archive category accent and status icon |
| `--hd-coral-text` | `#B33C32` | Error/destructive text on light paper |
| `--hd-coral-decorative` | `#FF6F61` | Decorative marker only |
| `--hd-border` | `#D8D0C2` | Structural border and divider |
| `--hd-focus` | `#0F6E73` | Keyboard focus indicator |

Mission HEX values are content. They may fill the mission frame, center tile, chart, or specimen marker, but they never recolor surrounding CTA, body, navigation, focus, or status surfaces. Functional text over photographs uses a fixed opaque or near-opaque `--hd-paper`/`--hd-archive-ink` surface independent of image colors. Text rendered directly on a mission-color specimen follows the dedicated contrast algorithm below.

### Mission-color text algorithm

- Parse the mission HEX as sRGB, linearize each channel with the WCAG relative-luminance formula, and calculate contrast against both `Ink #211D1B` and `Paper #FFFDF8`.
- Choose whichever of Ink or Paper has the higher contrast against the mission color. Normal color name, HEX, lock state, and specimen labels must still reach at least `4.5:1`; large display text must reach `3:1`.
- Do not use translucent text, an arbitrary white default, a mission-color-derived text color, shadow-only contrast, or a decorative ivory label inset.
- Use the same resolved text color in Home, Journal, History/Deck, Story preview, 3×3 export, Hueprint, and Capsule wherever the color name or HEX is drawn directly on the mission color.
- A color that cannot reach the required ratio with either canonical candidate is a validation failure for the curated catalog and must use a fixed accessible specimen treatment before release; do not silently lower the threshold.

### Contrast acceptance

- Normal text: at least `4.5:1`.
- Large text: at least `3:1`.
- Meaningful icon, component boundary, selected outline, and focus indicator: at least `3:1` against adjacent colors.
- Disabled state may be visually quieter but must retain a readable label and must not communicate its meaning through color alone.

## 3. Typography

Keep the installed system/Korean UI font stack. Do not add a webfont package or asset in M6.

| Role | Size / line-height | Weight | Notes |
|---|---:|---:|---|
| Display | `32 / 36px` | `800` | Rare artifact cover only |
| Screen title | `28 / 34px` | `800` | One per screen |
| Section title | `24 / 30px` | `800` | Major archive section |
| Card title | `20 / 26px` | `750` | Record or artifact name |
| Body | `15 / 23px` | `500` | Default Korean reading text |
| Label / CTA | `14 / 20px` | `700` | Buttons, tabs, field labels |
| Meta | `12 / 17px` | `600` | Date, count, archive code |

No normal UI text may be smaller than 12px. Headings use `text-wrap: balance`; body copy may use `text-wrap: pretty`. Dynamic counts and dates use tabular numerals where it prevents layout movement. Do not use condensed, handwritten, or display lettering for functional labels.

## 4. Spacing, geometry, and elevation

### Spacing scale

Use only `4, 8, 12, 16, 20, 24, 32, 40px` for new or touched layout gaps. A 430px screen uses 20px horizontal page padding; a 360px screen uses 16px. Adjacent sections normally use 24 or 32px, while elements within one component use 8 or 12px.

### Radius scale

- Small control: `8px`
- Field, chip group, compact ticket: `12px`
- Card and dialog inner surface: `16px`
- Hero/archive card and sheet: `24px`
- Pill: `999px`

Nested corners must be concentric: `outer radius = inner radius + actual inset`. Example: a 16px inner image inside an 8px padded card uses a 24px outer radius. Do not apply the same radius to both nested surfaces.

### Border and shadow

- Use `1px solid var(--hd-border)` for structure, separation, selection, and focus-adjacent geometry.
- Paper elevation uses one restrained layered shadow: `0 1px 2px rgb(33 29 27 / 0.06), 0 12px 28px rgb(19 47 57 / 0.08)`.
- Glass is permitted only for compact controls over a photo: opaque enough to guarantee contrast, `backdrop-filter` optional, never a large decorative blur panel.
- Add a low-opacity neutral outline to photographs so pale images remain distinct from paper.

## 5. Icons and targets

- Keep the existing icon library and one stroke language per surface; do not add icon assets.
- Standard icon sizes are 16, 20, and 24px. Match optical weight to adjacent text and adjust asymmetric icons optically rather than forcing geometric centering.
- Decorative icons are `aria-hidden`; icon-only actions require a Korean accessible name.
- Every primary mobile target is at least `44×44px`; bottom-navigation targets are at least 48px high. A smaller visible glyph may use internal padding or a non-overlapping pseudo-element hit area.

## 6. Shared component patterns

### CTA hierarchy

1. Primary: solid `--hd-archive-ink`, white text, minimum 48px height. One primary action per decision area.
2. Secondary: `--hd-paper`, archive-ink text, structural border, minimum 44px height.
3. Tertiary: text or icon-text action with a 44px hit area; never rely on an unlabeled icon.
4. Destructive: paper surface plus `--hd-coral-text`; require explicit wording and confirmation only for irreversible work.

Pressed feedback may use a restrained `scale(0.96)` only when `prefers-reduced-motion` allows it. Keyboard-initiated actions and high-frequency navigation must not add movement animation.

### Archive card and ticket

- A record card contains one dominant visual: photograph/collage or mission color specimen.
- The archive label is a compact date/status line, not a second hero card.
- Title and progress stay adjacent to the visual; recovery or sync copy follows in one short line.
- The whole record-opening surface has one interactive owner. Nested actions such as Story are siblings, never buttons inside buttons.
- Fractions such as `3/8` remain explicit text. Do not replace them with an unexplained eight-dot game meter.

### Bottom navigation

- The product has exactly five destinations in this order: `오늘 / 저널 / 촬영 / 기록 / 나`.
- The central `촬영` destination is the only bottom-navigation entry point to Camera/album. Do not add a separate Camera tab or a sixth destination.
- Preserve direct access to Journal and the combined History/Deck/Hueprint record area.
- Selected state uses icon shape/fill plus label and color; color alone is insufficient.
- Keep all five labels and non-overlapping targets visible at 430px, 360px, and 200% text zoom. Do not restore the historical Hue Room destination.

### Segmented navigation

- Use a real `tablist`/`tab` relationship when content switches in place.
- Each tab is at least 44px high. Use concise unit-aware labels where they clarify scope: `기록`, `Deck · 3×3`, `Hueprint`.
- The selected state uses text weight, surface, and border/indicator together.

### Dialog and sheet

- Prefer the native `<dialog>` element or the smallest existing-compatible wrapper.
- Opening moves focus to a meaningful heading or first action, Tab and Shift+Tab remain inside, Escape closes, and close restores focus to the trigger.
- Background content is not focusable while open. A heading, accessible name, and explicit close action are mandatory.
- Use a dialog for camera preview and destructive confirmation. Use a sheet only when the content is a mobile continuation panel; do not build a universal modal framework.

### Loading, empty, error, and sync

| State | Surface behavior | Accessibility behavior |
|---|---|---|
| Loading | Keep layout geometry stable; show concise action-specific text | `aria-busy` on the affected region and status text |
| Empty | Explain the next useful action, not merely absence | Heading or status plus reachable CTA |
| Error | Fixed paper/error surface with recovery action | Field linkage or `role="alert"` for blocking errors |
| Sync pending | Compact ticket below the affected artifact | Visible text plus status semantics; never color-only |
| Saved | Short confirmation near the artifact | Polite status; do not rely only on a toast |

## 7. Motion

Use motion only to explain spatial change or confirm an occasional action.

- Fast feedback: `120ms`
- Small control/dialog state: `180ms`
- Sheet or rare screen transition: `240ms`
- Enter/exit: strong ease-out, `cubic-bezier(0.23, 1, 0.32, 1)`.
- On-screen repositioning: `cubic-bezier(0.77, 0, 0.175, 1)` only when necessary.
- Specify animated properties; never use `transition: all`.
- Prefer CSS transitions for predetermined state changes; do not add a motion library.
- Do not animate routine bottom-nav changes, keyboard actions, every list item, or every card on load.

Under `prefers-reduced-motion: reduce`, remove translate, scale, parallax, stagger, and simulated spatial travel. A short opacity/color transition may remain when it clarifies state. Motion is never the only feedback channel.

## 8. Responsive and accessibility contract

- Primary reference viewport: `430×932` CSS px.
- Required narrow check: `360px` width with browser/system text settings representative of a real small Android device.
- Required zoom check: browser text/page zoom at `200%`; the active CTA and dialog close action must remain reachable without two-dimensional scrolling.
- Use native semantics first. Add ARIA only where native elements cannot express the interaction.
- Verify meaningful image alt text, empty alt for decoration, labels for inputs and icon buttons, visible focus, tab order, dialog focus entry/Escape/return, and status announcements.
- Automatic checks are supporting evidence only. Playwright must actually operate Tab, Shift+Tab, Enter/Space where applicable, Escape, and trigger focus return on the core dialogs.
- Windows Narrator is optional in M6 when the environment can run it reliably. Android TalkBack remains an M7 physical-device gate.

## 9. Representative screen rules

### Home / Today

- Keep a compact Hueday header.
- The canonical Home artifact follows the approved D references `direction-d-home-430x932.png` and `direction-d-collection-430x932.png`, not a new generic split card.
- Label the artifact `3×3 한 페이지` at its top. Place one unambiguous center mission-color frame on the left and the actual 3×3 photo grid on the right. The grid includes the same mission color in its center tile, so the relationship between the mission color and found photographs is visible at a glance.
- At 430px, the left color frame is landscape at approximately `1.5–1.7:1`; the right grid is an exact `1:1` square between `132–144px`. Their heights are nearly equal, the color frame consumes the remaining width, and the grid must never stretch vertically.
- At 360px, keep the right grid square and scale both regions down without changing their reading order. Under 200% zoom, stack the landscape color frame above the square grid when side-by-side geometry no longer fits.
- A restrained cut corner from the original D direction may remain on the mission frame. Use exact alignment, thin boundaries, and the shared minimal layered shadow; do not turn the artifact into a toy or decorative sticker object.
- Fill the entire landscape frame with the mission color. Render `오늘의 미션 색`, color name, HEX, and lock state directly on it using the shared Ink/Paper contrast algorithm; do not place an ivory text inset inside the frame.
- The frame has exactly two restrained paper-cut details: a `10–16px` fold at the top-right corner and one at the bottom-left. Top-left and bottom-right remain ordinary corners. Use a pseudo-element or simple clip-path, with no ribbon, heavy shadow, photographic paper asset, or text overlap at 430px, 360px, or the 200% stacked layout.
- The center tile in every 3×3 fills the entire tile with the mission color and renders the color name, up to two lines, plus HEX directly on the color using the same resolved text color. No ivory label inset is permitted.
- Below the visual, keep explicit `n/8` text, a progress bar, and a short state explanation together. Do not replace the fraction with decorative dots.
- Keep the next capture/resume primary CTA inside the artifact. At 430px, 360px, and 200% text zoom, the artifact may stack vertically but the mission card, center tile, progress, state copy, and CTA must retain this reading order.
- Mission-pack selection follows the primary capture action. Rewards appear after the mission pack and must not push the primary CTA below the first viewport.

#### Home state: 0 photos, color not locked

- Show the current recommendation's mission-color card and the same color in the center of an otherwise empty 3×3 grid. Label the state `추천 색 · 아직 잠기지 않음` and show `0/8` with an empty progress bar.
- A compact secondary ticket states only the coarse recommendation context: approximate location category, current weather, and time band. Never display or persist exact coordinates or a place name.
- Keep `다른 색` available before capture and until a preview is accepted with `이 사진 사용`.
- Explain the stage beside the control in natural language: `같은 날씨 추천 · 3번 남음`, then `2번 남음`, `1번 남음`; after those rerolls, show `이제 전체 색에서 골라요`. Do not expose internal terms such as context stage, catalog mode, or reroll index.
- The first recommendation does not consume a reroll. Up to three subsequent recommendations reuse the same weather/time/coarse-location context. Later rerolls draw uniformly from the full curated catalog.
- Selecting or previewing a photo does not lock the color. Only `이 사진 사용` locks it; immediately after that confirmation, hide `다른 색`.

#### Home state: 1–7 photos, color locked

- Label the artifact `색 잠금 · 첫 사진 확정됨`. Keep the locked mission color and center tile stable and remove the reroll action.
- Show the explicit fraction, proportional progress bar, and the positive state copy `오늘의 유효한 기록이에요. 같은 날 이어서 채울 수 있어요.`
- Never describe a partial page as failed, incomplete in a punitive sense, lost, or requiring recovery when it is safely saved.
- The weather/time/coarse-location context becomes record explanation only, for example `흐림 · 노을 추천에서 시작한 오늘의 색`. It no longer behaves like a live recommendation control.

#### Home state: 8 photos complete

- Keep the same artifact geometry with the completed 3×3 grid, explicit `8/8`, a full progress bar, and `오늘의 한 페이지 완성`.
- Replace the capture CTA with the next valid action such as `저널에서 마무리하기`; do not offer a ninth slot or reroll.
- This state may be a compact supplementary D3 view, but production must preserve the same token, navigation, contrast, and target rules.

#### Optional Home weekly-color strip

- The empty space below the core artifact must not be filled with decoration, new features, or a mini dashboard.
- Candidate A leaves deliberate breathing room after the existing mission-pack context. Candidate B adds exactly one compact `이번 주의 색` strip derived from existing Hueprint data.
- Candidate B contains 3–7 discovered-color swatches, one short count such as `이번 주 4가지 색`, and one `Hueprint 보기` action that opens the existing Hueprint view.
- It creates no DB field, persistence path, reward, collection, route, or analytics event. It must never move the core 3×3 CTA below the first viewport.
- For a new user with no weekly color data, hide the strip or replace it with the single line `첫 색을 찾으면 이번 주 색이 시작돼요`; do not render empty metrics.
- Recommendation: use B only when existing weekly color data is present, and use A for new/no-data users. This preserves capture focus and low density for first use while giving returning users a small accumulation cue and Hueprint re-entry motive.

#### Partial 3×3 empty-slot system

The current implementation fact is that multiple matte, sage, grid, line, split, stripe, frame, and dot fillers can be selected per slot, including hash-based variation. In M6 this visual noise is replaced by one deterministic empty-slot system. One to seven photos remain a valid, shareable record; empty cells must read as an editorial contact sheet awaiting photographs, not as errors or decorative content.

| Candidate | Visual rule | Interactive Home/Camera | Static Journal/History/Story/export | Assessment |
|---|---|---|---|---|
| A — Uniform Paper | Identical warm paper, `1px` border, nearly imperceptible inset | One identical centered `+` | No `+` or decoration | Quietest and simplest, but gives the least archive/contact-sheet meaning |
| B — Editorial Contact Sheet | Identical warm paper and identical inner frame | One identical centered `+` | No `+`; optional tiny slot number or corner registration mark | Recommended: preserves photo focus while making partial records feel intentional and shareable |
| C — Mission Tint | Identical solid surface containing only `4–8%` mission color | One identical centered `+` | No `+`; no random variation | Reject when tint competes with photographs or reads as pastel UI |

Canonical candidate for D3 approval is **B — Editorial Contact Sheet**. It scores best across modernity, photo focus, partial-record meaning, and share desire while adding only one static/interactive distinction. A remains the fallback if production capture comparison proves the inner frame too visible. C is rejected for the current direction because even a restrained tint repeats the mission color across eight cells and weakens the unique center specimen.

After approval:

- Remove slot-by-slot decorative variation and random/hash-based filler choice from touched Home, Journal, History, Story preview, and export paths.
- Keep only two minimal render modes: interactive cells with one consistent `+`, and static/export cells with no `+` plus an optional quiet registration mark.
- Use no new asset, package, persistence field, analytics event, or export structure.
- The same photograph arrangement, mission tile, empty-slot order, and color-name text must render in preview and the actual `1080×1920` Story output.

### Camera / album and Journal

- Camera is visually quiet: live/photo surface first, one shutter/confirm action, album fallback always reachable after denial.
- Preview actions sit on a fixed-contrast surface and are implemented as a dialog.
- Journal is quieter than Home and uses the same paper, border, radius, typography, and contrast system without the Home mission/reward density.
- The Journal photo result is an exact `1:1` 3×3 square. At 430px it is approximately `320–350px` with visible side margins; at 360px it scales down as a square and never stretches the photos or grid vertically.
- Journal uses the shared full-color center tile with direct, contrast-resolved color name and HEX. It never restores an ivory center label.
- Below the square, keep this order: current partial/complete state; short journal input; one prompt with compact suggestions; one clear `기록 저장` primary action; Story Studio entry.
- Partial and complete states use affirmative record language. Suggestion and Story controls meet the 44px target, field labels remain explicit, and save/loading/error feedback is announced near the action.

### History / Deck / Hueprint / Capsule

- One screen title and one 3-tab segmented navigation control.
- History shows the calendar and selected artifact without duplicating headings.
- Deck uses compact archive cards so at least one full card and the beginning of the next collection context appear at 430×932.
- `Deck · 3×3` clarifies the artifact unit. Every card reopens its source grid.
- Color Volume and mission-pack collections are archive subsections, not competing hero screens.
- Hueprint keeps the weekly cover/photo visible but brings the date, counts, days, and export actions into the first viewport.
- Capsule labels the month in localized Korean and supplies an accessible name for the month card.

### Story Studio and export

- This is the existing 9:16 sharing editor, not a new sticker feature or decoration room.
- The 9:16 preview remains the dominant surface. The top action is named `내보내기` or the exact operation, never ambiguous `저장`.
- Template selection is a compact horizontal picker. Sticker search/picker is a secondary collapsible tool region with 44px controls.
- Existing stickers may be selected, deleted, and moved forward/backward with keyboard-reachable controls.
- Arrow-key position movement is allowed only as a small handler on the existing coordinate state; otherwise defer it as P2.
- Stickers are never persisted to the original photo, Post, Deck, Hueprint, Home, or Profile. Do not create a coordinate editor, collision system, or migration.
- Export actions retain distinct meanings: `3×3 저장`, `스토리 저장`, and `공유하기`; show busy/error state and preserve success-only analytics.
- Partial Story previews and actual `1080×1920` exports use the same full-color center mission tile, resolved Ink/Paper text, photo order, and approved static empty-slot treatment. Both the Journal and Story 3×3 stay exactly `1:1`; the 9:16 canvas may frame that square but never stretch it.
- Preserve existing Story templates, sticker data and privacy boundary, export dimensions, and analytics success timing. The mission color does not become a shell or CTA theme.
- User-facing export copy follows the effective locale. Korean uses natural Korean labels and footer copy such as `Hueday · 오늘의 색 0728`; English may use `Hueday · COLOR NOTE 0728`. The displayed date format follows the same locale.
- In Korean UI, use `그리드`, `스토리`, and other natural Korean functional labels instead of unnecessary mixed labels such as `GRID` or `Story Studio`. Approved product proper names such as `Hueprint` remain unchanged.

### Auth and Profile / settings

- Auth labels every field, links error text with `aria-describedby`, marks invalid fields, and keeps recovery copy next to the affected action.
- Existing implementation fact: Hueday already has Korean/English locale switching. M6 preserves that capability and replaces an ambiguous binary toggle presentation with the three-choice device-language contract below; it does not open a new translation system or server contract.
- Profile uses user-facing Hueday language. Vendor/internal beta labels are removed or translated into meaningful sync/install state.
- Interactive rows look and behave interactive; informational rows are not styled as buttons.
- Profile contains one clearly labeled interactive row, `언어`, with the current value: `시스템 설정`, `한국어`, or `English`. Opening it uses the smallest existing-compatible dialog or sheet with one radio group, a visible selected state, initial focus, Escape close, and trigger focus return.
- Initial locale follows device/browser language. A Korean system locale resolves to Korean; every other unsupported system locale falls back to English. Explicit `한국어` or `English` selection stores only a device-local preference and overrides the system choice until `시스템 설정` is selected again.
- App UI, localized date/time, weather copy, notifications, errors, accessible names, and Story/Hueprint/Capsule export copy resolve from the same effective locale. User-authored journals, proposed color names, and existing content are never translated or rewritten.
- Locale changes do not update Post, draft, photos, mission, `client_meta`, or any server record. Do not expose internal implementation names, Supabase, or beta-test wording in Profile.
- Android per-app language settings, Play Console localization, English store materials, Data Safety, target age, and content rating remain M7 release gates. CP0 defines this contract only and does not implement them.

## 10. Forbidden patterns

- No new brand direction, Hue Room, pixel-game UI, gacha, reward loss, streak punishment, or excessive sticker decoration.
- No generic AI gradient, assistant bubble, glass dashboard, animated orb, or neon glow.
- No new package, UI framework, animation library, image asset, webfont, server, analytics SDK, route, DB migration, or live DB change.
- No CSS file rewrite, selector-wide rename, automatic mass replacement, or one-shot deletion of historical theme blocks.
- No speculative memoization, content visibility, windowing, export rewrite, or route split without a measured bottleneck.

## 11. Production application contract after D3 approval

1. Record the current cascade, all root/theme blocks, and selectors used by the touched screens.
2. Add one canonical token layer without deleting existing themes.
3. Move only CP1–CP3 touched screens and shared components to tokens.
4. Remove selectors only in small batches after DOM/component usage checks, replacement proof, representative screenshot comparison, and a successful production build.
5. Record compiled CSS raw/gzip before and after. An increase is acceptable when it is required for approved visuals or accessibility and the reason is documented.
6. Reuse current Button, BottomNav, card, image, export, and data helpers. Add only the smallest dialog helper if the repeated focus problem is confirmed.
7. Measure the approved performance baseline before optimizing. If no bottleneck appears, record `측정상 최적화 불필요` and make no performance-structure change.

## 12. D1 evidence decisions

### Adopted

- Existing D gate: paper archive/ticket structure, precise metadata, photographic specimen priority, restrained sage selection.
- Lazyweb Today report: a small archive/date label may absorb state framing so Today reads as a color record rather than a dashboard. Report: <https://www.lazyweb.com/report/lazyweb/ca68e2a8-3aa3-4a46-bcf2-7a3e5f932372/?source=create>
- Lazyweb Archive report: clarify the tab's content unit with `Deck · 3×3`; keep segmented navigation shallow. Report: <https://www.lazyweb.com/report/lazyweb/62312279-74c0-4a92-9166-244e9129c43c/?source=create>
- Mobbin camera/Today flows: one primary action per capture step and predictable return from recap to source.
- UI Bowl element evidence: compact segmented navigation and camera/library action separation.
- `make-interfaces-feel-better`: concentric radii, layered neutral shadows, optical icon alignment, explicit transitions, tabular counts, and 44px targets.
- `fixing-accessibility`: native semantics, names, keyboard access, focus entry/trap/return, linked field errors, status announcements, and minimal targeted fixes.
- Emil Kowalski motion guidance: frequent navigation stays instant; occasional dialogs/sheets may use short transform/opacity motion; remove positional motion under reduced-motion.

### Rejected

- Lazyweb paywall/growth-component consensus, subscription framing, benefits grids, and unrelated conversion evidence: Hueday version 1 is free and M6 is not a growth/paywall project.
- Lazyweb eight-dot progress replacement: explicit `n/8` is clearer and preserves the approved collection contract.
- Mobbin/UI Bowl black camera skin, advertising, subscription chrome, AI tool grids, and multi-toolbar editors: they conflict with Hueday's calm archive and minimal implementation boundary.
- Broad staggered entrances, springs, gesture physics, new motion libraries, and decorative hover motion: unnecessary for the high-frequency mobile flow.
- Full external skill installation or copying into Kiro: only the rules listed above enter this specification.
