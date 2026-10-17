# Progress record

## Current state

- **Phase:** 3 — First working 3D viewer (implemented; real-device validation pending)
- **Phase:** 4 — Realism and asset pipeline (implemented 2026-10-16)
- **Phase:** 5 — Scientific species content (approved 2026-10-16; records published)
- **Phase:** 6 — Complete species explorer (in progress)
- **Task:** Three more Jurassic species (your request, 2026-10-17): *Dilophosaurus wetherilli*, *Brontosaurus excelsus*, *Brachiosaurus altithorax* — researched, modelled, animated, with anatomy markers (`docs/lookdev/species-models.md`). Records are `reviewed` (shown, not indexed) until you sign them off. Task 3.6 (real-device check) still open
- **Phase 7:** a first habitat (Morrison floodplain) was built on 2026-10-17 and reverted at your decision; not restarted.
- **Next recommended action:** Review the three new species in the browser and their research notes (`docs/research/`), then publish them (status `published`) or list changes.

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
  - [x] 5.5 Your review → all five records `published` (approved 2026-10-16)
- [x] Light theme (your request, 2026-10-16): header toggle, stored choice, no-flash init script, theme-aware 3D floor; contrast checked (`design-direction.md`)
- [ ] Phase 6 — Complete species explorer (Claude implementing, 2026-10-16)
  - [x] 6.1 Persistent 3D stage in `app/species/layout.tsx`; model swap with per-model error boundary; `instant = false` keeps all text in server HTML
  - [x] 6.2 Species browser on the home page (search; period, diet and group filters; oldest first) and the strata rail / phone strip on species pages
  - [x] 6.3 Structured info panel with a length comparison and jump links
  - [x] 6.4 Anatomy mode: 5 *T. rex* hotspots (Blender ray-cast positions, cited notes), mode switch, DOM markers, note card
  - [x] Idle animation and anatomy markers for *Triceratops*, *Stegosaurus*, *Allosaurus* and *Mamenchisaurus* (your request): own rigs, 12 s idles, 4 cited markers each (`lookdev/species-models.md`). Tests: 121 unit/component, 54 e2e (Playwright limited to 4 workers: CPU WebGL)
  - [x] 6.5 Models for *Triceratops*, *Stegosaurus*, *Mamenchisaurus*, *Allosaurus*; fossil comparison mode with the Smithsonian *Triceratops* mount (cast) and a *T. rex* skull cast (`lookdev/species-models.md`, `architecture.md` §18). Tests: 121 unit/component, 54 e2e, 56/56 citations
  - [x] 6.6 `docs/adding-a-species.md`; tests: 107 unit/component, 42 e2e (desktop + Pixel 7)
  - [x] Rig test for the *T. rex* idle animation (your request): **passed** for moderate motion, see `lookdev/tyrannosaurus-rex-rig.md`
  - [x] *T. rex* idle animation: 12 s looping clip, Play/Pause in the toolbar, caption + level-4 note, CC BY modification recorded (`architecture.md` §17). A synthesised breathing sound was tried and removed at your review (not realistic enough)
  - [x] Three more Jurassic species (your request, 2026-10-17): *Dilophosaurus*, *Brontosaurus*, *Brachiosaurus*. Sketchfab sweep of ~55 Jurassic taxa; two further picks (*Anchiornis*, *Archaeopteryx*) declined by you, and no other legitimate model of adequate quality exists. 74/74 citations verify
- [ ] Phase 7 — Habitat and cinematic presentation (first attempt reverted, 2026-10-17)
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
| 2026-10-16 | All five species records `published`. | Your approval of Phase 5. |
| 2026-10-16 | Species pages use `instant = false` instead of `<Suspense>` around `params`. | Suspense hid the article from no-JS visitors; see `architecture.md` §16. |
| 2026-10-16 | Phase 6 decisions. | See `architecture.md` §16. |
| 2026-10-17 | Idle animation has no sound. | Your review: the synthesised breathing did not sound realistic. A call would contradict the fixed open mouth and the idle never steps, so no sound beats an unconvincing one |
| 2026-10-16 | Idle animation decisions. | See `architecture.md` §17. |
| 2026-10-17 | Fossil scans are scaled only for display and say nothing about size; the skeleton is shown lying on its side, as mounted. | The scan units are undocumented and the skull's original specimen is not named, so any size statement would be invented. |
| 2026-10-17 | Curved models are scaled along the midline (snout to tail tip), not the bounding box. | Published lengths follow the backbone; the *Mamenchisaurus* box was 1.24× shorter than its body. |
| 2026-10-17 | All materials are forced non-metallic in the web build. | Skin, horn and bone are dielectrics; two downloads had metallic = 1 with stray metal pixels. |
| 2026-10-17 | Added *Dilophosaurus*, *Brontosaurus*, *Brachiosaurus* (your choice of 3 of 5 proposed). | Only models passing the licence and quality rules; see `asset-research.md` §8. |
| 2026-10-17 | Fixed: species pages rendered zoomed out on phones (layout 1,250 px wide on a 412 px screen). | The phone species strip's screen-reader labels are absolutely positioned and escaped its scroll container; the container is now `relative`. Found while chasing a mobile e2e failure. |
| 2026-10-17 | *Brontosaurus* model scaled to the type specimen's femur, not to the 1883 length. | A direct bone measurement (1.725 m, YPM 1980) beats an 1883 estimate; the article shows Marsh's figure with its date. |
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
| *Triceratops* | Triceratops | DailyArt | CC BY-NC 4.0 | `license.txt`, 2026-10-17 |
| *Stegosaurus* | Stegosaurus | PAndras | CC BY 4.0 | `license.txt`, 2026-10-17 |
| *Allosaurus* | Animated Allosaurus (Free) | Anees Animates | CC BY-NC 4.0 | `license.txt`, 2026-10-17 |
| *Dilophosaurus* | Dilophosaurus | Marcel Schanz | CC BY 4.0 | `license.txt`, 2026-10-17 |
| *Brontosaurus* | Brontosaurus | PAndras | CC BY 4.0 | `license.txt`, 2026-10-17 |
| *Brachiosaurus* | Brachiosaurus realistic | Nazar Striletskyj | CC BY 4.0 | `license.txt`, 2026-10-17 |
| *Mamenchisaurus* | Mamen River Dragon | DailyArt | CC BY-NC 4.0 | `license.txt`, 2026-10-17 |
| *Triceratops* (fossil) | Triceratops Horridus Marsh (USNM PAL 500000, cast) | Smithsonian Institution | CC0 1.0 | `license.txt`, 2026-10-17 |
| *T. rex* (fossil) | Vertebrate: Tyrannosaurus rex skull (MOTE), cast | Digital Atlas of Ancient Life (Emily Hauf) | CC0 1.0 | `license.txt`, 2026-10-17 |

## Known limitations

- *T. rex* rig suits only small, slow motion: no walk cycle, and the mouth cannot close (sculpted open). Source model is not life-size (scaled in preparation).
- Anatomy-mode camera moves run at ~30 fps (median 33 ms) on an integrated Radeon 860M, with the static model as well as the rigged one: each of the 5 markers raycasts the whole model on every frame. Fix proposed for Phase 8: test occlusion only when the camera settles, or against a low-poly stand-in.
- Free-only assets: game-ready sculpts (~10k–100k faces), not film-grade. The *Triceratops* is the weakest (11k triangles, soft silhouette up close); the *Stegosaurus* texture is very dark.
- Three CC BY-NC models (*Triceratops*, *Allosaurus*, *Mamenchisaurus*) must be replaced if the project ever becomes commercial.
- *Brontosaurus*: the only published length found is Marsh's 1883 estimate (about 15 m); the model is scaled to the type specimen's femur instead (about 21 m, ±10 %). *Brachiosaurus*: no normal map (detail from the colour texture only); purple colour is the artist's.
- Fossil scans carry no size statement (undocumented scan units; the skull's original specimen is not named). The *T. rex* skull is 191k triangles even on mobile; reduce further if phones struggle (Task 3.6).
- The idle rigs suit small, slow movements only (as for the *T. rex*); no walking. Weights were checked with renders, not painted by hand.
- WebKit (Safari) not yet in the Playwright matrix; add before Phase 8.
- Real-GPU frame-rate data from one laptop only (AMD Radeon 860M, Chrome); no phone measurements yet (Task 3.6).
- Web fonts total 331 KB; optimise in Phase 8 (`perf.md`).
- Source model: no lip tissue (labelled, level 3), a UV seam on the flank, fixed open-mouth pose, 2014 sculpt. Hands are correct (Phase 5).
- Content was reviewed by the project (Claude), not by a paleontologist. Paywalled papers were checked against abstracts only (`docs/research/README.md`).
- *Triceratops* mass and several lengths rest on a single museum figure with no stated method; labelled as such. No mass for *Mamenchisaurus*.
- Smithsonian NMNH and Field Museum pages refuse scripted requests, so they are not cited yet. PBDB citations link to the data API (JSON), not the human-readable page.
- Lookdev images come from SwiftShader; real GPUs may pick different KTX2 target formats.

## Outstanding risks

See `architecture.md` §10.

## Research sources used

- Sketchfab Data API v3 — license and stats per model, retrieved 2026-10-15.
- npm registry — package versions and peer ranges, retrieved 2026-10-15.
- Next.js 16.4.1 bundled docs (`node_modules/next/dist/docs/`) — Cache Components, `generateStaticParams`, status codes, Proxy.
- Phase 5 species research (2026-10-16): Crossref, OpenAlex, Europe PMC, PBDB data API, Natural History Museum London Dino Directory, and 43 publications (40 with DOIs). Full list per species in `docs/research/`.
