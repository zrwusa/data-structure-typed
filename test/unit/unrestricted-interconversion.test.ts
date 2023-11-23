import {
  Deque,
  DoublyLinkedList,
  MaxHeap,
  MaxPriorityQueue,
  MinHeap,
  MinPriorityQueue,
  Queue,
  SinglyLinkedList,
  Stack
} from '../../src';

const orgArr: number[] = [6, 1, 2, 7, 5, 3, 4, 9, 8];
describe('conversions', () => {
  it('Array to Queue', () => {
    const q = new Queue<number>(orgArr);
    q.print();
  })

  it('Array to Deque', () => {
    const dq = new Deque<number>(orgArr);
    dq.print();
  })

  it('Array to SinglyLinkedList', () => {
    const sl = new SinglyLinkedList<number>(orgArr);
    sl.print();
  })

  it('Array to DoublyLinkedList', () => {
    const dl = new DoublyLinkedList<number>(orgArr);
    dl.print();
  })

  it('Array to Stack', () => {
    const stack = new Stack<number>(orgArr);
    stack.print();
  })

  it('Array to MinHeap', () => {
    const minHeap = new MinHeap<number>(orgArr);
    minHeap.print();
  })

  it('Array to MaxHeap', () => {
    const maxHeap = new MaxHeap<number>(orgArr);
    maxHeap.print();
  })

  it('Array to MinPriorityQueue', () => {
    const minPQ = new MinPriorityQueue<number>(orgArr);
    minPQ.print();
  })

  it('Array to MaxPriorityQueue', () => {
    const maxPQ = new MaxPriorityQueue<number>(orgArr);
    maxPQ.print();
  })
})