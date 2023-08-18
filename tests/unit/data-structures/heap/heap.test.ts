import {HeapItem, MaxHeap, MinHeap} from '../../../../src';

describe('Heap Test1', () => {
    it('should numeric Min Heap operations be proper', function () {
        const minNumHeap = new MinHeap<number>();
        expect(minNumHeap).toBeInstanceOf(MinHeap);

        minNumHeap.add(1);
        expect(minNumHeap.has(1)).toBe(true);
        minNumHeap.add(6);
        expect(minNumHeap.has(2)).toBe(false);
        expect(minNumHeap.has(6)).toBe(true);
        minNumHeap.add(2);
        expect(minNumHeap.has(2)).toBe(true);
        minNumHeap.add(0);
        expect(minNumHeap.has(0)).toBe(true);
        minNumHeap.add(5);
        expect(minNumHeap.has(5)).toBe(true);
        minNumHeap.add(9);
        expect(minNumHeap.has(9)).toBe(true);
        expect(minNumHeap.size).toBe(6);

        const poll1 = minNumHeap.poll();
        expect(poll1).toBeInstanceOf(HeapItem<number>)
        poll1 instanceof HeapItem && expect(poll1.val).toBe(0);

        const poll2 = minNumHeap.poll();
        expect(poll2).toBeInstanceOf(HeapItem<number>)
        poll2 instanceof HeapItem && expect(poll2.val).toBe(1);

        const peek1 = minNumHeap.peek();
        expect(peek1).toBeInstanceOf(HeapItem<number>)
        peek1 instanceof HeapItem && expect(peek1.val).toBe(2);

        const heapArray = minNumHeap.toArray();
        expect(heapArray).toBeInstanceOf(Array<HeapItem>);
        expect(heapArray.map(item => item.priority)).toEqual([2, 5, 9, 6]);
        expect(minNumHeap.size).toBe(4);
    });

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

    it('should object Min Heap operations be proper', function () {
        class MyObject {
            keyA: string;

            constructor(keyA: string) {
                this.keyA = keyA;
            }
        }

        const minObjHeap = new MinHeap<MyObject>();

        const obj1 = new MyObject('a1'), obj6 = new MyObject('a6'), obj2 = new MyObject('a2'),
            obj0 = new MyObject('a0');
        minObjHeap.add(obj1, 1);
        expect(minObjHeap.has(obj1)).toBe(true);
        expect(minObjHeap.has(obj6)).toBe(false);
        minObjHeap.add(obj6, 6);
        expect(minObjHeap.has(obj6)).toBe(true);
        minObjHeap.add(obj2, 2);
        expect(minObjHeap.has(obj2)).toBe(true);
        minObjHeap.add(obj0, 0);
        expect(minObjHeap.has(obj0)).toBe(true);

        const peek = minObjHeap.peek();
        peek && peek.val && expect(peek.val.keyA).toBe('a0');

        const heapToArr = minObjHeap.toArray();
        expect(heapToArr.map(item => item.val?.keyA)).toEqual(['a0', 'a1', 'a2', 'a6']);

        const values = ['a0', 'a1', 'a2', 'a6'];
        let i = 0;
        while (minObjHeap.size > 0) {
            const polled = minObjHeap.poll();
            expect(polled).toBeInstanceOf(HeapItem<MyObject>);
            polled && expect(polled.val).toBeInstanceOf(MyObject);
            polled && polled.val && expect(polled.val.keyA).toBe(values[i]);
            i++;
        }
    });
});