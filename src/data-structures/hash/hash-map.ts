/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import { isWeakKey, rangeCheck } from '../../utils';
import { HashMapLinkedNode } from '../../types';

type HashMapOptions<K, V> = {
  elements: Iterable<[K, V]>;
  hashFn: (key: K) => string;
  objHashFn: (key: K) => WeakKey
}

export class HashMap<K = any, V = any> {

  protected _noObjMap: Record<string, HashMapLinkedNode<K, V | undefined>> = {};
  protected _objMap = new WeakMap<WeakKey, HashMapLinkedNode<K, V | undefined>>();
  protected _head: HashMapLinkedNode<K, V | undefined>;
  protected _tail: HashMapLinkedNode<K, V | undefined>;
  protected readonly _sentinel: HashMapLinkedNode<K, V | undefined>;
  protected _hashFn: (key: K) => string;
  protected _objHashFn: (key: K) => WeakKey;

  /**
   * The constructor initializes a HashMapLinkedNode with an optional iterable of key-value pairs.
   * @param options - The `options` parameter is an object that contains the `elements` property. The
   * `elements` property is an iterable that contains key-value pairs represented as arrays `[K, V]`.
   */
  constructor(options: HashMapOptions<K, V> = {
    elements: [],
    hashFn: (key: K) => String(key),
    objHashFn: (key: K) => (<WeakKey>key)
  }) {
    this._sentinel = <HashMapLinkedNode<K, V>>{};
    this._sentinel.prev = this._sentinel.next = this._head = this._tail = this._sentinel;

    const { elements, hashFn, objHashFn } = options;
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

    if (isWeakKey(key)) {
      // const hash = this._objHashFn(key);
      const hash = key;
      node = this._objMap.get(hash);

      if (node) {
        // If the node already exists, update its value
        node.value = value;
      } else {
        // Create new node
        node = { key: <K>hash, value, prev: this._tail, next: this._sentinel };

        // Add new nodes to _objMap and linked list
        this._objMap.set(hash, node);
      }
    } else {
      const hash = this._hashFn(key);
      // Non-object keys are handled in the same way as the original implementation
      node = this._noObjMap[hash];
      if (node) {
        node.value = value;
      } else {
        this._noObjMap[hash] = node = {
          key,
          value,
          prev: this._tail,
          next: this._sentinel
        };
      }
    }

    if (this._size === 0) {
      this._head = node;
      this._sentinel.next = node;
    } else {
      this._tail.next = node;
    }

    this._tail = node;
    this._sentinel.prev = node;
    this._size++;

    return this._size;
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

  /**
   * Time Complexity: O(n), where n is the number of elements in the HashMap.
   * Space Complexity: O(1)
   *
   * The `forEach` function iterates over each element in a HashMap and executes a callback function on
   * each element.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * HashMap. It takes three arguments:
   */
  forEach(callback: (element: [K, V], index: number, hashMap: HashMap<K, V>) => void) {
    let index = 0;
    let node = this._head;
    while (node !== this._sentinel) {
      callback(<[K, V]>[node.key, node.value], index++, this);
      node = node.next;
    }
  }

  filter(predicate: (element: [K, V], map: HashMap<K, V>) => boolean): HashMap<K, V> {
    const filteredMap = new HashMap<K, V>();
    for (const [key, value] of this) {
      if (predicate([key, value], this)) {
        filteredMap.set(key, value);
      }
    }
    return filteredMap;
  }

  map<NV>(callback: (element: [K, V], map: HashMap<K, V>) => NV): HashMap<K, NV> {
    const mappedMap = new HashMap<K, NV>();
    for (const [key, value] of this) {
      const newValue = callback([key, value], this);
      mappedMap.set(key, newValue);
    }
    return mappedMap;
  }

  reduce<A>(callback: (accumulator: A, element: [K, V], map: HashMap<K, V>) => A, initialValue: A): A {
    let accumulator = initialValue;
    for (const element of this) {
      accumulator = callback(accumulator, element, this);
    }
    return accumulator;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the HashMap.
   * Space Complexity: O(1)
   *
   * The above function is an iterator that yields key-value pairs from a linked list.
   */
  * [Symbol.iterator]() {
    let node = this._head;
    while (node !== this._sentinel) {
      yield <[K, V]>[node.key, node.value];
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
