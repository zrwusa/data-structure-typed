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
}
