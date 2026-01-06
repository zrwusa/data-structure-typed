# README：data-structure-typed 库

一个包含生产级实现的完整 TypeScript 数据结构库。

**📚 [快速开始](#-快速开始30秒) • [完整文档](./docs/CONCEPTS_CN.md) • [API 参考](./docs/REFERENCE_CN.md) • [示例](./docs/GUIDES_CN.md)**

---

## 目录

1. [谁应该使用这个库？](#-谁应该使用这个库)
2. [为什么不直接用 Array 或 Map？](#-为什么不直接用-array-或-map)
3. [关键特性](#-关键特性)
4. [安装](#-安装)
5. [快速开始](#-快速开始30秒)
6. [可用的数据结构](#-可用的数据结构)
7. [文档](#-文档)

---

## 🎯 谁应该使用这个库？

**如果您在 TypeScript 中构建排序集合、调度队列或排序数据结构，**  
**可以考虑使用 `data-structure-typed` 而不是手工编写的 Array 或 Map。**

### 完美应用场景：

- **排行榜和排名系统** — 无需反复排序就能高效维护前 K 个元素
- **任务调度系统** — 优先队列、有序执行、基于时间的操作
- **实时仪表板** — Grafana 风格的工作负载和即时查询
- **时间序列数据** — 有序插入 + 快速范围查询
- **搜索和自动完成** — 大规模前缀匹配
- **图论问题** — 路径查找、环检测、拓扑排序

---

## ⚡ 为什么不直接用 Array 或 Map？

| 使用场景 | Array | Map | data-structure-typed |
|---------|-------|-----|:---:|
| **排序查询** | ❌ O(n) | ❌ 无序 | ✅ **O(log n)** |
| **指定位置插入** | ❌ O(n) shift | ❌ 无位置概念 | ✅ **O(log n)** |
| **排行榜前 K** | ❌ 重新排序 O(n log n) | ❌ 需手动排序 | ✅ **即时** |
| **从前面移除** | ❌ O(n) | ❌ 无出队操作 | ✅ **O(1)** |
| **前缀搜索** | ❌ O(n*m) | ❌ 不适用 | ✅ **O(m + k)** |
| **熟悉的 API** | ✅ 是 | ✅ 是 | ✅ **相同** |

### 真实场景的痛点

```javascript
// ❌ 不使用 data-structure-typed
const queue = [1, 2, 3, ..., 100000];
for (let i = 0; i < 100000; i++) {
  queue.shift();  // O(n) - 重新索引每个元素！
}
// 耗时：2829ms ❌

// ✅ 使用 data-structure-typed (Deque)
const deque = new Deque([1, 2, 3, ..., 100000]);
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1) - 只是移动指针
}
// 耗时：5.83ms ✅
// **快 484 倍！**
```

---

## 🚀 性能（简版）

- **热路径性能提升 10-40%**
  - Array.sort() O(n log n) → TreeSet O(log n) 插入
  - 重复 Array.shift() O(n) → Queue O(1)
  - 手动索引追踪 → RB-Tree 自动平衡

- **针对 V8 JIT 优化**（Node.js 18+，现代浏览器）

- **可树摇动的** ESM / CJS / 传统版本

📊 [完整基准测试 →](./docs/PERFORMANCE_CN.md)

---

## ✨ 关键特性

### 🏠 统一的 API

不需要学习新 API。只需在任何地方使用 `push`、`pop`、`map`、`filter` 和 `reduce`。

```javascript
// 所有线性结构使用相同的 4 个方法
const deque = new Deque([1, 2, 3]);
const queue = new Queue([1, 2, 3]);
const stack = new Stack([1, 2, 3]);

// 它们都支持：
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
const value = tree.get(1);  // 类型：string | undefined
```

### ✨ 零摩擦

到处都能用。展开它 `[...]`、循环它 `for..of`、立即转换它。

```javascript
// 所有数据结构都支持迭代器协议
const tree = new RedBlackTree([5, 2, 8]);
const sorted = [...tree];              // 展开操作符
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

### 独立包

只使用需要的部分：

```bash
pnpm add heap-typed deque-typed red-black-tree-typed
```

---

## 💡 何时考虑使用这个库？

✅ **当您需要：**

- 无需重复排序就能进行前 K 元素查询
- 同时具有插入顺序和查询性能
- 具有快速位置访问的优先队列
- 具有范围查询的时间序列数据
- Red-Black Tree / Heap 性能而无需学习新 API

✅ **当您的代码中有：**

- `array.sort()` 在热路径中（请求处理程序、循环）
- 插入后的手动索引追踪
- 大列表上的 `Array.shift()`（队列）
- 跨文件重复的自定义排序逻辑
- 需要有序的 Map

---

## 🚀 快速开始：30 秒

### 排行榜（排序集合）

```typescript
import { RedBlackTree } from 'data-structure-typed';

const leaderboard = new RedBlackTree([
  [100, 'Alice'],
  [85, 'Bob'],
  [92, 'Charlie']
]);

// 获取排序分数（自动维护！）
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

// 查询前玩家
const topPlayers = [...leaderboard.values()].reverse().slice(0, 3);
```

### 任务队列（调度）

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

const taskQueue = new MaxPriorityQueue([], {
  comparator: (a, b) => b.priority - a.priority
});

taskQueue.add({ priority: 5, task: 'Email' });
taskQueue.add({ priority: 9, task: 'Alert' });  // 即时优先级处理

const nextTask = taskQueue.poll();  // { priority: 9, task: 'Alert' }
```

### 快速队列（FIFO）

```typescript
import { Deque } from 'data-structure-typed';

const queue = new Deque([1, 2, 3, 4, 5]);
queue.shift();  // 从前面移除：O(1) 不是 O(n)
queue.push(6);  // 添加到后面：O(1)
```

---

## 📊 可用的数据结构

| 结构 | 使用场景 | 时间复杂度 | NPM |
|------|---------|----------|-----|
| **RedBlackTree** | 排序集合、范围查询 | O(log n) | [npm](https://www.npmjs.com/package/red-black-tree-typed) |
| **Heap / PriorityQueue** | 任务调度、前 K 元素 | O(log n) | [npm](https://www.npmjs.com/package/heap-typed) |
| **Deque** | 快速首尾操作 | O(1) | [npm](https://www.npmjs.com/package/deque-typed) |
| **Trie** | 自动完成、前缀搜索 | O(m+k) | [npm](https://www.npmjs.com/package/trie-typed) |
| **DirectedGraph** | 路径查找、DAG 算法 | O(V+E) | [npm](https://www.npmjs.com/package/directed-graph-typed) |
| **Stack** | 撤销/重做、表达式解析 | O(1) | [npm](https://www.npmjs.com/package/stack-typed) |
| **LinkedList** | 动态大小、无索引偏移 | O(1)* | [npm](https://www.npmjs.com/package/linked-list-typed) |
| **AVLTree** | 比 RB-Tree 更严格的平衡 | O(log n) | [npm](https://www.npmjs.com/package/avl-tree-typed) |

👉 [查看所有 20+ 结构 →](./docs/REFERENCE_CN.md)

---

## 📖 文档

### 不同使用场景

| 您的目标 | 从这里开始 | 后续步骤 |
|---------|----------|---------|
| **学习概念** | [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md) | [GUIDES_CN.md](./docs/GUIDES_CN.md) |
| **在项目中使用** | [GUIDES_CN.md](./docs/GUIDES_CN.md) | [REFERENCE_CN.md](./docs/REFERENCE_CN.md) |
| **查询 API** | [REFERENCE_CN.md](./docs/REFERENCE_CN.md) | [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md) |
| **性能问题** | [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md) | [ARCHITECTURE_CN.md](./ARCHITECTURE_CN.md) |
| **框架集成** | [INTEGRATIONS_CN.md](./docs/INTEGRATIONS_CN.md) | [GUIDES_CN.md](./docs/GUIDES_CN.md) |
| **理解设计** | [ARCHITECTURE_CN.md](./ARCHITECTURE_CN.md) | [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md) |

### 文档文件

1. **[CONCEPTS_CN.md](./docs/CONCEPTS_CN.md)** - 核心基础和理论
  - 三大核心概念（BST、平衡树、堆）
  - 13 个易于理解的解释
  - 迭代器协议设计
  - 5 个与原生 JavaScript 的对比
  - 完整的决策指南

2. **[REFERENCE_CN.md](./docs/REFERENCE_CN.md)** - 完整 API 和数据结构
  - 快速参考表
  - 所有 20+ 结构及示例
  - CRUD 操作
  - 常见方法
  - TypeScript 支持

3. **[ARCHITECTURE_CN.md](./ARCHITECTURE_CN.md)** - 设计和实现
  - 设计理念和原则
  - 3 个解决的痛点
  - 为什么 Deque 快 484 倍
  - 迭代器协议设计
  - 自平衡策略
  - V8 JIT 优化

4. **[PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md)** - 基准和对比
  - 性能摘要
  - 3 个真实场景
  - 详细基准
  - 何时使用什么
  - 优化技巧

5. **[GUIDES_CN.md](./docs/GUIDES_CN.md)** - 真实示例
  - 4 个设计模式
  - 5 个生产代码示例
  - 常见错误
  - 最佳实践

6. **[INTEGRATIONS_CN.md](./docs/INTEGRATIONS_CN.md)** - 框架集成
  - React 集成（状态管理、排行榜）
  - Express 集成（LRU 缓存、速率限制）
  - Nest.js 集成（排名服务、任务队列）
  - TypeScript 配置

---

## 💻 真实示例

### LRU 缓存

```typescript
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private order = new DoublyLinkedList<K>();

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;
    // 移动到末尾（最近使用）
    // 使用 O(1) 操作高效处理
    return this.cache.get(key)!;
  }
}
```

### 排行榜

```typescript
class Leaderboard {
  private scores = new RedBlackTree<number, Player>(
    (a, b) => b - a  // 降序
  );

  getTopN(n: number): Player[] {
    return [...this.scores.values()].slice(0, n);
  }
}
```

### 消息队列

```typescript
class MessageQueue {
  private urgent = new Deque<Message>();
  private normal = new Deque<Message>();

  dequeue(): Message | null {
    return this.urgent.shift() || this.normal.shift();
  }
}
```

👉 [更多示例请见 GUIDES_CN.md](./docs/GUIDES_CN.md)

---

## 🎯 按行业的使用场景

### 📊 金融

- 价格排序的订单簿
- 实时投资组合排名
- 期权链排序

### 🎮 游戏

- 玩家排行榜
- 敌人优先级队列
- 游戏事件调度

### 📱 社交媒体

- 趋势帖子（前 K）
- 信息流排序
- 通知调度

### 🏥 医疗保健

- 患者优先级队列
- 约诊调度
- 医疗记录组织

### 🛒 电子商务

- 产品价格范围
- 库存管理
- 订单调度

---

## ✨ 开发者为什么喜欢这个库

| 痛点 | 解决方案 |
|-----|---------|
| 重复排序拖累代码速度 | TreeSet 自动维护顺序 |
| 循环中 Array.shift 超时 | Deque O(1) shift 而不是 O(n) |
| 学习不同的 API | 所有结构使用 push/pop/shift/unshift |
| 类型安全噩梦 | 完整的 TypeScript 泛型支持 |
| 浏览器兼容性问题 | 在任何地方工作：Node、浏览器、CDN |

---

## 📦 您将获得什么

✅ **6 个核心文档文件**（2500+ 行）  
✅ **20+ 个数据结构**（生产级）  
✅ **50+ 个代码示例**（真实模式）  
✅ **完整 TypeScript 支持**（严格类型）  
✅ **性能基准**（484 倍加速）  
✅ **框架集成**（React、Express、Nest.js）

---

## 🚀 开始使用

### 步骤 1：安装

```bash
npm i data-structure-typed
```

### 步骤 2：导入

```typescript
import { RedBlackTree, Deque, MaxPriorityQueue } from 'data-structure-typed';
```

### 步骤 3：使用

```typescript
const tree = new RedBlackTree([5, 2, 8]);
console.log([...tree]);  // [2, 5, 8] - 自动排序！
```

### 步骤 4：了解更多

👉 查看 [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md) 了解核心概念  
👉 查看 [GUIDES_CN.md](./docs/GUIDES_CN.md) 获取生产示例  
👉 阅读 [REFERENCE_CN.md](./docs/REFERENCE_CN.md) 获取完整 API

---

## 📊 对比表

```
需要频繁的头尾操作？
  → Deque (O(1) shift/unshift/push/pop)

需要排序 + 快速查询？
  → RedBlackTree (O(log n) 保证)

需要最高/最低优先级？
  → Heap/PriorityQueue (O(log n) add/remove)

需要前缀/文本匹配？
  → Trie (O(m+k) 其中 m=前缀)

需要图操作？
  → DirectedGraph/UndirectedGraph

否则？
  → 使用 Array（最简单的情况）
```

---

## 🤝 贡献

发现 bug？有建议？[开启 issue](https://github.com/zrwusa/data-structure-typed/issues)

---

## 📄 许可证

MIT

---

## 📚 完整文档结构

```
docs/
├── README_CN.md (本文件)
├── CONCEPTS_CN.md (理论和基础)
├── REFERENCE_CN.md (API 文档)
├── ARCHITECTURE_CN.md (设计原则)
├── PERFORMANCE_CN.md (基准测试)
├── GUIDES_CN.md (真实示例)
└── INTEGRATIONS_CN.md (框架指南)
```

---

## 🎓 了解更多

**刚入门？** → [快速开始](#-快速开始30秒)

**需要概念？** → [CONCEPTS_CN.md](./docs/CONCEPTS_CN.md)

**想要构建？** → [GUIDES_CN.md](./docs/GUIDES_CN.md)

**需要 API？** → [REFERENCE_CN.md](./docs/REFERENCE_CN.md)

**好奇性能？** → [PERFORMANCE_CN.md](./docs/PERFORMANCE_CN.md)

**框架问题？** → [INTEGRATIONS_CN.md](./docs/INTEGRATIONS_CN.md)

---

**准备好提升您的 TypeScript 数据结构了吗？[现在开始 →](#-快速开始30秒)**
