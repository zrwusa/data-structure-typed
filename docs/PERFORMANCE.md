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

### HashMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 66.53 | 42.42 | 301.87 | ±29.92% |
| 1M set & get | 59.91 | 38.13 | 291.26 | ±23.52% |
| 1M ObjKey set & get | 229.74 | 214.13 | 257.72 | ±2.87% |

#### HashMap (side-by-side)

> Comparison table. The main table above is HashMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set | 66.53 | 109.34 | 172.25 | 76.26 |
| 1M set & get | 59.91 | 71.7 | 200.64 | 75.25 |
| 1M ObjKey set & get | 229.74 | 388.35 | 199.67 | 84.4 |


### Queue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 28.71 | 25.04 | 77.02 | ±7.51% |
| 100K push & shift | 3.6317 | 3.0642 | 16.425 | ±9.21% |

#### Queue (side-by-side)

> Comparison table. The main table above is Queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 28.71 | 31.73 | 24.75 | 1.7 |
| 100K push & shift | 3.6317 | 3.0023 | 1099.86 | 0.2 |


### Deque
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 11.31 | 6.41 | 27.72 | ±11.53% |
| 1M push & pop | 11.72 | 9.99 | 25.63 | ±6.45% |
| 1M push & shift | 11.72 | 10.2 | 27.9 | ±4.94% |
| 100K push & shift | 1.1668 | 1.041 | 3.6789 | ±6.23% |
| 100K unshift & shift | 1.1694 | 1.0857 | 2.3223 | ±3% |

#### Deque (side-by-side)

> Comparison table. The main table above is Deque only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M push | 11.31 | 8.5192 | 27.45 | 1.76 |
| 1M push & pop | 11.72 | 15.36 | 34.11 | 2.2 |
| 1M push & shift | 11.72 | - | - | 1.94 |
| 100K push & shift | 1.1668 | 1.1755 | 1249.1 | 0.19 |
| 100K unshift & shift | 1.1694 | 1.1678 | 2055.37 | 0.19 |


### DoublyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100k push | 5.3214 | 4.322 | 23.8263 | ±11.96% |
| 100k unshift | 4.9967 | 4.4608 | 5.9655 | ±2.31% |
| 100k unshift & shift | 3.9145 | 3.7706 | 5.0804 | ±1.32% |
| 100k addAt(mid) | 1362.72 | 1126.99 | 1773.23 | ±20.03% |
| 100k addBefore (cursor) | 6.7036 | 5.3368 | 15.0458 | ±5.16% |

#### DoublyLinkedList (side-by-side)

> Comparison table. The main table above is DoublyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100k push | 5.3214 | 1.7305 | 1.9249 | 5.7 |
| 100k unshift | 4.9967 | 1.6119 | 899.44 | 5.85 |
| 100k unshift & shift | 3.9145 | 1.9446 | 2068.08 | 5.74 |
| 100k addAt(mid) | 1362.72 | - | - | 754.81 |
| 100k addBefore (cursor) | 6.7036 | - | - | 6.18 |


### SinglyLinkedList
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K unshift & shift | 3.6711 | 3.5545 | 4.4486 | ±0.71% |
| 10K unshift & shift | 0.3542 | 0.3445 | 0.4379 | ±0.73% |
| 10K addAt(mid) | 9.3436 | 8.4129 | 12.4682 | ±2.8% |
| 10K addBefore (cursor) | 17.48 | 16.72 | 21.55 | ±1.07% |

#### SinglyLinkedList (side-by-side)

> Comparison table. The main table above is SinglyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K unshift & shift | 3.6711 | - | 2102.83 | 4.8 |
| 10K unshift & shift | 0.3542 | - | 6.2404 | 0.47 |
| 10K addAt(mid) | 9.3436 | - | - | 5.77 |
| 10K addBefore (cursor) | 17.48 | - | - | 0.53 |


### PriorityQueue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 4.191 | 3.9548 | 5.0848 | ±1.05% |
| 100K add & poll | 22.25 | 21.56 | 28.32 | ±0.99% |

#### PriorityQueue (side-by-side)

> Comparison table. The main table above is PriorityQueue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 4.191 | 5.0274 | - | 1.05 |
| 100K add & poll | 22.25 | 23.58 | - | 4.53 |


### TreeSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add | 1008.11 | 995.58 | 1020.75 | ±0.98% |
| 1M has | 70.16 | 67.89 | 73.92 | ±0.65% |
| 100K rangeSearch | 24.24 | 18.02 | 68.62 | ±11.89% |
| 100K navigable | 106.8 | 103.05 | 117.09 | ±1.01% |

#### TreeSet (side-by-side)

> Comparison table. The main table above is TreeSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | DST classic (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M add | 1008.11 | 895.5 | 646.7 | - | - |
| 1M has | 70.16 | 836.26 | 693.56 | - | - |
| 100K rangeSearch | 24.24 | 20.63 | - | - | - |
| 100K navigable | 106.8 | 107.55 | - | - | - |


### TreeMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 1202.31 | 1033.48 | 1405.71 | ±13.3% |
| 1M get | 137.26 | 134.24 | 141.61 | ±0.64% |
| 100K rangeSearch | 41.31 | 30.39 | 55.1 | ±7.21% |
| 100K navigable | 177.14 | 167.52 | 247.28 | ±4.97% |

#### TreeMap (side-by-side)

> Comparison table. The main table above is TreeMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | DST classic (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M set | 1202.31 | 915.59 | 646.28 | - | - |
| 1M get | 137.26 | 808.52 | 615.87 | - | - |
| 100K rangeSearch | 41.31 | 41.22 | - | - | - |
| 100K navigable | 177.14 | 272.68 | - | - | - |


### TreeMultiSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiSet expanded iteration) | 312.35 | 216.63 | 757.24 | ±34.52% |
| 1M has-only (TreeMultiSet) | 82.36 | 79.46 | 95.48 | ±1.27% |
| 1M count-only (TreeMultiSet) | 81.14 | 77.44 | 91.64 | ±1.16% |
| 1M build+has (TreeMultiSet) | 302.84 | 288.97 | 315.15 | ±1.63% |
| 1M build+count (TreeMultiSet) | 301.17 | 291.09 | 314.24 | ±1.66% |
| 100K delete-one (TreeMultiSet) | 246.21 | 216.01 | 416.06 | ±11.77% |
| 100K setCount (TreeMultiSet) | 230.69 | 217.77 | 263.1 | ±2.56% |
| 1M expanded iteration (TreeMultiSet) | 52.86 | 50.49 | 63.29 | ±1.29% |
| 1M entries view (TreeMultiSet) | 17.01 | 16.35 | 18.43 | ±0.7% |
| 1M size property (TreeMultiSet) | 0 | 0 | 0 | ±3.14% |
| 1M distinctSize property (TreeMultiSet) | 0 | 0 | 0 | ±2.95% |

#### TreeMultiSet (side-by-side)

> Comparison table. The main table above is TreeMultiSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiSet expanded iteration) | 312.35 | - | - | 752 |
| 1M has-only (TreeMultiSet) | 82.36 | - | - | 756 |
| 1M count-only (TreeMultiSet) | 81.14 | - | - | 1332 |
| 1M build+has (TreeMultiSet) | 302.84 | - | - | 1406 |
| 1M build+count (TreeMultiSet) | 301.17 | - | - | 1909 |
| 100K delete-one (TreeMultiSet) | 246.21 | - | - | - |
| 100K setCount (TreeMultiSet) | 230.69 | - | - | - |
| 1M expanded iteration (TreeMultiSet) | 52.86 | - | - | - |
| 1M entries view (TreeMultiSet) | 17.01 | - | - | - |
| 1M size property (TreeMultiSet) | 0 | - | - | - |
| 1M distinctSize property (TreeMultiSet) | 0 | - | - | - |


### TreeMultiMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiMap bucketed) | 383.94 | 368.46 | 400.76 | ±1.96% |
| 1M has-only (TreeMultiMap) | 30.66 | 27.91 | 41.47 | ±1.59% |
| 1M get-only (TreeMultiMap) | 59.91 | 58.21 | 69.46 | ±0.88% |
| 1M count-only (TreeMultiMap) | 117.57 | 113.12 | 122.55 | ±0.96% |
| 1M build+has (TreeMultiMap) | 460.25 | 407.09 | 857.88 | ±21.75% |
| 1M build+get (TreeMultiMap) | 448.62 | 426.65 | 481.25 | ±2.54% |
| 100K hasEntry (TreeMultiMap Object.is) | 421.91 | 408.28 | 454.67 | ±2.78% |
| 100K deleteValue (TreeMultiMap Object.is) | 482.6 | 450.96 | 595.74 | ±7.51% |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | null | null | ±0% |
| 1M bucket iteration (TreeMultiMap) | 26.93 | 25.86 | 29.3 | ±0.6% |
| 1M flatEntries iteration (TreeMultiMap) | 123.65 | 114.07 | 129.26 | ±1.26% |
| 1M size property (TreeMultiMap) | 0 | 0 | 0 | ±3.58% |
| 1M totalSize property (TreeMultiMap) | 25.87 | 25.22 | 27.1 | ±0.49% |

#### TreeMultiMap (side-by-side)

> Comparison table. The main table above is TreeMultiMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiMap bucketed) | 383.94 | - | - | 731 |
| 1M has-only (TreeMultiMap) | 30.66 | - | - | 833 |
| 1M get-only (TreeMultiMap) | 59.91 | - | - | 1553 |
| 1M count-only (TreeMultiMap) | 117.57 | - | - | 1548 |
| 1M build+has (TreeMultiMap) | 460.25 | - | - | 1519 |
| 1M build+get (TreeMultiMap) | 448.62 | - | - | 2263 |
| 100K hasEntry (TreeMultiMap Object.is) | 421.91 | - | - | - |
| 100K deleteValue (TreeMultiMap Object.is) | 482.6 | - | - | - |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0 | - | - | - |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0 | - | - | - |
| 1M bucket iteration (TreeMultiMap) | 26.93 | - | - | 109 |
| 1M flatEntries iteration (TreeMultiMap) | 123.65 | - | - | 109 |
| 1M size property (TreeMultiMap) | 0 | - | - | - |
| 1M totalSize property (TreeMultiMap) | 25.87 | - | - | - |


### RedBlackTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 100.34 | 82.76 | 113.78 | ±18.68% |
| 200K rangeSearch SEQ | 1132.89 | 1088.54 | 1177.35 | ±3.71% |
| 200K rangeSearch RAND | 1622.14 | 1598.24 | 1636.07 | ±1.13% |
| 1M upd SEQ | 78.74 | 68.47 | 97.6 | ±17.82% |
| 1M upd RAND | 112.75 | 107.35 | 116.96 | ±3.87% |
| 1M ins SEQ | 543.61 | 469.08 | 815.31 | ±34.71% |
| 1M ins RAND | 1028.89 | 1013.49 | 1049.95 | ±1.80% |
| 1M keys-only | 3.4756 | 2.3173 | 4.8913 | ±43.61% |

#### RedBlackTree (side-by-side)

> Comparison table. The main table above is RedBlackTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | DST classic (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M get | 100.34 | 250.81 | - | - | 52.97 |
| 200K rangeSearch SEQ | 1132.89 | - | - | - | - |
| 200K rangeSearch RAND | 1622.14 | - | - | - | - |
| 1M upd SEQ | 78.74 | 229.66 | - | - | 68.43 |
| 1M upd RAND | 112.75 | 395.8 | - | - | 158.14 |
| 1M ins SEQ | 543.61 | 195.98 | - | - | 162.72 |
| 1M ins RAND | 1028.89 | 903.14 | - | - | 483.56 |
| 1M keys-only | 3.4756 | - | - | - | 0.09 |


### BST
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 10K add randomly | 5.7348 | 5.4151 | 7.3027 | ±0.91% |
| 10K add & delete randomly | 10.5 | 10.24 | 11.2 | ±0.34% |
| 10K addMany | 10.7 | 10.01 | 11.81 | ±0.64% |
| 10K get | 11.45 | 10.59 | 14.42 | ±1.26% |

#### BST (side-by-side)

> Comparison table. The main table above is BST only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 10K add randomly | 5.7348 | - | - | - |
| 10K add & delete randomly | 10.5 | - | - | - |
| 10K addMany | 10.7 | - | - | - |
| 10K get | 11.45 | - | - | - |


### BinaryTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K add randomly | 10.4 | 10.04 | 10.86 | ±0.35% |
| 1K add & delete randomly | 10.74 | 10.21 | 12.52 | ±0.74% |
| 1K addMany | 10.69 | 10.26 | 11.42 | ±0.44% |
| 1K get | 11.31 | 10.35 | 42.95 | ±7.42% |
| 1K has | 10.95 | 10.57 | 12.23 | ±0.62% |
| 1K dfs | 104.22 | 100.77 | 129.5 | ±1.92% |
| 1K bfs | 44.83 | 41.87 | 53.37 | ±1.12% |
| 1K morris | 41.22 | 38.93 | 60.17 | ±2.26% |

#### BinaryTree (side-by-side)

> Comparison table. The main table above is BinaryTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K add randomly | 10.4 | - | - | - |
| 1K add & delete randomly | 10.74 | - | - | - |
| 1K addMany | 10.69 | - | - | - |
| 1K get | 11.31 | - | - | - |
| 1K has | 10.95 | - | - | - |
| 1K dfs | 104.22 | - | - | - |
| 1K bfs | 44.83 | - | - | - |
| 1K morris | 41.22 | - | - | - |


### Trie
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 100K add | 133.91 | 72.83 | 657.68 | ±33.82% |
| 100K getWords | 68.55 | 50.84 | 377.6 | ±24.68% |

#### Trie (side-by-side)

> Comparison table. The main table above is Trie only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 133.91 | - | - | - |
| 100K getWords | 68.55 | - | - | - |


### DirectedGraph
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1K addVertex | 0.0467 | 0.0444 | 0.0602 | ±1.18% |
| 1K addEdge | 0 | null | null | ±0% |
| 1K getVertex | 36.39 | 35.36 | 38.07 | ±0.48% |
| 1K getEdge | 72.7 | 70.35 | 75.37 | ±0.48% |
| tarjan | 0.3466 | 0.2994 | 0.9163 | ±4.44% |
| topologicalSort | 0.2077 | 0.1988 | 0.2194 | ±0.44% |

#### DirectedGraph (side-by-side)

> Comparison table. The main table above is DirectedGraph only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1K addVertex | 0.0467 | - | - | - |
| 1K addEdge | 0 | - | - | - |
| 1K getVertex | 36.39 | - | - | - |
| 1K getEdge | 72.7 | - | - | - |
| tarjan | 0.3466 | - | - | - |
| topologicalSort | 0.2077 | - | - | - |


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
