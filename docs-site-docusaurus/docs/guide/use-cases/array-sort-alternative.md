---
title: When Array + Sort Becomes Too Slow
description: Stop re-sorting arrays after every insert. Use TreeMap, TreeSet, or Heap for O(log n) ordered operations in JavaScript and TypeScript.
keywords: [javascript sorted insert, array sort performance, sorted array alternative, binary search insert javascript, ordered collection typescript]
sidebar_label: Array + Sort Alternatives
---

# When Array + Sort Becomes Too Slow

A common pattern in JavaScript:

```typescript
const items: number[] = [];

function addSorted(value: number) {
  items.push(value);
  items.sort((a, b) => a - b); // O(n log n) every time!
}
```

This works fine for 100 elements. At 10,000, it's noticeably slow. At 100,000, it's a bottleneck.

## Why This Is Slow

| Elements | Array push + sort | Tree insert |
|----------|------------------|-------------|
| 100 | ~0.01ms | ~0.01ms |
| 10,000 | ~5ms | ~0.1ms |
| 100,000 | ~80ms | ~0.2ms |
| 1,000,000 | ~1200ms | ~0.5ms |

Array.sort is O(n log n). Tree insert is O(log n). The gap grows with data size.

## Choose the Right Alternative

### Need sorted key-value pairs → TreeMap

```typescript
import { TreeMap } from 'data-structure-typed';

const prices = new TreeMap<string, number>();
prices.set('apple', 1.2);
prices.set('banana', 0.5);
prices.set('cherry', 2.5);

// Always sorted by key
for (const [fruit, price] of prices) {
  console.log(fruit, price);
}
// apple 1.2, banana 0.5, cherry 2.5

// Find nearest
prices.floor('blueberry'); // ['banana', 0.5]
```

### Need sorted unique values → TreeSet

```typescript
import { TreeSet } from 'data-structure-typed';

const uniqueScores = new TreeSet<number>();
uniqueScores.add(85);
uniqueScores.add(92);
uniqueScores.add(78);
uniqueScores.add(85); // duplicate ignored

[...uniqueScores]; // [78, 85, 92] — sorted, unique
```

### Only need min or max → Heap

```typescript
import { MinHeap } from 'data-structure-typed';

const heap = new MinHeap<number>();
heap.add(5);
heap.add(2);
heap.add(8);

heap.peek(); // 2 — O(1)
heap.poll(); // 2 — O(log n), removes and returns min
```

Heap is lighter than TreeMap when you only need the top element.

## Decision Guide

```
Do you need...
├── Only the min or max? → Heap / MinHeap / MaxHeap
├── Sorted iteration of all elements?
│   ├── Key-value pairs? → TreeMap
│   └── Values only? → TreeSet
├── Floor / ceiling / range queries? → TreeMap / TreeSet
├── Rank queries (kth element)? → TreeMap/TreeSet with enableOrderStatistic
└── Just fast lookup by key? → HashMap (or native Map)
```

## Before and After

### Task queue (before)
```typescript
// ❌ O(n log n) per insert
const tasks: { priority: number; name: string }[] = [];
tasks.push({ priority: 3, name: 'email' });
tasks.push({ priority: 1, name: 'bugfix' });
tasks.sort((a, b) => a.priority - b.priority);
const next = tasks.shift(); // O(n) shift
```

### Task queue (after)
```typescript
// ✅ O(log n) per insert, O(log n) per poll
import { MinPriorityQueue } from 'data-structure-typed';

const tasks = new MinPriorityQueue<{ priority: number; name: string }>({
  comparator: (a, b) => a.priority - b.priority
});
tasks.add({ priority: 3, name: 'email' });
tasks.add({ priority: 1, name: 'bugfix' });
const next = tasks.poll(); // { priority: 1, name: 'bugfix' }
```

### Leaderboard (before)
```typescript
// ❌ Re-sort after every score update
const scores: [string, number][] = [];
scores.push(['Alice', 100]);
scores.push(['Bob', 250]);
scores.sort((a, b) => b[1] - a[1]);
const top3 = scores.slice(0, 3); // O(n log n) + O(k)
```

### Leaderboard (after)
```typescript
// ✅ O(log n) insert, O(log n + k) for top-k
import { TreeMap } from 'data-structure-typed';

const board = new TreeMap<number, string>(
  [[100, 'Alice'], [250, 'Bob']],
  { comparator: (a, b) => b - a, enableOrderStatistic: true }
);
board.rangeByRank(0, 2); // Top 3 in O(log n + k)
```

## Complexity Cheat Sheet

| Operation | Array + sort | TreeMap/TreeSet | Heap |
|-----------|-------------|----------------|------|
| Insert (maintain order) | O(n log n) | O(log n) | O(log n) |
| Get min/max | O(1) | O(log n) | O(1) |
| Delete min/max | O(n) | O(log n) | O(log n) |
| Find by key | O(log n) | O(log n) | O(n) |
| Floor/Ceiling | O(log n) | O(log n) | ❌ |
| Range query | O(log n + k) | O(log n + k) | ❌ |
| Sorted iteration | O(1)* | O(n) | O(n log n) |

*Array is already sorted, so iteration is free — but maintaining that sort is expensive.
