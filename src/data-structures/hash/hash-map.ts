/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  EntryCallback,
  HashMapLinkedNode,
  HashMapOptions,
  HashMapStoreItem,
  LinkedHashMapOptions
} from '../../types';
import { IterableEntryBase } from '../base';
import { isWeakKey, rangeCheck } from '../../utils';

/**
 * Hash-based map. Supports object keys and custom hashing; offers O(1) average set/get/has.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 * @template R
 * 1. Key-Value Pair Storage: HashMap stores key-value pairs. Each key map to a value.
 * 2. Fast Lookup: It's used when you need to quickly find, insert, or delete entries based on a key.
 * 3. Unique Keys: Keys are unique.
 * If you try to insert another entry with the same key, the new one will replace the old entry.
 * 4. Unordered Collection: HashMap does not guarantee the order of entries, and the order may change over time.
 * @example
 * // should maintain insertion order
 *     const linkedHashMap = new LinkedHashMap<number, string>();
 *     linkedHashMap.set(1, 'A');
 *     linkedHashMap.set(2, 'B');
 *     linkedHashMap.set(3, 'C');
 *
 *     const result = Array.from(linkedHashMap);
 *     console.log(result); // [
 *  //      [1, 'A'],
 *  //      [2, 'B'],
 *  //      [3, 'C']
 *  //    ]
 * @example
 * // fast lookup of values by key
 *     const hashMap = new HashMap<number, string>();
 *     hashMap.set(1, 'A');
 *     hashMap.set(2, 'B');
 *     hashMap.set(3, 'C');
 *
 *     console.log(hashMap.get(1)); // 'A'
 *     console.log(hashMap.get(2)); // 'B'
 *     console.log(hashMap.get(3)); // 'C'
 *     console.log(hashMap.get(99)); // undefined
 * @example
 * // remove duplicates when adding multiple entries
 *     const hashMap = new HashMap<number, string>();
 *     hashMap.set(1, 'A');
 *     hashMap.set(2, 'B');
 *     hashMap.set(1, 'C'); // Update value for key 1
 *
 *     console.log(hashMap.size); // 2
 *     console.log(hashMap.get(1)); // 'C'
 *     console.log(hashMap.get(2)); // 'B'
 * @example
 * // count occurrences of keys
 *     const data = [1, 2, 1, 3, 2, 1];
 *
 *     const countMap = new HashMap<number, number>();
 *     for (const key of data) {
 *       countMap.set(key, (countMap.get(key) || 0) + 1);
 *     }
 *
 *     console.log(countMap.get(1)); // 3
 *     console.log(countMap.get(2)); // 2
 *     console.log(countMap.get(3)); // 1
 */
export class HashMap<K = any, V = any, R = [K, V]> extends IterableEntryBase<K, V> {
  /**
   * Create a HashMap and optionally bulk-insert entries.
   * @remarks Time O(N), Space O(N)
   * @param [entryOrRawElements] - Iterable of entries or raw elements to insert.
   * @param [options] - Options: hash function and optional record-to-entry converter.
   * @returns New HashMap instance.
   */
  constructor(entryOrRawElements: Iterable<R | [K, V]> = [], options?: HashMapOptions<K, V, R>) {
    super();
    if (options) {
      const { hashFn, toEntryFn } = options;
      if (hashFn) this._hashFn = hashFn;
      if (toEntryFn) this._toEntryFn = toEntryFn;
    }
    if (entryOrRawElements) this.setMany(entryOrRawElements);
  }

  protected _store: { [key: string]: HashMapStoreItem<K, V> } = {};

  /**
   * Get the internal store for non-object keys.
   * @remarks Time O(1), Space O(1)
   * @returns Internal record of string→{key,value}.
   */
  get store(): { [p: string]: HashMapStoreItem<K, V> } {
    return this._store;
  }

  protected _objMap: Map<object, V> = new Map();

  /**
   * Get the internal Map used for object/function keys.
   * @remarks Time O(1), Space O(1)
   * @returns Map of object→value.
   */
  get objMap(): Map<object, V> {
    return this._objMap;
  }

  protected _toEntryFn?: (rawElement: R) => [K, V];

  /**
   * Get the raw→entry converter function if present.
   * @remarks Time O(1), Space O(1)
   * @returns Converter function or undefined.
   */
  get toEntryFn() {
    return this._toEntryFn;
  }

  protected _size = 0;

  /**
   * Get the number of distinct keys stored.
   * @remarks Time O(1), Space O(1)
   * @returns Current size.
   */
  get size(): number {
    return this._size;
  }

  protected _hashFn: (key: K) => string = (key: K) => String(key);

  /**
   * Get the current hash function for non-object keys.
   * @remarks Time O(1), Space O(1)
   * @returns Hash function.
   */
  get hashFn() {
    return this._hashFn;
  }

  /**
   * Check whether the map is empty.
   * @remarks Time O(1), Space O(1)
   * @returns True if size is 0.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Remove all entries and reset counters.
   * @remarks Time O(N), Space O(1)
   * @returns void
   */
  clear(): void {
    this._store = {};
    this._objMap.clear();
    this._size = 0;
  }

  /**
   * Type guard: check if a raw value is a [key, value] entry.
   * @remarks Time O(1), Space O(1)
   * @returns True if the value is a 2-tuple.
   */
  isEntry(rawElement: any): rawElement is [K, V] {
    return Array.isArray(rawElement) && rawElement.length === 2;
  }

  /**
   * Insert or replace a single entry.
   * @remarks Time O(1), Space O(1)
   * @param key - Key.
   * @param value - Value.
   * @returns True when the operation succeeds.
   */
  set(key: K, value: V): boolean {
    if (this._isObjKey(key)) {
      if (!this.objMap.has(key)) this._size++;
      this.objMap.set(key, value);
    } else {
      const strKey = this._getNoObjKey(key);
      if (this.store[strKey] === undefined) this._size++;
      this._store[strKey] = { key, value };
    }
    return true;
  }

  /**
   * Insert many entries from an iterable.
   * @remarks Time O(N), Space O(N)
   * @param entryOrRawElements - Iterable of entries or raw elements to insert.
   * @returns Array of per-entry results.
   */
  setMany(entryOrRawElements: Iterable<R | [K, V]>): boolean[] {
    const results: boolean[] = [];
    for (const rawEle of entryOrRawElements) {
      let key: K | undefined, value: V | undefined;
      if (this.isEntry(rawEle)) [key, value] = rawEle;
      else if (this._toEntryFn) [key, value] = this._toEntryFn(rawEle);
      if (key !== undefined && value !== undefined) results.push(this.set(key, value));
    }
    return results;
  }

  /**
   * Get the value for a key.
   * @remarks Time O(1), Space O(1)
   * @param key - Key to look up.
   * @returns Value or undefined.
   */
  override get(key: K): V | undefined {
    if (this._isObjKey(key)) return this.objMap.get(key);
    const strKey = this._getNoObjKey(key);
    return this._store[strKey]?.value;
  }

  /**
   * Check if a key exists.
   * @remarks Time O(1), Space O(1)
   * @param key - Key to test.
   * @returns True if present.
   */
  override has(key: K): boolean {
    if (this._isObjKey(key)) return this.objMap.has(key);
    const strKey = this._getNoObjKey(key);
    return strKey in this.store;
  }

  /**
   * Delete an entry by key.
   * @remarks Time O(1), Space O(1)
   * @param key - Key to delete.
   * @returns True if the key was found and removed.
   */
  delete(key: K): boolean {
    if (this._isObjKey(key)) {
      if (this.objMap.has(key)) this._size--;
      return this.objMap.delete(key);
    }
    const strKey = this._getNoObjKey(key);
    if (strKey in this.store) {
      delete this.store[strKey];
      this._size--;
      return true;
    }
    return false;
  }

  /**
   * Replace the hash function and rehash the non-object store.
   * @remarks Time O(N), Space O(N)
   * @param fn - New hash function for non-object keys.
   * @returns This map instance.
   */
  setHashFn(fn: (key: K) => string): this {
    if (this._hashFn === fn) return this;
    this._hashFn = fn;
    this._rehashNoObj();
    return this;
  }

  /**
   * Deep clone this map, preserving hashing behavior.
   * @remarks Time O(N), Space O(N)
   * @returns A new map with the same content.
   */
  clone(): this {
    const opts = { hashFn: this._hashFn, toEntryFn: this._toEntryFn };
    return this._createLike<[K, V], [K, V], [K, V]>(this, opts);
  }

  /**
   * Map values to a new map with the same keys.
   * @remarks Time O(N), Space O(N)
   * @template VM
   * @param callbackfn - Mapping function (key, value, index, map) → newValue.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new map with transformed values.
   */
  map<VM>(callbackfn: EntryCallback<K, V, VM>, thisArg?: any): any {
    const out = this._createLike<K, VM, [K, VM]>();
    let index = 0;
    for (const [key, value] of this) out.set(key, callbackfn.call(thisArg, key, value, index++, this));
    return out;
  }

  /**
   * Filter entries into a new map.
   * @remarks Time O(N), Space O(N)
   * @param predicate - Predicate (key, value, index, map) → boolean.
   * @param [thisArg] - Value for `this` inside the predicate.
   * @returns A new map containing entries that satisfied the predicate.
   */

  filter(predicate: EntryCallback<K, V, boolean>, thisArg?: any): any {
    const out = this._createLike<K, V, [K, V]>();
    let index = 0;
    for (const [key, value] of this) if (predicate.call(thisArg, key, value, index++, this)) out.set(key, value);
    return out;
  }

  /**
   * (Protected) Create a like-kind instance and seed it from an iterable.
   * @remarks Time O(N), Space O(N)
   * @template TK
   * @template TV
   * @template TR
   * @param [entries] - Iterable used to seed the new map.
   * @param [options] - Options forwarded to the constructor.
   * @returns A like-kind map instance.
   */
  protected _createLike<TK = K, TV = V, TR = [TK, TV]>(entries: Iterable<[TK, TV] | TR> = [], options?: any): any {
    const Ctor = this.constructor as new (e?: Iterable<[TK, TV] | TR>, o?: any) => any;
    return new Ctor(entries, options);
  }

  protected _rehashNoObj(): void {
    const fresh: Record<string, HashMapStoreItem<K, V>> = {};
    for (const { key, value } of Object.values(this._store)) {
      const sk = this._getNoObjKey(key);
      fresh[sk] = { key, value };
    }
    this._store = fresh;
  }

  protected *_getIterator(): IterableIterator<[K, V]> {
    for (const node of Object.values(this.store)) yield [node.key, node.value] as [K, V];
    for (const node of this.objMap) yield node as [K, V];
  }

  protected _isObjKey(key: any): key is object | ((...args: any[]) => any) {
    const keyType = typeof key;
    return (keyType === 'object' || keyType === 'function') && key !== null;
  }

  protected _getNoObjKey(key: K): string {
    const keyType = typeof key;

    let strKey: string;
    if (keyType !== 'string' && keyType !== 'number' && keyType !== 'symbol') {
      strKey = this._hashFn(key);
    } else {
      if (keyType === 'number') {
        strKey = <string>key;
      } else {
        strKey = <string>key;
      }
    }
    return strKey;
  }
}

/**
 * Hash-based map that preserves insertion order via a doubly-linked list.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 * @template R
 * @example examples will be generated by unit test
 */
export class LinkedHashMap<K = any, V = any, R = [K, V]> extends IterableEntryBase<K, V> {
  protected readonly _sentinel: HashMapLinkedNode<K, V | undefined>;

  /**
   * Create a LinkedHashMap and optionally bulk-insert entries.
   * @remarks Time O(N), Space O(N)
   * @param [entryOrRawElements] - Iterable of entries or raw elements to insert.
   * @param [options] - Options: hash functions and optional record-to-entry converter.
   * @returns New LinkedHashMap instance.
   */
  constructor(entryOrRawElements: Iterable<R | [K, V]> = [], options?: LinkedHashMapOptions<K, V, R>) {
    super();
    this._sentinel = <HashMapLinkedNode<K, V>>{};
    this._sentinel.prev = this._sentinel.next = this._head = this._tail = this._sentinel;

    if (options) {
      const { hashFn, objHashFn, toEntryFn } = options;
      if (hashFn) this._hashFn = hashFn;
      if (objHashFn) this._objHashFn = objHashFn;
      if (toEntryFn) this._toEntryFn = toEntryFn;
    }

    if (entryOrRawElements) this.setMany(entryOrRawElements);
  }

  protected _hashFn: (key: K) => string = (key: K) => String(key);
  get hashFn(): (key: K) => string {
    return this._hashFn;
  }

  protected _objHashFn: (key: K) => object = (key: K) => <object>key;

  /**
   * Get the hash function for object/weak keys.
   * @remarks Time O(1), Space O(1)
   * @returns Object-hash function.
   */
  get objHashFn(): (key: K) => object {
    return this._objHashFn;
  }

  protected _noObjMap: Record<string, HashMapLinkedNode<K, V | undefined>> = {};

  /**
   * Get the internal record for non-object keys.
   * @remarks Time O(1), Space O(1)
   * @returns Record of hash→node.
   */
  get noObjMap(): Record<string, HashMapLinkedNode<K, V | undefined>> {
    return this._noObjMap;
  }

  protected _objMap = new WeakMap<object, HashMapLinkedNode<K, V | undefined>>();
  get objMap(): WeakMap<object, HashMapLinkedNode<K, V | undefined>> {
    return this._objMap;
  }

  protected _head: HashMapLinkedNode<K, V | undefined>;

  /**
   * Get the head node (first entry) sentinel link.
   * @remarks Time O(1), Space O(1)
   * @returns Head node or sentinel.
   */
  get head(): HashMapLinkedNode<K, V | undefined> {
    return this._head;
  }

  protected _tail: HashMapLinkedNode<K, V | undefined>;

  /**
   * Get the tail node (last entry) sentinel link.
   * @remarks Time O(1), Space O(1)
   * @returns Tail node or sentinel.
   */
  get tail(): HashMapLinkedNode<K, V | undefined> {
    return this._tail;
  }

  protected _toEntryFn?: (rawElement: R) => [K, V] = (rawElement: R) => {
    if (this.isEntry(rawElement)) {
      return rawElement;
    }
    throw new Error(
      'If `entryOrRawElements` does not adhere to [key,value], provide `options.toEntryFn` to transform raw records.'
    );
  };
  get toEntryFn() {
    return this._toEntryFn;
  }

  protected _size = 0;
  get size() {
    return this._size;
  }

  /**
   * Get the first [key, value] pair.
   * @remarks Time O(1), Space O(1)
   * @returns First entry or undefined when empty.
   */
  get first() {
    if (this._size === 0) return;
    return <[K, V]>[this.head.key, this.head.value];
  }

  /**
   * Get the last [key, value] pair.
   * @remarks Time O(1), Space O(1)
   * @returns Last entry or undefined when empty.
   */
  get last() {
    if (this._size === 0) return;
    return <[K, V]>[this.tail.key, this.tail.value];
  }

  /**
   * Iterate from head → tail.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of [key, value].
   */
  *begin() {
    let node = this.head;
    while (node !== this._sentinel) {
      yield [node.key, node.value];
      node = node.next;
    }
  }

  /**
   * Iterate from tail → head.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of [key, value].
   */
  *reverseBegin() {
    let node = this.tail;
    while (node !== this._sentinel) {
      yield [node.key, node.value];
      node = node.prev;
    }
  }

  /**
   * Insert or replace a single entry; preserves insertion order.
   * @remarks Time O(1), Space O(1)
   * @param key - Key.
   * @param [value] - Value.
   * @returns True when the operation succeeds.
   */
  set(key: K, value?: V): boolean {
    let node: HashMapLinkedNode<K, V | undefined> | undefined;
    const isNewKey = !this.has(key);

    if (isWeakKey(key)) {
      const hash = this._objHashFn(key);
      node = this.objMap.get(hash);
      if (!node && isNewKey) {
        node = { key: <K>hash, value, prev: this.tail, next: this._sentinel };
        this.objMap.set(hash, node);
      } else if (node) {
        node.value = value;
      }
    } else {
      const hash = this._hashFn(key);
      node = this.noObjMap[hash];
      if (!node && isNewKey) {
        this.noObjMap[hash] = node = { key, value, prev: this.tail, next: this._sentinel };
      } else if (node) {
        node.value = value;
      }
    }

    if (node && isNewKey) {
      if (this._size === 0) {
        this._head = node;
        this._sentinel.next = node;
      } else {
        this.tail.next = node;
        node.prev = this.tail;
      }
      this._tail = node;
      this._sentinel.prev = node;
      this._size++;
    }

    return true;
  }

  setMany(entryOrRawElements: Iterable<R | [K, V]>): boolean[] {
    const results: boolean[] = [];
    for (const rawEle of entryOrRawElements) {
      let key: K | undefined, value: V | undefined;
      if (this.isEntry(rawEle)) [key, value] = rawEle;
      else if (this._toEntryFn) [key, value] = this._toEntryFn(rawEle);
      if (key !== undefined && value !== undefined) results.push(this.set(key, value));
    }
    return results;
  }

  override has(key: K): boolean {
    if (isWeakKey(key)) {
      const hash = this._objHashFn(key);
      return this.objMap.has(hash);
    }
    const hash = this._hashFn(key);
    return hash in this.noObjMap;
  }

  override get(key: K): V | undefined {
    if (isWeakKey(key)) {
      const hash = this._objHashFn(key);
      const node = this.objMap.get(hash);
      return node ? node.value : undefined;
    }
    const hash = this._hashFn(key);
    const node = this.noObjMap[hash];
    return node ? node.value : undefined;
  }

  /**
   * Get the value at a given index in insertion order.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @returns Value at the index.
   */
  at(index: number): V | undefined {
    rangeCheck(index, 0, this._size - 1);
    let node = this.head;
    while (index--) node = node.next;
    return node.value;
  }

  delete(key: K): boolean {
    let node: HashMapLinkedNode<K, V | undefined> | undefined;
    if (isWeakKey(key)) {
      const hash = this._objHashFn(key);
      node = this.objMap.get(hash);
      if (!node) return false;
      this.objMap.delete(hash);
    } else {
      const hash = this._hashFn(key);
      node = this.noObjMap[hash];
      if (!node) return false;
      delete this.noObjMap[hash];
    }
    return this._deleteNode(node);
  }

  /**
   * Delete the first entry that matches a predicate.
   * @remarks Time O(N), Space O(1)
   * @param predicate - Function (key, value, index, map) → boolean to decide deletion.
   * @returns True if an entry was removed.
   */
  deleteWhere(predicate: (key: K, value: V | undefined, index: number, map: this) => boolean): boolean {
    let node = this._head;
    let i = 0;
    while (node !== this._sentinel) {
      const cur = node;
      node = node.next;
      if (predicate(cur.key as K, cur.value as V | undefined, i++, this)) {
        if (isWeakKey(cur.key as unknown as object)) {
          this._objMap.delete(cur.key as unknown as object);
        } else {
          const hash = this._hashFn(cur.key as K);
          delete this._noObjMap[hash];
        }
        return this._deleteNode(cur);
      }
    }
    return false;
  }

  /**
   * Delete the entry at a given index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @returns True if removed.
   */
  deleteAt(index: number): boolean {
    rangeCheck(index, 0, this._size - 1);
    let node = this.head;
    while (index--) node = node.next;
    return this._deleteNode(node);
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  isEntry(rawElement: any): rawElement is [K, V] {
    return Array.isArray(rawElement) && rawElement.length === 2;
  }

  clear(): void {
    this._noObjMap = {};
    this._size = 0;
    this._head = this._tail = this._sentinel.prev = this._sentinel.next = this._sentinel;
  }

  clone(): any {
    const opts = { hashFn: this._hashFn, objHashFn: this._objHashFn };
    return this._createLike<[K, V], [K, V], [K, V]>(this, opts);
  }

  filter(predicate: EntryCallback<K, V, boolean>, thisArg?: any): any {
    const out = this._createLike<K, V, [K, V]>();
    let index = 0;
    for (const [key, value] of this) {
      if (predicate.call(thisArg, key, value, index, this)) out.set(key, value);
      index++;
    }
    return out;
  }

  /**
   * Map each entry to a new [key, value] pair and preserve order.
   * @remarks Time O(N), Space O(N)
   * @template MK
   * @template MV
   * @param callback - Mapping function (key, value, index, map) → [newKey, newValue].
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new map of the same class with transformed entries.
   */
  map<MK, MV>(callback: EntryCallback<K, V, [MK, MV]>, thisArg?: any): any {
    const out = this._createLike<MK, MV, [MK, MV]>();
    let index = 0;
    for (const [key, value] of this) {
      const [newKey, newValue] = callback.call(thisArg, key, value, index, this);
      out.set(newKey, newValue);
      index++;
    }
    return out;
  }

  protected *_getIterator(): IterableIterator<[K, V]> {
    let node = this.head;
    while (node !== this._sentinel) {
      yield [node.key, node.value] as [K, V];
      node = node.next;
    }
  }

  protected _deleteNode(node: HashMapLinkedNode<K, V | undefined>): boolean {
    const { prev, next } = node;
    prev.next = next;
    next.prev = prev;

    if (node === this.head) this._head = next;
    if (node === this.tail) this._tail = prev;

    this._size -= 1;
    return true;
  }

  protected _createLike<TK = K, TV = V, TR = [TK, TV]>(entries: Iterable<[TK, TV] | TR> = [], options?: any): any {
    const Ctor = this.constructor as new (e?: Iterable<[TK, TV] | TR>, o?: any) => any;
    return new Ctor(entries, options);
  }
}
