import { describe, expect, it } from "vitest";
import {
  Bone,
  BoxGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { createOcclusionProxy } from "./occlusion-proxy";

/** A 1 m box skinned to one bone, with the bone moved after binding: skinned ≠ raw geometry. */
function skinnedModel() {
  const geometry = new BoxGeometry(1, 1, 1);
  const count = geometry.getAttribute("position").count;
  geometry.setAttribute("skinIndex", new Uint16BufferAttribute(new Array(count * 4).fill(0), 4));
  geometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(
      Array.from({ length: count * 4 }, (_, i) => (i % 4 === 0 ? 1 : 0)),
      4,
    ),
  );
  const root = new Group();
  const bone = new Bone();
  const mesh = new SkinnedMesh(geometry, new MeshBasicMaterial());
  mesh.position.set(0, 0.5, 0);
  root.add(bone, mesh);
  root.updateMatrixWorld(true);
  mesh.bind(new Skeleton([bone]));
  // Pose: the bone carries the box 3 m along x.
  bone.position.set(3, 0, 0);
  root.updateMatrixWorld(true);
  return root;
}

function hits(target: import("three").Object3D, origin: Vector3) {
  const raycaster = new Raycaster(origin, new Vector3(0, 0, -1));
  return raycaster.intersectObject(target, true).map((h) => +h.distance.toFixed(4));
}

describe("createOcclusionProxy", () => {
  it("returns an unskinned model unchanged", () => {
    const model = new Group().add(new Mesh(new BoxGeometry(), new MeshBasicMaterial()));
    expect(createOcclusionProxy(model)).toBe(model);
  });

  it("is hit exactly where three.js's own skinned raycast hits", () => {
    const model = skinnedModel();
    const proxy = createOcclusionProxy(model);
    for (const origin of [new Vector3(3, 0.5, 5), new Vector3(3.4, 0.9, 5), new Vector3(0, 0.5, 5)]) {
      expect(hits(proxy, origin)).toEqual(hits(model, origin));
    }
    // The box was moved by its bone, so a ray through its unskinned position misses both.
    expect(hits(proxy, new Vector3(0, 0.5, 5))).toEqual([]);
    expect(hits(proxy, new Vector3(3, 0.5, 5))).not.toEqual([]);
  });

  it("shares materials and indices with the model instead of copying them", () => {
    const model = skinnedModel();
    const skinned = model.children[1] as SkinnedMesh;
    const stand = createOcclusionProxy(model).children[0] as Mesh;
    expect(stand.material).toBe(skinned.material);
    expect(stand.geometry.getIndex()).toBe(skinned.geometry.getIndex());
  });
});
