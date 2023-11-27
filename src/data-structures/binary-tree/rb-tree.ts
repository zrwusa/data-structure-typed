/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import {
  BiTreeDeleteResult,
  BSTNodeKeyOrNode,
  BTNCallback,
  BTNKey,
  BTNodeExemplar,
  IterationType,
  RBTNColor,
  RBTreeOptions,
  RedBlackTreeNested,
  RedBlackTreeNodeNested
} from '../../types';
import { BST, BSTNode } from './bst';
import { IBinaryTree } from '../../interfaces';
import { BinaryTreeNode } from './binary-tree';

export class RedBlackTreeNode<V = any, N extends RedBlackTreeNode<V, N> = RedBlackTreeNodeNested<V>> extends BSTNode<
  V,
  N
> {
  color: RBTNColor;

  constructor(key: BTNKey, value?: V, color: RBTNColor = RBTNColor.BLACK) {
    super(key, value);
    this.color = color;
  }
}

/**
 * 1. Each node is either red or black.
 * 2. The root node is always black.
 * 3. Leaf nodes are typically Sentinel nodes and are considered black.
 * 4. Red nodes must have black children.
 * 5. Black balance: Every path from any node to each of its leaf nodes contains the same number of black nodes.
 */
export class RedBlackTree<V = any, N extends RedBlackTreeNode<V, N> = RedBlackTreeNode<V, RedBlackTreeNodeNested<V>>, TREE extends RedBlackTree<V, N, TREE> = RedBlackTree<V, N, RedBlackTreeNested<V, N>>>
  extends BST<V, N, TREE>
  implements IBinaryTree<V, N, TREE> {
  Sentinel: N = new RedBlackTreeNode<V>(NaN) as unknown as N;

  /**
   * This is the constructor function for a Red-Black Tree data structure in TypeScript, which
   * initializes the tree with optional elements and options.
   * @param [elements] - The `elements` parameter is an optional iterable of `BTNodeExemplar<V, N>`
   * objects. It represents the initial elements that will be added to the RBTree during its
   * construction. If this parameter is provided, the `addMany` method is called to add all the
   * elements to the
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the RBTree. It is of type `Partial<RBTreeOptions>`, which means that you can provide
   * only a subset of the properties defined in the `RBTreeOptions` interface.
   */
  constructor(elements?: Iterable<BTNodeExemplar<V, N>>, options?: Partial<RBTreeOptions>) {
    super([], options);

    this._root = this.Sentinel;
    if (elements) super.addMany(elements);
  }

  protected _root: N;

  get root(): N {
    return this._root;
  }

  protected _size: number = 0;

  get size(): number {
    return this._size;
  }

  /**
   * The function creates a new Red-Black Tree node with the specified key, value, and color.
   * @param {BTNKey} key - The key parameter is the key value associated with the node. It is used to
   * identify and compare nodes in the Red-Black Tree.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the node. It is of type `V`, which is a generic type that can be replaced with any
   * specific type when using the `createNode` method.
   * @param {RBTNColor} color - The "color" parameter is used to specify the color of the node in a
   * Red-Black Tree. It can be either "RED" or "BLACK". By default, the color is set to "BLACK".
   * @returns The method is returning a new instance of a RedBlackTreeNode with the specified key,
   * value, and color.
   */
  override createNode(key: BTNKey, value?: V, color: RBTNColor = RBTNColor.BLACK): N {
    return new RedBlackTreeNode<V, N>(key, value, color) as N;
  }

  /**
   * The function creates a Red-Black Tree with the specified options and returns it.
   * @param {RBTreeOptions} [options] - The `options` parameter is an optional object that can be
   * passed to the `createTree` function. It is used to customize the behavior of the `RedBlackTree`
   * class.
   * @returns a new instance of a RedBlackTree object.
   */
  override createTree(options?: RBTreeOptions): TREE {
    return new RedBlackTree<V, N, TREE>([], {
      iterationType: this.iterationType,
      comparator: this.comparator, ...options
    }) as TREE;
  }

  /**
   * The function checks if an exemplar is an instance of the RedBlackTreeNode class.
   * @param exemplar - The `exemplar` parameter is of type `BTNodeExemplar<V, N>`.
   * @returns a boolean value indicating whether the exemplar is an instance of the RedBlackTreeNode
   * class.
   */
  override isNode(exemplar: BTNodeExemplar<V, N>): exemplar is N {
    return exemplar instanceof RedBlackTreeNode;
  }

  /**
   * The function `exemplarToNode` takes an exemplar and returns a node if the exemplar is valid,
   * otherwise it returns undefined.
   * @param exemplar - BTNodeExemplar<V, N> - A generic type representing an exemplar of a binary tree
   * node. It can be either a node itself, an entry (key-value pair), a node key, or any other value
   * that is not a valid exemplar.
   * @returns a variable `node` which is of type `N | undefined`.
   */
  override exemplarToNode(exemplar: BTNodeExemplar<V, N>): N | undefined {
    let node: N | undefined;

    if (exemplar === null || exemplar === undefined) {
      return;
    } else if (this.isNode(exemplar)) {
      node = exemplar;
    } else if (this.isEntry(exemplar)) {
      const [key, value] = exemplar;
      if (key === undefined || key === null) {
        return;
      } else {
        node = this.createNode(key, value, RBTNColor.RED);
      }
    } else if (this.isNodeKey(exemplar)) {
      node = this.createNode(exemplar, undefined, RBTNColor.RED);
    } else {
      return;
    }
    return node;
  }

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  /**
   * The function adds a node to a Red-Black Tree data structure.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can be one of the following:
   * @returns The method `add` returns either an instance of `N` (the node that was added) or
   * `undefined`.
   */
  override add(keyOrNodeOrEntry: BTNodeExemplar<V, N>): N | undefined {
    const newNode = this.exemplarToNode(keyOrNodeOrEntry);
    if (newNode === undefined) return;

    newNode.left = this.Sentinel;
    newNode.right = this.Sentinel;

    let y: N | undefined = undefined;
    let x: N | undefined = this.root;

    while (x !== this.Sentinel) {
      y = x;
      if (x) {
        if (newNode.key < x.key) {
          x = x.left;
        } else if (newNode.key > x.key) {
          x = x?.right;
        } else {
          if (newNode !== x) {
            this._replaceNode(x, newNode)
          }
          return;
        }
      }

    }

    newNode.parent = y;
    if (y === undefined) {
      this._setRoot(newNode);
    } else if (newNode.key < y.key) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }

    if (newNode.parent === undefined) {
      newNode.color = RBTNColor.BLACK;
      this._size++;
      return;
    }

    if (newNode.parent.parent === undefined) {
      this._size++;
      return;
    }

    this._fixInsert(newNode);
    this._size++;
  }

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   *
   * The `delete` function removes a node from a binary tree based on a given identifier and updates
   * the tree accordingly.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * that you want to use to identify the node that you want to delete from the binary tree. It can be
   * of any type that is returned by the callback function `C`. It can also be `null` or `undefined` if
   * you don't want to
   * @param {C} callback - The `callback` parameter is a function that takes a node of type `N` and
   * returns a value of type `ReturnType<C>`. It is used to determine if a node should be deleted based
   * on its identifier. The `callback` function is optional and defaults to `this._defaultOneParam
   * @returns an array of `BiTreeDeleteResult<N>`.
   */
  delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C
  ): BiTreeDeleteResult<N>[] {
    const ans: BiTreeDeleteResult<N>[] = [];
    if (identifier === null) return ans;
    const helper = (node: N | undefined): void => {
      let z: N = this.Sentinel;
      let x: N | undefined, y: N;
      while (node !== this.Sentinel) {
        if (node && callback(node) === identifier) {
          z = node;
        }

        if (node && identifier && callback(node) <= identifier) {
          node = node.right;
        } else {
          node = node?.left;
        }
      }

      if (z === this.Sentinel) {
        this._size--;
        return;
      }

      y = z;
      let yOriginalColor: number = y.color;
      if (z.left === this.Sentinel) {
        x = z.right;
        this._rbTransplant(z, z.right!);
      } else if (z.right === this.Sentinel) {
        x = z.left;
        this._rbTransplant(z, z.left!);
      } else {
        y = this.getLeftMost(z.right)!;
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

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  override isRealNode(node: N | undefined): node is N {
    return node !== this.Sentinel && node !== undefined;
  }

  getNode<C extends BTNCallback<N, BTNKey>>(
    identifier: BTNKey,
    callback?: C,
    beginRoot?: N | undefined,
    iterationType?: IterationType
  ): N | undefined;

  getNode<C extends BTNCallback<N, N>>(
    identifier: N | undefined,
    callback?: C,
    beginRoot?: N | undefined,
    iterationType?: IterationType
  ): N | undefined;

  getNode<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C,
    beginRoot?: N | undefined,
    iterationType?: IterationType
  ): N | undefined;

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   *
   * The function `getNode` retrieves a single node from a binary tree based on a given identifier and
   * callback function.
   * @param {ReturnType<C> | undefined} identifier - The `identifier` parameter is the value used to
   * identify the node you want to retrieve. It can be of any type that is the return type of the `C`
   * callback function. If the `identifier` is `undefined`, it means you want to retrieve the first
   * node that matches the other criteria
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the binary tree. It is used to determine if a node matches the given identifier. The `callback`
   * function should take a single parameter of type `N` (the type of the nodes in the binary tree) and
   * @param {BTNKey | N | undefined} beginRoot - The `beginRoot` parameter is the starting point for
   * searching for a node in a binary tree. It can be either a key value or a node object. If it is not
   * provided, the search will start from the root of the binary tree.
   * @param iterationType - The `iterationType` parameter is a variable that determines the type of
   * iteration to be performed when searching for nodes in the binary tree. It is used in the
   * `getNodes` method, which is called within the `getNode` method.
   * @returns a value of type `N`, `null`, or `undefined`.
   */
  getNode<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BSTNodeKeyOrNode<N> = this.root,
    iterationType = this.iterationType
  ): N | null | undefined {
    if ((identifier as any) instanceof BinaryTreeNode) callback = (node => node) as C;
    beginRoot = this.ensureNode(beginRoot);
    return this.getNodes(identifier, callback, true, beginRoot, iterationType)[0] ?? undefined;
  }

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   *
   * The function returns the successor of a given node in a red-black tree.
   * @param {RedBlackTreeNode} x - RedBlackTreeNode - The node for which we want to find the successor.
   * @returns the successor of the given RedBlackTreeNode.
   */
  override getSuccessor(x: N): N | undefined {
    if (x.right !== this.Sentinel) {
      return this.getLeftMost(x.right) ?? undefined;
    }

    let y: N | undefined = x.parent;
    while (y !== this.Sentinel && y !== undefined && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   *
   * The function returns the predecessor of a given node in a red-black tree.
   * @param {RedBlackTreeNode} x - The parameter `x` is of type `RedBlackTreeNode`, which represents a node in a
   * Red-Black Tree.
   * @returns the predecessor of the given RedBlackTreeNode 'x'.
   */
  override getPredecessor(x: N): N {
    if (x.left !== this.Sentinel) {
      return this.getRightMost(x.left!)!;
    }

    let y: N | undefined = x.parent;
    while (y !== this.Sentinel && x === y!.left) {
      x = y!;
      y = y!.parent;
    }

    return y!;
  }

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  override clear() {
    this._root = this.Sentinel;
    this._size = 0;
  }

  protected override _setRoot(v: N) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function performs a left rotation on a binary tree node.
   * @param {RedBlackTreeNode} x - The parameter `x` is of type `N`, which likely represents a node in a binary tree.
   */
  protected _leftRotate(x: N): void {
    if (x.right) {
      const y: N = x.right;
      x.right = y.left;
      if (y.left !== this.Sentinel) {
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function performs a right rotation on a red-black tree node.
   * @param {RedBlackTreeNode} x - x is a RedBlackTreeNode, which represents the node that needs to be right
   * rotated.
   */
  protected _rightRotate(x: N): void {
    if (x.left) {
      const y: N = x.left;
      x.left = y.right;
      if (y.right !== this.Sentinel) {
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
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   *
   * The function `_fixDelete` is used to fix the red-black tree after a node deletion.
   * @param {RedBlackTreeNode} x - The parameter `x` represents a node in a Red-Black Tree (RBT).
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_rbTransplant` replaces one node in a red-black tree with another node.
   * @param {RedBlackTreeNode} u - The parameter "u" represents a RedBlackTreeNode object.
   * @param {RedBlackTreeNode} v - The parameter "v" is a RedBlackTreeNode object.
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
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n) on average (where n is the number of nodes in the tree)
   * Space Complexity: O(1)
   *
   * The `_fixInsert` function is used to fix the red-black tree after an insertion operation.
   * @param {RedBlackTreeNode} k - The parameter `k` is a RedBlackTreeNode object, which represents a node in a
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

  /**
   * The function replaces an old node with a new node while preserving the color of the old node.
   * @param {N} oldNode - The `oldNode` parameter represents the node that needs to be replaced in a
   * data structure. It is of type `N`, which is the type of the nodes in the data structure.
   * @param {N} newNode - The `newNode` parameter is the node that will replace the `oldNode` in the
   * data structure.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, passing in the `oldNode` and `newNode` as arguments.
   */
  protected _replaceNode(oldNode: N, newNode: N): N {
    newNode.color = oldNode.color;

    return super._replaceNode(oldNode, newNode)
  }
}
