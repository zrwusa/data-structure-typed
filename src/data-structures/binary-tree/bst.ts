/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {
  BSTNested,
  BSTNodeNested,
  BSTNOptKeyOrNode,
  BSTOptions,
  BTNRep,
  Comparable,
  Comparator,
  CP,
  DFSOrderPattern,
  EntryCallback,
  IterationType,
  NodeCallback,
  NodePredicate,
  OptNode,
  OptNodeOrNull
} from '../../types';
import { BinaryTree, BinaryTreeNode } from './binary-tree';
import { IBinaryTree } from '../../interfaces';
import { Queue } from '../queue';
import { isComparable } from '../../utils';
import { Range } from '../../common';

export class BSTNode<K = any, V = any, NODE extends BSTNode<K, V, NODE> = BSTNodeNested<K, V>> extends BinaryTreeNode<
  K,
  V,
  NODE
> {
  override parent?: NODE;

  constructor(key: K, value?: V) {
    super(key, value);
    this.parent = undefined;
    this._left = undefined;
    this._right = undefined;
  }

  override _left?: OptNodeOrNull<NODE>;

  /**
   * The function returns the value of the `_left` property.
   * @returns The `_left` property of the current object is being returned.
   */
  override get left(): OptNodeOrNull<NODE> {
    return this._left;
  }

  /**
   * The function sets the left child of a node and updates the parent reference of the child.
   * @param {OptNode<NODE>} v - The parameter `v` is of type `OptNode<NODE>`. It can either be an
   * instance of the `NODE` class or `undefined`.
   */
  override set left(v: OptNodeOrNull<NODE>) {
    if (v) {
      v.parent = this as unknown as NODE;
    }
    this._left = v;
  }

  override _right?: OptNodeOrNull<NODE>;

  /**
   * The function returns the right node of a binary tree or undefined if there is no right node.
   * @returns The method is returning the value of the `_right` property, which is of type `NODE` or
   * `undefined`.
   */
  override get right(): OptNodeOrNull<NODE> {
    return this._right;
  }

  /**
   * The function sets the right child of a node and updates the parent reference of the child.
   * @param {OptNode<NODE>} v - The parameter `v` is of type `OptNode<NODE>`. It can either be a
   * `NODE` object or `undefined`.
   */
  override set right(v: OptNodeOrNull<NODE>) {
    if (v) {
      v.parent = this as unknown as NODE;
    }
    this._right = v;
  }
}

/**
 * 1. Node Order: Each node's left child has a lesser value, and the right child has a greater value.
 * 2. Unique Keys: No duplicate keys in a standard BST.
 * 3. Efficient Search: Enables quick search, minimum, and maximum operations.
 * 4. Inorder Traversal: Yields nodes in ascending order.
 * 5. Logarithmic Operations: Ideal operations like insertion, deletion, and searching are O(log n) time-efficient.
 * 6. Balance Variability: Can become unbalanced; special types maintain balance.
 * 7. No Auto-Balancing: Standard BSTs don't automatically balance themselves.
 * @example
 * // Merge 3 sorted datasets
 *     const dataset1 = new BST<number, string>([
 *       [1, 'A'],
 *       [7, 'G']
 *     ]);
 *     const dataset2 = [
 *       [2, 'B'],
 *       [6, 'F']
 *     ];
 *     const dataset3 = new BST<number, string>([
 *       [3, 'C'],
 *       [5, 'E'],
 *       [4, 'D']
 *     ]);
 *
 *     // Merge datasets into a single BinarySearchTree
 *     const merged = new BST<number, string>(dataset1);
 *     merged.addMany(dataset2);
 *     merged.merge(dataset3);
 *
 *     // Verify merged dataset is in sorted order
 *     console.log([...merged.values()]); // ['A', 'B', 'C', 'D', 'E', 'F', 'G']
 * @example
 * // Find elements in a range
 *     const bst = new BST<number>([10, 5, 15, 3, 7, 12, 18]);
 *     console.log(bst.search(new Range(5, 10))); // [10, 5, 7]
 *     console.log(bst.rangeSearch([4, 12], node => node.key.toString())); // ['10', '12', '5', '7']
 *     console.log(bst.search(new Range(4, 12, true, false))); // [10, 5, 7]
 *     console.log(bst.rangeSearch([15, 20])); // [15, 18]
 *     console.log(bst.search(new Range(15, 20, false))); // [18]
 * @example
 * // Find lowest common ancestor
 *     const bst = new BST<number>([20, 10, 30, 5, 15, 25, 35, 3, 7, 12, 18]);
 *
 *     // LCA helper function
 *     const findLCA = (num1: number, num2: number): number | undefined => {
 *       const path1 = bst.getPathToRoot(num1);
 *       const path2 = bst.getPathToRoot(num2);
 *       // Find the first common ancestor
 *       return findFirstCommon(path1, path2);
 *     };
 *
 *     function findFirstCommon(arr1: number[], arr2: number[]): number | undefined {
 *       for (const num of arr1) {
 *         if (arr2.indexOf(num) !== -1) {
 *           return num;
 *         }
 *       }
 *       return undefined;
 *     }
 *
 *     // Assertions
 *     console.log(findLCA(3, 10)); // 7
 *     console.log(findLCA(5, 35)); // 15
 *     console.log(findLCA(20, 30)); // 25
 */
export class BST<
    K = any,
    V = any,
    R = object,
    MK = any,
    MV = any,
    MR = object,
    NODE extends BSTNode<K, V, NODE> = BSTNode<K, V, BSTNodeNested<K, V>>,
    TREE extends BST<K, V, R, MK, MV, MR, NODE, TREE> = BST<
      K,
      V,
      R,
      MK,
      MV,
      MR,
      NODE,
      BSTNested<K, V, R, MK, MV, MR, NODE>
    >
  >
  extends BinaryTree<K, V, R, MK, MV, MR, NODE, TREE>
  implements IBinaryTree<K, V, R, MK, MV, MR, NODE, TREE>
{
  /**
   * This is the constructor function for a Binary Search Tree class in TypeScript.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter is an
   * iterable that can contain either keys, nodes, entries, or raw elements. These elements will be
   * added to the binary search tree during the construction of the object.
   * @param [options] - An optional object that contains additional options for the Binary Search Tree.
   * It can include a comparator function that defines the order of the elements in the tree.
   */
  constructor(keysNodesEntriesOrRaws: Iterable<R | BTNRep<K, V, NODE>> = [], options?: BSTOptions<K, V, R>) {
    super([], options);

    if (options) {
      const { specifyComparable, isReverse } = options;
      if (typeof specifyComparable === 'function') this._specifyComparable = specifyComparable;
      if (isReverse !== undefined) this._isReverse = isReverse;
    }

    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
  }

  protected override _root?: NODE = undefined;

  /**
   * The function returns the root node of a tree structure.
   * @returns The `_root` property of the object, which is of type `NODE` or `undefined`.
   */
  override get root(): OptNode<NODE> {
    return this._root;
  }

  protected _isReverse: boolean = false;

  /**
   * The above function is a getter method in TypeScript that returns the value of the private property
   * `_isReverse`.
   * @returns The `isReverse` property of the object, which is a boolean value.
   */
  get isReverse(): boolean {
    return this._isReverse;
  }

  /**
   * The function creates a new BSTNode with the given key and value and returns it.
   * @param {K} key - The key parameter is of type K, which represents the type of the key for the node
   * being created.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It represents the
   * value associated with the key in the node being created.
   * @returns The method is returning a new instance of the BSTNode class, casted as the NODE type.
   */
  override createNode(key: K, value?: V): NODE {
    return new BSTNode<K, V, NODE>(key, this._isMapMode ? undefined : value) as NODE;
  }

  /**
   * The function creates a new binary search tree with the specified options.
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the `createTree` method. It accepts a partial `BSTOptions` object, which has the
   * following properties:
   * @returns a new instance of the BST class with the provided options.
   */
  override createTree(options?: BSTOptions<K, V, R>): TREE {
    return new BST<K, V, R, MK, MV, MR, NODE, TREE>([], {
      iterationType: this.iterationType,
      isMapMode: this._isMapMode,
      specifyComparable: this._specifyComparable,
      toEntryFn: this._toEntryFn,
      isReverse: this._isReverse,
      ...options
    }) as TREE;
  }

  /**
   * The function overrides a method and converts a key, value pair or entry or raw element to a node.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - A variable that can be of
   * type R or BTNRep<K, V, NODE>. It represents either a key, a node, an entry, or a raw
   * element.
   * @param {V} [value] - The `value` parameter is an optional value of type `V`. It represents the
   * value associated with a key in a key-value pair.
   * @returns either a NODE object or undefined.
   */
  protected override _keyValueNodeEntryRawToNodeAndValue(
    keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R,
    value?: V
  ): [OptNode<NODE>, V | undefined] {
    const [node, entryValue] = super._keyValueNodeEntryRawToNodeAndValue(keyNodeEntryOrRaw, value);
    if (node === null) return [undefined, undefined];
    return [node, value ?? entryValue];
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function ensures the existence of a node in a data structure and returns it, or undefined if
   * it doesn't exist.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The parameter
   * `keyNodeEntryOrRaw` can accept a value of type `R`, which represents the key, node,
   * entry, or raw element that needs to be ensured in the tree.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter is an optional
   * parameter that specifies the type of iteration to be used when ensuring a node. It has a default
   * value of `'ITERATIVE'`.
   * @returns The method is returning either the node that was ensured or `undefined` if the node could
   * not be ensured.
   */
  override ensureNode(
    keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R,
    iterationType: IterationType = this.iterationType
  ): OptNode<NODE> {
    return super.ensureNode(keyNodeEntryOrRaw, iterationType) ?? undefined;
  }

  /**
   * The function checks if the input is an instance of the BSTNode class.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The parameter
   * `keyNodeEntryOrRaw` can be of type `R` or `BTNRep<K, V, NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyNodeEntryOrRaw` is
   * an instance of the `BSTNode` class.
   */
  override isNode(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): keyNodeEntryOrRaw is NODE {
    return keyNodeEntryOrRaw instanceof BSTNode;
  }

  /**
   * The function "override isKey" checks if a key is comparable based on a given comparator.
   * @param {any} key - The `key` parameter is a value that will be checked to determine if it is of
   * type `K`.
   * @returns The `override isKey(key: any): key is K` function is returning a boolean value based on
   * the result of the `isComparable` function with the condition `this._compare !==
   * this._DEFAULT_COMPARATOR`.
   */
  override isKey(key: any): key is K {
    return isComparable(key, this._specifyComparable !== undefined);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `add` function in TypeScript adds a new node to a binary search tree based on the key value.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The parameter
   * `keyNodeEntryOrRaw` can accept a value of type `R` or `BTNRep<K, V, NODE>`.
   * @param {V} [value] - The `value` parameter is an optional value that can be associated with the
   * key in the binary search tree. If provided, it will be stored in the node along with the key.
   * @returns a boolean value.
   */
  override add(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R, value?: V): boolean {
    const [newNode, newValue] = this._keyValueNodeEntryRawToNodeAndValue(keyNodeEntryOrRaw, value);
    if (newNode === undefined) return false;

    if (this._root === undefined) {
      this._setRoot(newNode);
      if (this._isMapMode) this._setValue(newNode?.key, newValue);
      this._size++;
      return true;
    }

    let current = this._root;
    while (current !== undefined) {
      if (this._compare(current.key, newNode.key) === 0) {
        this._replaceNode(current, newNode);
        if (this._isMapMode) this._setValue(current.key, newValue);
        return true;
      } else if (this._compare(current.key, newNode.key) > 0) {
        if (current.left === undefined) {
          current.left = newNode;
          if (this._isMapMode) this._setValue(newNode?.key, newValue);
          this._size++;
          return true;
        }
        if (current.left !== null) current = current.left;
      } else {
        if (current.right === undefined) {
          current.right = newNode;
          if (this._isMapMode) this._setValue(newNode?.key, newValue);
          this._size++;
          return true;
        }
        if (current.right !== null) current = current.right;
      }
    }

    return false;
  }

  /**
   * Time Complexity: O(k log n)
   * Space Complexity: O(k + log n)
   *
   * The `addMany` function in TypeScript adds multiple keys or nodes to a data structure and returns
   * an array indicating whether each key or node was successfully inserted.
   * @param keysNodesEntriesOrRaws - An iterable containing keys, nodes, entries, or raw
   * elements to be added to the data structure.
   * @param [values] - An optional iterable of values to be associated with the keys or nodes being
   * added. If provided, the values will be assigned to the corresponding keys or nodes in the same
   * order. If not provided, undefined will be assigned as the value for each key or node.
   * @param [isBalanceAdd=true] - A boolean flag indicating whether the tree should be balanced after
   * adding the elements. If set to true, the tree will be balanced using a binary search tree
   * algorithm. If set to false, the elements will be added without balancing the tree. The default
   * value is true.
   * @param {IterationType} iterationType - The `iterationType` parameter is an optional parameter that
   * specifies the type of iteration to use when adding multiple keys or nodes to the binary search
   * tree. It can have two possible values:
   * @returns The function `addMany` returns an array of booleans indicating whether each element was
   * successfully inserted into the data structure.
   */
  override addMany(
    keysNodesEntriesOrRaws: Iterable<R | BTNRep<K, V, NODE>>,
    values?: Iterable<V | undefined>,
    isBalanceAdd = true,
    iterationType: IterationType = this.iterationType
  ): boolean[] {
    const inserted: boolean[] = [];

    let valuesIterator: Iterator<V | undefined> | undefined;

    if (values) {
      valuesIterator = values[Symbol.iterator]();
    }

    if (!isBalanceAdd) {
      for (const kve of keysNodesEntriesOrRaws) {
        const value = valuesIterator?.next().value;
        inserted.push(this.add(kve, value));
      }
      return inserted;
    }

    const realBTNExemplars: {
      key: R | BTNRep<K, V, NODE>;
      value: V | undefined;
      orgIndex: number;
    }[] = [];

    let i = 0;
    for (const kve of keysNodesEntriesOrRaws) {
      realBTNExemplars.push({ key: kve, value: valuesIterator?.next().value, orgIndex: i });
      i++;
    }

    let sorted: { key: R | BTNRep<K, V, NODE>; value: V | undefined; orgIndex: number }[] = [];

    sorted = realBTNExemplars.sort(({ key: a }, { key: b }) => {
      let keyA: K | undefined | null, keyB: K | undefined | null;
      if (this.isEntry(a)) keyA = a[0];
      else if (this.isRealNode(a)) keyA = a.key;
      else if (this._toEntryFn) {
        keyA = this._toEntryFn(a as R)[0];
      } else {
        keyA = a as K;
      }

      if (this.isEntry(b)) keyB = b[0];
      else if (this.isRealNode(b)) keyB = b.key;
      else if (this._toEntryFn) {
        keyB = this._toEntryFn(b as R)[0];
      } else {
        keyB = b as K;
      }

      if (keyA !== undefined && keyA !== null && keyB !== undefined && keyB !== null) {
        return this._compare(keyA, keyB);
      }
      return 0;
    });

    const _dfs = (arr: { key: R | BTNRep<K, V, NODE>; value: V | undefined; orgIndex: number }[]) => {
      if (arr.length === 0) return;

      const mid = Math.floor((arr.length - 1) / 2);
      const { key, value, orgIndex } = arr[mid];
      inserted[orgIndex] = this.add(key, value);
      _dfs(arr.slice(0, mid));
      _dfs(arr.slice(mid + 1));
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
            const { key, value, orgIndex } = sorted[m];
            inserted[orgIndex] = this.add(key, value);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
    };

    if (iterationType === 'RECURSIVE') {
      _dfs(sorted);
    } else {
      _iterate();
    }

    return inserted;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(k + log n)
   *
   * The function `search` in TypeScript overrides the search behavior in a binary tree structure based
   * on specified criteria.
   * @param {BTNRep<K, V, NODE> | R | NodePredicate<NODE>} keyNodeEntryRawOrPredicate - The
   * `keyNodeEntryRawOrPredicate` parameter in the `override search` method can accept one of the
   * following types:
   * @param [onlyOne=false] - The `onlyOne` parameter is a boolean flag that determines whether the
   * search should stop after finding the first matching node. If `onlyOne` is set to `true`, the
   * search will return as soon as a matching node is found. If `onlyOne` is set to `false`, the
   * @param {C} callback - The `callback` parameter in the `override search` function is a function
   * that will be called on each node that matches the search criteria. It is of type `C`, which
   * extends `NodeCallback<NODE>`. The callback function should accept a node of type `NODE` as its
   * argument and
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `override search`
   * method represents the node from which the search operation will begin. It is the starting point
   * for searching within the tree data structure. The method ensures that the `startNode` is a valid
   * node before proceeding with the search operation. If the `
   * @param {IterationType} iterationType - The `iterationType` parameter in the `override search`
   * function determines the type of iteration to be used during the search operation. It can have two
   * possible values:
   * @returns The `override search` method returns an array of values that match the search criteria
   * specified by the input parameters. The method performs a search operation on a binary tree
   * structure based on the provided key, predicate, and other options. The search results are
   * collected in an array and returned as the output of the method.
   */
  override search<C extends NodeCallback<NODE>>(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R | NodePredicate<NODE> | Range<K>,
    onlyOne = false,
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    if (keyNodeEntryRawOrPredicate === undefined) return [];
    if (keyNodeEntryRawOrPredicate === null) return [];
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    let predicate: NodePredicate<NODE>;

    const isRange = this.isRange(keyNodeEntryRawOrPredicate);
    // Set predicate based on parameter type
    if (isRange) {
      predicate = node => keyNodeEntryRawOrPredicate.isInRange(node.key, this._comparator);
    } else {
      predicate = this._ensurePredicate(keyNodeEntryRawOrPredicate);
    }
    const isToLeftByRange = (cur: NODE) => {
      if (isRange) {
        const range = keyNodeEntryRawOrPredicate;
        const leftS = this.isReverse ? range.high : range.low;
        const leftI = this.isReverse ? range.includeHigh : range.includeLow;
        return (leftI && this._compare(cur.key, leftS) >= 0) || (!leftI && this._compare(cur.key, leftS) > 0);
      }
      return false;
    };

    const isToRightByRange = (cur: NODE) => {
      if (isRange) {
        const range = keyNodeEntryRawOrPredicate;
        const rightS = this.isReverse ? range.low : range.high;
        const rightI = this.isReverse ? range.includeLow : range.includeLow;

        return (rightI && this._compare(cur.key, rightS) <= 0) || (!rightI && this._compare(cur.key, rightS) < 0);
      }
      return false;
    };
    const ans: ReturnType<C>[] = [];
    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE) => {
        if (predicate(cur)) {
          ans.push(callback(cur));
          if (onlyOne) return;
        }

        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return;

        if (isRange) {
          if (this.isRealNode(cur.left) && isToLeftByRange(cur)) dfs(cur.left);
          if (this.isRealNode(cur.right) && isToRightByRange(cur)) dfs(cur.right);
        } else if (!this._isPredicate(keyNodeEntryRawOrPredicate)) {
          const benchmarkKey = this._extractKey(keyNodeEntryRawOrPredicate);
          if (
            this.isRealNode(cur.left) &&
            benchmarkKey !== null &&
            benchmarkKey !== undefined &&
            this._compare(cur.key, benchmarkKey) > 0
          )
            dfs(cur.left);
          if (
            this.isRealNode(cur.right) &&
            benchmarkKey !== null &&
            benchmarkKey !== undefined &&
            this._compare(cur.key, benchmarkKey) < 0
          )
            dfs(cur.right);
        } else {
          if (this.isRealNode(cur.left)) dfs(cur.left);
          if (this.isRealNode(cur.right)) dfs(cur.right);
        }
      };

      dfs(startNode);
    } else {
      const stack = [startNode];
      while (stack.length > 0) {
        const cur = stack.pop()!;
        if (predicate(cur)) {
          ans.push(callback(cur));
          if (onlyOne) return ans;
        }
        if (isRange) {
          if (this.isRealNode(cur.left) && isToLeftByRange(cur)) stack.push(cur.left);
          if (this.isRealNode(cur.right) && isToRightByRange(cur)) stack.push(cur.right);
        } else if (!this._isPredicate(keyNodeEntryRawOrPredicate)) {
          const benchmarkKey = this._extractKey(keyNodeEntryRawOrPredicate);
          if (
            this.isRealNode(cur.right) &&
            benchmarkKey !== null &&
            benchmarkKey !== undefined &&
            this._compare(cur.key, benchmarkKey) < 0
          )
            stack.push(cur.right);
          if (
            this.isRealNode(cur.left) &&
            benchmarkKey !== null &&
            benchmarkKey !== undefined &&
            this._compare(cur.key, benchmarkKey) > 0
          )
            stack.push(cur.left);
        } else {
          if (this.isRealNode(cur.right)) stack.push(cur.right);
          if (this.isRealNode(cur.left)) stack.push(cur.left);
        }
      }
    }

    return ans;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(n)
   *
   * The `rangeSearch` function searches for nodes within a specified range in a binary search tree.
   * @param {Range<K> | [K, K]} range - The `range` parameter in the `rangeSearch` function can be
   * either a `Range` object or an array of two elements representing the range boundaries.
   * @param {C} callback - The `callback` parameter in the `rangeSearch` function is a callback
   * function that is used to process each node that is found within the specified range during the
   * search operation. It is of type `NodeCallback<NODE>`, where `NODE` is the type of nodes in the
   * data structure.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `rangeSearch`
   * function represents the node from which the search for nodes within the specified range will
   * begin. It is the starting point for the range search operation.
   * @param {IterationType} iterationType - The `iterationType` parameter in the `rangeSearch` function
   * is used to specify the type of iteration to be performed during the search operation. It has a
   * default value of `this.iterationType`, which suggests that it is likely a property of the class or
   * object that the `rangeSearch`
   * @returns The `rangeSearch` function is returning the result of calling the `search` method with
   * the specified parameters.
   */
  rangeSearch<C extends NodeCallback<NODE>>(
    range: Range<K> | [K, K],
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ) {
    const searchRange: Range<K> = range instanceof Range ? range : new Range(range[0], range[1]);
    return this.search(searchRange, false, callback, startNode, iterationType);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * This function retrieves a node based on a given keyNodeEntryRawOrPredicate within a binary search tree structure.
   * @param {BTNRep<K, V, NODE> | R | NodePredicate<NODE>} keyNodeEntryRawOrPredicate - The `keyNodeEntryRawOrPredicate`
   * parameter can be of type `BTNRep<K, V, NODE>`, `R`, or `NodePredicate<NODE>`.
   * @param {R | BSTNOptKeyOrNode<K, NODE>} startNode - The `startNode` parameter in the `getNode` method
   * is used to specify the starting point for searching nodes in the binary search tree. If no
   * specific starting point is provided, the default value is set to `this._root`, which is the root
   * node of the binary search tree.
   * @param {IterationType} iterationType - The `iterationType` parameter in the `getNode` method is a
   * parameter that specifies the type of iteration to be used. It has a default value of
   * `this.iterationType`, which means it will use the iteration type defined in the class instance if
   * no value is provided when calling the method.
   * @returns The `getNode` method is returning an optional binary search tree node (`OptNode<NODE>`).
   * It is using the `getNodes` method to find the node based on the provided keyNodeEntryRawOrPredicate, beginning at
   * the specified root node (`startNode`) and using the specified iteration type. The method then
   * returns the first node found or `undefined` if no node is found.
   */
  override getNode(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R | NodePredicate<NODE>,
    startNode: R | BSTNOptKeyOrNode<K, NODE> = this._root,
    iterationType: IterationType = this.iterationType
  ): OptNode<NODE> {
    return this.getNodes(keyNodeEntryRawOrPredicate, true, startNode, iterationType)[0] ?? undefined;
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the depth-first search method and returns an array of the return types of
   * the callback function.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * during the depth-first search traversal. It is an optional parameter and defaults to
   * `this._DEFAULT_NODE_CALLBACK`. The type `C` represents the type of the callback function.
   * @param {DFSOrderPattern} [pattern=IN] - The "pattern" parameter in the code snippet refers to the
   * order in which the Depth-First Search (DFS) algorithm visits the nodes in a tree or graph. It can
   * take one of the following values:
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter is the starting
   * point for the depth-first search traversal. It can be either a root node, a key-value pair, or a
   * node entry. If not specified, the default value is the root of the tree.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter specifies the
   * type of iteration to be used during the Depth-First Search (DFS) traversal. It can have one of the
   * following values:
   * @returns The method is returning an array of the return type of the callback function.
   */
  override dfs<C extends NodeCallback<NODE>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    return super.dfs(callback, pattern, startNode, iterationType);
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the breadth-first search method and returns an array of the return types of
   * the callback function.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * visited during the breadth-first search. It should take a single argument, which is the current
   * node being visited, and it can return a value of any type.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter is the starting
   * point for the breadth-first search. It can be either a root node, a key-value pair, or an entry
   * object. If no value is provided, the default value is the root of the tree.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed during the breadth-first search (BFS) traversal. It can have one of
   * the following values:
   * @returns an array of the return type of the callback function.
   */
  override bfs<C extends NodeCallback<NODE>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    return super.bfs(callback, startNode, iterationType, false);
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the listLevels method from the superclass and returns an array of arrays
   * containing the results of the callback function applied to each level of the tree.
   * @param {C} callback - The `callback` parameter is a generic type `C` that extends
   * `NodeCallback<NODE>`. It represents a callback function that will be called for each node in the
   * tree during the iteration process.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter is the starting
   * point for listing the levels of the binary tree. It can be either a root node of the tree, a
   * key-value pair representing a node in the tree, or a key representing a node in the tree. If no
   * value is provided, the root of
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed on the tree. It can have one of the following values:
   * @returns The method is returning a two-dimensional array of the return type of the callback
   * function.
   */
  override listLevels<C extends NodeCallback<NODE>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[][] {
    return super.listLevels(callback, startNode, iterationType, false);
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `lesserOrGreaterTraverse` function traverses a binary tree and applies a callback function to
   * each node that meets a certain condition based on a target node and a comparison value.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * that meets the condition specified by the `lesserOrGreater` parameter. It takes a single argument,
   * which is the current node being traversed, and returns a value of any type.
   * @param {CP} lesserOrGreater - The `lesserOrGreater` parameter is used to determine whether to
   * traverse nodes that are lesser, greater, or both than the `targetNode`. It accepts the values -1,
   * 0, or 1, where:
   * @param {BTNRep<K, V, NODE> | R} targetNode - The `targetNode` parameter is the node in
   * the binary tree that you want to start traversing from. It can be specified either by providing
   * the key of the node, the node itself, or an entry containing the key and value of the node. If no
   * `targetNode` is provided,
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * traversal to be performed on the binary tree. It can have two possible values:
   * @returns The function `lesserOrGreaterTraverse` returns an array of values of type
   * `ReturnType<C>`, which is the return type of the callback function passed as an argument.
   */
  lesserOrGreaterTraverse<C extends NodeCallback<NODE>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    lesserOrGreater: CP = -1,
    targetNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    const targetNodeEnsured = this.ensureNode(targetNode);
    const ans: ReturnType<NodeCallback<NODE>>[] = [];
    if (!this._root) return ans;
    if (!targetNodeEnsured) return ans;

    const targetKey = targetNodeEnsured.key;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE) => {
        const compared = this._compare(cur.key, targetKey);
        if (Math.sign(compared) === lesserOrGreater) ans.push(callback(cur));
        // TODO here can be optimized to O(log n)
        if (this.isRealNode(cur.left)) dfs(cur.left);
        if (this.isRealNode(cur.right)) dfs(cur.right);
      };

      dfs(this._root);
      return ans;
    } else {
      const queue = new Queue<NODE>([this._root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (this.isRealNode(cur)) {
          const compared = this._compare(cur.key, targetKey);
          if (Math.sign(compared) === lesserOrGreater) ans.push(callback(cur));

          if (this.isRealNode(cur.left)) queue.push(cur.left);
          if (this.isRealNode(cur.right)) queue.push(cur.right);
        }
      }
      return ans;
    }
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `perfectlyBalance` function takes an optional `iterationType` parameter and returns `true` if
   * the binary search tree is perfectly balanced, otherwise it returns `false`.
   * @param {IterationType} iterationType - The `iterationType` parameter is an optional parameter that
   * specifies the type of iteration to use when building a balanced binary search tree. It has a
   * default value of `this.iterationType`, which means it will use the iteration type specified in the
   * current instance of the class.
   * @returns The function `perfectlyBalance` returns a boolean value.
   */
  perfectlyBalance(iterationType: IterationType = this.iterationType): boolean {
    const sorted = this.dfs(node => node, 'IN'),
      n = sorted.length;
    this._clearNodes();

    if (sorted.length < 1) return false;
    if (iterationType === 'RECURSIVE') {
      const buildBalanceBST = (l: number, r: number) => {
        if (l > r) return;
        const m = l + Math.floor((r - l) / 2);
        const midNode = sorted[m];
        if (this._isMapMode) this.add(midNode.key);
        else this.add([midNode.key, midNode.value]);
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
            if (this._isMapMode) this.add(midNode.key);
            else this.add([midNode.key, midNode.value]);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
      return true;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `isAVLBalanced` checks if a binary tree is AVL balanced using either a recursive or
   * iterative approach.
   * @param {IterationType} iterationType - The `iterationType` parameter is an optional parameter that
   * specifies the type of iteration to use when checking if the AVL tree is balanced. It has a default
   * value of `this.iterationType`, which means it will use the iteration type specified in the current
   * instance of the AVL tree.
   * @returns a boolean value.
   */
  isAVLBalanced(iterationType: IterationType = this.iterationType): boolean {
    if (!this._root) return true;

    let balanced = true;

    if (iterationType === 'RECURSIVE') {
      const _height = (cur: OptNodeOrNull<NODE>): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left),
          rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this._root);
    } else {
      const stack: NODE[] = [];
      let node: OptNode<NODE> = this._root,
        last: OptNode<NODE> = undefined;
      const depths: Map<NODE, number> = new Map();

      while (stack.length > 0 || node) {
        if (node) {
          stack.push(node);
          if (node.left !== null) node = node.left;
        } else {
          node = stack[stack.length - 1];
          if (!node.right || last === node.right) {
            node = stack.pop();
            if (node) {
              const left = node.left ? depths.get(node.left)! : -1;
              const right = node.right ? depths.get(node.right)! : -1;
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

  protected _comparator: Comparator<K> = (a: K, b: K): number => {
    if (isComparable(a) && isComparable(b)) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    }
    if (this._specifyComparable) {
      if (this._specifyComparable(a) > this._specifyComparable(b)) return 1;
      if (this._specifyComparable(a) < this._specifyComparable(b)) return -1;
      return 0;
    }
    if (typeof a === 'object' || typeof b === 'object') {
      throw TypeError(
        `When comparing object types, a custom specifyComparable must be defined in the constructor's options parameter.`
      );
    }

    return 0;
  };

  /**
   * The function returns the value of the _comparator property.
   * @returns The `_comparator` property is being returned.
   */
  get comparator() {
    return this._comparator;
  }

  protected _specifyComparable?: (key: K) => Comparable;

  /**
   * This function returns the value of the `_specifyComparable` property.
   * @returns The method `specifyComparable()` is being returned, which is a getter method for the
   * `_specifyComparable` property.
   */
  get specifyComparable() {
    return this._specifyComparable;
  }

  /**
   * The function sets the root of a tree-like structure and updates the parent property of the new
   * root.
   * @param {OptNode<NODE>} v - v is a parameter of type NODE or undefined.
   */
  protected override _setRoot(v: OptNode<NODE>) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  protected _compare(a: K, b: K) {
    return this._isReverse ? -this._comparator(a, b) : this._comparator(a, b);
  }

  override map(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: BSTOptions<MK, MV, MR>,
    thisArg?: any
  ): BST<MK, MV, MR> {
    const newTree = new BST<MK, MV, MR>([], options);
    let index = 0;
    for (const [key, value] of this) {
      newTree.add(callback.call(thisArg, key, value, index++, this));
    }
    return newTree;
  }
}
