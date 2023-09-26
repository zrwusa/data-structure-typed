import {Queue, LinkedListQueue} from '../../../../src';
import {bigO, magnitude} from '../../../utils';

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

describe('Queue Performance Test', () => {
  it('should numeric queue performance well', function () {
    const queue = new Queue<number>();
    for (let i = 0; i < magnitude.LINEAR; i++) {
      queue.enqueue(i);
    }
    let last: number | undefined = 0;

    const startTime = performance.now();
    for (let i = 0; i < magnitude.LINEAR; i++) {
      last = queue.dequeue();
    }
    expect(last).toBe(magnitude.LINEAR - 1);
    expect(performance.now() - startTime).toBeLessThan(bigO.LINEAR * 100);
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

  // it('should shift elements from the front of the queue', () => {
  //   queue.push(1);
  //   queue.push(2);
  //   const shifted = queue.shift();
  //   expect(shifted).toBe(1);
  //   expect(queue.peek()).toBe(2);
  //   expect(queue.size).toBe(1);
  // });
  //
  // it('should peek at the front of the queue', () => {
  //   queue.push(1);
  //   queue.push(2);
  //   expect(queue.peek()).toBe(1);
  // });

  // Add more test cases for other methods of Queue.
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
    expect(queue.peekLast()).toBe(2);
  });

  it('should shift elements from the front of the queue', () => {
    queue.push(1);
    queue.push(2);
    const shifted = queue.shift();
    expect(shifted).toBe(1);
    expect(queue.size).toBe(1);
    expect(queue.peek()).toBe(2);
    expect(queue.peekLast()).toBe(2);
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
    expect(queue.peekLast()).toBe(2);
  });

  it('should handle shifting when the queue is empty', () => {
    const shifted = queue.shift();
    expect(shifted).toBeUndefined();
    expect(queue.size).toBe(0);
    expect(queue.peek()).toBeUndefined();
  });

  it('should handle peeking when the queue is empty', () => {
    expect(queue.peek()).toBeUndefined();
    expect(queue.peekLast()).toBeUndefined();
  });

  it('should handle clearing the queue', () => {
    for (let i = 1; i <= 3; i++) {
      queue.push(i);
    }
    queue.clear();
    expect(queue.size).toBe(0);
    expect(queue.peek()).toBeUndefined();
    expect(queue.peekLast()).toBeUndefined();
  });

  it('should clone the queue', () => {
    for (let i = 1; i <= 3; i++) {
      queue.push(i);
    }
    const clonedQueue = queue.clone();
    expect(clonedQueue.size).toBe(3);
    expect(clonedQueue.peek()).toBe(1);
    expect(clonedQueue.peekLast()).toBe(3);
  });

  it('should handle creating a queue from an array', () => {
    const elements = [1, 2, 3, 4, 5];
    const newQueue = Queue.fromArray(elements);
    expect(newQueue.size).toBe(5);
    expect(newQueue.peek()).toBe(1);
    expect(newQueue.peekLast()).toBe(5);
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

  // Add more test cases for other methods of LinkedListQueue.
});
