/**
 * Renders look-development comparisons through the dev-only /dev/lookdev page and writes labelled
 * contact sheets to docs/lookdev/img/.
 *
 *   npx next dev -p 3300          (lookdev is disabled in production builds)
 *   node scripts/lookdev.mjs --base http://localhost:3300 [--only textures,tonemapping]
 *
 * Headless Chromium + SwiftShader: the images are true three.js renders, but GPU-specific
 * differences (texture format chosen by the KTX2 transcoder, anisotropy limits) may vary on real GPUs.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const { values: args } = parseArgs({
  options: {
    base: { type: "string", default: "http://localhost:3300" },
    out: { type: "string", default: "docs/lookdev/img" },
    only: { type: "string" },
  },
});

const L = "/lookdev/tyrannosaurus-rex/tyrannosaurus-rex";
// Macro cameras (metres, glTF axes): side of the head/jaw, and the flank above the thigh.
const HEAD_MACRO = "cam=2.3,3.9,4.5,0.25,3.45,4.35";
const FLANK_MACRO = "cam=3.4,2.6,0.6,0.9,2.1,-0.4";

const COMPARISONS = {
  textures: {
    title: "Texture encoding — head macro (2.1 m)",
    cells: [
      ["KTX2 · UASTC normals · 7.9 MB", HEAD_MACRO],
      ["KTX2 · ETC1S normals · 3.5 MB", `${HEAD_MACRO}&model=${L}-high-n-etc1s.glb`],
      ["WebP · 4.0 MB", `${HEAD_MACRO}&model=${L}-high-webp.glb`],
      ["KTX2 4K · 23.5 MB", `${HEAD_MACRO}&model=${L}-ultra.glb`],
    ],
  },
  texturesFlank: {
    title: "Texture encoding — flank macro (2.7 m)",
    cells: [
      ["KTX2 · UASTC normals · 7.9 MB", FLANK_MACRO],
      ["KTX2 · ETC1S normals · 3.5 MB", `${FLANK_MACRO}&model=${L}-high-n-etc1s.glb`],
      ["WebP · 4.0 MB", `${FLANK_MACRO}&model=${L}-high-webp.glb`],
      ["KTX2 4K · 23.5 MB", `${FLANK_MACRO}&model=${L}-ultra.glb`],
    ],
  },
  tonemapping: {
    title: "Tone mapping, default view",
    cells: [
      ["AgX (current)", "tone=agx"],
      ["Khronos PBR Neutral", "tone=neutral"],
      ["ACES Filmic (R3F default)", "tone=aces"],
      ["Neutral · exposure 0.9", "tone=neutral&exposure=0.9"],
    ],
  },
  maps: {
    title: "Texture map contribution, head close-up",
    cells: [
      ["All maps", HEAD_MACRO],
      ["No normal map", `${HEAD_MACRO}&off=normalMap`],
      ["No ambient occlusion", `${HEAD_MACRO}&off=aoMap`],
      ["No roughness map", `${HEAD_MACRO}&off=roughnessMap`],
    ],
  },
  shadows: {
    title: "Key-light shadow map (rendered once) — off vs on",
    cells: [
      ["Default view · shadows off", "shadows=0"],
      ["Default view · shadows on", ""],
      ["Head macro · shadows off", `${HEAD_MACRO}&shadows=0`],
      ["Head macro · shadows on", HEAD_MACRO],
    ],
  },
  refine: {
    title: "Refinement: Neutral tone mapping with stronger key light, default view",
    cells: [
      ["Neutral · env 1 · key 3 · exp 1.15", "tone=neutral"],
      ["Neutral · env 1.2 · key 4.5 · exp 1.15", "tone=neutral&env=1.2&key=4.5"],
      ["Neutral · env 1 · key 5 · exp 1.25", "tone=neutral&key=5&exposure=1.25"],
      ["Neutral · env 1.3 · key 6 · exp 1.1", "tone=neutral&env=1.3&key=6&exposure=1.1"],
    ],
  },
  lighting: {
    title: "Lighting balance, side view",
    cells: [
      ["Current (env 1 · key 3)", "view=side"],
      ["More environment (env 1.6 · key 2)", "view=side&env=1.6&key=2"],
      ["Stronger key (env 0.8 · key 5)", "view=side&env=0.8&key=5"],
      ["Environment only (key 0)", "view=side&key=0"],
    ],
  },
};

const TILE = { width: 960, height: 640 };
const selected = args.only ? args.only.split(",") : Object.keys(COMPARISONS);
await mkdir(args.out, { recursive: true });

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

for (const name of selected) {
  const { title, cells } = COMPARISONS[name];
  const tiles = [];
  for (const [label, query] of cells) {
    const page = await browser.newPage({ viewport: TILE });
    await page.goto(`${args.base}/dev/lookdev?${query}`);
    await page.waitForSelector('[data-viewer-state="ready"]', { timeout: 180_000 });
    await page.waitForTimeout(1500);
    await page.addStyleTag({ content: "p.label, nextjs-portal { display: none !important; }" });
    const png = await page.screenshot();
    await page.close();
    const caption = Buffer.from(
      `<svg width="${TILE.width}" height="44"><rect width="100%" height="100%" fill="#121417"/>` +
        `<text x="16" y="29" font-family="Consolas, monospace" font-size="20" fill="#e6e1d6">${label}</text></svg>`,
    );
    tiles.push(
      await sharp(png)
        .extend({ top: 44, background: "#121417" })
        .composite([{ input: caption, top: 0, left: 0 }])
        .toBuffer(),
    );
    console.log(`${name}: ${label}`);
  }

  const cols = 2;
  const rows = Math.ceil(tiles.length / cols);
  const tileH = TILE.height + 44;
  const file = path.join(args.out, `${name}.jpg`);
  await sharp({
    create: { width: TILE.width * cols, height: tileH * rows, channels: 3, background: "#121417" },
  })
    .composite(
      tiles.map((input, i) => ({ input, left: (i % cols) * TILE.width, top: Math.floor(i / cols) * tileH })),
    )
    .jpeg({ quality: 86 })
    .toFile(file);
  console.log(`→ ${file} (${title})`);
}

await browser.close();
