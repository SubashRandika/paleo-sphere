import { toSummaries } from "@/domain/species/explorer";
import { getAllSpecies } from "@/domain/species/repository";
import { toViewerConfig } from "@/domain/species/viewer-config";
import type { Species } from "@/domain/species/schema";
import { indexCitations } from "@/features/article/format";
import type { HotspotNoteData } from "@/features/explorer/HotspotNote";
import { SpeciesStage, type StageEntries } from "@/features/explorer/SpeciesStage";
import { StrataRail } from "@/features/explorer/StrataRail";

/**
 * Shared frame for every species page: strata rail · 3D stage · (page: info panel, article).
 *
 * The stage is here rather than in the page so it survives navigation between species.
 * The page's elements are placed into this grid directly (React fragments add no DOM):
 *   lg — row 1: rail | stage | panel (one screen tall), row 2: article across all columns.
 *   phones — one column in source order: rail strip, stage, panel, article.
 */
export default function SpeciesLayout({ children }: LayoutProps<"/species">) {
  const species = getAllSpecies();
  const stage: StageEntries = Object.fromEntries(
    species.map((s) => [
      s.slug,
      { scientificName: s.scientificName, viewer: toViewerConfig(s) ?? null, notes: hotspotNotes(s) },
    ]),
  );

  return (
    <div className="grid flex-1 lg:flex-none lg:grid-cols-[13rem_minmax(0,1fr)_24rem] lg:grid-rows-[calc(100svh-3.5rem)_auto]">
      <StrataRail species={toSummaries(species)} />
      <SpeciesStage stage={stage} />
      {children}
    </div>
  );
}

/** Hotspot explanations with source numbers matching the page's sources list. Drafts show none. */
function hotspotNotes(s: Species): Record<string, HotspotNoteData> {
  const c = s.review.status === "draft" ? undefined : s.content;
  if (!c) return {};
  const index = indexCitations(c.citations);
  return Object.fromEntries(
    c.hotspotNotes.map((n) => [
      n.hotspotId,
      {
        title: n.title,
        text: n.body.text,
        level: n.body.level,
        refs: n.body.citationIds.map((id) => ({ id, n: index.get(id)! })),
      },
    ]),
  );
}
