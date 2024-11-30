/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  AVLTreeCounterOptions,
  BinaryTreeDeleteResult,
  BSTNOptKeyOrNode,
  BTNRep,
  EntryCallback,
  IterationType,
  OptNodeOrNull
} from '../../types';
import { IBinaryTree } from '../../interfaces';
import { AVLTree, AVLTreeNode } from './avl-tree';

export class AVLTreeCounterNode<K = any, V = any> extends AVLTreeNode<K, V> {
  /**
   * The constructor function initializes a BinaryTreeNode object with a key, value, and count.
   * @param {K} key - The `key` parameter is of type `K` and represents the unique identifier
   * of the binary tree node.
   * @param {V} [value] - The `value` parameter is an optional parameter of type `V`. It represents the value of the binary
   * tree node. If no value is provided, it will be `undefined`.
   * @param {number} [count=1] - The `count` parameter is a number that represents the number of times a particular value
   * occurs in a binary tree node. It has a default value of 1, which means that if no value is provided for the `count`
   * parameter when creating a new instance of the `BinaryTreeNode` class.
   */
  constructor(key: K, value?: V, count = 1) {
    super(key, value);
    this.count = count;
  }

  override parent?: AVLTreeCounterNode<K, V> = undefined;

  override _left?: OptNodeOrNull<AVLTreeCounterNode<K, V>> = undefined;

  override get left(): OptNodeOrNull<AVLTreeCounterNode<K, V>> {
    return this._left;
  }

  override set left(v: OptNodeOrNull<AVLTreeCounterNode<K, V>>) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: OptNodeOrNull<AVLTreeCounterNode<K, V>> = undefined;

  override get right(): OptNodeOrNull<AVLTreeCounterNode<K, V>> {
    return this._right;
  }

  override set right(v: OptNodeOrNull<AVLTreeCounterNode<K, V>>) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 * The only distinction between a AVLTreeCounter and a AVLTree lies in the ability of the former to store duplicate nodes through the utilization of counters.
 */
export class AVLTreeCounter<K = any, V = any, R = object, MK = any, MV = any, MR = object>
  extends AVLTree<K, V, R, MK, MV, MR>
  implements IBinaryTree<K, V, R, MK, MV, MR>
{
  /**
   * The constructor initializes a new AVLTreeCounter object with optional initial elements.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter is an
   * iterable object that can contain either keys, nodes, entries, or raw elements.
   * @param [options] - The `options` parameter is an optional object that can be used to customize the
   * behavior of the AVLTreeCounter. It can include properties such as `compareKeys` and
   * `compareValues` functions to define custom comparison logic for keys and values, respectively.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<BTNRep<K, V, AVLTreeCounterNode<K, V>> | R> = [],
    options?: AVLTreeCounterOptions<K, V, R>
  ) {
    super([], options);
    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
  }

  protected _count = 0;

  /**
   * The function calculates the sum of the count property of all nodes in a tree using depth-first
   * search.
   * @returns the sum of the count property of all nodes in the tree.
   */
  get count(): number {
    return this._count;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function calculates the sum of the count property of all nodes in a tree using depth-first
   * search.
   * @returns the sum of the count property of all nodes in the tree.
   */
  getComputedCount(): number {
    let sum = 0;
    this.dfs(node => (sum += node.count));
    return sum;
  }

  /**
   * The function creates a new AVLTreeCounterNode with the specified key, value, and count.
   * @param {K} key - The key parameter represents the key of the node being created. It is of type K,
   * which is a generic type that can be replaced with any specific type when using the function.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the node. It is of type `V`, which can be any data type.
   * @param {number} [count] - The `count` parameter represents the number of occurrences of a
   * key-value pair in the AVLTreeCounterNode. It is an optional parameter, so it can be omitted when
   * calling the `createNode` method. If provided, it specifies the initial count for the node.
   * @returns a new instance of the AVLTreeCounterNode class, casted as AVLTreeCounterNode<K, V>.
   */
  override createNode(key: K, value?: V, count?: number): AVLTreeCounterNode<K, V> {
    return new AVLTreeCounterNode(key, this._isMapMode ? undefined : value, count) as AVLTreeCounterNode<K, V>;
  }

  /**
   * The function creates a new AVLTreeCounter object with the specified options and returns it.
   * @param [options] - The `options` parameter is an optional object that contains additional
   * configuration options for creating the AVLTreeCounter. It can have the following properties:
   * @returns a new instance of the AVLTreeCounter class, with the specified options, as a TREE
   * object.
   */
  override createTree(options?: AVLTreeCounterOptions<K, V, R>) {
    return new AVLTreeCounter<K, V, R, MK, MV, MR>([], {
      iterationType: this.iterationType,
      isMapMode: this._isMapMode,
      specifyComparable: this._specifyComparable,
      toEntryFn: this._toEntryFn,
      isReverse: this._isReverse,
      ...options
    });
  }

  /**
   * The function checks if the input is an instance of AVLTreeCounterNode.
   * @param {BTNRep<K, V, AVLTreeCounterNode<K, V>>} keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can be of type `R` or `BTNRep<K, V, AVLTreeCounterNode<K, V>>`.
   * @returns a boolean value indicating whether the input parameter `keyNodeOrEntry` is
   * an instance of the `AVLTreeCounterNode` class.
   */
  override isNode(keyNodeOrEntry: BTNRep<K, V, AVLTreeCounterNode<K, V>>): keyNodeOrEntry is AVLTreeCounterNode<K, V> {
    return keyNodeOrEntry instanceof AVLTreeCounterNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the add method of a TypeScript class to add a new node to a data structure
   * and update the count.
   * @param {BTNRep<K, V, AVLTreeCounterNode<K, V>>} keyNodeOrEntry - The
   * `keyNodeOrEntry` parameter can accept a value of type `R`, which can be any type. It
   * can also accept a value of type `BTNRep<K, V, AVLTreeCounterNode<K, V>>`, which represents a key, node,
   * entry, or raw element
   * @param {V} [value] - The `value` parameter represents the value associated with the key in the
   * data structure. It is an optional parameter, so it can be omitted if not needed.
   * @param [count=1] - The `count` parameter represents the number of times the key-value pair should
   * be added to the data structure. By default, it is set to 1, meaning that the key-value pair will
   * be added once. However, you can specify a different value for `count` if you want to add
   * @returns a boolean value.
   */
  override add(keyNodeOrEntry: BTNRep<K, V, AVLTreeCounterNode<K, V>>, value?: V, count = 1): boolean {
    const [newNode, newValue] = this._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value, count);
    if (newNode === undefined) return false;

    const orgNodeCount = newNode?.count || 0;
    const inserted = super.add(newNode, newValue);
    if (inserted) {
      this._count += orgNodeCount;
    }
    return true;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the delete method in a binary tree data structure, handling deletion of
   * nodes and maintaining balance in the tree.
   * @param {BTNRep<K, V, AVLTreeCounterNode<K, V>>} keyNodeOrEntry - The `predicate`
   * parameter in the `delete` method is used to specify the condition for deleting a node from the
   * binary tree. It can be a key, node, or entry that determines which
   * node(s) should be deleted.
   * @param [ignoreCount=false] - The `ignoreCount` parameter in the `override delete` method is a
   * boolean flag that determines whether to ignore the count of the node being deleted. If
   * `ignoreCount` is set to `true`, the method will delete the node regardless of its count. If
   * `ignoreCount` is set to
   * @returns The `delete` method overrides the default delete behavior in a binary tree data
   * structure. It takes a predicate or node to be deleted and an optional flag to ignore count. The
   * method returns an array of `BinaryTreeDeleteResult` objects, each containing information about the
   * deleted node and whether balancing is needed in the tree.
   */
  override delete(
    keyNodeOrEntry: BTNRep<K, V, AVLTreeCounterNode<K, V>>,
    ignoreCount = false
  ): BinaryTreeDeleteResult<AVLTreeCounterNode<K, V>>[] {
    const deletedResult: BinaryTreeDeleteResult<AVLTreeCounterNode<K, V>>[] = [];
    if (!this.root) return deletedResult;

    const curr: AVLTreeCounterNode<K, V> | undefined = this.getNode(keyNodeOrEntry) ?? undefined;
    if (!curr) return deletedResult;

    const parent: AVLTreeCounterNode<K, V> | undefined = curr?.parent ? curr.parent : undefined;
    let needBalanced: AVLTreeCounterNode<K, V> | undefined = undefined,
      orgCurrent: AVLTreeCounterNode<K, V> | undefined = curr;

    if (curr.count > 1 && !ignoreCount) {
      curr.count--;
      this._count--;
    } else {
      if (!curr.left) {
        if (!parent) {
          if (curr.right !== undefined && curr.right !== null) this._setRoot(curr.right);
        } else {
          const { familyPosition: fp } = curr;
          if (fp === 'LEFT' || fp === 'ROOT_LEFT') {
            parent.left = curr.right;
          } else if (fp === 'RIGHT' || fp === 'ROOT_RIGHT') {
            parent.right = curr.right;
          }
          needBalanced = parent;
        }
      } else {
        const leftSubTreeRightMost = curr.left ? this.getRightMost(node => node, curr.left) : undefined;
        if (leftSubTreeRightMost) {
          const parentOfLeftSubTreeMax = leftSubTreeRightMost.parent;
          orgCurrent = this._swapProperties(curr, leftSubTreeRightMost);
          if (parentOfLeftSubTreeMax) {
            if (parentOfLeftSubTreeMax.right === leftSubTreeRightMost) {
              parentOfLeftSubTreeMax.right = leftSubTreeRightMost.left;
            } else {
              parentOfLeftSubTreeMax.left = leftSubTreeRightMost.left;
            }
            needBalanced = parentOfLeftSubTreeMax;
          }
        }
      }
      this._size = this._size - 1;
      // TODO How to handle when the count of target node is lesser than current node's count
      if (orgCurrent) this._count -= orgCurrent.count;
    }

    deletedResult.push({ deleted: orgCurrent, needBalanced });

    if (needBalanced) {
      this._balancePath(needBalanced);
    }

    return deletedResult;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The "clear" function overrides the parent class's "clear" function and also resets the count to
   * zero.
   */
  override clear() {
    super.clear();
    this._count = 0;
  }

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(log n)
   * The `perfectlyBalance` function takes a sorted array of nodes and builds a balanced binary search
   * tree using either a recursive or iterative approach.
   * @param {IterationType} iterationType - The `iterationType` parameter is an optional parameter that
   * specifies the type of iteration to use when building the balanced binary search tree. It has a
   * default value of `this.iterationType`, which means it will use the iteration type currently set in
   * the object.
   * @returns The function `perfectlyBalance` returns a boolean value. It returns `true` if the
   * balancing operation is successful, and `false` if there are no nodes to balance.
   */
  override perfectlyBalance(iterationType: IterationType = this.iterationType): boolean {
    const sorted = this.dfs(node => node, 'IN'),
      n = sorted.length;
    if (sorted.length < 1) return false;

    this.clear();

    if (iterationType === 'RECURSIVE') {
      const buildBalanceBST = (l: number, r: number) => {
        if (l > r) return;
        const m = l + Math.floor((r - l) / 2);
        const midNode = sorted[m];
        if (this._isMapMode) this.add(midNode.key, undefined, midNode.count);
        else this.add(midNode.key, midNode.value, midNode.count);
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
            if (this._isMapMode) this.add(midNode.key, undefined, midNode.count);
            else this.add(midNode.key, midNode.value, midNode.count);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
      return true;
    }
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the clone method to create a deep copy of a tree object.
   * @returns The `clone()` method is returning a cloned instance of the `TREE` object.
   */
  override clone() {
    const cloned = this.createTree();
    if (this._isMapMode) this.bfs(node => cloned.add(node.key, undefined, node.count));
    else this.bfs(node => cloned.add(node.key, node.value, node.count));
    if (this._isMapMode) cloned._store = this._store;
    return cloned;
  }

  /**
   * The `map` function in TypeScript overrides the default behavior to create a new AVLTreeCounter
   * with modified entries based on a provided callback.
   * @param callback - The `callback` parameter is a function that will be called for each entry in the
   * AVLTreeCounter. It takes four arguments:
   * @param [options] - The `options` parameter in the `override map` function is of type
   * `AVLTreeCounterOptions<MK, MV, MR>`. This parameter allows you to provide additional
   * configuration options when creating a new `AVLTreeCounter` instance within the `map` function.
   * These options
   * @param {any} [thisArg] - The `thisArg` parameter in the `override map` function is used to specify
   * the value of `this` when executing the `callback` function. It allows you to set the context
   * (value of `this`) for the callback function. This can be useful when you want to access properties
   * or
   * @returns The `map` method is returning a new `AVLTreeCounter` instance with the entries
   * transformed by the provided `callback` function. Each entry in the original tree is passed to the
   * `callback` function along with the index and the original tree itself. The transformed entries are
   * then added to the new `AVLTreeCounter` instance, which is returned at the end.
   */
  override map<MK, MV, MR>(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: AVLTreeCounterOptions<MK, MV, MR>,
    thisArg?: any
  ): AVLTreeCounter<MK, MV, MR> {
    const newTree = new AVLTreeCounter<MK, MV, MR>([], options);
    let index = 0;
    for (const [key, value] of this) {
      newTree.add(callback.call(thisArg, key, value, index++, this));
    }
    return newTree;
  }

  /**
   * The function `keyValueNodeEntryRawToNodeAndValue` converts a key, value, entry, or raw element into
   * a node object.
   * @param {BTNRep<K, V, AVLTreeCounterNode<K, V>>} keyNodeOrEntry - The
   * `keyNodeOrEntry` parameter can be of type `R` or `BTNRep<K, V, AVLTreeCounterNode<K, V>>`.
   * @param {V} [value] - The `value` parameter is an optional value that can be passed to the
   * `override` function. It represents the value associated with the key in the data structure. If no
   * value is provided, it will default to `undefined`.
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the key-value pair should be added to the data structure. If not provided, it defaults to 1.
   * @returns either a AVLTreeCounterNode<K, V> object or undefined.
   */
  protected override _keyValueNodeOrEntryToNodeAndValue(
    keyNodeOrEntry: BTNRep<K, V, AVLTreeCounterNode<K, V>>,
    value?: V,
    count = 1
  ): [AVLTreeCounterNode<K, V> | undefined, V | undefined] {
    if (keyNodeOrEntry === undefined || keyNodeOrEntry === null) return [undefined, undefined];
    if (this.isNode(keyNodeOrEntry)) return [keyNodeOrEntry, value];

    if (this.isEntry(keyNodeOrEntry)) {
      const [key, entryValue] = keyNodeOrEntry;
      if (key === undefined || key === null) return [undefined, undefined];
      const finalValue = value ?? entryValue;
      return [this.createNode(key, finalValue, count), finalValue];
    }

    return [this.createNode(keyNodeOrEntry, value, count), value];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_swapProperties` function swaps the properties (key, value, count, height) between two nodes
   * in a binary search tree.
   * @param {BSTNOptKeyOrNode<K, AVLTreeCounterNode<K, V>>} srcNode - The `srcNode` parameter represents the source node
   * that will be swapped with the `destNode`.
   * @param {BSTNOptKeyOrNode<K, AVLTreeCounterNode<K, V>>} destNode - The `destNode` parameter represents the destination
   * node where the properties will be swapped with the source node.
   * @returns The method is returning the `destNode` after swapping its properties with the `srcNode`.
   * If either `srcNode` or `destNode` is undefined, it returns `undefined`.
   */
  protected override _swapProperties(
    srcNode: BSTNOptKeyOrNode<K, AVLTreeCounterNode<K, V>>,
    destNode: BSTNOptKeyOrNode<K, AVLTreeCounterNode<K, V>>
  ): AVLTreeCounterNode<K, V> | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);
    if (srcNode && destNode) {
      const { key, value, count, height } = destNode;
      const tempNode = this.createNode(key, value, count);
      if (tempNode) {
        tempNode.height = height;

        destNode.key = srcNode.key;
        if (!this._isMapMode) destNode.value = srcNode.value;
        destNode.count = srcNode.count;
        destNode.height = srcNode.height;

        srcNode.key = tempNode.key;
        if (!this._isMapMode) srcNode.value = tempNode.value;
        srcNode.count = tempNode.count;
        srcNode.height = tempNode.height;
      }

      return destNode;
    }
    return undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function replaces an old node with a new node and updates the count property of the new node.
   * @param {AVLTreeCounterNode<K, V>} oldNode - The oldNode parameter represents the node that needs to be replaced in the
   * data structure. It is of type AVLTreeCounterNode<K, V>.
   * @param {AVLTreeCounterNode<K, V>} newNode - The `newNode` parameter is an instance of the `AVLTreeCounterNode<K, V>` class.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, which is of type `AVLTreeCounterNode<K, V>`.
   */
  protected override _replaceNode(
    oldNode: AVLTreeCounterNode<K, V>,
    newNode: AVLTreeCounterNode<K, V>
  ): AVLTreeCounterNode<K, V> {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
