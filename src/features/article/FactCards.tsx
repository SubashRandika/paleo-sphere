import type { Fact } from "@/domain/species/schema";
import { EvidenceBadge } from "@/ui/EvidenceBadge";
import { RichText } from "@/ui/RichText";
import { CitationRefs } from "./CitationRefs";
import type { CitationIndex } from "./format";

export function FactCards({ facts, index }: { facts: readonly Fact[]; index: CitationIndex }) {
  return (
    <section aria-labelledby="facts-heading" className="space-y-4">
      <h2 id="facts-heading" className="font-display text-3xl">
        Worth knowing
      </h2>
      <ul className="grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
        {facts.map((fact) => (
          <li key={fact.title} className="space-y-3 bg-bg p-5">
            <EvidenceBadge level={fact.level} />
            <h3 className="font-display text-xl leading-snug">
              <RichText text={fact.title} />
            </h3>
            <p className="text-sm text-ink">
              <RichText text={fact.text} />
              <CitationRefs ids={fact.citationIds} index={index} />
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
