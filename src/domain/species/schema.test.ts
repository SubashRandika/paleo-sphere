import { describe, expect, it } from "vitest";
import { speciesSchema, type SpeciesInput } from "./schema";

// Test fixtures use obviously fake data; real species live in src/content.
const citation = {
  id: "ref-a",
  type: "article" as const,
  authors: ["Example, A."],
  year: 2000,
  title: "Fixture paper",
  venue: "Fixture Journal",
  url: "https://example.org/ref-a",
  accessed: "2026-10-15",
};

function draft(): SpeciesInput {
  return {
    id: "fixture-saurus",
    slug: "fixture-saurus",
    scientificName: "Fixturesaurus testi",
    authority: "Nobody, 2026",
    commonNames: [],
    synonyms: [],
    presentation: {
      model: { high: "/models/f/high.glb", mobile: "/models/f/mobile.glb", poster: "/models/f/poster.webp" },
      attribution: {
        creator: "Someone",
        creatorUrl: "https://example.org/someone",
        title: "Fixture model",
        sourceUrl: "https://example.org/model",
        license: "CC-BY-4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        modifications: [],
      },
      appearanceNotes: [{ text: "Colour is an artistic choice.", level: 4, citationIds: [] }],
      camera: {
        default: { position: [5, 2, 5], target: [0, 1, 0] },
        presets: [],
        limits: { minDistance: 1, maxDistance: 20, maxPolarAngle: 1.4 },
      },
      modes: ["studio"],
      hotspots: [],
      a11y: { modelDescription: "A fixture." },
    },
    review: { status: "draft" },
  };
}

function withContent(): SpeciesInput {
  const claim = { text: "Supported claim.", level: 1 as const, citationIds: ["ref-a"] };
  const fact = { ...claim, title: "A fixture fact" };
  return {
    ...draft(),
    content: {
      taxonomy: ["Dinosauria"],
      group: "Fixture group",
      period: "Cretaceous",
      age: { maxMa: 68, minMa: 66, stage: "Maastrichtian", citationIds: ["ref-a"] },
      localities: [
        { formation: "Fixture Fm.", region: "Nowhere", country: "Testland", citationIds: ["ref-a"] },
      ],
      measurements: {
        length: { estimates: [{ min: 10, max: 12, unit: "m", method: "Fixture", citationId: "ref-a" }] },
      },
      diet: "carnivore",
      dietEvidence: claim,
      summary: "A fixture animal.",
      facts: [fact, fact, fact],
      known: [claim],
      uncertain: [{ ...claim, level: 3 }],
      anatomy: [claim],
      integument: [claim],
      behaviour: [{ ...claim, level: 3 }],
      habitat: [claim],
      discovery: [claim],
      hotspotNotes: [],
      citations: [citation],
    },
  };
}

const VIEW = {
  position: [3, 2, 3] as [number, number, number],
  target: [0, 1, 0] as [number, number, number],
};

const messages = (input: unknown) => {
  const result = speciesSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

describe("speciesSchema", () => {
  it("accepts a draft without scientific content", () => {
    expect(messages(draft())).toEqual([]);
  });

  it("accepts a complete record with resolvable citations", () => {
    expect(messages(withContent())).toEqual([]);
  });

  it("rejects unknown keys so typos in content files are caught", () => {
    expect(messages({ ...draft(), scientificname: "typo" })).not.toEqual([]);
  });

  it("rejects a citation id that does not exist", () => {
    const s = withContent();
    s.content!.facts[0] = { title: "x", text: "x", level: 1, citationIds: ["missing"] };
    expect(messages(s)).toContain('Unknown citation id "missing"');
  });

  it("rejects an age range where the older bound is younger", () => {
    const s = withContent();
    s.content!.age = { ...s.content!.age, maxMa: 60, minMa: 66 };
    expect(messages(s)).toContain("maxMa is the older bound and must be ≥ minMa");
  });

  it("requires 3–5 interesting facts", () => {
    const s = withContent();
    s.content!.facts = s.content!.facts.slice(0, 2);
    expect(messages(s)).not.toEqual([]);
  });

  it("requires content and a review date once a record leaves draft", () => {
    const s = { ...draft(), review: { status: "reviewed" as const } };
    expect(messages(s)).toEqual(
      expect.arrayContaining(["A reviewed record needs content", "A reviewed record needs reviewedOn"]),
    );
  });

  it.each(["reviewed", "published"] as const)(
    "blocks showing evidence-level 1–3 claims without a source (%s)",
    (status) => {
      const s = { ...withContent(), review: { status, reviewedOn: "2026-10-15" } };
      s.content!.known = [{ text: "Unsourced.", level: 2, citationIds: [] }];
      expect(messages(s)).toContain("Claims at evidence levels 1–3 need a citation before they are shown");
    },
  );

  it("lets drafts hold unsourced claims while research is in progress", () => {
    const s = withContent();
    s.content!.known = [{ text: "Unsourced.", level: 2, citationIds: [] }];
    expect(messages(s)).toEqual([]);
  });

  it("allows artistic (level 4) claims without a source when published", () => {
    const s = { ...withContent(), review: { status: "published" as const, reviewedOn: "2026-10-15" } };
    expect(messages(s)).toEqual([]);
  });

  it("accepts a content-only record for a species without a prepared 3D model", () => {
    const s = withContent();
    delete s.presentation;
    expect(messages(s)).toEqual([]);
  });

  it("rejects a record with neither content nor a 3D model", () => {
    const s = draft();
    delete s.presentation;
    expect(messages(s)).toContain("A record needs content, a 3D model, or both");
  });

  it("rejects unmatched italic markup in content text", () => {
    const s = withContent();
    s.content!.summary = "Lived with _Triceratops.";
    expect(messages(s)).toContain("Unmatched _ in italic markup");
  });

  it("stores DOIs bare, without the resolver prefix", () => {
    const s = withContent();
    s.content!.citations = [{ ...citation, doi: "https://doi.org/10.1000/xyz" }];
    expect(messages(s)).toContain("Store the bare DOI, e.g. 10.1098/rsbl.2017.0092");
  });

  it("requires a year for articles but not for undated museum pages", () => {
    const undated: Omit<typeof citation, "year"> & { year?: number } = { ...citation };
    delete undated.year;
    const article = withContent();
    article.content!.citations = [undated];
    expect(messages(article)).toContain("Articles and books need a publication year");

    const web = withContent();
    web.content!.citations = [{ ...undated, type: "web" }];
    expect(messages(web)).toEqual([]);
  });

  it("requires the assets a presentation mode depends on", () => {
    const s = draft();
    s.presentation!.modes = ["studio", "fossil", "habitat", "anatomy"];
    expect(messages(s)).toEqual(
      expect.arrayContaining([
        "fossil mode requires presentation.fossil",
        "habitat mode requires presentation.habitatId",
        "anatomy mode requires hotspots",
      ]),
    );
  });

  it("requires studio mode", () => {
    const s = draft();
    s.presentation!.modes = ["anatomy"];
    s.presentation!.hotspots = [{ id: "skull", label: "Skull", position: [0, 0, 0], view: VIEW }];
    expect(messages(s)).toContain("Every species supports studio mode");
  });

  it("rejects hotspot notes that point at a missing hotspot", () => {
    const s = withContent();
    s.content!.hotspotNotes = [
      { hotspotId: "skull", title: "Skull", body: { text: "x", level: 1, citationIds: ["ref-a"] } },
    ];
    expect(messages(s)).toContain('Unknown hotspot id "skull"');
  });

  it("requires a note for every hotspot once content exists", () => {
    const s = withContent();
    s.presentation!.hotspots = [{ id: "skull", label: "Skull", position: [0, 1, 0], view: VIEW }];
    expect(messages(s)).toContain('Hotspot "skull" has no note');
    s.content!.hotspotNotes = [
      { hotspotId: "skull", title: "Skull", body: { text: "x", level: 1, citationIds: ["ref-a"] } },
    ];
    expect(messages(s)).toEqual([]);
  });

  it("rejects camera limits where min ≥ max", () => {
    const s = draft();
    s.presentation!.camera.limits = { minDistance: 10, maxDistance: 5, maxPolarAngle: 1.4 };
    expect(messages(s)).toContain("minDistance must be < maxDistance");
  });
});
