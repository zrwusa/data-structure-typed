/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  BinaryTreeDeleteResult,
  BinaryTreeOptions,
  BinaryTreePrintOptions,
  BTNEntry,
  DFSOrderPattern,
  DFSStackItem,
  EntryCallback,
  FamilyPosition,
  IterationType,
  NodeCallback,
  NodeDisplayLayout,
  NodePredicate,
  OptNodeOrNull,
  RBTNColor,
  ToEntryFn,
  Trampoline
} from '../../types';
import { IBinaryTree } from '../../interfaces';
import { isComparable, makeTrampoline, makeTrampolineThunk } from '../../utils';
import { Queue } from '../queue';
import { IterableEntryBase } from '../base';
import { DFSOperation, Range } from '../../common';

/**
 * @template K - The type of the key.
 * @template V - The type of the value.
 */
export class BinaryTreeNode<K = any, V = any> {
  key: K;
  value?: V;
  parent?: BinaryTreeNode<K, V> = undefined;

  /**
   * Creates an instance of BinaryTreeNode.
   * @remarks Time O(1), Space O(1)
   *
   * @param key - The key of the node.
   * @param [value] - The value associated with the key.
   */
  constructor(key: K, value?: V) {
    this.key = key;
    this.value = value;
  }

  _left?: BinaryTreeNode<K, V> | null | undefined = undefined;

  /**
   * Gets the left child of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @returns The left child.
   */
  get left(): BinaryTreeNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Sets the left child of the node and updates its parent reference.
   * @remarks Time O(1), Space O(1)
   *
   * @param v - The node to set as the left child.
   */
  set left(v: BinaryTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this as unknown as BinaryTreeNode<K, V>;
    }
    this._left = v;
  }

  _right?: BinaryTreeNode<K, V> | null | undefined = undefined;

  /**
   * Gets the right child of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @returns The right child.
   */
  get right(): BinaryTreeNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Sets the right child of the node and updates its parent reference.
   * @remarks Time O(1), Space O(1)
   *
   * @param v - The node to set as the right child.
   */
  set right(v: BinaryTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }

  _height: number = 0;

  /**
   * Gets the height of the node (used in self-balancing trees).
   * @remarks Time O(1), Space O(1)
   *
   * @returns The height.
   */
  get height(): number {
    return this._height;
  }

  /**
   * Sets the height of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @param value - The new height.
   */
  set height(value: number) {
    this._height = value;
  }

  _color: RBTNColor = 'BLACK';

  /**
   * Gets the color of the node (used in Red-Black trees).
   * @remarks Time O(1), Space O(1)
   *
   * @returns The node's color.
   */
  get color(): RBTNColor {
    return this._color;
  }

  /**
   * Sets the color of the node.
   * @remarks Time O(1), Space O(1)
   *
   * @param value - The new color.
   */
  set color(value: RBTNColor) {
    this._color = value;
  }

  _count: number = 1;

  /**
   * Gets the count of nodes in the subtree rooted at this node (used in order-statistic trees).
   * @remarks Time O(1), Space O(1)
   *
   * @returns The subtree node count.
   */
  get count(): number {
    return this._count;
  }

  /**
   * Sets the count of nodes in the subtree.
   * @remarks Time O(1), Space O(1)
   *
   * @param value - The new count.
   */
  set count(value: number) {
    this._count = value;
  }

  /**
   * Gets the position of the node relative to its parent.
   * @remarks Time O(1), Space O(1)
   *
   * @returns The family position (e.g., 'ROOT', 'LEFT', 'RIGHT').
   */
  get familyPosition(): FamilyPosition {
    if (!this.parent) {
      return this.left || this.right ? 'ROOT' : 'ISOLATED';
    }

    if (this.parent.left === this) {
      return this.left || this.right ? 'ROOT_LEFT' : 'LEFT';
    } else if (this.parent.right === this) {
      return this.left || this.right ? 'ROOT_RIGHT' : 'RIGHT';
    }

    return 'MAL_NODE';
  }
}

/**
 * A general Binary Tree implementation.
 *
 * @remarks
 * This class implements a basic Binary Tree, not a Binary Search Tree.
 * The `add` operation inserts nodes level-by-level (BFS) into the first available slot.
 *
 * @template K - The type of the key.
 * @template V - The type of the value.
 * @template R - The type of the raw data object (if using `toEntryFn`).
 * 1. Two Children Maximum: Each node has at most two children.
 * 2. Left and Right Children: Nodes have distinct left and right children.
 * 3. Depth and Height: Depth is the number of edges from the root to a node; height is the maximum depth in the tree.
 * 4. Subtrees: Each child of a node forms the root of a subtree.
 * 5. Leaf Nodes: Nodes without children are leaves.
 *
 * @example
 * // basic BinaryTree creation and insertion
 *  // Create a BinaryTree with entries
 *     const entries: [number, string][] = [
 *       [6, 'six'],
 *       [1, 'one'],
 *       [2, 'two'],
 *       [7, 'seven'],
 *       [5, 'five'],
 *       [3, 'three'],
 *       [4, 'four'],
 *       [9, 'nine'],
 *       [8, 'eight']
 *     ];
 *
 *     const tree = new BinaryTree(entries);
 *
 *     // Verify size
 *     console.log(tree.size); // 9;
 *
 *     // Add new element
 *     tree.add(10, 'ten');
 *     console.log(tree.size); // 10;
 * @example
 * // BinaryTree get and has operations
 *  const tree = new BinaryTree(
 *       [
 *         [5, 'five'],
 *         [3, 'three'],
 *         [7, 'seven'],
 *         [1, 'one'],
 *         [4, 'four'],
 *         [6, 'six'],
 *         [8, 'eight']
 *       ],
 *       { isMapMode: false }
 *     );
 *
 *     // Check if key exists
 *     console.log(tree.has(5)); // true;
 *     console.log(tree.has(10)); // false;
 *
 *     // Get value by key
 *     console.log(tree.get(3)); // 'three';
 *     console.log(tree.get(7)); // 'seven';
 *     console.log(tree.get(100)); // undefined;
 *
 *     // Get node structure
 *     const node = tree.getNode(5);
 *     console.log(node?.key); // 5;
 *     console.log(node?.value); // 'five';
 * @example
 * // BinaryTree level-order traversal
 *  const tree = new BinaryTree([
 *       [1, 'one'],
 *       [2, 'two'],
 *       [3, 'three'],
 *       [4, 'four'],
 *       [5, 'five'],
 *       [6, 'six'],
 *       [7, 'seven']
 *     ]);
 *
 *     // Binary tree maintains level-order insertion
 *     // Complete binary tree structure
 *     console.log(tree.size); // 7;
 *
 *     // Verify all keys are present
 *     console.log(tree.has(1)); // true;
 *     console.log(tree.has(4)); // true;
 *     console.log(tree.has(7)); // true;
 *
 *     // Iterate through tree
 *     const keys: number[] = [];
 *     for (const [key] of tree) {
 *       keys.push(key);
 *     }
 *     console.log(keys.length); // 7;
 * @example
 * // determine loan approval using a decision tree
 *  // Decision tree structure
 *     const loanDecisionTree = new BinaryTree<string>(
 *       ['stableIncome', 'goodCredit', 'Rejected', 'Approved', 'Rejected'],
 *       { isDuplicate: true }
 *     );
 *
 *     function determineLoanApproval(
 *       node?: BinaryTreeNode<string> | null,
 *       conditions?: { [key: string]: boolean }
 *     ): string {
 *       if (!node) throw new Error('Invalid node');
 *
 *       // If it's a leaf node, return the decision result
 *       if (!node.left && !node.right) return node.key;
 *
 *       // Check if a valid condition exists for the current node's key
 *       return conditions?.[node.key]
 *         ? determineLoanApproval(node.left, conditions)
 *         : determineLoanApproval(node.right, conditions);
 *     }
 *
 *     // Test case 1: Stable income and good credit score
 *     console.log(determineLoanApproval(loanDecisionTree.root, { stableIncome: true, goodCredit: true })); // 'Approved';
 *
 *     // Test case 2: Stable income but poor credit score
 *     console.log(determineLoanApproval(loanDecisionTree.root, { stableIncome: true, goodCredit: false })); // 'Rejected';
 *
 *     // Test case 3: No stable income
 *     console.log(determineLoanApproval(loanDecisionTree.root, { stableIncome: false, goodCredit: true })); // 'Rejected';
 *
 *     // Test case 4: No stable income and poor credit score
 *     console.log(determineLoanApproval(loanDecisionTree.root, { stableIncome: false, goodCredit: false })); // 'Rejected';
 * @example
 * // evaluate the arithmetic expression represented by the binary tree
 *  const expressionTree = new BinaryTree<number | string>(['+', 3, '*', null, null, 5, '-', null, null, 2, 8]);
 *
 *     function evaluate(node?: BinaryTreeNode<number | string> | null): number {
 *       if (!node) return 0;
 *
 *       if (typeof node.key === 'number') return node.key;
 *
 *       const leftValue = evaluate(node.left); // Evaluate the left subtree
 *       const rightValue = evaluate(node.right); // Evaluate the right subtree
 *
 *       // Perform the operation based on the current node's operator
 *       switch (node.key) {
 *         case '+':
 *           return leftValue + rightValue;
 *         case '-':
 *           return leftValue - rightValue;
 *         case '*':
 *           return leftValue * rightValue;
 *         case '/':
 *           return rightValue !== 0 ? leftValue / rightValue : 0; // Handle division by zero
 *         default:
 *           throw new Error(`Unsupported operator: ${node.key}`);
 *       }
 *     }
 *
 *     console.log(evaluate(expressionTree.root)); // -27;
 */
export class BinaryTree<K = any, V = any, R = any>
  extends IterableEntryBase<K, V | undefined>
  implements IBinaryTree<K, V, R>
{
  iterationType: IterationType = 'ITERATIVE';

  /**
   * Creates an instance of BinaryTree.
   * @remarks Time O(N * M), where N is the number of items in `keysNodesEntriesOrRaws` and M is the tree size at insertion time (due to O(M) `add` operation). Space O(N) for storing the nodes.
   *
   * @param [keysNodesEntriesOrRaws=[]] - An iterable of items to add.
   * @param [options] - Configuration options for the tree.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    > = [],
    options?: BinaryTreeOptions<K, V, R>
  ) {
    super();
    if (options) {
      const { iterationType, toEntryFn, isMapMode, isDuplicate } = options;
      if (iterationType) this.iterationType = iterationType;
      if (isMapMode !== undefined) this._isMapMode = isMapMode;
      if (isDuplicate !== undefined) this._isDuplicate = isDuplicate;
      if (typeof toEntryFn === 'function') this._toEntryFn = toEntryFn;
      else if (toEntryFn) throw TypeError('toEntryFn must be a function type');
    }

    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
  }

  protected _isMapMode = true;

  /**
   * Gets whether the tree is in Map mode.
   * @remarks In Map mode (default), values are stored in an external Map, and nodes only hold keys. If false, values are stored directly on the nodes. Time O(1)
   *
   * @returns True if in Map mode, false otherwise.
   */
  get isMapMode() {
    return this._isMapMode;
  }

  protected _isDuplicate = false;

  /**
   * Gets whether the tree allows duplicate keys.
   * @remarks Time O(1)
   *
   * @returns True if duplicates are allowed, false otherwise.
   */
  get isDuplicate() {
    return this._isDuplicate;
  }

  protected _store = new Map<K, V | undefined>();

  /**
   * Gets the external value store (used in Map mode).
   * @remarks Time O(1)
   *
   * @returns The map storing key-value pairs.
   */
  get store() {
    return this._store;
  }

  protected _root?: BinaryTreeNode<K, V> | null | undefined;

  /**
   * Gets the root node of the tree.
   * @remarks Time O(1)
   *
   * @returns The root node.
   */
  get root(): BinaryTreeNode<K, V> | null | undefined {
    return this._root;
  }

  protected _size: number = 0;

  /**
   * Gets the number of nodes in the tree.
   * @remarks Time O(1)
   *
   * @returns The size of the tree.
   */
  get size(): number {
    return this._size;
  }

  protected _NIL: BinaryTreeNode<K, V> = new BinaryTreeNode<K, V>(NaN as K) as unknown as BinaryTreeNode<K, V>;

  /**
   * Gets the sentinel NIL node (used in self-balancing trees like Red-Black Tree).
   * @remarks Time O(1)
   *
   * @returns The NIL node.
   */
  get NIL(): BinaryTreeNode<K, V> {
    return this._NIL;
  }

  protected _toEntryFn?: ToEntryFn<K, V, R>;

  /**
   * Gets the function used to convert raw data objects (R) into [key, value] entries.
   * @remarks Time O(1)
   *
   * @returns The conversion function.
   */
  get toEntryFn() {
    return this._toEntryFn;
  }

  /**
   * (Protected) Creates a new node.
   * @remarks Time O(1), Space O(1)
   *
   * @param key - The key for the new node.
   * @param [value] - The value for the new node (used if not in Map mode).
   * @returns The newly created node.
   */
  createNode(key: K, value?: V): BinaryTreeNode<K, V> {
    return new BinaryTreeNode<K, V>(key, this._isMapMode ? undefined : value);
  }

  /**
   * Creates a new, empty tree of the same type and configuration.
   * @remarks Time O(1) (excluding options cloning), Space O(1)
   *
   * @param [options] - Optional overrides for the new tree's options.
   * @returns A new, empty tree instance.
   */
  createTree(options?: Partial<BinaryTreeOptions<K, V, R>>): this {
    return this._createInstance<K, V, R>(options);
  }

  /**
   * Ensures the input is a node. If it's a key or entry, it searches for the node.
   * @remarks Time O(1) if a node is passed. O(N) if a key or entry is passed (due to `getNode` performing a full search). Space O(1) if iterative search, O(H) if recursive (where H is height, O(N) worst-case).
   *
   * @param keyNodeOrEntry - The item to resolve to a node.
   * @param [iterationType=this.iterationType] - The traversal method to use if searching.
   * @returns The resolved node, or null/undefined if not found or input is null/undefined.
   */
  ensureNode(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType: IterationType = this.iterationType
  ): BinaryTreeNode<K, V> | null | undefined {
    if (keyNodeOrEntry === null) return null;
    if (keyNodeOrEntry === undefined) return;
    if (keyNodeOrEntry === this._NIL) return;

    if (this.isNode(keyNodeOrEntry)) return keyNodeOrEntry;

    if (this.isEntry(keyNodeOrEntry)) {
      const key = keyNodeOrEntry[0];
      if (key === null) return null;
      if (key === undefined) return;
      return this.getNode(key, this._root, iterationType);
    }

    return this.getNode(keyNodeOrEntry, this._root, iterationType);
  }

  /**
   * Checks if the given item is a `BinaryTreeNode` instance.
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeOrEntry - The item to check.
   * @returns True if it's a node, false otherwise.
   */
  isNode(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is BinaryTreeNode<K, V> {
    return keyNodeOrEntry instanceof BinaryTreeNode;
  }

  /**
   * Checks if the given item is a raw data object (R) that needs conversion via `toEntryFn`.
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeEntryOrRaw - The item to check.
   * @returns True if it's a raw object, false otherwise.
   */
  isRaw(
    keyNodeEntryOrRaw: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
  ): keyNodeEntryOrRaw is R {
    return this._toEntryFn !== undefined && typeof keyNodeEntryOrRaw === 'object';
  }

  /**
   * Checks if the given item is a "real" node (i.e., not null, undefined, or NIL).
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeOrEntry - The item to check.
   * @returns True if it's a real node, false otherwise.
   */
  isRealNode(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is BinaryTreeNode<K, V> {
    if (keyNodeOrEntry === this._NIL || keyNodeOrEntry === null || keyNodeOrEntry === undefined) return false;
    return this.isNode(keyNodeOrEntry);
  }

  /**
   * Checks if the given item is either a "real" node or null.
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeOrEntry - The item to check.
   * @returns True if it's a real node or null, false otherwise.
   */
  isRealNodeOrNull(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is BinaryTreeNode<K, V> | null {
    return keyNodeOrEntry === null || this.isRealNode(keyNodeOrEntry);
  }

  /**
   * Checks if the given item is the sentinel NIL node.
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeOrEntry - The item to check.
   * @returns True if it's the NIL node, false otherwise.
   */
  isNIL(keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined): boolean {
    return keyNodeOrEntry === this._NIL;
  }

  /**
   * Checks if the given item is a `Range` object.
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeEntryOrPredicate - The item to check.
   * @returns True if it's a Range, false otherwise.
   */
  isRange(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V>>
      | Range<K>
  ): keyNodeEntryOrPredicate is Range<K> {
    return keyNodeEntryOrPredicate instanceof Range;
  }

  /**
   * Checks if a node is a leaf (has no real children).
   * @remarks Time O(N) if a key/entry is passed (due to `ensureNode`). O(1) if a node is passed. Space O(1) or O(H) (from `ensureNode`).
   *
   * @param keyNodeOrEntry - The node to check.
   * @returns True if the node is a leaf, false otherwise.
   */
  isLeaf(keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined): boolean {
    keyNodeOrEntry = this.ensureNode(keyNodeOrEntry);
    if (keyNodeOrEntry === undefined) return false;
    if (keyNodeOrEntry === null) return true; // A null spot is considered a leaf
    return !this.isRealNode(keyNodeOrEntry.left) && !this.isRealNode(keyNodeOrEntry.right);
  }

  /**
   * Checks if the given item is a [key, value] entry pair.
   * @remarks Time O(1), Space O(1)
   *
   * @param keyNodeOrEntry - The item to check.
   * @returns True if it's an entry, false otherwise.
   */
  isEntry(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is BTNEntry<K, V> {
    return Array.isArray(keyNodeOrEntry) && keyNodeOrEntry.length === 2;
  }

  /**
   * Checks if the given key is valid (comparable or null).
   * @remarks Time O(1), Space O(1)
   *
   * @param key - The key to validate.
   * @returns True if the key is valid, false otherwise.
   */
  isValidKey(key: any): key is K {
    if (key === null) return true;
    return isComparable(key);
  }

  /**
   * Adds a new node to the tree.
   * @remarks Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). This implementation adds the node at the first available position in a level-order (BFS) traversal. This is NOT a Binary Search Tree insertion. Time O(N), where N is the number of nodes. It must traverse level-by-level to find an empty slot. Space O(N) in the worst case for the BFS queue (e.g., a full last level).
   *
   * @param keyNodeOrEntry - The key, node, or entry to add.
   * @param [value] - The value, if providing just a key.
   * @returns True if the addition was successful, false otherwise.
   */
  add(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): boolean {
    const [newNode, newValue] = this._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value);
    if (newNode === undefined) return false;

    if (!this._root) {
      this._setRoot(newNode);
      if (this._isMapMode) this._setValue(newNode?.key, newValue);
      this._size = 1;
      return true;
    }

    const queue = new Queue<BinaryTreeNode<K, V>>([this._root]);
    let potentialParent: BinaryTreeNode<K, V> | undefined;
    while (queue.length > 0) {
      const cur = queue.shift();

      if (!cur) continue;

      if (!this._isDuplicate) {
        if (newNode !== null && cur.key === newNode.key) {
          this._replaceNode(cur, newNode);
          if (this._isMapMode) this._setValue(cur.key, newValue);
          return true; // Replaced existing node
        }
      }

      if (potentialParent === undefined && (cur.left === undefined || cur.right === undefined)) {
        potentialParent = cur;
      }

      if (cur.left !== null) {
        if (cur.left) queue.push(cur.left);
      }
      if (cur.right !== null) {
        if (cur.right) queue.push(cur.right);
      }
    }

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

    return false; // Should not happen if tree is not full?
  }

  /**
   * Adds multiple items to the tree.
   * @remarks Time O(N * M), where N is the number of items to add and M is the size of the tree at insertion (due to O(M) `add` operation). Space O(M) (from `add`) + O(N) (for the `inserted` array).
   *
   * @param keysNodesEntriesOrRaws - An iterable of items to add.
   * @param [values] - An optional parallel iterable of values.
   * @returns An array of booleans indicating the success of each individual `add` operation.
   */
  addMany(
    keysNodesEntriesOrRaws: Iterable<
      K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    >,
    values?: Iterable<V | undefined>
  ): boolean[] {
    const inserted: boolean[] = [];

    let valuesIterator: Iterator<V | undefined> | undefined;
    if (values) {
      valuesIterator = values[Symbol.iterator]();
    }

    for (let keyNodeEntryOrRaw of keysNodesEntriesOrRaws) {
      let value: V | undefined | null = undefined;

      if (valuesIterator) {
        const valueResult = valuesIterator.next();
        if (!valueResult.done) {
          value = valueResult.value;
        }
      }
      if (this.isRaw(keyNodeEntryOrRaw)) keyNodeEntryOrRaw = this._toEntryFn!(keyNodeEntryOrRaw);
      inserted.push(this.add(keyNodeEntryOrRaw, value));
    }

    return inserted;
  }

  /**
   * Merges another tree into this one by adding all its nodes.
   * @remarks Time O(N * M), same as `addMany`, where N is the size of `anotherTree` and M is the size of this tree. Space O(M) (from `add`).
   *
   * @param anotherTree - The tree to merge.
   */
  merge(anotherTree: BinaryTree<K, V, R>) {
    this.addMany(anotherTree, []);
  }

  /**
   * Clears the tree and refills it with new items.
   * @remarks Time O(N) (for `clear`) + O(N * M) (for `addMany`) = O(N * M). Space O(M) (from `addMany`).
   *
   * @param keysNodesEntriesOrRaws - An iterable of items to add.
   * @param [values] - An optional parallel iterable of values.
   */
  refill(
    keysNodesEntriesOrRaws: Iterable<
      K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    >,
    values?: Iterable<V | undefined>
  ): void {
    this.clear();
    this.addMany(keysNodesEntriesOrRaws, values);
  }

  /**
   * Deletes a node from the tree.
   * @remarks Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). This implementation finds the node, and if it has two children, swaps it with the rightmost node of its left subtree (in-order predecessor) before deleting. Time O(N) in the worst case. O(N) to find the node (`getNode`) and O(H) (which is O(N) worst-case) to find the rightmost node. Space O(1) (if `getNode` is iterative, which it is).
   *
   * @param keyNodeOrEntry - The node to delete.
   * @returns An array containing deletion results (for compatibility with self-balancing trees).
   */
  delete(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): BinaryTreeDeleteResult<BinaryTreeNode<K, V>>[] {
    const deletedResult: BinaryTreeDeleteResult<BinaryTreeNode<K, V>>[] = [];
    if (!this._root) return deletedResult;

    const curr = this.getNode(keyNodeOrEntry);
    if (!curr) return deletedResult;

    const parent: BinaryTreeNode<K, V> | undefined = curr?.parent;
    let needBalanced: BinaryTreeNode<K, V> | undefined;
    let orgCurrent: BinaryTreeNode<K, V> | undefined = curr;

    if (!curr.left && !curr.right && !parent) {
      // Deleting the root with no children
      this._setRoot(undefined);
    } else if (curr.left) {
      // Node has a left child (or two children)
      // Find the rightmost node in the left subtree
      const leftSubTreeRightMost = this.getRightMost(node => node, curr.left);
      if (leftSubTreeRightMost) {
        const parentOfLeftSubTreeMax = leftSubTreeRightMost.parent;
        // Swap properties
        orgCurrent = this._swapProperties(curr, leftSubTreeRightMost);
        // `orgCurrent` is now the node to be physically deleted (which was the rightmost)
        if (parentOfLeftSubTreeMax) {
          // Unlink the rightmost node
          if (parentOfLeftSubTreeMax.right === leftSubTreeRightMost)
            parentOfLeftSubTreeMax.right = leftSubTreeRightMost.left;
          else parentOfLeftSubTreeMax.left = leftSubTreeRightMost.left;
          needBalanced = parentOfLeftSubTreeMax;
        }
      }
    } else if (parent) {
      // Node has no left child, but has a parent
      // Promote the right child (which could be null)
      const { familyPosition: fp } = curr;
      if (fp === 'LEFT' || fp === 'ROOT_LEFT') {
        parent.left = curr.right;
      } else if (fp === 'RIGHT' || fp === 'ROOT_RIGHT') {
        parent.right = curr.right;
      }
      needBalanced = parent;
    } else {
      // Deleting the root, which has no left child
      // Promote the right child as the new root
      this._setRoot(curr.right);
      curr.right = undefined;
    }

    this._size = this._size - 1;

    deletedResult.push({ deleted: orgCurrent, needBalanced });
    if (this._isMapMode && orgCurrent) this._store.delete(orgCurrent.key);
    return deletedResult;
  }

  /**
   * Searches the tree for nodes matching a predicate.
   * @remarks Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). Performs a full DFS (pre-order) scan of the tree. Time O(N), as it may visit every node. Space O(H) for the call stack (recursive) or explicit stack (iterative), where H is the tree height (O(N) worst-case).
   *
   * @template C - The type of the callback function.
   * @param keyNodeEntryOrPredicate - The key, node, entry, or predicate function to search for.
   * @param [onlyOne=false] - If true, stops after finding the first match.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - A function to call on matching nodes.
   * @param [startNode=this._root] - The node to start the search from.
   * @param [iterationType=this.iterationType] - Whether to use 'RECURSIVE' or 'ITERATIVE' search.
   * @returns An array of results from the callback function for each matching node.
   */
  search<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V> | null>,
    onlyOne = false,
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    if (keyNodeEntryOrPredicate === undefined) return [];
    if (keyNodeEntryOrPredicate === null) return [];
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    const predicate = this._ensurePredicate(keyNodeEntryOrPredicate);

    const ans: ReturnType<C>[] = [];

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: BinaryTreeNode<K, V>) => {
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
   * Gets all nodes matching a predicate.
   * @remarks Time O(N) (via `search`). Space O(H) or O(N) (via `search`).
   *
   * @param keyNodeEntryOrPredicate - The key, node, entry, or predicate function to search for.
   * @param [onlyOne=false] - If true, stops after finding the first match.
   * @param [startNode=this._root] - The node to start the search from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns An array of matching nodes.
   */
  getNodes(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V>>,
    onlyOne?: boolean,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): BinaryTreeNode<K, V>[];

  getNodes(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V> | null>,
    onlyOne = false,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): (BinaryTreeNode<K, V> | null)[] {
    return this.search(keyNodeEntryOrPredicate, onlyOne, node => node, startNode, iterationType);
  }

  /**
   * Gets the first node matching a predicate.
   * @remarks Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). Time O(N) in the worst case (via `search`). Space O(H) or O(N) (via `search`).
   *
   * @param keyNodeEntryOrPredicate - The key, node, entry, or predicate function to search for.
   * @param [startNode=this._root] - The node to start the search from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns The first matching node, or undefined if not found.
   */
  getNode(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V> | null>,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): BinaryTreeNode<K, V> | null | undefined {
    return this.search(keyNodeEntryOrPredicate, true, node => node, startNode, iterationType)[0];
  }

  /**
   * Gets the value associated with a key.
   * @remarks Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). Time O(1) if in Map mode. O(N) if not in Map mode (uses `getNode`). Space O(1) if in Map mode. O(H) or O(N) otherwise.
   *
   * @param keyNodeEntryOrPredicate - The key, node, or entry to get the value for.
   * @param [startNode=this._root] - The node to start searching from (if not in Map mode).
   * @param [iterationType=this.iterationType] - The traversal method (if not in Map mode).
   * @returns The associated value, or undefined.
   */
  override get(
    keyNodeEntryOrPredicate: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): V | undefined {
    if (this._isMapMode) {
      const key = this._extractKey(keyNodeEntryOrPredicate);
      if (key === null || key === undefined) return;
      return this._store.get(key);
    }
    return this.getNode(keyNodeEntryOrPredicate, startNode, iterationType)?.value;
  }

  /**
   * Checks if a node matching the predicate exists in the tree.
   * @remarks Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). Time O(N) in the worst case (via `search`). Space O(H) or O(N) (via `search`).
   *
   * @param [keyNodeEntryOrPredicate] - The key, node, entry, or predicate to check for.
   * @param [startNode] - The node to start the search from.
   * @param [iterationType] - The traversal method.
   * @returns True if a matching node exists, false otherwise.
   */
  override has(
    keyNodeEntryOrPredicate?:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V>>,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): boolean;

  override has(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V> | null>,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): boolean {
    return this.search(keyNodeEntryOrPredicate, true, node => node, startNode, iterationType).length > 0;
  }

  /**
   * Clears the tree of all nodes and values.
   * @remarks Time O(N) if in Map mode (due to `_store.clear()`), O(1) otherwise. Space O(1)
   */
  clear() {
    this._clearNodes();
    if (this._isMapMode) this._clearValues();
  }

  /**
   * Checks if the tree is empty.
   * @remarks Time O(1), Space O(1)
   *
   * @returns True if the tree has no nodes, false otherwise.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Checks if the tree is perfectly balanced.
   * @remarks A tree is perfectly balanced if the difference between min and max height is at most 1. Time O(N), as it requires two full traversals (`getMinHeight` and `getHeight`). Space O(H) or O(N) (from height calculation).
   *
   * @param [startNode=this._root] - The node to start checking from.
   * @returns True if perfectly balanced, false otherwise.
   */
  isPerfectlyBalanced(
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root
  ): boolean {
    return this.getMinHeight(startNode) + 1 >= this.getHeight(startNode);
  }

  /**
   * Checks if the tree is a valid Binary Search Tree (BST).
   * @remarks Time O(N), as it must visit every node. Space O(H) for the call stack (recursive) or explicit stack (iterative), where H is the tree height (O(N) worst-case).
   *
   * @param [startNode=this._root] - The node to start checking from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns True if it's a valid BST, false otherwise.
   */
  isBST(
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): boolean {
    const startNodeSired = this.ensureNode(startNode);
    if (!startNodeSired) return true;

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: BinaryTreeNode<K, V> | null | undefined, min: number, max: number): boolean => {
        if (!this.isRealNode(cur)) return true;
        const numKey = Number(cur.key);
        if (numKey <= min || numKey >= max) return false;
        return dfs(cur.left, min, numKey) && dfs(cur.right, numKey, max);
      };

      const isStandardBST = dfs(startNodeSired, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
      const isInverseBST = dfs(startNodeSired, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER); // Check for reverse BST
      return isStandardBST || isInverseBST;
    } else {
      // Iterative in-order traversal check
      const checkBST = (checkMax = false) => {
        const stack: BinaryTreeNode<K, V>[] = [];
        let prev = checkMax ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        let curr: BinaryTreeNode<K, V> | null | undefined = startNodeSired;
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
      const isStandardBST = checkBST(false);
      const isInverseBST = checkBST(true);
      return isStandardBST || isInverseBST;
    }
  }

  /**
   * Gets the depth of a node (distance from `startNode`).
   * @remarks Time O(H), where H is the depth of the `dist` node relative to `startNode`. O(N) worst-case. Space O(1).
   *
   * @param dist - The node to find the depth of.
   * @param [startNode=this._root] - The node to measure depth from (defaults to root).
   * @returns The depth (0 if `dist` is `startNode`).
   */
  getDepth(
    dist: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root
  ): number {
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
   * Gets the maximum height of the tree (longest path from startNode to a leaf).
   * @remarks Time O(N), as it must visit every node. Space O(H) for recursive stack (O(N) worst-case) or O(N) for iterative stack (storing node + depth).
   *
   * @param [startNode=this._root] - The node to start measuring from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns The height ( -1 for an empty tree, 0 for a single-node tree).
   */
  getHeight(
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): number {
    startNode = this.ensureNode(startNode);
    if (!this.isRealNode(startNode)) return -1;

    if (iterationType === 'RECURSIVE') {
      const _getMaxHeight = (cur: BinaryTreeNode<K, V> | null | undefined): number => {
        if (!this.isRealNode(cur)) return -1;
        const leftHeight = _getMaxHeight(cur.left);
        const rightHeight = _getMaxHeight(cur.right);
        return Math.max(leftHeight, rightHeight) + 1;
      };

      return _getMaxHeight(startNode);
    } else {
      // Iterative (using DFS)
      const stack: { node: BinaryTreeNode<K, V>; depth: number }[] = [{ node: startNode, depth: 0 }];
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
   * Gets the minimum height of the tree (shortest path from startNode to a leaf).
   * @remarks Time O(N), as it must visit every node. Space O(H) for recursive stack (O(N) worst-case) or O(N) for iterative (due to `depths` Map).
   *
   * @param [startNode=this._root] - The node to start measuring from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns The minimum height (-1 for empty, 0 for single node).
   */
  getMinHeight(
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): number {
    startNode = this.ensureNode(startNode);
    if (!startNode) return -1;

    if (iterationType === 'RECURSIVE') {
      const _getMinHeight = (cur: BinaryTreeNode<K, V> | null | undefined): number => {
        if (!this.isRealNode(cur)) return 0;
        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return 0; // Leaf node
        const leftMinHeight = _getMinHeight(cur.left);
        const rightMinHeight = _getMinHeight(cur.right);
        return Math.min(leftMinHeight, rightMinHeight) + 1;
      };

      return _getMinHeight(startNode);
    } else {
      // Iterative (using post-order DFS)
      const stack: BinaryTreeNode<K, V>[] = [];
      let node: BinaryTreeNode<K, V> | null | undefined = startNode,
        last: BinaryTreeNode<K, V> | null | undefined = null;
      const depths: Map<BinaryTreeNode<K, V>, number> = new Map();

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
   * Gets the path from a given node up to the root.
   * @remarks Time O(H), where H is the depth of the `beginNode`. O(N) worst-case. Space O(H) for the result array.
   *
   * @template C - The type of the callback function.
   * @param beginNode - The node to start the path from.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - A function to call on each node in the path.
   * @param [isReverse=false] - If true, returns the path from root-to-node.
   * @returns An array of callback results.
   */
  getPathToRoot<C extends NodeCallback<BinaryTreeNode<K, V> | undefined>>(
    beginNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    isReverse = false
  ): ReturnType<C>[] {
    const result: ReturnType<C>[] = [];
    let beginNodeEnsured = this.ensureNode(beginNode);

    if (!beginNodeEnsured) return result;

    while (beginNodeEnsured.parent) {
      result.push(callback(beginNodeEnsured));
      beginNodeEnsured = beginNodeEnsured.parent;
    }
    result.push(callback(beginNodeEnsured)); // Add the root
    return isReverse ? result.reverse() : result;
  }

  /**
   * Finds the leftmost node in a subtree (the node with the smallest key in a BST).
   * @remarks Time O(H), where H is the height of the left spine. O(N) worst-case. Space O(H) for recursive/trampoline stack.
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - A function to call on the leftmost node.
   * @param [startNode=this._root] - The subtree root to search from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns The callback result for the leftmost node.
   */
  getLeftMost<C extends NodeCallback<BinaryTreeNode<K, V> | undefined>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C> {
    if (this.isNIL(startNode)) return callback(undefined);
    const ensuredStartNode = this.ensureNode(startNode);

    if (!this.isRealNode(ensuredStartNode)) return callback(undefined);
    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: BinaryTreeNode<K, V>): BinaryTreeNode<K, V> => {
        const { left } = cur;
        if (!this.isRealNode(left)) return cur;
        return dfs(left);
      };

      return callback(dfs(ensuredStartNode));
    } else {
      // Iterative (trampolined to prevent stack overflow, though 'ITERATIVE' usually means a loop)
      const dfs = makeTrampoline((cur: BinaryTreeNode<K, V>): Trampoline<BinaryTreeNode<K, V>> => {
        const { left } = cur;
        if (!this.isRealNode(left)) return cur;
        return makeTrampolineThunk(() => dfs(left));
      });

      return callback(dfs(ensuredStartNode));
    }
  }

  /**
   * Finds the rightmost node in a subtree (the node with the largest key in a BST).
   * @remarks Time O(H), where H is the height of the right spine. O(N) worst-case. Space O(H) for recursive/trampoline stack.
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - A function to call on the rightmost node.
   * @param [startNode=this._root] - The subtree root to search from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns The callback result for the rightmost node.
   */
  getRightMost<C extends NodeCallback<BinaryTreeNode<K, V> | undefined>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C> {
    if (this.isNIL(startNode)) return callback(undefined);
    startNode = this.ensureNode(startNode);
    if (!startNode) return callback(undefined);

    if (iterationType === 'RECURSIVE') {
      const dfs = (cur: BinaryTreeNode<K, V>): BinaryTreeNode<K, V> => {
        const { right } = cur;
        if (!this.isRealNode(right)) return cur;
        return dfs(right);
      };

      return callback(dfs(startNode));
    } else {
      const dfs = makeTrampoline((cur: BinaryTreeNode<K, V>): Trampoline<BinaryTreeNode<K, V>> => {
        const { right } = cur;
        if (!this.isRealNode(right)) return cur;
        return makeTrampolineThunk(() => dfs(right));
      });

      return callback(dfs(startNode));
    }
  }

  /**
   * Gets the Morris traversal predecessor (rightmost node in the left subtree, or node itself).
   * @remarks This is primarily a helper for Morris traversal. Time O(H), where H is the height of the left subtree. O(N) worst-case. Space O(1).
   *
   * @param node - The node to find the predecessor for.
   * @returns The Morris predecessor.
   */
  getPredecessor(node: BinaryTreeNode<K, V>): BinaryTreeNode<K, V> {
    if (this.isRealNode(node.left)) {
      let predecessor: BinaryTreeNode<K, V> | null | undefined = node.left;
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
   * Gets the in-order successor of a node in a BST.
   * @remarks Time O(H), where H is the tree height. O(N) worst-case. Space O(H) (due to `getLeftMost` stack).
   *
   * @param [x] - The node to find the successor of.
   * @returns The successor node, or null/undefined if none exists.
   */
  getSuccessor(x?: K | BinaryTreeNode<K, V> | null): BinaryTreeNode<K, V> | null | undefined {
    x = this.ensureNode(x);
    if (!this.isRealNode(x)) return undefined;

    if (this.isRealNode(x.right)) {
      return this.getLeftMost(node => node, x.right);
    }

    let y: BinaryTreeNode<K, V> | null | undefined = x.parent;
    while (this.isRealNode(y) && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  dfs<C extends NodeCallback<BinaryTreeNode<K, V>>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    onlyOne?: boolean,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): ReturnType<C>[];

  dfs<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    onlyOne?: boolean,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: boolean
  ): ReturnType<C>[];

  /**
   * Performs a Depth-First Search (DFS) traversal.
   * @remarks Time O(N), visits every node. Space O(H) for the call/explicit stack. O(N) worst-case.
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on each node.
   * @param [pattern='IN'] - The traversal order ('IN', 'PRE', 'POST').
   * @param [onlyOne=false] - If true, stops after the first callback.
   * @param [startNode=this._root] - The node to start from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @param [includeNull=false] - If true, includes null nodes in the traversal.
   * @returns An array of callback results.
   */
  dfs<C extends NodeCallback<BinaryTreeNode<K, V> | undefined>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    onlyOne: boolean = false,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    return this._dfs(callback, pattern, onlyOne, startNode, iterationType, includeNull);
  }

  bfs<C extends NodeCallback<BinaryTreeNode<K, V>>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  bfs<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  /**
   * Performs a Breadth-First Search (BFS) or Level-Order traversal.
   * @remarks Time O(N), visits every node. Space O(N) in the worst case for the queue (e.g., a full last level).
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on each node.
   * @param [startNode=this._root] - The node to start from.
   * @param [iterationType=this.iterationType] - The traversal method ('RECURSIVE' BFS is less common but supported here).
   * @param [includeNull=false] - If true, includes null nodes in the traversal.
   * @returns An array of callback results.
   */
  bfs<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];

    const ans: ReturnType<NodeCallback<BinaryTreeNode<K, V> | null>>[] = [];

    if (iterationType === 'RECURSIVE') {
      // This is a "recursive" BFS, which is atypical. It uses a queue but calls itself.
      const queue: Queue<OptNodeOrNull<BinaryTreeNode<K, V>>> = new Queue<OptNodeOrNull<BinaryTreeNode<K, V>>>([
        startNode
      ]);

      const dfs = (level: number) => {
        if (queue.length === 0) return;

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
      // Standard iterative BFS
      const queue = new Queue<OptNodeOrNull<BinaryTreeNode<K, V>>>([startNode]);
      while (queue.length > 0) {
        const levelSize = queue.length; // Not strictly needed here, but good for level-by-level
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
   * Finds all leaf nodes in the tree.
   * @remarks Time O(N), visits every node. Space O(H) for recursive stack or O(N) for iterative queue.
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on each leaf node.
   * @param [startNode=this._root] - The node to start from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @returns An array of callback results.
   */
  leaves<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    const leaves: ReturnType<NodeCallback<BinaryTreeNode<K, V> | null>>[] = [];

    if (!this.isRealNode(startNode)) return [];

    if (iterationType === 'RECURSIVE') {
      // DFS-based
      const dfs = (cur: BinaryTreeNode<K, V>) => {
        if (this.isLeaf(cur)) {
          leaves.push(callback(cur));
        }
        if (!this.isRealNode(cur.left) && !this.isRealNode(cur.right)) return;
        if (this.isRealNode(cur.left)) dfs(cur.left);
        if (this.isRealNode(cur.right)) dfs(cur.right);
      };

      dfs(startNode);
    } else {
      // BFS-based
      const queue = new Queue([startNode]);

      while (queue.length > 0) {
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

  listLevels<C extends NodeCallback<BinaryTreeNode<K, V>>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[][];

  listLevels<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[][];

  /**
   * Returns a 2D array of nodes, grouped by level.
   * @remarks Time O(N), visits every node. Space O(N) for the result array and the queue/stack.
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on each node.
   * @param [startNode=this._root] - The node to start from.
   * @param [iterationType=this.iterationType] - The traversal method.
   * @param [includeNull=false] - If true, includes null nodes.
   * @returns A 2D array of callback results.
   */
  listLevels<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType,
    includeNull = false
  ): ReturnType<C>[][] {
    startNode = this.ensureNode(startNode);
    const levelsNodes: ReturnType<C>[][] = [];

    if (!startNode) return levelsNodes;

    if (iterationType === 'RECURSIVE') {
      // Pre-order DFS based level listing
      const _recursive = (node: BinaryTreeNode<K, V> | null, level: number) => {
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
      // Iterative DFS based level listing
      const stack: [BinaryTreeNode<K, V> | null, number][] = [[startNode, 0]];

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

  morris<C extends NodeCallback<BinaryTreeNode<K, V>>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): ReturnType<C>[];

  /**
   * Performs a Morris (threaded) traversal.
   * @remarks This traversal uses O(1) extra space (excluding the result array) by temporarily modifying the tree's right child pointers. Time O(N), as each node is visited a constant number of times. Space O(1) (excluding the `ans` array).
   *
   * @template C - The type of the callback function.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on each node.
   * @param [pattern='IN'] - The traversal order ('IN', 'PRE', 'POST').
   * @param [startNode=this._root] - The node to start from.
   * @returns An array of callback results.
   */
  morris<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);

    if (!startNode) return [];
    const ans: ReturnType<NodeCallback<BinaryTreeNode<K, V> | null>>[] = [];

    let cur: BinaryTreeNode<K, V> | null | undefined = startNode;

    // Helper to reverse a linked list (formed by right pointers)
    const _reverseEdge = (node: BinaryTreeNode<K, V> | null | undefined) => {
      let pre: BinaryTreeNode<K, V> | null | undefined = null;
      let next: BinaryTreeNode<K, V> | null | undefined = null;
      while (node) {
        next = node.right;
        node.right = pre;
        pre = node;
        node = next;
      }
      return pre;
    };

    // Helper to print the reversed edge (for post-order)
    const _printEdge = (node: BinaryTreeNode<K, V> | null | undefined) => {
      const tail: BinaryTreeNode<K, V> | null | undefined = _reverseEdge(node);
      let cur: BinaryTreeNode<K, V> | null | undefined = tail;

      while (cur) {
        ans.push(callback(cur));
        cur = cur.right;
      }

      _reverseEdge(tail); // Restore the edge
    };

    switch (pattern) {
      case 'IN':
        while (cur) {
          if (cur.left) {
            const predecessor = this.getPredecessor(cur);
            if (!predecessor.right) {
              // Create thread
              predecessor.right = cur;
              cur = cur.left;
              continue;
            } else {
              // Remove thread
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
              // Create thread and visit
              predecessor.right = cur;
              ans.push(callback(cur));
              cur = cur.left;
              continue;
            } else {
              // Remove thread
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
              // Create thread
              predecessor.right = cur;
              cur = cur.left;
              continue;
            } else {
              // Remove thread and print right spine of left child
              predecessor.right = null;
              _printEdge(cur.left);
            }
          }
          cur = cur.right;
        }
        _printEdge(startNode); // Print the right spine of the root
        break;
    }
    return ans;
  }

  /**
   * Clones the tree.
   * @remarks Time O(N * M), where N is the number of nodes and M is the tree size during insertion (due to `bfs` + `add`, and `add` is O(M)). Space O(N) for the new tree and the BFS queue.
   *
   * @returns A new, cloned instance of the tree.
   */
  clone(): this {
    const out = this._createInstance<K, V, R>();
    this._clone(out);
    return out;
  }

  /**
   * Creates a new tree containing only the entries that satisfy the predicate.
   * @remarks Time O(N * M), where N is nodes in this tree, and M is size of the new tree during insertion (O(N) iteration + O(M) `add` for each item). Space O(N) for the new tree.
   *
   * @param predicate - A function to test each [key, value] pair.
   * @param [thisArg] - `this` context for the predicate.
   * @returns A new, filtered tree.
   */
  filter(predicate: EntryCallback<K, V | undefined, boolean>, thisArg?: unknown): this {
    const out = this._createInstance<K, V, R>();
    let i = 0;
    for (const [k, v] of this) if (predicate.call(thisArg, v, k, i++, this)) out.add([k, v]);
    return out;
  }

  /**
   * Creates a new tree by mapping each [key, value] pair to a new entry.
   * @remarks Time O(N * M), where N is nodes in this tree, and M is size of the new tree during insertion. Space O(N) for the new tree.
   *
   * @template MK - New key type.
   * @template MV - New value type.
   * @template MR - New raw type.
   * @param cb - A function to map each [key, value] pair.
   * @param [options] - Options for the new tree.
   * @param [thisArg] - `this` context for the callback.
   * @returns A new, mapped tree.
   */
  map<MK = K, MV = V, MR = any>(
    cb: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: Partial<BinaryTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): BinaryTree<MK, MV, MR> {
    const out = this._createLike<MK, MV, MR>([], options);
    let i = 0;
    for (const [k, v] of this) out.add(cb.call(thisArg, v, k, i++, this));
    return out;
  }

  /**
   * Generates a string representation of the tree for visualization.
   * @remarks Time O(N), visits every node. Space O(N*H) or O(N^2) in the worst case, as the string width can grow significantly.
   *
   * @param [startNode=this._root] - The node to start printing from.
   * @param [options] - Options to control the output (e.g., show nulls).
   * @returns The string representation of the tree.
   */
  override toVisual(
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    options?: BinaryTreePrintOptions
  ): string {
    const opts = { isShowUndefined: false, isShowNull: true, isShowRedBlackNIL: false, ...options };
    startNode = this.ensureNode(startNode);
    let output = '';
    if (!startNode) return output;

    if (opts.isShowUndefined) output += `U for undefined\n`;
    if (opts.isShowNull) output += `N for null\n`;
    if (opts.isShowRedBlackNIL) output += `S for Sentinel Node(NIL)\n`;

    const display = (root: BinaryTreeNode<K, V> | null | undefined): void => {
      const [lines] = this._displayAux(root, opts);
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
   * Prints a visual representation of the tree to the console.
   * @remarks Time O(N) (via `toVisual`). Space O(N*H) or O(N^2) (via `toVisual`).
   *
   * @param [options] - Options to control the output.
   * @param [startNode=this._root] - The node to start printing from.
   */
  override print(
    options?: BinaryTreePrintOptions,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root
  ) {
    console.log(this.toVisual(startNode, options));
  }

  protected _dfs<C extends NodeCallback<BinaryTreeNode<K, V>>>(
    callback: C,
    pattern?: DFSOrderPattern,
    onlyOne?: boolean,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: boolean,
    shouldVisitLeft?: (node: BinaryTreeNode<K, V> | null | undefined) => boolean,
    shouldVisitRight?: (node: BinaryTreeNode<K, V> | null | undefined) => boolean,
    shouldVisitRoot?: (node: BinaryTreeNode<K, V> | null | undefined) => boolean,
    shouldProcessRoot?: (node: BinaryTreeNode<K, V> | null | undefined) => boolean
  ): ReturnType<C>[];

  /**
   * (Protected) Core DFS implementation.
   * @remarks Time O(N), visits every node satisfying predicates. Space O(H) for call/explicit stack. O(N) worst-case.
   *
   * @template C - Callback type.
   * @param [callback=this._DEFAULT_NODE_CALLBACK] - Function to call on nodes.
   * @param [pattern='IN'] - Traversal order.
   * @param [onlyOne=false] - Stop after first match.
   * @param [startNode=this._root] - Starting node.
   * @param [iterationType=this.iterationType] - Traversal method.
   * @param [includeNull=false] - Include nulls.
   * @param [shouldVisitLeft] - Predicate to traverse left.
   * @param [shouldVisitRight] - Predicate to traverse right.
   * @param [shouldVisitRoot] - Predicate to visit root.
   * @param [shouldProcessRoot] - Predicate to process root.
   * @returns Array of callback results.
   */
  protected _dfs<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback: C = this._DEFAULT_NODE_CALLBACK as C,
    pattern: DFSOrderPattern = 'IN',
    onlyOne: boolean = false,
    startNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined = this._root,
    iterationType: IterationType = this.iterationType,
    includeNull = false,
    shouldVisitLeft: (node: BinaryTreeNode<K, V> | null | undefined) => boolean = node => !!node,
    shouldVisitRight: (node: BinaryTreeNode<K, V> | null | undefined) => boolean = node => !!node,
    shouldVisitRoot: (node: BinaryTreeNode<K, V> | null | undefined) => boolean = node => {
      if (includeNull) return this.isRealNodeOrNull(node);
      return this.isRealNode(node);
    },
    shouldProcessRoot: (node: BinaryTreeNode<K, V> | null | undefined) => boolean = node => this.isRealNodeOrNull(node)
  ): ReturnType<C>[] {
    startNode = this.ensureNode(startNode);
    if (!startNode) return [];
    const ans: ReturnType<C>[] = [];

    if (iterationType === 'RECURSIVE') {
      const dfs = (node: BinaryTreeNode<K, V> | null) => {
        if (!shouldVisitRoot(node)) return;

        const visitLeft = () => {
          if (shouldVisitLeft(node) && node?.left !== undefined) dfs(node?.left);
        };
        const visitRight = () => {
          if (shouldVisitRight(node) && node?.right !== undefined) dfs(node?.right);
        };

        switch (pattern) {
          case 'IN':
            visitLeft();
            if (shouldProcessRoot(node)) {
              ans.push(callback(node));
              if (onlyOne) return;
            }
            visitRight();
            break;
          case 'PRE':
            if (shouldProcessRoot(node)) {
              ans.push(callback(node));
              if (onlyOne) return;
            }
            visitLeft();
            visitRight();
            break;
          case 'POST':
            visitLeft();
            visitRight();
            if (shouldProcessRoot(node)) {
              ans.push(callback(node));
              if (onlyOne) return;
            }
            break;
        }
      };

      dfs(startNode);
    } else {
      // Iterative
      const stack: DFSStackItem<BinaryTreeNode<K, V>>[] = [{ opt: DFSOperation.VISIT, node: startNode }];

      const pushLeft = (cur: DFSStackItem<BinaryTreeNode<K, V>>) => {
        if (shouldVisitLeft(cur.node)) stack.push({ opt: DFSOperation.VISIT, node: cur.node?.left });
      };
      const pushRight = (cur: DFSStackItem<BinaryTreeNode<K, V>>) => {
        if (shouldVisitRight(cur.node)) stack.push({ opt: DFSOperation.VISIT, node: cur.node?.right });
      };
      const pushRoot = (cur: DFSStackItem<BinaryTreeNode<K, V>>) => {
        if (shouldVisitRoot(cur.node)) stack.push({ opt: DFSOperation.PROCESS, node: cur.node });
      };

      while (stack.length > 0) {
        const cur = stack.pop();
        if (cur === undefined) continue;
        if (!shouldVisitRoot(cur.node)) continue;
        if (cur.opt === DFSOperation.PROCESS) {
          if (shouldProcessRoot(cur.node) && cur.node !== undefined) {
            ans.push(callback(cur.node));
            if (onlyOne) return ans;
          }
        } else {
          // VISIT
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
   * (Protected) Gets the iterator for the tree (default in-order).
   * @remarks Time O(N) for full iteration. O(H) to get the first element. Space O(H) for the iterative stack. O(H) for recursive stack.
   *
   * @param [node=this._root] - The node to start iteration from.
   * @returns An iterator for [key, value] pairs.
   */
  protected *_getIterator(node = this._root): IterableIterator<[K, V | undefined]> {
    if (!node) return;

    if (this.iterationType === 'ITERATIVE') {
      const stack: (BinaryTreeNode<K, V> | null | undefined)[] = [];
      let current: BinaryTreeNode<K, V> | null | undefined = node;

      while (current || stack.length > 0) {
        // Go to the leftmost node
        while (this.isRealNode(current)) {
          stack.push(current);
          current = current.left;
        }

        // Visit the node
        current = stack.pop();

        if (this.isRealNode(current)) {
          if (this._isMapMode) yield [current.key, this._store.get(current.key)];
          else yield [current.key, current.value];
          // Move to the right subtree
          current = current.right;
        }
      }
    } else {
      // Recursive in-order traversal
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
   * (Protected) Default callback function, returns the node's key.
   * @remarks Time O(1)
   *
   * @param node - The node.
   * @returns The node's key or undefined.
   */
  protected _DEFAULT_NODE_CALLBACK = (node: BinaryTreeNode<K, V> | null | undefined) => (node ? node.key : undefined);

  /**
   * (Protected) Snapshots the current tree's configuration options.
   * @remarks Time O(1)
   *
   * @template TK, TV, TR - Generic types for the options.
   * @returns The options object.
   */
  protected _snapshotOptions<TK = K, TV = V, TR = R>(): BinaryTreeOptions<TK, TV, TR> {
    return {
      iterationType: this.iterationType,
      toEntryFn: this.toEntryFn as unknown as BinaryTreeOptions<TK, TV, TR>['toEntryFn'],
      isMapMode: this.isMapMode,
      isDuplicate: this.isDuplicate
    };
  }

  /**
   * (Protected) Creates a new, empty instance of the same tree constructor.
   * @remarks Time O(1)
   *
   * @template TK, TV, TR - Generic types for the new instance.
   * @param [options] - Options for the new tree.
   * @returns A new, empty tree.
   */
  protected _createInstance<TK = K, TV = V, TR = R>(options?: Partial<BinaryTreeOptions<TK, TV, TR>>): this {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | BinaryTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: BinaryTreeOptions<TK, TV, TR>
    ) => BinaryTree<TK, TV, TR>;
    return new Ctor([], { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) }) as unknown as this;
  }

  /**
   * (Protected) Creates a new instance of the same tree constructor, potentially with different generic types.
   * @remarks Time O(N) (or as per constructor) due to processing the iterable.
   *
   * @template TK, TV, TR - Generic types for the new instance.
   * @param [iter=[]] - An iterable to populate the new tree.
   * @param [options] - Options for the new tree.
   * @returns A new tree.
   */
  protected _createLike<TK = K, TV = V, TR = R>(
    iter: Iterable<TK | BinaryTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR> = [],
    options?: Partial<BinaryTreeOptions<TK, TV, TR>>
  ): BinaryTree<TK, TV, TR> {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | BinaryTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: BinaryTreeOptions<TK, TV, TR>
    ) => BinaryTree<TK, TV, TR>;
    return new Ctor(iter, { ...this._snapshotOptions<TK, TV, TR>(), ...(options ?? {}) }) as unknown as BinaryTree<
      TK,
      TV,
      TR
    >;
  }

  /**
   * (Protected) Converts a key, node, or entry into a standardized [node, value] tuple.
   * @remarks Time O(1)
   *
   * @param keyNodeOrEntry - The input item.
   * @param [value] - An optional value (used if input is just a key).
   * @returns A tuple of [node, value].
   */
  protected _keyValueNodeOrEntryToNodeAndValue(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): [BinaryTreeNode<K, V> | null | undefined, V | undefined] {
    if (keyNodeOrEntry === undefined) return [undefined, undefined];
    if (keyNodeOrEntry === null) return [null, undefined];

    if (this.isNode(keyNodeOrEntry)) return [keyNodeOrEntry, value];

    if (this.isEntry(keyNodeOrEntry)) {
      const [key, entryValue] = keyNodeOrEntry;
      if (key === undefined) return [undefined, undefined];
      else if (key === null) return [null, undefined];
      const finalValue = value ?? entryValue;
      return [this.createNode(key, finalValue), finalValue];
    }

    return [this.createNode(keyNodeOrEntry, value), value];
  }

  /**
   * (Protected) Helper for cloning. Performs a BFS and adds all nodes to the new tree.
   * @remarks Time O(N * M) (O(N) BFS + O(M) `add` for each node).
   *
   * @param cloned - The new, empty tree instance to populate.
   */
  protected _clone(cloned: BinaryTree<K, V, R>) {
    // Use BFS with nulls to preserve the tree structure
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
      true // Include nulls
    );
    if (this._isMapMode) cloned._store = this._store;
  }

  /**
   * (Protected) Recursive helper for `toVisual`.
   * @remarks Time O(N), Space O(N*H) or O(N^2)
   *
   * @param node - The current node.
   * @param options - Print options.
   * @returns Layout information for this subtree.
   */
  protected _displayAux(
    node: BinaryTreeNode<K, V> | null | undefined,
    options: BinaryTreePrintOptions
  ): NodeDisplayLayout {
    const { isShowNull, isShowUndefined, isShowRedBlackNIL } = options;
    const emptyDisplayLayout = <NodeDisplayLayout>[['─'], 1, 0, 0]; // Represents an empty spot

    if (node === null && !isShowNull) {
      return emptyDisplayLayout;
    } else if (node === undefined && !isShowUndefined) {
      return emptyDisplayLayout;
    } else if (this.isNIL(node) && !isShowRedBlackNIL) {
      return emptyDisplayLayout;
    } else if (node !== null && node !== undefined) {
      // Real node
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
      // Null or Undefined
      const line = node === undefined ? 'U' : 'N',
        width = line.length;

      // Treat as a leaf
      return _buildNodeDisplay(line, width, [[''], 1, 0, 0], [[''], 1, 0, 0]);
    }

    /**
     * (Inner) Builds the display lines for a node.
     * @remarks Time/Space: Proportional to the width and height of the subtrees.
     */
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

  /**
   * (Protected) Swaps the key/value properties of two nodes.
   * @remarks Time O(1)
   *
   * @param srcNode - The source node.
   * @param destNode - The destination node.
   * @returns The `destNode` (now holding `srcNode`'s properties).
   */
  protected _swapProperties(
    srcNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    destNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): BinaryTreeNode<K, V> | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);

    if (srcNode && destNode) {
      const { key, value } = destNode;
      const tempNode = this.createNode(key, value); // Use a temp node to hold dest properties

      if (tempNode) {
        // Copy src to dest
        destNode.key = srcNode.key;
        if (!this._isMapMode) destNode.value = srcNode.value;

        // Copy temp (original dest) to src
        srcNode.key = tempNode.key;
        if (!this._isMapMode) srcNode.value = tempNode.value;
      }

      return destNode;
    }
    return undefined;
  }

  /**
   * (Protected) Replaces a node in the tree with a new node, maintaining children and parent links.
   * @remarks Time O(1)
   *
   * @param oldNode - The node to be replaced.
   * @param newNode - The node to insert.
   * @returns The `newNode`.
   */
  protected _replaceNode(oldNode: BinaryTreeNode<K, V>, newNode: BinaryTreeNode<K, V>): BinaryTreeNode<K, V> {
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
   * (Protected) Sets the root node and clears its parent reference.
   * @remarks Time O(1)
   *
   * @param v - The node to set as root.
   */
  protected _setRoot(v: BinaryTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * (Protected) Converts a key, node, entry, or predicate into a standardized predicate function.
   * @remarks Time O(1)
   *
   * @param keyNodeEntryOrPredicate - The item to convert.
   * @returns A predicate function.
   */
  protected _ensurePredicate(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V>>
  ): NodePredicate<BinaryTreeNode<K, V>>;

  protected _ensurePredicate(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V> | null>
  ): NodePredicate<BinaryTreeNode<K, V> | null> {
    if (keyNodeEntryOrPredicate === null || keyNodeEntryOrPredicate === undefined)
      return (node: BinaryTreeNode<K, V> | null | undefined) => (node ? false : false);

    if (this._isPredicate(keyNodeEntryOrPredicate)) return keyNodeEntryOrPredicate;

    if (this.isRealNode(keyNodeEntryOrPredicate))
      return (node: BinaryTreeNode<K, V> | null) => node === keyNodeEntryOrPredicate;

    if (this.isEntry(keyNodeEntryOrPredicate)) {
      const [key] = keyNodeEntryOrPredicate;
      return (node: BinaryTreeNode<K, V> | null) => {
        if (!node) return false;
        return node.key === key;
      };
    }

    // Assume it's a key
    return (node: BinaryTreeNode<K, V> | null) => {
      if (!node) return false;
      return node.key === keyNodeEntryOrPredicate;
    };
  }

  /**
   * (Protected) Checks if an item is a predicate function.
   * @remarks Time O(1)
   *
   * @param p - The item to check.
   * @returns True if it's a function.
   */
  protected _isPredicate(p: any): p is NodePredicate<BinaryTreeNode<K, V>> {
    return typeof p === 'function';
  }

  /**
   * (Protected) Extracts the key from a key, node, or entry.
   * @remarks Time O(1)
   *
   * @param keyNodeOrEntry - The item.
   * @returns The extracted key.
   */
  protected _extractKey(
    keyNodeOrEntry: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): K | null | undefined {
    if (keyNodeOrEntry === null) return null;
    if (keyNodeOrEntry === undefined) return;
    if (keyNodeOrEntry === this._NIL) return;
    if (this.isNode(keyNodeOrEntry)) return keyNodeOrEntry.key;

    if (this.isEntry(keyNodeOrEntry)) return keyNodeOrEntry[0];

    return keyNodeOrEntry;
  }

  /**
   * (Protected) Sets a value in the external store (Map mode).
   * @remarks Time O(1) (average for Map.set).
   *
   * @param key - The key.
   * @param value - The value.
   * @returns True if successful.
   */
  protected _setValue(key: K | null | undefined, value: V | undefined) {
    if (key === null || key === undefined) return false;
    if (value === undefined) return false; // Or allow setting undefined?
    return this._store.set(key, value);
  }

  /**
   * (Protected) Clears all nodes from the tree.
   * @remarks Time O(1)
   */
  protected _clearNodes() {
    this._setRoot(undefined);
    this._size = 0;
  }

  /**
   * (Protected) Clears all values from the external store.
   * @remarks Time O(N)
   */
  protected _clearValues() {
    this._store.clear();
  }
}
