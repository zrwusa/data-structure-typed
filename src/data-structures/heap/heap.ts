/**
 * data-structure-typed
 *
 * @author Kirk 
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {PriorityQueue} from '../priority-queue';
import type {HeapOptions} from '../../types';

export class HeapItem<V = any> {
  /**
   * The constructor function initializes an instance of a class with a priority and a value.
   * @param {number} priority - The `priority` parameter is a number that represents the priority of the value. It is
   * optional and has a default value of `NaN`.
   * @param {V | null} [val=null] - The `val` parameter is of type `V | null`, which means it can accept a value of type
   * `V` or `null`.
   */
  constructor(priority: number = Number.MAX_SAFE_INTEGER, val: V | null = null) {
    this._val = val;
    this._priority = priority;
  }

  private _priority: number;

  get priority(): number {
    return this._priority;
  }

  set priority(value: number) {
    this._priority = value;
  }

  private _val: V | null;

  get val(): V | null {
    return this._val;
  }

  set val(value: V | null) {
    this._val = value;
  }
}

export abstract class Heap<V = any> {
  /**
   * The function is a constructor for a class that initializes a priority callback function based on the
   * options provided.
   * @param [options] - An optional object that contains configuration options for the Heap.
   */
  protected constructor(options?: HeapOptions<V>) {
    if (options) {
      const {priorityExtractor} = options;
      if (priorityExtractor !== undefined && typeof priorityExtractor !== 'function') {
        throw new Error('.constructor expects a valid priority function');
      }
      this._priorityExtractor = priorityExtractor || (el => +el);
    } else {
      this._priorityExtractor = el => +el;
    }
  }

  protected abstract _pq: PriorityQueue<HeapItem<V>>;

  get pq() {
    return this._pq;
  }

  protected _priorityExtractor: (val: V) => number;
  get priorityExtractor() {
    return this._priorityExtractor;
  }

  /**
   * The function returns the size of a priority queue.
   * @returns The size of the priority queue.
   */
  get size(): number {
    return this._pq.size;
  }

  /**
   * The function checks if a priority queue is empty.
   * @returns {boolean} A boolean value indicating whether the size of the priority queue is less than 1.
   */
  isEmpty(): boolean {
    return this._pq.size < 1;
  }

  peek(isItem?: undefined): V | undefined;
  peek(isItem: false): V | undefined;
  peek(isItem: true): HeapItem<V> | null;

  /**
   * The `peek` function returns the top item in the priority queue without removing it.
   * @returns The `peek()` method is returning either a `HeapItem<V>` object or `null`.Returns an val with the highest priority in the queue
   */
  peek(isItem?: boolean): HeapItem<V> | null | V | undefined {
    isItem = isItem ?? false;
    const peeked = this._pq.peek();

    return isItem ? peeked : peeked?.val;
  }

  peekLast(isItem?: undefined): V | undefined;
  peekLast(isItem: false): V | undefined;
  peekLast(isItem: true): HeapItem<V> | null;

  /**
   * The `peekLast` function returns the last item in the heap.
   * @returns The method `peekLast()` returns either a `HeapItem<V>` object or `null`.Returns an val with the lowest priority in the queue
   */
  peekLast(isItem?: boolean): HeapItem<V> | null | V | undefined {
    isItem = isItem ?? false;
    const leafItem = this._pq.leaf();

    return isItem ? leafItem : leafItem?.val;
  }

  /**
   * The `add` function adds an val to a priority queue with an optional priority value.
   * @param {V} val - The `val` parameter represents the value that you want to add to the heap. It can be of any
   * type.
   * @param {number} [priority] - The `priority` parameter is an optional number that represents the priority of the
   * val being added to the heap. If the `val` parameter is a number, then the `priority` parameter is set to
   * the value of `val`. If the `val` parameter is not a number, then the
   * @returns The `add` method returns the instance of the `Heap` class.
   * @throws {Error} if priority is not a valid number
   */
  add(priority: number, val?: V): Heap<V> {
    val = val === undefined ? (priority as unknown as V) : val;
    this._pq.add(new HeapItem<V>(priority, val));

    return this;
  }

  poll(isItem?: undefined): V | undefined;
  poll(isItem: false): V | undefined;
  poll(isItem: true): HeapItem<V> | null;

  /**
   * The `poll` function returns the top item from a priority queue or null if the queue is empty.Removes and returns an val with the highest priority in the queue
   * @returns either a HeapItem<V> object or null.
   */
  poll(isItem?: boolean): HeapItem<V> | null | V | undefined {
    isItem = isItem ?? false;
    const top = this._pq.poll();
    if (!top) {
      return null;
    }

    return isItem ? top : top.val;
  }

  /**
   * The function checks if a given node or value exists in the priority queue.
   * @param {V | HeapItem<V>} node - The parameter `node` can be of type `V` or `HeapItem<V>`.
   * @returns a boolean value.
   */
  has(node: V | HeapItem<V>): boolean {
    if (node instanceof HeapItem) {
      return this.pq.getNodes().includes(node);
    } else {
      return (
        this.pq.getNodes().findIndex(item => {
          return item.val === node;
        }) !== -1
      );
    }
  }

  toArray(isItem?: undefined): (V | undefined)[];
  toArray(isItem: false): (V | undefined)[];
  toArray(isItem: true): (HeapItem<V> | null)[];

  /**
   * The `toArray` function returns an array of `HeapItem<V>` objects.
   * @returns An array of HeapItem<V> objects.Returns a sorted list of vals
   */
  toArray(isItem?: boolean): (HeapItem<V> | null | V | undefined)[] {
    isItem = isItem ?? false;
    const itemArray = this._pq.toArray();

    return isItem ? itemArray : itemArray.map(item => item.val);
  }

  sort(isItem?: undefined): (V | undefined)[];
  sort(isItem: false): (V | undefined)[];
  sort(isItem: true): (HeapItem<V> | null)[];

  /**
   * The function sorts the elements in the priority queue and returns either the sorted items or their values depending
   * on the value of the isItem parameter.
   * @param {boolean} [isItem] - The `isItem` parameter is a boolean flag that indicates whether the sorted result should
   * be an array of `HeapItem<V>` objects or an array of the values (`V`) of those objects. If `isItem` is `true`, the
   * sorted result will be an array of `HeapItem
   * @returns an array of either `HeapItem<V>`, `null`, `V`, or `undefined` values.
   */
  sort(isItem?: boolean): (HeapItem<V> | null | V | undefined)[] {
    isItem = isItem ?? false;
    const sorted = this._pq.sort();

    return isItem ? sorted : sorted.map(item => item.val);
  }

  /**
   * The clear function clears the priority queue.
   */
  clear(): void {
    this._pq.clear();
  }
}
