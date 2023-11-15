import {Comparator, MinHeap} from '../../../../src';

describe('MinHeap', () => {
  const numberComparator: Comparator<number> = (a, b) => a - b;
  let minHeap: MinHeap<number>;

  beforeEach(() => {
    minHeap = new MinHeap({comparator: numberComparator});
  });

  it('add and poll elements in ascending order', () => {
    minHeap.add(3);
    minHeap.add(1);
    minHeap.add(4);
    minHeap.add(2);

    expect(minHeap.poll()).toBe(1);
    expect(minHeap.poll()).toBe(2);
    expect(minHeap.poll()).toBe(3);
    expect(minHeap.poll()).toBe(4);
  });

  it('peek at the top element without removing it', () => {
    minHeap.add(3);
    minHeap.add(1);
    minHeap.add(4);
    minHeap.add(2);

    expect(minHeap.peek()).toBe(1);
    expect(minHeap.size).toBe(4);
  });

  it('sort elements in ascending order', () => {
    minHeap.add(3);
    minHeap.add(1);
    minHeap.add(4);
    minHeap.add(2);

    const sortedArray = minHeap.sort();
    expect(sortedArray).toEqual([1, 2, 3, 4]);
  });

  it('check if the heap is empty', () => {
    expect(minHeap.isEmpty()).toBe(true);

    minHeap.add(5);
    expect(minHeap.isEmpty()).toBe(false);

    minHeap.poll();
    expect(minHeap.isEmpty()).toBe(true);
  });
});
