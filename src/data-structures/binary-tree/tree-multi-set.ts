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
import { RedBlackTree } from './red-black-tree';
import { TreeSet } from './tree-set';

export class TreeMultiSet<K = any> implements Iterable<K> {
  readonly #core: RedBlackTree<K, number>;
  readonly #isDefaultComparator: boolean;
  private _size = 0; // total occurrences (sumCounts)

  constructor(elements: Iterable<K> = [], options: TreeMultiSetOptions<K> = {}) {
    const comparator = options.comparator ?? TreeSet.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;
    this.#core = new RedBlackTree<K, number>([], { comparator, isMapMode: options.isMapMode });

    for (const k of elements) this.add(k);
  }

  private _validateKey(key: K): void {
    if (!this.#isDefaultComparator) return;

    if (typeof key === 'number') {
      if (Number.isNaN(key)) throw new TypeError('TreeMultiSet: NaN is not a valid key');
      return;
    }

    if (typeof key === 'string') return;

    if (key instanceof Date) {
      if (Number.isNaN(key.getTime())) throw new TypeError('TreeMultiSet: invalid Date key');
      return;
    }

    throw new TypeError('TreeMultiSet: comparator is required for non-number/non-string/non-Date keys');
  }

  private _validateCount(n: number): void {
    if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('TreeMultiSet: count must be a safe integer >= 0');
  }

  /** Total occurrences (sumCounts). */
  get size(): number {
    return this._size;
  }

  /** Number of distinct keys. */
  get distinctSize(): number {
    return this.#core.size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  has(key: K): boolean {
    this._validateKey(key);
    return this.count(key) > 0;
  }

  count(key: K): number {
    this._validateKey(key);
    return this.#core.get(key) ?? 0;
  }

  /**
   * Add `n` occurrences of `key`.
   * @returns True if the multiset changed.
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

  deleteAll(key: K): boolean {
    this._validateKey(key);
    const old = this.#core.get(key) ?? 0;
    if (old === 0) return false;
    this.#core.delete(key);
    this._size -= old;
    return true;
  }

  *keysDistinct(): IterableIterator<K> {
    yield* this.#core.keys();
  }

  *entries(): IterableIterator<[K, number]> {
    for (const [k, v] of this.#core) {
      yield [k, v ?? 0];
    }
  }

  /** Expanded iteration (default). */
  *[Symbol.iterator](): Iterator<K> {
    for (const [k, c] of this.entries()) {
      for (let i = 0; i < c; i++) yield k;
    }
  }

  toArray(): K[] {
    return [...this];
  }

  toDistinctArray(): K[] {
    return [...this.keysDistinct()];
  }

  toEntries(): Array<[K, number]> {
    return [...this.entries()];
  }

  /** Expose comparator for advanced usage/testing (read-only). */
  get comparator(): Comparator<K> {
    return (this.#core as any)._comparator;
  }

  // ━━━ clear ━━━

  /**
   * Remove all elements from the multiset.
   * @example
   * const ms = new TreeMultiSet([1, 2, 2, 3]);
   * ms.clear();
   * ms.size;  // 0
   */
  clear(): void {
    this.#core.clear();
    this._size = 0;
  }

  // ━━━ Navigable methods ━━━

  /**
   * Returns the smallest key, or undefined if empty.
   * @example
   * const ms = new TreeMultiSet([3, 1, 4]);
   * ms.first();  // 1
   */
  first(): K | undefined {
    return this.#core.getLeftMost();
  }

  /**
   * Returns the largest key, or undefined if empty.
   * @example
   * const ms = new TreeMultiSet([3, 1, 4]);
   * ms.last();  // 4
   */
  last(): K | undefined {
    return this.#core.getRightMost();
  }

  /**
   * Removes all occurrences of the smallest key and returns it.
   * @example
   * const ms = new TreeMultiSet([1, 1, 2, 3]);
   * ms.pollFirst();  // 1
   * ms.has(1);       // false
   */
  pollFirst(): K | undefined {
    const key = this.first();
    if (key === undefined) return undefined;
    this.deleteAll(key);
    return key;
  }

  /**
   * Removes all occurrences of the largest key and returns it.
   * @example
   * const ms = new TreeMultiSet([1, 2, 3, 3]);
   * ms.pollLast();  // 3
   * ms.has(3);      // false
   */
  pollLast(): K | undefined {
    const key = this.last();
    if (key === undefined) return undefined;
    this.deleteAll(key);
    return key;
  }

  /**
   * Returns the smallest key >= given key, or undefined.
   * @example
   * const ms = new TreeMultiSet([10, 20, 30]);
   * ms.ceiling(15);  // 20
   * ms.ceiling(20);  // 20
   */
  ceiling(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.ceiling(key);
  }

  /**
   * Returns the largest key <= given key, or undefined.
   * @example
   * const ms = new TreeMultiSet([10, 20, 30]);
   * ms.floor(25);  // 20
   * ms.floor(20);  // 20
   */
  floor(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.floor(key);
  }

  /**
   * Returns the smallest key > given key, or undefined.
   * @example
   * const ms = new TreeMultiSet([10, 20, 30]);
   * ms.higher(10);  // 20
   * ms.higher(15);  // 20
   */
  higher(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.higher(key);
  }

  /**
   * Returns the largest key < given key, or undefined.
   * @example
   * const ms = new TreeMultiSet([10, 20, 30]);
   * ms.lower(20);  // 10
   * ms.lower(15);  // 10
   */
  lower(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.lower(key);
  }

  // ━━━ Functional methods ━━━

  /**
   * Iterates over distinct keys with their counts.
   * @example
   * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
   * ms.forEach((key, count) => console.log(`${key}: ${count}`));
   * // 1: 2, 2: 1, 3: 3
   */
  forEach(callback: (key: K, count: number) => void): void {
    for (const [k, c] of this.entries()) {
      callback(k, c);
    }
  }

  /**
   * Creates a new TreeMultiSet with entries that match the predicate.
   * @example
   * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
   * const filtered = ms.filter((key, count) => count >= 2);
   * // TreeMultiSet { 1: 2, 3: 3 }
   */
  filter(predicate: (key: K, count: number) => boolean): TreeMultiSet<K> {
    const result = new TreeMultiSet<K>([], {
      comparator: this.#isDefaultComparator ? undefined : this.comparator,
      isMapMode: (this.#core as any)._isMapMode
    });
    for (const [k, c] of this.entries()) {
      if (predicate(k, c)) {
        result.add(k, c);
      }
    }
    return result;
  }

  /**
   * Reduces the multiset to a single value.
   * @example
   * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
   * const total = ms.reduce((acc, key, count) => acc + count, 0);  // 6
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
   * @example
   * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
   * const mapped = ms.map((key, count) => [key * 10, count]);
   * // TreeMultiSet { 10: 2, 20: 1, 30: 3 }
   * @example
   * // Collision: counts merge
   * const ms = new TreeMultiSet([1, 2, 3]);
   * const merged = ms.map((key, count) => [key % 2, count]);
   * // { 0: 1, 1: 2 }  (1 and 3 both map to 1, counts add)
   */
  map<K2>(
    mapper: (key: K, count: number) => [K2, number],
    options?: { comparator?: Comparator<K2> }
  ): TreeMultiSet<K2> {
    const result = new TreeMultiSet<K2>([], {
      comparator: options?.comparator,
      isMapMode: (this.#core as any)._isMapMode
    });
    for (const [k, c] of this.entries()) {
      const [newKey, newCount] = mapper(k, c);
      result.add(newKey, newCount);
    }
    return result;
  }

  /**
   * Creates an independent copy of this multiset.
   * @example
   * const ms = new TreeMultiSet([1, 1, 2]);
   * const copy = ms.clone();
   * copy.add(3);
   * ms.has(3);  // false (original unchanged)
   */
  clone(): TreeMultiSet<K> {
    const result = new TreeMultiSet<K>([], {
      comparator: this.#isDefaultComparator ? undefined : this.comparator,
      isMapMode: (this.#core as any)._isMapMode
    });
    for (const [k, c] of this.entries()) {
      result.add(k, c);
    }
    return result;
  }

  // ━━━ Tree utilities ━━━

  /**
   * Returns keys within the given range.
   * @example
   * const ms = new TreeMultiSet([10, 20, 30, 40, 50]);
   * ms.rangeSearch([15, 45]);  // [20, 30, 40]
   */
  rangeSearch<C extends (key: K) => any>(
    range: [K, K],
    callback?: C
  ): (C extends undefined ? K : ReturnType<C>)[] {
    const cb = callback ?? ((k: K) => k);
    return this.#core.rangeSearch(range, node => cb(node.key)) as any;
  }

  /**
   * Prints the internal tree structure (for debugging).
   * @example
   * const ms = new TreeMultiSet([1, 2, 3]);
   * ms.print();
   */
  print(): void {
    this.#core.print();
  }
}
