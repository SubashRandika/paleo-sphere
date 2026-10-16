import type { EvidenceLevel } from "@/domain/species/schema";
import { EvidenceBadge } from "@/ui/EvidenceBadge";

const MEANINGS: Record<EvidenceLevel, string> = {
  1: "Seen directly in fossils or recorded in the specimen history.",
  2: "Follows from fossils plus well-established biology.",
  3: "Consistent with the evidence, but other explanations exist.",
  4: "Not constrained by evidence — most colours and many behaviours.",
};

/** Explains the four evidence labels used on the page. */
export function EvidenceKey() {
  return (
    <section aria-labelledby="evidence-key" className="space-y-3">
      <h2 id="evidence-key" className="label">
        How to read the evidence labels
      </h2>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {([1, 2, 3, 4] as const).map((level) => (
          <div key={level} className="space-y-1">
            <dt>
              <EvidenceBadge level={level} />
            </dt>
            <dd className="text-muted">{MEANINGS[level]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
