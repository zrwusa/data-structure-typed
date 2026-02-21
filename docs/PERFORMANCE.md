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
| 1M set TreeMap | 2652.91 | 2197.76 | 3990.71 | ±26.42% |
| 1M set TreeMap (Node) | 1912.01 | 1737.56 | 2574.78 | ±17.94% |
| 1M set RBT | 2722.59 | 2301.71 | 3683.56 | ±25.47% |
| 1M set RBT (Node) | 1812.88 | 1577.58 | 1879.69 | ±6.93% |
| 1M set js-sdsl | 1467.76 | 1309.06 | 1804.06 | ±14.01% |
| 1M get TreeMap | 151.05 | 123.15 | 211.57 | ±6.3% |
| 1M get TreeMap (Node) | 1507.33 | 1431 | 1584.17 | ±3.9% |
| 1M get RBT | 167.27 | 130.92 | 213.47 | ±5.72% |
| 1M get RBT (Node) | 1754.55 | 1445.6 | 2531.27 | ±24.48% |
| 1M get js-sdsl | 1076.91 | 937.31 | 1132.77 | ±5.52% |
| 1M build+get TreeMap | 2341.45 | 1867.65 | 2654.55 | ±11.55% |
| 1M build+get TreeMap (Node) | 2948.5 | 2846.32 | 3069.79 | ±4.46% |
| 1M build+get RBT | 2478.37 | 2274.28 | 2609.97 | ±6.77% |
| 1M build+get RBT (Node) | 3108.57 | 2662.85 | 4194.91 | ±25.88% |
| 1M build+get js-sdsl | 2001.01 | 1910.55 | 2090.47 | ±3.74% |
| 100K rangeSearch TreeMap | 94.43 | 80.55 | 124.51 | ±3.56% |
| 100K rangeSearch TreeMap (Node) | 136.83 | 85.77 | 477.84 | ±27.24% |
| 100K navigable TreeMap | 307.84 | 251.61 | 429.16 | ±13.19% |
| 100K navigable TreeMap (Node) | 425.24 | 241.64 | 962.39 | ±28.62% |
| 100K build+rangeSearch TreeMap | 2318.94 | 2017.28 | 2992.4 | ±15.83% |
| 100K build+rangeSearch TreeMap (Node) | 1870.56 | 1794.78 | 1922.55 | ±2.88% |
| 100K build+navigable TreeMap | 2556.86 | 2494.94 | 2602.22 | ±1.95% |
| 100K build+navigable TreeMap (Node) | 1986.66 | 1485.92 | 2161.54 | ±13.74% |

#### tree-map (side-by-side)

> Comparison table. The main table above is tree-map only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M set TreeMap | 2652.91 | - | - | - |
| 1M set TreeMap (Node) | 1912.01 | - | - | - |
| 1M set RBT | 2722.59 | - | - | - |
| 1M set RBT (Node) | 1812.88 | - | - | - |
| 1M set js-sdsl | 1467.76 | - | - | - |
| 1M get TreeMap | 151.05 | - | - | - |
| 1M get TreeMap (Node) | 1507.33 | - | - | - |
| 1M get RBT | 167.27 | - | - | - |
| 1M get RBT (Node) | 1754.55 | - | - | - |
| 1M get js-sdsl | 1076.91 | - | - | - |
| 1M build+get TreeMap | 2341.45 | - | - | - |
| 1M build+get TreeMap (Node) | 2948.5 | - | - | - |
| 1M build+get RBT | 2478.37 | - | - | - |
| 1M build+get RBT (Node) | 3108.57 | - | - | - |
| 1M build+get js-sdsl | 2001.01 | - | - | - |
| 100K rangeSearch TreeMap | 94.43 | - | - | - |
| 100K rangeSearch TreeMap (Node) | 136.83 | - | - | - |
| 100K navigable TreeMap | 307.84 | - | - | - |
| 100K navigable TreeMap (Node) | 425.24 | - | - | - |
| 100K build+rangeSearch TreeMap | 2318.94 | - | - | - |
| 100K build+rangeSearch TreeMap (Node) | 1870.56 | - | - | - |
| 100K build+navigable TreeMap | 2556.86 | - | - | - |
| 100K build+navigable TreeMap (Node) | 1986.66 | - | - | - |


### tree-set
| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |
|-----------|----------|----------|----------|-----------|
| 1M add TreeSet | 2284.24 | 1704.43 | 3374.13 | ±25.99% |
| 1M add TreeSet (Node) | 1631.38 | 1590.62 | 1693.24 | ±2.57% |
| 1M add RBT | 2273.7 | 2183.62 | 2325.07 | ±3.15% |
| 1M add RBT (Node) | 1654.12 | 1551.52 | 1722.32 | ±3.85% |
| 1M add js-sdsl | 1151.57 | 965.57 | 1209.09 | ±6.82% |
| 1M has TreeSet | 101.49 | 92.18 | 109.19 | ±1.9% |
| 1M has TreeSet (Node) | 1398.65 | 1369.36 | 1444.5 | ±2.12% |
| 1M has RBT | 91.84 | 75.13 | 107.28 | ±4.63% |
| 1M has RBT (Node) | 1650.6 | 1632.29 | 1671.7 | ±0.92% |
| 1M has js-sdsl | 1234.76 | 959.04 | 1302.57 | ±11.53% |
| 1M build+has TreeSet | 2717.13 | 2412.55 | 3711.04 | ±25.49% |
| 1M build+has TreeSet (Node) | 3004.11 | 2710.78 | 3152.3 | ±7.04% |
| 1M build+has RBT | 2561.72 | 2496.92 | 2649.74 | ±2.93% |
| 1M build+has RBT (Node) | 3283.21 | 2805.31 | 3437.55 | ±10.16% |
| 1M build+has js-sdsl | 2319.39 | 1879.09 | 2433.85 | ±9.8% |
| 100K rangeSearch TreeSet | 45.9 | 32.92 | 48.86 | ±2.38% |
| 100K rangeSearch TreeSet (Node) | 47.95 | 46.3 | 50 | ±0.61% |
| 100K navigable TreeSet | 233.85 | 179.9 | 242.49 | ±3.78% |
| 100K navigable TreeSet (Node) | 233.01 | 213.01 | 239.62 | ±1.56% |
| 100K build+rangeSearch TreeSet | 2328.35 | 1869.88 | 2440.72 | ±10.16% |
| 100K build+rangeSearch TreeSet (Node) | 1913.47 | 1408.52 | 2867.15 | ±27.05% |
| 100K build+navigable TreeSet | 2437.41 | 1954.87 | 2599.27 | ±13.83% |
| 100K build+navigable TreeSet (Node) | 1875.38 | 1513.49 | 1990.29 | ±10.02% |

#### tree-set (side-by-side)

> Comparison table. The main table above is tree-set only.
> Native is `-` when there is no apples-to-apples equivalent in this benchmark.

| Test Case | DST (ms) | js-sdsl (ms) | Native (ms) | C++ (ms) |
| ----------- | ---------: | ---------: | ---------: | ---------: |
| 1M add TreeSet | 2284.24 | - | - | - |
| 1M add TreeSet (Node) | 1631.38 | - | - | - |
| 1M add RBT | 2273.7 | - | - | - |
| 1M add RBT (Node) | 1654.12 | - | - | - |
| 1M add js-sdsl | 1151.57 | - | - | - |
| 1M has TreeSet | 101.49 | - | - | - |
| 1M has TreeSet (Node) | 1398.65 | - | - | - |
| 1M has RBT | 91.84 | - | - | - |
| 1M has RBT (Node) | 1650.6 | - | - | - |
| 1M has js-sdsl | 1234.76 | - | - | - |
| 1M build+has TreeSet | 2717.13 | - | - | - |
| 1M build+has TreeSet (Node) | 3004.11 | - | - | - |
| 1M build+has RBT | 2561.72 | - | - | - |
| 1M build+has RBT (Node) | 3283.21 | - | - | - |
| 1M build+has js-sdsl | 2319.39 | - | - | - |
| 100K rangeSearch TreeSet | 45.9 | - | - | - |
| 100K rangeSearch TreeSet (Node) | 47.95 | - | - | - |
| 100K navigable TreeSet | 233.85 | - | - | - |
| 100K navigable TreeSet (Node) | 233.01 | - | - | - |
| 100K build+rangeSearch TreeSet | 2328.35 | - | - | - |
| 100K build+rangeSearch TreeSet (Node) | 1913.47 | - | - | - |
| 100K build+navigable TreeSet | 2437.41 | - | - | - |
| 100K build+navigable TreeSet (Node) | 1875.38 | - | - | - |



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
