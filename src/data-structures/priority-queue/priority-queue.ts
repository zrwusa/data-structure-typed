/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import {Heap} from '../heap';
import {Comparator} from '../../types';

export class PriorityQueue<E = any> extends Heap<E> {
  constructor(options: {comparator: Comparator<E>; nodes?: E[]}) {
    super(options);
  }
}
