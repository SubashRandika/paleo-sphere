/**
 * Runs scripts/blender/prepare_model.py in headless Blender.
 *
 *   npm run asset:prepare -- --input <source.gltf> --output <prepared.glb> --length <metres> [--blend <file.blend>]
 *
 * Blender location: $BLENDER, or the default Windows install path for Blender 5.1.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const blender = process.env.BLENDER ?? "C:/Program Files/Blender Foundation/Blender 5.1/blender.exe";
const script = path.join(import.meta.dirname, "prepare_model.py");
const result = spawnSync(
  blender,
  ["--background", "--factory-startup", "--python", script, "--", ...process.argv.slice(2)],
  {
    encoding: "utf8",
  },
);
if (result.error) {
  console.error(`Could not start Blender at "${blender}". Set the BLENDER environment variable.`);
  process.exit(1);
}
const report = result.stdout.split("\n").find((line) => line.startsWith("REPORT "));
if (result.status !== 0 || !report) {
  console.error(result.stdout.slice(-2000), result.stderr.slice(-2000));
  process.exit(result.status || 1);
}
console.log(JSON.stringify(JSON.parse(report.slice("REPORT ".length)), null, 2));
