type Vec3 = [number, number, number];
export type CameraView = { position: Vec3; target: Vec3 };

/** Camera presets in species files are authored for this stage aspect (desktop, ~1056 × 844). */
export const REFERENCE_ASPECT = 1.25;
const MAX_PULLBACK = 2.5;

/**
 * Adapts an authored camera view to the actual stage shape.
 *
 * Vertical field of view is fixed, so a narrower stage (portrait phone) sees less horizontally:
 * a 12 m animal framed for desktop gets cropped. Moving the camera away from its target by
 * referenceAspect / aspect restores the same horizontal coverage. Wider stages keep the authored view.
 */
export function fitView(view: CameraView, aspect: number, referenceAspect = REFERENCE_ASPECT): CameraView {
  if (!(aspect > 0)) return view;
  const pullback = Math.min(MAX_PULLBACK, Math.max(1, referenceAspect / aspect));
  if (pullback === 1) return view;
  const [px, py, pz] = view.position;
  const [tx, ty, tz] = view.target;
  return {
    position: [tx + (px - tx) * pullback, ty + (py - ty) * pullback, tz + (pz - tz) * pullback],
    target: view.target,
  };
}
