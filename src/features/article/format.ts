import type { Citation, Species, SpeciesContent } from "@/domain/species/schema";

/**
 * Presentation helpers for species articles. Pure functions so the rules
 * (how ranges are written, how sources are numbered) are unit-tested once.
 */

type Estimate = NonNullable<SpeciesContent["measurements"]["length"]>["estimates"][number];

/** Source id → the number shown in the text and the sources list (1-based, list order). */
export type CitationIndex = ReadonlyMap<string, number>;

export function indexCitations(citations: readonly Citation[]): CitationIndex {
  return new Map(citations.map((c, i) => [c.id, i + 1]));
}

const number = (n: number) =>
  n.toLocaleString("en-GB", { maximumFractionDigits: n < 10 && !Number.isInteger(n) ? 2 : 1 });

/** "12 m", "6–8 t" — a single value when the bounds match. */
export function formatRange(min: number, max: number, unit: string): string {
  return min === max ? `${number(min)} ${unit}` : `${number(min)}–${number(max)} ${unit}`;
}

/**
 * The span across every published estimate, so visitors see the full disagreement
 * rather than one cherry-picked figure. Estimates in kg are converted to tonnes when mixed.
 */
export function summariseEstimates(estimates: readonly Estimate[]): string {
  const toBase = (v: number, unit: Estimate["unit"]) => (unit === "kg" ? v / 1000 : v);
  const unit = estimates.every((e) => e.unit === "kg") ? "kg" : estimates[0]!.unit === "m" ? "m" : "t";
  const values = estimates.flatMap((e) =>
    unit === "kg" ? [e.min, e.max] : [toBase(e.min, e.unit), toBase(e.max, e.unit)],
  );
  return formatRange(Math.min(...values), Math.max(...values), unit);
}

export function formatEstimate(e: Estimate): string {
  return formatRange(e.min, e.max, e.unit);
}

/** "68–66 million years ago" (older bound first, as geologists write it). */
export function formatAge(age: SpeciesContent["age"]): string {
  return `${formatRange(age.maxMa, age.minMa, "").trim()} million years ago`;
}

const DIETS: Record<SpeciesContent["diet"], string> = {
  carnivore: "Meat-eater",
  herbivore: "Plant-eater",
  omnivore: "Omnivore",
};

export const formatDiet = (diet: SpeciesContent["diet"]) => DIETS[diet];

/** Unique countries in first-mentioned order. */
export function countries(localities: SpeciesContent["localities"]): string[] {
  return [...new Set(localities.map((l) => l.country))];
}

/** "Bell, P. R., Campione, N. E. & Persons, W. S." — first three authors, then "et al.". */
export function formatAuthors(authors: readonly string[]): string {
  if (authors.length === 1) return authors[0]!;
  if (authors.length <= 3) return `${authors.slice(0, -1).join(", ")} & ${authors.at(-1)}`;
  return `${authors[0]} et al.`;
}

/** Venue with volume and pages: "Biology Letters 13, 20170092". */
export function formatVenue(c: Citation): string {
  const location = [c.volume, c.pages].filter(Boolean).join(", ");
  return location ? `${c.venue} ${location}` : c.venue;
}

export const hasModel = (s: Species) => s.presentation !== undefined;
