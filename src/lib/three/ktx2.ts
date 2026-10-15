import type { WebGLRenderer } from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

/** Served by scripts/copy-vendor.mjs from three's own copy, so versions always match. */
const TRANSCODER_PATH = "/vendor/basis/";

/**
 * One KTX2 loader per renderer.
 *
 * KTX2 textures are stored in Basis Universal, a "supercompressed" intermediate format. At load
 * time a WebAssembly transcoder (in web workers) converts them into whatever block-compressed
 * format this GPU supports — BC7/BC1 on desktop, ASTC/ETC2 on mobile — so they stay compressed
 * in GPU memory. detectSupport() asks the renderer which formats are available.
 */
const loaders = new WeakMap<WebGLRenderer, KTX2Loader>();

export function getKTX2Loader(gl: WebGLRenderer): KTX2Loader {
  let loader = loaders.get(gl);
  if (!loader) {
    loader = new KTX2Loader().setTranscoderPath(TRANSCODER_PATH).detectSupport(gl);
    loaders.set(gl, loader);
  }
  return loader;
}

/** Terminates the transcoder workers. Call when the canvas unmounts. */
export function releaseKTX2Loader(gl: WebGLRenderer) {
  loaders.get(gl)?.dispose();
  loaders.delete(gl);
}
