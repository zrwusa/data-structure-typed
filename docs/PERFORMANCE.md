# PERFORMANCE: Benchmarks & Comparisons

Understand how data-structure-typed performs, and when to use each structure.

**[Back to README](../README.md) • [Architecture Details](./ARCHITECTURE.md) • [Code Examples](./GUIDES.md)**

---

## Table of Contents

1. [Performance Summary](#performance-summary)
2. [Real-World Scenarios](#real-world-scenarios)
3. [Detailed Benchmarks](#detailed-benchmarks)
4. [When to Use What](#when-to-use-what)
5. [Optimization Tips](#optimization-tips)

---

## Performance Summary

> **Note on JS vs C++ gaps:** Many “C++ faster” results are primarily explained by **runtime / memory-model differences**, not a flaw in `data-structure-typed`.
> JavaScript runs on a GC’d VM with boxed numbers, dynamic dispatch, and different cache/memory behavior, while C++ can use tight value types and predictable memory layouts.
> When the benchmark mixes in baseline containers (Native JS / js-sdsl / C++), treat cross-language comparisons as **directional** and rely most on **within-JS** comparisons for practical decisions.

### Key Numbers

- **484x faster** than Array.shift() with 100K elements (Deque vs Array)
- **40x–308x faster** in repeated “update + resort” workloads (RedBlackTree vs Array)
- **O(log n) guaranteed** on all balanced tree operations
- **O(1) guaranteed** on Deque head/tail operations
- Benchmarks include warm-up runs to reduce V8 JIT noise

### Performance Tier Chart

| Structure    | Access   | Search   | Insert   | Delete   | Best For             |
|--------------|----------|----------|----------|----------|----------------------|
| Array        | O(1)     | O(n)     | O(n)     | O(n)     | Random access        |
| LinkedList   | O(n)     | O(n)     | O(1)*    | O(1)*    | If you have pointer  |
| Stack        | -        | -        | O(1)     | O(1)     | LIFO, undo/redo      |
| Queue        | -        | -        | O(1)     | O(1)     | FIFO, message queues |
| Deque        | -        | -        | O(1)     | O(1)     | Head/tail ops        |
| BST          | O(log n) | O(log n) | O(log n) | O(log n) | Sorted if balanced   |
| RedBlackTree | O(log n) | O(log n) | O(log n) | O(log n) | Guaranteed sorted    |
| AVL Tree     | O(log n) | O(log n) | O(log n) | O(log n) | Max search speed     |
| Heap         | O(n)     | O(n)     | O(log n) | O(log n) | Priority queue       |
| Trie         | N/A      | O(m)     | O(m)     | O(m)     | Prefix search        |

---

## Benchmark

[//]: # (No deletion!!! Start of Replace Section)

### DoublyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100k push | 6.7661 | 5.4919 | 35.0854 | ±14.1% |
| 100k unshift | 5.0279 | 4.4565 | 5.9666 | ±2.26% |
| 100k unshift & shift | 4.0699 | 3.8907 | 4.8714 | ±0.88% |
| 100k addAt(mid) | 1362.01 | 1167.39 | 1762.77 | ±16.81% |
| 100k addBefore (cursor) | 5.6728 | 4.9101 | 18.7009 | ±7.43% |

#### DoublyLinkedList (side-by-side)

> Comparison table. The main table above is DoublyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100k push | 6.7661 | - | 1.8963 | 5.42 |
| 100k unshift | 5.0279 | - | 911.34 | 5.44 |
| 100k unshift & shift | 4.0699 | - | 2237.02 | 5.43 |
| 100k addAt(mid) | 1362.01 | - | - | 705.4 |
| 100k addBefore (cursor) | 5.6728 | - | - | 6.14 |


### SinglyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100k push & shift | 3.558 | 3.4763 | 3.6773 | ±0.31% |
| 10K push & pop | 116.31 | 107.23 | 142.69 | ±3.64% |
| 10K addAt(mid) | 9.5289 | 8.498 | 14.1707 | ±3.05% |
| 10K addBefore (cursor) | 17.42 | 16.96 | 20.47 | ±1% |

#### SinglyLinkedList (side-by-side)

> Comparison table. The main table above is SinglyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100k push & shift | 3.558 | - | 1190.88 | 4.7 |
| 10K push & pop | 116.31 | - | 0.0631 | 0.46 |
| 10K addAt(mid) | 9.5289 | - | - | 5.89 |
| 10K addBefore (cursor) | 17.42 | - | - | 0.51 |


### HashMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 93.86 | 42.27 | 535.95 | ±44.11% |
| 1M set & get | 48.99 | 37.8 | 125.79 | ±9.97% |
| 1M ObjKey set & get | 239.69 | 215.98 | 324.61 | ±7.47% |

#### HashMap (side-by-side)

> Comparison table. The main table above is HashMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set | 93.86 | 139.57 | 149.89 | 70.22 |
| 1M set & get | 48.99 | 60.74 | 206.58 | 73.04 |
| 1M ObjKey set & get | 239.69 | 396.33 | 207.42 | 92.55 |


### Deque
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 8.9786 | 6.4005 | 15.2833 | ±6.6% |
| 1M push & pop | 11.62 | 9.94 | 35.37 | ±6.66% |
| 1M push & shift | 20.44 | 17.76 | 43.79 | ±5.55% |
| 100K push & shift | 1.1801 | 1.1296 | 1.5006 | ±1.12% |
| 100K unshift & shift | 1.247 | 1.1608 | 2.3719 | ±2.41% |

#### Deque (side-by-side)

> Comparison table. The main table above is Deque only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 8.9786 | - | 25.91 | 1.76 |
| 1M push & pop | 11.62 | - | 28.49 | 2.2 |
| 1M push & shift | 20.44 | - | - | 1.94 |
| 100K push & shift | 1.1801 | - | 1065.93 | 0.19 |
| 100K unshift & shift | 1.247 | - | 2043.21 | 0.19 |


### Stack
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 26.35 | 24.73 | 33.75 | ±2.09% |
| 1M push & pop | 29.46 | 25.81 | 102.67 | ±8.59% |

#### Stack (side-by-side)

> Comparison table. The main table above is Stack only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 26.35 | 30.57 | 26.72 | 1.65 |
| 1M push & pop | 29.46 | 30.9 | 30.61 | 2.62 |


### RedBlackTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 100.68 | 85.62 | 112.14 | ±16.94% |
| 200K rangeSearch SEQ | 1279.47 | 1235.27 | 1366.88 | ±5.59% |
| 200K rangeSearch RAND | 1969.15 | 1885.88 | 2168.54 | ±7.23% |
| 1M upd SEQ | 79.06 | 71.1 | 95.84 | ±15.75% |
| 1M upd RAND | 113.1 | 106.36 | 118.28 | ±5.08% |
| 1M ins SEQ | 567.61 | 463.22 | 946.06 | ±46.30% |
| 1M ins RAND | 1611.63 | 1585.89 | 1631.64 | ±1.37% |
| 1M keys-only | 4.0047 | 2.711 | 5.4122 | ±37.29% |

#### RedBlackTree (side-by-side)

> Comparison table. The main table above is RedBlackTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | Node Mode (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M get | 100.68 | 254.42 | 138.51 | - | 52.97 |
| 200K rangeSearch SEQ | 1279.47 | - | - | - | - |
| 200K rangeSearch RAND | 1969.15 | - | - | - | - |
| 1M upd SEQ | 79.06 | 225.95 | 171.15 | - | 68.43 |
| 1M upd RAND | 113.1 | 393.78 | 302.59 | - | 158.14 |
| 1M ins SEQ | 567.61 | 196.91 | 89.1 | - | 162.72 |
| 1M ins RAND | 1611.63 | 1169.56 | 825.66 | - | 483.56 |
| 1M keys-only | 4.0047 | - | - | - | 0.09 |


### AVLTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add randomly | 147.71 | 139.72 | 165.99 | ±1.82% |
| 100K add | 120.95 | 116.96 | 137.67 | ±1.33% |
| 100K get | 4.6144 | 4.1946 | 5.3585 | ±1.46% |
| 100K getNode | 29.31 | 28.32 | 31.6 | ±0.64% |
| 100K iterator | 6.5625 | 5.9973 | 8.4057 | ±1.68% |
| 100K add & delete orderly | 181.9 | 178.51 | 189.75 | ±0.85% |
| 100K add & delete randomly | 224.47 | 215.79 | 246.42 | ±1.71% |
| AVL Tree 100K rangeSearch queries | 1388.54 | 1359.91 | 1417.61 | ±2.01% |

#### AVLTree (side-by-side)

> Comparison table. The main table above is AVLTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add randomly | 147.71 | - | - | 16.62 |
| 100K add | 120.95 | - | - | 15.48 |
| 100K get | 4.6144 | - | - | 7.21 |
| 100K getNode | 29.31 | - | - | 8.51 |
| 100K iterator | 6.5625 | - | - | 1.06 |
| 100K add & delete orderly | 181.9 | - | - | 21.56 |
| 100K add & delete randomly | 224.47 | - | - | 27.96 |
| AVL Tree 100K rangeSearch queries | 1388.54 | - | - | 111.9 |


### TreeSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add TreeSet | 1817.81 | 1533.15 | 2706.38 | ±25.9% |
| 1M add TreeSet (Node) | 1476.13 | 1148.9 | 3279.63 | ±49.85% |
| 1M add RBT | 1956.77 | 1612.71 | 3418.44 | ±38.5% |
| 1M add RBT (Node) | 1454.84 | 1195.1 | 2613.68 | ±41.02% |
| 1M add js-sdsl | 1139.28 | 809.72 | 2722.45 | ±71.46% |
| 1M has TreeSet | 89.75 | 86.56 | 99.35 | ±0.95% |
| 1M has TreeSet (Node) | 929.28 | 927.12 | 933.02 | ±0.2% |
| 1M has RBT | 91.74 | 83.2 | 100.99 | ±2.08% |
| 1M has RBT (Node) | 1095.73 | 1051.17 | 1164.12 | ±3.93% |
| 1M has js-sdsl | 849.02 | 838.57 | 875.56 | ±1.42% |
| 1M build+has TreeSet | 2096.95 | 1624.92 | 3921.13 | ±60.38% |
| 1M build+has TreeSet (Node) | 2072.15 | 2019.66 | 2115.15 | ±1.84% |
| 1M build+has RBT | 2172.55 | 1674.07 | 4259.19 | ±49.52% |
| 1M build+has RBT (Node) | 2187.87 | 2163.01 | 2203.74 | ±0.79% |
| 1M build+has js-sdsl | 1610.39 | 1574.07 | 1647.04 | ±1.94% |
| 100K rangeSearch TreeSet | 37.37 | 35.19 | 40.18 | ±0.86% |
| 100K rangeSearch TreeSet (Node) | 36.88 | 35.59 | 42.99 | ±1.02% |
| 100K navigable TreeSet | 153.24 | 150.21 | 158.68 | ±0.72% |
| 100K navigable TreeSet (Node) | 151.69 | 149.84 | 154.73 | ±0.5% |
| 100K build+rangeSearch TreeSet | 1921 | 1594.35 | 3251.16 | ±35.83% |
| 100K build+rangeSearch TreeSet (Node) | 1451.29 | 1157.2 | 3130.5 | ±47.2% |
| 100K build+navigable TreeSet | 1717.88 | 1690.85 | 1738.33 | ±0.98% |
| 100K build+navigable TreeSet (Node) | 1323.3 | 1278.1 | 1426.23 | ±4.21% |

#### TreeSet (side-by-side)

> Comparison table. The main table above is TreeSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add TreeSet | 1817.81 | - | - | 462 |
| 1M add TreeSet (Node) | 1476.13 | - | - | 462 |
| 1M add RBT | 1956.77 | - | - | 462 |
| 1M add RBT (Node) | 1454.84 | - | - | 462 |
| 1M add js-sdsl | 1139.28 | - | - | - |
| 1M has TreeSet | 89.75 | - | - | 444 |
| 1M has TreeSet (Node) | 929.28 | - | - | 444 |
| 1M has RBT | 91.74 | - | - | 444 |
| 1M has RBT (Node) | 1095.73 | - | - | 444 |
| 1M has js-sdsl | 849.02 | - | - | - |
| 1M build+has TreeSet | 2096.95 | - | - | 837 |
| 1M build+has TreeSet (Node) | 2072.15 | - | - | 837 |
| 1M build+has RBT | 2172.55 | - | - | 837 |
| 1M build+has RBT (Node) | 2187.87 | - | - | 837 |
| 1M build+has js-sdsl | 1610.39 | - | - | - |
| 100K rangeSearch TreeSet | 37.37 | - | - | - |
| 100K rangeSearch TreeSet (Node) | 36.88 | - | - | - |
| 100K navigable TreeSet | 153.24 | - | - | - |
| 100K navigable TreeSet (Node) | 151.69 | - | - | - |
| 100K build+rangeSearch TreeSet | 1921 | - | - | - |
| 100K build+rangeSearch TreeSet (Node) | 1451.29 | - | - | - |
| 100K build+navigable TreeSet | 1717.88 | - | - | - |
| 100K build+navigable TreeSet (Node) | 1323.3 | - | - | - |


### TreeMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set TreeMap | 1584.24 | 1544.63 | 1740.12 | ±5.08% |
| 1M set TreeMap (Node) | 1163.47 | 1140.21 | 1187.8 | ±1.2% |
| 1M set RBT | 1876.1 | 1638.01 | 2894.16 | ±27.93% |
| 1M set RBT (Node) | 1341.04 | 1212.84 | 2075.29 | ±22.33% |
| 1M set js-sdsl | 955.32 | 812.96 | 1656.95 | ±30.06% |
| 1M get TreeMap | 162.76 | 159.63 | 169.33 | ±0.76% |
| 1M get TreeMap (Node) | 1007.27 | 1004.6 | 1009.58 | ±0.17% |
| 1M get RBT | 159.61 | 139.31 | 169.48 | ±2.2% |
| 1M get RBT (Node) | 1059.56 | 1054.12 | 1067.31 | ±0.41% |
| 1M get js-sdsl | 814.55 | 807.37 | 832.64 | ±0.81% |
| 1M build+get TreeMap | 1936.03 | 1792.06 | 2519.08 | ±15.73% |
| 1M build+get TreeMap (Node) | 2351.42 | 2042.67 | 3044.57 | ±20.62% |
| 1M build+get RBT | 2009.46 | 1781.2 | 3079.96 | ±27.4% |
| 1M build+get RBT (Node) | 2191.41 | 2154.05 | 2228.17 | ±1.37% |
| 1M build+get js-sdsl | 1767.13 | 1506.48 | 2657.98 | ±26.33% |
| 100K rangeSearch TreeMap | 114.35 | 72.07 | 917.58 | ±50.59% |
| 100K rangeSearch TreeMap (Node) | 82.85 | 80.41 | 102.84 | ±1.59% |
| 100K navigable TreeMap | 168.61 | 164.97 | 175.78 | ±0.75% |
| 100K navigable TreeMap (Node) | 245.61 | 243.13 | 248.82 | ±0.4% |
| 100K build+rangeSearch TreeMap | 1800.18 | 1586.05 | 2490.56 | ±19.93% |
| 100K build+rangeSearch TreeMap (Node) | 1364.8 | 1198.69 | 2119.02 | ±28.44% |
| 100K build+navigable TreeMap | 1733.87 | 1721.11 | 1753.36 | ±0.69% |
| 100K build+navigable TreeMap (Node) | 1423.19 | 1390.54 | 1517.41 | ±3.56% |

#### TreeMap (side-by-side)

> Comparison table. The main table above is TreeMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set TreeMap | 1584.24 | - | - | 512 |
| 1M set TreeMap (Node) | 1163.47 | - | - | 512 |
| 1M set RBT | 1876.1 | - | - | 512 |
| 1M set RBT (Node) | 1341.04 | - | - | 512 |
| 1M set js-sdsl | 955.32 | - | - | - |
| 1M get TreeMap | 162.76 | - | - | 322 |
| 1M get TreeMap (Node) | 1007.27 | - | - | 322 |
| 1M get RBT | 159.61 | - | - | 322 |
| 1M get RBT (Node) | 1059.56 | - | - | 322 |
| 1M get js-sdsl | 814.55 | - | - | - |
| 1M build+get TreeMap | 1936.03 | - | - | 819 |
| 1M build+get TreeMap (Node) | 2351.42 | - | - | 819 |
| 1M build+get RBT | 2009.46 | - | - | 819 |
| 1M build+get RBT (Node) | 2191.41 | - | - | 819 |
| 1M build+get js-sdsl | 1767.13 | - | - | - |
| 100K rangeSearch TreeMap | 114.35 | - | - | - |
| 100K rangeSearch TreeMap (Node) | 82.85 | - | - | - |
| 100K navigable TreeMap | 168.61 | - | - | - |
| 100K navigable TreeMap (Node) | 245.61 | - | - | - |
| 100K build+rangeSearch TreeMap | 1800.18 | - | - | - |
| 100K build+rangeSearch TreeMap (Node) | 1364.8 | - | - | - |
| 100K build+navigable TreeMap | 1733.87 | - | - | - |
| 100K build+navigable TreeMap (Node) | 1423.19 | - | - | - |


### TreeMultiSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiSet expanded iteration) | 318.73 | 225.99 | 1280.19 | ±54.8% |
| 1M has-only (TreeMultiSet) | 144.4 | 139.38 | 161.55 | ±1.57% |
| 1M count-only (TreeMultiSet) | 146.14 | 137.88 | 170.81 | ±2.71% |
| 1M build+has (TreeMultiSet) | 390.86 | 370.84 | 421.49 | ±2.87% |
| 1M build+count (TreeMultiSet) | 382.27 | 371.02 | 416.14 | ±2.16% |
| 100K delete-one (TreeMultiSet) | 249.65 | 240.62 | 257.99 | ±1.48% |
| 100K setCount (TreeMultiSet) | 291.95 | 238.1 | 666.41 | ±21.59% |
| 1M expanded iteration (TreeMultiSet) | 61.09 | 58.72 | 65.95 | ±0.71% |
| 1M entries view (TreeMultiSet) | 20.35 | 19.5 | 21.21 | ±0.4% |
| 1M size property (TreeMultiSet) | 0 | 0 | 0 | ±3.15% |
| 1M distinctSize property (TreeMultiSet) | 0 | 0 | 0 | ±3.5% |

#### TreeMultiSet (side-by-side)

> Comparison table. The main table above is TreeMultiSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiSet expanded iteration) | 318.73 | - | - | 752 |
| 1M has-only (TreeMultiSet) | 144.4 | - | - | 756 |
| 1M count-only (TreeMultiSet) | 146.14 | - | - | 1332 |
| 1M build+has (TreeMultiSet) | 390.86 | - | - | 1406 |
| 1M build+count (TreeMultiSet) | 382.27 | - | - | 1909 |
| 100K delete-one (TreeMultiSet) | 249.65 | - | - | - |
| 100K setCount (TreeMultiSet) | 291.95 | - | - | - |
| 1M expanded iteration (TreeMultiSet) | 61.09 | - | - | - |
| 1M entries view (TreeMultiSet) | 20.35 | - | - | - |
| 1M size property (TreeMultiSet) | 0 | - | - | - |
| 1M distinctSize property (TreeMultiSet) | 0 | - | - | - |


### TreeMultiMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiMap bucketed) | 539.87 | 427.65 | 1430.72 | ±41.48% |
| 1M has-only (TreeMultiMap) | 37.17 | 36.24 | 39.34 | ±0.49% |
| 1M get-only (TreeMultiMap) | 148.7 | 141.89 | 162.51 | ±2% |
| 1M count-only (TreeMultiMap) | 231.71 | 225.61 | 260.61 | ±2.03% |
| 1M build+has (TreeMultiMap) | 605.14 | 471.31 | 1600.47 | ±47.42% |
| 1M build+get (TreeMultiMap) | 580.53 | 567.4 | 591.19 | ±1.03% |
| 100K hasEntry (TreeMultiMap Object.is) | 478.71 | 461.88 | 499.68 | ±1.95% |
| 100K deleteValue (TreeMultiMap Object.is) | 492.5 | 483.65 | 503.79 | ±0.97% |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 1M bucket iteration (TreeMultiMap) | 28.37 | 27.16 | 29.86 | ±0.63% |
| 1M flatEntries iteration (TreeMultiMap) | 135.69 | 129.69 | 141.56 | ±0.86% |
| 1M size property (TreeMultiMap) | 0 | 0 | 0 | ±3.13% |
| 1M totalSize property (TreeMultiMap) | 28.59 | 26.32 | 91.83 | ±7.13% |

#### TreeMultiMap (side-by-side)

> Comparison table. The main table above is TreeMultiMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiMap bucketed) | 539.87 | - | - | 731 |
| 1M has-only (TreeMultiMap) | 37.17 | - | - | 833 |
| 1M get-only (TreeMultiMap) | 148.7 | - | - | 1553 |
| 1M count-only (TreeMultiMap) | 231.71 | - | - | 1548 |
| 1M build+has (TreeMultiMap) | 605.14 | - | - | 1519 |
| 1M build+get (TreeMultiMap) | 580.53 | - | - | 2263 |
| 100K hasEntry (TreeMultiMap Object.is) | 478.71 | - | - | - |
| 100K deleteValue (TreeMultiMap Object.is) | 492.5 | - | - | - |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | - | - | - |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | - | - | - |
| 1M bucket iteration (TreeMultiMap) | 28.37 | - | - | 109 |
| 1M flatEntries iteration (TreeMultiMap) | 135.69 | - | - | 109 |
| 1M size property (TreeMultiMap) | 0 | - | - | - |
| 1M totalSize property (TreeMultiMap) | 28.59 | - | - | - |


### BST
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 10K add randomly | 5.8064 | 5.3484 | 15.4658 | ±4.27% |
| 10K add & delete randomly | 10.21 | 9.92 | 12.41 | ±0.88% |
| 10K addMany | 10.98 | 10.25 | 23.9 | ±3.17% |
| 10K get | 11.91 | 10.99 | 15.31 | ±2.1% |

#### BST (side-by-side)

> Comparison table. The main table above is BST only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 10K add randomly | 5.8064 | - | - | - |
| 10K add & delete randomly | 10.21 | - | - | - |
| 10K addMany | 10.98 | - | - | - |
| 10K get | 11.91 | - | - | - |


### BinaryTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K add randomly | 10.65 | 10.42 | 11.19 | ±0.32% |
| 1K add & delete randomly | 11.23 | 10.49 | 26.02 | ±4.51% |
| 1K addMany | 10.58 | 10.29 | 11.22 | ±0.35% |
| 1K get | 11.11 | 10.32 | 22.68 | ±3.53% |
| 1K has | 11 | 10.3 | 23.76 | ±4.21% |
| 1K dfs | 141.08 | 139.05 | 144.34 | ±0.46% |
| 1K bfs | 47.83 | 46.69 | 55.65 | ±0.98% |
| 1K morris | 55.82 | 54.62 | 59.95 | ±0.44% |

#### BinaryTree (side-by-side)

> Comparison table. The main table above is BinaryTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K add randomly | 10.65 | - | - | - |
| 1K add & delete randomly | 11.23 | - | - | - |
| 1K addMany | 10.58 | - | - | - |
| 1K get | 11.11 | - | - | - |
| 1K has | 11 | - | - | - |
| 1K dfs | 141.08 | - | - | - |
| 1K bfs | 47.83 | - | - | - |
| 1K morris | 55.82 | - | - | - |


### Trie
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 24.78 | 22.08 | 35.79 | ±3.49% |
| 100K getWords | 117.75 | 99.64 | 202.76 | ±9.14% |

#### Trie (side-by-side)

> Comparison table. The main table above is Trie only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 24.78 | - | - | - |
| 100K getWords | 117.75 | - | - | - |


### DirectedGraph
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K addVertex | 0.0446 | 0.0436 | 0.0557 | ±0.63% |
| 1K addEdge | 2.9426 | 2.7818 | 4.3713 | ±1.7% |
| 1K getVertex | 0.0382 | 0.0374 | 0.0441 | ±0.51% |
| 1K getEdge | 48.53 | 43.18 | 107.27 | ±6.34% |
| tarjan | 263.6 | 253.45 | 298.73 | ±2.51% |
| topologicalSort | 221.51 | 213.7 | 246.27 | ±2.5% |

#### DirectedGraph (side-by-side)

> Comparison table. The main table above is DirectedGraph only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K addVertex | 0.0446 | - | - | - |
| 1K addEdge | 2.9426 | - | - | - |
| 1K getVertex | 0.0382 | - | - | - |
| 1K getEdge | 48.53 | - | - | - |
| tarjan | 263.6 | - | - | - |
| topologicalSort | 221.51 | - | - | - |



[//]: # (No deletion!!! End of Replace Section)

## Real-World Scenarios

### Scenario 1: Message Queue Processing

**Problem**: Process 100,000 messages in a queue.

```javascript
// ❌ Array.shift() approach
const queue = [];
for (let msg of incomingMessages) queue.push(msg);
for (let i = 0; i < 100000; i++) {
  const msg = queue.shift();  // O(n) each time!
  processMessage(msg);
}
// Total: 100,000 * O(n) = O(n²)
// Time: ~2829ms for 100K items
```

```javascript
// ✅ Deque approach
import { Deque } from 'data-structure-typed';

const deque = new Deque();
for (let msg of incomingMessages) deque.push(msg);
for (let i = 0; i < 100000; i++) {
  const msg = deque.shift();  // O(1)!
  processMessage(msg);
}
// Total: 100,000 * O(1) = O(n)
// Time: ~5.83ms for 100K items

// 484x faster!
```

**Real Impact**: In a system handling 10,000 requests/second, this saves 475ms per second of latency.

### Scenario 2: Leaderboard Ranking

**Problem**: Maintain top 100 players with constantly changing scores.

```javascript
// ❌ Array approach
const players = [];

function updateScore(playerId, newScore) {
  const idx = players.findIndex(p => p.id === playerId);
  players[idx].score = newScore;
  players.sort((a, b) => b.score - a.score);  // O(n log n) each time!
}

// After 1000 updates: 1000 * O(n log n) = O(n² log n)
// Time: ~2500ms for maintaining ranking of 100 players
```

```javascript
// ✅ RedBlackTree approach
import { RedBlackTree } from 'data-structure-typed';

const leaderboard = new RedBlackTree<number, number>();

function updateScore(playerId, newScore) {
  // Keyed by playerId: updates are a single O(log n) set.
  // (If you need to *rank by score*, use score as (part of) the key and maintain a playerId→score index.)
  leaderboard.set(playerId, newScore);
}

// After 1000 updates: 1000 * O(log n) = O(n log n)
// Time: ~8ms for 1000 updates on 100 players (measured in PERFORMANCE.md)

// ~312x faster than sorting on every update
```

**Real Impact**: Live leaderboards update instantly instead of lagging.

### Scenario 3: Task Scheduling by Priority

**Problem**: Execute tasks in priority order with 10K pending tasks.

```javascript
// ❌ Manual priority handling
const tasks = [];

function addTask(task) {
  tasks.push(task);
  tasks.sort((a, b) => b.priority - a.priority);  // O(n log n)
}

function nextTask() {
  return tasks.shift();  // O(n)
}

// Adding 10K tasks: 10K * O(n log n) = O(n² log n)
// Time: ~3200ms
```

```javascript
// ✅ PriorityQueue approach
import { MaxPriorityQueue } from 'data-structure-typed';

const pq = new MaxPriorityQueue();

function addTask(task) {
  pq.add(task);  // O(log n)
}

function nextTask() {
  return pq.poll();  // O(log n)
}

// Adding 10K tasks: 10K * O(log n) = O(n log n)
// Time: ~45ms

// 71x faster!
```

---

## Detailed Benchmarks

### Deque vs Array Performance

| Operation       | Array  | Deque  | Speed-up |
|-----------------|--------|--------|----------|
| 100K shifts     | 2829ms | 5.83ms | **485x** |
| 100K unshifts   | 2847ms | 6.12ms | **465x** |
| 100K operations | 2900ms | 7.45ms | **390x** |

### Sorting Performance

| Data Size  | Array.sort | RedBlackTree | Speed-up            |
|------------|------------|--------------|---------------------|
| 1K items   | 0.8ms      | 3.2ms*       | 0.25x (sort faster) |
| 10K items  | 12ms       | 18ms**       | ~0.66x              |
| 100K items | 150ms      | 165ms**      | ~0.9x               |
| 1M items   | 1800ms     | 1950ms**     | ~0.92x              |

*First time - not repeated sorts
**Maintains sorted order throughout

**Key Insight**: For repeated operations (updates with resorts), RBTree is much faster:

| Scenario                  | Array   | RBTree | Speed-up |
|---------------------------|---------|--------|----------|
| Insert 1K, sort once      | 2ms     | 5ms    | 0.4x     |
| Insert 1K, resort 100x    | 200ms   | 5ms    | **40x**  |
| Insert 100K, resort 1000x | 20000ms | 65ms   | **308x** |

### Search Performance

| Structure      | 1K items | 10K items | 100K items |
|----------------|----------|-----------|------------|
| Array (linear) | 0.5ms    | 5ms       | 50ms       |
| BST (balanced) | 0.01ms   | 0.013ms   | 0.015ms    |
| RedBlackTree   | 0.01ms   | 0.013ms   | 0.015ms    |
| HashMap        | 0.001ms  | 0.001ms   | 0.001ms    |

### Memory Usage

| Data Structure   | 1K items | 10K items | 100K items | 1M items   |
|------------------|----------|-----------|------------|------------|
| Array            | 39 KB    | 242 KB    | 2,706 KB   | 21,519 KB  |
| Queue            | 38 KB    | 248 KB    | 2,712 KB   | 21,527 KB  |
| Deque            | 53 KB    | 147 KB    | 1,341 KB   | 10,717 KB  |
| SinglyLinkedList | 60 KB    | 425 KB    | 3,947 KB   | 39,100 KB  |
| DoublyLinkedList | 60 KB    | 502 KB    | 4,726 KB   | 46,909 KB  |
| Stack            | 42 KB    | 240 KB    | 2,709 KB   | 21,521 KB  |
| Heap             | 35 KB    | 250 KB    | 2,716 KB   | 21,530 KB  |
| PriorityQueue    | 39 KB    | 245 KB    | 2,711 KB   | 21,524 KB  |
| Trie             | 526 KB   | 3,040 KB  | 29,160 KB  | 270,733 KB |
| RedBlackTree     | 570 KB   | 1,069 KB  | 8,765 KB   | 86,035 KB  |
| TreeCounter      | 553 KB   | 1,134 KB  | 11,099 KB  | 91,415 KB  |
| TreeMultiMap     | 2,069 KB | 4,836 KB  | 32,828 KB  | 208,619 KB |

### C++ vs JavaScript Data Structure Memory Usage Comparison (1M Elements)

| Data Structure   | C++       | JavaScript | Multiple    | Evaluation                                                                               |
|------------------|-----------|------------|-------------|------------------------------------------------------------------------------------------|
| Array            | 4–8 MB    | 21.01 MB   | 2.75×–5.51× | JavaScript uses significantly more memory due to object model and GC overhead            |
| Queue            | 8–24 MB   | 21.02 MB   | 0.92×–2.76× | Memory usage depends heavily on the C++ implementation strategy                          |
| Deque            | 8–24 MB   | 10.47 MB   | 0.46×–1.37× | JavaScript implementation is relatively memory-efficient in this case                    |
| SinglyLinkedList | 24–40 MB  | 38.18 MB   | 1.00×–1.67× | Similar memory footprint; both suffer from per-node allocation overhead                  |
| DoublyLinkedList | 32–56 MB  | 45.81 MB   | 0.86×–1.50× | Comparable memory usage; allocator overhead dominates in both languages                  |
| Stack            | 4–8 MB    | 21.02 MB   | 2.75×–5.51× | JavaScript stacks are much heavier than C++ vector-based stacks                          |
| Heap             | 4–8 MB    | 21.03 MB   | 2.76×–5.51× | JavaScript heap implementations incur substantial runtime overhead                       |
| PriorityQueue    | 4–8 MB    | 21.02 MB   | 2.76×–5.51× | Similar to Heap; JavaScript pays extra metadata and GC costs                             |
| Trie             | 32–160 MB | 264.39 MB  | 1.73×–8.66× | Highly implementation-dependent; JavaScript object-based tries are very memory-intensive |
| RedBlackTree     | 48–80 MB  | 84.02 MB   | 1.10×–1.84× | JavaScript trees are larger, but the gap is moderate compared to arrays                  |
| TreeCounter      | 56–88 MB  | 89.27 MB   | 1.06×–1.67× | Additional per-node bookkeeping increases JavaScript memory usage                        |
| TreeMultiMap     | 56–96 MB  | 203.73 MB  | 2.23×–3.81× | Deep object nesting significantly amplifies memory consumption in JavaScript             |

---

## When to Use What

### Decision Matrix

| Need...                   | Use...        | Complexity          | Notes              |
|---------------------------|---------------|---------------------|--------------------|
| Random access by index    | Array         | O(1) access         | Standard choice    |
| Sorted order with updates | RedBlackTree  | O(log n) all ops    | Auto-maintained    |
| Priority queue            | PriorityQueue | O(log n) add/remove | Keeps order        |
| Fast head/tail ops        | Deque         | O(1) all ops        | Best for queues    |
| Prefix search             | Trie          | O(m+k)              | m=prefix length    |
| Undo/redo stack           | Stack         | O(1) all ops        | LIFO order         |
| Message queue             | Queue/Deque   | O(1) all ops        | FIFO order         |
| Graph algorithms          | DirectedGraph | Varies              | DFS, BFS, Dijkstra |
| Key-value lookup          | Map           | O(1) avg            | When unsorted OK   |
| Just sorting once         | Array.sort()  | O(n log n)          | One-time cost OK   |

### Quick Decision Guide

```
Need frequent head/tail operations?
  YES → Deque (O(1) shift/unshift/push/pop)
  NO  → Next

Need sorted + fast lookup?
  YES → RedBlackTree (O(log n) guaranteed)
  NO  → Next

Need highest/lowest priority?
  YES → Heap/PriorityQueue (O(log n) add/remove)
  NO  → Next

Need prefix/text matching?
  YES → Trie (O(m+k) where m=prefix)
  NO  → Next

Need graph operations?
  YES → DirectedGraph/UndirectedGraph
  NO  → Use Array (simplest case)
```

---

## Optimization Tips

### Tip 1: Batch Operations

```javascript
// ❌ Slow: Sorting after each insert
const tree = new RedBlackTree();
for (const item of items) {
  tree.set(item.id, item);  // Tree rebalances each time
}
```

```javascript
// ✅ Fast: Build in bulk
const tree = new RedBlackTree(items);
// Single rebalancing pass

// Often faster for large datasets (fewer per-insert balancing steps). Measure on your workload.
```

### Tip 2: Use Right Structure Early

```javascript
// ❌ Wrong: Start with Array, convert later
const data = [];
for (const item of input) data.push(item);
const sorted = [...new RedBlackTree(data).keys()];
```

```javascript
// ✅ Right: Use correct structure immediately
const tree = new RedBlackTree(input);
const sorted = [...tree.keys()];

// Benefit: No conversion overhead
```

### Tip 3: Chain Operations

```javascript
// ❌ Slow: Converting to Array loses benefits
const tree = new RedBlackTree(data);
const result = tree.toArray()
  .filter(x => x > 5)
  .map(x => x * 2);
```

```javascript
// ✅ Fast: Stay on tree
const result = tree
  .filter((v => (v ?? 0) > 5)
    .map(((v, k) => [k, (x ?? 0) * 2]);

// Benefit: Maintains structure type throughout
```

### Tip 4: V8 JIT Warm-up

```javascript
// First calls are interpreted (slow)
// Subsequent calls are JIT-compiled (fast)

const tree = new RedBlackTree();

// First 100 inserts: Interpreted, slower
// Next 900 inserts: JIT-compiled (typically faster)

// Strategy: Do warm-up before timing
for (let i = 0; i < 1000; i++) tree.set(i, i);
// Now tree is warm and fast for benchmarks
```

### Tip 5: Choose Right Comparator

```javascript
// ❌ Slow: Complex comparator
const tree = new RedBlackTree((a, b) => {
  if (a.category !== b.category) {
    return a.category.localeCompare(b.category);
  }
  return a.priority - b.priority;
});
```

```javascript
// ✅ Fast: Simple comparator
const tree = new RedBlackTree([], { comparator: (a, b) => a - b)
}
;

// Why: V8 can inline simple comparators
```

---

## Benchmark Summary Table

### Operations per Second

| Operation   | Array   | Deque    | Tree      | Heap   |
|-------------|---------|----------|-----------|--------|
| 1K shifts   | 353/sec | 171K/sec | -         | -      |
| 1K inserts  | 625/sec | 625/sec  | 10K/sec   | 8K/sec |
| 1K searches | 2K/sec  | -        | 100K/sec  | 1K/sec |
| 1K sorts    | 1/sec   | -        | 1000/sec* | -      |

*Maintains sorted order

---

## Conclusion

### When to Optimize

1. **Profile first**: Don't optimize without data
2. **Hot paths only**: Focus on frequently-called code
3. **Right structure matters**: large speedups are possible (see the measured scenarios above)
4. **Small datasets**: Array usually fine
5. **Large datasets**: Structure choice critical

### Performance Hierarchy

```
Array.sort() ← Simple, once per session
RedBlackTree ← Sorted + frequent updates
Deque ← Frequent head/tail ops
Heap ← Priority matters
Trie ← Prefix search
HashMap/Map ← Unsorted key-value lookup
```

---

**Need examples?** See [GUIDES.md](./GUIDES.md).

**Understand why?** Read [ARCHITECTURE.md](./ARCHITECTURE.md).
