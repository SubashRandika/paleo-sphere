import Link from "next/link";
import { getAllSpecies } from "@/domain/species/repository";

export default function HomePage() {
  const species = getAllSpecies();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-16 sm:px-6">
      <header className="max-w-2xl space-y-4">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          Dinosaurs as the fossils describe them — and where the evidence runs out.
        </h1>
        <p className="text-muted">
          Turn each reconstruction in 3D, then read what is known from bone, what is inferred, and what is an
          artist’s choice.
        </p>
      </header>

      <section aria-labelledby="species-heading" className="space-y-4">
        <h2 id="species-heading" className="label">
          Species
        </h2>
        <ul className="border-t border-rule">
          {species.map((s) => (
            <li key={s.slug} className="border-b border-rule">
              <Link
                href={`/species/${s.slug}`}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1 py-4 hover:bg-surface"
              >
                <span className="font-display text-2xl italic">{s.scientificName}</span>
                <span className="flex items-baseline gap-4">
                  {!s.presentation && <span className="label">Text only · 3D model in preparation</span>}
                  <span className="font-mono text-xs text-muted">{s.authority}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
