import type { SpeciesInput } from "@/domain/species/schema";

/**
 * Research notes: docs/research/mamenchisaurus.md.
 *
 * Genus-level record: the type species M. constructus is fragmentary, and what is known about
 * Mamenchisaurus comes from several species (M. hochuanensis, M. sinocanadorum and others) whose
 * relationships are unresolved. The shortlisted model is not species-specific either.
 * No 3D model has been prepared yet (Phase 6), so this record has content only.
 */
const accessed = "2026-10-16";

export const mamenchisaurus: SpeciesInput = {
  id: "mamenchisaurus",
  slug: "mamenchisaurus",
  scientificName: "Mamenchisaurus",
  authority: "Young, 1954",
  commonNames: [],
  synonyms: [],
  content: {
    taxonomy: ["Dinosauria", "Saurischia", "Sauropodomorpha", "Sauropoda", "Eusauropoda"],
    group: "Sauropod",
    period: "Jurassic",
    age: {
      maxMa: 155,
      minMa: 145,
      stage: "Late Jurassic",
      citationIds: ["nhm-mamenchisaurus", "pbdb-mamenchisaurus"],
    },
    localities: [
      {
        formation: "Upper Shaximiao Formation",
        region: "Sichuan Basin (Sichuan and Chongqing)",
        country: "China",
        citationIds: ["pbdb-mamenchisaurus", "wang-2019"],
      },
      {
        formation: "Shishugou Formation",
        region: "Junggar Basin, Xinjiang",
        country: "China",
        citationIds: ["pbdb-mamenchisaurus", "russell-zheng-1993"],
      },
      {
        formation: "Suining Formation",
        region: "Sichuan Basin",
        country: "China",
        citationIds: ["wang-2019"],
      },
    ],
    measurements: {
      length: {
        estimates: [
          {
            min: 22,
            max: 22,
            unit: "m",
            method: "Museum summary for the genus",
            citationId: "nhm-mamenchisaurus",
          },
        ],
      },
    },
    diet: "herbivore",
    dietEvidence: {
      text: "Like other sauropods it had a small, light head that did not chew; plant food was swallowed without being processed in the mouth.",
      level: 2,
      citationIds: ["taylor-wedel-2013"],
    },
    summary:
      "_Mamenchisaurus_ was a giant long-necked plant-eater from China, best known for having one of the longest necks of any land animal known.",
    facts: [
      {
        title: "A neck over 14 metres",
        text: "Scaling from the bones of _Mamenchisaurus sinocanadorum_ implies a neck more than 14 m long — rivalling the longest-necked sauropods known.",
        level: 2,
        citationIds: ["moore-2023"],
      },
      {
        title: "Bones full of air",
        text: "CT scans show its neck vertebrae were extensively hollowed by air spaces, as in the largest sauropods, keeping the long neck light.",
        level: 1,
        citationIds: ["moore-2023"],
      },
      {
        title: "Why giraffes can't compete",
        text: "Sauropod necks reached six times the length of the record giraffe's. Giraffes are limited to seven neck vertebrae and carry heavy heads without the air-sac system that lightened sauropod bones.",
        level: 2,
        citationIds: ["taylor-wedel-2013"],
      },
      {
        title: "Long necks, rarely complete",
        text: "Almost no sauropod neck has been found complete and undistorted, so neck lengths and postures are reconstructions built from partial skeletons.",
        level: 2,
        citationIds: ["taylor-2022"],
      },
    ],
    known: [
      {
        text: "Several species have been named from China. Most fossils come from the Upper Shaximiao Formation of the Sichuan Basin.",
        level: 1,
        citationIds: ["wang-2019", "pbdb-mamenchisaurus"],
      },
      {
        text: "Sauropod necks could grow so long thanks to large bodies on four legs, small heads, many long neck vertebrae, and a bird-like air-sac breathing system.",
        level: 2,
        citationIds: ["taylor-wedel-2013"],
      },
    ],
    uncertain: [
      {
        text: "The species placed in _Mamenchisaurus_ may not form one natural group; a 2023 analysis found the genus needs revising.",
        level: 3,
        citationIds: ["moore-2023"],
      },
      {
        text: "Zircon dating suggests the species _M. anyuensis_ lived about 114 million years ago, in the Early Cretaceous — which would mean mamenchisaurids survived at least 30 million years longer than thought.",
        level: 3,
        citationIds: ["wang-2019"],
      },
      {
        text: "How the neck was usually held and how far it could bend are hard to test, because the fossils are incomplete and distorted.",
        level: 3,
        citationIds: ["taylor-2022"],
      },
    ],
    anatomy: [
      {
        text: "Very long neck ribs, forked at the front end — a feature found almost only in mamenchisaurids.",
        level: 1,
        citationIds: ["moore-2023"],
      },
    ],
    integument: [
      {
        text: "Skin texture and colour shown in any reconstruction of _Mamenchisaurus_ are interpretations.",
        level: 4,
        citationIds: [],
      },
    ],
    behaviour: [
      {
        text: "Earlier studies suggested that the long neck ribs steadied the neck by limiting how much it could bend.",
        level: 3,
        citationIds: ["moore-2023"],
      },
    ],
    habitat: [
      {
        text: "It belonged to a group of sauropods that diversified in East Asia during the Middle and Late Jurassic.",
        level: 2,
        citationIds: ["moore-2023"],
      },
    ],
    discovery: [
      {
        text: "Chung Chien Young (Yang Zhongjian) named the genus and its first species, _M. constructus_, in 1954 from fossils found at Yiping, Sichuan.",
        level: 1,
        citationIds: ["young-1954", "pbdb-mamenchisaurus"],
      },
      {
        text: "_Mamenchisaurus sinocanadorum_ was named in 1993 from the Junggar Basin, Xinjiang, and is still known from a single specimen.",
        level: 1,
        citationIds: ["russell-zheng-1993", "moore-2023"],
      },
    ],
    hotspotNotes: [
      {
        hotspotId: "head",
        title: "A head that did not chew",
        body: {
          text: "Like other sauropods it had a small, light head that did not chew; plant food was swallowed without being processed in the mouth.",
          level: 2,
          citationIds: ["taylor-wedel-2013"],
        },
      },
      {
        hotspotId: "length",
        title: "One of the longest necks",
        body: {
          text: "Scaling from the bones of _Mamenchisaurus sinocanadorum_ implies a neck more than 14 m long — rivalling the longest-necked sauropods known.",
          level: 2,
          citationIds: ["moore-2023"],
        },
      },
      {
        hotspotId: "vertebrae",
        title: "Hollow neck bones",
        body: {
          text: "CT scans show its neck vertebrae were extensively hollowed by air spaces, as in the largest sauropods, keeping the long neck light.",
          level: 1,
          citationIds: ["moore-2023"],
        },
      },
      {
        hotspotId: "ribs",
        title: "Long neck ribs",
        body: {
          text: "Very long neck ribs, forked at the front end — a feature found almost only in mamenchisaurids.",
          level: 1,
          citationIds: ["moore-2023"],
        },
      },
    ],
    citations: [
      {
        id: "nhm-mamenchisaurus",
        type: "web",
        authors: ["Natural History Museum, London"],
        title: "Mamenchisaurus — Dino Directory",
        venue: "Natural History Museum, London",
        url: "https://www.nhm.ac.uk/discover/dino-directory/mamenchisaurus.html",
        accessed,
      },
      {
        id: "pbdb-mamenchisaurus",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Mamenchisaurus Young 1954: fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Mamenchisaurus&show=strat,loc",
        accessed,
      },
      {
        id: "young-1954",
        type: "article",
        authors: ["Young, C.-C."],
        year: 1954,
        title: "On a new sauropod from Yiping, Szechuan, China",
        venue: "Acta Palaeontologica Sinica",
        volume: "2",
        pages: "355–369",
        url: "https://paleobiodb.org/data1.2/refs/single.json?id=24276&show=both",
        accessed,
      },
      {
        id: "russell-zheng-1993",
        type: "article",
        authors: ["Russell, D. A.", "Zheng, Z."],
        year: 1993,
        title: "A large mamenchisaurid from the Junggar Basin, Xinjiang, People's Republic of China",
        venue: "Canadian Journal of Earth Sciences",
        volume: "30",
        pages: "2082–2095",
        doi: "10.1139/e93-180",
        url: "https://doi.org/10.1139/e93-180",
        accessed,
      },
      {
        id: "taylor-wedel-2013",
        type: "article",
        authors: ["Taylor, M. P.", "Wedel, M. J."],
        year: 2013,
        title: "Why sauropods had long necks; and why giraffes have short necks",
        venue: "PeerJ",
        volume: "1",
        pages: "e36",
        doi: "10.7717/peerj.36",
        url: "https://doi.org/10.7717/peerj.36",
        accessed,
      },
      {
        id: "wang-2019",
        type: "article",
        authors: ["Wang, J.", "Norell, M. A.", "Pei, R.", "Ye, Y.", "Chang, S.-C."],
        year: 2019,
        title: "Surprisingly young age for the mamenchisaurid sauropods in South China",
        venue: "Cretaceous Research",
        volume: "104",
        pages: "104176",
        doi: "10.1016/j.cretres.2019.07.006",
        url: "https://doi.org/10.1016/j.cretres.2019.07.006",
        accessed,
      },
      {
        id: "taylor-2022",
        type: "article",
        authors: ["Taylor, M. P."],
        year: 2022,
        title: "Almost all known sauropod necks are incomplete and distorted",
        venue: "PeerJ",
        volume: "10",
        pages: "e12810",
        doi: "10.7717/peerj.12810",
        url: "https://doi.org/10.7717/peerj.12810",
        accessed,
      },
      {
        id: "moore-2023",
        type: "article",
        authors: [
          "Moore, A. J.",
          "Barrett, P. M.",
          "Upchurch, P.",
          "Liao, C.-C.",
          "Ye, Y.",
          "Hao, B.",
          "Xu, X.",
        ],
        year: 2023,
        title:
          "Re-assessment of the Late Jurassic eusauropod Mamenchisaurus sinocanadorum Russell and Zheng, 1993, and the evolution of exceptionally long necks in mamenchisaurids",
        venue: "Journal of Systematic Palaeontology",
        volume: "21",
        pages: "2171818",
        doi: "10.1080/14772019.2023.2171818",
        url: "https://doi.org/10.1080/14772019.2023.2171818",
        accessed,
      },
    ],
  },
  presentation: {
    model: {
      high: "/models/mamenchisaurus/mamenchisaurus-high.glb",
      mobile: "/models/mamenchisaurus/mamenchisaurus-mobile.glb",
      poster: "/models/mamenchisaurus/mamenchisaurus-poster.webp",
    },
    attribution: {
      creator: "DailyArt",
      creatorUrl: "https://sketchfab.com/D.art",
      title: "Mamen River Dragon",
      sourceUrl: "https://sketchfab.com/3d-models/mamen-river-dragon-6e6611b4a204479aac83dfd96183e779",
      license: "CC-BY-NC-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      modifications: [
        "posed from a frame of its animation with the neck held about level; rig and animation removed",
        "scaled so its length along the neck, back and tail is 22 m",
        "rigged with a skeleton and given a looping idle animation",
        "materials set to non-metallic (skin and horn are not metal)",
        "textures resized and re-encoded",
        "geometry compressed",
      ],
    },
    appearanceNotes: [
      {
        text: "The neck is shown held about level. How the neck was usually held is hard to test, because the fossils are incomplete and distorted.",
        level: 3,
        citationIds: ["taylor-2022"],
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
    // 22 m along the body (scripts/blender/midline_length.py); the curved pose spans 17.7 m (z), 4.0 m tall.
    // Snout at (−1.1, 3.2, 8.9).
    camera: {
      default: { position: [17, 6.5, 16], target: [0, 2.6, 0.5] },
      presets: [
        { id: "side", label: "Side", position: [27, 3.2, 0], target: [0, 2.6, 0] },
        { id: "front", label: "Front", position: [3, 4.5, 23], target: [-0.5, 3, 4] },
        { id: "head", label: "Head", position: [5, 4.2, 12.6], target: [-0.9, 3.1, 7.3] },
      ],
      limits: { minDistance: 3, maxDistance: 60, maxPolarAngle: 1.5 },
    },
    modes: ["studio", "anatomy"],
    // Clip from scripts/blender/animate_idle.py (spec: scripts/blender/rigs/mamenchisaurus-idle.json).
    animation: { clip: "Idle" },
    // Surface points from scripts/blender/surface_points.py (`marker`: 4 cm off the surface), 2026-10-17.
    hotspots: [
      {
        id: "head",
        label: "Small head",
        position: [-0.61, 3.44, 8.52],
        view: { position: [2.55, 4.07, 10.16], target: [-0.64, 3.45, 8.5] },
      },
      {
        id: "length",
        label: "Neck length",
        position: [0.4, 3.55, 6.51],
        view: { position: [5.98, 4.58, 8.6], target: [0.36, 3.55, 6.5] },
      },
      {
        id: "vertebrae",
        label: "Air-filled neck bones",
        position: [0.78, 3.17, 4.8],
        view: { position: [5.62, 4.01, 5.92], target: [0.75, 3.15, 4.8] },
      },
      {
        id: "ribs",
        label: "Long neck ribs",
        position: [1.1, 2.37, 3.31],
        view: { position: [5.77, 3.26, 5.03], target: [1.08, 2.4, 3.3] },
      },
    ],
    a11y: {
      modelDescription:
        "3D model of Mamenchisaurus standing on four legs, with a very long neck held about level and a long tail curving to one side.",
    },
  },
  review: { status: "published", reviewedOn: "2026-10-16" },
};
