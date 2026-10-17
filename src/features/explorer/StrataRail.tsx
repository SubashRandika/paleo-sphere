"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { CSSProperties } from "react";
import type { SpeciesSummary } from "@/domain/species/explorer";
import { ageToFraction, PERIODS, spreadLabels } from "./strata";

/** Label spacing as a fraction of rail height: ≈ 2.5 rem on a 650 px tall rail. */
const LABEL_GAP = 0.062;

/** Fixed text colours on the ICS bands (the bands do not change with the theme). */
const BAND_TEXT: Record<(typeof PERIODS)[number]["name"], string> = {
  Triassic: "#ffffff",
  Jurassic: "#121417",
  Cretaceous: "#121417",
};

/**
 * ICS period fills. Literal class names (not var() lookups): globals.css declares these colours
 * in `@theme inline`, which Tailwind compiles into utilities without emitting CSS variables.
 */
const PERIOD_FILL: Record<SpeciesSummary["period"], string> = {
  Triassic: "bg-period-triassic",
  Jurassic: "bg-period-jurassic",
  Cretaceous: "bg-period-cretaceous",
};
const formatMa = (s: SpeciesSummary) =>
  s.age.maxMa === s.age.minMa ? `${s.age.maxMa} Ma` : `${s.age.maxMa}–${s.age.minMa} Ma`;

/**
 * Species navigation as a geological column (docs/design-direction.md, "strata rail").
 * Desktop: a vertical column scaled to deep time, each species pinned at its age range.
 * Phones: a horizontal strip in the same order (oldest first).
 * Both are ordinary links, so navigation works without JavaScript.
 */
export function StrataRail({ species }: { species: readonly SpeciesSummary[] }) {
  const { slug } = useParams<{ slug?: string }>();
  const truth = species.map((s) => ageToFraction((s.age.maxMa + s.age.minMa) / 2));
  const labels = spreadLabels(truth, LABEL_GAP);

  return (
    <>
      {/* relative: the chips' screen-reader labels are absolutely positioned; without a positioned
          scroll container they escape its clipping and widen the page on phones. */}
      <nav
        aria-label="Species by geological age"
        className="relative overflow-x-auto border-b border-rule lg:hidden"
      >
        <ol className="flex w-max gap-2 px-4 py-3">
          {species.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/species/${s.slug}`}
                aria-current={s.slug === slug ? "page" : undefined}
                className="flex items-center gap-2 rounded-full border border-rule px-3 py-1.5 text-sm text-muted hover:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink"
              >
                <span aria-hidden="true" className={`size-2 rounded-full ${PERIOD_FILL[s.period]}`} />
                <span className="font-display italic">{s.scientificName}</span>
                <span className="sr-only">, {s.period}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <nav
        aria-label="Species by geological age"
        className="hidden border-r border-rule px-4 py-5 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col"
      >
        <p className="label mb-2 font-mono">252 Ma</p>
        <div className="relative flex-1">
          <ol aria-hidden="true" className="absolute inset-y-0 left-0 flex w-5 flex-col">
            {PERIODS.map((p) => (
              <li
                key={p.name}
                className={`relative grid place-items-center overflow-hidden ${PERIOD_FILL[p.name]}`}
                style={{ flexGrow: p.startMa - p.endMa }}
              >
                <span
                  className="font-mono text-[0.625rem] tracking-[0.12em] uppercase [writing-mode:vertical-rl]"
                  style={{ color: BAND_TEXT[p.name], transform: "rotate(180deg)" }}
                >
                  {p.name}
                </span>
              </li>
            ))}
          </ol>

          {species.map((s) => {
            const top = ageToFraction(s.age.maxMa);
            const height = ageToFraction(s.age.minMa) - top;
            return (
              <span
                key={s.slug}
                aria-hidden="true"
                className="absolute left-1 w-3 rounded-xs bg-ink"
                style={{ top: `${top * 100}%`, height: `max(2px, ${height * 100}%)` }}
              />
            );
          })}

          <svg
            aria-hidden="true"
            className="absolute inset-y-0 left-5 h-full w-4 overflow-visible text-rule"
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
          >
            {species.map((s, i) => {
              const y0 = truth[i]! * 100;
              const y1 = labels[i]! * 100;
              return (
                <path
                  key={s.slug}
                  d={`M0 ${y0} C5 ${y0} 5 ${y1} 10 ${y1}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          <ol className="absolute inset-y-0 right-0 left-9">
            {species.map((s, i) => (
              <li
                key={s.slug}
                className="absolute inset-x-0 -translate-y-1/2"
                style={{ top: `${labels[i]! * 100}%` } as CSSProperties}
              >
                <Link
                  href={`/species/${s.slug}`}
                  aria-current={s.slug === slug ? "page" : undefined}
                  className="group block leading-tight text-muted hover:text-ink aria-[current=page]:text-ink"
                >
                  <span className="block font-display text-[0.95rem] italic group-aria-[current=page]:underline group-aria-[current=page]:decoration-accent group-aria-[current=page]:underline-offset-4">
                    {s.scientificName}
                  </span>
                  <span className="font-mono text-[0.625rem] tracking-wide">
                    {formatMa(s)}
                    <span className="sr-only">, {s.period}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <p className="label mt-2 font-mono">66 Ma</p>
      </nav>
    </>
  );
}
