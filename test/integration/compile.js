"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_structure_typed_1 = require("data-structure-typed");
var orgArr = [6, 1, 2, 7, 5, 3, 4, 9, 8];
var orgStrArr = ['trie', 'trial', 'trick', 'trip', 'tree', 'trend', 'triangle', 'track', 'trace', 'transmit'];
var entries = [
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
var queue = new data_structure_typed_1.Queue(orgArr);
queue.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]
var deque = new data_structure_typed_1.Deque(orgArr);
deque.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]
var sList = new data_structure_typed_1.SinglyLinkedList(orgArr);
sList.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]
var dList = new data_structure_typed_1.DoublyLinkedList(orgArr);
dList.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]
var stack = new data_structure_typed_1.Stack(orgArr);
stack.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]
var minHeap = new data_structure_typed_1.MinHeap(orgArr);
minHeap.print();
// [1, 5, 2, 7, 6, 3, 4, 9, 8]
var maxPQ = new data_structure_typed_1.MaxPriorityQueue(orgArr);
maxPQ.print();
// [9, 8, 4, 7, 5, 2, 3, 1, 6]
var biTree = new data_structure_typed_1.BinaryTree(entries);
biTree.print();
//         ___6___
//        /       \
//     ___1_     _2_
//    /     \   /   \
//   _7_    5   3   4
//  /   \
//  9   8
var bst = new data_structure_typed_1.BST(entries);
bst.print();
//     _____5___
//    /         \
//   _2_       _7_
//  /   \     /   \
//  1   3_    6   8_
//        \         \
//        4         9
var rbTree = new data_structure_typed_1.RedBlackTree(entries);
rbTree.print();
//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
var avl = new data_structure_typed_1.AVLTree(entries);
avl.print();
//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
var treeMulti = new data_structure_typed_1.TreeMultiMap(entries);
treeMulti.print();
//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
var hm = new data_structure_typed_1.HashMap(entries);
hm.print();
// [[6, "6"], [1, "1"], [2, "2"], [7, "7"], [5, "5"], [3, "3"], [4, "4"], [9, "9"], [8, "8"]]
var rbTreeH = new data_structure_typed_1.RedBlackTree(hm);
rbTreeH.print();
//     ___4___
//    /       \
//   _2_     _6___
//  /   \   /     \
//  1   3   5    _8_
//              /   \
//              7   9
var pq = new data_structure_typed_1.MinPriorityQueue(orgArr);
pq.print();
// [1, 5, 2, 7, 6, 3, 4, 9, 8]
var bst1 = new data_structure_typed_1.BST(pq);
bst1.print();
//     _____5___
//    /         \
//   _2_       _7_
//  /   \     /   \
//  1   3_    6   8_
//        \         \
//        4         9
var dq1 = new data_structure_typed_1.Deque(orgArr);
dq1.print();
// [6, 1, 2, 7, 5, 3, 4, 9, 8]
var rbTree1 = new data_structure_typed_1.RedBlackTree(dq1);
rbTree1.print();
//    _____5___
//   /         \
//  _2___     _7___
// /     \   /     \
// 1    _4   6    _9
//      /         /
//      3         8
var trie2 = new data_structure_typed_1.Trie(orgStrArr);
trie2.print();
// ['trie', 'trial', 'triangle', 'trick', 'trip', 'tree', 'trend', 'track', 'trace', 'transmit']
var heap2 = new data_structure_typed_1.Heap(trie2, { comparator: function (a, b) { return Number(a) - Number(b); } });
heap2.print();
// ['transmit', 'trace', 'tree', 'trend', 'track', 'trial', 'trip', 'trie', 'trick', 'triangle']
var dq2 = new data_structure_typed_1.Deque(heap2);
dq2.print();
// ['transmit', 'trace', 'tree', 'trend', 'track', 'trial', 'trip', 'trie', 'trick', 'triangle']
var entries2 = dq2.map(function (el, i) { return [i, el]; });
var avl2 = new data_structure_typed_1.AVLTree(entries2);
avl2.print();
//     ___3_______
//    /           \
//   _1_       ___7_
//  /   \     /     \
//  0   2    _5_    8_
//          /   \     \
//          4   6     9
