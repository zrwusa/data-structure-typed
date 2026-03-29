import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/guide/installation">
            Get Started →
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/api/">
            API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: '🏠 Uniform API',
    description: 'push, pop, shift, map, filter, reduce — same methods across all structures. Learn once, use everywhere.',
  },
  {
    title: '🛡️ Type Safe',
    description: 'Full generics with strict TypeScript support. Every method returns the correct type — no casting needed.',
  },
  {
    title: '✨ Zero Friction',
    description: 'Spread it [...tree], loop it for...of, pass it to new Set(). Works with every JavaScript API out of the box.',
  },
  {
    title: '📦 Zero Dependencies',
    description: 'Pure TypeScript. No runtime dependencies. Tree-shakeable with subpath exports — bundle only what you use.',
  },
  {
    title: '🔄 Raw Data In, Structure Out',
    description: 'Pass raw objects directly with toEntryFn, toElementFn, or comparator. No .map() pre-processing needed — unique to this library in JS/TS.',
  },
  {
    title: '✅ Battle-Tested',
    description: '2600+ tests, 99%+ coverage. CLRS-correct Red-Black Tree, ACL-style Segment Tree. Production-ready.',
  },
];

const structures = [
  { category: 'Trees', items: 'RedBlackTree, AVLTree, BST, TreeMap, TreeSet, TreeMultiMap, TreeMultiSet' },
  { category: 'Heaps', items: 'Heap, MinHeap, MaxHeap, MinPriorityQueue, MaxPriorityQueue' },
  { category: 'Queues & Stacks', items: 'Queue, Deque, Stack' },
  { category: 'Linked Lists', items: 'SinglyLinkedList, DoublyLinkedList, SkipList' },
  { category: 'Hashing', items: 'HashMap' },
  { category: 'Graphs', items: 'DirectedGraph, UndirectedGraph' },
  { category: 'Strings', items: 'Trie' },
  { category: 'Arrays', items: 'SegmentTree, BinaryIndexedTree, Matrix' },
];

const useCases = [
  { title: 'Priority Queue', link: '/docs/guide/use-cases/priority-queue-typescript', desc: 'Task scheduling, top-k problems, Dijkstra' },
  { title: 'TreeMap / TreeSet', link: '/docs/guide/use-cases/treemap-javascript', desc: 'Sorted maps, floor/ceiling, range queries' },
  { title: 'Array + Sort Too Slow?', link: '/docs/guide/use-cases/array-sort-alternative', desc: 'O(log n) insert vs O(n log n) re-sort' },
  { title: 'Heap vs Sorting', link: '/docs/guide/use-cases/heap-vs-sorting', desc: 'When to use which' },
  { title: 'Map vs TreeMap', link: '/docs/guide/use-cases/map-vs-treemap', desc: 'When native Map isn\'t enough' },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout title="Home" description="Production-ready TypeScript data structures library — Heap, TreeMap, TreeSet, Trie, Graph, Priority Queue, Deque, and more. Zero dependencies, type-safe, with rank and range query support.">
      <HomepageHeader />
      <main>
        <section style={{padding: '4rem 0'}}>
          <div className="container">
            <div className="row" style={{justifyContent: 'center'}}>
              {features.map((f, i) => (
                <div key={i} className={clsx('col col--4')} style={{marginBottom: '2rem'}}>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{padding: '2rem 0 4rem', background: 'var(--ifm-background-surface-color)'}}>
          <div className="container">
            <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>📚 Data Structures Available</h2>
            <div className="row" style={{justifyContent: 'center'}}>
              {structures.map((s, i) => (
                <div key={i} className={clsx('col col--6')} style={{marginBottom: '1.5rem'}}>
                  <h4>{s.category}</h4>
                  <p style={{color: 'var(--ifm-color-emphasis-700)', fontSize: '0.95rem'}}>{s.items}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{padding: '4rem 0'}}>
          <div className="container">
            <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>🎯 Use Cases & Guides</h2>
            <div className="row" style={{justifyContent: 'center'}}>
              {useCases.map((u, i) => (
                <div key={i} className={clsx('col col--4')} style={{marginBottom: '1.5rem'}}>
                  <Link to={u.link} style={{textDecoration: 'none'}}>
                    <h4>{u.title}</h4>
                    <p style={{color: 'var(--ifm-color-emphasis-700)', fontSize: '0.9rem'}}>{u.desc}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
