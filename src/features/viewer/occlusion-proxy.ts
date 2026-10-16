import { BufferAttribute, BufferGeometry, Group, Mesh, SkinnedMesh, Vector3, type Object3D } from "three";

/**
 * A raycast stand-in for models with a skeleton, used to hide anatomy markers behind the body.
 *
 * three.js raycasts a SkinnedMesh by skinning every vertex it tests on the CPU (bone matrices ×
 * weights). With five markers each testing the whole model on every frame of a camera move, anatomy
 * mode dropped to ~350 ms per frame on a laptop. Markers only appear in the rest pose (the clip stops
 * outside studio mode), so the skinned surface can be computed ONCE, when the model loads, and the
 * markers raycast against that copy at the cost of an ordinary mesh.
 *
 * The copy uses the skinned mesh's own getVertexPosition, so it matches the rendered rest pose exactly,
 * whatever bind matrices the exporter wrote. It is never added to the scene, so it is never rendered or
 * uploaded to the GPU; it shares indices and materials with the model, and only the positions are new
 * (12 bytes per vertex). Call while the model is in its rest pose. Returns the model itself when
 * nothing in it is skinned.
 */
export function createOcclusionProxy(model: Object3D): Object3D {
  let skinned = false;
  model.traverse((node) => {
    if (node instanceof SkinnedMesh) skinned = true;
  });
  if (!skinned) return model;

  model.updateWorldMatrix(true, true);
  const proxy = new Group();
  model.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    const stand = new Mesh(
      node instanceof SkinnedMesh ? restPoseGeometry(node) : node.geometry,
      node.material,
    );
    stand.matrixAutoUpdate = false;
    stand.matrix.copy(node.matrixWorld);
    proxy.add(stand);
  });
  proxy.updateMatrixWorld(true);
  return proxy;
}

/** The skinned positions of every vertex in the current pose, in the mesh's local space. */
function restPoseGeometry(mesh: SkinnedMesh): BufferGeometry {
  const source = mesh.geometry;
  const count = source.getAttribute("position").count;
  const positions = new Float32Array(count * 3);
  const v = new Vector3();
  for (let i = 0; i < count; i++) mesh.getVertexPosition(i, v).toArray(positions, i * 3);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setIndex(source.getIndex());
  for (const g of source.groups) geometry.addGroup(g.start, g.count, g.materialIndex);
  geometry.setDrawRange(source.drawRange.start, source.drawRange.count);
  return geometry;
}
