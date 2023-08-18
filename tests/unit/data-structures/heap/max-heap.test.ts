import {HeapItem, MaxHeap} from '../../../../src';

describe('MaxHeap Test1', () => {

    it('should object Max Heap operations be proper', function () {
        const maxHeap = new MaxHeap<{ keyA: string }>();
        const myObj1 = {keyA: 'a1'}, myObj6 = {keyA: 'a6'}, myObj5 = {keyA: 'a5'}, myObj2 = {keyA: 'a2'},
            myObj0 = {keyA: 'a0'}, myObj9 = {keyA: 'a9'};
        maxHeap.add(myObj1, 1);
        expect(maxHeap.has(myObj1)).toBe(true);
        expect(maxHeap.has(myObj9)).toBe(false);
        maxHeap.add(myObj6, 6);
        expect(maxHeap.has(myObj6)).toBe(true);
        maxHeap.add(myObj5, 5);
        expect(maxHeap.has(myObj5)).toBe(true);
        maxHeap.add(myObj2, 2);
        expect(maxHeap.has(myObj2)).toBe(true);
        expect(maxHeap.has(myObj6)).toBe(true);
        maxHeap.add(myObj0, 0);
        expect(maxHeap.has(myObj0)).toBe(true);
        expect(maxHeap.has(myObj9)).toBe(false);
        maxHeap.add(myObj9, 9);
        expect(maxHeap.has(myObj9)).toBe(true);

        const peek9 = maxHeap.peek();
        peek9 && peek9.val && expect(peek9.val.keyA).toBe('a9');

        const heapToArr = maxHeap.toArray();
        expect(heapToArr.map(item => item.val?.keyA)).toEqual(['a9', 'a2', 'a6', 'a1', 'a0', 'a5']);

        const values = ['a9', 'a6', 'a5', 'a2', 'a1', 'a0'];
        let i = 0;
        while (maxHeap.size > 0) {
            const polled = maxHeap.poll();
            expect(polled).toBeInstanceOf(HeapItem<{ keyA: string }>);
            polled && expect(polled.val).toHaveProperty('keyA');
            polled && polled.val && expect(polled.val.keyA).toBe(values[i]);
            i++;
        }
    });

});