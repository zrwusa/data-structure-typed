export default [
  {
    entryPoints: {
      "data-structure-typed": "src/index.ts"
    },
    target: 'es6',
    format: ["iife"],
    clean: true,
    sourcemap: true,
    minify: true,
    outDir: "dist/umd",
    globalName: "dataStructureTyped",
    platform: "browser",
    bundle: true,
    outExtension() {
      return {
        js: `.min.js`,
      }
    },
  },
  {
    entryPoints: {
      "data-structure-typed": "src/index.ts"
    },
    target: 'es6',
    format: ["iife"],
    clean: true,
    sourcemap: false,
    minify: false,
    outDir: "dist/umd",
    globalName: "dataStructureTyped",
    platform: "browser",
    bundle: true,
    outExtension() {
      return {
        js: `.js`,
      }
    },
  }
];
