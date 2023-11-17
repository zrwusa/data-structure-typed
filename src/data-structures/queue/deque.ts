/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */


import { IterableWithSizeOrLength, IterateDirection } from "../../types";
import { calcMinUnitsRequired, rangeCheck, throwRangeError } from "../../utils";

/**
 * Deque can provide random access with O(1) time complexity
 * Deque is usually more compact and efficient in memory usage because it does not require additional space to store pointers.
 * Deque may experience performance jitter, but DoublyLinkedList will not
 * Deque is implemented using a dynamic array. Inserting or deleting beyond both ends of the array may require moving elements or reallocating space.
 */

export class DequeIterator<E> {
  iterateDirection: IterateDirection;

  index: number;
  readonly deque: Deque<E>;

  constructor(index: number, deque: Deque<E>, iterateDirection = IterateDirection.DEFAULT) {
    this.index = index;
    this.iterateDirection = iterateDirection;
    if (this.iterateDirection === IterateDirection.DEFAULT) {
      this.prev = function () {
        if (this.index === 0) {
          throwRangeError();
        }
        this.index -= 1;
        return this;
      };
      this.next = function () {
        if (this.index === this.deque.size) {
          throwRangeError();
        }
        this.index += 1;
        return this;
      };
    } else {
      this.prev = function () {
        if (this.index === this.deque.size - 1) {
          throwRangeError();
        }
        this.index += 1;
        return this;
      };
      this.next = function () {
        if (this.index === -1) {
          throwRangeError();
        }
        this.index -= 1;
        return this;
      };
    }
    this.deque = deque;
  }

  get current() {
    return this.deque.getAt(this.index);
  }

  set current(newElement: E) {
    this.deque.setAt(this.index, newElement);
  }

  isAccessible() {
    return this.index !== this.deque.size;
  }

  prev(): DequeIterator<E> {
    return this;
  }

  next(): DequeIterator<E> {
    return this;
  }

  clone() {
    return new DequeIterator<E>(this.index, this.deque, this.iterateDirection);
  }

}

export class Deque<E> {
  protected _bucketFirst = 0;
  protected _firstInBucket = 0;
  protected _bucketLast = 0;
  protected _lastInBucket = 0;
  protected _bucketCount = 0;
  protected readonly _bucketSize: number;

  constructor(elements: IterableWithSizeOrLength<E> = [], bucketSize = (1 << 12)) {

    let _size;
    if ('length' in elements) {
      _size = elements.length;
    } else {
      _size = elements.size;
    }

    this._bucketSize = bucketSize;
    this._bucketCount = calcMinUnitsRequired(_size, this._bucketSize) || 1;
    for (let i = 0; i < this._bucketCount; ++i) {
      this._buckets.push(new Array(this._bucketSize));
    }
    const needBucketNum = calcMinUnitsRequired(_size, this._bucketSize);
    this._bucketFirst = this._bucketLast = (this._bucketCount >> 1) - (needBucketNum >> 1);
    this._firstInBucket = this._lastInBucket = (this._bucketSize - _size % this._bucketSize) >> 1;

    for (const element of elements) {
      this.push(element);
    }
  }

  protected _buckets: E[][] = [];

  get buckets() {
    return this._buckets;
  }

  protected _size = 0;

  get size() {
    return this._size;
  }

  get first(): E | undefined {
    if (this.size === 0) return;
    return this._buckets[this._bucketFirst][this._firstInBucket];
  }

  get last(): E | undefined {
    if (this.size === 0) return;
    return this._buckets[this._bucketLast][this._lastInBucket];
  }

  /**
   * Time Complexity: Amortized O(1) - Generally constant time, but resizing when the deque is full leads to O(n).
   * Space Complexity: O(n) - In worst case, resizing doubles the array size.
   */

  empty() {
    return this._size === 0;
  }

  /**
   * Time Complexity: O(1) - Removes the last element.
   * Space Complexity: O(1) - Operates in-place.
   */

  isEmpty() {
    return this.size === 0;
  }

  /**
   * Time Complexity: Amortized O(1) - Similar to push, resizing leads to O(n).
   * Space Complexity: O(n) - Due to potential resizing.
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(n) - In worst case, resizing doubles the array size.
   *
   * The addLast function adds an element to the end of an array.
   * @param {E} element - The element parameter represents the element that you want to add to the end of the
   * data structure.
   */
  addLast(element: E): void {
    this.push(element);
  }

  /**
   * Time Complexity: O(1) - Removes the first element.
   * Space Complexity: O(1) - In-place operation.
   */

  /**
   * Time Complexity: O(1) - Removes the last element.
   * Space Complexity: O(1) - Operates in-place.
   *
   * The function "popLast" removes and returns the last element of an array.
   * @returns The last element of the array is being returned.
   */
  popLast(): E | undefined {
    return this.pop();
  }

  /**
   * Time Complexity: O(1).
   * Space Complexity: O(n) - Due to potential resizing.
   *
   * The "addFirst" function adds an element to the beginning of an array.
   * @param {E} element - The parameter "element" represents the element that you want to add to the
   * beginning of the data structure.
   */
  addFirst(element: E): void {
    this.unshift(element);
  }

  /**
   * Time Complexity: O(1) - Removes the first element.
   * Space Complexity: O(1) - In-place operation.
   *
   * The function "popFirst" removes and returns the first element of an array.
   * @returns The method `popFirst()` is returning the first element of the array after removing it
   * from the beginning. If the array is empty, it will return `undefined`.
   */
  popFirst(): E | undefined {
    return this.shift();
  }

  clear() {
    this._buckets = [new Array(this._bucketSize)];
    this._bucketCount = 1;
    this._bucketFirst = this._bucketLast = this._size = 0;
    this._firstInBucket = this._lastInBucket = this._bucketSize >> 1;
  }

  begin() {
    return new DequeIterator<E>(0, this);
  }

  end() {
    return new DequeIterator<E>(this.size, this);
  }

  reverseBegin() {
    return new DequeIterator<E>(this.size - 1, this, IterateDirection.REVERSE);
  }

  reverseEnd() {
    return new DequeIterator<E>(-1, this, IterateDirection.REVERSE);
  }

  push(element: E) {
    if (this.size) {
      if (this._lastInBucket < this._bucketSize - 1) {
        this._lastInBucket += 1;
      } else if (this._bucketLast < this._bucketCount - 1) {
        this._bucketLast += 1;
        this._lastInBucket = 0;
      } else {
        this._bucketLast = 0;
        this._lastInBucket = 0;
      }
      if (
        this._bucketLast === this._bucketFirst &&
        this._lastInBucket === this._firstInBucket
      ) this._reallocate();
    }
    this._size += 1;
    this._buckets[this._bucketLast][this._lastInBucket] = element;
    return this.size;
  }

  pop() {
    if (this.size === 0) return;
    const element = this._buckets[this._bucketLast][this._lastInBucket];
    if (this.size !== 1) {
      if (this._lastInBucket > 0) {
        this._lastInBucket -= 1;
      } else if (this._bucketLast > 0) {
        this._bucketLast -= 1;
        this._lastInBucket = this._bucketSize - 1;
      } else {
        this._bucketLast = this._bucketCount - 1;
        this._lastInBucket = this._bucketSize - 1;
      }
    }
    this._size -= 1;
    return element;
  }

  unshift(element: E) {
    if (this.size) {
      if (this._firstInBucket > 0) {
        this._firstInBucket -= 1;
      } else if (this._bucketFirst > 0) {
        this._bucketFirst -= 1;
        this._firstInBucket = this._bucketSize - 1;
      } else {
        this._bucketFirst = this._bucketCount - 1;
        this._firstInBucket = this._bucketSize - 1;
      }
      if (
        this._bucketFirst === this._bucketLast &&
        this._firstInBucket === this._lastInBucket
      ) this._reallocate();
    }
    this._size += 1;
    this._buckets[this._bucketFirst][this._firstInBucket] = element;
    return this.size;
  }

  shift() {
    if (this.size === 0) return;
    const element = this._buckets[this._bucketFirst][this._firstInBucket];
    if (this.size !== 1) {
      if (this._firstInBucket < this._bucketSize - 1) {
        this._firstInBucket += 1;
      } else if (this._bucketFirst < this._bucketCount - 1) {
        this._bucketFirst += 1;
        this._firstInBucket = 0;
      } else {
        this._bucketFirst = 0;
        this._firstInBucket = 0;
      }
    }
    this._size -= 1;
    return element;
  }

  getAt(pos: number): E {
    rangeCheck!(pos, 0, this.size - 1);
    const {
      bucketIndex,
      indexInBucket
    } = this._getBucketAndPosition(pos);
    return this._buckets[bucketIndex][indexInBucket]!;
  }

  setAt(pos: number, element: E) {
    rangeCheck!(pos, 0, this.size - 1);
    const {
      bucketIndex,
      indexInBucket
    } = this._getBucketAndPosition(pos);
    this._buckets[bucketIndex][indexInBucket] = element;
  }

  insertAt(pos: number, element: E, num = 1) {
    const length = this.size;
    rangeCheck!(pos, 0, length);
    if (pos === 0) {
      while (num--) this.unshift(element);
    } else if (pos === this.size) {
      while (num--) this.push(element);
    } else {
      const arr: E[] = [];
      for (let i = pos; i < this.size; ++i) {
        arr.push(this.getAt(i));
      }
      this.cut(pos - 1);
      for (let i = 0; i < num; ++i) this.push(element);
      for (let i = 0; i < arr.length; ++i) this.push(arr[i]);
    }
    return this.size;
  }

  cut(pos: number) {
    if (pos < 0) {
      this.clear();
      return 0;
    }
    const {
      bucketIndex,
      indexInBucket
    } = this._getBucketAndPosition(pos);
    this._bucketLast = bucketIndex;
    this._lastInBucket = indexInBucket;
    this._size = pos + 1;
    return this.size;
  }

  deleteAt(pos: number) {
    rangeCheck!(pos, 0, this.size - 1);
    if (pos === 0) this.shift();
    else if (pos === this.size - 1) this.pop();
    else {
      const length = this.size - 1;
      let {
        bucketIndex: curBucket,
        indexInBucket: curPointer
      } = this._getBucketAndPosition(pos);
      for (let i = pos; i < length; ++i) {
        const {
          bucketIndex: nextBucket,
          indexInBucket: nextPointer
        } = this._getBucketAndPosition(pos + 1);
        this._buckets[curBucket][curPointer] = this._buckets[nextBucket][nextPointer];
        curBucket = nextBucket;
        curPointer = nextPointer;
      }
      this.pop();
    }
    return this.size;
  }

  delete(element: E) {
    const size = this.size;
    if (size === 0) return 0;
    let i = 0;
    let index = 0;
    while (i < size) {
      const oldElement = this.getAt(i);
      if (oldElement !== element) {
        this.setAt(index, oldElement!);
        index += 1;
      }
      i += 1;
    }
    this.cut(index - 1);
    return this.size;
  }

  deleteByIterator(iter: DequeIterator<E>) {
    const index = iter.index;
    this.deleteAt(index);
    iter = iter.next();
    return iter;
  }

  findIterator(element: E) {
    for (let i = 0; i < this.size; ++i) {
      if (this.getAt(i) === element) {
        return new DequeIterator<E>(i, this);
      }
    }
    return this.end();
  }

  reverse() {
    this._buckets.reverse().forEach(function (bucket) {
      bucket.reverse();
    });
    const { _bucketFirst, _bucketLast, _firstInBucket, _lastInBucket } = this;
    this._bucketFirst = this._bucketCount - _bucketLast - 1;
    this._bucketLast = this._bucketCount - _bucketFirst - 1;
    this._firstInBucket = this._bucketSize - _lastInBucket - 1;
    this._lastInBucket = this._bucketSize - _firstInBucket - 1;
    return this;
  }

  unique() {
    if (this.size <= 1) {
      return this.size;
    }
    let index = 1;
    let prev = this.getAt(0);
    for (let i = 1; i < this.size; ++i) {
      const cur = this.getAt(i);
      if (cur !== prev) {
        prev = cur;
        this.setAt(index++, cur);
      }
    }
    this.cut(index - 1);
    return this.size;
  }

  sort(comparator?: (x: E, y: E) => number) {
    const arr: E[] = [];
    for (let i = 0; i < this.size; ++i) {
      arr.push(this.getAt(i));
    }
    arr.sort(comparator);
    for (let i = 0; i < this.size; ++i) {
      this.setAt(i, arr[i]);
    }
    return this;
  }

  shrinkToFit() {
    if (this.size === 0) return;
    const newBuckets = [];
    if (this._bucketFirst === this._bucketLast) return;
    else if (this._bucketFirst < this._bucketLast) {
      for (let i = this._bucketFirst; i <= this._bucketLast; ++i) {
        newBuckets.push(this._buckets[i]);
      }
    } else {
      for (let i = this._bucketFirst; i < this._bucketCount; ++i) {
        newBuckets.push(this._buckets[i]);
      }
      for (let i = 0; i <= this._bucketLast; ++i) {
        newBuckets.push(this._buckets[i]);
      }
    }
    this._bucketFirst = 0;
    this._bucketLast = newBuckets.length - 1;
    this._buckets = newBuckets;
  }

  forEach(callback: (element: E, index: number, deque: Deque<E>) => void) {
    for (let i = 0; i < this.size; ++i) {
      callback(this.getAt(i), i, this);
    }
  }

  find(callback: (element: E, index: number, deque: Deque<E>) => boolean): E | undefined {
    for (let i = 0; i < this.size; ++i) {
      const element = this.getAt(i);
      if (callback(element, i, this)) {
        return element;
      }
    }
    return undefined;
  }

  toArray(): E[] {
    const arr: E[] = [];
    for (let i = 0; i < this.size; ++i) {
      arr.push(this.getAt(i));
    }
    return arr;
  }

  map<T>(callback: (element: E, index: number, deque: Deque<E>) => T): Deque<T> {
    const newDeque = new Deque<T>([], this._bucketSize);
    for (let i = 0; i < this.size; ++i) {
      newDeque.push(callback(this.getAt(i), i, this));
    }
    return newDeque;
  }

  filter(predicate: (element: E, index: number, deque: Deque<E>) => boolean): Deque<E> {
    const newDeque = new Deque<E>([], this._bucketSize);
    for (let i = 0; i < this.size; ++i) {
      const element = this.getAt(i);
      if (predicate(element, i, this)) {
        newDeque.push(element);
      }
    }
    return newDeque;
  }

  reduce<T>(callback: (accumulator: T, element: E, index: number, deque: Deque<E>) => T, initialValue: T): T {
    let accumulator = initialValue;
    for (let i = 0; i < this.size; ++i) {
      accumulator = callback(accumulator, this.getAt(i), i, this);
    }
    return accumulator;
  }

  indexOf(element: E): number {
    for (let i = 0; i < this.size; ++i) {
      if (this.getAt(i) === element) {
        return i;
      }
    }
    return -1;
  }

  * [Symbol.iterator]() {
    for (let i = 0; i < this.size; ++i) {
      yield this.getAt(i);
    }
  }

  protected _reallocate(needBucketNum?: number) {
    const newBuckets = [];
    const addBucketNum = needBucketNum || this._bucketCount >> 1 || 1;
    for (let i = 0; i < addBucketNum; ++i) {
      newBuckets[i] = new Array(this._bucketSize);
    }
    for (let i = this._bucketFirst; i < this._bucketCount; ++i) {
      newBuckets[newBuckets.length] = this._buckets[i];
    }
    for (let i = 0; i < this._bucketLast; ++i) {
      newBuckets[newBuckets.length] = this._buckets[i];
    }
    newBuckets[newBuckets.length] = [...this._buckets[this._bucketLast]];
    this._bucketFirst = addBucketNum;
    this._bucketLast = newBuckets.length - 1;
    for (let i = 0; i < addBucketNum; ++i) {
      newBuckets[newBuckets.length] = new Array(this._bucketSize);
    }
    this._buckets = newBuckets;
    this._bucketCount = newBuckets.length;
  }

  protected _getBucketAndPosition(pos: number) {
    let bucketIndex: number;
    let indexInBucket: number;

    const overallIndex = this._firstInBucket + pos;
    bucketIndex = this._bucketFirst + Math.floor(overallIndex / this._bucketSize);

    if (bucketIndex >= this._bucketCount) {
      bucketIndex -= this._bucketCount;
    }

    indexInBucket = (overallIndex + 1) % this._bucketSize - 1;
    if (indexInBucket < 0) {
      indexInBucket = this._bucketSize - 1;
    }

    return { bucketIndex, indexInBucket };
  }
}

// O(1) time complexity of obtaining the element
// O(n) time complexity of adding at the beginning and the end
// todo tested slowest one
export class ObjectDeque<E = number> {
  constructor(capacity?: number) {
    if (capacity !== undefined) this._capacity = capacity;
  }

  protected _nodes: { [key: number]: E } = {};

  get nodes(): { [p: number]: E } {
    return this._nodes;
  }

  protected _capacity = Number.MAX_SAFE_INTEGER;

  get capacity(): number {
    return this._capacity;
  }

  protected _first = -1;

  get first(): number {
    return this._first;
  }

  protected _last = -1;

  get last(): number {
    return this._last;
  }

  protected _size = 0;

  get size(): number {
    return this._size;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The "addFirst" function adds an element to the beginning of an array-like data structure.
   * @param {E} element - The `element` parameter represents the element that you want to add to the beginning of the data
   * structure.
   */
  addFirst(element: E) {
    if (this.size === 0) {
      const mid = Math.floor(this.capacity / 2);
      this._first = mid;
      this._last = mid;
    } else {
      this._first--;
    }
    this.nodes[this.first] = element;
    this._size++;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The addLast function adds an element to the end of an array-like data structure.
   * @param {E} element - The `element` parameter represents the element that you want to add to the end of the data structure.
   */
  addLast(element: E) {
    if (this.size === 0) {
      const mid = Math.floor(this.capacity / 2);
      this._first = mid;
      this._last = mid;
    } else {
      this._last++;
    }
    this.nodes[this.last] = element;
    this._size++;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `popFirst()` removes and returns the first element in a data structure.
   * @returns The element of the first element in the data structure.
   */
  popFirst() {
    if (!this.size) return;
    const element = this.getFirst();
    delete this.nodes[this.first];
    this._first++;
    this._size--;
    return element;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `getFirst` function returns the first element in an array-like data structure if it exists.
   * @returns The element at the first position of the `_nodes` array.
   */
  getFirst() {
    if (this.size) return this.nodes[this.first];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `popLast()` function removes and returns the last element in a data structure.
   * @returns The element that was removed from the data structure.
   */
  popLast() {
    if (!this.size) return;
    const element = this.getLast();
    delete this.nodes[this.last];
    this._last--;
    this._size--;

    return element;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `getLast()` function returns the last element in an array-like data structure.
   * @returns The last element in the array "_nodes" is being returned.
   */
  getLast() {
    if (this.size) return this.nodes[this.last];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The get function returns the element at the specified index in an array-like data structure.
   * @param {number} index - The index parameter is a number that represents the position of the element you want to
   * retrieve from the array.
   * @returns The element at the specified index in the `_nodes` array is being returned. If there is no element at that
   * index, `undefined` is returned.
   */
  get(index: number) {
    return this.nodes[this.first + index] || undefined;
  }

  /**
   * The function checks if the size of a data structure is less than or equal to zero.
   * @returns The method is returning a boolean element indicating whether the size of the object is less than or equal to 0.
   */
  isEmpty() {
    return this.size <= 0;
  }
}