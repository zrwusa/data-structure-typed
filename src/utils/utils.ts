/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { Comparable, ComparablePrimitive, Thunk, ToThunkFn, TrlAsyncFn, TrlFn } from '../types';

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

export const THUNK_SYMBOL = Symbol('thunk');

/**
 * The function `isThunk` checks if a given value is a function with a specific symbol property.
 * @param {any} fnOrValue - The `fnOrValue` parameter in the `isThunk` function can be either a
 * function or a value that you want to check if it is a thunk. Thunks are functions that are wrapped
 * around a value or computation for lazy evaluation. The function checks if the `fnOrValue` is
 * @returns The function `isThunk` is checking if the input `fnOrValue` is a function and if it has a
 * property `__THUNK__` equal to `THUNK_SYMBOL`. The return value will be `true` if both conditions are
 * met, otherwise it will be `false`.
 */
export const isThunk = (fnOrValue: any) => {
  return typeof fnOrValue === 'function' && fnOrValue.__THUNK__ === THUNK_SYMBOL;
};

/**
 * The `toThunk` function in TypeScript converts a function into a thunk by wrapping it in a closure.
 * @param {ToThunkFn} fn - `fn` is a function that will be converted into a thunk.
 * @returns A thunk function is being returned. Thunk functions are functions that delay the evaluation
 * of an expression or operation until it is explicitly called or invoked. In this case, the `toThunk`
 * function takes a function `fn` as an argument and returns a thunk function that, when called, will
 * execute the `fn` function provided as an argument.
 */
export const toThunk = (fn: ToThunkFn): Thunk => {
  const thunk = () => fn();
  thunk.__THUNK__ = THUNK_SYMBOL;
  return thunk;
};

/**
 * The `trampoline` function in TypeScript enables tail call optimization by using thunks to avoid
 * stack overflow.
 * @param {TrlFn} fn - The `fn` parameter in the `trampoline` function is a function that takes any
 * number of arguments and returns a value.
 * @returns The `trampoline` function returns an object with two properties:
 * 1. A function that executes the provided function `fn` and continues to execute any thunks returned
 * by `fn` until a non-thunk value is returned.
 * 2. A `cont` property that is a function which creates a thunk for the provided function `fn`.
 */
export const trampoline = (fn: TrlFn) => {
  const cont = (...args: [...Parameters<TrlFn>]): ReturnType<TrlFn> => toThunk(() => fn(...args));

  return Object.assign(
    (...args: [...Parameters<TrlFn>]) => {
      let result = fn(...args);

      while (isThunk(result) && typeof result === 'function') {
        result = result();
      }

      return result;
    },
    { cont }
  );
};

/**
 * The `trampolineAsync` function in TypeScript allows for asynchronous trampolining of a given
 * function.
 * @param {TrlAsyncFn} fn - The `fn` parameter in the `trampolineAsync` function is expected to be a
 * function that returns a Promise. This function will be called recursively until a non-thunk value is
 * returned.
 * @returns The `trampolineAsync` function returns an object with two properties:
 * 1. An async function that executes the provided `TrlAsyncFn` function and continues to execute any
 * thunks returned by the function until a non-thunk value is returned.
 * 2. A `cont` property that is a function which wraps the provided `TrlAsyncFn` function in a thunk
 * and returns it.
 */
export const trampolineAsync = (fn: TrlAsyncFn) => {
  const cont = (...args: [...Parameters<TrlAsyncFn>]): ReturnType<TrlAsyncFn> => toThunk(() => fn(...args));

  return Object.assign(
    async (...args: [...Parameters<TrlAsyncFn>]) => {
      let result = await fn(...args);

      while (isThunk(result) && typeof result === 'function') {
        result = await result();
      }

      return result;
    },
    { cont }
  );
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
  if (valueType === 'number') return !Number.isNaN(value);
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
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (isForceObjectComparable) return true;
  const comparableValue = tryObjectToPrimitive(value);
  if (comparableValue === null || comparableValue === undefined) return false;
  return isPrimitiveComparable(comparableValue);
}
