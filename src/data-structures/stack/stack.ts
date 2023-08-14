/**
 * @license MIT
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @class
 */
export class Stack<T> {
    protected _elements: T[];

    /**
     * The constructor initializes an array of elements, which can be provided as an optional parameter.
     * @param {T[]} [elements] - The `elements` parameter is an optional parameter of type `T[]`, which represents an array
     * of elements of type `T`. It is used to initialize the `_elements` property of the class. If the `elements` parameter
     * is provided and is an array, it is assigned to the `_elements
     */
    constructor(elements?: T[]) {
        this._elements = Array.isArray(elements) ? elements : [];
    }

    /**
     * The function "fromArray" creates a new Stack object from an array of elements.
     * @param {T[]} elements - The `elements` parameter is an array of elements of type `T`.
     * @returns {Stack} The method is returning a new instance of the Stack class, initialized with the elements from the input
     * array.
     */
    static fromArray<T>(elements: T[]): Stack<T> {
        return new Stack(elements);
    }

    /**
     * The function checks if an array is empty and returns a boolean value.
     * @returns A boolean value indicating whether the `_elements` array is empty or not.
     */
    isEmpty(): boolean {
        return this._elements.length === 0;
    }

    /**
     * The size() function returns the number of elements in an array.
     * @returns The size of the elements array.
     */
    size(): number {
        return this._elements.length;
    }

    /**
     * The `peek` function returns the last element of an array, or null if the array is empty.
     * @returns The `peek()` function returns the last element of the `_elements` array, or `null` if the array is empty.
     */
    peek(): T | null {
        if (this.isEmpty()) return null;

        return this._elements[this._elements.length - 1];
    }

    /**
     * The push function adds an element to the stack and returns the updated stack.
     * @param {T} element - The parameter "element" is of type T, which means it can be any data type.
     * @returns The `push` method is returning the updated `Stack<T>` object.
     */
    push(element: T): Stack<T> {
        this._elements.push(element);
        return this;
    }

    /**
     * The `pop` function removes and returns the last element from an array, or returns null if the array is empty.
     * @returns The `pop()` method is returning the last element of the array `_elements` if the array is not empty. If the
     * array is empty, it returns `null`.
     */
    pop(): T | null {
        if (this.isEmpty()) return null;

        return this._elements.pop() || null;
    }

    /**
     * The toArray function returns a copy of the elements in an array.
     * @returns An array of type T.
     */
    toArray(): T[] {
        return this._elements.slice();
    }

    /**
     * The clear function clears the elements array.
     */
    clear(): void {
        this._elements = [];
    }

    /**
     * The `clone()` function returns a new `Stack` object with the same elements as the original stack.
     * @returns The `clone()` method is returning a new `Stack` object with a copy of the `_elements` array.
     */
    clone(): Stack<T> {
        return new Stack(this._elements.slice());
    }
}
