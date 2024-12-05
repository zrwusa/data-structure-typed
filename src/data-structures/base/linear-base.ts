import { ElementCallback, LinearBaseOptions, ReduceLinearCallback } from '../../types';
import { IterableElementBase } from './iterable-element-base';

export class LinkedListNode<E = any> {
  constructor(value: E) {
    this._value = value;
    this._next = undefined;
  }

  protected _value: E;

  get value(): E {
    return this._value;
  }

  set value(value: E) {
    this._value = value;
  }

  protected _next: LinkedListNode<E> | undefined;

  get next(): LinkedListNode<E> | undefined {
    return this._next;
  }

  set next(value: LinkedListNode<E> | undefined) {
    this._next = value;
  }
}

export abstract class LinearBase<
  E,
  R = any,
  NODE extends LinkedListNode<E> = LinkedListNode<E>
> extends IterableElementBase<E, R> {
  /**
   * The constructor initializes the LinearBase class with optional options, setting the maximum length
   * if provided.
   * @param [options] - The `options` parameter is an optional object that can be passed to the
   * constructor. It is of type `LinearBaseOptions<E, R>`. The constructor checks if the `options`
   * object is provided and then extracts the `maxLen` property from it. If `maxLen` is a
   */
  protected constructor(options?: LinearBaseOptions<E, R>) {
    super(options);
    if (options) {
      const { maxLen } = options;
      if (typeof maxLen === 'number' && maxLen > 0 && maxLen % 1 === 0) this._maxLen = maxLen;
    }
  }

  abstract get length(): number;

  protected _maxLen: number = -1;

  get maxLen() {
    return this._maxLen;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function indexOf searches for a specified element starting from a given index in an array-like
   * object and returns the index of the first occurrence, or -1 if not found.
   * @param {E} searchElement - The `searchElement` parameter in the `indexOf` function represents the
   * element that you want to find within the array. The function will search for this element starting
   * from the `fromIndex` (if provided) up to the end of the array. If the `searchElement` is found
   * within the
   * @param {number} [fromIndex=0] - The `fromIndex` parameter in the `indexOf` function represents the
   * index at which to start searching for the `searchElement` within the array. If provided, the
   * search will begin at this index and continue to the end of the array. If `fromIndex` is not
   * specified, the default
   * @returns The `indexOf` method is returning the index of the `searchElement` if it is found in the
   * array starting from the `fromIndex`. If the `searchElement` is not found, it returns -1.
   */
  indexOf(searchElement: E, fromIndex: number = 0): number {
    // Boundary checks and adjustments
    if (this.length === 0) return -1;
    if (fromIndex < 0) fromIndex = this.length + fromIndex;
    if (fromIndex < 0) fromIndex = 0;

    // Iterating from the specified index to the end
    for (let i = fromIndex; i < this.length; i++) {
      const element = this.at(i);
      if (element === searchElement) return i;
    }

    return -1; // Not found
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `lastIndexOf` in TypeScript returns the index of the last occurrence of a specified
   * element in an array.
   * @param {E} searchElement - The `searchElement` parameter is the element that you want to find the
   * last index of within the array. The `lastIndexOf` method will search the array starting from the
   * `fromIndex` (or the end of the array if not specified) and return the index of the last occurrence
   * of the
   * @param {number} fromIndex - The `fromIndex` parameter in the `lastIndexOf` method specifies the
   * index at which to start searching for the `searchElement` in the array. By default, it starts
   * searching from the last element of the array (`this.length - 1`). If a specific `fromIndex` is
   * provided
   * @returns The last index of the `searchElement` in the array is being returned. If the
   * `searchElement` is not found in the array, -1 is returned.
   */
  lastIndexOf(searchElement: E, fromIndex: number = this.length - 1): number {
    if (this.length === 0) return -1;
    if (fromIndex >= this.length) fromIndex = this.length - 1;
    if (fromIndex < 0) fromIndex = this.length + fromIndex;

    for (let i = fromIndex; i >= 0; i--) {
      const element = this.at(i);
      if (element === searchElement) return i;
    }

    return -1;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `findIndex` function iterates over an array and returns the index of the first element that
   * satisfies the provided predicate function.
   * @param predicate - The `predicate` parameter in the `findIndex` function is a callback function
   * that takes three arguments: `item`, `index`, and the array `this`. It should return a boolean
   * value indicating whether the current element satisfies the condition being checked for.
   * @param {any} [thisArg] - The `thisArg` parameter in the `findIndex` function is an optional
   * parameter that specifies the value to use as `this` when executing the `predicate` function. If
   * provided, the `predicate` function will be called with `thisArg` as its `this` value. If `
   * @returns The `findIndex` method is returning the index of the first element in the array that
   * satisfies the provided predicate function. If no such element is found, it returns -1.
   */
  findIndex(predicate: ElementCallback<E, R, boolean>, thisArg?: any): number {
    for (let i = 0; i < this.length; i++) {
      const item = this.at(i);
      if (item !== undefined && predicate.call(thisArg, item, i, this)) return i;
    }
    return -1;
  }

  concat(...items: this[]): this;

  /**
   * Time Complexity: O(n + m)
   * Space Complexity: O(n + m)
   *
   * The `concat` function in TypeScript concatenates multiple items into a new list, handling both
   * individual elements and instances of `LinearBase`.
   * @param {(E | this)[]} items - The `concat` method takes in an array of items, where
   * each item can be either of type `E` or an instance of `LinearBase<E, R>`.
   * @returns The `concat` method is returning a new instance of the class that it belongs to, with the
   * items passed as arguments concatenated to it.
   */
  concat(...items: (E | this)[]): this {
    const newList = this.clone();

    for (const item of items) {
      if (item instanceof LinearBase) {
        newList.pushMany(item);
      } else {
        newList.push(item);
      }
    }

    return newList;
  }

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * The `sort` function in TypeScript sorts the elements of a collection using a specified comparison
   * function.
   * @param [compareFn] - The `compareFn` parameter is a function that defines the sort order. It takes
   * two elements `a` and `b` as input and returns a number indicating their relative order. If the
   * returned value is negative, `a` comes before `b`. If the returned value is positive, `
   * @returns The `sort` method is returning the instance of the object on which it is called (this),
   * after sorting the elements based on the provided comparison function (compareFn).
   */
  sort(compareFn?: (a: E, b: E) => number): this {
    const arr = this.toArray();
    arr.sort(compareFn);
    this.clear();
    for (const item of arr) this.push(item);
    return this;
  }

  /**
   * Time Complexity: O(n + m)
   * Space Complexity: O(m)
   *
   * The `splice` function in TypeScript removes elements from an array and optionally inserts new
   * elements at the specified index.
   * @param {number} start - The `start` parameter in the `splice` method indicates the index at which
   * to start modifying the array. If `start` is a negative number, it will count from the end of the
   * array.
   * @param {number} [deleteCount=0] - The `deleteCount` parameter in the `splice` method specifies the
   * number of elements to remove from the array starting at the specified `start` index. If
   * `deleteCount` is not provided or is 0, no elements are removed, and only new elements are inserted
   * at the `start`
   * @param {E[]} items - The `items` parameter in the `splice` method represents the elements that
   * will be inserted into the array at the specified `start` index. These elements can be of any type
   * and you can pass multiple elements separated by commas. The `splice` method will insert these
   * items into the array at the
   * @returns The `splice` method returns a list of elements that were removed from the original list
   * during the operation.
   */
  splice(start: number, deleteCount: number = 0, ...items: E[]): this {
    const removedList = this._createInstance();

    // Handling negative indexes and bounds
    start = start < 0 ? this.length + start : start;
    start = Math.max(0, Math.min(start, this.length));
    deleteCount = Math.max(0, Math.min(deleteCount, this.length - start));

    // Delete elements
    for (let i = 0; i < deleteCount; i++) {
      const removed = this.deleteAt(start); // Always delete the start position
      if (removed !== undefined) {
        removedList.push(removed); // Add removed elements to the returned list
      }
    }

    // Insert new element
    for (let i = 0; i < items.length; i++) {
      this.addAt(start + i, items[i]); // Insert new elements one by one at the current position
    }

    return removedList; // Returns a list of removed elements
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `join` function in TypeScript returns a string by joining the elements of an array with a
   * specified separator.
   * @param {string} [separator=,] - The `separator` parameter is a string that specifies the character
   * or characters that will be used to separate each element when joining them into a single string.
   * By default, the separator is set to a comma (`,`), but you can provide a different separator if
   * needed.
   * @returns The `join` method is being returned, which takes an optional `separator` parameter
   * (defaulting to a comma) and returns a string created by joining all elements of the array after
   * converting it to an array.
   */
  join(separator: string = ','): string {
    return this.toArray().join(separator);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `toReversedArray` takes an array and returns a new array with its elements in reverse
   * order.
   * @returns The `toReversedArray()` function returns an array of elements of type `E` in reverse
   * order.
   */
  toReversedArray(): E[] {
    const array: E[] = [];
    for (let i = this.length - 1; i >= 0; i--) {
      array.push(this.at(i)!);
    }
    return array;
  }

  reduceRight(callbackfn: ReduceLinearCallback<E>): E;

  reduceRight(callbackfn: ReduceLinearCallback<E>, initialValue: E): E;

  reduceRight<U>(callbackfn: ReduceLinearCallback<E, U>, initialValue: U): U;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reduceRight` function in TypeScript iterates over an array from right to left and applies a
   * callback function to each element, accumulating a single result.
   * @param callbackfn - The `callbackfn` parameter in the `reduceRight` method is a function that will
   * be called on each element in the array from right to left. It takes four arguments:
   * @param {U} [initialValue] - The `initialValue` parameter in the `reduceRight` method is an
   * optional parameter that specifies the initial value of the accumulator. If provided, the
   * `accumulator` will start with this initial value before iterating over the elements of the array.
   * If `initialValue` is not provided, the accumulator will
   * @returns The `reduceRight` method is returning the final accumulated value after applying the
   * callback function to each element in the array from right to left.
   */
  reduceRight<U>(callbackfn: ReduceLinearCallback<E, U>, initialValue?: U): U {
    let accumulator = initialValue ?? (0 as U);
    for (let i = this.length - 1; i >= 0; i--) {
      accumulator = callbackfn(accumulator, this.at(i)!, i, this);
    }
    return accumulator;
  }

  /**
   * Time Complexity: O(m)
   * Space Complexity: O(m)
   *
   * The `slice` function in TypeScript creates a new instance by extracting a portion of elements from
   * the original instance based on the specified start and end indices.
   * @param {number} [start=0] - The `start` parameter in the `slice` method represents the index at
   * which to begin extracting elements from an array-like object. If no `start` parameter is provided,
   * the default value is 0, meaning the extraction will start from the beginning of the array.
   * @param {number} end - The `end` parameter in the `slice` method represents the index at which to
   * end the slicing. By default, if no `end` parameter is provided, it will slice until the end of the
   * array (i.e., `this.length`).
   * @returns The `slice` method is returning a new instance of the object with elements sliced from
   * the specified start index (default is 0) to the specified end index (default is the length of the
   * object).
   */
  slice(start: number = 0, end: number = this.length): this {
    start = start < 0 ? this.length + start : start;
    end = end < 0 ? this.length + end : end;

    const newList = this._createInstance();
    for (let i = start; i < end; i++) {
      newList.push(this.at(i)!);
    }
    return newList;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `fill` function in TypeScript fills a specified range in an array-like object with a given
   * value.
   * @param {E} value - The `value` parameter in the `fill` method represents the element that will be
   * used to fill the specified range in the array.
   * @param [start=0] - The `start` parameter specifies the index at which to start filling the array
   * with the specified value. If not provided, it defaults to 0, indicating the beginning of the
   * array.
   * @param end - The `end` parameter in the `fill` function represents the index at which the filling
   * of values should stop. It specifies the end of the range within the array where the `value` should
   * be filled.
   * @returns The `fill` method is returning the modified object (`this`) after filling the specified
   * range with the provided value.
   */
  fill(value: E, start = 0, end = this.length): this {
    // Handling negative indexes
    start = start < 0 ? this.length + start : start;
    end = end < 0 ? this.length + end : end;

    // Boundary processing
    if (start < 0) start = 0;
    if (end > this.length) end = this.length;
    if (start >= end) return this;

    // Iterate through the specified range and fill in the values
    for (let i = start; i < end; i++) {
      this.setAt(i, value);
    }

    return this;
  }

  abstract setAt(index: number, value: E): boolean;

  abstract override clone(): this;

  abstract reverse(): this;

  abstract push(elementOrNode: E | NODE): boolean;

  abstract pushMany(elements: Iterable<E> | Iterable<R> | Iterable<NODE>): boolean[];

  abstract delete(elementOrNode: E | NODE | undefined): boolean;

  abstract at(index: number): E | undefined;

  abstract deleteAt(pos: number): E | undefined;

  abstract addAt(index: number, newElementOrNode: E | NODE): boolean;

  protected abstract _createInstance(options?: LinearBaseOptions<E, R>): this;

  protected abstract _getReverseIterator(...args: any[]): IterableIterator<E>;
}

export abstract class LinearLinkedBase<
  E,
  R = any,
  NODE extends LinkedListNode<E> = LinkedListNode<E>
> extends LinearBase<E, R, NODE> {
  /**
   * The constructor initializes the LinearBase class with optional options, setting the maximum length
   * if provided and valid.
   * @param [options] - The `options` parameter is an optional object that can be passed to the
   * constructor. It is of type `LinearBaseOptions<E, R>`. This object may contain properties such as
   * `maxLen`, which is a number representing the maximum length. If `maxLen` is a positive integer,
   */
  protected constructor(options?: LinearBaseOptions<E, R>) {
    super(options);
    if (options) {
      const { maxLen } = options;
      if (typeof maxLen === 'number' && maxLen > 0 && maxLen % 1 === 0) this._maxLen = maxLen;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function overrides the indexOf method to improve performance by searching for an element in a
   * custom array implementation starting from a specified index.
   * @param {E} searchElement - The `searchElement` parameter is the element that you are searching for
   * within the array. The `indexOf` method will return the index of the first occurrence of this
   * element within the array.
   * @param {number} [fromIndex=0] - The `fromIndex` parameter in the `indexOf` method specifies the
   * index in the array at which to start the search for the `searchElement`. If provided, the search
   * will begin at the specified index and continue to the end of the array. If not provided, the
   * search will start at index
   * @returns The `indexOf` method is returning the index of the `searchElement` if it is found in the
   * array starting from the `fromIndex`. If the `searchElement` is not found, it returns -1.
   */
  override indexOf(searchElement: E, fromIndex: number = 0): number {
    // In order to improve performance, it is best to override this method in the subclass of the array implementation
    const iterator = this._getIterator();
    let current = iterator.next();

    let index = 0;
    while (index < fromIndex) {
      current = iterator.next();
      index++;
    }

    while (!current.done) {
      if (current.value === searchElement) return index;
      current = iterator.next();
      index++;
    }

    return -1;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function overrides the lastIndexOf method in TypeScript to improve performance by searching
   * for an element in reverse order starting from a specified index.
   * @param {E} searchElement - The `searchElement` parameter is the element that you want to find
   * within the array. The `lastIndexOf` method searches the array for this element starting from the
   * end of the array (or from the specified `fromIndex` if provided) and returns the index of the last
   * occurrence of the element
   * @param {number} fromIndex - The `fromIndex` parameter in the `lastIndexOf` method specifies the
   * index at which to start searching for the `searchElement` in the array. If provided, the search
   * will begin at this index and move towards the beginning of the array. If not provided, the search
   * will start at the
   * @returns The `lastIndexOf` method is being overridden to search for the `searchElement` starting
   * from the specified `fromIndex` (defaulting to the end of the array). It iterates over the array in
   * reverse order using a custom iterator `_getReverseIterator` and returns the index of the last
   * occurrence of the `searchElement` if found, or -1 if not found.
   */
  override lastIndexOf(searchElement: E, fromIndex: number = this.length - 1): number {
    // In order to improve performance, it is best to override this method in the subclass of the array implementation
    const iterator = this._getReverseIterator();
    let current = iterator.next();

    let index = this.length - 1;
    while (index > fromIndex) {
      current = iterator.next();
      index--;
    }

    while (!current.done) {
      if (current.value === searchElement) return index;
      current = iterator.next();
      index--;
    }

    return -1;
  }

  override concat(...items: LinearBase<E, R>[]): this;

  /**
   * Time Complexity: O(n + m)
   * Space Complexity: O(n + m)
   *
   * The `concat` function in TypeScript overrides the default behavior to concatenate items into a new
   * list, handling both individual elements and instances of `LinearBase`.
   * @param {(E | LinearBase<E, R>)[]} items - The `concat` method you provided takes in a variable
   * number of arguments of type `E` or `LinearBase<E, R>`. The method concatenates these items to the
   * current list and returns a new list with the concatenated items.
   * @returns The `concat` method is returning a new instance of the class that it belongs to, with the
   * items passed as arguments concatenated to it.
   */
  override concat(...items: (E | LinearBase<E, R>)[]): this {
    const newList = this.clone();

    for (const item of items) {
      if (item instanceof LinearBase) {
        newList.pushMany(item);
      } else {
        newList.push(item);
      }
    }

    return newList;
  }

  /**
   * Time Complexity: O(m)
   * Space Complexity: O(m)
   *
   * The `slice` method is overridden to improve performance by creating a new instance and iterating
   * through the array to extract a subset based on the specified start and end indices.
   * @param {number} [start=0] - The `start` parameter in the `slice` method specifies the index at
   * which to begin extracting elements from the array. If no `start` parameter is provided, the
   * default value is 0, indicating that extraction should start from the beginning of the array.
   * @param {number} end - The `end` parameter in the `slice` method represents the index at which to
   * end the slicing of the array. If not provided, it defaults to the length of the array.
   * @returns The `slice` method is returning a new instance of the array implementation with elements
   * sliced from the original array based on the `start` and `end` parameters.
   */
  override slice(start: number = 0, end: number = this.length): this {
    // In order to improve performance, it is best to override this method in the subclass of the array implementation
    start = start < 0 ? this.length + start : start;
    end = end < 0 ? this.length + end : end;

    const newList = this._createInstance();
    const iterator = this._getIterator();
    let current = iterator.next();
    let c = 0;
    while (c < start) {
      current = iterator.next();
      c++;
    }
    for (let i = start; i < end; i++) {
      newList.push(current.value);
      current = iterator.next();
    }

    return newList;
  }

  /**
   * Time Complexity: O(n + m)
   * Space Complexity: O(m)
   *
   * The function overrides the splice method to handle deletion and insertion of elements in a data
   * structure while returning the removed elements.
   * @param {number} start - The `start` parameter in the `splice` method indicates the index at which
   * to start modifying the array.
   * @param {number} [deleteCount=0] - The `deleteCount` parameter in the `splice` method specifies the
   * number of elements to remove from the array starting at the specified `start` index. If
   * `deleteCount` is not provided, it defaults to 0, meaning no elements will be removed but new
   * elements can still be inserted at
   * @param {E[]} items - The `items` parameter in the `splice` method represents the elements that
   * will be inserted into the array at the specified `start` index. These elements can be of any type
   * and there can be multiple elements passed as arguments to be inserted into the array.
   * @returns The `splice` method is returning a new instance of the data structure that was modified
   * by removing elements specified by the `start` and `deleteCount` parameters, and inserting new
   * elements provided in the `items` array.
   */
  override splice(start: number, deleteCount: number = 0, ...items: E[]): this {
    const removedList = this._createInstance(); // Used to store deleted elements

    // Handling negative indexes
    start = start < 0 ? this.length + start : start;
    start = Math.max(0, Math.min(start, this.length)); // Correct start range
    deleteCount = Math.max(0, deleteCount); // Make sure deleteCount is non-negative

    let currentIndex = 0;
    let currentNode: NODE | undefined = undefined;
    let previousNode: NODE | undefined = undefined;

    // Find the starting point using an iterator
    const iterator = this._getNodeIterator();
    for (const node of iterator) {
      if (currentIndex === start) {
        currentNode = node; // Find the starting node
        break;
      }
      previousNode = node; // Update the previous node
      currentIndex++;
    }

    // Delete nodes
    for (let i = 0; i < deleteCount && currentNode; i++) {
      removedList.push(currentNode.value); // Store the deleted value in removedList
      const nextNode = currentNode.next; // Save next node
      this.delete(currentNode); // Delete current node
      currentNode = nextNode as NODE;
    }

    // Insert new value
    for (let i = 0; i < items.length; i++) {
      if (previousNode) {
        this.addAfter(previousNode, items[i]); // Insert after previousNode
        previousNode = previousNode.next as NODE; // Move to newly inserted node
      } else {
        this.addAt(0, items[i]); // Insert at the head of the linked list
        previousNode = this._getNodeIterator().next().value; // Update the head node to be the first inserted node
      }
    }

    return removedList;
  }

  override reduceRight(callbackfn: ReduceLinearCallback<E>): E;

  override reduceRight(callbackfn: ReduceLinearCallback<E>, initialValue: E): E;

  override reduceRight<U>(callbackfn: ReduceLinearCallback<E, U>, initialValue: U): U;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `reduceRight` iterates over an array in reverse order and applies a callback function
   * to each element, accumulating a single result.
   * @param callbackfn - The `callbackfn` parameter is a function that will be called on each element
   * of the array from right to left. It takes four arguments:
   * @param {U} [initialValue] - The `initialValue` parameter is an optional value that is used as the
   * initial accumulator value in the reduce operation. If provided, the reduce operation starts with
   * this initial value and iterates over the elements of the array, applying the callback function to
   * each element and the current accumulator value. If `initial
   * @returns The `reduceRight` method is returning the final accumulated value after applying the
   * callback function to each element in the array from right to left.
   */
  override reduceRight<U>(callbackfn: ReduceLinearCallback<E, U>, initialValue?: U): U {
    let accumulator = initialValue ?? (0 as U);
    let index = this.length - 1;
    for (const item of this._getReverseIterator()) {
      accumulator = callbackfn(accumulator, item, index--, this);
    }
    return accumulator;
  }

  abstract override delete(elementOrNode: E | NODE | undefined): boolean;

  abstract addBefore(existingElementOrNode: E | NODE, newElementOrNode: E | NODE): boolean;

  abstract addAfter(existingElementOrNode: E | NODE, newElementOrNode: E | NODE): boolean;

  abstract getNodeAt(index: number): NODE | undefined;

  protected abstract _getNodeIterator(...args: any[]): IterableIterator<NODE>;

  // protected abstract _getReverseNodeIterator(...args: any[]): IterableIterator<NODE>;

  protected abstract _getPrevNode(node: NODE): NODE | undefined;
}
