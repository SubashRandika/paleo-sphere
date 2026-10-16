import type { Species, SpeciesContent } from "./schema";

/**
 * What the species browser and strata rail need about each species — derived from the
 * validated records, so a new species file appears in navigation and filters with no code change.
 */
export type SpeciesSummary = {
  slug: string;
  scientificName: string;
  commonNames: string[];
  group: string;
  period: SpeciesContent["period"];
  /** Older bound first, in millions of years ago. */
  age: { maxMa: number; minMa: number };
  diet: SpeciesContent["diet"];
  /** Span across all published length estimates, metres. */
  length?: { min: number; max: number };
  hasModel: boolean;
  poster?: string;
};

/** Only records with shown content can be browsed; drafts have no age or group to place them by. */
export function toSummaries(species: readonly Species[]): SpeciesSummary[] {
  return species
    .flatMap((s) => {
      const c = s.review.status === "draft" ? undefined : s.content;
      if (!c) return [];
      const lengths = c.measurements.length?.estimates.filter((e) => e.unit === "m") ?? [];
      const summary: SpeciesSummary = {
        slug: s.slug,
        scientificName: s.scientificName,
        commonNames: s.commonNames,
        group: c.group,
        period: c.period,
        age: { maxMa: c.age.maxMa, minMa: c.age.minMa },
        diet: c.diet,
        hasModel: s.presentation !== undefined,
        ...(lengths.length > 0 && {
          length: {
            min: Math.min(...lengths.map((e) => e.min)),
            max: Math.max(...lengths.map((e) => e.max)),
          },
        }),
        ...(s.presentation && { poster: s.presentation.model.poster }),
      };
      return [summary];
    })
    .sort(byAge);
}

/** Oldest first; ties broken by name so the order is stable. */
export function byAge(a: SpeciesSummary, b: SpeciesSummary): number {
  const mid = (s: SpeciesSummary) => (s.age.maxMa + s.age.minMa) / 2;
  return mid(b) - mid(a) || a.scientificName.localeCompare(b.scientificName);
}

export type SpeciesFilter = {
  query?: string;
  period?: SpeciesSummary["period"];
  diet?: SpeciesSummary["diet"];
  group?: string;
};

/** Case- and accent-insensitive; `_italic_` markers in common names are ignored. */
const normalise = (text: string) =>
  text
    .replaceAll("_", "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function filterSpecies(species: readonly SpeciesSummary[], filter: SpeciesFilter): SpeciesSummary[] {
  const query = normalise(filter.query?.trim() ?? "");
  return species.filter(
    (s) =>
      (!filter.period || s.period === filter.period) &&
      (!filter.diet || s.diet === filter.diet) &&
      (!filter.group || s.group === filter.group) &&
      (!query ||
        [s.scientificName, ...s.commonNames, s.group].some((text) => normalise(text).includes(query))),
  );
}

/** Filter options present in the data, in a stable order. */
export function facets(species: readonly SpeciesSummary[]) {
  const unique = <T>(values: T[]) => [...new Set(values)];
  const periodOrder = ["Triassic", "Jurassic", "Cretaceous"] as const;
  return {
    periods: periodOrder.filter((p) => species.some((s) => s.period === p)),
    diets: unique(species.map((s) => s.diet)).sort(),
    groups: unique(species.map((s) => s.group)).sort(),
  };
}
