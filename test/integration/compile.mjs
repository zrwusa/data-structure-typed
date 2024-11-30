import { AVLTree, BinaryTree, BST, Deque, DoublyLinkedList, HashMap, Heap, MaxPriorityQueue, MinHeap, MinPriorityQueue, Queue, RedBlackTree, SinglyLinkedList, Stack, TreeMultiMap, Trie } from 'data-structure-typed';
const orgArr = [6, 1, 2, 7, 5, 3, 4, 9, 8];
const orgStrArr = ['trie', 'trial', 'trick', 'trip', 'tree', 'trend', 'triangle', 'track', 'trace', 'transmit'];
const entries = [
  [6, '6'],
  [1, '1'],
  [2, '2'],
  [7, '7'],
  [5, '5'],
  [3, '3'],
  [4, '4'],
  [9, '9'],
  [8, '8']
];
const queue = new Queue(orgArr);

// [6, 1, 2, 7, 5, 3, 4, 9, 8]
const deque = new Deque(orgArr);

// [6, 1, 2, 7, 5, 3, 4, 9, 8]
const sList = new SinglyLinkedList(orgArr);

// [6, 1, 2, 7, 5, 3, 4, 9, 8]
const dList = new DoublyLinkedList(orgArr);

// [6, 1, 2, 7, 5, 3, 4, 9, 8]
const stack = new Stack(orgArr);

// [6, 1, 2, 7, 5, 3, 4, 9, 8]
const minHeap = new MinHeap(orgArr);

// [1, 5, 2, 7, 6, 3, 4, 9, 8]
const maxPQ = new MaxPriorityQueue(orgArr);

// [9, 8, 4, 7, 5, 2, 3, 1, 6]
const biTree = new BinaryTree(entries);

//         ___6___
//        /       \
//     ___1_     _2_
//    /     \   /   \
//   _7_    5   3   4
//  /   \
//  9   8
const bst = new BST(entries);

//     _____5___
//    /         \
//   _2_       _7_
//  /   \     /   \
//  1   3_    6   8_
//        \         \
//        4         9
const rbTree = new RedBlackTree(entries);

//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
const avl = new AVLTree(entries);

//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
const treeMulti = new TreeMultiMap(entries);

//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
const hm = new HashMap(entries);

// [[6, "6"], [1, "1"], [2, "2"], [7, "7"], [5, "5"], [3, "3"], [4, "4"], [9, "9"], [8, "8"]]
const rbTreeH = new RedBlackTree(hm);

//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
const pq = new MinPriorityQueue(orgArr);

// [1, 5, 2, 7, 6, 3, 4, 9, 8]
const bst1 = new BST(pq);

//     _____5___
//    /         \
//   _2_       _7_
//  /   \     /   \
//  1   3_    6   8_
//        \         \
//        4         9
const dq1 = new Deque(orgArr);

// [6, 1, 2, 7, 5, 3, 4, 9, 8]
const rbTree1 = new RedBlackTree(dq1);

//    _____5___
//   /         \
//  _2___     _7___
// /     \   /     \
// 1    _4   6    _9
//      /         /
//      3         8
const trie2 = new Trie(orgStrArr);

// ['trie', 'trial', 'triangle', 'trick', 'trip', 'tree', 'trend', 'track', 'trace', 'transmit']
const heap2 = new Heap(trie2, { comparator: (a, b) => Number(a) - Number(b) });

// ['transmit', 'trace', 'tree', 'trend', 'track', 'trial', 'trip', 'trie', 'trick', 'triangle']
const dq2 = new Deque(heap2);

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
