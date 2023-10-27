export default [{
  entryPoints: {
    "data-structure-typed": "src/index.ts"
  },
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
}];
