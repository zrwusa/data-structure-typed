/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  BinaryTreeDeleteResult,
  BinaryTreeNested,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  BinaryTreePrintOptions,
  BTNCallback,
  BTNEntry,
  BTNExemplar,
  BTNKeyOrNode,
  DFSOrderPattern,
  EntryCallback,
  NodeDisplayLayout
} from '../../types';
import { FamilyPosition, IterationType } from '../../types';
import { IBinaryTree } from '../../interfaces';
import { trampoline } from '../../utils';
import { Queue } from '../queue';
import { IterableEntryBase } from '../base';

/**
 * Represents a node in a binary tree.
 * @template V - The type of data stored in the node.
 * @template N - The type of the family relationship in the binary tree.
 */
export class BinaryTreeNode<
  K = any,
  V = any,
  N extends BinaryTreeNode<K, V, N> = BinaryTreeNode<K, V, BinaryTreeNodeNested<K, V>>
> {
  key: K;

  value?: V;

  parent?: N;

  constructor(key: K, value?: V) {
    this.key = key;
    this.value = value;
  }

  protected _left?: N | null;

  get left(): N | null | undefined {
    return this._left;
  }

  set left(v: N | null | undefined) {
    if (v) {
      v.parent = this as unknown as N;
    }
    this._left = v;
  }

  protected _right?: N | null;

  get right(): N | null | undefined {
    return this._right;
  }

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
 * 1. Two Children Maximum: Each node has at most two children.
 * 2. Left and Right Children: Nodes have distinct left and right children.
 * 3. Depth and Height: Depth is the number of edges from the root to a node; height is the maximum depth in the tree.
 * 4. Subtrees: Each child of a node forms the root of a subtree.
 * 5. Leaf Nodes: Nodes without children are leaves.
 */

export class BinaryTree<
  K = any,
  V = any,
  N extends BinaryTreeNode<K, V, N> = BinaryTreeNode<K, V, BinaryTreeNodeNested<K, V>>,
  TREE extends BinaryTree<K, V, N, TREE> = BinaryTree<K, V, N, BinaryTreeNested<K, V, N>>
>
  extends IterableEntryBase<K, V | undefined>
  implements IBinaryTree<K, V, N, TREE> {
  iterationType = IterationType.ITERATIVE;

  /**
   * The constructor function initializes a binary tree object with optional elements and options.
   * @param [elements] - An optional iterable of BTNExemplar objects. These objects represent the
   * elements to be added to the binary tree.
   * @param [options] - The `options` parameter is an optional object that can contain additional
   * configuration options for the binary tree. In this case, it is of type
   * `Partial<BinaryTreeOptions>`, which means that not all properties of `BinaryTreeOptions` are
   * required.
   */
  constructor(elements?: Iterable<BTNExemplar<K, V, N>>, options?: Partial<BinaryTreeOptions<K>>) {
    super();
    if (options) {
      const { iterationType, extractor } = options;
      if (iterationType) {
        this.iterationType = iterationType;
      }
      if (extractor) {
        this._extractor = extractor;
      }
    }

    this._size = 0;

    if (elements) this.addMany(elements);
  }

  protected _extractor = (key: K) => Number(key);

  get extractor() {
    return this._extractor;
  }

  protected _root?: N | null;

  get root(): N | null | undefined {
    return this._root;
  }

  protected _size: number;

  get size(): number {
    return this._size;
  }

  /**
   * Creates a new instance of BinaryTreeNode with the given key and value.
   * @param {K} key - The key for the new node.
   * @param {V} value - The value for the new node.
   * @returns {N} - The newly created BinaryTreeNode.
   */
  createNode(key: K, value?: V): N {
    return new BinaryTreeNode<K, V, N>(key, value) as N;
  }

  /**
   * The function creates a binary tree with the given options.
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the `BinaryTree` class. It is of type `Partial<BinaryTreeOptions>`, which means that
   * you can provide only a subset of the properties defined in the `BinaryTreeOptions` interface.
   * @returns a new instance of a binary tree.
   */
  createTree(options?: Partial<BinaryTreeOptions<K>>): TREE {
    return new BinaryTree<K, V, N, TREE>([], { iterationType: this.iterationType, ...options }) as TREE;
  }

  /**
   * The function "isNode" checks if an exemplar is an instance of the BinaryTreeNode class.
   * @param exemplar - The `exemplar` parameter is a variable of type `BTNExemplar<K, V,N>`.
   * @returns a boolean value indicating whether the exemplar is an instance of the class N.
   */
  isNode(exemplar: BTNExemplar<K, V, N>): exemplar is N {
    return exemplar instanceof BinaryTreeNode;
  }

  /**
   * The function `exemplarToNode` converts an exemplar object into a node object.
   * @param exemplar - The `exemplar` parameter is of type `BTNExemplar<K, V, N>`.
   * @param {V} [value] - The `value` parameter is an optional value that can be passed to the
   * `exemplarToNode` function. It represents the value associated with the exemplar node. If no value
   * is provided, it will be `undefined`.
   * @returns a value of type N (node), or null, or undefined.
   */
  exemplarToNode(exemplar: BTNExemplar<K, V, N>, value?: V): N | null | undefined {
    if (exemplar === undefined) return;

    let node: N | null | undefined;
    if (exemplar === null) {
      node = null;
    } else if (this.isEntry(exemplar)) {
      const [key, value] = exemplar;
      if (key === undefined) {
        return;
      } else if (key === null) {
        node = null;
      } else {
        node = this.createNode(key, value);
      }
    } else if (this.isNode(exemplar)) {
      node = exemplar;
    } else if (this.isNotNodeInstance(exemplar)) {
      node = this.createNode(exemplar, value);
    } else {
      return;
    }
    return node;
  }

  /**
   * The function checks if a given value is an entry in a binary tree node.
   * @param kne - BTNExemplar<K, V,N> - A generic type representing a node in a binary tree. It has
   * two type parameters V and N, representing the value and node type respectively.
   * @returns a boolean value.
   */
  isEntry(kne: BTNExemplar<K, V, N>): kne is BTNEntry<K, V> {
    return Array.isArray(kne) && kne.length === 2;
  }

  /**
   * Time Complexity O(log n) - O(n)
   * Space Complexity O(1)
   */

  /**
   * Time Complexity O(log n) - O(n)
   * Space Complexity O(1)
   *
   * The `add` function adds a new node to a binary tree, either by creating a new node or replacing an
   * existing node with the same key.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can be one of the following:
   * @param {V} [value] - The value to be inserted into the binary tree.
   * @returns The function `add` returns either a node (`N`), `null`, or `undefined`.
   */
  add(keyOrNodeOrEntry: BTNExemplar<K, V, N>, value?: V): N | null | undefined {
    const newNode = this.exemplarToNode(keyOrNodeOrEntry, value);
    if (newNode === undefined) return;

    // If the tree is empty, directly set the new node as the root node
    if (!this.root) {
      this._root = newNode;
      this._size = 1;
      return newNode;
    }

    const queue = new Queue<N>([this.root]);
    let potentialParent: N | undefined; // Record the parent node of the potential insertion location

    while (queue.size > 0) {
      const cur = queue.shift();

      if (!cur) continue;

      // Check for duplicate keys when newNode is not null
      if (newNode !== null && cur.key === newNode.key) {
        this._replaceNode(cur, newNode);
        return newNode; // If duplicate keys are found, no insertion is performed
      }

      // Record the first possible insertion location found
      if (potentialParent === undefined && (cur.left === undefined || cur.right === undefined)) {
        potentialParent = cur;
      }

      // Continue traversing the left and right subtrees
      if (cur.left !== null) {
        cur.left && queue.push(cur.left);
      }
      if (cur.right !== null) {
        cur.right && queue.push(cur.right);
      }
    }

    // At the end of the traversal, if the insertion position is found, insert
    if (potentialParent) {
      if (potentialParent.left === undefined) {
        potentialParent.left = newNode;
      } else if (potentialParent.right === undefined) {
        potentialParent.right = newNode;
      }
      this._size++;
      return newNode;
    }

    return undefined; // If the insertion position cannot be found, return undefined
  }

  /**
   * Time Complexity: O(k log n) - O(k * n)
   * Space Complexity: O(1)
   * Comments: The time complexity for adding a node depends on the depth of the tree. In the best case (when the tree is empty), it's O(1). In the worst case (when the tree is a degenerate tree), it's O(n). The space complexity is constant.
   */

  /**
   * Time Complexity: O(k log n) - O(k * n)
   * Space Complexity: O(1)
   *
   * The `addMany` function takes in a collection of nodes and an optional collection of values, and
   * adds each node with its corresponding value to the data structure.
   * @param nodes - An iterable collection of BTNExemplar objects.
   * @param [values] - An optional iterable of values that will be assigned to each node being added.
   * @returns The function `addMany` returns an array of `N`, `null`, or `undefined` values.
   */
  addMany(nodes: Iterable<BTNExemplar<K, V, N>>, values?: Iterable<V | undefined>): (N | null | undefined)[] {
    // TODO not sure addMany not be run multi times
    const inserted: (N | null | undefined)[] = [];

    let valuesIterator: Iterator<V | undefined> | undefined;
    if (values) {
      valuesIterator = values[Symbol.iterator]();
    }

    for (const kne of nodes) {
      let value: V | undefined | null = undefined;

      if (valuesIterator) {
        const valueResult = valuesIterator.next();
        if (!valueResult.done) {
          value = valueResult.value;
        }
      }

      inserted.push(this.add(kne, value));
    }

    return inserted;
  }

  /**
   * Time Complexity: O(k * n)  "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted.
   * Space Complexity: O(1)
   */

  refill(nodesOrKeysOrEntries: Iterable<BTNExemplar<K, V, N>>, values?: Iterable<V | undefined>): void {
    this.clear();
    this.addMany(nodesOrKeysOrEntries, values);
  }

  /**
   * Time Complexity: O(k * n)  "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted.
   * Space Complexity: O(1)
   */

  delete<C extends BTNCallback<N, K>>(identifier: K, callback?: C): BinaryTreeDeleteResult<N>[];

  delete<C extends BTNCallback<N, N>>(identifier: N | null | undefined, callback?: C): BinaryTreeDeleteResult<N>[];

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C>, callback: C): BinaryTreeDeleteResult<N>[];

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
   * @returns an array of `BinaryTreeDeleteResult<N>`.
   */
  delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C
  ): BinaryTreeDeleteResult<N>[] {
    const deletedResult: BinaryTreeDeleteResult<N>[] = [];
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
        const { familyPosition: fp } = curr;
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
          orgCurrent = this._swapProperties(curr, leftSubTreeRightMost);
          if (parentOfLeftSubTreeMax) {
            if (parentOfLeftSubTreeMax.right === leftSubTreeRightMost)
              parentOfLeftSubTreeMax.right = leftSubTreeRightMost.left;
            else parentOfLeftSubTreeMax.left = leftSubTreeRightMost.left;
            needBalanced = parentOfLeftSubTreeMax;
          }
        }
      }
    }
    this._size = this.size - 1;

    deletedResult.push({ deleted: orgCurrent, needBalanced });
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
   * @param {K | N | null | undefined} distNode - The `distNode` parameter represents the node in
   * the binary tree whose depth we want to find. It can be of type `K`, `N`, `null`, or
   * `undefined`.
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting node
   * from which we want to calculate the depth. It can be either a `K` (binary tree node key) or
   * `N` (binary tree node) or `null` or `undefined`. If no value is provided for `beginRoot
   * @returns the depth of the `distNode` relative to the `beginRoot`.
   */
  getDepth(distNode: BTNKeyOrNode<K, N>, beginRoot: BTNKeyOrNode<K, N> = this.root): number {
    distNode = this.ensureNode(distNode);
    beginRoot = this.ensureNode(beginRoot);
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
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `getHeight` calculates the maximum height of a binary tree using either recursive or
   * iterative traversal.
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node of the binary tree from which we want to calculate the height. It can be of type
   * `K`, `N`, `null`, or `undefined`. If not provided, it defaults to `this.root`.
   * @param iterationType - The `iterationType` parameter is used to determine whether to calculate the
   * height of the tree using a recursive approach or an iterative approach. It can have two possible
   * values:
   * @returns the height of the binary tree.
   */
  getHeight(beginRoot: BTNKeyOrNode<K, N> = this.root, iterationType = this.iterationType): number {
    beginRoot = this.ensureNode(beginRoot);
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
      const stack: { node: N; depth: number }[] = [{ node: beginRoot, depth: 0 }];
      let maxHeight = 0;

      while (stack.length > 0) {
        const { node, depth } = stack.pop()!;

        if (node.left) stack.push({ node: node.left, depth: depth + 1 });
        if (node.right) stack.push({ node: node.right, depth: depth + 1 });

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node of the binary tree from which we want to calculate the minimum height. It can be of
   * type `K`, `N`, `null`, or `undefined`. If no value is provided, it defaults to `this.root`.
   * @param iterationType - The `iterationType` parameter is used to determine the method of iteration
   * to calculate the minimum height of a binary tree. It can have two possible values:
   * @returns The function `getMinHeight` returns the minimum height of a binary tree.
   */
  getMinHeight(beginRoot: BTNKeyOrNode<K, N> = this.root, iterationType = this.iterationType): number {
    beginRoot = this.ensureNode(beginRoot);
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
   * Best Case - O(log n) (when using recursive iterationType), Worst Case - O(n) (when using iterative iterationType)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function checks if a binary tree is perfectly balanced by comparing the minimum height and the
   * height of the tree.
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for calculating the height and minimum height of a binary tree. It can be either a `K` (a key
   * value of a binary tree node), `N` (a node of a binary tree), `null`, or `undefined`. If
   * @returns a boolean value.
   */
  isPerfectlyBalanced(beginRoot: BTNKeyOrNode<K, N> = this.root): boolean {
    return this.getMinHeight(beginRoot) + 1 >= this.getHeight(beginRoot);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  getNodes<C extends BTNCallback<N, K>>(
    identifier: K,
    callback?: C,
    onlyOne?: boolean,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): N[];

  getNodes<C extends BTNCallback<N, N>>(
    identifier: N | null | undefined,
    callback?: C,
    onlyOne?: boolean,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): N[];

  getNodes<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C,
    onlyOne?: boolean,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): N[];

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
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
    beginRoot: BTNKeyOrNode<K, N> = this.root,
    iterationType = this.iterationType
  ): N[] {
    if ((!callback || callback === this._defaultOneParamCallback) && (identifier as any) instanceof BinaryTreeNode)
      callback = (node => node) as C;
    beginRoot = this.ensureNode(beginRoot);
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

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n).
   */

  has<C extends BTNCallback<N, K>>(
    identifier: K,
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): boolean;

  has<C extends BTNCallback<N, N>>(
    identifier: N | null | undefined,
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): boolean;

  has<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): boolean;

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for the search in the binary tree. It can be specified as a `K` (a unique identifier for a
   * node in the binary tree), a node object (`N`), or `null`/`undefined` to start the search from
   * @param iterationType - The `iterationType` parameter is a variable that determines the type of
   * iteration to be performed on the binary tree. It is used to specify whether the iteration should
   * be performed in a pre-order, in-order, or post-order manner.
   * @returns a boolean value.
   */
  has<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKeyOrNode<K, N> = this.root,
    iterationType = this.iterationType
  ): boolean {
    if ((!callback || callback === this._defaultOneParamCallback) && (identifier as any) instanceof BinaryTreeNode)
      callback = (node => node) as C;

    return this.getNodes(identifier, callback, true, beginRoot, iterationType).length > 0;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n).
   */

  getNode<C extends BTNCallback<N, K>>(
    identifier: K,
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): N | null | undefined;

  getNode<C extends BTNCallback<N, N>>(
    identifier: N | null | undefined,
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): N | null | undefined;

  getNode<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): N | null | undefined;

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
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
    beginRoot: BTNKeyOrNode<K, N> = this.root,
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
   * @param {K} key - The `key` parameter is the key value that we are searching for in the tree.
   * It is used to find the node with the matching key value.
   * @param iterationType - The `iterationType` parameter is used to determine whether the search for
   * the node with the given key should be performed iteratively or recursively. It has two possible
   * values:
   * @returns The function `getNodeByKey` returns a node (`N`) if a node with the specified key is
   * found in the binary tree. If no node is found, it returns `undefined`.
   */
  getNodeByKey(key: K, iterationType = IterationType.ITERATIVE): N | undefined {
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
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * The function `ensureNode` returns the node corresponding to the given key if it is a valid node
   * key, otherwise it returns the key itself.
   * @param {K | N | null | undefined} key - The `key` parameter can be of type `K`, `N`,
   * `null`, or `undefined`. It represents a key used to identify a node in a binary tree.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to be used when searching for a node by key. It has a default value of
   * `IterationType.ITERATIVE`.
   * @returns either the node corresponding to the given key if it is a valid node key, or the key
   * itself if it is not a valid node key.
   */
  ensureNode(key: BTNKeyOrNode<K, N>, iterationType = IterationType.ITERATIVE): N | null | undefined {
    return this.isNotNodeInstance(key) ? this.getNodeByKey(key, iterationType) : key;
  }

  get<C extends BTNCallback<N, K>>(
    identifier: K,
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): V | undefined;

  get<C extends BTNCallback<N, N>>(
    identifier: N | null | undefined,
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): V | undefined;

  get<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType
  ): V | undefined;

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for the search in the binary tree. It can be specified as a `K` (a unique identifier for a
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
    beginRoot: BTNKeyOrNode<K, N> = this.root,
    iterationType = this.iterationType
  ): V | undefined {
    if ((!callback || callback === this._defaultOneParamCallback) && (identifier as any) instanceof BinaryTreeNode)
      callback = (node => node) as C;

    return this.getNode(identifier, callback, beginRoot, iterationType)?.value ?? undefined;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

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
   *
   * The function `getPathToRoot` returns an array of nodes from a given node to the root of a tree
   * structure, with the option to reverse the order of the nodes.
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node from which you want to find the path to the root. It can be of type `K`, `N`,
   * `null`, or `undefined`.
   * @param [isReverse=true] - The `isReverse` parameter is a boolean flag that determines whether the
   * resulting path should be reversed or not. If `isReverse` is set to `true`, the path will be
   * reversed before returning it. If `isReverse` is set to `false`, the path will be returned as is
   * @returns The function `getPathToRoot` returns an array of nodes (`N[]`).
   */
  getPathToRoot(beginRoot: BTNKeyOrNode<K, N>, isReverse = true): N[] {
    // TODO to support get path through passing key
    const result: N[] = [];
    beginRoot = this.ensureNode(beginRoot);

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
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getLeftMost` returns the leftmost node in a binary tree, either recursively or
   * iteratively.
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting point
   * for finding the leftmost node in a binary tree. It can be either a `K` (a key value), `N` (a
   * node), `null`, or `undefined`. If not provided, it defaults to `this.root`,
   * @param iterationType - The `iterationType` parameter is used to determine the type of iteration to
   * be performed when finding the leftmost node in a binary tree. It can have two possible values:
   * @returns The function `getLeftMost` returns the leftmost node (`N`) in the binary tree. If there
   * is no leftmost node, it returns `null` or `undefined` depending on the input.
   */
  getLeftMost(beginRoot: BTNKeyOrNode<K, N> = this.root, iterationType = this.iterationType): N | null | undefined {
    beginRoot = this.ensureNode(beginRoot);

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node from which we want to find the rightmost node. It can be of type `K`, `N`,
   * `null`, or `undefined`. If not provided, it defaults to `this.root`, which is a property of the
   * current object.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when finding the rightmost node. It can have one of two values:
   * @returns The function `getRightMost` returns the rightmost node (`N`) in a binary tree. If there
   * is no rightmost node, it returns `null` or `undefined`, depending on the input.
   */
  getRightMost(beginRoot: BTNKeyOrNode<K, N> = this.root, iterationType = this.iterationType): N | null | undefined {
    // TODO support get right most by passing key in
    beginRoot = this.ensureNode(beginRoot);
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
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `isSubtreeBST` checks if a given binary tree is a valid binary search tree.
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the root
   * node of the binary search tree (BST) that you want to check if it is a subtree of another BST.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when checking if a subtree is a binary search tree (BST). It can have two
   * possible values:
   * @returns a boolean value.
   */
  isSubtreeBST(beginRoot: BTNKeyOrNode<K, N>, iterationType = this.iterationType): boolean {
    // TODO there is a bug
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return true;

    if (iterationType === IterationType.RECURSIVE) {
      const dfs = (cur: N | null | undefined, min: number, max: number): boolean => {
        if (!cur) return true;
        const numKey = this.extractor(cur.key);
        if (numKey <= min || numKey >= max) return false;
        return dfs(cur.left, min, numKey) && dfs(cur.right, numKey, max);
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
        const numKey = this.extractor(curr.key);
        if (!curr || prev >= numKey) return false;
        prev = numKey;
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

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  subTreeTraverse<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  subTreeTraverse<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: undefined
  ): ReturnType<C>[];

  subTreeTraverse<C extends BTNCallback<N | null | undefined>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(log n)
   *
   * The function `subTreeTraverse` traverses a binary tree and applies a callback function to each
   * node, either recursively or iteratively.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the subtree traversal. It takes a single parameter, which is the current node being traversed, and
   * returns a value of any type.
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node or key from which the subtree traversal should begin. It can be of type `K`,
   * `N`, `null`, or `undefined`. If not provided, the `root` property of the current object is used as
   * the default value.
   * @param iterationType - The `iterationType` parameter determines the type of traversal to be
   * performed on the subtree. It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean value that determines
   * whether to include null values in the traversal. If `includeNull` is set to `true`, the
   * traversal will include null values, otherwise it will skip them.
   * @returns The function `subTreeTraverse` returns an array of values that are the result of invoking
   * the `callback` function on each node in the subtree. The type of the array elements is determined
   * by the return type of the `callback` function.
   */
  subTreeTraverse<C extends BTNCallback<N | null | undefined>>(
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKeyOrNode<K, N> = this.root,
    iterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    beginRoot = this.ensureNode(beginRoot);

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
   * Time complexity: O(n)
   * Space complexity: O(log n)
   */

  /**
   * The function checks if a given node is a real node by verifying if it is an instance of
   * BinaryTreeNode and its key is not NaN.
   * @param {any} node - The parameter `node` is of type `any`, which means it can be any data type.
   * @returns a boolean value.
   */
  isRealNode(node: BTNExemplar<K, V, N>): node is N {
    return node instanceof BinaryTreeNode && String(node.key) !== 'NaN';
  }

  /**
   * The function checks if a given node is a BinaryTreeNode instance and has a key value of NaN.
   * @param {any} node - The parameter `node` is of type `any`, which means it can be any data type.
   * @returns a boolean value.
   */
  isNIL(node: BTNExemplar<K, V, N>) {
    return node instanceof BinaryTreeNode && String(node.key) === 'NaN';
  }

  /**
   * The function checks if a given node is a real node or null.
   * @param {any} node - The parameter `node` is of type `any`, which means it can be any data type.
   * @returns a boolean value.
   */
  isNodeOrNull(node: BTNExemplar<K, V, N>): node is N | null {
    return this.isRealNode(node) || node === null;
  }

  /**
   * The function "isNotNodeInstance" checks if a potential key is a K.
   * @param {any} potentialKey - The potentialKey parameter is of type any, which means it can be any
   * data type.
   * @returns a boolean value indicating whether the potentialKey is of type number or not.
   */
  isNotNodeInstance(potentialKey: BTNKeyOrNode<K, N>): potentialKey is K {
    return !(potentialKey instanceof BinaryTreeNode);
  }

  dfs<C extends BTNCallback<N>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  dfs<C extends BTNCallback<N>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: undefined
  ): ReturnType<C>[];

  dfs<C extends BTNCallback<N | null | undefined>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting node
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
    beginRoot: BTNKeyOrNode<K, N> = this.root,
    iterationType: IterationType = IterationType.ITERATIVE,
    includeNull = false
  ): ReturnType<C>[] {
    beginRoot = this.ensureNode(beginRoot);
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
      const stack: { opt: 0 | 1; node: N | null | undefined }[] = [{ opt: 0, node: beginRoot }];

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
              cur.node && stack.push({ opt: 0, node: cur.node.right });
              stack.push({ opt: 1, node: cur.node });
              cur.node && stack.push({ opt: 0, node: cur.node.left });
              break;
            case 'pre':
              cur.node && stack.push({ opt: 0, node: cur.node.right });
              cur.node && stack.push({ opt: 0, node: cur.node.left });
              stack.push({ opt: 1, node: cur.node });
              break;
            case 'post':
              stack.push({ opt: 1, node: cur.node });
              cur.node && stack.push({ opt: 0, node: cur.node.right });
              cur.node && stack.push({ opt: 0, node: cur.node.left });
              break;
            default:
              cur.node && stack.push({ opt: 0, node: cur.node.right });
              stack.push({ opt: 1, node: cur.node });
              cur.node && stack.push({ opt: 0, node: cur.node.left });
              break;
          }
        }
      }
    }

    return ans;
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  bfs<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  bfs<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: undefined
  ): ReturnType<C>[];

  bfs<C extends BTNCallback<N | null | undefined>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `bfs` function performs a breadth-first search traversal on a binary tree, executing a
   * callback function on each node.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the breadth-first search traversal. It takes a single parameter, which is the current node being
   * visited, and returns a value of any type.
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node for the breadth-first search traversal. It can be specified as a key, a node object,
   * or `null`/`undefined` to indicate the root of the tree. If not provided, the `root` property of
   * the class is used as
   * @param iterationType - The `iterationType` parameter determines the type of iteration to be
   * performed during the breadth-first search (BFS). It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean flag that determines whether
   * to include null values in the breadth-first search traversal. If `includeNull` is set to
   * `true`, null values will be included in the traversal, otherwise they will be skipped.
   * @returns an array of values that are the result of invoking the callback function on each node in
   * the breadth-first traversal of a binary tree.
   */
  bfs<C extends BTNCallback<N | null | undefined>>(
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKeyOrNode<K, N> = this.root,
    iterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    beginRoot = this.ensureNode(beginRoot);
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

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  listLevels<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[][];

  listLevels<C extends BTNCallback<N>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: undefined
  ): ReturnType<C>[][];

  listLevels<C extends BTNCallback<N | null | undefined>>(
    callback?: C,
    beginRoot?: BTNKeyOrNode<K, N>,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[][];

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter represents the
   * starting node for traversing the tree. It can be either a node object (`N`), a key value
   * (`K`), `null`, or `undefined`. If not provided, it defaults to the root node of the tree.
   * @param iterationType - The `iterationType` parameter determines the type of iteration to be
   * performed on the tree. It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean value that determines
   * whether to include null values in the resulting levels. If `includeNull` is set to `true`,
   * null values will be included in the levels. If `includeNull` is set to `false`, null values will
   * be excluded
   * @returns The function `listLevels` returns a two-dimensional array of type `ReturnType<C>[][]`.
   */
  listLevels<C extends BTNCallback<N | null | undefined>>(
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BTNKeyOrNode<K, N> = this.root,
    iterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[][] {
    beginRoot = this.ensureNode(beginRoot);
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

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function returns the predecessor of a given node in a tree.
   * @param {N} node - The parameter `node` is of type `RedBlackTreeNode`, which represents a node in a
   * tree.
   * @returns the predecessor of the given 'node'.
   */
  getPredecessor(node: N): N {
    if (this.isRealNode(node.left)) {
      let predecessor: N | null | undefined = node.left;
      while (!this.isRealNode(predecessor) || (this.isRealNode(predecessor.right) && predecessor.right !== node)) {
        if (this.isRealNode(predecessor)) {
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
   * @param {K | N | null} [x] - The parameter `x` can be of type `K`, `N`, or `null`.
   * @returns the successor of the given node or key. The successor is the node that comes immediately
   * after the given node in the inorder traversal of the binary tree.
   */
  getSuccessor(x?: K | N | null): N | null | undefined {
    x = this.ensureNode(x);
    if (!this.isRealNode(x)) return undefined;

    if (this.isRealNode(x.right)) {
      return this.getLeftMost(x.right);
    }

    let y: N | null | undefined = x.parent;
    while (this.isRealNode(y) && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

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
   * @param {K | N | null | undefined} beginRoot - The `beginRoot` parameter is the starting node
   * for the traversal. It can be specified as a key, a node object, or `null`/`undefined` to indicate
   * the root of the tree. If no value is provided, the default value is the root of the tree.
   * @returns The function `morris` returns an array of values that are the result of invoking the
   * `callback` function on each node in the binary tree. The type of the array elements is determined
   * by the return type of the `callback` function.
   */
  morris<C extends BTNCallback<N>>(
    callback: C = this._defaultOneParamCallback as C,
    pattern: DFSOrderPattern = 'in',
    beginRoot: BTNKeyOrNode<K, N> = this.root
  ): ReturnType<C>[] {
    beginRoot = this.ensureNode(beginRoot);
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
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `clone` function creates a new tree object and copies all the nodes from the original tree to
   * the new tree.
   * @returns The `clone()` method is returning a cloned instance of the `TREE` object.
   */
  clone(): TREE {
    const cloned = this.createTree();
    this.bfs(node => cloned.add([node.key, node.value]));
    return cloned;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new tree by iterating over the elements of the current tree and
   * adding only the elements that satisfy the given predicate function.
   * @param predicate - The `predicate` parameter is a function that takes three arguments: `value`,
   * `key`, and `index`. It should return a boolean value indicating whether the pair should be
   * included in the filtered tree or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as the `this` value when executing the `predicate` function. If `thisArg` is provided,
   * it will be passed as the first argument to the `predicate` function. If `thisArg` is
   * @returns The `filter` method is returning a new tree object that contains the key-value pairs that
   * pass the given predicate function.
   */
  filter(predicate: EntryCallback<K, V | undefined, boolean>, thisArg?: any) {
    const newTree = this.createTree();
    let index = 0;
    for (const [key, value] of this) {
      if (predicate.call(thisArg, value, key, index++, this)) {
        newTree.add([key, value]);
      }
    }
    return newTree;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new tree by applying a callback function to each key-value pair in
   * the original tree.
   * @param callback - The callback parameter is a function that will be called for each key-value pair
   * in the tree. It takes four arguments: the value of the current pair, the key of the current pair,
   * the index of the current pair, and a reference to the tree itself. The callback function should
   * return a new
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. If you pass a value for `thisArg`, it
   * will be used as the `this` value when the callback function is called. If you don't pass a value
   * @returns The `map` method is returning a new tree object.
   */
  map(callback: EntryCallback<K, V | undefined, V>, thisArg?: any) {
    const newTree = this.createTree();
    let index = 0;
    for (const [key, value] of this) {
      newTree.add([key, callback.call(thisArg, value, key, index++, this)]);
    }
    return newTree;
  }

  // // TODO Type error, need to return a TREE<NV> that is a value type only for callback function.
  // // map<NV>(callback: (entry: [K, V | undefined], tree: this) => NV) {
  // //   const newTree = this.createTree();
  // //   for (const [key, value] of this) {
  // //     newTree.add(key, callback([key, value], this));
  // //   }
  // //   return newTree;
  // // }
  //

  /**
   * The `print` function is used to display a binary tree structure in a visually appealing way.
   * @param {K | N | null | undefined} [beginRoot=this.root] - The `root` parameter is of type `K | N | null |
   * undefined`. It represents the root node of a binary tree. The root node can have one of the
   * following types:
   * @param {BinaryTreePrintOptions} [options={ isShowUndefined: false, isShowNull: false, isShowRedBlackNIL: false}] - Options object that controls printing behavior. You can specify whether to display undefined, null, or sentinel nodes.
   */
  print(beginRoot: BTNKeyOrNode<K, N> = this.root, options?: BinaryTreePrintOptions): void {
    const opts = { isShowUndefined: false, isShowNull: false, isShowRedBlackNIL: false, ...options };
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return;

    if (opts.isShowUndefined)
      console.log(`U for undefined
      `);
    if (opts.isShowNull)
      console.log(`N for null
      `);
    if (opts.isShowRedBlackNIL)
      console.log(`S for Sentinel Node
      `);

    const display = (root: N | null | undefined): void => {
      const [lines, , ,] = this._displayAux(root, opts);
      for (const line of lines) {
        console.log(line);
      }
    };

    display(beginRoot);
  }

  protected* _getIterator(node = this.root): IterableIterator<[K, V | undefined]> {
    if (!node) return;

    if (this.iterationType === IterationType.ITERATIVE) {
      const stack: (N | null | undefined)[] = [];
      let current: N | null | undefined = node;

      while (current || stack.length > 0) {
        while (current && !isNaN(this.extractor(current.key))) {
          stack.push(current);
          current = current.left;
        }

        current = stack.pop();

        if (current && !isNaN(this.extractor(current.key))) {
          yield [current.key, current.value];
          current = current.right;
        }
      }
    } else {
      if (node.left && !isNaN(this.extractor(node.key))) {
        yield* this[Symbol.iterator](node.left);
      }
      yield [node.key, node.value];
      if (node.right && !isNaN(this.extractor(node.key))) {
        yield* this[Symbol.iterator](node.right);
      }
    }
  }

  protected _displayAux(node: N | null | undefined, options: BinaryTreePrintOptions): NodeDisplayLayout {
    const { isShowNull, isShowUndefined, isShowRedBlackNIL } = options;
    const emptyDisplayLayout = <NodeDisplayLayout>[['─'], 1, 0, 0];

    // Check if node is null or undefined or key is NaN
    if (node === null && !isShowNull) {
      return emptyDisplayLayout;
    } else if (node === undefined && !isShowUndefined) {
      return emptyDisplayLayout;
    } else if (node !== null && node !== undefined && isNaN(this.extractor(node.key)) && !isShowRedBlackNIL) {
      return emptyDisplayLayout;
    } else if (node !== null && node !== undefined) {
      // Display logic of normal nodes

      const key = node.key,
        line = isNaN(this.extractor(key)) ? 'S' : this.extractor(key).toString(),
        width = line.length;

      return _buildNodeDisplay(
        line,
        width,
        this._displayAux(node.left, options),
        this._displayAux(node.right, options)
      );
    } else {
      // For cases where none of the conditions are met, null, undefined, and NaN nodes are not displayed
      const line = node === undefined ? 'U' : 'N',
        width = line.length;

      return _buildNodeDisplay(line, width, [[''], 1, 0, 0], [[''], 1, 0, 0]);
    }

    function _buildNodeDisplay(line: string, width: number, left: NodeDisplayLayout, right: NodeDisplayLayout) {
      const [leftLines, leftWidth, leftHeight, leftMiddle] = left;
      const [rightLines, rightWidth, rightHeight, rightMiddle] = right;
      const firstLine =
        ' '.repeat(Math.max(0, leftMiddle + 1)) +
        '_'.repeat(Math.max(0, leftWidth - leftMiddle - 1)) +
        line +
        '_'.repeat(Math.max(0, rightMiddle)) +
        ' '.repeat(Math.max(0, rightWidth - rightMiddle));

      const secondLine =
        (leftHeight > 0
          ? ' '.repeat(leftMiddle) + '/' + ' '.repeat(leftWidth - leftMiddle - 1)
          : ' '.repeat(leftWidth)) +
        ' '.repeat(width) +
        (rightHeight > 0
          ? ' '.repeat(rightMiddle) + '\\' + ' '.repeat(rightWidth - rightMiddle - 1)
          : ' '.repeat(rightWidth));

      const mergedLines = [firstLine, secondLine];

      for (let i = 0; i < Math.max(leftHeight, rightHeight); i++) {
        const leftLine = i < leftHeight ? leftLines[i] : ' '.repeat(leftWidth);
        const rightLine = i < rightHeight ? rightLines[i] : ' '.repeat(rightWidth);
        mergedLines.push(leftLine + ' '.repeat(width) + rightLine);
      }

      return <NodeDisplayLayout>[
        mergedLines,
        leftWidth + width + rightWidth,
        Math.max(leftHeight, rightHeight) + 2,
        leftWidth + Math.floor(width / 2)
      ];
    }
  }

  protected _defaultOneParamCallback = (node: N | null | undefined) => (node ? node.key : undefined);

  /**
   * Swap the data of two nodes in the binary tree.
   * @param {N} srcNode - The source node to swap.
   * @param {N} destNode - The destination node to swap.
   * @returns {N} - The destination node after the swap.
   */
  protected _swapProperties(srcNode: BTNKeyOrNode<K, N>, destNode: BTNKeyOrNode<K, N>): N | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);

    if (srcNode && destNode) {
      const { key, value } = destNode;
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
   * The function replaces an old node with a new node in a binary tree.
   * @param {N} oldNode - The oldNode parameter represents the node that needs to be replaced in the
   * tree.
   * @param {N} newNode - The `newNode` parameter is the node that will replace the `oldNode` in the
   * tree.
   * @returns The method is returning the newNode.
   */
  protected _replaceNode(oldNode: N, newNode: N): N {
    if (oldNode.parent) {
      if (oldNode.parent.left === oldNode) {
        oldNode.parent.left = newNode;
      } else if (oldNode.parent.right === oldNode) {
        oldNode.parent.right = newNode;
      }
    }
    newNode.left = oldNode.left;
    newNode.right = oldNode.right;
    newNode.parent = oldNode.parent;
    if (this.root === oldNode) {
      this._root = newNode;
    }

    return newNode;
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
