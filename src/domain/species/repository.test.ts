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
    const species = getAllSpecies()[0]!;
    const config = toViewerConfig(species);

    expect(config.model).toEqual(species.presentation.model);
    expect(config).not.toHaveProperty("content");
    expect(config).not.toHaveProperty("attribution");
    expect(config).not.toHaveProperty("citations");
  });
});
