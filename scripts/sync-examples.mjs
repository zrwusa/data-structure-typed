#!/usr/bin/env node
/**
 * sync-examples.mjs
 *
 * Extracts @example tests tagged with [Class.method] from test files
 * and injects them as @example JSDoc blocks into the corresponding
 * source method.
 *
 * Test convention:
 *   it('@example [SegmentTree.query] Range sum query', () => { ... })
 *
 * The script will:
 * 1. Find all it('@example [Cls.method] ...') blocks in test files
 * 2. Extract and simplify the code body
 * 3. Locate the method in the source file
 * 4. Inject/replace the @example block in JSDoc
 *
 * Usage:
 *   node scripts/sync-examples.mjs [--dry-run] [--verbose]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const TEST_DIR = join(ROOT, 'test/unit');
const SRC_DIR = join(ROOT, 'src/data-structures');

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// ─── 1. Collect all test files ────────────────────────────────

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full));
    } else if (full.endsWith('.test.ts')) {
      files.push(full);
    }
  }
  return files;
}

// ─── 2. Parse @example blocks from test files ─────────────────

// Method-level: it('@example [Class.method] description', ...)
const METHOD_TAG_RE = /it\(\s*'@example\s+\[([A-Za-z]+)\.([A-Za-z]+)\]\s+([^']+)'/g;
// Class-level: it('@example [Class] description', ...)
const CLASS_TAG_RE = /it\(\s*'@example\s+\[([A-Za-z]+)\]\s+([^']+)'/g;

function extractBody(src, startIdx) {
  const arrowIdx = src.indexOf('=>', startIdx);
  if (arrowIdx === -1) return null;
  const bodyStart = src.indexOf('{', arrowIdx);
  if (bodyStart === -1) return null;

  let depth = 1;
  let i = bodyStart + 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  return src.slice(bodyStart + 1, i - 1).trim();
}

function extractExamples(testFile) {
  const src = readFileSync(testFile, 'utf-8');
  const examples = [];

  // Method-level: [Class.method]
  let match;
  METHOD_TAG_RE.lastIndex = 0;
  while ((match = METHOD_TAG_RE.exec(src)) !== null) {
    const [, className, methodName, description] = match;
    const body = extractBody(src, match.index);
    if (!body) continue;

    examples.push({
      className,
      methodName,
      description,
      code: simplifyTestBody(body),
      level: 'method',
      sourceFile: testFile
    });
  }

  // Class-level: [Class]
  CLASS_TAG_RE.lastIndex = 0;
  while ((match = CLASS_TAG_RE.exec(src)) !== null) {
    const full = match[0];
    // Skip if it also matches method-level (has a dot)
    if (full.match(/\[([A-Za-z]+)\.([A-Za-z]+)\]/)) continue;

    const [, className, description] = match;
    const body = extractBody(src, match.index);
    if (!body) continue;

    examples.push({
      className,
      methodName: null, // class-level
      description,
      code: simplifyTestBody(body),
      level: 'class',
      sourceFile: testFile
    });
  }

  return examples;
}

// ─── 3. Simplify test code into example code ──────────────────

function simplifyTestBody(body) {
  const lines = body.split('\n').map(l => {
    // Remove leading whitespace (normalize to 0 indent)
    let line = l.replace(/^    /, '');

    // Transform expect(x).toBe(y) → x; // y  (strip trailing comments)
    line = line.replace(
      /expect\((.+?)\)\.toBe\(([^)]+)\);?\s*(?:\/\/.*)?$/,
      (_, expr, val) => `${expr}; // ${val}`
    );

    // Transform expect(x).toEqual(y) → x; // y
    line = line.replace(
      /expect\((.+?)\)\.toEqual\((\[.+?\])\);?\s*(?:\/\/.*)?$/,
      (_, expr, val) => `${expr}; // ${val}`
    );

    // Transform expect(x).toBeTruthy() → x; // true
    line = line.replace(
      /expect\((.+?)\)\.toBeTruthy\(\);?\s*(?:\/\/.*)?$/,
      (_, expr) => `${expr}; // true`
    );

    // Transform expect(x).toBeFalsy() → x; // false
    line = line.replace(
      /expect\((.+?)\)\.toBeFalsy\(\);?\s*(?:\/\/.*)?$/,
      (_, expr) => `${expr}; // false`
    );

    // Transform expect(x).toBeUndefined() → x; // undefined
    line = line.replace(
      /expect\((.+?)\)\.toBeUndefined\(\);?\s*(?:\/\/.*)?$/,
      (_, expr) => `${expr}; // undefined`
    );

    // Transform expect(x).toBeGreaterThan(y) → x; // > y
    line = line.replace(
      /expect\((.+?)\)\.toBeGreaterThan\(([^)]+)\);?\s*(?:\/\/.*)?$/,
      (_, expr, val) => `${expr}; // > ${val}`
    );

    // Transform expect(x).toBeLessThan(y) → x; // < y
    line = line.replace(
      /expect\((.+?)\)\.toBeLessThan\(([^)]+)\);?\s*(?:\/\/.*)?$/,
      (_, expr, val) => `${expr}; // < ${val}`
    );

    // Transform expect(x).toHaveLength(y) → x.length; // y
    line = line.replace(
      /expect\((.+?)\)\.toHaveLength\(([^)]+)\);?\s*(?:\/\/.*)?$/,
      (_, expr, val) => `${expr}.length; // ${val}`
    );

    return line;
  });

  // Filter out empty lines at start/end, keep comments
  const trimmed = lines
    .filter(l => l.trim() !== '')
    .join('\n');

  return trimmed;
}

// ─── 4. Source file mapping ───────────────────────────────────

// Map class names to source file paths
function findSourceFile(className) {
  const classToFile = {
    // Binary trees
    'SegmentTree': 'binary-tree/segment-tree.ts',
    'BinaryIndexedTree': 'binary-tree/binary-indexed-tree.ts',
    'RedBlackTree': 'binary-tree/red-black-tree.ts',
    'AVLTree': 'binary-tree/avl-tree.ts',
    'BST': 'binary-tree/bst.ts',
    'BinaryTree': 'binary-tree/binary-tree.ts',
    'TreeMap': 'binary-tree/tree-map.ts',
    'TreeSet': 'binary-tree/tree-set.ts',
    'TreeMultiMap': 'binary-tree/tree-multi-map.ts',
    'TreeMultiSet': 'binary-tree/tree-multi-set.ts',

    // Linked lists
    'SkipList': 'linked-list/skip-linked-list.ts',
    'SinglyLinkedList': 'linked-list/singly-linked-list.ts',
    'DoublyLinkedList': 'linked-list/doubly-linked-list.ts',

    // Hash
    'HashMap': 'hash/hash-map.ts',
    'LinkedHashMap': 'hash/hash-map.ts',

    // Heap / Priority Queue
    'Heap': 'heap/heap.ts',
    'MinHeap': 'heap/min-heap.ts',
    'MaxHeap': 'heap/max-heap.ts',
    'MinPriorityQueue': 'priority-queue/min-priority-queue.ts',
    'MaxPriorityQueue': 'priority-queue/max-priority-queue.ts',
    'PriorityQueue': 'priority-queue/priority-queue.ts',

    // Queue / Stack
    'Queue': 'queue/queue.ts',
    'Deque': 'queue/deque.ts',
    'Stack': 'stack/stack.ts',

    // Graph
    'DirectedGraph': 'graph/directed-graph.ts',
    'UndirectedGraph': 'graph/undirected-graph.ts',
    'MapGraph': 'graph/map-graph.ts',

    // Other
    'Trie': 'trie/trie.ts',
    'Matrix': 'matrix/matrix.ts',
  };

  const relPath = classToFile[className];
  if (!relPath) return null;
  return join(SRC_DIR, relPath);
}

// ─── 5. Inject @example into source JSDoc ─────────────────────

function injectClassExample(filePath, className, code, description) {
  let src = readFileSync(filePath, 'utf-8');

  const indent = ' * ';
  const exampleBlock = [
    `${indent}@example`,
    `${indent}\`\`\`ts`,
    ...code.split('\n').map(l => `${indent}${l}`),
    `${indent}\`\`\``,
  ].join('\n');

  // Find the class declaration
  const classPattern = new RegExp(`(export\\s+class\\s+${escapeRegex(className)}[^{]*\\{)`, 'm');
  const classMatch = src.match(classPattern);
  if (!classMatch) {
    console.warn(`  ⚠️  Class "${className}" not found in ${relative(ROOT, filePath)}`);
    return false;
  }

  const classIdx = classMatch.index;
  const beforeClass = src.slice(0, classIdx);
  const jsdocEndIdx = beforeClass.lastIndexOf('*/');

  if (jsdocEndIdx !== -1) {
    const jsdocStartIdx = beforeClass.lastIndexOf('/**', jsdocEndIdx);
    const existingJsdoc = src.slice(jsdocStartIdx, jsdocEndIdx + 2);
    if (existingJsdoc.includes('@example')) {
      if (VERBOSE) console.log(`  ℹ️  Class "${className}" already has @example, skipping`);
      return false;
    }
    src = src.slice(0, jsdocEndIdx) + exampleBlock + '\n ' + src.slice(jsdocEndIdx);
  } else {
    const jsdocBlock = `/**\n * ${description}\n${exampleBlock}\n */\n`;
    src = src.slice(0, classIdx) + jsdocBlock + src.slice(classIdx);
  }

  if (!DRY_RUN) {
    writeFileSync(filePath, src);
  }
  return true;
}

function injectExample(filePath, methodName, code, description) {
  let src = readFileSync(filePath, 'utf-8');

  // Build the @example block
  const indent = '   * ';
  const exampleBlock = [
    `${indent}@example`,
    `${indent}\`\`\`ts`,
    ...code.split('\n').map(l => `${indent}${l}`),
    `${indent}\`\`\``,
  ].join('\n');

  // Find the method declaration
  // Patterns: `methodName(`, `static methodName(`, `get methodName()`, `override methodName(`
  const methodPatterns = [
    // Static method
    new RegExp(`(\\s+static\\s+${escapeRegex(methodName)}\\s*(?:<[^>]*>)?\\s*\\()`, 'm'),
    // Override method
    new RegExp(`(\\s+override\\s+${escapeRegex(methodName)}\\s*(?:<[^>]*>)?\\s*\\()`, 'm'),
    // Regular method
    new RegExp(`(\\s+${escapeRegex(methodName)}\\s*(?:<[^>]*>)?\\s*\\()`, 'm'),
    // Getter
    new RegExp(`(\\s+get\\s+${escapeRegex(methodName)}\\s*\\()`, 'm'),
  ];

  let methodMatch = null;
  let methodIdx = -1;

  for (const pattern of methodPatterns) {
    const m = src.match(pattern);
    if (m) {
      methodMatch = m;
      methodIdx = m.index;
      break;
    }
  }

  if (methodIdx === -1) {
    console.warn(`  ⚠️  Method "${methodName}" not found in ${relative(ROOT, filePath)}`);
    return false;
  }

  // Find the JSDoc block before this method
  // Look backwards from methodIdx for the closing */ of a JSDoc
  const beforeMethod = src.slice(0, methodIdx);
  const jsdocEndIdx = beforeMethod.lastIndexOf('*/');

  if (jsdocEndIdx === -1) {
    // No JSDoc found — create one
    const jsdocBlock = `  /**\n   * ${description}\n${exampleBlock}\n   */\n`;
    src = src.slice(0, methodIdx) + '\n' + jsdocBlock + src.slice(methodIdx);
  } else {
    // Check if @example already exists in this JSDoc
    const jsdocStartIdx = beforeMethod.lastIndexOf('/**', jsdocEndIdx);
    const existingJsdoc = src.slice(jsdocStartIdx, jsdocEndIdx + 2);

    if (existingJsdoc.includes('@example')) {
      // Already has @example — check if it's auto-generated (has same method tag)
      if (VERBOSE) console.log(`  ℹ️  "${methodName}" already has @example, skipping`);
      return false;
    }

    // Insert @example before the closing */
    src = src.slice(0, jsdocEndIdx) + exampleBlock + '\n   ' + src.slice(jsdocEndIdx);
  }

  if (!DRY_RUN) {
    writeFileSync(filePath, src);
  }
  return true;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Main ─────────────────────────────────────────────────────

function main() {
  console.log(`🔍 Scanning test files in ${relative(ROOT, TEST_DIR)}...`);

  const testFiles = walkDir(TEST_DIR);
  const allExamples = [];

  for (const f of testFiles) {
    const examples = extractExamples(f);
    if (examples.length > 0) {
      allExamples.push(...examples);
      if (VERBOSE) {
        console.log(`  📄 ${relative(ROOT, f)}: ${examples.length} tagged @example(s)`);
      }
    }
  }

  if (allExamples.length === 0) {
    console.log('\n⚠️  No tagged @example tests found.');
    console.log('   Tag format: it(\'@example [ClassName.methodName] description\', () => { ... })');
    console.log('\n   Example:');
    console.log('   it(\'@example [SegmentTree.query] Range sum query\', () => {');
    console.log('     const st = SegmentTree.sum([1, 2, 3, 4, 5]);');
    console.log('     expect(st.query(1, 3)).toBe(9);');
    console.log('   });');
    return;
  }

  console.log(`\n📝 Found ${allExamples.length} tagged @example test(s):\n`);

  let injected = 0;
  let skipped = 0;
  let failed = 0;

  for (const ex of allExamples) {
    const srcFile = findSourceFile(ex.className);
    if (!srcFile) {
      console.log(`  ❌ ${ex.className}.${ex.methodName} — unknown class`);
      failed++;
      continue;
    }

    const prefix = DRY_RUN ? '[dry-run] ' : '';
    const ok = injectExample(srcFile, ex.methodName, ex.code, ex.description);
    if (ok) {
      console.log(`  ✅ ${prefix}${ex.className}.${ex.methodName} ← "${ex.description}"`);
      injected++;
    } else {
      skipped++;
    }
  }

  console.log(`\n${DRY_RUN ? '🏃 Dry run — ' : ''}✅ ${injected} injected, ⏭️  ${skipped} skipped, ❌ ${failed} failed`);
}

main();
