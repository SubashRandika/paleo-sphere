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

type Props = Pick<SpeciesPresentation, "attribution" | "appearanceNotes" | "fossil"> & {
  /** Source numbers for the notes; omitted while a record has no content yet. */
  index?: CitationIndex;
};

type Claim = SpeciesPresentation["appearanceNotes"][number];

/**
 * Credits the 3D model (required by its license) and says what in it is evidence vs. interpretation.
 * When the species has a fossil scan, says what that specimen is and credits it too.
 */
export function ModelAttribution({ attribution, appearanceNotes, fossil, index }: Props) {
  return (
    <section aria-labelledby="about-model" className="space-y-4">
      <h2 id="about-model" className="label">
        About this model
      </h2>

      <ul className="space-y-3">
        {appearanceNotes.map((note) => (
          <Note key={note.text} note={note} index={index} />
        ))}
      </ul>

      <Credit attribution={attribution} />

      {fossil && (
        <div className="space-y-3 border-t border-rule pt-4">
          <h3 className="label">Fossil comparison</h3>
          <ul>
            <Note note={fossil.note} index={index} />
          </ul>
          <Credit attribution={fossil.attribution} />
        </div>
      )}
    </section>
  );
}

function Note({ note, index }: { note: Claim; index: CitationIndex | undefined }) {
  return (
    <li className="space-y-1">
      <EvidenceBadge level={note.level} />
      <p className="text-sm text-ink">
        <RichText text={note.text} />
        {index && <CitationRefs ids={note.citationIds} index={index} />}
      </p>
    </li>
  );
}

function Credit({ attribution: a }: { attribution: SpeciesPresentation["attribution"] }) {
  return (
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
  );
}
