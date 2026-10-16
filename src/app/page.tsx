import { toSummaries } from "@/domain/species/explorer";
import { getAllSpecies } from "@/domain/species/repository";
import { SpeciesBrowser } from "@/features/explorer/SpeciesBrowser";

export default function HomePage() {
  const species = toSummaries(getAllSpecies());

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-16 sm:px-6">
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
          Species, oldest first
        </h2>
        <SpeciesBrowser species={species} />
      </section>
    </div>
  );
}
