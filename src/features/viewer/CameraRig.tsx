"use client";

import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { fitView, REFERENCE_ASPECT } from "./fit-view";
import { useViewerStore, type CameraController } from "./viewer-store";

/**
 * Orbit camera with limits from the species config.
 *
 * camera-controls input mapping (defaults kept):
 *   mouse  — left drag: rotate · right drag: pan · wheel: zoom
 *   touch  — one finger: rotate · two fingers: pinch-zoom + pan
 * maxPolarAngle stops the camera dipping below the ground plane.
 */
export function CameraRig({ camera }: { camera: ViewerConfig["camera"] }) {
  const controls = useRef<CameraControls>(null);
  const attach = useViewerStore((s) => s.attach);
  const detach = useViewerStore((s) => s.detach);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;

    // Adapter: exposes only what the store needs. camera-controls can drive an orthographic
    // camera too, which has no aspect; our viewer always uses a perspective camera.
    const controller: CameraController = {
      get distance() {
        return c.distance;
      },
      get camera() {
        return { aspect: "aspect" in c.camera ? c.camera.aspect : REFERENCE_ASPECT };
      },
      setLookAt: (...args) => c.setLookAt(...args),
      dollyTo: (distance, transition) => c.dollyTo(distance, transition),
      rotate: (azimuth, polar, transition) => c.rotate(azimuth, polar, transition),
    };

    // Initial view: instant (no transition), fitted to the stage shape.
    const view = fitView(camera.default, controller.camera.aspect);
    void c.setLookAt(...view.position, ...view.target, false);
    attach(controller, camera);
    return detach;
  }, [camera, attach, detach]);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={camera.limits.minDistance}
      maxDistance={camera.limits.maxDistance}
      maxPolarAngle={camera.limits.maxPolarAngle}
      smoothTime={0.3}
      draggingSmoothTime={0.08}
    />
  );
}
