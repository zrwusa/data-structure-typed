import { FibonacciHeap, Heap, MaxHeap, MinHeap } from '../../../../src';
import { logBigOMetricsWrap } from '../../../utils';

describe('Heap Operation Test', () => {
  it('should initiate heap', function () {
    const hp = new Heap<number>();
    hp.add(1);
    expect(hp.size).toBe(1);
  });

  it('should heap add and delete work well', function () {
    const hp = new MinHeap<number>();
    expect(hp.delete(1)).toBe(false);
    hp.add(2);
    hp.add(3);
    hp.add(1);
    hp.add(4);
    hp.add(6);
    hp.add(5);
    hp.add(7);

    hp.delete(4);
    hp.delete(7);
    hp.delete(1);

    expect(hp.size).toBe(4);
    expect(hp.peek()).toBe(2);
  });

  it('should numeric heap work well', function () {
    const minNumHeap = new MinHeap<number>();
    expect(minNumHeap.poll()).toBe(undefined);
    minNumHeap.add(1);
    minNumHeap.add(6);
    minNumHeap.add(2);
    minNumHeap.add(0);
    minNumHeap.add(5);
    minNumHeap.add(9);
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

  it('should clone', function () {
    const minNumHeap = new Heap<string>([], {
      comparator: (a, b) => Number(a) - Number(b)
    });
    minNumHeap.add('1');
    minNumHeap.add('6');
    minNumHeap.add('2');
    minNumHeap.add('0');
    minNumHeap.add('5');
    minNumHeap.add('9');
    minNumHeap.delete('2');
    expect([...minNumHeap]).toEqual(['0', '1', '9', '6', '5']);
    const cloned = minNumHeap.clone();
    expect([...cloned]).toEqual(['0', '1', '9', '6', '5']);
    minNumHeap.delete('5');
    expect([...minNumHeap]).toEqual(['0', '1', '9', '6']);
    expect([...cloned]).toEqual(['0', '1', '9', '6', '5']);
  });

  it('should object heap work well', function () {
    const minHeap = new MinHeap<{
      a: string;
      key: number;
    }>([], {
      comparator: (a, b) => a.key - b.key
    });
    minHeap.add({ key: 1, a: 'a1' });
    minHeap.add({ key: 6, a: 'a6' });
    minHeap.add({ key: 2, a: 'a2' });
    minHeap.add({ key: 0, a: 'a0' });

    expect(minHeap.peek()).toEqual({
      a: 'a0',
      key: 0
    });
    expect(minHeap.toArray().map(item => ({ a: item.a }))).toEqual([
      { a: 'a0' },
      { a: 'a1' },
      { a: 'a2' },
      { a: 'a6' }
    ]);
    let i = 0;
    const expectPolled = [{ a: 'a0' }, { a: 'a1' }, { a: 'a2' }, { a: 'a6' }];
    while (minHeap.size > 0) {
      expect({
        a: minHeap.poll()?.a
      }).toEqual(expectPolled[i]);
      i++;
    }

    const maxHeap = new MaxHeap<{
      key: number;
      a: string;
    }>([], {
      comparator: (a, b) => b.key - a.key
    });
    maxHeap.add({ key: 1, a: 'a1' });
    maxHeap.add({ key: 6, a: 'a6' });
    maxHeap.add({ key: 5, a: 'a5' });
    maxHeap.add({ key: 2, a: 'a2' });
    maxHeap.add({ key: 0, a: 'a0' });
    maxHeap.add({ key: 9, a: 'a9' });
    expect(maxHeap.peek()).toEqual({
      a: 'a9',
      key: 9
    });
    expect(maxHeap.toArray().map(item => ({ a: item.a }))).toEqual([
      { a: 'a9' },
      { a: 'a2' },
      { a: 'a6' },
      { a: 'a1' },
      { a: 'a0' },
      { a: 'a5' }
    ]);
    const maxExpectPolled = [{ a: 'a9' }, { a: 'a6' }, { a: 'a5' }, { a: 'a2' }, { a: 'a1' }, { a: 'a0' }];
    let maxI = 0;
    while (maxHeap.size > 0) {
      expect({
        a: maxHeap.poll()?.a
      }).toEqual(maxExpectPolled[maxI]);
      maxI++;
    }
  });

  it('should object heap map & filter', function () {
    const minHeap = new MinHeap<{
      a: string;
      key: number;
    }>(
      [
        { key: 1, a: 'a1' },
        { key: 6, a: 'a6' },
        { key: 5, a: 'a5' },
        { key: 3, a: 'a3' },
        { key: 2, a: 'a2' },
        { key: 4, a: 'a4' },
        { key: 0, a: 'a0' }
      ],
      {
        comparator: (a, b) => a.key - b.key
      }
    );

    const mappedMinHeap = minHeap.map(
      item => item.key,
      (a, b) => a - b
    );
    expect(mappedMinHeap.peek()).toBe(0);
    expect(mappedMinHeap.sort()).toEqual([0, 1, 2, 3, 4, 5, 6]);

    const mappedToElementFnMinHeap = minHeap.map<string, { id: string }>(
      item => item.key.toString(),
      (a, b) => Number(a) - Number(b),
      rawElement => rawElement.id
    );
    expect(mappedToElementFnMinHeap.peek()).toBe('0');
    expect(mappedToElementFnMinHeap.sort()).toEqual(['0', '1', '2', '3', '4', '5', '6']);

    const filteredHeap = minHeap.filter(item => item.key > 3);
    expect(filteredHeap.peek()).toEqual({ a: 'a4', key: 4 });
    expect(filteredHeap.sort()).toEqual([
      { a: 'a4', key: 4 },
      { a: 'a5', key: 5 },
      { a: 'a6', key: 6 }
    ]);
  });

  it('should object heap', () => {
    const heap = new Heap<{
      rawItem: { id: number };
    }>(
      [
        { rawItem: { id: 4 } },
        { rawItem: { id: 8 } },
        { rawItem: { id: 6 } },
        { rawItem: { id: 7 } },
        { rawItem: { id: 1 } },
        { rawItem: { id: 3 } },
        { rawItem: { id: 5 } }
      ],
      {
        comparator: (a, b) => a.rawItem.id - b.rawItem.id
      }
    );

    expect([...heap.sort()]).toEqual([
      { rawItem: { id: 1 } },
      { rawItem: { id: 3 } },
      { rawItem: { id: 4 } },
      { rawItem: { id: 5 } },
      { rawItem: { id: 6 } },
      { rawItem: { id: 7 } },
      { rawItem: { id: 8 } }
    ]);
  });

  it('should toElementFn', () => {
    const heap = new Heap<number, { rawItem: { id: number } }>(
      [
        { rawItem: { id: 4 } },
        { rawItem: { id: 8 } },
        { rawItem: { id: 6 } },
        { rawItem: { id: 7 } },
        { rawItem: { id: 1 } },
        { rawItem: { id: 3 } },
        { rawItem: { id: 5 } }
      ],
      {
        toElementFn: rawElement => rawElement.rawItem.id
      }
    );

    expect([...heap.sort()]).toEqual([1, 3, 4, 5, 6, 7, 8]);
  });

  it('should getter leaf', function () {
    const hp = new Heap<number>();
    expect(hp.leaf).toBe(undefined);
    hp.add(1);
    expect(hp.leaf).toBe(1);
  });

  it('should error', function () {
    expect(() => {
      new Heap([{ key: 1 }, { key: 2 }, { key: 3 }]);
    }).toThrow(
      "When comparing object types, a custom comparator must be defined in the constructor's options parameter."
    );
  });
});

describe('Heap HOF', () => {
  let hp: Heap;

  beforeEach(() => {
    hp = new Heap([{ key: 1 }, { key: 2 }, { key: 3 }], { comparator: (a, b) => a.key - b.key });
  });

  it('should filter', () => {
    const filtered = hp.filter(({ key }) => key % 2 === 1);
    expect([...filtered]).toEqual([{ key: 1 }, { key: 3 }]);
  });

  it('should map', () => {
    const mapped = hp.map(
      ({ key }) => [key, key],
      (a, b) => a[0] - b[0]
    );
    expect([...mapped]).toEqual([
      [1, 1],
      [2, 2],
      [3, 3]
    ]);
  });
});
describe('FibonacciHeap', () => {
  let heap: FibonacciHeap<number>;

  beforeEach(() => {
    heap = new FibonacciHeap<number>();
  });

  it('push & peek', () => {
    heap.push(10);
    heap.push(5);
    expect(heap.peek()).toBe(5);
  });

  it('pop', () => {
    heap.push(10);
    heap.push(5);
    heap.push(15);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(10);
    expect(heap.pop()).toBe(15);
  });

  it('pop on an empty heap', () => {
    expect(heap.pop()).toBeUndefined();
  });

  it('size', () => {
    expect(heap.size).toBe(0);
    heap.push(10);
    expect(heap.size).toBe(1);
    heap.pop();
    expect(heap.size).toBe(0);
  });

  it('clear', () => {
    heap.push(10);
    heap.push(5);
    heap.clear();
    expect(heap.size).toBe(0);
    expect(heap.peek()).toBeUndefined();
  });

  it('custom comparator', () => {
    const maxHeap = new FibonacciHeap<number>((a, b) => b - a);
    maxHeap.push(10);
    maxHeap.push(5);
    expect(maxHeap.peek()).toBe(10);
  });
});

describe('FibonacciHeap', () => {
  let heap: FibonacciHeap<number>;

  beforeEach(() => {
    heap = new FibonacciHeap<number>();
  });

  it('should initialize an empty heap', () => {
    expect(heap.size).toBe(0);
    expect(heap.peek()).toBeUndefined();
  });

  it('should push items into the heap and update size', () => {
    heap.push(10);
    heap.push(5);

    expect(heap.size).toBe(2);
  });

  it('should peek the minimum item', () => {
    heap.push(10);
    heap.push(5);
    heap.push(15);

    expect(heap.peek()).toBe(5);
  });

  it('should pop the minimum item and update size', () => {
    heap.push(10);
    heap.push(5);
    heap.push(15);

    const minItem = heap.pop();

    expect(minItem).toBe(5);
    expect(heap.size).toBe(2);
  });

  it('should correctly merge two heaps', () => {
    const heap1 = new FibonacciHeap<number>();
    const heap2 = new FibonacciHeap<number>();

    heap1.push(10);
    heap2.push(5);

    heap1.merge(heap2);

    expect(heap1.size).toBe(2);
    expect(heap1.peek()).toBe(5);
  });

  it('should clear the heap', () => {
    heap.push(10);
    heap.push(5);

    heap.clear();

    expect(heap.size).toBe(0);
    expect(heap.peek()).toBeUndefined();
  });

  it('should handle custom comparators', () => {
    const customComparator = (a: number, b: number) => b - a;
    const customHeap = new FibonacciHeap<number>(customComparator);

    customHeap.push(10);
    customHeap.push(5);
    customHeap.push(15);

    expect(customHeap.peek()).toBe(15);
  });

  describe('FibonacciHeap Merge', () => {
    it('should merge two Fibonacci heaps correctly', () => {
      const heap1 = new FibonacciHeap<number>();
      heap1.push(5).push(10);

      const heap2 = new FibonacciHeap<number>();
      heap2.push(3).push(7);

      heap1.merge(heap2);

      expect(heap1.size).toBe(4); // Combined size of both heaps
      expect(heap2.size).toBe(0); // Merged heap should be empty
      expect(heap1.peek()).toBe(3); // Minimum element should be 3
    });
  });
});

describe('FibonacciHeap Stress Test', () => {
  it('should handle a large number of elements efficiently', () => {
    const testByMagnitude = (magnitude: number) => {
      const heap = new FibonacciHeap<number>();

      // Add 1000 elements to the heap
      for (let i = 1; i <= magnitude; i++) {
        heap.push(i);
      }

      // Verify that the minimum element is 1 (smallest element)
      expect(heap.peek()).toBe(1);

      // Remove all 1000 elements from the heap
      const elements = [];
      while (heap.size > 0) {
        elements.push(heap.pop());
      }

      // Verify that all elements were removed in ascending order
      for (let i = 1; i <= magnitude; i++) {
        expect(elements[i - 1]).toBe(i);
      }

      // Verify that the heap is now empty
      expect(heap.size).toBe(0);
    };

    testByMagnitude(1000);

    // [
    //   10, 100, 1000, 5000, 10000, 20000, 50000, 75000, 100000,
    //   150000, 200000, 250000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000
    // ].forEach(m => logBigOMetricsWrap<typeof testByMagnitude>(testByMagnitude, [m]));
    // [
    //   10, 100, 1000, 5000, 10000, 20000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 600000,
    //   700000, 800000, 900000, 1000000
    // ]
    [10, 100, 1000, 5000].forEach(m =>
      logBigOMetricsWrap(
        (c: number) => {
          const result: number[] = [];
          for (let i = 0; i < c; i++) result.push(i);
          return result;
        },
        [m],
        'loopPush'
      )
    );
  });
});

describe('classic use', () => {
  it('heap sort', () => {
    function heapSort(arr: number[]): number[] {
      const heap = new Heap<number>(arr, { comparator: (a, b) => a - b });
      const sorted: number[] = [];
      while (!heap.isEmpty()) {
        sorted.push(heap.poll()!); // Poll minimum element
      }
      return sorted;
    }

    const array = [5, 3, 8, 4, 1, 2];
    expect(heapSort(array)).toEqual([1, 2, 3, 4, 5, 8]);
  });

  it('top k', () => {
    function topKElements(arr: number[], k: number): number[] {
      const heap = new Heap<number>([], { comparator: (a, b) => b - a }); // Max heap
      arr.forEach(num => {
        heap.add(num);
        if (heap.size > k) heap.poll(); // Keep the heap size at K
      });
      return heap.toArray();
    }

    const numbers = [10, 30, 20, 5, 15, 25];
    console.log('Top K:', topKElements(numbers, 3)); // [15, 10, 5]
    expect(topKElements(numbers, 3)).toEqual([15, 10, 5]);
  });

  it('merge sorted sequences', () => {
    function mergeSortedSequences(sequences: number[][]): number[] {
      const heap = new Heap<{ value: number; seqIndex: number; itemIndex: number }>([], {
        comparator: (a, b) => a.value - b.value // Min heap
      });

      // Initialize heap
      sequences.forEach((seq, seqIndex) => {
        if (seq.length) {
          heap.add({ value: seq[0], seqIndex, itemIndex: 0 });
        }
      });

      const merged: number[] = [];
      while (!heap.isEmpty()) {
        const { value, seqIndex, itemIndex } = heap.poll()!;
        merged.push(value);

        if (itemIndex + 1 < sequences[seqIndex].length) {
          heap.add({
            value: sequences[seqIndex][itemIndex + 1],
            seqIndex,
            itemIndex: itemIndex + 1
          });
        }
      }

      return merged;
    }

    const sequences = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
    ];
    console.log('Merged Sequences:', mergeSortedSequences(sequences)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
    expect(mergeSortedSequences(sequences)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('@example median finder', () => {
    class MedianFinder {
      private low: MaxHeap<number>; // Max heap, stores the smaller half
      private high: MinHeap<number>; // Min heap, stores the larger half

      constructor() {
        this.low = new MaxHeap<number>([]);
        this.high = new MinHeap<number>([]);
      }

      addNum(num: number): void {
        if (this.low.isEmpty() || num <= this.low.peek()!) this.low.add(num);
        else this.high.add(num);

        // Balance heaps
        if (this.low.size > this.high.size + 1) this.high.add(this.low.poll()!);
        else if (this.high.size > this.low.size) this.low.add(this.high.poll()!);
      }

      findMedian(): number {
        return this.low.peek()!;
      }
    }

    const medianFinder = new MedianFinder();
    medianFinder.addNum(10);
    expect(medianFinder.findMedian()).toBe(10);
    medianFinder.addNum(20);
    expect(medianFinder.findMedian()).toBe(10);
    medianFinder.addNum(30);
    expect(medianFinder.findMedian()).toBe(20);
    medianFinder.addNum(40);
    expect(medianFinder.findMedian()).toBe(20);
    medianFinder.addNum(50);
    expect(medianFinder.findMedian()).toBe(30);
  });

  it('schedule tasks', () => {
    type Task = [string, number];

    function scheduleTasks(tasks: Task[], machines: number): Map<number, Task[]> {
      const machineHeap = new Heap<{ id: number; load: number }>([], { comparator: (a, b) => a.load - b.load }); // Min heap
      const allocation = new Map<number, Task[]>();

      // Initialize the load on each machine
      for (let i = 0; i < machines; i++) {
        machineHeap.add({ id: i, load: 0 });
        allocation.set(i, []);
      }

      // Assign tasks
      tasks.forEach(([task, load]) => {
        const machine = machineHeap.poll()!;
        allocation.get(machine.id)!.push([task, load]);
        machine.load += load;
        machineHeap.add(machine); // The machine after updating the load is re-entered into the heap
      });

      return allocation;
    }

    const tasks: Task[] = [
      ['Task1', 3],
      ['Task2', 1],
      ['Task3', 2],
      ['Task4', 5],
      ['Task5', 4]
    ];
    const expectedMap = new Map<number, Task[]>();
    expectedMap.set(0, [
      ['Task1', 3],
      ['Task4', 5]
    ]);
    expectedMap.set(1, [
      ['Task2', 1],
      ['Task3', 2],
      ['Task5', 4]
    ]);
    expect(scheduleTasks(tasks, 2)).toEqual(expectedMap);
  });

  it('@example Use Heap for load balancing', () => {
    function loadBalance(requests: number[], servers: number): number[] {
      const serverHeap = new Heap<{ id: number; load: number }>([], { comparator: (a, b) => a.load - b.load }); // min heap
      const serverLoads = new Array(servers).fill(0);

      for (let i = 0; i < servers; i++) {
        serverHeap.add({ id: i, load: 0 });
      }

      requests.forEach(req => {
        const server = serverHeap.poll()!;
        serverLoads[server.id] += req;
        server.load += req;
        serverHeap.add(server); // The server after updating the load is re-entered into the heap
      });

      return serverLoads;
    }

    const requests = [5, 2, 8, 3, 7];
    const serversLoads = loadBalance(requests, 3);
    expect(serversLoads).toEqual([12, 8, 5]);
  });
});
