import { defineConfig } from 'tsup';

const baseConfig = {
  entry: { index: 'src/index.ts' },
  splitting: false,
  sourcemap: true,
  minify: false,
  keepNames: true,
  treeshake: true,
  esbuildOptions(options) {
    options.drop = ['debugger'];
  }
};

export default defineConfig([
  // ESM (modern) - ES2022
  {
    ...baseConfig,
    format: ['esm'],
    outDir: 'dist/esm',
    clean: true,
    target: 'es2022',
    outExtension() {
      return { js: '.mjs' };
    }
  },

  // ESM (legacy) - ES2018
  {
    ...baseConfig,
    format: ['esm'],
    outDir: 'dist/esm-legacy',
    clean: false,
    target: 'es2018',
    outExtension() {
      return { js: '.mjs' };
    }
  },

  // CJS (modern) - ES2022
  {
    ...baseConfig,
    format: ['cjs'],
    outDir: 'dist/cjs',
    clean: false,
    target: 'es2022',
    outExtension() {
      return { js: '.cjs' };
    }
  },

  // CJS (legacy) - ES2018
  {
    ...baseConfig,
    format: ['cjs'],
    outDir: 'dist/cjs-legacy',
    clean: false,
    target: 'es2018',
    outExtension() {
      return { js: '.cjs' };
    }
  }
]);
