# data-structure-typed — Deep Dive

This document contains the full technical depth of the project.

---

## Design Philosophy

- Uniform APIs across data structures
- Iterator protocol everywhere
- JIT-friendly object layouts

---

## Performance

Benchmarks show significant improvements over native Array and Map
in hot paths such as queueing, ranking, and scheduling.

---

## Data Structures Covered

- Queue / Deque
- Heap / PriorityQueue
- Red-Black Tree / AVL Tree
- Trie
- Graphs
- Linked Lists

---

## Real-World Use Cases

- Leaderboards
- Task schedulers
- Message queues
- Autocomplete systems

---

## Migration Guide

- Replace `Array.shift()` → `Deque`
- Replace `Array.sort()` → `PriorityQueue`
- Replace unordered `Map` → `RedBlackTree`

---

MIT License
