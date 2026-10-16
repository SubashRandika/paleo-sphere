"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useImperativeHandle, useMemo, type Ref } from "react";
import { Mesh, SkinnedMesh, type Material, type Object3D, type Texture } from "three";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { disposeObject } from "@/lib/three/dispose";
import { getKTX2Loader } from "@/lib/three/ktx2";
import { ModelAnimation } from "./ModelAnimation";
import { createOcclusionProxy } from "./occlusion-proxy";
import type { MapSlot } from "./render-settings";
import { useViewerStore } from "./viewer-store";

/** Our assets use Meshopt, not Draco; `false` stops Drei pointing a decoder at a third-party CDN. */
const USE_DRACO = false;
const USE_MESHOPT = true;

/** Scenes whose GPU resources are scheduled for disposal; a quick remount cancels it. */
const pendingDisposals = new Map<Object3D, ReturnType<typeof setTimeout>>();

type Props = {
  url: string;
  /** Lookdev only: switch off texture maps to see what each contributes. */
  disabledMaps?: MapSlot[];
  /** What anatomy markers raycast against to hide behind the body (see occlusion-proxy.ts). */
  occluder?: Ref<Object3D>;
  /** The looping clip to offer, when the model file has one. */
  animation?: ViewerConfig["animation"];
};

/**
 * Loads a species GLB and owns its GPU lifetime.
 *
 * useGLTF suspends until the file is downloaded and parsed, so the nearest <Suspense> shows
 * the loading state. The asset is already life-size, centred, and standing on y = 0
 * (scripts/blender/prepare_model.py), so no runtime centring is needed.
 */
export function SpeciesModel({ url, disabledMaps, occluder, animation }: Props) {
  const gl = useThree((s) => s.gl);
  const { scene, animations } = useGLTF(url, USE_DRACO, USE_MESHOPT, (loader) => {
    // KTX2 textures (KHR_texture_basisu). Drei's GLTFLoader comes from three-stdlib, whose
    // types expect its own KTX2Loader; three's loader has the same runtime interface.
    loader.setKTX2Loader(getKTX2Loader(gl) as unknown as Parameters<typeof loader.setKTX2Loader>[0]);
  });
  const camera = useThree((s) => s.camera);
  const rootScene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const setStatus = useViewerStore((s) => s.setStatus);
  // Built on load, while the model is still in its rest pose.
  const proxy = useMemo(() => createOcclusionProxy(scene), [scene]);
  useImperativeHandle(occluder, () => proxy, [proxy]);

  useEffect(() => {
    let cancelled = false;
    const pending = pendingDisposals.get(scene);
    if (pending !== undefined) {
      clearTimeout(pending);
      pendingDisposals.delete(scene);
    }
    // Anisotropic filtering keeps scale texture sharp on surfaces seen at grazing angles
    // (the flanks and tail from a low camera). 8× is a good quality/cost balance.
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    const textures = new Set<Texture>();
    scene.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      // Self-shadowing: arms shade the chest, the body shades the legs (rendered once, see StudioLighting).
      node.castShadow = true;
      node.receiveShadow = true;
      // three culls with a bounding sphere computed once, in whatever pose the mesh had then. An
      // animated mesh moves outside it, so it could vanish at the frame edge; there is only one model
      // in view, so skipping the test costs nothing.
      if (node instanceof SkinnedMesh) node.frustumCulled = false;
      const material = node.material as Material & Record<string, unknown>;
      for (const slot of disabledMaps ?? []) {
        if (material[slot]) {
          material[slot] = null;
          material.needsUpdate = true;
        }
      }
      for (const value of Object.values(material)) {
        if (value && (value as Texture).isTexture) {
          (value as Texture).anisotropy = anisotropy;
          textures.add(value as Texture);
        }
      }
    });

    // Warm up the GPU before declaring "ready". three.js otherwise compiles shaders and uploads
    // textures during the first frame that needs them — a visible stall on the visitor's first drag.
    // compileAsync uses KHR_parallel_shader_compile where available, so the main thread stays free.
    void (async () => {
      try {
        // targetScene = the real scene root, so shaders are built with its lights and environment map.
        await gl.compileAsync(scene, camera, rootScene);
        if (cancelled) return;
        textures.forEach((t) => gl.initTexture(t));
      } finally {
        if (!cancelled) {
          setStatus("ready");
          invalidate();
        }
      }
    })();

    return () => {
      cancelled = true;
      // Back to "loading" for the next model, but never over "error": when a render error unmounts
      // this model, the boundary has already reported it and the visitor needs the retry message.
      if (useViewerStore.getState().status !== "error") setStatus("loading");
      // Free GPU memory when the species changes or the viewer unmounts — but on the next tick.
      // React Strict Mode (development) simulates unmount + remount synchronously; disposing
      // immediately would destroy a model that is about to be shown again. A remount of the same
      // scene cancels the pending disposal (see top of this effect).
      pendingDisposals.set(
        scene,
        setTimeout(() => {
          pendingDisposals.delete(scene);
          disposeObject(scene);
          useGLTF.clear(url);
        }, 0),
      );
    };
  }, [scene, rootScene, gl, camera, invalidate, setStatus, url, disabledMaps]);

  return (
    <>
      <primitive object={scene} />
      {animation && <ModelAnimation root={scene} clips={animations} animation={animation} />}
    </>
  );
}
