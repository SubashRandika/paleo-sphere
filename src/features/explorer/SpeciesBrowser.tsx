"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { facets, filterSpecies, type SpeciesFilter, type SpeciesSummary } from "@/domain/species/explorer";
import { formatDiet, formatRange } from "@/features/article/format";
import { useHydrated } from "@/lib/browser-hooks";

const PERIOD_FILL: Record<SpeciesSummary["period"], string> = {
  Triassic: "bg-period-triassic",
  Jurassic: "bg-period-jurassic",
  Cretaceous: "bg-period-cretaceous",
};

const formatMa = (s: SpeciesSummary) =>
  s.age.maxMa === s.age.minMa ? `${s.age.maxMa} Ma` : `${s.age.maxMa}–${s.age.minMa} Ma`;

/**
 * Searchable, filterable species list (oldest first).
 * The server renders every species; search and filters appear once JavaScript runs,
 * so the list is complete and navigable without it. Options come from the data itself.
 */
export function SpeciesBrowser({ species }: { species: readonly SpeciesSummary[] }) {
  const hydrated = useHydrated();
  const [filter, setFilter] = useState<SpeciesFilter>({});
  const options = useMemo(() => facets(species), [species]);
  const shown = filterSpecies(species, filter);
  const active = Boolean(filter.query?.trim() || filter.period || filter.diet || filter.group);

  const toggle = <K extends "period" | "diet" | "group">(key: K, value: NonNullable<SpeciesFilter[K]>) =>
    setFilter((f) => ({ ...f, [key]: f[key] === value ? undefined : value }));

  return (
    <div className="space-y-6">
      {hydrated && (
        <div role="search" aria-label="Find a species" className="space-y-4">
          <label className="block max-w-md space-y-1.5">
            <span className="label">Search</span>
            <input
              type="search"
              value={filter.query ?? ""}
              onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
              placeholder="Name, nickname or group"
              className="block w-full rounded-md border border-rule bg-surface px-3 py-2 text-base text-ink placeholder:text-muted"
            />
          </label>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <ChipGroup
              label="Period"
              options={options.periods.map((p) => [p, p])}
              selected={filter.period}
              onToggle={(v) => toggle("period", v)}
            />
            <ChipGroup
              label="Diet"
              options={options.diets.map((d) => [d, formatDiet(d)])}
              selected={filter.diet}
              onToggle={(v) => toggle("diet", v)}
            />
            <ChipGroup
              label="Group"
              options={options.groups.map((g) => [g, g])}
              selected={filter.group}
              onToggle={(v) => toggle("group", v)}
            />
          </div>

          <p role="status" className="flex items-baseline gap-4 text-sm text-muted">
            {shown.length === species.length
              ? `${species.length} species`
              : `${shown.length} of ${species.length} species`}
            {active && (
              <button
                type="button"
                onClick={() => setFilter({})}
                className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>
      )}

      {shown.length === 0 ? (
        <p className="border-y border-rule py-8 text-ink">
          No species match. Try another name, or clear the filters.
        </p>
      ) : (
        // Cell borders rather than a gap over a coloured background, so an incomplete last row
        // leaves empty space instead of a filled block.
        <ul className="grid border-t border-l border-rule sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <li key={s.slug} className="border-r border-b border-rule">
              <SpeciesCard species={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SpeciesCard({ species: s }: { species: SpeciesSummary }) {
  return (
    <Link href={`/species/${s.slug}`} className="group flex h-full flex-col hover:bg-surface">
      <span aria-hidden="true" className={`h-1 ${PERIOD_FILL[s.period]}`} />
      <span className="relative block aspect-[4/3] overflow-hidden">
        {s.poster ? (
          // Transparent render of the model; plain <img> like the viewer poster.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.poster}
            alt=""
            loading="lazy"
            // The poster includes the stage floor's light pool; fade its edges into the card.
            style={{ maskImage: "radial-gradient(ellipse 60% 60% at 50% 55%, #000 55%, transparent 100%)" }}
            className="size-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <span className="label absolute inset-0 grid place-items-center">3D model in preparation</span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-1 border-t border-rule p-5">
        <span className="font-display text-2xl leading-tight italic">{s.scientificName}</span>
        <span className="text-sm text-muted">
          {s.group} · {s.period} · <span className="font-mono text-xs">{formatMa(s)}</span>
        </span>
        <span className="mt-2 flex gap-4 text-sm text-ink">
          {s.length && <span className="font-mono">{formatRange(s.length.min, s.length.max, "m")}</span>}
          <span>{formatDiet(s.diet)}</span>
        </span>
      </span>
    </Link>
  );
}

function ChipGroup<V extends string>(props: {
  label: string;
  options: [V, string][];
  selected: V | undefined;
  onToggle(value: V): void;
}) {
  if (props.options.length < 2) return null;
  return (
    <fieldset className="space-y-1.5">
      <legend className="label">{props.label}</legend>
      <div className="flex flex-wrap gap-2">
        {props.options.map(([value, text]) => (
          <button
            key={value}
            type="button"
            aria-pressed={props.selected === value}
            onClick={() => props.onToggle(value)}
            className="rounded-full border border-rule px-3 py-1 text-sm text-muted hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
          >
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
