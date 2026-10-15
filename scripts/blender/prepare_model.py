"""
Prepare a downloaded dinosaur model for the web pipeline (run headless in Blender 5.1).

    blender --background --factory-startup --python scripts/blender/prepare_model.py -- \
        --input  assets-src/trex/tyrant_king_-_tyrannosaurus/scene.gltf \
        --output assets-src/trex/work/tyrannosaurus-rex.glb \
        --length 12.0

What it does, in order:
  1. Imports the source glTF into an empty scene (no default cube/camera/light).
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
import sys

import bpy
from mathutils import Vector


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--length", type=float, required=True, help="Target body length in metres (head to tail)")
    p.add_argument("--blend", help="Optional path to save the prepared .blend for inspection")
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

    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not meshes:
        raise SystemExit("No meshes found in input")

    # 2. Flatten hierarchy, keeping world-space placement.
    for o in meshes:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
    for o in [o for o in bpy.context.scene.objects if o.type != "MESH"]:
        bpy.data.objects.remove(o, do_unlink=True)

    # 3. Bake transforms into the vertices.
    select_only(meshes)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

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
