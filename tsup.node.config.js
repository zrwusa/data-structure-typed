import { defineConfig } from "tsup";

export default defineConfig([
  // ESM
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
    target: "es2018",
    outExtension() {
      return { js: ".mjs" }
    },
  },

  // CJS
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
    target: "es2018",
    outExtension() {
      return { js: ".cjs" };
    },
  },
]);
