# CONCEPTS: 核心基础与理论

本指南通过通俗易懂的语言和实践理解来解释数据结构背后的基础概念。

**👈 [返回 README](../README_CN.md) • [API 文档](https://data-structure-typed-docs.vercel.app/) • [实战指南](./GUIDES_CN.md)**

---

## 目录

1. [三大核心概念](#三大核心概念)
2. [通俗语言解释](#-通俗语言解释)
3. [迭代器协议设计](#迭代器协议设计)
4. [无缝互操作性](#-无缝互操作性迭代器协议无处不在)
5. [所有数组方法随处可用](#-所有数组方法随处可用)
6. [为什么不直接使用原生 JavaScript?](#为什么不直接使用原生-javascript)
7. [决策指南](#-决策指南选择正确的数据结构)

---

## 三大核心概念

### 1. **Binary Search Tree (BST)** — O(log n) 查找/插入/删除

通过保持所有左子节点小于、右子节点大于每个节点来维护有序性。

```javascript
// 性质:对于任意节点
// 所有左子树的值 < 节点值
// 所有右子树的值 > 节点值

//        5
//       / \
//      3   8
//     / \   \
//    1   4   9
```

**优势**: 无需预排序即可快速操作
**权衡**: 不平衡的树会退化到 O(n)

### 2. **平衡树 (AVL, Red-Black)** — 自动重平衡

在插入/删除后自动重新组织自身,以保持 O(log n) 的性能保证。

```javascript
// Red-Black Tree: 颜色规则确保平衡
// AVL Tree: 高度差 ≤ 1

// 两者: 插入 = O(log n), 删除 = O(log n), 查找 = O(log n) 始终保持
```

**优势**: 保证 O(log n) 性能
**代价**: 每次修改都需要重平衡开销

### 3. **Heap** — 父子优先级关系

完全二叉树,其中父节点始终优先于子节点。

```javascript
// Max Heap:     // Min Heap:
//      9             1
//     / \           / \
//    7   8         2   3
//   / \           / \
//  3   2         8   9

// 父节点 = 1.5倍优于子节点
// 根节点始终具有最佳优先级
```

**优势**: 非常快速地获取最高/最低优先级
**最适合**: 优先队列、堆排序

---

## 🌍 通俗语言解释

对于那些喜欢通过比喻来理解概念的人:

| 数据结构               | 通俗语言定义                                                                                                                                                                                                                                                                                                                                                                                                       | 示例                                       |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| **Linked List**        | 一队兔子,每只兔子都抓着前面兔子的尾巴。你想找一只叫 Pablo 的兔子,必须从第一只兔子开始搜索。如果不是 Pablo,你就继续跟着那只兔子的尾巴找下一只。所以,你可能需要搜索 n 次才能找到 Pablo(O(n) 时间复杂度)。如果你想在 Pablo 和 Vicky 之间插入一只叫 Remi 的兔子,这非常简单。你只需要让 Vicky 松开 Pablo 的尾巴,让 Remi 抓住 Pablo 的尾巴,然后让 Vicky 抓住 Remi 的尾巴(O(1) 时间复杂度)。                                                                         | 要找兔子 "Pablo",从第一只兔子开始,跟着尾巴直到找到 |
| **Array**              | 一排有编号的兔子。如果你想找到名为 Pablo 的兔子,你可以直接喊出 Pablo 的编号 0680(通过数组索引直接找到元素,O(1) 时间复杂度)。但是,如果你不知道 Pablo 的编号,你仍然需要逐个搜索(O(n) 时间复杂度)。而且,如果你想在 Pablo 后面添加一只名为 Vicky 的兔子,你需要对 Vicky 后面的所有兔子重新编号(O(n) 时间复杂度)。                                                                                                                                                                 | 通过索引查找元素是即时的,但在中间插入很慢             |
| **Queue**              | 一排有编号的兔子,第一只兔子身上贴着便利贴。对于第一只兔子身上贴着便利贴的这一排,每当我们想从队伍前面移除一只兔子时,我们只需要将便利贴移到下一只兔子的脸上,而不需要真正移除兔子以避免对后面所有兔子重新编号(从前面移除也是 O(1) 时间复杂度)。对于队伍的尾部,我们不需要担心,因为每次添加到尾部的新兔子都直接获得一个新编号(O(1) 时间复杂度),不需要对之前所有兔子重新编号。                                                                                                                | 以 FIFO 顺序处理项目,从两端高效操作                   |
| **Deque**              | 一排分组的、有编号的兔子,第一只兔子身上贴着便利贴。对于这一排,我们按组管理。每次从队伍前面移除一只兔子时,我们只是将便利贴移到下一只兔子。这样,每次移除一只兔子时,我们不需要对第一只兔子后面的所有兔子重新编号。只有当一个组的所有成员都被移除时,我们才重新分配编号和重新分组。尾部的处理方式类似。这是一种延迟和批处理操作的策略,以抵消 Array 数据结构在中间插入或删除元素时需要移动所有后续元素的缺点。                                                                                       | 从两端高效移除/插入,带有批处理优化                     |
| **Stack**              | 一排兔子在一个死胡同隧道里,兔子只能从隧道入口(末端)移除,新兔子也只能从入口(末端)添加。                                                                                                                                                                                                                                                                                                                            | 以 LIFO 顺序处理项目;撤销/重做功能                     |
| **Binary Tree**        | 每个节点最多有两个子节点的树。                                                                                                                                                                                                                                                                                                                                                                                     | 分层数据组织                                         |
| **Binary Search Tree** | 左子树中所有节点都小于该节点,右子树中所有节点都大于该节点的树。所有操作保持 O(log n)。                                                                                                                                                                                                                                                                                                                             | 无需重新排序即可高效搜索/插入/删除                     |
| **Red-Black Tree**     | 通过颜色编码规则自动保持平衡的自平衡 BST。                                                                                                                                                                                                                                                                                                                                                                         | 用于 Java TreeMap,保持 O(log n) 保证                  |
| **AVL Tree**           | 比 Red-Black 树有更严格平衡要求的更严格的自平衡 BST。                                                                                                                                                                                                                                                                                                                                                              | 最大搜索速度,但插入/删除较慢                           |
| **Heap**               | 存储在数组中的特殊二叉树,其中父节点始终保持与子节点的优先级关系。                                                                                                                                                                                                                                                                                                                                                 | 高效的优先队列;堆排序                                  |
| **Trie**               | 用于基于前缀搜索的字符树。                                                                                                                                                                                                                                                                                                                                                                                         | 自动完成、拼写检查                                     |
| **Graph**              | 由边连接的顶点(节点)网络。                                                                                                                                                                                                                                                                                                                                                                                         | 建模关系、网络                                         |
| **SkipList**           | 带有额外"快车道"的链表——更高的层级跳过许多节点,提供类似平衡 BST 的概率性 O(log n),无需旋转。                                                                                                                                                                                                                                                                                                                      | 有序键值存储;比 Red-Black Tree 简单,平均性能相同        |
| **SegmentTree**        | 二叉树,其中每个节点存储一个范围的聚合(和/最小值/最大值)。查询通过仅组合覆盖目标范围的节点来工作。                                                                                                                                                                                                                                                                                                                 | 带点更新的范围和/最小值/最大值查询;例如日期范围内的利润   |
| **BinaryIndexedTree**  | 紧凑数组,其中每个单元格使用位操作技巧存储部分和。比 SegmentTree 简单得多,但仅支持前缀和。                                                                                                                                                                                                                                                                                                                          | 前缀和、频率计数、逆序对计数                           |
| **Matrix**             | 支持标准线性代数运算的 2D 数字网格。                                                                                                                                                                                                                                                                                                                                                                               | 2D 网格变换、线性代数                                  |

---

## 迭代器协议设计

### 隐藏的超能力

本库中的每一个数据结构都实现了 **迭代器协议**:

- ✅ 展开运算符: `[...tree]`
- ✅ for...of 循环: `for (const item of tree)`
- ✅ 解构: `const [a, b, c] = tree`
- ✅ Array.from(): `Array.from(tree)`
- ✅ Set/Map 构造函数: `new Set(tree)`

### 迭代器支持对比

| 功能                 | Array | Map  | Set | 其他库    | data-structure-typed |
|----------------------|-------|------|-----|-----------|----------------------|
| 展开运算符           | ✅     | ❌/⚠️ | ✅   | ❌/⚠️      | ✅                    |
| for...of 循环        | ✅     | ✅    | ✅   | ❌/⚠️      | ✅                    |
| 解构                 | ✅     | ❌    | ❌   | ❌         | ✅                    |
| Array.from()         | ✅     | ❌/⚠️ | ❌   | ❌/⚠️      | ✅                    |
| Set 构造函数         | ✅     | ❌    | ✅   | ❌         | ✅                    |
| **完全集成**         | ✅     | ⚠️   | ⚠️  | ⚠️        | **✅**                |

### 实例演示: 零摩擦转换

#### 示例 1: 数组到树再到数组

```javascript
const array = [64, 34, 25, 12, 22, 11, 90];
const rbTree = new RedBlackTree(array);
const sorted = [...rbTree.keys()];
console.log(sorted);  // [11, 12, 22, 25, 34, 64, 90] ✅
```

#### 示例 2: 提取键和值

```javascript
const rbTree = new RedBlackTree([
  [1, 'Alice'],
  [2, 'Bob'],
  [3, 'Charlie']
]);

const allKeys = [...rbTree.keys()];      // [1, 2, 3]
const allValues = [...rbTree.values()];  // ['Alice', 'Bob', 'Charlie']
```

#### 示例 3: 在任意结构上使用 for...of

```javascript
const tree = new RedBlackTree(entries);
const deque = new Deque(items);
const heap = new MaxHeap(items);

for (const entry of tree) console.log(entry);
for (const item of deque) console.log(item);
for (const item of heap) console.log(item);
```

---

## 🔗 无缝互操作性: 迭代器协议无处不在

### 设计哲学

我们没有强制在数据结构之间进行转换,而是让每个结构都使用与 JavaScript 原生可迭代对象相同的语言。这意味着:

- 你可以将任何数据结构传递给 `Array.from()`
- 你可以解构任何数据结构
- 你可以展开任何数据结构
- 你可以使用 `for...of` 循环遍历任何数据结构

这是**零摩擦**,因为你使用相同的思维模型。

---

## 🎁 所有数组方法随处可用

### 最大的开发者喜悦: 数组方法,随处可用

你知道这些方法。你每天都在使用它们。它们适用于**每一个数据结构**:

#### 在树上链式调用

```typescript
const rbTree = new RedBlackTree([
  [1, { name: 'Alice', age: 25 }],
  [2, { name: 'Bob', age: 30 }],
  [3, { name: 'Charlie', age: 28 }],
]);

const result = rbTree
  .filter((value, _key) => (value?.age ?? 0) > 26)
  .map((value, key) => [key, { ...value, id: key }])
  .reduce((sum, value) => sum + (value?.age ?? 0), 0);

console.log(result); // 58 ✅
```

#### 在堆上链式调用

```typescript
const minHeap = new Heap(
  [
    { priority: 5, task: 'Email' },
    { priority: 3, task: 'Chat' },
    { priority: 8, task: 'Alert' },
  ],
  { comparator: (a, b) => a.priority - b.priority }
);

const urgent = minHeap
  .filter((value, _key) => value.priority > 4)
  .map((value, _key) => value.task, {
    comparator: (a, b) => a.localeCompare(b),
  });

urgent.print(); // ['Alert', 'Email'] ✅
```

#### 在双端队列上链式调用

```typescript
const deque = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const stats = {
  even: deque.filter((item) => item % 2 === 0).toArray(),
  squared: deque.map((item) => item * item).toArray(),
  hasLarge: deque.some((item) => item > 8),
  sum: deque.reduce((acc, item) => acc + item, 0),
};
```

### 所有结构支持的方法

| 方法        | BinaryTrees | Heap | Deque | Graph | LinkedList |
|-------------|-------------|------|-------|-------|------------|
| map         | ✅           | ✅    | ✅     | ✅     | ✅          |
| filter      | ✅           | ✅    | ✅     | ✅     | ✅          |
| reduce      | ✅           | ✅    | ✅     | ✅     | ✅          |
| find        | ✅           | ✅    | ✅     | ✅     | ✅          |
| some/every  | ✅           | ✅    | ✅     | ✅     | ✅          |
| keys/values | ✅           | ✅    | ✅     | ✅     | ✅          |
| forEach     | ✅           | ✅    | ✅     | ✅     | ✅          |

---

## 为什么不直接使用原生 JavaScript?

### 案例 1: Map 不维护有序顺序

❌ Map 迭代是插入顺序,而不是键顺序:

```javascript
const map = new Map([[5, 'E'], [2, 'B'], [8, 'H'], [1, 'A']]);
for (const [key, value] of map) {
  console.log(key);  // 5, 2, 8, 1 (插入顺序)
}
```

✅ RedBlackTree 自动维护有序顺序:

```javascript
const tree = new RedBlackTree([[5, 'E'], [2, 'B'], [8, 'H'], [1, 'A']]);
for (const [key, value] of tree) {
  console.log(key);  // 1, 2, 5, 8 (键顺序) ✅
}
```

### 案例 2: Array.shift 太慢

❌ Array.shift 是 O(n):

```javascript
const queue = [];
for (let i = 0; i < 100000; i++) queue.push(i);
for (let i = 0; i < 100000; i++) queue.shift();
// 时间: 2829ms ❌
```

✅ Deque.shift 是 O(1):

```javascript
const deque = new Deque();
for (let i = 0; i < 100000; i++) deque.push(i);
for (let i = 0; i < 100000; i++) deque.shift();
// 时间: 5.83ms ✅
```

### 案例 3: 维护优先级是手动的

❌ 数组需要重新排序 O(n log n):

```javascript
const tasks = [];

function addTask(task) {
  tasks.push(task);
  tasks.sort((a, b) => b.priority - a.priority);
} // O(n² log n)
```

✅ PriorityQueue 维护优先级 O(log n):

```javascript
const pq = new MaxPriorityQueue();

function addTask(task) {
  pq.add(task);  // O(log n)
} // O(n log n)
```

### 案例 4: 范围查询很繁琐

❌ Array.filter 是 O(n):

```javascript
const prices = [10, 45, 23, 67, 89, 12, 54, 33, 78];
const inRange = prices.filter(p => p >= 30 && p <= 70);
```

✅ RedBlackTree 范围查询是 O(log n + k):

```javascript
const tree = new RedBlackTree(prices);
const inRange = tree.rangeSearch([30, 70]);
```

### 案例 5: 前缀匹配很繁琐

❌ Array.filter 是 O(n*m):

```javascript
const words = ['apple', 'app', 'apply', 'application'];
const matches = words.filter(w => w.startsWith('app'));
// 对于 1M 个单词: 检查 1M 个单词 ❌
```

✅ Trie 前缀匹配是 O(m + k):

```javascript
const trie = new Trie(words);
const matches = trie.getWords('appl');
// O(5 + 4) = 9 次操作 ✅
```

### 案例 6: 查找第 K 个元素或排名

❌ 数组需要排序 O(n log n):

```javascript
const scores = [85, 92, 78, 95, 88, 73, 99];
scores.sort((a, b) => b - a);
const thirdPlace = scores[2];  // 每次插入后必须重新排序
```

✅ Order-Statistic Tree 提供 O(log n) 排名查询:

```javascript
const tree = new RedBlackTree(scores.map(s => [s, null]), {
  comparator: (a, b) => b - a,
  enableOrderStatistic: true
});
tree.getByRank(2);     // 第 3 名 — O(log n)
tree.getRank(92);      // 有多少分数更高? — O(log n)
tree.rangeByRank(0, 2); // 前 3 名 — O(log n + k)
// 插入新分数 — O(log n), 无需重新排序
tree.set(91, null);
```

### 案例 7: 传递原始对象而无需预处理

❌ Array.map 只是为了重塑数据:

```javascript
const users = [{ id: 3, name: 'Charlie' }, { id: 1, name: 'Alice' }];
const entries = users.map(u => [u.id, u]);  // 额外步骤
const map = new Map(entries);
```

✅ 使用 `toEntryFn` 直接传递原始对象:

```javascript
const map = new TreeMap(users, {
  toEntryFn: u => [u.id, u]
});
// 不需要 .map() — 自动按 id 排序
```

---

## 🎯 决策指南: 选择正确的数据结构

```
需要频繁的头部/尾部操作?
  ↓
  是 → Deque (O(1) shift/unshift)
  否 → 继续

需要排序 + 快速查询?
  ↓
  是 → RedBlackTree (O(log n) 搜索)
  否 → 继续

需要优先级处理?
  ↓
  是 → PriorityQueue (O(log n) 添加)
  否 → 继续

需要前缀匹配?
  ↓
  是 → Trie (O(m + k) 搜索)
  否 → 继续

需要图算法?
  ↓
  是 → DirectedGraph / UndirectedGraph
  否 → 继续

需要对索引序列进行范围查询?
  ↓
  是 → SegmentTree (O(log n) 查询 + 更新, 支持 sum/min/max/gcd/custom)
    只需要前缀和? → BinaryIndexedTree (更简单, 更少内存)
  否 → 继续

需要第 k 个元素或排名查询?
  ↓
  是 → RedBlackTree / TreeMap / TreeSet 配合 { enableOrderStatistic: true }
    getByRank(k), getRank(key), rangeByRank(start, end) — 全部 O(log n)
  否 → 继续

需要有序键值映射?
  ↓
  是 → TreeMap (通过 Red-Black Tree 保证 O(log n))
    想要更简单的实现,相同的 API? → SkipList (O(log n) 平均, 概率性)
  否 → 使用 Array
```

---

## 下一步

**理解了基础知识?**
→ [查看实战示例](./GUIDES_CN.md)

**想立即使用?**
→ [完整 API 文档](https://data-structure-typed-docs.vercel.app/)

**对性能好奇?**
→ [阅读性能对比](./PERFORMANCE_CN.md)

**想了解如何实现的?**
→ [查看架构细节](./ARCHITECTURE_CN.md)

---

**相关文档:**

- [OVERVIEW_CN.md](./OVERVIEW_CN.md) - API / 结构 / 方法
- [GUIDES_CN.md](./GUIDES_CN.md) - 排行榜 / LRU / 队列 / 实战示例
- [ARCHITECTURE_CN.md](./ARCHITECTURE_CN.md) - 设计 / JIT / 内部抽象
- [PERFORMANCE_CN.md](./PERFORMANCE_CN.md) - 基准测试 / 对比
- [INTEGRATIONS_CN.md](./INTEGRATIONS_CN.md) - React / Nest / Express
