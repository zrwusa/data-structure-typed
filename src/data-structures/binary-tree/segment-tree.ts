/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @license MIT License
 */

export type SegmentTreeOptions<E> = {
  merger: (a: E, b: E) => E;
  identity: E;
};

/**
 * Generic Segment Tree with flat array internals.
 *
 * Supports any associative merge operation (sum, min, max, gcd, etc.).
 * Reference: AtCoder Library segtree<S, op, e>.
 *
 * @example
 * ```ts
 * const sumTree = SegmentTree.sum([1, 2, 3, 4, 5]);
 * sumTree.query(1, 3);    // 9 (2+3+4)
 * sumTree.update(2, 10);  // [1, 2, 10, 4, 5]
 * sumTree.query(1, 3);    // 16 (2+10+4)
 *
 * const minTree = SegmentTree.min([5, 2, 8, 1, 9]);
 * minTree.query(0, 4);    // 1
 * ```
 */
export class SegmentTree<E = number> implements Iterable<E> {
  protected readonly _merger: (a: E, b: E) => E;
  protected readonly _identity: E;
  protected _n: number;         // number of leaf elements
  protected _tree: E[];         // flat array, 1-indexed, size 2*_size
  protected _treeSize: number;  // internal tree size (next power of 2 >= _n)

  constructor(elements: E[], options: SegmentTreeOptions<E>) {
    this._merger = options.merger;
    this._identity = options.identity;
    this._n = elements.length;

    // Round up to next power of 2
    this._treeSize = 1;
    while (this._treeSize < this._n) this._treeSize <<= 1;

    // Allocate and fill with identity
    this._tree = new Array(2 * this._treeSize).fill(this._identity);

    // Place elements in leaves
    for (let i = 0; i < this._n; i++) {
      this._tree[this._treeSize + i] = elements[i];
    }

    // Build internal nodes bottom-up
    for (let i = this._treeSize - 1; i >= 1; i--) {
      this._tree[i] = this._merger(this._tree[2 * i], this._tree[2 * i + 1]);
    }
  }

  // ─── Convenience factories ─────────────────────────────────

  /**
   * Create a sum segment tree.
   * @example
   * ```ts
   * const st = SegmentTree.sum([1, 2, 3, 4, 5]);
   * st.query(0, 2); // 6 (1+2+3)
   * st.update(1, 10);
   * st.query(0, 2); // 14 (1+10+3)
   * ```
   */
  static sum(elements: number[]): SegmentTree<number> {
    return new SegmentTree<number>(elements, {
      merger: (a, b) => a + b,
      identity: 0
    });
  }

  /**
   * Create a min segment tree.
  
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Temperature monitoring with range queries
 *  // Hourly temperatures for a day (24 readings)
 *     const temps = [18, 17, 16, 15, 16, 18, 21, 24, 27, 29, 31, 32, 33, 32, 31, 29, 27, 25, 23, 21, 20, 19, 18, 17];
 *     const tree = SegmentTree.sum(temps);
 *
 *     // Average temperature during work hours (9-17)
 *     const workSum = tree.query(9, 17);
 *     console.log(workSum / 9); // toBeCloseTo;
 *
 *     // Sum of morning temps (6-11)
 *     console.log(tree.query(6, 11)); // 164;
   */
  static min(elements: number[]): SegmentTree<number> {
    return new SegmentTree<number>(elements, {
      merger: (a, b) => Math.min(a, b),
      identity: Infinity
    });
  }

  /**
   * Create a max segment tree.
   * @example
   * ```ts
   * const st = SegmentTree.max([3, 1, 4, 1, 5]);
   * st.query(1, 4); // 5
   * ```
   */
  static max(elements: number[]): SegmentTree<number> {
    return new SegmentTree<number>(elements, {
      merger: (a, b) => Math.max(a, b),
      identity: -Infinity
    });
  }

  // ─── Core operations ───────────────────────────────────────

  /**
   * Point update: set element at index to value.
   * Time: O(log n)
  
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Dynamic range sum with updates
 *  // Monthly revenue data (in thousands)
 *     const revenue = [120, 95, 140, 110, 85, 130, 150, 100, 160, 125, 90, 175];
 *     const tree = SegmentTree.sum(revenue);
 *
 *     // Q1 revenue (Jan-Mar)
 *     console.log(tree.query(0, 2)); // 355;
 *
 *     // Update March revenue from 140 to 200
 *     tree.update(2, 200);
 *
 *     // Q1 revenue after update
 *     console.log(tree.query(0, 2)); // 415;
 *
 *     // H1 revenue (Jan-Jun)
 *     console.log(tree.query(0, 5)); // 740;
   */
  update(index: number, value: E): void {
    if (index < 0 || index >= this._n) return;

    let pos = this._treeSize + index;
    this._tree[pos] = value;

    // Propagate up
    pos >>= 1;
    while (pos >= 1) {
      this._tree[pos] = this._merger(this._tree[2 * pos], this._tree[2 * pos + 1]);
      pos >>= 1;
    }
  }

  /**
   * Range query: returns merger result over [start, end] (inclusive).
   * Time: O(log n)
  
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Range sum query on an array
 *  const tree = SegmentTree.sum([1, 3, 5, 7, 9, 11]);
 *
 *     // Query sum of range [1, 3] → 3 + 5 + 7 = 15
 *     console.log(tree.query(1, 3)); // 15;
 *
 *     // Query entire range
 *     console.log(tree.query(0, 5)); // 36;
 *
 *     // Query single element
 *     console.log(tree.query(2, 2)); // 5;
   */
  query(start: number, end: number): E {
    if (start < 0) start = 0;
    if (end >= this._n) end = this._n - 1;
    if (start > end) return this._identity;

    let resultLeft = this._identity;
    let resultRight = this._identity;
    let left = this._treeSize + start;
    let right = this._treeSize + end + 1; // exclusive

    while (left < right) {
      if (left & 1) {
        resultLeft = this._merger(resultLeft, this._tree[left]);
        left++;
      }
      if (right & 1) {
        right--;
        resultRight = this._merger(this._tree[right], resultRight);
      }
      left >>= 1;
      right >>= 1;
    }

    return this._merger(resultLeft, resultRight);
  }

  /**
   * Get element at index.
   * Time: O(1)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Point access on segment tree
 *  const st = SegmentTree.sum([10, 20, 30, 40]);
 *     console.log(st.get(0)); // 10;
 *     console.log(st.get(2)); // 30;
   */
  get(index: number): E {
    if (index < 0 || index >= this._n) return this._identity;
    return this._tree[this._treeSize + index];
  }

  // ─── Binary search on tree (ACL-style) ─────────────────────

  /**
   * Find the largest r such that predicate(query(left, r)) is true.
   * Returns left-1 if predicate(identity) is false.
   * Returns n-1 if predicate holds for the entire range [left, n-1].
   * Time: O(log n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Find rightmost position where predicate holds
 *  // Prefix sums: find the rightmost index where prefix sum < 10
 *     const st = SegmentTree.sum([3, 1, 4, 1, 5]);
 *     // maxRight(0, sum => sum < 10) — prefix [3,4,8,9,14]
 *     // sum < 10 holds through index 3 (prefix=9), fails at 4 (prefix=14)
 *     const result = st.maxRight(0, sum => sum < 10);
 *     console.log(result); // 3;
   */
  maxRight(left: number, predicate: (segValue: E) => boolean): number {
    if (left >= this._n) return this._n - 1;

    let acc = this._identity;
    if (!predicate(acc)) return left - 1;

    let pos = this._treeSize + left;

    // Go up while we're a right child or predicate still holds
    while (true) {
      // Find the lowest relevant node
      while (pos < this._treeSize) {
        // Try going left
        const combined = this._merger(acc, this._tree[2 * pos]);
        if (predicate(combined)) {
          acc = combined;
          pos = 2 * pos + 1; // go right
        } else {
          pos = 2 * pos; // go left (dig deeper)
        }
      }

      // At leaf level
      const combined = this._merger(acc, this._tree[pos]);
      if (!predicate(combined)) {
        return pos - this._treeSize - 1;
      }
      acc = combined;

      // Move to next segment
      pos++;
      // Check if we've gone past the end
      if (pos - this._treeSize >= this._n) return this._n - 1;

      // Go up while we're a right child
      while (pos > 1 && (pos & 1) === 0) {
        pos >>= 1;
      }
      /* istanbul ignore next -- defensive: pos===1 unreachable when _n < _treeSize guard above catches exit */
      if (pos === 1) return this._n - 1;
    }
  }

  /**
   * Find the smallest l such that predicate(query(l, right)) is true.
   * Returns right+1 if predicate(identity) is false.
   * Returns 0 if predicate holds for the entire range [0, right].
   * Time: O(log n)
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    * @example
 * // Find leftmost position where predicate holds
 *  const st = SegmentTree.sum([3, 1, 4, 1, 5]);
 *     // minLeft(5, sum => sum < 7) — suffix sums from right
 *     // From right: [5]=5 < 7, [1,5]=6 < 7, [4,1,5]=10 ≥ 7
 *     const result = st.minLeft(5, sum => sum < 7);
 *     console.log(result); // 3;
   */
  minLeft(right: number, predicate: (segValue: E) => boolean): number {
    if (right < 0) return 0;
    if (right >= this._n) right = this._n - 1;

    let acc = this._identity;
    if (!predicate(acc)) return right + 1;

    let pos = this._treeSize + right;

    while (true) {
      while (pos < this._treeSize) {
        const combined = this._merger(this._tree[2 * pos + 1], acc);
        if (predicate(combined)) {
          acc = combined;
          pos = 2 * pos; // go left
        } else {
          pos = 2 * pos + 1; // go right (dig deeper)
        }
      }

      const combined = this._merger(this._tree[pos], acc);
      if (!predicate(combined)) {
        return pos - this._treeSize + 1;
      }
      acc = combined;

      // Move to previous segment
      if (pos === this._treeSize) return 0;
      pos--;

      // Go up while we're a left child
      while (pos > 1 && (pos & 1) === 1) {
        pos >>= 1;
      }
      /* istanbul ignore next -- defensive: pos===1 unreachable when _treeSize guard above catches exit */
      if (pos === 1) return 0;
    }
  }

  // ─── Standard interface ────────────────────────────────────

  get size(): number {
    return this._n;
  }

  isEmpty(): boolean {
    return this._n === 0;
  }

  clone(): SegmentTree<E> {
    const elements: E[] = [];
    for (let i = 0; i < this._n; i++) {
      elements.push(this._tree[this._treeSize + i]);
    }
    return new SegmentTree<E>(elements, {
      merger: this._merger,
      identity: this._identity
    });
  }

  toArray(): E[] {
    const result: E[] = [];
    for (let i = 0; i < this._n; i++) {
      result.push(this._tree[this._treeSize + i]);
    }
    return result;
  }

  /**
   * Iterates over leaf values in index order.
   */
  [Symbol.iterator](): IterableIterator<E> {
    const tree = this._tree;
    const treeSize = this._treeSize;
    const n = this._n;
    let i = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next(): IteratorResult<E> {
        if (i < n) {
          return { value: tree[treeSize + i++], done: false };
        }
        return { value: undefined, done: true } as IteratorResult<E>;
      }
    };
  }

  forEach(callback: (value: E, index: number) => void): void {
    for (let i = 0; i < this._n; i++) {
      callback(this._tree[this._treeSize + i], i);
    }
  }

  print(): void {
    console.log(this.toArray());
  }
}


