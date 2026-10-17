import { describe, expect, it } from "vitest";
import { speciesRecords } from "@/content/species";
import { getAllSpecies, getSpeciesBySlug, parseSpeciesRecords, SpeciesValidationError } from "./repository";
import { toViewerConfig } from "./viewer-config";

describe("species content files", () => {
  // The same parse runs during `next build`; this test surfaces problems earlier.
  it("all records pass schema validation", () => {
    expect(() => parseSpeciesRecords(speciesRecords)).not.toThrow();
  });

  it("finds a species by slug and returns undefined for unknown slugs", () => {
    expect(getSpeciesBySlug("tyrannosaurus-rex")?.scientificName).toBe("Tyrannosaurus rex");
    expect(getSpeciesBySlug("not-a-dinosaur")).toBeUndefined();
  });
});

describe("parseSpeciesRecords", () => {
  it("reports duplicate slugs", () => {
    const [first] = speciesRecords;
    expect(() => parseSpeciesRecords([first!, first!])).toThrow(SpeciesValidationError);
  });
});

describe("toViewerConfig", () => {
  it("passes rendering data and excludes scientific content and attribution", () => {
    const species = getSpeciesBySlug("tyrannosaurus-rex")!;
    const config = toViewerConfig(species);

    expect(config?.model).toEqual(species.presentation?.model);
    expect(config).not.toHaveProperty("content");
    expect(config).not.toHaveProperty("attribution");
    expect(config).not.toHaveProperty("citations");
  });

  it("returns undefined for a species without a 3D model", () => {
    const { presentation, ...textOnly } = getSpeciesBySlug("mamenchisaurus")!; // eslint-disable-line @typescript-eslint/no-unused-vars
    expect(toViewerConfig(textOnly)).toBeUndefined();
  });

  it("passes the fossil scan's model, label and camera, but not its note or attribution", () => {
    const config = toViewerConfig(getSpeciesBySlug("triceratops-horridus")!);
    expect(config?.fossil).toMatchObject({ isCast: true, label: expect.any(String) });
    expect(config?.fossil).not.toHaveProperty("note");
    expect(config?.fossil).not.toHaveProperty("attribution");
  });
});

describe("published content integrity", () => {
  // Every record shown to visitors must also satisfy the stricter publish gate,
  // so flipping `reviewed` → `published` never needs content changes.
  it.each(getAllSpecies().filter((s) => s.review.status !== "draft"))(
    "$slug: every claim cites a source listed in the record",
    (species) => {
      const cited = new Set(species.content!.citations.map((c) => c.id));
      const used = new Set<string>();
      const c = species.content!;
      for (const claim of [
        c.dietEvidence,
        ...c.facts,
        ...c.known,
        ...c.uncertain,
        ...c.anatomy,
        ...c.integument,
        ...c.behaviour,
        ...c.habitat,
        ...c.discovery,
        ...(species.presentation?.appearanceNotes ?? []),
        ...(species.presentation?.fossil ? [species.presentation.fossil.note] : []),
      ]) {
        if (claim.level < 4) expect(claim.citationIds.length, claim.text).toBeGreaterThan(0);
        claim.citationIds.forEach((id) => used.add(id));
      }
      c.age.citationIds.forEach((id) => used.add(id));
      c.localities.forEach((l) => l.citationIds.forEach((id) => used.add(id)));
      Object.values(c.measurements).forEach((m) => m?.estimates.forEach((e) => used.add(e.citationId)));

      // No orphaned sources: everything in the list supports something on the page.
      expect([...cited].filter((id) => !used.has(id))).toEqual([]);
    },
  );
});
