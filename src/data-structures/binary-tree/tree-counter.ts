/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  BinaryTreeDeleteResult,
  BSTNOptKeyOrNode,
  BTNRep,
  EntryCallback,
  IterationType,
  OptNode,
  OptNodeOrNull,
  RBTNColor,
  TreeCounterOptions
} from '../../types';
import { IBinaryTree } from '../../interfaces';
import { RedBlackTree, RedBlackTreeNode } from './red-black-tree';

export class TreeCounterNode<K = any, V = any> extends RedBlackTreeNode<K, V> {
  /**
   * The constructor function initializes a Red-Black Tree node with a key, value, count, and color.
   * @param {K} key - The key parameter represents the key of the node in the Red-Black Tree. It is
   * used to identify and locate the node within the tree.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the Red-Black Tree node. It is not required and can be omitted when
   * creating a new node.
   * @param [count=1] - The `count` parameter represents the number of occurrences of a particular key
   * in the Red-Black Tree. It is an optional parameter with a default value of 1.
   * @param {RBTNColor} [color=BLACK] - The `color` parameter is used to specify the color of the node
   * in a Red-Black Tree. It is optional and has a default value of `'BLACK'`.
   */
  constructor(key: K, value?: V, count = 1, color: RBTNColor = 'BLACK') {
    super(key, value, color);
    this.count = count;
  }

  override parent?: TreeCounterNode<K, V> = undefined;

  override _left?: OptNodeOrNull<TreeCounterNode<K, V>> = undefined;

  override get left(): OptNodeOrNull<TreeCounterNode<K, V>> {
    return this._left;
  }

  override set left(v: OptNodeOrNull<TreeCounterNode<K, V>>) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: OptNodeOrNull<TreeCounterNode<K, V>> = undefined;

  override get right(): OptNodeOrNull<TreeCounterNode<K, V>> {
    return this._right;
  }

  override set right(v: OptNodeOrNull<TreeCounterNode<K, V>>) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 *
 */
export class TreeCounter<K = any, V = any, R = object, MK = any, MV = any, MR = object>
  extends RedBlackTree<K, V, R, MK, MV, MR>
  implements IBinaryTree<K, V, R, MK, MV, MR>
{
  /**
   * The constructor function initializes a TreeCounter object with optional initial data.
   * @param keysNodesEntriesOrRaws - The parameter `keysNodesEntriesOrRaws` is an
   * iterable that can contain keys, nodes, entries, or raw elements. It is used to initialize the
   * TreeCounter with initial data.
   * @param [options] - The `options` parameter is an optional object that can be used to customize the
   * behavior of the `TreeCounter` constructor. It can include properties such as `compareKeys` and
   * `compareValues`, which are functions used to compare keys and values respectively.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<BTNRep<K, V, TreeCounterNode<K, V>> | R> = [],
    options?: TreeCounterOptions<K, V, R>
  ) {
    super([], options);
    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
  }

  protected _count = 0;

  // TODO the _count is not accurate after nodes count modified
  /**
   * The function calculates the sum of the count property of all nodes in a tree structure.
   * @returns the sum of the count property of all nodes in the tree.
   */
  get count(): number {
    return this._count;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function calculates the sum of the count property of all nodes in a tree using depth-first
   * search.
   * @returns the sum of the count property of all nodes in the tree.
   */
  getComputedCount(): number {
    let sum = 0;
    this.dfs(node => (sum += node.count));
    return sum;
  }

  /**
   * The function creates a new TreeCounterNode with the specified key, value, color, and count.
   * @param {K} key - The key parameter represents the key of the node being created. It is of type K,
   * which is a generic type representing the type of keys in the tree.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the node. It is of type `V`, which can be any data type.
   * @param {RBTNColor} [color=BLACK] - The color parameter is used to specify the color of the node in
   * a Red-Black Tree. It can have two possible values: 'RED' or 'BLACK'. The default value is 'BLACK'.
   * @param {number} [count] - The `count` parameter represents the number of occurrences of a key in
   * the tree. It is an optional parameter and is used to keep track of the number of values associated
   * with a key in the tree.
   * @returns A new instance of the TreeCounterNode class, casted as TreeCounterNode<K, V>.
   */
  override createNode(key: K, value?: V, color: RBTNColor = 'BLACK', count?: number): TreeCounterNode<K, V> {
    return new TreeCounterNode(key, this._isMapMode ? undefined : value, count, color) as TreeCounterNode<K, V>;
  }

  /**
   * The function creates a new instance of a TreeCounter with the specified options and returns it.
   * @param [options] - The `options` parameter is an optional object that contains additional
   * configuration options for creating the `TreeCounter`. It is of type `TreeCounterOptions<K, V,
   * R>`.
   * @returns a new instance of the `TreeCounter` class, with the provided options merged with the
   * existing `iterationType` property. The returned value is casted as `TREE`.
   */
  override createTree(options?: TreeCounterOptions<K, V, R>) {
    return new TreeCounter<K, V, R, MK, MV, MR>([], {
      iterationType: this.iterationType,
      specifyComparable: this._specifyComparable,
      isMapMode: this._isMapMode,
      toEntryFn: this._toEntryFn,
      ...options
    });
  }

  /**
   * The function checks if the input is an instance of the TreeCounterNode class.
   * @param {BTNRep<K, V, TreeCounterNode<K, V>>} keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can be of type `R` or `BTNRep<K, V, TreeCounterNode<K, V>>`.
   * @returns a boolean value indicating whether the input parameter `keyNodeOrEntry` is
   * an instance of the `TreeCounterNode` class.
   */
  override isNode(keyNodeOrEntry: BTNRep<K, V, TreeCounterNode<K, V>>): keyNodeOrEntry is TreeCounterNode<K, V> {
    return keyNodeOrEntry instanceof TreeCounterNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the add method of a class and adds a new node to a data structure, updating
   * the count and returning a boolean indicating success.
   * @param {BTNRep<K, V, TreeCounterNode<K, V>>} keyNodeOrEntry - The
   * `keyNodeOrEntry` parameter can accept one of the following types:
   * @param {V} [value] - The `value` parameter represents the value associated with the key in the
   * data structure. It is an optional parameter, so it can be omitted if not needed.
   * @param [count=1] - The `count` parameter represents the number of times the key-value pair should
   * be added to the data structure. By default, it is set to 1, meaning that if no value is provided
   * for `count`, the key-value pair will be added once.
   * @returns The method is returning a boolean value. It returns true if the addition of the new node
   * was successful, and false otherwise.
   */
  override add(keyNodeOrEntry: BTNRep<K, V, TreeCounterNode<K, V>>, value?: V, count = 1): boolean {
    const [newNode, newValue] = this._keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value, count);
    const orgCount = newNode?.count || 0;
    const isSuccessAdded = super.add(newNode, newValue);

    if (isSuccessAdded) {
      this._count += orgCount;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `delete` in TypeScript overrides the deletion operation in a binary tree data
   * structure, handling cases where nodes have children and maintaining balance in the tree.
   * @param {BTNRep<K, V, TreeCounterNode<K, V>>} keyNodeOrEntry - The `predicate`
   * parameter in the `delete` method is used to specify the condition or key based on which a node
   * should be deleted from the binary tree. It can be a key, a node, or an entry.
   * @param [ignoreCount=false] - The `ignoreCount` parameter in the `override delete` method is a
   * boolean flag that determines whether to ignore the count of nodes when performing deletion. If
   * `ignoreCount` is set to `true`, the method will delete the node regardless of its count. If
   * `ignoreCount` is `false
   * @returns The `override delete` method returns an array of `BinaryTreeDeleteResult<TreeCounterNode<K, V>>` objects.
   */
  override delete(
    keyNodeOrEntry: BTNRep<K, V, TreeCounterNode<K, V>>,
    ignoreCount = false
  ): BinaryTreeDeleteResult<TreeCounterNode<K, V>>[] {
    if (keyNodeOrEntry === null) return [];

    const results: BinaryTreeDeleteResult<TreeCounterNode<K, V>>[] = [];

    let nodeToDelete: OptNode<TreeCounterNode<K, V>>;
    if (this._isPredicate(keyNodeOrEntry)) nodeToDelete = this.getNode(keyNodeOrEntry);
    else nodeToDelete = this.isRealNode(keyNodeOrEntry) ? keyNodeOrEntry : this.getNode(keyNodeOrEntry);

    if (!nodeToDelete) {
      return results;
    }

    let originalColor = nodeToDelete.color;
    let replacementNode: TreeCounterNode<K, V> | undefined;

    if (!this.isRealNode(nodeToDelete.left)) {
      if (nodeToDelete.right !== null) replacementNode = nodeToDelete.right;
      if (ignoreCount || nodeToDelete.count <= 1) {
        if (nodeToDelete.right !== null) {
          this._transplant(nodeToDelete, nodeToDelete.right);
          this._count -= nodeToDelete.count;
        }
      } else {
        nodeToDelete.count--;
        this._count--;
        results.push({ deleted: nodeToDelete, needBalanced: undefined });
        return results;
      }
    } else if (!this.isRealNode(nodeToDelete.right)) {
      replacementNode = nodeToDelete.left;
      if (ignoreCount || nodeToDelete.count <= 1) {
        this._transplant(nodeToDelete, nodeToDelete.left);
        this._count -= nodeToDelete.count;
      } else {
        nodeToDelete.count--;
        this._count--;
        results.push({ deleted: nodeToDelete, needBalanced: undefined });
        return results;
      }
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
          if (ignoreCount || nodeToDelete.count <= 1) {
            if (successor.right !== null) {
              this._transplant(successor, successor.right);
              this._count -= nodeToDelete.count;
            }
          } else {
            nodeToDelete.count--;
            this._count--;
            results.push({ deleted: nodeToDelete, needBalanced: undefined });
            return results;
          }
          successor.right = nodeToDelete.right;
          if (this.isRealNode(successor.right)) {
            successor.right.parent = successor;
          }
        }
        if (ignoreCount || nodeToDelete.count <= 1) {
          this._transplant(nodeToDelete, successor);
          this._count -= nodeToDelete.count;
        } else {
          nodeToDelete.count--;
          this._count--;
          results.push({ deleted: nodeToDelete, needBalanced: undefined });
          return results;
        }
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
   *
   * The "clear" function overrides the parent class's "clear" function and also resets the count to
   * zero.
   */
  override clear() {
    super.clear();
    this._count = 0;
  }

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(log n)
   *
   * The `perfectlyBalance` function takes a sorted array of nodes and builds a balanced binary search
   * tree using either a recursive or iterative approach.
   * @param {IterationType} iterationType - The `iterationType` parameter is an optional parameter that
   * specifies the type of iteration to use when building the balanced binary search tree. It has a
   * default value of `this.iterationType`, which means it will use the iteration type specified by the
   * `iterationType` property of the current object.
   * @returns The function `perfectlyBalance` returns a boolean value. It returns `true` if the
   * balancing operation is successful, and `false` if there are no nodes to balance.
   */
  override perfectlyBalance(iterationType: IterationType = this.iterationType): boolean {
    const sorted = this.dfs(node => node, 'IN'),
      n = sorted.length;
    if (sorted.length < 1) return false;

    this.clear();

    if (iterationType === 'RECURSIVE') {
      const buildBalanceBST = (l: number, r: number) => {
        if (l > r) return;
        const m = l + Math.floor((r - l) / 2);
        const midNode = sorted[m];
        if (this._isMapMode) this.add(midNode.key, undefined, midNode.count);
        else this.add(midNode.key, midNode.value, midNode.count);
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
            if (this._isMapMode) this.add(midNode.key, undefined, midNode.count);
            else this.add(midNode.key, midNode.value, midNode.count);
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
   *
   * The function overrides the clone method to create a deep copy of a tree object.
   * @returns The `clone()` method is returning a cloned instance of the `TREE` object.
   */
  override clone() {
    const cloned = this.createTree();
    this.bfs(node => cloned.add(node.key, undefined, node.count));
    if (this._isMapMode) cloned._store = this._store;
    return cloned;
  }

  /**
   * The `map` function in TypeScript overrides the default behavior to create a new TreeCounter with
   * modified entries based on a provided callback.
   * @param callback - The `callback` parameter is a function that will be called for each entry in the
   * map. It takes four arguments:
   * @param [options] - The `options` parameter in the `override map` function is of type
   * `TreeCounterOptions<MK, MV, MR>`. This parameter allows you to provide additional configuration
   * options when creating a new `TreeCounter` instance within the `map` function. These options could
   * include things like
   * @param {any} [thisArg] - The `thisArg` parameter in the `override map` function is used to specify
   * the value of `this` when executing the `callback` function. It allows you to set the context
   * (value of `this`) for the callback function when it is called within the `map` function. This
   * @returns A new TreeCounter instance is being returned, which is populated with entries generated
   * by the provided callback function.
   */
  override map(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: TreeCounterOptions<MK, MV, MR>,
    thisArg?: any
  ): TreeCounter<MK, MV, MR> {
    const newTree = new TreeCounter<MK, MV, MR>([], options);
    let index = 0;
    for (const [key, value] of this) {
      newTree.add(callback.call(thisArg, key, value, index++, this));
    }
    return newTree;
  }

  /**
   * The function `keyValueNodeEntryRawToNodeAndValue` takes in a key, value, and count and returns a
   * node based on the input.
   * @param {BTNRep<K, V, TreeCounterNode<K, V>>} keyNodeOrEntry - The parameter
   * `keyNodeOrEntry` can be of type `R` or `BTNRep<K, V, TreeCounterNode<K, V>>`.
   * @param {V} [value] - The `value` parameter is an optional value that represents the value
   * associated with the key in the node. It is used when creating a new node or updating the value of
   * an existing node.
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the key-value pair should be added to the data structure. If not provided, it defaults to 1.
   * @returns either a TreeCounterNode<K, V> object or undefined.
   */
  protected override _keyValueNodeOrEntryToNodeAndValue(
    keyNodeOrEntry: BTNRep<K, V, TreeCounterNode<K, V>>,
    value?: V,
    count = 1
  ): [TreeCounterNode<K, V> | undefined, V | undefined] {
    if (keyNodeOrEntry === undefined || keyNodeOrEntry === null) return [undefined, undefined];

    if (this.isNode(keyNodeOrEntry)) return [keyNodeOrEntry, value];

    if (this.isEntry(keyNodeOrEntry)) {
      const [key, entryValue] = keyNodeOrEntry;
      if (key === undefined || key === null) return [undefined, undefined];
      const finalValue = value ?? entryValue;
      return [this.createNode(key, finalValue, 'BLACK', count), finalValue];
    }

    return [this.createNode(keyNodeOrEntry, value, 'BLACK', count), value];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_swapProperties` function swaps the properties (key, value, count, color) between two nodes
   * in a binary search tree.
   * @param {R | BSTNOptKeyOrNode<K, TreeCounterNode<K, V>>} srcNode - The `srcNode` parameter represents the source node
   * that will be swapped with the `destNode`. It can be either an instance of the `R` class or an
   * instance of the `BSTNOptKeyOrNode<K, TreeCounterNode<K, V>>` class.
   * @param {R | BSTNOptKeyOrNode<K, TreeCounterNode<K, V>>} destNode - The `destNode` parameter represents the destination
   * node where the properties will be swapped with the source node.
   * @returns The method is returning the `destNode` after swapping its properties with the `srcNode`.
   * If either `srcNode` or `destNode` is undefined, it returns undefined.
   */
  protected override _swapProperties(
    srcNode: BSTNOptKeyOrNode<K, TreeCounterNode<K, V>>,
    destNode: BSTNOptKeyOrNode<K, TreeCounterNode<K, V>>
  ): TreeCounterNode<K, V> | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);
    if (srcNode && destNode) {
      const { key, value, count, color } = destNode;
      const tempNode = this.createNode(key, value, color, count);
      if (tempNode) {
        tempNode.color = color;

        destNode.key = srcNode.key;
        if (!this._isMapMode) destNode.value = srcNode.value;
        destNode.count = srcNode.count;
        destNode.color = srcNode.color;

        srcNode.key = tempNode.key;
        if (!this._isMapMode) srcNode.value = tempNode.value;
        srcNode.count = tempNode.count;
        srcNode.color = tempNode.color;
      }

      return destNode;
    }
    return undefined;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function replaces an old node with a new node and updates the count property of the new node.
   * @param {TreeCounterNode<K, V>} oldNode - The `oldNode` parameter is the node that you want to replace in the data
   * structure.
   * @param {TreeCounterNode<K, V>} newNode - The `newNode` parameter is an instance of the `TreeCounterNode<K, V>` class.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, which is of type `TreeCounterNode<K, V>`.
   */
  protected override _replaceNode(
    oldNode: TreeCounterNode<K, V>,
    newNode: TreeCounterNode<K, V>
  ): TreeCounterNode<K, V> {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
