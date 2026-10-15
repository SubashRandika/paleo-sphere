# Product requirements — Paleo Sphere (draft v0.1)

Status: **draft for review** · Phase 0 · 2026-10-15

## 1. Product

A non-commercial web encyclopedia where visitors inspect realistic 3D dinosaur reconstructions and read sourced, evidence-graded science about each species. It should feel like a natural-history museum gallery: the animal first, the science one tap away, and an honest line between fossil evidence and reconstruction.

Not an official museum product or an authoritative database; the site says so.

## 2. Audience

- **Primary:** curious adults and teens (12+) without a paleontology background.
- **Secondary:** enthusiasts who want sources, specimen numbers, and the uncertainty.
- Design implication: short summary first; deeper science behind progressive disclosure.

## 3. Platforms

| Tier | Target | Expectation |
|---|---|---|
| Desktop | Last 2 versions of Chrome, Edge, Firefox, Safari | Full experience |
| Mobile | iOS Safari 16+, Chrome on mid-range Android (~2021+) | Full interaction; reduced render quality allowed |
| No WebGL | Any | Static image + all text content; no broken UI |

Rendering baseline: WebGL2. WebGPU is optional, never required (Phase 1 to confirm).

## 4. MVP scope (initial release)

**In:**
- Species page per species with a meaningful URL (`/species/[slug]`), metadata, and server-rendered text content.
- 3D viewer: rotate, zoom (scroll, pinch, buttons), pan, reset, 2–4 camera presets, fullscreen, loading and failure states, pause animation.
- **Studio** mode for all species.
- **Anatomy** mode with 3–6 hotspots per species, each with an evidence level.
- **Fossil comparison** mode where a licensed specimen scan exists (*Triceratops*, *T. rex* skull at minimum).
- **Habitat** mode for one environment (Late Jurassic Morrison Formation, if *Allosaurus* is adopted).
- Species browser with search and filters (period, diet, group).
- Quick-facts panel; "What scientists know" / "What remains uncertain"; sources list; model attribution.
- Dark theme (default) and light theme; keyboard navigation; reduced motion.

**Out (post-MVP):**
- More than five species; user accounts; CMS/database; audio; AR; localisation; size-comparison tool; WebGPU-only effects.

## 5. Species (initial five)

*T. rex*, *Triceratops*, *Stegosaurus*, *Mamenchisaurus*, and *Allosaurus* (proposed replacement for *Velociraptor*; see `asset-research.md` §4).

## 6. Content integrity

- Every displayed claim has an evidence level (1–4) and a citation (`science-requirements.md`).
- Every model shows creator, source, license, and modifications.
- Colour and pattern are labelled as reconstruction unless evidence exists.

## 7. Performance targets (provisional — to be confirmed after measuring a real asset in Phase 3)

| Metric | Desktop | Mid-range mobile |
|---|---|---|
| Text content visible (LCP) | < 2.5 s | < 2.5 s |
| Model interactive after navigation | < 4 s | < 6 s |
| Per-species model payload (compressed) | ≤ 8 MB | ≤ 4 MB variant |
| Frame rate while orbiting (Studio) | ≥ 60 fps | ≥ 30 fps |
| GPU memory released on species switch | Returns to baseline ± 10% | Same |

## 8. Acceptance criteria for the initial release

Derived from CLAUDE.md §15. Each is testable.

1. A visitor can open `/species/<slug>` and inspect the 3D model: rotate, zoom, pan, reset all work with mouse, touch, and keyboard/buttons.
2. Switching species from the browser loads the new model and releases the old one (verified in a memory profile).
3. Each published species has all §8 sections of CLAUDE.md, with every claim cited and levelled.
4. Each model's appearance notes say which features match evidence and which are inferred; the UI shows this.
5. All performance targets in §7 are measured on one representative desktop and one mid-range phone, with results recorded.
6. With WebGL disabled, the page shows the species text, a static image, and a clear message.
7. Keyboard-only users can reach and operate every viewer control; focus is visible; `prefers-reduced-motion` disables non-essential motion.
8. Lighthouse accessibility ≥ 95 and SEO ≥ 95 on species pages.
9. A new species can be added by adding a data file and assets only — no viewer code changes.
10. The site is deployed to a preview URL and docs explain how to add a species.

## 9. Open questions

- Reference video review (pending file).
- Velociraptor vs *Allosaurus* (pending decision).
- Hosting for model assets (decide in Phase 9; Vercel + object storage is the default assumption).
