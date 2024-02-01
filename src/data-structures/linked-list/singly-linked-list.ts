/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { ElementCallback, SinglyLinkedListOptions } from '../../types';
import { IterableElementBase } from '../base';

export class SinglyLinkedListNode<E = any> {
  /**
   * The constructor function initializes an instance of a class with a given value and sets the next property to undefined.
   * @param {E} value - The "value" parameter is of type E, which means it can be any data type. It represents the value that
   * will be stored in the node of a linked list.
   */
  constructor(value: E) {
    this._value = value;
    this._next = undefined;
  }

  protected _value: E;

  /**
   * The function returns the value of a protected variable.
   * @returns The value of the variable `_value` is being returned.
   */
  get value(): E {
    return this._value;
  }

  /**
   * The above function sets the value of a variable.
   * @param {E} value - The parameter "value" is of type E, which means it can be any type.
   */
  set value(value: E) {
    this._value = value;
  }

  protected _next: SinglyLinkedListNode<E> | undefined;

  /**
   * The `next` function returns the next node in a singly linked list.
   * @returns The `next` property is being returned. It can be either a `SinglyLinkedListNode<E>`
   * object or `undefined`.
   */
  get next(): SinglyLinkedListNode<E> | undefined {
    return this._next;
  }

  /**
   * The "next" property of a SinglyLinkedListNode is set to the provided value.
   * @param {SinglyLinkedListNode<E> | undefined} value - The `value` parameter is of type
   * `SinglyLinkedListNode<E> | undefined`. This means that it can accept either a
   * `SinglyLinkedListNode` object or `undefined` as its value.
   */
  set next(value: SinglyLinkedListNode<E> | undefined) {
    this._next = value;
  }
}

export class SinglyLinkedList<E = any, R = any> extends IterableElementBase<E, R, SinglyLinkedList<E, R>> {
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: SinglyLinkedListOptions<E, R>) {
    super(options);
    if (elements) {
      for (const el of elements) {
        if (this.toElementFn) {
          this.push(this.toElementFn(el as R));
        } else {
          this.push(el as E);
        }
      }
    }
  }

  protected _head: SinglyLinkedListNode<E> | undefined;

  /**
   * The `head` function returns the first node of a singly linked list.
   * @returns The method is returning either a SinglyLinkedListNode object or undefined.
   */
  get head(): SinglyLinkedListNode<E> | undefined {
    return this._head;
  }

  protected _tail: SinglyLinkedListNode<E> | undefined;

  /**
   * The `tail` function returns the last node of a singly linked list.
   * @returns The method is returning either a SinglyLinkedListNode object or undefined.
   */
  get tail(): SinglyLinkedListNode<E> | undefined {
    return this._tail;
  }

  /**
   * The above function returns the value of the first element in a linked list, or undefined if the
   * list is empty.
   * @returns The value of the first node in the linked list, or undefined if the linked list is empty.
   */
  get first(): E | undefined {
    return this.head?.value;
  }

  /**
   * The function returns the value of the last element in a linked list, or undefined if the list is
   * empty.
   * @returns The value of the last node in the linked list, or undefined if the linked list is empty.
   */
  get last(): E | undefined {
    return this.tail?.value;
  }

  protected _size: number = 0;

  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   * Linear time, where n is the length of the input array, as it performs a loop to push each element into the linked list.
   * Linear space, as it creates a new node for each element in the array.
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `fromArray` function creates a new SinglyLinkedList instance and populates it with the elements from the given
   * array.
   * @param {E[]} data - The `data` parameter is an array of elements of type `E`.
   * @returns The `fromArray` function returns a `SinglyLinkedList` object.
   */
  static fromArray<E>(data: E[]) {
    const singlyLinkedList = new SinglyLinkedList<E>();
    for (const item of data) {
      singlyLinkedList.push(item);
    }
    return singlyLinkedList;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The push function adds a new element to the end of a singly linked list.
   * @param {E} element - The "element" parameter represents the value of the element that you want to
   * add to the linked list.
   * @returns The `push` method is returning a boolean value, `true`.
   */
  push(element: E): boolean {
    const newNode = new SinglyLinkedListNode(element);
    if (!this.head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      this.tail!.next = newNode;
      this._tail = newNode;
    }
    this._size++;
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   * Linear time in the worst case, as it may need to traverse the list to find the last element.
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `pop` function removes and returns the value of the last element in a linked list.
   * @returns The method is returning the value of the element that is being popped from the end of the
   * list.
   */
  pop(): E | undefined {
    if (!this.head) return undefined;
    if (this.head === this.tail) {
      const value = this.head.value;
      this._head = undefined;
      this._tail = undefined;
      this._size--;
      return value;
    }

    let current = this.head;
    while (current.next !== this.tail) {
      current = current.next!;
    }
    const value = this.tail!.value;
    current.next = undefined;
    this._tail = current;
    this._size--;
    return value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift()` function removes and returns the value of the first element in a linked list.
   * @returns The value of the removed node.
   */
  shift(): E | undefined {
    if (!this.head) return undefined;
    const removedNode = this.head;
    this._head = this.head.next;
    this._size--;
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
   * The unshift function adds a new element to the beginning of a singly linked list.
   * @param {E} element - The "element" parameter represents the value of the element that you want to
   * add to the beginning of the singly linked list.
   * @returns The `unshift` method is returning a boolean value, `true`.
   */
  unshift(element: E): boolean {
    const newNode = new SinglyLinkedListNode(element);
    if (!this.head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.next = this.head;
      this._head = newNode;
    }
    this._size++;
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `at` returns the value at a specified index in a linked list, or undefined if the index is out of range.
   * @param {number} index - The index parameter is a number that represents the position of the element we want to
   * retrieve from the list.
   * @returns The method `at(index: number): E | undefined` returns the value at the specified index in the linked list, or
   * `undefined` if the index is out of bounds.
   */
  at(index: number): E | undefined {
    if (index < 0 || index >= this.size) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current!.value;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `getNodeAt` returns the node at a given index in a singly linked list.
   * @param {number} index - The `index` parameter is a number that represents the position of the node we want to
   * retrieve from the linked list. It indicates the zero-based index of the node we want to access.
   * @returns The method `getNodeAt(index: number)` returns a `SinglyLinkedListNode<E>` object if the node at the
   * specified index exists, or `undefined` if the index is out of bounds.
   */
  getNodeAt(index: number): SinglyLinkedListNode<E> | undefined {
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `deleteAt` function removes an element at a specified index from a linked list and returns the removed element.
   * @param {number} index - The index parameter represents the position of the element that needs to be deleted in the
   * data structure. It is of type number.
   * @returns The method `deleteAt` returns the value of the node that was deleted, or `undefined` if the index is out of
   * bounds.
   */
  deleteAt(index: number): boolean {
    if (index < 0 || index >= this.size) return false;
    if (index === 0) {
      this.shift();
      return true;
    }
    if (index === this.size - 1) {
      this.pop();
      return true;
    }

    const prevNode = this.getNodeAt(index - 1);
    const removedNode = prevNode!.next;
    prevNode!.next = removedNode!.next;
    this._size--;
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The delete function removes a node with a specific value from a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} valueOrNode - The `valueOrNode` parameter can accept either a value of type `E`
   * or a `SinglyLinkedListNode<E>` object.
   * @returns The `delete` method returns a boolean value. It returns `true` if the value or node is found and
   * successfully deleted from the linked list, and `false` if the value or node is not found in the linked list.
   */
  delete(valueOrNode: E | SinglyLinkedListNode<E> | undefined): boolean {
    if (!valueOrNode) return false;
    let value: E;
    if (valueOrNode instanceof SinglyLinkedListNode) {
      value = valueOrNode.value;
    } else {
      value = valueOrNode;
    }
    let current = this.head,
      prev = undefined;

    while (current) {
      if (current.value === value) {
        if (prev === undefined) {
          this._head = current.next;
          if (current === this.tail) {
            this._tail = undefined;
          }
        } else {
          prev.next = current.next;
          if (current === this.tail) {
            this._tail = prev;
          }
        }
        this._size--;
        return true;
      }
      prev = current;
      current = current.next;
    }

    return false;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `addAt` function inserts a value at a specified index in a singly linked list.
   * @param {number} index - The index parameter represents the position at which the new value should be inserted in the
   * linked list. It is of type number.
   * @param {E} value - The `value` parameter represents the value that you want to insert into the linked list at the
   * specified index.
   * @returns The `insert` method returns a boolean value. It returns `true` if the insertion is successful, and `false`
   * if the index is out of bounds.
   */
  addAt(index: number, value: E): boolean {
    if (index < 0 || index > this.size) return false;
    if (index === 0) {
      this.unshift(value);
      return true;
    }
    if (index === this.size) {
      this.push(value);
      return true;
    }

    const newNode = new SinglyLinkedListNode(value);
    const prevNode = this.getNodeAt(index - 1);
    newNode.next = prevNode!.next;
    prevNode!.next = newNode;
    this._size++;
    return true;
  }

  /**
   * The function checks if the length of a data structure is equal to zero and returns a boolean value indicating
   * whether it is empty or not.
   * @returns A boolean value indicating whether the length of the object is equal to 0.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * The `clear` function resets the linked list by setting the head, tail, and length to undefined and 0 respectively.
   */
  clear(): void {
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   * Linear time, where n is the length of the list, as it needs to traverse the entire list to convert it to an array.
   * Linear space, as it creates an array with the same length as the list.
   */

  /**
   * Time Complexity: O(n)
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
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reverse` function reverses the order of the nodes in a singly linked list.
   * @returns The reverse() method does not return anything. It has a return type of void.
   */
  reverse(): this {
    if (!this.head || this.head === this.tail) return this;

    let prev: SinglyLinkedListNode<E> | undefined = undefined;
    let current: SinglyLinkedListNode<E> | undefined = this.head;
    let next: SinglyLinkedListNode<E> | undefined = undefined;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    [this._head, this._tail] = [this.tail!, this.head!];
    return this;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `indexOf` function returns the index of the first occurrence of a given value in a linked list.
   * @param {E} value - The value parameter is the value that you want to find the index of in the linked list.
   * @returns The method is returning the index of the first occurrence of the specified value in the linked list. If the
   * value is not found, it returns -1.
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
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function finds a node in a singly linked list by its value and returns the node if found, otherwise returns
   * undefined.
   * @param {E} value - The value parameter is the value that we want to search for in the linked list.
   * @returns a `SinglyLinkedListNode<E>` if a node with the specified value is found in the linked list. If no node with
   * the specified value is found, the function returns `undefined`.
   */
  getNode(value: E): SinglyLinkedListNode<E> | undefined {
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
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `addBefore` function inserts a new value before an existing value in a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} existingValueOrNode - The existing value or node that you want to insert the
   * new value before. It can be either the value itself or a node containing the value in the linked list.
   * @param {E} newValue - The `newValue` parameter represents the value that you want to insert into the linked list.
   * @returns The method `addBefore` returns a boolean value. It returns `true` if the new value was successfully
   * inserted before the existing value, and `false` otherwise.
   */
  addBefore(existingValueOrNode: E | SinglyLinkedListNode<E>, newValue: E): boolean {
    if (!this.head) return false;

    let existingValue: E;
    if (existingValueOrNode instanceof SinglyLinkedListNode) {
      existingValue = existingValueOrNode.value;
    } else {
      existingValue = existingValueOrNode;
    }
    if (this.head.value === existingValue) {
      this.unshift(newValue);
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === existingValue) {
        const newNode = new SinglyLinkedListNode(newValue);
        newNode.next = current.next;
        current.next = newNode;
        this._size++;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `addAfter` function inserts a new node with a given value after an existing node in a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} existingValueOrNode - The existing value or node in the linked list after which
   * the new value will be inserted. It can be either the value of the existing node or the existing node itself.
   * @param {E} newValue - The value that you want to insert into the linked list after the existing value or node.
   * @returns The method returns a boolean value. It returns true if the new value was successfully inserted after the
   * existing value or node, and false if the existing value or node was not found in the linked list.
   */
  addAfter(existingValueOrNode: E | SinglyLinkedListNode<E>, newValue: E): boolean {
    let existingNode: E | SinglyLinkedListNode<E> | undefined;

    if (existingValueOrNode instanceof SinglyLinkedListNode) {
      existingNode = existingValueOrNode;
    } else {
      existingNode = this.getNode(existingValueOrNode);
    }

    if (existingNode) {
      const newNode = new SinglyLinkedListNode(newValue);
      newNode.next = existingNode.next;
      existingNode.next = newNode;
      if (existingNode === this.tail) {
        this._tail = newNode;
      }
      this._size++;
      return true;
    }

    return false;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function counts the number of occurrences of a given value in a linked list.
   * @param {E} value - The value parameter is the value that you want to count the occurrences of in the linked list.
   * @returns The count of occurrences of the given value in the linked list.
   */
  countOccurrences(value: E): number {
    let count = 0;
    let current = this.head;

    while (current) {
      if (current.value === value) {
        count++;
      }
      current = current.next;
    }

    return count;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone` function returns a new instance of the `SinglyLinkedList` class with the same values
   * as the original list.
   * @returns The `clone()` method is returning a new instance of the `SinglyLinkedList` class, which
   * is a clone of the original list.
   */
  clone(): SinglyLinkedList<E, R> {
    return new SinglyLinkedList<E, R>(this, { toElementFn: this.toElementFn });
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new SinglyLinkedList by iterating over the elements of the current
   * list and applying a callback function to each element to determine if it should be included in the
   * filtered list.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * list. It takes three arguments: the current element, the index of the current element, and the
   * list itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list or not
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `SinglyLinkedList` object that contains the
   * elements that pass the filter condition specified by the `callback` function.
   */
  filter(callback: ElementCallback<E, R, boolean, SinglyLinkedList<E, R>>, thisArg?: any): SinglyLinkedList<E, R> {
    const filteredList = new SinglyLinkedList<E, R>([], { toElementFn: this.toElementFn });
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
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * The `map` function takes a callback function and returns a new SinglyLinkedList with the results
   * of applying the callback to each element in the original list.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the original list. It takes three arguments: `current` (the current element being processed),
   * `index` (the index of the current element), and `this` (the original list). It should return a
   * value
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be used to
   * convert the raw element (`RR`) to the desired element type (`T`). It takes the raw element as
   * input and returns the converted element. If this parameter is not provided, the raw element will
   * be used as is.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new instance of the `SinglyLinkedList` class with the mapped elements.
   */
  map<EM, RM>(
    callback: ElementCallback<E, R, EM, SinglyLinkedList<E, R>>,
    toElementFn?: (rawElement: RM) => EM,
    thisArg?: any
  ): SinglyLinkedList<EM, RM> {
    const mappedList = new SinglyLinkedList<EM, RM>([], { toElementFn });
    let index = 0;
    for (const current of this) {
      mappedList.push(callback.call(thisArg, current, index, this));
      index++;
    }

    return mappedList;
  }

  /**
   * The function `_getIterator` returns an iterable iterator that yields the values of a linked list.
   */
  protected* _getIterator(): IterableIterator<E> {
    let current = this.head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
