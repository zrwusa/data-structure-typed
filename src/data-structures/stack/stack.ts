/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { ElementCallback, StackOptions } from '../../types';
import { IterableElementBase } from '../base';

/**
 * 1. Last In, First Out (LIFO): The core characteristic of a stack is its last in, first out nature, meaning the last element added to the stack will be the first to be removed.
 * 2. Uses: Stacks are commonly used for managing a series of tasks or elements that need to be processed in a last in, first out manner. They are widely used in various scenarios, such as in function calls in programming languages, evaluation of arithmetic expressions, and backtracking algorithms.
 * 3. Performance: Stack operations are typically O(1) in time complexity, meaning that regardless of the stack's size, adding, removing, and viewing the top element are very fast operations.
 * 4. Function Calls: In most modern programming languages, the records of function calls are managed through a stack. When a function is called, its record (including parameters, local variables, and return address) is 'pushed' into the stack. When the function returns, its record is 'popped' from the stack.
 * 5. Expression Evaluation: Used for the evaluation of arithmetic or logical expressions, especially when dealing with parenthesis matching and operator precedence.
 * 6. Backtracking Algorithms: In problems where multiple branches need to be explored but only one branch can be explored at a time, stacks can be used to save the state at each branching point.
 * @example
 * // Balanced Parentheses or Brackets
 *     type ValidCharacters = ')' | '(' | ']' | '[' | '}' | '{';
 *
 *     const stack = new Stack<string>();
 *     const input: ValidCharacters[] = '[({})]'.split('') as ValidCharacters[];
 *     const matches: { [key in ValidCharacters]?: ValidCharacters } = { ')': '(', ']': '[', '}': '{' };
 *     for (const char of input) {
 *       if ('([{'.includes(char)) {
 *         stack.push(char);
 *       } else if (')]}'.includes(char)) {
 *         if (stack.pop() !== matches[char]) {
 *           fail('Parentheses are not balanced');
 *         }
 *       }
 *     }
 *     console.log(stack.isEmpty()); // true
 * @example
 * // Expression Evaluation and Conversion
 *     const stack = new Stack<number>();
 *     const expression = [5, 3, '+']; // Equivalent to 5 + 3
 *     expression.forEach(token => {
 *       if (typeof token === 'number') {
 *         stack.push(token);
 *       } else {
 *         const b = stack.pop()!;
 *         const a = stack.pop()!;
 *         stack.push(token === '+' ? a + b : 0); // Only handling '+' here
 *       }
 *     });
 *     console.log(stack.pop()); // 8
 * @example
 * // Depth-First Search (DFS)
 *     const stack = new Stack<number>();
 *     const graph: { [key in number]: number[] } = { 1: [2, 3], 2: [4], 3: [5], 4: [], 5: [] };
 *     const visited: number[] = [];
 *     stack.push(1);
 *     while (!stack.isEmpty()) {
 *       const node = stack.pop()!;
 *       if (!visited.includes(node)) {
 *         visited.push(node);
 *         graph[node].forEach(neighbor => stack.push(neighbor));
 *       }
 *     }
 *     console.log(visited); // [1, 3, 5, 2, 4]
 * @example
 * // Backtracking Algorithms
 *     const stack = new Stack<[number, number]>();
 *     const maze = [
 *       ['S', ' ', 'X'],
 *       ['X', ' ', 'X'],
 *       [' ', ' ', 'E']
 *     ];
 *     const start: [number, number] = [0, 0];
 *     const end = [2, 2];
 *     const directions = [
 *       [0, 1], // To the right
 *       [1, 0], // down
 *       [0, -1], // left
 *       [-1, 0] // up
 *     ];
 *
 *     const visited = new Set<string>(); // Used to record visited nodes
 *     stack.push(start);
 *     const path: number[][] = [];
 *
 *     while (!stack.isEmpty()) {
 *       const [x, y] = stack.pop()!;
 *       if (visited.has(`${x},${y}`)) continue; // Skip already visited nodes
 *       visited.add(`${x},${y}`);
 *
 *       path.push([x, y]);
 *
 *       if (x === end[0] && y === end[1]) {
 *         break; // Find the end point and exit
 *       }
 *
 *       for (const [dx, dy] of directions) {
 *         const nx = x + dx;
 *         const ny = y + dy;
 *         if (
 *           maze[nx]?.[ny] === ' ' || // feasible path
 *           maze[nx]?.[ny] === 'E' // destination
 *         ) {
 *           stack.push([nx, ny]);
 *         }
 *       }
 *     }
 *
 *     expect(path).toContainEqual(end);
 * @example
 * // Function Call Stack
 *     const functionStack = new Stack<string>();
 *     functionStack.push('main');
 *     functionStack.push('foo');
 *     functionStack.push('bar');
 *     console.log(functionStack.pop()); // 'bar'
 *     console.log(functionStack.pop()); // 'foo'
 *     console.log(functionStack.pop()); // 'main'
 * @example
 * // Simplify File Paths
 *     const stack = new Stack<string>();
 *     const path = '/a/./b/../../c';
 *     path.split('/').forEach(segment => {
 *       if (segment === '..') stack.pop();
 *       else if (segment && segment !== '.') stack.push(segment);
 *     });
 *     console.log(stack.elements.join('/')); // 'c'
 * @example
 * // Stock Span Problem
 *     const stack = new Stack<number>();
 *     const prices = [100, 80, 60, 70, 60, 75, 85];
 *     const spans: number[] = [];
 *     prices.forEach((price, i) => {
 *       while (!stack.isEmpty() && prices[stack.peek()!] <= price) {
 *         stack.pop();
 *       }
 *       spans.push(stack.isEmpty() ? i + 1 : i - stack.peek()!);
 *       stack.push(i);
 *     });
 *     console.log(spans); // [1, 1, 1, 2, 1, 4, 6]
 */
export class Stack<E = any, R = any> extends IterableElementBase<E, R> {
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: StackOptions<E, R>) {
    super(options);
    this.pushMany(elements);
  }

  protected _elements: E[] = [];

  /**
   * The elements function returns the elements of this set.
   * @return An array of elements
   */
  get elements(): E[] {
    return this._elements;
  }

  /**
   * The size() function returns the number of elements in an array.
   * @returns The size of the elements array.
   */
  get size(): number {
    return this.elements.length;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if an array is empty and returns a boolean value.
   * @returns A boolean value indicating whether the `_elements` array is empty or not.
   */
  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `peek` function returns the last element of an array, or undefined if the array is empty.
   * @returns The `peek()` function returns the last element of the `_elements` array, or `undefined` if the array is empty.
   */
  peek(): E | undefined {
    if (this.isEmpty()) return undefined;

    return this.elements[this.elements.length - 1];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
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
   * Time Complexity: O(k)
   * Space Complexity: O(1)
   *
   * The function `pushMany` iterates over elements and pushes them into an array after applying a
   * transformation function if provided.
   * @param {Iterable<E> | Iterable<R>} elements - The `elements` parameter in the `pushMany` function
   * is an iterable containing elements of type `E` or `R`. The function iterates over each element in
   * the iterable and pushes it into the data structure. If a transformation function `toElementFn` is
   * provided, it is used to
   * @returns The `pushMany` function is returning an array of boolean values indicating whether each
   * element was successfully pushed into the data structure.
   */
  pushMany(elements: Iterable<E> | Iterable<R>) {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) {
        ans.push(this.push(this.toElementFn(el as R)));
      } else {
        ans.push(this.push(el as E));
      }
    }
    return ans;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The toArray function returns a copy of the elements in an array.
   * @returns An array of type E.
   */
  delete(element: E): boolean {
    const index = this.elements.indexOf(element);
    return this.deleteAt(index);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The toArray function returns a copy of the elements in an array.
   * @returns An array of type E.
   */
  deleteAt(index: number): boolean {
    const spliced = this.elements.splice(index, 1);
    return spliced.length === 1;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The clear function clears the elements array.
   */
  clear(): void {
    this._elements = [];
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone()` function returns a new `Stack` object with the same elements as the original stack.
   * @returns The `clone()` method is returning a new `Stack` object with a copy of the `_elements` array.
   */
  clone(): Stack<E, R> {
    return new Stack<E, R>(this, { toElementFn: this.toElementFn });
  }

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
  filter(predicate: ElementCallback<E, R, boolean>, thisArg?: any): Stack<E, R> {
    const newStack = new Stack<E, R>([], { toElementFn: this.toElementFn });
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
   *
   * The `map` function takes a callback function and applies it to each element in the stack,
   * returning a new stack with the results.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * stack. It takes three arguments: the current element, the index of the element, and the stack
   * itself. It should return a new value that will be added to the new stack.
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be used to
   * transform the raw element (`RM`) into a new element (`EM`) before pushing it into the new stack.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new Stack object with elements of type EM and raw elements of type RM.
   */
  map<EM, RM>(callback: ElementCallback<E, R, EM>, toElementFn?: (rawElement: RM) => EM, thisArg?: any): Stack<EM, RM> {
    const newStack = new Stack<EM, RM>([], { toElementFn });
    let index = 0;
    for (const el of this) {
      newStack.push(callback.call(thisArg, el, index, this));
      index++;
    }
    return newStack;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * Custom iterator for the Stack class.
   * @returns An iterator object.
   */
  protected *_getIterator(): IterableIterator<E> {
    for (let i = 0; i < this.elements.length; i++) {
      yield this.elements[i];
    }
  }
}
