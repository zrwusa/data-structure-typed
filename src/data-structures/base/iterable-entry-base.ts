import type { EntryCallback, ReduceEntryCallback } from '../../types';

/**
 * Iterable view over key-value entries.
 * @template K - Key type.
 * @template V - Value type.
 * @remarks Time O(1), Space O(1)
 */
export abstract class IterableEntryBase<K = any, V = any> {
  /**
   * Total number of entries.
   * @returns Entry count.
   * @remarks Time O(1), Space O(1)
   */
  abstract get size(): number;

  /**
   * Default iterator yielding `[key, value]` entries.
   * @returns Iterator of `[K, V]`.
   * @remarks Time O(n) to iterate, Space O(1)
   */
  *[Symbol.iterator](...args: any[]): IterableIterator<[K, V]> {
    yield* this._getIterator(...args);
  }

  /**
   * Iterate over `[key, value]` pairs (may yield `undefined` values).
   * @returns Iterator of `[K, V | undefined]`.
   * @remarks Time O(n), Space O(1)
   
   
   
   
   
    * @example
 * // Iterate key-value pairs
 *  const sl = new SkipList<number, string>([[2, 'b'], [1, 'a'], [3, 'c']]);
 *     console.log([...sl.entries()]); // [[1, 'a'], [2, 'b'], [3, 'c']];
   */
  *entries(): IterableIterator<[K, V | undefined]> {
    for (const item of this) {
      yield item;
    }
  }

  /**
   * Iterate over keys only.
   * @returns Iterator of keys.
   * @remarks Time O(n), Space O(1)
   
   
   
   
   
    * @example
 * // Get all keys sorted
 *  const sl = new SkipList<number, string>([[3, 'c'], [1, 'a']]);
 *     console.log([...sl.keys()]); // [1, 3];
   */
  *keys(): IterableIterator<K> {
    for (const item of this) {
      yield item[0];
    }
  }

  /**
   * Iterate over values only.
   * @returns Iterator of values.
   * @remarks Time O(n), Space O(1)
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Iterate values
 *  const stack = new Stack<number>([1, 2, 3]);
 *     console.log([...stack.values()]); // [1, 2, 3];
   */
  *values(): IterableIterator<V> {
    for (const item of this) {
      yield item[1];
    }
  }

  /**
   * Test whether all entries satisfy the predicate.
   * @param predicate - `(key, value, index, self) => boolean`.
   * @param thisArg - Optional `this` for callback.
   * @returns `true` if all pass; otherwise `false`.
   * @remarks Time O(n), Space O(1)
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Test all words
 *  const trie = new Trie(['abc', 'abcd', 'abcde']);
 *     console.log(trie.every(w => w.startsWith('abc'))); // true;
   */
  every(predicate: EntryCallback<K, V, boolean>, thisArg?: any): boolean {
    let index = 0;
    for (const item of this) {
      if (!predicate.call(thisArg, item[1], item[0], index++, this)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Test whether any entry satisfies the predicate.
   * @param predicate - `(key, value, index, self) => boolean`.
   * @param thisArg - Optional `this` for callback.
   * @returns `true` if any passes; otherwise `false`.
   * @remarks Time O(n), Space O(1)
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Test any word
 *  const trie = new Trie(['cat', 'dog', 'bird']);
 *     console.log(trie.some(w => w.length === 3)); // true;
   */
  some(predicate: EntryCallback<K, V, boolean>, thisArg?: any): boolean {
    let index = 0;
    for (const item of this) {
      if (predicate.call(thisArg, item[1], item[0], index++, this)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Visit each entry, left-to-right.
   * @param callbackfn - `(key, value, index, self) => void`.
   * @param thisArg - Optional `this` for callback.
   * @remarks Time O(n), Space O(1)
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Iterate all words
 *  const trie = new Trie(['a', 'b', 'c']);
 *     const words: string[] = [];
 *     trie.forEach(w => words.push(w));
 *     console.log(words.sort()); // ['a', 'b', 'c'];
   */
  forEach(callbackfn: EntryCallback<K, V, void>, thisArg?: any): void {
    let index = 0;
    for (const item of this) {
      const [key, value] = item;
      callbackfn.call(thisArg, value, key, index++, this);
    }
  }

  /**
   * Find the first entry that matches a predicate.
   * @param callbackfn - `(key, value, index, self) => boolean`.
   * @param thisArg - Optional `this` for callback.
   * @returns Matching `[key, value]` or `undefined`.
   * @remarks Time O(n), Space O(1)
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Find matching word
 *  const trie = new Trie(['apple', 'banana', 'cherry']);
 *     console.log(trie.find(w => w.startsWith('ban'))); // 'banana';
   */
  find(callbackfn: EntryCallback<K, V, boolean>, thisArg?: any): [K, V] | undefined {
    let index = 0;
    for (const item of this) {
      const [key, value] = item;
      if (callbackfn.call(thisArg, value, key, index++, this)) return item;
    }
    return;
  }

  /**
   * Whether the given key exists.
   * @param key - Key to test.
   * @returns `true` if found; otherwise `false`.
   * @remarks Time O(n) generic, Space O(1)
   
   
   
   
   
    * @example
 * // Check element exists
 *  const stack = new Stack<number>([1, 2, 3]);
 *     console.log(stack.has(2)); // true;
 *     console.log(stack.has(9)); // false;
   */
  has(key: K): boolean {
    for (const item of this) {
      const [itemKey] = item;
      if (itemKey === key) return true;
    }
    return false;
  }

  /**
   * Whether there exists an entry with the given value.
   * @param value - Value to test.
   * @returns `true` if found; otherwise `false`.
   * @remarks Time O(n), Space O(1)
   */
  hasValue(value: V): boolean {
    for (const [, elementValue] of this) {
      if (elementValue === value) return true;
    }
    return false;
  }

  /**
   * Get the value under a key.
   * @param key - Key to look up.
   * @returns Value or `undefined`.
   * @remarks Time O(n) generic, Space O(1)
   
   
    * @example
 * // Retrieve value by key
 *  const rbt = new RedBlackTree<number, string>([[1, 'one'], [2, 'two']]);
 *     console.log(rbt.get(1)); // 'one';
   */
  get(key: K): V | undefined {
    for (const item of this) {
      const [itemKey, value] = item;
      if (itemKey === key) return value;
    }
    return;
  }

  /**
   * Reduce entries into a single accumulator.
   * @param callbackfn - `(acc, value, key, index, self) => acc`.
   * @param initialValue - Initial accumulator.
   * @returns Final accumulator.
   * @remarks Time O(n), Space O(1)
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Aggregate words
 *  const trie = new Trie(['hi', 'hey', 'hello']);
 *     const totalChars = trie.reduce((acc, w) => acc + w.length, 0);
 *     console.log(totalChars); // 10;
   */
  reduce<U>(callbackfn: ReduceEntryCallback<K, V, U>, initialValue: U): U {
    let accumulator = initialValue;
    let index = 0;
    for (const item of this) {
      const [key, value] = item;
      accumulator = callbackfn(accumulator, value, key, index++, this);
    }
    return accumulator;
  }

  /**
   * Converts data structure to `[key, value]` pairs.
   * @returns Array of entries.
   * @remarks Time O(n), Space O(n)
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Convert to array
 *  const trie = new Trie(['b', 'a', 'c']);
 *     console.log(trie.toArray().sort()); // ['a', 'b', 'c'];
   */
  toArray() {
    return [...this];
  }

  /**
   * Visualize the iterable as an array of `[key, value]` pairs (or a custom string).
   * @returns Array of entries (default) or a string.
   * @remarks Time O(n), Space O(n)
   */
  toVisual(): [K, V][] | string {
    return [...this];
  }

  /**
   * Print a human-friendly representation to the console.
   * @remarks Time O(n), Space O(n)
   
   
   
   
   
   
   
   
   
    * @example
 * // Display stack
 *  const stack = new Stack<number>([1, 2, 3]);
 *     expect(() => stack.print()).not.toThrow();
   */
  print(): void {
    console.log(this.toVisual());
  }

  /**
   * Whether there are no entries.
   * @returns `true` if empty; `false` otherwise.
   * @remarks Time O(1) typical, Space O(1)
   
   
    * @example
 * // Check if empty
 *  console.log(new RedBlackTree().isEmpty()); // true;
   */
  abstract isEmpty(): boolean;

  /**
   * Remove all entries.
   * @remarks Time O(n) typical, Space O(1)
    * @example
 * // Remove all nodes
 *  const bst = new BST<number>([1, 2, 3]);
 *     bst.clear();
 *     console.log(bst.size); // 0;
 *     console.log(bst.isEmpty()); // true;
   */
  abstract clear(): void;

  /**
   * Deep clone preserving the concrete subtype.
   * @returns A new instance of the same concrete class (`this` type).
   * @remarks Time O(n) typical, Space O(n)
   
   
    * @example
 * // Create independent copy
 *  const rbt = new RedBlackTree<number>([5, 3, 7]);
 *     const copy = rbt.clone();
 *     copy.delete(3);
 *     console.log(rbt.has(3)); // true;
   */
  abstract clone(): this;

  /**
   * Map entries using an implementation-specific strategy.
   * @remarks Time O(n), Space O(n)
   */
  abstract map(...args: any[]): any;

  /**
   * Filter entries and return the same-species structure.
   * @returns A new instance of the same concrete class (`this` type).
   * @remarks Time O(n), Space O(n)
   
   
    * @example
 * // Filter entries
 *  const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5]);
 *     const evens = rbt.filter((v, k) => k % 2 === 0);
 *     console.log([...evens.keys()]); // [2, 4];
   */
  abstract filter(...args: any[]): this;

  /**
   * Underlying iterator for the default iteration protocol.
   * @returns Iterator of `[K, V]`.
   * @remarks Time O(n), Space O(1)
   */
  protected abstract _getIterator(...args: any[]): IterableIterator<[K, V]>;
}
