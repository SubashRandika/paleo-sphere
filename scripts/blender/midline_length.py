"""
Body length along the midline (snout → neck → back → tail tip), for posed models whose neck or tail
curves. A straight bounding box under-measures a curved body; published lengths follow the backbone.

  blender --background --factory-startup --python scripts/blender/midline_length.py -- \
    --input assets-src/mamenchisaurus/scene.gltf --frame 120 \
    --chain "Bip001 Head_7,Bip001 Neck9_8,...,Bip001 Pelvis_63,Bip001 Tail_58,...,Bip001 Tail9_49" \
    --target 22

The chain lists bones from the head to the tail tip; their heads (plus the last bone's tail) form the
midline. The ends are extended to the mesh's extreme points along the length axis (Blender Y), so the
snout and the last bit of tail count. Prints MIDLINE JSON with the box length, the midline length and,
with --target, the box length to pass to prepare_model.py --length so the midline equals the target.
"""

import argparse
import json
import sys

import bpy


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--frame", type=int, default=None)
    p.add_argument("--chain", required=True)
    p.add_argument("--target", type=float, default=None)
    return p.parse_args(argv)


def main():
    args = parse_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args.input)
    scene = bpy.context.scene
    if args.frame is not None:
        scene.frame_set(args.frame)
    bpy.context.view_layer.update()
    arm = next(o for o in scene.objects if o.type == "ARMATURE")
    shapes = {pb.custom_shape for pb in arm.pose.bones if pb.custom_shape}
    meshes = [o for o in scene.objects if o.type == "MESH" and o not in shapes]

    depsgraph = bpy.context.evaluated_depsgraph_get()
    verts = []
    for o in meshes:
        ev = o.evaluated_get(depsgraph)
        m = ev.to_mesh()
        verts += [ev.matrix_world @ v.co for v in m.vertices]
        ev.to_mesh_clear()
    front = min(verts, key=lambda v: v.y)
    back = max(verts, key=lambda v: v.y)

    bones = [arm.pose.bones[n.strip()] for n in args.chain.split(",")]
    points = [arm.matrix_world @ b.head for b in bones] + [arm.matrix_world @ bones[-1].tail]
    if points[0].y > points[-1].y:
        points.reverse()
    points = [front] + points + [back]
    midline = sum((points[i + 1] - points[i]).length for i in range(len(points) - 1))
    box = back.y - front.y
    report = {"boxLength": round(box, 3), "midlineLength": round(midline, 3), "ratio": round(midline / box, 4)}
    if args.target:
        report["prepareLength"] = round(args.target * box / midline, 3)
    print("MIDLINE " + json.dumps(report))


main()
