/**
 * @copyright 2020 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */

import {Heap} from './heap';
import {PriorityQueue} from '../priority-queue';
import type {HeapItem, HeapOptions} from '../types';

/**
 * @class MinHeap
 * @extends Heap
 */
export class MinHeap<T> extends Heap<T> {
    protected _pq: PriorityQueue<HeapItem<T>>;

    constructor(options?: HeapOptions<T>) {
        super(options);
        this._pq = new PriorityQueue<HeapItem<T>>({
            comparator: (a, b) => a.priority - b.priority
        });
    }
}


