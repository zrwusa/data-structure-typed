/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  BinaryTreeNodeKey,
  BinaryTreeNodeNested,
  BinaryTreeNodeProperties,
  BinaryTreeNodeProperty,
  BinaryTreeOptions
} from '../../types';
import {IBinaryTree} from '../../interfaces';
import {
  BinaryTreeDeletedResult,
  BinaryTreeNodePropertyName,
  DFSOrderPattern,
  FamilyPosition,
  LoopType,
  NodeOrPropertyName
} from '../../types';
import {trampoline} from '../../utils';

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

  visitedKey: BinaryTreeNodeKey[] = [];

  visitedVal: N['val'][] = [];

  visitedNode: N[] = [];

  /**
   * The `swapLocation` function swaps the location of two nodes in a binary tree.
   * @param {N} srcNode - The source node that you want to swap with the destination node.
   * @param {N} destNode - The `destNode` parameter represents the destination node where the values from `srcNode` will
   * be swapped to.
   * @returns The `destNode` is being returned.
   */
  swapLocation(srcNode: N, destNode: N): N {
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
    this._clearResults();
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
      const queue: Array<N | null> = [root];
      while (queue.length > 0) {
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

    const existNode = keyOrNode ? this.get(keyOrNode, 'key') : undefined;

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
   * The `remove` function in TypeScript is used to delete a node from a binary search tree and returns an array of objects
   * containing the deleted node and the node that needs to be balanced.
   * @param {N | BinaryTreeNodeKey} nodeOrKey - The `nodeOrKey` parameter can be either a node object (`N`) or a binary tree
   * node ID (`BinaryTreeNodeKey`).
   * @returns The function `remove` returns an array of `BinaryTreeDeletedResult<N>` objects.
   */
  remove(nodeOrKey: N | BinaryTreeNodeKey): BinaryTreeDeletedResult<N>[] {
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
        orgCurrent = this.swapLocation(curr, leftSubTreeRightMost);
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
    if (typeof distNode === 'number') distNode = this.get(distNode, 'key');
    if (typeof beginRoot === 'number') beginRoot = this.get(beginRoot, 'key');
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
    if (typeof beginRoot === 'number') beginRoot = this.get(beginRoot, 'key');
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
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or a
   * generic type `N`. It represents the property of the binary tree node that you want to search for.
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the property name to use when searching for nodes. If not provided, it defaults to 'key'.
   * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
   * return only one node that matches the given `nodeProperty` or `propertyName`. If `onlyOne` is set to `true`, the
   * function will stop traversing the tree and return the first matching node. If `only
   * @returns an array of nodes (type N).
   */
  getNodes(
    nodeProperty: BinaryTreeNodeKey | N,
    propertyName: BinaryTreeNodePropertyName = 'key',
    onlyOne = false
  ): N[] {
    if (!this.root) return [];

    const result: N[] = [];

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return;
        if (!cur.left && !cur.right) return;
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(this.root);
    } else {
      const queue: N[] = [this.root];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur) {
          if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return result;
          cur.left && queue.push(cur.left);
          cur.right && queue.push(cur.right);
        }
      }
    }

    return result;
  }

  /**
   * The function checks if a binary tree node has a specific property.
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or `N`.
   * It represents the property of the binary tree node that you want to check.
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the name of the property to be checked in the nodes. If not provided, it defaults to 'key'.
   * @returns a boolean value.
   */
  has(nodeProperty: BinaryTreeNodeKey | N, propertyName: BinaryTreeNodePropertyName = 'key'): boolean {
    // TODO may support finding node by value equal
    return this.getNodes(nodeProperty, propertyName).length > 0;
  }

  /**
   * The function returns the first node that matches the given property name and value, or null if no matching node is
   * found.
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or `N`.
   * It represents the property of the binary tree node that you want to search for.
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the property name to be used for searching the binary tree nodes. If this parameter is not provided, the
   * default value is set to `'key'`.
   * @returns either the value of the specified property of the node, or the node itself if no property name is provided.
   * If no matching node is found, it returns null.
   */
  get(nodeProperty: BinaryTreeNodeKey | N, propertyName: BinaryTreeNodePropertyName = 'key'): N | null {
    // TODO may support finding node by value equal
    return this.getNodes(nodeProperty, propertyName, true)[0] ?? null;
  }

  /**
   * The function `getPathToRoot` returns an array of nodes representing the path from a given node to the root node, with
   * an option to reverse the order of the nodes.
   * @param {N} node - The `node` parameter represents a node in a tree structure. It is of type `N`, which could be any
   * type that represents a node in your specific implementation.
   * @param {boolean} [isReverse=true] - The `isReverse` parameter is a boolean flag that determines whether the resulting
   * path should be reversed or not. If `isReverse` is set to `true`, the path will be reversed before returning it. If
   * `isReverse` is set to `false` or not provided, the path will
   * @returns The function `getPathToRoot` returns an array of nodes (`N[]`).
   */
  getPathToRoot(node: N, isReverse = true): N[] {
    // TODO to support get path through passing key
    const result: N[] = [];
    while (node.parent) {
      // Array.push + Array.reverse is more efficient than Array.unshift
      // TODO may consider using Deque, so far this is not the performance bottleneck
      result.push(node);
      node = node.parent;
    }
    result.push(node);
    return isReverse ? result.reverse() : result;
  }

  /**
   * The function `getLeftMost` returns the leftmost node in a binary tree, starting from a specified node or the root if
   * no node is specified.
   * generic type representing a node in a binary tree), `BinaryTreeNodeKey` (a type representing the ID of a binary tree
   * node), or `null`.
   * @returns The function `getLeftMost` returns the leftmost node in a binary tree. If the `beginRoot` parameter is
   * provided, it starts the traversal from that node. If `beginRoot` is not provided or is `null`, it starts the traversal
   * from the root of the binary tree. The function returns the leftmost node found during the traversal. If no leftmost
   * node is found (
   */
  getLeftMost(): N | null;

  /**
   * The function `getLeftMost` returns the leftmost node in a binary tree, starting from a specified node or the root if
   * no node is specified.
   * @param {N | BinaryTreeNodeKey | null} [node] - The `beginRoot` parameter is optional and can be of type `N` (a
   * generic type representing a node in a binary tree), `BinaryTreeNodeKey` (a type representing the ID of a binary tree
   * node).
   * @returns The function `getLeftMost` returns the leftmost node in a binary tree. If the `beginRoot` parameter is
   * provided, it starts the traversal from that node. If `beginRoot` is not provided or is `null`, it starts the traversal
   * from the root of the binary tree. The function returns the leftmost node found during the traversal. If no leftmost
   * node is found (
   */
  getLeftMost(node: N): N;

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
    if (typeof beginRoot === 'number') beginRoot = this.get(beginRoot, 'key');

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
   * @returns The `getRightMost` function returns the rightmost node in a binary tree. It returns the
   * rightmost node starting from the root of the binary tree.
   */
  getRightMost(): N | null;

  /**
   * The `getRightMost` function returns the rightmost node in a binary tree, either recursively or iteratively using tail
   * recursion optimization.
   * @param {N | null} [beginRoot] - The `node` parameter is an optional parameter of type `N` or `null`. It represents the
   * starting node from which we want to find the rightmost node. If no node is provided, the function will default to
   * using the root node of the data structure.
   * @returns The `getRightMost` function returns the rightmost node in a binary tree. It returns the rightmost node
   * starting from that node.
   */
  getRightMost(beginRoot: N): N;

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
   * @param {N | null} node - The `node` parameter represents the root node of a binary search tree (BST).
   * @returns a boolean value.
   */
  isSubtreeBST(node: N | null): boolean {
    // TODO there is a bug
    if (!node) return true;

    if (this._loopType === LoopType.RECURSIVE) {
      const dfs = (cur: N | null | undefined, min: BinaryTreeNodeKey, max: BinaryTreeNodeKey): boolean => {
        if (!cur) return true;
        if (cur.key <= min || cur.key >= max) return false;
        return dfs(cur.left, min, cur.key) && dfs(cur.right, cur.key, max);
      };

      return dfs(node, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    } else {
      const stack = [];
      let prev = Number.MIN_SAFE_INTEGER,
        curr: N | null | undefined = node;
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
   * The function calculates the size of a subtree by traversing it either recursively or iteratively.
   * @param {N | null | undefined} subTreeRoot - The `subTreeRoot` parameter represents the root node of a subtree in a
   * binary tree.
   * @returns the size of the subtree rooted at `subTreeRoot`.
   */
  getSubTreeSize(subTreeRoot: N | null | undefined) {
    // TODO support key passed in
    let size = 0;
    if (!subTreeRoot) return size;

    if (this._loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        size++;
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(subTreeRoot);
      return size;
    } else {
      const stack: N[] = [subTreeRoot];

      while (stack.length > 0) {
        const cur = stack.pop()!;
        size++;
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
      }

      return size;
    }
  }

  /**
   * The function `subTreeSum` calculates the sum of a specified property in a binary tree or subtree.
   * @param {N | BinaryTreeNodeKey | null} subTreeRoot - The `subTreeRoot` parameter represents the root node of a binary
   * tree or the ID of a binary tree node. It can also be `null` if there is no subtree.
   * @param {BinaryTreeNodePropertyName} [propertyName] - propertyName is an optional parameter that specifies the
   * property of the binary tree node to use for calculating the sum. It can be either 'key' or 'val'. If propertyName is
   * not provided, it defaults to 'key'.
   * @returns a number, which is the sum of the values of the specified property in the subtree rooted at `subTreeRoot`.
   */
  subTreeSum(subTreeRoot: N | BinaryTreeNodeKey | null, propertyName: BinaryTreeNodePropertyName = 'key'): number {
    if (typeof subTreeRoot === 'number') subTreeRoot = this.get(subTreeRoot, 'key');

    if (!subTreeRoot) return 0;

    let sum = 0;

    const _sumByProperty = (cur: N) => {
      let needSum: number;
      switch (propertyName) {
        case 'key':
          needSum = cur.key;
          break;
        case 'val':
          needSum = typeof cur.val === 'number' ? cur.val : 0;
          break;
        default:
          needSum = cur.key;
          break;
      }
      return needSum;
    };

    if (this._loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N): void => {
        sum += _sumByProperty(cur);
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(subTreeRoot);
    } else {
      const stack: N[] = [subTreeRoot];

      while (stack.length > 0) {
        const cur = stack.pop()!;
        sum += _sumByProperty(cur);
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
      }
    }

    return sum;
  }

  /**
   * The function `subTreeAdd` adds a delta value to a specified property of each node in a subtree.
   * @param {N | BinaryTreeNodeKey | null} subTreeRoot - The `subTreeRoot` parameter represents the root node of a binary
   * tree or the ID of a node in the binary tree. It can also be `null` if there is no subtree to add to.
   * @param {number} delta - The `delta` parameter is a number that represents the amount by which the property value of
   * each node in the subtree should be incremented.
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the property of the binary tree node that should be modified. If not provided, it defaults to 'key'.
   * @returns a boolean value.
   */
  subTreeAdd(
    subTreeRoot: N | BinaryTreeNodeKey | null,
    delta: number,
    propertyName: BinaryTreeNodePropertyName = 'key'
  ): boolean {
    if (typeof subTreeRoot === 'number') subTreeRoot = this.get(subTreeRoot, 'key');

    if (!subTreeRoot) return false;

    const _addByProperty = (cur: N) => {
      switch (propertyName) {
        case 'key':
          cur.key += delta;
          break;
        default:
          cur.key += delta;
          break;
      }
    };

    if (this._loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        _addByProperty(cur);
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(subTreeRoot);
    } else {
      const stack: N[] = [subTreeRoot];

      while (stack.length > 0) {
        const cur = stack.pop()!;

        _addByProperty(cur);
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
      }
    }
    return true;
  }

  /**
   * Performs a breadth-first search (bfs) on a binary tree, accumulating properties of each node based on their 'key' property.
   * @returns An array of binary tree node IDs.
   */
  bfs(): BinaryTreeNodeKey[];

  /**
   * Performs a breadth-first search (bfs) on a binary tree, accumulating properties of each node based on the specified property name.
   * @param {'key'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of values corresponding to the specified property.
   */
  bfs(nodeOrPropertyName: 'key'): BinaryTreeNodeKey[];

  /**
   * Performs a breadth-first search (bfs) on a binary tree, accumulating the 'val' property of each node.
   * @param {'val'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of 'val' properties from each node.
   */
  bfs(nodeOrPropertyName: 'val'): N['val'][];

  /**
   * Performs a breadth-first search (bfs) on a binary tree, accumulating nodes themselves.
   * @param {'node'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of binary tree nodes.
   */
  bfs(nodeOrPropertyName: 'node'): N[];

  /**
   * The bfs function performs a breadth-first search on a binary tree, accumulating properties of each node based on a specified property name.
   * @param {NodeOrPropertyName} [nodeOrPropertyName] - An optional parameter that represents either a node or a property name.
   * If a node is provided, the bfs algorithm will be performed starting from that node.
   * If a property name is provided, the bfs algorithm will be performed starting from the root node, accumulating the specified property.
   * @returns An instance of the `BinaryTreeNodeProperties` class with generic type `N`.
   */
  bfs(nodeOrPropertyName: NodeOrPropertyName = 'key'): BinaryTreeNodeProperties<N> {
    this._clearResults();
    const queue: Array<N | null | undefined> = [this.root];

    while (queue.length !== 0) {
      const cur = queue.shift();
      if (cur) {
        this._accumulatedByPropertyName(cur, nodeOrPropertyName);
        if (cur?.left !== null) queue.push(cur.left);
        if (cur?.right !== null) queue.push(cur.right);
      }
    }

    return this._getResultByPropertyName(nodeOrPropertyName);
  }

  /**
   * Performs a depth-first search (dfs) traversal on a binary tree and accumulates properties of each node based on their 'key' property.
   * @returns An array of binary tree node IDs.
   */
  dfs(): BinaryTreeNodeKey[];

  /**
   * Performs a depth-first search (dfs) traversal on a binary tree and accumulates properties of each node based on the specified property name.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @returns An array of values corresponding to the specified property.
   */
  dfs(pattern: DFSOrderPattern): BinaryTreeNodeKey[];

  /**
   * Performs a depth-first search (dfs) traversal on a binary tree and accumulates properties of each node based on the specified property name.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {string} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of values corresponding to the specified property.
   */
  dfs(pattern: DFSOrderPattern, nodeOrPropertyName: 'key'): BinaryTreeNodeKey[];

  /**
   * Performs a depth-first search (dfs) traversal on a binary tree and accumulates the 'val' property of each node.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {'val'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of 'val' properties from each node.
   */
  dfs(pattern: DFSOrderPattern, nodeOrPropertyName: 'val'): N[];

  /**
   * Performs a depth-first search (dfs) traversal on a binary tree and accumulates nodes themselves.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {'node'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of binary tree nodes.
   */
  dfs(pattern: DFSOrderPattern, nodeOrPropertyName: 'node'): N[];

  /**
   * The dfs function performs a depth-first search traversal on a binary tree and returns the accumulated properties of
   * each node based on the specified pattern and property name.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {NodeOrPropertyName} [nodeOrPropertyName] - The name of a property of the nodes in the binary tree. This property will be used to accumulate values during the depth-first search traversal. If no `nodeOrPropertyName` is provided, the default value is `'key'`.
   * @returns an instance of the BinaryTreeNodeProperties class, which contains the accumulated properties of the binary tree nodes based on the specified pattern and node or property name.
   */
  dfs(pattern: DFSOrderPattern = 'in', nodeOrPropertyName: NodeOrPropertyName = 'key'): BinaryTreeNodeProperties<N> {
    this._clearResults();
    const _traverse = (node: N) => {
      switch (pattern) {
        case 'in':
          if (node.left) _traverse(node.left);
          this._accumulatedByPropertyName(node, nodeOrPropertyName);
          if (node.right) _traverse(node.right);
          break;
        case 'pre':
          this._accumulatedByPropertyName(node, nodeOrPropertyName);
          if (node.left) _traverse(node.left);
          if (node.right) _traverse(node.right);
          break;
        case 'post':
          if (node.left) _traverse(node.left);
          if (node.right) _traverse(node.right);
          this._accumulatedByPropertyName(node, nodeOrPropertyName);
          break;
      }
    };

    this.root && _traverse(this.root);
    return this._getResultByPropertyName(nodeOrPropertyName);
  }

  // --- start additional methods ---

  /**
   * Performs an iterative depth-first search (dfs) traversal on a binary tree and accumulates properties of each node based on their 'key' property.
   * @returns An array of binary tree node IDs.
   */
  dfsIterative(): BinaryTreeNodeKey[];

  /**
   * Performs an iterative depth-first search (dfs) traversal on a binary tree and accumulates properties of each node based on their 'key' property.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @returns An array of values corresponding to the specified property.
   */
  dfsIterative(pattern: DFSOrderPattern): BinaryTreeNodeKey[];

  /**
   * Performs an iterative depth-first search (dfs) traversal on a binary tree and accumulates properties of each node based on the specified property name.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {string} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of values corresponding to the specified property.
   */
  dfsIterative(pattern: DFSOrderPattern, nodeOrPropertyName: 'key'): BinaryTreeNodeKey[];

  /**
   * Performs an iterative depth-first search (dfs) traversal on a binary tree and accumulates the 'val' property of each node.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {'val'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of 'val' properties from each node.
   */
  dfsIterative(pattern: DFSOrderPattern, nodeOrPropertyName: 'val'): N['val'][];

  /**
   * Performs an iterative depth-first search (dfs) traversal on a binary tree and accumulates nodes themselves.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {'node'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of binary tree nodes.
   */
  dfsIterative(pattern: DFSOrderPattern, nodeOrPropertyName: 'node'): N[];

  /**
   * The dfsIterative function performs an iterative depth-first search traversal on a binary tree, with the option to
   * specify the traversal pattern and the property name to accumulate results by.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {NodeOrPropertyName} [nodeOrPropertyName] - The name of a property of the nodes in the binary tree. This property will be used to accumulate values during the depth-first search traversal. By default, it is set to `'key'`.
   * @returns An object of type BinaryTreeNodeProperties<N>.
   */
  dfsIterative(
    pattern: DFSOrderPattern = 'in',
    nodeOrPropertyName: NodeOrPropertyName = 'key'
  ): BinaryTreeNodeProperties<N> {
    this._clearResults();
    if (!this.root) return this._getResultByPropertyName(nodeOrPropertyName);
    // 0: visit, 1: print
    const stack: {opt: 0 | 1; node: N | null | undefined}[] = [{opt: 0, node: this.root}];

    while (stack.length > 0) {
      const cur = stack.pop();
      if (!cur || !cur.node) continue;
      if (cur.opt === 1) {
        this._accumulatedByPropertyName(cur.node, nodeOrPropertyName);
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

    return this._getResultByPropertyName(nodeOrPropertyName);
  }

  /**
   * Performs a level-order traversal on a binary tree starting from the specified node and accumulates properties of each node based on their 'key' property.
   * @returns An array of binary tree node IDs.
   */
  levelIterative(): BinaryTreeNodeKey[];

  /**
   * Performs a level-order traversal on a binary tree starting from the specified node and accumulates properties of each node based on their 'key' property.
   * @param {N | null} node - The starting node for the level order traversal. If null, the root node of the tree is used as the starting node.
   * @returns An array of binary tree node IDs.
   */
  levelIterative(node: N | null): BinaryTreeNodeKey[];

  /**
   * Performs a level-order traversal on a binary tree starting from the specified node and accumulates properties of each node based on the specified property name.
   * @param {N | null} node - The starting node for the level order traversal. If null, the root node of the tree is used as the starting node.
   * @param {string} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of values corresponding to the specified property.
   */
  levelIterative(node: N | null, nodeOrPropertyName: 'key'): BinaryTreeNodeKey[];

  /**
   * Performs a level-order traversal on a binary tree starting from the specified node and accumulates the 'val' property of each node.
   * @param {N | null} node - The starting node for the level order traversal. If null, the root node of the tree is used as the starting node.
   * @param {'val'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of 'val' properties from each node.
   */
  levelIterative(node: N | null, nodeOrPropertyName: 'val'): N['val'][];

  /**
   * Performs a level-order traversal on a binary tree starting from the specified node and accumulates nodes themselves.
   * @param {N | null} node - The starting node for the level order traversal. If null, the root node of the tree is used as the starting node.
   * @param {'node'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of binary tree nodes.
   */
  levelIterative(node: N | null, nodeOrPropertyName: 'node'): N[];

  /**
   * The `levelIterative` function performs a level-order traversal on a binary tree and returns the values of the nodes
   * in an array, based on a specified property name.
   * @param {N | null} node - The `node` parameter is a BinaryTreeNode object representing the starting
   * node for the level order traversal. It can be null if no specific node is provided, in which case the root node of
   * the tree is used as the starting node.
   * @param {NodeOrPropertyName} [nodeOrPropertyName] - The `nodeOrPropertyName` parameter is an optional parameter that
   * can be either a `BinaryTreeNode` property name or the string `'key'`. If a property name is provided, the function
   * will accumulate results based on that property. If no property name is provided, the function will default to
   * accumulating results based on the 'key' property.
   * @returns An object of type `BinaryTreeNodeProperties<N>`.
   */
  levelIterative(
    node: N | null = this.root,
    nodeOrPropertyName: NodeOrPropertyName = 'key'
  ): BinaryTreeNodeProperties<N> {
    if (!node) return [];

    this._clearResults();
    const queue: N[] = [node];

    while (queue.length > 0) {
      const cur = queue.shift();
      if (cur) {
        this._accumulatedByPropertyName(cur, nodeOrPropertyName);
        if (cur.left) {
          queue.push(cur.left);
        }
        if (cur.right) {
          queue.push(cur.right);
        }
      }
    }

    return this._getResultByPropertyName(nodeOrPropertyName);
  }

  /**
   * Collects nodes from a binary tree by a specified property and organizes them into levels.
   * @returns A 2D array of AbstractBinaryTreeNodeProperty<N> objects.
   */
  listLevels(): BinaryTreeNodeKey[][];

  /**
   * Collects nodes from a binary tree by a specified property and organizes them into levels.
   * @param {N | null} node - The root node of the binary tree or null. If null, the function will use the root node of the current binary tree instance.
   * @returns A 2D array of AbstractBinaryTreeNodeProperty<N> objects.
   */
  listLevels(node: N | null): BinaryTreeNodeKey[][];

  /**
   * Collects nodes from a binary tree by a specified property and organizes them into levels.
   * @param {N | null} node - The root node of the binary tree or null. If null, the function will use the root node of the current binary tree instance.
   * @param {'key} nodeOrPropertyName - The property of the BinaryTreeNode object to collect at each level.
   * @returns A 2D array of values corresponding to the specified property.
   */
  listLevels(node: N | null, nodeOrPropertyName: 'key'): BinaryTreeNodeKey[][];

  /**
   * Collects nodes from a binary tree by a specified property and organizes them into levels.
   * @param {N | null} node - The root node of the binary tree or null. If null, the function will use the root node of the current binary tree instance.
   * @param {'val'} nodeOrPropertyName - The property of the BinaryTreeNode object to collect at each level.
   * @returns A 2D array of 'val' properties from each node.
   */
  listLevels(node: N | null, nodeOrPropertyName: 'val'): N['val'][][];

  /**
   * Collects nodes from a binary tree by a specified property and organizes them into levels.
   * @param {N | null} node - The root node of the binary tree or null. If null, the function will use the root node of the current binary tree instance.
   * @param {'node'} nodeOrPropertyName - The property of the BinaryTreeNode object to collect at each level.
   * @returns A 2D array of binary tree nodes.
   */
  listLevels(node: N | null, nodeOrPropertyName: 'node'): N[][];

  /**
   * The `listLevels` function collects nodes from a binary tree by a specified property and organizes them into levels.
   * @param {N | null} node - The `node` parameter is a BinaryTreeNode object or null. It represents the root node of a binary tree. If it is null, the function will use the root node of the current binary tree instance.
   * @param {NodeOrPropertyName} [nodeOrPropertyName] - The `nodeOrPropertyName` parameter is an optional parameter that specifies the property of the `BinaryTreeNode` object to collect at each level. It can be one of the following values: 'key', 'val', or 'node'. If not provided, it defaults to 'key'.
   * @returns A 2D array of `AbstractBinaryTreeNodeProperty<N>` objects.
   */
  listLevels(
    node: N | null = this.root,
    nodeOrPropertyName: NodeOrPropertyName = 'key'
  ): BinaryTreeNodeProperty<N>[][] {
    if (!node) return [];

    const levelsNodes: BinaryTreeNodeProperty<N>[][] = [];

    const collectByProperty = (node: N, level: number) => {
      switch (nodeOrPropertyName) {
        case 'key':
          levelsNodes[level].push(node.key);
          break;
        case 'val':
          levelsNodes[level].push(node.val);
          break;
        case 'node':
          levelsNodes[level].push(node);
          break;
        default:
          levelsNodes[level].push(node.key);
          break;
      }
    };

    if (this.loopType === LoopType.RECURSIVE) {
      const _recursive = (node: N, level: number) => {
        if (!levelsNodes[level]) levelsNodes[level] = [];
        collectByProperty(node, level);
        if (node.left) _recursive(node.left, level + 1);
        if (node.right) _recursive(node.right, level + 1);
      };

      _recursive(node, 0);
    } else {
      const stack: [N, number][] = [[node, 0]];

      while (stack.length > 0) {
        const head = stack.pop()!;
        const [node, level] = head;

        if (!levelsNodes[level]) levelsNodes[level] = [];
        collectByProperty(node, level);
        if (node.right) stack.push([node.right, level + 1]);
        if (node.left) stack.push([node.left, level + 1]);
      }
    }

    return levelsNodes;
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
   * Performs an in-order, pre-order, or post-order traversal on a binary tree using the Morris traversal algorithm.
   * @returns An array of binary tree node IDs.
   */
  morris(): BinaryTreeNodeKey[];

  /**
   * Performs an in-order, pre-order, or post-order traversal on a binary tree using the Morris traversal algorithm and accumulates properties of each node based on the specified property name.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {'key'} nodeOrPropertyName - The name of the property to accumulate.
   * @returns An array of values corresponding to the specified property.
   */
  morris(pattern: DFSOrderPattern, nodeOrPropertyName: 'key'): BinaryTreeNodeKey[];

  /**
   * Performs an in-order, pre-order, or post-order traversal on a binary tree using the Morris traversal algorithm and accumulates properties of each node based on the specified property name.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @returns An array of values corresponding to the specified property.
   */
  morris(pattern: DFSOrderPattern): BinaryTreeNodeKey[];

  /**
   * Performs an in-order, pre-order, or post-order traversal on a binary tree using the Morris traversal algorithm and accumulates the 'val' property of each node.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {'val'} nodeOrPropertyName - The property of the BinaryTreeNode object to collect at each level.
   * @returns An array of 'val' properties from each node.
   */
  morris(pattern: DFSOrderPattern, nodeOrPropertyName: 'val'): N[];

  /**
   * Performs an in-order, pre-order, or post-order traversal on a binary tree using the Morris traversal algorithm and accumulates nodes themselves.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {'node'} nodeOrPropertyName - The property of the BinaryTreeNode object to collect at each level.
   * @returns An array of binary tree nodes.
   */
  morris(pattern: DFSOrderPattern, nodeOrPropertyName: 'node'): N[];

  /**
   * The `morris` function performs an in-order, pre-order, or post-order traversal on a binary tree using the Morris traversal algorithm.
   * @param {'in' | 'pre' | 'post'} [pattern] - The traversal pattern: 'in' (in-order), 'pre' (pre-order), or 'post' (post-order).
   * @param {NodeOrPropertyName} [nodeOrPropertyName] - The property name of the nodes to retrieve or perform operations on during the traversal. It can be any valid property name of the nodes in the binary tree. If not provided, it defaults to 'key'.
   * @returns An array of BinaryTreeNodeProperties<N> objects.
   */
  morris(pattern: DFSOrderPattern = 'in', nodeOrPropertyName: NodeOrPropertyName = 'key'): BinaryTreeNodeProperties<N> {
    if (this.root === null) return [];

    this._clearResults();

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
        this._accumulatedByPropertyName(cur, nodeOrPropertyName);
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
          this._accumulatedByPropertyName(cur, nodeOrPropertyName);
          cur = cur.right;
        }
        break;
      case 'pre':
        while (cur) {
          if (cur.left) {
            const predecessor = this.getPredecessor(cur);
            if (!predecessor.right) {
              predecessor.right = cur;
              this._accumulatedByPropertyName(cur, nodeOrPropertyName);
              cur = cur.left;
              continue;
            } else {
              predecessor.right = null;
            }
          } else {
            this._accumulatedByPropertyName(cur, nodeOrPropertyName);
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

    return this._getResultByPropertyName(nodeOrPropertyName);
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
   * The function sets the loop type for a protected variable.
   * @param {LoopType} value - The value parameter is of type LoopType.
   */
  protected _setLoopType(value: LoopType) {
    this._loopType = value;
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

  /**
   * The function `_clearResults` resets the values of several arrays used for tracking visited nodes and their
   * properties.
   */
  protected _clearResults() {
    this.visitedKey = [];
    this.visitedVal = [];
    this.visitedNode = [];
  }

  /**
   * The function checks if a given property of a binary tree node matches a specified value, and if so, adds the node to
   * a result array.
   * @param {N} cur - The current node being processed.
   * @param {(N | null | undefined)[]} result - An array that stores the matching nodes.
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter is either a `BinaryTreeNodeKey` or a `N`
   * type. It represents the property value that we are comparing against in the switch statement.
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the property name to compare against when pushing nodes into the `result` array. It can be either `'key'`
   * or `'val'`. If it is not provided or is not equal to `'key'` or `'val'`, the
   * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
   * stop after finding the first matching node or continue searching for all matching nodes. If `onlyOne` is set to
   * `true`, the function will stop after finding the first matching node and return `true`. If `onlyOne
   * @returns a boolean value indicating whether only one matching node should be pushed into the result array.
   */
  protected _pushByPropertyNameStopOrNot(
    cur: N,
    result: (N | null | undefined)[],
    nodeProperty: BinaryTreeNodeKey | N,
    propertyName: BinaryTreeNodePropertyName = 'key',
    onlyOne = false
  ) {
    switch (propertyName) {
      case 'key':
        if (cur.key === nodeProperty) {
          result.push(cur);
          return onlyOne;
        }
        break;
      case 'val':
        if (cur.val === nodeProperty) {
          result.push(cur);
          return onlyOne;
        }
        break;
      default:
        if (cur.key === nodeProperty) {
          result.push(cur);
          return onlyOne;
        }
        break;
    }
  }

  /**
   * The function `_accumulatedByPropertyName` accumulates values from a given node based on the specified property name.
   * @param {N} node - The `node` parameter is of type `N`, which represents a node in a data structure.
   * @param {NodeOrPropertyName} [nodeOrPropertyName] - The `nodeOrPropertyName` parameter is an optional parameter that
   * can be either a string representing a property name or a reference to a `Node` object. If it is a string, it
   * specifies the property name to be used for accumulating values. If it is a `Node` object, it specifies
   */
  protected _accumulatedByPropertyName(node: N, nodeOrPropertyName: NodeOrPropertyName = 'key') {
    switch (nodeOrPropertyName) {
      case 'key':
        this.visitedKey.push(node.key);
        break;
      case 'val':
        this.visitedVal.push(node.val);
        break;
      case 'node':
        this.visitedNode.push(node);
        break;
      default:
        this.visitedKey.push(node.key);
        break;
    }
  }

  /**
   * The time complexity of Morris traversal is O(n), it may slower than others
   * The space complexity  Morris traversal is O(1) because no using stack
   */

  /**
   * The function `_getResultByPropertyName` returns the corresponding property value based on the given node or property
   * name.
   * @param {NodeOrPropertyName} [nodeOrPropertyName] - The parameter `nodeOrPropertyName` is an optional parameter that
   * can accept either a `NodeOrPropertyName` type or be undefined.
   * @returns The method `_getResultByPropertyName` returns an instance of `BinaryTreeNodeProperties<N>`.
   */
  protected _getResultByPropertyName(nodeOrPropertyName: NodeOrPropertyName = 'key'): BinaryTreeNodeProperties<N> {
    switch (nodeOrPropertyName) {
      case 'key':
        return this.visitedKey;
      case 'val':
        return this.visitedVal;
      case 'node':
        return this.visitedNode;
      default:
        return this.visitedKey;
    }
  }

  // --- end additional methods ---
}
