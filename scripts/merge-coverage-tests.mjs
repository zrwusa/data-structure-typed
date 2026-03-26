#!/usr/bin/env node

/**
 * Merge fragmented .coverage.test.ts files into grouped files.
 * Preserves all test cases, just reorganizes into fewer files.
 *
 * Usage: node scripts/merge-coverage-tests.mjs
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { globSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';

const TEST_ROOT = 'test/unit/data-structures';

/** Maps kebab-case prefix to PascalCase display name */
const NAME_MAP = {
  'red-black-tree': 'RedBlackTree',
  'bst': 'BST',
  'avl-tree': 'AVLTree',
  'binary-tree': 'BinaryTree',
  'binary-indexed-tree': 'BinaryIndexedTree',
  'segment-tree': 'SegmentTree',
  'abstract-graph': 'AbstractGraph',
  'directed-graph': 'DirectedGraph',
  'undirected-graph': 'UndirectedGraph',
  'map-graph': 'MapGraph',
  'deque': 'Deque',
  'queue': 'Queue',
  'heap': 'Heap',
  'max-heap': 'MaxHeap',
  'max-priority-queue': 'MaxPriorityQueue',
  'priority-queue': 'PriorityQueue',
  'hash-map': 'HashMap',
  'doubly-linked-list': 'DoublyLinkedList',
  'singly-linked-list': 'SinglyLinkedList',
  'skip-linked-list': 'SkipLinkedList',
  'linked-list': 'LinkedList',
  'linear-base': 'LinearBase',
  'iterable-element-base': 'IterableElementBase',
  'matrix': 'Matrix',
  'stack': 'Stack',
  'tree': 'Tree',
  'trie': 'Trie',
  'tree-multi-map': 'TreeMultiMap',
};

/** Explicit merge groups: prefix → { groupName: [suffixes] } */
const MERGE_GROUPS = {
  'red-black-tree': {
    boundary: ['boundary-corruption-repair', 'boundary-max-update', 'boundary-null',
      'boundary-stale-cache', 'boundary-update'],
    cache: ['cache-delete', 'cache-edge', 'cache-stale-insert',
      'insert-cache-nullish', 'insert-header-parent-nullish'],
    hint: ['hint', 'hint-cache-compare-update', 'hint-cache-no-update',
      'hint-cache-nullish', 'hint-mapmode-defined', 'hint-mapmode-undefined',
      'hint-more'],
    delete: ['delete-fixup', 'delete-successor'],
    setkvnode: ['setkvnode-parent-cache', 'setkvnode-remaining', 'setkvnode-uncovered',
      'set-inputs', 'update-branches'],
    misc: ['factories', 'internal-walk', 'misc-inputs', 'predsucc',
      'more-branches-2', 'more-branches-3', 'more-branches-4',
      'remaining-branches'],
  },
  bst: {
    delete: ['deletebykey', 'deletewhere'],
    'floor-lower': ['floor-lower-predicate', 'floor-setmany', 'bound-by-predicate'],
    search: ['search-fastpath', 'range-pruning', 'getnode.range-ensure'],
    misc: ['misc-branches', 'more', 'node-family',
      'more-branches-2', 'more-branches-3', 'more-branches-4', 'more-branches-5'],
  },
  'binary-tree': {
    misc: ['more-branches', 'remaining-branches'],
  },
};

/** Simple merges: all coverage files for a prefix merge into one */
const SIMPLE_MERGE_PREFIXES = [
  'abstract-graph', 'directed-graph', 'undirected-graph', 'map-graph',
  'deque', 'queue', 'heap',
  'hash-map',
  'singly-linked-list',
  'matrix',
  'linear-base', 'iterable-element-base',
];

// ─── Helpers ───

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else results.push(full);
  }
  return results;
}

function findCoverageFiles(directory, prefix) {
  const files = readdirSync(directory)
    .filter(f => f.startsWith(`${prefix}.`) && f.endsWith('.coverage.test.ts'))
    .map(f => join(directory, f))
    .sort();
  const exact = join(directory, `${prefix}.coverage.test.ts`);
  if (existsSync(exact) && !files.includes(exact)) files.push(exact);
  return files;
}

function findDirectoryForPrefix(prefix) {
  const allFiles = walkDir(TEST_ROOT);
  for (const f of allFiles) {
    const name = basename(f);
    if (name.startsWith(`${prefix}.`) && name.endsWith('.test.ts')) {
      return f.slice(0, f.lastIndexOf('/'));
    }
  }
  return null;
}

function extractTestContent(filepath) {
  const content = readFileSync(filepath, 'utf8');
  const lines = content.split('\n');

  // Collect imports
  const importLines = lines.filter(l => l.startsWith('import '));

  // Find first describe line
  let descStart = -1;
  for (let i = 0; i < lines.length; i++) {
    const stripped = lines[i].trim();
    if (stripped.startsWith('describe(') || stripped.startsWith("describe ('")) {
      descStart = i;
      break;
    }
  }

  if (descStart === -1) return { descName: null, body: null, helpers: null, importLines };

  // Extract helper code between imports and describe
  const helperLines = [];
  for (let i = 0; i < descStart; i++) {
    if (lines[i].startsWith('import ') || !lines[i].trim()) continue;
    helperLines.push(lines[i]);
  }
  const helpers = helperLines.join('\n').trim() || null;

  // Extract describe name and body
  const remaining = lines.slice(descStart).join('\n');
  const match = remaining.match(/describe\(\s*'([^']+)'\s*,\s*\(\)\s*=>\s*\{(.*)\}\s*\)\s*;?\s*$/s);
  if (!match) return { descName: null, body: null, helpers, importLines };

  return { descName: match[1], body: match[2].trim(), helpers, importLines };
}

function mergeImports(allImportLines) {
  const moduleImports = new Map(); // module → Set<name>
  const otherImports = [];

  for (let imp of allImportLines) {
    imp = imp.replace(/;\s*$/, '');
    const m = imp.match(/import\s*\{([^}]+)\}\s*from\s*'([^']+)'/);
    if (m) {
      const names = m[1].split(',').map(n => n.trim()).filter(Boolean);
      const mod = m[2];
      if (!moduleImports.has(mod)) moduleImports.set(mod, new Set());
      for (const n of names) moduleImports.get(mod).add(n);
    } else if (!otherImports.includes(imp)) {
      otherImports.push(imp);
    }
  }

  const result = [];
  for (const mod of [...moduleImports.keys()].sort()) {
    const names = [...moduleImports.get(mod)].sort();
    result.push(`import { ${names.join(', ')} } from '${mod}';`);
  }
  result.push(...otherImports);
  return result;
}

function mergeFiles(prefix, groupName, filepaths, displayName) {
  const describes = [];
  const allHelpers = [];
  const allImports = [];

  for (const filepath of filepaths) {
    const { descName, body, helpers, importLines } = extractTestContent(filepath);
    allImports.push(...importLines);
    if (body) {
      describes.push({ descName, body });
      if (helpers) {
        const suffix = basename(filepath).replace(`${prefix}.`, '').replace('.coverage.test.ts', '');
        allHelpers.push(`// --- from ${suffix} ---\n${helpers}`);
      }
    }
  }

  if (describes.length === 0) return null;

  const imports = mergeImports(allImports);
  let output = imports.join('\n') + '\n\n';

  if (allHelpers.length > 0) {
    output += allHelpers.join('\n\n') + '\n\n';
  }

  output += `describe('${displayName} ${groupName} coverage', () => {\n`;

  for (const { descName, body } of describes) {
    let shortName = descName;
    for (const remove of [`${displayName} `, 'remaining ', 'additional ']) {
      shortName = shortName.replaceAll(remove, '');
    }
    shortName = shortName.replaceAll(' coverage', '').trim();

    output += `\n  describe('${shortName}', () => {\n`;
    for (const line of body.split('\n')) {
      output += line.trim() ? `  ${line}\n` : '\n';
    }
    output += '  });\n';
  }

  output += '});\n';
  return output;
}

// ─── Processing ───

function processGroupedMerge(prefix, groups, directory) {
  const displayName = NAME_MAP[prefix] ?? prefix;
  let totalMerged = 0;

  for (const [groupName, suffixes] of Object.entries(groups)) {
    const filepaths = suffixes
      .map(s => join(directory, `${prefix}.${s}.coverage.test.ts`))
      .filter(fp => existsSync(fp));

    const target = join(directory, `${prefix}.${groupName}.coverage.test.ts`);

    if (filepaths.length < 2) {
      if (filepaths.length === 1 && resolve(filepaths[0]) === resolve(target)) continue;
      if (filepaths.length === 0) continue;
    }

    const content = mergeFiles(prefix, groupName, filepaths, displayName);
    if (!content) continue;

    console.log(`\n  [${groupName}] ${filepaths.length} files -> ${basename(target)}`);
    writeFileSync(target, content);

    for (const fp of filepaths) {
      if (resolve(fp) !== resolve(target)) {
        unlinkSync(fp);
        totalMerged++;
      }
    }
  }

  return totalMerged;
}

function processSimpleMerge(prefix, directory) {
  const displayName = NAME_MAP[prefix] ?? prefix;
  const files = findCoverageFiles(directory, prefix);

  if (files.length <= 1) return 0;

  const outpath = join(directory, `${prefix}.coverage.test.ts`);
  const content = mergeFiles(prefix, 'misc', files, displayName);
  if (!content) return 0;

  console.log(`\n  [all] ${files.length} files -> ${basename(outpath)}`);
  writeFileSync(outpath, content);

  let merged = 0;
  for (const fp of files) {
    if (resolve(fp) !== resolve(outpath)) {
      unlinkSync(fp);
      merged++;
    }
  }
  return merged;
}

// ─── Main ───

let total = 0;

// Grouped merges
for (const [prefix, groups] of Object.entries(MERGE_GROUPS)) {
  const directory = findDirectoryForPrefix(prefix);
  if (!directory) continue;
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${NAME_MAP[prefix] ?? prefix} (grouped)`);
  console.log('='.repeat(50));
  total += processGroupedMerge(prefix, groups, directory);
}

// Simple merges
for (const prefix of SIMPLE_MERGE_PREFIXES) {
  const directory = findDirectoryForPrefix(prefix);
  if (!directory) continue;
  const files = findCoverageFiles(directory, prefix);
  if (files.length <= 1) continue;
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${NAME_MAP[prefix] ?? prefix} (simple merge)`);
  console.log('='.repeat(50));
  total += processSimpleMerge(prefix, directory);
}

console.log(`\n✅ Done. Removed ${total} fragmented files.`);
