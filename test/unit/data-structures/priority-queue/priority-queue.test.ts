import { PriorityQueue } from '../../../../src';
import { PriorityQueue as CPriorityQueue } from 'js-sdsl';
import { isDebugTest } from '../../../config';

const isDebug = isDebugTest;
describe('PriorityQueue Operation Test', () => {
  it('should PriorityQueue poll, pee, heapify, toArray work well', function () {
    const minPQ = new PriorityQueue<number>([], { comparator: (a, b) => a - b });
    minPQ.refill([5, 2, 3, 4, 6, 1]);
    expect(minPQ.toArray()).toEqual([1, 2, 3, 4, 6, 5]);
    minPQ.poll();
    minPQ.poll();
    minPQ.poll();
    expect(minPQ.toArray()).toEqual([4, 5, 6]);
    expect(minPQ.peek()).toBe(4);
    expect(
      PriorityQueue.heapify([3, 2, 1, 5, 6, 7, 8, 9, 10], {
        comparator: (a, b) => a - b
      }).toArray()
    ).toEqual([1, 3, 2, 5, 6, 7, 8, 9, 10]);
  });

  it('should Max PriorityQueue poll, peek, heapify, toArray work well', function () {
    const maxPriorityQueue = new PriorityQueue<number>([], { comparator: (a, b) => b - a });
    maxPriorityQueue.refill([5, 2, 3, 4, 6, 1]);
    expect(maxPriorityQueue.toArray()).toEqual([6, 5, 3, 4, 2, 1]);
    maxPriorityQueue.poll();
    maxPriorityQueue.poll();
    maxPriorityQueue.poll();
    expect(maxPriorityQueue.toArray()).toEqual([3, 2, 1]);
    expect(maxPriorityQueue.peek()).toBe(3);
    expect(
      PriorityQueue.heapify([3, 2, 1, 5, 6, 7, 8, 9, 10], {
        comparator: (a, b) => a - b
      }).toArray()
    ).toEqual([1, 3, 2, 5, 6, 7, 8, 9, 10]);
  });

  it('should PriorityQueue clone, sort, getNodes, dfs work well', function () {
    const minPQ1 = new PriorityQueue<number>([], { comparator: (a, b) => a - b });
    minPQ1.refill([2, 5, 8, 3, 1, 6, 7, 4]);
    const clonedPriorityQueue = minPQ1.clone();
    expect(clonedPriorityQueue.elements).toEqual(minPQ1.elements);
    expect(clonedPriorityQueue.sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(minPQ1.dfs('IN')).toEqual([4, 3, 2, 5, 1, 8, 6, 7]);
    expect(minPQ1.dfs('POST')).toEqual([4, 3, 5, 2, 8, 7, 6, 1]);
    expect(minPQ1.dfs('PRE')).toEqual([1, 2, 3, 4, 5, 6, 8, 7]);
  });
});

describe('Priority Queue Performance Test', () => {
  it('should numeric heap work well', function () {
    const pq = new PriorityQueue<number>([], { comparator: (a, b) => b - a });

    const tS = performance.now();

    for (let i = 0; i < 100000; i++) {
      pq.add(i);
    }

    // for (let i = 0; i < 10000; i++) {
    //   pq.pop();
    // }
    isDebug && console.log(performance.now() - tS);
    isDebug && console.log(pq.size);
    const cS = performance.now();
    const cpq = new CPriorityQueue();

    for (let i = 0; i < 100000; i++) {
      cpq.push(i);
    }
    //
    // for (let i = 0; i < 10000; i++) {
    //   cpq.pop();
    // }
    isDebug && console.log(performance.now() - cS);
    isDebug && console.log(cpq.size());
  });
});
