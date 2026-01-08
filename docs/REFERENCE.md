# REFERENCE: Complete API & Data Structures

The authoritative guide to all APIs, structures, and methods. Use this when you need to look up how to call something.

**[Back to README](../README.md) • [Real-World Examples](./GUIDES.md) • [Performance](./PERFORMANCE.md)**

---

## Table of Contents

1. [Quick Reference Table](#quick-reference-table)
2. [All Data Structures](#all-data-structures)
3. [CRUD Operations](#crud-operations)
4. [Common Methods](#common-methods)
5. [TypeScript Support](#typescript-support)

---

## Quick Reference Table

| Data Structure    | Best Use Case             | Time Complexity          | Space  |
|-------------------|---------------------------|--------------------------|--------|
| **Array**         | Direct indexed access     | O(n) insert/delete       | O(n)   |
| **Linked List**   | Dynamic size, fast insert | O(n) search, O(1) insert | O(n)   |
| **Stack**         | Undo/redo, DFS            | O(1) all                 | O(n)   |
| **Queue**         | FIFO processing           | O(1) all                 | O(n)   |
| **Deque**         | Head/tail operations      | O(1) all                 | O(n)   |
| **Binary Tree**   | Hierarchical data         | O(n) avg                 | O(n)   |
| **BST**           | Sorted search             | O(log n) avg             | O(n)   |
| **RedBlackTree**  | Guaranteed sorted         | O(log n) guaranteed      | O(n)   |
| **AVL Tree**      | Balanced sorted           | O(log n) guaranteed      | O(n)   |
| **Heap**          | Priority queue            | O(log n) add/remove      | O(n)   |
| **PriorityQueue** | Task scheduling           | O(log n) add/poll        | O(n)   |
| **Trie**          | Prefix search             | O(m+k) search            | O(26n) |
| **Graph**         | Networks, paths           | Varies                   | O(V+E) |

---

## All Data Structures

### Stack Structure

#### Stack

```typescript
import { Stack } from 'data-structure-typed';

const stack = new Stack<number>([1, 2]);
stack.push(3);                // add to bottom
const top = stack.pop();      // Remove from top - O(1)
const peek = stack.peek();    // View top
stack.print();                // [1, 2]
```



### Linear Structures

#### Queue

```typescript
import { Queue } from 'data-structure-typed';

const queue = new Queue<number>([1, 2]);
queue.push(3);                   // add to back
const first = queue.shift();     // Remove from front - O(1)
const length = queue.length;     // Current length
queue.print();                   // [2, 3]
```

#### Deque

```typescript
import { Deque } from 'data-structure-typed';

const deque = new Deque<number>([1, 2]);
deque.push(3);               // Add to back
deque.unshift(0);            // Add to front
deque.pop();                 // Remove from back - O(1)
deque.shift();               // Remove from front - O(1)
deque.print();               // [1, 2]
```

#### Linked Lists

```typescript
import { SinglyLinkedList, DoublyLinkedList } from 'data-structure-typed';

const singly = new SinglyLinkedList<number>([1, 2]);
const doubly = new DoublyLinkedList<number>([1, 2]);

singly.push(3);              // Add to end
singly.addAt(1, 99);         // Insert at index - O(n)
singly.deleteAt(2);          // Delete at index - O(n)
singly.print();              // [1, 99, 3]

doubly.push(3);              // Add to end
doubly.addAt(1, 99);         // Insert at index - O(n)
doubly.deleteAt(2);          // Delete at index - O(n)
doubly.print();              // [1, 99, 3]
```

### Tree Structures

#### Binary Search Tree (BST)

```typescript
import { BST } from 'data-structure-typed';

const bst = new BST<number>([1, 3, 5, 8, 6, 2, 4, 7]);
bst.add(9);                   // Add elements
bst.has(5);                  // Check existence - O(log n) avg
bst.delete(1);               // Remove - O(log n) avg
bst.print();                 // Visual representation
//      ___4___
//     /       \
//    2_       _6_
//      \     /   \
//       3    5    7_
//                   \
//                    8_
//                      \ 
//                      9 
```

#### Red-Black Tree

```typescript
import { RedBlackTree } from 'data-structure-typed';

const rbTree = new RedBlackTree<number, string>([[1, 'Alice'], [2, 'Bob'], [3, 'Chris']]);
rbTree.set(4, 'Dan');               // Add key-value
rbTree.get(1);                      // 'Alice'
rbTree.delete(2);                   // Remove - O(log n) guaranteed
console.log([...rbTree.values()]);  // ['Alice', 'Chris', 'Dan'] Automatically sorted
rbTree.print()
//   _3_
//  /   \
//  1    4

```

#### AVL Tree

```typescript
import {AVLTree} from 'data-structure-typed';

const avl = new AVLTree<number>([5, 4, 3, 8, 1]);
avl.add(9);
avl.isAVLBalanced();         // Check balance
avl.delete(3);               // Auto-rebalances
avl.print()
//    ___5_    
//   /     \   
//   1_     8_  
//     \      \ 
//      4      9 
```

### Heap & Priority Queue

#### Heap

```typescript
import { MinHeap, MaxHeap } from 'data-structure-typed';

const minHeap = new MinHeap<number>([5, 3, 8]);
minHeap.add(1);               // Add element - O(log n)
const min = minHeap.poll();   // Get minimum - O(log n)
const peek = minHeap.peek();  // View minimum - O(1)
```

#### Priority Queue

```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

const pq = new MaxPriorityQueue<Task>();
pq.add({ id: 1, priority: 5 });  // Add - O(log n)
const task = pq.poll();          // Remove highest - O(log n)
const size = pq.size;            // Current size
```

### Special Structures

#### Trie (Prefix Tree)

```typescript
import { Trie } from 'data-structure-typed';

const trie = new Trie(['apple', 'app', 'banana']);
trie.add('apply');
trie.getWords('app');        // ['apple', 'apply', 'app'] - O(m+k)
trie.has('apple');           // true
trie.hasPrefix('ap');        // true
```

#### Graph

```typescript
import { DirectedGraph, UndirectedGraph } from 'data-structure-typed';

const graph = new DirectedGraph<string>();
graph.addVertex('A');
graph.addVertex('B');
graph.addEdge('A', 'B', 1);  // Add edge with weight
graph.hasEdge('A', 'B');     // true
const {
  distMap, distPaths, preMap, seen, paths, minDist, minPath
} = graph.dijkstra('A', 'B', true, true)!; 
const order = graph.topologicalSort();
console.log(distMap)
console.log(distPaths)
console.log(preMap)
console.log(seen)
console.log(paths)
console.log(minDist)
console.log(minPath)  // Shortest path
console.log(order)    // DAG order
```

---

## CRUD Operations

### Create (Add)

```typescript
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');
tree.setMany([[2, 'Bob'], [3, 'Charlie']]);

// Heap
const heap = new MaxHeap<number>([10, 20]);
heap.add(15);

// Trie
const trie = new Trie(['hello']);
trie.add('world');

// Graph
const graph = new DirectedGraph<string>();
graph.addVertex('A');
graph.addEdge('A', 'B', 1);
```

### Read (Query)

```typescript
// Tree
tree.get(1);               // 'Alice'
tree.has(1);               // true
tree.size;                 // Number of elements

// Heap
heap.peek();               // Highest priority element
heap.size;                 // Current size

// Trie
trie.getWords('hello');      // true
trie.hasPrefix('hel');    // true

// Graph
graph.hasVertex('A');      // true
graph.hasEdge('A', 'B');   // true
graph.getNeighbors('A');   // Connected vertices
```

### Update (Modify)

```typescript
// Tree
tree.set(1, 'Alice Updated'); // Update value
tree.delete(1);               // Remove

// Heap
heap.pop();                    // Remove highest

// Graph
graph.deleteEdge('A', 'B');   // Remove edge
graph.deleteVertex('A');      // Remove vertex
```

### Delete

```typescript
// All structures support:
structure.clear();             // Remove all elements
structure.delete(key);         // Remove specific
```

---

## Common Methods

### Available on All Structures

```typescript
// Iteration
structure.forEach((value, key) => {
});
for (const item of structure) {
}

// Conversion
[...structure];                // Spread
Array.from(structure);         // Array conversion

// Array methods
structure.map((v, k) => v * 2);
structure.filter((v, k) => v > 5);
structure.reduce((acc, v) => acc + v, 0);
structure.find((v, k) => v === 5);
structure.some((v, k) => v > 10);
structure.every((v, k) => v > 0);

// Properties
structure.size;                // Element count
structure.isEmpty();           // Check empty
```

### Structure-Specific Methods

#### Trees

```typescript
tree.height;                   // Tree height
tree.isAVLBalanced();         // Balance check
tree.getNode(key);            // Get node object
tree.getHeight(key);          // Node height
tree.getLeftMost();           // Leftmost node
tree.getRightMost();          // Rightmost node
```

#### Deque

```typescript
deque.peekFirst();            // View front
deque.peekLast();             // View back
deque.pollFirst();            // Remove front - O(1)
deque.pollLast();             // Remove back - O(1)
```

#### Graph

```typescript
graph.topologicalSort();      // DAG order
graph.dijkstra(start, end);   // Shortest path
graph.dfs(vertex);            // Depth-first traversal
graph.bfs(vertex);            // Breadth-first traversal
```

---

## TypeScript Support

### Full Generic Support

```typescript
// Custom type safety
const tree = new RedBlackTree<number, User>();
tree.set(1, { name: 'Alice', age: 30 });

const value = tree.get(1);  // Type: User | undefined

// Automatic inference
const numbers = new Deque<number>([1, 2]);
numbers.push(3);

// Custom comparators
const descending = new RedBlackTree<number, string>([], {
    comparator: (a, b) => b - a  // Sort descending
  });
```

### Type Safety Examples

```typescript
interface Task {
  id: string;
  priority: number;
  action: Promise<void>;
}

const pq = new MaxPriorityQueue<Task>(
  {
    comparator: (a, b) => a.priority - b.priority
  }
);

pq.add({
  id: '1', priority: 5, action: async () => {
  }
});

// Type checking catches errors
const task = pq.poll();
if (task) {
  // task is guaranteed to be Task
  await task.action;
}
```

---

## Complexity Chart

| Operation | Array | LinkedList | BST      | RBTree   | Heap     | Trie |
|-----------|-------|------------|----------|----------|----------|------|
| Access    | O(1)  | O(n)       | O(log n) | O(log n) | O(n)     | N/A  |
| Search    | O(n)  | O(n)       | O(log n) | O(log n) | O(n)     | O(m) |
| Insert    | O(n)  | O(1)       | O(log n) | O(log n) | O(log n) | O(m) |
| Delete    | O(n)  | O(1)       | O(log n) | O(log n) | O(log n) | O(m) |

---

## Common Patterns

### Iterator Pattern

```typescript
const tree = new RedBlackTree([5, 2, 8]);

// Works everywhere
const arr = [...tree.keys()];           // Spread
const set = new Set(tree.keys());       // Set constructor
for (const val of tree.values()) {
}      // for...of
const [first, ...rest] = tree.keys();   // Destructuring
```

### Filtering Pattern

```typescript
const tree = new RedBlackTree([
  [1, { active: true }],
  [2, { active: false }],
  [3, { active: true }]
]);

const inactive = tree
  .filter((val) => val?.active ?? false)
  .map((val, key) => [key, !val]);

console.log(...inactive);
```

### Sorting Pattern

```typescript
const data = [64, 34, 25, 12, 22, 11, 90];
const sorted = [...new RedBlackTree(data).keys()]; // Instant sort!
```

---

**Need details?** Check [GUIDES.md](./GUIDES.md) for real-world examples.

**Performance curious?** See [PERFORMANCE.md](./PERFORMANCE.md) for benchmarks.
