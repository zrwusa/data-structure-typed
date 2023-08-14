/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
import {PriorityQueue} from '../priority-queue';
import type {HeapItem, HeapOptions} from '../types';

export abstract class Heap<T> {
    protected abstract _pq: PriorityQueue<HeapItem<T>>;
    protected _priorityCb: (element: T) => number;

    /**
     * The function is a constructor for a class that initializes a priority callback function based on the
     * options provided.
     * @param [options] - An optional object that contains configuration options for the Heap.
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
     * The function returns the size of a priority queue.
     * @returns The size of the priority queue.
     */
    get size(): number {
        return this._pq.size;
    }

    /**
     * The function checks if a priority queue is empty.
     * @returns {boolean} A boolean value indicating whether the size of the priority queue is less than 1.
     */
    isEmpty(): boolean {
        return this._pq.size < 1;
    }

    /**
     * The `peek` function returns the top item in the priority queue without removing it.
     * @returns The `peek()` method is returning either a `HeapItem<T>` object or `null`.Returns an element with the highest priority in the queue
     */
    peek(): HeapItem<T> | null {
        return this._pq.peek();
    }

    /**
     * The `peekLast` function returns the last item in the heap.
     * @returns The method `peekLast()` returns either a `HeapItem<T>` object or `null`.Returns an element with the lowest priority in the queue
     */
    peekLast(): HeapItem<T> | null {
        return this._pq.leaf();
    }

    /**
     * The `add` function adds an element to a priority queue with an optional priority value.
     * @param {T} element - The `element` parameter represents the value that you want to add to the heap. It can be of any
     * type.
     * @param {number} [priority] - The `priority` parameter is an optional number that represents the priority of the
     * element being added to the heap. If the `element` parameter is a number, then the `priority` parameter is set to
     * the value of `element`. If the `element` parameter is not a number, then the
     * @returns The `add` method returns the instance of the `Heap` class.
     * @throws {Error} if priority is not a valid number
     */
    add(element: T, priority?: number): Heap<T> {
        if (typeof element === 'number') {
            priority = element;
        } else {
            if (priority === undefined) {
                throw new Error('.add expects a numeric priority');
            }
        }

        if (priority && Number.isNaN(+priority)) {
            throw new Error('.add expects a numeric priority');
        }

        if (Number.isNaN(+priority) && Number.isNaN(this._priorityCb(element))) {
            throw new Error(
                '.add expects a numeric priority '
                + 'or a constructor callback that returns a number'
            );
        }

        const _priority = !Number.isNaN(+priority) ? priority : this._priorityCb(element);
        this._pq.add({priority: _priority, element});
        return this;
    }

    /**
     * The `poll` function returns the top item from a priority queue or null if the queue is empty.Removes and returns an element with the highest priority in the queue
     * @returns either a HeapItem<T> object or null.
     */
    poll(): HeapItem<T> | null {
        const top = this._pq.poll();
        if (!top) {
            return null;
        }
        return top;
    }

    /**
     * The `toArray` function returns an array of `HeapItem<T>` objects.
     * @returns An array of HeapItem<T> objects.Returns a sorted list of elements
     */
    toArray(): HeapItem<T>[] {
        return this._pq.toArray();
    }

    /**
     * The clear function clears the priority queue.
     */
    clear(): void {
        this._pq.clear();
    }
}
