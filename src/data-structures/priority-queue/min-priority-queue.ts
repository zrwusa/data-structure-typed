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
 * Min-oriented priority queue (min-heap) built on {@link PriorityQueue}.
 * The queue removes the smallest element first under the provided comparator.
 * Provide a custom comparator if you store non-primitive objects.
 * @template E Element type stored in the queue.
 * @template R Extra record/metadata associated with each element.
 * @example
 */
export class MinPriorityQueue<E = any, R = any> extends PriorityQueue<E, R> {
  /**
   * Creates a min-priority queue.
   * @param elements Optional initial elements to insert.
   * @param options Optional configuration (e.g., `comparator`, `toElementFn`).
   * @remarks Complexity — Time: O(n log n) when inserting n elements incrementally; Space: O(n).
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
    super(elements, options);
  }
}
