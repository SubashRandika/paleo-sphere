import { describe, expect, it } from "vitest";
import { chooseAssetTier } from "./device-tier";

describe("chooseAssetTier", () => {
  it("serves the mobile variant to phone-sized screens", () => {
    expect(chooseAssetTier({ screenShortSide: 412 })).toBe("mobile");
  });

  it("serves the mobile variant to low-memory devices even on large screens", () => {
    expect(chooseAssetTier({ screenShortSide: 1080, deviceMemoryGB: 4 })).toBe("mobile");
  });

  it("serves the high variant to desktops", () => {
    expect(chooseAssetTier({ screenShortSide: 1080, deviceMemoryGB: 8 })).toBe("high");
  });

  it("does not penalise browsers that do not report device memory", () => {
    expect(chooseAssetTier({ screenShortSide: 900 })).toBe("high");
  });
});
