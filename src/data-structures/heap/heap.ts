/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {PriorityQueue} from '../priority-queue';
import type {HeapOptions} from '../types';

export class HeapItem<T = number> {

    constructor(priority: number = NaN, val: T | null = null) {
        this._val = val;
        this._priority = priority;
    }

    private _priority: number;

    get priority(): number {
        return this._priority;
    }

    set priority(value: number) {
        this._priority = value;
    }

    private _val: T | null;

    get val(): T | null {
        return this._val;
    }

    set val(value: T | null) {
        this._val = value;
    }
}

export abstract class Heap<T = number> {
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

    protected abstract _pq: PriorityQueue<HeapItem<T>>;

    get pq() {
        return this._pq;
    }

    protected set pq(v: PriorityQueue<HeapItem<T>>) {
        this._pq = v;
    }

    protected _priorityCb: (val: T) => number;
    get priorityCb() {
        return this._priorityCb;
    }

    protected set priorityCb(v: (val: T) => number) {
        this._priorityCb = v;
    }

    /**
     * The function returns the size of a priority queue.
     * @returns The size of the priority queue.
     */
    get size(): number {
        return this._pq.size;
    }

    /**
     * Starting from TypeScript version 5.0 and onwards, the use of distinct access modifiers for Getters and Setters is not permitted. As an alternative, to ensure compatibility, it is necessary to adopt a Java-style approach for Setters (using the same name as the property) while utilizing separate method names for Getters.
     */
    getPq() {
        return this._pq;
    }

    /**
     * Starting from TypeScript version 5.0 and onwards, the use of distinct access modifiers for Getters and Setters is not permitted. As an alternative, to ensure compatibility, it is necessary to adopt a Java-style approach for Setters (using the same name as the property) while utilizing separate method names for Getters.
     */
    getPriorityCb() {
        return this._priorityCb;
    }

    /**
     * Starting from TypeScript version 5.0 and onwards, the use of distinct access modifiers for Getters and Setters is not permitted. As an alternative, to ensure compatibility, it is necessary to adopt a Java-style approach for Setters (using the same name as the property) while utilizing separate method names for Getters.
     */
    getSize(): number {
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
     * @returns The `peek()` method is returning either a `HeapItem<T>` object or `null`.Returns an val with the highest priority in the queue
     */
    peek(): HeapItem<T> | null {
        return this._pq.peek();
    }

    /**
     * The `peekLast` function returns the last item in the heap.
     * @returns The method `peekLast()` returns either a `HeapItem<T>` object or `null`.Returns an val with the lowest priority in the queue
     */
    peekLast(): HeapItem<T> | null {
        return this._pq.leaf();
    }

    /**
     * The `add` function adds an val to a priority queue with an optional priority value.
     * @param {T} val - The `val` parameter represents the value that you want to add to the heap. It can be of any
     * type.
     * @param {number} [priority] - The `priority` parameter is an optional number that represents the priority of the
     * val being added to the heap. If the `val` parameter is a number, then the `priority` parameter is set to
     * the value of `val`. If the `val` parameter is not a number, then the
     * @returns The `add` method returns the instance of the `Heap` class.
     * @throws {Error} if priority is not a valid number
     */
    add(val: T, priority?: number): Heap<T> {
        if (typeof val === 'number') {
            priority = val;
        } else {
            if (priority === undefined) {
                throw new Error('.add expects a numeric priority');
            }
        }

        if (priority && Number.isNaN(+priority)) {
            throw new Error('.add expects a numeric priority');
        }

        if (Number.isNaN(+priority) && Number.isNaN(this._priorityCb(val))) {
            throw new Error(
                '.add expects a numeric priority '
                + 'or a constructor callback that returns a number'
            );
        }

        const _priority = !Number.isNaN(+priority) ? priority : this._priorityCb(val);
        this._pq.add(new HeapItem<T>(_priority, val));
        return this;
    }

    /**
     * The `poll` function returns the top item from a priority queue or null if the queue is empty.Removes and returns an val with the highest priority in the queue
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
     * The function checks if a given node or value exists in the priority queue.
     * @param {T | HeapItem<T>} node - The parameter `node` can be of type `T` or `HeapItem<T>`.
     * @returns a boolean value.
     */
    has(node: T | HeapItem<T>): boolean {
        if (node instanceof HeapItem<T>) {
            return this.getPq().getNodes().includes(node);
        } else {
            return this.getPq().getNodes().findIndex(item => {
                return item.val === node;
            }) !== -1;
        }
    }

    /**
     * The `toArray` function returns an array of `HeapItem<T>` objects.
     * @returns An array of HeapItem<T> objects.Returns a sorted list of vals
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
