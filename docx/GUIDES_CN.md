# 指南：实战示例和生产模式

用于常见用例的生产就绪代码示例。边做边学。

**[回到 README](../README_CN.md) • [API 参考](./REFERENCE_CN.md) • [集成](./INTEGRATIONS_CN.md)**

---

## 目录

1. [设计模式](#设计模式)
2. [实战示例](#实战示例)
3. [常见错误](#常见错误)
4. [最佳实践](#最佳实践)

---

## 设计模式

### 模式 1：迭代器模式（零转换）

```typescript
import { RedBlackTree } from 'data-structure-typed';

// 问题：需要以多种方式处理排序数据
const scores = [95, 23, 67, 89, 12, 45];

// 解决方案：使用迭代器协议
const tree = new RedBlackTree(scores);

// 方法 1：展开操作符
const sorted = [...tree];
console.log(sorted); // [12, 23, 45, 67, 89, 95]

// 方法 2：for...of 循环
for (const score of tree) {
  console.log(score);
}

// 方法 3：解构
const [min, ...rest] = tree;

// 方法 4：Set 构造器
const unique = new Set(tree);

// 方法 5：Array.from()
const array = Array.from(tree);

// 所有自动工作 - 零转换！
```

### 模式 2：方法链（保持结构）

```typescript
import { RedBlackTree } from 'data-structure-typed';

const data = [
  [1, { name: 'Alice', score: 95 }],
  [2, { name: 'Bob', score: 45 }],
  [3, { name: 'Charlie', score: 87 }],
];

const tree = new RedBlackTree(data);

// 链接操作 - 结构全程保持
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

### 模式 3：无缝结构转换

```typescript
import { RedBlackTree, Deque, MaxHeap } from 'data-structure-typed';

const data = [64, 34, 25, 12, 22, 11, 90];

// 瞬间在结构间转换
const tree = new RedBlackTree(data);
const sorted = [...tree.keys()];     // [11, 12, 22, 25, 34, 64, 90]

const heap = new MaxHeap(sorted);
const byPriority = [...heap];        // [90, 64, 34, ...]

const deque = new Deque(byPriority);
const processed = deque.shift();      // 移除第一个 - O(1)！

// 无中间转换，尽可能保持结构
```

### 模式 4：带类型的条件逻辑

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

## 实战示例

### 示例 1：LRU 缓存

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

    // 移到末尾（最近使用）
    this.order.delete(node);
    const newNode = this.order.push(key);
    this.cache.set(key, { value, node: newNode });

    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.get(key); // 标记为最近使用
      this.cache.set(key, { value, node: this.cache.get(key)!.node });
      return;
    }

    if (this.cache.size >= this.capacity) {
      // 驱逐最少最近使用
      const lru = this.order.shift();
      this.cache.delete(lru);
    }

    const node = this.order.push(key);
    this.cache.set(key, { value, node });
  }
}

// 用法
const cache = new LRUCache<string, string>(3);
cache.set('a', 'value1');
cache.set('b', 'value2');
cache.set('c', 'value3');
console.log(cache.get('a')); // 'value1'，'a' 现在最近
cache.set('d', 'value4');    // 驱逐 'b'（最少最近）
```

### 示例 2：实时排行榜

```typescript
import { RedBlackTree } from 'data-structure-typed';

interface Player {
  id: string;
  name: string;
  score: number;
}

class Leaderboard {
  private scores = new RedBlackTree<number, Player>(
    (a, b) => b - a  // 降序
  );
  private players = new Map<string, number>(); // playerId → 当前分数

  updateScore(player: Player): void {
    // 如果存在，移除旧分数
    if (this.players.has(player.id)) {
      const oldScore = this.players.get(player.id)!;
      this.scores.delete(oldScore);
    }

    // 添加新分数
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

// 用法
const lb = new Leaderboard();
lb.updateScore({ id: '1', name: 'Alice', score: 1000 });
lb.updateScore({ id: '2', name: 'Bob', score: 900 });
lb.updateScore({ id: '3', name: 'Charlie', score: 950 });

console.log(lb.getTopN(2));        // 前 2 名玩家
console.log(lb.getRank('2'));      // Bob 的排名
console.log(lb.getAroundMe('2', 1)); // Bob 周围的玩家
```

### 示例 3：带优先级的消息队列

```typescript
import { Deque, MaxPriorityQueue } from 'data-structure-typed';

interface Message {
  id: string;
  content: string;
  priority: number;
  timestamp: number;
}

class PriorityMessageQueue {
  private urgent = new Deque<Message>();  // 优先级 >= 8
  private normal = new Deque<Message>();  // 优先级 4-7
  private low = new Deque<Message>();     // 优先级 < 4

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
    // 优先处理紧急，然后普通，然后低
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
```

---

## 常见错误

### 错误 1：不使用迭代器协议

```typescript
// ❌ 错误：手动转换
const tree = new RedBlackTree([5, 2, 8]);
const arr = tree.toArray();  // 不必要的转换
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// ✅ 正确：使用迭代器
const tree = new RedBlackTree([5, 2, 8]);
for (const item of tree) {
  console.log(item);
}
```

### 错误 2：为了排序创建多个结构

```typescript
// ❌ 错误：创建新结构排序
const data = [5, 2, 8, 1, 9];
const array = data.slice();  // 复制
array.sort((a, b) => a - b); // 重新排序

// ✅ 正确：使用排序结构
const tree = new RedBlackTree(data);
// 自动排序！
```

### 错误 3：忘记 O(1) Deque shift

```typescript
// ❌ 错误：使用 Array，O(n) shift
const queue = [1, 2, 3, 4, 5];
for (let i = 0; i < 100000; i++) {
  queue.shift();  // O(n) 每次！
}

// ✅ 正确：使用 Deque，O(1) shift
const deque = new Deque([1, 2, 3, 4, 5]);
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1) 每次
}
```

---

## 最佳实践

1. **选择正确的结构**：根据使用模式选择（见决策指南）
2. **使用迭代器**：避免不必要的 `.toArray()` 转换
3. **链接方法**：保持数据在结构上，避免转换
4. **类型安全**：充分利用 TypeScript 泛型
5. **性能测试**：对热路径进行基准测试

---

更多信息见 [INTEGRATIONS_CN.md](./INTEGRATIONS_CN.md) 了解框架集成。
