"""
Print a side-view map of which bone dominates each region of a rigged mesh (debug aid).

  blender --background --factory-startup --python scripts/blender/weight_map.py -- \
    --input assets-src/trex/work/tyrannosaurus-rex-rigged.blend --zmin 3.5 --zmax 6.1 --ymin 2.2 --ymax 4.3 --step 0.1

Axes are glTF (y up, +z forward). Each cell shows the first letter(s) of the bone holding most
weight across the vertices in that cell (legend printed below); "." = no vertices.
`--side` restricts to x >= 0 (right) or x <= 0 (left) to avoid mixing both halves.
"""

import argparse
import sys
from collections import Counter, defaultdict

import bpy


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    for k, d in (("zmin", -6.0), ("zmax", 6.0), ("ymin", 0.0), ("ymax", 4.3), ("step", 0.25)):
        p.add_argument(f"--{k}", type=float, default=d)
    p.add_argument("--side", choices=["right", "left", "both"], default="right")
    p.add_argument("--xmin", type=float, default=None, help="only vertices with |x| >= this (outer surface)")
    return p.parse_args(argv)


def main():
    a = parse_args()
    bpy.ops.wm.open_mainfile(filepath=a.input)
    obj = max((o for o in bpy.context.scene.objects if o.type == "MESH"), key=lambda o: len(o.data.vertices))
    names = {g.index: g.name for g in obj.vertex_groups}
    cells = defaultdict(Counter)
    for v in obj.data.vertices:
        w = obj.matrix_world @ v.co
        x, y, z = w.x, w.z, -w.y
        if a.side == "right" and x < 0 or a.side == "left" and x > 0:
            continue
        if a.xmin is not None and abs(x) < a.xmin:
            continue
        if not (a.zmin <= z <= a.zmax and a.ymin <= y <= a.ymax) or not v.groups:
            continue
        g = max(v.groups, key=lambda g: g.weight)
        cells[(round((y - a.ymin) / a.step), round((z - a.zmin) / a.step))][names[g.group]] += 1

    used = sorted({n for c in cells.values() for n in c})
    code = {}
    for n in used:
        base = n[:2].upper() if n.endswith((".L", ".R")) else n[0].upper()
        k = base
        i = 1
        while k in code.values():
            k = base[:1] + str(i)
            i += 1
        code[n] = k
    rows = round((a.ymax - a.ymin) / a.step)
    cols = round((a.zmax - a.zmin) / a.step)
    print("WEIGHT_MAP  (rows: y from top; columns: z from left)")
    for r in range(rows, -1, -1):
        line = f"{a.ymin + r * a.step:5.2f} "
        for c in range(cols + 1):
            cell = cells.get((r, c))
            line += code[cell.most_common(1)[0][0]].ljust(2) if cell else ". "
        print(line)
    print("z: " + " ".join(f"{a.zmin + c * a.step:.1f}" for c in range(0, cols + 1, 5)) + " (every 5 columns)")
    print("legend: " + ", ".join(f"{v}={k}" for k, v in code.items()))


main()
