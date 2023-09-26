/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import {Heap, HeapItem} from './heap';
import {PriorityQueue} from '../priority-queue';
import type {HeapOptions} from '../../types';

/**
 * @class MaxHeap
 * @extends Heap
 */
export class MaxHeap<V = any> extends Heap<V> {
  protected _pq: PriorityQueue<HeapItem<V>>;

  /**
   * The constructor initializes a PriorityQueue with a custom comparator function.
   * @param [options] - The `options` parameter is an optional object that can be passed to the constructor. It is of
   * type `HeapOptions<V>`, which is a generic type that represents the options for the heap.
   */
  constructor(options?: HeapOptions<V>) {
    super(options);
    this._pq = new PriorityQueue<HeapItem<V>>({
      comparator: (a, b) => b.priority - a.priority
    });
  }
}
