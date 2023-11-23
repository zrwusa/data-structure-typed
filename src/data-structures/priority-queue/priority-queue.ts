/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import { Heap } from '../heap';
import { PriorityQueueOptions } from '../../types';

export class PriorityQueue<E = any> extends Heap<E> {
  constructor(elements?: Iterable<E>, options?: PriorityQueueOptions<E>) {
    super(elements, options);
  }
}
