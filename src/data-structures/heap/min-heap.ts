/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
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

    /**
     * The constructor initializes a PriorityQueue with a comparator function that compares the priority of two HeapItem
     * objects.
     * @param [options] - The `options` parameter is an optional object that can be passed to the constructor. It is of
     * type `HeapOptions<T>`, which is a generic type that represents the options for the heap.
     */
    constructor(options?: HeapOptions<T>) {
        super(options);
        this._pq = new PriorityQueue<HeapItem<T>>({
            comparator: (a, b) => a.priority - b.priority
        });
    }
}


