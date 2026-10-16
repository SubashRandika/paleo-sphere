# Progress record

## Current state

- **Phase:** 3 — First working 3D viewer (implemented; real-device validation pending)
- **Phase:** 4 — Realism and asset pipeline (implemented 2026-10-16)
- **Phase:** 5 — Scientific species content (implemented 2026-10-16; awaiting your review)
- **Task:** Review the five species pages and `docs/research/`; Task 3.6 (real-device check) still open
- **Next recommended action:** Read the research notes and switch the records you accept from `reviewed` to `published`, then approve Phase 6 (species explorer: navigation, switching, remaining 3D models).

## Phase checklist

- [x] Phase 0 — Discovery and requirements (approved 2026-10-15)
- [x] Phase 1 — Technical research and architecture (approved 2026-10-15)
  - [x] Architecture proposal; *T. rex* inspection; pipeline spike
  - [x] 1.3 Install KTX-Software and re-measure VRAM with KTX2 (done in Phase 4)
- [x] Phase 2 — Project foundation (2026-10-16)
  - [x] 2.1 Next.js 16.4 (App Router, Turbopack, Cache Components), TypeScript strict, ESLint, Prettier
  - [x] 2.2 Vitest + React Testing Library; Playwright (desktop + mobile Chromium)
  - [x] 2.3 Folder structure, design tokens (dark + light), species page and home layout
  - [x] 2.4 Zod species schema, repository, `ViewerConfig`, draft *T. rex* record
  - [x] 2.5 Verified: build ✓, typecheck ✓, lint ✓, format ✓, 20 unit/component tests ✓, 10 e2e tests ✓
- [ ] Phase 3 — First working 3D viewer (Claude implemented, 2026-10-16)
  - [x] 3.1 Blender prep script: life-size 12 m, flattened, identity transforms, head +Z
  - [x] 3.2 Asset pipeline script: high 4.02 MB / mobile 1.92 MB, est. 84 / 34 MB VRAM
  - [x] 3.3 Viewer: R3F canvas (demand frameloop, AgX), Lightformer studio IBL, floor pool + contact shadow, CameraControls with limits
  - [x] 3.4 Controls: rotate/zoom/pan (mouse + touch), Side/Front/Head presets, zoom buttons, reset, full screen, keyboard, reduced motion, aspect-fitted framing
  - [x] 3.5 States: loading %, error + retry, no-WebGL2 fallback with poster; poster generated from the live render
  - [x] Verified: 40 unit/component tests, 18 e2e tests (desktop + Pixel 7 emulation, SwiftShader), lazy loading confirmed (`perf.md`)
  - [ ] 3.6 Real-device check: frame rate and feel on a real desktop GPU and a real phone (you)
- [x] Phase 4 — Realism and asset pipeline (Claude implemented, 2026-10-16)
  - [x] 4.1 KTX2 pipeline + loader (KTX-Software 4.4.2); chosen hybrid ETC1S + WebP normals: 4.09 MB / ~35–42 MB VRAM (was 4.02 / ~84)
  - [x] 4.2 Blender Cycles reference render (`scripts/blender/reference_render.py`)
  - [x] 4.3 Lookdev page + contact sheets: texture encoding, tone mapping, maps, lighting, shadows (`docs/lookdev/`)
  - [x] 4.4 Anatomy review of the model (questions for Phase 5)
  - [x] 4.5 Render-vs-asset decision documented; Neutral tone mapping, stronger key, one-shot shadow map shipped
  - [x] Fixed: GPU warm-up before "ready"; Strict-Mode-safe deferred disposal; shadow-map sampler error (with e2e guard)
  - [x] Verified: 46 unit/component tests, 20 e2e tests, production build, `/dev/lookdev` 404 in production
  - [x] Task 1.3 closed: KTX-Software 4.4.2 installed (`C:\Program Files\KTX-Software\bin`)
- [x] Phase 5 — Scientific species content (Claude implemented, 2026-10-16)
  - [x] 5.1 Research tooling: Crossref / OpenAlex / PBDB / open-access full-text checks; `npm run content:verify` (54/54 citations pass)
  - [x] 5.2 Schema: optional `presentation`; `anatomy` / `integument` / `behaviour` / `habitat` sections; fact titles; citation `type`, volume and pages; `_italic_` markup; citation rule now applies to every shown record
  - [x] 5.3 Content for all five species (`src/content/species/`), per-claim research notes in `docs/research/`; T. rex 12 m confirmed (no asset rebuild); the "three fingers" question resolved (two per hand, correct)
  - [x] 5.4 Article UI: quick facts with estimate breakdown, fact cards, Known / Uncertain, collapsible In depth, evidence key, numbered sources; placeholder for species without a model
  - [x] Verified: 81 unit/component tests, 28 e2e tests (desktop + Pixel 7), typecheck, lint, format
  - [ ] 5.5 Your review → set accepted records to `published` (removes `noindex`)
- [x] Light theme (your request, 2026-10-16): header toggle, stored choice, no-flash init script, theme-aware 3D floor; contrast checked (`design-direction.md`)
- [ ] Phase 6 — Complete species explorer
- [ ] Phase 7 — Habitat and cinematic presentation
- [ ] Phase 8 — Quality, accessibility, and optimization
- [ ] Phase 9 — Deployment and release

## Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-15 | **Hybrid workflow**: Claude implements scaffolding/boilerplate with explanations; you implement 3D/rendering tasks; Claude reviews. | Learning focus stays on the rendering pipeline. |
| 2026-10-15 | **Non-commercial** project; **free assets only** (CC0, CC BY, CC BY-NC; no ND). | Budget and licensing posture. |
| 2026-10-15 | Species: *T. rex*, *Triceratops*, *Stegosaurus*, *Mamenchisaurus*, *Allosaurus*. | *Allosaurus* replaces *Velociraptor* (no evidence-compliant free model). |
| 2026-10-15 | Exclude game/film rips regardless of license label. | Uploader cannot license IP they don't own. |
| 2026-10-15 | PRD v0.1, design direction, architecture approved. | — |
| 2026-10-16 | Keep Next 16 defaults: Cache Components + Partial Prefetching. | Current recommended setup; species pages still prerender as fully static. |
| 2026-10-16 | Unknown species → `src/proxy.ts` rewrites to a 404 before rendering. | With streaming, `notFound()` in the page sends HTTP 200 + `noindex` ("soft 404"). Proxy gives a real 404 (Next docs: loading.md § Status codes). |
| 2026-10-16 | Species records may be `draft` without `content`; `reviewed`/`published` require content; `published` requires a citation on every level 1–3 claim. | Lets assets and layout progress before Phase 5 research, without displaying unverified facts. |
| 2026-10-16 | Zod `strictObject` everywhere in the schema. | Typos in content files fail validation instead of being silently dropped. |
| 2026-10-16 | ESLint blocks React/Next/three imports in `src/domain/`. | Enforces the architecture boundary automatically. |
| 2026-10-16 | Muted text token `#8A8478` → `#9A9488`. | Original failed WCAG AA (≈4.3:1) on panel surfaces. |
| 2026-10-16 | `@types/node` ^22 (generator default was ^20). | Matches the Node 22 runtime; required by Vitest 5 peer range. |
| 2026-10-16 | From Phase 3, Claude implements 3D tasks directly (your request). | Faster progress; explanations stay in code comments and `architecture.md` §12. |
| 2026-10-16 | Phase 3 rendering and pipeline decisions. | See `architecture.md` §12 (Lightformer IBL, specular extension dropped, ContactShadows y ≤ 0, `fitView`, poster capture). |
| 2026-10-16 | *T. rex* scaled to 12 m. | Phase 5: typical adult length per NHM London; largest specimens ≈ 13 m. No rebuild needed. |
| 2026-10-16 | Phase 4 rendering and pipeline decisions. | See `architecture.md` §13 and `lookdev/tyrannosaurus-rex.md` (KTX2 hybrid, Neutral tone mapping, one-shot shadows, GPU warm-up). |
| 2026-10-16 | Keep the *T. rex* asset for the MVP. | Rendering closed most of the gap to the Cycles reference; remaining issues are documented and need sourcing (Phase 5) or sculpt work. |
| 2026-10-16 | Species without a prepared model get content-only pages with a placeholder. | Research is ready before assets; avoids a low-quality model (CLAUDE.md §5). |
| 2026-10-16 | `reviewed` = verified by the project and shown with `noindex`; `published` = owner's sign-off, indexed. | Shown claims must be cited either way; publishing stays a human decision. |
| 2026-10-16 | *Mamenchisaurus* is a genus-level record; the other four are species. | Type species is fragmentary and the genus is non-monophyletic (Moore et al. 2023); the model is not species-specific. |
| 2026-10-16 | *Stegosaurus stenops* (not *S. armatus*). | ICZN Opinion 2320 (2013) made *S. stenops* the type species. |
| 2026-10-16 | Bibliographic data come from Crossref, never memory; checked by `content:verify`. | Two DOIs recalled from memory were wrong. |
| 2026-10-16 | Phase 5 decisions. | See `architecture.md` §15. |
| 2026-10-16 | Light theme: dark stays the default; the visitor's choice is stored. | CLAUDE.md §10 "dark-first … optional light theme". Following the OS setting instead is a one-line change in `THEME_INIT_SCRIPT`. |

## Assumptions

- Audience: curious adults and teens (12+); summary first, deeper science on demand.
- Devices: last 2 versions of Chrome/Edge/Firefox/Safari; iOS Safari 16+; mid-range Android (~2021+).

## Environment

- Node 22.12, npm 11.17, git 2.52 (repo initialised, nothing committed yet), ffmpeg.
- Blender 5.1: `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe` (not on PATH).
- Playwright Chromium headless shell installed.

## Selected asset licenses

| Species | Asset | Creator | License | Verified |
|---|---|---|---|---|
| *T. rex* | Tyrant King – Tyrannosaurus | Marcel Schanz | CC BY 4.0 | `license.txt` in download, 2026-10-15 |

## Known limitations

- *T. rex* model is static (no rig) and not life-size in source.
- Free-only assets: game-ready sculpts (~10k–100k faces), not film-grade.
- WebKit (Safari) not yet in the Playwright matrix; add before Phase 8.
- Viewer tested only on SwiftShader (CPU WebGL) and device emulation — no real-GPU frame-rate data yet.
- Web fonts total 331 KB; optimise in Phase 8 (`perf.md`).
- Source model: no lip tissue (labelled, level 3), a UV seam on the flank, fixed open-mouth pose, 2014 sculpt. Hands are correct (Phase 5).
- Content was reviewed by the project (Claude), not by a paleontologist. Paywalled papers were checked against abstracts only (`docs/research/README.md`).
- *Triceratops* mass and several lengths rest on a single museum figure with no stated method; labelled as such. No mass for *Mamenchisaurus*.
- Smithsonian NMNH and Field Museum pages refuse scripted requests, so they are not cited yet. PBDB citations link to the data API (JSON), not the human-readable page.
- Dev-only Next 16 notice "URL data outside of Suspense" on `/species/[slug]`; fix with species switching in Phase 6 (`architecture.md` §15).
- Lookdev images come from SwiftShader; real GPUs may pick different KTX2 target formats.

## Outstanding risks

See `architecture.md` §10.

## Research sources used

- Sketchfab Data API v3 — license and stats per model, retrieved 2026-10-15.
- npm registry — package versions and peer ranges, retrieved 2026-10-15.
- Next.js 16.4.1 bundled docs (`node_modules/next/dist/docs/`) — Cache Components, `generateStaticParams`, status codes, Proxy.
- Phase 5 species research (2026-10-16): Crossref, OpenAlex, Europe PMC, PBDB data API, Natural History Museum London Dino Directory, and 43 publications (40 with DOIs). Full list per species in `docs/research/`.
