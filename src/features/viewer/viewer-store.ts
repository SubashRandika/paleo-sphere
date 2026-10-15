import { create } from "zustand";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { fitView } from "./fit-view";

/**
 * Bridge between DOM controls (toolbar, keyboard) and the camera inside the canvas.
 *
 * The toolbar calls actions here; actions drive the camera controller imperatively.
 * Nothing in the R3F scene re-renders when a button is pressed — the controller animates the
 * camera and invalidates the frame itself. Components subscribe with selectors, so a change
 * to `status` only re-renders the parts that read `status`.
 */

/** The subset of camera-controls we use. Keeping it narrow makes the store testable without WebGL. */
export interface CameraController {
  readonly distance: number;
  /** The perspective camera being controlled; its aspect is used to fit authored views to the stage. */
  readonly camera: { aspect: number };
  setLookAt(
    px: number,
    py: number,
    pz: number,
    tx: number,
    ty: number,
    tz: number,
    enableTransition?: boolean,
  ): Promise<void>;
  dollyTo(distance: number, enableTransition?: boolean): Promise<void>;
  rotate(azimuthAngle: number, polarAngle: number, enableTransition?: boolean): Promise<void>;
}

type CameraConfig = ViewerConfig["camera"];
type CameraView = CameraConfig["default"];

export type ViewerStatus = "loading" | "ready" | "error";

type ViewerState = {
  status: ViewerStatus;
  /** Download progress 0–100 while loading. */
  progress: number;
  /** Set by the scene's error boundary; clears the failed load and tries again. */
  retry: (() => void) | null;
  /** False when the visitor prefers reduced motion: camera moves jump instead of easing. */
  animate: boolean;
  controller: CameraController | null;
  camera: CameraConfig | null;

  setStatus(status: ViewerStatus): void;
  setProgress(progress: number): void;
  setRetry(retry: (() => void) | null): void;
  setAnimate(animate: boolean): void;
  attach(controller: CameraController, camera: CameraConfig): void;
  detach(): void;

  zoom(direction: 1 | -1): void;
  orbit(azimuthDeg: number, polarDeg: number): void;
  reset(): void;
  goTo(presetId: string): void;
};

/** Each zoom step changes the distance to the target by this factor. */
export const ZOOM_STEP = 0.8;
const DEG = Math.PI / 180;

export const useViewerStore = create<ViewerState>()((set, get) => {
  const lookAt = (view: CameraView) => {
    const { controller, animate } = get();
    if (!controller) return;
    const fitted = fitView(view, controller.camera.aspect);
    void controller.setLookAt(...fitted.position, ...fitted.target, animate);
  };

  return {
    status: "loading",
    progress: 0,
    retry: null,
    animate: true,
    controller: null,
    camera: null,

    setStatus: (status) => set({ status }),
    setProgress: (progress) => set({ progress }),
    setRetry: (retry) => set({ retry }),
    setAnimate: (animate) => set({ animate }),
    attach: (controller, camera) => set({ controller, camera }),
    detach: () => set({ controller: null, camera: null }),

    zoom: (direction) => {
      const { controller, animate } = get();
      if (!controller) return;
      const factor = direction === 1 ? ZOOM_STEP : 1 / ZOOM_STEP;
      void controller.dollyTo(controller.distance * factor, animate);
    },
    orbit: (azimuthDeg, polarDeg) => {
      const { controller, animate } = get();
      void controller?.rotate(azimuthDeg * DEG, polarDeg * DEG, animate);
    },
    reset: () => {
      const camera = get().camera;
      if (camera) lookAt(camera.default);
    },
    goTo: (presetId) => {
      const preset = get().camera?.presets.find((p) => p.id === presetId);
      if (preset) lookAt(preset);
    },
  };
});
