import { defineConfig } from 'tsup';

const baseConfig = {
  entry: { 'data-structure-typed': 'src/index.ts' },
  target: 'es2018',
  format: ['iife'],
  sourcemap: true,
  outDir: 'dist/umd',
  globalName: 'dataStructureTyped',
  platform: 'browser',
  esbuildOptions(options) {
    options.drop = ['debugger'];
  }
};

export default defineConfig([
  {
    ...baseConfig,
    clean: true,
    minify: true,
    outExtension: () => ({ js: '.min.js' })
  },
  {
    ...baseConfig,
    clean: false,
    minify: false,
    outExtension: () => ({ js: '.js' })
  }
]);
