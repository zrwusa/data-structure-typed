/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  BinaryTreeOptions,
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

/**
 * Represents a Node in a Binary Search Tree.
 *
 * @template K - The type of the key.
 * @template V - The type of the value.
 */
export class BSTNode<K = any, V = any> extends BinaryTreeNode<K, V> {
  override parent?: BSTNode<K, V> = undefined;

  /**
   * Creates an instance of BSTNode.
   * @remarks Time O(1), Space O(1)
   *
   * @param key - The key of the node.
   * @param [value] - The value associated with the key.
   */
  constructor(key: K, value?: V) {
    super(key, value);
  }

  override _left?: BSTNode<K, V> | null | undefined = undefined;

  /**
   * Gets the left child of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @returns The left child.
   */
  override get left(): BSTNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Sets the left child of the node and updates its parent reference.
   * @remarks Time O(1), Space O(1)
   *
   * @param v - The node to set as the left child.
   */
  override set left(v: BSTNode<K, V> | null | undefined) {
    if (v) v.parent = this;
    this._left = v;
  }

  override _right?: BSTNode<K, V> | null | undefined = undefined;

  /**
   * Gets the right child of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @returns The right child.
   */
  override get right(): BSTNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Sets the right child of the node and updates its parent reference.
   * @remarks Time O(1), Space O(1)
   *
   * @param v - The node to set as the right child.
   */
  override set right(v: BSTNode<K, V> | null | undefined) {
    if (v) v.parent = this;
    this._right = v;
  }
}

/**
 * Represents a Binary Search Tree (BST).
 * Keys are ordered, allowing for faster search operations compared to a standard Binary Tree.
 * @template K - The type of the key.
 * @template V - The type of the value.
 * @template R - The type of the raw data object (if using `toEntryFn`).
 *
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
export class BST<K = any, V = any, R = any> extends BinaryTree<K, V, R> implements IBinaryTree<K, V, R> {
  /**
   * Creates an instance of BST.
   * @remarks Time O(N log N) or O(N^2) depending on `isBalanceAdd` in `addMany` and input order. Space O(N).
   *
   * @param [keysNodesEntriesOrRaws=[]] - An iterable of items to add.
   * @param [options] - Configuration options for the BST, including comparator.
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

  /**
   * Gets the root node of the tree.
   * @remarks Time O(1)
   *
   * @returns The root node.
   */
  override get root(): OptNode<BSTNode<K, V>> {
    return this._root;
  }

  protected _isReverse: boolean = false;

  /**
   * Gets whether the tree's comparison logic is reversed.
   * @remarks Time O(1)
   *
   * @returns True if the tree is reversed (e.g., a max-heap logic).
   */
  get isReverse(): boolean {
    return this._isReverse;
  }

  /**
   * The default comparator function.
   * @remarks Time O(1) (or O(C) if `specifyComparable` is used, C is complexity of that function).
   */
  protected _comparator: Comparator<K> = (a: K, b: K): number => {
    if (isComparable(a) && isComparable(b)) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    }
    if (this._specifyComparable) {
      const va = this._specifyComparable(a);
      const vb = this._specifyComparable(b);
      if (va > vb) return 1;
      if (va < vb) return -1;
      return 0;
    }
    if (typeof a === 'object' || typeof b === 'object') {
      throw TypeError(
        `When comparing object types, a custom specifyComparable must be defined in the constructor's options.`
      );
    }
    return 0;
  };

  /**
   * Gets the comparator function used by the tree.
   * @remarks Time O(1)
   *
   * @returns The comparator function.
   */
  get comparator(): Comparator<K> {
    return this._comparator;
  }

  protected _specifyComparable?: (key: K) => Comparable;

  /**
   * Gets the function used to extract a comparable value from a complex key.
   * @remarks Time O(1)
   *
   * @returns The key-to-comparable conversion function.
   */
  get specifyComparable(): ((key: K) => Comparable) | undefined {
    return this._specifyComparable;
  }

  /**
   * (Protected) Creates a new BST node.
   * @remarks Time O(1), Space O(1)
   *
   * @param key - The key for the new node.
   * @param [value] - The value for the new node (used if not in Map mode).
   * @returns The newly created BSTNode.
   */
  override _createNode(key: K, value?: V): BSTNode<K, V> {
    return new BSTNode<K, V>(key, this._isMapMode ? undefined : value);
  }

  /**
   * Ensures the input is a node. If it's a key or entry, it searches for the node.
   * @remarks Time O(log N) (height of the tree), O(N) worst-case.
   *
   * @param keyNodeOrEntry - The item to resolve to a node.
   * @param [iterationType=this.iterationType] - The traversal method to use if searching.
   * @returns The resolved node, or undefined if not found.
   */
  override ensureNode(
    keyNodeOrEntry: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType: IterationType = this.iterationType
  ): OptNode<BSTNode<K, V>> {
    return super.ensureNode(keyNodeOrEntry, iterationType) ?? undefined;
  }

  /**
   * Checks if the given item is a `BSTNode` instance.
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeOrEntry - The item to check.
   * @returns True if it's a BSTNode, false otherwise.
   */
  override isNode(
    keyNodeOrEntry: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is BSTNode<K, V> {
    return keyNodeOrEntry instanceof BSTNode;
  }

  /**
   * Checks if the given key is valid (comparable).
   * @remarks Time O(1)
   *
   * @param key - The key to validate.
   * @returns True if the key is valid, false otherwise.
   */
  override isValidKey(key: any): key is K {
    return isComparable(key, this._specifyComparable !== undefined);
  }

  /**
   * Performs a Depth-First Search (DFS) traversal.
   * @remarks Time O(N), visits every node. Space O(log N) for the call/explicit stack. O(N) worst-case.
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on each node.
   * @param [pattern='IN'] - The traversal order ('IN', 'PRE', 'POST').
   * @param [onlyOne=false] - If true, stops after the first callback.
   * @param [startNode=this._root] - The node to start from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns An array of callback results.
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
   * Performs a Breadth-First Search (BFS) or Level-Order traversal.
   * @remarks Time O(N), visits every node. Space O(N) in the worst case for the queue.
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on each node.
   * @param [startNode=this._root] - The node to start from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns An array of callback results.
   */
  override bfs<C extends NodeCallback<BSTNode<K, V>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    return super.bfs(callback, startNode, iterationType, false);
  }

  /**
   * Returns a 2D array of nodes, grouped by level.
   * @remarks Time O(N), visits every node. Space O(N) for the result array and the queue/stack.
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on each node.
   * @param [startNode=this._root] - The node to start from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns A 2D array of callback results.
   */
  override listLevels<C extends NodeCallback<BSTNode<K, V>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[][] {
    return super.listLevels(callback, startNode, iterationType, false);
  }

  /**
   * Gets the first node matching a predicate.
   * @remarks Time O(log N) if searching by key, O(N) if searching by predicate. Space O(log N) or O(N).
   *
   * @param keyNodeEntryOrPredicate - The key, node, entry, or predicate function to search for.
   * @param [startNode=this._root] - The node to start the search from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns The first matching node, or undefined if not found.
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
   * Searches the tree for nodes matching a predicate, key, or range.
   * @remarks This is an optimized search for a BST. If searching by key or range, it prunes branches.
   * Time O(H + M) for key/range search (H=height, M=matches). O(N) for predicate search.
   * Space O(log N) for the stack.
   *
   * @template C - The type of the callback function.
   * @param keyNodeEntryOrPredicate - The key, node, entry, predicate, or range to search for.
   * @param [onlyOne=false] - If true, stops after finding the first match.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - A function to call on matching nodes.
   * @param [startNode=this._root] - The node to start the search from.
   * @param [iterationType=this.iterationType] - Whether to use 'RECURSIVE' or 'ITERATIVE' search.
   * @returns An array of results from the callback function for each matching node.
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

    if (isRange) {
      predicate = node => {
        if (!node) return false;
        return (keyNodeEntryOrPredicate as Range<K>).isInRange(node.key, this._comparator);
      };
    } else {
      predicate = this._ensurePredicate(keyNodeEntryOrPredicate);
    }

    // Optimization: Pruning logic
    const shouldVisitLeft = (cur: BSTNode<K, V> | null | undefined) => {
      if (!cur) return false;
      if (!this.isRealNode(cur.left)) return false;
      if (isRange) {
        // Range search: Only go left if the current key is >= the lower bound
        const range = keyNodeEntryOrPredicate as Range<K>;
        const leftS = this.isReverse ? range.high : range.low;
        const leftI = this.isReverse ? range.includeHigh : range.includeLow;
        return (leftI && this._compare(cur.key, leftS) >= 0) || (!leftI && this._compare(cur.key, leftS) > 0);
      }
      if (!isRange && !this._isPredicate(keyNodeEntryOrPredicate)) {
        // Key search: Only go left if current key > target key
        const benchmarkKey = this._extractKey(keyNodeEntryOrPredicate);
        return benchmarkKey !== null && benchmarkKey !== undefined && this._compare(cur.key, benchmarkKey) > 0;
      }
      return true; // Predicate search: must visit all
    };

    const shouldVisitRight = (cur: BSTNode<K, V> | null | undefined) => {
      if (!cur) return false;
      if (!this.isRealNode(cur.right)) return false;
      if (isRange) {
        // Range search: Only go right if current key <= upper bound
        const range = keyNodeEntryOrPredicate as Range<K>;
        const rightS = this.isReverse ? range.low : range.high;
        const rightI = this.isReverse ? range.includeLow : range.includeHigh;
        return (rightI && this._compare(cur.key, rightS) <= 0) || (!rightI && this._compare(cur.key, rightS) < 0);
      }
      if (!isRange && !this._isPredicate(keyNodeEntryOrPredicate)) {
        // Key search: Only go right if current key < target key
        const benchmarkKey = this._extractKey(keyNodeEntryOrPredicate);
        return benchmarkKey !== null && benchmarkKey !== undefined && this._compare(cur.key, benchmarkKey) < 0;
      }
      return true; // Predicate search: must visit all
    };

    return super._dfs(
      callback,
      'IN', // In-order is efficient for range/key search
      onlyOne,
      startNode,
      iterationType,
      false,
      shouldVisitLeft,
      shouldVisitRight,
      () => true, // shouldVisitRoot (always visit)
      cur => !!cur && predicate(cur) // shouldProcessRoot (only process if predicate matches)
    );
  }

  /**
   * Performs an optimized search for nodes within a given key range.
   * @remarks Time O(H + M), where H is tree height and M is the number of matches.
   *
   * @template C - The type of the callback function.
   * @param range - A `Range` object or a `[low, high]` tuple.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - A function to call on matching nodes.
   * @param [startNode=this._root] - The node to start the search from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns An array of callback results.
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
   * Adds a new node to the BST based on key comparison.
   * @remarks Time O(log N), where H is tree height. O(N) worst-case (unbalanced tree), O(log N) average. Space O(1).
   *
   * @param keyNodeOrEntry - The key, node, or entry to add.
   * @param [value] - The value, if providing just a key.
   * @returns True if the addition was successful, false otherwise.
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
        // Key exists, replace node
        this._replaceNode(current, newNode);
        if (this._isMapMode) this._setValue(current.key, newValue);
        return true;
      } else if (this._compare(current.key, newNode.key) > 0) {
        // Go left
        if (current.left === undefined) {
          current.left = newNode;
          if (this._isMapMode) this._setValue(newNode?.key, newValue);
          this._size++;
          return true;
        }
        if (current.left !== null) current = current.left;
      } else {
        // Go right
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
   * Adds multiple items to the tree.
   * @remarks If `isBalanceAdd` is true, sorts the input and builds a balanced tree. Time O(N log N) (due to sort and balanced add).
   * If false, adds items one by one. Time O(N * H), which is O(N^2) worst-case.
   * Space O(N) for sorting and recursion/iteration stack.
   *
   * @param keysNodesEntriesOrRaws - An iterable of items to add.
   * @param [values] - An optional parallel iterable of values.
   * @param [isBalanceAdd=true] - If true, builds a balanced tree from the items.
   * @param [iterationType=this.iterationType] - The traversal method for balanced add (recursive or iterative).
   * @returns An array of booleans indicating the success of each individual `add` operation.
   */
  override addMany(
    keysNodesEntriesOrRaws: Iterable<R | BTNRep<K, V, BSTNode<K, V>>>,
    values?: Iterable<V | undefined>,
    isBalanceAdd = true,
    iterationType: IterationType = this.iterationType
  ): boolean[] {
    const inserted: boolean[] = [];
    const valuesIterator: Iterator<V | undefined> | undefined = values?.[Symbol.iterator]();

    if (!isBalanceAdd) {
      // Standard O(N*H) insertion
      for (let kve of keysNodesEntriesOrRaws) {
        const val = valuesIterator?.next().value;
        if (this.isRaw(kve)) kve = this._toEntryFn!(kve);
        inserted.push(this.add(kve, val));
      }
      return inserted;
    }

    // Balanced O(N log N) insertion
    const realBTNExemplars: {
      key: R | K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined;
      value: V | undefined;
      orgIndex: number;
    }[] = [];

    let i = 0;
    for (const kve of keysNodesEntriesOrRaws) {
      realBTNExemplars.push({ key: kve, value: valuesIterator?.next().value, orgIndex: i++ });
    }

    // Sort items by key
    const sorted = realBTNExemplars.sort(({ key: a }, { key: b }) => {
      let keyA: K | undefined | null, keyB: K | undefined | null;
      if (this.isRaw(a)) keyA = this._toEntryFn!(a)[0];
      else if (this.isEntry(a)) keyA = a[0];
      else if (this.isRealNode(a)) keyA = a.key;
      else keyA = a as K;

      if (this.isRaw(b)) keyB = this._toEntryFn!(b)[0];
      else if (this.isEntry(b)) keyB = b[0];
      else if (this.isRealNode(b)) keyB = b.key;
      else keyB = b as K;

      if (keyA != null && keyB != null) return this._compare(keyA, keyB);
      return 0;
    });

    // Recursive balanced build
    const _dfs = (arr: typeof realBTNExemplars) => {
      if (arr.length === 0) return;
      const mid = Math.floor((arr.length - 1) / 2);
      const { key, value, orgIndex } = arr[mid];
      if (this.isRaw(key)) {
        const entry = this._toEntryFn!(key);
        inserted[orgIndex] = this.add(entry);
      } else {
        inserted[orgIndex] = this.add(key, value);
      }
      _dfs(arr.slice(0, mid));
      _dfs(arr.slice(mid + 1));
    };

    // Iterative balanced build
    const _iterate = () => {
      const n = sorted.length;
      const stack: Array<[number, number]> = [[0, n - 1]];
      while (stack.length > 0) {
        const popped = stack.pop();
        if (!popped) continue;
        const [l, r] = popped;
        if (l > r) continue;
        const m = l + Math.floor((r - l) / 2);
        const { key, value, orgIndex } = sorted[m];
        if (this.isRaw(key)) {
          const entry = this._toEntryFn!(key);
          inserted[orgIndex] = this.add(entry);
        } else {
          inserted[orgIndex] = this.add(key, value);
        }
        stack.push([m + 1, r]);
        stack.push([l, m - 1]);
      }
    };

    if (iterationType === 'RECURSIVE') _dfs(sorted);
    else _iterate();

    return inserted;
  }

  /**
   * Traverses the tree and returns nodes that are lesser or greater than a target node.
   * @remarks Time O(N), as it performs a full traversal. Space O(log N) or O(N).
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on matching nodes.
   * @param [lesserOrGreater=-1] - -1 for lesser, 1 for greater, 0 for equal.
   * @param [targetNode=this._root] - The node to compare against.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns An array of callback results.
   */
  lesserOrGreaterTraverse<C extends NodeCallback<BSTNode<K, V>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    lesserOrGreater: CP = -1,
    targetNode: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    const targetNodeEnsured = this.ensureNode(targetNode);
    const ans: ReturnType<NodeCallback<BSTNode<K, V>>>[] = [];
    if (!this._root || !targetNodeEnsured) return ans;

    const targetKey = targetNodeEnsured.key;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: BSTNode<K, V>) => {
        const compared = this._compare(cur.key, targetKey);
        if (Math.sign(compared) == lesserOrGreater) ans.push(callback(cur));

        if (this.isRealNode(cur.left)) dfs(cur.left);
        if (this.isRealNode(cur.right)) dfs(cur.right);
      };
      dfs(this._root);
      return ans;
    } else {
      const queue = new Queue<BSTNode<K, V>>([this._root]);
      while (queue.length > 0) {
        const cur = queue.shift();
        if (this.isRealNode(cur)) {
          const compared = this._compare(cur.key, targetKey);
          if (Math.sign(compared) == lesserOrGreater) ans.push(callback(cur));
          if (this.isRealNode(cur.left)) queue.push(cur.left);
          if (this.isRealNode(cur.right)) queue.push(cur.right);
        }
      }
      return ans;
    }
  }

  /**
   * Rebuilds the tree to be perfectly balanced.
   * @remarks Time O(N) (O(N) for DFS, O(N) for sorted build). Space O(N) for node array and recursion stack.
   *
   * @param [iterationType=this.iterationType] - The traversal method for the initial node export.
   * @returns True if successful, false if the tree was empty.
   */
  perfectlyBalance(iterationType: IterationType = this.iterationType): boolean {
    const nodes = this.dfs(node => node, 'IN', false, this._root, iterationType);
    const n = nodes.length;
    this._clearNodes();
    if (n === 0) return false;

    // Build balanced tree from sorted array
    const build = (l: number, r: number, parent?: BSTNode<K, V>): BSTNode<K, V> | undefined => {
      if (l > r) return undefined;
      const m = l + ((r - l) >> 1);
      const root = nodes[m]! as BSTNode<K, V>;
      const leftChild = build(l, m - 1, root);
      const rightChild = build(m + 1, r, root);
      root.left = leftChild;
      root.right = rightChild;
      root.parent = parent;
      return root;
    };

    const newRoot = build(0, n - 1, undefined);
    this._setRoot(newRoot);
    this._size = n;
    return true;
  }

  /**
   * Checks if the tree meets the AVL balance condition (height difference <= 1).
   * @remarks Time O(N), as it must visit every node to compute height. Space O(log N) for recursion or O(N) for iterative map.
   *
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns True if the tree is AVL balanced, false otherwise.
   */
  isAVLBalanced(iterationType: IterationType = this.iterationType): boolean {
    if (!this._root) return true;
    let balanced = true;

    if (iterationType === 'RECURSIVE') {
      // Recursive height check
      const _height = (cur: BSTNode<K, V> | null | undefined): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left);
        const rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this._root);
    } else {
      // Iterative post-order height check
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
   * Creates a new BST by mapping each [key, value] pair to a new entry.
   * @remarks Time O(N * H), where N is nodes in this tree, and H is height of the new tree during insertion.
   * Space O(N) for the new tree.
   *
   * @template MK - New key type.
   * @template MV - New value type.
   * @template MR - New raw type.
   * @param callback - A function to map each [key, value] pair.
   * @param [options] - Options for the new BST.
   * @param [thisArg] - `this` context for the callback.
   * @returns A new, mapped BST.
   */
  override map<MK = K, MV = V, MR = any>(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: Partial<BinaryTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): BST<MK, MV, MR> {
    const out = this._createLike<MK, MV, MR>([], options);
    let index = 0;
    // Iterates in-order
    for (const [key, value] of this) {
      out.add(callback.call(thisArg, key, value, index++, this));
    }
    return out;
  }

  /**
   * Deletes the first node found that satisfies the predicate.
   * @remarks Performs an in-order traversal. Time O(N) worst-case (O(log N) to find + O(log N) to delete). Space O(log N) for stack.
   *
   * @param predicate - A function to test each [key, value] pair.
   * @returns True if a node was deleted, false otherwise.
   */
  deleteWhere(predicate: (key: K, value: V | undefined, index: number, tree: this) => boolean): boolean {
    const stack: Array<BSTNode<K, V> | null | undefined> = [];
    let cur = this._root as BSTNode<K, V> | null | undefined;
    let index = 0;

    // In-order traversal to find the node
    while (stack.length > 0 || cur !== undefined) {
      while (cur !== undefined && cur !== null) {
        stack.push(cur);
        cur = cur.left as BSTNode<K, V> | null | undefined;
      }
      const node = stack.pop() as BSTNode<K, V> | undefined;
      if (!node) break;

      const key = node.key as K;
      const val = node.value as V | undefined;
      if (predicate(key, val, index++, this)) {
        return this._deleteByKey(key); // Found, now delete
      }
      cur = node.right as BSTNode<K, V> | null | undefined;
    }
    return false;
  }

  /**
   * (Protected) Creates a new, empty instance of the same BST constructor.
   * @remarks Time O(1)
   *
   * @template TK, TV, TR - Generic types for the new instance.
   * @param [options] - Options for the new BST.
   * @returns A new, empty BST.
   */
  protected override _createInstance<TK = K, TV = V, TR = R>(options?: Partial<BSTOptions<TK, TV, TR>>): this {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | BSTNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: BSTOptions<TK, TV, TR>
    ) => BST<TK, TV, TR>;
    return new Ctor([], { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) }) as unknown as this;
  }

  /**
   * (Protected) Creates a new instance of the same BST constructor, potentially with different generic types.
   * @remarks Time O(N log N) or O(N^2) (from constructor) due to processing the iterable.
   *
   * @template TK, TV, TR - Generic types for the new instance.
   * @param [iter=[]] - An iterable to populate the new BST.
   * @param [options] - Options for the new BST.
   * @returns A new BST.
   */
  protected override _createLike<TK = K, TV = V, TR = R>(
    iter: Iterable<TK | BSTNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR> = [],
    options?: Partial<BSTOptions<TK, TV, TR>>
  ): BST<TK, TV, TR> {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | BSTNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: BSTOptions<TK, TV, TR>
    ) => BST<TK, TV, TR>;
    return new Ctor(iter, { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) });
  }

  /**
   * (Protected) Snapshots the current BST's configuration options.
   * @remarks Time O(1)
   *
   * @template TK, TV, TR - Generic types for the options.
   * @returns The options object.
   */
  protected override _snapshotOptions<TK = K, TV = V, TR = R>(): BSTOptions<TK, TV, TR> {
    return {
      ...super._snapshotOptions<TK, TV, TR>(),
      specifyComparable: this.specifyComparable as BSTOptions<TK, TV, TR>['specifyComparable'],
      isReverse: this.isReverse as BSTOptions<TK, TV, TR>['isReverse']
    };
  }

  /**
   * (Protected) Converts a key, node, or entry into a standardized [node, value] tuple.
   * @remarks Time O(1)
   *
   * @param keyNodeOrEntry - The input item.
   * @param [value] - An optional value (used if input is just a key).
   * @returns A tuple of [node, value].
   */
  protected override _keyValueNodeOrEntryToNodeAndValue(
    keyNodeOrEntry: K | BSTNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): [OptNode<BSTNode<K, V>>, V | undefined] {
    const [node, entryValue] = super._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value);
    if (node === null) return [undefined, undefined]; // BST handles null differently (as undefined)
    return [node, value ?? entryValue];
  }

  /**
   * (Protected) Sets the root node and clears its parent reference.
   * @remarks Time O(1)
   *
   * @param v - The node to set as root.
   */
  protected override _setRoot(v: OptNode<BSTNode<K, V>>) {
    if (v) v.parent = undefined;
    this._root = v;
  }

  /**
   * (Protected) Compares two keys using the tree's comparator and reverse setting.
   * @remarks Time O(1) (or O(C) if `specifyComparable` is used).
   *
   * @param a - The first key.
   * @param b - The second key.
   * @returns A number (1, -1, or 0) representing the comparison.
   */
  protected _compare(a: K, b: K) {
    return this._isReverse ? -this._comparator(a, b) : this._comparator(a, b);
  }

  /**
   * (Private) Deletes a node by its key.
   * @remarks Standard BST deletion algorithm. Time O(log N), O(N) worst-case. Space O(1).
   *
   * @param key - The key of the node to delete.
   * @returns True if the node was found and deleted, false otherwise.
   */
  private _deleteByKey(key: K): boolean {
    let node = this._root as BSTNode<K, V> | undefined;

    // 1. Find the node
    while (node) {
      const cmp = this._compare(node.key, key);
      if (cmp === 0) break;
      node = cmp > 0 ? (node.left as BSTNode<K, V> | undefined) : (node.right as BSTNode<K, V> | undefined);
    }
    if (!node) return false; // Not found

    // Helper to replace node `u` with node `v`
    const transplant = (u: BSTNode<K, V> | undefined, v: BSTNode<K, V> | undefined) => {
      const p = u?.parent as BSTNode<K, V> | undefined;
      if (!p) {
        this._setRoot(v);
      } else if (p.left === u) {
        p.left = v;
      } else {
        p.right = v;
      }
      if (v) v.parent = p;
    };

    // Helper to find the minimum node in a subtree
    const minNode = (x: BSTNode<K, V> | undefined): BSTNode<K, V> | undefined => {
      if (!x) return undefined;
      while (x.left !== undefined && x.left !== null) x = x.left as BSTNode<K, V>;
      return x;
    };

    // 2. Perform deletion
    if (node.left === undefined) {
      // Case 1: No left child
      transplant(node, node.right as BSTNode<K, V> | undefined);
    } else if (node.right === undefined) {
      // Case 2: No right child
      transplant(node, node.left as BSTNode<K, V> | undefined);
    } else {
      // Case 3: Two children
      const succ = minNode(node.right as BSTNode<K, V> | undefined)!; // Find successor
      if (succ.parent !== node) {
        transplant(succ, succ.right as BSTNode<K, V> | undefined);
        succ.right = node.right as BSTNode<K, V> | undefined;
        if (succ.right) (succ.right as BSTNode<K, V>).parent = succ;
      }
      transplant(node, succ);
      succ.left = node.left as BSTNode<K, V> | undefined;
      if (succ.left) (succ.left as BSTNode<K, V>).parent = succ;
    }

    this._size = Math.max(0, ((this as any)._size ?? 0) - 1);
    return true;
  }
}
