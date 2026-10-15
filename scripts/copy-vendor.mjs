/**
 * Copies runtime decoders from node_modules into public/vendor so they are served from our own
 * origin and always match the installed three.js version. Runs before `dev` and `build`.
 *
 *  - Basis Universal transcoder (KTX2 textures): three/examples/jsm/libs/basis/
 */
import { cp, mkdir } from "node:fs/promises";

await mkdir("public/vendor/basis", { recursive: true });
for (const file of ["basis_transcoder.js", "basis_transcoder.wasm"]) {
  await cp(`node_modules/three/examples/jsm/libs/basis/${file}`, `public/vendor/basis/${file}`);
}
