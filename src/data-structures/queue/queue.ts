/**
 * @license MIT
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @class
 */
import {SinglyLinkedList} from '../linked-list';

export class LinkedListQueue<E = any> extends SinglyLinkedList<E> {
  /**
   * The enqueue function adds a value to the end of an array.
   * @param {E} value - The value parameter represents the value that you want to add to the queue.
   */
  enqueue(value: E) {
    this.push(value);
  }

  /**
   * The `dequeue` function removes and returns the first element from a queue, or returns null if the queue is empty.
   * @returns The method is returning the element at the front of the queue, or null if the queue is empty.
   */
  dequeue(): E | undefined {
    return this.shift();
  }

  /**
   * The `peek` function returns the value of the head node in a linked list, or `undefined` if the list is empty.
   * @returns The `peek()` method is returning the value of the `head` node if it exists, otherwise it returns `undefined`.
   */
  peek(): E | undefined {
    return this.head?.val;
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

  private _nodes: E[];

  get nodes(): E[] {
    return this._nodes;
  }

  set nodes(value: E[]) {
    this._nodes = value;
  }

  private _offset: number;

  get offset(): number {
    return this._offset;
  }

  set offset(value: number) {
    this._offset = value;
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
   * The push function adds an element to the end of the queue and returns the updated queue.Adds an element at the back of the queue.
   * @param {E} element - The `element` parameter represents the element that you want to add to the queue.
   * @returns The `add` method is returning a `Queue<E>` object.
   */
  push(element: E): Queue<E> {
    this.nodes.push(element);
    return this;
  }

  /**
   * The `shift` function removes and returns the first element in the queue, and adjusts the internal data structure if
   * necessary to optimize performance.
   * @returns The function `shift()` returns either the first element in the queue or `null` if the queue is empty.
   */
  shift(): E | undefined {
    if (this.size === 0) return undefined;

    const first = this.peek();
    this.offset += 1;

    if (this.offset * 2 < this.nodes.length) return first;

    // only remove dequeued elements when reaching half size
    // to decrease latency of shifting elements.
    this.nodes = this.nodes.slice(this.offset);
    this.offset = 0;
    return first;
  }

  /**
   * The `peek` function returns the first element of the array `_nodes` if it exists, otherwise it returns `null`.
   * @returns The `peek()` method returns the first element of the data structure, represented by the `_nodes` array at
   * the `_offset` index. If the data structure is empty (size is 0), it returns `null`.
   */
  peek(): E | undefined {
    return this.size > 0 ? this.nodes[this.offset] : undefined;
  }

  /**
   * The `peekLast` function returns the last element in an array-like data structure, or null if the structure is empty.
   * @returns The method `peekLast()` returns the last element of the `_nodes` array if the array is not empty. If the
   * array is empty, it returns `null`.
   */
  peekLast(): E | undefined {
    return this.size > 0 ? this.nodes[this.nodes.length - 1] : undefined;
  }

  /**
   * The enqueue function adds a value to the end of a queue.
   * @param {E} value - The value parameter represents the value that you want to add to the queue.
   */
  enqueue(value: E) {
    this.push(value);
  }

  /**
   * The `dequeue` function removes and returns the first element from a queue, or returns null if the queue is empty.
   * @returns The method is returning a value of type E or null.
   */
  dequeue(): E | undefined {
    return this.shift();
  }

  getAt(index: number): E | undefined {
    return this.nodes[index];
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
   * @returns An array of type E is being returned.
   */
  toArray(): E[] {
    return this.nodes.slice(this.offset);
  }

  /**
   * The clear function resets the nodes array and offset to their initial values.
   */
  clear(): void {
    this.nodes = [];
    this.offset = 0;
  }

  /**
   * The `clone()` function returns a new Queue object with the same elements as the original Queue.
   * @returns The `clone()` method is returning a new instance of the `Queue` class.
   */
  clone(): Queue<E> {
    return new Queue(this.nodes.slice(this.offset));
  }

  *[Symbol.iterator]() {
    for (const item of this.nodes) {
      yield item;
    }
  }
}
