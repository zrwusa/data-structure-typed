import {PriorityQueue} from '../../../../src';

describe('PriorityQueue Test1', () => {

    it('should validate a priority queue', () => {
        const minPQ = new PriorityQueue<number>({nodes: [1, 5, 7, 9, 3, 6, 2], comparator: (a, b) => a - b});

        expect(minPQ.isValid()).toBe(true);
        expect(PriorityQueue.isPriorityQueueified({nodes: minPQ.nodes, comparator: (a, b) => a - b})).toBe(true);
        expect(PriorityQueue.isPriorityQueueified({nodes: minPQ.nodes, comparator: (a, b) => b - a})).toBe(false);
        expect(PriorityQueue.isPriorityQueueified({
            nodes: [1, 5, 7, 9, 3, 6, 2],
            comparator: (a, b) => b - a
        })).toBe(false);
    });
});