/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  BinaryTreeNodeKey,
  BSTComparator,
  BSTNodeNested,
  BSTOptions,
  MapCallback,
  MapCallbackReturn
} from '../../types';
import {CP, IterationType} from '../../types';
import {BinaryTree, BinaryTreeNode} from './binary-tree';
import {IBinaryTree} from '../../interfaces';
import {Queue} from '../queue';

export class BSTNode<V = any, FAMILY extends BSTNode<V, FAMILY> = BSTNodeNested<V>> extends BinaryTreeNode<V, FAMILY> {
  constructor(key: BinaryTreeNodeKey, val?: V) {
    super(key, val);
  }
}

export class BST<N extends BSTNode<N['val'], N> = BSTNode> extends BinaryTree<N> implements IBinaryTree<N> {
  /**
   * The constructor function initializes a binary search tree object with an optional comparator
   * function.
   * @param {BSTOptions} [options] - An optional object that contains configuration options for the
   * binary search tree.
   */
  constructor(options?: BSTOptions) {
    super(options);
    if (options !== undefined) {
      const {comparator} = options;
      if (comparator !== undefined) {
        this._comparator = comparator;
      }
    }
  }

  /**
   * The function creates a new binary search tree node with the given key and value.
   * @param {BinaryTreeNodeKey} key - The key parameter is the key value that will be associated with
   * the new node. It is used to determine the position of the node in the binary search tree.
   * @param [val] - The parameter `val` is an optional value that can be assigned to the node. It
   * represents the value associated with the node in a binary search tree.
   * @returns a new instance of the BSTNode class with the specified key and value.
   */
  override createNode(key: BinaryTreeNodeKey, val?: N['val']): N {
    return new BSTNode<N['val'], N>(key, val) as N;
  }

  /**
   * The `add` function in a binary search tree class inserts a new node with a given key and value
   * into the tree.
   * @param {BinaryTreeNodeKey | N | null} keyOrNode - The `keyOrNode` parameter can be either a
   * `BinaryTreeNodeKey` (which can be a number or a string), a `BSTNode` object, or `null`.
   * @param [val] - The `val` parameter is the value to be assigned to the new node being added to the
   * binary search tree.
   * @returns the inserted node (N) if it was successfully added to the binary search tree. If the node
   * was not added or if the parameters were invalid, it returns null or undefined.
   */
  override add(keyOrNode: BinaryTreeNodeKey | N | null, val?: N['val']): N | null | undefined {
    // TODO support node as a parameter
    let inserted: N | null = null;
    let newNode: N | null = null;
    if (keyOrNode instanceof BSTNode) {
      newNode = keyOrNode;
    } else if (typeof keyOrNode === 'number') {
      newNode = this.createNode(keyOrNode, val);
    } else if (keyOrNode === null) {
      newNode = null;
    }
    if (this.root === null) {
      this._setRoot(newNode);
      this._setSize(this.size + 1);
      inserted = this.root;
    } else {
      let cur = this.root;
      let traversing = true;
      while (traversing) {
        if (cur !== null && newNode !== null) {
          if (this._compare(cur.key, newNode.key) === CP.eq) {
            if (newNode) {
              cur.val = newNode.val;
            }
            //Duplicates are not accepted.
            traversing = false;
            inserted = cur;
          } else if (this._compare(cur.key, newNode.key) === CP.gt) {
            // Traverse left of the node
            if (cur.left === undefined) {
              if (newNode) {
                newNode.parent = cur;
              }
              //Add to the left of the current node
              cur.left = newNode;
              this._setSize(this.size + 1);
              traversing = false;
              inserted = cur.left;
            } else {
              //Traverse the left of the current node
              if (cur.left) cur = cur.left;
            }
          } else if (this._compare(cur.key, newNode.key) === CP.lt) {
            // Traverse right of the node
            if (cur.right === undefined) {
              if (newNode) {
                newNode.parent = cur;
              }
              //Add to the right of the current node
              cur.right = newNode;
              this._setSize(this.size + 1);
              traversing = false;
              inserted = cur.right;
            } else {
              //Traverse the left of the current node
              if (cur.right) cur = cur.right;
            }
          }
        } else {
          traversing = false;
        }
      }
    }
    return inserted;
  }

  /**
   * The `addMany` function is used to efficiently add multiple nodes to a binary search tree while
   * maintaining balance.
   * @param {[BinaryTreeNodeKey | N, N['val']][]} keysOrNodes - The `arr` parameter in the `addMany` function
   * represents an array of keys or nodes that need to be added to the binary search tree. It can be an
   * array of `BinaryTreeNodeKey` or `N` (which represents the node type in the binary search tree) or
   * `null
   * @param {N['val'][]} data - The values of tree nodes
   * @param {boolean} isBalanceAdd - If true the nodes will be balance inserted in binary search method.
   * @param iterationType - The `iterationType` parameter determines the type of iteration to be used.
   * It can have two possible values:
   * @returns The `addMany` function returns an array of `N`, `null`, or `undefined` values.
   */

  override addMany(
    keysOrNodes: (BinaryTreeNodeKey | null)[] | (N | null)[],
    data?: N['val'][],
    isBalanceAdd = true,
    iterationType = this.iterationType
  ): (N | null | undefined)[] {
    // TODO this addMany function is inefficient, it should be optimized
    function hasNoNull(arr: (BinaryTreeNodeKey | null)[] | (N | null)[]): arr is BinaryTreeNodeKey[] | N[] {
      return arr.indexOf(null) === -1;
    }

    if (!isBalanceAdd || !hasNoNull(keysOrNodes)) {
      return super.addMany(keysOrNodes, data);
    }
    const inserted: (N | null | undefined)[] = [];
    const combinedArr: [BinaryTreeNodeKey | N, N['val']][] = keysOrNodes.map((value, index) => [value, data?.[index]]);
    let sorted = [];

    function isNodeOrNullTuple(arr: [BinaryTreeNodeKey | N, N['val']][]): arr is [N, N['val']][] {
      for (const [keyOrNode] of arr) if (keyOrNode instanceof BSTNode) return true;
      return false;
    }

    function isBinaryTreeKeyOrNullTuple(
      arr: [BinaryTreeNodeKey | N, N['val']][]
    ): arr is [BinaryTreeNodeKey, N['val']][] {
      for (const [keyOrNode] of arr) if (typeof keyOrNode === 'number') return true;
      return false;
    }

    let sortedKeysOrNodes: (number | N | null)[] = [],
      sortedData: (N['val'] | undefined)[] | undefined = [];

    if (isNodeOrNullTuple(combinedArr)) {
      sorted = combinedArr.sort((a, b) => a[0].key - b[0].key);
    } else if (isBinaryTreeKeyOrNullTuple(combinedArr)) {
      sorted = combinedArr.sort((a, b) => a[0] - b[0]);
    } else {
      throw new Error('Invalid input keysOrNodes');
    }
    sortedKeysOrNodes = sorted.map(([keyOrNode]) => keyOrNode);
    sortedData = sorted.map(([, val]) => val);
    const recursive = (arr: (BinaryTreeNodeKey | null | N)[], data?: N['val'][]) => {
      if (arr.length === 0) return;

      const mid = Math.floor((arr.length - 1) / 2);
      const newNode = this.add(arr[mid], data?.[mid]);
      inserted.push(newNode);
      recursive(arr.slice(0, mid), data?.slice(0, mid));
      recursive(arr.slice(mid + 1), data?.slice(mid + 1));
    };
    const iterative = () => {
      const n = sorted.length;
      const stack: [[number, number]] = [[0, n - 1]];
      while (stack.length > 0) {
        const popped = stack.pop();
        if (popped) {
          const [l, r] = popped;
          if (l <= r) {
            const m = l + Math.floor((r - l) / 2);
            const newNode = this.add(sortedKeysOrNodes[m], sortedData?.[m]);
            inserted.push(newNode);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
    };
    if (iterationType === IterationType.RECURSIVE) {
      recursive(sortedKeysOrNodes, sortedData);
    } else {
      iterative();
    }

    return inserted;
  }

  /**
   * The function returns the first node in the binary tree that matches the given node property and
   * callback.
   * @param {ReturnType<C> | N} identifier - The `nodeProperty` parameter is used to specify the
   * property of the binary tree node that you want to search for. It can be either a specific key
   * value (`BinaryTreeNodeKey`) or a custom callback function (`MapCallback<N>`) that determines
   * whether a node matches the desired property.
   * @param callback - The `callback` parameter is a function that is used to determine whether a node
   * matches the desired property. It takes a node as input and returns a boolean value indicating
   * whether the node matches the property or not. If no callback function is provided, the default
   * callback function `_defaultCallbackByKey` is used
   * @param beginRoot - The `beginRoot` parameter is the starting point for the search. It specifies
   * the root node from which the search should begin.
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed when searching for nodes in the binary tree. It can have one of the following values:
   * @returns either the first node that matches the given nodeProperty and callback, or null if no
   * matching node is found.
   */
  override get<C extends MapCallback<N>>(
    identifier: ReturnType<C> | N,
    callback: C = this._defaultCallbackByKey as C,
    beginRoot = this.root,
    iterationType = this.iterationType
  ): N | null {
    return this.getNodes(identifier, callback, true, beginRoot, iterationType)[0] ?? null;
  }

  /**
   * The function `lastKey` returns the key of the rightmost node if the comparison result is less
   * than, the key of the leftmost node if the comparison result is greater than, and the key of the
   * rightmost node otherwise.
   * @param {N | null} beginRoot - The `beginRoot` parameter is the starting point for finding the last
   * key in a binary tree. It represents the root node of the subtree from which the search for the
   * last key should begin. If no specific `beginRoot` is provided, the search will start from the root
   * of the entire binary
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed when finding the last key. It determines whether the iteration should be performed in
   * pre-order, in-order, or post-order.
   * @returns the key of the rightmost node in the binary tree if the comparison result is less than,
   * the key of the leftmost node if the comparison result is greater than, and the key of the
   * rightmost node otherwise. If no node is found, it returns 0.
   */
  lastKey(beginRoot: N | null = this.root, iterationType = this.iterationType): BinaryTreeNodeKey {
    if (this._compare(0, 1) === CP.lt) return this.getRightMost(beginRoot, iterationType)?.key ?? 0;
    else if (this._compare(0, 1) === CP.gt) return this.getLeftMost(beginRoot, iterationType)?.key ?? 0;
    else return this.getRightMost(beginRoot, iterationType)?.key ?? 0;
  }

  /**
   * The function `getNodes` retrieves nodes from a binary tree based on a given node property or key,
   * using either recursive or iterative traversal.
   * @param {ReturnType<C> | N} identifier - The `nodeProperty` parameter represents the property
   * of the binary tree node that you want to search for. It can be either a `BinaryTreeNodeKey` or a
   * generic type `N`.
   * @param callback - The `callback` parameter is a function that takes a node as input and returns a
   * value. This value is compared with the `nodeProperty` parameter to determine if the node should be
   * included in the result. The default value for `callback` is `this._defaultCallbackByKey`, which is
   * a
   * @param [onlyOne=false] - A boolean value indicating whether to stop the traversal after finding
   * the first node that matches the nodeProperty. If set to true, the function will return an array
   * containing only that node. If set to false (default), the function will continue the traversal and
   * return an array containing all nodes that match the node
   * @param {N | null} beginRoot - The `beginRoot` parameter is the starting node for the traversal. It
   * specifies the root node of the binary tree from which the traversal should begin. If `beginRoot`
   * is `null`, an empty array will be returned.
   * @param iterationType - The `iterationType` parameter determines the type of iteration used to
   * traverse the binary tree. It can have one of the following values:
   * @returns an array of nodes (N[]).
   */
  override getNodes<C extends MapCallback<N>>(
    identifier: ReturnType<C> | N,
    callback: C = this._defaultCallbackByKey as C,
    onlyOne = false,
    beginRoot: N | null = this.root,
    iterationType = this.iterationType
  ): N[] {
    if (!beginRoot) return [];
    const ans: N[] = [];

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: N) => {
        const callbackResult = callback(cur);
        if (callbackResult === identifier) {
          ans.push(cur);
          if (onlyOne) return;
        }

        if (!cur.left && !cur.right) return;
        // TODO potential bug
        if (callback === this._defaultCallbackByKey) {
          if (this._compare(cur.key, identifier as number) === CP.gt) cur.left && _traverse(cur.left);
          if (this._compare(cur.key, identifier as number) === CP.lt) cur.right && _traverse(cur.right);
        } else {
          cur.left && _traverse(cur.left);
          cur.right && _traverse(cur.right);
        }
      };

      _traverse(beginRoot);
    } else {
      const queue = new Queue<N>([beginRoot]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          const callbackResult = callback(cur);
          if (callbackResult === identifier) {
            ans.push(cur);
            if (onlyOne) return ans;
          }
          // TODO potential bug
          if (callback === this._defaultCallbackByKey) {
            if (this._compare(cur.key, identifier as number) === CP.gt) cur.left && queue.push(cur.left);
            if (this._compare(cur.key, identifier as number) === CP.lt) cur.right && queue.push(cur.right);
          } else {
            cur.left && queue.push(cur.left);
            cur.right && queue.push(cur.right);
          }
        }
      }
    }

    return ans;
  }

  // --- start additional functions

  /**
   * The `lesserOrGreaterTraverse` function traverses a binary tree and applies a callback function to
   * nodes that have a key value lesser or greater than a target key value.
   * @param callback - The `callback` parameter is a function that will be called for each node that
   * meets the condition specified by the `lesserOrGreater` parameter. It takes a node as an argument
   * and returns a value.
   * @param {CP} lesserOrGreater - The `lesserOrGreater` parameter is used to determine whether to
   * traverse nodes that are lesser than, greater than, or equal to the `targetNode`. It can take one
   * of the following values:
   * @param {BinaryTreeNodeKey | N | null} targetNode - The `targetNode` parameter in the
   * `lesserOrGreaterTraverse` function is used to specify the node from which the traversal should
   * start. It can be either a reference to a specific node (`N`), the key of a node
   * (`BinaryTreeNodeKey`), or `null` to
   * @param iterationType - The `iterationType` parameter determines whether the traversal should be
   * done recursively or iteratively. It can have two possible values:
   * @returns The function `lesserOrGreaterTraverse` returns an array of `MapCallbackReturn<N>`.
   */
  lesserOrGreaterTraverse<C extends MapCallback<N>>(
    callback: C = this._defaultCallbackByKey as C,
    lesserOrGreater: CP = CP.lt,
    targetNode: BinaryTreeNodeKey | N | null = this.root,
    iterationType = this.iterationType
  ): ReturnType<C>[] {
    if (typeof targetNode === 'number') targetNode = this.get(targetNode);
    const ans: MapCallbackReturn<N>[] = [];
    if (!targetNode) return ans;
    const targetKey = targetNode.key;
    if (!this.root) return ans;

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: N) => {
        const compared = this._compare(cur.key, targetKey);
        if (compared === lesserOrGreater) ans.push(callback(cur));

        if (!cur.left && !cur.right) return;
        if (cur.left && this._compare(cur.left.key, targetKey) === lesserOrGreater) _traverse(cur.left);
        if (cur.right && this._compare(cur.right.key, targetKey) === lesserOrGreater) _traverse(cur.right);
      };

      _traverse(this.root);
      return ans;
    } else {
      const queue = new Queue<N>([this.root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          const compared = this._compare(cur.key, targetKey);
          if (compared === lesserOrGreater) ans.push(callback(cur));

          if (cur.left && this._compare(cur.left.key, targetKey) === lesserOrGreater) queue.push(cur.left);
          if (cur.right && this._compare(cur.right.key, targetKey) === lesserOrGreater) queue.push(cur.right);
        }
      }
      return ans;
    }
  }

  /**
   * Balancing Adjustment:
   * Perfectly Balanced Binary Tree: Since the balance of a perfectly balanced binary tree is already fixed, no additional balancing adjustment is needed. Any insertion or deletion operation will disrupt the perfect balance, often requiring a complete reconstruction of the tree.
   * AVL Tree: After insertion or deletion operations, an AVL tree performs rotation adjustments based on the balance factor of nodes to restore the tree's balance. These rotations can be left rotations, right rotations, left-right rotations, or right-left rotations, performed as needed.
   *
   * Use Cases and Efficiency:
   * Perfectly Balanced Binary Tree: Perfectly balanced binary trees are typically used in specific scenarios such as complete binary heaps in heap sort or certain types of Huffman trees. However, they are not suitable for dynamic operations requiring frequent insertions and deletions, as these operations often necessitate full tree reconstruction.
   * AVL Tree: AVL trees are well-suited for scenarios involving frequent searching, insertion, and deletion operations. Through rotation adjustments, AVL trees maintain their balance, ensuring average and worst-case time complexity of O(log n).
   */

  /**
   * The `perfectlyBalance` function balances a binary search tree by adding nodes in a way that
   * ensures the tree is perfectly balanced.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when building a balanced binary search tree. It can have two possible
   * values:
   * @returns The function `perfectlyBalance` returns a boolean value.
   */
  perfectlyBalance(iterationType = this.iterationType): boolean {
    const sorted = this.dfs(node => node, 'in'),
      n = sorted.length;
    this.clear();

    if (sorted.length < 1) return false;
    if (iterationType === IterationType.RECURSIVE) {
      const buildBalanceBST = (l: number, r: number) => {
        if (l > r) return;
        const m = l + Math.floor((r - l) / 2);
        const midNode = sorted[m];
        this.add(midNode.key, midNode.val);
        buildBalanceBST(l, m - 1);
        buildBalanceBST(m + 1, r);
      };

      buildBalanceBST(0, n - 1);
      return true;
    } else {
      const stack: [[number, number]] = [[0, n - 1]];
      while (stack.length > 0) {
        const popped = stack.pop();
        if (popped) {
          const [l, r] = popped;
          if (l <= r) {
            const m = l + Math.floor((r - l) / 2);
            const midNode = sorted[m];
            this.add(midNode.key, midNode.val);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
      return true;
    }
  }

  /**
   * The function checks if a binary tree is AVL balanced using either recursive or iterative approach.
   * @param iterationType - The `iterationType` parameter is used to determine the method of iteration
   * to check if the AVL tree is balanced. It can have two possible values:
   * @returns a boolean value.
   */
  isAVLBalanced(iterationType = this.iterationType): boolean {
    if (!this.root) return true;

    let balanced = true;

    if (iterationType === IterationType.RECURSIVE) {
      const _height = (cur: N | null | undefined): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left),
          rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this.root);
    } else {
      const stack: N[] = [];
      let node: N | null | undefined = this.root,
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
              const left = node.left ? depths.get(node.left) ?? -1 : -1;
              const right = node.right ? depths.get(node.right) ?? -1 : -1;
              if (Math.abs(left - right) > 1) return false;
              depths.set(node, 1 + Math.max(left, right));
              last = node;
              node = null;
            }
          } else node = node.right;
        }
      }
    }

    return balanced;
  }

  protected _comparator: BSTComparator = (a, b) => a - b;

  /**
   * The function compares two values using a comparator function and returns whether the first value
   * is greater than, less than, or equal to the second value.
   * @param {BinaryTreeNodeKey} a - The parameter "a" is of type BinaryTreeNodeKey.
   * @param {BinaryTreeNodeKey} b - The parameter "b" in the above code represents a BinaryTreeNodeKey.
   * @returns a value of type CP (ComparisonResult). The possible return values are CP.gt (greater
   * than), CP.lt (less than), or CP.eq (equal).
   */
  protected _compare(a: BinaryTreeNodeKey, b: BinaryTreeNodeKey): CP {
    const compared = this._comparator(a, b);
    if (compared > 0) return CP.gt;
    else if (compared < 0) return CP.lt;
    else return CP.eq;
  }

  // --- end additional functions
}
