/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type { ElementCallback, LinearBaseOptions, QueueOptions } from '../../types';
import { SinglyLinkedList } from '../linked-list';
import { LinearBase } from '../base/linear-base';

/**
 * Array-backed queue with amortized O(1) enqueue/dequeue via an offset pointer and optional auto-compaction.
 * @remarks Time O(1), Space O(1)
 * @template E
 * @template R
 * 1. First In, First Out (FIFO): The core feature of a queue is its first in, first out nature. The element added to the queue first will be the one to be removed first.
 * 2. Operations: The main operations include enqueue (adding an element to the end of the queue) and dequeue (removing and returning the element at the front of the queue). Typically, there is also a peek operation (looking at the front element without removing it).
 * 3. Uses: Queues are commonly used to manage a series of tasks or elements that need to be processed in order. For example, managing task queues in a multi-threaded environment, or in algorithms for data structures like trees and graphs for breadth-first search.
 * 4. Task Scheduling: Managing the order of task execution in operating systems or applications.
 * 5. Data Buffering: Acting as a buffer for data packets in network communication.
 * 6. Breadth-First Search (BFS): In traversal algorithms for graphs and trees, queues store elements that are to be visited.
 * 7. Real-time Queuing: Like queuing systems in banks or supermarkets.
 * @example
 * // Sliding Window using Queue
 *     const nums = [2, 3, 4, 1, 5];
 *     const k = 2;
 *     const queue = new Queue<number>();
 *
 *     let maxSum = 0;
 *     let currentSum = 0;
 *
 *     nums.forEach(num => {
 *       queue.push(num);
 *       currentSum += num;
 *
 *       if (queue.length > k) {
 *         currentSum -= queue.shift()!;
 *       }
 *
 *       if (queue.length === k) {
 *         maxSum = Math.max(maxSum, currentSum);
 *       }
 *     });
 *
 *     console.log(maxSum); // 7
 * @example
 * // Breadth-First Search (BFS) using Queue
 *     const graph: { [key in number]: number[] } = {
 *       1: [2, 3],
 *       2: [4, 5],
 *       3: [],
 *       4: [],
 *       5: []
 *     };
 *
 *     const queue = new Queue<number>();
 *     const visited: number[] = [];
 *
 *     queue.push(1);
 *
 *     while (!queue.isEmpty()) {
 *       const node = queue.shift()!;
 *       if (!visited.includes(node)) {
 *         visited.push(node);
 *         graph[node].forEach(neighbor => queue.push(neighbor));
 *       }
 *     }
 *
 *     console.log(visited); // [1, 2, 3, 4, 5]
 */
export class Queue<E = any, R = any> extends LinearBase<E, R> {
  /**
   * Create a Queue and optionally bulk-insert elements.
   * @remarks Time O(N), Space O(N)
   * @param [elements] - Iterable of elements (or raw records if toElementFn is set).
   * @param [options] - Options such as toElementFn, maxLen, and autoCompactRatio.
   * @returns New Queue instance.
   */

  constructor(elements: Iterable<E> | Iterable<R> = [], options?: QueueOptions<E, R>) {
    super(options);
    if (options) {
      const { autoCompactRatio = 0.5 } = options;
      this._autoCompactRatio = autoCompactRatio;
    }
    this.pushMany(elements);
  }

  protected _elements: E[] = [];

  /**
   * Get the underlying array buffer.
   * @remarks Time O(1), Space O(1)
   * @returns Backing array of elements.
   */

  get elements(): E[] {
    return this._elements;
  }

  protected _offset = 0;

  /**
   * Get the current start offset into the array.
   * @remarks Time O(1), Space O(1)
   * @returns Zero-based offset.
   */

  get offset(): number {
    return this._offset;
  }

  protected _autoCompactRatio = 0.5;

  /**
   * Get the compaction threshold (offset/size).
   * @remarks Time O(1), Space O(1)
   * @returns Auto-compaction ratio in (0,1].
   */

  get autoCompactRatio(): number {
    return this._autoCompactRatio;
  }

  /**
   * Set the compaction threshold.
   * @remarks Time O(1), Space O(1)
   * @param value - New ratio; compacts when offset/size exceeds this value.
   * @returns void
   */

  set autoCompactRatio(value: number) {
    this._autoCompactRatio = value;
  }

  /**
   * Get the number of elements currently in the queue.
   * @remarks Time O(1), Space O(1)
   * @returns Current length.
   */

  get length(): number {
    return this.elements.length - this._offset;
  }

  /**
   * Get the first element (front) without removing it.
   * @remarks Time O(1), Space O(1)
   * @returns Front element or undefined.
   */

  get first(): E | undefined {
    return this.length > 0 ? this.elements[this._offset] : undefined;
  }

  /**
   * Get the last element (back) without removing it.
   * @remarks Time O(1), Space O(1)
   * @returns Back element or undefined.
   */

  get last(): E | undefined {
    return this.length > 0 ? this.elements[this.elements.length - 1] : undefined;
  }

  /**
   * Create a queue from an array of elements.
   * @remarks Time O(N), Space O(N)
   * @template E
   * @param elements - Array of elements to enqueue in order.
   * @returns A new queue populated from the array.
   */

  static fromArray<E>(elements: E[]): Queue<E> {
    return new Queue(elements);
  }

  /**
   * Check whether the queue is empty.
   * @remarks Time O(1), Space O(1)
   * @returns True if length is 0.
   */

  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Enqueue one element at the back.
   * @remarks Time O(1), Space O(1)
   * @param element - Element to enqueue.
   * @returns True on success.
   */

  push(element: E): boolean {
    this.elements.push(element);
    if (this._maxLen > 0 && this.length > this._maxLen) this.shift();
    return true;
  }

  /**
   * Enqueue many elements from an iterable.
   * @remarks Time O(N), Space O(1)
   * @param elements - Iterable of elements (or raw records if toElementFn is set).
   * @returns Array of per-element success flags.
   */

  pushMany(elements: Iterable<E> | Iterable<R>): boolean[] {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) ans.push(this.push(this.toElementFn(el as R)));
      else ans.push(this.push(el as E));
    }
    return ans;
  }

  /**
   * Dequeue one element from the front (amortized via offset).
   * @remarks Time O(1) amortized, Space O(1)
   * @returns Removed element or undefined.
   */

  shift(): E | undefined {
    if (this.length === 0) return undefined;
    const first = this.first;
    this._offset += 1;
    if (this.elements.length > 0 && this.offset / this.elements.length > this.autoCompactRatio) this.compact();
    return first;
  }

  /**
   * Delete the first occurrence of a specific element.
   * @remarks Time O(N), Space O(1)
   * @param element - Element to remove (strict equality via Object.is).
   * @returns True if an element was removed.
   */

  delete(element: E): boolean {
    for (let i = this._offset; i < this.elements.length; i++) {
      if (Object.is(this.elements[i], element)) {
        this.elements.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Get the element at a given logical index.
   * @remarks Time O(1), Space O(1)
   * @param index - Zero-based index from the front.
   * @returns Element or undefined.
   */

  at(index: number): E | undefined {
    if (index < 0 || index >= this.length) return undefined;
    return this._elements[this._offset + index];
  }

  /**
   * Delete the element at a given index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index from the front.
   * @returns Removed element or undefined.
   */

  deleteAt(index: number): E | undefined {
    if (index < 0 || index >= this.length) return undefined;
    const gi = this._offset + index;
    const [deleted] = this.elements.splice(gi, 1);
    return deleted;
  }

  /**
   * Insert a new element at a given index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index from the front.
   * @param newElement - Element to insert.
   * @returns True if inserted.
   */

  addAt(index: number, newElement: E): boolean {
    if (index < 0 || index > this.length) return false;
    this._elements.splice(this._offset + index, 0, newElement);
    return true;
  }

  /**
   * Replace the element at a given index.
   * @remarks Time O(1), Space O(1)
   * @param index - Zero-based index from the front.
   * @param newElement - New element to set.
   * @returns True if updated.
   */

  setAt(index: number, newElement: E): boolean {
    if (index < 0 || index >= this.length) return false;
    this._elements[this._offset + index] = newElement;
    return true;
  }

  /**
   * Reverse the queue in-place by compacting then reversing.
   * @remarks Time O(N), Space O(N)
   * @returns This queue.
   */

  reverse(): this {
    this._elements = this.elements.slice(this._offset).reverse();
    this._offset = 0;
    return this;
  }

  /**
   * Remove all elements and reset offset.
   * @remarks Time O(1), Space O(1)
   * @returns void
   */

  clear(): void {
    this._elements = [];
    this._offset = 0;
  }

  /**
   * Compact storage by discarding consumed head elements.
   * @remarks Time O(N), Space O(N)
   * @returns True when compaction performed.
   */

  compact(): boolean {
    this._elements = this.elements.slice(this._offset);
    this._offset = 0;
    return true;
  }

  /**
   * Remove and/or insert elements at a position (array-like).
   * @remarks Time O(N + M), Space O(M)
   * @param start - Start index (clamped to [0, length]).
   * @param [deleteCount] - Number of elements to remove (default 0).
   * @param [items] - Elements to insert after `start`.
   * @returns A new queue containing the removed elements (typed as `this`).
   */

  override splice(start: number, deleteCount: number = 0, ...items: E[]): this {
    start = Math.max(0, Math.min(start, this.length));
    deleteCount = Math.max(0, Math.min(deleteCount, this.length - start));

    const gi = this._offset + start;
    const removedArray = this._elements.splice(gi, deleteCount, ...items);

    if (this.elements.length > 0 && this.offset / this.elements.length > this.autoCompactRatio) this.compact();

    const removed = this._createInstance({ toElementFn: this.toElementFn, maxLen: this._maxLen });
    removed._setAutoCompactRatio(this._autoCompactRatio);
    removed.pushMany(removedArray);

    return removed as unknown as this;
  }

  /**
   * Deep clone this queue and its parameters.
   * @remarks Time O(N), Space O(N)
   * @returns A new queue with the same content and options.
   */

  clone(): this {
    const out = this._createInstance({ toElementFn: this.toElementFn, maxLen: this._maxLen });
    out._setAutoCompactRatio(this._autoCompactRatio);
    for (let i = this._offset; i < this.elements.length; i++) out.push(this.elements[i]);
    return out;
  }

  /**
   * Filter elements into a new queue of the same class.
   * @remarks Time O(N), Space O(N)
   * @param predicate - Predicate (element, index, queue) → boolean to keep element.
   * @param [thisArg] - Value for `this` inside the predicate.
   * @returns A new queue with kept elements.
   */

  filter(predicate: ElementCallback<E, R, boolean>, thisArg?: unknown): this {
    const out = this._createInstance({ toElementFn: this.toElementFn, maxLen: this._maxLen });
    out._setAutoCompactRatio(this._autoCompactRatio);
    let index = 0;
    for (const v of this) {
      if (predicate.call(thisArg, v, index, this)) out.push(v);
      index++;
    }
    return out;
  }

  /**
   * Map each element to a new element in a possibly different-typed queue.
   * @remarks Time O(N), Space O(N)
   * @template EM
   * @template RM
   * @param callback - Mapping function (element, index, queue) → newElement.
   * @param [options] - Options for the output queue (e.g., toElementFn, maxLen, autoCompactRatio).
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new Queue with mapped elements.
   */

  map<EM, RM>(callback: ElementCallback<E, R, EM>, options?: QueueOptions<EM, RM>, thisArg?: unknown): Queue<EM, RM> {
    const out = new (this.constructor as new (
      elements?: Iterable<EM> | Iterable<RM>,
      options?: QueueOptions<EM, RM>
    ) => Queue<EM, RM>)([], {
      toElementFn: options?.toElementFn,
      maxLen: options?.maxLen ?? this._maxLen,
      autoCompactRatio: options?.autoCompactRatio ?? this._autoCompactRatio
    });
    let index = 0;
    for (const v of this)
      out.push(thisArg === undefined ? callback(v, index++, this) : callback.call(thisArg, v, index++, this));
    return out;
  }

  /**
   * Map each element to a new value of the same type.
   * @remarks Time O(N), Space O(N)
   * @param callback - Mapping function (element, index, queue) → element.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new queue with mapped elements (same element type).
   */

  mapSame(callback: ElementCallback<E, R, E>, thisArg?: unknown): this {
    const Ctor = this.constructor as new (
      elements?: Iterable<E> | Iterable<R>,
      options?: QueueOptions<E, R>
    ) => Queue<E, R>;
    const out = new Ctor([], {
      toElementFn: this.toElementFn,
      maxLen: this._maxLen,
      autoCompactRatio: this._autoCompactRatio
    });
    out._setAutoCompactRatio?.(this._autoCompactRatio);
    let index = 0;
    for (const v of this) {
      const mv = thisArg === undefined ? callback(v, index++, this) : callback.call(thisArg, v, index++, this);
      out.push(mv);
    }
    return out as this;
  }

  /**
   * (Protected) Set the internal auto-compaction ratio.
   * @remarks Time O(1), Space O(1)
   * @param value - New ratio to assign.
   * @returns void
   */

  protected _setAutoCompactRatio(value: number): void {
    this._autoCompactRatio = value;
  }

  /**
   * (Protected) Iterate elements from front to back.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of E.
   */

  protected *_getIterator(): IterableIterator<E> {
    for (let i = this._offset; i < this.elements.length; i++) yield this.elements[i];
  }

  /**
   * (Protected) Iterate elements from back to front.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of E.
   */

  protected *_getReverseIterator(): IterableIterator<E> {
    for (let i = this.length - 1; i >= 0; i--) {
      const cur = this.at(i);
      if (cur !== undefined) yield cur;
    }
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind queue instance.
   */

  protected override _createInstance(options?: LinearBaseOptions<E, R>): this {
    const Ctor = this.constructor as new (elements?: Iterable<E> | Iterable<R>, options?: QueueOptions<E, R>) => this;
    return new Ctor([], options as QueueOptions<E, R> | undefined);
  }

  /**
   * (Protected) Create a like-kind queue and seed it from an iterable.
   * @remarks Time O(N), Space O(N)
   * @template EM
   * @template RM
   * @param [elements] - Iterable used to seed the new queue.
   * @param [options] - Options forwarded to the constructor.
   * @returns A like-kind Queue instance.
   */

  protected _createLike<EM = E, RM = R>(
    elements: Iterable<EM> | Iterable<RM> = [],
    options?: QueueOptions<EM, RM>
  ): Queue<EM, RM> {
    const Ctor = this.constructor as new (
      elements?: Iterable<EM> | Iterable<RM>,
      options?: QueueOptions<EM, RM>
    ) => Queue<EM, RM>;
    return new Ctor(elements, options);
  }
}

/**
 * Queue implemented over a singly linked list; preserves head/tail operations with linear scans for queries.
 * @remarks Time O(1), Space O(1)
 * @template E
 * @template R
 * @example examples will be generated by unit test
 */
export class LinkedListQueue<E = any, R = any> extends SinglyLinkedList<E, R> {
  /**
   * Deep clone this linked-list-based queue.
   * @remarks Time O(N), Space O(N)
   * @returns A new queue with the same sequence of elements.
   */

  override clone(): this {
    const out = this._createInstance({ toElementFn: this.toElementFn, maxLen: this._maxLen });
    for (const v of this) out.push(v);
    return out;
  }
}
