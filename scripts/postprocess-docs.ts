/**
 * Post-process TypeDoc HTML: rewrite class names in inherited @example blocks.
 *
 * When TypeDoc copies a base class's @example to a subclass page,
 * it keeps the original class name (e.g., `new BST(...)` on RedBlackTree's page).
 * This script rewrites those to use the subclass name + natural variable names.
 *
 * Run after `typedoc`: `ts-node scripts/postprocess-docs.ts`
 */

import * as fs from 'fs';
import * as path from 'path';

const DOCS_DIR = path.resolve(__dirname, '..', 'docs', 'api', 'classes');

/**
 * Inheritance chains: child → all ancestors whose class names should be replaced.
 */
const childToParents: Record<string, string[]> = {
  BST: ['BinaryTree'],
  AVLTree: ['BinaryTree', 'BST'],
  RedBlackTree: ['BinaryTree', 'BST'],
  TreeMap: ['BinaryTree', 'BST', 'RedBlackTree'],
  TreeSet: ['BinaryTree', 'BST', 'RedBlackTree'],
  TreeMultiMap: ['BinaryTree', 'BST', 'RedBlackTree'],
  TreeMultiSet: ['BinaryTree', 'BST', 'RedBlackTree'],
  AVLTreeMultiMap: ['BinaryTree', 'BST', 'AVLTree'],
  AVLTreeCounter: ['BinaryTree', 'BST', 'AVLTree'],
  MinHeap: ['Heap'],
  MaxHeap: ['Heap'],
  PriorityQueue: ['Heap'],
  MinPriorityQueue: ['Heap', 'PriorityQueue'],
  MaxPriorityQueue: ['Heap', 'PriorityQueue'],
};

/**
 * Class → preferred variable name for examples.
 */
const classToVar: Record<string, string> = {
  BinaryTree: 'tree',
  BST: 'bst',
  AVLTree: 'avl',
  RedBlackTree: 'rbt',
  TreeMap: 'tm',
  TreeSet: 'ts',
  TreeMultiMap: 'tmm',
  TreeMultiSet: 'tms',
  AVLTreeMultiMap: 'avlmm',
  AVLTreeCounter: 'avlc',
  Heap: 'heap',
  MinHeap: 'minHeap',
  MaxHeap: 'maxHeap',
  PriorityQueue: 'pq',
  MinPriorityQueue: 'minPQ',
  MaxPriorityQueue: 'maxPQ',
};

function rewriteHtml(html: string, targetClass: string, parentClasses: string[]): string {
  let result = html;
  const targetVar = classToVar[targetClass] || targetClass.charAt(0).toLowerCase() + targetClass.slice(1);

  for (const parent of parentClasses) {
    const parentVar = classToVar[parent] || parent.charAt(0).toLowerCase() + parent.slice(1);

    // Replace in code blocks: new ParentClass → new TargetClass
    // HTML-encoded: <code> blocks and <pre> blocks
    result = result.replace(new RegExp(`\\bnew ${parent}\\b`, 'g'), `new ${targetClass}`);

    // Replace variable names: parentVar. → targetVar. (only in code contexts)
    // Be careful: only replace whole-word variable usage
    if (parentVar !== targetVar) {
      // const/let/var declarations
      result = result.replace(new RegExp(`\\b(const|let|var)\\s+${parentVar}\\b`, 'g'), `$1 ${targetVar}`);
      // Variable usage before . [ , ) ; whitespace
      result = result.replace(new RegExp(`\\b${parentVar}([.\\[,);\\s<])`, 'g'), `${targetVar}$1`);
      // Variable at end of line/string
      result = result.replace(new RegExp(`\\b${parentVar}$`, 'gm'), targetVar);
    }
  }

  return result;
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Docs directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  let totalRewrites = 0;

  for (const [childClass, parents] of Object.entries(childToParents)) {
    const htmlFile = path.join(DOCS_DIR, `${childClass}.html`);
    if (!fs.existsSync(htmlFile)) continue;

    const original = fs.readFileSync(htmlFile, 'utf-8');
    const rewritten = rewriteHtml(original, childClass, parents);

    if (rewritten !== original) {
      fs.writeFileSync(htmlFile, rewritten, 'utf-8');
      // Count replacements
      const diff = original.length - rewritten.length; // rough indicator
      const parentNames = parents.join(', ');
      console.log(`  ✅ ${childClass}.html — rewrote references from ${parentNames}`);
      totalRewrites++;
    }
  }

  console.log(`\n✅ Post-processed ${totalRewrites} doc files`);
}

main();
