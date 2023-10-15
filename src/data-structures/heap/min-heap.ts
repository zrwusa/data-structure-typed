/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import {Heap} from './heap';
import type {CompareFunction} from '../../types';

export class MinHeap<T = any> extends Heap<T> {
  constructor(
    comparator: CompareFunction<T> = (a: T, b: T) => {
      if (!(typeof a === 'number' && typeof b === 'number')) {
        throw new Error('The a, b params of compare function must be number');
      } else {
        return a - b;
      }
    }
  ) {
    super(comparator);
  }
}
