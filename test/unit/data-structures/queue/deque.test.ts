import { Deque } from '../../../../src';
// import { isDebugTest } from '../../../config';

// const isDebug = isDebugTest;

describe('Deque - Basic Operations', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>([1, 2]);
  });

  it('push should add elements to the end', () => {
    expect(deque.length).toBe(2);
    expect(deque.last).toBe(2);
  });

  it('pop should remove elements from the end', () => {
    expect(deque.pop()).toBe(2);
    expect(deque.length).toBe(1);
    expect(deque.pop()).toBe(1);
    expect(deque.isEmpty()).toBeTruthy();
  });

  it('unshift should add elements to the beginning', () => {
    deque.clear();
    deque.unshift(1);
    deque.unshift(2);
    expect(deque.length).toBe(2);
    expect(deque.first).toBe(2);
  });

  it('shift should remove elements from the beginning', () => {
    deque.clear();
    deque.unshift(1);
    deque.unshift(2);
    expect(deque.shift()).toBe(2);
    expect(deque.length).toBe(1);
    expect(deque.shift()).toBe(1);
    expect(deque.isEmpty()).toBeTruthy();
  });

  it('at should retrieve the correct element', () => {
    expect(deque.at(0)).toBe(1);
    expect(deque.at(1)).toBe(2);
  });

  it('setAt should set the correct element', () => {
    deque.setAt(0, 3);
    expect(deque.at(0)).toBe(3);
  });

  it('should at after shifting', () => {
    deque.clear();
    for (let i = 0; i < 100; i++) {
      deque.push(i);
    }

    for (let i = 0; i < 10; i++) {
      expect(deque.shift()).toBe(i);
    }

    for (let i = 0; i < 90; i++) {
      expect(deque.at(i)).toBe(i + 10);
    }
  });

  it('should at after popping', () => {
    deque.clear();
    for (let i = 0; i < 100; i++) {
      deque.push(i);
    }

    for (let i = 0; i < 10; i++) {
      expect(deque.pop()).toBe(99 - i);
    }

    for (let i = 0; i < 90; i++) {
      expect(deque.at(i)).toBe(i);
    }
  });

  it('should clone', function () {
    const deque = new Deque<string>();
    deque.push('1');
    deque.push('6');
    deque.push('2');
    deque.push('0');
    deque.push('5');
    deque.push('9');
    expect(deque.length).toBe(6);
    deque.delete('2');
    expect(deque.length).toBe(5);
    expect([...deque]).toEqual(['1', '6', '0', '5', '9']);
    const cloned = deque.clone();
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
    expect(deque.length).toBe(5);
    deque.delete('5');
    expect(deque.length).toBe(4);
    expect([...deque]).toEqual(['1', '6', '0', '9']);
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
    expect(cloned.length).toBe(5);
    cloned.push('8');
    expect(cloned.length).toBe(6);
    cloned.delete('6');
    expect(cloned.length).toBe(5);
    cloned.delete('6');
    expect(cloned.length).toBe(5);
  });
});
describe('Deque - Complex Operations', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  it('addAt should insert elements at the specified position', () => {
    deque.addAt(0, 1);
    deque.addAt(1, 3);
    deque.addAt(1, 2);
    expect(deque.toArray()).toEqual([1, 2, 3]);
  });

  it('cut should remove elements after the specified position', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    expect(deque.length).toBe(3);
    deque.cut(1, true);
    expect(deque.length).toBe(2);
    expect(deque.toArray()).toEqual([1, 2]);

    const dq1 = new Deque([1, 2, 3, 4, 5, 6, 7]);
    expect(dq1.length).toBe(7);
    expect([...dq1.cut(3, true)]).toEqual([1, 2, 3, 4]);
    expect(dq1.length).toBe(4);
    expect([...dq1]).toEqual([1, 2, 3, 4]);
    const dqCut = dq1.cut(2);
    expect(dqCut.toArray()).toEqual([1, 2, 3]);
    const dqCutFromBeginning = dqCut.cut(0, true);
    expect(dqCutFromBeginning.toArray()).toEqual([1]);
    dqCutFromBeginning.cut(-1, true);
    expect(dqCutFromBeginning.toArray()).toEqual([]);
    const dqCutFromNegative = dqCutFromBeginning.cut(-1);
    expect([...dqCutFromNegative]).toEqual([]);
  });

  it('cutRest should remove elements after the specified position', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    deque.cutRest(1, true);
    expect(deque.toArray()).toEqual([2, 3]);

    const dq = new Deque([1, 2, 3, 4, 5, 6, 7]);
    expect([...dq.cutRest(3, true)]).toEqual([4, 5, 6, 7]);
    expect([...dq]).toEqual([4, 5, 6, 7]);

    const deque1 = new Deque<number>();

    deque1.push(1);
    deque1.push(2);
    deque1.push(3);
    expect(deque1.toArray()).toEqual([1, 2, 3]);
    expect(deque1.cutRest(1).toArray()).toEqual([2, 3]);

    const dq1 = new Deque([1, 2, 3, 4, 5, 6, 7]);
    expect([...dq1.cutRest(3)]).toEqual([4, 5, 6, 7]);
    expect([...dq1]).toEqual([1, 2, 3, 4, 5, 6, 7]);
    const dq2 = dq1.cutRest(0, true);
    expect(dq2.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    dq2.cutRest(-1, true);
    expect(dq2.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    const dq3 = dq2.cutRest(-1);
    expect([...dq3]).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('deleteAt should remove the element at the specified position', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    deque.deleteAt(1);
    expect(deque.toArray()).toEqual([1, 3]);
    deque.deleteAt(1);
    deque.deleteAt(0);
    expect(deque.toArray()).toEqual([]);
  });

  it('delete should remove all instances of an element', () => {
    deque.delete(2);
    expect(deque.toArray()).toEqual([]);
    deque.push(1);
    deque.push(2);
    deque.push(2);
    deque.push(3);
    deque.delete(2);
    expect(deque.toArray()).toEqual([1, 3]);
  });

  it('reverse should reverse the order of elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    deque.reverse();
    expect(deque.toArray()).toEqual([3, 2, 1]);
  });

  it('unique should remove duplicate elements', () => {
    deque.push(1);
    const noNeedUnique = deque.unique();
    expect(noNeedUnique).toBe(deque);
    deque.push(2);
    deque.push(2);
    deque.push(3);
    const uniquer = deque.unique();
    expect(uniquer).toBe(deque);
    expect(deque.toArray()).toEqual([1, 2, 3]);
  });

  it('sort should sort elements according to a comparator', () => {
    deque.push(3);
    deque.push(1);
    deque.push(2);
    deque.sort((a, b) => a - b);
    expect([...deque]).toEqual([1, 2, 3]);
  });

  it('shrinkToFit should reduce the memory footprint', () => {
    deque.shrinkToFit();
    expect(deque.length).toBe(0);
    expect(deque.has(1)).toBe(false);
    expect(deque.bucketFirst).toBe(0);
    expect(deque.bucketLast).toBe(0);
    expect(deque.firstInBucket).toBe(2048);
    expect(deque.lastInBucket).toBe(2048);
    expect(deque.bucketCount).toBe(1);
    expect(deque.buckets[0][0]).toEqual(undefined);
    expect(deque.buckets.length).toEqual(1);
    deque.push(1);
    deque.shrinkToFit();

    deque = new Deque([1, 2, 3, 4, 5], { bucketSize: 2 });
    expect(deque.length).toBe(5);
    expect(deque.has(1)).toBe(true);
    expect(deque.bucketFirst).toBe(0);
    expect(deque.bucketLast).toBe(2);
    expect(deque.firstInBucket).toBe(0);
    expect(deque.lastInBucket).toBe(0);
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets[0][0]).toBe(1);
    expect(deque.buckets[2][0]).toBe(5);
    expect(deque.buckets.length).toBe(3);
    deque.shrinkToFit();
    expect(deque.buckets).toEqual([[1, 2], [3, 4], [5]]);
    deque.push(6);
    deque.push(7);
    deque.shrinkToFit();
    expect(deque.buckets).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 2]
    ]);
  });
});
describe('Deque - Utility Operations', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  it('find should return the first element that matches the condition', () => {
    expect(deque.first).toBe(undefined);
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const found = deque.find(element => element > 1);
    expect(found).toBe(2);
  });

  it('indexOf should return the index of the first occurrence of an element', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const index = deque.indexOf(2);
    expect(index).toBe(1);
    expect(deque.indexOf(4)).toBe(-1);
  });

  it('toArray should convert the deque to an array', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    expect(deque.toArray()).toEqual([1, 2, 3]);
  });

  it('filter should filter elements based on a predicate', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const filtered = deque.filter(element => element > 1);
    expect(filtered.toArray()).toEqual([2, 3]);
  });

  it('map should apply a function to all elements', () => {
    deque.push(1);
    deque.push(2);
    deque.push(3);
    const mapped = deque.map(element => element * 2);
    expect(mapped.toArray()).toEqual([2, 4, 6]);
  });

  it('print should print the deque elements', () => {
    // const consoleSpy = jest.spyOn(console, 'log');
    // deque.push(1);
    // deque.push(2);
    // deque.print();
    // expect(consoleSpy).toHaveBeenCalledWith([1, 2]);
  });

  it('should maxLen work well', () => {
    const dequeMaxLen = new Deque([3, 4, 5, 6, 7], { maxLen: 3 });
    expect(dequeMaxLen.length).toBe(3);
    expect(dequeMaxLen.toArray()).toEqual([5, 6, 7]);
    dequeMaxLen.unshift(4);
    dequeMaxLen.unshift(3);
    expect(dequeMaxLen.length).toBe(3);
    expect(dequeMaxLen.toArray()).toEqual([3, 4, 5]);

    const dequeNoMaxLen = new Deque([3, 4, 5, 6, 7]);
    expect(dequeNoMaxLen.length).toBe(5);
    expect(dequeNoMaxLen.toArray()).toEqual([3, 4, 5, 6, 7]);
    dequeNoMaxLen.unshift(4);
    dequeNoMaxLen.unshift(3);
    expect(dequeNoMaxLen.length).toBe(7);
    expect(dequeNoMaxLen.toArray()).toEqual([3, 4, 3, 4, 5, 6, 7]);
  });
});

describe('Deque - Additional Operations', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  it('push should add an element to the end', () => {
    deque.push(1);
    deque.push(2);
    expect(deque.last).toBe(2);
    expect(deque.length).toBe(2);
  });

  it('pop should remove and return the last element', () => {
    deque.push(1);
    deque.push(2);
    expect(deque.pop()).toBe(2);
    expect(deque.length).toBe(1);
  });

  it('unshift should add an element to the beginning', () => {
    deque.unshift(1);
    deque.unshift(2);
    expect(deque.first).toBe(2);
    expect(deque.length).toBe(2);
  });

  it('shift should remove and return the first element', () => {
    deque.shift();
    deque.unshift(1);
    deque.unshift(2);
    expect(deque.shift()).toBe(2);
    expect(deque.length).toBe(1);
  });

  it('clear should reset the deque', () => {
    deque.unshift(1);
    deque.clear();
    expect(deque.length).toBe(0);
    expect(deque.isEmpty()).toBeTruthy();
  });

  it('begin should yield elements from the beginning', () => {
    deque.push(1);
    deque.push(2);
    const iterator = deque.begin();
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
  });

  it('reverseBegin should yield elements in reverse order', () => {
    deque.push(1);
    deque.push(2);
    const iterator = deque.reverseBegin();
    expect(iterator.next().value).toBe(2);
    expect(iterator.next().value).toBe(1);
  });
});
describe('Deque - push Method', () => {
  let deque: Deque<number>;
  const bucketSize = 10;

  beforeEach(() => {
    deque = new Deque<number>([], {
      bucketSize
    });
  });

  it('push should add an element when deque is empty', () => {
    deque.push(1);
    expect(deque.last).toBe(1);
    expect(deque.length).toBe(1);
  });

  it('push should add an element when lastInBucket is not at max', () => {
    for (let i = 0; i < bucketSize - 1; i++) {
      deque.push(i);
    }
    deque.push(bucketSize);
    expect(deque.last).toBe(bucketSize);
    expect(deque.length).toBe(bucketSize);
  });

  it('push should add an element and move to next bucket when last bucket is full', () => {
    for (let i = 0; i < bucketSize; i++) {
      deque.push(i);
    }
    deque.push(bucketSize + 1);
    expect(deque.last).toBe(bucketSize + 1);
    expect(deque.length).toBe(bucketSize + 1);
  });

  it('push should add an element and reallocate when last bucket and lastInBucket are at max', () => {
    for (let i = 0; i < 100; i++) {
      deque.push(i);
    }

    deque.push(100);
    expect(deque.last).toBe(100);
    expect(deque.length).toBeGreaterThan(bucketSize);
  });
});
describe('Deque - pop Method', () => {
  let deque: Deque<number>;
  const bucketSize = 10;

  beforeEach(() => {
    deque = new Deque<number>([], {
      bucketSize
    });
  });

  it('pop should remove and return the last element', () => {
    deque.push(1);
    deque.push(2);
    expect(deque.pop()).toBe(2);
    expect(deque.length).toBe(1);
  });

  it('pop should handle popping the only element', () => {
    deque.push(1);
    expect(deque.pop()).toBe(1);
    expect(deque.isEmpty()).toBeTruthy();
  });

  it('pop should adjust bucketLast and lastInBucket correctly', () => {
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
    deque = new Deque<number>([], {
      bucketSize
    });
  });

  it('unshift should add an element to the beginning when deque is empty', () => {
    deque.unshift(1);
    expect(deque.first).toBe(1);
    expect(deque.length).toBe(1);
  });

  it('unshift should add an element to the beginning and adjust firstInBucket', () => {
    for (let i = 0; i < 100; i++) {
      deque.unshift(i);
    }

    deque.unshift(0);
    expect(deque.first).toBe(0);
  });

  it('unshift should add an element and reallocate when needed', () => {
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
    deque = new Deque<number>([], {
      bucketSize
    });
  });

  it('shift should remove and return the first element', () => {
    deque.push(1);
    deque.push(2);
    expect(deque.shift()).toBe(1);
    expect(deque.length).toBe(1);
  });

  it('shift should handle shifting the only element', () => {
    deque.push(1);
    expect(deque.shift()).toBe(1);
    expect(deque.isEmpty()).toBeTruthy();
  });

  it('shift should adjust bucketFirst and firstInBucket correctly', () => {
    for (let i = 0; i < 100; i++) {
      deque.push(i);
    }
    for (let i = 0; i < 100; i++) {
      const firstElement = deque.first;
      expect(deque.shift()).toBe(firstElement);
    }
  });
});

describe('Deque', () => {
  it('should initialize with default iterable with length function', () => {
    class IterableNumbers {
      private readonly _elements: number[] = [];

      constructor(elements: number[]) {
        this._elements = elements;
      }

      *[Symbol.iterator]() {
        for (let i = 0; i < this._elements.length; ++i) {
          yield this._elements[i];
        }
      }

      length() {
        return this._elements.length;
      }
    }

    const numbers = new IterableNumbers([1, 6, 7, 3, 2, 4, 5]);
    const deque = new Deque(numbers, { bucketSize: 3 });
    expect(deque.length).toBe(7);
    expect(deque.bucketSize).toBe(3);
    expect(deque.maxLen).toBe(-1);
  });

  it('should initialize with default iterable with size function', () => {
    class IterableNumbersWithSize {
      private readonly _elements: number[] = [];

      constructor(elements: number[]) {
        this._elements = elements;
      }

      *[Symbol.iterator]() {
        for (let i = 0; i < this._elements.length; ++i) {
          yield this._elements[i];
        }
      }

      size() {
        return this._elements.length;
      }
    }

    const numbers = new IterableNumbersWithSize([1, 6, 7, 3, 2, 4, 5]);
    const deque = new Deque(numbers, { bucketSize: 3 });
    expect(deque.length).toBe(7);
    expect(deque.bucketSize).toBe(3);
    expect(deque.maxLen).toBe(-1);
  });

  it('should initialize via toElementFn', () => {
    const objArr: Array<{
      key: number;
    }> = [{ key: 1 }, { key: 6 }, { key: 7 }, { key: 3 }, { key: 2 }, { key: 4 }, { key: 5 }];
    const deque = new Deque<number>(objArr, { toElementFn: item => item.key });
    expect(deque.length).toBe(7);
    expect(deque.has(1)).toBe(true);
    expect(deque.has(7)).toBe(true);
    expect(deque.has(8)).toBe(false);
  });

  it('should bucket properties are correct', () => {
    const objArr: Array<{
      key: number;
    }> = [{ key: 1 }, { key: 6 }, { key: 7 }, { key: 3 }, { key: 2 }, { key: 4 }, { key: 5 }];
    const deque = new Deque<number>(objArr, { toElementFn: item => item.key, bucketSize: 3 });
    expect(deque.length).toBe(7);
    expect(deque.has(1)).toBe(true);
    expect(deque.bucketFirst).toBe(0);
    expect(deque.bucketLast).toBe(2);
    expect(deque.firstInBucket).toBe(1);
    expect(deque.lastInBucket).toBe(1); // TODO may be a problem
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets).toEqual([
      [, 1, 6],
      [7, 3, 2],
      [4, 5]
    ]);
  });

  it('should pop work well when bucket boundary is reached', () => {
    const deque = new Deque<number>([1, 6, 7, 3, 2, 4, 5], { bucketSize: 3 });
    expect(deque.length).toBe(7);
    expect(deque.has(1)).toBe(true);
    expect(deque.bucketFirst).toBe(0);
    expect(deque.bucketLast).toBe(2);
    expect(deque.firstInBucket).toBe(1);
    expect(deque.lastInBucket).toBe(1); // TODO may be a problem
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets).toEqual([
      [, 1, 6],
      [7, 3, 2],
      [4, 5]
    ]);
    for (let i = 0; i < 3; ++i) deque.pop();
    expect(deque.length).toBe(4);
    expect(deque.has(1)).toBe(true);
    expect(deque.bucketFirst).toBe(0);
    expect(deque.bucketLast).toBe(1);
    expect(deque.firstInBucket).toBe(1);
    expect(deque.lastInBucket).toBe(1);
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets).toEqual([
      [, 1, 6],
      [7, 3, 2],
      [4, 5]
    ]); // TODO may be a problem
    deque.pop();
    expect(deque.length).toBe(3);
    expect(deque.has(1)).toBe(true);
    expect(deque.bucketFirst).toBe(0);
    expect(deque.bucketLast).toBe(1);
    expect(deque.firstInBucket).toBe(1);
    expect(deque.lastInBucket).toBe(0);
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets).toEqual([
      [, 1, 6],
      [7, 3, 2],
      [4, 5]
    ]); // TODO may be a problem
  });

  it('should shift work well when bucket boundary is reached and should shrinkToFit', () => {
    const deque = new Deque<number>([1, 6, 7, 3, 2, 4, 5], { bucketSize: 3 });
    expect(deque.length).toBe(7);
    expect(deque.has(1)).toBe(true);
    expect(deque.bucketFirst).toBe(0);
    expect(deque.bucketLast).toBe(2);
    expect(deque.firstInBucket).toBe(1);
    expect(deque.lastInBucket).toBe(1); // TODO may be a problem
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets).toEqual([
      [, 1, 6],
      [7, 3, 2],
      [4, 5]
    ]);
    for (let i = 0; i < 3; ++i) deque.shift();
    expect(deque.length).toBe(4);
    expect(deque.has(1)).toBe(false);
    expect(deque.bucketFirst).toBe(1);
    expect(deque.bucketLast).toBe(2);
    expect(deque.firstInBucket).toBe(1);
    expect(deque.lastInBucket).toBe(1);
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets).toEqual([
      [, 1, 6],
      [7, 3, 2],
      [4, 5]
    ]); // TODO may be a problem
    deque.shift();
    expect(deque.length).toBe(3);
    expect(deque.has(1)).toBe(false);
    expect(deque.bucketFirst).toBe(1);
    expect(deque.bucketLast).toBe(2);
    expect(deque.firstInBucket).toBe(2);
    expect(deque.lastInBucket).toBe(1);
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets).toEqual([
      [, 1, 6],
      [7, 3, 2],
      [4, 5]
    ]); // TODO may be a problem
    deque.shrinkToFit();
    expect(deque.length).toBe(3);
    expect(deque.has(1)).toBe(false);
    expect(deque.bucketFirst).toBe(0);
    expect(deque.bucketLast).toBe(1);
    expect(deque.firstInBucket).toBe(2);
    expect(deque.lastInBucket).toBe(1);
    expect(deque.bucketCount).toBe(3);
    expect(deque.buckets).toEqual([
      [7, 3, 2],
      [4, 5]
    ]); // TODO may be a problem
  });
});

describe('classic uses', () => {
  it('@example prize roulette', () => {
    class PrizeRoulette {
      private deque: Deque<string>;

      constructor(prizes: string[]) {
        // Initialize the deque with prizes
        this.deque = new Deque<string>(prizes);
      }

      // Rotate clockwise to the right (forward)
      rotateClockwise(steps: number): void {
        const n = this.deque.length;
        if (n === 0) return;

        for (let i = 0; i < steps; i++) {
          const last = this.deque.pop(); // Remove the last element
          this.deque.unshift(last!); // Add it to the front
        }
      }

      // Rotate counterclockwise to the left (backward)
      rotateCounterClockwise(steps: number): void {
        const n = this.deque.length;
        if (n === 0) return;

        for (let i = 0; i < steps; i++) {
          const first = this.deque.shift(); // Remove the first element
          this.deque.push(first!); // Add it to the back
        }
      }

      // Display the current prize at the head
      display() {
        return this.deque.first;
      }
    }

    // Example usage
    const prizes = ['Car', 'Bike', 'Laptop', 'Phone', 'Watch', 'Headphones']; // Initialize the prize list
    const roulette = new PrizeRoulette(prizes);

    // Display the initial state
    expect(roulette.display()).toBe('Car'); // Car

    // Rotate clockwise by 3 steps
    roulette.rotateClockwise(3);
    expect(roulette.display()).toBe('Phone'); // Phone

    // Rotate counterclockwise by 2 steps
    roulette.rotateCounterClockwise(2);
    expect(roulette.display()).toBe('Headphones'); // Headphones
  });
});
