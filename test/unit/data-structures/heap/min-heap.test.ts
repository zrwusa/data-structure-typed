import { Comparator, MinHeap } from '../../../../src';

describe('classic use', () => {
  it('@example Merge K sorted arrays', () => {
    const arrays = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
    ];

    // Use min heap to merge: track (value, arrayIndex, elementIndex)
    const heap = new MinHeap<[number, number, number]>([], {
      comparator: (a, b) => a[0] - b[0]
    });

    // Initialize with first element of each array
    arrays.forEach((arr, i) => heap.add([arr[0], i, 0]));

    const merged: number[] = [];
    while (heap.size > 0) {
      const [val, arrIdx, elemIdx] = heap.poll()!;
      merged.push(val);
      if (elemIdx + 1 < arrays[arrIdx].length) {
        heap.add([arrays[arrIdx][elemIdx + 1], arrIdx, elemIdx + 1]);
      }
    }

    expect(merged).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('@example Dijkstra-style shortest distance tracking', () => {
    // Simulating distance updates: (distance, nodeId)
    const heap = new MinHeap<[number, string]>([], {
      comparator: (a, b) => a[0] - b[0]
    });

    heap.add([0, 'start']);
    heap.add([10, 'A']);
    heap.add([5, 'B']);
    heap.add([3, 'C']);

    // Process nearest node first
    expect(heap.poll()).toEqual([0, 'start']);
    expect(heap.poll()).toEqual([3, 'C']);
    expect(heap.poll()).toEqual([5, 'B']);
    expect(heap.poll()).toEqual([10, 'A']);
  });

  it('@example Running median with min heap (upper half)', () => {
    const upperHalf = new MinHeap<number>();

    // Add larger numbers to min heap
    for (const n of [5, 8, 3, 9, 1]) {
      upperHalf.add(n);
    }

    // Smallest of the upper half is always accessible
    expect(upperHalf.peek()).toBe(1);
    expect(upperHalf.size).toBe(5);

    // Remove smallest repeatedly
    expect(upperHalf.poll()).toBe(1);
    expect(upperHalf.poll()).toBe(3);
    expect(upperHalf.peek()).toBe(5);
  });
});

describe('MinHeap', () => {
  const numberComparator: Comparator<number> = (a, b) => a - b;
  let minHeap: MinHeap<number>;

  beforeEach(() => {
    minHeap = new MinHeap<number>([], {
      comparator: numberComparator
    });
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

  it('should clone', function () {
    const minHeap = new MinHeap<string>();
    minHeap.add('1');
    minHeap.add('6');
    minHeap.add('2');
    minHeap.add('0');
    minHeap.add('5');
    minHeap.add('9');
    minHeap.delete('2');
    expect([...minHeap]).toEqual(['0', '1', '9', '6', '5']);
    const cloned = minHeap.clone();
    expect([...cloned]).toEqual(['0', '1', '9', '6', '5']);
    minHeap.delete('5');
    expect([...minHeap]).toEqual(['0', '1', '9', '6']);
    expect([...cloned]).toEqual(['0', '1', '9', '6', '5']);
  });

  it('check if the heap is empty', () => {
    expect(minHeap.isEmpty()).toBe(true);

    minHeap.add(5);
    expect(minHeap.isEmpty()).toBe(false);

    minHeap.poll();
    expect(minHeap.isEmpty()).toBe(true);
  });

  const n = 100000;

  it('should push & dfs', () => {
    for (let i = 0; i < n; i++) {
      minHeap.add(i);
    }
    expect(minHeap.dfs()[0]).toBe(0);
    expect(minHeap.dfs()[999]).toBe(4126);
  });
});

describe('Heap iterative methods', () => {
  let heap: MinHeap<number>;

  beforeEach(() => {
    heap = new MinHeap<number>();
    for (let i = 1; i <= 10; i++) {
      heap.add(i * 10); // Add 10, 20, ..., 100
    }
  });

  it('Heap is iterable', () => {
    expect([...heap]).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  });

  it('forEach method calls a function for each element', () => {
    const mockCallback = jest.fn();
    heap.forEach(mockCallback);
    expect(mockCallback.mock.calls.length).toBe(10);
  });

  it('filter method returns filtered elements', () => {
    const result = heap.filter(x => x > 50);
    expect([...result]).toEqual([60, 70, 80, 90, 100]);
  });

  it('map method correctly maps elements', () => {
    const result = heap.map(x => x / 10, { comparator: (a: number, b: number) => a - b });
    expect([...result]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('reduce method correctly reduces elements', () => {
    const result = heap.reduce((acc, curr) => acc + curr, 0);
    expect(result).toBe(550); // 10+20+...+100 = 550
  });
});
