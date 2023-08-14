/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
import type {DoublyLinkedListGetBy} from '../types';

export class DoublyLinkedListNode<T> {
    val: T;
    next: DoublyLinkedListNode<T> | null;
    prev: DoublyLinkedListNode<T> | null;

    constructor(nodeValue: T) {
        this.val = nodeValue;
        this.next = null;
        this.prev = null;
    }
}

export class DoublyLinkedList<T> {
    private _first: DoublyLinkedListNode<T> | null = null;
    private _last: DoublyLinkedListNode<T> | null = null;
    private _size = 0;
    get size(): number {
        return this._size;
    }

    set size(v: number) {
        this._size = v;
    }

    /**
     * The function adds a new node with a given value to the beginning of a doubly linked list.
     * @param {T} val - The `val` parameter represents the value of the element that you want to add to the beginning of
     * the doubly linked list.
     * @returns A boolean value is being returned.
     */
    addFirst(val: T): boolean {
        const newNode = new DoublyLinkedListNode(val);
        if (this._size === 0) {
            this._first = newNode;
            this._last = newNode;
        } else {
            if (this._first) this._first.prev = newNode;
            newNode.next = this._first;
            this._first = newNode;
        }
        this._size++;
        return true;
    }

    /**
     * The function adds a new node with a given value to the end of a doubly linked list.
     * @param {T} val - The `val` parameter represents the value of the element that you want to add to the end of the
     * doubly linked list.
     * @returns a boolean value, which is always true.
     */
    addLast(val: T): boolean {
        const newNode = new DoublyLinkedListNode(val);
        if (this._size === 0) {
            this._first = newNode;
            this._last = newNode;
        } else {
            if (this._last) this._last.next = newNode;
            newNode.prev = this._last;
            this._last = newNode;
        }
        this._size++;
        return true;
    }

    peekFirst(): T | null;
    peekFirst(by: 'val'): T | null;
    peekFirst(by: 'node'): DoublyLinkedListNode<T> | null;
    /**
     * The `peekFirst` function returns the first node or value in a doubly linked list, depending on the specified
     * parameter.
     * @param {DoublyLinkedListGetBy} [by] - The "by" parameter is an optional parameter of type DoublyLinkedListGetBy. It
     * is used to specify whether to return the first node, the value of the first node, or the first node itself.
     * @returns The method `peekFirst` returns either the first node of the doubly linked list (`DoublyLinkedListNode<T>`),
     * the value of the first node (`T`), or `null` depending on the value of the `by` parameter.
     */
    peekFirst(by?: DoublyLinkedListGetBy): T | DoublyLinkedListNode<T> | null {
        switch (by) {
            case 'node':
                return this._first ?? null;
            case 'val':
                return this._first?.val ?? null;
            default:
                return this._first?.val ?? null;
        }
    }

    peekLast(): T | null;
    peekLast(by: 'val'): T | null;
    peekLast(by: 'node'): DoublyLinkedListNode<T> | null;
    /**
     * The `peekLast` function returns the last node or value in a doubly linked list.
     * @param {DoublyLinkedListGetBy} [by=val] - The "by" parameter is an optional parameter of type DoublyLinkedListGetBy.
     * It specifies whether to return the last node, the value of the last node, or both. The default value is 'val', which
     * means that if no value is provided for the "by" parameter, the method
     * @returns The method `peekLast` returns the last node, value, or null based on the specified `by` parameter.
     */
    peekLast(by: DoublyLinkedListGetBy = 'val'): T | DoublyLinkedListNode<T> | null {
        switch (by) {
            case 'node':
                return this._last ?? null;
            case 'val':
                return this._last?.val ?? null;
            default:
                return this._last?.val ?? null;
        }
    }

    pollFirst(): T | null;
    pollFirst(by: 'val'): T | null;
    pollFirst(by: 'node'): DoublyLinkedListNode<T> | null;
    /**
     * The function `pollFirst` removes and returns the first element of a doubly linked list, either as a node or its
     * value, depending on the specified parameter.
     * @param {DoublyLinkedListGetBy} [by=val] - The "by" parameter is an optional parameter of type DoublyLinkedListGetBy.
     * It specifies the criteria by which the first element should be retrieved from the doubly linked list. The default
     * value is 'val', which means the first element will be retrieved by its value. Other possible values for "by
     * @returns The method `pollFirst` returns either the value of the first node in the doubly linked list, the first node
     * itself, or null if the list is empty. The specific return type depends on the value of the `by` parameter. If `by`
     * is set to 'node', the method returns the first node. If `by` is set to 'val', the method returns the value
     */
    pollFirst(by: DoublyLinkedListGetBy = 'val'): T | DoublyLinkedListNode<T> | null {
        if (this._size === 0) return null;
        const oldHead = this._first;
        if (this._size === 1) {
            this._first = null;
            this._last = null;
        } else {
            this._first = oldHead?.next ?? null;
            if (this._first) this._first.prev = null;
            if (oldHead) oldHead.next = null;
        }
        this._size--;
        switch (by) {
            case 'node':
                return oldHead ?? null;
            case 'val':
                return oldHead?.val ?? null;
            default:
                return oldHead?.val ?? null;
        }
    }

    pollLast(): T | null;
    pollLast(by: 'val'): T | null;
    pollLast(by: 'node'): DoublyLinkedListNode<T> | null;
    /**
     * The function `pollLast` removes and returns the last element in a doubly linked list, either as a node or its value,
     * depending on the specified parameter.
     * @param {DoublyLinkedListGetBy} [by=val] - The parameter "by" is of type DoublyLinkedListGetBy, which is an enum that
     * can have two possible values: 'node' or 'val'. It determines the type of value that will be returned by the pollLast
     * method. If 'node' is specified, the method will return the
     * @returns The method `pollLast` returns either a `DoublyLinkedListNode<T>`, the value of the node (`T`), or `null`.
     * The specific type that is returned depends on the value of the `by` parameter. If `by` is set to `'node'`, then a
     * `DoublyLinkedListNode<T>` is returned. If `by` is set to `'
     */
    pollLast(by: DoublyLinkedListGetBy = 'val'): DoublyLinkedListNode<T> | T | null {
        if (this._size === 0) return null;
        const polled = this._last;
        if (this._size === 1) {
            this._first = null;
            this._last = null;
        } else {
            this._last = polled?.prev ?? null;
            if (this._last) this._last.next = null;
            if (polled) polled.prev = null;
        }
        this._size--;
        switch (by) {
            case 'node':
                return polled ?? null;
            case 'val':
                return polled?.val ?? null;
            default:
                return polled?.val ?? null;
        }
    }

    get(index: number): T | null;
    get(index: number, by: 'node'): DoublyLinkedListNode<T> | null;
    get(index: number, by: 'val'): T | null;
    /**
     * Returns the node at the specified index of the linked list.
     * If index = 0; first element in the list is returned.
     * If index = 3; fourth element in the list is returned.
     * @param index Index of the node to be retrieved
     * @param by Return value type
     */
    get(index: number, by: DoublyLinkedListGetBy = 'val'): T | DoublyLinkedListNode<T> | null {
        if (index < 0 || index >= this._size) return null;
        let count, current;
        if (index <= this._size / 2) {
            count = 0;
            current = this._first;
            while (count !== index) {
                current = current?.next;
                count++;
            }
        } else {
            count = this._size - 1;
            current = this._last;
            while (count !== index) {
                current = current?.prev;
                count--;
            }
        }
        switch (by) {
            case 'node':
                return current ?? null;
            case 'val':
                return current?.val ?? null;
            default:
                return current?.val ?? null;
        }
    }

    /**
     * Updates the value of the node at the specified index.
     * If index = 0; Value of the first element in the list is updated.
     * If index = 3; Value of the fourth element in the list is updated.
     * @param index Index of the node to be updated
     * @param val New value of the node
     */
    set(index: number, val: T): boolean {
        const foundNode = this.get(index, 'node');
        if (foundNode !== null) {
            foundNode.val = val;
            return true;
        }
        return false;
    }

    isEmpty() {
        return this._size === 0;
    }

    // --- start extra methods ---
    /**
     * Inserts a new node at the specified index.
     * @param index Index at which the new node has to be inserted
     * @param val Value of the new node to be inserted
     */
    insert(index: number, val: T): boolean {
        if (index < 0 || index > this._size) return false;
        if (index === 0) return !!this.addFirst(val);
        if (index === this._size) return !!this.addLast(val);

        const newNode = new DoublyLinkedListNode(val);
        const prevNode = this.get(index - 1, 'node');
        const nextNode = prevNode?.next;

        if (prevNode) prevNode.next = newNode;
        newNode.prev = prevNode;
        newNode.next = nextNode ?? null;
        if (nextNode) nextNode.prev = newNode;
        this._size++;
        return true;
    }

    /**
     * The `remove` function removes an element at a specified index from a data structure, updating the links between
     * nodes accordingly.
     * @param {number} index - The index parameter represents the position of the element to be removed in the data
     * structure. It is of type number.
     * @returns The `remove` method returns the value of the removed element (`T`) if the removal is successful, or `null`
     * if the index is out of bounds.
     */
    remove(index: number): T | null {
        if (index < 0 || index > this._size - 1) return null;
        else if (index === 0) return this.pollFirst();
        else if (index === this._size - 1) return this.pollLast('node')?.val ?? null;
        else {
            const prevNode = this.get(index - 1, 'node');
            const removeNode = prevNode?.next;
            const nextNode = removeNode?.next;
            if (prevNode) prevNode.next = nextNode ?? null;
            if (nextNode) nextNode.prev = prevNode;
            if (removeNode) removeNode.next = null;
            if (removeNode) removeNode.prev = null;
            this._size--;
            return removeNode?.val ?? null;
        }
    }

    // --- end extra methods ---
}
