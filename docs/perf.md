# Performance measurements

Record every measurement with its date, method, and environment. Do not compare numbers taken with different methods.

## 2026-10-16 — Phase 3 baseline (*T. rex*, Studio mode)

### Payload (production build, `next start`)

| Item | Size | Method |
|---|---|---|
| 3D chunk (three + R3F + Drei subset) | 1,089 KB raw · **293 KB gzip** | `.next/static/chunks`, gzip -c |
| All JS chunks | 470 KB gzip | same |
| Model, desktop (`-high.glb`) | **4.02 MB** | `scripts/build-asset.mjs` output |
| Model, mobile (`-mobile.glb`) | **1.92 MB** | same |
| Poster (`-poster.webp`, 1056×844, transparent) | 16 KB | `scripts/capture-viewer.mjs` |
| Web fonts (5 × woff2) | **331 KB** | Playwright response sizes — larger than expected, see Known issues |

### Lazy loading (verified with Playwright network capture)

| Page | 3D chunk requested | GLB requested |
|---|---|---|
| `/` | No | No |
| `/species/tyrannosaurus-rex` | Yes, after hydration | `-high.glb` (desktop viewport) |
| `/species/tyrannosaurus-rex`, JavaScript disabled | No | No — poster + text only |

### Estimated GPU texture memory (gltf-transform estimate: w × h × 4 × 4/3)

| Variant | Textures | Est. VRAM |
|---|---|---|
| high | 3 × 2048², 3 × 1024² | **84 MB** |
| mobile | 6 × 1024² | **34 MB** |

Dropping `KHR_materials_specular` removed one full-size texture (spike estimate was ~106 MB for high).

### Time to `data-viewer-state="ready"`

| Environment | Time | Note |
|---|---|---|
| Headless Chromium, SwiftShader (CPU WebGL), localhost, 1440×900 | 1.2–2.6 s | Not representative of real devices: no GPU, no network latency |
| Pixel 7 emulation, SwiftShader, localhost | ~2.5 s | Same caveat |

### Not yet measured

- Frame rate while orbiting on a real GPU (desktop) and a real mid-range phone.
- Load time over a throttled network (e.g. Fast 4G profile).
- GPU memory before/after species switch (needs a second species — Phase 6).

## 2026-10-16 — Phase 4 (KTX2 hybrid, shadows, GPU warm-up)

### Payload

| Item | Phase 3 | Phase 4 | Method |
|---|---|---|---|
| Model, desktop (`-high.glb`) | 4.02 MB | **4.09 MB** (3,995 KB served) | pipeline output / Playwright response |
| Model, mobile (`-mobile.glb`) | 1.92 MB | **2.02 MB** (1,973 KB served) | same |
| Basis transcoder (`.wasm` + `.js`) | — | 515 + 56 KB raw · **239 + 14 KB gzip**, once per visitor, cached | file sizes, gzip -c |
| Poster | 16 KB | 14 KB | `capture-viewer.mjs` |

### Estimated GPU texture memory

| Variant | Phase 3 (WebP) | Phase 4 (ETC1S + WebP normals) | Method |
|---|---|---|---|
| high | ~84 MB | **~35–42 MB** | 4 B/px raw RGBA; 0.5–1 B/px for transcoded ETC1S (BC1/ETC vs BC7/ASTC), ×4/3 mipmaps |
| mobile | ~34 MB | **~13–17 MB** | same |

### Time to `data-viewer-state="ready"` (now includes shader compile + texture upload)

| Environment | Time | Note |
|---|---|---|
| Headless Chromium, SwiftShader, 1440×900, localhost | 1.3–1.6 s | CPU WebGL; `KHR_parallel_shader_compile` not available |
| Mobile emulation (412×915, DPR 2.6), SwiftShader | ~3.5 s | same caveat |

### Still not measured

Real-GPU frame rate, throttled-network load time, and memory after a species switch (needs Phase 6). See Task 3.6.

## Known issues

- Fonts: 331 KB across five files. Newsreader with the `opsz` axis plus italics is heavy. Phase 8: subset, drop unused styles, or limit axes.
- `THREE.Clock` deprecation warning in the console comes from R3F 9.8 internals with three r186; not from our code.
