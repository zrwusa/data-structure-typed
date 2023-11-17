/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import { isObjOrFunc, rangeCheck, throwRangeError } from '../../utils';
import { HashMapLinkedNode, IterableWithSizeOrLength, IterateDirection } from '../../types';

/**
 * Because the implementation of HashMap relies on JavaScript's built-in objects and arrays,
 * these underlying structures have already dealt with dynamic expansion and hash collisions.
 * Therefore, there is no need for additional logic to handle these issues.
 */
export class HashMapIterator<K, V> {
  readonly hashMap: HashMap<K, V>;
  readonly iterateDirection: IterateDirection;
  protected _node: HashMapLinkedNode<K, V>;
  protected readonly _sentinel: HashMapLinkedNode<K, V>;

  /**
   * This is a constructor function for a linked list iterator in a HashMap data structure.
   * @param node - The `node` parameter is a reference to a `HashMapLinkedNode` object. This object
   * represents a node in a linked list used in a hash map data structure. It contains a key-value pair
   * and references to the previous and next nodes in the linked list.
   * @param sentinel - The `sentinel` parameter is a reference to a special node in a linked list. It
   * is used to mark the beginning or end of the list and is typically used in data structures like
   * hash maps or linked lists to simplify operations and boundary checks.
   * @param hashMap - A HashMap object that stores key-value pairs.
   * @param {IterateDirection} iterateDirection - The `iterateDirection` parameter is an optional
   * parameter that specifies the direction in which the iterator should iterate over the elements of
   * the HashMap. It can take one of the following values:
   * @returns The constructor does not return anything. It is used to initialize the properties and
   * methods of the object being created.
   */
  constructor(
    node: HashMapLinkedNode<K, V>,
    sentinel: HashMapLinkedNode<K, V>,
    hashMap: HashMap<K, V>,
    iterateDirection: IterateDirection = IterateDirection.DEFAULT
  ) {
    this._node = node;
    this._sentinel = sentinel;
    this.iterateDirection = iterateDirection;

    if (this.iterateDirection === IterateDirection.DEFAULT) {
      this.prev = function () {
        if (this._node.prev === this._sentinel) {
          throwRangeError();
        }
        this._node = this._node.prev;
        return this;
      };
      this.next = function () {
        if (this._node === this._sentinel) {
          throwRangeError();
        }
        this._node = this._node.next;
        return this;
      };
    } else {
      this.prev = function () {
        if (this._node.next === this._sentinel) {
          throwRangeError();
        }
        this._node = this._node.next;
        return this;
      };
      this.next = function () {
        if (this._node === this._sentinel) {
          throwRangeError();
        }
        this._node = this._node.prev;
        return this;
      };
    }
    this.hashMap = hashMap;
  }

  /**
   * The above function returns a Proxy object that allows access to the key and value of a node in a
   * data structure.
   * @returns The code is returning a Proxy object.
   */
  get current() {
    if (this._node === this._sentinel) {
      throwRangeError();
    }

    return new Proxy(<[K, V]>(<unknown>[]), {
      get: (target, prop: '0' | '1') => {
        if (prop === '0') return this._node.key;
        else if (prop === '1') return this._node.value;
        target[0] = this._node.key;
        target[1] = this._node.value;
        return target[prop];
      },
      set: (_, prop: '1', newValue: V) => {
        if (prop !== '1') {
          throw new TypeError(`prop should be string '1'`);
        }
        this._node.value = newValue;
        return true;
      }
    });
  }

  /**
   * The function checks if a node is accessible.
   * @returns a boolean value indicating whether the `_node` is not equal to the `_sentinel`.
   */
  isAccessible() {
    return this._node !== this._sentinel;
  }

  prev() {
    return this;
  }

  next() {
    return this;
  }

  clone() {
    return new HashMapIterator(this._node, this._sentinel, this.hashMap, this.iterateDirection)
  }
}

export class HashMap<K = any, V = any> {
  readonly OBJ_KEY_INDEX = Symbol('OBJ_KEY_INDEX');
  protected _nodes: HashMapLinkedNode<K, V>[] = [];
  protected _orgMap: Record<string, HashMapLinkedNode<K, V>> = {};
  protected _head: HashMapLinkedNode<K, V>;
  protected _tail: HashMapLinkedNode<K, V>;
  protected readonly _sentinel: HashMapLinkedNode<K, V>;

  /**
   * The constructor initializes a HashMap object with an optional initial set of key-value pairs.
   * @param {Iterable<[K, V]>} elements - The `hashMap` parameter is an optional parameter of type `HashMapOptions<[K,
   * V]>`. It is an array of key-value pairs, where each pair is represented as an array `[K, V]`. The
   * `K` represents the type of the key and `V` represents the
   */
  constructor(elements: IterableWithSizeOrLength<[K, V]> = []) {
    Object.setPrototypeOf(this._orgMap, null);
    this._sentinel = <HashMapLinkedNode<K, V>>{};
    this._sentinel.prev = this._sentinel.next = this._head = this._tail = this._sentinel;

    for (const el of elements) {
      this.set(el[0], el[1]);
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
   * The function returns a new iterator object for a HashMap.
   * @returns A new instance of the HashMapIterator class is being returned.
   */
  get begin() {
    return new HashMapIterator<K, V>(this._head, this._sentinel, this);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function returns a new HashMapIterator object with the _sentinel value as both the start and
   * end values.
   * @returns A new instance of the HashMapIterator class is being returned.
   */
  get end() {
    return new HashMapIterator<K, V>(this._sentinel, this._sentinel, this);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The reverseBegin function returns a new HashMapIterator object that iterates over the elements of
   * a HashMap in reverse order.
   * @returns A new instance of the HashMapIterator class is being returned.
   */
  get reverseBegin() {
    return new HashMapIterator<K, V>(this._tail, this._sentinel, this, IterateDirection.REVERSE);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The reverseEnd function returns a new HashMapIterator object that iterates over the elements of a
   * HashMap in reverse order.
   * @returns A new instance of the HashMapIterator class is being returned.
   */
  get reverseEnd() {
    return new HashMapIterator<K, V>(this._sentinel, this._sentinel, this, IterateDirection.REVERSE);
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `set` function adds a new key-value pair to a data structure, either using an object key or a
   * string key.
   * @param {K} key - The `key` parameter is the key to be set in the data structure. It can be of any
   * type, but typically it is a string or symbol.
   * @param {V} [value] - The `value` parameter is an optional parameter of type `V`. It represents the
   * value associated with the key being set in the data structure.
   * @param {boolean} isObjectKey - A boolean flag indicating whether the key is an object key or not.
   * @returns the size of the data structure after the key-value pair has been set.
   */
  set(key: K, value?: V, isObjectKey: boolean = isObjOrFunc(key)) {
    let newTail;
    if (isObjectKey) {
      const index = (<Record<symbol, number>>(<unknown>key))[this.OBJ_KEY_INDEX];
      if (index !== undefined) {
        this._nodes[<number>index].value = <V>value;
        return this._size;
      }
      Object.defineProperty(key, this.OBJ_KEY_INDEX, {
        value: this._nodes.length,
        configurable: true
      });
      newTail = {
        key: key,
        value: <V>value,
        prev: this._tail,
        next: this._sentinel
      };
      this._nodes.push(newTail);
    } else {
      const node = this._orgMap[<string>(<unknown>key)];
      if (node) {
        node.value = <V>value;
        return this._size;
      }
      this._orgMap[<string>(<unknown>key)] = newTail = {
        key: key,
        value: <V>value,
        prev: this._tail,
        next: this._sentinel
      };
    }
    if (this._size === 0) {
      this._head = newTail;
      this._sentinel.next = newTail;
    } else {
      this._tail.next = newTail;
    }
    this._tail = newTail;
    this._sentinel.prev = newTail;
    return ++this._size;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `get` retrieves the value associated with a given key from a map, either by using the
   * key directly or by using an index stored in the key object.
   * @param {K} key - The `key` parameter is the key used to retrieve a value from the map. It can be
   * of any type, but typically it is a string or symbol.
   * @param {boolean} isObjectKey - The `isObjectKey` parameter is a boolean flag that indicates
   * whether the `key` parameter is an object key or not. If `isObjectKey` is `true`, it means that
   * `key` is an object key. If `isObjectKey` is `false`, it means that `key`
   * @returns The value associated with the given key is being returned. If the key is an object key,
   * the value is retrieved from the `_nodes` array using the index stored in the `OBJ_KEY_INDEX`
   * property of the key. If the key is a string key, the value is retrieved from the `_orgMap` object
   * using the key itself. If the key is not found, `undefined` is
   */
  get(key: K, isObjectKey: boolean = isObjOrFunc(key)) {
    if (isObjectKey) {
      const index = (<Record<symbol, number>>(<unknown>key))[this.OBJ_KEY_INDEX];
      return index !== undefined ? this._nodes[index].value : undefined;
    }
    const node = this._orgMap[<string>(<unknown>key)];
    return node ? node.value : undefined;
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
   * The function `getIterator` returns a new instance of `HashMapIterator` based on the provided key
   * and whether it is an object key or not.
   * @param {K} key - The `key` parameter is the key used to retrieve the iterator from the HashMap. It
   * can be of any type, depending on how the HashMap is implemented.
   * @param {boolean} [isObjectKey] - The `isObjectKey` parameter is an optional boolean parameter that
   * indicates whether the `key` parameter is an object key. If `isObjectKey` is `true`, it means that
   * the `key` parameter is an object and needs to be handled differently. If `isObjectKey` is `false`
   * @returns a new instance of the `HashMapIterator` class.
   */
  getIterator(key: K, isObjectKey?: boolean) {
    let node: HashMapLinkedNode<K, V>;
    if (isObjectKey) {
      const index = (<Record<symbol, number>>(<unknown>key))[this.OBJ_KEY_INDEX];
      if (index === undefined) {
        node = this._sentinel;
      } else {
        node = this._nodes[index];
      }
    } else {
      node = this._orgMap[<string>(<unknown>key)] || this._sentinel;
    }
    return new HashMapIterator<K, V>(node, this._sentinel, this);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `delete` function removes a key-value pair from a map-like data structure.
   * @param {K} key - The `key` parameter is the key that you want to delete from the data structure.
   * It can be of any type, but typically it is a string or an object.
   * @param {boolean} isObjectKey - The `isObjectKey` parameter is a boolean flag that indicates
   * whether the `key` parameter is an object key or not. If `isObjectKey` is `true`, it means that the
   * `key` parameter is an object key. If `isObjectKey` is `false`, it means that the
   * @returns a boolean value. It returns `true` if the deletion was successful, and `false` if the key
   * was not found.
   */
  delete(key: K, isObjectKey: boolean = isObjOrFunc(key)) {
    let node;
    if (isObjectKey) {
      const index = (<Record<symbol, number>>(<unknown>key))[this.OBJ_KEY_INDEX];
      if (index === undefined) return false;
      delete (<Record<symbol, number>>(<unknown>key))[this.OBJ_KEY_INDEX];
      node = this._nodes[index];
      delete this._nodes[index];
    } else {
      node = this._orgMap[<string>(<unknown>key)];
      if (node === undefined) return false;
      delete this._orgMap[<string>(<unknown>key)];
    }
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
    // const OBJ_KEY_INDEX = this.OBJ_KEY_INDEX;
    // this._nodes.forEach(el => {
    //   delete (<Record<symbol, number>><unknown>el.key)[OBJ_KEY_INDEX];
    // });
    this._nodes = [];
    this._orgMap = {};
    Object.setPrototypeOf(this._orgMap, null);
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
  protected _deleteNode(node: HashMapLinkedNode<K, V>) {
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
