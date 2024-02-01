/**
 * @license MIT
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @class
 */
import type { ElementCallback, QueueOptions } from '../../types';
import { IterableElementBase } from '../base';
import { SinglyLinkedList } from '../linked-list';

/**
 * 1. First In, First Out (FIFO): The core feature of a queue is its first in, first out nature. The element added to the queue first will be the one to be removed first.
 * 2. Operations: The main operations include enqueue (adding an element to the end of the queue) and dequeue (removing and returning the element at the front of the queue). Typically, there is also a peek operation (looking at the front element without removing it).
 * 3. Uses: Queues are commonly used to manage a series of tasks or elements that need to be processed in order. For example, managing task queues in a multi-threaded environment, or in algorithms for data structures like trees and graphs for breadth-first search.
 * 4. Task Scheduling: Managing the order of task execution in operating systems or applications.
 * 5. Data Buffering: Acting as a buffer for data packets in network communication.
 * 6. Breadth-First Search (BFS): In traversal algorithms for graphs and trees, queues store elements that are to be visited.
 * 7. Real-time Queuing: Like queuing systems in banks or supermarkets.
 */
export class Queue<E = any, R = any> extends IterableElementBase<E, R, Queue<E, R>> {
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: QueueOptions<E, R>) {
    super(options);
    if (elements) {
      for (const el of elements) {
        if (this.toElementFn) this.push(this.toElementFn(el as R));
        else this.push(el as E);
      }
    }
  }

  protected _elements: E[] = [];

  /**
   * The elements function returns the elements of this set.
   * @return An array of the elements in the stack
   */
  get elements(): E[] {
    return this._elements;
  }

  protected _offset: number = 0;

  /**
   * The offset function returns the offset of the current page.
   * @return The value of the protected variable _offset
   */
  get offset(): number {
    return this._offset;
  }

  /**
   * The size function returns the number of elements in an array.
   * @returns {number} The size of the array, which is the difference between the length of the array and the offset.
   */
  get size(): number {
    return this.elements.length - this.offset;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `first` function returns the first element of the array `_elements` if it exists, otherwise it returns `undefined`.
   * @returns The `get first()` method returns the first element of the data structure, represented by the `_elements` array at
   * the `_offset` index. If the data structure is empty (size is 0), it returns `undefined`.
   */
  get first(): E | undefined {
    return this.size > 0 ? this.elements[this.offset] : undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `last` function returns the last element in an array-like data structure, or undefined if the structure is empty.
   * @returns The method `get last()` returns the last element of the `_elements` array if the array is not empty. If the
   * array is empty, it returns `undefined`.
   */
  get last(): E | undefined {
    return this.size > 0 ? this.elements[this.elements.length - 1] : undefined;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The push function adds an element to the end of the queue and returns the updated queue.Adds an element at the back of the queue.
   * @param {E} element - The `element` parameter represents the element that you want to add to the queue.
   * @returns The `add` method is returning a `Queue<E>` object.
   */
  push(element: E): boolean {
    this.elements.push(element);
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
   * The `shift` function removes and returns the first element in the queue, and adjusts the internal data structure if
   * necessary to optimize performance.
   * @returns The function `shift()` returns either the first element in the queue or `undefined` if the queue is empty.
   */
  shift(): E | undefined {
    if (this.size === 0) return undefined;

    const first = this.first;
    this._offset += 1;

    if (this.offset * 2 < this.elements.length) return first;

    // only delete dequeued elements when reaching half size
    // to decrease latency of shifting elements.
    this._elements = this.elements.slice(this.offset);
    this._offset = 0;
    return first;
  }

  /**
   * The delete function removes an element from the list.
   * @param element: E Specify the element to be deleted
   * @return A boolean value indicating whether the element was successfully deleted or not
   */
  delete(element: E): boolean {
    const index = this.elements.indexOf(element);
    return this.deleteAt(index);
  }

  /**
   * The deleteAt function deletes the element at a given index.
   * @param index: number Determine the index of the element to be deleted
   * @return A boolean value
   */
  deleteAt(index: number): boolean {
    const spliced = this.elements.splice(index, 1);
    return spliced.length === 1;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param index
   */
  at(index: number): E | undefined {
    return this.elements[index + this._offset];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if a data structure is empty by comparing its size to zero.
   * @returns {boolean} A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(n)
   *
   * The toArray() function returns an array of elements from the current offset to the end of the _elements array.
   * @returns An array of type E is being returned.
   */
  toArray(): E[] {
    return this.elements.slice(this.offset);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

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
   * Space Complexity: O(n)
   * where n is the number of elements in the queue. It creates a shallow copy of the internal array. the space required is proportional to the number of elements in the queue.
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone()` function returns a new Queue object with the same elements as the original Queue.
   * @returns The `clone()` method is returning a new instance of the `Queue` class.
   */
  clone(): Queue<E, R> {
    return new Queue(this.elements.slice(this.offset), { toElementFn: this.toElementFn });
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

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
  filter(predicate: ElementCallback<E, R, boolean, Queue<E, R>>, thisArg?: any): Queue<E, R> {
    const newDeque = new Queue<E, R>([], { toElementFn: this.toElementFn });
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

  map<EM, RM>(
    callback: ElementCallback<E, R, EM, Queue<E, R>>,
    toElementFn?: (rawElement: RM) => EM,
    thisArg?: any
  ): Queue<EM, RM> {
    const newDeque = new Queue<EM, RM>([], { toElementFn });
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
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `_getIterator` returns an iterable iterator for the elements in the class.
   */
  protected* _getIterator(): IterableIterator<E> {
    for (const item of this.elements.slice(this.offset)) {
      yield item;
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
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   * The `clone` function returns a new instance of the `LinkedListQueue` class with the same values as
   * the current instance.
   * @returns The `clone()` method is returning a new instance of `LinkedListQueue` with the same
   * values as the original `LinkedListQueue`.
   */
  override clone(): LinkedListQueue<E, R> {
    return new LinkedListQueue<E, R>(this, { toElementFn: this.toElementFn });
  }
}
