import type { SpeciesInput } from "@/domain/species/schema";

/**
 * Research notes: docs/research/triceratops-horridus.md.
 * No 3D model has been prepared yet (Phase 6), so this record has content only.
 */
const accessed = "2026-10-16";

export const triceratopsHorridus: SpeciesInput = {
  id: "triceratops-horridus",
  slug: "triceratops-horridus",
  scientificName: "Triceratops horridus",
  authority: "(Marsh, 1889)",
  commonNames: ["Triceratops"],
  synonyms: ["Ceratops horridus Marsh, 1889"],
  content: {
    taxonomy: ["Dinosauria", "Ornithischia", "Ceratopsidae", "Chasmosaurinae"],
    period: "Cretaceous",
    age: {
      maxMa: 68,
      minMa: 66,
      stage: "Maastrichtian",
      citationIds: ["nhm-triceratops", "pbdb-triceratops-occurrences"],
    },
    localities: [
      {
        formation: "Hell Creek Formation",
        region: "Montana, North Dakota and South Dakota",
        country: "USA",
        citationIds: ["pbdb-triceratops-occurrences"],
      },
      {
        formation: "Lance Formation",
        region: "Wyoming and South Dakota",
        country: "USA",
        citationIds: ["pbdb-triceratops-occurrences"],
      },
      {
        formation: "Scollard Formation",
        region: "Alberta",
        country: "Canada",
        citationIds: ["pbdb-triceratops-occurrences"],
      },
    ],
    measurements: {
      length: {
        estimates: [
          {
            min: 9,
            max: 9,
            unit: "m",
            method: "Stated body length in a study of its teeth",
            citationId: "erickson-2015",
          },
          { min: 9, max: 9, unit: "m", method: "Museum summary", citationId: "nhm-triceratops" },
        ],
      },
      mass: {
        estimates: [
          {
            min: 10,
            max: 10,
            unit: "t",
            method: "Museum summary; method not stated",
            citationId: "nhm-triceratops",
          },
        ],
      },
    },
    diet: "herbivore",
    dietEvidence: {
      text: "A sharp beak snipped vegetation, and rows of cheek teeth formed shearing surfaces for slicing tough, bulky plants.",
      level: 2,
      citationIds: ["nhm-triceratops", "erickson-2015"],
    },
    summary:
      "_Triceratops_, the “three-horned face”, was a large plant-eater that lived alongside _Tyrannosaurus_ at the very end of the Cretaceous. Its huge horned and frilled skull is one of the most striking of any land animal.",
    facts: [
      {
        title: "First mistaken for a bison",
        text: "Othniel Charles Marsh's first find, in 1887, was a pair of horn cores. He thought they came from a giant bison and named them _Bison alticornis_.",
        level: 1,
        citationIds: ["nhm-triceratops", "pbdb-triceratops-names"],
      },
      {
        title: "Self-sharpening teeth",
        text: "Its teeth were built from several tissues that wore together during chewing, shaping them into low-friction slicing blades — a dental complexity rivalling that of mammals.",
        level: 2,
        citationIds: ["erickson-2015"],
      },
      {
        title: "Battle scars on the frill",
        text: "Healed injuries are more common on the frill of _Triceratops_ than in a related horned dinosaur, consistent with _Triceratops_ locking horns with each other while the frill protected the neck.",
        level: 2,
        citationIds: ["farke-2009"],
      },
      {
        title: "It survived a _T. rex_ bite",
        text: "One _Triceratops_ horn was bitten off by a tyrannosaur and then healed — at least some survived these attacks.",
        level: 1,
        citationIds: ["nhm-triceratops"],
      },
    ],
    known: [
      {
        text: "Two species are recognised, _Triceratops horridus_ and _Triceratops prorsus_, found at different levels of the rock sequence.",
        level: 2,
        citationIds: ["nhm-triceratops", "scannella-2014"],
      },
      {
        text: "The bony horn cores were covered in keratin in life, so the horns were longer and sharper than the fossils suggest.",
        level: 2,
        citationIds: ["nhm-triceratops"],
      },
    ],
    uncertain: [
      {
        text: "Is _Torosaurus_ simply a fully grown _Triceratops_? A 2010 study of more than 50 specimens argued yes; a 2012 study of growth stages concluded _Torosaurus_ is a separate animal.",
        level: 3,
        citationIds: ["scannella-horner-2010", "longrich-field-2012"],
      },
      {
        text: "_Triceratops horridus_ may have gradually evolved into _Triceratops prorsus_ over time, rather than the two living side by side.",
        level: 3,
        citationIds: ["scannella-2014"],
      },
      {
        text: "The frill may have protected the neck, attracted mates or helped individuals recognise their own species — possibly several of these.",
        level: 3,
        citationIds: ["nhm-triceratops"],
      },
      {
        text: "Its remains are usually found one at a time, which may mean it spent much of its life alone, unlike many other horned dinosaurs.",
        level: 3,
        citationIds: ["nhm-triceratops"],
      },
    ],
    anatomy: [
      {
        text: "Two large horns above the eyes and a smaller horn on the nose.",
        level: 1,
        citationIds: ["farke-2009"],
      },
      {
        text: "The frill could reach nearly a metre across, making the skull one of the largest of any land animal.",
        level: 1,
        citationIds: ["nhm-triceratops"],
      },
    ],
    integument: [
      {
        text: "Skin impressions show large, pebble-like scales.",
        level: 1,
        citationIds: ["nhm-triceratops"],
      },
      {
        text: "No fossil evidence of its colour is known. Any colour scheme is an interpretation.",
        level: 4,
        citationIds: [],
      },
    ],
    behaviour: [
      {
        text: "It probably fed mostly on low-growing plants, but could raise its head to reach slightly higher vegetation.",
        level: 3,
        citationIds: ["nhm-triceratops"],
      },
      {
        text: "It may have used its horns to fend off _Tyrannosaurus_.",
        level: 3,
        citationIds: ["nhm-triceratops"],
      },
    ],
    habitat: [
      {
        text: "Its fossils come from the same rock formations as _Tyrannosaurus_: the Hell Creek, Lance and Scollard formations.",
        level: 1,
        citationIds: ["pbdb-triceratops-occurrences", "pbdb-tyrannosaurus"],
      },
      {
        text: "Its specialised chewing teeth helped make it a dominant plant-eater of its time.",
        level: 2,
        citationIds: ["erickson-2015"],
      },
    ],
    discovery: [
      {
        text: "Marsh named the species _Ceratops horridus_ in 1889 and placed it in the new genus _Triceratops_ the same year.",
        level: 1,
        citationIds: ["pbdb-triceratops-names", "marsh-1889"],
      },
      {
        text: "Skulls of many shapes led early researchers to name many species. The variety probably reflects differences between individuals.",
        level: 2,
        citationIds: ["nhm-triceratops"],
      },
      {
        text: "A ten-year field study of the Hell Creek Formation in Montana collected more than 50 _Triceratops_ specimens, including over 30 skulls.",
        level: 1,
        citationIds: ["scannella-horner-2010"],
      },
    ],
    hotspotNotes: [],
    citations: [
      {
        id: "nhm-triceratops",
        type: "web",
        authors: ["Natural History Museum, London"],
        title: "Triceratops — Dino Directory",
        venue: "Natural History Museum, London",
        url: "https://www.nhm.ac.uk/discover/dino-directory/triceratops.html",
        accessed,
      },
      {
        id: "pbdb-triceratops-occurrences",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Triceratops Marsh 1889: fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Triceratops&show=strat,loc",
        accessed,
      },
      {
        id: "pbdb-triceratops-names",
        type: "database",
        authors: ["Paleobiology Database"],
        title:
          "Triceratops horridus, Ceratops horridus and Bison alticornis: taxon records and naming references",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/taxa/list.json?name=Triceratops%20horridus,Ceratops%20horridus,Bison%20alticornis&show=attr,ref",
        accessed,
      },
      {
        id: "pbdb-tyrannosaurus",
        type: "database",
        authors: ["Paleobiology Database"],
        title: "Tyrannosaurus rex Osborn 1905: taxon record and fossil occurrences",
        venue: "Paleobiology Database",
        url: "https://paleobiodb.org/data1.2/occs/list.json?base_name=Tyrannosaurus%20rex&show=strat,loc",
        accessed,
      },
      {
        id: "marsh-1889",
        type: "article",
        authors: ["Marsh, O. C."],
        year: 1889,
        title: "Notice of gigantic horned Dinosauria from the Cretaceous",
        venue: "American Journal of Science",
        volume: "38",
        pages: "173–175",
        doi: "10.2475/ajs.s3-38.224.173",
        url: "https://doi.org/10.2475/ajs.s3-38.224.173",
        accessed,
      },
      {
        id: "farke-2009",
        type: "article",
        authors: ["Farke, A. A.", "Wolff, E. D. S.", "Tanke, D. H."],
        year: 2009,
        title: "Evidence of combat in Triceratops",
        venue: "PLoS ONE",
        volume: "4",
        pages: "e4252",
        doi: "10.1371/journal.pone.0004252",
        url: "https://doi.org/10.1371/journal.pone.0004252",
        accessed,
      },
      {
        id: "scannella-horner-2010",
        type: "article",
        authors: ["Scannella, J. B.", "Horner, J. R."],
        year: 2010,
        title:
          "Torosaurus Marsh, 1891, is Triceratops Marsh, 1889 (Ceratopsidae: Chasmosaurinae): synonymy through ontogeny",
        venue: "Journal of Vertebrate Paleontology",
        volume: "30",
        pages: "1157–1168",
        doi: "10.1080/02724634.2010.483632",
        url: "https://doi.org/10.1080/02724634.2010.483632",
        accessed,
      },
      {
        id: "longrich-field-2012",
        type: "article",
        authors: ["Longrich, N. R.", "Field, D. J."],
        year: 2012,
        title:
          "Torosaurus is not Triceratops: ontogeny in chasmosaurine ceratopsids as a case study in dinosaur taxonomy",
        venue: "PLoS ONE",
        volume: "7",
        pages: "e32623",
        doi: "10.1371/journal.pone.0032623",
        url: "https://doi.org/10.1371/journal.pone.0032623",
        accessed,
      },
      {
        id: "scannella-2014",
        type: "article",
        authors: ["Scannella, J. B.", "Fowler, D. W.", "Goodwin, M. B.", "Horner, J. R."],
        year: 2014,
        title: "Evolutionary trends in Triceratops from the Hell Creek Formation, Montana",
        venue: "Proceedings of the National Academy of Sciences",
        volume: "111",
        pages: "10245–10250",
        doi: "10.1073/pnas.1313334111",
        url: "https://doi.org/10.1073/pnas.1313334111",
        accessed,
      },
      {
        id: "erickson-2015",
        type: "article",
        authors: [
          "Erickson, G. M.",
          "Sidebottom, M. A.",
          "Kay, D. I.",
          "Turner, K. T.",
          "Ip, N.",
          "Norell, M. A.",
          "Sawyer, W. G.",
          "Krick, B. A.",
        ],
        year: 2015,
        title: "Wear biomechanics in the slicing dentition of the giant horned dinosaur Triceratops",
        venue: "Science Advances",
        volume: "1",
        pages: "e1500055",
        doi: "10.1126/sciadv.1500055",
        url: "https://doi.org/10.1126/sciadv.1500055",
        accessed,
      },
    ],
  },
  review: { status: "reviewed", reviewedOn: "2026-10-16" },
};
