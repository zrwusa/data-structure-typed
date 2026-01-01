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
  BSTNOptKeyOrNode,
  EntryCallback,
  IterationType,
  OptNode,
  RBTNColor,
  TreeCounterOptions
} from '../../types';
import { BSTOptions } from '../../types';
import { BSTNode } from './bst';
import { IBinaryTree } from '../../interfaces';
import { RedBlackTree, RedBlackTreeNode } from './red-black-tree';

/**
 * RB-tree node with an extra 'count' field; keeps parent/child links.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 */
export class TreeCounterNode<K = any, V = any> extends RedBlackTreeNode<K, V> {
  override parent?: TreeCounterNode<K, V> = undefined;

  /**
   * Create a tree counter node.
   * @remarks Time O(1), Space O(1)
   * @param key - Key of the node.
   * @param [value] - Value associated with the key (ignored in map mode).
   * @param [count] - Initial count for this node (default 1).
   * @param color - Initial color ('RED' or 'BLACK').
   * @returns New TreeCounterNode instance.
   */
  constructor(key: K, value?: V, count = 1, color: RBTNColor = 'BLACK') {
    super(key, value, color);
    this.count = count;
  }

  override _left?: TreeCounterNode<K, V> | null | undefined = undefined;

  /**
   * Get the left child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Left child node, or null/undefined.
   */
  override get left(): TreeCounterNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Set the left child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New left child node, or null/undefined.
   * @returns void
   */
  override set left(v: TreeCounterNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: TreeCounterNode<K, V> | null | undefined = undefined;

  /**
   * Get the right child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Right child node, or null/undefined.
   */
  override get right(): TreeCounterNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Set the right child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New right child node, or null/undefined.
   * @returns void
   */
  override set right(v: TreeCounterNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 * Red-Black Tree–based counter map (key → value with per-node count). Supports O(log N) updates and map-like mode.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 * @template R
 */
export class TreeCounter<K = any, V = any, R = any> extends RedBlackTree<K, V, R> implements IBinaryTree<K, V, R> {
  /**
   * Create a TreeCounter and optionally bulk-insert items.
   * @remarks Time O(N log N), Space O(N)
   * @param [keysNodesEntriesOrRaws] - Iterable of keys/nodes/entries/raw items to insert.
   * @param [options] - Options for TreeCounter (comparator, reverse, map mode).
   * @returns New TreeCounter instance.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | TreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    > = [],
    options?: TreeCounterOptions<K, V, R>
  ) {
    super([], options);
    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
  }

  protected _count = 0;

  /**
   * Get the total aggregate count across all nodes.
   * @remarks Time O(1), Space O(1)
   * @returns Total count.
   */

  get count(): number {
    return this._count;
  }

  /**
   * Compute the total count by traversing the tree (sums node.count).
   * @remarks Time O(N), Space O(H)
   * @returns Total count recomputed from nodes.
   */

  getComputedCount(): number {
    let sum = 0;
    this.dfs(node => (sum += node ? node.count : 0));
    return sum;
  }

  override createNode(key: K, value?: V, color: RBTNColor = 'BLACK', count?: number): TreeCounterNode<K, V> {
    return new TreeCounterNode(key, this._isMapMode ? undefined : value, count, color) as TreeCounterNode<K, V>;
  }

  /**
   * Type guard: check whether the input is a TreeCounterNode.
   * @remarks Time O(1), Space O(1)
   * @returns True if the value is a TreeCounterNode.
   */

  override isNode(
    keyNodeOrEntry: K | TreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is TreeCounterNode<K, V> {
    return keyNodeOrEntry instanceof TreeCounterNode;
  }

  /**
   * Insert or increment a node and update aggregate count.
   * @remarks Time O(log N), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, value] entry to insert.
   * @param [value] - Value when a bare key is provided (ignored in map mode).
   * @param [count] - How much to increase the node's count (default 1).
   * @returns True if inserted/updated; false if ignored.
   */
  override add(
    keyNodeOrEntry: K | TreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V,
    count = 1
  ): boolean {
    const [newNode, newValue] = this._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value, count);
    const orgCount = newNode?.count || 0;
    const isSuccessAdded = super.add(newNode, newValue);
    if (isSuccessAdded) {
      this._count += orgCount;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Delete a node (or decrement its count) and rebalance if needed.
   * @remarks Time O(log N), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, value] entry identifying the node.
   * @param [ignoreCount] - If true, remove the node regardless of its count.
   * @returns Array of deletion results including deleted node and a rebalance hint when present.
   */
  override delete(
    keyNodeOrEntry: K | TreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    ignoreCount = false
  ): BinaryTreeDeleteResult<TreeCounterNode<K, V>>[] {
    if (keyNodeOrEntry === null) return [];

    const results: BinaryTreeDeleteResult<TreeCounterNode<K, V>>[] = [];

    let nodeToDelete: OptNode<TreeCounterNode<K, V>>;
    if (this._isPredicate(keyNodeOrEntry)) nodeToDelete = this.getNode(keyNodeOrEntry);
    else nodeToDelete = this.isRealNode(keyNodeOrEntry) ? keyNodeOrEntry : this.getNode(keyNodeOrEntry);
    if (!nodeToDelete) {
      return results;
    }

    let originalColor = nodeToDelete.color;
    let replacementNode: TreeCounterNode<K, V> | undefined;

    if (!this.isRealNode(nodeToDelete.left)) {
      if (nodeToDelete.right !== null) replacementNode = nodeToDelete.right;
      if (ignoreCount || nodeToDelete.count <= 1) {
        if (nodeToDelete.right !== null) {
          this._transplant(nodeToDelete, nodeToDelete.right);
          this._count -= nodeToDelete.count;
        }
      } else {
        nodeToDelete.count--;
        this._count--;
        results.push({ deleted: nodeToDelete, needBalanced: undefined });
        return results;
      }
    } else if (!this.isRealNode(nodeToDelete.right)) {
      replacementNode = nodeToDelete.left;
      if (ignoreCount || nodeToDelete.count <= 1) {
        this._transplant(nodeToDelete, nodeToDelete.left);
        this._count -= nodeToDelete.count;
      } else {
        nodeToDelete.count--;
        this._count--;
        results.push({ deleted: nodeToDelete, needBalanced: undefined });
        return results;
      }
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
          if (ignoreCount || nodeToDelete.count <= 1) {
            if (successor.right !== null) {
              this._transplant(successor, successor.right);
              this._count -= nodeToDelete.count;
            }
          } else {
            nodeToDelete.count--;
            this._count--;
            results.push({ deleted: nodeToDelete, needBalanced: undefined });
            return results;
          }
          successor.right = nodeToDelete.right;
          if (this.isRealNode(successor.right)) {
            successor.right.parent = successor;
          }
        }
        if (ignoreCount || nodeToDelete.count <= 1) {
          this._transplant(nodeToDelete, successor);
          this._count -= nodeToDelete.count;
        } else {
          nodeToDelete.count--;
          this._count--;
          results.push({ deleted: nodeToDelete, needBalanced: undefined });
          return results;
        }
        successor.left = nodeToDelete.left;
        if (this.isRealNode(successor.left)) {
          successor.left.parent = successor;
        }
        successor.color = nodeToDelete.color;
      }
    }
    this._size--;
    if (originalColor === 'BLACK') {
      this._deleteFixup(replacementNode);
    }

    results.push({ deleted: nodeToDelete, needBalanced: undefined });

    return results;
  }

  /**
   * Remove all nodes and reset aggregate counters.
   * @remarks Time O(N), Space O(1)
   * @returns void
   */
  override clear() {
    super.clear();
    this._count = 0;
  }

  /**
   * Rebuild the tree into a perfectly balanced form using in-order nodes.
   * @remarks Time O(N), Space O(N)
   * @param [iterationType] - Traversal style to use when constructing the balanced tree.
   * @returns True if rebalancing succeeded (tree not empty).
   */
  override perfectlyBalance(iterationType: IterationType = this.iterationType): boolean {
    const nodes = this.dfs(node => node, 'IN', false, this._root, iterationType);
    const n = nodes.length;
    if (n < 1) return false;

    let total = 0;
    for (const nd of nodes) total += nd ? nd.count : 0;

    this._clearNodes();

    const build = (l: number, r: number, parent?: TreeCounterNode<K, V>): TreeCounterNode<K, V> | undefined => {
      if (l > r) return undefined;
      const m = l + ((r - l) >> 1);
      const root = nodes[m]! as TreeCounterNode<K, V>;
      const leftChild = build(l, m - 1, root);
      const rightChild = build(m + 1, r, root);
      root.left = leftChild;
      root.right = rightChild;
      root.parent = parent;
      return root;
    };

    const newRoot = build(0, n - 1, undefined);
    this._setRoot(newRoot);
    this._size = n;
    this._count = total;
    return true;
  }

  /**
   * Create a new TreeCounter by mapping each [key, value] entry.
   * @remarks Time O(N log N), Space O(N)
   * @template MK
   * @template MV
   * @template MR
   * @param callback - Function mapping (key, value, index, tree) → [newKey, newValue].
   * @param [options] - Options for the output tree.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new TreeCounter with mapped entries.
   */
  override map<MK = K, MV = V, MR = any>(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: Partial<BinaryTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): TreeCounter<MK, MV, MR> {
    const out = this._createLike<MK, MV, MR>([], options);

    let index = 0;
    for (const [key, value] of this) {
      out.add(callback.call(thisArg, key, value, index++, this));
    }
    return out;
  }

  /**
   * Deep copy this tree, preserving map mode and aggregate counts.
   * @remarks Time O(N), Space O(N)
   * @returns A deep copy of this tree.
   */
  override clone(): this {
    const out = this._createInstance<K, V, R>();
    this._clone(out as unknown as any);
    (out as any)._count = (this as any)._count;
    return out as unknown as this;
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @template TK
   * @template TV
   * @template TR
   * @param [options] - Optional constructor options for the like-kind instance.
   * @returns An empty like-kind instance.
   */
  protected override _createInstance<TK = K, TV = V, TR = R>(options?: Partial<BSTOptions<TK, TV, TR>>): this {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | BSTNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: BSTOptions<TK, TV, TR>
    ) => this;
    return new Ctor([], { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) }) as unknown as this;
  }

  /**
   * (Protected) Create a like-kind instance and seed it from an iterable.
   * @remarks Time O(N log N), Space O(N)
   * @template TK
   * @template TV
   * @template TR
   * @param iter - Iterable used to seed the new tree.
   * @param [options] - Options merged with the current snapshot.
   * @returns A like-kind TreeCounter built from the iterable.
   */
  protected override _createLike<TK = K, TV = V, TR = R>(
    iter: Iterable<TK | BSTNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR> = [],
    options?: Partial<BSTOptions<TK, TV, TR>>
  ): TreeCounter<TK, TV, TR> {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | BSTNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: BSTOptions<TK, TV, TR>
    ) => TreeCounter<TK, TV, TR>;
    return new Ctor(iter as unknown as Iterable<TK | any>, {
      ...this._snapshotOptions<TK, TV, TR>(),
      ...(options ?? {})
    });
  }

  /**
   * (Protected) Normalize input into a node plus its effective value and count.
   * @remarks Time O(1), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, value] entry.
   * @param [value] - Value used when a bare key is provided.
   * @param [count] - Count increment to apply (default 1).
   * @returns Tuple [node, value] where node may be undefined.
   */
  protected override _keyValueNodeOrEntryToNodeAndValue(
    keyNodeOrEntry: K | TreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V,
    count = 1
  ): [TreeCounterNode<K, V> | undefined, V | undefined] {
    if (keyNodeOrEntry === undefined || keyNodeOrEntry === null) return [undefined, undefined];

    if (this.isNode(keyNodeOrEntry)) return [keyNodeOrEntry, value];

    if (this.isEntry(keyNodeOrEntry)) {
      const [key, entryValue] = keyNodeOrEntry;
      if (key === undefined || key === null) return [undefined, undefined];
      const finalValue = value ?? entryValue;
      return [this.createNode(key, finalValue, 'BLACK', count), finalValue];
    }

    return [this.createNode(keyNodeOrEntry, value, 'BLACK', count), value];
  }

  /**
   * (Protected) Swap keys/values/counters between the source and destination nodes.
   * @remarks Time O(1), Space O(1)
   * @param srcNode - Source node (or key) whose properties will be moved.
   * @param destNode - Destination node (or key) to receive properties.
   * @returns Destination node after swap, or undefined.
   */
  protected override _swapProperties(
    srcNode: BSTNOptKeyOrNode<K, TreeCounterNode<K, V>>,
    destNode: BSTNOptKeyOrNode<K, TreeCounterNode<K, V>>
  ): TreeCounterNode<K, V> | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);
    if (srcNode && destNode) {
      const { key, value, count, color } = destNode;
      const tempNode = this.createNode(key, value, color, count);
      if (tempNode) {
        tempNode.color = color;

        destNode.key = srcNode.key;
        if (!this._isMapMode) destNode.value = srcNode.value;
        destNode.count = srcNode.count;
        destNode.color = srcNode.color;

        srcNode.key = tempNode.key;
        if (!this._isMapMode) srcNode.value = tempNode.value;
        srcNode.count = tempNode.count;
        srcNode.color = tempNode.color;
      }

      return destNode;
    }
    return undefined;
  }

  /**
   * (Protected) Replace one node by another and adjust counters accordingly.
   * @remarks Time O(1), Space O(1)
   * @param oldNode - Node being replaced.
   * @param newNode - Replacement node.
   * @returns The new node after replacement.
   */

  protected override _replaceNode(
    oldNode: TreeCounterNode<K, V>,
    newNode: TreeCounterNode<K, V>
  ): TreeCounterNode<K, V> {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
