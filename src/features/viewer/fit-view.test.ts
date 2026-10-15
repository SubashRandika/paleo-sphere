import { describe, expect, it } from "vitest";
import { fitView, REFERENCE_ASPECT, type CameraView } from "./fit-view";

const view: CameraView = { position: [10, 4, 0], target: [0, 2, 0] };

describe("fitView", () => {
  it("keeps the authored view on stages at least as wide as the reference", () => {
    expect(fitView(view, REFERENCE_ASPECT)).toEqual(view);
    expect(fitView(view, 2)).toEqual(view);
  });

  it("moves the camera back along the same line on narrower stages", () => {
    const fitted = fitView(view, REFERENCE_ASPECT / 2);
    expect(fitted.target).toEqual(view.target);
    expect(fitted.position).toEqual([20, 6, 0]); // offset (10, 2, 0) doubled
  });

  it("caps the pullback so extreme aspect ratios stay usable", () => {
    expect(fitView(view, 0.1).position).toEqual([25, 7, 0]); // 2.5× cap
  });

  it("ignores invalid aspect ratios", () => {
    expect(fitView(view, 0)).toEqual(view);
    expect(fitView(view, Number.NaN)).toEqual(view);
  });
});
