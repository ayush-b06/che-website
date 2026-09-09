# Aire motion explorations

## About page

`aire-motion-about.html` shares the current navigation, footer, type, and buttons. It now covers three researched stories: AJUA day-laborer outreach, the Minorities in Health Conference and Community Health Fair, and CHE's revival by Melissa Cruz and Amanda Perez. Alternating photos and copy replace the former repeated mission and large founding-year sections. Its layout is scoped in `aire-about.css`. Edit the About template in `build-aire-motion.js` and run that builder to regenerate it. About is linked from every page's navigation and the homepage's short About section. Navigation remains visible at 320px and in the floating state.

The active homepage, About, and Join use four photos published in CHE's 2025–26 Berkeley fundraising campaign. The marquee adds four distinct group photos from CHE's September/October 2025 and March 2026 website uploads, for eight unique photos total. See `assets/img/PHOTO-SOURCES.md` for exact sources, capture-date limitations, and copy references. The marquee uses optimized local copies and decorative repeats to cover wide screens; only the eight unique photos are announced by screen readers. Its 130-second animation preserves the previous pace with the doubled photo count. Main group photos preserve all people without cropping. Earlier archival assets remain available for the old design explorations.

## September 7 UX polish (current behavior)

The notes further below record earlier design iterations. These changes supersede the earlier horizontal-track, navigation-shadow, and thin-subpage descriptions:

- All three pages keep Events and Join visible on mobile; the homepage logo returns to `aire-motion.html`. The school lockup is omitted on phones to make room. The floating header has a softer shadow.
- Silk's timeline uses a 220svh spacer (210svh on phones). Its three facts share one centered grid cell, hold for reading, and briefly crossfade with 28px lateral movement. They are labeled Our roots / Our community / Meet us. The native Box Man still responds to page scroll everywhere, and reduced motion retains the unpinned static layout.
- The homepage's main closing action is Join CHE. Instagram is secondary; Support CHE lives in the shared footer.
- Join now distinguishes general membership (guidance from `content/join.json` and `content/site.json`) from the internship. The existing Google Form is **CHE Intern Application: Fall 2026**, with a posted deadline of September 4, 2026 at 11:59 p.m. It is kept as program information rather than the general membership action. The secretary and co-chair links let visitors ask about joining and future internships.
- Events has an introductory next-meeting card above the live Google Calendar. `content/aire-meetings.json` records the Fall 2026 general meetings checked against CHE's public ICS calendar on September 7. `aire-meetings.js` chooses the next unexpired entry in Berkeley time, including daylight saving changes, and falls back to the live calendar when the snapshot is exhausted. Without JavaScript, it shows the recurring meeting time rather than a stale specific date.

**Calendar maintenance:** the embedded Google Calendar remains live; the introductory card uses a local snapshot, not a live API. Update `content/aire-meetings.json` and run `node designs/build-aire-motion.js` when meeting details change or a new semester is posted. The current calendar does not list locations for the Fall general meetings, so the card asks visitors to check with the secretary. Do not copy the old meeting building from `site.json` without confirmation.

Build the homepage and both subpages with `node designs/build-aire-motion.js`. No renderer rebuild is needed for these layout changes. The existing walking checks were updated to verify centered holds and nonempty transitions instead of full-width travel.

Open `aire-motion.html`. The bottom control switches the artwork; typography, colors, content, photos, section ordering, and spacing come from the existing `aire.html`. The background now spans the full viewport width and at least the viewport height (780px minimum), independently of the compact intro. It covers the navigation and marquee too, fading into the page color near its bottom edge. Photos remain visible on landing.

## Silk's scroll-driven walker

Silk alone turns the history numbers into a horizontal timeline with a native 3D figure walking along it. The figure holds the centre of the screen above a fixed line while the years travel sideways beneath it, so an in-place walk cycle reads as walking forward through the decades. It faces screen-right — mirrored by placing the camera at negative X rather than scaling the model by -1, which would invert its normals — so it walks in the same direction the timeline advances.

The stride is driven by the window's scroll position, not by the rail's own travel: one walk cycle per 560px of page scroll, wrapped with a modulo. So the figure keeps walking while the section is far outside the viewport, and it stands still the moment scrolling stops — there is no clock-based playback. The same scroll position always produces the same pose, including on reverse scrolling. The existing pause button freezes the walk.

### The pin

The section is pinned — scroll-jacked — while it is on screen. `.impact-layout` is a 300svh spacer holding a `position:sticky` `.impact-pin` that is 100svh tall, so the section locks to the top of the viewport and roughly two further screens of scrolling are consumed before it releases. This is done with CSS sticky rather than by intercepting wheel events, so native scrolling, keyboard paging, and scrollbar dragging all keep working and nothing is ever `preventDefault`ed.

### The timeline

That vertical distance is spent travelling sideways. `.timeline` is an `overflow:hidden` window; `.numbers` inside it is the track, a flex row whose three `.stat` panels are each exactly one timeline wide. Three panels therefore travel two widths, and `silk-walker.js` maps pin progress straight onto that: it measures `scrollWidth - clientWidth` and writes the result into a `--shift` custom property the track translates by. Measuring rather than hard-coding percentages means the panel width, the wrap margins, and the viewport can all change without the arithmetic drifting.

The chapter nearest the centre renders at full strength and the others dim to 26%, so at 0% the page shows 1976, at 50% the fifty-year mark, and at 100% the active-member count. Each panel carries a kicker, the figure, and a single label line — `chapters` in `build-aire-motion.js` holds all three, and they intentionally differ from the numbers in `aire.html`, which is untouched. Each panel's marker is a dot centred on the walking line. The travel is contained by the timeline's hidden overflow, so it never leaks into a horizontal page scrollbar.

The walking line doubles as the progress meter: `:before` is the unwalked track, `:after` the accent fill driven by `transform: scaleX(--progress)`. Scaling a fill rather than animating `width` keeps the update on the compositor, so it never triggers layout while scrolling. A `01 / 03` counter sits above the line's right end.

### Two layout traps

`min-height: 0` on `.walker-rail` is load-bearing, not tidying. A flex item defaults to `min-height: auto`, and the WebGL canvas carries an intrinsic size from its `width`/`height` attributes, so without it the canvas overrode `flex-basis` and the figure grew to ~700px — swallowing the pin and clipping the caption. It only reproduced at 100% zoom: zooming out makes the viewport taller in CSS px, which left enough room to hide it. `check_silk_walker.py` now asserts nothing clips from 900px down to 620px.

`.timeline` is `flex: 0 1 auto`, not `1 1 auto`. Letting it fill the pin left a well of dead space under the caption; sizing it to content lets the figure, line, and caption centre as one group. The renderer also biases its camera frustum upward by the slack beneath the figure, so the feet land near the bottom of the canvas and it reads as walking on the line rather than hovering above it.

The whole treatment is gated behind a `data-reveal` attribute the script sets. Without JavaScript, or with reduced motion, the attribute is absent and the section falls back to the site's ordinary three-across numbers row with the figure above it: nothing pinned, nothing translated, nothing dimmed, every number plainly readable. The meter and the per-chapter copy are hidden in that fallback and in the other four motions, which keep their original numbers row untouched.

The GLB packs `walk`, `idle`, `jump`, `running`, and `victory` into one shared timeline, so the walk clip's keyframes begin at ~26.4s rather than at zero. The renderer rebases those track times to zero before scrubbing, giving a 1.03s cycle whose first and last keyframes coincide, so the loop has no seam.

`silk-walker.css` scopes the layout to `.motion-silk`. `silk-walker.js` loads the local `walker-renderer.js` once the page settles — deliberately not gated on the rail being visible, since the figure has to be ready to walk before the numbers scroll into view. Field, Weave, Current, and Contour retain the previous numbers row. Three.js renders into a transparent canvas: no iframe, Sketchfab player, background panel, or runtime CDN. Working WebGL is required. Model bytes and embedded textures are bundled for offline and double-click `file://` previews.

Model: [Box Man](https://sketchfab.com/3d-models/box-man-3239592d03d849548e4563f07ad95614) by [Zhang Shangbin](https://sketchfab.com/zhangshangbin1314159). The user-provided file is copied unchanged to `assets/models/box_man.glb`. Its glTF metadata carries no licence string, so confirm the licence on the model page before publishing; see `assets/models/ATTRIBUTION.md`. The on-page credit line was removed at the designer's request, so that file is now the only record of provenance — check whether the model's licence requires visible attribution before this ships. Only presentation scale, camera, lighting, and animation timing are adjusted.

## Floating navigation

On both pages the header condenses into a white pill once the reader scrolls past 60px. `aire-nav.css` and `aire-nav.js` are shared by the Silk page and the Events subpage; the script only toggles a `nav-pinned` class on `body`, so there is no measuring and no layout work on the scroll handler.

The header is `position:sticky`, not `fixed`. That matters: sticky keeps its 96px box in normal flow, so nothing below it moves when the pill appears. A fixed header would have dropped out of flow and yanked the whole page up by 96px at the threshold. Only the inner `.header-inner` wrapper — added by the build script — changes shape. The header band itself is `pointer-events:none` with the wrapper set back to `auto`, so the transparent area passes clicks through to whatever is scrolling underneath.

The bar spans the page's content width with the brand at one end and the links at the other, softly rounded at 18px. It sheds the wordmark's school block and tightens its type to stay slim, and drops in with a short cubic-bezier animation that reduced motion removes. Nothing else transitions: animating the background meant the white lingered for a beat when unpinning at the top of the page, so both directions are now instant and only the entrance animates. The bar clears the pinned timeline figure by 42px at 800px tall and 10px at 680px.

The bar is built to read as raised rather than flat on the glass: a faint top-to-bottom gradient so the face looks lit from above, two insets bevelling the top and bottom edges, and a ramp of five drop shadows from a tight contact shadow out to a wide ambient one. Stacking them beats one large blur, which just looks smudged. The phone breakpoint uses the same ramp, shortened.

`aire-nav.css` also restyles the "Join us" CTA (renamed from "Get involved"), and `aire-motion.css` gives "Say hello" the matching treatment: a lit gradient face, the ↗ in its own translucent rounded square, and a lift on hover instead of the default flat face and 45px gap. Corners are matched to the bar by proportion rather than by value: 18px on a 40px-tall button is 0.45 of its height and still reads as a pill, so the button takes 14px and "Say hello" 20px, both landing near the bar's own 0.29 ratio. Both cancel the inherited `transform:translate(3px,-3px)` on the arrow, since that span is now the disc itself. "Find us on Instagram" is deliberately left as a plain text link so the section keeps one clear primary action.

`aire-nav.css` also centres the "Join us" label. The ↗ glyph makes an 18px line box while the label's is only 14px, so under flexbox's default stretch the label top-aligned and sat 4px high inside its pill. The fix is scoped to these two pages rather than patched into the shared `styles.css`, where it would alter the other designs.

## Events subpage

`aire-motion-events.html` is generated by the same build. The navigation now reads Events / Get involved (About us and Our comunidad were dropped from the bar, though both sections remain on the page), and Events points here.

The page is deliberately thin: heading, the Google Calendar agenda embed, the "Add CHE to your own calendar" link, and the footer. Its header and footer are lifted out of the just-built `aire-motion.html` by the build script rather than duplicated, so they cannot drift; only the brand and #join hrefs are rewritten to point back at the main page, and Events gets `aria-current="page"`.

It loads `styles.css` and `aire-events.css` only. No `aire-motion.js`, no backdrop canvas, no walker: the motion script expects `.motion-description` to exist and would throw without the switcher markup, and none of it earns its place on a calendar page. `aire-events.css` therefore only sizes the calendar and the one heading; the header, footer, type, and colours all come from the shared stylesheet.

The calendar iframe is the one external request anywhere in this design.

Run `check_silk_walker.py` with Python Playwright and installed Chrome to check offline loading, no iframe or external requests, walking while the section is off screen, that nothing scroll-snaps, the pin holding for about two screens and then releasing, the track travelling exactly two panel widths with each chapter centring in turn, no horizontal page overflow at any point, nothing clipped from 900px down to 620px, the figure sitting centred above the line, rendered pose changes, stationary pose at rest, deterministic reverse seeking, pause, 390px and 320px layouts, reduced motion, and switching back to Field.

Renderer source: `designs/renderer/box-man.js`. Rebuild with `npm ci --prefix designs/renderer` then `npm run build --prefix designs/renderer` from the project root. The committed bundle needs no install to preview. Pinned dependencies and lockfile are in `designs/renderer/`. The earlier phoenix renderer is kept as `renderer/phoenix.js` with a `build:phoenix` script; nothing on the page uses it, so `phoenix-renderer.js` and `assets/models/phoenix_bird.glb` can be deleted whenever you like.

- Silk: translucent ribbon contours whose shape lifts toward the pointer.
- Field: a grid of small dots displaced around the pointer.
- Weave: a fine mesh stretches around the pointer.
- Current: tiny directional strokes flow and turn around the pointer.
- Contour: organic contour lines deform near the pointer.

The preview switcher and its blurb are hidden on Silk for now, via a single `.motion-silk .motion-picker{display:none}` rule in `silk-walker.css` — delete it to bring the bar back. It is hidden rather than removed so `aire-motion.js` can still write to `.motion-description`. Because Silk is the default, reaching the other four now means using the query string. Note the bar also carries the "back to all designs" arrow, which goes with it.

Share a selection locally with `aire-motion.html?motion=silk` (or field/weave/current/contour). The control updates the URL without reloading or resetting scroll. Bloom, Ripple, and Original were removed from this preview; old query values fall back to Silk. The separate original Aire file is preserved.

Run `node designs/build-aire-motion.js` from the CHE project to regenerate the page after rebuilding Aire. Edit `aire-motion.js` and `aire-motion.css` for background effects and controls. Background artwork is drawn locally with Canvas 2D, capped at 1.5 device pixel ratio and approximately 30 frames per second. Motion stops when the background leaves view, the tab is hidden, the pause control is used, or reduced motion is preferred. Pointer tracking covers the full background, including screen edges outside the intro. The separate 3D renderer draws only when its pose or size changes, capped at 2 device pixel ratio.
