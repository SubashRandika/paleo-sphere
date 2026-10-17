"""
Orthographic side and top silhouettes of a prepared model, for placing rig bones by eye.

  blender --background --factory-startup --python scripts/blender/profile_render.py -- \
    --input assets-src/stegosaurus/work/stegosaurus-stenops.glb --out-dir .lookdev/profile/stegosaurus

Writes side.png (looking from the animal's left: glTF +z, the head, to the right; +y up) and top.png
(looking down: +z to the right, +x up), with a 0.5 m grid labelled in glTF metres, so a point read
off the image goes straight into scripts/blender/rigs/<slug>.json.
"""

import argparse
import json
import math
import os
import sys

import bpy
from mathutils import Vector

PX_PER_M = 120


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--out-dir", required=True)
    return p.parse_args(argv)


def main():
    args = parse_args()
    out = os.path.abspath(args.out_dir)
    os.makedirs(out, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(args.input))
    scene = bpy.context.scene
    meshes = [o for o in scene.objects if o.type == "MESH"]
    pts = [o.matrix_world @ v.co for o in meshes for v in o.data.vertices]
    lo = Vector(map(min, *pts))
    hi = Vector(map(max, *pts))
    # glTF bounds (x, y, z) = Blender (x, z, -y)
    g_lo = (math.floor(lo.x * 2) / 2 - 0.5, 0.0, math.floor(-hi.y * 2) / 2 - 0.5)
    g_hi = (math.ceil(hi.x * 2) / 2 + 0.5, math.ceil(hi.z * 2) / 2 + 0.5, math.ceil(-lo.y * 2) / 2 + 0.5)

    scene.render.engine = "BLENDER_WORKBENCH"
    scene.display.shading.light = "FLAT"
    scene.display.shading.color_type = "SINGLE"
    scene.display.shading.single_color = (0.55, 0.55, 0.55)
    scene.display.shading.show_xray = True
    scene.display.shading.xray_alpha = 0.6
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    scene.collection.objects.link(cam)
    scene.camera = cam
    cam.data.type = "ORTHO"

    views = {}
    # Side: camera on Blender -X looking +X; image right = Blender -Y = glTF +z; up = glTF +y.
    zw, yh = g_hi[2] - g_lo[2], g_hi[1] - g_lo[1]
    cx, cz = (g_lo[2] + g_hi[2]) / 2, (g_lo[1] + g_hi[1]) / 2
    cam.location = Vector((-50, -cx, cz))
    cam.rotation_euler = (math.radians(90), 0, math.radians(-90))
    cam.data.ortho_scale = max(zw, yh)
    scene.render.resolution_x, scene.render.resolution_y = round(zw * PX_PER_M), round(yh * PX_PER_M)
    cam.data.sensor_fit = "HORIZONTAL" if zw >= yh else "VERTICAL"
    scene.render.filepath = os.path.join(out, "side.png")
    bpy.ops.render.render(write_still=True)
    views["side"] = {"right": "z", "up": "y", "min": [g_lo[2], g_lo[1]], "max": [g_hi[2], g_hi[1]]}

    # Top: camera above looking down; image right = glTF +z (Blender -Y), image up = glTF +x.
    xw = g_hi[0] - g_lo[0]
    cxx = (g_lo[0] + g_hi[0]) / 2
    cam.location = Vector((cxx, -cx, 50))
    cam.rotation_euler = (0, 0, math.radians(-90))
    cam.data.ortho_scale = max(zw, xw)
    cam.data.sensor_fit = "HORIZONTAL" if zw >= xw else "VERTICAL"
    scene.render.resolution_x, scene.render.resolution_y = round(zw * PX_PER_M), round(xw * PX_PER_M)
    scene.render.filepath = os.path.join(out, "top.png")
    bpy.ops.render.render(write_still=True)
    views["top"] = {"right": "z", "up": "x", "min": [g_lo[2], g_lo[0]], "max": [g_hi[2], g_hi[0]]}

    json.dump({"pxPerMetre": PX_PER_M, "views": views}, open(os.path.join(out, "profile.json"), "w"))
    print("PROFILE " + json.dumps(views))


main()
