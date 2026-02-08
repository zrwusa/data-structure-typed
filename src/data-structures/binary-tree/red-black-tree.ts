/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  BinaryTreeDeleteResult,
  CRUD,
  EntryCallback,
  FamilyPosition,
  OptNode,
  RBTNColor,
  RedBlackTreeOptions
} from '../../types';
import { BST } from './bst';
import { IBinaryTree } from '../../interfaces';

export class RedBlackTreeNode<K = any, V = any> {
  key: K;
  value?: V;
  parent?: RedBlackTreeNode<K, V> = undefined;

  /**
   * Create a Red-Black Tree and optionally bulk-insert items.
   * @remarks Time O(n log n), Space O(n)
   * @param key - See parameter type for details.
   * @param [value]- See parameter type for details.
   * @param color - See parameter type for details.
   * @returns New RedBlackTree instance.
   */

  constructor(key: K, value?: V, color: RBTNColor = 'BLACK') {
    this.key = key;
    this.value = value;
    this.color = color;
  }

  _left?: RedBlackTreeNode<K, V> | null | undefined = undefined;

  /**
   * Get the left child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Left child node, or null/undefined.
   */

  get left(): RedBlackTreeNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Set the left child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New left node, or null/undefined.
   * @returns void
   */

  set left(v: RedBlackTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  _right?: RedBlackTreeNode<K, V> | null | undefined = undefined;

  /**
   * Get the right child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Right child node, or null/undefined.
   */

  get right(): RedBlackTreeNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Set the right child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New right node, or null/undefined.
   * @returns void
   */

  set right(v: RedBlackTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }

  _height: number = 0;

  /**
   * Gets the height of the node (used in self-balancing trees).
   * @remarks Time O(1), Space O(1)
   *
   * @returns The height.
   */
  get height(): number {
    return this._height;
  }

  /**
   * Sets the height of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @param value - The new height.
   */
  set height(value: number) {
    this._height = value;
  }

  _color: RBTNColor = 'BLACK';

  /**
   * Gets the color of the node (used in Red-Black trees).
   * @remarks Time O(1), Space O(1)
   *
   * @returns The node's color.
   */
  get color(): RBTNColor {
    return this._color;
  }

  /**
   * Sets the color of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @param value - The new color.
   */
  set color(value: RBTNColor) {
    this._color = value;
  }

  _count: number = 1;

  /**
   * Gets the count of nodes in the subtree rooted at this node (used in order-statistic trees).
   * @remarks Time O(1), Space O(1)
   *
   * @returns The subtree node count.
   */
  get count(): number {
    return this._count;
  }

  /**
   * Sets the count of nodes in the subtree.
   * @remarks Time O(1), Space O(1)
   *
   * @param value - The new count.
   */
  set count(value: number) {
    this._count = value;
  }

  /**
   * Gets the position of the node relative to its parent.
   * @remarks Time O(1), Space O(1)
   *
   * @returns The family position (e.g., 'ROOT', 'LEFT', 'RIGHT').
   */
  get familyPosition(): FamilyPosition {
    if (!this.parent) {
      return this.left || this.right ? 'ROOT' : 'ISOLATED';
    }

    if (this.parent.left === this) {
      return this.left || this.right ? 'ROOT_LEFT' : 'LEFT';
    } else if (this.parent.right === this) {
      return this.left || this.right ? 'ROOT_RIGHT' : 'RIGHT';
    }

    return 'MAL_NODE';
  }
}

/**
 * Represents a Red-Black Tree (self-balancing BST) supporting map-like mode and stable O(log n) updates.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 * @template R
 * 1. Efficient self-balancing, but not completely balanced. Compared with AVLTree, the addition and deletion efficiency is high, but the query efficiency is slightly lower.
 * 2. It is BST itself. Compared with Heap which is not completely ordered, RedBlackTree is completely ordered.
 *
 * @example
 * // basic Red-Black Tree with simple number keys
 *  // Create a simple Red-Black Tree with numeric keys
 *     const tree = new RedBlackTree([5, 2, 8, 1, 9]);
 *
 *     tree.print();
 *     //   _2___
 *     //  /     \
 *     //  1    _8_
 *     //      /   \
 *     //      5   9
 *
 *     // Verify the tree maintains sorted order
 *     console.log([...tree.keys()]); // [1, 2, 5, 8, 9];
 *
 *     // Check size
 *     console.log(tree.size); // 5;
 * @example
 * // Red-Black Tree with key-value pairs for lookups
 *  interface Employee {
 *       id: number;
 *       name: string;
 *     }
 *
 *     // Create tree with employee data
 *     const employees = new RedBlackTree<number, Employee>([
 *       [1, { id: 1, name: 'Alice' }],
 *       [3, { id: 3, name: 'Charlie' }],
 *       [2, { id: 2, name: 'Bob' }]
 *     ]);
 *
 *     // Retrieve employee by ID
 *     const alice = employees.get(1);
 *     console.log(alice?.name); // 'Alice';
 *
 *     // Verify sorted order by ID
 *     console.log([...employees.keys()]); // [1, 2, 3];
 * @example
 * // Red-Black Tree range search for filtering
 *  interface Product {
 *       name: string;
 *       price: number;
 *     }
 *
 *     const products = new RedBlackTree<number, Product>([
 *       [10, { name: 'Item A', price: 10 }],
 *       [25, { name: 'Item B', price: 25 }],
 *       [40, { name: 'Item C', price: 40 }],
 *       [50, { name: 'Item D', price: 50 }]
 *     ]);
 *
 *     // Find products in price range [20, 45]
 *     const pricesInRange = products.rangeSearch([20, 45], node => {
 *       return products.get(node)?.name;
 *     });
 *
 *     console.log(pricesInRange); // ['Item B', 'Item C'];
 * @example
 * // Red-Black Tree as database index for stock market data
 *  interface StockPrice {
 *       symbol: string;
 *       volume: number;
 *       timestamp: Date;
 *     }
 *
 *     // Simulate real-time stock price index
 *     const priceIndex = new RedBlackTree<number, StockPrice>([
 *       [142.5, { symbol: 'AAPL', volume: 1000000, timestamp: new Date() }],
 *       [335.2, { symbol: 'MSFT', volume: 800000, timestamp: new Date() }],
 *       [3285.04, { symbol: 'AMZN', volume: 500000, timestamp: new Date() }],
 *       [267.98, { symbol: 'META', volume: 750000, timestamp: new Date() }],
 *       [234.57, { symbol: 'GOOGL', volume: 900000, timestamp: new Date() }]
 *     ]);
 *
 *     // Find highest-priced stock
 *     const maxPrice = priceIndex.getRightMost();
 *     console.log(priceIndex.get(maxPrice)?.symbol); // 'AMZN';
 *
 *     // Find stocks in price range [200, 400] for portfolio balancing
 *     const stocksInRange = priceIndex.rangeSearch([200, 400], node => {
 *       const stock = priceIndex.get(node);
 *       return {
 *         symbol: stock?.symbol,
 *         price: node,
 *         volume: stock?.volume
 *       };
 *     });
 *
 *     console.log(stocksInRange.length); // 3;
 *     console.log(stocksInRange.some((s: any) => s.symbol === 'GOOGL')); // true;
 *     console.log(stocksInRange.some((s: any) => s.symbol === 'META')); // true;
 *     console.log(stocksInRange.some((s: any) => s.symbol === 'MSFT')); // true;
 */

export class RedBlackTree<K = any, V = any, R = any> extends BST<K, V, R> implements IBinaryTree<K, V, R> {
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    > = [],
    options?: RedBlackTreeOptions<K, V, R>
  ) {

    super([], options);

    this._root = this.NIL;

    // Header sentinel (js-sdsl style):
    // - header.parent -> root
    // - header.left   -> min
    // - header.right  -> max
    // Not part of the actual tree; used only as an internal cache hub.
    this._header = new RedBlackTreeNode<K, V>(undefined as K, undefined, 'BLACK');
    this._header.parent = this.NIL;
    // Avoid using accessors here: they would set NIL.parent and can corrupt sentinel invariants.
    this._header._left = this.NIL;
    this._header._right = this.NIL;

    if (keysNodesEntriesOrRaws) {
      this.setMany(keysNodesEntriesOrRaws);
    }
  }

  protected override _root: RedBlackTreeNode<K, V> | undefined;

  /**
   * (Internal) Header sentinel (js-sdsl style):
   * - header.parent -> root
   * - header.left   -> min
   * - header.right  -> max
   */
  protected _header: RedBlackTreeNode<K, V>;

  /**
   * (Internal) Cache of the current minimum and maximum nodes.
   * Used for fast-path insert/update when keys are monotonic or near-boundary.
   */
  protected _minNode: RedBlackTreeNode<K, V> | undefined;
  protected _maxNode: RedBlackTreeNode<K, V> | undefined;

  /**
   * Get the current root node.
   * @remarks Time O(1), Space O(1)
   * @returns Root node, or undefined.
   */
  override get root(): RedBlackTreeNode<K, V> | undefined {
    return this._root;
  }

  /**
   * Create a red-black node for the given key/value (value ignored in map mode).
   * @remarks Time O(1), Space O(1)
   * @param key - See parameter type for details.
   * @param [value] - See parameter type for details.
   * @param color - See parameter type for details.
   * @returns A new RedBlackTreeNode instance.
   */
  override createNode(key: K, value?: V, color: RBTNColor = 'BLACK'): RedBlackTreeNode<K, V> {
    return new RedBlackTreeNode<K, V>(key, this._isMapMode ? undefined : value, color);
  }

  /**
   * Type guard: check whether the input is a RedBlackTreeNode.
   * @remarks Time O(1), Space O(1)
   * @param keyNodeOrEntry - See parameter type for details.
   * @returns True if the value is a RedBlackTreeNode.
   */

  override isNode(
    keyNodeOrEntry: K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is RedBlackTreeNode<K, V> {
    return keyNodeOrEntry instanceof RedBlackTreeNode;
  }

  /**
   * Remove all nodes and clear the key→value store (if in map mode).
   * @remarks Time O(n), Space O(1)
   * @returns void
   */

  override clear() {
    super.clear();
    this._root = this.NIL;
    this._header.parent = this.NIL;
    this._setMinCache(undefined);
    this._setMaxCache(undefined);
  }


  /**
   * (Internal) Find a node by key using a tight BST walk (no allocations).
   * @remarks Time O(log n), Space O(1)
   */
  protected _findNodeByKey(key: K): RedBlackTreeNode<K, V> | undefined {
    const NIL = this.NIL;
    const cmp = this._compare.bind(this);

    let cur = (this._header.parent) ?? NIL;
    while (cur !== NIL) {
      const c = cmp(key, cur.key);
      if (c < 0) cur = cur.left ?? NIL;
      else if (c > 0) cur = cur.right ?? NIL;
      else return cur;
    }
    return undefined;
  }

  /**
   * (Internal) In-order predecessor of a node in a BST.
   * @remarks Time O(H)
   */
  protected _predecessorOf(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> | undefined {
    const NIL = this.NIL;
    if (node.left && node.left !== NIL) {
      let cur = node.left;
      while (cur.right && cur.right !== NIL) cur = cur.right;
      return cur;
    }
    let cur: RedBlackTreeNode<K, V> | undefined = node;
    let p = node.parent;
    while (p && cur === p.left) {
      cur = p;
      p = p.parent;
    }
    return p;
  }

  /**
   * (Internal) In-order successor of a node in a BST.
   * @remarks Time O(H)
   */
  protected _successorOf(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> | undefined {
    const NIL = this.NIL;
    if (node.right && node.right !== NIL) {
      let cur = node.right;
      while (cur.left && cur.left !== NIL) cur = cur.left;
      return cur;
    }
    let cur: RedBlackTreeNode<K, V> | undefined = node;
    let p = node.parent;
    while (p && cur === p.right) {
      cur = p;
      p = p.parent;
    }
    return p;
  }

  /**
   * (Internal) Attach a new node directly under a known parent/side (no search).
   */
  protected _attachNewNode(parent: RedBlackTreeNode<K, V>, side: 'left' | 'right', node: RedBlackTreeNode<K, V>): void {
    const NIL = this.NIL;
    node.parent = parent;
    if (side === 'left') parent.left = node;
    else parent.right = node;
    node.left = NIL;
    node.right = NIL;
    node.color = 'RED';
    this._insertFixup(node);
    if (this.isRealNode(this._root)) this._root.color = 'BLACK';
  }

  /**
   * (Internal) a single source of truth for min/max is header.left/right.
   * Keep legacy _minNode/_maxNode mirrored for compatibility.
   */
  protected _setMinCache(node: RedBlackTreeNode<K, V> | undefined): void {
    this._minNode = node;
    this._header._left = node ?? this.NIL;
  }

  protected _setMaxCache(node: RedBlackTreeNode<K, V> | undefined): void {
    this._maxNode = node;
    this._header._right = node ?? this.NIL;
  }

  protected _setKVNode(key: K, nextValue?: V): { node: RedBlackTreeNode<K, V>; created: boolean } | undefined {
    const NIL = this.NIL;
    const comparator = this._comparator;

    // Min/max fast paths (inspired by js-sdsl):
    // Read via header to avoid undefined checks (header uses NIL when empty).
    const header = this._header;
    const minN = header._left ?? NIL;
    if (minN !== NIL) {
      const cMin = comparator(key, minN.key);
      if (cMin === 0) {
        if (this._isMapMode) {
          if (nextValue !== undefined) this._store.set(key, nextValue);
          else this._setValue(key, nextValue);
        } else minN.value = nextValue as V;
        return { node: minN, created: false };
      }
      // Boundary attach: if key is smaller than current min and min has no left child.
      // Inline NIL/null/undefined check to avoid isRealNode overhead on hot path.
      const minL = minN.left;
      if (cMin < 0 && (minL === NIL || minL === null || minL === undefined)) {
        const newNode = this.createNode(key, nextValue);
        this._attachNewNode(minN, 'left', newNode);
        if (this._isMapMode) {
          if (nextValue !== undefined) this._store.set(newNode.key, nextValue);
          else this._setValue(newNode.key, nextValue);
        }
        this._size++;
        this._setMinCache(newNode);
        // If max is not initialized yet (tree had 0/1 nodes), mirror max too.
        if (header._right  === NIL) this._setMaxCache(newNode);
        return { node: newNode, created: true };
      }

      // Only touch max when key is not less than min.
      if (cMin > 0) {
        const maxN = header._right ?? NIL;
        // Boundary attach: if key is greater than current max and max has no right child.
        const cMax = comparator(key, maxN.key);
        if (cMax === 0) {
          if (this._isMapMode) {
            if (nextValue !== undefined) this._store.set(key, nextValue);
            else this._setValue(key, nextValue);
          } else maxN.value = nextValue as V;
          return { node: maxN, created: false };
        }
        const maxR = maxN.right;
        if (cMax > 0 && (maxR === NIL || maxR === null || maxR === undefined)) {
          const newNode = this.createNode(key, nextValue);
          this._attachNewNode(maxN, 'right', newNode);
          if (this._isMapMode) {
            if (nextValue !== undefined) this._store.set(newNode.key, nextValue);
            else this._setValue(newNode.key, nextValue);
          }
          this._size++;
          this._setMaxCache(newNode);
          if (header._left === NIL) this._setMinCache(newNode);
          return { node: newNode, created: true };
        }
      }
    }

    // Normal path: single-pass search + insert/update (avoid double-walking the tree).
    const cmp = comparator;
    const isMapMode = this._isMapMode;
    const store = this._store;
    let current = this._header.parent ?? NIL;
    let parent: RedBlackTreeNode<K, V> | undefined;
    let lastCompared = 0;

    while (current !== NIL) {
      parent = current;
      lastCompared = cmp(key, current.key);
      if (lastCompared < 0) current = current.left ?? NIL;
      else if (lastCompared > 0) current = current.right ?? NIL;
      else {
        // Update existing.
        if (isMapMode) {
          if (nextValue !== undefined) store.set(key, nextValue);
          else this._setValue(key, nextValue);
        } else {
          current.value = nextValue as V;
        }
        return { node: current, created: false };
      }
    }

    // Insert new.
    const newNode = this.createNode(key, nextValue);
    // createNode always returns a real node in RedBlackTree.
    newNode.parent = parent;

    if (!parent) {
      this._setRoot(newNode);
    } else if (lastCompared < 0) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    newNode.left = NIL;
    newNode.right = NIL;
    newNode.color = 'RED';

    this._insertFixup(newNode);
    if (this.isRealNode(this._root)) this._root.color = 'BLACK';
    else return undefined;

    if (isMapMode) {
      if (nextValue !== undefined) store.set(newNode.key, nextValue);
      else this._setValue(newNode.key, nextValue);
    }
    this._size++;

    // Maintain min/max caches on insertion (header.left/right are canonical).
    const hMin = this._header._left ?? NIL;
    const hMax = this._header._right ?? NIL;

    // Fast-path: empty tree or attaching directly to an extreme.
    if (hMin === NIL || hMax === NIL) {
      this._setMinCache(newNode);
      this._setMaxCache(newNode);
    } else if (parent === hMax && lastCompared > 0) {
      this._setMaxCache(newNode);
    } else if (parent === hMin && lastCompared < 0) {
      this._setMinCache(newNode);
    } else {
      if (cmp(newNode.key, hMin.key) < 0) this._setMinCache(newNode);
      if (cmp(newNode.key, hMax.key) > 0) this._setMaxCache(newNode);
    }

    return { node: newNode, created: true };
  }

  protected _setKV(key: K, nextValue?: V): boolean {
    // mapMode update fast-path:
    // If the key already exists, updating the value doesn't require any tree work.
    // (Tree structure depends only on key.)
    if (this._isMapMode && nextValue !== undefined) {
      const store = this._store;
      if (store.has(key )) {
        store.set(key , nextValue );
        return true;
      }
    }

    return this._setKVNode(key, nextValue) !== undefined;
  }

  /**
   * Insert/update using a hint node to speed up near-by insertions.
   * Falls back to normal set on mismatch.
   * @returns The affected node (inserted or updated), or undefined on failure.
   */
  setWithHintNode(key: K, value: V, hint?: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> | undefined {
    if (!hint || !this.isRealNode(hint)) {
      return this._setKVNode(key, value)?.node;
    }

    const cmp = this._compare.bind(this);
    const c0 = cmp(key, hint.key);
    if (c0 === 0) {
      if (this._isMapMode) {
        if (value !== undefined) this._store.set(key , value );
        else this._setValue(key, value);
      } else hint.value = value;
      return hint;
    }

    if (c0 < 0) {
      // Ultra-fast path: direct attach if the target slot is empty.
      if (!this.isRealNode(hint.left)) {
        const newNode = this.createNode(key, value);
        if (!this.isRealNode(newNode)) return undefined;
        this._attachNewNode(hint, 'left', newNode);
        if (this._isMapMode) {
          if (value !== undefined) this._store.set(key , value );
          else this._setValue(key, value);
        }
        this._size++;
        // Maintain header/min/max caches.
        const NIL = this.NIL;
        const hMin = this._header._left ?? NIL;
        if (hMin === NIL || this._compare(newNode.key, hMin.key) < 0) this._setMinCache(newNode);
        const hMax = this._header._right ?? NIL;
        if (hMax === NIL || this._compare(newNode.key, hMax.key) > 0) this._setMaxCache(newNode);
        return newNode;
      }

      const pred = this._predecessorOf(hint);
      if (pred && cmp(pred.key, key) >= 0) {
        return this._setKVNode(key, value)?.node;
      }

      // Try attach as right of pred.
      if (pred && !this.isRealNode(pred.right)) {
        const newNode = this.createNode(key, value);
        if (!this.isRealNode(newNode)) return undefined;
        this._attachNewNode(pred, 'right', newNode);
        if (this._isMapMode) {
          if (value !== undefined) this._store.set(key , value );
          else this._setValue(key, value);
        }
        this._size++;
        // Maintain header/min/max caches.
        const NIL = this.NIL;
        const hMin = this._header._left ?? NIL;
        if (hMin === NIL || this._compare(newNode.key, hMin.key) < 0) this._setMinCache(newNode);
        const hMax = this._header._right ?? NIL;
        if (hMax === NIL || this._compare(newNode.key, hMax.key) > 0) this._setMaxCache(newNode);
        return newNode;
      }

      return this._setKVNode(key, value)?.node;
    }

    // c0 > 0
    // Ultra-fast path: direct attach if the target slot is empty.
    if (!this.isRealNode(hint.right)) {
      const newNode = this.createNode(key, value);
      if (!this.isRealNode(newNode)) return undefined;
      this._attachNewNode(hint, 'right', newNode);
      if (this._isMapMode) {
        if (value !== undefined) this._store.set(key , value );
        else this._setValue(key, value);
      }
      this._size++;
      // Maintain header/min/max caches.
      const NIL = this.NIL;
      const hMin = this._header._left ?? NIL;
      if (hMin === NIL || this._compare(newNode.key, hMin.key) < 0) this._setMinCache(newNode);
      const hMax = this._header._right ?? NIL;
      if (hMax === NIL || this._compare(newNode.key, hMax.key) > 0) this._setMaxCache(newNode);
      return newNode;
    }

    const succ = this._successorOf(hint);
    if (succ && cmp(succ.key, key) <= 0) {
      return this._setKVNode(key, value)?.node;
    }

    if (succ && !this.isRealNode(succ.left)) {
      const newNode = this.createNode(key, value);
      if (!this.isRealNode(newNode)) return undefined;
      this._attachNewNode(succ, 'left', newNode);
      if (this._isMapMode) {
        if (value !== undefined) this._store.set(key , value );
        else this._setValue(key, value);
      }
      this._size++;
      // Maintain header/min/max caches.
      const NIL = this.NIL;
      const hMin = this._header._left ?? NIL;
      if (hMin === NIL || this._compare(newNode.key, hMin.key) < 0) this._setMinCache(newNode);
      const hMax = this._header._right ?? NIL;
      if (hMax === NIL || this._compare(newNode.key, hMax.key) > 0) this._setMaxCache(newNode);
      return newNode;
    }

    return this._setKVNode(key, value)?.node;
  }

  /**
   * Boolean wrapper for setWithHintNode.
   */
  setWithHint(key: K, value: V, hint?: RedBlackTreeNode<K, V>): boolean {
    return this.setWithHintNode(key, value, hint) !== undefined;
  }

  override set(
    keyNodeOrEntry: K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): boolean {
    // Common path: tree.set(key, value) or tree.set([key, value]).
    if (!this.isNode(keyNodeOrEntry)) {
      if (keyNodeOrEntry === null || keyNodeOrEntry === undefined) return false;

      if (this.isEntry(keyNodeOrEntry)) {
        const key = keyNodeOrEntry[0];
        if (key === null || key === undefined) return false;
        const nextValue = value ?? keyNodeOrEntry[1];
        return this._setKV(key, nextValue);
      }

      // key-only
      return this._setKV(keyNodeOrEntry, value);
    }

    // Node insertion path (advanced usage)
    const [newNode, newValue] = this._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value);
    if (!this.isRealNode(newNode)) return false;

    const insertStatus = this._insert(newNode);

    if (insertStatus === 'CREATED') {
      if (this.isRealNode(this._root)) {
        this._root.color = 'BLACK';
      } else {
        return false;
      }
      if (this._isMapMode) this._setValue(newNode.key, newValue);
      this._size++;
      return true;
    }
    if (insertStatus === 'UPDATED') {
      if (this._isMapMode) this._setValue(newNode.key, newValue);
      return true;
    }
    return false;
  }

  /**
   * Delete a node by key/node/entry and rebalance as needed.
   * @remarks Time O(log n), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, value] entry identifying the node to delete.
   * @returns Array with deletion metadata (removed node, rebalancing hint if any).
   */
  override delete(
    keyNodeOrEntry: K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): BinaryTreeDeleteResult<RedBlackTreeNode<K, V>>[] {
    if (keyNodeOrEntry === null) return [];

    const results: BinaryTreeDeleteResult<RedBlackTreeNode<K, V>>[] = [];
    let nodeToDelete: OptNode<RedBlackTreeNode<K, V>>;
    if (this._isPredicate(keyNodeOrEntry)) nodeToDelete = this.getNode(keyNodeOrEntry);
    else nodeToDelete = this.isRealNode(keyNodeOrEntry) ? keyNodeOrEntry : this.getNode(keyNodeOrEntry);

    if (!nodeToDelete) {
      return results;
    }

    // Track min/max cache updates before structural modifications.
    const willDeleteMin = nodeToDelete === this._minNode;
    const willDeleteMax = nodeToDelete === this._maxNode;
    const nextMin = willDeleteMin ? this._successorOf(nodeToDelete) : undefined;
    const nextMax = willDeleteMax ? this._predecessorOf(nodeToDelete) : undefined;

    let originalColor = nodeToDelete.color;
    let replacementNode: RedBlackTreeNode<K, V> | undefined;

    if (!this.isRealNode(nodeToDelete.left)) {
      if (nodeToDelete.right !== null) {
        replacementNode = nodeToDelete.right;
        this._transplant(nodeToDelete, nodeToDelete.right);
      }
    } else if (!this.isRealNode(nodeToDelete.right)) {
      replacementNode = nodeToDelete.left;
      this._transplant(nodeToDelete, nodeToDelete.left);
    } else {
      const successor = this.getLeftMost(node => node, nodeToDelete.right);
      if (successor) {
        originalColor = successor.color;
        if (successor.right !== null) replacementNode = successor.right;

        if (successor.parent === nodeToDelete) {
          if (this.isRealNode(replacementNode)) {
            replacementNode.parent = successor;
          }
        } else {
          if (successor.right !== null) {
            this._transplant(successor, successor.right);
            successor.right = nodeToDelete.right;
          }
          if (this.isRealNode(successor.right)) {
            successor.right.parent = successor;
          }
        }

        this._transplant(nodeToDelete, successor);
        successor.left = nodeToDelete.left;
        if (this.isRealNode(successor.left)) {
          successor.left.parent = successor;
        }
        successor.color = nodeToDelete.color;
      }
    }
    if (this._isMapMode) this._store.delete(nodeToDelete.key);
    this._size--;

    // Update min/max caches.
    if (this._size <= 0) {
      this._setMinCache(undefined);
      this._setMaxCache(undefined);
    } else {
      if (willDeleteMin) this._setMinCache(nextMin);
      if (willDeleteMax) this._setMaxCache(nextMax);
      // Fallback if successor/predecessor was unavailable.
      if (!this._minNode || !this.isRealNode(this._minNode)) {
        this._setMinCache(this.isRealNode(this._root) ? this.getLeftMost(n => n, this._root) : undefined);
      }
      if (!this._maxNode || !this.isRealNode(this._maxNode)) {
        this._setMaxCache(this.isRealNode(this._root) ? this.getRightMost(n => n, this._root) : undefined);
      }
    }

    if (originalColor === 'BLACK') {
      this._deleteFixup(replacementNode);
    }

    results.push({ deleted: nodeToDelete, needBalanced: undefined });

    return results;
  }

  /**
   * Transform entries into a like-kind red-black tree with possibly different key/value types.
   * @remarks Time O(n), Space O(n)
   * @template MK
   * @template MV
   * @template MR
   * @param callback - Mapping function from (key, value, index, tree) to a new [key, value].
   * @param [options] - See parameter type for details.
   * @param [thisArg] - See parameter type for details.
   * @returns A new RedBlackTree with mapped entries.
   */
  override map<MK = K, MV = V, MR = any>(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: Partial<RedBlackTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): RedBlackTree<MK, MV, MR> {
    const out = this._createLike<MK, MV, MR>([], options);

    let index = 0;
    for (const [key, value] of this) {
      out.set(callback.call(thisArg, value, key, index++, this));
    }
    return out;
  }

  protected override _createInstance<TK = K, TV = V, TR = R>(options?: Partial<RedBlackTreeOptions<TK, TV, TR>>): this {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | RedBlackTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: RedBlackTreeOptions<TK, TV, TR>
    ) => RedBlackTree<TK, TV, TR>;
    return new Ctor([], { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) }) as unknown as this;
  }

  protected override _createLike<TK = K, TV = V, TR = R>(
    iter: Iterable<
      TK | RedBlackTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR
    > = [],
    options?: Partial<RedBlackTreeOptions<TK, TV, TR>>
  ): RedBlackTree<TK, TV, TR> {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | RedBlackTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: RedBlackTreeOptions<TK, TV, TR>
    ) => RedBlackTree<TK, TV, TR>;
    return new Ctor(iter, { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) });
  }

  protected override _setRoot(v: RedBlackTreeNode<K, V> | undefined) {
    const NIL = this.NIL;
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
    // Keep header root pointer in sync even for internal operations (rotations/transplants)
    // and for subclasses that may bypass _setKVNode.
    this._header.parent = v ?? NIL;
  }

  protected override _replaceNode(
    oldNode: RedBlackTreeNode<K, V>,
    newNode: RedBlackTreeNode<K, V>
  ): RedBlackTreeNode<K, V> {
    newNode.color = oldNode.color;

    return super._replaceNode(oldNode, newNode);
  }

  /**
   * (Protected) Standard BST insert followed by red-black fix-up.
   * @remarks Time O(log n), Space O(1)
   * @param node - Node to insert.
   * @returns Status string: 'CREATED' or 'UPDATED'.
   */
  protected _insert(node: RedBlackTreeNode<K, V>): CRUD {
    const NIL = this.NIL;
    const cmp = this._compare.bind(this);

    let current = this._header.parent ?? NIL;
    let parent: RedBlackTreeNode<K, V> | undefined;
    let lastCompared = 0;

    while (current !== NIL) {
      parent = current;
      lastCompared = cmp(node.key, current.key);
      if (lastCompared < 0) {
        current = current.left ?? NIL;
      } else if (lastCompared > 0) {
        current = current.right ?? NIL;
      } else {
        this._replaceNode(current, node);
        return 'UPDATED';
      }
    }

    node.parent = parent;

    if (!parent) {
      this._setRoot(node);
    } else if (lastCompared < 0) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    node.left = NIL;
    node.right = NIL;
    node.color = 'RED';

    this._insertFixup(node);
    return 'CREATED';
  }

  /**
   * (Protected) Transplant a subtree in place of another during deletion.
   * @remarks Time O(1), Space O(1)
   * @param u - Node to replace.
   * @param v - Replacement subtree root (may be undefined).
   * @returns void
   */
  protected _transplant(u: RedBlackTreeNode<K, V>, v: RedBlackTreeNode<K, V> | undefined): void {
    if (!u.parent) {
      this._setRoot(v);
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }

    if (v) {
      v.parent = u.parent;
    }
  }

  /**
   * (Protected) Restore red-black properties after insertion (recolor/rotate).
   * @remarks Time O(log n), Space O(1)
   * @param z - Recently inserted node.
   * @returns void
   */
  protected _insertFixup(z: RedBlackTreeNode<K, V> | undefined): void {
    const leftRotate = this._leftRotate.bind(this);
    const rightRotate = this._rightRotate.bind(this);

    while (z) {
      const p = z.parent;
      if (!p || p.color !== 'RED') break;

      const gp = p.parent;
      if (!gp) break;

      if (p === gp.left) {
        const y = gp.right;
        if (y?.color === 'RED') {
          p.color = 'BLACK';
          y.color = 'BLACK';
          gp.color = 'RED';
          z = gp;
          continue;
        }

        if (z === p.right) {
          z = p;
          leftRotate(z);
        }

        const p2 = z?.parent;
        const gp2 = p2?.parent;
        if (p2 && gp2) {
          p2.color = 'BLACK';
          gp2.color = 'RED';
          rightRotate(gp2);
        }
      } else {
        const y = gp.left;
        if (y?.color === 'RED') {
          p.color = 'BLACK';
          y.color = 'BLACK';
          gp.color = 'RED';
          z = gp;
          continue;
        }

        if (z === p.left) {
          z = p;
          rightRotate(z);
        }

        const p2 = z?.parent;
        const gp2 = p2?.parent;
        if (p2 && gp2) {
          p2.color = 'BLACK';
          gp2.color = 'RED';
          leftRotate(gp2);
        }
      }

      break;
    }

    if (this.isRealNode(this._root)) this._root.color = 'BLACK';
  }

  /**
   * (Protected) Restore red-black properties after deletion (recolor/rotate).
   * @remarks Time O(log n), Space O(1)
   * @param node - Child that replaced the deleted node (may be undefined).
   * @returns void
   */
  protected _deleteFixup(node: RedBlackTreeNode<K, V> | undefined): void {
    if (!node || node === this.root || node.color === 'BLACK') {
      if (node) {
        node.color = 'BLACK';
      }
      return;
    }

    while (node && node !== this.root && node.color === 'BLACK') {
      const parent: RedBlackTreeNode<K, V> | undefined = node.parent;

      if (!parent) {
        break;
      }

      if (node === parent.left) {
        let sibling = parent.right;

        if (sibling?.color === 'RED') {
          sibling.color = 'BLACK';
          parent.color = 'RED';
          this._leftRotate(parent);
          sibling = parent.right;
        }

        if ((sibling?.left?.color ?? 'BLACK') === 'BLACK') {
          if (sibling) sibling.color = 'RED';
          node = parent;
        } else {
          if (sibling?.left) sibling.left.color = 'BLACK';
          if (sibling) sibling.color = parent.color;
          parent.color = 'BLACK';
          this._rightRotate(parent);
          node = this.root;
        }
      } else {
        let sibling = parent.left;

        if (sibling?.color === 'RED') {
          sibling.color = 'BLACK';
          if (parent) parent.color = 'RED';
          this._rightRotate(parent);
          if (parent) sibling = parent.left;
        }

        if ((sibling?.right?.color ?? 'BLACK') === 'BLACK') {
          if (sibling) sibling.color = 'RED';
          node = parent;
        } else {
          if (sibling?.right) sibling.right.color = 'BLACK';
          if (sibling) sibling.color = parent.color;
          if (parent) parent.color = 'BLACK';
          this._leftRotate(parent);
          node = this.root;
        }
      }
    }

    if (node) {
      node.color = 'BLACK';
    }
  }

  /**
   * (Protected) Perform a left rotation around x.
   * @remarks Time O(1), Space O(1)
   * @param x - Pivot node to rotate around.
   * @returns void
   */
  protected _leftRotate(x: RedBlackTreeNode<K, V> | undefined): void {
    if (!x || !x.right) {
      return;
    }

    const y = x.right;
    x.right = y.left;

    if (y.left && y.left !== this.NIL) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (!x.parent) {
      this._setRoot(y);
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  /**
   * (Protected) Perform a right rotation around y.
   * @remarks Time O(1), Space O(1)
   * @param y - Pivot node to rotate around.
   * @returns void
   */
  protected _rightRotate(y: RedBlackTreeNode<K, V> | undefined): void {
    if (!y || !y.left) {
      return;
    }

    const x = y.left;
    y.left = x.right;

    if (x.right && x.right !== this.NIL) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (!y.parent) {
      this._setRoot(x);
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    x.right = y;
    y.parent = x;
  }
}
