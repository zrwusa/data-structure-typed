/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import { DoublyLinkedList } from '../linked-list';

// O(n) time complexity of obtaining the value
// O(1) time complexity of adding at the beginning and the end
export class Deque<E = any> extends DoublyLinkedList<E> {
}

// O(1) time complexity of obtaining the value
// O(n) time complexity of adding at the beginning and the end
// todo tested slowest one
export class ObjectDeque<E = number> {
  constructor(capacity?: number) {
    if (capacity !== undefined) this._capacity = capacity;
  }

  protected _nodes: { [key: number]: E } = {};

  get nodes(): { [p: number]: E } {
    return this._nodes;
  }

  protected _capacity = Number.MAX_SAFE_INTEGER;

  get capacity(): number {
    return this._capacity;
  }

  protected _first = -1;

  get first(): number {
    return this._first;
  }

  protected _last = -1;

  get last(): number {
    return this._last;
  }

  protected _size = 0;

  get size(): number {
    return this._size;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The "addFirst" function adds a value to the beginning of an array-like data structure.
   * @param {E} value - The `value` parameter represents the value that you want to add to the beginning of the data
   * structure.
   */
  addFirst(value: E) {
    if (this.size === 0) {
      const mid = Math.floor(this.capacity / 2);
      this._first = mid;
      this._last = mid;
    } else {
      this._first--;
    }
    this.nodes[this.first] = value;
    this._size++;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The addLast function adds a value to the end of an array-like data structure.
   * @param {E} value - The `value` parameter represents the value that you want to add to the end of the data structure.
   */
  addLast(value: E) {
    if (this.size === 0) {
      const mid = Math.floor(this.capacity / 2);
      this._first = mid;
      this._last = mid;
    } else {
      this._last++;
    }
    this.nodes[this.last] = value;
    this._size++;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `popFirst()` removes and returns the first element in a data structure.
   * @returns The value of the first element in the data structure.
   */
  popFirst() {
    if (!this.size) return;
    const value = this.getFirst();
    delete this.nodes[this.first];
    this._first++;
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
   * The `getFirst` function returns the first element in an array-like data structure if it exists.
   * @returns The element at the first position of the `_nodes` array.
   */
  getFirst() {
    if (this.size) return this.nodes[this.first];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `popLast()` function removes and returns the last element in a data structure.
   * @returns The value that was removed from the data structure.
   */
  popLast() {
    if (!this.size) return;
    const value = this.getLast();
    delete this.nodes[this.last];
    this._last--;
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
   * The `getLast()` function returns the last element in an array-like data structure.
   * @returns The last element in the array "_nodes" is being returned.
   */
  getLast() {
    if (this.size) return this.nodes[this.last];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The get function returns the element at the specified index in an array-like data structure.
   * @param {number} index - The index parameter is a number that represents the position of the element you want to
   * retrieve from the array.
   * @returns The element at the specified index in the `_nodes` array is being returned. If there is no element at that
   * index, `null` is returned.
   */
  get(index: number) {
    return this.nodes[this.first + index] || null;
  }

  /**
   * The function checks if the size of a data structure is less than or equal to zero.
   * @returns The method is returning a boolean value indicating whether the size of the object is less than or equal to 0.
   */
  isEmpty() {
    return this.size <= 0;
  }
}

// O(1) time complexity of obtaining the value
// O(n) time complexity of adding at the beginning and the end
export class ArrayDeque<E> {
  protected _nodes: E[] = [];

  get nodes(): E[] {
    return this._nodes;
  }

  get size() {
    return this.nodes.length;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "addLast" adds a value to the end of an array.
   * @param {E} value - The value parameter represents the value that you want to add to the end of the array.
   * @returns The return value is the new length of the array after the value has been added.
   */
  addLast(value: E) {
    return this.nodes.push(value);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "popLast" returns and removes the last element from an array, or returns null if the array is empty.
   * @returns The method `popLast()` returns the last element of the `_nodes` array, or `null` if the array is empty.
   */
  popLast(): E | null {
    return this.nodes.pop() ?? null;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `popFirst` function removes and returns the first element from an array, or returns null if the array is empty.
   * @returns The `popFirst()` function returns the first element of the `_nodes` array, or `null` if the array is
   * empty.
   */
  popFirst(): E | null {
    return this.nodes.shift() ?? null;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function "addFirst" adds a value to the beginning of an array.
   * @param {E} value - The value parameter represents the value that you want to add to the beginning of the array.
   * @returns The return value of the `addFirst` function is the new length of the array `_nodes` after adding the
   * `value` at the beginning.
   */
  addFirst(value: E) {
    return this.nodes.unshift(value);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `getFirst` function returns the first element of an array or null if the array is empty.
   * @returns The function `getFirst()` is returning the first element (`E`) of the `_nodes` array. If the array is
   * empty, it will return `null`.
   */
  getFirst(): E | null {
    return this.nodes[0] ?? null;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `getLast` function returns the last element of an array or null if the array is empty.
   * @returns The method `getLast()` returns the last element of the `_nodes` array, or `null` if the array is empty.
   */
  getLast(): E | null {
    return this.nodes[this.nodes.length - 1] ?? null;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The get function returns the element at the specified index in an array, or null if the index is out of bounds.
   * @param {number} index - The index parameter is a number that represents the position of the element you want to
   * retrieve from the array.
   * @returns The method is returning the element at the specified index in the `_nodes` array. If the element exists, it
   * will be returned. If the element does not exist (i.e., the index is out of bounds), `null` will be returned.
   */
  get(index: number): E | null {
    return this.nodes[index] ?? null;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The set function assigns a value to a specific index in an array.
   * @param {number} index - The index parameter is a number that represents the position of the element in the array
   * that you want to set a new value for.
   * @param {E} value - The value parameter represents the new value that you want to set at the specified index in the
   * _nodes array.
   * @returns The value that is being set at the specified index in the `_nodes` array.
   */
  set(index: number, value: E) {
    return (this.nodes[index] = value);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The insert function adds a value at a specified index in an array.
   * @param {number} index - The index parameter specifies the position at which the value should be inserted in the
   * array. It is a number that represents the index of the array where the value should be inserted. The index starts
   * from 0, so the first element of the array has an index of 0, the second element has
   * @param {E} value - The value parameter represents the value that you want to insert into the array at the specified
   * index.
   * @returns The splice method returns an array containing the removed elements, if any. In this case, since no elements
   * are being removed, an empty array will be returned.
   */
  insert(index: number, value: E) {
    return this.nodes.splice(index, 0, value);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The delete function removes an element from an array at a specified index.
   * @param {number} index - The index parameter specifies the position of the element to be removed from the array. It
   * is a number that represents the index of the element to be removed.
   * @returns The method is returning an array containing the removed element.
   */
  delete(index: number) {
    return this.nodes.splice(index, 1);
  }

  /**
   * The function checks if an array called "_nodes" is empty.
   * @returns The method `isEmpty()` is returning a boolean value. It returns `true` if the length of the `_nodes` array
   * is 0, indicating that the array is empty. Otherwise, it returns `false`.
   */
  isEmpty() {
    return this.nodes.length === 0;
  }
}
