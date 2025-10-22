/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type { ElementCallback, IterableElementBaseOptions, StackOptions } from '../../types';
import { IterableElementBase } from '../base';

/**
 * LIFO stack with array storage and optional record→element conversion.
 * @remarks Time O(1), Space O(1)
 * @template E
 * @template R
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
  protected _equals: (a: E, b: E) => boolean = Object.is as unknown as (a: E, b: E) => boolean;

  /**
   * Create a Stack and optionally bulk-push elements.
   * @remarks Time O(N), Space O(N)
   * @param [elements] - Iterable of elements (or raw records if toElementFn is set).
   * @param [options] - Options such as toElementFn and equality function.
   * @returns New Stack instance.
   */

  constructor(elements: Iterable<E> | Iterable<R> = [], options?: StackOptions<E, R>) {
    super(options);
    this.pushMany(elements);
  }

  protected _elements: E[] = [];

  /**
   * Get the backing array of elements.
   * @remarks Time O(1), Space O(1)
   * @returns Internal elements array.
   */

  get elements(): E[] {
    return this._elements;
  }

  /**
   * Get the number of stored elements.
   * @remarks Time O(1), Space O(1)
   * @returns Current size.
   */

  get size(): number {
    return this.elements.length;
  }

  /**
   * Create a stack from an array of elements.
   * @remarks Time O(N), Space O(N)
   * @template E
   * @template R
   * @param this - The constructor (subclass) to instantiate.
   * @param elements - Array of elements to push in order.
   * @param [options] - Options forwarded to the constructor.
   * @returns A new Stack populated from the array.
   */

  static fromArray<E, R = any>(
    this: new (elements?: Iterable<E> | Iterable<R>, options?: StackOptions<E, R>) => any,
    elements: E[],
    options?: StackOptions<E, R>
  ) {
    return new this(elements, options);
  }

  /**
   * Check whether the stack is empty.
   * @remarks Time O(1), Space O(1)
   * @returns True if size is 0.
   */

  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  /**
   * Get the top element without removing it.
   * @remarks Time O(1), Space O(1)
   * @returns Top element or undefined.
   */

  peek(): E | undefined {
    return this.isEmpty() ? undefined : this.elements[this.elements.length - 1];
  }

  /**
   * Push one element onto the top.
   * @remarks Time O(1), Space O(1)
   * @param element - Element to push.
   * @returns True when pushed.
   */

  push(element: E): boolean {
    this.elements.push(element);
    return true;
  }

  /**
   * Pop and return the top element.
   * @remarks Time O(1), Space O(1)
   * @returns Removed element or undefined.
   */

  pop(): E | undefined {
    return this.isEmpty() ? undefined : this.elements.pop();
  }

  /**
   * Push many elements from an iterable.
   * @remarks Time O(N), Space O(1)
   * @param elements - Iterable of elements (or raw records if toElementFn is set).
   * @returns Array of per-element success flags.
   */

  pushMany(elements: Iterable<E> | Iterable<R>): boolean[] {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) ans.push(this.push(this.toElementFn(el as R)));
      else ans.push(this.push(el as E));
    }
    return ans;
  }

  /**
   * Delete the first occurrence of a specific element.
   * @remarks Time O(N), Space O(1)
   * @param element - Element to remove (using the configured equality).
   * @returns True if an element was removed.
   */

  delete(element: E): boolean {
    const idx = this._indexOfByEquals(element);
    return this.deleteAt(idx);
  }

  /**
   * Delete the element at an index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index from the bottom.
   * @returns True if removed.
   */

  deleteAt(index: number): boolean {
    if (index < 0 || index >= this.elements.length) return false;
    const spliced = this.elements.splice(index, 1);
    return spliced.length === 1;
  }

  /**
   * Delete the first element that satisfies a predicate.
   * @remarks Time O(N), Space O(1)
   * @param predicate - Function (value, index, stack) → boolean to decide deletion.
   * @returns True if a match was removed.
   */

  deleteWhere(predicate: (value: E, index: number, stack: this) => boolean): boolean {
    for (let i = 0; i < this.elements.length; i++) {
      if (predicate(this.elements[i], i, this)) {
        this.elements.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Remove all elements and reset storage.
   * @remarks Time O(1), Space O(1)
   * @returns void
   */

  clear(): void {
    this._elements = [];
  }

  /**
   * Deep clone this stack.
   * @remarks Time O(N), Space O(N)
   * @returns A new stack with the same content.
   */

  clone(): this {
    const out = this._createInstance({ toElementFn: this.toElementFn });
    for (const v of this) out.push(v);
    return out;
  }

  /**
   * Filter elements into a new stack of the same class.
   * @remarks Time O(N), Space O(N)
   * @param predicate - Predicate (value, index, stack) → boolean to keep value.
   * @param [thisArg] - Value for `this` inside the predicate.
   * @returns A new stack with kept values.
   */

  filter(predicate: ElementCallback<E, R, boolean>, thisArg?: unknown): this {
    const out = this._createInstance({ toElementFn: this.toElementFn });
    let index = 0;
    for (const v of this) {
      if (predicate.call(thisArg, v, index, this)) out.push(v);
      index++;
    }
    return out;
  }

  /**
   * Map values into a new stack of the same element type.
   * @remarks Time O(N), Space O(N)
   * @param callback - Mapping function (value, index, stack) → newValue.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new stack with mapped values.
   */

  mapSame(callback: ElementCallback<E, R, E>, thisArg?: unknown): this {
    const out = this._createInstance({ toElementFn: this.toElementFn });
    let index = 0;
    for (const v of this) {
      const mv = thisArg === undefined ? callback(v, index++, this) : callback.call(thisArg, v, index++, this);
      out.push(mv);
    }
    return out;
  }

  /**
   * Map values into a new stack (possibly different element type).
   * @remarks Time O(N), Space O(N)
   * @template EM
   * @template RM
   * @param callback - Mapping function (value, index, stack) → newElement.
   * @param [options] - Options for the output stack (e.g., toElementFn).
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new Stack with mapped elements.
   */

  map<EM, RM>(
    callback: ElementCallback<E, R, EM>,
    options?: IterableElementBaseOptions<EM, RM>,
    thisArg?: unknown
  ): Stack<EM, RM> {
    const out = this._createLike<EM, RM>([], { ...(options ?? {}) });
    let index = 0;
    for (const v of this) {
      out.push(thisArg === undefined ? callback(v, index, this) : callback.call(thisArg, v, index, this));
      index++;
    }
    return out;
  }

  /**
   * Set the equality comparator used by delete/search operations.
   * @remarks Time O(1), Space O(1)
   * @param equals - Equality predicate (a, b) → boolean.
   * @returns This stack.
   */

  setEquality(equals: (a: E, b: E) => boolean): this {
    this._equals = equals;
    return this;
  }

  /**
   * (Protected) Find the index of a target element using the equality function.
   * @remarks Time O(N), Space O(1)
   * @param target - Element to search for.
   * @returns Index or -1 if not found.
   */

  protected _indexOfByEquals(target: E): number {
    for (let i = 0; i < this.elements.length; i++) if (this._equals(this.elements[i], target)) return i;
    return -1;
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind stack instance.
   */

  protected _createInstance(options?: StackOptions<E, R>): this {
    const Ctor = this.constructor as new (elements?: Iterable<E> | Iterable<R>, options?: StackOptions<E, R>) => this;
    return new Ctor([], options);
  }

  /**
   * (Protected) Create a like-kind stack and seed it from an iterable.
   * @remarks Time O(N), Space O(N)
   * @template T
   * @template RR
   * @param [elements] - Iterable used to seed the new stack.
   * @param [options] - Options forwarded to the constructor.
   * @returns A like-kind Stack instance.
   */

  protected _createLike<T = E, RR = R>(
    elements: Iterable<T> | Iterable<RR> = [],
    options?: StackOptions<T, RR>
  ): Stack<T, RR> {
    const Ctor = this.constructor as new (
      elements?: Iterable<T> | Iterable<RR>,
      options?: StackOptions<T, RR>
    ) => Stack<T, RR>;
    return new Ctor(elements, options);
  }

  /**
   * (Protected) Iterate elements from bottom to top.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of elements.
   */

  protected *_getIterator(): IterableIterator<E> {
    for (let i = 0; i < this.elements.length; i++) yield this.elements[i];
  }
}
