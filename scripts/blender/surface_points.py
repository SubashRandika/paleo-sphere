"""
Find points on a prepared model's surface by ray casting — used to place anatomy hotspots.

Usage (via scripts/blender/run.mjs or directly):
  blender --background --factory-startup --python scripts/blender/surface_points.py -- \
    --input assets-src/trex/work/tyrannosaurus-rex.glb \
    --ray jaws:5,3.0,5.4:-1,0,0 --ray hand:5,2.3,3.6:-1,0,0

Each --ray is name:origin:direction in glTF axes (Y up, metres, the same coordinates as the
web viewer). Prints the first surface hit per ray as JSON, in glTF axes, plus the model bounds.

Use `marker` (not `point`) as a hotspot position: it sits --lift metres (default 4 cm) off the surface
along its normal. A marker exactly on the surface hides behind it at random, because the viewer's
occlusion test then compares two equal distances, and the web build's compressed vertex positions
move the surface by millimetres.
"""

import argparse
import json
import sys

import bpy
from mathutils import Vector


def gltf_to_blender(v):
    # glTF is Y-up, Blender is Z-up: (x, y, z)_gltf -> (x, -z, y)_blender
    return Vector((v[0], -v[2], v[1]))


def blender_to_gltf(v):
    return [round(v.x, 3), round(v.z, 3), round(-v.y, 3)]


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--ray", action="append", default=[], help="name:ox,oy,oz:dx,dy,dz")
    p.add_argument("--lift", type=float, default=0.04)
    return p.parse_args(argv)


def main():
    args = parse_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args.input)
    depsgraph = bpy.context.evaluated_depsgraph_get()
    scene = bpy.context.scene

    lo = Vector((1e9, 1e9, 1e9))
    hi = Vector((-1e9, -1e9, -1e9))
    for obj in scene.objects:
        if obj.type != "MESH":
            continue
        for corner in obj.bound_box:
            w = obj.matrix_world @ Vector(corner)
            lo = Vector(map(min, lo, w))
            hi = Vector(map(max, hi, w))

    hits = {}
    for spec in args.ray:
        name, origin, direction = spec.split(":")
        o = gltf_to_blender([float(x) for x in origin.split(",")])
        d = gltf_to_blender([float(x) for x in direction.split(",")]).normalized()
        found, location, normal, _, obj, _ = scene.ray_cast(depsgraph, o, d)
        hits[name] = (
            {
                "point": blender_to_gltf(location),
                "normal": blender_to_gltf(normal),
                "marker": blender_to_gltf(location + normal * args.lift),
                "object": obj.name,
            }
            if found
            else None
        )

    print("SURFACE_POINTS " + json.dumps({"bounds": [blender_to_gltf(lo), blender_to_gltf(hi)], "hits": hits}))


main()
