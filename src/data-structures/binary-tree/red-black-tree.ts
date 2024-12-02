import type { BinaryTreeDeleteResult, CRUD, EntryCallback, OptNode, RBTNColor, RedBlackTreeOptions } from '../../types';
import { BST, BSTNode } from './bst';
import { IBinaryTree } from '../../interfaces';

export class RedBlackTreeNode<K = any, V = any> extends BSTNode<K, V> {
  override parent?: RedBlackTreeNode<K, V> = undefined;

  /**
   * The constructor initializes a node with a key, value, and color for a Red-Black Tree.
   * @param {K} key - The `key` parameter is a key of type `K` that is used to identify the node in a
   * Red-Black Tree data structure.
   * @param {V} [value] - The `value` parameter in the constructor is an optional parameter of type
   * `V`. It represents the value associated with the key in the data structure being constructed.
   * @param {RBTNColor} [color=BLACK] - The `color` parameter in the constructor is used to specify the
   * color of the node in a Red-Black Tree. It has a default value of 'BLACK' if not provided
   * explicitly.
   */
  constructor(key: K, value?: V, color: RBTNColor = 'BLACK') {
    super(key, value);
    this._color = color;
  }

  override _left?: RedBlackTreeNode<K, V> | null | undefined = undefined;

  override get left(): RedBlackTreeNode<K, V> | null | undefined {
    return this._left;
  }

  override set left(v: RedBlackTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: RedBlackTreeNode<K, V> | null | undefined = undefined;

  override get right(): RedBlackTreeNode<K, V> | null | undefined {
    return this._right;
  }

  override set right(v: RedBlackTreeNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 * 1. Efficient self-balancing, but not completely balanced. Compared with AVLTree, the addition and deletion efficiency is high but the query efficiency is slightly lower.
 * 2. It is BST itself. Compared with Heap which is not completely ordered, RedBlackTree is completely ordered.
 * @example
 * // using Red-Black Tree as a price-based index for stock data
 *     // Define the structure of individual stock records
 *     interface StockRecord {
 *       price: number; // Stock price (key for indexing)
 *       symbol: string; // Stock ticker symbol
 *       volume: number; // Trade volume
 *     }
 *
 *     // Simulate stock market data as it might come from an external feed
 *     const marketStockData: StockRecord[] = [
 *       { price: 142.5, symbol: 'AAPL', volume: 1000000 },
 *       { price: 335.2, symbol: 'MSFT', volume: 800000 },
 *       { price: 3285.04, symbol: 'AMZN', volume: 500000 },
 *       { price: 267.98, symbol: 'META', volume: 750000 },
 *       { price: 234.57, symbol: 'GOOGL', volume: 900000 }
 *     ];
 *
 *     // Extend the stock record type to include metadata for database usage
 *     type StockTableRecord = StockRecord & { lastUpdated: Date };
 *
 *     // Create a Red-Black Tree to index stock records by price
 *     // Simulates a database index with stock price as the key for quick lookups
 *     const priceIndex = new RedBlackTree<number, StockTableRecord, StockRecord>(marketStockData, {
 *       toEntryFn: stockRecord => [
 *         stockRecord.price, // Use stock price as the key
 *         {
 *           ...stockRecord,
 *           lastUpdated: new Date() // Add a timestamp for when the record was indexed
 *         }
 *       ]
 *     });
 *
 *     // Query the stock with the highest price
 *     const highestPricedStock = priceIndex.getRightMost();
 *     console.log(priceIndex.get(highestPricedStock)?.symbol); // 'AMZN' // Amazon has the highest price
 *
 *     // Query stocks within a specific price range (200 to 400)
 *     const stocksInRange = priceIndex.rangeSearch(
 *       [200, 400], // Price range
 *       node => priceIndex.get(node)?.symbol // Extract stock symbols for the result
 *     );
 *     console.log(stocksInRange); // ['GOOGL', 'META', 'MSFT']
 */
export class RedBlackTree<K = any, V = any, R = object, MK = any, MV = any, MR = object>
  extends BST<K, V, R, MK, MV, MR>
  implements IBinaryTree<K, V, R, MK, MV, MR>
{
  /**
   * This TypeScript constructor initializes a Red-Black Tree with optional keys, nodes, entries, or
   * raw data.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter in the constructor is an
   * iterable that can contain either `K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined` objects or `R` objects. It
   * is used to initialize the Red-Black Tree with keys, nodes, entries, or
   * @param [options] - The `options` parameter in the constructor is of type `RedBlackTreeOptions<K,
   * V, R>`. It is an optional parameter that allows you to specify additional options for the
   * RedBlackTree class. These options could include configuration settings, behavior customization, or
   * any other parameters that are specific to
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    > = [],
    options?: RedBlackTreeOptions<K, V, R>
  ) {
    super([], options);

    this._root = this.NIL;

    if (keysNodesEntriesOrRaws) {
      this.addMany(keysNodesEntriesOrRaws);
    }
  }

  protected override _root: RedBlackTreeNode<K, V> | undefined;

  override get root(): RedBlackTreeNode<K, V> | undefined {
    return this._root;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function creates a new Red-Black Tree node with the specified key, value, and color.
   * @param {K} key - The key parameter represents the key value of the node being created. It is of
   * type K, which is a generic type that can be replaced with any specific type when using the
   * function.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the node. It is not required and can be omitted if you only need to
   * create a node with a key.
   * @param {RBTNColor} [color=BLACK] - The "color" parameter is used to specify the color of the node
   * in a Red-Black Tree. It can have two possible values: "RED" or "BLACK". By default, the color is
   * set to "BLACK" if not specified.
   * @returns A new instance of a RedBlackTreeNode with the specified key, value, and color is being
   * returned.
   */
  override createNode(key: K, value?: V, color: RBTNColor = 'BLACK'): RedBlackTreeNode<K, V> {
    return new RedBlackTreeNode<K, V>(key, this._isMapMode ? undefined : value, color);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function creates a new Red-Black Tree with the specified options.
   * @param [options] - The `options` parameter is an optional object that contains additional
   * configuration options for creating the Red-Black Tree. It has the following properties:
   * @returns a new instance of a RedBlackTree object.
   */
  override createTree(options?: RedBlackTreeOptions<K, V, R>) {
    return new RedBlackTree<K, V, R, MK, MV, MR>([], {
      iterationType: this.iterationType,
      isMapMode: this._isMapMode,
      specifyComparable: this._specifyComparable,
      toEntryFn: this._toEntryFn,
      ...options
    });
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if the input is an instance of the RedBlackTreeNode class.
   * @param {K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined} keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can be of type `R` or `K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined`.
   * @returns a boolean value indicating whether the input parameter `keyNodeOrEntry` is
   * an instance of the `RedBlackTreeNode` class.
   */
  override isNode(
    keyNodeOrEntry: K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): keyNodeOrEntry is RedBlackTreeNode<K, V> {
    return keyNodeOrEntry instanceof RedBlackTreeNode;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The "clear" function sets the root node of a data structure to a sentinel value and resets the
   * size counter to zero.
   */
  override clear() {
    super.clear();
    this._root = this.NIL;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function adds a new node to a binary search tree and returns true if the node was successfully
   * added.
   * @param {K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined} keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can accept a value of type `R` or `K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined`.
   * @param {V} [value] - The `value` parameter is an optional value that you want to associate with
   * the key in the data structure. It represents the value that you want to add or update in the data
   * structure.
   * @returns The method is returning a boolean value. If a new node is successfully added to the tree,
   * the method returns true. If the node already exists and its value is updated, the method also
   * returns true. If the node cannot be added or updated, the method returns false.
   */
  override add(
    keyNodeOrEntry: K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    value?: V
  ): boolean {
    const [newNode, newValue] = this._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value);
    if (!this.isRealNode(newNode)) return false;

    const insertStatus = this._insert(newNode);

    if (insertStatus === 'CREATED') {
      // Ensure the root is black
      if (this.isRealNode(this._root)) {
        this._root.color = 'BLACK';
      } else {
        return false;
      }
      if (this._isMapMode) this._setValue(newNode.key, newValue);
      this._size++;
      return true;
    }
    if (insertStatus === 'UPDATED') {
      if (this._isMapMode) this._setValue(newNode.key, newValue);
      return true;
    }
    return false;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function overrides the delete method in a binary tree data structure to remove a node based on
   * a given predicate and maintain the binary search tree properties.
   * @param {K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined} keyNodeOrEntry - The `keyNodeOrEntry`
   * parameter in the `override delete` method is used to specify the condition or key based on which a
   * node should be deleted from the binary tree. It can be a key, a node, an entry, or a predicate
   * function that determines which node(s) should be deleted.
   * @returns The `override delete` method is returning an array of `BinaryTreeDeleteResult<RedBlackTreeNode<K, V>>`
   * objects. Each object in the array contains information about the deleted node and whether
   * balancing is needed.
   */
  override delete(
    keyNodeOrEntry: K | RedBlackTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): BinaryTreeDeleteResult<RedBlackTreeNode<K, V>>[] {
    if (keyNodeOrEntry === null) return [];

    const results: BinaryTreeDeleteResult<RedBlackTreeNode<K, V>>[] = [];
    let nodeToDelete: OptNode<RedBlackTreeNode<K, V>>;
    if (this._isPredicate(keyNodeOrEntry)) nodeToDelete = this.getNode(keyNodeOrEntry);
    else nodeToDelete = this.isRealNode(keyNodeOrEntry) ? keyNodeOrEntry : this.getNode(keyNodeOrEntry);

    if (!nodeToDelete) {
      return results;
    }

    let originalColor = nodeToDelete.color;
    let replacementNode: RedBlackTreeNode<K, V> | undefined;

    if (!this.isRealNode(nodeToDelete.left)) {
      if (nodeToDelete.right !== null) {
        replacementNode = nodeToDelete.right;
        this._transplant(nodeToDelete, nodeToDelete.right);
      }
    } else if (!this.isRealNode(nodeToDelete.right)) {
      replacementNode = nodeToDelete.left;
      this._transplant(nodeToDelete, nodeToDelete.left);
    } else {
      const successor = this.getLeftMost(node => node, nodeToDelete.right);
      if (successor) {
        originalColor = successor.color;
        if (successor.right !== null) replacementNode = successor.right;

        if (successor.parent === nodeToDelete) {
          if (this.isRealNode(replacementNode)) {
            replacementNode.parent = successor;
          }
        } else {
          if (successor.right !== null) {
            this._transplant(successor, successor.right);
            successor.right = nodeToDelete.right;
          }
          if (this.isRealNode(successor.right)) {
            successor.right.parent = successor;
          }
        }

        this._transplant(nodeToDelete, successor);
        successor.left = nodeToDelete.left;
        if (this.isRealNode(successor.left)) {
          successor.left.parent = successor;
        }
        successor.color = nodeToDelete.color;
      }
    }
    if (this._isMapMode) this._store.delete(nodeToDelete.key);
    this._size--;

    // If the original color was black, fix the tree
    if (originalColor === 'BLACK') {
      this._deleteFixup(replacementNode);
    }

    results.push({ deleted: nodeToDelete, needBalanced: undefined });

    return results;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function in TypeScript overrides the default behavior to create a new Red-Black Tree by
   * applying a callback to each entry in the original tree.
   * @param callback - A function that will be called for each entry in the tree, with parameters
   * representing the key, value, index, and the tree itself. It should return an entry for the new
   * tree.
   * @param [options] - The `options` parameter in the `map` method is of type `RedBlackTreeOptions<MK, MV,
   * MR>`. This parameter allows you to specify additional options or configurations for the Red-Black
   * Tree that will be created during the mapping process. These options could include things like
   * custom comparators
   * @param {any} [thisArg] - The `thisArg` parameter in the `override map` function is used to specify
   * the value of `this` when executing the `callback` function. It allows you to set the context
   * (value of `this`) for the callback function. This can be useful when you want to access properties
   * or
   * @returns A new Red-Black Tree is being returned, where each entry has been transformed using the
   * provided callback function.
   */
  override map(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: RedBlackTreeOptions<MK, MV, MR>,
    thisArg?: any
  ): RedBlackTree<MK, MV, MR> {
    const newTree = new RedBlackTree<MK, MV, MR>([], options);
    let index = 0;
    for (const [key, value] of this) {
      newTree.add(callback.call(thisArg, key, value, index++, this));
    }
    return newTree;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
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
   * The function sets the root of a tree-like structure and updates the parent property of the new
   * root.
   * @param {RedBlackTreeNode<K, V> | undefined} v - v is a parameter of type RedBlackTreeNode<K, V> or undefined.
   */
  protected override _setRoot(v: RedBlackTreeNode<K, V> | undefined) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function replaces an old node with a new node while preserving the color of the old node.
   * @param {RedBlackTreeNode<K, V>} oldNode - The `oldNode` parameter represents the node that needs to be replaced in
   * the data structure.
   * @param {RedBlackTreeNode<K, V>} newNode - The `newNode` parameter is of type `RedBlackTreeNode<K, V>`, which represents a node in a
   * data structure.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, with the `oldNode` and `newNode` parameters.
   */
  protected override _replaceNode(
    oldNode: RedBlackTreeNode<K, V>,
    newNode: RedBlackTreeNode<K, V>
  ): RedBlackTreeNode<K, V> {
    newNode.color = oldNode.color;

    return super._replaceNode(oldNode, newNode);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The `_insert` function inserts a node into a binary search tree and performs necessary fix-ups to
   * maintain the red-black tree properties.
   * @param {RedBlackTreeNode<K, V>} node - The `node` parameter represents the node that needs to be inserted into the
   * binary search tree.
   * @returns a string value indicating the result of the insertion operation. It can return either
   * 'UPDATED' if the node with the same key already exists and was updated, or 'CREATED' if a new node
   * was created and inserted into the tree.
   */
  protected _insert(node: RedBlackTreeNode<K, V>): CRUD {
    let current = this.root;
    let parent: RedBlackTreeNode<K, V> | undefined = undefined;

    while (this.isRealNode(current)) {
      parent = current;
      const compared = this._compare(node.key, current.key);
      if (compared < 0) {
        current = current.left ?? this.NIL;
      } else if (compared > 0) {
        current = current.right ?? this.NIL;
      } else {
        this._replaceNode(current, node);
        return 'UPDATED';
      }
    }

    node.parent = parent;

    if (!parent) {
      this._setRoot(node);
    } else if (this._compare(node.key, parent.key) < 0) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    node.left = this.NIL;
    node.right = this.NIL;
    node.color = 'RED';

    this._insertFixup(node);
    return 'CREATED';
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_transplant` is used to replace a node `u` with another node `v` in a binary tree.
   * @param {RedBlackTreeNode<K, V>} u - The parameter "u" represents a node in a binary tree.
   * @param {RedBlackTreeNode<K, V> | undefined} v - The parameter `v` is of type `RedBlackTreeNode<K, V> | undefined`, which means it can
   * either be a `RedBlackTreeNode<K, V>` object or `undefined`.
   */
  protected _transplant(u: RedBlackTreeNode<K, V>, v: RedBlackTreeNode<K, V> | undefined): void {
    if (!u.parent) {
      this._setRoot(v);
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }

    if (v) {
      v.parent = u.parent;
    }
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_insertFixup` function is used to fix the Red-Black Tree after inserting a new node.
   * @param {RedBlackTreeNode<K, V> | undefined} z - The parameter `z` represents a node in the Red-Black Tree data
   * structure. It can either be a valid node or `undefined`.
   */
  protected _insertFixup(z: RedBlackTreeNode<K, V> | undefined): void {
    // Continue fixing the tree as long as the parent of z is red
    while (z?.parent?.color === 'RED') {
      // Check if the parent of z is the left child of its parent
      if (z.parent === z.parent.parent?.left) {
        // Case 1: The uncle (y) of z is red
        const y = z.parent.parent.right;
        if (y?.color === 'RED') {
          // Set colors to restore properties of Red-Black Tree
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          z.parent.parent.color = 'RED';
          // Move up the tree to continue fixing
          z = z.parent.parent;
        } else {
          // Case 2: The uncle (y) of z is black, and z is a right child
          if (z === z.parent.right) {
            // Perform a left rotation to transform the case into Case 3
            z = z.parent;
            this._leftRotate(z);
          }

          // Case 3: The uncle (y) of z is black, and z is a left child
          // Adjust colors and perform a right rotation
          if (z && this.isRealNode(z.parent) && this.isRealNode(z.parent.parent)) {
            z.parent.color = 'BLACK';
            z.parent.parent.color = 'RED';
            this._rightRotate(z.parent.parent);
          }
        }
      } else {
        // Symmetric case for the right child (left and right exchanged)
        // Follow the same logic as above with left and right exchanged
        const y: RedBlackTreeNode<K, V> | undefined = z?.parent?.parent?.left ?? undefined;
        if (y?.color === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          z.parent.parent!.color = 'RED';
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this._rightRotate(z);
          }

          if (z && this.isRealNode(z.parent) && this.isRealNode(z.parent.parent)) {
            z.parent.color = 'BLACK';
            z.parent.parent.color = 'RED';
            this._leftRotate(z.parent.parent);
          }
        }
      }
    }

    // Ensure that the root is black after fixing
    if (this.isRealNode(this._root)) this._root.color = 'BLACK';
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_deleteFixup` function is used to fix the red-black tree after a node deletion by adjusting
   * the colors and performing rotations.
   * @param {RedBlackTreeNode<K, V> | undefined} node - The `node` parameter represents a node in a binary tree. It can
   * be either a valid node object or `undefined`.
   * @returns The function does not return any value. It has a return type of `void`, which means it
   * does not return anything.
   */
  protected _deleteFixup(node: RedBlackTreeNode<K, V> | undefined): void {
    // Early exit condition
    if (!node || node === this.root || node.color === 'BLACK') {
      if (node) {
        node.color = 'BLACK'; // Ensure the final node is black
      }
      return;
    }

    while (node && node !== this.root && node.color === 'BLACK') {
      const parent: RedBlackTreeNode<K, V> | undefined = node.parent;

      if (!parent) {
        break; // Ensure the loop terminates if there's an issue with the tree structure
      }

      if (node === parent.left) {
        let sibling = parent.right;

        // Cases 1 and 2: Sibling is red or both children of sibling are black
        if (sibling?.color === 'RED') {
          sibling.color = 'BLACK';
          parent.color = 'RED';
          this._leftRotate(parent);
          sibling = parent.right;
        }

        // Case 3: Sibling's left child is black
        if ((sibling?.left?.color ?? 'BLACK') === 'BLACK') {
          if (sibling) sibling.color = 'RED';
          node = parent;
        } else {
          // Case 4: Adjust colors and perform a right rotation
          if (sibling?.left) sibling.left.color = 'BLACK';
          if (sibling) sibling.color = parent.color;
          parent.color = 'BLACK';
          this._rightRotate(parent);
          node = this.root;
        }
      } else {
        // Symmetric case for the right child (left and right exchanged)
        let sibling = parent.left;

        // Cases 1 and 2: Sibling is red or both children of sibling are black
        if (sibling?.color === 'RED') {
          sibling.color = 'BLACK';
          if (parent) parent.color = 'RED';
          this._rightRotate(parent);
          if (parent) sibling = parent.left;
        }

        // Case 3: Sibling's left child is black
        if ((sibling?.right?.color ?? 'BLACK') === 'BLACK') {
          if (sibling) sibling.color = 'RED';
          node = parent;
        } else {
          // Case 4: Adjust colors and perform a left rotation
          if (sibling?.right) sibling.right.color = 'BLACK';
          if (sibling) sibling.color = parent.color;
          if (parent) parent.color = 'BLACK';
          this._leftRotate(parent);
          node = this.root;
        }
      }
    }

    // Ensure that the final node (possibly the root) is black
    if (node) {
      node.color = 'BLACK';
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_leftRotate` function performs a left rotation on a given node in a binary tree.
   * @param {RedBlackTreeNode<K, V> | undefined} x - The parameter `x` is of type `RedBlackTreeNode<K, V> | undefined`. It represents a
   * node in a binary tree or `undefined` if there is no node.
   * @returns void, which means it does not return any value.
   */
  protected _leftRotate(x: RedBlackTreeNode<K, V> | undefined): void {
    if (!x || !x.right) {
      return;
    }

    const y = x.right;
    x.right = y.left;

    if (this.isRealNode(y.left)) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (!x.parent) {
      this._setRoot(y);
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_rightRotate` function performs a right rotation on a given node in a binary tree.
   * @param {RedBlackTreeNode<K, V> | undefined} y - The parameter `y` is of type `RedBlackTreeNode<K, V> | undefined`. It represents a
   * node in a binary tree or `undefined` if there is no node.
   * @returns void, which means it does not return any value.
   */
  protected _rightRotate(y: RedBlackTreeNode<K, V> | undefined): void {
    if (!y || !y.left) {
      return;
    }

    const x = y.left;
    y.left = x.right;

    if (this.isRealNode(x.right)) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (!y.parent) {
      this._setRoot(x);
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    x.right = y;
    y.parent = x;
  }
}
