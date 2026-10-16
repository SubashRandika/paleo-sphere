/**
 * Colour theme: dark (default, CLAUDE.md §10 "dark-first") or light, chosen by the visitor.
 *
 * The choice lives in localStorage and is applied to <html data-theme> by THEME_INIT_SCRIPT,
 * an inline script in the root layout that runs before first paint — so a visitor who chose
 * light never sees a dark flash. CSS tokens in globals.css do the rest; components only use
 * semantic utilities (bg-bg, text-ink…) and never need to know the theme.
 */

export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";
export const THEME_STORAGE_KEY = "paleo-sphere:theme";

/** Browser UI colour (address bar on mobile) per theme; matches --bg in globals.css. */
export const THEME_COLOR: Record<Theme, string> = { dark: "#121417", light: "#e6e1d6" };

export const isTheme = (value: unknown): value is Theme => value === "dark" || value === "light";

/** Sets the theme on the document and the browser UI colour. Client only. */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

/** Stores the visitor's choice; storage can be unavailable (private mode, blocked cookies). */
export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The theme still applies for this page view.
  }
}

/**
 * Inline, render-blocking on purpose: it must run before the body paints.
 * Kept tiny and dependency-free; it mirrors isTheme/applyTheme above.
 * The theme-color meta is rendered later in <head>, so it is updated once the DOM is parsed.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="light"&&t!=="dark")return;document.documentElement.dataset.theme=t;var c=${JSON.stringify(
  THEME_COLOR,
)}[t];document.addEventListener("DOMContentLoaded",function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",c)})}catch(e){}})();`;
