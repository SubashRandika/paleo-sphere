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
│  │     { estimates[]: { min, max, unit, method, specimen?, citationId } } }
│  ├─ diet: enum, dietEvidence: Claim
│  ├─ summary, facts[] (3–5, Claim + title), known[], uncertain[]: Claim[]
│  ├─ anatomy[], integument[], behaviour[], habitat[], discovery[]: Claim[]   (Phase 5)
│  ├─ hotspotNotes[]: { hotspotId, title, body: Claim }
│  └─ citations[]: { id, type, authors, year?, title, venue, volume?, pages?, doi?, url, accessed }
├─ presentation?                ← rendering (becomes ViewerConfig); absent until a model is prepared
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
- `maxMa >= minMa`. Ages count backwards, so the older bound is the larger number.
- `facts` has a length of 3–5.
- `reviewed` and `published` require `content`, `reviewedOn`, and at least one citation per level 1–3 claim (Phase 5; see §15).
- A record needs `content`, `presentation`, or both.

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

## 12. Phase 3 implementation notes (2026-10-16)

What was built, and decisions made while building it.

| Area | Decision | Why |
|---|---|---|
| Asset prep | Headless Blender via `scripts/blender/prepare_model.py` (wrapped by `npm run asset:prepare`) | Repeatable for every species; no manual Blender steps to forget. Local Blender, so licensed assets are not uploaded to third-party services |
| Pipeline | Drop `KHR_materials_specular` / `KHR_materials_ior` | Saves a full-size texture (~22 MB VRAM at 2K) and keeps `MeshStandardMaterial`; skin is dielectric, default F0 0.04 is defensible. Revisit in Phase 4 lookdev |
| Studio IBL | Drei `<Environment>` built from `<Lightformer>` panels, rendered once | No HDRI download; art-directable "lit specimen" look; zero per-frame cost |
| Grounding | Faint radial floor disc + `ContactShadows` rendered once | A contact shadow alone is invisible on a dark backdrop |
| ContactShadows position | **y ≤ 0** (we use −0.001) | Drei's blur passes draw a plane at world y = 0 through a shadow camera at the component's position looking up with near = 0. Any positive y clips that plane and the shadow output is empty. Found by reading the render target pixels |
| Tone mapping | AgX, exposure 1.15 | Natural highlight roll-off on skin; compare with Neutral in Phase 4 |
| Camera framing | `fitView`: views are authored for a 1.25 aspect stage; narrower stages pull the camera back by `1.25 / aspect` (max 2.5×) | Portrait phones cropped the head with the desktop framing. One rule fixes every species and preset |
| Store ↔ camera | Store depends on a narrow `CameraController` interface; `CameraRig` passes an adapter | Store is unit-testable without WebGL and independent of camera-controls' full API |
| Error handling | Error boundary around the canvas; retry clears the loader cache (`useGLTF.clear`) then remounts | A failed request is cached by the loader; without clearing, retry would replay the failure |
| No WebGL 2 | Detected with `useSyncExternalStore` (server snapshot `null`), canvas never mounted, poster + explanation shown | No hydration mismatch; the page stays useful |
| Poster | Captured from the real viewer with a transparent background (`npm run asset:capture -- --poster …`) | Matches the live render exactly and sits seamlessly on the stage gradient at any aspect |
| Draco | Disabled in `useGLTF` | Our assets use Meshopt; Drei's default would point a Draco decoder at Google's CDN |

Not in Phase 3 (planned later): anatomy hotspots, presentation-mode switcher, pause-animation control (the *T. rex* model has no animation), species switching and its GPU-memory verification (Phase 6).

## 13. Phase 4 implementation notes (2026-10-16)

Evidence and images: `docs/lookdev/tyrannosaurus-rex.md`.

| Area | Decision | Why |
|---|---|---|
| Texture encoding | KTX2 **ETC1S** for base colour / AO / roughness; **WebP** for normal maps | Same download as all-WebP (4.09 vs 4.02 MB) with ~half the GPU memory. UASTC normals were visually equal but 4.6 MB per 2K map (gltf-transform skips RDO on normals by design); ETC1S normals showed block artefacts |
| 4K textures | Not shipped | Marginal gain at 6× the download |
| KTX2 runtime | three's `KTX2Loader`, one per renderer (`src/lib/three/ktx2.ts`), workers released on canvas unmount; transcoder copied from `node_modules/three` by `scripts/copy-vendor.mjs` (predev/prebuild) | Same-origin, version-locked to three; one-time 253 KB gzip |
| GPU warm-up | `compileAsync(model, camera, rootScene)` + `initTexture` before status "ready" | three otherwise compiles/uploads on the first visible frame — a stall on the visitor's first drag. Passing the real scene root matters: shaders depend on its lights and environment map |
| Disposal | Deferred one tick; a remount of the same scene cancels it | React Strict Mode (dev) simulates unmount/remount; immediate disposal destroyed a model about to be shown again |
| Tone mapping | Khronos PBR **Neutral**, exposure 1.15 | Faithful albedo hues; AgX greyed the skin |
| Lighting | Environment 1.2, key 4.5 | Body form at full-figure distance |
| Shadows | Key-light `PCFShadowMap`, 2048², `shadow.autoUpdate = false`, rendered on mount and again when the model is ready; `ShadowMaterial` floor catcher | Self-shadowing was the largest gap vs. Cycles. Static scene → shadow pass runs once. Rendering on mount avoids a WebGL texture/sampler mismatch from sampling a not-yet-rendered map. `PCFSoftShadowMap` was removed in r18x |
| Lookdev | Dev-only `/dev/lookdev` (404 in production) driven by URL params; `scripts/lookdev.mjs` writes labelled contact sheets; `scripts/blender/reference_render.py` renders the Cycles ground truth | Repeatable visual comparisons for every future species |
| Regression guard | e2e test fails on any `GL_INVALID…` console message | The shadow/sampler bug produced no visible symptom in screenshots |

## 15. Phase 5 implementation notes (2026-10-16)

Research method and per-claim evidence: `docs/research/`.

| Area | Decision | Why |
|---|---|---|
| Model-less species | `presentation` is optional; a record needs content, a model, or both. The page shows `ModelPlaceholder` in place of the viewer, and `toViewerConfig` returns `undefined` | Four of five species have researched content but no prepared model. Showing the science now, instead of a low-quality model, follows CLAUDE.md §5 |
| Content sections | Added `anatomy`, `integument`, `behaviour`, `habitat` (claim lists); facts gain a `title`; estimates gain an optional `specimen` | Covers the CLAUDE.md §4/§8 topics without a free-form "sections" bag, which would weaken validation |
| Citations | `type` (article/book/web/database), bare-DOI regex, optional `volume`/`pages`, `year` optional only for web/database | Source tier is visible in the data; undated museum pages are not given an invented year |
| Review gates | Level 1–3 claims need a source in **any non-draft** record (was: published only). `reviewed` = shown with `noindex`; `published` = indexed, the owner's sign-off | A reviewed page is public, so it must meet the citation rule. `published` stays a deliberate human step |
| Integrity tests | `repository.test.ts`: every shown claim is cited and every listed source is used. `npm run content:verify` (separate Vitest config, network): every DOI matches Crossref (title, year, first author, author count, volume, first page) and other URLs resolve | Two DOIs recalled from memory pointed to other papers; the check makes that failure mode impossible to ship |
| Italic names | Content prose may contain `_Name_`; `RichText` renders `<i>`, `plainText` strips it for metadata. The schema rejects unmatched `_` | Scientific names are italic by convention; marking them in the content is explicit, while render-time guessing would italicise "tyrannosaur" or miss "*T. rex*" |
| Article layout | Aside: summary, quick facts (full spread of estimates, with "How these were estimated" disclosure), model notes. Below: fact cards, Known / Uncertain, collapsed "In depth" `<details>`, evidence key, numbered sources | Progressive disclosure that works without JavaScript; all text is server HTML. Source numbers link to `#source-<id>` |
| Measurements | The quick fact is the span of **all** estimates (`summariseEstimates`) | Showing one figure would hide real disagreement (e.g. *Stegosaurus* 1.1–3.8 t from two methods on one skeleton) |

Light theme (added after Phase 5): `src/lib/theme.ts` (constants, `applyTheme`, `THEME_INIT_SCRIPT`), `src/lib/use-theme.ts` (`useSyncExternalStore` over a `MutationObserver` on `<html data-theme>`), and `src/ui/ThemeToggle.tsx`. The root layout renders `data-theme="dark"` with `suppressHydrationWarning`, because the inline script may change it before hydration. Components use only semantic tokens; the one canvas-side consumer is `StageFloor`, which rebuilds its 256 px pool texture when the theme changes.

Known issue (dev only): Next 16 reports "URL data outside of Suspense" for `/species/[slug]` because the page awaits `params` at the top. It affects instant client-side navigation between species, which arrives with species switching in Phase 6. Fix it then by moving the per-slug content behind a `<Suspense>` boundary (see `node_modules/next/dist/docs/01-app/02-guides/adopting-partial-prefetching.md` § Move URL data behind Suspense).

## 14. Decisions requested

Approve or amend:

1. R3F + Drei, WebGL2, `frameloop="demand"`.
2. Meshopt + KTX2 (WebP fallback), two GLB tiers + poster.
3. Layered folders with `domain/` free of React/three; one TS content file per species, validated at build.
4. Zustand store for UI ↔ canvas; CameraControls for camera motion; GSAP for DOM only.
5. Testing split above; no canvas screenshot diffs in CI.
