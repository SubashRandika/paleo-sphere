# *Tyrannosaurus rex*: research notes

Content: `src/content/species/tyrannosaurus-rex.ts` · checked 2026-10-16 · method: [README](README.md)

## Sources and what each supports

| Id | Read | Supports |
|---|---|---|
| nhm-tyrannosaurus | Museum page | 12 m typical length; 3.5–4.0 m hip height; 5,000–7,000 kg "normal" weight; 68–66 Ma; 60 teeth up to 20 cm; skulls > 1.5 m; *Manospondylus gigas* (Cope 1892) and why the name lapsed; Brown's skeletons of 1900 and 1902, named by Osborn; bite marks from other tyrannosaurs; hunted and scavenged ("we don't know if it hunted in packs"); arm-function hypotheses; scales on known skin, back skin unknown; "warm and humid environment"; taxonomy line |
| pbdb-tyrannosaurus | PBDB API (70 occurrences) | Formations: Hell Creek (MT, ND, SD), Lance (WY), Denver (CO), Scollard (AB), Frenchman (SK). Single records from Dinosaur Park Fm and Kirtland Fm (Campanian) left out as likely misidentifications |
| osborn-1905 | AMNH Digital Library record (handle 2246/1464), PBDB ref 9259 | Naming: *Bull. AMNH* 21(14): 259–265 |
| brochu-2003 | Abstract (OpenAlex) | "most complete specimen yet collected (FMNH PR2081, 'Sue')"; "olfactory bulbs were very large"; pneumatopores in all presacral vertebrae |
| chin-1998 | Nature abstract | Coprolite "most likely" from *T. rex*, 30–50% bone fragments → level 2 |
| hutchinson-garcia-2002 | Nature abstract | Running would need "an unreasonably large mass of extensor muscle"; "doubtful … capable runners" |
| hutchinson-2011 | Abstract | Adults 6,000–8,000 kg; "Sue" perhaps ~9,500 kg; < 10 kg hatchlings to > 6,000 kg in < 20 years |
| bell-2017 | Abstract | Scaly skin in *Tyrannosaurus* and other tyrannosaurids; extensive feathers lost before Tyrannosauridae |
| gignac-erickson-2017 | Abstract | Bite forces 8,526–34,522 N; tooth pressures; repetitive localised biting; "13 metres" |
| persons-2019 | Abstract | RSM P2523.8 ("Scotty") ~65% complete; mass estimate exceeds all other known specimens |
| woodward-2020 | Title and partial abstract | Their conclusion that "*Nanotyrannus*" specimens are juvenile *T. rex* |
| paul-2022 / carr-2022 | Carr et al. abstract; Paul et al. title | Three-species proposal and the reply finding it unsupported |
| padian-2022 | Full text (APP open access) | "In some tyrannosauroids the third digit persists but in *T. rex* it may be reduced to a loss of its phalanges, and perhaps sometimes the loss of the digit altogether" → two functional fingers |
| cullen-2023 | Abstract | Teeth "most likely" covered by extraoral tissue when the mouth was closed → level 3 |
| zanno-napoli-2025 | Nature abstract | "one of the last surviving non-avian dinosaurs"; NCSM 40000 shows *Nanotyrannus* is distinct from *Tyrannosaurus* |
| nhm-triceratops | Museum page | Healed *Triceratops* horn with tyrannosaur bite marks |

## Measurements

- **Length:** 12 m typical (NHM) and 13 m for a large adult (Gignac & Erickson). The 3D model stays at 12 m; no asset rebuild was needed.
- **Mass:** shown as three estimates, 5–7 t (NHM typical), 6–8 t (volumetric adults), ~9.5 t ("Sue"), so the quick fact reads **5–9.5 t**. Persons et al. state that "Scotty" was heavier than all others; the figure itself is in the paywalled full text and is not quoted.

## Disagreements presented

- One species or three (Paul et al. 2022 vs. Carr et al. 2022).
- *Nanotyrannus*: a juvenile *T. rex* (Woodward et al. 2020) or a separate taxon (Zanno & Napoli 2025). This changes which skeletons describe young *T. rex*.
- Lips (Cullen et al. 2023), presented as the current best-supported reconstruction, level 3.

## Model anatomy questions from Phase 4: resolved

| Question | Finding |
|---|---|
| Three clawed fingers? | **No.** The Phase 4 front close-up shows two claws per hand; the "third" in the side view is the far hand. This matches Padian 2022, and the appearance note is now level 1. No Blender fix needed. |
| No lips | Appearance note, level 3, citing Cullen et al. 2023. |
| Scales everywhere | Consistent with Bell et al. 2017 (level 1). The back is unknown (NHM), so this is noted in the integument section. |

## Not used

- **Erickson et al. 2004** (*Nature* 430: 772): a 2015 corrigendum exists and Hutchinson et al. 2011 revise peak growth rates, so the 2.1 kg/day and 28-year figures were not used.
- **Erickson & Olson 1996** (bite marks on *Triceratops*): no abstract available to verify; the NHM's healed-horn example was used instead.
- **Field Museum "SUE" page / Smithsonian "Nation's T. rex"**: not reachable by script (404/403).
- **Dalman et al. 2024 (*T. mcraeensis*)**: dating is disputed in 2024–2026 conference abstracts only; left out until published.
