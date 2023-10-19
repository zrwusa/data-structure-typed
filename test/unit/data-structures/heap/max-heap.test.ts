import {HeapComparator, MaxHeap} from '../../../../src';

describe('MaxHeap', () => {
  const numberComparator: HeapComparator<number> = (a, b) => b - a;
  let maxHeap: MaxHeap<number>;

  beforeEach(() => {
    maxHeap = new MaxHeap(numberComparator);
  });

  test('add and poll elements in descending order', () => {
    maxHeap.add(3);
    maxHeap.add(1);
    maxHeap.add(4);
    maxHeap.add(2);

    expect(maxHeap.poll()).toBe(4);
    expect(maxHeap.poll()).toBe(3);
    expect(maxHeap.poll()).toBe(2);
    expect(maxHeap.poll()).toBe(1);
  });

  test('peek at the top element without removing it', () => {
    maxHeap.add(3);
    maxHeap.add(1);
    maxHeap.add(4);
    maxHeap.add(2);

    expect(maxHeap.peek()).toBe(4);
    expect(maxHeap.size).toBe(4);
  });

  test('sort elements in descending order', () => {
    maxHeap.add(3);
    maxHeap.add(1);
    maxHeap.add(4);
    maxHeap.add(2);

    const sortedArray = maxHeap.sort();
    expect(sortedArray).toEqual([4, 3, 2, 1]);
  });

  test('check if the heap is empty', () => {
    expect(maxHeap.isEmpty()).toBe(true);

    maxHeap.add(5);
    expect(maxHeap.isEmpty()).toBe(false);

    maxHeap.poll();
    expect(maxHeap.isEmpty()).toBe(true);
  });
});
