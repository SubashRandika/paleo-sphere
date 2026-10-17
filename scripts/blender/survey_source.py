"""
First look at a downloaded model: true size and how it looks, before deciding how to prepare it.

  blender --background --factory-startup --python scripts/blender/survey_source.py -- \
    --input assets-src/triceratops/scene.gltf --out-dir .lookdev/survey/triceratops

For rigged models the mesh is evaluated twice: in the rest (bind) pose and at the first frame of
each action, because a bind pose is often a T-pose while the pose shown on Sketchfab comes from the
animation. Bounds are measured on the evaluated (deformed) meshes, in Blender axes (Z up).

Renders <state>-<view>.png (Cycles, low samples, neutral studio light) for orthographic side views
along X and Y, a top view and a 3/4 perspective view, framed from the bounds. Prints SURVEY JSON.
"""

import argparse
import json
import math
import os
import sys

import bpy
from mathutils import Vector


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--out-dir", required=True)
    p.add_argument("--samples", type=int, default=16)
    p.add_argument("--size", default="640x420")
    p.add_argument("--max-actions", type=int, default=3)
    return p.parse_args(argv)


def evaluated_bounds(meshes):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    lo = Vector((math.inf,) * 3)
    hi = Vector((-math.inf,) * 3)
    for o in meshes:
        ev = o.evaluated_get(depsgraph)
        mesh = ev.to_mesh()
        mw = ev.matrix_world
        for v in mesh.vertices:
            w = mw @ v.co
            lo = Vector(map(min, lo, w))
            hi = Vector(map(max, hi, w))
        ev.to_mesh_clear()
    return lo, hi


def look_at(obj, target):
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def setup(scene, args):
    scene.render.engine = "CYCLES"
    scene.cycles.samples = args.samples
    scene.cycles.use_denoising = True
    w, h = (int(n) for n in args.size.split("x"))
    scene.render.resolution_x, scene.render.resolution_y = w, h
    scene.view_settings.view_transform = "Khronos PBR Neutral"
    scene.render.image_settings.file_format = "PNG"
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.35, 0.36, 0.38, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.6
    scene.world = world
    sun_data = bpy.data.lights.new("Sun", "SUN")
    sun_data.energy = 3.5
    sun_data.angle = math.radians(8)
    sun = bpy.data.objects.new("Sun", sun_data)
    sun.rotation_euler = (math.radians(50), math.radians(10), math.radians(-35))
    scene.collection.objects.link(sun)
    cam = bpy.data.objects.new("Camera", bpy.data.cameras.new("Camera"))
    scene.collection.objects.link(cam)
    scene.camera = cam
    return cam, w / h


def frame(cam, aspect, lo, hi, view):
    centre = (lo + hi) / 2
    size = hi - lo
    data = cam.data
    if view == "persp":
        data.type = "PERSP"
        data.angle = math.radians(35)
        radius = size.length / 2
        dist = radius / math.tan(data.angle / 2) * 1.05
        direction = Vector((1, -1, 0.55)).normalized()
        cam.location = centre + direction * dist
        look_at(cam, centre)
        return
    data.type = "ORTHO"
    if view == "sideX":  # looking along -X: shows the Y–Z plane
        cam.location = centre + Vector((size.length * 2, 0, 0))
        extent = (size.y, size.z)
    elif view == "sideY":  # looking along +Y: shows the X–Z plane
        cam.location = centre + Vector((0, -size.length * 2, 0))
        extent = (size.x, size.z)
    else:  # top
        cam.location = centre + Vector((0, 0, size.length * 2))
        extent = (size.x, size.y)
    look_at(cam, centre)
    data.ortho_scale = max(extent[0], extent[1] * aspect) * 1.1


def main():
    args = parse_args()
    out_dir = os.path.abspath(args.out_dir)
    os.makedirs(out_dir, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(args.input))
    scene = bpy.context.scene
    meshes = [o for o in scene.objects if o.type == "MESH"]
    armatures = [o for o in scene.objects if o.type == "ARMATURE"]
    cam, aspect = setup(scene, args)

    states = [("rest", None)]
    actions = list(bpy.data.actions)[: args.max_actions]
    for i, action in enumerate(actions):
        states.append((f"action{i}", action))

    report = {
        "input": args.input,
        "triangles": sum(len(p.vertices) - 2 for o in meshes for p in o.data.polygons),
        "meshes": [o.name for o in meshes],
        "armatures": [{"name": a.name, "bones": len(a.data.bones)} for a in armatures],
        "actions": [{"name": a.name, "frames": [round(f, 1) for f in a.frame_range]} for a in bpy.data.actions],
        "states": {},
    }
    for name, action in states:
        for arm in armatures:
            arm.data.pose_position = "REST" if action is None else "POSE"
            if action is not None:
                arm.animation_data_create()
                arm.animation_data.action = action
                # Blender 5 actions are slotted: bind the action's first slot to this armature.
                if hasattr(arm.animation_data, "action_slot") and len(action.slots):
                    arm.animation_data.action_slot = action.slots[0]
        scene.frame_set(int(action.frame_range[0]) if action else 0)
        bpy.context.view_layer.update()
        lo, hi = evaluated_bounds(meshes)
        size = hi - lo
        report["states"][name] = {
            "sizeBlenderXYZ": [round(v, 3) for v in size],
            "min": [round(v, 3) for v in lo],
            "max": [round(v, 3) for v in hi],
        }
        for view in ("sideX", "sideY", "top", "persp"):
            frame(cam, aspect, lo, hi, view)
            scene.render.filepath = os.path.join(out_dir, f"{name}-{view}.png")
            bpy.ops.render.render(write_still=True)
    print("SURVEY " + json.dumps(report))


main()
