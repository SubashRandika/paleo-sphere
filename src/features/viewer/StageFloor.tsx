"use client";

import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

/**
 * A faint pool of light on the ground under the specimen.
 *
 * On a dark backdrop a contact shadow alone is invisible, so the animal appears to float.
 * A soft radial disc gives the floor a perspective footprint for the shadow to sit on —
 * the same trick as a spotlight pool in a museum hall. Unlit (meshBasicMaterial) and
 * a single 256 px texture: effectively free to render.
 */
export function StageFloor({ radius = 13 }: { radius?: number }) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(230, 225, 214, 0.16)");
    gradient.addColorStop(0.55, "rgba(230, 225, 214, 0.06)");
    gradient.addColorStop(1, "rgba(230, 225, 214, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0} renderOrder={-1}>
      <circleGeometry args={[radius, 64]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
