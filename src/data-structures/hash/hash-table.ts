/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
export class HashNode<K, V> {
  key: K;
  val: V;
  next: HashNode<K, V> | null;

  constructor(key: K, val: V) {
    this.key = key;
    this.val = val;
    this.next = null;
  }
}

export class HashTable<K, V> {
  get buckets(): Array<HashNode<K, V> | null> {
    return this._buckets;
  }

  set buckets(value: Array<HashNode<K, V> | null>) {
    this._buckets = value;
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
  }

  get capacity(): number {
    return this._capacity;
  }

  set capacity(value: number) {
    this._capacity = value;
  }

  private _capacity: number;
  private _size: number;
  private _buckets: Array<HashNode<K, V> | null>;

  /**
   * The constructor initializes the capacity, size, and buckets of an object.
   * @param [capacity=1000] - The `capacity` parameter represents the maximum number of elements that the data structure
   * can hold. It is an optional parameter with a default value of 1000.
   */
  constructor(capacity = 1000) {
    this._capacity = capacity;
    this._size = 0;
    this._buckets = new Array(this.capacity).fill(null);
  }

  /**
   * The hash function takes a key, converts it to a string, calculates the sum of the ASCII values of its characters, and
   * returns the remainder when divided by the capacity of the data structure.
   * @param {K} key - The `key` parameter represents the key that needs to be hashed. It is of type `K`, which means it can
   * be any data type that can be converted to a string.
   * @returns The hash value of the key modulo the capacity of the data structure.
   */
  private hash(key: K): number {
    const keyString = String(key);
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      hash += keyString.charCodeAt(i);
    }
    return hash % this.capacity;
  }

  /**
   * The put function adds a key-value pair to a hash table, handling collisions by chaining.
   * @param {K} key - The key parameter represents the key of the key-value pair that you want to insert into the hash
   * table. It is of type K, which can be any data type that can be used as a key, such as a string, number, or object.
   * @param {V} val - The `val` parameter represents the value associated with the key in the hash table.
   * @returns Nothing is being returned. The return type of the function is void, which means it does not return any value.
   */
  put(key: K, val: V): void {
    const index = this.hash(key);
    const newNode = new HashNode(key, val);

    if (!this.buckets[index]) {
      this.buckets[index] = newNode;
    } else {
      // Handle collision by chaining
      let currentNode = this.buckets[index]!;
      while (currentNode.next) {
        if (currentNode.key === key) {
          // Update the val if the key already exists
          currentNode.val = val;
          return;
        }
        currentNode = currentNode.next;
      }
      if (currentNode.key === key) {
        // Update the val if the key already exists (last node)
        currentNode.val = val;
      } else {
        // Add the new node to the end of the chain
        currentNode.next = newNode;
      }
    }
    this.size++;
  }

  /**
   * The `get` function retrieves the value associated with a given key from a hash table.
   * @param {K} key - The parameter "key" represents the key of the element that we want to retrieve from the data
   * structure.
   * @returns The method is returning the value associated with the given key if it exists in the hash table. If the key is
   * not found, it returns `undefined`.
   */
  get(key: K): V | undefined {
    const index = this.hash(key);
    let currentNode = this.buckets[index];

    while (currentNode) {
      if (currentNode.key === key) {
        return currentNode.val;
      }
      currentNode = currentNode.next;
    }
    return undefined; // Key not found
  }

  /**
   * The `remove` function removes a key-value pair from a hash table.
   * @param {K} key - The `key` parameter represents the key of the key-value pair that needs to be removed from the hash
   * table.
   * @returns Nothing is being returned. The `remove` method has a return type of `void`, which means it does not return
   * any value.
   */
  remove(key: K): void {
    const index = this.hash(key);
    let currentNode = this.buckets[index];
    let prevNode: HashNode<K, V> | null = null;

    while (currentNode) {
      if (currentNode.key === key) {
        if (prevNode) {
          prevNode.next = currentNode.next;
        } else {
          this.buckets[index] = currentNode.next;
        }
        this.size--;
        return;
      }
      prevNode = currentNode;
      currentNode = currentNode.next;
    }
  }
}
