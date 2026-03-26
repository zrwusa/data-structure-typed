/**
 * Post-process TypeDoc HTML:
 * 1. Rewrite class names in inherited @example blocks
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

function rewriteText(text: string, targetClass: string, parentClasses: string[]): string {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  const targetVar = classToVar[targetClass] || targetClass.charAt(0).toLowerCase() + targetClass.slice(1);

  for (const parent of parentClasses) {
    const parentVar = classToVar[parent] || parent.charAt(0).toLowerCase() + parent.slice(1);
    result = result.replace(new RegExp(`\\bnew ${parent}\\b`, 'g'), `new ${targetClass}`);
    if (parentVar !== targetVar) {
      result = result.replace(new RegExp(`\\b(const|let|var)\\s+${parentVar}\\b`, 'g'), `$1 ${targetVar}`);
      result = result.replace(new RegExp(`\\b${parentVar}([.\\[,);\\s<])`, 'g'), `${targetVar}$1`);
      result = result.replace(new RegExp(`\\b${parentVar}$`, 'gm'), targetVar);
    }
  }
  return result;
}

interface MethodSection {
  name: string;
  fullHtml: string;
  hasExample: boolean;
  exampleHtml: string; // the <h4>Example</h4>...<pre>...</pre> block
}

/**
 * Parse HTML into method sections, extracting example blocks.
 */
function parseSections(html: string): MethodSection[] {
  const parts = html.split(/(<section class="tsd-panel tsd-member)/);
  const sections: MethodSection[] = [];

  for (let i = 1; i < parts.length; i += 2) {
    const sectionHtml = parts[i] + (parts[i + 1] || '');
    const nameMatch = sectionHtml.match(/id="([a-zA-Z_]+)"/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    if (name.startsWith('_')) continue;

    const hasExample = sectionHtml.includes('Example');

    // Extract example block (everything from first <h4>Example</h4> to end of its container)
    let exampleHtml = '';
    if (hasExample) {
      // TypeDoc wraps examples in <div class="tsd-comment ..."> containing <h4>Example</h4><pre>...
      const exMatch = sectionHtml.match(/<h4[^>]*>Example[\s\S]*?(?=<\/section|<section|$)/);
      if (exMatch) exampleHtml = exMatch[0];
    }

    sections.push({ name, fullHtml: sectionHtml, hasExample, exampleHtml });
  }
  return sections;
}

// ─── Main ─────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Docs directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  // Phase 1: Load all parent class example maps
  const parentExamples: Record<string, Record<string, string>> = {}; // className → { methodName → exampleHtml }

  const allParentClasses = new Set<string>();
  for (const parents of Object.values(childToParents)) {
    parents.forEach(p => allParentClasses.add(p));
  }

  for (const parentClass of allParentClasses) {
    const htmlFile = path.join(DOCS_DIR, `${parentClass}.html`);
    if (!fs.existsSync(htmlFile)) continue;
    const html = fs.readFileSync(htmlFile, 'utf-8');
    const sections = parseSections(html);
    parentExamples[parentClass] = {};
    for (const s of sections) {
      if (s.hasExample && s.exampleHtml) {
        parentExamples[parentClass][s.name] = s.exampleHtml;
      }
    }
  }

  // Phase 2: Process each child class
  let totalRewrites = 0;
  let totalInjections = 0;

  for (const [childClass, parents] of Object.entries(childToParents)) {
    const htmlFile = path.join(DOCS_DIR, `${childClass}.html`);
    if (!fs.existsSync(htmlFile)) continue;

    let html = fs.readFileSync(htmlFile, 'utf-8');

    // Step 1: Rewrite existing examples (class names)
    html = rewriteText(html, childClass, parents);

    // Step 2: Inject missing examples from parent classes
    const childSections = parseSections(html);
    let injected = 0;

    for (const section of childSections) {
      if (section.hasExample) continue; // already has example
      if (section.name.startsWith('_')) continue;

      // Find example from closest parent
      let donorExample = '';
      for (const parent of parents) {
        if (parentExamples[parent]?.[section.name]) {
          donorExample = parentExamples[parent][section.name];
          break;
        }
      }
      if (!donorExample) continue;

      // Rewrite class names in the donated example
      const rewritten = rewriteText(donorExample, childClass, parents);

      // Inject into the section: insert before </section>
      // Find this section in the HTML and add example before closing
      const sectionIdPattern = new RegExp(
        `(id="${section.name}"[\\s\\S]*?)(</section>)`,
        'g'
      );

      // We need to find the RIGHT section (there might be multiple with similar patterns)
      // Use a more specific match: the section containing the exact id
      const marker = `id="${section.name}"`;
      const pos = html.indexOf(marker);
      if (pos === -1) continue;

      // Find the next </section> after this position
      const closePos = html.indexOf('</section>', pos);
      if (closePos === -1) continue;

      // Insert the example block before </section>
      const exampleBlock = `<div class="tsd-comment tsd-typography injected-example">${rewritten}</div>`;
      html = html.slice(0, closePos) + exampleBlock + html.slice(closePos);
      injected++;
    }

    const original = fs.readFileSync(htmlFile, 'utf-8');
    if (html !== original) {
      fs.writeFileSync(htmlFile, html, 'utf-8');
      console.log(`  ✅ ${childClass}.html — rewrote from ${parents.join(', ')}${injected ? `, injected ${injected} examples` : ''}`);
      totalRewrites++;
      totalInjections += injected;
    }
  }

  console.log(`\n✅ Post-processed ${totalRewrites} files, injected ${totalInjections} examples`);
}

main();
