# 性能:基准测试与对比

了解 data-structure-typed 的性能表现,以及何时使用每种数据结构。

**[返回 README](../README_CN.md) • [架构细节](./ARCHITECTURE_CN.md) • [代码示例](./GUIDES_CN.md) • [📈 交互式 HTML 报告](./benchmark.html)**

---

## 目录

1. [性能概述](#性能概述)
2. [真实场景](#真实场景)
3. [详细基准测试](#详细基准测试)
4. [何时使用什么](#何时使用什么)
5. [优化建议](#优化建议)

---

## 性能概述

> **关于 JS 与 C++ 差距的说明:** 许多"C++ 更快"的结果主要由**运行时/内存模型差异**解释,而非 `data-structure-typed` 的缺陷。
> JavaScript 运行在带 GC 的 VM 上,使用装箱数字、动态分发,且缓存/内存行为不同,而 C++ 可以使用紧凑的值类型和可预测的内存布局。
> 当基准测试混合了基线容器(Native JS / js-sdsl / C++)时,将跨语言比较视为**方向性的**,在实际决策时主要依赖**JS 内部**的比较。

### 关键数据

- 对于 10 万个元素,比 Array.shift() **快 484 倍**(Deque vs Array)
- 在重复"更新 + 重新排序"工作负载中**快 40x–308x**(RedBlackTree vs Array)
- 所有平衡树操作**保证 O(log n)**
- Deque 头尾操作**保证 O(1)**
- 基准测试包含预热运行以减少 V8 JIT 噪音

### 性能层级图

| 数据结构     | 访问     | 搜索     | 插入     | 删除     | 最适合               |
|--------------|----------|----------|----------|----------|----------------------|
| Array        | O(1)     | O(n)     | O(n)     | O(n)     | 随机访问             |
| LinkedList   | O(n)     | O(n)     | O(1)*    | O(1)*    | 有指针时             |
| Stack        | -        | -        | O(1)     | O(1)     | LIFO,撤销/重做       |
| Queue        | -        | -        | O(1)     | O(1)     | FIFO,消息队列        |
| Deque        | -        | -        | O(1)     | O(1)     | 头尾操作             |
| BST          | O(log n) | O(log n) | O(log n) | O(log n) | 平衡时有序           |
| RedBlackTree | O(log n) | O(log n) | O(log n) | O(log n) | 保证有序             |
| AVL Tree     | O(log n) | O(log n) | O(log n) | O(log n) | 最大搜索速度         |
| Heap         | O(n)     | O(n)     | O(log n) | O(log n) | 优先队列             |
| Trie         | N/A      | O(m)     | O(m)     | O(m)     | 前缀搜索             |

---

## 基准测试

[//]: # (No deletion!!! Start of Replace Section)

### Queue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 26.93 | 24.41 | 51.97 | ±4.28% |
| 100K push & shift | 3.45 | 2.72 | 15.26 | ±8.97% |

#### Queue (side-by-side)

> 对比表格。上面的主表格仅为 Queue。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 26.93 | 23.83 | 1.70 | 27.59 |
| 100K push & shift | 3.45 | 1152.77 | 0.20 | 2.71 |


### Deque
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 9.77 | 6.27 | 21.63 | ±9.28% |
| 1M push & pop | 14.75 | 11.80 | 31.16 | ±5.06% |
| 1M push & shift | 14.61 | 13.31 | 40.42 | ±5.25% |
| 100K push & shift | 1.29 | 1.19 | 3.37 | ±3.91% |
| 100K unshift & shift | 1.26 | 1.14 | 2.75 | ±3.59% |

#### Deque (side-by-side)

> 对比表格。上面的主表格仅为 Deque。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 9.77 | 26.81 | 1.76 | 7.79 |
| 1M push & pop | 14.75 | 27.96 | 2.20 | 12.34 |
| 1M push & shift | 14.61 | - | 1.94 | - |
| 100K push & shift | 1.29 | 1243.77 | 0.19 | 1.17 |
| 100K unshift & shift | 1.26 | 1867.28 | 0.19 | 1.17 |


### DoublyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100k push | 5.70 | 4.80 | 7.27 | ±1.57% |
| 100k unshift | 5.57 | 4.63 | 13.65 | ±5.7% |
| 100k unshift & shift | 4.04 | 3.87 | 5.34 | ±1.3% |
| 100k addAt(mid) | 1865.99 | 1778.94 | 1992.65 | ±5.43% |
| 100k addBefore (cursor) | 6.81 | 5.32 | 17.77 | ±4.44% |

#### DoublyLinkedList (side-by-side)

> 对比表格。上面的主表格仅为 DoublyLinkedList。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100k push | 5.70 | 2.40 | 5.70 | 1.90 |
| 100k unshift | 5.57 | 884.06 | 5.85 | 1.52 |
| 100k unshift & shift | 4.04 | 2050.71 | 5.74 | 1.89 |
| 100k addAt(mid) | 1865.99 | - | 754.81 | - |
| 100k addBefore (cursor) | 6.81 | - | 6.18 | - |


### SinglyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K unshift & shift | 3.77 | 3.62 | 3.99 | ±0.41% |
| 10K unshift & shift | 0.37 | 0.36 | 0.44 | ±0.78% |
| 10K addAt(mid) | 18.61 | 17.61 | 25.55 | ±1.66% |
| 10K addBefore (cursor) | 17.56 | 16.67 | 20.17 | ±1.11% |

#### SinglyLinkedList (side-by-side)

> 对比表格。上面的主表格仅为 SinglyLinkedList。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K unshift & shift | 3.77 | 1958.39 | 4.80 | - |
| 10K unshift & shift | 0.37 | 6.26 | 0.47 | - |
| 10K addAt(mid) | 18.61 | - | 5.77 | - |
| 10K addBefore (cursor) | 17.56 | - | 0.53 | - |


### PriorityQueue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 4.00 | 3.80 | 4.41 | ±0.6% |
| 100K add & poll | 22.51 | 21.23 | 42.99 | ±3.19% |

#### PriorityQueue (side-by-side)

> 对比表格。上面的主表格仅为 PriorityQueue。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 4.00 | - | 1.05 | 4.96 |
| 100K add & poll | 22.51 | - | 4.53 | 22.97 |


### TreeSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add | 995.72 | 948.08 | 1124.92 | ±6.28% |
| 1M has | 67.80 | 64.53 | 86.26 | ±1.67% |
| 100K rangeSearch | 17.34 | 16.79 | 18.81 | ±0.46% |
| 100K navigable | 118.65 | 117.95 | 119.38 | ±0.14% |

#### TreeSet (side-by-side)

> 对比表格。上面的主表格仅为 TreeSet。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | DST classic (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M add | 995.72 | 807.88 | - | 462.00 | 677.58 |
| 1M has | 67.80 | 747.62 | - | 444.00 | 655.62 |
| 100K rangeSearch | 17.34 | 16.70 | - | - | - |
| 100K navigable | 118.65 | 123.91 | - | - | - |


### TreeMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 978.72 | 934.59 | 1130.02 | ±6.39% |
| 1M get | 127.82 | 123.10 | 133.96 | ±1.2% |
| 100K rangeSearch | 38.17 | 34.80 | 100.14 | ±6.97% |
| 100K navigable | 160.66 | 151.89 | 307.88 | ±9.6% |

#### TreeMap (side-by-side)

> 对比表格。上面的主表格仅为 TreeMap。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | DST classic (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M set | 978.72 | 831.32 | - | 512.00 | 623.23 |
| 1M get | 127.82 | 719.05 | - | 322.00 | 626.87 |
| 100K rangeSearch | 38.17 | 34.42 | - | - | - |
| 100K navigable | 160.66 | 213.76 | - | - | - |


### TreeMultiSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiSet expanded iteration) | 217.73 | 191.17 | 319.78 | ±8.07% |
| 1M has-only (TreeMultiSet) | 67.67 | 66.08 | 72.83 | ±0.72% |
| 1M count-only (TreeMultiSet) | 55.74 | 53.94 | 57.60 | ±0.49% |
| 1M build+has (TreeMultiSet) | 260.84 | 248.30 | 300.22 | ±2.79% |
| 1M build+count (TreeMultiSet) | 267.81 | 242.77 | 339.53 | ±5.97% |
| 100K delete-one (TreeMultiSet) | 217.76 | 201.92 | 254.80 | ±2.97% |
| 100K setCount (TreeMultiSet) | 214.66 | 201.65 | 264.54 | ±3.65% |
| 1M expanded iteration (TreeMultiSet) | 54.41 | 53.14 | 62.22 | ±0.78% |
| 1M entries view (TreeMultiSet) | 15.67 | 14.81 | 17.19 | ±0.72% |
| 1M size property (TreeMultiSet) | 0.00 | 0.00 | 0.00 | ±3.47% |
| 1M distinctSize property (TreeMultiSet) | 0.00 | 0.00 | 0.00 | ±3.88% |

#### TreeMultiSet (side-by-side)

> 对比表格。上面的主表格仅为 TreeMultiSet。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiSet expanded iteration) | 217.73 | - | 752.00 | - |
| 1M has-only (TreeMultiSet) | 67.67 | - | 756.00 | - |
| 1M count-only (TreeMultiSet) | 55.74 | - | 1332.00 | - |
| 1M build+has (TreeMultiSet) | 260.84 | - | 1406.00 | - |
| 1M build+count (TreeMultiSet) | 267.81 | - | 1909.00 | - |
| 100K delete-one (TreeMultiSet) | 217.76 | - | - | - |
| 100K setCount (TreeMultiSet) | 214.66 | - | - | - |
| 1M expanded iteration (TreeMultiSet) | 54.41 | - | - | - |
| 1M entries view (TreeMultiSet) | 15.67 | - | - | - |
| 1M size property (TreeMultiSet) | 0.00 | - | - | - |
| 1M distinctSize property (TreeMultiSet) | 0.00 | - | - | - |


### TreeMultiMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiMap bucketed) | 366.19 | 346.31 | 454.65 | ±5.51% |
| 1M has-only (TreeMultiMap) | 35.37 | 34.94 | 36.94 | ±0.39% |
| 1M get-only (TreeMultiMap) | 58.37 | 56.05 | 73.86 | ±1.37% |
| 1M count-only (TreeMultiMap) | 105.34 | 94.16 | 124.54 | ±2.71% |
| 1M build+has (TreeMultiMap) | 396.87 | 373.62 | 538.68 | ±8.08% |
| 1M build+get (TreeMultiMap) | 416.59 | 412.46 | 424.84 | ±0.62% |
| 100K hasEntry (TreeMultiMap Object.is) | 375.85 | 346.85 | 396.95 | ±2.39% |
| 100K deleteValue (TreeMultiMap Object.is) | 411.69 | 388.10 | 577.77 | ±9.06% |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0.00 | - | - | ±0% |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0.00 | - | - | ±0% |
| 1M bucket iteration (TreeMultiMap) | 22.55 | 21.91 | 25.20 | ±0.68% |
| 1M flatEntries iteration (TreeMultiMap) | 106.47 | 104.33 | 110.52 | ±0.6% |
| 1M size property (TreeMultiMap) | 0.00 | 0.00 | 0.00 | ±4.08% |
| 1M totalSize property (TreeMultiMap) | 21.74 | 21.09 | 25.40 | ±0.8% |

#### TreeMultiMap (side-by-side)

> 对比表格。上面的主表格仅为 TreeMultiMap。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiMap bucketed) | 366.19 | - | 731.00 | - |
| 1M has-only (TreeMultiMap) | 35.37 | - | 833.00 | - |
| 1M get-only (TreeMultiMap) | 58.37 | - | 1553.00 | - |
| 1M count-only (TreeMultiMap) | 105.34 | - | 1548.00 | - |
| 1M build+has (TreeMultiMap) | 396.87 | - | 1519.00 | - |
| 1M build+get (TreeMultiMap) | 416.59 | - | 2263.00 | - |
| 100K hasEntry (TreeMultiMap Object.is) | 375.85 | - | - | - |
| 100K deleteValue (TreeMultiMap Object.is) | 411.69 | - | - | - |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0.00 | - | - | - |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0.00 | - | - | - |
| 1M bucket iteration (TreeMultiMap) | 22.55 | - | 109.00 | - |
| 1M flatEntries iteration (TreeMultiMap) | 106.47 | - | 109.00 | - |
| 1M size property (TreeMultiMap) | 0.00 | - | - | - |
| 1M totalSize property (TreeMultiMap) | 21.74 | - | - | - |


### RedBlackTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 99.24 | 82.27 | 109.67 | ±16.59% |
| 200K rangeSearch SEQ | 1365.15 | 1251.75 | 1491.01 | ±9.18% |
| 200K rangeSearch RAND | 1565.26 | 1528.89 | 1613.47 | ±2.69% |
| 1M upd SEQ | 84.75 | 82.26 | 86.85 | ±3.10% |
| 1M upd RAND | 113.72 | 112.51 | 116.12 | ±1.70% |
| 1M ins SEQ | 535.64 | 459.83 | 795.68 | ±33.88% |
| 1M ins RAND | 989.88 | 973.81 | 1001.58 | ±1.43% |
| 1M keys-only | 4.22 | 2.71 | 5.81 | ±41.71% |

#### RedBlackTree (side-by-side)

> 对比表格。上面的主表格仅为 RedBlackTree。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | DST classic (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M get | 99.24 | 304.72 | - | 52.97 | - |
| 200K rangeSearch SEQ | 1365.15 | - | - | - | - |
| 200K rangeSearch RAND | 1565.26 | - | - | - | - |
| 1M upd SEQ | 84.75 | 302.03 | - | 68.43 | - |
| 1M upd RAND | 113.72 | 422.53 | - | 158.14 | - |
| 1M ins SEQ | 535.64 | 211.38 | - | 162.72 | - |
| 1M ins RAND | 989.88 | 882.76 | - | 483.56 | - |
| 1M keys-only | 4.22 | - | - | 0.09 | - |


### BST
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 10K add randomly | 5.50 | 5.11 | 5.93 | ±0.6% |
| 10K add & delete randomly | 10.01 | 9.75 | 10.79 | ±0.4% |
| 10K addMany | 11.62 | 10.00 | 68.37 | ±15.54% |
| 10K get | 10.65 | 10.35 | 11.67 | ±0.48% |

#### BST (side-by-side)

> 对比表格。上面的主表格仅为 BST。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 10K add randomly | 5.50 | - | - | - |
| 10K add & delete randomly | 10.01 | - | - | - |
| 10K addMany | 11.62 | - | - | - |
| 10K get | 10.65 | - | - | - |


### BinaryTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K add randomly | 9.77 | 9.52 | 10.28 | ±0.36% |
| 1K add & delete randomly | 10.05 | 9.67 | 11.34 | ±0.69% |
| 1K addMany | 10.79 | 9.20 | 84.26 | ±19.64% |
| 1K get | 9.64 | 9.15 | 12.52 | ±1.33% |
| 1K has | 9.50 | 9.20 | 11.91 | ±0.76% |
| 1K dfs | 92.87 | 90.46 | 96.24 | ±0.62% |
| 1K bfs | 37.34 | 36.18 | 42.30 | ±0.7% |
| 1K morris | 37.49 | 36.29 | 39.54 | ±0.51% |

#### BinaryTree (side-by-side)

> 对比表格。上面的主表格仅为 BinaryTree。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K add randomly | 9.77 | - | - | - |
| 1K add & delete randomly | 10.05 | - | - | - |
| 1K addMany | 10.79 | - | - | - |
| 1K get | 9.64 | - | - | - |
| 1K has | 9.50 | - | - | - |
| 1K dfs | 92.87 | - | - | - |
| 1K bfs | 37.34 | - | - | - |
| 1K morris | 37.49 | - | - | - |


### HashMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 146.17 | 84.97 | 644.99 | ±33.94% |
| 1M set & get | 141.88 | 106.42 | 178.02 | ±6.1% |
| 1M ObjKey set & get | 223.16 | 210.45 | 300.73 | ±5.48% |

#### HashMap (side-by-side)

> 对比表格。上面的主表格仅为 HashMap。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set | 146.17 | 144.83 | 76.26 | 94.16 |
| 1M set & get | 141.88 | 200.47 | 75.25 | 67.16 |
| 1M ObjKey set & get | 223.16 | 206.62 | 84.40 | 382.79 |


### Trie
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 141.10 | 78.57 | 1348.32 | ±65.27% |
| 100K getWords | 57.16 | 52.58 | 63.12 | ±1.37% |

#### Trie (side-by-side)

> 对比表格。上面的主表格仅为 Trie。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 141.10 | - | - | - |
| 100K getWords | 57.16 | - | - | - |


### DirectedGraph
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K addVertex | 0.05 | 0.05 | 0.05 | ±0.43% |
| 1K addEdge | 0.00 | - | - | ±0% |
| 1K getVertex | 37.54 | 36.05 | 38.86 | ±0.39% |
| 1K getEdge | 74.48 | 72.60 | 77.63 | ±0.44% |
| tarjan | 0.38 | 0.34 | 0.42 | ±0.93% |
| topologicalSort | 0.24 | 0.23 | 0.26 | ±0.51% |

#### DirectedGraph (side-by-side)

> 对比表格。上面的主表格仅为 DirectedGraph。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K addVertex | 0.05 | - | - | - |
| 1K addEdge | 0.00 | - | - | - |
| 1K getVertex | 37.54 | - | - | - |
| 1K getEdge | 74.48 | - | - | - |
| tarjan | 0.38 | - | - | - |
| topologicalSort | 0.24 | - | - | - |


### Stack
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 46.38 | 31.28 | 258.38 | ±26.06% |
| 1M push & pop | 34.59 | 27.52 | 121.56 | ±14.83% |

#### Stack (side-by-side)

> 对比表格。上面的主表格仅为 Stack。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 46.38 | 30.28 | 1.65 | 32.38 |
| 1M push & pop | 34.59 | 34.53 | 2.62 | 34.45 |


### red-black-tree-cjs
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 97.57 | 75.66 | 115.14 | ±22.94% |
| 1M upd SEQ | 85.76 | 78.96 | 92.92 | ±8.16% |
| 1M upd RAND | 113.48 | 101.84 | 120.90 | ±7.77% |
| 1M ins SEQ | 493.45 | 436.86 | 670.44 | ±25.42% |
| 1M ins RAND | 1023.19 | 976.56 | 1094.17 | ±5.36% |
| 1M keys-only | 4.22 | 2.71 | 5.90 | ±41.83% |

#### red-black-tree-cjs (side-by-side)

> 对比表格。上面的主表格仅为 red-black-tree-cjs。
> 当此基准测试中没有对等比较时,Native 为 `-`。

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M get | 97.57 | - | - | - |
| 1M upd SEQ | 85.76 | - | - | - |
| 1M upd RAND | 113.48 | - | - | - |
| 1M ins SEQ | 493.45 | - | - | - |
| 1M ins RAND | 1023.19 | - | - | - |
| 1M keys-only | 4.22 | - | - | - |



[//]: # (No deletion!!! End of Replace Section)

## 真实场景

### 场景 1: 消息队列处理

**问题**: 处理 10 万条消息队列。

```javascript
// ❌ Array.shift() 方式
const queue = [];
for (let msg of incomingMessages) queue.push(msg);
for (let i = 0; i < 100000; i++) {
  const msg = queue.shift();  // 每次 O(n)!
  processMessage(msg);
}
// 总计: 100,000 * O(n) = O(n²)
// 时间: 10 万项耗时约 2829ms
```

```javascript
// ✅ Deque 方式
import { Deque } from 'data-structure-typed';

const deque = new Deque();
for (let msg of incomingMessages) deque.push(msg);
for (let i = 0; i < 100000; i++) {
  const msg = deque.shift();  // O(1)!
  processMessage(msg);
}
// 总计: 100,000 * O(1) = O(n)
// 时间: 10 万项耗时约 5.83ms

// 快 484 倍!
```

**实际影响**: 在处理每秒 10,000 个请求的系统中,这每秒节省 475ms 延迟。

### 场景 2: 排行榜排名

**问题**: 维护前 100 名玩家并不断更新分数。

```javascript
// ❌ Array 方式
const players = [];

function updateScore(playerId, newScore) {
  const idx = players.findIndex(p => p.id === playerId);
  players[idx].score = newScore;
  players.sort((a, b) => b.score - a.score);  // 每次 O(n log n)!
}

// 1000 次更新后: 1000 * O(n log n) = O(n² log n)
// 时间: 维护 100 名玩家排名耗时约 2500ms
```

```javascript
// ✅ RedBlackTree 方式
import { RedBlackTree } from 'data-structure-typed';

const leaderboard = new RedBlackTree<number, number>();

function updateScore(playerId, newScore) {
  // 以 playerId 为键: 更新只需单次 O(log n) set。
  // (如果需要*按分数排名*,使用分数作为键的(一部分)并维护 playerId→score 索引。)
  leaderboard.set(playerId, newScore);
}

// 1000 次更新后: 1000 * O(log n) = O(n log n)
// 时间: 对 100 名玩家进行 1000 次更新耗时约 8ms(在 PERFORMANCE.md 中测量)

// 比每次更新都排序快约 312 倍
```

**实际影响**: 实时排行榜瞬间更新,而不是延迟。

### 场景 3: 按优先级调度任务

**问题**: 按优先级顺序执行任务,有 1 万个待处理任务。

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

// 添加 1 万个任务: 10K * O(n log n) = O(n² log n)
// 时间: 约 3200ms
```

```javascript
// ✅ PriorityQueue 方式
import { MaxPriorityQueue } from 'data-structure-typed';

const pq = new MaxPriorityQueue();

function addTask(task) {
  pq.add(task);  // O(log n)
}

function nextTask() {
  return pq.poll();  // O(log n)
}

// 添加 1 万个任务: 10K * O(log n) = O(n log n)
// 时间: 约 45ms

// 快 71 倍!
```

---

## 详细基准测试

### Deque vs Array 性能

| 操作            | Array  | Deque  | 加速     |
|-----------------|--------|--------|----------|
| 10 万次 shifts  | 2829ms | 5.83ms | **485x** |
| 10 万次 unshifts| 2847ms | 6.12ms | **465x** |
| 10 万次操作     | 2900ms | 7.45ms | **390x** |

### 排序性能

| 数据规模   | Array.sort | RedBlackTree | 加速                |
|------------|------------|--------------|---------------------|
| 1K 项      | 0.8ms      | 3.2ms*       | 0.25x(排序更快)     |
| 10K 项     | 12ms       | 18ms**       | 约 0.66x            |
| 100K 项    | 150ms      | 165ms**      | 约 0.9x             |
| 1M 项      | 1800ms     | 1950ms**     | 约 0.92x            |

*首次 - 非重复排序
**全程保持有序

**关键洞察**: 对于重复操作(更新并重新排序),RBTree 快得多:

| 场景                      | Array   | RBTree | 加速     |
|---------------------------|---------|--------|----------|
| 插入 1K,排序一次          | 2ms     | 5ms    | 0.4x     |
| 插入 1K,重新排序 100 次   | 200ms   | 5ms    | **40x**  |
| 插入 100K,重新排序 1000 次| 20000ms | 65ms   | **308x** |

### 搜索性能

| 数据结构   | 1K 项   | 10K 项  | 100K 项 |
|------------|---------|---------|---------|
| Array(线性)| 0.5ms   | 5ms     | 50ms    |
| BST(平衡)  | 0.01ms  | 0.013ms | 0.015ms |
| RedBlackTree| 0.01ms | 0.013ms | 0.015ms |
| HashMap    | 0.001ms | 0.001ms | 0.001ms |

### 内存使用

| 数据结构         | 1K 项  | 10K 项  | 100K 项  | 1M 项      |
|------------------|--------|---------|----------|------------|
| Array            | 39 KB  | 242 KB  | 2,706 KB | 21,519 KB  |
| Queue            | 38 KB  | 248 KB  | 2,712 KB | 21,527 KB  |
| Deque            | 53 KB  | 147 KB  | 1,341 KB | 10,717 KB  |
| SinglyLinkedList | 60 KB  | 425 KB  | 3,947 KB | 39,100 KB  |
| DoublyLinkedList | 60 KB  | 502 KB  | 4,726 KB | 46,909 KB  |
| Stack            | 42 KB  | 240 KB  | 2,709 KB | 21,521 KB  |
| Heap             | 35 KB  | 250 KB  | 2,716 KB | 21,530 KB  |
| PriorityQueue    | 39 KB  | 245 KB  | 2,711 KB | 21,524 KB  |
| Trie             | 526 KB | 3,040 KB| 29,160 KB| 270,733 KB |
| RedBlackTree     | 570 KB | 1,069 KB| 8,765 KB | 86,035 KB  |
| TreeCounter      | 553 KB | 1,134 KB| 11,099 KB| 91,415 KB  |
| TreeMultiMap     | 2,069 KB| 4,836 KB| 32,828 KB| 208,619 KB|

### C++ vs JavaScript 数据结构内存使用对比(100 万个元素)

| 数据结构         | C++       | JavaScript | 倍数        | 评估                                                                   |
|------------------|-----------|------------|-------------|------------------------------------------------------------------------|
| Array            | 4–8 MB    | 21.01 MB   | 2.75×–5.51× | JavaScript 由于对象模型和 GC 开销使用的内存明显更多                    |
| Queue            | 8–24 MB   | 21.02 MB   | 0.92×–2.76× | 内存使用很大程度上取决于 C++ 实现策略                                  |
| Deque            | 8–24 MB   | 10.47 MB   | 0.46×–1.37× | JavaScript 实现在这种情况下相对内存高效                                |
| SinglyLinkedList | 24–40 MB  | 38.18 MB   | 1.00×–1.67× | 内存占用相似;两者都受到每节点分配开销的影响                            |
| DoublyLinkedList | 32–56 MB  | 45.81 MB   | 0.86×–1.50× | 内存使用可比;两种语言中分配器开销占主导                                |
| Stack            | 4–8 MB    | 21.02 MB   | 2.75×–5.51× | JavaScript 栈比基于 C++ vector 的栈重得多                              |
| Heap             | 4–8 MB    | 21.03 MB   | 2.76×–5.51× | JavaScript 堆实现带来大量运行时开销                                    |
| PriorityQueue    | 4–8 MB    | 21.02 MB   | 2.76×–5.51× | 类似于 Heap;JavaScript 支付额外的元数据和 GC 成本                      |
| Trie             | 32–160 MB | 264.39 MB  | 1.73×–8.66× | 高度依赖实现;基于 JavaScript 对象的 trie 非常占内存                    |
| RedBlackTree     | 48–80 MB  | 84.02 MB   | 1.10×–1.84× | JavaScript 树更大,但与数组相比差距适中                                 |
| TreeCounter      | 56–88 MB  | 89.27 MB   | 1.06×–1.67× | 每个节点的额外记录增加了 JavaScript 的内存使用                         |
| TreeMultiMap     | 56–96 MB  | 203.73 MB  | 2.23×–3.81× | 深度对象嵌套显著放大 JavaScript 的内存消耗                             |

---

## 何时使用什么

### 决策矩阵

| 需要...               | 使用...       | 复杂度              | 备注               |
|-----------------------|---------------|---------------------|--------------------|
| 按索引随机访问        | Array         | O(1) 访问           | 标准选择           |
| 有序且需更新          | RedBlackTree  | O(log n) 所有操作   | 自动维护           |
| 优先队列              | PriorityQueue | O(log n) 添加/删除  | 保持顺序           |
| 快速头尾操作          | Deque         | O(1) 所有操作       | 队列最佳           |
| 前缀搜索              | Trie          | O(m+k)              | m=前缀长度         |
| 撤销/重做栈           | Stack         | O(1) 所有操作       | LIFO 顺序          |
| 消息队列              | Queue/Deque   | O(1) 所有操作       | FIFO 顺序          |
| 图算法                | DirectedGraph | 不定                | DFS, BFS, Dijkstra |
| 键值查找              | Map           | O(1) 平均           | 无序可接受         |
| 只排序一次            | Array.sort()  | O(n log n)          | 一次性成本可接受   |

### 快速决策指南

```
需要频繁的头尾操作?
  是 → Deque (O(1) shift/unshift/push/pop)
  否 → 下一步

需要有序 + 快速查找?
  是 → RedBlackTree (保证 O(log n))
  否 → 下一步

需要最高/最低优先级?
  是 → Heap/PriorityQueue (O(log n) 添加/删除)
  否 → 下一步

需要前缀/文本匹配?
  是 → Trie (O(m+k) 其中 m=前缀)
  否 → 下一步

需要图操作?
  是 → DirectedGraph/UndirectedGraph
  否 → 使用 Array(最简单情况)
```

---

## 优化建议

### 建议 1: 批量操作

```javascript
// ❌ 慢: 每次插入后排序
const tree = new RedBlackTree();
for (const item of items) {
  tree.set(item.id, item);  // 树每次重新平衡
}
```

```javascript
// ✅ 快: 批量构建
const tree = new RedBlackTree(items);
// 单次重新平衡

// 对于大数据集通常更快(每次插入的平衡步骤更少)。在你的工作负载上测量。
```

### 建议 2: 尽早使用正确的结构

```javascript
// ❌ 错误: 从 Array 开始,稍后转换
const data = [];
for (const item of input) data.push(item);
const sorted = [...new RedBlackTree(data).keys()];
```

```javascript
// ✅ 正确: 立即使用正确的结构
const tree = new RedBlackTree(input);
const sorted = [...tree.keys()];

// 好处: 无转换开销
```

### 建议 3: 链式操作

```javascript
// ❌ 慢: 转换为 Array 失去优势
const tree = new RedBlackTree(data);
const result = tree.toArray()
  .filter(x => x > 5)
  .map(x => x * 2);
```

```javascript
// ✅ 快: 保持在树上
const result = tree
  .filter((v => (v ?? 0) > 5)
    .map(((v, k) => [k, (x ?? 0) * 2]);

// 好处: 始终保持结构类型
```

### 建议 4: V8 JIT 预热

```javascript
// 首次调用是解释的(慢)
// 后续调用是 JIT 编译的(快)

const tree = new RedBlackTree();

// 前 100 次插入: 解释,较慢
// 接下来的 900 次插入: JIT 编译(通常更快)

// 策略: 在计时前进行预热
for (let i = 0; i < 1000; i++) tree.set(i, i);
// 现在树已预热,基准测试更快
```

### 建议 5: 选择正确的比较器

```javascript
// ❌ 慢: 复杂的比较器
const tree = new RedBlackTree((a, b) => {
  if (a.category !== b.category) {
    return a.category.localeCompare(b.category);
  }
  return a.priority - b.priority;
});
```

```javascript
// ✅ 快: 简单的比较器
const tree = new RedBlackTree([], { comparator: (a, b) => a - b)
}
;

// 原因: V8 可以内联简单的比较器
```

---

## 基准测试汇总表

### 每秒操作数

| 操作        | Array   | Deque    | Tree      | Heap   |
|-------------|---------|----------|-----------|--------|
| 1K shifts   | 353/秒  | 171K/秒  | -         | -      |
| 1K inserts  | 625/秒  | 625/秒   | 10K/秒    | 8K/秒  |
| 1K searches | 2K/秒   | -        | 100K/秒   | 1K/秒  |
| 1K sorts    | 1/秒    | -        | 1000/秒*  | -      |

*保持有序

---

## 结论

### 何时优化

1. **先分析**: 没有数据不要优化
2. **仅热点路径**: 专注于频繁调用的代码
3. **正确的结构很重要**: 可能获得巨大加速(见上述测量场景)
4. **小数据集**: Array 通常就够了
5. **大数据集**: 结构选择至关重要

### 性能层次

```
Array.sort() ← 简单,每次会话一次
RedBlackTree ← 有序 + 频繁更新
Deque ← 频繁头尾操作
Heap ← 优先级很重要
Trie ← 前缀搜索
HashMap/Map ← 无序键值查找
```

---

**需要示例?** 参见 [GUIDES_CN.md](./GUIDES_CN.md)。

**想了解原因?** 阅读 [ARCHITECTURE_CN.md](./ARCHITECTURE_CN.md)。
