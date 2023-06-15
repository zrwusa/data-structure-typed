import {DoublyLinkedList} from '../linked-list';

// O(n) time complexity of obtaining the value
// O(1) time complexity of adding at the beginning and the end
export class Deque<T> extends DoublyLinkedList<T> {

}

// O(1) time complexity of obtaining the value
// O(n) time complexity of adding at the beginning and the end
// todo tested slowest one
export class ObjectDeque<T> {
    protected _nodes: { [key: number]: T } = {};
    protected _capacity = Number.MAX_SAFE_INTEGER;
    protected _first: number = -1;
    protected _last: number = -1;
    protected _size: number = 0;

    constructor(capacity?: number) {
        if (capacity !== undefined) this._capacity = capacity;
    }

    size() {
        return this._size;
    }

    offerFirst(value: T) {
        if (this._size === 0) {
            const mid = Math.floor(this._capacity / 2);
            this._first = mid;
            this._last = mid;
        } else {
            this._first--;
        }
        this._nodes[this._first] = value;
        this._size++;
    }

    offerLast(value: T) {
        if (this._size === 0) {
            const mid = Math.floor(this._capacity / 2);
            this._first = mid;
            this._last = mid;
        } else {
            this._last++;
        }
        this._nodes[this._last] = value;
        this._size++;
    }

    pollFirst() {
        if (!this._size) return;
        let value = this.peekFirst();
        delete this._nodes[this._first];
        this._first++;
        this._size--;
        return value;
    }

    peekFirst() {
        if (this._size) return this._nodes[this._first];
    }

    pollLast() {
        if (!this._size) return;
        let value = this.peekLast();
        delete this._nodes[this._last];
        this._last--;
        this._size--;

        return value;
    }

    peekLast() {
        if (this._size) return this._nodes[this._last];
    }

    get(index: number) {
        return this._nodes[this._first + index] || null;
    }

    isEmpty() {
        return this._size <= 0;
    }
}

// O(1) time complexity of obtaining the value
// O(n) time complexity of adding at the beginning and the end
export class ArrayDeque<T> {
    protected _nodes: T[] = [];

    get size() {
        return this._nodes.length;
    }

    offerLast(value: T) {
        return this._nodes.push(value);
    }

    pollLast(): T | null {
        return this._nodes.pop() ?? null;
    }

    pollFirst(): T | null {
        return this._nodes.shift() ?? null;
    }

    offerFirst(value: T) {
        return this._nodes.unshift(value);
    }

    peekFirst(): T | null {
        return this._nodes[0] ?? null;
    }

    peekLast(): T | null {
        return this._nodes[this._nodes.length - 1] ?? null;
    }

    get(index: number): T | null {
        return this._nodes[index] ?? null;
    }

    set(index: number, value: T) {
        return this._nodes[index] = value;
    }

    insert(index: number, value: T) {
        return this._nodes.splice(index, 0, value);
    }

    remove(index: number) {
        return this._nodes.splice(index, 1);
    }

    isEmpty() {
        return this._nodes.length === 0;
    }
}