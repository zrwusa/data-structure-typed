import type { ElementCallback, IterableElementBaseOptions, ReduceElementCallback } from '../../types';

/**
 * Base class that makes a data structure iterable and provides common
 * element-wise utilities (e.g., map/filter/reduce/find).
 *
 * @template E The public element type yielded by the structure.
 * @template R The underlying "raw" element type used internally or by converters.
 *
 * @remarks
 * This class implements the JavaScript iteration protocol (via `Symbol.iterator`)
 * and offers array-like helpers with predictable time/space complexity.
 */
export abstract class IterableElementBase<E, R> implements Iterable<E> {
  /**
   * Create a new iterable base.
   *
   * @param options Optional behavior overrides. When provided, a `toElementFn`
   * is used to convert a raw element (`R`) into a public element (`E`).
   *
   * @remarks
   * Time O(1), Space O(1).
   */
  protected constructor(options?: IterableElementBaseOptions<E, R>) {
    if (options) {
      const { toElementFn } = options;
      if (typeof toElementFn === 'function') this._toElementFn = toElementFn;
      else if (toElementFn) throw new TypeError('toElementFn must be a function type');
    }
  }

  /**
   * The converter used to transform a raw element (`R`) into a public element (`E`).
   *
   * @remarks
   * Time O(1), Space O(1).
   */
  protected _toElementFn?: (rawElement: R) => E;

  /**
   * Exposes the current `toElementFn`, if configured.
   *
   * @returns The converter function or `undefined` when not set.
   * @remarks
   * Time O(1), Space O(1).
   */
  get toElementFn(): ((rawElement: R) => E) | undefined {
    return this._toElementFn;
  }

  /**
   * Returns an iterator over the structure's elements.
   *
   * @param args Optional iterator arguments forwarded to the internal iterator.
   * @returns An `IterableIterator<E>` that yields the elements in traversal order.
   *
   * @remarks
   * Producing the iterator is O(1); consuming the entire iterator is Time O(n) with O(1) extra space.
   */
  *[Symbol.iterator](...args: unknown[]): IterableIterator<E> {
    yield* this._getIterator(...args);
  }

  /**
   * Returns an iterator over the values (alias of the default iterator).
   *
   * @returns An `IterableIterator<E>` over all elements.
   * @remarks
   * Creating the iterator is O(1); full iteration is Time O(n), Space O(1).
   */
  *values(): IterableIterator<E> {
    for (const item of this) yield item;
  }

  /**
   * Tests whether all elements satisfy the predicate.
   *
   * @template TReturn
   * @param predicate Function invoked for each element with signature `(value, index, self)`.
   * @param thisArg Optional `this` binding for the predicate.
   * @returns `true` if every element passes; otherwise `false`.
   *
   * @remarks
   * Time O(n) in the worst case; may exit early when the first failure is found. Space O(1).
   */
  every(predicate: ElementCallback<E, R, boolean>, thisArg?: unknown): boolean {
    let index = 0;
    for (const item of this) {
      if (thisArg === undefined) {
        if (!predicate(item, index++, this)) return false;
      } else {
        const fn = predicate as (this: unknown, v: E, i: number, self: this) => boolean;
        if (!fn.call(thisArg, item, index++, this)) return false;
      }
    }
    return true;
  }

  /**
   * Tests whether at least one element satisfies the predicate.
   *
   * @param predicate Function invoked for each element with signature `(value, index, self)`.
   * @param thisArg Optional `this` binding for the predicate.
   * @returns `true` if any element passes; otherwise `false`.
   *
   * @remarks
   * Time O(n) in the worst case; may exit early on first success. Space O(1).
   */
  some(predicate: ElementCallback<E, R, boolean>, thisArg?: unknown): boolean {
    let index = 0;
    for (const item of this) {
      if (thisArg === undefined) {
        if (predicate(item, index++, this)) return true;
      } else {
        const fn = predicate as (this: unknown, v: E, i: number, self: this) => boolean;
        if (fn.call(thisArg, item, index++, this)) return true;
      }
    }
    return false;
  }

  /**
   * Invokes a callback for each element in iteration order.
   *
   * @param callbackfn Function invoked per element with signature `(value, index, self)`.
   * @param thisArg Optional `this` binding for the callback.
   * @returns `void`.
   *
   * @remarks
   * Time O(n), Space O(1).
   */
  forEach(callbackfn: ElementCallback<E, R, void>, thisArg?: unknown): void {
    let index = 0;
    for (const item of this) {
      if (thisArg === undefined) {
        callbackfn(item, index++, this);
      } else {
        const fn = callbackfn as (this: unknown, v: E, i: number, self: this) => void;
        fn.call(thisArg, item, index++, this);
      }
    }
  }

  /**
   * Finds the first element that satisfies the predicate and returns it.
   *
   * @overload
   * Finds the first element of type `S` (a subtype of `E`) that satisfies the predicate and returns it.
   * @template S
   * @param predicate Type-guard predicate: `(value, index, self) => value is S`.
   * @param thisArg Optional `this` binding for the predicate.
   * @returns The matched element typed as `S`, or `undefined` if not found.
   *
   * @overload
   * @param predicate Boolean predicate: `(value, index, self) => boolean`.
   * @param thisArg Optional `this` binding for the predicate.
   * @returns The first matching element as `E`, or `undefined` if not found.
   *
   * @remarks
   * Time O(n) in the worst case; may exit early on the first match. Space O(1).
   */
  find<S extends E>(predicate: ElementCallback<E, R, S>, thisArg?: unknown): S | undefined;
  find(predicate: ElementCallback<E, R, unknown>, thisArg?: unknown): E | undefined;

  // Implementation signature
  find(predicate: ElementCallback<E, R, boolean>, thisArg?: unknown): E | undefined {
    let index = 0;
    for (const item of this) {
      if (thisArg === undefined) {
        if (predicate(item, index++, this)) return item;
      } else {
        const fn = predicate as (this: unknown, v: E, i: number, self: this) => boolean;
        if (fn.call(thisArg, item, index++, this)) return item;
      }
    }
    return;
  }

  /**
   * Checks whether a strictly-equal element exists in the structure.
   *
   * @param element The element to test with `===` equality.
   * @returns `true` if an equal element is found; otherwise `false`.
   *
   * @remarks
   * Time O(n) in the worst case. Space O(1).
   */
  has(element: E): boolean {
    for (const ele of this) if (ele === element) return true;
    return false;
  }

  reduce(callbackfn: ReduceElementCallback<E, R>): E;
  reduce(callbackfn: ReduceElementCallback<E, R>, initialValue: E): E;
  reduce<U>(callbackfn: ReduceElementCallback<E, R, U>, initialValue: U): U;

  /**
   * Reduces all elements to a single accumulated value.
   *
   * @overload
   * @param callbackfn Reducer of signature `(acc, value, index, self) => nextAcc`. The first element is used as the initial accumulator.
   * @returns The final accumulated value typed as `E`.
   *
   * @overload
   * @param callbackfn Reducer of signature `(acc, value, index, self) => nextAcc`.
   * @param initialValue The initial accumulator value of type `E`.
   * @returns The final accumulated value typed as `E`.
   *
   * @overload
   * @template U The accumulator type when it differs from `E`.
   * @param callbackfn Reducer of signature `(acc: U, value, index, self) => U`.
   * @param initialValue The initial accumulator value of type `U`.
   * @returns The final accumulated value typed as `U`.
   *
   * @remarks
   * Time O(n), Space O(1). Throws if called on an empty structure without `initialValue`.
   */
  reduce<U>(callbackfn: ReduceElementCallback<E, R, U>, initialValue?: U): U {
    let index = 0;
    const iter = this[Symbol.iterator]();
    let acc: U;

    if (arguments.length >= 2) {
      acc = initialValue as U;
    } else {
      const first = iter.next();
      if (first.done) throw new TypeError('Reduce of empty structure with no initial value');
      acc = first.value as unknown as U;
      index = 1;
    }

    for (const value of iter as unknown as Iterable<E>) {
      acc = callbackfn(acc, value, index++, this);
    }
    return acc;
  }

  /**
   * Materializes the elements into a new array.
   *
   * @returns A shallow array copy of the iteration order.
   * @remarks
   * Time O(n), Space O(n).
   */
  toArray(): E[] {
    return [...this];
  }

  /**
   * Returns a representation of the structure suitable for quick visualization.
   * Defaults to an array of elements; subclasses may override to provide richer visuals.
   *
   * @returns A visual representation (array by default).
   * @remarks
   * Time O(n), Space O(n).
   */
  toVisual(): E[] {
    return [...this];
  }

  /**
   * Prints `toVisual()` to the console. Intended for quick debugging.
   *
   * @returns `void`.
   * @remarks
   * Time O(n) due to materialization, Space O(n) for the intermediate representation.
   */
  print(): void {
    console.log(this.toVisual());
  }

  /**
   * Indicates whether the structure currently contains no elements.
   *
   * @returns `true` if empty; otherwise `false`.
   * @remarks
   * Expected Time O(1), Space O(1) for most implementations.
   */
  abstract isEmpty(): boolean;

  /**
   * Removes all elements from the structure.
   *
   * @returns `void`.
   * @remarks
   * Expected Time O(1) or O(n) depending on the implementation; Space O(1).
   */
  abstract clear(): void;

  /**
   * Creates a structural copy with the same element values and configuration.
   *
   * @returns A clone of the current instance (same concrete type).
   * @remarks
   * Expected Time O(n) to copy elements; Space O(n).
   */
  abstract clone(): this;

  /**
   * Maps each element to a new element and returns a new iterable structure.
   *
   * @template EM The mapped element type.
   * @template RM The mapped raw element type used internally by the target structure.
   * @param callback Function with signature `(value, index, self) => mapped`.
   * @param options Optional options for the returned structure, including its `toElementFn`.
   * @param thisArg Optional `this` binding for the callback.
   * @returns A new `IterableElementBase<EM, RM>` containing mapped elements.
   *
   * @remarks
   * Time O(n), Space O(n).
   */
  abstract map<EM, RM>(
    callback: ElementCallback<E, R, EM>,
    options?: IterableElementBaseOptions<EM, RM>,
    thisArg?: unknown
  ): IterableElementBase<EM, RM>;

  /**
   * Maps each element to the same element type and returns the same concrete structure type.
   *
   * @param callback Function with signature `(value, index, self) => mappedValue`.
   * @param thisArg Optional `this` binding for the callback.
   * @returns A new instance of the same concrete type with mapped elements.
   *
   * @remarks
   * Time O(n), Space O(n).
   */
  abstract mapSame(callback: ElementCallback<E, R, E>, thisArg?: unknown): this;

  /**
   * Filters elements using the provided predicate and returns the same concrete structure type.
   *
   * @param predicate Function with signature `(value, index, self) => boolean`.
   * @param thisArg Optional `this` binding for the predicate.
   * @returns A new instance of the same concrete type containing only elements that pass the predicate.
   *
   * @remarks
   * Time O(n), Space O(k) where `k` is the number of kept elements.
   */
  abstract filter(predicate: ElementCallback<E, R, boolean>, thisArg?: unknown): this;

  /**
   * Internal iterator factory used by the default iterator.
   *
   * @param args Optional iterator arguments.
   * @returns An iterator over elements.
   *
   * @remarks
   * Implementations should yield in O(1) per element with O(1) extra space when possible.
   */
  protected abstract _getIterator(...args: unknown[]): IterableIterator<E>;
}
