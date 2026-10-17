import type { SpeciesInput } from "@/domain/species/schema";

/**
 * Research notes: docs/research/brachiosaurus-altithorax.md.
 */
const accessed = "2026-10-17";

export const brachiosaurusAltithorax: SpeciesInput = {
  id: "brachiosaurus-altithorax",
  slug: "brachiosaurus-altithorax",
  scientificName: "Brachiosaurus altithorax",
  authority: "Riggs, 1903",
  commonNames: ["Brachiosaurus"],
  synonyms: [],
  content: {
    taxonomy: ["Dinosauria", "Saurischia", "Sauropodomorpha", "Sauropoda", "Macronaria", "Brachiosauridae"],
    group: "Sauropod",
    period: "Jurassic",
    age: {
      maxMa: 152,
      minMa: 145,
      stage: "Kimmeridgian–Tithonian",
      citationIds: ["nhm-brachiosaurus", "pbdb-brachiosaurus"],
    },
    localities: [
      {
        formation: "Morrison Formation",
        region: "Colorado, Wyoming, Utah and Oklahoma",
        country: "USA",
        citationIds: ["pbdb-brachiosaurus"],
      },
    ],
    measurements: {
      length: {
        estimates: [
          { min: 22, max: 22, unit: "m", method: "Museum summary", citationId: "nhm-brachiosaurus" },
        ],
      },
      mass: {
        estimates: [
          {
            min: 28.7,
            max: 28.7,
            unit: "t",
            method: "Volume of a scaled body reconstruction, assuming a density of 0.8 kg per litre",
            specimen: "Reconstruction based on the type specimen, FMNH P 25107",
            citationId: "taylor-2009",
          },
          {
            min: 46.9,
            max: 46.9,
            unit: "t",
            method: "Museum summary; method not stated",
            citationId: "nhm-brachiosaurus",
          },
          {
            min: 56.3,
            max: 56.3,
            unit: "t",
            method: "Scaling from the thickness of the limb bones (upper-arm thickness estimated)",
            specimen: "Type specimen, FMNH P 25107",
            citationId: "benson-2014",
          },
        ],
      },
    },
    diet: "herbivore",
    dietEvidence: {
      text: "Like other sauropods it swallowed plant food without chewing it. It probably browsed on leaves high in trees such as conifers and tree ferns.",
      level: 3,
      citationIds: ["sander-2010", "nhm-brachiosaurus"],
    },
    summary:
      "_Brachiosaurus_ was a giant plant-eater whose front legs were longer than its back legs, tilting its body upward. Most pictures of it actually show its African relative _Giraffatitan_.",
    facts: [
      {
        title: "Not the animal in the pictures",
        text: "Its popular image comes almost entirely from the African _Giraffatitan_, once thought to be a species of _Brachiosaurus_. The two differ in at least 26 features of the skeleton.",
        level: 2,
        citationIds: ["taylor-2009", "nhm-brachiosaurus"],
      },
      {
        title: "“Arm lizard”",
        text: "Its name means “arm lizard”: its front legs were longer than its back legs, which tilted its body upward.",
        level: 1,
        citationIds: ["nhm-brachiosaurus"],
      },
      {
        title: "Still growing",
        text: "The type specimen was probably not fully grown, because some of its shoulder bones had not yet fused. Adults may have been larger.",
        level: 2,
        citationIds: ["taylor-2009", "nhm-brachiosaurus"],
      },
      {
        title: "A skull from 1883",
        text: "A nearly complete skull found in 1883 was studied with CT scans and referred to _Brachiosaurus_ in 2019. Its teeth were replaced more slowly than those of the sauropods it lived alongside, hinting at a different diet.",
        level: 3,
        citationIds: ["demic-carrano-2019"],
      },
    ],
    known: [
      {
        text: "The type skeleton has no skull or neck. It consists of the last seven back vertebrae, the hip, two tail vertebrae, ribs, a shoulder bone, an upper arm bone, a hip bone and a thigh bone.",
        level: 1,
        citationIds: ["taylor-2009"],
      },
      {
        text: "Compared with _Giraffatitan_ it had a longer and deeper trunk, probably a longer tail, and carried more of its weight on its front legs.",
        level: 2,
        citationIds: ["taylor-2009"],
      },
      {
        text: "Giant bones from Dry Mesa, Colorado, once named “_Ultrasauros_” and cited as an even bigger brachiosaur, cannot be confidently referred to _Brachiosaurus_; that animal was probably smaller than the type specimen.",
        level: 2,
        citationIds: ["taylor-2009"],
      },
    ],
    uncertain: [
      {
        text: "Weight estimates differ by a factor of two, from about 29 to 56 tonnes, depending on whether they come from a body model or from the thickness of the limb bones.",
        level: 2,
        citationIds: ["taylor-2009", "benson-2014"],
      },
      {
        text: "How sauropods held their necks has long been debated. Living animals habitually hold their necks raised, which suggests sauropods did too.",
        level: 3,
        citationIds: ["taylor-wedel-naish-2009"],
      },
    ],
    anatomy: [
      {
        text: "Its front legs were longer than its back legs.",
        level: 1,
        citationIds: ["nhm-brachiosaurus"],
      },
      {
        text: "Its trunk was long and deep, longer and deeper than that of _Giraffatitan_.",
        level: 2,
        citationIds: ["taylor-2009"],
      },
      {
        text: "Like other sauropods, its long neck was lightened by air spaces in the vertebrae, and its head could stay small because it did not chew.",
        level: 2,
        citationIds: ["sander-2010"],
      },
    ],
    integument: [
      {
        text: "No fossil evidence of its colour is known. Any colour scheme is an interpretation.",
        level: 4,
        citationIds: [],
      },
    ],
    behaviour: [
      {
        text: "It probably fed on leaves from tall trees and digested them with the help of bacteria in its intestines (hindgut fermentation), as horses and elephants do.",
        level: 3,
        citationIds: ["nhm-brachiosaurus"],
      },
    ],
    habitat: [
      {
        text: "The Morrison Formation records rivers, floodplains and lakes, at a time when the climate was much warmer than today.",
        level: 2,
        citationIds: ["maidment-muxworthy-2019"],
      },
      {
        text: "It lived at the same time and in the same places as _Brontosaurus_, but was much taller and fed higher up.",
        level: 3,
        citationIds: ["nhm-brachiosaurus"],
      },
    ],
    discovery: [
      {
        text: "Elmer S. Riggs of the Field Columbian Museum in Chicago found the first bones in the Grand River valley of western Colorado in 1900. At first he thought he had found a _Brontosaurus_.",
        level: 1,
        citationIds: ["taylor-2009", "nhm-brachiosaurus"],
      },
      {
        text: "Riggs named it _Brachiosaurus altithorax_ in 1903 and called it “the largest known dinosaur”.",
        level: 1,
        citationIds: ["riggs-1903"],
      },
      {
        text: "The type specimen is now in the Field Museum, Chicago, as FMNH P 25107.",
        level: 1,
        citationIds: ["taylor-2009"],
      },
    ],
    hotspotNotes: [
      {
        hotspotId: "forelimb",
        title: "Arms longer than legs",
        body: {
          text: "Its front legs were longer than its back legs.",
          level: 1,
          citationIds: ["nhm-brachiosaurus"],
        },
      },
      {
        hotspotId: "trunk",
        title: "A long, deep trunk",
        body: {
          text: "Its trunk was long and deep, longer and deeper than that of _Giraffatitan_.",
          level: 2,
          citationIds: ["taylor-2009"],
        },
      },
      {
        hotspotId: "neck",
        title: "A light neck",
        body: {
          text: "Like other sauropods, its long neck was lightened by air spaces in the vertebrae, and its head could stay small because it did not chew.",
          level: 2,
          citationIds: ["sander-2010"],
        },
      },
      {
        hotspotId: "head",
        title: "A skull from 1883",
        body: {
          text: "A nearly complete skull found in 1883 was studied with CT scans and referred to _Brachiosaurus_ in 2019. Its teeth were replaced more slowly than those of the sauropods it lived alongside, hinting at a different diet.",
          level: 3,
          citationIds: ["demic-carrano-2019"],
        },
      },
    ],
    citations: [
      {
        id: "nhm-brachiosaurus",
        type: "web",
        authors: ["Natural History Museum, London"],
        title: "Brachiosaurus — Dino Directory",
        venue: "Natural History Museum, London",
        url: "https://www.nhm.ac.uk/discover/dino-directory/brachiosaurus.html",
        accessed,
      },
      {
        id: "pbdb-brachiosaurus",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Brachiosaurus in the Morrison Formation: fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Brachiosaurus&formation=Morrison&show=strat,loc",
        accessed,
      },
      {
        id: "riggs-1903",
        type: "article",
        authors: ["Riggs, E. S."],
        year: 1903,
        title: "Brachiosaurus altithorax, the largest known dinosaur",
        venue: "American Journal of Science",
        volume: "15",
        pages: "299–306",
        doi: "10.2475/ajs.s4-15.88.299",
        url: "https://doi.org/10.2475/ajs.s4-15.88.299",
        accessed,
      },
      {
        id: "taylor-2009",
        type: "article",
        authors: ["Taylor, M. P."],
        year: 2009,
        title:
          "A re-evaluation of Brachiosaurus altithorax Riggs 1903 (Dinosauria, Sauropoda) and its generic separation from Giraffatitan brancai (Janensch 1914)",
        venue: "Journal of Vertebrate Paleontology",
        volume: "29",
        pages: "787–806",
        doi: "10.1671/039.029.0309",
        url: "https://doi.org/10.1671/039.029.0309",
        accessed,
      },
      {
        id: "demic-carrano-2019",
        type: "article",
        authors: ["D'Emic, M. D.", "Carrano, M. T."],
        year: 2019,
        title:
          "Redescription of brachiosaurid sauropod dinosaur material from the Upper Jurassic Morrison Formation, Colorado, USA",
        venue: "The Anatomical Record",
        volume: "303",
        pages: "732–758",
        doi: "10.1002/ar.24198",
        url: "https://doi.org/10.1002/ar.24198",
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
      {
        id: "sander-2010",
        type: "article",
        authors: [
          "Sander, P. M.",
          "Christian, A.",
          "Clauss, M.",
          "Fechner, R.",
          "Gee, C. T.",
          "Griebeler, E. M.",
          "Gunga, H. C.",
          "Hummel, J.",
          "Mallison, H.",
          "Perry, S. F.",
          "Preuschoft, H.",
          "Rauhut, O. W. M.",
          "Remes, K.",
          "Tütken, T.",
          "Wings, O.",
          "Witzel, U.",
        ],
        year: 2010,
        title: "Biology of the sauropod dinosaurs: the evolution of gigantism",
        venue: "Biological Reviews",
        volume: "86",
        pages: "117–155",
        doi: "10.1111/j.1469-185X.2010.00137.x",
        url: "https://doi.org/10.1111/j.1469-185X.2010.00137.x",
        accessed,
      },
      {
        id: "taylor-wedel-naish-2009",
        type: "article",
        authors: ["Taylor, M. P.", "Wedel, M. J.", "Naish, D."],
        year: 2009,
        title: "Head and neck posture in sauropod dinosaurs inferred from extant animals",
        venue: "Acta Palaeontologica Polonica",
        volume: "54",
        pages: "213–220",
        doi: "10.4202/app.2009.0007",
        url: "https://doi.org/10.4202/app.2009.0007",
        accessed,
      },
      {
        id: "maidment-muxworthy-2019",
        type: "article",
        authors: ["Maidment, S. C. R.", "Muxworthy, A."],
        year: 2019,
        title: "A chronostratigraphic framework for the Upper Jurassic Morrison Formation, western U.S.A.",
        venue: "Journal of Sedimentary Research",
        volume: "89",
        pages: "1017–1038",
        doi: "10.2110/jsr.2019.54",
        url: "https://doi.org/10.2110/jsr.2019.54",
        accessed,
      },
    ],
  },
  presentation: {
    model: {
      high: "/models/brachiosaurus-altithorax/brachiosaurus-altithorax-high.glb",
      mobile: "/models/brachiosaurus-altithorax/brachiosaurus-altithorax-mobile.glb",
      poster: "/models/brachiosaurus-altithorax/brachiosaurus-altithorax-poster.webp",
    },
    attribution: {
      creator: "Nazar Striletskyj",
      creatorUrl: "https://sketchfab.com/Nazarstr",
      title: "Brachiosaurus realistic",
      sourceUrl: "https://sketchfab.com/3d-models/brachiosaurus-realistic-0846c18d1b0e4fdfba4e9c528ae5ecac",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      modifications: [
        "scaled to a length of 22 m along the backbone",
        "64 parts merged and simplified from 2.0 million to 118,000 triangles",
        "rigged with a skeleton and given a looping idle animation",
        "materials set to non-metallic (skin is not metal)",
        "textures resized and re-encoded",
        "geometry compressed",
      ],
    },
    appearanceNotes: [
      {
        text: "Like most reconstructions, its overall shape follows the better-known African relative _Giraffatitan_: the type skeleton of _Brachiosaurus_ has no skull or neck.",
        level: 2,
        citationIds: ["nhm-brachiosaurus", "taylor-2009"],
      },
      {
        text: "The front legs are longer than the back legs, as in the fossils.",
        level: 1,
        citationIds: ["nhm-brachiosaurus"],
      },
      {
        text: "Its neck is shown raised. Living animals habitually hold their necks this way, but how sauropods held theirs is still debated.",
        level: 3,
        citationIds: ["taylor-wedel-naish-2009"],
      },
      {
        text: "Skin texture and colour are the model artist's interpretation, not based on fossil evidence.",
        level: 4,
        citationIds: [],
      },
      {
        text: "The idle animation is an artistic interpretation. The movements are deliberately small and slow; their timing is not based on fossil evidence.",
        level: 4,
        citationIds: [],
      },
    ],
    // 22 m along the backbone; the pose spans 18.4 m (z), 11.2 m tall, head toward +z.
    camera: {
      default: { position: [22, 8.5, 20], target: [0, 5.6, 1] },
      presets: [
        { id: "side", label: "Side", position: [31, 6, 0], target: [0, 5.6, 0] },
        { id: "front", label: "Front", position: [3.5, 7, 27], target: [0, 6.5, 3] },
        { id: "head", label: "Head", position: [7, 11.6, 15], target: [0.1, 10.8, 8.6] },
      ],
      limits: { minDistance: 3, maxDistance: 75, maxPolarAngle: 1.5 },
    },
    modes: ["studio", "anatomy"],
    // Clip from scripts/blender/animate_idle.py (spec: scripts/blender/rigs/brachiosaurus-altithorax-idle.json).
    animation: { clip: "Idle" },
    // Surface points from scripts/blender/surface_points.py (`marker`: 4 cm off the surface), 2026-10-17.
    hotspots: [
      {
        id: "forelimb",
        label: "Long front legs",
        position: [1.581, 1.998, 3.343],
        view: { position: [8.57, 3.2, 3.67], target: [1.58, 2.0, 3.34] },
      },
      {
        id: "trunk",
        label: "Long, deep trunk",
        position: [1.294, 4.018, 0.995],
        view: { position: [10.27, 5.56, 1.71], target: [1.29, 4.02, 0.99] },
      },
      {
        id: "neck",
        label: "Long, light neck",
        position: [0.338, 8.0, 5.901],
        view: { position: [7.72, 9.29, 7.22], target: [0.34, 8.0, 5.9] },
      },
      {
        id: "head",
        label: "A skull from 1883",
        position: [0.19, 10.862, 8.594],
        view: { position: [5.68, 11.8, 8.94], target: [0.19, 10.86, 8.59] },
      },
    ],
    a11y: {
      modelDescription:
        "3D model of Brachiosaurus altithorax standing on four legs, its front legs longer than its back legs and its long neck held almost upright.",
    },
  },
  review: { status: "reviewed", reviewedOn: "2026-10-17" },
};
