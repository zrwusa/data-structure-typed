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
  BTNKeyOrNodeOrEntry,
  DFSOrderPattern,
  EntryCallback,
  FamilyPosition,
  IterationType,
  NodeDisplayLayout,
  OptBTNOrNull
} from '../../types';
import { IBinaryTree } from '../../interfaces';
import { trampoline } from '../../utils';
import { Queue } from '../queue';
import { IterableEntryBase } from '../base';

/**
 * Represents a node in a binary tree.
 * @template V - The type of data stored in the node.
 * @template NODE - The type of the family relationship in the binary tree.
 */
export class BinaryTreeNode<
  K = any,
  V = any,
  NODE extends BinaryTreeNode<K, V, NODE> = BinaryTreeNode<K, V, BinaryTreeNodeNested<K, V>>
> {
  key: K;

  value?: V;

  parent?: NODE;

  /**
   * The constructor function initializes an object with a key and an optional value.
   * @param {K} key - The "key" parameter is of type K, which represents the type of the key for the
   * constructor. It is used to set the key property of the object being created.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It represents the
   * value associated with the key in the constructor.
   */
  constructor(key: K, value?: V) {
    this.key = key;
    this.value = value;
  }

  protected _left?: NODE | null;

  /**
   * The function returns the value of the `_left` property, which can be of type `NODE`, `null`, or
   * `undefined`.
   * @returns The left node of the current node is being returned. It can be either a NODE object,
   * null, or undefined.
   */
  get left(): OptBTNOrNull<NODE> {
    return this._left;
  }

  /**
   * The function sets the left child of a node and updates its parent reference.
   * @param {OptBTNOrNull<NODE>} v - The parameter `v` can be of type `NODE`, `null`, or
   * `undefined`.
   */
  set left(v: OptBTNOrNull<NODE>) {
    if (v) {
      v.parent = this as unknown as NODE;
    }
    this._left = v;
  }

  protected _right?: NODE | null;

  /**
   * The function returns the right node of a binary tree or null if it doesn't exist.
   * @returns The method is returning the value of the `_right` property, which can be a `NODE` object,
   * `null`, or `undefined`.
   */
  get right(): OptBTNOrNull<NODE> {
    return this._right;
  }

  /**
   * The function sets the right child of a node and updates its parent.
   * @param {OptBTNOrNull<NODE>} v - The parameter `v` can be of type `NODE`, `null`, or
   * `undefined`.
   */
  set right(v: OptBTNOrNull<NODE>) {
    if (v) {
      v.parent = this as unknown as NODE;
    }
    this._right = v;
  }

  /**
   * Get the position of the node within its family.
   * @returns {FamilyPosition} - The family position of the node.
   */
  get familyPosition(): FamilyPosition {
    const that = this as unknown as NODE;
    if (!this.parent) {
      return this.left || this.right ? 'ROOT' : 'ISOLATED';
    }

    if (this.parent.left === that) {
      return this.left || this.right ? 'ROOT_LEFT' : 'LEFT';
    } else if (this.parent.right === that) {
      return this.left || this.right ? 'ROOT_RIGHT' : 'RIGHT';
    }

    return 'MAL_NODE';
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
  R = BTNEntry<K, V>,
  NODE extends BinaryTreeNode<K, V, NODE> = BinaryTreeNode<K, V, BinaryTreeNodeNested<K, V>>,
  TREE extends BinaryTree<K, V, R, NODE, TREE> = BinaryTree<K, V, R, NODE, BinaryTreeNested<K, V, R, NODE>>
>
  extends IterableEntryBase<K, V | undefined>
  implements IBinaryTree<K, V, R, NODE, TREE> {
  iterationType: IterationType = 'ITERATIVE';

  /**
   * The constructor function initializes a binary tree object with optional keysOrNodesOrEntriesOrRawElements and options.
   * @param [keysOrNodesOrEntriesOrRawElements] - Optional iterable of BTNKeyOrNodeOrEntry objects. These objects represent the
   * nodes to be added to the binary tree.
   * @param [options] - The `options` parameter is an optional object that can contain additional
   * configuration options for the binary tree. In this case, it is of type
   * `Partial<BinaryTreeOptions>`, which means that not all properties of `BinaryTreeOptions` are
   * required.
   */
  constructor(
    keysOrNodesOrEntriesOrRawElements: Iterable<R | BTNKeyOrNodeOrEntry<K, V, NODE>> = [],
    options?: BinaryTreeOptions<K, V, R>
  ) {
    super();
    if (options) {
      const { iterationType, toEntryFn } = options;
      if (iterationType) this.iterationType = iterationType;
      if (typeof toEntryFn === 'function') this._toEntryFn = toEntryFn;
      else if (toEntryFn) throw TypeError('toEntryFn must be a function type');
    }

    if (keysOrNodesOrEntriesOrRawElements) this.addMany(keysOrNodesOrEntriesOrRawElements);
  }

  protected _root?: OptBTNOrNull<NODE>;

  /**
   * The function returns the root node, which can be of type NODE, null, or undefined.
   * @returns The method is returning the value of the `_root` property, which can be of type `NODE`,
   * `null`, or `undefined`.
   */
  get root(): OptBTNOrNull<NODE> {
    return this._root;
  }

  protected _size: number = 0;

  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size(): number {
    return this._size;
  }

  protected _NIL: NODE = new BinaryTreeNode<K, V>(NaN as K) as unknown as NODE;

  /**
   * The function returns the value of the _NIL property.
   * @returns The method is returning the value of the `_NIL` property.
   */
  get NIL(): NODE {
    return this._NIL;
  }

  protected _toEntryFn?: (rawElement: R) => BTNEntry<K, V>;

  /**
   * The function returns the value of the _toEntryFn property.
   * @returns The function being returned is `this._toEntryFn`.
   */
  get toEntryFn() {
    return this._toEntryFn;
  }

  /**
   * Creates a new instance of BinaryTreeNode with the given key and value.
   * @param {K} key - The key for the new node.
   * @param {V} value - The value for the new node.
   * @returns {NODE} - The newly created BinaryTreeNode.
   */
  createNode(key: K, value?: V): NODE {
    return new BinaryTreeNode<K, V, NODE>(key, value) as NODE;
  }

  /**
   * The function creates a binary tree with the given options.
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the `BinaryTree` class. It is of type `Partial<BinaryTreeOptions>`, which means that
   * you can provide only a subset of the properties defined in the `BinaryTreeOptions` interface.
   * @returns a new instance of a binary tree.
   */
  createTree(options?: Partial<BinaryTreeOptions<K, V, R>>): TREE {
    return new BinaryTree<K, V, R, NODE, TREE>([], { iterationType: this.iterationType, ...options }) as TREE;
  }

  /**
   * The function `keyValueOrEntryOrRawElementToNode` converts a key-value pair, entry, or raw element
   * into a node object.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @param {V} [value] - The `value` parameter is an optional value that can be passed to the
   * `keyValueOrEntryOrRawElementToNode` function. It represents the value associated with a key in a
   * key-value pair. If provided, it will be used to create a node with the specified key and value.
   * @returns The function `keyValueOrEntryOrRawElementToNode` returns either a `NODE` object, `null`,
   * or `undefined`.
   */
  keyValueOrEntryOrRawElementToNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    value?: V
  ): OptBTNOrNull<NODE> {
    if (keyOrNodeOrEntryOrRawElement === undefined) return;
    if (keyOrNodeOrEntryOrRawElement === null) return null;

    if (this.isNode(keyOrNodeOrEntryOrRawElement)) return keyOrNodeOrEntryOrRawElement;

    if (this.toEntryFn) {
      const [key, entryValue] = this.toEntryFn(keyOrNodeOrEntryOrRawElement as R);
      if (key) return this.createNode(key, entryValue ?? value);
      else return;
    }

    if (this.isEntry(keyOrNodeOrEntryOrRawElement)) {
      const [key, value] = keyOrNodeOrEntryOrRawElement;
      if (key === undefined) return;
      else if (key === null) return null;
      else return this.createNode(key, value);
    }

    if (this.isKey(keyOrNodeOrEntryOrRawElement)) return this.createNode(keyOrNodeOrEntryOrRawElement, value);

    return;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The `ensureNode` function checks if the input is a valid node and returns it, or converts it to a
   * node if it is a key or entry.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can accept a value of type `R`, `BTNKeyOrNodeOrEntry<K, V, NODE>`, or
   * a raw element.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter is an optional
   * parameter that specifies the type of iteration to be used when searching for a node. It has a
   * default value of `'ITERATIVE'`.
   * @returns The function `ensureNode` returns either a `NODE` object, `null`, or `undefined`.
   */
  ensureNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType: IterationType = 'ITERATIVE'
  ): OptBTNOrNull<NODE> {
    if (keyOrNodeOrEntryOrRawElement === null) return null;
    if (keyOrNodeOrEntryOrRawElement === undefined) return;
    if (keyOrNodeOrEntryOrRawElement === this.NIL) return;
    if (this.isNode(keyOrNodeOrEntryOrRawElement)) return keyOrNodeOrEntryOrRawElement;

    if (this.toEntryFn) {
      const [key] = this.toEntryFn(keyOrNodeOrEntryOrRawElement as R);
      if (key) return this.getNodeByKey(key);
    }

    if (this.isEntry(keyOrNodeOrEntryOrRawElement)) {
      const key = keyOrNodeOrEntryOrRawElement[0];
      if (key === null) return null;
      if (key === undefined) return;
      return this.getNodeByKey(key, iterationType);
    }

    if (this.isKey(keyOrNodeOrEntryOrRawElement)) return this.getNodeByKey(keyOrNodeOrEntryOrRawElement, iterationType);
    return;
  }

  /**
   * The function checks if the input is an instance of the BinaryTreeNode class.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyOrNodeOrEntryOrRawElement` is
   * an instance of the `BinaryTreeNode` class.
   */
  isNode(keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>): keyOrNodeOrEntryOrRawElement is NODE {
    return keyOrNodeOrEntryOrRawElement instanceof BinaryTreeNode;
  }

  /**
   * The function checks if a given node is a valid node in a binary search tree.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} node - The parameter `node` can be of type `R` or
   * `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value.
   */
  isRealNode(node: R | BTNKeyOrNodeOrEntry<K, V, NODE>): node is NODE {
    if (node === this.NIL || node === null || node === undefined) return false;
    return this.isNode(node);
  }

  /**
   * The function checks if a given node is a real node or null.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} node - The parameter `node` can be of type `R` or
   * `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value.
   */
  isNodeOrNull(node: R | BTNKeyOrNodeOrEntry<K, V, NODE>): node is NODE | null {
    return this.isRealNode(node) || node === null;
  }

  /**
   * The function checks if a given node is equal to the NIL value.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} node - The parameter `node` can be of type `R` or
   * `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value.
   */
  isNIL(node: R | BTNKeyOrNodeOrEntry<K, V, NODE>) {
    return node === this.NIL;
  }

  /**
   * The function checks if the input is an array with two elements, indicating it is a binary tree
   * node entry.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value.
   */
  isEntry(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>
  ): keyOrNodeOrEntryOrRawElement is BTNEntry<K, V> {
    return Array.isArray(keyOrNodeOrEntryOrRawElement) && keyOrNodeOrEntryOrRawElement.length === 2;
  }

  /**
   * The function checks if a given value is a valid key by evaluating its type and value.
   * @param {any} key - The `key` parameter can be of any type. It is the value that we want to check
   * if it is a valid key.
   * @param [isCheckValueOf=true] - The `isCheckValueOf` parameter is a boolean flag that determines
   * whether the function should check the valueOf() method of an object when the key is of type
   * 'object'. If `isCheckValueOf` is true, the function will recursively call itself with the value
   * returned by key.valueOf().
   * @returns a boolean value.
   */
  isKey(key: any, isCheckValueOf = true): key is K {
    if (key === null) return true;
    const keyType = typeof key;
    if (keyType === 'string' || keyType === 'bigint' || keyType === 'boolean') return true;
    if (keyType === 'number') return !isNaN(key);
    if (keyType === 'symbol' || keyType === 'undefined') return false;
    if (keyType === 'function') return this.isKey(key());
    if (keyType === 'object') {
      if (typeof key.toString === 'function') return true;
      if (isCheckValueOf && typeof key.valueOf === 'function') {
        this.isKey(key.valueOf(), false);
      }
      return false;
    }

    return false;
  }

  /**
   * Time Complexity O(n)
   * Space Complexity O(1)
   */

  /**
   * Time Complexity O(n)
   * Space Complexity O(1)
   *
   * The `add` function is used to insert a new node into a binary tree, checking for duplicate keys
   * and finding the appropriate insertion position.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The
   * `keyOrNodeOrEntryOrRawElement` parameter can accept a value of type `R`, which represents the key,
   * node, entry, or raw element to be added to the tree. It can also accept a value of type
   * `BTNKeyOrNodeOrEntry<K, V, NODE>
   * @param {V} [value] - The `value` parameter is an optional value that can be associated with the
   * key being added to the tree. It represents the value that will be stored in the tree for the given
   * key.
   * @returns a boolean value. It returns `true` if the insertion is successful, and `false` if the
   * insertion position cannot be found or if there are duplicate keys.
   */
  add(keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>, value?: V): boolean {
    const newNode = this.keyValueOrEntryOrRawElementToNode(keyOrNodeOrEntryOrRawElement, value);
    if (newNode === undefined) return false;

    // If the tree is empty, directly set the new node as the root node
    if (!this.root) {
      this._root = newNode;
      this._size = 1;
      return true;
    }

    const queue = new Queue<NODE>([this.root]);
    let potentialParent: NODE | undefined; // Record the parent node of the potential insertion location

    while (queue.size > 0) {
      const cur = queue.shift();

      if (!cur) continue;

      // Check for duplicate keys when newNode is not null
      if (newNode !== null && cur.key === newNode.key) {
        this._replaceNode(cur, newNode);
        return true; // If duplicate keys are found, no insertion is performed
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
      return true;
    }

    return false; // If the insertion position cannot be found, return undefined
  }

  /**
   * Time Complexity: O(k * n)
   * Space Complexity: O(1)
   * Comments: The time complexity for adding a node depends on the depth of the tree. In the best case (when the tree is empty), it's O(1). In the worst case (when the tree is a degenerate tree), it's O(n). The space complexity is constant.
   */

  /**
   * Time Complexity: O(k * n)
   * Space Complexity: O(1)
   *
   * The `addMany` function takes in an iterable of keys or nodes or entries or raw elements, and an
   * optional iterable of values, and adds each key or node or entry with its corresponding value to a
   * data structure, returning an array of booleans indicating whether each insertion was successful.
   * @param keysOrNodesOrEntriesOrRawElements - An iterable containing keys, nodes, entries, or raw
   * elements. These elements will be added to the data structure.
   * @param [values] - An optional iterable of values that correspond to the keys or nodes or entries
   * in the `keysOrNodesOrEntriesOrRawElements` parameter.
   * @returns The function `addMany` returns an array of booleans indicating whether each element was
   * successfully added to the data structure.
   */
  addMany(
    keysOrNodesOrEntriesOrRawElements: Iterable<R | BTNKeyOrNodeOrEntry<K, V, NODE>>,
    values?: Iterable<V | undefined>
  ): boolean[] {
    // TODO not sure addMany not be run multi times
    const inserted: boolean[] = [];

    let valuesIterator: Iterator<V | undefined> | undefined;
    if (values) {
      valuesIterator = values[Symbol.iterator]();
    }

    for (const keyOrNodeOrEntryOrRawElement of keysOrNodesOrEntriesOrRawElements) {
      let value: V | undefined | null = undefined;

      if (valuesIterator) {
        const valueResult = valuesIterator.next();
        if (!valueResult.done) {
          value = valueResult.value;
        }
      }

      inserted.push(this.add(keyOrNodeOrEntryOrRawElement, value));
    }

    return inserted;
  }

  /**
   * Time Complexity: O(k * n)
   * Space Complexity: O(1)
   * "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted.
   */

  /**
   * Time Complexity: O(k * n)
   * Space Complexity: O(1)
   *
   * The `refill` function clears the current data and adds new data to the collection.
   * @param keysOrNodesOrEntriesOrRawElements - An iterable collection of keys, nodes, entries, or raw
   * elements. These can be of any type (R) or a specific type (BTNKeyOrNodeOrEntry<K, V, NODE>).
   * @param [values] - The `values` parameter is an optional iterable of values that will be associated
   * with the keys or nodes being added. If provided, the values will be assigned to the corresponding
   * keys or nodes. If not provided, the values will be set to `undefined`.
   */
  refill(
    keysOrNodesOrEntriesOrRawElements: Iterable<R | BTNKeyOrNodeOrEntry<K, V, NODE>>,
    values?: Iterable<V | undefined>
  ): void {
    this.clear();
    this.addMany(keysOrNodesOrEntriesOrRawElements, values);
  }

  delete<C extends BTNCallback<NODE, K>>(identifier: K, callback?: C): BinaryTreeDeleteResult<NODE>[];

  delete<C extends BTNCallback<NODE, NODE>>(
    identifier: OptBTNOrNull<NODE>,
    callback?: C
  ): BinaryTreeDeleteResult<NODE>[];

  delete<C extends BTNCallback<NODE>>(identifier: ReturnType<C>, callback: C): BinaryTreeDeleteResult<NODE>[];

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The above function is a TypeScript implementation of deleting a node from a binary tree, returning
   * the deleted node and the node that needs to be balanced.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * used to identify the node that needs to be deleted from the binary tree. It can be of any type
   * that is returned by the callback function.
   * @param {C} callback - The `callback` parameter is a function that is used to determine the
   * identifier of the node to be deleted. It is of type `C`, which extends the `BTNCallback<NODE>`
   * interface. The `BTNCallback<NODE>` interface represents a callback function that takes a node of
   * type `NODE
   * @returns an array of `BinaryTreeDeleteResult<NODE>`.
   */
  delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._DEFAULT_CALLBACK as C
  ): BinaryTreeDeleteResult<NODE>[] {
    const deletedResult: BinaryTreeDeleteResult<NODE>[] = [];
    if (!this.root) return deletedResult;
    callback = this._ensureCallback(identifier, callback);

    const curr = this.getNode(identifier, callback);
    if (!curr) return deletedResult;

    const parent: NODE | undefined = curr?.parent;
    let needBalanced: NODE | undefined;
    let orgCurrent: NODE | undefined = curr;

    if (!curr.left && !curr.right && !parent) {
      this._setRoot(undefined);
    } else if (curr.left) {
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
    } else if (parent) {
      const { familyPosition: fp } = curr;
      if (fp === 'LEFT' || fp === 'ROOT_LEFT') {
        parent.left = curr.right;
      } else if (fp === 'RIGHT' || fp === 'ROOT_RIGHT') {
        parent.right = curr.right;
      }
      needBalanced = parent;
    } else {
      this._setRoot(curr.right);
      curr.right = undefined;
    }

    this._size = this.size - 1;

    deletedResult.push({ deleted: orgCurrent, needBalanced });
    return deletedResult;
  }

  getNodes<C extends BTNCallback<NODE, K>>(
    identifier: K,
    callback?: C,
    onlyOne?: boolean,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): NODE[];

  getNodes<C extends BTNCallback<NODE, NODE>>(
    identifier: OptBTNOrNull<NODE>,
    callback?: C,
    onlyOne?: boolean,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): NODE[];

  getNodes<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C>,
    callback: C,
    onlyOne?: boolean,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): NODE[];

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(k + log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(k + log n)
   *
   * The function `getNodes` returns an array of nodes that match a given identifier, using either a
   * recursive or iterative approach.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * that is used to identify the nodes. It can be of any type and is used to match against the result
   * of the callback function for each node.
   * @param {C} callback - The `callback` parameter is a function that takes a node as input and
   * returns a value. This value is used to identify the nodes that match the given identifier. The
   * `callback` function is optional and defaults to a default callback function
   * (`this._DEFAULT_CALLBACK`) if not provided.
   * @param [onlyOne=false] - A boolean value indicating whether to return only one node that matches
   * the identifier or all nodes that match the identifier. If set to true, only the first matching
   * node will be returned. If set to false, all matching nodes will be returned. The default value is
   * false.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for the search. It can be either a node object, a key-value pair, or a key. If it is not
   * provided, the `root` of the data structure is used as the starting point.
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * iteration to be performed on the nodes of a binary tree. It can have two possible values:
   * @returns an array of NODE objects.
   */
  getNodes<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
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
        if (callback(cur) === identifier) {
          ans.push(cur);
          if (onlyOne) return;
        }
        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return;
        this.isRealNode(cur.left) && dfs(cur.left);
        this.isRealNode(cur.right) && dfs(cur.right);
      };

      dfs(beginRoot);
    } else {
      const stack = [beginRoot];
      while (stack.length > 0) {
        const cur = stack.pop();
        if (this.isRealNode(cur)) {
          if (callback(cur) === identifier) {
            ans.push(cur);
            if (onlyOne) return ans;
          }
          this.isRealNode(cur.left) && stack.push(cur.left);
          this.isRealNode(cur.right) && stack.push(cur.right);
        }
      }
    }

    return ans;
  }

  getNode<C extends BTNCallback<NODE, K>>(
    identifier: K,
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): OptBTNOrNull<NODE>;

  getNode<C extends BTNCallback<NODE, NODE>>(
    identifier: OptBTNOrNull<NODE>,
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): OptBTNOrNull<NODE>;

  getNode<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C>,
    callback: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): OptBTNOrNull<NODE>;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n).
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n).
   *
   * The function `getNode` returns the first node that matches the given identifier and callback,
   * starting from the specified root node and using the specified iteration type.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * used to identify the node you want to retrieve. It can be of any type that is the return type of
   * the `C` callback function, or it can be `null` or `undefined`.
   * @param {C} callback - The `callback` parameter is a function that will be used to determine if a
   * node matches the desired criteria. It should return a value that can be used to identify the node.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for searching nodes in a tree structure. It can be either a root node, a key-value pair, or
   * a node entry. If not provided, the search will start from the root of the tree.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed when searching for nodes. It can have one of the following values:
   * @returns The method is returning a NODE object, or null, or undefined.
   */
  getNode<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._DEFAULT_CALLBACK as C,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): OptBTNOrNull<NODE> {
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
   * The function `getNodeByKey` returns a node with a specific key value from a tree structure.
   * @param {K} key - The key parameter is the value that you want to search for in the tree. It is
   * used to find the node with the matching key value.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter is an optional
   * parameter that specifies the type of iteration to be used when searching for a node in the tree.
   * It has a default value of `'ITERATIVE'`.
   * @returns a value of type NODE, null, or undefined.
   */
  getNodeByKey(key: K, iterationType: IterationType = 'ITERATIVE'): OptBTNOrNull<NODE> {
    return this.getNode(key, this._DEFAULT_CALLBACK, this.root, iterationType);
  }

  override get<C extends BTNCallback<NODE, K>>(
    identifier: K,
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): V | undefined;

  override get<C extends BTNCallback<NODE, NODE>>(
    identifier: OptBTNOrNull<NODE>,
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): V | undefined;

  override get<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C>,
    callback: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): V | undefined;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `get` in TypeScript overrides the base class method and returns the value associated
   * with the given identifier.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * used to identify the node in the binary tree. It can be of any type that is returned by the
   * callback function `C`. It can also be `null` or `undefined` if no identifier is provided.
   * @param {C} callback - The `callback` parameter is a function that will be used to determine if a
   * node matches the given identifier. It is optional and defaults to `this._DEFAULT_CALLBACK`.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for the search in the binary tree. It can be either a root node of the tree or a key, node,
   * or entry object that exists in the tree. If no specific starting point is provided, the search
   * will begin from the root of the
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed when searching for a node in the tree. It can have one of the
   * following values:
   * @returns The method is returning the value associated with the specified identifier in the binary
   * tree.
   */
  override get<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._DEFAULT_CALLBACK as C,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): V | undefined {
    return this.getNode(identifier, callback, beginRoot, iterationType)?.value;
  }

  override has<C extends BTNCallback<NODE, K>>(
    identifier: K,
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): boolean;

  override has<C extends BTNCallback<NODE, NODE>>(
    identifier: OptBTNOrNull<NODE>,
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): boolean;

  override has<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType
  ): boolean;

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The `has` function checks if a given identifier exists in the data structure and returns a boolean
   * value.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * used to identify a specific node or entry in the data structure. It can be of any type that is
   * returned by the callback function `C`. It can also be `null` or `undefined` if no specific
   * identifier is provided.
   * @param {C} callback - The `callback` parameter is a function that will be used to determine
   * whether a node should be included in the result or not. It is of type `C`, which extends the
   * `BTNCallback<NODE>` type.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for the iteration in the data structure. It can be either a root node, a key-value pair, or
   * a node entry. If not specified, it defaults to the root of the data structure.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed. It is an optional parameter with a default value of `IterationType`.
   * @returns The method is returning a boolean value.
   */
  override has<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._DEFAULT_CALLBACK as C,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): boolean {
    callback = this._ensureCallback(identifier, callback);

    return this.getNodes(identifier, callback, true, beginRoot, iterationType).length > 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Clear the binary tree, removing all nodes.
   */
  clear() {
    this._setRoot(undefined);
    this._size = 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Check if the binary tree is empty.
   * @returns {boolean} - True if the binary tree is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function checks if a binary tree is perfectly balanced by comparing the minimum height and the
   * height of the tree.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The parameter `beginRoot` is optional and
   * has a default value of `this.root`. It represents the starting point for checking if the tree is
   * perfectly balanced. It can be either a root node (`R`), a key or node or entry
   * (`BTNKeyOrNodeOrEntry<K, V, NODE
   * @returns a boolean value.
   */
  isPerfectlyBalanced(beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root): boolean {
    return this.getMinHeight(beginRoot) + 1 >= this.getHeight(beginRoot);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `isBST` checks if a binary search tree is valid, either recursively or iteratively.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter represents the
   * starting point for checking if a binary search tree (BST) is valid. It can be either a root node
   * of the BST, a key value of a node in the BST, or an entry object containing both the key and value
   * of a node in the BST
   * @param {IterationType} iterationType - The `iterationType` parameter is used to determine the type
   * of iteration to be performed while checking if the binary search tree (BST) is valid. It can have
   * two possible values:
   * @returns a boolean value.
   */
  isBST(
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): boolean {
    // TODO there is a bug
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return true;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: OptBTNOrNull<NODE>, min: number, max: number): boolean => {
        if (!this.isRealNode(cur)) return true;
        const numKey = Number(cur.key);
        if (numKey <= min || numKey >= max) return false;
        return dfs(cur.left, min, numKey) && dfs(cur.right, numKey, max);
      };

      const isStandardBST = dfs(beginRoot, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
      const isInverseBST = dfs(beginRoot, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
      return isStandardBST || isInverseBST;
    } else {
      const checkBST = (checkMax = false) => {
        const stack = [];
        let prev = checkMax ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        // @ts-ignore
        let curr: OptBTNOrNull<NODE> = beginRoot;
        while (this.isRealNode(curr) || stack.length > 0) {
          while (this.isRealNode(curr)) {
            stack.push(curr);
            curr = curr.left;
          }
          curr = stack.pop()!;
          const numKey = Number(curr.key);
          if (!this.isRealNode(curr) || (!checkMax && prev >= numKey) || (checkMax && prev <= numKey)) return false;
          prev = numKey;
          curr = curr.right;
        }
        return true;
      };
      const isStandardBST = checkBST(false),
        isInverseBST = checkBST(true);
      return isStandardBST || isInverseBST;
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
   * The function calculates the depth of a given node or key in a tree-like data structure.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} dist - The `dist` parameter can be either a `R`
   * (representing a root node), or a `BTNKeyOrNodeOrEntry<K, V, NODE>` (representing a key, node, or
   * entry).
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is optional and
   * represents the starting point from which to calculate the depth. It can be either a reference to a
   * node in the tree or a key-value pair or an entry object. If not provided, the default value is
   * `this.root`, which refers to the root node
   * @returns the depth of a node in a tree structure.
   */
  getDepth(
    dist: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root
  ): number {
    let distEnsured = this.ensureNode(dist);
    const beginRootEnsured = this.ensureNode(beginRoot);
    let depth = 0;
    while (distEnsured?.parent) {
      if (distEnsured === beginRootEnsured) {
        return depth;
      }
      depth++;
      distEnsured = distEnsured.parent;
    }
    return depth;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `getHeight` function calculates the maximum height of a binary tree using either a recursive
   * or iterative approach.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter represents the
   * starting point for calculating the height of a tree. It can be either a root node (`R`), a key or
   * node or entry (`BTNKeyOrNodeOrEntry<K, V, NODE>`), or it defaults to the root of the current tree.
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * iteration used to calculate the height of the tree. It can have two possible values:
   * @returns the maximum height of the binary tree.
   */
  getHeight(
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): number {
    beginRoot = this.ensureNode(beginRoot);
    if (!this.isRealNode(beginRoot)) return -1;

    if (iterationType === 'RECURSIVE') {
      const _getMaxHeight = (cur: OptBTNOrNull<NODE>): number => {
        if (!this.isRealNode(cur)) return -1;
        const leftHeight = _getMaxHeight(cur.left);
        const rightHeight = _getMaxHeight(cur.right);
        return Math.max(leftHeight, rightHeight) + 1;
      };

      return _getMaxHeight(beginRoot);
    } else {
      const stack: { node: NODE; depth: number }[] = [{ node: beginRoot, depth: 0 }];
      let maxHeight = 0;

      while (stack.length > 0) {
        const { node, depth } = stack.pop()!;

        if (this.isRealNode(node.left)) stack.push({ node: node.left, depth: depth + 1 });
        if (this.isRealNode(node.right)) stack.push({ node: node.right, depth: depth + 1 });

        maxHeight = Math.max(maxHeight, depth);
      }

      return maxHeight;
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The `getMinHeight` function calculates the minimum height of a binary tree using either a
   * recursive or iterative approach.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter represents the
   * starting point for calculating the minimum height of a tree. It can be either a root node (`R`), a
   * key or node or entry (`BTNKeyOrNodeOrEntry<K, V, NODE>`), or it defaults to the root of the current
   * tree.
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * iteration to be used when calculating the minimum height of the tree. It can have two possible
   * values:
   * @returns The function `getMinHeight` returns a number, which represents the minimum height of the
   * binary tree.
   */
  getMinHeight(
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): number {
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return -1;

    if (iterationType === 'RECURSIVE') {
      const _getMinHeight = (cur: OptBTNOrNull<NODE>): number => {
        if (!this.isRealNode(cur)) return 0;
        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return 0;
        const leftMinHeight = _getMinHeight(cur.left);
        const rightMinHeight = _getMinHeight(cur.right);
        return Math.min(leftMinHeight, rightMinHeight) + 1;
      };

      return _getMinHeight(beginRoot);
    } else {
      const stack: NODE[] = [];
      let node: OptBTNOrNull<NODE> = beginRoot,
        last: OptBTNOrNull<NODE> = null;
      const depths: Map<NODE, number> = new Map();

      while (stack.length > 0 || node) {
        if (this.isRealNode(node)) {
          stack.push(node);
          node = node.left;
        } else {
          node = stack[stack.length - 1];
          if (!this.isRealNode(node.right) || last === node.right) {
            node = stack.pop();
            if (this.isRealNode(node)) {
              const leftMinHeight = this.isRealNode(node.left) ? depths.get(node.left) ?? -1 : -1;
              const rightMinHeight = this.isRealNode(node.right) ? depths.get(node.right) ?? -1 : -1;
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
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function `getPathToRoot` returns an array of nodes starting from a given node and traversing
   * up to the root node, with an option to reverse the order of the nodes.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginNode - The `beginNode` parameter can be either of
   * type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @param [isReverse=true] - The `isReverse` parameter is a boolean flag that determines whether the
   * resulting path should be reversed or not. If `isReverse` is set to `true`, the path will be
   * reversed before returning it. If `isReverse` is set to `false` or not provided, the path will
   * @returns The function `getPathToRoot` returns an array of `NODE` objects.
   */
  getPathToRoot(beginNode: R | BTNKeyOrNodeOrEntry<K, V, NODE>, isReverse = true): NODE[] {
    const result: NODE[] = [];
    let beginNodeEnsured = this.ensureNode(beginNode);

    if (!beginNodeEnsured) return result;

    while (beginNodeEnsured.parent) {
      // Array.push + Array.reverse is more efficient than Array.unshift
      result.push(beginNodeEnsured);
      beginNodeEnsured = beginNodeEnsured.parent;
    }
    result.push(beginNodeEnsured);
    return isReverse ? result.reverse() : result;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `getLeftMost` function returns the leftmost node in a binary tree, either using recursive or
   * iterative traversal.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter represents the
   * starting point for finding the leftmost node in a binary tree. It can be either a root node (`R`),
   * a key or node or entry (`BTNKeyOrNodeOrEntry<K, V, NODE>`), or `null` or `undefined`.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed. It can have two possible values:
   * @returns The function `getLeftMost` returns the leftmost node in a binary tree.
   */
  getLeftMost(
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): OptBTNOrNull<NODE> {
    if (this.isNIL(beginRoot)) return beginRoot as NODE;
    beginRoot = this.ensureNode(beginRoot);

    if (!this.isRealNode(beginRoot)) return beginRoot;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE): NODE => {
        if (!this.isRealNode(cur.left)) return cur;
        return dfs(cur.left);
      };

      return dfs(beginRoot);
    } else {
      // Indirect implementation of iteration using tail recursion optimization
      const dfs = trampoline((cur: NODE) => {
        if (!this.isRealNode(cur.left)) return cur;
        return dfs.cont(cur.left);
      });

      return dfs(beginRoot);
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
   * The `getRightMost` function returns the rightmost node in a binary tree, either recursively or
   * iteratively.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter represents the
   * starting point for finding the rightmost node in a binary tree. It can be either a root node
   * (`R`), a key or node or entry (`BTNKeyOrNodeOrEntry<K, V, NODE>`), or `null` or `undefined`.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to specify the type
   * of iteration to be performed when finding the rightmost node in a binary tree. It can have two
   * possible values:
   * @returns The function `getRightMost` returns a NODE object, `null`, or `undefined`.
   */
  getRightMost(
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType
  ): OptBTNOrNull<NODE> {
    if (this.isNIL(beginRoot)) return beginRoot as NODE;
    // TODO support get right most by passing key in
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return beginRoot;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE): NODE => {
        if (!this.isRealNode(cur.right)) return cur;
        return dfs(cur.right);
      };

      return dfs(beginRoot);
    } else {
      // Indirect implementation of iteration using tail recursion optimization
      const dfs = trampoline((cur: NODE) => {
        if (!this.isRealNode(cur.right)) return cur;
        return dfs.cont(cur.right);
      });

      return dfs(beginRoot);
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
   * The function returns the predecessor node of a given node in a binary tree.
   * @param {NODE} node - The parameter "node" is of type "NODE", which represents a node in a binary
   * tree.
   * @returns the predecessor node of the given node.
   */
  getPredecessor(node: NODE): NODE {
    if (this.isRealNode(node.left)) {
      let predecessor: OptBTNOrNull<NODE> = node.left;
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
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getSuccessor` returns the next node in a binary tree given a current node.
   * @param {K | NODE | null} [x] - The parameter `x` can be of type `K`, `NODE`, or `null`.
   * @returns The function `getSuccessor` returns a `NODE` object if a successor exists, `null` if
   * there is no successor, and `undefined` if the input `x` is not a valid node.
   */
  getSuccessor(x?: K | NODE | null): OptBTNOrNull<NODE> {
    x = this.ensureNode(x);
    if (!this.isRealNode(x)) return undefined;

    if (this.isRealNode(x.right)) {
      return this.getLeftMost(x.right);
    }

    let y: OptBTNOrNull<NODE> = x.parent;
    while (this.isRealNode(y) && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  dfs<C extends BTNCallback<NODE>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  dfs<C extends BTNCallback<NODE | null>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `dfs` function performs a depth-first search traversal on a binary tree, executing a callback
   * function on each node according to a specified pattern and iteration type.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * visited during the depth-first search. It takes a node as an argument and returns a value. The
   * return type of the callback function is determined by the generic type `C`.
   * @param {DFSOrderPattern} [pattern=IN] - The `pattern` parameter determines the order in which the
   * nodes are visited during the depth-first search. It can have one of the following values:
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point of the depth-first search. It can be either a node object, a key-value pair, or a key. If it
   * is a key or key-value pair, the method will find the corresponding node in the tree and start the
   * search from there.
   * @param {IterationType} [iterationType=ITERATIVE] - The `iterationType` parameter determines the
   * type of iteration to use during the depth-first search. It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean value that determines
   * whether or not to include null values in the depth-first search traversal. If `includeNull` is set
   * to `true`, null values will be included in the traversal. If `includeNull` is set to `false`, null
   * values will
   * @returns an array of the return types of the callback function.
   */
  dfs<C extends BTNCallback<OptBTNOrNull<NODE>>>(
    callback: C = this._DEFAULT_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = 'ITERATIVE',
    includeNull = false
  ): ReturnType<C>[] {
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return [];
    const ans: ReturnType<C>[] = [];
    if (iterationType === 'RECURSIVE') {
      const dfs = (node: OptBTNOrNull<NODE>) => {
        switch (pattern) {
          case 'IN':
            if (includeNull) {
              if (this.isRealNode(node) && this.isNodeOrNull(node.left)) dfs(node.left);
              this.isNodeOrNull(node) && ans.push(callback(node));
              if (this.isRealNode(node) && this.isNodeOrNull(node.right)) dfs(node.right);
            } else {
              if (this.isRealNode(node) && this.isRealNode(node.left)) dfs(node.left);
              this.isRealNode(node) && ans.push(callback(node));
              if (this.isRealNode(node) && this.isRealNode(node.right)) dfs(node.right);
            }
            break;
          case 'PRE':
            if (includeNull) {
              this.isNodeOrNull(node) && ans.push(callback(node));
              if (this.isRealNode(node) && this.isNodeOrNull(node.left)) dfs(node.left);
              if (this.isRealNode(node) && this.isNodeOrNull(node.right)) dfs(node.right);
            } else {
              this.isRealNode(node) && ans.push(callback(node));
              if (this.isRealNode(node) && this.isRealNode(node.left)) dfs(node.left);
              if (this.isRealNode(node) && this.isRealNode(node.right)) dfs(node.right);
            }
            break;
          case 'POST':
            if (includeNull) {
              if (this.isRealNode(node) && this.isNodeOrNull(node.left)) dfs(node.left);
              if (this.isRealNode(node) && this.isNodeOrNull(node.right)) dfs(node.right);
              this.isNodeOrNull(node) && ans.push(callback(node));
            } else {
              if (this.isRealNode(node) && this.isRealNode(node.left)) dfs(node.left);
              if (this.isRealNode(node) && this.isRealNode(node.right)) dfs(node.right);
              this.isRealNode(node) && ans.push(callback(node));
            }

            break;
        }
      };

      dfs(beginRoot);
    } else {
      // 0: visit, 1: print
      const stack: { opt: 0 | 1; node: OptBTNOrNull<NODE> }[] = [{ opt: 0, node: beginRoot }];

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
            case 'IN':
              cur.node && stack.push({ opt: 0, node: cur.node.right });
              stack.push({ opt: 1, node: cur.node });
              cur.node && stack.push({ opt: 0, node: cur.node.left });
              break;
            case 'PRE':
              cur.node && stack.push({ opt: 0, node: cur.node.right });
              cur.node && stack.push({ opt: 0, node: cur.node.left });
              stack.push({ opt: 1, node: cur.node });
              break;
            case 'POST':
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

  bfs<C extends BTNCallback<NODE>>(
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  bfs<C extends BTNCallback<NODE | null>>(
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `bfs` function performs a breadth-first search on a binary tree, calling a callback function
   * on each node and returning an array of the results.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the breadth-first search traversal. It takes a single argument, which is the current node being
   * visited, and returns a value of any type.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter represents the
   * starting point of the breadth-first search. It can be either a root node of a tree or a key, node,
   * or entry object. If no value is provided, the `root` property of the class is used as the default
   * starting point.
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * iteration to be performed. It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean value that determines
   * whether or not to include null values in the breadth-first search (BFS) traversal. If
   * `includeNull` is set to `true`, null values will be included in the traversal. If `includeNull` is
   * set to `false
   * @returns The function `bfs` returns an array of values that are the result of invoking the
   * `callback` function on each node in the breadth-first order traversal of the binary tree.
   */
  bfs<C extends BTNCallback<NODE | null>>(
    callback: C = this._DEFAULT_CALLBACK as C,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return [];

    const ans: ReturnType<BTNCallback<NODE>>[] = [];

    if (iterationType === 'RECURSIVE') {
      const queue: Queue<OptBTNOrNull<NODE>> = new Queue<OptBTNOrNull<NODE>>([beginRoot]);

      const dfs = (level: number) => {
        if (queue.size === 0) return;

        const current = queue.shift()!;
        ans.push(callback(current));

        if (includeNull) {
          if (current && this.isNodeOrNull(current.left)) queue.push(current.left);
          if (current && this.isNodeOrNull(current.right)) queue.push(current.right);
        } else {
          if (this.isRealNode(current.left)) queue.push(current.left);
          if (this.isRealNode(current.right)) queue.push(current.right);
        }

        dfs(level + 1);
      };

      dfs(0);
    } else {
      const queue = new Queue<OptBTNOrNull<NODE>>([beginRoot]);
      while (queue.size > 0) {
        const levelSize = queue.size;

        for (let i = 0; i < levelSize; i++) {
          const current = queue.shift()!;
          ans.push(callback(current));

          if (includeNull) {
            if (current && this.isNodeOrNull(current.left)) queue.push(current.left);
            if (current && this.isNodeOrNull(current.right)) queue.push(current.right);
          } else {
            if (this.isRealNode(current.left)) queue.push(current.left);
            if (this.isRealNode(current.right)) queue.push(current.right);
          }
        }
      }
    }
    return ans;
  }

  listLevels<C extends BTNCallback<NODE>>(
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[][];

  listLevels<C extends BTNCallback<NODE | null>>(
    callback?: C,
    beginRoot?: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[][];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `listLevels` function returns an array of arrays, where each inner array represents a level in
   * a binary tree and contains the results of applying a callback function to the nodes at that level.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the tree. It takes a node as an argument and returns a value. The return type of the callback
   * function is determined by the generic type `C` which extends `BTNCallback<NODE | null>`.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter represents the
   * starting point for traversing the tree. It can be either a root node, a key-value pair, or a node
   * entry. If no value is provided, the `root` property of the class is used as the default starting
   * point.
   * @param {IterationType} iterationType - The `iterationType` parameter determines the type of
   * iteration to be performed on the binary tree. It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter is a boolean value that determines
   * whether or not to include null values in the resulting levels. If `includeNull` is set to `true`,
   * null values will be included in the levels. If `includeNull` is set to `false`, null values will
   * be excluded
   * @returns The function `listLevels` returns a two-dimensional array of type `ReturnType<C>[][]`.
   */
  listLevels<C extends BTNCallback<NODE | null>>(
    callback: C = this._DEFAULT_CALLBACK as C,
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root,
    iterationType: IterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[][] {
    beginRoot = this.ensureNode(beginRoot);
    const levelsNodes: ReturnType<C>[][] = [];
    if (!beginRoot) return levelsNodes;

    if (iterationType === 'RECURSIVE') {
      const _recursive = (node: NODE | null, level: number) => {
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
      const stack: [NODE | null, number][] = [[beginRoot, 0]];

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
   * Time complexity: O(n)
   * Space complexity: O(n)
   */

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `morris` function performs a depth-first traversal on a binary tree using the Morris traversal
   * algorithm.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the tree. It takes a single argument, which is the current node, and can return any value. The
   * return type of the `callback` function is determined by the `ReturnType<C>` type, which represents
   * the return
   * @param {DFSOrderPattern} [pattern=IN] - The `pattern` parameter in the `morris` function is used
   * to specify the order in which the nodes of a binary tree are traversed. It can take one of the
   * following values:
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for the traversal. It can be either a node object, a key, or an entry object. If no value is
   * provided, the `root` of the tree is used as the starting point.
   * @returns The function `morris` returns an array of values that are the return values of the
   * callback function `callback`.
   */
  morris<C extends BTNCallback<NODE>>(
    callback: C = this._DEFAULT_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root
  ): ReturnType<C>[] {
    beginRoot = this.ensureNode(beginRoot);
    if (beginRoot === null) return [];
    const ans: ReturnType<BTNCallback<NODE>>[] = [];

    let cur: OptBTNOrNull<NODE> = beginRoot;
    const _reverseEdge = (node: OptBTNOrNull<NODE>) => {
      let pre: OptBTNOrNull<NODE> = null;
      let next: OptBTNOrNull<NODE> = null;
      while (node) {
        next = node.right;
        node.right = pre;
        pre = node;
        node = next;
      }
      return pre;
    };
    const _printEdge = (node: OptBTNOrNull<NODE>) => {
      const tail: OptBTNOrNull<NODE> = _reverseEdge(node);
      let cur: OptBTNOrNull<NODE> = tail;
      while (cur) {
        ans.push(callback(cur));
        cur = cur.right;
      }
      _reverseEdge(tail);
    };
    switch (pattern) {
      case 'IN':
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
      case 'PRE':
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
      case 'POST':
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
   * The `clone` function creates a deep copy of a tree object.
   * @returns The `clone()` method is returning a cloned instance of the `TREE` object.
   */
  clone(): TREE {
    const cloned = this.createTree();
    this.bfs(
      node => {
        if (node === null) cloned.add(null);
        else cloned.add([node.key, node.value]);
      },
      this.root,
      this.iterationType,
      true
    );
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
   * The `filter` function creates a new tree with entries that pass a given predicate function.
   * @param predicate - The `predicate` parameter is a callback function that is used to test each
   * element in the tree. It takes three arguments: `value`, `key`, and `index`. The `value` argument
   * represents the value of the current element being processed, the `key` argument represents the key
   * of the
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the `predicate` function. When the `predicate` function is
   * called, `thisArg` will be used as the value of `this` within the function. If `thisArg`
   * @returns The `filter` method is returning a new tree object that contains the entries that pass
   * the given predicate function.
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
   * The `map` function creates a new tree by applying a callback function to each entry in the current
   * tree.
   * @param callback - The callback parameter is a function that will be called for each entry in the
   * tree. It takes three arguments: value, key, and index. The value argument represents the value of
   * the current entry, the key argument represents the key of the current entry, and the index
   * argument represents the index of the
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
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
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `print` function in TypeScript prints the binary tree structure with customizable options.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} beginRoot - The `beginRoot` parameter is the starting
   * point for printing the binary tree. It can be either a node of the binary tree or a key or entry
   * that exists in the binary tree. If no value is provided, the root of the binary tree will be used
   * as the starting point.
   * @param {BinaryTreePrintOptions} [options] - The `options` parameter is an optional object that
   * allows you to customize the printing behavior. It has the following properties:
   * @returns Nothing is being returned. The function has a return type of `void`, which means it does
   * not return any value.
   */
  override print(beginRoot: R | BTNKeyOrNodeOrEntry<K, V, NODE> = this.root, options?: BinaryTreePrintOptions): void {
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
      console.log(`S for Sentinel Node(NIL)
      `);

    const display = (root: OptBTNOrNull<NODE>): void => {
      const [lines, , ,] = this._displayAux(root, opts);
      for (const line of lines) {
        console.log(line);
      }
    };

    display(beginRoot);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_getIterator` is a generator function that returns an iterator for the key-value
   * pairs in a binary search tree.
   * @param node - The `node` parameter represents the current node in the binary search tree. It is
   * initially set to the root node of the tree.
   * @returns an IterableIterator<[K, V | undefined]>.
   */
  protected* _getIterator(node = this.root): IterableIterator<[K, V | undefined]> {
    if (!node) return;

    if (this.iterationType === 'ITERATIVE') {
      const stack: OptBTNOrNull<NODE>[] = [];
      let current: OptBTNOrNull<NODE> = node;

      while (current || stack.length > 0) {
        while (this.isRealNode(current)) {
          stack.push(current);
          current = current.left;
        }

        current = stack.pop();

        if (this.isRealNode(current)) {
          yield [current.key, current.value];
          current = current.right;
        }
      }
    } else {
      if (node.left && this.isRealNode(node)) {
        yield* this[Symbol.iterator](node.left);
      }
      yield [node.key, node.value];
      if (node.right && this.isRealNode(node)) {
        yield* this[Symbol.iterator](node.right);
      }
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `_displayAux` function is responsible for generating the display layout of a binary tree node,
   * taking into account various options such as whether to show null, undefined, or NaN nodes.
   * @param {OptBTNOrNull<NODE>} node - The `node` parameter represents a node in a binary tree.
   * It can be of type `NODE`, `null`, or `undefined`.
   * @param {BinaryTreePrintOptions} options - The `options` parameter is an object that contains the
   * following properties:
   * @returns The function `_displayAux` returns a `NodeDisplayLayout` which is an array containing the
   * following elements:
   * 1. `mergedLines`: An array of strings representing the lines of the node display.
   * 2. `totalWidth`: The total width of the node display.
   * 3. `totalHeight`: The total height of the node display.
   * 4. `middleIndex`: The index of the middle character
   */
  protected _displayAux(node: OptBTNOrNull<NODE>, options: BinaryTreePrintOptions): NodeDisplayLayout {
    const { isShowNull, isShowUndefined, isShowRedBlackNIL } = options;
    const emptyDisplayLayout = <NodeDisplayLayout>[['─'], 1, 0, 0];

    // Check if node is null or undefined or key is NaN
    if (node === null && !isShowNull) {
      return emptyDisplayLayout;
    } else if (node === undefined && !isShowUndefined) {
      return emptyDisplayLayout;
    } else if (this.isNIL(node) && !isShowRedBlackNIL) {
      return emptyDisplayLayout;
    } else if (node !== null && node !== undefined) {
      // Display logic of normal nodes

      const key = node.key,
        line = this.isNIL(node) ? 'S' : String(key),
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

  protected _DEFAULT_CALLBACK = (node: OptBTNOrNull<NODE>) => (node ? node.key : undefined);

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_swapProperties` swaps the key-value properties between two nodes.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} srcNode - The source node that will be swapped with the
   * destination node. It can be either an instance of the class `R`, or an object of type
   * `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} destNode - The `destNode` parameter is the node where
   * the properties will be swapped with the `srcNode`.
   * @returns either the `destNode` object with its properties swapped with the `srcNode` object's
   * properties, or `undefined` if either `srcNode` or `destNode` is falsy.
   */
  protected _swapProperties(
    srcNode: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    destNode: R | BTNKeyOrNodeOrEntry<K, V, NODE>
  ): NODE | undefined {
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function replaces a node in a binary tree with a new node, updating the parent, left child,
   * right child, and root if necessary.
   * @param {NODE} oldNode - The oldNode parameter represents the node that needs to be replaced in the
   * tree.
   * @param {NODE} newNode - The `newNode` parameter is the node that will replace the `oldNode` in the
   * tree.
   * @returns the newNode.
   */
  protected _replaceNode(oldNode: NODE, newNode: NODE): NODE {
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function sets the root property of an object to the provided value, and also updates the
   * parent property of the new root.
   * @param {OptBTNOrNull<NODE>} v - The parameter `v` is of type `OptBTNOrNull<NODE>`. This
   * means that it can accept a value of type `NODE`, `null`, or `undefined`.
   */
  protected _setRoot(v: OptBTNOrNull<NODE>) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_ensureCallback` ensures that a callback function is provided and returns it.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is of type
   * `ReturnType<C> | null | undefined`. This means it can accept a value that is the return type of
   * the generic type `C`, or it can be `null` or `undefined`.
   * @param {C} callback - The `callback` parameter is a function that takes a `node` as an argument
   * and returns a value. It is of type `C`, which is a generic type that extends the
   * `BTNCallback<NODE>` type.
   * @returns the callback parameter.
   */
  protected _ensureCallback<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._DEFAULT_CALLBACK as C
  ): C {
    if ((!callback || callback === this._DEFAULT_CALLBACK) && this.isNode(identifier)) {
      callback = (node => node) as C;
    }

    return callback;
  }
}
