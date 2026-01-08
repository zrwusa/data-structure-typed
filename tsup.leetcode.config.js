import { defineConfig } from 'tsup';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const commonConfig = {
  format: ['esm'],
  outDir: 'dist/leetcode',
  splitting: false,
  sourcemap: false,
  keepNames: true,
  treeshake: false,
  clean: true,
  target: 'es2022',
  minify: false,
  dts: false,

  outExtension() {
    return { js: '.mjs' };
  },
  esbuildOptions(options) {
    options.drop = ['debugger', 'console']
  },

  // The true ultimate solution: automatic cleaning up of comments after the build is complete
  onSuccess: async () => {
    const distDir = 'dist/leetcode';
    try {
      const files = await readdir(distDir);
      let cleanedCount = 0;

      for (const file of files) {
        // Only .mjs and .js files are processed
        if (!file.endsWith('.mjs') && !file.endsWith('.js')) continue;

        const filePath = join(distDir, file);
        let content = await readFile(filePath, 'utf-8');

        // Step 1: Remove all block comments (including JSDoc)
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');

        // Step 2: Remove all line comments
        content = content.replace(/^\s*\/\/.*$/gm, '');

        // Step 3: Remove extra blank lines (optional, delete this line if you want to keep it)
        content = content.replace(/\n\s*\n/g, '\n');

        await writeFile(filePath, content);
        cleanedCount++;
      }
    } catch (err) {
      process.exit(1);
    }
  }
};

const entries = {
  // ============ Heap ============
  heap: 'src/data-structures/heap/heap.ts',
  'max-heap': 'src/data-structures/heap/max-heap.ts',
  'min-heap': 'src/data-structures/heap/min-heap.ts',

  // ============ Binary Trees ============
  'binary-tree': 'src/data-structures/binary-tree/binary-tree.ts',
  bst: 'src/data-structures/binary-tree/bst.ts',
  'red-black-tree': 'src/data-structures/binary-tree/red-black-tree.ts',
  'avl-tree': 'src/data-structures/binary-tree/avl-tree.ts',
  'avl-tree-counter': 'src/data-structures/binary-tree/avl-tree-counter.ts',
  'avl-tree-multi-map': 'src/data-structures/binary-tree/avl-tree-multi-map.ts',
  'tree-counter': 'src/data-structures/binary-tree/tree-counter.ts',
  'tree-multi-map': 'src/data-structures/binary-tree/tree-multi-map.ts',

  // ============ Graph ============
  'directed-graph': 'src/data-structures/graph/directed-graph.ts',
  'undirected-graph': 'src/data-structures/graph/undirected-graph.ts',

  // ============ Hash ============
  'hash-map': 'src/data-structures/hash/hash-map.ts',

  // ============ LinkedList ============
  'doubly-linked-list': 'src/data-structures/linked-list/doubly-linked-list.ts',
  'singly-linked-list': 'src/data-structures/linked-list/singly-linked-list.ts',

  // ============ PriorityQueue ============
  'priority-queue': 'src/data-structures/priority-queue/priority-queue.ts',
  'max-priority-queue': 'src/data-structures/priority-queue/max-priority-queue.ts',
  'min-priority-queue': 'src/data-structures/priority-queue/min-priority-queue.ts',

  // ============ Queue ============
  deque: 'src/data-structures/queue/deque.ts',
  queue: 'src/data-structures/queue/queue.ts',

  // ============ Stack ============
  stack: 'src/data-structures/stack/stack.ts',

  // ============ Trie ============
  trie: 'src/data-structures/trie/trie.ts'
};

export default defineConfig({
  ...commonConfig,
  entry: entries
});
