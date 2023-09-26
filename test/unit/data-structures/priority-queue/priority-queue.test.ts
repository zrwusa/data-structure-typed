import {PriorityQueue} from '../../../../src';
import {getRandomInt} from '../../../utils';

describe('PriorityQueue Operation Test', () => {
  it('should validate a priority queue', () => {
    const minPQ = new PriorityQueue<number>({nodes: [1, 5, 7, 9, 3, 6, 2], comparator: (a, b) => a - b});

    expect(minPQ.isValid()).toBe(true);
    expect(PriorityQueue.isPriorityQueueified({nodes: minPQ.nodes, comparator: (a, b) => a - b})).toBe(true);
    expect(PriorityQueue.isPriorityQueueified({nodes: minPQ.nodes, comparator: (a, b) => b - a})).toBe(false);
    expect(
      PriorityQueue.isPriorityQueueified({
        nodes: [1, 5, 7, 9, 3, 6, 2],
        comparator: (a, b) => b - a
      })
    ).toBe(false);
  });
});

describe('Priority Queue Performance Test', () => {
  it('should numeric heap work well', function () {
    const values = Array.from(new Array(10000), () => getRandomInt(1, 10000000));
    const minPriorityQueue = new PriorityQueue<number>({nodes: values, comparator: (a, b) => a - b});
    const sorted = minPriorityQueue.sort();
    expect(sorted).toEqual(values.sort((a, b) => a - b));
  });
});
