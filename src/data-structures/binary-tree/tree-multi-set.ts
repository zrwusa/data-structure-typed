/**
 * TreeMultiSet (ordered multiset) — a restricted, native-like API backed by RedBlackTree.
 *
 * Design goals:
 * - No node exposure
 * - Strict default comparator (number/string/Date), otherwise require comparator
 * - Default iteration is expanded (each element yielded `count(x)` times)
 * - `delete(x)` removes one occurrence by default
 */
import type { Comparator, TreeMultiSetOptions } from '../../types';
import { ERR, raise } from '../../common';
import { RedBlackTree } from './red-black-tree';
import { TreeSet } from './tree-set';

export class TreeMultiSet<K = any, R = K> implements Iterable<K> {
  readonly #core: RedBlackTree<K, number>;
  readonly #isDefaultComparator: boolean;

  /**
   * Creates a new TreeMultiSet.
   * @param elements - Initial elements to add, or raw elements if `toElementFn` is provided.
   * @param options - Configuration options including optional `toElementFn` to transform raw elements.
   * @remarks Time O(m log m), Space O(m) where m is the number of initial elements
   * @example
   * // Standard usage with elements
   * const mset = new TreeMultiSet([1, 2, 2, 3]);
   *
   * // Using toElementFn to transform raw objects
   * const items = [{ score: 100 }, { score: 200 }, { score: 100 }];
   * const mset = new TreeMultiSet<number, Item>(items, { toElementFn: item => item.score });
   */
  constructor(elements: Iterable<R> | Iterable<K> = [], options: TreeMultiSetOptions<K, R> = {}) {
    const toElementFn = options.toElementFn;
    const comparator = options.comparator ?? TreeSet.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;
    this.#core = new RedBlackTree<K, number>([], {
      comparator,
      isMapMode: options.isMapMode,
      enableOrderStatistic: options.enableOrderStatistic
    });
    for (const item of elements) {
      const k = toElementFn ? toElementFn(item as R) : (item as K);
      this.add(k);
    }
  }

  private _size = 0; // total occurrences (sumCounts)

  /**
   * Total occurrences (sumCounts).
   * @remarks Time O(1), Space O(1)
   */
  get size(): number {
    return this._size;
  }

  /**
   * Number of distinct keys.
   * @remarks Time O(1), Space O(1)
 * @example
 * // Unique key count
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 3);
 *       ms.add(2, 2);
 *       console.log(ms.distinctSize); // 2;
*/
  get distinctSize(): number {
    return this.#core.size;
  }

  /**
   * Expose comparator for advanced usage/testing (read-only).
   * @remarks Time O(1), Space O(1)
   */
  get comparator(): Comparator<K> {
    return this.#core.comparator;
  }

  /**
   * Whether the multiset is empty.
   * @remarks Time O(1), Space O(1)
 * @example
 * // Check empty
 *  console.log(new TreeMultiSet().isEmpty()); // true;
*/
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Whether the multiset contains the given key.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Check existence
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1);
 *       console.log(ms.has(1)); // true;
 *       console.log(ms.has(2)); // false;
*/
  has(key: K): boolean {
    this._validateKey(key);
    return this.count(key) > 0;
  }

  /**
   * Returns the count of occurrences for the given key.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Get occurrence count
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 5);
 *       console.log(ms.count(1)); // 5;
*/
  count(key: K): number {
    this._validateKey(key);
    return this.#core.get(key) ?? 0;
  }

  /**
   * Add `n` occurrences of `key`.
   * @returns True if the multiset changed.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Add elements
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1);
 *       ms.add(1);
 *       ms.add(2);
 *       console.log(ms.count(1)); // 2;
 *       console.log(ms.size); // 3;
*/
  add(key: K, n = 1): boolean {
    this._validateKey(key);
    this._validateCount(n);
    if (n === 0) return false;
    const old = this.#core.get(key) ?? 0;
    const next = old + n;
    this.#core.set(key, next);
    this._size += n;
    return true;
  }

  /**
   * Set count for `key` to exactly `n`.
   * @returns True if changed.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Set occurrence count
 *  const ms = new TreeMultiSet<number>();
 *       ms.setCount(1, 3);
 *       console.log(ms.count(1)); // 3;
*/
  setCount(key: K, n: number): boolean {
    this._validateKey(key);
    this._validateCount(n);
    const old = this.#core.get(key) ?? 0;
    if (old === n) return false;
    if (n === 0) {
      if (old !== 0) this.#core.delete(key);
    } else {
      this.#core.set(key, n);
    }
    this._size += n - old;
    return true;
  }

  /**
   * Delete `n` occurrences of `key` (default 1).
   * @returns True if any occurrence was removed.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Remove one occurrence
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 3);
 *       ms.delete(1);
 *       console.log(ms.count(1)); // 2;
*/
  delete(key: K, n = 1): boolean {
    this._validateKey(key);
    this._validateCount(n);
    if (n === 0) return false;
    const old = this.#core.get(key) ?? 0;
    if (old === 0) return false;
    const removed = Math.min(old, n);
    const next = old - removed;
    if (next === 0) this.#core.delete(key);
    else this.#core.set(key, next);
    this._size -= removed;
    return true;
  }

  /**
   * Delete all occurrences of the given key.
   * @returns True if any occurrence was removed.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Remove all occurrences
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 3);
 *       ms.deleteAll(1);
 *       console.log(ms.has(1)); // false;
*/
  deleteAll(key: K): boolean {
    this._validateKey(key);
    const old = this.#core.get(key) ?? 0;
    if (old === 0) return false;
    this.#core.delete(key);
    this._size -= old;
    return true;
  }

  /**
   * Iterates over distinct keys (each key yielded once).
   * @remarks Time O(n), Space O(1)
 * @example
 * // Iterate unique keys
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 2);
 *       ms.add(2);
 *       console.log([...ms.keysDistinct()]); // [1, 2];
*/
  *keysDistinct(): IterableIterator<K> {
    yield* this.#core.keys();
  }

  /**
   * Iterates over entries as [key, count] pairs.
   * @remarks Time O(n), Space O(1)
 * @example
 * // Iterate entries
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 2);
 *       console.log([...ms.entries()].length); // > 0;
*/
  *entries(): IterableIterator<[K, number]> {
    for (const [k, v] of this.#core) {
      yield [k, v ?? 0];
    }
  }

  /**
   * Expanded iteration (default). Each key is yielded `count(key)` times.
   * @remarks Time O(size), Space O(1) where size is total occurrences
   */
  *[Symbol.iterator](): Iterator<K> {
    for (const [k, c] of this.entries()) {
      for (let i = 0; i < c; i++) yield k;
    }
  }

  /**
   * Iterate over all elements with multiplicity (Set-compatible, alias for `[Symbol.iterator]`).
   * @remarks Each key is yielded `count(key)` times. Time O(size), Space O(1) per step.
 * @example
 * // Iterate with multiplicity
 *  const ms = new TreeMultiSet<number>();
 *     ms.add(1); ms.add(1); ms.add(2); ms.add(3); ms.add(3); ms.add(3);
 *     console.log([...ms.keys()]); // [1, 1, 2, 3, 3, 3];
*/
  *keys(): IterableIterator<K> {
    yield* this;
  }

  /**
   * Iterate over all elements with multiplicity (Set-compatible, alias for `[Symbol.iterator]`).
   * @remarks Each key is yielded `count(key)` times. Time O(size), Space O(1) per step.
 * @example
 * // Iterate with multiplicity
 *  const ms = new TreeMultiSet<number>();
 *     ms.add(5); ms.add(5); ms.add(10);
 *     console.log([...ms.values()]); // [5, 5, 10];
*/
  *values(): IterableIterator<K> {
    yield* this;
  }

  /**
   * Returns an array with all elements (expanded).
   * @remarks Time O(size), Space O(size)
 * @example
 * // All elements (with duplicates)
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 2);
 *       ms.add(2);
 *       console.log(ms.toArray()); // [1, 1, 2];
*/
  toArray(): K[] {
    return [...this];
  }

  /**
   * Returns an array with distinct keys only.
   * @remarks Time O(n), Space O(n)
 * @example
 * // Unique keys only
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 3);
 *       ms.add(2);
 *       console.log(ms.toDistinctArray()); // [1, 2];
*/
  toDistinctArray(): K[] {
    return [...this.keysDistinct()];
  }

  /**
   * Returns an array of [key, count] entries.
   * @remarks Time O(n), Space O(n)
 * @example
 * // Key-count pairs
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 2);
 *       ms.add(3);
 *       console.log(ms.toEntries()); // [[1, 2], [3, 1]];
*/
  toEntries(): Array<[K, number]> {
    return [...this.entries()];
  }

  /**
   * Remove all elements from the multiset.
   * @remarks Time O(1), Space O(1)
 * @example
 * // Remove all
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1);
 *       ms.clear();
 *       console.log(ms.isEmpty()); // true;
*/
  clear(): void {
    this.#core.clear();
    this._size = 0;
  }

  /**
   * Returns the smallest key, or undefined if empty.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Smallest element
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(3);
 *       ms.add(1);
 *       console.log(ms.first()); // 1;
*/
  first(): K | undefined {
    return this.#core.getLeftMost();
  }

  // ━━━ clear ━━━

  /**
   * Returns the largest key, or undefined if empty.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Largest element
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1);
 *       ms.add(3);
 *       console.log(ms.last()); // 3;
*/
  last(): K | undefined {
    return this.#core.getRightMost();
  }

  // ━━━ Navigable methods ━━━

  /**
   * Removes all occurrences of the smallest key and returns it.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Remove and return smallest
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(2);
 *       ms.add(1);
 *       console.log(ms.pollFirst()); // 1;
 *       console.log(ms.has(1)); // false;
*/
  pollFirst(): K | undefined {
    const key = this.first();
    if (key === undefined) return undefined;
    this.deleteAll(key);
    return key;
  }

  /**
   * Removes all occurrences of the largest key and returns it.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Remove and return largest
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1);
 *       ms.add(3);
 *       console.log(ms.pollLast()); // 3;
*/
  pollLast(): K | undefined {
    const key = this.last();
    if (key === undefined) return undefined;
    this.deleteAll(key);
    return key;
  }

  /**
   * Returns the smallest key >= given key, or undefined.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Least key ≥ target
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(10);
 *       ms.add(20);
 *       ms.add(30);
 *       console.log(ms.ceiling(15)); // 20;
*/
  ceiling(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.ceiling(key);
  }

  /**
   * Returns the largest key <= given key, or undefined.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Greatest key ≤ target
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(10);
 *       ms.add(20);
 *       ms.add(30);
 *       console.log(ms.floor(25)); // 20;
*/
  floor(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.floor(key);
  }

  /**
   * Returns the smallest key > given key, or undefined.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Least key > target
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(10);
 *       ms.add(20);
 *       console.log(ms.higher(10)); // 20;
*/
  higher(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.higher(key);
  }

  /**
   * Returns the largest key < given key, or undefined.
   * @remarks Time O(log n), Space O(1)
 * @example
 * // Greatest key < target
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(10);
 *       ms.add(20);
 *       console.log(ms.lower(20)); // 10;
*/
  lower(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.lower(key);
  }

  /**
   * Iterates over distinct keys with their counts.
   * @remarks Time O(n), Space O(1)
 * @example
 * // Iterate
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 2);
 *       ms.add(2);
 *       const pairs: [number, number][] = [];
 *       ms.forEach((k, c) => pairs.push([k, c]));
 *       console.log(pairs); // [[1, 2], [2, 1]];
*/
  forEach(callback: (key: K, count: number) => void): void {
    for (const [k, c] of this.entries()) {
      callback(k, c);
    }
  }

  /**
   * Creates a new TreeMultiSet with entries that match the predicate.
   * @remarks Time O(n log n), Space O(n)
 * @example
 * // Filter
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 3);
 *       ms.add(2, 1);
 *       ms.add(3, 2);
 *       const filtered = ms.filter((k, c) => c > 1);
 *       console.log([...filtered.keysDistinct()]); // [1, 3];
*/
  filter(predicate: (key: K, count: number) => boolean): TreeMultiSet<K> {
    const result = new TreeMultiSet<K>([], {
      comparator: this.#isDefaultComparator ? undefined : this.comparator,
      isMapMode: this.#core.isMapMode
    });
    for (const [k, c] of this.entries()) {
      if (predicate(k, c)) {
        result.add(k, c);
      }
    }
    return result;
  }

  // ━━━ Functional methods ━━━

  /**
   * Reduces the multiset to a single value.
   * @remarks Time O(n), Space O(1)
 * @example
 * // Aggregate
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 2);
 *       ms.add(2, 3);
 *       const sum = ms.reduce((acc, k, c) => acc + k * c, 0);
 *       console.log(sum); // 8;
*/
  reduce<U>(callback: (accumulator: U, key: K, count: number) => U, initialValue: U): U {
    let acc = initialValue;
    for (const [k, c] of this.entries()) {
      acc = callback(acc, k, c);
    }
    return acc;
  }

  /**
   * Maps keys and counts to a new TreeMultiSet.
   * When multiple keys map to the same new key, counts are merged (added).
   * @remarks Time O(n log n), Space O(n)
 * @example
 * // Transform
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 2);
 *       ms.add(2, 3);
 *       const doubled = ms.map((k, c) => [k * 10, c] as [number, number]);
 *       console.log([...doubled.keysDistinct()]); // [10, 20];
*/
  map<K2>(
    mapper: (key: K, count: number) => [K2, number],
    options?: { comparator?: Comparator<K2> }
  ): TreeMultiSet<K2> {
    const result = new TreeMultiSet<K2>([], {
      comparator: options?.comparator,
      isMapMode: this.#core.isMapMode
    });
    for (const [k, c] of this.entries()) {
      const [newKey, newCount] = mapper(k, c);
      result.add(newKey, newCount);
    }
    return result;
  }

  /**
   * Creates an independent copy of this multiset.
   * @remarks Time O(n log n), Space O(n)
   * @example
   * // Order-statistic on BST
   *  const tree = new TreeMultiSet<number>([30, 10, 50, 20, 40], { enableOrderStatistic: true });
   *       console.log(tree.getByRank(0)); // 10;
   *       console.log(tree.getByRank(4)); // 50;
   *       console.log(tree.getRank(30)); // 2;
   */
  // ─── Order-Statistic Methods ───────────────────────────
  getByRank(k: number): K | undefined {
    return this.#core.getByRank(k);
  }

  /**
   * Get the rank of a key in sorted order
   * @example
   * // Get the rank of a key in sorted order
   *  const tree = new TreeMultiSet<number>(
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
   * Get elements by rank range
 * @example
 * // Pagination by position in tree order
 *  const tree = new TreeMultiSet<number>(
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
   * Deep copy
 * @example
 * // Deep clone
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1, 3);
 *       const copy = ms.clone();
 *       copy.deleteAll(1);
 *       console.log(ms.has(1)); // true;
*/
  clone(): TreeMultiSet<K> {
    const result = new TreeMultiSet<K>([], {
      comparator: this.#isDefaultComparator ? undefined : this.comparator,
      isMapMode: this.#core.isMapMode
    });
    for (const [k, c] of this.entries()) {
      result.add(k, c);
    }
    return result;
  }

  /**
   * Returns keys within the given range.
   * @remarks Time O(log n + k), Space O(k) where k is result size
 * @example
 * // Find in range
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(10);
 *       ms.add(20);
 *       ms.add(30);
 *       const result = ms.rangeSearch([15, 25]);
 *       console.log(result.length); // 1;
*/
  rangeSearch<C extends (key: K) => any>(range: [K, K], callback?: C): (C extends undefined ? K : ReturnType<C>)[] {
    const cb = callback ?? ((k: K) => k);
    return this.#core.rangeSearch(range, node => cb(node.key));
  }

  /**
   * Prints the internal tree structure (for debugging).
   * @remarks Time O(n), Space O(n)
 * @example
 * // Display
 *  const ms = new TreeMultiSet<number>();
 *       ms.add(1);
 *       expect(() => ms.print()).not.toThrow();
*/
  print(): void {
    this.#core.print();
  }

  // ━━━ Tree utilities ━━━

  /**
   * Validates the key against the default comparator rules.
   * @remarks Time O(1), Space O(1)
   */
  private _validateKey(key: K): void {
    if (!this.#isDefaultComparator) return;
    if (typeof key === 'number') {
      if (Number.isNaN(key)) raise(TypeError, ERR.invalidNaN('TreeMultiSet'));
      return;
    }
    if (typeof key === 'string') return;
    if (key instanceof Date) {
      if (Number.isNaN(key.getTime())) raise(TypeError, ERR.invalidDate('TreeMultiSet'));
      return;
    }
    raise(TypeError, ERR.comparatorRequired('TreeMultiSet'));
  }

  /**
   * Validates that count is a non-negative safe integer.
   * @remarks Time O(1), Space O(1)
   */
  private _validateCount(n: number): void {
    if (!Number.isSafeInteger(n) || n < 0)
      raise(RangeError, ERR.invalidArgument('count must be a safe integer >= 0.', 'TreeMultiSet'));
  }
}
