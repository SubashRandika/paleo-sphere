# Paleo Sphere

An interactive 3D dinosaur encyclopedia: realistic reconstructions you can inspect, with sourced science that separates fossil evidence from artistic interpretation.

Independent, non-commercial educational project. Not affiliated with any museum.

## Requirements

- Node.js ≥ 22.12
- Blender 5.1 (asset preparation)

## Commands

| Command          | What it does                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run dev`    | Development server on http://localhost:3000                                                             |
| `npm run build`  | Production build. **Fails if any species content file is invalid.**                                     |
| `npm run check`  | Typecheck, lint, format check, unit tests                                                               |
| `npm test`       | Unit and component tests (Vitest)                                                                       |
| `npm run e2e`    | End-to-end tests (Playwright, against a production build). First run: `npx playwright install chromium` |
| `npm run format` | Format all files (Prettier)                                                                             |

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
