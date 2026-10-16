import type { SpeciesContent } from "@/domain/species/schema";
import { CitationRefs } from "./CitationRefs";
import {
  countries,
  formatAge,
  formatDiet,
  formatEstimate,
  summariseEstimates,
  type CitationIndex,
} from "./format";

const MEASURES = [
  ["length", "Length"],
  ["hipHeight", "Hip height"],
  ["mass", "Weight"],
] as const;

/**
 * Compact specimen label. Each measurement shows the full spread of published estimates;
 * "How these were estimated" opens the individual figures, methods and sources.
 */
export function QuickFacts({ content: c, index }: { content: SpeciesContent; index: CitationIndex }) {
  const measured = MEASURES.filter(([key]) => c.measurements[key]);

  return (
    <section aria-labelledby="quick-facts" className="space-y-4">
      <h2 id="quick-facts" className="label">
        Quick facts
      </h2>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-muted">Lived</dt>
        <dd>
          <span className="font-mono">{formatAge(c.age)}</span>
          <span className="block text-muted">
            {c.period} · {c.age.stage}
          </span>
        </dd>

        <dt className="text-muted">Found in</dt>
        <dd>{countries(c.localities).join(", ")}</dd>

        {measured.map(([key, label]) => (
          <div key={key} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd className="font-mono">{summariseEstimates(c.measurements[key]!.estimates)}</dd>
          </div>
        ))}

        <dt className="text-muted">Diet</dt>
        <dd>{formatDiet(c.diet)}</dd>
      </dl>

      {measured.length > 0 && (
        <details className="group text-sm">
          <summary className="label cursor-pointer list-none hover:text-ink">
            <span aria-hidden="true" className="mr-1 inline-block transition-transform group-open:rotate-90">
              ›
            </span>
            How these were estimated
          </summary>
          <div className="mt-3 space-y-4 border-l border-rule pl-4">
            <p className="text-muted">
              Sizes come from incomplete skeletons and models, so researchers disagree. Each figure below is
              one published estimate.
            </p>
            {measured.map(([key, label]) => (
              <div key={key} className="space-y-1">
                <h3 className="label">{label}</h3>
                <ul className="space-y-1">
                  {c.measurements[key]!.estimates.map((e) => (
                    <li key={`${e.citationId}-${e.min}-${e.max}`}>
                      <span className="font-mono text-ink">{formatEstimate(e)}</span>
                      <span className="text-muted">
                        {" "}
                        — {e.method}
                        {e.specimen && ` (${e.specimen})`}
                      </span>
                      <CitationRefs ids={[e.citationId]} index={index} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-1">
              <h3 className="label">Rock formations</h3>
              <ul className="space-y-1">
                {c.localities.map((l) => (
                  <li key={l.formation} className="text-ink">
                    {l.formation}{" "}
                    <span className="text-muted">
                      — {l.region}, {l.country}
                    </span>
                    <CitationRefs ids={l.citationIds} index={index} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      )}
    </section>
  );
}
