"""
Ground-truth reference render of a prepared model in Blender Cycles (headless).

    blender --background --factory-startup --python scripts/blender/reference_render.py -- \
        --input assets-src/trex/work/tyrannosaurus-rex.glb --output docs/lookdev/img/cycles-default.png \
        --camera 12.5,4.6,11 --target 0,2.9,0.4

Camera/target are in glTF axes (y up), matching the web viewer's presets; they are converted to
Blender's z-up axes here. The lighting approximates the web studio (overhead softbox, key panel
front-left, rim panel back-right, key sun) so the comparison isolates *renderer* differences:
path-traced global illumination and soft shadows vs. real-time IBL + contact shadow.

If Cycles looks much better → improve the web renderer. If Cycles also looks flat → the asset is the limit.
"""

import argparse
import math
import sys

import bpy
from mathutils import Vector


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--camera", required=True, help="x,y,z in glTF axes")
    p.add_argument("--target", required=True, help="x,y,z in glTF axes")
    p.add_argument("--samples", type=int, default=96)
    p.add_argument("--size", default="960x640")
    return p.parse_args(argv)


def gltf_to_blender(v):
    x, y, z = (float(c) for c in v.split(","))
    return Vector((x, -z, y))


def area_light(name, location, size, energy, target):
    data = bpy.data.lights.new(name, "AREA")
    data.shape = "RECTANGLE"
    data.size, data.size_y = size
    data.energy = energy
    obj = bpy.data.objects.new(name, data)
    obj.location = location
    direction = target - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.collection.objects.link(obj)


def main():
    args = parse_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args.input)
    scene = bpy.context.scene

    # Shadow-catcher ground with a transparent film: only the model and the shadows it casts are
    # rendered, so the comparison is not skewed by how brightly the floor itself is lit.
    bpy.ops.mesh.primitive_plane_add(size=60)
    floor = bpy.context.active_object
    floor.is_shadow_catcher = True
    scene.render.film_transparent = True

    centre = Vector((0, 0, 2))
    area_light("Softbox", Vector((0, 0, 10)), (18, 18), 2500, Vector((0, 0, 0)))
    area_light("Key", gltf_to_blender("-10,5,8"), (10, 5), 3000, centre)
    area_light("Rim", gltf_to_blender("10,4,-9"), (8, 4), 2200, centre)
    sun_data = bpy.data.lights.new("Sun", "SUN")
    sun_data.energy = 3.0
    sun_data.angle = math.radians(3)
    sun = bpy.data.objects.new("Sun", sun_data)
    sun.rotation_euler = (Vector((0, 0, 0)) - gltf_to_blender("-8,14,10")).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(sun)

    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.006, 0.0065, 0.008, 1)
    scene.world = world

    cam_data = bpy.data.cameras.new("Camera")
    cam_data.sensor_fit = "VERTICAL"
    cam_data.angle_y = math.radians(35)  # matches the web camera's vertical FOV
    cam = bpy.data.objects.new("Camera", cam_data)
    cam.location = gltf_to_blender(args.camera)
    cam.rotation_euler = (gltf_to_blender(args.target) - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(cam)
    scene.camera = cam

    width, height = (int(n) for n in args.size.split("x"))
    scene.render.engine = "CYCLES"
    scene.cycles.samples = args.samples
    scene.cycles.use_denoising = True
    scene.render.resolution_x, scene.render.resolution_y = width, height
    scene.view_settings.view_transform = "Khronos PBR Neutral"
    scene.view_settings.exposure = math.log2(1.15)
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = args.output
    bpy.ops.render.render(write_still=True)
    print("REPORT rendered " + args.output)


main()
