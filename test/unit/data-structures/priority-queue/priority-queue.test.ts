import {PriorityQueue} from '../../../../src';
import {getRandomInt} from '../../../utils';

describe('PriorityQueue Operation Test', () => {
  it('should PriorityQueue poll, pee, heapify, toArray work well', function () {
    const minPQ = new PriorityQueue<number>((a, b) => a - b);
    minPQ.refill([5, 2, 3, 4, 6, 1]);
    expect(minPQ.toArray()).toEqual([1, 2, 3, 4, 6, 5]);
    minPQ.poll();
    minPQ.poll();
    minPQ.poll();
    expect(minPQ.toArray()).toEqual([4, 5, 6]);
    expect(minPQ.peek()).toBe(4);
    expect(PriorityQueue.heapify([3, 2, 1, 5, 6, 7, 8, 9, 10], (a, b) => a - b).toArray()).toEqual([
      1, 2, 3, 5, 6, 7, 8, 9, 10
    ]);
  });

  it('should Max PriorityQueue poll, peek, heapify, toArray work well', function () {
    const maxPriorityQueue = new PriorityQueue<number>((a, b) => b - a);
    maxPriorityQueue.refill([5, 2, 3, 4, 6, 1]);
    expect(maxPriorityQueue.toArray()).toEqual([6, 5, 3, 4, 2, 1]);
    maxPriorityQueue.poll();
    maxPriorityQueue.poll();
    maxPriorityQueue.poll();
    expect(maxPriorityQueue.toArray()).toEqual([3, 2, 1]);
    expect(maxPriorityQueue.peek()).toBe(3);
    expect(PriorityQueue.heapify([3, 2, 1, 5, 6, 7, 8, 9, 10], (a, b) => a - b).toArray()).toEqual([
      1, 2, 3, 5, 6, 7, 8, 9, 10
    ]);
  });

  it('should PriorityQueue clone, sort, getNodes, dfs work well', function () {
    const minPQ1 = new PriorityQueue<number>((a, b) => a - b);
    minPQ1.refill([2, 5, 8, 3, 1, 6, 7, 4]);
    const clonedPriorityQueue = minPQ1.clone();
    expect(clonedPriorityQueue.getNodes()).toEqual(minPQ1.getNodes());
    expect(clonedPriorityQueue.sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(minPQ1.dfs('in')).toEqual([4, 3, 2, 5, 1, 8, 6, 7]);
    expect(minPQ1.dfs('post')).toEqual([4, 3, 5, 2, 8, 7, 6, 1]);
    expect(minPQ1.dfs('pre')).toEqual([1, 2, 3, 4, 5, 6, 8, 7]);
  });
});

describe('Priority Queue Performance Test', () => {
  it('should numeric heap work well', function () {
    const values = Array.from(new Array(10000), () => getRandomInt(1, 10000000));
    const minPriorityQueue = new PriorityQueue<number>((a, b) => a - b);
    minPriorityQueue.refill(values);
    const sorted = minPriorityQueue.sort();
    expect(sorted).toEqual(values.sort((a, b) => a - b));
  });
});
