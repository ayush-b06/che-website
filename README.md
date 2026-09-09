# CHE — Comunidad for Health Equity

## Current website: Silk / Aire

The finished website has Home, About, Events, and Join pages, an eight-photo marquee, a cursor-responsive background, and a scroll-driven 3D character. No database or backend is required.

### Cloudflare Pages setup

Connect this GitHub repository using **Pages → Import an existing Git repository**:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `node package-preview.js --production` |
| Build output directory | `public` |
| Root directory | Leave blank (repository root) |

The build packages the current rendered pages and required assets. Development files and old experiments are not published. No dependencies need installing for this build. Cloudflare publishes a new version after each push to `main`.

### Editing and updates

- Current pages: `designs/aire-motion.html`, `aire-motion-about.html`, `aire-motion-events.html`, and `aire-motion-join.html`.
- Edit rendered pages directly, or edit `designs/build-aire-motion.js` and run `node designs/build-aire-motion.js` to regenerate all four. Do not regenerate over unported direct edits.
- Shared styling and scripts live in `designs/`; the publishing build copies only required files. The 3D model is embedded in `walker-renderer.js`, so no renderer build is needed to deploy. Original renderer development files remain local and are not part of this publishing repository.
- After reviewing your changes, commit and push them to `main`.
- For a separate local upload copy, run `node package-preview.js`. For a production build, run `node package-preview.js --production`; it creates `public/` and refuses to overwrite an existing build. Move an earlier `public/` aside before rebuilding locally.
- `.gitignore` deliberately allows only active files. Add new required asset paths to it when necessary.

See [HOSTING.md](HOSTING.md) for details. Photo and model provenance are recorded under `assets/`; this repository does not grant third-party asset rights. Confirm Box Man web-use rights before sharing the site.

---

## Historical project notes (earlier designs, not the deployed site)

The following notes describe the original local experiments. Their build scripts and output folders are intentionally excluded from this publishing repository; use the current instructions above.

A website for CHE at UC Berkeley: a Chicanx/Latinx pre-health organization
founded in 1976.

**To edit content, read [EDITING-GUIDE.md](EDITING-GUIDE.md).** This file is the
technical overview.

## Build

Two designs are in play while CHE decides which to adopt. Both render the same
eight pages from the same content.

```sh
node build.js            # "warm" theme   → dist/
node build-studio.js     # "studio" theme → dist-studio/

open dist/index.html
open dist-studio/index.html
```

Node 18+. No dependencies, no `npm install`, no lockfile, no build tooling to
keep current. Each builder reads `content/*.json` through `lib/content.js` and
writes static HTML into its output folder, copying `assets/` alongside.

- **warm** — terracotta/marigold/teal on cream, Fraunces + Public Sans,
  photo-led, arch shapes, papel picado divider. Has a dark mode.
- **studio** — near-white canvas, single deep-green accent, Inter with
  Instrument Serif italic accents, bento grid, abstract arc line-art.
  Light-only by design.

Once one is chosen, delete the other's builder, its stylesheet, its mark SVG and
its `dist-*` folder. Nothing else references them.

## Why it's built this way

The organization turns over its entire board every year, and its last website —
a WordPress install at `ocf.berkeley.edu/~calche` — went down and stayed down.
So the priorities here, in order:

1. **A non-technical board member can update it.** All copy lives in commented
   JSON under `content/`. Layout lives in `build.js`. The two never mix.
2. **Nothing can rot.** Zero dependencies, self-hosted fonts, no CDN, no API
   keys, no database, no framework version to chase. The output is plain HTML
   that will render identically in ten years.
3. **Unfinished content is loud.** Any content value containing `TODO` renders
   inside a highlighted `<mark class="todo">`, and a site-wide draft banner
   reports the count. The build prints a checklist of what's left. Placeholders
   cannot ship silently.
4. **Dates never go stale.** The Events page embeds CHE's existing public Google
   Calendar, so event dates update with no rebuild and no code change.

## Layout

```
content/          JSON — all copy, all data. The only files most people touch.
lib/content.js    shared: JSON loading, inline formatting, TODO tracking,
                  output scaffolding. Both themes import this, so the two
                  designs can never say different things.
assets/           css (one file per theme), js (one small file),
                  self-hosted woff2 fonts, images
build.js          warm theme: layout only
build-studio.js   studio theme: layout only
dist/, dist-studio/   generated output — safe to delete, never edit by hand
```

## Pages

`index` · `about` · `programs` · `events` · `board` · `join` · `scholarship` · `contact`

Flat filenames with relative paths, so `dist/` works opened directly from disk
(`file://`) as well as from any web host, at any subpath, with no config.

## Design

Warm palette (terracotta / marigold / teal on cream), Fraunces for display and
Public Sans for body — both self-hosted, both SIL OFL. Four CSS custom
properties at the top of `assets/css/site.css` drive the entire palette; a
dark-mode block redefines the same tokens for `prefers-color-scheme: dark`.

Accessibility: semantic landmarks, a skip link, visible focus rings, `<details>`
for FAQ disclosure, `aria-current` on the active nav item, and a mobile menu
that degrades to always-visible if JavaScript fails. The site has exactly one
JavaScript file and works without it.

## Content provenance

Mission, history, program requirements, and event descriptions were recovered
from Internet Archive snapshots of the old WordPress site, then rewritten and
reorganized. Anything that could not be verified as current is marked `TODO`
rather than guessed at — notably the meeting location, dues amount, board
roster, and scholarship details.
