import type { Claim, SpeciesContent } from "@/domain/species/schema";
import { ClaimList } from "./ClaimList";
import { EvidenceKey } from "./EvidenceKey";
import { FactCards } from "./FactCards";
import type { CitationIndex } from "./format";
import { SourceList } from "./SourceList";

type Props = { content: SpeciesContent; index: CitationIndex };

/**
 * The long-form species article, below the viewer. Server-rendered HTML.
 * Progressive disclosure: facts and "known / uncertain" are open; the deeper
 * sections are collapsed <details>, which stay in the HTML for search engines
 * and work without JavaScript.
 */
export function SpeciesArticle({ content: c, index }: Props) {
  const deeper: { id: string; title: string; claims: readonly Claim[]; showLevel?: boolean }[] = [
    { id: "anatomy", title: "Anatomy", claims: c.anatomy },
    { id: "diet", title: "What it ate", claims: [c.dietEvidence] },
    { id: "integument", title: "Skin, scales and colour", claims: c.integument },
    { id: "behaviour", title: "Behaviour", claims: c.behaviour },
    { id: "habitat", title: "Habitat and ecology", claims: c.habitat },
    { id: "discovery", title: "Discovery and naming", claims: c.discovery, showLevel: false },
  ];

  return (
    <article
      aria-label="Species article"
      className="mx-auto w-full max-w-5xl space-y-16 border-t border-rule px-4 py-12 sm:px-6"
    >
      <FactCards facts={c.facts} index={index} />

      <div className="grid gap-12 md:grid-cols-2">
        <section aria-labelledby="known-heading" className="space-y-4">
          <h2 id="known-heading" className="font-display text-3xl">
            What scientists know
          </h2>
          <ClaimList claims={c.known} index={index} />
        </section>
        <section aria-labelledby="uncertain-heading" className="space-y-4">
          <h2 id="uncertain-heading" className="font-display text-3xl">
            What remains uncertain
          </h2>
          <ClaimList claims={c.uncertain} index={index} />
        </section>
      </div>

      <section aria-labelledby="deeper-heading" className="space-y-2">
        <h2 id="deeper-heading" className="font-display text-3xl">
          In depth
        </h2>
        <div className="border-t border-rule">
          {deeper.map((s) => (
            <details key={s.id} id={s.id} className="group border-b border-rule">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 py-4 hover:text-ink">
                <h3 className="font-display text-xl">{s.title}</h3>
                <span aria-hidden="true" className="label transition-transform group-open:rotate-90">
                  ›
                </span>
              </summary>
              <div className="pb-6">
                <ClaimList claims={s.claims} index={index} showLevel={s.showLevel ?? true} />
              </div>
            </details>
          ))}
        </div>
      </section>

      <EvidenceKey />
      <SourceList citations={c.citations} />
    </article>
  );
}
