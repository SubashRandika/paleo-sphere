"use client";

import { Html } from "@react-three/drei";
import type { RefObject } from "react";
import type { Object3D } from "three";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { useViewerStore } from "./viewer-store";

type Props = {
  hotspots: ViewerConfig["hotspots"];
  /** The model; markers behind it are hidden (Drei raycasts camera → marker on rendered frames only). */
  occluder: RefObject<Object3D | null>;
};

/**
 * Anatomy-mode markers. Each is a real DOM <button> projected onto the canvas (Drei <Html>),
 * so it is keyboard-focusable and announced by screen readers like any other control.
 * Selecting one frames it and shows its note (see features/explorer/HotspotNote.tsx).
 */
export function Hotspots({ hotspots, occluder }: Props) {
  const mode = useViewerStore((s) => s.mode);
  const active = useViewerStore((s) => s.hotspot);
  const select = useViewerStore((s) => s.selectHotspot);
  if (mode !== "anatomy") return null;

  return hotspots.map((h, i) => (
    <Html
      key={h.id}
      position={h.position}
      center
      occlude={[occluder as RefObject<Object3D>]}
      zIndexRange={[20, 10]}
    >
      <button
        type="button"
        aria-label={`${i + 1}. ${h.label}`}
        aria-pressed={active === h.id}
        title={h.label}
        onClick={() => select(active === h.id ? null : h.id)}
        className="grid size-8 place-items-center rounded-full border-2 border-bg bg-ink font-mono text-xs text-bg shadow-[0_0_0_1px_var(--rule)] transition-transform hover:scale-110 aria-pressed:scale-110 aria-pressed:bg-accent motion-reduce:transition-none"
      >
        {i + 1}
      </button>
    </Html>
  ));
}
