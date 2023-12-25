/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import { BST, BSTNode } from './bst';
import type {
  AVLTreeNested,
  AVLTreeNodeNested,
  AVLTreeOptions,
  BinaryTreeDeleteResult,
  BSTNKeyOrNode,
  BTNCallback,
  KeyOrNodeOrEntry
} from '../../types';
import { IBinaryTree } from '../../interfaces';

export class AVLTreeNode<K = any, V = any, N extends AVLTreeNode<K, V, N> = AVLTreeNodeNested<K, V>> extends BSTNode<
  K,
  V,
  N
> {
  height: number;

  constructor(key: K, value?: V) {
    super(key, value);
    this.height = 0;
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
 */
export class AVLTree<
    K = any,
    V = any,
    N extends AVLTreeNode<K, V, N> = AVLTreeNode<K, V, AVLTreeNodeNested<K, V>>,
    TREE extends AVLTree<K, V, N, TREE> = AVLTree<K, V, N, AVLTreeNested<K, V, N>>
  >
  extends BST<K, V, N, TREE>
  implements IBinaryTree<K, V, N, TREE>
{
  /**
   * The constructor function initializes an AVLTree object with optional keysOrNodesOrEntries and options.
   * @param [keysOrNodesOrEntries] - The `keysOrNodesOrEntries` parameter is an optional iterable of `KeyOrNodeOrEntry<K, V, N>`
   * objects. It represents a collection of nodes that will be added to the AVL tree during
   * initialization.
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the AVL tree. It is of type `Partial<AVLTreeOptions>`, which means that you can
   * provide only a subset of the properties defined in the `AVLTreeOptions` interface.
   */
  constructor(keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, N>> = [], options?: AVLTreeOptions<K>) {
    super([], options);
    if (keysOrNodesOrEntries) super.addMany(keysOrNodesOrEntries);
  }

  /**
   * The function creates a new AVL tree node with the specified key and value.
   * @param {K} key - The key parameter is the key value that will be associated with
   * the new node. It is used to determine the position of the node in the binary search tree.
   * @param [value] - The parameter `value` is an optional value that can be assigned to the node. It is of
   * type `V`, which means it can be any value that is assignable to the `value` property of the
   * node type `N`.
   * @returns a new AVLTreeNode object with the specified key and value.
   */
  override createNode(key: K, value?: V): N {
    return new AVLTreeNode<K, V, N>(key, value) as N;
  }

  /**
   * The function creates a new AVL tree with the specified options and returns it.
   * @param {AVLTreeOptions} [options] - The `options` parameter is an optional object that can be
   * passed to the `createTree` function. It is used to customize the behavior of the AVL tree that is
   * being created.
   * @returns a new AVLTree object.
   */
  override createTree(options?: AVLTreeOptions<K>): TREE {
    return new AVLTree<K, V, N, TREE>([], {
      iterationType: this.iterationType,
      variant: this.variant,
      ...options
    }) as TREE;
  }

  /**
   * The function checks if an keyOrNodeOrEntry is an instance of AVLTreeNode.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is of type `KeyOrNodeOrEntry<K, V, N>`.
   * @returns a boolean value indicating whether the keyOrNodeOrEntry is an instance of the AVLTreeNode class.
   */
  override isNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, N>): keyOrNodeOrEntry is N {
    return keyOrNodeOrEntry instanceof AVLTreeNode;
  }

  /**
   * The function "isNotNodeInstance" checks if a potential key is a K.
   * @param {any} potentialKey - The potentialKey parameter is of type any, which means it can be any
   * data type.
   * @returns a boolean value indicating whether the potentialKey is of type number or not.
   */
  override isNotNodeInstance(potentialKey: KeyOrNodeOrEntry<K, V, N>): potentialKey is K {
    return !(potentialKey instanceof AVLTreeNode);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   * logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (BST) has logarithmic time complexity. constant space, as it doesn't use additional data structures that scale with input size.
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the add method of a binary tree node and balances the tree after inserting
   * a new node.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can be either a key, a node, or an
   * entry.
   * @param {V} [value] - The `value` parameter represents the value associated with the key that is
   * being added to the binary tree.
   * @returns The method is returning either the inserted node or undefined.
   */
  override add(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, N>, value?: V): boolean {
    if (keyOrNodeOrEntry === null) return false;
    const inserted = super.add(keyOrNodeOrEntry, value);
    if (inserted) this._balancePath(keyOrNodeOrEntry);
    return inserted;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the delete method of a binary tree, performs the deletion, and then
   * balances the tree if necessary.
   * @param identifier - The `identifier` parameter is the value or condition used to identify the
   * node(s) to be deleted from the binary tree. It can be of any type and is the return type of the
   * `callback` function.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * that is deleted from the binary tree. It is an optional parameter and if not provided, it will
   * default to the `_defaultOneParamCallback` function. The `callback` function should have a single
   * parameter of type `N
   * @returns The method is returning an array of `BinaryTreeDeleteResult<N>`.
   */
  override delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C = this._defaultOneParamCallback as C
  ): BinaryTreeDeleteResult<N>[] {
    if ((identifier as any) instanceof AVLTreeNode) callback = (node => node) as C;
    const deletedResults = super.delete(identifier, callback);
    for (const { needBalanced } of deletedResults) {
      if (needBalanced) {
        this._balancePath(needBalanced);
      }
    }
    return deletedResults;
  }

  /**
   * The `_swapProperties` function swaps the key, value, and height properties between two nodes in a binary
   * tree.
   * @param {K | N | undefined} srcNode - The `srcNode` parameter represents the source node that
   * needs to be swapped with the destination node. It can be of type `K`, `N`, or `undefined`.
   * @param {K | N  | undefined} destNode - The `destNode` parameter represents the destination
   * node where the values from the source node will be swapped to.
   * @returns either the `destNode` object if both `srcNode` and `destNode` are defined, or `undefined`
   * if either `srcNode` or `destNode` is undefined.
   */
  protected override _swapProperties(srcNode: BSTNKeyOrNode<K, N>, destNode: BSTNKeyOrNode<K, N>): N | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);

    if (srcNode && destNode) {
      const { key, value, height } = destNode;
      const tempNode = this.createNode(key, value);

      if (tempNode) {
        tempNode.height = height;

        destNode.key = srcNode.key;
        destNode.value = srcNode.value;
        destNode.height = srcNode.height;

        srcNode.key = tempNode.key;
        srcNode.value = tempNode.value;
        srcNode.height = tempNode.height;
      }

      return destNode;
    }
    return undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   * constant time, as it performs a fixed number of operations. constant space, as it only uses a constant amount of memory.
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function calculates the balance factor of a node in a binary tree.
   * @param {N} node - The parameter "node" represents a node in a binary tree data structure.
   * @returns the balance factor of a given node. The balance factor is calculated by subtracting the
   * height of the left subtree from the height of the right subtree.
   */
  protected _balanceFactor(node: N): number {
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
   * constant time, as it performs a fixed number of operations. constant space, as it only uses a constant amount of memory.
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function updates the height of a node in a binary tree based on the heights of its left and
   * right children.
   * @param {N} node - The parameter "node" represents a node in a binary tree data structure.
   */
  protected _updateHeight(node: N): void {
    if (!node.left && !node.right) node.height = 0;
    else if (!node.left) {
      const rightHeight = node.right ? node.right.height : 0;
      node.height = 1 + rightHeight;
    } else if (!node.right) node.height = 1 + node.left.height;
    else node.height = 1 + Math.max(node.right.height, node.left.height);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   * logarithmic time, where "n" is the number of nodes in the tree. The method traverses the path from the inserted node to the root. constant space, as it doesn't use additional data structures that scale with input size.
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_balancePath` function is used to update the heights of nodes and perform rotation operations
   * to restore balance in an AVL tree after inserting a node.
   * @param {N} node - The `node` parameter in the `_balancePath` function represents the node in the
   * AVL tree that needs to be balanced.
   */
  protected _balancePath(node: KeyOrNodeOrEntry<K, V, N>): void {
    node = this.ensureNode(node);
    const path = this.getPathToRoot(node, false); // first O(log n) + O(log n)
    for (let i = 0; i < path.length; i++) {
      // second O(log n)
      const A = path[i];
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

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   * constant time, as these methods perform a fixed number of operations. constant space, as they only use a constant amount of memory.
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_balanceLL` performs a left-left rotation to balance a binary tree.
   * @param {N} A - A is a node in a binary tree.
   */
  protected _balanceLL(A: N): void {
    const parentOfA = A.parent;
    const B = A.left;
    A.parent = B;
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
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_balanceLR` function performs a left-right rotation to balance a binary tree.
   * @param {N} A - A is a node in a binary tree.
   */
  protected _balanceLR(A: N): void {
    const parentOfA = A.parent;
    const B = A.left;
    let C = undefined;
    if (B) {
      C = B.right;
    }
    if (A) A.parent = C;
    if (B) B.parent = C;

    if (C) {
      if (C.left) {
        C.left.parent = B;
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
    B && this._updateHeight(B);
    C && this._updateHeight(C);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_balanceRR` performs a right-right rotation to balance a binary tree.
   * @param {N} A - A is a node in a binary tree.
   */
  protected _balanceRR(A: N): void {
    const parentOfA = A.parent;
    const B = A.right;
    A.parent = B;
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
    B && this._updateHeight(B);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_balanceRL` performs a right-left rotation to balance a binary tree.
   * @param {N} A - A is a node in a binary tree.
   */
  protected _balanceRL(A: N): void {
    const parentOfA = A.parent;
    const B = A.right;
    let C = undefined;
    if (B) {
      C = B.left;
    }

    A.parent = C;
    if (B) B.parent = C;

    if (C) {
      if (C.left) {
        C.left.parent = A;
      }
      if (C.right) {
        C.right.parent = B;
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
    B && this._updateHeight(B);
    C && this._updateHeight(C);
  }

  protected _replaceNode(oldNode: N, newNode: N): N {
    newNode.height = oldNode.height;

    return super._replaceNode(oldNode, newNode);
  }
}
