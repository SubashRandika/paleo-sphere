import type { CitationIndex } from "./format";

/** Superscript source numbers linking to the sources list: [2, 5]. */
export function CitationRefs({ ids, index }: { ids: readonly string[]; index: CitationIndex }) {
  const refs = ids.flatMap((id) => {
    const n = index.get(id);
    return n === undefined ? [] : [{ id, n }];
  });
  if (refs.length === 0) return null;

  return (
    <sup className="ml-0.5 font-mono text-[0.65em] whitespace-nowrap text-muted">
      [
      {refs.map(({ id, n }, i) => (
        <span key={id}>
          {i > 0 && ", "}
          <a
            href={`#source-${id}`}
            aria-label={`Source ${n}`}
            className="underline decoration-rule underline-offset-2 hover:text-ink hover:decoration-ink"
          >
            {n}
          </a>
        </span>
      ))}
      ]
    </sup>
  );
}
