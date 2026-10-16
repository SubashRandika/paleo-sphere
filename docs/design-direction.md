# Design direction — Phase 0 (for approval)

## Concept: the specimen hall at night

The page is a dark gallery with one lit specimen. UI behaves like museum furniture: specimen labels, a stratigraphic column, catalogue numbers. Ornament is kept out; the dinosaur is the brightest thing on screen.

**Signature element — the strata rail.** The species browser is a vertical geological column, scaled to deep time (≈252 → 66 Ma). Each species is a tag pinned at its actual age range. Bands use the official International Commission on Stratigraphy period colours, so colour carries true information. On mobile it becomes a horizontal timeline strip.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--shale` | `#121417` | Page background (dark) |
| `--slate` | `#1E2227` | Panels, cards |
| `--bone` | `#E6E1D6` | Primary text |
| `--matrix` | `#9A9488` | Secondary text (≈6.1:1 on shale, ≈5.3:1 on slate). Raised from `#8A8478`, which was only ≈4.3:1 on slate — below WCAG AA for body text |
| `--amber` | `#D9A441` | Focus rings, active hotspot, one primary action — used sparingly |

Data colours (strata rail and period chips only; ICS standard):

| Period | Hex |
|---|---|
| Triassic | `#812B92` |
| Jurassic | `#34B2C9` |
| Cretaceous | `#7FC64E` |

Light theme inverts to bone background / shale text with a darkened accent (`#8F6210`).

### Light theme (added before Phase 6, 2026-10-16)

- **Default:** dark. A sun/moon button in the header switches theme. The choice is stored in `localStorage` and applied by an inline script before first paint, so there is no flash. Without JavaScript the site stays dark and the button is not rendered.
- **Contrast on bone `#E6E1D6`:** ink 14.2:1, muted 5.5:1 (AA for body text), accent 4.1:1, so the accent is for focus rings and rules only, never small text.
- **3D stage:** the transparent canvas shows the page background; the floor light pool switches from bone-tinted to white. Specimen lighting is unchanged, so the model looks the same in both themes.
- **Phase 6 note:** the ICS period colours are too light for text or thin lines on bone (Cretaceous 1.6:1, Jurassic 1.9:1). In the light theme, use them only as filled bands with ink labels.

## Typography

| Role | Face | Use |
|---|---|---|
| Display | **Newsreader** (italic, optical sizes) | Binomial names — scientific names are italic by convention, so the display face carries meaning |
| Body | **IBM Plex Sans** | Reading text, UI labels |
| Data | **IBM Plex Mono** | Measurements, Ma ages, catalogue numbers (`FMNH PR 2081`), evidence levels |

## Evidence badges

Four levels as small mono labels with a fill pattern rather than colour alone (accessible without colour): solid ● fossil evidence, ◐ strong inference, ○ plausible reconstruction, ◌ artistic interpretation.

## Layout

Desktop:

```
┌──────┬─────────────────────────────────────────┬──────────────┐
│strata│                                         │ Tyrannosaurus│
│ rail │                                         │ rex          │
│      │            3D viewer (dominant)         │ 68–66 Ma     │
│ Cret │                                         │ quick facts  │
│ ■ T. │                                         │ ───────────  │
│ ■ Tr │                                         │ [Know][Unsure│
│ Jur  │                                         │ [Sources]    │
│ ■ St │  [Studio|Habitat|Anatomy|Fossil]  ⟲ ⤢   │              │
└──────┴─────────────────────────────────────────┴──────────────┘
            ↓ scroll: full article (server-rendered HTML)
```

Mobile:

```
┌─────────────────────┐
│ ▸ strata strip  ──▶ │
├─────────────────────┤
│                     │
│   3D viewer (≈60vh) │
│      [modes] ⟲ ⤢    │
├─────────────────────┤
│ Tyrannosaurus rex   │
│ quick facts (sheet) │
└─────────────────────┘
```

## Motion

- One orchestrated moment: on species switch, the strata rail slides to the new age and the model fades in. Nothing else animates on load.
- No forced auto-rotation. `prefers-reduced-motion` removes the slide and fade.

## What this deliberately avoids

Neon/sci-fi HUD styling, glassmorphism panels over the model, game-style "stats bars", and decorative particles.
