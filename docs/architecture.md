# Architecture — Phase 1 (for approval)

Status: **proposal** · 2026-10-15 · Versions checked on npm the same day.

| Package | Version | Note |
|---|---|---|
| next | 16.4.1 | App Router |
| react / react-dom | 19.3.x | R3F 9 peer range is `>=19 <19.4` — pin until R3F widens it |
| three | 0.186.1 | |
| @react-three/fiber | 9.8.2 | |
| @react-three/drei | 10.7.9 | |
| gsap / @gsap/react | 3.15.0 / 2.1.2 | UI motion only |
| zod | 4.6.7 | |
| tailwindcss | 4.3.3 | CSS-first `@theme` tokens |
| vitest / @testing-library/react | 5.0.5 / 16.3.3 | |
| @playwright/test | 1.64.1 | |
| @gltf-transform/cli | 4.5.1 | Asset pipeline (dev tool, not shipped) |
| Blender | 5.1 | `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe` |

---

## 1. React Three Fiber vs. direct Three.js

**Recommendation: React Three Fiber (R3F) + Drei, with deliberate escape hatches into plain Three.js.**

| Concern | Direct Three.js | R3F |
|---|---|---|
| Integration with Next/React UI | Manual: mount a canvas in `useEffect`, sync state by hand, tear down on unmount | Scene is part of the React tree; props flow in naturally |
| Loading states | Hand-rolled loader promises | `<Suspense>` + `useGLTF` give loading and caching for free |
| Disposal | Fully manual (`geometry.dispose()`, `material.dispose()`, textures) | Auto-disposes objects R3F creates; **cached GLTF resources still need explicit clearing** |
| Helpers | Import from `three/examples` and wire yourself | Drei: `CameraControls`, `Environment`, `ContactShadows`, `Html`, `PerformanceMonitor`, `useProgress` |
| Performance | Full control | Same renderer underneath; risk is React re-renders → mitigated by refs + `useFrame` + store selectors |
| Learning value | You see everything | Hides the loop — so each task will name the underlying Three.js concept |

**What R3F maps to, so the abstraction stays transparent:**

- `<Canvas>` → creates `WebGLRenderer`, `Scene`, `PerspectiveCamera`, and the `requestAnimationFrame` loop.
- `useFrame(cb)` → your code inside that loop, called every rendered frame.
- `useThree()` → direct access to `gl` (renderer), `scene`, `camera`, `invalidate`.
- JSX like `<mesh>` → `new THREE.Mesh()` added to the parent with `.add()`.

**Key decision: `frameloop="demand"`.** A specimen viewer is still most of the time. In demand mode R3F renders only when something calls `invalidate()` (camera moves, animation plays, a model loads). This saves battery and GPU time on mobile, and it is the single largest performance lever we have.

## 2. Renderer: WebGL2, not WebGPU

- Our device floor includes **iOS Safari 16**, which has no WebGPU. A WebGL2 path is mandatory regardless.
- Three's `WebGPURenderer` can fall back to WebGL2, but the R3F ecosystem we rely on (Drei materials, `postprocessing`) is built against `WebGLRenderer`.
- Nothing in the MVP (one hero model, IBL, contact shadow) needs compute shaders.

**Decision:** `WebGLRenderer` on WebGL2. Revisit WebGPU after MVP if a habitat effect needs it.

Renderer settings (to verify visually in Phase 4):

- Output colour space sRGB (Three default).
- Tone mapping: compare **AgX** and **Neutral** (Khronos PBR Neutral) on the real asset; ACES tends to over-saturate skin tones.
- Antialiasing: MSAA via `antialias: true`; no post-process AA unless post-processing is introduced.
- Pixel ratio: `dpr={[1, 2]}`, stepped down by `PerformanceMonitor` when frame rate drops.

## 3. Lighting and materials

| Element | Choice | Why |
|---|---|---|
| Image-based lighting | CC0 studio HDRI from Poly Haven, 1K–2K, via `<Environment files>` | IBL gives believable reflections and soft fill that a few point lights can't. |
| Key light | One `DirectionalLight` | Gives shape and direction; lets us control the "museum spotlight" look. |
| Rim light | Optional second directional, low intensity | Separates the silhouette from the dark background. |
| Ground shadow | `ContactShadows` (Studio) | Grounds the animal for a fraction of the cost of real-time shadow maps; the model is mostly static. |
| Real-time shadows | Off in Studio; evaluated for Habitat in Phase 7 | Shadow maps re-render the scene from the light's view — measured before adoption. |
| Post-processing | None at MVP; SSAO (N8AO) evaluated in Phase 4 with before/after measurements | §5 of CLAUDE.md: every effect must justify its cost. |
| Materials | glTF `MeshStandardMaterial` from the asset (base colour, normal, ORM) | The glTF PBR metal-rough model is what our assets and three support natively. Skin may get `MeshPhysicalMaterial` sheen/clearcoat only if Phase 4 shows a need. |

## 4. Asset format and pipeline

**Format:** GLB (binary glTF 2.0).

**Compression:**

| Data | Choice | Why |
|---|---|---|
| Geometry | **Meshopt** (`EXT_meshopt_compression`) | Small, fast decoder; also compresses animation data well. Draco compresses static geometry slightly better, but needs a heavier WASM decoder and doesn't help animations. |
| Textures | **KTX2 / Basis** — ETC1S for base colour, UASTC for normal maps | **The key concept:** PNG/JPEG/WebP only shrink the *download*. On the GPU they are decoded to raw RGBA. A 4096² texture becomes ~64 MB, or ~85 MB with mipmaps. KTX2 stays compressed in GPU memory, typically 4–8× smaller. This is what keeps iOS Safari from killing the tab. |
| Fallback | WebP textures | Used only if the KTX2 encoder (`toktx` from KTX-Software) can't be installed. |

**Pipeline (repeatable, scripted):**

```
Sketchfab download (glTF, original)        → assets-src/<slug>/   (git-ignored, license file kept)
   ↓ Blender 5.1: inspect, scale to metres, feet on y=0, facing +Z,
     apply transforms, remove hidden/junk meshes, check materials
assets-src/<slug>/<slug>.blend → export .glb
   ↓ gltf-transform: metalrough (if spec-gloss), flatten, dedup, prune, weld,
     resize (2048 / 1024), ktx2, meshopt
public/models/<slug>/<slug>-high.glb       (desktop, 2K textures)
public/models/<slug>/<slug>-mobile.glb     (mobile, 1K textures)
public/models/<slug>/<slug>-poster.webp    (static render: LCP image + no-WebGL fallback)
```

The pipeline is a script (`scripts/build-asset.ts`) so every model is processed the same way and the result is reproducible.

## 5. Application architecture

### Layers and boundaries

```
┌───────────────────────────────── app/ (routes, server components) ───────────────┐
│  species/[slug]/page.tsx  — SSG; renders article HTML + <ViewerIsland>           │
└──────────────┬───────────────────────────────────────────────┬───────────────────┘
               │ reads                                         │ renders
┌──────────────▼──────────────┐                 ┌──────────────▼───────────────────┐
│ domain/species              │                 │ features/                        │
│  schema.ts  (Zod)           │  ViewerConfig   │  viewer/   (client only, R3F)    │
│  repository.ts (get/list)   │ ──────────────► │  explorer/ (strata rail, search) │
│  no React, no three         │                 │  article/  (facts, sources)      │
└──────────────▲──────────────┘                 └──────────────┬───────────────────┘
               │ validated at build                            │ uses
┌──────────────┴──────────────┐                 ┌──────────────▼───────────────────┐
│ content/species/<slug>.ts   │                 │ ui/  design-system primitives    │
│ (science + presentation)    │                 │ (Button, Badge, Sheet, Tabs)     │
└─────────────────────────────┘                 └──────────────────────────────────┘
```

Rules:

- `domain/` never imports React or three. It can move to a CMS later without touching the viewer.
- The viewer receives a **`ViewerConfig`** (asset URLs, camera presets, hotspot positions, modes). It never sees citations or prose.
- `features/*` may import `ui/` and `domain/` types; features don't import each other.

### Folder structure

```
src/
  app/
    layout.tsx
    page.tsx                       explorer landing
    species/[slug]/page.tsx        species page (SSG)
  content/species/                 one file per species
  domain/species/                  schema, types, repository
  features/
    viewer/
      ViewerIsland.tsx             client boundary; next/dynamic, ssr:false
      Scene.tsx                    Canvas, renderer settings, environment
      SpeciesModel.tsx             useGLTF, centring, disposal
      CameraRig.tsx                CameraControls, presets, reset
      Hotspots.tsx                 Drei <Html> buttons
      ViewerControls.tsx           DOM toolbar (outside canvas)
      viewer-store.ts              small store for UI ↔ canvas commands
    explorer/                      StrataRail, SpeciesSearch, filters
    article/                       QuickFacts, EvidenceBadge, Sources, Uncertainty
  ui/                              primitives + tokens
  lib/                             pure utilities (device tier, formatting)
scripts/build-asset.ts             asset pipeline
assets-src/                        raw downloads (git-ignored)
public/models/<slug>/              optimised deliverables
tests/e2e/                         Playwright
```

### UI ↔ canvas communication

Toolbar buttons (DOM) must command the camera (inside the canvas) without re-rendering the scene tree.

**Decision: a small Zustand store** (`viewer-store.ts`). Zustand is already a dependency of R3F, so it adds no weight. The canvas subscribes with selectors or `subscribe()` and acts imperatively through refs. Alternative considered: React context — it re-renders every consumer on each change, which is exactly what to avoid near the render loop.

### Camera and controls

**Drei `<CameraControls>`** (wraps the `camera-controls` library) instead of `OrbitControls`. It has built-in smooth, interruptible transitions (`setLookAt(..., true)`, `fitToBox`), which we need for presets, reset, and hotspot focus. Configured with distance limits, polar-angle limits (camera stays above the ground), and touch gestures (one finger rotates, two fingers pinch-zoom and pan).

**GSAP is used for DOM motion only** (strata rail, panels). Camera motion stays in CameraControls so two animation systems never fight over the camera.

### Hotspots

- 3D anchor positions are stored in the presentation data in model space, measured after the pipeline is final (so they don't drift).
- They are rendered as real `<button>`s via Drei `<Html>` with occlusion, so they are keyboard-focusable and have accessible names.
- The same hotspots also appear as a plain DOM list in the article, so they work without the canvas.

## 6. Species data model

Two parts in one file per species, validated by one Zod schema:

```
Species
├─ id, slug, scientificName, authority, commonNames[], synonyms[]
├─ content                      ← science (never read by the viewer)
│  ├─ taxonomy: clade path
│  ├─ age: { minMa, maxMa, stage, citationIds }
│  ├─ localities[]: { formation, region, country, citationIds }
│  ├─ measurements: { length | hipHeight | mass:
│  │     { estimates[]: { min, max, unit, method, citationId } } }
│  ├─ diet: Claim
│  ├─ summary, facts[] (3–5), known[], uncertain[]: Claim[]
│  ├─ discovery: Claim[]
│  ├─ hotspotNotes[]: { hotspotId, title, body: Claim }
│  └─ citations[]: { id, authors, year, title, venue, doi?, url, accessed }
├─ presentation                 ← rendering (becomes ViewerConfig)
│  ├─ model: { high, mobile, poster, scaleMetres }
│  ├─ attribution: { creator, title, sourceUrl, license, licenseUrl, modifications }
│  ├─ appearanceNotes[]: Claim  (what matches evidence vs inferred)
│  ├─ camera: { default, presets[]: { id, label, position, target } , limits }
│  ├─ modes: ('studio'|'habitat'|'anatomy'|'fossil')[]
│  ├─ hotspots[]: { id, position: [x,y,z] }
│  ├─ habitatId?, fossilAsset?: { src, label, isCast, attribution }
│  └─ a11y: { modelDescription }
└─ review: { status: 'draft'|'reviewed'|'published', reviewedOn }

Claim = { text, level: 1|2|3|4, citationIds: string[] }
```

Notable schema rules (enforced by Zod refinements):

- Every `citationId` must resolve to an entry in `citations`.
- `minMa >= maxMa`. Ages count backwards, so the older bound is the larger number.
- `facts` has a length of 3–5.
- `published` requires `reviewedOn` and at least one citation per claim.

**Validation boundary:** at build time. The repository parses every content file; `generateStaticParams` uses it, so invalid content **fails the build**. A Vitest test runs the same parse. No Zod in the client bundle.

**Why TypeScript files rather than JSON:** type-checking while you write content, comments allowed, and imports of shared citations. Migrating to a CMS later is a repository swap.

## 7. Loading strategy

1. **Server:** the species page is statically generated. Article text, quick facts, and the poster image are in the initial HTML. The poster is the LCP element.
2. **Client island:** `ViewerIsland` loads the R3F bundle with `next/dynamic` (`ssr: false`). three + R3F + Drei never block the text.
3. **Capability check:** if WebGL2 is unavailable, the poster stays and a message explains why. No canvas is mounted.
4. **Asset tier:** choose `-mobile` or `-high` GLB from viewport width and `navigator.deviceMemory` where available (simple heuristic; refined after measurement).
5. **Model load:** `<Suspense>` with a progress indicator (`useProgress`) over the poster. An error boundary shows a retry action on failure.
6. **Prefetch:** hovering or focusing a species in the strata rail calls `useGLTF.preload` for that model.
7. **Disposal:** when switching species, clear the previous model from the GLTF cache (`useGLTF.clear`), then verify with `renderer.info.memory` that geometry and texture counts return to baseline.
8. **Idle work:** frameloop `demand`; pause entirely when the viewer scrolls offscreen (IntersectionObserver → `frameloop="never"`).

## 8. Testing approach

| Layer | Tool | What |
|---|---|---|
| Content | Vitest | Every species file passes the schema; citation integrity; no `published` record with missing sources |
| Pure logic | Vitest | Device-tier selection, camera preset maths, formatting of ranges ("7.5–9 m") |
| Components | Vitest + RTL | Viewer toolbar, evidence badge, quick facts, strata rail filtering. Canvas mocked — jsdom has no WebGL |
| End-to-end | Playwright | Text visible with JS disabled; viewer reaches `data-state="ready"`; toolbar buttons change camera state; species switching; keyboard-only path; WebGL-disabled fallback |
| Accessibility | Playwright + `@axe-core/playwright` | Automated a11y rules on each page (one extra dev dependency; justified by §12) |
| Performance | Chrome DevTools, Lighthouse, `renderer.info`, dev-only stats overlay | FPS, load time, GPU memory before/after a switch — recorded in `docs/perf.md` |

Canvas screenshot diffs are **not** used in CI. WebGL output differs across GPUs and drivers, so they would flake. Visual quality uses the lookdev process below.

## 9. Visual-quality validation plan

- **Lookdev route** (`/dev/lookdev`, dev-only): a fixed camera, toggles for tone mapping, environment, each texture map, and light intensities.
- **Reference renders:** render each asset in Blender (Cycles) from the same three angles as ground truth. If the web version looks much worse than Cycles, the problem is our renderer settings; if Cycles also looks poor, the source model is the limit.
- **Checklist per species** (from CLAUDE.md §5): proportions, posture, surface variation, roughness response, eyes, teeth/claws, contact grounding. Each is scored pass/fail with screenshots, kept in `docs/lookdev/<slug>.md`.

## 10. Technical risks

| # | Risk | Likelihood | Mitigation |
|---|---|---|---|
| 1 | Free models hit a realism ceiling | High | Phase 4 lookdev separates renderer limits from asset limits; document honestly |
| 2 | Sketchfab downloads need a logged-in account; the download package license may differ from the API label | Medium | You download manually; we check the bundled license file |
| 3 | KTX2 encoder (`toktx`) unavailable on Windows | Medium | Install KTX-Software; WebP fallback documented |
| 4 | iOS Safari memory limits crash the tab | Medium | KTX2 + 1K mobile variant; measure on a real device |
| 5 | Skinned 96k-face *Allosaurus* is slow on mid-range Android | Medium | Measure; decimate in Blender for the mobile variant |
| 6 | React upgrade beyond R3F's peer range | Low | Pin React; Renovate-style manual upgrades |
| 7 | Hotspot positions drift if an asset is re-processed | Low | Author hotspots after the pipeline is final; e2e check that hotspots are on-screen |
| 8 | Reference video still missing | — | Design proceeds from the written brief; review when available |

## 11. Evidence from the *T. rex* spike (2026-10-15)

Details in `asset-research.md` §6.

- The source uses the archived spec-gloss material extension → the pipeline needs a `metalrough` conversion step. Confirms that **every asset goes through the pipeline**; no raw downloads in `public/`.
- The model is 3.3 m long, not life-size → Blender scale step confirmed. The reference video's scale bar also needs real-world units.
- Measured payloads: **4.13 MB high / 1.75 MB mobile** (WebP + meshopt). Both are within the PRD budgets (8 MB / 4 MB).
- VRAM with WebP: ~106 MB for the high variant → KTX2 remains necessary for mobile safety. **KTX-Software must be installed** before Phase 4.

## 12. Decisions requested

Approve or amend:

1. R3F + Drei, WebGL2, `frameloop="demand"`.
2. Meshopt + KTX2 (WebP fallback), two GLB tiers + poster.
3. Layered folders with `domain/` free of React/three; one TS content file per species, validated at build.
4. Zustand store for UI ↔ canvas; CameraControls for camera motion; GSAP for DOM only.
5. Testing split above; no canvas screenshot diffs in CI.
