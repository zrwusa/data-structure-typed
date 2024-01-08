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
  KeyOrNodeOrEntry,
  TreeMultiMapNested,
  TreeMultiMapNodeNested,
  TreeMultiMapOptions
} from '../../types';
import { IterationType, RBTNColor } from '../../types';
import { IBinaryTree } from '../../interfaces';
import { RedBlackTree, RedBlackTreeNode } from './rb-tree';

export class TreeMultiMapNode<
  K = any,
  V = any,
  NODE extends TreeMultiMapNode<K, V, NODE> = TreeMultiMapNodeNested<K, V>
> extends RedBlackTreeNode<K, V, NODE> {
  /**
   * The constructor function initializes an instance of a class with a key, value, and count.
   * @param {K} key - The key parameter is of type K, which represents the type of the key for the
   * constructor. It is required and must be provided when creating an instance of the class.
   * @param {V} [value] - The `value` parameter is an optional parameter of type `V`. It represents the
   * value associated with the key in the constructor. If no value is provided, it will be `undefined`.
   * @param [count=1] - The "count" parameter is an optional parameter that specifies the number of
   * times the key-value pair should be repeated. If no value is provided for "count", it defaults to
   * 1.
   */
  constructor(key: K, value?: V, count = 1) {
    super(key, value);
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
  NODE extends TreeMultiMapNode<K, V, NODE> = TreeMultiMapNode<K, V, TreeMultiMapNodeNested<K, V>>,
  TREE extends TreeMultiMap<K, V, NODE, TREE> = TreeMultiMap<K, V, NODE, TreeMultiMapNested<K, V, NODE>>
>
  extends RedBlackTree<K, V, NODE, TREE>
  implements IBinaryTree<K, V, NODE, TREE> {
  /**
   * The constructor function initializes a new instance of the TreeMultiMap class with optional
   * initial keys, nodes, or entries.
   * @param keysOrNodesOrEntries - The `keysOrNodesOrEntries` parameter is an iterable object that can
   * contain keys, nodes, or entries. It is used to initialize the TreeMultiMap with the provided keys,
   * nodes, or entries.
   * @param [options] - The `options` parameter is an optional object that can be passed to the
   * constructor. It allows you to customize the behavior of the `TreeMultiMap` instance.
   */
  constructor(keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, NODE>> = [], options?: TreeMultiMapOptions<K>) {
    super([], options);
    if (keysOrNodesOrEntries) this.addMany(keysOrNodesOrEntries);
  }

  protected _count = 0;

  // TODO the _count is not accurate after nodes count modified
  /**
   * The function calculates the sum of the count property of all nodes in a tree structure.
   * @returns the sum of the count property of all nodes in the tree.
   */
  get count(): number {
    let sum = 0;
    this.dfs(node => (sum += node.count));
    return sum;
    // return this._count;
  }

  /**
   * The function creates a new TreeMultiMapNode object with the specified key, value, and count.
   * @param {K} key - The key parameter represents the key of the node being created. It is of type K,
   * which is a generic type that can be replaced with any specific type when using the function.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the node. It is of type `V`, which can be any data type.
   * @param {number} [count] - The `count` parameter represents the number of occurrences of a
   * key-value pair in the TreeMultiMap. It is an optional parameter, so if it is not provided, it will
   * default to 1.
   * @returns a new instance of the TreeMultiMapNode class, casted as NODE.
   */
  override createNode(key: K, value?: V, count?: number): NODE {
    return new TreeMultiMapNode(key, value, count) as NODE;
  }

  /**
   * The function creates a new instance of a TreeMultiMap with the specified options and returns it.
   * @param [options] - The `options` parameter is an optional object that contains additional
   * configuration options for creating the `TreeMultiMap`. It can include properties such as
   * `keyComparator`, `valueComparator`, `allowDuplicates`, etc.
   * @returns a new instance of the `TreeMultiMap` class, with the provided options merged with the
   * existing `iterationType` option. The returned value is casted as `TREE`.
   */
  override createTree(options?: TreeMultiMapOptions<K>): TREE {
    return new TreeMultiMap<K, V, NODE, TREE>([], {
      iterationType: this.iterationType,
      ...options
    }) as TREE;
  }

  /**
   * The function `keyValueOrEntryToNode` takes a key, value, and count and returns a node if the input
   * is valid.
   * @param keyOrNodeOrEntry - The parameter `keyOrNodeOrEntry` can be of type `KeyOrNodeOrEntry<K, V,
   * NODE>`. It can accept three types of values:
   * @param {V} [value] - The `value` parameter is an optional value of type `V`. It represents the
   * value associated with a key in a key-value pair.
   * @param [count=1] - The count parameter is an optional parameter that specifies the number of times
   * the key-value pair should be added to the node. If not provided, it defaults to 1.
   * @returns a NODE object or undefined.
   */
  override keyValueOrEntryToNode(
    keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>,
    value?: V,
    count = 1
  ): NODE | undefined {
    let node: NODE | undefined;
    if (keyOrNodeOrEntry === undefined || keyOrNodeOrEntry === null) {
      return;
    } else if (this.isNode(keyOrNodeOrEntry)) {
      node = keyOrNodeOrEntry;
    } else if (this.isEntry(keyOrNodeOrEntry)) {
      const [key, value] = keyOrNodeOrEntry;
      if (key === undefined || key === null) {
        return;
      } else {
        node = this.createNode(key, value, count);
      }
    } else if (!this.isNode(keyOrNodeOrEntry)) {
      node = this.createNode(keyOrNodeOrEntry, value, count);
    } else {
      return;
    }
    return node;
  }

  /**
   * The function "isNode" checks if a given key, node, or entry is an instance of the TreeMultiMapNode
   * class.
   * @param keyOrNodeOrEntry - The parameter `keyOrNodeOrEntry` can be of type `KeyOrNodeOrEntry<K, V,
   * NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyOrNodeOrEntry` is an instance
   * of the `TreeMultiMapNode` class.
   */
  override isNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>): keyOrNodeOrEntry is NODE {
    return keyOrNodeOrEntry instanceof TreeMultiMapNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the add method in TypeScript and adds a new node to the data structure.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can accept three types of values:
   * @param {V} [value] - The `value` parameter represents the value associated with the key in the
   * data structure.
   * @param [count=1] - The `count` parameter represents the number of times the key-value pair should
   * be added to the data structure. By default, it is set to 1, meaning that the key-value pair will
   * be added once. However, you can specify a different value for `count` if you want to add
   * @returns a boolean value.
   */
  override add(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>, value?: V, count = 1): boolean {
    const newNode = this.keyValueOrEntryToNode(keyOrNodeOrEntry, value, count);
    if (newNode === undefined) return false;

    const orgNodeCount = newNode?.count || 0;
    const inserted = super.add(newNode);
    if (inserted) {
      this._count += orgNodeCount;
    }
    return true;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `delete` function in a TypeScript class is used to delete nodes from a binary tree based on a
   * given identifier, and it returns an array of results containing information about the deleted
   * nodes.
   * @param {ReturnType<C> | null | undefined} identifier - The identifier parameter is the value used
   * to identify the node to be deleted. It can be of any type that is returned by the callback
   * function. It can also be null or undefined if no node needs to be deleted.
   * @param {C} callback - The `callback` parameter is a function that takes a node of type `NODE` as
   * input and returns a value of type `ReturnType<C>`. It is used to determine if a node matches the
   * identifier for deletion. If no callback is provided, the `_defaultOneParamCallback` function is
   * used
   * @param [ignoreCount=false] - A boolean value indicating whether to ignore the count of the target
   * node when performing deletion. If set to true, the count of the target node will not be considered
   * and the node will be deleted regardless of its count. If set to false (default), the count of the
   * target node will be decremented
   * @returns an array of BinaryTreeDeleteResult<NODE> objects.
   */
  override delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C> | null | undefined,
    callback: C = this._defaultOneParamCallback as C,
    ignoreCount = false
  ): BinaryTreeDeleteResult<NODE>[] {
    const deleteResults: BinaryTreeDeleteResult<NODE>[] = [];
    if (identifier === null) return deleteResults;

    // Helper function to perform deletion
    const deleteHelper = (node: NODE | undefined): void => {
      // Initialize targetNode to the sentinel node
      let targetNode: NODE = this._Sentinel;
      let currentNode: NODE | undefined;

      // Find the node to be deleted based on the identifier
      while (node !== this._Sentinel) {
        // Update targetNode if the current node matches the identifier
        if (node && callback(node) === identifier) {
          targetNode = node;
        }

        // Move to the right or left based on the comparison with the identifier
        if (node && identifier && callback(node) <= identifier) {
          node = node.right;
        } else {
          node = node?.left;
        }
      }

      // If the target node is not found, decrement size and return
      if (targetNode === this._Sentinel) {
        return;
      }

      if (ignoreCount || targetNode.count <= 1) {
        // Store the parent of the target node and its original color
        let parentNode = targetNode;
        let parentNodeOriginalColor: number = parentNode.color;

        // Handle deletion based on the number of children of the target node
        if (targetNode.left === this._Sentinel) {
          // Target node has no left child - deletion case 1
          currentNode = targetNode.right;
          this._rbTransplant(targetNode, targetNode.right!);
        } else if (targetNode.right === this._Sentinel) {
          // Target node has no right child - deletion case 2
          currentNode = targetNode.left;
          this._rbTransplant(targetNode, targetNode.left!);
        } else {
          // Target node has both left and right children - deletion case 3
          parentNode = this.getLeftMost(targetNode.right)!;
          parentNodeOriginalColor = parentNode.color;
          currentNode = parentNode.right;

          if (parentNode.parent === targetNode) {
            // Target node's right child becomes its parent's left child
            currentNode!.parent = parentNode;
          } else {
            // Replace parentNode with its right child and update connections
            this._rbTransplant(parentNode, parentNode.right!);
            parentNode.right = targetNode.right;
            parentNode.right!.parent = parentNode;
          }

          // Replace the target node with its in-order successor
          this._rbTransplant(targetNode, parentNode);
          parentNode.left = targetNode.left;
          parentNode.left!.parent = parentNode;
          parentNode.color = targetNode.color;
        }

        // Fix the Red-Black Tree properties after deletion
        if (parentNodeOriginalColor === RBTNColor.BLACK) {
          this._fixDelete(currentNode!);
        }

        // Decrement the size and store information about the deleted node
        this._size--;
        this._count -= targetNode.count;
        deleteResults.push({ deleted: targetNode, needBalanced: undefined });
      } else {
        targetNode.count--;
        this._count--;
      }
    };

    // Call the helper function with the root of the tree
    deleteHelper(this.root);

    // Return the result array
    return deleteResults;
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
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when building the balanced binary search tree. It can have two possible
   * values:
   * @returns a boolean value.
   */
  override perfectlyBalance(iterationType = this.iterationType): boolean {
    const sorted = this.dfs(node => node, 'in'),
      n = sorted.length;
    if (sorted.length < 1) return false;

    this.clear();

    if (iterationType === IterationType.RECURSIVE) {
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
   * The function swaps the properties of two nodes in a binary search tree.
   * @param srcNode - The source node that needs to be swapped with the destination node. It can be
   * either a key or a node object.
   * @param destNode - The `destNode` parameter is the node in the binary search tree where the
   * properties will be swapped with the `srcNode`.
   * @returns The method is returning the `destNode` after swapping its properties with the `srcNode`.
   * If both `srcNode` and `destNode` are valid nodes, the method swaps their `key`, `value`, `count`,
   * and `color` properties. If the swapping is successful, the method returns the modified `destNode`.
   * If either `srcNode` or `destNode` is
   */
  protected override _swapProperties(
    srcNode: BSTNKeyOrNode<K, NODE>,
    destNode: BSTNKeyOrNode<K, NODE>
  ): NODE | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);
    if (srcNode && destNode) {
      const { key, value, count, color } = destNode;
      const tempNode = this.createNode(key, value, count);
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
   * The function replaces an old node with a new node and updates the count property of the new node.
   * @param {NODE} oldNode - The `oldNode` parameter is of type `NODE` and represents the node that
   * needs to be replaced in the data structure.
   * @param {NODE} newNode - The `newNode` parameter is an object of type `NODE`.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, after updating the `count` property of the `newNode` object.
   */
  protected _replaceNode(oldNode: NODE, newNode: NODE): NODE {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
