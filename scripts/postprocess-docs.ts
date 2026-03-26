/**
 * Post-process TypeDoc HTML:
 * 1. Rewrite class names in inherited @example blocks (handles span-wrapped tokens)
 * 2. Copy @example from base class methods to subclass methods that lack them
 *
 * Run after `typedoc`: `ts-node scripts/postprocess-docs.ts`
 */

import * as fs from 'fs';
import * as path from 'path';

const DOCS_DIR = path.resolve(__dirname, '..', 'docs', 'api', 'classes');

/** child → ordered list of ancestors (closest first) */
const childToParents: Record<string, string[]> = {
  BST: ['BinaryTree'],
  AVLTree: ['BST', 'BinaryTree'],
  RedBlackTree: ['BST', 'BinaryTree'],
  TreeMap: ['RedBlackTree', 'BST', 'BinaryTree'],
  TreeSet: ['RedBlackTree', 'BST', 'BinaryTree'],
  TreeMultiMap: ['RedBlackTree', 'BST', 'BinaryTree'],
  TreeMultiSet: ['RedBlackTree', 'BST', 'BinaryTree'],
  AVLTreeMultiMap: ['AVLTree', 'BST', 'BinaryTree'],
  AVLTreeCounter: ['AVLTree', 'BST', 'BinaryTree'],
  MinHeap: ['Heap'],
  MaxHeap: ['Heap'],
  PriorityQueue: ['Heap'],
  MinPriorityQueue: ['PriorityQueue', 'Heap'],
  MaxPriorityQueue: ['PriorityQueue', 'Heap'],
};

const classToVar: Record<string, string> = {
  BinaryTree: 'tree', BST: 'bst', AVLTree: 'avl', RedBlackTree: 'rbt',
  TreeMap: 'tm', TreeSet: 'ts', TreeMultiMap: 'tmm', TreeMultiSet: 'tms',
  AVLTreeMultiMap: 'avlmm', AVLTreeCounter: 'avlc',
  Heap: 'heap', MinHeap: 'minHeap', MaxHeap: 'maxHeap',
  PriorityQueue: 'pq', MinPriorityQueue: 'minPQ', MaxPriorityQueue: 'maxPQ',
};

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Rewrite class and variable names in TypeDoc HTML.
 * TypeDoc wraps tokens in <span> tags, so we can't use simple `new ClassName` regex.
 * Instead we target:
 *   - Class names: `>ClassName<` (inside span content)
 *   - Variable names: `>varName<` (inside span content, only in code blocks)
 */
function rewriteHtml(html: string, targetClass: string, parentClasses: string[]): string {
  if (!html || typeof html !== 'string') return html;
  let result = html;
  const targetVar = classToVar[targetClass] || targetClass.charAt(0).toLowerCase() + targetClass.slice(1);

  for (const parent of parentClasses) {
    const parentVar = classToVar[parent] || parent.charAt(0).toLowerCase() + parent.slice(1);

    // Replace class name inside span tags: >BinaryTree< → >RedBlackTree<
    result = result.replace(new RegExp(`>${parent}<`, 'g'), `>${targetClass}<`);

    // Replace class name in plain text (non-HTML contexts, e.g. injected blocks)
    result = result.replace(new RegExp(`\\bnew ${parent}\\b`, 'g'), `new ${targetClass}`);

    // Replace variable names inside span tags: >tree< → >rbt<
    if (parentVar !== targetVar) {
      // Only replace exact span content matches to avoid false positives
      result = result.replace(new RegExp(`>${parentVar}<`, 'g'), `>${targetVar}<`);
      // Plain text variable references
      result = result.replace(new RegExp(`\\b(const|let|var)\\s+${parentVar}\\b`, 'g'), `$1 ${targetVar}`);
      result = result.replace(new RegExp(`\\b${parentVar}([.\\[,);\\s<])`, 'g'), `${targetVar}$1`);
      result = result.replace(new RegExp(`\\b${parentVar}$`, 'gm'), targetVar);
    }
  }
  return result;
}

/**
 * Extract the example HTML block from a method section.
 * Returns the full block from <h4>Example</h4> through the end of its container.
 */
function extractExampleBlock(sectionHtml: string): string {
  // Find Example heading and everything up to next heading or section end
  const match = sectionHtml.match(
    /(<h4[^>]*>Example[\s\S]*?<\/pre>)/
  );
  return match ? match[1] : '';
}

// ─── Main ─────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Docs directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  // Phase 1: Load all parent class method examples
  const parentExamples: Record<string, Record<string, string>> = {};

  const allParentClasses = new Set<string>();
  for (const parents of Object.values(childToParents)) {
    parents.forEach(p => allParentClasses.add(p));
  }

  for (const parentClass of allParentClasses) {
    const htmlFile = path.join(DOCS_DIR, `${parentClass}.html`);
    if (!fs.existsSync(htmlFile)) continue;
    const html = fs.readFileSync(htmlFile, 'utf-8');

    parentExamples[parentClass] = {};

    // Split into sections by method id
    const regex = /id="([a-zA-Z_]+)"[\s\S]*?(?=<a id="[a-zA-Z_]+"|\s*<\/section>\s*<section|\s*$)/g;

    // Use a simpler approach: find all method sections
    const sectionStarts: { name: string; pos: number }[] = [];
    const idRegex = /<a id="([a-zA-Z_]+)" class="tsd-anchor"><\/a>/g;
    let m;
    while ((m = idRegex.exec(html)) !== null) {
      const name = m[1];
      if (!name.startsWith('_') && !name.includes('.') && !name.includes('-')) {
        sectionStarts.push({ name, pos: m.index });
      }
    }

    for (let i = 0; i < sectionStarts.length; i++) {
      const start = sectionStarts[i].pos;
      const end = i + 1 < sectionStarts.length ? sectionStarts[i + 1].pos : html.length;
      const sectionHtml = html.slice(start, end);

      if (sectionHtml.includes('Example')) {
        const exBlock = extractExampleBlock(sectionHtml);
        if (exBlock) {
          parentExamples[parentClass][sectionStarts[i].name] = exBlock;
        }
      }
    }
  }

  // Phase 2: Process each child class
  let totalFiles = 0;
  let totalInjections = 0;

  for (const [childClass, parents] of Object.entries(childToParents)) {
    const htmlFile = path.join(DOCS_DIR, `${childClass}.html`);
    if (!fs.existsSync(htmlFile)) continue;

    const original = fs.readFileSync(htmlFile, 'utf-8');
    let html = original;

    // Step 1: Rewrite existing class/variable names in the whole file
    html = rewriteHtml(html, childClass, parents);

    // Step 2: Find methods without examples and inject from parents
    let injected = 0;
    const sectionStarts: { name: string; pos: number }[] = [];
    const idRegex = /<a id="([a-zA-Z_]+)" class="tsd-anchor"><\/a>/g;
    let m;
    while ((m = idRegex.exec(html)) !== null) {
      const name = m[1];
      if (!name.startsWith('_') && !name.includes('.') && !name.includes('-')) {
        sectionStarts.push({ name, pos: m.index });
      }
    }

    for (let i = 0; i < sectionStarts.length; i++) {
      const start = sectionStarts[i].pos;
      const end = i + 1 < sectionStarts.length ? sectionStarts[i + 1].pos : html.length;
      const sectionHtml = html.slice(start, end);

      if (sectionHtml.includes('Example')) continue; // already has example

      const methodName = sectionStarts[i].name;

      // Find example from closest parent
      let donorExample = '';
      for (const parent of parents) {
        if (parentExamples[parent]?.[methodName]) {
          donorExample = parentExamples[parent][methodName];
          break;
        }
      }
      if (!donorExample) continue;

      // Rewrite class names in the donated example
      const rewritten = rewriteHtml(donorExample, childClass, parents);

      // Insert before the section's </section>
      const closeSectionPos = html.indexOf('</section>', start);
      if (closeSectionPos === -1 || closeSectionPos > end + 500) continue;

      const wrapper = `<div class="tsd-comment tsd-typography">${rewritten}</div>`;
      html = html.slice(0, closeSectionPos) + wrapper + html.slice(closeSectionPos);

      // Adjust positions for subsequent sections
      const delta = wrapper.length;
      for (let j = i + 1; j < sectionStarts.length; j++) {
        sectionStarts[j].pos += delta;
      }
      injected++;
    }

    if (html !== original) {
      fs.writeFileSync(htmlFile, html, 'utf-8');
      const injectMsg = injected ? `, injected ${injected} examples` : '';
      console.log(`  ✅ ${childClass}.html — rewrote from ${parents.join(', ')}${injectMsg}`);
      totalFiles++;
      totalInjections += injected;
    }
  }

  console.log(`\n✅ Post-processed ${totalFiles} files, injected ${totalInjections} examples`);
}

main();
