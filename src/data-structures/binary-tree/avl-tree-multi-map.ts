/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  AVLTreeMultiMapNested,
  AVLTreeMultiMapNodeNested,
  AVLTreeMultiMapOptions,
  BinaryTreeDeleteResult,
  BSTNKeyOrNode,
  BTNCallback,
  KeyOrNodeOrEntry
} from '../../types';
import { FamilyPosition, IterationType } from '../../types';
import { IBinaryTree } from '../../interfaces';
import { AVLTree, AVLTreeNode } from './avl-tree';

export class AVLTreeMultiMapNode<
  K = any,
  V = any,
  NODE extends AVLTreeMultiMapNode<K, V, NODE> = AVLTreeMultiMapNodeNested<K, V>
> extends AVLTreeNode<K, V, NODE> {
  /**
   * The constructor function initializes a BinaryTreeNode object with a key, value, and count.
   * @param {K} key - The `key` parameter is of type `K` and represents the unique identifier
   * of the binary tree node.
   * @param {V} [value] - The `value` parameter is an optional parameter of type `V`. It represents the value of the binary
   * tree node. If no value is provided, it will be `undefined`.
   * @param {number} [count=1] - The `count` parameter is a number that represents the number of times a particular value
   * occurs in a binary tree node. It has a default value of 1, which means that if no value is provided for the `count`
   * parameter when creating a new instance of the `BinaryTreeNode` class.
   */
  constructor(key: K, value?: V, count = 1) {
    super(key, value);
    this.count = count;
  }

  protected _count: number = 1;

  /**
   * The function returns the value of the protected variable _count.
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

/**
 * The only distinction between a AVLTreeMultiMap and a AVLTree lies in the ability of the former to store duplicate nodes through the utilization of counters.
 */
export class AVLTreeMultiMap<
  K = any,
  V = any,
  NODE extends AVLTreeMultiMapNode<K, V, NODE> = AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNodeNested<K, V>>,
  TREE extends AVLTreeMultiMap<K, V, NODE, TREE> = AVLTreeMultiMap<K, V, NODE, AVLTreeMultiMapNested<K, V, NODE>>
>
  extends AVLTree<K, V, NODE, TREE>
  implements IBinaryTree<K, V, NODE, TREE> {
  constructor(keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, NODE>> = [], options?: AVLTreeMultiMapOptions<K>) {
    super([], options);
    if (keysOrNodesOrEntries) this.addMany(keysOrNodesOrEntries);
  }

  protected _count = 0;

  // TODO the _count is not accurate after nodes count modified
  /**
   * The function calculates the sum of the count property of all nodes in a tree using depth-first
   * search.
   * @returns the sum of the count property of all nodes in the tree.
   */
  get count(): number {
    return this._count;
  }

  getMutableCount(): number {
    let sum = 0;
    this.dfs(node => (sum += node.count));
    return sum;
  }

  /**
   * The function creates a new BSTNode with the given key, value, and count.
   * @param {K} key - The key parameter is the unique identifier for the binary tree node. It is used to
   * distinguish one node from another in the tree.
   * @param {NODE} value - The `value` parameter represents the value that will be stored in the binary search tree node.
   * @param {number} [count] - The "count" parameter is an optional parameter of type number. It represents the number of
   * occurrences of the value in the binary search tree node. If not provided, the count will default to 1.
   * @returns A new instance of the BSTNode class with the specified key, value, and count (if provided).
   */
  override createNode(key: K, value?: V, count?: number): NODE {
    return new AVLTreeMultiMapNode(key, value, count) as NODE;
  }

  /**
   * The function creates a new AVLTreeMultiMap object with the specified options and returns it.
   * @param [options] - The `options` parameter is an optional object that contains additional
   * configuration options for creating the `AVLTreeMultiMap` object. It can include properties such as
   * `iterationType` and `variant`, which are used to specify the type of iteration and the variant of
   * the tree, respectively. These properties can be
   * @returns a new instance of the `AVLTreeMultiMap` class, with the provided options merged with the
   * default options. The returned value is casted as `TREE`.
   */
  override createTree(options?: AVLTreeMultiMapOptions<K>): TREE {
    return new AVLTreeMultiMap<K, V, NODE, TREE>([], {
      iterationType: this.iterationType,
      variant: this.variant,
      ...options
    }) as TREE;
  }

  /**
   * The function `keyValueOrEntryToNode` converts an keyOrNodeOrEntry object into a node object.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is of type `KeyOrNodeOrEntry<K, V, NODE>`, which means it
   * can be one of the following:
   * @param {V} [value] - The `value` parameter is an optional argument that represents the value
   * associated with the node. It is of type `V`, which can be any data type. If no value is provided,
   * it defaults to `undefined`.
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the value should be added to the node. If not provided, it defaults to 1.
   * @returns a node of type `NODE` or `undefined`.
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
   * The function checks if an keyOrNodeOrEntry is an instance of the AVLTreeMultiMapNode class.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is of type `KeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the keyOrNodeOrEntry is an instance of the AVLTreeMultiMapNode
   * class.
   */
  override isNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, NODE>): keyOrNodeOrEntry is NODE {
    return keyOrNodeOrEntry instanceof AVLTreeMultiMapNode;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the add method of a binary tree node and adds a new node to the tree.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can be either a key, a node, or an
   * entry. It represents the key, node, or entry that you want to add to the binary tree.
   * @param {V} [value] - The `value` parameter represents the value associated with the key in the
   * binary tree node. It is an optional parameter, meaning it can be omitted when calling the `add`
   * method.
   * @param [count=1] - The `count` parameter represents the number of times the key-value pair should
   * be added to the binary tree. By default, it is set to 1, meaning that the key-value pair will be
   * added once. However, you can specify a different value for `count` if you want to add
   * @returns The method is returning either the newly inserted node or `undefined` if the insertion
   * was not successful.
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
   * The `delete` function in TypeScript is used to remove a node from a binary tree, taking into
   * account the count of the node and balancing the tree if necessary.
   * @param identifier - The identifier is the value or key that is used to identify the node that
   * needs to be deleted from the binary tree. It can be of any type that is returned by the callback
   * function.
   * @param {C} callback - The `callback` parameter is a function that is used to determine if a node
   * should be deleted. It is optional and defaults to a default callback function. The `callback`
   * function takes one parameter, which is the identifier of the node, and returns a value that is
   * used to identify the node to
   * @param [ignoreCount=false] - A boolean flag indicating whether to ignore the count of the node
   * being deleted. If set to true, the count of the node will not be considered and the node will be
   * deleted regardless of its count. If set to false (default), the count of the node will be
   * decremented by 1 and
   * @returns an array of `BinaryTreeDeleteResult<NODE>`.
   */
  override delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C>,
    callback: C = this._defaultOneParamCallback as C,
    ignoreCount = false
  ): BinaryTreeDeleteResult<NODE>[] {
    const deletedResult: BinaryTreeDeleteResult<NODE>[] = [];
    if (!this.root) return deletedResult;

    const curr: NODE | undefined = this.getNode(identifier, callback) ?? undefined;
    if (!curr) return deletedResult;

    const parent: NODE | undefined = curr?.parent ? curr.parent : undefined;
    let needBalanced: NODE | undefined = undefined,
      orgCurrent: NODE | undefined = curr;

    if (curr.count > 1 && !ignoreCount) {
      curr.count--;
      this._count--;
    } else {
      if (!curr.left) {
        if (!parent) {
          if (curr.right !== undefined) this._setRoot(curr.right);
        } else {
          const { familyPosition: fp } = curr;
          if (fp === FamilyPosition.LEFT || fp === FamilyPosition.ROOT_LEFT) {
            parent.left = curr.right;
          } else if (fp === FamilyPosition.RIGHT || fp === FamilyPosition.ROOT_RIGHT) {
            parent.right = curr.right;
          }
          needBalanced = parent;
        }
      } else {
        const leftSubTreeRightMost = curr.left ? this.getRightMost(curr.left) : undefined;
        if (leftSubTreeRightMost) {
          const parentOfLeftSubTreeMax = leftSubTreeRightMost.parent;
          orgCurrent = this._swapProperties(curr, leftSubTreeRightMost);
          if (parentOfLeftSubTreeMax) {
            if (parentOfLeftSubTreeMax.right === leftSubTreeRightMost) {
              parentOfLeftSubTreeMax.right = leftSubTreeRightMost.left;
            } else {
              parentOfLeftSubTreeMax.left = leftSubTreeRightMost.left;
            }
            needBalanced = parentOfLeftSubTreeMax;
          }
        }
      }
      this._size = this.size - 1;
      // TODO How to handle when the count of target node is lesser than current node's count
      if (orgCurrent) this._count -= orgCurrent.count;
    }

    deletedResult.push({ deleted: orgCurrent, needBalanced });

    if (needBalanced) {
      this._balancePath(needBalanced);
    }

    return deletedResult;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The clear() function clears the contents of a data structure and sets the count to zero.
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
   * The `clone` function creates a deep copy of a tree object.
   * @returns The `clone()` method is returning a cloned instance of the `TREE` object.
   */
  override clone(): TREE {
    const cloned = this.createTree();
    this.bfs(node => cloned.add(node.key, node.value, node.count));
    return cloned;
  }

  /**
   * The `_swapProperties` function swaps the key, value, count, and height properties between two nodes.
   * @param {K | NODE | undefined} srcNode - The `srcNode` parameter represents the source node from
   * which the values will be swapped. It can be of type `K`, `NODE`, or `undefined`.
   * @param {K | NODE | undefined} destNode - The `destNode` parameter represents the destination
   * node where the values from the source node will be swapped to.
   * @returns either the `destNode` object if both `srcNode` and `destNode` are defined, or `undefined`
   * if either `srcNode` or `destNode` is undefined.
   */
  protected override _swapProperties(
    srcNode: BSTNKeyOrNode<K, NODE>,
    destNode: BSTNKeyOrNode<K, NODE>
  ): NODE | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);
    if (srcNode && destNode) {
      const { key, value, count, height } = destNode;
      const tempNode = this.createNode(key, value, count);
      if (tempNode) {
        tempNode.height = height;

        destNode.key = srcNode.key;
        destNode.value = srcNode.value;
        destNode.count = srcNode.count;
        destNode.height = srcNode.height;

        srcNode.key = tempNode.key;
        srcNode.value = tempNode.value;
        srcNode.count = tempNode.count;
        srcNode.height = tempNode.height;
      }

      return destNode;
    }
    return undefined;
  }

  /**
   * The function replaces an old node with a new node and updates the count property of the new node.
   * @param {NODE} oldNode - The `oldNode` parameter is of type `NODE` and represents the node that
   * needs to be replaced in a data structure.
   * @param {NODE} newNode - The `newNode` parameter is an object of type `NODE`.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, after updating the `count` property of the `newNode` object.
   */
  protected override _replaceNode(oldNode: NODE, newNode: NODE): NODE {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
