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
  TreeMultiMap,
  Trie
} from '../../src';
import { isDebugTest } from '../config';

const isDebug = isDebugTest;
const orgArr: number[] = [6, 1, 2, 7, 5, 3, 4, 9, 8];
const orgStrArr: string[] = [
  'trie',
  'trial',
  'trick',
  'trip',
  'tree',
  'trend',
  'triangle',
  'track',
  'trace',
  'transmit'
];
const entries: [number, string][] = [
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

describe('conversions', () => {
  it('Array to Queue', () => {
    const q = new Queue<number>(orgArr);
    isDebug && q.print();
    expect([...q]).toEqual([6, 1, 2, 7, 5, 3, 4, 9, 8]);
  });

  it('Array to Deque', () => {
    const dq = new Deque<number>(orgArr);
    isDebug && dq.print();
    expect([...dq]).toEqual([6, 1, 2, 7, 5, 3, 4, 9, 8]);
  });

  it('Array to SinglyLinkedList', () => {
    const sl = new SinglyLinkedList<number>(orgArr);
    isDebug && sl.print();
    expect([...sl]).toEqual([6, 1, 2, 7, 5, 3, 4, 9, 8]);
  });

  it('Array to DoublyLinkedList', () => {
    const dl = new DoublyLinkedList<number>(orgArr);
    isDebug && dl.print();
    expect([...dl]).toEqual([6, 1, 2, 7, 5, 3, 4, 9, 8]);
  });

  it('Array to Stack', () => {
    const stack = new Stack<number>(orgArr);
    isDebug && stack.print();
    expect([...stack]).toEqual([6, 1, 2, 7, 5, 3, 4, 9, 8]);
  });

  it('Array to MinHeap', () => {
    const minHeap = new MinHeap<number>(orgArr);
    isDebug && minHeap.print();
    expect([...minHeap]).toEqual([1, 5, 2, 7, 6, 3, 4, 9, 8]);
  });

  it('Array to MaxHeap', () => {
    const maxHeap = new MaxHeap<number>(orgArr);
    isDebug && maxHeap.print();
    expect([...maxHeap]).toEqual([9, 8, 4, 7, 5, 2, 3, 1, 6]);
  });

  it('Array to MinPriorityQueue', () => {
    const minPQ = new MinPriorityQueue<number>(orgArr);
    isDebug && minPQ.print();
    expect([...minPQ]).toEqual([1, 5, 2, 7, 6, 3, 4, 9, 8]);
  });

  it('Array to MaxPriorityQueue', () => {
    const maxPQ = new MaxPriorityQueue<number>(orgArr);
    isDebug && maxPQ.print();
    expect([...maxPQ]).toEqual([9, 8, 4, 7, 5, 2, 3, 1, 6]);
  });

  it('Entry Array to BinaryTree', () => {
    const biTree = new BinaryTree<number>(entries);
    isDebug && biTree.print();
    expect([...biTree]).toEqual([
      [9, '9'],
      [7, '7'],
      [8, '8'],
      [1, '1'],
      [5, '5'],
      [6, '6'],
      [3, '3'],
      [2, '2'],
      [4, '4']
    ]);
  });

  it('Entry Array to BST', () => {
    const bst = new BST<number>(entries);
    expect(bst.size).toBe(9);
    isDebug && bst.print();
    expect([...bst]).toEqual([
      [1, '1'],
      [2, '2'],
      [3, '3'],
      [4, '4'],
      [5, '5'],
      [6, '6'],
      [7, '7'],
      [8, '8'],
      [9, '9']
    ]);
  });

  it('Entry Array to RedBlackTree', () => {
    const rbTree = new RedBlackTree<number>(entries);
    expect(rbTree.size).toBe(9);
    isDebug && rbTree.print();
    expect([...rbTree]).toEqual([
      [1, '1'],
      [2, '2'],
      [3, '3'],
      [4, '4'],
      [5, '5'],
      [6, '6'],
      [7, '7'],
      [8, '8'],
      [9, '9']
    ]);
  });

  it('Entry Array to AVLTree', () => {
    const avl = new AVLTree<number>(entries);
    expect(avl.size).toBe(9);
    isDebug && avl.print();
    expect([...avl]).toEqual([
      [1, '1'],
      [2, '2'],
      [3, '3'],
      [4, '4'],
      [5, '5'],
      [6, '6'],
      [7, '7'],
      [8, '8'],
      [9, '9']
    ]);
  });

  it('Entry Array to TreeMultiMap', () => {
    const treeMulti = new TreeMultiMap<number>(entries);
    expect(treeMulti.size).toBe(9);
    isDebug && treeMulti.print();
    expect([...treeMulti]).toEqual([
      [1, '1'],
      [2, '2'],
      [3, '3'],
      [4, '4'],
      [5, '5'],
      [6, '6'],
      [7, '7'],
      [8, '8'],
      [9, '9']
    ]);
  });

  it('HashMap to RedBlackTree', () => {
    const hm = new HashMap(entries);
    isDebug && hm.print();
    const rbTree = new RedBlackTree<number>(hm);
    expect(rbTree.size).toBe(9);
    isDebug && rbTree.print();
    expect([...rbTree]).toEqual([
      [1, '1'],
      [2, '2'],
      [3, '3'],
      [4, '4'],
      [5, '5'],
      [6, '6'],
      [7, '7'],
      [8, '8'],
      [9, '9']
    ]);
  });

  it('PriorityQueue to BST', () => {
    const pq = new MinPriorityQueue(orgArr);
    isDebug && pq.print();
    const bst = new BST<number>(pq);
    expect(bst.size).toBe(9);
    isDebug && bst.print();
    expect([...bst]).toEqual([
      [1, undefined],
      [2, undefined],
      [3, undefined],
      [4, undefined],
      [5, undefined],
      [6, undefined],
      [7, undefined],
      [8, undefined],
      [9, undefined]
    ]);
  });

  it('Deque to RedBlackTree', () => {
    const dq = new Deque(orgArr);
    isDebug && dq.print();
    const rbTree = new RedBlackTree<number>(dq);
    expect(rbTree.size).toBe(9);
    isDebug && rbTree.print();
    expect([...rbTree]).toEqual([
      [1, undefined],
      [2, undefined],
      [3, undefined],
      [4, undefined],
      [5, undefined],
      [6, undefined],
      [7, undefined],
      [8, undefined],
      [9, undefined]
    ]);
  });

  it('Trie to Heap to Deque', () => {
    const trie = new Trie(orgStrArr);
    expect(trie.size).toBe(10);
    isDebug && trie.print();
    const heap = new Heap<string>(trie, { comparator: (a, b) => Number(a) - Number(b) });
    expect(heap.size).toBe(10);
    isDebug && heap.print();
    expect([...heap]).toEqual([
      'transmit',
      'trace',
      'tree',
      'trend',
      'track',
      'trial',
      'trip',
      'trie',
      'trick',
      'triangle'
    ]);
    const dq = new Deque<string>(heap);
    expect(dq.size).toBe(10);
    isDebug && dq.print();
    expect([...dq]).toEqual([
      'transmit',
      'trace',
      'tree',
      'trend',
      'track',
      'trial',
      'trip',
      'trie',
      'trick',
      'triangle'
    ]);
    const entries = dq.map((el, i) => <[number, string]>[i, el]);
    const avl = new AVLTree<number, string>(entries);
    expect(avl.size).toBe(10);
    isDebug && avl.print();
    expect([...avl]).toEqual([
      [0, 'transmit'],
      [1, 'trace'],
      [2, 'tree'],
      [3, 'trend'],
      [4, 'track'],
      [5, 'trial'],
      [6, 'trip'],
      [7, 'trie'],
      [8, 'trick'],
      [9, 'triangle']
    ]);
  });
});
