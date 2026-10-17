"""
Keyframe a looping idle clip onto a rigged .blend from a motion spec.

  blender --background --factory-startup --python scripts/blender/animate_idle.py -- \
    --input assets-src/trex/work/tyrannosaurus-rex-rigged.blend \
    --spec scripts/blender/rigs/tyrannosaurus-rex-idle.json \
    --output assets-src/trex/work/tyrannosaurus-rex-animated.blend

Rotations are bone-local XYZ degrees by default. With "axes": "armature" in the spec, yaw turns about
the body's vertical axis and pitch about its side-to-side axis, whatever way each bone points (a head
angled steeply down would otherwise roll as it turns); same signs: +yaw toward the animal's left,
−pitch raises. The jaw block is optional.

Every frame is keyed from closed-form curves (eased keys, breath envelope, travelling tail wave), so
the first and last frames match and the clip loops without a seam. The glTF exporter samples the
action per frame anyway; keying densely here means Blender and three.js play exactly the same motion.
Prints ANIM_REPORT JSON.
"""

import argparse
import json
import math
import os
import sys

import bpy
from mathutils import Matrix


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--spec", required=True)
    p.add_argument("--output", required=True)
    return p.parse_args(argv)


def ease(a, b, u):
    """Cosine ease from a to b: zero velocity at both keys, so holds and turns blend smoothly."""
    return a + (b - a) * (0.5 - 0.5 * math.cos(math.pi * u))


def sample_keys(keys, t):
    """Keys are [time, v1, v2, ...]; returns the eased values at t."""
    for k0, k1 in zip(keys, keys[1:]):
        if k0[0] <= t <= k1[0]:
            u = (t - k0[0]) / (k1[0] - k0[0]) if k1[0] > k0[0] else 0.0
            return [ease(a, b, u) for a, b in zip(k0[1:], k1[1:])]
    return list(keys[-1][1:])


def breath(breaths, t):
    """Lung fill 0..1: eased inhale, hold, eased exhale, then rest until the next breath."""
    for b in breaths:
        t0 = b["start"]
        t1 = t0 + b["inhale"]
        t2 = t1 + b["hold"]
        t3 = t2 + b["exhale"]
        if t0 <= t < t1:
            return ease(0, 1, (t - t0) / b["inhale"])
        if t1 <= t < t2:
            return 1.0
        if t2 <= t < t3:
            return ease(1, 0, (t - t2) / b["exhale"])
    return 0.0


def pose_at(spec, t):
    """bone -> {"rot": [x, y, z] degrees, "scale": [x, y, z]} at time t."""
    out = {}

    def rot(bone):
        return out.setdefault(bone, {}).setdefault("rot", [0.0, 0.0, 0.0])

    b = breath(spec["breaths"], t)
    br = spec["breathing"]
    s = [1 + a * b for a in br["scale"]]
    out.setdefault(br["bone"], {})["scale"] = s
    out.setdefault(br["compensate"], {})["scale"] = [1 / v for v in s]
    rot("head")[0] += br["headPitch"] * b

    yaw, pitch = sample_keys(spec["look"]["keys"], t)
    for bone, w in spec["look"]["weights"].items():
        r = rot(bone)
        r[0] += pitch * w
        r[2] += yaw * w

    if "jaw" in spec:
        (jaw,) = sample_keys(spec["jaw"]["keys"], t)
        rot(spec["jaw"]["bone"])[0] += jaw

    tail = spec["tail"]
    phase = 2 * math.pi * t / spec["duration"]
    for i, (bone, amp) in enumerate(zip(tail["bones"], tail["yaw"])):
        r = rot(bone)
        r[2] += amp * math.sin(phase - tail["lag"] * i)
        r[0] += tail["pitch"] * math.sin(2 * phase - tail["lag"] * i)
    return out


def main():
    args = parse_args()
    spec = json.load(open(args.spec, encoding="utf8"))
    output = os.path.abspath(args.output)
    bpy.ops.wm.open_mainfile(filepath=os.path.abspath(args.input))
    scene = bpy.context.scene
    arm = next(o for o in scene.objects if o.type == "ARMATURE")

    fps = spec["fps"]
    last = round(spec["duration"] * fps)
    scene.render.fps = fps
    scene.render.fps_base = 1
    scene.frame_start, scene.frame_end = 0, last

    arm.animation_data_clear()
    animated = sorted({bone for f in range(last + 1) for bone in pose_at(spec, f / fps)})
    armature_axes = spec.get("axes", "local") == "armature"
    for pb in arm.pose.bones:
        pb.rotation_mode = "QUATERNION" if armature_axes else "XYZ"

    def local_rotation(pb, rot):
        # Pitch about the armature's X (side to side), then yaw about its Z (up), re-expressed in the
        # bone's rest frame: R_local = M⁻¹ · R_armature · M.
        m = pb.bone.matrix_local.to_3x3()
        world = Matrix.Rotation(math.radians(rot[2]), 3, "Z") @ Matrix.Rotation(math.radians(rot[0]), 3, "X")
        return (m.inverted() @ world @ m).to_quaternion()

    for f in range(last + 1):
        # The last frame is sampled at t = duration, which equals t = 0: the loop closes exactly.
        pose = pose_at(spec, (f % last) / fps)
        for bone in animated:
            pb = arm.pose.bones[bone]
            t = pose.get(bone, {})
            rot = t.get("rot", (0, 0, 0))
            if armature_axes:
                pb.rotation_quaternion = local_rotation(pb, rot)
                pb.keyframe_insert("rotation_quaternion", frame=f)
            else:
                pb.rotation_euler = [math.radians(a) for a in rot]
                pb.keyframe_insert("rotation_euler", frame=f)
            pb.scale = t.get("scale", (1, 1, 1))
            if "scale" in t:
                pb.keyframe_insert("scale", frame=f)

    action = arm.animation_data.action
    action.name = spec["name"]
    action.use_fake_user = True
    action.use_frame_range = True
    action.frame_range = (0, last)
    bpy.ops.wm.save_as_mainfile(filepath=output)

    peaks = {}
    for f in range(last + 1):
        for bone, t in pose_at(spec, f / fps).items():
            r = t.get("rot", (0, 0, 0))
            peaks[bone] = max(peaks.get(bone, 0.0), max(abs(a) for a in r))
    print(
        "ANIM_REPORT "
        + json.dumps(
            {
                "output": output,
                "action": action.name,
                "frames": last + 1,
                "fps": fps,
                "bones": animated,
                "peakDegrees": {k: round(v, 2) for k, v in sorted(peaks.items())},
            }
        )
    )


main()
