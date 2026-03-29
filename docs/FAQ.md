---
title: FAQ — Frequently Asked Questions
sidebar_label: "FAQ"description: Common questions about data-structure-typed — TreeMap in JavaScript, priority queues, rank queries, bundle size, and more.
keywords: [typescript data structures, treemap javascript, priority queue typescript, sorted set javascript, rank query, faq]
sidebar_position: 7
---

# FAQ

## Does JavaScript have a TreeMap or TreeSet?

Not natively. JavaScript's `Map` and `Set` are hash-based and unordered. This library provides `TreeMap` and `TreeSet` backed by Red-Black Trees — offering sorted iteration, `floor`/`ceiling`/`higher`/`lower` lookups, and `getRank`/`getByRank`/`rangeByRank` queries.

```typescript
import { TreeMap } from 'data-structure-typed';

const map = new TreeMap<number, string>();
map.set(3, 'c');
map.set(1, 'a');
map.set(2, 'b');

// Sorted iteration (by key)
for (const [key, value] of map) {
  console.log(key, value); // 1 'a', 2 'b', 3 'c'
}

// NavigableMap operations
map.floor(2.5);   // [2, 'b'] — largest key ≤ 2.5
map.ceiling(1.5); // [2, 'b'] — smallest key ≥ 1.5
```

## When should I use a Heap instead of sorting an array?

When you need to repeatedly access the smallest or largest element. Sorting an array is O(n log n) every time you add an element. A Heap gives you O(log n) insert and O(1) access to the top element.

**Use Heap when:**
- Building a priority queue or task scheduler
- Finding top-k elements from a stream
- Implementing Dijkstra's algorithm
- Any scenario where you repeatedly need the min/max

```typescript
import { MinHeap } from 'data-structure-typed';

const tasks = new MinHeap<number>([5, 1, 3, 7, 2]);
tasks.poll(); // 1 (O(log n), not O(n log n))
tasks.add(0);
tasks.peek(); // 0
```

## Does this library support rank and range queries?

Yes. Enable with `{ enableOrderStatistic: true }` on any tree-based structure:

```typescript
import { RedBlackTree } from 'data-structure-typed';

const tree = new RedBlackTree<number>([10, 20, 30, 40, 50], {
  enableOrderStatistic: true
});

tree.getRank(30);          // 2 — two elements precede 30 in tree order
tree.getByRank(0);         // 10 — first element in tree order
tree.rangeByRank(1, 3);    // [20, 30, 40] — positions 1 through 3
```

Works with `TreeMap`, `TreeSet`, `TreeMultiMap`, and `TreeMultiSet` too.

## Is it faster than native arrays for ordered operations?

For ordered insert + lookup: **yes, significantly**.

| Operation | Sorted Array | Red-Black Tree |
|-----------|-------------|----------------|
| Insert (maintain order) | O(n) | O(log n) |
| Find by key | O(log n) | O(log n) |
| Find min/max | O(1) | O(log n) |
| Delete by key | O(n) | O(log n) |
| Get kth element | O(1) | O(log n) |

For 10,000+ elements, the O(n) insert cost of arrays becomes a bottleneck. Trees maintain O(log n) regardless of size.

See [PERFORMANCE.md](https://github.com/zrwusa/data-structure-typed/blob/main/docs/PERFORMANCE.md) for benchmark results.

## Can I use this in React / Node.js / browser?

Yes. The library ships ESM, CJS, and UMD builds. It works in:

- **Node.js** (any version supporting ES2015+)
- **Browsers** (via bundler or UMD script tag)
- **React / Next.js / Vue / Angular** (import normally)
- **Deno / Bun** (ESM compatible)

Zero dependencies means no compatibility concerns.

## What data structures are included?

| Category | Structures |
|----------|-----------|
| Trees | RedBlackTree, AVLTree, BST, TreeMap, TreeSet, TreeMultiMap, TreeMultiSet |
| Heaps | Heap, MinHeap, MaxHeap, MinPriorityQueue, MaxPriorityQueue |
| Queues | Queue, Deque |
| Lists | SinglyLinkedList, DoublyLinkedList, SkipList |
| Hashing | HashMap |
| Graphs | DirectedGraph, UndirectedGraph |
| Strings | Trie |
| Arrays | SegmentTree, BinaryIndexedTree (Fenwick Tree), Matrix |
| Basic | Stack |

## Is this library production-ready?

Yes.

- **2600+ tests**, 99%+ code coverage
- **Zero dependencies**
- **Type-safe** — full TypeScript generics
- **Actively maintained** — regular releases
- Every release passes typecheck, lint, and full test suite via CI

## How does this compare to js-sdsl?

| Feature | data-structure-typed | js-sdsl |
|---------|---------------------|---------|
| Data structures | 20+ | ~6 |
| API style | Unified Array-like | Mixed |
| Order-statistic (getRank/getByRank) | ✅ | ❌ |
| Tree-shaking subpaths | ✅ | ❌ |
| Maintenance | Active (2026) | Inactive |
| Bundle (full) | ~143KB min | ~45KB min |

`data-structure-typed` is broader and more actively maintained. js-sdsl is smaller if you only need a few structures.

## What is the bundle size?

| Import | Size (ESM) |
|--------|-----------|
| Full bundle | 598KB |
| `data-structure-typed/binary-tree` | 315KB |
| `data-structure-typed/graph` | 127KB |
| `data-structure-typed/linked-list` | 93KB |
| `data-structure-typed/queue` | 91KB |
| `data-structure-typed/heap` | 36KB |
| `data-structure-typed/priority-queue` | 30KB |
| `data-structure-typed/hash` | 29KB |
| `data-structure-typed/matrix` | 28KB |
| `data-structure-typed/trie` | 27KB |
| `data-structure-typed/stack` | 18KB |

UMD bundle: ~143KB minified. `sideEffects: false` enables full tree-shaking with modern bundlers.

## Can I pass raw data without converting it first?

Yes. Three patterns depending on what you want to store:

```typescript
const users = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// 1. Extract a field — only that field is stored
const ids = new TreeSet<number, typeof users[0]>(
  users,
  { toElementFn: u => u.id }
);
// [1, 2, 3]

// 2. Store full objects — sort by a field (raw data preserved!)
const fullSet = new TreeSet<typeof users[0]>(
  users,
  { comparator: (a, b) => a.id - b.id }
);
// [{ id: 1, name: 'Alice' }, { id: 2, ... }, { id: 3, ... }]

// 3. Split into key-value — key for lookup, full object as value
const map = new TreeMap<number, typeof users[0]>(
  users,
  { toEntryFn: u => [u.id, u] }
);
// map.get(1) → { id: 1, name: 'Alice' }
```

| I want to... | Use |
|---|---|
| Store only IDs/scores/prices | `toElementFn` |
| Store full objects, sorted by a field | `comparator` |
| Look up full objects by a key | `toEntryFn` |

## How do I build a leaderboard with this library?

```typescript
import { TreeMap } from 'data-structure-typed';

const leaderboard = new TreeMap<number, string>(
  [[100, 'Alice'], [250, 'Bob'], [180, 'Charlie']],
  { comparator: (a, b) => b - a, enableOrderStatistic: true }
);

// Top 3 players (descending score order)
leaderboard.rangeByRank(0, 2);
// → [[250, 'Bob'], [180, 'Charlie'], [100, 'Alice']]

// What rank is score 180?
leaderboard.getRank(180); // 1 (0-indexed, second position)
```

## How do I build autocomplete with a Trie?

```typescript
import { Trie } from 'data-structure-typed';

const trie = new Trie(['apple', 'app', 'application', 'banana', 'band']);

trie.getWords('app');  // ['app', 'apple', 'application']
trie.getWords('ban');  // ['banana', 'band']
trie.hasPrefix('app'); // true
trie.has('apple');     // true
```
