/**
 * Network check that every citation in the species content is real and recorded correctly.
 * Run with `npm run content:verify` (needs internet; not part of `npm test`).
 *
 * - DOI citations are looked up in Crossref; title, year, first author, author count,
 *   volume and first page must match what the content file says.
 * - Other URLs must resolve. Sites that block scripted requests (HTTP 401/403/429) are
 *   reported as unverified rather than failed — check those by hand.
 *
 * This proves a source exists and is cited correctly. It cannot prove the source supports
 * the claim; that is the manual review recorded in docs/research/<slug>.md.
 */
import { describe, expect, it } from "vitest";
import { getAllSpecies } from "@/domain/species/repository";
import type { Citation } from "@/domain/species/schema";

const HEADERS = { "User-Agent": "paleo-sphere-content-verify/1.0 (https://github.com/; citation checker)" };

type CrossrefWork = {
  title?: string[];
  author?: { family?: string; name?: string }[];
  issued?: { "date-parts"?: number[][] };
  volume?: string;
  page?: string;
  "article-number"?: string;
};

const citations = new Map<string, { citation: Citation; species: string }>();
for (const s of getAllSpecies()) {
  for (const c of s.content?.citations ?? []) {
    const key = c.doi ?? c.url;
    if (!citations.has(key)) citations.set(key, { citation: c, species: s.slug });
  }
}

/** Lowercase words without markup, accents or punctuation. */
function words(text: string): string[] {
  return text
    .replace(/<[^>]+>/g, " ")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function similarity(a: string, b: string): number {
  const x = new Set(words(a));
  const y = new Set(words(b));
  const shared = [...x].filter((w) => y.has(w)).length;
  return shared / Math.max(x.size, y.size);
}

const firstPage = (pages: string | undefined) => pages?.split(/[–\-]/)[0]?.trim();

/** Crossref rate-limits bursts (429) and occasionally times out (5xx); retry those with backoff. */
async function crossref(doi: string, attempt = 0): Promise<CrossrefWork> {
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: HEADERS });
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    return crossref(doi, attempt + 1);
  }
  if (!res.ok) throw new Error(`Crossref ${res.status} for ${doi}`);
  return ((await res.json()) as { message: CrossrefWork }).message;
}

describe.concurrent("citations", () => {
  for (const { citation: c, species } of citations.values()) {
    if (c.doi) {
      it(`${species} · ${c.id} · DOI ${c.doi}`, { timeout: 30_000 }, async () => {
        const work = await crossref(c.doi!);

        const title = work.title?.[0] ?? "";
        expect(similarity(c.title, title), `title differs from Crossref: "${title}"`).toBeGreaterThanOrEqual(
          0.8,
        );

        const year = work.issued?.["date-parts"]?.[0]?.[0];
        expect(c.year, "year").toBe(year);

        // Crossref lists no authors for institutional works (e.g. ICZN Opinions).
        const authors = work.author ?? [];
        if (authors.length > 0) {
          const firstAuthor = (authors[0]?.family ?? authors[0]?.name ?? "").toLowerCase();
          const ourFirst = (c.authors[0]?.split(",")[0] ?? "").toLowerCase();
          expect(words(ourFirst), "first author").toEqual(words(firstAuthor));
          expect(c.authors.length, "author count").toBe(authors.length);
        }

        // Crossref may prefix a series ("s3-14"); our volume number must appear in theirs.
        if (c.volume && work.volume) expect(words(work.volume), "volume").toContain(words(c.volume)[0]);
        const theirPage = firstPage(work.page) ?? work["article-number"];
        if (c.pages && theirPage) expect(firstPage(c.pages), "first page").toBe(theirPage);
      });
    } else {
      it(`${species} · ${c.id} · ${c.url}`, { timeout: 30_000 }, async ({ skip }) => {
        const res = await fetch(c.url, {
          headers: { ...HEADERS, Accept: "text/html,application/json" },
          redirect: "follow",
        });
        if ([401, 403, 429].includes(res.status)) {
          skip(`HTTP ${res.status}: site blocks scripted requests — verify by hand`);
        }
        expect(res.status, `HTTP status for ${c.url}`).toBeLessThan(400);
      });
    }
  }
});
