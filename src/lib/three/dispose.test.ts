import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Texture } from "three";
import { describe, expect, it, vi } from "vitest";
import { disposeObject } from "./dispose";

describe("disposeObject", () => {
  it("disposes each shared geometry, material, and texture exactly once", () => {
    const geometry = new BoxGeometry();
    const map = new Texture();
    const normalMap = new Texture();
    const material = new MeshStandardMaterial({ map, normalMap });

    const root = new Group();
    root.add(new Mesh(geometry, material), new Mesh(geometry, material));

    const spies = [geometry, map, normalMap, material].map((o) => vi.spyOn(o, "dispose"));

    expect(disposeObject(root)).toEqual({ geometries: 1, materials: 1, textures: 2 });
    spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
  });

  it("handles meshes with multiple materials", () => {
    const a = new MeshStandardMaterial();
    const b = new MeshStandardMaterial();
    const root = new Mesh(new BoxGeometry(), [a, b]);
    expect(disposeObject(root).materials).toBe(2);
  });
});
