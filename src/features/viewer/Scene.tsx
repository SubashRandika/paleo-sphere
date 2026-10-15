"use client";

import { ContactShadows, useGLTF, useProgress } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo } from "react";
import { PCFShadowMap } from "three";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { chooseAssetTier, readDeviceSignals } from "@/lib/device-tier";
import { releaseKTX2Loader } from "@/lib/three/ktx2";
import { CameraRig } from "./CameraRig";
import { STUDIO_SETTINGS, TONE_MAPPING, type RenderSettings } from "./render-settings";
import { SpeciesModel } from "./SpeciesModel";
import { StageFloor } from "./StageFloor";
import { StudioLighting } from "./StudioLighting";
import { ViewerErrorBoundary } from "./ViewerErrorBoundary";
import { useViewerStore } from "./viewer-store";

type Props = {
  config: ViewerConfig;
  /** Production uses the defaults; /dev/lookdev overrides them. */
  settings?: RenderSettings;
  /** Lookdev only: load a specific file instead of choosing a tier. */
  modelUrl?: string;
};

/**
 * The WebGL scene. Loaded with next/dynamic({ ssr: false }), so three.js never runs on the
 * server and never blocks the article text.
 *
 * Rendering settings (docs/architecture.md §2, §12):
 *  - frameloop "demand": render only after something calls invalidate() — camera movement,
 *    a finished load. An idle specimen costs no GPU time.
 *  - dpr [1, 2]: render at device pixel ratio, capped at 2. A 3× phone screen would otherwise
 *    shade 2.25× more pixels for little visible gain.
 *  - Tone mapping + exposure come from RenderSettings (see docs/lookdev/ for the comparison).
 *  - Transparent canvas: the CSS stage gradient behind it is the studio backdrop.
 */
export default function Scene({ config, settings = STUDIO_SETTINGS, modelUrl }: Props) {
  const url = useMemo(
    () => modelUrl ?? config.model[chooseAssetTier(readDeviceSignals())],
    [config.model, modelUrl],
  );
  // R3F applies plain-object gl props to the renderer, and skips its ACES default when
  // toneMapping is given. Memoised so the renderer is only reconfigured when settings change.
  const gl = useMemo(
    () => ({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance" as const,
      toneMapping: TONE_MAPPING[settings.toneMapping],
      toneMappingExposure: settings.exposure,
    }),
    [settings.toneMapping, settings.exposure],
  );
  const setStatus = useViewerStore((s) => s.setStatus);
  const setRetry = useViewerStore((s) => s.setRetry);

  const handleError = useCallback(
    (remount: () => void) => {
      setStatus("error");
      setRetry(() => {
        // The failed request is cached by the loader; clear it so the retry really re-fetches.
        useGLTF.clear(url);
        setRetry(null);
        setStatus("loading");
        remount();
      });
    },
    [url, setStatus, setRetry],
  );

  return (
    <>
      <ProgressReporter />
      <ViewerErrorBoundary onError={handleError}>
        <Canvas
          frameloop="demand"
          // PCFShadowMap: filtered (soft-edged) shadows. PCFSoftShadowMap was removed in three r18x.
          shadows={settings.shadows ? { type: PCFShadowMap } : false}
          dpr={[1, 2]}
          gl={gl}
          camera={{ fov: 35, near: 0.1, far: 300, position: config.camera.default.position }}
        >
          <RendererLifecycle />
          <StudioLighting
            environmentIntensity={settings.environmentIntensity}
            keyLightIntensity={settings.keyLightIntensity}
            shadows={settings.shadows}
          />
          <StageFloor />
          <Suspense fallback={null}>
            <SpeciesModel url={url} disabledMaps={settings.disabledMaps} />
            {/*
              Soft occlusion shadow under the feet, rendered once after the model mounts.
              Must sit at or slightly BELOW y = 0: Drei's blur passes draw a plane at world y = 0 through
              a shadow camera placed at this position, looking up with near = 0. Any positive y puts that
              plane behind the camera and the blur output is empty. The floor draws first (renderOrder),
              so the shadow still composites on top of it.
            */}
            <ContactShadows
              position={[0, -0.001, 0]}
              scale={30}
              resolution={1024}
              blur={2.4}
              far={6}
              opacity={0.85}
              frames={1}
            />
          </Suspense>
          <CameraRig camera={config.camera} />
        </Canvas>
      </ViewerErrorBoundary>
    </>
  );
}

/** Releases renderer-scoped resources (KTX2 transcoder workers) when the canvas unmounts. */
function RendererLifecycle() {
  const gl = useThree((s) => s.gl);
  useEffect(() => () => releaseKTX2Loader(gl), [gl]);
  return null;
}

/** Mirrors three's global loading progress into the store for the DOM loading indicator. */
function ProgressReporter() {
  const progress = useProgress((s) => s.progress);
  const setProgress = useViewerStore((s) => s.setProgress);
  useEffect(() => setProgress(Math.round(progress)), [progress, setProgress]);
  return null;
}
