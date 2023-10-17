/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import {PriorityQueue} from './priority-queue';
import type {HeapComparator} from '../../types';

export class MinPriorityQueue<E = any> extends PriorityQueue<E> {
  constructor(
    compare: HeapComparator<E> = (a: E, b: E) => {
      if (!(typeof a === 'number' && typeof b === 'number')) {
        throw new Error('The a, b params of compare function must be number');
      } else {
        return a - b;
      }
    }
  ) {
    super(compare);
  }
}
