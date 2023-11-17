/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */


/**
 * Deque can provide random access with O(1) time complexity
 * Deque is usually more compact and efficient in memory usage because it does not require additional space to store pointers.
 * Deque may experience performance jitter, but DoublyLinkedList will not
 * Deque is implemented using a dynamic array. Inserting or deleting beyond both ends of the array may require moving elements or reallocating space.
 */

export class Deque<E = any> {
  /**
   * The constructor initializes the capacity, elements array, and head and tail offsets of a data
   * structure.
   * @param {number} [capacity=10] - The `capacity` parameter represents the maximum number of elements
   * that the data structure can hold. It is an optional parameter with a default value of 10.
   */
  constructor(capacity: number = 10) {
    this._capacity = capacity;
    this._elements = new Array(this.capacity);
    this._headOffset = Math.floor(capacity / 2);
    this._tailOffset = this._headOffset;
  }

  protected _elements: E[];

  get elements() {
    return this._elements;
  }

  protected _headOffset: number;

  get headOffset() {
    return this._headOffset;
  }

  protected _tailOffset: number;

  get tailOffset() {
    return this._tailOffset;
  }

  protected _capacity: number;

  get capacity() {
    return this._capacity;
  }

  get size(): number {
    return this.tailOffset - this.headOffset;
  }

  /**
   * Time Complexity: O(n) - Iterates over the input array once.
   * Space Complexity: O(n) - Creates a new deque of size n.
   */

  /**
   * Time Complexity: O(n) - Iterates over the input array once.
   * Space Complexity: O(n) - Creates a new deque of size n.
   *
   * The `fromArray` function creates a new Deque instance from an array of elements.
   * @param {E[]} data - The `data` parameter is an array of elements of type `E`.
   * @returns a Deque object.
   */
  static fromArray<E>(data: E[]): Deque<E> {
    const list = new Deque<E>(data.length);
    for (const item of data) {
      list.push(item);
    }
    return list;
  }

  /**
   * Time Complexity: Amortized O(1) - Generally constant time, but resizing when the deque is full leads to O(n).
   * Space Complexity: O(n) - In worst case, resizing doubles the array size.
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(n) - In worst case, resizing doubles the array size.
   *
   * The push function adds an element to the end of an array-like data structure, resizing it if
   * necessary.
   * @param {E} element - The `element` parameter represents the value that you want to add to the data
   * structure.
   */
  push(element: E): void {
    if (this.tailOffset === this.capacity) {
      this._resize();
    }
    this._elements[this.tailOffset] = element;
    this._tailOffset++;
  }

  /**
   * Time Complexity: O(1) - Removes the last element.
   * Space Complexity: O(1) - Operates in-place.
   */

  /**
   * Time Complexity: O(1) - Removes the last element.
   * Space Complexity: O(1) - Operates in-place.
   *
   * The `pop()` function removes and returns the last element from an array-like data structure.
   * @returns The method is returning the element at the end of the array, which is the element that
   * was most recently added.
   */
  pop(): E | undefined {
    if (this.size === 0) {
      return undefined;
    }
    return this._elements[--this._tailOffset];
  }

  /**
   * Time Complexity: Amortized O(1) - Similar to push, resizing leads to O(n).
   * Space Complexity: O(n) - Due to potential resizing.
   */

  /**
   * Time Complexity: O(1).
   * Space Complexity: O(n) - Due to potential resizing.
   * The unshift function adds an element to the beginning of an array-like data structure.
   * @param {E} element - The "element" parameter represents the element that you want to add to the
   * beginning of the array.
   */
  unshift(element: E): void {
    if (this.headOffset === 0) {
      this._resize();
    }
    this._elements[--this._headOffset] = element;
  }

  /**
   * Time Complexity: O(1) - Removes the first element.
   * Space Complexity: O(1) - In-place operation.
   */

  /**
   * Time Complexity: O(1) - Removes the first element.
   * Space Complexity: O(1) - In-place operation.
   *
   * The shift() function removes and returns the first element from an array-like data structure.
   * @returns The element at the front of the array is being returned.
   */
  shift(): E | undefined {
    if (this.size === 0) {
      return undefined;
    }
    return this._elements[this._headOffset++];
  }

  /**
   * Time Complexity: Amortized O(1) - Generally constant time, but resizing when the deque is full leads to O(n).
   * Space Complexity: O(n) - In worst case, resizing doubles the array size.
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(n) - In worst case, resizing doubles the array size.
   *
   * The addLast function adds an element to the end of an array.
   * @param {E} element - The element parameter represents the value that you want to add to the end of the
   * data structure.
   */
  addLast(element: E): void {
    this.push(element);
  }

  /**
   * Time Complexity: O(1) - Removes the last element.
   * Space Complexity: O(1) - Operates in-place.
   */

  /**
   * Time Complexity: O(1) - Removes the last element.
   * Space Complexity: O(1) - Operates in-place.
   *
   * The function "popLast" removes and returns the last element of an array.
   * @returns The last element of the array is being returned.
   */
  popLast(): E | undefined {
    return this.pop();
  }

  /**
   * Time Complexity: Amortized O(1) - Similar to push, resizing leads to O(n).
   * Space Complexity: O(n) - Due to potential resizing.
   */

  /**
   * Time Complexity: O(1).
   * Space Complexity: O(n) - Due to potential resizing.
   *
   * The "addFirst" function adds an element to the beginning of an array.
   * @param {E} element - The parameter "element" represents the element that you want to add to the
   * beginning of the data structure.
   */
  addFirst(element: E): void {
    this.unshift(element);
  }

  /**
   * Time Complexity: O(1) - Removes the first element.
   * Space Complexity: O(1) - In-place operation.
   */

  /**
   * Time Complexity: O(1) - Removes the first element.
   * Space Complexity: O(1) - In-place operation.
   *
   * The function "popFirst" removes and returns the first element of an array.
   * @returns The method `popFirst()` is returning the first element of the array after removing it
   * from the beginning. If the array is empty, it will return `undefined`.
   */
  popFirst(): E | undefined {
    return this.shift();
  }

  /**
   * Time Complexity: O(1) - Direct access to elements.
   * Space Complexity: O(1) - No extra space used.
   */

  /**
   * Time Complexity: O(1) - Direct access to elements.
   * Space Complexity: O(1) - No extra space used.
   *
   * The function returns the first element of an array if it exists, otherwise it returns undefined.
   * @returns The method `getFirst()` is returning the first element of the `_elements` array if the
   * size of the array is greater than 0. Otherwise, it returns `undefined`.
   */
  getFirst(): E | undefined {
    return this.size > 0 ? this._elements[this.headOffset] : undefined;
  }

  /**
   * Time Complexity: O(1) - Direct access to elements.
   * Space Complexity: O(1) - No extra space used.
   */

  /**
   * Time Complexity: O(1) - Direct access to elements.
   * Space Complexity: O(1) - No extra space used.
   *
   * The `getLast` function returns the last element in an array-like data structure, or `undefined` if
   * the structure is empty.
   * @returns The method `getLast()` returns the last element in the `_elements` array, or `undefined`
   * if the array is empty.
   */
  getLast(): E | undefined {
    if (this.size === 0) {
      return undefined;
    }
    return this._elements[this._tailOffset - 1];
  }

  /**
   * Time Complexity: O(1) - Direct access to elements.
   * Space Complexity: O(1) - No extra space used.
   */

  /**
   * Time Complexity: O(1) - Direct access to elements.
   * Space Complexity: O(1) - No extra space used.
   *
   * The `getAt` function returns the element at a specified index in an array-like data structure, or
   * `undefined` if the index is out of bounds.
   * @param {number} index - The `index` parameter is a number that represents the position of the
   * element we want to retrieve from the `_elements` array.
   * @returns The method `getAt(index: number)` returns the element at the specified index if it
   * exists, otherwise it returns `undefined`.
   */
  getAt(index: number): E | undefined {
    const actualIndex = this.headOffset + index;
    if (actualIndex < this.headOffset || actualIndex >= this.tailOffset) {
      return undefined;
    }
    return this._elements[actualIndex];
  }

  /**
   * Time Complexity: O(n) - In worst case, all elements might need to be shifted.
   * Space Complexity: O(n) - Resizing could happen.
   */

  /**
   * Time Complexity: O(n) - In worst case, all elements might need to be shifted.
   * Space Complexity: O(n) - Resizing could happen.
   *
   * The `insertAt` function inserts an element at a specified index in an array-like data structure,
   * shifting existing elements to make room.
   * @param {number} index - The index parameter is the position at which the element should be inserted
   * in the array. It is of type number.
   * @param {E} element - The element to be inserted at the specified index.
   * @returns The method `insertAt` returns a boolean element. It returns `true` if the insertion was
   * successful, and `false` if the index is out of bounds.
   */
  insertAt(index: number, element: E): boolean {
    if (index < 0 || index > this.size) {
      return false;
    }

    if (index === 0) {
      this.unshift(element);
      return true;
    }

    if (index === this.size) {
      this.push(element);
      return true;
    }

    this._ensureCapacityForInsert();
    const actualIndex = this._headOffset + index;
    for (let i = this._tailOffset; i > actualIndex; i--) {
      this._elements[i] = this._elements[i - 1];
    }
    this._elements[actualIndex] = element;
    this._tailOffset++;
    return true;
  }

  /**
   * Time Complexity: O(n) - Elements may need to be shifted.
   * Space Complexity: O(1) - Operates in-place.
   */

  /**
   * Time Complexity: O(n) - Elements may need to be shifted.
   * Space Complexity: O(1) - Operates in-place.
   *
   * The `deleteAt` function removes an element at a specified index from an array-like data structure
   * and returns the removed element.
   * @param {number} index - The index parameter represents the position of the element that needs to
   * be deleted from the data structure. It is of type number.
   * @returns The method `deleteAt(index: number)` returns the element that was removed from the data
   * structure, or `undefined` if the index is out of bounds.
   */
  deleteAt(index: number): E | undefined {
    if (index < 0 || index >= this.size) {
      return undefined;
    }

    const actualIndex = this._headOffset + index;
    const removedElement = this._elements[actualIndex];
    for (let i = actualIndex; i < this._tailOffset - 1; i++) {
      this._elements[i] = this._elements[i + 1];
    }
    this._tailOffset--;
    this._elements[this._tailOffset] = undefined as unknown as E; // Clear reference to the last element
    return removedElement;
  }


  /**
   * Time Complexity: O(n) - May need to scan the entire deque.
   * Space Complexity: O(1) - No extra space required.
   */

  /**
   * Time Complexity: O(n) - May need to scan the entire deque.
   * Space Complexity: O(1) - No extra space required.
   *
   * The function returns the index of a given element in an array-like data structure.
   * @param {E} element - The parameter "element" represents the element that you want to find the index of
   * in the array.
   * @returns The method `indexOf` returns the index of the first occurrence of the specified element in
   * the array. If the element is not found, it returns -1.
   */
  indexOf(element: E): number {
    for (let i = this.headOffset; i < this.tailOffset; i++) {
      if (this._elements[i] === element) {
        return i - this.headOffset;
      }
    }
    return -1;
  }

  /**
   * Time Complexity: O(1) - Resets values to defaults.
   * Space Complexity: O(1) - Directly changes existing properties.
   */

  /**
   * Time Complexity: O(1) - Resets values to defaults.
   * Space Complexity: O(1) - Directly changes existing properties.
   *
   * The clear function resets the elements array and head and tail offsets to their initial values.
   */
  clear(): void {
    this._elements = [];
    this._headOffset = 0;
    this._tailOffset = 0;
  }

  /**
   * Time Complexity: O(n) - Iterates over half the deque.
   * Space Complexity: O(1) - In-place reversal.
   */

  /**
   * Time Complexity: O(n) - Iterates over half the deque.
   * Space Complexity: O(1) - In-place reversal.
   *
   * The reverse() function reverses the order of elements in an array.
   */
  reverse(): void {
    let start = this.headOffset;
    let end = this.tailOffset - 1;
    while (start < end) {
      const temp = this._elements[start];
      this._elements[start] = this._elements[end];
      this._elements[end] = temp;
      start++;
      end--;
    }
  }

  /**
   * Time Complexity: O(n) - Copies elements to a new array.
   * Space Complexity: O(n) - New array of deque size.
   */

  /**
   * Time Complexity: O(n) - Copies elements to a new array.
   * Space Complexity: O(n) - New array of deque size.
   *
   * The toArray() function returns an array of elements from a specific index to the end of the array.
   * @returns The `toArray()` method is returning an array of elements (`E[]`). The elements being
   * returned are a slice of the `_elements` array starting from the `headOffset` index.
   */
  toArray(): E[] {
    return this._elements.slice(this.headOffset);
  }

  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   */

  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   *
   * The `find` function iterates over the elements in a collection and returns the first element that
   * satisfies a given condition.
   * @param callback - The `callback` parameter is a function that takes an element of type `E` (the
   * element type of the data structure) and returns a boolean element. It is used to determine whether a
   * given element satisfies a certain condition.
   * @returns The method `find` returns the first element in the array that satisfies the provided
   * callback function. If no element satisfies the callback function, it returns `undefined`.
   */
  find(callback: (element: E) => boolean): E | undefined {
    for (let i = this.headOffset; i < this.tailOffset; i++) {
      if (callback(this._elements[i])) {
        return this._elements[i];
      }
    }
    return undefined;
  }


  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   */

  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   *
   * The forEach function iterates over the elements of an array-like object and executes a callback
   * function for each element.
   * @param callback - The callback parameter is a function that takes two arguments: element and index.
   * The element argument represents the current element being iterated over, and the index argument
   * represents the index of the current element in the iteration.
   */
  forEach(callback: (element: E, index: number) => void): void {
    let index = 0;
    for (let i = this.headOffset; i < this.tailOffset; i++) {
      callback(this._elements[i], index++);
    }
  }


  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   */

  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   *
   * The `map` function takes a callback function and applies it to each element in the deque,
   * returning a new deque with the transformed values.
   * @param callback - The `callback` parameter is a function that takes an element of type `E` (the type
   * of elements in the deque) and returns an element of type `U`. This function is applied to each
   * element in the deque, and the resulting values are used to create a new deque of type `
   * @returns The `map` method is returning a new `Deque` object with the transformed values based on
   * the provided callback function.
   */
  map<U>(callback: (element: E) => U): Deque<U> {
    const newList = new Deque<U>(this.capacity);
    for (let i = this.headOffset; i < this.tailOffset; i++) {
      newList.push(callback(this._elements[i]));
    }
    return newList;
  }


  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   */

  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   *
   * The `filter` function creates a new Deque object with elements that pass a given callback
   * function.
   * @param callback - The `callback` parameter is a function that takes an element of type `E` (the
   * element type of the `Deque`) as its argument and returns a boolean element. This function is used to
   * determine whether an element should be included in the filtered `Deque` or not.
   * @returns The `filter` method is returning a new `Deque` object that contains only the elements
   * that satisfy the condition specified by the `callback` function.
   */
  filter(callback: (element: E) => boolean): Deque<E> {
    const newList = new Deque<E>(this.capacity);
    for (let i = this.headOffset; i < this.tailOffset; i++) {
      if (callback(this._elements[i])) {
        newList.push(this._elements[i]);
      }
    }
    return newList;
  }


  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   */

  /**
   * Time Complexity: O(n) - Iterates through all elements.
   * Space Complexity: O(n) - For methods like map and filter, which create a new deque.
   *
   * The `reduce` function iterates over the elements of a collection and applies a callback function
   * to each element, accumulating a single element.
   * @param callback - The `callback` parameter is a function that takes two arguments: `accumulator`
   * and `element`. It is called for each element in the collection and is used to accumulate a single
   * result.
   * @param {U} initialValue - The `initialValue` parameter is the initial element of the accumulator. It
   * is the element that will be passed as the first argument to the `callback` function when reducing
   * the elements.
   * @returns The `reduce` method is returning the final element of the accumulator after iterating over
   * all the elements in the collection.
   */
  reduce<U>(callback: (accumulator: U, element: E) => U, initialValue: U): U {
    let accumulator = initialValue;
    for (let i = this.headOffset; i < this.tailOffset; i++) {
      accumulator = callback(accumulator, this._elements[i]);
    }
    return accumulator;
  }

  /**
   * Time Complexity: O(1) - Checks the size property.
   * Space Complexity: O(1) - No additional space.
   */

  /**
   * Time Complexity: O(1) - Checks the size property.
   * Space Complexity: O(1) - No additional space.
   *
   * The function checks if the size of an object is equal to zero and returns a boolean element.
   * @returns A boolean element indicating whether the size of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Time Complexity: O(n) - Involves creating a new array and copying elements.
   * Space Complexity: O(n) - New array is twice the size of the old one.
   */

  /**
   * Time Complexity: O(n) - Involves creating a new array and copying elements.
   * Space Complexity: O(n) - New array is twice the size of the old one.
   *
   * The `_resize` function is used to increase the capacity of an array by doubling it and
   * repositioning the elements.
   */
  protected _resize() {
    const newCapacity = this.capacity * 2;
    const newElements = new Array(newCapacity);
    const size = this.size;
    const newHeadOffset = Math.floor((newCapacity - size) / 2);

    for (let i = 0; i < size; i++) {
      newElements[newHeadOffset + i] = this._elements[this._headOffset + i];
    }

    this._elements = newElements;
    this._capacity = newCapacity;
    this._headOffset = newHeadOffset;
    this._tailOffset = newHeadOffset + size;
  }

  /**
   * The function `_ensureCapacityForInsert` checks if there is enough capacity in an array and resizes
   * it if necessary.
   * @returns The method is returning nothing (void).
   */
  protected _ensureCapacityForInsert() {
    if (this.tailOffset < this.capacity) {
      return;
    }
    this._resize();
  }
}

// O(1) time complexity of obtaining the element
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
   * The "addFirst" function adds an element to the beginning of an array-like data structure.
   * @param {E} element - The `element` parameter represents the element that you want to add to the beginning of the data
   * structure.
   */
  addFirst(element: E) {
    if (this.size === 0) {
      const mid = Math.floor(this.capacity / 2);
      this._first = mid;
      this._last = mid;
    } else {
      this._first--;
    }
    this.nodes[this.first] = element;
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
   * The addLast function adds an element to the end of an array-like data structure.
   * @param {E} element - The `element` parameter represents the element that you want to add to the end of the data structure.
   */
  addLast(element: E) {
    if (this.size === 0) {
      const mid = Math.floor(this.capacity / 2);
      this._first = mid;
      this._last = mid;
    } else {
      this._last++;
    }
    this.nodes[this.last] = element;
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
   * @returns The element of the first element in the data structure.
   */
  popFirst() {
    if (!this.size) return;
    const element = this.getFirst();
    delete this.nodes[this.first];
    this._first++;
    this._size--;
    return element;
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
   * @returns The element that was removed from the data structure.
   */
  popLast() {
    if (!this.size) return;
    const element = this.getLast();
    delete this.nodes[this.last];
    this._last--;
    this._size--;

    return element;
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
   * index, `undefined` is returned.
   */
  get(index: number) {
    return this.nodes[this.first + index] || undefined;
  }

  /**
   * The function checks if the size of a data structure is less than or equal to zero.
   * @returns The method is returning a boolean element indicating whether the size of the object is less than or equal to 0.
   */
  isEmpty() {
    return this.size <= 0;
  }
}