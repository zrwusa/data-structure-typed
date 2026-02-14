/**
 * TreeMap (ordered map) — a restricted, native-like API backed by RedBlackTree.
 *
 * Design goals:
 * - No node exposure (no node inputs/outputs)
 * - Native Map-like surface + Java NavigableMap-like helpers
 * - Strict default comparator (number/string/Date), otherwise require comparator
 */

import type { Comparator } from '../../types';
import { RedBlackTree } from './red-black-tree';

export interface TreeMapOptions<K> {
  comparator?: Comparator<K>;
}

type RangeOptions = {
  lowInclusive?: boolean;
  highInclusive?: boolean;
};

export class TreeMap<K = any, V = any> implements Iterable<[K, V]> {
  readonly #core: RedBlackTree<K, V>;
  readonly #isDefaultComparator: boolean;

  constructor(entries: Iterable<[K, V]> = [], options: TreeMapOptions<K> = {}) {
    const comparator = options.comparator ?? TreeMap.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;

    this.#core = new RedBlackTree<K, V>([], { comparator });

    // Validate entries like native Map: each item must be a 2-tuple-like value.
    for (const item of entries as unknown as Iterable<unknown>) {
      if (!Array.isArray(item) || item.length < 2) {
        throw new TypeError('TreeMap: each entry must be a [key, value] tuple');
      }
      const k = item[0] as K;
      const v = item[1] as V;
      this.set(k, v);
    }
  }

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

  get size(): number {
    return this.#core.size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  set(key: K, value: V): this {
    this._validateKey(key);
    this.#core.set(key, value);
    return this;
  }

  get(key: K): V | undefined {
    this._validateKey(key);
    return this.#core.get(key);
  }

  has(key: K): boolean {
    this._validateKey(key);
    return this.#core.has(key);
  }

  delete(key: K): boolean {
    this._validateKey(key);
    const res = this.#core.delete(key);
    return Array.isArray(res) && res.length > 0 && !!res[0]?.deleted;
  }

  clear(): void {
    this.#core.clear();
  }

  keys(): IterableIterator<K> {
    return this.#core.keys();
  }

  *values(): IterableIterator<V> {
    for (const k of this.keys()) yield this.get(k) as V;
  }

  *entries(): IterableIterator<[K, V]> {
    for (const k of this.keys()) {
      // If the key exists, get() may still return undefined (allowed). We still yield the entry.
      yield [k, this.get(k) as V];
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  forEach(cb: (value: V, key: K, map: TreeMap<K, V>) => void, thisArg?: any): void {
    for (const [k, v] of this) cb.call(thisArg, v, k, this);
  }

  // Navigable operations (return entry tuples)

  first(): [K, V] | undefined {
    const k = this.#core.getLeftMost();
    return k === undefined ? undefined : [k, this.get(k) as V];
  }

  last(): [K, V] | undefined {
    const k = this.#core.getRightMost();
    return k === undefined ? undefined : [k, this.get(k) as V];
  }

  pollFirst(): [K, V] | undefined {
    const entry = this.first();
    if (!entry) return undefined;
    this.delete(entry[0]);
    return entry;
  }

  pollLast(): [K, V] | undefined {
    const entry = this.last();
    if (!entry) return undefined;
    this.delete(entry[0]);
    return entry;
  }

  ceiling(key: K): [K, V] | undefined {
    this._validateKey(key);
    const k = this.#core.ceiling(key);
    return k === undefined ? undefined : [k, this.get(k) as V];
  }

  floor(key: K): [K, V] | undefined {
    this._validateKey(key);
    const k = this.#core.floor(key);
    return k === undefined ? undefined : [k, this.get(k) as V];
  }

  higher(key: K): [K, V] | undefined {
    this._validateKey(key);
    const k = this.#core.higher(key);
    return k === undefined ? undefined : [k, this.get(k) as V];
  }

  lower(key: K): [K, V] | undefined {
    this._validateKey(key);
    const k = this.#core.lower(key);
    return k === undefined ? undefined : [k, this.get(k) as V];
  }

  rangeSearch(range: [K, K], options: RangeOptions = {}): [K, V][] {
    const { lowInclusive = true, highInclusive = true } = options;
    const [low, high] = range;
    this._validateKey(low);
    this._validateKey(high);

    const keys = this.#core.rangeSearch([low, high]) as (K | undefined)[];
    const out: [K, V][] = [];
    const cmp = this.#core.comparator;

    for (const k of keys) {
      if (k === undefined) continue;
      if (!lowInclusive && cmp(k, low) === 0) continue;
      if (!highInclusive && cmp(k, high) === 0) continue;
      out.push([k, this.get(k) as V]);
    }

    return out;
  }
}
