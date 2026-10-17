import type { PresentationMode, Species, SpeciesPresentation } from "./schema";

/**
 * Everything the 3D viewer needs — and nothing more.
 * The viewer never receives citations or prose; that keeps the rendering engine
 * independent of how scientific content is stored.
 */
export type ViewerConfig = {
  slug: string;
  scientificName: string;
  model: SpeciesPresentation["model"];
  camera: SpeciesPresentation["camera"];
  modes: PresentationMode[];
  hotspots: SpeciesPresentation["hotspots"];
  animation?: SpeciesPresentation["animation"];
  habitatId?: string;
  fossil?: Pick<NonNullable<SpeciesPresentation["fossil"]>, "model" | "label" | "isCast" | "camera">;
  modelDescription: string;
};

/** Undefined when the species has no prepared 3D model yet. */
export function toViewerConfig(species: Species): ViewerConfig | undefined {
  const p = species.presentation;
  if (!p) return undefined;
  return {
    slug: species.slug,
    scientificName: species.scientificName,
    model: p.model,
    camera: p.camera,
    modes: p.modes,
    hotspots: p.hotspots,
    ...(p.animation && { animation: p.animation }),
    ...(p.habitatId && { habitatId: p.habitatId }),
    ...(p.fossil && {
      fossil: {
        model: p.fossil.model,
        label: p.fossil.label,
        isCast: p.fossil.isCast,
        camera: p.fossil.camera,
      },
    }),
    modelDescription: p.a11y.modelDescription,
  };
}
