/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
export class DoublyLinkedListNode<E = any> {
  /**
   * The constructor function initializes the value, next, and previous properties of an object.
   * @param {E} val - The "val" parameter is the value that will be stored in the node. It can be of any data type, as it
   * is defined as a generic type "E".
   */
  constructor(val: E) {
    this._val = val;
    this._next = null;
    this._prev = null;
  }

  private _val: E;

  get val(): E {
    return this._val;
  }

  set val(value: E) {
    this._val = value;
  }

  private _next: DoublyLinkedListNode<E> | null;

  get next(): DoublyLinkedListNode<E> | null {
    return this._next;
  }

  set next(value: DoublyLinkedListNode<E> | null) {
    this._next = value;
  }

  private _prev: DoublyLinkedListNode<E> | null;

  get prev(): DoublyLinkedListNode<E> | null {
    return this._prev;
  }

  set prev(value: DoublyLinkedListNode<E> | null) {
    this._prev = value;
  }
}

export class DoublyLinkedList<E = any> {
  /**
   * The constructor initializes the linked list with an empty head, tail, and length.
   */
  constructor() {
    this._head = null;
    this._tail = null;
    this._length = 0;
  }

  private _head: DoublyLinkedListNode<E> | null;

  get head(): DoublyLinkedListNode<E> | null {
    return this._head;
  }

  set head(value: DoublyLinkedListNode<E> | null) {
    this._head = value;
  }

  private _tail: DoublyLinkedListNode<E> | null;

  get tail(): DoublyLinkedListNode<E> | null {
    return this._tail;
  }

  set tail(value: DoublyLinkedListNode<E> | null) {
    this._tail = value;
  }

  private _length: number;

  get length(): number {
    return this._length;
  }

  /**
   * The `fromArray` function creates a new instance of a DoublyLinkedList and populates it with the elements from the
   * given array.
   * @param {E[]} data - The `data` parameter is an array of elements of type `E`.
   * @returns The `fromArray` function returns a DoublyLinkedList object.
   */
  static fromArray<E>(data: E[]) {
    const doublyLinkedList = new DoublyLinkedList<E>();
    for (const item of data) {
      doublyLinkedList.push(item);
    }
    return doublyLinkedList;
  }

  /**
   * The push function adds a new node with the given value to the end of the doubly linked list.
   * @param {E} val - The value to be added to the linked list.
   */
  push(val: E): void {
    const newNode = new DoublyLinkedListNode(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this._length++;
  }

  /**
   * The addLast function adds a new node with the given value to the end of the doubly linked list.
   * @param {E} val - The value to be added to the linked list.
   */
  addLast(val: E): void {
    this.push(val);
  }

  /**
   * The `pop()` function removes and returns the value of the last node in a doubly linked list.
   * @returns The method is returning the value of the removed node (removedNode.val) if the list is not empty. If the
   * list is empty, it returns null.
   */
  pop(): E | undefined {
    if (!this.tail) return undefined;
    const removedNode = this.tail;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = removedNode.prev;
      this.tail!.next = null;
    }
    this._length--;
    return removedNode.val;
  }

  /**
   * The `pollLast()` function removes and returns the value of the last node in a doubly linked list.
   * @returns The method is returning the value of the removed node (removedNode.val) if the list is not empty. If the
   * list is empty, it returns null.
   */
  pollLast(): E | undefined {
    return this.pop();
  }

  /**
   * The `shift()` function removes and returns the value of the first node in a doubly linked list.
   * @returns The method `shift()` returns the value of the node that is removed from the beginning of the doubly linked
   * list.
   */
  shift(): E | undefined {
    if (!this.head) return undefined;
    const removedNode = this.head;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = removedNode.next;
      this.head!.prev = null;
    }
    this._length--;
    return removedNode.val;
  }

  /**
   * The `pollFirst()` function removes and returns the value of the first node in a doubly linked list.
   * @returns The method `shift()` returns the value of the node that is removed from the beginning of the doubly linked
   * list.
   */
  pollFirst(): E | undefined {
    return this.shift();
  }

  /**
   * The unshift function adds a new node with the given value to the beginning of a doubly linked list.
   * @param {E} val - The `val` parameter represents the value of the new node that will be added to the beginning of the
   * doubly linked list.
   */
  unshift(val: E): void {
    const newNode = new DoublyLinkedListNode(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.head = newNode;
    }
    this._length++;
  }

  /**
   * The addFirst function adds a new node with the given value to the beginning of a doubly linked list.
   * @param {E} val - The `val` parameter represents the value of the new node that will be added to the beginning of the
   * doubly linked list.
   */
  addFirst(val: E): void {
    this.unshift(val);
  }

  /**
   * The `peekFirst` function returns the first node in a doubly linked list, or null if the list is empty.
   * @returns The method `peekFirst()` returns the first node of the doubly linked list, or `null` if the list is empty.
   */
  peekFirst(): E | undefined {
    return this.head?.val;
  }

  /**
   * The `peekLast` function returns the last node in a doubly linked list, or null if the list is empty.
   * @returns The method `peekLast()` returns the last node of the doubly linked list, or `null` if the list is empty.
   */
  peekLast(): E | undefined {
    return this.tail?.val;
  }

  get size(): number {
    return this.length;
  }

  /**
   * The `getAt` function returns the value at a specified index in a linked list, or null if the index is out of bounds.
   * @param {number} index - The index parameter is a number that represents the position of the element we want to
   * retrieve from the list.
   * @returns The method is returning the value at the specified index in the linked list. If the index is out of bounds
   * or the linked list is empty, it will return null.
   */
  getAt(index: number): E | undefined {
    if (index < 0 || index >= this.length) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current!.val;
  }

  /**
   * The function `getNodeAt` returns the node at a given index in a doubly linked list, or null if the index is out of
   * range.
   * @param {number} index - The `index` parameter is a number that represents the position of the node we want to
   * retrieve from the doubly linked list. It indicates the zero-based index of the node we want to access.
   * @returns The method `getNodeAt(index: number)` returns a `DoublyLinkedListNode<E>` object if the index is within the
   * valid range of the linked list, otherwise it returns `null`.
   */
  getNodeAt(index: number): DoublyLinkedListNode<E> | null {
    if (index < 0 || index >= this.length) return null;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current;
  }

  /**
   * The function `findNodeByValue` searches for a node with a specific value in a doubly linked list and returns the
   * node if found, otherwise it returns null.
   * @param {E} val - The `val` parameter is the value that we want to search for in the doubly linked list.
   * @returns The function `findNodeByValue` returns a `DoublyLinkedListNode<E>` if a node with the specified value `val`
   * is found in the linked list. If no such node is found, it returns `null`.
   */
  findNode(val: E): DoublyLinkedListNode<E> | null {
    let current = this.head;

    while (current) {
      if (current.val === val) {
        return current;
      }
      current = current.next;
    }

    return null;
  }

  /**
   * The `insert` function inserts a value at a specified index in a doubly linked list.
   * @param {number} index - The index parameter represents the position at which the new value should be inserted in the
   * DoublyLinkedList. It is of type number.
   * @param {E} val - The `val` parameter represents the value that you want to insert into the Doubly Linked List at the
   * specified index.
   * @returns The `insert` method returns a boolean value. It returns `true` if the insertion is successful, and `false`
   * if the index is out of bounds.
   */
  insertAt(index: number, val: E): boolean {
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
    this._length++;
    return true;
  }

  /**
   * The `deleteAt` function removes an element at a specified index from a linked list and returns the removed element.
   * @param {number} index - The index parameter represents the position of the element that needs to be deleted in the
   * data structure. It is of type number.
   * @returns The method `deleteAt` returns the value of the node that was deleted, or `null` if the index is out of
   * bounds.
   */
  deleteAt(index: number): E | undefined {
    if (index < 0 || index >= this.length) return undefined;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();

    const removedNode = this.getNodeAt(index);
    const prevNode = removedNode!.prev;
    const nextNode = removedNode!.next;
    prevNode!.next = nextNode;
    nextNode!.prev = prevNode;
    this._length--;
    return removedNode!.val;
  }

  delete(valOrNode: E): boolean;
  delete(valOrNode: DoublyLinkedListNode<E>): boolean;

  /**
   * The `delete` function removes a node from a doubly linked list based on either the node itself or its value.
   * @param {E | DoublyLinkedListNode<E>} valOrNode - The `valOrNode` parameter can accept either a value of type `E` or
   * a `DoublyLinkedListNode<E>` object.
   * @returns The `delete` method returns a boolean value. It returns `true` if the value or node was successfully
   * deleted from the doubly linked list, and `false` if the value or node was not found in the list.
   */
  delete(valOrNode: E | DoublyLinkedListNode<E>): boolean {
    let node: DoublyLinkedListNode<E> | null;

    if (valOrNode instanceof DoublyLinkedListNode) {
      node = valOrNode;
    } else {
      node = this.findNode(valOrNode);
    }

    if (node) {
      if (node === this.head) {
        this.shift();
      } else if (node === this.tail) {
        this.pop();
      } else {
        const prevNode = node.prev;
        const nextNode = node.next;
        prevNode!.next = nextNode;
        nextNode!.prev = prevNode;
        this._length--;
      }
      return true;
    }
    return false;
  }

  /**
   * The `toArray` function converts a linked list into an array.
   * @returns The `toArray()` method is returning an array of type `E[]`.
   */
  toArray(): E[] {
    const array: E[] = [];
    let current = this.head;
    while (current) {
      array.push(current.val);
      current = current.next;
    }
    return array;
  }

  /**
   * The function checks if a variable has a length greater than zero and returns a boolean value.
   * @returns A boolean value is being returned.
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * The `clear` function resets the linked list by setting the head, tail, and length to null and 0 respectively.
   */
  clear(): void {
    this._head = null;
    this._tail = null;
    this._length = 0;
  }

  /**
   * The `find` function iterates through a linked list and returns the first element that satisfies a given condition.
   * @param callback - A function that takes a value of type E as its parameter and returns a boolean value. This
   * function is used to determine whether a particular value in the linked list satisfies a certain condition.
   * @returns The method `find` returns the first element in the linked list that satisfies the condition specified by
   * the callback function. If no element satisfies the condition, it returns `null`.
   */
  find(callback: (val: E) => boolean): E | null {
    let current = this.head;
    while (current) {
      if (callback(current.val)) {
        return current.val;
      }
      current = current.next;
    }
    return null;
  }

  /**
   * The function returns the index of the first occurrence of a given value in a linked list.
   * @param {E} val - The parameter `val` is of type `E`, which means it can be any data type. It represents the value
   * that we are searching for in the linked list.
   * @returns The method `indexOf` returns the index of the first occurrence of the specified value `val` in the linked
   * list. If the value is not found, it returns -1.
   */
  indexOf(val: E): number {
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

  /**
   * The `findLast` function iterates through a linked list from the last node to the first node and returns the last
   * value that satisfies the given callback function, or null if no value satisfies the callback.
   * @param callback - A function that takes a value of type E as its parameter and returns a boolean value. This
   * function is used to determine whether a given value satisfies a certain condition.
   * @returns The method `findLast` returns the last value in the linked list that satisfies the condition specified by
   * the callback function. If no value satisfies the condition, it returns `null`.
   */
  findLast(callback: (val: E) => boolean): E | null {
    let current = this.tail;
    while (current) {
      if (callback(current.val)) {
        return current.val;
      }
      current = current.prev;
    }
    return null;
  }

  /**
   * The `toArrayReverse` function converts a doubly linked list into an array in reverse order.
   * @returns The `toArrayReverse()` function returns an array of type `E[]`.
   */
  toArrayReverse(): E[] {
    const array: E[] = [];
    let current = this.tail;
    while (current) {
      array.push(current.val);
      current = current.prev;
    }
    return array;
  }

  /**
   * The `reverse` function reverses the order of the elements in a doubly linked list.
   */
  reverse(): void {
    let current = this.head;
    [this.head, this.tail] = [this.tail, this.head];
    while (current) {
      const next = current.next;
      [current.prev, current.next] = [current.next, current.prev];
      current = next;
    }
  }

  /**
   * The `forEach` function iterates over each element in a linked list and applies a callback function to each element.
   * @param callback - The callback parameter is a function that takes two arguments: val and index. The val argument
   * represents the value of the current node in the linked list, and the index argument represents the index of the
   * current node in the linked list.
   */
  forEach(callback: (val: E, index: number) => void): void {
    let current = this.head;
    let index = 0;
    while (current) {
      callback(current.val, index);
      current = current.next;
      index++;
    }
  }

  /**
   * The `map` function takes a callback function and applies it to each element in the DoublyLinkedList, returning a new
   * DoublyLinkedList with the transformed values.
   * @param callback - The callback parameter is a function that takes a value of type E (the type of values stored in
   * the original DoublyLinkedList) and returns a value of type U (the type of values that will be stored in the mapped
   * DoublyLinkedList).
   * @returns The `map` function is returning a new instance of `DoublyLinkedList<U>` that contains the mapped values.
   */
  map<U>(callback: (val: E) => U): DoublyLinkedList<U> {
    const mappedList = new DoublyLinkedList<U>();
    let current = this.head;
    while (current) {
      mappedList.push(callback(current.val));
      current = current.next;
    }
    return mappedList;
  }

  /**
   * The `filter` function iterates through a DoublyLinkedList and returns a new DoublyLinkedList containing only the
   * elements that satisfy the given callback function.
   * @param callback - The `callback` parameter is a function that takes a value of type `E` and returns a boolean value.
   * It is used to determine whether a value should be included in the filtered list or not.
   * @returns The filtered list, which is an instance of the DoublyLinkedList class.
   */
  filter(callback: (val: E) => boolean): DoublyLinkedList<E> {
    const filteredList = new DoublyLinkedList<E>();
    let current = this.head;
    while (current) {
      if (callback(current.val)) {
        filteredList.push(current.val);
      }
      current = current.next;
    }
    return filteredList;
  }

  /**
   * The `reduce` function iterates over a linked list and applies a callback function to each element, accumulating a
   * single value.
   * @param callback - The `callback` parameter is a function that takes two arguments: `accumulator` and `val`. It is
   * used to perform a specific operation on each element of the linked list.
   * @param {U} initialValue - The `initialValue` parameter is the initial value of the accumulator. It is the starting
   * point for the reduction operation.
   * @returns The `reduce` method is returning the final value of the accumulator after iterating through all the
   * elements in the linked list.
   */
  reduce<U>(callback: (accumulator: U, val: E) => U, initialValue: U): U {
    let accumulator = initialValue;
    let current = this.head;
    while (current) {
      accumulator = callback(accumulator, current.val);
      current = current.next;
    }
    return accumulator;
  }

  insertAfter(existingValueOrNode: E, newValue: E): boolean;
  insertAfter(existingValueOrNode: DoublyLinkedListNode<E>, newValue: E): boolean;

  /**
   * The `insertAfter` function inserts a new node with a given value after an existing node in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} existingValueOrNode - The existing value or node in the doubly linked list
   * after which the new value will be inserted. It can be either the value of the existing node or the existing node
   * itself.
   * @param {E} newValue - The value that you want to insert into the doubly linked list.
   * @returns The method returns a boolean value. It returns true if the insertion is successful, and false if the
   * existing value or node is not found in the doubly linked list.
   */
  insertAfter(existingValueOrNode: E | DoublyLinkedListNode<E>, newValue: E): boolean {
    let existingNode;

    if (existingValueOrNode instanceof DoublyLinkedListNode) {
      existingNode = existingValueOrNode;
    } else {
      existingNode = this.findNode(existingValueOrNode);
    }

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
      this._length++;
      return true;
    }

    return false;
  }

  insertBefore(existingValueOrNode: E, newValue: E): boolean;
  insertBefore(existingValueOrNode: DoublyLinkedListNode<E>, newValue: E): boolean;

  /**
   * The `insertBefore` function inserts a new value before an existing value or node in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} existingValueOrNode - The existing value or node in the doubly linked list
   * before which the new value will be inserted. It can be either the value of the existing node or the existing node
   * itself.
   * @param {E} newValue - The `newValue` parameter represents the value that you want to insert into the doubly linked
   * list.
   * @returns The method returns a boolean value. It returns `true` if the insertion is successful, and `false` if the
   * insertion fails.
   */
  insertBefore(existingValueOrNode: E | DoublyLinkedListNode<E>, newValue: E): boolean {
    let existingNode;

    if (existingValueOrNode instanceof DoublyLinkedListNode) {
      existingNode = existingValueOrNode;
    } else {
      existingNode = this.findNode(existingValueOrNode);
    }

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
      this._length++;
      return true;
    }

    return false;
  }
}
