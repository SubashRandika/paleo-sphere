import { toSummaries } from "@/domain/species/explorer";
import { getAllSpecies } from "@/domain/species/repository";
import type { Species, SpeciesContent } from "@/domain/species/schema";
import { RichText } from "@/ui/RichText";
import type { CitationIndex } from "./format";
import { ModelAttribution } from "./ModelAttribution";
import { QuickFacts } from "./QuickFacts";
import { SizeComparison } from "./SizeComparison";

const panelClass =
  "space-y-8 border-t border-rule px-4 py-8 sm:px-6 lg:col-start-3 lg:row-start-1 lg:overflow-y-auto lg:border-t-0 lg:border-l";

const JUMPS = [
  ["facts-heading", "Facts"],
  ["known-heading", "Known"],
  ["uncertain-heading", "Uncertain"],
  ["deeper-heading", "In depth"],
  ["sources-heading", "Sources"],
] as const;

type Props = { species: Species; content: SpeciesContent | undefined; index: CitationIndex };

/**
 * The information panel beside the 3D stage, in reading order:
 * identity → summary → quick facts → size comparison → what the 3D model shows → jump links
 * into the full article. Short enough to scan without scrolling far; depth lives below.
 */
export function SpeciesPanel({ species, content, index }: Props) {
  return (
    <aside aria-label="Species summary" className={panelClass}>
      <header className="space-y-2">
        <p className="label">
          {content ? `${content.group} · ${content.taxonomy.at(-1)}` : "Specimen record"}
        </p>
        <h1 className="font-display text-5xl leading-none font-normal italic">{species.scientificName}</h1>
        <p className="font-mono text-xs text-muted">{species.authority}</p>
        {species.commonNames.length > 0 && (
          <p className="text-sm text-muted">
            Also known as{" "}
            {species.commonNames.map((name, i) => (
              <span key={name}>
                {i > 0 && ", "}
                <RichText text={name} />
              </span>
            ))}
          </p>
        )}
      </header>

      {content ? (
        <>
          <p className="text-ink">
            <RichText text={content.summary} />
          </p>
          <QuickFacts content={content} index={index} />
          <SizeComparison current={species.slug} species={toSummaries(getAllSpecies())} />
        </>
      ) : (
        <p className="border-l-2 border-accent pl-3 text-sm text-ink">
          Research in progress. Facts for this species have not been reviewed yet, so none are shown.
        </p>
      )}

      {species.presentation && (
        <ModelAttribution
          attribution={species.presentation.attribution}
          appearanceNotes={species.presentation.appearanceNotes}
          index={content ? index : undefined}
        />
      )}

      {content && (
        <nav aria-label="On this page" className="space-y-2">
          <h2 className="label">Read the evidence</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {JUMPS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}
