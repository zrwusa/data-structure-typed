# 概览:数据结构一览

[English](./OVERVIEW.md) | 简体中文

所有数据结构、常用操作和使用模式的快速参考指南。完整的 API 详细信息(包括方法签名和示例)请查看 **[完整 API 文档](https://data-structure-typed-docs.vercel.app/)**。

**[返回 README](../README_CN.md) • [API 文档](https://data-structure-typed-docs.vercel.app/) • [实战示例](./GUIDES_CN.md) • [性能测试](./PERFORMANCE_CN.md)**

---

## 目录

1. [快速参考表](#快速参考表)
2. [全部数据结构](#全部数据结构)
3. [CRUD 操作](#crud-操作)
4. [通用方法](#通用方法)
5. [TypeScript 支持](#typescript-支持)

---

## 快速参考表

| 数据结构    | 最佳使用场景             | 时间复杂度          | 空间  |
|-------------------|---------------------------|--------------------------|--------|
| **Array**         | 直接索引访问     | O(n) 插入/删除       | O(n)   |
| **Linked List**   | 动态大小,快速插入 | O(n) 搜索, O(1) 插入 | O(n)   |
| **Stack**         | 撤销/重做, DFS            | O(1) 全部                 | O(n)   |
| **Queue**         | FIFO 处理           | O(1) 全部                 | O(n)   |
| **Deque**         | 头尾操作      | O(1) 全部                 | O(n)   |
| **Binary Tree**   | 层次化数据         | O(n) 平均                 | O(n)   |
| **BST**           | 有序搜索             | O(log n) 平均             | O(n)   |
| **RedBlackTree**  | 保证有序         | O(log n) 保证      | O(n)   |
| **AVL Tree**      | 平衡有序           | O(log n) 保证      | O(n)   |
| **Heap**          | 优先队列            | O(log n) 添加/删除      | O(n)   |
| **PriorityQueue** | 任务调度           | O(log n) 添加/取出        | O(n)   |
| **Trie**              | 前缀搜索                         | O(m+k) 搜索                | O(26n)     |
| **Graph**             | 网络,路径                       | 不定                       | O(V+E)     |
| **SkipList**          | 有序键值对(概率型)             | O(log n) 平均所有操作         | O(n log n) |
| **SegmentTree**       | 区间查询(求和/最小/最大/自定义)    | O(log n) 查询/更新        | O(n)       |
| **BinaryIndexedTree** | 前缀和,频次统计       | O(log n) 查询/更新        | O(n)       |
| **Matrix**            | 二维网格运算                    | O(n²) 加法, O(n³) 乘法    | O(n²)      |

---

## 全部数据结构

### 栈结构

#### Stack

```typescript
import { Stack } from 'data-structure-typed';

const stack = new Stack<number>([1, 2]);
stack.push(3);                // add to top
const top = stack.pop();      // Remove from top - O(1)
const peek = stack.peek();    // View top
stack.print();                // [1, 2]
```



### 线性结构

#### Queue

```typescript
import { Queue } from 'data-structure-typed';

const queue = new Queue<number>([1, 2]);
queue.push(3);                   // add to back
const first = queue.shift();     // Remove from front - O(1)
const length = queue.length;     // Current length
queue.print();                   // [2, 3]
```

#### Deque

```typescript
import { Deque } from 'data-structure-typed';

const deque = new Deque<number>([1, 2]);
deque.push(3);               // Add to back
deque.unshift(0);            // Add to front
deque.pop();                 // Remove from back - O(1)
deque.shift();               // Remove from front - O(1)
deque.print();               // [1, 2]
```

#### Linked Lists

```typescript
import { SinglyLinkedList, DoublyLinkedList } from 'data-structure-typed';

const singly = new SinglyLinkedList<number>([1, 2]);
const doubly = new DoublyLinkedList<number>([1, 2]);

singly.push(3);              // Add to end
singly.addAt(1, 99);         // Insert at index - O(n)
singly.deleteAt(2);          // Delete at index - O(n)
singly.print();              // [1, 99, 3]

doubly.push(3);              // Add to end
doubly.addAt(1, 99);         // Insert at index - O(n)
doubly.deleteAt(2);          // Delete at index - O(n)
doubly.print();              // [1, 99, 3]
```

### 树结构

#### Binary Search Tree (BST)

```typescript
import { BST } from 'data-structure-typed';

const bst = new BST<number>([1, 3, 5, 8, 6, 2, 4, 7]);
bst.add(9);                   // Add elements
bst.has(5);                  // Check existence - O(log n) avg
bst.delete(1);               // Remove - O(log n) avg
bst.print();                 // Visual representation
//      ___4___
//     /       \
//    2_       _6_
//      \     /   \
//       3    5    7_
//                   \
//                    8_
//                      \
//                      9
```

#### Red-Black Tree

```typescript
import { RedBlackTree } from 'data-structure-typed';

const rbTree = new RedBlackTree<number, string>([[1, 'Alice'], [2, 'Bob'], [3, 'Chris']]);
rbTree.set(4, 'Dan');               // Add key-value
rbTree.get(1);                      // 'Alice'
rbTree.delete(2);                   // Remove - O(log n) guaranteed
console.log([...rbTree.values()]);  // ['Alice', 'Chris', 'Dan'] Automatically sorted
rbTree.print()
//   _3_
//  /   \
//  1    4

```

#### AVL Tree

```typescript
import {AVLTree} from 'data-structure-typed';

const avl = new AVLTree<number>([5, 4, 3, 8, 1]);
avl.add(9);
avl.isAVLBalanced();         // Check balance
avl.delete(3);               // Auto-rebalances
avl.print()
//    ___5_
//   /     \
//   1_     8_
//     \      \
//      4      9
```

#### TreeMap (有序映射)

```typescript
import { TreeMap } from 'data-structure-typed';

const tm = new TreeMap<number, string>([[3, 'c'], [1, 'a'], [2, 'b']]);
tm.set(4, 'd');                    // Set key-value - O(log n)
tm.get(2);                         // 'b' - O(log n)
tm.has(3);                         // true
tm.delete(1);                      // Remove - O(log n)

// 导航方法 — Java NavigableMap 风格
tm.first();                        // [2, 'b'] — 最小条目
tm.last();                         // [4, 'd'] — 最大条目
tm.ceiling(3);                     // [3, 'c'] — 最小的 >= 3
tm.floor(2);                       // [2, 'b'] — 最大的 <= 2
tm.higher(2);                      // [3, 'c'] — 严格 > 2
tm.lower(3);                       // [2, 'b'] — 严格 < 3

// 迭代(有序)
console.log([...tm.keys()]);       // [2, 3, 4]
console.log([...tm.values()]);     // ['b', 'c', 'd']

// 批量操作
tm.setMany([[5, 'e'], [6, 'f']]);  // Set multiple at once

// 函数式
const filtered = tm.filter((v, k) => k > 2);
const mapped = tm.map((v, k) => [k * 10, v!.toUpperCase()] as [number, string]);
```

#### TreeSet (有序集合)

```typescript
import { TreeSet } from 'data-structure-typed';

const ts = new TreeSet<number>([5, 3, 8, 1]);
ts.add(4);                         // Add - O(log n)
ts.has(3);                         // true
ts.delete(5);                      // Remove - O(log n)

// 导航
ts.first();                        // 1
ts.last();                         // 8
ts.ceiling(4);                     // 4 — 最小的 >= 4
ts.floor(6);                       // 4 — 最大的 <= 6
ts.higher(3);                      // 4 — 严格 > 3
ts.lower(4);                       // 3 — 严格 < 4

// 迭代(有序)
console.log([...ts.keys()]);       // [1, 3, 4, 8]

// 批量操作
ts.addMany([10, 20, 30]);          // Add multiple at once
```

#### Order-Statistic Tree (排名查询)

在任何基于树的结构上启用 `enableOrderStatistic: true` 以获得 O(log n) 的排名操作:

```typescript
import { RedBlackTree, TreeMap, TreeSet } from 'data-structure-typed';

// 适用于 RedBlackTree, TreeMap, TreeSet, TreeMultiMap, TreeMultiSet
const tree = new RedBlackTree<number, string>(
  [[100, 'Alice'], [85, 'Bob'], [92, 'Charlie'], [78, 'Diana']],
  { comparator: (a, b) => b - a, enableOrderStatistic: true }
);

// getByRank(k) — 树序中位置 k 的元素, O(log n)
tree.getByRank(0);                 // 100 (树序中第 1 个)
tree.getByRank(2);                 // 92  (树序中第 3 个)

// getRank(key) — 树序中 key 之前元素的数量, O(log n)
tree.getRank(92);                  // 2

// rangeByRank(start, end) — 两个位置之间的元素, O(log n + k)
tree.rangeByRank(0, 2);           // [100, 92, 85] — 位置 0..2

// 包装类也同样适用
const tm = new TreeMap<number, string>([], { enableOrderStatistic: true });
tm.set(10, 'a'); tm.set(20, 'b'); tm.set(30, 'c');
tm.getByRank(1);                   // [20, 'b']
tm.getRank(20);                    // 1

const ts = new TreeSet<number>([], { enableOrderStatistic: true });
ts.addMany([10, 20, 30]);
ts.getByRank(0);                   // 10
ts.getRank(30);                    // 2
```

### Heap 与 Priority Queue

#### Heap

```typescript
import { MinHeap, MaxHeap } from 'data-structure-typed';

const minHeap = new MinHeap<number>([5, 3, 8]);
minHeap.add(1);               // Add element - O(log n)
const min = minHeap.poll();   // Get minimum - O(log n)
const peek = minHeap.peek();  // View minimum - O(1)
```

#### Priority Queue

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

const pq = new MaxPriorityQueue<Task>([], {
  comparator: (a, b) => b.priority - a.priority
});
pq.add({ id: 1, priority: 5 });  // Add - O(log n)
const task = pq.poll();          // Remove highest - O(log n)
const size = pq.size;            // Current size
```

### 特殊结构

#### Trie (前缀树)

```typescript
import { Trie } from 'data-structure-typed';

const trie = new Trie(['apple', 'app', 'banana']);
trie.add('apply');
trie.getWords('app');        // ['apple', 'apply', 'app'] - O(m+k)
trie.has('apple');           // true
trie.hasPrefix('ap');        // true
```

#### Graph

```typescript
import { DirectedGraph, UndirectedGraph } from 'data-structure-typed';

const graph = new DirectedGraph<string>();
graph.addVertex('A');
graph.addVertex('B');
graph.addEdge('A', 'B', 1);  // Add edge with weight
graph.hasEdge('A', 'B');     // true
const {
  distMap, distPaths, preMap, seen, paths, minDist, minPath
} = graph.dijkstra('A', 'B', true, true)!;
const order = graph.topologicalSort();
console.log(distMap)
console.log(distPaths)
console.log(preMap)
console.log(seen)
console.log(paths)
console.log(minDist)
console.log(minPath)  // Shortest path
console.log(order)    // DAG order
```

---

## CRUD 操作

### Create (添加)

```typescript
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');
tree.setMany([[2, 'Bob'], [3, 'Charlie']]);

// Heap
const heap = new MaxHeap<number>([10, 20]);
heap.add(15);

// Trie
const trie = new Trie(['hello']);
trie.add('world');

// Graph
const graph = new DirectedGraph<string>();
graph.addVertex('A');
graph.addEdge('A', 'B', 1);
```

### Read (查询)

```typescript
// Tree
tree.get(1);               // 'Alice'
tree.has(1);               // true
tree.size;                 // Number of elements

// Heap
heap.peek();               // Highest priority element
heap.size;                 // Current size

// Trie
trie.has('hello');            // true
trie.hasPrefix('hel');    // true

// Graph
graph.hasVertex('A');      // true
graph.hasEdge('A', 'B');   // true
graph.getNeighbors('A');   // Connected vertices
```

### Update (修改)

```typescript
// Tree
tree.set(1, 'Alice Updated'); // Update value
tree.delete(1);               // Remove

// Heap
heap.pop();                    // Remove highest

// Graph
graph.deleteEdge('A', 'B');   // Remove edge
graph.deleteVertex('A');      // Remove vertex
```

### Delete

```typescript
// 所有结构都支持:
structure.clear();             // Remove all elements
structure.delete(key);         // Remove specific

// 条件删除 (BST 系列和 Deque)
tree.deleteWhere(node => node.key < 10);           // Delete all matching
tree.deleteWhere(node => node.key < 10, true);     // Delete first match only
tree.deleteWhere(new Range(5, 15));                 // Delete by range
deque.deleteWhere((val, idx) => val > 100);        // Deque predicate delete
```

---

## 通用方法

### 所有结构可用

```typescript
// 迭代
structure.forEach((value, key) => {
});
for (const item of structure) {
}

// 转换
[...structure];                // Spread
Array.from(structure);         // Array conversion

// 数组方法
structure.map((v, k) => v * 2);
structure.filter((v, k) => v > 5);
structure.reduce((acc, v) => acc + v, 0);
structure.find((v, k) => v === 5);
structure.some((v, k) => v > 10);
structure.every((v, k) => v > 0);

// 属性
structure.size;                // Element count
structure.isEmpty();           // Check empty
```

### 原始数据映射

直接传入原始对象 — 无需预先 `.map()` 处理:

```typescript
// toElementFn — 提取字段,仅存储该字段 (Heap, Queue, Stack, LinkedList, Trie)
const heap = new MinHeap<number, User>(users, {
  toElementFn: u => u.age
});

// toEntryFn — 拆分为键值对 (TreeMap, HashMap, SkipList)
const map = new TreeMap<number, User, User>(users, {
  toEntryFn: u => [u.id, u]
});

// comparator — 存储完整对象,按字段排序 (所有有序结构)
const set = new TreeSet<User>(users, {
  comparator: (a, b) => a.id - b.id
});
```

### 结构特定方法

#### Trees

```typescript
tree.height;                   // Tree height (getter)
tree.isAVLBalanced();         // Balance check
tree.getNode(key);            // Get node object
tree.getHeight(key);          // Node height
tree.getLeftMost();           // Leftmost node
tree.getRightMost();          // Rightmost node
```

#### Deque

```typescript
deque.first;                  // View front (getter)
deque.last;                   // View back (getter)
deque.shift();                // Remove front - O(1)
deque.pop();                  // Remove back - O(1)
```

#### Graph

```typescript
graph.topologicalSort();      // DAG order
graph.dijkstra(start, end);   // Shortest path
graph.dfs(vertex);            // Depth-first traversal
graph.bfs(vertex);            // Breadth-first traversal
```

---

## TypeScript 支持

### 完整泛型支持

```typescript
// 自定义类型安全
const tree = new RedBlackTree<number, User>();
tree.set(1, { name: 'Alice', age: 30 });

const value = tree.get(1);  // Type: User | undefined

// 自动推断
const numbers = new Deque<number>([1, 2]);
numbers.push(3);

// 自定义比较器
const descending = new RedBlackTree<number, string>([], {
    comparator: (a, b) => b - a  // Sort descending
  });
```

### 类型安全示例

```typescript
interface Task {
  id: string;
  priority: number;
  action: Promise<void>;
}

const pq = new MaxPriorityQueue<Task>(
  {
    comparator: (a, b) => a.priority - b.priority
  }
);

pq.add({
  id: '1', priority: 5, action: async () => {
  }
});

// 类型检查捕获错误
const task = pq.poll();
if (task) {
  // task 保证是 Task 类型
  await task.action;
}
```

---

## 复杂度图表

| 操作 | Array | LinkedList | BST      | RBTree   | Heap     | Trie |
|-----------|-------|------------|----------|----------|----------|------|
| 访问    | O(1)  | O(n)       | O(log n) | O(log n) | O(n)     | N/A  |
| 搜索    | O(n)  | O(n)       | O(log n) | O(log n) | O(n)     | O(m) |
| 插入    | O(n)  | O(1)       | O(log n) | O(log n) | O(log n) | O(m) |
| 删除    | O(n)  | O(1)       | O(log n) | O(log n) | O(log n) | O(m) |

---

## 常见模式

### 迭代器模式

```typescript
const tree = new RedBlackTree([5, 2, 8]);

// 到处都适用
const arr = [...tree.keys()];           // Spread
const set = new Set(tree.keys());       // Set constructor
for (const val of tree.values()) {
}      // for...of
const [first, ...rest] = tree.keys();   // Destructuring
```

### 过滤模式

```typescript
const tree = new RedBlackTree([
  [1, { active: true }],
  [2, { active: false }],
  [3, { active: true }]
]);

const inactive = tree
  .filter((val) => val?.active ?? false)
  .map((val, key) => [key, !val]);

console.log(...inactive);
```

### 排序模式

```typescript
const data = [64, 34, 25, 12, 22, 11, 90];
const sorted = [...new RedBlackTree(data).keys()]; // Instant sort!
```

---

## SkipList

概率型有序容器。可与 `TreeMap`/`TreeSet` 互换使用。

```typescript
import { SkipList } from 'data-structure-typed';

// 与 TreeMap API 相同 — 可直接替换
const sl = new SkipList<number, string>([[3, 'c'], [1, 'a'], [2, 'b']]);
sl.set(4, 'd');                    // upsert — returns this (chainable)
sl.get(2);                         // 'b'
sl.has(5);                         // false
sl.delete(1);                      // true

// 导航
sl.first();                        // [2, 'b']
sl.last();                         // [4, 'd']
sl.ceiling(2);                     // [2, 'b'] — 最小的 >= 2
sl.floor(3);                       // [3, 'c'] — 最大的 <= 3
sl.higher(2);                      // [3, 'c'] — 严格 > 2
sl.lower(3);                       // [2, 'b'] — 严格 < 3
sl.rangeSearch([2, 4]);            // [[2,'b'],[3,'c'],[4,'d']]
sl.pollFirst();                    // [2, 'b'] — remove+return first

// 迭代(有序)
for (const [k, v] of sl) console.log(k, v);
[...sl.keys()];   // [3, 4]
[...sl.values()]; // ['c', 'd']

// 函数式
sl.filter((v, k) => k > 2).toArray();   // [[3,'c'],[4,'d']]
sl.map((v, k) => [k * 10, v]);          // new SkipList
sl.reduce((acc, v) => acc + v!, '');    // 'cd'

// 自定义比较器
const reversed = new SkipList<number, string>([], {
  comparator: (a, b) => b - a
});

// 通过 toEntryFn 从对象创建
type User = { id: number; name: string };
const users = new SkipList<number, User, User>(data, {
  toEntryFn: u => [u.id, u]
});
```

---

## SegmentTree

支持任意结合性合并操作的区间查询。

```typescript
import { SegmentTree } from 'data-structure-typed';

// 便捷工厂方法(涵盖 90% 用例)
const sumTree = SegmentTree.sum([1, 3, 5, 7, 9]);
const minTree = SegmentTree.min([5, 2, 8, 1, 9]);
const maxTree = SegmentTree.max([5, 2, 8, 1, 9]);

// 区间查询 O(log n)
sumTree.query(1, 3);   // 15 (3+5+7)
minTree.query(0, 4);   // 1
maxTree.query(0, 2);   // 8

// 单点更新 O(log n)
sumTree.update(2, 10); // replaces 5 with 10
sumTree.query(1, 3);   // 20 (3+10+7)

// 单元素访问 O(1)
sumTree.get(2);        // 10

// 自定义合并 (gcd, product, etc.)
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const gcdTree = new SegmentTree([12, 8, 6, 18], { merger: gcd, identity: 0 });
gcdTree.query(0, 3);   // 2

// 树上二分查找 (ACL 风格)
// maxRight(l, pred): 找到最大的 r 使得 pred(query(l, r)) 为真
sumTree.maxRight(0, s => s <= 10);  // rightmost index where prefix ≤ 10

// 标准接口
[...sumTree];          // leaf values as array
sumTree.toArray();     // same
sumTree.size;          // 5
sumTree.clone();       // independent copy
```

---

## BinaryIndexedTree (Fenwick Tree)

O(log n) 的前缀和与单点更新。比 SegmentTree 更轻量;仅需求和时使用。

```typescript
import { BinaryIndexedTree } from 'data-structure-typed';

// 从大小或数组构造
const bit = new BinaryIndexedTree(6);
const bit2 = new BinaryIndexedTree([1, 3, 5, 7, 9, 11]);

// 单点更新: 添加增量
bit2.update(2, 4);    // index 2 += 4 → value becomes 9

// 单点设置: 绝对值
bit2.set(0, 100);     // index 0 = 100

// 单点查询
bit2.get(2);          // 9

// 前缀和 [0..i]
bit2.query(3);        // sum of [0..3]

// 区间和 [start..end]
bit2.queryRange(1, 3); // sum of [1..3]

// 二分查找 — 要求非负值
bit2.lowerBound(10);  // smallest i where prefix sum [0..i] >= 10
bit2.upperBound(10);  // smallest i where prefix sum [0..i] > 10

// 标准接口
[...bit2];            // point values as array
bit2.toArray();       // same
bit2.size;            // 6
bit2.clone();
bit2.clear();
```

---

## Matrix

二维网格运算。正确、精简 — 不与 NumPy 竞争。

```typescript
import { Matrix } from 'data-structure-typed';

// 构造
const m = new Matrix([[1, 2, 3], [4, 5, 6]]);
Matrix.zeros(3, 4);       // 3×4 zero matrix
Matrix.identity(3);       // 3×3 identity matrix
Matrix.from([[1, 2], [3, 4]]); // from plain array

// 元素访问
m.get(0, 1);              // 2
m.set(0, 1, 99);          // returns boolean
m.size;                   // [2, 3]
m.rows;                   // 2
m.cols;                   // 3

// 算术运算 (返回新 Matrix)
a.add(b);
a.subtract(b);
a.multiply(b);            // matrix multiplication
a.dot(b);                 // dot product
a.transpose();            // supports rectangular matrices
a.inverse();              // square matrices only

// 标准接口
[...m];                   // array of rows (copies)
m.toArray();              // deep copy as number[][]
m.flatten();              // [1,2,3,4,5,6] row-major
m.forEach((v, r, c) => ...);
m.map(v => v * 2);        // new Matrix
m.clone();                // independent copy
m.isEmpty();              // true if 0 rows or 0 cols
```

---

**需要更多细节?** 查看 [GUIDES_CN.md](./GUIDES_CN.md) 获取实战示例。

**好奇性能表现?** 参阅 [PERFORMANCE_CN.md](./PERFORMANCE_CN.md) 查看基准测试。
