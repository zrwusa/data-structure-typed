import { Deque } from '../../../../src';
// import { isDebugTest } from '../../../config';

// const isDebug = isDebugTest;

describe('Deque - Basic Operations', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>([1, 2]);
  });

  test('push should add elements to the end', () => {
    expect(deque.size).toBe(2);
    expect(deque.last).toBe(2);
  });

  test('pop should remove elements from the end', () => {
    expect(deque.pop()).toBe(2);
    expect(deque.size).toBe(1);
    expect(deque.pop()).toBe(1);
    expect(deque.isEmpty()).toBeTruthy();
  });

  test('unshift should add elements to the beginning', () => {
    deque.clear();
    deque.unshift(1);
    deque.unshift(2);
    expect(deque.size).toBe(2);
    expect(deque.first).toBe(2);
  });

  test('shift should remove elements from the beginning', () => {
    deque.clear();
    deque.unshift(1);
    deque.unshift(2);
    expect(deque.shift()).toBe(2);
    expect(deque.size).toBe(1);
    expect(deque.shift()).toBe(1);
    expect(deque.isEmpty()).toBeTruthy();
  });

  test('getAt should retrieve the correct element', () => {
    expect(deque.getAt(0)).toBe(1);
    expect(deque.getAt(1)).toBe(2);
  });

  test('setAt should set the correct element', () => {
    deque.setAt(0, 3);
    expect(deque.getAt(0)).toBe(3);
  });
});
describe('Deque - Complex Operations', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  test('addAt should insert elements at the specified position', () => {
    deque.push(1);
    deque.push(3);
    deque.addAt(1, 2);
    expect(deque.toArray()).toEqual([1, 2, 3]);
  });

  test('cut should remove elements after the specified position', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    deque.cut(1);
    expect(deque.toArray()).toEqual([1, 2]);
  });

  test('deleteAt should remove the element at the specified position', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    deque.deleteAt(1);
    expect(deque.toArray()).toEqual([1, 3]);
  });

  test('delete should remove all instances of an element', () => {
    deque.push(1);
    deque.push(2);
    deque.push(2);
    deque.push(3);
    deque.delete(2);
    expect(deque.toArray()).toEqual([1, 3]);
  });

  test('reverse should reverse the order of elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    deque.reverse();
    expect(deque.toArray()).toEqual([3, 2, 1]);
  });

  test('unique should remove duplicate elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(2);
    deque.push(3);
    deque.unique();
    expect(deque.toArray()).toEqual([1, 2, 3]);
  });

  test('sort should sort elements according to a comparator', () => {
    deque.push(3);
    deque.push(1);
    deque.push(2);
    deque.sort((a, b) => a - b);
    expect([...deque]).toEqual([1, 2, 3]);
  });

  test('shrinkToFit should reduce the memory footprint', () => {
  });
});
describe('Deque - Utility Operations', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  test('find should return the first element that matches the condition', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const found = deque.find(element => element > 1);
    expect(found).toBe(2);
  });

  test('indexOf should return the index of the first occurrence of an element', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const index = deque.indexOf(2);
    expect(index).toBe(1);
  });

  test('toArray should convert the deque to an array', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    expect(deque.toArray()).toEqual([1, 2, 3]);
  });

  test('filter should filter elements based on a predicate', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const filtered = deque.filter(element => element > 1);
    expect(filtered.toArray()).toEqual([2, 3]);
  });

  test('map should apply a function to all elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const mapped = deque.map(element => element * 2);
    expect(mapped.toArray()).toEqual([2, 4, 6]);
  });

  test('print should print the deque elements', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    deque.push(1);
    deque.push(2);
    deque.print();
    expect(consoleSpy).toHaveBeenCalledWith([1, 2]);
  });

});
describe('Deque - Additional Operations', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  test('addLast should add an element to the end', () => {
    deque.addLast(1);
    deque.addLast(2);
    expect(deque.last).toBe(2);
    expect(deque.size).toBe(2);
  });

  test('pollLast should remove and return the last element', () => {
    deque.addLast(1);
    deque.addLast(2);
    expect(deque.pollLast()).toBe(2);
    expect(deque.size).toBe(1);
  });

  test('addFirst should add an element to the beginning', () => {
    deque.addFirst(1);
    deque.addFirst(2);
    expect(deque.first).toBe(2);
    expect(deque.size).toBe(2);
  });

  test('pollFirst should remove and return the first element', () => {
    deque.addFirst(1);
    deque.addFirst(2);
    expect(deque.pollFirst()).toBe(2);
    expect(deque.size).toBe(1);
  });

  test('clear should reset the deque', () => {
    deque.addFirst(1);
    deque.clear();
    expect(deque.size).toBe(0);
    expect(deque.isEmpty()).toBeTruthy();
  });

  test('begin should yield elements from the beginning', () => {
    deque.addLast(1);
    deque.addLast(2);
    const iterator = deque.begin();
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
  });

  test('reverseBegin should yield elements in reverse order', () => {
    deque.addLast(1);
    deque.addLast(2);
    const iterator = deque.reverseBegin();
    expect(iterator.next().value).toBe(2);
    expect(iterator.next().value).toBe(1);
  });

});
describe('Deque - push Method', () => {
  let deque: Deque<number>;
  const bucketSize = 10; // 假设的 bucket 大小

  beforeEach(() => {
    deque = new Deque<number>([], bucketSize);
  });

  test('push should add an element when deque is empty', () => {
    deque.push(1);
    expect(deque.last).toBe(1);
    expect(deque.size).toBe(1);
  });

  test('push should add an element when lastInBucket is not at max', () => {
    for (let i = 0; i < bucketSize - 1; i++) {
      deque.push(i);
    }
    deque.push(bucketSize);
    expect(deque.last).toBe(bucketSize);
    expect(deque.size).toBe(bucketSize);
  });

  test('push should add an element and move to next bucket when last bucket is full', () => {
    for (let i = 0; i < bucketSize; i++) {
      deque.push(i);
    }
    deque.push(bucketSize + 1);
    expect(deque.last).toBe(bucketSize + 1);
    expect(deque.size).toBe(bucketSize + 1);
  });

  test('push should add an element and reallocate when last bucket and lastInBucket are at max', () => {

    for (let i = 0; i < 100; i++) {
      deque.push(i);
    }

    deque.push(100);
    expect(deque.last).toBe(100);
    expect(deque.size).toBeGreaterThan(bucketSize);
  });
});
describe('Deque - pop Method', () => {
  let deque: Deque<number>;
  const bucketSize = 10;

  beforeEach(() => {
    deque = new Deque<number>([], bucketSize);
  });

  test('pop should remove and return the last element', () => {
    deque.push(1);
    deque.push(2);
    expect(deque.pop()).toBe(2);
    expect(deque.size).toBe(1);
  });

  test('pop should handle popping the only element', () => {
    deque.push(1);
    expect(deque.pop()).toBe(1);
    expect(deque.isEmpty()).toBeTruthy();
  });

  test('pop should adjust bucketLast and lastInBucket correctly', () => {
    for (let i = 0; i < 100; i++) {
      deque.push(i);
    }
    for (let i = 0; i < 1001; i++) {
      const lastElement = deque.last;
      expect(deque.pop()).toBe(lastElement);
    }


  });
});
describe('Deque - unshift Method', () => {
  let deque: Deque<number>;
  const bucketSize = 10;

  beforeEach(() => {
    deque = new Deque<number>([], bucketSize);
  });

  test('unshift should add an element to the beginning when deque is empty', () => {
    deque.unshift(1);
    expect(deque.first).toBe(1);
    expect(deque.size).toBe(1);
  });

  test('unshift should add an element to the beginning and adjust firstInBucket', () => {
    for (let i = 0; i < 100; i++) {
      deque.unshift(i);
    }

    deque.unshift(0);
    expect(deque.first).toBe(0);
  });

  test('unshift should add an element and reallocate when needed', () => {
    for (let i = 0; i < 100; i++) {
      deque.unshift(i);
    }
    deque.unshift(-1);
    expect(deque.first).toBe(-1);
  });
});
describe('Deque - shift Method', () => {
  let deque: Deque<number>;

  const bucketSize = 10;

  beforeEach(() => {
    deque = new Deque<number>([], bucketSize);
  });

  test('shift should remove and return the first element', () => {
    deque.push(1);
    deque.push(2);
    expect(deque.shift()).toBe(1);
    expect(deque.size).toBe(1);
  });

  test('shift should handle shifting the only element', () => {
    deque.push(1);
    expect(deque.shift()).toBe(1);
    expect(deque.isEmpty()).toBeTruthy();
  });

  test('shift should adjust bucketFirst and firstInBucket correctly', () => {
    for (let i = 0; i < 100; i++) {
      deque.push(i);
    }
    for (let i = 0; i < 100; i++) {
      const firstElement = deque.first;
      expect(deque.shift()).toBe(firstElement);
    }

  });
});
