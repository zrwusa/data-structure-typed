/**
 * @license MIT
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @class
 */
import { SinglyLinkedList } from '../linked-list';

export class LinkedListQueue<E = any> extends SinglyLinkedList<E> {
  /**
   * The enqueue function adds a value to the end of an array.
   * @param {E} value - The value parameter represents the value that you want to add to the queue.
   */
  enqueue(value: E) {
    this.push(value);
  }

  /**
   * The `dequeue` function removes and returns the first element from a queue, or returns undefined if the queue is empty.
   * @returns The method is returning the element at the front of the queue, or undefined if the queue is empty.
   */
  dequeue(): E | undefined {
    return this.shift();
  }

  /**
   * The `getFirst` function returns the value of the head node in a linked list, or `undefined` if the list is empty.
   * @returns The `getFirst()` method is returning the value of the `head` node if it exists, otherwise it returns `undefined`.
   */
  getFirst(): E | undefined {
    return this.head?.value;
  }

  /**
   * The `peek` function returns the value of the head node in a linked list, or `undefined` if the list is empty.
   * @returns The `peek()` method is returning the value of the `head` node if it exists, otherwise it returns `undefined`.
   */
  peek(): E | undefined {
    return this.getFirst();
  }
}

export class Queue<E = any> {
  /**
   * The constructor initializes an instance of a class with an optional array of elements and sets the offset to 0.
   * @param {E[]} [elements] - The `elements` parameter is an optional array of elements of type `E`. If provided, it
   * will be used to initialize the `_nodes` property of the class. If not provided, the `_nodes` property will be
   * initialized as an empty array.
   */
  constructor(elements?: E[]) {
    this._nodes = elements || [];
    this._offset = 0;
  }

  protected _nodes: E[];

  get nodes(): E[] {
    return this._nodes;
  }

  protected _offset: number;

  get offset(): number {
    return this._offset;
  }

  /**
   * The size function returns the number of elements in an array.
   * @returns {number} The size of the array, which is the difference between the length of the array and the offset.
   */
  get size(): number {
    return this.nodes.length - this.offset;
  }

  /**
   * The function "fromArray" creates a new Queue object from an array of elements.Creates a queue from an existing array.
   * @public
   * @static
   * @param {E[]} elements - The "elements" parameter is an array of elements of type E.
   * @returns The method is returning a new instance of the Queue class, initialized with the elements from the input
   * array.
   */
  static fromArray<E>(elements: E[]): Queue<E> {
    return new Queue(elements);
  }

  /**
   * Time Complexity: O(1) - constant time as it adds an element to the end of the array.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(1) - constant time as it adds an element to the end of the array.
   * Space Complexity: O(1) - no additional space is used.
   *
   * The push function adds an element to the end of the queue and returns the updated queue.Adds an element at the back of the queue.
   * @param {E} element - The `element` parameter represents the element that you want to add to the queue.
   * @returns The `add` method is returning a `Queue<E>` object.
   */
  push(element: E): Queue<E> {
    this.nodes.push(element);
    return this;
  }

  /**
   * Time Complexity: O(n) - where n is the number of elements in the queue. In the worst case, it may need to shift all elements to update the offset.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(n) - where n is the number of elements in the queue. In the worst case, it may need to shift all elements to update the offset.
   * Space Complexity: O(1) - no additional space is used.
   *
   * The `shift` function removes and returns the first element in the queue, and adjusts the internal data structure if
   * necessary to optimize performance.
   * @returns The function `shift()` returns either the first element in the queue or `undefined` if the queue is empty.
   */
  shift(): E | undefined {
    if (this.size === 0) return undefined;

    const first = this.getFirst();
    this._offset += 1;

    if (this.offset * 2 < this.nodes.length) return first;

    // only delete dequeued elements when reaching half size
    // to decrease latency of shifting elements.
    this._nodes = this.nodes.slice(this.offset);
    this._offset = 0;
    return first;
  }

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   *
   * The `getFirst` function returns the first element of the array `_nodes` if it exists, otherwise it returns `undefined`.
   * @returns The `getFirst()` method returns the first element of the data structure, represented by the `_nodes` array at
   * the `_offset` index. If the data structure is empty (size is 0), it returns `undefined`.
   */
  getFirst(): E | undefined {
    return this.size > 0 ? this.nodes[this.offset] : undefined;
  }

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   *
   * The `peek` function returns the first element of the array `_nodes` if it exists, otherwise it returns `undefined`.
   * @returns The `peek()` method returns the first element of the data structure, represented by the `_nodes` array at
   * the `_offset` index. If the data structure is empty (size is 0), it returns `undefined`.
   */
  peek(): E | undefined {
    return this.getFirst();
  }

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   *
   * The `getLast` function returns the last element in an array-like data structure, or undefined if the structure is empty.
   * @returns The method `getLast()` returns the last element of the `_nodes` array if the array is not empty. If the
   * array is empty, it returns `undefined`.
   */
  getLast(): E | undefined {
    return this.size > 0 ? this.nodes[this.nodes.length - 1] : undefined;
  }

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   *
   * The `peekLast` function returns the last element in an array-like data structure, or undefined if the structure is empty.
   * @returns The method `peekLast()` returns the last element of the `_nodes` array if the array is not empty. If the
   * array is empty, it returns `undefined`.
   */
  peekLast(): E | undefined {
    return this.getLast();
  }

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the current offset.
   * Space Complexity: O(1) - no additional space is used.
   *
   * The enqueue function adds a value to the end of a queue.
   * @param {E} value - The value parameter represents the value that you want to add to the queue.
   */
  enqueue(value: E) {
    this.push(value);
  }

  /**
   * Time Complexity: O(n) - same as shift().
   * Space Complexity: O(1) - same as shift().
   */

  /**
   * Time Complexity: O(n) - same as shift().
   * Space Complexity: O(1) - same as shift().
   *
   * The `dequeue` function removes and returns the first element from a queue, or returns undefined if the queue is empty.
   * @returns The method is returning a value of type E or undefined.
   */
  dequeue(): E | undefined {
    return this.shift();
  }

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the specified index.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the specified index.
   * Space Complexity: O(1) - no additional space is used.
   *
   * @param index
   */
  getAt(index: number): E | undefined {
    return this.nodes[index];
  }

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the specified index.
   * Space Complexity: O(1) - no additional space is used.
   */

  /**
   * Time Complexity: O(1) - constant time as it retrieves the value at the specified index.
   * Space Complexity: O(1) - no additional space is used.
   *
   * The function checks if a data structure is empty by comparing its size to zero.
   * @returns {boolean} A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Time Complexity: O(1) - constant time as it returns a shallow copy of the internal array.
   * Space Complexity: O(n) - where n is the number of elements in the queue.
   */

  /**
   * Time Complexity: O(1) - constant time as it returns a shallow copy of the internal array.
   * Space Complexity: O(n) - where n is the number of elements in the queue.
   *
   * The toArray() function returns an array of elements from the current offset to the end of the _nodes array.
   * @returns An array of type E is being returned.
   */
  toArray(): E[] {
    return this.nodes.slice(this.offset);
  }

  /**
   * The clear function resets the nodes array and offset to their initial values.
   */
  clear(): void {
    this._nodes = [];
    this._offset = 0;
  }

  /**
   * Time Complexity: O(n) - where n is the number of elements in the queue. It creates a shallow copy of the internal array.
   * Space Complexity: O(n) - the space required is proportional to the number of elements in the queue.
   */

  /**
   * Time Complexity: O(n) - where n is the number of elements in the queue. It creates a shallow copy of the internal array.
   * Space Complexity: O(n) - the space required is proportional to the number of elements in the queue.
   *
   * The `clone()` function returns a new Queue object with the same elements as the original Queue.
   * @returns The `clone()` method is returning a new instance of the `Queue` class.
   */
  clone(): Queue<E> {
    return new Queue(this.nodes.slice(this.offset));
  }

  print(): void {
    console.log([...this]);
  }

  * [Symbol.iterator]() {
    for (const item of this.nodes) {
      yield item;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `forEach` function iterates over each element in a deque and applies a callback function to
   * each element.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * deque. It takes three parameters:
   */
  forEach(callback: (element: E, index: number, queue: this) => void) {
    let index = 0;
    for (const el of this) {
      callback(el, index, this);
      index++;
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
   * The `filter` function creates a new deque containing only the elements that satisfy the given
   * predicate function.
   * @param predicate - The `predicate` parameter is a function that takes three arguments: `element`,
   * `index`, and `deque`.
   * @returns The `filter` method is returning a new `Queue` object that contains only the elements
   * that satisfy the given `predicate` function.
   */
  filter(predicate: (element: E, index: number, queue: this) => boolean): Queue<E> {
    const newDeque = new Queue<E>([]);
    let index = 0;
    for (const el of this) {
      if (predicate(el, index, this)) {
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
   * The `map` function takes a callback function and applies it to each element in the deque,
   * returning a new deque with the results.
   * @param callback - The `callback` parameter is a function that takes three arguments:
   * @returns The `map` method is returning a new `Queue` object with the transformed elements.
   */
  map<T>(callback: (element: E, index: number, queue: this) => T): Queue<T> {
    const newDeque = new Queue<T>([]);
    let index = 0;
    for (const el of this) {
      newDeque.push(callback(el, index, this));
      index++;
    }
    return newDeque;
  }

  reduce<T>(callback: (accumulator: T, element: E, index: number, queue: this) => T, initialValue: T): T {
    let accumulator = initialValue;
    let index = 0;
    for (const el of this) {
      accumulator = callback(accumulator, el, index, this);
      index++;
    }
    return accumulator;
  }
}
