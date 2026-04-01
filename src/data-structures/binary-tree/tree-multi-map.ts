/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng
 * @license MIT License
 */
import type { Comparator, TreeMultiMapOptions } from '../../types';
import { ERR, raise, Range } from '../../common';
import { RedBlackTree, RedBlackTreeNode } from './red-black-tree';
import { TreeSet } from './tree-set';

/**
 * TreeMultiMap (ordered MultiMap) — key → bucket (Array of values).
 *
 * Semantics (RFC):
 * - Bucketed design: each key appears once; duplicates live in the bucket.
 * - `get(key)` returns a **live** bucket reference.
 * - Default iteration yields bucket entries: `[K, V[]]`.
 * - Navigable operations (`first/last/ceiling/...`) return entry tuples like TreeMap.
 * @example
 * // Morris traversal (O(1) space)
 *  const tmm = new TreeMultiMap<number>([5, 3, 7]);
 *     const result = tmm.morris(n => n.key, 'IN');
 *     console.log(result.length); // > 0;
 */
export class TreeMultiMap<K = any, V = any, R = any> implements Iterable<[K, V[]]> {
  readonly #core: RedBlackTree<K, V[], R>;
  readonly #isDefaultComparator: boolean;

  /**
   * Creates a new TreeMultiMap.
   * @param keysNodesEntriesOrRaws - Initial entries, or raw elements if `toEntryFn` is provided.
   * @param options - Configuration options including optional `toEntryFn` to transform raw elements.
   * @remarks Time O(m log m), Space O(m) where m is the number of initial entries
   * @example
   * // Standard usage with entries
   * const mmap = new TreeMultiMap([['a', ['x', 'y']], ['b', ['z']]]);
   *
   * // Using toEntryFn to transform raw objects
   * const players = [{ score: 100, items: ['sword'] }, { score: 200, items: ['shield', 'bow'] }];
   * const mmap = new TreeMultiMap(players, { toEntryFn: p => [p.score, p.items] });
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<K | [K | null | undefined, V[] | undefined] | null | undefined | R> = [],
    options: TreeMultiMapOptions<K, V[], R> = {}
  ) {
    const comparator = options.comparator ?? TreeSet.createDefaultComparator<K>();
    this.#isDefaultComparator = options.comparator === undefined;
    const toEntryFn = options.toEntryFn;
    this.#core = new RedBlackTree<K, V[], R>([], { ...options, comparator, isMapMode: options.isMapMode, enableOrderStatistic: options.enableOrderStatistic });
    for (const x of keysNodesEntriesOrRaws) {
      if (x === null || x === undefined) continue;
      // If toEntryFn is provided, use it to transform raw element
      if (toEntryFn) {
        const [k, bucket] = toEntryFn(x as R);
        if (k === null || k === undefined) continue;
        if (bucket !== undefined) {
          this.#core.set(k as K, Array.isArray(bucket) ? [...bucket] : [bucket] as V[]);
        } else {
          this.#core.set(k as K, [] as V[]);
        }
        continue;
      }
      if (Array.isArray(x)) {
        const [k, bucket] = x;
        if (k === null || k === undefined) continue;
        if (bucket !== undefined) {
          // seed bucket (copy)
          this.#core.set(k as K, [...bucket] as V[]);
        } else {
          this.#core.set(k as K, [] as V[]);
        }
        continue;
      }
      // key-only
      this.#core.set(x as K, [] as V[]);
    }
  }

  /**
   * Validates the key against the default comparator rules.
   * @remarks Time O(1), Space O(1)
   */
  private _validateKey(key: K): void {
    if (!this.#isDefaultComparator) return;
    // reuse TreeSet strict validation (same policy)
    // NOTE: TreeSet._validateKey is private, so we replicate the checks.
    if (typeof key === 'number') {
      if (Number.isNaN(key)) raise(TypeError, ERR.invalidNaN('TreeMultiMap'));
      return;
    }
    if (typeof key === 'string') return;
    if (key instanceof Date) {
      if (Number.isNaN(key.getTime())) raise(TypeError, ERR.invalidDate('TreeMultiMap'));
      return;
    }
    raise(TypeError, ERR.comparatorRequired('TreeMultiMap'));
  }

  /**
   * Number of distinct keys.
   * @remarks Time O(1), Space O(1)
   */
  get size(): number {
    return this.#core.size;
  }

  /**
   * Whether the map is empty.
   * @remarks Time O(1), Space O(1)


 * @example
 * // Check if empty
 *  console.log(new TreeMultiMap().isEmpty()); // true;
*/
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Removes all entries from the map.
   * @remarks Time O(1), Space O(1)


 * @example
 * // Remove all entries
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.clear();
 *       console.log(mm.isEmpty()); // true;
*/
  clear(): void {
    this.#core.clear();
  }

  /**
   * Bucket length for a key (missing => 0).
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Count values for key
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       console.log(mm.count(1)); // 2;
*/
  count(key: K): number {
    const b = this.get(key);
    return Array.isArray(b) ? b.length : 0;
  }

  /**
   * Total number of values across all buckets (Σ bucket.length).
   * @remarks Time O(n), Space O(1)


 * @example
 * // Total number of values
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       mm.add(2, 'c');
 *       console.log(mm.totalSize); // 3;
*/
  get totalSize(): number {
    let sum = 0;
    for (const [, bucket] of this) sum += bucket.length;
    return sum;
  }

  /**
   * Whether the map contains the given key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Check key existence
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       console.log(mm.has(1)); // true;
 *       console.log(mm.has(2)); // false;
*/
  has(key: K): boolean {
    this._validateKey(key);
    return this.#core.has(key);
  }

  /**
   * Live bucket reference (do not auto-delete key if bucket becomes empty via mutation).
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Get values for key
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       console.log(mm.get(1)); // ['a', 'b'];
*/
  get(key: K): V[] | undefined {
    this._validateKey(key);
    return this.#core.get(key);
  }

  /**
   * Append a single value.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Add key-value pair
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       mm.add(2, 'c');
 *       console.log(mm.get(1)); // ['a', 'b'];
*/
  add(key: K, value: V): boolean {
    this._validateKey(key);
    const bucket = this.#core.get(key);
    if (bucket) {
      bucket.push(value);
      return true;
    }
    return this.#core.set(key, [value]);
  }

  /**
   * Alias for compatibility with existing TreeMultiMap semantics.
   * @remarks Time O(log n), Space O(1) for single value; O(log n + m) for bucket append


 * @example
 * // Set values for key
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.set(1, 'a');
 *       mm.set(1, 'b');
 *       console.log(mm.get(1)); // ['a', 'b'];
*/
  set(entry: [K | null | undefined, V[] | undefined] | K | null | undefined, value?: V): boolean;
  set(key: K, value: V): boolean;
  set(entry: [K | null | undefined, V[] | undefined] | K | null | undefined, value?: V): boolean {
    if (entry === null || entry === undefined) return false;
    if (Array.isArray(entry)) {
      const [k, bucket] = entry;
      if (k === null || k === undefined) return false;
      if (value !== undefined) return this.add(k as K, value);
      if (bucket === undefined) {
        // ensure key exists
        return this.#core.set(k as K, [] as V[]);
      }
      // append bucket
      const existing = this.#core.get(k as K);
      if (existing) {
        existing.push(...bucket);
        return true;
      }
      return this.#core.set(k as K, [...bucket] as V[]);
    }
    // key-only or key+value
    if (value !== undefined) return this.add(entry as K, value);
    return this.#core.set(entry as K, [] as V[]);
  }

  /**
   * Deletes a key and its entire bucket.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Remove key
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(2, 'b');
 *       mm.delete(1);
 *       console.log(mm.has(1)); // false;
*/
  delete(key: K): boolean {
    this._validateKey(key);
    return this.#core.delete(key);
  }

  /**
   * Check if a specific value exists in a key's bucket.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size


 * @example
 * // Check specific key-value
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       console.log(mm.hasEntry(1, 'a')); // true;
 *       console.log(mm.hasEntry(1, 'z')); // false;
*/
  hasEntry(key: K, value: V, eq: (a: V, b: V) => boolean = Object.is): boolean {
    const bucket = this.get(key);
    if (!Array.isArray(bucket)) return false;
    return bucket.some(v => eq(v, value));
  }

  /**
   * Delete a single occurrence of a value from a key's bucket.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size


 * @example
 * // Delete specific value
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       mm.deleteValue(1, 'a');
 *       console.log(mm.get(1)); // ['b'];
*/
  deleteValue(key: K, value: V, eq: (a: V, b: V) => boolean = Object.is): boolean {
    const bucket = this.get(key);
    if (!Array.isArray(bucket)) return false;
    const idx = bucket.findIndex(v => eq(v, value));
    if (idx === -1) return false;
    bucket.splice(idx, 1);
    if (bucket.length === 0) this.delete(key);
    return true;
  }

  /**
   * Delete all occurrences of a value from a key's bucket.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size


 * @example
 * // Delete all matching values
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       const count = mm.deleteValues(1, 'a');
 *       console.log(count); // 2;
*/
  deleteValues(key: K, value: V, eq: (a: V, b: V) => boolean = Object.is): number {
    const bucket = this.get(key);
    if (!Array.isArray(bucket) || bucket.length === 0) return 0;
    let removed = 0;
    for (let i = bucket.length - 1; i >= 0; i--) {
      if (eq(bucket[i] as V, value)) {
        bucket.splice(i, 1);
        removed++;
      }
    }
    if (bucket.length === 0 && removed > 0) this.delete(key);
    return removed;
  }
  // ---- iteration (bucket view) ----

  /**
   * Iterates over all entries as [key, bucket] pairs.
   * @remarks Time O(n), Space O(1)
   */
  *[Symbol.iterator](): Iterator<[K, V[]]> {
    for (const [k, v] of this.#core) {
      // core always stores buckets, but guard anyway
      yield [k, v ?? /* istanbul ignore next */ ([] as V[])];
    }
  }

  /**
   * Iterates over all keys.
   * @remarks Time O(n), Space O(1)


 * @example
 * // Iterate keys
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(3, 'c');
 *       mm.add(1, 'a');
 *       console.log([...mm.keys()]); // [1, 3];
*/
  *keys(): IterableIterator<K> {
    yield* this.#core.keys();
  }

  /**
   * Iterates over all buckets.
   * @remarks Time O(n), Space O(1)


 * @example
 * // Iterate value arrays
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       console.log([...mm.values()]); // [['a', 'b']];
*/
  *values(): IterableIterator<V[]> {
    for (const [, bucket] of this) yield bucket;
  }

  /**
   * Iterate over all `[key, values[]]` entries (Map-compatible).
   * @remarks Time O(n), Space O(1) per step.


 * @example
 * // Iterate over entries
 *  const mm = new TreeMultiMap<number, string>();
 *     mm.set(1, 'a');
 *     mm.set(1, 'b');
 *     mm.set(2, 'c');
 *     console.log([...mm.entries()]); // [
 *  //      [1, ['a', 'b']],
 *  //      [2, ['c']]
 *  //    ];
*/
  *entries(): IterableIterator<[K, V[]]> {
    yield* this;
  }
  // ---- entry-flat views ----

  /**
   * Iterates over all entries for a specific key.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size


 * @example
 * // Get entries for key
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       console.log([...mm.entriesOf(1)]); // [[1, 'a'], [1, 'b']];
*/
  *entriesOf(key: K): IterableIterator<[K, V]> {
    const bucket = this.get(key);
    if (!Array.isArray(bucket)) return;
    for (const v of bucket) yield [key, v];
  }

  /**
   * Iterates over all values for a specific key.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size


 * @example
 * // Get flat values for key
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       console.log([...mm.valuesOf(1)]); // ['a', 'b'];
*/
  *valuesOf(key: K): IterableIterator<V> {
    const bucket = this.get(key);
    if (!Array.isArray(bucket)) return;
    yield* bucket;
  }

  /**
   * Iterates over all [key, value] pairs (flattened from buckets).
   * @remarks Time O(T), Space O(1) where T is totalSize


 * @example
 * // All key-value pairs flattened
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(1, 'b');
 *       mm.add(2, 'c');
 *       console.log([...mm.flatEntries()]); // [[1, 'a'], [1, 'b'], [2, 'c']];
*/
  *flatEntries(): IterableIterator<[K, V]> {
    for (const [k, bucket] of this) {
      for (const v of bucket) yield [k, v];
    }
  }
  // ━━━ Navigable methods (return [K, V[]] | undefined) ━━━

  /**
   * Returns the entry with the smallest key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // First entry
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(3, 'c');
 *       mm.add(1, 'a');
 *       console.log(mm.first()?.[0]); // 1;
*/
  first(): [K, V[]] | undefined {
    const k = this.#core.getLeftMost();
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? /* istanbul ignore next -- defensive: key in core always has bucket */ undefined : [k, b];
  }

  /**
   * Returns the entry with the largest key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Last entry
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(3, 'c');
 *       console.log(mm.last()?.[0]); // 3;
*/
  last(): [K, V[]] | undefined {
    const k = this.#core.getRightMost();
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? /* istanbul ignore next -- defensive: key in core always has bucket */ undefined : [k, b];
  }

  /**
   * Removes and returns the entry with the smallest key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Remove and return first
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(2, 'b');
 *       mm.add(1, 'a');
 *       const first = mm.pollFirst();
 *       console.log(first?.[0]); // 1;
 *       console.log(mm.has(1)); // false;
*/
  pollFirst(): [K, V[]] | undefined {
    const e = this.first();
    if (!e) return undefined;
    this.delete(e[0]);
    return e;
  }

  /**
   * Removes and returns the entry with the largest key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Remove and return last
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(3, 'c');
 *       const last = mm.pollLast();
 *       console.log(last?.[0]); // 3;
*/
  pollLast(): [K, V[]] | undefined {
    const e = this.last();
    if (!e) return undefined;
    this.delete(e[0]);
    return e;
  }

  /**
   * Returns the entry with the smallest key >= given key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Least key ≥ target
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(10, 'a');
 *       mm.add(20, 'b');
 *       mm.add(30, 'c');
 *       console.log(mm.ceiling(15)?.[0]); // 20;
*/
  ceiling(key: K): [K, V[]] | undefined {
    this._validateKey(key);
    const k = this.#core.ceiling(key);
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? /* istanbul ignore next -- defensive: key in core always has bucket */ undefined : [k, b];
  }

  /**
   * Returns the entry with the largest key <= given key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Greatest key ≤ target
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(10, 'a');
 *       mm.add(20, 'b');
 *       mm.add(30, 'c');
 *       console.log(mm.floor(25)?.[0]); // 20;
*/
  floor(key: K): [K, V[]] | undefined {
    this._validateKey(key);
    const k = this.#core.floor(key);
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? /* istanbul ignore next -- defensive: key in core always has bucket */ undefined : [k, b];
  }

  /**
   * Returns the entry with the smallest key > given key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Least key > target
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(10, 'a');
 *       mm.add(20, 'b');
 *       console.log(mm.higher(10)?.[0]); // 20;
*/
  higher(key: K): [K, V[]] | undefined {
    this._validateKey(key);
    const k = this.#core.higher(key);
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? /* istanbul ignore next -- defensive: key in core always has bucket */ undefined : [k, b];
  }

  /**
   * Returns the entry with the largest key < given key.
   * @remarks Time O(log n), Space O(1)


 * @example
 * // Greatest key < target
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(10, 'a');
 *       mm.add(20, 'b');
 *       console.log(mm.lower(20)?.[0]); // 10;
*/
  lower(key: K): [K, V[]] | undefined {
    this._validateKey(key);
    const k = this.#core.lower(key);
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? /* istanbul ignore next -- defensive: key in core always has bucket */ undefined : [k, b];
  }
  // ━━━ Tree utilities ━━━

  /**
   * Prints the internal tree structure (for debugging).
   * @remarks Time O(n), Space O(n)


 * @example
 * // Display tree
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       expect(() => mm.print()).not.toThrow();
*/
  print(): void {
    this.#core.print();
  }

  /**
   * Executes a callback for each entry.
   * @remarks Time O(n), Space O(1)


 * @example
 * // Iterate entries
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(2, 'b');
 *       const keys: number[] = [];
 *       mm.forEach((v, k) => keys.push(k));
 *       console.log(keys); // [1, 2];
*/
  forEach(callback: (value: V[], key: K, map: this) => void): void {
    for (const [k, v] of this) {
      callback(v, k, this);
    }
  }

  /**
   * Creates a new map with entries that pass the predicate.
   * @remarks Time O(n), Space O(n)


 * @example
 * // Filter entries
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       mm.add(2, 'b');
 *       mm.add(3, 'c');
 *       const filtered = mm.filter((v, k) => k > 1);
 *       console.log([...filtered.keys()]); // [2, 3];
*/
  filter(predicate: (value: V[], key: K, map: this) => boolean): TreeMultiMap<K, V, R> {
    const filtered: [K, V[]][] = [];
    for (const [k, v] of this) {
      if (predicate(v, k, this)) filtered.push([k, v]);
    }
    return new TreeMultiMap<K, V, R>(filtered, { comparator: this.comparator });
  }

  /**
   * Creates a new map by transforming each entry.
   * @remarks Time O(n log n), Space O(n)


 * @example
 * // Transform values
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       const mapped = mm.map((v, k) => [k, v.map(s => s.toUpperCase())] as [number, string[]]);
 *       console.log(mapped.get(1)); // ['A'];
*/
  map<V2>(
    mapper: (value: V[], key: K, map: this) => [K, V2[]]
  ): TreeMultiMap<K, V2, R> {
    const mapped: [K, V2[]][] = [];
    for (const [k, v] of this) {
      mapped.push(mapper(v, k, this));
    }
    return new TreeMultiMap<K, V2, R>(mapped, { comparator: this.comparator });
  }

  /**
   * Reduces all entries to a single value.
   * @remarks Time O(n), Space O(1)


 * @example
 * // Aggregate
 *  const mm = new TreeMultiMap<number, number>();
 *       mm.add(1, 10);
 *       mm.add(2, 20);
 *       const sum = mm.reduce((acc, v) => acc + v.reduce((a, b) => a + b, 0), 0);
 *       console.log(sum); // 30;
*/
  reduce<U>(callback: (accumulator: U, value: V[], key: K, map: this) => U, initialValue: U): U {
    let acc = initialValue;
    for (const [k, v] of this) {
      acc = callback(acc, v, k, this);
    }
    return acc;
  }

  /**
   * Sets multiple entries at once.
   * @remarks Time O(m log n), Space O(m) where m is input size


 * @example
 * // Set multiple entries
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.setMany([[1, ['a']], [2, ['b']]]);
 *       console.log(mm.size); // 2;
*/
  setMany(keysNodesEntriesOrRaws: Iterable<K | [K | null | undefined, V[] | undefined]>): boolean[] {
    const results: boolean[] = [];
    for (const x of keysNodesEntriesOrRaws) {
      // Call implementation directly: entry can be K or [K, V[]] or [K, undefined]
      results.push(this.set(x));
    }
    return results;
  }

  /**
   * Searches for entries within a key range.
   * @remarks Time O(log n + k), Space O(k) where k is result size


 * @example
 * // Find keys in range
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(10, 'a');
 *       mm.add(20, 'b');
 *       mm.add(30, 'c');
 *       const result = mm.rangeSearch([15, 25]);
 *       console.log(result.length); // 1;
*/
  rangeSearch<C extends (node: RedBlackTreeNode<K, V[]>) => unknown>(
    range: Range<K> | [K, K],
    callback?: C
  ): ReturnType<C>[] {
    return this.#core.rangeSearch(range, callback as (node: RedBlackTreeNode<K, V[]>) => ReturnType<C>);
  }

  /**
   * Creates a shallow clone of this map.
   * @remarks Time O(n log n), Space O(n)
    * @example
 * // Order-statistic on BST
 *  const tree = new TreeMultiMap<number>([30, 10, 50, 20, 40], { enableOrderStatistic: true });
 *       console.log(tree.getByRank(0)); // 10;
 *       console.log(tree.getByRank(4)); // 50;
 *       console.log(tree.getRank(30)); // 2;
   */
  // ─── Order-Statistic Methods ───────────────────────────
  getByRank(k: number): [K, V[]] | undefined {
    const key = this.#core.getByRank(k);
    if (key === undefined) return undefined;
    return [key, this.#core.get(key) ?? []];
  }

    /**
   * Get the rank of a key in sorted order
   * @example
 * // Get the rank of a key in sorted order
 *  const tree = new TreeMultiMap<number>(
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
 *  const tree = new TreeMultiMap<number>(
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
  rangeByRank(start: number, end: number): Array<[K, V[]]> {
    const keys = this.#core.rangeByRank(start, end);
    return keys
      .filter((k): k is K => k !== undefined)
      .map(k => [k, this.#core.get(k) ?? []] as [K, V[]]);
  }

    /**
   * Deep copy


 * @example
 * // Deep clone
 *  const mm = new TreeMultiMap<number, string>();
 *       mm.add(1, 'a');
 *       const copy = mm.clone();
 *       copy.delete(1);
 *       console.log(mm.has(1)); // true;
*/
  clone(): TreeMultiMap<K, V, R> {
    return new TreeMultiMap<K, V, R>(this, { comparator: this.comparator, isMapMode: this.#core.isMapMode });
  }

  /**
   * Expose comparator for advanced usage/testing (read-only).
   * @remarks Time O(1), Space O(1)
   */
  get comparator(): Comparator<K> {
    return this.#core.comparator;
  }
}
