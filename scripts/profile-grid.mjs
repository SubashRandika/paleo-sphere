/**
 * Draws a labelled 0.5 m grid over profile_render.py output, so bone positions can be read off directly.
 *   node scripts/profile-grid.mjs .lookdev/profile/stegosaurus
 * Writes side-grid.png and top-grid.png next to the renders.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = process.argv[2];
const { views } = JSON.parse(await readFile(path.join(dir, "profile.json"), "utf8"));

for (const [name, v] of Object.entries(views)) {
  const src = path.join(dir, `${name}.png`);
  const { width, height } = await sharp(src).metadata();
  const [h0, v0] = v.min;
  const [h1, v1] = v.max;
  const x = (h) => ((h - h0) / (h1 - h0)) * width;
  const y = (u) => height - ((u - v0) / (v1 - v0)) * height;
  const lines = [];
  for (let h = Math.ceil(h0 * 2) / 2; h <= h1 + 1e-6; h += 0.5) {
    const major = Math.abs(h - Math.round(h)) < 1e-6;
    lines.push(
      `<line x1="${x(h)}" y1="0" x2="${x(h)}" y2="${height}" stroke="${major ? "#d0a020" : "#555"}" stroke-width="${major ? 1.4 : 0.8}"/>`,
    );
    if (major)
      lines.push(
        `<text x="${x(h) + 3}" y="${height - 4}" font-size="14" fill="#f0c040">${v.right}=${h}</text>`,
      );
  }
  for (let u = Math.ceil(v0 * 2) / 2; u <= v1 + 1e-6; u += 0.5) {
    const major = Math.abs(u - Math.round(u)) < 1e-6;
    lines.push(
      `<line x1="0" y1="${y(u)}" x2="${width}" y2="${y(u)}" stroke="${major ? "#d0a020" : "#555"}" stroke-width="${major ? 1.4 : 0.8}"/>`,
    );
    if (major) lines.push(`<text x="4" y="${y(u) - 4}" font-size="14" fill="#f0c040">${v.up}=${u}</text>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#111"/>${lines.join("")}</svg>`;
  await sharp(Buffer.from(svg))
    .composite([{ input: src }])
    .png()
    .toFile(path.join(dir, `${name}-grid.png`));
  console.log(`wrote ${name}-grid.png (${width}×${height})`);
}
