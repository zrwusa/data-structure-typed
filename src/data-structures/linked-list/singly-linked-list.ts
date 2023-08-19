/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
export class SinglyLinkedListNode<T> {

    constructor(val: T) {
        this._val = val;
        this._next = null;
    }

    private _val: T;

    get val(): T {
        return this._val;
    }

    set val(value: T) {
        this._val = value;
    }

    private _next: SinglyLinkedListNode<T> | null;

    get next(): SinglyLinkedListNode<T> | null {
        return this._next;
    }

    set next(value: SinglyLinkedListNode<T> | null) {
        this._next = value;
    }
}

export class SinglyLinkedList<T> {

    constructor() {
        this._head = null;
        this._tail = null;
        this._length = 0;
    }

    private _head: SinglyLinkedListNode<T> | null;

    get head(): SinglyLinkedListNode<T> | null {
        return this._head;
    }

    set head(value: SinglyLinkedListNode<T> | null) {
        this._head = value;
    }

    private _tail: SinglyLinkedListNode<T> | null;

    get tail(): SinglyLinkedListNode<T> | null {
        return this._tail;
    }

    set tail(value: SinglyLinkedListNode<T> | null) {
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

    push(data: T): void {
        const newNode = new SinglyLinkedListNode(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    pop(): T | null {
        if (!this.head) return null;
        if (this.head === this.tail) {
            const val = this.head.val;
            this.head = null;
            this.tail = null;
            this.length--;
            return val;
        }

        let current = this.head;
        while (current.next !== this.tail) {
            current = current.next!;
        }
        const val = this.tail!.val;
        current.next = null;
        this.tail = current;
        this.length--;
        return val;
    }

    shift(): T | null {
        if (!this.head) return null;
        const removedNode = this.head;
        this.head = this.head.next;
        this.length--;
        return removedNode.val;
    }

    unshift(val: T): void {
        const newNode = new SinglyLinkedListNode(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
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

    deleteAt(index: number): T | null {
        if (index < 0 || index >= this.length) return null;
        if (index === 0) return this.shift();
        if (index === this.length - 1) return this.pop();

        let prevNode = this.getNodeAt(index - 1);
        const removedNode = prevNode!.next;
        prevNode!.next = removedNode!.next;
        this.length--;
        return removedNode!.val;
    }

    delete(value: T): boolean {
        let current = this.head;
        let prev = null;

        while (current) {
            if (current.val === value) {
                if (prev === null) {
                    this.head = current.next;
                    if (current === this.tail) {
                        this.tail = null;
                    }
                } else {
                    prev.next = current.next;
                    if (current === this.tail) {
                        this.tail = prev;
                    }
                }
                this.length--;
                return true;
            }
            prev = current;
            current = current.next;
        }

        return false;
    }

    getNodeAt(index: number): SinglyLinkedListNode<T> | null {
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current!.next;
        }
        return current;
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

        const newNode = new SinglyLinkedListNode(val);
        const prevNode = this.getNodeAt(index - 1);
        newNode.next = prevNode!.next;
        prevNode!.next = newNode;
        this.length++;
        return true;
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    clear(): void {
        this._head = null;
        this._tail = null;
        this._length = 0;
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

    reverse(): void {
        if (!this.head || this.head === this.tail) return;

        let prev: SinglyLinkedListNode<T> | null = null;
        let current: SinglyLinkedListNode<T> | null = this.head;
        let next: SinglyLinkedListNode<T> | null = null;

        while (current) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }

        [this.head, this.tail] = [this.tail!, this.head!];
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


    indexOf(value: T): number {
        let index = 0;
        let current = this.head;

        while (current) {
            if (current.val === value) {
                return index;
            }
            index++;
            current = current.next;
        }

        return -1;
    }

    findNodeByValue(value: T): SinglyLinkedListNode<T> | null {
        let current = this.head;

        while (current) {
            if (current.val === value) {
                return current;
            }
            current = current.next;
        }

        return null;
    }

    insertBefore(existingValue: T, newValue: T): boolean {
        if (!this.head) {
            return false;
        }

        if (this.head.val === existingValue) {
            this.unshift(newValue);
            return true;
        }

        let current = this.head;
        while (current.next) {
            if (current.next.val === existingValue) {
                const newNode = new SinglyLinkedListNode(newValue);
                newNode.next = current.next;
                current.next = newNode;
                this.length++;
                return true;
            }
            current = current.next;
        }

        return false;
    }

    insertAfter(existingValue: T, newValue: T): boolean {
        const existingNode = this.findNodeByValue(existingValue);

        if (existingNode) {
            const newNode = new SinglyLinkedListNode(newValue);
            newNode.next = existingNode.next;
            existingNode.next = newNode;
            if (existingNode === this.tail) {
                this.tail = newNode;
            }
            this.length++;
            return true;
        }

        return false;
    }

    countOccurrences(value: T): number {
        let count = 0;
        let current = this.head;

        while (current) {
            if (current.val === value) {
                count++;
            }
            current = current.next;
        }

        return count;
    }
}
