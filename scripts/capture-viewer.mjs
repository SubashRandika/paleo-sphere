/**
 * Captures the species viewer from each camera preset (lookdev review) and, optionally,
 * writes the poster image used as the loading state and no-WebGL fallback.
 *
 *   node scripts/capture-viewer.mjs --url http://localhost:3000/species/tyrannosaurus-rex \
 *     --out .lookdev --poster public/models/tyrannosaurus-rex/tyrannosaurus-rex-poster.webp
 *
 * Runs headless Chromium with SwiftShader (CPU WebGL), so frame timing is meaningless here,
 * but the image is the real three.js render.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromium, devices } from "@playwright/test";
import sharp from "sharp";

const { values: args } = parseArgs({
  options: {
    url: { type: "string" },
    out: { type: "string", default: ".lookdev" },
    poster: { type: "string" },
    mobile: { type: "boolean", default: false },
  },
});
if (!args.url) {
  console.error(
    "Usage: node scripts/capture-viewer.mjs --url <species page> [--out dir] [--poster file.webp] [--mobile]",
  );
  process.exit(1);
}

const SETTLE_MS = 1500; // camera transitions use smoothTime 0.3 s; leave time to come to rest
await mkdir(args.out, { recursive: true });

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const context = await browser.newContext(
  args.mobile ? devices["Pixel 7"] : { viewport: { width: 1440, height: 900 } },
);
const page = await context.newPage();
const started = Date.now();
await page.goto(args.url);
await page.waitForSelector('[data-viewer-state="ready"]', { timeout: 120_000 });
console.log(`viewer ready in ${Date.now() - started} ms (SwiftShader)`);
await page.waitForTimeout(SETTLE_MS);

const prefix = args.mobile ? "mobile" : "desktop";
await page.screenshot({ path: path.join(args.out, `${prefix}-default.png`) });

const presetButtons = page.getByRole("toolbar", { name: "Camera" }).getByRole("button", { name: / view$/ });
for (const button of await presetButtons.all()) {
  const label = (await button.getAttribute("aria-label")).replace(/ view$/, "").toLowerCase();
  await button.click();
  await page.waitForTimeout(SETTLE_MS);
  await page.screenshot({ path: path.join(args.out, `${prefix}-${label}.png`) });
}

if (args.poster) {
  await page.getByRole("button", { name: "Reset view" }).click();
  await page.waitForTimeout(SETTLE_MS);
  // Transparent poster: hide UI and the CSS backdrop so only the rendered model and floor remain.
  await page.addStyleTag({
    content: `figure[data-viewer-state] { background: transparent !important; }
              figure[data-viewer-state] > :not(div) , [role="toolbar"], #viewer-help { visibility: hidden !important; }`,
  });
  await page.waitForTimeout(300);
  const png = await page.locator("figure[data-viewer-state]").screenshot({ omitBackground: true });
  await mkdir(path.dirname(args.poster), { recursive: true });
  const info = await sharp(png).webp({ quality: 80, alphaQuality: 90 }).toFile(args.poster);
  console.log(`poster: ${args.poster} (${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
}

await browser.close();
