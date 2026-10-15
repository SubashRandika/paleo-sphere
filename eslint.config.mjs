import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Architecture rule: the domain layer stays free of React and three
    // so species content can move to a CMS without touching the viewer.
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "next", "next/*"],
              message: "domain/ must not depend on React or Next.",
            },
            { group: ["three", "three/*", "@react-three/*"], message: "domain/ must not depend on three." },
            { group: ["@/features/*", "@/ui/*", "@/app/*"], message: "domain/ is the lowest layer." },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "assets-src/**",
    "reference/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
