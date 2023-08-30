import {MaxHeap, MinHeap} from '../../../../src';

describe('Heap Operation Test', () => {
    it('should numeric heap work well', function () {
        const minNumHeap = new MinHeap<number>();
        minNumHeap.add(1).add(6).add(2).add(0).add(5).add(9);
        expect(minNumHeap.poll()).toBe(0);
        expect(minNumHeap.poll()).toBe(1);
        expect(minNumHeap.peek()).toBe(2);
        expect(minNumHeap.toArray().length).toBe(4);
        expect(minNumHeap.toArray()[0]).toBe(2);
        expect(minNumHeap.toArray()[1]).toBe(5);
        expect(minNumHeap.toArray()[2]).toBe(9);
        expect(minNumHeap.toArray()[3]).toBe(6);


    });

    it('should object heap work well', function () {
        const minHeap = new MinHeap<{ a: string }>();
        minHeap.add(1, {a: 'a1'});
        minHeap.add(6, {a: 'a6'});
        minHeap.add(2, {a: 'a2'});
        minHeap.add(0, {a: 'a0'});

        expect(minHeap.peek()).toEqual({a: 'a0'});
        expect(minHeap.toArray()).toEqual(([{'a': 'a0'}, {'a': 'a1'}, {'a': 'a2'}, {'a': 'a6'}]));
        let i = 0;
        const expectPolled = [{'a': 'a0'}, {'a': 'a1'}, {'a': 'a2'}, {'a': 'a6'}];
        while (minHeap.size > 0) {
            expect(minHeap.poll()).toEqual(expectPolled[i]);
            i++;
        }

        const maxHeap = new MaxHeap<{ a: string }>();
        maxHeap.add(1, {a: 'a1'});
        maxHeap.add(6, {a: 'a6'});
        maxHeap.add(5, {a: 'a5'});
        maxHeap.add(2, {a: 'a2'});
        maxHeap.add(0, {a: 'a0'});
        maxHeap.add(9, {a: 'a9'});
        expect(maxHeap.peek()).toEqual({'a': 'a9'});
        expect(maxHeap.toArray()).toEqual([{'a': 'a9'}, {'a': 'a2'}, {'a': 'a6'}, {'a': 'a1'}, {'a': 'a0'}, {'a': 'a5'}]);
        const maxExpectPolled = [{'a': 'a9'}, {'a': 'a6'}, {'a': 'a5'}, {'a': 'a2'}, {'a': 'a1'}, {'a': 'a0'}];
        let maxI = 0;
        while (maxHeap.size > 0) {
            expect(maxHeap.poll()).toEqual(maxExpectPolled[maxI]);
            maxI++;
        }
    });
});

