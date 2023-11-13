/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {BinaryTreeNodeNested, BinaryTreeOptions, BTNCallback, BTNKey} from '../../types';
import {BiTreeDeleteResult, DFSOrderPattern, FamilyPosition, IterationType} from '../../types';
import {IBinaryTree} from '../../interfaces';
import {trampoline} from '../../utils';
import {Queue} from '../queue';

/**
 * Represents a node in a binary tree.
 * @template V - The type of data stored in the node.
 * @template N - The type of the family relationship in the binary tree.
 */
export class BinaryTreeNode<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNode<V, BinaryTreeNodeNested<V>>> {
  /**
   * The key associated with the node.
   */
  key: BTNKey;

  /**
   * The value stored in the node.
   */
  value?: V;

  /**
   * The parent node of the current node.
   */
  parent?: N | null;

  /**
   * Creates a new instance of BinaryTreeNode.
   * @param {BTNKey} key - The key associated with the node.
   * @param {V} value - The value stored in the node.
   */
  constructor(key: BTNKey, value?: V) {
    this.key = key;
    this.value = value;
  }

  protected _left?: N | null;

  /**
   * Get the left child node.
   */
  get left(): N | null | undefined {
    return this._left;
  }

  /**
   * Set the left child node.
   * @param {N | null | undefined} v - The left child node.
   */
  set left(v: N | null | undefined) {
    if (v) {
      v.parent = this as unknown as N;
    }
    this._left = v;
  }

  protected _right?: N | null;

  /**
   * Get the right child node.
   */
  get right(): N | null | undefined {
    return this._right;
  }

  /**
   * Set the right child node.
   * @param {N | null | undefined} v - The right child node.
   */
  set right(v: N | null | undefined) {
    if (v) {
      v.parent = this as unknown as N;
    }
    this._right = v;
  }

  /**
   * Get the position of the node within its family.
   * @returns {FamilyPosition} - The family position of the node.
   */
  get familyPosition(): FamilyPosition {
    const that = this as unknown as N;
    if (!this.parent) {
      return this.left || this.right ? FamilyPosition.ROOT : FamilyPosition.ISOLATED;
    }

    if (this.parent.left === that) {
      return this.left || this.right ? FamilyPosition.ROOT_LEFT : FamilyPosition.LEFT;
    } else if (this.parent.right === that) {
      return this.left || this.right ? FamilyPosition.ROOT_RIGHT : FamilyPosition.RIGHT;
    }

    return FamilyPosition.MAL_NODE;
  }
}

/**
 * Represents a binary tree data structure.
 * @template N - The type of the binary tree's nodes.
 */
export class BinaryTree<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNode<V, BinaryTreeNodeNested<V>>> implements IBinaryTree<V, N> {
  iterationType: IterationType = IterationType.ITERATIVE;

  /**
   * Creates a new instance of BinaryTree.
   * @param {BinaryTreeOptions} [options] - The options for the binary tree.
   */
  constructor(options?: BinaryTreeOptions) {
    if (options) {
      const {iterationType = IterationType.ITERATIVE} = options;
      this.iterationType = iterationType;
    }
    this._size = 0;
  }

  protected _root?: N | null;

  /**
   * Get the root node of the binary tree.
   */
  get root(): N | null | undefined {
    return this._root;
  }

  protected _size: number;

  /**
   * Get the number of nodes in the binary tree.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Creates a new instance of BinaryTreeNode with the given key and value.
   * @param {BTNKey} key - The key for the new node.
   * @param {V} value - The value for the new node.
   * @returns {N} - The newly created BinaryTreeNode.
   */
  createNode(key: BTNKey, value?: V): N {
    return new BinaryTreeNode<V, N>(key, value) as N;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   * Comments: The time complexity for adding a node depends on the depth of the tree. In the best case (when the tree is empty), it's O(1). In the worst case (when the tree is a degenerate tree), it's O(n). The space complexity is constant.
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `add` function adds a new node with a key and value to a binary tree, or updates the value of
   * an existing node with the same key.
   * @param {BTNKey | N | null | undefined} keyOrNode - The `keyOrNode` parameter can be one of the
   * following types:
   * @param {V} [value] - The value to be associated with the key or node being added to the binary
   * tree.
   * @returns The function `add` returns a node (`N`) if it was successfully inserted into the binary
   * tree, or `null` or `undefined` if the insertion was not successful.
   */
  add(keyOrNode: BTNKey | N | null | undefined, value?: V): N | null | undefined {
    const _bfs = (root: N, newNode: N | null): N | undefined | null => {
      const queue = new Queue<N>([root]);
      while (queue.size > 0) {
        const cur = queue.shift()!;
        if (newNode && cur.key === newNode.key) {
          cur.value = newNode.value;
          return;
        }
        const inserted = this._addTo(newNode, cur);
        if (inserted !== undefined) return inserted;
        if (cur.left) queue.push(cur.left);
        if (cur.right) queue.push(cur.right);
      }
    };

    let inserted: N | null | undefined, needInsert: N | null | undefined;

    if (keyOrNode === null) {
      needInsert = null;
    } else if (this.isNodeKey(keyOrNode)) {
      needInsert = this.createNode(keyOrNode, value);
    } else if (keyOrNode instanceof BinaryTreeNode) {
      needInsert = keyOrNode;
    } else {
      return;
    }

    if (this.root) {
      inserted = _bfs(this.root, needInsert);
    } else {
      this._setRoot(needInsert);
      if (needInsert) {
        this._size = 1;
      } else {
        this._size = 0;
      }
      inserted = this.root;
    }
    return inserted;
  }

  /**
   * Time Complexity: O(k * n)  "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(k * n)  "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted.
   * Space Complexity: O(1)
   *
   * The `addMany` function takes an array of keys or nodes and an optional array of values, and adds
   * each key-value pair to a data structure.
   * @param {(BTNKey | N |null | undefined)[]} keysOrNodes - An array of keys or nodes to be added to
   * the binary search tree. Each element can be of type `BTNKey` (a key value), `N` (a node), `null`,
   * or `undefined`.
   * @param {(V | undefined)[]} [values] - The `values` parameter is an optional array of values that
   * correspond to the keys or nodes being added. If provided, the values will be associated with the
   * keys or nodes during the add operation.
   * @returns The function `addMany` returns an array of `N`, `null`, or `undefined` values.
   */
  addMany(keysOrNodes: (BTNKey | N | null | undefined)[], values?: (V | undefined)[]): (N | null | undefined)[] {
    // TODO not sure addMany not be run multi times
    return keysOrNodes.map((keyOrNode, i) => {
      if (keyOrNode instanceof BinaryTreeNode) {
        return this.add(keyOrNode.key, keyOrNode.value);
      }

      if (keyOrNode === null) {
        return this.add(null);
      }

      const value = values?.[i];
      return this.add(keyOrNode, value);
    });
  }

  /**
   * Time Complexity: O(k * n)  "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(k * n)  "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted.
   * Space Complexity: O(1)
   *
   * The `refill` function clears the binary tree and adds multiple nodes with the given IDs or nodes and optional data.
   * @param {(BTNKey | N)[]} keysOrNodes - The `keysOrNodes` parameter is an array that can contain either
   * `BTNKey` or `N` values.
   * @param {N[] | Array<V>} [values] - The `data` parameter is an optional array of values that will be assigned to
   * the nodes being added. If provided, the length of the `data` array should be equal to the length of the `keysOrNodes`
   * array. Each value in the `data` array will be assigned to the
   * @returns The method is returning a boolean value.
   */
  refill(keysOrNodes: (BTNKey | N | null | undefined)[], values?: (V | undefined)[]): boolean {
    this.clear();
    return keysOrNodes.length === this.addMany(keysOrNodes, values).length;
  }

  delete<C extends BTNCallback<N, BTNKey>>(identifier: BTNKey, callback?: C): BiTreeDeleteResult<N>[];

  delete<C extends BTNCallback<N, N>>(identifier: N | null | undefined, callback?: C): BiTreeDeleteResult<N>[];

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C>, callback: C): BiTreeDeleteResult<N>[];

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function deletes a node from a binary tree and returns an array of the deleted nodes along
   * with the nodes that need to be balanced.
   * @param {ReturnType<C> | null | undefined} identifier - The identifier parameter is the value or
   * object that you want to delete from the binary tree. It can be of any type that is compatible with
   * the callback function's return type. It can also be null or undefined if you want to delete a
   * specific node based on its value or object.
   * @param {C} callback - The `callback` parameter is a function that is used to determine the
   * identifier of the node to be deleted. It is optional and has a default value of
   * `this._defaultOneParamCallback`. The `callback` function should return the identifier of the node.
   * @returns an array of `BiTreeDeleteResult<N>`.
   */
  delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C
  ): BiTreeDeleteResult<N>[] {
    const deletedResult: BiTreeDeleteResult<N>[] = [];
    if (!this.root) return deletedResult;
    if ((!callback || callback === this._defaultOneParamCallback) && (identifier as any) instanceof BinaryTreeNode)
      callback = (node => node) as C;

    const curr = this.getNode(identifier, callback);
    if (!curr) return deletedResult;

    const parent: N | null | undefined = curr?.parent ? curr.parent : null;
    let needBalanced: N | null | undefined = undefined;
    let orgCurrent: N | undefined = curr;

    if (!curr.left) {
      if (!parent) {
        // Handle the case when there's only one root node
        this._setRoot(null);
      } else {
        const {familyPosition: fp} = curr;
        if (fp === FamilyPosition.LEFT || fp === FamilyPosition.ROOT_LEFT) {
          parent.left = curr.right;
        } else if (fp === FamilyPosition.RIGHT || fp === FamilyPosition.ROOT_RIGHT) {
          parent.right = curr.right;
        }
        needBalanced = parent;
      }
    } else {
      if (curr.left) {
        const leftSubTreeRightMost = this.getRightMost(curr.left);
        if (leftSubTreeRightMost) {
          const parentOfLeftSubTreeMax = leftSubTreeRightMost.parent;
          orgCurrent = this._swap(curr, leftSubTreeRightMost);
          if (parentOfLeftSubTreeMax) {
            if (parentOfLeftSubTreeMax.right === leftSubTreeRightMost) parentOfLeftSubTreeMax.right = leftSubTreeRightMost.left;
            else parentOfLeftSubTreeMax.left = leftSubTreeRightMost.left;
            needBalanced = parentOfLeftSubTreeMax;
          }
        }
      }
    }
    this._size = this.size - 1;

    deletedResult.push({deleted: orgCurrent, needBalanced});
    return deletedResult;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function calculates the depth of a given node in a binary tree.
   * @param {BTNKey | N | null | undefined} distNode - The `distNode` parameter represents the node in
   * the binary tree whose depth we want to find. It can be of type `BTNKey`, `N`, `null`, or
   * `undefined`.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting node
   * from which we want to calculate the depth. It can be either a `BTNKey` (binary tree node key) or
   * `N` (binary tree node) or `null` or `undefined`. If no value is provided for `beginRoot
   * @returns the depth of the `distNode` relative to the `beginRoot`.
   */
  getDepth(distNode: BTNKey | N | null | undefined, beginRoot: BTNKey | N | null | undefined = this.root): number {
    distNode = this.ensureNotKey(distNode);
    beginRoot = this.ensureNotKey(beginRoot);
    let depth = 0;
    while (distNode?.parent) {
      if (distNode === beginRoot) {
        return depth;
      }
      depth++;
      distNode = distNode.parent;
    }
    return depth;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   * Best Case - O(log n) (when using recursive iterationType), Worst Case - O(n) (when using iterative iterationType)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `getHeight` calculates the maximum height of a binary tree using either recursive or
   * iterative traversal.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node of the binary tree from which we want to calculate the height. It can be of type
   * `BTNKey`, `N`, `null`, or `undefined`. If not provided, it defaults to `this.root`.
   * @param iterationType - The `iterationType` parameter is used to determine whether to calculate the
   * height of the tree using a recursive approach or an iterative approach. It can have two possible
   * values:
   * @returns the height of the binary tree.
   */
  getHeight(beginRoot: BTNKey | N | null | undefined = this.root, iterationType = this.iterationType): number {
    beginRoot = this.ensureNotKey(beginRoot);
    if (!beginRoot) return -1;

    if (iterationType === IterationType.RECURSIVE) {
      const _getMaxHeight = (cur: N | null | undefined): number => {
        if (!cur) return -1;
        const leftHeight = _getMaxHeight(cur.left);
        const rightHeight = _getMaxHeight(cur.right);
        return Math.max(leftHeight, rightHeight) + 1;
      };

      return _getMaxHeight(beginRoot);
    } else {
      const stack: {node: N; depth: number}[] = [{node: beginRoot, depth: 0}];
      let maxHeight = 0;

      while (stack.length > 0) {
        const {node, depth} = stack.pop()!;

        if (node.left) stack.push({node: node.left, depth: depth + 1});
        if (node.right) stack.push({node: node.right, depth: depth + 1});

        maxHeight = Math.max(maxHeight, depth);
      }

      return maxHeight;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   * Best Case - O(log n) (when using recursive iterationType), Worst Case - O(n) (when using iterative iterationType)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The `getMinHeight` function calculates the minimum height of a binary tree using either a
   * recursive or iterative approach.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node of the binary tree from which we want to calculate the minimum height. It can be of
   * type `BTNKey`, `N`, `null`, or `undefined`. If no value is provided, it defaults to `this.root`.
   * @param iterationType - The `iterationType` parameter is used to determine the method of iteration
   * to calculate the minimum height of a binary tree. It can have two possible values:
   * @returns The function `getMinHeight` returns the minimum height of a binary tree.
   */
  getMinHeight(beginRoot: BTNKey | N | null | undefined = this.root, iterationType = this.iterationType): number {
    beginRoot = this.ensureNotKey(beginRoot);
    if (!beginRoot) return -1;

    if (iterationType === IterationType.RECURSIVE) {
      const _getMinHeight = (cur: N | null | undefined): number => {
        if (!cur) return 0;
        if (!cur.left && !cur.right) return 0;
        const leftMinHeight = _getMinHeight(cur.left);
        const rightMinHeight = _getMinHeight(cur.right);
        return Math.min(leftMinHeight, rightMinHeight) + 1;
      };

      return _getMinHeight(beginRoot);
    } else {
      const stack: N[] = [];
      let node: N | null | undefined = beginRoot,
        last: N | null | undefined = null;
      const depths: Map<N, number> = new Map();

      while (stack.length > 0 || node) {
        if (node) {
          stack.push(node);
          node = node.left;
        } else {
          node = stack[stack.length - 1];
          if (!node.right || last === node.right) {
            node = stack.pop();
            if (node) {
              const leftMinHeight = node.left ? depths.get(node.left) ?? -1 : -1;
              const rightMinHeight = node.right ? depths.get(node.right) ?? -1 : -1;
              depths.set(node, 1 + Math.min(leftMinHeight, rightMinHeight));
              last = node;
              node = null;
            }
          } else node = node.right;
        }
      }

      return depths.get(beginRoot) ?? -1;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function checks if a binary tree is perfectly balanced by comparing the minimum height and the
   * height of the tree.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for calculating the height and minimum height of a binary tree. It can be either a `BTNKey` (a key
   * value of a binary tree node), `N` (a node of a binary tree), `null`, or `undefined`. If
   * @returns a boolean value.
   */
  isPerfectlyBalanced(beginRoot: BTNKey | N | null | undefined = this.root): boolean {
    return this.getMinHeight(beginRoot) + 1 >= this.getHeight(beginRoot);
  }

  getNodes<C extends BTNCallback<N, BTNKey>>(
    identifier: BTNKey,
    callback?: C,
    onlyOne?: boolean,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): N[];

  getNodes<C extends BTNCallback<N, N>>(
    identifier: N | null | undefined,
    callback?: C,
    onlyOne?: boolean,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): N[];

  getNodes<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C,
    onlyOne?: boolean,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): N[];

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n).
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n).
   *
   * The function `getNodes` retrieves nodes from a binary tree based on a given identifier and
   * callback function.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * that you want to search for in the binary tree. It can be of any type that is returned by the
   * callback function `C`. It can also be `null` or `undefined` if you don't want to search for a
   * specific value.
   * @param {C} callback - The `callback` parameter is a function that takes a node of type `N` as
   * input and returns a value of type `C`. It is used to determine if a node matches the given
   * identifier. If no callback is provided, the `_defaultOneParamCallback` function is used as the
   * default
   * @param [onlyOne=false] - A boolean value indicating whether to only return the first node that
   * matches the identifier. If set to true, the function will stop iterating once it finds a matching
   * node and return that node. If set to false (default), the function will continue iterating and
   * return all nodes that match the identifier.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node for the traversal. It can be either a key, a node object, or `null`/`undefined`. If
   * it is `null` or `undefined`, an empty array will be returned.
   * @param iterationType - The `iterationType` parameter determines the type of iteration used to
   * traverse the binary tree. It can have two possible values:
   * @returns an array of nodes of type `N`.
   */
  getNodes<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C,
    onlyOne = false,
    beginRoot: BTNKey | N | null | undefined = this.root,
    iterationType = this.iterationType
  ): N[] {
    if ((!callback || callback === this._defaultOneParamCallback) && (identifier as any) instanceof BinaryTreeNode)
      callback = (node => node) as C;
    beginRoot = this.ensureNotKey(beginRoot);
    if (!beginRoot) return [];

    const ans: N[] = [];

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: N) => {
        if (callback(cur) === identifier) {
          ans.push(cur);
          if (onlyOne) return;
        }
        if (!cur.left && !cur.right) return;
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(beginRoot);
    } else {
      const queue = new Queue<N>([beginRoot]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          if (callback(cur) === identifier) {
            ans.push(cur);
            if (onlyOne) return ans;
          }
          cur.left && queue.push(cur.left);
          cur.right && queue.push(cur.right);
        }
      }
    }

    return ans;
  }

  has<C extends BTNCallback<N, BTNKey>>(
    identifier: BTNKey,
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): boolean;

  has<C extends BTNCallback<N, N>>(
    identifier: N | null | undefined,
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): boolean;

  has<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): boolean;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n).
   */

  /**
   * Time Complexity: O(n)
   *
   * The function checks if a Binary Tree Node with a specific identifier exists in the tree.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * that you want to search for in the binary tree. It can be of any type that is returned by the
   * callback function `C`. It can also be `null` or `undefined` if you don't want to specify a
   * specific identifier.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the binary tree. It is used to filter the nodes based on certain conditions. The `callback`
   * function should return a boolean value indicating whether the node should be included in the
   * result or not.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for the search in the binary tree. It can be specified as a `BTNKey` (a unique identifier for a
   * node in the binary tree), a node object (`N`), or `null`/`undefined` to start the search from
   * @param iterationType - The `iterationType` parameter is a variable that determines the type of
   * iteration to be performed on the binary tree. It is used to specify whether the iteration should
   * be performed in a pre-order, in-order, or post-order manner.
   * @returns a boolean value.
   */
  has<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKey | N | null | undefined = this.root,
    iterationType = this.iterationType
  ): boolean {
    if ((!callback || callback === this._defaultOneParamCallback) && (identifier as any) instanceof BinaryTreeNode)
      callback = (node => node) as C;

    return this.getNodes(identifier, callback, true, beginRoot, iterationType).length > 0;
  }

  getNode<C extends BTNCallback<N, BTNKey>>(
    identifier: BTNKey,
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): N | null | undefined;

  getNode<C extends BTNCallback<N, N>>(
    identifier: N | null | undefined,
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): N | null | undefined;

  getNode<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): N | null | undefined;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `getNode` returns the first node that matches the given identifier and callback
   * function.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * used to identify the node you want to retrieve. It can be of any type that is returned by the
   * callback function `C`. It can also be `null` or `undefined` if you don't have a specific
   * identifier.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the binary tree. It is used to determine if a node matches the given identifier. The `callback`
   * function should take a single parameter of type `N` (the type of the nodes in the binary tree) and
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for searching the binary tree. It can be either a key value, a node object, or `null`/`undefined`.
   * If `null` or `undefined` is passed, the search will start from the root of the binary tree.
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed when searching for nodes in the binary tree. It determines the order in which the
   * nodes are visited during the search.
   * @returns a value of type `N | null | undefined`.
   */
  getNode<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKey | N | null | undefined = this.root,
    iterationType = this.iterationType
  ): N | null | undefined {
    if ((!callback || callback === this._defaultOneParamCallback) && (identifier as any) instanceof BinaryTreeNode)
      callback = (node => node) as C;

    return this.getNodes(identifier, callback, true, beginRoot, iterationType)[0] ?? null;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `getNodeByKey` searches for a node in a binary tree by its key, using either
   * recursive or iterative iteration.
   * @param {BTNKey} key - The `key` parameter is the key value that we are searching for in the tree.
   * It is used to find the node with the matching key value.
   * @param iterationType - The `iterationType` parameter is used to determine whether the search for
   * the node with the given key should be performed iteratively or recursively. It has two possible
   * values:
   * @returns The function `getNodeByKey` returns a node (`N`) if a node with the specified key is
   * found in the binary tree. If no node is found, it returns `undefined`.
   */
  getNodeByKey(key: BTNKey, iterationType = IterationType.ITERATIVE): N | undefined {
    if (!this.root) return undefined;
    if (iterationType === IterationType.RECURSIVE) {
      const _dfs = (cur: N): N | undefined => {
        if (cur.key === key) return cur;

        if (!cur.left && !cur.right) return;
        if (cur.left) return _dfs(cur.left);
        if (cur.right) return _dfs(cur.right);
      };

      return _dfs(this.root);
    } else {
      const queue = new Queue<N>([this.root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          if (cur.key === key) return cur;
          cur.left && queue.push(cur.left);
          cur.right && queue.push(cur.right);
        }
      }
    }
  }

  /**
   * The function `ensureNotKey` returns the node corresponding to the given key if it is a valid node
   * key, otherwise it returns the key itself.
   * @param {BTNKey | N | null | undefined} key - The `key` parameter can be of type `BTNKey`, `N`,
   * `null`, or `undefined`. It represents a key used to identify a node in a binary tree.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to be used when searching for a node by key. It has a default value of
   * `IterationType.ITERATIVE`.
   * @returns either the node corresponding to the given key if it is a valid node key, or the key
   * itself if it is not a valid node key.
   */
  ensureNotKey(key: BTNKey | N | null | undefined, iterationType = IterationType.ITERATIVE): N | null | undefined {
    return this.isNodeKey(key) ? this.getNodeByKey(key, iterationType) : key;
  }

  get<C extends BTNCallback<N, BTNKey>>(
    identifier: BTNKey,
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): V | undefined;

  get<C extends BTNCallback<N, N>>(
    identifier: N | null | undefined,
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): V | undefined;

  get<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType
  ): V | undefined;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `get` retrieves the value of a node in a binary tree based on the provided identifier
   * and callback function.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * used to identify the node in the binary tree. It can be of any type that is the return type of the
   * callback function `C`. It can also be `null` or `undefined` if no identifier is provided.
   * @param {C} callback - The `callback` parameter is a function that will be called with each node in
   * the binary tree. It is used to determine whether a node matches the given identifier. The callback
   * function should return a value that can be compared to the identifier to determine if it is a
   * match.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for the search in the binary tree. It can be specified as a `BTNKey` (a unique identifier for a
   * node), a node object of type `N`, or `null`/`undefined` to start the search from the root of
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed when searching for a node in the binary tree. It is an optional parameter with a
   * default value specified by `this.iterationType`.
   * @returns The value of the node with the given identifier is being returned. If the node is not
   * found, `undefined` is returned.
   */
  get<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKey | N | null | undefined = this.root,
    iterationType = this.iterationType
  ): V | undefined {
    if ((!callback || callback === this._defaultOneParamCallback) && (identifier as any) instanceof BinaryTreeNode)
      callback = (node => node) as C;

    return this.getNode(identifier, callback, beginRoot, iterationType)?.value ?? undefined;
  }

  /**
   * Clear the binary tree, removing all nodes.
   */
  clear() {
    this._setRoot(undefined);
    this._size = 0;
  }

  /**
   * Check if the binary tree is empty.
   * @returns {boolean} - True if the binary tree is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function `getPathToRoot` returns an array of nodes from a given node to the root of a tree
   * structure, with the option to reverse the order of the nodes.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node from which you want to find the path to the root. It can be of type `BTNKey`, `N`,
   * `null`, or `undefined`.
   * @param [isReverse=true] - The `isReverse` parameter is a boolean flag that determines whether the
   * resulting path should be reversed or not. If `isReverse` is set to `true`, the path will be
   * reversed before returning it. If `isReverse` is set to `false`, the path will be returned as is
   * @returns The function `getPathToRoot` returns an array of nodes (`N[]`).
   */
  getPathToRoot(beginRoot: BTNKey | N | null | undefined, isReverse = true): N[] {
    // TODO to support get path through passing key
    const result: N[] = [];
    beginRoot = this.ensureNotKey(beginRoot);

    if (!beginRoot) return result;

    while (beginRoot.parent) {
      // Array.push + Array.reverse is more efficient than Array.unshift
      // TODO may consider using Deque, so far this is not the performance bottleneck
      result.push(beginRoot);
      beginRoot = beginRoot.parent;
    }
    result.push(beginRoot);
    return isReverse ? result.reverse() : result;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getLeftMost` returns the leftmost node in a binary tree, either recursively or
   * iteratively.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for finding the leftmost node in a binary tree. It can be either a `BTNKey` (a key value), `N` (a
   * node), `null`, or `undefined`. If not provided, it defaults to `this.root`,
   * @param iterationType - The `iterationType` parameter is used to determine the type of iteration to
   * be performed when finding the leftmost node in a binary tree. It can have two possible values:
   * @returns The function `getLeftMost` returns the leftmost node (`N`) in the binary tree. If there
   * is no leftmost node, it returns `null` or `undefined` depending on the input.
   */
  getLeftMost(beginRoot: BTNKey | N | null | undefined = this.root, iterationType = this.iterationType): N | null | undefined {
    beginRoot = this.ensureNotKey(beginRoot);

    if (!beginRoot) return beginRoot;

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: N): N => {
        if (!this.isRealNode(cur.left)) return cur;
        return _traverse(cur.left);
      };

      return _traverse(beginRoot);
    } else {
      // Indirect implementation of iteration using tail recursion optimization
      const _traverse = trampoline((cur: N) => {
        if (!this.isRealNode(cur.left)) return cur;
        return _traverse.cont(cur.left);
      });

      return _traverse(beginRoot);
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
   * The function `getRightMost` returns the rightmost node in a binary tree, either recursively or
   * iteratively.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node from which we want to find the rightmost node. It can be of type `BTNKey`, `N`,
   * `null`, or `undefined`. If not provided, it defaults to `this.root`, which is a property of the
   * current object.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when finding the rightmost node. It can have one of two values:
   * @returns The function `getRightMost` returns the rightmost node (`N`) in a binary tree. If there
   * is no rightmost node, it returns `null` or `undefined`, depending on the input.
   */
  getRightMost(beginRoot: BTNKey | N | null | undefined = this.root, iterationType = this.iterationType): N | null | undefined {
    // TODO support get right most by passing key in
    beginRoot = this.ensureNotKey(beginRoot);
    if (!beginRoot) return beginRoot;

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: N): N => {
        if (!this.isRealNode(cur.right)) return cur;
        return _traverse(cur.right);
      };

      return _traverse(beginRoot);
    } else {
      // Indirect implementation of iteration using tail recursion optimization
      const _traverse = trampoline((cur: N) => {
        if (!this.isRealNode(cur.right)) return cur;
        return _traverse.cont(cur.right);
      });

      return _traverse(beginRoot);
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `isSubtreeBST` checks if a given binary tree is a valid binary search tree.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the root
   * node of the binary search tree (BST) that you want to check if it is a subtree of another BST.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when checking if a subtree is a binary search tree (BST). It can have two
   * possible values:
   * @returns a boolean value.
   */
  isSubtreeBST(beginRoot: BTNKey | N | null | undefined, iterationType = this.iterationType): boolean {
    // TODO there is a bug
    beginRoot = this.ensureNotKey(beginRoot);
    if (!beginRoot) return true;

    if (iterationType === IterationType.RECURSIVE) {
      const dfs = (cur: N | null | undefined, min: BTNKey, max: BTNKey): boolean => {
        if (!cur) return true;
        if (cur.key <= min || cur.key >= max) return false;
        return dfs(cur.left, min, cur.key) && dfs(cur.right, cur.key, max);
      };

      return dfs(beginRoot, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    } else {
      const stack = [];
      let prev = Number.MIN_SAFE_INTEGER,
        curr: N | null | undefined = beginRoot;
      while (curr || stack.length > 0) {
        while (curr) {
          stack.push(curr);
          curr = curr.left;
        }
        curr = stack.pop()!;
        if (!curr || prev >= curr.key) return false;
        prev = curr.key;
        curr = curr.right;
      }
      return true;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function checks if a binary tree is a binary search tree.
   * @param iterationType - The parameter "iterationType" is used to specify the type of iteration to
   * be used when checking if the binary tree is a binary search tree (BST). It is an optional
   * parameter with a default value of "this.iterationType". The value of "this.iterationType" is
   * expected to be
   * @returns a boolean value.
   */
  isBST(iterationType = this.iterationType): boolean {
    if (this.root === null) return true;
    return this.isSubtreeBST(this.root, iterationType);
  }

  subTreeTraverse<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  subTreeTraverse<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: undefined
  ): ReturnType<C>[];

  subTreeTraverse<C extends BTNCallback<N | null | undefined>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(log n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(log n)
   *
   * The function `subTreeTraverse` traverses a binary tree and applies a callback function to each
   * node, either recursively or iteratively.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the subtree traversal. It takes a single parameter, which is the current node being traversed, and
   * returns a value of any type.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node or key from which the subtree traversal should begin. It can be of type `BTNKey`,
   * `N`, `null`, or `undefined`. If not provided, the `root` property of the current object is used as
   * the default value.
   * @param iterationType - The `iterationType` parameter determines the type of traversal to be
   * performed on the subtree. It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean value that determines
   * whether or not to include null values in the traversal. If `includeNull` is set to `true`, the
   * traversal will include null values, otherwise it will skip them.
   * @returns The function `subTreeTraverse` returns an array of values that are the result of invoking
   * the `callback` function on each node in the subtree. The type of the array elements is determined
   * by the return type of the `callback` function.
   */
  subTreeTraverse<C extends BTNCallback<N | null | undefined>>(
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKey | N | null | undefined = this.root,
    iterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    beginRoot = this.ensureNotKey(beginRoot);

    const ans: (ReturnType<BTNCallback<N>> | null | undefined)[] = [];
    if (!beginRoot) return ans;

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: N | null | undefined) => {
        if (cur !== undefined) {
          ans.push(callback(cur));
          if (includeNull) {
            cur && this.isNodeOrNull(cur.left) && _traverse(cur.left);
            cur && this.isNodeOrNull(cur.right) && _traverse(cur.right);
          } else {
            cur && cur.left && _traverse(cur.left);
            cur && cur.right && _traverse(cur.right);
          }
        }
      };

      _traverse(beginRoot);
    } else {
      const stack: (N | null | undefined)[] = [beginRoot];

      while (stack.length > 0) {
        const cur = stack.pop();
        if (cur !== undefined) {
          ans.push(callback(cur));
          if (includeNull) {
            cur && this.isNodeOrNull(cur.right) && stack.push(cur.right);
            cur && this.isNodeOrNull(cur.left) && stack.push(cur.left);
          } else {
            cur && cur.right && stack.push(cur.right);
            cur && cur.left && stack.push(cur.left);
          }
        }
      }
    }
    return ans;
  }

  /**
   * The function checks if a given node is a real node by verifying if it is an instance of
   * BinaryTreeNode and its key is not NaN.
   * @param {any} node - The parameter `node` is of type `any`, which means it can be any data type.
   * @returns a boolean value.
   */
  isRealNode(node: any): node is N {
    return node instanceof BinaryTreeNode && node.key.toString() !== 'NaN';
  }

  /**
   * The function checks if a given node is a BinaryTreeNode instance and has a key value of NaN.
   * @param {any} node - The parameter `node` is of type `any`, which means it can be any data type.
   * @returns a boolean value.
   */
  isNIL(node: any) {
    return node instanceof BinaryTreeNode && node.key.toString() === 'NaN';
  }

  /**
   * The function checks if a given node is a real node or null.
   * @param {any} node - The parameter `node` is of type `any`, which means it can be any data type.
   * @returns a boolean value.
   */
  isNodeOrNull(node: any): node is N | null {
    return this.isRealNode(node) || node === null;
  }

  /**
   * The function "isNodeKey" checks if a potential key is a number.
   * @param {any} potentialKey - The potentialKey parameter is of type any, which means it can be any
   * data type.
   * @returns a boolean value indicating whether the potentialKey is of type number or not.
   */
  isNodeKey(potentialKey: any): potentialKey is number {
    return typeof potentialKey === 'number';
  }

  dfs<C extends BTNCallback<N>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  dfs<C extends BTNCallback<N>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: undefined
  ): ReturnType<C>[];

  dfs<C extends BTNCallback<N | null | undefined>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `dfs` function performs a depth-first search traversal on a binary tree or graph, based on the
   * specified pattern and iteration type, and returns an array of values obtained from applying a
   * callback function to each visited node.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the tree during the depth-first search. It takes a single parameter, which can be of type `N`,
   * `null`, or `undefined`, and returns a value of any type. The default value for this parameter is
   * @param {DFSOrderPattern} [pattern=in] - The `pattern` parameter determines the order in which the
   * nodes are traversed during the depth-first search. It can have one of the following values:
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting node
   * for the depth-first search traversal. It can be specified as a key, a node object, or
   * `null`/`undefined`. If not provided, the `beginRoot` will default to the root node of the tree.
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * iteration to use when traversing the tree. It can have one of the following values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean value that determines
   * whether null or undefined nodes should be included in the traversal. If `includeNull` is set to
   * `true`, null or undefined nodes will be included in the traversal. If `includeNull` is set to
   * `false`, null or undefined
   * @returns an array of values that are the return values of the callback function.
   */
  dfs<C extends BTNCallback<N | null | undefined>>(
    callback: C = this._defaultOneParamCallback as C,
    pattern: DFSOrderPattern = 'in',
    beginRoot: BTNKey | N | null | undefined = this.root,
    iterationType: IterationType = IterationType.ITERATIVE,
    includeNull = false
  ): ReturnType<C>[] {
    beginRoot = this.ensureNotKey(beginRoot);
    if (!beginRoot) return [];
    const ans: ReturnType<C>[] = [];
    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (node: N | null | undefined) => {
        switch (pattern) {
          case 'in':
            if (includeNull) {
              if (node && this.isNodeOrNull(node.left)) _traverse(node.left);
              this.isNodeOrNull(node) && ans.push(callback(node));
              if (node && this.isNodeOrNull(node.right)) _traverse(node.right);
            } else {
              if (node && node.left) _traverse(node.left);
              this.isRealNode(node) && ans.push(callback(node));
              if (node && node.right) _traverse(node.right);
            }
            break;
          case 'pre':
            if (includeNull) {
              this.isNodeOrNull(node) && ans.push(callback(node));
              if (node && this.isNodeOrNull(node.left)) _traverse(node.left);
              if (node && this.isNodeOrNull(node.right)) _traverse(node.right);
            } else {
              this.isRealNode(node) && ans.push(callback(node));
              if (node && node.left) _traverse(node.left);
              if (node && node.right) _traverse(node.right);
            }
            break;
          case 'post':
            if (includeNull) {
              if (node && this.isNodeOrNull(node.left)) _traverse(node.left);
              if (node && this.isNodeOrNull(node.right)) _traverse(node.right);
              this.isNodeOrNull(node) && ans.push(callback(node));
            } else {
              if (node && node.left) _traverse(node.left);
              if (node && node.right) _traverse(node.right);
              this.isRealNode(node) && ans.push(callback(node));
            }

            break;
        }
      };

      _traverse(beginRoot);
    } else {
      // 0: visit, 1: print
      const stack: {opt: 0 | 1; node: N | null | undefined}[] = [{opt: 0, node: beginRoot}];

      while (stack.length > 0) {
        const cur = stack.pop();
        if (cur === undefined || this.isNIL(cur.node)) continue;
        if (includeNull) {
          if (cur.node === undefined) continue;
        } else {
          if (cur.node === null || cur.node === undefined) continue;
        }
        if (cur.opt === 1) {
          ans.push(callback(cur.node));
        } else {
          switch (pattern) {
            case 'in':
              cur.node && stack.push({opt: 0, node: cur.node.right});
              stack.push({opt: 1, node: cur.node});
              cur.node && stack.push({opt: 0, node: cur.node.left});
              break;
            case 'pre':
              cur.node && stack.push({opt: 0, node: cur.node.right});
              cur.node && stack.push({opt: 0, node: cur.node.left});
              stack.push({opt: 1, node: cur.node});
              break;
            case 'post':
              stack.push({opt: 1, node: cur.node});
              cur.node && stack.push({opt: 0, node: cur.node.right});
              cur.node && stack.push({opt: 0, node: cur.node.left});
              break;
            default:
              cur.node && stack.push({opt: 0, node: cur.node.right});
              stack.push({opt: 1, node: cur.node});
              cur.node && stack.push({opt: 0, node: cur.node.left});
              break;
          }
        }
      }
    }

    return ans;
  }

  bfs<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  bfs<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: undefined
  ): ReturnType<C>[];

  bfs<C extends BTNCallback<N | null | undefined>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `bfs` function performs a breadth-first search traversal on a binary tree, executing a
   * callback function on each node.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the breadth-first search traversal. It takes a single parameter, which is the current node being
   * visited, and returns a value of any type.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node for the breadth-first search traversal. It can be specified as a key, a node object,
   * or `null`/`undefined` to indicate the root of the tree. If not provided, the `root` property of
   * the class is used as
   * @param iterationType - The `iterationType` parameter determines the type of iteration to be
   * performed during the breadth-first search (BFS). It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean flag that determines whether
   * or not to include null values in the breadth-first search traversal. If `includeNull` is set to
   * `true`, null values will be included in the traversal, otherwise they will be skipped.
   * @returns an array of values that are the result of invoking the callback function on each node in
   * the breadth-first traversal of a binary tree.
   */
  bfs<C extends BTNCallback<N | null | undefined>>(
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKey | N | null | undefined = this.root,
    iterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    beginRoot = this.ensureNotKey(beginRoot);
    if (!beginRoot) return [];

    const ans: ReturnType<BTNCallback<N>>[] = [];

    if (iterationType === IterationType.RECURSIVE) {
      const queue: Queue<N | null | undefined> = new Queue<N | null | undefined>([beginRoot]);

      const traverse = (level: number) => {
        if (queue.size === 0) return;

        const current = queue.shift()!;
        ans.push(callback(current));

        if (includeNull) {
          if (current && this.isNodeOrNull(current.left)) queue.push(current.left);
          if (current && this.isNodeOrNull(current.right)) queue.push(current.right);
        } else {
          if (current.left) queue.push(current.left);
          if (current.right) queue.push(current.right);
        }

        traverse(level + 1);
      };

      traverse(0);
    } else {
      const queue = new Queue<N | null | undefined>([beginRoot]);
      while (queue.size > 0) {
        const levelSize = queue.size;

        for (let i = 0; i < levelSize; i++) {
          const current = queue.shift()!;
          ans.push(callback(current));

          if (includeNull) {
            if (current && this.isNodeOrNull(current.left)) queue.push(current.left);
            if (current && this.isNodeOrNull(current.right)) queue.push(current.right);
          } else {
            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.right);
          }
        }
      }
    }
    return ans;
  }

  listLevels<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[][];

  listLevels<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: undefined
  ): ReturnType<C>[][];

  listLevels<C extends BTNCallback<N | null | undefined>>(
    callback?: C,
    beginRoot?: BTNKey | N | null | undefined,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[][];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `listLevels` function returns an array of arrays, where each inner array represents a level in
   * a binary tree and contains the values returned by a callback function applied to the nodes at that
   * level.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the tree. It takes a single parameter, which can be of type `N`, `null`, or `undefined`, and
   * returns a value of any type.
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node for traversing the tree. It can be either a node object (`N`), a key value
   * (`BTNKey`), `null`, or `undefined`. If not provided, it defaults to the root node of the tree.
   * @param iterationType - The `iterationType` parameter determines the type of iteration to be
   * performed on the tree. It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean value that determines
   * whether or not to include null values in the resulting levels. If `includeNull` is set to `true`,
   * null values will be included in the levels. If `includeNull` is set to `false`, null values will
   * be excluded
   * @returns The function `listLevels` returns a two-dimensional array of type `ReturnType<C>[][]`.
   */
  listLevels<C extends BTNCallback<N | null | undefined>>(
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKey | N | null | undefined = this.root,
    iterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[][] {
    beginRoot = this.ensureNotKey(beginRoot);
    const levelsNodes: ReturnType<C>[][] = [];
    if (!beginRoot) return levelsNodes;

    if (iterationType === IterationType.RECURSIVE) {
      const _recursive = (node: N | null | undefined, level: number) => {
        if (!levelsNodes[level]) levelsNodes[level] = [];
        levelsNodes[level].push(callback(node));
        if (includeNull) {
          if (node && this.isNodeOrNull(node.left)) _recursive(node.left, level + 1);
          if (node && this.isNodeOrNull(node.right)) _recursive(node.right, level + 1);
        } else {
          if (node && node.left) _recursive(node.left, level + 1);
          if (node && node.right) _recursive(node.right, level + 1);
        }
      };

      _recursive(beginRoot, 0);
    } else {
      const stack: [N | null | undefined, number][] = [[beginRoot, 0]];

      while (stack.length > 0) {
        const head = stack.pop()!;
        const [node, level] = head;

        if (!levelsNodes[level]) levelsNodes[level] = [];
        levelsNodes[level].push(callback(node));

        if (includeNull) {
          if (node && this.isNodeOrNull(node.right)) stack.push([node.right, level + 1]);
          if (node && this.isNodeOrNull(node.left)) stack.push([node.left, level + 1]);
        } else {
          if (node && node.right) stack.push([node.right, level + 1]);
          if (node && node.left) stack.push([node.left, level + 1]);
        }
      }
    }

    return levelsNodes;
  }

  getPredecessor(node: N): N;

  /**
   * The function `getPredecessor` returns the predecessor node of a given node in a binary tree.
   * @param {BTNKey | N | null | undefined} node - The `node` parameter can be of type `BTNKey`, `N`,
   * `null`, or `undefined`.
   * @returns The function `getPredecessor` returns a value of type `N | undefined`.
   */
  getPredecessor(node: BTNKey | N | null | undefined): N | undefined {
    node = this.ensureNotKey(node);
    if (!this.isRealNode(node)) return undefined;

    if (node.left) {
      let predecessor: N | null | undefined = node.left;
      while (!this.isRealNode(predecessor) || (this.isRealNode(predecessor.right) && predecessor.right !== node)) {
        if (predecessor) {
          predecessor = predecessor.right;
        }
      }
      return predecessor;
    } else {
      return node;
    }
  }

  /**
   * The function `getSuccessor` returns the next node in a binary tree given a current node.
   * @param {BTNKey | N | null} [x] - The parameter `x` can be of type `BTNKey`, `N`, or `null`.
   * @returns the successor of the given node or key. The successor is the node that comes immediately
   * after the given node in the inorder traversal of the binary tree.
   */
  getSuccessor(x?: BTNKey | N | null): N | null | undefined {
    x = this.ensureNotKey(x);
    if (!x) return undefined;

    if (x.right) {
      return this.getLeftMost(x.right);
    }

    let y: N | null | undefined = x.parent;
    while (y && y && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(1)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(1)
   * The `morris` function performs a depth-first traversal on a binary tree using the Morris traversal
   * algorithm.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the tree. It takes a single parameter of type `N` (the type of the nodes in the tree) and returns
   * a value of any type.
   * @param {DFSOrderPattern} [pattern=in] - The `pattern` parameter in the `morris` function
   * determines the order in which the nodes of a binary tree are traversed. It can have one of the
   * following values:
   * @param {BTNKey | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting node
   * for the traversal. It can be specified as a key, a node object, or `null`/`undefined` to indicate
   * the root of the tree. If no value is provided, the default value is the root of the tree.
   * @returns The function `morris` returns an array of values that are the result of invoking the
   * `callback` function on each node in the binary tree. The type of the array elements is determined
   * by the return type of the `callback` function.
   */
  morris<C extends BTNCallback<N>>(
    callback: C = this._defaultOneParamCallback as C,
    pattern: DFSOrderPattern = 'in',
    beginRoot: BTNKey | N | null | undefined = this.root
  ): ReturnType<C>[] {
    beginRoot = this.ensureNotKey(beginRoot);
    if (beginRoot === null) return [];
    const ans: ReturnType<BTNCallback<N>>[] = [];

    let cur: N | null | undefined = beginRoot;
    const _reverseEdge = (node: N | null | undefined) => {
      let pre: N | null | undefined = null;
      let next: N | null | undefined = null;
      while (node) {
        next = node.right;
        node.right = pre;
        pre = node;
        node = next;
      }
      return pre;
    };
    const _printEdge = (node: N | null | undefined) => {
      const tail: N | null | undefined = _reverseEdge(node);
      let cur: N | null | undefined = tail;
      while (cur) {
        ans.push(callback(cur));
        cur = cur.right;
      }
      _reverseEdge(tail);
    };
    switch (pattern) {
      case 'in':
        while (cur) {
          if (cur.left) {
            const predecessor = this.getPredecessor(cur);
            if (!predecessor.right) {
              predecessor.right = cur;
              cur = cur.left;
              continue;
            } else {
              predecessor.right = null;
            }
          }
          ans.push(callback(cur));
          cur = cur.right;
        }
        break;
      case 'pre':
        while (cur) {
          if (cur.left) {
            const predecessor = this.getPredecessor(cur);
            if (!predecessor.right) {
              predecessor.right = cur;
              ans.push(callback(cur));
              cur = cur.left;
              continue;
            } else {
              predecessor.right = null;
            }
          } else {
            ans.push(callback(cur));
          }
          cur = cur.right;
        }
        break;
      case 'post':
        while (cur) {
          if (cur.left) {
            const predecessor = this.getPredecessor(cur);
            if (predecessor.right === null) {
              predecessor.right = cur;
              cur = cur.left;
              continue;
            } else {
              predecessor.right = null;
              _printEdge(cur.left);
            }
          }
          cur = cur.right;
        }
        _printEdge(beginRoot);
        break;
    }
    return ans;
  }

  /**
   * The above function is an iterator for a binary tree that can be used to traverse the tree in
   * either an iterative or recursive manner.
   * @param node - The `node` parameter represents the current node in the binary tree from which the
   * iteration starts. It is an optional parameter with a default value of `this.root`, which means
   * that if no node is provided, the iteration will start from the root of the binary tree.
   * @returns The `*[Symbol.iterator]` method returns a generator object that yields the keys of the
   * binary tree nodes in a specific order.
   */
  *[Symbol.iterator](node = this.root): Generator<BTNKey, void, undefined> {
    if (!node) {
      return;
    }

    if (this.iterationType === IterationType.ITERATIVE) {
      const stack: (N | null | undefined)[] = [];
      let current: N | null | undefined = node;

      while (current || stack.length > 0) {
        while (current) {
          stack.push(current);
          current = current.left;
        }

        current = stack.pop();

        if (current) yield current.key;
        if (current) current = current.right;
      }
    } else {
      if (node.left) {
        yield* this[Symbol.iterator](node.left);
      }
      yield node.key;
      if (node.right) {
        yield* this[Symbol.iterator](node.right);
      }
    }
  }

  /**
   * The `print` function is used to display a binary tree structure in a visually appealing way.
   * @param {N | null | undefined} root - The `root` parameter is of type `BTNKey | N | null |
   * undefined`. It represents the root node of a binary tree. The root node can have one of the
   * following types:
   */
  print(beginRoot: BTNKey | N | null | undefined = this.root): void {
    beginRoot = this.ensureNotKey(beginRoot);
    if (!beginRoot) return;

    const display = (root: N | null | undefined): void => {
      const [lines, , ,] = _displayAux(root);
      for (const line of lines) {
        console.log(line);
      }
    };

    const _displayAux = (node: N | null | undefined): [string[], number, number, number] => {
      if (!this.isRealNode(node)) {
        return [[], 0, 0, 0];
      }

      if (this.isRealNode(node) && !this.isRealNode(node.right) && !this.isRealNode(node.left)) {
        const line = `${node.key}`;
        const width = line.length;
        const height = 1;
        const middle = Math.floor(width / 2);
        return [[line], width, height, middle];
      }

      if (this.isRealNode(node) && !this.isRealNode(node.right)) {
        const [lines, n, p, x] = _displayAux(node.left);
        const s = `${node.key}`;
        const u = s.length;
        const first_line = ' '.repeat(x + 1) + '_'.repeat(n - x - 1) + s;
        const second_line = ' '.repeat(x) + '/' + ' '.repeat(n - x - 1 + u);
        const shifted_lines = lines.map(line => line + ' '.repeat(u));
        return [[first_line, second_line, ...shifted_lines], n + u, p + 2, n + Math.floor(u / 2)];
      }

      if (this.isRealNode(node) && !this.isRealNode(node.left)) {
        const [lines, n, p, u] = _displayAux(node.right);
        const s = `${node.key}`;
        const x = s.length;
        const first_line = s + '_'.repeat(x) + ' '.repeat(n - x);
        const second_line = ' '.repeat(u + x) + '\\' + ' '.repeat(n - x - 1);
        const shifted_lines = lines.map(line => ' '.repeat(u) + line);
        return [[first_line, second_line, ...shifted_lines], n + x, p + 2, Math.floor(u / 2)];
      }

      const [left, n, p, x] = _displayAux(node.left);
      const [right, m, q, y] = _displayAux(node.right);
      const s = `${node.key}`;
      const u = s.length;
      const first_line = ' '.repeat(x + 1) + '_'.repeat(n - x - 1) + s + '_'.repeat(y) + ' '.repeat(m - y);
      const second_line = ' '.repeat(x) + '/' + ' '.repeat(n - x - 1 + u + y) + '\\' + ' '.repeat(m - y - 1);
      if (p < q) {
        left.push(...new Array(q - p).fill(' '.repeat(n)));
      } else if (q < p) {
        right.push(...new Array(p - q).fill(' '.repeat(m)));
      }
      const zipped_lines = left.map((a, i) => a + ' '.repeat(u) + right[i]);
      return [[first_line, second_line, ...zipped_lines], n + m + u, Math.max(p, q) + 2, n + Math.floor(u / 2)];
    };

    display(beginRoot);
  }

  protected _defaultOneParamCallback = (node: N) => node.key;

  /**
   * Swap the data of two nodes in the binary tree.
   * @param {N} srcNode - The source node to swap.
   * @param {N} destNode - The destination node to swap.
   * @returns {N} - The destination node after the swap.
   */
  protected _swap(srcNode: BTNKey | N | null | undefined, destNode: BTNKey | N | null | undefined): N | undefined {
    srcNode = this.ensureNotKey(srcNode);
    destNode = this.ensureNotKey(destNode);

    if (srcNode && destNode) {
      const {key, value} = destNode;
      const tempNode = this.createNode(key, value);

      if (tempNode) {
        destNode.key = srcNode.key;
        destNode.value = srcNode.value;

        srcNode.key = tempNode.key;
        srcNode.value = tempNode.value;
      }

      return destNode;
    }
    return undefined;
  }

  /**
   * The function `_addTo` adds a new node to a binary tree if there is an available position.
   * @param {N | null | undefined} newNode - The `newNode` parameter represents the node that you want to add to
   * the binary tree. It can be either a node object or `null`.
   * @param {N} parent - The `parent` parameter represents the parent node to which the new node will
   * be added as a child.
   * @returns either the left or right child node of the parent node, depending on which child is
   * available for adding the new node. If a new node is added, the function also updates the size of
   * the binary tree. If neither the left nor right child is available, the function returns undefined.
   * If the parent node is null, the function also returns undefined.
   */
  protected _addTo(newNode: N | null | undefined, parent: BTNKey | N | null | undefined): N | null | undefined {
    if (this.isNodeKey(parent)) parent = this.getNode(parent);

    if (parent) {
      // When all leaf nodes are null, it will no longer be possible to add new entity nodes to this binary tree.
      // In this scenario, null nodes serve as "sentinel nodes," "virtual nodes," or "placeholder nodes."
      if (parent.left === undefined) {
        parent.left = newNode;
        if (newNode) {
          this._size = this.size + 1;
        }
        return parent.left;
      } else if (parent.right === undefined) {
        parent.right = newNode;
        if (newNode) {
          this._size = this.size + 1;
        }
        return parent.right;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  /**
   * The function sets the root property of an object to a given value, and if the value is not null,
   * it also sets the parent property of the value to undefined.
   * @param {N | null | undefined} v - The parameter `v` is of type `N | null | undefined`, which means it can either be of
   * type `N` or `null`.
   */
  protected _setRoot(v: N | null | undefined) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }
}
