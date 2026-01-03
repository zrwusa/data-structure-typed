/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import { BST } from './bst';
import type {
  AVLTreeOptions,
  BinaryTreeDeleteResult,
  BinaryTreeOptions,
  BSTNOptKeyOrNode,
  EntryCallback, FamilyPosition,
  IterationType, RBTNColor
} from '../../types';
import { BSTOptions } from '../../types';
import { IBinaryTree } from '../../interfaces';

/**
 * Represents a Node in an AVL (Adelson-Velsky and Landis) Tree.
 * It extends a BSTNode and ensures the 'height' property is maintained.
 *
 * @template K - The type of the key.
 * @template V - The type of the value.
 */
export class AVLTreeNode<K = any, V = any> {
  key: K;
  value?: V;
  parent?: AVLTreeNode<K, V> = undefined;

  /**
   * Creates an instance of AVLTreeNode.
   * @remarks Time O(1), Space O(1)
   *
   * @param key - The key of the node.
   * @param [value] - The value associated with the key.
   */
  constructor(key: K, value?: V) {
    this.key = key;
    this.value = value;
  }

  _left?: AVLTreeNode<K, V> | null | undefined = undefined;

  /**
   * Gets the left child of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @returns The left child.
   */
  get left(): AVLTreeNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Sets the left child of the node and updates its parent reference.
   * @remarks Time O(1), Space O(1)
   *
   * @param v - The node to set as the left child.
   */
  set left(v: AVLTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  _right?: AVLTreeNode<K, V> | null | undefined = undefined;

  /**
   * Gets the right child of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @returns The right child.
   */
  get right(): AVLTreeNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Sets the right child of the node and updates its parent reference.
   * @remarks Time O(1), Space O(1)
   *
   * @param v - The node to set as the right child.
   */
  set right(v: AVLTreeNode<K, V> | null | undefined) {
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
 * Represents a self-balancing AVL (Adelson-Velsky and Landis) Tree.
 * This tree extends BST and performs rotations on add/delete to maintain balance.
 *
 * @template K - The type of the key.
 * @template V - The type of the value.
 * @template R - The type of the raw data object (if using `toEntryFn`).
 *
 * 1. Height-Balanced: Each node's left and right subtrees differ in height by no more than one.
 * 2. Automatic Rebalancing: AVL trees rebalance themselves automatically during insertions and deletions.
 * 3. Rotations for Balancing: Utilizes rotations (single or double) to maintain balance after updates.
 * 4. Order Preservation: Maintains the binary search tree property where left child values are less than the parent, and right child values are greater.
 * 5. Efficient Lookups: Offers O(log n) search time, where 'n' is the number of nodes, due to its balanced nature.
 * 6. Complex Insertions and Deletions: Due to rebalancing, these operations are more complex than in a regular BST.
 * 7. Path Length: The path length from the root to any leaf is longer compared to an unbalanced BST, but shorter than a linear chain of nodes.@example
 * // Find elements in a range
 *     // In interval queries, AVL trees, with their strictly balanced structure and lower height, offer better query efficiency, making them ideal for frequent and high-performance interval queries. In contrast, Red-Black trees, with lower update costs, are more suitable for scenarios involving frequent insertions and deletions where the requirements for interval queries are less demanding.
 *     type Datum = { timestamp: Date; temperature: number };
 *     // Fixed dataset of CPU temperature readings
 *     const cpuData: Datum[] = [
 *       { timestamp: new Date('2024-12-02T00:00:00'), temperature: 55.1 },
 *       { timestamp: new Date('2024-12-02T00:01:00'), temperature: 56.3 },
 *       { timestamp: new Date('2024-12-02T00:02:00'), temperature: 54.8 },
 *       { timestamp: new Date('2024-12-02T00:03:00'), temperature: 57.2 },
 *       { timestamp: new Date('2024-12-02T00:04:00'), temperature: 58.0 },
 *       { timestamp: new Date('2024-12-02T00:05:00'), temperature: 59.4 },
 *       { timestamp: new Date('2024-12-02T00:06:00'), temperature: 60.1 },
 *       { timestamp: new Date('2024-12-02T00:07:00'), temperature: 61.3 },
 *       { timestamp: new Date('2024-12-02T00:08:00'), temperature: 62.0 },
 *       { timestamp: new Date('2024-12-02T00:09:00'), temperature: 63.5 },
 *       { timestamp: new Date('2024-12-02T00:10:00'), temperature: 64.0 },
 *       { timestamp: new Date('2024-12-02T00:11:00'), temperature: 62.8 },
 *       { timestamp: new Date('2024-12-02T00:12:00'), temperature: 61.5 },
 *       { timestamp: new Date('2024-12-02T00:13:00'), temperature: 60.2 },
 *       { timestamp: new Date('2024-12-02T00:14:00'), temperature: 59.8 },
 *       { timestamp: new Date('2024-12-02T00:15:00'), temperature: 58.6 },
 *       { timestamp: new Date('2024-12-02T00:16:00'), temperature: 57.4 },
 *       { timestamp: new Date('2024-12-02T00:17:00'), temperature: 56.2 },
 *       { timestamp: new Date('2024-12-02T00:18:00'), temperature: 55.7 },
 *       { timestamp: new Date('2024-12-02T00:19:00'), temperature: 54.5 },
 *       { timestamp: new Date('2024-12-02T00:20:00'), temperature: 53.2 },
 *       { timestamp: new Date('2024-12-02T00:21:00'), temperature: 52.8 },
 *       { timestamp: new Date('2024-12-02T00:22:00'), temperature: 51.9 },
 *       { timestamp: new Date('2024-12-02T00:23:00'), temperature: 50.5 },
 *       { timestamp: new Date('2024-12-02T00:24:00'), temperature: 49.8 },
 *       { timestamp: new Date('2024-12-02T00:25:00'), temperature: 48.7 },
 *       { timestamp: new Date('2024-12-02T00:26:00'), temperature: 47.5 },
 *       { timestamp: new Date('2024-12-02T00:27:00'), temperature: 46.3 },
 *       { timestamp: new Date('2024-12-02T00:28:00'), temperature: 45.9 },
 *       { timestamp: new Date('2024-12-02T00:29:00'), temperature: 45.0 }
 *     ];
 *
 *     // Create an AVL tree to store CPU temperature data
 *     const cpuTemperatureTree = new AVLTree<Date, number, Datum>(cpuData, {
 *       toEntryFn: ({ timestamp, temperature }) => [timestamp, temperature]
 *     });
 *
 *     // Query a specific time range (e.g., from 00:05 to 00:15)
 *     const rangeStart = new Date('2024-12-02T00:05:00');
 *     const rangeEnd = new Date('2024-12-02T00:15:00');
 *     const rangeResults = cpuTemperatureTree.rangeSearch([rangeStart, rangeEnd], node => ({
 *       minute: node ? node.key.getMinutes() : 0,
 *       temperature: cpuTemperatureTree.get(node ? node.key : undefined)
 *     }));
 *
 *     console.log(rangeResults); // [
 *  //      { minute: 5, temperature: 59.4 },
 *  //      { minute: 6, temperature: 60.1 },
 *  //      { minute: 7, temperature: 61.3 },
 *  //      { minute: 8, temperature: 62 },
 *  //      { minute: 9, temperature: 63.5 },
 *  //      { minute: 10, temperature: 64 },
 *  //      { minute: 11, temperature: 62.8 },
 *  //      { minute: 12, temperature: 61.5 },
 *  //      { minute: 13, temperature: 60.2 },
 *  //      { minute: 14, temperature: 59.8 },
 *  //      { minute: 15, temperature: 58.6 }
 *  //    ]
 */
export class AVLTree<K = any, V = any, R = any> extends BST<K, V, R> implements IBinaryTree<K, V, R> {
  /**
   * Creates an instance of AVLTree.
   * @remarks Time O(N log N) (from `addMany` with balanced add). Space O(N).
   *
   * @param [keysNodesEntriesOrRaws=[]] - An iterable of items to add.
   * @param [options] - Configuration options for the AVL tree.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    > = [],
    options?: AVLTreeOptions<K, V, R>
  ) {
    super([], options);
    // Note: super.addMany is called, which in BST defaults to balanced add.
    if (keysNodesEntriesOrRaws) super.addMany(keysNodesEntriesOrRaws);
  }

  /**
   * (Protected) Creates a new AVL tree node.
   * @remarks Time O(1), Space O(1)
   *
   * @param key - The key for the new node.
   * @param [value] - The value for the new node.
   * @returns The newly created AVLTreeNode.
   */
  override createNode(key: K, value?: V): AVLTreeNode<K, V> {
    return new AVLTreeNode<K, V>(key, this._isMapMode ? undefined : value) as AVLTreeNode<K, V>;
  }

  /**
   * Checks if the given item is an `AVLTreeNode` instance.
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeOrEntry - The item to check.
   * @returns True if it's an AVLTreeNode, false otherwise.
   */
  override isNode(
    keyNodeOrEntry: K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is AVLTreeNode<K, V> {
    return keyNodeOrEntry instanceof AVLTreeNode;
  }

  /**
   * Adds a new node to the AVL tree and balances the tree path.
   * @remarks Time O(log N) (O(H) for BST add + O(H) for `_balancePath`). Space O(H) for path/recursion.
   *
   * @param keyNodeOrEntry - The key, node, or entry to add.
   * @param [value] - The value, if providing just a key.
   * @returns True if the addition was successful, false otherwise.
   */
  override add(
    keyNodeOrEntry: K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): boolean {
    if (keyNodeOrEntry === null) return false;
    const inserted = super.add(keyNodeOrEntry, value);
    // If insertion was successful, balance the path from the new node up to the root.
    if (inserted) this._balancePath(keyNodeOrEntry);
    return inserted;
  }

  /**
   * Deletes a node from the AVL tree and re-balances the tree.
   * @remarks Time O(log N) (O(H) for BST delete + O(H) for `_balancePath`). Space O(H) for path/recursion.
   *
   * @param keyNodeOrEntry - The node to delete.
   * @returns An array containing deletion results.
   */
  override delete(
    keyNodeOrEntry: K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): BinaryTreeDeleteResult<AVLTreeNode<K, V>>[] {
    const deletedResults = super.delete(keyNodeOrEntry);
    // After deletion, balance the path from the parent of the *physically deleted* node.
    for (const { needBalanced } of deletedResults) {
      if (needBalanced) {
        this._balancePath(needBalanced);
      }
    }
    return deletedResults;
  }

  /**
   * Rebuilds the tree to be perfectly balanced.
   * @remarks AVL trees are already height-balanced, but this makes them *perfectly* balanced (minimal height and all leaves at N or N-1).
   * Time O(N) (O(N) for DFS, O(N) for sorted build). Space O(N) for node array and recursion stack.
   *
   * @param [iterationType=this.iterationType] - The traversal method for the initial node export.
   * @returns True if successful, false if the tree was empty.
   */
  override perfectlyBalance(iterationType: IterationType = this.iterationType): boolean {
    const nodes = this.dfs(node => node, 'IN', false, this._root, iterationType);
    const n = nodes.length;
    if (n === 0) return false;

    this._clearNodes();

    // Build balanced tree from sorted array
    const build = (l: number, r: number, parent?: AVLTreeNode<K, V>): AVLTreeNode<K, V> | undefined => {
      if (l > r) return undefined;
      const m = l + ((r - l) >> 1);
      const root = nodes[m]!;
      root.left = build(l, m - 1, root);
      root.right = build(m + 1, r, root);
      root.parent = parent;

      // Update height during the build
      const lh = root.left ? (root.left as AVLTreeNode<K, V>).height : -1;
      const rh = root.right ? (root.right as AVLTreeNode<K, V>).height : -1;
      root.height = Math.max(lh, rh) + 1;
      return root;
    };

    const newRoot = build(0, n - 1, undefined);
    this._setRoot(newRoot);
    this._size = n;
    return true;
  }

  /**
   * Creates a new AVLTree by mapping each [key, value] pair.
   * @remarks Time O(N log N) (O(N) iteration + O(log M) `add` for each item into the new tree). Space O(N) for the new tree.
   *
   * @template MK - New key type.
   * @template MV - New value type.
   * @template MR - New raw type.
   * @param callback - A function to map each [key, value] pair.
   * @param [options] - Options for the new AVLTree.
   * @param [thisArg] - `this` context for the callback.
   * @returns A new, mapped AVLTree.
   */
  override map<MK = K, MV = V, MR = any>(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: Partial<BinaryTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): AVLTree<MK, MV, MR> {
    const out = this._createLike<MK, MV, MR>([], options);

    let index = 0;
    // Iterates in-order
    for (const [key, value] of this) {
      // `add` on the new tree will be O(log N) and will self-balance.
      out.add(callback.call(thisArg, key, value, index++, this));
    }
    return out;
  }

  /**
   * (Protected) Creates a new, empty instance of the same AVLTree constructor.
   * @remarks Time O(1)
   *
   * @template TK, TV, TR - Generic types for the new instance.
   * @param [options] - Options for the new tree.
   * @returns A new, empty tree.
   */
  protected override _createInstance<TK = K, TV = V, TR = R>(options?: Partial<BSTOptions<TK, TV, TR>>): this {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | AVLTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: BSTOptions<TK, TV, TR>
    ) => this;
    return new Ctor([], { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) }) as unknown as this;
  }

  /**
   * (Protected) Creates a new instance of the same AVLTree constructor, potentially with different generic types.
   * @remarks Time O(N log N) (from constructor) due to processing the iterable.
   *
   * @template TK, TV, TR - Generic types for the new instance.
   * @param [iter=[]] - An iterable to populate the new tree.
   * @param [options] - Options for the new tree.
   * @returns A new AVLTree.
   */
  protected override _createLike<TK = K, TV = V, TR = R>(
    iter: Iterable<TK | AVLTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR> = [],
    options?: Partial<BSTOptions<TK, TV, TR>>
  ): AVLTree<TK, TV, TR> {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | AVLTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: BSTOptions<TK, TV, TR>
    ) => AVLTree<TK, TV, TR>;
    return new Ctor(iter, { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) });
  }

  /**
   * (Protected) Swaps properties of two nodes, including height.
   * @remarks Time O(H) (due to `ensureNode`), but O(1) if nodes are passed directly.
   *
   * @param srcNode - The source node.
   * @param destNode - The destination node.
   * @returns The `destNode` (now holding `srcNode`'s properties).
   */
  protected override _swapProperties(
    srcNode: BSTNOptKeyOrNode<K, AVLTreeNode<K, V>>,
    destNode: BSTNOptKeyOrNode<K, AVLTreeNode<K, V>>
  ): AVLTreeNode<K, V> | undefined {
    const srcNodeEnsured = this.ensureNode(srcNode);
    const destNodeEnsured = this.ensureNode(destNode);

    if (srcNodeEnsured && destNodeEnsured) {
      const { key, value, height } = destNodeEnsured;
      const tempNode = this.createNode(key, value);

      if (tempNode) {
        tempNode.height = height;

        // Copy src to dest
        destNodeEnsured.key = srcNodeEnsured.key;
        if (!this._isMapMode) destNodeEnsured.value = srcNodeEnsured.value;
        destNodeEnsured.height = srcNodeEnsured.height;

        // Copy temp (original dest) to src
        srcNodeEnsured.key = tempNode.key;
        if (!this._isMapMode) srcNodeEnsured.value = tempNode.value;
        srcNodeEnsured.height = tempNode.height;
      }

      return destNodeEnsured;
    }
    return undefined;
  }

  /**
   * (Protected) Calculates the balance factor (height(right) - height(left)).
   * @remarks Time O(1) (assumes heights are stored).
   *
   * @param node - The node to check.
   * @returns The balance factor (positive if right-heavy, negative if left-heavy).
   */
  protected _balanceFactor(node: AVLTreeNode<K, V>): number {
    const left = node.left ? (node.left as AVLTreeNode<K, V>).height : -1;
    const right = node.right ? (node.right as AVLTreeNode<K, V>).height : -1;
    return right - left;
  }

  /**
   * (Protected) Recalculates and updates the height of a node based on its children's heights.
   * @remarks Time O(1) (assumes children's heights are correct).
   *
   * @param node - The node to update.
   */
  protected _updateHeight(node: AVLTreeNode<K, V>): void {
    const leftHeight = node.left ? (node.left as AVLTreeNode<K, V>).height : -1;
    const rightHeight = node.right ? (node.right as AVLTreeNode<K, V>).height : -1;
    node.height = 1 + Math.max(leftHeight, rightHeight);
  }

  /**
   * (Protected) Performs a Left-Left (LL) rotation (a single right rotation).
   * @remarks Time O(1), Space O(1)
   *
   * @param A - The unbalanced node (root of the unbalanced subtree).
   */
  protected _balanceLL(A: AVLTreeNode<K, V>): void {
    const parentOfA = A.parent;
    const B = A.left; // The left child
    if (B !== null) A.parent = B;
    if (B && B.right) {
      B.right.parent = A;
    }
    if (B) B.parent = parentOfA;

    // Update parent's child pointer
    if (A === this.root) {
      if (B) this._setRoot(B);
    } else {
      if (parentOfA?.left === A) {
        parentOfA.left = B;
      } else {
        if (parentOfA) parentOfA.right = B;
      }
    }

    // Perform rotation
    if (B) {
      A.left = B.right;
      B.right = A;
    }
    this._updateHeight(A);
    if (B) this._updateHeight(B);
  }

  /**
   * (Protected) Performs a Left-Right (LR) double rotation.
   * @remarks Time O(1), Space O(1)
   *
   * @param A - The unbalanced node (root of the unbalanced subtree).
   */
  protected _balanceLR(A: AVLTreeNode<K, V>): void {
    const parentOfA = A.parent;
    const B = A.left;
    let C = undefined;
    if (B) {
      C = B.right; // The "middle" node
    }
    if (A && C !== null) A.parent = C;
    if (B && C !== null) B.parent = C;

    if (C) {
      if (C.left) {
        if (B !== null) C.left.parent = B;
      }
      if (C.right) {
        C.right.parent = A;
      }
      C.parent = parentOfA;
    }

    // Update parent's child pointer
    if (A === this.root) {
      if (C) this._setRoot(C);
    } else {
      if (parentOfA) {
        if (parentOfA.left === A) {
          parentOfA.left = C;
        } else {
          parentOfA.right = C;
        }
      }
    }

    // Perform rotation
    if (C) {
      A.left = C.right;
      if (B) B.right = C.left;
      C.left = B;
      C.right = A;
    }

    this._updateHeight(A);
    if (B) this._updateHeight(B);
    if (C) this._updateHeight(C);
  }

  /**
   * (Protected) Performs a Right-Right (RR) rotation (a single left rotation).
   * @remarks Time O(1), Space O(1)
   *
   * @param A - The unbalanced node (root of the unbalanced subtree).
   */
  protected _balanceRR(A: AVLTreeNode<K, V>): void {
    const parentOfA = A.parent;
    const B = A.right; // The right child
    if (B !== null) A.parent = B;
    if (B) {
      if (B.left) {
        B.left.parent = A;
      }
      B.parent = parentOfA;
    }

    // Update parent's child pointer
    if (A === this.root) {
      if (B) this._setRoot(B);
    } else {
      if (parentOfA) {
        if (parentOfA.left === A) {
          parentOfA.left = B;
        } else {
          parentOfA.right = B;
        }
      }
    }

    // Perform rotation
    if (B) {
      A.right = B.left;
      B.left = A;
    }
    this._updateHeight(A);
    if (B) this._updateHeight(B);
  }

  /**
   * (Protected) Performs a Right-Left (RL) double rotation.
   * @remarks Time O(1), Space O(1)
   *
   * @param A - The unbalanced node (root of the unbalanced subtree).
   */
  protected _balanceRL(A: AVLTreeNode<K, V>): void {
    const parentOfA = A.parent;
    const B = A.right;
    let C = undefined;
    if (B) {
      C = B.left; // The "middle" node
    }

    if (C !== null) A.parent = C;
    if (B && C !== null) B.parent = C;

    if (C) {
      if (C.left) {
        C.left.parent = A;
      }
      if (C.right) {
        if (B !== null) C.right.parent = B;
      }
      C.parent = parentOfA;
    }

    // Update parent's child pointer
    if (A === this.root) {
      if (C) this._setRoot(C);
    } else {
      if (parentOfA) {
        if (parentOfA.left === A) {
          parentOfA.left = C;
        } else {
          parentOfA.right = C;
        }
      }
    }

    // Perform rotation
    if (C) A.right = C.left;
    if (B && C) B.left = C.right;
    if (C) C.left = A;
    if (C) C.right = B;

    this._updateHeight(A);
    if (B) this._updateHeight(B);
    if (C) this._updateHeight(C);
  }

  /**
   * (Protected) Traverses up the tree from the specified node, updating heights and performing rotations as needed.
   * @remarks Time O(log N) (O(H)), as it traverses the path to root. Space O(H) for the path array.
   *
   * @param node - The node to start balancing from (e.g., the newly inserted node or parent of the deleted node).
   */
  protected _balancePath(node: K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined): void {
    // Get the path from the node to the root.
    node = this.ensureNode(node);
    const path = this.getPathToRoot(node, node => node, false);

    // Iterate up the path (from node to root)
    for (let i = 0; i < path.length; i++) {
      const A = path[i];
      if (A) {
        this._updateHeight(A);

        // Check the balance factor
        switch (this._balanceFactor(A)) {
          case -2: // Left-heavy
            if (A && A.left) {
              if (this._balanceFactor(A.left) <= 0) {
                // Left-Left case
                this._balanceLL(A);
              } else {
                // Left-Right case
                this._balanceLR(A);
              }
            }
            break;
          case +2: // Right-heavy
            if (A && A.right) {
              if (this._balanceFactor(A.right) >= 0) {
                // Right-Right case
                this._balanceRR(A);
              } else {
                // Right-Left case
                this._balanceRL(A);
              }
            }
        }
      }
    }
  }

  /**
   * (Protected) Replaces a node, ensuring height is copied.
   * @remarks Time O(1)
   *
   * @param oldNode - The node to be replaced.
   * @param newNode - The node to insert.
   * @returns The `newNode`.
   */
  protected override _replaceNode(oldNode: AVLTreeNode<K, V>, newNode: AVLTreeNode<K, V>): AVLTreeNode<K, V> {
    // When replacing a node (e.g., on duplicate key), preserve the height.
    newNode.height = oldNode.height;
    return super._replaceNode(oldNode, newNode);
  }
}
