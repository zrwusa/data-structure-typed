import { Deque } from '../../../../src';
import { bigO } from '../../../utils';
import { isDebugTest } from '../../../config';

const isDebug = isDebugTest;
describe('Deque Tests', () => {
  // Test cases for the Deque class (DoublyLinkedList-based)
  describe('Deque (DoublyLinkedList-based)', () => {
    let deque: Deque<number>;

    beforeEach(() => {
      deque = new Deque<number>();
    });

    it('should add elements at the beginning and end', () => {
      deque.addFirst(1);
      deque.addLast(2);
      expect(deque.first).toBe(1);
      expect(deque.last).toBe(2);
    });

    it('should delete elements from the beginning and end', () => {
      deque.addFirst(1);
      deque.addLast(2);
      deque.pollFirst();
      deque.pollLast();
      expect(deque.isEmpty()).toBe(true);
    });

    it('should handle edge case when removing from an empty deque', () => {
      const result = deque.pollFirst();
      expect(result).toBeUndefined();
    });

    it('should correctly report its size', () => {
      deque.addFirst(1);
      deque.addLast(2);
      expect(deque.size).toBe(2);
    });

    it('should handle adding and removing elements alternately', () => {
      deque.addFirst(1);
      expect(deque.pollFirst()).toBe(1);
      deque.addLast(2);
      expect(deque.pollLast()).toBe(2);
      expect(deque.isEmpty()).toBe(true);
    });

    it('should handle adding and removing elements in a cyclic manner', () => {
      deque.addFirst(1);
      deque.addLast(2);
      expect(deque.pollFirst()).toBe(1);
      deque.addFirst(3);
      expect(deque.pollLast()).toBe(2);
      expect(deque.size).toBe(1);
    });
    // Add more test cases as needed
  });

  // // Test cases for the ObjectDeque class
  // describe('ObjectDeque', () => {
  //   let objectDeque: ObjectDeque<string>;
  //
  //   beforeEach(() => {
  //     objectDeque = new ObjectDeque<string>();
  //   });
  //
  //   it('should add elements at the beginning and end', () => {
  //     objectDeque.addFirst('one');
  //     objectDeque.addLast('two');
  //     expect(objectDeque.getFirst()).toBe('one');
  //     expect(objectDeque.getLast()).toBe('two');
  //   });
  //
  //   it('should delete elements from the beginning and end', () => {
  //     objectDeque.addFirst('one');
  //     objectDeque.addLast('two');
  //     objectDeque.pollFirst();
  //     objectDeque.pollLast();
  //     expect(objectDeque.isEmpty()).toBe(true);
  //   });
  //
  //   it('should handle edge case when removing from an empty deque', () => {
  //     const result = objectDeque.pollFirst();
  //     expect(result).toBeUndefined();
  //   });
  //
  //   it('should correctly report its size', () => {
  //     objectDeque.addFirst('one');
  //     objectDeque.addLast('two');
  //     expect(objectDeque.size).toBe(2);
  //   });
  //
  //   // Add more test cases as needed
  // });
});

describe('Deque Performance Test', () => {
  const dataSize = 10000;
  it('should numeric queue be efficient', function () {
    const startTime = performance.now();
    const queue = new Deque<number>();
    for (let i = 0; i < dataSize; i++) {
      queue.unshift(i);
    }
    for (let i = 0; i < dataSize; i++) {
      queue.pop();
    }
    isDebug && console.log(`Queue Deque Test: ${performance.now() - startTime} ms`);
    expect(performance.now() - startTime).toBeLessThan(bigO.LINEAR * 100);
  });
});

describe('Deque', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  it('should initialize an empty deque', () => {
    expect(deque.size).toBe(0);
    expect(deque.isEmpty()).toBe(true);
  });

  it('should add elements to the front and back', () => {
    deque.addFirst(1);
    deque.addLast(2);

    expect(deque.size).toBe(2);
    expect(deque.first).toBe(1);
    expect(deque.last).toBe(2);
  });

  it('should remove elements from the front and back', () => {
    deque.addFirst(1);
    deque.addLast(2);

    const firstElement = deque.pollFirst();
    const lastElement = deque.pollLast();

    expect(deque.size).toBe(0);
    expect(firstElement).toBe(1);
    expect(lastElement).toBe(2);
  });

  it('should get elements by index', () => {
    deque.addLast(1);
    deque.addLast(2);
    deque.addLast(3);

    expect(deque.getAt(0)).toBe(1);
    expect(deque.getAt(1)).toBe(2);
    expect(deque.getAt(2)).toBe(3);
  });

  it('should return undefined for out-of-bounds index', () => {
    // expect(deque.getAt(0)).toThrowError('Index out of bounds.');
    // expect(deque.getAt(1)).toThrow('Index out of bounds');
    // expect(deque.getAt(-1)).toThrow('Index out of bounds');
  });

  it('should check if the deque is empty', () => {
    expect(deque.isEmpty()).toBe(true);

    deque.addLast(1);
    expect(deque.isEmpty()).toBe(false);

    deque.pollFirst();
    expect(deque.isEmpty()).toBe(true);
  });
});

// describe('ObjectDeque', () => {
//   let deque: ObjectDeque<number>;
//
//   beforeEach(() => {
//     deque = new ObjectDeque<number>();
//   });
//
//   it('should add elements to the front of the deque', () => {
//     deque.addFirst(1);
//     deque.addFirst(2);
//
//     expect(deque.size).toBe(2);
//     expect(deque.getFirst()).toBe(2);
//     expect(deque.getLast()).toBe(1);
//   });
//
//   it('should add elements to the end of the deque', () => {
//     deque.addLast(1);
//     deque.addLast(2);
//
//     expect(deque.size).toBe(2);
//     expect(deque.getFirst()).toBe(1);
//     expect(deque.getLast()).toBe(2);
//   });
//
//   it('should remove elements from the front of the deque', () => {
//     deque.addLast(1);
//     deque.addLast(2);
//
//     const removedElement = deque.pollFirst();
//
//     expect(deque.size).toBe(1);
//     expect(removedElement).toBe(1);
//     expect(deque.getFirst()).toBe(2);
//   });
//
//   it('should remove elements from the end of the deque', () => {
//     deque.addLast(1);
//     deque.addLast(2);
//
//     const removedElement = deque.pollFirst();
//
//     expect(deque.size).toBe(1);
//     expect(removedElement).toBe(1);
//     expect(deque.getLast()).toBe(2);
//   });
//
//   it('should return the element at the front of the deque without removing it', () => {
//     deque.addFirst(1);
//     deque.addFirst(2);
//
//     expect(deque.getFirst()).toBe(2);
//     expect(deque.size).toBe(2);
//   });
//
//   it('should return the element at the end of the deque without removing it', () => {
//     deque.addLast(1);
//     deque.addLast(2);
//
//     expect(deque.getLast()).toBe(2);
//     expect(deque.size).toBe(2);
//   });
//
//   it('should return the correct size of the deque', () => {
//     deque.addFirst(1);
//     deque.addLast(2);
//     deque.addLast(3);
//
//     expect(deque.size).toBe(3);
//   });
//
//   it('should check if the deque is empty', () => {
//     expect(deque.isEmpty()).toBe(true);
//
//     deque.addFirst(1);
//
//     expect(deque.isEmpty()).toBe(false);
//   });
//
//   it('should set elements at a specific index', () => {
//     deque.addFirst(1);
//     deque.addLast(2);
//     deque.addLast(3);
//
//     expect(deque.getFirst()).toBe(1);
//     expect(deque.get(1)).toBe(2);
//     expect(deque.getLast()).toBe(3);
//   });
//
//   it('should insert elements at a specific index', () => {
//     deque.addFirst(1);
//     deque.addLast(2);
//     deque.addLast(3);
//
//     expect(deque.size).toBe(3);
//     expect(deque.getFirst()).toBe(1);
//     expect(deque.get(1)).toBe(2);
//     expect(deque.get(2)).toBe(3);
//     expect(deque.getLast()).toBe(3);
//   });
// });


describe('Deque', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  // test('initializes with default capacity', () => {
  //   expect(deque.capacity).toBe(10);
  // });

  // test('initializes with given capacity', () => {
  //   const customDeque = new Deque(20);
  //   expect(customDeque.capacity).toBe(20);
  // });

  test('is initially empty', () => {
    expect(deque.isEmpty()).toBe(true);
  });

  test('pushes and pops elements', () => {
    deque.push(1);
    deque.push(2);
    expect(deque.pop()).toBe(2);
    expect(deque.pop()).toBe(1);
    expect(deque.pop()).toBeUndefined();
  });

  test('unshifts and shifts elements', () => {
    deque.unshift(1);
    deque.unshift(2);
    expect(deque.shift()).toBe(2);
    expect(deque.shift()).toBe(1);
    expect(deque.shift()).toBeUndefined();
  });

  test('correctly reports size', () => {
    expect(deque.size).toBe(0);
    deque.push(1);
    deque.push(2);
    expect(deque.size).toBe(2);
  });

  test('gets first and last elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    expect(deque.first).toBe(1);
    expect(deque.last).toBe(3);
  });

  test('handles resizing automatically', () => {
    for (let i = 0; i < 12; i++) {
      deque.push(i);
    }
    expect(deque.size).toBe(12);
    // expect(deque.capacity).toBeGreaterThan(10);
  });

  test('converts to array', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    expect(deque.toArray()).toEqual([1, 2, 3]);
  });

  test('clears the deque', () => {
    deque.push(1);
    deque.push(2);
    deque.clear();
    expect(deque.isEmpty()).toBe(true);
  });

  test('inserts and deletes at specific index', () => {
    deque.push(1);
    deque.push(3);
    deque.insertAt(1, 2);
    expect(deque.toArray()).toEqual([1, 2, 3]);
    expect(deque.deleteAt(1)).toBe(2);
    expect(deque.toArray()).toEqual([1, 3]);
  });

  test('finds elements with a callback', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    expect(deque.find(el => el > 1)).toBe(2);
  });

  test('performs forEach operation', () => {
    deque.push(1);
    deque.push(2);
    let sum = 0;
    deque.forEach(el => {
      sum += el;
    });
    expect(sum).toBe(3);
  });

  test('maps to a new deque', () => {
    deque.push(1);
    deque.push(2);
    const newDeque = deque.map(el => el * el);
    expect(newDeque.toArray()).toEqual([1, 4]);
  });

  test('filters elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const newDeque = deque.filter(el => el % 2 === 0);
    expect(newDeque.toArray()).toEqual([2]);
  });

  test('reduces elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const sum = deque.reduce((acc, el) => acc + el, 0);
    expect(sum).toBe(6);
  });

  test('reverses elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    deque.reverse();
    expect(deque.toArray()).toEqual([3, 2, 1]);
  });

  test('gets element at a specific index', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    expect(deque.getAt(1)).toBe(2);
    // expect(deque.getAt(5)).toThrow();
  });

  test('finds the index of an element', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    expect(deque.indexOf(2)).toBe(1);
    expect(deque.indexOf(4)).toBe(-1);
  });


  //Test begin method
  describe('begin()', () => {
    it('should return an iterator at the beginning of the deque', () => {
      deque.push(1);
      deque.push(2);
      deque.push(3);

      const iterator = deque.begin();

      expect(iterator.next().value).toBe(1);
    });
  });

  // Test the reverse Begin method
  describe('reverseBegin()', () => {
    it('should return a reverse iterator at the beginning of the deque', () => {
      deque.push(1);
      deque.push(2);
      deque.push(3);

      const iterator = deque.reverseBegin();

      expect(iterator.next().value).toBe(3);
    });
  });

  describe('iterable methods', () => {
    it('should forEach, some, every, filter, map, reduce of the deque', () => {
      deque.push(1);
      deque.push(2);
      deque.push(3);

      const mockCallback = jest.fn();
      deque.forEach((element) => {
        mockCallback(element);
      });

      expect(mockCallback.mock.calls.length).toBe(3);
      expect(mockCallback.mock.calls[0]).toEqual([1]);
      expect(mockCallback.mock.calls[1]).toEqual([2]);
      expect(mockCallback.mock.calls[2]).toEqual([3]);

      expect(deque.every(element => element > 0)).toBe(true);
      expect(deque.every(element => element > 1)).toBe(false);
      expect(deque.some(element => element > 2)).toBe(true);

      expect([...deque.filter(element => element > 2)]).toEqual([3]);
      expect([...deque.map(element => element * 2)]).toEqual([2, 4, 6]);
      expect(deque.reduce((accumulator, element) => accumulator + element, 0)).toEqual(6);
    });
  });
});
