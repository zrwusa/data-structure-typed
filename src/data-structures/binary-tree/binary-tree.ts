/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import {
  BinaryTreeDeleteResult,
  BinaryTreeNested,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  BinaryTreePrintOptions,
  BTNEntry,
  BTNRep,
  DFSOrderPattern,
  DFSStackItem,
  EntryCallback,
  FamilyPosition,
  IterationType,
  NodeCallback,
  NodeDisplayLayout,
  NodePredicate,
  OptNodeOrNull,
  ToEntryFn
} from '../../types';
import { IBinaryTree } from '../../interfaces';
import { isComparable, trampoline } from '../../utils';
import { Queue } from '../queue';
import { IterableEntryBase } from '../base';
import { DFSOperation, Range } from '../../common';

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

  constructor(key: K, value?: V) {
    this.key = key;
    this.value = value;
  }

  protected _left?: OptNodeOrNull<NODE>;

  get left(): OptNodeOrNull<NODE> {
    return this._left;
  }

  set left(v: OptNodeOrNull<NODE>) {
    if (v) {
      v.parent = this as unknown as NODE;
    }
    this._left = v;
  }

  protected _right?: OptNodeOrNull<NODE>;

  get right(): OptNodeOrNull<NODE> {
    return this._right;
  }

  set right(v: OptNodeOrNull<NODE>) {
    if (v) {
      v.parent = this as unknown as NODE;
    }
    this._right = v;
  }

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
    R = object,
    NODE extends BinaryTreeNode<K, V, NODE> = BinaryTreeNode<K, V, BinaryTreeNodeNested<K, V>>,
    TREE extends BinaryTree<K, V, R, NODE, TREE> = BinaryTree<K, V, R, NODE, BinaryTreeNested<K, V, R, NODE>>
  >
  extends IterableEntryBase<K, V | undefined>
  implements IBinaryTree<K, V, R, NODE, TREE>
{
  iterationType: IterationType = 'ITERATIVE';

  /**
   * The constructor initializes a binary tree with optional options and adds keys, nodes, entries, or
   * raw data if provided.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter in the constructor
   * is an iterable that can contain elements of type `BTNRep<K, V, NODE>` or `R`. It is
   * initialized with an empty array `[]` by default.
   * @param [options] - The `options` parameter in the constructor is an object that can contain the
   * following properties:
   */
  constructor(keysNodesEntriesOrRaws: Iterable<BTNRep<K, V, NODE> | R> = [], options?: BinaryTreeOptions<K, V, R>) {
    super();
    if (options) {
      const { iterationType, toEntryFn, isMapMode } = options;
      if (iterationType) this.iterationType = iterationType;
      if (isMapMode !== undefined) this._isMapMode = isMapMode;
      if (typeof toEntryFn === 'function') this._toEntryFn = toEntryFn;
      else if (toEntryFn) throw TypeError('toEntryFn must be a function type');
    }

    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
  }

  protected _isMapMode = true;

  get isMapMode() {
    return this._isMapMode;
  }

  protected _store = new Map<K, V | undefined>();

  get store() {
    return this._store;
  }

  protected _root?: OptNodeOrNull<NODE>;

  get root(): OptNodeOrNull<NODE> {
    return this._root;
  }

  protected _size: number = 0;

  get size(): number {
    return this._size;
  }

  protected _NIL: NODE = new BinaryTreeNode<K, V>(NaN as K) as unknown as NODE;

  get NIL(): NODE {
    return this._NIL;
  }

  protected _toEntryFn?: ToEntryFn<K, V, R>;

  get toEntryFn() {
    return this._toEntryFn;
  }

  /**
   * The function creates a new binary tree node with a specified key and optional value.
   * @param {K} key - The `key` parameter is the key of the node being created in the binary tree.
   * @param {V} [value] - The `value` parameter in the `createNode` function is optional, meaning it is
   * not required to be provided when calling the function. If a `value` is provided, it should be of
   * type `V`, which is the type of the value associated with the node.
   * @returns A new BinaryTreeNode instance with the provided key and value is being returned, casted
   * as NODE.
   */
  createNode(key: K, value?: V): NODE {
    return new BinaryTreeNode<K, V, NODE>(key, this._isMapMode ? undefined : value) as NODE;
  }

  /**
   * The function creates a binary tree with the specified options.
   * @param [options] - The `options` parameter in the `createTree` function is an optional parameter
   * that allows you to provide partial configuration options for creating a binary tree. It is of type
   * `Partial<BinaryTreeOptions<K, V, R>>`, which means you can pass in an object containing a subset
   * of properties
   * @returns A new instance of a binary tree with the specified options is being returned.
   */
  createTree(options?: BinaryTreeOptions<K, V, R>): TREE {
    return new BinaryTree<K, V, R, NODE, TREE>([], {
      iterationType: this.iterationType,
      isMapMode: this._isMapMode,
      toEntryFn: this._toEntryFn,
      ...options
    }) as TREE;
  }

  /**
   * The function `keyValueNodeEntryRawToNodeAndValue` converts various input types into a node object
   * or returns null.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The
   * `keyValueNodeEntryRawToNodeAndValue` function takes in a parameter `keyNodeEntryOrRaw`, which
   * can be of type `BTNRep<K, V, NODE>` or `R`. This parameter represents either a key, a
   * node, an entry
   * @param {V} [value] - The `value` parameter in the `keyValueNodeEntryRawToNodeAndValue` function is
   * an optional parameter of type `V`. It represents the value associated with the key in the node
   * being created. If a `value` is provided, it will be used when creating the node. If
   * @returns The `keyValueNodeEntryRawToNodeAndValue` function returns an optional node
   * (`OptNodeOrNull<NODE>`) based on the input parameters provided. The function checks the type of the
   * input parameter (`keyNodeEntryOrRaw`) and processes it accordingly to return a node or null
   * value.
   */
  keyValueNodeEntryRawToNodeAndValue(
    keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R,
    value?: V
  ): [OptNodeOrNull<NODE>, V | undefined] {
    if (keyNodeEntryOrRaw === undefined) return [undefined, undefined];
    if (keyNodeEntryOrRaw === null) return [null, undefined];

    if (this.isNode(keyNodeEntryOrRaw)) return [keyNodeEntryOrRaw, value];

    if (this.isEntry(keyNodeEntryOrRaw)) {
      const [key, entryValue] = keyNodeEntryOrRaw;
      if (key === undefined) return [undefined, undefined];
      else if (key === null) return [null, undefined];
      const finalValue = value ?? entryValue;
      return [this.createNode(key, finalValue), finalValue];
    }

    if (this.isRaw(keyNodeEntryOrRaw)) {
      const [key, entryValue] = this._toEntryFn!(keyNodeEntryOrRaw);
      const finalValue = value ?? entryValue;
      if (this.isKey(key)) return [this.createNode(key, finalValue), finalValue];
    }

    if (this.isKey(keyNodeEntryOrRaw)) return [this.createNode(keyNodeEntryOrRaw, value), value];

    return [undefined, undefined];
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `ensureNode` in TypeScript checks if a given input is a node, entry, key, or raw
   * value and returns the corresponding node or null.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The `keyNodeEntryOrRaw`
   * parameter in the `ensureNode` function can be of type `BTNRep<K, V, NODE>` or `R`. It
   * is used to determine whether the input is a key, node, entry, or raw data. The
   * @param {IterationType} iterationType - The `iterationType` parameter in the `ensureNode` function
   * is used to specify the type of iteration to be performed. It has a default value of
   * `this.iterationType` if not explicitly provided.
   * @returns The `ensureNode` function returns either a node, `null`, or `undefined` based on the
   * conditions specified in the code snippet.
   */
  ensureNode(
    keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R,
    iterationType: IterationType = this.iterationType
  ): OptNodeOrNull<NODE> {
    if (keyNodeEntryOrRaw === null) return null;
    if (keyNodeEntryOrRaw === undefined) return;
    if (keyNodeEntryOrRaw === this._NIL) return;
    if (this.isNode(keyNodeEntryOrRaw)) return keyNodeEntryOrRaw;

    if (this.isEntry(keyNodeEntryOrRaw)) {
      const key = keyNodeEntryOrRaw[0];
      if (key === null) return null;
      if (key === undefined) return;
      return this.getNodeByKey(key, iterationType);
    }

    if (this._toEntryFn) {
      const [key] = this._toEntryFn(keyNodeEntryOrRaw as R);
      if (this.isKey(key)) return this.getNodeByKey(key);
    }

    if (this.isKey(keyNodeEntryOrRaw)) return this.getNodeByKey(keyNodeEntryOrRaw, iterationType);
    return;
  }

  /**
   * The function isNode checks if the input is an instance of BinaryTreeNode.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The parameter
   * `keyNodeEntryOrRaw` can be either a key, a node, an entry, or raw data. The function is
   * checking if the input is an instance of a `BinaryTreeNode` and returning a boolean value
   * accordingly.
   * @returns The function `isNode` is checking if the input `keyNodeEntryOrRaw` is an instance of
   * `BinaryTreeNode`. If it is, the function returns `true`, indicating that the input is a node. If
   * it is not an instance of `BinaryTreeNode`, the function returns `false`, indicating that the input
   * is not a node.
   */
  isNode(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): keyNodeEntryOrRaw is NODE {
    return keyNodeEntryOrRaw instanceof BinaryTreeNode;
  }

  /**
   * The function `isRaw` checks if the input parameter is of type `R` by verifying if it is an object.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - BTNRep<K, V, NODE> | R
   * @returns The function `isRaw` is checking if the `keyNodeEntryOrRaw` parameter is of type `R` by
   * checking if it is an object. If the parameter is an object, the function will return `true`,
   * indicating that it is of type `R`.
   */
  isRaw(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): keyNodeEntryOrRaw is R {
    return this._toEntryFn !== undefined && typeof keyNodeEntryOrRaw === 'object';
  }

  /**
   * The function `isRealNode` checks if a given input is a valid node in a binary tree.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The `keyNodeEntryOrRaw`
   * parameter in the `isRealNode` function can be of type `BTNRep<K, V, NODE>` or `R`.
   * The function checks if the input parameter is a `NODE` type by verifying if it is not equal
   * @returns The function `isRealNode` is checking if the input `keyNodeEntryOrRaw` is a valid
   * node by comparing it to `this._NIL`, `null`, and `undefined`. If the input is not one of these
   * values, it then calls the `isNode` method to further determine if the input is a node. The
   * function will return a boolean value indicating whether the
   */
  isRealNode(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): keyNodeEntryOrRaw is NODE {
    if (keyNodeEntryOrRaw === this._NIL || keyNodeEntryOrRaw === null || keyNodeEntryOrRaw === undefined) return false;
    return this.isNode(keyNodeEntryOrRaw);
  }

  /**
   * The function checks if a given input is a valid node or null.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The parameter
   * `keyNodeEntryOrRaw` in the `isRealNodeOrNull` function can be of type `BTNRep<K,
   * V, NODE>` or `R`. It is a union type that can either be a key, a node, an entry, or
   * @returns The function `isRealNodeOrNull` is returning a boolean value. It checks if the input
   * `keyNodeEntryOrRaw` is either `null` or a real node, and returns `true` if it is a node or
   * `null`, and `false` otherwise.
   */
  isRealNodeOrNull(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): keyNodeEntryOrRaw is NODE | null {
    return keyNodeEntryOrRaw === null || this.isRealNode(keyNodeEntryOrRaw);
  }

  /**
   * The function isNIL checks if a given key, node, entry, or raw value is equal to the _NIL value.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - BTNRep<K, V,
   * NODE> | R
   * @returns The function is checking if the `keyNodeEntryOrRaw` parameter is equal to the `_NIL`
   * property of the current object and returning a boolean value based on that comparison.
   */
  isNIL(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): boolean {
    return keyNodeEntryOrRaw === this._NIL;
  }

  isRange(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R | NodePredicate<NODE> | Range<K>
  ): keyNodeEntryRawOrPredicate is Range<K> {
    return keyNodeEntryRawOrPredicate instanceof Range;
  }

  /**
   * The function determines whether a given key, node, entry, or raw data is a leaf node in a binary
   * tree.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The parameter
   * `keyNodeEntryOrRaw` can be of type `BTNRep<K, V, NODE>` or `R`. It represents a
   * key, node, entry, or raw data in a binary tree structure. The function `isLeaf` checks whether the
   * provided
   * @returns The function `isLeaf` returns a boolean value indicating whether the input
   * `keyNodeEntryOrRaw` is a leaf node in a binary tree.
   */
  isLeaf(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): boolean {
    keyNodeEntryOrRaw = this.ensureNode(keyNodeEntryOrRaw);
    if (keyNodeEntryOrRaw === undefined) return false;
    if (keyNodeEntryOrRaw === null) return true;
    return !this.isRealNode(keyNodeEntryOrRaw.left) && !this.isRealNode(keyNodeEntryOrRaw.right);
  }

  /**
   * The function `isEntry` checks if the input is a BTNEntry object by verifying if it is an array
   * with a length of 2.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The `keyNodeEntryOrRaw`
   * parameter in the `isEntry` function can be of type `BTNRep<K, V, NODE>` or type `R`.
   * The function checks if the provided `keyNodeEntryOrRaw` is of type `BTN
   * @returns The `isEntry` function is checking if the `keyNodeEntryOrRaw` parameter is an array
   * with a length of 2. If it is, then it returns `true`, indicating that the parameter is of type
   * `BTNEntry<K, V>`. If the condition is not met, it returns `false`.
   */
  isEntry(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): keyNodeEntryOrRaw is BTNEntry<K, V> {
    return Array.isArray(keyNodeEntryOrRaw) && keyNodeEntryOrRaw.length === 2;
  }

  /**
   * Time Complexity O(1)
   * Space Complexity O(1)
   *
   * The function `isKey` checks if a given key is comparable.
   * @param {any} key - The `key` parameter is of type `any`, which means it can be any data type in
   * TypeScript.
   * @returns The function `isKey` is checking if the `key` parameter is `null` or if it is comparable.
   * If the `key` is `null`, the function returns `true`. Otherwise, it returns the result of the
   * `isComparable` function, which is not provided in the code snippet.
   */
  isKey(key: any): key is K {
    if (key === null) return true;
    return isComparable(key);
  }

  /**
   * Time Complexity O(n)
   * Space Complexity O(1)
   *
   * The `add` function in TypeScript adds a new node to a binary tree while handling duplicate keys
   * and finding the correct insertion position.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The `add` method you provided
   * seems to be for adding a new node to a binary tree structure. The `keyNodeEntryOrRaw`
   * parameter in the method can accept different types of values:
   * @param {V} [value] - The `value` parameter in the `add` method represents the value associated
   * with the key that you want to add to the binary tree. When adding a key-value pair to the binary
   * tree, you provide the key and its corresponding value. The `add` method then creates a new node
   * with this
   * @returns The `add` method returns a boolean value. It returns `true` if the insertion of the new
   * node was successful, and `false` if the insertion position could not be found or if a duplicate
   * key was found and the node was replaced instead of inserted.
   */
  add(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R, value?: V): boolean {
    const [newNode, newValue] = this.keyValueNodeEntryRawToNodeAndValue(keyNodeEntryOrRaw, value);
    if (newNode === undefined) return false;

    // If the tree is empty, directly set the new node as the root node
    if (!this._root) {
      this._setRoot(newNode);
      if (this._isMapMode) this._setValue(newNode?.key, newValue);
      this._size = 1;
      return true;
    }

    const queue = new Queue<NODE>([this._root]);
    let potentialParent: NODE | undefined; // Record the parent node of the potential insertion location

    while (queue.size > 0) {
      const cur = queue.shift();

      if (!cur) continue;

      // Check for duplicate keys when newNode is not null
      if (newNode !== null && cur.key === newNode.key) {
        this._replaceNode(cur, newNode);
        if (this._isMapMode) this._setValue(cur.key, newValue);
        return true; // If duplicate keys are found, no insertion is performed
      }

      // Record the first possible insertion location found
      if (potentialParent === undefined && (cur.left === undefined || cur.right === undefined)) {
        potentialParent = cur;
      }

      // Continue traversing the left and right subtrees
      if (cur.left !== null) {
        if (cur.left) queue.push(cur.left);
      }
      if (cur.right !== null) {
        if (cur.right) queue.push(cur.right);
      }
    }

    // At the end of the traversal, if the insertion position is found, insert
    if (potentialParent) {
      if (potentialParent.left === undefined) {
        potentialParent.left = newNode;
      } else if (potentialParent.right === undefined) {
        potentialParent.right = newNode;
      }
      if (this._isMapMode) this._setValue(newNode?.key, newValue);
      this._size++;
      return true;
    }

    return false; // If the insertion position cannot be found, return undefined
  }

  /**
   * Time Complexity: O(k * n)
   * Space Complexity: O(1)
   *
   * The `addMany` function takes in multiple keys or nodes or entries or raw values along with
   * optional values, and adds them to a data structure while returning an array indicating whether
   * each insertion was successful.
   * @param keysNodesEntriesOrRaws - `keysNodesEntriesOrRaws` is an iterable that can contain a
   * mix of keys, nodes, entries, or raw values. Each element in this iterable can be of type
   * `BTNRep<K, V, NODE>` or `R`.
   * @param [values] - The `values` parameter in the `addMany` function is an optional parameter that
   * accepts an iterable of values. These values correspond to the keys or nodes being added in the
   * `keysNodesEntriesOrRaws` parameter. If provided, the function will iterate over the values and
   * assign them
   * @returns The `addMany` method returns an array of boolean values indicating whether each key,
   * node, entry, or raw value was successfully added to the data structure. Each boolean value
   * corresponds to the success of adding the corresponding key or value in the input iterable.
   */
  addMany(keysNodesEntriesOrRaws: Iterable<BTNRep<K, V, NODE> | R>, values?: Iterable<V | undefined>): boolean[] {
    // TODO not sure addMany not be run multi times
    const inserted: boolean[] = [];

    let valuesIterator: Iterator<V | undefined> | undefined;
    if (values) {
      valuesIterator = values[Symbol.iterator]();
    }

    for (const keyNodeEntryOrRaw of keysNodesEntriesOrRaws) {
      let value: V | undefined | null = undefined;

      if (valuesIterator) {
        const valueResult = valuesIterator.next();
        if (!valueResult.done) {
          value = valueResult.value;
        }
      }

      inserted.push(this.add(keyNodeEntryOrRaw, value));
    }

    return inserted;
  }

  /**
   * Time Complexity: O(k * n)
   * Space Complexity: O(1)
   */
  merge(anotherTree: BinaryTree<K, V, R, NODE, TREE>) {
    this.addMany(anotherTree, []);
  }

  /**
   * Time Complexity: O(k * n)
   * Space Complexity: O(1)
   *
   * The `refill` function clears the existing data structure and then adds new key-value pairs based
   * on the provided input.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter in the `refill`
   * method can accept an iterable containing a mix of `BTNRep<K, V, NODE>` objects or `R`
   * objects.
   * @param [values] - The `values` parameter in the `refill` method is an optional parameter that
   * accepts an iterable of values of type `V` or `undefined`.
   */
  refill(keysNodesEntriesOrRaws: Iterable<BTNRep<K, V, NODE> | R>, values?: Iterable<V | undefined>): void {
    this.clear();
    this.addMany(keysNodesEntriesOrRaws, values);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `delete` in TypeScript implements the deletion of a node in a binary tree and returns
   * the deleted node along with information for tree balancing.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw
   * - The `delete` method you provided is used to delete a node from a binary tree based on the key,
   * node, entry or raw data. The method returns an array of
   * `BinaryTreeDeleteResult` objects containing information about the deleted node and whether
   * balancing is needed.
   * @returns The `delete` method returns an array of `BinaryTreeDeleteResult` objects. Each object in
   * the array contains information about the node that was deleted (`deleted`) and the node that may
   * need to be balanced (`needBalanced`).
   */
  delete(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): BinaryTreeDeleteResult<NODE>[] {
    const deletedResult: BinaryTreeDeleteResult<NODE>[] = [];
    if (!this._root) return deletedResult;

    const curr = this.getNode(keyNodeEntryOrRaw);
    if (!curr) return deletedResult;

    const parent: NODE | undefined = curr?.parent;
    let needBalanced: NODE | undefined;
    let orgCurrent: NODE | undefined = curr;

    if (!curr.left && !curr.right && !parent) {
      this._setRoot(undefined);
    } else if (curr.left) {
      const leftSubTreeRightMost = this.getRightMost(node => node, curr.left);
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

    this._size = this._size - 1;

    deletedResult.push({ deleted: orgCurrent, needBalanced });
    if (this._isMapMode && orgCurrent) this._store.delete(orgCurrent.key);
    return deletedResult;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(k + log n)
   *
   * The `search` function in TypeScript performs a depth-first or breadth-first search on a tree
   * structure based on a given predicate or key, with options to return multiple results or just one.
   * @param {BTNRep<K, V, NODE> | R | NodePredicate<NODE>} keyNodeEntryRawOrPredicate - The
   * `keyNodeEntryRawOrPredicate` parameter in the `search` function can accept three types of values:
   * @param [onlyOne=false] - The `onlyOne` parameter in the `search` function is a boolean flag that
   * determines whether the search should stop after finding the first matching node. If `onlyOne` is
   * set to `true`, the search will return as soon as a matching node is found. If `onlyOne` is
   * @param {C} callback - The `callback` parameter in the `search` function is a callback function
   * that will be called on each node that matches the search criteria. It is of type `C`, which
   * extends `NodeCallback<NODE>`. The default value for `callback` is `this._DEFAULT_NODE_CALLBACK` if
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `search` function is
   * used to specify the node from which the search operation should begin. It represents the starting
   * point in the binary tree where the search will be performed. If no specific `startNode` is
   * provided, the search operation will start from the root
   * @param {IterationType} iterationType - The `iterationType` parameter in the `search` function
   * specifies the type of iteration to be used when searching for nodes in a binary tree. It can have
   * two possible values:
   * @returns The `search` function returns an array of values that match the provided criteria based
   * on the search algorithm implemented within the function.
   */
  search<C extends NodeCallback<NODE>>(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R | NodePredicate<NODE>,
    onlyOne = false,
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    if (keyNodeEntryRawOrPredicate === undefined) return [];
    if (keyNodeEntryRawOrPredicate === null) return [];
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    const predicate = this._ensurePredicate(keyNodeEntryRawOrPredicate);

    const ans: ReturnType<C>[] = [];

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE) => {
        if (predicate(cur)) {
          ans.push(callback(cur));
          if (onlyOne) return;
        }
        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return;
        if (this.isRealNode(cur.left)) dfs(cur.left);
        if (this.isRealNode(cur.right)) dfs(cur.right);
      };

      dfs(startNode);
    } else {
      const stack = [startNode];
      while (stack.length > 0) {
        const cur = stack.pop();
        if (this.isRealNode(cur)) {
          if (predicate(cur)) {
            ans.push(callback(cur));
            if (onlyOne) return ans;
          }
          if (this.isRealNode(cur.left)) stack.push(cur.left);
          if (this.isRealNode(cur.right)) stack.push(cur.right);
        }
      }
    }

    return ans;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(k + log n)
   *
   * The function `getNodes` retrieves nodes from a binary tree based on a key, node, entry, raw data,
   * or predicate, with options for recursive or iterative traversal.
   * @param {BTNRep<K, V, NODE> | R | NodePredicate<NODE>} keyNodeEntryRawOrPredicate
   * - The `getNodes` function you provided takes several parameters:
   * @param [onlyOne=false] - The `onlyOne` parameter in the `getNodes` function is a boolean flag that
   * determines whether to return only the first node that matches the criteria specified by the
   * `keyNodeEntryRawOrPredicate` parameter. If `onlyOne` is set to `true`, the function will
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `getNodes` function is used to specify the starting point for traversing the binary tree. It
   * represents the root node of the binary tree or the node from which the traversal should begin. If
   * not provided, the default value is set to `this._root
   * @param {IterationType} iterationType - The `iterationType` parameter in the `getNodes` function
   * determines the type of iteration to be performed when traversing the nodes of a binary tree. It
   * can have two possible values:
   * @returns The `getNodes` function returns an array of nodes that satisfy the provided condition
   * based on the input parameters and the iteration type specified.
   */
  getNodes(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R | NodePredicate<NODE>,
    onlyOne = false,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): NODE[] {
    return this.search(keyNodeEntryRawOrPredicate, onlyOne, node => node, startNode, iterationType);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n).
   *
   * The `getNode` function retrieves a node based on the provided key, node, entry, raw data, or
   * predicate.
   * @param {BTNRep<K, V, NODE> | R | NodePredicate<NODE>} keyNodeEntryRawOrPredicate
   * - The `keyNodeEntryRawOrPredicate` parameter in the `getNode` function can accept a key,
   * node, entry, raw data, or a predicate function.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `getNode` function is used to specify the starting point for searching for a node in a binary
   * tree. If no specific starting point is provided, the default value is set to `this._root`, which
   * is typically the root node of the binary tree.
   * @param {IterationType} iterationType - The `iterationType` parameter in the `getNode` method is
   * used to specify the type of iteration to be performed when searching for a node. It has a default
   * value of `this.iterationType`, which means it will use the iteration type defined in the current
   * context if no specific value is provided
   * @returns The `getNode` function is returning the first node that matches the specified criteria,
   * or `null` if no matching node is found.
   */
  getNode(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R | NodePredicate<NODE>,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): OptNodeOrNull<NODE> {
    return this.search(keyNodeEntryRawOrPredicate, true, node => node, startNode, iterationType)[0] ?? null;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function `getNodeByKey` retrieves a node by its key from a binary tree structure.
   * @param {K} key - The `key` parameter is the value used to search for a specific node in a data
   * structure.
   * @param {IterationType} iterationType - The `iterationType` parameter is a type of iteration that
   * specifies how the tree nodes should be traversed when searching for a node with the given key. It
   * is an optional parameter with a default value of `this.iterationType`.
   * @returns The `getNodeByKey` function is returning an optional binary tree node
   * (`OptNodeOrNull<NODE>`).
   */
  getNodeByKey(key: K, iterationType: IterationType = this.iterationType): OptNodeOrNull<NODE> {
    return this.getNode(key, this._root, iterationType);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * This function overrides the `get` method to retrieve the value associated with a specified key,
   * node, entry, raw data, or predicate in a data structure.
   * @param {BTNRep<K, V, NODE> | R | NodePredicate<NODE>} keyNodeEntryRawOrPredicate
   * - The `keyNodeEntryRawOrPredicate` parameter in the `get` method can accept one of the
   * following types:
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `get`
   * method is used to specify the starting point for searching for a key or node in the binary tree.
   * If no specific starting point is provided, the default starting point is the root of the binary
   * tree (`this._root`).
   * @param {IterationType} iterationType - The `iterationType` parameter in the `get` method is used
   * to specify the type of iteration to be performed when searching for a key in the binary tree. It
   * is an optional parameter with a default value of `this.iterationType`, which means it will use the
   * iteration type defined in the
   * @returns The `get` method is returning the value associated with the specified key, node, entry,
   * raw data, or predicate in the binary tree map. If the specified key or node is found in the tree,
   * the method returns the corresponding value. If the key or node is not found, it returns
   * `undefined`.
   */
  override get(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): V | undefined {
    if (this._isMapMode) {
      const key = this._extractKey(keyNodeEntryRawOrPredicate);
      if (key === null || key === undefined) return;
      return this._store.get(key);
    }
    return this.getNode(keyNodeEntryRawOrPredicate, startNode, iterationType)?.value;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The `has` function in TypeScript checks if a specified key, node, entry, raw data, or predicate
   * exists in the data structure.
   * @param {BTNRep<K, V, NODE> | R | NodePredicate<NODE>} keyNodeEntryRawOrPredicate
   * - The `keyNodeEntryRawOrPredicate` parameter in the `override has` method can accept one of
   * the following types:
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `override` method is used to specify the starting point for the search operation within the data
   * structure. It defaults to `this._root` if not provided explicitly.
   * @param {IterationType} iterationType - The `iterationType` parameter in the `override has` method
   * is used to specify the type of iteration to be performed. It has a default value of
   * `this.iterationType`, which means it will use the iteration type defined in the current context if
   * no value is provided when calling the method.
   * @returns The `override has` method is returning a boolean value. It checks if there are any nodes
   * that match the provided key, node, entry, raw data, or predicate in the tree structure. If there
   * are matching nodes, it returns `true`, indicating that the tree contains the specified element.
   * Otherwise, it returns `false`.
   */
  override has(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R | NodePredicate<NODE>,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): boolean {
    return this.search(keyNodeEntryRawOrPredicate, true, node => node, startNode, iterationType).length > 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `clear` function resets the root node and size of a data structure to empty.
   */
  clear() {
    this._clearNodes();
    if (this._isMapMode) this._clearValues();
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `isEmpty` function in TypeScript checks if a data structure has no elements and returns a
   * boolean value.
   * @returns The `isEmpty()` method is returning a boolean value, specifically `true` if the `_size`
   * property is equal to 0, indicating that the data structure is empty, and `false` otherwise.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * The function checks if a binary tree is perfectly balanced by comparing its minimum height with
   * its height.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter is the starting
   * point for checking if the binary tree is perfectly balanced. It represents the root node of the
   * binary tree or a specific node from which the balance check should begin.
   * @returns The method `isPerfectlyBalanced` is returning a boolean value, which indicates whether
   * the tree starting from the `startNode` node is perfectly balanced or not. The return value is
   * determined by comparing the minimum height of the tree with the height of the tree. If the minimum
   * height plus 1 is greater than or equal to the height of the tree, then it is considered perfectly
   * balanced and
   */
  isPerfectlyBalanced(startNode: BTNRep<K, V, NODE> | R = this._root): boolean {
    return this.getMinHeight(startNode) + 1 >= this.getHeight(startNode);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `isBST` in TypeScript checks if a binary search tree is valid using either recursive
   * or iterative methods.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `isBST`
   * function represents the starting point for checking whether a binary search tree (BST) is valid.
   * It can be a node in the BST or a reference to the root of the BST. If no specific node is
   * provided, the function will default to
   * @param {IterationType} iterationType - The `iterationType` parameter in the `isBST` function
   * determines whether the function should use a recursive approach or an iterative approach to check
   * if the binary search tree (BST) is valid.
   * @returns The `isBST` method is returning a boolean value, which indicates whether the binary
   * search tree (BST) represented by the given root node is a valid BST or not. The method checks if
   * the tree satisfies the BST property, where for every node, all nodes in its left subtree have keys
   * less than the node's key, and all nodes in its right subtree have keys greater than the node's
   */
  isBST(startNode: BTNRep<K, V, NODE> | R = this._root, iterationType: IterationType = this.iterationType): boolean {
    // TODO there is a bug
    startNode = this.ensureNode(startNode);
    if (!startNode) return true;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: OptNodeOrNull<NODE>, min: number, max: number): boolean => {
        if (!this.isRealNode(cur)) return true;
        const numKey = Number(cur.key);
        if (numKey <= min || numKey >= max) return false;
        return dfs(cur.left, min, numKey) && dfs(cur.right, numKey, max);
      };

      const isStandardBST = dfs(startNode, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
      const isInverseBST = dfs(startNode, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
      return isStandardBST || isInverseBST;
    } else {
      const checkBST = (checkMax = false) => {
        const stack = [];
        let prev = checkMax ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        // @ts-ignore
        let curr: OptNodeOrNull<NODE> = startNode;
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
   *
   * The `getDepth` function calculates the depth between two nodes in a binary tree.
   * @param {BTNRep<K, V, NODE> | R} dist - The `dist` parameter in the `getDepth`
   * function represents the node or entry in a binary tree map, or a reference to a node in the tree.
   * It is the target node for which you want to calculate the depth from the `startNode` node.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `getDepth` function represents the starting point from which you want to calculate the depth of a
   * given node or entry in a binary tree. If no specific starting point is provided, the default value
   * for `startNode` is set to the root of the binary
   * @returns The `getDepth` method returns the depth of a given node `dist` relative to the
   * `startNode` node in a binary tree. If the `dist` node is not found in the path to the `startNode`
   * node, it returns the depth of the `dist` node from the root of the tree.
   */
  getDepth(dist: BTNRep<K, V, NODE> | R, startNode: BTNRep<K, V, NODE> | R = this._root): number {
    let distEnsured = this.ensureNode(dist);
    const beginRootEnsured = this.ensureNode(startNode);
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
   *
   * The `getHeight` function calculates the maximum height of a binary tree using either a recursive
   * or iterative approach in TypeScript.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter is the starting
   * point from which the height of the binary tree will be calculated. It can be a node in the binary
   * tree or a reference to the root of the tree. If not provided, it defaults to the root of the
   * binary tree data structure.
   * @param {IterationType} iterationType - The `iterationType` parameter is used to determine the type
   * of iteration to be performed while calculating the height of the binary tree. It can have two
   * possible values:
   * @returns The `getHeight` method returns the height of the binary tree starting from the specified
   * root node. The height is calculated based on the maximum depth of the tree, considering either a
   * recursive approach or an iterative approach depending on the `iterationType` parameter.
   */
  getHeight(startNode: BTNRep<K, V, NODE> | R = this._root, iterationType: IterationType = this.iterationType): number {
    startNode = this.ensureNode(startNode);
    if (!this.isRealNode(startNode)) return -1;

    if (iterationType === 'RECURSIVE') {
      const _getMaxHeight = (cur: OptNodeOrNull<NODE>): number => {
        if (!this.isRealNode(cur)) return -1;
        const leftHeight = _getMaxHeight(cur.left);
        const rightHeight = _getMaxHeight(cur.right);
        return Math.max(leftHeight, rightHeight) + 1;
      };

      return _getMaxHeight(startNode);
    } else {
      const stack: { node: NODE; depth: number }[] = [{ node: startNode, depth: 0 }];
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
   *
   * The `getMinHeight` function calculates the minimum height of a binary tree using either a
   * recursive or iterative approach in TypeScript.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `getMinHeight` function represents the starting node from which the minimum height of the binary
   * tree will be calculated. It is either a node in the binary tree or a reference to the root of the
   * tree. If not provided, the default value is the root
   * @param {IterationType} iterationType - The `iterationType` parameter in the `getMinHeight` method
   * specifies the type of iteration to use when calculating the minimum height of a binary tree. It
   * can have two possible values:
   * @returns The `getMinHeight` method returns the minimum height of the binary tree starting from the
   * specified root node. The height is calculated based on the shortest path from the root node to a
   * leaf node in the tree. The method uses either a recursive approach or an iterative approach (using
   * a stack) based on the `iterationType` parameter.
   */
  getMinHeight(
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): number {
    startNode = this.ensureNode(startNode);
    if (!startNode) return -1;

    if (iterationType === 'RECURSIVE') {
      const _getMinHeight = (cur: OptNodeOrNull<NODE>): number => {
        if (!this.isRealNode(cur)) return 0;
        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return 0;
        const leftMinHeight = _getMinHeight(cur.left);
        const rightMinHeight = _getMinHeight(cur.right);
        return Math.min(leftMinHeight, rightMinHeight) + 1;
      };

      return _getMinHeight(startNode);
    } else {
      const stack: NODE[] = [];
      let node: OptNodeOrNull<NODE> = startNode,
        last: OptNodeOrNull<NODE> = null;
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
              const leftMinHeight = this.isRealNode(node.left) ? depths.get(node.left)! : -1;
              const rightMinHeight = this.isRealNode(node.right) ? depths.get(node.right)! : -1;
              depths.set(node, 1 + Math.min(leftMinHeight, rightMinHeight));
              last = node;
              node = null;
            }
          } else node = node.right;
        }
      }

      return depths.get(startNode)!;
    }
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function `getPathToRoot` in TypeScript retrieves the path from a given node to the root of a
   * tree structure, applying a specified callback function along the way.
   * @param {C} callback - The `callback` parameter is a function that is used to process each node in
   * the path to the root. It is expected to be a function that takes a node as an argument and returns
   * a value based on that node. The return type of the callback function is determined by the generic
   * type `C
   * @param {BTNRep<K, V, NODE> | R} beginNode - The `beginNode` parameter in the
   * `getPathToRoot` function can be either a key, a node, an entry, or any other value of type `R`.
   * @param [isReverse=true] - The `isReverse` parameter in the `getPathToRoot` function determines
   * whether the resulting path from the given `beginNode` to the root should be in reverse order or
   * not. If `isReverse` is set to `true`, the path will be reversed before being returned. If `is
   * @returns The function `getPathToRoot` returns an array of the return values of the callback
   * function `callback` applied to each node in the path from the `beginNode` to the root node. The
   * array is either in reverse order or in the original order based on the value of the `isReverse`
   * parameter.
   */
  getPathToRoot<C extends NodeCallback<OptNodeOrNull<NODE>>>(
    beginNode: BTNRep<K, V, NODE> | R,
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    isReverse = false
  ): ReturnType<C>[] {
    const result: ReturnType<C>[] = [];
    let beginNodeEnsured = this.ensureNode(beginNode);

    if (!beginNodeEnsured) return result;

    while (beginNodeEnsured.parent) {
      // Array.push + Array.reverse is more efficient than Array.unshift
      result.push(callback(beginNodeEnsured));
      beginNodeEnsured = beginNodeEnsured.parent;
    }
    result.push(callback(beginNodeEnsured));
    return isReverse ? result.reverse() : result;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getLeftMost` retrieves the leftmost node in a binary tree using either recursive or
   * tail-recursive iteration.
   * @param {C} callback - The `callback` parameter is a function that will be called with the leftmost
   * node of a binary tree or with `undefined` if the tree is empty. It is provided with a default
   * value of `_DEFAULT_NODE_CALLBACK` if not specified.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `getLeftMost` function represents the starting point for finding the leftmost node in a binary
   * tree. It can be either a key, a node, or an entry in the binary tree structure. If no specific
   * starting point is provided, the function will default
   * @param {IterationType} iterationType - The `iterationType` parameter in the `getLeftMost` function
   * specifies the type of iteration to be used when traversing the binary tree nodes. It can have two
   * possible values:
   * @returns The `getLeftMost` function returns the result of the callback function `C` applied to the
   * leftmost node in the binary tree starting from the `startNode` node. If the `startNode` node is
   * `NIL`, it returns the result of the callback function applied to `undefined`. If the `startNode`
   * node is not a real node, it returns the result of the callback
   */
  getLeftMost<C extends NodeCallback<OptNodeOrNull<NODE>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C> {
    if (this.isNIL(startNode)) return callback(undefined);
    startNode = this.ensureNode(startNode);

    if (!this.isRealNode(startNode)) return callback(startNode);

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE): NODE => {
        if (!this.isRealNode(cur.left)) return cur;
        return dfs(cur.left);
      };

      return callback(dfs(startNode));
    } else {
      // Indirect implementation of iteration using tail recursion optimization
      const dfs = trampoline((cur: NODE): NODE => {
        if (!this.isRealNode(cur.left)) return cur;
        return dfs.cont(cur.left);
      });

      return callback(dfs(startNode));
    }
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getRightMost` retrieves the rightmost node in a binary tree using either recursive
   * or iterative traversal methods.
   * @param {C} callback - The `callback` parameter is a function that will be called with the result
   * of finding the rightmost node in a binary tree. It is of type `NodeCallback<OptNodeOrNull<NODE>>`,
   * which means it is a callback function that can accept either an optional binary tree node or null
   * as
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `getRightMost` function represents the starting point for finding the rightmost node in a binary
   * tree. It can be either a key, a node, or an entry in the binary tree structure. If no specific
   * starting point is provided, the function will default
   * @param {IterationType} iterationType - The `iterationType` parameter in the `getRightMost`
   * function specifies the type of iteration to be used when traversing the binary tree nodes. It can
   * have two possible values:
   * @returns The `getRightMost` function returns the result of the callback function `C`, which is
   * passed as a parameter to the function. The callback function is called with the rightmost node in
   * the binary tree structure, determined based on the specified iteration type ('RECURSIVE' or
   * other).
   */
  getRightMost<C extends NodeCallback<OptNodeOrNull<NODE>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C> {
    if (this.isNIL(startNode)) return callback(undefined);
    // TODO support get right most by passing key in
    startNode = this.ensureNode(startNode);
    if (!startNode) return callback(startNode);

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE): NODE => {
        if (!this.isRealNode(cur.right)) return cur;
        return dfs(cur.right);
      };

      return callback(dfs(startNode));
    } else {
      // Indirect implementation of iteration using tail recursion optimization
      const dfs = trampoline((cur: NODE) => {
        if (!this.isRealNode(cur.right)) return cur;
        return dfs.cont(cur.right);
      });

      return callback(dfs(startNode));
    }
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `getPredecessor` in TypeScript returns the predecessor node of a given node in a
   * binary tree.
   * @param {NODE} node - The `getPredecessor` function you provided seems to be attempting to find the
   * predecessor of a given node in a binary tree. However, there seems to be a logical issue in the
   * while loop condition that might cause an infinite loop.
   * @returns The `getPredecessor` function returns the predecessor node of the input `NODE` parameter.
   * If the left child of the input node exists, it traverses to the rightmost node of the left subtree
   * to find the predecessor. If the left child does not exist, it returns the input node itself.
   */
  getPredecessor(node: NODE): NODE {
    if (this.isRealNode(node.left)) {
      let predecessor: OptNodeOrNull<NODE> = node.left;
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
   *
   * The function `getSuccessor` in TypeScript returns the next node in an in-order traversal of a
   * binary tree.
   * @param {K | NODE | null} [x] - The `getSuccessor` function takes a parameter `x`, which can be of
   * type `K`, `NODE`, or `null`.
   * @returns The `getSuccessor` function returns the successor node of the input node `x`. If `x` has
   * a right child, the function returns the leftmost node in the right subtree of `x`. If `x` does not
   * have a right child, the function traverses up the parent nodes until it finds a node that is not
   * the right child of its parent, and returns that node
   */
  getSuccessor(x?: K | NODE | null): OptNodeOrNull<NODE> {
    x = this.ensureNode(x);
    if (!this.isRealNode(x)) return undefined;

    if (this.isRealNode(x.right)) {
      return this.getLeftMost(node => node, x.right);
    }

    let y: OptNodeOrNull<NODE> = x.parent;
    while (this.isRealNode(y) && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  dfs<C extends NodeCallback<NODE>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    startNode?: BTNRep<K, V, NODE> | R,
    iterationType?: IterationType
  ): ReturnType<C>[];

  dfs<C extends NodeCallback<NODE | null>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    startNode?: BTNRep<K, V, NODE> | R,
    iterationType?: IterationType,
    includeNull?: boolean
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function `dfs` performs a depth-first search traversal on a binary tree structure based on the
   * specified parameters.
   * @param {C} callback - The `callback` parameter is a generic type `C` that extends the
   * `NodeCallback` interface with a type parameter of `OptNodeOrNull<NODE>`. It has a default value of
   * `this._DEFAULT_NODE_CALLBACK as C`.
   * @param {DFSOrderPattern} [pattern=IN] - The `pattern` parameter in the `dfs` method specifies the
   * order in which the Depth-First Search (DFS) algorithm should traverse the nodes in the tree. The
   * possible values for the `pattern` parameter are:
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `dfs`
   * method is used to specify the starting point for the Depth-First Search traversal. It can be
   * either a `BTNRep` object representing a key, node, or entry in the binary tree map,
   * or it can be a
   * @param {IterationType} iterationType - The `iterationType` parameter in the `dfs` method specifies
   * the type of iteration to be performed during the depth-first search traversal. It is used to
   * determine the order in which nodes are visited during the traversal.
   * @param [includeNull=false] - The `includeNull` parameter in the `dfs` method is a boolean flag
   * that determines whether null values should be included in the traversal or not. If `includeNull`
   * is set to `true`, then null values will be included in the traversal process. If it is set to
   * `false`,
   * @returns The `dfs` method is returning an array of the return type specified by the generic type
   * parameter `C`. The return type is determined by the callback function provided to the method.
   */
  dfs<C extends NodeCallback<OptNodeOrNull<NODE>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    return this._dfs(callback, pattern, startNode, iterationType, includeNull);
  }

  bfs<C extends NodeCallback<NODE>>(
    callback?: C,
    startNode?: BTNRep<K, V, NODE> | R,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  bfs<C extends NodeCallback<NODE | null>>(
    callback?: C,
    startNode?: BTNRep<K, V, NODE> | R,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `bfs` function performs a breadth-first search traversal on a binary tree or binary search
   * tree, executing a specified callback function on each node visited.
   * @param {C} callback - The `callback` parameter in the `bfs` function is a function that will be
   * called on each node visited during the breadth-first search traversal. It is a generic type `C`
   * that extends the `NodeCallback` type, which takes a parameter of type `NODE` or `null`.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `bfs`
   * function represents the starting point for the breadth-first search traversal in a binary tree. It
   * can be specified as a key, node, or entry in the binary tree structure. If not provided, the
   * default value is the root node of the binary
   * @param {IterationType} iterationType - The `iterationType` parameter in the `bfs` function
   * determines the type of iteration to be performed on the binary tree nodes. It can have two
   * possible values:
   * @param [includeNull=false] - The `includeNull` parameter in the `bfs` function determines whether
   * to include `null` values in the breadth-first search traversal of a binary tree. If `includeNull`
   * is set to `true`, the traversal will include `null` values for nodes that do not have children
   * (left
   * @returns The `bfs` function returns an array of values that are the result of applying the
   * provided callback function to each node in the binary tree in a breadth-first search manner.
   */
  bfs<C extends NodeCallback<NODE | null>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];

    const ans: ReturnType<NodeCallback<NODE>>[] = [];

    if (iterationType === 'RECURSIVE') {
      const queue: Queue<OptNodeOrNull<NODE>> = new Queue<OptNodeOrNull<NODE>>([startNode]);

      const dfs = (level: number) => {
        if (queue.size === 0) return;

        const current = queue.shift()!;
        ans.push(callback(current));

        if (includeNull) {
          if (current && this.isRealNodeOrNull(current.left)) queue.push(current.left);
          if (current && this.isRealNodeOrNull(current.right)) queue.push(current.right);
        } else {
          if (this.isRealNode(current.left)) queue.push(current.left);
          if (this.isRealNode(current.right)) queue.push(current.right);
        }

        dfs(level + 1);
      };

      dfs(0);
    } else {
      const queue = new Queue<OptNodeOrNull<NODE>>([startNode]);
      while (queue.size > 0) {
        const levelSize = queue.size;

        for (let i = 0; i < levelSize; i++) {
          const current = queue.shift()!;
          ans.push(callback(current));

          if (includeNull) {
            if (current && this.isRealNodeOrNull(current.left)) queue.push(current.left);
            if (current && this.isRealNodeOrNull(current.right)) queue.push(current.right);
          } else {
            if (this.isRealNode(current.left)) queue.push(current.left);
            if (this.isRealNode(current.right)) queue.push(current.right);
          }
        }
      }
    }
    return ans;
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `leaves` function in TypeScript returns an array of values from leaf nodes in a binary tree
   * structure based on a specified callback and iteration type.
   * @param {C} callback - The `callback` parameter is a function that will be called on each leaf node
   * in the binary tree. It is optional and defaults to a default callback function if not provided.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `leaves`
   * method is used to specify the starting point for finding and processing the leaves of a binary
   * tree. It can be provided as either a key, a node, or an entry in the binary tree structure. If not
   * explicitly provided, the default value
   * @param {IterationType} iterationType - The `iterationType` parameter in the `leaves` method
   * specifies the type of iteration to be performed when collecting the leaves of a binary tree. It
   * can have two possible values:
   * @returns The `leaves` method returns an array of values that are the result of applying the
   * provided callback function to each leaf node in the binary tree.
   */
  leaves<C extends NodeCallback<NODE | null>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    const leaves: ReturnType<NodeCallback<NODE>>[] = [];
    if (!this.isRealNode(startNode)) return [];

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: NODE) => {
        if (this.isLeaf(cur)) {
          leaves.push(callback(cur));
        }
        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return;
        if (this.isRealNode(cur.left)) dfs(cur.left);
        if (this.isRealNode(cur.right)) dfs(cur.right);
      };

      dfs(startNode);
    } else {
      const queue = new Queue([startNode]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (this.isRealNode(cur)) {
          if (this.isLeaf(cur)) {
            leaves.push(callback(cur));
          }
          if (this.isRealNode(cur.left)) queue.push(cur.left);
          if (this.isRealNode(cur.right)) queue.push(cur.right);
        }
      }
    }

    return leaves;
  }

  listLevels<C extends NodeCallback<NODE>>(
    callback?: C,
    startNode?: BTNRep<K, V, NODE> | R,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[][];

  listLevels<C extends NodeCallback<NODE | null>>(
    callback?: C,
    startNode?: BTNRep<K, V, NODE> | R,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[][];

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `listLevels` function in TypeScript generates a list of nodes at each level of a binary tree,
   * using either recursive or iterative traversal based on the specified iteration type.
   * @param {C} callback - The `callback` parameter is a function that will be applied to each node in
   * the binary tree during the traversal. It is used to process each node and determine what
   * information to include in the output for each level of the tree.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `listLevels` function represents the starting point for traversing the binary tree. It can be
   * either a key, a node, or an entry in the binary tree. If not provided, the default value is the
   * root of the binary tree.
   * @param {IterationType} iterationType - The `iterationType` parameter in the `listLevels` function
   * determines the type of iteration to be performed on the binary tree nodes. It can have two
   * possible values:
   * @param [includeNull=false] - The `includeNull` parameter in the `listLevels` method determines
   * whether or not to include null nodes in the traversal of the binary tree. If `includeNull` is set
   * to `true`, the traversal will include null nodes in the levels of the tree. If set to `false`,
   * null
   * @returns The `listLevels` method returns an array of arrays, where each inner array represents a
   * level in a binary tree. Each inner array contains the return value of the provided callback
   * function applied to the nodes at that level.
   */
  listLevels<C extends NodeCallback<NODE | null>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[][] {
    startNode = this.ensureNode(startNode);
    const levelsNodes: ReturnType<C>[][] = [];
    if (!startNode) return levelsNodes;

    if (iterationType === 'RECURSIVE') {
      const _recursive = (node: NODE | null, level: number) => {
        if (!levelsNodes[level]) levelsNodes[level] = [];
        levelsNodes[level].push(callback(node));
        if (includeNull) {
          if (node && this.isRealNodeOrNull(node.left)) _recursive(node.left, level + 1);
          if (node && this.isRealNodeOrNull(node.right)) _recursive(node.right, level + 1);
        } else {
          if (node && node.left) _recursive(node.left, level + 1);
          if (node && node.right) _recursive(node.right, level + 1);
        }
      };

      _recursive(startNode, 0);
    } else {
      const stack: [NODE | null, number][] = [[startNode, 0]];

      while (stack.length > 0) {
        const head = stack.pop()!;
        const [node, level] = head;

        if (!levelsNodes[level]) levelsNodes[level] = [];
        levelsNodes[level].push(callback(node));

        if (includeNull) {
          if (node && this.isRealNodeOrNull(node.right)) stack.push([node.right, level + 1]);
          if (node && this.isRealNodeOrNull(node.left)) stack.push([node.left, level + 1]);
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
   *
   * The `morris` function in TypeScript performs a Depth-First Search traversal on a binary tree using
   * Morris Traversal algorithm with different order patterns.
   * @param {C} callback - The `callback` parameter in the `morris` function is a function that will be
   * called on each node in the binary tree during the traversal. It is of type `C`, which extends the
   * `NodeCallback<NODE>` type. The default value for `callback` is `this._DEFAULT
   * @param {DFSOrderPattern} [pattern=IN] - The `pattern` parameter in the `morris` function specifies
   * the type of Depth-First Search (DFS) order pattern to traverse the binary tree. The possible
   * values for the `pattern` parameter are:
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `morris`
   * function is the starting point for the Morris traversal algorithm. It represents the root node of
   * the binary tree or the node from which the traversal should begin. It can be provided as either a
   * key, a node, an entry, or a reference
   * @returns The `morris` function is returning an array of values that are the result of applying the
   * provided callback function to each node in the binary tree in the specified order pattern (IN,
   * PRE, or POST).
   */
  morris<C extends NodeCallback<NODE>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    startNode: BTNRep<K, V, NODE> | R = this._root
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    const ans: ReturnType<NodeCallback<NODE>>[] = [];

    let cur: OptNodeOrNull<NODE> = startNode;
    const _reverseEdge = (node: OptNodeOrNull<NODE>) => {
      let pre: OptNodeOrNull<NODE> = null;
      let next: OptNodeOrNull<NODE> = null;
      while (node) {
        next = node.right;
        node.right = pre;
        pre = node;
        node = next;
      }
      return pre;
    };
    const _printEdge = (node: OptNodeOrNull<NODE>) => {
      const tail: OptNodeOrNull<NODE> = _reverseEdge(node);
      let cur: OptNodeOrNull<NODE> = tail;
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
        _printEdge(startNode);
        break;
    }
    return ans;
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `clone` function creates a deep copy of a tree structure by traversing it using breadth-first
   * search.
   * @returns The `clone()` method is returning a cloned copy of the tree with the same structure and
   * values as the original tree. The method creates a new tree, iterates over the nodes of the
   * original tree using breadth-first search (bfs), and adds the nodes to the new tree. If a node in
   * the original tree is null, a null node is added to the cloned tree. If a node
   */
  clone(): TREE {
    const cloned = this.createTree();
    this.bfs(
      node => {
        if (node === null) cloned.add(null);
        else {
          if (this._isMapMode) cloned.add([node.key, this._store.get(node.key)]);
          else cloned.add([node.key, node.value]);
        }
      },
      this._root,
      this.iterationType,
      true
    );
    if (this._isMapMode) cloned._store = this._store;
    return cloned;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function iterates over key-value pairs in a tree data structure and creates a new
   * tree with elements that satisfy a given predicate.
   * @param predicate - The `predicate` parameter in the `filter` method is a function that will be
   * called with four arguments: the `value` of the current entry, the `key` of the current entry, the
   * `index` of the current entry in the iteration, and the reference to the tree itself (`
   * @param {any} [thisArg] - The `thisArg` parameter in the `filter` method allows you to specify the
   * value of `this` that should be used when executing the `predicate` function. This is useful when
   * the `predicate` function relies on the context of a specific object or value. By providing a
   * `thisArg
   * @returns The `filter` method is returning a new tree that contains entries that pass the provided
   * predicate function.
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
   *
   * The `map` function iterates over key-value pairs in a tree data structure, applies a callback
   * function to each value, and returns a new tree with the updated values.
   * @param callback - The `callback` parameter in the `map` method is a function that will be called
   * on each entry in the tree. It takes four arguments:
   * @param {any} [thisArg] - The `thisArg` parameter in the `map` function is an optional parameter
   * that specifies the value to be passed as `this` when executing the callback function. If provided,
   * the `thisArg` value will be used as the `this` value within the callback function. If `thisArg
   * @returns The `map` method is returning a new tree with the entries modified by the provided
   * callback function. Each entry in the original tree is passed to the callback function, and the
   * result of the callback function is added to the new tree.
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
   *
   * The function `toVisual` in TypeScript overrides the visual representation of a binary tree with
   * customizable options for displaying undefined, null, and sentinel nodes.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `toVisual` method is used to specify the starting point for visualizing the binary tree structure.
   * It can be a node, key, entry, or the root of the tree. If no specific starting point is provided,
   * the default is set to the root
   * @param {BinaryTreePrintOptions} [options] - The `options` parameter in the `toVisual` method is an
   * object that contains the following properties:
   * @returns The `override toVisual` method returns a string that represents the visual display of the
   * binary tree based on the provided options for showing undefined, null, and Red-Black NIL nodes.
   * The method constructs the visual representation by calling the `_displayAux` method and appending
   * the lines to the output string. The final output string contains the visual representation of the
   * binary tree with the specified options.
   */
  override toVisual(startNode: BTNRep<K, V, NODE> | R = this._root, options?: BinaryTreePrintOptions): string {
    const opts = { isShowUndefined: false, isShowNull: true, isShowRedBlackNIL: false, ...options };
    startNode = this.ensureNode(startNode);
    let output = '';
    if (!startNode) return output;

    if (opts.isShowUndefined) output += `U for undefined\n`;
    if (opts.isShowNull) output += `N for null\n`;
    if (opts.isShowRedBlackNIL) output += `S for Sentinel Node(NIL)\n`;

    const display = (root: OptNodeOrNull<NODE>): void => {
      const [lines, , ,] = this._displayAux(root, opts);
      let paragraph = '';
      for (const line of lines) {
        paragraph += line + '\n';
      }
      output += paragraph;
    };

    display(startNode);
    return output;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `print` in TypeScript overrides the default print behavior to log a visual
   * representation of the binary tree to the console.
   * @param {BinaryTreePrintOptions} [options] - The `options` parameter is used to specify the
   * printing options for the binary tree. It is an optional parameter that allows you to customize how
   * the binary tree is printed, such as choosing between different traversal orders or formatting
   * options.
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the
   * `override print` method is used to specify the starting point for printing the binary tree. It can
   * be either a key, a node, an entry, or the root of the tree. If no specific starting point is
   * provided, the default value is set to
   */
  override print(options?: BinaryTreePrintOptions, startNode: BTNRep<K, V, NODE> | R = this._root) {
    console.log(this.toVisual(startNode, options));
  }

  /**
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The `_dfs` function performs a depth-first search traversal on a binary tree structure based on
   * the specified order pattern and callback function.
   * @param {C} callback - The `callback` parameter in the `_dfs` method is a function that will be
   * called on each node visited during the depth-first search traversal. It is of type `C`, which
   * extends `NodeCallback<OptNodeOrNull<NODE>>`. The default value for this parameter is `this._DEFAULT
   * @param {DFSOrderPattern} [pattern=IN] - The `pattern` parameter in the `_dfs` method specifies the
   * order in which the nodes are visited during the Depth-First Search traversal. It can have one of
   * the following values:
   * @param {BTNRep<K, V, NODE> | R} startNode - The `startNode` parameter in the `_dfs`
   * method is used to specify the starting point for the depth-first search traversal in a binary
   * tree. It can be provided as either a `BTNRep` object or a reference to the root node
   * of the tree. If no specific
   * @param {IterationType} iterationType - The `iterationType` parameter in the `_dfs` method
   * specifies the type of iteration to be performed during the Depth-First Search (DFS) traversal of a
   * binary tree. It can have two possible values:
   * @param [includeNull=false] - The `includeNull` parameter in the `_dfs` method is a boolean flag
   * that determines whether null nodes should be included in the depth-first search traversal. If
   * `includeNull` is set to `true`, null nodes will be considered during the traversal process. If it
   * is set to `false`,
   * @param shouldVisitLeft - The `shouldVisitLeft` parameter is a function that takes a node as input
   * and returns a boolean value. It is used to determine whether the left child of a node should be
   * visited during the depth-first search traversal. By default, it checks if the node is truthy (not
   * null or undefined
   * @param shouldVisitRight - The `shouldVisitRight` parameter is a function that takes a node as an
   * argument and returns a boolean value. It is used to determine whether the right child of a node
   * should be visited during the depth-first search traversal. The default implementation checks if
   * the node is truthy before visiting the right child
   * @param shouldVisitRoot - The `shouldVisitRoot` parameter is a function that takes a node as an
   * argument and returns a boolean value. It is used to determine whether the root node should be
   * visited during the depth-first search traversal based on certain conditions. The default
   * implementation checks if the node is a real node or null based
   * @param shouldProcessRoot - The `shouldProcessRoot` parameter is a function that takes a node as an
   * argument and returns a boolean value indicating whether the node should be processed during the
   * depth-first search traversal. The default implementation checks if the node is a real node or null
   * based on the `includeNull` flag. If `
   * @returns The function `_dfs` returns an array of the return type of the callback function provided
   * as input.
   */
  protected _dfs<C extends NodeCallback<OptNodeOrNull<NODE>>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    startNode: BTNRep<K, V, NODE> | R = this._root,
    iterationType: IterationType = this.iterationType,
    includeNull = false,
    shouldVisitLeft: (node: OptNodeOrNull<NODE>) => boolean = node => !!node,
    shouldVisitRight: (node: OptNodeOrNull<NODE>) => boolean = node => !!node,
    shouldVisitRoot: (node: OptNodeOrNull<NODE>) => boolean = node => {
      if (includeNull) return this.isRealNodeOrNull(node);
      return this.isRealNode(node);
    },
    shouldProcessRoot: (node: OptNodeOrNull<NODE>) => boolean = node => this.isRealNodeOrNull(node)
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    const ans: ReturnType<C>[] = [];

    if (iterationType === 'RECURSIVE') {
      const dfs = (node: OptNodeOrNull<NODE>) => {
        if (!shouldVisitRoot(node)) return;

        const visitLeft = () => {
          if (shouldVisitLeft(node)) dfs(node?.left);
        };
        const visitRight = () => {
          if (shouldVisitRight(node)) dfs(node?.right);
        };

        switch (pattern) {
          case 'IN':
            visitLeft();
            if (shouldProcessRoot(node)) ans.push(callback(node));
            visitRight();
            break;
          case 'PRE':
            if (shouldProcessRoot(node)) ans.push(callback(node));
            visitLeft();
            visitRight();
            break;
          case 'POST':
            visitLeft();
            visitRight();
            if (shouldProcessRoot(node)) ans.push(callback(node));
            break;
        }
      };

      dfs(startNode);
    } else {
      const stack: DFSStackItem<NODE>[] = [{ opt: DFSOperation.VISIT, node: startNode }];

      const pushLeft = (cur: DFSStackItem<NODE>) => {
        if (shouldVisitLeft(cur.node)) stack.push({ opt: DFSOperation.VISIT, node: cur.node?.left });
      };
      const pushRight = (cur: DFSStackItem<NODE>) => {
        if (shouldVisitRight(cur.node)) stack.push({ opt: DFSOperation.VISIT, node: cur.node?.right });
      };
      const pushRoot = (cur: DFSStackItem<NODE>) => {
        if (shouldVisitRoot(cur.node)) stack.push({ opt: DFSOperation.PROCESS, node: cur.node });
      };

      while (stack.length > 0) {
        const cur = stack.pop();
        if (cur === undefined) continue;
        if (!shouldVisitRoot(cur.node)) continue;
        if (cur.opt === DFSOperation.PROCESS) {
          if (shouldProcessRoot(cur.node)) ans.push(callback(cur.node));
        } else {
          switch (pattern) {
            case 'IN':
              pushRight(cur);
              pushRoot(cur);
              pushLeft(cur);
              break;
            case 'PRE':
              pushRight(cur);
              pushLeft(cur);
              pushRoot(cur);
              break;
            case 'POST':
              pushRoot(cur);
              pushRight(cur);
              pushLeft(cur);
              break;
          }
        }
      }
    }

    return ans;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_getIterator` returns an iterable iterator for a binary tree data structure, either
   * using an iterative approach or a recursive approach based on the specified iteration type.
   * @param node - The `node` parameter in the `_getIterator` method represents the current node being
   * processed during iteration. It is initially set to the root node of the data structure (or the
   * node passed as an argument), and then it is traversed through the data structure based on the
   * iteration type specified (`ITER
   * @returns The `_getIterator` method returns an IterableIterator containing key-value pairs of nodes
   * in a binary tree structure. The method uses an iterative approach to traverse the tree based on
   * the `iterationType` property. If the `iterationType` is set to 'ITERATIVE', the method uses a
   * stack to perform an in-order traversal of the tree. If the `iterationType` is not 'ITERATIVE
   */
  protected *_getIterator(node = this._root): IterableIterator<[K, V | undefined]> {
    if (!node) return;

    if (this.iterationType === 'ITERATIVE') {
      const stack: OptNodeOrNull<NODE>[] = [];
      let current: OptNodeOrNull<NODE> = node;

      while (current || stack.length > 0) {
        while (this.isRealNode(current)) {
          stack.push(current);
          current = current.left;
        }

        current = stack.pop();

        if (this.isRealNode(current)) {
          if (this._isMapMode) yield [current.key, this._store.get(current.key)];
          else yield [current.key, current.value];
          current = current.right;
        }
      }
    } else {
      if (node.left && this.isRealNode(node)) {
        yield* this[Symbol.iterator](node.left);
      }
      if (this._isMapMode) yield [node.key, this._store.get(node.key)];
      else yield [node.key, node.value];
      if (node.right && this.isRealNode(node)) {
        yield* this[Symbol.iterator](node.right);
      }
    }
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `_displayAux` in TypeScript is responsible for generating the display layout of nodes
   * in a binary tree based on specified options.
   * @param node - The `node` parameter in the `_displayAux` function represents a node in a binary
   * tree. It can be either a valid node containing a key or a special type of node like null,
   * undefined, or a Red-Black tree NIL node. The function checks the type of the node and its
   * @param {BinaryTreePrintOptions} options - The `options` parameter in the `_displayAux` function
   * contains the following properties:
   * @returns The `_displayAux` function returns a `NodeDisplayLayout`, which is an array containing
   * information about how to display a node in a binary tree. The `NodeDisplayLayout` consists of four
   * elements:
   */
  protected _displayAux(node: OptNodeOrNull<NODE>, options: BinaryTreePrintOptions): NodeDisplayLayout {
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

  protected _DEFAULT_NODE_CALLBACK = (node: OptNodeOrNull<NODE>) => (node ? node.key : undefined);

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The _swapProperties function swaps key and value properties between two nodes in a binary tree.
   * @param {BTNRep<K, V, NODE> | R} srcNode - The `srcNode` parameter in the
   * `_swapProperties` method can be either a BTNRep object containing key and value
   * properties, or it can be of type R.
   * @param {BTNRep<K, V, NODE> | R} destNode - The `destNode` parameter in the
   * `_swapProperties` method represents the node or entry where the properties will be swapped with
   * the `srcNode`. It can be of type `BTNRep<K, V, NODE>` or `R`. The method ensures that
   * both `srcNode
   * @returns The `_swapProperties` method returns either the `destNode` with its key and value swapped
   * with the `srcNode`, or `undefined` if either `srcNode` or `destNode` is falsy.
   */
  protected _swapProperties(srcNode: BTNRep<K, V, NODE> | R, destNode: BTNRep<K, V, NODE> | R): NODE | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);

    if (srcNode && destNode) {
      const { key, value } = destNode;
      const tempNode = this.createNode(key, value);

      if (tempNode) {
        destNode.key = srcNode.key;
        if (!this._isMapMode) destNode.value = srcNode.value;

        srcNode.key = tempNode.key;
        if (!this._isMapMode) srcNode.value = tempNode.value;
      }

      return destNode;
    }
    return undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The _replaceNode function replaces an old node with a new node in a binary tree structure.
   * @param {NODE} oldNode - The `oldNode` parameter represents the node that you want to replace in a
   * tree data structure.
   * @param {NODE} newNode - The `newNode` parameter in the `_replaceNode` function represents the node
   * that will replace the `oldNode` in a tree data structure. This function is responsible for
   * updating the parent, left child, right child, and root (if necessary) references when replacing a
   * node in the tree.
   * @returns The method `_replaceNode` is returning the `newNode` that was passed as a parameter after
   * replacing the `oldNode` with it in the binary tree structure.
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
    if (this._root === oldNode) {
      this._setRoot(newNode);
    }

    return newNode;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function _setRoot sets the root node of a data structure while updating the parent reference
   * of the previous root node.
   * @param v - The parameter `v` in the `_setRoot` method is of type `OptNodeOrNull<NODE>`, which means
   * it can either be an optional `NODE` type or `null`.
   */
  protected _setRoot(v: OptNodeOrNull<NODE>) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_ensurePredicate` in TypeScript ensures that the input is converted into a valid
   * predicate function for a binary tree node.
   * @param {BTNRep<K, V, NODE> | R | NodePredicate<NODE>} keyNodeEntryRawOrPredicate - The
   * `_ensurePredicate` method in the provided code snippet is responsible for ensuring that the input
   * parameter `keyNodeEntryRawOrPredicate` is transformed into a valid predicate function that can be
   * used for filtering nodes in a binary tree.
   * @returns A NodePredicate<NODE> function is being returned.
   */
  protected _ensurePredicate(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, NODE> | R | NodePredicate<NODE>
  ): NodePredicate<NODE> {
    if (keyNodeEntryRawOrPredicate === null || keyNodeEntryRawOrPredicate === undefined)
      return (node: NODE) => (node ? false : false);

    if (this._isPredicate(keyNodeEntryRawOrPredicate)) return keyNodeEntryRawOrPredicate;

    if (this.isRealNode(keyNodeEntryRawOrPredicate)) return (node: NODE) => node === keyNodeEntryRawOrPredicate;

    if (this.isEntry(keyNodeEntryRawOrPredicate)) {
      const [key] = keyNodeEntryRawOrPredicate;
      return (node: NODE) => node.key === key;
    }

    if (this.isKey(keyNodeEntryRawOrPredicate)) return (node: NODE) => node.key === keyNodeEntryRawOrPredicate;

    if (this._toEntryFn) {
      const [key] = this._toEntryFn(keyNodeEntryRawOrPredicate);
      return (node: NODE) => node.key === key;
    }
    return (node: NODE) => node.key === keyNodeEntryRawOrPredicate;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_isPredicate` checks if a given parameter is a function.
   * @param {any} p - The parameter `p` is a variable of type `any`, which means it can hold any type
   * of value. In this context, the function `_isPredicate` is checking if `p` is a function that
   * satisfies the type `NodePredicate<NODE>`.
   * @returns The function is checking if the input `p` is a function and returning a boolean value
   * based on that check. If `p` is a function, it will return `true`, indicating that `p` is a
   * predicate function for a binary tree node. If `p` is not a function, it will return `false`.
   */
  protected _isPredicate(p: any): p is NodePredicate<NODE> {
    return typeof p === 'function';
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_extractKey` in TypeScript returns the key from a given input, which can be a node,
   * entry, raw data, or null/undefined.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The `_extractKey` method you provided is a
   * TypeScript method that takes in a parameter `keyNodeEntryOrRaw` of type `BTNRep<K, V, NODE> | R`,
   * where `BTNRep` is a generic type with keys `K`, `V`, and `NODE`, and `
   * @returns The `_extractKey` method returns the key value extracted from the `keyNodeEntryOrRaw`
   * parameter. The return value can be a key value of type `K`, `null`, or `undefined`, depending on
   * the conditions checked in the method.
   */
  protected _extractKey(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): K | null | undefined {
    if (keyNodeEntryOrRaw === null) return null;
    if (keyNodeEntryOrRaw === undefined) return;
    if (keyNodeEntryOrRaw === this._NIL) return;
    if (this.isNode(keyNodeEntryOrRaw)) return keyNodeEntryOrRaw.key;

    if (this.isEntry(keyNodeEntryOrRaw)) return keyNodeEntryOrRaw[0];

    if (this.isRaw(keyNodeEntryOrRaw)) {
      if (this._toEntryFn) {
        const [key] = this._toEntryFn(keyNodeEntryOrRaw);
        return key;
      }
      return;
    }

    return keyNodeEntryOrRaw;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_setValue` sets a value in a store based on a key, handling cases where the key or
   * value is null or undefined.
   * @param {K | null | undefined} key - The `key` parameter can be of type `K`, `null`, or
   * `undefined`.
   * @param {V | undefined} value - The `value` parameter in the `_setValue` method can be of type `V`
   * or `undefined`.
   * @returns The method `_setValue` returns `false` if either the `key` is `null` or `undefined`, or
   * if the `value` is `undefined`. Otherwise, it returns the result of calling the `set` method on the
   * `_store` object with the `key` and `value` arguments.
   */
  protected _setValue(key: K | null | undefined, value: V | undefined) {
    if (key === null || key === undefined) return false;
    if (value === undefined) return false;
    return this._store.set(key, value);
  }

  /**
   * The _clearNodes function sets the root node to undefined and resets the size to 0.
   */
  protected _clearNodes() {
    this._setRoot(undefined);
    this._size = 0;
  }

  /**
   * The _clearValues function clears all values stored in the _store object.
   */
  protected _clearValues() {
    this._store.clear();
  }
}
