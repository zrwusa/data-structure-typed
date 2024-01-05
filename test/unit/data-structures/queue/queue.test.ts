import { LinkedListQueue, Queue } from '../../../../src';
// import { isDebugTest } from '../../../config';

// const isDebug = isDebugTest;

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  test('new Queue() should create an empty queue', () => {
    expect(queue.size).toBe(0);
    expect(queue.isEmpty()).toBeTruthy();
  });

  test('push should add elements to the queue', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.size).toBe(2);
  });

  test('shift should remove the first element', () => {
    queue.push(1);
    queue.enqueue(2);
    expect(queue.shift()).toBe(1);
    expect(queue.size).toBe(1);
  });

  test('shift should return undefined if queue is empty', () => {
    expect(queue.dequeue()).toBeUndefined();
  });

  test('peek should return the first element without removing it', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.peek()).toBe(1);
    expect(queue.size).toBe(2);
  });

  test('peek should return undefined if queue is empty', () => {
    expect(queue.peek()).toBeUndefined();
  });

  test('size should return the number of elements', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.size).toBe(2);
  });

  test('isEmpty should return true if the queue is empty', () => {
    expect(queue.isEmpty()).toBeTruthy();
  });

  test('isEmpty should return false if the queue is not empty', () => {
    queue.push(1);
    expect(queue.isEmpty()).toBeFalsy();
  });

  test('toArray should return an array of queue elements', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.toArray()).toEqual([1, 2]);
  });

  test('clear should remove all elements from the queue', () => {
    queue.push(1);
    queue.push(2);
    queue.clear();
    expect(queue.size).toBe(0);
  });

  test('forEach should iterate over all elements', () => {
    const arr: number[] = [];
    queue.push(1);
    queue.push(2);
    queue.forEach(element => arr.push(element));
    expect(arr).toEqual([1, 2]);
  });

  // Boundary value testing
  test('push and shift with many elements', () => {
    for (let i = 0; i < 1000; i++) {
      queue.push(i);
    }
    for (let i = 0; i < 1000; i++) {
      expect(queue.shift()).toBe(i);
    }
    expect(queue.isEmpty()).toBeTruthy();
  });

  it('should clone', function () {
    const queue = new Queue<string>();
    queue.push('1');
    queue.push('6');
    queue.push('2');
    queue.push('0');
    queue.push('5');
    queue.push('9');
    queue.delete('2');
    expect([...queue]).toEqual(['1', '6', '0', '5', '9']);
    const cloned = queue.clone();
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
    queue.delete('5');
    expect([...queue]).toEqual(['1', '6', '0', '9']);
    queue.deleteAt(2);
    expect([...queue]).toEqual(['1', '6', '9']);
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
  });
});

describe('Queue - Advanced Methods', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  test('reduce should apply a function against an accumulator and each element', () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);
    const sum = queue.reduce((acc, val) => acc + val, 0);
    expect(sum).toBe(6);
  });

  test('reduce should return initial value for empty queue', () => {
    const initialValue = 0;
    const sum = queue.reduce((acc, val) => acc + val, initialValue);
    expect(sum).toBe(initialValue);
  });

  test('filter should return a new queue with all elements that pass the test implemented by provided function', () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);
    const filteredQueue = queue.filter(val => val > 1);
    expect(filteredQueue.toArray()).toEqual([2, 3]);
  });

  test('filter should return an empty queue for empty queue', () => {
    const filteredQueue = queue.filter(val => val > 1);
    expect(filteredQueue.isEmpty()).toBeTruthy();
  });

  test('map should create a new queue with the results of calling a provided function on every element', () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);
    const mappedQueue = queue.map(val => val * 2);
    expect(mappedQueue.toArray()).toEqual([2, 4, 6]);
  });

  test('map should return an empty queue for empty queue', () => {
    const mappedQueue = queue.map(val => val * 2);
    expect(mappedQueue.isEmpty()).toBeTruthy();
  });
});
describe('Queue - Additional Methods', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  test('peekLast should return the last element without removing it', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.peekLast()).toBe(2);
    expect(queue.size).toBe(2);
  });

  test('peekLast should return undefined if queue is empty', () => {
    expect(queue.peekLast()).toBeUndefined();
  });

  test('at should return the element at the specified index', () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);
    expect(queue.at(1)).toBe(2);
  });

  test('at should return undefined for an invalid index', () => {
    queue.push(1);
    expect(queue.at(3)).toBeUndefined();
    expect(queue.at(-1)).toBeUndefined();
  });

  test('print should not throw any errors', () => {
    expect(() => {
      queue.push(1);
      // queue.print();
    }).not.toThrow();
  });
});

describe('Queue - Static and Clone Methods', () => {
  test('fromArray should create a new queue from an array', () => {
    const array = [1, 2, 3];
    const queue = Queue.fromArray(array);
    expect(queue.toArray()).toEqual(array);
    expect(queue.size).toBe(array.length);
  });

  test('fromArray should create an empty queue from an empty array', () => {
    const queue = Queue.fromArray([]);
    expect(queue.isEmpty()).toBeTruthy();
  });

  test('clone should create a new queue with the same elements', () => {
    const originalQueue = new Queue<number>();
    originalQueue.push(1);
    originalQueue.push(2);

    const clonedQueue = originalQueue.clone();
    expect(clonedQueue.toArray()).toEqual(originalQueue.toArray());
    expect(clonedQueue.size).toBe(originalQueue.size);
  });

  test('clone should not affect the original queue when mutated', () => {
    const originalQueue = new Queue<number>();
    originalQueue.push(1);
    originalQueue.push(2);

    const clonedQueue = originalQueue.clone();
    clonedQueue.push(3);

    expect(clonedQueue.size).not.toBe(originalQueue.size);
    expect(originalQueue.toArray()).not.toContain(3);
  });
});

describe('LinkedListQueue', () => {
  let queue: LinkedListQueue<string>;

  beforeEach(() => {
    queue = new LinkedListQueue<string>();
  });

  it('should enqueue elements to the end of the queue', () => {
    queue.enqueue('A');
    queue.enqueue('B');
    expect(queue.peek()).toBe('A');
    expect(queue.size).toBe(2);
  });

  it('should dequeue elements from the front of the queue', () => {
    queue.enqueue('A');
    queue.enqueue('B');
    const dequeued = queue.dequeue();
    expect(dequeued).toBe('A');
    expect(queue.peek()).toBe('B');
    expect(queue.size).toBe(1);
  });

  it('should peek at the front of the queue', () => {
    queue.enqueue('A');
    queue.enqueue('B');
    expect(queue.peek()).toBe('A');
  });
});
