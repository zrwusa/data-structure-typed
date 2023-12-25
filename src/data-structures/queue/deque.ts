/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { DequeOptions, ElementCallback, IterableWithSizeOrLength } from '../../types';
import { IterableElementBase } from '../base';
import { calcMinUnitsRequired, rangeCheck } from '../../utils';

/**
 * 1. Operations at Both Ends: Supports adding and removing elements at both the front and back of the queue. This allows it to be used as a stack (last in, first out) and a queue (first in, first out).
 * 2. Efficient Random Access: Being based on an array, it offers fast random access capability, allowing constant time access to any element.
 * 3. Continuous Memory Allocation: Since it is based on an array, all elements are stored contiguously in memory, which can bring cache friendliness and efficient memory access.
 * 4. Efficiency: Adding and removing elements at both ends of a deque is usually very fast. However, when the dynamic array needs to expand, it may involve copying the entire array to a larger one, and this operation has a time complexity of O(n).
 * 5. Performance jitter: Deque may experience performance jitter, but DoublyLinkedList will not
 */
export class Deque<E> extends IterableElementBase<E> {
  protected _bucketFirst = 0;
  protected _firstInBucket = 0;
  protected _bucketLast = 0;
  protected _lastInBucket = 0;
  protected _bucketCount = 0;
  protected readonly _bucketSize: number = 1 << 12;

  constructor(elements: IterableWithSizeOrLength<E> = [], options?: DequeOptions) {
    super();

    if (options) {
      const { bucketSize } = options;
      if (typeof bucketSize === 'number') this._bucketSize = bucketSize;
    }

    let _size: number;
    if ('length' in elements) {
      if (elements.length instanceof Function) _size = elements.length();
      else _size = elements.length;
    } else {
      if (elements.size instanceof Function) _size = elements.size();
      else _size = elements.size;
    }

    this._bucketCount = calcMinUnitsRequired(_size, this._bucketSize) || 1;
    for (let i = 0; i < this._bucketCount; ++i) {
      this._buckets.push(new Array(this._bucketSize));
    }
    const needBucketNum = calcMinUnitsRequired(_size, this._bucketSize);
    this._bucketFirst = this._bucketLast = (this._bucketCount >> 1) - (needBucketNum >> 1);
    this._firstInBucket = this._lastInBucket = (this._bucketSize - (_size % this._bucketSize)) >> 1;

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

  /**
   * The function returns the first element in a collection if it exists, otherwise it returns
   * undefined.
   * @returns The first element of the collection, of type E, is being returned.
   */
  get first(): E | undefined {
    if (this.size === 0) return;
    return this._buckets[this._bucketFirst][this._firstInBucket];
  }

  get last(): E | undefined {
    if (this.size === 0) return;
    return this._buckets[this._bucketLast][this._lastInBucket];
  }

  /**
   * Time Complexity - Amortized O(1) (possible reallocation)
   * Space Complexity - O(n) (due to potential resizing).
   */

  /**
   * Time Complexity - Amortized O(1) (possible reallocation),
   * Space Complexity - O(n) (due to potential resizing).
   *
   * The push function adds an element to a data structure and reallocates memory if necessary.
   * @param {E} element - The `element` parameter represents the value that you want to add to the data
   * structure.
   * @returns The size of the data structure after the element has been pushed.
   */
  push(element: E): boolean {
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
      if (this._bucketLast === this._bucketFirst && this._lastInBucket === this._firstInBucket) this._reallocate();
    }
    this._size += 1;
    this._buckets[this._bucketLast][this._lastInBucket] = element;
    return true;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `pop()` function removes and returns the last element from a data structure, updating the
   * internal state variables accordingly.
   * @returns The element that was removed from the data structure is being returned.
   */
  pop(): E | undefined {
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

  /**
   * Time Complexity: Amortized O(1)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: Amortized O(1)
   * Space Complexity: O(n)
   *
   * The `unshift` function adds an element to the beginning of an array-like data structure and
   * returns the new size of the structure.
   * @param {E} element - The `element` parameter represents the element that you want to add to the
   * beginning of the data structure.
   * @returns The size of the data structure after the element has been added.
   */
  unshift(element: E): boolean {
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
      if (this._bucketFirst === this._bucketLast && this._firstInBucket === this._lastInBucket) this._reallocate();
    }
    this._size += 1;
    this._buckets[this._bucketFirst][this._firstInBucket] = element;
    return true;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift()` function removes and returns the first element from a data structure, updating the
   * internal state variables accordingly.
   * @returns The element that is being removed from the beginning of the data structure is being
   * returned.
   */
  shift(): E | undefined {
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

  /**
   * Time Complexity: O(1) - Removes the last element.
   * Space Complexity: O(1) - Operates in-place.
   */

  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * The clear() function resets the state of the object by initializing all variables to their default
   * values.
   */
  clear(): void {
    this._buckets = [new Array(this._bucketSize)];
    this._bucketCount = 1;
    this._bucketFirst = this._bucketLast = this._size = 0;
    this._firstInBucket = this._lastInBucket = this._bucketSize >> 1;
  }

  /**
   * The below function is a generator that yields elements from a collection one by one.
   */
  *begin(): Generator<E> {
    let index = 0;
    while (index < this.size) {
      yield this.getAt(index);
      index++;
    }
  }

  /**
   * The function `reverseBegin()` is a generator that yields elements in reverse order starting from
   * the last element.
   */
  *reverseBegin(): Generator<E> {
    let index = this.size - 1;
    while (index >= 0) {
      yield this.getAt(index);
      index--;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `getAt` function retrieves an element at a specified position in an array-like data structure.
   * @param {number} pos - The `pos` parameter represents the position of the element that you want to
   * retrieve from the data structure. It is of type `number` and should be a valid index within the
   * range of the data structure.
   * @returns The element at the specified position in the data structure is being returned.
   */
  getAt(pos: number): E {
    rangeCheck(pos, 0, this.size - 1);
    const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
    return this._buckets[bucketIndex][indexInBucket]!;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `setAt` function sets an element at a specific position in an array-like data structure.
   * @param {number} pos - The `pos` parameter represents the position at which the element needs to be
   * set. It is of type `number`.
   * @param {E} element - The `element` parameter is the value that you want to set at the specified
   * position in the data structure.
   */
  setAt(pos: number, element: E): boolean {
    rangeCheck(pos, 0, this.size - 1);
    const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
    this._buckets[bucketIndex][indexInBucket] = element;
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `addAt` function inserts one or more elements at a specified position in an array-like data
   * structure.
   * @param {number} pos - The `pos` parameter represents the position at which the element(s) should
   * be inserted. It is of type `number`.
   * @param {E} element - The `element` parameter represents the element that you want to insert into
   * the array at the specified position.
   * @param [num=1] - The `num` parameter represents the number of times the `element` should be
   * inserted at the specified position (`pos`). By default, it is set to 1, meaning that the `element`
   * will be inserted once. However, you can provide a different value for `num` if you want
   * @returns The size of the array after the insertion is being returned.
   */
  addAt(pos: number, element: E, num = 1): boolean {
    const length = this.size;
    rangeCheck(pos, 0, length);
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
    return true;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `cut` function updates the state of the object based on the given position and returns the
   * updated size.
   * @param {number} pos - The `pos` parameter represents the position at which the string should be
   * cut. It is a number that indicates the index of the character where the cut should be made.
   * @returns The method is returning the updated size of the data structure.
   */
  cut(pos: number): number {
    if (pos < 0) {
      this.clear();
      return 0;
    }
    const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
    this._bucketLast = bucketIndex;
    this._lastInBucket = indexInBucket;
    this._size = pos + 1;
    return this.size;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `deleteAt` function removes an element at a specified position in an array-like data
   * structure.
   * @param {number} pos - The `pos` parameter in the `deleteAt` function represents the position at
   * which an element needs to be deleted from the data structure. It is of type `number` and indicates
   * the index of the element to be deleted.
   * @returns The size of the data structure after the deletion operation is performed.
   */
  deleteAt(pos: number): boolean {
    rangeCheck(pos, 0, this.size - 1);
    if (pos === 0) this.shift();
    else if (pos === this.size - 1) this.pop();
    else {
      const length = this.size - 1;
      let { bucketIndex: curBucket, indexInBucket: curPointer } = this._getBucketAndPosition(pos);
      for (let i = pos; i < length; ++i) {
        const { bucketIndex: nextBucket, indexInBucket: nextPointer } = this._getBucketAndPosition(pos + 1);
        this._buckets[curBucket][curPointer] = this._buckets[nextBucket][nextPointer];
        curBucket = nextBucket;
        curPointer = nextPointer;
      }
      this.pop();
    }
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes all occurrences of a specified element from an array-like data
   * structure.
   * @param {E} element - The `element` parameter represents the element that you want to delete from
   * the data structure.
   * @returns The size of the data structure after the element has been deleted.
   */
  delete(element: E): boolean {
    const size = this.size;
    if (size === 0) return false;
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
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The reverse() function reverses the order of the buckets and the elements within each bucket in a
   * data structure.
   * @returns The reverse() method is returning the object itself (this) after performing the reverse
   * operation on the buckets and updating the relevant properties.
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
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `unique()` function removes duplicate elements from an array-like data structure and returns
   * the number of unique elements.
   * @returns The size of the modified array is being returned.
   */
  unique(): this {
    if (this.size <= 1) {
      return this;
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
    return this;
  }

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * The `sort` function sorts the elements in a data structure using a provided comparator function.
   * @param [comparator] - The `comparator` parameter is a function that takes in two elements `x` and
   * `y` of type `E` and returns a number. The comparator function is used to determine the order of
   * the elements in the sorted array.
   * @returns Deque<E>
   */
  sort(comparator?: (x: E, y: E) => number): this {
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

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `shrinkToFit` function reorganizes the elements in an array-like data structure to minimize
   * memory usage.
   * @returns Nothing is being returned. The function is using the `return` statement to exit early if
   * `this.size` is 0, but it does not return any value.
   */
  shrinkToFit(): void {
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

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `find` function iterates over the elements in a deque and returns the first element for which
   * the callback function returns true, or undefined if no such element is found.
   * @param callback - A function that takes three parameters: element, index, and deque. It should
   * return a boolean value indicating whether the element satisfies a certain condition.
   * @returns The method `find` returns the first element in the deque that satisfies the condition
   * specified by the callback function. If no element satisfies the condition, it returns `undefined`.
   */
  find(callback: (element: E, index: number, deque: Deque<E>) => boolean): E | undefined {
    for (let i = 0; i < this.size; ++i) {
      const element = this.getAt(i);
      if (callback(element, i, this)) {
        return element;
      }
    }
    return;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function "indexOf" returns the index of the first occurrence of a given element in an array,
   * or -1 if the element is not found.
   * @param {E} element - The "element" parameter represents the element that you want to find the
   * index of in the data structure.
   * @returns The indexOf function returns the index of the first occurrence of the specified element
   * in the data structure. If the element is not found, it returns -1.
   */
  indexOf(element: E): number {
    for (let i = 0; i < this.size; ++i) {
      if (this.getAt(i) === element) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `toArray` function converts the elements of a data structure into an array.
   * @returns The `toArray()` method is returning an array of elements of type `E`.
   */
  toArray(): E[] {
    return [...this];
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new deque containing elements from the original deque that satisfy
   * a given predicate function.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * the current element being iterated over, the index of the current element, and the deque itself.
   * It should return a boolean value indicating whether the element should be included in the filtered
   * deque or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `predicate` function. If `thisArg` is
   * @returns The `filter` method is returning a new `Deque` object that contains the elements that
   * satisfy the given predicate function.
   */
  filter(predicate: ElementCallback<E, boolean>, thisArg?: any): Deque<E> {
    const newDeque = new Deque<E>([], { bucketSize: this._bucketSize });
    let index = 0;
    for (const el of this) {
      if (predicate.call(thisArg, el, index, this)) {
        newDeque.push(el);
      }
      index++;
    }
    return newDeque;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new Deque by applying a callback function to each element of the
   * original Deque.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the deque. It takes three arguments:
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns a new Deque object with the mapped values.
   */
  map<T>(callback: ElementCallback<E, T>, thisArg?: any): Deque<T> {
    const newDeque = new Deque<T>([], { bucketSize: this._bucketSize });
    let index = 0;
    for (const el of this) {
      newDeque.push(callback.call(thisArg, el, index, this));
      index++;
    }
    return newDeque;
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
  addLast(element: E): boolean {
    return this.push(element);
  }

  /**
   * Time Complexity: O(1) - Removes the first element.
   * Space Complexity: O(1) - In-place operation.
   */

  /**
   * Time Complexity: O(1) - Removes the last element.
   * Space Complexity: O(1) - Operates in-place.
   *
   * The function "pollLast" removes and returns the last element of an array.
   * @returns The last element of the array is being returned.
   */
  pollLast(): E | undefined {
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
  addFirst(element: E): boolean {
    return this.unshift(element);
  }

  /**
   * Time Complexity: O(1) - Removes the first element.
   * Space Complexity: O(1) - In-place operation.
   *
   * The function "pollFirst" removes and returns the first element of an array.
   * @returns The method `pollFirst()` is returning the first element of the array after removing it
   * from the beginning. If the array is empty, it will return `undefined`.
   */
  pollFirst(): E | undefined {
    return this.shift();
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The above function is an implementation of the iterator protocol in TypeScript, allowing the
   * object to be iterated over using a for...of loop.
   */
  protected *_getIterator(): IterableIterator<E> {
    for (let i = 0; i < this.size; ++i) {
      yield this.getAt(i);
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `_reallocate` function reallocates the buckets in an array, adding new buckets if needed.
   * @param {number} [needBucketNum] - The `needBucketNum` parameter is an optional number that
   * specifies the number of new buckets needed. If not provided, it will default to half of the
   * current bucket count (`this._bucketCount >> 1`) or 1 if the current bucket count is less than 2.
   */
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

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function calculates the bucket index and index within the bucket based on the given position.
   * @param {number} pos - The `pos` parameter represents the position within the data structure. It is
   * a number that indicates the index or position of an element within the structure.
   * @returns an object with two properties: "bucketIndex" and "indexInBucket".
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
}
