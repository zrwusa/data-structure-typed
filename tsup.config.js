export default [{
  entry: ['src/index.ts'],
  format: ["iife"],
  clean: true,
  sourcemap: true,
  minify: true,
  outDir: 'dist/umd',
  globalName: 'dataStructureTyped',
  platform: "browser",
  bundle: true
}];
