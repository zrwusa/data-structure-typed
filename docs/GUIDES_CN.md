# GUIDES: 真实场景示例与生产模式

生产级代码示例,涵盖常见使用场景。通过实践学习。

**[English](./GUIDES.md) | 简体中文**

**[返回 README](../README_CN.md) • [API 文档](https://data-structure-typed-docs.vercel.app/) • [查看集成指南](./INTEGRATIONS_CN.md)**

---

## 目录

1. [设计模式](#设计模式)
2. [真实场景示例](#真实场景示例)
3. [常见错误](#常见错误)
4. [最佳实践](#最佳实践)

---

## 设计模式

### 模式 1: Iterator Pattern(零转换)

```typescript
import { RedBlackTree } from 'data-structure-typed';

// Problem: Need to work with sorted data in multiple ways
const scores = [95, 23, 67, 89, 12, 45];

// Solution: Use iterator protocol
const tree = new RedBlackTree(scores);

// Method 1: Spread operator
const sorted = [...tree.keys()];
console.log(sorted); // [12, 23, 45, 67, 89, 95]

// Method 2: for...of loop
for (const [score] of tree) {
  console.log(score);
}

// Method 3: Destructuring
const [min, ...rest] = tree.keys();

// Method 4: Set constructor
const unique = new Set(tree.keys());

// Method 5: Array.from()
const array = Array.from(tree.keys());

// All work automatically - zero conversions!
```

### 模式 2: 方法链式调用(保持数据结构)

```typescript
import { RedBlackTree } from 'data-structure-typed';

const tree = new RedBlackTree([
  [1, { name: 'Alice', score: 95 }],
  [2, { name: 'Bob', score: 45 }],
  [3, { name: 'Charlie', score: 87 }],
]);

// Chain operations - structure maintained throughout
const result = tree
  .filter((student, id) => (student?.score ?? 0) >= 50)
  .map((student, id) => ([id, {
    id,
    name: student?.name,
    passed: (student?.score ?? 0) >= 50
  }]))
  .reduce((summary, student) => {
    summary.count++;
    summary.names.push(student?.name ?? '');
    return summary;
  }, { count: 0, names: [] as string[] });

console.log(result);
// { count: 2, names: ['Alice', 'Charlie'] }
```

### 模式 3: 无缝结构转换

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

### 模式 4: 类型条件逻辑

```typescript
import { RedBlackTree } from 'data-structure-typed';

interface Product {
  id: string;
  name: string;
  price: number;
}

class PriceIndex {
  private index = new RedBlackTree<number, Product>([], {isMapMode: false});

  addProduct(product: Product) {
    this.index.set(product.price, product);
  }

  getByPriceRange(min: number, max: number) {
    return this.index.rangeSearch([min, max], node => node.value)
  }

  getAffordable(budget: number) {
    return this.index.rangeSearch([0, budget], node => node.value)
  }
}

const index = new PriceIndex();
index.addProduct({id: '1', name: 'Laptop', price: 999});
index.addProduct({id: '2', name: 'Mouse', price: 25});

const affordable = index.getAffordable(100);
```

### 模式 5: 使用 Hint 实现高吞吐量插入 (RedBlackTree)

如果你按排序或近乎排序的顺序插入键(时间戳、自增 ID 等),
`setWithHintNode()` 可以避免重复的从根到叶的全路径搜索。

```typescript
import { RedBlackTree } from 'data-structure-typed';
import type { RedBlackTreeNode } from 'data-structure-typed';

const tree = new RedBlackTree<number, number>();

let hint: RedBlackTreeNode<number, number> | undefined;
for (let i = 0; i < 1_000_000; i++) {
  hint = tree.setWithHintNode(i, i, hint);
}

// tree.size === 1_000_000
```

注意事项:
- 将**上次返回的节点**作为 hint 传入。
- 如果 hint 对于当前键无效,实现会安全地回退到普通的 `set()`。

---

## 真实场景示例

### 示例 1: LRU Cache

```typescript
import { DoublyLinkedList } from 'data-structure-typed';

class LRUCache<K, V> {
  private cache = new Map<K, { value: V; node: DoublyLinkedList<K> }>();
  private order = new DoublyLinkedList<K>();
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;

    const {value, node} = this.cache.get(key)!;

    // Move to end (most recently used)
    this.order.delete(node);
    const newNode = this.order.push(key);
    this.cache.set(key, {value, node: newNode});

    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.get(key); // Mark as recently used
      this.cache.set(key, {value, node: this.cache.get(key)!.node});
      return;
    }

    if (this.cache.size >= this.capacity) {
      // Evict least recently used
      const lru = this.order.shift();
      if (lru) this.cache.delete(lru);
    }

    const node = this.order.push(key);
    this.cache.set(key, {value, node});
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

### 示例 2: 实时排行榜

```typescript
import { RedBlackTree } from 'data-structure-typed';

interface Player {
  id: string;
  name: string;
  score: number;
}

class Leaderboard {
  // enableOrderStatistic gives O(log n) getByRank/getRank/rangeByRank
  private scores = new RedBlackTree<number, Player>(
    [],
    { comparator: (a, b) => b - a, enableOrderStatistic: true }
  );
  private players = new Map<string, number>(); // playerId → currentScore

  updateScore(player: Player): void {
    if (this.players.has(player.id)) {
      this.scores.delete(this.players.get(player.id)!);
    }
    this.scores.set(player.score, player);
    this.players.set(player.id, player.score);
  }

  // O(k) — select by rank, no array copy
  getTopN(n: number): Player[] {
    return this.scores.rangeByRank(0, n - 1)
      .map(key => key !== undefined ? this.scores.get(key) : undefined)
      .filter((p): p is Player => p !== undefined);
  }

  // O(log n) — direct rank lookup
  getRank(playerId: string): number {
    if (!this.players.has(playerId)) return -1;
    return this.scores.getRank(this.players.get(playerId)!) + 1; // 1-based
  }

  // O(log n) — get k-th player by rank
  getPlayerAt(rank: number): Player | undefined {
    const key = this.scores.getByRank(rank - 1); // 0-indexed internally
    return key !== undefined ? this.scores.get(key) : undefined;
  }

  // O(log n + k) — players around a given player
  getAroundMe(playerId: string, range: number): Player[] {
    if (!this.players.has(playerId)) return [];
    const myRank = this.scores.getRank(this.players.get(playerId)!);
    const start = Math.max(0, myRank - range);
    const end = Math.min(this.scores.size - 1, myRank + range);
    return this.scores.rangeByRank(start, end)
      .map(key => key !== undefined ? this.scores.get(key) : undefined)
      .filter((p): p is Player => p !== undefined);
  }

  // Pagination: show page N of the leaderboard
  getPage(page: number, pageSize: number): Player[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    return this.scores.rangeByRank(start, end)
      .map(key => key !== undefined ? this.scores.get(key) : undefined)
      .filter((p): p is Player => p !== undefined);
  }
}

// Usage
const lb = new Leaderboard();
lb.updateScore({ id: '1', name: 'Alice', score: 1000 });
lb.updateScore({ id: '2', name: 'Bob', score: 900 });
lb.updateScore({ id: '3', name: 'Charlie', score: 950 });

console.log(lb.getTopN(2));          // Alice, Charlie
console.log(lb.getRank('2'));        // 3 (Bob is 3rd)
console.log(lb.getPlayerAt(1));      // Alice (1st place)
console.log(lb.getAroundMe('3', 1)); // [Alice, Charlie, Bob]
console.log(lb.getPage(1, 2));       // [Alice, Charlie] (page 1, 2 per page)
```

### 示例 3: 优先级消息队列

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

  length(): number {
    return this.urgent.length + this.normal.length + this.low.length;
  }
}

// Usage
const queue = new PriorityMessageQueue();
queue.enqueue({ id: '1', content: 'Normal task', priority: 5, timestamp: Date.now() });
queue.enqueue({ id: '2', content: 'Urgent task', priority: 9, timestamp: Date.now() });
queue.enqueue({ id: '3', content: 'Low task', priority: 1, timestamp: Date.now() });

while (queue.length() > 0) {
  const msg = queue.dequeue();
  console.log(msg?.id); // 2, 1, 3 (urgent first)
}
```

### 示例 4: 任务调度器

```typescript
interface Task {
  id: string;
  action: () => Promise<void>;
  priority: number;
  scheduledTime: number;
}

class TaskScheduler {
  private queue = new MaxPriorityQueue<Task>([], {
    comparator: (a, b) => a.priority - b.priority
  });
  private running = false;

  scheduleTask(task: Task): void {
    this.queue.add(task);
    if (!this.running) void this.start();
  }

  private async start(): Promise<void> {
    this.running = true;

    while (!this.queue.isEmpty()) {
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

### 示例 5: 自动补全搜索索引

```typescript
import {Trie} from 'data-structure-typed';

class SearchIndex {
  private trie = new Trie();
  private documents = new Map<string, string[]>();

  indexDocument(docId: string, content: string): void {
    const words = content.toLowerCase().split(/\s+/);

    for (const word of words) {
      // Insert word into trie
      if (!this.trie.has(word)) {
        this.trie.add(word);
      }

      // Track which documents contain this word
      if (!this.documents.has(word)) {
        this.documents.set(word, []);
      }
      this.documents.get(word)!.push(docId);
    }
  }

  autocomplete(prefix: string): string[] {
    const words = this.trie.getWords(prefix);
    return words.filter((_word, index) => index < 10); // Top 10
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

## 常见错误

### 错误 1: 忘记转换回数组

```typescript
// ❌ 错误
const tree = new RedBlackTree([5, 2, 8]);
const doubled = tree.map((_v, k) => [k * 2, undefined]);   // Still a tree!
JSON.stringify(doubled);                                   // Error or wrong output
```

```typescript
// ✅ 正确
const tree = new RedBlackTree([5, 2, 8]);
const doubled = tree.map((_v, k) => [k * 2, undefined]);
JSON.stringify([...doubled.keys()]); // [4, 10, 16]
```

### 错误 2: 迭代时修改结构

```typescript
// ❌ 错误
const tree = new RedBlackTree([1, 2, 3, 4, 5, 6]);
for (const [key, _value] of tree) {
  if (key % 2 === 0) tree.delete(key);  // Avoid this!
}
```

```typescript
// ✅ 正确
const tree = new RedBlackTree([1, 2, 3, 4, 5, 6]);
const toDelete = [];
for (const [key, _value] of tree) {
  if (key % 2 === 0) toDelete.push(key);
}
toDelete.forEach(v => tree.delete(v));
```

```typescript
// ✅ 完美
const tree = new RedBlackTree([1, 2, 3, 4, 5, 6]);
tree.deleteWhere((node) => node.key % 2 === 0);
```

### 错误 3: 错误的数据结构选择

```typescript
// ❌ 错误 - using Array for sorted data with updates
const scores = [];
function addScore(score) {
  scores.push(score);
  scores.sort((a, b) => b - a);  // O(n log n) every time!
}
```

```typescript
// ✅ 正确 - using RedBlackTree
const scores = new RedBlackTree();
function addScore(score) {
  scores.set(score, true);  // O(log n), auto-sorted
}
```

---

## 最佳实践

### 1. 提前选择数据结构

```typescript
// ❌ 不好: Convert later
function processScores(scores: number[]) {
  const sorted = [...scores].sort((a, b) => b - a);
  return new RedBlackTree(sorted).filter(x => x > 50);  // Redundant
}
```

```typescript
// ✅ 好: Decide upfront
function processScores(scores: number[]) {
  const tree = new RedBlackTree(scores);  // Already sorted
  return tree.filter(x => x > 50).map((_v,k) => [k * 1.1, undefined]);
}
```

### 2. 尽可能批量操作

```typescript
// ❌ 不好: Individual inserts
const tree = new RedBlackTree();
for (const item of largeDataset) {
  tree.set(item.id, item);  // Rebalances each time
}
```

```typescript
// ✅ 好: Bulk insert
const tree = new RedBlackTree(largeDataset);
```

### 3. 使用类型安全

```typescript
// ❌ 不好: No type checking
const tree = new RedBlackTree();
tree.set(1, { id: 1, name: 'Alice' });
```

```typescript
// ✅ 好: Full type inference
const tree = new RedBlackTree<number, User>();
tree.set(1, { id: 1, name: 'Alice' });
```

### 4. 尽可能使用链式调用

```typescript
// ❌ 不好: Convert unnecessarily
const result = [...tree]
  .filter(x => x > 10)
  .map(x => x * 2)
  .reduce((sum, x) => sum + x, 0);
```

```typescript
// ✅ 好: Stay on structure
const result = tree
  .filter(v => v > 10)
  .map(v => [(v ?? 0) * 2, undefined])
  .reduce((sum, v) => sum + (v ?? 0), 0);
```

---

**需要更多内容?** 查看 [INTEGRATIONS_CN.md](./INTEGRATIONS_CN.md) 了解框架集成示例。

**性能相关问题?** 参阅 [PERFORMANCE_CN.md](./PERFORMANCE_CN.md)。
