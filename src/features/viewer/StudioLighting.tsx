"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { DirectionalLight } from "three";
import type { RenderSettings } from "./render-settings";
import { useViewerStore } from "./viewer-store";

type Props = Pick<RenderSettings, "environmentIntensity" | "keyLightIntensity" | "shadows">;

/**
 * Studio mode lighting: a "lit specimen in a dark hall".
 *
 * Image-based lighting (IBL): <Environment> renders the Lightformers (emissive panels) into a
 * small cube map ONCE (frames={1}). Every PBR material then samples that map for diffuse fill and
 * reflections — that is what makes skin read as a surface instead of flat plastic.
 * No HDRI download is needed; the panels are art-directable.
 *
 * The key light casts a real shadow (self-shadowing on the body and a cast shadow on the floor).
 * The specimen and the lights never move, so the shadow map is rendered ONCE when the model is
 * ready (shadow.autoUpdate = false) — orbiting the camera costs only the shadow lookup in the shader.
 * Only while an animation plays is the shadow map re-rendered every frame, and once more when it stops.
 * Phase 4 lookdev showed self-shadowing was the largest gap against the Cycles reference.
 */
export function StudioLighting({ environmentIntensity, keyLightIntensity, shadows }: Props) {
  return (
    <>
      <Environment resolution={256} frames={1} environmentIntensity={environmentIntensity}>
        {/* Overhead softbox — broad top light, like a gallery ceiling fixture. */}
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 10, 0]}
          rotation-x={Math.PI / 2}
          scale={[18, 18, 1]}
        />
        {/* Key panel, front-left. */}
        <Lightformer
          form="rect"
          intensity={3.2}
          position={[-10, 5, 8]}
          scale={[10, 5, 1]}
          target={[0, 2, 0]}
        />
        {/* Rim panel, behind-right — separates the silhouette from the dark background. */}
        <Lightformer
          form="rect"
          intensity={2.6}
          position={[10, 4, -9]}
          scale={[8, 4, 1]}
          target={[0, 2, 0]}
        />
      </Environment>
      <KeyLight intensity={keyLightIntensity} castShadow={shadows} />
      {shadows && <ShadowCatcher />}
    </>
  );
}

function KeyLight({ intensity, castShadow }: { intensity: number; castShadow: boolean }) {
  const light = useRef<DirectionalLight>(null);
  const ready = useViewerStore((s) => s.status === "ready");
  const playing = useViewerStore((s) => s.playing);
  const mode = useViewerStore((s) => s.mode);
  const invalidate = useThree((s) => s.invalidate);

  // Render the shadow map on mount (so it exists before any shadow-receiving material samples it —
  // otherwise WebGL reports a texture/sampler mismatch), once more when the model is ready, and
  // after the pose stops changing (pause, or the rest pose on leaving studio mode).
  useEffect(() => {
    if (!light.current) return;
    light.current.shadow.needsUpdate = true;
    invalidate();
  }, [ready, playing, mode, invalidate]);

  useFrame(() => {
    if (playing && light.current) light.current.shadow.needsUpdate = true;
  });

  return (
    <directionalLight
      ref={light}
      position={[-8, 14, 10]}
      intensity={intensity}
      castShadow={castShadow}
      shadow-autoUpdate={false}
      shadow-mapSize={[2048, 2048]}
      // Orthographic shadow frustum fitted around a ~12 m animal; tighter bounds = sharper shadows.
      shadow-camera-left={-9}
      shadow-camera-right={9}
      shadow-camera-top={9}
      shadow-camera-bottom={-9}
      shadow-camera-near={1}
      shadow-camera-far={40}
      // normalBias offsets along the surface normal: prevents "shadow acne" on bumpy, normal-mapped skin.
      shadow-bias={-0.0002}
      shadow-normalBias={0.03}
      shadow-radius={3}
    />
  );
}

/** Invisible floor that only shows where shadows fall; layered over the floor light pool. */
function ShadowCatcher() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.001} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <shadowMaterial transparent opacity={0.45} depthWrite={false} />
    </mesh>
  );
}
