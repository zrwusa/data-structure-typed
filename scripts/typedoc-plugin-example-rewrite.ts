/**
 * TypeDoc plugin: rewrite inherited @example blocks so subclass pages
 * use the correct class name and variable names.
 *
 * Works at the reflection level (pure text), not HTML.
 * No source code modifications needed.
 *
 * Usage: npx typedoc --plugin ./scripts/typedoc-plugin-example-rewrite.ts
 */

import { Application, Converter, Comment, CommentTag, DeclarationReflection, ReflectionKind } from 'typedoc';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ───────────────────────────────────────────────────

/** Map of parent class names to their known variable names in examples */
const classToVar: Record<string, string> = {
  BinaryTree: 'tree', BST: 'bst', AVLTree: 'avl', RedBlackTree: 'rbt',
  TreeMap: 'tm', TreeSet: 'ts', TreeMultiMap: 'tmm', TreeMultiSet: 'tms',
  AVLTreeMultiMap: 'avlmm', AVLTreeCounter: 'avlc',
  Heap: 'heap', MinHeap: 'minHeap', MaxHeap: 'maxHeap',
  PriorityQueue: 'pq', MinPriorityQueue: 'minPQ', MaxPriorityQueue: 'maxPQ',
  SkipList: 'sl', HashMap: 'hm',
  Queue: 'q', Deque: 'dq', Stack: 'stack',
  SinglyLinkedList: 'sll', DoublyLinkedList: 'dll',
  DirectedGraph: 'g', UndirectedGraph: 'g',
  Trie: 'trie', SegmentTree: 'st', BinaryIndexedTree: 'bit', Matrix: 'mat',
};

/** Test file patterns: className → test file path (relative to project root) */
const classToTestFile: Record<string, string> = {
  BinaryTree: 'test/unit/data-structures/binary-tree/binary-tree.test.ts',
  BST: 'test/unit/data-structures/binary-tree/bst.test.ts',
  AVLTree: 'test/unit/data-structures/binary-tree/avl-tree.test.ts',
  RedBlackTree: 'test/unit/data-structures/binary-tree/red-black-tree.test.ts',
  TreeMap: 'test/unit/data-structures/binary-tree/tree-map.test.ts',
  TreeSet: 'test/unit/data-structures/binary-tree/tree-set.test.ts',
  TreeMultiMap: 'test/unit/data-structures/binary-tree/tree-multi-map.test.ts',
  TreeMultiSet: 'test/unit/data-structures/binary-tree/tree-multi-set.test.ts',
  Heap: 'test/unit/data-structures/heap/heap.test.ts',
  MinHeap: 'test/unit/data-structures/heap/heap.test.ts',
  MaxHeap: 'test/unit/data-structures/heap/heap.test.ts',
  HashMap: 'test/unit/data-structures/hash/hash-map.test.ts',
  SkipList: 'test/unit/data-structures/linked-list/skip-list.test.ts',
  Queue: 'test/unit/data-structures/queue/queue.test.ts',
  Deque: 'test/unit/data-structures/queue/deque.test.ts',
  Stack: 'test/unit/data-structures/stack/stack.test.ts',
  SinglyLinkedList: 'test/unit/data-structures/linked-list/singly-linked-list.test.ts',
  DoublyLinkedList: 'test/unit/data-structures/linked-list/doubly-linked-list.test.ts',
  DirectedGraph: 'test/unit/data-structures/graph/directed-graph.test.ts',
  UndirectedGraph: 'test/unit/data-structures/graph/undirected-graph.test.ts',
  Trie: 'test/unit/data-structures/trie/trie.test.ts',
  SegmentTree: 'test/unit/data-structures/binary-tree/segment-tree.test.ts',
  BinaryIndexedTree: 'test/unit/data-structures/binary-tree/binary-indexed-tree.test.ts',
  Matrix: 'test/unit/data-structures/matrix/matrix.test.ts',
};

// ─── Test parser ──────────────────────────────────────────────

interface ParsedExample {
  className: string;
  methodName: string;
  description: string;
  body: string;
}

const TAG_RE = /^\[([A-Za-z]+)\.([A-Za-z]+)\]\s+(.+)$/;

/**
 * Parse test files to extract @example [ClassName.method] tagged tests.
 * Returns a map: "ClassName.methodName" → example code body
 */
function parseTestExamples(projectRoot: string): Map<string, ParsedExample> {
  const examples = new Map<string, ParsedExample>();

  for (const [className, relPath] of Object.entries(classToTestFile)) {
    const filePath = path.join(projectRoot, relPath);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');

    // Match: it('@example [ClassName.method] description', () => { ... });
    // Use a regex to find test blocks
    const testRegex = /it\(\s*'@example\s+\[([A-Za-z]+)\.([A-Za-z]+)\]\s+([^']+)'\s*,\s*\(\)\s*=>\s*\{/g;
    let match;

    while ((match = testRegex.exec(content)) !== null) {
      const [, cls, method, desc] = match;
      if (cls !== className) continue;

      // Extract body: find matching closing brace
      const bodyStart = match.index + match[0].length;
      let depth = 1;
      let i = bodyStart;
      while (i < content.length && depth > 0) {
        if (content[i] === '{') depth++;
        else if (content[i] === '}') depth--;
        i++;
      }
      // body is between bodyStart and i-1 (excluding the final })
      let body = content.slice(bodyStart, i - 1).trim();

      // Convert expect() to console.log comments
      body = convertExpectsToComments(body);

      const key = `${cls}.${method}`;
      examples.set(key, { className: cls, methodName: method, description: desc, body });
    }
  }

  return examples;
}

/**
 * Convert Jest expect() assertions to console.log() comments for documentation
 */
function convertExpectsToComments(body: string): string {
  const lines = body.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty expect lines that are too complex
    if (trimmed.startsWith('expect(') && trimmed.includes(').toBe(')) {
      const m = trimmed.match(/expect\((.+?)\)\.toBe\((.+?)\)/);
      if (m) {
        result.push(`console.log(${m[1]}); // ${m[2]}`);
        continue;
      }
    }
    if (trimmed.startsWith('expect(') && trimmed.includes(').toEqual(')) {
      const m = trimmed.match(/expect\((.+?)\)\.toEqual\((.+?)\)/);
      if (m) {
        result.push(`console.log(${m[1]}); // ${m[2]}`);
        continue;
      }
    }
    if (trimmed.startsWith('expect(') && trimmed.includes(').toBeGreaterThan(')) {
      const m = trimmed.match(/expect\((.+?)\)\.toBeGreaterThan/);
      if (m) {
        result.push(`console.log(${m[1]}); // > 0`);
        continue;
      }
    }
    if (trimmed.startsWith('expect(') && trimmed.includes(').not.toThrow()')) {
      continue; // Skip "not throw" assertions
    }
    if (trimmed.startsWith('expect(') && trimmed.includes('.toBeGreaterThanOrEqual(')) {
      const m = trimmed.match(/expect\((.+?)\)\.toBeGreaterThanOrEqual\((.+?)\)/);
      if (m) {
        result.push(`console.log(${m[1]}); // >= ${m[2]}`);
        continue;
      }
    }
    if (trimmed.startsWith('expect(')) {
      // Generic: just skip complex expects
      continue;
    }

    result.push(line);
  }

  return result.join('\n');
}

// ─── Rewrite helpers ──────────────────────────────────────────

function rewriteExampleText(text: string, targetClass: string, sourceClasses: string[]): string {
  let result = text;
  const targetVar = classToVar[targetClass] || targetClass.charAt(0).toLowerCase() + targetClass.slice(1);

  for (const src of sourceClasses) {
    const srcVar = classToVar[src] || src.charAt(0).toLowerCase() + src.slice(1);
    result = result.replace(new RegExp(`\\bnew ${src}\\b`, 'g'), `new ${targetClass}`);
    if (srcVar !== targetVar) {
      result = result.replace(new RegExp(`\\b(const|let|var)\\s+${srcVar}\\b`, 'g'), `$1 ${targetVar}`);
      result = result.replace(new RegExp(`\\b${srcVar}\\.`, 'g'), `${targetVar}.`);
      result = result.replace(new RegExp(`\\b${srcVar}([\\[,);\\s])`, 'g'), `${targetVar}$1`);
    }
  }
  return result;
}

/**
 * Collect the inheritance chain for a class reflection (closest ancestor first).
 */
function getAncestorNames(ref: DeclarationReflection): string[] {
  const ancestors: string[] = [];
  let current = ref;
  while (current.extendedTypes?.length) {
    const parentType = current.extendedTypes[0];
    // TypeDoc reference type has .name
    const parentName = (parentType as any).name || (parentType as any)._target?.name;
    if (!parentName || ancestors.includes(parentName)) break;
    ancestors.push(parentName);
    // Try to find the parent reflection
    const parentRef = current.project?.getChildByName(parentName);
    if (parentRef && parentRef instanceof DeclarationReflection) {
      current = parentRef;
    } else {
      break;
    }
  }
  return ancestors;
}

// ─── Plugin entry ─────────────────────────────────────────────

export function load(app: Application) {
  const projectRoot = process.cwd();

  app.converter.on(Converter.EVENT_RESOLVE_END, (context) => {
    // Parse all test examples
    const testExamples = parseTestExamples(projectRoot);
    let rewritten = 0;
    let injected = 0;

    // Walk all reflections
    for (const ref of Object.values(context.project.reflections)) {
      if (!(ref instanceof DeclarationReflection)) continue;

      // We care about methods and accessors
      if (ref.kind !== ReflectionKind.Method && ref.kind !== ReflectionKind.Accessor) continue;

      // Get the class this method belongs to
      const parentClass = ref.parent;
      if (!parentClass || !(parentClass instanceof DeclarationReflection)) continue;
      if (parentClass.kind !== ReflectionKind.Class) continue;

      const className = parentClass.name;
      const methodName = ref.name;
      if (methodName.startsWith('_')) continue;

      // Get ancestor chain for rewriting
      const ancestors = getAncestorNames(parentClass);

      // Check all signatures (methods have signatures)
      const signatures = ref.signatures || (ref.getSignature ? [ref.getSignature] : []);

      for (const sig of signatures) {
        if (!sig) continue;

        // Case 1: Method already has @example from source — rewrite class names
        if (sig.comment?.blockTags?.length) {
          for (const tag of sig.comment.blockTags) {
            if (tag.tag !== '@example') continue;
            for (const part of tag.content) {
              if (part.kind === 'code' || part.kind === 'text') {
                const original = part.text;
                part.text = rewriteExampleText(part.text, className, ancestors);
                if (part.text !== original) rewritten++;
              }
            }
          }
        }

        // Case 2: No @example — check if we have a tagged test for this class.method
        const hasExample = sig.comment?.blockTags?.some(t => t.tag === '@example');
        if (!hasExample) {
          const key = `${className}.${methodName}`;
          const testEx = testExamples.get(key);
          if (testEx) {
            // Create comment if needed
            if (!sig.comment) {
              sig.comment = new Comment();
            }
            if (!sig.comment.blockTags) {
              sig.comment.blockTags = [];
            }
            // Add @example tag with test body
            const codeBlock = '```ts\n' + testEx.body + '\n```';
            sig.comment.blockTags.push(
              new CommentTag('@example', [{ kind: 'code', text: codeBlock }])
            );
            injected++;
          }
        }
      }
    }

    console.log(`  📝 TypeDoc plugin: ${rewritten} examples rewritten, ${injected} injected from tests`);
  });
}
