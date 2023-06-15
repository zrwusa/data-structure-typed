/**
 * @license MIT
 * @copyright 2020 Pablo
 *
 * @class
 */
export class Queue<T> {
    protected _nodes: T[];
    protected _offset: number;

    /**
     * Creates a queue.
     * @param {array} [elements]
     */
    constructor(elements?: T[]) {
        this._nodes = elements || [];
        this._offset = 0;
    }

    /**
     * Adds an element at the back of the queue.
     * @public
     * @param {any} element
     */
    offer(element: T): Queue<T> {
        this._nodes.push(element);
        return this;
    }

    /**
     * Dequeues the front element in the queue.
     * @public
     * @returns {any}
     */
    poll(): T | null {
        if (this.size() === 0) return null;

        const first = this.peek();
        this._offset += 1;

        if (this._offset * 2 < this._nodes.length) return first;

        // only remove dequeued elements when reaching half size
        // to decrease latency of shifting elements.
        this._nodes = this._nodes.slice(this._offset);
        this._offset = 0;
        return first;
    }

    /**
     * Returns the front element of the queue.
     * @public
     * @returns {any}
     */
    peek(): T | null {
        return this.size() > 0 ? this._nodes[this._offset] : null;
    }

    /**
     * Returns the back element of the queue.
     * @public
     * @returns {any}
     */
    peekLast(): T | null {
        return this.size() > 0 ? this._nodes[this._nodes.length - 1] : null;
    }

    /**
     * Returns the number of elements in the queue.
     * @public
     * @returns {number}
     */
    size(): number {
        return this._nodes.length - this._offset;
    }

    /**
     * Checks if the queue is empty.
     * @public
     * @returns {boolean}
     */
    isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * Returns the remaining elements in the queue as an array.
     * @public
     * @returns {array}
     */
    toArray(): T[] {
        return this._nodes.slice(this._offset);
    }

    /**
     * Clears the queue.
     * @public
     */
    clear(): void {
        this._nodes = [];
        this._offset = 0;
    }

    /**
     * Creates a shallow copy of the queue.
     * @public
     * @return {Queue}
     */
    clone(): Queue<T> {
        return new Queue(this._nodes.slice(this._offset));
    }

    /**
     * Creates a queue from an existing array.
     * @public
     * @static
     * @param {array} elements
     * @return {Queue}
     */
    static fromArray<T>(elements: T[]): Queue<T> {
        return new Queue(elements);
    }
}
