# DEEP DIVE: Complete data-structure-typed Guide

This is the comprehensive guide containing all detailed explanations, benchmarks, patterns, and real-world examples.

**👈 Looking for quick start?** → [Back to README.md](./README.md)

---

## Table of Contents

1. [Quick Start (3 minutes)](#quick-start-3-minutes-to-productivity)
2. [Why Choose This Library](#why-data-structure-typed)
3. [Plain Language Explanations](#-plain-language-explanations)
4. [Code Patterns](#-code-snippets-patterns--examples)
5. [CRUD Operations](#-crud-operations-basic-usage-examples)
6. [Real-World Examples](#-real-world-examples-production-code)
7. [Performance Comparison](#-performance-comparison)
8. [Integration Examples](#-integration-examples)
9. [Migration Guide](#-migration-guide-from-native-js)
10. [Data Structures List](#-data-structures-available)
11. [Decision Guide](#-decision-guide-choose-the-right-data-structure)
12. [TypeScript Support](#-typescript-support)
13. [LeetCode Cheatsheet](#-leetcode--algorithm-cheatsheet)

---

## Quick Start: 3 Minutes to Productivity

### Scenario 1: High-Performance Queue

**Problem**: You need to frequently remove elements from the front of a list.

❌ This is slow with Array:

```javascript
const queue = [1, 2, 3, 4, 5];
queue.shift();  // O(n) - Reindexes all remaining elements!
```

✅ This is fast with Deque:

```javascript
import { Deque } from 'data-structure-typed';

const deque = new Deque([1, 2, 3, 4, 5]);
deque.shift();  // O(1) - Just moves a pointer
deque.print();  // [2, 3, 4, 5]
```

### Scenario 2: Sorted Data with Fast Lookups

**Problem**: You need to maintain sorted data and query it efficiently.

❌ Array requires manual sorting:

```javascript
const arr = [5, 2, 8, 1, 9];
arr.includes(3);  // O(n) - Must check every element
```

✅ RedBlackTree maintains sorted order automatically:

```javascript
import { RedBlackTree } from 'data-structure-typed';

const tree = new RedBlackTree([5, 2, 8, 1, 9]);
tree.has(3);      // O(log n) - Logarithmic search

// Iterating tree is already sorted
for (const [key] of tree) {
  console.log(key);  // 1, 2, 5, 8, 9 (automatically sorted!)
}
```

### Scenario 3: Priority Queue

**Problem**: Process items by priority, not insertion order.

❌ Array requires re-sorting:

```javascript
const tasks = [];

function addTask(task) {
  tasks.push(task);
  tasks.sort((a, b) => b.priority - a.priority);  // O(n log n) every time!
}
```

✅ PriorityQueue maintains priority automatically:

```javascript
import { MaxPriorityQueue } from 'data-structure-typed';

const pq = new MaxPriorityQueue([], {
  comparator: (a, b) => b.priority - a.priority,
});

function addTask(task) {
  pq.add(task);  // O(log n)
}

const nextTask = pq.poll(); // Always get highest priority
```

### Scenario 4: Prefix Matching (Autocomplete)

**Problem**: Fast prefix searching in large dictionaries.

```javascript
import { Trie } from 'data-structure-typed';

const dictionary = new Trie(['apple', 'app', 'apply', 'application']);

const suggestions = dictionary.getWords('appl');
// Returns: ['apple', 'apply', 'application']
// Time: O(m + k) where m is prefix length, k is results
```

### Scenario 5: Graph Algorithms

**Problem**: Pathfinding or cycle detection.

```javascript
import { DirectedGraph } from 'data-structure-typed';

const graph = new DirectedGraph();
graph.addVertex('A');
graph.addVertex('B');
graph.addEdge('A', 'B', 1);

const { minDist, minPath } = graph.dijkstra('A', 'B', true, true);
```

---

## Why data-structure-typed?

> All data structures in JavaScript should work like native Array.
> No more API chaos. No more conversions. No more frustration.

### Three Pain Points Every Developer Faces

#### 1️⃣ Performance Wall: When Operations Become Bottlenecks

❌ The Problem: Array.shift() is O(n):

```javascript
const queue = [1, 2, 3, ..., 100000];
for (let i = 0; i < 100000; i++) {
  queue.shift();  // Reindexes all remaining elements!
}
// Time: 2829ms for 100K items ❌
// Impact: Timeout, failed test
```

✅ The Solution: Use Deque:

```javascript
import { Deque } from 'data-structure-typed';

const deque = new Deque([1, 2, 3, ..., 100000]);
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1) - Just moves a pointer
}
// Time: 5.83ms for 100K items ✅
// Speedup: 484x faster! 🚀
```

**Real-world impact:**

- Competitive programming: TLE ❌ → AC ✅
- Real-time systems: P99 latency 500ms ❌ → 5ms ✅
- Message queues: Throughput 100/sec ❌ → 10,000/sec ✅

#### 2️⃣ API Chaos: Learning a New API for Every Data Structure

❌ Different libraries use different APIs:

```javascript
// Library 1: Uses offer/poll (Java-style)
queue.offer(item);
queue.poll();

// Library 2: Uses push/shift
queue.push(item);
queue.shift();

// Library 3: Uses enqueue/dequeue
queue.enqueue(item);
queue.dequeue();
```

✅ Our library uses consistent APIs everywhere:

In Java, you need different methods for Queue, Deque, LinkedList:

| Java ArrayList  | Java Queue | Java ArrayDeque | Java LinkedList |
|-----------------|------------|-----------------|-----------------| 
| add             | offer      | push            | push            |
| remove          | poll       | removeLast      | removeLast      |
| remove          | poll       | removeFirst     | removeFirst     |
| add(0, element) | offerFirst | unshift         | unshift         |

**In data-structure-typed, you only need to remember four methods**: `push`, `pop`, `shift`, and `unshift` for all linear structures (Queue, Deque, DoublyLinkedList, SinglyLinkedList, Stack):

```javascript
// ALL linear structures use THE SAME 4 methods
const deque = new Deque([1, 2, 3]);
const queue = new Queue([1, 2, 3]);
const stack = new Stack([1, 2, 3]);
const list = new DoublyLinkedList([1, 2, 3]);

// They ALL support:
structure.push(item);           // Add to end
structure.pop();                // Remove from end
structure.shift();              // Remove from start
structure.unshift(item);        // Add to start

// And ALL support Array's advanced methods
structure.map((_value, key) => key * 2);
structure.filter((_value, key) => key > 5);
structure.reduce((acc, _value, key) => acc + key, 0);
```

#### 3️⃣ Conversion Hell: Bouncing Data Between Structures

❌ The Painful Way:

```javascript
const scores = [95, 23, 67, 89, 12, 45];
const tree = new SomeTreeLibrary(scores);

const filtered = tree.toArray().filter(s => s > 50);  // Convert to array
const mapped = filtered.map(s => s * 2);              // Another conversion
// Multiple conversions, lost benefits, easy to make mistakes
```

✅ The Clean Way:

```javascript
const tree = new RedBlackTree(scores);

// All methods work DIRECTLY on the tree
const result = tree
  .filter((_value, key) => key > 50)              // Direct
  .map((_value, key) => [key, key * 1])           // Direct
  .reduce((acc, value) => acc + (value ?? 0), 0); // Direct

// ✅ Zero conversions, tree structure maintained
```

---

## 🔗 Seamless Interoperability: Iterator Protocol Everywhere

### The Hidden Superpower

Every single data structure implements the **Iterator protocol**:

- ✅ Spread operator: `[...tree]`
- ✅ for...of loops: `for (const item of tree)`
- ✅ Destructuring: `const [a, b, c] = tree`
- ✅ Array.from(): `Array.from(tree)`
- ✅ Set/Map constructors: `new Set(tree)`

### Iterator Support Comparison

| Feature              | Array | Map  | Set | Other Lib | data-structure-typed |
|----------------------|-------|------|-----|-----------|----------------------|
| Spread operator      | ✅     | ❌/⚠️ | ✅   | ❌/⚠️      | ✅                    |
| for...of loop        | ✅     | ✅    | ✅   | ❌/⚠️      | ✅                    |
| Destructuring        | ✅     | ❌    | ❌   | ❌         | ✅                    |
| Array.from()         | ✅     | ❌/⚠️ | ❌   | ❌/⚠️      | ✅                    |
| Set constructor      | ✅     | ❌    | ✅   | ❌         | ✅                    |
| **Full Integration** | ✅     | ⚠️   | ⚠️  | ⚠️        | **✅**                |

### Live Examples: Zero Friction Conversions

#### Example 1: Array to Tree to Array

```javascript
const array = [64, 34, 25, 12, 22, 11, 90];
const rbTree = new RedBlackTree(array);
const sorted = [...rbTree.keys()];
console.log(sorted);  // [11, 12, 22, 25, 34, 64, 90] ✅
```

#### Example 2: Extract Keys and Values

```javascript
const rbTree = new RedBlackTree([
  [1, 'Alice'],
  [2, 'Bob'],
  [3, 'Charlie']
]);

const allKeys = [...rbTree.keys()];      // [1, 2, 3]
const allValues = [...rbTree.values()];  // ['Alice', 'Bob', 'Charlie']
```

#### Example 3: for...of on Any Structure

```javascript
const tree = new RedBlackTree(entries);
const deque = new Deque(items);
const heap = new MaxHeap(items);

for (const entry of tree) console.log(entry);
for (const item of deque) console.log(item);
for (const item of heap) console.log(item);
```

---

## 🎁 All Array Methods Work Everywhere

### The Biggest Developer Joy: Array Methods, Everywhere

You know these methods. You use them every day. They work on **every data structure**:

#### Chain on Tree

```typescript
const rbTree = new RedBlackTree([
  [1, { name: 'Alice', age: 25 }],
  [2, { name: 'Bob', age: 30 }],
  [3, { name: 'Charlie', age: 28 }],
]);

const result = rbTree
  .filter((value, _key) => (value?.age ?? 0) > 26)
  .map((value, key) => [key, { ...value, id: key }])
  .reduce((sum, value) => sum + (value?.age ?? 0), 0);

console.log(result); // 58 ✅
```

#### Chain on Heap

```typescript
const minHeap = new Heap([
  { priority: 5, task: 'Email' },
  { priority: 3, task: 'Chat' },
  { priority: 8, task: 'Alert' },
], { comparator: (a, b) => a.priority - b.priority });

const urgent = minHeap
  .filter((value, _key) => value.priority > 4)
  .map((value, _key) => value.task);

urgent.print(); // ['Alert', 'Email'] ✅
```

#### Chain on Deque

```typescript
const deque = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const stats = {
  even: deque.filter((value, _key) => value % 2 === 0).toArray(),
  squared: deque.map((value, _key) => value * value).toArray(),
  hasLarge: deque.some((value, _key) => value > 8),
  sum: deque.reduce((acc, value, _key) => acc + value, 0),
};
```

### Supported Methods Across All Structures

| Method      | BinaryTrees | Heap | Deque | Graph | LinkedList |
|-------------|-------------|------|-------|-------|------------|
| map         | ✅           | ✅    | ✅     | ✅     | ✅          |
| filter      | ✅           | ✅    | ✅     | ✅     | ✅          |
| reduce      | ✅           | ✅    | ✅     | ✅     | ✅          |
| find        | ✅           | ✅    | ✅     | ✅     | ✅          |
| some/every  | ✅           | ✅    | ✅     | ✅     | ✅          |
| keys/values | ✅           | ✅    | ✅     | ✅     | ✅          |
| forEach     | ✅           | ✅    | ✅     | ✅     | ✅          |

---

## Why Not Just Use Native JavaScript?

### Case 1: Map Doesn't Maintain Sorted Order

❌ Map iteration is insertion order, not key order:

```javascript
const map = new Map([[5, 'E'], [2, 'B'], [8, 'H'], [1, 'A']]);
for (const [key, value] of map) {
  console.log(key);  // 5, 2, 8, 1 (insertion order)
}
```

✅ RedBlackTree maintains sorted order automatically:

```javascript
const tree = new RedBlackTree([[5, 'E'], [2, 'B'], [8, 'H'], [1, 'A']]);
for (const [key, value] of tree) {
  console.log(key);  // 1, 2, 5, 8 (key order) ✅
}
```

### Case 2: Array.shift is Too Slow

❌ Array.shift is O(n):

```javascript
const queue = [];
for (let i = 0; i < 100000; i++) queue.push(i);
for (let i = 0; i < 100000; i++) queue.shift();
// Time: 2829ms ❌
```

✅ Deque.shift is O(1):

```javascript
const deque = new Deque();
for (let i = 0; i < 100000; i++) deque.push(i);
for (let i = 0; i < 100000; i++) deque.shift();
// Time: 5.83ms ✅
```

### Case 3: Maintaining Priority is Manual

❌ Array requires re-sorting O(n log n):

```javascript
const tasks = [];

function addTask(task) {
  tasks.push(task);
  tasks.sort((a, b) => b.priority - a.priority);
}
```

✅ PriorityQueue maintains priority O(log n):

```javascript
const pq = new MaxPriorityQueue();

function addTask(task) {
  pq.add(task);  // O(log n)
}
```

### Case 4: Range Queries are Tedious

❌ Array.filter is O(n):

```javascript
const prices = [10, 45, 23, 67, 89, 12, 54, 33, 78];
const inRange = prices.filter(p => p >= 30 && p <= 70);
```

✅ RedBlackTree range queries are O(log n + k):

```javascript
const tree = new RedBlackTree(prices.map((p, i) => [p, i]));
const inRange = tree.filter((_value, p) => p >= 30 && p <= 70);
```

### Case 5: Prefix Matching is Tedious

❌ Array.filter is O(n*m):

```javascript
const words = ['apple', 'app', 'apply', 'application'];
const matches = words.filter(w => w.startsWith('app'));
// For 1M words: checks 1M words ❌
```

✅ Trie prefix matching is O(m + k):

```javascript
const trie = new Trie(words);
const matches = trie.getWords('appl');
// O(5 + 4) = 9 operations ✅
```

---

## 🌍 Plain Language Explanations

For those who love understanding concepts through metaphors:

| Data Structure | Plain Language Definition | Example |
|---|---|---|
| **Linked List** | A line of bunnies, where each bunny holds the tail of the bunny in front of it. You want to find a bunny named Pablo, and you have to start searching from the first bunny. If it's not Pablo, you continue following that bunny's tail to the next one. So, you might need to search n times to find Pablo (O(n) time complexity). If you want to insert a bunny named Remi between Pablo and Vicky, it's very simple. You just need to let Vicky release Pablo's tail, let Remi hold Pablo's tail, and then let Vicky hold Remi's tail (O(1) time complexity). | To find bunny "Pablo", start from the first bunny and follow tails until found |
| **Array** | A line of numbered bunnies. If you want to find the bunny named Pablo, you can directly shout out Pablo's number 0680 (finding the element directly through array indexing, O(1) time complexity). However, if you don't know Pablo's number, you still need to search one by one (O(n) time complexity). Moreover, if you want to add a bunny named Vicky behind Pablo, you will need to renumber all the bunnies after Vicky (O(n) time complexity). | Finding element by index is instant, but inserting in the middle is slow |
| **Queue** | A line of numbered bunnies with a sticky note on the first bunny. For this line with a sticky note on the first bunny, whenever we want to remove a bunny from the front of the line, we only need to move the sticky note to the face of the next bunny without actually removing the bunny to avoid renumbering all the bunnies behind (removing from the front is also O(1) time complexity). For the tail of the line, we don't need to worry because each new bunny added to the tail is directly given a new number (O(1) time complexity) without needing to renumber all the previous bunnies. | Process items in FIFO order, efficiently from both ends |
| **Deque** | A line of grouped, numbered bunnies with a sticky note on the first bunny. For this line, we manage it by groups. Each time we remove a bunny from the front of the line, we only move the sticky note to the next bunny. This way, we don't need to renumber all the bunnies behind the first bunny each time a bunny is removed. Only when all members of a group are removed do we reassign numbers and regroup. The tail is handled similarly. This is a strategy of delaying and batching operations to offset the drawbacks of the Array data structure that requires moving all elements behind when inserting or deleting elements in the middle. | Efficient removal/insertion from both ends with batching optimization |
| **Stack** | A line of bunnies in a dead-end tunnel, where bunnies can only be removed from the tunnel entrance (end), and new bunnies can only be added at the entrance (end) as well. | Process items in LIFO order; undo/redo functionality |
| **Binary Tree** | A tree where each node has at most two children. | Hierarchical data organization |
| **Binary Search Tree** | A tree where all nodes in the left subtree are less than the node, and all nodes in the right subtree are greater than the node. Maintaining O(log n) for all operations. | Efficient search/insert/delete without re-sorting |
| **Red-Black Tree** | A self-balancing BST that automatically maintains balance through color-coding rules. | Used in Java TreeMap and maintains O(log n) guarantees |
| **AVL Tree** | A stricter self-balancing BST with stricter balance requirements than Red-Black trees. | Maximum search speed with slower insertions/deletions |
| **Heap** | A special binary tree stored in an array where parent always maintains priority relationship to children. | Efficient priority queue; heap sort |
| **Trie** | A tree of characters used for prefix-based searching. | Autocomplete, spell checking |
| **Graph** | A network of vertices (nodes) connected by edges. | Model relationships, networks |

---

## 💻 Code Snippets: Patterns & Examples

### Pattern 1: Interoperability & Iterator Conversion

```typescript
import { RedBlackTree } from 'data-structure-typed';

const numbers = [6, 1, 2, 7, 5, 3, 4, 9, 8];

// Create sorted tree
const tree = new RedBlackTree(numbers);

// Convert to array (spread operator)
const sorted = [...tree];
console.log(sorted);  // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Iterate with for...of
for (const item of tree) {
  console.log(item);
}

// Get keys/values separately
const keys = [...tree.keys()];
const values = [...tree.values()];

// Destructuring works
const [first, second, ...rest] = tree;

// Works with native JavaScript
const json = JSON.stringify([...tree]);
const set = new Set(tree.keys());
```

### Pattern 2: Method Chaining on Exotic Structures

❌ Before (Array with shift):

```javascript
const queue = [1, 2, 3, 4, 5];
for (let i = 0; i < 100000; i++) {
  queue.shift();  // O(n)
}
```

✅ After (Deque):

```javascript
import { Deque } from 'data-structure-typed';

const deque = new Deque([1, 2, 3, 4, 5]);
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1)
}
```

### Pattern 3: Seamless Structure Conversion

```typescript
import { RedBlackTree, MaxHeap, Deque } from 'data-structure-typed';

const data = [64, 34, 25, 12, 22, 11, 90];

// Array → Tree for sorting
const tree = new RedBlackTree(data);
console.log([...tree.keys()]);  // [11, 12, 22, 25, 34, 64, 90]

// Tree → Heap for priority
const heap = new MaxHeap([...tree.keys()]);

// Heap → Deque for queue operations
const deque = new Deque([...heap]);

// Back to Array for final output
const result = [...deque];
```

### Pattern 4: Query and Analysis

#### Tree Example

```typescript
const tree = new RedBlackTree<number, { name: string; score: number }>();
tree.add(1, { name: 'Alice', score: 95 });
tree.add(2, { name: 'Bob', score: 87 });
tree.add(3, { name: 'Charlie', score: 92 });

const totalHighScore = tree
  .filter((value, _key) => (value?.score ?? 0) >= 85)
  .map((value, key) => [key, value?.score ?? 0])
  .reduce((sum, score) => sum + (score ?? 0), 0);

console.log(totalHighScore);  // 274
```

#### Heap Example

```typescript
const heap = new MaxHeap([
  { priority: 5, task: 'Email' },
  { priority: 8, task: 'Alert' },
], { comparator: (a, b) => b.priority - a.priority });

const urgentTasks = heap
  .filter((value, _key) => value.priority >= 8)
  .map((value, _key) => [value.priority, value.task]);
```

#### Deque Example

```typescript
const deque = new Deque<number>([1, 2, 3, 4, 5]);

const evenSum = deque
  .filter((value, _key) => value % 2 === 0)
  .map((value, _key) => value * 2)
  .reduce((sum, value) => sum + value, 0);
```

---

## 📚 CRUD Operations: Basic Usage Examples

### Red Black Tree CRUD

#### TS

```ts
import { RedBlackTree } from 'data-structure-typed';

const rbTree = new RedBlackTree<number>();

// CREATE: Add elements
rbTree.add(11);
rbTree.add(3);
rbTree.addMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

// READ: Query elements
rbTree.has(6);                     // true
rbTree.size === 16;                // true
const node6 = rbTree.getNode(6);   // BSTNode
rbTree.getHeight(6) === 2;         // true (height of node with key 6)
rbTree.getHeight() === 5;          // true (tree height)

// UPDATE: Delete elements
rbTree.delete(6);
rbTree.get(6);                     // undefined

// Query after update
rbTree.getLeftMost()?.key === 1;   // true
rbTree.isAVLBalanced();            // true

rbTree.print()
//       ______________11_____           
//      /                     \          
//   ___3_______            _13_____
//  /           \          /        \    
//  1_     _____8____     12      _15__
//    \   /          \           /     \ 
//    2   4_       _10          14    16
//          \     /                      
//          5_    9
//            \                          
//            7
```

#### JS

```js
import { RedBlackTree } from 'data-structure-typed';

const rbTree = new RedBlackTree();

// CREATE
rbTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

// READ
rbTree.has(6);                 // true
const height = rbTree.getHeight();  // 5

// UPDATE
rbTree.delete(10);
rbTree.isAVLBalanced();        // true

// PRINT
rbTree.print();
```

### BST CRUD with Custom Objects

```ts
import { BST, BSTNode } from 'data-structure-typed';

const bst = new BST<number, { height: number, age: number }>();

// CREATE
bst.add(11, { "name": "Pablo", "size": 15 });
bst.add(3, { "name": "Kirk", "size": 1 });

bst.addMany(
  [15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5],
  [
    { "name": "Alice", "size": 15 },
    { "name": "Bob", "size": 1 },
    { "name": "Charlie", "size": 8 },
    { "name": "David", "size": 13 },
    { "name": "Emma", "size": 16 },
    { "name": "Frank", "size": 2 },
    { "name": "Grace", "size": 6 },
    { "name": "Hannah", "size": 9 },
    { "name": "Isaac", "size": 12 },
    { "name": "Jack", "size": 14 },
    { "name": "Katie", "size": 4 },
    { "name": "Liam", "size": 7 },
    { "name": "Mia", "size": 10 },
    { "name": "Noah", "size": 5 }
  ]
);

// READ
const value = bst.get(11);     // { "name": "Pablo", "size": 15 }
const has11 = bst.has(11);     // true

// UPDATE
bst.delete(11);

// VERIFY
const afterDelete = bst.has(11);  // false
```

### Queue/Deque CRUD

```ts
import { Queue, Deque } from 'data-structure-typed';

const queue = new Queue([1, 2, 3, 4, 5]);

// CREATE/ADD
queue.push(6);                 // O(1)

// READ
const front = queue.peek();    // 1
const size = queue.size;       // 6

// REMOVE
const removed = queue.shift(); // O(1) - removes 1
queue.pop();                   // O(1) - removes last

// Same API for Deque
const deque = new Deque([1, 2, 3, 4, 5]);
deque.push(6);
deque.unshift(0);              // Add to front
deque.pop();                   // Remove from end
deque.shift();                 // Remove from front
```

### Graph CRUD

```ts
import { DirectedGraph } from 'data-structure-typed';

const graph = new DirectedGraph<string>();

// CREATE
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');

// CONNECT
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');
graph.addEdge('A', 'C');

// READ
graph.hasVertex('A');          // true
graph.hasEdge('A', 'B');       // true
const neighbors = graph.getNeighbors('A');  // ['B', 'C']

// UPDATE
graph.deleteEdgeSrcToDest('A', 'C');
graph.hasEdge('A', 'C');       // false

// ALGORITHMS
const topologicalOrder = graph.topologicalSort();
const { minDist, minPath } = graph.dijkstra('A', 'C');
```

---

## 📚 Real-World Examples: Production Code

### Example 1: Message Queue - Order Processing

```typescript
import { Deque } from 'data-structure-typed';

interface Order {
  id: string;
  customerId: string;
  priority: 'normal' | 'urgent';
}

class OrderProcessor {
  private normalQueue = new Deque<Order>();
  private urgentQueue = new Deque<Order>();
  private running = false;

  constructor(private readonly urgentBurst: number = 5) {
  }

  addOrder(order: Order): void {
    if (order.priority === 'urgent') {
      this.urgentQueue.push(order);
    } else {
      this.normalQueue.push(order);
    }
    void this.processOrders();
  }

  async processOrders(): Promise<void> {
    if (this.running) return;
    this.running = true;

    try {
      let urgentStreak = 0;

      while (!this.urgentQueue.isEmpty() || !this.normalQueue.isEmpty()) {
        const shouldTakeUrgent =
          !this.urgentQueue.isEmpty() &&
          (urgentStreak < this.urgentBurst || this.normalQueue.isEmpty());

        const order = shouldTakeUrgent ? this.urgentQueue.shift() : this.normalQueue.shift();
        if (!order) continue;

        urgentStreak = order.priority === 'urgent' ? urgentStreak + 1 : 0;

        try {
          await this.processOrder(order);
        } catch (err) {
          console.error(`FAILED`, order.id, err);
        }
      }
    } finally {
      this.running = false;
    }
  }

  private async processOrder(order: Order): Promise<void> {
    await new Promise<void>(r => setTimeout(r, 10));
    console.log(
      `OK [${order.priority.toUpperCase()}] order:${order.id} customer:${order.customerId}`
    );
  }
}
```

### Example 2: LRU Cache

```typescript
class LRUCache<T> {
  private cache = new DoublyLinkedList<[string, T]>();
  private map = new Map<string, any>();
  private maxSize = 100;

  get(key: string): T | null {
    const node = this.map.get(key);
    if (!node) return null;

    this.cache.delete(node);
    const newNode = this.cache.push(key, node.value[1]);
    this.map.set(key, newNode);
    return node.value[1];
  }

  set(key: string, value: T): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      this.cache.delete(node);
    }

    const node = this.cache.push(key, value);
    this.map.set(key, node);

    if (this.cache.length > this.maxSize) {
      const oldest = this.cache.shift();
      if (oldest) {
        this.map.delete(oldest[0]);
      }
    }
  }
}

// Why DoublyLinkedList?
// - O(1) delete from any position
// - O(1) push to end
// - Perfect for LRU implementation
```

### Example 3: Leaderboard System

```typescript
import { RedBlackTree } from 'data-structure-typed';

interface Player {
  id: string;
  name: string;
  score: number;
}

class Leaderboard {
  private scoreTree = new RedBlackTree<number, Player>();
  private playerMap = new Map<string, number>();

  updateScore(playerId: string, newScore: number): void {
    if (this.playerMap.has(playerId)) {
      const oldScore = this.playerMap.get(playerId)!;
      this.scoreTree.delete(oldScore);
    }

    const player: Player = { id: playerId, name: playerId, score: newScore };
    this.scoreTree.add(newScore, player);
    this.playerMap.set(playerId, newScore);
  }

  getTopN(n: number): Player[] {
    return [...this.scoreTree.values()].reverse().slice(0, n) as Player[];
  }

  getRank(playerId: string): number | null {
    const score = this.playerMap.get(playerId);
    if (score === undefined) return null;

    const higherScores = [...this.scoreTree.keys()].filter(s => s > score).length;
    return higherScores + 1;
  }
}

// Why RedBlackTree?
// - Automatically maintains sorted order
// - O(log n) insertions and deletions
// - O(log n) searches
// - Perfect for real-time rankings
```

### Example 4: Task Scheduler with Priority Queue

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

interface Task {
  id: string;
  priority: number;
  action: () => Promise<void>;
}

class TaskScheduler {
  private maxPQ = new MaxPriorityQueue<Task>([], {
    comparator: (a, b) => b.priority - a.priority,
  });

  addTask(task: Task): void {
    this.maxPQ.add(task);
  }

  async start(): Promise<void> {
    while (!this.maxPQ.isEmpty()) {
      const task = this.maxPQ.poll();
      if (!task) break;

      try {
        await task.action();
        console.log(`Task ${task.id} completed (priority: ${task.priority})`);
      } catch (error) {
        console.error(`Task ${task.id} failed (priority: ${task.priority}):`, error);
      }
    }
  }
}
```

### Example 5: Search Index - Autocomplete

```typescript
import { Trie } from 'data-structure-typed';

class SearchIndex {
  private trie = new Trie();

  indexDocument(docId: number, content: string): void {
    const words = content.toLowerCase().split(/\s+/);

    for (const word of words) {
      const existing = this.trie.get(word);
      if (!existing) {
        this.trie.set(word, [docId]);
      } else {
        if (!existing.includes(docId)) {
          existing.push(docId);
        }
        this.trie.set(word, existing);
      }
    }
  }

  autocomplete(prefix: string): string[] {
    return this.trie.getWordsWithPrefix(prefix.toLowerCase());
  }

  search(word: string): number[] {
    return this.trie.get(word.toLowerCase()) ?? [];
  }
}

// Why Trie?
// - O(m + k) prefix search (m = prefix length, k = results)
// - Perfect for autocomplete
// - Scales to millions of words
```

---

## 📊 Performance Comparison


### Full Benchmark Results (DetailedHTML Tables)

[//]: # (No deletion!!! Start of Replace Section)

<h2>red-black-tree</h2><table><thead><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>1,000,000 add</td><td>410.34</td><td>0.41</td><td>0.01</td></tr><tr><td>1,000,000 get</td><td>5.20</td><td>0.01</td><td>8.16e-5</td></tr><tr><td>1,000,000 iterator</td><td>154.25</td><td>0.15</td><td>0.02</td></tr><tr><td>CPT 1,000,000 add</td><td>656.43</td><td>0.66</td><td>0.00</td></tr><tr><td>CPT 1,000,000 add</td><td>684.17</td><td>0.68</td><td>0.01</td></tr></tbody></table><h2>queue</h2><table><thead><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>1,000,000 push</td><td>26.97</td><td>0.03</td><td>0.00</td></tr><tr><td>100,000 push & shift</td><td>2.87</td><td>0.00</td><td>2.71e-4</td></tr><tr><td>Native JS Array 100,000 push & shift</td><td>1120.94</td><td>1.12</td><td>0.20</td></tr></tbody></table><h2>deque</h2><table><thead><tr><th>test
name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>1,000,000 push</td><td>8.75</td><td>0.01</td><td>6.99e-4</td></tr><tr><td>1,000,000 push & pop</td><td>12.95</td><td>0.01</td><td>4.21e-4</td></tr><tr><td>1,000,000 push & shift</td><td>13.73</td><td>0.01</td><td>4.53e-4</td></tr><tr><td>100,000 push & shift</td><td>1.36</td><td>0.00</td><td>5.42e-5</td></tr><tr><td>Native JS Array 100,000 push & shift</td><td>1167.06</td><td>1.17</td><td>0.26</td></tr><tr><td>100,000 unshift & shift</td><td>1.31</td><td>0.00</td><td>4.73e-5</td></tr><tr><td>Native JS Array 100,000 unshift & shift</td><td>1911.47</td><td>1.91</td><td>0.02</td></tr></tbody></table><h2>heap</h2><table><thead><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>100,000 add</td><td>4.60</td><td>0.00</td><td>1.07e-4</td></tr><tr><td>100,000 add & poll</td><td>16.96</td><td>0.02</td><td>
3.45e-4</td></tr></tbody></table><h2>avl-tree</h2><table><thead><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>100,000 add randomly</td><td>324.51</td><td>0.32</td><td>0.01</td></tr><tr><td>100,000 add</td><td>299.76</td><td>0.30</td><td>0.02</td></tr><tr><td>100,000 get</td><td>0.26</td><td>2.58e-4</td><td>3.65e-6</td></tr><tr><td>100,000 getNode</td><td>169.33</td><td>0.17</td><td>0.00</td></tr><tr><td>100,000 iterator</td><td>14.43</td><td>0.01</td><td>0.00</td></tr><tr><td>100,000 add & delete orderly</td><td>434.44</td><td>0.43</td><td>0.01</td></tr><tr><td>100,000 add & delete randomly</td><td>541.78</td><td>0.54</td><td>0.01</td></tr></tbody></table><h2>hash-map</h2><table><thead><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>1,000,000 set</td><td>43.23</td><td>0.04</td><td>0.01</td></tr><tr><td>Native JS Map 1,000,000
set</td><td>147.12</td><td>0.15</td><td>0.01</td></tr><tr><td>Native JS Set 1,000,000 add</td><td>116.18</td><td>0.12</td><td>0.01</td></tr><tr><td>1,000,000 set & get</td><td>46.39</td><td>0.05</td><td>0.01</td></tr><tr><td>Native JS Map 1,000,000 set & get</td><td>196.92</td><td>0.20</td><td>0.01</td></tr><tr><td>Native JS Set 1,000,000 add & has</td><td>163.92</td><td>0.16</td><td>0.01</td></tr><tr><td>1,000,000 ObjKey set & get</td><td>243.36</td><td>0.24</td><td>0.03</td></tr><tr><td>Native JS Map 1,000,000 ObjKey set & get</td><td>211.66</td><td>0.21</td><td>0.02</td></tr><tr><td>Native JS Set 1,000,000 ObjKey add & has</td><td>196.57</td><td>0.20</td><td>0.01</td></tr></tbody></table><h2>directed-graph</h2><table><thead><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>1,000 addVertex</td><td>0.05</td><td>4.60e-5</td><td>6.59e-7</td></tr><tr><td>1,000 addEdge</td><td>3.02</td><td>0.00</td><td>
2.85e-4</td></tr><tr><td>1,000 getVertex</td><td>0.04</td><td>3.77e-5</td><td>4.66e-7</td></tr><tr><td>1,000 getEdge</td><td>41.48</td><td>0.04</td><td>0.01</td></tr><tr><td>tarjan</td><td>240.33</td><td>0.24</td><td>0.01</td></tr><tr><td>topologicalSort</td><td>195.62</td><td>0.20</td><td>0.01</td></tr></tbody></table><h2>trie</h2><table><thead><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>100,000 push</td><td>27.15</td><td>0.03</td><td>6.61e-4</td></tr><tr><td>100,000 getWords</td><td>41.18</td><td>0.04</td><td>0.00</td></tr></tbody></table><h2>stack</h2><table><thead><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr></thead><tbody><tr><td>1,000,000 push</td><td>25.21</td><td>0.03</td><td>0.00</td></tr><tr><td>1,000,000 push & pop</td><td>29.12</td><td>0.03</td><td>0.00</td></tr></tbody></table>

[//]: # (No deletion!!! End of Replace Section)


### Performance surpasses that of native JS/TS

| Method                | Time Taken | Data Scale | Belongs To | Big O |
|-----------------------|------------|------------|------------|-------|
| Queue.push & shift    | 5.83 ms    | 100K       | Ours       | O(1)  |
| Array.push & shift    | 2829.59 ms | 100K       | Native JS  | O(n)  |
| Deque.unshift & shift | 2.44 ms    | 100K       | Ours       | O(1)  |
| Array.unshift & shift | 4750.37 ms | 100K       | Native JS  | O(n)  |
| HashMap.set           | 122.51 ms  | 1M         | Ours       | O(1)  |
| Map.set               | 223.80 ms  | 1M         | Native JS  | O(1)  |
| Set.add               | 185.06 ms  | 1M         | Native JS  | O(1)  |

### Benchmark Details

MacBook Pro (15-inch, 2018)
- Processor: 2.2 GHz 6-Core Intel Core i7
- Memory: 16 GB 2400 MHz DDR4
- macOS Sequoia 15.7.2
  MacBook Pro (15-inch, 2018)


---

## 🔗 Integration Examples

### React: State Management with Sorted Data

```tsx
import { useMemo, useState } from 'react';
import { RedBlackTree } from 'data-structure-typed';

type TodoItem = { id: number; title: string };

export default function TodoList() {
  const [todoTree, setTodoTree] = useState(
    new RedBlackTree<number, TodoItem>([
      [100, { id: 100, title: 'Title 100' }],
      [1, { id: 1, title: 'Title 1' }],
    ])
  );

  const todos = useMemo(() => [...todoTree.values()], [todoTree]);

  const addTodo = () => {
    setTodoTree((prev) => {
      const next = prev.clone();
      let id = Math.floor(Math.random() * 100);
      while (next.has(id)) {
        id = Math.floor(Math.random() * 100);
      }
      next.add(id, { id, title: `Title ${id}` });
      return next;
    });
  };

  const deleteTodo = (id: number) => {
    setTodoTree((prev) => {
      const next = prev.clone();
      next.delete(id);
      return next;
    });
  };

  return (
    <div>
      <h2>Todo List (sorted by id)</h2>
      {/* Component implementation */}
    </div>
  );
}
```

### Express.js: In-Memory Cache with LRU

```typescript
import express from 'express';
import { DoublyLinkedList } from 'data-structure-typed';

interface CacheEntry {
  key: string;
  value: any;
}

class ApiCache {
  private cache = new DoublyLinkedList<CacheEntry>();
  private keyMap = new Map<string, any>();
  private maxSize = 1000;

  set(key: string, value: any): void {
    const entry: CacheEntry = { key, value };
    this.cache.push(entry);
    this.keyMap.set(key, value);

    if (this.cache.size > this.maxSize) {
      const oldest = this.cache.shift();
      if (oldest) {
        this.keyMap.delete(oldest.key);
      }
    }
  }

  get(key: string): any {
    return this.keyMap.get(key);
  }
}

const app = express();
const cache = new ApiCache();

app.get('/api/user/:id', (req, res) => {
  const cacheKey = `user:${req.params.id}`;
  let userData = cache.get(cacheKey);
  if (!userData) {
    userData = { id: req.params.id, name: 'User' };
    cache.set(cacheKey, userData);
  }
  res.json(userData);
});
```

### Nest.js: Service with Tree-Based Ranking

```typescript
import { Injectable } from '@nestjs/common';
import { RedBlackTree } from 'data-structure-typed';

interface RankEntry {
  userId: string;
  score: number;
}

@Injectable()
export class RankingService {
  private rankingTree = new RedBlackTree<number, RankEntry>();

  updateScore(userId: string, newScore: number): void {
    const existing = [...this.rankingTree.values()].find(
      (e) => e?.userId === userId
    );

    if (existing) {
      this.rankingTree.delete(existing.score);
    }

    this.rankingTree.add(newScore, { userId, score: newScore });
  }

  getRanking(topN: number = 100): RankEntry[] | undefined {
    return [...this.rankingTree.values()].reverse().slice(0, topN);
  }

  getUserRank(userId: string): number | null {
    const allEntries = [...this.rankingTree.values()].reverse();
    const index = allEntries.findIndex((e) => e?.userId === userId);
    return index >= 0 ? index + 1 : null;
  }
}
```

---

## Free Conversion Between Data Structures

```js
const orgArr = [6, 1, 2, 7, 5, 3, 4, 9, 8];
const entries = [[6, "6"], [1, "1"], [2, "2"], [7, "7"], [5, "5"], [3, "3"], [4, "4"], [9, "9"], [8, "8"]];

const queue = new Queue(orgArr);
queue.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]

const deque = new Deque(orgArr);
deque.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]

const sList = new SinglyLinkedList(orgArr);
sList.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]

const dList = new DoublyLinkedList(orgArr);
dList.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]

const stack = new Stack(orgArr);
stack.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]

const minHeap = new MinHeap(orgArr);
minHeap.print();
// [1, 5, 2, 7, 6, 3, 4, 9, 8]

const maxPQ = new MaxPriorityQueue(orgArr);
maxPQ.print();
// [9, 8, 4, 7, 5, 2, 3, 1, 6]

const biTree = new BinaryTree(entries);
biTree.print();
//         ___6___
//        /       \
//     ___1_     _2_
//    /     \   /   \
//   _7_    5   3   4
//  /   \
//  9   8

const bst = new BST(entries);
bst.print();
//     _____5___
//    /         \
//   _2_       _7_
//  /   \     /   \
//  1   3_    6   8_
//        \         \
//        4         9

const rbTree = new RedBlackTree(entries);
rbTree.print();
//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9

const avl = new AVLTree(entries);
avl.print();
//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
```

---

## 🎯 Decision Guide: Choose the Right Data Structure

```
Need frequent head/tail operations?
  ↓
  Yes → Deque (O(1) shift/unshift)
  No  → Continue

Need sorted + fast queries?
  ↓
  Yes → RedBlackTree (O(log n) search)
  No  → Continue

Need priority handling?
  ↓
  Yes → PriorityQueue (O(log n) add)
  No  → Continue

Need prefix matching?
  ↓
  Yes → Trie (O(m + k) search)
  No  → Continue

Need graph algorithms?
  ↓
  Yes → DirectedGraph / UndirectedGraph
  No  → Use Array
```

---

## 📊 Data Structures Available

| Data Structure | Unit Test | Perf Test | API Doc | NPM | Downloads |
|---|:---:|:---:|---|---|---|
| Binary Tree | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/BinaryTree.html) | [NPM](https://www.npmjs.com/package/binary-tree-typed) | ![](https://img.shields.io/npm/dm/binary-tree-typed) |
| Binary Search Tree (BST) | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/BST.html) | [NPM](https://www.npmjs.com/package/bst-typed) | ![](https://img.shields.io/npm/dm/bst-typed) |
| AVL Tree | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/AVLTree.html) | [NPM](https://www.npmjs.com/package/avl-tree-typed) | ![](https://img.shields.io/npm/dm/avl-tree-typed) |
| Red Black Tree | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/RedBlackTree.html) | [NPM](https://www.npmjs.com/package/red-black-tree-typed) | ![](https://img.shields.io/npm/dm/red-black-tree-typed) |
| Tree Multimap | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/TreeMultiMap.html) | [NPM](https://www.npmjs.com/package/tree-multimap-typed) | ![](https://img.shields.io/npm/dm/tree-multimap-typed) |
| Heap | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/Heap.html) | [NPM](https://www.npmjs.com/package/heap-typed) | ![](https://img.shields.io/npm/dm/heap-typed) |
| Priority Queue | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/PriorityQueue.html) | [NPM](https://www.npmjs.com/package/priority-queue-typed) | ![](https://img.shields.io/npm/dm/priority-queue-typed) |
| Max Priority Queue | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/MaxPriorityQueue.html) | [NPM](https://www.npmjs.com/package/max-priority-queue-typed) | ![](https://img.shields.io/npm/dm/max-priority-queue-typed) |
| Min Priority Queue | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/MinPriorityQueue.html) | [NPM](https://www.npmjs.com/package/min-priority-queue-typed) | ![](https://img.shields.io/npm/dm/min-priority-queue-typed) |
| Trie | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/Trie.html) | [NPM](https://www.npmjs.com/package/trie-typed) | ![](https://img.shields.io/npm/dm/trie-typed) |
| Graph | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/AbstractGraph.html) | [NPM](https://www.npmjs.com/package/graph-typed) | ![](https://img.shields.io/npm/dm/graph-typed) |
| Directed Graph | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/DirectedGraph.html) | [NPM](https://www.npmjs.com/package/directed-graph-typed) | ![](https://img.shields.io/npm/dm/directed-graph-typed) |
| Undirected Graph | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/UndirectedGraph.html) | [NPM](https://www.npmjs.com/package/undirected-graph-typed) | ![](https://img.shields.io/npm/dm/undirected-graph-typed) |
| Queue | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/Queue.html) | [NPM](https://www.npmjs.com/package/queue-typed) | ![](https://img.shields.io/npm/dm/queue-typed) |
| Deque | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/Deque.html) | [NPM](https://www.npmjs.com/package/deque-typed) | ![](https://img.shields.io/npm/dm/deque-typed) |
| Hash Map | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/HashMap.html) | [NPM](https://www.npmjs.com/package/hashmap-typed) | |
| Linked List | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html) | [NPM](https://www.npmjs.com/package/linked-list-typed) | ![](https://img.shields.io/npm/dm/linked-list-typed) |
| Singly Linked List | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html) | [NPM](https://www.npmjs.com/package/singly-linked-list-typed) | ![](https://img.shields.io/npm/dm/singly-linked-list-typed) |
| Doubly Linked List | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/DoublyLinkedList.html) | [NPM](https://www.npmjs.com/package/doubly-linked-list-typed) | ![](https://img.shields.io/npm/dm/doubly-linked-list-typed) |
| Stack | ✅ | ✅ | [Docs](https://data-structure-typed-docs.vercel.app/classes/Stack.html) | [NPM](https://www.npmjs.com/package/stack-typed) | ![](https://img.shields.io/npm/dm/stack-typed) |
| Segment Tree | ✅ | | [Docs](https://data-structure-typed-docs.vercel.app/classes/SegmentTree.html) | [NPM](https://www.npmjs.com/package/segment-tree-typed) | |
| Binary Indexed Tree | ✅ | | [Docs](https://data-structure-typed-docs.vercel.app/classes/BinaryIndexedTree.html) | [NPM](https://www.npmjs.com/package/binary-indexed-tree-typed) | |

---

## 🔧 TypeScript Support

Full type safety with automatic type inference:

```typescript
// Generic type parameters
const bst = new BST<number, { name: string }>();
bst.add(10, { name: 'Alice' });

// Type-safe retrieval
const value: { name: string } | undefined = bst.get(10);

// Custom comparator
const descBST = new BST<number>([], (a, b) => b - a);

// Full IDE autocomplete support
tree.map(x => x * 2);  // TypeScript knows the signature
```

---

## 🚀 LeetCode / Algorithm Cheatsheet

Stop rewriting Heaps and Trees from scratch during interviews or competitive programming.

| Problem Pattern  | Native JS Approach (Slow/Messy) | Recommended Data Structure | Library Class |
|---|---|---|---|
| Top K Elements | array.sort().slice(0, k) (O(N log N)) | Min/Max Heap | new MinHeap<T>() |
| Median of Stream | Re-sort on every insert | Two Heaps | new MinHeap(), new MaxHeap() |
| Shortest Path | BFS with Array (shift is O(N)) | Priority Queue | new PriorityQueue<T>() |
| Task Scheduling | Array iteration | Priority Queue | new PriorityQueue<T>() |
| Range Search | Filter array (O(N)) | Red-Black Tree | new RedBlackTree<T>() |
| Dependency Graph | Object of Arrays | Directed Graph | new DirectedGraph<V, E>() |

---

## 🔄 Migration Guide: From Native JS

### Pattern 1: Replacing Array.shift with Deque

❌ Before:

```javascript
const queue = [1, 2, 3, 4, 5];
for (let i = 0; i < 100000; i++) {
  queue.shift();  // O(n)
}
```

✅ After:

```javascript
import { Deque } from 'data-structure-typed';

const deque = new Deque([1, 2, 3, 4, 5]);
for (let i = 0; i < 100000; i++) {
  deque.shift();  // O(1)
}
```

### Pattern 2: Replacing unsorted Map with RedBlackTree

❌ Before:

```javascript
const userMap = new Map([
  [5, { id: 5, name: 'Alice' }],
  [2, { id: 2, name: 'Bob' }],
]);

for (const [id, user] of userMap) {
  console.log(id);  // 5, 2 (insertion order)
}
```

✅ After:

```javascript
import { RedBlackTree } from 'data-structure-typed';

const userTree = new RedBlackTree([
  [5, { id: 5, name: 'Alice' }],
  [2, { id: 2, name: 'Bob' }],
]);

for (const [id, user] of userTree) {
  console.log(id);  // 2, 5 (sorted order)
}
```

### Pattern 3: Replacing Array.sort with PriorityQueue

❌ Before:

```javascript
const tasks = [];
for (const task of incomingTasks) {
  tasks.push(task);
}
tasks.sort((a, b) => b.priority - a.priority);  // O(n log n)
```

✅ After:

```javascript
import { MaxPriorityQueue } from 'data-structure-typed';

const pq = new MaxPriorityQueue();
for (const task of incomingTasks) {
  pq.add(task);  // O(log n)
}
```

---

## Supported Module System

Now you can use it in Node.js and browser environments

### Module Formats

- **CommonJS**: `require export.modules =`
- **ESModule**: `import export`
- **TypeScript**: `import export`
- **UMD**: `var Deque = dataStructureTyped.Deque`

### CDN

#### Development

##### ES Module

```html
<script type="module">
  import { BST } from "https://cdn.jsdelivr.net/npm/data-structure-typed/dist/esm/index.mjs";

  const bst = new BST([2, 1, 6, 7, 5, 3, 4, 8, 9]);
  bst.print();
</script>
```

##### UMD

```html
<script src='https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.js'></script>
```

#### Production

```html
<script src='https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js'></script>

<script>
  const { Heap } = dataStructureTyped;
  const { BinaryTree, Graph, Queue, Stack } = dataStructureTyped;

  const heap = new Heap([1, 2, 3]);
  heap.print();
</script>
```

---

## Design Principles

| Principle | Description |
|---|---|
| **Practicality** | Follows ES6 and ESNext standards, offering unified and considerate optional parameters, and simplifies method names. |
| **Extensibility** | Adheres to OOP (Object-Oriented Programming) principles, allowing inheritance for all data structures. |
| **Modularization** | Includes data structure modularization and independent NPM packages. |
| **Efficiency** | All methods provide time and space complexity, comparable to native JS performance. |
| **Maintainability** | Follows open-source community development standards, complete documentation, continuous integration, and adheres to TDD (Test-Driven Development) patterns. |
| **Testability** | Automated and customized unit testing, performance testing, and integration testing. |
| **Portability** | Plans for porting to Java, Python, and C++, currently achieved to 80%. |
| **Reusability** | Fully decoupled, minimized side effects, and adheres to OOP. |
| **Security** | Carefully designed security for member variables and methods. Read-write separation. |
| **Scalability** | Data structure software does not involve load issues. |

---

## 📞 Feedback and Contributions

This library is maintained with care. Found an issue or have a suggestion? We welcome all feedback!

- **Issues**: [GitHub Issues](https://github.com/zrwusa/data-structure-typed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zrwusa/data-structure-typed/discussions)

---

## 📄 License

[MIT License](LICENSE)

---

## 🙏 Thank You

Thank you for using **data-structure-typed**. We hope it makes your coding journey more productive and enjoyable!

Happy coding! 🚀

---

**← Back to** [README.md](./README.md)
