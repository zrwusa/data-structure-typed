# GUIDES: 实战例子与生产模式

生产就绪的代码示例，用于常见的使用场景。通过实践学习。

**[返回 README](../README_CN.md) • [API 参考](./REFERENCE_CN.md) • [查看 INTEGRATIONS](./INTEGRATIONS_CN.md)**

---

## 目录

1. [设计模式](#设计模式)
2. [实战例子](#实战例子)
3. [常见错误](#常见错误)
4. [最佳实践](#最佳实践)

---

## 设计模式

### 模式 1: Iterator 模式（零转换）

```typescript
import { RedBlackTree } from 'data-structure-typed';

// 问题：需要以多种方式处理排序数据
const scores = [95, 23, 67, 89, 12, 45];

// 解决方案：使用 iterator 协议
const tree = new RedBlackTree(scores);

// 方法 1: 扩展运算符
const sorted = [...tree.keys()];
console.log(sorted); // [12, 23, 45, 67, 89, 95]

// 方法 2: for...of 循环
for (const [score] of tree) {
  console.log(score);
}

// 方法 3: 解构
const [min, ...rest] = tree.keys();

// 方法 4: Set 构造器
const unique = new Set(tree.keys());

// 方法 5: Array.from()
const array = Array.from(tree.keys());

// 所有这些都自动工作 - 零转换！
```

### 模式 2: 方法链接（保持在结构上）

```typescript
import { RedBlackTree } from 'data-structure-typed';

const tree = new RedBlackTree([
  [1, { name: 'Alice', score: 95 }],
  [2, { name: 'Bob', score: 45 }],
  [3, { name: 'Charlie', score: 87 }],
]);

// 链接操作 - 结构在整个过程中被维护
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

// 在结构之间立即转换
const tree = new RedBlackTree(data);
const sorted = [...tree.keys()];     // [11, 12, 22, 25, 34, 64, 90]

const heap = new MaxHeap(sorted);
const byPriority = [...heap];        // [90, 64, 34, ...]

const deque = new Deque(byPriority);
const processed = deque.shift();      // 移除第一个 - O(1)！

// 没有中间转换，结构在可能时被保留
```

### 模式 4: 带类型的条件逻辑

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

---

## 实战例子

### 例子 1: LRU 缓存

```typescript
import { DoublyLinkedList } from 'data-structure-typed';

class LRUCache<K, V> {
  private cache = new Map<K, { value: V; node: any }>();
  private order = new DoublyLinkedList<K>();
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;

    const {value, node} = this.cache.get(key)!;

    // 移到末尾（最近使用）
    this.order.delete(node);
    const newNode = this.order.push(key);
    this.cache.set(key, {value, node: newNode});

    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.get(key); // 标记为最近使用
      this.cache.set(key, {value, node: this.cache.get(key)!.node});
      return;
    }

    if (this.cache.size >= this.capacity) {
      // 移除最少最近使用的
      const lru = this.order.shift();
      if (lru) this.cache.delete(lru);
    }

    const node = this.order.push(key);
    this.cache.set(key, {value, node});
  }
}

// 使用
const cache = new LRUCache<string, string>(3);
cache.set('a', 'value1');
cache.set('b', 'value2');
cache.set('c', 'value3');
console.log(cache.get('a')); // 'value1', 'a' 现在最近
cache.set('d', 'value4');    // 移除 'b'（最少最近）
```

### 例子 2: 实时排行榜

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
    // 如果存在，删除旧分数
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

// 使用
const lb = new Leaderboard();
lb.updateScore({ id: '1', name: 'Alice', score: 1000 });
lb.updateScore({ id: '2', name: 'Bob', score: 900 });
lb.updateScore({ id: '3', name: 'Charlie', score: 950 });

console.log(lb.getTopN(2));        // 前 2 名玩家
console.log(lb.getRank('2'));      // Bob 的排名
console.log(lb.getAroundMe('2', 1)); // Bob 周围的玩家
```

### 例子 3: 带优先级的消息队列

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
    // 先提供紧急，然后正常，然后低优先级
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
```

---

## 常见错误

### ❌ 错误 1: 混合使用树和数组方法

```typescript
// 不好：混合转换
const tree = new RedBlackTree([5, 2, 8]);
const arr = tree.toArray();
arr.sort();  // 失去树的优势！
```

```typescript
// 好：保持在树上
const tree = new RedBlackTree([5, 2, 8]);
const sorted = [...tree];  // 自动排序
```

### ❌ 错误 2: 忘记比较器

```typescript
// 不好：默认升序
const tree = new RedBlackTree([5, 2, 8]);
[...tree];  // [2, 5, 8] 升序

// 好：明确指定
const descTree = new RedBlackTree([5, 2, 8], {
  comparator: (a, b) => b - a  // 现在是降序
});
[...descTree];  // [8, 5, 2]
```

### ❌ 错误 3: 修改迭代中的结构

```typescript
// 不好：在迭代中修改
const tree = new RedBlackTree([1, 2, 3]);
for (const item of tree) {
  if (item === 2) tree.delete(item);  // 危险！
}

// 好：收集然后修改
const tree = new RedBlackTree([1, 2, 3]);
const toRemove = [...tree].filter(x => x === 2);
toRemove.forEach(x => tree.delete(x));
```

---

## 最佳实践

### ✅ 实践 1: 使用类型提示

```typescript
// 好：显式类型
interface Task {
  id: string;
  priority: number;
  done: boolean;
}

const tasks = new MaxPriorityQueue<Task>([], {
  comparator: (a, b) => b.priority - a.priority
});

const nextTask: Task | null = tasks.poll();  // 类型安全
```

### ✅ 实践 2: 首选链接而不是多次转换

```typescript
// 不好：多次转换
const result1 = tree.toArray().filter(x => x > 5);
const result2 = result1.map(x => x * 2);
const final = result2.reduce((a, b) => a + b, 0);

// 好：链接
const final = tree
  .filter(x => x > 5)
  .map(x => x * 2)
  .reduce((a, b) => a + b, 0);
```

### ✅ 实践 3: 了解你的时间复杂度

```typescript
// O(log n) 插入和查询
const tree = new RedBlackTree([1, 2, 3]);
tree.set(4, 'value');    // 快速！

// O(1) 队列操作
const queue = new Deque();
queue.push(item);        // 快速！
queue.shift();           // 快速！

// O(1) 堆顶访问
const heap = new MaxHeap([1, 2, 3]);
const max = heap.peek(); // 快速！
```

---

**需要集成帮助？** 查看 [INTEGRATIONS_CN.md](./INTEGRATIONS_CN.md) 了解 React、Express 和 Nest.js。

**想了解性能？** 查看 [PERFORMANCE_CN.md](./PERFORMANCE_CN.md) 了解基准测试。