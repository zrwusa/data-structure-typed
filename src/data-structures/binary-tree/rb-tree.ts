/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import {
  BinaryTreeDeletedResult,
  BTNCallback,
  BTNKey,
  IterationType,
  RBTNColor,
  RBTreeNodeNested,
  RBTreeOptions
} from '../../types';
import {BST, BSTNode} from "./bst";
import {IBinaryTree} from "../../interfaces";
import {BinaryTreeNode} from "./binary-tree";

export class RBTreeNode<V = any, N extends RBTreeNode<V, N> = RBTreeNodeNested<V>> extends BSTNode<V, N> {
  color: RBTNColor;
  constructor(key: BTNKey, value?: V, color: RBTNColor = RBTNColor.BLACK) {
    super(key, value);
    this.color = color;
  }
}

/**
 * 1. Each node is either red or black.
 * 2. The root node is always black.
 * 3. Leaf nodes are typically NIL nodes and are considered black.
 * 4. Red nodes must have black children.
 * 5. Black balance: Every path from any node to each of its leaf nodes contains the same number of black nodes.
 */
export class RedBlackTree<V = any, N extends RBTreeNode<V, N> = RBTreeNode<V, RBTreeNodeNested<V>>>
  extends BST<V, N>
  implements IBinaryTree<V, N>
{

  constructor(options?: RBTreeOptions) {
    super(options);
    this._root = this.NIL;
  }

  protected _root: N;

  get root(): N {
    return this._root;
  }

  protected _size: number = 0;

  get size(): number {
    return this._size;
  }

  NIL: N = new RBTreeNode<V>(NaN) as unknown as N;

  override add(keyOrNode: BTNKey | N | null | undefined, value?: V): N | undefined {
    let node: N;
    if (typeof keyOrNode === 'number') {
      node = this.createNode(keyOrNode, value, RBTNColor.RED);
    } else if(keyOrNode instanceof RBTreeNode) {
      node = keyOrNode;
    } else if (keyOrNode === null) {
      return;
    } else if (keyOrNode === undefined) {
      return;
    } else {
      return;
    }

    node.left = this.NIL;
    node.right = this.NIL;

    let y: N | undefined = undefined;
    let x: N | undefined = this.root;

    while (x !== this.NIL) {
      y = x;
      if (x && node.key < x.key) {
        x = x.left;
      } else {
        x = x?.right;
      }
    }

    node.parent = y;
    if (y === undefined) {
      this._setRoot(node);
    } else if (node.key < y.key) {
      y.left = node;
    } else {
      y.right = node;
    }

    if (node.parent === undefined) {
      node.color = RBTNColor.BLACK;
      this._size++;
      return;
    }

    if (node.parent.parent === undefined) {
      this._size++;
      return;
    }

    this._fixInsert(node);
    this._size++;
  }

  override createNode(key: BTNKey, value?: V, color: RBTNColor = RBTNColor.BLACK): N {
    return new RBTreeNode<V, N>(key, value, color) as N;
  }


  delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this.defaultOneParamCallback as C
  ): BinaryTreeDeletedResult<N>[] {
    const ans: BinaryTreeDeletedResult<N>[] = [];
    if (identifier === null) return ans;
    const helper = (node: N | undefined): void => {
      let z: N = this.NIL;
      let x: N | undefined, y: N;
      while (node !== this.NIL) {
        if (node && callback(node) === identifier) {
          z = node;
        }

        if (node && identifier && callback(node) <= identifier) {
          node = node.right;
        } else {
          node = node?.left;
        }
      }

      if (z === this.NIL) {
        this._size--;
        return;
      }

      y = z;
      let yOriginalColor: number = y.color;
      if (z.left === this.NIL) {
        x = z.right;
        this._rbTransplant(z, z.right!);
      } else if (z.right === this.NIL) {
        x = z.left;
        this._rbTransplant(z, z.left!);
      } else {
        y = this.getLeftMost(z.right);
        yOriginalColor = y.color;
        x = y.right;
        if (y.parent === z) {
          x!.parent = y;
        } else {
          this._rbTransplant(y, y.right!);
          y.right = z.right;
          y.right!.parent = y;
        }

        this._rbTransplant(z, y);
        y.left = z.left;
        y.left!.parent = y;
        y.color = z.color;
      }
      if (yOriginalColor === RBTNColor.BLACK) {
        this._fixDelete(x!);
      }
      this._size--;
    };
    helper(this.root);
    // TODO
    return ans;
  }

  isRealNode(node: N | undefined): node is N {
    return node !== this.NIL && node !== undefined;
  }

  getNode<C extends BTNCallback<N, BTNKey>>(
    identifier: BTNKey,
    callback?: C,
    beginRoot?: N | undefined,
    iterationType?: IterationType
  ): N  | undefined;

  getNode<C extends BTNCallback<N, N>>(
    identifier: N | undefined,
    callback?: C,
    beginRoot?: N | undefined,
    iterationType?: IterationType
  ): N  | undefined;

  getNode<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C,
    beginRoot?: N | undefined,
    iterationType?: IterationType
  ): N  | undefined;

  /**
   * The function `get` returns the first node in a binary tree that matches the given property or key.
   * @param {BTNKey | N} identifier - The `identifier` parameter is the key or value of
   * the node that you want to find in the binary tree. It can be either a `BTNKey` or `N`
   * type.
   * @param callback - The `callback` parameter is a function that is used to determine whether a node
   * matches the desired criteria. It takes a node as input and returns a boolean value indicating
   * whether the node matches the criteria or not. The default callback function
   * (`this.defaultOneParamCallback`) is used if no callback function is
   * @param beginRoot - The `beginRoot` parameter is the starting point for the search. It specifies
   * the root node from which the search should begin.
   * @param iterationType - The `iterationType` parameter specifies the type of iteration to be
   * performed when searching for a node in the binary tree. It can have one of the following values:
   * @returns either the found node (of type N) or null if no node is found.
   */
  getNode<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this.defaultOneParamCallback as C,
    beginRoot = this.root,
    iterationType = this.iterationType
  ): N | null | undefined {
    if ((identifier as any) instanceof BinaryTreeNode) callback = (node => node) as C;

    return this.getNodes(identifier, callback, true, beginRoot, iterationType)[0] ?? undefined;
  }

  /**
   * The function returns the leftmost node in a red-black tree.
   * @param {RBTreeNode} node - The parameter "node" is of type RBTreeNode, which represents a node in
   * a Red-Black Tree.
   * @returns The leftmost node in the given RBTreeNode.
   */
  getLeftMost(node: N = this.root): N {
    while (node.left !== undefined && node.left !== this.NIL) {
      node = node.left;
    }
    return node;
  }

  /**
   * The function returns the rightmost node in a red-black tree.
   * @param {RBTreeNode} node - The parameter "node" is of type RBTreeNode.
   * @returns the rightmost node in a red-black tree.
   */
  getRightMost(node: N): N {
    while (node.right !== undefined && node.right !== this.NIL) {
      node = node.right;
    }
    return node;
  }

  /**
   * The function returns the successor of a given node in a red-black tree.
   * @param {RBTreeNode} x - RBTreeNode - The node for which we want to find the successor.
   * @returns the successor of the given RBTreeNode.
   */
  getSuccessor(x: N): N | undefined {
    if (x.right !== this.NIL) {
      return this.getLeftMost(x.right);
    }

    let y: N | undefined = x.parent;
    while (y !== this.NIL && y !== undefined && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  /**
   * The function returns the predecessor of a given node in a red-black tree.
   * @param {RBTreeNode} x - The parameter `x` is of type `RBTreeNode`, which represents a node in a
   * Red-Black Tree.
   * @returns the predecessor of the given RBTreeNode 'x'.
   */
  getPredecessor(x: N): N {
    if (x.left !== this.NIL) {
      return this.getRightMost(x.left!);
    }

    let y: N | undefined = x.parent;
    while (y !== this.NIL && x === y!.left) {
      x = y!;
      y = y!.parent;
    }

    return y!;
  }

  override clear() {
    this._root = this.NIL;
    this._size = 0;
  }

  protected override _setRoot(v: N) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * The function performs a left rotation on a red-black tree node.
   * @param {RBTreeNode} x - The parameter `x` is a RBTreeNode object.
   */
  protected _leftRotate(x: N): void {
    if (x.right) {
      const y: N = x.right;
      x.right = y.left;
      if (y.left !== this.NIL) {
        if (y.left) y.left.parent = x;
      }
      y.parent = x.parent;
      if (x.parent === undefined) {
        this._setRoot(y);
      } else if (x === x.parent.left) {
        x.parent.left = y;
      } else {
        x.parent.right = y;
      }
      y.left = x;
      x.parent = y;
    }
  }

  /**
   * The function performs a right rotation on a red-black tree node.
   * @param {RBTreeNode} x - x is a RBTreeNode, which represents the node that needs to be right
   * rotated.
   */
  protected _rightRotate(x: N): void {
    if (x.left) {
      const y: N = x.left;
      x.left = y.right;
      if (y.right !== this.NIL) {
        if (y.right) y.right.parent = x;
      }
      y.parent = x.parent;
      if (x.parent === undefined) {
        this._setRoot(y);
      } else if (x === x.parent.right) {
        x.parent.right = y;
      } else {
        x.parent.left = y;
      }
      y.right = x;
      x.parent = y;
    }
  }

  /**
   * The _fixDelete function is used to rebalance the Red-Black Tree after a node deletion.
   * @param {RBTreeNode} x - The parameter `x` is of type `RBTreeNode`, which represents a node in a
   * red-black tree.
   */
  protected _fixDelete(x: N): void {
    let s: N | undefined;
    while (x !== this.root && x.color === RBTNColor.BLACK) {
      if (x.parent && x === x.parent.left) {
        s = x.parent.right!;
        if (s.color === 1) {
          s.color = RBTNColor.BLACK;
          x.parent.color = RBTNColor.RED;
          this._leftRotate(x.parent);
          s = x.parent.right!;
        }

        if (s.left !== undefined && s.left.color === RBTNColor.BLACK && s.right && s.right.color === RBTNColor.BLACK) {
          s.color = RBTNColor.RED;
          x = x.parent;
        } else {
          if (s.right && s.right.color === RBTNColor.BLACK) {
            if (s.left) s.left.color = RBTNColor.BLACK;
            s.color = RBTNColor.RED;
            this._rightRotate(s);
            s = x.parent.right;
          }

          if (s) s.color = x.parent.color;
          x.parent.color = RBTNColor.BLACK;
          if (s && s.right) s.right.color = RBTNColor.BLACK;
          this._leftRotate(x.parent);
          x = this.root;
        }
      } else {
        s = x.parent!.left!;
        if (s.color === 1) {
          s.color = RBTNColor.BLACK;
          x.parent!.color = RBTNColor.RED;
          this._rightRotate(x.parent!);
          s = x.parent!.left;
        }

        if (s && s.right && s.right.color === RBTNColor.BLACK && s.right.color === RBTNColor.BLACK) {
          s.color = RBTNColor.RED;
          x = x.parent!;
        } else {
          if (s && s.left && s.left.color === RBTNColor.BLACK) {
            if (s.right) s.right.color = RBTNColor.BLACK;
            s.color = RBTNColor.RED;
            this._leftRotate(s);
            s = x.parent!.left;
          }

          if (s) s.color = x.parent!.color;
          x.parent!.color = RBTNColor.BLACK;
          if (s && s.left) s.left.color = RBTNColor.BLACK;
          this._rightRotate(x.parent!);
          x = this.root;
        }
      }
    }
    x.color = RBTNColor.BLACK;
  }

  /**
   * The function `_rbTransplant` replaces one node in a red-black tree with another node.
   * @param {RBTreeNode} u - The parameter "u" represents a RBTreeNode object.
   * @param {RBTreeNode} v - The parameter "v" is a RBTreeNode object.
   */
  protected _rbTransplant(u: N, v: N): void {
    if (u.parent === undefined) {
      this._setRoot(v);
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  /**
   * The `_fixInsert` function is used to fix the red-black tree after an insertion operation.
   * @param {RBTreeNode} k - The parameter `k` is a RBTreeNode object, which represents a node in a
   * red-black tree.
   */
  protected _fixInsert(k: N): void {
    let u: N | undefined;
    while (k.parent && k.parent.color === 1) {
      if (k.parent.parent && k.parent === k.parent.parent.right) {
        u = k.parent.parent.left;
        if (u && u.color === 1) {
          u.color = RBTNColor.BLACK;
          k.parent.color = RBTNColor.BLACK;
          k.parent.parent.color = RBTNColor.RED;
          k = k.parent.parent;
        } else {
          if (k === k.parent.left) {
            k = k.parent;
            this._rightRotate(k);
          }

          k.parent!.color = RBTNColor.BLACK;
          k.parent!.parent!.color = RBTNColor.RED;
          this._leftRotate(k.parent!.parent!);
        }
      } else {
        u = k.parent.parent!.right;

        if (u && u.color === 1) {
          u.color = RBTNColor.BLACK;
          k.parent.color = RBTNColor.BLACK;
          k.parent.parent!.color = RBTNColor.RED;
          k = k.parent.parent!;
        } else {
          if (k === k.parent.right) {
            k = k.parent;
            this._leftRotate(k);
          }

          k.parent!.color = RBTNColor.BLACK;
          k.parent!.parent!.color = RBTNColor.RED;
          this._rightRotate(k.parent!.parent!);
        }
      }
      if (k === this.root) {
        break;
      }
    }
    this.root.color = RBTNColor.BLACK;
  }
}
