import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { "data-structure-typed": "src/index.ts" },
    target: 'es2018',
    format: ["iife"],
    clean: true,
    sourcemap: true,
    minify: true,
    outDir: "dist/umd",
    globalName: "dataStructureTyped",
    platform: "browser",
    outExtension: () => ({ js: '.min.js' }),
    esbuildOptions(options) {
      options.drop = ['debugger']
    }
  },
  {
    entry: { "data-structure-typed": "src/index.ts" },
    target: 'es2018',
    format: ["iife"],
    clean: false,
    sourcemap: true,
    minify: false,
    outDir: "dist/umd",
    globalName: "dataStructureTyped",
    platform: "browser",
    outExtension: () => ({ js: '.js' }),
    esbuildOptions(options) {
      options.drop = ['debugger']
    }
  }
]);
