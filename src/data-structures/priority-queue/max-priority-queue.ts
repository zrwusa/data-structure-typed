/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { PriorityQueueOptions } from '../../types';
import { PriorityQueue } from './priority-queue';

export class MaxPriorityQueue<E = any> extends PriorityQueue<E> {
  constructor(
    elements: Iterable<E> = [],
    options: PriorityQueueOptions<E> = {
      comparator: (a: E, b: E) => {
        if (!(typeof a === 'number' && typeof b === 'number')) {
          throw new Error('The a, b params of compare function must be number');
        } else {
          return b - a;
        }
      }
    }
  ) {
    super(elements, options);
  }
}
