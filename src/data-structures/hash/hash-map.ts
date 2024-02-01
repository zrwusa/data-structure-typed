/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
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
 * 1. Key-Value Pair Storage: HashMap stores key-value pairs. Each key map to a value.
 * 2. Fast Lookup: It's used when you need to quickly find, insert, or delete entries based on a key.
 * 3. Unique Keys: Keys are unique.
 * If you try to insert another entry with the same key, the new one will replace the old entry.
 * 4. Unordered Collection: HashMap does not guarantee the order of entries, and the order may change over time.
 */
export class HashMap<K = any, V = any, R = [K, V]> extends IterableEntryBase<K, V> {
  /**
   * The constructor function initializes a HashMap object with an optional initial collection and
   * options.
   * @param entryOrRawElements - The `entryOrRawElements` parameter is an iterable collection of elements of a type
   * `T`. It is an optional parameter and its default value is an empty array `[]`.
   * @param [options] - The `options` parameter is an optional object that can contain two properties:
   */
  constructor(entryOrRawElements: Iterable<R | [K, V]> = [], options?: HashMapOptions<K, V, R>) {
    super();
    if (options) {
      const { hashFn, toEntryFn } = options;
      if (hashFn) {
        this._hashFn = hashFn;
      }
      if (toEntryFn) {
        this._toEntryFn = toEntryFn;
      }
    }
    if (entryOrRawElements) {
      this.setMany(entryOrRawElements);
    }
  }

  protected _store: { [key: string]: HashMapStoreItem<K, V> } = {};

  /**
   * The function returns the store object, which is a dictionary of HashMapStoreItem objects.
   * @returns The store property is being returned. It is a dictionary-like object with string keys and
   * values of type HashMapStoreItem<K, V>.
   */
  get store(): { [p: string]: HashMapStoreItem<K, V> } {
    return this._store;
  }

  protected _objMap: Map<object, V> = new Map();

  /**
   * The function returns the object map.
   * @returns The `objMap` property is being returned, which is a `Map` object with keys of type
   * `object` and values of type `V`.
   */
  get objMap(): Map<object, V> {
    return this._objMap;
  }

  protected _toEntryFn?: (rawElement: R) => [K, V];

  /**
   * The function returns the value of the _toEntryFn property.
   * @returns The function being returned is `this._toEntryFn`.
   */
  get toEntryFn() {
    return this._toEntryFn;
  }

  protected _size = 0;

  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size(): number {
    return this._size;
  }

  protected _hashFn: (key: K) => string = (key: K) => String(key);

  /**
   * The hasFn function is a function that takes in an item and returns a boolean
   * indicating whether the item is contained within the hash table.
   *
   * @return The hash function
   */
  get hashFn() {
    return this._hashFn;
  }

  /**
   * The function checks if a given element is an array with exactly two elements.
   * @param {any} rawElement - The `rawElement` parameter is of type `any`, which means it can be any
   * data type.
   * @returns a boolean value.
   */
  isEntry(rawElement: any): rawElement is [K, V] {
    return Array.isArray(rawElement) && rawElement.length === 2;
  }

  /**
   * The function checks if the size of an object is equal to zero and returns a boolean value.
   * @returns A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * The clear() function resets the state of an object by clearing its internal store, object map, and
   * size.
   */
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
  set(key: K, value: V): boolean {
    if (this._isObjKey(key)) {
      if (!this.objMap.has(key)) {
        this._size++;
      }
      this.objMap.set(key, value);
    } else {
      const strKey = this._getNoObjKey(key);
      if (this.store[strKey] === undefined) {
        this._size++;
      }
      this._store[strKey] = { key, value };
    }
    return true;
  }

  /**
   * The function `setMany` takes an iterable collection of objects, maps each object to a key-value
   * pair using a mapping function, and sets each key-value pair in the current object.
   * @param entryOrRawElements - The `entryOrRawElements` parameter is an iterable collection of elements of a type
   * `T`.
   * @returns The `setMany` function is returning an array of booleans.
   */
  setMany(entryOrRawElements: Iterable<R | [K, V]>): boolean[] {
    const results: boolean[] = [];
    for (const rawEle of entryOrRawElements) {
      let key: K | undefined, value: V | undefined;
      if (this.isEntry(rawEle)) {
        key = rawEle[0];
        value = rawEle[1];
      } else if (this.toEntryFn) {
        const item = this.toEntryFn(rawEle);
        key = item[0];
        value = item[1];
      }

      if (key !== undefined && value !== undefined) results.push(this.set(key, value));
    }
    return results;
  }

  /**
   * The `get` function retrieves a value from a map based on a given key, either from an object map or
   * a string map.
   * @param {K} key - The `key` parameter is the key used to retrieve a value from the map. It can be
   * of any type, but it should be compatible with the key type used when the map was created.
   * @returns The method `get(key: K)` returns a value of type `V` if the key exists in the `_objMap`
   * or `_store`, otherwise it returns `undefined`.
   */
  override get(key: K): V | undefined {
    if (this._isObjKey(key)) {
      return this.objMap.get(key);
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
  override has(key: K): boolean {
    if (this._isObjKey(key)) {
      return this.objMap.has(key);
    } else {
      const strKey = this._getNoObjKey(key);
      return strKey in this.store;
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
      if (this.objMap.has(key)) {
        this._size--;
      }

      return this.objMap.delete(key);
    } else {
      const strKey = this._getNoObjKey(key);
      if (strKey in this.store) {
        delete this.store[strKey];
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
   * The clone function creates a new HashMap with the same key-value pairs as
   * this one. The clone function is useful for creating a copy of an existing
   * HashMap, and then modifying that copy without affecting the original.
   *
   * @return A new hashmap with the same values as this one
   */
  clone(): HashMap<K, V, R> {
    return new HashMap<K, V, R>(this, { hashFn: this.hashFn, toEntryFn: this.toEntryFn });
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
  map<VM>(callbackfn: EntryCallback<K, V, VM>, thisArg?: any): HashMap<K, VM> {
    const resultMap = new HashMap<K, VM>();
    let index = 0;
    for (const [key, value] of this) {
      resultMap.set(key, callbackfn.call(thisArg, value, key, index++, this));
    }
    return resultMap;
  }

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

  /**
   * The put function sets a value in a data structure using a specified key.
   * @param {K} key - The key parameter is of type K, which represents the type of the key being passed
   * to the function.
   * @param {V} value - The value parameter represents the value that you want to associate with the
   * specified key in the data structure.
   * @returns The method is returning a boolean value.
   */
  put(key: K, value: V): boolean {
    return this.set(key, value);
  }

  /**
   * The function returns an iterator that yields key-value pairs from both an object store and an
   * object map.
   */
  protected* _getIterator(): IterableIterator<[K, V]> {
    for (const node of Object.values(this.store)) {
      yield [node.key, node.value] as [K, V];
    }
    for (const node of this.objMap) {
      yield node as [K, V];
    }
  }

  /**
   * The function checks if a given key is an object or a function.
   * @param {any} key - The parameter "key" can be of any type.
   * @returns a boolean value.
   */
  protected _isObjKey(key: any): key is object | ((...args: any[]) => any) {
    const keyType = typeof key;
    return (keyType === 'object' || keyType === 'function') && key !== null;
  }

  /**
   * The function `_getNoObjKey` takes a key and returns a string representation of the key, handling
   * different types of keys.
   * @param {K} key - The `key` parameter is of type `K`, which represents the type of the key being
   * passed to the `_getNoObjKey` function.
   * @returns a string value.
   */
  protected _getNoObjKey(key: K): string {
    const keyType = typeof key;

    let strKey: string;
    if (keyType !== 'string' && keyType !== 'number' && keyType !== 'symbol') {
      strKey = this.hashFn(key);
    } else {
      if (keyType === 'number') {
        // TODO numeric key should has its own hash
        strKey = <string>key;
      } else {
        strKey = <string>key;
      }
    }
    return strKey;
  }
}

/**
 * 1. Maintaining the Order of Element Insertion: Unlike HashMap, LinkedHashMap maintains the order in which entries are inserted. Therefore, when you traverse it, entries will be returned in the order they were inserted into the map.
 * 2. Based on Hash Table and Linked List: It combines the structures of a hash table and a linked list, using the hash table to ensure fast access, while maintaining the order of entries through the linked list.
 * 3. Time Complexity: Similar to HashMap, LinkedHashMap offers constant-time performance for get and put operations in most cases.
 */
export class LinkedHashMap<K = any, V = any, R = [K, V]> extends IterableEntryBase<K, V> {
  protected readonly _sentinel: HashMapLinkedNode<K, V | undefined>;

  /**
   * The constructor initializes a LinkedHashMap object with an optional raw collection and options.
   * @param entryOrRawElements - The `entryOrRawElements` parameter is an iterable collection of elements. It is
   * used to initialize the HashMapLinked instance with key-value pairs. Each element in the
   * `entryOrRawElements` is converted to a key-value pair using the `toEntryFn` function (if provided) and
   * then added to the HashMap
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   */
  constructor(entryOrRawElements: Iterable<R> = [], options?: LinkedHashMapOptions<K, V, R>) {
    super();
    this._sentinel = <HashMapLinkedNode<K, V>>{};
    this._sentinel.prev = this._sentinel.next = this._head = this._tail = this._sentinel;

    if (options) {
      const { hashFn, objHashFn, toEntryFn } = options;
      if (hashFn) this._hashFn = hashFn;
      if (objHashFn) this._objHashFn = objHashFn;

      if (toEntryFn) {
        this._toEntryFn = toEntryFn;
      }
    }

    if (entryOrRawElements) {
      for (const el of entryOrRawElements) {
        const [key, value] = this.toEntryFn(el);
        this.set(key, value);
      }
    }
  }

  protected _hashFn: (key: K) => string = (key: K) => String(key);

  /**
   * The function returns the hash function used for generating a hash value for a given key.
   * @returns The hash function that takes a key of type K and returns a string.
   */
  get hashFn(): (key: K) => string {
    return this._hashFn;
  }

  protected _objHashFn: (key: K) => object = (key: K) => <object>key;

  /**
   * The function returns the object hash function.
   * @returns The function `objHashFn` is being returned.
   */
  get objHashFn(): (key: K) => object {
    return this._objHashFn;
  }

  protected _noObjMap: Record<string, HashMapLinkedNode<K, V | undefined>> = {};

  /**
   * The function returns a record of HashMapLinkedNode objects with string keys.
   * @returns The method is returning a Record object, which is a TypeScript type that represents an
   * object with string keys and values that are HashMapLinkedNode objects with keys of type K and
   * values of type V or undefined.
   */
  get noObjMap(): Record<string, HashMapLinkedNode<K, V | undefined>> {
    return this._noObjMap;
  }

  protected _objMap = new WeakMap<object, HashMapLinkedNode<K, V | undefined>>();

  /**
   * The function returns the WeakMap object used to map objects to HashMapLinkedNode instances.
   * @returns The `objMap` property is being returned.
   */
  get objMap(): WeakMap<object, HashMapLinkedNode<K, V | undefined>> {
    return this._objMap;
  }

  protected _head: HashMapLinkedNode<K, V | undefined>;

  /**
   * The function returns the head node of a HashMapLinkedNode.
   * @returns The method `getHead()` is returning a `HashMapLinkedNode` object with key type `K` and
   * a value type `V | undefined`.
   */
  get head(): HashMapLinkedNode<K, V | undefined> {
    return this._head;
  }

  protected _tail: HashMapLinkedNode<K, V | undefined>;

  /**
   * The function returns the tail node of a HashMapLinkedNode.
   * @returns The `_tail` property of type `HashMapLinkedNode<K, V | undefined>` is being returned.
   */
  get tail(): HashMapLinkedNode<K, V | undefined> {
    return this._tail;
  }

  protected _toEntryFn: (rawElement: R) => [K, V] = (rawElement: R) => {
    if (this.isEntry(rawElement)) {
      // TODO, For performance optimization, it may be necessary to only inspect the first element traversed.
      return rawElement;
    } else {
      throw new Error(
        "If the provided entryOrRawElements does not adhere to the [key, value] type format, the toEntryFn in the constructor's options parameter needs to specified."
      );
    }
  };

  /**
   * The function returns the value of the _toEntryFn property.
   * @returns The function being returned is `this._toEntryFn`.
   */
  get toEntryFn() {
    return this._toEntryFn;
  }

  protected _size = 0;

  /**
   * The function returns the size of an object.
   * @returns The size of the object.
   */
  get size() {
    return this._size;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

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
    return <[K, V]>[this.head.key, this.head.value];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

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
    return <[K, V]>[this.tail.key, this.tail.value];
  }

  /**
   * The `begin()` function in TypeScript iterates over a linked list and yields key-value pairs.
   */
  * begin() {
    let node = this.head;
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
    let node = this.tail;
    while (node !== this._sentinel) {
      yield [node.key, node.value];
      node = node.prev;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

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
  set(key: K, value?: V): boolean {
    let node;
    const isNewKey = !this.has(key); // Check if the key is new

    if (isWeakKey(key)) {
      const hash = this.objHashFn(key);
      node = this.objMap.get(hash);

      if (!node && isNewKey) {
        // Create a new node
        node = { key: <K>hash, value, prev: this.tail, next: this._sentinel };
        this.objMap.set(hash, node);
      } else if (node) {
        // Update the value of an existing node
        node.value = value;
      }
    } else {
      const hash = this.hashFn(key);
      node = this.noObjMap[hash];

      if (!node && isNewKey) {
        this.noObjMap[hash] = node = { key, value, prev: this.tail, next: this._sentinel };
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
        this.tail.next = node;
        node.prev = this.tail; // Make sure that the prev of the new node points to the current tail node
      }
      this._tail = node;
      this._sentinel.prev = node;
      this._size++;
    }

    return true;
  }

  /**
   * The function `setMany` takes an iterable collection, converts each element into a key-value pair
   * using a provided function, and sets each key-value pair in the current object, returning an array
   * of booleans indicating the success of each set operation.
   * @param entryOrRawElements - The entryOrRawElements parameter is an iterable collection of elements of type
   * R.
   * @returns The `setMany` function returns an array of booleans.
   */
  setMany(entryOrRawElements: Iterable<R>): boolean[] {
    const results: boolean[] = [];
    for (const rawEle of entryOrRawElements) {
      const [key, value] = this.toEntryFn(rawEle);
      results.push(this.set(key, value));
    }
    return results;
  }

  /**
   * The function checks if a given key exists in a map, using different logic depending on whether the
   * key is a weak key or not.
   * @param {K} key - The `key` parameter is the key that is being checked for existence in the map.
   * @returns The method `has` is returning a boolean value.
   */
  override has(key: K): boolean {
    if (isWeakKey(key)) {
      const hash = this.objHashFn(key);
      return this.objMap.has(hash);
    } else {
      const hash = this.hashFn(key);
      return hash in this.noObjMap;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

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
  override get(key: K): V | undefined {
    if (isWeakKey(key)) {
      const hash = this.objHashFn(key);
      const node = this.objMap.get(hash);
      return node ? node.value : undefined;
    } else {
      const hash = this.hashFn(key);
      const node = this.noObjMap[hash];
      return node ? node.value : undefined;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `at` retrieves the key-value pair at a specified index in a linked list.
   * @param {number} index - The index parameter is a number that represents the position of the
   * element we want to retrieve from the data structure.
   * @returns The method `at(index: number)` is returning an array containing the key-value pair at
   * the specified index in the data structure. The key-value pair is represented as a tuple `[K, V]`,
   * where `K` is the key and `V` is the value.
   */
  at(index: number): V | undefined {
    rangeCheck(index, 0, this._size - 1);
    let node = this.head;
    while (index--) {
      node = node.next;
    }
    return node.value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

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
  delete(key: K): boolean {
    let node;

    if (isWeakKey(key)) {
      const hash = this.objHashFn(key);
      // Get nodes from WeakMap
      node = this.objMap.get(hash);

      if (!node) {
        return false; // If the node does not exist, return false
      }

      // Remove nodes from WeakMap
      this.objMap.delete(hash);
    } else {
      const hash = this.hashFn(key);
      // Get nodes from noObjMap
      node = this.noObjMap[hash];

      if (!node) {
        return false; // If the node does not exist, return false
      }

      // Remove nodes from orgMap
      delete this.noObjMap[hash];
    }

    // Remove node from doubly linked list
    this._deleteNode(node);
    return true;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `deleteAt` function deletes a node at a specified index in a linked list.
   * @param {number} index - The index parameter represents the position at which the node should be
   * deleted in the linked list.
   * @returns The size of the list after deleting the element at the specified index.
   */
  deleteAt(index: number): boolean {
    rangeCheck(index, 0, this._size - 1);
    let node = this.head;
    while (index--) {
      node = node.next;
    }
    return this._deleteNode(node);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if a data structure is empty by comparing its size to zero.
   * @returns The method is returning a boolean value indicating whether the size of the object is 0 or
   * not.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * The function checks if a given element is an array with exactly two elements.
   * @param {any} rawElement - The `rawElement` parameter is of type `any`, which means it can be any
   * data type.
   * @returns a boolean value.
   */
  isEntry(rawElement: any): rawElement is [K, V] {
    return Array.isArray(rawElement) && rawElement.length === 2;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `clear` function clears all the entries in a data structure and resets its properties.
   */
  clear(): void {
    this._noObjMap = {};
    this._size = 0;
    this._head = this._tail = this._sentinel.prev = this._sentinel.next = this._sentinel;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone` function creates a new instance of a `LinkedHashMap` with the same key-value pairs as
   * the original.
   * @returns The `clone()` method is returning a new instance of `LinkedHashMap<K, V>` that is a clone
   * of the original `LinkedHashMap` object.
   */
  clone(): LinkedHashMap<K, V> {
    const cloned = new LinkedHashMap<K, V>([], { hashFn: this.hashFn, objHashFn: this.objHashFn });
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
  map<VM>(callback: EntryCallback<K, V, VM>, thisArg?: any): LinkedHashMap<K, VM> {
    const mappedMap = new LinkedHashMap<K, VM>();
    let index = 0;
    for (const [key, value] of this) {
      const newValue = callback.call(thisArg, value, key, index, this);
      mappedMap.set(key, newValue);
      index++;
    }
    return mappedMap;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The put function sets a value in a data structure using a specified key.
   * @param {K} key - The key parameter is of type K, which represents the type of the key being passed
   * to the function.
   * @param {V} value - The value parameter represents the value that you want to associate with the
   * specified key in the data structure.
   * @returns The method is returning a boolean value.
   */
  put(key: K, value: V): boolean {
    return this.set(key, value);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   * where n is the number of entries in the LinkedHashMap.
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   * where n is the number of entries in the LinkedHashMap.
   *
   * The above function is an iterator that yields key-value pairs from a linked list.
   */
  protected* _getIterator() {
    let node = this.head;
    while (node !== this._sentinel) {
      yield [node.key, node.value] as [K, V];
      node = node.next;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

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
  protected _deleteNode(node: HashMapLinkedNode<K, V | undefined>): boolean {
    const { prev, next } = node;
    prev.next = next;
    next.prev = prev;

    if (node === this.head) {
      this._head = next;
    }

    if (node === this.tail) {
      this._tail = prev;
    }

    this._size -= 1;
    return true;
  }
}
