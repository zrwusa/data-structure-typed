/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import type { PriorityQueueOptions } from '../../types';
import { Heap } from '../heap';

/**
 * @example
 */
export class PriorityQueue<E = any, R = any> extends Heap<E, R> {
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
    super(elements, options);
  }
}
