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
import { ERR } from '../../common';

/**
 * An ordered Map backed by a red-black tree.
 *
 * - Iteration order is ascending by key.
 * - No node exposure: all APIs use keys/values only.
 * @example
 * // Set multiple key-value pairs
 *  const tm = new TreeMap<number, string>();
 *     tm.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
 *     console.log(tm.size); // 3;
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
    const toEntryFn = options.toEntryFn;
    const comparator = options.comparator ?? TreeMap.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;

    this.#core = new RedBlackTree<K, V>([], { comparator, isMapMode: options.isMapMode, enableOrderStatistic: options.enableOrderStatistic });

    for (const item of entries) {
      let k: K;
      let v: V | undefined;

      if (toEntryFn) {
        // Use toEntryFn to transform raw element
        [k, v] = toEntryFn(item as R);
      } else {
        // Validate entries like native Map: each item must be a 2-tuple-like value.
        if (!Array.isArray(item) || item.length < 2) {
          throw new TypeError(ERR.invalidEntry('TreeMap'));
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
        /* istanbul ignore next -- _validateKey prevents NaN from entering the tree */
        if (Number.isNaN(a) || Number.isNaN(b)) throw new TypeError(ERR.invalidNaN('TreeMap'));
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
        if (Number.isNaN(ta) || Number.isNaN(tb)) throw new TypeError(ERR.invalidDate('TreeMap'));
        return ta > tb ? 1 : ta < tb ? -1 : 0;
      }

      throw new TypeError(ERR.comparatorRequired('TreeMap'));
    };
  }

  private _validateKey(key: K): void {
    if (!this.#isDefaultComparator) return;

    if (typeof key === 'number') {
      if (Number.isNaN(key)) throw new TypeError(ERR.invalidNaN('TreeMap'));
      return;
    }

    if (typeof key === 'string') return;

    if (key instanceof Date) {
      if (Number.isNaN(key.getTime())) throw new TypeError(ERR.invalidDate('TreeMap'));
      return;
    }

    throw new TypeError(ERR.comparatorRequired('TreeMap'));
  }

  /**
   * Number of entries in the map.
   */
  get size(): number {
    return this.#core.size;
  }

  /**
   * Whether the map is empty.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Check empty
 *  console.log(new TreeMap().isEmpty()); // true;
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Set or overwrite a value for a key.
   * @remarks Expected time O(log n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Sorted dictionary for a contact book
 *  const contacts = new TreeMap<string, string>([
 *       ['Bob', '555-0102'],
 *       ['Alice', '555-0101'],
 *       ['Charlie', '555-0103']
 *     ]);
 *
 *     // Contacts are automatically sorted by name
 *     console.log([...contacts.keys()]); // ['Alice', 'Bob', 'Charlie'];
 *     console.log(contacts.get('Bob')); // '555-0102';
 *
 *     // Find the first contact alphabetically after 'B'
 *     console.log(contacts.ceiling('B')); // ['Bob', '555-0102'];
 *
 *     // Find contacts in range
 *     console.log(contacts.rangeSearch(['Alice', 'Bob'])); // [
 *  //      ['Alice', '555-0101'],
 *  //      ['Bob', '555-0102']
 *  //    ];
   */
  set(key: K, value: V | undefined): this {
    this._validateKey(key);
    this.#core.set(key, value as V);
    return this;
  }

  /**
   * Get the value under a key.
   * @remarks Expected time O(log n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Configuration registry with typed lookups
 *  const config = new TreeMap<string, number>([
 *       ['maxRetries', 3],
 *       ['timeout', 5000],
 *       ['poolSize', 10]
 *     ]);
 *
 *     console.log(config.get('timeout')); // 5000;
 *     console.log(config.get('missing')); // undefined;
 *     console.log(config.size); // 3;
   */
  get(key: K): V | undefined {
    this._validateKey(key);
    return this.#core.get(key);
  }

  /**
   * Test whether a key exists.
   * @remarks Expected time O(log n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Feature flag checking
 *  const flags = new TreeMap<string, boolean>([
 *       ['darkMode', true],
 *       ['betaFeature', false],
 *       ['notifications', true]
 *     ]);
 *
 *     console.log(flags.has('darkMode')); // true;
 *     console.log(flags.has('unknownFlag')); // false;
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
 * // Session management with expiry
 *  const sessions = new TreeMap<string, number>([
 *       ['sess_abc', Date.now()],
 *       ['sess_def', Date.now()],
 *       ['sess_ghi', Date.now()]
 *     ]);
 *
 *     console.log(sessions.size); // 3;
 *     sessions.delete('sess_def');
 *     console.log(sessions.has('sess_def')); // false;
 *     console.log(sessions.size); // 2;
   */
  delete(key: K): boolean {
    this._validateKey(key);
    const res = this.#core.delete(key);
    return Array.isArray(res) && res.length > 0 && !!res[0]?.deleted;
  }

  /**
   * Remove all entries.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Remove all
 *  const tm = new TreeMap<number, string>([[1, 'a']]);
 *       tm.clear();
 *       console.log(tm.isEmpty()); // true;
   */
  clear(): void {
    this.#core.clear();
  }

  /**
   * Iterate over keys in ascending order.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Get sorted keys
 *  const tm = new TreeMap<number, string>([[3, 'c'], [1, 'a']]);
 *       console.log([...tm.keys()]); // [1, 3];
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Get values in key order
 *  const tm = new TreeMap<number, string>([[2, 'b'], [1, 'a']]);
 *       console.log([...tm.values()]); // ['a', 'b'];
   */
  *values(): IterableIterator<V | undefined> {
    for (const k of this.keys()) yield this._entryFromKey(k)[1];
  }

  /**
   * Iterate over `[key, value]` entries in ascending key order.
   *
   * Note: values may be `undefined`.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Iterate key-value pairs
 *  const tm = new TreeMap<number, string>([[3, 'c'], [1, 'a'], [2, 'b']]);
 *       console.log([...tm.entries()]); // [[1, 'a'], [2, 'b'], [3, 'c']];
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Execute for each entry
 *  const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
 *       const pairs: string[] = [];
 *       tm.forEach((v, k) => pairs.push(`${k}:${v}`));
 *       console.log(pairs); // ['1:a', '2:b'];
   */
  forEach(cb: (value: V | undefined, key: K, map: TreeMap<K, V>) => void, thisArg?: unknown): void {
    for (const [k, v] of this) cb.call(thisArg, v, k, this);
  }

  /**
   * Create a new TreeMap by mapping each entry to a new `[key, value]` entry.
   *
   * This mirrors `RedBlackTree.map`: mapping produces a new ordered container.
   * @remarks Time O(n log n) expected, Space O(n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Transform entries
 *  const tm = new TreeMap<number, number>([[1, 10], [2, 20]]);
 *       const doubled = tm.map((v, k) => [k, (v ?? 0) * 2] as [number, number]);
 *       console.log([...doubled.values()]); // [20, 40];
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Filter entries
 *  const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
 *       const filtered = tm.filter((v, k) => k > 1);
 *       console.log([...filtered.keys()]); // [2, 3];
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Aggregate values
 *  const tm = new TreeMap<number, number>([[1, 10], [2, 20]]);
 *       console.log(tm.reduce((acc, v) => acc + (v ?? 0), 0)); // 30;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Test all entries
 *  const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
 *       console.log(tm.every((v, k) => k > 0)); // true;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Test any entry
 *  const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
 *       console.log(tm.some((v, k) => k === 2)); // true;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Find matching entry
 *  const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
 *       console.log(tm.find(v => v === 'b')?.[0]); // 2;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Convert to array
 *  const tm = new TreeMap<number, string>([[2, 'b'], [1, 'a']]);
 *       console.log(tm.toArray()); // [[1, 'a'], [2, 'b']];
   */
  toArray(): Array<[K, V | undefined]> {
    return [...this];
  }

  /**
   * Print a human-friendly representation.
   * @remarks Time O(n), Space O(n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Display tree
 *  const tm = new TreeMap<number, string>([[1, 'a']]);
 *       expect(() => tm.print()).not.toThrow();
   */
  print(): void {
    // Delegate to the underlying tree's visualization.
    this.#core.print();
  }

  // Navigable operations (return entry tuples)
  // Note: returned tuple values may be `undefined`.

  /**
   * Smallest entry by key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Leaderboard with ranked scores
 *  // Use score as key (descending), player name as value
 *     const leaderboard = new TreeMap<number, string>([], {
 *       comparator: (a, b) => b - a // descending
 *     });
 *
 *     leaderboard.set(1500, 'Alice');
 *     leaderboard.set(2200, 'Bob');
 *     leaderboard.set(1800, 'Charlie');
 *     leaderboard.set(2500, 'Diana');
 *
 *     // Top 3 players (first 3 in descending order)
 *     const top3 = [...leaderboard.entries()].slice(0, 3);
 *     console.log(top3); // [
 *  //      [2500, 'Diana'],
 *  //      [2200, 'Bob'],
 *  //      [1800, 'Charlie']
 *  //    ];
 *
 *     // Highest scorer
 *     console.log(leaderboard.first()); // [2500, 'Diana'];
 *
 *     // Remove lowest scorer
 *     console.log(leaderboard.pollLast()); // [1500, 'Alice'];
 *     console.log(leaderboard.size); // 3;
   */
  first(): [K, V | undefined] | undefined {
    const k = this.#core.getLeftMost();
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Largest entry by key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Access the maximum entry
 *  const scores = new TreeMap<number, string>([
 *       [85, 'Bob'],
 *       [92, 'Alice'],
 *       [78, 'Charlie']
 *     ]);
 *
 *     console.log(scores.last()); // [92, 'Alice'];
 *     console.log(scores.first()); // [78, 'Charlie'];
   */
  last(): [K, V | undefined] | undefined {
    const k = this.#core.getRightMost();
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Remove and return the smallest entry.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Process items from lowest priority
 *  const tasks = new TreeMap<number, string>([
 *       [3, 'Low'],
 *       [1, 'Critical'],
 *       [2, 'Medium']
 *     ]);
 *
 *     // Process lowest priority first
 *     console.log(tasks.pollFirst()); // [1, 'Critical'];
 *     console.log(tasks.pollFirst()); // [2, 'Medium'];
 *     console.log(tasks.size); // 1;
   */
  pollFirst(): [K, V | undefined] | undefined {
    const entry = this.first();
    if (!entry) return undefined;
    this.delete(entry[0]);
    return entry;
  }

  /**
   * Remove and return the largest entry.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Remove the maximum entry
 *  const bids = new TreeMap<number, string>([
 *       [100, 'Alice'],
 *       [150, 'Bob'],
 *       [120, 'Charlie']
 *     ]);
 *
 *     // Remove highest bid
 *     console.log(bids.pollLast()); // [150, 'Bob'];
 *     console.log(bids.size); // 2;
 *     console.log(bids.last()); // [120, 'Charlie'];
   */
  pollLast(): [K, V | undefined] | undefined {
    const entry = this.last();
    if (!entry) return undefined;
    this.delete(entry[0]);
    return entry;
  }

  /**
   * Smallest entry whose key is >= the given key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Event scheduler with time-based lookup
 *  const events = new TreeMap<Date, string>();
 *
 *     const meeting = new Date('2024-01-15T10:00:00Z');
 *     const lunch = new Date('2024-01-15T12:00:00Z');
 *     const review = new Date('2024-01-15T15:00:00Z');
 *     const standup = new Date('2024-01-15T09:00:00Z');
 *
 *     events.set(meeting, 'Team Meeting');
 *     events.set(lunch, 'Lunch Break');
 *     events.set(review, 'Code Review');
 *     events.set(standup, 'Daily Standup');
 *
 *     // Events are sorted chronologically
 *     console.log([...events.values()]); // [
 *  //      'Daily Standup',
 *  //      'Team Meeting',
 *  //      'Lunch Break',
 *  //      'Code Review'
 *  //    ];
 *
 *     // Next event after 11:00
 *     const after11 = new Date('2024-01-15T11:00:00Z');
 *     console.log(events.ceiling(after11)?.[1]); // 'Lunch Break';
 *
 *     // Events between 9:30 and 13:00
 *     const from = new Date('2024-01-15T09:30:00Z');
 *     const to = new Date('2024-01-15T13:00:00Z');
 *     const window = events.rangeSearch([from, to]);
 *     console.log(window.map(([, v]) => v)); // ['Team Meeting', 'Lunch Break'];
   */
  ceiling(key: K): [K, V | undefined] | undefined {
    this._validateKey(key);
    const k = this.#core.ceiling(key);
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Largest entry whose key is <= the given key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Find the largest key ≤ target
 *  const versions = new TreeMap<number, string>([
 *       [1, 'v1.0'],
 *       [3, 'v3.0'],
 *       [5, 'v5.0'],
 *       [7, 'v7.0']
 *     ]);
 *
 *     // Largest version ≤ 4
 *     console.log(versions.floor(4)); // [3, 'v3.0'];
 *     // Largest version ≤ 5 (exact match)
 *     console.log(versions.floor(5)); // [5, 'v5.0'];
 *     // No version ≤ 0
 *     console.log(versions.floor(0)); // undefined;
   */
  floor(key: K): [K, V | undefined] | undefined {
    this._validateKey(key);
    const k = this.#core.floor(key);
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Smallest entry whose key is > the given key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Find the smallest key strictly > target
 *  const prices = new TreeMap<number, string>([
 *       [10, 'Basic'],
 *       [25, 'Standard'],
 *       [50, 'Premium'],
 *       [100, 'Enterprise']
 *     ]);
 *
 *     // Next tier above $25
 *     console.log(prices.higher(25)); // [50, 'Premium'];
 *     // Next tier above $99
 *     console.log(prices.higher(99)); // [100, 'Enterprise'];
 *     // Nothing above $100
 *     console.log(prices.higher(100)); // undefined;
   */
  higher(key: K): [K, V | undefined] | undefined {
    this._validateKey(key);
    const k = this.#core.higher(key);
    return k === undefined ? undefined : this._entryFromKey(k);
  }

  /**
   * Largest entry whose key is < the given key.
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Find the largest key strictly < target
 *  const temps = new TreeMap<number, string>([
 *       [0, 'Freezing'],
 *       [20, 'Cool'],
 *       [30, 'Warm'],
 *       [40, 'Hot']
 *     ]);
 *
 *     // Largest reading below 30
 *     console.log(temps.lower(30)); // [20, 'Cool'];
 *     // Nothing below 0
 *     console.log(temps.lower(0)); // undefined;
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
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Inventory system with price-sorted products
 *  interface Product {
 *       name: string;
 *       price: number;
 *       stock: number;
 *     }
 *
 *     const inventory = new TreeMap<string, Product, Product>(
 *       [
 *         { name: 'Widget', price: 9.99, stock: 100 },
 *         { name: 'Gadget', price: 24.99, stock: 50 },
 *         { name: 'Doohickey', price: 4.99, stock: 200 }
 *       ],
 *       { toEntryFn: p => [p.name, p] }
 *     );
 *
 *     // Sorted alphabetically by product name
 *     console.log([...inventory.keys()]); // ['Doohickey', 'Gadget', 'Widget'];
 *
 *     // Filter high-stock items
 *     const highStock = inventory.filter(p => (p?.stock ?? 0) > 75);
 *     console.log([...highStock.keys()]); // ['Doohickey', 'Widget'];
 *
 *     // Calculate total inventory value
 *     const totalValue = inventory.reduce(
 *       (sum, p) => sum + (p ? p.price * p.stock : 0),
 *       0
 *     );
 *     console.log(totalValue); // toBeCloseTo;
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
      /* istanbul ignore next -- defensive: tree keys are never undefined */ if (k === undefined) continue;
      if (!lowInclusive && cmp(k, low) === 0) continue;
      if (!highInclusive && cmp(k, high) === 0) continue;
      out.push(this._entryFromKey(k));
    }

    return out;
  }

  // ─── Order-Statistic Methods ───────────────────────────

  /**
   * Finds the k-th smallest key (0-indexed).
   * @remarks Time O(log n). Requires `enableOrderStatistic: true`.
   
   
   
    * @example
 * // Find k-th entry in a TreeMap
 *  const map = new TreeMap<string, number>(
 *         [['alice', 95], ['bob', 87], ['charlie', 92]],
 *         { enableOrderStatistic: true }
 *       );
 *       console.log(map.select(0)); // 'alice';
 *       console.log(map.select(1)); // 'bob';
 *       console.log(map.select(2)); // 'charlie';
   */
  select(k: number): K | undefined {
    return this.#core.select(k);
  }

  /**
   * Returns the 0-based rank of a key (number of elements strictly less than it).
   * @remarks Time O(log n). Requires `enableOrderStatistic: true`.
    * @example
 * // Get the rank of a key in sorted order
 *  const tree = new TreeMap<number>(
 *         [10, 20, 30, 40, 50],
 *         { enableOrderStatistic: true }
 *       );
 *       console.log(tree.rank(10)); // 0;  // smallest → rank 0
 *       console.log(tree.rank(30)); // 2;  // 2 elements less than 30
 *       console.log(tree.rank(50)); // 4;  // largest → rank 4
 *       console.log(tree.rank(25)); // 2;
   */
  rank(key: K): number {
    return this.#core.rank(key);
  }

  /**
   * Returns keys by rank range (0-indexed, inclusive on both ends).
   * @remarks Time O(log n + k). Requires `enableOrderStatistic: true`.
   
    * @example
 * // Pagination with rangeByRank
 *  const tree = new TreeMap<number>(
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
  rangeByRank(start: number, end: number): Array<[K, V | undefined]> {
    const keys = this.#core.rangeByRank(start, end);
    return keys
      .filter((k): k is K => k !== undefined)
      .map(k => [k, this.#core.get(k)] as [K, V | undefined]);
  }

  /**
   * Creates a shallow clone of this map.
   * @remarks Time O(n log n), Space O(n)
  
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Deep clone
 *  const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
 *       const copy = tm.clone();
 *       copy.delete(1);
 *       console.log(tm.has(1)); // true;
   */
  clone(): TreeMap<K, V> {
    return new TreeMap<K, V>(this, {
      comparator: this.#isDefaultComparator ? undefined : this.#userComparator,
      isMapMode: this.#core.isMapMode
    });
  }
}
