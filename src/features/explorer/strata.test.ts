import { describe, expect, it } from "vitest";
import { ageToFraction, PERIODS, spreadLabels } from "./strata";

describe("ageToFraction", () => {
  it("maps the start of the Triassic to the top and the end of the Cretaceous to the bottom", () => {
    expect(ageToFraction(PERIODS[0].startMa)).toBe(0);
    expect(ageToFraction(66)).toBe(1);
  });

  it("clamps ages outside the rail", () => {
    expect(ageToFraction(300)).toBe(0);
    expect(ageToFraction(10)).toBe(1);
  });
});

describe("spreadLabels", () => {
  it("leaves well-separated labels where they are", () => {
    expect(spreadLabels([0.2, 0.5, 0.8], 0.05)).toEqual([0.2, 0.5, 0.8]);
  });

  it("separates labels for species of the same age, keeping their order", () => {
    const out = spreadLabels([0.55, 0.556, 0.556], 0.06);
    expect(out[1]! - out[0]!).toBeCloseTo(0.06);
    expect(out[2]! - out[1]!).toBeCloseTo(0.06);
  });

  it("pulls labels at the very bottom back inside the rail", () => {
    const out = spreadLabels([0.995, 0.995], 0.06);
    expect(out[1]).toBeCloseTo(0.97);
    expect(out[0]).toBeCloseTo(0.91);
  });

  it("handles no labels", () => {
    expect(spreadLabels([], 0.05)).toEqual([]);
  });
});
