"""
Render test poses of a rigged .blend to judge skinning quality before animating.

Usage:
  blender --background --factory-startup --python scripts/blender/pose_test.py -- \
    --input assets-src/trex/work/tyrannosaurus-rex-rigged.blend --out-dir .lookdev/rig \
    --poses scripts/blender/rigs/tyrannosaurus-rex-poses.json

The poses file maps pose name → { bone: {"rot": [x, y, z] degrees (bone-local XYZ euler), "scale": [x, y, z]} }
and lists views (camera/target in glTF axes, like the web presets). One PNG per pose × view.
With --frames 0,105,300 the file's poses are ignored and the .blend's own animation is rendered at
those frames instead (one PNG per frame × view), e.g. to check an idle clip from animate_idle.py.
Lighting follows reference_render.py (studio softbox, key, rim, sun; shadow-catcher floor).
"""

import argparse
import json
import math
import os
import sys

import bpy
from mathutils import Euler, Vector


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--out-dir", required=True)
    p.add_argument("--poses", required=True)
    p.add_argument("--samples", type=int, default=32)
    p.add_argument("--size", default="800x520")
    p.add_argument("--frames", default="", help="Comma-separated frames of the existing animation")
    return p.parse_args(argv)


def to_blender(v):
    return Vector((v[0], -v[2], v[1]))


def area_light(scene, name, location, size, energy, target):
    data = bpy.data.lights.new(name, "AREA")
    data.shape = "RECTANGLE"
    data.size, data.size_y = size
    data.energy = energy
    obj = bpy.data.objects.new(name, data)
    obj.location = location
    obj.rotation_euler = (target - location).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(obj)


def setup_stage(scene, args):
    bpy.ops.mesh.primitive_plane_add(size=60)
    bpy.context.active_object.is_shadow_catcher = True
    scene.render.film_transparent = True
    centre = Vector((0, 0, 2))
    area_light(scene, "Softbox", Vector((0, 0, 10)), (18, 18), 2500, Vector((0, 0, 0)))
    area_light(scene, "Key", to_blender([-10, 5, 8]), (10, 5), 3000, centre)
    area_light(scene, "Rim", to_blender([10, 4, -9]), (8, 4), 2200, centre)
    sun_data = bpy.data.lights.new("Sun", "SUN")
    sun_data.energy = 3.0
    sun = bpy.data.objects.new("Sun", sun_data)
    sun.rotation_euler = (Vector((0, 0, 0)) - to_blender([-8, 14, 10])).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(sun)
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.006, 0.0065, 0.008, 1)
    scene.world = world

    cam_data = bpy.data.cameras.new("Camera")
    cam_data.sensor_fit = "VERTICAL"
    cam_data.angle_y = math.radians(35)
    cam = bpy.data.objects.new("Camera", cam_data)
    scene.collection.objects.link(cam)
    scene.camera = cam

    width, height = (int(n) for n in args.size.split("x"))
    scene.render.engine = "CYCLES"
    scene.cycles.samples = args.samples
    scene.cycles.use_denoising = True
    scene.render.resolution_x, scene.render.resolution_y = width, height
    scene.view_settings.view_transform = "Khronos PBR Neutral"
    scene.render.image_settings.file_format = "PNG"
    return cam


def apply_pose(arm, pose):
    for pb in arm.pose.bones:
        pb.rotation_mode = "XYZ"
        pb.rotation_euler = Euler((0, 0, 0))
        pb.scale = (1, 1, 1)
        pb.location = (0, 0, 0)
    for bone, t in pose.items():
        pb = arm.pose.bones[bone]
        if "rot" in t:
            pb.rotation_euler = Euler([math.radians(a) for a in t["rot"]])
        if "scale" in t:
            pb.scale = t["scale"]


def main():
    args = parse_args()
    spec = json.load(open(args.poses, encoding="utf8"))
    # Resolve before opening the .blend: afterwards Blender resolves relative paths from the drive root.
    out_dir = os.path.abspath(args.out_dir)
    bpy.ops.wm.open_mainfile(filepath=os.path.abspath(args.input))
    scene = bpy.context.scene
    arm = next(o for o in scene.objects if o.type == "ARMATURE")
    cam = setup_stage(scene, args)
    os.makedirs(out_dir, exist_ok=True)

    if args.frames:
        shots = [(f"frame{int(f):03d}", int(f)) for f in args.frames.split(",")]
    else:
        shots = list(spec["poses"].items())
    for pose_name, pose in shots:
        if isinstance(pose, int):
            scene.frame_set(pose)
        else:
            apply_pose(arm, pose)
        bpy.context.view_layer.update()
        for view_name, view in spec["views"].items():
            cam.location = to_blender(view["position"])
            cam.rotation_euler = (to_blender(view["target"]) - cam.location).to_track_quat("-Z", "Y").to_euler()
            scene.render.filepath = os.path.join(out_dir, f"{pose_name}-{view_name}.png")
            bpy.ops.render.render(write_still=True)
            print("POSE_RENDERED " + scene.render.filepath)


main()
