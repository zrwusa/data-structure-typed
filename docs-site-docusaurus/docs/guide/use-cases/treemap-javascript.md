---
title: TreeMap and TreeSet in JavaScript — The Missing Collections
description: JavaScript doesn't have TreeMap or TreeSet. Here's how to get sorted maps, ordered sets, floor/ceiling lookups, and range queries in TypeScript/JavaScript.
keywords: [treemap javascript, treeset javascript, sorted map typescript, ordered set javascript, java treemap equivalent, sorted collection]
sidebar_label: TreeMap / TreeSet
---

# TreeMap and TreeSet in JavaScript

Java has `TreeMap` and `TreeSet`. C++ has `std::map` and `std::set`. Python has `SortedDict` and `SortedSet`. JavaScript has... nothing built-in for sorted collections.

`Map` and `Set` in JavaScript are **hash-based** — they don't maintain sorted order and don't support range queries, floor/ceiling, or ordered iteration by key.

## The Problem

```typescript
// ❌ Native Map — no sorted iteration, no range queries
const map = new Map<number, string>();
map.set(3, 'c');
map.set(1, 'a');
map.set(2, 'b');
[...map.keys()]; // [3, 1, 2] — insertion order, NOT sorted

// ❌ To find "largest key ≤ 2.5" you'd need to sort all keys first
const keys = [...map.keys()].sort((a, b) => a - b);
// Then binary search... every time. O(n log n).
```

## The Solution

```typescript
import { TreeMap } from 'data-structure-typed';

const map = new TreeMap<number, string>();
map.set(3, 'c');
map.set(1, 'a');
map.set(2, 'b');

// ✅ Sorted iteration
[...map.keys()]; // [1, 2, 3]

// ✅ NavigableMap operations — O(log n)
map.floor(2.5);    // [2, 'b'] — largest key ≤ 2.5
map.ceiling(1.5);  // [2, 'b'] — smallest key ≥ 1.5
map.higher(2);     // [3, 'c'] — smallest key > 2
map.lower(2);      // [1, 'a'] — largest key < 2

// ✅ Range queries
map.rangeSearch([1, 2]); // [[1, 'a'], [2, 'b']]
```

## TreeSet — Sorted Set

```typescript
import { TreeSet } from 'data-structure-typed';

const set = new TreeSet<number>([5, 3, 8, 1, 4]);

[...set]; // [1, 3, 4, 5, 8] — always sorted

set.floor(4.5);   // 4
set.ceiling(3.5); // 4
set.higher(5);    // 8
set.lower(3);     // 1

// First and last
set.first(); // 1
set.last();  // 8
```

## Order-Statistic Operations

Need to know "what's the 3rd element?" or "what rank is this key?"

```typescript
import { TreeMap } from 'data-structure-typed';

const scores = new TreeMap<number, string>(
  [[100, 'Alice'], [250, 'Bob'], [180, 'Charlie']],
  { enableOrderStatistic: true }
);

scores.getByRank(0); // [100, 'Alice'] — first in tree order
scores.getByRank(2); // [250, 'Bob'] — third in tree order
scores.getRank(180); // 1 — Charlie is at position 1
scores.rangeByRank(0, 1); // [[100, 'Alice'], [180, 'Charlie']]
```

## Map vs TreeMap — When to Use Which

| Feature | Map | TreeMap |
|---------|-----|---------|
| Sorted iteration | ❌ | ✅ |
| floor / ceiling | ❌ | ✅ |
| Range queries | ❌ | ✅ |
| getRank / getByRank | ❌ | ✅ |
| Insert / lookup | O(1) avg | O(log n) |
| Memory | Lower | Higher |

**Use Map** when you only need key-value lookup and don't care about order.

**Use TreeMap** when you need sorted keys, range queries, floor/ceiling, or rank operations.

## Real-World Use Cases

### Price book (financial trading)
```typescript
const orderBook = new TreeMap<number, number>(); // price → quantity
orderBook.set(100.5, 200);
orderBook.set(101.0, 150);
orderBook.set(99.5, 300);

// Best bid (highest price)
orderBook.last(); // [101.0, 150]
// All orders between $100 and $101
orderBook.rangeSearch([100, 101]); // [[100.5, 200], [101.0, 150]]
```

### Time-series data
```typescript
const events = new TreeMap<number, string>(); // timestamp → event
events.set(1000, 'start');
events.set(2000, 'checkpoint');
events.set(3000, 'end');

// What happened at or before t=2500?
events.floor(2500); // [2000, 'checkpoint']
```

### Leaderboard
```typescript
const leaderboard = new TreeMap<number, string>(
  [[100, 'Alice'], [250, 'Bob'], [180, 'Charlie']],
  { comparator: (a, b) => b - a, enableOrderStatistic: true }
);

// Top 3
leaderboard.rangeByRank(0, 2);
// [[250, 'Bob'], [180, 'Charlie'], [100, 'Alice']]
```

## Complexity

| Operation | TreeMap | Sorted Array | Native Map |
|-----------|---------|-------------|------------|
| Insert | O(log n) | O(n) | O(1) avg |
| Delete | O(log n) | O(n) | O(1) avg |
| Lookup | O(log n) | O(log n) | O(1) avg |
| Floor/Ceiling | O(log n) | O(log n) | ❌ |
| Sorted iteration | O(n) | O(n) | ❌ |
| Range query | O(log n + k) | O(log n + k) | ❌ |
