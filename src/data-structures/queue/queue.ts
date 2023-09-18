/**
 * @license MIT
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @class
 */
import {SinglyLinkedList} from '../linked-list';

export class Queue<T = any> extends SinglyLinkedList<T> {

  /**
   * The enqueue function adds a value to the end of an array.
   * @param {T} value - The value parameter represents the value that you want to add to the queue.
   */
  enqueue(value: T) {
    this.push(value);
  }

  /**
   * The `dequeue` function removes and returns the first element from a queue, or returns null if the queue is empty.
   * @returns The method is returning the element at the front of the queue, or null if the queue is empty.
   */
  dequeue(): T | undefined {
    return this.shift();
  }

  /**
   * The `peek` function returns the value of the head node in a linked list, or `undefined` if the list is empty.
   * @returns The `peek()` method is returning the value of the `head` node if it exists, otherwise it returns `undefined`.
   */
  peek(): T | undefined {
    return this.head?.val;
  }

  * [Symbol.iterator]() {
    let current = this.head;

    while (current) {
      yield current.val;
      current = current.next;
    }
  }
}

export class ArrayQueue<T = number> {
  protected _nodes: T[];
  protected _offset: number;

  /**
   * The constructor initializes an instance of a class with an optional array of elements and sets the offset to 0.
   * @param {T[]} [elements] - The `elements` parameter is an optional array of elements of type `T`. If provided, it
   * will be used to initialize the `_nodes` property of the class. If not provided, the `_nodes` property will be
   * initialized as an empty array.
   */
  constructor(elements?: T[]) {
    this._nodes = elements || [];
    this._offset = 0;
  }

  /**
   * The size function returns the number of elements in an array.
   * @returns {number} The size of the array, which is the difference between the length of the array and the offset.
   */
  get size(): number {
    return this._nodes.length - this._offset;
  }

  /**
   * The function "fromArray" creates a new Queue object from an array of elements.Creates a queue from an existing array.
   * @public
   * @static
   * @param {T[]} elements - The "elements" parameter is an array of elements of type T.
   * @returns The method is returning a new instance of the Queue class, initialized with the elements from the input
   * array.
   */
  static fromArray<T>(elements: T[]): ArrayQueue<T> {
    return new ArrayQueue(elements);
  }

  /**
   * The push function adds an element to the end of the queue and returns the updated queue.Adds an element at the back of the queue.
   * @param {T} element - The `element` parameter represents the element that you want to add to the queue.
   * @returns The `add` method is returning a `Queue<T>` object.
   */
  push(element: T): ArrayQueue<T> {
    this._nodes.push(element);
    return this;
  }

  /**
   * The `shift` function removes and returns the first element in the queue, and adjusts the internal data structure if
   * necessary to optimize performance.
   * @returns The function `shift()` returns either the first element in the queue or `null` if the queue is empty.
   */
  shift(): T | null {
    if (this.size === 0) return null;

    const first = this.peek();
    this._offset += 1;

    if (this._offset * 2 < this._nodes.length) return first;

    // only remove dequeued elements when reaching half size
    // to decrease latency of shifting elements.
    this._nodes = this._nodes.slice(this._offset);
    this._offset = 0;
    return first;
  }

  /**
   * The `peek` function returns the first element of the array `_nodes` if it exists, otherwise it returns `null`.
   * @returns The `peek()` method returns the first element of the data structure, represented by the `_nodes` array at
   * the `_offset` index. If the data structure is empty (size is 0), it returns `null`.
   */
  peek(): T | null {
    return this.size > 0 ? this._nodes[this._offset] : null;
  }

  /**
   * The `peekLast` function returns the last element in an array-like data structure, or null if the structure is empty.
   * @returns The method `peekLast()` returns the last element of the `_nodes` array if the array is not empty. If the
   * array is empty, it returns `null`.
   */
  peekLast(): T | null {
    return this.size > 0 ? this._nodes[this._nodes.length - 1] : null;
  }

  /**
   * The enqueue function adds a value to the end of a queue.
   * @param {T} value - The value parameter represents the value that you want to add to the queue.
   */
  enqueue(value: T) {
    this.push(value);
  }

  /**
   * The `dequeue` function removes and returns the first element from a queue, or returns null if the queue is empty.
   * @returns The method is returning a value of type T or null.
   */
  dequeue(): T | null {
    return this.shift();
  }

  /**
   * The function checks if a data structure is empty by comparing its size to zero.
   * @returns {boolean} A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * The toArray() function returns an array of elements from the current offset to the end of the _nodes array.
   * @returns An array of type T is being returned.
   */
  toArray(): T[] {
    return this._nodes.slice(this._offset);
  }

  /**
   * The clear function resets the nodes array and offset to their initial values.
   */
  clear(): void {
    this._nodes = [];
    this._offset = 0;
  }

  /**
   * The `clone()` function returns a new Queue object with the same elements as the original Queue.
   * @returns The `clone()` method is returning a new instance of the `Queue` class.
   */
  clone(): ArrayQueue<T> {
    return new ArrayQueue(this._nodes.slice(this._offset));
  }
}
