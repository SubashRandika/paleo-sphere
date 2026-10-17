import type { SpeciesInput } from "@/domain/species/schema";

/**
 * Research notes: docs/research/brontosaurus-excelsus.md.
 */
const accessed = "2026-10-17";

export const brontosaurusExcelsus: SpeciesInput = {
  id: "brontosaurus-excelsus",
  slug: "brontosaurus-excelsus",
  scientificName: "Brontosaurus excelsus",
  authority: "Marsh, 1879",
  commonNames: ["Brontosaurus"],
  synonyms: ["Apatosaurus excelsus", "Brontosaurus amplus"],
  content: {
    taxonomy: ["Dinosauria", "Saurischia", "Sauropodomorpha", "Sauropoda", "Diplodocidae"],
    group: "Sauropod",
    period: "Jurassic",
    age: {
      maxMa: 152,
      minMa: 145,
      stage: "Late Kimmeridgian–Early Tithonian",
      citationIds: ["tschopp-2015", "pbdb-brontosaurus"],
    },
    localities: [
      {
        formation: "Morrison Formation",
        region: "Wyoming, Colorado, Utah and Oklahoma",
        country: "USA",
        citationIds: ["pbdb-brontosaurus", "tschopp-2015"],
      },
    ],
    measurements: {
      length: {
        estimates: [
          {
            min: 15,
            max: 15.2,
            unit: "m",
            method: "Marsh's 1883 restoration of the skeleton: “nearly or quite fifty feet”",
            specimen: "Type specimen, YPM 1980",
            citationId: "marsh-1883",
          },
        ],
      },
      mass: {
        estimates: [
          {
            min: 30.5,
            max: 30.5,
            unit: "t",
            method: "Scaling from the thickness of the limb bones",
            specimen: "Type specimen, YPM 1980",
            citationId: "benson-2014",
          },
        ],
      },
    },
    diet: "herbivore",
    dietEvidence: {
      text: "Like other sauropods, it swallowed plant food without chewing it.",
      level: 2,
      citationIds: ["sander-2010"],
    },
    summary:
      "_Brontosaurus_ was a giant long-necked plant-eater of the Late Jurassic in western North America. Long treated as the same animal as _Apatosaurus_, it was recognised as a separate genus again in 2015.",
    facts: [
      {
        title: "Back from the dead",
        text: "Named in 1879, _Brontosaurus_ was folded into _Apatosaurus_ for more than a century. A 2015 study of diplodocid skeletons found it distinct enough to be its own genus again.",
        level: 2,
        citationIds: ["tschopp-2015", "nhm-apatosaurus"],
      },
      {
        title: "The first whole skeleton",
        text: "Its type skeleton (YPM 1980) was the first diplodocid published with a reconstruction of the entire skeleton, in 1883, and is still one of the best preserved.",
        level: 1,
        citationIds: ["tschopp-2015", "marsh-1883"],
      },
      {
        title: "About thirty tonnes",
        text: "The thickness of its type specimen's limb bones suggests it weighed about 30 tonnes.",
        level: 2,
        citationIds: ["benson-2014"],
      },
      {
        title: "Three species",
        text: "Three species are now recognised: _B. excelsus_, _B. parvus_ and _B. yahnahpin_.",
        level: 2,
        citationIds: ["tschopp-2015"],
      },
    ],
    known: [
      {
        text: "_Brontosaurus_ can be told apart from _Apatosaurus_ by details of its back vertebrae, shoulder blades and ankle bones.",
        level: 2,
        citationIds: ["tschopp-2015"],
      },
      {
        text: "Its fossils come from the Morrison Formation of Wyoming, Colorado, Utah and Oklahoma.",
        level: 1,
        citationIds: ["pbdb-brontosaurus"],
      },
    ],
    uncertain: [
      {
        text: "How sauropods held their necks has long been debated. Living animals habitually hold their necks raised, which suggests sauropods did too.",
        level: 3,
        citationIds: ["taylor-wedel-naish-2009"],
      },
      {
        text: "The length shown is Marsh's estimate from his 1883 restoration of the type skeleton, made long before modern methods.",
        level: 1,
        citationIds: ["marsh-1883"],
      },
    ],
    anatomy: [
      {
        text: "The front edge of its shoulder blade widens into a rounded expansion at the end, one of the features that set _Brontosaurus_ apart.",
        level: 1,
        citationIds: ["tschopp-2015"],
      },
      {
        text: "The type specimen's thigh bone is 1.73 m long.",
        level: 1,
        citationIds: ["benson-2014"],
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
        text: "A long neck let sauropods reach food over a large area without moving their huge bodies.",
        level: 2,
        citationIds: ["sander-2010"],
      },
    ],
    habitat: [
      {
        text: "The Morrison Formation records rivers, floodplains and lakes, at a time when the climate was much warmer than today.",
        level: 2,
        citationIds: ["maidment-muxworthy-2019"],
      },
      {
        text: "It lived at the same time and in the same places as _Brachiosaurus_, which was much taller; _Brontosaurus_ probably ate lower vegetation.",
        level: 3,
        citationIds: ["nhm-brachiosaurus"],
      },
    ],
    discovery: [
      {
        text: "Othniel Charles Marsh named _Brontosaurus excelsus_ in 1879.",
        level: 1,
        citationIds: ["marsh-1879", "tschopp-2015"],
      },
      {
        text: "The type specimen was found at Reed's Quarry 10 in Albany County, Wyoming, and is kept at Yale's Peabody Museum as YPM 1980.",
        level: 1,
        citationIds: ["tschopp-2015"],
      },
      {
        text: "In 1883 Marsh published a restoration of the whole skeleton, which he estimated at nearly 50 feet (15 m) long.",
        level: 1,
        citationIds: ["marsh-1883"],
      },
    ],
    hotspotNotes: [
      {
        hotspotId: "head",
        title: "No chewing",
        body: {
          text: "Like other sauropods, it swallowed plant food without chewing it.",
          level: 2,
          citationIds: ["sander-2010"],
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
        hotspotId: "shoulder",
        title: "A telltale shoulder",
        body: {
          text: "The front edge of its shoulder blade widens into a rounded expansion at the end, one of the features that set _Brontosaurus_ apart.",
          level: 1,
          citationIds: ["tschopp-2015"],
        },
      },
      {
        hotspotId: "thigh",
        title: "A 1.7 m thigh bone",
        body: {
          text: "The type specimen's thigh bone is 1.73 m long.",
          level: 1,
          citationIds: ["benson-2014"],
        },
      },
    ],
    citations: [
      {
        id: "tschopp-2015",
        type: "article",
        authors: ["Tschopp, E.", "Mateus, O.", "Benson, R. B. J."],
        year: 2015,
        title:
          "A specimen-level phylogenetic analysis and taxonomic revision of Diplodocidae (Dinosauria, Sauropoda)",
        venue: "PeerJ",
        volume: "3",
        pages: "e857",
        doi: "10.7717/peerj.857",
        url: "https://doi.org/10.7717/peerj.857",
        accessed,
      },
      {
        id: "pbdb-brontosaurus",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Brontosaurus: fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Brontosaurus&show=strat,loc",
        accessed,
      },
      {
        id: "nhm-apatosaurus",
        type: "web",
        authors: ["Natural History Museum, London"],
        title: "Apatosaurus — Dino Directory",
        venue: "Natural History Museum, London",
        url: "https://www.nhm.ac.uk/discover/dino-directory/apatosaurus.html",
        accessed,
      },
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
        id: "marsh-1879",
        type: "article",
        authors: ["Marsh, O. C."],
        year: 1879,
        title: "Notice of new Jurassic reptiles",
        venue: "American Journal of Science",
        volume: "18",
        pages: "501–505",
        doi: "10.2475/ajs.s3-18.108.501",
        url: "https://doi.org/10.2475/ajs.s3-18.108.501",
        accessed,
      },
      {
        id: "marsh-1883",
        type: "article",
        authors: ["Marsh, O. C."],
        year: 1883,
        title: "Principal characters of American Jurassic dinosaurs; Part VI, Restoration of Brontosaurus",
        venue: "American Journal of Science",
        volume: "26",
        pages: "81–85",
        doi: "10.2475/ajs.s3-26.152.81",
        url: "https://doi.org/10.2475/ajs.s3-26.152.81",
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
      high: "/models/brontosaurus-excelsus/brontosaurus-excelsus-high.glb",
      mobile: "/models/brontosaurus-excelsus/brontosaurus-excelsus-mobile.glb",
      poster: "/models/brontosaurus-excelsus/brontosaurus-excelsus-poster.webp",
    },
    attribution: {
      creator: "PAndras",
      creatorUrl: "https://sketchfab.com/PusztaiAndras",
      title: "Brontosaurus",
      sourceUrl: "https://sketchfab.com/3d-models/brontosaurus-d6f0c59430c346c6adcfb07fb5424756",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      modifications: [
        "background scenery removed",
        "scaled so its thigh bone matches the type specimen's",
        "parts merged and simplified from 304,000 to 106,000 triangles",
        "material converted from specular-glossiness to metallic-roughness",
        "rigged with a skeleton and given a looping idle animation",
        "materials set to non-metallic (skin is not metal)",
        "textures resized and re-encoded",
        "geometry compressed",
      ],
    },
    appearanceNotes: [
      {
        text: "The model is scaled so its thigh bone roughly matches the 1.73 m femur of the type specimen (YPM 1980). At that size it is about 21 m long along the backbone, longer than Marsh's 1883 estimate.",
        level: 1,
        citationIds: ["benson-2014", "marsh-1883"],
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
    // About 21 m along the backbone; the walking pose spans 18.2 m (z), 8.6 m tall, head toward +z.
    camera: {
      default: { position: [21, 8.5, 19], target: [0.5, 4.2, 0.8] },
      presets: [
        { id: "side", label: "Side", position: [30, 4.6, 0], target: [0, 4.2, 0] },
        { id: "front", label: "Front", position: [3.5, 6.5, 26], target: [0, 5, 4] },
        { id: "head", label: "Head", position: [7, 8.9, 14.2], target: [0.6, 8, 8.5] },
      ],
      limits: { minDistance: 3, maxDistance: 70, maxPolarAngle: 1.5 },
    },
    modes: ["studio", "anatomy"],
    // Clip from scripts/blender/animate_idle.py (spec: scripts/blender/rigs/brontosaurus-excelsus-idle.json).
    animation: { clip: "Idle" },
    // Surface points from scripts/blender/surface_points.py (`marker`: 4 cm off the surface), 2026-10-17.
    hotspots: [
      {
        id: "head",
        label: "Small head",
        position: [0.949, 8.076, 8.601],
        view: { position: [5.84, 8.93, 9.64], target: [0.95, 8.08, 8.6] },
      },
      {
        id: "neck",
        label: "Long, light neck",
        position: [0.527, 6.693, 6.008],
        view: { position: [7.27, 7.89, 7.9], target: [0.53, 6.69, 6.01] },
      },
      {
        id: "shoulder",
        label: "Shoulder blade",
        position: [1.153, 4.31, 2.883],
        view: { position: [8.1, 5.51, 2.02], target: [1.15, 4.31, 2.88] },
      },
      {
        id: "thigh",
        label: "Thigh bone",
        position: [1.153, 2.601, 1.304],
        view: { position: [7.02, 3.63, 2.58], target: [1.15, 2.6, 1.3] },
      },
    ],
    a11y: {
      modelDescription:
        "3D model of Brontosaurus excelsus walking on four legs, one front foot raised, its long neck held up at an angle and its long tail trailing behind.",
    },
  },
  review: { status: "reviewed", reviewedOn: "2026-10-17" },
};
