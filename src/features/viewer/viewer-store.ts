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
type Hotspot = ViewerConfig["hotspots"][number];

export type ViewerStatus = "loading" | "ready" | "error";
/** The presentation modes the viewer implements so far (habitat: Phase 7). */
export type ViewerMode = "studio" | "anatomy" | "fossil";

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
  hotspots: readonly Hotspot[];
  /** Default view of the fossil scan, when the species has one. */
  fossilView: CameraView | null;
  mode: ViewerMode;
  /** Selected anatomy hotspot id; only meaningful in anatomy mode. */
  hotspot: string | null;
  /** The species' looping clip is playing. Studio mode only: anatomy markers need the rest pose. */
  playing: boolean;

  setStatus(status: ViewerStatus): void;
  setProgress(progress: number): void;
  setRetry(retry: (() => void) | null): void;
  setAnimate(animate: boolean): void;
  attach(
    controller: CameraController,
    camera: CameraConfig,
    hotspots?: readonly Hotspot[],
    fossilView?: CameraView | null,
  ): void;
  detach(): void;
  setMode(mode: ViewerMode): void;
  /** Selects a hotspot and frames it; `null` deselects and returns to the default view. */
  selectHotspot(id: string | null): void;
  setPlaying(playing: boolean): void;

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
    hotspots: [],
    fossilView: null,
    mode: "studio",
    hotspot: null,
    playing: false,

    setStatus: (status) => set({ status }),
    setProgress: (progress) => set({ progress }),
    setRetry: (retry) => set({ retry }),
    setAnimate: (animate) => set({ animate }),
    // A new species starts in studio mode, still, with nothing selected.
    attach: (controller, camera, hotspots = [], fossilView = null) =>
      set({ controller, camera, hotspots, fossilView, mode: "studio", hotspot: null, playing: false }),
    detach: () =>
      set({
        controller: null,
        camera: null,
        hotspots: [],
        fossilView: null,
        mode: "studio",
        hotspot: null,
        playing: false,
      }),

    setMode: (mode) => {
      const previous = get().mode;
      if (mode === previous || (mode === "fossil" && !get().fossilView)) return;
      const wasSelected = get().hotspot !== null;
      // Other modes show the rest pose (the model returns to it when the clip stops).
      set({ mode, hotspot: null, playing: mode === "studio" && get().playing });
      // The scan and the reconstruction are different objects, each framed by its own default view.
      if (wasSelected || mode === "fossil" || previous === "fossil") get().reset();
    },
    selectHotspot: (id) => {
      const target = id === null ? undefined : get().hotspots.find((h) => h.id === id);
      if (id !== null && !target) return;
      set({ hotspot: target ? target.id : null });
      if (target) lookAt(target.view);
      else get().reset();
    },
    setPlaying: (playing) => set({ playing: playing && get().mode === "studio" }),

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
      const { camera, fossilView, mode } = get();
      set({ hotspot: null });
      const view = mode === "fossil" ? fossilView : camera?.default;
      if (view) lookAt(view);
    },
    goTo: (presetId) => {
      const preset = get().camera?.presets.find((p) => p.id === presetId);
      if (preset) lookAt(preset);
    },
  };
});
