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
export class Deque<E = any, R = any> extends IterableElementBase<E, R, Deque<E, R>> {
  /**
   * The constructor initializes a Deque object with optional iterable of elements and options.
   * @param elements - An iterable object (such as an array or a Set) that contains the initial
   * elements to be added to the deque. It can also be an object with a `length` or `size` property
   * that represents the number of elements in the iterable object. If no elements are provided, an
   * empty deque
   * @param {DequeOptions} [options] - The `options` parameter is an optional object that can contain
   * configuration options for the deque. In this code, it is used to set the `bucketSize` option,
   * which determines the size of each bucket in the deque. If the `bucketSize` option is not provided
   * or is not a number
   */
  constructor(elements: IterableWithSizeOrLength<E> | IterableWithSizeOrLength<R> = [], options?: DequeOptions<E, R>) {
    super(options);

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

    for (const el of elements) {
      if (this.toElementFn) {
        this.push(this.toElementFn(el as R));
      } else {
        this.push(el as E);
      }
    }
  }

  protected _bucketSize: number = 1 << 12;

  /**
   * The bucketSize function returns the size of the bucket.
   *
   * @return The size of the bucket
   */
  get bucketSize() {
    return this._bucketSize;
  }

  protected _bucketFirst = 0;

  /**
   * The function returns the value of the protected variable `_bucketFirst`.
   * @returns The value of the `_bucketFirst` property.
   */
  get bucketFirst(): number {
    return this._bucketFirst;
  }

  protected _firstInBucket = 0;

  /**
   * The function returns the value of the protected variable _firstInBucket.
   * @returns The method is returning the value of the variable `_firstInBucket`, which is of type
   * `number`.
   */
  get firstInBucket(): number {
    return this._firstInBucket;
  }

  protected _bucketLast = 0;

  /**
   * The function returns the value of the protected variable `_bucketLast`.
   * @returns The value of the `_bucketLast` property, which is a number.
   */
  get bucketLast(): number {
    return this._bucketLast;
  }

  protected _lastInBucket = 0;

  /**
   * The function returns the value of the protected variable _lastInBucket.
   * @returns The method is returning the value of the variable `_lastInBucket`, which is of type
   * `number`.
   */
  get lastInBucket(): number {
    return this._lastInBucket;
  }

  protected _bucketCount = 0;

  /**
   * The function returns the number of buckets.
   * @returns The number of buckets.
   */
  get bucketCount(): number {
    return this._bucketCount;
  }

  protected _buckets: E[][] = [];

  /**
   * The buckets function returns the buckets property of the object.
   * @return The buckets property
   */
  get buckets() {
    return this._buckets;
  }

  protected _size = 0;

  /**
   * The size function returns the number of items in the stack.
   * @return The number of values in the set
   */
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

  /**
   * The last function returns the last element in the queue.
   * @return The last element in the array
   */
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if the size of an object is equal to zero and returns a boolean value.
   * @returns A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
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
  * begin(): Generator<E> {
    let index = 0;
    while (index < this.size) {
      yield this.at(index);
      index++;
    }
  }

  /**
   * The function `reverseBegin()` is a generator that yields elements in reverse order starting from
   * the last element.
   */
  * reverseBegin(): Generator<E> {
    let index = this.size - 1;
    while (index >= 0) {
      yield this.at(index);
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
   * The `at` function retrieves an element at a specified position in an array-like data structure.
   * @param {number} pos - The `pos` parameter represents the position of the element that you want to
   * retrieve from the data structure. It is of type `number` and should be a valid index within the
   * range of the data structure.
   * @returns The element at the specified position in the data structure is being returned.
   */
  at(pos: number): E {
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
        arr.push(this.at(i));
      }
      this.cut(pos - 1, true);
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
   * @param {boolean} isCutSelf - If true, the original deque will not be cut, and return a new deque
   * @returns The method is returning the updated size of the data structure.
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
      this._size = pos + 1;
      return this;
    } else {
      const newDeque = new Deque<E>([], { bucketSize: this._bucketSize });

      for (let i = 0; i <= pos; i++) {
        newDeque.push(this.at(i));
      }

      return newDeque;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1) or O(n)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1) or O(n)
   *
   * The `cutRest` function cuts the elements from a specified position in a deque and returns a new
   * deque with the cut elements.
   * @param {number} pos - The `pos` parameter represents the position from which to cut the Deque. It
   * is a number that indicates the index of the element in the Deque where the cut should start.
   * @param [isCutSelf=false] - isCutSelf is a boolean parameter that determines whether the original
   * Deque should be modified or a new Deque should be created. If isCutSelf is true, the original
   * Deque will be modified by cutting off elements starting from the specified position. If isCutSelf
   * is false, a new De
   * @returns The function `cutRest` returns either the modified original deque (`this`) or a new deque
   * (`newDeque`) depending on the value of the `isCutSelf` parameter.
   */
  cutRest(pos: number, isCutSelf = false): Deque<E> {
    if (isCutSelf) {
      if (pos < 0) {
        this.clear();
        return this;
      }
      const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
      this._bucketFirst = bucketIndex;
      this._firstInBucket = indexInBucket;
      this._size = this._size - pos;
      return this;
    } else {
      const newDeque = new Deque<E>([], { bucketSize: this._bucketSize });

      for (let i = pos; i < this.size; i++) {
        newDeque.push(this.at(i));
      }

      return newDeque;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1) or O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1) or O(n)
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
      const oldElement = this.at(i);
      if (oldElement !== element) {
        this.setAt(index, oldElement!);
        index += 1;
      }
      i += 1;
    }
    this.cut(index - 1, true);
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
    let prev = this.at(0);
    for (let i = 1; i < this.size; ++i) {
      const cur = this.at(i);
      if (cur !== prev) {
        prev = cur;
        this.setAt(index++, cur);
      }
    }
    this.cut(index - 1, true);
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
      arr.push(this.at(i));
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
   * The function "indexOf" returns the index of the first occurrence of a given element in an array,
   * or -1 if the element is not found.
   * @param {E} element - The "element" parameter represents the element that you want to find the
   * index of in the data structure.
   * @returns The indexOf function returns the index of the first occurrence of the specified element
   * in the data structure. If the element is not found, it returns -1.
   */
  indexOf(element: E): number {
    for (let i = 0; i < this.size; ++i) {
      if (this.at(i) === element) {
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
   * The `clone()` function returns a new instance of the `Deque` class with the same elements and
   * bucket size as the original instance.
   * @returns The `clone()` method is returning a new instance of the `Deque` class with the same
   * elements as the original deque (`this`) and the same bucket size.
   */
  clone(): Deque<E, R> {
    return new Deque<E, R>(this, { bucketSize: this.bucketSize, toElementFn: this.toElementFn });
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
  filter(predicate: ElementCallback<E, R, boolean, Deque<E, R>>, thisArg?: any): Deque<E, R> {
    const newDeque = new Deque<E, R>([], { bucketSize: this._bucketSize, toElementFn: this.toElementFn });
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
   * The `map` function takes a callback function and applies it to each element in the deque,
   * returning a new deque with the results.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * deque. It takes three arguments: the current element, the index of the element, and the deque
   * itself. It should return a value of type EM.
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be used to
   * transform the raw element (`RM`) into a new element (`EM`) before adding it to the new deque. If
   * provided, this function will be called for each raw element in the original deque.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new Deque object with elements of type EM and raw elements of type RM.
   */
  map<EM, RM>(
    callback: ElementCallback<E, R, EM, Deque<E, R>>,
    toElementFn?: (rawElement: RM) => EM,
    thisArg?: any
  ): Deque<EM, RM> {
    const newDeque = new Deque<EM, RM>([], { bucketSize: this._bucketSize, toElementFn });
    let index = 0;
    for (const el of this) {
      newDeque.push(callback.call(thisArg, el, index, this));
      index++;
    }
    return newDeque;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The above function is an implementation of the iterator protocol in TypeScript, allowing the
   * object to be iterated over using a for...of loop.
   */
  protected* _getIterator(): IterableIterator<E> {
    for (let i = 0; i < this.size; ++i) {
      yield this.at(i);
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
