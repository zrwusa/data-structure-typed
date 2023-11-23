import { LinkedListQueue, Queue } from '../../../../src';
import { bigO } from '../../../utils';
import { isDebugTest } from '../../../config';

const isDebug = isDebugTest;
describe('Queue Operation Test', () => {
  it('should validate a queue', () => {
    const queue = new Queue<number>();
    for (let i = 0; i < 1000; i++) {
      queue.enqueue(i);
    }
    let last: number | undefined = 0;
    for (let i = 0; i < 1000; i++) {
      last = queue.dequeue();
    }
    expect(last).toBe(999);
  });
});

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  it('should initialize an empty queue', () => {
    expect(queue.size).toBe(0);
  });

  it('should push elements to the end of the queue', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.peek()).toBe(1);
    expect(queue.size).toBe(2);
  });
});

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  it('should initialize an empty queue', () => {
    expect(queue.size).toBe(0);
    expect(queue.isEmpty()).toBe(true);
  });

  it('should push elements to the end of the queue', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.size).toBe(2);
    expect(queue.peek()).toBe(1);
    expect(queue.getLast()).toBe(2);
  });

  it('should shift elements from the front of the queue', () => {
    queue.push(1);
    queue.push(2);
    const shifted = queue.shift();
    expect(shifted).toBe(1);
    expect(queue.size).toBe(1);
    expect(queue.peek()).toBe(2);
    expect(queue.getLast()).toBe(2);
  });

  it('should handle shifting when queue reaches half size', () => {
    for (let i = 1; i <= 5; i++) {
      queue.push(i);
    }
    for (let i = 1; i <= 3; i++) {
      queue.shift();
    }
    // Queue size should be 2, but internal array size is still 5.
    // Test that shifting optimizes the internal array.
    expect(queue.size).toBe(2);
    expect(queue.nodes.length).toBe(2);
    expect(queue.peek()).toBe(4);
  });

  it('should peek at the front and end of the queue', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.peek()).toBe(1);
    expect(queue.getLast()).toBe(2);
  });

  it('should handle shifting when the queue is empty', () => {
    const shifted = queue.shift();
    expect(shifted).toBeUndefined();
    expect(queue.size).toBe(0);
    expect(queue.peek()).toBeUndefined();
  });

  it('should handle peeking when the queue is empty', () => {
    expect(queue.peek()).toBeUndefined();
    expect(queue.getLast()).toBeUndefined();
  });

  it('should handle clearing the queue', () => {
    for (let i = 1; i <= 3; i++) {
      queue.push(i);
    }
    queue.clear();
    expect(queue.size).toBe(0);
    expect(queue.peek()).toBeUndefined();
    expect(queue.getLast()).toBeUndefined();
  });

  it('should clone the queue', () => {
    for (let i = 1; i <= 3; i++) {
      queue.push(i);
    }
    const clonedQueue = queue.clone();
    expect(clonedQueue.size).toBe(3);
    expect(clonedQueue.peek()).toBe(1);
    expect(clonedQueue.getLast()).toBe(3);
  });

  it('should handle creating a queue from an array', () => {
    const elements = [1, 2, 3, 4, 5];
    const newQueue = Queue.fromArray(elements);
    expect(newQueue.size).toBe(5);
    expect(newQueue.peek()).toBe(1);
    expect(newQueue.getLast()).toBe(5);
  });

  it('should iterate through the queue', () => {
    for (let i = 1; i <= 3; i++) {
      queue.push(i);
    }
    const values = Array.from(queue);
    expect(values).toEqual([1, 2, 3]);
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
    expect(queue.length).toBe(2);
  });

  it('should dequeue elements from the front of the queue', () => {
    queue.enqueue('A');
    queue.enqueue('B');
    const dequeued = queue.dequeue();
    expect(dequeued).toBe('A');
    expect(queue.peek()).toBe('B');
    expect(queue.length).toBe(1);
  });

  it('should peek at the front of the queue', () => {
    queue.enqueue('A');
    queue.enqueue('B');
    expect(queue.peek()).toBe('A');
  });
});

describe('Queue Performance Test', () => {
  const dataSize = 10000;
  it('should numeric queue be efficient', function () {
    const startTime = performance.now();
    const queue = new Queue<number>();
    for (let i = 0; i < dataSize; i++) {
      queue.enqueue(i);
    }
    for (let i = 0; i < dataSize; i++) {
      queue.dequeue();
    }
    isDebug && console.log(`Queue Performance Test: ${performance.now() - startTime} ms`);
    expect(performance.now() - startTime).toBeLessThan(bigO.LINEAR * 100);
  });

  it('should numeric Array be more efficient than Queue when the data size is 10000', function () {
    const startTime2 = performance.now();
    const queue2: number[] = [];
    for (let i = 0; i < dataSize; i++) {
      queue2.push(i);
    }
    for (let i = 0; i < dataSize; i++) {
      queue2.shift();
    }
    expect(performance.now() - startTime2).toBeLessThan(bigO.CUBED * 100);
  });

  it('should numeric LinkedListQueue be efficient', function () {
    const startTime = performance.now();
    const queue = new LinkedListQueue<number>();
    for (let i = 0; i < dataSize; i++) {
      queue.enqueue(i);
    }
    for (let i = 0; i < dataSize; i++) {
      queue.dequeue();
    }
    // console.log(`LinkedListQueue Performance Test: ${performance.now() - startTime} ms`);
    expect(performance.now() - startTime).toBeLessThan(bigO.LINEAR * 100);
  });
});


describe('Queue iterative methods', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue();
    for (let i = 0; i < 10; i++) {
      queue.enqueue(i);
    }
  });

  test('iterator should provide access to all elements', () => {
    const elements = [];
    for (const item of queue) {
      elements.push(item);
    }
    expect(elements).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('forEach should apply the callback to each element', () => {
    const elements: number[] = [];
    queue.forEach((element) => elements.push(element * 2));
    expect(elements).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
  });

  test('filter should return a new queue with only the elements that satisfy the predicate', () => {
    const filteredQueue = queue.filter(element => element % 2 === 0);
    expect([...filteredQueue]).toEqual([0, 2, 4, 6, 8]);
  });

  test('map should return a new queue with the transformed elements', () => {
    const mappedQueue = queue.map(element => element * 2);
    expect([...mappedQueue]).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
  });

});