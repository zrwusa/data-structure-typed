# data-structure-typed

![npm](https://img.shields.io/npm/dm/data-structure-typed)
![GitHub contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed)
![npm package minimized gzipped size (select exports)](https://img.shields.io/bundlejs/size/data-structure-typed)
![GitHub top language](https://img.shields.io/github/languages/top/zrwusa/data-structure-typed)
![GITHUB Star](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
![eslint](https://aleen42.github.io/badges/src/eslint.svg)
![NPM](https://img.shields.io/npm/l/data-structure-typed)
![npm](https://img.shields.io/npm/v/data-structure-typed)

[//]: # (![npm bundle size]&#40;https://img.shields.io/bundlephobia/min/data-structure-typed&#41;)

[//]: # (<p><a href="https://github.com/zrwusa/data-structure-typed/blob/main/README.md">English</a> | <a href="https://github.com/zrwusa/data-structure-typed/blob/main/README_zh-CN.md">简体中文</a></p>)


> ***Our goal is to make every data structure as convenient and efficient as JavaScript's Array.***

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
  Heap, Graph, Queue, Deque, PriorityQueue, BST, Trie, DoublyLinkedList,
  AVLTree, SinglyLinkedList, DirectedGraph, RedBlackTree, TreeMultiMap,
  DirectedVertex, Stack, AVLTreeNode
} from 'data-structure-typed';
```

If you only want to use a specific data structure independently, you can install it separately, for example, by running

```bash
npm i heap-typed --save
```

## Why

Do you envy C++ with [STL]() (std::), Python with [collections](), and Java with [java.util]() ? Well, no need to envy
anymore! JavaScript and TypeScript now have [data-structure-typed]().**`Benchmark`** compared with C++ STL. 
**`API standards`** aligned with ES6 and Java. **`Usability`** is comparable to Python


[//]: # (![Branches]&#40;https://img.shields.io/badge/branches-55.47%25-red.svg?style=flat&#41;)

[//]: # (![Statements]&#40;https://img.shields.io/badge/statements-67%25-red.svg?style=flat&#41;)

[//]: # (![Functions]&#40;https://img.shields.io/badge/functions-66.38%25-red.svg?style=flat&#41;)

[//]: # (![Lines]&#40;https://img.shields.io/badge/lines-68.6%25-red.svg?style=flat&#41;)

### Performance

Performance surpasses that of native JS/TS

<table style="display: table; width:100%; table-layout: fixed;">
  <thead>
  <tr>
    <th>Method</th>
    <th>Time Taken</th>
    <th>Data Scale</th>
    <th>Belongs To</th>
    <th>big O</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>Queue.push &amp; shift</td>
    <td>5.83 ms</td>
    <td>100K</td>
    <td>Ours</td>
    <td>O(1)</td>
  </tr>
  <tr>
    <td>Array.push &amp; shift</td>
    <td>2829.59 ms</td>
    <td>100K</td>
    <td>Native JS</td>
    <td>O(n)</td>
  </tr>
  <tr>
    <td>Deque.unshift &amp; shift</td>
    <td>2.44 ms</td>
    <td>100K</td>
    <td>Ours</td>
    <td>O(1)</td>
  </tr>
  <tr>
    <td>Array.unshift &amp; shift</td>
    <td>4750.37 ms</td>
    <td>100K</td>
    <td>Native JS</td>
    <td>O(n)</td>
  </tr>
  <tr>
    <td>HashMap.set</td>
    <td>122.51 ms</td>
    <td>1M</td>
    <td>Ours</td>
    <td>O(1)</td>
  </tr>
  <tr>
    <td>Map.set</td>
    <td>223.80 ms</td>
    <td>1M</td>
    <td>Native JS</td>
    <td>O(1)</td>
  </tr>
  <tr>
    <td>Set.add</td>
    <td>185.06 ms</td>
    <td>1M</td>
    <td>Native JS</td>
    <td>O(1)</td>
  </tr>
  </tbody>
</table>

### Plain language explanations

<table>
  <tr>
    <th>Data Structure</th>
    <th>Plain Language Definition</th>
    <th>Diagram</th>
  </tr>
  <tr>
    <td>Linked List (Singly Linked List)</td>
    <td>A line of bunnies, where each bunny holds the tail of the bunny in front of it (each bunny only knows the name of the bunny behind it). You want to find a bunny named Pablo, and you have to start searching from the first bunny. If it's not Pablo, you continue following that bunny's tail to the next one. So, you might need to search n times to find Pablo (O(n) time complexity). If you want to insert a bunny named Remi between Pablo and Vicky, it's very simple. You just need to let Vicky release Pablo's tail, let Remi hold Pablo's tail, and then let Vicky hold Remi's tail (O(1) time complexity).</td>
    <td><img alt="singly linked list" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/singly-linked-list.png"></td>  
  </tr>
  <tr>
    <td>Array</td>
    <td>A line of numbered bunnies. If you want to find the bunny named Pablo, you can directly shout out Pablo's number 0680 (finding the element directly through array indexing, O(1) time complexity). However, if you don't know Pablo's number, you still need to search one by one (O(n) time complexity). Moreover, if you want to add a bunny named Vicky behind Pablo, you will need to renumber all the bunnies after Vicky (O(n) time complexity).</td>
    <td><img alt="array" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/array.png"></td>  
  </tr>
  <tr>
    <td>Queue</td>
    <td>A line of numbered bunnies with a sticky note on the first bunny. For this line with a sticky note on the first bunny, whenever we want to remove a bunny from the front of the line, we only need to move the sticky note to the face of the next bunny without actually removing the bunny to avoid renumbering all the bunnies behind (removing from the front is also O(1) time complexity). For the tail of the line, we don't need to worry because each new bunny added to the tail is directly given a new number (O(1) time complexity) without needing to renumber all the previous bunnies.</td>
    <td><img alt="queue" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/queue.jpg"></td>  
  </tr>
  <tr>
    <td>Deque</td>
    <td>A line of grouped, numbered bunnies with a sticky note on the first bunny. For this line, we manage it by groups. Each time we remove a bunny from the front of the line, we only move the sticky note to the next bunny. This way, we don't need to renumber all the bunnies behind the first bunny each time a bunny is removed. Only when all members of a group are removed do we reassign numbers and regroup. The tail is handled similarly. This is a strategy of delaying and batching operations to offset the drawbacks of the Array data structure that requires moving all elements behind when inserting or deleting elements in the middle.</td>
    <td><img alt="deque" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/deque.png"></td>  
  </tr>
  <tr>
    <td>Doubly Linked List</td>
    <td>A line of bunnies where each bunny holds the tail of the bunny in front (each bunny knows the names of the two adjacent bunnies). This provides the Singly Linked List the ability to search forward, and that's all. For example, if you directly come to the bunny Remi in the line and ask her where Vicky is, she will say the one holding my tail behind me, and if you ask her where Pablo is, she will say right in front.</td>
    <td><img alt="doubly linked list" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/doubly-linked-list.png"></td>  
  </tr>
  <tr>
    <td>Stack</td>
    <td>A line of bunnies in a dead-end tunnel, where bunnies can only be removed from the tunnel entrance (end), and new bunnies can only be added at the entrance (end) as well.</td>
    <td><img alt="stack" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/stack.jpg"></td>  
  </tr>
  <tr>
    <td>Binary Tree</td>
    <td>As the name suggests, it's a tree where each node has at most two children. When you add consecutive data such as [4, 2, 6, 1, 3, 5, 7], it will be a complete binary tree. When you add data like [4, 2, 6, null, 1, 3, null, 5, null, 7], you can specify whether any left or right child node is null, and the shape of the tree is fully controllable.</td>
    <td><img alt="binary tree" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/binary-tree.png"></td>  
  </tr>
  <tr>
    <td>Binary Search Tree (BST)</td>
    <td>A tree-like rabbit colony composed of doubly linked lists where each rabbit has at most two tails. These rabbits are disciplined and obedient, arranged in their positions according to a certain order. The most important data structure in a binary tree (the core is that the time complexity for insertion, deletion, modification, and search is O(log n)). The data stored in a BST is structured and ordered, not in strict order like 1, 2, 3, 4, 5, but maintaining that all nodes in the left subtree are less than the node, and all nodes in the right subtree are greater than the node. This order provides O(log n) time complexity for insertion, deletion, modification, and search. Reducing O(n) to O(log n) is the most common algorithm complexity optimization in the computer field, an exponential improvement in efficiency. It's also the most efficient way to organize unordered data into ordered data (most sorting algorithms only maintain O(n log n)). Of course, the binary search trees we provide support organizing data in both ascending and descending order. Remember that basic BSTs do not have self-balancing capabilities, and if you sequentially add sorted data to this data structure, it will degrade into a list, thus losing the O(log n) capability. Of course, our addMany method is specially handled to prevent degradation. However, for practical applications, please use Red-black Tree or AVL Tree as much as possible, as they inherently have self-balancing functions.</td>
    <td><img alt="binary search tree" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/binary-search-tree.png"></td>  
  </tr>
  <tr>
    <td>Red-black Tree</td>
    <td>A tree-like rabbit colony composed of doubly linked lists, where each rabbit has at most two tails. These rabbits are not only obedient but also intelligent, automatically arranging their positions in a certain order. A self-balancing binary search tree. Each node is marked with a red-black label. Ensuring that no path is more than twice as long as any other (maintaining a certain balance to improve the speed of search, addition, and deletion).</td>
    <td><img alt="red-black tree" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/red-black tree.png"></td>  
  </tr>
  <tr>
    <td>AVL Tree</td>
    <td>A tree-like rabbit colony composed of doubly linked lists, where each rabbit has at most two tails. These rabbits are not only obedient but also intelligent, automatically arranging their positions in a certain order, and they follow very strict rules. A self-balancing binary search tree. Each node is marked with a balance factor, representing the height difference between its left and right subtrees. The absolute value of the balance factor does not exceed 1 (maintaining stricter balance, which makes search efficiency higher than Red-black Tree, but insertion and deletion operations will be more complex and relatively less efficient).</td>
    <td><img alt="avl tree" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/avl-tree.png"></td>  
  </tr>
  <tr>
    <td>Heap</td>
    <td>A special type of complete binary tree, often stored in an array, where the children nodes of the node at index i are at indices 2i+1 and 2i+2. Naturally, the parent node of any node is at ⌊(i−1)/2⌋.</td>
    <td><img alt="heap" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/heap.jpg"></td>  
  </tr>
  <tr>
    <td>Priority Queue</td>
    <td>It's actually a Heap.</td>
    <td><img alt="priority queue" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/heap.jpg"></td>  
  </tr>
  <tr>
    <td>Graph</td>
    <td>The base class for Directed Graph and Undirected Graph, providing some common methods.</td>
    <td><img alt="graph" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/graph.png"></td>  
  </tr>
  <tr>
    <td>Directed Graph</td>
    <td>A network-like bunny group where each bunny can have up to n tails (Singly Linked List).</td>
    <td><img alt="directed graph" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/directed-graph.png"></td>  
  </tr>
  <tr>
    <td>Undirected Graph</td>
    <td>A network-like bunny group where each bunny can have up to n tails (Doubly Linked List).</td>
    <td><img alt="undirected graph" src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/undirected-graph.png"></td>  
  </tr>
</table>



### Conciseness and uniformity

In [java.utils](), you need to memorize a table for all sequential data structures(Queue, Deque, LinkedList),

<table style="display: table; width:100%; table-layout: fixed;">
        <thead>
            <tr>
                <th>Java ArrayList</th>
                <th>Java Queue</th>
                <th>Java ArrayDeque</th>
                <th>Java LinkedList</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>add</td>
                <td>offer</td>
                <td>push</td>
                <td>push</td>
            </tr>
            <tr>
                <td>remove</td>
                <td>poll</td>
                <td>removeLast</td>
                <td>removeLast</td>
            </tr>
            <tr>
                <td>remove</td>
                <td>poll</td>
                <td>removeFirst</td>
                <td>removeFirst</td>
            </tr>
            <tr>
                <td>add(0, element)</td>
                <td>offerFirst</td>
                <td>unshift</td>
                <td>unshift</td>
            </tr>
        </tbody>
    </table>

whereas in our [data-structure-typed](), you **only** need to remember four methods: `push`, `pop`, `shift`, and `unshift` for all sequential data structures(Queue, Deque, DoublyLinkedList, SinglyLinkedList and Array).

### Data structures available

We provide data structures that are not available in JS/TS

<table style="display: table; width:100%; table-layout: fixed;">
<thead>
<tr>
<th>Data Structure</th>
<th>Unit Test</th>
<th>Perf Test</th>
<th>API Doc</th>
<th>NPM</th>
<th>Downloads</th>
</tr>
</thead>
<tbody>
<tr>
<td>Binary Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryTree.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/binary-tree-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/binary-tree-typed"></td>
</tr>
<tr>
<td>Binary Search Tree (BST)</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BST.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/bst-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/bst-typed"></td>
</tr>
<tr>
<td>AVL Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/AVLTree.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/avl-tree-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/avl-tree-typed"></td>
</tr>
<tr>
<td>Red Black Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/RedBlackTree.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/red-black-tree-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/red-black-tree-typed"></td>
</tr>
<tr>
<td>Tree Multimap</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/TreeMultiMap.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/tree-multimap-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/tree-multimap-typed"></td>
</tr>
<tr>
<td>Heap</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Heap.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/heap-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/heap-typed"></td>
</tr>
<tr>
<td>Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/PriorityQueue.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/priority-queue-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/priority-queue-typed"></td>
</tr>
<tr>
<td>Max Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/MaxPriorityQueue.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/max-priority-queue-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/max-priority-queue-typed"></td>
</tr>
<tr>
<td>Min Priority Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/MinPriorityQueue.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/min-priority-queue-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/min-priority-queue-typed"></td>
</tr>
<tr>
<td>Trie</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Trie.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/trie-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/trie-typed"></td>
</tr>
<tr>
<td>Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/AbstractGraph.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/graph-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/graph-typed"></td>
</tr>
<tr>
<td>Directed Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/DirectedGraph.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/directed-graph-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/directed-graph-typed"></td>
</tr>
<tr>
<td>Undirected Graph</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/UndirectedGraph.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/undirected-graph-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/undirected-graph-typed"></td>
</tr>
<tr>
<td>Queue</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Queue.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/queue-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/queue-typed"></td>
</tr>
<tr>
<td>Deque</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Deque.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/deque-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/deque-typed"></td>
</tr>
<tr>
<td>Hash Map</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/HashMap.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/hashmap-typed"><span></span></a></td>
<td></td>
</tr>
<tr>
<td>Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/linked-list-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/linked-list-typed"></td>
</tr>
<tr>
<td>Singly Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SinglyLinkedList.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/singly-linked-list-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/singly-linked-list-typed"></td>
</tr>
<tr>
<td>Doubly Linked List</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/DoublyLinkedList.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/doubly-linked-list-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/doubly-linked-list-typed"></td>
</tr>
<tr>
<td>Stack</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/Stack.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/stack-typed"><span>NPM</span></a></td>
<td><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/stack-typed"></td>
</tr>
<tr>
<td>Segment Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/SegmentTree.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/segment-tree-typed"><span></span></a></td>
<td></td>
</tr>
<tr>
<td>Binary Indexed Tree</td>
<td><img src="https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/assets/tick.svg" alt=""></td>
<td></td>
<td><a href="https://data-structure-typed-docs.vercel.app/classes/BinaryIndexedTree.html"><span>Docs</span></a></td>
<td><a href="https://www.npmjs.com/package/binary-indexed-tree-typed"><span></span></a></td>
<td></td>
</tr>
</tbody>
</table>

## Vivid Examples

### AVL Tree

[Try it out](https://vivid-algorithm.vercel.app/), or you can run your own code using
our [visual tool](https://github.com/zrwusa/vivid-algorithm)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/avl-tree-test.webp)

### Tree Multi Map

[Try it out](https://vivid-algorithm.vercel.app/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/tree-multiset-test.webp)

### Directed Graph

[Try it out](https://vivid-algorithm.vercel.app/algorithm/graph/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/directed-graph-test.webp)

### Map Graph

[Try it out](https://vivid-algorithm.vercel.app/algorithm/graph/)

![](https://raw.githubusercontent.com/zrwusa/assets/master/images/data-structure-typed/examples/videos/webp_output/map-graph-test.webp)

## Code Snippets

### Red Black Tree snippet

#### TS

```ts
import { RedBlackTree } from 'data-structure-typed';

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
import { RedBlackTree } from 'data-structure-typed';

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

### Free conversion between data structures.

```js
const orgArr = [6, 1, 2, 7, 5, 3, 4, 9, 8];
const orgStrArr = ["trie", "trial", "trick", "trip", "tree", "trend", "triangle", "track", "trace", "transmit"];
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
// [[6, "6"], [1, "1"], [2, "2"], [7, "7"], [5, "5"], [3, "3"], [4, "4"], [9, "9"], [8, "8"]]

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

### Binary Search Tree (BST) snippet

```ts
import { BST, BSTNode } from 'data-structure-typed';

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

const objBST = new BST<number, { height: number, age: number }>();

objBST.add(11, { "name": "Pablo", "size": 15 });
objBST.add(3, { "name": "Kirk", "size": 1 });

objBST.addMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5], [
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

objBST.delete(11);
```

### AVLTree snippet

```ts
import { AVLTree } from 'data-structure-typed';

const avlTree = new AVLTree<number>();
avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5])
avlTree.isAVLBalanced();    // true
avlTree.delete(10);
avlTree.isAVLBalanced();    // true
```

### Directed Graph simple snippet

```ts
import { DirectedGraph } from 'data-structure-typed';

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

### Undirected Graph snippet

```ts
import { UndirectedGraph } from 'data-structure-typed';

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


[//]: # (No deletion!!! Start of Example Replace Section)


[//]: # (No deletion!!! End of Example Replace Section)

## API docs & Examples

[API Docs](https://data-structure-typed-docs.vercel.app)

[Live Examples](https://vivid-algorithm.vercel.app)

<a href="https://github.com/zrwusa/vivid-algorithm" target="_blank">Examples Repository</a>

## Benchmark

MacBook Pro (15-inch, 2018)

Processor 2.2 GHz 6-Core Intel Core i7

Memory 16 GB 2400 MHz DDR4

Graphics Radeon Pro 555X 4 GB

Intel UHD Graphics 630 1536 MB

macOS Big Sur

Version 11.7.9

***Our performance testing is conducted directly on the TypeScript source code. The actual performance of the compiled JavaScript code is generally 3 times higher. We have compared it with C++, and it is only 30% slower than C++.***
Try it [on gitpod](https://gitpod.io#snapshot/93383de4-ca4c-4854-8c80-4359e681a96f)

Just run
```shell
pnpm perf:rbtree
```

```html
1,000,000 add randomly: 1.367s
1,000,000 add: 374.859ms
1,000,000 get: 8.025ms
1,000,000 getNode: 1.293s
```

[//]: # (No deletion!!! Start of Replace Section)
<div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>heap</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100,000 add</td><td>3.01</td><td>0.00</td><td>1.05e-4</td></tr><tr><td>100,000 add & poll</td><td>16.57</td><td>0.02</td><td>4.12e-4</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>avl-tree</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100,000 add randomly</td><td>276.06</td><td>0.28</td><td>0.00</td></tr><tr><td>100,000 add</td><td>247.11</td><td>0.25</td><td>0.01</td></tr><tr><td>100,000 get</td><td>0.28</td><td>2.82e-4</td><td>9.27e-5</td></tr><tr><td>100,000 getNode</td><td>168.47</td><td>0.17</td><td>0.01</td></tr><tr><td>100,000 iterator</td><td>12.84</td><td>0.01</td><td>0.00</td></tr><tr><td>100,000 add & delete orderly</td><td>385.64</td><td>0.39</td><td>0.00</td></tr><tr><td>100,000 add & delete randomly</td><td>501.31</td><td>0.50</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>red-black-tree</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100,000 add randomly</td><td>78.51</td><td>0.08</td><td>0.00</td></tr><tr><td>100,000 add</td><td>104.83</td><td>0.10</td><td>0.00</td></tr><tr><td>100,000 get</td><td>0.53</td><td>5.26e-4</td><td>7.38e-5</td></tr><tr><td>100,000 getNode</td><td>249.02</td><td>0.25</td><td>0.01</td></tr><tr><td>100,000 node mode add randomly</td><td>77.15</td><td>0.08</td><td>0.00</td></tr><tr><td>100,000 node mode get</td><td>253.61</td><td>0.25</td><td>0.01</td></tr><tr><td>100,000 iterator</td><td>13.23</td><td>0.01</td><td>0.00</td></tr><tr><td>100,000 add & delete orderly</td><td>226.81</td><td>0.23</td><td>0.00</td></tr><tr><td>100,000 add & delete randomly</td><td>325.56</td><td>0.33</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>doubly-linked-list</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1,000,000 push</td><td>109.12</td><td>0.11</td><td>0.02</td></tr><tr><td>1,000,000 unshift</td><td>105.65</td><td>0.11</td><td>0.01</td></tr><tr><td>1,000,000 unshift & shift</td><td>96.20</td><td>0.10</td><td>0.01</td></tr><tr><td>1,000,000 addBefore</td><td>157.94</td><td>0.16</td><td>0.03</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>directed-graph</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1,000 addVertex</td><td>0.05</td><td>4.73e-5</td><td>1.24e-6</td></tr><tr><td>1,000 addEdge</td><td>2.96</td><td>0.00</td><td>9.68e-5</td></tr><tr><td>1,000 getVertex</td><td>0.05</td><td>4.70e-5</td><td>1.27e-6</td></tr><tr><td>1,000 getEdge</td><td>44.92</td><td>0.04</td><td>0.01</td></tr><tr><td>tarjan</td><td>257.57</td><td>0.26</td><td>0.02</td></tr><tr><td>topologicalSort</td><td>207.12</td><td>0.21</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>queue</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1,000,000 push</td><td>25.86</td><td>0.03</td><td>0.01</td></tr><tr><td>100,000 push & shift</td><td>2.52</td><td>0.00</td><td>0.00</td></tr><tr><td>Native JS Array 100,000 push & shift</td><td>902.25</td><td>0.90</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>deque</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1,000,000 push</td><td>10.14</td><td>0.01</td><td>0.00</td></tr><tr><td>1,000,000 push & pop</td><td>14.13</td><td>0.01</td><td>0.01</td></tr><tr><td>1,000,000 push & shift</td><td>13.35</td><td>0.01</td><td>0.01</td></tr><tr><td>100,000 push & shift</td><td>1.34</td><td>0.00</td><td>6.86e-4</td></tr><tr><td>Native JS Array 100,000 push & shift</td><td>904.80</td><td>0.90</td><td>0.01</td></tr><tr><td>100,000 unshift & shift</td><td>1.21</td><td>0.00</td><td>5.28e-4</td></tr><tr><td>Native JS Array 100,000 unshift & shift</td><td>1801.73</td><td>1.80</td><td>0.01</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>hash-map</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1,000,000 set</td><td>48.91</td><td>0.05</td><td>0.02</td></tr><tr><td>Native JS Map 1,000,000 set</td><td>141.21</td><td>0.14</td><td>0.02</td></tr><tr><td>Native JS Set 1,000,000 add</td><td>116.73</td><td>0.12</td><td>0.03</td></tr><tr><td>1,000,000 set & get</td><td>40.73</td><td>0.04</td><td>0.01</td></tr><tr><td>Native JS Map 1,000,000 set & get</td><td>196.24</td><td>0.20</td><td>0.02</td></tr><tr><td>Native JS Set 1,000,000 add & has</td><td>158.72</td><td>0.16</td><td>0.02</td></tr><tr><td>1,000,000 ObjKey set & get</td><td>242.77</td><td>0.24</td><td>0.08</td></tr><tr><td>Native JS Map 1,000,000 ObjKey set & get</td><td>231.61</td><td>0.23</td><td>0.09</td></tr><tr><td>Native JS Set 1,000,000 ObjKey add & has</td><td>177.41</td><td>0.18</td><td>0.05</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>trie</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>100,000 push</td><td>21.20</td><td>0.02</td><td>0.00</td></tr><tr><td>100,000 getWords</td><td>39.18</td><td>0.04</td><td>0.00</td></tr></table></div>
    </div><div class="json-to-html-collapse clearfix 0">
      <div class='collapsible level0' ><span class='json-to-html-label'>stack</span></div>
      <div class="content"><table style="display: table; width:100%; table-layout: fixed;"><tr><th>test name</th><th>time taken (ms)</th><th>sample mean (secs)</th><th>sample deviation</th></tr><tr><td>1,000,000 push</td><td>22.12</td><td>0.02</td><td>0.01</td></tr><tr><td>1,000,000 push & pop</td><td>25.51</td><td>0.03</td><td>0.01</td></tr></table></div>
    </div>

[//]: # (No deletion!!! End of Replace Section)

## The corresponding relationships between data structures in different language standard libraries.

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
    <td>-</td>
    <td>-</td>
    <td>heapq</td>
  </tr>
  <tr>
    <td>PriorityQueue&lt;E&gt;</td>
    <td>priority_queue&lt;T&gt;</td>
    <td>PriorityQueue&lt;E&gt;</td>
    <td>-</td>
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
    <td>ES6 Map&lt;K, V&gt;</td>
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

## Built-in classic algorithms

<table style="display: table; width:100%; table-layout: fixed;">
  <thead>
  <tr>
    <th>Algorithm</th>
    <th>Function Description</th>
    <th>Iteration Type</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>Binary Tree DFS</td>
    <td>Traverse a binary tree in a depth-first manner, starting from the root node, first visiting the left subtree,
      and then the right subtree, using recursion.
    </td>
    <td>Recursion + Iteration</td>
  </tr>
  <tr>
    <td>Binary Tree BFS</td>
    <td>Traverse a binary tree in a breadth-first manner, starting from the root node, visiting nodes level by level
      from left to right.
    </td>
    <td>Iteration</td>
  </tr>
  <tr>
    <td>Graph DFS</td>
    <td>Traverse a graph in a depth-first manner, starting from a given node, exploring along one path as deeply as
      possible, and backtracking to explore other paths. Used for finding connected components, paths, etc.
    </td>
    <td>Recursion + Iteration</td>
  </tr>
  <tr>
    <td>Binary Tree Morris</td>
    <td>Morris traversal is an in-order traversal algorithm for binary trees with O(1) space complexity. It allows tree
      traversal without additional stack or recursion.
    </td>
    <td>Iteration</td>
  </tr>
  <tr>
    <td>Graph BFS</td>
    <td>Traverse a graph in a breadth-first manner, starting from a given node, first visiting nodes directly connected
      to the starting node, and then expanding level by level. Used for finding shortest paths, etc.
    </td>
    <td>Recursion + Iteration</td>
  </tr>
  <tr>
    <td>Graph Tarjan's Algorithm</td>
    <td>Find strongly connected components in a graph, typically implemented using depth-first search.</td>
    <td>Recursion</td>
  </tr>
  <tr>
    <td>Graph Bellman-Ford Algorithm</td>
    <td>Finding the shortest paths from a single source, can handle negative weight edges</td>
    <td>Iteration</td>
  </tr>
  <tr>
    <td>Graph Dijkstra's Algorithm</td>
    <td>Finding the shortest paths from a single source, cannot handle negative weight edges</td>
    <td>Iteration</td>
  </tr>
  <tr>
    <td>Graph Floyd-Warshall Algorithm</td>
    <td>Finding the shortest paths between all pairs of nodes</td>
    <td>Iteration</td>
  </tr>
  <tr>
    <td>Graph getCycles</td>
    <td>Find all cycles in a graph or detect the presence of cycles.</td>
    <td>Recursion</td>
  </tr>
  <tr>
    <td>Graph getCutVertices</td>
    <td>Find cut vertices in a graph, which are nodes that, when removed, increase the number of connected components in
      the graph.
    </td>
    <td>Recursion</td>
  </tr>
  <tr>
    <td>Graph getSCCs</td>
    <td>Find strongly connected components in a graph, which are subgraphs where any two nodes can reach each other.
    </td>
    <td>Recursion</td>
  </tr>
  <tr>
    <td>Graph getBridges</td>
    <td>Find bridges in a graph, which are edges that, when removed, increase the number of connected components in the
      graph.
    </td>
    <td>Recursion</td>
  </tr>
  <tr>
    <td>Graph topologicalSort</td>
    <td>Perform topological sorting on a directed acyclic graph (DAG) to find a linear order of nodes such that all
      directed edges go from earlier nodes to later nodes.
    </td>
    <td>Recursion</td>
  </tr>
  </tbody>
</table>

## Software Engineering Design Standards

We strictly adhere to computer science theory and software development standards. Our LinkedList is designed in the
traditional sense of the LinkedList data structure, and we refrain from substituting it with a Deque solely for the
purpose of showcasing performance test data. However, we have also implemented a Deque based on a dynamic array
concurrently.


<table style="display: table; width:100%; table-layout: fixed;">
    <tr>
        <th>Principle</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Practicality</td>
        <td>Follows ES6 and ESNext standards, offering unified and considerate optional parameters, and simplifies method names.</td>
    </tr>
    <tr>
        <td>Extensibility</td>
        <td>Adheres to OOP (Object-Oriented Programming) principles, allowing inheritance for all data structures.</td>
    </tr>
    <tr>
        <td>Modularization</td>
        <td>Includes data structure modularization and independent NPM packages.</td>
    </tr>
    <tr>
        <td>Efficiency</td>
        <td>All methods provide time and space complexity, comparable to native JS performance.</td>
    </tr>
    <tr>
        <td>Maintainability</td>
        <td>Follows open-source community development standards, complete documentation, continuous integration, and adheres to TDD (Test-Driven Development) patterns.</td>
    </tr>
    <tr>
        <td>Testability</td>
        <td>Automated and customized unit testing, performance testing, and integration testing.</td>
    </tr>
    <tr>
        <td>Portability</td>
        <td>Plans for porting to Java, Python, and C++, currently achieved to 80%.</td>
    </tr>
    <tr>
        <td>Reusability</td>
        <td>Fully decoupled, minimized side effects, and adheres to OOP.</td>
    </tr>
    <tr>
        <td>Security</td>
        <td>Carefully designed security for member variables and methods. Read-write separation. Data structure software does not need to consider other security aspects.</td>
    </tr>
    <tr>
        <td>Scalability</td>
        <td>Data structure software does not involve load issues.</td>
    </tr>
</table>

## supported module system

Now you can use it in Node.js and browser environments

CommonJS:**`require export.modules =`**

ESModule:&nbsp;&nbsp;&nbsp;**`import export`**

Typescript:&nbsp;&nbsp;&nbsp;**`import export`**

UMD:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**`var Deque = dataStructureTyped.Deque`**

### CDN

Copy the line below into the head tag in an HTML document.

#### development

```html

<script src='https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.js'></script>
```

#### production

```html

<script src='https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js'></script>
```

Copy the code below into the script tag of your HTML, and you're good to go with your development.

```js
const { Heap } = dataStructureTyped;
const {
  BinaryTree, Graph, Queue, Stack, PriorityQueue, BST, Trie, DoublyLinkedList,
  AVLTree, MinHeap, SinglyLinkedList, DirectedGraph, TreeMultiMap,
  DirectedVertex, AVLTreeNode
} = dataStructureTyped;
```
