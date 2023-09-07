# What

## Brief
Javascript & TypeScript Data Structure collections. 

## Algorithms 

DFS, DFSIterative, BFS, morris, Bellman-Ford Algorithm, Dijkstra's Algorithm, Floyd-Warshall Algorithm, Tarjan's Algorithm. Listed only a few out, you can discover more in API docs

## Code design
By strictly adhering to object-oriented design (BinaryTree -> BST -> AVLTree -> TreeMultiset), you can seamlessly inherit the existing data structures to implement the customized ones you need. Object-oriented design stands as the optimal approach to data structure design.

# How
### npm
```bash
npm install data-structure-typed
```
## install
### yarn
```bash
yarn add data-structure-typed
```



### Binary Search Tree (BST) snippet

#### TS
```typescript
    import {BST, BSTNode} from 'data-structure-typed';

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
    bfsIDs[0] === 11;   // true
    expect(bfsIDs[0]).toBe(11);
    
    const objBST = new BST<BSTNode<{ id: number, keyA: number }>>();
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
#### JS
```javascript
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
    bfsIDs[0] === 11;   // true
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

### Directed Graph simple snippet

#### TS or JS
```typescript
import {DirectedGraph} from 'data-structure-typed';

    const graph = new DirectedGraph();
    
    graph.addVertex('A');
    graph.addVertex('B');
    
    graph.hasVertex('A');       // true
    graph.hasVertex('B');       // true
    graph.hasVertex('C');       // false
    
    graph.addEdge('A', 'B');
    graph.hasEdge('A', 'B'); // true
    graph.hasEdge('B', 'A'); // false
    
    graph.removeEdgeSrcToDest('A', 'B');
    graph.hasEdge('A', 'B');    // false
    
    graph.addVertex('C');
    
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    
    const topologicalOrderIds = graph.topologicalSort(); // ['A', 'B', 'C']
```

### Undirected Graph snippet

#### TS or JS
```typescript
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
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt="">
</img></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt="">
</img></td>
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


![](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/examples/dfs-pre-order.webp?raw=true)

![](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/examples/map-graph.webp?raw=true)

![](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/examples/test-graphs.webp?raw=true)

![](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/examples/cut-off-trees-for-golf.webp?raw=true)

![](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/examples/parenthesis-check.webp?raw=true)


## API docs & Examples

[API Docs](https://data-structure-typed-docs.vercel.app)

[Live Examples](https://data-structure-typed-examples.vercel.app)

<a href="https://data-structure-typed-examples.vercel.app" target="_blank">Live Examples</a>

[//]: # ([Examples Repository]&#40;https://github.com/zrwusa/data-structure-typed-examples&#41;)

<a href="https://github.com/zrwusa/data-structure-typed-examples" target="_blank">Examples Repository</a>


# Why

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

![overview diagram](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/assets/overview-diagram-of-data-structures.png)

![complexities](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/assets/complexities-diff.jpg)

![complexities of data structures](https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/assets/data-structure-complexities.jpg)

[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/binary-tree/bst-rotation.gif&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/binary-tree/avl-tree-inserting.gif&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/tarjan.webp&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/adjacency-list.jpg&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/adjacency-list-pros-cons.jpg&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/adjacency-matrix.jpg&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/adjacency-matrix-pros-cons.jpg&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/dfs-can-do.jpg&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/edge-list.jpg&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/edge-list-pros-cons.jpg&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/max-flow.jpg&#41;)

[//]: # ()
[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/mst.jpg&#41;)

[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/tarjan-articulation-point-bridge.png&#41;)

[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/tarjan-complicate-simple.png&#41;)

[//]: # (![]&#40;https://github.com/zrwusa/assets/blob/master/images/data-structure-typed/graph/tarjan-strongly-connected-component.png&#41;)





