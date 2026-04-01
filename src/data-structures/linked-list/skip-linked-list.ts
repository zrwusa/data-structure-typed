/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { Comparator, EntryCallback } from '../../types';
import { ERR, raise } from '../../common';
import { IterableEntryBase } from '../base';

export class SkipListNode<K, V> {
  key: K;
  value: V;
  forward: (SkipListNode<K, V> | undefined)[];

  constructor(key: K, value: V, level: number) {
    this.key = key;
    this.value = value;
    this.forward = new Array(level).fill(undefined);
  }
}

export type SkipListOptions<K, V, R = [K, V]> = {
  comparator?: Comparator<K>;
  toEntryFn?: (rawElement: R) => [K, V];
  maxLevel?: number;
  probability?: number;
};
export type SkipListRangeOptions = {
  lowInclusive?: boolean;
  highInclusive?: boolean;
};

/**
 * SkipList — a probabilistic sorted key-value container.
 *
 * API mirrors TreeMap: users can swap `TreeMap` ↔ `SkipList` with zero code changes.
 * Reference: Java ConcurrentSkipListMap (NavigableMap interface).
 *
 * @example
 * // Display skip list
 *  const sl = new SkipList<number, string>([[1, 'a']]);
 *     expect(() => sl.print()).not.toThrow();
 */
export class SkipList<K = any, V = any, R = [K, V]> extends IterableEntryBase<K, V | undefined> {
  // ─── Internal state ──────────────────────────────────────────
  protected _head: SkipListNode<K, V>;
  protected _level: number = 0;
  readonly #comparator: Comparator<K>;
  readonly #isDefaultComparator: boolean;

  constructor(entries: Iterable<R> | Iterable<[K, V | undefined]> = [], options: SkipListOptions<K, V, R> = {}) {
    super();
    const { comparator, toEntryFn, maxLevel, probability } = options;
    if (typeof maxLevel === 'number' && maxLevel > 0) this._maxLevel = maxLevel;
    if (typeof probability === 'number' && probability > 0 && probability < 1) this._probability = probability;
    this.#isDefaultComparator = comparator === undefined;
    this.#comparator = comparator ?? SkipList.createDefaultComparator<K>();
    this._head = new SkipListNode<K, V>(undefined as K, undefined as V, this._maxLevel);
    for (const item of entries) {
      let k: K;
      let v: V | undefined;
      if (toEntryFn) {
        [k, v] = toEntryFn(item as R);
      } else {
        if (!Array.isArray(item) || item.length < 2) {
          raise(TypeError, ERR.invalidEntry('SkipList'));
        }
        [k, v] = item as [K, V];
      }
      this.set(k, v as V);
    }
  }

  protected _size: number = 0;

  // ─── Size & lifecycle ────────────────────────────────────────
  get size(): number {
    return this._size;
  }

  protected _maxLevel: number = 16;

  get maxLevel(): number {
    return this._maxLevel;
  }

  protected _probability: number = 0.5;

  get probability(): number {
    return this._probability;
  }

  get comparator(): Comparator<K> {
    return this.#comparator;
  }

  /**
   * Creates a default comparator supporting number, string, Date, and bigint.
   */
  static createDefaultComparator<K>(): Comparator<K> {
    return (a: K, b: K): number => {
      if (typeof a === 'number' && typeof b === 'number') {
        if (Number.isNaN(a) || Number.isNaN(b)) raise(TypeError, ERR.invalidNaN('SkipList'));
        return a - b;
      }
      if (typeof a === 'string' && typeof b === 'string') {
        return a < b ? -1 : a > b ? 1 : 0;
      }
      if (a instanceof Date && b instanceof Date) {
        const ta = a.getTime(),
          tb = b.getTime();
        if (Number.isNaN(ta) || Number.isNaN(tb)) raise(TypeError, ERR.invalidDate('SkipList'));
        return ta - tb;
      }
      if (typeof a === 'bigint' && typeof b === 'bigint') {
        return a < b ? -1 : a > b ? 1 : 0;
      }
      raise(TypeError, ERR.comparatorRequired('SkipList'));
    };
  }

  /**
   * Check if empty
   * @example
   * // Check if empty
   *  const sl = new SkipList<number, string>();
   *     console.log(sl.isEmpty()); // true;
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Remove all entries
   * @example
   * // Remove all entries
   *  const sl = new SkipList<number, string>([
   *       [1, 'a'],
   *       [2, 'b']
   *     ]);
   *     sl.clear();
   *     console.log(sl.isEmpty()); // true;
   */
  clear(): void {
    this._head = new SkipListNode<K, V>(undefined as K, undefined as V, this._maxLevel);
    this._level = 0;
    this._size = 0;
  }

  /**
   * Create independent copy
   * @example
   * // Create independent copy
   *  const sl = new SkipList<number, string>([
   *       [1, 'a'],
   *       [2, 'b']
   *     ]);
   *     const copy = sl.clone();
   *     copy.delete(1);
   *     console.log(sl.has(1)); // true;
   */
  clone(): this {
    return new SkipList<K, V, R>(this as Iterable<[K, V | undefined]>, {
      comparator: this.#isDefaultComparator ? undefined : this.#comparator,
      maxLevel: this._maxLevel,
      probability: this._probability
    }) as this;
  }

  // ─── Core CRUD ───────────────────────────────────────────────

  /**
   * Insert or update a key-value pair. Returns `this` for chaining.
   * Unique keys only — if key exists, value is updated in place.
   * @example
   * // In-memory sorted key-value store
   *  const store = new SkipList<number, string>();
   *
   *     store.set(3, 'three');
   *     store.set(1, 'one');
   *     store.set(5, 'five');
   *     store.set(2, 'two');
   *
   *     console.log(store.get(3)); // 'three';
   *     console.log(store.get(1)); // 'one';
   *     console.log(store.get(5)); // 'five';
   *
   *     // Update existing key
   *     store.set(3, 'THREE');
   *     console.log(store.get(3)); // 'THREE';
   */
  set(key: K, value: V): this {
    const cmp = this.#comparator;
    const update = this._findUpdate(key);
    // If key already exists, update value in place
    const existing = update[0].forward[0];
    if (existing && cmp(existing.key, key) === 0) {
      existing.value = value;
      return this;
    }
    const newLevel = this._randomLevel();
    const newNode = new SkipListNode(key, value, newLevel);
    if (newLevel > this._level) {
      for (let i = this._level; i < newLevel; i++) {
        update[i] = this._head;
      }
      this._level = newLevel;
    }
    for (let i = 0; i < newLevel; i++) {
      newNode.forward[i] = update[i].forward[i];
      update[i].forward[i] = newNode;
    }
    this._size++;
    return this;
  }

  /**
   * Get the value for a key, or `undefined` if not found.
   * Overrides base O(n) with O(log n) skip-list search.
   * @example
   * // Building a sorted index
   *  type Product = { id: number; name: string; price: number };
   *     const products: Product[] = [
   *       { id: 1, name: 'Widget', price: 25 },
   *       { id: 2, name: 'Gadget', price: 50 },
   *       { id: 3, name: 'Doohickey', price: 15 }
   *     ];
   *
   *     const index = new SkipList<number, Product, Product>(products, {
   *       toEntryFn: (p: Product) => [p.price, p]
   *     });
   *
   *     // Iterate in sorted order by price
   *     const names = [...index.values()].map(p => p!.name);
   *     console.log(names); // ['Doohickey', 'Widget', 'Gadget'];
   *
   *     // Range search: products between $20 and $60
   *     const range = index.rangeSearch([20, 60]);
   *     console.log(range.map(([, p]) => p!.name)); // ['Widget', 'Gadget'];
   */
  override get(key: K): V | undefined {
    const node = this._findNode(key);
    return node ? node.value : undefined;
  }

  /**
   * Check if a key exists.
   * Overrides base O(n) with O(log n) skip-list search.
   * @example
   * // Check key existence
   *  const sl = new SkipList<number, string>([
   *       [1, 'a'],
   *       [3, 'c'],
   *       [5, 'e']
   *     ]);
   *     console.log(sl.has(3)); // true;
   *     console.log(sl.has(4)); // false;
   */
  override has(key: K): boolean {
    return this._findNode(key) !== undefined;
  }

  /**
   * Delete a key. Returns `true` if the key was found and removed.
   * @example
   * // Fast lookup with deletion
   *  const cache = new SkipList<string, number>();
   *
   *     cache.set('alpha', 1);
   *     cache.set('beta', 2);
   *     cache.set('gamma', 3);
   *
   *     console.log(cache.has('beta')); // true;
   *     cache.delete('beta');
   *     console.log(cache.has('beta')); // false;
   *     console.log(cache.size); // 2;
   */
  delete(key: K): boolean {
    const cmp = this.#comparator;
    const update = this._findUpdate(key);
    const target = update[0].forward[0];
    if (!target || cmp(target.key, key) !== 0) return false;
    for (let i = 0; i < this._level; i++) {
      if (update[i].forward[i] !== target) break;
      update[i].forward[i] = target.forward[i];
    }
    while (this._level > 0 && !this._head.forward[this._level - 1]) {
      this._level--;
    }
    this._size--;
    return true;
  }

  // ─── Navigation ──────────────────────────────────────────────

  /**
   * Returns the first (smallest key) entry, or `undefined` if empty.
   * @example
   * // Access the minimum entry
   *  const sl = new SkipList<number, string>([
   *       [5, 'e'],
   *       [1, 'a'],
   *       [3, 'c']
   *     ]);
   *     console.log(sl.first()); // [1, 'a'];
   */
  first(): [K, V | undefined] | undefined {
    const node = this._head.forward[0];
    return node ? [node.key, node.value] : undefined;
  }

  /**
   * Returns the last (largest key) entry, or `undefined` if empty.
   * @example
   * // Access the maximum entry
   *  const sl = new SkipList<number, string>([
   *       [5, 'e'],
   *       [1, 'a'],
   *       [3, 'c']
   *     ]);
   *     console.log(sl.last()); // [5, 'e'];
   */
  last(): [K, V | undefined] | undefined {
    let current = this._head;
    for (let i = this._level - 1; i >= 0; i--) {
      while (current.forward[i]) {
        current = current.forward[i]!;
      }
    }
    return current === this._head ? undefined : [current.key, current.value];
  }

  /**
   * Remove and return the first (smallest key) entry.
   * @example
   * // Remove and return smallest
   *  const sl = new SkipList<number, string>([
   *       [1, 'a'],
   *       [2, 'b'],
   *       [3, 'c']
   *     ]);
   *     console.log(sl.pollFirst()); // [1, 'a'];
   *     console.log(sl.size); // 2;
   */
  pollFirst(): [K, V | undefined] | undefined {
    const entry = this.first();
    if (!entry) return undefined;
    this.delete(entry[0]);
    return entry;
  }

  /**
   * Remove and return the last (largest key) entry.
   * @example
   * // Remove and return largest
   *  const sl = new SkipList<number, string>([
   *       [1, 'a'],
   *       [2, 'b'],
   *       [3, 'c']
   *     ]);
   *     console.log(sl.pollLast()); // [3, 'c'];
   *     console.log(sl.size); // 2;
   */
  pollLast(): [K, V | undefined] | undefined {
    const entry = this.last();
    if (!entry) return undefined;
    this.delete(entry[0]);
    return entry;
  }

  /**
   * Least entry ≥ key, or `undefined`.
   * @example
   * // Least entry ≥ key
   *  const sl = new SkipList<number, string>([
   *       [10, 'a'],
   *       [20, 'b'],
   *       [30, 'c']
   *     ]);
   *     console.log(sl.ceiling(15)); // [20, 'b'];
   *     console.log(sl.ceiling(20)); // [20, 'b'];
   */
  ceiling(key: K): [K, V | undefined] | undefined {
    const cmp = this.#comparator;
    let current = this._head;
    for (let i = this._level - 1; i >= 0; i--) {
      while (current.forward[i] && cmp(current.forward[i]!.key, key) < 0) {
        current = current.forward[i]!;
      }
    }
    const node = current.forward[0];
    return node ? [node.key, node.value] : undefined;
  }

  /**
   * Greatest entry ≤ key, or `undefined`.
   * @example
   * // Greatest entry ≤ key
   *  const sl = new SkipList<number, string>([
   *       [10, 'a'],
   *       [20, 'b'],
   *       [30, 'c']
   *     ]);
   *     console.log(sl.floor(25)); // [20, 'b'];
   *     console.log(sl.floor(5)); // undefined;
   */
  floor(key: K): [K, V | undefined] | undefined {
    const cmp = this.#comparator;
    let current = this._head;
    for (let i = this._level - 1; i >= 0; i--) {
      while (current.forward[i] && cmp(current.forward[i]!.key, key) <= 0) {
        current = current.forward[i]!;
      }
    }
    const result = current === this._head ? undefined : current;
    // Check if we're exactly at or before key
    if (result && cmp(result.key, key) <= 0) return [result.key, result.value];
    return undefined;
  }

  /**
   * Least entry strictly > key, or `undefined`.
   * @example
   * // Strictly greater entry
   *  const sl = new SkipList<number, string>([
   *       [10, 'a'],
   *       [20, 'b'],
   *       [30, 'c']
   *     ]);
   *     console.log(sl.higher(15)); // [20, 'b'];
   *     console.log(sl.higher(30)); // undefined;
   */
  higher(key: K): [K, V | undefined] | undefined {
    const cmp = this.#comparator;
    let current = this._head;
    for (let i = this._level - 1; i >= 0; i--) {
      while (current.forward[i] && cmp(current.forward[i]!.key, key) <= 0) {
        current = current.forward[i]!;
      }
    }
    const node = current.forward[0];
    return node ? [node.key, node.value] : undefined;
  }

  /**
   * Greatest entry strictly < key, or `undefined`.
   * @example
   * // Strictly less entry
   *  const sl = new SkipList<number, string>([
   *       [10, 'a'],
   *       [20, 'b'],
   *       [30, 'c']
   *     ]);
   *     console.log(sl.lower(25)); // [20, 'b'];
   *     console.log(sl.lower(10)); // undefined;
   */
  lower(key: K): [K, V | undefined] | undefined {
    const cmp = this.#comparator;
    let current = this._head;
    let result: SkipListNode<K, V> | undefined;
    for (let i = this._level - 1; i >= 0; i--) {
      while (current.forward[i] && cmp(current.forward[i]!.key, key) < 0) {
        current = current.forward[i]!;
      }
      if (current !== this._head && cmp(current.key, key) < 0) {
        result = current;
      }
    }
    return result ? [result.key, result.value] : undefined;
  }

  /**
   * Returns entries within the given key range.
   * @example
   * // Find entries in a range
   *  const sl = new SkipList<number, string>([
   *       [1, 'a'],
   *       [2, 'b'],
   *       [3, 'c'],
   *       [4, 'd'],
   *       [5, 'e']
   *     ]);
   *     const result = sl.rangeSearch([2, 4]);
   *     console.log(result); // [
   *  //      [2, 'b'],
   *  //      [3, 'c'],
   *  //      [4, 'd']
   *  //    ];
   */
  rangeSearch(range: [K, K], options: SkipListRangeOptions = {}): Array<[K, V | undefined]> {
    const { lowInclusive = true, highInclusive = true } = options;
    const [low, high] = range;
    const cmp = this.#comparator;
    const out: Array<[K, V | undefined]> = [];
    // Start from the first node >= low
    let current = this._head;
    for (let i = this._level - 1; i >= 0; i--) {
      while (current.forward[i] && cmp(current.forward[i]!.key, low) < 0) {
        current = current.forward[i]!;
      }
    }
    current = current.forward[0]!;
    while (current) {
      const cmpHigh = cmp(current.key, high);
      if (cmpHigh > 0) break;
      if (cmpHigh === 0 && !highInclusive) break;
      const cmpLow = cmp(current.key, low);
      if (cmpLow > 0 || (cmpLow === 0 && lowInclusive)) {
        out.push([current.key, current.value]);
      }
      current = current.forward[0]!;
    }
    return out;
  }

  // ─── Functional (overrides) ──────────────────────────────────

  /**
   * Creates a new SkipList with entries transformed by callback.
   * @example
   * // Transform entries
   *  const sl = new SkipList<number, string>([
   *       [1, 'a'],
   *       [2, 'b']
   *     ]);
   *     const mapped = sl.map((v, k) => [k, v?.toUpperCase()] as [number, string]);
   *     console.log([...mapped.values()]); // ['A', 'B'];
   */
  map<MK, MV>(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: SkipListOptions<MK, MV>
  ): SkipList<MK, MV> {
    const out = new SkipList<MK, MV>([], options ?? {});
    let i = 0;
    for (const [k, v] of this) {
      const [nk, nv] = callback(v, k, i++, this);
      out.set(nk, nv);
    }
    return out;
  }

  /**
   * Creates a new SkipList with entries that pass the predicate.
   * @example
   * // Filter entries
   *  const sl = new SkipList<number, string>([
   *       [1, 'a'],
   *       [2, 'b'],
   *       [3, 'c']
   *     ]);
   *     const result = sl.filter((v, k) => k > 1);
   *     console.log(result.size); // 2;
   */
  filter(callbackfn: EntryCallback<K, V | undefined, boolean>, thisArg?: unknown): this {
    const out = new SkipList<K, V, R>([], {
      comparator: this.#isDefaultComparator ? undefined : this.#comparator,
      maxLevel: this._maxLevel,
      probability: this._probability
    });
    let i = 0;
    for (const [k, v] of this) {
      const ok = callbackfn.call(thisArg, v, k, i++, this);
      if (ok) out.set(k, v as V);
    }
    return out as this;
  }

  // ─── Iterator (required by IterableEntryBase) ────────────────
  protected _getIterator(): IterableIterator<[K, V | undefined]> {
    const head = this._head;
    return (function* () {
      let node = head.forward[0];
      while (node) {
        yield [node.key, node.value] as [K, V | undefined];
        node = node.forward[0];
      }
    })();
  }

  // ─── Internal helpers ────────────────────────────────────────

  /**
   * Finds the update array (predecessors at each level) for a given key.
   */
  protected _findUpdate(key: K): SkipListNode<K, V>[] {
    const cmp = this.#comparator;
    const update: SkipListNode<K, V>[] = new Array(this._maxLevel).fill(this._head);
    let current = this._head;
    for (let i = this._level - 1; i >= 0; i--) {
      while (current.forward[i] && cmp(current.forward[i]!.key, key) < 0) {
        current = current.forward[i]!;
      }
      update[i] = current;
    }
    return update;
  }

  /**
   * Finds the node for a given key, or undefined.
   */
  protected _findNode(key: K): SkipListNode<K, V> | undefined {
    const cmp = this.#comparator;
    let current = this._head;
    for (let i = this._level - 1; i >= 0; i--) {
      while (current.forward[i] && cmp(current.forward[i]!.key, key) < 0) {
        current = current.forward[i]!;
      }
    }
    const candidate = current.forward[0];
    if (candidate && cmp(candidate.key, key) === 0) return candidate;
    return undefined;
  }

  protected _randomLevel(): number {
    let level = 1;
    while (Math.random() < this._probability && level < this._maxLevel) {
      level++;
    }
    return level;
  }
}
