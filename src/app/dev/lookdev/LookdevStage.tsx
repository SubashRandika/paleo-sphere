"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { parseLookdevParams } from "@/features/viewer/lookdev-params";
import { useViewerStore } from "@/features/viewer/viewer-store";

const Scene = dynamic(() => import("@/features/viewer/Scene"), { ssr: false });

export function LookdevStage({ configs }: { configs: Record<string, ViewerConfig> }) {
  const searchParams = useSearchParams();
  const status = useViewerStore((s) => s.status);
  const first = Object.keys(configs)[0] ?? "";
  const params = useMemo(
    () => parseLookdevParams(new URLSearchParams(searchParams), first),
    [searchParams, first],
  );

  const base = configs[params.species];
  const config = useMemo(() => {
    if (!base) return undefined;
    const view = params.camera ?? base.camera.presets.find((p) => p.id === params.view);
    // Macro views sit closer than the species' minDistance; relax limits for lookdev only.
    const limits = params.camera ? { ...base.camera.limits, minDistance: 0.3 } : base.camera.limits;
    return view ? { ...base, camera: { ...base.camera, default: view, limits } } : base;
  }, [base, params.view, params.camera]);

  if (!config) return <p className="p-6">Unknown species “{params.species}”.</p>;

  const s = params.settings;
  return (
    <div
      data-viewer-state={status}
      className="fixed inset-0 z-50 bg-bg"
      style={{
        backgroundImage: "radial-gradient(ellipse 60% 55% at 50% 58%, var(--stage-glow), transparent 70%)",
      }}
    >
      <Scene config={config} settings={s} {...(params.modelUrl && { modelUrl: params.modelUrl })} />
      <p className="label pointer-events-none absolute top-3 left-3">
        {params.modelUrl?.split("/").pop() ?? "production asset"} · {s.toneMapping} · exp {s.exposure} · env{" "}
        {s.environmentIntensity} · key {s.keyLightIntensity}
        {s.disabledMaps.length > 0 && ` · off: ${s.disabledMaps.join(", ")}`} · view {params.view}
      </p>
    </div>
  );
}
