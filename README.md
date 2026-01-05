# data-structure-typed

![npm](https://img.shields.io/npm/dm/data-structure-typed)
![GitHub contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed)
![npm package minimized gzipped size (select exports)](https://img.shields.io/bundlejs/size/data-structure-typed)
![GitHub top language](https://img.shields.io/github/languages/top/zrwusa/data-structure-typed)
![GITHUB Star](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
![eslint](https://aleen42.github.io/badges/src/eslint.svg)
![NPM](https://img.shields.io/npm/l/data-structure-typed)
![npm](https://img.shields.io/npm/v/data-structure-typed)

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

### Real-World Pain Points We Solve:

```javascript
// ❌ WITHOUT data-structure-typed
const queue = [1, 2, 3, ..., 100000
]
;
for (let i = 0; i < 100000; i++) {
  queue.shift();  // O(n) - Reindexes EVERY element!
}
// Time: 2829ms ❌

// ✅ WITH data-structure-typed (Deque)
const deque = new Deque([1, 2, 3, ..., 100000
])
;
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1) - Just moves a pointer
}
// Time: 5.83ms ✅
// **484x faster!**
```

---

## 🚀 Performance (TL;DR)

- **10–40% faster** than common JS implementations in hot paths
    - Array.sort() O(n log n) → TreeSet O(log n) insertion
    - Repeated Array.shift() O(n) → Queue O(1)
    - Manual index tracking → RB-Tree auto-balance

- **Optimized for V8 JIT** (Node.js 18+, modern browsers)

- **Tree-shakable** ESM / CJS / legacy builds

📊 [Full benchmarks →](./DEEP_DIVE.md#-performance-comparison)

---

## ✨ Key Features

### 🏠 Uniform API

Don't learn new APIs. Just use `push`, `pop`, `map`, `filter`, and `reduce` everywhere.

```javascript
// All linear structures use THE SAME 4 methods
const deque = new Deque([1, 2, 3]);
const queue = new Queue([1, 2, 3]);
const stack = new Stack([1, 2, 3]);

// They ALL support:
structure.push(item);          // Add to end
structure.pop();               // Remove from end
structure.shift();             // Remove from start
structure.unshift(item);       // Add to start
```

### 🛡️ Type Safe

Full generics and strict TypeScript support out of the box.

### ✨ Zero Friction

Works everywhere. Spread it `[...]`, loop it `for..of`, convert it instantly.

```javascript
// All data structures work with iterator protocol
const tree = new RedBlackTree([5, 2, 8]);
const sorted = [...tree];              // Spread operator
for (const item of tree) { ...
}       // for...of loop
const set = new Set(tree);             // Set constructor
```

---

## 📥 Installation

```bash
pnpm add data-structure-typed
```

```bash
npm i data-structure-typed --save
```

```bash
yarn add data-structure-typed
```

### Individual Packages

Use only what you need:

```bash
pnpm add heap-typed deque-typed red-black-tree-typed
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

const leaderboard = new RedBlackTree([
  [100, 'Alice'],
  [85, 'Bob'],
  [92, 'Charlie']
]);

// Get sorted scores (automatically maintained!)
for (const [score, player] of leaderboard) {
  console.log(`${player}: ${score}`);
}
// Output:
// Alice: 100
// Charlie: 92
// Bob: 85

// Update score
leaderboard.delete(85);
leaderboard.add(95, 'Bob');  // O(log n)

// Query top players
const topPlayers = [...leaderboard.values()].reverse().slice(0, 3);
```

### Task Queue (Scheduling)

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

const taskQueue = new MaxPriorityQueue([], {
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

👉 [See all 20+ structures →](./DEEP_DIVE.md#-data-structures-available)

---

## 📖 Real-World Examples

### Example 1: LRU Cache (Interview Classic)

```typescript
import { DoublyLinkedList } from 'data-structure-typed';

class LRUCache<T> {
  private cache = new DoublyLinkedList<[string, T]>();
  private map = new Map<string, any>();

  get(key: string): T | null {
    const node = this.map.get(key);
    if (!node) return null;
    this.cache.delete(node);
    const newNode = this.cache.push(key, node.value[1]);
    this.map.set(key, newNode);
    return node.value[1];
  }
}
```

### Example 2: Real-Time Leaderboard

```typescript
import { RedBlackTree } from 'data-structure-typed';

class Leaderboard {
  private scoreTree = new RedBlackTree<number, Player>();

  updateScore(playerId: string, newScore: number): void {
    if (this.playerMap.has(playerId)) {
      this.scoreTree.delete(this.playerMap.get(playerId)!);
    }
    this.scoreTree.add(newScore, player);
  }

  getTopN(n: number): Player[] {
    return [...this.scoreTree.values()].reverse().slice(0, n);
  }
}
```

### Example 3: Message Queue with Priorities

```typescript
import { Deque, MaxPriorityQueue } from 'data-structure-typed';

class OrderProcessor {
  private normalQueue = new Deque<Order>();
  private urgentQueue = new Deque<Order>();

  addOrder(order: Order): void {
    if (order.priority === 'urgent') {
      this.urgentQueue.push(order);
    } else {
      this.normalQueue.push(order);
    }
  }

  processNext(): Order | undefined {
    return this.urgentQueue.isEmpty()
      ? this.normalQueue.shift()
      : this.urgentQueue.shift();
  }
}
```

👉 [See 5 more production examples →](./DEEP_DIVE.md#-real-world-examples-production-code)

---

## 🎓 How It Works

### The Big Three Concepts

1. **Binary Search Tree (BST)** — O(log n) search/insert/delete by maintaining sorted order
2. **Balanced Trees (AVL, Red-Black)** — Auto-rebalancing to prevent degradation
3. **Heap** — Parent-child relationships for priority handling

Not familiar? Read our [plain language guide with bunnies 🐰](./DEEP_DIVE.md#-plain-language-explanations)

---

## 🔗 Seamless Integration

Works perfectly with React, Express, Nest.js, and vanilla JavaScript:

```typescript
// React: Sorted state management
const [todos, setTodos] = useState(new RedBlackTree(...));

// Express: In-memory cache
const cache = new DoublyLinkedList();

// Nest.js: Ranking service
@Injectable()
export class RankingService {
  private rankingTree = new RedBlackTree<number, Player>();
}
```

👉 [See framework integrations →](./DEEP_DIVE.md#-integration-examples)

---

## 📈 Playground

Try it instantly:

- [Node.js TypeScript](https://stackblitz.com/edit/stackblitz-starters-e1vdy3zw?file=src%2Findex.ts)
- [Node.js JavaScript](https://stackblitz.com/edit/stackblitz-starters-dgvchziu?file=src%2Findex.js)
- [React TypeScript](https://stackblitz.com/edit/vitejs-vite-6xvhtdua?file=src%2FApp.tsx)
- [NestJS](https://stackblitz.com/edit/nestjs-typescript-starter-3cyp7pel?file=src%2Franking%2Franking.service.ts)

---

## 🌟 Why Developers Love This

| Pain Point                         | Solution                                  |
|------------------------------------|-------------------------------------------|
| Repeated sorting slowing down code | TreeSet/TreeMap auto-maintains order      |
| Array.shift() timeout in loops     | Deque O(1) shift instead of O(n)          |
| Learning different APIs            | All structures use push/pop/shift/unshift |
| Type safety nightmares             | Full TypeScript generics support          |
| Browser compatibility issues       | Works everywhere (Node, browsers, CDN)    |

---

## 📚 Next Steps

- 🏃 **Just started?** → [Full Quick Start guide](./DEEP_DIVE.md#quick-start-3-minutes-to-productivity)
- 🤔 **Not sure which to use?** → [Decision guide](./DEEP_DIVE.md#-decision-guide-choose-the-right-data-structure)
- 💻 **Want to see code?** → [Code patterns & examples](./DEEP_DIVE.md#-code-snippets-patterns--examples)
- 📊 **Care about performance?** → [Detailed benchmarks](./DEEP_DIVE.md#-performance-comparison)
- 🎨 **Visual learner?** → [Metaphors with bunnies 🐰](./DEEP_DIVE.md#-plain-language-explanations)
- 🔧 **TypeScript specifics?** → [Type safety guide](./DEEP_DIVE.md#-typescript-support)
- 🎓 **Interview prep?** → [LeetCode patterns](./DEEP_DIVE.md#-leetcode--algorithm-cheatsheet)

---

## 🤝 Contributing & Feedback

Found a bug? Have suggestions?

- **Issues**: [GitHub Issues](https://github.com/zrwusa/data-structure-typed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zrwusa/data-structure-typed/discussions)

---

## 📄 License

[MIT License](LICENSE)

---

## 🚀 Get Started Now

```bash
npm i data-structure-typed
```

```javascript
import { RedBlackTree, Deque, MaxHeap } from 'data-structure-typed';

const tree = new RedBlackTree([5, 2, 8, 1, 9]);
console.log([...tree.keys()]);  // [1, 2, 5, 8, 9] ✅
```

**Still have questions?** → [Deep dive into everything →](./DEEP_DIVE.md)
