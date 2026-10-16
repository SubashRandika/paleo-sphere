import { describe, expect, it } from "vitest";
import {
  countries,
  formatAge,
  formatAuthors,
  formatRange,
  formatVenue,
  indexCitations,
  summariseEstimates,
} from "./format";

const est = (min: number, max: number, unit: "m" | "kg" | "t") => ({
  min,
  max,
  unit,
  method: "fixture",
  citationId: "ref-a",
});

describe("formatRange", () => {
  it("writes a single value when the bounds match", () => {
    expect(formatRange(12, 12, "m")).toBe("12 m");
  });

  it("writes a range with an en dash", () => {
    expect(formatRange(6, 8, "t")).toBe("6–8 t");
  });

  it("keeps meaningful decimals for small values", () => {
    expect(formatRange(1.08, 2.26, "t")).toBe("1.08–2.26 t");
    expect(formatRange(9.7, 9.7, "m")).toBe("9.7 m");
  });
});

describe("summariseEstimates", () => {
  it("spans every estimate so disagreement stays visible", () => {
    expect(summariseEstimates([est(6, 8, "t"), est(9.5, 9.5, "t"), est(5, 7, "t")])).toBe("5–9.5 t");
  });

  it("converts kilograms when mixed with tonnes", () => {
    expect(summariseEstimates([est(1500, 1500, "kg"), est(2.7, 2.7, "t")])).toBe("1.5–2.7 t");
  });

  it("keeps kilograms when every estimate uses them", () => {
    expect(summariseEstimates([est(800, 1000, "kg")])).toBe("800–1,000 kg");
  });
});

describe("formatAge", () => {
  it("writes the older bound first", () => {
    expect(formatAge({ maxMa: 68, minMa: 66, stage: "Maastrichtian", citationIds: [] })).toBe(
      "68–66 million years ago",
    );
  });
});

describe("formatAuthors", () => {
  it("joins up to three authors and abbreviates longer lists", () => {
    expect(formatAuthors(["Hanna, R. R."])).toBe("Hanna, R. R.");
    expect(formatAuthors(["Farke, A. A.", "Wolff, E. D. S.", "Tanke, D. H."])).toBe(
      "Farke, A. A., Wolff, E. D. S. & Tanke, D. H.",
    );
    expect(formatAuthors(["Bell, P. R.", "B", "C", "D"])).toBe("Bell, P. R. et al.");
  });
});

describe("citation helpers", () => {
  const base = {
    id: "a",
    type: "article" as const,
    authors: ["X"],
    year: 2000,
    title: "T",
    venue: "Nature",
    url: "https://example.org",
    accessed: "2026-10-16",
  };

  it("numbers sources in list order, starting at 1", () => {
    const index = indexCitations([base, { ...base, id: "b" }]);
    expect(index.get("a")).toBe(1);
    expect(index.get("b")).toBe(2);
  });

  it("adds volume and pages to the venue when known", () => {
    expect(formatVenue({ ...base, volume: "393", pages: "680–682" })).toBe("Nature 393, 680–682");
    expect(formatVenue(base)).toBe("Nature");
  });

  it("lists each country once", () => {
    const loc = (country: string) => ({ formation: "F", region: "R", country, citationIds: [] });
    expect(countries([loc("USA"), loc("Canada"), loc("USA")])).toEqual(["USA", "Canada"]);
  });
});
