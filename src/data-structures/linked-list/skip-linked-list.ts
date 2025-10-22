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

  protected _head: SkipListNode<K, V> = new SkipListNode<K, V>(undefined as K, undefined as V, this.maxLevel);

  get head(): SkipListNode<K, V> {
    return this._head;
  }

  protected _level: number = 0;

  get level(): number {
    return this._level;
  }

  protected _maxLevel: number = 16;

  get maxLevel(): number {
    return this._maxLevel;
  }

  protected _probability: number = 0.5;

  get probability(): number {
    return this._probability;
  }

  get first(): V | undefined {
    const firstNode = this.head.forward[0];
    return firstNode ? firstNode.value : undefined;
  }

  get last(): V | undefined {
    let current = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (current.forward[i]) {
        current = current.forward[i];
      }
    }
    return current.value;
  }

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

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

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

  protected _randomLevel(): number {
    let level = 1;
    while (Math.random() < this.probability && level < this.maxLevel) {
      level++;
    }
    return level;
  }
}
