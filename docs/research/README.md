# Species research notes

One file per species. The content file in `src/content/species/` is the source of truth for what visitors see; these notes record **how each claim was checked**, so a reviewer can repeat the check.

## Method (Phase 5, 2026-10-16)

1. **Find sources** in tier order (`../science-requirements.md` §2): peer-reviewed papers → museum pages → Paleobiology Database (PBDB).
2. **Confirm the source exists** and record its bibliographic data from Crossref, never from memory. Two DOIs recalled from memory during this phase pointed at different papers (see the *T. rex* and *Allosaurus* notes), which is why this step is mandatory.
3. **Read what the source says.** Abstract via Crossref or OpenAlex, the publisher page, or open-access full text (PLOS, PeerJ via Europe PMC, Royal Society, Acta Palaeontologica Polonica, Palaeontologia Electronica). Each note records which of these was read.
4. **Word the claim no more strongly than the source.** "Suggests", "probably" and "may" in a paper stay in the claim, and the evidence level follows (`science-requirements.md` §1).
5. **Run `npm run content:verify`**: every DOI is checked against Crossref for title, year, first author, author count, volume and first page, and every other URL must resolve.

| Check | Automated? |
|---|---|
| Source exists; citation details match Crossref | Yes: `npm run content:verify` (network) |
| Every claim at level 1–3 cites a source; no unused sources | Yes: `npm test` (`repository.test.ts`) |
| Source supports the claim as worded | No: manual, recorded in these notes |

## What "reviewed" means

`review.status: "reviewed"` = steps 1–5 done by the project (Claude, 2026-10-16). It is **not** review by a paleontologist. Reviewed pages are shown but carry `noindex`; switching a record to `published` is the project owner's sign-off.

## Limits of this pass

- Paywalled papers were checked against their **abstract only**; claims rely only on what the abstract states. Where a claim needed the full text and it was not available, the claim was dropped (listed under "Not used" in each note).
- The Smithsonian NMNH and Field Museum sites refused scripted requests (HTTP 403/404), so they are not cited.
- PBDB human-readable pages also refuse scripted requests, so citations link to the PBDB data API (JSON) for the exact query that was checked.
