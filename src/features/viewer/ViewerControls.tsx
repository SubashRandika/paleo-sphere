"use client";

import type { ReactNode } from "react";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { useViewerStore, type ViewerMode } from "./viewer-store";

type Props = {
  presets: ViewerConfig["camera"]["presets"];
  /** Presentation modes the species supports; the switch appears when there is more than studio. */
  modes?: ViewerConfig["modes"];
  fullscreen: { supported: boolean; active: boolean; toggle(): void };
};

/**
 * Camera toolbar. Lives in the DOM (not the canvas) so it is keyboard- and screen-reader-accessible.
 * Buttons call store actions; the store moves the camera without re-rendering the scene.
 */
const MODE_LABELS: Record<ViewerMode, string> = { studio: "Studio", anatomy: "Anatomy" };

export function ViewerControls({ presets, modes = ["studio"], fullscreen }: Props) {
  const ready = useViewerStore((s) => s.status === "ready");
  const mode = useViewerStore((s) => s.mode);
  const { zoom, reset, goTo, setMode } = useViewerStore.getState();
  const available = (Object.keys(MODE_LABELS) as ViewerMode[]).filter((m) => modes.includes(m));

  return (
    <div
      role="toolbar"
      aria-label="Camera"
      className="flex flex-wrap items-center justify-center gap-1 rounded-[1.25rem] border border-rule bg-surface/85 p-1 backdrop-blur"
    >
      {available.length > 1 && (
        <>
          <div role="group" aria-label="Presentation mode" className="flex gap-1">
            {available.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                disabled={!ready}
                onClick={() => setMode(m)}
                className={`${buttonClass} px-3 font-mono text-[0.6875rem] tracking-[0.12em] uppercase aria-pressed:bg-ink aria-pressed:text-bg aria-pressed:hover:bg-ink`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-rule" />
        </>
      )}
      {presets.map((preset) => (
        <TextButton
          key={preset.id}
          disabled={!ready}
          onClick={() => goTo(preset.id)}
          label={`${preset.label} view`}
        >
          {preset.label}
        </TextButton>
      ))}
      {presets.length > 0 && <span aria-hidden="true" className="mx-1 h-5 w-px bg-rule" />}
      <IconButton label="Zoom in" disabled={!ready} onClick={() => zoom(1)}>
        <path d="M12 6v12M6 12h12" />
      </IconButton>
      <IconButton label="Zoom out" disabled={!ready} onClick={() => zoom(-1)}>
        <path d="M6 12h12" />
      </IconButton>
      <IconButton label="Reset view" disabled={!ready} onClick={reset}>
        <path d="M5 12a7 7 0 1 0 2.05-4.95M5 5v4h4" />
      </IconButton>
      {fullscreen.supported && (
        <IconButton
          label={fullscreen.active ? "Exit full screen" : "Full screen"}
          pressed={fullscreen.active}
          onClick={fullscreen.toggle}
        >
          {fullscreen.active ? (
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
          ) : (
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          )}
        </IconButton>
      )}
    </div>
  );
}

const buttonClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-bg/70 disabled:cursor-not-allowed disabled:opacity-40";

function TextButton(props: { label: string; disabled: boolean; onClick(): void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${buttonClass} px-3 font-mono text-[0.6875rem] tracking-[0.12em] uppercase`}
    >
      {props.children}
    </button>
  );
}

function IconButton(props: {
  label: string;
  disabled?: boolean;
  pressed?: boolean;
  onClick(): void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={props.label}
      title={props.label}
      disabled={props.disabled}
      aria-pressed={props.pressed}
      onClick={props.onClick}
      className={buttonClass}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {props.children}
      </svg>
    </button>
  );
}
