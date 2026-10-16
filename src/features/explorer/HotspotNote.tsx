"use client";

import { useEffect } from "react";
import type { EvidenceLevel } from "@/domain/species/schema";
import { useViewerStore } from "@/features/viewer/viewer-store";
import { EvidenceBadge } from "@/ui/EvidenceBadge";
import { RichText } from "@/ui/RichText";

export type HotspotNoteData = {
  title: string;
  text: string;
  level: EvidenceLevel;
  /** Source ids with the numbers they have in this species' sources list. */
  refs: { id: string; n: number }[];
};

/**
 * The explanation for the selected anatomy hotspot, shown over the stage.
 * Lives outside the viewer: the 3D code only knows hotspot ids and positions,
 * the prose and sources come from the species content (passed in by the layout).
 */
export function HotspotNote({ notes }: { notes: Record<string, HotspotNoteData> }) {
  const mode = useViewerStore((s) => s.mode);
  const hotspot = useViewerStore((s) => s.hotspot);
  const select = useViewerStore((s) => s.selectHotspot);
  const note = hotspot ? notes[hotspot] : undefined;

  useEffect(() => {
    if (!note) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && select(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [note, select]);

  if (mode !== "anatomy") return null;

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-30 sm:right-auto sm:left-4 sm:w-80">
      {note ? (
        <section
          aria-live="polite"
          aria-label={note.title}
          className="pointer-events-auto space-y-2 rounded-lg border border-rule bg-surface/95 p-4 shadow-lg backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl leading-snug">{note.title}</h2>
            <button
              type="button"
              onClick={() => select(null)}
              aria-label="Close note"
              className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-bg hover:text-ink"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <EvidenceBadge level={note.level} />
          <p className="text-sm text-ink">
            <RichText text={note.text} />
            {note.refs.length > 0 && (
              <sup className="ml-0.5 font-mono text-[0.65em] text-muted">
                [
                {note.refs.map((r, i) => (
                  <span key={r.id}>
                    {i > 0 && ", "}
                    <a
                      href={`#source-${r.id}`}
                      aria-label={`Source ${r.n}`}
                      className="underline decoration-rule underline-offset-2 hover:text-ink"
                    >
                      {r.n}
                    </a>
                  </span>
                ))}
                ]
              </sup>
            )}
          </p>
        </section>
      ) : (
        <p
          role="status"
          className="label pointer-events-auto inline-block rounded-full border border-rule bg-surface/90 px-3 py-1.5 whitespace-nowrap backdrop-blur"
        >
          Select a numbered point to read about it
        </p>
      )}
    </div>
  );
}
