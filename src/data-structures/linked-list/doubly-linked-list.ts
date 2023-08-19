/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
export class DoublyLinkedListNode<T> {

    constructor(val: T) {
        this._val = val;
        this._next = null;
        this._prev = null;
    }

    private _val: T;

    get val(): T {
        return this._val;
    }

    set val(value: T) {
        this._val = value;
    }

    private _next: DoublyLinkedListNode<T> | null;

    get next(): DoublyLinkedListNode<T> | null {
        return this._next;
    }

    set next(value: DoublyLinkedListNode<T> | null) {
        this._next = value;
    }

    private _prev: DoublyLinkedListNode<T> | null;

    get prev(): DoublyLinkedListNode<T> | null {
        return this._prev;
    }

    set prev(value: DoublyLinkedListNode<T> | null) {
        this._prev = value;
    }
}

export class DoublyLinkedList<T> {

    constructor() {
        this._head = null;
        this._tail = null;
        this._length = 0;
    }

    private _head: DoublyLinkedListNode<T> | null;

    get head(): DoublyLinkedListNode<T> | null {
        return this._head;
    }

    set head(value: DoublyLinkedListNode<T> | null) {
        this._head = value;
    }

    private _tail: DoublyLinkedListNode<T> | null;

    get tail(): DoublyLinkedListNode<T> | null {
        return this._tail;
    }

    set tail(value: DoublyLinkedListNode<T> | null) {
        this._tail = value;
    }

    private _length: number;

    get length(): number {
        return this._length;
    }

    protected set length(value: number) {
        this._length = value;
    }

    getLength(): number {
        return this._length;
    }

    push(val: T): void {
        const newNode = new DoublyLinkedListNode(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail!.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    pop(): T | null {
        if (!this.tail) return null;
        const removedNode = this.tail;
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = removedNode.prev;
            this.tail!.next = null;
        }
        this.length--;
        return removedNode.val;
    }

    shift(): T | null {
        if (!this.head) return null;
        const removedNode = this.head;
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = removedNode.next;
            this.head!.prev = null;
        }
        this.length--;
        return removedNode.val;
    }

    unshift(val: T): void {
        const newNode = new DoublyLinkedListNode(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head!.prev = newNode;
            this.head = newNode;
        }
        this.length++;
    }

    get(index: number): T | null {
        if (index < 0 || index >= this.length) return null;
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current!.next;
        }
        return current!.val;
    }

    getNodeAt(index: number): DoublyLinkedListNode<T> | null {
        if (index < 0 || index >= this.length) return null;
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current!.next;
        }
        return current;
    }

    findNodeByValue(val: T): DoublyLinkedListNode<T> | null {
        let current = this.head;

        while (current) {
            if (current.val === val) {
                return current;
            }
            current = current.next;
        }

        return null;
    }

    insert(index: number, val: T): boolean {
        if (index < 0 || index > this.length) return false;
        if (index === 0) {
            this.unshift(val);
            return true;
        }
        if (index === this.length) {
            this.push(val);
            return true;
        }

        const newNode = new DoublyLinkedListNode(val);
        const prevNode = this.getNodeAt(index - 1);
        const nextNode = prevNode!.next;
        newNode.prev = prevNode;
        newNode.next = nextNode;
        prevNode!.next = newNode;
        nextNode!.prev = newNode;
        this.length++;
        return true;
    }

    deleteAt(index: number): T | null {
        if (index < 0 || index >= this.length) return null;
        if (index === 0) return this.shift();
        if (index === this.length - 1) return this.pop();

        const removedNode = this.getNodeAt(index);
        const prevNode = removedNode!.prev;
        const nextNode = removedNode!.next;
        prevNode!.next = nextNode;
        nextNode!.prev = prevNode;
        this.length--;
        return removedNode!.val;
    }

    delete(val: T): boolean {
        let current = this.head;
        while (current) {
            if (current.val === val) {
                if (current === this.head) {
                    this.shift();
                } else if (current === this.tail) {
                    this.pop();
                } else {
                    const prevNode = current.prev;
                    const nextNode = current.next;
                    prevNode!.next = nextNode;
                    nextNode!.prev = prevNode;
                    this.length--;
                }
                return true;
            }
            current = current.next;
        }
        return false;
    }

    toArray(): T[] {
        const array: T[] = [];
        let current = this.head;
        while (current) {
            array.push(current.val);
            current = current.next;
        }
        return array;
    }

    clear(): void {
        this._head = null;
        this._tail = null;
        this._length = 0;
    }

    find(callback: (val: T) => boolean): T | null {
        let current = this.head;
        while (current) {
            if (callback(current.val)) {
                return current.val;
            }
            current = current.next;
        }
        return null;
    }

    indexOf(val: T): number {
        let index = 0;
        let current = this.head;
        while (current) {
            if (current.val === val) {
                return index;
            }
            index++;
            current = current.next;
        }
        return -1;
    }

    findLast(callback: (val: T) => boolean): T | null {
        let current = this.tail;
        while (current) {
            if (callback(current.val)) {
                return current.val;
            }
            current = current.prev;
        }
        return null;
    }

    toArrayReverse(): T[] {
        const array: T[] = [];
        let current = this.tail;
        while (current) {
            array.push(current.val);
            current = current.prev;
        }
        return array;
    }

    reverse(): void {
        let current = this.head;
        [this.head, this.tail] = [this.tail, this.head];
        while (current) {
            const next = current.next;
            [current.prev, current.next] = [current.next, current.prev];
            current = next;
        }
    }

    forEach(callback: (val: T, index: number) => void): void {
        let current = this.head;
        let index = 0;
        while (current) {
            callback(current.val, index);
            current = current.next;
            index++;
        }
    }

    map<U>(callback: (val: T) => U): DoublyLinkedList<U> {
        const mappedList = new DoublyLinkedList<U>();
        let current = this.head;
        while (current) {
            mappedList.push(callback(current.val));
            current = current.next;
        }
        return mappedList;
    }

    filter(callback: (val: T) => boolean): DoublyLinkedList<T> {
        const filteredList = new DoublyLinkedList<T>();
        let current = this.head;
        while (current) {
            if (callback(current.val)) {
                filteredList.push(current.val);
            }
            current = current.next;
        }
        return filteredList;
    }

    reduce<U>(callback: (accumulator: U, val: T) => U, initialValue: U): U {
        let accumulator = initialValue;
        let current = this.head;
        while (current) {
            accumulator = callback(accumulator, current.val);
            current = current.next;
        }
        return accumulator;
    }

    insertAfter(existingValue: T, newValue: T): boolean {
        const existingNode = this.findNodeByValue(existingValue);

        if (existingNode) {
            const newNode = new DoublyLinkedListNode(newValue);
            newNode.next = existingNode.next;
            if (existingNode.next) {
                existingNode.next.prev = newNode;
            }
            newNode.prev = existingNode;
            existingNode.next = newNode;
            if (existingNode === this.tail) {
                this.tail = newNode;
            }
            this.length++;
            return true;
        }

        return false;
    }

    insertBefore(existingValue: T, newValue: T): boolean {
        const existingNode = this.findNodeByValue(existingValue);

        if (existingNode) {
            const newNode = new DoublyLinkedListNode(newValue);
            newNode.prev = existingNode.prev;
            if (existingNode.prev) {
                existingNode.prev.next = newNode;
            }
            newNode.next = existingNode;
            existingNode.prev = newNode;
            if (existingNode === this.head) {
                this.head = newNode;
            }
            this.length++;
            return true;
        }

        return false;
    }
}

