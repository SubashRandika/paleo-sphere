import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** `npm run content:verify` — network checks of species citations (see tests/content/citations.verify.ts). */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/content/**/*.verify.ts"],
    maxConcurrency: 4,
  },
});
