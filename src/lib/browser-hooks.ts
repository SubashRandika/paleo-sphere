"use client";

import { useSyncExternalStore } from "react";

/*
 * Browser capability hooks built on useSyncExternalStore.
 * The third argument is the server snapshot: during SSR (and the first hydration pass) these
 * return a neutral value, then switch to the real one on the client without a mismatch warning.
 */

const noSubscribe = () => () => {};

let webgl2: boolean | undefined;
function detectWebGL2(): boolean {
  if (webgl2 === undefined) {
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      webgl2 = gl !== null;
      // Release the probe context immediately; browsers cap how many can exist at once.
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

/** `null` until known (server render), then whether WebGL2 is available. */
export function useWebGL2Support(): boolean | null {
  return useSyncExternalStore(noSubscribe, detectWebGL2, () => null);
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

function subscribeFullscreen(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}

/** Whether element fullscreen is supported (it is not on iPhone Safari) and whether it is active. */
export function useFullscreenState(): { supported: boolean; active: boolean } {
  const supported = useSyncExternalStore(
    noSubscribe,
    () => document.fullscreenEnabled === true,
    () => false,
  );
  const active = useSyncExternalStore(
    subscribeFullscreen,
    () => document.fullscreenElement !== null,
    () => false,
  );
  return { supported, active };
}
