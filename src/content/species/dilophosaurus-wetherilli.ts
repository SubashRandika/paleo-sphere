import type { SpeciesInput } from "@/domain/species/schema";

/**
 * Research notes: docs/research/dilophosaurus-wetherilli.md.
 */
const accessed = "2026-10-17";

export const dilophosaurusWetherilli: SpeciesInput = {
  id: "dilophosaurus-wetherilli",
  slug: "dilophosaurus-wetherilli",
  scientificName: "Dilophosaurus wetherilli",
  authority: "(Welles, 1954)",
  commonNames: ["Dilophosaurus"],
  synonyms: ["Megalosaurus wetherilli"],
  content: {
    taxonomy: ["Dinosauria", "Saurischia", "Theropoda", "Neotheropoda"],
    group: "Theropod",
    period: "Jurassic",
    age: {
      maxMa: 199.5,
      minMa: 184.2,
      stage: "Sinemurian–Pliensbachian",
      citationIds: ["marsh-rowe-2020", "pbdb-dilophosaurus"],
    },
    localities: [
      {
        formation: "Kayenta Formation",
        region: "Arizona (Navajo Nation)",
        country: "USA",
        citationIds: ["marsh-rowe-2020", "pbdb-dilophosaurus"],
      },
    ],
    measurements: {
      length: {
        estimates: [{ min: 7, max: 7, unit: "m", method: "Museum summary", citationId: "nhm-dilophosaurus" }],
      },
      mass: {
        estimates: [
          {
            min: 290,
            max: 290,
            unit: "kg",
            method: "Scaling from the thickness of the limb bones",
            specimen: "Type specimen, UCMP 37302",
            citationId: "benson-2014",
          },
          {
            min: 349,
            max: 349,
            unit: "kg",
            method: "Scaling from the thickness of the limb bones",
            specimen: "UCMP 77270, a larger individual",
            citationId: "benson-2014",
          },
          {
            min: 400,
            max: 400,
            unit: "kg",
            method: "Museum summary; method not stated",
            citationId: "nhm-dilophosaurus",
          },
        ],
      },
    },
    diet: "carnivore",
    dietEvidence: {
      text: "Its jaws held many sharp, curved teeth. It probably ate smaller animals and fish, and possibly other dinosaurs.",
      level: 2,
      citationIds: ["nhm-dilophosaurus"],
    },
    summary:
      "_Dilophosaurus_ was a lightly built meat-eater with two thin crests on its head. In the Early Jurassic it was the largest animal known to have lived on land in North America.",
    facts: [
      {
        title: "Early Jurassic giant",
        text: "It was the largest animal known to have lived on land in North America during the Early Jurassic.",
        level: 1,
        citationIds: ["marsh-rowe-2020"],
      },
      {
        title: "The first crested meat-eater",
        text: "It was the first meat-eating dinosaur ever found with crests on its skull. Others found since include _Cryolophosaurus_, _Monolophosaurus_ and _Guanlong_.",
        level: 1,
        citationIds: ["nhm-dilophosaurus"],
      },
      {
        title: "A survivor",
        text: "The type skeleton has eight injured or diseased bones in its shoulders and arms, including a broken shoulder blade. They healed over months or years, but one finger stayed permanently stiff.",
        level: 1,
        citationIds: ["senter-juengst-2016"],
      },
      {
        title: "No venom, no frill",
        text: "There is no fossil evidence that it spat venom or had a neck frill. Both were invented for the _Jurassic Park_ novel and film.",
        level: 2,
        citationIds: ["nhm-dilophosaurus"],
      },
    ],
    known: [
      {
        text: "Five skeletons from the Kayenta Formation of Arizona all belong to a single species.",
        level: 1,
        citationIds: ["marsh-rowe-2020"],
      },
      {
        text: "A 2020 study found it was not a close relative of _Coelophysis_ or of the ceratosaurs, but an early offshoot near the base of the group that includes nearly all later meat-eating dinosaurs.",
        level: 2,
        citationIds: ["marsh-rowe-2020"],
      },
    ],
    uncertain: [
      {
        text: "Nobody is certain what the crests were for. The most likely ideas are recognising other _Dilophosaurus_ or attracting a mate; they were probably too weak for fighting.",
        level: 3,
        citationIds: ["nhm-dilophosaurus"],
      },
      {
        text: "It is unclear whether it had feathers. Some fossil footprints may show feather-like impressions, but whether _Dilophosaurus_ made them is disputed.",
        level: 3,
        citationIds: ["nhm-dilophosaurus"],
      },
      {
        text: "The notch in its upper jaw was once taken as a sign of weak jaws and small prey or fish. Later studies suggest its jaws were stronger than first thought.",
        level: 3,
        citationIds: ["nhm-dilophosaurus"],
      },
    ],
    anatomy: [
      {
        text: "Two thin crests ran along the top of its skull, formed by bones of the snout and the bone in front of the eye.",
        level: 1,
        citationIds: ["marsh-rowe-2020", "nhm-dilophosaurus"],
      },
      {
        text: "Its upper jaw had a big notch that left a sizeable gap in the teeth.",
        level: 1,
        citationIds: ["nhm-dilophosaurus"],
      },
      {
        text: "It had a light build and was probably very good at running down prey.",
        level: 3,
        citationIds: ["nhm-dilophosaurus"],
      },
    ],
    integument: [
      {
        text: "In life the crests were probably covered with hard keratin, and may have looked larger or differently shaped than the bone alone.",
        level: 3,
        citationIds: ["nhm-dilophosaurus"],
      },
      {
        text: "No fossil evidence of its colour is known. Any colour scheme is an interpretation.",
        level: 4,
        citationIds: [],
      },
    ],
    behaviour: [
      {
        text: "Most researchers think it was an active hunter rather than a scavenger. There is some evidence it preyed on the plant-eating dinosaur _Sarahsaurus_.",
        level: 3,
        citationIds: ["nhm-dilophosaurus"],
      },
      {
        text: "Its injuries healed over months or years, so it survived long after they happened.",
        level: 2,
        citationIds: ["senter-juengst-2016"],
      },
    ],
    habitat: [
      {
        text: "It lived in a desert crossed by rivers, where sand dunes moved in and out of the wetter areas as the seasons changed.",
        level: 2,
        citationIds: ["nhm-dilophosaurus"],
      },
      {
        text: "Skeletons of the plant-eater _Sarahsaurus_ were found directly underneath one _Dilophosaurus_ skeleton.",
        level: 1,
        citationIds: ["marsh-rowe-2020"],
      },
    ],
    discovery: [
      {
        text: "A Navajo man, Jesse Williams, found the first skeletons in 1940 near Moenave, Arizona. Sam Welles of the University of California excavated them in 1942.",
        level: 1,
        citationIds: ["marsh-rowe-2020", "nhm-dilophosaurus"],
      },
      {
        text: "Welles first named the species _Megalosaurus wetherilli_ in 1954. After finding a specimen that showed the crests, he renamed it _Dilophosaurus_, “two-crested lizard”, in 1970.",
        level: 1,
        citationIds: ["welles-1954", "marsh-rowe-2020", "nhm-dilophosaurus"],
      },
      {
        text: "More skeletons were found in 2001, showing parts of the body not seen before.",
        level: 1,
        citationIds: ["nhm-dilophosaurus"],
      },
    ],
    hotspotNotes: [
      {
        hotspotId: "crests",
        title: "Two thin crests",
        body: {
          text: "Two thin crests ran along the top of its skull, formed by bones of the snout and the bone in front of the eye.",
          level: 1,
          citationIds: ["marsh-rowe-2020", "nhm-dilophosaurus"],
        },
      },
      {
        hotspotId: "jaw",
        title: "A gap in the teeth",
        body: {
          text: "Its upper jaw had a big notch that left a sizeable gap in the teeth.",
          level: 1,
          citationIds: ["nhm-dilophosaurus"],
        },
      },
      {
        hotspotId: "arm",
        title: "A survivor",
        body: {
          text: "The type skeleton has eight injured or diseased bones in its shoulders and arms, including a broken shoulder blade. They healed over months or years, but one finger stayed permanently stiff.",
          level: 1,
          citationIds: ["senter-juengst-2016"],
        },
      },
      {
        hotspotId: "legs",
        title: "Built to run",
        body: {
          text: "It had a light build and was probably very good at running down prey.",
          level: 3,
          citationIds: ["nhm-dilophosaurus"],
        },
      },
    ],
    citations: [
      {
        id: "nhm-dilophosaurus",
        type: "web",
        authors: ["Natural History Museum, London"],
        title: "Dilophosaurus — Dino Directory",
        venue: "Natural History Museum, London",
        url: "https://www.nhm.ac.uk/discover/dino-directory/dilophosaurus.html",
        accessed,
      },
      {
        id: "pbdb-dilophosaurus",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Dilophosaurus wetherilli: fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Dilophosaurus%20wetherilli&show=strat,loc",
        accessed,
      },
      {
        id: "welles-1954",
        type: "article",
        authors: ["Welles, S. P."],
        year: 1954,
        title: "New Jurassic dinosaur from the Kayenta Formation of Arizona",
        venue: "Geological Society of America Bulletin",
        volume: "65",
        pages: "591",
        doi: "10.1130/0016-7606(1954)65[591:NJDFTK]2.0.CO;2",
        url: "https://doi.org/10.1130/0016-7606(1954)65[591:NJDFTK]2.0.CO;2",
        accessed,
      },
      {
        id: "marsh-rowe-2020",
        type: "article",
        authors: ["Marsh, A. D.", "Rowe, T. B."],
        year: 2020,
        title:
          "A comprehensive anatomical and phylogenetic evaluation of Dilophosaurus wetherilli (Dinosauria, Theropoda) with descriptions of new specimens from the Kayenta Formation of northern Arizona",
        venue: "Journal of Paleontology",
        volume: "94",
        pages: "1–103",
        doi: "10.1017/jpa.2020.14",
        url: "https://doi.org/10.1017/jpa.2020.14",
        accessed,
      },
      {
        id: "senter-juengst-2016",
        type: "article",
        authors: ["Senter, P.", "Juengst, S. L."],
        year: 2016,
        title:
          "Record-breaking pain: the largest number and variety of forelimb bone maladies in a theropod dinosaur",
        venue: "PLOS ONE",
        volume: "11",
        pages: "e0149140",
        doi: "10.1371/journal.pone.0149140",
        url: "https://doi.org/10.1371/journal.pone.0149140",
        accessed,
      },
      {
        id: "benson-2014",
        type: "article",
        authors: [
          "Benson, R. B. J.",
          "Campione, N. E.",
          "Carrano, M. T.",
          "Mannion, P. D.",
          "Sullivan, C.",
          "Upchurch, P.",
          "Evans, D. C.",
        ],
        year: 2014,
        title:
          "Rates of dinosaur body mass evolution indicate 170 million years of sustained ecological innovation on the avian stem lineage",
        venue: "PLOS Biology",
        volume: "12",
        pages: "e1001853",
        doi: "10.1371/journal.pbio.1001853",
        url: "https://doi.org/10.1371/journal.pbio.1001853",
        accessed,
      },
    ],
  },
  presentation: {
    model: {
      high: "/models/dilophosaurus-wetherilli/dilophosaurus-wetherilli-high.glb",
      mobile: "/models/dilophosaurus-wetherilli/dilophosaurus-wetherilli-mobile.glb",
      poster: "/models/dilophosaurus-wetherilli/dilophosaurus-wetherilli-poster.webp",
    },
    attribution: {
      creator: "Marcel Schanz",
      creatorUrl: "https://sketchfab.com/mschanz",
      title: "Dilophosaurus",
      sourceUrl: "https://sketchfab.com/3d-models/dilophosaurus-d09b3aa874db4e1cbf29a14797ca351f",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      modifications: [
        "turned to face forward",
        "scaled to a length of 7 m",
        "material converted from specular-glossiness to metallic-roughness",
        "rigged with a skeleton and given a looping idle animation",
        "materials set to non-metallic (skin and horn are not metal)",
        "textures resized and re-encoded",
        "geometry compressed",
      ],
    },
    appearanceNotes: [
      {
        text: "The two thin crests on the skull follow the fossils, and there is no neck frill: no fossil shows one.",
        level: 2,
        citationIds: ["marsh-rowe-2020", "nhm-dilophosaurus"],
      },
      {
        text: "It is shown with scaly skin and no feathers. Whether it had feathers is unknown.",
        level: 3,
        citationIds: ["nhm-dilophosaurus"],
      },
      {
        text: "Skin colour, pattern and the exposed teeth are the model artist's interpretation, not based on fossil evidence.",
        level: 4,
        citationIds: [],
      },
      {
        text: "The idle animation is an artistic interpretation. The movements are deliberately small and slow; their timing is not based on fossil evidence.",
        level: 4,
        citationIds: [],
      },
    ],
    // 7 m long (z −3.5 → +3.5, head toward +z), 2.1 m tall; standing with legs side by side.
    camera: {
      default: { position: [7.4, 2.7, 6.6], target: [0, 1.4, 0.3] },
      presets: [
        { id: "side", label: "Side", position: [10.5, 1.6, 0], target: [0, 1.3, 0] },
        { id: "front", label: "Front", position: [1.6, 2.1, 9], target: [0, 1.5, 1.6] },
        { id: "head", label: "Head", position: [3, 2.2, 5.6], target: [0, 1.8, 2.9] },
      ],
      limits: { minDistance: 1.5, maxDistance: 28, maxPolarAngle: 1.5 },
    },
    modes: ["studio", "anatomy"],
    // Clip from scripts/blender/animate_idle.py (spec: scripts/blender/rigs/dilophosaurus-wetherilli-idle.json).
    animation: { clip: "Idle" },
    // Surface points from scripts/blender/surface_points.py (`marker`: 4 cm off the surface), 2026-10-17.
    hotspots: [
      {
        id: "crests",
        label: "Head crests",
        position: [0.156, 1.968, 3.115],
        view: { position: [2.18, 2.35, 3.97], target: [0.16, 1.97, 3.12] },
      },
      {
        id: "jaw",
        label: "Notch in the jaw",
        position: [0.094, 1.825, 3.386],
        view: { position: [2.03, 2.17, 3.88], target: [0.09, 1.82, 3.39] },
      },
      {
        id: "arm",
        label: "Injured arm",
        position: [0.424, 1.179, 2.3],
        view: { position: [2.46, 1.56, 3.14], target: [0.42, 1.18, 2.3] },
      },
      {
        id: "legs",
        label: "Light build",
        position: [0.37, 1.205, 1.004],
        view: { position: [3.1, 1.69, 1.62], target: [0.37, 1.21, 1.0] },
      },
    ],
    a11y: {
      modelDescription:
        "3D model of Dilophosaurus wetherilli standing on two legs, with two thin crests along the top of its skull and its jaws open.",
    },
  },
  review: { status: "reviewed", reviewedOn: "2026-10-17" },
};
