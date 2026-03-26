/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import { ERR } from '../../common';

/**
 * Binary Indexed Tree (Fenwick Tree).
 *
 * Efficient prefix sums and point updates in O(log n).
 * Standard array-based implementation per C++ competitive programming conventions.
 *
 * All indices are 0-based externally; internally converted to 1-based for BIT arithmetic.
 *
 * @example
 * ```ts
 * const bit = new BinaryIndexedTree(6);
 * bit.update(0, 3);   // index 0 += 3
 * bit.update(1, 2);   // index 1 += 2
 * bit.update(2, 7);   // index 2 += 7
 *
 * bit.query(2);       // prefix sum [0..2] = 12
 * bit.queryRange(1, 2); // range sum [1..2] = 9
 * bit.get(1);         // point value at index 1 = 2
 * ```
 */
export class BinaryIndexedTree implements Iterable<number> {
  protected readonly _size: number;
  protected _tree: number[];  // 1-indexed BIT array

  /**
   * Construct a BIT of given size (all zeros), or from an initial values array.
   * @param sizeOrElements - number of elements, or an array of initial values
   */
  constructor(sizeOrElements: number | number[]) {
    if (Array.isArray(sizeOrElements)) {
      this._size = sizeOrElements.length;
      this._tree = new Array(this._size + 1).fill(0);
      for (let i = 0; i < this._size; i++) {
        this._pointUpdate(i + 1, sizeOrElements[i]);
      }
    } else {
      if (!Number.isInteger(sizeOrElements) || sizeOrElements < 0) {
        throw new RangeError(ERR.invalidArgument('size must be a non-negative integer', 'BinaryIndexedTree'));
      }
      this._size = sizeOrElements;
      this._tree = new Array(this._size + 1).fill(0);
    }
  }

  // ─── Core operations ──────────────────────────────────────────

  /**
   * Point update: add delta to the value at index (0-based).
   * Time: O(log n)
  
   
   
   
    * @example
 * // Increment a value by delta
 *  const bit = new BinaryIndexedTree([0, 0, 0, 0, 0]);
 *     bit.update(2, 7);
 *     console.log(bit.get(2)); // 7;
 *     bit.update(2, 3);
 *     console.log(bit.get(2)); // 10;
   */
  update(index: number, delta: number): void {
    this._checkIndex(index);
    this._pointUpdate(index + 1, delta);
  }

  /**
   * Point set: set the value at index to an absolute value (0-based).
   * Time: O(log n)
   
  
   
   
   
    * @example
 * // Building from array
 *  const bit = new BinaryIndexedTree([10, 20, 30, 40, 50]);
 *
 *     console.log(bit.get(2)); // 30;
 *     console.log(bit.query(2)); // 60;   // 10+20+30
 *     console.log(bit.query(4)); // 150;  // total
 *
 *     // Increment index 1 by 5
 *     bit.update(1, 5);
 *     console.log(bit.get(1)); // 25;
 *     console.log(bit.query(2)); // 65;
   */
  set(index: number, value: number): void {
    this._checkIndex(index);
    const current = this.get(index);
    this._pointUpdate(index + 1, value - current);
  }

  /**
   * Get the point value at index (0-based).
   * Time: O(log n)
  
   
   
   
    * @example
 * // Read point value at index
 *  const bit = new BinaryIndexedTree([5, 3, 8, 1]);
 *     console.log(bit.get(0)); // 5;
 *     console.log(bit.get(2)); // 8;
   */
  get(index: number): number {
    this._checkIndex(index);
    return this._pointQuery(index + 1);
  }

  /**
   * Prefix sum query: returns sum of elements [0..index] (inclusive, 0-based).
   * Time: O(log n)
   
  
   
   
   
    * @example
 * // Prefix sum queries and point updates
 *  // 6-element BIT: index 0..5
 *     const bit = new BinaryIndexedTree(6);
 *
 *     bit.update(0, 3);
 *     bit.update(1, 2);
 *     bit.update(2, 7);
 *     bit.update(3, 1);
 *     bit.update(4, 5);
 *     bit.update(5, 4);
 *
 *     // Prefix sum [0..2] = 3+2+7 = 12
 *     console.log(bit.query(2)); // 12;
 *     // Range sum [1..3] = 2+7+1 = 10
 *     console.log(bit.queryRange(1, 3)); // 10;
 *     // Point value at index 2
 *     console.log(bit.get(2)); // 7;
   */
  query(index: number): number {
    this._checkIndex(index);
    return this._prefixSum(index + 1);
  }

  /**
   * Range sum query: returns sum of elements [start..end] (inclusive, 0-based).
   * Time: O(log n)
  
   
   
   
    * @example
 * // Range sum query
 *  const bit = new BinaryIndexedTree([1, 2, 3, 4, 5]);
 *     console.log(bit.queryRange(1, 3)); // 9; // 2+3+4
 *     console.log(bit.queryRange(0, 4)); // 15; // 1+2+3+4+5
 *     console.log(bit.queryRange(2, 2)); // 3;
   */
  queryRange(start: number, end: number): number {
    this._checkIndex(start);
    this._checkIndex(end);
    if (start > end) return 0;
    if (start === 0) return this._prefixSum(end + 1);
    return this._prefixSum(end + 1) - this._prefixSum(start);
  }

  // ─── Binary search ───────────────────────────────────────────

  /**
   * Find the smallest index i such that prefix sum [0..i] >= sum.
   * Requires all values to be non-negative (behavior undefined otherwise).
   * Returns size if no such index exists.
   * Time: O(log n)
   
  
   
   
   
    * @example
 * // Counting frequency of ratings
 *  // Track frequency of scores (0-4 scale, 5 possible values)
 *     const freq = new BinaryIndexedTree(5);
 *
 *     // Record ratings: 2,0,3,0,4,1
 *     for (const rating of [2, 0, 3, 0, 4, 1]) {
 *       freq.update(rating, 1);
 *     }
 *
 *     // How many ratings are ≤ 2? (prefix sum [0..2])
 *     console.log(freq.query(2)); // 4; // two 0s, one 1, one 2
 *
 *     // How many ratings are exactly 0?
 *     console.log(freq.get(0)); // 2;
 *
 *     // Find rating where cumulative count first reaches 3
 *     // freq=[2,1,1,1,1], prefix=[2,3,...] → prefix[1]=3 >= 3
 *     console.log(freq.lowerBound(3)); // 1;
   */
  lowerBound(sum: number): number {
    let pos = 0;
    let bitMask = this._highBit(this._size);

    while (bitMask > 0) {
      const next = pos + bitMask;
      if (next <= this._size && this._tree[next] < sum) {
        sum -= this._tree[next];
        pos = next;
      }
      bitMask >>= 1;
    }

    return pos; // 0-based
  }

  /**
   * Find the smallest index i such that prefix sum [0..i] > sum.
   * Requires all values to be non-negative (behavior undefined otherwise).
   * Returns size if no such index exists.
   * Time: O(log n)
   */
  upperBound(sum: number): number {
    let pos = 0;
    let bitMask = this._highBit(this._size);

    while (bitMask > 0) {
      const next = pos + bitMask;
      if (next <= this._size && this._tree[next] <= sum) {
        sum -= this._tree[next];
        pos = next;
      }
      bitMask >>= 1;
    }

    return pos; // 0-based
  }

  // ─── Standard interface ──────────────────────────────────────

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  clear(): void {
    this._tree.fill(0);
  }

  clone(): BinaryIndexedTree {
    return new BinaryIndexedTree(this.toArray());
  }

  /**
   * Returns the point values as a plain array.
   * Time: O(n log n)
   */
  toArray(): number[] {
    const result: number[] = [];
    for (let i = 0; i < this._size; i++) {
      result.push(this._pointQuery(i + 1));
    }
    return result;
  }

  /**
   * Iterate over point values in index order.
   */
  [Symbol.iterator](): IterableIterator<number> {
    const size = this._size;
    let i = 0;
    const self = this;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next(): IteratorResult<number> {
        if (i < size) {
          return { value: self._pointQuery(i++ + 1), done: false };
        }
        return { value: undefined as any, done: true };
      }
    };
  }

  forEach(callback: (value: number, index: number) => void): void {
    for (let i = 0; i < this._size; i++) {
      callback(this._pointQuery(i + 1), i);
    }
  }

  print(): void {
    console.log(this.toArray());
  }

  // ─── Internal helpers ─────────────────────────────────────────

  /** 1-based prefix sum up to pos (inclusive). */
  protected _prefixSum(pos: number): number {
    let sum = 0;
    while (pos > 0) {
      sum += this._tree[pos];
      pos -= pos & -pos;
    }
    return sum;
  }

  /** 1-based point update: add delta to position pos. */
  protected _pointUpdate(pos: number, delta: number): void {
    while (pos <= this._size) {
      this._tree[pos] += delta;
      pos += pos & -pos;
    }
  }

  /** 1-based point query: get exact value at pos. */
  protected _pointQuery(pos: number): number {
    let val = this._tree[pos];
    const lca = pos - (pos & -pos);  // parent in prefix-sum sense
    pos--;
    while (pos > lca) {
      val -= this._tree[pos];
      pos -= pos & -pos;
    }
    return val;
  }

  protected _checkIndex(index: number): void {
    if (!Number.isInteger(index)) {
      throw new TypeError(ERR.invalidIndex('BinaryIndexedTree'));
    }
    if (index < 0 || index >= this._size) {
      throw new RangeError(ERR.indexOutOfRange(index, 0, this._size - 1, 'BinaryIndexedTree'));
    }
  }

  /** Returns highest power of 2 <= n. */
  protected _highBit(n: number): number {
    let bit = 1;
    while (bit <= n) bit <<= 1;
    return bit >> 1;
  }
}
