# Data Structure Typed

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Language](https://img.shields.io/github/languages/top/zrwusa/data-structure-typed)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/zrwusa/data-structure-typed)
![Branches](https://img.shields.io/badge/branches-97.54%25-brightgreen.svg?style=flat)
![npm](https://aleen42.github.io/badges/src/npm.svg)
![eslint](https://aleen42.github.io/badges/src/eslint.svg)

[//]: # (![Typescript]&#40;https://img.shields.io/github/package-json/dependency-version/zrwusa/data-structure-typed/dev/typescript&#41;)

[//]: # (![TypeDoc]&#40;https://img.shields.io/github/package-json/dependency-version/zrwusa/data-structure-typed/dev/typedoc&#41;)

[//]: # (![Total Downloads]&#40;https://img.shields.io/github/downloads/zrwusa/data-structure-typed/total&#41;)

## Brief
Data Structures of Javascript & TypeScript.  

## Built-in classic algorithms
DFS(Depth-First Search), DFSIterative, BFS(Breadth-First Search), 
morris, Bellman-Ford Algorithm, Dijkstra's Algorithm, Floyd-Warshall Algorithm, 
Tarjan's Algorithm.

## Installation and Usage
### npm
```bash
npm install data-structure-typed --save
```
### yarn
```bash
yarn add data-structure-typed
```
### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/data-structure-typed/umd/bundle.min.js"></script>
```
```js
const {AVLTree} = dataStructureTyped;
const {Heap, MinHeap, SinglyLinkedList, Stack, AVLTreeNode, BST, Trie, DirectedGraph, DirectedVertex, TreeMultiset} = dataStructureTyped;
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

    bst.remove(6);
    bst.get(6);                     // null
    bst.isAVLBalanced();            // true
    bst.BFS()[0] === 11;            // true
    

    const objBST = new BST<BSTNode<{ id: number, keyA: number }>>();
    objBST.add(11, {id: 11, keyA: 11});
    objBST.add(3, {id: 3, keyA: 3});
    
    objBST.addMany([{id: 15, keyA: 15}, {id: 1, keyA: 1}, {id: 8, keyA: 8},
        {id: 13, keyA: 13}, {id: 16, keyA: 16}, {id: 2, keyA: 2},
        {id: 6, keyA: 6}, {id: 9, keyA: 9}, {id: 12, keyA: 12},
        {id: 14, keyA: 14}, {id: 4, keyA: 4}, {id: 7, keyA: 7},
        {id: 10, keyA: 10}, {id: 5, keyA: 5}]);
    
    objBST.remove(11);
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
    bst.remove(6);
    bst.get(6);             // null
    bst.isAVLBalanced();    // true or false
    const bfsIDs = bst.BFS();
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
    
    objBST.remove(11);
    
    
    const avlTree = new AVLTree();
    avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
    avlTree.isAVLBalanced();    // true
    avlTree.remove(10);
    avlTree.isAVLBalanced();    // true

```

### AVLTree snippet
#### TS
```ts
import {AVLTree} from 'data-structure-typed';

const avlTree = new AVLTree();
avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
avlTree.isAVLBalanced();    // true
avlTree.remove(10);
avlTree.isAVLBalanced();    // true
```
#### JS
```js
const {AVLTree} = require('data-structure-typed');

const avlTree = new AVLTree();
avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
avlTree.isAVLBalanced();    // true
avlTree.remove(10);
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

graph.removeEdgeSrcToDest('A', 'B');
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
graph.removeVertex('C');
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

[//]: # (<tr>)

[//]: # (<td>Hash</td>)

[//]: # (<td></td>)

[//]: # (<td></td>)

[//]: # (<td><a href="https://data-structure-typed-docs.vercel.app/classes/HashTable.html"><span>HashTable</span></a></td>)

[//]: # (<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>)

[//]: # (</tr>)
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

[//]: # (## API docs)

[//]: # (<ul>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/AVLTree.html" rel="nofollow"><span>AVLTree</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/AVLTreeNode.html" rel="nofollow"><span>AVLTreeNode</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/AbstractEdge.html" rel="nofollow"><span>AbstractEdge</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/AbstractGraph.html" rel="nofollow"><span>AbstractGraph</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/AbstractVertex.html" rel="nofollow"><span>AbstractVertex</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/ArrayDeque.html" rel="nofollow"><span>ArrayDeque</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/BST.html" rel="nofollow"><span>BST</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/BSTNode.html" rel="nofollow"><span>BSTNode</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryIndexedTree.html" rel="nofollow"><span>BinaryIndexedTree</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryTree.html" rel="nofollow"><span>BinaryTree</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryTreeNode.html" rel="nofollow"><span>BinaryTreeNode</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Character.html" rel="nofollow"><span>Character</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/CoordinateMap.html" rel="nofollow"><span>CoordinateMap</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/CoordinateSet.html" rel="nofollow"><span>CoordinateSet</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Deque.html" rel="nofollow"><span>Deque</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/DirectedEdge.html" rel="nofollow"><span>DirectedEdge</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/DirectedGraph.html" rel="nofollow"><span>DirectedGraph</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/DirectedVertex.html" rel="nofollow"><span>DirectedVertex</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/DoublyLinkedList.html" rel="nofollow"><span>DoublyLinkedList</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/DoublyLinkedListNode.html" rel="nofollow"><span>DoublyLinkedListNode</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Heap.html" rel="nofollow"><span>Heap</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Matrix2D.html" rel="nofollow"><span>Matrix2D</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/MatrixNTI2D.html" rel="nofollow"><span>MatrixNTI2D</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/MaxHeap.html" rel="nofollow"><span>MaxHeap</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/MaxPriorityQueue.html" rel="nofollow"><span>MaxPriorityQueue</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/MinHeap.html" rel="nofollow"><span>MinHeap</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/MinPriorityQueue.html" rel="nofollow"><span>MinPriorityQueue</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Navigator.html" rel="nofollow"><span>Navigator</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/ObjectDeque.html" rel="nofollow"><span>ObjectDeque</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/PriorityQueue.html" rel="nofollow"><span>PriorityQueue</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Queue.html" rel="nofollow"><span>Queue</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/SegmentTree.html" rel="nofollow"><span>SegmentTree</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/SegmentTreeNode.html" rel="nofollow"><span>SegmentTreeNode</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html" rel="nofollow"><span>SinglyLinkedList</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedListNode.html" rel="nofollow"><span>SinglyLinkedListNode</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Stack.html" rel="nofollow"><span>Stack</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/TreeMultiSet.html" rel="nofollow"><span>TreeMultiSet</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Trie.html" rel="nofollow"><span>Trie</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/TrieNode.html" rel="nofollow"><span>TrieNode</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/UndirectedEdge.html" rel="nofollow"><span>UndirectedEdge</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/UndirectedGraph.html" rel="nofollow"><span>UndirectedGraph</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/UndirectedVertex.html" rel="nofollow"><span>UndirectedVertex</span></a></li>)

[//]: # (<li><a href="https://data-structure-typed-docs.vercel.app/classes/Vector2D.html" rel="nofollow"><span>Vector2D</span></a></li>)

[//]: # (</ul>)


[//]: # (![Statements]&#40;https://img.shields.io/badge/statements-55.31%25-red.svg?style=flat&#41;)

[//]: # (![Branches]&#40;https://img.shields.io/badge/branches-47.04%25-red.svg?style=flat&#41;)

[//]: # (![Functions]&#40;https://img.shields.io/badge/functions-48.29%25-red.svg?style=flat&#41;)

[//]: # (![Lines]&#40;https://img.shields.io/badge/lines-56.92%25-red.svg?style=flat&#41;)

## Code design
By strictly adhering to object-oriented design (BinaryTree -> BST -> AVLTree -> TreeMultiset), you can seamlessly inherit the existing data structures to implement the customized ones you need. Object-oriented design stands as the optimal approach to data structure design.

## Complexities

### performance of Big O
<table>
<thead>
<tr>
<th>Big O Notation</th>
<th>Type</th>
<th>Computations for 10 elements</th>
<th>Computations for 100 elements</th>
<th>Computations for 1000 elements</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>O(1)</strong></td>
<td>Constant</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td><strong>O(log N)</strong></td>
<td>Logarithmic</td>
<td>3</td>
<td>6</td>
<td>9</td>
</tr>
<tr>
<td><strong>O(N)</strong></td>
<td>Linear</td>
<td>10</td>
<td>100</td>
<td>1000</td>
</tr>
<tr>
<td><strong>O(N log N)</strong></td>
<td>n log(n)</td>
<td>30</td>
<td>600</td>
<td>9000</td>
</tr>
<tr>
<td><strong>O(N^2)</strong></td>
<td>Quadratic</td>
<td>100</td>
<td>10000</td>
<td>1000000</td>
</tr>
<tr>
<td><strong>O(2^N)</strong></td>
<td>Exponential</td>
<td>1024</td>
<td>1.26e+29</td>
<td>1.07e+301</td>
</tr>
<tr>
<td><strong>O(N!)</strong></td>
<td>Factorial</td>
<td>3628800</td>
<td>9.3e+157</td>
<td>4.02e+2567</td>
</tr>
</tbody>
</table>

### Data Structure Complexity
<table>
<thead>
<tr>
<th>Data Structure</th>
<th>Access</th>
<th>Search</th>
<th>Insertion</th>
<th>Deletion</th>
<th>Comments</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Array</strong></td>
<td>1</td>
<td>n</td>
<td>n</td>
<td>n</td>
<td></td>
</tr>
<tr>
<td><strong>Stack</strong></td>
<td>n</td>
<td>n</td>
<td>1</td>
<td>1</td>
<td></td>
</tr>
<tr>
<td><strong>Queue</strong></td>
<td>n</td>
<td>n</td>
<td>1</td>
<td>1</td>
<td></td>
</tr>
<tr>
<td><strong>Linked List</strong></td>
<td>n</td>
<td>n</td>
<td>1</td>
<td>n</td>
<td></td>
</tr>
<tr>
<td><strong>Hash Table</strong></td>
<td>-</td>
<td>n</td>
<td>n</td>
<td>n</td>
<td>In case of perfect hash function costs would be O(1)</td>
</tr>
<tr>
<td><strong>Binary Search Tree</strong></td>
<td>n</td>
<td>n</td>
<td>n</td>
<td>n</td>
<td>In case of balanced tree costs would be O(log(n))</td>
</tr>
<tr>
<td><strong>B-Tree</strong></td>
<td>log(n)</td>
<td>log(n)</td>
<td>log(n)</td>
<td>log(n)</td>
<td></td>
</tr>
<tr>
<td><strong>Red-Black Tree</strong></td>
<td>log(n)</td>
<td>log(n)</td>
<td>log(n)</td>
<td>log(n)</td>
<td></td>
</tr>
<tr>
<td><strong>AVL Tree</strong></td>
<td>log(n)</td>
<td>log(n)</td>
<td>log(n)</td>
<td>log(n)</td>
<td></td>
</tr>
<tr>
<td><strong>Bloom Filter</strong></td>
<td>-</td>
<td>1</td>
<td>1</td>
<td>-</td>
<td>False positives are possible while searching</td>
</tr>
</tbody>
</table>

### Sorting Complexity
<table>
<thead>
<tr>
<th>Name</th>
<th>Best</th>
<th>Average</th>
<th>Worst</th>
<th>Memory</th>
<th>Stable</th>
<th>Comments</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Bubble sort</strong></td>
<td>n</td>
<td>n<sup>2</sup></td>
<td>n<sup>2</sup></td>
<td>1</td>
<td>Yes</td>
<td></td>
</tr>
<tr>
<td><strong>Insertion sort</strong></td>
<td>n</td>
<td>n<sup>2</sup></td>
<td>n<sup>2</sup></td>
<td>1</td>
<td>Yes</td>
<td></td>
</tr>
<tr>
<td><strong>Selection sort</strong></td>
<td>n<sup>2</sup></td>
<td>n<sup>2</sup></td>
<td>n<sup>2</sup></td>
<td>1</td>
<td>No</td>
<td></td>
</tr>
<tr>
<td><strong>Heap sort</strong></td>
<td>n&nbsp;log(n)</td>
<td>n&nbsp;log(n)</td>
<td>n&nbsp;log(n)</td>
<td>1</td>
<td>No</td>
<td></td>
</tr>
<tr>
<td><strong>Merge sort</strong></td>
<td>n&nbsp;log(n)</td>
<td>n&nbsp;log(n)</td>
<td>n&nbsp;log(n)</td>
<td>n</td>
<td>Yes</td>
<td></td>
</tr>
<tr>
<td><strong>Quick sort</strong></td>
<td>n&nbsp;log(n)</td>
<td>n&nbsp;log(n)</td>
<td>n<sup>2</sup></td>
<td>log(n)</td>
<td>No</td>
<td>Quicksort is usually done in-place with O(log(n)) stack space</td>
</tr>
<tr>
<td><strong>Shell sort</strong></td>
<td>n&nbsp;log(n)</td>
<td>depends on gap sequence</td>
<td>n&nbsp;(log(n))<sup>2</sup></td>
<td>1</td>
<td>No</td>
<td></td>
</tr>
<tr>
<td><strong>Counting sort</strong></td>
<td>n + r</td>
<td>n + r</td>
<td>n + r</td>
<td>n + r</td>
<td>Yes</td>
<td>r - biggest number in array</td>
</tr>
<tr>
<td><strong>Radix sort</strong></td>
<td>n * k</td>
<td>n * k</td>
<td>n * k</td>
<td>n + k</td>
<td>Yes</td>
<td>k - length of longest key</td>
</tr>
</tbody>
</table>

![complexities](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/assets/complexities-diff.jpg?raw=true)

![complexities of data structures](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/assets/data-structure-complexities.jpg?raw=true)
