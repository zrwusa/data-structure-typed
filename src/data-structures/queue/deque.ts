/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { DequeOptions, ElementCallback, IterableWithSizeOrLength } from '../../types';
import { calcMinUnitsRequired, rangeCheck } from '../../utils';
import { LinearBase } from '../base/linear-base';

/**
 * 1. Operations at Both Ends: Supports adding and removing elements at both the front and back of the queue. This allows it to be used as a stack (last in, first out) and a queue (first in, first out).
 * 2. Efficient Random Access: Being based on an array, it offers fast random access capability, allowing constant time access to any element.
 * 3. Continuous Memory Allocation: Since it is based on an array, all elements are stored contiguously in memory, which can bring cache friendliness and efficient memory access.
 * 4. Efficiency: Adding and removing elements at both ends of a deque is usually very fast. However, when the dynamic array needs to expand, it may involve copying the entire array to a larger one, and this operation has a time complexity of O(n).
 * 5. Performance jitter: Deque may experience performance jitter, but DoublyLinkedList will not
 * @example
 * // prize roulette
 *     class PrizeRoulette {
 *       private deque: Deque<string>;
 *
 *       constructor(prizes: string[]) {
 *         // Initialize the deque with prizes
 *         this.deque = new Deque<string>(prizes);
 *       }
 *
 *       // Rotate clockwise to the right (forward)
 *       rotateClockwise(steps: number): void {
 *         const n = this.deque.length;
 *         if (n === 0) return;
 *
 *         for (let i = 0; i < steps; i++) {
 *           const last = this.deque.pop(); // Remove the last element
 *           this.deque.unshift(last!); // Add it to the front
 *         }
 *       }
 *
 *       // Rotate counterclockwise to the left (backward)
 *       rotateCounterClockwise(steps: number): void {
 *         const n = this.deque.length;
 *         if (n === 0) return;
 *
 *         for (let i = 0; i < steps; i++) {
 *           const first = this.deque.shift(); // Remove the first element
 *           this.deque.push(first!); // Add it to the back
 *         }
 *       }
 *
 *       // Display the current prize at the head
 *       display() {
 *         return this.deque.first;
 *       }
 *     }
 *
 *     // Example usage
 *     const prizes = ['Car', 'Bike', 'Laptop', 'Phone', 'Watch', 'Headphones']; // Initialize the prize list
 *     const roulette = new PrizeRoulette(prizes);
 *
 *     // Display the initial state
 *     console.log(roulette.display()); // 'Car' // Car
 *
 *     // Rotate clockwise by 3 steps
 *     roulette.rotateClockwise(3);
 *     console.log(roulette.display()); // 'Phone' // Phone
 *
 *     // Rotate counterclockwise by 2 steps
 *     roulette.rotateCounterClockwise(2);
 *     console.log(roulette.display()); // 'Headphones'
 * @example
 * // sliding window
 *     // Maximum function of sliding window
 *     function maxSlidingWindow(nums: number[], k: number): number[] {
 *       const n = nums.length;
 *       if (n * k === 0) return [];
 *
 *       const deq = new Deque<number>();
 *       const result: number[] = [];
 *
 *       for (let i = 0; i < n; i++) {
 *         // Delete indexes in the queue that are not within the window range
 *         if (deq.length > 0 && deq.first! === i - k) {
 *           deq.shift();
 *         }
 *
 *         // Remove all indices less than the current value from the tail of the queue
 *         while (deq.length > 0 && nums[deq.last!] < nums[i]) {
 *           deq.pop();
 *         }
 *
 *         // Add the current index to the end of the queue
 *         deq.push(i);
 *
 *         // Add the maximum value of the window to the results
 *         if (i >= k - 1) {
 *           result.push(nums[deq.first!]);
 *         }
 *       }
 *
 *       return result;
 *     }
 *
 *     const nums = [1, 3, -1, -3, 5, 3, 6, 7];
 *     const k = 3;
 *     console.log(maxSlidingWindow(nums, k)); // [3, 3, 5, 5, 6, 7]
 */
export class Deque<E = any, R = any> extends LinearBase<E, R> {
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
    this.pushMany(elements);
  }

  protected _bucketSize: number = 1 << 12;

  get bucketSize() {
    return this._bucketSize;
  }

  protected _bucketFirst = 0;

  get bucketFirst(): number {
    return this._bucketFirst;
  }

  protected _firstInBucket = 0;

  get firstInBucket(): number {
    return this._firstInBucket;
  }

  protected _bucketLast = 0;

  get bucketLast(): number {
    return this._bucketLast;
  }

  protected _lastInBucket = 0;

  get lastInBucket(): number {
    return this._lastInBucket;
  }

  protected _bucketCount = 0;

  get bucketCount(): number {
    return this._bucketCount;
  }

  protected _buckets: E[][] = [];

  get buckets() {
    return this._buckets;
  }

  protected _length = 0;

  get length() {
    return this._length;
  }

  /**
   * The function returns the first element in a collection if it exists, otherwise it returns
   * undefined.
   * @returns The first element of the collection, of type E, is being returned.
   */
  get first(): E | undefined {
    if (this._length === 0) return;
    return this._buckets[this._bucketFirst][this._firstInBucket];
  }

  /**
   * The last function returns the last element in the queue.
   * @return The last element in the array
   */
  get last(): E | undefined {
    if (this._length === 0) return;
    return this._buckets[this._bucketLast][this._lastInBucket];
  }

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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `pop()` function removes and returns the last element from a data structure, updating the
   * internal state variables accordingly.
   * @returns The element that was removed from the data structure is being returned.
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift()` function removes and returns the first element from a data structure, updating the
   * internal state variables accordingly.
   * @returns The element that is being removed from the beginning of the data structure is being
   * returned.
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
   * Time Complexity: O(k)
   * Space Complexity: O(k)
   *
   * The function `pushMany` iterates over elements and pushes them into an array after applying a
   * transformation function if provided.
   * @param {IterableWithSizeOrLength<E> | IterableWithSizeOrLength<R>} elements - The `elements`
   * parameter in the `pushMany` function is expected to be an iterable containing elements of type `E`
   * or `R`. It can be either an `IterableWithSizeOrLength<E>` or an `IterableWithSizeOrLength<R>`. The
   * function iterates over each element
   * @returns The `pushMany` function is returning an array of boolean values, where each value
   * represents the result of calling the `push` method on the current object instance with the
   * corresponding element from the input `elements` iterable.
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
   * Time Complexity: O(k)
   * Space Complexity: O(k)
   *
   * The `unshiftMany` function in TypeScript iterates over elements and adds them to the beginning of
   * an array, optionally converting them using a provided function.
   * @param {IterableWithSizeOrLength<E> | IterableWithSizeOrLength<R>} elements - The `elements`
   * parameter in the `unshiftMany` function is an iterable containing elements of type `E` or `R`. It
   * can be an array or any other iterable data structure that has a known size or length. The function
   * iterates over each element in the `elements` iterable and
   * @returns The `unshiftMany` function returns an array of boolean values indicating whether each
   * element was successfully added to the beginning of the array.
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if the size of an object is equal to zero and returns a boolean value.
   * @returns A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this._length === 0;
  }

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
    this._bucketFirst = this._bucketLast = this._length = 0;
    this._firstInBucket = this._lastInBucket = this._bucketSize >> 1;
  }

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
    rangeCheck(pos, 0, this._length - 1);
    const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
    return this._buckets[bucketIndex][indexInBucket]!;
  }

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
    rangeCheck(pos, 0, this._length - 1);
    const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
    this._buckets[bucketIndex][indexInBucket] = element;
    return true;
  }

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
    const length = this._length;
    rangeCheck(pos, 0, length);
    if (pos === 0) {
      while (num--) this.unshift(element);
    } else if (pos === this._length) {
      while (num--) this.push(element);
    } else {
      const arr: E[] = [];
      for (let i = pos; i < this._length; ++i) {
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
      this._length = pos + 1;
      return this;
    } else {
      const newDeque = this._createInstance({
        bucketSize: this._bucketSize,
        toElementFn: this._toElementFn,
        maxLen: this._maxLen
      });

      for (let i = 0; i <= pos; i++) {
        newDeque.push(this.at(i));
      }

      return newDeque;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `splice` function in TypeScript overrides the default behavior to remove and insert elements
   * in a Deque data structure while ensuring the starting position and delete count are within bounds.
   * @param {number} start - The `start` parameter in the `splice` method represents the index at which
   * to start changing the array. Items will be removed or added starting from this index.
   * @param {number} deleteCount - The `deleteCount` parameter in the `splice` method represents the
   * number of elements to remove from the array starting at the specified `start` index. If
   * `deleteCount` is not provided, it defaults to the number of elements from the `start` index to the
   * end of the array (`
   * @param {E[]} items - The `items` parameter in the `splice` method represents the elements that
   * will be inserted into the deque at the specified `start` index. These elements will be inserted in
   * place of the elements that are removed based on the `start` and `deleteCount` parameters.
   * @returns The `splice` method is returning the array `deletedElements` which contains the elements
   * that were removed from the Deque during the splice operation.
   */
  override splice(start: number, deleteCount: number = this._length - start, ...items: E[]): this {
    // Check whether the starting position is legal
    rangeCheck(start, 0, this._length);

    // Adjust the value of deleteCount
    if (deleteCount < 0) deleteCount = 0;
    if (start + deleteCount > this._length) deleteCount = this._length - start;

    // Save deleted elements
    const deletedElements = this._createInstance();

    // Add removed elements to the result
    for (let i = 0; i < deleteCount; i++) {
      deletedElements.push(this.at(start + i));
    }

    // Calculate the range that needs to be deleted
    const elementsAfter = [];
    for (let i = start + deleteCount; i < this._length; i++) {
      elementsAfter.push(this.at(i));
    }

    // Adjust the length of the current Deque
    this.cut(start - 1, true);

    for (const item of items) {
      this.push(item);
    }

    // Insert subsequent elements back
    for (const element of elementsAfter) {
      this.push(element);
    }

    return deletedElements;
  }

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
        return this;
      }
      const { bucketIndex, indexInBucket } = this._getBucketAndPosition(pos);
      this._bucketFirst = bucketIndex;
      this._firstInBucket = indexInBucket;
      this._length = this._length - pos;
      return this;
    } else {
      const newDeque = this._createInstance({
        bucketSize: this._bucketSize,
        toElementFn: this._toElementFn,
        maxLen: this._maxLen
      });
      if (pos < 0) pos = 0;
      for (let i = pos; i < this._length; i++) {
        newDeque.push(this.at(i));
      }

      return newDeque;
    }
  }

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
  deleteAt(pos: number): E | undefined {
    rangeCheck(pos, 0, this._length - 1);

    let deleted: E | undefined;
    if (pos === 0) {
      //If it is the first element, use shift() directly
      return this.shift();
    } else if (pos === this._length - 1) {
      // If it is the last element, just use pop()
      deleted = this.last;
      this.pop();
      return deleted;
    } else {
      // Delete the middle element
      const length = this._length - 1;
      const { bucketIndex: targetBucket, indexInBucket: targetPointer } = this._getBucketAndPosition(pos);
      deleted = this._buckets[targetBucket][targetPointer];

      for (let i = pos; i < length; i++) {
        const { bucketIndex: curBucket, indexInBucket: curPointer } = this._getBucketAndPosition(i);
        const { bucketIndex: nextBucket, indexInBucket: nextPointer } = this._getBucketAndPosition(i + 1);
        this._buckets[curBucket][curPointer] = this._buckets[nextBucket][nextPointer];
      }

      // Remove last duplicate element
      this.pop();
      return deleted;
    }
  }

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
    const size = this._length;
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

  // /**
  //  * Time Complexity: O(n)
  //  * Space Complexity: O(1)
  //  *
  //  * This function overrides the indexOf method to search for an element within a custom data
  //  * structure.
  //  * @param {E} searchElement - The `searchElement` parameter is the element that you are searching for
  //  * within the data structure. The `indexOf` method will return the index of the first occurrence of
  //  * this element within the data structure.
  //  * @param {number} [fromIndex=0] - The `fromIndex` parameter in the `indexOf` method specifies the
  //  * index at which to start searching for the `searchElement` within the data structure. If provided,
  //  * the search will begin at this index instead of the beginning of the data structure.
  //  * @returns The indexOf method is returning the index of the searchElement if it is found in the data
  //  * structure, or -1 if the searchElement is not found.
  //  */
  // override indexOf(searchElement: E, fromIndex: number = 0): number {
  //   let index = fromIndex;
  //   let bucketIndex = this._bucketFirst;
  //   let indexInBucket = this._firstInBucket + fromIndex;
  //
  //   for (let i = 0; i < this._length; i++) {
  //     if (this._buckets[bucketIndex][indexInBucket] === searchElement) {
  //       return index;
  //     }
  //     index++;
  //     indexInBucket++;
  //     if (indexInBucket >= this._bucketSize) {
  //       bucketIndex++;
  //       indexInBucket = 0;
  //     }
  //     if (bucketIndex >= this._bucketCount) {
  //       bucketIndex = 0;
  //     }
  //   }
  //   return -1;
  // }

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
   *
   * The `unique()` function removes duplicate elements from an array-like data structure and returns
   * the number of unique elements.
   * @returns The size of the modified array is being returned.
   */
  unique(): this {
    if (this._length <= 1) {
      return this;
    }
    let index = 1;
    let prev = this.at(0);
    for (let i = 1; i < this._length; ++i) {
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
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `shrinkToFit` function reorganizes the elements in an array-like data structure to minimize
   * memory usage.
   * @returns Nothing is being returned. The function is using the `return` statement to exit early if
   * `this._length` is 0, but it does not return any value.
   */
  shrinkToFit(): void {
    if (this._length === 0) return;
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
   * Space Complexity: O(n)
   *
   * The `clone()` function returns a new instance of the `Deque` class with the same elements and
   * bucket size as the original instance.
   * @returns The `clone()` method is returning a new instance of the `Deque` class with the same
   * elements as the original deque (`this`) and the same bucket size.
   */
  clone(): this {
    return new Deque<E, R>(this, {
      bucketSize: this.bucketSize,
      toElementFn: this.toElementFn,
      maxLen: this._maxLen
    }) as this;
  }

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
  filter(predicate: ElementCallback<E, R, boolean>, thisArg?: any): Deque<E, R> {
    const newDeque = this._createInstance({
      bucketSize: this._bucketSize,
      toElementFn: this.toElementFn,
      maxLen: this._maxLen
    });
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
   *
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
  map<EM, RM>(callback: ElementCallback<E, R, EM>, toElementFn?: (rawElement: RM) => EM, thisArg?: any): Deque<EM, RM> {
    const newDeque = new Deque<EM, RM>([], { bucketSize: this._bucketSize, toElementFn, maxLen: this._maxLen });
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
   *
   * The above function is an implementation of the iterator protocol in TypeScript, allowing the
   * object to be iterated over using a for...of loop.
   */
  protected *_getIterator(): IterableIterator<E> {
    for (let i = 0; i < this._length; ++i) {
      yield this.at(i);
    }
  }

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

  /**
   * The function `_createInstance` returns a new instance of the `Deque` class with the specified
   * options.
   * @param [options] - The `options` parameter in the `_createInstance` method is of type
   * `DequeOptions<E, R>`, which is an optional parameter that allows you to pass additional
   * configuration options when creating a new instance of the `Deque` class.
   * @returns An instance of the `Deque` class with an empty array and the provided options, casted as
   * `this`.
   */
  protected override _createInstance(options?: DequeOptions<E, R>): this {
    return new Deque<E, R>([], options) as this;
  }

  /**
   * This function returns an iterator that iterates over elements in reverse order.
   */
  protected *_getReverseIterator(): IterableIterator<E> {
    for (let i = this._length - 1; i > -1; i--) {
      yield this.at(i);
    }
  }
}
