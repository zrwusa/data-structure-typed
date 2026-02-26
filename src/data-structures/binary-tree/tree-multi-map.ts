/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng
 * @license MIT License
 */

import type { Comparator, TreeMultiMapOptions } from '../../types';
import { RedBlackTree, RedBlackTreeNode } from './red-black-tree';
import { TreeSet } from './tree-set';

/**
 * Node type used by TreeMultiMap (alias to RedBlackTreeNode for backward compatibility).
 *
 * @deprecated Direct node manipulation is discouraged. Use TreeMultiMap methods instead.
 */
export class TreeMultiMapNode<K = any, V = any> extends RedBlackTreeNode<K, V[]> {
  constructor(key: K, value: V[] = []) {
    super(key, value);
  }
}

/**
 * TreeMultiMap (ordered MultiMap) — key → bucket (Array of values).
 *
 * Semantics (RFC):
 * - Bucketed design: each key appears once; duplicates live in the bucket.
 * - `get(key)` returns a **live** bucket reference.
 * - Default iteration yields bucket entries: `[K, V[]]`.
 * - Navigable operations (`first/last/ceiling/...`) return entry tuples like TreeMap.
 * @example
 * // players ranked by score with their equipment
 *  type Equipment = {
 *       name: string; // Equipment name
 *       quality: 'legendary' | 'epic' | 'rare' | 'common';
 *       level: number;
 *     };
 *
 *     type Player = {
 *       name: string;
 *       score: number;
 *       equipments: Equipment[];
 *     };
 *
 *     // Mock player data with their scores and equipment
 *     const players: Player[] = [
 *       {
 *         name: 'DragonSlayer',
 *         score: 8750,
 *         equipments: [
 *           { name: 'AWM', quality: 'legendary', level: 85 },
 *           { name: 'Level 3 Helmet', quality: 'epic', level: 80 },
 *           { name: 'Extended Quickdraw Mag', quality: 'rare', level: 75 },
 *           { name: 'Compensator', quality: 'epic', level: 78 },
 *           { name: 'Vertical Grip', quality: 'rare', level: 72 }
 *         ]
 *       },
 *       {
 *         name: 'ShadowNinja',
 *         score: 7200,
 *         equipments: [
 *           { name: 'M416', quality: 'epic', level: 75 },
 *           { name: 'Ghillie Suit', quality: 'rare', level: 70 },
 *           { name: 'Red Dot Sight', quality: 'common', level: 65 },
 *           { name: 'Extended QuickDraw Mag', quality: 'rare', level: 68 }
 *         ]
 *       },
 *       {
 *         name: 'RuneMaster',
 *         score: 9100,
 *         equipments: [
 *           { name: 'KAR98K', quality: 'legendary', level: 90 },
 *           { name: 'Level 3 Vest', quality: 'legendary', level: 85 },
 *           { name: 'Holographic Sight', quality: 'epic', level: 82 },
 *           { name: 'Suppressor', quality: 'legendary', level: 88 },
 *           { name: 'Level 3 Backpack', quality: 'epic', level: 80 }
 *         ]
 *       },
 *       {
 *         name: 'BattleKing',
 *         score: 8500,
 *         equipments: [
 *           { name: 'AUG', quality: 'epic', level: 82 },
 *           { name: 'Red Dot Sight', quality: 'rare', level: 75 },
 *           { name: 'Extended Mag', quality: 'common', level: 70 },
 *           { name: 'Tactical Stock', quality: 'rare', level: 76 }
 *         ]
 *       },
 *       {
 *         name: 'SniperElite',
 *         score: 7800,
 *         equipments: [
 *           { name: 'M24', quality: 'legendary', level: 88 },
 *           { name: 'Compensator', quality: 'epic', level: 80 },
 *           { name: 'Scope 8x', quality: 'legendary', level: 85 },
 *           { name: 'Level 2 Helmet', quality: 'rare', level: 75 }
 *         ]
 *       },
 *       {
 *         name: 'RushMaster',
 *         score: 7500,
 *         equipments: [
 *           { name: 'Vector', quality: 'rare', level: 72 },
 *           { name: 'Level 2 Helmet', quality: 'common', level: 65 },
 *           { name: 'Quickdraw Mag', quality: 'common', level: 60 },
 *           { name: 'Laser Sight', quality: 'rare', level: 68 }
 *         ]
 *       },
 *       {
 *         name: 'GhostWarrior',
 *         score: 8200,
 *         equipments: [
 *           { name: 'SCAR-L', quality: 'epic', level: 78 },
 *           { name: 'Extended Quickdraw Mag', quality: 'rare', level: 70 },
 *           { name: 'Holographic Sight', quality: 'epic', level: 75 },
 *           { name: 'Suppressor', quality: 'rare', level: 72 },
 *           { name: 'Vertical Grip', quality: 'common', level: 65 }
 *         ]
 *       },
 *       {
 *         name: 'DeathDealer',
 *         score: 7300,
 *         equipments: [
 *           { name: 'SKS', quality: 'epic', level: 76 },
 *           { name: 'Holographic Sight', quality: 'rare', level: 68 },
 *           { name: 'Extended Mag', quality: 'common', level: 65 }
 *         ]
 *       },
 *       {
 *         name: 'StormRider',
 *         score: 8900,
 *         equipments: [
 *           { name: 'MK14', quality: 'legendary', level: 92 },
 *           { name: 'Level 3 Backpack', quality: 'legendary', level: 85 },
 *           { name: 'Scope 8x', quality: 'epic', level: 80 },
 *           { name: 'Suppressor', quality: 'legendary', level: 88 },
 *           { name: 'Tactical Stock', quality: 'rare', level: 75 }
 *         ]
 *       },
 *       {
 *         name: 'CombatLegend',
 *         score: 7600,
 *         equipments: [
 *           { name: 'UMP45', quality: 'rare', level: 74 },
 *           { name: 'Level 2 Vest', quality: 'common', level: 67 },
 *           { name: 'Red Dot Sight', quality: 'common', level: 62 },
 *           { name: 'Extended Mag', quality: 'rare', level: 70 }
 *         ]
 *       }
 *     ];
 *
 *     // Create a TreeMultiMap for player rankings
 *     const playerRankings = new TreeMultiMap<number, Equipment, Player>(players, {
 *       toEntryFn: ({ score, equipments }) => [score, equipments],
 *       isMapMode: false
 *     });
 *
 *     const topPlayersEquipments = playerRankings.rangeSearch([8900, 10000], node => playerRankings.get(node.key));
 *     console.log(topPlayersEquipments); // [
 *  //      [
 *  //        {
 *  //          name: 'MK14',
 *  //          quality: 'legendary',
 *  //          level: 92
 *  //        },
 *  //        { name: 'Level 3 Backpack', quality: 'legendary', level: 85 },
 *  //        {
 *  //          name: 'Scope 8x',
 *  //          quality: 'epic',
 *  //          level: 80
 *  //        },
 *  //        { name: 'Suppressor', quality: 'legendary', level: 88 },
 *  //        {
 *  //          name: 'Tactical Stock',
 *  //          quality: 'rare',
 *  //          level: 75
 *  //        }
 *  //      ],
 *  //      [
 *  //        { name: 'KAR98K', quality: 'legendary', level: 90 },
 *  //        {
 *  //          name: 'Level 3 Vest',
 *  //          quality: 'legendary',
 *  //          level: 85
 *  //        },
 *  //        { name: 'Holographic Sight', quality: 'epic', level: 82 },
 *  //        {
 *  //          name: 'Suppressor',
 *  //          quality: 'legendary',
 *  //          level: 88
 *  //        },
 *  //        { name: 'Level 3 Backpack', quality: 'epic', level: 80 }
 *  //      ]
 *  //    ];
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
    options: TreeMultiMapOptions<K, V[], R> = {} as any
  ) {
    const comparator = (options as any).comparator ?? TreeSet.createDefaultComparator<K>();
    this.#isDefaultComparator = (options as any).comparator === undefined;
    const toEntryFn = (options as any).toEntryFn;
    this.#core = new RedBlackTree<K, V[], R>([], { ...(options as any), comparator, isMapMode: (options as any).isMapMode });

    for (const x of keysNodesEntriesOrRaws as any) {
      if (x === null || x === undefined) continue;

      // If toEntryFn is provided, use it to transform raw element
      if (toEntryFn) {
        const [k, bucket] = toEntryFn(x);
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
      if (Number.isNaN(key)) throw new TypeError('TreeMultiMap: NaN is not a valid key');
      return;
    }
    if (typeof key === 'string') return;
    if (key instanceof Date) {
      if (Number.isNaN(key.getTime())) throw new TypeError('TreeMultiMap: invalid Date key');
      return;
    }
    throw new TypeError('TreeMultiMap: comparator is required for non-number/non-string/non-Date keys');
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
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Removes all entries from the map.
   * @remarks Time O(1), Space O(1)
   */
  clear(): void {
    this.#core.clear();
  }

  /**
   * Bucket length for a key (missing => 0).
   * @remarks Time O(log n), Space O(1)
   */
  count(key: K): number {
    const b = this.get(key);
    return Array.isArray(b) ? b.length : 0;
  }

  /**
   * Total number of values across all buckets (Σ bucket.length).
   * @remarks Time O(n), Space O(1)
   */
  get totalSize(): number {
    let sum = 0;
    for (const [, bucket] of this) sum += bucket.length;
    return sum;
  }

  /**
   * Whether the map contains the given key.
   * @remarks Time O(log n), Space O(1)
   */
  has(key: K): boolean {
    this._validateKey(key);
    return this.#core.has(key);
  }

  /**
   * Live bucket reference (do not auto-delete key if bucket becomes empty via mutation).
   * @remarks Time O(log n), Space O(1)
   */
  get(key: K): V[] | undefined {
    this._validateKey(key);
    return this.#core.get(key);
  }

  /**
   * Append a single value.
   * @remarks Time O(log n), Space O(1)
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
   */
  delete(key: K): boolean {
    this._validateKey(key);
    return this.#core.delete(key).length > 0;
  }

  /**
   * Check if a specific value exists in a key's bucket.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size
   */
  hasEntry(key: K, value: V, eq: (a: V, b: V) => boolean = Object.is): boolean {
    const bucket = this.get(key);
    if (!Array.isArray(bucket)) return false;
    return bucket.some(v => eq(v, value));
  }

  /**
   * Delete a single occurrence of a value from a key's bucket.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size
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
      yield [k, v ?? ([] as V[])];
    }
  }

  /**
   * Iterates over all keys.
   * @remarks Time O(n), Space O(1)
   */
  *keys(): IterableIterator<K> {
    yield* this.#core.keys();
  }

  /**
   * Iterates over all buckets.
   * @remarks Time O(n), Space O(1)
   */
  *values(): IterableIterator<V[]> {
    for (const [, bucket] of this) yield bucket;
  }

  // ---- entry-flat views ----

  /**
   * Iterates over all entries for a specific key.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size
   */
  *entriesOf(key: K): IterableIterator<[K, V]> {
    const bucket = this.get(key);
    if (!Array.isArray(bucket)) return;
    for (const v of bucket) yield [key, v];
  }

  /**
   * Iterates over all values for a specific key.
   * @remarks Time O(log n + m), Space O(1) where m is bucket size
   */
  *valuesOf(key: K): IterableIterator<V> {
    const bucket = this.get(key);
    if (!Array.isArray(bucket)) return;
    yield* bucket;
  }

  /**
   * Iterates over all [key, value] pairs (flattened from buckets).
   * @remarks Time O(T), Space O(1) where T is totalSize
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
   * const map = new TreeMultiMap([[1, ['a']], [2, ['b']]]);
   * map.first();  // [1, ['a']]
   */
  first(): [K, V[]] | undefined {
    const k = this.#core.getLeftMost();
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? undefined : [k, b];
  }

  /**
   * Returns the entry with the largest key.
   * @remarks Time O(log n), Space O(1)
   * @example
   * const map = new TreeMultiMap([[1, ['a']], [2, ['b']]]);
   * map.last();  // [2, ['b']]
   */
  last(): [K, V[]] | undefined {
    const k = this.#core.getRightMost();
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? undefined : [k, b];
  }

  /**
   * Removes and returns the entry with the smallest key.
   * @remarks Time O(log n), Space O(1)
   * @example
   * const map = new TreeMultiMap([[1, ['a']], [2, ['b']]]);
   * map.pollFirst();  // [1, ['a']]
   * map.has(1);       // false
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
   * const map = new TreeMultiMap([[1, ['a']], [2, ['b']]]);
   * map.pollLast();  // [2, ['b']]
   * map.has(2);      // false
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
   * const map = new TreeMultiMap([[10, ['a']], [20, ['b']], [30, ['c']]]);
   * map.ceiling(15);  // [20, ['b']]
   * map.ceiling(20);  // [20, ['b']]
   */
  ceiling(key: K): [K, V[]] | undefined {
    this._validateKey(key);
    const k = this.#core.ceiling(key);
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? undefined : [k, b];
  }

  /**
   * Returns the entry with the largest key <= given key.
   * @remarks Time O(log n), Space O(1)
   * @example
   * const map = new TreeMultiMap([[10, ['a']], [20, ['b']], [30, ['c']]]);
   * map.floor(25);  // [20, ['b']]
   * map.floor(20);  // [20, ['b']]
   */
  floor(key: K): [K, V[]] | undefined {
    this._validateKey(key);
    const k = this.#core.floor(key);
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? undefined : [k, b];
  }

  /**
   * Returns the entry with the smallest key > given key.
   * @remarks Time O(log n), Space O(1)
   * @example
   * const map = new TreeMultiMap([[10, ['a']], [20, ['b']], [30, ['c']]]);
   * map.higher(10);  // [20, ['b']]
   * map.higher(15);  // [20, ['b']]
   */
  higher(key: K): [K, V[]] | undefined {
    this._validateKey(key);
    const k = this.#core.higher(key);
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? undefined : [k, b];
  }

  /**
   * Returns the entry with the largest key < given key.
   * @remarks Time O(log n), Space O(1)
   * @example
   * const map = new TreeMultiMap([[10, ['a']], [20, ['b']], [30, ['c']]]);
   * map.lower(20);  // [10, ['a']]
   * map.lower(15);  // [10, ['a']]
   */
  lower(key: K): [K, V[]] | undefined {
    this._validateKey(key);
    const k = this.#core.lower(key);
    if (k === undefined) return undefined;
    const b = this.get(k);
    return b === undefined ? undefined : [k, b];
  }

  // ━━━ Tree utilities ━━━

  /**
   * Prints the internal tree structure (for debugging).
   * @remarks Time O(n), Space O(n)
   */
  print(...args: any[]): void {
    return (this.#core as any).print(...args);
  }

  /**
   * Executes a callback for each entry.
   * @remarks Time O(n), Space O(1)
   */
  forEach(callback: (value: V[], key: K, map: this) => void): void {
    for (const [k, v] of this) {
      callback(v, k, this);
    }
  }

  /**
   * Creates a new map with entries that pass the predicate.
   * @remarks Time O(n), Space O(n)
   */
  filter(predicate: (value: V[], key: K, map: this) => boolean): TreeMultiMap<K, V, R> {
    const filtered: [K, V[]][] = [];
    for (const [k, v] of this) {
      if (predicate(v, k, this)) filtered.push([k, v]);
    }
    return new TreeMultiMap<K, V, R>(filtered, { comparator: this.comparator as any });
  }

  /**
   * Creates a new map by transforming each entry.
   * @remarks Time O(n log n), Space O(n)
   */
  map<V2>(
    mapper: (value: V[], key: K, map: this) => [K, V2[]]
  ): TreeMultiMap<K, V2, R> {
    const mapped: [K, V2[]][] = [];
    for (const [k, v] of this) {
      mapped.push(mapper(v, k, this));
    }
    return new TreeMultiMap<K, V2, R>(mapped, { comparator: this.comparator as any });
  }

  /**
   * Reduces all entries to a single value.
   * @remarks Time O(n), Space O(1)
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
   */
  setMany(keysNodesEntriesOrRaws: Iterable<any>): boolean[] {
    const results: boolean[] = [];
    for (const x of keysNodesEntriesOrRaws) {
      // Call implementation directly: entry can be K or [K, V[]] or [K, undefined]
      results.push(this.set(x as any, undefined as any));
    }
    return results;
  }

  /**
   * Searches for entries within a key range.
   * @remarks Time O(log n + k), Space O(k) where k is result size
   */
  rangeSearch<C extends (node: RedBlackTreeNode<K, V[]>) => any>(
    range: any,
    callback?: C,
    isBalanced?: any
  ): ReturnType<C>[] {
    return this.#core.rangeSearch(range, callback as any, isBalanced);
  }

  /**
   * Creates a shallow clone of this map.
   * @remarks Time O(n log n), Space O(n)
   */
  clone(): TreeMultiMap<K, V, R> {
    return new TreeMultiMap<K, V, R>(this, { comparator: this.comparator as any, isMapMode: (this.#core as any)._isMapMode });
  }

  /**
   * Expose comparator for advanced usage/testing (read-only).
   * @remarks Time O(1), Space O(1)
   */
  get comparator(): Comparator<K> {
    return (this.#core as any)._comparator;
  }
}
