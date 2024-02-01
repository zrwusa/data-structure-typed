import { ElementCallback, IterableElementBaseOptions, ReduceElementCallback } from '../../types';

export abstract class IterableElementBase<E, R, C> {
  /**
   * The protected constructor initializes the options for the IterableElementBase class, including the
   * toElementFn function.
   * @param [options] - An optional object that contains the following properties:
   */
  protected constructor(options?: IterableElementBaseOptions<E, R>) {
    if (options) {
      const { toElementFn } = options;
      if (typeof toElementFn === 'function') this._toElementFn = toElementFn;
      else if (toElementFn) throw new TypeError('toElementFn must be a function type');
    }
  }

  abstract get size(): number;

  protected _toElementFn?: (rawElement: R) => E;

  /**
   * The function returns the _toElementFn property, which is a function that converts a raw element to
   * a specific type.
   * @returns The function `get toElementFn()` is returning either a function that takes a raw element
   * `rawElement` of type `R` and returns an element `E`, or `undefined` if no function is assigned to
   * `_toElementFn`.
   */
  get toElementFn(): ((rawElement: R) => E) | undefined {
    return this._toElementFn;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function is an implementation of the Symbol.iterator method that returns an IterableIterator.
   * @param {any[]} args - The `args` parameter in the code snippet represents a rest parameter. It
   * allows the function to accept any number of arguments as an array. In this case, the `args`
   * parameter is used to pass any number of arguments to the `_getIterator` method.
   */
  * [Symbol.iterator](...args: any[]): IterableIterator<E> {
    yield* this._getIterator(...args);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function returns an iterator that yields all the values in the object.
   */
  * values(): IterableIterator<E> {
    for (const item of this) {
      yield item;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `every` function checks if every element in the array satisfies a given predicate.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * the current element being processed, its index, and the array it belongs to. It should return a
   * boolean value indicating whether the element satisfies a certain condition or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `predicate` function. If `thisArg` is
   * @returns The `every` method is returning a boolean value. It returns `true` if every element in
   * the array satisfies the provided predicate function, and `false` otherwise.
   */
  every(predicate: ElementCallback<E, R, boolean, C>, thisArg?: any): boolean {
    let index = 0;
    for (const item of this) {
      if (!predicate.call(thisArg, item, index++, this)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The "some" function checks if at least one element in a collection satisfies a given predicate.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * `value`, `index`, and `array`. It should return a boolean value indicating whether the current
   * element satisfies the condition.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as the `this` value when executing the `predicate` function. If `thisArg` is provided,
   * it will be passed as the `this` value to the `predicate` function. If `thisArg
   * @returns a boolean value. It returns true if the predicate function returns true for any element
   * in the collection, and false otherwise.
   */
  some(predicate: ElementCallback<E, R, boolean, C>, thisArg?: any): boolean {
    let index = 0;
    for (const item of this) {
      if (predicate.call(thisArg, item, index++, this)) {
        return true;
      }
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
   * The `forEach` function iterates over each element in an array-like object and calls a callback
   * function for each element.
   * @param callbackfn - The callbackfn parameter is a function that will be called for each element in
   * the array. It takes three arguments: the current element being processed, the index of the current
   * element, and the array that forEach was called upon.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callbackfn` function. If `thisArg` is provided, it will
   * be passed as the `this` value to the `callbackfn` function. If `thisArg
   */
  forEach(callbackfn: ElementCallback<E, R, void, C>, thisArg?: any): void {
    let index = 0;
    for (const item of this) {
      callbackfn.call(thisArg, item, index++, this);
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `find` function iterates over the elements of an array-like object and returns the first
   * element that satisfies the provided callback function.
   * @param callbackfn - The callbackfn parameter is a function that will be called for each element in
   * the array. It takes three arguments: the current element being processed, the index of the current
   * element, and the array itself. The function should return a boolean value indicating whether the
   * current element matches the desired condition.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callbackfn` function. If `thisArg` is provided, it will
   * be passed as the `this` value to the `callbackfn` function. If `thisArg
   * @returns The `find` method returns the first element in the array that satisfies the provided
   * callback function. If no element satisfies the callback function, `undefined` is returned.
   */
  find(callbackfn: ElementCallback<E, R, boolean, C>, thisArg?: any): E | undefined {
    let index = 0;
    for (const item of this) {
      if (callbackfn.call(thisArg, item, index++, this)) return item;
    }

    return;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function checks if a given element exists in a collection.
   * @param {E} element - The parameter "element" is of type E, which means it can be any type. It
   * represents the element that we want to check for existence in the collection.
   * @returns a boolean value. It returns true if the element is found in the collection, and false
   * otherwise.
   */
  has(element: E): boolean {
    for (const ele of this) {
      if (ele === element) return true;
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
   * The `reduce` function iterates over the elements of an array-like object and applies a callback
   * function to reduce them into a single value.
   * @param callbackfn - The callbackfn parameter is a function that will be called for each element in
   * the array. It takes four arguments:
   * @param {U} initialValue - The initialValue parameter is the initial value of the accumulator. It
   * is the value that the accumulator starts with before the reduction operation begins.
   * @returns The `reduce` method is returning the final value of the accumulator after iterating over
   * all the elements in the array and applying the callback function to each element.
   */
  reduce<U>(callbackfn: ReduceElementCallback<E, R, U, C>, initialValue: U): U {
    let accumulator = initialValue;
    let index = 0;
    for (const item of this) {
      accumulator = callbackfn(accumulator, item as E, index++, this);
    }
    return accumulator;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The print function logs the elements of an array to the console.
   */
  print(): void {
    console.log([...this]);
  }

  abstract isEmpty(): boolean;

  abstract clear(): void;

  abstract clone(): C;

  abstract map(...args: any[]): any;

  abstract filter(...args: any[]): any;

  protected abstract _getIterator(...args: any[]): IterableIterator<E>;
}
