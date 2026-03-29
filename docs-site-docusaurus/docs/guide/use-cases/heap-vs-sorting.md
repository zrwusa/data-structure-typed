---
title: Heap vs Sorting an Array — When to Use Which
description: Compare Heap and Array.sort for priority queues, top-k, and streaming data in JavaScript/TypeScript. Performance analysis and code examples.
keywords: [heap vs sort, array sort performance, priority queue vs sort, top k javascript, heap javascript, when to use heap]
sidebar_label: Heap vs Sorting
---

# Heap vs Sorting an Array

Both can give you ordered data. But they're optimized for different access patterns.

## Quick Answer

- **Need all elements sorted** → sort the array once
- **Need only the min/max repeatedly** → use a Heap
- **Streaming data (elements arrive over time)** → use a Heap
- **Static data, one-time sort** → use Array.sort

## Performance Comparison

| Operation | Array.sort | Heap |
|-----------|-----------|------|
| Sort all elements | O(n log n) | O(n log n) |
| Insert 1 element (keep sorted) | O(n log n) or O(n)* | O(log n) |
| Get min/max | O(1) | O(1) |
| Remove min/max | O(n) | O(log n) |
| Get top-k from n elements | O(n log n) | O(n log k) |

*O(n) if you binary-search + splice; O(n log n) if you push + re-sort.

## Example: Top-K Scores

### Array approach
```typescript
// ❌ Sort everything, take first k
function topK_array(scores: number[], k: number): number[] {
  return scores.sort((a, b) => b - a).slice(0, k);
  // O(n log n) — sorts ALL elements even if k is small
}
```

### Heap approach
```typescript
import { MinHeap } from 'data-structure-typed';

// ✅ Only maintain k elements in the heap
function topK_heap(scores: number[], k: number): number[] {
  const heap = new MinHeap<number>();
  for (const score of scores) {
    heap.add(score);
    if (heap.size > k) heap.poll();
  }
  return heap.toArray().sort((a, b) => b - a);
  // O(n log k) — much faster when k << n
}
```

For 1,000,000 elements with k=10: array sorts all 1M elements. Heap only maintains 10.

## Example: Streaming Data

```typescript
import { MinHeap } from 'data-structure-typed';

// New scores arrive continuously
const liveScores = new MinHeap<number>();

// Each insert: O(log n)
liveScores.add(85);
liveScores.add(92);
liveScores.add(78);

// Current lowest: O(1)
liveScores.peek(); // 78

// Process lowest: O(log n)
liveScores.poll(); // 78
```

With an array, you'd re-sort after every insert — O(n log n) each time.

## When to Use Each

| Scenario | Use Array.sort | Use Heap |
|----------|---------------|----------|
| One-time sort of static data | ✅ | ❌ |
| Repeated insert + get min/max | ❌ | ✅ |
| Top-k from large dataset | ❌ (k << n) | ✅ |
| Streaming / real-time data | ❌ | ✅ |
| Need sorted iteration of ALL elements | ✅ | ❌ |
| Dijkstra / A* algorithm | ❌ | ✅ |
| Simple, small dataset (< 100) | ✅ | Either |
