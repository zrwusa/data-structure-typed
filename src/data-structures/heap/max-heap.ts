/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { Comparator, ElementCallback, HeapOptions } from '../../types';
import { Heap } from './heap';

/**
 * 1. Complete Binary Tree: Heaps are typically complete binary trees, meaning every level is fully filled except possibly for the last level, which has nodes as far left as possible.
 * 2. Heap Properties: The value of each parent node is greater than or equal to the value of its children.
 * 3. Root Node Access: In a heap, the largest element (in a max heap) or the smallest element (in a min heap) is always at the root of the tree.
 * 4. Efficient Insertion and Deletion: Due to its structure, a heap allows for insertion and deletion operations in logarithmic time (O(log n)).
 * 5. Managing Dynamic Data Sets: Heaps effectively manage dynamic data sets, especially when frequent access to the largest or smallest elements is required.
 * 6. Non-linear Search: While a heap allows rapid access to its largest or smallest element, it is less efficient for other operations, such as searching for a specific element, as it is not designed for these tasks.
 * 7. Efficient Sorting Algorithms: For example, heap sort. Heap sort uses the properties of a heap to sort elements.
 * 8. Graph Algorithms: Such as Dijkstra's shortest path algorithm and Prim's minimum-spanning tree algorithm, which use heaps to improve performance.
 */
export class MaxHeap<E = any, R = any> extends Heap<E, R> {
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: HeapOptions<E, R>) {
    super(elements, {
      comparator: (a: E, b: E): number => {
        if (typeof a === 'object' || typeof b === 'object') {
          throw TypeError(
            `When comparing object types, a custom comparator must be defined in the constructor's options parameter.`
          );
        }
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      },
      ...options
    });
  }

  /**
   * The `clone` function returns a new instance of the `MaxHeap` class with the same properties as the
   * current instance.
   * @returns The `clone()` method is returning a new instance of the `MaxHeap` class with the same
   * properties as the current instance.
   */
  override clone(): MaxHeap<E, R> {
    return new MaxHeap<E, R>(this, { comparator: this.comparator, toElementFn: this.toElementFn });
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new MaxHeap object containing elements that pass a given callback
   * function.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: the current element, the index of the current element, and the
   * heap itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `MaxHeap` object that contains the elements that pass
   * the filter condition specified by the `callback` function.
   */
  override filter(callback: ElementCallback<E, R, boolean, MaxHeap<E, R>>, thisArg?: any): MaxHeap<E, R> {
    const filteredList = new MaxHeap<E, R>([], { toElementFn: this.toElementFn, comparator: this.comparator });
    let index = 0;
    for (const current of this) {
      if (callback.call(thisArg, current, index, this)) {
        filteredList.add(current);
      }
      index++;
    }
    return filteredList;
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
   * @returns a new instance of the `MaxHeap` class with the mapped elements.
   */
  override map<EM, RM>(
    callback: ElementCallback<E, R, EM, MaxHeap<E, R>>,
    comparator: Comparator<EM>,
    toElementFn?: (rawElement: RM) => EM,
    thisArg?: any
  ): MaxHeap<EM, RM> {
    const mappedHeap: MaxHeap<EM, RM> = new MaxHeap<EM, RM>([], { comparator, toElementFn });
    let index = 0;
    for (const el of this) {
      mappedHeap.add(callback.call(thisArg, el, index, this));
      index++;
    }
    return mappedHeap;
  }
}
