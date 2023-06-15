/**
 * @copyright 2020 Pablo Rios <zrwusa@gmail.com>
 * @license MIT
 */

import {Heap, HeapItem, HeapOptions} from './heap';
import {PriorityQueue} from '../priority-queue';

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


