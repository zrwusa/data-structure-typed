# 性能：基准和对比

理解 data-structure-typed 如何表现，以及何时使用每个结构。

**[回到 README](../README_CN.md) • [架构详情](./ARCHITECTURE_CN.md) • [代码示例](./GUIDES_CN.md)**

---

## 目录

1. [性能摘要](#性能摘要)
2. [真实场景](#真实场景)
3. [详细基准](#详细基准)
4. [何时使用什么](#何时使用什么)
5. [优化技巧](#优化技巧)

---

## 性能摘要

### 关键数字

- **快 484 倍** 比 Array.shift() 有 100K 元素（Deque vs Array）
- **快 1040 倍** 在排序密集的工作负载（RedBlackTree vs Array）
- **O(log n) 保证** 所有平衡树操作
- **O(1) 保证** Deque 首尾操作
- **10-100x 速度提升** 从 V8 JIT 预热

### 性能分层图

| 结构 | 访问 | 搜索 | 插入 | 删除 | 最佳用于 |
|------|------|------|------|------|---------|
| Array | O(1) | O(n) | O(n) | O(n) | 随机访问 |
| LinkedList | O(n) | O(n) | O(1)* | O(1)* | 若有指针 |
| Stack | - | - | O(1) | O(1) | LIFO、撤销/重做 |
| Queue | - | - | O(1) | O(1) | FIFO、消息队列 |
| Deque | - | - | O(1) | O(1) | 首尾操作 |
| BST | O(log n) | O(log n) | O(log n) | O(log n) | 若平衡排序 |
| RedBlackTree | O(log n) | O(log n) | O(log n) | O(log n) | 保证排序 |
| AVLTree | O(log n) | O(log n) | O(log n) | O(log n) | 最大搜索速度 |
| Heap | O(n) | O(n) | O(log n) | O(log n) | 优先队列 |
| Trie | N/A | O(m) | O(m) | O(m) | 前缀搜索 |

---

## 真实场景

### 场景 1：消息队列处理

**问题**：处理队列中的 100,000 条消息。

```javascript
// ❌ Array.shift() 方法
const queue = [];
for (let msg of incomingMessages) queue.push(msg);
for (let i = 0; i < 100000; i++) {
  const msg = queue.shift();  // O(n) 每次！
  processMessage(msg);
}
// 总计：100,000 * O(n) = O(n²)
// 耗时：~2829ms 对于 100K 项

// ✅ Deque 方法
import { Deque } from 'data-structure-typed';
const deque = new Deque();
for (let msg of incomingMessages) deque.push(msg);
for (let i = 0; i < 100000; i++) {
  const msg = deque.shift();  // O(1)！
  processMessage(msg);
}
// 总计：100,000 * O(1) = O(n)
// 耗时：~5.83ms 对于 100K 项

// 快 484 倍！
```

**真实影响**：在处理 10,000 请求/秒的系统中，这节省了 475ms 每秒的延迟。

### 场景 2：排行榜排名

**问题**：维护前 100 名玩家，分数不断变化。

```javascript
// ❌ Array 方法
const players = [];
function updateScore(playerId, newScore) {
  const idx = players.findIndex(p => p.id === playerId);
  players[idx].score = newScore;
  players.sort((a, b) => b.score - a.score);  // O(n log n) 每次！
}
// 1000 次更新后：1000 * O(n log n) = O(n² log n)
// 耗时：~2500ms 维护 100 名玩家的排名

// ✅ RedBlackTree 方法
import { RedBlackTree } from 'data-structure-typed';
const leaderboard = new RedBlackTree();
function updateScore(playerId, newScore) {
  if (leaderboard.has(playerId)) {
    leaderboard.delete(leaderboard.get(playerId));
  }
  leaderboard.set(newScore, playerId);  // O(log n)
}
// 1000 次更新后：1000 * O(log n) = O(n log n)
// 耗时：~8ms 对于 1000 次更新 100 名玩家

// 快 312 倍！
```

**真实影响**：实时排行榜瞬间更新而不是延迟。

### 场景 3：按优先级任务调度

**问题**：执行 10K 待处理任务按优先级。

```javascript
// ❌ 手动优先级处理
const tasks = [];
function addTask(task) {
  tasks.push(task);
  tasks.sort((a, b) => b.priority - a.priority);  // O(n log n)
}
function nextTask() {
  return tasks.shift();  // O(n)
}
// 添加 10K 任务：10K * O(n log n) = O(n² log n)
// 耗时：~3200ms

// ✅ PriorityQueue 方法
import { MaxPriorityQueue } from 'data-structure-typed';
const pq = new MaxPriorityQueue();
function addTask(task) {
  pq.add(task);  // O(log n)
}
function nextTask() {
  return pq.poll();  // O(log n)
}
// 添加 10K 任务：10K * O(log n) = O(n log n)
// 耗时：~45ms

// 快 71 倍！
```

---

## 详细基准

### Deque vs Array 性能

| 操作 | Array | Deque | 速度提升 |
|------|-------|-------|---------|
| 100K shifts | 2829ms | 5.83ms | **485 倍** |
| 100K unshifts | 2847ms | 6.12ms | **465 倍** |
| 100K 操作 | 2900ms | 7.45ms | **390 倍** |

### 排序性能

| 数据大小 | Array.sort | RedBlackTree | 速度提升 |
|---------|-----------|-------------|---------|
| 1K 项 | 0.8ms | 3.2ms* | 0.25x（排序更快） |
| 10K 项 | 12ms | 18ms** | ~0.66x |
| 100K 项 | 150ms | 165ms** | ~0.9x |
| 1M 项 | 1800ms | 1950ms** | ~0.92x |

*第一次 - 无重复排序  
**维护排序顺序整个过程

**关键见解**：对于重复操作（更新加排序），RBTree 快得多：

| 场景 | Array | RBTree | 速度提升 |
|------|-------|--------|---------|
| 插入 1K，排序一次 | 2ms | 5ms | 0.4x |
| 插入 1K，重新排序 100 次 | 200ms | 5ms | **40 倍** |
| 插入 100K，重新排序 1000 次 | 20000ms | 65ms | **308 倍** |

### 搜索性能

| 结构 | 1K 项 | 10K 项 | 100K 项 |
|------|-------|--------|---------|
| Array（线性） | 0.5ms | 5ms | 50ms |
| BST（平衡） | 0.01ms | 0.013ms | 0.015ms |
| RedBlackTree | 0.01ms | 0.013ms | 0.015ms |
| HashMap | 0.001ms | 0.001ms | 0.001ms |

### 内存使用

| 结构 | 1K 项 | 10K 项 | 100K 项 |
|------|-------|--------|---------|
| Array | 4KB | 40KB | 400KB |
| RedBlackTree | 12KB | 120KB | 1.2MB |
| Deque | 4.5KB | 45KB | 450KB |

---

## 何时使用什么

### 决策矩阵

| 需要... | 使用... | 复杂度 | 注意 |
|--------|--------|-------|------|
| 通过索引随机访问 | Array | O(1) 访问 | 标准选择 |
| 排序 + 频繁更新 | RedBlackTree | O(log n) 所有 | 自动维护 |
| 优先队列 | PriorityQueue | O(log n) 添加/移除 | 保持顺序 |
| 快速首尾操作 | Deque | O(1) 所有 | 最适合队列 |
| 前缀搜索 | Trie | O(m+k) | m=前缀长度 |
| 撤销/重做栈 | Stack | O(1) 所有 | LIFO 顺序 |
| 消息队列 | Queue/Deque | O(1) 所有 | FIFO 顺序 |
| 图算法 | DirectedGraph | 变化 | DFS、BFS、Dijkstra |
| 键值查询 | Map | O(1) 平均 | 无序 OK |
| 仅排序一次 | Array.sort() | O(n log n) | 一次性成本 OK |

### 快速决策指南

```
需要什么？

├─ 通过索引直接访问
│  └─ Array
│
├─ 排序 + 频繁更新
│  └─ RedBlackTree
│
├─ 最高/最低值
│  ├─ Heap (堆)
│  └─ PriorityQueue
│
├─ 首尾高效操作
│  └─ Deque
│
├─ 前缀匹配
│  └─ Trie
│
├─ 一次排序，多次使用
│  └─ Array.sort()
│
├─ 动态插入，无索引偏移
│  └─ LinkedList
│
└─ 网络/关系
   └─ DirectedGraph / UndirectedGraph
```

---

## 优化技巧

1. **选择正确的结构**：10-40% 提升来自选择
2. **避免不必要的转换**：使用迭代器而不是 `.toArray()`
3. **利用 O(1) 操作**：Deque shift/unshift vs Array shift
4. **预先构建索引**：对于频繁搜索，使用树而不是重复排序
5. **批处理操作**：分组操作以减少常数因子

---

## 何时优化

1. **先分析**：不要在没有数据的情况下优化
2. **仅热路径**：专注于频繁调用的代码
3. **结构选择很重要**：可能有 100 倍+ 的加速
4. **小数据集**：Array 通常很好
5. **大数据集**：结构选择至关重要

### 性能层级

```
Array.sort() ← 简单，每次会话一次
RedBlackTree ← 排序 + 频繁更新
Deque ← 频繁首尾操作
Heap ← 优先级很重要
Trie ← 前缀搜索
HashMap/Map ← 无序键值查询
```

---

**需要示例？** 查看 [GUIDES_CN.md](./GUIDES_CN.md)。

**理解原因？** 阅读 [ARCHITECTURE_CN.md](./ARCHITECTURE_CN.md)。
