/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
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

/**
 *
 */
export class SinglyLinkedList<E = any, R = any> extends IterableElementBase<E, R, SinglyLinkedList<E, R>> {
  constructor(
    elements: Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>> = [],
    options?: SinglyLinkedListOptions<E, R>
  ) {
    super(options);

    if (options) {
      const { maxLen } = options;
      if (typeof maxLen === 'number' && maxLen > 0 && maxLen % 1 === 0) this._maxLen = maxLen;
    }

    this.pushMany(elements);
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

  protected _maxLen: number = -1;

  get maxLen() {
    return this._maxLen;
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
   *
   * The `push` function adds a new element or node to the end of a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} elementOrNode - The `elementOrNode` parameter in the `push`
   * method can accept either an element of type `E` or a `SinglyLinkedListNode<E>` object.
   * @returns The `push` method is returning a boolean value, specifically `true`.
   */
  push(elementOrNode: E | SinglyLinkedListNode<E>): boolean {
    const newNode = this._ensureNode(elementOrNode);
    if (!this.head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      this.tail!.next = newNode;
      this._tail = newNode;
    }
    this._size++;
    if (this._maxLen > 0 && this.size > this._maxLen) this.shift();
    return true;
  }

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
   *
   * The unshift function adds a new element or node to the beginning of a singly linked list in
   * TypeScript.
   * @param {E | SinglyLinkedListNode<E>} elementOrNode - The `elementOrNode` parameter in the
   * `unshift` method can be either an element of type `E` or a `SinglyLinkedListNode` containing an
   * element of type `E`.
   * @returns The `unshift` method is returning a boolean value, specifically `true`.
   */
  unshift(elementOrNode: E | SinglyLinkedListNode<E>): boolean {
    const newNode = this._ensureNode(elementOrNode);
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
   * Time Complexity: O(k)
   * Space Complexity: O(k)
   *
   * The function `pushMany` iterates over elements and pushes them into a data structure, applying a
   * transformation function if provided.
   * @param {Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>>} elements - The `elements`
   * parameter in the `pushMany` function can accept an iterable containing elements of type `E`, `R`,
   * or `SinglyLinkedListNode<E>`.
   * @returns The `pushMany` function returns an array of boolean values indicating whether each
   * element was successfully pushed into the data structure.
   */
  pushMany(elements: Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>>) {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) {
        ans.push(this.push(this.toElementFn(el as R)));
        continue;
      }
      ans.push(this.push(el as E | SinglyLinkedListNode<E>));
    }
    return ans;
  }

  /**
   * Time Complexity: O(k)
   * Space Complexity: O(k)
   *
   * The function `unshiftMany` iterates over elements and adds them to a data structure, optionally
   * converting them using a provided function.
   * @param {Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>>} elements - The `elements`
   * parameter in the `unshiftMany` function can accept an iterable containing elements of type `E`,
   * `R`, or `SinglyLinkedListNode<E>`. The function iterates over each element in the iterable and
   * performs an `unshift` operation on the linked list for each
   * @returns The `unshiftMany` function is returning an array of boolean values, where each value
   * represents the result of calling the `unshift` method on the current instance of the class.
   */
  unshiftMany(elements: Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>>) {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) {
        ans.push(this.unshift(this.toElementFn(el as R)));
        continue;
      }
      ans.push(this.unshift(el as E | SinglyLinkedListNode<E>));
    }
    return ans;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * This function searches for a specific element in a singly linked list based on a given node or
   * predicate.
   * @param {E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter in the `get` method can be one of
   * the following types:
   * @returns The `get` method returns the value of the first node in the singly linked list that
   * satisfies the provided predicate function. If no such node is found, it returns `undefined`.
   */
  search(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)
  ): E | undefined {
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this.head;
    while (current) {
      if (predicate(current)) return current.value;
      current = current.next;
    }
    return undefined;
  }

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
    if (index < 0 || index >= this._size) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current!.value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `isNode` in TypeScript checks if the input is an instance of `SinglyLinkedListNode`.
   * @param {E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter in the `isNode` function can be
   * one of the following types:
   * @returns The `isNode` function is checking if the `elementNodeOrPredicate` parameter is an
   * instance of `SinglyLinkedListNode<E>`. If it is, the function returns `true`, indicating that the
   * parameter is a `SinglyLinkedListNode<E>`. If it is not an instance of `SinglyLinkedListNode<E>`,
   * the function returns `false`.
   */
  isNode(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)
  ): elementNodeOrPredicate is SinglyLinkedListNode<E> {
    return elementNodeOrPredicate instanceof SinglyLinkedListNode;
  }

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
   *
   * The `deleteAt` function removes an element at a specified index from a linked list and returns the removed element.
   * @param {number} index - The index parameter represents the position of the element that needs to be deleted in the
   * data structure. It is of type number.
   * @returns The method `deleteAt` returns the value of the node that was deleted, or `undefined` if the index is out of
   * bounds.
   */
  deleteAt(index: number): boolean {
    if (index < 0 || index >= this._size) return false;
    if (index === 0) {
      this.shift();
      return true;
    }
    if (index === this._size - 1) {
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
   *
   * The delete function removes a node with a specific value from a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} elementOrNode - The `elementOrNode` parameter can accept either a value of type `E`
   * or a `SinglyLinkedListNode<E>` object.
   * @returns The `delete` method returns a boolean value. It returns `true` if the value or node is found and
   * successfully deleted from the linked list, and `false` if the value or node is not found in the linked list.
   */
  delete(elementOrNode: E | SinglyLinkedListNode<E> | undefined): boolean {
    if (elementOrNode === undefined) return false;
    let value: E;
    if (elementOrNode instanceof SinglyLinkedListNode) {
      value = elementOrNode.value;
    } else {
      value = elementOrNode;
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
   *
   * The `addAt` function inserts a new element or node at a specified index in a singly linked list.
   * @param {number} index - The `index` parameter represents the position at which you want to add a
   * new element or node in the linked list. It is a number that indicates the index where the new
   * element or node should be inserted.
   * @param {E | SinglyLinkedListNode<E>} newElementOrNode - The `newElementOrNode` parameter in the
   * `addAt` method can be either a value of type `E` or a `SinglyLinkedListNode<E>` object. This
   * parameter represents the element or node that you want to add to the linked list at the specified
   * index.
   * @returns The `addAt` method returns a boolean value - `true` if the element or node was
   * successfully added at the specified index, and `false` if the index is out of bounds.
   */
  addAt(index: number, newElementOrNode: E | SinglyLinkedListNode<E>): boolean {
    if (index < 0 || index > this._size) return false;

    if (index === 0) {
      this.unshift(newElementOrNode);
      return true;
    }
    if (index === this._size) {
      this.push(newElementOrNode);
      return true;
    }

    const newNode = this._ensureNode(newElementOrNode);
    const prevNode = this.getNodeAt(index - 1);
    newNode.next = prevNode!.next;
    prevNode!.next = newNode;
    this._size++;
    return true;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if the length of a data structure is equal to zero and returns a boolean value indicating
   * whether it is empty or not.
   * @returns A boolean value indicating whether the length of the object is equal to 0.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
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
   *
   * The `indexOf` function in TypeScript searches for a specific element or node in a singly linked
   * list and returns its index if found.
   * @param {E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter in the `indexOf` method can be one
   * of the following types:
   * @returns The `indexOf` method returns the index of the first occurrence of the element that
   * matches the provided predicate in the singly linked list. If no matching element is found, it
   * returns -1.
   */
  indexOf(elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)): number {
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let index = 0;
    let current = this.head;

    while (current) {
      if (predicate(current)) {
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
   *
   * The function `getNode` in TypeScript searches for a node in a singly linked list based on a given
   * element, node, or predicate.
   * @param {E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean) | undefined} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter in the `getNode` method can be one
   * of the following types:
   * @returns The `getNode` method returns either a `SinglyLinkedListNode<E>` if a matching node is
   * found based on the provided predicate, or it returns `undefined` if no matching node is found or
   * if the input parameter is `undefined`.
   */
  getNode(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean) | undefined
  ): SinglyLinkedListNode<E> | undefined {
    if (elementNodeOrPredicate === undefined) return;
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this.head;

    while (current) {
      if (predicate(current)) {
        return current;
      }
      current = current.next;
    }

    return undefined;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `addBefore` in TypeScript adds a new element or node before an existing element or
   * node in a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} existingElementOrNode - existingElementOrNode represents the
   * element or node in the linked list before which you want to add a new element or node.
   * @param {E | SinglyLinkedListNode<E>} newElementOrNode - The `newElementOrNode` parameter in the
   * `addBefore` method represents the element or node that you want to insert before the existing
   * element or node in the linked list. This new element can be of type `E` or a
   * `SinglyLinkedListNode<E>`.
   * @returns The `addBefore` method returns a boolean value - `true` if the new element or node was
   * successfully added before the existing element or node, and `false` if the operation was
   * unsuccessful.
   */
  addBefore(
    existingElementOrNode: E | SinglyLinkedListNode<E>,
    newElementOrNode: E | SinglyLinkedListNode<E>
  ): boolean {
    if (!this.head) return false;

    let existingValue: E;
    if (this.isNode(existingElementOrNode)) {
      existingValue = existingElementOrNode.value;
    } else {
      existingValue = existingElementOrNode;
    }
    if (this.head.value === existingValue) {
      this.unshift(newElementOrNode);
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === existingValue) {
        const newNode = this._ensureNode(newElementOrNode);
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
   *
   * The `addAfter` function in TypeScript adds a new element or node after an existing element or node
   * in a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} existingElementOrNode - existingElementOrNode can be either
   * an element of type E or a SinglyLinkedListNode of type E.
   * @param {E | SinglyLinkedListNode<E>} newElementOrNode - The `newElementOrNode` parameter in the
   * `addAfter` method represents the element or node that you want to add after the existing element
   * or node in a singly linked list. This parameter can be either the value of the new element or a
   * reference to a `SinglyLinkedListNode` containing
   * @returns The `addAfter` method returns a boolean value - `true` if the new element or node was
   * successfully added after the existing element or node, and `false` if the existing element or node
   * was not found.
   */
  addAfter(existingElementOrNode: E | SinglyLinkedListNode<E>, newElementOrNode: E | SinglyLinkedListNode<E>): boolean {
    const existingNode: SinglyLinkedListNode<E> | undefined = this.getNode(existingElementOrNode);

    if (existingNode) {
      const newNode = this._ensureNode(newElementOrNode);
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
   *
   * The function `countOccurrences` iterates through a singly linked list and counts the occurrences
   * of a specified element or nodes that satisfy a given predicate.
   * @param {E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)} elementOrNode
   * - The `elementOrNode` parameter in the `countOccurrences` method can accept three types of values:
   * @returns The `countOccurrences` method returns the number of occurrences of the specified element,
   * node, or predicate function in the singly linked list.
   */
  countOccurrences(elementOrNode: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)): number {
    const predicate = this._ensurePredicate(elementOrNode);
    let count = 0;
    let current = this.head;

    while (current) {
      if (predicate(current)) {
        count++;
      }
      current = current.next;
    }

    return count;
  }

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
   *
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
  protected *_getIterator(): IterableIterator<E> {
    let current = this.head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  /**
   * The _isPredicate function in TypeScript checks if the input is a function that takes a
   * SinglyLinkedListNode as an argument and returns a boolean.
   * @param {E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter can be one of the following types:
   * @returns The _isPredicate method is returning a boolean value based on whether the
   * elementNodeOrPredicate parameter is a function or not. If the elementNodeOrPredicate is a
   * function, the method will return true, indicating that it is a predicate function. If it is not a
   * function, the method will return false.
   */
  protected _isPredicate(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)
  ): elementNodeOrPredicate is (node: SinglyLinkedListNode<E>) => boolean {
    return typeof elementNodeOrPredicate === 'function';
  }

  /**
   * The function `_ensureNode` ensures that the input is a valid node and returns it, creating a new
   * node if necessary.
   * @param {E | SinglyLinkedListNode<E>} elementOrNode - The `elementOrNode` parameter can be either
   * an element of type `E` or a `SinglyLinkedListNode` containing an element of type `E`.
   * @returns A SinglyLinkedListNode<E> object is being returned.
   */
  protected _ensureNode(elementOrNode: E | SinglyLinkedListNode<E>) {
    if (this.isNode(elementOrNode)) return elementOrNode;

    return new SinglyLinkedListNode<E>(elementOrNode);
  }

  /**
   * The function `_ensurePredicate` in TypeScript ensures that the input is either a node, a predicate
   * function, or a value to compare with the node's value.
   * @param {E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter can be one of the following types:
   * @returns A function is being returned. If the input `elementNodeOrPredicate` is already a node, a
   * function is returned that checks if a given node is equal to the input node. If the input is a
   * predicate function, it is returned as is. If the input is neither a node nor a predicate function,
   * a function is returned that checks if a given node's value is equal to the input
   */
  protected _ensurePredicate(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)
  ) {
    if (this.isNode(elementNodeOrPredicate)) return (node: SinglyLinkedListNode<E>) => node === elementNodeOrPredicate;

    if (this._isPredicate(elementNodeOrPredicate)) return elementNodeOrPredicate;

    return (node: SinglyLinkedListNode<E>) => node.value === elementNodeOrPredicate;
  }
}
