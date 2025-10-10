/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { Comparable, ComparablePrimitive, TrampolineThunk, Trampoline } from '../types';

/**
 * The function generates a random UUID (Universally Unique Identifier) in TypeScript.
 * @returns A randomly generated UUID (Universally Unique Identifier) in the format
 * 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' where each 'x' is replaced with a random hexadecimal
 * character.
 */
export const uuidV4 = function () {
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * The `arrayRemove` function removes elements from an array based on a specified predicate function
 * and returns the removed elements.
 * @param {T[]} array - An array of elements that you want to filter based on the provided predicate
 * function.
 * @param predicate - The `predicate` parameter is a function that takes three arguments:
 * @returns The `arrayRemove` function returns an array containing the elements that satisfy the given
 * `predicate` function.
 */
export const arrayRemove = function <T>(array: T[], predicate: (item: T, index: number, array: T[]) => boolean): T[] {
  let i = -1,
    len = array ? array.length : 0;
  const result = [];

  while (++i < len) {
    const value = array[i];
    if (predicate(value, i, array)) {
      result.push(value);
      Array.prototype.splice.call(array, i--, 1);
      len--;
    }
  }

  return result;
};

/**
 * The function `getMSB` returns the most significant bit of a given number.
 * @param {number} value - The `value` parameter is a number for which we want to find the position of
 * the Most Significant Bit (MSB). The function `getMSB` takes this number as input and calculates the
 * position of the MSB in its binary representation.
 * @returns The function `getMSB` returns the most significant bit (MSB) of the input `value`. If the
 * input value is less than or equal to 0, it returns 0. Otherwise, it calculates the position of the
 * MSB using the `Math.clz32` function and bitwise left shifts 1 to that position.
 */
export const getMSB = (value: number): number => {
  if (value <= 0) {
    return 0;
  }
  return 1 << (31 - Math.clz32(value));
};

/**
 * The `rangeCheck` function in TypeScript is used to validate if an index is within a specified range
 * and throws a `RangeError` with a custom message if it is out of bounds.
 * @param {number} index - The `index` parameter represents the value that you want to check if it
 * falls within a specified range.
 * @param {number} min - The `min` parameter represents the minimum value that the `index` should be
 * compared against in the `rangeCheck` function.
 * @param {number} max - The `max` parameter in the `rangeCheck` function represents the maximum value
 * that the `index` parameter is allowed to have. If the `index` is greater than this `max` value, a
 * `RangeError` will be thrown.
 * @param [message=Index out of bounds.] - The `message` parameter is a string that represents the
 * error message to be thrown if the index is out of bounds. By default, if no message is provided when
 * calling the `rangeCheck` function, the message "Index out of bounds." will be used.
 */
export const rangeCheck = (index: number, min: number, max: number, message = 'Index out of bounds.'): void => {
  if (index < min || index > max) throw new RangeError(message);
};

/**
 * The function `throwRangeError` throws a RangeError with a custom message if called.
 * @param [message=The value is off-limits.] - The `message` parameter is a string that represents the
 * error message to be displayed when a `RangeError` is thrown. If no message is provided, the default
 * message is 'The value is off-limits.'.
 */
export const throwRangeError = (message = 'The value is off-limits.'): void => {
  throw new RangeError(message);
};

/**
 * The function `isWeakKey` checks if the input is an object or a function in TypeScript.
 * @param {unknown} input - The `input` parameter in the `isWeakKey` function is of type `unknown`,
 * which means it can be any type. The function checks if the `input` is an object (excluding `null`)
 * or a function, and returns a boolean indicating whether the `input` is a weak
 * @returns The function `isWeakKey` returns a boolean value indicating whether the input is an object
 * or a function.
 */
export const isWeakKey = (input: unknown): input is object => {
  const inputType = typeof input;
  return (inputType === 'object' && input !== null) || inputType === 'function';
};

/**
 * The function `calcMinUnitsRequired` calculates the minimum number of units required to accommodate a
 * given total quantity based on a specified unit size.
 * @param {number} totalQuantity - The `totalQuantity` parameter represents the total quantity of items
 * that need to be processed or handled.
 * @param {number} unitSize - The `unitSize` parameter represents the size of each unit or package. It
 * is used in the `calcMinUnitsRequired` function to calculate the minimum number of units required to
 * accommodate a total quantity of items.
 */
export const calcMinUnitsRequired = (totalQuantity: number, unitSize: number) =>
  Math.floor((totalQuantity + unitSize - 1) / unitSize);

/**
 * The `roundFixed` function in TypeScript rounds a number to a specified number of decimal places.
 * @param {number} num - The `num` parameter is a number that you want to round to a certain number of
 * decimal places.
 * @param {number} [digit=10] - The `digit` parameter in the `roundFixed` function specifies the number
 * of decimal places to round the number to. By default, it is set to 10 if not provided explicitly.
 * @returns The function `roundFixed` returns a number that is rounded to the specified number of
 * decimal places (default is 10 decimal places).
 */
export const roundFixed = (num: number, digit: number = 10) => {
  const multiplier = Math.pow(10, digit);
  return Math.round(num * multiplier) / multiplier;
};

/**
 * The function `isPrimitiveComparable` checks if a value is a primitive type that can be compared.
 * @param {unknown} value - The `value` parameter in the `isPrimitiveComparable` function is of type
 * `unknown`, which means it can be any type. The function checks if the `value` is a primitive type
 * that can be compared, such as number, bigint, string, or boolean.
 * @returns The function `isPrimitiveComparable` returns a boolean value indicating whether the input
 * `value` is a primitive value that can be compared using standard comparison operators (<, >, <=,
 * >=).
 */
function isPrimitiveComparable(value: unknown): value is ComparablePrimitive {
  const valueType = typeof value;
  if (valueType === 'number') return true;
  // if (valueType === 'number') return !Number.isNaN(value);
  return valueType === 'bigint' || valueType === 'string' || valueType === 'boolean';
}

/**
 * The function `tryObjectToPrimitive` attempts to convert an object to a comparable primitive value by
 * first checking the `valueOf` method and then the `toString` method.
 * @param {object} obj - The `obj` parameter in the `tryObjectToPrimitive` function is an object that
 * you want to convert to a primitive value. The function attempts to convert the object to a primitive
 * value by first checking if the object has a `valueOf` method. If the `valueOf` method exists, it
 * @returns The function `tryObjectToPrimitive` returns a value of type `ComparablePrimitive` if a
 * primitive comparable value is found within the object, or a string value if the object has a custom
 * `toString` method that does not return `'[object Object]'`. If neither condition is met, the
 * function returns `null`.
 */
function tryObjectToPrimitive(obj: object): ComparablePrimitive | null {
  if (typeof obj.valueOf === 'function') {
    const valueOfResult = obj.valueOf();
    if (valueOfResult !== obj) {
      if (isPrimitiveComparable(valueOfResult)) return valueOfResult;
      if (typeof valueOfResult === 'object' && valueOfResult !== null) return tryObjectToPrimitive(valueOfResult);
    }
  }
  if (typeof obj.toString === 'function') {
    const stringResult = obj.toString();
    if (stringResult !== '[object Object]') return stringResult;
  }
  return null;
}

/**
 * The function `isComparable` in TypeScript checks if a value is comparable, handling primitive values
 * and objects with optional force comparison.
 * @param {unknown} value - The `value` parameter in the `isComparable` function represents the value
 * that you want to check if it is comparable. It can be of any type (`unknown`), and the function will
 * determine if it is comparable based on certain conditions.
 * @param [isForceObjectComparable=false] - The `isForceObjectComparable` parameter in the
 * `isComparable` function is a boolean flag that determines whether to treat non-primitive values as
 * comparable objects. When set to `true`, it forces the function to consider non-primitive values as
 * comparable objects, regardless of their type.
 * @returns The function `isComparable` returns a boolean value indicating whether the `value` is
 * considered comparable or not.
 */
export function isComparable(value: unknown, isForceObjectComparable = false): value is Comparable {
  if (value === null || value === undefined) return false;
  if (isPrimitiveComparable(value)) return true;

  if (typeof value !== 'object') return false;
  if (value instanceof Date) return true;
  // if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (isForceObjectComparable) return true;
  const comparableValue = tryObjectToPrimitive(value);
  if (comparableValue === null || comparableValue === undefined) return false;
  return isPrimitiveComparable(comparableValue);
}

/**
 * Creates a trampoline thunk object.
 *
 * A "thunk" is a deferred computation — instead of performing a recursive call immediately,
 * it wraps the next step of the computation in a function. This allows recursive processes
 * to be executed iteratively, preventing stack overflows.
 *
 * @template T - The type of the final computation result.
 * @param computation - A function that, when executed, returns the next trampoline step.
 * @returns A TrampolineThunk object containing the deferred computation.
 */
export const makeTrampolineThunk = <T>(
  computation: () => Trampoline<T>
): TrampolineThunk<T> => ({
  isThunk: true, // Marker indicating this is a thunk
  fn: computation // The deferred computation function
});

/**
 * Type guard to check whether a given value is a TrampolineThunk.
 *
 * This function is used to distinguish between a final computation result (value)
 * and a deferred computation (thunk).
 *
 * @template T - The type of the value being checked.
 * @param value - The value to test.
 * @returns True if the value is a valid TrampolineThunk, false otherwise.
 */
export const isTrampolineThunk = <T>(
  value: Trampoline<T>
): value is TrampolineThunk<T> =>
  typeof value === 'object' && // Must be an object
  value !== null &&            // Must not be null
  'isThunk' in value &&        // Must have the 'isThunk' property
  value.isThunk;               // The flag must be true

/**
 * Executes a trampoline computation until a final (non-thunk) result is obtained.
 *
 * The trampoline function repeatedly invokes the deferred computations (thunks)
 * in an iterative loop. This avoids deep recursive calls and prevents stack overflow,
 * which is particularly useful for implementing recursion in a stack-safe manner.
 *
 * @template T - The type of the final result.
 * @param initial - The initial Trampoline value or thunk to start execution from.
 * @returns The final result of the computation (a non-thunk value).
 */
export function trampoline<T>(initial: Trampoline<T>): T {
  let current = initial; // Start with the initial trampoline value
  while (isTrampolineThunk(current)) { // Keep unwrapping while we have thunks
    current = current.fn(); // Execute the deferred function to get the next step
  }
  return current; // Once no thunks remain, return the final result
}

/**
 * Wraps a recursive function inside a trampoline executor.
 *
 * This function transforms a potentially recursive function (that returns a Trampoline<Result>)
 * into a *stack-safe* function that executes iteratively using the `trampoline` runner.
 *
 * In other words, it allows you to write functions that look recursive,
 * but actually run in constant stack space.
 *
 * @template Args - The tuple type representing the argument list of the original function.
 * @template Result - The final return type after all trampoline steps are resolved.
 *
 * @param fn - A function that performs a single step of computation
 *             and returns a Trampoline (either a final value or a deferred thunk).
 *
 * @returns A new function with the same arguments, but which automatically
 *          runs the trampoline process and returns the *final result* instead
 *          of a Trampoline.
 *
 * @example
 * // Example: Computing factorial in a stack-safe way
 * const factorial = makeTrampoline(function fact(n: number, acc: number = 1): Trampoline<number> {
 *   return n === 0
 *     ? acc
 *     : makeTrampolineThunk(() => fact(n - 1, acc * n));
 * });
 *
 * console.log(factorial(100000)); // Works without stack overflow
 */
export function makeTrampoline<Args extends any[], Result>(
  fn: (...args: Args) => Trampoline<Result> // A function that returns a trampoline step
): (...args: Args) => Result {
  // Return a wrapped function that automatically runs the trampoline execution loop
  return (...args: Args) => trampoline(fn(...args));
}

/**
 * Executes an asynchronous trampoline computation until a final (non-thunk) result is obtained.
 *
 * This function repeatedly invokes asynchronous deferred computations (thunks)
 * in an iterative loop. Each thunk may return either a Trampoline<T> or a Promise<Trampoline<T>>.
 *
 * It ensures that asynchronous recursive functions can run without growing the call stack,
 * making it suitable for stack-safe async recursion.
 *
 * @template T - The type of the final result.
 * @param initial - The initial Trampoline or Promise of Trampoline to start execution from.
 * @returns A Promise that resolves to the final result (a non-thunk value).
 */
export async function asyncTrampoline<T>(
  initial: Trampoline<T> | Promise<Trampoline<T>>
): Promise<T> {
  let current = await initial; // Wait for the initial step to resolve if it's a Promise

  // Keep executing thunks until we reach a non-thunk (final) value
  while (isTrampolineThunk(current)) {
    current = await current.fn(); // Execute the thunk function (may be async)
  }

  // Once the final value is reached, return it
  return current;
}

/**
 * Wraps an asynchronous recursive function inside an async trampoline executor.
 *
 * This helper transforms a recursive async function that returns a Trampoline<Result>
 * (or Promise<Trampoline<Result>>) into a *stack-safe* async function that executes
 * iteratively via the `asyncTrampoline` runner.
 *
 * @template Args - The tuple type representing the argument list of the original function.
 * @template Result - The final return type after all async trampoline steps are resolved.
 *
 * @param fn - An async or sync function that performs a single step of computation
 *             and returns a Trampoline (either a final value or a deferred thunk).
 *
 * @returns An async function with the same arguments, but which automatically
 *          runs the trampoline process and resolves to the *final result*.
 *
 * @example
 * // Example: Async factorial using trampoline
 * const asyncFactorial = makeAsyncTrampoline(async function fact(
 *   n: number,
 *   acc: number = 1
 * ): Promise<Trampoline<number>> {
 *   return n === 0
 *     ? acc
 *     : makeTrampolineThunk(() => fact(n - 1, acc * n));
 * });
 *
 * asyncFactorial(100000).then(console.log); // Works without stack overflow
 */
export function makeAsyncTrampoline<Args extends any[], Result>(
  fn: (...args: Args) => Trampoline<Result> | Promise<Trampoline<Result>>
): (...args: Args) => Promise<Result> {
  // Return a wrapped async function that runs through the async trampoline loop
  return async (...args: Args): Promise<Result> => {
    return asyncTrampoline(fn(...args));
  };
}
