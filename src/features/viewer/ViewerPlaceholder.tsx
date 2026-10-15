/**
 * Reserves the viewer's space in the layout until the 3D canvas exists (Phase 3).
 * It will become the poster/fallback state: shown while loading and when WebGL is unavailable.
 */
export function ViewerPlaceholder({ modelDescription }: { modelDescription: string }) {
  return (
    <figure
      className="relative flex min-h-[55svh] items-center justify-center overflow-hidden lg:min-h-0"
      style={{
        background: "radial-gradient(ellipse 60% 55% at 50% 58%, var(--stage-glow), transparent 70%)",
      }}
    >
      <p className="label">3D model in preparation</p>
      <figcaption className="sr-only">{modelDescription}</figcaption>
    </figure>
  );
}
