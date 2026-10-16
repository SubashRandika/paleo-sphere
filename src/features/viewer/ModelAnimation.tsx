"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { AnimationClip, AnimationMixer, LoopRepeat, type Object3D } from "three";
import type { ViewerConfig } from "@/domain/species/viewer-config";
import { useViewerStore } from "./viewer-store";

type Props = {
  root: Object3D;
  clips: AnimationClip[];
  animation: NonNullable<ViewerConfig["animation"]>;
};

/** Longest step per frame: after a pause or a slow frame the clip resumes instead of jumping ahead. */
const MAX_STEP_SECONDS = 0.1;

/**
 * Plays the species' looping clip while the store says `playing`.
 *
 * The canvas renders on demand (Scene.tsx), so nothing moves unless a frame is requested: while
 * playing, each frame advances the clip and requests the next one. Paused or stopped, the GPU is idle
 * again. Pausing keeps the current pose; leaving studio mode stops the clip, and three.js then
 * restores the rest pose that the anatomy markers were placed on.
 */
export function ModelAnimation({ root, clips, animation }: Props) {
  const playing = useViewerStore((s) => s.playing);
  const rest = useViewerStore((s) => s.mode !== "studio");
  const invalidate = useThree((s) => s.invalidate);

  const { mixer, clip } = useMemo(
    () => ({ mixer: new AnimationMixer(root), clip: AnimationClip.findByName(clips, animation.clip) }),
    [root, clips, animation.clip],
  );

  useEffect(() => {
    if (!clip && process.env.NODE_ENV !== "production") {
      console.warn(`Animation clip "${animation.clip}" is not in the model file`);
    }
    // uncacheRoot also forgets the actions, which is why the effects below look the action up
    // (mixer.clipAction) instead of keeping one: React may run this cleanup and then the effects
    // again on the same mixer (Strict Mode does exactly that in development).
    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(root);
    };
  }, [mixer, clip, root, animation.clip]);

  useEffect(() => {
    if (!clip) return;
    const action = mixer.clipAction(clip).setLoop(LoopRepeat, Infinity);
    if (playing) {
      action.paused = false;
      action.play();
    } else if (rest) {
      action.stop();
    } else {
      action.paused = true;
    }
    invalidate();
  }, [mixer, clip, playing, rest, invalidate]);

  useFrame((_, delta) => {
    const action = playing && clip ? mixer.existingAction(clip) : null;
    if (!action) return;
    mixer.update(Math.min(delta, MAX_STEP_SECONDS));
    invalidate();
  });

  return null;
}
