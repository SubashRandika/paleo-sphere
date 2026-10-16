"use client";

import { useParams } from "next/navigation";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { ModelPlaceholder } from "@/features/article/ModelPlaceholder";
import { ViewerIsland } from "@/features/viewer/ViewerIsland";
import { HotspotNote, type HotspotNoteData } from "./HotspotNote";

export type StageEntries = Record<
  string,
  { scientificName: string; viewer: ViewerConfig | null; notes: Record<string, HotspotNoteData> }
>;

/**
 * The 3D stage for whichever species is in the URL. It lives in the species layout, so
 * moving between species re-renders only the page content beside it: the WebGL canvas,
 * renderer and transcoder stay alive and only the model is swapped (see Scene.tsx).
 */
export function SpeciesStage({ stage }: { stage: StageEntries }) {
  const { slug } = useParams<{ slug?: string }>();
  const entry = slug ? stage[slug] : undefined;
  if (!entry) return null;

  return (
    <div className="relative grid lg:col-start-2 lg:row-start-1">
      {entry.viewer ? (
        <>
          <ViewerIsland config={entry.viewer} />
          <HotspotNote notes={entry.notes} />
        </>
      ) : (
        <ModelPlaceholder scientificName={entry.scientificName} />
      )}
    </div>
  );
}
