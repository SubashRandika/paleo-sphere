import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSpecies, getSpeciesBySlug } from "@/domain/species/repository";
import { toViewerConfig } from "@/domain/species/viewer-config";
import { ModelAttribution } from "@/features/article/ModelAttribution";
import { ViewerIsland } from "@/features/viewer/ViewerIsland";

// Every species page is prerendered at build time. Content is validated here,
// so an invalid species file fails `next build`.
export function generateStaticParams() {
  return getAllSpecies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/species/[slug]">): Promise<Metadata> {
  const species = getSpeciesBySlug((await params).slug);
  if (!species) return {};
  return {
    title: species.scientificName,
    description: species.content?.summary ?? species.presentation.a11y.modelDescription,
    alternates: { canonical: `/species/${species.slug}` },
  };
}

export default async function SpeciesPage({ params }: PageProps<"/species/[slug]">) {
  const species = getSpeciesBySlug((await params).slug);
  if (!species) notFound();

  const isDraft = species.review.status === "draft";

  return (
    <div className="grid flex-1 lg:h-[calc(100svh-3.5rem)] lg:flex-none lg:grid-cols-[minmax(0,1fr)_24rem]">
      <ViewerIsland config={toViewerConfig(species)} />

      <aside className="space-y-8 border-t border-rule px-4 py-8 sm:px-6 lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <header className="space-y-2">
          <p className="label">{species.content?.taxonomy.at(-1) ?? "Specimen record"}</p>
          <h1 className="font-display text-5xl leading-none font-normal italic">{species.scientificName}</h1>
          <p className="font-mono text-xs text-muted">{species.authority}</p>
          {species.commonNames.length > 0 && (
            <p className="text-sm text-muted">Also known as {species.commonNames.join(", ")}</p>
          )}
        </header>

        {isDraft && (
          <p className="border-l-2 border-accent pl-3 text-sm text-ink">
            Research in progress. Facts for this species have not been reviewed yet, so none are shown.
          </p>
        )}

        <ModelAttribution
          attribution={species.presentation.attribution}
          appearanceNotes={species.presentation.appearanceNotes}
        />
      </aside>
    </div>
  );
}
