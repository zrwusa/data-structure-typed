import { Comparator, MaxHeap } from '../../../../src';

describe('MaxHeap', () => {
  const numberComparator: Comparator<number> = (a, b) => b - a;
  let maxHeap: MaxHeap<number>;

  beforeEach(() => {
    maxHeap = new MaxHeap<number>([], { comparator: numberComparator });
  });

  it('add and poll elements in descending order', () => {
    maxHeap.add(3);
    maxHeap.add(1);
    maxHeap.add(4);
    maxHeap.add(2);

    expect(maxHeap.poll()).toBe(4);
    expect(maxHeap.poll()).toBe(3);
    expect(maxHeap.poll()).toBe(2);
    expect(maxHeap.poll()).toBe(1);
  });

  it('peek at the top element without removing it', () => {
    maxHeap.add(3);
    maxHeap.add(1);
    maxHeap.add(4);
    maxHeap.add(2);

    expect(maxHeap.peek()).toBe(4);
    expect(maxHeap.size).toBe(4);
  });

  it('sort elements in descending order', () => {
    maxHeap.add(3);
    maxHeap.add(1);
    maxHeap.add(4);
    maxHeap.add(2);

    const sortedArray = maxHeap.sort();
    expect(sortedArray).toEqual([4, 3, 2, 1]);
  });

  it('check if the heap is empty', () => {
    expect(maxHeap.isEmpty()).toBe(true);

    maxHeap.add(5);
    expect(maxHeap.isEmpty()).toBe(false);

    maxHeap.poll();
    expect(maxHeap.isEmpty()).toBe(true);
  });

  it('should object heap map & filter', function () {
    const maxHeap = new MaxHeap<{ a: string; key: number }>(
      [
        { key: 1, a: 'a1' },
        { key: 6, a: 'a6' },
        { key: 5, a: 'a5' },
        { key: 3, a: 'a3' },
        { key: 2, a: 'a2' },
        { key: 4, a: 'a4' },
        { key: 0, a: 'a0' }
      ],
      { comparator: (a, b) => b.key - a.key }
    );

    const mappedMaxHeap = maxHeap.map(
      item => item.key,
      (a, b) => b - a
    );
    expect(mappedMaxHeap.peek()).toBe(6);
    expect(mappedMaxHeap.sort()).toEqual([6, 5, 4, 3, 2, 1, 0]);

    const mappedToElementFnMaxHeap = maxHeap.map<
      string,
      {
        id: string;
      }
    >(
      item => item.key.toString(),
      (a, b) => Number(b) - Number(a),
      rawElement => rawElement.id
    );
    expect(mappedToElementFnMaxHeap.peek()).toBe('6');
    expect(mappedToElementFnMaxHeap.sort()).toEqual(['6', '5', '4', '3', '2', '1', '0']);

    const filteredHeap = maxHeap.filter(item => item.key > 3);
    expect(filteredHeap.peek()).toEqual({ a: 'a6', key: 6 });
    expect(filteredHeap.sort()).toEqual([
      { a: 'a6', key: 6 },
      { a: 'a5', key: 5 },
      { a: 'a4', key: 4 }
    ]);
  });
});
