/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { PriorityQueueOptions } from '../../types';
import { PriorityQueue } from './priority-queue';

/**
 * Max-oriented priority queue (max-heap) built on {@link PriorityQueue}.
 * The default comparator orders primitive values in descending order. If you store objects,
 * you must provide a custom comparator via {@link PriorityQueueOptions}.
 * @template E Element type stored in the queue.
 * @template R Extra record/metadata associated with each element.
 * @example
 */
export class MaxPriorityQueue<E = any, R = any> extends PriorityQueue<E, R> {
  /**
   * Creates a max-priority queue.
   * @param elements Optional initial elements to insert.
   * @param options Optional configuration (e.g., `comparator`, `toElementFn`).
   * @throws {TypeError} Thrown when using the default comparator with object elements (provide a custom comparator).
   * @remarks Complexity — Time: O(n log n) when inserting n elements incrementally; Space: O(n).
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
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
}
