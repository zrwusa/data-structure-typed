/**
 * @license MIT
 * @copyright Pablo Zeng <zrwusa@gmail.com>
 * @class
 */
import type { ElementCallback, QueueOptions } from '../../types';
import { SinglyLinkedList } from '../linked-list';
import { LinearBase } from '../base/linear-base';

/**
 * 1. First In, First Out (FIFO): The core feature of a queue is its first in, first out nature. The element added to the queue first will be the one to be removed first.
 * 2. Operations: The main operations include enqueue (adding an element to the end of the queue) and dequeue (removing and returning the element at the front of the queue). Typically, there is also a peek operation (looking at the front element without removing it).
 * 3. Uses: Queues are commonly used to manage a series of tasks or elements that need to be processed in order. For example, managing task queues in a multi-threaded environment, or in algorithms for data structures like trees and graphs for breadth-first search.
 * 4. Task Scheduling: Managing the order of task execution in operating systems or applications.
 * 5. Data Buffering: Acting as a buffer for data packets in network communication.
 * 6. Breadth-First Search (BFS): In traversal algorithms for graphs and trees, queues store elements that are to be visited.
 * 7. Real-time Queuing: Like queuing systems in banks or supermarkets.
 */
export class Queue<E = any, R = any> extends LinearBase<E, R> {
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: QueueOptions<E, R>) {
    super(options);

    if (options) {
      const { autoCompactRatio = 0.5 } = options;
      this._autoCompactRatio = autoCompactRatio;
    }

    this.pushMany(elements);
  }

  protected _elements: E[] = [];

  get elements(): E[] {
    return this._elements;
  }

  protected _offset: number = 0;

  get offset(): number {
    return this._offset;
  }

  get length(): number {
    return this.elements.length - this.offset;
  }

  protected _autoCompactRatio: number = 0.5;

  get autoCompactRatio(): number {
    return this._autoCompactRatio;
  }

  set autoCompactRatio(v: number) {
    this._autoCompactRatio = v;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `first` function returns the first element of the array `_elements` if it exists, otherwise it returns `undefined`.
   * @returns The `get first()` method returns the first element of the data structure, represented by the `_elements` array at
   * the `_offset` index. If the data structure is empty (length is 0), it returns `undefined`.
   */
  get first(): E | undefined {
    return this.length > 0 ? this.elements[this.offset] : undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `last` function returns the last element in an array-like data structure, or undefined if the structure is empty.
   * @returns The method `get last()` returns the last element of the `_elements` array if the array is not empty. If the
   * array is empty, it returns `undefined`.
   */
  get last(): E | undefined {
    return this.length > 0 ? this.elements[this.elements.length - 1] : undefined;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function "fromArray" creates a new Queue object from an array of elements.Creates a queue from an existing array.
   * @public
   * @param {E[]} elements - The "elements" parameter is an array of elements of type E.
   * @returns The method is returning a new instance of the Queue class, initialized with the elements from the input
   * array.
   */
  static fromArray<E>(elements: E[]): Queue<E> {
    return new Queue(elements);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The push function adds an element to the end of the queue and returns true. Adds an element at the back of the queue.
   * @param {E} element - The `element` parameter represents the element that you want to add to the queue.
   * @returns Always returns true, indicating the element was successfully added.
   */
  push(element: E): boolean {
    this.elements.push(element);
    if (this._maxLen > 0 && this.length > this._maxLen) this.shift();
    return true;
  }

  /**
   * Time Complexity: O(k)
   * Space Complexity: O(k)
   *
   * The `pushMany` function iterates over elements and pushes them into an array after applying a
   * transformation function if provided.
   * @param {Iterable<E> | Iterable<R>} elements - The `elements` parameter in the `pushMany` function
   * is an iterable containing elements of type `E` or `R`.
   * @returns The `pushMany` function is returning an array of boolean values indicating whether each
   * element was successfully pushed into the data structure.
   */
  pushMany(elements: Iterable<E> | Iterable<R>) {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) ans.push(this.push(this.toElementFn(el as R)));
      else ans.push(this.push(el as E));
    }
    return ans;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift` function removes and returns the first element in the queue, and adjusts the internal data structure if
   * necessary to optimize performance.
   * @returns The function `shift()` returns either the first element in the queue or `undefined` if the queue is empty.
   */
  shift(): E | undefined {
    if (this.length === 0) return undefined;

    const first = this.first;
    this._offset += 1;

    if (this.offset / this.elements.length > this.autoCompactRatio) this.compact();
    return first;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The delete function removes an element from the list.
   * @param {E} element - Specify the element to be deleted
   * @return A boolean value indicating whether the element was successfully deleted or not
   */
  delete(element: E): boolean {
    const index = this.elements.indexOf(element);
    return !!this.deleteAt(index);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The deleteAt function deletes the element at a given index.
   * @param {number} index - Determine the index of the element to be deleted
   * @return A boolean value
   */
  deleteAt(index: number): E | undefined {
    const deleted = this.elements[index];
    this.elements.splice(index, 1);
    return deleted;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `at` function returns the element at a specified index adjusted by an offset, or `undefined`
   * if the index is out of bounds.
   * @param {number} index - The `index` parameter represents the position of the element you want to
   * retrieve from the data structure.
   * @returns The `at` method is returning the element at the specified index adjusted by the offset
   * `_offset`.
   */
  at(index: number): E | undefined {
    return this.elements[index + this._offset];
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reverse` function in TypeScript reverses the elements of an array starting from a specified
   * offset.
   * @returns The `reverse()` method is returning the modified object itself (`this`) after reversing
   * the elements in the array and resetting the offset to 0.
   */
  reverse(): this {
    this._elements = this.elements.slice(this.offset).reverse();
    this._offset = 0;
    return this;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `addAt` inserts a new element at a specified index in an array, returning true if
   * successful and false if the index is out of bounds.
   * @param {number} index - The `index` parameter represents the position at which the `newElement`
   * should be added in the array.
   * @param {E} newElement - The `newElement` parameter represents the element that you want to insert
   * into the array at the specified index.
   * @returns The `addAt` method returns a boolean value - `true` if the new element was successfully
   * added at the specified index, and `false` if the index is out of bounds (less than 0 or greater
   * than the length of the array).
   */
  addAt(index: number, newElement: E): boolean {
    if (index < 0 || index > this.length) return false;
    this._elements.splice(this.offset + index, 0, newElement);
    return true;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `setAt` updates an element at a specified index in an array-like data structure.
   * @param {number} index - The `index` parameter is a number that represents the position in the
   * array where the new element will be set.
   * @param {E} newElement - The `newElement` parameter represents the new value that you want to set
   * at the specified index in the array.
   * @returns The `setAt` method returns a boolean value - `true` if the element was successfully set
   * at the specified index, and `false` if the index is out of bounds (less than 0 or greater than the
   * length of the array).
   */
  setAt(index: number, newElement: E): boolean {
    if (index < 0 || index > this.length) return false;
    this._elements[this.offset + index] = newElement;
    return true;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if a data structure is empty by comparing its length to zero.
   * @returns {boolean} A boolean value indicating whether the length of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The clear function resets the elements array and offset to their initial values.
   */
  clear(): void {
    this._elements = [];
    this._offset = 0;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `compact` function in TypeScript slices the elements array based on the offset and resets the
   * offset to zero.
   * @returns The `compact()` method is returning a boolean value of `true`.
   */
  compact(): boolean {
    this._elements = this.elements.slice(this.offset);
    this._offset = 0;
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function overrides the splice method to remove and insert elements in a queue-like data
   * structure.
   * @param {number} start - The `start` parameter in the `splice` method specifies the index at which
   * to start changing the array. Items will be added or removed starting from this index.
   * @param {number} [deleteCount=0] - The `deleteCount` parameter in the `splice` method specifies the
   * number of elements to remove from the array starting at the specified `start` index. If
   * `deleteCount` is not provided, it defaults to 0, meaning no elements will be removed but new
   * elements can still be inserted at
   * @param {E[]} items - The `items` parameter in the `splice` method represents the elements that
   * will be added to the array at the specified `start` index. These elements will replace the
   * existing elements starting from the `start` index for the `deleteCount` number of elements.
   * @returns The `splice` method is returning the `removedQueue`, which is an instance of the same
   * class as the original object.
   */
  override splice(start: number, deleteCount: number = 0, ...items: E[]): this {
    const removedQueue = this._createInstance();

    start = Math.max(0, Math.min(start, this.length));
    deleteCount = Math.max(0, Math.min(deleteCount, this.length - start));

    const globalStartIndex = this.offset + start;

    const removedElements = this._elements.splice(globalStartIndex, deleteCount, ...items);
    removedQueue.pushMany(removedElements);

    this.compact();

    return removedQueue;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone()` function returns a new Queue object with the same elements as the original Queue.
   * @returns The `clone()` method is returning a new instance of the `Queue` class.
   */
  clone(): this {
    return new Queue(this.elements.slice(this.offset), { toElementFn: this.toElementFn, maxLen: this._maxLen }) as this;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new `Queue` object containing elements from the original `Queue`
   * that satisfy a given predicate function.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * the current element being iterated over, the index of the current element, and the queue itself.
   * It should return a boolean value indicating whether the element should be included in the filtered
   * queue or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `predicate` function. If `thisArg` is
   * @returns The `filter` method is returning a new `Queue` object that contains the elements that
   * satisfy the given predicate function.
   */
  filter(predicate: ElementCallback<E, R, boolean>, thisArg?: any): Queue<E, R> {
    const newDeque = this._createInstance({
      toElementFn: this._toElementFn,
      autoCompactRatio: this._autoCompactRatio,
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
   * The `map` function in TypeScript creates a new Queue by applying a callback function to each
   * element in the original Queue.
   * @param callback - The `callback` parameter is a function that will be applied to each element in
   * the queue. It takes the current element, its index, and the queue itself as arguments, and returns
   * a new element.
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be provided to
   * convert a raw element of type `RM` to a new element of type `EM`. This function is used within the
   * `map` method to transform each raw element before passing it to the `callback` function. If
   * @param {any} [thisArg] - The `thisArg` parameter in the `map` function is used to specify the
   * value of `this` when executing the `callback` function. It allows you to set the context (the
   * value of `this`) within the callback function. If `thisArg` is provided, it will be
   * @returns A new Queue object containing elements of type EM, which are the result of applying the
   * callback function to each element in the original Queue object.
   */
  map<EM, RM>(callback: ElementCallback<E, R, EM>, toElementFn?: (rawElement: RM) => EM, thisArg?: any): Queue<EM, RM> {
    const newDeque = new Queue<EM, RM>([], {
      toElementFn,
      autoCompactRatio: this._autoCompactRatio,
      maxLen: this._maxLen
    });
    let index = 0;
    for (const el of this) {
      newDeque.push(callback.call(thisArg, el, index, this));
      index++;
    }
    return newDeque;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `_getIterator` returns an iterable iterator for the elements in the class.
   */
  protected *_getIterator(): IterableIterator<E> {
    for (const item of this.elements.slice(this.offset)) {
      yield item;
    }
  }

  /**
   * The function `_createInstance` returns a new instance of the `Queue` class with the specified
   * options.
   * @param [options] - The `options` parameter in the `_createInstance` method is of type
   * `QueueOptions<E, R>`, which is used to configure the behavior of the queue being created. It
   * allows you to specify settings or properties that can influence how the queue operates.
   * @returns An instance of the `Queue` class with an empty array and the provided options is being
   * returned.
   */
  protected override _createInstance(options?: QueueOptions<E, R>): this {
    return new Queue<E, R>([], options) as this;
  }

  /**
   * The function `_getReverseIterator` returns an iterator that iterates over elements in reverse
   * order.
   */
  protected *_getReverseIterator(): IterableIterator<E> {
    for (let i = this.length - 1; i >= 0; i--) {
      const cur = this.at(i); // `at()` handles the offset.
      if (cur !== undefined) yield cur;
    }
  }
}

/**
 * 1. First In, First Out (FIFO) Strategy: Like other queue implementations, LinkedListQueue follows the first in, first out principle, meaning the element that is added to the queue first will be the first to be removed.
 * 2. Based on Linked List: LinkedListQueue uses a linked list to store elements. Each node in the linked list contains data and a pointer to the next node.
 * 3. Memory Usage: Since each element requires additional space to store a pointer to the next element, linked lists may use more memory compared to arrays.
 * 4. Frequent Enqueuing and Dequeuing Operations: If your application involves frequent enqueuing and dequeuing operations and is less concerned with random access, then LinkedListQueue is a good choice.
 */
export class LinkedListQueue<E = any, R = any> extends SinglyLinkedList<E, R> {
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   * The `clone` function returns a new instance of the `LinkedListQueue` class with the same values as
   * the current instance.
   * @returns The `clone()` method is returning a new instance of `LinkedListQueue` with the same
   * values as the original `LinkedListQueue`.
   */
  override clone(): this {
    return new LinkedListQueue<E, R>(this, { toElementFn: this.toElementFn, maxLen: this._maxLen }) as this;
  }
}
