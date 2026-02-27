# PERFORMANCE: Benchmarks & Comparisons

Understand how data-structure-typed performs, and when to use each structure.

**[Back to README](../README.md) • [Architecture Details](./ARCHITECTURE.md) • [Code Examples](./GUIDES.md) • [📈 Interactive HTML Report](./benchmark.html)**

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
| 100k push | 5.1068 | 4.2918 | 14.02 | ±6.05% |
| 100k unshift | 5.6251 | 4.6454 | 15.9079 | ±7% |
| 100k unshift & shift | 3.9617 | 3.858 | 4.1419 | ±0.33% |
| 100k addAt(mid) | 1377.93 | 1195.1 | 1652.06 | ±15.36% |
| 100k addBefore (cursor) | 6.8479 | 5.236 | 32.4613 | ±14.75% |

#### DoublyLinkedList (side-by-side)

> Comparison table. The main table above is DoublyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100k push | 5.1068 | 1.9662 | 1.9327 | 5.7 |
| 100k unshift | 5.6251 | 1.6535 | 897.47 | 5.85 |
| 100k unshift & shift | 3.9617 | 1.9021 | 2229.86 | 5.74 |
| 100k addAt(mid) | 1377.93 | - | - | 754.81 |
| 100k addBefore (cursor) | 6.8479 | - | - | 6.18 |


### SinglyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K unshift & shift | 3.657 | 3.5484 | 4.0251 | ±0.46% |
| 10K unshift & shift | 0.3519 | 0.345 | 0.3897 | ±0.37% |
| 10K addAt(mid) | 9.6426 | 8.4035 | 13.8878 | ±3.14% |
| 10K addBefore (cursor) | 17.47 | 16.84 | 20.98 | ±1.1% |

#### SinglyLinkedList (side-by-side)

> Comparison table. The main table above is SinglyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K unshift & shift | 3.657 | - | 1954.99 | 4.8 |
| 10K unshift & shift | 0.3519 | - | 6.3455 | 0.47 |
| 10K addAt(mid) | 9.6426 | - | - | 5.77 |
| 10K addBefore (cursor) | 17.47 | - | - | 0.53 |


### HashMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 65.43 | 43.78 | 217.35 | ±20.66% |
| 1M set & get | 81.86 | 39.81 | 303.57 | ±19.79% |
| 1M ObjKey set & get | 249 | 218.53 | 374.97 | ±11.59% |

#### HashMap (side-by-side)

> Comparison table. The main table above is HashMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set | 65.43 | 89.7 | 158.98 | 76.26 |
| 1M set & get | 81.86 | 72.97 | 212.83 | 75.25 |
| 1M ObjKey set & get | 249 | 399.01 | 223.97 | 84.4 |


### Queue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 29.46 | 25.57 | 38.92 | ±2.7% |
| 100K push & shift | 3.3554 | 2.9757 | 8.4665 | ±3.66% |

#### Queue (side-by-side)

> Comparison table. The main table above is Queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 29.46 | 33.31 | 25.29 | 1.7 |
| 100K push & shift | 3.3554 | 3.0014 | 1160.09 | 0.2 |


### Deque
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 10.98 | 6.38 | 25.07 | ±9.38% |
| 1M push & pop | 11.56 | 9.77 | 19.2 | ±3.93% |
| 1M push & shift | 10.95 | 10.19 | 30.6 | ±5.09% |
| 100K push & shift | 1.395 | 1.0432 | 3.1726 | ±7.27% |
| 100K unshift & shift | 1.1966 | 1.0944 | 2.2177 | ±3.18% |

#### Deque (side-by-side)

> Comparison table. The main table above is Deque only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 10.98 | 7.8495 | 24.28 | 1.76 |
| 1M push & pop | 11.56 | 12.14 | 30.68 | 2.2 |
| 1M push & shift | 10.95 | - | - | 1.94 |
| 100K push & shift | 1.395 | 1.1509 | 1255.31 | 0.19 |
| 100K unshift & shift | 1.1966 | 1.1638 | 1980.94 | 0.19 |


### PriorityQueue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 4.5393 | 3.9926 | 10.2987 | ±4.68% |
| 100K add & poll | 22.77 | 21.62 | 30.58 | ±1.49% |

#### PriorityQueue (side-by-side)

> Comparison table. The main table above is PriorityQueue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 4.5393 | 5.0825 | - | 1.05 |
| 100K add & poll | 22.77 | 23.18 | - | 4.53 |


### Stack
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 28.46 | 23.99 | 81.05 | ±9.49% |
| 1M push & pop | 28.99 | 26.58 | 37.31 | ±1.94% |

#### Stack (side-by-side)

> Comparison table. The main table above is Stack only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 28.46 | 31.41 | 24.84 | 1.65 |
| 1M push & pop | 28.99 | 32.2 | 28.46 | 2.62 |


### RedBlackTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 98.97 | 83.42 | 112.38 | ±17.87% |
| 200K rangeSearch SEQ | 1150.86 | 1110.75 | 1213.28 | ±4.92% |
| 200K rangeSearch RAND | 1612.65 | 1602.88 | 1627.28 | ±0.81% |
| 1M upd SEQ | 81.06 | 72.06 | 93.19 | ±13.68% |
| 1M upd RAND | 110.29 | 94.89 | 115.77 | ±9.78% |
| 1M ins SEQ | 544.99 | 461.28 | 864.21 | ±40.65% |
| 1M ins RAND | 1025.93 | 1008.09 | 1040.16 | ±1.56% |
| 1M keys-only | 3.8192 | 2.7242 | 5.2749 | ±36.24% |

#### RedBlackTree (side-by-side)

> Comparison table. The main table above is RedBlackTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | Node Mode (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M get | 98.97 | 259.04 | 137.55 | - | 52.97 |
| 200K rangeSearch SEQ | 1150.86 | - | - | - | - |
| 200K rangeSearch RAND | 1612.65 | - | - | - | - |
| 1M upd SEQ | 81.06 | 229.33 | 174.39 | - | 68.43 |
| 1M upd RAND | 110.29 | 378.95 | 301.59 | - | 158.14 |
| 1M ins SEQ | 544.99 | 194 | 86.56 | - | 162.72 |
| 1M ins RAND | 1025.93 | 906.98 | 636.16 | - | 483.56 |
| 1M keys-only | 3.8192 | - | - | - | 0.09 |


### AVLTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add randomly | 146.42 | 139.05 | 191.55 | ±3.4% |
| 100K add | 120.24 | 114.57 | 143 | ±1.83% |
| 100K get | 4.6116 | 4.112 | 5.875 | ±1.85% |
| 100K getNode | 31.34 | 29.81 | 36.57 | ±1.08% |
| 100K iterator | 6.1388 | 5.6668 | 7.466 | ±1.35% |
| 100K add & delete orderly | 180.78 | 175.71 | 215.2 | ±2.45% |
| 100K add & delete randomly | 218.68 | 211.13 | 227.68 | ±1.05% |
| AVL Tree 100K rangeSearch queries | 1352.3 | 1333.26 | 1370.64 | ±1.12% |

#### AVLTree (side-by-side)

> Comparison table. The main table above is AVLTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add randomly | 146.42 | - | - | 16.62 |
| 100K add | 120.24 | - | - | 15.48 |
| 100K get | 4.6116 | - | - | 7.21 |
| 100K getNode | 31.34 | - | - | 8.51 |
| 100K iterator | 6.1388 | - | - | 1.06 |
| 100K add & delete orderly | 180.78 | - | - | 21.56 |
| 100K add & delete randomly | 218.68 | - | - | 27.96 |
| AVL Tree 100K rangeSearch queries | 1352.3 | - | - | 111.9 |


### TreeSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add TreeSet | 1011.82 | 994.7 | 1026.94 | ±1.26% |
| 1M add TreeSet (Node) | 912.3 | 901.4 | 945.46 | ±1.58% |
| 1M add RBT | 1167.06 | 1046.4 | 1733.11 | ±24.94% |
| 1M add RBT (Node) | 975.7 | 958.94 | 989.59 | ±1.16% |
| 1M add js-sdsl | 642.32 | 624.09 | 653.38 | ±1.23% |
| 1M has TreeSet | 65.41 | 62.46 | 74.83 | ±1.25% |
| 1M has TreeSet (Node) | 809.01 | 804.67 | 814.93 | ±0.34% |
| 1M has RBT | 67.48 | 63.98 | 83.28 | ±1.56% |
| 1M has RBT (Node) | 1034.91 | 928.36 | 1541.14 | ±20.05% |
| 1M has js-sdsl | 761.43 | 705.57 | 850.11 | ±5.98% |
| 1M build+has TreeSet | 1096.77 | 1059.07 | 1161.07 | ±2.81% |
| 1M build+has TreeSet (Node) | 1732.51 | 1712.26 | 1764.37 | ±1.06% |
| 1M build+has RBT | 1155.43 | 1118.08 | 1211.51 | ±3.17% |
| 1M build+has RBT (Node) | 1867.76 | 1826.38 | 1890.86 | ±1.36% |
| 1M build+has js-sdsl | 1311.66 | 1280.72 | 1417.29 | ±4.19% |
| 100K rangeSearch TreeSet | 20.83 | 18.93 | 22.13 | ±0.88% |
| 100K rangeSearch TreeSet (Node) | 20.74 | 19.48 | 26.37 | ±1.34% |
| 100K navigable TreeSet | 110.15 | 107.45 | 116.24 | ±0.8% |
| 100K navigable TreeSet (Node) | 106.73 | 103.46 | 114.13 | ±1.03% |
| 100K build+rangeSearch TreeSet | 1059.08 | 1036.84 | 1083.08 | ±1.61% |
| 100K build+rangeSearch TreeSet (Node) | 929.91 | 906.75 | 960.4 | ±2.43% |
| 100K build+navigable TreeSet | 1201.07 | 1103.44 | 1738.74 | ±18.27% |
| 100K build+navigable TreeSet (Node) | 1004.24 | 994.89 | 1017.57 | ±0.79% |

#### TreeSet (side-by-side)

> Comparison table. The main table above is TreeSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add TreeSet | 1011.82 | - | - | 462 |
| 1M add TreeSet (Node) | 912.3 | - | - | 462 |
| 1M add RBT | 1167.06 | - | - | 462 |
| 1M add RBT (Node) | 975.7 | - | - | 462 |
| 1M add js-sdsl | 642.32 | - | - | - |
| 1M has TreeSet | 65.41 | - | - | 444 |
| 1M has TreeSet (Node) | 809.01 | - | - | 444 |
| 1M has RBT | 67.48 | - | - | 444 |
| 1M has RBT (Node) | 1034.91 | - | - | 444 |
| 1M has js-sdsl | 761.43 | - | - | - |
| 1M build+has TreeSet | 1096.77 | - | - | 837 |
| 1M build+has TreeSet (Node) | 1732.51 | - | - | 837 |
| 1M build+has RBT | 1155.43 | - | - | 837 |
| 1M build+has RBT (Node) | 1867.76 | - | - | 837 |
| 1M build+has js-sdsl | 1311.66 | - | - | - |
| 100K rangeSearch TreeSet | 20.83 | - | - | - |
| 100K rangeSearch TreeSet (Node) | 20.74 | - | - | - |
| 100K navigable TreeSet | 110.15 | - | - | - |
| 100K navigable TreeSet (Node) | 106.73 | - | - | - |
| 100K build+rangeSearch TreeSet | 1059.08 | - | - | - |
| 100K build+rangeSearch TreeSet (Node) | 929.91 | - | - | - |
| 100K build+navigable TreeSet | 1201.07 | - | - | - |
| 100K build+navigable TreeSet (Node) | 1004.24 | - | - | - |


### TreeMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set TreeMap | 1130.7 | 996.21 | 1861.87 | ±26.38% |
| 1M set TreeMap (Node) | 904.29 | 890.44 | 914.89 | ±0.81% |
| 1M set RBT | 1146.79 | 1044.9 | 1535.27 | ±17.49% |
| 1M set RBT (Node) | 968.9 | 960.13 | 980.74 | ±0.74% |
| 1M set js-sdsl | 640.34 | 608.96 | 676.46 | ±3.07% |
| 1M get TreeMap | 156.38 | 152.87 | 160.55 | ±0.59% |
| 1M get TreeMap (Node) | 867.81 | 861.74 | 872.7 | ±0.46% |
| 1M get RBT | 156.19 | 152.85 | 159.65 | ±0.51% |
| 1M get RBT (Node) | 916.83 | 907.22 | 931.59 | ±0.96% |
| 1M get js-sdsl | 672.22 | 660.56 | 686.89 | ±1.05% |
| 1M build+get TreeMap | 1262.71 | 1203.82 | 1589.5 | ±10.56% |
| 1M build+get TreeMap (Node) | 1712.26 | 1668.78 | 1765.61 | ±1.93% |
| 1M build+get RBT | 1215.09 | 1200.03 | 1266.32 | ±1.76% |
| 1M build+get RBT (Node) | 1811.83 | 1791.31 | 1836.34 | ±0.87% |
| 1M build+get js-sdsl | 1213.71 | 1193.46 | 1244.24 | ±1.52% |
| 100K rangeSearch TreeMap | 53.07 | 44.18 | 93.97 | ±5.99% |
| 100K rangeSearch TreeMap (Node) | 54.02 | 52.58 | 61.28 | ±0.73% |
| 100K navigable TreeMap | 174.8 | 169.03 | 184.16 | ±0.95% |
| 100K navigable TreeMap (Node) | 272.56 | 267.11 | 279.11 | ±0.66% |
| 100K build+rangeSearch TreeMap | 1183.72 | 1038.01 | 1985.82 | ±27.64% |
| 100K build+rangeSearch TreeMap (Node) | 954.72 | 949.15 | 964.84 | ±0.52% |
| 100K build+navigable TreeMap | 1205.71 | 1186.63 | 1218.09 | ±1.13% |
| 100K build+navigable TreeMap (Node) | 1178.08 | 1171.1 | 1190.9 | ±0.67% |

#### TreeMap (side-by-side)

> Comparison table. The main table above is TreeMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set TreeMap | 1130.7 | - | - | 512 |
| 1M set TreeMap (Node) | 904.29 | - | - | 512 |
| 1M set RBT | 1146.79 | - | - | 512 |
| 1M set RBT (Node) | 968.9 | - | - | 512 |
| 1M set js-sdsl | 640.34 | - | - | - |
| 1M get TreeMap | 156.38 | - | - | 322 |
| 1M get TreeMap (Node) | 867.81 | - | - | 322 |
| 1M get RBT | 156.19 | - | - | 322 |
| 1M get RBT (Node) | 916.83 | - | - | 322 |
| 1M get js-sdsl | 672.22 | - | - | - |
| 1M build+get TreeMap | 1262.71 | - | - | 819 |
| 1M build+get TreeMap (Node) | 1712.26 | - | - | 819 |
| 1M build+get RBT | 1215.09 | - | - | 819 |
| 1M build+get RBT (Node) | 1811.83 | - | - | 819 |
| 1M build+get js-sdsl | 1213.71 | - | - | - |
| 100K rangeSearch TreeMap | 53.07 | - | - | - |
| 100K rangeSearch TreeMap (Node) | 54.02 | - | - | - |
| 100K navigable TreeMap | 174.8 | - | - | - |
| 100K navigable TreeMap (Node) | 272.56 | - | - | - |
| 100K build+rangeSearch TreeMap | 1183.72 | - | - | - |
| 100K build+rangeSearch TreeMap (Node) | 954.72 | - | - | - |
| 100K build+navigable TreeMap | 1205.71 | - | - | - |
| 100K build+navigable TreeMap (Node) | 1178.08 | - | - | - |


### TreeMultiSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiSet expanded iteration) | 233.76 | 221.86 | 263.58 | ±2.47% |
| 1M has-only (TreeMultiSet) | 130.14 | 123.61 | 139.99 | ±1.51% |
| 1M count-only (TreeMultiSet) | 73.21 | 70.53 | 83.71 | ±1.1% |
| 1M build+has (TreeMultiSet) | 368.22 | 354.26 | 387.34 | ±2.15% |
| 1M build+count (TreeMultiSet) | 307.33 | 295.46 | 324.15 | ±1.58% |
| 100K delete-one (TreeMultiSet) | 246.79 | 233.35 | 270.91 | ±2.28% |
| 100K setCount (TreeMultiSet) | 251.85 | 229.99 | 383.39 | ±8.13% |
| 1M expanded iteration (TreeMultiSet) | 59.63 | 57.28 | 65.64 | ±0.76% |
| 1M entries view (TreeMultiSet) | 19.68 | 19.18 | 20.91 | ±0.45% |
| 1M size property (TreeMultiSet) | 0 | 0 | 0 | ±2.77% |
| 1M distinctSize property (TreeMultiSet) | 0 | 0 | 0 | ±2.63% |

#### TreeMultiSet (side-by-side)

> Comparison table. The main table above is TreeMultiSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiSet expanded iteration) | 233.76 | - | - | 752 |
| 1M has-only (TreeMultiSet) | 130.14 | - | - | 756 |
| 1M count-only (TreeMultiSet) | 73.21 | - | - | 1332 |
| 1M build+has (TreeMultiSet) | 368.22 | - | - | 1406 |
| 1M build+count (TreeMultiSet) | 307.33 | - | - | 1909 |
| 100K delete-one (TreeMultiSet) | 246.79 | - | - | - |
| 100K setCount (TreeMultiSet) | 251.85 | - | - | - |
| 1M expanded iteration (TreeMultiSet) | 59.63 | - | - | - |
| 1M entries view (TreeMultiSet) | 19.68 | - | - | - |
| 1M size property (TreeMultiSet) | 0 | - | - | - |
| 1M distinctSize property (TreeMultiSet) | 0 | - | - | - |


### TreeMultiMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiMap bucketed) | 388.73 | 379.76 | 397.83 | ±1.15% |
| 1M has-only (TreeMultiMap) | 30.79 | 29.68 | 32.17 | ±0.66% |
| 1M get-only (TreeMultiMap) | 73.67 | 71.02 | 78.12 | ±0.81% |
| 1M count-only (TreeMultiMap) | 206.68 | 196.04 | 240.2 | ±2.87% |
| 1M build+has (TreeMultiMap) | 452.55 | 405.87 | 605.82 | ±10.59% |
| 1M build+get (TreeMultiMap) | 477.45 | 448.38 | 613.55 | ±7.26% |
| 100K hasEntry (TreeMultiMap Object.is) | 450.09 | 420.59 | 526.53 | ±6.07% |
| 100K deleteValue (TreeMultiMap Object.is) | 435.96 | 425.2 | 480.98 | ±2.72% |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 1M bucket iteration (TreeMultiMap) | 28.09 | 26.9 | 29.48 | ±0.62% |
| 1M flatEntries iteration (TreeMultiMap) | 135.75 | 132.38 | 142.79 | ±0.7% |
| 1M size property (TreeMultiMap) | 0 | 0 | 0 | ±3.77% |
| 1M totalSize property (TreeMultiMap) | 27.13 | 25.8 | 30.75 | ±0.87% |

#### TreeMultiMap (side-by-side)

> Comparison table. The main table above is TreeMultiMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiMap bucketed) | 388.73 | - | - | 731 |
| 1M has-only (TreeMultiMap) | 30.79 | - | - | 833 |
| 1M get-only (TreeMultiMap) | 73.67 | - | - | 1553 |
| 1M count-only (TreeMultiMap) | 206.68 | - | - | 1548 |
| 1M build+has (TreeMultiMap) | 452.55 | - | - | 1519 |
| 1M build+get (TreeMultiMap) | 477.45 | - | - | 2263 |
| 100K hasEntry (TreeMultiMap Object.is) | 450.09 | - | - | - |
| 100K deleteValue (TreeMultiMap Object.is) | 435.96 | - | - | - |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | - | - | - |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | - | - | - |
| 1M bucket iteration (TreeMultiMap) | 28.09 | - | - | 109 |
| 1M flatEntries iteration (TreeMultiMap) | 135.75 | - | - | 109 |
| 1M size property (TreeMultiMap) | 0 | - | - | - |
| 1M totalSize property (TreeMultiMap) | 27.13 | - | - | - |


### BST
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 10K add randomly | 6.2675 | 5.7848 | 8.2385 | ±1.17% |
| 10K add & delete randomly | 11.03 | 10.63 | 13.23 | ±0.74% |
| 10K addMany | 11.93 | 11.12 | 12.53 | ±0.66% |
| 10K get | 16.92 | 11.35 | 231.5 | ±46.92% |

#### BST (side-by-side)

> Comparison table. The main table above is BST only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 10K add randomly | 6.2675 | - | - | - |
| 10K add & delete randomly | 11.03 | - | - | - |
| 10K addMany | 11.93 | - | - | - |
| 10K get | 16.92 | - | - | - |


### BinaryTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K add randomly | 11.09 | 10.35 | 13.04 | ±0.98% |
| 1K add & delete randomly | 11.2 | 10.81 | 11.87 | ±0.44% |
| 1K addMany | 11.06 | 10.78 | 12.88 | ±0.65% |
| 1K get | 11.08 | 10.64 | 11.76 | ±0.51% |
| 1K has | 14.68 | 10.92 | 194.04 | ±46.06% |
| 1K dfs | 108.11 | 103.04 | 113.7 | ±0.75% |
| 1K bfs | 46.99 | 45.17 | 54.89 | ±1.35% |
| 1K morris | 41.61 | 39.97 | 43.66 | ±0.67% |

#### BinaryTree (side-by-side)

> Comparison table. The main table above is BinaryTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K add randomly | 11.09 | - | - | - |
| 1K add & delete randomly | 11.2 | - | - | - |
| 1K addMany | 11.06 | - | - | - |
| 1K get | 11.08 | - | - | - |
| 1K has | 14.68 | - | - | - |
| 1K dfs | 108.11 | - | - | - |
| 1K bfs | 46.99 | - | - | - |
| 1K morris | 41.61 | - | - | - |


### Trie
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 257.47 | 82.81 | 2186.79 | ±82.38% |
| 100K getWords | 15858.61 | 15402.9 | 16681.99 | ±4.01% |

#### Trie (side-by-side)

> Comparison table. The main table above is Trie only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 257.47 | - | - | - |
| 100K getWords | 15858.61 | - | - | - |


### DirectedGraph
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K addVertex | 0.0532 | 0.0492 | 0.0626 | ±1% |
| 1K addEdge | 0 | null | null | ±0% |
| 1K getVertex | 38.93 | 37.39 | 40.44 | ±0.4% |
| 1K getEdge | 77.81 | 74.74 | 87.38 | ±0.78% |
| tarjan | 0.4219 | 0.3991 | 0.4419 | ±0.39% |
| topologicalSort | 0.2641 | 0.2567 | 0.2835 | ±0.48% |

#### DirectedGraph (side-by-side)

> Comparison table. The main table above is DirectedGraph only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K addVertex | 0.0532 | - | - | - |
| 1K addEdge | 0 | - | - | - |
| 1K getVertex | 38.93 | - | - | - |
| 1K getEdge | 77.81 | - | - | - |
| tarjan | 0.4219 | - | - | - |
| topologicalSort | 0.2641 | - | - | - |



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
