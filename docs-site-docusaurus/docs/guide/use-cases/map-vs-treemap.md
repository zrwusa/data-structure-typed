---
title: Map vs TreeMap — When Native Map Isn't Enough
description: Compare JavaScript's native Map with TreeMap for sorted collections, range queries, and ordered iteration. Code examples and performance analysis.
keywords: [map vs treemap, javascript map alternative, sorted map javascript, ordered map typescript, treemap performance, when to use treemap]
sidebar_label: Map vs TreeMap
---

# Map vs TreeMap

JavaScript's `Map` is excellent for key-value lookup. But it has no concept of order, range, or proximity. When you need those, use `TreeMap`.

## Feature Comparison

| Feature | Map | TreeMap |
|---------|-----|---------|
| Key-value lookup | O(1) avg | O(log n) |
| Insert / delete | O(1) avg | O(log n) |
| Sorted iteration | ❌ | ✅ |
| Floor (largest key ≤ x) | ❌ | O(log n) |
| Ceiling (smallest key ≥ x) | ❌ | O(log n) |
| Range query | ❌ | O(log n + k) |
| getRank / getByRank | ❌ | O(log n) |
| First / last key | ❌ | O(log n) |
| Memory | Lower | Higher |

## When Map Is the Right Choice

```typescript
// User lookup by ID — order doesn't matter
const users = new Map<string, User>();
users.set('abc123', { name: 'Alice' });
users.get('abc123'); // O(1)
```

Use `Map` when:
- You only need get/set/delete by exact key
- Order doesn't matter
- Performance on individual lookups is critical (O(1) vs O(log n))

## When TreeMap Is the Right Choice

### Sorted iteration
```typescript
import { TreeMap } from 'data-structure-typed';

const config = new TreeMap<string, string>();
config.set('database.host', 'localhost');
config.set('app.name', 'MyApp');
config.set('database.port', '5432');

for (const [key, value] of config) {
  console.log(key, value);
}
// app.name MyApp
// database.host localhost
// database.port 5432
```

### Finding nearest keys
```typescript
const prices = new TreeMap<number, string>();
prices.set(10, 'cheap');
prices.set(50, 'medium');
prices.set(100, 'expensive');

// "What's the price tier for $35?"
prices.floor(35);   // [10, 'cheap'] — largest key ≤ 35
prices.ceiling(35); // [50, 'medium'] — smallest key ≥ 35
```

### Range queries
```typescript
const events = new TreeMap<number, string>();
events.set(1000, 'login');
events.set(2000, 'click');
events.set(3000, 'purchase');
events.set(4000, 'logout');

// Events between t=1500 and t=3500
events.rangeSearch([1500, 3500]); // [[2000, 'click'], [3000, 'purchase']]
```

### Rank queries
```typescript
const leaderboard = new TreeMap<number, string>(
  [[100, 'Alice'], [250, 'Bob'], [180, 'Charlie']],
  { enableOrderStatistic: true }
);

leaderboard.getRank(180);  // 1 — Charlie is at position 1
leaderboard.getByRank(0);  // [100, 'Alice'] — first in tree order
```

## Performance: When Does TreeMap Win?

For pure get/set, Map is faster (O(1) vs O(log n)). TreeMap wins when you need **ordered operations**:

| 10,000 entries | Map | TreeMap |
|----------------|-----|---------|
| set() | ~0.5μs | ~2μs |
| get() | ~0.3μs | ~1.5μs |
| floor() | N/A (manual O(n)) | ~1.5μs |
| rangeSearch() | N/A (manual O(n log n)) | ~5μs + O(k) |
| Sorted iteration | O(n log n) sort first | O(n) |

If you're calling `.floor()` or `.rangeSearch()` frequently, TreeMap is orders of magnitude faster than manually sorting Map keys every time.

## Set vs TreeSet — Same Story

| Feature | Set | TreeSet |
|---------|-----|---------|
| Membership check | O(1) avg | O(log n) |
| Sorted iteration | ❌ | ✅ |
| Floor / ceiling | ❌ | O(log n) |
| Range queries | ❌ | O(log n + k) |
| First / last | ❌ | O(log n) |

```typescript
import { TreeSet } from 'data-structure-typed';

const timestamps = new TreeSet<number>([1000, 3000, 2000, 5000]);
[...timestamps]; // [1000, 2000, 3000, 5000]
timestamps.floor(2500); // 2000
timestamps.ceiling(2500); // 3000
```

## Migration Guide: Map → TreeMap

TreeMap implements the same interface patterns as Map:

```typescript
// Map
const map = new Map<string, number>();
map.set('a', 1);
map.get('a');
map.has('a');
map.delete('a');
map.size;
for (const [k, v] of map) { ... }

// TreeMap — same API, plus ordered operations
const tree = new TreeMap<string, number>();
tree.set('a', 1);
tree.get('a');
tree.has('a');
tree.delete('a');
tree.size;
for (const [k, v] of tree) { ... } // sorted!
tree.floor('b');     // bonus
tree.rangeSearch(['a', 'z']); // bonus
```
