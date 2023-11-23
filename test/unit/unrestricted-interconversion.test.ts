import {
  AVLTree,
  BinaryTree,
  BST,
  Deque,
  DoublyLinkedList,
  MaxHeap,
  MaxPriorityQueue,
  MinHeap,
  MinPriorityQueue,
  Queue,
  RedBlackTree,
  SinglyLinkedList,
  Stack,
  TreeMultimap
} from '../../src';
import { isDebugTest } from "../config";

const isDebug = isDebugTest;
const orgArr: number[] = [6, 1, 2, 7, 5, 3, 4, 9, 8];
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
    const bst = new BST<number>(orgArr);
    expect(bst.size).toBe(9)
    isDebug && bst.print();
  })

  it('Entry Array to RedBlackTree', () => {
    const rbTree = new RedBlackTree<number>(orgArr);
    expect(rbTree.size).toBe(9)
    isDebug && rbTree.print();
  })

  it('Entry Array to AVLTree', () => {
    const avl = new AVLTree<number>(orgArr);
    expect(avl.size).toBe(9)
    isDebug && avl.print();
  })

  it('Entry Array to TreeMultimap', () => {
    const treeMulti = new TreeMultimap<number>(orgArr);
    expect(treeMulti.size).toBe(9)
    isDebug && treeMulti.print();
  })
})



