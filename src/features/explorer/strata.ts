/**
 * Geometry for the strata rail: a column scaled to deep time, top = oldest.
 *
 * Period boundaries from the International Chronostratigraphic Chart v2023/09
 * (https://stratigraphy.org/chart): Triassic 251.902–201.4 Ma, Jurassic 201.4–~145.0 Ma,
 * Cretaceous ~145.0–66.0 Ma. Colours are the ICS standard (globals.css --color-period-*).
 */

export const PERIODS = [
  { name: "Triassic", startMa: 251.902, endMa: 201.4 },
  { name: "Jurassic", startMa: 201.4, endMa: 145 },
  { name: "Cretaceous", startMa: 145, endMa: 66 },
] as const;

const TOP_MA = PERIODS[0].startMa;
const BOTTOM_MA = PERIODS[2].endMa;

/** 0 at the top of the rail (oldest), 1 at the bottom (end of the Cretaceous). */
export function ageToFraction(ma: number): number {
  return Math.min(1, Math.max(0, (TOP_MA - ma) / (TOP_MA - BOTTOM_MA)));
}

/**
 * Places labels as close as possible to their true positions without overlapping.
 * Input positions are fractions (0–1); labels need `gap` between them and must stay within
 * [margin, 1 − margin]. A downward pass separates neighbours, then an upward pass pulls back
 * any that ran past the bottom. Order is preserved, so labels never swap.
 */
export function spreadLabels(positions: readonly number[], gap: number, margin = gap / 2): number[] {
  const out = [...positions].map((p) => Math.max(margin, p));
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i]!, out[i - 1]! + gap);
  const last = out.length - 1;
  if (last >= 0) out[last] = Math.min(out[last]!, 1 - margin);
  for (let i = last - 1; i >= 0; i--) out[i] = Math.min(out[i]!, out[i + 1]! - gap);
  return out;
}
