/**
 * TreeSet (ordered set) — a restricted, native-like API backed by RedBlackTree.
 *
 * Design goals:
 * - No node exposure (no node inputs/outputs)
 * - Native Set-like surface + Java NavigableSet-like helpers
 * - Strict default comparator (number/string/Date), otherwise require comparator
 */

import type { Comparator } from '../../types';
import type { TreeSetElementCallback, TreeSetOptions, TreeSetRangeOptions, TreeSetReduceCallback } from '../../types';
import { RedBlackTree } from './red-black-tree';

/**
 * An ordered Set backed by a red-black tree.
 *
 * - Iteration order is ascending by key.
 * - No node exposure: all APIs use keys only.
 */
export class TreeSet<K = any> implements Iterable<K> {
  readonly #core: RedBlackTree<K, undefined>;
  readonly #isDefaultComparator: boolean;
  readonly #userComparator?: Comparator<K>;

  /**
   * Create a TreeSet from an iterable of keys.
   *
   * @throws {TypeError} When using the default comparator and encountering unsupported key types,
   * or invalid keys (e.g. `NaN`, invalid `Date`).
   */
  constructor(elements: Iterable<K> = [], options: TreeSetOptions<K> = {}) {
    this.#userComparator = options.comparator;
    const comparator = options.comparator ?? TreeSet.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;

    // RedBlackTree expects an iterable of keys/entries/nodes/raws; for TreeSet we only accept keys.
    this.#core = new RedBlackTree<K, undefined>([], { comparator });

    for (const k of elements) this.add(k);
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
      // numbers
      if (typeof a === 'number' && typeof b === 'number') {
        if (Number.isNaN(a) || Number.isNaN(b)) throw new TypeError('TreeSet: NaN is not a valid key');
        // treat -0 and 0 as equal
        const aa = Object.is(a, -0) ? 0 : a;
        const bb = Object.is(b, -0) ? 0 : b;
        return aa > bb ? 1 : aa < bb ? -1 : 0;
      }

      // strings
      if (typeof a === 'string' && typeof b === 'string') {
        return a > b ? 1 : a < b ? -1 : 0;
      }

      // Date
      if (a instanceof Date && b instanceof Date) {
        const ta = a.getTime();
        const tb = b.getTime();
        if (Number.isNaN(ta) || Number.isNaN(tb)) throw new TypeError('TreeSet: invalid Date key');
        return ta > tb ? 1 : ta < tb ? -1 : 0;
      }

      throw new TypeError('TreeSet: comparator is required for non-number/non-string/non-Date keys');
    };
  }

  /**
   * Number of elements in the set.
   */
  get size(): number {
    return this.#core.size;
  }

  /**
   * Whether the set is empty.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  private _validateKey(key: K): void {
    if (!this.#isDefaultComparator) return;

    if (typeof key === 'number') {
      if (Number.isNaN(key)) throw new TypeError('TreeSet: NaN is not a valid key');
      return;
    }

    if (typeof key === 'string') return;

    if (key instanceof Date) {
      if (Number.isNaN(key.getTime())) throw new TypeError('TreeSet: invalid Date key');
      return;
    }

    // Other key types should have provided a comparator, so reaching here means misuse.
    throw new TypeError('TreeSet: comparator is required for non-number/non-string/non-Date keys');
  }

  /**
   * Add a key to the set (no-op if already present).
   * @remarks Expected time O(log n)
   */
  add(key: K): this {
    this._validateKey(key);
    // RBT.set returns boolean; Set.add returns this.
    this.#core.set(key, undefined);
    return this;
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
   * Remove all keys.
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

  /**
   * Iterate over values in ascending order.
   *
   * Note: for Set-like containers, `values()` is the same as `keys()`.
   */
  values(): IterableIterator<K> {
    return this.keys();
  }

  /**
   * Iterate over `[value, value]` pairs (native Set convention).
   *
   * Note: TreeSet stores only keys internally; `[k, k]` is created on-the-fly during iteration.
   */
  *entries(): IterableIterator<[K, K]> {
    for (const k of this.keys()) yield [k, k];
  }

  [Symbol.iterator](): IterableIterator<K> {
    return this.keys();
  }

  /**
   * Visit each value in ascending order.
   *
   * Callback follows native Set convention: `(value, value2, set)`.
   */
  forEach(cb: (value: K, value2: K, set: TreeSet<K>) => void, thisArg?: any): void {
    for (const k of this) cb.call(thisArg, k, k, this);
  }

  /**
   * Create a new TreeSet by mapping each value to a new key.
   *
   * This mirrors `RedBlackTree.map`: mapping produces a new ordered container.
   * @remarks Time O(n log n) expected, Space O(n)
   */
  map<MK>(
    callbackfn: TreeSetElementCallback<K, MK, TreeSet<K>>,
    options: TreeSetOptions<MK> = {},
    thisArg?: unknown
  ): TreeSet<MK> {
    const out = new TreeSet<MK>([], options);
    let index = 0;
    for (const v of this) {
      const mk = thisArg === undefined
        ? callbackfn(v, index++, this)
        : (callbackfn as (this: unknown, v: K, i: number, self: TreeSet<K>) => MK).call(thisArg, v, index++, this);
      out.add(mk);
    }
    return out;
  }

  /**
   * Create a new TreeSet containing only values that satisfy the predicate.
   * @remarks Time O(n log n) expected, Space O(n)
   */
  filter(callbackfn: TreeSetElementCallback<K, boolean, TreeSet<K>>, thisArg?: unknown): TreeSet<K> {
    const out = new TreeSet<K>([], { comparator: this.#userComparator });
    let index = 0;
    for (const v of this) {
      const ok = thisArg === undefined
        ? callbackfn(v, index++, this)
        : (callbackfn as (this: unknown, v: K, i: number, self: TreeSet<K>) => boolean).call(thisArg, v, index++, this);
      if (ok) out.add(v);
    }
    return out;
  }

  /**
   * Reduce values into a single accumulator.
   * @remarks Time O(n), Space O(1)
   */
  reduce<A>(callbackfn: TreeSetReduceCallback<K, A, TreeSet<K>>, initialValue: A): A {
    let acc = initialValue;
    let index = 0;
    for (const v of this) acc = callbackfn(acc, v, index++, this);
    return acc;
  }

  /**
   * Test whether all values satisfy a predicate.
   * @remarks Time O(n), Space O(1)
   */
  every(callbackfn: TreeSetElementCallback<K, boolean, TreeSet<K>>, thisArg?: unknown): boolean {
    let index = 0;
    for (const v of this) {
      const ok = thisArg === undefined
        ? callbackfn(v, index++, this)
        : (callbackfn as (this: unknown, v: K, i: number, self: TreeSet<K>) => boolean).call(thisArg, v, index++, this);
      if (!ok) return false;
    }
    return true;
  }

  /**
   * Test whether any value satisfies a predicate.
   * @remarks Time O(n), Space O(1)
   */
  some(callbackfn: TreeSetElementCallback<K, boolean, TreeSet<K>>, thisArg?: unknown): boolean {
    let index = 0;
    for (const v of this) {
      const ok = thisArg === undefined
        ? callbackfn(v, index++, this)
        : (callbackfn as (this: unknown, v: K, i: number, self: TreeSet<K>) => boolean).call(thisArg, v, index++, this);
      if (ok) return true;
    }
    return false;
  }

  /**
   * Find the first value that satisfies a predicate.
   * @remarks Time O(n), Space O(1)
   */
  find(callbackfn: TreeSetElementCallback<K, boolean, TreeSet<K>>, thisArg?: unknown): K | undefined {
    let index = 0;
    for (const v of this) {
      const ok = thisArg === undefined
        ? callbackfn(v, index++, this)
        : (callbackfn as (this: unknown, v: K, i: number, self: TreeSet<K>) => boolean).call(thisArg, v, index++, this);
      if (ok) return v;
    }
    return undefined;
  }

  /**
   * Materialize the set into an array of keys.
   * @remarks Time O(n), Space O(n)
   */
  toArray(): K[] {
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

  // Navigable operations

  /**
   * Smallest key in the set.
   */
  first(): K | undefined {
    return this.#core.getLeftMost();
  }

  /**
   * Largest key in the set.
   */
  last(): K | undefined {
    return this.#core.getRightMost();
  }

  /**
   * Remove and return the smallest key.
   */
  pollFirst(): K | undefined {
    const k = this.first();
    if (k === undefined) return undefined;
    this.delete(k);
    return k;
  }

  /**
   * Remove and return the largest key.
   */
  pollLast(): K | undefined {
    const k = this.last();
    if (k === undefined) return undefined;
    this.delete(k);
    return k;
  }

  /**
   * Smallest key that is >= the given key.
   */
  ceiling(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.ceiling(key);
  }

  /**
   * Largest key that is <= the given key.
   */
  floor(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.floor(key);
  }

  /**
   * Smallest key that is > the given key.
   */
  higher(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.higher(key);
  }

  /**
   * Largest key that is < the given key.
   */
  lower(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.lower(key);
  }

  /**
   * Return all keys in a given range.
   *
   * @param range `[low, high]`
   * @param options Inclusive/exclusive bounds (defaults to inclusive).
   */
  rangeSearch(range: [K, K], options: TreeSetRangeOptions = {}): K[] {
    const { lowInclusive = true, highInclusive = true } = options;

    const [low, high] = range;
    this._validateKey(low);
    this._validateKey(high);

    const keys = this.#core.rangeSearch([low, high]) as (K | undefined)[];
    const out: K[] = [];
    const cmp = this.#core.comparator;

    for (const k of keys) {
      if (k === undefined) continue;
      if (!lowInclusive && cmp(k, low) === 0) continue;
      if (!highInclusive && cmp(k, high) === 0) continue;
      out.push(k);
    }

    return out;
  }
}
