/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type { Comparator, DFSOrderPattern, ElementCallback, HeapOptions } from '../../types';
import { IterableElementBase } from '../base';

/**
 * Binary heap with pluggable comparator; supports fast insertion and removal of the top element.
 * @remarks Time O(1), Space O(1)
 * @template E
 * @template R
 * 1. Complete Binary Tree: Heaps are typically complete binary trees, meaning every level is fully filled except possibly for the last level, which has nodes as far left as possible.
 * 2. Heap Properties: Each node in a heap follows a specific order property, which varies depending on the type of heap:
 * Max Heap: The value of each parent node is greater than or equal to the value of its children.
 * Min Heap: The value of each parent node is less than or equal to the value of its children.
 * 3. Root Node Access: In a heap, the largest element (in a max heap) or the smallest element (in a min heap) is always at the root of the tree.
 * 4. Efficient Insertion and Deletion: Due to its structure, a heap allows for insertion and deletion operations in logarithmic time (O(log n)).
 * 5. Managing Dynamic Data Sets: Heaps effectively manage dynamic data sets, especially when frequent access to the largest or smallest elements is required.
 * 6. Non-linear Search: While a heap allows rapid access to its largest or smallest element, it is less efficient for other operations, such as searching for a specific element, as it is not designed for these tasks.
 * 7. Efficient Sorting Algorithms: For example, heap sort. Heap sort uses the properties of a heap to sort elements.
 * 8. Graph Algorithms: Such as Dijkstra's shortest path algorithm and Prime's minimum-spanning tree algorithm, which use heaps to improve performance.
 * @example
 * // basic Heap creation and add operation
 *  // Create a min heap (default)
 *     const minHeap = new Heap([5, 3, 7, 1, 9, 2]);
 *
 *     // Verify size
 *     console.log(minHeap.size); // 6;
 *
 *     // Add new element
 *     minHeap.add(4);
 *     console.log(minHeap.size); // 7;
 *
 *     // Min heap property: smallest element at root
 *     const min = minHeap.peek();
 *     console.log(min); // 1;
 * @example
 * // Heap with custom comparator (MaxHeap behavior)
 *  interface Task {
 *       id: number;
 *       priority: number;
 *       name: string;
 *     }
 *
 *     // Custom comparator for max heap behavior (higher priority first)
 *     const tasks: Task[] = [
 *       { id: 1, priority: 5, name: 'Email' },
 *       { id: 2, priority: 3, name: 'Chat' },
 *       { id: 3, priority: 8, name: 'Alert' }
 *     ];
 *
 *     const maxHeap = new Heap(tasks, {
 *       comparator: (a: Task, b: Task) => b.priority - a.priority
 *     });
 *
 *     console.log(maxHeap.size); // 3;
 *
 *     // Peek returns highest priority task
 *     const topTask = maxHeap.peek();
 *     console.log(topTask?.priority); // 8;
 *     console.log(topTask?.name); // 'Alert';
 * @example
 * // Heap for event processing with priority
 *  interface Event {
 *       id: number;
 *       type: 'critical' | 'warning' | 'info';
 *       timestamp: number;
 *       message: string;
 *     }
 *
 *     // Custom priority: critical > warning > info
 *     const priorityMap = { critical: 3, warning: 2, info: 1 };
 *
 *     const eventHeap = new Heap<Event>([], {
 *       comparator: (a: Event, b: Event) => {
 *         const priorityA = priorityMap[a.type];
 *         const priorityB = priorityMap[b.type];
 *         return priorityB - priorityA; // Higher priority first
 *       }
 *     });
 *
 *     // Add events in random order
 *     eventHeap.add({ id: 1, type: 'info', timestamp: 100, message: 'User logged in' });
 *     eventHeap.add({ id: 2, type: 'critical', timestamp: 101, message: 'Server down' });
 *     eventHeap.add({ id: 3, type: 'warning', timestamp: 102, message: 'High memory' });
 *     eventHeap.add({ id: 4, type: 'info', timestamp: 103, message: 'Cache cleared' });
 *     eventHeap.add({ id: 5, type: 'critical', timestamp: 104, message: 'Database error' });
 *
 *     console.log(eventHeap.size); // 5;
 *
 *     // Process events by priority (critical first)
 *     const processedOrder: Event[] = [];
 *     while (eventHeap.size > 0) {
 *       const event = eventHeap.poll();
 *       if (event) {
 *         processedOrder.push(event);
 *       }
 *     }
 *
 *     // Verify critical events came first
 *     console.log(processedOrder[0].type); // 'critical';
 *     console.log(processedOrder[1].type); // 'critical';
 *     console.log(processedOrder[2].type); // 'warning';
 *     console.log(processedOrder[3].type); // 'info';
 *     console.log(processedOrder[4].type); // 'info';
 *
 *     // Verify O(log n) operations
 *     const newHeap = new Heap<number>([5, 3, 7, 1]);
 *
 *     // Add - O(log n)
 *     newHeap.add(2);
 *     console.log(newHeap.size); // 5;
 *
 *     // Poll - O(log n)
 *     const removed = newHeap.poll();
 *     console.log(removed); // 1;
 *
 *     // Peek - O(1)
 *     const top = newHeap.peek();
 *     console.log(top); // 2;
 * @example
 * // Use Heap to solve top k problems
 *  function topKElements(arr: number[], k: number): number[] {
 *       const heap = new Heap<number>([], { comparator: (a, b) => b - a }); // Max heap
 *       arr.forEach(num => {
 *         heap.add(num);
 *         if (heap.size > k) heap.poll(); // Keep the heap size at K
 *       });
 *       return heap.toArray();
 *     }
 *
 *     const numbers = [10, 30, 20, 5, 15, 25];
 *     console.log(topKElements(numbers, 3)); // [15, 10, 5];
 * @example
 * // Use Heap to dynamically maintain the median
 *  class MedianFinder {
 *       private low: MaxHeap<number>; // Max heap, stores the smaller half
 *       private high: MinHeap<number>; // Min heap, stores the larger half
 *
 *       constructor() {
 *         this.low = new MaxHeap<number>([]);
 *         this.high = new MinHeap<number>([]);
 *       }
 *
 *       addNum(num: number): void {
 *         if (this.low.isEmpty() || num <= this.low.peek()!) this.low.add(num);
 *         else this.high.add(num);
 *
 *         // Balance heaps
 *         if (this.low.size > this.high.size + 1) this.high.add(this.low.poll()!);
 *         else if (this.high.size > this.low.size) this.low.add(this.high.poll()!);
 *       }
 *
 *       findMedian(): number {
 *         if (this.low.size === this.high.size) return (this.low.peek()! + this.high.peek()!) / 2;
 *         return this.low.peek()!;
 *       }
 *     }
 *
 *     const medianFinder = new MedianFinder();
 *     medianFinder.addNum(10);
 *     console.log(medianFinder.findMedian()); // 10;
 *     medianFinder.addNum(20);
 *     console.log(medianFinder.findMedian()); // 15;
 *     medianFinder.addNum(30);
 *     console.log(medianFinder.findMedian()); // 20;
 *     medianFinder.addNum(40);
 *     console.log(medianFinder.findMedian()); // 25;
 *     medianFinder.addNum(50);
 *     console.log(medianFinder.findMedian()); // 30;
 * @example
 * // Use Heap for load balancing
 *  function loadBalance(requests: number[], servers: number): number[] {
 *       const serverHeap = new Heap<{ id: number; load: number }>([], { comparator: (a, b) => a.load - b.load }); // min heap
 *       const serverLoads = new Array(servers).fill(0);
 *
 *       for (let i = 0; i < servers; i++) {
 *         serverHeap.add({ id: i, load: 0 });
 *       }
 *
 *       requests.forEach(req => {
 *         const server = serverHeap.poll()!;
 *         serverLoads[server.id] += req;
 *         server.load += req;
 *         serverHeap.add(server); // The server after updating the load is re-entered into the heap
 *       });
 *
 *       return serverLoads;
 *     }
 *
 *     const requests = [5, 2, 8, 3, 7];
 *     console.log(loadBalance(requests, 3)); // [12, 8, 5];
 * @example
 * // Use Heap to schedule tasks
 *  type Task = [string, number];
 *
 *     function scheduleTasks(tasks: Task[], machines: number): Map<number, Task[]> {
 *       const machineHeap = new Heap<{ id: number; load: number }>([], { comparator: (a, b) => a.load - b.load }); // Min heap
 *       const allocation = new Map<number, Task[]>();
 *
 *       // Initialize the load on each machine
 *       for (let i = 0; i < machines; i++) {
 *         machineHeap.add({ id: i, load: 0 });
 *         allocation.set(i, []);
 *       }
 *
 *       // Assign tasks
 *       tasks.forEach(([task, load]) => {
 *         const machine = machineHeap.poll()!;
 *         allocation.get(machine.id)!.push([task, load]);
 *         machine.load += load;
 *         machineHeap.add(machine); // The machine after updating the load is re-entered into the heap
 *       });
 *
 *       return allocation;
 *     }
 *
 *     const tasks: Task[] = [
 *       ['Task1', 3],
 *       ['Task2', 1],
 *       ['Task3', 2],
 *       ['Task4', 5],
 *       ['Task5', 4]
 *     ];
 *     const expectedMap = new Map<number, Task[]>();
 *     expectedMap.set(0, [
 *       ['Task1', 3],
 *       ['Task4', 5]
 *     ]);
 *     expectedMap.set(1, [
 *       ['Task2', 1],
 *       ['Task3', 2],
 *       ['Task5', 4]
 *     ]);
 *     console.log(scheduleTasks(tasks, 2)); // expectedMap;
 */
export class Heap<E = any, R = any> extends IterableElementBase<E, R> {
  protected _equals: (a: E, b: E) => boolean = Object.is;

  /**
   * Create a Heap and optionally bulk-insert elements.
   * @remarks Time O(N), Space O(N)
   * @param [elements] - Iterable of elements (or raw values if toElementFn is set).
   * @param [options] - Options such as comparator and toElementFn.
   * @returns New Heap instance.
   */

  constructor(elements: Iterable<E | R> = [], options?: HeapOptions<E, R>) {
    super(options);

    if (options) {
      const { comparator } = options;
      if (comparator) this._comparator = comparator;
    }

    this.addMany(elements as Iterable<E | R>);
  }

  protected _elements: E[] = [];

  /**
   * Get the backing array of the heap.
   * @remarks Time O(1), Space O(1)
   * @returns Internal elements array.
   */

  get elements(): E[] {
    return this._elements;
  }

  /**
   * Get the number of elements.
   * @remarks Time O(1), Space O(1)
   * @returns Heap size.
   */

  get size(): number {
    return this.elements.length;
  }

  /**
   * Get the last leaf element.
   * @remarks Time O(1), Space O(1)
   * @returns Last element or undefined.
   */

  get leaf(): E | undefined {
    return this.elements[this.size - 1] ?? undefined;
  }

  /**
   * Create a heap of the same class from an iterable.
   * @remarks Time O(N), Space O(N)
   * @template T
   * @template R
   * @template S
   * @param [elements] - Iterable of elements or raw records.
   * @param [options] - Heap options including comparator.
   * @returns A new heap instance of this class.
   */

  static from<T, R = any, S extends Heap<T, R> = Heap<T, R>>(
    this: new (elements?: Iterable<T | R>, options?: HeapOptions<T, R>) => S,
    elements?: Iterable<T | R>,
    options?: HeapOptions<T, R>
  ): S {
    return new this(elements, options);
  }

  /**
   * Build a Heap from an iterable in linear time given a comparator.
   * @remarks Time O(N), Space O(N)
   * @template EE
   * @template RR
   * @param elements - Iterable of elements.
   * @param options - Heap options including comparator.
   * @returns A new Heap built from elements.
   */

  static heapify<EE = any, RR = any>(elements: Iterable<EE>, options: HeapOptions<EE, RR>): Heap<EE, RR> {
    return new Heap<EE, RR>(elements, options);
  }

  /**
   * Insert an element.
   * @remarks Time O(1) amortized, Space O(1)
   * @param element - Element to insert.
   * @returns True.
   */

  add(element: E): boolean {
    this._elements.push(element);
    return this._bubbleUp(this.elements.length - 1);
  }

  /**
   * Insert many elements from an iterable.
   * @remarks Time O(N log N), Space O(1)
   * @param elements - Iterable of elements or raw values.
   * @returns Array of per-element success flags.
   */

  addMany(elements: Iterable<E | R>): boolean[] {
    const flags: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) {
        const ok = this.add(this.toElementFn(el as R));
        flags.push(ok);
      } else {
        const ok = this.add(el as E);
        flags.push(ok);
      }
    }
    return flags;
  }

  /**
   * Remove and return the top element.
   * @remarks Time O(log N), Space O(1)
   * @returns Top element or undefined.
   */

  poll(): E | undefined {
    if (this.elements.length === 0) return;
    const value = this.elements[0];
    const last = this.elements.pop()!;
    if (this.elements.length) {
      this.elements[0] = last;
      this._sinkDown(0, this.elements.length >> 1);
    }
    return value;
  }

  /**
   * Get the current top element without removing it.
   * @remarks Time O(1), Space O(1)
   * @returns Top element or undefined.
   */

  peek(): E | undefined {
    return this.elements[0];
  }

  /**
   * Check whether the heap is empty.
   * @remarks Time O(1), Space O(1)
   * @returns True if size is 0.
   */

  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Remove all elements.
   * @remarks Time O(1), Space O(1)
   * @returns void
   */

  clear(): void {
    this._elements = [];
  }

  /**
   * Replace the backing array and rebuild the heap.
   * @remarks Time O(N), Space O(N)
   * @param elements - Iterable used to refill the heap.
   * @returns Array of per-node results from fixing steps.
   */

  refill(elements: Iterable<E>): boolean[] {
    this._elements = Array.from(elements);
    return this.fix();
  }

  /**
   * Check if an equal element exists in the heap.
   * @remarks Time O(N), Space O(1)
   * @param element - Element to search for.
   * @returns True if found.
   */

  override has(element: E): boolean {
    for (const el of this.elements) if (this._equals(el, element)) return true;
    return false;
  }

  /**
   * Delete one occurrence of an element.
   * @remarks Time O(N), Space O(1)
   * @param element - Element to delete.
   * @returns True if an element was removed.
   */

  delete(element: E): boolean {
    let index = -1;
    for (let i = 0; i < this.elements.length; i++) {
      if (this._equals(this.elements[i], element)) {
        index = i;
        break;
      }
    }
    if (index < 0) return false;
    if (index === 0) {
      this.poll();
    } else if (index === this.elements.length - 1) {
      this.elements.pop();
    } else {
      this.elements.splice(index, 1, this.elements.pop()!);
      this._bubbleUp(index);
      this._sinkDown(index, this.elements.length >> 1);
    }
    return true;
  }

  /**
   * Delete the first element that matches a predicate.
   * @remarks Time O(N), Space O(1)
   * @param predicate - Function (element, index, heap) → boolean.
   * @returns True if an element was removed.
   */

  deleteBy(predicate: (element: E, index: number, heap: this) => boolean): boolean {
    let idx = -1;
    for (let i = 0; i < this.elements.length; i++) {
      if (predicate(this.elements[i], i, this)) {
        idx = i;
        break;
      }
    }
    if (idx < 0) return false;
    if (idx === 0) {
      this.poll();
    } else if (idx === this.elements.length - 1) {
      this.elements.pop();
    } else {
      this.elements.splice(idx, 1, this.elements.pop()!);
      this._bubbleUp(idx);
      this._sinkDown(idx, this.elements.length >> 1);
    }
    return true;
  }

  /**
   * Set the equality comparator used by has/delete operations.
   * @remarks Time O(1), Space O(1)
   * @param equals - Equality predicate (a, b) → boolean.
   * @returns This heap.
   */

  setEquality(equals: (a: E, b: E) => boolean): this {
    this._equals = equals;
    return this;
  }

  /**
   * Traverse the binary heap as a complete binary tree and collect elements.
   * @remarks Time O(N), Space O(H)
   * @param [order] - Traversal order: 'PRE' | 'IN' | 'POST'.
   * @returns Array of visited elements.
   */

  dfs(order: DFSOrderPattern = 'PRE'): E[] {
    const result: E[] = [];
    const _dfs = (index: number) => {
      const left = 2 * index + 1,
        right = left + 1;
      if (index < this.size) {
        if (order === 'IN') {
          _dfs(left);
          result.push(this.elements[index]);
          _dfs(right);
        } else if (order === 'PRE') {
          result.push(this.elements[index]);
          _dfs(left);
          _dfs(right);
        } else if (order === 'POST') {
          _dfs(left);
          _dfs(right);
          result.push(this.elements[index]);
        }
      }
    };
    _dfs(0);
    return result;
  }

  /**
   * Restore heap order bottom-up (heapify in-place).
   * @remarks Time O(N), Space O(1)
   * @returns Array of per-node results from fixing steps.
   */

  fix(): boolean[] {
    const results: boolean[] = [];
    for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) {
      results.push(this._sinkDown(i, this.elements.length >> 1));
    }
    return results;
  }

  /**
   * Return all elements in ascending order by repeatedly polling.
   * @remarks Time O(N log N), Space O(N)
   * @returns Sorted array of elements.
   */

  sort(): E[] {
    const visited: E[] = [];
    const cloned = this._createInstance();
    for (const x of this.elements) cloned.add(x);
    while (!cloned.isEmpty()) {
      const top = cloned.poll();
      if (top !== undefined) visited.push(top);
    }
    return visited;
  }

  /**
   * Deep clone this heap.
   * @remarks Time O(N), Space O(N)
   * @returns A new heap with the same elements.
   */

  clone(): this {
    const next = this._createInstance();
    for (const x of this.elements) next.add(x);
    return next;
  }

  /**
   * Filter elements into a new heap of the same class.
   * @remarks Time O(N log N), Space O(N)
   * @param callback - Predicate (element, index, heap) → boolean to keep element.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new heap with the kept elements.
   */

  filter(callback: ElementCallback<E, R, boolean>, thisArg?: unknown): this {
    const out = this._createInstance();
    let i = 0;
    for (const x of this) {
      if (thisArg === undefined ? callback(x, i++, this) : callback.call(thisArg, x, i++, this)) {
        out.add(x);
      } else {
        i++;
      }
    }
    return out;
  }

  /**
   * Map elements into a new heap of possibly different element type.
   * @remarks Time O(N log N), Space O(N)
   * @template EM
   * @template RM
   * @param callback - Mapping function (element, index, heap) → newElement.
   * @param options - Options for the output heap, including comparator for EM.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new heap with mapped elements.
   */

  map<EM, RM>(
    callback: ElementCallback<E, R, EM>,
    options: HeapOptions<EM, RM> & { comparator: Comparator<EM> },
    thisArg?: unknown
  ): Heap<EM, RM> {
    const { comparator, toElementFn, ...rest } = options ?? {};
    if (!comparator) throw new TypeError('Heap.map requires options.comparator for EM');
    const out = this._createLike<EM, RM>([], { ...rest, comparator, toElementFn });
    let i = 0;
    for (const x of this) {
      const v = thisArg === undefined ? callback(x, i++, this) : callback.call(thisArg, x, i++, this);
      out.add(v);
    }
    return out;
  }

  /**
   * Map elements into a new heap of the same element type.
   * @remarks Time O(N log N), Space O(N)
   * @param callback - Mapping function (element, index, heap) → element.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new heap with mapped elements.
   */

  mapSame(callback: ElementCallback<E, R, E>, thisArg?: unknown): this {
    const out = this._createInstance();
    let i = 0;
    for (const x of this) {
      const v = thisArg === undefined ? callback(x, i++, this) : callback.call(thisArg, x, i++, this);
      out.add(v);
    }
    return out;
  }

  protected _DEFAULT_COMPARATOR = (a: E, b: E): number => {
    if (typeof a === 'object' || typeof b === 'object') {
      throw TypeError('When comparing object types, define a custom comparator in options.');
    }
    if ((a as unknown as number) > (b as unknown as number)) return 1;
    if ((a as unknown as number) < (b as unknown as number)) return -1;
    return 0;
  };

  protected _comparator: Comparator<E> = this._DEFAULT_COMPARATOR; /**
   * Get the comparator used to order elements.
   * @remarks Time O(1), Space O(1)
   * @returns Comparator function.
   */
  /**
   * Get the comparator used to order elements.
   * @remarks Time O(1), Space O(1)
   * @returns Comparator function.
   */

  get comparator() {
    return this._comparator;
  }

  protected *_getIterator(): IterableIterator<E> {
    for (const element of this.elements) yield element;
  }

  protected _bubbleUp(index: number): boolean {
    const element = this.elements[index];
    while (index > 0) {
      const parent = (index - 1) >> 1;
      const parentItem = this.elements[parent];
      if (this.comparator(parentItem, element) <= 0) break;
      this.elements[index] = parentItem;
      index = parent;
    }
    this.elements[index] = element;
    return true;
  }

  protected _sinkDown(index: number, halfLength: number): boolean {
    const element = this.elements[index];
    while (index < halfLength) {
      let left = (index << 1) | 1;
      const right = left + 1;
      let minItem = this.elements[left];
      if (right < this.elements.length && this.comparator(minItem, this.elements[right]) > 0) {
        left = right;
        minItem = this.elements[right];
      }
      if (this.comparator(minItem, element) >= 0) break;
      this.elements[index] = minItem;
      index = left;
    }
    this.elements[index] = element;
    return true;
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @param [options] - Options to override comparator or toElementFn.
   * @returns A like-kind empty heap instance.
   */

  protected _createInstance(options?: HeapOptions<E, R>): this {
    const Ctor: any = this.constructor;
    const next: any = new Ctor([], { comparator: this.comparator, toElementFn: this.toElementFn, ...(options ?? {}) });
    return next as this;
  }

  /**
   * (Protected) Create a like-kind instance seeded by elements.
   * @remarks Time O(N log N), Space O(N)
   * @template EM
   * @template RM
   * @param [elements] - Iterable of elements or raw values to seed.
   * @param [options] - Options forwarded to the constructor.
   * @returns A like-kind heap instance.
   */

  protected _createLike<EM, RM>(
    elements: Iterable<EM> | Iterable<RM> = [],
    options?: HeapOptions<EM, RM>
  ): Heap<EM, RM> {
    const Ctor: any = this.constructor;
    return new Ctor(elements, options) as Heap<EM, RM>;
  }

  /**
   * (Protected) Spawn an empty like-kind heap instance.
   * @remarks Time O(1), Space O(1)
   * @template EM
   * @template RM
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind heap instance.
   */

  protected _spawnLike<EM, RM>(options?: HeapOptions<EM, RM>): Heap<EM, RM> {
    return this._createLike<EM, RM>([], options);
  }
}

/**
 * Node container used by FibonacciHeap.
 * @remarks Time O(1), Space O(1)
 * @template E
 */
export class FibonacciHeapNode<E> {
  element: E;
  degree: number;
  left?: FibonacciHeapNode<E>;
  right?: FibonacciHeapNode<E>;
  child?: FibonacciHeapNode<E>;
  parent?: FibonacciHeapNode<E>;
  marked: boolean;

  constructor(element: E, degree = 0) {
    this.element = element;
    this.degree = degree;
    this.marked = false;
  }
}

/**
 * Fibonacci heap (min-heap) optimized for fast merges and amortized operations.
 * @remarks Time O(1), Space O(1)
 * @template E
 * @example examples will be generated by unit test
 */
export class FibonacciHeap<E> {
  /**
   * Create a FibonacciHeap.
   * @remarks Time O(1), Space O(1)
   * @param [comparator] - Comparator to order elements (min-heap by default).
   * @returns New FibonacciHeap instance.
   */

  constructor(comparator?: Comparator<E>) {
    this.clear();
    this._comparator = comparator || this._defaultComparator;
    if (typeof this.comparator !== 'function') throw new Error('FibonacciHeap: comparator must be a function.');
  }

  protected _root?: FibonacciHeapNode<E>;

  /**
   * Get the circular root list head.
   * @remarks Time O(1), Space O(1)
   * @returns Root node or undefined.
   */

  get root(): FibonacciHeapNode<E> | undefined {
    return this._root;
  }

  protected _size = 0;
  get size(): number {
    return this._size;
  }

  protected _min?: FibonacciHeapNode<E>;

  /**
   * Get the current minimum node.
   * @remarks Time O(1), Space O(1)
   * @returns Min node or undefined.
   */

  get min(): FibonacciHeapNode<E> | undefined {
    return this._min;
  }

  protected _comparator: Comparator<E>;
  get comparator(): Comparator<E> {
    return this._comparator;
  }

  clear(): void {
    this._root = undefined;
    this._min = undefined;
    this._size = 0;
  }

  add(element: E): boolean {
    this.push(element);
    return true;
  }

  /**
   * Push an element into the root list.
   * @remarks Time O(1) amortized, Space O(1)
   * @param element - Element to insert.
   * @returns This heap.
   */

  push(element: E): this {
    const node = this.createNode(element);
    node.left = node;
    node.right = node;
    this.mergeWithRoot(node);
    if (!this.min || this.comparator(node.element, this.min.element) <= 0) this._min = node;
    this._size++;
    return this;
  }

  peek(): E | undefined {
    return this.min ? this.min.element : undefined;
  }

  /**
   * Collect nodes from a circular doubly linked list starting at head.
   * @remarks Time O(K), Space O(K)
   * @param [head] - Start node of the circular list.
   * @returns Array of nodes from the list.
   */

  consumeLinkedList(head?: FibonacciHeapNode<E>): FibonacciHeapNode<E>[] {
    const elements: FibonacciHeapNode<E>[] = [];
    if (!head) return elements;
    let node: FibonacciHeapNode<E> | undefined = head;
    let started = false;
    while (true) {
      if (node === head && started) break;
      else if (node === head) started = true;
      elements.push(node!);
      node = node!.right;
    }
    return elements;
  }

  /**
   * Insert a node into a parent's child list (circular).
   * @remarks Time O(1), Space O(1)
   * @param parent - Parent node.
   * @param node - Child node to insert.
   * @returns void
   */

  mergeWithChild(parent: FibonacciHeapNode<E>, node: FibonacciHeapNode<E>): void {
    if (!parent.child) parent.child = node;
    else {
      node.right = parent.child.right;
      node.left = parent.child;
      parent.child.right!.left = node;
      parent.child.right = node;
    }
  }

  poll(): E | undefined {
    return this.pop();
  }

  /**
   * Remove and return the minimum element, consolidating the root list.
   * @remarks Time O(log N) amortized, Space O(1)
   * @returns Minimum element or undefined.
   */

  pop(): E | undefined {
    if (this._size === 0) return undefined;
    const z = this.min!;
    if (z.child) {
      const elements = this.consumeLinkedList(z.child);
      for (const node of elements) {
        this.mergeWithRoot(node);
        node.parent = undefined;
      }
    }
    this.removeFromRoot(z);
    if (z === z.right) {
      this._min = undefined;
      this._root = undefined;
    } else {
      this._min = z.right;
      this._consolidate();
    }
    this._size--;
    return z.element;
  }

  /**
   * Meld another heap into this heap.
   * @remarks Time O(1), Space O(1)
   * @param heapToMerge - Another FibonacciHeap to meld into this one.
   * @returns void
   */

  merge(heapToMerge: FibonacciHeap<E>): void {
    if (heapToMerge.size === 0) return;
    if (this.root && heapToMerge.root) {
      const thisRoot = this.root,
        otherRoot = heapToMerge.root;
      const thisRootRight = thisRoot.right!,
        otherRootLeft = otherRoot.left!;
      thisRoot.right = otherRoot;
      otherRoot.left = thisRoot;
      thisRootRight.left = otherRootLeft;
      otherRootLeft.right = thisRootRight;
    } else if (!this.root && heapToMerge.root) {
      this._root = heapToMerge.root;
    }
    if (!this.min || (heapToMerge.min && this.comparator(heapToMerge.min.element, this.min.element) < 0)) {
      this._min = heapToMerge.min;
    }
    this._size += heapToMerge.size;
    heapToMerge.clear();
  }

  createNode(element: E): FibonacciHeapNode<E> {
    return new FibonacciHeapNode<E>(element);
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  protected _defaultComparator(a: E, b: E): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  protected mergeWithRoot(node: FibonacciHeapNode<E>): void {
    if (!this.root) this._root = node;
    else {
      node.right = this.root.right;
      node.left = this.root;
      this.root.right!.left = node;
      this.root.right = node;
    }
  }

  protected removeFromRoot(node: FibonacciHeapNode<E>): void {
    if (this.root === node) this._root = node.right;
    if (node.left) node.left.right = node.right;
    if (node.right) node.right.left = node.left;
  }

  protected _link(y: FibonacciHeapNode<E>, x: FibonacciHeapNode<E>): void {
    this.removeFromRoot(y);
    y.left = y;
    y.right = y;
    this.mergeWithChild(x, y);
    x.degree++;
    y.parent = x;
  }

  protected _consolidate(): void {
    const A: (FibonacciHeapNode<E> | undefined)[] = new Array(this._size);
    const elements = this.consumeLinkedList(this.root);
    let x: FibonacciHeapNode<E> | undefined,
      y: FibonacciHeapNode<E> | undefined,
      d: number,
      t: FibonacciHeapNode<E> | undefined;

    for (const node of elements) {
      x = node;
      d = x.degree;
      while (A[d]) {
        y = A[d] as FibonacciHeapNode<E>;
        if (this.comparator(x.element, y.element) > 0) {
          t = x;
          x = y;
          y = t;
        }
        this._link(y, x);
        A[d] = undefined;
        d++;
      }
      A[d] = x;
    }

    for (let i = 0; i < A.length; i++) {
      if (A[i] && (!this.min || this.comparator(A[i]!.element, this.min.element) <= 0)) this._min = A[i]!;
    }
  }
}
