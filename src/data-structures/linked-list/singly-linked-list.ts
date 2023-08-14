/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */

/**
 * The class which represents one link or node in a linked list
 * ```ts
 * const node = new SinglyLinkedListNode(1, null, null, null);
 * ```
 */
export class SinglyLinkedListNode<NodeData = any> {
    constructor(
        /** Data stored on the node */
        public val: NodeData,
        /** The previous node in the list */
        public prev: SinglyLinkedListNode<NodeData> | null,
        /** The next link in the list */
        public next: SinglyLinkedListNode<NodeData> | null,
        /** The list this node belongs to */
        public list: SinglyLinkedList<NodeData> | null,
    ) {
    }

    /**
     * Alias to .val
     * ```ts
     * new LinkedList(1, 2, 3).head.value; // 1
     * ```
     */
    public get value() {
        return this.val;
    }

    /**
     * Get the index of this node
     * ```ts
     * new LinkedList(1, 2, 3).head.index; // 0
     * ```
     */
    public get index() {
        if (!this.list) {
            return undefined;
        }
        return this.list.findIndex((value) => value === this.value);
    }

    /**
     * Insert a new node before this one
     * ```ts
     * new LinkedList(2, 3).head.insertBefore(1); // 1 <=> 2 <=> 3
     * ```
     * @param val Data to save in the node
     */
    public insertBefore(val: NodeData): SinglyLinkedList<NodeData> {
        return this.list !== null
            ? this.list.insertBefore(this, val)
            : new SinglyLinkedList(val, this.val);
    }

    /**
     * Insert new val after this node
     * ```ts
     * new LinkedList(1, 2).tail.insertAfter(3); // 1 <=> 2 <=> 3
     * ```
     * @param val Data to be saved in the node
     */
    public insertAfter(val: NodeData): SinglyLinkedList<NodeData> {
        return this.list !== null
            ? this.list.insertAfter(this, val)
            : new SinglyLinkedList(this.val, val);
    }

    /**
     * Remove this node
     * ```ts
     * new LinkedList(1, 2, 3, 4).tail.remove(); // 1 <=> 2 <=> 3
     * ```
     */
    public remove(): SinglyLinkedListNode<NodeData> {
        if (this.list === null) {
            throw new ReferenceError('Node does not belong to any list');
        }
        return this.list.removeNode(this);
    }
}


/**
 * A doubly linked list
 * ```ts
 * const list = new LinkedList(1, 2, 3);
 * const listFromArray = LinkedList.from([1, 2, 3]);
 * ```
 */
export class SinglyLinkedList<NodeData = any> {

    /** The head of the list, the first node */
    public head: SinglyLinkedListNode<NodeData> | null;
    /** The tail of the list, the last node */
    public tail: SinglyLinkedListNode<NodeData> | null;
    /** Internal size reference */
    private size: number;

    constructor(...args: NodeData[]) {
        this.head = null;
        this.tail = null;
        this.size = 0;

        for (let i = 0; i < arguments.length; i++) {
            this.append(args[i]);
        }
    }

    /**
     * The length of the list
     */
    public get length(): number {
        return this.size;
    }

    /**
     * Convert any iterable to a new linked list
     * ```javascript
     * const array = [1, 2, 3];
     * const list = LinkedList.from(array);
     * ```
     * @param iterable Any iterable datatype like Array or Map
     */
    public static from<T>(iterable: Iterable<T>): SinglyLinkedList<T> {
        return new SinglyLinkedList(...iterable);
    }

    /**
     * Get the node val at a specified index, zero based
     * ```ts
     * new LinkedList(1, 2, 3).get(0); // 1
     * ```
     * @param index to retrieve val at
     */
    public get(index: number): NodeData | undefined {
        const node = this.getNode(index);
        return node !== undefined ? node.val : undefined;
    }

    /**
     * Get the node at index, zero based
     * ```ts
     * new LinkedList(1, 2, 3).getNode(0);
     * // { prev: null, val: 1, next: SinglyLinkedListNode }
     * ```
     */
    public getNode(index: number): SinglyLinkedListNode<NodeData> | undefined {
        if (this.head === null || index < 0 || index >= this.length) {
            return undefined;
        }
        const asc = index < this.length / 2;
        const stopAt = asc ? index : this.length - index - 1;
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
     * Return the first node and its index in the list that
     * satisfies the testing function
     * ```ts
     * new LinkedList(1, 2, 3).findNodeIndex(val => val === 1);
     * // { node: SinglyLinkedListNode, index: 0 }
     * ```
     * @param f A function to be applied to the val of each node
     */
    public findNodeIndex(f: (
        data: NodeData,
        index: number,
        list: SinglyLinkedList<NodeData>,
    ) => boolean): ({
        node: SinglyLinkedListNode<NodeData>,
        index: number,
    }) | undefined {
        let currentIndex = 0;
        let currentNode = this.head;
        while (currentNode) {
            if (f(currentNode.val, currentIndex, this)) {
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
     * Returns the first node in the list that
     * satisfies the provided testing function. Otherwise undefined is returned.
     * ```ts
     * new LinkedList(1, 2, 3).findNode(val => val === 1);
     * // { prev: null, val: 1, next: SinglyLinkedListNode }
     * ```
     * @param f Function to test val against
     */
    public findNode(f: (
        data: NodeData,
        index: number,
        list: SinglyLinkedList<NodeData>,
    ) => boolean): SinglyLinkedListNode<NodeData> | undefined {
        const nodeIndex = this.findNodeIndex(f);
        return nodeIndex !== undefined ? nodeIndex.node : undefined;
    }

    /**
     * Returns the value of the first element in the list that
     * satisfies the provided testing function. Otherwise undefined is returned.
     * ```ts
     * new LinkedList(1, 2, 3).find(val => val === 1); // 1
     * ```
     * @param f Function to test val against
     */
    public find(f: (
        data: NodeData,
        index: number,
        list: SinglyLinkedList<NodeData>,
    ) => boolean): NodeData | undefined {
        const nodeIndex = this.findNodeIndex(f);
        return nodeIndex !== undefined ? nodeIndex.node.val : undefined;
    }

    /**
     * Returns the index of the first node in the list that
     * satisfies the provided testing function. Ohterwise -1 is returned.
     * ```ts
     * new LinkedList(1, 2, 3).findIndex(val => val === 3); // 2
     * ```
     * @param f Function to test val against
     */
    public findIndex(f: (
        data: NodeData,
        index: number,
        list: SinglyLinkedList<NodeData>,
    ) => boolean): number {
        const nodeIndex = this.findNodeIndex(f);
        return nodeIndex !== undefined ? nodeIndex.index : -1;
    }

    /**
     * Append one or any number of nodes to the end of the list.
     * This modifies the list in place and returns the list itself
     * to make this method chainable.
     * ```ts
     * new LinkedList(1).append(2).append(3, 4); // 1 <=> 2 <=> 3 <=> 4
     * ```
     * @param args Data to be stored in the node, takes any number of arguments
     */
    public append(...args: NodeData[]): SinglyLinkedList<NodeData> {
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
     * Synonym for append
     * ```ts
     * new LinkedList(1).push(2).push(3, 4); // 1 <=> 2 <=> 3 <=> 4
     * ```
     * @param args Data to be stored, takes any number of arguments
     */
    public push(...args: NodeData[]): number {
        this.append(...args);
        return this.length;
    }

    /**
     * Prepend any number of val arguments to the list. The
     * argument list is prepended as a block to reduce confusion:
     * ```javascript
     * new LinkedList(3, 4).prepend(0, 1, 2); // [0, 1, 2, 3, 4]
     * ```
     * @param args Data to be stored in the node, accepts any number of arguments
     */
    public prepend(...args: NodeData[]): SinglyLinkedList<NodeData> {
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
     * Insert a new node at a given index position. If index is
     * out of bounds, the node is appended, if index is negative
     * or 0, it will be prepended.
     * ```ts
     * new LinkedList(1, 3).insertAt(1, 2); // 1 <=> 2 <=> 3
     * ```
     * @param index The index to insert the new node at
     * @param val Data to be stored on the new node
     */
    public insertAt(index: number, val: NodeData): SinglyLinkedList<NodeData> {
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
     * Remove the specified node from the list and return the removed
     * node afterwards.
     * ```ts
     * const list = new LinkedList(1, 2, 3);
     * list.removeNode(list.tail); // { prev: null, val: 3, next: null, list: null }
     * ```
     * @param node The node to be removed
     */
    public removeNode(node: SinglyLinkedListNode<NodeData>): SinglyLinkedListNode<NodeData> {
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
     * Remove the node at the specified index
     * ```ts
     * new LinkedList(1, 2, 3).removeAt(2); // { prev: null, val: 3, next: null, list: null }
     * ```
     * @param index Index at which to remove
     */
    public removeAt(index: number): SinglyLinkedListNode<NodeData> | undefined {
        const node = this.getNode(index);
        return node !== undefined ? this.removeNode(node) : undefined;
    }

    /**
     * Insert a new node before the reference node
     * ```ts
     * const list = new LinkedList(1, 3);
     * list.insertBefore(list.tail, 2); // 1 <=> 2 <=> 3
     * ```
     * @param referenceNode The node reference
     * @param val Data to save in the node
     */
    public insertBefore(
        referenceNode: SinglyLinkedListNode<NodeData>,
        val: NodeData,
    ): SinglyLinkedList<NodeData> {
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
     * Sorts the linked list using the provided compare function
     * @param compare A function used to compare the val of two nodes. It should return
     *                a boolean. True will insert a before b, false will insert b before a.
     *                (a, b) => a < b or (1, 2) => 1 < 2 === true, 2 will be inserted after 1,
     *                the sort order will be ascending.
     */
    public sort(compare: (a: NodeData, b: NodeData) => boolean): SinglyLinkedList<NodeData> {
        if (this.head === null || this.tail === null) {
            return this;
        }
        if (this.length < 2) {
            return this;
        }

        const quicksort = (
            start: SinglyLinkedListNode<NodeData>,
            end: SinglyLinkedListNode<NodeData>,
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
     * Insert a new node after this one
     * ```ts
     * const list = new LinkedList(2, 3);
     * list.insertAfter(list.head, 1); // 1 <=> 2 <=> 3
     * ```
     * @param referenceNode The reference node
     * @param val Data to be saved in the node
     */
    public insertAfter(
        referenceNode: SinglyLinkedListNode<NodeData>,
        val: NodeData,
    ): SinglyLinkedList<NodeData> {
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
     * Remove the first node from the list and return the val of the removed node
     * or undefined
     * ```ts
     * new LinkedList(1, 2, 3).shift(); // 1
     * ```
     */
    public shift(): NodeData | undefined {
        return this.removeFromAnyEnd(this.head);
    }

    /**
     * Remove the last node from the list and return the val of the removed node
     * or undefined if the list was empty
     * ```ts
     * new LinkedList(1, 2, 3).pop(); // 3
     * ```
     */
    public pop(): NodeData | undefined {
        return this.removeFromAnyEnd(this.tail);
    }

    /**
     * Merge the current list with another. Both lists will be
     * equal after merging.
     * ```ts
     * const list = new LinkedList(1, 2);
     * const otherList = new LinkedList(3);
     * list.merge(otherList);
     * (list === otherList); // true
     * ```
     * @param list The list to be merged
     */
    public merge(list: SinglyLinkedList<NodeData>): void {
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
     * Removes all nodes from a list
     *
     * ```ts
     * list.clear();
     * ```
     */
    public clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        return this;
    }

    /**
     * The slice() method returns a shallow copy of a
     * portion of a list into a new list object selected
     * from start to end (end not included).
     * The original list will not be modified.
     * ```ts
     * const list = new LinkedList(1, 2, 3, 4, 5);
     * const newList = list.slice(0, 3); // 1 <=> 2 <=> 3
     * ```
     * @param start Start index
     * @param end End index, optional
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public slice(start: number, end?: number): SinglyLinkedList<NodeData | {}> {
        const list = new SinglyLinkedList();
        let finish = end;

        if (this.head === null || this.tail === null) {
            return list;
        }
        if (finish === undefined || finish < start) {
            finish = this.length;
        }

        let head: SinglyLinkedListNode<NodeData> | null | undefined = this.getNode(start);
        for (let i = 0; i < finish - start && head !== null && head !== undefined; i++) {
            list.append(head.val);
            head = head.next;
        }
        return list;
    }

    /**
     * The reverse() function reverses the list in place and returns the list
     * itself.
     * ```ts
     * new LinkedList(1, 2, 3).reverse(); // 3 <=> 2 <=> 1
     * ```
     */
    public reverse(): SinglyLinkedList<NodeData> {
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
     * The forEach() method executes a provided function once for each list node.
     * ```ts
     * new LinkedList(1, 2, 3).forEach(val => log(val)); // 1 2 3
     * ```
     * @param f Function to execute for each element, taking up to three arguments.
     * @param reverse Indicates if the list should be walked in reverse order, default is false
     */
    public forEach(f: (
        data: any,
        index: number,
        list: SinglyLinkedList<NodeData>,
    ) => any, reverse = false): void {
        let currentIndex = reverse ? this.length - 1 : 0;
        let currentNode = reverse ? this.tail : this.head;
        const modifier = reverse ? -1 : 1;
        const nextNode = reverse ? 'prev' : 'next';
        while (currentNode) {
            f(currentNode.val, currentIndex, this);
            currentNode = currentNode[nextNode];
            currentIndex += modifier;
        }
    }

    /**
     * The map() method creates a new list with the results of
     * calling a provided function on every node in the calling list.
     * ```ts
     * new LinkedList(1, 2, 3).map(val => val + 10); // 11 <=> 12 <=> 13
     * ```
     * @param f Function that produces an node of the new list, taking up to three arguments
     * @param reverse Indicates if the list should be mapped in reverse order, default is false
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public map(f: (
        data: any,
        index: number,
        list: SinglyLinkedList<NodeData>,
    ) => any, reverse = false): SinglyLinkedList<NodeData | {}> {
        const list = new SinglyLinkedList();
        this.forEach((val, index) => list.append(f(val, index, this)), reverse);
        return list;
    }

    /**
     * The filter() method creates a new list with all nodes
     * that pass the test implemented by the provided function.
     * ```ts
     * new LinkedList(1, 2, 3, 4, 5).filter(val => val < 4); // 1 <=> 2 <=> 3
     * ```
     * @param f Function to test each node val in the list. Return true to keep the node
     * @param reverse Indicates if the list should be filtered in reverse order, default is false
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public filter(f: (
        data: NodeData,
        index: number,
        list: SinglyLinkedList<NodeData>,
    ) => boolean, reverse = false): SinglyLinkedList<NodeData | {}> {
        const list = new SinglyLinkedList();
        this.forEach((val, index) => {
            if (f(val, index, this)) {
                list.append(val);
            }
        }, reverse);
        return list;
    }

    /**
     * Reduce over each node in the list
     * ```ts
     * new LinkedList(1, 2, 3).reduce(n => n += 1, 0); // 3
     * ```
     * @param f A reducer function
     * @param start An initial value
     * @returns The final state of the accumulator
     */
    public reduce(
        f: (
            accumulator: any,
            currentNode: NodeData,
            index: number,
            list: SinglyLinkedList<NodeData>,
        ) => any,
        start?: any,
        reverse = false,
    ): any {
        let currentIndex = reverse ? this.length - 1 : 0;
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
            result = f(result, currentElement.val, currentIndex, this);
            currentIndex += modifier;
            currentElement = currentElement[nextNode];
        }

        return result;
    }

    /**
     * Convert the linked list to an array
     * ```ts
     * new LinkedList(1, 2, 3).toArray(); // [1, 2, 3]
     * ```
     */
    public toArray(): NodeData[] {
        return [...this];
    }

    /**
     * Convert a linked list to string
     * ```ts
     * new LinkedList('one', 'two', 'three').toString(' <=> ') === 'one <=> two <=> three';
     * ```
     * @param separator Optional string to be placed in between val nodes, default is one space
     */
    public toString(separator = ' '): string {
        return this.reduce((s, val) => `${s}${separator}${val}`);
    }

    /**
     * The iterator implementation
     * ```ts
     * const list = new LinkedList(1, 2, 3);
     * for (const val of list) { log(val); } // 1 2 3
     * ```
     */
    public* [Symbol.iterator](): IterableIterator<NodeData> {
        let element = this.head;

        while (element !== null) {
            yield element.val;
            element = element.next;
        }
    }

    /** Private helper function to reduce duplication of pop() and shift() methods */
    private removeFromAnyEnd(node: SinglyLinkedListNode<NodeData> | null) {
        return node !== null ? this.removeNode(node).val : undefined;
    }
}
