import { z } from "zod";

/**
 * Species content model.
 *
 * One record = scientific `content` (never read by the viewer)
 *            + rendering `presentation` (becomes ViewerConfig)
 *            + editorial `review` state.
 *
 * Records are TypeScript files validated at build time; an invalid record fails the build.
 * See docs/architecture.md §6 and docs/science-requirements.md.
 */

// ── Shared primitives ────────────────────────────────────────────────────────

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case ids");

/** 1 direct fossil evidence · 2 strong inference · 3 plausible reconstruction · 4 artistic interpretation */
export const evidenceLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

/** Content prose. One piece of markup is allowed: `_Name_` for italic scientific names. */
const richText = z
  .string()
  .min(1)
  .refine((t) => (t.match(/_/g) ?? []).length % 2 === 0, "Unmatched _ in italic markup");

export const claimSchema = z.strictObject({
  text: richText,
  level: evidenceLevelSchema,
  citationIds: z.array(id),
});

/** An interesting fact: a claim with a short headline for its card. */
export const factSchema = claimSchema.extend({ title: richText });

/**
 * Source tiers (docs/science-requirements.md §2): `article`/`book` are tier 1,
 * `web` is a museum page (tier 2), `database` is the Paleobiology Database (tier 3).
 */
export const citationTypeSchema = z.enum(["article", "book", "web", "database"]);

export const citationSchema = z
  .strictObject({
    id,
    type: citationTypeSchema,
    /** Family name first ("Bell, P. R."), or the institution for unsigned museum pages. */
    authors: z.array(z.string().min(1)).min(1),
    /** Omitted only for undated web pages. */
    year: z.number().int().min(1800).optional(),
    title: z.string().min(1),
    venue: z.string().min(1),
    volume: z.string().optional(),
    pages: z.string().optional(),
    doi: z
      .string()
      .regex(/^10\.\d{4,9}\/\S+$/, "Store the bare DOI, e.g. 10.1098/rsbl.2017.0092")
      .optional(),
    url: z.url(),
    accessed: z.iso.date(),
  })
  .refine((c) => c.type === "web" || c.type === "database" || c.year !== undefined, {
    message: "Articles and books need a publication year",
    path: ["year"],
  });

const vec3 = z.tuple([z.number(), z.number(), z.number()]);

/** Public URL of a delivered asset, e.g. /models/t-rex/t-rex-high.glb */
const assetPath = z.string().regex(/^\/[\w\-./]+$/, "Asset paths are absolute public paths");

// ── Scientific content ───────────────────────────────────────────────────────

const estimateSchema = z
  .strictObject({
    min: z.number().positive(),
    max: z.number().positive(),
    unit: z.enum(["m", "kg", "t"]),
    /** How the estimate was made, in plain words: "Volumetric model of one skeleton". */
    method: z.string().min(1),
    /** Set when the estimate describes one individual rather than the species. */
    specimen: z.string().min(1).optional(),
    citationId: id,
  })
  .refine((e) => e.min <= e.max, { message: "min must be ≤ max", path: ["max"] });

const measurementSchema = z.strictObject({ estimates: z.array(estimateSchema).min(1) });

export const contentSchema = z.strictObject({
  /** Clade path from broad to narrow, e.g. ["Dinosauria", "Theropoda", "Tyrannosauridae"] */
  taxonomy: z.array(z.string().min(1)).min(1),
  /** Plain-language group for the species browser filter, e.g. "Theropod". Shared spelling across records. */
  group: z.string().min(1),
  period: z.enum(["Triassic", "Jurassic", "Cretaceous"]),
  age: z
    .strictObject({
      /** Older bound in millions of years ago (larger number). */
      maxMa: z.number().positive(),
      /** Younger bound in millions of years ago. */
      minMa: z.number().positive(),
      stage: z.string().min(1),
      citationIds: z.array(id).min(1),
    })
    .refine((a) => a.maxMa >= a.minMa, {
      message: "maxMa is the older bound and must be ≥ minMa",
      path: ["maxMa"],
    }),
  localities: z
    .array(
      z.strictObject({
        formation: z.string().min(1),
        region: z.string().min(1),
        country: z.string().min(1),
        citationIds: z.array(id).min(1),
      }),
    )
    .min(1),
  measurements: z.strictObject({
    length: measurementSchema.optional(),
    hipHeight: measurementSchema.optional(),
    mass: measurementSchema.optional(),
  }),
  diet: z.enum(["carnivore", "herbivore", "omnivore"]),
  dietEvidence: claimSchema,
  summary: richText,
  facts: z.array(factSchema).min(3).max(5),
  known: z.array(claimSchema).min(1),
  uncertain: z.array(claimSchema).min(1),
  /** Distinctive skeletal features and adaptations. */
  anatomy: z.array(claimSchema).min(1),
  /** Skin, scales, feathers, armour and colour evidence — for the animal, not the 3D model. */
  integument: z.array(claimSchema).min(1),
  /** Locomotion, feeding, social behaviour, growth. Hypotheses are labelled by level. */
  behaviour: z.array(claimSchema).min(1),
  /** Environment and ecological role. */
  habitat: z.array(claimSchema).min(1),
  discovery: z.array(claimSchema).min(1),
  hotspotNotes: z.array(z.strictObject({ hotspotId: id, title: z.string().min(1), body: claimSchema })),
  citations: z.array(citationSchema).min(1),
});

// ── Presentation (rendering configuration) ───────────────────────────────────

export const presentationModeSchema = z.enum(["studio", "habitat", "anatomy", "fossil"]);

const cameraViewSchema = z.strictObject({ position: vec3, target: vec3 });

const attributionSchema = z.strictObject({
  creator: z.string().min(1),
  creatorUrl: z.url(),
  title: z.string().min(1),
  sourceUrl: z.url(),
  license: z.enum(["CC0-1.0", "CC-BY-4.0", "CC-BY-NC-4.0"]),
  licenseUrl: z.url(),
  /** What we changed, e.g. "Converted spec-gloss to metal-rough". Required by CC BY. */
  modifications: z.array(z.string().min(1)),
});

export const presentationSchema = z.strictObject({
  model: z.strictObject({
    high: assetPath,
    mobile: assetPath,
    poster: assetPath,
  }),
  attribution: attributionSchema,
  /** Which visual features match evidence and which are interpretation. */
  appearanceNotes: z.array(claimSchema).min(1),
  camera: z.strictObject({
    default: cameraViewSchema,
    presets: z.array(cameraViewSchema.extend({ id, label: z.string().min(1) })),
    limits: z
      .strictObject({
        minDistance: z.number().positive(),
        maxDistance: z.number().positive(),
        /** Radians from straight up; keeps the camera above the ground. */
        maxPolarAngle: z.number().positive().max(Math.PI),
      })
      .refine((l) => l.minDistance < l.maxDistance, {
        message: "minDistance must be < maxDistance",
        path: ["maxDistance"],
      }),
  }),
  modes: z.array(presentationModeSchema).min(1),
  /**
   * Anatomy-mode markers. `position` is a point on the model surface (find one with
   * scripts/blender/surface_points.py); `view` frames it when selected. The explanation lives
   * in content.hotspotNotes, so the viewer never receives scientific prose.
   */
  hotspots: z.array(
    z.strictObject({ id, label: z.string().min(1).max(32), position: vec3, view: cameraViewSchema }),
  ),
  /**
   * A looping clip stored in the model file (e.g. an idle). Offered with a play button, never
   * autoplayed. The motion is artistic interpretation; say so in appearanceNotes.
   */
  animation: z
    .strictObject({
      /** Animation name inside the GLB. */
      clip: z.string().min(1),
    })
    .optional(),
  habitatId: id.optional(),
  /**
   * A scan of a real specimen for fossil comparison mode, swapped in place of the reconstruction.
   * Never an illustrative skeleton presented as a specimen (CLAUDE.md §7D).
   */
  fossil: z
    .strictObject({
      model: z.strictObject({ high: assetPath, mobile: assetPath }),
      /** Shown on the stage while the scan is displayed, e.g. "Mounted skeleton (cast)". */
      label: z.string().min(1).max(48),
      /** True when the scan is of a cast, not original bone — must be shown to visitors. */
      isCast: z.boolean(),
      camera: z.strictObject({ default: cameraViewSchema }),
      /** What the specimen is and where it is, with its source; shown with the model notes. */
      note: claimSchema,
      attribution: attributionSchema,
    })
    .optional(),
  a11y: z.strictObject({ modelDescription: z.string().min(1) }),
});

// ── Species record ───────────────────────────────────────────────────────────

export const reviewStatusSchema = z.enum(["draft", "reviewed", "published"]);

export const speciesSchema = z
  .strictObject({
    id,
    slug: id,
    scientificName: z.string().min(1),
    authority: z.string().min(1),
    commonNames: z.array(z.string().min(1)),
    synonyms: z.array(z.string().min(1)),
    /** Optional while drafting; required once reviewed. */
    content: contentSchema.optional(),
    /** Absent until a suitable 3D model has been prepared; the page then shows text only. */
    presentation: presentationSchema.optional(),
    review: z.strictObject({
      status: reviewStatusSchema,
      reviewedOn: z.iso.date().optional(),
    }),
  })
  .superRefine((s, ctx) => {
    const issue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message, path });

    const { presentation: p, content: c, review } = s;

    if (p) {
      // Modes must have what they need to render.
      if (!p.modes.includes("studio")) issue("Every species supports studio mode", ["presentation", "modes"]);
      if (p.modes.includes("fossil") && !p.fossil)
        issue("fossil mode requires presentation.fossil", ["presentation", "fossil"]);
      if (p.modes.includes("habitat") && !p.habitatId)
        issue("habitat mode requires presentation.habitatId", ["presentation", "habitatId"]);
      if (p.modes.includes("anatomy") && p.hotspots.length === 0)
        issue("anatomy mode requires hotspots", ["presentation", "hotspots"]);

      findDuplicates(p.hotspots.map((h) => h.id)).forEach((d) =>
        issue(`Duplicate hotspot id "${d}"`, ["presentation", "hotspots"]),
      );
      findDuplicates(p.camera.presets.map((v) => v.id)).forEach((d) =>
        issue(`Duplicate camera preset id "${d}"`, ["presentation", "camera", "presets"]),
      );
    }

    if (!p && !c) issue("A record needs content, a 3D model, or both", ["content"]);

    // Review gates.
    if (review.status !== "draft") {
      if (!c) issue(`A ${review.status} record needs content`, ["content"]);
      if (!review.reviewedOn) issue(`A ${review.status} record needs reviewedOn`, ["review", "reviewedOn"]);
    }

    if (!c) return;

    // Citation integrity: every referenced id must exist.
    findDuplicates(c.citations.map((x) => x.id)).forEach((d) =>
      issue(`Duplicate citation id "${d}"`, ["content", "citations"]),
    );
    const known = new Set(c.citations.map((x) => x.id));
    for (const [path, ref] of collectCitationRefs(s)) {
      if (!known.has(ref)) issue(`Unknown citation id "${ref}"`, path);
    }

    // Hotspot notes must point at real hotspots.
    const hotspotIds = new Set(p?.hotspots.map((h) => h.id));
    c.hotspotNotes.forEach((n, i) => {
      if (!hotspotIds.has(n.hotspotId))
        issue(`Unknown hotspot id "${n.hotspotId}"`, ["content", "hotspotNotes", i, "hotspotId"]);
    });
    // …and every marker a visitor can select needs an explanation.
    const noted = new Set(c.hotspotNotes.map((n) => n.hotspotId));
    p?.hotspots.forEach((h, i) => {
      if (!noted.has(h.id)) issue(`Hotspot "${h.id}" has no note`, ["presentation", "hotspots", i]);
    });

    // Display gate: reviewed and published records are shown to visitors, so every
    // evidence-backed claim (levels 1–3) needs at least one source.
    // `published` differs from `reviewed` only in being indexed by search engines.
    if (review.status !== "draft") {
      for (const [path, claim] of collectClaims(s)) {
        if (claim.level < 4 && claim.citationIds.length === 0) {
          issue("Claims at evidence levels 1–3 need a citation before they are shown", [
            ...path,
            "citationIds",
          ]);
        }
      }
    }
  });

/** Content sections that are plain lists of claims, in reading order. */
export const CLAIM_SECTIONS = [
  "facts",
  "known",
  "uncertain",
  "anatomy",
  "integument",
  "behaviour",
  "habitat",
  "discovery",
] as const;

export type EvidenceLevel = z.infer<typeof evidenceLevelSchema>;
export type Claim = z.infer<typeof claimSchema>;
export type Fact = z.infer<typeof factSchema>;
export type Citation = z.infer<typeof citationSchema>;
export type CitationType = z.infer<typeof citationTypeSchema>;
export type PresentationMode = z.infer<typeof presentationModeSchema>;
export type SpeciesContent = z.infer<typeof contentSchema>;
export type SpeciesPresentation = z.infer<typeof presentationSchema>;
/** Shape authors write in content files (before defaults/transforms). */
export type SpeciesInput = z.input<typeof speciesSchema>;
export type Species = z.output<typeof speciesSchema>;

// ── Helpers ──────────────────────────────────────────────────────────────────

type Path = (string | number)[];

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  return [...new Set(values.filter((v) => (seen.has(v) ? true : (seen.add(v), false))))];
}

function collectClaims(s: Pick<Species, "content" | "presentation">): [Path, Claim][] {
  const out: [Path, Claim][] = [];
  s.presentation?.appearanceNotes.forEach((c, i) => out.push([["presentation", "appearanceNotes", i], c]));
  if (s.presentation?.fossil) out.push([["presentation", "fossil", "note"], s.presentation.fossil.note]);
  const c = s.content;
  if (!c) return out;
  out.push([["content", "dietEvidence"], c.dietEvidence]);
  CLAIM_SECTIONS.forEach((key) => c[key].forEach((claim, i) => out.push([["content", key, i], claim])));
  c.hotspotNotes.forEach((n, i) => out.push([["content", "hotspotNotes", i, "body"], n.body]));
  return out;
}

function collectCitationRefs(s: Pick<Species, "content" | "presentation">): [Path, string][] {
  const out: [Path, string][] = [];
  for (const [path, claim] of collectClaims(s)) {
    claim.citationIds.forEach((ref, i) => out.push([[...path, "citationIds", i], ref]));
  }
  const c = s.content;
  if (!c) return out;
  c.age.citationIds.forEach((ref, i) => out.push([["content", "age", "citationIds", i], ref]));
  c.localities.forEach((l, li) =>
    l.citationIds.forEach((ref, i) => out.push([["content", "localities", li, "citationIds", i], ref])),
  );
  (["length", "hipHeight", "mass"] as const).forEach((key) =>
    c.measurements[key]?.estimates.forEach((e, i) =>
      out.push([["content", "measurements", key, "estimates", i, "citationId"], e.citationId]),
    ),
  );
  return out;
}
