import type { SpeciesInput } from "@/domain/species/schema";

/**
 * DRAFT — scientific content is researched and cited in Phase 5.
 * Only fields verified so far are filled in:
 *  - attribution: copied from license.txt in the Sketchfab download (2026-10-15)
 *  - camera values: provisional, tuned against the real model in Phase 3
 */
export const tyrannosaurusRex: SpeciesInput = {
  id: "tyrannosaurus-rex",
  slug: "tyrannosaurus-rex",
  scientificName: "Tyrannosaurus rex",
  authority: "Osborn, 1905",
  commonNames: ["T. rex"],
  synonyms: [],
  presentation: {
    model: {
      high: "/models/tyrannosaurus-rex/tyrannosaurus-rex-high.glb",
      mobile: "/models/tyrannosaurus-rex/tyrannosaurus-rex-mobile.glb",
      poster: "/models/tyrannosaurus-rex/tyrannosaurus-rex-poster.webp",
    },
    attribution: {
      creator: "Marcel Schanz",
      creatorUrl: "https://sketchfab.com/mschanz",
      title: "Tyrant King - Tyrannosaurus",
      sourceUrl: "https://sketchfab.com/3d-models/tyrant-king-tyrannosaurus-6465a297fa784598adc49f6e0042d449",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      // Filled in when the asset pipeline produces the delivered files (Phase 3).
      modifications: [],
    },
    appearanceNotes: [
      {
        text: "Skin colour and pattern are the model artist's interpretation, not based on fossil evidence.",
        level: 4,
        citationIds: [],
      },
    ],
    camera: {
      default: { position: [14, 4, 10], target: [0, 2, 0] },
      presets: [
        { id: "side", label: "Side", position: [18, 3, 0], target: [0, 2, 0] },
        { id: "front", label: "Front", position: [0, 3, 16], target: [0, 2.5, 0] },
      ],
      limits: { minDistance: 3, maxDistance: 40, maxPolarAngle: 1.45 },
    },
    modes: ["studio"],
    hotspots: [],
    a11y: {
      modelDescription:
        "3D model of Tyrannosaurus rex standing on two legs, body and tail held level, mouth open.",
    },
  },
  review: { status: "draft" },
};
