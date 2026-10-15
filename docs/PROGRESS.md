# Progress record

## Current state

- **Phase:** 3 — First working 3D viewer (implemented; real-device validation pending)
- **Phase:** 4 — Realism and asset pipeline (implemented 2026-10-16; awaiting your review)
- **Task:** Review `docs/lookdev/tyrannosaurus-rex.md`; Task 3.6 (real-device check) still open
- **Next recommended action:** Approve Phase 4 → Phase 5 (scientific species content), which also resolves the anatomy questions in the lookdev report.

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
- [ ] Phase 5 — Scientific species content
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
| 2026-10-16 | *T. rex* scaled to 12 m (provisional). | Needs a sourced length estimate in Phase 5; re-run the asset scripts when it changes. |
| 2026-10-16 | Phase 4 rendering and pipeline decisions. | See `architecture.md` §13 and `lookdev/tyrannosaurus-rex.md` (KTX2 hybrid, Neutral tone mapping, one-shot shadows, GPU warm-up). |
| 2026-10-16 | Keep the *T. rex* asset for the MVP. | Rendering closed most of the gap to the Cycles reference; remaining issues are documented and need sourcing (Phase 5) or sculpt work. |

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
- `T. rex` record is a draft: authority "Osborn, 1905" and all science fields to be verified in Phase 5.
- WebKit (Safari) not yet in the Playwright matrix; add before Phase 8.
- Viewer tested only on SwiftShader (CPU WebGL) and device emulation — no real-GPU frame-rate data yet.
- Web fonts total 331 KB; optimise in Phase 8 (`perf.md`).
- Source model (Phase 4 review): no lip tissue, possibly three clawed fingers on one hand, a UV seam on the flank, fixed open-mouth pose, 2014 sculpt. Resolve or label in Phase 5 (`lookdev/tyrannosaurus-rex.md` §6–7).
- Lookdev images come from SwiftShader; real GPUs may pick different KTX2 target formats.

## Outstanding risks

See `architecture.md` §10.

## Research sources used

- Sketchfab Data API v3 — license and stats per model, retrieved 2026-10-15.
- npm registry — package versions and peer ranges, retrieved 2026-10-15.
- Next.js 16.4.1 bundled docs (`node_modules/next/dist/docs/`) — Cache Components, `generateStaticParams`, status codes, Proxy.
