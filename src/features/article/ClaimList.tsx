import type { Claim } from "@/domain/species/schema";
import { EvidenceBadge } from "@/ui/EvidenceBadge";
import { RichText } from "@/ui/RichText";
import { CitationRefs } from "./CitationRefs";
import type { CitationIndex } from "./format";

type Props = {
  claims: readonly Claim[];
  index: CitationIndex;
  /** Discovery history is documented record, not fossil evidence, so its badges are hidden. */
  showLevel?: boolean;
};

/** A list of sourced statements, each labelled with how strong its evidence is. */
export function ClaimList({ claims, index, showLevel = true }: Props) {
  return (
    <ul className="space-y-4">
      {claims.map((claim) => (
        <li key={claim.text} className="space-y-1">
          {showLevel && <EvidenceBadge level={claim.level} />}
          <p className="max-w-prose text-ink">
            <RichText text={claim.text} />
            <CitationRefs ids={claim.citationIds} index={index} />
          </p>
        </li>
      ))}
    </ul>
  );
}
