# Science requirements — Phase 0

Defines how scientific content is researched, graded, cited, and reviewed. Species content itself is written in Phase 5.

## 1. Evidence levels

Every claim shown to visitors carries exactly one level.

| Level | Name | Meaning | Example phrasing |
|---|---|---|---|
| 1 | **Direct fossil evidence** | Observed in specimens. | "Skin impressions from the tail show…" |
| 2 | **Strong inference** | Follows from fossils plus well-established biology. | "Bone histology indicates rapid growth…" |
| 3 | **Plausible reconstruction** | Consistent with evidence, but alternatives exist. | "It may have…" / "Most reconstructions show…" |
| 4 | **Artistic interpretation** | Not constrained by evidence (most colour, many behaviours). | "Colour in this model is an artistic choice." |

## 2. Source hierarchy

Use the highest available tier; never cite tier 4 as evidence.

1. Peer-reviewed papers and original species descriptions (with DOI where available).
2. Museum collection records and museum science pages (Smithsonian NMNH, NHM London, NHM Utah, etc.).
3. Paleobiology Database records (occurrences, formations, ages).
4. Not acceptable as evidence: blogs, wikis, social media, AI output, popular media.

## 3. Citation record (per claim)

Each citation stored with the species data must include: authors, year, title, venue (journal/museum), DOI or stable URL, date accessed, and which claim(s) it supports. Measurements store **min/max range + source per estimate**, never a single bare number.

## 4. Per-species research checklist

- [ ] Accepted name, authority, synonyms
- [ ] Clade placement
- [ ] Age range (Ma) and stage; formation(s); locality region
- [ ] Length, hip height, mass — each as a sourced range; disagreements explained
- [ ] Diet + evidence type (teeth, gut contents, coprolites, bite marks…)
- [ ] Integument evidence (scales, feathers, osteoderms, skin impressions)
- [ ] Colour evidence (usually none → level 4)
- [ ] Locomotion and posture
- [ ] Behaviour — evidence-backed vs hypothesis, labelled
- [ ] Discovery and naming history; key specimens with catalogue numbers
- [ ] 3–5 interesting facts, each with a source and level
- [ ] "What scientists know" / "What remains uncertain"
- [ ] Appearance notes for the 3D model: which features match evidence, which don't

## 5. Starter species — rationale

Final list pending the *Velociraptor* decision (see `asset-research.md` §4).

| Species | Group | Period | Why it earns a place |
|---|---|---|---|
| *Tyrannosaurus rex* | Theropod (tyrannosaurid) | Late Cretaceous | Many specimens; rich science on growth, bite, integument debate. |
| *Triceratops* | Ceratopsian | Late Cretaceous | Abundant fossils; CC0 Smithsonian scan enables fossil comparison. |
| *Stegosaurus* | Thyreophoran | Late Jurassic | Plate/spike function debates; strong museum material. |
| *Mamenchisaurus* | Sauropod | Late Jurassic (Asia) | Extreme neck proportions; adds an Asian locality. |
| *Allosaurus* (proposed) or *Velociraptor* | Theropod | Late Jurassic / Late Cretaceous | *Allosaurus* pairs with *Stegosaurus* in one Morrison habitat. |

## 6. Leads to verify in Phase 5: outcome (2026-10-16)

| Lead (from prior knowledge) | Outcome |
|---|---|
| *Velociraptor* quill knobs, Turner, Makovicky & Norell (2007) | Not needed: *Velociraptor* was replaced by *Allosaurus* |
| *T. rex* integument, Bell et al. (2017), *Biology Letters* | **Verified** (Crossref + abstract), cited as `bell-2017` |
| *T. rex* "Sue", FMNH PR 2081 | **Verified** via Brochu (2003); the Field Museum page was unreachable |
| *Stegosaurus stenops* "Sophie", Maidment et al. (2015), *PLOS ONE* | **Verified** (full text): NHMUK PV R36730 |

Per-species research notes: `docs/research/`.

## 7. Review rule

A species is publishable only when every displayed claim has a level and a citation, and a second pass has checked each citation resolves and supports the claim as worded.

How this is applied (Phase 5): "every displayed claim has a level and a citation" and "each citation resolves" are automated (`npm test`, `npm run content:verify`). "Supports the claim as worded" is manual and recorded per claim in `docs/research/`. Records that pass are `reviewed` (shown, `noindex`); `published` is the owner's sign-off after reading the research notes.
