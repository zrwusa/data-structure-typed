/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  BSTNested,
  BSTNodeNested,
  BSTOptions,
  BTNCallback,
  BTNodePureExemplar,
  KeyOrNodeOrEntry
} from '../../types';
import { BSTVariant, CP, DFSOrderPattern, IterationType } from '../../types';
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
  override get left(): NODE | undefined {
    return this._left;
  }

  /**
   * The function sets the left child of a node and updates the parent reference of the child.
   * @param {NODE | undefined} v - The parameter `v` is of type `NODE | undefined`. It can either be an
   * instance of the `NODE` class or `undefined`.
   */
  override set left(v: NODE | undefined) {
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
  override get right(): NODE | undefined {
    return this._right;
  }

  /**
   * The function sets the right child of a node and updates the parent reference of the child.
   * @param {NODE | undefined} v - The parameter `v` is of type `NODE | undefined`. It can either be a
   * `NODE` object or `undefined`.
   */
  override set right(v: NODE | undefined) {
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
  NODE extends BSTNode<K, V, NODE> = BSTNode<K, V, BSTNodeNested<K, V>>,
  TREE extends BST<K, V, NODE, TREE> = BST<K, V, NODE, BSTNested<K, V, NODE>>
>
  extends BinaryTree<K, V, NODE, TREE>
  implements IBinaryTree<K, V, NODE, TREE> {
  /**
   * This is the constructor function for a TypeScript class that initializes a binary search tree with
   * optional keys or nodes or entries and options.
   * @param keysOrNodesOrEntries - An iterable object that contains keys, nodes, or entries. It is used
   * to initialize the binary search tree with the provided keys, nodes, or entries.
   * @param [options] - The `options` parameter is an optional object that can contain additional
   * configuration options for the binary search tree. It can have the following properties:
   */
  constructor(keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, NODE>> = [], options?: BSTOptions<K>) {
    super([], options);

    if (options) {
      const { variant } = options;
      if (variant) this._variant = variant;
    }

    this._root = undefined;

    if (keysOrNodesOrEntries) this.addMany(keysOrNodesOrEntries);
  }

  protected override _root?: NODE;

  /**
   * The function returns the root node of a tree structure.
   * @returns The `_root` property of the object, which is of type `NODE` or `undefined`.
   */
  override get root(): NODE | undefined {
    return this._root;
  }

  protected _variant = BSTVariant.STANDARD;

  /**
   * The function returns the value of the _variant property.
   * @returns The value of the `_variant` property.
   */
  get variant() {
    return this._variant;
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
   * behavior of the `createTree` method. It is of type `Partial<BSTOptions<K>>`, which means it is a
   * partial object of type `BSTOptions<K>`.
   * @returns a new instance of the BST class, with the provided options merged with the default
   * options. The returned value is casted as TREE.
   */
  override createTree(options?: Partial<BSTOptions<K>>): TREE {
    return new BST<K, V, NODE, TREE>([], {
      iterationType: this.iterationType,
      variant: this.variant,
      ...options
    }) as TREE;
  }

  /**
   * The function `keyValueOrEntryToNode` takes an keyOrNodeOrEntry and returns a node if the keyOrNodeOrEntry is valid,
   * otherwise it returns undefined.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is of type `KeyOrNodeOrEntry<K, V, NODE>`, where:
   * @param {V} [value] - The `value` parameter is an optional value that can be passed to the
   * `keyValueOrEntryToNode` function. It represents the value associated with the keyOrNodeOrEntry node.
   * @returns a node of type NODE or undefined.
   */
  override keyValueOrEntryToNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>, value?: V): NODE | undefined {
    let node: NODE | undefined;
    if (keyOrNodeOrEntry === null || keyOrNodeOrEntry === undefined) {
      return;
    } else if (this.isNode(keyOrNodeOrEntry)) {
      node = keyOrNodeOrEntry;
    } else if (this.isEntry(keyOrNodeOrEntry)) {
      const [key, value] = keyOrNodeOrEntry;
      if (key === undefined || key === null) {
        return;
      } else {
        node = this.createNode(key, value);
      }
    } else if (!this.isNode(keyOrNodeOrEntry)) {
      node = this.createNode(keyOrNodeOrEntry, value);
    } else {
      return;
    }
    return node;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function `ensureNode` returns the node corresponding to the given key if it is a node key,
   * otherwise it returns the key itself.
   * @param {K | NODE | undefined} keyOrNodeOrEntry - The `key` parameter can be of type `K`, `NODE`, or
   * `undefined`.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to be performed. It has a default value of `IterationType.ITERATIVE`.
   * @returns either a node object (NODE) or undefined.
   */
  override ensureNode(
    keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>,
    iterationType = IterationType.ITERATIVE
  ): NODE | undefined {
    let res: NODE | undefined;
    if (this.isRealNode(keyOrNodeOrEntry)) {
      res = keyOrNodeOrEntry;
    } else if (this.isEntry(keyOrNodeOrEntry)) {
      if (keyOrNodeOrEntry[0]) res = this.getNodeByKey(keyOrNodeOrEntry[0], iterationType);
    } else {
      if (keyOrNodeOrEntry) res = this.getNodeByKey(keyOrNodeOrEntry, iterationType);
    }
    return res;
  }

  /**
   * The function checks if an keyOrNodeOrEntry is an instance of BSTNode.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is a variable of type `KeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the keyOrNodeOrEntry is an instance of the BSTNode class.
   */
  override isNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>): keyOrNodeOrEntry is NODE {
    return keyOrNodeOrEntry instanceof BSTNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `add` function adds a new node to a binary tree, updating the value if the key already exists
   * or inserting a new node if the key is unique.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can accept three types of values:
   * @param {V} [value] - The `value` parameter represents the value associated with the key that is
   * being added to the binary tree.
   * @returns The method `add` returns either the newly added node (`newNode`) or `undefined` if the
   * node was not added.
   */
  override add(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>, value?: V): boolean {
    const newNode = this.keyValueOrEntryToNode(keyOrNodeOrEntry, value);
    if (newNode === undefined) return false;

    if (this.root === undefined) {
      this._setRoot(newNode);
      this._size++;
      return true;
    }

    let current = this.root;
    while (current !== undefined) {
      if (this._compare(current.key, newNode.key) === CP.eq) {
        // if (current !== newNode) {
        // The key value is the same but the reference is different, update the value of the existing node
        this._replaceNode(current, newNode);
        return true;

        // } else {
        // The key value is the same and the reference is the same, replace the entire node
        // this._replaceNode(current, newNode);

        //   return;
        // }
      } else if (this._compare(current.key, newNode.key) === CP.gt) {
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
   * Time Complexity: O(k log n)
   * Space Complexity: O(k + log n)
   */

  /**
   * Time Complexity: O(k log n)
   * Space Complexity: O(k + log n)
   *
   * The `addMany` function in TypeScript adds multiple keys or nodes to a binary tree, optionally
   * balancing the tree after each addition.
   * @param keysOrNodesOrEntries - An iterable containing the keys, nodes, or entries to be added to
   * the binary tree.
   * @param [values] - An optional iterable of values to be associated with the keys or nodes being
   * added. If provided, the values will be assigned to the corresponding keys or nodes in the same
   * order. If not provided, undefined will be assigned as the value for each key or node.
   * @param [isBalanceAdd=true] - A boolean flag indicating whether the add operation should be
   * balanced or not. If set to true, the add operation will be balanced using a binary search tree
   * algorithm. If set to false, the add operation will not be balanced and the nodes will be added
   * in the order they appear in the input.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when adding multiple keys or nodes. It has a default value of
   * `this.iterationType`, which suggests that it is a property of the current object.
   * @returns The function `addMany` returns an array of nodes (`NODE`) or `undefined` values.
   */
  override addMany(
    keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, NODE>>,
    values?: Iterable<V | undefined>,
    isBalanceAdd = true,
    iterationType = this.iterationType
  ): boolean[] {
    const inserted: boolean[] = [];

    let valuesIterator: Iterator<V | undefined> | undefined;

    if (values) {
      valuesIterator = values[Symbol.iterator]();
    }

    if (!isBalanceAdd) {
      for (const kve of keysOrNodesOrEntries) {
        const value = valuesIterator?.next().value;
        const nn = this.add(kve, value);
        inserted.push(nn);
      }
      return inserted;
    }

    const realBTNExemplars: BTNodePureExemplar<K, V, NODE>[] = [];

    const isRealBTNExemplar = (kve: KeyOrNodeOrEntry<K, V, NODE>): kve is BTNodePureExemplar<K, V, NODE> => {
      if (kve === undefined || kve === null) return false;
      return !(this.isEntry(kve) && (kve[0] === undefined || kve[0] === null));
    };

    for (const kve of keysOrNodesOrEntries) {
      isRealBTNExemplar(kve) && realBTNExemplars.push(kve);
    }

    let sorted: BTNodePureExemplar<K, V, NODE>[] = [];

    sorted = realBTNExemplars.sort((a, b) => {
      let aR: number, bR: number;
      if (this.isEntry(a)) aR = this.extractor(a[0]);
      else if (this.isRealNode(a)) aR = this.extractor(a.key);
      else aR = this.extractor(a);

      if (this.isEntry(b)) bR = this.extractor(b[0]);
      else if (this.isRealNode(b)) bR = this.extractor(b.key);
      else bR = this.extractor(b);

      return aR - bR;
    });

    const _dfs = (arr: BTNodePureExemplar<K, V, NODE>[]) => {
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

    if (iterationType === IterationType.RECURSIVE) {
      _dfs(sorted);
    } else {
      _iterate();
    }

    return inserted;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getNodeByKey` searches for a node in a binary tree based on a given key, using
   * either recursive or iterative methods.
   * @param {K} key - The `key` parameter is the key value that we are searching for in the tree.
   * It is used to identify the node that we want to retrieve.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when searching for a node in the binary tree. It can have two possible
   * values:
   * @returns The function `getNodeByKey` returns a node (`NODE`) if a node with the specified key is
   * found in the binary tree. If no node is found, it returns `undefined`.
   */
  override getNodeByKey(key: K, iterationType = IterationType.ITERATIVE): NODE | undefined {
    if (!this.isRealNode(this.root)) return undefined;
    if (iterationType === IterationType.RECURSIVE) {
      const _dfs = (cur: NODE): NODE | undefined => {
        if (cur.key === key) return cur;
        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return;

        if (this._compare(cur.key, key) === CP.gt && this.isRealNode(cur.left)) return _dfs(cur.left);
        if (this._compare(cur.key, key) === CP.lt && this.isRealNode(cur.right)) return _dfs(cur.right);
      };

      return _dfs(this.root);
    } else {
      const queue = new Queue<NODE>([this.root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (this.isRealNode(cur)) {
          if (this._compare(cur.key, key) === CP.eq) return cur;
          if (this._compare(cur.key, key) === CP.gt) this.isRealNode(cur.left) && queue.push(cur.left);
          if (this._compare(cur.key, key) === CP.lt) this.isRealNode(cur.right) && queue.push(cur.right);
        }
      }
    }
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(k + log n)
   * /

   /**
   * Time Complexity: O(log n)
   * Space Complexity: O(k + log n)
   *
   * The function `getNodes` returns an array of nodes that match a given identifier, using either a
   * recursive or iterative approach.
   * @param {ReturnType<C> | undefined} identifier - The `identifier` parameter is the value that you
   * want to search for in the nodes of the binary tree. It can be of any type that is returned by the
   * callback function `C`.
   * @param {C} callback - The `callback` parameter is a function that takes a node of type `NODE` as its
   * argument and returns a value of type `ReturnType<C>`. The `C` type parameter represents a callback
   * function type that extends the `BTNCallback<NODE>` type. The `BTNCallback<NODE>` type is
   * @param [onlyOne=false] - A boolean flag indicating whether to stop searching after finding the
   * first node that matches the identifier. If set to true, the function will return an array
   * containing only the first matching node. If set to false (default), the function will continue
   * searching for all nodes that match the identifier and return an array containing
   * @param {K | NODE | undefined} beginRoot - The `beginRoot` parameter represents the starting node
   * for the traversal. It can be either a key value or a node object. If it is undefined, the
   * traversal will start from the root of the tree.
   * @param iterationType - The `iterationType` parameter determines the type of iteration to be
   * performed on the binary tree. It can have two possible values:
   * @returns The method returns an array of nodes (`NODE[]`).
   */
  override getNodes<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this._defaultOneParamCallback as C,
    onlyOne = false,
    beginRoot: KeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType = this.iterationType
  ): NODE[] {
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return [];
    const ans: NODE[] = [];

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: NODE) => {
        const callbackResult = callback(cur);
        if (callbackResult === identifier) {
          ans.push(cur);
          if (onlyOne) return;
        }

        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return;
        // TODO potential bug
        if (callback === this._defaultOneParamCallback) {
          if (this._compare(cur.key, identifier as K) === CP.gt) this.isRealNode(cur.left) && _traverse(cur.left);
          if (this._compare(cur.key, identifier as K) === CP.lt) this.isRealNode(cur.right) && _traverse(cur.right);
        } else {
          this.isRealNode(cur.left) && _traverse(cur.left);
          this.isRealNode(cur.right) && _traverse(cur.right);
        }
      };

      _traverse(beginRoot);
    } else {
      const queue = new Queue<NODE>([beginRoot]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (this.isRealNode(cur)) {
          const callbackResult = callback(cur);
          if (callbackResult === identifier) {
            ans.push(cur);
            if (onlyOne) return ans;
          }
          // TODO potential bug
          if (callback === this._defaultOneParamCallback) {
            if (this._compare(cur.key, identifier as K) === CP.gt) this.isRealNode(cur.left) && queue.push(cur.left);
            if (this._compare(cur.key, identifier as K) === CP.lt) this.isRealNode(cur.right) && queue.push(cur.right);
          } else {
            this.isRealNode(cur.left) && queue.push(cur.left);
            this.isRealNode(cur.right) && queue.push(cur.right);
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

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the depth-first search method and returns an array of the return types of
   * the callback function.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * during the depth-first search traversal. It is an optional parameter and if not provided, a
   * default callback function will be used.
   * @param {DFSOrderPattern} [pattern=in] - The `pattern` parameter specifies the order in which the
   * nodes are visited during the depth-first search. It can have one of the following values:
   * @param beginRoot - The `beginRoot` parameter is used to specify the starting point for the
   * Depth-First Search (DFS) traversal. It can be either a key, a node, or an entry in the tree. If no
   * value is provided, the DFS traversal will start from the root of the tree.
   * @param {IterationType} iterationType - The `iterationType` parameter specifies the type of
   * iteration to be used during the Depth-First Search (DFS) traversal. It can have one of the
   * following values:
   * @returns The method is returning an array of the return type of the callback function.
   */
  override dfs<C extends BTNCallback<NODE>>(
    callback: C = this._defaultOneParamCallback as C,
    pattern: DFSOrderPattern = 'in',
    beginRoot: KeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = IterationType.ITERATIVE
  ): ReturnType<C>[] {
    return super.dfs(callback, pattern, beginRoot, iterationType, false);
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the breadth-first search method and returns an array of the return types of
   * the callback function.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * visited during the breadth-first search traversal. It is an optional parameter and if not
   * provided, a default callback function will be used.
   * @param beginRoot - The `beginRoot` parameter is the starting point for the breadth-first search
   * traversal. It can be either a key, a node, or an entry in the tree. If not specified, the root of
   * the tree is used as the starting point.
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed during the breadth-first search (BFS) traversal. It determines the order in which the
   * nodes are visited.
   * @returns The method is returning an array of the return type of the callback function.
   */
  override bfs<C extends BTNCallback<NODE>>(
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: KeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType = this.iterationType
  ): ReturnType<C>[] {
    return super.bfs(callback, beginRoot, iterationType, false);
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the listLevels method and returns an array of arrays containing the return
   * type of the callback function for each level of the tree.
   * @param {C} callback - The `callback` parameter is a generic type `C` that extends
   * `BTNCallback<NODE>`. It represents a callback function that will be called for each node in the tree
   * during the level listing process.
   * @param beginRoot - The `beginRoot` parameter is used to specify the starting point for listing the
   * levels of a binary tree. It can be either a key, a node, or an entry in the binary tree. If not
   * provided, the root of the binary tree is used as the starting point.
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed on the tree. It determines the order in which the nodes are visited during the
   * iteration.
   * @returns The method is returning a two-dimensional array of the return type of the callback
   * function.
   */
  override listLevels<C extends BTNCallback<NODE>>(
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: KeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType = this.iterationType
  ): ReturnType<C>[][] {
    return super.listLevels(callback, beginRoot, iterationType, false);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `lastKey` function returns the key of the rightmost node in a binary tree, or the key of the
   * leftmost node if the comparison result is greater than.
   * @param {K | NODE | undefined} beginRoot - The `beginRoot` parameter is optional and can be of
   * type `K`, `NODE`, or `undefined`. It represents the starting point for finding the last key in
   * the binary tree. If not provided, it defaults to the root of the binary tree (`this.root`).
   * @returns the key of the rightmost node in the binary tree if the comparison result is less than,
   * the key of the leftmost node if the comparison result is greater than, and the key of the
   * rightmost node otherwise. If no node is found, it returns 0.
   */
  lastKey(beginRoot: KeyOrNodeOrEntry<K, V, NODE> = this.root): K | undefined {
    let current = this.ensureNode(beginRoot);
    if (!current) return undefined;

    if (this._variant === BSTVariant.STANDARD) {
      // For BSTVariant.MIN, find the rightmost node
      while (current.right !== undefined) {
        current = current.right;
      }
    } else {
      // For BSTVariant.MAX, find the leftmost node
      while (current.left !== undefined) {
        current = current.left;
      }
    }
    return current.key;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The `lesserOrGreaterTraverse` function traverses a binary tree and returns an array of nodes that
   * are either lesser or greater than a target node, depending on the specified comparison type.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * that satisfies the condition specified by the `lesserOrGreater` parameter. It takes a single
   * parameter of type `NODE` (the node type) and returns a value of any type.
   * @param {CP} lesserOrGreater - The `lesserOrGreater` parameter is used to determine whether to
   * traverse nodes that are lesser than, greater than, or equal to the `targetNode`. It is of type
   * `CP`, which is a custom type representing the comparison operator. The possible values for
   * `lesserOrGreater` are
   * @param {K | NODE | undefined} targetNode - The `targetNode` parameter represents the node in the
   * binary tree that you want to traverse from. It can be specified either by its key, by the node
   * object itself, or it can be left undefined to start the traversal from the root of the tree.
   * @param iterationType - The `iterationType` parameter determines the type of traversal to be
   * performed on the binary tree. It can have two possible values:
   * @returns The function `lesserOrGreaterTraverse` returns an array of values of type
   * `ReturnType<C>`, which is the return type of the callback function passed as an argument.
   */
  lesserOrGreaterTraverse<C extends BTNCallback<NODE>>(
    callback: C = this._defaultOneParamCallback as C,
    lesserOrGreater: CP = CP.lt,
    targetNode: KeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType = this.iterationType
  ): ReturnType<C>[] {
    targetNode = this.ensureNode(targetNode);
    const ans: ReturnType<BTNCallback<NODE>>[] = [];
    if (!targetNode) return ans;
    if (!this.root) return ans;

    const targetKey = targetNode.key;

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: NODE) => {
        const compared = this._compare(cur.key, targetKey);
        if (compared === lesserOrGreater) ans.push(callback(cur));

        if (this.isRealNode(cur.left)) _traverse(cur.left);
        if (this.isRealNode(cur.right)) _traverse(cur.right);
      };

      _traverse(this.root);
      return ans;
    } else {
      const queue = new Queue<NODE>([this.root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (this.isRealNode(cur)) {
          const compared = this._compare(cur.key, targetKey);
          if (compared === lesserOrGreater) ans.push(callback(cur));

          if (this.isRealNode(cur.left)) queue.push(cur.left);
          if (this.isRealNode(cur.right)) queue.push(cur.right);
        }
      }
      return ans;
    }
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
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
   * Balancing Adjustment:
   * Perfectly Balanced Binary Tree: Since the balance of a perfectly balanced binary tree is already fixed, no additional balancing adjustment is needed. Any insertion or deletion operation will disrupt the perfect balance, often requiring a complete reconstruction of the tree.
   * AVL Tree: After insertion or deletion operations, an AVL tree performs rotation adjustments based on the balance factor of nodes to restore the tree's balance. These rotations can be left rotations, right rotations, left-right rotations, or right-left rotations, performed as needed.
   *
   * Use Cases and Efficiency:
   * Perfectly Balanced Binary Tree: Perfectly balanced binary trees are typically used in specific scenarios such as complete binary heaps in heap sort or certain types of Huffman trees. However, they are not suitable for dynamic operations requiring frequent insertions and deletions, as these operations often necessitate full tree reconstruction.
   * AVL Tree: AVL trees are well-suited for scenarios involving frequent searching, insertion, and deletion operations. Through rotation adjustments, AVL trees maintain their balance, ensuring average and worst-case time complexity of O(log n).
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
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
      const _height = (cur: NODE | undefined): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left),
          rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this.root);
    } else {
      const stack: NODE[] = [];
      let node: NODE | undefined = this.root,
        last: NODE | undefined = undefined;
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

  /**
   * The function sets the root property of an object and updates the parent property of the new root.
   * @param {NODE | undefined} v - The parameter `v` is of type `NODE | undefined`. This means that it
   * can either be an object of type `NODE` or it can be `undefined`.
   */
  protected override _setRoot(v: NODE | undefined) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * The function compares two values using a comparator function and returns whether the first value
   * is greater than, less than, or equal to the second value.
   * @param {K} a - The parameter "a" is of type K.
   * @param {K} b - The parameter "b" in the above code represents a K.
   * @returns a value of type CP (ComparisonResult). The possible return values are CP.gt (greater
   * than), CP.lt (less than), or CP.eq (equal).
   */
  protected _compare(a: K, b: K): CP {
    const extractedA = this.extractor(a);
    const extractedB = this.extractor(b);
    const compared = this.variant === BSTVariant.STANDARD ? extractedA - extractedB : extractedB - extractedA;

    return compared > 0 ? CP.gt : compared < 0 ? CP.lt : CP.eq;
  }
}
