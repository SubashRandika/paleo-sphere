import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSpecies, getSpeciesBySlug } from "@/domain/species/repository";
import { SpeciesPanel } from "@/features/article/SpeciesPanel";
import { SpeciesArticle } from "@/features/article/SpeciesArticle";
import { indexCitations } from "@/features/article/format";
import { plainText } from "@/ui/RichText";

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
    description: species.content
      ? plainText(species.content.summary)
      : species.presentation?.a11y.modelDescription,
    alternates: { canonical: `/species/${species.slug}` },
    // Only records signed off as `published` are offered to search engines (see schema review gates).
    robots: { index: species.review.status === "published", follow: true },
  };
}

/**
 * The 3D stage and strata rail come from ../layout.tsx and persist across species; this page
 * supplies the per-species panel and article.
 *
 * `instant = false`: navigating here may wait for this page's (prerendered) payload instead of
 * showing a placeholder first. The alternative — reading `params` inside <Suspense> — streams
 * the text into a hidden block that only JavaScript reveals, which would hide every fact from
 * visitors and crawlers without JavaScript (docs/architecture.md §16).
 */
export const instant = false;

export default async function SpeciesPage({ params }: PageProps<"/species/[slug]">) {
  const species = getSpeciesBySlug((await params).slug);
  if (!species) notFound();

  // Drafts hold unreviewed research, so none of it is shown.
  const content = species.review.status === "draft" ? undefined : species.content;
  const index = indexCitations(content?.citations ?? []);

  return (
    <>
      <SpeciesPanel species={species} content={content} index={index} />
      {content && (
        <div className="lg:col-span-full lg:row-start-2">
          <SpeciesArticle content={content} index={index} />
        </div>
      )}
    </>
  );
}
