/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  DequeOptions,
  ElementCallback,
  IterableElementBaseOptions,
  IterableWithSizeOrLength,
  LinearBaseOptions
} from '../../types';
import { calcMinUnitsRequired, rangeCheck } from '../../utils';
import { LinearBase } from '../base/linear-base';

/**
 * Deque implemented with circular buckets allowing O(1) amortized push/pop at both ends.
 * @remarks Time O(1), Space O(1)
 * @template E
 * @template R
 * 1. Operations at Both Ends: Supports adding and removing elements at both the front and back of the queue. This allows it to be used as a stack (last in, first out) and a queue (first in, first out).
 * 2. Efficient Random Access: Being based on an array, it offers fast random access capability, allowing constant time access to any element.
 * 3. Continuous Memory Allocation: Since it is based on an array, all elements are stored contiguously in memory, which can bring cache friendliness and efficient memory access.
 * 4. Efficiency: Adding and removing elements at both ends of a deque is usually very fast. However, when the dynamic array needs to expand, it may involve copying the entire array to a larger one, and this operation has a time complexity of O(n).
 * 5. Performance jitter: Deque may experience performance jitter, but DoublyLinkedList will not
 * @example
 * // basic Deque creation and push/pop operations
 *  // Create a simple Deque with initial values
 *     const deque = new Deque([1, 2, 3, 4, 5]);
 *
 *     // Verify the deque maintains insertion order
 *     console.log([...deque]); // [1, 2, 3, 4, 5];
 *
 *     // Check length
 *     console.log(deque.length); // 5;
 *
 *     // Push to the end
 *     deque.push(6);
 *     console.log(deque.length); // 6;
 *
 *     // Pop from the end
 *     const last = deque.pop();
 *     console.log(last); // 6;
 * @example
 * // Deque shift and unshift operations
 *  const deque = new Deque<number>([20, 30, 40]);
 *
 *     // Unshift adds to the front
 *     deque.unshift(10);
 *     console.log([...deque]); // [10, 20, 30, 40];
 *
 *     // Shift removes from the front (O(1) complexity!)
 *     const first = deque.shift();
 *     console.log(first); // 10;
 *
 *     // Verify remaining elements
 *     console.log([...deque]); // [20, 30, 40];
 *     console.log(deque.length); // 3;
 * @example
 * // Deque peek at both ends
 *  const deque = new Deque<number>([10, 20, 30, 40, 50]);
 *
 *     // Get first element without removing
 *     const first = deque.at(0);
 *     console.log(first); // 10;
 *
 *     // Get last element without removing
 *     const last = deque.at(deque.length - 1);
 *     console.log(last); // 50;
 *
 *     // Length unchanged
 *     console.log(deque.length); // 5;
 * @example
 * // Deque for...of iteration and reverse
 *  const deque = new Deque<string>(['A', 'B', 'C', 'D']);
 *
 *     // Iterate forward
 *     const forward: string[] = [];
 *     for (const item of deque) {
 *       forward.push(item);
 *     }
 *     console.log(forward); // ['A', 'B', 'C', 'D'];
 *
 *     // Reverse the deque
 *     deque.reverse();
 *     const backward: string[] = [];
 *     for (const item of deque) {
 *       backward.push(item);
 *     }
 *     console.log(backward); // ['D', 'C', 'B', 'A'];
 * @example
 * // Deque as sliding window for stream processing
 *  interface DataPoint {
 *       timestamp: number;
 *       value: number;
 *       sensor: string;
 *     }
 *
 *     // Create a deque-based sliding window for real-time data aggregation
 *     const windowSize = 3;
 *     const dataWindow = new Deque<DataPoint>();
 *
 *     // Simulate incoming sensor data stream
 *     const incomingData: DataPoint[] = [
 *       { timestamp: 1000, value: 25.5, sensor: 'temp-01' },
 *       { timestamp: 1100, value: 26.2, sensor: 'temp-01' },
 *       { timestamp: 1200, value: 25.8, sensor: 'temp-01' },
 *       { timestamp: 1300, value: 27.1, sensor: 'temp-01' },
 *       { timestamp: 1400, value: 26.9, sensor: 'temp-01' }
 *     ];
 *
 *     const windowResults: Array<{ avgValue: number; windowSize: number }> = [];
 *
 *     for (const dataPoint of incomingData) {
 *       // Add new data to the end
 *       dataWindow.push(dataPoint);
 *
 *       // Remove oldest data when window exceeds size (O(1) from front)
 *       if (dataWindow.length > windowSize) {
 *         dataWindow.shift();
 *       }
 *
 *       // Calculate average of current window
 *       let sum = 0;
 *       for (const point of dataWindow) {
 *         sum += point.value;
 *       }
 *       const avg = sum / dataWindow.length;
 *
 *       windowResults.push({
 *         avgValue: Math.round(avg * 10) / 10,
 *         windowSize: dataWindow.length
 *       });
 *     }
 *
 *     // Verify sliding window behavior
 *     console.log(windowResults.length); // 5;
 *     console.log(windowResults[0].windowSize); // 1; // First window has 1 element
 *     console.log(windowResults[2].windowSize); // 3; // Windows are at max size from 3rd onwards
 *     console.log(windowResults[4].windowSize); // 3; // Last window still has 3 elements
 *     console.log(dataWindow.length); // 3;
 */
export class Deque<E = any, R = any> extends LinearBase<E, R> {
  protected _equals: (a: E, b: E) => boolean = Object.is as unknown as (a: E, b: E) => boolean;

  /**
   * Create a Deque and optionally bulk-insert elements.
   * @remarks Time O(N), Space O(N)
   * @param [elements] - Iterable (or iterable-like) of elements/records to insert.
   * @param [options] - Options such as bucketSize, toElementFn, and maxLen.
   * @returns New Deque instance.
   */

  constructor(elements: IterableWithSizeOrLength<E> | IterableWithSizeOrLength<R> = [], options?: DequeOptions<E, R>) {
    super(options);

    if (options) {
      const { bucketSize } = options;
      if (typeof bucketSize === 'number') this._bucketSize = bucketSize;
    }

    let _size: number;
    if ('length' in elements) {
      _size = typeof elements.length === 'function' ? elements.length() : elements.length;
    } else {
      _size = typeof elements.size === 'function' ? elements.size() : elements.size;
    }

    this._bucketCount = calcMinUnitsRequired(_size, this._bucketSize) || 1;
    for (let i = 0; i < this._bucketCount; ++i) {
      this._buckets.push(new Array(this._bucketSize));
    }
    const needBucketNum = calcMinUnitsRequired(_size, this._bucketSize);
    this._bucketFirst = this._bucketLast = (this._bucketCount >> 1) - (needBucketNum >> 1);
    this._firstInBucket = this._lastInBucket = (this._bucketSize - (_size % this._bucketSize)) >> 1;
    this.pushMany(elements);
  }

  protected _bucketSize: number = 1 << 12;

  /**
   * Get the current bucket size.
   * @remarks Time O(1), Space O(1)
   * @returns Bucket capacity per bucket.
   */

  get bucketSize() {
    return this._bucketSize;
  }

  protected _bucketFirst = 0;

  /**
   * Get the index of the first bucket in use.
   * @remarks Time O(1), Space O(1)
   * @returns Zero-based bucket index.
   */

  get bucketFirst(): number {
    return this._bucketFirst;
  }

  protected _firstInBucket = 0;

  /**
   * Get the index inside the first bucket.
   * @remarks Time O(1), Space O(1)
   * @returns Zero-based index within the first bucket.
   */

  get firstInBucket(): number {
    return this._firstInBucket;
  }

  protected _bucketLast = 0;

  /**
   * Get the index of the last bucket in use.
   * @remarks Time O(1), Space O(1)
   * @returns Zero-based bucket index.
   */

  get bucketLast(): number {
    return this._bucketLast;
  }

  protected _lastInBucket = 0;

  /**
   * Get the index inside the last bucket.
   * @remarks Time O(1), Space O(1)
   * @returns Zero-based index within the last bucket.
   */

  get lastInBucket(): number {
    return this._lastInBucket;
  }

  protected _bucketCount = 0;

  /**
   * Get the number of buckets allocated.
   * @remarks Time O(1), Space O(1)
   * @returns Bucket count.
   */

  get bucketCount(): number {
    return this._bucketCount;
  }

  protected _buckets: E[][] = [];

  /**
   * Get the internal buckets array.
   * @remarks Time O(1), Space O(1)
   * @returns Array of buckets storing values.
   */

  get buckets() {
    return this._buckets;
  }

  protected _length = 0;

  /**
   * Get the number of elements in the deque.
   * @remarks Time O(1), Space O(1)
   * @returns Current length.
   */

  get length() {
    return this._length;
  }

  /**
   * Get the first element without removing it.
   * @remarks Time O(1), Space O(1)
   * @returns First element or undefined.
   */

  get first(): E | undefined {
    if (this._length === 0) return;
    return this._buckets[this._bucketFirst][this._firstInBucket];
  }

  /**
   * Get the last element without removing it.
   * @remarks Time O(1), Space O(1)
   * @returns Last element or undefined.
   */

  get last(): E | undefined {
    if (this._length === 0) return;
    return this._buckets[this._bucketLast][this._lastInBucket];
  }

  /**
   * Create a Deque from an array of elements.
   * @remarks Time O(N), Space O(N)
   * @template E
   * @template R
   * @param this - Constructor (subclass) to instantiate.
   * @param data - Array of elements to insert in order.
   * @param [options] - Options forwarded to the constructor.
   * @returns A new Deque populated from the array.
   */

  static fromArray<E, R = any>(
    this: new (
      elements?: IterableWithSizeOrLength<E> | IterableWithSizeOrLength<R>,
      options?: DequeOptions<E, R>
    ) => any,
    data: E[],
    options?: DequeOptions<E, R>
  ) {
    return new this(data, options);
  }

  /**
   * Append one element at the back.
   * @remarks Time O(1) amortized, Space O(1)
   * @param element - Element to append.
   * @returns True when appended.
   */

  push(element: E): boolean {
    if (this._length) {
      if (this._lastInBucket < this._bucketSize - 1) {
        this._lastInBucket += 1;
      } else if (this._bucketLast < this._bucketCount - 1) {
        this._bucketLast += 1;
        this._lastInBucket = 0;
      } else {
        this._bucketLast = 0;
        this._lastInBucket = 0;
      }
      if (this._bucketLast === this._bucketFirst && this._lastInBucket === this._firstInBucket) this._reallocate();
    }
    this._length += 1;
    this._buckets[this._bucketLast][this._lastInBucket] = element;
    if (this._maxLen > 0 && this._length > this._maxLen) this.shift();
    return true;
  }

  /**
   * Remove and return the last element.
   * @remarks Time O(1), Space O(1)
   * @returns Removed element or undefined.
   */

  pop(): E | undefined {
    if (this._length === 0) return;
    const element = this._buckets[this._bucketLast][this._lastInBucket];
    if (this._length !== 1) {
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
    this._length -= 1;
    return element;
  }

  /**
   * Remove and return the first element.
   * @remarks Time O(1) amortized, Space O(1)
   * @returns Removed element or undefined.
   */

  shift(): E | undefined {
    if (this._length === 0) return;
    const element = this._buckets[this._bucketFirst][this._firstInBucket];
    if (this._length !== 1) {
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
    this._length -= 1;
    return element;
  }

  /**
   * Prepend one element at the front.
   * @remarks Time O(1) amortized, Space O(1)
   * @param element - Element to prepend.
   * @returns True when prepended.
   */

  unshift(element: E): boolean {
    if (this._length) {
      if (this._firstInBucket > 0) {
        this._firstInBucket -= 1;
      } else if (this._bucketFirst > 0) {
        this._bucketFirst -= 1;
        this._firstInBucket = this._bucketSize - 1;
      } else {
        this._bucketFirst = this._bucketCount - 1;
        this._firstInBucket = this._bucketSize - 1;
      }
      if (this._bucketFirst === this._bucketLast && this._firstInBucket === this._lastInBucket) this._reallocate();
    }
    this._length += 1;
    this._buckets[this._bucketFirst][this._firstInBucket] = element;
    if (this._maxLen > 0 && this._length > this._maxLen) this.pop();
    return true;
  }

  /**
   * Append a sequence of elements.
   * @remarks Time O(N), Space O(1)
   * @param elements - Iterable (or iterable-like) of elements/records.
   * @returns Array of per-element success flags.
   */

  pushMany(elements: IterableWithSizeOrLength<E> | IterableWithSizeOrLength<R>) {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) {
        ans.push(this.push(this.toElementFn(el as R)));
      } else {
        ans.push(this.push(el as E));
      }
    }
    return ans;
  }

  /**
   * Prepend a sequence of elements.
   * @remarks Time O(N), Space O(1)
   * @param [elements] - Iterable (or iterable-like) of elements/records.
   * @returns Array of per-element success flags.
   */

  unshiftMany(elements: IterableWithSizeOrLength<E> | IterableWithSizeOrLength<R> = []) {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) {
        ans.push(this.unshift(this.toElementFn(el as R)));
      } else {
        ans.push(this.unshift(el as E));
      }
    }
    return ans;
  }

  /**
   * Check whether the deque is empty.
   * @remarks Time O(1), Space O(1)
   * @returns True if length is 0.
   */

  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Remove all elements and reset structure.
   * @remarks Time O(1), Space O(1)
   * @returns void
   */

  clear(): void {
    this._buckets = [new Array(this._bucketSize)];
    this._bucketCount = 1;
    this._bucketFirst = this._bucketLast = this._length = 0;
    this._firstInBucket = this._lastInBucket = this._bucketSize >> 1;
  }

  /**
   * Get the element at a given position.
   * @remarks Time O(1), Space O(1)
   * @param pos - Zero-based position from the front.
   * @returns Element or undefined.
   */

  at(pos: number): E | undefined {
    if (pos < 0 || pos >= this._length) return undefined;
    const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
    return this._buckets[bucketIndex][indexInBucket];
  }

  /**
   * Replace the element at a given position.
   * @remarks Time O(1), Space O(1)
   * @param pos - Zero-based position from the front.
   * @param element - New element value.
   * @returns True if updated.
   */

  setAt(pos: number, element: E): boolean {
    rangeCheck(pos, 0, this._length - 1);
    const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
    this._buckets[bucketIndex][indexInBucket] = element;
    return true;
  }

  /**
   * Insert repeated copies of an element at a position.
   * @remarks Time O(N), Space O(1)
   * @param pos - Zero-based position from the front.
   * @param element - Element to insert.
   * @param [num] - Number of times to insert (default 1).
   * @returns True if inserted.
   */

  addAt(pos: number, element: E, num = 1): boolean {
    const length = this._length;
    rangeCheck(pos, 0, length);
    if (pos === 0) {
      while (num--) this.unshift(element);
    } else if (pos === this._length) {
      while (num--) this.push(element);
    } else {
      const arr: E[] = [];
      for (let i = pos; i < this._length; ++i) {
        const v = this.at(i);
        if (v !== undefined) arr.push(v);
      }
      this.cut(pos - 1, true);
      for (let i = 0; i < num; ++i) this.push(element);
      for (let i = 0; i < arr.length; ++i) this.push(arr[i]);
    }
    return true;
  }

  /**
   * Cut the deque to keep items up to index; optionally mutate in-place.
   * @remarks Time O(N), Space O(1)
   * @param pos - Last index to keep.
   * @param [isCutSelf] - When true, mutate this deque; otherwise return a new deque.
   * @returns This deque if in-place; otherwise a new deque of the prefix.
   */

  cut(pos: number, isCutSelf = false): Deque<E> {
    if (isCutSelf) {
      if (pos < 0) {
        this.clear();
        return this;
      }
      const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
      this._bucketLast = bucketIndex;
      this._lastInBucket = indexInBucket;
      this._length = pos + 1;
      return this;
    } else {
      const newDeque = this._createInstance({ toElementFn: this._toElementFn, maxLen: this._maxLen });
      newDeque._setBucketSize(this._bucketSize);
      for (let i = 0; i <= pos; i++) {
        const v = this.at(i);
        if (v !== undefined) newDeque.push(v);
      }

      return newDeque;
    }
  }

  /**
   * Remove and/or insert elements at a position (array-like behavior).
   * @remarks Time O(N + M), Space O(M)
   * @param start - Start index (clamped to [0, length]).
   * @param [deleteCount] - Number of elements to remove (default: length - start).
   * @param [items] - Elements to insert after `start`.
   * @returns A new deque containing the removed elements (typed as `this`).
   */

  override splice(start: number, deleteCount: number = this._length - start, ...items: E[]): this {
    rangeCheck(start, 0, this._length);
    if (deleteCount < 0) deleteCount = 0;
    if (start + deleteCount > this._length) deleteCount = this._length - start;

    const removed = this._createInstance({ toElementFn: this._toElementFn, maxLen: this._maxLen });
    removed._setBucketSize(this._bucketSize);
    for (let i = 0; i < deleteCount; i++) {
      const v = this.at(start + i);
      if (v !== undefined) removed.push(v);
    }

    const tail: E[] = [];
    for (let i = start + deleteCount; i < this._length; i++) {
      const v = this.at(i);
      if (v !== undefined) tail.push(v);
    }

    this.cut(start - 1, true);

    for (const it of items) this.push(it);

    for (const v of tail) this.push(v);

    return removed as unknown as this;
  }

  /**
   * Cut the deque to keep items from index onward; optionally mutate in-place.
   * @remarks Time O(N), Space O(1)
   * @param pos - First index to keep.
   * @param [isCutSelf] - When true, mutate this deque; otherwise return a new deque.
   * @returns This deque if in-place; otherwise a new deque of the suffix.
   */

  cutRest(pos: number, isCutSelf = false): Deque<E> {
    if (isCutSelf) {
      if (pos < 0) {
        return this;
      }
      const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
      this._bucketFirst = bucketIndex;
      this._firstInBucket = indexInBucket;
      this._length = this._length - pos;
      return this;
    } else {
      const newDeque = this._createInstance({ toElementFn: this._toElementFn, maxLen: this._maxLen });
      newDeque._setBucketSize(this._bucketSize);
      if (pos < 0) pos = 0;
      for (let i = pos; i < this._length; i++) {
        const v = this.at(i);
        if (v !== undefined) newDeque.push(v);
      }
      return newDeque;
    }
  }

  /**
   * Delete the element at a given position.
   * @remarks Time O(N), Space O(1)
   * @param pos - Zero-based position from the front.
   * @returns Removed element or undefined.
   */

  deleteAt(pos: number): E | undefined {
    rangeCheck(pos, 0, this._length - 1);

    let deleted: E | undefined;
    if (pos === 0) {
      return this.shift();
    } else if (pos === this._length - 1) {
      deleted = this.last;
      this.pop();
      return deleted;
    } else {
      const length = this._length - 1;
      const { bucketIndex: targetBucket, indexInBucket: targetPointer } = this._getBucketAndPosition(pos);
      deleted = this._buckets[targetBucket][targetPointer];

      for (let i = pos; i < length; i++) {
        const { bucketIndex: curBucket, indexInBucket: curPointer } = this._getBucketAndPosition(i);
        const { bucketIndex: nextBucket, indexInBucket: nextPointer } = this._getBucketAndPosition(i + 1);
        this._buckets[curBucket][curPointer] = this._buckets[nextBucket][nextPointer];
      }

      this.pop();
      return deleted;
    }
  }

  /**
   * Delete the first occurrence of a value.
   * @remarks Time O(N), Space O(1)
   * @param element - Element to remove (using the configured equality).
   * @returns True if an element was removed.
   */

  delete(element: E): boolean {
    const size = this._length;
    if (size === 0) return false;
    let i = 0;
    let index = 0;
    while (i < size) {
      const oldElement = this.at(i);
      if (!this._equals(oldElement as E, element)) {
        this.setAt(index, oldElement!);
        index += 1;
      }
      i += 1;
    }
    this.cut(index - 1, true);
    return true;
  }

  /**
   * Delete the first element matching a predicate.
   * @remarks Time O(N), Space O(1)
   * @param predicate - Function (value, index, deque) → boolean.
   * @returns True if a match was removed.
   */

  deleteWhere(predicate: (value: E, index: number, deque: this) => boolean): boolean {
    for (let i = 0; i < this._length; i++) {
      const v = this.at(i);
      if (predicate(v as E, i, this)) {
        this.deleteAt(i);
        return true;
      }
    }
    return false;
  }

  /**
   * Set the equality comparator used by delete operations.
   * @remarks Time O(1), Space O(1)
   * @param equals - Equality predicate (a, b) → boolean.
   * @returns This deque.
   */

  setEquality(equals: (a: E, b: E) => boolean): this {
    this._equals = equals;
    return this;
  }

  /**
   * Reverse the deque by reversing buckets and pointers.
   * @remarks Time O(N), Space O(N)
   * @returns This deque.
   */

  reverse(): this {
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

  /**
   * Deduplicate consecutive equal elements in-place.
   * @remarks Time O(N), Space O(1)
   * @returns This deque.
   */

  unique(): this {
    if (this._length <= 1) {
      return this;
    }
    let index = 1;
    let prev = this.at(0);
    for (let i = 1; i < this._length; ++i) {
      const cur = this.at(i);
      if (!this._equals(cur as E, prev as E)) {
        prev = cur;
        this.setAt(index++, cur as E);
      }
    }
    this.cut(index - 1, true);
    return this;
  }

  /**
   * Trim unused buckets to fit exactly the active range.
   * @remarks Time O(N), Space O(1)
   * @returns void
   */

  shrinkToFit(): void {
    if (this._length === 0) return;
    const newBuckets = [] as E[][];
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

  /**
   * Deep clone this deque, preserving options.
   * @remarks Time O(N), Space O(N)
   * @returns A new deque with the same content and options.
   */

  clone(): this {
    return this._createLike<E, R>(this, {
      bucketSize: this.bucketSize,
      toElementFn: this.toElementFn,
      maxLen: this._maxLen
    }) as this;
  }

  /**
   * Filter elements into a new deque of the same class.
   * @remarks Time O(N), Space O(N)
   * @param predicate - Predicate (value, index, deque) → boolean to keep element.
   * @param [thisArg] - Value for `this` inside the predicate.
   * @returns A new deque with kept elements.
   */

  filter(predicate: ElementCallback<E, R, boolean>, thisArg?: any): this {
    const out = this._createInstance({ toElementFn: this.toElementFn, maxLen: this._maxLen });
    out._setBucketSize(this._bucketSize);
    let index = 0;
    for (const el of this) {
      if (predicate.call(thisArg, el, index, this)) out.push(el);
      index++;
    }
    return out;
  }

  /**
   * Map elements into a new deque of the same element type.
   * @remarks Time O(N), Space O(N)
   * @param callback - Mapping function (value, index, deque) → newValue.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new deque with mapped values.
   */

  mapSame(callback: ElementCallback<E, R, E>, thisArg?: any): this {
    const out = this._createInstance({ toElementFn: this._toElementFn, maxLen: this._maxLen });
    out._setBucketSize(this._bucketSize);
    let index = 0;
    for (const v of this) {
      const mv = thisArg === undefined ? callback(v, index++, this) : callback.call(thisArg, v, index++, this);
      out.push(mv);
    }
    return out;
  }

  /**
   * Map elements into a new deque (possibly different element type).
   * @remarks Time O(N), Space O(N)
   * @template EM
   * @template RM
   * @param callback - Mapping function (value, index, deque) → newElement.
   * @param [options] - Options for the output deque (e.g., bucketSize, toElementFn, maxLen).
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new Deque with mapped elements.
   */

  map<EM, RM>(
    callback: ElementCallback<E, R, EM>,
    options?: IterableElementBaseOptions<EM, RM>,
    thisArg?: any
  ): Deque<EM, RM> {
    const out = this._createLike<EM, RM>([], {
      ...(options ?? {}),
      bucketSize: this._bucketSize,
      maxLen: this._maxLen
    }) as Deque<EM, RM>;
    let index = 0;
    for (const el of this) {
      const mv = thisArg === undefined ? callback(el, index, this) : callback.call(thisArg, el, index, this);
      out.push(mv);
      index++;
    }
    return out;
  }

  /**
   * (Protected) Set the internal bucket size.
   * @remarks Time O(1), Space O(1)
   * @param size - Bucket capacity to assign.
   * @returns void
   */

  protected _setBucketSize(size: number): void {
    this._bucketSize = size;

    // When adjusting bucketSize on a freshly created empty deque (common in helpers like cut/splice/clone),
    // we must also realign internal pointers/buckets to avoid `_getBucketAndPosition` producing out-of-range
    // indices based on the previous bucketSize.
    if (this._length === 0) {
      this._buckets = [new Array(this._bucketSize)];
      this._bucketCount = 1;
      this._bucketFirst = this._bucketLast = 0;
      this._firstInBucket = this._lastInBucket = this._bucketSize >> 1;
    }
  }

  /**
   * (Protected) Iterate elements from front to back.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of elements.
   */

  protected *_getIterator(): IterableIterator<E> {
    for (let i = 0; i < this._length; ++i) {
      const v = this.at(i);
      if (v !== undefined) yield v;
    }
  }

  /**
   * (Protected) Reallocate buckets to make room near the ends.
   * @remarks Time O(N), Space O(N)
   * @param [needBucketNum] - How many extra buckets to add; defaults to half of current.
   * @returns void
   */

  protected _reallocate(needBucketNum?: number) {
    const newBuckets = [] as E[][];
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

  /**
   * (Protected) Translate a logical position to bucket/offset.
   * @remarks Time O(1), Space O(1)
   * @param pos - Zero-based position.
   * @returns An object containing bucketIndex and indexInBucket.
   */

  protected _getBucketAndPosition(pos: number) {
    let bucketIndex: number;
    let indexInBucket: number;

    const overallIndex = this._firstInBucket + pos;
    bucketIndex = this._bucketFirst + Math.floor(overallIndex / this._bucketSize);

    if (bucketIndex >= this._bucketCount) {
      bucketIndex -= this._bucketCount;
    }

    indexInBucket = ((overallIndex + 1) % this._bucketSize) - 1;
    if (indexInBucket < 0) {
      indexInBucket = this._bucketSize - 1;
    }

    return { bucketIndex, indexInBucket };
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind deque instance.
   */

  protected override _createInstance(options?: LinearBaseOptions<E, R>): this {
    const Ctor = this.constructor as new (
      elements?: IterableWithSizeOrLength<E> | IterableWithSizeOrLength<R>,
      options?: DequeOptions<E, R>
    ) => this;
    return new Ctor([], options as DequeOptions<E, R> | undefined);
  }

  /**
   * (Protected) Create a like-kind deque seeded by elements.
   * @remarks Time O(N), Space O(N)
   * @template T
   * @template RR
   * @param [elements] - Iterable used to seed the new deque.
   * @param [options] - Options forwarded to the constructor.
   * @returns A like-kind Deque instance.
   */

  protected _createLike<T = E, RR = R>(
    elements: IterableWithSizeOrLength<T> | IterableWithSizeOrLength<RR> = [],
    options?: DequeOptions<T, RR>
  ): any {
    const Ctor = this.constructor as new (
      elements?: IterableWithSizeOrLength<T> | IterableWithSizeOrLength<RR>,
      options?: DequeOptions<T, RR>
    ) => any;
    return new Ctor(elements, options);
  }

  /**
   * (Protected) Iterate elements from back to front.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of elements.
   */

  protected *_getReverseIterator(): IterableIterator<E> {
    for (let i = this._length - 1; i > -1; i--) {
      const v = this.at(i);
      if (v !== undefined) yield v;
    }
  }
}
