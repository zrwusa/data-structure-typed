# PERFORMANCE: 基准测试与对比

理解 data-structure-typed 的性能，以及何时使用每个结构。

**[返回 README](../README_CN.md) • [架构细节](./ARCHITECTURE_CN.md) • [代码示例](./GUIDES_CN.md)**

---

## 目录

1. [性能摘要](#性能摘要)
2. [真实场景](#真实场景)
3. [详细基准测试](#详细基准测试)
4. [何时使用什么](#何时使用什么)
5. [优化建议](#优化建议)

---

## 性能摘要

> **关于 JS vs C++ 的差距说明：** 许多“C++ 更快”的结果主要来自 **运行时与内存模型差异**，并不一定意味着 `data-structure-typed` 的实现有问题。
> JavaScript 运行在带 GC 的 VM 上（数值装箱、动态派发、缓存/内存布局特性不同），而 C++ 可以使用紧凑的值类型与更可预测的内存布局。
> 因此当基准测试同时包含 Native JS / js-sdsl / C++ 时，跨语言对比更适合作为 **方向性参考**；实际选型更应优先参考 **JS 环境内**的对比结果。

### 关键数据

- **约 485 倍更快**（Deque.shift vs Array.shift，100K 元素）
- **快 40–308 倍** 在“频繁更新 + 每次都需要保持排序”的场景（RedBlackTree vs Array.sort 反复重排）
- **O(log n) 保证** 所有平衡树操作
- **O(1) 保证** Deque 头尾操作
- 基准测试包含预热（warm-up）以降低 V8 JIT 噪声

### 性能层级图表

| 结构           | 访问       | 搜索       | 插入       | 删除       |        最适合 |
|--------------|----------|----------|----------|----------|-----------:|
| Array        | O(1)     | O(n)     | O(n)     | O(n)     |       随机访问 |
| LinkedList   | O(n)     | O(n)     | O(1)*    | O(1)*    |      如果有指针 |
| Stack        | -        | -        | O(1)     | O(1)     | LIFO、撤销/重做 |
| Queue        | -        | -        | O(1)     | O(1)     |  FIFO、消息队列 |
| Deque        | -        | -        | O(1)     | O(1)     |       头尾操作 |
| BST          | O(log n) | O(log n) | O(log n) | O(log n) |      平衡时排序 |
| RedBlackTree | O(log n) | O(log n) | O(log n) | O(log n) |       保证排序 |
| AVL Tree     | O(log n) | O(log n) | O(log n) | O(log n) |     最大搜索速度 |
| Heap         | O(n)     | O(n)     | O(log n) | O(log n) |      优先级队列 |
| Trie         | N/A      | O(m)     | O(m)     | O(m)     |       前缀搜索 |

---

## 真实场景

### 场景 1: 100K 元素的消息队列

| 方法                   | 时间           | 备注             |
|----------------------|--------------|----------------|
| Array.shift() 100K 次 | **2829ms** ❌ | O(n²) - 每次重新索引 |
| Deque.shift() 100K 次 | **5.83ms** ✅ | O(n) - 批处理操作   |
| **加速**               | **约 485 倍**   | 关键差异           |

### 场景 2: 1000 次排行榜更新

| 方法              | 时间           | 备注                |
|-----------------|--------------|-------------------|
| Array.sort() 每次 | **2500ms** ❌ | 1000 * O(n log n) |
| RedBlackTree    | **8ms** ✅    | 1000 * O(log n)   |
| **加速**          | **约 312 倍**   | 实时排行榜             |

### 场景 3: 10K 任务优先级处理

| 方法               | 时间           | 备注          |
|------------------|--------------|-------------|
| 手动优先级            | **3200ms** ❌ | O(n² log n) |
| MaxPriorityQueue | **45ms** ✅   | O(n log n)  |
| **加速**           | **约 71 倍**    | 任务调度        |

---

## 详细基准测试

[//]: # (No deletion!!! Start of Replace Section)

### DoublyLinkedList

| Test Case               | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-------------------------|----------|----------|----------|-----------|
| 100k push               | 7.369    | 5.4982   | 20.9662  | ±6.89%    |
| 100k unshift            | 5.8415   | 5.1723   | 15.1315  | ±6.27%    |
| 100k unshift & shift    | 4.6431   | 4.5501   | 5.1957   | ±0.3%     |
| 100k addAt(mid)         | 1798.43  | 1436.92  | 2014.92  | ±16.39%   |
| 100k addBefore (cursor) | 6.8262   | 5.8569   | 15.616   | ±6.05%    |

#### DoublyLinkedList (side-by-side)

> Comparison table. The main table above is DoublyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case               | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-------------------------|---------:|-------------:|------------:|---------:|
| 100k push               |    7.369 |            - |      2.1403 |    11.72 |
| 100k unshift            |   5.8415 |            - |     1049.35 |    11.89 |
| 100k unshift & shift    |   4.6431 |            - |     2281.28 |     11.7 |
| 100k addAt(mid)         |  1798.43 |            - |           - |  1572.27 |
| 100k addBefore (cursor) |   6.8262 |            - |           - |    13.18 |

### SinglyLinkedList

| Test Case              | Avg (ms) | Min (ms) | Max (ms) | Stability |
|------------------------|----------|----------|----------|-----------|
| 100k push & shift      | 4.2467   | 4.1818   | 4.6569   | ±0.29%    |
| 10K push & pop         | 194.2    | 126.46   | 266.67   | ±16.11%   |
| 10K addAt(mid)         | 19.52    | 11.01    | 37.18    | ±5.99%    |
| 10K addBefore (cursor) | 36.41    | 21.81    | 45.4     | ±4.04%    |

#### SinglyLinkedList (side-by-side)

> Comparison table. The main table above is SinglyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case              | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|------------------------|---------:|-------------:|------------:|---------:|
| 100k push & shift      |   4.2467 |            - |     1256.33 |    10.38 |
| 10K push & pop         |    194.2 |            - |      0.1183 |     1.04 |
| 10K addAt(mid)         |    19.52 |            - |           - |    12.85 |
| 10K addBefore (cursor) |    36.41 |            - |           - |     1.15 |

### HashMap

| Test Case           | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------------|----------|----------|----------|-----------|
| 1M set              | 96.18    | 44.88    | 399.84   | ±34.89%   |
| 1M set & get        | 81.6     | 54.42    | 221.19   | ±12.06%   |
| 1M ObjKey set & get | 361.41   | 316.96   | 473.75   | ±7.89%    |

#### HashMap (side-by-side)

> Comparison table. The main table above is HashMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case           | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------------|---------:|-------------:|------------:|---------:|
| 1M set              |    96.18 |       162.37 |       229.3 |   148.21 |
| 1M set & get        |     81.6 |        81.71 |      267.89 |   138.74 |
| 1M ObjKey set & get |   361.41 |       755.57 |      328.89 |   161.89 |

### priority-queue

| Test Case       | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------------|----------|----------|----------|-----------|
| 100K add        | 8.347    | 7.644    | 9.0238   | ±1.11%    |
| 100K add & poll | 48.62    | 46.44    | 51.95    | ±1.08%    |

#### priority-queue (side-by-side)

> Comparison table. The main table above is priority-queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case       | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-----------------|---------:|-------------:|------------:|---------:|
| 100K add        |    8.347 |       8.2598 |           - |     2.22 |
| 100K add & poll |    48.62 |        49.34 |           - |      9.3 |

### Queue

| Test Case         | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-------------------|----------|----------|----------|-----------|
| 1M push           | 49.78    | 34.06    | 107.18   | ±6.82%    |
| 100K push & shift | 5.4918   | 3.1594   | 6.5451   | ±4.89%    |

#### Queue (side-by-side)

> Comparison table. The main table above is Queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case         | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-------------------|---------:|-------------:|------------:|---------:|
| 1M push           |    49.78 |            - |           - |     3.65 |
| 100K push & shift |   5.4918 |            - |     2004.25 |     0.43 |

### Deque

| Test Case            | Avg (ms) | Min (ms) | Max (ms) | Stability |
|----------------------|----------|----------|----------|-----------|
| 1M push              | 22.45    | 19.49    | 114.8    | ±14.25%   |
| 1M push & pop        | 21.49    | 10.13    | 44.2     | ±11.5%    |
| 1M push & shift      | 25.69    | 20.13    | 79.06    | ±9.92%    |
| 100K push & shift    | 2.6632   | 2.1757   | 7.7072   | ±6.68%    |
| 100K unshift & shift | 2.1253   | 1.1158   | 5.1542   | ±8.46%    |

#### Deque (side-by-side)

> Comparison table. The main table above is Deque only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case            | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|----------------------|---------:|-------------:|------------:|---------:|
| 1M push              |    22.45 |            - |           - |     3.56 |
| 1M push & pop        |    21.49 |            - |           - |     4.84 |
| 1M push & shift      |    25.69 |            - |           - |     4.27 |
| 100K push & shift    |   2.6632 |            - |     2329.68 |     0.43 |
| 100K unshift & shift |   2.1253 |            - |     3306.43 |     0.42 |

### Stack

| Test Case     | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------|----------|----------|----------|-----------|
| 1M push       | 43.11    | 25.98    | 153.59   | ±14.75%   |
| 1M push & pop | 53.56    | 49.71    | 83.82    | ±2.73%    |

#### Stack (side-by-side)

> Comparison table. The main table above is Stack only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case     | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------|---------:|-------------:|------------:|---------:|
| 1M push       |    43.11 |        31.18 |        41.6 |     3.61 |
| 1M push & pop |    53.56 |        60.78 |       45.78 |     4.89 |

### RedBlackTree

| Test Case             | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------------------|----------|----------|----------|-----------|
| 1M get                | 109.93   | 86.9     | 126.86   | ±23.23%   |
| 200K rangeSearch SEQ  | 2358.36  | 1375.3   | 2711.02  | ±29.23%   |
| 200K rangeSearch RAND | 3131.76  | 2962.49  | 3226.67  | ±3.96%    |
| 1M upd SEQ            | 124.58   | 62.59    | 164.96   | ±42.77%   |
| 1M upd RAND           | 154.21   | 150.09   | 162.35   | ±4.26%    |
| 1M ins SEQ            | 733.23   | 520.12   | 1172.9   | ±43.00%   |
| 1M ins RAND           | 2248.37  | 2224.28  | 2260.15  | ±0.79%    |
| 1M keys-only          | 4.0599   | 1.9194   | 6.03     | ±52.37%   |

#### RedBlackTree (side-by-side)

> Comparison table. The main table above is RedBlackTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case             | DST (ms) | Node Mode (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-----------------------|---------:|---------------:|-------------:|------------:|---------:|
| 1M get                |   109.93 |         515.52 |       260.01 |           - |    81.95 |
| 200K rangeSearch SEQ  |  2358.36 |              - |            - |           - |        - |
| 200K rangeSearch RAND |  3131.76 |              - |            - |           - |        - |
| 1M upd SEQ            |   124.58 |         402.68 |       336.11 |           - |   161.97 |
| 1M upd RAND           |   154.21 |         720.27 |       633.42 |           - |   372.08 |
| 1M ins SEQ            |   733.23 |         355.83 |        142.3 |           - |   252.95 |
| 1M ins RAND           |  2248.37 |        1627.56 |      1225.17 |           - |      729 |
| 1M keys-only          |   4.0599 |              - |            - |           - |     0.22 |

### AVLTree

| Test Case                         | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------------------------------|----------|----------|----------|-----------|
| 100K add randomly                 | 216.28   | 126.4    | 341.03   | ±14.11%   |
| 100K add                          | 215.77   | 205.52   | 219.17   | ±0.76%    |
| 100K get                          | 1.331    | 1.2568   | 1.6459   | ±1.88%    |
| 100K getNode                      | 68.19    | 64.6     | 70.77    | ±0.4%     |
| 100K iterator                     | 11.57    | 8.25     | 12.13    | ±1.1%     |
| 100K add & delete orderly         | 279.1    | 154.37   | 331.92   | ±14.79%   |
| 100K add & delete randomly        | 374.2    | 300.46   | 391.62   | ±4.46%    |
| AVL Tree 100K rangeSearch queries | 2419.2   | 1672.99  | 2616.42  | ±21.42%   |

#### AVLTree (side-by-side)

> Comparison table. The main table above is AVLTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                         | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-----------------------------------|---------:|-------------:|------------:|---------:|
| 100K add randomly                 |   216.28 |            - |           - |     38.2 |
| 100K add                          |   215.77 |            - |           - |    34.34 |
| 100K get                          |    1.331 |            - |           - |    16.61 |
| 100K getNode                      |    68.19 |            - |           - |    19.58 |
| 100K iterator                     |    11.57 |            - |           - |     2.71 |
| 100K add & delete orderly         |    279.1 |            - |           - |    46.19 |
| 100K add & delete randomly        |    374.2 |            - |           - |    64.22 |
| AVL Tree 100K rangeSearch queries |   2419.2 |            - |           - |   261.55 |

### BST

| Test Case                 | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------------------|----------|----------|----------|-----------|
| 10K add randomly          | 9.3217   | 8.4887   | 11.0732  | ±0.91%    |
| 10K add & delete randomly | 18.19    | 15.83    | 20.4     | ±0.77%    |
| 10K addMany               | 18.79    | 16.77    | 19.1     | ±0.44%    |
| 10K get                   | 19.17    | 10.39    | 33.56    | ±4.13%    |

#### BST (side-by-side)

> Comparison table. The main table above is BST only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                 | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------------------|---------:|-------------:|------------:|---------:|
| 10K add randomly          |   9.3217 |            - |           - |        - |
| 10K add & delete randomly |    18.19 |            - |           - |        - |
| 10K addMany               |    18.79 |            - |           - |        - |
| 10K get                   |    19.17 |            - |           - |        - |

### Trie

| Test Case     | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------|----------|----------|----------|-----------|
| 100K add      | 40.46    | 22.37    | 53.08    | ±8.93%    |
| 100K getWords | 217.66   | 128.8    | 240.19   | ±6.1%     |

#### Trie (side-by-side)

> Comparison table. The main table above is Trie only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case     | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------|---------:|-------------:|------------:|---------:|
| 100K add      |    40.46 |            - |           - |        - |
| 100K getWords |   217.66 |            - |           - |        - |

### DirectedGraph

| Test Case       | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------------|----------|----------|----------|-----------|
| 1K addVertex    | 0.0968   | 0.0825   | 0.0993   | ±0.59%    |
| 1K addEdge      | 6.088    | 5.38     | 6.5587   | ±0.58%    |
| 1K getVertex    | 0.0769   | 0.0423   | 0.0903   | ±4.64%    |
| 1K getEdge      | 21.93    | 16.5     | 58.25    | ±7.42%    |
| tarjan          | 203.86   | 197.17   | 209.57   | ±0.66%    |
| topologicalSort | 161.57   | 151.79   | 196.79   | ±2.87%    |

#### DirectedGraph (side-by-side)

> Comparison table. The main table above is DirectedGraph only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case       | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-----------------|---------:|-------------:|------------:|---------:|
| 1K addVertex    |   0.0968 |            - |           - |        - |
| 1K addEdge      |    6.088 |            - |           - |        - |
| 1K getVertex    |   0.0769 |            - |           - |        - |
| 1K getEdge      |    21.93 |            - |           - |        - |
| tarjan          |   203.86 |            - |           - |        - |
| topologicalSort |   161.57 |            - |           - |        - |

### BinaryTree

| Test Case                | Avg (ms) | Min (ms) | Max (ms) | Stability |
|--------------------------|----------|----------|----------|-----------|
| 1K add randomly          | 37.74    | 34.94    | 50.93    | ±1.53%    |
| 1K add & delete randomly | 51.81    | 31.71    | 53.74    | ±2.14%    |
| 1K addMany               | 30.83    | 17.73    | 48.65    | ±8.86%    |
| 1K get                   | 37.96    | 35.49    | 49.23    | ±1.62%    |
| 1K has                   | 61.61    | 53.7     | 63.33    | ±0.87%    |
| 1K dfs                   | 317.7    | 316.03   | 319.37   | ±0.2%     |
| 1K bfs                   | 94.89    | 65.73    | 168.44   | ±10.79%   |
| 1K morris                | 93.69    | 64.2     | 125.72   | ±9.44%    |

#### BinaryTree (side-by-side)

> Comparison table. The main table above is BinaryTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|--------------------------|---------:|-------------:|------------:|---------:|
| 1K add randomly          |    37.74 |            - |           - |        - |
| 1K add & delete randomly |    51.81 |            - |           - |        - |
| 1K addMany               |    30.83 |            - |           - |        - |
| 1K get                   |    37.96 |            - |           - |        - |
| 1K has                   |    61.61 |            - |           - |        - |
| 1K dfs                   |    317.7 |            - |           - |        - |
| 1K bfs                   |    94.89 |            - |           - |        - |
| 1K morris                |    93.69 |            - |           - |        - |

[//]: # (No deletion!!! End of Replace Section)

---

## 何时使用什么

### 快速决策表

| 需求      | 推荐使用            | 复杂度            |
|---------|-----------------|----------------|
| 随机访问索引  | Array           | O(1) 访问        |
| 频繁头尾操作  | Deque           | O(1) 两端        |
| FIFO 队列 | Queue           | O(1) 两端        |
| LIFO 栈  | Stack           | O(1) 推入/弹出     |
| 排序集合    | RedBlackTree    | O(log n) 保证    |
| 优先级队列   | MaxHeap/MinHeap | O(log n) 添加/删除 |
| 前缀搜索    | Trie            | O(m) m=字符串长度   |
| 图论问题    | Graph           | 取决于实现          |

---

## 优化建议

### 建议 1: 选择正确的数据结构

```typescript
// ❌ 不好：为每个用例使用 Array
const sorted = array.sort();          // O(n log n) 每次
const found = array.find(x => x > 5); // O(n) 每次

// ✅ 好：为每个用例使用适当的结构
const tree = new RedBlackTree(array);
const found = tree.rangeSearch([5, Infinity]); // O(log n + k)
```

### 建议 2: 批量操作

```typescript
// ❌ 不好：单独操作
for (const item of items) {
  tree.set(item.id, item);  // 1000 * O(log n)
}

// ✅ 好：批量初始化
const tree = new RedBlackTree(items);  // O(n) 初始化
```

### 建议 3: 缓存范围查询

```typescript
// ❌ 不好：每次都查询
function getExpensive() {
  return tree.rangeSearch([0, 100], x => x.price);
}

// ✅ 好：缓存结果
class CachedQuery {
  private cache: null | any[] = null;
  private lastUpdate = 0;

  getExpensive() {
    const now = Date.now();
    if (!this.cache || now - this.lastUpdate > 5000) {
      this.cache = tree.rangeSearch([0, 100], x => x.price);
      this.lastUpdate = now;
    }
    return this.cache;
  }

  invalidate() {
    this.cache = null;
  }
}
```

### 建议 4: 避免不必要的转换

```typescript
// ❌ 不好：转换回数组
const result = tree.toArray()
  .filter(x => x > 5)
  .map(x => x * 2);

// ✅ 好：保持在树上
const result = tree
  .filter(x => x > 5)
  .map(x => x * 2);
```

---

## 性能调优清单

- ✅ 重复排序使用 RedBlackTree
- ✅ 队列使用 Deque（而不是 Array.shift）
- ✅ 前 K 个使用 Heap
- ✅ 前缀搜索使用 Trie
- ✅ 避免热路径中的 O(n) 操作
- ✅ 批量初始化结构
- ✅ 缓存范围查询结果
- ✅ 保持在树上而不是转换为数组

---

**需要实现指导？** 查看 [GUIDES_CN.md](./GUIDES_CN.md) 了解代码示例。

**想了解架构？** 查看 [ARCHITECTURE_CN.md](./ARCHITECTURE_CN.md) 了解设计决策。
