# Progress record

## Current state

- **Phase:** 3 — First working 3D viewer (not started)
- **Task:** 3.1 — Prepare the *T. rex* in Blender (you)
- **Next recommended action:** Task 3.1. Task 1.3 (install KTX-Software) is still open and needed before Phase 4.

## Phase checklist

- [x] Phase 0 — Discovery and requirements (approved 2026-10-15)
- [x] Phase 1 — Technical research and architecture (approved 2026-10-15)
  - [x] Architecture proposal; *T. rex* inspection; pipeline spike
  - [ ] 1.3 Install KTX-Software (`toktx`) and re-measure VRAM with KTX2 (you; needed by Phase 4)
- [x] Phase 2 — Project foundation (2026-10-16)
  - [x] 2.1 Next.js 16.4 (App Router, Turbopack, Cache Components), TypeScript strict, ESLint, Prettier
  - [x] 2.2 Vitest + React Testing Library; Playwright (desktop + mobile Chromium)
  - [x] 2.3 Folder structure, design tokens (dark + light), species page and home layout
  - [x] 2.4 Zod species schema, repository, `ViewerConfig`, draft *T. rex* record
  - [x] 2.5 Verified: build ✓, typecheck ✓, lint ✓, format ✓, 20 unit/component tests ✓, 10 e2e tests ✓
- [ ] Phase 3 — First working 3D viewer
- [ ] Phase 4 — Realism and asset pipeline
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

## Outstanding risks

See `architecture.md` §10.

## Research sources used

- Sketchfab Data API v3 — license and stats per model, retrieved 2026-10-15.
- npm registry — package versions and peer ranges, retrieved 2026-10-15.
- Next.js 16.4.1 bundled docs (`node_modules/next/dist/docs/`) — Cache Components, `generateStaticParams`, status codes, Proxy.
