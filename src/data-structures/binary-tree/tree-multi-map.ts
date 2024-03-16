/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  BinaryTreeDeleteResult,
  BSTNKeyOrNode,
  BTNCallback,
  BTNKeyOrNodeOrEntry,
  IterationType,
  RBTNColor,
  TreeMultiMapNested,
  TreeMultiMapNodeNested,
  TreeMultiMapOptions
} from '../../types';
import { BTNEntry } from '../../types';
import { IBinaryTree } from '../../interfaces';
import { RedBlackTree, RedBlackTreeNode } from './rb-tree';

export class TreeMultiMapNode<
  K = any,
  V = any,
  NODE extends TreeMultiMapNode<K, V, NODE> = TreeMultiMapNodeNested<K, V>
> extends RedBlackTreeNode<K, V, NODE> {
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

  protected _count: number = 1;

  /**
   * The function returns the value of the private variable _count.
   * @returns The count property of the object, which is of type number.
   */
  get count(): number {
    return this._count;
  }

  /**
   * The above function sets the value of the count property.
   * @param {number} value - The value parameter is of type number, which means it can accept any
   * numeric value.
   */
  set count(value: number) {
    this._count = value;
  }
}

export class TreeMultiMap<
  K = any,
  V = any,
  R = BTNEntry<K, V>,
  NODE extends TreeMultiMapNode<K, V, NODE> = TreeMultiMapNode<K, V, TreeMultiMapNodeNested<K, V>>,
  TREE extends TreeMultiMap<K, V, R, NODE, TREE> = TreeMultiMap<K, V, R, NODE, TreeMultiMapNested<K, V, R, NODE>>
>
  extends RedBlackTree<K, V, R, NODE, TREE>
  implements IBinaryTree<K, V, R, NODE, TREE> {
  /**
   * The constructor function initializes a TreeMultiMap object with optional initial data.
   * @param keysOrNodesOrEntriesOrRawElements - The parameter `keysOrNodesOrEntriesOrRawElements` is an
   * iterable that can contain keys, nodes, entries, or raw elements. It is used to initialize the
   * TreeMultiMap with initial data.
   * @param [options] - The `options` parameter is an optional object that can be used to customize the
   * behavior of the `TreeMultiMap` constructor. It can include properties such as `compareKeys` and
   * `compareValues`, which are functions used to compare keys and values respectively.
   */
  constructor(
    keysOrNodesOrEntriesOrRawElements: Iterable<BTNKeyOrNodeOrEntry<K, V, NODE>> = [],
    options?: TreeMultiMapOptions<K, V, R>
  ) {
    super([], options);
    if (keysOrNodesOrEntriesOrRawElements) this.addMany(keysOrNodesOrEntriesOrRawElements);
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
   */

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
   * The function creates a new TreeMultiMapNode with the specified key, value, color, and count.
   * @param {K} key - The key parameter represents the key of the node being created. It is of type K,
   * which is a generic type representing the type of keys in the tree.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the node. It is of type `V`, which can be any data type.
   * @param {RBTNColor} [color=BLACK] - The color parameter is used to specify the color of the node in
   * a Red-Black Tree. It can have two possible values: 'RED' or 'BLACK'. The default value is 'BLACK'.
   * @param {number} [count] - The `count` parameter represents the number of occurrences of a key in
   * the tree. It is an optional parameter and is used to keep track of the number of values associated
   * with a key in the tree.
   * @returns A new instance of the TreeMultiMapNode class, casted as NODE.
   */
  override createNode(key: K, value?: V, color: RBTNColor = 'BLACK', count?: number): NODE {
    return new TreeMultiMapNode(key, value, count, color) as NODE;
  }

  /**
   * The function creates a new instance of a TreeMultiMap with the specified options and returns it.
   * @param [options] - The `options` parameter is an optional object that contains additional
   * configuration options for creating the `TreeMultiMap`. It is of type `TreeMultiMapOptions<K, V,
   * R>`.
   * @returns a new instance of the `TreeMultiMap` class, with the provided options merged with the
   * existing `iterationType` property. The returned value is casted as `TREE`.
   */
  override createTree(options?: TreeMultiMapOptions<K, V, R>): TREE {
    return new TreeMultiMap<K, V, R, NODE, TREE>([], {
      iterationType: this.iterationType,
      ...options
    }) as TREE;
  }

  /**
   * The function `keyValueOrEntryOrRawElementToNode` takes in a key, value, and count and returns a
   * node based on the input.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @param {V} [value] - The `value` parameter is an optional value that represents the value
   * associated with the key in the node. It is used when creating a new node or updating the value of
   * an existing node.
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the key-value pair should be added to the data structure. If not provided, it defaults to 1.
   * @returns either a NODE object or undefined.
   */
  override keyValueOrEntryOrRawElementToNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>,
    value?: V,
    count = 1
  ): NODE | undefined {
    if (keyOrNodeOrEntryOrRawElement === undefined || keyOrNodeOrEntryOrRawElement === null) return;

    if (this.isNode(keyOrNodeOrEntryOrRawElement)) return keyOrNodeOrEntryOrRawElement;

    if (this.toEntryFn) {
      const [key] = this.toEntryFn(keyOrNodeOrEntryOrRawElement as R);
      if (key) return this.getNodeByKey(key);
    }

    if (this.isEntry(keyOrNodeOrEntryOrRawElement)) {
      const [key, value] = keyOrNodeOrEntryOrRawElement;
      if (key === undefined || key === null) return;
      else return this.createNode(key, value, 'BLACK', count);
    }

    if (this.isKey(keyOrNodeOrEntryOrRawElement))
      return this.createNode(keyOrNodeOrEntryOrRawElement, value, 'BLACK', count);

    return;
  }

  /**
   * The function checks if the input is an instance of the TreeMultiMapNode class.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyOrNodeOrEntryOrRawElement` is
   * an instance of the `TreeMultiMapNode` class.
   */
  override isNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>
  ): keyOrNodeOrEntryOrRawElement is NODE {
    return keyOrNodeOrEntryOrRawElement instanceof TreeMultiMapNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the add method of a class and adds a new node to a data structure, updating
   * the count and returning a boolean indicating success.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The
   * `keyOrNodeOrEntryOrRawElement` parameter can accept one of the following types:
   * @param {V} [value] - The `value` parameter represents the value associated with the key in the
   * data structure. It is an optional parameter, so it can be omitted if not needed.
   * @param [count=1] - The `count` parameter represents the number of times the key-value pair should
   * be added to the data structure. By default, it is set to 1, meaning that if no value is provided
   * for `count`, the key-value pair will be added once.
   * @returns The method is returning a boolean value. It returns true if the addition of the new node
   * was successful, and false otherwise.
   */
  override add(keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>, value?: V, count = 1): boolean {
    const newNode = this.keyValueOrEntryOrRawElementToNode(keyOrNodeOrEntryOrRawElement, value, count);
    const orgCount = newNode?.count || 0;
    const isSuccessAdded = super.add(newNode);

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
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `delete` is used to remove a node from a binary tree and fix the tree if necessary.
   * @param {ReturnType<C> | null | undefined} identifier - The `identifier` parameter is the value or
   * key that is used to identify the node that needs to be deleted from the binary tree. It can be of
   * any type that is returned by the callback function `C`. It can also be `null` or `undefined` if
   * the node to be deleted
   * @param {C} callback - The `callback` parameter is a function that is used to determine the
   * equality of nodes in the binary tree. It is optional and has a default value of
   * `this._DEFAULT_CALLBACK`. The `callback` function is used to compare nodes when searching for a
   * specific node or when performing other operations on the
   * @param [ignoreCount=false] - A boolean flag indicating whether to ignore the count of the node
   * being deleted. If set to true, the count of the node will not be taken into account when deleting
   * it. If set to false, the count of the node will be decremented by 1 before deleting it.
   * @returns an array of BinaryTreeDeleteResult<NODE> objects.
   */
  override delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._DEFAULT_CALLBACK as C,
    ignoreCount = false
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
      if (ignoreCount || nodeToDelete.count <= 1) {
        this._transplant(nodeToDelete, nodeToDelete.right);
        this._count -= nodeToDelete.count;
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
      const successor = this.getLeftMost(nodeToDelete.right);
      if (successor) {
        originalColor = successor.color;
        replacementNode = successor.right;

        if (successor.parent === nodeToDelete) {
          if (this.isRealNode(replacementNode)) {
            replacementNode.parent = successor;
          }
        } else {
          if (ignoreCount || nodeToDelete.count <= 1) {
            this._transplant(successor, successor.right);
            this._count -= nodeToDelete.count;
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
   */

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
   */

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
        this.add(midNode.key, midNode.value, midNode.count);
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
            this.add(midNode.key, midNode.value, midNode.count);
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
   * Time complexity: O(n)
   * Space complexity: O(n)
   *
   * The function overrides the clone method to create a deep copy of a tree object.
   * @returns The `clone()` method is returning a cloned instance of the `TREE` object.
   */
  override clone(): TREE {
    const cloned = this.createTree();
    this.bfs(node => cloned.add(node.key, node.value, node.count));
    return cloned;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_swapProperties` function swaps the properties (key, value, count, color) between two nodes
   * in a binary search tree.
   * @param {R | BSTNKeyOrNode<K, NODE>} srcNode - The `srcNode` parameter represents the source node
   * that will be swapped with the `destNode`. It can be either an instance of the `R` class or an
   * instance of the `BSTNKeyOrNode<K, NODE>` class.
   * @param {R | BSTNKeyOrNode<K, NODE>} destNode - The `destNode` parameter represents the destination
   * node where the properties will be swapped with the source node.
   * @returns The method is returning the `destNode` after swapping its properties with the `srcNode`.
   * If either `srcNode` or `destNode` is undefined, it returns undefined.
   */
  protected override _swapProperties(
    srcNode: R | BSTNKeyOrNode<K, NODE>,
    destNode: R | BSTNKeyOrNode<K, NODE>
  ): NODE | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);
    if (srcNode && destNode) {
      const { key, value, count, color } = destNode;
      const tempNode = this.createNode(key, value, color, count);
      if (tempNode) {
        tempNode.color = color;

        destNode.key = srcNode.key;
        destNode.value = srcNode.value;
        destNode.count = srcNode.count;
        destNode.color = srcNode.color;

        srcNode.key = tempNode.key;
        srcNode.value = tempNode.value;
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
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function replaces an old node with a new node and updates the count property of the new node.
   * @param {NODE} oldNode - The `oldNode` parameter is the node that you want to replace in the data
   * structure.
   * @param {NODE} newNode - The `newNode` parameter is an instance of the `NODE` class.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, which is of type `NODE`.
   */
  protected override _replaceNode(oldNode: NODE, newNode: NODE): NODE {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
