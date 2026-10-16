import type { Citation } from "@/domain/species/schema";
import { formatAuthors, formatVenue } from "./format";

const linkClass = "break-all text-ink underline decoration-rule underline-offset-4 hover:decoration-ink";

/** Numbered sources; the numbers match the superscript markers in the text. */
export function SourceList({ citations }: { citations: readonly Citation[] }) {
  return (
    <section aria-labelledby="sources-heading" className="space-y-4">
      <h2 id="sources-heading" className="font-display text-3xl">
        Sources
      </h2>
      <ol className="space-y-3 text-sm">
        {citations.map((c, i) => (
          <li
            key={c.id}
            id={`source-${c.id}`}
            className="grid scroll-mt-20 grid-cols-[2.5rem_1fr] target:bg-surface"
          >
            <span className="font-mono text-muted">{i + 1}.</span>
            <p className="text-muted">
              <span className="text-ink">{formatAuthors(c.authors)}</span>
              {c.year !== undefined && ` (${c.year})`}. <cite className="text-ink not-italic">{c.title}</cite>
              . {c.venue !== c.authors[0] && <span className="italic">{formatVenue(c)}. </span>}
              {c.doi ? (
                <a href={`https://doi.org/${c.doi}`} className={linkClass}>
                  doi:{c.doi}
                </a>
              ) : (
                <a href={c.url} className={linkClass}>
                  {c.type === "database" ? "Database record" : "Link"}
                </a>
              )}
              <span className="font-mono text-xs"> · accessed {c.accessed}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
