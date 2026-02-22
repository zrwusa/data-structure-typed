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
| **加速**               | **约 485 倍**  | 关键差异           |

### 场景 2: 1000 次排行榜更新

| 方法              | 时间           | 备注                |
|-----------------|--------------|-------------------|
| Array.sort() 每次 | **2500ms** ❌ | 1000 * O(n log n) |
| RedBlackTree    | **8ms** ✅    | 1000 * O(log n)   |
| **加速**          | **约 312 倍**  | 实时排行榜             |

### 场景 3: 10K 任务优先级处理

| 方法               | 时间           | 备注          |
|------------------|--------------|-------------|
| 手动优先级            | **3200ms** ❌ | O(n² log n) |
| MaxPriorityQueue | **45ms** ✅   | O(n log n)  |
| **加速**           | **约 71 倍**   | 任务调度        |

---

## 详细基准测试

[//]: # (No deletion!!! Start of Replace Section)

### DoublyLinkedList

| Test Case               | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-------------------------|----------|----------|----------|-----------|
| 100k push               | 8.0558   | 5.6144   | 54.1937  | ±17.51%   |
| 100k unshift            | 6.7611   | 5.4572   | 7.4359   | ±1.44%    |
| 100k unshift & shift    | 4.5245   | 4.129    | 4.8488   | ±0.47%    |
| 100k addAt(mid)         | 1645.02  | 1331.61  | 2329.62  | ±26.54%   |
| 100k addBefore (cursor) | 6.4823   | 5.7978   | 15.2295  | ±5.35%    |

#### DoublyLinkedList (side-by-side)

> Comparison table. The main table above is DoublyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case               | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-------------------------|---------:|-------------:|------------:|---------:|
| 100k push               |   8.0558 |       1.9328 |      2.0706 |     5.42 |
| 100k unshift            |   6.7611 |       1.8299 |     1058.07 |     5.44 |
| 100k unshift & shift    |   4.5245 |       2.2136 |     2296.49 |     5.43 |
| 100k addAt(mid)         |  1645.02 |            - |           - |    705.4 |
| 100k addBefore (cursor) |   6.4823 |            - |           - |     6.14 |

### SinglyLinkedList

| Test Case              | Avg (ms) | Min (ms) | Max (ms) | Stability |
|------------------------|----------|----------|----------|-----------|
| 100K unshift & shift   | 5.24     | 3.3731   | 6.9825   | ±6.31%    |
| 10K unshift & shift    | 0.6349   | 0.4499   | 0.7052   | ±2.5%     |
| 10K addAt(mid)         | 18.11    | 9.37     | 24.22    | ±4.8%     |
| 10K addBefore (cursor) | 30.11    | 17.53    | 44.66    | ±7.08%    |

#### SinglyLinkedList (side-by-side)

> Comparison table. The main table above is SinglyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case              | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|------------------------|---------:|-------------:|------------:|---------:|
| 100K unshift & shift   |     5.24 |            - |     4029.88 |     10.1 |
| 10K unshift & shift    |   0.6349 |            - |       13.23 |        1 |
| 10K addAt(mid)         |    18.11 |            - |           - |     12.7 |
| 10K addBefore (cursor) |    30.11 |            - |           - |     1.13 |

### HashMap

| Test Case           | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------------|----------|----------|----------|-----------|
| 1M set              | 185.57   | 123.72   | 354.4    | ±14.94%   |
| 1M set & get        | 247.06   | 195.24   | 280.69   | ±6.84%    |
| 1M ObjKey set & get | 379.65   | 341.94   | 490.79   | ±8.68%    |

#### HashMap (side-by-side)

> Comparison table. The main table above is HashMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case           | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------------|---------:|-------------:|------------:|---------:|
| 1M set              |   185.57 |       158.49 |      219.67 |    70.22 |
| 1M set & get        |   247.06 |       112.79 |      287.39 |    73.04 |
| 1M ObjKey set & get |   379.65 |       698.13 |      299.71 |    92.55 |

### Queue

| Test Case         | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-------------------|----------|----------|----------|-----------|
| 1M push           | 28.91    | 24.9     | 73.74    | ±6.24%    |
| 100K push & shift | 3.0798   | 2.6563   | 17.8644  | ±11.62%   |

#### Queue (side-by-side)

> Comparison table. The main table above is Queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case         | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-------------------|---------:|-------------:|------------:|---------:|
| 1M push           |    28.91 |        54.13 |       26.31 |        - |
| 100K push & shift |   3.0798 |       2.5642 |     1403.59 |        - |

### Deque

| Test Case            | Avg (ms) | Min (ms) | Max (ms) | Stability |
|----------------------|----------|----------|----------|-----------|
| 1M push              | 10.82    | 7.57     | 16.63    | ±5.46%    |
| 1M push & pop        | 16.92    | 11.89    | 27.13    | ±7.55%    |
| 1M push & shift      | 33.74    | 28.58    | 55.22    | ±3.46%    |
| 100K push & shift    | 2.4481   | 1.6576   | 3.0384   | ±2.16%    |
| 100K unshift & shift | 2.4391   | 1.6261   | 4.5413   | ±3.37%    |

#### Deque (side-by-side)

> Comparison table. The main table above is Deque only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case            | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|----------------------|---------:|-------------:|------------:|---------:|
| 1M push              |    10.82 |        17.59 |        29.7 |     1.76 |
| 1M push & pop        |    16.92 |        27.92 |       54.43 |      2.2 |
| 1M push & shift      |    33.74 |            - |           - |     1.94 |
| 100K push & shift    |   2.4481 |       2.5224 |     2007.91 |     0.19 |
| 100K unshift & shift |   2.4391 |       2.5091 |     4067.39 |     0.19 |

### PriorityQueue

| Test Case       | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------------|----------|----------|----------|-----------|
| 100K add        | 4.366    | 4.2775   | 5.0309   | ±0.55%    |
| 100K add & poll | 26.13    | 25.54    | 26.9     | ±0.4%     |

#### PriorityQueue (side-by-side)

> Comparison table. The main table above is PriorityQueue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case       | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-----------------|---------:|-------------:|------------:|---------:|
| 100K add        |    4.366 |       5.6519 |           - |        - |
| 100K add & poll |    26.13 |        26.89 |           - |        - |

### Stack

| Test Case     | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------|----------|----------|----------|-----------|
| 1M push       | 26.35    | 24.73    | 33.75    | ±2.09%    |
| 1M push & pop | 29.46    | 25.81    | 102.67   | ±8.59%    |

#### Stack (side-by-side)

> Comparison table. The main table above is Stack only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case     | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------|---------:|-------------:|------------:|---------:|
| 1M push       |    26.35 |        30.57 |       26.72 |     1.65 |
| 1M push & pop |    29.46 |         30.9 |       30.61 |     2.62 |

### RedBlackTree

| Test Case             | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------------------|----------|----------|----------|-----------|
| 1M get                | 100.68   | 85.62    | 112.14   | ±16.94%   |
| 200K rangeSearch SEQ  | 1279.47  | 1235.27  | 1366.88  | ±5.59%    |
| 200K rangeSearch RAND | 1969.15  | 1885.88  | 2168.54  | ±7.23%    |
| 1M upd SEQ            | 79.06    | 71.1     | 95.84    | ±15.75%   |
| 1M upd RAND           | 113.1    | 106.36   | 118.28   | ±5.08%    |
| 1M ins SEQ            | 567.61   | 463.22   | 946.06   | ±46.30%   |
| 1M ins RAND           | 1611.63  | 1585.89  | 1631.64  | ±1.37%    |
| 1M keys-only          | 4.0047   | 2.711    | 5.4122   | ±37.29%   |

#### RedBlackTree (side-by-side)

> Comparison table. The main table above is RedBlackTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case             | DST (ms) | Node Mode (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-----------------------|---------:|---------------:|-------------:|------------:|---------:|
| 1M get                |   100.68 |         254.42 |       138.51 |           - |    52.97 |
| 200K rangeSearch SEQ  |  1279.47 |              - |            - |           - |        - |
| 200K rangeSearch RAND |  1969.15 |              - |            - |           - |        - |
| 1M upd SEQ            |    79.06 |         225.95 |       171.15 |           - |    68.43 |
| 1M upd RAND           |    113.1 |         393.78 |       302.59 |           - |   158.14 |
| 1M ins SEQ            |   567.61 |         196.91 |         89.1 |           - |   162.72 |
| 1M ins RAND           |  1611.63 |        1169.56 |       825.66 |           - |   483.56 |
| 1M keys-only          |   4.0047 |              - |            - |           - |     0.09 |

### AVLTree

| Test Case                         | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------------------------------|----------|----------|----------|-----------|
| 100K add randomly                 | 147.71   | 139.72   | 165.99   | ±1.82%    |
| 100K add                          | 120.95   | 116.96   | 137.67   | ±1.33%    |
| 100K get                          | 4.6144   | 4.1946   | 5.3585   | ±1.46%    |
| 100K getNode                      | 29.31    | 28.32    | 31.6     | ±0.64%    |
| 100K iterator                     | 6.5625   | 5.9973   | 8.4057   | ±1.68%    |
| 100K add & delete orderly         | 181.9    | 178.51   | 189.75   | ±0.85%    |
| 100K add & delete randomly        | 224.47   | 215.79   | 246.42   | ±1.71%    |
| AVL Tree 100K rangeSearch queries | 1388.54  | 1359.91  | 1417.61  | ±2.01%    |

#### AVLTree (side-by-side)

> Comparison table. The main table above is AVLTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                         | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-----------------------------------|---------:|-------------:|------------:|---------:|
| 100K add randomly                 |   147.71 |            - |           - |    16.62 |
| 100K add                          |   120.95 |            - |           - |    15.48 |
| 100K get                          |   4.6144 |            - |           - |     7.21 |
| 100K getNode                      |    29.31 |            - |           - |     8.51 |
| 100K iterator                     |   6.5625 |            - |           - |     1.06 |
| 100K add & delete orderly         |    181.9 |            - |           - |    21.56 |
| 100K add & delete randomly        |   224.47 |            - |           - |    27.96 |
| AVL Tree 100K rangeSearch queries |  1388.54 |            - |           - |    111.9 |

### TreeSet

| Test Case                             | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------------------------------|----------|----------|----------|-----------|
| 1M add TreeSet                        | 1817.81  | 1533.15  | 2706.38  | ±25.9%    |
| 1M add TreeSet (Node)                 | 1476.13  | 1148.9   | 3279.63  | ±49.85%   |
| 1M add RBT                            | 1956.77  | 1612.71  | 3418.44  | ±38.5%    |
| 1M add RBT (Node)                     | 1454.84  | 1195.1   | 2613.68  | ±41.02%   |
| 1M add js-sdsl                        | 1139.28  | 809.72   | 2722.45  | ±71.46%   |
| 1M has TreeSet                        | 89.75    | 86.56    | 99.35    | ±0.95%    |
| 1M has TreeSet (Node)                 | 929.28   | 927.12   | 933.02   | ±0.2%     |
| 1M has RBT                            | 91.74    | 83.2     | 100.99   | ±2.08%    |
| 1M has RBT (Node)                     | 1095.73  | 1051.17  | 1164.12  | ±3.93%    |
| 1M has js-sdsl                        | 849.02   | 838.57   | 875.56   | ±1.42%    |
| 1M build+has TreeSet                  | 2096.95  | 1624.92  | 3921.13  | ±60.38%   |
| 1M build+has TreeSet (Node)           | 2072.15  | 2019.66  | 2115.15  | ±1.84%    |
| 1M build+has RBT                      | 2172.55  | 1674.07  | 4259.19  | ±49.52%   |
| 1M build+has RBT (Node)               | 2187.87  | 2163.01  | 2203.74  | ±0.79%    |
| 1M build+has js-sdsl                  | 1610.39  | 1574.07  | 1647.04  | ±1.94%    |
| 100K rangeSearch TreeSet              | 37.37    | 35.19    | 40.18    | ±0.86%    |
| 100K rangeSearch TreeSet (Node)       | 36.88    | 35.59    | 42.99    | ±1.02%    |
| 100K navigable TreeSet                | 153.24   | 150.21   | 158.68   | ±0.72%    |
| 100K navigable TreeSet (Node)         | 151.69   | 149.84   | 154.73   | ±0.5%     |
| 100K build+rangeSearch TreeSet        | 1921     | 1594.35  | 3251.16  | ±35.83%   |
| 100K build+rangeSearch TreeSet (Node) | 1451.29  | 1157.2   | 3130.5   | ±47.2%    |
| 100K build+navigable TreeSet          | 1717.88  | 1690.85  | 1738.33  | ±0.98%    |
| 100K build+navigable TreeSet (Node)   | 1323.3   | 1278.1   | 1426.23  | ±4.21%    |

#### TreeSet (side-by-side)

> Comparison table. The main table above is TreeSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                             | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------------------------------|---------:|-------------:|------------:|---------:|
| 1M add TreeSet                        |  1817.81 |            - |           - |      462 |
| 1M add TreeSet (Node)                 |  1476.13 |            - |           - |      462 |
| 1M add RBT                            |  1956.77 |            - |           - |      462 |
| 1M add RBT (Node)                     |  1454.84 |            - |           - |      462 |
| 1M add js-sdsl                        |  1139.28 |            - |           - |        - |
| 1M has TreeSet                        |    89.75 |            - |           - |      444 |
| 1M has TreeSet (Node)                 |   929.28 |            - |           - |      444 |
| 1M has RBT                            |    91.74 |            - |           - |      444 |
| 1M has RBT (Node)                     |  1095.73 |            - |           - |      444 |
| 1M has js-sdsl                        |   849.02 |            - |           - |        - |
| 1M build+has TreeSet                  |  2096.95 |            - |           - |      837 |
| 1M build+has TreeSet (Node)           |  2072.15 |            - |           - |      837 |
| 1M build+has RBT                      |  2172.55 |            - |           - |      837 |
| 1M build+has RBT (Node)               |  2187.87 |            - |           - |      837 |
| 1M build+has js-sdsl                  |  1610.39 |            - |           - |        - |
| 100K rangeSearch TreeSet              |    37.37 |            - |           - |        - |
| 100K rangeSearch TreeSet (Node)       |    36.88 |            - |           - |        - |
| 100K navigable TreeSet                |   153.24 |            - |           - |        - |
| 100K navigable TreeSet (Node)         |   151.69 |            - |           - |        - |
| 100K build+rangeSearch TreeSet        |     1921 |            - |           - |        - |
| 100K build+rangeSearch TreeSet (Node) |  1451.29 |            - |           - |        - |
| 100K build+navigable TreeSet          |  1717.88 |            - |           - |        - |
| 100K build+navigable TreeSet (Node)   |   1323.3 |            - |           - |        - |

### TreeMap

| Test Case                             | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------------------------------|----------|----------|----------|-----------|
| 1M set TreeMap                        | 1584.24  | 1544.63  | 1740.12  | ±5.08%    |
| 1M set TreeMap (Node)                 | 1163.47  | 1140.21  | 1187.8   | ±1.2%     |
| 1M set RBT                            | 1876.1   | 1638.01  | 2894.16  | ±27.93%   |
| 1M set RBT (Node)                     | 1341.04  | 1212.84  | 2075.29  | ±22.33%   |
| 1M set js-sdsl                        | 955.32   | 812.96   | 1656.95  | ±30.06%   |
| 1M get TreeMap                        | 162.76   | 159.63   | 169.33   | ±0.76%    |
| 1M get TreeMap (Node)                 | 1007.27  | 1004.6   | 1009.58  | ±0.17%    |
| 1M get RBT                            | 159.61   | 139.31   | 169.48   | ±2.2%     |
| 1M get RBT (Node)                     | 1059.56  | 1054.12  | 1067.31  | ±0.41%    |
| 1M get js-sdsl                        | 814.55   | 807.37   | 832.64   | ±0.81%    |
| 1M build+get TreeMap                  | 1936.03  | 1792.06  | 2519.08  | ±15.73%   |
| 1M build+get TreeMap (Node)           | 2351.42  | 2042.67  | 3044.57  | ±20.62%   |
| 1M build+get RBT                      | 2009.46  | 1781.2   | 3079.96  | ±27.4%    |
| 1M build+get RBT (Node)               | 2191.41  | 2154.05  | 2228.17  | ±1.37%    |
| 1M build+get js-sdsl                  | 1767.13  | 1506.48  | 2657.98  | ±26.33%   |
| 100K rangeSearch TreeMap              | 114.35   | 72.07    | 917.58   | ±50.59%   |
| 100K rangeSearch TreeMap (Node)       | 82.85    | 80.41    | 102.84   | ±1.59%    |
| 100K navigable TreeMap                | 168.61   | 164.97   | 175.78   | ±0.75%    |
| 100K navigable TreeMap (Node)         | 245.61   | 243.13   | 248.82   | ±0.4%     |
| 100K build+rangeSearch TreeMap        | 1800.18  | 1586.05  | 2490.56  | ±19.93%   |
| 100K build+rangeSearch TreeMap (Node) | 1364.8   | 1198.69  | 2119.02  | ±28.44%   |
| 100K build+navigable TreeMap          | 1733.87  | 1721.11  | 1753.36  | ±0.69%    |
| 100K build+navigable TreeMap (Node)   | 1423.19  | 1390.54  | 1517.41  | ±3.56%    |

#### TreeMap (side-by-side)

> Comparison table. The main table above is TreeMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                             | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------------------------------|---------:|-------------:|------------:|---------:|
| 1M set TreeMap                        |  1584.24 |            - |           - |      512 |
| 1M set TreeMap (Node)                 |  1163.47 |            - |           - |      512 |
| 1M set RBT                            |   1876.1 |            - |           - |      512 |
| 1M set RBT (Node)                     |  1341.04 |            - |           - |      512 |
| 1M set js-sdsl                        |   955.32 |            - |           - |        - |
| 1M get TreeMap                        |   162.76 |            - |           - |      322 |
| 1M get TreeMap (Node)                 |  1007.27 |            - |           - |      322 |
| 1M get RBT                            |   159.61 |            - |           - |      322 |
| 1M get RBT (Node)                     |  1059.56 |            - |           - |      322 |
| 1M get js-sdsl                        |   814.55 |            - |           - |        - |
| 1M build+get TreeMap                  |  1936.03 |            - |           - |      819 |
| 1M build+get TreeMap (Node)           |  2351.42 |            - |           - |      819 |
| 1M build+get RBT                      |  2009.46 |            - |           - |      819 |
| 1M build+get RBT (Node)               |  2191.41 |            - |           - |      819 |
| 1M build+get js-sdsl                  |  1767.13 |            - |           - |        - |
| 100K rangeSearch TreeMap              |   114.35 |            - |           - |        - |
| 100K rangeSearch TreeMap (Node)       |    82.85 |            - |           - |        - |
| 100K navigable TreeMap                |   168.61 |            - |           - |        - |
| 100K navigable TreeMap (Node)         |   245.61 |            - |           - |        - |
| 100K build+rangeSearch TreeMap        |  1800.18 |            - |           - |        - |
| 100K build+rangeSearch TreeMap (Node) |   1364.8 |            - |           - |        - |
| 100K build+navigable TreeMap          |  1733.87 |            - |           - |        - |
| 100K build+navigable TreeMap (Node)   |  1423.19 |            - |           - |        - |

### TreeMultiSet

| Test Case                                | Avg (ms) | Min (ms) | Max (ms) | Stability |
|------------------------------------------|----------|----------|----------|-----------|
| 1M add (TreeMultiSet expanded iteration) | 318.73   | 225.99   | 1280.19  | ±54.8%    |
| 1M has-only (TreeMultiSet)               | 144.4    | 139.38   | 161.55   | ±1.57%    |
| 1M count-only (TreeMultiSet)             | 146.14   | 137.88   | 170.81   | ±2.71%    |
| 1M build+has (TreeMultiSet)              | 390.86   | 370.84   | 421.49   | ±2.87%    |
| 1M build+count (TreeMultiSet)            | 382.27   | 371.02   | 416.14   | ±2.16%    |
| 100K delete-one (TreeMultiSet)           | 249.65   | 240.62   | 257.99   | ±1.48%    |
| 100K setCount (TreeMultiSet)             | 291.95   | 238.1    | 666.41   | ±21.59%   |
| 1M expanded iteration (TreeMultiSet)     | 61.09    | 58.72    | 65.95    | ±0.71%    |
| 1M entries view (TreeMultiSet)           | 20.35    | 19.5     | 21.21    | ±0.4%     |
| 1M size property (TreeMultiSet)          | 0        | 0        | 0        | ±3.15%    |
| 1M distinctSize property (TreeMultiSet)  | 0        | 0        | 0        | ±3.5%     |

#### TreeMultiSet (side-by-side)

> Comparison table. The main table above is TreeMultiSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                                | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|------------------------------------------|---------:|-------------:|------------:|---------:|
| 1M add (TreeMultiSet expanded iteration) |   318.73 |            - |           - |      752 |
| 1M has-only (TreeMultiSet)               |    144.4 |            - |           - |      756 |
| 1M count-only (TreeMultiSet)             |   146.14 |            - |           - |     1332 |
| 1M build+has (TreeMultiSet)              |   390.86 |            - |           - |     1406 |
| 1M build+count (TreeMultiSet)            |   382.27 |            - |           - |     1909 |
| 100K delete-one (TreeMultiSet)           |   249.65 |            - |           - |        - |
| 100K setCount (TreeMultiSet)             |   291.95 |            - |           - |        - |
| 1M expanded iteration (TreeMultiSet)     |    61.09 |            - |           - |        - |
| 1M entries view (TreeMultiSet)           |    20.35 |            - |           - |        - |
| 1M size property (TreeMultiSet)          |        0 |            - |           - |        - |
| 1M distinctSize property (TreeMultiSet)  |        0 |            - |           - |        - |

### TreeMultiMap

| Test Case                                   | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------------------------------------|----------|----------|----------|-----------|
| 1M add (TreeMultiMap bucketed)              | 539.87   | 427.65   | 1430.72  | ±41.48%   |
| 1M has-only (TreeMultiMap)                  | 37.17    | 36.24    | 39.34    | ±0.49%    |
| 1M get-only (TreeMultiMap)                  | 148.7    | 141.89   | 162.51   | ±2%       |
| 1M count-only (TreeMultiMap)                | 231.71   | 225.61   | 260.61   | ±2.03%    |
| 1M build+has (TreeMultiMap)                 | 605.14   | 471.31   | 1600.47  | ±47.42%   |
| 1M build+get (TreeMultiMap)                 | 580.53   | 567.4    | 591.19   | ±1.03%    |
| 100K hasEntry (TreeMultiMap Object.is)      | 478.71   | 461.88   | 499.68   | ±1.95%    |
| 100K deleteValue (TreeMultiMap Object.is)   | 492.5    | 483.65   | 503.79   | ±0.97%    |
| 100K firstEntry/lastEntry (TreeMultiMap)    | 0        | null     | null     | ±0%       |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0        | null     | null     | ±0%       |
| 1M bucket iteration (TreeMultiMap)          | 28.37    | 27.16    | 29.86    | ±0.63%    |
| 1M flatEntries iteration (TreeMultiMap)     | 135.69   | 129.69   | 141.56   | ±0.86%    |
| 1M size property (TreeMultiMap)             | 0        | 0        | 0        | ±3.13%    |
| 1M totalSize property (TreeMultiMap)        | 28.59    | 26.32    | 91.83    | ±7.13%    |

#### TreeMultiMap (side-by-side)

> Comparison table. The main table above is TreeMultiMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                                   | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------------------------------------|---------:|-------------:|------------:|---------:|
| 1M add (TreeMultiMap bucketed)              |   539.87 |            - |           - |      731 |
| 1M has-only (TreeMultiMap)                  |    37.17 |            - |           - |      833 |
| 1M get-only (TreeMultiMap)                  |    148.7 |            - |           - |     1553 |
| 1M count-only (TreeMultiMap)                |   231.71 |            - |           - |     1548 |
| 1M build+has (TreeMultiMap)                 |   605.14 |            - |           - |     1519 |
| 1M build+get (TreeMultiMap)                 |   580.53 |            - |           - |     2263 |
| 100K hasEntry (TreeMultiMap Object.is)      |   478.71 |            - |           - |        - |
| 100K deleteValue (TreeMultiMap Object.is)   |    492.5 |            - |           - |        - |
| 100K firstEntry/lastEntry (TreeMultiMap)    |        0 |            - |           - |        - |
| 100K ceilingEntry/floorEntry (TreeMultiMap) |        0 |            - |           - |        - |
| 1M bucket iteration (TreeMultiMap)          |    28.37 |            - |           - |      109 |
| 1M flatEntries iteration (TreeMultiMap)     |   135.69 |            - |           - |      109 |
| 1M size property (TreeMultiMap)             |        0 |            - |           - |        - |
| 1M totalSize property (TreeMultiMap)        |    28.59 |            - |           - |        - |

### BST

| Test Case                 | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------------------|----------|----------|----------|-----------|
| 10K add randomly          | 5.8064   | 5.3484   | 15.4658  | ±4.27%    |
| 10K add & delete randomly | 10.21    | 9.92     | 12.41    | ±0.88%    |
| 10K addMany               | 10.98    | 10.25    | 23.9     | ±3.17%    |
| 10K get                   | 11.91    | 10.99    | 15.31    | ±2.1%     |

#### BST (side-by-side)

> Comparison table. The main table above is BST only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                 | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------------------|---------:|-------------:|------------:|---------:|
| 10K add randomly          |   5.8064 |            - |           - |        - |
| 10K add & delete randomly |    10.21 |            - |           - |        - |
| 10K addMany               |    10.98 |            - |           - |        - |
| 10K get                   |    11.91 |            - |           - |        - |

### BinaryTree

| Test Case                | Avg (ms) | Min (ms) | Max (ms) | Stability |
|--------------------------|----------|----------|----------|-----------|
| 1K add randomly          | 10.65    | 10.42    | 11.19    | ±0.32%    |
| 1K add & delete randomly | 11.23    | 10.49    | 26.02    | ±4.51%    |
| 1K addMany               | 10.58    | 10.29    | 11.22    | ±0.35%    |
| 1K get                   | 11.11    | 10.32    | 22.68    | ±3.53%    |
| 1K has                   | 11       | 10.3     | 23.76    | ±4.21%    |
| 1K dfs                   | 141.08   | 139.05   | 144.34   | ±0.46%    |
| 1K bfs                   | 47.83    | 46.69    | 55.65    | ±0.98%    |
| 1K morris                | 55.82    | 54.62    | 59.95    | ±0.44%    |

#### BinaryTree (side-by-side)

> Comparison table. The main table above is BinaryTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case                | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|--------------------------|---------:|-------------:|------------:|---------:|
| 1K add randomly          |    10.65 |            - |           - |        - |
| 1K add & delete randomly |    11.23 |            - |           - |        - |
| 1K addMany               |    10.58 |            - |           - |        - |
| 1K get                   |    11.11 |            - |           - |        - |
| 1K has                   |       11 |            - |           - |        - |
| 1K dfs                   |   141.08 |            - |           - |        - |
| 1K bfs                   |    47.83 |            - |           - |        - |
| 1K morris                |    55.82 |            - |           - |        - |

### Trie

| Test Case     | Avg (ms) | Min (ms) | Max (ms) | Stability |
|---------------|----------|----------|----------|-----------|
| 100K add      | 24.78    | 22.08    | 35.79    | ±3.49%    |
| 100K getWords | 117.75   | 99.64    | 202.76   | ±9.14%    |

#### Trie (side-by-side)

> Comparison table. The main table above is Trie only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case     | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|---------------|---------:|-------------:|------------:|---------:|
| 100K add      |    24.78 |            - |           - |        - |
| 100K getWords |   117.75 |            - |           - |        - |

### DirectedGraph

| Test Case       | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------------|----------|----------|----------|-----------|
| 1K addVertex    | 0.0446   | 0.0436   | 0.0557   | ±0.63%    |
| 1K addEdge      | 2.9426   | 2.7818   | 4.3713   | ±1.7%     |
| 1K getVertex    | 0.0382   | 0.0374   | 0.0441   | ±0.51%    |
| 1K getEdge      | 48.53    | 43.18    | 107.27   | ±6.34%    |
| tarjan          | 263.6    | 253.45   | 298.73   | ±2.51%    |
| topologicalSort | 221.51   | 213.7    | 246.27   | ±2.5%     |

#### DirectedGraph (side-by-side)

> Comparison table. The main table above is DirectedGraph only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case       | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
|-----------------|---------:|-------------:|------------:|---------:|
| 1K addVertex    |   0.0446 |            - |           - |        - |
| 1K addEdge      |   2.9426 |            - |           - |        - |
| 1K getVertex    |   0.0382 |            - |           - |        - |
| 1K getEdge      |    48.53 |            - |           - |        - |
| tarjan          |    263.6 |            - |           - |        - |
| topologicalSort |   221.51 |            - |           - |        - |

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
