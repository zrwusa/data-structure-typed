# data-structure-typed

[English](./README.md) | 简体中文

一个全面的 TypeScript 数据结构库，包含生产就绪的实现。

![npm](https://img.shields.io/npm/dm/data-structure-typed)
![GitHub contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed)
![GitHub top language](https://img.shields.io/github/languages/top/zrwusa/data-structure-typed)
![GITHUB Star](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
![eslint](https://aleen42.github.io/badges/src/eslint.svg)
![NPM](https://img.shields.io/npm/l/data-structure-typed)
![npm](https://img.shields.io/npm/v/data-structure-typed)

**📚 [安装](#-安装) • [快速开始](#-快速开始30-秒) • [完整文档](#-文档) • [API 参考](./docs/REFERENCE_CN.md) • [Playground](#-playground) • [示例](./docs/GUIDES_CN.md)**

---

## 目录

1. [谁应该使用本库？](#-谁应该使用本库)
2. [为什么不直接用 Array 或 Map？](#-为什么不直接用-array-或-map)
3. [主要特性](#-主要特性)
4. [安装](#-安装)
5. [快速开始](#-快速开始30-秒)
6. [可用的数据结构](#-可用的数据结构)
7. [文档](#-文档)

---

## 🎯 谁应该使用本库？

**如果你正在构建排名集合、调度队列或排序数据结构，**  
**考虑使用 `data-structure-typed` 而不是手工编写的 Array 或 Map。**

### 完美适用于：

- **排行榜与排名** — 高效维护前 K 个数据，无需重复排序
- **任务调度** — 优先级队列、有序执行、基于时间的操作
- **实时仪表板** — Grafana 风格的工作负载，支持即时查询
- **时间序列数据** — 排序插入 + 快速范围查询
- **搜索与自动完成** — 大规模前缀匹配
- **图论问题** — 路径查找、循环检测、拓扑排序

---

## ⚡ 为什么不直接用 Array 或 Map？

| 使用场景               | Array                | Map              | data-structure-typed |
|------------------------|----------------------|------------------|:--------------------:|
| **排序查询**      | ❌ O(n)               | ❌ 无序      |    ✅ **O(log n)**    |
| **在特定位置插入** | ❌ O(n) shift         | ❌ 无位置    |    ✅ **O(log n)**    |
| **排行榜前 K**  | ❌ 重新排序 O(n log n) | ❌ 手动排序    |    ✅ **即时**     |
| **从前面移除**  | ❌ O(n)               | ❌ 无出队     |      ✅ **O(1)**      |
| **前缀搜索**      | ❌ O(n*m)             | ❌ 不适用 |    ✅ **O(m + k)**    |
| **熟悉的 API**       | ✅ 是                | ✅ 是            |      ✅ **相同**      |

### 真实场景痛点

```javascript
// ❌ 不使用 data-structure-typed
const queue = [1, 2, 3, ..., 100000];
for (let i = 0; i < 100000; i++) {
  queue.shift();  // O(n) - 重新索引所有元素！
}
// 耗时: 2829ms ❌
```

```javascript
// ✅ 使用 data-structure-typed (Deque)
const deque = new Deque([1, 2, 3, ..., 100000]);
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1) - 仅移动指针
}
// 耗时: 5.83ms ✅
// **快 484 倍！**
```

---

## 🚀 性能 (简版)

- **快 10-40%** 比常见 JS 实现在热路径中
  - Array.sort() O(n log n) → TreeSet O(log n) 插入
  - 重复 Array.shift() O(n) → Queue O(1)
  - 手动索引跟踪 → RB-Tree 自动平衡

- **针对 V8 JIT 优化** (Node.js 18+、现代浏览器)

- **Tree-shakable** ESM / CJS / 旧版构建

📊 [完整基准测试 →](./docs/PERFORMANCE_CN.md)

---

## ✨ 主要特性

### 🏠 统一的 API

不需要学习新 API。在任何地方都使用 `push`、`pop`、`map`、`filter` 和 `reduce`。

```javascript
// 所有线性结构使用相同的 4 个方法
const deque = new Deque([1, 2, 3]);
const queue = new Queue([1, 2, 3]);
const doublyLinkeList = new DoublyLinkedList([1, 2, 3]);
const singlyLinkedList = new SinglyLinkedList([1, 2, 3]);

// 它们都支持：
structure.push(item);          // 添加到末尾
structure.pop();               // 移除末尾
structure.shift();             // 移除开头
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

随处可用。使用扩展运算符 `[...]`、for...of 循环它、立即转换它。

```javascript
// 所有数据结构都支持迭代器协议
const tree = new RedBlackTree([5, 2, 8]);
const sorted = [...tree];              // 扩展运算符
for (const item of tree) {
}           // for...of 循环
const set = new Set(tree);             // Set 构造器
```

---

## 📥 安装

```bash
pnpm add data-structure-typed
```

```bash
npm i data-structure-typed --save
```

```bash
yarn add data-structure-typed
```

### 单个包

仅使用你需要的：

```bash
pnpm add heap-typed deque-typed red-black-tree-typed
```

---

## 💡 我应该何时考虑使用本库？

✅ **当你需要：**

- 前 K 个查询 / 排行榜而无需重复排序
- 同时实现插入顺序和查询性能
- 带有快速位置访问的优先级队列
- 支持范围查询的时间序列数据
- RedBlackTree / Heap 性能而无需学习新 API

✅ **当你的代码有：**

- 在热路径中使用 `array.sort()`（请求处理程序、循环）
- 插入后的手动索引跟踪
- 在大列表上使用 `Array.shift()`（队列）
- 在文件中重复的自定义排序逻辑
- 需要排序的 Map

---

## 🚀 快速开始：30 秒

### 排行榜（排名集合）

```typescript
import { RedBlackTree } from 'data-structure-typed';

const leaderboard = new RedBlackTree([
  [100, 'Alice'],
  [85, 'Bob'],
  [92, 'Charlie']
]);

// 获取排序的分数（自动维护！）
for (const [score, player] of leaderboard) {
  console.log(`${player}: ${score}`);
}
// 输出：
// Alice: 100
// Charlie: 92
// Bob: 85

// 更新分数
leaderboard.delete(85);
leaderboard.set(95, 'Bob');  // O(log n)

// 查询前几名玩家
const topPlayers = [...leaderboard.values()].reverse().slice(0, 3);
```

### 任务队列（调度）

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

const taskQueue = new MaxPriorityQueue<{priority: number; task: string}>([], {
  comparator: (a, b) => b.priority - a.priority
});

taskQueue.add({ priority: 5, task: 'Email' });
taskQueue.add({ priority: 9, task: 'Alert' });  // 即时优先级处理

const nextTask = taskQueue.poll();  // { priority: 9, task: 'Alert' }
```

### 快速队列 (FIFO)

```typescript
import { Deque } from 'data-structure-typed';

const queue = new Deque([1, 2, 3, 4, 5]);
queue.shift();  // 从前面移除: O(1) 而不是 O(n)
queue.push(6);  // 添加到后面: O(1)
```

---

## 📊 可用的数据结构

| 结构           | 用途                              | 时间复杂度                 |
|----------------|----------------------------------|:------------------------:|
| **Array**      | 基础顺序存储                      | O(1) 访问，O(n) 插入      |
| **LinkedList** | 链式存储                          | O(n) 访问，O(1) 插入      |
| **Stack**      | LIFO (后进先出)                   | O(1) 推入/弹出            |
| **Queue**      | FIFO (先进先出)                   | O(1) 入队/出队            |
| **Deque**      | 双端队列                          | O(1) 两端操作             |
| **Heap**       | 优先级访问                        | O(1) 查看，O(log n) 修改   |
| **BST**        | 排序范围查询                      | O(log n) 平衡时           |
| **RedBlackTree** | 自平衡树                        | O(log n) 保证             |
| **AVL Tree**   | 严格平衡树                        | O(log n) 保证             |
| **Trie**       | 前缀搜索                          | O(m) m 是字符串长度      |
| **Graph**      | 网络结构                          | 取决于实现                |

---

## 🎮 Playground

🏃🏻‍♀️ 立即尝试：

- [Node.js TypeScript](https://stackblitz.com/edit/stackblitz-starters-e1vdy3zw?file=src%2Findex.ts)
- [Node.js JavaScript](https://stackblitz.com/edit/stackblitz-starters-oczhrfzn?file=src%2Findex.js)
- [React TypeScript](https://stackblitz.com/edit/vitejs-vite-7bva1zhd?file=src%2FApp.tsx)
- [NestJS](https://stackblitz.com/edit/nestjs-typescript-starter-q9n7okgc?file=src%2Fproduct%2Fservices%2Fproduct-price-index.service.ts)

### 第 4 步：了解更多

👉 查看 [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md) 了解核心概念  
👉 查看 [GUIDES_CN.md](./docs/GUIDES_CN.md) 了解生产示例  
👉 阅读 [REFERENCE_CN.md](./docs/REFERENCE_CN.md) 了解完整 API

---

## 📊 对比图表

```
需要频繁头尾操作？
  → Deque (O(1) shift/unshift/push/pop)

需要排序 + 快速查找？
  → RedBlackTree (O(log n) 保证)

需要最高/最低优先级？
  → Heap/PriorityQueue (O(log n) 添加/删除)

需要前缀/文本匹配？
  → Trie (O(m+k) 其中 m=前缀)

需要图论操作？
  → DirectedGraph/UndirectedGraph

否则？
  → 使用 Array（最简单的情况）
```

---

## 🤝 贡献

找到 bug？有建议？[提出 issue](https://github.com/zrwusa/data-structure-typed/issues)

---

## 📄 许可

MIT

---

## 📚 完整文档结构

```
README.md (本文件)
docs/
├── CONCEPTS_CN.md (理论与基础)
├── REFERENCE_CN.md (API 文档)
├── ARCHITECTURE_CN.md (设计原则)
├── ARCHITECTURE_CN.md (设计细节)
├── PERFORMANCE_CN.md (基准测试)
├── PERFORMANCE_CN.md (详细基准)
├── GUIDES_CN.md (实战示例)
├── INTEGRATIONS_CN.md (框架指南)
└── INTEGRATIONS_CN.md (完整集成)
```

---

## 🎓 了解更多

**刚开始？** → [快速开始](#-快速开始30-秒)

**需要概念？** → [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md)

**想构建？** → [GUIDES_CN.md](./docs/GUIDES_CN.md)

**需要 API？** → [REFERENCE_CN.md](./docs/REFERENCE_CN.md)

**好奇性能？** → [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md)

**框架问题？** → [INTEGRATIONS_CN.md](./docs/INTEGRATIONS_CN.md)

**深入设计？** → [ARCHITECTURE_CN.md](./docs/ARCHITECTURE_CN.md)

---

**准备好加速你的 TypeScript 数据结构了吗？[现在开始 →](#-快速开始30-秒)**
