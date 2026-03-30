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
import { ERR, raise } from '../../common';
import { RedBlackTree } from './red-black-tree';

/**
 * An ordered Set backed by a red-black tree.
 *
 * - Iteration order is ascending by key.
 * - No node exposure: all APIs use keys only.
 * @example
 * // Set multiple key-value pairs
 *  const ts = new TreeSet<number, string>();
 *     ts.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
 *     console.log(ts.size); // 3;
 */
export class TreeSet<K = any, R = K> implements Iterable<K> {
  readonly #core: RedBlackTree<K, undefined>;
  readonly #isDefaultComparator: boolean;
  readonly #userComparator?: Comparator<K>;

  /**
   * Create a TreeSet from an iterable of keys or raw elements.
   *
   * @param elements - Iterable of keys, or raw elements if `toElementFn` is provided.
   * @param options - Configuration options including optional `toElementFn` to transform raw elements.
   * @throws {TypeError} When using the default comparator and encountering unsupported key types,
   * or invalid keys (e.g. `NaN`, invalid `Date`).
   * @example
   * // Standard usage with keys
   * const set = new TreeSet([3, 1, 2]);
   *
   * // Using toElementFn to transform raw objects
   * const users = [{ id: 3, name: 'Alice' }, { id: 1, name: 'Bob' }];
   * const set = new TreeSet<number, User>(users, { toElementFn: u => u.id });
   */
  constructor(elements: Iterable<R> | Iterable<K> = [], options: TreeSetOptions<K, R> = {}) {
    this.#userComparator = options.comparator;
    const toElementFn = options.toElementFn;
    const comparator = options.comparator ?? TreeSet.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;

    // RedBlackTree expects an iterable of keys/entries/nodes/raws; for TreeSet we only accept keys.
    this.#core = new RedBlackTree<K, undefined>([], { comparator, isMapMode: options.isMapMode, enableOrderStatistic: options.enableOrderStatistic });

    for (const item of elements) {
      const k = toElementFn ? toElementFn(item as R) : item as K;
      this.add(k);
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
      // numbers
      if (typeof a === 'number' && typeof b === 'number') {
        /* istanbul ignore next -- _validateKey prevents NaN from entering the tree */
        if (Number.isNaN(a) || Number.isNaN(b)) raise(TypeError, ERR.invalidNaN('TreeSet'));
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
        /* istanbul ignore next -- _validateKey prevents invalid Date from entering the tree */
        if (Number.isNaN(ta) || Number.isNaN(tb)) raise(TypeError, ERR.invalidDate('TreeSet'));
        return ta > tb ? 1 : ta < tb ? -1 : 0;
      }

      raise(TypeError, ERR.comparatorRequired('TreeSet'));
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Check empty
 *  console.log(new TreeSet().isEmpty()); // true;
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  private _validateKey(key: K): void {
    if (!this.#isDefaultComparator) return;

    if (typeof key === 'number') {
      if (Number.isNaN(key)) raise(TypeError, ERR.invalidNaN('TreeSet'));
      return;
    }

    if (typeof key === 'string') return;

    if (key instanceof Date) {
      if (Number.isNaN(key.getTime())) raise(TypeError, ERR.invalidDate('TreeSet'));
      return;
    }

    // Other key types should have provided a comparator, so reaching here means misuse.
    raise(TypeError, ERR.comparatorRequired('TreeSet'));
  }

  /**
   * Add a key to the set (no-op if already present).
   * @remarks Expected time O(log n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Unique tags with sorted order
 *  const tags = new TreeSet<string>(['javascript', 'typescript', 'react', 'typescript', 'node']);
 *
 *     // Duplicates removed, sorted alphabetically
 *     console.log([...tags]); // ['javascript', 'node', 'react', 'typescript'];
 *     console.log(tags.size); // 4;
 *
 *     tags.add('angular');
 *     console.log(tags.first()); // 'angular';
 *     console.log(tags.last()); // 'typescript';
   */
  add(key: K): this {
    this._validateKey(key);
    // RBT.set returns boolean; Set.add returns this.
    this.#core.set(key, undefined);
    return this;
  }

  /**
   * Add multiple keys at once.
   * @remarks Expected time O(m log n), where m is the number of keys.
   * @param keys - Iterable of keys to add.
   * @returns Array of booleans indicating whether each key was newly added.
  
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Add multiple keys
 *  const ts = new TreeSet<number>();
 *     ts.addMany([5, 3, 7, 1, 9]);
 *     console.log(ts.size); // 5;
   */
  addMany(keys: Iterable<K>): boolean[] {
    const results: boolean[] = [];
    for (const key of keys) {
      this._validateKey(key);
      results.push(this.#core.set(key, undefined));
    }
    return results;
  }

  /**
   * Test whether a key exists.
   * @remarks Expected time O(log n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Checking membership in a sorted collection
 *  const allowed = new TreeSet<string>(['admin', 'editor', 'viewer']);
 *
 *     console.log(allowed.has('admin')); // true;
 *     console.log(allowed.has('guest')); // false;
   */
  has(key: K): boolean {
    this._validateKey(key);
    return this.#core.has(key);
  }

  /**
   * Delete a key.
   * @returns `true` if the key existed; otherwise `false`.
   * @remarks Expected time O(log n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Removing elements while maintaining order
 *  const nums = new TreeSet<number>([1, 3, 5, 7, 9]);
 *
 *     console.log(nums.delete(5)); // true;
 *     console.log(nums.delete(5)); // false; // already gone
 *     console.log([...nums]); // [1, 3, 7, 9];
   */
  delete(key: K): boolean {
    this._validateKey(key);
    return this.#core.delete(key);
  }

  /**
   * Delete all keys matching a predicate.
   * @remarks Time O(N), Space O(N)
   * @param predicate - Function (key, index, set) → boolean; return true to delete.
   * @returns True if at least one key was deleted.
   */
  deleteWhere(predicate: (key: K, index: number, set: this) => boolean): boolean {
    let deleted = false;
    let index = 0;
    for (const key of this) {
      if (predicate(key, index++, this)) {
        this.delete(key);
        deleted = true;
      }
    }
    return deleted;
  }

  /**
   * Remove all keys.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Remove all
 *  const ts = new TreeSet<number>([1, 2]);
 *       ts.clear();
 *       console.log(ts.isEmpty()); // true;
   */
  clear(): void {
    this.#core.clear();
  }

  /**
   * Iterate over keys in ascending order.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Get sorted keys
 *  const ts = new TreeSet<number>([30, 10, 20]);
 *       console.log([...ts.keys()]); // [10, 20, 30];
   */
  keys(): IterableIterator<K> {
    return this.#core.keys();
  }

  /**
   * Iterate over values in ascending order.
   *
   * Note: for Set-like containers, `values()` is the same as `keys()`.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Get values (same as keys for Set)
 *  const ts = new TreeSet<number>([2, 1, 3]);
 *       console.log([...ts.values()]); // [1, 2, 3];
   */
  values(): IterableIterator<K> {
    return this.keys();
  }

  /**
   * Iterate over `[value, value]` pairs (native Set convention).
   *
   * Note: TreeSet stores only keys internally; `[k, k]` is created on-the-fly during iteration.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Iterate entries
 *  const ts = new TreeSet<number>([3, 1, 2]);
 *       console.log([...ts.entries()].map(([k]) => k)); // [1, 2, 3];
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Execute for each
 *  const ts = new TreeSet<number>([3, 1, 2]);
 *       const keys: number[] = [];
 *       ts.forEach(k => keys.push(k));
 *       console.log(keys); // [1, 2, 3];
   */
  forEach(cb: (value: K, value2: K, set: TreeSet<K>) => void, thisArg?: unknown): void {
    for (const k of this) cb.call(thisArg, k, k, this);
  }

  /**
   * Create a new TreeSet by mapping each value to a new key.
   *
   * This mirrors `RedBlackTree.map`: mapping produces a new ordered container.
   * @remarks Time O(n log n) expected, Space O(n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Transform
 *  const ts = new TreeSet<number>([1, 2, 3]);
 *       const doubled = ts.map(k => k * 2);
 *       console.log([...doubled]); // [2, 4, 6];
   */
  map<MK>(
    callbackfn: TreeSetElementCallback<K, MK, TreeSet<K>>,
    options: Omit<TreeSetOptions<MK>, 'toElementFn'> & { comparator?: (a: MK, b: MK) => number } = {},
    thisArg?: unknown
  ): TreeSet<MK> {
    const out = new TreeSet<MK>([], options as TreeSetOptions<MK>);
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Filter
 *  const ts = new TreeSet<number>([1, 2, 3, 4, 5]);
 *       const evens = ts.filter(k => k % 2 === 0);
 *       console.log([...evens]); // [2, 4];
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Aggregate
 *  const ts = new TreeSet<number>([1, 2, 3]);
 *       const sum = ts.reduce((acc, k) => acc + k, 0);
 *       console.log(sum); // 6;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Test all
 *  const ts = new TreeSet<number>([2, 4, 6]);
 *       console.log(ts.every(k => k > 0)); // true;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Test any
 *  const ts = new TreeSet<number>([1, 3, 5]);
 *       console.log(ts.some(k => k === 3)); // true;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Find entry
 *  const ts = new TreeSet<number>([1, 2, 3]);
 *       const found = ts.find(k => k === 2);
 *       console.log(found); // 2;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Convert to array
 *  const ts = new TreeSet<number>([3, 1, 2]);
 *       console.log(ts.toArray()); // [1, 2, 3];
   */
  toArray(): K[] {
    return [...this];
  }

  /**
   * Print a human-friendly representation.
   * @remarks Time O(n), Space O(n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Display tree
 *  const ts = new TreeSet<number>([1, 2, 3]);
 *       expect(() => ts.print()).not.toThrow();
   */
  print(): void {
    // Delegate to the underlying tree's visualization.
    this.#core.print();
  }

  // Navigable operations

  /**
   * Smallest key in the set.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Student grade ranking with custom comparator
 *  interface Student {
 *       name: string;
 *       gpa: number;
 *     }
 *
 *     const ranking = new TreeSet<Student>(
 *       [
 *         { name: 'Alice', gpa: 3.8 },
 *         { name: 'Bob', gpa: 3.5 },
 *         { name: 'Charlie', gpa: 3.9 },
 *         { name: 'Diana', gpa: 3.5 }
 *       ],
 *       { comparator: (a, b) => b.gpa - a.gpa || a.name.localeCompare(b.name) }
 *     );
 *
 *     // Sorted by GPA descending, then name ascending
 *     const names = [...ranking].map(s => s.name);
 *     console.log(names); // ['Charlie', 'Alice', 'Bob', 'Diana'];
 *
 *     // Top student
 *     console.log(ranking.first()?.name); // 'Charlie';
 *
 *     // Filter students with GPA >= 3.8
 *     const honors = ranking.filter(s => s.gpa >= 3.8);
 *     console.log(honors.toArray().map(s => s.name)); // ['Charlie', 'Alice'];
   */
  first(): K | undefined {
    return this.#core.getLeftMost();
  }

  /**
   * Largest key in the set.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Get the maximum element
 *  const temps = new TreeSet<number>([18, 22, 15, 30, 25]);
 *     console.log(temps.last()); // 30;
 *     console.log(temps.first()); // 15;
   */
  last(): K | undefined {
    return this.#core.getRightMost();
  }

  /**
   * Remove and return the smallest key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Remove and return minimum
 *  const queue = new TreeSet<number>([5, 1, 8, 3]);
 *
 *     console.log(queue.pollFirst()); // 1;
 *     console.log(queue.pollFirst()); // 3;
 *     console.log(queue.size); // 2;
   */
  pollFirst(): K | undefined {
    const k = this.first();
    if (k === undefined) return undefined;
    this.delete(k);
    return k;
  }

  /**
   * Remove and return the largest key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Remove and return maximum
 *  const stack = new TreeSet<number>([10, 20, 30]);
 *
 *     console.log(stack.pollLast()); // 30;
 *     console.log(stack.size); // 2;
   */
  pollLast(): K | undefined {
    const k = this.last();
    if (k === undefined) return undefined;
    this.delete(k);
    return k;
  }

  /**
   * Smallest key that is >= the given key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Finding nearest available time slot
 *  // Available appointment times (minutes from midnight)
 *     const slots = new TreeSet<number>([540, 600, 660, 720, 840, 900]);
 *
 *     // Customer wants something around 10:30 (630 min)
 *     const nearest = slots.ceiling(630);
 *     console.log(nearest); // 660; // 11:00 AM
 *
 *     // What's the latest slot before 2:00 PM (840)?
 *     const before2pm = slots.lower(840);
 *     console.log(before2pm); // 720; // 12:00 PM
 *
 *     // Book the 11:00 slot
 *     slots.delete(660);
 *     console.log(slots.ceiling(630)); // 720;
   */
  ceiling(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.ceiling(key);
  }

  /**
   * Largest key that is <= the given key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Largest element ≤ target
 *  const breakpoints = new TreeSet<number>([320, 768, 1024, 1280, 1920]);
 *
 *     // Current width is 800 → which breakpoint applies?
 *     console.log(breakpoints.floor(800)); // 768;
 *     console.log(breakpoints.floor(1024)); // 1024; // exact match
 *     console.log(breakpoints.floor(100)); // undefined;
   */
  floor(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.floor(key);
  }

  /**
   * Smallest key that is > the given key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Smallest element strictly > target
 *  const levels = new TreeSet<number>([1, 5, 10, 25, 50, 100]);
 *
 *     console.log(levels.higher(10)); // 25;
 *     console.log(levels.higher(100)); // undefined;
   */
  higher(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.higher(key);
  }

  /**
   * Largest key that is < the given key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Largest element strictly < target
 *  const tiers = new TreeSet<number>([100, 200, 500, 1000]);
 *
 *     console.log(tiers.lower(500)); // 200;
 *     console.log(tiers.lower(100)); // undefined;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // IP address blocklist with range checking
 *  // Simplified: use numeric IP representation
 *     const blocklist = new TreeSet<number>([
 *       167772160, // 10.0.0.0
 *       167772416, // 10.0.1.0
 *       167772672, // 10.0.2.0
 *       167773184  // 10.0.4.0
 *     ]);
 *
 *     // Check if any blocked IP is in range 10.0.1.0 - 10.0.3.0
 *     const inRange = blocklist.rangeSearch([167772416, 167772928]);
 *     console.log(inRange); // [167772416, 167772672];
 *
 *     // Quick membership check
 *     console.log(blocklist.has(167772416)); // true;
 *     console.log(blocklist.has(167772800)); // false;
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
      /* istanbul ignore next -- defensive: tree keys are never undefined */ if (k === undefined) continue;
      if (!lowInclusive && cmp(k, low) === 0) continue;
      if (!highInclusive && cmp(k, high) === 0) continue;
      out.push(k);
    }

    return out;
  }

  // ─── Order-Statistic Methods ───────────────────────────

  /**
   * Returns the element at the k-th position in tree order (0-indexed).
   * @remarks Time O(log n). Requires `enableOrderStatistic: true`.
   
   
   
    * @example
 * // Find k-th element in a TreeSet
 *  const set = new TreeSet<number>([30, 10, 50, 20, 40], { enableOrderStatistic: true });
 *       console.log(set.getByRank(0)); // 10;
 *       console.log(set.getByRank(2)); // 30;
 *       console.log(set.getRank(30)); // 2;
   */
  getByRank(k: number): K | undefined {
    return this.#core.getByRank(k);
  }

  /**
   * Returns the 0-based rank of a key (number of elements that precede it in tree order).
   * @remarks Time O(log n). Requires `enableOrderStatistic: true`.
    * @example
 * // Get the rank of a key in sorted order
 *  const tree = new TreeSet<number>(
 *         [10, 20, 30, 40, 50],
 *         { enableOrderStatistic: true }
 *       );
 *       console.log(tree.getRank(10)); // 0;  // smallest → rank 0
 *       console.log(tree.getRank(30)); // 2;  // 2 elements before 30 in tree order
 *       console.log(tree.getRank(50)); // 4;  // largest → rank 4
 *       console.log(tree.getRank(25)); // 2;
   */
  getRank(key: K): number {
    return this.#core.getRank(key);
  }

  /**
   * Returns elements by rank range (0-indexed, inclusive on both ends).
   * @remarks Time O(log n + k). Requires `enableOrderStatistic: true`.
   
   
   
   
   
   
   
    * @example
 * // Pagination by position in tree order
 *  const tree = new TreeSet<number>(
 *         [10, 20, 30, 40, 50, 60, 70, 80, 90],
 *         { enableOrderStatistic: true }
 *       );
 *       const pageSize = 3;
 *
 *       // Page 1
 *       console.log(tree.rangeByRank(0, pageSize - 1)); // [10, 20, 30];
 *       // Page 2
 *       console.log(tree.rangeByRank(pageSize, 2 * pageSize - 1)); // [40, 50, 60];
 *       // Page 3
 *       console.log(tree.rangeByRank(2 * pageSize, 3 * pageSize - 1)); // [70, 80, 90];
   */
  rangeByRank(start: number, end: number): K[] {
    return this.#core.rangeByRank(start, end).filter((k): k is K => k !== undefined);
  }

  /**
   * Creates a shallow clone of this set.
   * @remarks Time O(n log n), Space O(n)
  
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Deep clone
 *  const ts = new TreeSet<number>([1, 2, 3]);
 *       const copy = ts.clone();
 *       copy.delete(1);
 *       console.log(ts.has(1)); // true;
   */
  clone(): TreeSet<K> {
    return new TreeSet<K>(this, {
      comparator: this.#isDefaultComparator ? undefined : this.#userComparator,
      isMapMode: this.#core.isMapMode
    });
  }
}
