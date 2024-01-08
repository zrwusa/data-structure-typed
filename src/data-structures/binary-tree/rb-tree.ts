/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import {
  BinaryTreeDeleteResult,
  BSTNKeyOrNode,
  BTNCallback,
  KeyOrNodeOrEntry,
  RBTNColor,
  RBTreeOptions,
  RedBlackTreeNested,
  RedBlackTreeNodeNested
} from '../../types';
import { BST, BSTNode } from './bst';
import { IBinaryTree } from '../../interfaces';

export class RedBlackTreeNode<
  K = any,
  V = any,
  NODE extends RedBlackTreeNode<K, V, NODE> = RedBlackTreeNodeNested<K, V>
> extends BSTNode<K, V, NODE> {
  /**
   * The constructor function initializes a Red-Black Tree Node with a key, an optional value, and a
   * color.
   * @param {K} key - The key parameter is of type K and represents the key of the node in the
   * Red-Black Tree.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the Red-Black Tree Node. It is not required and can be omitted when
   * creating a new instance of the Red-Black Tree Node.
   * @param {RBTNColor} color - The `color` parameter is used to specify the color of the Red-Black
   * Tree Node. It is an optional parameter with a default value of `RBTNColor.BLACK`.
   */
  constructor(key: K, value?: V, color: RBTNColor = RBTNColor.BLACK) {
    super(key, value);
    this._color = color;
  }

  protected _color: RBTNColor;

  /**
   * The function returns the color value of a variable.
   * @returns The color value stored in the protected variable `_color`.
   */
  get color(): RBTNColor {
    return this._color;
  }

  /**
   * The function sets the color property to the specified value.
   * @param {RBTNColor} value - The value parameter is of type RBTNColor.
   */
  set color(value: RBTNColor) {
    this._color = value;
  }
}

/**
 * 1. Each node is either red or black.
 * 2. The root node is always black.
 * 3. Leaf nodes are typically Sentinel nodes and are considered black.
 * 4. Red nodes must have black children.
 * 5. Black balance: Every path from any node to each of its leaf nodes contains the same number of black nodes.
 */
export class RedBlackTree<
  K = any,
  V = any,
  NODE extends RedBlackTreeNode<K, V, NODE> = RedBlackTreeNode<K, V, RedBlackTreeNodeNested<K, V>>,
  TREE extends RedBlackTree<K, V, NODE, TREE> = RedBlackTree<K, V, NODE, RedBlackTreeNested<K, V, NODE>>
>
  extends BST<K, V, NODE, TREE>
  implements IBinaryTree<K, V, NODE, TREE> {
  /**
   * This is the constructor function for a Red-Black Tree data structure in TypeScript, which
   * initializes the tree with optional nodes and options.
   * @param [keysOrNodesOrEntries] - The `keysOrNodesOrEntries` parameter is an optional iterable of `KeyOrNodeOrEntry<K, V, NODE>`
   * objects. It represents the initial nodes that will be added to the RBTree during its
   * construction. If this parameter is provided, the `addMany` method is called to add all the
   * nodes to the
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the RBTree. It is of type `Partial<RBTreeOptions>`, which means that you can provide
   * only a subset of the properties defined in the `RBTreeOptions` interface.
   */
  constructor(keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, NODE>> = [], options?: RBTreeOptions<K>) {
    super([], options);

    this._root = this._Sentinel;
    if (keysOrNodesOrEntries) super.addMany(keysOrNodesOrEntries);
  }

  protected _Sentinel: NODE = new RedBlackTreeNode<K, V>(NaN as K) as unknown as NODE;

  /**
   * The function returns the value of the `_Sentinel` property.
   * @returns The method is returning the value of the `_Sentinel` property.
   */
  get Sentinel(): NODE {
    return this._Sentinel;
  }

  protected _root: NODE;

  /**
   * The function returns the root node.
   * @returns The root node of the data structure.
   */
  get root(): NODE {
    return this._root;
  }

  protected _size: number = 0;

  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size(): number {
    return this._size;
  }

  /**
   * The function creates a new Red-Black Tree node with the specified key, value, and color.
   * @param {K} key - The key parameter is the key value associated with the node. It is used to
   * identify and compare nodes in the Red-Black Tree.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the node. It is of type `V`, which is a generic type that can be replaced with any
   * specific type when using the `createNode` method.
   * @param {RBTNColor} color - The "color" parameter is used to specify the color of the node in a
   * Red-Black Tree. It can be either "RED" or "BLACK". By default, the color is set to "BLACK".
   * @returns The method is returning a new instance of a RedBlackTreeNode with the specified key,
   * value, and color.
   */
  override createNode(key: K, value?: V, color: RBTNColor = RBTNColor.BLACK): NODE {
    return new RedBlackTreeNode<K, V, NODE>(key, value, color) as NODE;
  }

  /**
   * The function creates a Red-Black Tree with the specified options and returns it.
   * @param {RBTreeOptions} [options] - The `options` parameter is an optional object that can be
   * passed to the `createTree` function. It is used to customize the behavior of the `RedBlackTree`
   * class.
   * @returns a new instance of a RedBlackTree object.
   */
  override createTree(options?: RBTreeOptions<K>): TREE {
    return new RedBlackTree<K, V, NODE, TREE>([], {
      iterationType: this.iterationType,
      ...options
    }) as TREE;
  }

  /**
   * The function `keyValueOrEntryToNode` takes an keyOrNodeOrEntry and converts it into a node object if possible.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is of type `KeyOrNodeOrEntry<K, V, NODE>`, where:
   * @param {V} [value] - The `value` parameter is an optional value that can be passed to the
   * `keyValueOrEntryToNode` function. It represents the value associated with the keyOrNodeOrEntry node. If a value
   * is provided, it will be used when creating the new node. If no value is provided, the new node
   * @returns a node of type NODE or undefined.
   */
  override keyValueOrEntryToNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>, value?: V): NODE | undefined {
    let node: NODE | undefined;

    if (keyOrNodeOrEntry === null || keyOrNodeOrEntry === undefined) {
      return;
    } else if (this.isNode(keyOrNodeOrEntry)) {
      node = keyOrNodeOrEntry;
    } else if (this.isEntry(keyOrNodeOrEntry)) {
      const [key, value] = keyOrNodeOrEntry;
      if (key === undefined || key === null) {
        return;
      } else {
        node = this.createNode(key, value, RBTNColor.RED);
      }
    } else if (!this.isNode(keyOrNodeOrEntry)) {
      node = this.createNode(keyOrNodeOrEntry, value, RBTNColor.RED);
    } else {
      return;
    }
    return node;
  }

  /**
   * The function checks if an keyOrNodeOrEntry is an instance of the RedBlackTreeNode class.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is of type `KeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the keyOrNodeOrEntry is an instance of the RedBlackTreeNode
   * class.
   */
  override isNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>): keyOrNodeOrEntry is NODE {
    return keyOrNodeOrEntry instanceof RedBlackTreeNode;
  }

  /**
   * The function checks if a given node is a real node in a Red-Black Tree.
   * @param {NODE | undefined} node - The `node` parameter is of type `NODE | undefined`, which means
   * it can either be of type `NODE` or `undefined`.
   * @returns a boolean value.
   */
  override isRealNode(node: NODE | undefined): node is NODE {
    if (node === this._Sentinel || node === undefined) return false;
    return node instanceof RedBlackTreeNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   * On average (where n is the number of nodes in the tree)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `add` function adds a new node to a binary search tree and performs necessary rotations and
   * color changes to maintain the red-black tree properties.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can be either a key, a node, or an
   * entry.
   * @param {V} [value] - The `value` parameter represents the value associated with the key that is
   * being added to the binary search tree.
   * @returns The method `add` returns either the newly added node (`NODE`) or `undefined`.
   */
  override add(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>, value?: V): boolean {
    const newNode = this.keyValueOrEntryToNode(keyOrNodeOrEntry, value);
    if (newNode === undefined) return false;

    newNode.left = this._Sentinel;
    newNode.right = this._Sentinel;

    let y: NODE | undefined = undefined;
    let x: NODE | undefined = this.root;

    while (x !== this._Sentinel) {
      y = x;
      if (x) {
        if (newNode.key < x.key) {
          x = x.left;
        } else if (newNode.key > x.key) {
          x = x?.right;
        } else {
          if (newNode !== x) {
            this._replaceNode(x, newNode);
          }
          return false;
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
      return false;
    }

    if (newNode.parent.parent === undefined) {
      this._size++;
      return false;
    }

    this._fixInsert(newNode);
    this._size++;
    return true;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes a node from a binary tree based on a given identifier and updates
   * the tree accordingly.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * that you want to use to identify the node that you want to delete from the binary tree. It can be
   * of any type that is returned by the callback function `C`. It can also be `null` or `undefined` if
   * you don't want to
   * @param {C} callback - The `callback` parameter is a function that takes a node of type `NODE` and
   * returns a value of type `ReturnType<C>`. It is used to determine if a node should be deleted based
   * on its identifier. The `callback` function is optional and defaults to `this._defaultOneParam
   * @returns an array of `BinaryTreeDeleteResult<NODE>`.
   */
  delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C
  ): BinaryTreeDeleteResult<NODE>[] {
    const ans: BinaryTreeDeleteResult<NODE>[] = [];
    if (identifier === null) return ans;
    const helper = (node: NODE | undefined): void => {
      let z: NODE = this._Sentinel;
      let x: NODE | undefined, y: NODE;
      while (node !== this._Sentinel) {
        if (node && callback(node) === identifier) {
          z = node;
        }

        if (node && identifier && callback(node) <= identifier) {
          node = node.right;
        } else {
          node = node?.left;
        }
      }

      if (z === this._Sentinel) {
        this._size--;
        return;
      }

      y = z;
      let yOriginalColor: number = y.color;
      if (z.left === this._Sentinel) {
        x = z.right;
        this._rbTransplant(z, z.right!);
      } else if (z.right === this._Sentinel) {
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
      ans.push({ deleted: z, needBalanced: undefined });
    };
    helper(this.root);
    return ans;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
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
   * function should take a single parameter of type `NODE` (the type of the nodes in the binary tree) and
   * @param {K | NODE | undefined} beginRoot - The `beginRoot` parameter is the starting point for
   * searching for a node in a binary tree. It can be either a key value or a node object. If it is not
   * provided, the search will start from the root of the binary tree.
   * @param iterationType - The `iterationType` parameter is a variable that determines the type of
   * iteration to be performed when searching for nodes in the binary tree. It is used in the
   * `getNodes` method, which is called within the `getNode` method.
   * @returns a value of type `NODE`, `null`, or `undefined`.
   */
  getNode<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BSTNKeyOrNode<K, NODE> = this.root,
    iterationType = this.iterationType
  ): NODE | null | undefined {
    if ((identifier as any) instanceof RedBlackTreeNode) callback = (node => node) as C;
    beginRoot = this.ensureNode(beginRoot);
    return this.getNodes(identifier, callback, true, beginRoot, iterationType)[0] ?? undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The "clear" function sets the root node to the sentinel node and resets the size to 0.
   */
  override clear() {
    this._root = this._Sentinel;
    this._size = 0;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function returns the predecessor of a given node in a red-black tree.
   * @param {RedBlackTreeNode} x - The parameter `x` is of type `RedBlackTreeNode`, which represents a node in a
   * Red-Black Tree.
   * @returns the predecessor of the given RedBlackTreeNode 'x'.
   */
  override getPredecessor(x: NODE): NODE {
    if (this.isRealNode(x.left)) {
      return this.getRightMost(x.left)!;
    }

    let y: NODE | undefined = x.parent;
    while (this.isRealNode(y) && x === y.left) {
      x = y!;
      y = y!.parent;
    }

    return y!;
  }

  /**
   * The function sets the root node of a tree structure and updates the parent property of the new
   * root node.
   * @param {NODE} v - The parameter "v" is of type "NODE", which represents a node in a data
   * structure.
   */
  protected override _setRoot(v: NODE) {
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
   * @param {RedBlackTreeNode} x - The parameter `x` is of type `NODE`, which likely represents a node in a binary tree.
   */
  protected _leftRotate(x: NODE): void {
    if (x.right) {
      const y: NODE = x.right;
      x.right = y.left;
      if (y.left !== this._Sentinel) {
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
  protected _rightRotate(x: NODE): void {
    if (x.left) {
      const y: NODE = x.left;
      x.left = y.right;
      if (y.right !== this._Sentinel) {
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
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_fixInsert` function is used to fix the red-black tree after an insertion operation.
   * @param {RedBlackTreeNode} k - The parameter `k` is a RedBlackTreeNode object, which represents a node in a
   * red-black tree.
   */
  protected _fixInsert(k: NODE): void {
    let u: NODE | undefined;
    while (k.parent && k.parent.color === RBTNColor.RED) {
      if (k.parent.parent && k.parent === k.parent.parent.right) {
        u = k.parent.parent.left;

        if (u && u.color === RBTNColor.RED) {
          // Delay color flip
          k.parent.color = RBTNColor.BLACK;
          u.color = RBTNColor.BLACK;
          k.parent.parent.color = RBTNColor.RED;
          k = k.parent.parent;
        } else {
          if (k === k.parent.left) {
            k = k.parent;
            this._rightRotate(k);
          }

          // Check color before rotation
          if (k.parent!.color === RBTNColor.RED) {
            k.parent!.color = RBTNColor.BLACK;
            k.parent!.parent!.color = RBTNColor.RED;
          }
          this._leftRotate(k.parent!.parent!);
        }
      } else {
        u = k.parent!.parent!.right;

        if (u && u.color === RBTNColor.RED) {
          // Delay color flip
          k.parent.color = RBTNColor.BLACK;
          u.color = RBTNColor.BLACK;
          k.parent.parent!.color = RBTNColor.RED;
          k = k.parent.parent!;
        } else {
          if (k === k.parent.right) {
            k = k.parent;
            this._leftRotate(k);
          }

          // Check color before rotation
          if (k.parent!.color === RBTNColor.RED) {
            k.parent!.color = RBTNColor.BLACK;
            k.parent!.parent!.color = RBTNColor.RED;
          }
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
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `_fixDelete` is used to fix the red-black tree after a node deletion.
   * @param {RedBlackTreeNode} x - The parameter `x` represents a node in a Red-Black Tree (RBT).
   */
  protected _fixDelete(x: NODE): void {
    let s: NODE | undefined;
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
  protected _rbTransplant(u: NODE, v: NODE): void {
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
   * The function replaces an old node with a new node while preserving the color of the old node.
   * @param {NODE} oldNode - The `oldNode` parameter represents the node that needs to be replaced in a
   * data structure. It is of type `NODE`, which is the type of the nodes in the data structure.
   * @param {NODE} newNode - The `newNode` parameter is the node that will replace the `oldNode` in the
   * data structure.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, passing in the `oldNode` and `newNode` as arguments.
   */
  protected _replaceNode(oldNode: NODE, newNode: NODE): NODE {
    newNode.color = oldNode.color;

    return super._replaceNode(oldNode, newNode);
  }
}
