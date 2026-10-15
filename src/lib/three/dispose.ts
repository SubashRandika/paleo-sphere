import type { Material, Object3D, Texture } from "three";

/**
 * Frees the GPU memory held by an object tree: geometries, materials, and their textures.
 *
 * Why this is needed: R3F disposes objects it creates from JSX, but a loaded glTF is rendered
 * with <primitive>, which R3F does not own. Removing it from the scene only drops the JS
 * reference — the vertex buffers and textures stay on the GPU until dispose() is called.
 * Returns counts so callers and tests can verify the cleanup.
 */
export function disposeObject(root: Object3D) {
  const geometries = new Set<{ dispose(): void }>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((node) => {
    const mesh = node as Object3D & { geometry?: { dispose(): void }; material?: Material | Material[] };
    if (mesh.geometry) geometries.add(mesh.geometry);
    if (!mesh.material) return;
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value && (value as Texture).isTexture) textures.add(value as Texture);
      }
    }
  });

  geometries.forEach((g) => g.dispose());
  textures.forEach((t) => t.dispose());
  materials.forEach((m) => m.dispose());

  return { geometries: geometries.size, materials: materials.size, textures: textures.size };
}
