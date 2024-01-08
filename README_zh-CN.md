# data-structure-typed

![npm](https://img.shields.io/npm/v/data-structure-typed)
![npm](https://img.shields.io/npm/dm/data-structure-typed)
![npm package minimized gzipped size (select exports)](https://img.shields.io/bundlejs/size/data-structure-typed)
![GitHub top language](https://img.shields.io/github/languages/top/zrwusa/data-structure-typed)
![GITHUB Star](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
![eslint](https://aleen42.github.io/badges/src/eslint.svg)
![NPM](https://img.shields.io/npm/l/data-structure-typed)

[//]: # (![npm bundle size]&#40;https://img.shields.io/bundlephobia/min/data-structure-typed&#41;)

<p><a href="https://github.com/zrwusa/data-structure-typed/blob/main/README.md">English</a> | <a href="https://github.com/zrwusa/data-structure-typed/blob/main/README_zh-CN.md">简体中文</a></p>

## 为什么

JavaScript和TypeScript的数据结构。

是否羡慕C++ [STL]() (std::)、Python的 [collections]() 和Java的 [java.util]()？

不再需要羡慕了！JavaScript和TypeScript现在拥有 [data-structure-typed]()。

**`基准测试`** 与C++ STL相比。**`API 标准`** 与ES6和Java对齐。**`易用性`**  可与Python媲美。


### 提供了JS/TS中没有的数据结构

Heap, Binary Tree, RedBlack Tree, Linked List, Deque, Trie, Directed Graph, Undirected Graph, BST, AVL Tree, Priority Queue, Queue, Tree Multiset.


### 性能超越原生JS/TS


<table style="display: table; width:100%; table-layout: fixed;">
  <thead>
  <tr>
    <th>方法名</th>
    <th>耗时（毫秒）</th>
    <th>数据规模</th>
    <th>所属标准库</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>Queue.push &amp; shift</td>
    <td>5.83</td>
    <td>100,000</td>
    <td>data-structure-typed</td>
  </tr>
  <tr>
    <td>Array.push &amp; shift</td>
    <td>2829.59</td>
    <td>100,000</td>
    <td>原生JS</td>
  </tr>
  <tr>
    <td>Deque.unshift &amp; shift</td>
    <td>2.44</td>
    <td>100,000</td>
    <td>data-structure-typed</td>
  </tr>
  <tr>
    <td>Array.unshift &amp; shift</td>
    <td>4750.37</td>
    <td>100,000</td>
    <td>原生JS</td>
  </tr>
  <tr>
    <td>HashMap.set</td>
    <td>122.51</td>
    <td>1,000,000</td>
    <td>data-structure-typed</td>
  </tr>
  <tr>
    <td>Map.set</td>
    <td>223.80</td>
    <td>1,000,000</td>
    <td>原生JS</td>
  </tr>
  <tr>
    <td>Set.add</td>
    <td>185.06</td>
    <td>1,000,000</td>
    <td>原生JS</td>
  </tr>
  </tbody>
</table>

[//]: # (![Branches]&#40;https://img.shields.io/badge/branches-55.47%25-red.svg?style=flat&#41;)

[//]: # (![Statements]&#40;https://img.shields.io/badge/statements-67%25-red.svg?style=flat&#41;)

[//]: # (![Functions]&#40;https://img.shields.io/badge/functions-66.38%25-red.svg?style=flat&#41;)

[//]: # (![Lines]&#40;https://img.shields.io/badge/lines-68.6%25-red.svg?style=flat&#41;)

## 安装和使用

现在你可以在 Node.js 和浏览器环境中使用它

CommonJS：**`require export.modules =`**

ESModule：&nbsp;&nbsp;&nbsp;**`import export`**

Typescript：&nbsp;&nbsp;&nbsp;**`import export`**

UMD：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**`var Deque = dataStructureTyped.Deque`**

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
  AVLTree, MinHeap, SinglyLinkedList, DirectedGraph, TreeMultiMap,
  DirectedVertex, AVLTreeNode
} from 'data-structure-typed';
```

### CDN

将下面的代码复制到 HTML 文档的头标签中。

#### 开发环境

```html
<script src='https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.js'></script>
```

#### 生产环境

```html
<script src='https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js'></script>
```

将下面的代码复制到你的 HTML 的 script 标签中，你就可以开始你的开发了。

```js
const {Heap} = dataStructureTyped;
const {
  BinaryTree, Graph, Queue, Stack, PriorityQueue, BST, Trie, DoublyLinkedList,
  AVLTree, MinHeap, SinglyLinkedList, DirectedGraph, TreeMultiMap,
  DirectedVertex, AVLTreeNode
} = dataStructureTyped;
```

## 生动示例

### Binary Tree（二叉树）

[试一下](https://vivid-algorithm.vercel.app/)，或者你可以使用我们的可视化工具运行自己的代码 [visual tool](https://github.com/zrwusa/vivid-algorithm)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/binary-tree-array-to-binary-tree.webp)

### Binary Tree DFS （二叉搜索树深度遍历）

[试一下](https://vivid-algorithm.vercel.app/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/binary-tree-dfs-in-order.webp)

### AVL Tree（AVL树）

[试一下](https://vivid-algorithm.vercel.app/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/avl-tree-test.webp)

### Tree Multi Map

[试一下](https://vivid-algorithm.vercel.app/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/tree-multiset-test.webp)

### Matrix

[试一下](https://vivid-algorithm.vercel.app/algorithm/graph/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/matrix-cut-off-tree-for-golf.webp)

### 有向图

[试一下](https://vivid-algorithm.vercel.app/algorithm/graph/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/directed-graph-test.webp)

### 地图

[试一下](https://vivid-algorithm.vercel.app/algorithm/graph/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/map-graph-test.webp)

## 代码片段

### 红黑树 代码示例

#### TS
```ts
import {RedBlackTree} from 'data-structure-typed';

const rbTree = new RedBlackTree<number>();
rbTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
rbTree.isAVLBalanced();    // true
rbTree.delete(10);
rbTree.isAVLBalanced();    // true
rbTree.print()
//         ___6________
//        /            \
//      ___4_       ___11________
//     /     \     /             \
//    _2_    5    _8_       ____14__
//   /   \       /   \     /        \
//   1   3       7   9    12__     15__
//                            \        \
//                           13       16
```

#### JS
```js
import {RedBlackTree} from 'data-structure-typed';

const rbTree = new RedBlackTree();
rbTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
rbTree.isAVLBalanced();    // true
rbTree.delete(10);
rbTree.isAVLBalanced();    // true
rbTree.print()
//         ___6________
//        /            \
//      ___4_       ___11________
//     /     \     /             \
//    _2_    5    _8_       ____14__
//   /   \       /   \     /        \
//   1   3       7   9    12__     15__
//                            \        \
//                           13       16
```

### 二叉搜索树 (BST) 代码示例

```ts
import {BST, BSTNode} from 'data-structure-typed';

const bst = new BST<number>();
bst.add(11);
bst.add(3);
bst.addMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);
bst.size === 16;                // true
bst.has(6);                     // true
const node6 = bst.getNode(6);   // BSTNode
bst.getHeight(6) === 2;         // true
bst.getHeight() === 5;          // true
bst.getDepth(6) === 3;          // true

bst.getLeftMost()?.key === 1;   // true

bst.delete(6);
bst.get(6);                     // undefined
bst.isAVLBalanced();            // true
bst.bfs()[0] === 11;            // true
bst.print()
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

const objBST = new BST<number, {height: number, age: number}>();

objBST.add(11, { "name": "Pablo", "age": 15 });
objBST.add(3, { "name": "Kirk", "age": 1 });

objBST.addMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5], [
    { "name": "Alice", "age": 15 },
    { "name": "Bob", "age": 1 },
    { "name": "Charlie", "age": 8 },
    { "name": "David", "age": 13 },
    { "name": "Emma", "age": 16 },
    { "name": "Frank", "age": 2 },
    { "name": "Grace", "age": 6 },
    { "name": "Hannah", "age": 9 },
    { "name": "Isaac", "age": 12 },
    { "name": "Jack", "age": 14 },
    { "name": "Katie", "age": 4 },
    { "name": "Liam", "age": 7 },
    { "name": "Mia", "age": 10 },
    { "name": "Noah", "age": 5 }
  ]
);

objBST.delete(11);
```

### AVL树 代码示例

```ts
import {AVLTree} from 'data-structure-typed';

const avlTree = new AVLTree<number>();
avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
avlTree.isAVLBalanced();    // true
avlTree.delete(10);
avlTree.isAVLBalanced();    // true
```

### 有向图代码示例

```ts
import {DirectedGraph} from 'data-structure-typed';

const graph = new DirectedGraph<string>();

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

const topologicalOrderKeys = graph.topologicalSort(); // ['A', 'B', 'C']
```

### 无向图代码示例

```ts
import {UndirectedGraph} from 'data-structure-typed';

const graph = new UndirectedGraph<string>();
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.deleteVertex('C');
graph.addEdge('A', 'B');
graph.addEdge('B', 'D');

const dijkstraResult = graph.dijkstra('A');
Array.from(dijkstraResult?.seen ?? []).map(vertex => vertex.key) // ['A', 'B', 'D']


```

### 不同数据结构之间互相转换

```js
const orgArr = [6, 1, 2, 7, 5, 3, 4, 9, 8];
const orgStrArr = ["trie", "trial", "trick", "trip", "tree", "trend", "triangle", "track", "trace", "transmit"];
const entries = [[6, 6], [1, 1], [2, 2], [7, 7], [5, 5], [3, 3], [4, 4], [9, 9], [8, 8]];

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

const treeMulti = new TreeMultiMap(entries);
treeMulti.print();
//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9

const hm = new HashMap(entries);
hm.print()    
// [[6, 6], [1, 1], [2, 2], [7, 7], [5, 5], [3, 3], [4, 4], [9, 9], [8, 8]]

const rbTreeH = new RedBlackTree(hm);
rbTreeH.print();
//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9

const pq = new MinPriorityQueue(orgArr);
pq.print();   
// [1, 5, 2, 7, 6, 3, 4, 9, 8]

const bst1 = new BST(pq);
bst1.print();
//     _____5___
//    /         \
//   _2_       _7_
//  /   \     /   \
//  1   3_    6   8_
//        \         \
//        4         9

const dq1 = new Deque(orgArr);
dq1.print();    
// [6, 1, 2, 7, 5, 3, 4, 9, 8]
const rbTree1 = new RedBlackTree(dq1);
rbTree1.print();
//    _____5___
//   /         \
//  _2___     _7___
// /     \   /     \
// 1    _4   6    _9
//      /         /
//      3         8


const trie2 = new Trie(orgStrArr);
trie2.print();    
// ['trie', 'trial', 'triangle', 'trick', 'trip', 'tree', 'trend', 'track', 'trace', 'transmit']
const heap2 = new Heap(trie2, { comparator: (a, b) => Number(a) - Number(b) });
heap2.print();    
// ['transmit', 'trace', 'tree', 'trend', 'track', 'trial', 'trip', 'trie', 'trick', 'triangle']
const dq2 = new Deque(heap2);
dq2.print();      
// ['transmit', 'trace', 'tree', 'trend', 'track', 'trial', 'trip', 'trie', 'trick', 'triangle']
const entries2 = dq2.map((el, i) => [i, el]);
const avl2 = new AVLTree(entries2);
avl2.print();
//     ___3_______
//    /           \
//   _1_       ___7_
//  /   \     /     \
//  0   2    _5_    8_
//          /   \     \
//          4   6     9
```

## API 文档 & 演示

[API 文档](https://data-structure-typed-docs.vercel.app)

[在线演示](https://vivid-algorithm.vercel.app)

<a href="https://github.com/zrwusa/vivid-algorithm" target="_blank">演示项目代码仓库</a>

## 包含的数据结构

<table style="display: table; width:100%; table-layout: fixed;">
<thead>
<tr>
<th>Data Structure</th>
<th>Unit Test</th>
<th>Performance Test</th>
<th>API Docs</th>
</tr>
</thead>
<tbody>
<tr>
<td>Binary Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryTree.html"><span>View</span></a></td>
</tr>
<tr>
<td>Binary Search Tree (BST)</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BST.html"><span>View</span></a></td>
</tr>
<tr>
<td>AVL Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/AVLTree.html"><span>View</span></a></td>
</tr>
<tr>
<td>Red Black Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/RedBlackTree.html"><span>View</span></a></td>
</tr>
<tr>
<td>Tree Multimap</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/TreeMultiMap.html"><span>View</span></a></td>
</tr>
<tr>
<td>Heap</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Heap.html"><span>View</span></a></td>
</tr>
<tr>
<td>Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/PriorityQueue.html"><span>View</span></a></td>
</tr>
<tr>
<td>Max Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/MaxPriorityQueue.html"><span>View</span></a></td>
</tr>
<tr>
<td>Min Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/MinPriorityQueue.html"><span>View</span></a></td>
</tr>
<tr>
<td>Trie</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Trie.html"><span>View</span></a></td>
</tr>
<tr>
<td>Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/AbstractGraph.html"><span>View</span></a></td>
</tr>
<tr>
<td>Directed Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/DirectedGraph.html"><span>View</span></a></td>
</tr>
<tr>
<td>Undirected Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/UndirectedGraph.html"><span>View</span></a></td>
</tr>
<tr>
<td>Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Queue.html"><span>View</span></a></td>
</tr>
<tr>
<td>Deque</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Deque.html"><span>View</span></a></td>
</tr>
<tr>
<td>Hash Map</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/HashMap.html"><span>View</span></a></td>
</tr>
<tr>
<td>Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html"><span>View</span></a></td>
</tr>
<tr>
<td>Singly Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html"><span>View</span></a></td>
</tr>
<tr>
<td>Doubly Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/DoublyLinkedList.html"><span>View</span></a></td>
</tr>
<tr>
<td>Stack</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Stack.html"><span>View</span></a></td>
</tr>
<tr>
<td>Segment Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SegmentTree.html"><span>View</span></a></td>
</tr>
<tr>
<td>Binary Indexed Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryIndexedTree.html"><span>View</span></a></td>
</tr>
</tbody>
</table>

## 不同编程语言中的数据结构对应关系

<table style="display: table; width:100%; table-layout: fixed;">
  <thead>
  <tr>
    <th>Data Structure Typed</th>
    <th>C++ STL</th>
    <th>java.util</th>
    <th>Python collections</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>Heap&lt;E&gt;</td>
    <td>priority_queue&lt;T&gt;</td>
    <td>PriorityQueue&lt;E&gt;</td>
    <td>heapq</td>
  </tr>
  <tr>
    <td>Deque&lt;E&gt;</td>
    <td>deque&lt;T&gt;</td>
    <td>ArrayDeque&lt;E&gt;</td>
    <td>deque</td>
  </tr>
  <tr>
    <td>Queue&lt;E&gt;</td>
    <td>queue&lt;T&gt;</td>
    <td>Queue&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>HashMap&lt;K, V&gt;</td>
    <td>unordered_map&lt;K, V&gt;</td>
    <td>HashMap&lt;K, V&gt;</td>
    <td>defaultdict</td>
  </tr>
  <tr>
    <td>DoublyLinkedList&lt;E&gt;</td>
    <td>list&lt;T&gt;</td>
    <td>LinkedList&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>SinglyLinkedList&lt;E&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>BinaryTree&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>BST&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>RedBlackTree&lt;E&gt;</td>
    <td>set&lt;T&gt;</td>
    <td>TreeSet&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>RedBlackTree&lt;K, V&gt;</td>
    <td>map&lt;K, V&gt;</td>
    <td>TreeMap&lt;K, V&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>TreeMultiMap&lt;K, V&gt;</td>
    <td>multimap&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>TreeMultiMap&lt;E&gt;</td>
    <td>multiset&lt;T&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Trie</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>DirectedGraph&lt;V, E&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>UndirectedGraph&lt;V, E&gt;</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>PriorityQueue&lt;E&gt;</td>
    <td>priority_queue&lt;T&gt;</td>
    <td>PriorityQueue&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>Array&lt;E&gt;</td>
    <td>vector&lt;T&gt;</td>
    <td>ArrayList&lt;E&gt;</td>
    <td>list</td>
  </tr>
  <tr>
    <td>Stack&lt;E&gt;</td>
    <td>stack&lt;T&gt;</td>
    <td>Stack&lt;E&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>HashMap&lt;E&gt;</td>
    <td>unordered_set&lt;T&gt;</td>
    <td>HashSet&lt;E&gt;</td>
    <td>set</td>
  </tr>
  <tr>
    <td>-</td>
    <td>unordered_multiset</td>
    <td>-</td>
    <td>Counter</td>
  </tr>
  <tr>
    <td>LinkedHashMap&lt;K, V&gt;</td>
    <td>-</td>
    <td>LinkedHashMap&lt;K, V&gt;</td>
    <td>OrderedDict</td>
  </tr>
  <tr>
    <td>-</td>
    <td>unordered_multimap&lt;K, V&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>-</td>
    <td>bitset&lt;N&gt;</td>
    <td>-</td>
    <td>-</td>
  </tr>
  </tbody>
</table>

## 内建的经典算法

<table style="display: table; width:100%; table-layout: fixed;">
  <thead>
  <tr>
    <th>算法</th>
    <th>功能描述</th>
    <th>迭代类型</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>二叉树深度优先搜索(DFS)</td>
    <td>以深度优先的方式遍历二叉树，从根节点开始，首先访问左子树，然后是右子树，使用递归。</td>
    <td>递归 + 迭代</td>
  </tr>
  <tr>
    <td>二叉树广度优先搜索(BFS)</td>
    <td>以广度优先的方式遍历二叉树，从根节点开始，逐层从左到右访问节点。</td>
    <td>迭代</td>
  </tr>
  <tr>
    <td>图的深度优先搜索</td>
    <td>以深度优先的方式遍历图，从给定节点开始，尽可能深地沿一条路径探索，然后回溯以探索其他路径。用于寻找连通分量、路径等。</td>
    <td>递归 + 迭代</td>
  </tr>
  <tr>
    <td>二叉树Morris遍历</td>
    <td>Morris遍历是一种中序遍历二叉树的算法，空间复杂度为O(1)。它允许在没有额外栈或递归的情况下遍历树。</td>
    <td>迭代</td>
  </tr>
  <tr>
    <td>图的广度优先搜索</td>
    <td>以广度优先的方式遍历图，从给定节点开始，首先访问与起始节点直接相连的节点，然后逐层扩展。用于寻找最短路径等。</td>
    <td>递归 + 迭代</td>
  </tr>
  <tr>
    <td>图的Tarjan算法</td>
    <td>在图中找到强连通分量，通常使用深度优先搜索实现。</td>
    <td>递归</td>
  </tr>
  <tr>
    <td>图的Bellman-Ford算法</td>
    <td>从单一源点找到最短路径，可以处理负权边</td>
    <td>迭代</td>
  </tr>
  <tr>
    <td>图的Dijkstra算法</td>
    <td>从单一源点找到最短路径，不能处理负权边</td>
    <td>迭代</td>
  </tr>
  <tr>
    <td>图的Floyd-Warshall算法</td>
    <td>找到所有节点对之间的最短路径</td>
    <td>迭代</td>
  </tr>
  <tr>
    <td>图的getCycles</td>
    <td>在图中找到所有循环或检测循环的存在。</td>
    <td>递归</td>
  </tr>
  <tr>
    <td>图的getCutVertices</td>
    <td>在图中找到切点，这些是移除后会增加图中连通分量数量的节点。</td>
    <td>递归</td>
  </tr>
  <tr>
    <td>图的getSCCs</td>
    <td>在图中找到强连通分量，这些是任意两个节点都可以相互到达的子图。</td>
    <td>递归</td>
  </tr>
  <tr>
    <td>图的getBridges</td>
    <td>在图中找到桥，这些是移除后会增加图中连通分量数量的边。</td>
    <td>递归</td>
  </tr>
  <tr>
    <td>图的拓扑排序</td>
    <td>对有向无环图(DAG)进行拓扑排序，以找到节点的线性顺序，使得所有有向边都从较早的节点指向较晚的节点。</td>
    <td>递归</td>
  </tr>
  </tbody>
</table>

## 软件工程标准

严格尊重计算机科学理论和软件开发规范，我们的LinkedList就是传统意义的LinkedList数据结构，而不是用Deque去代替以便标榜性能测试数据。当然我们也同时实现了基于动态数组的Deque。

<table style="display: table; width:100%; table-layout: fixed;">
    <tr>
        <th>原则</th>
        <th>描述</th>
    </tr>
    <tr>
        <td>实用性</td>
        <td>遵循ES6和ESNext标准，提供统一且考虑周到的可选参数，简化方法名称。</td>
    </tr>
    <tr>
        <td>可扩展性</td>
        <td>遵循OOP（面向对象编程）原则，允许所有数据结构继承。</td>
    </tr>
    <tr>
        <td>模块化</td>
        <td>包括数据结构模块化和独立的NPM包。</td>
    </tr>
    <tr>
        <td>效率</td>
        <td>所有方法都提供时间和空间复杂度，可与原生JS性能相媲美。</td>
    </tr>
    <tr>
        <td>可维护性</td>
        <td>遵循开源社区开发标准，完整文档，持续集成，并遵循TDD（测试驱动开发）模式。</td>
    </tr>
    <tr>
        <td>可测试性</td>
        <td>自动化和定制单元测试、性能测试和集成测试。</td>
    </tr>
    <tr>
        <td>可移植性</td>
        <td>计划移植到Java、Python和C++，目前已完成80%。</td>
    </tr>
    <tr>
        <td>可复用性</td>
        <td>完全解耦，最小化副作用，遵循OOP。</td>
    </tr>
    <tr>
        <td>安全性</td>
        <td>精心设计的成员变量和方法的安全性。读写分离。数据结构软件不需要考虑其他安全方面。</td>
    </tr>
    <tr>
        <td>可扩展性</td>
        <td>数据结构软件不涉及负载问题。</td>
    </tr>
</table>

## 基准测试

[//]: # (No deletion!!! Start of Replace Section)
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>10,000 add randomly</td><td>72.48</td><td>13.80</td><td>0.03</td></tr><tr><td>10,000 add & delete randomly</td><td>144.14</td><td>6.94</td><td>0.03</td></tr><tr><td>10,000 addMany</td><td>69.71</td><td>14.35</td><td>0.02</td></tr><tr><td>10,000 get</td><td>54.21</td><td>18.45</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>binary-tree</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>1,000 add randomly</td><td>15.84</td><td>63.14</td><td>0.00</td></tr><tr><td>1,000 add & delete randomly</td><td>24.62</td><td>40.62</td><td>0.00</td></tr><tr><td>1,000 addMany</td><td>17.85</td><td>56.01</td><td>0.00</td></tr><tr><td>1,000 get</td><td>20.83</td><td>48.00</td><td>0.00</td></tr><tr><td>1,000 has</td><td>20.78</td><td>48.13</td><td>0.00</td></tr><tr><td>1,000 dfs</td><td>186.06</td><td>5.37</td><td>0.02</td></tr><tr><td>1,000 bfs</td><td>66.58</td><td>15.02</td><td>0.02</td></tr><tr><td>1,000 morris</td><td>298.23</td><td>3.35</td><td>0.02</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>bst</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>10,000 add randomly</td><td>55.04</td><td>18.17</td><td>0.01</td></tr><tr><td>10,000 add & delete randomly</td><td>129.85</td><td>7.70</td><td>0.01</td></tr><tr><td>10,000 addMany</td><td>50.40</td><td>19.84</td><td>0.01</td></tr><tr><td>10,000 get</td><td>63.39</td><td>15.78</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>rb-tree</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>100,000 add</td><td>113.25</td><td>8.83</td><td>0.02</td></tr><tr><td>100,000 add & delete randomly</td><td>305.28</td><td>3.28</td><td>0.03</td></tr><tr><td>100,000 getNode</td><td>73.20</td><td>13.66</td><td>0.03</td></tr><tr><td>100,000 add & iterator</td><td>159.80</td><td>6.26</td><td>0.06</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>comparison</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>SRC PQ 10,000 add</td><td>0.17</td><td>5872.02</td><td>4.08e-5</td></tr><tr><td>CJS PQ 10,000 add</td><td>0.20</td><td>4961.22</td><td>1.14e-4</td></tr><tr><td>MJS PQ 10,000 add</td><td>0.74</td><td>1351.47</td><td>2.98e-4</td></tr><tr><td>SRC PQ 10,000 add & pop</td><td>4.62</td><td>216.49</td><td>0.00</td></tr><tr><td>CJS PQ 10,000 add & pop</td><td>4.36</td><td>229.40</td><td>0.00</td></tr><tr><td>MJS PQ 10,000 add & pop</td><td>3.92</td><td>255.23</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>directed-graph</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>1,000 addVertex</td><td>0.12</td><td>8557.70</td><td>2.46e-5</td></tr><tr><td>1,000 addEdge</td><td>7.37</td><td>135.70</td><td>0.00</td></tr><tr><td>1,000 getVertex</td><td>0.05</td><td>1.91e+4</td><td>1.12e-5</td></tr><tr><td>1,000 getEdge</td><td>22.75</td><td>43.96</td><td>0.00</td></tr><tr><td>tarjan</td><td>196.98</td><td>5.08</td><td>0.01</td></tr><tr><td>tarjan all</td><td>217.25</td><td>4.60</td><td>0.03</td></tr><tr><td>topologicalSort</td><td>177.30</td><td>5.64</td><td>0.02</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>hash-map</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>1,000,000 set</td><td>153.74</td><td>6.50</td><td>0.07</td></tr><tr><td>1,000,000 Map set</td><td>330.02</td><td>3.03</td><td>0.16</td></tr><tr><td>1,000,000 Set add</td><td>258.64</td><td>3.87</td><td>0.06</td></tr><tr><td>1,000,000 set & get</td><td>138.80</td><td>7.20</td><td>0.06</td></tr><tr><td>1,000,000 Map set & get</td><td>352.63</td><td>2.84</td><td>0.05</td></tr><tr><td>1,000,000 Set add & has</td><td>217.97</td><td>4.59</td><td>0.02</td></tr><tr><td>1,000,000 ObjKey set & get</td><td>414.87</td><td>2.41</td><td>0.06</td></tr><tr><td>1,000,000 Map ObjKey set & get</td><td>389.17</td><td>2.57</td><td>0.07</td></tr><tr><td>1,000,000 Set ObjKey add & has</td><td>352.67</td><td>2.84</td><td>0.03</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>100,000 add & pop</td><td>90.67</td><td>11.03</td><td>0.02</td></tr><tr><td>100,000 add & dfs</td><td>40.30</td><td>24.81</td><td>0.01</td></tr><tr><td>10,000 fib add & pop</td><td>414.94</td><td>2.41</td><td>0.02</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>1,000,000 push</td><td>290.62</td><td>3.44</td><td>0.10</td></tr><tr><td>1,000,000 unshift</td><td>253.88</td><td>3.94</td><td>0.10</td></tr><tr><td>1,000,000 unshift & shift</td><td>259.65</td><td>3.85</td><td>0.14</td></tr><tr><td>1,000,000 addBefore</td><td>463.16</td><td>2.16</td><td>0.10</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>singly-linked-list</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>1,000,000 push & shift</td><td>250.27</td><td>4.00</td><td>0.08</td></tr><tr><td>10,000 push & pop</td><td>261.13</td><td>3.83</td><td>0.03</td></tr><tr><td>10,000 addBefore</td><td>282.46</td><td>3.54</td><td>0.02</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>max-priority-queue</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>10,000 refill & poll</td><td>10.49</td><td>95.29</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>priority-queue</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>100,000 add & pop</td><td>110.63</td><td>9.04</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>1,000,000 push</td><td>15.89</td><td>62.92</td><td>0.00</td></tr><tr><td>1,000,000 push & pop</td><td>26.45</td><td>37.81</td><td>0.01</td></tr><tr><td>1,000,000 push & shift</td><td>27.52</td><td>36.34</td><td>0.00</td></tr><tr><td>1,000,000 unshift & shift</td><td>28.82</td><td>34.70</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>1,000,000 push</td><td>51.21</td><td>19.53</td><td>0.02</td></tr><tr><td>1,000,000 push & shift</td><td>105.56</td><td>9.47</td><td>0.05</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>stack</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>1,000,000 push</td><td>43.57</td><td>22.95</td><td>0.01</td></tr><tr><td>1,000,000 push & pop</td><td>55.18</td><td>18.12</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>executions per sec</th><th>sample deviation</th></tr><tr><td>100,000 push</td><td>54.08</td><td>18.49</td><td>0.01</td></tr><tr><td>100,000 getWords</td><td>77.77</td><td>12.86</td><td>0.02</td></tr></table></div>
    </div>

[//]: # (No deletion!!! End of Replace Section)




