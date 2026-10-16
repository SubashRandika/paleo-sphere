# Paleo Sphere

An interactive 3D dinosaur encyclopedia: realistic reconstructions you can inspect, with sourced science that separates fossil evidence from artistic interpretation.

Independent, non-commercial educational project. Not affiliated with any museum.

## Requirements

- Node.js ≥ 22.12
- Blender 5.1 (asset preparation, reference renders)
- KTX-Software 4.4+ (KTX2 texture encoding; `ktx` on PATH, or `KTX_SOFTWARE_BIN`)

## Commands

| Command                  | What it does                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `npm run dev`            | Development server on http://localhost:3000                                                             |
| `npm run build`          | Production build. **Fails if any species content file is invalid.**                                     |
| `npm run check`          | Typecheck, lint, format check, unit tests                                                               |
| `npm test`               | Unit and component tests (Vitest)                                                                       |
| `npm run e2e`            | End-to-end tests (Playwright, against a production build). First run: `npx playwright install chromium` |
| `npm run format`         | Format all files (Prettier)                                                                             |
| `npm run content:verify` | Network check of every species citation against Crossref (DOIs) or the live URL                         |

## Species content

One TypeScript file per species in `src/content/species/`, validated by the Zod schema in `src/domain/species/schema.ts`; an invalid file fails the build. Every claim carries an evidence level (1 fossil evidence … 4 artistic interpretation) and cites sources listed in the same file. Write scientific names as `_Tyrannosaurus rex_` to italicise them.

Before a record leaves `draft`: research it as described in [docs/research/README.md](docs/research/README.md), record the per-claim checks in `docs/research/<slug>.md`, then run `npm test` and `npm run content:verify`.

## 3D asset pipeline

Raw downloads go in `assets-src/` (git-ignored). Three steps turn one into web deliverables in `public/models/<slug>/`:

| Command                                                                                          | What it does                                                                                                                                       |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run asset:prepare -- --input <source.gltf> --output <prepared.glb> --length <m>`            | Headless Blender: flatten, apply transforms, centre, feet on ground, scale to life size (`BLENDER` env overrides the path)                         |
| `npm run asset:build -- --input <prepared.glb> --slug <slug>`                                    | `-high.glb` (2K) and `-mobile.glb` (1K): KTX2 ETC1S colour/AO/roughness, WebP normal maps, Meshopt geometry; prints sizes and estimated GPU memory |
| `npm run asset:capture -- --url <species page> --poster public/models/<slug>/<slug>-poster.webp` | Screenshots every camera preset into `.lookdev/` and writes the transparent poster image (needs a running server)                                  |

## Look development

| Command                                                                                                                                     | What it does                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `npx next dev -p 3300`, then open `/dev/lookdev?view=head&tone=neutral`                                                                     | Dev-only page (404 in production) that renders a species with render settings from the URL; see `src/features/viewer/lookdev-params.ts` |
| `node scripts/lookdev.mjs --base http://localhost:3300 [--only textures,shadows]`                                                           | Renders labelled comparison sheets into `docs/lookdev/img/`                                                                             |
| `blender --background --factory-startup --python scripts/blender/reference_render.py -- --input … --output … --camera x,y,z --target x,y,z` | Cycles ground-truth render from the same camera as the web viewer                                                                       |

Results and decisions: [docs/lookdev/tyrannosaurus-rex.md](docs/lookdev/tyrannosaurus-rex.md).

## Project layout

```
src/
  app/              routes (server components)
  content/species/  one TypeScript file per species
  domain/species/   Zod schema, repository, ViewerConfig — no React, no three (lint-enforced)
  features/         viewer, explorer, article
  ui/               design-system primitives
  proxy.ts          real 404 status for unknown species
tests/e2e/          Playwright specs
docs/               PRD, architecture, research, progress log
```

## Documentation

Start with [docs/PROGRESS.md](docs/PROGRESS.md). Decisions and their reasons are in [docs/architecture.md](docs/architecture.md).

## Credits

3D model credits and licenses are shown on each species page and recorded in [docs/asset-research.md](docs/asset-research.md).
