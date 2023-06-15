// 操作      常见名称       Ada           Java        JavaScript     C++          Python      Perl       PHP             Ruby
// 尾部插入   inject, snoc Append         offerLast   push          push_back    append      push        array_push      push
// 头部插入   push, cons   Prepend        offerFirst  unshift       push_front   appendleft  unshift     array_unshift   unshift
// 尾部删除   eject        Delete_Last    pollLast    pop           pop_back     pop         pop         array_pop       pop
// 头部删除   pop          Delete_First   pollFirst   shift         pop_front    popleft     shift       array_shift     shift
// 查看尾部                Last_Element   peekLast    [length - 1]  back         [-1]        $array[-1]  end             last
// 查看头部                First_Element  peekFirst   [0]           front        [0]         $array[0]   reset           first

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

export type DoublyLinkedListGetBy = 'node' | 'val';

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
     * Adds a node at the beginning of the linked list
     * @param val Value to be stored at the beginning of the linked list
     */
    offerFirst(val: T): boolean {
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
     * Adds a node to the end of the linked list
     * @param val Value to be stored in the Doubly linked list node
     */
    offerLast(val: T): boolean {
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
     * Removes a node form the beginning of the linked list and will return the node val
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
     * Removes a node at the end of the linked list and will return the node value
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
        if (index === 0) return !!this.offerFirst(val);
        if (index === this._size) return !!this.offerLast(val);

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
     * Removes a node at the specified index and returns its value.
     * @param index Index at which the node has to be removed.
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
