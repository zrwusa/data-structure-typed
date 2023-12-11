/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import { isWeakKey, rangeCheck } from '../../utils';
import type { EntryCallback, HashMapLinkedNode, HashMapOptions, HashMapStoreItem } from '../../types';
import { IterableEntryBase } from "../base";

export class HashMap<K = any, V = any> extends IterableEntryBase<K, V> {
  protected _store: { [key: string]: HashMapStoreItem<K, V> } = {};
  protected _objMap: Map<object, V> = new Map();

  /**
   * The constructor function initializes a new instance of a class with optional elements and options.
   * @param elements - The `elements` parameter is an iterable containing key-value pairs `[K, V]`. It
   * is optional and defaults to an empty array `[]`. This parameter is used to initialize the map with
   * key-value pairs.
   * @param [options] - The `options` parameter is an optional object that can contain additional
   * configuration options for the constructor. In this case, it has one property:
   */
  constructor(elements: Iterable<[K, V]> = [], options?: {
    hashFn: (key: K) => string
  }) {
    super();
    if (options) {
      const { hashFn } = options;
      if (hashFn) {
        this._hashFn = hashFn;

      }
    }
    if (elements) {
      this.setMany(elements);
    }
  }

  protected _size = 0;

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  clear() {
    this._store = {};
    this._objMap.clear();
    this._size = 0;
  }

  /**
   * The `set` function adds a key-value pair to a map-like data structure, incrementing the size if
   * the key is not already present.
   * @param {K} key - The key parameter is the key used to identify the value in the data structure. It
   * can be of any type, but if it is an object, it will be stored in a Map, otherwise it will be
   * stored in a regular JavaScript object.
   * @param {V} value - The value parameter represents the value that you want to associate with the
   * key in the data structure.
   */
  set(key: K, value: V) {

    if (this._isObjKey(key)) {
      if (!this._objMap.has(key)) {
        this._size++;
      }
      this._objMap.set(key, value);

    } else {
      const strKey = this._getNoObjKey(key);
      if (this._store[strKey] === undefined) {
        this._size++;
      }
      this._store[strKey] = { key, value };
    }
  }

  /**
   * The function "setMany" sets multiple key-value pairs in a map.
   * @param elements - The `elements` parameter is an iterable containing key-value pairs. Each
   * key-value pair is represented as an array with two elements: the key and the value.
   */
  setMany(elements: Iterable<[K, V]>) {
    for (const [key, value] of elements) this.set(key, value);
  }

  /**
   * The `get` function retrieves a value from a map based on a given key, either from an object map or
   * a string map.
   * @param {K} key - The `key` parameter is the key used to retrieve a value from the map. It can be
   * of any type, but it should be compatible with the key type used when the map was created.
   * @returns The method `get(key: K)` returns a value of type `V` if the key exists in the `_objMap`
   * or `_store`, otherwise it returns `undefined`.
   */
  get(key: K): V | undefined {
    if (this._isObjKey(key)) {
      return this._objMap.get(key);
    } else {
      const strKey = this._getNoObjKey(key);
      return this._store[strKey]?.value;
    }
  }

  /**
   * The `has` function checks if a given key exists in the `_objMap` or `_store` based on whether it
   * is an object key or not.
   * @param {K} key - The parameter "key" is of type K, which means it can be any type.
   * @returns The `has` method is returning a boolean value.
   */
  has(key: K): boolean {
    if (this._isObjKey(key)) {
      return this._objMap.has(key);
    } else {
      const strKey = this._getNoObjKey(key);
      return strKey in this._store;
    }
  }

  /**
   * The `delete` function removes an element from a map-like data structure based on the provided key.
   * @param {K} key - The `key` parameter is the key of the element that you want to delete from the
   * data structure.
   * @returns The `delete` method returns a boolean value. It returns `true` if the key was
   * successfully deleted from the map, and `false` if the key was not found in the map.
   */
  delete(key: K): boolean {
    if (this._isObjKey(key)) {
      if (this._objMap.has(key)) {
        this._size--
      }

      return this._objMap.delete(key);
    } else {
      const strKey = this._getNoObjKey(key);
      if (strKey in this._store) {
        delete this._store[strKey];
        this._size--;
        return true;
      }
      return false;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function in TypeScript creates a new HashMap by applying a callback function to each
   * key-value pair in the original HashMap.
   * @param callbackfn - The callback function that will be called for each key-value pair in the
   * HashMap. It takes four parameters:
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callbackfn` function. If `thisArg` is provided, it will
   * be passed as the `this` value to the `callbackfn` function. If `thisArg
   * @returns The `map` method is returning a new `HashMap` object with the transformed values based on
   * the provided callback function.
   */
  map<U>(callbackfn: EntryCallback<K, V, U>, thisArg?: any): HashMap<K, U> {
    const resultMap = new HashMap<K, U>();
    let index = 0;
    for (const [key, value] of this) {
      resultMap.set(key, callbackfn.call(thisArg, value, key, index++, this));
    }
    return resultMap;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new HashMap containing key-value pairs from the original HashMap
   * that satisfy a given predicate function.
   * @param predicate - The predicate parameter is a function that takes four arguments: value, key,
   * index, and map. It is used to determine whether an element should be included in the filtered map
   * or not. The function should return a boolean value - true if the element should be included, and
   * false otherwise.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `predicate` function. If `thisArg` is
   * @returns The `filter` method is returning a new `HashMap` object that contains the key-value pairs
   * from the original `HashMap` that pass the provided `predicate` function.
   */
  filter(predicate: EntryCallback<K, V, boolean>, thisArg?: any): HashMap<K, V> {
    const filteredMap = new HashMap<K, V>();
    let index = 0;
    for (const [key, value] of this) {
      if (predicate.call(thisArg, value, key, index++, this)) {
        filteredMap.set(key, value);
      }
    }
    return filteredMap;
  }

  print(): void {
    console.log([...this.entries()]);
  }

  /**
   * The function returns an iterator that yields key-value pairs from both an object store and an
   * object map.
   */
  protected* _getIterator(): IterableIterator<[K, V]> {
    for (const node of Object.values(this._store)) {
      yield [node.key, node.value] as [K, V];
    }
    for (const node of this._objMap) {
      yield node as [K, V];
    }
  }

  protected _hashFn: (key: K) => string = (key: K) => String(key);

  protected _isObjKey(key: any): key is (object | ((...args: any[]) => any)) {
    const keyType = typeof key;
    return (keyType === 'object' || keyType === 'function') && key !== null
  }

  protected _getNoObjKey(key: K): string {
    const keyType = typeof key;

    let strKey: string;
    if (keyType !== "string" && keyType !== "number" && keyType !== "symbol") {
      strKey = this._hashFn(key);
    } else {
      if (keyType === "number") {
        // TODO numeric key should has its own hash
        strKey = <string>key;
      } else {
        strKey = <string>key;
      }
    }
    return strKey;
  }
}

export class LinkedHashMap<K = any, V = any> extends IterableEntryBase<K, V> {

  protected _noObjMap: Record<string, HashMapLinkedNode<K, V | undefined>> = {};
  protected _objMap = new WeakMap<object, HashMapLinkedNode<K, V | undefined>>();
  protected _head: HashMapLinkedNode<K, V | undefined>;
  protected _tail: HashMapLinkedNode<K, V | undefined>;
  protected readonly _sentinel: HashMapLinkedNode<K, V | undefined>;
  protected _hashFn: (key: K) => string;
  protected _objHashFn: (key: K) => object;


  constructor(elements?: Iterable<[K, V]>, options: HashMapOptions<K> = {

    hashFn: (key: K) => String(key),
    objHashFn: (key: K) => (<object>key)
  }) {
    super();
    this._sentinel = <HashMapLinkedNode<K, V>>{};
    this._sentinel.prev = this._sentinel.next = this._head = this._tail = this._sentinel;

    const { hashFn, objHashFn } = options;
    this._hashFn = hashFn;
    this._objHashFn = objHashFn;
    if (elements) {
      for (const el of elements) {
        this.set(el[0], el[1]);
      }
    }

  }

  protected _size = 0;

  get size() {
    return this._size;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function returns the key-value pair at the front of a data structure.
   * @returns The front element of the data structure, represented as a tuple with a key (K) and a
   * value (V).
   */
  get first() {
    if (this._size === 0) return;
    return <[K, V]>[this._head.key, this._head.value];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function returns the key-value pair at the end of a data structure.
   * @returns The method is returning an array containing the key-value pair of the tail element in the
   * data structure.
   */
  get last() {
    if (this._size === 0) return;
    return <[K, V]>[this._tail.key, this._tail.value];
  }

  /**
   * The `begin()` function in TypeScript iterates over a linked list and yields key-value pairs.
   */
  * begin() {
    let node = this._head;
    while (node !== this._sentinel) {
      yield [node.key, node.value];
      node = node.next;
    }
  }

  /**
   * The function `reverseBegin()` iterates over a linked list in reverse order, yielding each node's
   * key and value.
   */
  * reverseBegin() {
    let node = this._tail;
    while (node !== this._sentinel) {
      yield [node.key, node.value];
      node = node.prev;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `set` function adds a new key-value pair to a data structure, either using an object key or a
   * string key.
   * @param {K} key - The `key` parameter is the key to be set in the data structure. It can be of any
   * type, but typically it is a string or symbol.
   * @param {V} [value] - The `value` parameter is an optional parameter of type `V`. It represents the
   * value associated with the key being set in the data structure.
   * @returns the size of the data structure after the key-value pair has been set.
   */
  set(key: K, value?: V) {
    let node;
    const isNewKey = !this.has(key); // Check if the key is new

    if (isWeakKey(key)) {
      const hash = this._objHashFn(key);
      node = this._objMap.get(hash);

      if (!node && isNewKey) {
        // Create new node
        node = { key: <K>hash, value, prev: this._tail, next: this._sentinel };
        this._objMap.set(hash, node);
      } else if (node) {
        // Update the value of an existing node
        node.value = value;
      }
    } else {
      const hash = this._hashFn(key);
      node = this._noObjMap[hash];

      if (!node && isNewKey) {
        this._noObjMap[hash] = node = { key, value, prev: this._tail, next: this._sentinel };
      } else if (node) {
        // Update the value of an existing node
        node.value = value;
      }
    }

    if (node && isNewKey) {
      // Update the head and tail of the linked list
      if (this._size === 0) {
        this._head = node;
        this._sentinel.next = node;
      } else {
        this._tail.next = node;
        node.prev = this._tail; // Make sure that the prev of the new node points to the current tail node
      }
      this._tail = node;
      this._sentinel.prev = node;
      this._size++;
    }

    return this._size;
  }

  has(key: K): boolean {
    if (isWeakKey(key)) {
      const hash = this._objHashFn(key);
      return this._objMap.has(hash);
    } else {
      const hash = this._hashFn(key);
      return hash in this._noObjMap;
    }
  }

  setMany(entries: Iterable<[K, V]>): void {
    for (const entry of entries) {
      const [key, value] = entry;
      this.set(key, value);
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `get` retrieves the value associated with a given key from a map, either by using the
   * key directly or by using an index stored in the key object.
   * @param {K} key - The `key` parameter is the key used to retrieve a value from the map. It can be
   * of any type, but typically it is a string or symbol.
   * @returns The value associated with the given key is being returned. If the key is an object key,
   * the value is retrieved from the `_nodes` array using the index stored in the `OBJ_KEY_INDEX`
   * property of the key. If the key is a string key, the value is retrieved from the `_noObjMap` object
   * using the key itself. If the key is not found, `undefined` is
   */
  get(key: K): V | undefined {
    if (isWeakKey(key)) {
      const hash = this._objHashFn(key);
      const node = this._objMap.get(hash);
      return node ? node.value : undefined;
    } else {
      const hash = this._hashFn(key);
      const node = this._noObjMap[hash];
      return node ? node.value : undefined;
    }
  }

  /**
   * Time Complexity: O(n), where n is the index.
   * Space Complexity: O(1)
   *
   * The function `getAt` retrieves the key-value pair at a specified index in a linked list.
   * @param {number} index - The index parameter is a number that represents the position of the
   * element we want to retrieve from the data structure.
   * @returns The method `getAt(index: number)` is returning an array containing the key-value pair at
   * the specified index in the data structure. The key-value pair is represented as a tuple `[K, V]`,
   * where `K` is the key and `V` is the value.
   */
  getAt(index: number) {
    rangeCheck(index, 0, this._size - 1);
    let node = this._head;
    while (index--) {
      node = node.next;
    }
    return <[K, V]>[node.key, node.value];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `delete` function removes a key-value pair from a map-like data structure.
   * @param {K} key - The `key` parameter is the key that you want to delete from the data structure.
   * It can be of any type, but typically it is a string or an object.
   * @returns a boolean value. It returns `true` if the deletion was successful, and `false` if the key
   * was not found.
   */
  delete(key: K) {
    let node;

    if (isWeakKey(key)) {
      const hash = this._objHashFn(key);
      // Get nodes from WeakMap
      node = this._objMap.get(hash);

      if (!node) {
        return false; // If the node does not exist, return false
      }

      // Remove nodes from WeakMap
      this._objMap.delete(hash);
    } else {
      const hash = this._hashFn(key);
      // Get nodes from noObjMap
      node = this._noObjMap[hash];

      if (!node) {
        return false; // If the node does not exist, return false
      }

      // Remove nodes from orgMap
      delete this._noObjMap[hash];
    }

    // Remove node from doubly linked list
    this._deleteNode(node);
    return true;
  }

  /**
   * Time Complexity: O(n), where n is the index.
   * Space Complexity: O(1)
   *
   * The `deleteAt` function deletes a node at a specified index in a linked list.
   * @param {number} index - The index parameter represents the position at which the node should be
   * deleted in the linked list.
   * @returns The size of the list after deleting the element at the specified index.
   */
  deleteAt(index: number) {
    rangeCheck(index, 0, this._size - 1);
    let node = this._head;
    while (index--) {
      node = node.next;
    }
    this._deleteNode(node);
    return this._size;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if a data structure is empty by comparing its size to zero.
   * @returns The method is returning a boolean value indicating whether the size of the object is 0 or
   * not.
   */
  isEmpty() {
    return this._size === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `clear` function clears all the elements in a data structure and resets its properties.
   */
  clear() {
    this._noObjMap = {};
    this._size = 0;
    this._head = this._tail = this._sentinel.prev = this._sentinel.next = this._sentinel;
  }

  clone(): LinkedHashMap<K, V> {
    const cloned = new LinkedHashMap<K, V>([], { hashFn: this._hashFn, objHashFn: this._objHashFn });
    for (const entry of this) {
      const [key, value] = entry;
      cloned.set(key, value);
    }
    return cloned;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new `LinkedHashMap` containing key-value pairs from the original
   * map that satisfy a given predicate function.
   * @param predicate - The `predicate` parameter is a callback function that takes four arguments:
   * `value`, `key`, `index`, and `this`. It should return a boolean value indicating whether the
   * current element should be included in the filtered map or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the `predicate` function. It is used when you want to bind a
   * specific object as the context for the `predicate` function. If `thisArg` is not provided, `this
   * @returns a new `LinkedHashMap` object that contains the key-value pairs from the original
   * `LinkedHashMap` object that satisfy the given predicate function.
   */
  filter(predicate: EntryCallback<K, V, boolean>, thisArg?: any): LinkedHashMap<K, V> {
    const filteredMap = new LinkedHashMap<K, V>();
    let index = 0;
    for (const [key, value] of this) {
      if (predicate.call(thisArg, value, key, index, this)) {
        filteredMap.set(key, value);
      }
      index++;
    }
    return filteredMap;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function in TypeScript creates a new `LinkedHashMap` by applying a callback function to
   * each key-value pair in the original map.
   * @param callback - The callback parameter is a function that will be called for each key-value pair
   * in the map. It takes four arguments: the value of the current key-value pair, the key of the
   * current key-value pair, the index of the current key-value pair, and the map itself. The callback
   * function should
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. If provided, the callback function will
   * be called with `thisArg` as its `this` value. If not provided, `this` will refer to the current
   * map
   * @returns a new `LinkedHashMap` object with the values mapped according to the provided callback
   * function.
   */
  map<NV>(callback: EntryCallback<K, V, NV>, thisArg?: any): LinkedHashMap<K, NV> {
    const mappedMap = new LinkedHashMap<K, NV>();
    let index = 0;
    for (const [key, value] of this) {
      const newValue = callback.call(thisArg, value, key, index, this);
      mappedMap.set(key, newValue);
      index++;
    }
    return mappedMap;
  }

  print() {
    console.log([...this]);
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the LinkedHashMap.
   * Space Complexity: O(1)
   *
   * The above function is an iterator that yields key-value pairs from a linked list.
   */
  protected* _getIterator() {
    let node = this._head;
    while (node !== this._sentinel) {
      yield [node.key, node.value] as [K, V];
      node = node.next;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_deleteNode` function removes a node from a doubly linked list and updates the head and tail
   * pointers if necessary.
   * @param node - The `node` parameter is an instance of the `HashMapLinkedNode` class, which
   * represents a node in a linked list. It contains a key-value pair and references to the previous
   * and next nodes in the list.
   */
  protected _deleteNode(node: HashMapLinkedNode<K, V | undefined>) {
    const { prev, next } = node;
    prev.next = next;
    next.prev = prev;

    if (node === this._head) {
      this._head = next;
    }

    if (node === this._tail) {
      this._tail = prev;
    }

    this._size -= 1;
  }
}
