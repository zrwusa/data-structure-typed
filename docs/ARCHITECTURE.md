# ARCHITECTURE: Design & Implementation Details

Understand why this library is designed the way it is, and how it works internally.

**[Back to README](../README.md) • [See Performance](./PERFORMANCE.md) • [Real Examples](./GUIDES.md)**

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [The Big Three Pain Points](#the-big-three-pain-points)
3. [Why Deque is 484x Faster](#why-deque-is-484x-faster)
4. [Iterator Protocol Design](#iterator-protocol-design)
5. [Self-Balancing Strategy](#self-balancing-strategy)
6. [V8 JIT Optimizations](#v8-jit-optimizations)

---

## Design Philosophy

### Core Principles

1. **Practicality**: Follows ES6 standards, ESNext patterns, simple method names
2. **Extensibility**: OOP inheritance for all data structures
3. **Modularization**: Independent NPM packages, no bloat
4. **Efficiency**: Time/space complexity comparable to native JS
5. **Maintainability**: Open-source standards, TDD, CI/CD
6. **Testability**: Automated unit + performance testing
7. **Reusability**: Fully decoupled, minimized side effects
8. **Security**: Read-write separation, safe member access

### API Design: Unified Interface

Instead of learning different APIs for each library:

```javascript
// ❌ Different libraries, different APIs
const queue = new Queue();
queue.enqueue(1);           // Library A
queue.push(1);              // Library B
queue.offer(1);             // Library C (Java style)

// ✅ data-structure-typed: Consistent everywhere
const queue = new Queue();
const deque = new Deque();
const stack = new Stack();

// All use THE SAME 4 methods
queue.push(item);           // Add
deque.unshift(item);        // Add to front
stack.pop();                // Remove
queue.shift();              // Remove from front
```

**Why?** Because developers already know `push`, `pop`, `shift`, `unshift` from Arrays. Zero new mental models needed.

---

## The Big Three Pain Points

### Pain Point 1: Performance Wall

When operations become bottlenecks:

```javascript
// ❌ Repeated sorting slows everything
const scores = [];
for (const game of games) {
  scores.push(game.score);
  scores.sort((a, b) => b - a);  // O(n log n) every time!
}

// ✅ Auto-maintained sorted order
const rankings = new RedBlackTree();
for (const game of games) {
  rankings.set(game.id, game.score);  // O(log n)
}
// Iteration is always sorted!
```

**Real Impact:**
- Competitive programming: TLE → AC (Time Exceeded to Accepted)
- Real-time systems: P99 latency 500ms → 5ms
- Message queues: 100 msg/sec → 10,000 msg/sec

### Pain Point 2: API Chaos

Different libraries use completely different method names:

| Operation | ArrayList | Queue | ArrayDeque | LinkedList |
|---|---|---|---|---|
| Add end | add() | offer() | push() | add() |
| Remove end | remove() | - | pop() | removeLast() |
| Remove start | remove(0) | poll() | removeFirst() | removeFirst() |
| Add start | add(0, e) | offerFirst() | unshift() | addFirst() |

**Result**: Developers must memorize N different APIs.

**Solution**: Use 4 consistent methods everywhere:

```typescript
// Every linear structure uses same API
const deque = new Deque();
const queue = new Queue();
const stack = new Stack();
const list = new DoublyLinkedList();

// All support these 4 methods:
structure.push(item);          // Add to end
structure.pop();               // Remove from end
structure.shift();             // Remove from start
structure.unshift(item);       // Add to start
```

### Pain Point 3: Conversion Hell

Bouncing data between structures wastes cycles:

```javascript
// ❌ Painful way: conversions everywhere
const tree = new TreeLibrary(data);
const filtered = tree.toArray()
  .filter(x => x > 5)           // Convert to Array
  .map(x => x * 2)              // Still Array
  .sort((a, b) => b - a);       // Array sort is O(n log n)

// Lost the tree's sorted benefits!

// ✅ Clean way: operations work directly
const tree = new RedBlackTree(data);
const result = tree
  .filter(x => x > 5)           // Direct on tree
  .map(x => x * 2)              // Still on tree
  .reduce((sum, v) => sum + v); // Still on tree

// Zero conversions, tree structure maintained!
```

---

## Why Deque is 484x Faster

### The Problem: Array.shift()

```javascript
// What happens when you shift from an array:
const arr = [1, 2, 3, 4, 5];
arr.shift();  // Remove 1

// JavaScript engine must:
// 1. Create new memory for index 0
// 2. Copy element 2 → index 0
// 3. Copy element 3 → index 1
// 4. Copy element 4 → index 2
// 5. Copy element 5 → index 3
// 6. Resize array

// For 100,000 elements: O(n) = 100,000 operations each time!
```

Real benchmark:

```javascript
const queue = [];
for (let i = 0; i < 100000; i++) queue.push(i);
for (let i = 0; i < 100000; i++) queue.shift();
// Time: 2829ms for 100,000 shifts ❌
```

### The Solution: Deque's Chunked Rings

```javascript
// Deque implementation strategy:
// Instead of physical array, use chunked buckets

//   bucket[0]      bucket[1]      bucket[2]
// [1,2,3,4,5]    [6,7,8,9,10]   [11,12,13]
//  ^                              
//  head pointer

// When you shift():
// Move pointer forward in bucket
// No copying until bucket is empty!
// Only then delete bucket (batch operation)
```

Benchmark result:

```javascript
const deque = new Deque();
for (let i = 0; i < 100000; i++) deque.push(i);
for (let i = 0; i < 100000; i++) deque.shift();
// Time: 5.83ms for 100,000 shifts ✅

// 2829ms / 5.83ms = 485x faster!
```

### Why This Works

**Batching Operations**: Instead of reindexing on every shift, Deque batches operations into chunks. Only when an entire chunk is consumed does it get cleaned up.

**Memory Locality**: Chunked structure is better for CPU cache than scattered reindexing operations.

**Pointer Movement**: Shifting is just moving a pointer forward in memory, which is a CPU register operation (nanoseconds).

---

## Iterator Protocol Design

### The Hidden Superpower

Every data structure implements JavaScript's iterator protocol:

```javascript
// Why this matters:
const tree = new RedBlackTree([5, 2, 8]);

// All of these work automatically:
[...tree]                      // Spread operator
for (const x of tree) { }      // for...of loop
const [a, b, c] = tree         // Destructuring
new Set(tree)                  // Set constructor
Array.from(tree)               // Array.from

// No special methods needed!
// Just implement Symbol.iterator
```

### Implementation Strategy

```typescript
class CustomStructure<T> {
  private items: T[] = [];

  // One method makes everything work
  *[Symbol.iterator]() {
    for (const item of this.items) {
      yield item;
    }
  }
}

// Now the structure works everywhere:
const struct = new CustomStructure();
struct.push(1, 2, 3);

// All of these work automatically:
[...struct];                   // [1, 2, 3]
for (const x of struct) { }    // Loops 1, 2, 3
```

### Why Iterator Protocol?

1. **Consistency**: Uses same interface as Arrays and Maps
2. **Zero Learning Curve**: Developers already know `for...of`
3. **Interoperability**: Works with spread, destructuring, Set constructor
4. **Future-Proof**: JavaScript standard, not library-specific

---

## Self-Balancing Strategy

### The Problem: Unbalanced Trees

```javascript
// Create an unbalanced tree:
const bst = new BST();
[1, 2, 3, 4, 5].forEach(x => bst.add(x));

//  1
//   \
//    2
//     \
//      3
//       \
//        4
//         \
//          5

// This becomes a linked list! O(n) instead of O(log n)
```

### Red-Black Tree Solution

**Rules:**
1. Every node is either Red or Black
2. Root is always Black
3. Red nodes have Black children (no consecutive Reds)
4. All paths to null have same number of Black nodes

**Result**: Tree height limited to ~2 * log(n), guaranteeing O(log n)

```javascript
const rbTree = new RedBlackTree([1, 2, 3, 4, 5]);

//       3(B)           Balanced!
//      /   \
//    2(B)  4(R)
//    /      \
//  1(R)    5(B)

// Even with sequential inserts: O(log n) guaranteed!
```

### AVL Tree Alternative

**Stricter balance requirement**: Height difference ≤ 1

```javascript
//       3
//      / \
//     2   4
//    /     \
//   1       5

// More strictly balanced = better search
// Trade-off: Slower insertions/deletions (more rebalancing)
```

---

## V8 JIT Optimizations

### How V8 Makes This Fast

```javascript
// V8 JIT optimizes data structures that:
// 1. Have predictable shapes (hidden classes)
// 2. Use consistent types
// 3. Have stable method calls

// ✅ Good for V8 JIT:
class Node {
  constructor(value) {
    this.value = value;    // Always same type
    this.left = null;      // Always null or Node
    this.right = null;     // Always null or Node
  }
}

// ❌ Bad for V8 JIT:
class BadNode {
  constructor(value) {
    this.value = value;
    this.left = value;     // Sometimes Node, sometimes number
    this.meta = null;      // Added dynamically later
  }
}

// Our library uses strict typing for this reason!
```

### Performance Benefit

```javascript
// Predictable structure → V8 caches optimizations
// First call: Interpreted
// Subsequent calls: JIT compiled to native code

// Result: 10-100x faster after warm-up

const tree = new RedBlackTree();
for (let i = 0; i < 1000000; i++) {
  tree.set(i, Math.random());
}
// Becomes near-native speed through JIT!
```

---

## Method Chaining Architecture

### Design Pattern

```typescript
class TreeStructure<K, V> {
  // Methods return `this` for chaining
  filter(predicate: (v: V, k: K) => boolean): this {
    // ... filter logic ...
    return this;  // Return structure, not Array!
  }

  map(mapper: (v: V, k: K) => V): this {
    // ... map logic ...
    return this;  // Chain continues!
  }

  reduce(reducer: (acc: any, v: V, k: K) => any, init: any) {
    // ... reduce logic ...
    return result;  // Terminal operation
  }
}

// Result: Chainable on any structure
tree
  .filter(x => x > 5)
  .map(x => x * 2)
  .reduce((a, v) => a + v, 0);
```

### Why This Matters

Traditional approach loses structure type:

```javascript
// ❌ Loses type information
const result = tree.toArray()  // Now it's Array[]
  .filter(x => x > 5)           // Still Array
  .map(x => x * 2);             // Still Array
// Lost O(log n) properties!

// ✅ Preserves structure
const result = tree
  .filter(x => x > 5)           // Still RedBlackTree
  .map(x => x * 2)              // Still RedBlackTree
  .reduce((a, v) => a + v);
// Properties maintained!
```

---

## Memory Efficiency

### Comparison

| Structure | Overhead | Notes |
|---|---|---|
| Array | Low | Fixed size |
| LinkedList | High | Pointer per node |
| BST | Medium | 2 pointers per node |
| Deque | Very Low | Chunked, batched |
| Heap | Very Low | Array-based |

### Deque Memory Strategy

```javascript
// Instead of one big array:
// [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]

// Use chunks (buckets):
// bucket[0]: [1][2][3][4][5]
// bucket[1]: [6][7][8][9][10]

// Benefits:
// 1. Only allocate chunks needed
// 2. Reuse empty buckets
// 3. Better cache locality
// 4. Less fragmentation
```

---

## Type Safety Architecture

### Generic Type Parameters

```typescript
// Custom object types
interface User {
  id: number;
  name: string;
  age: number;
}

const userTree = new RedBlackTree<number, User>();
userTree.set(1, { id: 1, name: 'Alice', age: 30 });

// Type inference works:
const user = userTree.get(1);  // Type: User | undefined
user?.name;                     // Type-safe access
```

### Comparator Custom Logic

```typescript
// Default comparator (ascending)
const ascTree = new RedBlackTree<number>();

// Custom comparator (descending)
const descTree = new RedBlackTree<number>(
  (a, b) => b - a  // Reverse comparison
);

// Works with any type
const objectTree = new RedBlackTree<CustomObject>(
  (a, b) => a.priority - b.priority
);
```

---

## Summary: Design Checklist

- ✅ Unified API across all structures
- ✅ Iterator protocol implementation
- ✅ Method chaining architecture
- ✅ Self-balancing guarantees
- ✅ V8 JIT-friendly code
- ✅ Memory-efficient algorithms
- ✅ Full TypeScript support
- ✅ Production-ready error handling

---

**Next:** [Check PERFORMANCE.md](./PERFORMANCE.md) for benchmarks.

**Or:** [See GUIDES.md](./GUIDES.md) for implementation examples.
