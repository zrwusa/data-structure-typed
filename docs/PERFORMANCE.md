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

### Queue
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M push | 26.93 | 24.41 | 51.97 | ±4.28% |
| 100K push & shift | 3.45 | 2.72 | 15.26 | ±8.97% |

#### Queue (side-by-side)

> Comparison table. The main table above is Queue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is Deque only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is DoublyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is SinglyLinkedList only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is PriorityQueue only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 100K add | 4.00 | - | 1.05 | 4.96 |
| 100K add & poll | 22.51 | - | 4.53 | 22.97 |


### TreeSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add | 962.76 | 939.01 | 984.79 | ±1.48% |
| 1M has | 69.63 | 67.37 | 74.11 | ±0.71% |
| 100K rangeSearch | 18.37 | 17.79 | 19.13 | ±0.52% |
| 100K navigable | 105.45 | 98.12 | 137.95 | ±2.93% |

#### TreeSet (side-by-side)

> Comparison table. The main table above is TreeSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | DST classic (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M add | 962.76 | 830.76 | - | 462.00 | 640.31 |
| 1M has | 69.63 | 878.36 | - | 444.00 | 760.31 |
| 100K rangeSearch | 18.37 | 18.25 | - | - | - |
| 100K navigable | 105.45 | 108.48 | - | - | - |


### TreeMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set | 996.95 | 986.87 | 1023.16 | ±1.15% |
| 1M get | 125.23 | 118.97 | 132.21 | ±1.11% |
| 100K rangeSearch | 47.43 | 34.21 | 265.16 | ±23.37% |
| 100K navigable | 168.30 | 165.26 | 171.57 | ±0.49% |

#### TreeMap (side-by-side)

> Comparison table. The main table above is TreeMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | DST classic (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M set | 996.95 | 886.30 | - | 512.00 | 624.82 |
| 1M get | 125.23 | 723.44 | - | 322.00 | 623.70 |
| 100K rangeSearch | 47.43 | 37.01 | - | - | - |
| 100K navigable | 168.30 | 221.85 | - | - | - |


### TreeMultiSet
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiSet expanded iteration) | 218.78 | 203.62 | 271.24 | ±3.81% |
| 1M has-only (TreeMultiSet) | 81.70 | 79.17 | 88.22 | ±0.78% |
| 1M count-only (TreeMultiSet) | 83.77 | 79.32 | 101.94 | ±1.67% |
| 1M build+has (TreeMultiSet) | 341.28 | 287.81 | 790.70 | ±26.39% |
| 1M build+count (TreeMultiSet) | 304.69 | 286.50 | 355.80 | ±4.01% |
| 100K delete-one (TreeMultiSet) | 232.04 | 219.23 | 243.31 | ±1.62% |
| 100K setCount (TreeMultiSet) | 231.53 | 216.92 | 250.05 | ±2.5% |
| 1M expanded iteration (TreeMultiSet) | 56.11 | 53.92 | 65.49 | ±1.11% |
| 1M entries view (TreeMultiSet) | 18.94 | 18.34 | 19.94 | ±0.42% |
| 1M size property (TreeMultiSet) | 0.00 | 0.00 | 0.00 | ±3.53% |
| 1M distinctSize property (TreeMultiSet) | 0.00 | 0.00 | 0.00 | ±3.39% |

#### TreeMultiSet (side-by-side)

> Comparison table. The main table above is TreeMultiSet only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiSet expanded iteration) | 218.78 | - | 752.00 | - |
| 1M has-only (TreeMultiSet) | 81.70 | - | 756.00 | - |
| 1M count-only (TreeMultiSet) | 83.77 | - | 1332.00 | - |
| 1M build+has (TreeMultiSet) | 341.28 | - | 1406.00 | - |
| 1M build+count (TreeMultiSet) | 304.69 | - | 1909.00 | - |
| 100K delete-one (TreeMultiSet) | 232.04 | - | - | - |
| 100K setCount (TreeMultiSet) | 231.53 | - | - | - |
| 1M expanded iteration (TreeMultiSet) | 56.11 | - | - | - |
| 1M entries view (TreeMultiSet) | 18.94 | - | - | - |
| 1M size property (TreeMultiSet) | 0.00 | - | - | - |
| 1M distinctSize property (TreeMultiSet) | 0.00 | - | - | - |


### TreeMultiMap
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add (TreeMultiMap bucketed) | 387.80 | 361.45 | 418.01 | ±2.75% |
| 1M has-only (TreeMultiMap) | 30.32 | 29.05 | 31.78 | ±0.6% |
| 1M get-only (TreeMultiMap) | 82.50 | 80.72 | 88.31 | ±0.66% |
| 1M count-only (TreeMultiMap) | 133.45 | 128.56 | 144.22 | ±1.11% |
| 1M build+has (TreeMultiMap) | 409.86 | 373.79 | 437.28 | ±3.13% |
| 1M build+get (TreeMultiMap) | 469.61 | 455.85 | 484.46 | ±1.4% |
| 100K hasEntry (TreeMultiMap Object.is) | 415.70 | 408.06 | 425.09 | ±0.82% |
| 100K deleteValue (TreeMultiMap Object.is) | 447.52 | 438.21 | 465.37 | ±1.38% |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0.00 | - | - | ±0% |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0.00 | - | - | ±0% |
| 1M bucket iteration (TreeMultiMap) | 27.96 | 26.59 | 31.51 | ±0.8% |
| 1M flatEntries iteration (TreeMultiMap) | 137.60 | 132.71 | 142.72 | ±0.66% |
| 1M size property (TreeMultiMap) | 0.00 | 0.00 | 0.00 | ±3.3% |
| 1M totalSize property (TreeMultiMap) | 26.89 | 25.79 | 28.54 | ±0.66% |

#### TreeMultiMap (side-by-side)

> Comparison table. The main table above is TreeMultiMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add (TreeMultiMap bucketed) | 387.80 | - | 731.00 | - |
| 1M has-only (TreeMultiMap) | 30.32 | - | 833.00 | - |
| 1M get-only (TreeMultiMap) | 82.50 | - | 1553.00 | - |
| 1M count-only (TreeMultiMap) | 133.45 | - | 1548.00 | - |
| 1M build+has (TreeMultiMap) | 409.86 | - | 1519.00 | - |
| 1M build+get (TreeMultiMap) | 469.61 | - | 2263.00 | - |
| 100K hasEntry (TreeMultiMap Object.is) | 415.70 | - | - | - |
| 100K deleteValue (TreeMultiMap Object.is) | 447.52 | - | - | - |
| 100K firstEntry/lastEntry (TreeMultiMap) | 0.00 | - | - | - |
| 100K ceilingEntry/floorEntry (TreeMultiMap) | 0.00 | - | - | - |
| 1M bucket iteration (TreeMultiMap) | 27.96 | - | 109.00 | - |
| 1M flatEntries iteration (TreeMultiMap) | 137.60 | - | 109.00 | - |
| 1M size property (TreeMultiMap) | 0.00 | - | - | - |
| 1M totalSize property (TreeMultiMap) | 26.89 | - | - | - |


### RedBlackTree
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M get | 108.02 | 102.20 | 115.34 | ±6.33% |
| 200K rangeSearch SEQ | 1393.24 | 1256.17 | 1632.61 | ±13.97% |
| 200K rangeSearch RAND | 1829.00 | 1807.24 | 1877.38 | ±1.97% |
| 1M upd SEQ | 73.96 | 63.61 | 90.50 | ±17.50% |
| 1M upd RAND | 105.66 | 99.83 | 108.31 | ±4.15% |
| 1M ins SEQ | 485.12 | 475.89 | 504.56 | ±2.96% |
| 1M ins RAND | 1067.21 | 1053.08 | 1080.31 | ±1.14% |
| 1M keys-only | 7.52 | 1.55 | 13.81 | ±92.85% |

#### RedBlackTree (side-by-side)

> Comparison table. The main table above is RedBlackTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | DST classic (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| 1M get | 108.02 | 377.88 | - | 52.97 | - |
| 200K rangeSearch SEQ | 1393.24 | - | - | - | - |
| 200K rangeSearch RAND | 1829.00 | - | - | - | - |
| 1M upd SEQ | 73.96 | 333.38 | - | 68.43 | - |
| 1M upd RAND | 105.66 | 455.76 | - | 158.14 | - |
| 1M ins SEQ | 485.12 | 202.03 | - | 162.72 | - |
| 1M ins RAND | 1067.21 | 985.75 | - | 483.56 | - |
| 1M keys-only | 7.52 | - | - | 0.09 | - |


### BST
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 10K add randomly | 5.50 | 5.11 | 5.93 | ±0.6% |
| 10K add & delete randomly | 10.01 | 9.75 | 10.79 | ±0.4% |
| 10K addMany | 11.62 | 10.00 | 68.37 | ±15.54% |
| 10K get | 10.65 | 10.35 | 11.67 | ±0.48% |

#### BST (side-by-side)

> Comparison table. The main table above is BST only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is BinaryTree only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is HashMap only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is Trie only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is DirectedGraph only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is Stack only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

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

> Comparison table. The main table above is red-black-tree-cjs only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | Native (ms) | C++ (ms) | js-sdsl (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M get | 97.57 | - | - | - |
| 1M upd SEQ | 85.76 | - | - | - |
| 1M upd RAND | 113.48 | - | - | - |
| 1M ins SEQ | 493.45 | - | - | - |
| 1M ins RAND | 1023.19 | - | - | - |
| 1M keys-only | 4.22 | - | - | - |



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
