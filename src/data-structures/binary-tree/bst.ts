/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { BSTNested, BSTNodeNested, BSTOptions, BTNCallback, BTNKey, Comparator } from '../../types';
import { CP, IterableEntriesOrKeys, IterationType } from '../../types';
import { BinaryTree, BinaryTreeNode } from './binary-tree';
import { IBinaryTree } from '../../interfaces';
import { Queue } from '../queue';

export class BSTNode<V = any, N extends BSTNode<V, N> = BSTNodeNested<V>> extends BinaryTreeNode<V, N> {
  override parent?: N;

  constructor(key: BTNKey, value?: V) {
    super(key, value);
    this.parent = undefined;
    this._left = undefined;
    this._right = undefined;
  }

  protected override _left?: N;

  /**
   * Get the left child node.
   */
  override get left(): N | undefined {
    return this._left;
  }

  /**
   * Set the left child node.
   * @param {N | undefined} v - The left child node.
   */
  override set left(v: N | undefined) {
    if (v) {
      v.parent = this as unknown as N;
    }
    this._left = v;
  }

  protected override _right?: N;

  /**
   * Get the right child node.
   */
  override get right(): N | undefined {
    return this._right;
  }

  /**
   * Set the right child node.
   * @param {N | undefined} v - The right child node.
   */
  override set right(v: N | undefined) {
    if (v) {
      v.parent = this as unknown as N;
    }
    this._right = v;
  }
}

export class BST<V = any, N extends BSTNode<V, N> = BSTNode<V, BSTNodeNested<V>>, TREE extends BST<V, N, TREE> = BST<V, N, BSTNested<V, N>>>
  extends BinaryTree<V, N, TREE>
  implements IBinaryTree<V, N, TREE> {

  /**
   * The constructor function initializes a binary search tree with an optional comparator function.
   * @param {BSTOptions} [options] - An optional object that contains additional configuration options
   * for the binary search tree.
   */
  constructor(elements?: IterableEntriesOrKeys<V>, options?: Partial<BSTOptions>) {
    super([], options);

    if (options) {
      const { comparator } = options;
      if (comparator) {
        this.comparator = comparator;
      }
    }

    this._root = undefined;
    if (elements) this.init(elements);
  }

  protected override _root?: N;

  /**
   * Get the root node of the binary tree.
   */
  override get root(): N | undefined {
    return this._root;
  }

  comparator: Comparator<BTNKey> = (a, b) => a - b

  /**
   * The function creates a new binary search tree node with the given key and value.
   * @param {BTNKey} key - The key parameter is the key value that will be associated with
   * the new node. It is used to determine the position of the node in the binary search tree.
   * @param [value] - The parameter `value` is an optional value that can be assigned to the node. It
   * represents the value associated with the node in a binary search tree.
   * @returns a new instance of the BSTNode class with the specified key and value.
   */
  override createNode(key: BTNKey, value?: V): N {
    return new BSTNode<V, N>(key, value) as N;
  }

  override createTree(options?: Partial<BSTOptions>): TREE {
    return new BST<V, N, TREE>([], {
      iterationType: this.iterationType,
      comparator: this.comparator, ...options
    }) as TREE;
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. In the worst case (unbalanced tree), it can be O(n).
   * Space Complexity: O(1) - Constant space is used.
   *
   * The `add` function adds a new node to a binary search tree based on the provided key and value.
   * @param {BTNKey | N | null | undefined} keyOrNode - The `keyOrNode` parameter can be one of the
   * following types:
   * @param {V} [value] - The `value` parameter is an optional value that can be associated with the
   * key or node being added to the binary search tree.
   * @returns The method `add` returns a node (`N`) that was inserted into the binary search tree. If
   * no node was inserted, it returns `undefined`.
   */
  override add(keyOrNode: BTNKey | N | null | undefined, value?: V): N | undefined {
    if (keyOrNode === null) return undefined;
    // TODO support node as a parameter
    let inserted: N | undefined;
    let newNode: N | undefined;
    if (keyOrNode instanceof BSTNode) {
      newNode = keyOrNode;
    } else if (this.isNodeKey(keyOrNode)) {
      newNode = this.createNode(keyOrNode, value);
    } else {
      newNode = undefined;
    }
    if (this.root === undefined) {
      this._setRoot(newNode);
      this._size = this.size + 1;
      inserted = this.root;
    } else {
      let cur = this.root;
      let traversing = true;
      while (traversing) {
        if (cur !== undefined && newNode !== undefined) {
          if (this._compare(cur.key, newNode.key) === CP.eq) {
            if (newNode) {
              cur.value = newNode.value;
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
              this._size = this.size + 1;
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
              this._size = this.size + 1;
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
   * Time Complexity: O(log n) - Average case for a balanced tree. In the worst case (unbalanced tree), it can be O(n).
   * Space Complexity: O(1) - Constant space is used.
   */

  /**
   * Time Complexity: O(n log n) - Adding each element individually in a balanced tree.
   * Space Complexity: O(n) - Additional space is required for the sorted array.
   *
   * The `addMany` function is used to efficiently add multiple keys or nodes with corresponding data
   * to a binary search tree.
   * @param {(BTNKey | N | undefined)[]} keysOrNodes - An array of keys or nodes to be added to the
   * binary search tree. Each element can be of type `BTNKey` (binary tree node key), `N` (binary tree
   * node), or `undefined`.
   * @param {(V | undefined)[]} [data] - An optional array of values to associate with the keys or
   * nodes being added. If provided, the length of the `data` array must be the same as the length of
   * the `keysOrNodes` array.
   * @param [isBalanceAdd=true] - A boolean flag indicating whether the tree should be balanced after
   * adding the nodes. The default value is `true`.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when adding multiple keys or nodes to the binary search tree. It has a
   * default value of `this.iterationType`, which means it will use the iteration type specified in the
   * current instance of the binary search tree
   * @returns The function `addMany` returns an array of nodes (`N`) or `undefined` values.
   */
  override addMany(
    keysOrNodes: (BTNKey | N | undefined)[],
    data?: (V | undefined)[],
    isBalanceAdd = true,
    iterationType = this.iterationType
  ): (N | undefined)[] {
    // TODO this addMany function is inefficient, it should be optimized
    function hasNoUndefined(arr: (BTNKey | N | undefined)[]): arr is (BTNKey | N)[] {
      return arr.indexOf(undefined) === -1;
    }

    if (!isBalanceAdd || !hasNoUndefined(keysOrNodes)) {
      return super.addMany(keysOrNodes, data).map(n => n ?? undefined);
    }

    const inserted: (N | undefined)[] = [];
    const combinedArr: [BTNKey | N, V][] = keysOrNodes.map(
      (value: BTNKey | N, index) => [value, data?.[index]] as [BTNKey | N, V]
    );

    let sorted = [];

    function _isNodeOrUndefinedTuple(arr: [BTNKey | N, V][]): arr is [N, V][] {
      for (const [keyOrNode] of arr) if (keyOrNode instanceof BSTNode) return true;
      return false;
    }

    const _isBinaryTreeKeyOrNullTuple = (arr: [BTNKey | N, V][]): arr is [BTNKey, V][] => {
      for (const [keyOrNode] of arr) if (this.isNodeKey(keyOrNode)) return true;
      return false;
    };

    let sortedKeysOrNodes: (number | N | undefined)[] = [],
      sortedData: (V | undefined)[] | undefined = [];

    if (_isNodeOrUndefinedTuple(combinedArr)) {
      sorted = combinedArr.sort((a, b) => a[0].key - b[0].key);
    } else if (_isBinaryTreeKeyOrNullTuple(combinedArr)) {
      sorted = combinedArr.sort((a, b) => a[0] - b[0]);
    } else {
      throw new Error('Invalid input keysOrNodes');
    }
    sortedKeysOrNodes = sorted.map(([keyOrNode]) => keyOrNode);
    sortedData = sorted.map(([, value]) => value);
    const _dfs = (arr: (BTNKey | undefined | N)[], data?: (V | undefined)[]) => {
      if (arr.length === 0) return;

      const mid = Math.floor((arr.length - 1) / 2);
      const newNode = this.add(arr[mid], data?.[mid]);
      inserted.push(newNode);
      _dfs(arr.slice(0, mid), data?.slice(0, mid));
      _dfs(arr.slice(mid + 1), data?.slice(mid + 1));
    };
    const _iterate = () => {
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
      _dfs(sortedKeysOrNodes, sortedData);
    } else {
      _iterate();
    }

    return inserted;
  }

  /**
   * Time Complexity: O(n log n) - Adding each element individually in a balanced tree.
   * Space Complexity: O(n) - Additional space is required for the sorted array.
   */

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree.
   * Space Complexity: O(1) - Constant space is used.
   *
   * The `lastKey` function returns the key of the rightmost node in a binary tree, or the key of the
   * leftmost node if the comparison result is greater than.
   * @param {BTNKey | N | undefined} beginRoot - The `beginRoot` parameter is optional and can be of
   * type `BTNKey`, `N`, or `undefined`. It represents the starting point for finding the last key in
   * the binary tree. If not provided, it defaults to the root of the binary tree (`this.root`).
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed. It can have one of the following values:
   * @returns the key of the rightmost node in the binary tree if the comparison result is less than,
   * the key of the leftmost node if the comparison result is greater than, and the key of the
   * rightmost node otherwise. If no node is found, it returns 0.
   */
  lastKey(beginRoot: BTNKey | N | undefined = this.root, iterationType = this.iterationType): BTNKey {
    if (this._compare(0, 1) === CP.lt) return this.getRightMost(beginRoot, iterationType)?.key ?? 0;
    else if (this._compare(0, 1) === CP.gt) return this.getLeftMost(beginRoot, iterationType)?.key ?? 0;
    else return this.getRightMost(beginRoot, iterationType)?.key ?? 0;
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree.
   * Space Complexity: O(1) - Constant space is used.
   */

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   *
   * The function `getNodeByKey` searches for a node in a binary tree based on a given key, using
   * either recursive or iterative methods.
   * @param {BTNKey} key - The `key` parameter is the key value that we are searching for in the tree.
   * It is used to identify the node that we want to retrieve.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when searching for a node in the binary tree. It can have two possible
   * values:
   * @returns The function `getNodeByKey` returns a node (`N`) if a node with the specified key is
   * found in the binary tree. If no node is found, it returns `undefined`.
   */
  override getNodeByKey(key: BTNKey, iterationType = IterationType.ITERATIVE): N | undefined {
    if (!this.root) return undefined;
    if (iterationType === IterationType.RECURSIVE) {
      const _dfs = (cur: N): N | undefined => {
        if (cur.key === key) return cur;
        if (!cur.left && !cur.right) return;

        if (this._compare(cur.key, key) === CP.gt && cur.left) return _dfs(cur.left);
        if (this._compare(cur.key, key) === CP.lt && cur.right) return _dfs(cur.right);
      };

      return _dfs(this.root);
    } else {
      const queue = new Queue<N>([this.root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          if (this._compare(cur.key, key) === CP.eq) return cur;
          if (this._compare(cur.key, key) === CP.gt) cur.left && queue.push(cur.left);
          if (this._compare(cur.key, key) === CP.lt) cur.right && queue.push(cur.right);
        }
      }
    }
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   */

  /**
   * The function `ensureNotKey` returns the node corresponding to the given key if it is a node key,
   * otherwise it returns the key itself.
   * @param {BTNKey | N | undefined} key - The `key` parameter can be of type `BTNKey`, `N`, or
   * `undefined`.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to be performed. It has a default value of `IterationType.ITERATIVE`.
   * @returns either a node object (N) or undefined.
   */
  override ensureNotKey(key: BTNKey | N | undefined, iterationType = IterationType.ITERATIVE): N | undefined {
    return this.isNodeKey(key) ? this.getNodeByKey(key, iterationType) : key;
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. O(n) - Visiting each node once when identifier is not node's key.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   *
   * The function `getNodes` returns an array of nodes that match a given identifier, using either a
   * recursive or iterative approach.
   * @param {ReturnType<C> | undefined} identifier - The `identifier` parameter is the value that you
   * want to search for in the nodes of the binary tree. It can be of any type that is returned by the
   * callback function `C`.
   * @param {C} callback - The `callback` parameter is a function that takes a node of type `N` as its
   * argument and returns a value of type `ReturnType<C>`. The `C` type parameter represents a callback
   * function type that extends the `BTNCallback<N>` type. The `BTNCallback<N>` type is
   * @param [onlyOne=false] - A boolean flag indicating whether to stop searching after finding the
   * first node that matches the identifier. If set to true, the function will return an array
   * containing only the first matching node. If set to false (default), the function will continue
   * searching for all nodes that match the identifier and return an array containing
   * @param {BTNKey | N | undefined} beginRoot - The `beginRoot` parameter represents the starting node
   * for the traversal. It can be either a key value or a node object. If it is undefined, the
   * traversal will start from the root of the tree.
   * @param iterationType - The `iterationType` parameter determines the type of iteration to be
   * performed on the binary tree. It can have two possible values:
   * @returns The method returns an array of nodes (`N[]`).
   */
  override getNodes<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this._defaultOneParamCallback as C,
    onlyOne = false,
    beginRoot: BTNKey | N | undefined = this.root,
    iterationType = this.iterationType
  ): N[] {
    beginRoot = this.ensureNotKey(beginRoot);
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
        if (callback === this._defaultOneParamCallback) {
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
          if (callback === this._defaultOneParamCallback) {
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

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. O(n) - Visiting each node once when identifier is not node's key.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   */

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. O(n) - Visiting each node once when identifier is not node's key.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   *
   * The `lesserOrGreaterTraverse` function traverses a binary tree and returns an array of nodes that
   * are either lesser or greater than a target node, depending on the specified comparison type.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * that satisfies the condition specified by the `lesserOrGreater` parameter. It takes a single
   * parameter of type `N` (the node type) and returns a value of any type.
   * @param {CP} lesserOrGreater - The `lesserOrGreater` parameter is used to determine whether to
   * traverse nodes that are lesser than, greater than, or equal to the `targetNode`. It is of type
   * `CP`, which is a custom type representing the comparison operator. The possible values for
   * `lesserOrGreater` are
   * @param {BTNKey | N | undefined} targetNode - The `targetNode` parameter represents the node in the
   * binary tree that you want to traverse from. It can be specified either by its key, by the node
   * object itself, or it can be left undefined to start the traversal from the root of the tree.
   * @param iterationType - The `iterationType` parameter determines the type of traversal to be
   * performed on the binary tree. It can have two possible values:
   * @returns The function `lesserOrGreaterTraverse` returns an array of values of type
   * `ReturnType<C>`, which is the return type of the callback function passed as an argument.
   */
  lesserOrGreaterTraverse<C extends BTNCallback<N>>(
    callback: C = this._defaultOneParamCallback as C,
    lesserOrGreater: CP = CP.lt,
    targetNode: BTNKey | N | undefined = this.root,
    iterationType = this.iterationType
  ): ReturnType<C>[] {
    targetNode = this.ensureNotKey(targetNode);
    const ans: ReturnType<BTNCallback<N>>[] = [];
    if (!targetNode) return ans;
    if (!this.root) return ans;

    const targetKey = targetNode.key;

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
   * Time Complexity: O(log n) - Average case for a balanced tree. O(n) - Visiting each node once when identifier is not node's key.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   */

  /**
   * Time Complexity: O(n) - Building a balanced tree from a sorted array.
   * Space Complexity: O(n) - Additional space is required for the sorted array.
   *
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
        this.add(midNode.key, midNode.value);
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
            debugger;
            this.add(midNode.key, midNode.value);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
      return true;
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
   * Time Complexity: O(n) - Building a balanced tree from a sorted array.
   * Space Complexity: O(n) - Additional space is required for the sorted array.
   */

  /**
   * Time Complexity: O(n) - Visiting each node once.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   *
   * The function checks if a binary tree is AVL balanced using either recursive or iterative approach.
   * @param iterationType - The `iterationType` parameter is used to determine the method of iteration
   * to check if the AVL tree is balanced. It can have two possible values:
   * @returns a boolean value.
   */
  isAVLBalanced(iterationType = this.iterationType): boolean {
    if (!this.root) return true;

    let balanced = true;

    if (iterationType === IterationType.RECURSIVE) {
      const _height = (cur: N | undefined): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left),
          rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this.root);
    } else {
      const stack: N[] = [];
      let node: N | undefined = this.root,
        last: N | undefined = undefined;
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
              node = undefined;
            }
          } else node = node.right;
        }
      }
    }

    return balanced;
  }

  /**
   * Time Complexity: O(n) - Visiting each node once.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   */

  init(elements: IterableEntriesOrKeys<V>): void {
    if (elements) {
      for (const entryOrKey of elements) {
        if (Array.isArray(entryOrKey)) {
          const [key, value] = entryOrKey;
          this.add(key, value);
        } else {
          this.add(entryOrKey);
        }
      }
    }
  }

  protected _setRoot(v: N | undefined) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * The function compares two values using a comparator function and returns whether the first value
   * is greater than, less than, or equal to the second value.
   * @param {BTNKey} a - The parameter "a" is of type BTNKey.
   * @param {BTNKey} b - The parameter "b" in the above code represents a BTNKey.
   * @returns a value of type CP (ComparisonResult). The possible return values are CP.gt (greater
   * than), CP.lt (less than), or CP.eq (equal).
   */
  protected _compare(a: BTNKey, b: BTNKey): CP {
    const compared = this.comparator(a, b);
    if (compared > 0) return CP.gt;
    else if (compared < 0) return CP.lt;
    else return CP.eq;
  }
}
