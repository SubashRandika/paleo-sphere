/**
 * Asset pipeline: prepared GLB (from scripts/blender/prepare_model.py) → web deliverables.
 *
 *   npm run asset:build -- --input assets-src/trex/work/tyrannosaurus-rex.glb --slug tyrannosaurus-rex
 *
 * Writes public/models/<slug>/<slug>-high.glb and <slug>-mobile.glb (KTX2 textures).
 * Lookdev comparisons:  --textures webp  and/or  --variants ultra  --out-dir public/lookdev
 *
 * Steps (see docs/architecture.md §4):
 *  - Drop KHR_materials_specular / KHR_materials_ior. They add a full-size texture and force
 *    MeshPhysicalMaterial; skin is a dielectric, so three's default F0 (0.04) is a sound baseline.
 *  - dedup / prune / weld: remove duplicate and unused data, merge identical vertices.
 *  - Textures, resized to the variant's maximum:
 *      ktx2 (default): base colour / occlusion / roughness → KTX2 ETC1S: stays compressed in GPU
 *                      memory (~4–8× less than RGBA), mipmaps pre-built with a Lanczos filter.
 *                      Normal maps → WebP by default (see textureSteps for the comparison).
 *      webp:           everything WebP; smaller downloads only, decoded to raw RGBA on the GPU.
 *  - Meshopt: quantise and compress geometry (EXT_meshopt_compression).
 *
 * KTX2 needs KTX-Software (`ktx` on PATH, or KTX_SOFTWARE_BIN pointing at its bin directory).
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { Mode, toktx } from "@gltf-transform/cli";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, textureCompress, weld } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import sharp from "sharp";

const VARIANTS = {
  ultra: 4096, // lookdev only: is 4K visibly better at close range?
  high: 2048,
  mobile: 1024,
};

const DROPPED_EXTENSIONS = new Set(["KHR_materials_specular", "KHR_materials_ior"]);
const NORMAL = /^normalTexture$/;
const NOT_NORMAL = /^(?!normalTexture$)/;

const { values: args } = parseArgs({
  options: {
    input: { type: "string" },
    slug: { type: "string" },
    "out-dir": { type: "string", default: "public/models" },
    textures: { type: "string", default: "ktx2" },
    variants: { type: "string", default: "high,mobile" },
    // Normal-map codec for ktx2 builds (webp | uastc | etc1s) and an optional filename tag for lookdev.
    normal: { type: "string", default: "webp" },
    tag: { type: "string", default: "" },
  },
});
const variants = args.variants.split(",").map((v) => v.trim());
if (
  !args.input ||
  !args.slug ||
  !["ktx2", "webp"].includes(args.textures) ||
  variants.some((v) => !VARIANTS[v])
) {
  console.error(
    "Usage: node scripts/build-asset.mjs --input <prepared.glb> --slug <slug> [--textures ktx2|webp] [--variants high,mobile,ultra] [--out-dir dir]",
  );
  process.exit(1);
}

if (args.textures === "ktx2" && process.env.KTX_SOFTWARE_BIN) {
  process.env.PATH = `${process.env.KTX_SOFTWARE_BIN}${path.delimiter}${process.env.PATH}`;
}
if (args.textures === "ktx2" && process.platform === "win32") {
  // Default install location; harmless if the directory does not exist.
  process.env.PATH = `${process.env.PATH}${path.delimiter}C:\\Program Files\\KTX-Software\\bin`;
}

await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });

const outDir = path.join(args["out-dir"], args.slug);
await mkdir(outDir, { recursive: true });

const webpNormals = (resize) =>
  textureCompress({ encoder: sharp, targetFormat: "webp", resize, slots: NORMAL, quality: 95 });

/**
 * Normal-map codec (docs/lookdev/tyrannosaurus-rex.md §Textures):
 *  - webp (default): visually identical to UASTC at ~⅓ of the download; costs raw RGBA in GPU memory.
 *  - uastc: smallest GPU footprint, but ~4.6 MB per 2K map — gltf-transform intentionally skips
 *    RDO for normal maps (RDO bends normal directions), so it cannot be squeezed further.
 *  - etc1s: rejected — 4×4 block artefacts show as stair-stepped lighting on the skin.
 */
function textureSteps(codec, resize, normalCodec = "webp") {
  if (codec === "webp") {
    return [
      textureCompress({ encoder: sharp, targetFormat: "webp", resize, slots: NOT_NORMAL, quality: 85 }),
      webpNormals(resize),
    ];
  }
  const normals = {
    webp: webpNormals(resize),
    uastc: toktx({ encoder: sharp, mode: Mode.UASTC, slots: NORMAL, resize, level: 2, zstd: 18 }),
    etc1s: toktx({ encoder: sharp, mode: Mode.ETC1S, slots: NORMAL, resize, quality: 255, compression: 2 }),
  }[normalCodec];
  if (!normals) throw new Error(`Unknown --normal codec "${normalCodec}" (webp | uastc | etc1s)`);
  return [
    normals,
    toktx({ encoder: sharp, mode: Mode.ETC1S, slots: NOT_NORMAL, resize, quality: 160, compression: 2 }),
  ];
}

/**
 * Approximate GPU memory for textures incl. mipmaps (×4/3), per texture format.
 * Raw RGBA: 4 bytes/pixel. KTX2 is transcoded to a GPU block format: ~1 byte/pixel for
 * BC7/ASTC 4×4 (upper bound), 0.5 for BC1/ETC1/ETC2 RGB.
 */
function estimateGpuMB(doc) {
  const bytes = doc
    .getRoot()
    .listTextures()
    .reduce((sum, t) => {
      const [w, h] = t.getSize() ?? [0, 0];
      const bytesPerPixel = t.getMimeType() === "image/ktx2" ? 1 : 4;
      return sum + w * h * bytesPerPixel * (4 / 3);
    }, 0);
  return +(bytes / 1e6).toFixed(1);
}

const rows = [];
for (const name of variants) {
  const doc = await io.read(args.input);
  for (const ext of doc.getRoot().listExtensionsUsed()) {
    if (DROPPED_EXTENSIONS.has(ext.extensionName)) ext.dispose();
  }

  const max = VARIANTS[name];
  await doc.transform(
    dedup(),
    prune(),
    weld(),
    ...textureSteps(args.textures, [max, max], args.normal),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );

  const suffix = (args.textures === "webp" ? "-webp" : "") + (args.tag ? `-${args.tag}` : "");
  const file = path.join(outDir, `${args.slug}-${name}${suffix}.glb`);
  await io.write(file, doc);

  rows.push({
    variant: `${name} (${args.textures})`,
    file,
    downloadMB: +((await stat(file)).size / 1e6).toFixed(2),
    estGpuTextureMB: estimateGpuMB(doc),
    textures: doc
      .getRoot()
      .listTextures()
      .map((t) => `${t.getName() || "texture"} ${t.getSize()?.join("×")} ${t.getMimeType()}`)
      .join(", "),
  });
}

console.table(rows.map(({ textures, ...row }) => row)); // eslint-disable-line @typescript-eslint/no-unused-vars
for (const r of rows) console.log(`${r.variant}: ${r.textures}`);
