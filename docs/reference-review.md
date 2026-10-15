# Reference video review — `reference/Dinasore_age.mp4`

Reviewed 2026-10-15. File: 10 s, 1284×776, 30 fps, H.264.

## What the video shows

| Time | Content |
|---|---|
| 0–4 s | "Fossil Atlas — Vol. I": light cream theme, feathered *Velociraptor*, manual rotation. |
| 4–9 s | "Abyss Atlas": the **same template** in a dark navy theme (anglerfish, dumbo octopus), with species switching and close inspection. |
| 9–10 s | An unrelated real-estate app at the end of the recording — ignored. |

The second half shows that the layout is a reusable template that changes theme per collection. That matches our goal that **species are added through data, not code**.

## Layout anatomy

```
┌ nav ─────┬ species tabs (01 Velociraptor, 02 Triceratops) ─────┬ search ─────────┐
│ Home     │                                                     │ FAMILY · SPEC-ID│
│ Featured │                                                     │ Velociraptor    │
│ Theropods│          oversized model, bleeds past edges         │ V. mongoliensis │
│  42 spp. │                                                     │ [chips]         │
│ …        │ [tool rail: zoom+, zoom−, fullscreen, light]        │ description     │
│          │                                                     │ ─Tri─Jur─Cret●─ │
│ featured │                                                     │ KEY TRAITS      │
│ card     │ scale bar "1 m"        [⟲ 360° ⟳]                   │ HABITAT         │
│          │                                                     │ Close-up detail │
└──────────┴─────────────────────────────────────────────────────┴─────────────────┘
```

## Keep (adapt in our own design language)

1. **The model dominates** the viewport, large enough to crop at the edges. This is the strongest visual idea in the reference.
2. **Scale bar** ("1 m"). Visitors judge size instantly. This requires life-size models, which confirms the pipeline step "scale to metres".
3. **Period timeline with a marker at the species' age** (Triassic–Jurassic–Cretaceous, "75–71 Mya"). Our strata rail takes this further and makes it the navigation itself.
4. **Key traits as label/value rows** with right-aligned values. Easy to scan.
5. **"Close-up detail" cards** that explain one anatomical feature. These map directly to our anatomy hotspots.
6. **Mono uppercase eyebrows** (family · specimen ID) and an italic binomial under the display name.

## Improve

| Issue in the reference | Our approach |
|---|---|
| Claims without sources stated as fact: "Top speed up to 40 km/h"; claws "used to pin prey rather than slash it" (a hypothesis) | Every claim gets an evidence level and citation; hypotheses are labelled as such |
| The right panel covers part of the model (head under the panel) | Frame the camera into the visible area (camera view offset), not the full canvas |
| Icon-only tool rail with no labels; low-contrast icons | Labelled controls with tooltips, keyboard shortcuts, accessible names |
| "360°" pill — function unclear | Explicit controls: rotate, reset, presets, with clear labels |
| No presentation modes | Studio / Habitat / Anatomy / Fossil switcher |
| No model attribution or appearance notes | Attribution and "what's evidence vs. artistic choice" on every model |
| Light cream + serif theme (common template look) | Dark-first specimen-hall direction (`design-direction.md`) |

## Expectation to set

The reference *Velociraptor* is a high-end feathered groom, likely from a paid or film-grade pipeline. Our free *T. rex* is a game-ready sculpt (~59k triangles, 4K maps). It is a good sculpt, but a different tier. Phase 4 decides how much lighting and material work closes the gap.
