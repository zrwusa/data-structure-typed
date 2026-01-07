/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  AVLTreeCounterOptions,
  BinaryTreeDeleteResult,
  BSTNOptKeyOrNode,
  EntryCallback,
  FamilyPosition,
  IterationType,
  RBTNColor
} from '../../types';
import { IBinaryTree } from '../../interfaces';
import { AVLTree } from './avl-tree';

/**
 * AVL node with an extra 'count' field; keeps parent/child links.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 */
export class AVLTreeCounterNode<K = any, V = any> {
  key: K;
  value?: V;
  parent?: AVLTreeCounterNode<K, V> = undefined;

  /**
   * Create an AVL counter node.
   * @remarks Time O(1), Space O(1)
   * @param key - Key of the node.
   * @param [value] - Associated value (ignored in map mode).
   * @param [count] - Initial count for this node (default 1).
   * @returns New AVLTreeCounterNode instance.
   */
  constructor(key: K, value?: V, count = 1) {
    this.key = key;
    this.value = value;
    this.count = count;
  }

  _left?: AVLTreeCounterNode<K, V> | null | undefined = undefined;

  /**
   * Get the left child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Left child node, or null/undefined.
   */
  get left(): AVLTreeCounterNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Set the left child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New left child node, or null/undefined.
   * @returns void
   */
  set left(v: AVLTreeCounterNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  _right?: AVLTreeCounterNode<K, V> | null | undefined = undefined;

  /**
   * Get the right child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Right child node, or null/undefined.
   */
  get right(): AVLTreeCounterNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Set the right child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New right child node, or null/undefined.
   * @returns void
   */
  set right(v: AVLTreeCounterNode<K, V> | null | undefined) {
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
 * AVL tree that tracks an aggregate 'count' across nodes; supports balanced insert/delete and map-like mode.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 * @template R
 */
export class AVLTreeCounter<K = any, V = any, R = any> extends AVLTree<K, V, R> implements IBinaryTree<K, V, R> {
  /**
   * Create a AVLTreeCounter instance
   * @remarks Time O(n), Space O(n)
   * @param keysNodesEntriesOrRaws
   * @param options
   * @returns New AVLTreeCounterNode instance.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | AVLTreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    > = [],
    options?: AVLTreeCounterOptions<K, V, R>
  ) {
    super([], options);
    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
  }

  protected _count = 0;

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
    this.dfs(node => (sum += node.count));
    return sum;
  }

  override createNode(key: K, value?: V, count?: number): AVLTreeCounterNode<K, V> {
    return new AVLTreeCounterNode(key, this._isMapMode ? undefined : value, count) as AVLTreeCounterNode<K, V>;
  }

  /**
   * Type guard: check whether the input is an AVLTreeCounterNode.
   * @remarks Time O(1), Space O(1)
   * @returns True if the value is an AVLTreeCounterNode.
   */
  override isNode(
    keyNodeOrEntry: K | AVLTreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is AVLTreeCounterNode<K, V> {
    return keyNodeOrEntry instanceof AVLTreeCounterNode;
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
    keyNodeOrEntry: K | AVLTreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V,
    count = 1
  ): boolean {
    const [newNode, newValue] = this._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value, count);
    if (newNode === undefined) return false;

    const orgNodeCount = newNode?.count || 0;
    const inserted = super.add(newNode, newValue);
    if (inserted) {
      this._count += orgNodeCount;
    }
    return true;
  }

  /**
   * Delete a node (or decrement its count) and rebalance if needed.
   * @remarks Time O(log N), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, value] entry identifying the node.
   * @param [ignoreCount] - If true, remove the node regardless of its count.
   * @returns Array of deletion results including deleted node and a rebalance hint when present.
   */
  override delete(
    keyNodeOrEntry: K | AVLTreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    ignoreCount = false
  ): BinaryTreeDeleteResult<AVLTreeCounterNode<K, V>>[] {
    const deletedResult: BinaryTreeDeleteResult<AVLTreeCounterNode<K, V>>[] = [];
    if (!this.root) return deletedResult;

    const curr: AVLTreeCounterNode<K, V> | undefined = this.getNode(keyNodeOrEntry) ?? undefined;
    if (!curr) return deletedResult;

    const parent: AVLTreeCounterNode<K, V> | undefined = curr?.parent ? curr.parent : undefined;
    let needBalanced: AVLTreeCounterNode<K, V> | undefined = undefined,
      orgCurrent: AVLTreeCounterNode<K, V> | undefined = curr;

    if (curr.count > 1 && !ignoreCount) {
      curr.count--;
      this._count--;
    } else {
      if (!curr.left) {
        if (!parent) {
          if (curr.right !== undefined && curr.right !== null) this._setRoot(curr.right);
        } else {
          const { familyPosition: fp } = curr;
          if (fp === 'LEFT' || fp === 'ROOT_LEFT') {
            parent.left = curr.right;
          } else if (fp === 'RIGHT' || fp === 'ROOT_RIGHT') {
            parent.right = curr.right;
          }
          needBalanced = parent;
        }
      } else {
        const leftSubTreeRightMost = curr.left ? this.getRightMost(node => node, curr.left) : undefined;
        if (leftSubTreeRightMost) {
          const parentOfLeftSubTreeMax = leftSubTreeRightMost.parent;
          orgCurrent = this._swapProperties(curr, leftSubTreeRightMost);
          if (parentOfLeftSubTreeMax) {
            if (parentOfLeftSubTreeMax.right === leftSubTreeRightMost) {
              parentOfLeftSubTreeMax.right = leftSubTreeRightMost.left;
            } else {
              parentOfLeftSubTreeMax.left = leftSubTreeRightMost.left;
            }
            needBalanced = parentOfLeftSubTreeMax;
          }
        }
      }
      this._size = this._size - 1;

      if (orgCurrent) this._count -= orgCurrent.count;
    }

    deletedResult.push({ deleted: orgCurrent, needBalanced });

    if (needBalanced) {
      this._balancePath(needBalanced);
    }

    return deletedResult;
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
    if (n === 0) return false;

    let total = 0;
    for (const nd of nodes) total += nd ? nd.count : 0;

    this._clearNodes();

    const build = (l: number, r: number, parent?: any): any => {
      if (l > r) return undefined;
      const m = l + ((r - l) >> 1);
      const root = nodes[m];
      root.left = build(l, m - 1, root);
      root.right = build(m + 1, r, root);
      root.parent = parent;
      const lh = root.left ? root.left.height : -1;
      const rh = root.right ? root.right.height : -1;
      root.height = Math.max(lh, rh) + 1;
      return root;
    };

    const newRoot = build(0, n - 1, undefined);
    this._setRoot(newRoot);
    this._size = n;
    this._count = total;
    return true;
  }

  /**
   * Deep copy this tree, preserving map mode and aggregate counts.
   * @remarks Time O(N), Space O(N)
   * @returns A deep copy of this tree.
   */
  override clone(): this {
    const out = this._createInstance();

    if (this._isMapMode) {
      this.bfs(node => out.add(node.key, undefined, node.count));
    } else {
      this.bfs(node => out.add(node.key, node.value, node.count));
    }

    if (this._isMapMode) out._store = this._store;

    return out as this;
  }

  /**
   * Create a new AVLTreeCounter by mapping each [key, value] entry.
   * @remarks Time O(N log N), Space O(N)
   * @template MK
   * @template MV
   * @template MR
   * @param callback - Function mapping (key, value, index, tree) → [newKey, newValue].
   * @param [options] - Options for the output tree.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new AVLTreeCounter with mapped entries.
   */
  override map<MK = K, MV = V, MR = any>(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: Partial<AVLTreeCounterOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): AVLTreeCounter<MK, MV, MR> {
    const out = this._createLike<MK, MV, MR>([], options);

    let index = 0;
    for (const [key, value] of this) {
      out.add(callback.call(thisArg, value, key, index++, this));
    }
    return out;
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
  protected override _createInstance<TK = K, TV = V, TR = R>(
    options?: Partial<AVLTreeCounterOptions<TK, TV, TR>>
  ): this {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<
        TK | AVLTreeCounterNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR
      >,
      opts?: AVLTreeCounterOptions<TK, TV, TR>
    ) => AVLTreeCounter<TK, TV, TR>;
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
   * @returns A like-kind AVLTreeCounter built from the iterable.
   */
  protected override _createLike<TK = K, TV = V, TR = R>(
    iter: Iterable<
      TK | AVLTreeCounterNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR
    > = [],
    options?: Partial<AVLTreeCounterOptions<TK, TV, TR>>
  ): AVLTreeCounter<TK, TV, TR> {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<
        TK | AVLTreeCounterNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR
      >,
      opts?: AVLTreeCounterOptions<TK, TV, TR>
    ) => AVLTreeCounter<TK, TV, TR>;
    return new Ctor(iter, { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) });
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
    keyNodeOrEntry: K | AVLTreeCounterNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V,
    count = 1
  ): [AVLTreeCounterNode<K, V> | undefined, V | undefined] {
    if (keyNodeOrEntry === undefined || keyNodeOrEntry === null) return [undefined, undefined];
    if (this.isNode(keyNodeOrEntry)) return [keyNodeOrEntry, value];

    if (this.isEntry(keyNodeOrEntry)) {
      const [key, entryValue] = keyNodeOrEntry;
      if (key === undefined || key === null) return [undefined, undefined];
      const finalValue = value ?? entryValue;
      return [this.createNode(key, finalValue, count), finalValue];
    }

    return [this.createNode(keyNodeOrEntry, value, count), value];
  }

  /**
   * (Protected) Swap keys/values/counters between the source and destination nodes.
   * @remarks Time O(1), Space O(1)
   * @param srcNode - Source node (or key) whose properties will be moved.
   * @param destNode - Destination node (or key) to receive properties.
   * @returns Destination node after swap, or undefined.
   */
  protected override _swapProperties(
    srcNode: BSTNOptKeyOrNode<K, AVLTreeCounterNode<K, V>>,
    destNode: BSTNOptKeyOrNode<K, AVLTreeCounterNode<K, V>>
  ): AVLTreeCounterNode<K, V> | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);
    if (srcNode && destNode) {
      const { key, value, count, height } = destNode;
      const tempNode = this.createNode(key, value, count);
      if (tempNode) {
        tempNode.height = height;

        destNode.key = srcNode.key;
        if (!this._isMapMode) destNode.value = srcNode.value;
        destNode.count = srcNode.count;
        destNode.height = srcNode.height;

        srcNode.key = tempNode.key;
        if (!this._isMapMode) srcNode.value = tempNode.value;
        srcNode.count = tempNode.count;
        srcNode.height = tempNode.height;
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
    oldNode: AVLTreeCounterNode<K, V>,
    newNode: AVLTreeCounterNode<K, V>
  ): AVLTreeCounterNode<K, V> {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
