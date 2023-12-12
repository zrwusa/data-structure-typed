/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { ElementCallback } from '../../types';
import { IterableElementBase } from '../base';

/**
 * 1. Last In, First Out (LIFO): The core characteristic of a stack is its last in, first out nature, meaning the last element added to the stack will be the first to be removed.
 * 2. Uses: Stacks are commonly used for managing a series of tasks or elements that need to be processed in a last in, first out manner. They are widely used in various scenarios, such as in function calls in programming languages, evaluation of arithmetic expressions, and backtracking algorithms.
 * 3. Performance: Stack operations are typically O(1) in time complexity, meaning that regardless of the stack's size, adding, removing, and viewing the top element are very fast operations.
 * 4. Function Calls: In most modern programming languages, the records of function calls are managed through a stack. When a function is called, its record (including parameters, local variables, and return address) is 'pushed' into the stack. When the function returns, its record is 'popped' from the stack.
 * 5. Expression Evaluation: Used for the evaluation of arithmetic or logical expressions, especially when dealing with parenthesis matching and operator precedence.
 * 6. Backtracking Algorithms: In problems where multiple branches need to be explored but only one branch can be explored at a time, stacks can be used to save the state at each branching point.
 */
export class Stack<E = any> extends IterableElementBase<E> {
  /**
   * The constructor initializes an array of elements, which can be provided as an optional parameter.
   * @param {E[]} [elements] - The `elements` parameter is an optional parameter of type `E[]`, which represents an array
   * of elements of type `E`. It is used to initialize the `_elements` property of the class. If the `elements` parameter
   * is provided and is an array, it is assigned to the `_elements
   */
  constructor(elements?: Iterable<E>) {
    super();
    this._elements = [];
    if (elements) {
      for (const el of elements) {
        this.push(el);
      }
    }
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
   * The size() function returns the number of elements in an array.
   * @returns The size of the elements array.
   */
  get size(): number {
    return this.elements.length;
  }

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
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   */

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   *
   * The `peek` function returns the last element of an array, or undefined if the array is empty.
   * @returns The `peek()` function returns the last element of the `_elements` array, or `undefined` if the array is empty.
   */
  peek(): E | undefined {
    if (this.isEmpty()) return undefined;

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
  push(element: E): boolean {
    this.elements.push(element);
    return true;
  }

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   */

  /**
   * Time Complexity: O(1), as it only involves accessing the last element of the array.
   * Space Complexity: O(1), as it does not use any additional space.
   *
   * The `pop` function removes and returns the last element from an array, or returns undefined if the array is empty.
   * @returns The `pop()` method is returning the last element of the array `_elements` if the array is not empty. If the
   * array is empty, it returns `undefined`.
   */
  pop(): E | undefined {
    if (this.isEmpty()) return;

    return this.elements.pop();
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

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new stack containing elements from the original stack that satisfy
   * a given predicate function.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * the current element being iterated over, the index of the current element, and the stack itself.
   * It should return a boolean value indicating whether the element should be included in the filtered
   * stack or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `predicate` function. If `thisArg` is
   * @returns The `filter` method is returning a new `Stack` object that contains the elements that
   * satisfy the given predicate function.
   */
  filter(predicate: ElementCallback<E, boolean>, thisArg?: any): Stack<E> {
    const newStack = new Stack<E>();
    let index = 0;
    for (const el of this) {
      if (predicate.call(thisArg, el, index, this)) {
        newStack.push(el);
      }
      index++;
    }
    return newStack;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function takes a callback function and applies it to each element in the stack,
   * returning a new stack with the results.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the stack. It takes three arguments:
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `map` method is returning a new `Stack` object.
   */
  map<T>(callback: ElementCallback<E, T>, thisArg?: any): Stack<T> {
    const newStack = new Stack<T>();
    let index = 0;
    for (const el of this) {
      newStack.push(callback.call(thisArg, el, index, this));
      index++;
    }
    return newStack;
  }

  /**
   * Custom iterator for the Stack class.
   * @returns An iterator object.
   */
  protected* _getIterator(): IterableIterator<E> {
    for (let i = 0; i < this.elements.length; i++) {
      yield this.elements[i];
    }
  }
}
