/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { PriorityQueueOptions } from '../../types';
import { PriorityQueue } from './priority-queue';

export class MaxPriorityQueue<E = any, R = any> extends PriorityQueue<E> {
  /**
   * The constructor initializes a PriorityQueue with optional elements and options, including a
   * comparator function.
   * @param elements - The `elements` parameter is an iterable object that contains the initial
   * elements to be added to the priority queue. It is optional and defaults to an empty array if not
   * provided.
   * @param options - The `options` parameter is an object that contains additional configuration
   * options for the priority queue. In this case, it has a property called `comparator,` which is a
   * function used to compare elements in the priority queue.
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
