/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

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
  get probability(): number {
    return this._probability;
  }

  set probability(value: number) {
    this._probability = value;
  }
  get maxLevel(): number {
    return this._maxLevel;
  }

  set maxLevel(value: number) {
    this._maxLevel = value;
  }
  get level(): number {
    return this._level;
  }

  set level(value: number) {
    this._level = value;
  }
  get head(): SkipListNode<K, V> {
    return this._head;
  }

  set head(value: SkipListNode<K, V>) {
    this._head = value;
  }
  private _head: SkipListNode<K, V>;
  private _level: number;
  private _maxLevel: number;
  private _probability: number;

  /**
   * The constructor initializes a SkipList with a specified maximum level and probability.
   * @param [maxLevel=16] - The `maxLevel` parameter represents the maximum level that a skip list can have. It determines
   * the maximum number of levels that can be created in the skip list.
   * @param [probability=0.5] - The probability parameter represents the probability of a node being promoted to a higher
   * level in the skip list. It is used to determine the height of each node in the skip list.
   */
  constructor(maxLevel = 16, probability = 0.5) {
    this._head = new SkipListNode<K, V>(null as any, null as any, maxLevel);
    this._level = 0;
    this._maxLevel = maxLevel;
    this._probability = probability;
  }

  /**
   * The function "randomLevel" generates a random level based on a given probability and maximum level.
   * @returns the level, which is a number.
   */
  private randomLevel(): number {
    let level = 1;
    while (Math.random() < this.probability && level < this.maxLevel) {
      level++;
    }
    return level;
  }

  /**
   * The add function adds a new node with a given key and value to a Skip List data structure.
   * @param {K} key - The key parameter represents the key of the node that needs to be added to the skip list.
   * @param {V} value - The "value" parameter represents the value associated with the key that is being added to the Skip
   * List.
   */
  add(key: K, value: V): void {
    const newNode = new SkipListNode(key, value, this.randomLevel());
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

    if (newNode.forward[0] !== null) {
      this.level = Math.max(this.level, newNode.forward.length);
    }
  }

  /**
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
   * The `remove` function removes a node with a specific key from a Skip List data structure.
   * @param {K} key - The key parameter represents the key of the node that needs to be removed from the skip list.
   * @returns The `remove` method returns a boolean value. It returns `true` if the key was successfully removed from the
   * skip list, and `false` if the key was not found in the skip list.
   */
  remove(key: K): boolean {
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
      while (this.level > 0 && this.head.forward[this.level - 1] === null) {
        this.level--;
      }
      return true;
    }

    return false;
  }
}
