import { STUDIO_SETTINGS, type MapSlot, type RenderSettings, type ToneMappingName } from "./render-settings";

/**
 * Parses /dev/lookdev query parameters. Unknown or invalid values fall back to production settings,
 * so a lookdev URL only states what differs from production.
 *
 *   ?species=tyrannosaurus-rex&view=head&tone=neutral&exposure=1&env=1.2&key=2
 *    &model=/lookdev/tyrannosaurus-rex/tyrannosaurus-rex-ultra.glb&off=normalMap,aoMap&shadows=0
 */
export type LookdevParams = {
  species: string;
  /** Camera preset id, or "default". */
  view: string;
  /** Explicit camera (cam=px,py,pz,tx,ty,tz) — overrides `view`; used for macro comparisons. */
  camera?: { position: [number, number, number]; target: [number, number, number] };
  modelUrl?: string;
  settings: RenderSettings;
};

const TONES: ToneMappingName[] = ["agx", "neutral", "aces"];
const SLOTS: MapSlot[] = ["map", "normalMap", "aoMap", "roughnessMap"];

function number(value: string | null, fallback: number, min: number, max: number): number {
  if (value === null || value.trim() === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
}

export function parseLookdevParams(params: URLSearchParams, defaultSpecies: string): LookdevParams {
  const tone = params.get("tone") as ToneMappingName | null;
  const model = params.get("model");
  const off = (params.get("off") ?? "").split(",").filter((s): s is MapSlot => SLOTS.includes(s as MapSlot));
  const cam = (params.get("cam") ?? "").split(",").map(Number);
  const camera =
    cam.length === 6 && cam.every(Number.isFinite)
      ? {
          position: [cam[0], cam[1], cam[2]] as [number, number, number],
          target: [cam[3], cam[4], cam[5]] as [number, number, number],
        }
      : undefined;

  return {
    species: params.get("species") || defaultSpecies,
    view: params.get("view") || "default",
    ...(camera && { camera }),
    // Only same-origin absolute paths: lookdev must not load arbitrary remote files.
    ...(model && /^\/[\w\-./]+\.glb$/.test(model) && { modelUrl: model }),
    settings: {
      toneMapping: tone && TONES.includes(tone) ? tone : STUDIO_SETTINGS.toneMapping,
      exposure: number(params.get("exposure"), STUDIO_SETTINGS.exposure, 0.1, 4),
      environmentIntensity: number(params.get("env"), STUDIO_SETTINGS.environmentIntensity, 0, 5),
      keyLightIntensity: number(params.get("key"), STUDIO_SETTINGS.keyLightIntensity, 0, 20),
      shadows: params.get("shadows") === null ? STUDIO_SETTINGS.shadows : params.get("shadows") !== "0",
      disabledMaps: off,
    },
  };
}
