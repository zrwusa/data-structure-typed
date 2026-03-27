import { defineConfig } from 'tsup';

const entry = {
  index: 'src/index.ts',
  'binary-tree': 'src/data-structures/binary-tree/index.ts',
  graph: 'src/data-structures/graph/index.ts',
  hash: 'src/data-structures/hash/index.ts',
  heap: 'src/data-structures/heap/index.ts',
  'linked-list': 'src/data-structures/linked-list/index.ts',
  matrix: 'src/data-structures/matrix/index.ts',
  'priority-queue': 'src/data-structures/priority-queue/index.ts',
  queue: 'src/data-structures/queue/index.ts',
  stack: 'src/data-structures/stack/index.ts',
  trie: 'src/data-structures/trie/index.ts'
};

const baseConfig = {
  entry,
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
