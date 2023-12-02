import { IterableElementBase } from "../base";
import { ElementCallback } from "../../types";

/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
export class DoublyLinkedListNode<E = any> {
  value: E;
  next: DoublyLinkedListNode<E> | undefined;
  prev: DoublyLinkedListNode<E> | undefined;

  /**
   * The constructor function initializes the value, next, and previous properties of an object.
   * @param {E} value - The "value" parameter is the value that will be stored in the node. It can be of any data type, as it
   * is defined as a generic type "E".
   */
  constructor(value: E) {
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}

export class DoublyLinkedList<E = any> extends IterableElementBase<E> {
  /**
   * The constructor initializes the linked list with an empty head, tail, and length.
   */
  constructor(elements?: Iterable<E>) {
    super();
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
    if (elements) {
      for (const el of elements) {
        this.push(el);
      }
    }
  }

  protected _head: DoublyLinkedListNode<E> | undefined;

  get head(): DoublyLinkedListNode<E> | undefined {
    return this._head;
  }

  protected _tail: DoublyLinkedListNode<E> | undefined;

  get tail(): DoublyLinkedListNode<E> | undefined {
    return this._tail;
  }

  protected _length: number;

  get length(): number {
    return this._length;
  }

  get size(): number {
    return this.length;
  }

  /**
   * Time Complexity: O(n), where n is the length of the input array.
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n), where n is the length of the input array.
   * Space Complexity: O(n)
   *
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The push function adds a new node with the given value to the end of the doubly linked list.
   * @param {E} value - The value to be added to the linked list.
   */
  push(value: E): void {
    const newNode = new DoublyLinkedListNode(value);
    if (!this.head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this._tail = newNode;
    }
    this._length++;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The addLast function adds a new node with the given value to the end of the doubly linked list.
   * @param {E} value - The value to be added to the linked list.
   */
  addLast(value: E): void {
    this.push(value);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `pop()` function removes and returns the value of the last node in a doubly linked list.
   * @returns The method is returning the value of the removed node (removedNode.value) if the list is not empty. If the
   * list is empty, it returns undefined.
   */
  pop(): E | undefined {
    if (!this.tail) return undefined;
    const removedNode = this.tail;
    if (this.head === this.tail) {
      this._head = undefined;
      this._tail = undefined;
    } else {
      this._tail = removedNode.prev;
      this.tail!.next = undefined;
    }
    this._length--;
    return removedNode.value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `popLast()` function removes and returns the value of the last node in a doubly linked list.
   * @returns The method is returning the value of the removed node (removedNode.value) if the list is not empty. If the
   * list is empty, it returns undefined.
   */
  popLast(): E | undefined {
    return this.pop();
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift()` function removes and returns the value of the first node in a doubly linked list.
   * @returns The method `shift()` returns the value of the node that is removed from the beginning of the doubly linked
   * list.
   */
  shift(): E | undefined {
    if (!this.head) return undefined;
    const removedNode = this.head;
    if (this.head === this.tail) {
      this._head = undefined;
      this._tail = undefined;
    } else {
      this._head = removedNode.next;
      this.head!.prev = undefined;
    }
    this._length--;
    return removedNode.value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `popFirst()` function removes and returns the value of the first node in a doubly linked list.
   * @returns The method `shift()` returns the value of the node that is removed from the beginning of the doubly linked
   * list.
   */
  popFirst(): E | undefined {
    return this.shift();
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The unshift function adds a new node with the given value to the beginning of a doubly linked list.
   * @param {E} value - The `value` parameter represents the value of the new node that will be added to the beginning of the
   * doubly linked list.
   */
  unshift(value: E): void {
    const newNode = new DoublyLinkedListNode(value);
    if (!this.head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this._head = newNode;
    }
    this._length++;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The addFirst function adds a new node with the given value to the beginning of a doubly linked list.
   * @param {E} value - The `value` parameter represents the value of the new node that will be added to the beginning of the
   * doubly linked list.
   */
  addFirst(value: E): void {
    this.unshift(value);
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `getFirst` function returns the first node in a doubly linked list, or undefined if the list is empty.
   * @returns The method `getFirst()` returns the first node of the doubly linked list, or `undefined` if the list is empty.
   */
  getFirst(): E | undefined {
    return this.head?.value;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `getLast` function returns the last node in a doubly linked list, or undefined if the list is empty.
   * @returns The method `getLast()` returns the last node of the doubly linked list, or `undefined` if the list is empty.
   */
  getLast(): E | undefined {
    return this.tail?.value;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `getAt` function returns the value at a specified index in a linked list, or undefined if the index is out of bounds.
   * @param {number} index - The index parameter is a number that represents the position of the element we want to
   * retrieve from the list.
   * @returns The method is returning the value at the specified index in the linked list. If the index is out of bounds
   * or the linked list is empty, it will return undefined.
   */
  getAt(index: number): E | undefined {
    if (index < 0 || index >= this.length) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current!.value;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The function `getNodeAt` returns the node at a given index in a doubly linked list, or undefined if the index is out of
   * range.
   * @param {number} index - The `index` parameter is a number that represents the position of the node we want to
   * retrieve from the doubly linked list. It indicates the zero-based index of the node we want to access.
   * @returns The method `getNodeAt(index: number)` returns a `DoublyLinkedListNode<E>` object if the index is within the
   * valid range of the linked list, otherwise it returns `undefined`.
   */
  getNodeAt(index: number): DoublyLinkedListNode<E> | undefined {
    if (index < 0 || index >= this.length) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The function `findNodeByValue` searches for a node with a specific value in a doubly linked list and returns the
   * node if found, otherwise it returns undefined.
   * @param {E} value - The `value` parameter is the value that we want to search for in the doubly linked list.
   * @returns The function `findNodeByValue` returns a `DoublyLinkedListNode<E>` if a node with the specified value `value`
   * is found in the linked list. If no such node is found, it returns `undefined`.
   */
  getNode(value: E | undefined): DoublyLinkedListNode<E> | undefined {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }

    return undefined;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `insert` function inserts a value at a specified index in a doubly linked list.
   * @param {number} index - The index parameter represents the position at which the new value should be inserted in the
   * DoublyLinkedList. It is of type number.
   * @param {E} value - The `value` parameter represents the value that you want to insert into the Doubly Linked List at the
   * specified index.
   * @returns The `insert` method returns a boolean value. It returns `true` if the insertion is successful, and `false`
   * if the index is out of bounds.
   */
  insertAt(index: number, value: E): boolean {
    if (index < 0 || index > this.length) return false;
    if (index === 0) {
      this.unshift(value);
      return true;
    }
    if (index === this.length) {
      this.push(value);
      return true;
    }

    const newNode = new DoublyLinkedListNode(value);
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
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
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
      existingNode = this.getNode(existingValueOrNode);
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
        this._head = newNode;
      }
      this._length++;
      return true;
    }

    return false;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
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
      existingNode = this.getNode(existingValueOrNode);
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
        this._tail = newNode;
      }
      this._length++;
      return true;
    }

    return false;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `deleteAt` function removes an element at a specified index from a linked list and returns the removed element.
   * @param {number} index - The index parameter represents the position of the element that needs to be deleted in the
   * data structure. It is of type number.
   * @returns The method `deleteAt` returns the value of the node that was deleted, or `undefined` if the index is out of
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
    return removedNode!.value;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `delete` function removes a node from a doubly linked list based on either the node itself or its value.
   * @param {E | DoublyLinkedListNode<E>} valOrNode - The `valOrNode` parameter can accept either a value of type `E` or
   * a `DoublyLinkedListNode<E>` object.
   * @returns The `delete` method returns a boolean value. It returns `true` if the value or node was successfully
   * deleted from the doubly linked list, and `false` if the value or node was not found in the list.
   */
  delete(valOrNode: E | DoublyLinkedListNode<E> | undefined): boolean {
    let node: DoublyLinkedListNode<E> | undefined;

    if (valOrNode instanceof DoublyLinkedListNode) {
      node = valOrNode;
    } else {
      node = this.getNode(valOrNode);
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
   * The function checks if a variable has a length greater than zero and returns a boolean value.
   * @returns A boolean value is being returned.
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * The `clear` function resets the linked list by setting the head, tail, and length to undefined and 0 respectively.
   */
  clear(): void {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `find` function iterates through a linked list and returns the first element that satisfies a given condition.
   * @param callback - A function that takes a value of type E as its parameter and returns a boolean value. This
   * function is used to determine whether a particular value in the linked list satisfies a certain condition.
   * @returns The method `find` returns the first element in the linked list that satisfies the condition specified by
   * the callback function. If no element satisfies the condition, it returns `undefined`.
   */
  find(callback: (value: E) => boolean): E | undefined {
    let current = this.head;
    while (current) {
      if (callback(current.value)) {
        return current.value;
      }
      current = current.next;
    }
    return undefined;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The function returns the index of the first occurrence of a given value in a linked list.
   * @param {E} value - The parameter `value` is of type `E`, which means it can be any data type. It represents the value
   * that we are searching for in the linked list.
   * @returns The method `indexOf` returns the index of the first occurrence of the specified value `value` in the linked
   * list. If the value is not found, it returns -1.
   */
  indexOf(value: E): number {
    let index = 0;
    let current = this.head;
    while (current) {
      if (current.value === value) {
        return index;
      }
      index++;
      current = current.next;
    }
    return -1;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `findBackward` function iterates through a linked list from the last node to the first node and returns the last
   * value that satisfies the given callback function, or undefined if no value satisfies the callback.
   * @param callback - A function that takes a value of type E as its parameter and returns a boolean value. This
   * function is used to determine whether a given value satisfies a certain condition.
   * @returns The method `findBackward` returns the last value in the linked list that satisfies the condition specified by
   * the callback function. If no value satisfies the condition, it returns `undefined`.
   */
  findBackward(callback: (value: E) => boolean): E | undefined {
    let current = this.tail;
    while (current) {
      if (callback(current.value)) {
        return current.value;
      }
      current = current.prev;
    }
    return undefined;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * The `reverse` function reverses the order of the elements in a doubly linked list.
   */
  reverse(): void {
    let current = this.head;
    [this._head, this._tail] = [this.tail, this.head];
    while (current) {
      const next = current.next;
      [current.prev, current.next] = [current.next, current.prev];
      current = next;
    }
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(n)
   *
   * The `toArray` function converts a linked list into an array.
   * @returns The `toArray()` method is returning an array of type `E[]`.
   */
  toArray(): E[] {
    const array: E[] = [];
    let current = this.head;
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    return array;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(n)
   *
   * The `toReversedArray` function converts a doubly linked list into an array in reverse order.
   * @returns The `toReversedArray()` function returns an array of type `E[]`.
   */
  toReversedArray(): E[] {
    const array: E[] = [];
    let current = this.tail;
    while (current) {
      array.push(current.value);
      current = current.prev;
    }
    return array;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new DoublyLinkedList by iterating over the elements of the current
   * list and applying a callback function to each element, returning only the elements for which the
   * callback function returns true.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the DoublyLinkedList. It takes three arguments: the current element, the index of the current
   * element, and the DoublyLinkedList itself. The callback function should return a boolean value
   * indicating whether the current element should be included
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `DoublyLinkedList` object that contains the
   * elements that pass the filter condition specified by the `callback` function.
   */
  filter(callback: ElementCallback<E, boolean>, thisArg?: any): DoublyLinkedList<E> {
    const filteredList = new DoublyLinkedList<E>();
    let index = 0;
    for (const current of this) {
      if (callback.call(thisArg, current, index, this)) {
        filteredList.push(current);
      }
      index++;
    }
    return filteredList;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new DoublyLinkedList by applying a callback function to each element
   * in the original list.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * DoublyLinkedList. It takes three arguments: the current element, the index of the current element,
   * and the DoublyLinkedList itself. The callback function should return a value that will be added to
   * the new DoublyLinkedList that
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `map` function is returning a new `DoublyLinkedList` object that contains the results
   * of applying the provided `callback` function to each element in the original `DoublyLinkedList`
   * object.
   */
  map<T>(callback: ElementCallback<E, T>, thisArg?: any): DoublyLinkedList<T> {
    const mappedList = new DoublyLinkedList<T>();
    let index = 0;
    for (const current of this) {
      mappedList.push(callback.call(thisArg, current, index, this));
      index++;
    }

    return mappedList;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(n)
   */

  print(): void {
    console.log([...this]);
  }

  /**
   * The function returns an iterator that iterates over the values of a linked list.
   */
  protected* _getIterator(): IterableIterator<E> {
    let current = this.head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
