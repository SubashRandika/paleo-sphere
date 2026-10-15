import { describe, expect, it } from "vitest";
import { parseLookdevParams } from "./lookdev-params";
import { STUDIO_SETTINGS } from "./render-settings";

const parse = (query: string) => parseLookdevParams(new URLSearchParams(query), "tyrannosaurus-rex");

describe("parseLookdevParams", () => {
  it("defaults to production settings", () => {
    expect(parse("")).toEqual({ species: "tyrannosaurus-rex", view: "default", settings: STUDIO_SETTINGS });
  });

  it("reads overrides", () => {
    const p = parse("view=head&tone=neutral&exposure=1&env=1.5&key=2&off=normalMap,aoMap");
    expect(p.view).toBe("head");
    expect(p.settings).toEqual({
      toneMapping: "neutral",
      exposure: 1,
      environmentIntensity: 1.5,
      keyLightIntensity: 2,
      shadows: true,
      disabledMaps: ["normalMap", "aoMap"],
    });
  });

  it("ignores invalid values instead of producing broken renders", () => {
    const p = parse("tone=sepia&exposure=abc&env=-1&off=bogus");
    expect(p.settings).toEqual(STUDIO_SETTINGS);
  });

  it("turns shadows off only when asked", () => {
    expect(parse("shadows=0").settings.shadows).toBe(false);
    expect(parse("shadows=1").settings.shadows).toBe(true);
  });

  it("reads an explicit camera and ignores malformed ones", () => {
    expect(parse("cam=1,2,3,4,5,6").camera).toEqual({ position: [1, 2, 3], target: [4, 5, 6] });
    expect(parse("cam=1,2,3").camera).toBeUndefined();
    expect(parse("cam=1,2,3,4,5,x").camera).toBeUndefined();
  });

  it("only accepts same-origin GLB paths for the model override", () => {
    expect(parse("model=/lookdev/x/y-ultra.glb").modelUrl).toBe("/lookdev/x/y-ultra.glb");
    expect(parse("model=https://evil.example/m.glb").modelUrl).toBeUndefined();
    expect(parse("model=/models/x.png").modelUrl).toBeUndefined();
  });
});
