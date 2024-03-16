/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  BSTNested,
  BSTNKeyOrNode,
  BSTNodeNested,
  BSTOptions,
  BTNCallback,
  BTNKeyOrNodeOrEntry,
  BTNPureKeyOrNodeOrEntry,
  Comparator,
  CP,
  DFSOrderPattern,
  IterationType,
  OptBSTN
} from '../../types';
import { BTNEntry } from '../../types';
import { BinaryTree, BinaryTreeNode } from './binary-tree';
import { IBinaryTree } from '../../interfaces';
import { Queue } from '../queue';

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

  protected override _left?: NODE;

  /**
   * The function returns the value of the `_left` property.
   * @returns The `_left` property of the current object is being returned.
   */
  override get left(): OptBSTN<NODE> {
    return this._left;
  }

  /**
   * The function sets the left child of a node and updates the parent reference of the child.
   * @param {OptBSTN<NODE>} v - The parameter `v` is of type `OptBSTN<NODE>`. It can either be an
   * instance of the `NODE` class or `undefined`.
   */
  override set left(v: OptBSTN<NODE>) {
    if (v) {
      v.parent = this as unknown as NODE;
    }
    this._left = v;
  }

  protected override _right?: NODE;

  /**
   * The function returns the right node of a binary tree or undefined if there is no right node.
   * @returns The method is returning the value of the `_right` property, which is of type `NODE` or
   * `undefined`.
   */
  override get right(): OptBSTN<NODE> {
    return this._right;
  }

  /**
   * The function sets the right child of a node and updates the parent reference of the child.
   * @param {OptBSTN<NODE>} v - The parameter `v` is of type `OptBSTN<NODE>`. It can either be a
   * `NODE` object or `undefined`.
   */
  override set right(v: OptBSTN<NODE>) {
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
 */
export class BST<
  K = any,
  V = any,
  R = BTNEntry<K, V>,
  NODE extends BSTNode<K, V, NODE> = BSTNode<K, V, BSTNodeNested<K, V>>,
  TREE extends BST<K, V, R, NODE, TREE> = BST<K, V, R, NODE, BSTNested<K, V, R, NODE>>
>
  extends BinaryTree<K, V, R, NODE, TREE>
  implements IBinaryTree<K, V, R, NODE, TREE> {
  /**
   * This is the constructor function for a Binary Search Tree class in TypeScript.
   * @param keysOrNodesOrEntriesOrRawElements - The `keysOrNodesOrEntriesOrRawElements` parameter is an
   * iterable that can contain either keys, nodes, entries, or raw elements. These elements will be
   * added to the binary search tree during the construction of the object.
   * @param [options] - An optional object that contains additional options for the Binary Search Tree.
   * It can include a comparator function that defines the order of the elements in the tree.
   */
  constructor(
    keysOrNodesOrEntriesOrRawElements: Iterable<R | BTNKeyOrNodeOrEntry<K, V, NODE>> = [],
    options?: BSTOptions<K, V, R>
  ) {
    super([], options);

    if (options) {
      const { comparator } = options;
      if (comparator) this._comparator = comparator;
    }

    if (keysOrNodesOrEntriesOrRawElements) this.addMany(keysOrNodesOrEntriesOrRawElements);
  }

  protected override _root?: NODE = undefined;

  /**
   * The function returns the root node of a tree structure.
   * @returns The `_root` property of the object, which is of type `NODE` or `undefined`.
   */
  override get root(): OptBSTN<NODE> {
    return this._root;
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
    return new BSTNode<K, V, NODE>(key, value) as NODE;
  }

  /**
   * The function creates a new binary search tree with the specified options.
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the `createTree` method. It accepts a partial `BSTOptions` object, which has the
   * following properties:
   * @returns a new instance of the BST class with the provided options.
   */
  override createTree(options?: Partial<BSTOptions<K, V, R>>): TREE {
    return new BST<K, V, R, NODE, TREE>([], {
      iterationType: this.iterationType,
      comparator: this.comparator,
      ...options
    }) as TREE;
  }

  /**
   * The function overrides a method and converts a key, value pair or entry or raw element to a node.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - A variable that can be of
   * type R or BTNKeyOrNodeOrEntry<K, V, NODE>. It represents either a key, a node, an entry, or a raw
   * element.
   * @param {V} [value] - The `value` parameter is an optional value of type `V`. It represents the
   * value associated with a key in a key-value pair.
   * @returns either a NODE object or undefined.
   */
  override keyValueOrEntryOrRawElementToNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    value?: V
  ): OptBSTN<NODE> {
    return super.keyValueOrEntryOrRawElementToNode(keyOrNodeOrEntryOrRawElement, value) ?? undefined;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function ensures the existence of a node in a data structure and returns it, or undefined if
   * it doesn't exist.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can accept a value of type `R`, which represents the key, node,
   * entry, or raw element that needs to be ensured in the tree.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter is an optional
   * parameter that specifies the type of iteration to be used when ensuring a node. It has a default
   * value of `'ITERATIVE'`.
   * @returns The method is returning either the node that was ensured or `undefined` if the node could
   * not be ensured.
   */
  override ensureNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType: IterationType = 'ITERATIVE'
  ): OptBSTN<NODE> {
    return super.ensureNode(keyOrNodeOrEntryOrRawElement, iterationType) ?? undefined;
  }

  /**
   * The function checks if the input is an instance of the BSTNode class.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyOrNodeOrEntryOrRawElement` is
   * an instance of the `BSTNode` class.
   */
  override isNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>
  ): keyOrNodeOrEntryOrRawElement is NODE {
    return keyOrNodeOrEntryOrRawElement instanceof BSTNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `add` function in TypeScript adds a new node to a binary search tree based on the key value.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can accept a value of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @param {V} [value] - The `value` parameter is an optional value that can be associated with the
   * key in the binary search tree. If provided, it will be stored in the node along with the key.
   * @returns a boolean value.
   */
  override add(keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>, value?: V): boolean {
    const newNode = this.keyValueOrEntryOrRawElementToNode(keyOrNodeOrEntryOrRawElement, value);
    if (newNode === undefined) return false;

    if (this.root === undefined) {
      this._setRoot(newNode);
      this._size++;
      return true;
    }

    let current = this.root;
    while (current !== undefined) {
      if (this.comparator(current.key, newNode.key) === 0) {
        this._replaceNode(current, newNode);
        return true;
      } else if (this.comparator(current.key, newNode.key) > 0) {
        if (current.left === undefined) {
          current.left = newNode;
          this._size++;
          return true;
        }
        current = current.left;
      } else {
        if (current.right === undefined) {
          current.right = newNode;
          this._size++;
          return true;
        }
        current = current.right;
      }
    }

    return false;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(k log n)
   * Space Complexity: O(k + log n)
   *
   * The `addMany` function in TypeScript adds multiple keys or nodes to a data structure and returns
   * an array indicating whether each key or node was successfully inserted.
   * @param keysOrNodesOrEntriesOrRawElements - An iterable containing keys, nodes, entries, or raw
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
    keysOrNodesOrEntriesOrRawElements: Iterable<R | BTNKeyOrNodeOrEntry<K, V, NODE>>,
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
      for (const kve of keysOrNodesOrEntriesOrRawElements) {
        const value = valuesIterator?.next().value;
        const nn = this.add(kve, value);
        inserted.push(nn);
      }
      return inserted;
    }

    const realBTNExemplars: (R | BTNPureKeyOrNodeOrEntry<K, V, NODE>)[] = [];

    const isRealBTNExemplar = (
      kve: R | BTNKeyOrNodeOrEntry<K, V, NODE>
    ): kve is BTNPureKeyOrNodeOrEntry<K, V, NODE> => {
      if (kve === undefined || kve === null) return false;
      return !(this.isEntry(kve) && (kve[0] === undefined || kve[0] === null));
    };

    for (const kve of keysOrNodesOrEntriesOrRawElements) {
      isRealBTNExemplar(kve) && realBTNExemplars.push(kve);
    }

    let sorted: (R | BTNPureKeyOrNodeOrEntry<K, V, NODE>)[] = [];

    sorted = realBTNExemplars.sort((a, b) => {
      let keyA: K | undefined | null, keyB: K | undefined | null;
      if (this.isEntry(a)) keyA = a[0];
      else if (this.isRealNode(a)) keyA = a.key;
      else if (this.toEntryFn) {
        keyA = this.toEntryFn(a as R)[0];
      } else {
        keyA = a as K;
      }

      if (this.isEntry(b)) keyB = b[0];
      else if (this.isRealNode(b)) keyB = b.key;
      else if (this.toEntryFn) {
        keyB = this.toEntryFn(b as R)[0];
      } else {
        keyB = b as K;
      }

      if (keyA !== undefined && keyA !== null && keyB !== undefined && keyB !== null) {
        return this.comparator(keyA, keyB);
      }
      return 0;
    });

    const _dfs = (arr: (R | BTNPureKeyOrNodeOrEntry<K, V, NODE>)[]) => {
      if (arr.length === 0) return;

      const mid = Math.floor((arr.length - 1) / 2);
      const newNode = this.add(arr[mid]);
      inserted.push(newNode);
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
            const newNode = this.add(sorted[m]);
            inserted.push(newNode);
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
   * The `getNodes` function in TypeScript retrieves nodes from a binary tree based on a given
   * identifier and callback function.
   * @param {ReturnType<C> | undefined} identifier - The `identifier` parameter is the value that you
   * want to search for in the binary tree. It can be of any type that is returned by the callback
   * function.
   * @param {C} callback - The `callback` parameter is a function that takes a node as input and
   * returns a value. This value is used to identify the nodes that match the given identifier. The
   * `callback` function is optional and defaults to `this._DEFAULT_CALLBACK`.
   * @param [onlyOne=false] - A boolean value indicating whether to return only the first matching node
   * or all matching nodes. If set to true, only the first matching node will be returned. If set to
   * false, all matching nodes will be returned. The default value is false.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for the search in the binary tree. It can be either a node object, a key-value pair, or an
   * entry object. If it is not provided, the `root` of the binary tree is used as the starting point.
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * iteration to be performed. It can have two possible values:
   * @returns The method `getNodes` returns an array of `NODE` objects.
   */
  override getNodes<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this._DEFAULT_CALLBACK as C,
    onlyOne = false,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): NODE[] {
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return [];
    callback = this._ensureCallback(identifier, callback);
    const ans: NODE[] = [];

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE) => {
        const callbackResult = callback(cur);
        if (callbackResult === identifier) {
          ans.push(cur);
          if (onlyOne) return;
        }

        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return;
        // TODO potential bug
        if (callback === this._DEFAULT_CALLBACK) {
          if (this.isRealNode(cur.left) && this.comparator(cur.key, identifier as K) > 0) dfs(cur.left);
          if (this.isRealNode(cur.right) && this.comparator(cur.key, identifier as K) < 0) dfs(cur.right);
        } else {
          this.isRealNode(cur.left) && dfs(cur.left);
          this.isRealNode(cur.right) && dfs(cur.right);
        }
      };

      dfs(beginRoot);
    } else {
      const stack = [beginRoot];
      while (stack.length > 0) {
        const cur = stack.pop()!;
        const callbackResult = callback(cur);
        if (callbackResult === identifier) {
          ans.push(cur);
          if (onlyOne) return ans;
        }
        // TODO potential bug
        if (callback === this._DEFAULT_CALLBACK) {
          if (this.isRealNode(cur.right) && this.comparator(cur.key, identifier as K) < 0) stack.push(cur.right);
          if (this.isRealNode(cur.left) && this.comparator(cur.key, identifier as K) > 0) stack.push(cur.left);

          // if (this.isRealNode(cur.right) && this._lt(cur.key, identifier as K)) stack.push(cur.right);
          // if (this.isRealNode(cur.left) && this._gt(cur.key, identifier as K)) stack.push(cur.left);

          // // @ts-ignore
          // if (this.isRealNode(cur.right) && cur.key > identifier) stack.push(cur.right);
          // // @ts-ignore
          // if (this.isRealNode(cur.left) && cur.key < identifier) stack.push(cur.left);
        } else {
          this.isRealNode(cur.right) && stack.push(cur.right);
          this.isRealNode(cur.left) && stack.push(cur.left);
        }
      }
    }

    return ans;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getNode` returns the first node that matches the given identifier and callback
   * function in a binary search tree.
   * @param {ReturnType<C> | undefined} identifier - The `identifier` parameter is the value that you
   * want to search for in the binary search tree. It can be of any type that is compatible with the
   * type returned by the callback function.
   * @param {C} callback - The `callback` parameter is a function that will be used to determine if a
   * node matches the desired criteria. It should be a function that takes a node as an argument and
   * returns a boolean value indicating whether the node matches the criteria or not. If no callback is
   * provided, the default callback will be
   * @param beginRoot - The `beginRoot` parameter is the starting point for the search in the binary
   * search tree. It can be either a key or a node. If it is a key, the search will start from the node
   * with that key. If it is a node, the search will start from that node.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed when searching for nodes in the binary search tree. It can have one
   * of the following values:
   * @returns The method is returning a NODE object or undefined.
   */
  override getNode<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this._DEFAULT_CALLBACK as C,
    beginRoot: R | BSTNKeyOrNode<K, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): OptBSTN<NODE> {
    return this.getNodes(identifier, callback, true, beginRoot, iterationType)[0] ?? undefined;
  }

  /**
   * Time Complexity: O(k log n)
   * Space Complexity: O(k + log n)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getNodeByKey` returns a node with a specific key from a tree data structure.
   * @param {K} key - The key parameter is the value used to search for a specific node in the tree. It
   * is typically a unique identifier or a value that can be used to determine the position of the node
   * in the tree structure.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter is an optional
   * parameter that specifies the type of iteration to be used when searching for a node in the tree.
   * It has a default value of `'ITERATIVE'`.
   * @returns The method is returning a NODE object or undefined.
   */
  override getNodeByKey(key: K, iterationType: IterationType = 'ITERATIVE'): OptBSTN<NODE> {
    return this.getNode(key, this._DEFAULT_CALLBACK, this.root, iterationType);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(k + log n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the depth-first search method and returns an array of the return types of
   * the callback function.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * during the depth-first search traversal. It is an optional parameter and defaults to
   * `this._DEFAULT_CALLBACK`. The type `C` represents the type of the callback function.
   * @param {DFSOrderPattern} [pattern=IN] - The "pattern" parameter in the code snippet refers to the
   * order in which the Depth-First Search (DFS) algorithm visits the nodes in a tree or graph. It can
   * take one of the following values:
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for the depth-first search traversal. It can be either a root node, a key-value pair, or a
   * node entry. If not specified, the default value is the root of the tree.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter specifies the
   * type of iteration to be used during the Depth-First Search (DFS) traversal. It can have one of the
   * following values:
   * @returns The method is returning an array of the return type of the callback function.
   */
  override dfs<C extends BTNCallback<NODE>>(
    callback: C = this._DEFAULT_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = 'ITERATIVE'
  ): ReturnType<C>[] {
    return super.dfs(callback, pattern, beginRoot, iterationType, false);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the breadth-first search method and returns an array of the return types of
   * the callback function.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * visited during the breadth-first search. It should take a single argument, which is the current
   * node being visited, and it can return a value of any type.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for the breadth-first search. It can be either a root node, a key-value pair, or an entry
   * object. If no value is provided, the default value is the root of the tree.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed during the breadth-first search (BFS) traversal. It can have one of
   * the following values:
   * @returns an array of the return type of the callback function.
   */
  override bfs<C extends BTNCallback<NODE>>(
    callback: C = this._DEFAULT_CALLBACK as C,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    return super.bfs(callback, beginRoot, iterationType, false);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the listLevels method from the superclass and returns an array of arrays
   * containing the results of the callback function applied to each level of the tree.
   * @param {C} callback - The `callback` parameter is a generic type `C` that extends
   * `BTNCallback<NODE>`. It represents a callback function that will be called for each node in the
   * tree during the iteration process.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for listing the levels of the binary tree. It can be either a root node of the tree, a
   * key-value pair representing a node in the tree, or a key representing a node in the tree. If no
   * value is provided, the root of
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed on the tree. It can have one of the following values:
   * @returns The method is returning a two-dimensional array of the return type of the callback
   * function.
   */
  override listLevels<C extends BTNCallback<NODE>>(
    callback: C = this._DEFAULT_CALLBACK as C,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[][] {
    return super.listLevels(callback, beginRoot, iterationType, false);
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

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
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} targetNode - The `targetNode` parameter is the node in
   * the binary tree that you want to start traversing from. It can be specified either by providing
   * the key of the node, the node itself, or an entry containing the key and value of the node. If no
   * `targetNode` is provided,
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * traversal to be performed on the binary tree. It can have two possible values:
   * @returns The function `lesserOrGreaterTraverse` returns an array of values of type
   * `ReturnType<C>`, which is the return type of the callback function passed as an argument.
   */
  lesserOrGreaterTraverse<C extends BTNCallback<NODE>>(
    callback: C = this._DEFAULT_CALLBACK as C,
    lesserOrGreater: CP = -1,
    targetNode: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    const targetNodeEnsured = this.ensureNode(targetNode);
    const ans: ReturnType<BTNCallback<NODE>>[] = [];
    if (!targetNodeEnsured) return ans;
    if (!this.root) return ans;

    const targetKey = targetNodeEnsured.key;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE) => {
        const compared = this.comparator(cur.key, targetKey);
        if (Math.sign(compared) === lesserOrGreater) ans.push(callback(cur));

        if (this.isRealNode(cur.left)) dfs(cur.left);
        if (this.isRealNode(cur.right)) dfs(cur.right);
      };

      dfs(this.root);
      return ans;
    } else {
      const queue = new Queue<NODE>([this.root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (this.isRealNode(cur)) {
          const compared = this.comparator(cur.key, targetKey);
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
   */

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
    this.clear();

    if (sorted.length < 1) return false;
    if (iterationType === 'RECURSIVE') {
      const buildBalanceBST = (l: number, r: number) => {
        if (l > r) return;
        const m = l + Math.floor((r - l) / 2);
        const midNode = sorted[m];
        this.add([midNode.key, midNode.value]);
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
            this.add([midNode.key, midNode.value]);
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
   */

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
    if (!this.root) return true;

    let balanced = true;

    if (iterationType === 'RECURSIVE') {
      const _height = (cur: OptBSTN<NODE>): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left),
          rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this.root);
    } else {
      const stack: NODE[] = [];
      let node: OptBSTN<NODE> = this.root,
        last: OptBSTN<NODE> = undefined;
      const depths: Map<NODE, number> = new Map();

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

  protected _DEFAULT_COMPARATOR = (a: K, b: K): number => {
    if (typeof a === 'object' || typeof b === 'object') {
      throw TypeError(
        `When comparing object types, a custom comparator must be defined in the constructor's options parameter.`
      );
    }
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  };

  protected _comparator: Comparator<K> = this._DEFAULT_COMPARATOR;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * The function returns the value of the _comparator property.
   * @returns The `_comparator` property is being returned.
   */
  get comparator() {
    return this._comparator;
  }

  /**
   * The function sets the root of a tree-like structure and updates the parent property of the new
   * root.
   * @param {OptBSTN<NODE>} v - v is a parameter of type NODE or undefined.
   */
  protected override _setRoot(v: OptBSTN<NODE>) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }
}
