# Data Structure Typed

![NPM](https://img.shields.io/npm/l/data-structure-typed)
![GitHub top language](https://img.shields.io/github/languages/top/zrwusa/data-structure-typed)
![npm](https://img.shields.io/npm/dw/data-structure-typed)
![eslint](https://aleen42.github.io/badges/src/eslint.svg)
![npm package minimized gzipped size (select exports)](https://img.shields.io/bundlejs/size/data-structure-typed)
![npm bundle size](https://img.shields.io/bundlephobia/min/data-structure-typed)
![npm](https://img.shields.io/npm/v/data-structure-typed)


Data Structures of Javascript & TypeScript.

Do you envy C++ with [STL](), Python with [collections](), and Java with [java.util]() ? Well, no need to envy anymore! JavaScript and TypeScript now have [data-structure-typed]().

Now you can use this library in Node.js and browser environments in CommonJS(require export.modules = ), ESModule(import export), Typescript(import export), UMD(var Queue = dataStructureTyped.Queue)


[//]: # (![Branches]&#40;https://img.shields.io/badge/branches-55.47%25-red.svg?style=flat&#41;)

[//]: # (![Statements]&#40;https://img.shields.io/badge/statements-67%25-red.svg?style=flat&#41;)

[//]: # (![Functions]&#40;https://img.shields.io/badge/functions-66.38%25-red.svg?style=flat&#41;)

[//]: # (![Lines]&#40;https://img.shields.io/badge/lines-68.6%25-red.svg?style=flat&#41;)


## Built-in classic algorithms

DFS(Depth-First Search), DFSIterative, BFS(Breadth-First Search), morris, Bellman-Ford Algorithm, Dijkstra's Algorithm,
Floyd-Warshall Algorithm, Tarjan's Algorithm.

## Installation and Usage

### npm

```bash
npm i data-structure-typed --save
```

### yarn

```bash
yarn add data-structure-typed
```

```js
import {
  BinaryTree, Graph, Queue, Stack, PriorityQueue, BST, Trie, DoublyLinkedList,
  AVLTree, MinHeap, SinglyLinkedList, DirectedGraph, TreeMultiset,
  DirectedVertex, AVLTreeNode
} from 'data-structure-typed';
```

### CDN

```html

<script src='https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js'></script>
```

```js
const {Heap} = dataStructureTyped;
const {
  BinaryTree, Graph, Queue, Stack, PriorityQueue, BST, Trie, DoublyLinkedList,
  AVLTree, MinHeap, SinglyLinkedList, DirectedGraph, TreeMultiset,
  DirectedVertex, AVLTreeNode
} = dataStructureTyped;
```

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/binary-tree-array-to-binary-tree.webp)
![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/binary-tree-dfs-in-order.webp)
![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/avl-tree-test.webp)
![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/tree-multiset-test.webp)
![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/matrix-cut-off-tree-for-golf.webp)
![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/directed-graph-test.webp)
![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/map-graph-test.webp)

## API docs & Examples

[API Docs](https://data-structure-typed-docs.vercel.app)

[Live Examples](https://vivid-algorithm.vercel.app)

<a href="https://github.com/zrwusa/vivid-algorithm" target="_blank">Examples Repository</a>

## Code Snippet

### Binary Search Tree (BST) snippet

#### TS

```ts
import {BST, BSTNode} from 'data-structure-typed';

const bst = new BST();
bst.add(11);
bst.add(3);
bst.addMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);
bst.size === 16;                // true
bst.has(6);                     // true
const node6 = bst.get(6);       // BSTNode
bst.getHeight(6) === 2;         // true
bst.getHeight() === 5;          // true
bst.getDepth(6) === 3;          // true

bst.getLeftMost()?.id === 1;    // true

bst.delete(6);
bst.get(6);                     // null
bst.isAVLBalanced();            // true
bst.bfs()[0] === 11;            // true

const objBST = new BST<BSTNode<{id: number, keyA: number}>>();
objBST.add(11, {id: 11, keyA: 11});
objBST.add(3, {id: 3, keyA: 3});

objBST.addMany([{id: 15, keyA: 15}, {id: 1, keyA: 1}, {id: 8, keyA: 8},
  {id: 13, keyA: 13}, {id: 16, keyA: 16}, {id: 2, keyA: 2},
  {id: 6, keyA: 6}, {id: 9, keyA: 9}, {id: 12, keyA: 12},
  {id: 14, keyA: 14}, {id: 4, keyA: 4}, {id: 7, keyA: 7},
  {id: 10, keyA: 10}, {id: 5, keyA: 5}]);

objBST.delete(11);
```

#### JS

```js
const {BST, BSTNode} = require('data-structure-typed');

const bst = new BST();
bst.add(11);
bst.add(3);
bst.addMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);
bst.size === 16;        // true
bst.has(6);             // true
const node6 = bst.get(6);
bst.getHeight(6) === 2; // true
bst.getHeight() === 5;  // true
bst.getDepth(6) === 3;  // true
const leftMost = bst.getLeftMost();
leftMost?.id === 1;     // true
expect(leftMost?.id).toBe(1);
bst.delete(6);
bst.get(6);             // null
bst.isAVLBalanced();    // true or false
const bfsIDs = bst.bfs();
bfsIDs[0] === 11;       // true
expect(bfsIDs[0]).toBe(11);

const objBST = new BST();
objBST.add(11, {id: 11, keyA: 11});
objBST.add(3, {id: 3, keyA: 3});

objBST.addMany([{id: 15, keyA: 15}, {id: 1, keyA: 1}, {id: 8, keyA: 8},
  {id: 13, keyA: 13}, {id: 16, keyA: 16}, {id: 2, keyA: 2},
  {id: 6, keyA: 6}, {id: 9, keyA: 9}, {id: 12, keyA: 12},
  {id: 14, keyA: 14}, {id: 4, keyA: 4}, {id: 7, keyA: 7},
  {id: 10, keyA: 10}, {id: 5, keyA: 5}]);

objBST.delete(11);

const avlTree = new AVLTree();
avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
avlTree.isAVLBalanced();    // true
avlTree.delete(10);
avlTree.isAVLBalanced();    // true
```

### AVLTree snippet

#### TS

```ts
import {AVLTree} from 'data-structure-typed';

const avlTree = new AVLTree();
avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
avlTree.isAVLBalanced();    // true
avlTree.delete(10);
avlTree.isAVLBalanced();    // true
```

#### JS

```js
const {AVLTree} = require('data-structure-typed');

const avlTree = new AVLTree();
avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
avlTree.isAVLBalanced();    // true
avlTree.delete(10);
avlTree.isAVLBalanced();    // true
```

### Directed Graph simple snippet

#### TS or JS

```ts
import {DirectedGraph} from 'data-structure-typed';

const graph = new DirectedGraph();

graph.addVertex('A');
graph.addVertex('B');

graph.hasVertex('A');       // true
graph.hasVertex('B');       // true
graph.hasVertex('C');       // false

graph.addEdge('A', 'B');
graph.hasEdge('A', 'B');    // true
graph.hasEdge('B', 'A');    // false

graph.deleteEdgeSrcToDest('A', 'B');
graph.hasEdge('A', 'B');    // false

graph.addVertex('C');

graph.addEdge('A', 'B');
graph.addEdge('B', 'C');

const topologicalOrderIds = graph.topologicalSort(); // ['A', 'B', 'C']
```

### Undirected Graph snippet

#### TS or JS

```ts
import {UndirectedGraph} from 'data-structure-typed';

const graph = new UndirectedGraph();
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.deleteVertex('C');
graph.addEdge('A', 'B');
graph.addEdge('B', 'D');

const dijkstraResult = graph.dijkstra('A');
Array.from(dijkstraResult?.seen ?? []).map(vertex => vertex.id) // ['A', 'B', 'D']
```

## Data Structures

<table>
<thead>
<tr>
<th>Data Structure</th>
<th>Unit Test</th>
<th>Performance Test</th>
<th>API Documentation</th>
<th>Implemented</th>
</tr>
</thead>
<tbody>
<tr>
<td>Binary Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryTree.html"><span>Binary Tree</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Binary Search Tree (BST)</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BST.html"><span>BST</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>AVL Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/AVLTree.html"><span>AVLTree</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Tree Multiset</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/TreeMultiset.html"><span>TreeMultiset</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Segment Tree</td>
<td></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SegmentTree.html"><span>SegmentTree</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Binary Indexed Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryIndexedTree.html"><span>BinaryIndexedTree</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/AbstractGraph.html"><span>AbstractGraph</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Directed Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/DirectedGraph.html"><span>DirectedGraph</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Undirected Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/UndirectedGraph.html"><span>UndirectedGraph</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html"><span>SinglyLinkedList</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Singly Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html"><span>SinglyLinkedList</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Doubly Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/DoublyLinkedList.html"><span>DoublyLinkedList</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Queue.html"><span>Queue</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Object Deque</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/ObjectDeque.html"><span>ObjectDeque</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Array Deque</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/ArrayDeque.html"><span>ArrayDeque</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Stack</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Stack.html"><span>Stack</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Coordinate Set</td>
<td></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/CoordinateSet.html"><span>CoordinateSet</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Coordinate Map</td>
<td></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/CoordinateMap.html"><span>CoordinateMap</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Heap</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Heap.html"><span>Heap</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/PriorityQueue.html"><span>PriorityQueue</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Max Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/MaxPriorityQueue.html"><span>MaxPriorityQueue</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Min Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/MinPriorityQueue.html"><span>MinPriorityQueue</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
<tr>
<td>Trie</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Trie.html"><span>Trie</span></a></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
</tr>
</tbody>
</table>



### Standard library data structure comparison


<table>
  <thead>
  <tr>
    <th>Data Structure</th>
    <th>Data Structure Typed</th>
    <th>C++ STL</th>
    <th>java.util</th>
    <th>Python collections</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>Dynamic Array</td>
    <td>Array&lt;E&gt;</td>
    <td>vector&lt;T&gt;</td>
    <td>ArrayList&lt;E&gt;</td>
    <td>list</td>
  </tr>
  <tr>
    <td>Linked List</td>
    <td>DoublyLinkedList&lt;E&gt;</td>
    <td>list&lt;T&gt;</td>
    <td>LinkedList&lt;E&gt;</td>
    <td>deque</td>
  </tr>
  <tr>
    <td>Singly Linked List</td>
    <td>SinglyLinkedList&lt;E&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Set</td>
    <td>Set&lt;E&gt;</td>
    <td>set&lt;T&gt;</td>
    <td>HashSet&lt;E&gt;</td>
    <td>set</td>
  </tr>
  <tr>
    <td>Map</td>
    <td>Map&lt;K, V&gt;</td>
    <td>map&lt;K, V&gt;</td>
    <td>HashMap&lt;K, V&gt;</td>
    <td>dict</td>
  </tr>
  <tr>
    <td>Ordered Dictionary</td>
    <td>Map&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>OrderedDict</td>
  </tr>

  <tr>
    <td>Queue</td>
    <td>Queue&lt;E&gt;</td>
    <td>queue&lt;T&gt;</td>
    <td>Queue&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Priority Queue</td>
    <td>PriorityQueue&lt;E&gt;</td>
    <td>priority_queue&lt;T&gt;</td>
    <td>PriorityQueue&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Heap</td>
    <td>Heap&lt;V&gt;</td>
    <td>priority_queue&lt;T&gt;</td>
    <td>PriorityQueue&lt;E&gt;</td>
    <td>heapq</td>
  </tr>
  <tr>
    <td>Stack</td>
    <td>Stack&lt;E&gt;</td>
    <td>stack&lt;T&gt;</td>
    <td>Stack&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Deque</td>
    <td>Deque&lt;E&gt;</td>
    <td>deque&lt;T&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Trie</td>
    <td>Trie</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Unordered Map</td>
    <td>HashMap&lt;K, V&gt;</td>
    <td>unordered_map&lt;K, V&gt;</td>
    <td>HashMap&lt;K, V&gt;</td>
    <td>defaultdict</td>
  </tr>
  <tr>
    <td>Multiset</td>
    <td>-</td>
    <td>multiset&lt;T&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Multimap</td>
    <td>-</td>
    <td>multimap&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Binary Tree</td>
    <td>BinaryTree&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Binary Search Tree</td>
    <td>BST&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Directed Graph</td>
    <td>DirectedGraph&lt;V, E&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Undirected Graph</td>
    <td>UndirectedGraph&lt;V, E&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Unordered Multiset</td>
    <td>-</td>
    <td>unordered_multiset</td>
    <td>-</td>
    <td>Counter</td>
  </tr>
  <tr>
    <td>Linked Hash Set</td>
    <td>-</td>
    <td>-</td>
    <td>LinkedHashSet&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Linked Hash Map</td>
    <td>-</td>
    <td>-</td>
    <td>LinkedHashMap&lt;K, V&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Sorted Set</td>
    <td>AVLTree&lt;E&gt;</td>
    <td>-</td>
    <td>TreeSet&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Sorted Map</td>
    <td>AVLTree&lt;K, V&gt;</td>
    <td>-</td>
    <td>TreeMap&lt;K, V&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Tree Set</td>
    <td>AVLTree&lt;E&gt;</td>
    <td>set</td>
    <td>TreeSet&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Unordered Multimap</td>
    <td>-</td>
    <td>unordered_multimap&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Bitset</td>
    <td>-</td>
    <td>bitset&lt;N&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Unordered Set</td>
    <td>-</td>
    <td>unordered_set&lt;T&gt;</td>
    <td>HashSet&lt;E&gt;</td>
    <td>-</td>
  </tr>
  </tbody>
</table>


## Code design

### Adhere to ES6 standard naming conventions for APIs.

Standardize API conventions by using 'add' and 'delete' for element manipulation methods in all data structures. 

Opt for concise and clear method names, avoiding excessive length while ensuring explicit intent.

### Object-oriented programming(OOP) 

By strictly adhering to object-oriented design (BinaryTree -> BST -> AVLTree -> TreeMultiset), you can seamlessly
inherit the existing data structures to implement the customized ones you need. Object-oriented design stands as the
optimal approach to data structure design.

## Benchmark
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.12</td><td>470.70</td><td>24</td><td>0.00</td><td>3.55e-5</td></tr><tr><td>1000 add & delete randomly</td><td>5.12</td><td>195.21</td><td>11</td><td>0.01</td><td>8.78e-4</td></tr><tr><td>1000 addMany</td><td>3.95</td><td>253.32</td><td>18</td><td>0.00</td><td>0.00</td></tr><tr><td>1000 get</td><td>3.04</td><td>328.49</td><td>22</td><td>0.00</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>13.44</td><td>74.39</td><td>4</td><td>0.01</td><td>0.00</td></tr><tr><td>1000 add & delete randomly</td><td>15.93</td><td>62.78</td><td>4</td><td>0.02</td><td>2.08e-4</td></tr><tr><td>1000 addMany</td><td>10.71</td><td>93.41</td><td>5</td><td>0.01</td><td>2.11e-4</td></tr><tr><td>1000 get</td><td>17.90</td><td>55.86</td><td>3</td><td>0.02</td><td>1.30e-4</td></tr><tr><td>1000 dfs</td><td>68.52</td><td>14.59</td><td>1</td><td>0.07</td><td>3.98e-4</td></tr><tr><td>1000 bfs</td><td>54.57</td><td>18.33</td><td>1</td><td>0.05</td><td>4.34e-4</td></tr><tr><td>1000 morris</td><td>37.37</td><td>26.76</td><td>2</td><td>0.04</td><td>3.60e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.15</td><td>465.28</td><td>24</td><td>0.00</td><td>1.79e-5</td></tr><tr><td>1000 add & delete randomly</td><td>5.08</td><td>196.92</td><td>10</td><td>0.01</td><td>4.34e-5</td></tr><tr><td>1000 addMany</td><td>2.14</td><td>467.28</td><td>24</td><td>0.00</td><td>4.18e-5</td></tr><tr><td>1000 get</td><td>2.35</td><td>426.21</td><td>22</td><td>0.00</td><td>5.24e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>directed-graph</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 addVertex</td><td>0.10</td><td>9846.76</td><td>505</td><td>1.02e-4</td><td>2.82e-6</td></tr><tr><td>1000 addEdge</td><td>6.23</td><td>160.47</td><td>9</td><td>0.01</td><td>5.72e-4</td></tr><tr><td>1000 getVertex</td><td>0.05</td><td>2.18e+4</td><td>1100</td><td>4.59e-5</td><td>3.84e-7</td></tr><tr><td>1000 getEdge</td><td>23.96</td><td>41.73</td><td>3</td><td>0.02</td><td>0.00</td></tr><tr><td>tarjan</td><td>217.41</td><td>4.60</td><td>1</td><td>0.22</td><td>0.01</td></tr><tr><td>tarjan all</td><td>242.30</td><td>4.13</td><td>1</td><td>0.24</td><td>0.06</td></tr><tr><td>topologicalSort</td><td>184.85</td><td>5.41</td><td>1</td><td>0.18</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.35</td><td>2823.44</td><td>149</td><td>3.54e-4</td><td>5.10e-5</td></tr><tr><td>1000 fib add & pop</td><td>3.92</td><td>255.12</td><td>14</td><td>0.00</td><td>6.68e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>206.78</td><td>4.84</td><td>1</td><td>0.21</td><td>0.03</td></tr><tr><td>1000000 unshift & shift</td><td>170.95</td><td>5.85</td><td>1</td><td>0.17</td><td>0.04</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.75e+4</td><td>1906</td><td>2.67e-5</td><td>3.24e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.77</td><td>565.87</td><td>30</td><td>0.00</td><td>5.05e-5</td></tr><tr><td>1000 insertBefore</td><td>2.32</td><td>430.56</td><td>23</td><td>0.00</td><td>7.66e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.45</td><td>87.31</td><td>5</td><td>0.01</td><td>1.45e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>214.85</td><td>4.65</td><td>1</td><td>0.21</td><td>0.03</td></tr><tr><td>1000000 shift</td><td>26.08</td><td>38.34</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>44.32</td><td>22.56</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>79.08</td><td>12.64</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>56.20</td><td>17.79</td><td>1</td><td>0.06</td><td>0.01</td></tr><tr><td>100000 getWords</td><td>95.26</td><td>10.50</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.22</td><td>449.77</td><td>23</td><td>0.00</td><td>2.65e-5</td></tr><tr><td>1000 add & delete randomly</td><td>11.58</td><td>86.37</td><td>5</td><td>0.01</td><td>5.00e-4</td></tr><tr><td>1000 addMany</td><td>3.10</td><td>322.62</td><td>17</td><td>0.00</td><td>1.23e-4</td></tr><tr><td>1000 get</td><td>24.91</td><td>40.14</td><td>3</td><td>0.02</td><td>7.25e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>13.05</td><td>76.62</td><td>5</td><td>0.01</td><td>3.58e-4</td></tr><tr><td>1000 add & delete randomly</td><td>15.76</td><td>63.44</td><td>4</td><td>0.02</td><td>1.24e-4</td></tr><tr><td>1000 addMany</td><td>10.67</td><td>93.68</td><td>5</td><td>0.01</td><td>6.84e-4</td></tr><tr><td>1000 get</td><td>23.72</td><td>42.15</td><td>3</td><td>0.02</td><td>2.74e-4</td></tr><tr><td>1000 dfs</td><td>72.32</td><td>13.83</td><td>1</td><td>0.07</td><td>7.21e-4</td></tr><tr><td>1000 bfs</td><td>54.98</td><td>18.19</td><td>1</td><td>0.05</td><td>6.62e-4</td></tr><tr><td>1000 morris</td><td>37.33</td><td>26.79</td><td>2</td><td>0.04</td><td>3.72e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.34</td><td>427.09</td><td>22</td><td>0.00</td><td>2.19e-5</td></tr><tr><td>1000 add & delete randomly</td><td>13.21</td><td>75.70</td><td>4</td><td>0.01</td><td>3.61e-4</td></tr><tr><td>1000 addMany</td><td>2.23</td><td>449.06</td><td>24</td><td>0.00</td><td>4.38e-5</td></tr><tr><td>1000 get</td><td>25.81</td><td>38.75</td><td>2</td><td>0.03</td><td>6.13e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>directed-graph</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 addVertex</td><td>0.10</td><td>9761.68</td><td>498</td><td>1.02e-4</td><td>1.73e-6</td></tr><tr><td>1000 addEdge</td><td>6.40</td><td>156.27</td><td>9</td><td>0.01</td><td>5.45e-4</td></tr><tr><td>1000 getVertex</td><td>0.05</td><td>2.17e+4</td><td>1094</td><td>4.61e-5</td><td>2.85e-7</td></tr><tr><td>1000 getEdge</td><td>22.10</td><td>45.25</td><td>3</td><td>0.02</td><td>0.00</td></tr><tr><td>tarjan</td><td>209.19</td><td>4.78</td><td>1</td><td>0.21</td><td>0.01</td></tr><tr><td>tarjan all</td><td>211.22</td><td>4.73</td><td>1</td><td>0.21</td><td>0.00</td></tr><tr><td>topologicalSort</td><td>170.38</td><td>5.87</td><td>1</td><td>0.17</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.34</td><td>2921.82</td><td>149</td><td>3.42e-4</td><td>3.19e-6</td></tr><tr><td>1000 fib add & pop</td><td>3.93</td><td>254.62</td><td>14</td><td>0.00</td><td>7.82e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>218.29</td><td>4.58</td><td>1</td><td>0.22</td><td>0.07</td></tr><tr><td>1000000 unshift & shift</td><td>168.88</td><td>5.92</td><td>1</td><td>0.17</td><td>0.03</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.72e+4</td><td>1904</td><td>2.69e-5</td><td>4.13e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.77</td><td>564.34</td><td>30</td><td>0.00</td><td>5.91e-5</td></tr><tr><td>1000 insertBefore</td><td>2.31</td><td>432.88</td><td>22</td><td>0.00</td><td>5.53e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.42</td><td>87.54</td><td>5</td><td>0.01</td><td>1.63e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>223.27</td><td>4.48</td><td>1</td><td>0.22</td><td>0.03</td></tr><tr><td>1000000 shift</td><td>24.66</td><td>40.55</td><td>3</td><td>0.02</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>43.10</td><td>23.20</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>79.89</td><td>12.52</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>54.81</td><td>18.24</td><td>1</td><td>0.05</td><td>0.00</td></tr><tr><td>100000 getWords</td><td>94.93</td><td>10.53</td><td>1</td><td>0.09</td><td>0.01</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.18</td><td>458.66</td><td>24</td><td>0.00</td><td>2.36e-5</td></tr><tr><td>1000 add & delete randomly</td><td>11.07</td><td>90.33</td><td>5</td><td>0.01</td><td>1.53e-4</td></tr><tr><td>1000 addMany</td><td>2.89</td><td>346.20</td><td>18</td><td>0.00</td><td>2.52e-5</td></tr><tr><td>1000 get</td><td>24.19</td><td>41.34</td><td>3</td><td>0.02</td><td>1.67e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>12.88</td><td>77.65</td><td>4</td><td>0.01</td><td>3.26e-4</td></tr><tr><td>1000 add & delete randomly</td><td>15.71</td><td>63.65</td><td>4</td><td>0.02</td><td>1.42e-4</td></tr><tr><td>1000 addMany</td><td>10.64</td><td>94.02</td><td>5</td><td>0.01</td><td>1.79e-4</td></tr><tr><td>1000 get</td><td>24.06</td><td>41.56</td><td>3</td><td>0.02</td><td>3.48e-4</td></tr><tr><td>1000 dfs</td><td>72.21</td><td>13.85</td><td>1</td><td>0.07</td><td>0.00</td></tr><tr><td>1000 bfs</td><td>54.74</td><td>18.27</td><td>1</td><td>0.05</td><td>4.33e-4</td></tr><tr><td>1000 morris</td><td>37.26</td><td>26.84</td><td>2</td><td>0.04</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.16</td><td>462.35</td><td>24</td><td>0.00</td><td>1.86e-5</td></tr><tr><td>1000 add & delete randomly</td><td>13.54</td><td>73.87</td><td>5</td><td>0.01</td><td>3.91e-4</td></tr><tr><td>1000 addMany</td><td>2.12</td><td>472.08</td><td>25</td><td>0.00</td><td>2.86e-5</td></tr><tr><td>1000 get</td><td>25.26</td><td>39.60</td><td>3</td><td>0.03</td><td>1.83e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>directed-graph</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 addVertex</td><td>0.10</td><td>9972.07</td><td>509</td><td>1.00e-4</td><td>1.01e-6</td></tr><tr><td>1000 addEdge</td><td>6.12</td><td>163.35</td><td>9</td><td>0.01</td><td>4.88e-4</td></tr><tr><td>1000 getVertex</td><td>0.05</td><td>2.17e+4</td><td>1099</td><td>4.60e-5</td><td>4.25e-7</td></tr><tr><td>1000 getEdge</td><td>23.20</td><td>43.11</td><td>3</td><td>0.02</td><td>0.00</td></tr><tr><td>tarjan</td><td>211.96</td><td>4.72</td><td>1</td><td>0.21</td><td>0.01</td></tr><tr><td>tarjan all</td><td>214.88</td><td>4.65</td><td>1</td><td>0.21</td><td>0.00</td></tr><tr><td>topologicalSort</td><td>173.46</td><td>5.76</td><td>1</td><td>0.17</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.34</td><td>2922.29</td><td>149</td><td>3.42e-4</td><td>2.94e-6</td></tr><tr><td>1000 fib add & pop</td><td>3.90</td><td>256.37</td><td>14</td><td>0.00</td><td>4.30e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>209.62</td><td>4.77</td><td>1</td><td>0.21</td><td>0.05</td></tr><tr><td>1000000 unshift & shift</td><td>171.61</td><td>5.83</td><td>1</td><td>0.17</td><td>0.04</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.19e+4</td><td>1908</td><td>3.13e-5</td><td>4.47e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.75</td><td>571.57</td><td>30</td><td>0.00</td><td>2.44e-5</td></tr><tr><td>1000 insertBefore</td><td>2.31</td><td>433.19</td><td>23</td><td>0.00</td><td>5.11e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.33</td><td>88.30</td><td>5</td><td>0.01</td><td>1.41e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>195.14</td><td>5.12</td><td>1</td><td>0.20</td><td>0.04</td></tr><tr><td>1000000 shift</td><td>26.24</td><td>38.10</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>44.30</td><td>22.57</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>79.54</td><td>12.57</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>56.00</td><td>17.86</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>100000 getWords</td><td>101.66</td><td>9.84</td><td>1</td><td>0.10</td><td>0.01</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.17</td><td>460.58</td><td>24</td><td>0.00</td><td>2.54e-5</td></tr><tr><td>1000 add & delete randomly</td><td>11.23</td><td>89.05</td><td>5</td><td>0.01</td><td>1.99e-4</td></tr><tr><td>1000 addMany</td><td>2.87</td><td>348.16</td><td>18</td><td>0.00</td><td>3.30e-5</td></tr><tr><td>1000 get</td><td>24.53</td><td>40.77</td><td>3</td><td>0.02</td><td>2.11e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>13.39</td><td>74.69</td><td>5</td><td>0.01</td><td>9.80e-4</td></tr><tr><td>1000 add & delete randomly</td><td>16.28</td><td>61.44</td><td>4</td><td>0.02</td><td>9.38e-4</td></tr><tr><td>1000 addMany</td><td>10.94</td><td>91.44</td><td>5</td><td>0.01</td><td>5.48e-4</td></tr><tr><td>1000 get</td><td>24.35</td><td>41.06</td><td>3</td><td>0.02</td><td>0.00</td></tr><tr><td>1000 dfs</td><td>74.51</td><td>13.42</td><td>1</td><td>0.07</td><td>0.00</td></tr><tr><td>1000 bfs</td><td>56.95</td><td>17.56</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>1000 morris</td><td>38.59</td><td>25.91</td><td>2</td><td>0.04</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.03</td><td>493.40</td><td>26</td><td>0.00</td><td>6.59e-5</td></tr><tr><td>1000 add & delete randomly</td><td>12.87</td><td>77.70</td><td>5</td><td>0.01</td><td>5.53e-4</td></tr><tr><td>1000 addMany</td><td>2.14</td><td>466.33</td><td>25</td><td>0.00</td><td>1.21e-4</td></tr><tr><td>1000 get</td><td>25.93</td><td>38.56</td><td>2</td><td>0.03</td><td>9.04e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>directed-graph</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 addVertex</td><td>0.11</td><td>9341.59</td><td>487</td><td>1.07e-4</td><td>4.65e-6</td></tr><tr><td>1000 addEdge</td><td>0.01</td><td>1.53e+5</td><td>8459</td><td>6.55e-6</td><td>8.65e-7</td></tr><tr><td>1000 getVertex</td><td>5.06e-5</td><td>1.98e+7</td><td>1e+6</td><td>5.06e-8</td><td>2.36e-9</td></tr><tr><td>1000 getEdge</td><td>0.02</td><td>4.40e+4</td><td>2356</td><td>2.27e-5</td><td>1.22e-6</td></tr><tr><td>1000 tarjan [needArticulationPoints]</td><td>204.76</td><td>4.88</td><td>1</td><td>0.20</td><td>0.01</td></tr><tr><td>1000 tarjan all</td><td>204.67</td><td>4.89</td><td>1</td><td>0.20</td><td>0.00</td></tr><tr><td>1000 topologicalSort</td><td>168.38</td><td>5.94</td><td>1</td><td>0.17</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.34</td><td>2913.64</td><td>149</td><td>3.43e-4</td><td>5.05e-6</td></tr><tr><td>1000 fib add & pop</td><td>3.93</td><td>254.43</td><td>13</td><td>0.00</td><td>5.15e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>227.99</td><td>4.39</td><td>1</td><td>0.23</td><td>0.07</td></tr><tr><td>1000000 unshift & shift</td><td>176.47</td><td>5.67</td><td>1</td><td>0.18</td><td>0.03</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.72e+4</td><td>1906</td><td>2.69e-5</td><td>3.49e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.78</td><td>562.61</td><td>30</td><td>0.00</td><td>6.55e-5</td></tr><tr><td>1000 insertBefore</td><td>2.35</td><td>425.30</td><td>22</td><td>0.00</td><td>8.54e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.73</td><td>85.28</td><td>5</td><td>0.01</td><td>7.65e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>227.87</td><td>4.39</td><td>1</td><td>0.23</td><td>0.07</td></tr><tr><td>1000000 shift</td><td>25.08</td><td>39.88</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>43.10</td><td>23.20</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>88.41</td><td>11.31</td><td>1</td><td>0.09</td><td>0.04</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>50.41</td><td>19.84</td><td>2</td><td>0.05</td><td>0.00</td></tr><tr><td>100000 getWords</td><td>103.01</td><td>9.71</td><td>1</td><td>0.10</td><td>0.01</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.28</td><td>437.87</td><td>23</td><td>0.00</td><td>1.95e-4</td></tr><tr><td>1000 add & delete randomly</td><td>11.16</td><td>89.62</td><td>5</td><td>0.01</td><td>1.41e-4</td></tr><tr><td>1000 addMany</td><td>3.00</td><td>333.18</td><td>17</td><td>0.00</td><td>2.62e-5</td></tr><tr><td>1000 get</td><td>24.27</td><td>41.20</td><td>3</td><td>0.02</td><td>1.60e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>12.94</td><td>77.28</td><td>5</td><td>0.01</td><td>2.22e-4</td></tr><tr><td>1000 add & delete randomly</td><td>15.85</td><td>63.11</td><td>4</td><td>0.02</td><td>2.55e-4</td></tr><tr><td>1000 addMany</td><td>10.64</td><td>93.95</td><td>5</td><td>0.01</td><td>3.08e-4</td></tr><tr><td>1000 get</td><td>23.67</td><td>42.24</td><td>3</td><td>0.02</td><td>1.79e-4</td></tr><tr><td>1000 dfs</td><td>72.14</td><td>13.86</td><td>1</td><td>0.07</td><td>5.13e-4</td></tr><tr><td>1000 bfs</td><td>54.74</td><td>18.27</td><td>1</td><td>0.05</td><td>4.80e-4</td></tr><tr><td>1000 morris</td><td>37.04</td><td>27.00</td><td>2</td><td>0.04</td><td>2.48e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.09</td><td>477.97</td><td>25</td><td>0.00</td><td>1.43e-5</td></tr><tr><td>1000 add & delete randomly</td><td>12.92</td><td>77.42</td><td>4</td><td>0.01</td><td>2.78e-4</td></tr><tr><td>1000 addMany</td><td>2.20</td><td>454.39</td><td>24</td><td>0.00</td><td>3.52e-5</td></tr><tr><td>1000 get</td><td>25.18</td><td>39.71</td><td>3</td><td>0.03</td><td>1.71e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.34</td><td>2914.73</td><td>149</td><td>3.43e-4</td><td>8.46e-6</td></tr><tr><td>1000 fib add & pop</td><td>3.92</td><td>254.88</td><td>14</td><td>0.00</td><td>6.46e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>194.96</td><td>5.13</td><td>1</td><td>0.19</td><td>0.04</td></tr><tr><td>1000000 unshift & shift</td><td>154.70</td><td>6.46</td><td>1</td><td>0.15</td><td>0.02</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.71e+4</td><td>1921</td><td>2.70e-5</td><td>6.61e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.77</td><td>565.65</td><td>30</td><td>0.00</td><td>4.37e-5</td></tr><tr><td>1000 insertBefore</td><td>2.32</td><td>431.45</td><td>22</td><td>0.00</td><td>4.01e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.67</td><td>85.67</td><td>5</td><td>0.01</td><td>3.92e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>212.30</td><td>4.71</td><td>1</td><td>0.21</td><td>0.04</td></tr><tr><td>1000000 shift</td><td>25.17</td><td>39.73</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>44.65</td><td>22.39</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>80.66</td><td>12.40</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>64.81</td><td>15.43</td><td>1</td><td>0.06</td><td>0.01</td></tr><tr><td>100000 getWords</td><td>126.97</td><td>7.88</td><td>1</td><td>0.13</td><td>0.02</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.10</td><td>475.11</td><td>25</td><td>0.00</td><td>2.06e-5</td></tr><tr><td>1000 add & delete randomly</td><td>11.14</td><td>89.78</td><td>5</td><td>0.01</td><td>2.22e-4</td></tr><tr><td>1000 addMany</td><td>2.89</td><td>346.01</td><td>18</td><td>0.00</td><td>7.29e-5</td></tr><tr><td>1000 get</td><td>24.35</td><td>41.07</td><td>3</td><td>0.02</td><td>1.56e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>12.80</td><td>78.11</td><td>5</td><td>0.01</td><td>7.83e-5</td></tr><tr><td>1000 add & delete randomly</td><td>15.63</td><td>63.97</td><td>4</td><td>0.02</td><td>9.29e-5</td></tr><tr><td>1000 addMany</td><td>10.58</td><td>94.53</td><td>5</td><td>0.01</td><td>1.21e-4</td></tr><tr><td>1000 get</td><td>23.63</td><td>42.31</td><td>3</td><td>0.02</td><td>1.97e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.31</td><td>433.05</td><td>22</td><td>0.00</td><td>5.43e-5</td></tr><tr><td>1000 add & delete randomly</td><td>13.90</td><td>71.92</td><td>4</td><td>0.01</td><td>3.66e-4</td></tr><tr><td>1000 addMany</td><td>2.13</td><td>469.94</td><td>25</td><td>0.00</td><td>4.34e-5</td></tr><tr><td>1000 get</td><td>25.95</td><td>38.54</td><td>2</td><td>0.03</td><td>6.68e-4</td></tr><tr><td>1000 dfs</td><td>73.68</td><td>13.57</td><td>1</td><td>0.07</td><td>0.00</td></tr><tr><td>1000 bfs</td><td>59.29</td><td>16.87</td><td>1</td><td>0.06</td><td>0.01</td></tr><tr><td>1000 morris</td><td>37.84</td><td>26.43</td><td>2</td><td>0.04</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.34</td><td>2913.15</td><td>149</td><td>3.43e-4</td><td>2.85e-6</td></tr><tr><td>1000 fib add & pop</td><td>3.91</td><td>255.50</td><td>14</td><td>0.00</td><td>6.06e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>204.44</td><td>4.89</td><td>1</td><td>0.20</td><td>0.03</td></tr><tr><td>1000000 unshift & shift</td><td>153.33</td><td>6.52</td><td>1</td><td>0.15</td><td>0.03</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.79e+4</td><td>1924</td><td>2.64e-5</td><td>3.02e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.77</td><td>564.14</td><td>30</td><td>0.00</td><td>5.34e-5</td></tr><tr><td>1000 insertBefore</td><td>2.32</td><td>431.40</td><td>22</td><td>0.00</td><td>7.10e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.34</td><td>88.18</td><td>5</td><td>0.01</td><td>1.37e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>194.39</td><td>5.14</td><td>1</td><td>0.19</td><td>0.04</td></tr><tr><td>1000000 shift</td><td>25.45</td><td>39.29</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>42.43</td><td>23.57</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>79.47</td><td>12.58</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>54.41</td><td>18.38</td><td>1</td><td>0.05</td><td>0.00</td></tr><tr><td>100000 getWords</td><td>103.78</td><td>9.64</td><td>1</td><td>0.10</td><td>0.01</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.13</td><td>468.81</td><td>24</td><td>0.00</td><td>1.71e-5</td></tr><tr><td>1000 add & delete randomly</td><td>11.72</td><td>85.36</td><td>5</td><td>0.01</td><td>0.00</td></tr><tr><td>1000 addMany</td><td>2.54</td><td>393.52</td><td>20</td><td>0.00</td><td>2.31e-5</td></tr><tr><td>1000 get</td><td>24.41</td><td>40.97</td><td>3</td><td>0.02</td><td>2.33e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add</td><td>66.25</td><td>15.09</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>1000 delete</td><td>22.00</td><td>45.44</td><td>1056</td><td>0.02</td><td>0.04</td></tr><tr><td>1000 addMany</td><td>10.95</td><td>91.33</td><td>5</td><td>0.01</td><td>0.00</td></tr><tr><td>1000 get</td><td>33.95</td><td>29.45</td><td>2</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.13</td><td>468.52</td><td>25</td><td>0.00</td><td>1.38e-4</td></tr><tr><td>1000 delete randomly</td><td>0.05</td><td>1.97e+4</td><td>1042</td><td>5.08e-5</td><td>2.42e-6</td></tr><tr><td>1000 addMany balanced</td><td>2.66</td><td>375.97</td><td>20</td><td>0.00</td><td>1.42e-4</td></tr><tr><td>1000 get</td><td>57.25</td><td>17.47</td><td>1</td><td>0.06</td><td>0.01</td></tr><tr><td>1000 dfs</td><td>176.13</td><td>5.68</td><td>1</td><td>0.18</td><td>0.01</td></tr><tr><td>1000 bfs</td><td>139.29</td><td>7.18</td><td>1</td><td>0.14</td><td>0.01</td></tr><tr><td>1000 morris</td><td>95.23</td><td>10.50</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.34</td><td>2906.83</td><td>148</td><td>3.44e-4</td><td>4.91e-6</td></tr><tr><td>1000 fib add & pop</td><td>3.94</td><td>253.80</td><td>14</td><td>0.00</td><td>8.47e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>192.84</td><td>5.19</td><td>1</td><td>0.19</td><td>0.04</td></tr><tr><td>1000000 unshift & shift</td><td>172.25</td><td>5.81</td><td>1</td><td>0.17</td><td>0.06</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.57e+4</td><td>1893</td><td>2.80e-5</td><td>1.34e-6</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.81</td><td>553.05</td><td>30</td><td>0.00</td><td>1.26e-4</td></tr><tr><td>1000 insertBefore</td><td>2.33</td><td>428.33</td><td>22</td><td>0.00</td><td>5.84e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.64</td><td>85.89</td><td>5</td><td>0.01</td><td>4.05e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>187.65</td><td>5.33</td><td>1</td><td>0.19</td><td>0.03</td></tr><tr><td>1000000 shift</td><td>25.48</td><td>39.24</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>44.51</td><td>22.47</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>81.12</td><td>12.33</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>65.19</td><td>15.34</td><td>2</td><td>0.07</td><td>0.01</td></tr><tr><td>100000 getWords</td><td>117.42</td><td>8.52</td><td>1</td><td>0.12</td><td>0.02</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.21</td><td>453.16</td><td>23</td><td>0.00</td><td>2.00e-5</td></tr><tr><td>1000 add & delete randomly</td><td>10.96</td><td>91.27</td><td>5</td><td>0.01</td><td>1.89e-4</td></tr><tr><td>1000 addMany</td><td>2.61</td><td>383.69</td><td>20</td><td>0.00</td><td>7.84e-5</td></tr><tr><td>1000 get</td><td>25.13</td><td>39.79</td><td>3</td><td>0.03</td><td>7.48e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add</td><td>67.50</td><td>14.82</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>1000 delete</td><td>23.92</td><td>41.80</td><td>1048</td><td>0.02</td><td>0.04</td></tr><tr><td>1000 addMany</td><td>10.82</td><td>92.42</td><td>5</td><td>0.01</td><td>6.56e-4</td></tr><tr><td>1000 get</td><td>33.23</td><td>30.10</td><td>2</td><td>0.03</td><td>4.01e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>1.96</td><td>511.38</td><td>27</td><td>0.00</td><td>3.28e-5</td></tr><tr><td>1000 delete randomly</td><td>0.05</td><td>2.00e+4</td><td>1049</td><td>5.01e-5</td><td>5.38e-6</td></tr><tr><td>1000 addMany balanced</td><td>2.66</td><td>375.73</td><td>20</td><td>0.00</td><td>1.64e-4</td></tr><tr><td>1000 get</td><td>54.31</td><td>18.41</td><td>1</td><td>0.05</td><td>0.00</td></tr><tr><td>1000 dfs</td><td>168.17</td><td>5.95</td><td>1</td><td>0.17</td><td>0.00</td></tr><tr><td>1000 bfs</td><td>147.47</td><td>6.78</td><td>1</td><td>0.15</td><td>0.02</td></tr><tr><td>1000 morris</td><td>104.11</td><td>9.60</td><td>1</td><td>0.10</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.35</td><td>2832.05</td><td>149</td><td>3.53e-4</td><td>5.74e-5</td></tr><tr><td>1000 fib add & pop</td><td>4.02</td><td>248.85</td><td>14</td><td>0.00</td><td>5.56e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>211.23</td><td>4.73</td><td>1</td><td>0.21</td><td>0.03</td></tr><tr><td>1000000 unshift & shift</td><td>180.12</td><td>5.55</td><td>1</td><td>0.18</td><td>0.04</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.40e+4</td><td>1833</td><td>2.94e-5</td><td>4.38e-6</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.82</td><td>550.20</td><td>30</td><td>0.00</td><td>1.53e-4</td></tr><tr><td>1000 insertBefore</td><td>2.37</td><td>421.75</td><td>22</td><td>0.00</td><td>2.85e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.98</td><td>83.44</td><td>5</td><td>0.01</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>217.79</td><td>4.59</td><td>1</td><td>0.22</td><td>0.02</td></tr><tr><td>1000000 shift</td><td>27.98</td><td>35.74</td><td>3</td><td>0.03</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>44.72</td><td>22.36</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>78.64</td><td>12.72</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>59.24</td><td>16.88</td><td>1</td><td>0.06</td><td>0.01</td></tr><tr><td>100000 getWords</td><td>110.04</td><td>9.09</td><td>1</td><td>0.11</td><td>0.01</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.60</td><td>384.09</td><td>20</td><td>0.00</td><td>2.17e-5</td></tr><tr><td>1000 add & delete randomly</td><td>11.50</td><td>86.96</td><td>5</td><td>0.01</td><td>1.09e-4</td></tr><tr><td>1000 addMany</td><td>2.96</td><td>337.68</td><td>18</td><td>0.00</td><td>2.41e-5</td></tr><tr><td>1000 get</td><td>24.33</td><td>41.10</td><td>3</td><td>0.02</td><td>1.87e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add</td><td>66.65</td><td>15.00</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>1000 delete</td><td>22.94</td><td>43.59</td><td>1048</td><td>0.02</td><td>0.04</td></tr><tr><td>1000 addMany</td><td>10.46</td><td>95.59</td><td>5</td><td>0.01</td><td>1.06e-4</td></tr><tr><td>1000 get</td><td>33.16</td><td>30.15</td><td>2</td><td>0.03</td><td>3.69e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.57</td><td>388.55</td><td>20</td><td>0.00</td><td>2.56e-5</td></tr><tr><td>1000 delete randomly</td><td>0.05</td><td>2.05e+4</td><td>1077</td><td>4.87e-5</td><td>8.43e-7</td></tr><tr><td>1000 addMany balanced</td><td>3.08</td><td>324.33</td><td>17</td><td>0.00</td><td>3.01e-5</td></tr><tr><td>1000 get</td><td>54.02</td><td>18.51</td><td>1</td><td>0.05</td><td>0.00</td></tr><tr><td>1000 dfs</td><td>169.21</td><td>5.91</td><td>1</td><td>0.17</td><td>0.00</td></tr><tr><td>1000 bfs</td><td>136.05</td><td>7.35</td><td>1</td><td>0.14</td><td>0.00</td></tr><tr><td>1000 morris</td><td>90.60</td><td>11.04</td><td>1</td><td>0.09</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.34</td><td>2924.08</td><td>149</td><td>3.42e-4</td><td>3.76e-6</td></tr><tr><td>1000 fib add & pop</td><td>3.88</td><td>258.00</td><td>14</td><td>0.00</td><td>4.57e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>200.13</td><td>5.00</td><td>1</td><td>0.20</td><td>0.04</td></tr><tr><td>1000000 unshift & shift</td><td>151.88</td><td>6.58</td><td>1</td><td>0.15</td><td>0.02</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.78e+4</td><td>1921</td><td>2.65e-5</td><td>4.68e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.77</td><td>565.88</td><td>30</td><td>0.00</td><td>4.84e-5</td></tr><tr><td>1000 insertBefore</td><td>2.32</td><td>431.01</td><td>23</td><td>0.00</td><td>7.27e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.39</td><td>87.80</td><td>5</td><td>0.01</td><td>1.70e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>197.16</td><td>5.07</td><td>1</td><td>0.20</td><td>0.03</td></tr><tr><td>1000000 shift</td><td>25.30</td><td>39.52</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>43.59</td><td>22.94</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>1000000 push & shift</td><td>79.42</td><td>12.59</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>54.98</td><td>18.19</td><td>1</td><td>0.05</td><td>0.00</td></tr><tr><td>100000 getWords</td><td>122.28</td><td>8.18</td><td>1</td><td>0.12</td><td>0.01</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.27</td><td>440.05</td><td>23</td><td>0.00</td><td>8.11e-5</td></tr><tr><td>1000 delete randomly</td><td>0.05</td><td>1.85e+4</td><td>948</td><td>5.40e-5</td><td>6.80e-7</td></tr><tr><td>1000 addMany</td><td>2.99</td><td>334.92</td><td>18</td><td>0.00</td><td>3.05e-5</td></tr><tr><td>1000 get</td><td>53.09</td><td>18.84</td><td>1</td><td>0.05</td><td>9.51e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add</td><td>67.11</td><td>14.90</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>1000 delete</td><td>22.14</td><td>45.16</td><td>1071</td><td>0.02</td><td>0.04</td></tr><tr><td>1000 addMany</td><td>8.95</td><td>111.75</td><td>6</td><td>0.01</td><td>2.26e-4</td></tr><tr><td>1000 get</td><td>31.51</td><td>31.73</td><td>2</td><td>0.03</td><td>3.98e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add randomly</td><td>2.68</td><td>373.07</td><td>24</td><td>0.00</td><td>0.00</td></tr><tr><td>1000 delete randomly</td><td>0.05</td><td>1.96e+4</td><td>1056</td><td>5.11e-5</td><td>3.03e-6</td></tr><tr><td>1000 addMany balanced</td><td>2.68</td><td>373.77</td><td>20</td><td>0.00</td><td>6.55e-5</td></tr><tr><td>1000 get</td><td>55.41</td><td>18.05</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>1000 dfs</td><td>176.11</td><td>5.68</td><td>1</td><td>0.18</td><td>0.00</td></tr><tr><td>1000 bfs</td><td>140.03</td><td>7.14</td><td>1</td><td>0.14</td><td>0.00</td></tr><tr><td>1000 morris</td><td>102.45</td><td>9.76</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 add & pop</td><td>0.34</td><td>2916.00</td><td>150</td><td>3.43e-4</td><td>1.26e-5</td></tr><tr><td>1000 fib add & pop</td><td>4.62</td><td>216.38</td><td>14</td><td>0.00</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 unshift</td><td>197.23</td><td>5.07</td><td>1</td><td>0.20</td><td>0.03</td></tr><tr><td>1000000 unshift & shift</td><td>162.69</td><td>6.15</td><td>1</td><td>0.16</td><td>0.03</td></tr><tr><td>1000 insertBefore</td><td>0.03</td><td>3.63e+4</td><td>1907</td><td>2.76e-5</td><td>7.08e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000 push & pop</td><td>1.82</td><td>549.57</td><td>30</td><td>0.00</td><td>1.65e-4</td></tr><tr><td>1000 insertBefore</td><td>2.33</td><td>430.03</td><td>22</td><td>0.00</td><td>5.59e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>10000 refill & poll</td><td>11.40</td><td>87.71</td><td>5</td><td>0.01</td><td>1.55e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>194.90</td><td>5.13</td><td>1</td><td>0.19</td><td>0.04</td></tr><tr><td>1000000 shift</td><td>24.83</td><td>40.27</td><td>3</td><td>0.02</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1000000 push</td><td>41.71</td><td>23.97</td><td>2</td><td>0.04</td><td>0.00</td></tr><tr><td>1000000 push & shift</td><td>78.72</td><td>12.70</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100000 push</td><td>53.88</td><td>18.56</td><td>1</td><td>0.05</td><td>9.89e-4</td></tr><tr><td>100000 getWords</td><td>98.82</td><td>10.12</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.10</td><td>475.20</td><td>25</td><td>0.00</td><td>2.33e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>1.87e+4</td><td>947</td><td>5.35e-5</td><td>3.85e-7</td></tr><tr><td>addMany 1000</td><td>2.89</td><td>345.59</td><td>18</td><td>0.00</td><td>2.62e-5</td></tr><tr><td>get 1000</td><td>52.02</td><td>19.22</td><td>2</td><td>0.05</td><td>9.28e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>66.58</td><td>15.02</td><td>3</td><td>0.07</td><td>0.01</td></tr><tr><td>delete 1000</td><td>25.34</td><td>39.46</td><td>849</td><td>0.03</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>8.78</td><td>113.85</td><td>6</td><td>0.01</td><td>9.87e-5</td></tr><tr><td>get 1000</td><td>31.27</td><td>31.98</td><td>2</td><td>0.03</td><td>2.82e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.15</td><td>465.12</td><td>24</td><td>0.00</td><td>1.88e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>2.08e+4</td><td>1091</td><td>4.80e-5</td><td>5.57e-7</td></tr><tr><td>addMany 1000 balanced</td><td>2.51</td><td>397.88</td><td>21</td><td>0.00</td><td>3.54e-5</td></tr><tr><td>get 1000</td><td>56.57</td><td>17.68</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>dfs 1000</td><td>170.58</td><td>5.86</td><td>1</td><td>0.17</td><td>0.00</td></tr><tr><td>bfs 1000</td><td>139.69</td><td>7.16</td><td>1</td><td>0.14</td><td>0.00</td></tr><tr><td>morris 1000</td><td>97.36</td><td>10.27</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.34</td><td>2923.16</td><td>149</td><td>3.42e-4</td><td>4.01e-6</td></tr><tr><td>fib add & pop 1000</td><td>3.88</td><td>257.61</td><td>14</td><td>0.00</td><td>4.95e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>193.54</td><td>5.17</td><td>1</td><td>0.19</td><td>0.03</td></tr><tr><td>unshift & shift 1000000</td><td>164.74</td><td>6.07</td><td>1</td><td>0.16</td><td>0.03</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.72e+4</td><td>1908</td><td>2.69e-5</td><td>7.19e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.77</td><td>565.06</td><td>29</td><td>0.00</td><td>8.16e-5</td></tr><tr><td>insertBefore 1000</td><td>2.31</td><td>433.08</td><td>22</td><td>0.00</td><td>5.99e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 10000</td><td>11.40</td><td>87.73</td><td>5</td><td>0.01</td><td>1.86e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>210.40</td><td>4.75</td><td>1</td><td>0.21</td><td>0.05</td></tr><tr><td>shift 1000000</td><td>25.12</td><td>39.80</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>42.11</td><td>23.75</td><td>2</td><td>0.04</td><td>0.00</td></tr><tr><td>push & shift 1000000</td><td>78.82</td><td>12.69</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 100000</td><td>52.72</td><td>18.97</td><td>1</td><td>0.05</td><td>0.00</td></tr><tr><td>getWords 100000</td><td>98.36</td><td>10.17</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.07</td><td>482.88</td><td>25</td><td>0.00</td><td>2.62e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.06</td><td>1.73e+4</td><td>922</td><td>5.77e-5</td><td>5.23e-6</td></tr><tr><td>addMany 1000</td><td>2.87</td><td>348.56</td><td>18</td><td>0.00</td><td>2.76e-5</td></tr><tr><td>get 1000</td><td>52.08</td><td>19.20</td><td>2</td><td>0.05</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>67.65</td><td>14.78</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>delete 1000</td><td>23.38</td><td>42.78</td><td>1083</td><td>0.02</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>8.81</td><td>113.55</td><td>6</td><td>0.01</td><td>8.24e-5</td></tr><tr><td>get 1000</td><td>32.11</td><td>31.15</td><td>2</td><td>0.03</td><td>4.49e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.15</td><td>464.93</td><td>24</td><td>0.00</td><td>2.37e-4</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>2.08e+4</td><td>1062</td><td>4.81e-5</td><td>5.51e-7</td></tr><tr><td>addMany 1000 balanced</td><td>2.51</td><td>397.64</td><td>21</td><td>0.00</td><td>5.50e-5</td></tr><tr><td>get 1000</td><td>57.87</td><td>17.28</td><td>1</td><td>0.06</td><td>0.01</td></tr><tr><td>dfs 1000</td><td>168.09</td><td>5.95</td><td>1</td><td>0.17</td><td>7.76e-4</td></tr><tr><td>bfs 1000</td><td>143.73</td><td>6.96</td><td>1</td><td>0.14</td><td>0.00</td></tr><tr><td>morris 1000</td><td>96.97</td><td>10.31</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.34</td><td>2927.21</td><td>149</td><td>3.42e-4</td><td>3.55e-6</td></tr><tr><td>fib add & pop 1000</td><td>3.91</td><td>255.44</td><td>14</td><td>0.00</td><td>1.98e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>196.83</td><td>5.08</td><td>1</td><td>0.20</td><td>0.02</td></tr><tr><td>unshift & shift 1000000</td><td>152.50</td><td>6.56</td><td>1</td><td>0.15</td><td>0.02</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.78e+4</td><td>1922</td><td>2.65e-5</td><td>2.96e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.76</td><td>569.49</td><td>29</td><td>0.00</td><td>5.19e-5</td></tr><tr><td>insertBefore 1000</td><td>2.30</td><td>435.27</td><td>22</td><td>0.00</td><td>4.67e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 1000000</td><td>1880.37</td><td>0.53</td><td>1</td><td>1.88</td><td>0.06</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>210.28</td><td>4.76</td><td>1</td><td>0.21</td><td>0.03</td></tr><tr><td>shift 1000000</td><td>24.42</td><td>40.94</td><td>3</td><td>0.02</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>41.74</td><td>23.96</td><td>2</td><td>0.04</td><td>0.00</td></tr><tr><td>push & shift 1000000</td><td>81.48</td><td>12.27</td><td>1</td><td>0.08</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 100000</td><td>57.44</td><td>17.41</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>getWords 100000</td><td>129.57</td><td>7.72</td><td>1</td><td>0.13</td><td>0.01</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.09</td><td>477.46</td><td>25</td><td>0.00</td><td>2.54e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.06</td><td>1.78e+4</td><td>919</td><td>5.61e-5</td><td>1.46e-6</td></tr><tr><td>addMany 1000</td><td>2.96</td><td>337.92</td><td>18</td><td>0.00</td><td>7.78e-5</td></tr><tr><td>get 1000</td><td>54.25</td><td>18.43</td><td>1</td><td>0.05</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>67.80</td><td>14.75</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>delete 1000</td><td>22.79</td><td>43.88</td><td>1094</td><td>0.02</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>8.83</td><td>113.24</td><td>6</td><td>0.01</td><td>1.42e-4</td></tr><tr><td>get 1000</td><td>30.52</td><td>32.76</td><td>2</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.18</td><td>459.02</td><td>24</td><td>0.00</td><td>7.16e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>2.06e+4</td><td>1083</td><td>4.85e-5</td><td>1.15e-6</td></tr><tr><td>addMany 1000 balanced</td><td>2.53</td><td>394.85</td><td>21</td><td>0.00</td><td>6.11e-5</td></tr><tr><td>get 1000</td><td>56.51</td><td>17.70</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>dfs 1000</td><td>173.68</td><td>5.76</td><td>1</td><td>0.17</td><td>0.00</td></tr><tr><td>bfs 1000</td><td>156.93</td><td>6.37</td><td>1</td><td>0.16</td><td>0.04</td></tr><tr><td>morris 1000</td><td>96.71</td><td>10.34</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.35</td><td>2876.02</td><td>149</td><td>3.48e-4</td><td>4.35e-5</td></tr><tr><td>fib add & pop 1000</td><td>4.09</td><td>244.66</td><td>14</td><td>0.00</td><td>5.12e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>210.78</td><td>4.74</td><td>1</td><td>0.21</td><td>0.05</td></tr><tr><td>unshift & shift 1000000</td><td>161.09</td><td>6.21</td><td>1</td><td>0.16</td><td>0.03</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.73e+4</td><td>1923</td><td>2.68e-5</td><td>8.43e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.85</td><td>539.24</td><td>30</td><td>0.00</td><td>2.91e-4</td></tr><tr><td>insertBefore 1000</td><td>2.35</td><td>424.68</td><td>22</td><td>0.00</td><td>2.11e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 1000000</td><td>1804.27</td><td>0.55</td><td>1</td><td>1.80</td><td>0.02</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>221.64</td><td>4.51</td><td>1</td><td>0.22</td><td>0.02</td></tr><tr><td>shift 1000000</td><td>25.77</td><td>38.80</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>42.25</td><td>23.67</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>push & shift 1000000</td><td>79.53</td><td>12.57</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 100000</td><td>54.33</td><td>18.41</td><td>1</td><td>0.05</td><td>0.00</td></tr><tr><td>getWords 100000</td><td>96.38</td><td>10.38</td><td>1</td><td>0.10</td><td>0.01</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.14</td><td>468.25</td><td>24</td><td>0.00</td><td>5.65e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.06</td><td>1.79e+4</td><td>921</td><td>5.59e-5</td><td>2.02e-6</td></tr><tr><td>addMany 1000</td><td>2.91</td><td>344.07</td><td>18</td><td>0.00</td><td>6.78e-5</td></tr><tr><td>get 1000</td><td>51.87</td><td>19.28</td><td>2</td><td>0.05</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>68.32</td><td>14.64</td><td>3</td><td>0.07</td><td>0.01</td></tr><tr><td>delete 1000</td><td>23.84</td><td>41.95</td><td>1064</td><td>0.02</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>8.88</td><td>112.68</td><td>6</td><td>0.01</td><td>1.46e-4</td></tr><tr><td>get 1000</td><td>31.50</td><td>31.74</td><td>2</td><td>0.03</td><td>3.96e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.00</td><td>500.66</td><td>26</td><td>0.00</td><td>7.44e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>2.03e+4</td><td>1054</td><td>4.94e-5</td><td>1.86e-6</td></tr><tr><td>addMany 1000 balanced</td><td>2.51</td><td>397.65</td><td>21</td><td>0.00</td><td>4.80e-5</td></tr><tr><td>get 1000</td><td>56.09</td><td>17.83</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>dfs 1000</td><td>174.02</td><td>5.75</td><td>1</td><td>0.17</td><td>0.00</td></tr><tr><td>bfs 1000</td><td>141.06</td><td>7.09</td><td>1</td><td>0.14</td><td>0.00</td></tr><tr><td>morris 1000</td><td>92.36</td><td>10.83</td><td>1</td><td>0.09</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.34</td><td>2917.16</td><td>149</td><td>3.43e-4</td><td>5.21e-6</td></tr><tr><td>fib add & pop 1000</td><td>3.89</td><td>256.80</td><td>14</td><td>0.00</td><td>9.36e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>190.62</td><td>5.25</td><td>1</td><td>0.19</td><td>0.03</td></tr><tr><td>unshift & shift 1000000</td><td>168.36</td><td>5.94</td><td>1</td><td>0.17</td><td>0.03</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.37e+4</td><td>1883</td><td>2.97e-5</td><td>6.52e-6</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.85</td><td>541.77</td><td>30</td><td>0.00</td><td>3.02e-4</td></tr><tr><td>insertBefore 1000</td><td>2.32</td><td>431.07</td><td>22</td><td>0.00</td><td>5.25e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 1000000</td><td>1913.83</td><td>0.52</td><td>1</td><td>1.91</td><td>0.10</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>216.62</td><td>4.62</td><td>1</td><td>0.22</td><td>0.01</td></tr><tr><td>shift 1000000</td><td>27.11</td><td>36.88</td><td>3</td><td>0.03</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>42.14</td><td>23.73</td><td>2</td><td>0.04</td><td>0.00</td></tr><tr><td>push & shift 1000000</td><td>78.64</td><td>12.72</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000</td><td>0.49</td><td>2026.34</td><td>152</td><td>4.94e-4</td><td>6.50e-5</td></tr><tr><td>getWords 1000</td><td>0.82</td><td>1221.37</td><td>69</td><td>8.19e-4</td><td>2.39e-4</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.12</td><td>471.67</td><td>25</td><td>0.00</td><td>5.01e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.06</td><td>1.81e+4</td><td>931</td><td>5.53e-5</td><td>7.08e-7</td></tr><tr><td>addMany 1000</td><td>2.87</td><td>348.35</td><td>18</td><td>0.00</td><td>3.58e-5</td></tr><tr><td>get 1000</td><td>53.76</td><td>18.60</td><td>1</td><td>0.05</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>66.89</td><td>14.95</td><td>3</td><td>0.07</td><td>0.01</td></tr><tr><td>delete 1000</td><td>28.05</td><td>35.65</td><td>1092</td><td>0.03</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>9.09</td><td>110.01</td><td>6</td><td>0.01</td><td>4.39e-4</td></tr><tr><td>get 1000</td><td>30.55</td><td>32.73</td><td>2</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.03</td><td>493.66</td><td>26</td><td>0.00</td><td>3.35e-4</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>2.20e+4</td><td>1116</td><td>4.55e-5</td><td>5.93e-7</td></tr><tr><td>addMany 1000 balanced</td><td>2.65</td><td>378.00</td><td>20</td><td>0.00</td><td>9.59e-5</td></tr><tr><td>get 1000</td><td>67.90</td><td>14.73</td><td>1</td><td>0.07</td><td>0.02</td></tr><tr><td>dfs 1000</td><td>172.24</td><td>5.81</td><td>1</td><td>0.17</td><td>0.00</td></tr><tr><td>bfs 1000</td><td>141.51</td><td>7.07</td><td>1</td><td>0.14</td><td>0.00</td></tr><tr><td>morris 1000</td><td>95.27</td><td>10.50</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.34</td><td>2921.08</td><td>149</td><td>3.42e-4</td><td>3.52e-6</td></tr><tr><td>fib add & pop 1000</td><td>3.94</td><td>253.57</td><td>14</td><td>0.00</td><td>9.42e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>204.77</td><td>4.88</td><td>1</td><td>0.20</td><td>0.03</td></tr><tr><td>unshift & shift 1000000</td><td>164.80</td><td>6.07</td><td>1</td><td>0.16</td><td>0.02</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.53e+4</td><td>1910</td><td>2.83e-5</td><td>5.73e-6</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.77</td><td>564.06</td><td>30</td><td>0.00</td><td>4.03e-5</td></tr><tr><td>insertBefore 1000</td><td>2.33</td><td>428.74</td><td>22</td><td>0.00</td><td>5.85e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 1000000</td><td>1911.53</td><td>0.52</td><td>1</td><td>1.91</td><td>0.04</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>220.69</td><td>4.53</td><td>1</td><td>0.22</td><td>0.04</td></tr><tr><td>shift 1000000</td><td>25.02</td><td>39.96</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>42.43</td><td>23.57</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>push & shift 1000000</td><td>80.16</td><td>12.48</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>535.25</td><td>1.87</td><td>1</td><td>0.54</td><td>0.01</td></tr><tr><td>getWords 1000000</td><td>954.39</td><td>1.05</td><td>1</td><td>0.95</td><td>0.05</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.12</td><td>471.05</td><td>24</td><td>0.00</td><td>1.97e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.06</td><td>1.81e+4</td><td>924</td><td>5.52e-5</td><td>6.93e-7</td></tr><tr><td>addMany 1000</td><td>2.91</td><td>343.28</td><td>18</td><td>0.00</td><td>4.22e-5</td></tr><tr><td>get 1000</td><td>54.16</td><td>18.47</td><td>1</td><td>0.05</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>66.45</td><td>15.05</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>delete 1000</td><td>23.68</td><td>42.23</td><td>1105</td><td>0.02</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>8.88</td><td>112.56</td><td>6</td><td>0.01</td><td>2.72e-4</td></tr><tr><td>get 1000</td><td>33.41</td><td>29.93</td><td>2</td><td>0.03</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.02</td><td>494.39</td><td>26</td><td>0.00</td><td>4.57e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.04</td><td>2.23e+4</td><td>1141</td><td>4.49e-5</td><td>7.95e-7</td></tr><tr><td>addMany 1000 balanced</td><td>2.66</td><td>375.24</td><td>20</td><td>0.00</td><td>9.32e-5</td></tr><tr><td>get 1000</td><td>62.64</td><td>15.96</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>dfs 1000</td><td>171.07</td><td>5.85</td><td>1</td><td>0.17</td><td>0.00</td></tr><tr><td>bfs 1000</td><td>141.61</td><td>7.06</td><td>1</td><td>0.14</td><td>8.60e-4</td></tr><tr><td>morris 1000</td><td>96.09</td><td>10.41</td><td>1</td><td>0.10</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.34</td><td>2921.53</td><td>148</td><td>3.42e-4</td><td>3.47e-6</td></tr><tr><td>fib add & pop 1000</td><td>3.90</td><td>256.59</td><td>14</td><td>0.00</td><td>6.06e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>208.24</td><td>4.80</td><td>1</td><td>0.21</td><td>0.04</td></tr><tr><td>unshift & shift 1000000</td><td>152.50</td><td>6.56</td><td>1</td><td>0.15</td><td>0.01</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.66e+4</td><td>1921</td><td>2.73e-5</td><td>1.79e-6</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.75</td><td>571.08</td><td>30</td><td>0.00</td><td>3.19e-5</td></tr><tr><td>insertBefore 1000</td><td>2.33</td><td>429.11</td><td>22</td><td>0.00</td><td>8.52e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 1000000</td><td>1854.15</td><td>0.54</td><td>1</td><td>1.85</td><td>0.05</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>212.74</td><td>4.70</td><td>1</td><td>0.21</td><td>0.02</td></tr><tr><td>shift 1000000</td><td>25.11</td><td>39.82</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>42.64</td><td>23.45</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>push & shift 1000000</td><td>78.50</td><td>12.74</td><td>1</td><td>0.08</td><td>7.49e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>3.17</td><td>315.82</td><td>18</td><td>0.00</td><td>3.74e-4</td></tr><tr><td>getWords 1000000</td><td>5.00</td><td>199.99</td><td>11</td><td>0.01</td><td>1.85e-4</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.19</td><td>457.50</td><td>24</td><td>0.00</td><td>6.07e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.06</td><td>1.80e+4</td><td>924</td><td>5.56e-5</td><td>1.04e-6</td></tr><tr><td>addMany 1000</td><td>3.02</td><td>330.95</td><td>17</td><td>0.00</td><td>9.53e-5</td></tr><tr><td>get 1000</td><td>52.92</td><td>18.90</td><td>2</td><td>0.05</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>65.94</td><td>15.17</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>delete 1000</td><td>31.56</td><td>31.68</td><td>1098</td><td>0.03</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>8.94</td><td>111.81</td><td>6</td><td>0.01</td><td>3.04e-4</td></tr><tr><td>get 1000</td><td>31.51</td><td>31.73</td><td>2</td><td>0.03</td><td>2.99e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.45</td><td>408.29</td><td>21</td><td>0.00</td><td>2.76e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>2.22e+4</td><td>1132</td><td>4.51e-5</td><td>6.97e-7</td></tr><tr><td>addMany 1000 balanced</td><td>2.74</td><td>364.65</td><td>20</td><td>0.00</td><td>8.78e-5</td></tr><tr><td>get 1000</td><td>61.54</td><td>16.25</td><td>1</td><td>0.06</td><td>0.00</td></tr><tr><td>dfs 1000</td><td>172.43</td><td>5.80</td><td>1</td><td>0.17</td><td>0.00</td></tr><tr><td>bfs 1000</td><td>140.76</td><td>7.10</td><td>1</td><td>0.14</td><td>0.00</td></tr><tr><td>morris 1000</td><td>93.57</td><td>10.69</td><td>1</td><td>0.09</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.34</td><td>2933.08</td><td>149</td><td>3.41e-4</td><td>2.82e-6</td></tr><tr><td>fib add & pop 1000</td><td>3.89</td><td>257.27</td><td>14</td><td>0.00</td><td>3.17e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>192.82</td><td>5.19</td><td>1</td><td>0.19</td><td>0.04</td></tr><tr><td>unshift & shift 1000000</td><td>156.37</td><td>6.40</td><td>1</td><td>0.16</td><td>0.03</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.70e+4</td><td>1896</td><td>2.70e-5</td><td>3.66e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.79</td><td>559.70</td><td>30</td><td>0.00</td><td>2.97e-4</td></tr><tr><td>insertBefore 1000</td><td>2.32</td><td>430.90</td><td>22</td><td>0.00</td><td>6.01e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 1000000</td><td>1874.70</td><td>0.53</td><td>1</td><td>1.87</td><td>0.04</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>209.65</td><td>4.77</td><td>1</td><td>0.21</td><td>0.03</td></tr><tr><td>shift 1000000</td><td>25.54</td><td>39.15</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>42.43</td><td>23.57</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>push & shift 1000000</td><td>79.60</td><td>12.56</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.08</td><td>479.69</td><td>25</td><td>0.00</td><td>2.14e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>1.82e+4</td><td>924</td><td>5.49e-5</td><td>4.16e-7</td></tr><tr><td>addMany 1000</td><td>2.88</td><td>347.21</td><td>18</td><td>0.00</td><td>2.69e-5</td></tr><tr><td>get 1000</td><td>52.72</td><td>18.97</td><td>1</td><td>0.05</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>65.05</td><td>15.37</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>delete 1000</td><td>26.26</td><td>38.08</td><td>1104</td><td>0.03</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>8.81</td><td>113.44</td><td>6</td><td>0.01</td><td>9.78e-5</td></tr><tr><td>get 1000</td><td>31.44</td><td>31.80</td><td>2</td><td>0.03</td><td>3.59e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.04</td><td>490.04</td><td>25</td><td>0.00</td><td>2.37e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.04</td><td>2.23e+4</td><td>1137</td><td>4.48e-5</td><td>6.04e-7</td></tr><tr><td>addMany 1000 balanced</td><td>2.67</td><td>375.13</td><td>20</td><td>0.00</td><td>2.64e-4</td></tr><tr><td>get 1000</td><td>62.25</td><td>16.06</td><td>1</td><td>0.06</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.34</td><td>2919.71</td><td>149</td><td>3.43e-4</td><td>4.56e-6</td></tr><tr><td>fib add & pop 1000</td><td>3.88</td><td>257.61</td><td>14</td><td>0.00</td><td>4.79e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>202.43</td><td>4.94</td><td>1</td><td>0.20</td><td>0.02</td></tr><tr><td>unshift & shift 1000000</td><td>158.09</td><td>6.33</td><td>1</td><td>0.16</td><td>0.03</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.75e+4</td><td>1922</td><td>2.67e-5</td><td>4.57e-7</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.77</td><td>564.48</td><td>30</td><td>0.00</td><td>7.71e-5</td></tr><tr><td>insertBefore 1000</td><td>2.29</td><td>435.77</td><td>22</td><td>0.00</td><td>3.74e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 1000000</td><td>1812.54</td><td>0.55</td><td>1</td><td>1.81</td><td>0.02</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>205.83</td><td>4.86</td><td>1</td><td>0.21</td><td>0.03</td></tr><tr><td>shift 1000000</td><td>24.78</td><td>40.35</td><td>3</td><td>0.02</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>42.29</td><td>23.65</td><td>2</td><td>0.04</td><td>0.01</td></tr><tr><td>push & shift 1000000</td><td>78.34</td><td>12.77</td><td>1</td><td>0.08</td><td>0.00</td></tr></table></div>
    </div>
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.39</td><td>418.91</td><td>22</td><td>0.00</td><td>6.47e-5</td></tr><tr><td>delete 1000 randomly</td><td>0.06</td><td>1.77e+4</td><td>917</td><td>5.66e-5</td><td>1.90e-6</td></tr><tr><td>addMany 1000</td><td>3.32</td><td>301.33</td><td>17</td><td>0.00</td><td>5.90e-4</td></tr><tr><td>get 1000</td><td>55.03</td><td>18.17</td><td>1</td><td>0.06</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000</td><td>66.49</td><td>15.04</td><td>3</td><td>0.07</td><td>0.00</td></tr><tr><td>delete 1000</td><td>24.04</td><td>41.60</td><td>1106</td><td>0.02</td><td>0.04</td></tr><tr><td>addMany 1000</td><td>9.05</td><td>110.44</td><td>6</td><td>0.01</td><td>2.88e-4</td></tr><tr><td>get 1000</td><td>32.12</td><td>31.13</td><td>2</td><td>0.03</td><td>6.75e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add 1000 randomly</td><td>2.27</td><td>440.62</td><td>23</td><td>0.00</td><td>1.42e-4</td></tr><tr><td>delete 1000 randomly</td><td>0.05</td><td>2.19e+4</td><td>1174</td><td>4.57e-5</td><td>1.97e-6</td></tr><tr><td>addMany 1000 balanced</td><td>2.93</td><td>341.38</td><td>19</td><td>0.00</td><td>1.13e-4</td></tr><tr><td>get 1000</td><td>62.85</td><td>15.91</td><td>1</td><td>0.06</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>add & 1000</td><td>0.35</td><td>2878.39</td><td>149</td><td>3.47e-4</td><td>1.93e-5</td></tr><tr><td>fib add & pop 1000</td><td>3.98</td><td>251.35</td><td>14</td><td>0.00</td><td>1.32e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>unshift 1000000</td><td>193.19</td><td>5.18</td><td>1</td><td>0.19</td><td>0.04</td></tr><tr><td>unshift & shift 1000000</td><td>170.35</td><td>5.87</td><td>1</td><td>0.17</td><td>0.03</td></tr><tr><td>insertBefore 1000</td><td>0.03</td><td>3.43e+4</td><td>1888</td><td>2.91e-5</td><td>6.03e-6</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push & pop 1000</td><td>1.79</td><td>560.08</td><td>29</td><td>0.00</td><td>7.70e-5</td></tr><tr><td>insertBefore 1000</td><td>2.31</td><td>433.45</td><td>22</td><td>0.00</td><td>5.52e-5</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>refill & poll 1000000</td><td>1859.40</td><td>0.54</td><td>1</td><td>1.86</td><td>0.03</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>215.00</td><td>4.65</td><td>1</td><td>0.22</td><td>0.01</td></tr><tr><td>shift 1000000</td><td>25.04</td><td>39.94</td><td>3</td><td>0.03</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>executed times</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>push 1000000</td><td>41.81</td><td>23.92</td><td>2</td><td>0.04</td><td>0.00</td></tr><tr><td>push & shift 1000000</td><td>79.17</td><td>12.63</td><td>1</td><td>0.08</td><td>8.70e-4</td></tr></table></div>
    </div>