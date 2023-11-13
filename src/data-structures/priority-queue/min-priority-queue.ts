/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import {PriorityQueue} from './priority-queue';
import type {Comparator} from '../../types';

export class MinPriorityQueue<E = any> extends PriorityQueue<E> {
  constructor(
    options: {comparator: Comparator<E>; nodes?: E[]} = {
      comparator: (a: E, b: E) => {
        if (!(typeof a === 'number' && typeof b === 'number')) {
          throw new Error('The a, b params of compare function must be number');
        } else {
          return a - b;
        }
      }
    }
  ) {
    super(options);
  }
}
