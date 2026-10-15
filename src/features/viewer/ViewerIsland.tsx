"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { useFullscreenState, usePrefersReducedMotion, useWebGL2Support } from "@/lib/browser-hooks";
import { ViewerControls } from "./ViewerControls";
import { useViewerStore } from "./viewer-store";

// three.js, R3F and Drei live in this chunk. It is requested only on the client, after the
// server-rendered article is already readable.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/** Exposed on the stage as data-viewer-state for tests and debugging. */
type ViewerState = "checking" | "unsupported" | "loading" | "ready" | "error";

const ORBIT_STEP_DEG = 15;

/**
 * The species viewer as it appears in the page: poster, canvas, status, and controls.
 *
 * Layer order (bottom → top): CSS stage gradient · poster image · WebGL canvas · status · toolbar.
 * The poster stays visible until the model is ready, and permanently when WebGL is unavailable,
 * so the stage is never an empty box.
 */
export function ViewerIsland({ config }: { config: ViewerConfig }) {
  const stage = useRef<HTMLElement>(null);
  const webgl = useWebGL2Support();
  const reducedMotion = usePrefersReducedMotion();
  const fullscreen = useFullscreenState();
  const status = useViewerStore((s) => s.status);
  const progress = useViewerStore((s) => s.progress);
  const retry = useViewerStore((s) => s.retry);
  const setAnimate = useViewerStore((s) => s.setAnimate);
  const [posterFailed, setPosterFailed] = useState(false);

  useEffect(() => setAnimate(!reducedMotion), [reducedMotion, setAnimate]);

  const state: ViewerState = webgl === null ? "checking" : webgl ? status : "unsupported";

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    // Only when the stage itself has focus; toolbar buttons keep their normal key behaviour.
    if (event.target !== event.currentTarget || state !== "ready") return;
    const { orbit, zoom, reset } = useViewerStore.getState();
    const actions: Record<string, () => void> = {
      ArrowLeft: () => orbit(ORBIT_STEP_DEG, 0),
      ArrowRight: () => orbit(-ORBIT_STEP_DEG, 0),
      ArrowUp: () => orbit(0, ORBIT_STEP_DEG),
      ArrowDown: () => orbit(0, -ORBIT_STEP_DEG),
      "+": () => zoom(1),
      "=": () => zoom(1),
      "-": () => zoom(-1),
      Home: reset,
      "0": reset,
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault(); // stop arrow keys from scrolling the page
    action();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stage.current?.requestFullscreen();
  };

  return (
    <figure
      ref={stage}
      data-viewer-state={state}
      tabIndex={webgl ? 0 : undefined}
      aria-label={`3D model of ${config.scientificName}`}
      aria-describedby="viewer-help"
      onKeyDown={onKeyDown}
      className="relative min-h-[55svh] overflow-hidden bg-bg focus-visible:outline-offset-[-2px] lg:min-h-0"
      style={{
        backgroundImage: "radial-gradient(ellipse 60% 55% at 50% 58%, var(--stage-glow), transparent 70%)",
      }}
    >
      {!posterFailed && (
        // Plain <img>: the poster must paint before any JS and needs no Next image optimisation.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={config.model.poster}
          alt=""
          onError={() => setPosterFailed(true)}
          className={`pointer-events-none absolute inset-0 size-full object-contain transition-opacity duration-500 ${
            state === "ready" ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {webgl && (
        <div className="absolute inset-0">
          <Scene config={config} />
        </div>
      )}

      <StatusMessage state={state} progress={progress} onRetry={retry} />

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-2 px-4">
        {webgl && (
          <div className="pointer-events-auto">
            <ViewerControls
              presets={config.camera.presets}
              fullscreen={{ ...fullscreen, toggle: toggleFullscreen }}
            />
          </div>
        )}
        <p id="viewer-help" className="label hidden text-center sm:block">
          {webgl === false
            ? "Interactive 3D is unavailable on this device"
            : "Drag to rotate · Right-drag to pan · Scroll to zoom · Arrow keys when selected"}
        </p>
      </div>

      <figcaption className="sr-only">{config.modelDescription}</figcaption>
    </figure>
  );
}

function StatusMessage({
  state,
  progress,
  onRetry,
}: {
  state: ViewerState;
  progress: number;
  onRetry: (() => void) | null;
}) {
  if (state === "loading") {
    return (
      <p role="status" className="label absolute inset-x-0 top-6 text-center">
        Loading model · {progress}%
      </p>
    );
  }
  if (state === "error") {
    return (
      <div
        role="alert"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
      >
        <p className="text-sm text-ink">
          The 3D model could not be loaded. Check your connection and try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-rule px-4 py-2 font-mono text-xs tracking-[0.12em] text-ink uppercase hover:bg-surface"
          >
            Try again
          </button>
        )}
      </div>
    );
  }
  if (state === "unsupported") {
    return (
      <p className="absolute inset-x-0 top-6 px-6 text-center text-sm text-ink">
        This browser can’t display 3D models (WebGL 2 is off or unsupported). Everything else on this page
        still works. A current version of Chrome, Edge, Firefox, or Safari will show the model.
      </p>
    );
  }
  return null;
}
