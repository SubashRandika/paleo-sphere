import type { SpeciesPresentation } from "@/domain/species/schema";
import { EvidenceBadge } from "@/ui/EvidenceBadge";
import { RichText } from "@/ui/RichText";
import { CitationRefs } from "./CitationRefs";
import type { CitationIndex } from "./format";

const LICENSE_LABELS: Record<SpeciesPresentation["attribution"]["license"], string> = {
  "CC0-1.0": "CC0 1.0 (public domain)",
  "CC-BY-4.0": "CC BY 4.0",
  "CC-BY-NC-4.0": "CC BY-NC 4.0",
};

type Props = Pick<SpeciesPresentation, "attribution" | "appearanceNotes"> & {
  /** Source numbers for the notes; omitted while a record has no content yet. */
  index?: CitationIndex;
};

/** Credits the 3D model (required by its license) and says what in it is evidence vs. interpretation. */
export function ModelAttribution({ attribution: a, appearanceNotes, index }: Props) {
  return (
    <section aria-labelledby="about-model" className="space-y-4">
      <h2 id="about-model" className="label">
        About this model
      </h2>

      <ul className="space-y-3">
        {appearanceNotes.map((note) => (
          <li key={note.text} className="space-y-1">
            <EvidenceBadge level={note.level} />
            <p className="text-sm text-ink">
              <RichText text={note.text} />
              {index && <CitationRefs ids={note.citationIds} index={index} />}
            </p>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted">
        Based on{" "}
        <a
          href={a.sourceUrl}
          className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
        >
          “{a.title}”
        </a>{" "}
        by{" "}
        <a
          href={a.creatorUrl}
          className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
        >
          {a.creator}
        </a>
        , licensed under{" "}
        <a
          href={a.licenseUrl}
          rel="license"
          className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
        >
          {LICENSE_LABELS[a.license]}
        </a>
        .{a.modifications.length > 0 && ` Changes: ${a.modifications.join("; ")}.`}
      </p>
    </section>
  );
}
