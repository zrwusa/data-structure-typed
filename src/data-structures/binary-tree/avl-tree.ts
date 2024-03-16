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
  BTNKeyOrNodeOrEntry
} from '../../types';
import { BTNEntry } from '../../types';
import { IBinaryTree } from '../../interfaces';

export class AVLTreeNode<
  K = any,
  V = any,
  NODE extends AVLTreeNode<K, V, NODE> = AVLTreeNodeNested<K, V>
> extends BSTNode<K, V, NODE> {
  /**
   * The constructor function initializes a new instance of a class with a key and an optional value,
   * and sets the height property to 0.
   * @param {K} key - The "key" parameter is of type K, which represents the type of the key for the
   * constructor. It is used to initialize the key property of the object being created.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It represents the
   * value associated with the key in the constructor.
   */
  constructor(key: K, value?: V) {
    super(key, value);
    this._height = 0;
  }

  protected _height: number;

  /**
   * The function returns the value of the height property.
   * @returns The height of the object.
   */
  get height(): number {
    return this._height;
  }

  /**
   * The above function sets the value of the height property.
   * @param {number} value - The value parameter is a number that represents the new height value to be
   * set.
   */
  set height(value: number) {
    this._height = value;
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
  R = BTNEntry<K, V>,
  NODE extends AVLTreeNode<K, V, NODE> = AVLTreeNode<K, V, AVLTreeNodeNested<K, V>>,
  TREE extends AVLTree<K, V, R, NODE, TREE> = AVLTree<K, V, R, NODE, AVLTreeNested<K, V, R, NODE>>
>
  extends BST<K, V, R, NODE, TREE>
  implements IBinaryTree<K, V, R, NODE, TREE> {
  /**
   * This is a constructor function for an AVLTree class that initializes the tree with keys, nodes,
   * entries, or raw elements.
   * @param keysOrNodesOrEntriesOrRawElements - The `keysOrNodesOrEntriesOrRawElements` parameter is an
   * iterable object that can contain either keys, nodes, entries, or raw elements. These elements will
   * be used to initialize the AVLTree.
   * @param [options] - The `options` parameter is an optional object that can be used to customize the
   * behavior of the AVLTree. It can include properties such as `compareFn` (a function used to compare
   * keys), `allowDuplicates` (a boolean indicating whether duplicate keys are allowed), and
   * `nodeBuilder` (
   */
  constructor(
    keysOrNodesOrEntriesOrRawElements: Iterable<R | BTNKeyOrNodeOrEntry<K, V, NODE>> = [],
    options?: AVLTreeOptions<K, V, R>
  ) {
    super([], options);
    if (keysOrNodesOrEntriesOrRawElements) super.addMany(keysOrNodesOrEntriesOrRawElements);
  }

  /**
   * The function creates a new AVL tree node with the given key and value.
   * @param {K} key - The key parameter is of type K, which represents the key of the node being
   * created.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It represents the
   * value associated with the key in the node being created.
   * @returns The method is returning a new instance of the AVLTreeNode class, casted as the generic
   * type NODE.
   */
  override createNode(key: K, value?: V): NODE {
    return new AVLTreeNode<K, V, NODE>(key, value) as NODE;
  }

  /**
   * The function creates a new AVL tree with the specified options and returns it.
   * @param {AVLTreeOptions} [options] - The `options` parameter is an optional object that can be
   * passed to the `createTree` function. It is used to customize the behavior of the AVL tree that is
   * being created.
   * @returns a new AVLTree object.
   */
  override createTree(options?: AVLTreeOptions<K, V, R>): TREE {
    return new AVLTree<K, V, R, NODE, TREE>([], {
      iterationType: this.iterationType,
      comparator: this.comparator,
      ...options
    }) as TREE;
  }

  /**
   * The function checks if the input is an instance of AVLTreeNode.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyOrNodeOrEntryOrRawElement` is
   * an instance of the `AVLTreeNode` class.
   */
  override isNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>
  ): keyOrNodeOrEntryOrRawElement is NODE {
    return keyOrNodeOrEntryOrRawElement instanceof AVLTreeNode;
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
   * The function overrides the add method of a class and inserts a key-value pair into a data
   * structure, then balances the path.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can accept values of type `R`, `BTNKeyOrNodeOrEntry<K, V, NODE>`, or
   * `RawElement`.
   * @param {V} [value] - The `value` parameter is an optional value that you want to associate with
   * the key or node being added to the data structure.
   * @returns The method is returning a boolean value.
   */
  override add(keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>, value?: V): boolean {
    if (keyOrNodeOrEntryOrRawElement === null) return false;
    const inserted = super.add(keyOrNodeOrEntryOrRawElement, value);
    if (inserted) this._balancePath(keyOrNodeOrEntryOrRawElement);
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
   * The function overrides the delete method of a binary tree class and performs additional operations
   * to balance the tree after deletion.
   * @param identifier - The `identifier` parameter is the value or condition used to identify the
   * node(s) to be deleted from the binary tree. It can be of any type that is compatible with the
   * binary tree's node type.
   * @param {C} callback - The `callback` parameter is a function that will be used to determine if a
   * node should be deleted or not. It is optional and has a default value of `this._DEFAULT_CALLBACK`.
   * @returns The method is returning an array of BinaryTreeDeleteResult<NODE> objects.
   */
  override delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C>,
    callback: C = this._DEFAULT_CALLBACK as C
  ): BinaryTreeDeleteResult<NODE>[] {
    const deletedResults = super.delete(identifier, callback);
    for (const { needBalanced } of deletedResults) {
      if (needBalanced) {
        this._balancePath(needBalanced);
      }
    }
    return deletedResults;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_swapProperties` function swaps the key, value, and height properties between two nodes in a
   * binary search tree.
   * @param {R | BSTNKeyOrNode<K, NODE>} srcNode - The `srcNode` parameter represents either a node
   * object (`NODE`) or a key-value pair (`R`) that is being swapped with another node.
   * @param {R | BSTNKeyOrNode<K, NODE>} destNode - The `destNode` parameter is either an instance of
   * `R` or an instance of `BSTNKeyOrNode<K, NODE>`.
   * @returns The method is returning the `destNodeEnsured` object if both `srcNodeEnsured` and
   * `destNodeEnsured` are truthy. Otherwise, it returns `undefined`.
   */
  protected override _swapProperties(
    srcNode: R | BSTNKeyOrNode<K, NODE>,
    destNode: R | BSTNKeyOrNode<K, NODE>
  ): NODE | undefined {
    const srcNodeEnsured = this.ensureNode(srcNode);
    const destNodeEnsured = this.ensureNode(destNode);

    if (srcNodeEnsured && destNodeEnsured) {
      const { key, value, height } = destNodeEnsured;
      const tempNode = this.createNode(key, value);

      if (tempNode) {
        tempNode.height = height;

        destNodeEnsured.key = srcNodeEnsured.key;
        destNodeEnsured.value = srcNodeEnsured.value;
        destNodeEnsured.height = srcNodeEnsured.height;

        srcNodeEnsured.key = tempNode.key;
        srcNodeEnsured.value = tempNode.value;
        srcNodeEnsured.height = tempNode.height;
      }

      return destNodeEnsured;
    }
    return undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function calculates the balance factor of a node in a binary tree.
   * @param {NODE} node - The parameter "node" is of type "NODE", which likely represents a node in a
   * binary tree data structure.
   * @returns the balance factor of a given node. The balance factor is calculated by subtracting the
   * height of the left subtree from the height of the right subtree.
   */
  protected _balanceFactor(node: NODE): number {
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
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function updates the height of a node in a binary tree based on the heights of its left and
   * right children.
   * @param {NODE} node - The parameter "node" represents a node in a binary tree data structure.
   */
  protected _updateHeight(node: NODE): void {
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
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_balanceLL` function performs a left-left rotation to balance a binary search tree.
   * @param {NODE} A - A is a node in a binary tree.
   */
  protected _balanceLL(A: NODE): void {
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
   * @param {NODE} A - A is a node in a binary tree.
   */
  protected _balanceLR(A: NODE): void {
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
   * @param {NODE} A - A is a node in a binary tree.
   */
  protected _balanceRR(A: NODE): void {
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
   * @param {NODE} A - A is a node in a binary tree.
   */
  protected _balanceRL(A: NODE): void {
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
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} node - The `node` parameter can be of type `R` or
   * `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   */
  protected _balancePath(node: R | BTNKeyOrNodeOrEntry<K, V, NODE>): void {
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
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function replaces an old node with a new node and sets the height of the new node to be the
   * same as the old node.
   * @param {NODE} oldNode - The `oldNode` parameter represents the node that needs to be replaced in
   * the data structure.
   * @param {NODE} newNode - The `newNode` parameter is the new node that will replace the `oldNode` in
   * the data structure.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, with the `oldNode` and `newNode` as arguments.
   */
  protected override _replaceNode(oldNode: NODE, newNode: NODE): NODE {
    newNode.height = oldNode.height;

    return super._replaceNode(oldNode, newNode);
  }
}
