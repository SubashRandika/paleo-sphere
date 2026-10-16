import type { SpeciesInput } from "@/domain/species/schema";

/**
 * Research notes: docs/research/stegosaurus-stenops.md.
 * No 3D model has been prepared yet (Phase 6), so this record has content only.
 */
const accessed = "2026-10-16";

export const stegosaurusStenops: SpeciesInput = {
  id: "stegosaurus-stenops",
  slug: "stegosaurus-stenops",
  scientificName: "Stegosaurus stenops",
  authority: "Marsh, 1887",
  commonNames: ["Stegosaurus"],
  synonyms: [],
  content: {
    taxonomy: ["Dinosauria", "Ornithischia", "Thyreophora", "Stegosauria", "Stegosauridae"],
    period: "Jurassic",
    age: {
      maxMa: 152,
      minMa: 145,
      stage: "Late Kimmeridgian–Tithonian",
      citationIds: ["nhm-stegosaurus", "maidment-muxworthy-2019"],
    },
    localities: [
      {
        formation: "Morrison Formation",
        region: "Colorado, Wyoming and Utah",
        country: "USA",
        citationIds: ["pbdb-stegosaurus"],
      },
    ],
    measurements: {
      length: {
        estimates: [
          {
            min: 9,
            max: 9,
            unit: "m",
            method: "Museum summary for the genus",
            citationId: "nhm-stegosaurus",
          },
        ],
      },
      mass: {
        estimates: [
          {
            min: 1.08,
            max: 2.26,
            unit: "t",
            method: "Digital volume model of the skeleton, 95% prediction interval (best estimate 1.56 t)",
            specimen: "“Sophie”, NHMUK PV R36730, not fully grown",
            citationId: "brassey-2015",
          },
          {
            min: 2.36,
            max: 3.75,
            unit: "t",
            method:
              "Equations based on limb-bone size; the same study considers these too high for this individual",
            specimen: "“Sophie”, NHMUK PV R36730",
            citationId: "brassey-2015",
          },
        ],
      },
    },
    diet: "herbivore",
    dietEvidence: {
      text: "Its small, uniform teeth and modelled bite force suit cropping plants; the model suggests it could bite through smaller branches.",
      level: 2,
      citationIds: ["reichel-2010"],
    },
    summary:
      "_Stegosaurus_ is famous for the two rows of tall plates along its back and the spikes at the end of its tail. It was a large, slow plant-eater of the Late Jurassic in western North America, living alongside _Allosaurus_.",
    facts: [
      {
        title: "A new name-bearer",
        text: "The first species named, _Stegosaurus armatus_, is based on fossils too incomplete to identify. In 2013 the international naming authority made the well-known _S. stenops_ the species that defines the genus.",
        level: 1,
        citationIds: ["iczn-2013"],
      },
      {
        title: "Plates flat, then upright",
        text: "Marsh first thought the plates lay flat on the back. A skeleton held in place by mud showed them standing upright in two alternating rows.",
        level: 1,
        citationIds: ["nhm-stegosaurus"],
      },
      {
        title: "Meet Sophie",
        text: "Excavated in Wyoming in 2003, “Sophie” is so complete that it allowed the first detailed description of _Stegosaurus_ anatomy in over a century. It was probably buried quickly in a pond.",
        level: 2,
        citationIds: ["maidment-2015"],
      },
      {
        title: "Tail spikes toughened with age",
        text: "In older individuals the bone of the tail spikes became thicker and more compact than that of the plates, which may have strengthened them.",
        level: 2,
        citationIds: ["hayashi-2011"],
      },
    ],
    known: [
      {
        text: "Its plates and spikes are greatly enlarged versions of the small bony scutes seen in earlier armoured dinosaurs.",
        level: 2,
        citationIds: ["main-2005"],
      },
      {
        text: "“Sophie”, an essentially complete skeleton, was not fully grown when it died.",
        level: 1,
        citationIds: ["maidment-2015"],
      },
    ],
    uncertain: [
      {
        text: "What were the plates for? A 1976 wind-tunnel study proposed they shed heat like cooling fins; a 2005 study of their internal structure found no clear sign of that and favoured display and species recognition.",
        level: 3,
        citationIds: ["farlow-1976", "main-2005"],
      },
      {
        text: "Weight estimates depend strongly on method: for the same skeleton, a 3D volume model gives about 1.6 t, while equations based on limb bones give 2.4–3.8 t.",
        level: 2,
        citationIds: ["brassey-2015"],
      },
    ],
    anatomy: [
      {
        text: "The plates were embedded in the skin rather than attached to the skeleton, which is why they are usually found scattered.",
        level: 1,
        citationIds: ["nhm-stegosaurus"],
      },
      {
        text: "The tail ends in paired spikes.",
        level: 1,
        citationIds: ["hayashi-2011"],
      },
      {
        text: "Its head was small for its body, with a brain about the size of a plum.",
        level: 1,
        citationIds: ["nhm-stegosaurus"],
      },
      {
        text: "The front of the lower jaw had no teeth.",
        level: 1,
        citationIds: ["maidment-2015"],
      },
    ],
    integument: [
      {
        text: "Blood-vessel traces on the plates and spikes probably supplied a keratin covering, like the horny sheath of a horn.",
        level: 3,
        citationIds: ["main-2005"],
      },
      {
        text: "A horny beak has been suggested for the toothless front of the jaws.",
        level: 3,
        citationIds: ["reichel-2010"],
      },
      {
        text: "No fossil evidence of its colour is known. Any colour scheme is an interpretation.",
        level: 4,
        citationIds: [],
      },
    ],
    behaviour: [
      {
        text: "It probably defended itself from predators such as _Allosaurus_ and _Ceratosaurus_ with its spiked tail.",
        level: 3,
        citationIds: ["nhm-stegosaurus"],
      },
    ],
    habitat: [
      {
        text: "The Morrison Formation records rivers, floodplains and lakes, at a time when the climate was much warmer than today.",
        level: 2,
        citationIds: ["maidment-muxworthy-2019"],
      },
      {
        text: "Its fossils come from the same rock formation as _Allosaurus_.",
        level: 1,
        citationIds: ["pbdb-stegosaurus", "pbdb-allosaurus"],
      },
    ],
    discovery: [
      {
        text: "Othniel Charles Marsh named _Stegosaurus_, “roof lizard”, in 1877, and the species _S. stenops_ in 1887.",
        level: 1,
        citationIds: ["nhm-stegosaurus", "iczn-2013"],
      },
      {
        text: "“Sophie” was excavated at the Red Canyon Ranch quarry near Shell, Wyoming, and went on display at the Natural History Museum, London, in December 2014.",
        level: 1,
        citationIds: ["maidment-2015", "nhm-stegosaurus"],
      },
    ],
    hotspotNotes: [],
    citations: [
      {
        id: "nhm-stegosaurus",
        type: "web",
        authors: ["Natural History Museum, London"],
        title: "Stegosaurus — Dino Directory",
        venue: "Natural History Museum, London",
        url: "https://www.nhm.ac.uk/discover/dino-directory/stegosaurus.html",
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
        id: "pbdb-allosaurus",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Allosaurus fragilis: fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Allosaurus%20fragilis&show=strat,loc",
        accessed,
      },
      {
        id: "iczn-2013",
        type: "article",
        authors: ["International Commission on Zoological Nomenclature"],
        year: 2013,
        title:
          "Opinion 2320 (Case 3536). Stegosaurus Marsh, 1877 (Dinosauria, Ornithischia): type species replaced with Stegosaurus stenops Marsh, 1887",
        venue: "The Bulletin of Zoological Nomenclature",
        volume: "70",
        pages: "129–130",
        doi: "10.21805/bzn.v70i2.a4",
        url: "https://doi.org/10.21805/bzn.v70i2.a4",
        accessed,
      },
      {
        id: "farlow-1976",
        type: "article",
        authors: ["Farlow, J. O.", "Thompson, C. V.", "Rosner, D. E."],
        year: 1976,
        title: "Plates of the dinosaur Stegosaurus: forced convection heat loss fins?",
        venue: "Science",
        volume: "192",
        pages: "1123–1125",
        doi: "10.1126/science.192.4244.1123",
        url: "https://doi.org/10.1126/science.192.4244.1123",
        accessed,
      },
      {
        id: "main-2005",
        type: "article",
        authors: ["Main, R. P.", "de Ricqlès, A.", "Horner, J. R.", "Padian, K."],
        year: 2005,
        title:
          "The evolution and function of thyreophoran dinosaur scutes: implications for plate function in stegosaurs",
        venue: "Paleobiology",
        volume: "31",
        pages: "291–314",
        doi: "10.1666/0094-8373(2005)031[0291:TEAFOT]2.0.CO;2",
        url: "https://doi.org/10.1666/0094-8373(2005)031[0291:TEAFOT]2.0.CO;2",
        accessed,
      },
      {
        id: "reichel-2010",
        type: "article",
        authors: ["Reichel, M."],
        year: 2010,
        title:
          "A model for the bite mechanics in the herbivorous dinosaur Stegosaurus (Ornithischia, Stegosauridae)",
        venue: "Swiss Journal of Geosciences",
        volume: "103",
        pages: "235–240",
        doi: "10.1007/s00015-010-0025-1",
        url: "https://doi.org/10.1007/s00015-010-0025-1",
        accessed,
      },
      {
        id: "hayashi-2011",
        type: "article",
        authors: ["Hayashi, S.", "Carpenter, K.", "Watabe, M.", "McWhinney, L. A."],
        year: 2011,
        title: "Ontogenetic histology of Stegosaurus plates and spikes",
        venue: "Palaeontology",
        volume: "55",
        pages: "145–161",
        doi: "10.1111/j.1475-4983.2011.01122.x",
        url: "https://doi.org/10.1111/j.1475-4983.2011.01122.x",
        accessed,
      },
      {
        id: "maidment-2015",
        type: "article",
        authors: ["Maidment, S. C. R.", "Brassey, C.", "Barrett, P. M."],
        year: 2015,
        title:
          "The postcranial skeleton of an exceptionally complete individual of the plated dinosaur Stegosaurus stenops (Dinosauria: Thyreophora) from the Upper Jurassic Morrison Formation of Wyoming, U.S.A.",
        venue: "PLoS ONE",
        volume: "10",
        pages: "e0138352",
        doi: "10.1371/journal.pone.0138352",
        url: "https://doi.org/10.1371/journal.pone.0138352",
        accessed,
      },
      {
        id: "brassey-2015",
        type: "article",
        authors: ["Brassey, C. A.", "Maidment, S. C. R.", "Barrett, P. M."],
        year: 2015,
        title:
          "Body mass estimates of an exceptionally complete Stegosaurus (Ornithischia: Thyreophora): comparing volumetric and linear bivariate mass estimation methods",
        venue: "Biology Letters",
        volume: "11",
        pages: "20140984",
        doi: "10.1098/rsbl.2014.0984",
        url: "https://doi.org/10.1098/rsbl.2014.0984",
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
  review: { status: "reviewed", reviewedOn: "2026-10-16" },
};
