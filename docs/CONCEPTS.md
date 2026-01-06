# CONCEPTS: Core Fundamentals & Theory

This guide explains the foundational concepts behind data structures through plain language and practical understanding.

**👈 [Back to README](../README.md) • [API Reference](./REFERENCE.md) • [Real-World Guides](./GUIDES.md)**

---

## Table of Contents

1. [The Big Three Concepts](#the-big-three-concepts)
2. [Plain Language Explanations](#-plain-language-explanations)
3. [Iterator Protocol Design](#iterator-protocol-design)
4. [Seamless Interoperability](#-seamless-interoperability-iterator-protocol-everywhere)
5. [All Array Methods Work Everywhere](#-all-array-methods-work-everywhere)
6. [Why Not Just Use Native JavaScript?](#why-not-just-use-native-javascript)
7. [Decision Guide](#-decision-guide-choose-the-right-data-structure)

---

## The Big Three Concepts

### 1. **Binary Search Tree (BST)** — O(log n) search/insert/delete

Maintains sorted order by keeping all left children smaller and right children larger than each node.

```javascript
// Property: For any node
// All left subtree values < node value
// All right subtree values > node value

//        5
//       / \
//      3   8
//     / \   \
//    1   4   9
```

**Advantage**: Fast operations without pre-sorting
**Trade-off**: Unbalanced trees degrade to O(n)

### 2. **Balanced Trees (AVL, Red-Black)** — Auto-rebalancing

Automatically reorganize themselves to maintain O(log n) guarantees even after insertions/deletions.

```javascript
// Red-Black Tree: Color rules ensure balance
// AVL Tree: Height difference ≤ 1

// Both: Insert = O(log n), Delete = O(log n), Search = O(log n) always
```

**Advantage**: Guaranteed O(log n) performance
**Cost**: Rebalancing overhead on every modification

### 3. **Heap** — Parent-child priority relationships

A complete binary tree where parent always has priority over children.

```javascript
// Max Heap:     // Min Heap:
//      9             1
//     / \           / \
//    7   8         2   3
//   / \           / \
//  3   2         8   9

// Parent = 1.5x better than children
// Root always has best priority
```

**Advantage**: Very fast to get highest/lowest priority
**Perfect for**: Priority queues, heap sort

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

## Iterator Protocol Design

### The Hidden Superpower

Every single data structure in this library implements the **Iterator protocol**:

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

## 🔗 Seamless Interoperability: Iterator Protocol Everywhere

### The Design Philosophy

Instead of forcing conversions between data structures, we made every structure speak the same language as JavaScript's native iterables. This means:

- You can pass any data structure to `Array.from()`
- You can destructure any data structure
- You can spread any data structure
- You can loop over any data structure with `for...of`

This is **zero friction** because you use the same mental model.

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
|-------------|-------------|------|-------|-------|---------------|
| map         | ✅           | ✅    | ✅     | ✅     | ✅             |
| filter      | ✅           | ✅    | ✅     | ✅     | ✅             |
| reduce      | ✅           | ✅    | ✅     | ✅     | ✅             |
| find        | ✅           | ✅    | ✅     | ✅     | ✅             |
| some/every  | ✅           | ✅    | ✅     | ✅     | ✅             |
| keys/values | ✅           | ✅    | ✅     | ✅     | ✅             |
| forEach     | ✅           | ✅    | ✅     | ✅     | ✅             |

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

## Next Steps

**Understand the basics?** 
→ [See real-world examples](./GUIDES.md)

**Want to use immediately?**
→ [Check API Reference](./REFERENCE.md)

**Curious about performance?**
→ [Read performance comparison](./PERFORMANCE.md)

**Want to know how it's implemented?**
→ [See architecture details](./ARCHITECTURE.md)

---

**Related:**
- [REFERENCE.md](./REFERENCE.md) - API / structures / methods
- [GUIDES.md](./GUIDES.md) - Leaderboard / LRU / Queue / real-world examples
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Design / JIT / internal abstractions
- [PERFORMANCE.md](./PERFORMANCE.md) - Benchmarks / comparisons
- [INTEGRATIONS.md](./INTEGRATIONS.md) - React / Nest / Express