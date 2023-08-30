import {MinPriorityQueue, PriorityQueue} from '../../../../src';

describe('MinPriorityQueue Operation Test', () => {

    it('should check if a node exists in the queue', () => {
        const priorityQueue = new MinPriorityQueue<number>();
        priorityQueue.add(5);

        expect(priorityQueue.has(5)).toBe(true);
        expect(priorityQueue.has(3)).toBe(false);
    });

    it('should return the smallest element without removing it', () => {
        const priorityQueue = new MinPriorityQueue<number>();
        priorityQueue.add(5);
        priorityQueue.add(3);
        priorityQueue.add(7);

        expect(priorityQueue.peek()).toBe(3);
        expect(priorityQueue.size).toBe(3);
    });


    it('should return the last element', () => {
        const priorityQueue = new MinPriorityQueue<number>();
        priorityQueue.add(5);
        priorityQueue.add(3);
        priorityQueue.add(7);

        expect(priorityQueue.leaf()).toBe(7);
    });

    it('should check if the queue is empty', () => {
        const priorityQueue = new MinPriorityQueue<number>();

        expect(priorityQueue.isEmpty()).toBe(true);

        priorityQueue.add(5);

        expect(priorityQueue.isEmpty()).toBe(false);
    });

    it('should clear the queue', () => {
        const priorityQueue = new MinPriorityQueue<number>();
        priorityQueue.add(5);
        priorityQueue.add(3);
        priorityQueue.add(7);

        priorityQueue.clear();

        expect(priorityQueue.size).toBe(0);
        expect(priorityQueue.isEmpty()).toBe(true);
    });


    it('should sort the elements', () => {
        const priorityQueue = new MinPriorityQueue<number>();
        priorityQueue.add(5);
        priorityQueue.add(3);
        priorityQueue.add(7);
        priorityQueue.add(1);

        const sortedArray = priorityQueue.sort();
        expect(sortedArray).toEqual([1, 3, 5, 7]);
    });

    it('should PriorityQueue poll, pee, heapify, toArray work well', function () {
        const minPQ = new PriorityQueue<number>({nodes: [5, 2, 3, 4, 6, 1], comparator: (a, b) => a - b});
        expect(minPQ.toArray()).toEqual([1, 2, 3, 4, 6, 5]);
        minPQ.poll();
        minPQ.poll();
        minPQ.poll();
        expect(minPQ.toArray()).toEqual([4, 5, 6]);
        expect(minPQ.peek()).toBe(4);
        expect(PriorityQueue.heapify({
            nodes: [3, 2, 1, 5, 6, 7, 8, 9, 10],
            comparator: (a, b) => a - b
        }).toArray()).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 10]);
    });

    it('should Max PriorityQueue poll, peek, heapify, toArray work well', function () {
        const maxPriorityQueue = new PriorityQueue<number>({nodes: [5, 2, 3, 4, 6, 1], comparator: (a, b) => b - a});
        expect(maxPriorityQueue.toArray()).toEqual([6, 5, 3, 4, 2, 1]);
        maxPriorityQueue.poll();
        maxPriorityQueue.poll();
        maxPriorityQueue.poll();
        expect(maxPriorityQueue.toArray()).toEqual([3, 2, 1]);
        expect(maxPriorityQueue.peek()).toBe(3);
        expect(PriorityQueue.heapify({
            nodes: [3, 2, 1, 5, 6, 7, 8, 9, 10],
            comparator: (a, b) => a - b
        }).toArray()).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 10]);
    });

    it('should PriorityQueue clone, sort, getNodes, DFS work well', function () {
        const minPQ1 = new PriorityQueue<number>({nodes: [2, 5, 8, 3, 1, 6, 7, 4], comparator: (a, b) => a - b});
        const clonedPriorityQueue = minPQ1.clone();
        expect(clonedPriorityQueue.getNodes()).toEqual(minPQ1.getNodes());
        expect(clonedPriorityQueue.sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
        expect(minPQ1.DFS('in')).toEqual([4, 3, 2, 5, 1, 8, 6, 7]);
        expect(minPQ1.DFS('post')).toEqual([4, 3, 5, 2, 8, 7, 6, 1]);
        expect(minPQ1.DFS('pre')).toEqual([1, 2, 3, 4, 5, 6, 8, 7]);
    });

});