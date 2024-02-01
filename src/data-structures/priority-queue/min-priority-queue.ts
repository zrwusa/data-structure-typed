/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { Comparator, ElementCallback, PriorityQueueOptions } from '../../types';
import { PriorityQueue } from './priority-queue';

export class MinPriorityQueue<E = any, R = any> extends PriorityQueue<E, R> {
  /**
   * The constructor initializes a PriorityQueue with optional elements and options, including a
   * comparator function.
   * @param elements - The `elements` parameter is an iterable object that contains the initial
   * elements to be added to the priority queue. It is optional and defaults to an empty array if not
   * provided.
   * @param options - The `options` parameter is an object that contains additional configuration
   * options for the priority queue. In this case, it has a property called `comparator,` which is a
   * function used to compare elements in the priority queue. The `comparator` function takes two
   * parameters `a` and `b`
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
    super(elements, options);
  }

  /**
   * The `clone` function returns a new instance of the `MinPriorityQueue` class with the same
   * comparator and toElementFn as the original instance.
   * @returns The method is returning a new instance of the `MinPriorityQueue` class with the same
   * properties as the current instance.
   */
  override clone(): MinPriorityQueue<E, R> {
    return new MinPriorityQueue<E, R>(this, { comparator: this.comparator, toElementFn: this.toElementFn });
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new MinPriorityQueue object containing elements that pass a given callback
   * function.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: the current element, the index of the current element, and the
   * heap itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `MinPriorityQueue` object that contains the elements that pass
   * the filter condition specified by the `callback` function.
   */
  override filter(
    callback: ElementCallback<E, R, boolean, MinPriorityQueue<E, R>>,
    thisArg?: any
  ): MinPriorityQueue<E, R> {
    const filteredPriorityQueue = new MinPriorityQueue<E, R>([], {
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
   * @returns a new instance of the `MinPriorityQueue` class with the mapped elements.
   */
  override map<EM, RM>(
    callback: ElementCallback<E, R, EM, MinPriorityQueue<E, R>>,
    comparator: Comparator<EM>,
    toElementFn?: (rawElement: RM) => EM,
    thisArg?: any
  ): MinPriorityQueue<EM, RM> {
    const mappedPriorityQueue: MinPriorityQueue<EM, RM> = new MinPriorityQueue<EM, RM>([], { comparator, toElementFn });
    let index = 0;
    for (const el of this) {
      mappedPriorityQueue.add(callback.call(thisArg, el, index, this));
      index++;
    }
    return mappedPriorityQueue;
  }
}
