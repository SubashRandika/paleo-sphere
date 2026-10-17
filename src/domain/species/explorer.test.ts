import { describe, expect, it } from "vitest";
import { facets, filterSpecies, toSummaries, type SpeciesSummary } from "./explorer";
import { getAllSpecies } from "./repository";

const all = toSummaries(getAllSpecies());

const fixture = (over: Partial<SpeciesSummary>): SpeciesSummary => ({
  slug: "x",
  scientificName: "X",
  commonNames: [],
  group: "G",
  period: "Jurassic",
  age: { maxMa: 150, minMa: 145 },
  diet: "herbivore",
  hasModel: false,
  ...over,
});

describe("toSummaries", () => {
  it("lists every shown species, oldest first", () => {
    expect(all.map((s) => s.slug)).toEqual([
      "dilophosaurus-wetherilli",
      "mamenchisaurus",
      "allosaurus-fragilis",
      "brachiosaurus-altithorax",
      "brontosaurus-excelsus",
      "stegosaurus-stenops",
      "triceratops-horridus",
      "tyrannosaurus-rex",
    ]);
  });

  it("spans all length estimates and records whether a model exists", () => {
    const trex = all.find((s) => s.slug === "tyrannosaurus-rex")!;
    expect(trex.length).toEqual({ min: 12, max: 13 });
    expect(trex.hasModel).toBe(true);
    expect(trex.poster).toMatch(/poster\.webp$/);
    const { presentation, ...textOnly } = getAllSpecies().find((s) => s.slug === "mamenchisaurus")!; // eslint-disable-line @typescript-eslint/no-unused-vars
    expect(toSummaries([textOnly])[0]!.hasModel).toBe(false);
  });
});

describe("filterSpecies", () => {
  it("matches scientific names, common names and groups, ignoring case and markup", () => {
    expect(filterSpecies(all, { query: "t. rex" }).map((s) => s.slug)).toEqual(["tyrannosaurus-rex"]);
    expect(filterSpecies(all, { query: "SAUROPOD" }).map((s) => s.slug)).toEqual([
      "mamenchisaurus",
      "brachiosaurus-altithorax",
      "brontosaurus-excelsus",
    ]);
    expect(filterSpecies(all, { query: "  " })).toHaveLength(all.length);
  });

  it("combines period, diet and group filters", () => {
    expect(filterSpecies(all, { period: "Jurassic", diet: "carnivore" }).map((s) => s.slug)).toEqual([
      "dilophosaurus-wetherilli",
      "allosaurus-fragilis",
    ]);
    expect(filterSpecies(all, { group: "Theropod" })).toHaveLength(3);
    expect(filterSpecies(all, { period: "Triassic" })).toEqual([]);
  });

  it("ignores accents in the query", () => {
    const list = [fixture({ scientificName: "Pégomastax" })];
    expect(filterSpecies(list, { query: "pegomastax" })).toHaveLength(1);
  });
});

describe("facets", () => {
  it("offers only options present in the data, periods in geological order", () => {
    const f = facets(all);
    expect(f.periods).toEqual(["Jurassic", "Cretaceous"]);
    expect(f.diets).toEqual(["carnivore", "herbivore"]);
    expect(f.groups).toEqual(["Horned dinosaur", "Plated dinosaur", "Sauropod", "Theropod"]);
  });
});
