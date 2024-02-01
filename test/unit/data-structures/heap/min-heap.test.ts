import { Comparator, MinHeap } from '../../../../src';

describe('MinHeap', () => {
  const numberComparator: Comparator<number> = (a, b) => a - b;
  let minHeap: MinHeap<number>;

  beforeEach(() => {
    minHeap = new MinHeap<number>([], { comparator: numberComparator });
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

  test('Heap is iterable', () => {
    expect([...heap]).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  });

  test('forEach method calls a function for each element', () => {
    const mockCallback = jest.fn();
    heap.forEach(mockCallback);
    expect(mockCallback.mock.calls.length).toBe(10);
  });

  test('filter method returns filtered elements', () => {
    const result = heap.filter(x => x > 50);
    expect([...result]).toEqual([60, 70, 80, 90, 100]);
  });

  test('map method correctly maps elements', () => {
    const result = heap.map(
      x => x / 10,
      (a: number, b: number) => a - b
    );
    expect([...result]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('reduce method correctly reduces elements', () => {
    const result = heap.reduce((acc, curr) => acc + curr, 0);
    expect(result).toBe(550); // 10+20+...+100 = 550
  });
});
