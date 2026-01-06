# GUIDES: Real-World Examples & Production Patterns

Production-ready code examples for common use cases. Learn by doing.

**[Back to README](../README.md) • [API Reference](./REFERENCE.md) • [See INTEGRATIONS](./INTEGRATIONS.md)**

---

## Table of Contents

1. [Design Patterns](#design-patterns)
2. [Real-World Examples](#real-world-examples)
3. [Common Mistakes](#common-mistakes)
4. [Best Practices](#best-practices)

---

## Design Patterns

### Pattern 1: Iterator Pattern (Zero Conversions)

```typescript
import { RedBlackTree } from 'data-structure-typed';

// Problem: Need to work with sorted data in multiple ways
const scores = [95, 23, 67, 89, 12, 45];

// Solution: Use iterator protocol
const tree = new RedBlackTree(scores);

// Method 1: Spread operator
const sorted = [...tree];
console.log(sorted); // [12, 23, 45, 67, 89, 95]

// Method 2: for...of loop
for (const score of tree) {
  console.log(score);
}

// Method 3: Destructuring
const [min, ...rest] = tree;

// Method 4: Set constructor
const unique = new Set(tree);

// Method 5: Array.from()
const array = Array.from(tree);

// All work automatically - zero conversions!
```

### Pattern 2: Method Chaining (Stay on Structure)

```typescript
import { RedBlackTree } from 'data-structure-typed';

const data = [
  [1, { name: 'Alice', score: 95 }],
  [2, { name: 'Bob', score: 45 }],
  [3, { name: 'Charlie', score: 87 }],
];

const tree = new RedBlackTree(data);

// Chain operations - structure maintained throughout
const result = tree
  .filter((student, id) => student.score >= 50)
  .map((student, id) => ({
    id,
    name: student.name,
    passed: student.score >= 50
  }))
  .reduce((summary, student) => {
    summary.count++;
    summary.names.push(student.name);
    return summary;
  }, { count: 0, names: [] });

console.log(result);
// { count: 2, names: ['Alice', 'Charlie'] }
```

### Pattern 3: Seamless Structure Conversion

```typescript
import { RedBlackTree, Deque, MaxHeap } from 'data-structure-typed';

const data = [64, 34, 25, 12, 22, 11, 90];

// Convert between structures instantly
const tree = new RedBlackTree(data);
const sorted = [...tree.keys()];     // [11, 12, 22, 25, 34, 64, 90]

const heap = new MaxHeap(sorted);
const byPriority = [...heap];        // [90, 64, 34, ...]

const deque = new Deque(byPriority);
const processed = deque.shift();      // Remove first - O(1)!

// No intermediate conversions, structure preserved when possible
```

### Pattern 4: Conditional Logic with Types

```typescript
import { RedBlackTree } from 'data-structure-typed';

interface Product {
  id: string;
  name: string;
  price: number;
}

class PriceIndex {
  private index: RedBlackTree<number, Product> = new RedBlackTree();

  addProduct(product: Product) {
    this.index.set(product.price, product);
  }

  getByPriceRange(min: number, max: number): Product[] {
    return this.index
      .filter((product, price) => price >= min && price <= max)
      .map((product) => product)
      .toArray();
  }

  getAffordable(budget: number): Product[] {
    return this.index
      .filter((product, price) => price <= budget)
      .map((product) => ({ ...product, discount: 0.1 }))
      .toArray();
  }
}

const index = new PriceIndex();
index.addProduct({ id: '1', name: 'Laptop', price: 999 });
index.addProduct({ id: '2', name: 'Mouse', price: 25 });

const affordable = index.getAffordable(100);
```

---

## Real-World Examples

### Example 1: LRU Cache

```typescript
import { DoublyLinkedList } from 'data-structure-typed';

class LRUCache<K, V> {
  private cache = new Map<K, { value: V; node: any }>();
  private order = new DoublyLinkedList<K>();
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;

    const { value, node } = this.cache.get(key)!;

    // Move to end (most recently used)
    this.order.delete(node);
    const newNode = this.order.push(key);
    this.cache.set(key, { value, node: newNode });

    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.get(key); // Mark as recently used
      this.cache.set(key, { value, node: this.cache.get(key)!.node });
      return;
    }

    if (this.cache.size >= this.capacity) {
      // Evict least recently used
      const lru = this.order.shift();
      this.cache.delete(lru);
    }

    const node = this.order.push(key);
    this.cache.set(key, { value, node });
  }
}

// Usage
const cache = new LRUCache<string, string>(3);
cache.set('a', 'value1');
cache.set('b', 'value2');
cache.set('c', 'value3');
console.log(cache.get('a')); // 'value1', 'a' is now most recent
cache.set('d', 'value4');    // Evicts 'b' (least recent)
```

### Example 2: Real-Time Leaderboard

```typescript
import { RedBlackTree } from 'data-structure-typed';

interface Player {
  id: string;
  name: string;
  score: number;
}

class Leaderboard {
  private scores = new RedBlackTree<number, Player>(
    (a, b) => b - a  // Descending order
  );
  private players = new Map<string, number>(); // playerId → currentScore

  updateScore(player: Player): void {
    // Remove old score if exists
    if (this.players.has(player.id)) {
      const oldScore = this.players.get(player.id)!;
      this.scores.delete(oldScore);
    }

    // Add new score
    this.scores.set(player.score, player);
    this.players.set(player.id, player.score);
  }

  getTopN(n: number): Player[] {
    return [...this.scores.values()].slice(0, n);
  }

  getRank(playerId: string): number {
    if (!this.players.has(playerId)) return -1;

    const score = this.players.get(playerId)!;
    let rank = 1;

    for (const [s] of this.scores) {
      if (s > score) rank++;
      else break;
    }

    return rank;
  }

  getAroundMe(playerId: string, range: number): Player[] {
    const myRank = this.getRank(playerId);
    if (myRank === -1) return [];

    const start = Math.max(1, myRank - range);
    const end = Math.min(this.scores.size, myRank + range);

    return [...this.scores.values()].slice(start - 1, end);
  }
}

// Usage
const lb = new Leaderboard();
lb.updateScore({ id: '1', name: 'Alice', score: 1000 });
lb.updateScore({ id: '2', name: 'Bob', score: 900 });
lb.updateScore({ id: '3', name: 'Charlie', score: 950 });

console.log(lb.getTopN(2));        // Top 2 players
console.log(lb.getRank('2'));      // Bob's rank
console.log(lb.getAroundMe('2', 1)); // Players around Bob
```

### Example 3: Message Queue with Priorities

```typescript
import { Deque, MaxPriorityQueue } from 'data-structure-typed';

interface Message {
  id: string;
  content: string;
  priority: number;
  timestamp: number;
}

class PriorityMessageQueue {
  private urgent = new Deque<Message>();  // Priority >= 8
  private normal = new Deque<Message>();  // Priority 4-7
  private low = new Deque<Message>();     // Priority < 4

  enqueue(message: Message): void {
    if (message.priority >= 8) {
      this.urgent.push(message);
    } else if (message.priority >= 4) {
      this.normal.push(message);
    } else {
      this.low.push(message);
    }
  }

  dequeue(): Message | null {
    // Serve urgent first, then normal, then low
    return (
      this.urgent.shift() ||
      this.normal.shift() ||
      this.low.shift() ||
      null
    );
  }

  size(): number {
    return this.urgent.size + this.normal.size + this.low.size;
  }
}

// Usage
const queue = new PriorityMessageQueue();
queue.enqueue({ id: '1', content: 'Normal task', priority: 5, timestamp: Date.now() });
queue.enqueue({ id: '2', content: 'Urgent task', priority: 9, timestamp: Date.now() });
queue.enqueue({ id: '3', content: 'Low task', priority: 1, timestamp: Date.now() });

while (queue.size() > 0) {
  const msg = queue.dequeue();
  console.log(msg?.id); // 2, 1, 3 (urgent first)
}
```

### Example 4: Task Scheduler

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

interface Task {
  id: string;
  action: () => Promise<void>;
  priority: number;
  scheduledTime: number;
}

class TaskScheduler {
  private queue = new MaxPriorityQueue<Task>({
    comparator: (a, b) => a.priority - b.priority
  });
  private running = false;

  scheduleTask(task: Task): void {
    this.queue.add(task);
    if (!this.running) this.start();
  }

  private async start(): Promise<void> {
    this.running = true;

    while (!this.queue.isEmpty) {
      const task = this.queue.poll();
      if (!task) break;

      try {
        console.log(`Executing task ${task.id}`);
        await task.action();
      } catch (error) {
        console.error(`Task ${task.id} failed:`, error);
      }
    }

    this.running = false;
  }
}

// Usage
const scheduler = new TaskScheduler();
scheduler.scheduleTask({
  id: '1',
  action: async () => console.log('High priority'),
  priority: 10,
  scheduledTime: Date.now()
});
scheduler.scheduleTask({
  id: '2',
  action: async () => console.log('Low priority'),
  priority: 1,
  scheduledTime: Date.now()
});
```

### Example 5: Search Index with Autocomplete

```typescript
import { Trie } from 'data-structure-typed';

class SearchIndex {
  private trie = new Trie();
  private documents = new Map<string, string[]>();

  indexDocument(docId: string, content: string): void {
    const words = content.toLowerCase().split(/\s+/);

    for (const word of words) {
      // Insert word into trie
      if (!this.trie.search(word)) {
        this.trie.insert(word);
      }

      // Track which documents contain this word
      if (!this.documents.has(word)) {
        this.documents.set(word, []);
      }
      this.documents.get(word)!.push(docId);
    }
  }

  autocomplete(prefix: string): string[] {
    const words = this.trie.getWordsWithPrefix(prefix);
    return words.filter((word, index) => index < 10); // Top 10
  }

  search(query: string): string[] {
    const word = query.toLowerCase();
    return this.documents.get(word) || [];
  }
}

// Usage
const index = new SearchIndex();
index.indexDocument('doc1', 'apple application');
index.indexDocument('doc2', 'app store');

console.log(index.autocomplete('app'));  // ['apple', 'application', 'app']
console.log(index.search('apple'));      // ['doc1']
```

---

## Common Mistakes

### ❌ Mistake 1: Forgetting to Convert Back

```typescript
// Wrong
const tree = new RedBlackTree([5, 2, 8]);
const doubled = tree.map(x => x * 2);  // Still a tree!
JSON.stringify(doubled);                // Error or wrong output

// Right
const tree = new RedBlackTree([5, 2, 8]);
const doubled = tree.map(x => x * 2).toArray();
JSON.stringify(doubled); // [4, 10, 16]
```

### ❌ Mistake 2: Mutating During Iteration

```typescript
// Wrong
const tree = new RedBlackTree([1, 2, 3]);
for (const val of tree) {
  if (val === 2) tree.delete(2);  // Avoid this!
}

// Right
const tree = new RedBlackTree([1, 2, 3]);
const toDelete = [];
for (const val of tree) {
  if (val === 2) toDelete.push(2);
}
toDelete.forEach(v => tree.delete(v));
```

### ❌ Mistake 3: Wrong Data Structure Choice

```typescript
// Wrong - using Array for sorted data with updates
const scores = [];
function addScore(score) {
  scores.push(score);
  scores.sort((a, b) => b - a);  // O(n log n) every time!
}

// Right - using RedBlackTree
const scores = new RedBlackTree();
function addScore(score) {
  scores.set(score, true);  // O(log n), auto-sorted
}
```

---

## Best Practices

### 1. Choose Structure Early

```typescript
// Good: Decide upfront
function processScores(scores: number[]) {
  const tree = new RedBlackTree(scores);  // Already sorted
  return tree.filter(x => x > 50).map(x => x * 1.1);
}

// Bad: Convert later
function processScores(scores: number[]) {
  const sorted = [...scores].sort((a, b) => b - a);
  return new RedBlackTree(sorted).filter(x => x > 50);  // Redundant
}
```

### 2. Batch Operations When Possible

```typescript
// Good: Bulk insert
const tree = new RedBlackTree(largeDataset);

// Bad: Individual inserts
const tree = new RedBlackTree();
for (const item of largeDataset) {
  tree.set(item.id, item);  // Rebalances each time
}
```

### 3. Use Type Safety

```typescript
// Good: Full type inference
const tree = new RedBlackTree<number, User>();
tree.set(1, { id: 1, name: 'Alice' });

// Bad: No type checking
const tree = new RedBlackTree();
tree.set(1, { id: 1, name: 'Alice' });
```

### 4. Chain When Possible

```typescript
// Good: Stay on structure
const result = tree
  .filter(x => x > 10)
  .map(x => x * 2)
  .reduce((sum, x) => sum + x, 0);

// Bad: Convert unnecessarily
const result = [...tree]
  .filter(x => x > 10)
  .map(x => x * 2)
  .reduce((sum, x) => sum + x, 0);
```

---

**Need more?** Check [INTEGRATIONS.md](./INTEGRATIONS.md) for framework examples.

**Performance questions?** See [PERFORMANCE.md](./PERFORMANCE.md).
