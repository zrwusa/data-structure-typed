import {HashFunction} from '../../types';

/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
export class HashMap<K, V> {
  get hashFn(): HashFunction<K> {
    return this._hashFn;
  }

  set hashFn(value: HashFunction<K>) {
    this._hashFn = value;
  }
  get table(): Array<Array<[K, V]>> {
    return this._table;
  }

  set table(value: Array<Array<[K, V]>>) {
    this._table = value;
  }

  get capacityMultiplier(): number {
    return this._capacityMultiplier;
  }

  set capacityMultiplier(value: number) {
    this._capacityMultiplier = value;
  }

  get loadFactor(): number {
    return this._loadFactor;
  }

  set loadFactor(value: number) {
    this._loadFactor = value;
  }

  get initialCapacity(): number {
    return this._initialCapacity;
  }

  set initialCapacity(value: number) {
    this._initialCapacity = value;
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
  }

  private _initialCapacity: number;
  private _loadFactor: number;
  private _capacityMultiplier: number;
  private _size: number;
  private _table: Array<Array<[K, V]>>;
  private _hashFn: HashFunction<K>;

  /**
   * The constructor initializes the properties of a hash table, including the initial capacity, load factor, capacity
   * multiplier, size, table array, and hash function.
   * @param [initialCapacity=16] - The initial capacity is the initial size of the hash table. It determines the number of
   * buckets or slots available for storing key-value pairs. The default value is 16.
   * @param [loadFactor=0.75] - The load factor is a measure of how full the hash table can be before it is resized. It is
   * a value between 0 and 1, where 1 means the hash table is completely full and 0 means it is completely empty. When the
   * load factor is reached, the hash table will
   * @param [hashFn] - The `hashFn` parameter is an optional parameter that represents the hash function used to calculate
   * the index of a key in the hash table. If a custom hash function is not provided, a default hash function is used. The
   * default hash function converts the key to a string, calculates the sum of the
   */
  constructor(initialCapacity = 16, loadFactor = 0.75, hashFn?: HashFunction<K>) {
    this._initialCapacity = initialCapacity;
    this._loadFactor = loadFactor;
    this._capacityMultiplier = 2;
    this._size = 0;
    this._table = new Array(initialCapacity);
    this._hashFn =
      hashFn ||
      ((key: K) => {
        const strKey = String(key);
        let hash = 0;
        for (let i = 0; i < strKey.length; i++) {
          hash += strKey.charCodeAt(i);
        }
        return hash % this.table.length;
      });
  }

  private _hash(key: K): number {
    return this._hashFn(key);
  }

  /**
   * The `resizeTable` function resizes the table used in a hash map by creating a new table with a specified capacity and
   * rehashing the key-value pairs from the old table into the new table.
   * @param {number} newCapacity - The newCapacity parameter is the desired capacity for the resized table. It represents
   * the number of buckets that the new table should have.
   */
  private resizeTable(newCapacity: number): void {
    const newTable = new Array(newCapacity);
    for (const bucket of this._table) {
      // Note that this is this._table
      if (bucket) {
        for (const [key, value] of bucket) {
          const newIndex = this._hash(key) % newCapacity;
          if (!newTable[newIndex]) {
            newTable[newIndex] = [];
          }
          newTable[newIndex].push([key, value]);
        }
      }
    }
    this._table = newTable; // Again, here is this._table
  }

  set(key: K, value: V): void {
    const loadFactor = this.size / this.table.length;
    if (loadFactor >= this.loadFactor) {
      this.resizeTable(this.table.length * this.capacityMultiplier);
    }

    const index = this._hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }

    // Check if the key already exists in the bucket
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i][0] === key) {
        this.table[index][i][1] = value;
        return;
      }
    }

    this.table[index].push([key, value]);
    this.size++;
  }

  get(key: K): V | undefined {
    const index = this._hash(key);
    if (!this.table[index]) {
      return undefined;
    }

    for (const [k, v] of this.table[index]) {
      if (k === key) {
        return v;
      }
    }

    return undefined;
  }

  remove(key: K): void {
    const index = this._hash(key);
    if (!this.table[index]) {
      return;
    }

    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i][0] === key) {
        this.table[index].splice(i, 1);
        this.size--;

        // Check if the table needs to be resized down
        const loadFactor = this.size / this.table.length;
        if (loadFactor < this.loadFactor / this.capacityMultiplier) {
          this.resizeTable(this.table.length / this.capacityMultiplier);
        }
        return;
      }
    }
  }

  *entries(): IterableIterator<[K, V]> {
    for (const bucket of this.table) {
      if (bucket) {
        for (const [key, value] of bucket) {
          yield [key, value];
        }
      }
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  clear(): void {
    this.size = 0;
    this.table = new Array(this.initialCapacity);
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}
