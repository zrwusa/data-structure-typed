/**
 * @copyright 2020 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */

import {Heap} from './heap';
import {PriorityQueue} from '../priority-queue';
import type {HeapItem, HeapOptions} from '../types';

/**
 * @class MaxHeap
 * @extends Heap
 */
export class MaxHeap<T> extends Heap<T> {
    protected _pq: PriorityQueue<HeapItem<T>>;

    constructor(options?: HeapOptions<T>) {
        super(options);
        this._pq = new PriorityQueue<HeapItem<T>>({
            comparator: (a, b) => b.priority - a.priority
        });
    }
}
