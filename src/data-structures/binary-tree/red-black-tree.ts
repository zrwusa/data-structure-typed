/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  BinaryTreeDeleteResult,
  BinaryTreeOptions,
  CRUD,
  EntryCallback,
  OptNode,
  RBTNColor,
  RedBlackTreeOptions
} from '../../types';
import { BST, BSTNode } from './bst';
import { IBinaryTree } from '../../interfaces';

export class RedBlackTreeNode<K = any, V = any> extends BSTNode<K, V> {
  override parent?: RedBlackTreeNode<K, V> = undefined;

  /**
   * Create a Red-Black Tree and optionally bulk-insert items.
   * @remarks Time O(n log n), Space O(n)
   * @param key - See parameter type for details.
   * @param [value]- See parameter type for details.
   * @param color - See parameter type for details.
   * @returns New RedBlackTree instance.
   */

  constructor(key: K, value?: V, color: RBTNColor = 'BLACK') {
    super(key, value);
    this._color = color;
  }

  override _left?: RedBlackTreeNode<K, V> | null | undefined = undefined;

  /**
   * Get the left child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Left child node, or null/undefined.
   */

  override get left(): RedBlackTreeNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Set the left child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New left node, or null/undefined.
   * @returns void
   */

  override set left(v: RedBlackTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: RedBlackTreeNode<K, V> | null | undefined = undefined;

  /**
   * Get the right child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Right child node, or null/undefined.
   */

  override get right(): RedBlackTreeNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Set the right child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New right node, or null/undefined.
   * @returns void
   */

  override set right(v: RedBlackTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 * Represents a Red-Black Tree (self-balancing BST) supporting map-like mode and stable O(log n) updates.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 * @template R
 * 1. Efficient self-balancing, but not completely balanced. Compared with AVLTree, the addition and deletion efficiency is high but the query efficiency is slightly lower.
 * 2. It is BST itself. Compared with Heap which is not completely ordered, RedBlackTree is completely ordered.
 * @example
 * // using Red-Black Tree as a price-based index for stock data
 *     // Define the structure of individual stock records
 *     interface StockRecord {
 *       price: number; // Stock price (key for indexing)
 *       symbol: string; // Stock ticker symbol
 *       volume: number; // Trade volume
 *     }
 *
 *     // Simulate stock market data as it might come from an external feed
 *     const marketStockData: StockRecord[] = [
 *       { price: 142.5, symbol: 'AAPL', volume: 1000000 },
 *       { price: 335.2, symbol: 'MSFT', volume: 800000 },
 *       { price: 3285.04, symbol: 'AMZN', volume: 500000 },
 *       { price: 267.98, symbol: 'META', volume: 750000 },
 *       { price: 234.57, symbol: 'GOOGL', volume: 900000 }
 *     ];
 *
 *     // Extend the stock record type to include metadata for database usage
 *     type StockTableRecord = StockRecord & { lastUpdated: Date };
 *
 *     // Create a Red-Black Tree to index stock records by price
 *     // Simulates a database index with stock price as the key for quick lookups
 *     const priceIndex = new RedBlackTree<number, StockTableRecord, StockRecord>(marketStockData, {
 *       toEntryFn: stockRecord => [
 *         stockRecord.price, // Use stock price as the key
 *         {
 *           ...stockRecord,
 *           lastUpdated: new Date() // Add a timestamp for when the record was indexed
 *         }
 *       ]
 *     });
 *
 *     // Query the stock with the highest price
 *     const highestPricedStock = priceIndex.getRightMost();
 *     console.log(priceIndex.get(highestPricedStock)?.symbol); // 'AMZN' // Amazon has the highest price
 *
 *     // Query stocks within a specific price range (200 to 400)
 *     const stocksInRange = priceIndex.rangeSearch(
 *       [200, 400], // Price range
 *       node => priceIndex.get(node)?.symbol // Extract stock symbols for the result
 *     );
 *     console.log(stocksInRange); // ['GOOGL', 'META', 'MSFT']
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

    if (keysNodesEntriesOrRaws) {
      this.addMany(keysNodesEntriesOrRaws);
    }
  }

  protected override _root: RedBlackTreeNode<K, V> | undefined;

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
  }

  /**
   * Insert or replace an entry using BST order and red-black fix-up.
   * @remarks Time O(log n), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, value] entry to insert.
   * @param [value]- See parameter type for details.
   * @returns True if inserted or updated; false if ignored.
   */
  override add(
    keyNodeOrEntry: K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): boolean {
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
    options?: Partial<BinaryTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): RedBlackTree<MK, MV, MR> {
    const out = this._createLike<MK, MV, MR>([], options);

    let index = 0;
    for (const [key, value] of this) {
      out.add(callback.call(thisArg, key, value, index++, this));
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
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
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
    let current = this.root;
    let parent: RedBlackTreeNode<K, V> | undefined = undefined;

    while (this.isRealNode(current)) {
      parent = current;
      const compared = this._compare(node.key, current.key);
      if (compared < 0) {
        current = current.left ?? this.NIL;
      } else if (compared > 0) {
        current = current.right ?? this.NIL;
      } else {
        this._replaceNode(current, node);
        return 'UPDATED';
      }
    }

    node.parent = parent;

    if (!parent) {
      this._setRoot(node);
    } else if (this._compare(node.key, parent.key) < 0) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    node.left = this.NIL;
    node.right = this.NIL;
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
    while (z?.parent?.color === 'RED') {
      if (z.parent === z.parent.parent?.left) {
        const y = z.parent.parent.right;
        if (y?.color === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          z.parent.parent.color = 'RED';

          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this._leftRotate(z);
          }

          if (z && this.isRealNode(z.parent) && this.isRealNode(z.parent.parent)) {
            z.parent.color = 'BLACK';
            z.parent.parent.color = 'RED';
            this._rightRotate(z.parent.parent);
          }
        }
      } else {
        const y: RedBlackTreeNode<K, V> | undefined = z?.parent?.parent?.left ?? undefined;
        if (y?.color === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          z.parent.parent!.color = 'RED';
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this._rightRotate(z);
          }

          if (z && this.isRealNode(z.parent) && this.isRealNode(z.parent.parent)) {
            z.parent.color = 'BLACK';
            z.parent.parent.color = 'RED';
            this._leftRotate(z.parent.parent);
          }
        }
      }
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

    if (this.isRealNode(y.left)) {
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

    if (this.isRealNode(x.right)) {
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
