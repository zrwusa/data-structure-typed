import {MaxHeap, MinHeap} from '../../../../src';

describe('Heap Operation Test', () => {
  it('should numeric heap work well', function () {
    const minNumHeap = new MinHeap<number>();
    minNumHeap.add(1).add(6).add(2).add(0).add(5).add(9);
    expect(minNumHeap.has(1)).toBe(true);
    expect(minNumHeap.has(2)).toBe(true);
    expect(minNumHeap.poll()).toBe(0);
    expect(minNumHeap.poll()).toBe(1);
    expect(minNumHeap.peek()).toBe(2);
    expect(!minNumHeap.has(1));
    expect(minNumHeap.has(2));
    const arrFromHeap = minNumHeap.toArray();
    expect(arrFromHeap.length).toBe(4);
    expect(arrFromHeap[0]).toBe(2);
    expect(arrFromHeap[1]).toBe(5);
    expect(arrFromHeap[2]).toBe(9);
    expect(arrFromHeap[3]).toBe(6);
    expect(minNumHeap.sort()).toEqual([2, 5, 6, 9]);
  });

  it('should object heap work well', function () {
    const minHeap = new MinHeap<{a: string; key: number}>((a, b) => a.key - b.key);
    minHeap.add({key: 1, a: 'a1'});
    minHeap.add({key: 6, a: 'a6'});
    minHeap.add({key: 2, a: 'a2'});
    minHeap.add({key: 0, a: 'a0'});

    expect(minHeap.peek()).toEqual({a: 'a0', key: 0});
    expect(minHeap.toArray().map(item => ({a: item.a}))).toEqual([{a: 'a0'}, {a: 'a1'}, {a: 'a2'}, {a: 'a6'}]);
    let i = 0;
    const expectPolled = [{a: 'a0'}, {a: 'a1'}, {a: 'a2'}, {a: 'a6'}];
    while (minHeap.size > 0) {
      expect({a: minHeap.poll()?.a}).toEqual(expectPolled[i]);
      i++;
    }

    const maxHeap = new MaxHeap<{key: number; a: string}>((a, b) => b.key - a.key);
    maxHeap.add({key: 1, a: 'a1'});
    maxHeap.add({key: 6, a: 'a6'});
    maxHeap.add({key: 5, a: 'a5'});
    maxHeap.add({key: 2, a: 'a2'});
    maxHeap.add({key: 0, a: 'a0'});
    maxHeap.add({key: 9, a: 'a9'});
    expect(maxHeap.peek()).toEqual({a: 'a9', key: 9});
    expect(maxHeap.toArray().map(item => ({a: item.a}))).toEqual([
      {a: 'a9'},
      {a: 'a2'},
      {a: 'a6'},
      {a: 'a1'},
      {a: 'a0'},
      {a: 'a5'}
    ]);
    const maxExpectPolled = [{a: 'a9'}, {a: 'a6'}, {a: 'a5'}, {a: 'a2'}, {a: 'a1'}, {a: 'a0'}];
    let maxI = 0;
    while (maxHeap.size > 0) {
      expect({a: maxHeap.poll()?.a}).toEqual(maxExpectPolled[maxI]);
      maxI++;
    }
  });
});
