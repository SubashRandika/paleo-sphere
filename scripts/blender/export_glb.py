"""
Export a .blend (e.g. a rigged and animated model) to GLB for the web pipeline.

  blender --background --factory-startup --python scripts/blender/export_glb.py -- \
    --input assets-src/trex/work/tyrannosaurus-rex-rigged.blend --output assets-src/trex/work/tyrannosaurus-rex-rigged.glb

Skins and animations are kept; the armature's rest pose is exported as the bind pose.
Prints EXPORT_REPORT JSON with the number of joints, animations and meshes.
"""

import argparse
import json
import os
import sys

import bpy


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    return p.parse_args(argv)


def main():
    args = parse_args()
    output = os.path.abspath(args.output)
    bpy.ops.wm.open_mainfile(filepath=os.path.abspath(args.input))
    arm = next((o for o in bpy.context.scene.objects if o.type == "ARMATURE"), None)
    if arm:
        # Export from the rest pose; animations carry the motion.
        for pb in arm.pose.bones:
            pb.rotation_mode = "XYZ"
            pb.rotation_euler = (0, 0, 0)
            pb.scale = (1, 1, 1)
            pb.location = (0, 0, 0)
    bpy.ops.export_scene.gltf(
        filepath=output,
        export_format="GLB",
        export_skins=True,
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_influence_nb=4,
        export_yup=True,
    )
    print(
        "EXPORT_REPORT "
        + json.dumps(
            {
                "output": output,
                "joints": len(arm.data.bones) if arm else 0,
                "actions": [a.name for a in bpy.data.actions],
                "meshes": [o.name for o in bpy.context.scene.objects if o.type == "MESH"],
            }
        )
    )


main()
