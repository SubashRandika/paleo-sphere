"""
Prepare a downloaded dinosaur model for the web pipeline (run headless in Blender 5.1).

    blender --background --factory-startup --python scripts/blender/prepare_model.py -- \
        --input  assets-src/trex/tyrant_king_-_tyrannosaurus/scene.gltf \
        --output assets-src/trex/work/tyrannosaurus-rex.glb \
        --length 12.0

What it does, in order:
  1. Imports the source glTF into an empty scene (no default cube/camera/light).
     Rigged models: the pose is frozen into the meshes (--pose), then the rig is dropped. A bind pose
     is often a T-pose; the pose shown on Sketchfab usually comes from an animation frame. The
     importer's bone display shapes (an "Icosphere") are removed, they are not part of the model.
     --rotate turns the whole model (world axes, Blender Z up) when the source is lying on its side
     or faces along the wrong axis. --keep-materials drops every mesh whose material does not match
     (e.g. a scene backdrop and ground shipped with the animal). --join merges all meshes into one
     object (a model split into dozens of pieces), and --decimate <ratio> reduces dense meshes with
     Blender's collapse decimation, which keeps UVs — done before rigging, so the rig is fitted to
     the mesh that ships. --merge-distance <units> welds coincident vertices first (source units):
     some exports are "triangle soup", every triangle with its own vertices, which no simplifier can
     reduce cleanly. UVs live on face corners in Blender, so seams survive the weld.
  2. Un-parents every mesh while keeping its world transform, then deletes helper empties.
     Sketchfab exports nest meshes under several empties (FBX cm→m scale, Z-up→Y-up rotations).
  3. Applies all transforms, so vertex positions are final and every object has an identity matrix.
  4. Centres the model on X/Y and puts its lowest point on the ground (Z = 0 in Blender).
  5. Uniformly scales it so its length along Blender's Y axis (glTF/three Z) equals --length metres.
  6. Exports a GLB (+Y up). Blender converts legacy spec-gloss materials to metallic-roughness on
     import, so the exported file no longer needs KHR_materials_pbrSpecularGlossiness.

Prints a JSON report on the last line prefixed with "REPORT ".
"""

import argparse
import json
import re
import sys

import math

import bmesh
import bpy
from mathutils import Matrix, Vector


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--length", type=float, required=True, help="Target body length in metres (head to tail)")
    p.add_argument("--blend", help="Optional path to save the prepared .blend for inspection")
    p.add_argument(
        "--pose",
        default="current",
        help="Rigged models: rest (bind pose), frame:N (an animation frame), or current (as imported)",
    )
    p.add_argument(
        "--keep-materials",
        default="",
        help="Regex: keep only meshes with a material whose name matches (drops scenery shipped with a model)",
    )
    p.add_argument("--join", action="store_true", help="Merge all meshes into one object")
    p.add_argument("--merge-distance", type=float, default=None, help="Weld vertices closer than this (source units)")
    p.add_argument("--decimate", type=float, default=None, help="Collapse-decimate to this triangle ratio")
    p.add_argument(
        "--rotate",
        default="",
        help="Comma-separated axis:degrees in Blender world axes, applied in order, e.g. y:-90,z:180",
    )
    return p.parse_args(argv)


def world_bounds(objects):
    corners = [o.matrix_world @ Vector(c) for o in objects for c in o.bound_box]
    lo = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
    hi = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
    return lo, hi


def select_only(objects):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]


def main():
    args = parse_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args.input)
    scene = bpy.context.scene

    # 1b. Rigged models: drop bone display shapes, freeze the chosen pose, then the rig can go.
    armatures = [o for o in scene.objects if o.type == "ARMATURE"]
    shapes = {pb.custom_shape for a in armatures for pb in a.pose.bones if pb.custom_shape}
    for o in shapes:
        bpy.data.objects.remove(o, do_unlink=True)
    if armatures:
        if args.pose == "rest":
            for a in armatures:
                a.data.pose_position = "REST"
        elif args.pose.startswith("frame:"):
            scene.frame_set(int(args.pose.split(":")[1]))
        bpy.context.view_layer.update()
        for o in [o for o in scene.objects if o.type == "MESH"]:
            for md in [m for m in o.modifiers if m.type == "ARMATURE"]:
                select_only([o])
                bpy.ops.object.modifier_apply(modifier=md.name)

    meshes = [o for o in scene.objects if o.type == "MESH"]
    if args.keep_materials:
        keep = re.compile(args.keep_materials)
        dropped = [o for o in meshes if not any(s.material and keep.search(s.material.name) for s in o.material_slots)]
        for o in dropped:
            bpy.data.objects.remove(o, do_unlink=True)
        meshes = [o for o in scene.objects if o.type == "MESH"]
    if not meshes:
        raise SystemExit("No meshes found in input")

    # 2. Flatten hierarchy, keeping world-space placement.
    for o in meshes:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
    for o in [o for o in bpy.context.scene.objects if o.type != "MESH"]:
        bpy.data.objects.remove(o, do_unlink=True)

    # 3. Bake transforms into the vertices (after any requested rotation about the world origin).
    for spec in [r for r in args.rotate.split(",") if r]:
        axis, degrees = spec.split(":")
        turn = Matrix.Rotation(math.radians(float(degrees)), 4, axis.upper())
        for o in meshes:
            o.matrix_world = turn @ o.matrix_world
    select_only(meshes)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    # 3b. Optional merge and simplification.
    if args.join and len(meshes) > 1:
        select_only(meshes)
        bpy.ops.object.join()
        meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if args.merge_distance:
        for o in meshes:
            bm = bmesh.new()
            bm.from_mesh(o.data)
            before = len(bm.verts)
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=args.merge_distance)
            print(f"WELD {o.name}: {before} -> {len(bm.verts)} vertices")
            bm.to_mesh(o.data)
            bm.free()
    if args.decimate:
        for o in meshes:
            mod = o.modifiers.new("Decimate", "DECIMATE")
            mod.ratio = args.decimate
            select_only([o])
            bpy.ops.object.modifier_apply(modifier=mod.name)

    # 4. Centre on X/Y, feet on the ground.
    lo, hi = world_bounds(meshes)
    offset = Vector((-(lo.x + hi.x) / 2, -(lo.y + hi.y) / 2, -lo.z))
    for o in meshes:
        o.location += offset
    select_only(meshes)
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)

    # 5. Scale to the target length. Length is along Blender Y (= glTF Z, the facing axis).
    lo, hi = world_bounds(meshes)
    source_size = hi - lo
    if source_size.y < max(source_size.x, source_size.z):
        raise SystemExit(f"Expected the body length along Y, got size {tuple(source_size)}")
    factor = args.length / source_size.y
    for o in meshes:
        o.scale = (factor, factor, factor)
    select_only(meshes)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    lo, hi = world_bounds(meshes)
    size = hi - lo

    if args.blend:
        bpy.ops.wm.save_as_mainfile(filepath=args.blend)

    # 6. Export.
    select_only(meshes)
    bpy.ops.export_scene.gltf(
        filepath=args.output,
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_apply=True,
    )

    report = {
        "pose": args.pose if armatures else None,
        "rotate": args.rotate or None,
        "meshes": [{"name": o.name, "triangles": sum(len(p.vertices) - 2 for p in o.data.polygons)} for o in meshes],
        "materials": sorted({s.material.name for o in meshes for s in o.material_slots if s.material}),
        "sourceSizeMetres": [round(v, 3) for v in source_size],
        "scaleFactor": round(factor, 4),
        # Report in glTF axes: x = width, y = height, z = length.
        "finalSizeGltf": {"width": round(size.x, 3), "height": round(size.z, 3), "length": round(size.y, 3)},
        "groundY": round(lo.z, 4),
    }
    print("REPORT " + json.dumps(report))


main()
