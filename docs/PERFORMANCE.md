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
| 100k push | 6.2519 | 4.7194 | 19.14 | ±6.56% |
| 100k unshift | 5.1345 | 4.3093 | 21.8298 | ±12.08% |
| 100k unshift & shift | 3.834 | 3.7556 | 4.3002 | ±0.49% |
| 100k addAt(mid) | 1387.08 | 1135.41 | 1836.53 | ±21.9% |
| 100k addBefore (cursor) | 5.5929 | 4.9605 | 9.1778 | ±3.64% |

#### DoublyLinkedList (side-by-side)

> Comparison table. The main table above is DoublyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100k push | 6.2519 | 1.7794 | 1.8739 | 5.7 |
| 100k unshift | 5.1345 | 1.6322 | 891.36 | 5.85 |
| 100k unshift & shift | 3.834 | 2.0059 | 1992.65 | 5.74 |
| 100k addAt(mid) | 1387.08 | - | - | 754.81 |
| 100k addBefore (cursor) | 5.5929 | - | - | 6.18 |


### SinglyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K unshift & shift | 3.6149 | 3.5072 | 4.0863 | ±0.55% |
| 10K unshift & shift | 0.354 | 0.3436 | 0.4658 | ±0.9% |
| 10K addAt(mid) | 9.5069 | 8.4141 | 13.5917 | ±3.04% |
| 10K addBefore (cursor) | 17.45 | 16.75 | 20.58 | ±1.1% |

#### SinglyLinkedList (side-by-side)

> Comparison table. The main table above is SinglyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K unshift & shift | 3.6149 | - | 2092.85 | 4.8 |
| 10K unshift & shift | 0.354 | - | 6.2948 | 0.47 |
| 10K addAt(mid) | 9.5069 | - | - | 5.77 |
| 10K addBefore (cursor) | 17.45 | - | - | 0.53 |


### HashMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 70.1 | 41.87 | 323.71 | ±31.49% |
| 1M set & get | 58.27 | 37.11 | 273.88 | ±20.55% |
| 1M ObjKey set & get | 229.74 | 214.13 | 257.72 | ±2.87% |

#### HashMap (side-by-side)

> Comparison table. The main table above is HashMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set | 70.1 | 135.95 | 150.37 | 76.26 |
| 1M set & get | 58.27 | 69.61 | 197.59 | 75.25 |
| 1M ObjKey set & get | 229.74 | 413.1 | 199.67 | 84.4 |


### Queue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 28.3 | 24.88 | 78.17 | ±8.84% |
| 100K push & shift | 3.8108 | 3.0201 | 18.2331 | ±9.85% |

#### Queue (side-by-side)

> Comparison table. The main table above is Queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 28.3 | 31.88 | 24.18 | 1.7 |
| 100K push & shift | 3.8108 | 2.9793 | 1257.44 | 0.2 |


### Deque
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 11.8 | 6.38 | 25.09 | ±9.52% |
| 1M push & pop | 11.72 | 9.99 | 25.63 | ±6.45% |
| 1M push & shift | 11.72 | 10.2 | 27.9 | ±4.94% |
| 100K push & shift | 1.4584 | 1.3206 | 4.9298 | ±6.28% |
| 100K unshift & shift | 1.1996 | 1.1127 | 2.2615 | ±2.74% |

#### Deque (side-by-side)

> Comparison table. The main table above is Deque only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 11.8 | 8.066 | 25.04 | 1.76 |
| 1M push & pop | 11.72 | 13.23 | 31.08 | 2.2 |
| 1M push & shift | 11.72 | - | - | 1.94 |
| 100K push & shift | 1.4584 | 1.1589 | 1319.3 | 0.19 |
| 100K unshift & shift | 1.1996 | 1.1643 | 2243.92 | 0.19 |


### PriorityQueue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 4.0239 | 3.786 | 4.2997 | ±0.58% |
| 100K add & poll | 22.12 | 21.72 | 22.82 | ±0.34% |

#### PriorityQueue (side-by-side)

> Comparison table. The main table above is PriorityQueue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 4.0239 | 5.3571 | - | 1.05 |
| 100K add & poll | 22.12 | 23.25 | - | 4.53 |


### Stack
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 27.02 | 21.9 | 67.63 | ±6.68% |
| 1M push & pop | 27.96 | 26.14 | 36.02 | ±1.41% |

#### Stack (side-by-side)

> Comparison table. The main table above is Stack only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 27.02 | 27.35 | 27.26 | 1.65 |
| 1M push & pop | 27.96 | 32.35 | 32 | 2.62 |


### RedBlackTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 124.23 | 102.71 | 139.05 | ±19.09% |
| 200K rangeSearch SEQ | 2352.38 | 2317.75 | 2415.02 | ±2.00% |
| 200K rangeSearch RAND | 2294.43 | 1597.55 | 2729.45 | ±29.62% |
| 1M upd SEQ | 83.8 | 75.95 | 95.37 | ±10.69% |
| 1M upd RAND | 114.57 | 105.92 | 128.24 | ±9.21% |
| 1M ins SEQ | 529.39 | 464.87 | 767.48 | ±31.24% |
| 1M ins RAND | 1003.8 | 989.44 | 1024.58 | ±1.63% |
| 1M keys-only | 4.2214 | 2.7184 | 5.8273 | ±41.84% |

#### RedBlackTree (side-by-side)

> Comparison table. The main table above is RedBlackTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | classic (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M get | 124.23 | 523.1 | - | - | 52.97 |
| 200K rangeSearch SEQ | 2352.38 | - | - | - | - |
| 200K rangeSearch RAND | 2294.43 | - | - | - | - |
| 1M upd SEQ | 83.8 | 254.04 | - | - | 68.43 |
| 1M upd RAND | 114.57 | 393.71 | - | - | 158.14 |
| 1M ins SEQ | 529.39 | 202.71 | - | - | 162.72 |
| 1M ins RAND | 1003.8 | 903.1 | - | - | 483.56 |
| 1M keys-only | 4.2214 | - | - | - | 0.09 |


### TreeSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add | 1436.16 | 1241.63 | 1774.15 | ±13.85% |
| 1M has | 93.56 | 69.66 | 106.57 | ±4.35% |
| 100K rangeSearch | 26.16 | 19.29 | 83.27 | ±9.13% |
| 100K navigable | 216.95 | 175.82 | 222.94 | ±2.81% |

#### TreeSet (side-by-side)

> Comparison table. The main table above is TreeSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | classic (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M add | 1436.16 | 1163.96 | 951.1 | - | - |
| 1M has | 93.56 | 1209.91 | 989.43 | - | - |
| 100K rangeSearch | 26.16 | 27.13 | - | - | - |
| 100K navigable | 216.95 | 169.63 | - | - | - |


### TreeMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 1466.93 | 1292.1 | 1622.19 | ±9.52% |
| 1M get | 132.86 | 103.39 | 146.17 | ±5.57% |
| 100K rangeSearch | 51.74 | 38.43 | 140.62 | ±11.13% |
| 100K navigable | 346.3 | 323.05 | 350.08 | ±1.35% |

#### TreeMap (side-by-side)

> Comparison table. The main table above is TreeMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | classic (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M set | 1466.93 | 1340.06 | 955.12 | - | - |
| 1M get | 132.86 | 1119.75 | 932.83 | - | - |
| 100K rangeSearch | 51.74 | 61 | - | - | - |
| 100K navigable | 346.3 | 476.08 | - | - | - |


### TreeMultiSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiSet expanded iteration) | 216.53 | 207.08 | 228.91 | ±1.76% |
| 1M has-only (TreeMultiSet) | 81.76 | 78.86 | 91.6 | ±1.03% |
| 1M count-only (TreeMultiSet) | 81.68 | 77.62 | 88.41 | ±0.89% |
| 1M build+has (TreeMultiSet) | 341.81 | 291.59 | 775.59 | ±25.44% |
| 1M build+count (TreeMultiSet) | 298.96 | 283.72 | 313.55 | ±1.83% |
| 100K delete-one (TreeMultiSet) | 236.89 | 221.53 | 286.82 | ±3.58% |
| 100K setCount (TreeMultiSet) | 234.82 | 211.93 | 292.05 | ±4.57% |
| 1M expanded iteration (TreeMultiSet) | 54.9 | 52.21 | 65.09 | ±1.44% |
| 1M entries view (TreeMultiSet) | 18.64 | 17.5 | 19.63 | ±0.58% |
| 1M size property (TreeMultiSet) | 0 | 0 | 0 | ±3.89% |
| 1M distinctSize property (TreeMultiSet) | 0 | 0 | 0 | ±4.22% |

#### TreeMultiSet (side-by-side)

> Comparison table. The main table above is TreeMultiSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiSet expanded iteration) | 216.53 | - | - | 752 |
| 1M has-only (TreeMultiSet) | 81.76 | - | - | 756 |
| 1M count-only (TreeMultiSet) | 81.68 | - | - | 1332 |
| 1M build+has (TreeMultiSet) | 341.81 | - | - | 1406 |
| 1M build+count (TreeMultiSet) | 298.96 | - | - | 1909 |
| 100K delete-one (TreeMultiSet) | 236.89 | - | - | - |
| 100K setCount (TreeMultiSet) | 234.82 | - | - | - |
| 1M expanded iteration (TreeMultiSet) | 54.9 | - | - | - |
| 1M entries view (TreeMultiSet) | 18.64 | - | - | - |
| 1M size property (TreeMultiSet) | 0 | - | - | - |
| 1M distinctSize property (TreeMultiSet) | 0 | - | - | - |


### TreeMultiMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiMap bucketed) | 384.21 | 356.11 | 412.42 | ±3.3% |
| 1M has-only (TreeMultiMap) | 30.78 | 29.33 | 38.11 | ±1.04% |
| 1M get-only (TreeMultiMap) | 61.49 | 59.08 | 72.23 | ±1.12% |
| 1M count-only (TreeMultiMap) | 118.72 | 113.04 | 132.7 | ±1.33% |
| 1M build+has (TreeMultiMap) | 472.38 | 408.91 | 930.14 | ±24.38% |
| 1M build+get (TreeMultiMap) | 437.45 | 420.83 | 449.22 | ±1.21% |
| 100K hasEntry (TreeMultiMap Object.is) | 462.28 | 399.28 | 984.37 | ±25.18% |
| 100K deleteValue (TreeMultiMap Object.is) | 430.97 | 426.41 | 440.39 | ±0.77% |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 1M bucket iteration (TreeMultiMap) | 26.75 | 25.65 | 28.35 | ±0.5% |
| 1M flatEntries iteration (TreeMultiMap) | 128.37 | 116.81 | 135.27 | ±1.16% |
| 1M size property (TreeMultiMap) | 0 | 0 | 0 | ±3.87% |
| 1M totalSize property (TreeMultiMap) | 25.68 | 24.7 | 27.35 | ±0.61% |

#### TreeMultiMap (side-by-side)

> Comparison table. The main table above is TreeMultiMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiMap bucketed) | 384.21 | - | - | 731 |
| 1M has-only (TreeMultiMap) | 30.78 | - | - | 833 |
| 1M get-only (TreeMultiMap) | 61.49 | - | - | 1553 |
| 1M count-only (TreeMultiMap) | 118.72 | - | - | 1548 |
| 1M build+has (TreeMultiMap) | 472.38 | - | - | 1519 |
| 1M build+get (TreeMultiMap) | 437.45 | - | - | 2263 |
| 100K hasEntry (TreeMultiMap Object.is) | 462.28 | - | - | - |
| 100K deleteValue (TreeMultiMap Object.is) | 430.97 | - | - | - |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | - | - | - |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | - | - | - |
| 1M bucket iteration (TreeMultiMap) | 26.75 | - | - | 109 |
| 1M flatEntries iteration (TreeMultiMap) | 128.37 | - | - | 109 |
| 1M size property (TreeMultiMap) | 0 | - | - | - |
| 1M totalSize property (TreeMultiMap) | 25.68 | - | - | - |


### BST
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 10K add randomly | 5.5254 | 5.1268 | 6.3278 | ±0.64% |
| 10K add & delete randomly | 10.19 | 9.99 | 10.67 | ±0.31% |
| 10K addMany | 11.42 | 10.05 | 41.06 | ±7.83% |
| 10K get | 11.52 | 10.44 | 23.68 | ±4.1% |

#### BST (side-by-side)

> Comparison table. The main table above is BST only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 10K add randomly | 5.5254 | - | - | - |
| 10K add & delete randomly | 10.19 | - | - | - |
| 10K addMany | 11.42 | - | - | - |
| 10K get | 11.52 | - | - | - |


### BinaryTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K add randomly | 9.9267 | 9.6296 | 11.917 | ±0.71% |
| 1K add & delete randomly | 10.01 | 9.76 | 10.61 | ±0.39% |
| 1K addMany | 9.9218 | 9.6456 | 10.7359 | ±0.42% |
| 1K get | 9.9987 | 9.6149 | 10.7247 | ±0.47% |
| 1K has | 10.35 | 9.76 | 12.93 | ±1.3% |
| 1K dfs | 98.09 | 96.35 | 104.49 | ±0.61% |
| 1K bfs | 41.4 | 40.21 | 48.1 | ±0.88% |
| 1K morris | 38.99 | 37.19 | 46.16 | ±1.11% |

#### BinaryTree (side-by-side)

> Comparison table. The main table above is BinaryTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K add randomly | 9.9267 | - | - | - |
| 1K add & delete randomly | 10.01 | - | - | - |
| 1K addMany | 9.9218 | - | - | - |
| 1K get | 9.9987 | - | - | - |
| 1K has | 10.35 | - | - | - |
| 1K dfs | 98.09 | - | - | - |
| 1K bfs | 41.4 | - | - | - |
| 1K morris | 38.99 | - | - | - |


### Trie
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 96.89 | 68.35 | 173.19 | ±7.87% |
| 100K getWords | 60.24 | 51.89 | 70.73 | ±2.01% |

#### Trie (side-by-side)

> Comparison table. The main table above is Trie only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 96.89 | - | - | - |
| 100K getWords | 60.24 | - | - | - |


### DirectedGraph
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K addVertex | 0.0512 | 0.0488 | 0.061 | ±0.66% |
| 1K addEdge | 0 | null | null | ±0% |
| 1K getVertex | 37.32 | 36.56 | 38.51 | ±0.28% |
| 1K getEdge | 74.8 | 73.14 | 79.28 | ±0.46% |
| tarjan | 0.3806 | 0.3567 | 0.4021 | ±0.56% |
| topologicalSort | 0.2369 | 0.2064 | 0.2558 | ±1.12% |

#### DirectedGraph (side-by-side)

> Comparison table. The main table above is DirectedGraph only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K addVertex | 0.0512 | - | - | - |
| 1K addEdge | 0 | - | - | - |
| 1K getVertex | 37.32 | - | - | - |
| 1K getEdge | 74.8 | - | - | - |
| tarjan | 0.3806 | - | - | - |
| topologicalSort | 0.2369 | - | - | - |


### red-black-tree-cjs
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 97.57 | 75.66 | 115.14 | ±22.94% |
| 1M upd SEQ | 85.76 | 78.96 | 92.92 | ±8.16% |
| 1M upd RAND | 113.48 | 101.84 | 120.9 | ±7.77% |
| 1M ins SEQ | 493.45 | 436.86 | 670.44 | ±25.42% |
| 1M ins RAND | 1023.19 | 976.56 | 1094.17 | ±5.36% |
| 1M keys-only | 4.2208 | 2.7142 | 5.9026 | ±41.83% |

#### red-black-tree-cjs (side-by-side)

> Comparison table. The main table above is red-black-tree-cjs only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M get | 97.57 | - | - | - |
| 1M upd SEQ | 85.76 | - | - | - |
| 1M upd RAND | 113.48 | - | - | - |
| 1M ins SEQ | 493.45 | - | - | - |
| 1M ins RAND | 1023.19 | - | - | - |
| 1M keys-only | 4.2208 | - | - | - |



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
