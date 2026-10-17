# Adding a species

A new species needs **data and assets only**, with no component or route changes. Once the record is registered it appears automatically in the home-page browser and its filters, the strata rail, the length comparison, the sitemap of prerendered pages, and the real-404 check in `src/proxy.ts`.

## 1. Research (required before anything is shown)

Follow [research/README.md](research/README.md):

1. Collect sources in tier order (papers → museum pages → PBDB).
2. Take bibliographic data from Crossref, never from memory.
3. Record what each source supports in `docs/research/<slug>.md`.

## 2. Content record

Create `src/content/species/<slug>.ts` (copy an existing record) and register it in `src/content/species/index.ts`.

| Field | Notes |
|---|---|
| `slug` | kebab-case; becomes `/species/<slug>` |
| `content.group` | Reuse an existing spelling ("Theropod", "Sauropod", "Horned dinosaur", "Plated dinosaur") so it shares a filter chip; a new value creates a new chip |
| `content.age`, `period` | Place the species on the strata rail and in the period filter |
| `content.measurements.length` | Feeds the length comparison; give every published estimate, not one figure |
| Claims | Every claim has `level` 1–4 and, for levels 1–3, `citationIds` that exist in `citations` |
| Scientific names in prose | `_Genus species_` → italic |
| `review.status` | `draft` hides all content; `reviewed` shows it with `noindex`; `published` is the owner's sign-off |

Leave `presentation` out until a model is ready: the page then shows the research with a "3D reconstruction in preparation" panel.

## 3. 3D model (optional)

1. **Vet the asset** against `asset-research.md` §1 (no game/film rips, no ND licences, no stylised models, no contradictions of fossil evidence). Confirm the licence from the file in the download, not only the website.
2. **Prepare** in headless Blender (flatten, apply transforms, centre, feet on the ground, life size):
   `npm run asset:prepare -- --input assets-src/<name>/scene.gltf --output assets-src/<name>/work/<slug>.glb --length <m>`. Use the length from the content record.
3. **Build** web variants:
   `npm run asset:build -- --input assets-src/<name>/work/<slug>.glb --slug <slug>`
   (KTX2 + WebP normals, Meshopt; prints sizes and estimated GPU memory; budget ≤ 8 MB desktop, ≤ 4 MB mobile).
   - First look: `node scripts/inspect-source.mjs <scene.gltf>` (size, triangles, textures, rig) and `scripts/blender/survey_source.py` (renders the bind pose and the first animation frame).
   - Rigged downloads: `--pose rest` or `--pose frame:N` freezes the pose before the rig is dropped (a bind pose is often a T-pose). `--rotate y:-90` turns a model lying on the wrong axis; check first that the pose is not how the specimen really is.
   - Curved bodies (a neck or tail swinging sideways): measure the length along the skeleton with `scripts/blender/midline_length.py --target <metres>` and pass its `prepareLength` as `--length`.
   - Dense scans: `npm run asset:build -- ... --simplify 0.25`.
4. **Add `presentation`**:
   - **Model paths and attribution**, including `modifications`, which CC BY requires.
   - **Appearance notes:** which features match evidence and which are interpretation.
   - **Camera:** the default view and 2–4 presets. Tune them on `/dev/lookdev?species=<slug>&view=<preset>`.
   - **Limits and accessibility text:** camera limits and `a11y.modelDescription`.
5. **Capture the poster:** with a server running, `npm run asset:capture -- --url http://localhost:3000/species/<slug> --poster public/models/<slug>/<slug>-poster.webp`.

## 4. Fossil comparison (optional)

Only a scan of a real specimen (original bone or a labelled cast), never an illustrative skeleton.

1. Prepare and build it like a model (no poster needed).
2. Add `presentation.fossil` (`model`, short `label`, `isCast`, `camera.default`, `attribution`) and a cited `note` saying what the specimen is, where it is, and whether it is a cast. Add `"fossil"` to `modes`.
3. Make no size claim unless the specimen's measurements are sourced.

## 5. Anatomy hotspots (optional)

1. **Find surface points** by ray casting against the prepared model (glTF axes, metres); use each hit's `marker` (4 cm off the surface) as the position:
   `blender --background --factory-startup --python scripts/blender/surface_points.py -- --input assets-src/<name>/work/<slug>.glb --ray jaws:5,3,5:-1,0,0`
2. **Add the markers:** add `presentation.hotspots` (`id`, short `label`, `position`, `view`) and `"anatomy"` to `modes`.
3. **Add the notes:** add one `content.hotspotNotes` entry per hotspot, each a cited claim. The schema rejects a hotspot without a note.

## 6. Idle animation (optional)

Only when the model can be rigged cleanly; run a rig test first (`docs/lookdev/tyrannosaurus-rex-rig.md` shows how).

1. **Rig:** render gridded silhouettes (`scripts/blender/profile_render.py`, then `node scripts/profile-grid.mjs <dir>`), read the joints off them into `scripts/blender/rigs/<slug>.json` (glTF axes; `mirrorX` if the body is off-centre), run `scripts/blender/rig_model.py`, and check poses with `scripts/blender/pose_test.py`.
2. **Motion:** write `scripts/blender/rigs/<slug>-idle.json` (breaths, look keys, optional jaw keys, tail wave; `"axes": "armature"` for rigs whose head points steeply up or down), then `scripts/blender/animate_idle.py` → `export_glb.py` → `npm run asset:build`. Check frames with `pose_test.py --frames 0,105,300`.
3. **Record it:** `presentation.animation` (`clip`), add "rigged … animation" to `attribution.modifications`, and add a level-4 appearance note saying the motion is interpretation.

## 7. Check

```
npm run check            # types, lint, format, unit tests (incl. content integrity)
npm run content:verify   # every citation against Crossref / its URL (network)
npm run e2e              # production build + browser tests
```

Then look at the page in both themes, on a desktop and a phone width.
