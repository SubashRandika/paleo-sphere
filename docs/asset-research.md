# Asset research — Phase 0

Retrieved 2026-10-15 via the Sketchfab Data API v3 (`/v3/search?downloadable=true`, `/v3/models/{uid}`). License labels below are what the API returned for each model. Visual assessment is from Sketchfab thumbnails only; every shortlisted model must be downloaded and inspected (topology, maps, scale, rig) in Phase 3/4 before it is accepted.

Constraints: non-commercial project, free assets only (CC0, CC BY, CC BY-NC).

## 1. Exclusion rules applied

A model is excluded, whatever license label it shows, if:

1. **It is a game or film rip.** The uploader does not own the IP, so the CC label is invalid. Found widely: Jurassic World Evolution / Alive, Primal Carnage, Dino Hunter, Prehistoric Kingdom, Prehistoric Planet.
   - The `hsejira` "Accurate …" series states *"from Prehistoric Kingdom game"* in its descriptions — excluded.
2. **It recreates a copyrighted film creature design.** `IagoMendez` models are described as *"from 1993 Jurassic Park"* / *"The Lost World"* — excluded (derivative design; also outdated anatomy).
3. **It is stylised or cartoonish** (fails §5 realism).
4. **It contradicts direct fossil evidence** (e.g. featherless *Velociraptor*).
5. **It is ND (NoDerivs)** — we must compress/re-material assets, which counts as adaptation.

## 2. Shortlist — living-animal reconstructions

| Species | Model | Creator | License | Faces | Rig/anim | Thumbnail assessment |
|---|---|---|---|---|---|---|
| *Tyrannosaurus rex* | [Tyrant King – Tyrannosaurus](https://sketchfab.com/3d-models/tyrant-king-tyrannosaurus-6465a297fa784598adc49f6e0042d449) | mschanz | CC BY 4.0 | 59,310 | No | **Strongest candidate.** ZBrush sculpt; description lists 4096² PBR maps (diffuse, gloss, height, normal, spec). Horizontal posture, good skin detail. Check: lipless teeth, hand orientation. |
| *T. rex* (backup) | [Tyrannosarus rex (Free model)](https://sketchfab.com/3d-models/tyrannosarus-rex-free-model-e18c433cdd1c49f8ac152348b7384037) | joel3d | CC BY-NC 4.0 | 42,633 | No | Good realism, plausible posture. Author states "do not use it commercially". |
| *Triceratops* | [Triceratops](https://sketchfab.com/3d-models/triceratops-909bf645de1746829ab19acd1ae31767) | D.art | CC BY-NC 4.0 | 11,249 | Yes (1) | Acceptable. Low poly count → relies on normal map. Check frill/horn proportions vs *T. horridus*. |
| *Stegosaurus* | [Stegosaurus](https://sketchfab.com/3d-models/stegosaurus-b2545ed6031e49939b823b1c8435989e) | PusztaiAndras | CC BY 4.0 | 50,096 | No | Acceptable. Alternating plates, thagomizer present. Texture quality unknown until download. |
| Sauropod — *Mamenchisaurus* | [Mamen River Dragon](https://sketchfab.com/3d-models/mamen-river-dragon-6e6611b4a204479aac83dfd96183e779) | D.art | CC BY-NC 4.0 | 20,940 | Yes (1) | Acceptable but plain texture. Only defensible free sauropod found. |
| *Allosaurus* (proposed 5th) | [Animated Allosaurus (Free)](https://sketchfab.com/3d-models/animated-allosaurus-free-3dfc4629ce3f48f183305ddb3b2ad656) | AneesAnimates | CC BY-NC 4.0 | 96,317 | Yes (1) | **Best realism in the sweep.** Lipped jaws, detailed scale texture, rigged. |

### Rejected after visual check

| Model | Reason |
|---|---|
| [Stegosaurus — D.art](https://sketchfab.com/3d-models/stegosaurus-1924052361fb4bd49b714d296a34d2ab) | Cartoonish colours and proportions. |
| [Velociraptor — D.art](https://sketchfab.com/3d-models/velociraptor-6204e7aef35744558b4bd8607a14f5be) | Featherless, film-style; contradicts quill-knob evidence. |
| [Velociraptor (with feathers) V2 — ShinGoji729](https://sketchfab.com/3d-models/velociraptor-with-feathers-v2-3166251a48854aea83e94910835f5a21) | Low geometric and texture quality. |
| [Ceratosaurus — Robert_the_whale](https://sketchfab.com/3d-models/ceratosaurus-b1b0908bb0bc41969db6095ba7aa0085) | Stylised livery. |
| [Brachiosaurus Altithorax — paleo.parallax](https://sketchfab.com/3d-models/brachiosaurus-altithorax-224f71d98b7e4128a137c42368b286f6) | 7,488 faces; too low for hero use. |

## 3. Fossil-comparison assets (mode D)

Real specimen scans — honest material for "compare with the fossil".

| Specimen | Source | License | Notes |
|---|---|---|---|
| [Triceratops horridus Marsh](https://sketchfab.com/3d-models/triceratops-horridus-marsh-e9c507f179ed4455aac3b208c9e6c973) | Smithsonian (NMNH) | CC0 | Links to Smithsonian 3D package; public domain. |
| [T. rex skull cast (MOTE)](https://sketchfab.com/3d-models/vertebrate-tyrannosaurus-rex-skull-mote-cf48487de55d454b8adc92dce2840a0d) | Digital Atlas of Ancient Life | CC0 | A **cast**, not original bone — label accordingly. 618k faces → decimate. |
| [Diplodocus carnegii (NHMW)](https://sketchfab.com/3d-models/diplodocus-carnegii-nhmw-geo-190900040003-1d07ae9e002f4e8ab930dc92d07eb078) | Naturhistorisches Museum Wien | CC BY-NC 4.0 | Skeleton **cast** of "Dippy"; 1M faces → decimate. Only useful if we keep a diplodocid. |

## 4. Gap: *Velociraptor*

No free model meets both the legitimacy and the feather-evidence bar.

| Option | Effort | Outcome |
|---|---|---|
| **A. Replace with *Allosaurus fragilis* (recommended)** | Low | Best free model found. Same Morrison Formation as *Stegosaurus*, so one Late Jurassic habitat can host both without mixing periods. The "feathered dinosaurs" story moves to the *T. rex* uncertainty section. |
| B. Ship four species, add *Velociraptor* later | Low | Keeps the species, delays it until a suitable model appears. |
| C. Add feathers in Blender to a base model | High | Strong learning exercise (hair particles/cards → baked to GLB), but long, and quality risk is high. |
| D. Use a featherless model with a warning | — | **Not acceptable** under the scientific appearance policy. |

## 5. Licensing obligations

- **CC BY / CC BY-NC require attribution**: creator, title, source link, license link, and a note if we modified it (we will: compression, re-materialing). Store in each species record; render in UI.
- **CC BY-NC**: non-commercial only. Any future monetisation requires replacing those assets.
- **Served GLBs are extractable by visitors.** CC licenses permit redistribution with attribution, so this is acceptable here — but it rules out most paid "no redistribution" licenses if the budget ever changes.

## 6. *T. rex* inspection — 2026-10-15

Source: "Tyrant King – Tyrannosaurus" by Marcel Schanz. **License confirmed CC BY 4.0** from `license.txt` in the download. Commercial use allowed; attribution required.

Required credit line (from the package):

> This work is based on "Tyrant King - Tyrannosaurus" (https://sketchfab.com/3d-models/tyrant-king-tyrannosaurus-6465a297fa784598adc49f6e0042d449) by Marcel Schanz (https://sketchfab.com/mschanz) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

| Property | Finding | Consequence |
|---|---|---|
| Meshes | Body: 57,390 tris, 35,868 verts. Eyes: 1,920 tris (both eyes, one mesh) | Fine for desktop and mobile |
| Scale | Bounding box 0.78 × 1.16 × 3.31 m (W × H × L) | **Not life-size.** Needs ~3.7× to reach ~12 m (provisional; sourced length in Phase 5) |
| Orientation | Head toward +Z (eyes at z ≈ +1.27), feet at y ≈ 0 | Already matches the glTF/three convention |
| Hierarchy | 5 nested empties, including FBX cm→m 0.01 scale and two Z-up→Y-up rotations | Flatten in the pipeline |
| Rig / animation | 0 skins, 0 animations | Static model; idle animation would need rigging (post-MVP) |
| Material workflow | **`KHR_materials_pbrSpecularGlossiness` (required)** | three.js's GLTFLoader no longer supports this archived extension, so the model would render with wrong materials. Convert with `gltf-transform metalrough` |
| glTF textures | Body diffuse, normal, spec-gloss 4096²; AO 1024²; eye diffuse + normal 1024² | 4K is above what we ship |
| Extra maps in "Original" FBX package | SubSurface 2048² (grey), LightingMap 1024², ground AO 512², higher-quality 4K JPEGs | Phase 4 options: SSS mask for skin, baked ground shadow decal |

### Pipeline spike (gltf-transform 4.5.1, WebP; KTX2 encoder not yet installed)

| Step | File size |
|---|---|
| Raw glTF → GLB | 53.4 MB |
| After `metalrough` (adds a metallic-roughness map) | 70.7 MB |
| 2048² textures, WebP, meshopt → **high** | **4.13 MB** |
| 1024² textures, WebP, meshopt → **mobile** | **1.75 MB** |

GPU memory (gltf-transform estimate) for the **high** variant with WebP: **~106 MB**. WebP saves download, not VRAM. KTX2 is expected to cut this several-fold; to be measured once KTX-Software is installed.

Note: the conversion adds `KHR_materials_specular`. three.js will therefore use `MeshPhysicalMaterial`, which costs slightly more than `MeshStandardMaterial`. Phase 4 decides whether to keep it.

## 7. Next verification steps (Phase 3/4)

1. Download the *T. rex* candidate; inspect in a glTF viewer / Blender: real map resolution, UV quality, scale, polycount, presence of eyes/teeth/claws as separate materials.
2. Confirm the license on the model's page and the download package (they can differ from API metadata).
3. Record findings in this file, then mark the asset accepted or rejected.
