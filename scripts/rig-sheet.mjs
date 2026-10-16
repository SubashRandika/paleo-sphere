/**
 * Lays out pose_test.py renders as a labelled grid (rows = poses, columns = views).
 *   node scripts/rig-sheet.mjs --dir .lookdev/rig --poses rest,neckTurn --views threeQuarter,head --out docs/lookdev/img/rig.jpg
 */
import { parseArgs } from "node:util";
import path from "node:path";
import sharp from "sharp";

const { values } = parseArgs({
  options: {
    dir: { type: "string", default: ".lookdev/rig" },
    poses: { type: "string" },
    views: { type: "string" },
    out: { type: "string" },
    width: { type: "string", default: "520" },
  },
});
const poses = values.poses.split(",");
const views = values.views.split(",");
const cell = Number(values.width);
const label = 34;

const meta = await sharp(path.join(values.dir, `${poses[0]}-${views[0]}.png`)).metadata();
const cellH = Math.round((cell * meta.height) / meta.width);
const W = views.length * cell;
const H = poses.length * (cellH + label);

const composites = [];
for (const [r, pose] of poses.entries()) {
  const y = r * (cellH + label);
  const text = `<svg width="${W}" height="${label}"><rect width="100%" height="100%" fill="#1e2227"/><text x="12" y="23" font-family="monospace" font-size="16" fill="#e6e1d6">${pose}</text></svg>`;
  composites.push({ input: Buffer.from(text), left: 0, top: y });
  for (const [c, view] of views.entries()) {
    const img = await sharp(path.join(values.dir, `${pose}-${view}.png`))
      .resize(cell, cellH)
      .flatten({ background: "#121417" })
      .toBuffer();
    composites.push({ input: img, left: c * cell, top: y + label });
  }
}
await sharp({ create: { width: W, height: H, channels: 3, background: "#121417" } })
  .composite(composites)
  .jpeg({ quality: 84 })
  .toFile(values.out);
console.log("wrote", values.out);
