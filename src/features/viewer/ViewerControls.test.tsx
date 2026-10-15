import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ViewerControls } from "./ViewerControls";
import { useViewerStore } from "./viewer-store";

const presets = [
  {
    id: "side",
    label: "Side",
    position: [1, 1, 1] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
];
const noFullscreen = { supported: false, active: false, toggle: vi.fn() };

beforeEach(() => {
  useViewerStore.setState({ status: "loading", controller: null, camera: null });
});

describe("ViewerControls", () => {
  it("disables camera buttons until the model is ready", () => {
    render(<ViewerControls presets={presets} fullscreen={noFullscreen} />);
    expect(screen.getByRole("button", { name: "Side view" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reset view" })).toBeDisabled();
  });

  it("calls the store's camera actions once ready", async () => {
    const goTo = vi.fn();
    const zoom = vi.fn();
    useViewerStore.setState({ status: "ready", goTo, zoom });
    render(<ViewerControls presets={presets} fullscreen={noFullscreen} />);

    await userEvent.click(screen.getByRole("button", { name: "Side view" }));
    await userEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(goTo).toHaveBeenCalledWith("side");
    expect(zoom).toHaveBeenCalledWith(1);
  });

  it("hides full screen where the browser does not support it (e.g. iPhone Safari)", () => {
    render(<ViewerControls presets={presets} fullscreen={noFullscreen} />);
    expect(screen.queryByRole("button", { name: /full screen/i })).not.toBeInTheDocument();
  });

  it("labels the full-screen button by what it will do", () => {
    render(
      <ViewerControls presets={presets} fullscreen={{ supported: true, active: true, toggle: vi.fn() }} />,
    );
    expect(screen.getByRole("button", { name: "Exit full screen" })).toHaveAttribute("aria-pressed", "true");
  });
});
