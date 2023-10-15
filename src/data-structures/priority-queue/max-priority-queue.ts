/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import {PriorityQueue} from './priority-queue';
import type {CompareFunction} from '../../types';

export class MaxPriorityQueue<T = any> extends PriorityQueue<T> {
  constructor(
    compare: CompareFunction<T> = (a: T, b: T) => {
      if (!(typeof a === 'number' && typeof b === 'number')) {
        throw new Error('The a, b params of compare function must be number');
      } else {
        return b - a;
      }
    }
  ) {
    super(compare);
  }
}
