/**
 * TreeMap (ordered map) — a restricted, native-like API backed by RedBlackTree.
 *
 * Design goals:
 * - No node exposure (no node inputs/outputs)
 * - Native Map-like surface + Java NavigableMap-like helpers
 * - Strict default comparator (number/string/Date), otherwise require comparator
 */

import type { Comparator } from '../../types';
import type { TreeMapEntryCallback, TreeMapOptions, TreeMapRangeOptions, TreeMapReduceCallback } from '../../types';
import { RedBlackTree } from './red-black-tree';

/**
 * An ordered Map backed by a red-black tree.
 *
 * - Iteration order is ascending by key.
 * - No node exposure: all APIs use keys/values only.
 */
export class TreeMap<K = any, V = any, R = [K, V]> implements Iterable<[K, V | undefined]> {
  readonly #core: RedBlackTree<K, V>;
  readonly #isDefaultComparator: boolean;
  readonly #userComparator?: Comparator<K>;

  /**
   * Create a TreeMap from an iterable of `[key, value]` entries or raw elements.
   *
   * @param entries - Iterable of `[key, value]` tuples, or raw elements if `toEntryFn` is provided.
   * @param options - Configuration options including optional `toEntryFn` to transform raw elements.
   * @throws {TypeError} If any entry is not a 2-tuple-like value (when no toEntryFn), or when using
   * the default comparator and encountering unsupported/invalid keys (e.g. `NaN`, invalid `Date`).
   * @example
   * // Standard usage with entries
   * const map = new TreeMap([['a', 1], ['b', 2]]);
   *
   * // Using toEntryFn to transform raw objects
   * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
   * const map = new TreeMap<number, User, User>(users, { toEntryFn: u => [u.id, u] });
   */
  constructor(
    entries: Iterable<R> | Iterable<[K, V | undefined]> = [],
    options: TreeMapOptions<K, V, R> = {}
  ) {
    this.#userComparator = options.comparator;
    const toEntryFn = options.toEntryFn as ((item: unknown) => [K, V]) | undefined;
    const comparator = options.comparator ?? TreeMap.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;

    this.#core = new RedBlackTree<K, V>([], { comparator, isMapMode: options.isMapMode });

    for (const item of entries as Iterable<unknown>) {
      let k: K;
      let v: V | undefined;

      if (toEntryFn) {
        // Use toEntryFn to transform raw element
        [k, v] = toEntryFn(item);
      } else {
        // Validate entries like native Map: each item must be a 2-tuple-like value.
        if (!Array.isArray(item) || item.length < 2) {
          throw new TypeError('TreeMap: each entry must be a [key, value] tuple');
        }
        k = item[0] as K;
        v = item[1] as V | undefined;
      }

      this.set(k, v);
    }
  }

  /**
   * Create the strict default comparator.
   *
   * Supports:
   * - `number` (rejects `NaN`; treats `-0` and `0` as equal)
   * - `string`
   * - `Date` (orders by `getTime()`, rejects invalid dates)
   *
   * For other key types, a custom comparator must be provided.
   */
  static createDefaultComparator<K>(): Comparator<K> {
    return (a: K, b: K): number => {
      if (typeof a === 'number' && typeof b === 'number') {
        if (Number.isNaN(a) || Number.isNaN(b)) throw new TypeError('TreeMap: NaN is not a valid key');
        const aa = Object.is(a, -0) ? 0 : a;
        const bb = Object.is(b, -0) ? 0 : b;
        return aa > bb ? 1 : aa < bb ? -1 : 0;
      }

      if (typeof a === 'string' && typeof b === 'string') {
        return a > b ? 1 : a < b ? -1 : 0;
      }

      if (a instanceof Date && b instanceof Date) {
        const ta = a.getTime();
        const tb = b.getTime();
        if (Number.isNaN(ta) || Number.isNaN(tb)) throw new TypeError('TreeMap: invalid Date key');
        return ta > tb ? 1 : ta < tb ? -1 : 0;
      }

      throw new TypeError('TreeMap: comparator is required for non-number/non-string/non-Date keys');
    };
  }

  private _validateKey(key: K): void {
    if (!this.#isDefaultComparator) return;

    if (typeof key === 'number') {
      if (Number.isNaN(key)) throw new TypeError('TreeMap: NaN is not a valid key');
      return;
    }

    if (typeof key === 'string') return;

    if (key instanceof Date) {
      if (Number.isNaN(key.getTime())) throw new TypeError('TreeMap: invalid Date key');
      return;
    }

    throw new TypeError('TreeMap: comparator is required for non-number/non-string/non-Date keys');
  }

  /**
   * Number of entries in the map.
   */
  get size(): number {
    return this.#core.size;
  }

  /**
   * Whether the map is empty.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Set or overwrite a value for a key.
   * @remarks Expected time O(log n)
   */
  set(key: K, value: V | undefined): this {
    this._validateKey(key);
    this.#core.set(key, value as V);
    return this;
  }

  /**
   * Get the value under a key.
   * @remarks Expected time O(log n)
   */
  get(key: K): V | undefined {
    this._validateKey(key);
    return this.#core.get(key);
  }

  /**
   * Test whether a key exists.
   * @remarks Expected time O(log n)
   */
  has(key: K): boolean {
    this._validateKey(key);
    return this.#core.has(key);
  }

  /**
   * Delete a key.
   * @returns `true` if the key existed; otherwise `false`.
   * @remarks Expected time O(log n)
   */
  delete(key: K): boolean {
    this._validateKey(key);
    const res = this.#core.delete(key);
    return Array.isArray(res) && res.length > 0 && !!res[0]?.deleted;
  }

  /**
   * Remove all entries.
   */
  clear(): void {
    this.#core.clear();
  }

  /**
   * Iterate over keys in ascending order.
   */
  keys(): IterableIterator<K> {
    return this.#core.keys();
  }

  private _entryFromKey(k: K): [K, V | undefined] {
    // Keys come from `keys()` which only yields existing keys.
    // We allow `undefined` as a stored value (native Map behavior), so entries are typed as `[K, V | undefined]`.
    return [k, this.#core.get(k)];
  }

  /**
   * Iterate over values in ascending key order.
   *
   * Note: values may be `undefined` (TreeMap allows storing `undefined`, like native `Map`).
   */
  *values(): IterableIterator<V | undefined> {
    for (const k of this.keys()) yield this._entryFromKey(k)[1];
  }

  /**
   * Iterate over `[key, value]` entries in ascending key order.
   *
   * Note: values may be `undefined`.
   */
  *entries(): IterableIterator<[K, V | undefined]> {
    for (const k of this.keys()) yield this._entryFromKey(k);
  }

  [Symbol.iterator](): IterableIterator<[K, V | undefined]> {
    return this.entries();
  }

  /**
   * Visit each entry in ascending key order.
   *
   * Note: callback value may be `undefined`.
   */
  forEach(cb: (value: V | undefined, key: K, map: TreeMap<K, V>) => void, thisArg?: any): void {
    for (const [k, v] of this) cb.call(thisArg, v, k, this);
  }

  /**
   * Create a new TreeMap by mapping each entry to a new `[key, value]` entry.
   *
   * This mirrors `RedBlackTree.map`: mapping produces a new ordered container.
   * @remarks Time O(n log n) expected, Space O(n)
   */
  map<MK, MV>(
    callbackfn: TreeMapEntryCallback<K, V, [MK, MV], TreeMap<K, V>>,
    options: Omit<TreeMapOptions<MK, MV>, 'toEntryFn'> & { comparator?: (a: MK, b: MK) => number } = {},
    thisArg?: unknown
  ): TreeMap<MK, MV> {
    const out = new TreeMap<MK, MV>([], options as TreeMapOptions<MK, MV>);
    let index = 0;
    for (const [k, v] of this) {
      const [mk, mv] = thisArg === undefined
        ? callbackfn(v, k, index++, this)
        : (callbackfn as (this: unknown, v: V | undefined, k: K, i: number, self: TreeMap<K, V>) => [MK, MV]).call(thisArg, v, k, index++, this);
      out.set(mk, mv);
    }
    return out;
  }

  /**
   * Create a new TreeMap containing only entries that satisfy the predicate.
   * @remarks Time O(n log n) expected, Space O(n)
   */
  filter(callbackfn: TreeMapEntryCallback<K, V, boolean, TreeMap<K, V>>, thisArg?: unknown): TreeMap<K, V> {
    const out = new TreeMap<K, V>([], { comparator: this.#userComparator });
    let index = 0;
    for (const [k, v] of this) {
      const ok = thisArg === undefined
        ? callbackfn(v, k, index++, this)
        : (callbackfn as (this: unknown, v: V | undefined, k: K, i: number, self: TreeMap<K, V>) => boolean).call(thisArg, v, k, index++, this);
      if (ok) out.set(k, v);
    }
    return out;
  }

  /**
   * Reduce entries into a single accumulator.
   * @remarks Time O(n), Space O(1)
   */
  reduce<A>(callbackfn: TreeMapReduceCallback<K, V, A, TreeMap<K, V>>, initialValue: A): A {
    let acc = initialValue;
    let index = 0;
    for (const [k, v] of this) acc = callbackfn(acc, v, k, index++, this);
    return acc;
  }

  /**
   * Test whether all entries satisfy a predicate.
   * @remarks Time O(n), Space O(1)
   */
  every(callbackfn: TreeMapEntryCallback<K, V, boolean, TreeMap<K, V>>, thisArg?: unknown): boolean {
    let index = 0;
    for (const [k, v] of this) {
      const ok = thisArg === undefined
        ? callbackfn(v, k, index++, this)
        : (callbackfn as (this: unknown, v: V | undefined, k: K, i: number, self: TreeMap<K, V>) => boolean).call(thisArg, v, k, index++, this);
      if (!ok) return false;
    }
    return true;
  }

  /**
   * Test whether any entry satisfies a predicate.
   * @remarks Time O(n), Space O(1)
   */
  some(callbackfn: TreeMapEntryCallback<K, V, boolean, TreeMap<K, V>>, thisArg?: unknown): boolean {
    let index = 0;
    for (const [k, v] of this) {
      const ok = thisArg === undefined
        ? callbackfn(v, k, index++, this)
        : (callbackfn as (this: unknown, v: V | undefined, k: K, i: number, self: TreeMap<K, V>) => boolean).call(thisArg, v, k, index++, this);
      if (ok) return true;
    }
    return false;
  }

  /**
   * Find the first entry that satisfies a predicate.
   * @returns The first matching `[key, value]` tuple, or `undefined`.
   * @remarks Time O(n), Space O(1)
   */
  find(callbackfn: TreeMapEntryCallback<K, V, boolean, TreeMap<K, V>>, thisArg?: unknown): [K, V | undefined] | undefined {
    let index = 0;
    for (const [k, v] of this) {
      const ok = thisArg === undefined
        ? callbackfn(v, k, index++, this)
        : (callbackfn as (this: unknown, v: V | undefined, k: K, i: number, self: TreeMap<K, V>) => boolean).call(thisArg, v, k, index++, this);
      if (ok) return [k, v];
    }
    return undefined;
  }

  /**
   * Materialize the map into an array of `[key, value]` tuples.
   * @remarks Time O(n), Space O(n)
   */
  toArray(): Array<[K, V | undefined]> {
    return [...this];
  }

  /**
   * Print a human-friendly representation.
   * @remarks Time O(n), Space O(n)
   */
  print(): void {
    // Delegate to the underlying tree's visualization.
    this.#core.print();
  }

  // Navigable operations (return entry tuples)
  // Note: returned tuple values may be `undefined`.

  /**
   * Smallest entry by key.
   */
  first(): [K, V | undefined] | undefined {
    const k = this.#core.getLeftMost();
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Largest entry by key.
   */
  last(): [K, V | undefined] | undefined {
    const k = this.#core.getRightMost();
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Remove and return the smallest entry.
   */
  pollFirst(): [K, V | undefined] | undefined {
    const entry = this.first();
    if (!entry) return undefined;
    this.delete(entry[0]);
    return entry;
  }

  /**
   * Remove and return the largest entry.
   */
  pollLast(): [K, V | undefined] | undefined {
    const entry = this.last();
    if (!entry) return undefined;
    this.delete(entry[0]);
    return entry;
  }

  /**
   * Smallest entry whose key is >= the given key.
   */
  ceiling(key: K): [K, V | undefined] | undefined {
    this._validateKey(key);
    const k = this.#core.ceiling(key);
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Largest entry whose key is <= the given key.
   */
  floor(key: K): [K, V | undefined] | undefined {
    this._validateKey(key);
    const k = this.#core.floor(key);
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Smallest entry whose key is > the given key.
   */
  higher(key: K): [K, V | undefined] | undefined {
    this._validateKey(key);
    const k = this.#core.higher(key);
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Largest entry whose key is < the given key.
   */
  lower(key: K): [K, V | undefined] | undefined {
    this._validateKey(key);
    const k = this.#core.lower(key);
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Return all entries in a given key range.
   *
   * @param range `[low, high]`
   * @param options Inclusive/exclusive bounds (defaults to inclusive).
   */
  rangeSearch(range: [K, K], options: TreeMapRangeOptions = {}): Array<[K, V | undefined]> {
    const { lowInclusive = true, highInclusive = true } = options;
    const [low, high] = range;
    this._validateKey(low);
    this._validateKey(high);

    const keys = this.#core.rangeSearch([low, high]) as (K | undefined)[];
    const out: Array<[K, V | undefined]> = [];
    const cmp = this.#core.comparator;

    for (const k of keys) {
      if (k === undefined) continue;
      if (!lowInclusive && cmp(k, low) === 0) continue;
      if (!highInclusive && cmp(k, high) === 0) continue;
      out.push(this._entryFromKey(k));
    }

    return out;
  }
}
