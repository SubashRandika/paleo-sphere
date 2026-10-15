import { ACESFilmicToneMapping, AgXToneMapping, NeutralToneMapping, type ToneMapping } from "three";

/**
 * Look-development parameters. Production uses STUDIO_SETTINGS; the dev-only /dev/lookdev page
 * overrides them from the URL to compare options side by side (docs/lookdev/).
 */
export type ToneMappingName = "agx" | "neutral" | "aces";

/** Material texture slots that lookdev can switch off to see each map's contribution. */
export type MapSlot = "map" | "normalMap" | "aoMap" | "roughnessMap";

export type RenderSettings = {
  toneMapping: ToneMappingName;
  exposure: number;
  /** Multiplier on image-based lighting (the Lightformer environment). */
  environmentIntensity: number;
  /** Directional key light, in three.js physical units (lux-like). */
  keyLightIntensity: number;
  /** Key-light shadow map (self-shadowing + cast shadow). Rendered once; can be disabled on weak GPUs. */
  shadows: boolean;
  disabledMaps: MapSlot[];
};

/**
 * Chosen in Phase 4 lookdev (docs/lookdev/tyrannosaurus-rex.md):
 *  - Khronos PBR Neutral keeps the albedo's hues; AgX greyed the warm browns, ACES added contrast.
 *  - A stronger key (4.5) with slightly more environment (1.2) gives the body form at full-figure distance.
 *  - Key-light shadows close the largest gap against the Cycles reference (self-shadowing).
 */
export const STUDIO_SETTINGS: RenderSettings = {
  toneMapping: "neutral",
  exposure: 1.15,
  environmentIntensity: 1.2,
  keyLightIntensity: 4.5,
  shadows: true,
  disabledMaps: [],
};

export const TONE_MAPPING: Record<ToneMappingName, ToneMapping> = {
  agx: AgXToneMapping,
  neutral: NeutralToneMapping,
  aces: ACESFilmicToneMapping,
};
