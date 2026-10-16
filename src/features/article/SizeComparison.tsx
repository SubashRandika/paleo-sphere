import Link from "next/link";
import type { SpeciesSummary } from "@/domain/species/explorer";
import { formatRange } from "./format";

/**
 * Body length of this species against the others in the collection.
 *
 * One measure, so one axis starting at zero. Each bar is solid up to the lowest published
 * estimate and lighter up to the highest, so the uncertainty stays visible. Every value is
 * also written as text, which is what screen readers get (the bars are decorative).
 * Derived entirely from the cited length estimates in each record; no new claims.
 */
export function SizeComparison({
  current,
  species,
}: {
  current: string;
  species: readonly SpeciesSummary[];
}) {
  const measured = species.filter((s) => s.length).sort((a, b) => b.length!.max - a.length!.max);
  if (measured.length < 2 || !measured.some((s) => s.slug === current)) return null;
  const scale = Math.max(...measured.map((s) => s.length!.max));

  return (
    <section aria-labelledby="size-heading" className="space-y-3">
      <h2 id="size-heading" className="label">
        Length compared
      </h2>
      <ul className="space-y-2.5 text-sm">
        {measured.map((s) => {
          const { min, max } = s.length!;
          const isCurrent = s.slug === current;
          return (
            <li key={s.slug} className="space-y-1">
              <div className="flex items-baseline justify-between gap-3">
                {isCurrent ? (
                  <span aria-current="true" className="font-display text-ink italic">
                    {s.scientificName}
                  </span>
                ) : (
                  <Link href={`/species/${s.slug}`} className="font-display text-muted italic hover:text-ink">
                    {s.scientificName}
                  </Link>
                )}
                <span className={`font-mono text-xs ${isCurrent ? "text-ink" : "text-muted"}`}>
                  {formatRange(min, max, "m")}
                </span>
              </div>
              <div aria-hidden="true" className="flex h-1.5">
                <span
                  className={`rounded-l-sm ${isCurrent ? "bg-ink" : "bg-muted"} ${min === max ? "rounded-r-sm" : ""}`}
                  style={{ width: `${(min / scale) * 100}%` }}
                />
                {max > min && (
                  <span
                    className={`rounded-r-sm ${isCurrent ? "bg-ink/35" : "bg-muted/35"}`}
                    style={{ width: `${((max - min) / scale) * 100}%` }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted">Lighter segments show how far the published estimates disagree.</p>
    </section>
  );
}
