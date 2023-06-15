import {PriorityQueue} from '../priority-queue';

export interface HeapOptions<T> {
    priority?: (element: T) => number;
}

export interface HeapItem<T> {
    priority: number;
    element: T | null;
}


/**
 * @copyright 2021 Pablo Rios <zrwusa@gmail.com>
 * @license MIT
 *
 * @abstract
 * @class Heap
 */
export abstract class Heap<T> {
    protected abstract _pq: PriorityQueue<HeapItem<T>>;
    protected _priorityCb: (element: T) => number;

    /**
     * Creates a priority queue
     * @public
     * @params {object} [options]
     */
    protected constructor(options?: HeapOptions<T>) {
        if (options) {
            const {priority} = options;
            if (priority !== undefined && typeof priority !== 'function') {
                throw new Error('.constructor expects a valid priority function');
            }
            this._priorityCb = priority || ((el) => +el);
        } else {
            this._priorityCb = (el) => +el;
        }
    }

    /**
     * @public
     * @returns {number}
     */
    get size(): number {
        return this._pq.size;
    }

    /**
     * @public
     * @returns {boolean}
     */
    isEmpty(): boolean {
        return this._pq.size < 1;
    }

    /**
     * Returns an element with highest priority in the queue
     * @public
     * @returns {object}
     */
    peek(): HeapItem<T> | null {
        return this._pq.peek();
    }

    /**
     * Returns an element with lowest priority in the queue
     * @public
     * @returns {object}
     */
    peekLast(): HeapItem<T> | null {
        return this._pq.leaf();
    }

    /**
     * Adds an element to the queue
     * @public
     * @param {any} element
     * @param priority
     * @throws {Error} if priority is not a valid number
     */
    offer(element: T, priority?: number): Heap<T> {
        if (typeof element === 'number') {
            priority = element;
        } else {
            if (priority === undefined) {
                throw new Error('.offer expects a numeric priority');
            }
        }

        if (priority && Number.isNaN(+priority)) {
            throw new Error('.offer expects a numeric priority');
        }

        if (Number.isNaN(+priority) && Number.isNaN(this._priorityCb(element))) {
            throw new Error(
                '.offer expects a numeric priority '
                + 'or a constructor callback that returns a number'
            );
        }

        const _priority = !Number.isNaN(+priority) ? priority : this._priorityCb(element);
        this._pq.offer({priority: _priority, element});
        return this;
    }

    /**
     * Removes and returns an element with highest priority in the queue
     * @public
     * @returns {object}
     */
    poll(): HeapItem<T> | null {
        const top = this._pq.poll();
        if (!top) {
            return null;
        }
        return top;
    }

    /**
     * Returns a sorted list of elements
     * @public
     * @returns {array}
     */
    toArray(): HeapItem<T>[] {
        return this._pq.toArray();
    }

    /**
     * Clears the queue
     * @public
     */
    clear(): void {
        this._pq.clear();
    }
}
