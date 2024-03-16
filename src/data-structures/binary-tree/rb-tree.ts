import type {
  BinaryTreeDeleteResult,
  BTNCallback,
  BTNKeyOrNodeOrEntry,
  CRUD,
  RBTNColor,
  RBTreeOptions,
  RedBlackTreeNested,
  RedBlackTreeNodeNested
} from '../../types';
import { BTNEntry } from '../../types';
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
   * Tree Node. It is an optional parameter with a default value of `'BLACK'`.
   */
  constructor(key: K, value?: V, color: RBTNColor = 'BLACK') {
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
  R = BTNEntry<K, V>,
  NODE extends RedBlackTreeNode<K, V, NODE> = RedBlackTreeNode<K, V, RedBlackTreeNodeNested<K, V>>,
  TREE extends RedBlackTree<K, V, R, NODE, TREE> = RedBlackTree<K, V, R, NODE, RedBlackTreeNested<K, V, R, NODE>>
>
  extends BST<K, V, R, NODE, TREE>
  implements IBinaryTree<K, V, R, NODE, TREE> {
  /**
   * This is the constructor function for a Red-Black Tree data structure in TypeScript.
   * @param keysOrNodesOrEntriesOrRawElements - The `keysOrNodesOrEntriesOrRawElements` parameter is an
   * iterable object that can contain either keys, nodes, entries, or raw elements. It is used to
   * initialize the RBTree with the provided elements.
   * @param [options] - The `options` parameter is an optional object that can be passed to the
   * constructor. It is of type `RBTreeOptions<K, V, R>`. This object can contain various options for
   * configuring the behavior of the Red-Black Tree. The specific properties and their meanings would
   * depend on the implementation
   */
  constructor(
    keysOrNodesOrEntriesOrRawElements: Iterable<R | BTNKeyOrNodeOrEntry<K, V, NODE>> = [],
    options?: RBTreeOptions<K, V, R>
  ) {
    super([], options);

    this._root = this.NIL;

    if (keysOrNodesOrEntriesOrRawElements) {
      this.addMany(keysOrNodesOrEntriesOrRawElements);
    }
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
  override createNode(key: K, value?: V, color: RBTNColor = 'BLACK'): NODE {
    return new RedBlackTreeNode<K, V, NODE>(key, value, color) as NODE;
  }

  /**
   * The function creates a new Red-Black Tree with the specified options.
   * @param [options] - The `options` parameter is an optional object that contains additional
   * configuration options for creating the Red-Black Tree. It has the following properties:
   * @returns a new instance of a RedBlackTree object.
   */
  override createTree(options?: RBTreeOptions<K, V, R>): TREE {
    return new RedBlackTree<K, V, R, NODE, TREE>([], {
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
   * The function checks if the input is an instance of the RedBlackTreeNode class.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyOrNodeOrEntryOrRawElement` is
   * an instance of the `RedBlackTreeNode` class.
   */
  override isNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>
  ): keyOrNodeOrEntryOrRawElement is NODE {
    return keyOrNodeOrEntryOrRawElement instanceof RedBlackTreeNode;
  }

  // /**
  //  * Time Complexity: O(1)
  //  * Space Complexity: O(1)
  //  */
  //
  // /**
  //  * Time Complexity: O(1)
  //  * Space Complexity: O(1)
  //  *
  //  * The function `keyValueOrEntryOrRawElementToNode` takes a key, value, or entry and returns a node if it is
  //  * valid, otherwise it returns undefined.
  //  * @param {BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The key, value, or entry to convert.
  //  * @param {V} [value] - The value associated with the key (if `keyOrNodeOrEntryOrRawElement` is a key).
  //  * @returns {NODE | undefined} - The corresponding Red-Black Tree node, or `undefined` if conversion fails.
  //  */
  // override keyValueOrEntryOrRawElementToNode(keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>, value?: V): NODE | undefined {
  //
  //   if (keyOrNodeOrEntryOrRawElement === null || keyOrNodeOrEntryOrRawElement === undefined) return;
  //   if (this.isNode(keyOrNodeOrEntryOrRawElement)) return keyOrNodeOrEntryOrRawElement;
  //
  //   if (this.toEntryFn) {
  //     const [key, entryValue] = this.toEntryFn(keyOrNodeOrEntryOrRawElement as R);
  //     if (key) return this.createNode(key, entryValue ?? value, 'RED');
  //   }
  //
  //   if (this.isEntry(keyOrNodeOrEntryOrRawElement)) {
  //     const [key, value] = keyOrNodeOrEntryOrRawElement;
  //     if (key === undefined || key === null) return;
  //     else return  this.createNode(key, value, 'RED');
  //   }
  //
  //   if (this.isKey(keyOrNodeOrEntryOrRawElement)) return this.createNode(keyOrNodeOrEntryOrRawElement, value, 'RED');
  //
  //   return ;
  // }

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
    this._root = this.NIL;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function adds a new node to a binary search tree and returns true if the node was successfully
   * added.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can accept a value of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @param {V} [value] - The `value` parameter is an optional value that you want to associate with
   * the key in the data structure. It represents the value that you want to add or update in the data
   * structure.
   * @returns The method is returning a boolean value. If a new node is successfully added to the tree,
   * the method returns true. If the node already exists and its value is updated, the method also
   * returns true. If the node cannot be added or updated, the method returns false.
   */
  override add(keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>, value?: V): boolean {
    const newNode = this.keyValueOrEntryOrRawElementToNode(keyOrNodeOrEntryOrRawElement, value);
    if (!this.isRealNode(newNode)) return false;

    const insertStatus = this._insert(newNode);

    if (insertStatus === 'CREATED') {
      // Ensure the root is black
      if (this.isRealNode(this._root)) {
        this._root.color = 'BLACK';
      } else {
        return false;
      }
      this._size++;
      return true;
    } else return insertStatus === 'UPDATED';
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the delete method of a binary tree data structure, allowing for the
   * deletion of a node and maintaining the balance of the tree.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value
   * that identifies the node to be deleted from the binary tree. It can be of any type that is
   * returned by the callback function `C`. It can also be `null` or `undefined` if there is no node to
   * delete.
   * @param {C} callback - The `callback` parameter is a function that is used to determine the
   * equality of nodes in the binary tree. It is optional and has a default value of
   * `this._DEFAULT_CALLBACK`. The type of the `callback` parameter is `C`, which is a generic type
   * that extends the `BTNCallback
   * @returns an array of BinaryTreeDeleteResult<NODE> objects.
   */
  override delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._DEFAULT_CALLBACK as C
  ): BinaryTreeDeleteResult<NODE>[] {
    if (identifier === null) return [];
    const results: BinaryTreeDeleteResult<NODE>[] = [];
    callback = this._ensureCallback(identifier, callback);
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
    if (originalColor === 'BLACK') {
      this._deleteFixup(replacementNode);
    }

    results.push({ deleted: nodeToDelete, needBalanced: undefined });

    return results;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
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
   * @param {NODE} newNode - The `newNode` parameter is of type `NODE`, which represents a node in a
   * data structure.
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
   * The `_insert` function inserts a node into a binary search tree and performs necessary fix-ups to
   * maintain the red-black tree properties.
   * @param {NODE} node - The `node` parameter represents the node that needs to be inserted into the
   * binary search tree.
   * @returns a string value indicating the result of the insertion operation. It can return either
   * 'UPDATED' if the node with the same key already exists and was updated, or 'CREATED' if a new node
   * was created and inserted into the tree.
   */
  protected _insert(node: NODE): CRUD {
    let current = this.root;
    let parent: NODE | undefined = undefined;

    while (this.isRealNode(current)) {
      parent = current;
      const compared = this.comparator(node.key, current.key);
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
    } else if (node.key < parent.key) {
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
   * @param {NODE | undefined} z - The parameter `z` represents a node in the Red-Black Tree data
   * structure. It can either be a valid node or `undefined`.
   */
  protected _insertFixup(z: NODE | undefined): void {
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
        const y: NODE | undefined = z?.parent?.parent?.left;
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
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `_deleteFixup` function is used to fix the red-black tree after a node deletion by adjusting
   * the colors and performing rotations.
   * @param {NODE | undefined} node - The `node` parameter represents a node in a binary tree. It can
   * be either a valid node object or `undefined`.
   * @returns The function does not return any value. It has a return type of `void`, which means it
   * does not return anything.
   */
  protected _deleteFixup(node: NODE | undefined): void {
    // Early exit condition
    if (!node || node === this.root || node.color === 'BLACK') {
      if (node) {
        node.color = 'BLACK'; // Ensure the final node is black
      }
      return;
    }

    while (node && node !== this.root && node.color === 'BLACK') {
      const parent: NODE | undefined = node.parent;

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
