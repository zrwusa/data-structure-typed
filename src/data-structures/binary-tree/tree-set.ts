/**
 * TreeSet (ordered set) — a restricted, native-like API backed by RedBlackTree.
 *
 * Design goals:
 * - No node exposure (no node inputs/outputs)
 * - Native Set-like surface + Java NavigableSet-like helpers
 * - Strict default comparator (number/string/Date), otherwise require comparator
 */

import type { Comparator } from '../../types';
import { RedBlackTree } from './red-black-tree';

export interface TreeSetOptions<K> {
  comparator?: Comparator<K>;
}

type RangeOptions = {
  lowInclusive?: boolean;
  highInclusive?: boolean;
};

export class TreeSet<K = any> implements Iterable<K> {
  readonly #core: RedBlackTree<K, undefined>;
  readonly #isDefaultComparator: boolean;

  constructor(elements: Iterable<K> = [], options: TreeSetOptions<K> = {}) {
    const comparator = options.comparator ?? TreeSet.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;

    // RedBlackTree expects an iterable of keys/entries/nodes/raws; for TreeSet we only accept keys.
    this.#core = new RedBlackTree<K, undefined>([], { comparator });

    for (const k of elements) this.add(k);
  }

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

  get size(): number {
    return this.#core.size;
  }

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

  add(key: K): this {
    this._validateKey(key);
    // RBT.set returns boolean; Set.add returns this.
    this.#core.set(key, undefined);
    return this;
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

  values(): IterableIterator<K> {
    return this.keys();
  }

  *entries(): IterableIterator<[K, K]> {
    for (const k of this.keys()) yield [k, k];
  }

  [Symbol.iterator](): IterableIterator<K> {
    return this.keys();
  }

  forEach(cb: (value: K, value2: K, set: TreeSet<K>) => void, thisArg?: any): void {
    for (const k of this) cb.call(thisArg, k, k, this);
  }

  // Navigable operations

  first(): K | undefined {
    return this.#core.getLeftMost();
  }

  last(): K | undefined {
    return this.#core.getRightMost();
  }

  pollFirst(): K | undefined {
    const k = this.first();
    if (k === undefined) return undefined;
    this.delete(k);
    return k;
  }

  pollLast(): K | undefined {
    const k = this.last();
    if (k === undefined) return undefined;
    this.delete(k);
    return k;
  }

  ceiling(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.ceiling(key);
  }

  floor(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.floor(key);
  }

  higher(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.higher(key);
  }

  lower(key: K): K | undefined {
    this._validateKey(key);
    return this.#core.lower(key);
  }

  rangeSearch(range: [K, K], options: RangeOptions = {}): K[] {
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
