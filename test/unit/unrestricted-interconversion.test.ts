import {
  AVLTree,
  BinaryTree,
  BST,
  Deque,
  DoublyLinkedList,
  HashMap,
  Heap,
  MaxHeap,
  MaxPriorityQueue,
  MinHeap,
  MinPriorityQueue,
  Queue,
  RedBlackTree,
  SinglyLinkedList,
  Stack,
  TreeMultimap,
  Trie
} from '../../src';
import { isDebugTest } from "../config";

const isDebug = isDebugTest;
const orgArr: number[] = [6, 1, 2, 7, 5, 3, 4, 9, 8];
const orgStrArr: string[] = [
  "trie",
  "trial",
  "trick",
  "trip",
  "tree",
  "trend",
  "triangle",
  "track",
  "trace",
  "transmit"
];
const entries: [number, number][] = [[6, 6], [1, 1], [2, 2], [7, 7], [5, 5], [3, 3], [4, 4], [9, 9], [8, 8]];

describe('conversions', () => {
  it('Array to Queue', () => {
    const q = new Queue<number>(orgArr);
    isDebug && q.print();
  })

  it('Array to Deque', () => {
    const dq = new Deque<number>(orgArr);
    isDebug && dq.print();
  })

  it('Array to SinglyLinkedList', () => {
    const sl = new SinglyLinkedList<number>(orgArr);
    isDebug && sl.print();
  })

  it('Array to DoublyLinkedList', () => {
    const dl = new DoublyLinkedList<number>(orgArr);
    isDebug && dl.print();
  })

  it('Array to Stack', () => {
    const stack = new Stack<number>(orgArr);
    isDebug && stack.print();
  })

  it('Array to MinHeap', () => {
    const minHeap = new MinHeap<number>(orgArr);
    isDebug && minHeap.print();
  })

  it('Array to MaxHeap', () => {
    const maxHeap = new MaxHeap<number>(orgArr);
    isDebug && maxHeap.print();
  })

  it('Array to MinPriorityQueue', () => {
    const minPQ = new MinPriorityQueue<number>(orgArr);
    isDebug && minPQ.print();
  })

  it('Array to MaxPriorityQueue', () => {
    const maxPQ = new MaxPriorityQueue<number>(orgArr);
    isDebug && maxPQ.print();
  })

  it('Entry Array to BinaryTree', () => {
    const biTree = new BinaryTree<number>(entries);
    isDebug && biTree.print();
  })

  it('Entry Array to BST', () => {
    const bst = new BST<number>(entries);
    expect(bst.size).toBe(9)
    isDebug && bst.print();
  })

  it('Entry Array to RedBlackTree', () => {
    const rbTree = new RedBlackTree<number>(entries);
    expect(rbTree.size).toBe(9)
    isDebug && rbTree.print();
  })

  it('Entry Array to AVLTree', () => {
    const avl = new AVLTree<number>(entries);
    expect(avl.size).toBe(9)
    isDebug && avl.print();
  })

  it('Entry Array to TreeMultimap', () => {
    const treeMulti = new TreeMultimap<number>(entries);
    expect(treeMulti.size).toBe(9)
    isDebug && treeMulti.print();
  })

  it('HashMap to RedBlackTree', () => {
    const hm = new HashMap(entries);
    isDebug && hm.print()
    const rbTree = new RedBlackTree<number>(hm);
    expect(rbTree.size).toBe(9)
    isDebug && rbTree.print();
  })

  it('PriorityQueue to BST', () => {
    const pq = new MinPriorityQueue(orgArr);
    isDebug && pq.print();
    const bst = new BST<number>(pq);
    expect(bst.size).toBe(9)
    isDebug && bst.print();
  })

  it('Deque to RedBlackTree', () => {
    const dq = new Deque(orgArr);
    isDebug && dq.print();
    const rbTree = new RedBlackTree<number>(dq);
    expect(rbTree.size).toBe(9)
    isDebug && rbTree.print();
  })

  it('Trie to Heap to Deque', () => {
    const trie = new Trie(orgStrArr);
    expect(trie.size).toBe(10);
    isDebug && trie.print();
    const heap = new Heap<string>(trie, { comparator: (a, b) => Number(a) - Number(b) });
    expect(heap.size).toBe(10);
    isDebug && heap.print();
    const dq = new Deque<string>(heap);
    expect(dq.size).toBe(10);
    isDebug && dq.print();
    const entries = dq.map((el, i) => <[number, string]>[i, el]);
    const avl = new AVLTree<number, string>(entries);
    expect(avl.size).toBe(10)
    isDebug && avl.print();
  })

})



