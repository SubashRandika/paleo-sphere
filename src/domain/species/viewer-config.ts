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
  habitatId?: string;
  fossil?: { src: string; label: string; isCast: boolean };
  modelDescription: string;
};

export function toViewerConfig(species: Species): ViewerConfig {
  const p = species.presentation;
  return {
    slug: species.slug,
    scientificName: species.scientificName,
    model: p.model,
    camera: p.camera,
    modes: p.modes,
    hotspots: p.hotspots,
    ...(p.habitatId && { habitatId: p.habitatId }),
    ...(p.fossil && { fossil: { src: p.fossil.src, label: p.fossil.label, isCast: p.fossil.isCast } }),
    modelDescription: p.a11y.modelDescription,
  };
}
