/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import { BST, BSTNode } from './bst';
import type { AVLTreeOptions, BinaryTreeDeleteResult, BSTNOptKeyOrNode, EntryCallback } from '../../types';
import { IBinaryTree } from '../../interfaces';

export class AVLTreeNode<K = any, V = any> extends BSTNode<K, V> {
  override parent?: AVLTreeNode<K, V> = undefined;

  /**
   * This TypeScript constructor function initializes an instance with a key and an optional value.
   * @param {K} key - The `key` parameter is typically used to uniquely identify an object or element
   * within a data structure. It serves as a reference or identifier for accessing or manipulating the
   * associated value or data.
   * @param {V} [value] - The `value` parameter in the constructor is optional, meaning it does not
   * have to be provided when creating an instance of the class. If a value is not provided, it will
   * default to `undefined`.
   */
  constructor(key: K, value?: V) {
    super(key, value);
  }

  override _left?: AVLTreeNode<K, V> | null | undefined = undefined;

  override get left(): AVLTreeNode<K, V> | null | undefined {
    return this._left;
  }

  override set left(v: AVLTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: AVLTreeNode<K, V> | null | undefined = undefined;

  override get right(): AVLTreeNode<K, V> | null | undefined {
    return this._right;
  }

  override set right(v: AVLTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 * 1. Height-Balanced: Each node's left and right subtrees differ in height by no more than one.
 * 2. Automatic Rebalancing: AVL trees rebalance themselves automatically during insertions and deletions.
 * 3. Rotations for Balancing: Utilizes rotations (single or double) to maintain balance after updates.
 * 4. Order Preservation: Maintains the binary search tree property where left child values are less than the parent, and right child values are greater.
 * 5. Efficient Lookups: Offers O(log n) search time, where 'n' is the number of nodes, due to its balanced nature.
 * 6. Complex Insertions and Deletions: Due to rebalancing, these operations are more complex than in a regular BST.
 * 7. Path Length: The path length from the root to any leaf is longer compared to an unbalanced BST, but shorter than a linear chain of nodes.
 * @example
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
export class AVLTree<K = any, V = any, R = object, MK = any, MV = any, MR = object>
  extends BST<K, V, R, MK, MV, MR>
  implements IBinaryTree<K, V, R, MK, MV, MR>
{
  /**
   * This TypeScript constructor initializes an AVLTree with keys, nodes, entries, or raw data provided
   * in an iterable format.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter in the constructor is an
   * iterable that can contain either `
   K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined]  | null | undefined ` objects or `R` objects. It is
   * used to initialize the AVLTree with key-value pairs or raw data entries. If provided
   * @param [options] - The `options` parameter in the constructor is of type `AVLTreeOptions<K, V,
   * R>`. It is an optional parameter that allows you to specify additional options for configuring the
   * AVL tree. These options could include things like custom comparators, initial capacity, or any
   * other configuration settings specific
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    > = [],
    options?: AVLTreeOptions<K, V, R>
  ) {
    super([], options);
    if (keysNodesEntriesOrRaws) super.addMany(keysNodesEntriesOrRaws);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function creates a new AVL tree node with the given key and value.
   * @param {K} key - The key parameter is of type K, which represents the key of the node being
   * created.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It represents the
   * value associated with the key in the node being created.
   * @returns The method is returning a new instance of the AVLTreeNode class, casted as the generic
   * type AVLTreeNode<K, V>.
   */
  override createNode(key: K, value?: V): AVLTreeNode<K, V> {
    return new AVLTreeNode<K, V>(key, this._isMapMode ? undefined : value) as AVLTreeNode<K, V>;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function creates a new AVL tree with the specified options and returns it.
   * @param {AVLTreeOptions} [options] - The `options` parameter is an optional object that can be
   * passed to the `createTree` function. It is used to customize the behavior of the AVL tree that is
   * being created.
   * @returns a new AVLTree object.
   */
  override createTree(options?: AVLTreeOptions<K, V, R>) {
    return new AVLTree<K, V, R, MK, MV, MR>([], {
      iterationType: this.iterationType,
      isMapMode: this._isMapMode,
      specifyComparable: this._specifyComparable,
      toEntryFn: this._toEntryFn,
      isReverse: this._isReverse,
      ...options
    });
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if the input is an instance of AVLTreeNode.
   * @param {K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined]  | null | undefined } keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can be of type `R` or `
   K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined]  | null | undefined `.
   * @returns a boolean value indicating whether the input parameter `keyNodeOrEntry` is
   * an instance of the `AVLTreeNode` class.
   */
  override isNode(
    keyNodeOrEntry: K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is AVLTreeNode<K, V> {
    return keyNodeOrEntry instanceof AVLTreeNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function overrides the add method of a class and inserts a key-value pair into a data
   * structure, then balances the path.
   * @param { K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined]  | null | undefined } keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can accept values of type `R`, `
   K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined]  | null | undefined `
   * @param {V} [value] - The `value` parameter is an optional value that you want to associate with
   * the key or node being added to the data structure.
   * @returns The method is returning a boolean value.
   */
  override add(
    keyNodeOrEntry: K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): boolean {
    if (keyNodeOrEntry === null) return false;
    const inserted = super.add(keyNodeOrEntry, value);
    if (inserted) this._balancePath(keyNodeOrEntry);
    return inserted;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function overrides the delete method in a TypeScript class, performs deletion, and then
   * balances the tree if necessary.
   * @param { K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined]  | null | undefined } keyNodeOrEntry - The `keyNodeOrEntry`
   * parameter in the `override delete` method can be one of the following types:
   * @returns The `delete` method is being overridden in this code snippet. It first calls the `delete`
   * method from the superclass (presumably a parent class) with the provided `predicate`, which could
   * be a key, node, entry, or a custom predicate. The result of this deletion operation is stored in
   * `deletedResults`, which is an array of `BinaryTreeDeleteResult` objects.
   */
  override delete(
    keyNodeOrEntry: K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): BinaryTreeDeleteResult<AVLTreeNode<K, V>>[] {
    const deletedResults = super.delete(keyNodeOrEntry);
    for (const { needBalanced } of deletedResults) {
      if (needBalanced) {
        this._balancePath(needBalanced);
      }
    }
    return deletedResults;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function in TypeScript overrides the default map behavior of an AVLTree data structure
   * by applying a callback function to each entry and creating a new AVLTree with the results.
   * @param callback - A function that will be called for each entry in the AVLTree. It takes four
   * arguments: the key, the value (which can be undefined), the index of the entry, and a reference to
   * the AVLTree itself.
   * @param [options] - The `options` parameter in the `override map` function is of type
   * `AVLTreeOptions<MK, MV, MR>`. It is an optional parameter that allows you to specify additional
   * options for the AVL tree being created during the mapping process. These options could include
   * custom comparators, initial
   * @param {any} [thisArg] - The `thisArg` parameter in the `override map` function is used to specify
   * the value of `this` when executing the `callback` function. It allows you to set the context
   * (value of `this`) within the callback function. This can be useful when you want to access
   * properties or
   * @returns The `map` method is returning a new AVLTree instance (`newTree`) with the entries
   * modified by the provided callback function.
   */
  override map(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: AVLTreeOptions<MK, MV, MR>,
    thisArg?: any
  ): AVLTree<MK, MV, MR> {
    const newTree = new AVLTree<MK, MV, MR>([], options);
    let index = 0;
    for (const [key, value] of this) {
      newTree.add(callback.call(thisArg, key, value, index++, this));
    }
    return newTree;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `clone` overrides the default cloning behavior to create a deep copy of a tree
   * structure.
   * @returns A cloned tree object is being returned.
   */
  override clone() {
    const cloned = this.createTree();
    this._clone(cloned);
    return cloned;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_swapProperties` function swaps the key, value, and height properties between two nodes in a
   * binary search tree.
   * @param {BSTNOptKeyOrNode<K, AVLTreeNode<K, V>>} srcNode - The `srcNode` parameter represents either a node
   * object (`AVLTreeNode<K, V>`) or a key-value pair (`R`) that is being swapped with another node.
   * @param {BSTNOptKeyOrNode<K, AVLTreeNode<K, V>>} destNode - The `destNode` parameter is either an instance of
   * `R` or an instance of `BSTNOptKeyOrNode<K, AVLTreeNode<K, V>>`.
   * @returns The method is returning the `destNodeEnsured` object if both `srcNodeEnsured` and
   * `destNodeEnsured` are truthy. Otherwise, it returns `undefined`.
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

        destNodeEnsured.key = srcNodeEnsured.key;
        if (!this._isMapMode) destNodeEnsured.value = srcNodeEnsured.value;
        destNodeEnsured.height = srcNodeEnsured.height;

        srcNodeEnsured.key = tempNode.key;
        if (!this._isMapMode) srcNodeEnsured.value = tempNode.value;
        srcNodeEnsured.height = tempNode.height;
      }

      return destNodeEnsured;
    }
    return undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function calculates the balance factor of a node in a binary tree.
   * @param {AVLTreeNode<K, V>} node - The parameter "node" is of type "AVLTreeNode<K, V>", which likely represents a node in a
   * binary tree data structure.
   * @returns the balance factor of a given node. The balance factor is calculated by subtracting the
   * height of the left subtree from the height of the right subtree.
   */
  protected _balanceFactor(node: AVLTreeNode<K, V>): number {
    if (!node.right)
      // node has no right subtree
      return -node.height;
    else if (!node.left)
      // node has no left subtree
      return +node.height;
    else return node.right.height - node.left.height;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function updates the height of a node in a binary tree based on the heights of its left and
   * right children.
   * @param {AVLTreeNode<K, V>} node - The parameter "node" represents a node in a binary tree data structure.
   */
  protected _updateHeight(node: AVLTreeNode<K, V>): void {
    if (!node.left && !node.right) node.height = 0;
    else if (!node.left) {
      const rightHeight = node.right ? node.right.height : 0;
      node.height = 1 + rightHeight;
    } else if (!node.right) node.height = 1 + node.left.height;
    else node.height = 1 + Math.max(node.right.height, node.left.height);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_balanceLL` function performs a left-left rotation to balance a binary search tree.
   * @param {AVLTreeNode<K, V>} A - A is a node in a binary tree.
   */
  protected _balanceLL(A: AVLTreeNode<K, V>): void {
    const parentOfA = A.parent;
    const B = A.left;
    if (B !== null) A.parent = B;
    if (B && B.right) {
      B.right.parent = A;
    }
    if (B) B.parent = parentOfA;
    if (A === this.root) {
      if (B) this._setRoot(B);
    } else {
      if (parentOfA?.left === A) {
        parentOfA.left = B;
      } else {
        if (parentOfA) parentOfA.right = B;
      }
    }

    if (B) {
      A.left = B.right;
      B.right = A;
    }
    this._updateHeight(A);
    if (B) this._updateHeight(B);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_balanceLR` function performs a left-right rotation to balance a binary tree.
   * @param {AVLTreeNode<K, V>} A - A is a node in a binary tree.
   */
  protected _balanceLR(A: AVLTreeNode<K, V>): void {
    const parentOfA = A.parent;
    const B = A.left;
    let C = undefined;
    if (B) {
      C = B.right;
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_balanceRR` performs a right-right rotation to balance a binary tree.
   * @param {AVLTreeNode<K, V>} A - A is a node in a binary tree.
   */
  protected _balanceRR(A: AVLTreeNode<K, V>): void {
    const parentOfA = A.parent;
    const B = A.right;
    if (B !== null) A.parent = B;
    if (B) {
      if (B.left) {
        B.left.parent = A;
      }
      B.parent = parentOfA;
    }

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

    if (B) {
      A.right = B.left;
      B.left = A;
    }
    this._updateHeight(A);
    if (B) this._updateHeight(B);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_balanceRL` performs a right-left rotation to balance a binary tree.
   * @param {AVLTreeNode<K, V>} A - A is a node in a binary tree.
   */
  protected _balanceRL(A: AVLTreeNode<K, V>): void {
    const parentOfA = A.parent;
    const B = A.right;
    let C = undefined;
    if (B) {
      C = B.left;
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

    if (C) A.right = C.left;
    if (B && C) B.left = C.right;
    if (C) C.left = A;
    if (C) C.right = B;

    this._updateHeight(A);
    if (B) this._updateHeight(B);
    if (C) this._updateHeight(C);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_balancePath` function is used to update the heights of nodes and perform rotation operations
   * to restore balance in an AVL tree after inserting a node.
   * @param { K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined]  | null | undefined } node - The `node` parameter can be of type `R` or
   * `
   K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined]  | null | undefined `.
   */
  protected _balancePath(node: K | AVLTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined): void {
    node = this.ensureNode(node);
    const path = this.getPathToRoot(node, node => node, false); // first O(log n) + O(log n)
    for (let i = 0; i < path.length; i++) {
      // second O(log n)
      const A = path[i];
      if (A) {
        // Update Heights: After inserting a node, backtrack from the insertion point to the root node, updating the height of each node along the way.
        this._updateHeight(A); // first O(1)
        // Check Balance: Simultaneously with height updates, check if each node violates the balance property of an AVL tree.
        // Balance Restoration: If a balance issue is discovered after inserting a node, it requires balance restoration operations. Balance restoration includes four basic cases where rotation operations need to be performed to fix the balance:
        switch (
          this._balanceFactor(A) // second O(1)
        ) {
          case -2:
            if (A && A.left) {
              if (this._balanceFactor(A.left) <= 0) {
                // second O(1)
                // Left Rotation (LL Rotation): When the inserted node is in the left subtree of the left subtree, causing an imbalance.
                this._balanceLL(A);
              } else {
                // Left-Right Rotation (LR Rotation): When the inserted node is in the right subtree of the left subtree, causing an imbalance.
                this._balanceLR(A);
              }
            }
            break;
          case +2:
            if (A && A.right) {
              if (this._balanceFactor(A.right) >= 0) {
                // Right Rotation (RR Rotation): When the inserted node is in the right subtree of the right subtree, causing an imbalance.
                this._balanceRR(A);
              } else {
                // Right-Left Rotation (RL Rotation): When the inserted node is in the left subtree of the right subtree, causing an imbalance.
                this._balanceRL(A);
              }
            }
        }
        // TODO So far, no sure if this is necessary that Recursive Repair: Once rotation operations are executed, it may cause imbalance issues at higher levels of the tree. Therefore, you need to recursively check and repair imbalance problems upwards until you reach the root node.
      }
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function replaces an old node with a new node and sets the height of the new node to be the
   * same as the old node.
   * @param {AVLTreeNode<K, V>} oldNode - The `oldNode` parameter represents the node that needs to be replaced in
   * the data structure.
   * @param {AVLTreeNode<K, V>} newNode - The `newNode` parameter is the new node that will replace the `oldNode` in
   * the data structure.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, with the `oldNode` and `newNode` as arguments.
   */
  protected override _replaceNode(oldNode: AVLTreeNode<K, V>, newNode: AVLTreeNode<K, V>): AVLTreeNode<K, V> {
    newNode.height = oldNode.height;

    return super._replaceNode(oldNode, newNode);
  }
}
