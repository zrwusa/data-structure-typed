/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  BFSCallback,
  BFSCallbackReturn,
  BinaryTreeNodeKey,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  MapCallback,
  MapCallbackReturn
} from '../../types';
import {
  BinaryTreeDeletedResult,
  DFSOrderPattern,
  FamilyPosition,
  LoopType
} from '../../types';
import {IBinaryTree} from '../../interfaces';
import {trampoline} from '../../utils';
import {Queue} from '../queue';

export class BinaryTreeNode<V = any, FAMILY extends BinaryTreeNode<V, FAMILY> = BinaryTreeNodeNested<V>> {
  /**
   * The constructor function initializes a BinaryTreeNode object with a key and an optional value.
   * @param {BinaryTreeNodeKey} key - The `key` parameter is of type `BinaryTreeNodeKey` and represents the unique identifier
   * of the binary tree node. It is used to distinguish one node from another in the binary tree.
   * @param {V} [val] - The "val" parameter is an optional parameter of type V. It represents the value that will be
   * stored in the binary tree node. If no value is provided, it will be set to undefined.
   */
  constructor(key: BinaryTreeNodeKey, val?: V) {
    this.key = key;
    this.val = val;
  }

  key: BinaryTreeNodeKey;

  val: V | undefined;

  private _left: FAMILY | null | undefined;

  get left(): FAMILY | null | undefined {
    return this._left;
  }

  set left(v: FAMILY | null | undefined) {
    if (v) {
      v.parent = this as unknown as FAMILY;
    }
    this._left = v;
  }

  private _right: FAMILY | null | undefined;

  get right(): FAMILY | null | undefined {
    return this._right;
  }

  set right(v: FAMILY | null | undefined) {
    if (v) {
      v.parent = this as unknown as FAMILY;
    }
    this._right = v;
  }

  parent: FAMILY | null | undefined;

  /**
   * The function determines the position of a node in a family tree structure.
   * @returns a value of type `FamilyPosition`.
   */
  get familyPosition(): FamilyPosition {
    const that = this as unknown as FAMILY;
    if (that.parent) {
      if (that.parent.left === that) {
        if (that.left || that.right) {
          return FamilyPosition.ROOT_LEFT;
        } else {
          return FamilyPosition.LEFT;
        }
      } else if (that.parent.right === that) {
        if (that.left || that.right) {
          return FamilyPosition.ROOT_RIGHT;
        } else {
          return FamilyPosition.RIGHT;
        }
      } else {
        return FamilyPosition.MAL_NODE;
      }
    } else {
      if (that.left || that.right) {
        return FamilyPosition.ROOT;
      } else {
        return FamilyPosition.ISOLATED;
      }
    }
  }
}

export class BinaryTree<N extends BinaryTreeNode<N['val'], N> = BinaryTreeNode> implements IBinaryTree<N> {
  /**
   * This is a constructor function for a binary tree class that takes an optional options parameter.
   * @param {BinaryTreeOptions} [options] - The `options` parameter is an optional object that can be passed to the
   * constructor of the `BinaryTree` class. It allows you to customize the behavior of the binary tree by providing
   * different configuration options.
   */
  constructor(options?: BinaryTreeOptions) {
    if (options !== undefined) {
      const {loopType = LoopType.ITERATIVE} = options;
      this._loopType = loopType;
    }
  }

  /**
   * The function creates a new binary tree node with an optional value.
   * @param {BinaryTreeNodeKey} key - The `key` parameter is the identifier for the binary tree node. It is of type
   * `BinaryTreeNodeKey`, which represents the unique identifier for each node in the binary tree.
   * @param [val] - The `val` parameter is an optional value that can be assigned to the node. It represents the value
   * stored in the node.
   * @returns a new instance of a BinaryTreeNode with the specified key and value.
   */
  createNode(key: BinaryTreeNodeKey, val?: N['val']): N {
    return new BinaryTreeNode<N['val'], N>(key, val) as N;
  }

  // TODO placeholder node may need redesigned
  private _root: N | null = null;

  get root(): N | null {
    return this._root;
  }

  private _size = 0;

  get size(): number {
    return this._size;
  }

  private _loopType: LoopType = LoopType.ITERATIVE;

  get loopType(): LoopType {
    return this._loopType;
  }

  set loopType(v: LoopType) {
    this._loopType = v;
  }

  /**
   * The `_swap` function swaps the location of two nodes in a binary tree.
   * @param {N} srcNode - The source node that you want to _swap with the destination node.
   * @param {N} destNode - The `destNode` parameter represents the destination node where the values from `srcNode` will
   * be swapped to.
   * @returns The `destNode` is being returned.
   */
  protected _swap(srcNode: N, destNode: N): N {
    const {key, val} = destNode;
    const tempNode = this.createNode(key, val);

    if (tempNode) {
      destNode.key = srcNode.key;
      destNode.val = srcNode.val;

      srcNode.key = tempNode.key;
      srcNode.val = tempNode.val;
    }

    return destNode;
  }

  /**
   * The clear() function resets the root, size, and maxKey properties to their initial values.
   */
  clear() {
    this._root = null;
    this._size = 0;
  }

  /**
   * The function checks if the size of an object is equal to zero and returns a boolean value.
   * @returns A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * When all leaf nodes are null, it will no longer be possible to add new entity nodes to this binary tree.
   * In this scenario, null nodes serve as "sentinel nodes," "virtual nodes," or "placeholder nodes."
   */

  /**
   * The `add` function adds a new node to a binary tree, either by ID or by creating a new node with a given value.
   * @param {BinaryTreeNodeKey | N | null} keyOrNode - The `keyOrNode` parameter can be either a `BinaryTreeNodeKey`, which
   * is a number representing the ID of a binary tree node, or it can be a `N` object, which represents a binary tree
   * node itself. It can also be `null` if no node is specified.
   * @param [val] - The `val` parameter is an optional value that can be assigned to the `val` property of the new node
   * being added to the binary tree.
   * @returns The function `add` returns either the inserted node (`N`), `null`, or `undefined`.
   */
  add(keyOrNode: BinaryTreeNodeKey | N | null, val?: N['val']): N | null | undefined {
    const _bfs = (root: N, newNode: N | null): N | undefined | null => {
      const queue = new Queue<N | null>([root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          if (newNode && cur.key === newNode.key) return;
          const inserted = this._addTo(newNode, cur);
          if (inserted !== undefined) return inserted;
          if (cur.left) queue.push(cur.left);
          if (cur.right) queue.push(cur.right);
        } else return;
      }
      return;
    };

    let inserted: N | null | undefined, needInsert: N | null;

    if (keyOrNode === null) {
      needInsert = null;
    } else if (typeof keyOrNode === 'number') {
      needInsert = this.createNode(keyOrNode, val);
    } else if (keyOrNode instanceof BinaryTreeNode) {
      needInsert = keyOrNode;
    } else {
      return;
    }

    const existNode = keyOrNode ? this.get(keyOrNode, this._defaultCallbackByKey) : undefined;

    if (this.root) {
      if (existNode) {
        existNode.val = val;
        inserted = existNode;
      } else {
        inserted = _bfs(this.root, needInsert);
      }
    } else {
      this._setRoot(needInsert);
      if (needInsert !== null) {
        this._setSize(1);
      } else {
        this._setSize(0);
      }
      inserted = this.root;
    }
    return inserted;
  }

  /**
   * The `addMany` function takes an array of binary tree node IDs or nodes, and optionally an array of corresponding data
   * values, and adds them to the binary tree.
   * @param {(BinaryTreeNodeKey | null)[] | (N | null)[]} keysOrNodes - An array of BinaryTreeNodeKey or BinaryTreeNode
   * objects, or null values.
   * @param {N['val'][]} [data] - The `data` parameter is an optional array of values (`N['val'][]`) that corresponds to
   * the nodes or node IDs being added. It is used to set the value of each node being added. If `data` is not provided,
   * the value of the nodes will be `undefined`.
   * @returns The function `addMany` returns an array of `N`, `null`, or `undefined` values.
   */
  addMany(keysOrNodes: (BinaryTreeNodeKey | null)[] | (N | null)[], data?: N['val'][]): (N | null | undefined)[] {
    // TODO not sure addMany not be run multi times
    const inserted: (N | null | undefined)[] = [];

    for (let i = 0; i < keysOrNodes.length; i++) {
      const keyOrNode = keysOrNodes[i];
      if (keyOrNode instanceof BinaryTreeNode) {
        inserted.push(this.add(keyOrNode.key, keyOrNode.val));
        continue;
      }

      if (keyOrNode === null) {
        inserted.push(this.add(null));
        continue;
      }

      const val = data?.[i];
      inserted.push(this.add(keyOrNode, val));
    }
    return inserted;
  }

  /**
   * The `refill` function clears the binary tree and adds multiple nodes with the given IDs or nodes and optional data.
   * @param {(BinaryTreeNodeKey | N)[]} keysOrNodes - The `keysOrNodes` parameter is an array that can contain either
   * `BinaryTreeNodeKey` or `N` values.
   * @param {N[] | Array<N['val']>} [data] - The `data` parameter is an optional array of values that will be assigned to
   * the nodes being added. If provided, the length of the `data` array should be equal to the length of the `keysOrNodes`
   * array. Each value in the `data` array will be assigned to the
   * @returns The method is returning a boolean value.
   */
  refill(keysOrNodes: (BinaryTreeNodeKey | null)[] | (N | null)[], data?: N[] | Array<N['val']>): boolean {
    this.clear();
    return keysOrNodes.length === this.addMany(keysOrNodes, data).length;
  }

  /**
   * The `delete` function in TypeScript is used to delete a node from a binary search tree and returns an array of objects
   * containing the deleted node and the node that needs to be balanced.
   * @param {N | BinaryTreeNodeKey} nodeOrKey - The `nodeOrKey` parameter can be either a node object (`N`) or a binary tree
   * node ID (`BinaryTreeNodeKey`).
   * @returns The function `delete` returns an array of `BinaryTreeDeletedResult<N>` objects.
   */
  delete(nodeOrKey: N | BinaryTreeNodeKey): BinaryTreeDeletedResult<N>[] {
    const bstDeletedResult: BinaryTreeDeletedResult<N>[] = [];
    if (!this.root) return bstDeletedResult;

    const curr: N | null = typeof nodeOrKey === 'number' ? this.get(nodeOrKey) : nodeOrKey;
    if (!curr) return bstDeletedResult;

    const parent: N | null = curr?.parent ? curr.parent : null;
    let needBalanced: N | null = null,
      orgCurrent = curr;

    if (!curr.left) {
      if (!parent) {
        if (curr.right !== undefined) this._setRoot(curr.right);
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
      const leftSubTreeRightMost = curr.left ? this.getRightMost(curr.left) : null;
      if (leftSubTreeRightMost) {
        const parentOfLeftSubTreeMax = leftSubTreeRightMost.parent;
        orgCurrent = this._swap(curr, leftSubTreeRightMost);
        if (parentOfLeftSubTreeMax) {
          if (parentOfLeftSubTreeMax.right === leftSubTreeRightMost)
            parentOfLeftSubTreeMax.right = leftSubTreeRightMost.left;
          else parentOfLeftSubTreeMax.left = leftSubTreeRightMost.left;
          needBalanced = parentOfLeftSubTreeMax;
        }
      }
    }
    this._setSize(this.size - 1);

    bstDeletedResult.push({deleted: orgCurrent, needBalanced});
    return bstDeletedResult;
  }

  /**
   * The function calculates the depth of a node in a binary tree.
   * @param {N | BinaryTreeNodeKey | null} distNode - The `distNode` parameter can be any node of the tree
   * @param {N | BinaryTreeNodeKey | null} beginRoot - The `beginRoot` parameter can be the predecessor node of distNode
   * @returns the depth of the given node or binary tree.
   */
  getDepth(distNode: N | BinaryTreeNodeKey | null, beginRoot: N | BinaryTreeNodeKey | null = this.root): number {
    if (typeof distNode === 'number') distNode = this.get(distNode);
    if (typeof beginRoot === 'number') beginRoot = this.get(beginRoot);
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
   * The `getHeight` function calculates the maximum height of a binary tree, either recursively or iteratively.
   * @param {N | BinaryTreeNodeKey | null} [beginRoot] - The `beginRoot` parameter is optional and can be of type `N` (a
   * generic type representing a node in a binary tree), `BinaryTreeNodeKey` (a type representing the ID of a binary tree
   * node), or `null`.
   * @returns the height of the binary tree.
   */
  getHeight(beginRoot: N | BinaryTreeNodeKey | null = this.root): number {
    if (typeof beginRoot === 'number') beginRoot = this.get(beginRoot);
    if (!beginRoot) return -1;

    if (this._loopType === LoopType.RECURSIVE) {
      const _getMaxHeight = (cur: N | null | undefined): number => {
        if (!cur) return -1;
        const leftHeight = _getMaxHeight(cur.left);
        const rightHeight = _getMaxHeight(cur.right);
        return Math.max(leftHeight, rightHeight) + 1;
      };

      return _getMaxHeight(beginRoot);
    } else {
      if (!beginRoot) {
        return -1;
      }

      const stack: {node: N; depth: number}[] = [{node: beginRoot, depth: 0}];
      let maxHeight = 0;

      while (stack.length > 0) {
        const {node, depth} = stack.pop()!;

        if (node.left) {
          stack.push({node: node.left, depth: depth + 1});
        }

        if (node.right) {
          stack.push({node: node.right, depth: depth + 1});
        }

        maxHeight = Math.max(maxHeight, depth);
      }

      return maxHeight;
    }
  }

  protected _defaultCallbackByKey: MapCallback<N> = node => node.key;

  /**
   * The `getMinHeight` function calculates the minimum height of a binary tree using either a recursive or iterative
   * approach.
   * @param {N | null} [beginRoot] - The `beginRoot` parameter is an optional parameter of type `N` or `null`. It
   * represents the starting node from which to calculate the minimum height of a binary tree. If no value is provided
   * for `beginRoot`, the `this.root` property is used as the default value.
   * @returns The function `getMinHeight` returns the minimum height of the binary tree.
   */
  getMinHeight(beginRoot: N | null = this.root): number {
    if (!beginRoot) return -1;

    if (this._loopType === LoopType.RECURSIVE) {
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
        last: N | null = null;
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
   * The function checks if a binary tree is perfectly balanced by comparing the minimum height and the height of the
   * tree.
   * @param {N | null} [beginRoot] - The parameter `beginRoot` is of type `N` or `null`. It represents the root node of a
   * tree or null if the tree is empty.
   * @returns The method is returning a boolean value.
   */
  isPerfectlyBalanced(beginRoot: N | null = this.root): boolean {
    return this.getMinHeight(beginRoot) + 1 >= this.getHeight(beginRoot);
  }

  /**
   * The function `getNodes` returns an array of nodes that match a given property name and value in a binary tree.
   * @param callback
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or a
   * generic type `N`. It represents the property of the binary tree node that you want to search for.
   * specifies the property name to use when searching for nodes. If not provided, it defaults to 'key'.
   * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
   * return only one node that matches the given `nodeProperty` or `propertyName`. If `onlyOne` is set to `true`, the
   * function will stop traversing the tree and return the first matching node. If `only
   * @param beginRoot
   * @returns an array of nodes (type N).
   */
  getNodes(
    nodeProperty: BinaryTreeNodeKey | N,
    callback: MapCallback<N> = this._defaultCallbackByKey,
    onlyOne = false,
    beginRoot: N | null = this.root
  ): N[] {
    if (!beginRoot) return [];

    const ans: N[] = [];

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        if (callback(cur) === nodeProperty) {
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
          if (callback(cur) === nodeProperty) {
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

  /**
   * The function checks if a binary tree node has a specific property.
   * @param callback - The `callback` parameter is a function that takes a node as a parameter and returns a value.
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or `N`.
   * It represents the property of the binary tree node that you want to check.
   * specifies the name of the property to be checked in the nodes. If not provided, it defaults to 'key'.
   * @returns a boolean value.
   */
  has(nodeProperty: BinaryTreeNodeKey | N, callback: MapCallback<N> = this._defaultCallbackByKey): boolean {
    // TODO may support finding node by value equal
    return this.getNodes(nodeProperty, callback, true).length > 0;
  }

  /**
   * The function returns the first node that matches the given property name and value, or null if no matching node is
   * found.
   * @param callback - The `callback` parameter is a function that takes a node as a parameter and returns a value.
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or `N`.
   * It represents the property of the binary tree node that you want to search for.
   * specifies the property name to be used for searching the binary tree nodes. If this parameter is not provided, the
   * default value is set to `'key'`.
   * @returns either the value of the specified property of the node, or the node itself if no property name is provided.
   * If no matching node is found, it returns null.
   */
  get(nodeProperty: BinaryTreeNodeKey | N, callback: MapCallback<N> = this._defaultCallbackByKey): N | null {
    // TODO may support finding node by value equal
    return this.getNodes(nodeProperty, callback, true)[0] ?? null;
  }

  /**
   * The function `getPathToRoot` returns an array of nodes representing the path from a given node to the root node, with
   * an option to reverse the order of the nodes.
   * type that represents a node in your specific implementation.
   * @param beginRoot   - The `beginRoot` parameter is of type `N` and represents the starting node from which you want to
   * @param {boolean} [isReverse=true] - The `isReverse` parameter is a boolean flag that determines whether the resulting
   * path should be reversed or not. If `isReverse` is set to `true`, the path will be reversed before returning it. If
   * `isReverse` is set to `false` or not provided, the path will
   * @returns The function `getPathToRoot` returns an array of nodes (`N[]`).
   */
  getPathToRoot(beginRoot: N, isReverse = true): N[] {
    // TODO to support get path through passing key
    const result: N[] = [];
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
   * The function `getLeftMost` returns the leftmost node in a binary tree, starting from a specified node or the root if
   * no node is specified.
   * @param {N | BinaryTreeNodeKey | null} [beginRoot] - The `beginRoot` parameter is optional and can be of type `N` (a
   * generic type representing a node in a binary tree), `BinaryTreeNodeKey` (a type representing the ID of a binary tree
   * node), or `null`.
   * @returns The function `getLeftMost` returns the leftmost node in a binary tree. If the `beginRoot` parameter is
   * provided, it starts the traversal from that node. If `beginRoot` is not provided or is `null`, it starts the traversal
   * from the root of the binary tree. The function returns the leftmost node found during the traversal. If no leftmost
   * node is found (
   */
  getLeftMost(beginRoot: N | BinaryTreeNodeKey | null = this.root): N | null {
    if (typeof beginRoot === 'number') beginRoot = this.get(beginRoot);

    if (!beginRoot) return beginRoot;

    if (this._loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N): N => {
        if (!cur.left) return cur;
        return _traverse(cur.left);
      };

      return _traverse(beginRoot);
    } else {
      // Indirect implementation of iteration using tail recursion optimization
      const _traverse = trampoline((cur: N) => {
        if (!cur.left) return cur;
        return _traverse.cont(cur.left);
      });

      return _traverse(beginRoot);
    }
  }

  /**
   * The `getRightMost` function returns the rightmost node in a binary tree, either recursively or iteratively using tail
   * recursion optimization.
   * @param {N | null} [beginRoot] - The `node` parameter is an optional parameter of type `N` or `null`. It represents the
   * starting node from which we want to find the rightmost node. If no node is provided, the function will default to
   * using the root node of the data structure.
   * @returns The `getRightMost` function returns the rightmost node in a binary tree. If the `node` parameter is provided,
   * it returns the rightmost node starting from that node. If the `node` parameter is not provided, it returns the
   * rightmost node starting from the root of the binary tree.
   */
  getRightMost(beginRoot: N | null = this.root): N | null {
    // TODO support get right most by passing key in
    if (!beginRoot) return beginRoot;

    if (this._loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N): N => {
        if (!cur.right) return cur;
        return _traverse(cur.right);
      };

      return _traverse(beginRoot);
    } else {
      // Indirect implementation of iteration using tail recursion optimization
      const _traverse = trampoline((cur: N) => {
        if (!cur.right) return cur;
        return _traverse.cont(cur.right);
      });

      return _traverse(beginRoot);
    }
  }

  /**
   * The function checks if a binary search tree is valid by traversing it either recursively or iteratively.
   * @param {N | null} subTreeRoot - The `node` parameter represents the root node of a binary search tree (BST).
   * @returns a boolean value.
   */
  isSubtreeBST(subTreeRoot: N | null): boolean {
    // TODO there is a bug
    if (!subTreeRoot) return true;

    if (this._loopType === LoopType.RECURSIVE) {
      const dfs = (cur: N | null | undefined, min: BinaryTreeNodeKey, max: BinaryTreeNodeKey): boolean => {
        if (!cur) return true;
        if (cur.key <= min || cur.key >= max) return false;
        return dfs(cur.left, min, cur.key) && dfs(cur.right, cur.key, max);
      };

      return dfs(subTreeRoot, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    } else {
      const stack = [];
      let prev = Number.MIN_SAFE_INTEGER,
        curr: N | null | undefined = subTreeRoot;
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
   * The function isBST checks if the binary tree is valid binary search tree.
   * @returns The `isBST()` function is returning a boolean value.
   */
  isBST(): boolean {
    return this.isSubtreeBST(this.root);
  }

  /**
   * The function `subTreeTraverse` adds a delta value to a specified property of each node in a subtree.
   * @param {N | BinaryTreeNodeKey | null} subTreeRoot - The `subTreeRoot` parameter represents the root node of a binary
   * tree or the ID of a node in the binary tree. It can also be `null` if there is no subtree to add to.
   * @param callback - The `callback` parameter is a function that takes a node as a parameter and returns a value.
   * specifies the property of the binary tree node that should be modified. If not provided, it defaults to 'key'.
   * @returns a boolean value.
   */
  subTreeTraverse(
    callback: MapCallback<N> = this._defaultCallbackByKey,
    subTreeRoot: N | BinaryTreeNodeKey | null = this.root
  ): MapCallbackReturn<N>[] {
    if (typeof subTreeRoot === 'number') subTreeRoot = this.get(subTreeRoot);

    const ans: MapCallbackReturn<N>[] = [];
    if (!subTreeRoot) return ans;

    if (this._loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        ans.push(callback(cur));
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(subTreeRoot);
    } else {
      const stack: N[] = [subTreeRoot];

      while (stack.length > 0) {
        const cur = stack.pop()!;

        ans.push(callback(cur));
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
      }
    }
    return ans;
  }

  /**
   * The dfs function performs a depth-first search traversal on a binary tree and returns the accumulated properties of
   * each node based on the specified pattern and property name.
   * @param callback
   * @param beginRoot - The `beginRoot` parameter is an optional parameter of type `N` or `null`. It represents the
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param loopType - The type of loop to use for the depth-first search traversal. The default value is `LoopType.ITERATIVE`.
   * @returns an instance of the BinaryTreeNodeProperties class, which contains the accumulated properties of the binary tree nodes based on the specified pattern and node or property name.
   */
  dfs(
    callback: MapCallback<N> = this._defaultCallbackByKey,
    pattern: DFSOrderPattern = 'in',
    beginRoot: N | null = this.root,
    loopType: LoopType = LoopType.ITERATIVE
  ): MapCallbackReturn<N>[] {
    if (!beginRoot) return [];
    const ans: MapCallbackReturn<N>[] = [];
    if (loopType === LoopType.RECURSIVE) {
      const _traverse = (node: N) => {
        switch (pattern) {
          case 'in':
            if (node.left) _traverse(node.left);
            ans.push(callback(node));
            if (node.right) _traverse(node.right);
            break;
          case 'pre':
            ans.push(callback(node));

            if (node.left) _traverse(node.left);
            if (node.right) _traverse(node.right);
            break;
          case 'post':
            if (node.left) _traverse(node.left);
            if (node.right) _traverse(node.right);
            ans.push(callback(node));

            break;
        }
      };

      _traverse(beginRoot);
    } else {
      // 0: visit, 1: print
      const stack: {opt: 0 | 1; node: N | null | undefined}[] = [{opt: 0, node: beginRoot}];

      while (stack.length > 0) {
        const cur = stack.pop();
        if (!cur || !cur.node) continue;
        if (cur.opt === 1) {
          ans.push(callback(cur.node));
        } else {
          switch (pattern) {
            case 'in':
              stack.push({opt: 0, node: cur.node.right});
              stack.push({opt: 1, node: cur.node});
              stack.push({opt: 0, node: cur.node.left});
              break;
            case 'pre':
              stack.push({opt: 0, node: cur.node.right});
              stack.push({opt: 0, node: cur.node.left});
              stack.push({opt: 1, node: cur.node});
              break;
            case 'post':
              stack.push({opt: 1, node: cur.node});
              stack.push({opt: 0, node: cur.node.right});
              stack.push({opt: 0, node: cur.node.left});
              break;
            default:
              stack.push({opt: 0, node: cur.node.right});
              stack.push({opt: 1, node: cur.node});
              stack.push({opt: 0, node: cur.node.left});
              break;
          }
        }
      }
    }

    return ans;
  }

  // --- start additional methods ---

  /**
   * The `listLevels` function collects nodes from a binary tree by a specified property and organizes them into levels.
   * @param {N | null} node - The `node` parameter is a BinaryTreeNode object or null. It represents the root node of a binary tree. If it is null, the function will use the root node of the current binary tree instance.
   * @param callback - The `callback` parameter is a function that takes a node and a level as parameters and returns a value.
   * @param withLevel - The `withLevel` parameter is a boolean flag that determines whether to include the level of each node in the result. If `withLevel` is set to `true`, the function will include the level of each node in the result. If `withLevel` is set to `false` or not provided, the function will not include the level of each node in the result.
   */
  bfs(
    callback: BFSCallback<N> = this._defaultCallbackByKey,
    withLevel: boolean = false,
    node?: N | null
  ): BFSCallbackReturn<N>[] {
    if (!node) node = this.root;
    if (!node) return [];

    const ans: BFSCallbackReturn<N>[] = [];

    if (this.loopType === LoopType.RECURSIVE) {
      const _recursive = (node: N, level: number) => {
        callback && ans.push(callback(node, withLevel ? level : undefined));
        if (node.left) _recursive(node.left, level + 1);
        if (node.right) _recursive(node.right, level + 1);
      };

      _recursive(node, 0);
    } else {
      const stack: [N, number][] = [[node, 0]];

      while (stack.length > 0) {
        const head = stack.pop()!;
        const [node, level] = head;

        callback && ans.push(callback(node, withLevel ? level : undefined));
        if (node.right) stack.push([node.right, level + 1]);
        if (node.left) stack.push([node.left, level + 1]);
      }
    }
    return ans;
  }

  /**
   * The function returns the predecessor of a given node in a binary tree.
   * @param node - The parameter `node` is a BinaryTreeNode object, representing a node in a binary tree.
   * @returns the predecessor of the given node in a binary tree.
   */
  getPredecessor(node: N): N {
    if (node.left) {
      let predecessor: N | null | undefined = node.left;
      while (!predecessor || (predecessor.right && predecessor.right !== node)) {
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
   * Time complexity is O(n)
   * Space complexity of Iterative dfs equals to recursive dfs which is O(n) because of the stack
   */

  /**
   * The `morris` function performs an in-order, pre-order, or post-order traversal on a binary tree using the Morris traversal algorithm.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param callback  - The `callback` parameter is a function that takes a node as a parameter and returns a value.
   * @returns An array of BinaryTreeNodeProperties<N> objects.
   */
  morris(
    callback: MapCallback<N> = this._defaultCallbackByKey,
    pattern: DFSOrderPattern = 'in'
  ): MapCallbackReturn<N>[] {
    if (this.root === null) return [];
    const ans: MapCallbackReturn<N>[] = [];

    let cur: N | null | undefined = this.root;
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
    const _printEdge = (node: N | null) => {
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
        _printEdge(this.root);
        break;
    }
    return ans;
  }

  /**
   * The function adds a new node to a binary tree if there is an available position.
   * @param {N | null} newNode - The `newNode` parameter is of type `N | null`, which means it can either be a node of
   * type `N` or `null`. It represents the node that you want to add to the binary tree.
   * @param {N} parent - The parent parameter is of type N, which represents a node in a binary tree.
   * @returns either the left or right child node of the parent node, depending on which child is available for adding
   * the new node. If a new node is added, the function also updates the size of the binary tree. If neither the left nor
   * right child is available, the function returns undefined. If the parent node is null, the function also returns
   * undefined.
   */
  protected _addTo(newNode: N | null, parent: N): N | null | undefined {
    if (parent) {
      // When all leaf nodes are null, it will no longer be possible to add new entity nodes to this binary tree.
      // In this scenario, null nodes serve as "sentinel nodes," "virtual nodes," or "placeholder nodes."
      if (parent.left === undefined) {
        parent.left = newNode;
        if (newNode) {
          this._setSize(this.size + 1);
        }
        return parent.left;
      } else if (parent.right === undefined) {
        parent.right = newNode;
        if (newNode) {
          this._setSize(this.size + 1);
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
   * The function sets the root property of an object to a given value, and if the value is not null, it also sets the
   * parent property of the value to undefined.
   * @param {N | null} v - The parameter `v` is of type `N | null`, which means it can either be of type `N` or `null`.
   */
  protected _setRoot(v: N | null) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * The function sets the size of a protected variable.
   * @param {number} v - number
   */
  protected _setSize(v: number) {
    this._size = v;
  }

  // --- end additional methods ---
}
