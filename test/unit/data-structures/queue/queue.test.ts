import { LinkedListQueue, Queue } from '../../../../src';
// import { isDebugTest } from '../../../config';

// const isDebug = isDebugTest;

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  it('new Queue() should create an empty queue', () => {
    expect(queue.length).toBe(0);
    expect(queue.isEmpty()).toBeTruthy();
  });

  it('push should add elements to the queue', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.length).toBe(2);
  });

  it('shift should remove the first element', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.shift()).toBe(1);
    expect(queue.length).toBe(1);
  });

  it('shift should return undefined if queue is empty', () => {
    expect(queue.shift()).toBeUndefined();
  });

  it('first should return the first element without removing it', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.first).toBe(1);
    expect(queue.length).toBe(2);
  });

  it('first should return undefined if queue is empty', () => {
    expect(queue.first).toBeUndefined();
  });

  it('length should return the number of elements', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.length).toBe(2);
  });

  it('isEmpty should return true if the queue is empty', () => {
    expect(queue.isEmpty()).toBeTruthy();
  });

  it('isEmpty should return false if the queue is not empty', () => {
    queue.push(1);
    expect(queue.isEmpty()).toBeFalsy();
  });

  it('toArray should return an array of queue elements', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.toArray()).toEqual([1, 2]);
  });

  it('clear should remove all elements from the queue', () => {
    queue.push(1);
    queue.push(2);
    queue.clear();
    expect(queue.length).toBe(0);
  });

  it('forEach should iterate over all elements', () => {
    const arr: number[] = [];
    queue.push(1);
    queue.push(2);
    queue.forEach(element => arr.push(element));
    expect(arr).toEqual([1, 2]);
  });

  // Boundary value testing
  it('push and shift with many elements', () => {
    for (let i = 0; i < 1000; i++) {
      queue.push(i);
    }
    for (let i = 0; i < 1000; i++) {
      expect(queue.shift()).toBe(i);
    }
    expect(queue.isEmpty()).toBeTruthy();
  });

  it('push with maxLen', () => {
    const queue = new Queue<number>([], { maxLen: 10 });
    for (let i = 0; i < 1000; i++) {
      queue.push(i);
    }
    expect(queue.maxLen).toBe(10);
    expect(queue.length).toBe(10);
    expect(queue.first).toBe(990);
  });

  it('compact method should work well', () => {
    for (let i = 0; i < 1000; i++) queue.push(i);

    for (let i = 0; i < 499; i++) queue.shift();

    expect(queue.elements.length).toBe(1000);
    queue.compact();
    expect(queue.elements.length).toBe(501);
  });

  it('should at after shifting', () => {
    for (let i = 0; i < 100; i++) {
      queue.push(i);
    }

    for (let i = 0; i < 10; i++) {
      expect(queue.shift()).toBe(i);
    }

    for (let i = 0; i < 90; i++) {
      expect(queue.at(i)).toBe(i + 10);
    }
  });

  it('should toElementFn', () => {
    const queue = new Queue<string, { id: string }>([{ id: '1' }, { id: '5' }, { id: '3' }, { id: '4' }, { id: '2' }], {
      toElementFn: rawElement => rawElement.id
    });

    expect(queue.length).toBe(5);
    queue.shift();
    expect(queue.length).toBe(4);
    expect(queue.at(1)).toBe('3');
  });

  it('should object queue map & filter', function () {
    const queue = new Queue<{
      a: string;
      key: number;
    }>([
      { key: 1, a: 'a1' },
      { key: 6, a: 'a6' },
      { key: 5, a: 'a5' },
      { key: 3, a: 'a3' },
      { key: 2, a: 'a2' },
      { key: 4, a: 'a4' },
      { key: 0, a: 'a0' }
    ]);

    const mappedQueue = queue.map(item => item.key);
    expect(mappedQueue.at(0)).toBe(1);
    expect([...mappedQueue]).toEqual([1, 6, 5, 3, 2, 4, 0]);

    const mappedToElementFnQueue = queue.map<string, { id: string }>(item => item.key.toString(), {
      toElementFn: rawElement => rawElement.id
    });
    expect(mappedToElementFnQueue.at(0)).toBe('1');
    expect([...mappedToElementFnQueue]).toEqual(['1', '6', '5', '3', '2', '4', '0']);

    const filteredQueue = queue.filter(item => item.key > 3);
    expect(filteredQueue.at(0)).toEqual({ a: 'a6', key: 6 });
    expect([...filteredQueue]).toEqual([
      { a: 'a6', key: 6 },
      { a: 'a5', key: 5 },
      { a: 'a4', key: 4 }
    ]);
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

  it('should set autoCompactRatio', function () {
    const queue = new Queue<number>();

    queue.autoCompactRatio = 0.3;
    queue.push(1);
    queue.push(2);
    queue.push(3);
    queue.push(4);
    queue.push(5);
    queue.push(6);
    queue.push(7);
    queue.push(8);
    queue.push(9);
    queue.push(10);
    expect(queue.elements.length).toBe(10);
    while (queue.length > 7) queue.shift();
    expect(queue.length).toBe(7);
    expect(queue.elements.length).toBe(10);
    queue.shift();
    expect(queue.length).toBe(6);
    expect(queue.elements.length).toBe(6);
  });
});

describe('Queue - Advanced Methods', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  it('reduce should apply a function against an accumulator and each element', () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);
    const sum = queue.reduce((acc, val) => acc + val, 0);
    expect(sum).toBe(6);
  });

  it('reduce should return initial value for empty queue', () => {
    const initialValue = 0;
    const sum = queue.reduce((acc, val) => acc + val, initialValue);
    expect(sum).toBe(initialValue);
  });

  it('filter should return a new queue with all elements that pass the test implemented by provided function', () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);
    const filteredQueue = queue.filter(val => val > 1);
    expect(filteredQueue.toArray()).toEqual([2, 3]);
  });

  it('filter should return an empty queue for empty queue', () => {
    const filteredQueue = queue.filter(val => val > 1);
    expect(filteredQueue.isEmpty()).toBeTruthy();
  });

  it('map should create a new queue with the results of calling a provided function on every element', () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);
    const mappedQueue = queue.map(val => val * 2);
    expect(mappedQueue.toArray()).toEqual([2, 4, 6]);
  });

  it('map should return an empty queue for empty queue', () => {
    const mappedQueue = queue.map(val => val * 2);
    expect(mappedQueue.isEmpty()).toBeTruthy();
  });
});
describe('Queue - Additional Methods', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  it('peekLast should return the last element without removing it', () => {
    queue.push(1);
    queue.push(2);
    expect(queue.last).toBe(2);
    expect(queue.length).toBe(2);
  });

  it('peekLast should return undefined if queue is empty', () => {
    expect(queue.last).toBeUndefined();
  });

  it('at should return the element at the specified index', () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);
    expect(queue.at(1)).toBe(2);
  });

  it('at should return undefined for an invalid index', () => {
    queue.push(1);
    expect(queue.at(3)).toBeUndefined();
    expect(queue.at(-1)).toBeUndefined();
  });

  it('print should not throw any errors', () => {
    expect(() => {
      queue.push(1);
      // queue.print();
    }).not.toThrow();
  });
});

describe('Queue Additional Methods', () => {
  // Slice method implementation and test
  test('slice should return a new list with specified range', () => {
    const list = new Queue([1, 2, 3, 4, 5]);
    const slicedList = list.slice(1, 4);

    expect(slicedList.toArray()).toEqual([2, 3, 4]);
    expect(list.length).toBe(5); // Original list unchanged
  });

  // Splice method implementation
  test('splice should modify list and return removed elements', () => {
    const list = new Queue([1, 2, 3, 4, 5]);
    const removedList = list.splice(2, 2, 6, 7);

    expect(list.toArray()).toEqual([1, 2, 6, 7, 5]);
    expect(removedList.toArray()).toEqual([3, 4]);
  });

  // Concat method test
  test('concat should combine multiple lists', () => {
    const list1 = new Queue([1, 2]);
    const list2 = new Queue([3, 4]);
    const list3 = new Queue([5, 6]);

    const concatenatedList = list1.concat(list2, list3);
    expect(concatenatedList.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  // Sort method test
  test('sort should order elements in ascending order', () => {
    const list = new Queue([5, 2, 8, 1, 9]);
    list.sort((a, b) => a - b);

    expect(list.toArray()).toEqual([1, 2, 5, 8, 9]);
  });

  // Reverse method test
  test('reverse should invert the list order', () => {
    const list = new Queue([1, 2, 3, 4, 5]);
    list.reverse();

    expect(list.toArray()).toEqual([5, 4, 3, 2, 1]);
  });

  // Join method test
  test('join should convert list to string with separator', () => {
    const list = new Queue(['a', 'b', 'c']);

    expect(list.join('-')).toBe('a-b-c');
    expect(list.join()).toBe('a,b,c');
  });

  // IndexOf method test
  test('indexOf should return first occurrence index', () => {
    const list = new Queue([1, 2, 3, 2, 1]);

    expect(list.indexOf(2)).toBe(1);
    expect(list.indexOf(4)).toBe(-1);
  });

  // LastIndexOf method test
  test('lastIndexOf should return last occurrence index', () => {
    const list = new Queue([1, 2, 3, 2, 1]);

    expect(list.lastIndexOf(2)).toBe(3);
    expect(list.lastIndexOf(4)).toBe(-1);
  });

  // findIndex method test
  test('findIndex should return first occurrence index', () => {
    const list = new Queue([1, 2, 3, 2, 1]);
    expect(list.findIndex(item => item === 2)).toBe(1);
    expect(list.findIndex(item => item === 4)).toBe(-1);
  });

  // fill method test
  test('fill should return fill all the list', () => {
    let list = new Queue([1, 2, 3, 2, 1]);
    expect([...list.fill(9)]).toEqual([9, 9, 9, 9, 9]);
    list = new Queue([1, 2, 3, 2, 1]);
    expect([...list.fill(9, 2, 3)]).toEqual([1, 2, 9, 2, 1]);
    list = new Queue([1, 2, 3, 2, 1]);
    expect([...list.fill(9, -3, -2)]).toEqual([1, 2, 9, 2, 1]);
    list = new Queue([1, 2, 3, 2, 1]);
    expect([...list.fill(9, -2, -3)]).toEqual([1, 2, 3, 2, 1]);
  });
});

describe('Queue - Static and Clone Methods', () => {
  it('fromArray should create a new queue from an array', () => {
    const array = [1, 2, 3];
    const queue = Queue.fromArray(array);
    expect(queue.toArray()).toEqual(array);
    expect(queue.length).toBe(array.length);
  });

  it('fromArray should create an empty queue from an empty array', () => {
    const queue = Queue.fromArray([]);
    expect(queue.isEmpty()).toBeTruthy();
  });

  it('clone should create a new queue with the same elements', () => {
    const originalQueue = new Queue<number>();
    originalQueue.push(1);
    originalQueue.push(2);

    const clonedQueue = originalQueue.clone();
    expect(clonedQueue.toArray()).toEqual(originalQueue.toArray());
    expect(clonedQueue.length).toBe(originalQueue.length);
  });

  it('clone should not affect the original queue when mutated', () => {
    const originalQueue = new Queue<number>();
    originalQueue.push(1);
    originalQueue.push(2);

    const clonedQueue = originalQueue.clone();
    clonedQueue.push(3);

    expect(clonedQueue.length).not.toBe(originalQueue.length);
    expect(originalQueue.toArray()).not.toContain(3);
  });
});

describe('LinkedListQueue', () => {
  let queue: LinkedListQueue<string>;

  beforeEach(() => {
    queue = new LinkedListQueue<string>();
    queue.push('A');
    queue.push('B');
  });

  it('should push elements to the end of the queue', () => {
    expect(queue.first).toBe('A');
    expect(queue.length).toBe(2);
  });

  it('should shift elements from the front of the queue', () => {
    const dequeued = queue.shift();
    expect(dequeued).toBe('A');
    expect(queue.first).toBe('B');
    expect(queue.length).toBe(1);
  });

  it('should peek at the front of the queue', () => {
    expect(queue.first).toBe('A');
  });

  it('should clone method work correctly', () => {
    const cloned = queue.clone();
    expect(cloned instanceof LinkedListQueue).toBe(true);
    expect(cloned.length).toBe(2);
  });
});

describe('Queue', () => {
  // Test queue initialization
  it('should initialize correctly with no elements', () => {
    const queue = new Queue();
    expect(queue.isEmpty()).toBe(true);
    expect(queue.length).toBe(0);
    expect(queue.first).toBeUndefined();
    expect(queue.last).toBeUndefined();
  });

  it('should initialize correctly with given elements', () => {
    const queue = new Queue([1, 2, 3]);
    expect(queue.length).toBe(3);
    expect(queue.first).toBe(1);
    expect(queue.last).toBe(3);
  });

  // Test push and pushMany
  it('should add elements to the queue', () => {
    const queue = new Queue<number>();
    queue.push(1);
    queue.push(2);
    expect(queue.length).toBe(2);
    expect(queue.first).toBe(1);
    expect(queue.last).toBe(2);
  });

  it('should add multiple elements using pushMany', () => {
    const queue = new Queue<number>();
    queue.pushMany([1, 2, 3]);
    expect(queue.length).toBe(3);
    expect(queue.elements).toEqual([1, 2, 3]);
  });

  // Test shift
  it('should remove the first element from the queue', () => {
    const queue = new Queue([1, 2, 3]);
    const shifted = queue.shift();
    expect(shifted).toBe(1);
    expect(queue.length).toBe(2);
    expect(queue.first).toBe(2);
  });

  // Test delete and deleteAt
  it('should delete an element from the queue', () => {
    const queue = new Queue([1, 2, 3]);
    const result = queue.delete(2);
    expect(result).toBe(true);
    expect(queue.elements).toEqual([1, 3]);
  });

  it('should delete an element at a specific index', () => {
    const queue = new Queue([1, 2, 3]);
    const deleted = queue.deleteAt(1);
    expect(deleted).toBe(2);
    expect(queue.elements).toEqual([1, 3]);
  });

  // Test at
  it('should retrieve an element by index', () => {
    const queue = new Queue([1, 2, 3]);
    expect(queue.at(0)).toBe(1);
    expect(queue.at(2)).toBe(3);
  });

  // Test reverse
  it('should reverse the queue', () => {
    const queue = new Queue([1, 2, 3]);
    queue.reverse();
    expect(queue.elements).toEqual([3, 2, 1]);
    expect(queue.first).toBe(3);
    expect(queue.last).toBe(1);
  });

  // Test addAt
  it('should add an element at a specific index', () => {
    const queue = new Queue([1, 3]);
    const result = queue.addAt(1, 2);
    expect(result).toBe(true);
    expect(queue.elements).toEqual([1, 2, 3]);
  });

  // Test setAt
  it('should set an element at a specific index', () => {
    const queue = new Queue([1, 2, 3]);
    const result = queue.setAt(1, 10);
    expect(result).toBe(true);
    expect(queue.elements).toEqual([1, 10, 3]);
  });

  // Test clear
  it('should clear the queue', () => {
    const queue = new Queue([1, 2, 3]);
    queue.clear();
    expect(queue.isEmpty()).toBe(true);
    expect(queue.length).toBe(0);
  });

  // Test compact
  it('should compact the queue', () => {
    const queue = new Queue([1, 2, 3]);
    queue.shift();
    queue.shift();
    queue.compact();
    expect(queue.elements).toEqual([3]);
  });

  // Test splice
  it('should splice elements from the queue', () => {
    const queue = new Queue([1, 2, 3, 4]);
    const removed = queue.splice(1, 2);
    expect(removed.elements).toEqual([2, 3]);
    expect(queue.elements).toEqual([1, 4]);
  });

  // Test clone
  it('should create a clone of the queue', () => {
    const queue = new Queue([1, 2, 3]);
    const clone = queue.clone();
    expect(clone.elements).toEqual(queue.elements);
    clone.push(4);
    expect(queue.elements).not.toContain(4);
  });

  // Test filter
  it('should filter elements based on a predicate', () => {
    const queue = new Queue([1, 2, 3, 4]);
    const filtered = queue.filter(el => el % 2 === 0);
    expect(filtered.elements).toEqual([2, 4]);
  });

  // Test map
  it('should map elements to a new queue', () => {
    const queue = new Queue([1, 2, 3]);
    const mapped = queue.map(el => el * 2);
    expect(mapped.elements).toEqual([2, 4, 6]);
  });
});

describe('classic uses', () => {
  it('@example Sliding Window using Queue', () => {
    const nums = [2, 3, 4, 1, 5];
    const k = 2;
    const queue = new Queue<number>();

    let maxSum = 0;
    let currentSum = 0;

    nums.forEach(num => {
      queue.push(num);
      currentSum += num;

      if (queue.length > k) {
        currentSum -= queue.shift()!;
      }

      if (queue.length === k) {
        maxSum = Math.max(maxSum, currentSum);
      }
    });

    expect(maxSum).toBe(7); // Maximum sum is from subarray [3, 4].
  });

  it('@example Breadth-First Search (BFS) using Queue', () => {
    const graph: { [key in number]: number[] } = {
      1: [2, 3],
      2: [4, 5],
      3: [],
      4: [],
      5: []
    };

    const queue = new Queue<number>();
    const visited: number[] = [];

    queue.push(1);

    while (!queue.isEmpty()) {
      const node = queue.shift()!;
      if (!visited.includes(node)) {
        visited.push(node);
        graph[node].forEach(neighbor => queue.push(neighbor));
      }
    }

    expect(visited).toEqual([1, 2, 3, 4, 5]); // Expected BFS traversal order.
  });

  it('Task Scheduling using Queue', () => {
    const tasks = ['A', 'A', 'A', 'B', 'B', 'B'];
    const cooldown = 2;

    const taskQueue = new Queue<string>();
    const cooldownQueue = new Queue<string>();

    for (const task of tasks) {
      while (!cooldownQueue.isEmpty() && cooldownQueue.first === task) {
        cooldownQueue.shift();
        taskQueue.push('idle');
      }

      taskQueue.push(task);
      cooldownQueue.push(task);
      if (cooldownQueue.length > cooldown) {
        cooldownQueue.shift();
      }
    }

    const scheduled = taskQueue.elements;
    expect(scheduled).toEqual(['A', 'idle', 'A', 'idle', 'A', 'B', 'B', 'idle', 'idle', 'B']);
  });
});
