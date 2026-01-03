import { defineConfig } from "tsup";

export default defineConfig([
  // ESM (modern) - ES2022
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    outDir: "dist/esm",
    splitting: false,
    sourcemap: true,
    minify: false,
    keepNames: true,
    treeshake: true,
    clean: true,
    target: "es2022",
    outExtension() {
      return { js: ".mjs" };
    }
  },

  // ESM (legacy) - ES2018
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    outDir: "dist/esm-legacy",
    splitting: false,
    sourcemap: true,
    minify: false,
    keepNames: true,
    treeshake: true,
    clean: false,
    target: "es2018",
    outExtension() {
      return { js: ".mjs" };
    }
  },

  // CJS (modern) - ES2022
  {
    entry: { index: "src/index.ts" },
    format: ["cjs"],
    outDir: "dist/cjs",
    splitting: false,
    sourcemap: true,
    minify: false,
    keepNames: true,
    treeshake: true,
    clean: false,
    target: "es2022",
    outExtension() {
      return { js: ".cjs" };
    }
  },

  // CJS (legacy) - ES2018
  {
    entry: { index: "src/index.ts" },
    format: ["cjs"],
    outDir: "dist/cjs-legacy",
    splitting: false,
    sourcemap: true,
    minify: false,
    keepNames: true,
    treeshake: true,
    clean: false,
    target: "es2018",
    outExtension() {
      return { js: ".cjs" };
    }
  }
]);
