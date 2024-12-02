/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
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
  OptNode
} from '../../types';
import { BinaryTree, BinaryTreeNode } from './binary-tree';
import { IBinaryTree } from '../../interfaces';
import { Queue } from '../queue';
import { isComparable } from '../../utils';
import { Range } from '../../common';

export class BSTNode<K = any, V = any> extends BinaryTreeNode<K, V> {
  override parent?: BSTNode<K, V> = undefined;

  /**
   * This TypeScript constructor function initializes an instance with a key and an optional value.
   * @param {K} key - The `key` parameter is typically used to uniquely identify an object or element
   * within a data structure. It serves as a reference or identifier for accessing or manipulating the
   * associated value.
   * @param {V} [value] - The `value` parameter in the constructor is optional, meaning it does not
   * have to be provided when creating an instance of the class. If a value is not provided, it will
   * default to `undefined`.
   */
  constructor(key: K, value?: V) {
    super(key, value);
  }

  override _left?: BSTNode<K, V> | null | undefined = undefined;

  override get left(): BSTNode<K, V> | null | undefined {
    return this._left;
  }

  override set left(v: BSTNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: BSTNode<K, V> | null | undefined = undefined;

  override get right(): BSTNode<K, V> | null | undefined {
    return this._right;
  }

  override set right(v: BSTNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
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
 *     console.log(bst.search(new Range(5, 10))); // [5, 7, 10]
 *     console.log(bst.rangeSearch([4, 12], node => node.key.toString())); // ['5', '7', '10', '12']
 *     console.log(bst.search(new Range(4, 12, true, false))); // [5, 7, 10]
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
export class BST<K = any, V = any, R = object, MK = any, MV = any, MR = object>
  extends BinaryTree<K, V, R, MK, MV, MR>
  implements IBinaryTree<K, V, R, MK, MV, MR>
{
  /**
   * This TypeScript constructor initializes a binary search tree with optional options and adds
   * elements if provided.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter in the constructor is an
   * iterable that can contain elements of type `K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  ` or `R`. It is used to
   * initialize the binary search tree with keys, nodes, entries, or raw data.
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    > = [],
    options?: BSTOptions<K, V, R>
  ) {
    super([], options);

    if (options) {
      const { specifyComparable, isReverse } = options;
      if (typeof specifyComparable === 'function') this._specifyComparable = specifyComparable;
      if (isReverse !== undefined) this._isReverse = isReverse;
    }

    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
  }

  protected override _root?: BSTNode<K, V> = undefined;

  override get root(): OptNode<BSTNode<K, V>> {
    return this._root;
  }

  protected _isReverse: boolean = false;

  get isReverse(): boolean {
    return this._isReverse;
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

  get comparator() {
    return this._comparator;
  }

  protected _specifyComparable?: (key: K) => Comparable;

  get specifyComparable() {
    return this._specifyComparable;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function creates a new BSTNode with the given key and value and returns it.
   * @param {K} key - The key parameter is of type K, which represents the type of the key for the node
   * being created.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It represents the
   * value associated with the key in the node being created.
   * @returns The method is returning a new instance of the BSTNode class, casted as the BSTNode<K, V> type.
   */
  override createNode(key: K, value?: V): BSTNode<K, V> {
    return new BSTNode<K, V>(key, this._isMapMode ? undefined : value);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function creates a new binary search tree with the specified options.
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the `createTree` method. It accepts a partial `BSTOptions` object, which has the
   * following properties:
   * @returns a new instance of the BST class with the provided options.
   */
  override createTree(options?: BSTOptions<K, V, R>) {
    return new BST<K, V, R, MK, MV, MR>([], {
      iterationType: this.iterationType,
      isMapMode: this._isMapMode,
      specifyComparable: this._specifyComparable,
      toEntryFn: this._toEntryFn,
      isReverse: this._isReverse,
      ...options
    });
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function ensures the existence of a node in a data structure and returns it, or undefined if
   * it doesn't exist.
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can accept a value of type `R`, which represents the key, node,
   * entry, or raw element that needs to be ensured in the tree.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter is an optional
   * parameter that specifies the type of iteration to be used when ensuring a node. It has a default
   * value of `'ITERATIVE'`.
   * @returns The method is returning either the node that was ensured or `undefined` if the node could
   * not be ensured.
   */
  override ensureNode(
    keyNodeOrEntry: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType: IterationType = this.iterationType
  ): OptNode<BSTNode<K, V>> {
    return super.ensureNode(keyNodeOrEntry, iterationType) ?? undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if the input is an instance of the BSTNode class.
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can be of type `R` or `K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  `.
   * @returns a boolean value indicating whether the input parameter `keyNodeOrEntry` is
   * an instance of the `BSTNode` class.
   */
  override isNode(
    keyNodeOrEntry: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is BSTNode<K, V> {
    return keyNodeOrEntry instanceof BSTNode;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "override isValidKey" checks if a key is comparable based on a given comparator.
   * @param {any} key - The `key` parameter is a value that will be checked to determine if it is of
   * type `K`.
   * @returns The `override isValidKey(key: any): key is K` function is returning a boolean value based on
   * the result of the `isComparable` function with the condition `this._compare !==
   * this._DEFAULT_COMPARATOR`.
   */
  override isValidKey(key: any): key is K {
    return isComparable(key, this._specifyComparable !== undefined);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The `add` function in TypeScript adds a new node to a binary search tree based on the key value.
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can accept a value of type `R` or `K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  `.
   * @param {V} [value] - The `value` parameter is an optional value that can be associated with the
   * key in the binary search tree. If provided, it will be stored in the node along with the key.
   * @returns a boolean value.
   */
  override add(
    keyNodeOrEntry: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): boolean {
    const [newNode, newValue] = this._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value);
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
    keysNodesEntriesOrRaws: Iterable<R | BTNRep<K, V, BSTNode<K, V>>>,
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
      for (let kve of keysNodesEntriesOrRaws) {
        const value = valuesIterator?.next().value;
        if (this.isRaw(kve)) kve = this._toEntryFn!(kve);
        inserted.push(this.add(kve, value));
      }
      return inserted;
    }

    const realBTNExemplars: {
      key: R | K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined;
      value: V | undefined;
      orgIndex: number;
    }[] = [];

    let i = 0;
    for (const kve of keysNodesEntriesOrRaws) {
      realBTNExemplars.push({ key: kve, value: valuesIterator?.next().value, orgIndex: i });
      i++;
    }

    let sorted: {
      key: R | K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined;
      value: V | undefined;
      orgIndex: number;
    }[] = [];

    sorted = realBTNExemplars.sort(({ key: a }, { key: b }) => {
      let keyA: K | undefined | null, keyB: K | undefined | null;
      if (this.isRaw(a)) keyA = this._toEntryFn!(a)[0];
      else if (this.isEntry(a)) keyA = a[0];
      else if (this.isRealNode(a)) keyA = a.key;
      else {
        keyA = a as K;
      }

      if (this.isRaw(b)) keyB = this._toEntryFn!(b)[0];
      else if (this.isEntry(b)) keyB = b[0];
      else if (this.isRealNode(b)) keyB = b.key;
      else {
        keyB = b as K;
      }

      if (keyA !== undefined && keyA !== null && keyB !== undefined && keyB !== null) {
        return this._compare(keyA, keyB);
      }
      return 0;
    });

    const _dfs = (
      arr: {
        key: R | K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined;
        value: V | undefined;
        orgIndex: number;
      }[]
    ) => {
      if (arr.length === 0) return;

      const mid = Math.floor((arr.length - 1) / 2);
      const { key, value } = arr[mid];
      const { orgIndex } = arr[mid];
      if (this.isRaw(key)) {
        const entry = this._toEntryFn!(key);
        inserted[orgIndex] = this.add(entry);
      } else {
        inserted[orgIndex] = this.add(key, value);
      }
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
            const { key, value } = sorted[m];
            const { orgIndex } = sorted[m];
            if (this.isRaw(key)) {
              const entry = this._toEntryFn!(key);
              inserted[orgIndex] = this.add(entry);
            } else {
              inserted[orgIndex] = this.add(key, value);
            }
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
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined   | NodePredicate<BSTNode<K, V>>} keyNodeEntryOrPredicate - The
   * `keyNodeEntryOrPredicate` parameter in the `override search` method can accept one of the
   * following types:
   * @param [onlyOne=false] - The `onlyOne` parameter is a boolean flag that determines whether the
   * search should stop after finding the first matching node. If `onlyOne` is set to `true`, the
   * search will return as soon as a matching node is found. If `onlyOne` is set to `false`, the
   * @param {C} callback - The `callback` parameter in the `override search` function is a function
   * that will be called on each node that matches the search criteria. It is of type `C`, which
   * extends `NodeCallback<BSTNode<K, V> | null>`. The callback function should accept a node of type `BSTNode<K, V>` as its
   * argument and
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } startNode - The `startNode` parameter in the `override search`
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
  override search<C extends NodeCallback<BSTNode<K, V>>>(
    keyNodeEntryOrPredicate:
      | K
      | BSTNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BSTNode<K, V>>
      | Range<K>,
    onlyOne = false,
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    if (keyNodeEntryOrPredicate === undefined) return [];
    if (keyNodeEntryOrPredicate === null) return [];
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    let predicate: NodePredicate<BSTNode<K, V>>;

    const isRange = this.isRange(keyNodeEntryOrPredicate);
    // Set predicate based on parameter type
    if (isRange) {
      predicate = node => {
        if (!node) return false;
        return keyNodeEntryOrPredicate.isInRange(node.key, this._comparator);
      };
    } else {
      predicate = this._ensurePredicate(keyNodeEntryOrPredicate);
    }
    const shouldVisitLeft = (cur: BSTNode<K, V> | null | undefined) => {
      if (!cur) return false;
      if (!this.isRealNode(cur.left)) return false;
      if (isRange) {
        const range = keyNodeEntryOrPredicate;
        const leftS = this.isReverse ? range.high : range.low;
        const leftI = this.isReverse ? range.includeHigh : range.includeLow;
        return (leftI && this._compare(cur.key, leftS) >= 0) || (!leftI && this._compare(cur.key, leftS) > 0);
      }
      if (!isRange && !this._isPredicate(keyNodeEntryOrPredicate)) {
        const benchmarkKey = this._extractKey(keyNodeEntryOrPredicate);
        return benchmarkKey !== null && benchmarkKey !== undefined && this._compare(cur.key, benchmarkKey) > 0;
      }
      return true;
    };

    const shouldVisitRight = (cur: BSTNode<K, V> | null | undefined) => {
      if (!cur) return false;
      if (!this.isRealNode(cur.right)) return false;
      if (isRange) {
        const range = keyNodeEntryOrPredicate;
        const rightS = this.isReverse ? range.low : range.high;
        const rightI = this.isReverse ? range.includeLow : range.includeLow;

        return (rightI && this._compare(cur.key, rightS) <= 0) || (!rightI && this._compare(cur.key, rightS) < 0);
      }
      if (!isRange && !this._isPredicate(keyNodeEntryOrPredicate)) {
        const benchmarkKey = this._extractKey(keyNodeEntryOrPredicate);
        return benchmarkKey !== null && benchmarkKey !== undefined && this._compare(cur.key, benchmarkKey) < 0;
      }
      return true;
    };
    return super._dfs(
      callback,
      'IN',
      onlyOne,
      startNode,
      iterationType,
      false,
      shouldVisitLeft,
      shouldVisitRight,
      () => true,
      cur => {
        if (cur) return predicate(cur);
        return false;
      }
    );
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(k + log n)
   *
   * The `rangeSearch` function searches for nodes within a specified range in a binary search tree.
   * @param {Range<K> | [K, K]} range - The `range` parameter in the `rangeSearch` function can be
   * either a `Range` object or an array of two elements representing the range boundaries.
   * @param {C} callback - The `callback` parameter in the `rangeSearch` function is a callback
   * function that is used to process each node that is found within the specified range during the
   * search operation. It is of type `NodeCallback<BSTNode<K, V> | null>`, where `BSTNode<K, V>` is the type of nodes in the
   * data structure.
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } startNode - The `startNode` parameter in the `rangeSearch`
   * function represents the node from which the search for nodes within the specified range will
   * begin. It is the starting point for the range search operation.
   * @param {IterationType} iterationType - The `iterationType` parameter in the `rangeSearch` function
   * is used to specify the type of iteration to be performed during the search operation. It has a
   * default value of `this.iterationType`, which suggests that it is likely a property of the class or
   * object that the `rangeSearch`
   * @returns The `rangeSearch` function is returning the result of calling the `search` method with
   * the specified parameters.
   */
  rangeSearch<C extends NodeCallback<BSTNode<K, V>>>(
    range: Range<K> | [K, K],
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ) {
    const searchRange: Range<K> = range instanceof Range ? range : new Range(range[0], range[1]);
    return this.search(searchRange, false, callback, startNode, iterationType);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * This function retrieves a node based on a given keyNodeEntryOrPredicate within a binary search tree structure.
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined   | NodePredicate<BSTNode<K, V>>} keyNodeEntryOrPredicate - The `keyNodeEntryOrPredicate`
   * parameter can be of type `K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  `, `R`, or `NodePredicate<BSTNode<K, V>>`.
   * @param {BSTNOptKeyOrNode<K, BSTNode<K, V>>} startNode - The `startNode` parameter in the `getNode` method
   * is used to specify the starting point for searching nodes in the binary search tree. If no
   * specific starting point is provided, the default value is set to `this._root`, which is the root
   * node of the binary search tree.
   * @param {IterationType} iterationType - The `iterationType` parameter in the `getNode` method is a
   * parameter that specifies the type of iteration to be used. It has a default value of
   * `this.iterationType`, which means it will use the iteration type defined in the class instance if
   * no value is provided when calling the method.
   * @returns The `getNode` method is returning an optional binary search tree node (`OptNode<BSTNode<K, V>>`).
   * It is using the `getNodes` method to find the node based on the provided keyNodeEntryOrPredicate, beginning at
   * the specified root node (`startNode`) and using the specified iteration type. The method then
   * returns the first node found or `undefined` if no node is found.
   */
  override getNode(
    keyNodeEntryOrPredicate:
      | K
      | BSTNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BSTNode<K, V>>,
    startNode: BSTNOptKeyOrNode<K, BSTNode<K, V>> = this._root,
    iterationType: IterationType = this.iterationType
  ): OptNode<BSTNode<K, V>> {
    return this.getNodes(keyNodeEntryOrPredicate, true, startNode, iterationType)[0] ?? undefined;
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function `dfs` in TypeScript overrides the base class method with default parameters and
   * returns the result of the super class `dfs` method.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * visited during the Depth-First Search traversal. It is a generic type `C` that extends the
   * `NodeCallback` interface for `BSTNode<K, V>`. The default value for `callback` is `this._
   * @param {DFSOrderPattern} [pattern=IN] - The `pattern` parameter in the `override dfs` method
   * specifies the order in which the Depth-First Search (DFS) traversal should be performed on the
   * Binary Search Tree (BST). The possible values for the `pattern` parameter are:
   * @param {boolean} [onlyOne=false] - The `onlyOne` parameter in the `override dfs` method is a
   * boolean flag that indicates whether you want to stop the depth-first search traversal after
   * finding the first matching node or continue searching for all matching nodes. If `onlyOne` is set
   * to `true`, the traversal will stop after finding
   * @param {K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined} startNode -
   * The `startNode` parameter in the `override dfs` method can be one of the following types:
   * @param {IterationType} iterationType - The `iterationType` parameter in the `override dfs` method
   * specifies the type of iteration to be performed during the Depth-First Search (DFS) traversal of a
   * Binary Search Tree (BST). It is used to determine the order in which nodes are visited during the
   * traversal. The possible values for `
   * @returns The `override` function is returning the result of calling the `dfs` method from the
   * superclass, with the provided arguments `callback`, `pattern`, `onlyOne`, `startNode`, and
   * `iterationType`. The return type is an array of the return type of the callback function `C`.
   */
  override dfs<C extends NodeCallback<BSTNode<K, V>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    onlyOne: boolean = false,
    startNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    return super.dfs(callback, pattern, onlyOne, startNode, iterationType);
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
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } startNode - The `startNode` parameter is the starting
   * point for the breadth-first search. It can be either a root node, a key-value pair, or an entry
   * object. If no value is provided, the default value is the root of the tree.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed during the breadth-first search (BFS) traversal. It can have one of
   * the following values:
   * @returns an array of the return type of the callback function.
   */
  override bfs<C extends NodeCallback<BSTNode<K, V>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
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
   * `NodeCallback<BSTNode<K, V> | null>`. It represents a callback function that will be called for each node in the
   * tree during the iteration process.
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } startNode - The `startNode` parameter is the starting
   * point for listing the levels of the binary tree. It can be either a root node of the tree, a
   * key-value pair representing a node in the tree, or a key representing a node in the tree. If no
   * value is provided, the root of
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed on the tree. It can have one of the following values:
   * @returns The method is returning a two-dimensional array of the return type of the callback
   * function.
   */
  override listLevels<C extends NodeCallback<BSTNode<K, V>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
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
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } targetNode - The `targetNode` parameter is the node in
   * the binary tree that you want to start traversing from. It can be specified either by providing
   * the key of the node, the node itself, or an entry containing the key and value of the node. If no
   * `targetNode` is provided,
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * traversal to be performed on the binary tree. It can have two possible values:
   * @returns The function `lesserOrGreaterTraverse` returns an array of values of type
   * `ReturnType<C>`, which is the return type of the callback function passed as an argument.
   */
  lesserOrGreaterTraverse<C extends NodeCallback<BSTNode<K, V>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    lesserOrGreater: CP = -1,
    targetNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    const targetNodeEnsured = this.ensureNode(targetNode);
    const ans: ReturnType<NodeCallback<BSTNode<K, V>>>[] = [];
    if (!this._root) return ans;
    if (!targetNodeEnsured) return ans;

    const targetKey = targetNodeEnsured.key;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: BSTNode<K, V>) => {
        const compared = this._compare(cur.key, targetKey);
        if (Math.sign(compared) === lesserOrGreater) ans.push(callback(cur));
        // TODO here can be optimized to O(log n)
        if (this.isRealNode(cur.left)) dfs(cur.left);
        if (this.isRealNode(cur.right)) dfs(cur.right);
      };

      dfs(this._root);
      return ans;
    } else {
      const queue = new Queue<BSTNode<K, V>>([this._root]);
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
        if (this._isMapMode && midNode !== null) this.add(midNode.key);
        else if (midNode !== null) this.add([midNode.key, midNode.value]);
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
            if (this._isMapMode && midNode !== null) this.add(midNode.key);
            else if (midNode !== null) this.add([midNode.key, midNode.value]);
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
      const _height = (cur: BSTNode<K, V> | null | undefined): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left),
          rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this._root);
    } else {
      const stack: BSTNode<K, V>[] = [];
      let node: OptNode<BSTNode<K, V>> = this._root,
        last: OptNode<BSTNode<K, V>> = undefined;
      const depths: Map<BSTNode<K, V>, number> = new Map();

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

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `map` function in TypeScript overrides the default map behavior for a binary search tree by
   * applying a callback function to each entry and creating a new tree with the results.
   * @param callback - A function that will be called for each entry in the BST. It takes four
   * arguments: the key, the value (which can be undefined), the index of the entry, and a reference to
   * the BST itself.
   * @param [options] - The `options` parameter in the `override map` method is of type `BSTOptions<MK,
   * MV, MR>`. It is an optional parameter that allows you to specify additional options for the Binary
   * Search Tree (BST) being created in the `map` method. These options could include configuration
   * @param {any} [thisArg] - The `thisArg` parameter in the `override map` method is used to specify
   * the value of `this` that should be used when executing the `callback` function. It allows you to
   * set the context or scope in which the callback function will be called. This can be useful when
   * you want
   * @returns The `map` method is returning a new Binary Search Tree (`BST`) instance with the entries
   * transformed by the provided callback function.
   */
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

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function `clone` overrides the default cloning behavior to create a deep copy of a tree
   * structure.
   * @returns The `cloned` object is being returned.
   */
  override clone() {
    const cloned = this.createTree();
    this._clone(cloned);
    return cloned;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function overrides a method and converts a key, value pair or entry or raw element to a node.
   * @param {K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  } keyNodeOrEntry - A variable that can be of
   * type R or K |  BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined  . It represents either a key, a node, an entry, or a raw
   * element.
   * @param {V} [value] - The `value` parameter is an optional value of type `V`. It represents the
   * value associated with a key in a key-value pair.
   * @returns either a BSTNode<K, V> object or undefined.
   */
  protected override _keyValueNodeOrEntryToNodeAndValue(
    keyNodeOrEntry: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): [OptNode<BSTNode<K, V>>, V | undefined] {
    const [node, entryValue] = super._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value);
    if (node === null) return [undefined, undefined];
    return [node, value ?? entryValue];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function sets the root of a tree-like structure and updates the parent property of the new
   * root.
   * @param {OptNode<BSTNode<K, V>>} v - v is a parameter of type BSTNode<K, V> or undefined.
   */
  protected override _setRoot(v: OptNode<BSTNode<K, V>>) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The _compare function compares two values using a specified comparator function and optionally
   * reverses the result.
   * @param {K} a - The parameter `a` is of type `K`, which is used as an input for comparison in the
   * `_compare` method.
   * @param {K} b - The parameter `b` in the `_compare` function is of type `K`.
   * @returns The `_compare` method is returning the result of the ternary expression. If `_isReverse`
   * is true, it returns the negation of the result of calling the `_comparator` function with
   * arguments `a` and `b`. If `_isReverse` is false, it returns the result of calling the
   * `_comparator` function with arguments `a` and `b`.
   */
  protected _compare(a: K, b: K) {
    return this._isReverse ? -this._comparator(a, b) : this._comparator(a, b);
  }
}
