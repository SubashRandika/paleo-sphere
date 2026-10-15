import { z } from "zod";
import { speciesRecords } from "@/content/species";
import { speciesSchema, type Species, type SpeciesInput } from "./schema";

/**
 * Data-access boundary for species content.
 * Today it reads TypeScript files; swapping in a CMS later only changes this module.
 */

export class SpeciesValidationError extends Error {
  override name = "SpeciesValidationError";
}

/** Validates every record. Throws one error listing all problems, so a build fails loudly. */
export function parseSpeciesRecords(records: readonly SpeciesInput[]): Species[] {
  const problems: string[] = [];
  const parsed: Species[] = [];

  records.forEach((record, index) => {
    const result = speciesSchema.safeParse(record);
    if (result.success) parsed.push(result.data);
    else problems.push(`• ${record.slug ?? `record #${index}`}\n${z.prettifyError(result.error)}`);
  });

  const slugs = parsed.map((s) => s.slug);
  const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
  if (duplicates.length) problems.push(`• Duplicate slugs: ${[...new Set(duplicates)].join(", ")}`);

  if (problems.length) {
    throw new SpeciesValidationError(`Invalid species content:\n${problems.join("\n")}`);
  }
  return parsed;
}

let cache: Species[] | undefined;

export function getAllSpecies(): Species[] {
  cache ??= parseSpeciesRecords(speciesRecords);
  return cache;
}

export function getSpeciesBySlug(slug: string): Species | undefined {
  return getAllSpecies().find((s) => s.slug === slug);
}
