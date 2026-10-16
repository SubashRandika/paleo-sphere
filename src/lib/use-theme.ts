"use client";

import { useSyncExternalStore } from "react";
import { isTheme, type Theme } from "./theme";

/**
 * The active theme, read from <html data-theme> and updated whenever it changes
 * (by the toggle, or in another component). `null` during server render and the
 * first hydration pass, because the server cannot know the visitor's stored choice.
 */
export function useTheme(): Theme | null {
  return useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => observer.disconnect();
    },
    () => {
      const value = document.documentElement.dataset.theme;
      return isTheme(value) ? value : null;
    },
    () => null,
  );
}
