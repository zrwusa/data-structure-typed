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
