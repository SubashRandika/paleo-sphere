import type { EvidenceLevel } from "@/domain/species/schema";

/**
 * Evidence levels use a fill pattern *and* a word, never colour alone,
 * so the meaning survives colour-blindness and greyscale.
 */
const LEVELS: Record<EvidenceLevel, { glyph: string; label: string }> = {
  1: { glyph: "●", label: "Fossil evidence" },
  2: { glyph: "◐", label: "Strong inference" },
  3: { glyph: "○", label: "Plausible reconstruction" },
  4: { glyph: "◌", label: "Artistic interpretation" },
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const { glyph, label } = LEVELS[level];
  return (
    <span className="label inline-flex items-center gap-1.5 whitespace-nowrap">
      <span aria-hidden="true" className="text-sm leading-none text-ink">
        {glyph}
      </span>
      {label}
    </span>
  );
}
