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
      // What scripts/blender/prepare_model.py and scripts/build-asset.mjs change (CC BY requires stating this).
      modifications: [
        "scaled to an estimated life-size length of 12 m",
        "material converted from specular-glossiness to metallic-roughness",
        "textures resized and re-encoded",
        "geometry compressed",
      ],
    },
    appearanceNotes: [
      {
        text: "Skin colour and pattern are the model artist's interpretation, not based on fossil evidence.",
        level: 4,
        citationIds: [],
      },
    ],
    // Model is life-size: 12 m long (z −6 → +6, head toward +z), 4.2 m tall, eyes ≈ 3.7 m up.
    camera: {
      default: { position: [12.5, 4.6, 11], target: [0, 2.9, 0.4] },
      presets: [
        { id: "side", label: "Side", position: [18, 2.8, 0], target: [0, 2.8, 0] },
        { id: "front", label: "Front", position: [2.5, 4, 15], target: [0, 2.8, 2] },
        { id: "head", label: "Head", position: [5, 4.4, 9.5], target: [0, 3.5, 5] },
      ],
      limits: { minDistance: 2, maxDistance: 45, maxPolarAngle: 1.5 },
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
