# data-structure-typed

English | [简体中文](./README_CN.md)

A comprehensive TypeScript data structures library with production-ready implementations.

**We TypeScript/JavaScript devs want something like C++'s `STL`, Java's `java.util` Collections, or Python's `collections` — but with an API that feels as intuitive and ergonomic as JavaScript's native `Array`.** If that's what you're looking for, you're in the right place. This is a zero-dependency library, and you can also install individual data structure packages separately if you prefer a more modular setup.

![npm](https://img.shields.io/npm/dm/data-structure-typed)
![GitHub contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed)
![GITHUB Star](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
[![codecov](https://img.shields.io/codecov/c/github/zrwusa/data-structure-typed)](https://codecov.io/gh/zrwusa/data-structure-typed)
![eslint](https://aleen42.github.io/badges/src/eslint.svg)
![NPM](https://img.shields.io/npm/l/data-structure-typed)
![npm](https://img.shields.io/npm/v/data-structure-typed)

**📦 [Installation](#-installation) • 🎮 [Playground](#-playground) • ⚡ [Quick Start](#-quick-start-30-seconds) • 📖 [Docs](#-documentation) • 📋 [API](https://data-structure-typed-docs.vercel.app/) • 💡 [Examples](./docs/GUIDES.md)**

---

## Table of Contents

1. [Installation](#-installation)
2. [Playground](#-playground)
3. [Quick Start](#-quick-start-30-seconds)
4. [Who Should Use This?](#-who-should-use-this)
5. [Why Not Just Array or Map?](#-why-not-just-array-or-map)
6. [Key Features](#-key-features)
7. [Data Structures](#-data-structures-available)
8. [Documentation](#-documentation)

---

## 📦 Installation

```bash
npm i data-structure-typed
```

```bash
yarn add data-structure-typed
```

```bash
pnpm add data-structure-typed
```

### Individual Packages

Use only what you need:

```bash
npm i heap-typed deque-typed red-black-tree-typed
```

---

## 🎮 Playground

Try it instantly:

- [Node.js TypeScript](https://stackblitz.com/edit/stackblitz-starters-e1vdy3zw?file=src%2Findex.ts)
- [Node.js JavaScript](https://stackblitz.com/edit/stackblitz-starters-oczhrfzn?file=src%2Findex.js)
- [React TypeScript](https://stackblitz.com/edit/vitejs-vite-7bva1zhd?file=src%2FApp.tsx)
- [NestJS](https://stackblitz.com/edit/nestjs-typescript-starter-q9n7okgc?file=src%2Fproduct%2Fservices%2Fproduct-price-index.service.ts)

---

## 🎯 Who Should Use This?

**If you are building ranked collections, scheduling queues, or sorted data structures in TypeScript,**  
**consider `data-structure-typed` instead of hand-rolled Arrays or Maps.**

### Perfect for:

- **Leaderboards & Rankings** — Maintain top-K efficiently without repeated sorting
- **Task Scheduling** — Priority queues, ordered execution, time-based operations
- **Real-Time Dashboards** — Grafana-style workloads with instant lookups
- **Time-Series Data** — Sorted insertion + fast range queries
- **Search & Autocomplete** — Prefix matching at scale
- **Graph Problems** — Pathfinding, cycle detection, topological sorting

---

## ⚡ Why Not Just Array or Map?

| Use Case               | Array                | Map              | data-structure-typed |
|------------------------|----------------------|------------------|:--------------------:|
| **Sorted Lookup**      | ❌ O(n)               | ❌ Unordered      |    ✅ **O(log n)**    |
| **Insert at Position** | ❌ O(n) shift         | ❌ No position    |    ✅ **O(log n)**    |
| **Leaderboard Top-K**  | ❌ Re-sort O(n log n) | ❌ Manual sort    |    ✅ **Instant**     |
| **Remove from Front**  | ❌ O(n)               | ❌ No dequeue     |      ✅ **O(1)**      |
| **Prefix Search**      | ❌ O(n*m)             | ❌ Not applicable |    ✅ **O(m + k)**    |
| **Familiar API**       | ✅ Yes                | ✅ Yes            |      ✅ **Same**      |

### Real-World Pain Point

```javascript
// ❌ WITHOUT data-structure-typed
const queue = [1, 2, 3, ..., 100000
]
;
for (let i = 0; i < 100000; i++) {
  queue.shift();  // O(n) - Reindexes EVERY element!
}
// Time: 2829ms ❌
```

```javascript
// ✅ WITH data-structure-typed (Deque)
const deque = new Deque([1, 2, 3, ..., 100000])
;
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1) - Just moves a pointer
}
// Time: 5.83ms ✅
// **484x faster!**
```

---

## 🚀 Performance (TL;DR)

- **Optimized for V8 hot paths** (see [PERFORMANCE.md](./docs/PERFORMANCE.md) for measured benchmarks)
  - Repeated Array.shift() O(n) → Deque O(1)
  - Frequent update + keep-sorted workflows → RedBlackTree O(log n) operations
  - Avoid repeated `Array.sort()` if you must maintain sorted order after each update

- **Optimized for V8 JIT** (Node.js 18+, modern browsers)

- **Tree-shakable** ESM / CJS / legacy builds

[//]: # (No deletion!!! Start of README Performance Section)

| Data Structure | Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
|----------------|-----------|----------|-------------|----------|---------------|
| Queue | 1M push | 26.93 | 23.83 | 1.70 | 27.59 |
| Deque | 1M push | 9.77 | 26.81 | 1.76 | 7.79 |
| DoublyLinkedList | 100k push | 5.70 | 2.40 | 5.70 | 1.90 |
| SinglyLinkedList | 100K unshift & shift | 3.77 | 1958.39 | 4.80 | - |
| PriorityQueue | 100K add | 4.00 | - | 1.05 | 4.96 |
| TreeSet | 1M add | 995.72 | - | 462.00 | 677.58 |
| TreeMap | 1M set | 978.72 | - | 512.00 | 623.23 |
| TreeMultiSet | 1M add (TreeMultiSet expanded iteration) | 217.73 | - | 752.00 | - |
| TreeMultiMap | 1M add (TreeMultiMap bucketed) | 366.19 | - | 731.00 | - |
| RedBlackTree | 1M get | 99.24 | - | 52.97 | - |
| BST | 10K add randomly | 5.50 | - | - | - |
| BinaryTree | 1K add randomly | 9.77 | - | - | - |
| HashMap | 1M set | 146.17 | 144.83 | 76.26 | 94.16 |
| Trie | 100K add | 141.10 | - | - | - |
| DirectedGraph | 1K addVertex | 0.05 | - | - | - |
| Stack | 1M push | 46.38 | 30.28 | 1.65 | 32.38 |

[//]: # (No deletion!!! End of README Performance Section)

📊 [Full benchmarks →](./docs/PERFORMANCE.md) | [Interactive report →](./docs/benchmark.html)

---

## ✨ Key Features

### 🏠 Uniform API

Don't learn new APIs. Just use `push`, `pop`, `map`, `filter`, and `reduce` everywhere.

```javascript
// All linear structures use THE SAME 4 methods
const deque = new Deque([1, 2, 3]);
const queue = new Queue([1, 2, 3]);
const doublyLinkeList = new DoublyLinkedList([1, 2, 3]);
const singlyLinkedList = new SinglyLinkedList([1, 2, 3]);

// They ALL support:
structure.push(item);          // Add to end
structure.pop();               // Remove from end
structure.shift();             // Remove from start
structure.unshift(item);       // Add to start
```

### 🛡️ Type Safe

Full generics and strict TypeScript support out of the box.

```typescript
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');
tree.set(2, 'Bob');

// Type-safe access
const value = tree.get(1);  // Type: string | undefined
```

### ✨ Zero Friction

Works everywhere. Spread it `[...]`, loop it `for..of`, convert it instantly.

```javascript
// All data structures work with iterator protocol
const tree = new RedBlackTree([5, 2, 8]);
const sorted = [...tree];              // Spread operator
for (const item of tree) {
}           // for...of loop
const set = new Set(tree);             // Set constructor
```

---

## 💡 When Should I Consider This Library?

✅ **When you need:**

- Top-K / Leaderboard queries without repeated sorting
- Insertion order + lookup performance simultaneously
- Priority queues with fast position-based access
- Time-series data with range queries
- Red-Black Tree / Heap performance without learning new APIs

✅ **When your current code has:**

- `array.sort()` in hot paths (request handlers, loops)
- Manual index tracking after insertions
- `Array.shift()` on large lists (queues)
- Custom sorting logic you repeat across files
- Map that needs to be ordered

---

## 🚀 Quick Start: 30 Seconds

### Leaderboard (Ranked Collections)

```typescript
import { RedBlackTree } from 'data-structure-typed';

// Descending comparator — highest scores first
const leaderboard = new RedBlackTree<number, string>([
  [100, 'Alice'],
  [85, 'Bob'],
  [92, 'Charlie']
], { comparator: (a, b) => b - a });

// Iterate — naturally descending, O(n)
for (const [score, player] of leaderboard) {
  console.log(`${player}: ${score}`);
}
// Output: Alice: 100 → Charlie: 92 → Bob: 85

// Update score — O(log n)
leaderboard.delete(85);
leaderboard.set(95, 'Bob');

// Top-k — O(k log n), no array copy needed
const top3: [number, string][] = [];
let score = leaderboard.getLeftMost();        // highest score
while (score !== undefined && top3.length < 3) {
  top3.push([score, leaderboard.get(score)!]);
  score = leaderboard.higher(score);          // next in tree order
}

// Range query — players scoring 90~100, O(log n + k)
let s = leaderboard.ceiling(100);             // greatest score ≤ 100 in desc tree
while (s !== undefined && s >= 90) {
  console.log(`${leaderboard.get(s)}: ${s}`);
  s = leaderboard.higher(s);
}
```

### Task Queue (Scheduling)

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

const taskQueue = new MaxPriorityQueue<{priority: number; task: string}>([], {
  comparator: (a, b) => b.priority - a.priority
});

taskQueue.add({ priority: 5, task: 'Email' });
taskQueue.add({ priority: 9, task: 'Alert' });  // Instant priority handling

const nextTask = taskQueue.poll();  // { priority: 9, task: 'Alert' }
```

### Fast Queue (FIFO)

```typescript
import { Deque } from 'data-structure-typed';

const queue = new Deque([1, 2, 3, 4, 5]);
queue.shift();  // Remove from front: O(1) not O(n)
queue.push(6);  // Add to back: O(1)
```

---

## 📊 Data Structures Available

| Structure                | Use Case                          | Time Complexity | NPM                                                       |
|--------------------------|-----------------------------------|-----------------|-----------------------------------------------------------|
| **RedBlackTree**         | Sorted collections, range queries | O(log n)        | [npm](https://www.npmjs.com/package/red-black-tree-typed) |
| **Heap / PriorityQueue** | Task scheduling, top-K elements   | O(log n)        | [npm](https://www.npmjs.com/package/heap-typed)           |
| **Deque**                | Fast front/back operations        | O(1)            | [npm](https://www.npmjs.com/package/deque-typed)          |
| **Trie**                 | Autocomplete, prefix search       | O(m+k)          | [npm](https://www.npmjs.com/package/trie-typed)           |
| **DirectedGraph**        | Pathfinding, DAG algorithms       | O(V+E)          | [npm](https://www.npmjs.com/package/directed-graph-typed) |
| **Stack**                | Undo/redo, expression parsing     | O(1)            | [npm](https://www.npmjs.com/package/stack-typed)          |
| **LinkedList**           | Dynamic sizing, no index shift    | O(1)*           | [npm](https://www.npmjs.com/package/linked-list-typed)    |
| **AVLTree**              | Stricter balance than RB-Tree     | O(log n)        | [npm](https://www.npmjs.com/package/avl-tree-typed)       |
| **SkipList**             | Sorted KV, TreeMap alternative    | O(log n) avg    | —                                                         |
| **SegmentTree**          | Range sum/min/max/custom queries  | O(log n)        | —                                                         |
| **BinaryIndexedTree**    | Prefix sums, frequency counting   | O(log n)        | —                                                         |
| **Matrix**               | 2D grid arithmetic                | O(n²) add       | —                                                         |

👉 [See all 20+ structures →](./docs/OVERVIEW.md) | [Full API docs →](https://data-structure-typed-docs.vercel.app/)

---

## 📖 Documentation

### For Different Use Cases

| Your Goal                 | Start Here                                | Next Steps                              |
|---------------------------|-------------------------------------------|-----------------------------------------|
| **Learn concepts**        | [CONCEPTS.md](./docs/CONCEPTS.md)         | [GUIDES.md](./docs/GUIDES.md)           |
| **Use in my project**     | [GUIDES.md](./docs/GUIDES.md)             | [OVERVIEW.md](./docs/OVERVIEW.md)       |
| **Look up API**           | [API Docs](https://data-structure-typed-docs.vercel.app/) | [PERFORMANCE.md](./docs/PERFORMANCE.md) |
| **Performance questions** | [PERFORMANCE.md](./docs/PERFORMANCE.md)   | [ARCHITECTURE.md](./docs/ARCHITECTURE.md)    |
| **Framework integration** | [INTEGRATIONS.md](./docs/INTEGRATIONS.md) | [GUIDES.md](./docs/GUIDES.md)           |
| **Understand design**     | [ARCHITECTURE.md](./docs/ARCHITECTURE.md)      | [CONCEPTS.md](./docs/CONCEPTS.md)       |

### Documentation Files

1. **[CONCEPTS.md](./docs/CONCEPTS.md)** - Core Fundamentals & Theory
  - Big Three Concepts (BST, Balanced Trees, Heap)
  - 13 Plain Language Explanations
  - Iterator Protocol Design
  - 5 Comparisons with Native JavaScript
  - Complete Decision Guide

2. **[API Docs](https://data-structure-typed-docs.vercel.app/)** - Full API Reference (TypeDoc)
  - Complete method signatures, parameters, return types
  - Real-world `@example` code for every method
  - Inheritance hierarchy and type details

3. **[OVERVIEW.md](./docs/OVERVIEW.md)** - Data Structures Overview
  - Quick Reference Table
  - All 20+ Structures with Examples
  - CRUD Operations
  - Common Methods
  - TypeScript Support

4. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Design & Implementation
  - Design Philosophy & Principles
  - 3 Pain Points Solved
  - Why Deque is 484x Faster
  - Iterator Protocol Design
  - Self-Balancing Strategy
  - V8 JIT Optimizations

5. **[PERFORMANCE.md](./docs/PERFORMANCE.md)** - Benchmarks & Comparisons
  - Performance Summary
  - 3 Real-World Scenarios
  - Detailed Benchmarks
  - When to Use What
  - Optimization Tips

6. **[GUIDES.md](./docs/GUIDES.md)** - Real-World Examples
  - 4 Design Patterns
  - 5 Production Code Examples
  - Common Mistakes
  - Best Practices

7. **[INTEGRATIONS.md](./docs/INTEGRATIONS.md)** - Framework Integration
  - React Integration (State Management, Leaderboard)
  - Express Integration (LRU Cache, Rate Limiting)
  - Nest.js Integration (Ranking Service, Task Queue)
  - TypeScript Configuration

---

## 💻 Real-World Examples

### LRU Cache

```typescript
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private order = new DoublyLinkedList<K>();

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;
    // Move to end (recently used)
    // Efficient with O(1) operations
    return this.cache.get(key)!;
  }
}
```

### Leaderboard

```typescript

type Player = {
  id: string;
  name: string;
  score: number;
};

const seedPlayers: Player[] = [
  { id: 'player_01HZX4E8Q2K8Y3J9M7T1A6B3C4', name: 'Pablo', score: 65 },
  { id: 'player_01HZX4E9R6V2D8K1P0N5S4T7U8', name: 'Bunny', score: 10 },
  { id: 'player_01HZX4EA3M9Q7W1E2R8T6Y5U0I', name: 'Jeff', score: 99 },
];

class ScoreLeaderboard {
  private readonly byScore: RedBlackTree<number, Player, Player>;

  constructor(initialPlayers: Player[]) {
    this.byScore = new RedBlackTree<number, Player, Player>(initialPlayers, {
      isMapMode: false,// Use "node value" storage rather than Map-style.
      toEntryFn: (player) => [player.score, player], // Convert a player object into the tree entry: key = score, value = player.
    });
  }

  /**
   * Returns players whose scores fall within the given range.
   * Supports either a tuple [min, max] or a Range object for inclusive/exclusive bounds.
   */
  public findPlayersByScoreRange(range: [number, number] | Range<number>): (Player | undefined)[] {
    return this.byScore.rangeSearch(range, (node) => node.value);
  }
  
  public upsertPlayer(player: Player) {
    return this.byScore.set(player.score, player);
  }
}

const leaderboard = new ScoreLeaderboard(seedPlayers);

console.log(leaderboard.findPlayersByScoreRange([65, 100]));

leaderboard.upsertPlayer({
  id: 'player_01HZX4EB7C4N2M9Q8R1T3Y6U5I',
  name: 'Alex',
  score: 80,
});

console.log(leaderboard.findPlayersByScoreRange(new Range(65, 100, true, true)));
```

### Message Queue

```typescript
type Message = {
  id: string;
  type: string;
  payload: unknown;
  priority: 'urgent' | 'normal';
  createdAt: number;
  retryCount?: number;
};

class MessageQueue {
  private urgent = new Deque<Message>();
  private normal = new Deque<Message>();

  dequeue(): Message | null {
    return this.urgent.shift() || this.normal.shift();
  }
}
```

👉 [More examples in GUIDES.md](./docs/GUIDES.md)

---

## 🎯 Use Cases by Industry

### 📊 Finance

- Price-sorted order book
- Real-time portfolio rankings
- Option chain ordering

### 🎮 Gaming

- Player leaderboards
- Enemy priority queues
- Game event scheduling

### 📱 Social Media

- Trending posts (top-K)
- Feed ordering
- Notification scheduling

### 🏥 Healthcare

- Patient priority queues
- Appointment scheduling
- Medical record organization

### 🛒 E-commerce

- Product price ranges
- Inventory management
- Order scheduling

---

## ✨ Why Developers Love This

| Pain Point                         | Solution                                  |
|------------------------------------|-------------------------------------------|
| Repeated sorting slowing down code | TreeSet auto-maintains order              |
| Array.shift timeout in loops       | Deque O(1) shift instead of O(n)          |
| Learning different APIs            | All structures use push/pop/shift/unshift |
| Type safety nightmares             | Full TypeScript generics support          |
| Browser compatibility issues       | Works everywhere: Node, browsers, CDN     |

---

## 📦 What You Get

✅ **20+ data structures** (production-ready)  
✅ **50+ code examples** (real-world patterns)  
✅ **Full TypeScript support** (strict typing)  
✅ **Performance benchmarks** (484x speedups)  
✅ **Framework integrations** (React, Express, Nest.js)  
✅ **6 core documentation files** (2500+ lines)

---

## 🚀 Getting Started

### Step 1: Install

```bash
npm i data-structure-typed
```

### Step 2: Import

```typescript
import { RedBlackTree, Deque, MaxPriorityQueue } from 'data-structure-typed';
```

### Step 3: Use

```typescript
const tree = new RedBlackTree([5, 2, 8]);
console.log([...tree]);  // [2, 5, 8] - Automatically sorted!
```

## 📊 Comparison Chart

```
Need frequent head/tail operations?
  → Deque (O(1) shift/unshift/push/pop)

Need sorted + fast lookup?
  → RedBlackTree (O(log n) guaranteed)

Need highest/lowest priority?
  → Heap/PriorityQueue (O(log n) add/remove)

Need prefix/text matching?
  → Trie (O(m+k) where m=prefix)

Need graph operations?
  → DirectedGraph/UndirectedGraph

Need range queries on array (sum/min/max)?
  → SegmentTree (any merge op) or BinaryIndexedTree (prefix sums only)

Need sorted key-value with same API as TreeMap?
  → SkipList (O(log n) avg, probabilistic balancing)

Otherwise?
  → Use Array (simplest case)
```

---

## 🤝 Contributing

Found a bug? Have suggestions? [Open an issue](https://github.com/zrwusa/data-structure-typed/issues)

---

## 📄 License

MIT

---

## 📚 Full Documentation Structure

```
README.md (this file)
docs/
├── CONCEPTS.md (theory & fundamentals)
├── OVERVIEW.md (Data structures overview)
├── ARCHITECTURE.md (design principles)
├── PERFORMANCE.md (benchmarks)
├── GUIDES.md (real-world examples)
└── INTEGRATIONS.md (framework guides)
```

---

## 🎓 Learn More

**Just started?** → [Quick Start](#-quick-start-30-seconds)

**Need concepts?** → [CONCEPTS.md](./docs/CONCEPTS.md)

**Want to build?** → [GUIDES.md](./docs/GUIDES.md)

**Need API?** → [API Docs](https://data-structure-typed-docs.vercel.app/) | [Overview](./docs/OVERVIEW.md)

**Curious about performance?** → [PERFORMANCE.md](./docs/PERFORMANCE.md)

**Framework questions?** → [INTEGRATIONS.md](./docs/INTEGRATIONS.md)

---

**Ready to supercharge your TypeScript data structures? [Get started now →](#-quick-start-30-seconds)**
