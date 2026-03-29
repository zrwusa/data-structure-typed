---
title: Priority Queue in TypeScript — Complete Guide
description: How to implement a priority queue in TypeScript using Heap, MinHeap, and MaxHeap. Covers task scheduling, top-k problems, and Dijkstra's algorithm.
keywords: [priority queue typescript, heap typescript, min heap javascript, max heap javascript, task scheduler, top-k]
sidebar_label: Priority Queue
---

# Priority Queue in TypeScript

A **priority queue** processes elements by priority, not insertion order. In TypeScript, there is no built-in priority queue — but you can use a **Heap** to get O(log n) insert and O(1) access to the highest-priority element.

## The Problem

You have tasks with different priorities. Using a sorted array:

```typescript
// ❌ Array approach — O(n) insert to maintain sorted order
const tasks: [number, string][] = [];

function addTask(priority: number, name: string) {
  tasks.push([priority, name]);
  tasks.sort((a, b) => a[0] - b[0]); // O(n log n) every time!
}
```

With 10,000 tasks, this gets slow fast.

## The Solution

```typescript
import { MinPriorityQueue } from 'data-structure-typed';

// O(log n) insert, O(1) peek, O(log n) poll
const tasks = new MinPriorityQueue<[number, string]>({
  comparator: (a, b) => a[0] - b[0]
});

tasks.add([3, 'Send email']);
tasks.add([1, 'Fix critical bug']);
tasks.add([2, 'Review PR']);

tasks.poll(); // [1, 'Fix critical bug'] — highest priority first
tasks.poll(); // [2, 'Review PR']
tasks.poll(); // [3, 'Send email']
```

## When to Use a Priority Queue

| Scenario | Why Heap? |
|----------|-----------|
| Task scheduling | Process highest-priority task first |
| Top-k elements | Find k largest/smallest in O(n log k) |
| Dijkstra's algorithm | Always expand the nearest unvisited node |
| Event simulation | Process next event by timestamp |
| Median finding | Two heaps (min + max) for O(log n) median |

## MinHeap vs MaxHeap vs Custom

```typescript
import { MinHeap, MaxHeap, Heap } from 'data-structure-typed';

// Numbers — built-in comparison
const minHeap = new MinHeap<number>([5, 3, 8, 1]);
minHeap.peek(); // 1

const maxHeap = new MaxHeap<number>([5, 3, 8, 1]);
maxHeap.peek(); // 8

// Objects — custom comparator
const taskHeap = new Heap<{ priority: number; name: string }>({
  comparator: (a, b) => a.priority - b.priority
});
taskHeap.add({ priority: 2, name: 'Review PR' });
taskHeap.add({ priority: 1, name: 'Fix bug' });
taskHeap.peek(); // { priority: 1, name: 'Fix bug' }
```

## Top-K Problem

Find the 3 highest scores from a stream:

```typescript
import { MinHeap } from 'data-structure-typed';

function topK(stream: number[], k: number): number[] {
  const heap = new MinHeap<number>();
  for (const val of stream) {
    heap.add(val);
    if (heap.size > k) heap.poll(); // remove smallest
  }
  return heap.toArray().sort((a, b) => b - a);
}

topK([3, 1, 4, 1, 5, 9, 2, 6, 5], 3); // [9, 6, 5]
```

Time: O(n log k) — much better than sorting the entire array.

## Complexity

| Operation | Array (sorted) | Heap |
|-----------|---------------|------|
| Insert | O(n) | O(log n) |
| Get min/max | O(1) | O(1) |
| Remove min/max | O(1) | O(log n) |
| Search | O(log n) | O(n) |

## When NOT to Use a Heap

- You need to search for arbitrary elements → use a Tree or HashMap
- You need sorted iteration of all elements → use TreeMap/TreeSet
- Your data is small (< 100 elements) → array sort is fine
- You need both min and max → use two heaps or a TreeMap
