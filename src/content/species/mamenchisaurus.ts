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
    hotspotNotes: [],
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
  review: { status: "published", reviewedOn: "2026-10-16" },
};
