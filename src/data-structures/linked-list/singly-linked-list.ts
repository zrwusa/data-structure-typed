/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */


/* The SinglyLinkedListNode class represents a node in a singly linked list and provides methods for inserting, removing,
and accessing nodes. */
export class SinglyLinkedListNode<NodeVal = any> {
    constructor(val: NodeVal, prev?: SinglyLinkedListNode<NodeVal> | null, next?: SinglyLinkedListNode<NodeVal> | null, list?: SinglyLinkedList<NodeVal> | null) {
        this._val = val;
        this._prev = prev || null;
        this._next = next || null;
        this._list = list || null;
    }

    protected _val: NodeVal;

    get val(): NodeVal {
        return this._val;
    }

    set val(value: NodeVal) {
        this._val = value;
    }

    protected _prev: SinglyLinkedListNode<NodeVal> | null;

    get prev(): SinglyLinkedListNode<NodeVal> | null {
        return this._prev;
    }

    set prev(value: SinglyLinkedListNode<NodeVal> | null) {
        this._prev = value;
    }

    protected _next: SinglyLinkedListNode<NodeVal> | null

    get next(): SinglyLinkedListNode<NodeVal> | null {
        return this._next;
    }

    set next(value: SinglyLinkedListNode<NodeVal> | null) {
        this._next = value;
    }

    protected _list: SinglyLinkedList<NodeVal> | null

    get list(): SinglyLinkedList<NodeVal> | null {
        return this._list;
    }

    set list(value: SinglyLinkedList<NodeVal> | null) {
        this._list = value;
    }

    get index() {
        if (!this.list) {
            return undefined;
        }
        return this.list.findIndex((value) => value === this.val);
    }

    /**
     * The `insertBefore` function inserts a new node with the given value before the current node in a singly linked list.
     * @param {NodeVal} val - The parameter "val" is of type "NodeVal". It represents the value of the node that you want
     * to insert before the current node.
     * @returns The method is returning a SinglyLinkedList<NodeVal>.
     */
    insertBefore(val: NodeVal): SinglyLinkedList<NodeVal> {
        return this.list !== null
            ? this.list.insertBefore(this, val)
            : new SinglyLinkedList(val, this.val);
    }

    /**
     * The function inserts a new node with the given value after the current node in a singly linked list.
     * @param {NodeVal} val - The parameter `val` is the value of the node that you want to insert after the current node.
     * @returns The method is returning a SinglyLinkedList<NodeVal>.
     */
    insertAfter(val: NodeVal): SinglyLinkedList<NodeVal> {
        return this.list !== null
            ? this.list.insertAfter(this, val)
            : new SinglyLinkedList(this.val, val);
    }

    /**
     * The `remove()` function removes a node from a singly linked list.
     * @returns The remove() method is returning a SinglyLinkedListNode<NodeVal> object.
     */
    remove(): SinglyLinkedListNode<NodeVal> {
        if (this.list === null) {
            throw new ReferenceError('Node does not belong to any list');
        }
        return this.list.removeNode(this);
    }
}

export class SinglyLinkedList<NodeVal = any> {

    /**
     * The constructor initializes a linked list with the given arguments as nodes.
     * @param {NodeVal[]} args - args is a rest parameter that allows the constructor to accept an arbitrary number of
     * arguments of type NodeVal.
     */
    constructor(...args: NodeVal[]) {
        this._head = null;
        this._tail = null;
        this._size = 0;

        for (let i = 0; i < arguments.length; i++) {
            this.append(args[i]);
        }
    }

    protected _head: SinglyLinkedListNode<NodeVal> | null;

    get head(): SinglyLinkedListNode<NodeVal> | null {
        return this._head;
    }

    set head(value: SinglyLinkedListNode<NodeVal> | null) {
        this._head = value;
    }

    protected _tail: SinglyLinkedListNode<NodeVal> | null;

    get tail(): SinglyLinkedListNode<NodeVal> | null {
        return this._tail;
    }

    set tail(value: SinglyLinkedListNode<NodeVal> | null) {
        this._tail = value;
    }

    protected _size: number;

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    /**
     * The `from` function in TypeScript creates a new SinglyLinkedList instance from an iterable object.
     * @param iterable - The `iterable` parameter is an object that can be iterated over, such as an array or a string. It
     * contains a collection of elements of type `T`.
     * @returns The method is returning a new instance of the SinglyLinkedList class.
     */
    static from<T>(iterable: Iterable<T>): SinglyLinkedList<T> {
        return new SinglyLinkedList(...iterable);
    }

    /**
     * The `get` function returns the value of a node at a given index in a data structure.
     * @param {number} index - The index parameter is a number that represents the position of the node in the data
     * structure.
     * @returns The method is returning the value of the node at the specified index if the node exists, otherwise it
     * returns undefined.
     */
    get(index: number): NodeVal | undefined {
        const node = this.getNode(index);
        return node !== undefined ? node.val : undefined;
    }

    /**
     * The function `getNode` returns the node at a given index in a singly linked list.
     * @param {number} index - The `index` parameter is a number that represents the position of the node we want to
     * retrieve from the linked list.
     * @returns a SinglyLinkedListNode<NodeVal> object or undefined.
     */
    getNode(index: number): SinglyLinkedListNode<NodeVal> | undefined {
        if (this.head === null || index < 0 || index >= this.size) {
            return undefined;
        }
        const asc = index < this.size / 2;
        const stopAt = asc ? index : this.size - index - 1;
        const nextNode = asc ? 'next' : 'prev';
        let currentNode = asc ? this.head : this.tail;
        // TODO after no-non-null-assertion not ensure the logic
        for (let currentIndex = 0; currentIndex < stopAt; currentIndex++) {
            if (currentNode) {
                currentNode = currentNode[nextNode];
            }
        }
        return currentNode || undefined;
    }

    /**
     * The function `findNodeIndex` searches for a node in a singly linked list that satisfies a given condition and
     * returns its index and the node itself.
     * @param callbackFn - The callbackFn parameter is a function that takes three arguments: data, index, and list. It is
     * used to determine whether a node in the singly linked list matches a certain condition. The function should return a
     * boolean value indicating whether the condition is met for the given node.
     * @returns The function `findNodeIndex` returns an object with two properties: `node` and `index`. The `node` property
     * contains the node that matches the condition specified in the `callbackFn` function, and the `index` property
     * contains the index of that node in the linked list. If no node matches the condition, the function returns
     * `undefined`.
     */
    findNodeIndex(callbackFn: (
        data: NodeVal,
        index: number,
        list: SinglyLinkedList<NodeVal>,
    ) => boolean): ({
        node: SinglyLinkedListNode<NodeVal>,
        index: number,
    }) | undefined {
        let currentIndex = 0;
        let currentNode = this.head;
        while (currentNode) {
            if (callbackFn(currentNode.val, currentIndex, this)) {
                return {
                    index: currentIndex,
                    node: currentNode,
                };
            }
            currentNode = currentNode.next;
            currentIndex += 1;
        }
        return undefined;
    }

    /**
     * The findNode function searches for a node in a singly linked list based on a given callback function.
     * @param callbackFn - A callback function that takes three parameters: data, index, and list. It returns a boolean
     * value indicating whether the current node matches the desired criteria.
     * @returns The function `findNode` returns a `SinglyLinkedListNode<NodeVal>` if a node satisfying the condition
     * specified by the `callbackFn` is found in the linked list. If no such node is found, it returns `undefined`.
     */
    findNode(callbackFn: (
        data: NodeVal,
        index: number,
        list: SinglyLinkedList<NodeVal>,
    ) => boolean): SinglyLinkedListNode<NodeVal> | undefined {
        const nodeIndex = this.findNodeIndex(callbackFn);
        return nodeIndex !== undefined ? nodeIndex.node : undefined;
    }

    /**
     * The `find` function in TypeScript searches for a node in a singly linked list based on a given callback function and
     * returns the value of the found node.
     * @param callbackFn - A callback function that takes three parameters: data, index, and list. It returns a boolean
     * value indicating whether the condition is met for a particular node in the linked list.
     * @returns The method `find` returns the `NodeVal` value of the first node in the linked list that satisfies the
     * condition specified by the `callbackFn` function. If no node satisfies the condition, it returns `undefined`.
     */
    find(callbackFn: (
        data: NodeVal,
        index: number,
        list: SinglyLinkedList<NodeVal>,
    ) => boolean): NodeVal | undefined {
        const nodeIndex = this.findNodeIndex(callbackFn);
        return nodeIndex !== undefined ? nodeIndex.node.val : undefined;
    }

    /**
     * The findIndex function returns the index of the first node in a singly linked list that satisfies a given condition,
     * or -1 if no such node is found.
     * @param callbackFn - A callback function that takes three parameters: data, index, and list. It returns a boolean
     * value indicating whether the condition is met for a particular node in the singly linked list.
     * @returns The method `findIndex` returns a number.
     */
    findIndex(callbackFn: (
        data: NodeVal,
        index: number,
        list: SinglyLinkedList<NodeVal>,
    ) => boolean): number {
        const nodeIndex = this.findNodeIndex(callbackFn);
        return nodeIndex !== undefined ? nodeIndex.index : -1;
    }

    /* The above code is a comment in TypeScript. It is using the triple hash symbol ( */
    append(...args: NodeVal[]): SinglyLinkedList<NodeVal> {
        for (const val of args) {
            const node = new SinglyLinkedListNode(val, this.tail, null, this);
            if (this.head === null) {
                this.head = node;
            }
            if (this.tail !== null) {
                this.tail.next = node;
            }
            this.tail = node;
            this.size += 1;
        }
        return this;
    }

    /**
     * The push function appends multiple NodeVal objects to a data structure and returns the new size of the data
     * structure.
     * @param {NodeVal[]} args - args is a rest parameter of type NodeVal[]. It allows the function to accept any number
     * of arguments of type NodeVal.
     * @returns The size of the data structure after the nodes are appended.
     */
    push(...args: NodeVal[]): number {
        this.append(...args);
        return this.size;
    }

    /**
     * The `prepend` function adds new nodes to the beginning of a singly linked list.
     * @param {NodeVal[]} args - An array of NodeVal objects.
     * @returns The `prepend` method is returning the updated `SinglyLinkedList` object.
     */
    prepend(...args: NodeVal[]): SinglyLinkedList<NodeVal> {
        const reverseArgs = Array.from(args).reverse();
        for (const val of reverseArgs) {
            const node = new SinglyLinkedListNode(val, null, this.head, this);
            if (this.tail === null) {
                this.tail = node;
            }
            if (this.head !== null) {
                this.head.prev = node;
            }
            this.head = node;
            this.size += 1;
        }
        return this;
    }

    /**
     * The `insertAt` function inserts a value at a specified index in a singly linked list.
     * @param {number} index - The index parameter is a number that represents the position at which the new node should be
     * inserted in the linked list.
     * @param {NodeVal} val - The `val` parameter represents the value of the node that you want to insert into the linked
     * list.
     * @returns The method `insertAt` returns the updated `SinglyLinkedList` object.
     */
    insertAt(index: number, val: NodeVal): SinglyLinkedList<NodeVal> {
        if (this.head === null) {
            return this.append(val);
        }
        if (index <= 0) {
            return this.prepend(val);
        }

        let currentNode = this.head;
        let currentIndex = 0;
        while (currentIndex < index - 1 && currentNode.next !== null) {
            currentIndex += 1;
            currentNode = currentNode.next;
        }
        currentNode.insertAfter(val);
        return this;
    }

    /**
     * The removeNode function removes a node from a singly linked list and updates the head, tail, and size properties
     * accordingly.
     * @param node - The `node` parameter is of type `SinglyLinkedListNode<NodeVal>`, which represents a node in a singly
     * linked list.
     * @returns the removed node.
     */
    removeNode(node: SinglyLinkedListNode<NodeVal>): SinglyLinkedListNode<NodeVal> {
        if (node.list !== this) {
            throw new ReferenceError('Node does not belong to this list');
        }

        if (node.prev !== null) {
            node.prev.next = node.next;
        }

        if (node.next !== null) {
            node.next.prev = node.prev;
        }

        if (this.head === node) {
            this.head = node.next;
        }

        if (this.tail === node) {
            this.tail = node.prev;
        }

        this.size -= 1;
        node.next = null;
        node.prev = null;
        node.list = null;
        return node;
    }

    /**
     * The `removeAt` function removes a node at a specified index from a singly linked list.
     * @param {number} index - The index parameter is a number that represents the position of the node to be removed in
     * the singly linked list.
     * @returns The method `removeAt` returns a `SinglyLinkedListNode<NodeVal>` if the node at the specified index is
     * found and removed successfully. If the node is not found, it returns `undefined`.
     */
    removeAt(index: number): SinglyLinkedListNode<NodeVal> | undefined {
        const node = this.getNode(index);
        return node !== undefined ? this.removeNode(node) : undefined;
    }

    /**
     * The `insertBefore` function inserts a new node with a given value before a specified reference node in a singly
     * linked list.
     * @param referenceNode - The referenceNode parameter is the node in the linked list before which the new node will be
     * inserted.
     * @param {NodeVal} val - The value of the new node that will be inserted before the reference node.
     * @returns The method is returning the updated SinglyLinkedList object.
     */
    insertBefore(
        referenceNode: SinglyLinkedListNode<NodeVal>,
        val: NodeVal,
    ): SinglyLinkedList<NodeVal> {
        const node = new SinglyLinkedListNode(val, referenceNode.prev, referenceNode, this);
        if (referenceNode.prev === null) {
            this.head = node;
        }
        if (referenceNode.prev !== null) {
            referenceNode.prev.next = node;
        }
        referenceNode.prev = node;
        this.size += 1;
        return this;
    }

    /**
     * The `sort` function uses the quicksort algorithm to sort the elements of a singly linked list based on a provided
     * comparison function.
     * @param start - The `start` parameter is the starting node of the sublist that needs to be sorted.
     * @param end - The `end` parameter is a reference to the last node in the linked list. It is used as the pivot element
     * for the quicksort algorithm.
     * @returns The `sort` method is returning the sorted `SinglyLinkedList` object.
     */
    sort(compare: (a: NodeVal, b: NodeVal) => boolean): SinglyLinkedList<NodeVal> {
        if (this.head === null || this.tail === null) {
            return this;
        }
        if (this.size < 2) {
            return this;
        }

        const quicksort = (
            start: SinglyLinkedListNode<NodeVal>,
            end: SinglyLinkedListNode<NodeVal>,
        ) => {
            if (start === end) {
                return;
            }
            const pivotData = end.val;
            let current: SinglyLinkedListNode | null = start;
            let split: SinglyLinkedListNode = start;
            while (current && current !== end) {
                const sort = compare(current.val, pivotData);
                if (sort) {
                    if (current !== split) {
                        const temp = split.val;
                        split.val = current.val;
                        current.val = temp;
                    }
                    // TODO after no-non-null-assertion not ensure the logic
                    if (split.next) {
                        split = split.next;
                    }
                }
                current = current.next;
            }
            end.val = split.val;
            split.val = pivotData;

            if (start.next === end.prev) {
                return;
            }

            if (split.prev && split !== start) {
                quicksort(start, split.prev);
            }
            if (split.next && split !== end) {
                quicksort(split.next, end);
            }
        };

        quicksort(this.head, this.tail);
        return this;
    }

    /**
     * The `insertAfter` function inserts a new node with a given value after a specified reference node in a singly linked
     * list.
     * @param referenceNode - The referenceNode parameter is the node after which the new node will be inserted.
     * @param {NodeVal} val - The value of the new node that will be inserted after the reference node.
     * @returns The `insertAfter` method is returning the updated `SinglyLinkedList` object.
     */
    insertAfter(
        referenceNode: SinglyLinkedListNode<NodeVal>,
        val: NodeVal,
    ): SinglyLinkedList<NodeVal> {
        const node = new SinglyLinkedListNode(val, referenceNode, referenceNode.next, this);
        if (referenceNode.next === null) {
            this.tail = node;
        }
        if (referenceNode.next !== null) {
            referenceNode.next.prev = node;
        }
        referenceNode.next = node;
        this.size += 1;
        return this;
    }

    /**
     * The `shift()` function removes and returns the first element from a linked list.
     * @returns The `shift()` method is returning a value of type `NodeVal` or `undefined`.
     */
    shift(): NodeVal | undefined {
        return this.removeFromAnyEnd(this.head);
    }

    /**
     * The `pop()` function removes and returns the last element from a linked list.
     * @returns The `pop()` method is returning a value of type `NodeVal` or `undefined`.
     */
    pop(): NodeVal | undefined {
        return this.removeFromAnyEnd(this.tail);
    }

    /**
     * The merge function merges two singly linked lists by updating the next and prev pointers, as well as the head, tail,
     * and size properties.
     * @param list - The parameter "list" is a SinglyLinkedList object that contains nodes with data of type NodeVal.
     */
    merge(list: SinglyLinkedList<NodeVal>): void {
        if (this.tail !== null) {
            this.tail.next = list.head;
        }
        if (list.head !== null) {
            list.head.prev = this.tail;
        }
        this.head = this.head || list.head;
        this.tail = list.tail || this.tail;
        this.size += list.size;
        list.size = this.size;
        list.head = this.head;
        list.tail = this.tail;
    }

    /**
     * The clear() function resets the linked list by setting the head and tail to null and the size to 0.
     * @returns The "this" object is being returned.
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        return this;
    }

    /**
     * The `slice` function returns a new SinglyLinkedList containing a portion of the original list, starting from the
     * specified index and ending at the optional end index.
     * @param {number} start - The `start` parameter is a number that represents the index at which to start slicing the
     * linked list.
     * @param {number} [end] - The `end` parameter is an optional number that specifies the index at which to end the
     * slicing. If no value is provided for `end`, or if the provided value is less than the `start` index, the slicing
     * will continue until the end of the list.
     * @returns a new SinglyLinkedList containing the sliced elements from the original list.
     */
    slice(start: number, end?: number): SinglyLinkedList<NodeVal | {}> {
        const list = new SinglyLinkedList();
        let finish = end;

        if (this.head === null || this.tail === null) {
            return list;
        }
        if (finish === undefined || finish < start) {
            finish = this.size;
        }

        let head: SinglyLinkedListNode<NodeVal> | null | undefined = this.getNode(start);
        for (let i = 0; i < finish - start && head !== null && head !== undefined; i++) {
            list.append(head.val);
            head = head.next;
        }
        return list;
    }

    /**
     * The reverse() function reverses the order of nodes in a singly linked list.
     * @returns The reverse() method is returning the reversed SinglyLinkedList.
     */
    reverse(): SinglyLinkedList<NodeVal> {
        let currentNode = this.head;
        while (currentNode) {
            const next = currentNode.next;
            currentNode.next = currentNode.prev;
            currentNode.prev = next;
            currentNode = currentNode.prev;
        }
        const tail = this.tail;
        this.tail = this.head;
        this.head = tail;
        return this;
    }

    /**
     * The `forEach` function iterates over a singly linked list and applies a callback function to each node, either in
     * forward or reverse order.
     * @param callbackFn - A callback function that will be called for each element in the linked list. It takes three
     * parameters:
     * @param [reverse=false] - A boolean value indicating whether to iterate over the linked list in reverse order. If set
     * to true, the iteration will start from the tail of the linked list and move towards the head. If set to false
     * (default), the iteration will start from the head and move towards the tail.
     */
    forEach(callbackFn: (
        data: any,
        index: number,
        list: SinglyLinkedList<NodeVal>,
    ) => any, reverse = false): void {
        let currentIndex = reverse ? this.size - 1 : 0;
        let currentNode = reverse ? this.tail : this.head;
        const modifier = reverse ? -1 : 1;
        const nextNode = reverse ? 'prev' : 'next';
        while (currentNode) {
            callbackFn(currentNode.val, currentIndex, this);
            currentNode = currentNode[nextNode];
            currentIndex += modifier;
        }
    }

    /**
     * The map function takes a callback function and applies it to each element in the linked list, returning a new linked
     * list with the results.
     * @param callbackFn - A callback function that will be applied to each element in the linked list. It takes three
     * parameters:
     * @param [reverse=false] - The `reverse` parameter is a boolean value that determines whether the mapping should be
     * done in reverse order or not. If `reverse` is set to `true`, the mapping will be done in reverse order. If `reverse`
     * is set to `false` or not provided, the mapping will be
     * @returns The `map` function is returning a new `SinglyLinkedList` object.
     */
    map(callbackFn: (
        data: any,
        index: number,
        list: SinglyLinkedList<NodeVal>,
    ) => any, reverse = false): SinglyLinkedList<NodeVal | {}> {
        const list = new SinglyLinkedList();
        this.forEach((val, index) => list.append(callbackFn(val, index, this)), reverse);
        return list;
    }

    /**
     * The `filter` function filters the elements of a singly linked list based on a given callback function.
     * @param callbackFn - A callback function that takes three parameters: data, index, and list. It should return a
     * boolean value indicating whether the current element should be included in the filtered list or not.
     * @param [reverse=false] - The `reverse` parameter is a boolean value that determines whether the filtered list should
     * be reversed or not. If `reverse` is set to `true`, the filtered list will be in reverse order. If `reverse` is set
     * to `false` or not provided, the filtered list will be in
     * @returns The `filter` method is returning a new `SinglyLinkedList` object.
     */
    filter(callbackFn: (
        data: NodeVal,
        index: number,
        list: SinglyLinkedList<NodeVal>,
    ) => boolean, reverse = false): SinglyLinkedList<NodeVal | {}> {
        const list = new SinglyLinkedList();
        this.forEach((val, index) => {
            if (callbackFn(val, index, this)) {
                list.append(val);
            }
        }, reverse);
        return list;
    }

    /**
     * The `reduce` function iterates over a singly linked list and applies a callback function to each element,
     * accumulating a single value.
     * @param callbackFn - A callback function that will be called for each element in the linked list. It takes four
     * parameters:
     * @param {any} [start] - The `start` parameter is an optional initial value for the accumulator. If provided, the
     * `reduce` function will start accumulating from this value. If not provided, the `reduce` function will use the value
     * of the first element in the linked list as the initial value.
     * @param [reverse=false] - A boolean value indicating whether to iterate over the linked list in reverse order. If set
     * to true, the iteration will start from the tail of the linked list and move towards the head. If set to false
     * (default), the iteration will start from the head and move towards the tail.
     * @returns The `reduce` method returns the accumulated value after applying the callback function to each element in
     * the linked list.
     */
    reduce(
        callbackFn: (
            accumulator: any,
            currentNode: NodeVal,
            index: number,
            list: SinglyLinkedList<NodeVal>,
        ) => any,
        start?: any,
        reverse = false,
    ): any {
        let currentIndex = reverse ? this.size - 1 : 0;
        const modifier = reverse ? -1 : 1;
        const nextNode = reverse ? 'prev' : 'next';
        let currentElement = reverse ? this.tail : this.head;
        let result;

        if (start !== undefined) {
            result = start;
        } else if (currentElement) {
            result = currentElement.val;
            currentElement = currentElement[nextNode];
        } else {
            throw new TypeError('Reduce of empty LinkedList with no initial value');
        }

        while (currentElement) {
            result = callbackFn(result, currentElement.val, currentIndex, this);
            currentIndex += modifier;
            currentElement = currentElement[nextNode];
        }

        return result;
    }

    /**
     * The toArray() function converts a NodeVal object into an array of NodeVal objects.
     * @returns An array of NodeVal objects.
     */
    toArray(): NodeVal[] {
        return [...this];
    }

    /**
     * The `toString` function takes an optional separator and returns a string representation of an array, with each
     * element separated by the specified separator.
     * @param [separator= ] - The separator parameter is a string that specifies the character(s) to be used as a separator
     * between each element in the array when converting it to a string. By default, the separator is set to a space
     * character (' ').
     * @returns The toString method is being returned as a string.
     */
    toString(separator = ' '): string {
        return this.reduce((s, val) => `${s}${separator}${val}`);
    }

    /**
     * The function is an iterator that returns the values of each node in a linked list.
     */
    public* [Symbol.iterator](): IterableIterator<NodeVal> {
        let element = this.head;

        while (element !== null) {
            yield element.val;
            element = element.next;
        }
    }

    /**
     * The function removes a node from either end of a singly linked list and returns its value.
     * @param {SinglyLinkedListNode<NodeVal> | null} node - The `node` parameter is a reference to a node in a singly
     * linked list. It can be either a `SinglyLinkedListNode` object or `null`.
     * @returns The value of the removed node if the node is not null, otherwise undefined.
     */
    protected removeFromAnyEnd(node: SinglyLinkedListNode<NodeVal> | null) {
        return node !== null ? this.removeNode(node).val : undefined;
    }
}
