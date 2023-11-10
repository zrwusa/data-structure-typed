/**
 * @license MIT
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @class
 */
export class Stack<E = any> {
  /**
   * The constructor initializes an array of elements, which can be provided as an optional parameter.
   * @param {E[]} [elements] - The `elements` parameter is an optional parameter of type `E[]`, which represents an array
   * of elements of type `E`. It is used to initialize the `_elements` property of the class. If the `elements` parameter
   * is provided and is an array, it is assigned to the `_elements
   */
  constructor(elements?: E[]) {
    this._elements = Array.isArray(elements) ? elements : [];
  }

  protected _elements: E[];

  get elements(): E[] {
    return this._elements;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the input array. Similar to the constructor, it requires iterating through each element.
   * Space Complexity: O(n), as it creates a new stack with the elements from the input array.
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the input array. Similar to the constructor, it requires iterating through each element.
   * Space Complexity: O(n), as it creates a new stack with the elements from the input array.
   *
   * The function "fromArray" creates a new Stack object from an array of elements.
   * @param {E[]} elements - The `elements` parameter is an array of elements of type `E`.
   * @returns {Stack} The method is returning a new instance of the Stack class, initialized with the elements from the input
   * array.
   */
  static fromArray<E>(elements: E[]): Stack<E> {
    return new Stack(elements);
  }

  /**
   * The function checks if an array is empty and returns a boolean value.
   * @returns A boolean value indicating whether the `_elements` array is empty or not.
   */
  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  /**
   * The size() function returns the number of elements in an array.
   * @returns The size of the elements array.
   */
  size(): number {
    return this.elements.length;
  }

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   */

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   *
   * The `peek` function returns the last element of an array, or null if the array is empty.
   * @returns The `peek()` function returns the last element of the `_elements` array, or `null` if the array is empty.
   */
  peek(): E | null {
    if (this.isEmpty()) return null;

    return this.elements[this.elements.length - 1];
  }

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   */

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   *
   * The push function adds an element to the stack and returns the updated stack.
   * @param {E} element - The parameter "element" is of type E, which means it can be any data type.
   * @returns The `push` method is returning the updated `Stack<E>` object.
   */
  push(element: E): Stack<E> {
    this.elements.push(element);
    return this;
  }

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   */

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   *
   * The `pop` function removes and returns the last element from an array, or returns null if the array is empty.
   * @returns The `pop()` method is returning the last element of the array `_elements` if the array is not empty. If the
   * array is empty, it returns `null`.
   */
  pop(): E | null {
    if (this.isEmpty()) return null;

    return this.elements.pop() || null;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The toArray function returns a copy of the elements in an array.
   * @returns An array of type E.
   */
  toArray(): E[] {
    return this.elements.slice();
  }

  /**
   * The clear function clears the elements array.
   */
  clear(): void {
    this._elements = [];
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the stack, as it creates a new stack and copies all elements into it.
   * Space Complexity: O(n), as it creates a new stack.
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the stack, as it creates a new stack and copies all elements into it.
   * Space Complexity: O(n), as it creates a new stack.
   *
   * The `clone()` function returns a new `Stack` object with the same elements as the original stack.
   * @returns The `clone()` method is returning a new `Stack` object with a copy of the `_elements` array.
   */
  clone(): Stack<E> {
    return new Stack(this.elements.slice());
  }
}
