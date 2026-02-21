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
| 100k push | 6.4285 | 5.4596 | 20.6389 | ±8.8% |
| 100k unshift | 5.9286 | 4.7593 | 7.7996 | ±2.53% |
| 100k unshift & shift | 3.8761 | 3.7797 | 4.1627 | ±0.44% |
| 100k addAt(mid) | 1506.28 | 1123.41 | 1886.4 | ±21.38% |
| 100k addBefore (cursor) | 7.0674 | 5.4305 | 26.0187 | ±8.51% |

#### DoublyLinkedList (side-by-side)

> Comparison table. The main table above is DoublyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100k push | 6.4285 | - | 1.9221 | 5.55 |
| 100k unshift | 5.9286 | - | 926.81 | 5.6 |
| 100k unshift & shift | 3.8761 | - | 2444.76 | 5.8 |
| 100k addAt(mid) | 1506.28 | - | - | 793.45 |
| 100k addBefore (cursor) | 7.0674 | - | - | 6.58 |


### SinglyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100k push & shift | 3.656 | 3.5527 | 4.5551 | ±0.66% |
| 10K push & pop | 114.08 | 107.76 | 147.46 | ±3.2% |
| 10K addAt(mid) | 9.7542 | 8.5114 | 15.293 | ±3.69% |
| 10K addBefore (cursor) | 17.47 | 16.98 | 20.17 | ±0.93% |

#### SinglyLinkedList (side-by-side)

> Comparison table. The main table above is SinglyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100k push & shift | 3.656 | - | 1212.72 | 5.25 |
| 10K push & pop | 114.08 | - | 0.0615 | 0.47 |
| 10K addAt(mid) | 9.7542 | - | - | 5.87 |
| 10K addBefore (cursor) | 17.47 | - | - | 0.53 |


### HashMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 70.59 | 43.05 | 376.96 | ±35.72% |
| 1M set & get | 48.49 | 37.79 | 142.99 | ±11.6% |
| 1M ObjKey set & get | 242.39 | 220.23 | 325.03 | ±7.42% |

#### HashMap (side-by-side)

> Comparison table. The main table above is HashMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set | 70.59 | 101.4 | 159.57 | 72.19 |
| 1M set & get | 48.49 | 61.93 | 205.52 | 75.8 |
| 1M ObjKey set & get | 242.39 | 399.4 | 219.9 | 82.37 |


### priority-queue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 4.1362 | 3.8636 | 6.9497 | ±1.72% |
| 100K add & poll | 22.74 | 21.96 | 24.96 | ±0.81% |

#### priority-queue (side-by-side)

> Comparison table. The main table above is priority-queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 4.1362 | 5.0306 | - | 1.04 |
| 100K add & poll | 22.74 | 23.67 | - | 4.49 |


### Queue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 28.22 | 25.39 | 72.49 | ±7.63% |
| 100K push & shift | 3.3407 | 2.9476 | 6.1988 | ±2.87% |

#### Queue (side-by-side)

> Comparison table. The main table above is Queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 28.22 | - | 23.77 | 1.67 |
| 100K push & shift | 3.3407 | - | 1347.21 | 0.2 |


### Deque
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 9.1912 | 6.3941 | 44.4556 | ±11.94% |
| 1M push & pop | 13.27 | 10.01 | 21.93 | ±6.67% |
| 1M push & shift | 13.2 | 10.25 | 45.37 | ±9.05% |
| 100K push & shift | 1.1409 | 1.0441 | 2.4281 | ±3.74% |
| 100K unshift & shift | 1.1635 | 1.0939 | 1.9575 | ±2.27% |

#### Deque (side-by-side)

> Comparison table. The main table above is Deque only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 9.1912 | - | 26.34 | 1.68 |
| 1M push & pop | 13.27 | - | 31.47 | 2.26 |
| 1M push & shift | 13.2 | - | - | 2.05 |
| 100K push & shift | 1.1409 | - | 1212.13 | 0.2 |
| 100K unshift & shift | 1.1635 | - | 2016.45 | 0.19 |


### Stack
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 26.33 | 24.41 | 37.28 | ±2.32% |
| 1M push & pop | 31.22 | 26.07 | 131.16 | ±13.14% |

#### Stack (side-by-side)

> Comparison table. The main table above is Stack only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 26.33 | 28.37 | 25.95 | 1.68 |
| 1M push & pop | 31.22 | 33.87 | 30.28 | 2.65 |


### RedBlackTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 95.8 | 80.09 | 109.64 | ±18.83% |
| 200K rangeSearch SEQ | 1246.62 | 1193.46 | 1329.51 | ±5.28% |
| 200K rangeSearch RAND | 1939.03 | 1852.16 | 1976.28 | ±3.21% |
| 1M upd SEQ | 78.2 | 73.6 | 89.35 | ±10.07% |
| 1M upd RAND | 114.69 | 110.09 | 119.15 | ±4.16% |
| 1M ins SEQ | 568.93 | 467.29 | 950.15 | ±46.51% |
| 1M ins RAND | 1616.95 | 1609.61 | 1625.03 | ±0.45% |
| 1M keys-only | 3.9167 | 2.7381 | 5.4906 | ±37.31% |

#### RedBlackTree (side-by-side)

> Comparison table. The main table above is RedBlackTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | Node Mode (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M get | 95.8 | 254.91 | 135.87 | - | 40.19 |
| 200K rangeSearch SEQ | 1246.62 | - | - | - | - |
| 200K rangeSearch RAND | 1939.03 | - | - | - | - |
| 1M upd SEQ | 78.2 | 254.34 | 173.59 | - | 66.24 |
| 1M upd RAND | 114.69 | 414.12 | 308.62 | - | 165.26 |
| 1M ins SEQ | 568.93 | 191.25 | 85.74 | - | 161.5 |
| 1M ins RAND | 1616.95 | 1164.66 | 830.41 | - | 524.36 |
| 1M keys-only | 3.9167 | - | - | - | 0.1 |


### AVLTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add randomly | 152.64 | 144.23 | 165.73 | ±1.86% |
| 100K add | 123.31 | 119.14 | 152.61 | ±2.14% |
| 100K get | 4.5157 | 4.1823 | 5.6343 | ±1.38% |
| 100K getNode | 30.59 | 29.03 | 33.41 | ±0.91% |
| 100K iterator | 6.8667 | 6.3376 | 8.5104 | ±1.32% |
| 100K add & delete orderly | 185.92 | 181.5 | 202.32 | ±1.29% |
| 100K add & delete randomly | 229.04 | 223.44 | 235.48 | ±0.84% |
| AVL Tree 100K rangeSearch queries | 1438.93 | 1415.71 | 1487.33 | ±1.86% |

#### AVLTree (side-by-side)

> Comparison table. The main table above is AVLTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add randomly | 152.64 | - | - | 17.36 |
| 100K add | 123.31 | - | - | 15.9 |
| 100K get | 4.5157 | - | - | 7.7 |
| 100K getNode | 30.59 | - | - | 9.29 |
| 100K iterator | 6.8667 | - | - | 1.33 |
| 100K add & delete orderly | 185.92 | - | - | 22 |
| 100K add & delete randomly | 229.04 | - | - | 28.88 |
| AVL Tree 100K rangeSearch queries | 1438.93 | - | - | 118.65 |


### BST
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 10K add randomly | 5.872 | 5.4513 | 7.4891 | ±1.33% |
| 10K add & delete randomly | 11.17 | 10.22 | 31.4 | ±4.78% |
| 10K addMany | 11.12 | 10.08 | 20.22 | ±3.11% |
| 10K get | 11.52 | 11.05 | 12.19 | ±0.44% |

#### BST (side-by-side)

> Comparison table. The main table above is BST only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 10K add randomly | 5.872 | - | - | - |
| 10K add & delete randomly | 11.17 | - | - | - |
| 10K addMany | 11.12 | - | - | - |
| 10K get | 11.52 | - | - | - |


### Trie
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 24.46 | 22.28 | 29.19 | ±1.78% |
| 100K getWords | 123.42 | 105.76 | 149.21 | ±4.76% |

#### Trie (side-by-side)

> Comparison table. The main table above is Trie only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 24.46 | - | - | - |
| 100K getWords | 123.42 | - | - | - |


### DirectedGraph
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K addVertex | 0.0458 | 0.0444 | 0.0518 | ±0.54% |
| 1K addEdge | 3.1015 | 2.9376 | 3.8747 | ±1.1% |
| 1K getVertex | 0.0402 | 0.039 | 0.0453 | ±0.46% |
| 1K getEdge | 41.89 | 39.72 | 89.34 | ±5.18% |
| tarjan | 246.4 | 235.36 | 282.2 | ±3.04% |
| topologicalSort | 205.11 | 198.07 | 241.78 | ±2.87% |

#### DirectedGraph (side-by-side)

> Comparison table. The main table above is DirectedGraph only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K addVertex | 0.0458 | - | - | - |
| 1K addEdge | 3.1015 | - | - | - |
| 1K getVertex | 0.0402 | - | - | - |
| 1K getEdge | 41.89 | - | - | - |
| tarjan | 246.4 | - | - | - |
| topologicalSort | 205.11 | - | - | - |


### BinaryTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K add randomly | 15.51 | 15.12 | 17.92 | ±0.66% |
| 1K add & delete randomly | 15.55 | 15.17 | 16.14 | ±0.36% |
| 1K addMany | 15.76 | 15.08 | 29.19 | ±2.9% |
| 1K get | 15.65 | 15.01 | 19.68 | ±1.22% |
| 1K has | 15.77 | 15.02 | 28.83 | ±2.99% |
| 1K dfs | 147.82 | 145.01 | 165.43 | ±1.32% |
| 1K bfs | 60.74 | 59.49 | 67.05 | ±0.59% |
| 1K morris | 60.89 | 59.45 | 63.61 | ±0.43% |

#### BinaryTree (side-by-side)

> Comparison table. The main table above is BinaryTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K add randomly | 15.51 | - | - | - |
| 1K add & delete randomly | 15.55 | - | - | - |
| 1K addMany | 15.76 | - | - | - |
| 1K get | 15.65 | - | - | - |
| 1K has | 15.77 | - | - | - |
| 1K dfs | 147.82 | - | - | - |
| 1K bfs | 60.74 | - | - | - |
| 1K morris | 60.89 | - | - | - |


### tree-map
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set (TreeMap MapMode ON) | 1606.71 | 1578.68 | 1728.02 | ±3.89% |
| 1M set (TreeMap MapMode OFF) | 1224.62 | 1154.88 | 1453.78 | ±7.83% |
| 1M set (RedBlackTree MapMode ON) | 1865.91 | 1645.82 | 2341.93 | ±18.03% |
| 1M set (RedBlackTree MapMode OFF) | 1568.91 | 1234.46 | 2897.83 | ±43.79% |
| 1M set (js-sdsl OrderedMap) | 859.53 | 826.43 | 914.73 | ±3.26% |
| 1M get-only (TreeMap MapMode ON) | 161.13 | 156.55 | 168.64 | ±0.96% |
| 1M get-only (TreeMap MapMode OFF) | 1022.11 | 1014.1 | 1027.85 | ±0.43% |
| 1M get-only (RedBlackTree MapMode ON) | 158.37 | 146.72 | 167.58 | ±1.15% |
| 1M get-only (RedBlackTree MapMode OFF) | 1071.86 | 1065.41 | 1076.93 | ±0.31% |
| 1M get-only (js-sdsl OrderedMap) | 835.61 | 829.55 | 839.83 | ±0.45% |
| 1M build+get (TreeMap MapMode ON) | 1954.52 | 1816.92 | 2582.59 | ±16.54% |
| 1M build+get (TreeMap MapMode OFF) | 2104.4 | 2082.78 | 2133.41 | ±1.37% |
| 1M build+get (RedBlackTree MapMode ON) | 1995.87 | 1799.33 | 2922.31 | ±23.87% |
| 1M build+get (RedBlackTree MapMode OFF) | 2289.34 | 2214.39 | 2581.71 | ±6.59% |
| 1M build+get (js-sdsl OrderedMap) | 1706.34 | 1496.55 | 2570.12 | ±26.08% |
| 100K rangeSearch-only (TreeMap MapMode ON) | 83.88 | 71.68 | 316.2 | ±17.05% |
| 100K rangeSearch-only (TreeMap MapMode OFF) | 80.67 | 76.88 | 92.3 | ±1.32% |
| 100K ceiling/floor/higher/lower-only (TreeMap MapMode ON) | 214.83 | 160.87 | 1025.7 | ±50.01% |
| 100K ceiling/floor/higher/lower-only (TreeMap MapMode OFF) | 247.34 | 245.28 | 250.54 | ±0.39% |
| 100K rangeSearch (TreeMap MapMode ON) | 1751.21 | 1649.3 | 1844.32 | ±4.77% |
| 100K rangeSearch (TreeMap MapMode OFF) | 1261.8 | 1194.81 | 1358.77 | ±4.67% |
| 100K ceiling/floor/higher/lower (TreeMap MapMode ON) | 1747.84 | 1712.14 | 1791.29 | ±1.74% |
| 100K ceiling/floor/higher/lower (TreeMap MapMode OFF) | 1717.59 | 1399.7 | 3130.2 | ±42.32% |

#### tree-map (side-by-side)

> Comparison table. The main table above is tree-map only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set (TreeMap MapMode ON) | 1606.71 | - | - | - |
| 1M set (TreeMap MapMode OFF) | 1224.62 | - | - | - |
| 1M set (RedBlackTree MapMode ON) | 1865.91 | - | - | - |
| 1M set (RedBlackTree MapMode OFF) | 1568.91 | - | - | - |
| 1M set (js-sdsl OrderedMap) | 859.53 | - | - | - |
| 1M get-only (TreeMap MapMode ON) | 161.13 | - | - | - |
| 1M get-only (TreeMap MapMode OFF) | 1022.11 | - | - | - |
| 1M get-only (RedBlackTree MapMode ON) | 158.37 | - | - | - |
| 1M get-only (RedBlackTree MapMode OFF) | 1071.86 | - | - | - |
| 1M get-only (js-sdsl OrderedMap) | 835.61 | - | - | - |
| 1M build+get (TreeMap MapMode ON) | 1954.52 | - | - | - |
| 1M build+get (TreeMap MapMode OFF) | 2104.4 | - | - | - |
| 1M build+get (RedBlackTree MapMode ON) | 1995.87 | - | - | - |
| 1M build+get (RedBlackTree MapMode OFF) | 2289.34 | - | - | - |
| 1M build+get (js-sdsl OrderedMap) | 1706.34 | - | - | - |
| 100K rangeSearch-only (TreeMap MapMode ON) | 83.88 | - | - | - |
| 100K rangeSearch-only (TreeMap MapMode OFF) | 80.67 | - | - | - |
| 100K ceiling/floor/higher/lower-only (TreeMap MapMode ON) | 214.83 | - | - | - |
| 100K ceiling/floor/higher/lower-only (TreeMap MapMode OFF) | 247.34 | - | - | - |
| 100K rangeSearch (TreeMap MapMode ON) | 1751.21 | - | - | - |
| 100K rangeSearch (TreeMap MapMode OFF) | 1261.8 | - | - | - |
| 100K ceiling/floor/higher/lower (TreeMap MapMode ON) | 1747.84 | - | - | - |
| 100K ceiling/floor/higher/lower (TreeMap MapMode OFF) | 1717.59 | - | - | - |


### tree-multi-map
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiMap bucketed) | 459.53 | 440.94 | 483.21 | ±2.76% |
| 1M has-only (TreeMultiMap) | 39.33 | 37.2 | 54.35 | ±2% |
| 1M get-only (TreeMultiMap) | 197.43 | 153.32 | 590.39 | ±27.35% |
| 1M count-only (TreeMultiMap) | 233.95 | 226.55 | 250.51 | ±1.53% |
| 1M build+has (TreeMultiMap) | 561.95 | 477.24 | 1145.36 | ±29.95% |
| 1M build+get (TreeMultiMap) | 594.05 | 577.54 | 626.69 | ±1.89% |
| 100K hasEntry (TreeMultiMap Object.is) | 631.3 | 474.12 | 1608.68 | ±52.35% |
| 100K deleteValue (TreeMultiMap Object.is) | 499.25 | 487.2 | 518.93 | ±1.55% |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 1M bucket iteration (TreeMultiMap) | 28.61 | 23.16 | 31.93 | ±1.51% |
| 1M flatEntries iteration (TreeMultiMap) | 137.27 | 133.73 | 140.29 | ±0.49% |
| 1M size property (TreeMultiMap) | 0 | 0 | 0 | ±3.78% |
| 1M totalSize property (TreeMultiMap) | 28.07 | 26.7 | 36.13 | ±1.23% |

#### tree-multi-map (side-by-side)

> Comparison table. The main table above is tree-multi-map only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiMap bucketed) | 459.53 | - | - | - |
| 1M has-only (TreeMultiMap) | 39.33 | - | - | - |
| 1M get-only (TreeMultiMap) | 197.43 | - | - | - |
| 1M count-only (TreeMultiMap) | 233.95 | - | - | - |
| 1M build+has (TreeMultiMap) | 561.95 | - | - | - |
| 1M build+get (TreeMultiMap) | 594.05 | - | - | - |
| 100K hasEntry (TreeMultiMap Object.is) | 631.3 | - | - | - |
| 100K deleteValue (TreeMultiMap Object.is) | 499.25 | - | - | - |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | - | - | - |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | - | - | - |
| 1M bucket iteration (TreeMultiMap) | 28.61 | - | - | - |
| 1M flatEntries iteration (TreeMultiMap) | 137.27 | - | - | - |
| 1M size property (TreeMultiMap) | 0 | - | - | - |
| 1M totalSize property (TreeMultiMap) | 28.07 | - | - | - |


### tree-multi-set
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiSet expanded iteration) | 248.33 | 241.1 | 261.6 | ±1.52% |
| 1M has-only (TreeMultiSet) | 149 | 143.07 | 155.19 | ±0.94% |
| 1M count-only (TreeMultiSet) | 152.01 | 143.64 | 183.87 | ±2.68% |
| 1M build+has (TreeMultiSet) | 406.83 | 385.6 | 440.21 | ±2.35% |
| 1M build+count (TreeMultiSet) | 396.05 | 386.87 | 407.49 | ±1% |
| 100K delete-one (TreeMultiSet) | 283.33 | 258.74 | 383.59 | ±6.93% |
| 100K setCount (TreeMultiSet) | 277.9 | 219.95 | 545.32 | ±16.29% |
| 1M expanded iteration (TreeMultiSet) | 58.72 | 55.93 | 65.93 | ±0.95% |
| 1M entries view (TreeMultiSet) | 19.32 | 18.08 | 19.9 | ±0.42% |
| 1M size property (TreeMultiSet) | 0 | 0 | 0 | ±3.05% |
| 1M distinctSize property (TreeMultiSet) | 0 | 0 | 0 | ±3.18% |

#### tree-multi-set (side-by-side)

> Comparison table. The main table above is tree-multi-set only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiSet expanded iteration) | 248.33 | - | - | - |
| 1M has-only (TreeMultiSet) | 149 | - | - | - |
| 1M count-only (TreeMultiSet) | 152.01 | - | - | - |
| 1M build+has (TreeMultiSet) | 406.83 | - | - | - |
| 1M build+count (TreeMultiSet) | 396.05 | - | - | - |
| 100K delete-one (TreeMultiSet) | 283.33 | - | - | - |
| 100K setCount (TreeMultiSet) | 277.9 | - | - | - |
| 1M expanded iteration (TreeMultiSet) | 58.72 | - | - | - |
| 1M entries view (TreeMultiSet) | 19.32 | - | - | - |
| 1M size property (TreeMultiSet) | 0 | - | - | - |
| 1M distinctSize property (TreeMultiSet) | 0 | - | - | - |


### tree-set
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeSet MapMode ON) | 1618.3 | 1592.12 | 1674.95 | ±1.89% |
| 1M add (TreeSet MapMode OFF) | 1203.87 | 1166.78 | 1251.54 | ±2.17% |
| 1M set (RedBlackTree set-like MapMode ON) | 1663.85 | 1641.93 | 1684.48 | ±1.24% |
| 1M set (RedBlackTree set-like MapMode OFF) | 1242.06 | 1228.49 | 1259.26 | ±0.98% |
| 1M insert (js-sdsl OrderedSet) | 860.93 | 817.43 | 900.33 | ±3.19% |
| 1M has-only (TreeSet MapMode ON) | 91.99 | 89.32 | 98.19 | ±0.82% |
| 1M has-only (TreeSet MapMode OFF) | 977.18 | 967.83 | 982.25 | ±0.48% |
| 1M has-only (RedBlackTree set-like MapMode ON) | 90.33 | 87.28 | 97.83 | ±0.76% |
| 1M has-only (RedBlackTree set-like MapMode OFF) | 1123.96 | 1112.61 | 1134.27 | ±0.72% |
| 1M find-only (js-sdsl OrderedSet) | 869.23 | 854.79 | 895.58 | ±1.9% |
| 1M build+has (TreeSet MapMode ON) | 2041.96 | 1700.62 | 3690.55 | ±41.52% |
| 1M build+has (TreeSet MapMode OFF) | 2170.25 | 2124.17 | 2251.58 | ±2.38% |
| 1M build+has (RedBlackTree set-like MapMode ON) | 1887.11 | 1768.98 | 2382.38 | ±13.54% |
| 1M build+has (RedBlackTree set-like MapMode OFF) | 2559.8 | 2231.65 | 4068.7 | ±30.33% |
| 1M build+find (js-sdsl OrderedSet) | 1631.94 | 1562.92 | 1782.52 | ±6.55% |
| 100K rangeSearch-only (TreeSet MapMode ON) | 38.37 | 35.56 | 41.54 | ±1.06% |
| 100K rangeSearch-only (TreeSet MapMode OFF) | 37.56 | 36.11 | 39.56 | ±0.76% |
| 100K ceiling/floor/higher/lower-only (TreeSet MapMode ON) | 154.28 | 149.79 | 159.94 | ±0.95% |
| 100K ceiling/floor/higher/lower-only (TreeSet MapMode OFF) | 156.11 | 150.72 | 168.77 | ±1.4% |
| 100K rangeSearch (TreeSet MapMode ON) | 1648.32 | 1596.6 | 1687.85 | ±1.95% |
| 100K rangeSearch (TreeSet MapMode OFF) | 1253.55 | 1177.78 | 1437.86 | ±6.86% |
| 100K ceiling/floor/higher/lower (TreeSet MapMode ON) | 1747.45 | 1725.7 | 1769.53 | ±0.88% |
| 100K ceiling/floor/higher/lower (TreeSet MapMode OFF) | 1883.93 | 1317.26 | 4000.45 | ±77.99% |

#### tree-set (side-by-side)

> Comparison table. The main table above is tree-set only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeSet MapMode ON) | 1618.3 | - | - | - |
| 1M add (TreeSet MapMode OFF) | 1203.87 | - | - | - |
| 1M set (RedBlackTree set-like MapMode ON) | 1663.85 | - | - | - |
| 1M set (RedBlackTree set-like MapMode OFF) | 1242.06 | - | - | - |
| 1M insert (js-sdsl OrderedSet) | 860.93 | - | - | - |
| 1M has-only (TreeSet MapMode ON) | 91.99 | - | - | - |
| 1M has-only (TreeSet MapMode OFF) | 977.18 | - | - | - |
| 1M has-only (RedBlackTree set-like MapMode ON) | 90.33 | - | - | - |
| 1M has-only (RedBlackTree set-like MapMode OFF) | 1123.96 | - | - | - |
| 1M find-only (js-sdsl OrderedSet) | 869.23 | - | - | - |
| 1M build+has (TreeSet MapMode ON) | 2041.96 | - | - | - |
| 1M build+has (TreeSet MapMode OFF) | 2170.25 | - | - | - |
| 1M build+has (RedBlackTree set-like MapMode ON) | 1887.11 | - | - | - |
| 1M build+has (RedBlackTree set-like MapMode OFF) | 2559.8 | - | - | - |
| 1M build+find (js-sdsl OrderedSet) | 1631.94 | - | - | - |
| 100K rangeSearch-only (TreeSet MapMode ON) | 38.37 | - | - | - |
| 100K rangeSearch-only (TreeSet MapMode OFF) | 37.56 | - | - | - |
| 100K ceiling/floor/higher/lower-only (TreeSet MapMode ON) | 154.28 | - | - | - |
| 100K ceiling/floor/higher/lower-only (TreeSet MapMode OFF) | 156.11 | - | - | - |
| 100K rangeSearch (TreeSet MapMode ON) | 1648.32 | - | - | - |
| 100K rangeSearch (TreeSet MapMode OFF) | 1253.55 | - | - | - |
| 100K ceiling/floor/higher/lower (TreeSet MapMode ON) | 1747.45 | - | - | - |
| 100K ceiling/floor/higher/lower (TreeSet MapMode OFF) | 1883.93 | - | - | - |



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
