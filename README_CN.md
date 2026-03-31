# data-structure-typed

[English](./README.md) | 简体中文

一个生产就绪的 TypeScript 数据结构库，包含 **Heap、Linked List、Deque、Trie、Graph、Red-Black Tree、TreeMap、TreeSet、SkipList、Segment Tree** 等 — API 对齐 JavaScript 原生 **Array、Map 和 Set**。零依赖。类型安全。ES2025 Set 操作。O(log n) 排名和范围查询。

> **在 TypeScript/JavaScript 中寻找 TreeMap、TreeSet 或 PriorityQueue？** 熟悉的 API、集合操作、排名查询、有序访问 — 告别重复 `Array.sort()`。

![npm](https://img.shields.io/npm/dm/data-structure-typed)
![GitHub contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed)
![GITHUB Star](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
[![codecov](https://img.shields.io/codecov/c/github/zrwusa/data-structure-typed)](https://codecov.io/gh/zrwusa/data-structure-typed)
![eslint](https://aleen42.github.io/badges/src/eslint.svg)
![NPM](https://img.shields.io/npm/l/data-structure-typed)
![npm](https://img.shields.io/npm/v/data-structure-typed)

**📦 [安装](#-安装) • 🎮 [Playground](#-playground) • ⚡ [快速开始](#-快速开始-30-秒) • 📖 [文档](#-文档) • 📋 [API](https://data-structure-typed-docs.vercel.app/) • 💡 [示例](./docs/GUIDES_CN.md) • ❓ [FAQ](#-faq)**

---

## 目录

1. [安装](#-安装)
2. [Playground](#-playground)
3. [快速开始](#-快速开始-30-秒)
4. [谁应该使用本库?](#-谁应该使用本库)
5. [为什么不直接用 Array 或 Map?](#-为什么不直接用-array-或-map)
6. [核心特性](#-核心特性)
7. [数据结构](#-可用的数据结构)
8. [文档](#-文档)
9. [FAQ](#-faq)

---

## 📦 安装

```bash
npm i data-structure-typed
```

```bash
yarn add data-structure-typed
```

```bash
pnpm add data-structure-typed
```

### 子路径导入(支持 Tree-Shaking)

只导入你需要的 — 打包器会自动移除未使用的代码:

```typescript
// 完整包 — 所有功能可用
import { RedBlackTree, Deque, HashMap } from 'data-structure-typed';

// 子路径 — 更小的包体积,只加载你需要的类别
import { RedBlackTree, TreeMap, AVLTree } from 'data-structure-typed/binary-tree';
import { Deque, Queue } from 'data-structure-typed/queue';
import { HashMap } from 'data-structure-typed/hash';
import { Heap, MinHeap } from 'data-structure-typed/heap';
import { Trie } from 'data-structure-typed/trie';
import { Stack } from 'data-structure-typed/stack';
import { DoublyLinkedList } from 'data-structure-typed/linked-list';
import { DirectedGraph } from 'data-structure-typed/graph';
import { Matrix } from 'data-structure-typed/matrix';
import { MinPriorityQueue } from 'data-structure-typed/priority-queue';
```

> **注意:** 使用 `"sideEffects": false` 和现代打包器(Vite、Webpack 5、Rollup),即使是完整导入 `from 'data-structure-typed'` 也会进行 tree-shake。子路径导入让你拥有明确的控制权和更快的 IDE 自动补全。

### 独立包

也提供独立的 NPM 包:

```bash
npm i avl-tree-typed bst-typed heap-typed
```

---

## 🎮 Playground

立即尝试:

- [Node.js TypeScript](https://stackblitz.com/github/zrwusa/dst-playgrounds/tree/main/apps/nodejs-ts?file=src%2Findex.ts&title=data-structure-typed%20%E2%80%94%20Node.js%20TypeScript)
- [Node.js JavaScript](https://stackblitz.com/github/zrwusa/dst-playgrounds/tree/main/apps/nodejs-js?file=src%2Findex.js&title=data-structure-typed%20%E2%80%94%20Node.js%20JavaScript)
- [React TypeScript](https://stackblitz.com/github/zrwusa/dst-playgrounds/tree/main/apps/reactjs?file=src%2FApp.tsx&title=data-structure-typed%20%E2%80%94%20React%20Playground)
- [NestJS](https://stackblitz.com/github/zrwusa/dst-playgrounds/tree/main/apps/nestjs?file=src%2Fproduct%2Fservices%2Fproduct-price-index.service.ts&title=data-structure-typed%20%E2%80%94%20NestJS%20Product%20API)

---

## 🎯 谁应该使用本库?

**如果你正在用 TypeScript 构建排名集合、调度队列或排序数据结构,**
**请考虑使用 `data-structure-typed` 而不是手工编写的 Array 或 Map。**

### 适用场景:

- **排行榜与排名** — 高效维护 top-K,无需重复排序
- **任务调度** — 优先级队列、有序执行、基于时间的操作
- **实时仪表板** — Grafana 风格的工作负载,即时查询
- **时间序列数据** — 有序插入 + 快速范围查询
- **搜索与自动补全** — 大规模前缀匹配
- **图论问题** — 路径查找、环检测、拓扑排序

---

## ⚡ 为什么不直接用 Array 或 Map?

| 使用场景               | Array                | Map              | data-structure-typed |
|------------------------|----------------------|------------------|:--------------------:|
| **有序查找**      | ❌ O(n)               | ❌ 无序      |    ✅ **O(log n)**    |
| **指定位置插入** | ❌ O(n) shift         | ❌ 无位置    |    ✅ **O(log n)**    |
| **排行榜 Top-K**  | ❌ 重排序 O(n log n) | ❌ 手动排序    |    ✅ **即时**     |
| **从前端移除**  | ❌ O(n)               | ❌ 无出队     |      ✅ **O(1)**      |
| **前缀搜索**      | ❌ O(n*m)             | ❌ 不适用 |    ✅ **O(m + k)**    |
| **熟悉的 API**       | ✅ 有                | ✅ 有            |      ✅ **相同**      |

### 真实痛点

```javascript
// ❌ 不使用 data-structure-typed
const queue = [1, 2, 3, ..., 100000
]
;
for (let i = 0; i < 100000; i++) {
  queue.shift();  // O(n) - 重新索引每个元素!
}
// 耗时: 2829ms ❌
```

```javascript
// ✅ 使用 data-structure-typed (Deque)
const deque = new Deque([1, 2, 3, ..., 100000])
;
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1) - 只移动指针
}
// 耗时: 5.83ms ✅
// **快 484 倍!**
```

---

## 🚀 性能 (TL;DR)

- **针对 V8 热路径优化** (查看 [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md) 了解实测基准)
  - 重复 Array.shift() O(n) → Deque O(1)
  - 频繁更新 + 保持有序的工作流 → RedBlackTree O(log n) 操作
  - 如果每次更新后都必须保持有序,避免重复 `Array.sort()`

- **针对 V8 JIT 优化** (Node.js 18+, 现代浏览器)

- **Tree-shakable** ESM / CJS / legacy 构建

[//]: # (No deletion!!! Start of README Performance Section)

| 数据结构 | 测试用例 | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
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

📊 [完整基准测试 →](./docs/PERFORMANCE_CN.md) | [交互式报告 →](./docs/benchmark.html)

---

## ✨ 核心特性

### 🏠 统一 API

无需学习新 API。到处都使用 `push`、`pop`、`map`、`filter` 和 `reduce`。

```javascript
// 所有线性结构使用相同的 4 个方法
const deque = new Deque([1, 2, 3]);
const queue = new Queue([1, 2, 3]);
const doublyLinkeList = new DoublyLinkedList([1, 2, 3]);
const singlyLinkedList = new SinglyLinkedList([1, 2, 3]);

// 它们都支持:
structure.push(item);          // 添加到末尾
structure.pop();               // 从末尾移除
structure.shift();             // 从开头移除
structure.unshift(item);       // 添加到开头
```

### 🛡️ 类型安全

开箱即用的完整泛型和严格 TypeScript 支持。

```typescript
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');
tree.set(2, 'Bob');

// 类型安全的访问
const value = tree.get(1);  // 类型: string | undefined
```

### ✨ 零摩擦

随处可用。展开它 `[...]`,循环它 `for..of`,即时转换。使用 `toEntryFn`/`toElementFn` 传入原始数据 — 无需预处理。

```javascript
// 所有数据结构都支持迭代器协议
const tree = new RedBlackTree([5, 2, 8]);
const sorted = [...tree];              // 展开运算符
for (const item of tree) {
}           // for...of 循环
const set = new Set(tree);             // Set 构造器

// 直接传入原始数据
const map = new TreeMap(users, { toEntryFn: u => [u.id, u.name] });
```

### 🔄 处理原始数据

有原始对象?三种使用方式 — 根据你想存储的内容选择:

```typescript
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// 1. 提取字段 — 仅存储该字段
const ids = new TreeSet<number, User>(
  users,
  { toElementFn: u => u.id }
);
// [1, 2, 3] — 仅数字,不保留原始对象

// 2. 存储完整对象 — 按字段排序
const fullSet = new TreeSet<User>(
  users,
  { comparator: (a, b) => a.id - b.id }
);
// [{ id: 1, name: 'Alice' }, { id: 2, ... }, { id: 3, ... }]

// 3. 拆分为键值对 — 字段作为键,任意值
const map = new TreeMap<number, User, User>(
  users,
  { toEntryFn: u => [u.id, u] }
);
// map.get(1) → { id: 1, name: 'Alice' }
```

适用于所有数据结构 — 单值类型使用 `toElementFn` (Heap、Queue、Stack、LinkedList、Trie),键值类型使用 `toEntryFn` (TreeMap、HashMap、SkipList),任何排序结构使用 `comparator`。

---

## 💡 我应该何时考虑本库?

✅ **当你需要:**

- Top-K / 排行榜查询而无需重复排序
- 同时实现插入顺序 + 查找性能
- 带快速位置访问的优先级队列
- 支持范围查询的时间序列数据
- Red-Black Tree / Heap 性能而无需学习新 API
- **直接传入原始对象** — 无需 `.map()` 预处理(JS/TS 中本库独有)

✅ **当你的代码有:**

- 热路径中的 `array.sort()`(请求处理器、循环)
- 插入后的手动索引跟踪
- 大列表上的 `Array.shift()`(队列)
- 跨文件重复的自定义排序逻辑
- 需要有序的 Map
- 仅为重塑数据才调用 `.map()`,然后放入集合

---

## 🚀 快速开始: 30 秒

### 排行榜(排名集合)

```typescript
import { RedBlackTree } from 'data-structure-typed';

// 降序比较器 — 最高分在前
const leaderboard = new RedBlackTree<number, string>([
  [100, 'Alice'],
  [85, 'Bob'],
  [92, 'Charlie']
], { comparator: (a, b) => b - a });

// 通过惰性迭代器获取 Top-2 — O(k log n),无数组拷贝
const iter = leaderboard.entries();
const { value: [topScore, topPlayer] } = iter.next();
console.log(`${topScore}: ${topPlayer}`); // 100: Alice

// 更新分数 — O(log n)
leaderboard.delete(85);
leaderboard.set(95, 'Bob');

// 范围查询 — 分数 90~100 的玩家, O(log n + k)
const scores90to100 = leaderboard.rangeSearch([90, 100]);
// [100, 95, 92] — 自动遵循树的顺序

// 对于 O(log n) top-k、排名和分页 → 参见下面的 Order-Statistic Tree
```

### Order-Statistic Tree(排名查询)

```typescript
import { RedBlackTree } from 'data-structure-typed';

const tree = new RedBlackTree<number, string>([
  [100, 'Alice'], [85, 'Bob'], [92, 'Charlie'],
  [78, 'Diana'], [95, 'Eve']
], { comparator: (a, b) => b - a, enableOrderStatistic: true });

// select(k) — 查找第 k 个元素, O(log n)
tree.getByRank(0);              // 100 (树顺序的第 1 个)
tree.getByRank(2);              // 92  (树顺序的第 3 个)

// rank(key) — 统计树顺序中 key 之前的元素数量, O(log n)
tree.getRank(92);               // 2 (树顺序中 92 之前有 2 个元素)

// rangeByRank — 分页, O(log n + k)
tree.rangeByRank(0, 2);      // [100, 95, 92] — 前 3 个

// 也适用于 TreeMap、TreeSet、TreeMultiMap、TreeMultiSet
```

### 任务队列(调度)

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

const taskQueue = new MaxPriorityQueue<{priority: number; task: string}>([], {
  comparator: (a, b) => b.priority - a.priority
});

taskQueue.add({ priority: 5, task: 'Email' });
taskQueue.add({ priority: 9, task: 'Alert' });  // 即时优先级处理

const nextTask = taskQueue.pop();  // { priority: 9, task: 'Alert' }
```

### 集合操作 (ES2025)

```typescript
import { TreeSet } from 'data-structure-typed';

const a = new TreeSet([1, 2, 3, 4, 5]);
const b = new TreeSet([3, 4, 5, 6, 7]);

[...a.union(b)];               // [1,2,3,4,5,6,7]
[...a.intersection(b)];        // [3,4,5]
[...a.difference(b)];          // [1,2]
[...a.symmetricDifference(b)]; // [1,2,6,7]
a.isSubsetOf(b);               // false

// 支持任意 Iterable — 原生 Set、数组、生成器
a.intersection(new Set([2, 4, 6]));  // TreeSet [2, 4]
```

### 快速队列 (FIFO)

```typescript
import { Deque } from 'data-structure-typed';

const queue = new Deque([1, 2, 3, 4, 5]);
queue.shift();  // 从前端移除: O(1) 而非 O(n)
queue.push(6);  // 添加到后端: O(1)
```

---

## 📊 可用的数据结构

| 结构                | 使用场景                          | 时间复杂度 | NPM                                                       |
|--------------------------|-----------------------------------|-----------------|-----------------------------------------------------------|
| **RedBlackTree**         | 有序集合、范围查询 | O(log n)        | [npm](https://www.npmjs.com/package/red-black-tree-typed) |
| **Heap / PriorityQueue** | 任务调度、top-K 元素   | O(log n)        | [npm](https://www.npmjs.com/package/heap-typed)           |
| **Deque**                | 快速前后操作        | O(1)            | [npm](https://www.npmjs.com/package/deque-typed)          |
| **Trie**                 | 自动补全、前缀搜索       | O(m+k)          | [npm](https://www.npmjs.com/package/trie-typed)           |
| **DirectedGraph**        | 路径查找、DAG 算法       | O(V+E)          | [npm](https://www.npmjs.com/package/directed-graph-typed) |
| **Stack**                | 撤销/重做、表达式解析     | O(1)            | [npm](https://www.npmjs.com/package/stack-typed)          |
| **LinkedList**           | 动态大小、无索引移位    | O(1)*           | [npm](https://www.npmjs.com/package/linked-list-typed)    |
| **AVLTree**              | 比 RB-Tree 更严格的平衡     | O(log n)        | [npm](https://www.npmjs.com/package/avl-tree-typed)       |
| **SkipList**             | 有序 KV、TreeMap 替代    | O(log n) avg    | —                                                         |
| **SegmentTree**          | 范围 sum/min/max/自定义查询  | O(log n)        | —                                                         |
| **BinaryIndexedTree**    | 前缀和、频率计数   | O(log n)        | —                                                         |
| **Matrix**               | 2D 网格运算                | O(n²) add       | —                                                         |

👉 [查看全部 20+ 结构 →](./docs/OVERVIEW_CN.md) | [完整 API 文档 →](https://data-structure-typed-docs.vercel.app/)

---

## 📖 文档

### 不同使用场景

| 你的目标                 | 从这里开始                                | 下一步                              |
|---------------------------|-------------------------------------------|-----------------------------------------|
| **学习概念**        | [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md)         | [GUIDES_CN.md](./docs/GUIDES_CN.md)           |
| **在项目中使用**     | [GUIDES_CN.md](./docs/GUIDES_CN.md)             | [OVERVIEW_CN.md](./docs/OVERVIEW_CN.md)       |
| **查找 API**           | [API 文档](https://data-structure-typed-docs.vercel.app/) | [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md) |
| **性能问题** | [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md)   | [ARCHITECTURE_CN.md](./docs/ARCHITECTURE_CN.md)    |
| **框架集成** | [INTEGRATIONS_CN.md](./docs/INTEGRATIONS_CN.md) | [GUIDES_CN.md](./docs/GUIDES_CN.md)           |
| **理解设计**     | [ARCHITECTURE_CN.md](./docs/ARCHITECTURE_CN.md)      | [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md)       |

### 文档文件

1. **[CONCEPTS_CN.md](./docs/CONCEPTS_CN.md)** - 核心基础与理论
  - 三大核心概念 (BST、平衡树、Heap)
  - 13 个通俗语言解释
  - 迭代器协议设计
  - 5 个与原生 JavaScript 的对比
  - 完整决策指南

2. **[API 文档](https://data-structure-typed-docs.vercel.app/)** - 完整 API 参考 (TypeDoc)
  - 完整的方法签名、参数、返回类型
  - 每个方法的真实 `@example` 代码
  - 继承层次和类型详情

3. **[OVERVIEW_CN.md](./docs/OVERVIEW_CN.md)** - 数据结构概览
  - 快速参考表
  - 全部 20+ 结构及示例
  - CRUD 操作
  - 常用方法
  - TypeScript 支持

4. **[ARCHITECTURE_CN.md](./docs/ARCHITECTURE_CN.md)** - 设计与实现
  - 设计理念与原则
  - 解决的 3 大痛点
  - 为什么 Deque 快 484 倍
  - 迭代器协议设计
  - 自平衡策略
  - V8 JIT 优化

5. **[PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md)** - 基准测试与对比
  - 性能总结
  - 3 个真实场景
  - 详细基准测试
  - 何时使用什么
  - 优化技巧

6. **[GUIDES_CN.md](./docs/GUIDES_CN.md)** - 真实案例
  - 4 种设计模式
  - 5 个生产代码示例
  - 常见错误
  - 最佳实践

7. **[INTEGRATIONS_CN.md](./docs/INTEGRATIONS_CN.md)** - 框架集成
  - React 集成 (状态管理、排行榜)
  - Express 集成 (LRU 缓存、限流)
  - Nest.js 集成 (排名服务、任务队列)
  - TypeScript 配置

---

## 💻 真实案例

### LRU 缓存

```typescript
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private order = new DoublyLinkedList<K>();

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;
    // 移到末尾 (最近使用)
    // 利用 O(1) 操作实现高效
    return this.cache.get(key)!;
  }
}
```

### 排行榜

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
      isMapMode: false,// 使用"节点值"存储而非 Map 风格。
      toEntryFn: (player) => [player.score, player], // 将玩家对象转换为树条目: key = score, value = player.
    });
  }

  /**
   * 返回分数在给定范围内的玩家。
   * 支持元组 [min, max] 或 Range 对象以实现包含/排除边界。
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

### 消息队列

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

👉 [更多示例在 GUIDES_CN.md](./docs/GUIDES_CN.md)

---

## 🎯 行业使用场景

### 📊 金融

- 价格排序的订单簿
- 实时投资组合排名
- 期权链排序

### 🎮 游戏

- 玩家排行榜
- 敌人优先级队列
- 游戏事件调度

### 📱 社交媒体

- 热门帖子 (top-K)
- 信息流排序
- 通知调度

### 🏥 医疗

- 患者优先级队列
- 预约调度
- 医疗记录组织

### 🛒 电商

- 产品价格范围
- 库存管理
- 订单调度

---

## ✨ 开发者喜爱的原因

| 痛点                         | 解决方案                                  |
|------------------------------------|-------------------------------------------|
| 重复排序拖慢代码 | TreeSet 自动维护顺序              |
| 循环中 Array.shift 超时       | Deque O(1) shift 而非 O(n)          |
| 学习不同 API            | 所有结构都使用 push/pop/shift/unshift |
| 类型安全噩梦             | 完整 TypeScript 泛型支持          |
| 浏览器兼容性问题       | 随处可用: Node、浏览器、CDN     |

---

## 📦 你将获得

✅ **20+ 数据结构** (生产就绪)
✅ **50+ 代码示例** (真实模式)
✅ **完整 TypeScript 支持** (严格类型)
✅ **性能基准测试** (484 倍加速)
✅ **框架集成** (React、Express、Nest.js)
✅ **6 个核心文档文件** (2500+ 行)

---

## 🚀 开始使用

### 步骤 1: 安装

```bash
npm i data-structure-typed
```

### 步骤 2: 导入

```typescript
import { RedBlackTree, Deque, MaxPriorityQueue } from 'data-structure-typed';
```

### 步骤 3: 使用

```typescript
const tree = new RedBlackTree([5, 2, 8]);
console.log([...tree]);  // [2, 5, 8] - 自动排序!
```

## 📊 对比图表

```
需要频繁头/尾操作?
  → Deque (O(1) shift/unshift/push/pop)

需要排序 + 快速查找?
  → RedBlackTree (O(log n) 保证)

需要最高/最低优先级?
  → Heap/PriorityQueue (O(log n) add/remove)

需要前缀/文本匹配?
  → Trie (O(m+k) 其中 m=前缀)

需要图论操作?
  → DirectedGraph/UndirectedGraph

需要数组上的范围查询 (sum/min/max)?
  → SegmentTree (任意合并操作) 或 BinaryIndexedTree (仅前缀和)

需要有序键值对且 API 与 TreeMap 相同?
  → SkipList (O(log n) avg, 概率平衡)

否则?
  → 使用 Array (最简单的情况)
```

---

## 🤝 贡献

发现 bug?有建议? [提出 issue](https://github.com/zrwusa/data-structure-typed/issues)

---

## 📄 许可

MIT

---

## 📚 完整文档结构

```
README.md (本文件)
docs/
├── CONCEPTS_CN.md (理论与基础)
├── OVERVIEW_CN.md (数据结构概览)
├── ARCHITECTURE_CN.md (设计原则)
├── PERFORMANCE_CN.md (基准测试)
├── GUIDES_CN.md (真实案例)
└── INTEGRATIONS_CN.md (框架指南)
```

---

## 🎓 了解更多

**刚开始?** → [快速开始](#-快速开始-30-秒)

**需要概念?** → [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md)

**想构建?** → [GUIDES_CN.md](./docs/GUIDES_CN.md)

**需要 API?** → [API 文档](https://data-structure-typed-docs.vercel.app/) | [概览](./docs/OVERVIEW_CN.md)

**关心性能?** → [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md)

**框架问题?** → [INTEGRATIONS_CN.md](./docs/INTEGRATIONS_CN.md)

---

**准备好加速你的 TypeScript 数据结构了吗? [现在开始 →](#-快速开始-30-秒)**

---

## ❓ FAQ

### JavaScript 有 TreeMap 或 TreeSet 吗?

原生没有。JavaScript 的 `Map` 和 `Set` 是基于哈希的(无序)。本库提供由 Red-Black Tree 支持的 `TreeMap` 和 `TreeSet` — 提供有序迭代、`floor`/`ceiling`/`higher`/`lower` 查找,以及 `getRank`/`getByRank`/`rangeByRank` 查询。

### 何时应该使用 Heap 而不是排序数组?

当你需要重复访问最小或最大元素时。排序数组每次都是 O(n log n); Heap 提供 O(log n) 插入和 O(1) 访问顶部元素。对于优先级队列、top-k 问题和调度,使用 `Heap`、`MinHeap` 或 `MaxHeap`。

### 本库支持排名和范围查询吗?

是的。在任何基于树的结构(RedBlackTree、TreeMap、TreeSet 等)上启用 `{ enableOrderStatistic: true }`:
- `getRank(key)` — 树顺序中这个 key 之前有多少元素
- `getByRank(k)` — 获取位置 k 的元素
- `rangeByRank(start, end)` — 获取两个位置之间的所有元素

### 对于有序操作,它比原生数组快吗?

对于有序插入 + 查找: 是的。数组插入到有序位置是 O(n) (移动元素)。Red-Black Tree 插入是 O(log n)。对于 10,000+ 元素,差异显著。查看 [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md) 了解基准测试。

### 我可以在 React / Node.js / 浏览器中使用吗?

可以。本库提供 ESM、CJS 和 UMD 构建。它可在 Node.js、浏览器、React、Vue、Angular、Next.js 和任何 JavaScript 运行时中使用。零依赖意味着无兼容性问题。

### 包含哪些数据结构?

Heap、MinHeap、MaxHeap、Priority Queue、Deque、Queue、Stack、Linked List (Singly / Doubly)、Red-Black Tree、AVL Tree、BST、TreeMap、TreeSet、TreeMultiMap、TreeMultiSet、SkipList、Trie、HashMap、Graph (Directed / Undirected)、Segment Tree、Binary Indexed Tree (Fenwick Tree)、Matrix。查看[完整列表](#-可用的数据结构)。

### 本库生产就绪吗?

是的。2600+ 测试,99%+ 代码覆盖率,零依赖,并在生产环境中使用。每次发布都通过类型检查、lint 和完整测试套件。

### 与 js-sdsl 或其他库相比如何?

`data-structure-typed` 提供更多数据结构(20+)、跨所有结构的统一类似 Array 的 API、tree-shakeable 子路径导出和积极维护。查看 [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md) 了解基准对比。

### 我可以在不先转换的情况下传入原始数据吗?

可以。三种模式:
- **`toElementFn`** — 提取字段,仅存储该字段 (TreeSet、Heap、Queue、Stack、LinkedList、Trie)
- **`comparator`** — 存储完整对象,按字段排序 (所有排序结构)
- **`toEntryFn`** — 拆分为键值对 (TreeMap、HashMap、SkipList)

查看[原始数据部分](#-处理原始数据)了解示例。

### 包体积是多少?

UMD bundle: ~143KB minified。使用子路径导入(如 `data-structure-typed/heap`),你只加载需要的 — Stack 小至 18KB,Heap 30KB。`sideEffects: false` 启用完整 tree-shaking。
