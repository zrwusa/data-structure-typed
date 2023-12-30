import { ElementCallback, EntryCallback, ReduceElementCallback, ReduceEntryCallback } from '../../types';

export abstract class IterableEntryBase<K = any, V = any> {
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function is an implementation of the Symbol.iterator method that returns an iterable iterator.
   * @param {any[]} args - The `args` parameter in the code snippet represents a rest parameter. It
   * allows the function to accept any number of arguments as an array. In this case, the `args`
   * parameter is used to pass any additional arguments to the `_getIterator` method.
   */
  * [Symbol.iterator](...args: any[]): IterableIterator<[K, V]> {
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
   * The function returns an iterator that yields key-value pairs from the object, where the value can
   * be undefined.
   */
  * entries(): IterableIterator<[K, V | undefined]> {
    for (const item of this) {
      yield item;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function returns an iterator that yields the keys of a data structure.
   */
  * keys(): IterableIterator<K> {
    for (const item of this) {
      yield item[0];
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function returns an iterator that yields the values of a collection.
   */
  * values(): IterableIterator<V> {
    for (const item of this) {
      yield item[1];
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
   * The `every` function checks if every element in a collection satisfies a given condition.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * `value`, `key`, and `index`. It should return a boolean value indicating whether the condition is
   * met for the current element in the iteration.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the first argument to the `predicate` function. If `thisArg` is not provided
   * @returns The `every` method is returning a boolean value. It returns `true` if every element in
   * the collection satisfies the provided predicate function, and `false` otherwise.
   */
  every(predicate: EntryCallback<K, V, boolean>, thisArg?: any): boolean {
    let index = 0;
    for (const item of this) {
      if (!predicate.call(thisArg, item[1], item[0], index++, this)) {
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
   *
   * The "some" function iterates over a collection and returns true if at least one element satisfies
   * a given predicate.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * `value`, `key`, and `index`. It should return a boolean value indicating whether the condition is
   * met for the current element in the iteration.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as the `this` value when executing the `predicate` function. If `thisArg` is provided,
   * it will be passed as the first argument to the `predicate` function. If `thisArg` is
   * @returns a boolean value. It returns true if the predicate function returns true for any pair in
   * the collection, and false otherwise.
   */
  some(predicate: EntryCallback<K, V, boolean>, thisArg?: any): boolean {
    let index = 0;
    for (const item of this) {
      if (predicate.call(thisArg, item[1], item[0], index++, this)) {
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
   * The `forEach` function iterates over each key-value pair in a collection and executes a callback
   * function for each pair.
   * @param callbackfn - The callback function that will be called for each element in the collection.
   * It takes four parameters: the value of the current element, the key of the current element, the
   * index of the current element, and the collection itself.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. If `thisArg` is provided, it will be
   * used as the `this` value when calling the callback function. If `thisArg` is not provided, `
   */
  forEach(callbackfn: EntryCallback<K, V, void>, thisArg?: any): void {
    let index = 0;
    for (const item of this) {
      const [key, value] = item;
      callbackfn.call(thisArg, value, key, index++, this);
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
   * The `find` function iterates over the entries of a collection and returns the first value for
   * which the callback function returns true.
   * @param callbackfn - The callback function that will be called for each entry in the collection. It
   * takes three arguments: the value of the entry, the key of the entry, and the index of the entry in
   * the collection. It should return a boolean value indicating whether the current entry matches the
   * desired condition.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callbackfn` function. If `thisArg` is provided, it will
   * be passed as the `this` value to the `callbackfn` function. If `thisArg
   * @returns The method `find` returns the value of the first element in the iterable that satisfies
   * the provided callback function. If no element satisfies the callback function, `undefined` is
   * returned.
   */
  find(callbackfn: EntryCallback<K, V, [K, V]>, thisArg?: any): [K, V] | undefined {
    let index = 0;
    for (const item of this) {
      const [key, value] = item;
      if (callbackfn.call(thisArg, value, key, index++, this)) return item;
    }
    return;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function checks if a given key exists in a collection.
   * @param {K} key - The parameter "key" is of type K, which means it can be any type. It represents
   * the key that we want to check for existence in the data structure.
   * @returns a boolean value. It returns true if the key is found in the collection, and false
   * otherwise.
   */
  has(key: K): boolean {
    for (const item of this) {
      const [itemKey] = item;
      if (itemKey === key) return true;
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
   * The function checks if a given value exists in a collection.
   * @param {V} value - The parameter "value" is the value that we want to check if it exists in the
   * collection.
   * @returns a boolean value, either true or false.
   */
  hasValue(value: V): boolean {
    for (const [, elementValue] of this) {
      if (elementValue === value) return true;
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
   * The `get` function retrieves the value associated with a given key from a collection.
   * @param {K} key - K (the type of the key) - This parameter represents the key that is being
   * searched for in the collection.
   * @returns The `get` method returns the value associated with the specified key if it exists in the
   * collection, otherwise it returns `undefined`.
   */
  get(key: K): V | undefined {
    for (const item of this) {
      const [itemKey, value] = item;
      if (itemKey === key) return value;
    }
    return;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reduce` function iterates over key-value pairs and applies a callback function to each pair,
   * accumulating a single value.
   * @param callbackfn - The callback function that will be called for each element in the collection.
   * It takes four arguments: the current accumulator value, the current value of the element, the key
   * of the element, and the index of the element in the collection. It should return the updated
   * accumulator value.
   * @param {U} initialValue - The `initialValue` parameter is the initial value of the accumulator. It
   * is the value that will be used as the first argument to the `callbackfn` function when reducing
   * the elements of the collection.
   * @returns The `reduce` method is returning the final value of the accumulator after iterating over
   * all the elements in the collection.
   */
  reduce<U>(callbackfn: ReduceEntryCallback<K, V, U>, initialValue: U): U {
    let accumulator = initialValue;
    let index = 0;
    for (const item of this) {
      const [key, value] = item;
      accumulator = callbackfn(accumulator, value, key, index++, this);
    }
    return accumulator;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  print(): void {
    console.log([...this]);
  }

  protected abstract _getIterator(...args: any[]): IterableIterator<[K, V]>;
}

export abstract class IterableElementBase<E> {
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
  every(predicate: ElementCallback<E, boolean>, thisArg?: any): boolean {
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
  some(predicate: ElementCallback<E, boolean>, thisArg?: any): boolean {
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
  forEach(callbackfn: ElementCallback<E, void>, thisArg?: any): void {
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
  find(callbackfn: ElementCallback<E, boolean>, thisArg?: any): E | undefined {
    let index = 0;
    for (const item of this) {
      if (callbackfn.call(thisArg, item, index++, this)) return item;
    }

    return;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

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
  reduce<U>(callbackfn: ReduceElementCallback<E, U>, initialValue: U): U {
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
  print(): void {
    console.log([...this]);
  }

  protected abstract _getIterator(...args: any[]): IterableIterator<E>;
}
