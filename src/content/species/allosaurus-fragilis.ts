import type { SpeciesInput } from "@/domain/species/schema";

/**
 * Research notes: docs/research/allosaurus-fragilis.md.
 * A model is shortlisted (docs/asset-research.md) but not yet prepared, so this record has content only.
 */
const accessed = "2026-10-16";

export const allosaurusFragilis: SpeciesInput = {
  id: "allosaurus-fragilis",
  slug: "allosaurus-fragilis",
  scientificName: "Allosaurus fragilis",
  authority: "Marsh, 1877",
  commonNames: ["Allosaurus"],
  synonyms: [],
  content: {
    taxonomy: ["Dinosauria", "Saurischia", "Theropoda", "Allosauridae"],
    group: "Theropod",
    period: "Jurassic",
    age: {
      maxMa: 152,
      minMa: 145,
      stage: "Late Kimmeridgian–Tithonian",
      citationIds: ["nhm-allosaurus", "pbdb-allosaurus"],
    },
    localities: [
      {
        formation: "Morrison Formation",
        region: "Wyoming, Colorado, Utah and Oklahoma",
        country: "USA",
        citationIds: ["pbdb-allosaurus"],
      },
    ],
    measurements: {
      length: {
        estimates: [
          { min: 9.7, max: 9.7, unit: "m", method: "Museum summary", citationId: "nhm-allosaurus" },
        ],
      },
      mass: {
        estimates: [
          {
            min: 1.35,
            max: 1.85,
            unit: "t",
            method: "3D volume models of a laser-scanned skeleton (best estimate 1.5 t)",
            specimen: "“Big Al”, MOR 693, not fully grown",
            citationId: "bates-2009",
          },
          {
            min: 2.7,
            max: 2.7,
            unit: "t",
            method: "Museum summary; method not stated",
            citationId: "nhm-allosaurus",
          },
        ],
      },
    },
    diet: "carnivore",
    dietEvidence: {
      text: "Its dagger-like teeth had serrated edges for cutting flesh. Likely prey included _Stegosaurus_ and _Diplodocus_.",
      level: 2,
      citationIds: ["nhm-allosaurus"],
    },
    summary:
      "_Allosaurus_ was the most common large predator of the Late Jurassic in western North America, around 150 million years ago — tens of millions of years before _Tyrannosaurus_.",
    facts: [
      {
        title: "A light skull, a weak bite",
        text: "Computer stress tests of its skull found a weak muscle-driven bite but a light, open skull of unusually high strength — pointing to a feeding style unlike a bone-crushing bite.",
        level: 2,
        citationIds: ["rayfield-2001"],
      },
      {
        title: "Feeding like a bird of prey",
        text: "A computer model of its head and neck suggests it tore flesh from carcasses by pulling its head back, as falcons and eagles do, rather than shaking like a crocodile.",
        level: 3,
        citationIds: ["snively-2013"],
      },
      {
        title: "Big Al's hard life",
        text: "“Big Al”, a young _Allosaurus_, has damaged or infected bones in its ribs, backbone, shoulder, hand, hip and feet — injuries from an active and risky life.",
        level: 1,
        citationIds: ["hanna-2002"],
      },
      {
        title: "Three predators for every plant-eater",
        text: "The Cleveland-Lloyd Dinosaur Quarry in Utah holds bones of at least 70 dinosaurs, and meat-eaters outnumber plant-eaters three to one — most of them _Allosaurus_.",
        level: 1,
        citationIds: ["gates-2005"],
      },
    ],
    known: [
      {
        text: "It is the most abundant meat-eating dinosaur in almost every Morrison Formation fossil site.",
        level: 1,
        citationIds: ["chure-loewen-2020"],
      },
      {
        text: "A second species, _Allosaurus jimmadseni_, named in 2020 from older rock layers, differs from _A. fragilis_ in its skull, including blade-like crests along the snout.",
        level: 1,
        citationIds: ["chure-loewen-2020"],
      },
      {
        text: "Fossils once named _Saurophaganax_, thought to be a larger relative, turned out to be a mix of bones. The meat-eater's bones were renamed as a new species, _Allosaurus anax_, in 2024.",
        level: 2,
        citationIds: ["danison-2024", "nhm-allosaurus"],
      },
    ],
    uncertain: [
      {
        text: "Did it hunt in packs? Several individuals are sometimes found together, but there may be other reasons for this. Bite marks from other _Allosaurus_ suggest they at least competed and fought.",
        level: 3,
        citationIds: ["nhm-allosaurus"],
      },
      {
        text: "Why so many _Allosaurus_ died at Cleveland-Lloyd is debated: a predator trap, a drought, or carcasses washed into a seasonal pond by floods.",
        level: 3,
        citationIds: ["gates-2005", "peterson-2017"],
      },
      {
        text: "The small horns above its eyes may have helped individuals recognise each other, served as display, or shaded the eyes.",
        level: 3,
        citationIds: ["nhm-allosaurus"],
      },
    ],
    anatomy: [
      {
        text: "Three-fingered hands and small horns above the eyes.",
        level: 1,
        citationIds: ["nhm-allosaurus"],
      },
      {
        text: "A neck muscle attached unusually low on the back of the skull, unlike in nearly all other meat-eating dinosaurs, giving extra power to downward head movements.",
        level: 2,
        citationIds: ["snively-2013"],
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
        text: "Its injuries suggest a risky lifestyle: chasing prey, fighting rivals for mates, and competing over carcasses and territory.",
        level: 3,
        citationIds: ["hanna-2002"],
      },
      {
        text: "It may sometimes have bitten flesh from very large dinosaurs without killing them, letting the prey survive and heal.",
        level: 3,
        citationIds: ["nhm-allosaurus"],
      },
    ],
    habitat: [
      {
        text: "Its world was semi-arid, with periodic droughts.",
        level: 2,
        citationIds: ["gates-2005"],
      },
      {
        text: "It shared the Morrison Formation landscape with _Stegosaurus_.",
        level: 1,
        citationIds: ["pbdb-allosaurus", "pbdb-stegosaurus"],
      },
    ],
    discovery: [
      {
        text: "Othniel Charles Marsh named _Allosaurus fragilis_, “different lizard”, in 1877.",
        level: 1,
        citationIds: ["marsh-1877", "nhm-allosaurus"],
      },
      {
        text: "Excavation at the Cleveland-Lloyd Dinosaur Quarry began in the 1920s and has produced thousands of bones.",
        level: 1,
        citationIds: ["peterson-2017", "gates-2005"],
      },
      {
        text: "“Big Al” (MOR 693) was found in 1991 in Big Horn County, Wyoming.",
        level: 1,
        citationIds: ["hanna-2002"],
      },
    ],
    hotspotNotes: [],
    citations: [
      {
        id: "nhm-allosaurus",
        type: "web",
        authors: ["Natural History Museum, London"],
        title: "Allosaurus — Dino Directory",
        venue: "Natural History Museum, London",
        url: "https://www.nhm.ac.uk/discover/dino-directory/allosaurus.html",
        accessed,
      },
      {
        id: "pbdb-allosaurus",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Allosaurus fragilis: fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Allosaurus%20fragilis&show=strat,loc",
        accessed,
      },
      {
        id: "pbdb-stegosaurus",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Stegosaurus stenops: fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Stegosaurus%20stenops&show=strat,loc",
        accessed,
      },
      {
        id: "marsh-1877",
        type: "article",
        authors: ["Marsh, O. C."],
        year: 1877,
        title: "Notice of new dinosaurian reptiles from the Jurassic formation",
        venue: "American Journal of Science",
        volume: "14",
        pages: "514–516",
        doi: "10.2475/ajs.s3-14.84.514",
        url: "https://doi.org/10.2475/ajs.s3-14.84.514",
        accessed,
      },
      {
        id: "rayfield-2001",
        type: "article",
        authors: [
          "Rayfield, E. J.",
          "Norman, D. B.",
          "Horner, C. C.",
          "Horner, J. R.",
          "Smith, P. M.",
          "Thomason, J. J.",
          "Upchurch, P.",
        ],
        year: 2001,
        title: "Cranial design and function in a large theropod dinosaur",
        venue: "Nature",
        volume: "409",
        pages: "1033–1037",
        doi: "10.1038/35059070",
        url: "https://doi.org/10.1038/35059070",
        accessed,
      },
      {
        id: "hanna-2002",
        type: "article",
        authors: ["Hanna, R. R."],
        year: 2002,
        title:
          "Multiple injury and infection in a sub-adult theropod dinosaur Allosaurus fragilis with comparisons to allosaur pathology in the Cleveland-Lloyd Dinosaur Quarry Collection",
        venue: "Journal of Vertebrate Paleontology",
        volume: "22",
        pages: "76–90",
        doi: "10.1671/0272-4634(2002)022[0076:MIAIIA]2.0.CO;2",
        url: "https://doi.org/10.1671/0272-4634(2002)022[0076:MIAIIA]2.0.CO;2",
        accessed,
      },
      {
        id: "gates-2005",
        type: "article",
        authors: ["Gates, T. A."],
        year: 2005,
        title: "The Late Jurassic Cleveland-Lloyd Dinosaur Quarry as a drought-induced assemblage",
        venue: "PALAIOS",
        volume: "20",
        pages: "363–375",
        doi: "10.2110/palo.2003.p03-22",
        url: "https://doi.org/10.2110/palo.2003.p03-22",
        accessed,
      },
      {
        id: "bates-2009",
        type: "article",
        authors: [
          "Bates, K. T.",
          "Falkingham, P. L.",
          "Breithaupt, B. H.",
          "Hodgetts, D.",
          "Sellers, W. I.",
          "Manning, P. L.",
        ],
        year: 2009,
        title:
          "How big was ‘Big Al’? Quantifying the effect of soft tissue and osteological unknowns on mass predictions for Allosaurus (Dinosauria: Theropoda)",
        venue: "Palaeontologia Electronica",
        volume: "12",
        pages: "14A",
        url: "https://palaeo-electronica.org/2009_3/186/index.html",
        accessed,
      },
      {
        id: "snively-2013",
        type: "article",
        authors: ["Snively, E.", "Cotton, J. R.", "Ridgely, R.", "Witmer, L. M."],
        year: 2013,
        title: "Multibody dynamics model of head and neck function in Allosaurus (Dinosauria, Theropoda)",
        venue: "Palaeontologia Electronica",
        volume: "16",
        doi: "10.26879/338",
        url: "https://doi.org/10.26879/338",
        accessed,
      },
      {
        id: "peterson-2017",
        type: "article",
        authors: ["Peterson, J. E.", "Warnock, J. P.", "Eberhart, S. L.", "Clawson, S. R.", "Noto, C. R."],
        year: 2017,
        title:
          "New data towards the development of a comprehensive taphonomic framework for the Late Jurassic Cleveland-Lloyd Dinosaur Quarry, Central Utah",
        venue: "PeerJ",
        volume: "5",
        pages: "e3368",
        doi: "10.7717/peerj.3368",
        url: "https://doi.org/10.7717/peerj.3368",
        accessed,
      },
      {
        id: "chure-loewen-2020",
        type: "article",
        authors: ["Chure, D. J.", "Loewen, M. A."],
        year: 2020,
        title:
          "Cranial anatomy of Allosaurus jimmadseni, a new species from the lower part of the Morrison Formation (Upper Jurassic) of Western North America",
        venue: "PeerJ",
        volume: "8",
        pages: "e7803",
        doi: "10.7717/peerj.7803",
        url: "https://doi.org/10.7717/peerj.7803",
        accessed,
      },
      {
        id: "danison-2024",
        type: "article",
        authors: [
          "Danison, A.",
          "Wedel, M.",
          "Barta, D.",
          "Woodward, H.",
          "Flora, H.",
          "Lee, A.",
          "Snively, E.",
        ],
        year: 2024,
        title:
          "Chimerism in specimens referred to Saurophaganax maximus reveals a new species of Allosaurus (Dinosauria, Theropoda)",
        venue: "Vertebrate Anatomy Morphology Palaeontology",
        volume: "12",
        doi: "10.18435/vamp29404",
        url: "https://doi.org/10.18435/vamp29404",
        accessed,
      },
    ],
  },
  presentation: {
    model: {
      high: "/models/allosaurus-fragilis/allosaurus-fragilis-high.glb",
      mobile: "/models/allosaurus-fragilis/allosaurus-fragilis-mobile.glb",
      poster: "/models/allosaurus-fragilis/allosaurus-fragilis-poster.webp",
    },
    attribution: {
      creator: "Anees Animates",
      creatorUrl: "https://sketchfab.com/AneesAnimates",
      title: "Animated Allosaurus (Free)",
      sourceUrl: "https://sketchfab.com/3d-models/animated-allosaurus-free-3dfc4629ce3f48f183305ddb3b2ad656",
      license: "CC-BY-NC-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      modifications: [
        "posed from the first frame of its walk animation; rig and animation removed",
        "scaled to a length of 9.7 m",
        "material converted from specular-glossiness to metallic-roughness",
        "materials set to non-metallic (skin and horn are not metal)",
        "textures resized and re-encoded",
        "geometry compressed",
      ],
    },
    appearanceNotes: [
      {
        text: "Three-fingered hands and small horns above the eyes, as in the fossils.",
        level: 1,
        citationIds: ["nhm-allosaurus"],
      },
      {
        text: "Skin colour, pattern and the lip-like tissue over the teeth are the model artist's interpretation, not based on fossil evidence.",
        level: 4,
        citationIds: [],
      },
    ],
    // Model is 9.7 m long (z −4.85 → +4.85, head toward +z), 3.5 m tall, in mid-stride.
    camera: {
      default: { position: [10.2, 3.8, 9], target: [0, 2.2, 0.4] },
      presets: [
        { id: "side", label: "Side", position: [14.5, 2.3, 0], target: [0, 2.2, 0] },
        { id: "front", label: "Front", position: [2, 3.2, 12.5], target: [0, 2.3, 1.8] },
        { id: "head", label: "Head", position: [4, 3.4, 8.4], target: [0, 2.8, 4] },
      ],
      limits: { minDistance: 2, maxDistance: 38, maxPolarAngle: 1.5 },
    },
    modes: ["studio"],
    hotspots: [],
    a11y: {
      modelDescription:
        "3D model of Allosaurus fragilis walking on two legs, caught mid-stride, with its body and tail held level.",
    },
  },
  review: { status: "published", reviewedOn: "2026-10-16" },
};
