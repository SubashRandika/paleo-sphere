/**
 * Quick survey of a downloaded source model before preparation: world-space bounds (after node
 * transforms), triangle and vertex counts, materials and their texture slots and sizes, skins and
 * animations. Use it to decide the length axis, scale and what preparation is needed.
 *
 *   node scripts/inspect-source.mjs assets-src/triceratops/scene.gltf [more.gltf ...]
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { getBounds } from "@gltf-transform/functions";
import sharp from "sharp";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

for (const file of process.argv.slice(2)) {
  const doc = await io.read(file);
  const root = doc.getRoot();
  const scene = root.getDefaultScene() ?? root.listScenes()[0];
  const { min, max } = getBounds(scene);
  const size = max.map((v, i) => +(v - min[i]).toFixed(3));

  let triangles = 0;
  let vertices = 0;
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const count = prim.getAttribute("POSITION")?.getCount() ?? 0;
      vertices += count;
      triangles += (prim.getIndices()?.getCount() ?? count) / 3;
    }
  }

  const materials = [];
  for (const m of root.listMaterials()) {
    const slots = [];
    for (const [slot, tex] of [
      ["base", m.getBaseColorTexture()],
      ["normal", m.getNormalTexture()],
      ["metalRough", m.getMetallicRoughnessTexture()],
      ["occlusion", m.getOcclusionTexture()],
      ["emissive", m.getEmissiveTexture()],
    ]) {
      if (!tex) continue;
      const meta = await sharp(Buffer.from(tex.getImage())).metadata();
      slots.push(`${slot} ${meta.width}×${meta.height}`);
    }
    materials.push({
      name: m.getName(),
      alpha: m.getAlphaMode(),
      doubleSided: m.getDoubleSided(),
      metallic: m.getMetallicFactor(),
      roughness: m.getRoughnessFactor(),
      extensions: m.listExtensions().map((e) => e.extensionName),
      slots,
    });
  }

  console.log(
    JSON.stringify(
      {
        file,
        sizeXYZ: size,
        min: min.map((v) => +v.toFixed(3)),
        max: max.map((v) => +v.toFixed(3)),
        triangles,
        vertices,
        meshes: root.listMeshes().length,
        nodes: root.listNodes().length,
        skins: root.listSkins().map((s) => `${s.getName() || "skin"} (${s.listJoints().length} joints)`),
        animations: root.listAnimations().map((a) => {
          const times = a.listSamplers().map((s) => s.getInput()?.getMax([])[0] ?? 0);
          return `${a.getName() || "anim"} ${Math.max(0, ...times).toFixed(2)} s, ${a.listChannels().length} channels`;
        }),
        extensionsUsed: root.listExtensionsUsed().map((e) => e.extensionName),
        materials,
      },
      null,
      1,
    ),
  );
}
