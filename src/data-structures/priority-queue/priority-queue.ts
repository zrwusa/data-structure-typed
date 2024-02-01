/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { Comparator, ElementCallback, PriorityQueueOptions } from '../../types';
import { Heap } from '../heap';

/**
 * 1. Element Priority: In a PriorityQueue, elements are sorted according to their priority. Each dequeue (element removal) operation removes the element with the highest priority. The priority can be determined based on the natural ordering of the elements or through a provided comparator (Comparator).
 * 2. Heap-Based Implementation: PriorityQueue is typically implemented using a binary heap, allowing both insertion and removal operations to be completed in O(log n) time, where n is the number of elements in the queue.
 * 3. Task Scheduling: In systems where tasks need to be processed based on the urgency of tasks rather than the order of arrival.
 * 4. Dijkstra's Algorithm: In shortest path algorithms for graphs, used to select the next shortest edge to visit.
 * 5. Huffman Coding: Used to select the smallest node combination when constructing a Huffman tree.
 * 6. Kth Largest Element in a Data Stream: Used to maintain a min-heap of size K for quickly finding the Kth largest element in stream data
 */
export class PriorityQueue<E = any, R = any> extends Heap<E, R> {
  /**
   * The constructor initializes a priority queue with optional elements and options.
   * @param elements - The `elements` parameter is an iterable object that contains the initial
   * elements to be added to the priority queue. It is an optional parameter, and if not provided, the
   * priority queue will be initialized as empty.
   * @param [options] - The `options` parameter is an optional object that can be used to customize the
   * behavior of the priority queue. It can contain the following properties:
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
    super(elements, options);
  }

  /**
   * The `clone` function returns a new instance of the `PriorityQueue` class with the same comparator
   * and toElementFn as the original instance.
   * @returns The method is returning a new instance of the `PriorityQueue` class with the same
   * elements and properties as the current instance.
   */
  override clone(): PriorityQueue<E, R> {
    return new PriorityQueue<E, R>(this, { comparator: this.comparator, toElementFn: this.toElementFn });
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new PriorityQueue object containing elements that pass a given callback
   * function.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: the current element, the index of the current element, and the
   * heap itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `PriorityQueue` object that contains the elements that pass
   * the filter condition specified by the `callback` function.
   */
  override filter(callback: ElementCallback<E, R, boolean, PriorityQueue<E, R>>, thisArg?: any): PriorityQueue<E, R> {
    const filteredPriorityQueue = new PriorityQueue<E, R>([], {
      toElementFn: this.toElementFn,
      comparator: this.comparator
    });
    let index = 0;
    for (const current of this) {
      if (callback.call(thisArg, current, index, this)) {
        filteredPriorityQueue.add(current);
      }
      index++;
    }
    return filteredPriorityQueue;
  }

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new heap by applying a callback function to each element of the
   * original heap.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: `el` (the current element), `index` (the index of the current
   * element), and `this` (the heap itself). The callback function should return a value of
   * @param comparator - The `comparator` parameter is a function that defines the order of the
   * elements in the heap. It takes two elements `a` and `b` as arguments and returns a negative number
   * if `a` should be placed before `b`, a positive number if `a` should be placed after
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that converts the raw
   * element `RR` to the desired type `T`. It takes a single argument `rawElement` of type `RR` and
   * returns a value of type `T`. This function is used to transform the elements of the original
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new instance of the `PriorityQueue` class with the mapped elements.
   */
  override map<EM, RM>(
    callback: ElementCallback<E, R, EM, PriorityQueue<E, R>>,
    comparator: Comparator<EM>,
    toElementFn?: (rawElement: RM) => EM,
    thisArg?: any
  ): PriorityQueue<EM, RM> {
    const mappedPriorityQueue: PriorityQueue<EM, RM> = new PriorityQueue<EM, RM>([], { comparator, toElementFn });
    let index = 0;
    for (const el of this) {
      mappedPriorityQueue.add(callback.call(thisArg, el, index, this));
      index++;
    }
    return mappedPriorityQueue;
  }
}
