/**
 * Stands in for the 3D viewer when no model meets the project's accuracy and licensing
 * bar yet (docs/asset-research.md). Kept compact so the article starts above the fold on phones.
 */
export function ModelPlaceholder({ scientificName }: { scientificName: string }) {
  return (
    <section
      aria-label="3D model"
      className="flex flex-col items-center justify-center gap-3 bg-bg px-6 py-10 text-center"
    >
      <p className="label">3D reconstruction in preparation</p>
      <p className="max-w-sm text-sm text-muted">
        No model of <i>{scientificName}</i> has yet been prepared to the project’s standards for anatomy and
        licensing. The research below is complete.
      </p>
    </section>
  );
}
