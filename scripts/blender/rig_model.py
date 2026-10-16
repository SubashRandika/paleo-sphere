"""
Rig a prepared (static) model from a JSON skeleton spec and bind it with automatic weights.

Usage:
  blender --background --factory-startup --python scripts/blender/rig_model.py -- \
    --input assets-src/trex/work/tyrannosaurus-rex.glb \
    --rig scripts/blender/rigs/tyrannosaurus-rex.json \
    --output assets-src/trex/work/tyrannosaurus-rex-rigged.blend

Steps:
  1. Import the GLB; weld vertices split along UV seams (glTF stores them split), so
     "bone heat" sees one watertight surface instead of hundreds of patches.
  2. Build the armature from the spec (glTF axes → Blender axes; `.R` bones mirrored to `.L`).
  3. Parent deforming meshes with automatic weights; parent `rigid` meshes (eyes) to one bone.
  4. Repair: islands bone heat left unweighted (teeth, claws) copy the weights of the
     nearest weighted surface, uniformly across the island (rigid teeth).
     Limit to 4 influences per vertex (three.js skinning supports four) and normalise.
Prints RIG_REPORT JSON: bone count, unweighted vertices before/after repair, per-bone vertex counts.
"""

import argparse
import json
import sys

import bmesh
import bpy
from mathutils import Vector
from mathutils.kdtree import KDTree


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--rig", required=True)
    p.add_argument("--output", required=True)
    return p.parse_args(argv)


def to_blender(v):
    # glTF (x, y, z) Y-up → Blender (x, -z, y) Z-up
    return Vector((v[0], -v[2], v[1]))


def expand_mirrors(bones):
    out = []
    for b in bones:
        out.append(b)
        if b["name"].endswith(".R"):
            m = dict(b)
            m["name"] = b["name"][:-2] + ".L"
            m["head"] = [-b["head"][0], b["head"][1], b["head"][2]]
            m["tail"] = [-b["tail"][0], b["tail"][1], b["tail"][2]]
            if b.get("parent", "").endswith(".R"):
                m["parent"] = b["parent"][:-2] + ".L"
            out.append(m)
    return out


def gltf_co(o, v):
    w = o.matrix_world @ v.co
    return w.x, w.z, -w.y


def in_box(p, box):
    x, y, z = p
    return all(
        (box.get(f"{axis}Min", -1e9) <= val <= box.get(f"{axis}Max", 1e9))
        for axis, val in (("x", x), ("y", y), ("z", z))
    )


def clean_region(o, region):
    """Remove listed bones' influence from vertices inside a box (glTF axes), e.g. arm weights in the head."""
    groups = [o.vertex_groups[b] for b in region["removeBones"] if b in o.vertex_groups]
    ids = [v.index for v in o.data.vertices if in_box(gltf_co(o, v), region["box"])]
    for g in groups:
        g.remove(ids)


def islands_of(mesh):
    parent = list(range(len(mesh.vertices)))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    for e in mesh.edges:
        a, b = find(e.vertices[0]), find(e.vertices[1])
        if a != b:
            parent[a] = b
    groups = {}
    for i in range(len(mesh.vertices)):
        groups.setdefault(find(i), []).append(i)
    return sorted(groups.values(), key=len, reverse=True)


def split_jaw(o, cfg):
    """
    Divide head/jaw weight along the open mouth instead of trusting bone heat, which bleeds
    across a gaping mouth. The gape is a polyline of (z, y) points between the tooth rows.
    Skin blends over `blend` metres either side of the line (no tearing at the lips); separate
    pieces (teeth) go wholly to one side by their centroid. Near the hinge the split fades in.
    """
    upper = o.vertex_groups[cfg["upper"]]
    lower = o.vertex_groups[cfg["lower"]]
    gape = cfg["gape"]
    blend = cfg.get("blend", 0.05)
    z0, fade = cfg["zMin"], cfg.get("fade", 0.3)

    def gape_y(z):
        if z <= gape[0][0]:
            return gape[0][1]
        for (za, ya), (zb, yb) in zip(gape, gape[1:]):
            if za <= z <= zb:
                return ya + (yb - ya) * (z - za) / (zb - za)
        return gape[-1][1]

    def weight(v, g):
        for vg in v.groups:
            if vg.group == g.index:
                return vg.weight
        return 0.0

    def jaw_fraction(y, z):
        d = y - gape_y(z)
        return min(1.0, max(0.0, 0.5 - d / (2 * blend)))

    verts = o.data.vertices
    main, *pieces = islands_of(o.data)
    rigid = {}
    for piece in pieces:
        pts = [gltf_co(o, verts[i]) for i in piece]
        cx, cy, cz = (sum(p[k] for p in pts) / len(pts) for k in range(3))
        if cz < z0:
            continue
        # A tooth points away from its own jaw: upper teeth hang down, lower teeth point up.
        tip = max(pts, key=lambda p: (p[0] - cx) ** 2 + (p[1] - cy) ** 2 + (p[2] - cz) ** 2)
        reach = ((tip[0] - cx) ** 2 + (tip[1] - cy) ** 2 + (tip[2] - cz) ** 2) ** 0.5
        dy = tip[1] - cy
        if reach > 0 and abs(dy) > 0.6 * reach:
            lower_piece = dy > 0
        else:
            lower_piece = cy < gape_y(cz)  # not clearly vertical (tongue, gum flap): use the gape line
        for i in piece:
            rigid[i] = 1.0 if lower_piece else 0.0

    for v in verts:
        x, y, z = gltf_co(o, v)
        if z < z0:
            continue
        mass = weight(v, upper) + weight(v, lower)
        if mass < 0.3:
            continue  # neck or throat: leave bone heat's weights
        t = rigid.get(v.index, jaw_fraction(y, z))
        if v.index not in rigid:
            k = min(1.0, (z - z0) / fade)  # fade the split in behind the mouth corner
            t = k * t + (1 - k) * (weight(v, lower) / mass)
        upper.add([v.index], mass * (1 - t), "REPLACE")
        lower.add([v.index], mass * t, "REPLACE")


def main():
    args = parse_args()
    spec = json.load(open(args.rig, encoding="utf8"))
    bones = expand_mirrors(spec["bones"])

    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args.input)
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]

    for obj in meshes:
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=spec.get("weld", 0.0005))
        bm.to_mesh(obj.data)
        bm.free()
        obj.data.update()

    # Armature
    arm_data = bpy.data.armatures.new("Skeleton")
    arm = bpy.data.objects.new("Skeleton", arm_data)
    bpy.context.scene.collection.objects.link(arm)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")
    for b in bones:
        eb = arm_data.edit_bones.new(b["name"])
        eb.head = to_blender(b["head"])
        eb.tail = to_blender(b["tail"])
        eb.use_deform = b.get("deform", True)
    for b in bones:
        if "parent" in b:
            eb = arm_data.edit_bones[b["name"]]
            eb.parent = arm_data.edit_bones[b["parent"]]
            eb.use_connect = b.get("connect", False)
    bpy.ops.object.mode_set(mode="OBJECT")

    rigid = spec.get("rigid", {})
    deforming = [o for o in meshes if o.name not in rigid]

    # Automatic weights for deforming meshes.
    bpy.ops.object.select_all(action="DESELECT")
    for o in deforming:
        o.select_set(True)
    arm.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.parent_set(type="ARMATURE_AUTO")

    # Rigid meshes follow one bone entirely.
    for name, bone in rigid.items():
        o = bpy.data.objects[name]
        bpy.ops.object.select_all(action="DESELECT")
        o.select_set(True)
        arm.select_set(True)
        bpy.context.view_layer.objects.active = arm
        bpy.ops.object.parent_set(type="ARMATURE_NAME")
        vg = o.vertex_groups.get(bone) or o.vertex_groups.new(name=bone)
        vg.add(list(range(len(o.data.vertices))), 1.0, "REPLACE")

    report = {"bones": len(arm_data.bones), "meshes": {}}
    for o in deforming:
        # Strip implausible influences first (e.g. arm bones in the head); the repair below refills them.
        for region in spec.get("cleanRegions", []):
            clean_region(o, region)
        unweighted = {v.index for v in o.data.vertices if sum(g.weight for g in v.groups) < 1e-4}
        before = len(unweighted)
        repaired = {}
        names = {g.index: g.name for g in o.vertex_groups}

        # Bone heat skips separate pieces sitting inside the skin (teeth, claws). Give each such
        # island the averaged weights of the nearest weighted surface — the gum or toe it sits
        # in — and apply them to the whole island, so a tooth moves rigidly with its own jaw.
        weighted = [v for v in o.data.vertices if v.index not in unweighted]
        tree = KDTree(len(weighted))
        for i, v in enumerate(weighted):
            tree.insert(v.co, i)
        tree.balance()

        neighbours = {i: [] for i in unweighted}
        for e in o.data.edges:
            a, b = e.vertices
            if a in unweighted and b in unweighted:
                neighbours[a].append(b)
                neighbours[b].append(a)
        seen = set()
        for start in unweighted:
            if start in seen:
                continue
            island, stack = [], [start]
            while stack:
                i = stack.pop()
                if i in seen:
                    continue
                seen.add(i)
                island.append(i)
                stack.extend(neighbours[i])
            totals = {}
            for i in island:
                _, j, _ = tree.find(o.data.vertices[i].co)
                for g in weighted[j].groups:
                    totals[g.group] = totals.get(g.group, 0.0) + g.weight
            top = sorted(totals.items(), key=lambda kv: -kv[1])[:4]
            norm = sum(w for _, w in top) or 1.0
            for group, w in top:
                o.vertex_groups[group].add(island, w / norm, "REPLACE")
            main = names[top[0][0]] if top else "?"
            repaired[main] = repaired.get(main, 0) + len(island)

        if "jawSplit" in spec:
            split_jaw(o, spec["jawSplit"])

        bpy.ops.object.select_all(action="DESELECT")
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.vertex_group_limit_total(group_select_mode="ALL", limit=4)
        bpy.ops.object.vertex_group_normalize_all(group_select_mode="ALL", lock_active=False)

        counts = {}
        for v in o.data.vertices:
            for g in v.groups:
                if g.weight > 0.2:
                    n = o.vertex_groups[g.group].name
                    counts[n] = counts.get(n, 0) + 1
        after = sum(1 for v in o.data.vertices if sum(g.weight for g in v.groups) < 1e-4)
        report["meshes"][o.name] = {
            "verts": len(o.data.vertices),
            "unweightedBeforeRepair": before,
            "unweightedAfter": after,
            "repairedPerBone": dict(sorted(repaired.items())),
            "vertsPerBone": dict(sorted(counts.items())),
        }

    bpy.ops.wm.save_as_mainfile(filepath=args.output)
    print("RIG_REPORT " + json.dumps(report))


main()
