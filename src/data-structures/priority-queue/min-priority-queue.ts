/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import { PriorityQueue } from './priority-queue';
import type { PriorityQueueOptions } from '../../types';

export class MinPriorityQueue<E = any> extends PriorityQueue<E> {
  constructor(elements?: Iterable<E>,
              options: PriorityQueueOptions<E> = {
                comparator: (a: E, b: E) => {
                  if (!(typeof a === 'number' && typeof b === 'number')) {
                    throw new Error('The a, b params of compare function must be number');
                  } else {
                    return a - b;
                  }
                }
              }
  ) {
    super(elements, options);
  }
}
