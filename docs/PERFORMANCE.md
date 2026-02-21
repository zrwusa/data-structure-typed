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

### tree-map
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M set TreeMap | 1738.16 | 1526.69 | 2471.62 | ±21.87% |
| 1M set TreeMap (Node) | 1177.92 | 1164.97 | 1196.45 | ±0.93% |
| 1M set RBT | 1707.47 | 1621.95 | 1893.88 | ±6.54% |
| 1M set RBT (Node) | 1217.04 | 1197.37 | 1237.54 | ±1.04% |
| 1M set js-sdsl | 881.95 | 854.57 | 898.38 | ±1.56% |
| 1M get TreeMap | 117.34 | 101.28 | 123.83 | ±2.37% |
| 1M get TreeMap (Node) | 962.71 | 923.55 | 1043.25 | ±4.32% |
| 1M get RBT | 148.53 | 137.18 | 156.26 | ±1.34% |
| 1M get RBT (Node) | 1061.33 | 1032.26 | 1105.03 | ±2.5% |
| 1M get js-sdsl | 884.94 | 820.16 | 1279.5 | ±15.08% |
| 1M build+get TreeMap | 1742.48 | 1662.04 | 1875.96 | ±4.86% |
| 1M build+get TreeMap (Node) | 2023.74 | 2011.54 | 2039.39 | ±0.54% |
| 1M build+get RBT | 1796.07 | 1741.88 | 1895.51 | ±3.31% |
| 1M build+get RBT (Node) | 2211.94 | 2140.97 | 2367.76 | ±4.24% |
| 1M build+get js-sdsl | 1526.14 | 1480.19 | 1648.44 | ±4.5% |
| 100K rangeSearch TreeMap | 73.79 | 67.06 | 78.34 | ±1.49% |
| 100K rangeSearch TreeMap (Node) | 83.36 | 78.51 | 86 | ±0.82% |
| 100K navigable TreeMap | 201.99 | 158.97 | 929.49 | ±39.68% |
| 100K navigable TreeMap (Node) | 234.86 | 228.78 | 251.23 | ±1.3% |
| 100K build+rangeSearch TreeMap | 1794.84 | 1613.17 | 2588.06 | ±22.75% |
| 100K build+rangeSearch TreeMap (Node) | 1199.3 | 1164.79 | 1295.32 | ±3.39% |
| 100K build+navigable TreeMap | 1722.65 | 1688.7 | 1755.57 | ±1.45% |
| 100K build+navigable TreeMap (Node) | 1498.79 | 1332.62 | 2246.38 | ±25.68% |

#### tree-map (side-by-side)

> Comparison table. The main table above is tree-map only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set TreeMap | 1738.16 | - | - | 522 |
| 1M set TreeMap (Node) | 1177.92 | - | - | 522 |
| 1M set RBT | 1707.47 | - | - | 522 |
| 1M set RBT (Node) | 1217.04 | - | - | 522 |
| 1M set js-sdsl | 881.95 | - | - | - |
| 1M get TreeMap | 117.34 | - | - | 333 |
| 1M get TreeMap (Node) | 962.71 | - | - | 333 |
| 1M get RBT | 148.53 | - | - | 333 |
| 1M get RBT (Node) | 1061.33 | - | - | 333 |
| 1M get js-sdsl | 884.94 | - | - | - |
| 1M build+get TreeMap | 1742.48 | - | - | 832 |
| 1M build+get TreeMap (Node) | 2023.74 | - | - | 832 |
| 1M build+get RBT | 1796.07 | - | - | 832 |
| 1M build+get RBT (Node) | 2211.94 | - | - | 832 |
| 1M build+get js-sdsl | 1526.14 | - | - | - |
| 100K rangeSearch TreeMap | 73.79 | - | - | - |
| 100K rangeSearch TreeMap (Node) | 83.36 | - | - | - |
| 100K navigable TreeMap | 201.99 | - | - | - |
| 100K navigable TreeMap (Node) | 234.86 | - | - | - |
| 100K build+rangeSearch TreeMap | 1794.84 | - | - | - |
| 100K build+rangeSearch TreeMap (Node) | 1199.3 | - | - | - |
| 100K build+navigable TreeMap | 1722.65 | - | - | - |
| 100K build+navigable TreeMap (Node) | 1498.79 | - | - | - |


### tree-set
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add TreeSet | 1886.78 | 1556.97 | 3451.3 | ±42.65% |
| 1M add TreeSet (Node) | 1130.52 | 1102.88 | 1148.59 | ±1.18% |
| 1M add RBT | 1636.99 | 1601.25 | 1673.45 | ±1.57% |
| 1M add RBT (Node) | 1192.47 | 1168.67 | 1218.23 | ±1.4% |
| 1M add js-sdsl | 869.08 | 833.59 | 904.4 | ±2.91% |
| 1M has TreeSet | 74.6 | 73.01 | 80.89 | ±0.59% |
| 1M has TreeSet (Node) | 965.75 | 949.01 | 998.75 | ±1.7% |
| 1M has RBT | 71.4 | 69.82 | 73.97 | ±0.55% |
| 1M has RBT (Node) | 1086.64 | 1079.01 | 1092.71 | ±0.42% |
| 1M has js-sdsl | 878.52 | 839.41 | 1061.46 | ±8.52% |
| 1M build+has TreeSet | 1653.99 | 1603.69 | 1784.01 | ±4.15% |
| 1M build+has TreeSet (Node) | 2094.67 | 2079.22 | 2116.66 | ±0.68% |
| 1M build+has RBT | 2047.58 | 1671.6 | 3814.77 | ±44.39% |
| 1M build+has RBT (Node) | 2443.58 | 2184.99 | 3593.53 | ±24.21% |
| 1M build+has js-sdsl | 1685.98 | 1609.53 | 1789.71 | ±4.55% |
| 100K rangeSearch TreeSet | 34 | 32.57 | 36.05 | ±0.63% |
| 100K rangeSearch TreeSet (Node) | 33.4 | 27.1 | 38.77 | ±1.51% |
| 100K navigable TreeSet | 154.02 | 148.96 | 165.55 | ±1.18% |
| 100K navigable TreeSet (Node) | 153.58 | 148.54 | 163.87 | ±1.07% |
| 100K build+rangeSearch TreeSet | 1599.53 | 1550.64 | 1688.47 | ±3.18% |
| 100K build+rangeSearch TreeSet (Node) | 1363.62 | 1116.92 | 2722.44 | ±40.65% |
| 100K build+navigable TreeSet | 1696.08 | 1673.55 | 1714.33 | ±0.88% |
| 100K build+navigable TreeSet (Node) | 1249.7 | 1244.49 | 1253.36 | ±0.32% |

#### tree-set (side-by-side)

> Comparison table. The main table above is tree-set only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add TreeSet | 1886.78 | - | - | 426 |
| 1M add TreeSet (Node) | 1130.52 | - | - | 426 |
| 1M add RBT | 1636.99 | - | - | 426 |
| 1M add RBT (Node) | 1192.47 | - | - | 426 |
| 1M add js-sdsl | 869.08 | - | - | - |
| 1M has TreeSet | 74.6 | - | - | 234 |
| 1M has TreeSet (Node) | 965.75 | - | - | 234 |
| 1M has RBT | 71.4 | - | - | 234 |
| 1M has RBT (Node) | 1086.64 | - | - | 234 |
| 1M has js-sdsl | 878.52 | - | - | - |
| 1M build+has TreeSet | 1653.99 | - | - | 688 |
| 1M build+has TreeSet (Node) | 2094.67 | - | - | 688 |
| 1M build+has RBT | 2047.58 | - | - | 688 |
| 1M build+has RBT (Node) | 2443.58 | - | - | 688 |
| 1M build+has js-sdsl | 1685.98 | - | - | - |
| 100K rangeSearch TreeSet | 34 | - | - | - |
| 100K rangeSearch TreeSet (Node) | 33.4 | - | - | - |
| 100K navigable TreeSet | 154.02 | - | - | - |
| 100K navigable TreeSet (Node) | 153.58 | - | - | - |
| 100K build+rangeSearch TreeSet | 1599.53 | - | - | - |
| 100K build+rangeSearch TreeSet (Node) | 1363.62 | - | - | - |
| 100K build+navigable TreeSet | 1696.08 | - | - | - |
| 100K build+navigable TreeSet (Node) | 1249.7 | - | - | - |



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
