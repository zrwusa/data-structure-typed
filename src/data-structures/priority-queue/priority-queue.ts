/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {PriorityQueueComparator, PriorityQueueDFSOrderPattern, PriorityQueueOptions} from '../types';

export class PriorityQueue<T = number> {
    /**
     * The constructor initializes a priority queue with the given options, including an array of nodes and a comparator
     * function.
     * @param options - The `options` parameter is an object that contains the following properties:
     */
    constructor(options: PriorityQueueOptions<T>) {
        const {nodes, comparator, isFix = true} = options;
        this._comparator = comparator;

        if (nodes && Array.isArray(nodes) && nodes.length > 0) {
            // TODO support distinct
            this._nodes = [...nodes];
            isFix && this._fix();
        }
    }

    protected _nodes: T[] = [];

    get nodes(): T[] {
        return this._nodes;
    }

    get size(): number {
        return this.nodes.length;
    }

    /**
     * The `heapify` function creates a new PriorityQueue instance and fixes the heap property.
     * @param options - The "options" parameter is an object that contains the configuration options for the PriorityQueue.
     * It can include properties such as "comparator" which specifies the comparison function used to order the elements in
     * the priority queue, and "initialValues" which is an array of initial values to be added to the priority
     * @returns a new instance of the PriorityQueue class after performing the heapify operation on it.
     */
    static heapify<T>(options: PriorityQueueOptions<T>) {
        const heap = new PriorityQueue(options);
        heap._fix();
        return heap;
    }

    /**
     * The function checks if a priority queue is valid by creating a new priority queue with a fix option and then calling
     * the isValid method.
     * @param options - An object containing options for creating a priority queue. The options object should have the
     * following properties:
     * @returns the result of calling the `isValid()` method on a new instance of the `PriorityQueue` class.
     */
    static isPriorityQueueified<T>(options: Omit<PriorityQueueOptions<T>, 'isFix'>) {
        return new PriorityQueue({...options, isFix: false}).isValid();
    }

    /**
     * Starting from TypeScript version 5.0 and onwards, the use of distinct access modifiers for Getters and Setters is not permitted. As an alternative, to ensure compatibility, it is necessary to adopt a Java-style approach for Setters (using the same name as the property) while utilizing separate method names for Getters.
     */
    getNodes(): T[] {
        return this._nodes;
    }

    /**
     * The "add" function adds a node to the heap and ensures that the heap property is maintained.
     * @param {T} node - The parameter "node" is of type T, which means it can be any data type. It represents the node
     * that needs to be added to the heap.
     */
    add(node: T) {
        this.nodes.push(node);
        this._heapifyUp(this.size - 1);
    }

    /**
     * The "has" function checks if a given node is present in the list of nodes.
     * @param {T} node - The parameter `node` is of type `T`, which means it can be any type. It represents the node that
     * we want to check if it exists in the `nodes` array.
     * @returns a boolean value indicating whether the given node is included in the array of nodes.
     */
    has(node: T): boolean {
        return this.nodes.includes(node);
    }

    /**
     * The `peek` function returns the first element of the `nodes` array if it exists, otherwise it returns `null`.
     * @returns The `peek()` function is returning the first element (`T`) of the `nodes` array if the `size` is not zero.
     * Otherwise, it returns `null`.
     */
    peek(): T | null {
        return this.size ? this.nodes[0] : null;
    }

    /**
     * The `poll` function removes and returns the top element from a heap data structure.
     * @returns The `poll()` method returns a value of type `T` or `null`.
     */
    poll(): T | null {
        let res: T | null = null;
        if (this.size > 1) {
            this._swap(0, this.nodes.length - 1);
            res = this.nodes.pop() ?? null;
            this._heapifyDown(0);
        } else if (this.size === 1) {
            res = this.nodes.pop() ?? null;
        }
        return res;
    }

    /**
     * The `leaf` function returns the last element in the `nodes` array or `null` if the array is empty.
     * @returns The method `leaf()` is returning the last element (`T`) in the `nodes` array if it exists. If the array is
     * empty or the last element is `null`, then it returns `null`.
     */
    leaf(): T | null {
        return this.nodes[this.size - 1] ?? null;
    }

    /**
     * The function checks if the size of an object is equal to zero and returns a boolean value indicating whether the
     * object is empty or not.
     * @returns The method `isEmpty()` is returning a boolean value indicating whether the size of the object is equal to
     * 0.
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * The clear function clears the nodes array.
     */
    clear() {
        this._setNodes([]);
    }

    /**
     * The toArray function returns an array containing all the elements in the nodes property.
     * @returns An array of type T, which is the elements of the nodes property.
     */
    toArray(): T[] {
        return [...this.nodes];
    }

    /**
     * The `clone` function returns a new instance of the `PriorityQueue` class with the same nodes and comparator as the
     * original instance.
     * @returns The `clone()` method is returning a new instance of the `PriorityQueue` class with the same `nodes` and
     * `comparator` properties as the original instance.
     */
    clone(): PriorityQueue<T> {
        return new PriorityQueue<T>({nodes: this.nodes, comparator: this._comparator});
    }

    // --- start additional methods ---
    /**
     * The `isValid` function recursively checks if a binary tree satisfies a certain condition.
     * @returns The function `isValid()` returns a boolean value.
     */
    isValid(): boolean {
        for (let i = 0; i < this.nodes.length; i++) {
            const leftChildIndex = this._getLeft(i);
            const rightChildIndex = this._getRight(i);
            if (this._isValidIndex(leftChildIndex) && !this._compare(leftChildIndex, i)) {
                return false;
            }
            if (this._isValidIndex(rightChildIndex) && !this._compare(rightChildIndex, i)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Plan to support sorting of duplicate elements.
     */
    /**
     * The function sorts the elements in a data structure and returns them in an array.
     * Plan to support sorting of duplicate elements.
     * @returns The `sort()` method is returning an array of type `T[]`.
     */
    sort(): T[] {
        // TODO Plan to support sorting of duplicate elements.
        const visitedNode: T[] = [];
        while (this.size !== 0) {
            const top = this.poll();
            if (top) visitedNode.push(top);
        }
        return visitedNode;
    }

    /**
     * The DFS function performs a depth-first search traversal on a binary tree and returns an array of visited nodes
     * based on the specified traversal order.
     * @param {PriorityQueueDFSOrderPattern} dfsMode - The dfsMode parameter is a string that specifies the order in which
     * the nodes should be visited during the Depth-First Search (DFS) traversal. It can have one of the following values:
     * @returns an array of type `(T | null)[]`.
     */
    DFS(dfsMode: PriorityQueueDFSOrderPattern): (T | null)[] {
        const visitedNode: (T | null)[] = [];

        const traverse = (cur: number) => {
            const leftChildIndex = this._getLeft(cur);
            const rightChildIndex = this._getRight(cur);
            switch (dfsMode) {
                case 'in':
                    this._isValidIndex(leftChildIndex) && traverse(leftChildIndex);
                    visitedNode.push(this.nodes[cur] ?? null);
                    this._isValidIndex(rightChildIndex) && traverse(rightChildIndex);
                    break;
                case 'pre':
                    visitedNode.push(this.nodes[cur] ?? null);
                    this._isValidIndex(leftChildIndex) && traverse(leftChildIndex);
                    this._isValidIndex(rightChildIndex) && traverse(rightChildIndex);
                    break;
                case 'post':
                    this._isValidIndex(leftChildIndex) && traverse(leftChildIndex);
                    this._isValidIndex(rightChildIndex) && traverse(rightChildIndex);
                    visitedNode.push(this.nodes[cur] ?? null);
                    break;
            }
        };

        this._isValidIndex(0) && traverse(0);
        return visitedNode;
    }

    protected _setNodes(value: T[]) {
        this._nodes = value;
    }

    protected readonly _comparator: PriorityQueueComparator<T> = (a: T, b: T) => {
        const aKey = a as unknown as number, bKey = b as unknown as number;
        return aKey - bKey;
    };

    /**
     * The function compares two numbers using a custom comparator function.
     * @param {number} a - The parameter "a" is a number that represents the index of a node in an array.
     * @param {number} b - The parameter "b" is a number.
     * @returns the result of the comparison between the elements at indices `a` and `b` in the `nodes` array. The
     * comparison is done using the `_comparator` function, and if the result is greater than 0, `true` is returned,
     * indicating that the element at index `a` is greater than the element at index `b`.
     */
    protected _compare(a: number, b: number) {
        return this._comparator(this.nodes[a], this.nodes[b]) > 0;
    }

    /**
     * The function swaps two elements in an array.
     * @param {number} a - The parameter "a" is a number that represents the index of an element in an array.
     * @param {number} b - The parameter "b" is a number.
     */
    protected _swap(a: number, b: number) {
        const temp = this.nodes[a];
        this.nodes[a] = this.nodes[b];
        this.nodes[b] = temp;
    }

    /**
     * The function checks if a given index is valid within an array.
     * @param {number} index - The parameter "index" is of type number and represents the index value that needs to be
     * checked for validity.
     * @returns A boolean value indicating whether the given index is valid or not.
     */
    protected _isValidIndex(index: number): boolean {
        return index > -1 && index < this.nodes.length;
    }

    /**
     * The function returns the index of the parent node given the index of a child node in a binary tree.
     * @param {number} child - The "child" parameter is a number representing the index of a child node in a binary tree.
     * @returns the parent of the given child node.
     */
    protected _getParent(child: number): number {
        return Math.floor((child - 1) / 2);
    }

    /**
     * The function returns the index of the left child node in a binary tree given the index of its parent node.
     * @param {number} parent - The parameter "parent" is a number that represents the index of a node in a binary tree.
     * @returns the left child of a given parent node in a binary tree.
     */
    protected _getLeft(parent: number): number {
        return (2 * parent) + 1;
    }

    /**
     * The function returns the index of the right child node in a binary tree given the index of its parent node.
     * @param {number} parent - The parameter "parent" is a number that represents the index of a node in a binary tree.
     * @returns the right child of a given parent node in a binary tree.
     */
    protected _getRight(parent: number): number {
        return (2 * parent) + 2;
    }

    /**
     * The function returns the index of the smallest child node of a given parent node.
     * @param {number} parent - The parent parameter is a number that represents the index of the parent node in a binary
     * tree.
     * @returns the minimum value between the parent node and its left and right child nodes.
     */
    protected _getComparedChild(parent: number) {
        let min = parent;
        const left = this._getLeft(parent), right = this._getRight(parent);

        if (left < this.size && this._compare(min, left)) {
            min = left;
        }
        if (right < this.size && this._compare(min, right)) {
            min = right;
        }
        return min;
    }

    /**
     * The function `_heapifyUp` is used to maintain the heap property by moving an element up the heap until it is in the
     * correct position.
     * @param {number} start - The start parameter is the index of the element that needs to be moved up in the heap.
     */
    protected _heapifyUp(start: number) {
        while (start > 0 && this._compare(this._getParent(start), start)) {
            const parent = this._getParent(start);
            this._swap(start, parent);
            start = parent;
        }
    }

    /**
     * The function performs a heapify operation by comparing and swapping elements in a binary heap.
     * @param {number} start - The start parameter is the index of the element in the heap from where the heapifyDown
     * operation should start.
     */
    protected _heapifyDown(start: number) {
        let min = this._getComparedChild(start);
        while (this._compare(start, min)) {
            this._swap(min, start);
            start = min;
            min = this._getComparedChild(start);
        }
    }

    /**
     * The _fix function performs a heapify operation on the elements of the heap starting from the middle and moving
     * towards the root.
     */
    protected _fix() {
        for (let i = Math.floor(this.size / 2); i > -1; i--) this._heapifyDown(i);
    }

    // --- end additional methods ---
}