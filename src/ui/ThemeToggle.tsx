"use client";

import { applyTheme, saveTheme, type Theme } from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

/**
 * Switches between the dark and light themes and remembers the choice.
 * Not rendered until the client knows the current theme, so visitors without
 * JavaScript never see a button that does nothing.
 */
export function ThemeToggle() {
  const theme = useTheme();
  if (theme === null) return null;

  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${next} theme`;

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        saveTheme(next);
      }}
      aria-label={label}
      title={label}
      className="-mr-2 grid size-10 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink"
    >
      {next === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

const iconProps = {
  "aria-hidden": true,
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
