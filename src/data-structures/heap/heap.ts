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

    /**
     * The constructor function initializes an instance of a class with a priority and a value.
     * @param {number} priority - The `priority` parameter is a number that represents the priority of the value. It is
     * optional and has a default value of `NaN`.
     * @param {T | null} [val=null] - The `val` parameter is of type `T | null`, which means it can accept a value of type
     * `T` or `null`.
     */
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
            const {priorityExtractor} = options;
            if (priorityExtractor !== undefined && typeof priorityExtractor !== 'function') {
                throw new Error('.constructor expects a valid priority function');
            }
            this._priorityExtractor = priorityExtractor || ((el) => +el);
        } else {
            this._priorityExtractor = (el) => +el;
        }
    }

    protected abstract _pq: PriorityQueue<HeapItem<T>>;

    get pq() {
        return this._pq;
    }

    protected _priorityExtractor: (val: T) => number;
    get priorityExtractor() {
        return this._priorityExtractor;
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

    peek(isItem?: undefined): T | undefined;
    peek(isItem: false): T | undefined;
    peek(isItem: true): HeapItem<T> | null;
    /**
     * The `peek` function returns the top item in the priority queue without removing it.
     * @returns The `peek()` method is returning either a `HeapItem<T>` object or `null`.Returns an val with the highest priority in the queue
     */
    peek(isItem?: boolean): HeapItem<T> | null | T | undefined {
        isItem = isItem ?? false;
        const peeked = this._pq.peek();
        return isItem ? peeked : peeked?.val;
    }

    peekLast(isItem?: undefined): T | undefined;
    peekLast(isItem: false): T | undefined;
    peekLast(isItem: true): HeapItem<T> | null;
    /**
     * The `peekLast` function returns the last item in the heap.
     * @returns The method `peekLast()` returns either a `HeapItem<T>` object or `null`.Returns an val with the lowest priority in the queue
     */
    peekLast(isItem?: boolean): HeapItem<T> | null | T | undefined {
        isItem = isItem ?? false;
        const leafItem = this._pq.leaf();
        return isItem ? leafItem : leafItem?.val;
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
    add(priority: number, val?: T,): Heap<T> {
        val = (val === undefined) ? priority as T : val;
        this._pq.add(new HeapItem<T>(priority, val));
        return this;
    }

    poll(isItem?: undefined): T | undefined;
    poll(isItem: false): T | undefined;
    poll(isItem: true): HeapItem<T> | null;
    /**
     * The `poll` function returns the top item from a priority queue or null if the queue is empty.Removes and returns an val with the highest priority in the queue
     * @returns either a HeapItem<T> object or null.
     */
    poll(isItem?: boolean): HeapItem<T> | null | T | undefined {
        isItem = isItem ?? false;
        const top = this._pq.poll();
        if (!top) {
            return null;
        }
        return isItem ? top : top.val;
    }

    /**
     * The function checks if a given node or value exists in the priority queue.
     * @param {T | HeapItem<T>} node - The parameter `node` can be of type `T` or `HeapItem<T>`.
     * @returns a boolean value.
     */
    has(node: T | HeapItem<T>): boolean {
        if (node instanceof HeapItem) {
            return this.pq.getNodes().includes(node);
        } else {
            return this.pq.getNodes().findIndex(item => {
                return item.val === node;
            }) !== -1;
        }
    }

    toArray(isItem?: undefined): (T | undefined)[];
    toArray(isItem: false): (T | undefined)[];
    toArray(isItem: true): (HeapItem<T> | null)[];
    /**
     * The `toArray` function returns an array of `HeapItem<T>` objects.
     * @returns An array of HeapItem<T> objects.Returns a sorted list of vals
     */
    toArray(isItem?: boolean): (HeapItem<T> | null | T | undefined)[] {
        isItem = isItem ?? false;
        const itemArray = this._pq.toArray();
        return isItem ? itemArray : itemArray.map(item => item.val);
    }

    sort(isItem?: undefined): (T | undefined)[];
    sort(isItem: false): (T | undefined)[];
    sort(isItem: true): (HeapItem<T> | null)[];
    /**
     * The function sorts the elements in the priority queue and returns either the sorted items or their values depending
     * on the value of the isItem parameter.
     * @param {boolean} [isItem] - The `isItem` parameter is a boolean flag that indicates whether the sorted result should
     * be an array of `HeapItem<T>` objects or an array of the values (`T`) of those objects. If `isItem` is `true`, the
     * sorted result will be an array of `HeapItem
     * @returns an array of either `HeapItem<T>`, `null`, `T`, or `undefined` values.
     */
    sort(isItem?: boolean): (HeapItem<T> | null | T | undefined)[] {
        isItem = isItem ?? false;
        const sorted = this._pq.sort();
        return isItem ? sorted : sorted.map(item => item.val);
    }

    /**
     * The clear function clears the priority queue.
     */
    clear(): void {
        this._pq.clear();
    }
}
