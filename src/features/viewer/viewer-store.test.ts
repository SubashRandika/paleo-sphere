import { beforeEach, describe, expect, it, vi } from "vitest";
import { useViewerStore, ZOOM_STEP, type CameraController } from "./viewer-store";

const camera = {
  default: {
    position: [10, 4, 10] as [number, number, number],
    target: [0, 2, 0] as [number, number, number],
  },
  presets: [
    {
      id: "side",
      label: "Side",
      position: [20, 3, 0] as [number, number, number],
      target: [0, 2, 0] as [number, number, number],
    },
  ],
  limits: { minDistance: 2, maxDistance: 40, maxPolarAngle: 1.5 },
};

function fakeController(distance = 10): CameraController {
  return {
    distance,
    camera: { aspect: 1.25 },
    setLookAt: vi.fn(async () => {}),
    dollyTo: vi.fn(async () => {}),
    rotate: vi.fn(async () => {}),
  };
}

beforeEach(() => {
  useViewerStore.setState({ status: "loading", animate: true, controller: null, camera: null });
});

describe("viewer store camera actions", () => {
  it("does nothing before the canvas attaches a controller", () => {
    expect(() => useViewerStore.getState().reset()).not.toThrow();
  });

  it("reset returns to the default view with an eased transition", () => {
    const c = fakeController();
    useViewerStore.getState().attach(c, camera);
    useViewerStore.getState().reset();
    expect(c.setLookAt).toHaveBeenCalledWith(10, 4, 10, 0, 2, 0, true);
  });

  it("jumps instead of easing when the visitor prefers reduced motion", () => {
    const c = fakeController();
    useViewerStore.getState().attach(c, camera);
    useViewerStore.getState().setAnimate(false);
    useViewerStore.getState().goTo("side");
    expect(c.setLookAt).toHaveBeenCalledWith(20, 3, 0, 0, 2, 0, false);
  });

  it("ignores unknown presets", () => {
    const c = fakeController();
    useViewerStore.getState().attach(c, camera);
    useViewerStore.getState().goTo("nope");
    expect(c.setLookAt).not.toHaveBeenCalled();
  });

  it("zooms in and out by a fixed factor of the current distance", () => {
    const c = fakeController(10);
    useViewerStore.getState().attach(c, camera);
    useViewerStore.getState().zoom(1);
    useViewerStore.getState().zoom(-1);
    expect(c.dollyTo).toHaveBeenNthCalledWith(1, 10 * ZOOM_STEP, true);
    expect(c.dollyTo).toHaveBeenNthCalledWith(2, 10 / ZOOM_STEP, true);
  });

  it("orbits in degrees, converted to radians", () => {
    const c = fakeController();
    useViewerStore.getState().attach(c, camera);
    useViewerStore.getState().orbit(180, 0);
    expect(c.rotate).toHaveBeenCalledWith(Math.PI, 0, true);
  });
});
