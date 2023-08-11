/**
 * @license MIT
 * @copyright 2020 Tyler Zeng <zrwusa@gmail.com>
 * @class
 */
export class Stack<T> {
    protected _elements: T[];

    /**
     * Creates a stack.
     * @param {array} [elements]
     */
    constructor(elements?: T[]) {
        this._elements = Array.isArray(elements) ? elements : [];
    }

    /**
     * Creates a stack from an existing array
     * @public
     * @static
     * @param {array} [elements]
     * @return {Stack}
     */
    static fromArray<T>(elements: T[]): Stack<T> {
        return new Stack(elements);
    }

    /**
     * Checks if the stack is empty.
     * @public
     * @returns {boolean}
     */
    isEmpty(): boolean {
        return this._elements.length === 0;
    }

    /**
     * Returns the number of elements in the stack.
     * @public
     * @returns {number}
     */
    size(): number {
        return this._elements.length;
    }

    /**
     * Returns the top element in the stack.
     * @public
     * @returns {object}
     */
    peek(): T | null {
        if (this.isEmpty()) return null;

        return this._elements[this._elements.length - 1];
    }

    /**
     * Adds an element to the top of the stack.
     * @public
     * @param {object} element
     */
    push(element: T): Stack<T> {
        this._elements.push(element);
        return this;
    }

    /**
     * Removes and returns the top element in the stack.
     * @public
     * @returns {object}
     */
    pop(): T | null {
        if (this.isEmpty()) return null;

        return this._elements.pop() || null;
    }

    /**
     * Returns the remaining elements as an array.
     * @public
     * @returns {array}
     */
    toArray(): T[] {
        return this._elements.slice();
    }

    /**
     * Clears all elements from the stack.
     * @public
     */
    clear(): void {
        this._elements = [];
    }

    /**
     * Creates a shallow copy from the stack.
     * @public
     * @return {Stack}
     */
    clone(): Stack<T> {
        return new Stack(this._elements.slice());
    }
}
