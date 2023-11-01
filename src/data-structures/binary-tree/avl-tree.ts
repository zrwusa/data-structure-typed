/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {BST, BSTNode} from './bst';
import type {AVLTreeNodeNested, AVLTreeOptions, BinaryTreeDeletedResult, BTNKey} from '../../types';
import {BTNCallback} from '../../types';
import {IBinaryTree} from '../../interfaces';

export class AVLTreeNode<V = any, N extends AVLTreeNode<V, N> = AVLTreeNodeNested<V>> extends BSTNode<V, N> {
  height: number;

  constructor(key: BTNKey, value?: V) {
    super(key, value);
    this.height = 0;
  }
}

export class AVLTree<V = any, N extends AVLTreeNode<V, N> = AVLTreeNode<V, AVLTreeNodeNested<V>>>
  extends BST<V, N>
  implements IBinaryTree<V, N>
{
  /**
   * This is a constructor function for an AVL tree data structure in TypeScript.
   * @param {AVLTreeOptions} [options] - The `options` parameter is an optional object that can be passed to the
   * constructor of the AVLTree class. It allows you to customize the behavior of the AVL tree by providing different
   * options.
   */
  constructor(options?: AVLTreeOptions) {
    super(options);
  }

  /**
   * The function creates a new AVL tree node with the specified key and value.
   * @param {BTNKey} key - The key parameter is the key value that will be associated with
   * the new node. It is used to determine the position of the node in the binary search tree.
   * @param [value] - The parameter `value` is an optional value that can be assigned to the node. It is of
   * type `V`, which means it can be any value that is assignable to the `value` property of the
   * node type `N`.
   * @returns a new AVLTreeNode object with the specified key and value.
   */
  override createNode(key: BTNKey, value?: V): N {
    return new AVLTreeNode<V, N>(key, value) as N;
  }

  /**
   * The function overrides the add method of a binary tree node and balances the tree after inserting
   * a new node.
   * @param {BTNKey | N | null} keyOrNode - The `keyOrNode` parameter can accept either a
   * `BTNKey` or a `N` (which represents a node in the binary tree) or `null`.
   * @param [value] - The `value` parameter is the value that you want to assign to the new node that you
   * are adding to the binary search tree.
   * @returns The method is returning the inserted node (`N`), `null`, or `undefined`.
   */
  override add(keyOrNode: BTNKey | N | null, value?: V): N | null | undefined {
    const inserted = super.add(keyOrNode, value);
    if (inserted) this._balancePath(inserted);
    return inserted;
  }

  /**
   * The function overrides the delete method of a binary tree and balances the tree after deleting a
   * node if necessary.
   * @param {ReturnType<C>} identifier - The `identifier` parameter is either a
   * `BTNKey` or a generic type `N`. It represents the property of the node that we are
   * searching for. It can be a specific key value or any other property of the node.
   * @param callback - The `callback` parameter is a function that takes a node as input and returns a
   * value. This value is compared with the `identifier` parameter to determine if the node should be
   * included in the result. The `callback` parameter has a default value of
   * `((node: N) => node.key)`
   * @returns The method is returning an array of `BinaryTreeDeletedResult<N>` objects.
   */
  override delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C = ((node: N) => node.key) as C
  ): BinaryTreeDeletedResult<N>[] {
    if ((identifier as any) instanceof AVLTreeNode) callback = (node => node) as C;
    const deletedResults = super.delete(identifier, callback);
    for (const {needBalanced} of deletedResults) {
      if (needBalanced) {
        this._balancePath(needBalanced);
      }
    }
    return deletedResults;
  }

  /**
   * The function swaps the key, value, and height properties between two nodes in a binary tree.
   * @param {N} srcNode - The `srcNode` parameter represents the source node that needs to be swapped
   * with the `destNode`.
   * @param {N} destNode - The `destNode` parameter represents the destination node where the values
   * from the source node (`srcNode`) will be swapped to.
   * @returns The method is returning the `destNode` after swapping its properties with the `srcNode`.
   */
  protected override _swap(srcNode: N, destNode: N): N {
    const {key, value, height} = destNode;
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

  /**
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
   * The `_balancePath` function is used to update the heights of nodes and perform rotation operations
   * to restore balance in an AVL tree after inserting a node.
   * @param {N} node - The `node` parameter in the `_balancePath` function represents the node in the
   * AVL tree that needs to be balanced.
   */
  protected _balancePath(node: N): void {
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
   * The `_balanceLR` function performs a left-right rotation to balance a binary tree.
   * @param {N} A - A is a node in a binary tree.
   */
  protected _balanceLR(A: N): void {
    const parentOfA = A.parent;
    const B = A.left;
    let C = null;
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
   * The function `_balanceRL` performs a right-left rotation to balance a binary tree.
   * @param {N} A - A is a node in a binary tree.
   */
  protected _balanceRL(A: N): void {
    const parentOfA = A.parent;
    const B = A.right;
    let C = null;
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
}
