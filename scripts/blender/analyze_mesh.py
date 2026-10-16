"""
Mesh health and anatomy survey for rigging a prepared model.

Usage:
  blender --background --factory-startup --python scripts/blender/analyze_mesh.py -- \
    --input assets-src/trex/work/tyrannosaurus-rex.glb

Prints one JSON line (prefix MESH_REPORT) with, per mesh:
  - vertex/triangle counts, separate parts (islands), non-manifold and boundary edge counts
    — automatic skinning ("bone heat") tends to fail on non-manifold meshes and many islands
And for the largest mesh, in glTF axes (Y up, Z forward):
  - body slices along Z: centroid and vertical extent → where the spine, neck and tail run
  - limb slices along Y below `--belly`: left/right centroids → leg and arm centrelines
"""

import argparse
import json
import sys
from collections import defaultdict

import bmesh
import bpy


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--zstep", type=float, default=0.5)
    p.add_argument("--ystep", type=float, default=0.25)
    p.add_argument("--weld", type=float, default=0.0, help="merge vertices closer than this (m) first")
    return p.parse_args(argv)


def gltf(v):
    # Blender (x, y, z) Z-up → glTF (x, z, -y) Y-up
    return (v.x, v.z, -v.y)


def islands(bm):
    seen, count = set(), 0
    for v in bm.verts:
        if v.index in seen:
            continue
        count += 1
        stack = [v]
        while stack:
            cur = stack.pop()
            if cur.index in seen:
                continue
            seen.add(cur.index)
            stack.extend(e.other_vert(cur) for e in cur.link_edges if e.other_vert(cur).index not in seen)
    return count


def main():
    args = parse_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args.input)

    report = {"meshes": []}
    largest = None
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        bm.transform(obj.matrix_world)
        if args.weld > 0:
            # glTF splits vertices along UV seams; weld them to see the true topology.
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=args.weld)
        bm.verts.ensure_lookup_table()
        bm.verts.index_update()
        info = {
            "name": obj.name,
            "verts": len(bm.verts),
            "tris": sum(len(f.verts) - 2 for f in bm.faces),
            "islands": islands(bm),
            "nonManifoldEdges": sum(1 for e in bm.edges if not e.is_manifold),
            "boundaryEdges": sum(1 for e in bm.edges if e.is_boundary),
        }
        report["meshes"].append(info)
        pts = [gltf(v.co) for v in bm.verts]
        if largest is None or len(pts) > len(largest[1]):
            largest = (obj.name, pts)
        bm.free()

    _, pts = largest
    zs = defaultdict(list)
    for p in pts:
        zs[round(p[2] / args.zstep) * args.zstep].append(p)
    report["bodySlices"] = [
        {
            "z": round(z, 2),
            "n": len(ps),
            "cx": round(sum(p[0] for p in ps) / len(ps), 3),
            "cy": round(sum(p[1] for p in ps) / len(ps), 3),
            "ymin": round(min(p[1] for p in ps), 3),
            "ymax": round(max(p[1] for p in ps), 3),
            "halfWidth": round(max(abs(p[0]) for p in ps), 3),
        }
        for z, ps in sorted(zs.items())
    ]

    # Limbs: per height, vertices left/right of the midline, grouped by Z clusters 0.5 m wide.
    limbs = []
    ys = defaultdict(list)
    for p in pts:
        ys[round(p[1] / args.ystep) * args.ystep].append(p)
    for y, ps in sorted(ys.items()):
        row = {"y": round(y, 2)}
        for side, sel in (("right", lambda p: p[0] > 0.12), ("left", lambda p: p[0] < -0.12)):
            sp = [p for p in ps if sel(p)]
            if not sp:
                continue
            clusters = defaultdict(list)
            for p in sp:
                clusters[round(p[2] * 2) / 2].append(p)
            row[side] = [
                {
                    "z": z,
                    "n": len(c),
                    "cx": round(sum(p[0] for p in c) / len(c), 3),
                    "cz": round(sum(p[2] for p in c) / len(c), 3),
                }
                for z, c in sorted(clusters.items())
                if len(c) >= 15
            ]
        limbs.append(row)
    report["limbSlices"] = limbs
    print("MESH_REPORT " + json.dumps(report))


main()
