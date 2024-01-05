/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { SkipLinkedListOptions } from '../../types';

export class SkipListNode<K, V> {
  key: K;
  value: V;
  forward: SkipListNode<K, V>[];

  constructor(key: K, value: V, level: number) {
    this.key = key;
    this.value = value;
    this.forward = new Array(level);
  }
}

export class SkipList<K, V> {
  /**
   * The constructor function initializes a SkipLinkedList object with optional options and elements.
   * @param elements - The `elements` parameter is an iterable containing key-value pairs `[K, V]`. It
   * is used to initialize the SkipLinkedList with the given key-value pairs. If no elements are
   * provided, the SkipLinkedList will be empty.
   * @param {SkipLinkedListOptions} [options] - The `options` parameter is an optional object that can
   * contain two properties:
   */
  constructor(elements: Iterable<[K, V]> = [], options?: SkipLinkedListOptions) {
    if (options) {
      const { maxLevel, probability } = options;
      if (typeof maxLevel === 'number') this._maxLevel = maxLevel;
      if (typeof probability === 'number') this._probability = probability;
    }

    if (elements) {
      for (const [key, value] of elements) this.add(key, value);
    }
  }

  protected _head: SkipListNode<K, V> = new SkipListNode<K, V>(undefined as any, undefined as any, this.maxLevel);

  /**
   * The function returns the head node of a SkipList.
   * @returns The method is returning a SkipListNode object with generic key type K and value type V.
   */
  get head(): SkipListNode<K, V> {
    return this._head;
  }

  protected _level: number = 0;

  /**
   * The function returns the value of the protected variable _level.
   * @returns The level property of the object.
   */
  get level(): number {
    return this._level;
  }

  protected _maxLevel: number = 16;

  /**
   * The function returns the maximum level.
   * @returns The value of the variable `_maxLevel` is being returned.
   */
  get maxLevel(): number {
    return this._maxLevel;
  }

  protected _probability: number = 0.5;

  /**
   * The function returns the probability value.
   * @returns The probability value stored in the protected variable `_probability` is being returned.
   */
  get probability(): number {
    return this._probability;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Get the value of the first element (the smallest element) in the Skip List.
   * @returns The value of the first element, or undefined if the Skip List is empty.
   */
  get first(): V | undefined {
    const firstNode = this.head.forward[0];
    return firstNode ? firstNode.value : undefined;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Get the value of the last element (the largest element) in the Skip List.
   * @returns The value of the last element, or undefined if the Skip List is empty.
   */
  get last(): V | undefined {
    let current = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (current.forward[i]) {
        current = current.forward[i];
      }
    }
    return current.value;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The add function adds a new node with a given key and value to a Skip List data structure.
   * @param {K} key - The key parameter represents the key of the node that needs to be added to the skip list.
   * @param {V} value - The "value" parameter represents the value associated with the key that is being added to the Skip
   * List.
   */
  add(key: K, value: V): void {
    const newNode = new SkipListNode(key, value, this._randomLevel());
    const update: SkipListNode<K, V>[] = new Array(this.maxLevel).fill(this.head);
    let current = this.head;

    for (let i = this.level - 1; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].key < key) {
        current = current.forward[i];
      }
      update[i] = current;
    }

    for (let i = 0; i < newNode.forward.length; i++) {
      newNode.forward[i] = update[i].forward[i];
      update[i].forward[i] = newNode;
    }

    if (!newNode.forward[0]) {
      this._level = Math.max(this.level, newNode.forward.length);
    }
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `get` retrieves the value associated with a given key from a skip list data structure.
   * @param {K} key - The `key` parameter is the key of the element that we want to retrieve from the data structure.
   * @returns The method `get(key: K)` returns the value associated with the given key if it exists in the data structure,
   * otherwise it returns `undefined`.
   */
  get(key: K): V | undefined {
    let current = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].key < key) {
        current = current.forward[i];
      }
    }

    current = current.forward[0];

    if (current && current.key === key) {
      return current.value;
    }

    return undefined;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * The function checks if a key exists in a data structure.
   * @param {K} key - The parameter "key" is of type K, which represents the type of the key being
   * checked.
   * @returns a boolean value.
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes a node with a specific key from a Skip List data structure.
   * @param {K} key - The key parameter represents the key of the node that needs to be removed from the skip list.
   * @returns The `delete` method returns a boolean value. It returns `true` if the key was successfully removed from the
   * skip list, and `false` if the key was not found in the skip list.
   */
  delete(key: K): boolean {
    const update: SkipListNode<K, V>[] = new Array(this.maxLevel).fill(this.head);
    let current = this.head;

    for (let i = this.level - 1; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].key < key) {
        current = current.forward[i];
      }
      update[i] = current;
    }

    current = current.forward[0];

    if (current && current.key === key) {
      for (let i = 0; i < this.level; i++) {
        if (update[i].forward[i] !== current) {
          break;
        }
        update[i].forward[i] = current.forward[i];
      }
      while (this.level > 0 && !this.head.forward[this.level - 1]) {
        this._level--;
      }
      return true;
    }

    return false;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Get the value of the first element in the Skip List that is greater than the given key.
   * @param key - the given key.
   * @returns The value of the first element greater than the given key, or undefined if there is no such element.
   */
  higher(key: K): V | undefined {
    let current = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].key <= key) {
        current = current.forward[i];
      }
    }
    const nextNode = current.forward[0];
    return nextNode ? nextNode.value : undefined;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Get the value of the last element in the Skip List that is less than the given key.
   * @param key - the given key.
   * @returns The value of the last element less than the given key, or undefined if there is no such element.
   */
  lower(key: K): V | undefined {
    let current = this.head;
    let lastLess = undefined;

    for (let i = this.level - 1; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].key < key) {
        current = current.forward[i];
      }
      if (current.key < key) {
        lastLess = current;
      }
    }

    return lastLess ? lastLess.value : undefined;
  }

  /**
   * Time Complexity: O(maxLevel)
   * Space Complexity: O(1)
   * where maxLevel is the maximum level of the SkipList, as it may iterate up to maxLevel times in the worst case.
   */

  /**
   * Time Complexity: O(maxLevel)
   * Space Complexity: O(1)
   *
   * The function "_randomLevel" generates a random level based on a given probability and maximum level.
   * @returns the level, which is a number.
   */
  protected _randomLevel(): number {
    let level = 1;
    while (Math.random() < this.probability && level < this.maxLevel) {
      level++;
    }
    return level;
  }
}
