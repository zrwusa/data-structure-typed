import { MaxPriorityQueue } from '../../../../src';

describe('MaxPriorityQueue Operation Test', () => {
  it('should add elements and maintain heap property', () => {
    const priorityQueue = new MaxPriorityQueue<number>();

    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);
    priorityQueue.add(1);

    expect(priorityQueue.poll()).toBe(7);
    expect(priorityQueue.poll()).toBe(5);
    expect(priorityQueue.poll()).toBe(3);
    expect(priorityQueue.poll()).toBe(1);
  });

  it('should add elements and maintain heap property in a object MaxPriorityQueue', () => {
    const priorityQueue = new MaxPriorityQueue<{
      keyA: number;
    }>([], {
      comparator: (a, b) => b.keyA - a.keyA
    });
    priorityQueue.refill([{ keyA: 5 }, { keyA: 3 }, { keyA: 1 }]);
    priorityQueue.add({ keyA: 7 });

    expect(priorityQueue.poll()?.keyA).toBe(7);
    expect(priorityQueue.poll()?.keyA).toBe(5);
    expect(priorityQueue.poll()?.keyA).toBe(3);
    expect(priorityQueue.poll()?.keyA).toBe(1);
  });

  it('should return and delete the smallest element', () => {
    const priorityQueue = new MaxPriorityQueue<number>();
    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);

    expect(priorityQueue.poll()).toBe(7);
    expect(priorityQueue.poll()).toBe(5);
    expect(priorityQueue.size).toBe(1);
  });

  it('should create a clone of the priority queue', () => {
    const priorityQueue = new MaxPriorityQueue<number>();
    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);

    const clone = priorityQueue.clone();
    expect(clone.poll()).toBe(7);
    expect(clone.poll()).toBe(5);
    expect(clone.poll()).toBe(3);
    expect(clone.isEmpty()).toBe(true);
  });

  it('should correctly heapify an array', () => {
    const array = [5, 3, 7, 1];
    const heap = MaxPriorityQueue.heapify<number>(array, {
      comparator: (a, b) => b - a
    });
    heap.refill(array);

    expect(heap.poll()).toBe(7);
    expect(heap.poll()).toBe(5);
    expect(heap.poll()).toBe(3);
    expect(heap.poll()).toBe(1);
  });

  it('should correctly heapify an object array', () => {
    const elements = [{ keyA: 5 }, { keyA: 3 }, { keyA: 7 }, { keyA: 1 }];
    debugger;
    const maxPQ = MaxPriorityQueue.heapify<{
      keyA: number;
    }>(elements, {
      comparator: (a, b) => b.keyA - a.keyA
    });

    expect(maxPQ.poll()?.keyA).toBe(7);
    expect(maxPQ.poll()?.keyA).toBe(5);
    expect(maxPQ.poll()?.keyA).toBe(3);
    expect(maxPQ.poll()?.keyA).toBe(1);
  });

  it('should object priority queue', () => {
    const maxPQ = new MaxPriorityQueue<{
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
        comparator: (a, b) => b.rawItem.id - a.rawItem.id
      }
    );

    expect([...maxPQ.sort()]).toEqual([
      { rawItem: { id: 8 } },
      { rawItem: { id: 7 } },
      { rawItem: { id: 6 } },
      { rawItem: { id: 5 } },
      { rawItem: { id: 4 } },
      { rawItem: { id: 3 } },
      { rawItem: { id: 1 } }
    ]);
  });

  it('should toElementFn', () => {
    const maxPQ = new MaxPriorityQueue<number, { rawItem: { id: number } }>(
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

    expect([...maxPQ.sort()]).toEqual([8, 7, 6, 5, 4, 3, 1]);
  });

  it('should MaxPriorityQueue filter, map work well', function () {
    const minPQ2 = new MaxPriorityQueue<number>([]);
    minPQ2.refill([2, 5, 8, 1, 6, 7, 4]);

    const cloned = minPQ2.clone();
    const filtered = cloned.filter(item => item % 2 === 1);
    expect(filtered instanceof MaxPriorityQueue).toBe(true);
    expect([...filtered]).toEqual([7, 1, 5]);

    const mapped = filtered.map(
      item => ({ key: item }),
      (a, b) => b.key - a.key
    );
    expect(mapped instanceof MaxPriorityQueue).toBe(true);
    expect([...mapped]).toEqual([{ key: 7 }, { key: 1 }, { key: 5 }]);
  });

  it('should MaxPriorityQueue throw an error while initialed with object data', function () {
    expect(() => {
      new MaxPriorityQueue<{ key: number }>([{ key: 7 }, { key: 1 }, { key: 7 }]);
    }).toThrow(
      "When comparing object types, a custom comparator must be defined in the constructor's options parameter."
    );
  });

  it('should MaxPriorityQueue comparator return 0 when equal values are added', function () {
    const duplicated = new MaxPriorityQueue<number>([7, 1, 7, 7]);
    expect(duplicated.size).toBe(4);
    expect([...duplicated]).toEqual([7, 7, 7, 1]);
  });
});
