import type {
  BinaryTreeDeleteResult,
  BSTNKeyOrNode,
  BTNCallback,
  KeyOrNodeOrEntry,
  RBTreeOptions,
  RedBlackTreeNested,
  RedBlackTreeNodeNested
} from '../../types';
import { CRUD, RBTNColor } from '../../types';
import { BST, BSTNode } from './bst';
import { IBinaryTree } from '../../interfaces';

export class RedBlackTreeNode<
  K = any,
  V = any,
  NODE extends RedBlackTreeNode<K, V, NODE> = RedBlackTreeNodeNested<K, V>
> extends BSTNode<K, V, NODE> {
  /**
   * The constructor function initializes a Red-Black Tree Node with a key, an optional value, and a
   * color.
   * @param {K} key - The key parameter is of type K and represents the key of the node in the
   * Red-Black Tree.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the Red-Black Tree Node. It is not required and can be omitted when
   * creating a new instance of the Red-Black Tree Node.
   * @param {RBTNColor} color - The `color` parameter is used to specify the color of the Red-Black
   * Tree Node. It is an optional parameter with a default value of `RBTNColor.BLACK`.
   */
  constructor(key: K, value?: V, color: RBTNColor = RBTNColor.BLACK) {
    super(key, value);
    this._color = color;
  }

  protected _color: RBTNColor;

  /**
   * The function returns the color value of a variable.
   * @returns The color value stored in the private variable `_color`.
   */
  get color(): RBTNColor {
    return this._color;
  }

  /**
   * The function sets the color property to the specified value.
   * @param {RBTNColor} value - The value parameter is of type RBTNColor.
   */
  set color(value: RBTNColor) {
    this._color = value;
  }
}

export class RedBlackTree<
  K = any,
  V = any,
  NODE extends RedBlackTreeNode<K, V, NODE> = RedBlackTreeNode<K, V, RedBlackTreeNodeNested<K, V>>,
  TREE extends RedBlackTree<K, V, NODE, TREE> = RedBlackTree<K, V, NODE, RedBlackTreeNested<K, V, NODE>>
>
  extends BST<K, V, NODE, TREE>
  implements IBinaryTree<K, V, NODE, TREE> {
  /**
   * This is the constructor function for a Red-Black Tree data structure in TypeScript.
   * @param keysOrNodesOrEntries - The `keysOrNodesOrEntries` parameter is an iterable object that can
   * contain keys, nodes, or entries. It is used to initialize the RBTree with the provided keys,
   * nodes, or entries.
   * @param [options] - The `options` parameter is an optional object that can be passed to the
   * constructor. It allows you to customize the behavior of the RBTree. It can include properties such
   * as `compareKeys`, `compareValues`, `allowDuplicates`, etc. These properties define how the RBTree
   * should compare keys and
   */
  constructor(keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, NODE>> = [], options?: RBTreeOptions<K>) {
    super([], options);

    this._root = this.SENTINEL;

    if (keysOrNodesOrEntries) {
      this.addMany(keysOrNodesOrEntries);
    }
  }

  protected _SENTINEL: NODE = new RedBlackTreeNode<K, V>(NaN as K) as unknown as NODE;

  /**
   * The function returns the value of the _SENTINEL property.
   * @returns The method is returning the value of the `_SENTINEL` property.
   */
  get SENTINEL(): NODE {
    return this._SENTINEL;
  }

  protected override _root: NODE | undefined;

  /**
   * The function returns the root node of a tree or undefined if there is no root.
   * @returns The root node of the tree structure, or undefined if there is no root node.
   */
  override get root(): NODE | undefined {
    return this._root;
  }

  /**
   * The function creates a new Red-Black Tree node with the specified key, value, and color.
   * @param {K} key - The key parameter represents the key of the node being created. It is of type K,
   * which is a generic type representing the key's data type.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the node. It is not required and can be omitted if not needed.
   * @param {RBTNColor} color - The "color" parameter is used to specify the color of the node in a
   * Red-Black Tree. It is an optional parameter with a default value of "RBTNColor.BLACK". The color
   * can be either "RBTNColor.RED" or "RBTNColor.BLACK".
   * @returns The method is returning a new instance of a RedBlackTreeNode with the specified key,
   * value, and color.
   */
  override createNode(key: K, value?: V, color: RBTNColor = RBTNColor.BLACK): NODE {
    return new RedBlackTreeNode<K, V, NODE>(key, value, color) as NODE;
  }

  /**
   * The function creates a Red-Black Tree with the given options and returns it.
   * @param [options] - The `options` parameter is an optional object that contains configuration
   * options for creating the Red-Black Tree. It is of type `RBTreeOptions<K>`, where `K` represents
   * the type of keys in the tree.
   * @returns a new instance of a RedBlackTree object.
   */
  override createTree(options?: RBTreeOptions<K>): TREE {
    return new RedBlackTree<K, V, NODE, TREE>([], {
      iterationType: this.iterationType,
      ...options
    }) as TREE;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `keyValueOrEntryToNode` takes a key, value, or entry and returns a node if it is
   * valid, otherwise it returns undefined.
   * @param {KeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntry - The key, value, or entry to convert.
   * @param {V} [value] - The value associated with the key (if `keyOrNodeOrEntry` is a key).
   * @returns {NODE | undefined} - The corresponding Red-Black Tree node, or `undefined` if conversion fails.
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
        node = this.createNode(key, value, RBTNColor.RED);
      }
    } else if (!this.isNode(keyOrNodeOrEntry)) {
      node = this.createNode(keyOrNodeOrEntry, value, RBTNColor.RED);
    } else {
      return;
    }
    return node;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   * /

   /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if the input is an instance of the RedBlackTreeNode class.
   * @param {KeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntry - The object to check.
   * @returns {boolean} - `true` if the object is a Red-Black Tree node, `false` otherwise.
   */
  override isNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>): keyOrNodeOrEntry is NODE {
    return keyOrNodeOrEntry instanceof RedBlackTreeNode;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if a given node is a real node in a Red-Black Tree.
   * @param {NODE | undefined} node - The `node` parameter is of type `NODE | undefined`, which means
   * it can either be of type `NODE` or `undefined`.
   * @returns a boolean value.
   */
  override isRealNode(node: NODE | undefined): node is NODE {
    if (node === this.SENTINEL || node === undefined) return false;
    return node instanceof RedBlackTreeNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `getNode` function retrieves a node from a Red-Black Tree based on the provided identifier and
   * callback function.
   * @param {ReturnType<C> | undefined} identifier - The `identifier` parameter is the value or key
   * that you want to search for in the binary search tree. It can be of any type that is compatible
   * with the type of nodes in the tree.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node in
   * the tree. It is used to determine whether a node matches the given identifier. The `callback`
   * function should take a node as its parameter and return a value that can be compared to the
   * `identifier` parameter.
   * @param beginRoot - The `beginRoot` parameter is the starting point for the search in the binary
   * search tree. It can be either a key or a node. If it is a key, it will be converted to a node
   * using the `ensureNode` method. If it is not provided, the `root`
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed when searching for nodes in the binary search tree. It is an optional parameter and
   * its default value is taken from the `iterationType` property of the class.
   * @returns The method is returning a value of type `NODE | null | undefined`.
   */
  override getNode<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this._defaultOneParamCallback as C,
    beginRoot: BSTNKeyOrNode<K, NODE> = this.root,
    iterationType = this.iterationType
  ): NODE | null | undefined {
    if ((identifier as any) instanceof RedBlackTreeNode) callback = (node => node) as C;
    beginRoot = this.ensureNode(beginRoot);
    return this.getNodes(identifier, callback, true, beginRoot, iterationType)[0] ?? undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The "clear" function sets the root node of a data structure to a sentinel value and resets the
   * size counter to zero.
   */
  override clear() {
    super.clear();
    this._root = this.SENTINEL;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function adds a new node to a Red-Black Tree data structure and returns a boolean indicating
   * whether the operation was successful.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can be either a key, a node, or an
   * entry.
   * @param {V} [value] - The `value` parameter is the value associated with the key that is being
   * added to the tree.
   * @returns The method is returning a boolean value. It returns true if the node was successfully
   * added or updated, and false otherwise.
   */
  override add(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>, value?: V): boolean {
    const newNode = this.keyValueOrEntryToNode(keyOrNodeOrEntry, value);
    if (!this.isRealNode(newNode)) return false;

    const insertStatus = this._insert(newNode);

    if (insertStatus === CRUD.CREATED) {
      // Ensure the root is black
      if (this.isRealNode(this._root)) {
        this._root.color = RBTNColor.BLACK;
      } else {
        return false;
      }
      this._size++;
      return true;
    } else return insertStatus === CRUD.UPDATED;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `delete` in a binary tree class deletes a node from the tree and fixes the tree if
   * necessary.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the
   * identifier of the node that needs to be deleted from the binary tree. It can be of any type that
   * is returned by the callback function `C`. It can also be `null` or `undefined` if the node to be
   * deleted is not found.
   * @param {C} callback - The `callback` parameter is a function that is used to retrieve a node from
   * the binary tree based on its identifier. It is an optional parameter and if not provided, the
   * `_defaultOneParamCallback` function is used as the default callback. The callback function should
   * return the identifier of the node to
   * @returns an array of BinaryTreeDeleteResult<NODE> objects.
   */
  override delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C
  ): BinaryTreeDeleteResult<NODE>[] {
    if (identifier === null) return [];
    const results: BinaryTreeDeleteResult<NODE>[] = [];

    const nodeToDelete = this.isRealNode(identifier) ? identifier : this.getNode(identifier, callback);

    if (!nodeToDelete) {
      return results;
    }

    let originalColor = nodeToDelete.color;
    let replacementNode: NODE | undefined;

    if (!this.isRealNode(nodeToDelete.left)) {
      replacementNode = nodeToDelete.right;
      this._transplant(nodeToDelete, nodeToDelete.right);
    } else if (!this.isRealNode(nodeToDelete.right)) {
      replacementNode = nodeToDelete.left;
      this._transplant(nodeToDelete, nodeToDelete.left);
    } else {
      const successor = this.getLeftMost(nodeToDelete.right);
      if (successor) {
        originalColor = successor.color;
        replacementNode = successor.right;

        if (successor.parent === nodeToDelete) {
          if (this.isRealNode(replacementNode)) {
            replacementNode.parent = successor;
          }
        } else {
          this._transplant(successor, successor.right);
          successor.right = nodeToDelete.right;
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
    this._size--;

    // If the original color was black, fix the tree
    if (originalColor === RBTNColor.BLACK) {
      this._deleteFixup(replacementNode);
    }

    results.push({ deleted: nodeToDelete, needBalanced: undefined });

    return results;
  }

  /**
   * The function sets the root of a tree-like structure and updates the parent property of the new
   * root.
   * @param {NODE | undefined} v - v is a parameter of type NODE or undefined.
   */
  protected override _setRoot(v: NODE | undefined) {
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
   * The function replaces an old node with a new node while preserving the color of the old node.
   * @param {NODE} oldNode - The `oldNode` parameter represents the node that needs to be replaced in
   * the data structure.
   * @param {NODE} newNode - The `newNode` parameter is the new node that will replace the old node in
   * the data structure.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, with the `oldNode` and `newNode` parameters.
   */
  protected override _replaceNode(oldNode: NODE, newNode: NODE): NODE {
    newNode.color = oldNode.color;

    return super._replaceNode(oldNode, newNode);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_insert` function inserts or updates a node in a binary search tree and performs necessary
   * fix-ups to maintain the red-black tree properties.
   * @param {NODE} node - The `node` parameter represents the node that needs to be inserted into a
   * binary search tree. It contains a `key` property that is used to determine the position of the
   * node in the tree.
   * @returns {'inserted' | 'updated'} - The result of the insertion.
   */
  protected _insert(node: NODE): CRUD {
    let current = this.root;
    let parent: NODE | undefined = undefined;

    while (this.isRealNode(current)) {
      parent = current;
      if (node.key < current.key) {
        current = current.left ?? this.SENTINEL;
      } else if (node.key > current.key) {
        current = current.right ?? this.SENTINEL;
      } else {
        this._replaceNode(current, node);
        return CRUD.UPDATED;
      }
    }

    node.parent = parent;

    if (!parent) {
      this._setRoot(node);
    } else if (node.key < parent.key) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    node.left = this.SENTINEL;
    node.right = this.SENTINEL;
    node.color = RBTNColor.RED;

    this._insertFixup(node);
    return CRUD.CREATED;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_transplant` is used to replace a node `u` with another node `v` in a binary tree.
   * @param {NODE} u - The parameter "u" represents a node in a binary tree.
   * @param {NODE | undefined} v - The parameter `v` is of type `NODE | undefined`, which means it can
   * either be a `NODE` object or `undefined`.
   */
  protected _transplant(u: NODE, v: NODE | undefined): void {
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
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_insertFixup` function is used to fix the Red-Black Tree after inserting a new node.
   * @param {NODE | undefined} z - The parameter `z` represents a node in the Red-Black Tree. It can
   * either be a valid node object or `undefined`.
   */
  protected _insertFixup(z: NODE | undefined): void {
    // Continue fixing the tree as long as the parent of z is red
    while (z?.parent?.color === RBTNColor.RED) {
      // Check if the parent of z is the left child of its parent
      if (z.parent === z.parent.parent?.left) {
        // Case 1: The uncle (y) of z is red
        const y = z.parent.parent.right;
        if (y?.color === RBTNColor.RED) {
          // Set colors to restore properties of Red-Black Tree
          z.parent.color = RBTNColor.BLACK;
          y.color = RBTNColor.BLACK;
          z.parent.parent.color = RBTNColor.RED;
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
            z.parent.color = RBTNColor.BLACK;
            z.parent.parent.color = RBTNColor.RED;
            this._rightRotate(z.parent.parent);
          }
        }
      } else {
        // Symmetric case for the right child (left and right exchanged)
        // Follow the same logic as above with left and right exchanged
        const y: NODE | undefined = z?.parent?.parent?.left;
        if (y?.color === RBTNColor.RED) {
          z.parent.color = RBTNColor.BLACK;
          y.color = RBTNColor.BLACK;
          z.parent.parent!.color = RBTNColor.RED;
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this._rightRotate(z);
          }

          if (z && this.isRealNode(z.parent) && this.isRealNode(z.parent.parent)) {
            z.parent.color = RBTNColor.BLACK;
            z.parent.parent.color = RBTNColor.RED;
            this._leftRotate(z.parent.parent);
          }
        }
      }
    }

    // Ensure that the root is black after fixing
    if (this.isRealNode(this._root)) this._root.color = RBTNColor.BLACK;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_deleteFixup` function is used to fix the red-black tree after a node deletion by adjusting
   * the colors and performing rotations.
   * @param {NODE | undefined} node - The `node` parameter represents a node in a Red-Black Tree data
   * structure. It can be either a valid node object or `undefined`.
   * @returns The function does not return any value. It has a return type of `void`.
   */
  protected _deleteFixup(node: NODE | undefined): void {
    // Early exit condition
    if (!node || node === this.root || node.color === RBTNColor.BLACK) {
      if (node) {
        node.color = RBTNColor.BLACK; // Ensure the final node is black
      }
      return;
    }

    while (node && node !== this.root && node.color === RBTNColor.BLACK) {
      const parent: NODE | undefined = node.parent;

      if (!parent) {
        break; // Ensure the loop terminates if there's an issue with the tree structure
      }

      if (node === parent.left) {
        let sibling = parent.right;

        // Cases 1 and 2: Sibling is red or both children of sibling are black
        if (sibling?.color === RBTNColor.RED) {
          sibling.color = RBTNColor.BLACK;
          parent.color = RBTNColor.RED;
          this._leftRotate(parent);
          sibling = parent.right;
        }

        // Case 3: Sibling's left child is black
        if ((sibling?.left?.color ?? RBTNColor.BLACK) === RBTNColor.BLACK) {
          if (sibling) sibling.color = RBTNColor.RED;
          node = parent;
        } else {
          // Case 4: Adjust colors and perform a right rotation
          if (sibling?.left) sibling.left.color = RBTNColor.BLACK;
          if (sibling) sibling.color = parent.color;
          parent.color = RBTNColor.BLACK;
          this._rightRotate(parent);
          node = this.root;
        }
      } else {
        // Symmetric case for the right child (left and right exchanged)
        let sibling = parent.left;

        // Cases 1 and 2: Sibling is red or both children of sibling are black
        if (sibling?.color === RBTNColor.RED) {
          sibling.color = RBTNColor.BLACK;
          if (parent) parent.color = RBTNColor.RED;
          this._rightRotate(parent);
          if (parent) sibling = parent.left;
        }

        // Case 3: Sibling's left child is black
        if ((sibling?.right?.color ?? RBTNColor.BLACK) === RBTNColor.BLACK) {
          if (sibling) sibling.color = RBTNColor.RED;
          node = parent;
        } else {
          // Case 4: Adjust colors and perform a left rotation
          if (sibling?.right) sibling.right.color = RBTNColor.BLACK;
          if (sibling) sibling.color = parent.color;
          if (parent) parent.color = RBTNColor.BLACK;
          this._leftRotate(parent);
          node = this.root;
        }
      }
    }

    // Ensure that the final node (possibly the root) is black
    if (node) {
      node.color = RBTNColor.BLACK;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_leftRotate` function performs a left rotation on a given node in a binary tree.
   * @param {NODE | undefined} x - The parameter `x` is of type `NODE | undefined`. It represents a
   * node in a binary tree or `undefined` if there is no node.
   * @returns void, which means it does not return any value.
   */
  protected _leftRotate(x: NODE | undefined): void {
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
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_rightRotate` function performs a right rotation on a given node in a binary tree.
   * @param {NODE | undefined} y - The parameter `y` is of type `NODE | undefined`. It represents a
   * node in a binary tree or `undefined` if there is no node.
   * @returns void, which means it does not return any value.
   */
  protected _rightRotate(y: NODE | undefined): void {
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
