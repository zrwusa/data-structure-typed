import {MaxPriorityQueue} from '../../../../src';
import {bigO, magnitude} from '../../../utils';

describe('MaxPriorityQueue Operation Test', () => {
  it('should add elements and maintain heap property', () => {
    const priorityQueue = new MaxPriorityQueue<number>();

    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);
    priorityQueue.add(1);

    expect(priorityQueue.poll()).toBe(7);
    expect(priorityQueue.poll()).toBe(5);
    expect(priorityQueue.poll()).toBe(3);
    expect(priorityQueue.poll()).toBe(1);
  });

  it('should add elements and maintain heap property in a object MaxPriorityQueue', () => {
    const priorityQueue = new MaxPriorityQueue<{keyA: number}>((a, b) => b.keyA - a.keyA);
    priorityQueue.refill([{keyA: 5}, {keyA: 3}, {keyA: 1}]);
    priorityQueue.add({keyA: 7});

    expect(priorityQueue.poll()?.keyA).toBe(7);
    expect(priorityQueue.poll()?.keyA).toBe(5);
    expect(priorityQueue.poll()?.keyA).toBe(3);
    expect(priorityQueue.poll()?.keyA).toBe(1);
  });

  it('should return and remove the smallest element', () => {
    const priorityQueue = new MaxPriorityQueue<number>();
    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);

    expect(priorityQueue.poll()).toBe(7);
    expect(priorityQueue.poll()).toBe(5);
    expect(priorityQueue.size).toBe(1);
  });

  it('should create a clone of the priority queue', () => {
    const priorityQueue = new MaxPriorityQueue<number>();
    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);

    const clone = priorityQueue.clone();
    expect(clone.poll()).toBe(7);
    expect(clone.poll()).toBe(5);
    expect(clone.poll()).toBe(3);
    expect(clone.isEmpty()).toBe(true);
  });

  it('should correctly heapify an array', () => {
    const array = [5, 3, 7, 1];
    const heap = MaxPriorityQueue.heapify<number>(array, (a, b) => b - a);
    heap.refill(array);

    expect(heap.poll()).toBe(7);
    expect(heap.poll()).toBe(5);
    expect(heap.poll()).toBe(3);
    expect(heap.poll()).toBe(1);
  });

  it('should correctly heapify an object array', () => {
    const nodes = [{keyA: 5}, {keyA: 3}, {keyA: 7}, {keyA: 1}];
    const maxPQ = MaxPriorityQueue.heapify<{keyA: number}>(nodes, (a, b) => b.keyA - a.keyA);

    expect(maxPQ.poll()?.keyA).toBe(7);
    expect(maxPQ.poll()?.keyA).toBe(5);
    expect(maxPQ.poll()?.keyA).toBe(3);
    expect(maxPQ.poll()?.keyA).toBe(1);
  });
});

describe('MaxPriorityQueue Performance Test', () => {
  it('should the poll method adheres to a time complexity of O(log n) and executed correctly under large scale distinct data', () => {
    const nodes = Array.from(
      new Set<number>(Array.from(new Array(magnitude.LINEAR), () => Math.floor(Math.random() * magnitude.LINEAR * 100)))
    );
    expect(nodes.length).toBeGreaterThan(magnitude.LINEAR / 2);
    const maxPQ = new MaxPriorityQueue<number>();
    maxPQ.refill(nodes);
    let prev = Number.MAX_SAFE_INTEGER;
    const startTime = performance.now();
    while (maxPQ.size > 0) {
      const polled = maxPQ.poll();
      if (polled) {
        prev = polled;
      }
    }
    const cost = performance.now() - startTime;
    expect(cost).toBeLessThan(bigO.LINEAR * 20);
    expect(prev).toBeGreaterThan(0);
  });

  it('should sorted.length to be the same as original data', () => {
    // const magnitude = 1000;
    // const maxPriorityQueue = new MaxPriorityQueue<number>({nodes: Array.from(new Array<number>(magnitude), () => Math.floor(Math.random() * magnitude))});
    // const nodeCount = maxPriorityQueue.getNodes().length;
    // const sorted = maxPriorityQueue.sort();
    //
    // expect(sorted.length).toBe(nodeCount); // TODO Plan to support sorting of duplicate elements.
  });
});
