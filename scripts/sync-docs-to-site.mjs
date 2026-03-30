#!/usr/bin/env node

/**
 * Sync docs/*.md → docs-site-docusaurus/docs/guide/*.md
 * Adds frontmatter and rewrites relative links.
 *
 * Usage: node scripts/sync-docs-to-site.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');
const SITE_DIR = join(ROOT, 'docs-site-docusaurus', 'docs', 'guide');

const FILES = [
  {
    src: 'GUIDES.md',
    dest: 'guides.md',
    frontmatter: {
      sidebar_label: 'GUIDES',
      description: 'Real-world examples and production patterns for data-structure-typed.',
      title: 'Guides — Real-World Examples & Production Patterns',
      keywords: ['data-structure-typed examples', 'typescript data structures patterns', 'production code examples'],
    },
  },
  {
    src: 'INTEGRATIONS.md',
    dest: 'integrations.md',
    frontmatter: {
      sidebar_label: 'INTEGRATIONS',
      description: 'Integrate data-structure-typed with React, Express, NestJS, and other frameworks. Production-ready patterns.',
      title: 'Framework Integrations — React, Express, NestJS',
      keywords: ['data-structure-typed react', 'typescript data structures express', 'nestjs data structures', 'production patterns'],
    },
  },
  {
    src: 'FAQ.md',
    dest: 'faq.md',
    frontmatter: {
      sidebar_label: 'FAQ',
      sidebar_position: 7,
      description: 'Frequently asked questions about data-structure-typed.',
      title: 'FAQ — Frequently Asked Questions',
      keywords: ['data-structure-typed faq', 'typescript data structures questions'],
    },
  },
  {
    src: 'OVERVIEW.md',
    dest: 'overview.md',
    frontmatter: {
      sidebar_label: 'OVERVIEW',
      description: 'Complete overview of all 20+ data structures: trees, heaps, graphs, queues, linked lists, hash maps, and more.',
      title: 'Data Structures Overview — Trees, Heaps, Graphs, Queues',
      keywords: ['typescript data structures overview', 'red black tree', 'heap', 'priority queue', 'trie', 'graph', 'deque', 'treemap', 'treeset'],
    },
  },
  {
    src: 'CONCEPTS.md',
    dest: 'concepts.md',
    frontmatter: {
      sidebar_label: 'CONCEPTS',
      description: 'Core fundamentals and theory behind data-structure-typed. BST, balanced trees, heap, iterator protocol, and decision guide.',
      title: 'Concepts — Core Fundamentals & Theory',
      keywords: ['data structures concepts', 'binary search tree', 'balanced tree', 'heap theory', 'typescript data structures'],
    },
  },
  {
    src: 'ARCHITECTURE.md',
    dest: 'architecture.md',
    frontmatter: {
      sidebar_label: 'ARCHITECTURE',
      description: 'Design philosophy, V8 JIT optimizations, self-balancing strategies, and internal architecture of data-structure-typed.',
      title: 'Architecture — Design & Implementation Details',
      keywords: ['data structures architecture', 'red black tree implementation', 'v8 optimization', 'typescript library design'],
    },
  },
];

// Link rewrites: relative docs/ paths → site guide/ paths
const LINK_REWRITES = [
  [/\(\.\.\/README\.md\)/g, '(/.md)'],
  [/\(\.\/GUIDES\.md\)/g, '(/guide/guides.md)'],
  [/\(\.\/INTEGRATIONS\.md\)/g, '(/guide/integrations.md)'],
  [/\(\.\/PERFORMANCE\.md\)/g, '(/guide/performance.md)'],
  [/\(\.\/REFERENCE\.md\)/g, '(/guide/overview.md)'],
  [/\(\.\/OVERVIEW\.md\)/g, '(/guide/overview.md)'],
  [/\(\.\/CONCEPTS\.md\)/g, '(/guide/concepts.md)'],
  [/\(\.\/ARCHITECTURE\.md\)/g, '(/guide/architecture.md)'],
];

let synced = 0;

for (const file of FILES) {
  const srcPath = join(DOCS_DIR, file.src);
  const destPath = join(SITE_DIR, file.dest);

  if (!existsSync(srcPath)) {
    console.warn(`⚠️  ${file.src} not found, skipping`);
    continue;
  }

  let content = readFileSync(srcPath, 'utf-8');

  // Strip existing title (first # heading) — frontmatter title replaces it
  const titleMatch = content.match(/^# .+\n/);
  const originalTitle = titleMatch ? titleMatch[0].replace('# ', '').trim() : '';
  content = content.replace(/^# .+\n+/, '');

  // Rewrite links
  for (const [pattern, replacement] of LINK_REWRITES) {
    content = content.replace(pattern, replacement);
  }

  // Build frontmatter
  const fm = ['---'];
  for (const [key, val] of Object.entries(file.frontmatter)) {
    if (Array.isArray(val)) {
      fm.push(`${key}: [${val.map(v => `"${v}"`).join(', ')}]`);
    } else if (typeof val === 'number') {
      fm.push(`${key}: ${val}`);
    } else {
      fm.push(`${key}: "${val}"`);
    }
  }
  fm.push('---');
  fm.push('');

  // Add back a clean title
  const title = file.frontmatter.sidebar_label || originalTitle;
  const output = fm.join('\n') + `# ${title}\n\n` + content;

  writeFileSync(destPath, output);
  console.log(`✅ ${file.src} → ${file.dest}`);
  synced++;
}

console.log(`\nSynced ${synced} file(s).`);
