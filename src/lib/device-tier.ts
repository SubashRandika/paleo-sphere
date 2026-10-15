export type AssetTier = "high" | "mobile";

export type DeviceSignals = {
  /** Shorter side of the screen in CSS pixels. */
  screenShortSide: number;
  /** navigator.deviceMemory in GB — Chromium only; undefined elsewhere. */
  deviceMemoryGB?: number;
};

/**
 * Picks which model variant to download.
 * Deliberately simple until Phase 8 measurements justify something smarter:
 * phones (short side < 768 px) and low-memory devices get 1K textures.
 */
export function chooseAssetTier({ screenShortSide, deviceMemoryGB }: DeviceSignals): AssetTier {
  if (screenShortSide < 768) return "mobile";
  if (deviceMemoryGB !== undefined && deviceMemoryGB <= 4) return "mobile";
  return "high";
}

export function readDeviceSignals(): DeviceSignals {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    screenShortSide: Math.min(window.screen.width, window.screen.height),
    ...(nav.deviceMemory !== undefined && { deviceMemoryGB: nav.deviceMemory }),
  };
}
