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
  BTNKeyOrNodeOrEntry,
  IterationType
} from '../../types';
import { BTNEntry } from '../../types';
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
  R = BTNEntry<K, V>,
  NODE extends AVLTreeMultiMapNode<K, V, NODE> = AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNodeNested<K, V>>,
  TREE extends AVLTreeMultiMap<K, V, R, NODE, TREE> = AVLTreeMultiMap<
    K,
    V,
    R,
    NODE,
    AVLTreeMultiMapNested<K, V, R, NODE>
  >
>
  extends AVLTree<K, V, R, NODE, TREE>
  implements IBinaryTree<K, V, R, NODE, TREE> {
  /**
   * The constructor initializes a new AVLTreeMultiMap object with optional initial elements.
   * @param keysOrNodesOrEntriesOrRawElements - The `keysOrNodesOrEntriesOrRawElements` parameter is an
   * iterable object that can contain either keys, nodes, entries, or raw elements.
   * @param [options] - The `options` parameter is an optional object that can be used to customize the
   * behavior of the AVLTreeMultiMap. It can include properties such as `compareKeys` and
   * `compareValues` functions to define custom comparison logic for keys and values, respectively.
   */
  constructor(
    keysOrNodesOrEntriesOrRawElements: Iterable<R | BTNKeyOrNodeOrEntry<K, V, NODE>> = [],
    options?: AVLTreeMultiMapOptions<K, V, R>
  ) {
    super([], options);
    if (keysOrNodesOrEntriesOrRawElements) this.addMany(keysOrNodesOrEntriesOrRawElements);
  }

  protected _count = 0;

  /**
   * The function calculates the sum of the count property of all nodes in a tree using depth-first
   * search.
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
   * The function creates a new AVLTreeMultiMapNode with the specified key, value, and count.
   * @param {K} key - The key parameter represents the key of the node being created. It is of type K,
   * which is a generic type that can be replaced with any specific type when using the function.
   * @param {V} [value] - The `value` parameter is an optional parameter that represents the value
   * associated with the key in the node. It is of type `V`, which can be any data type.
   * @param {number} [count] - The `count` parameter represents the number of occurrences of a
   * key-value pair in the AVLTreeMultiMapNode. It is an optional parameter, so it can be omitted when
   * calling the `createNode` method. If provided, it specifies the initial count for the node.
   * @returns a new instance of the AVLTreeMultiMapNode class, casted as NODE.
   */
  override createNode(key: K, value?: V, count?: number): NODE {
    return new AVLTreeMultiMapNode(key, value, count) as NODE;
  }

  /**
   * The function creates a new AVLTreeMultiMap object with the specified options and returns it.
   * @param [options] - The `options` parameter is an optional object that contains additional
   * configuration options for creating the AVLTreeMultiMap. It can have the following properties:
   * @returns a new instance of the AVLTreeMultiMap class, with the specified options, as a TREE
   * object.
   */
  override createTree(options?: AVLTreeMultiMapOptions<K, V, R>): TREE {
    return new AVLTreeMultiMap<K, V, R, NODE, TREE>([], {
      iterationType: this.iterationType,
      comparator: this.comparator,
      ...options
    }) as TREE;
  }

  /**
   * The function checks if the input is an instance of AVLTreeMultiMapNode.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The parameter
   * `keyOrNodeOrEntryOrRawElement` can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyOrNodeOrEntryOrRawElement` is
   * an instance of the `AVLTreeMultiMapNode` class.
   */
  override isNode(
    keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>
  ): keyOrNodeOrEntryOrRawElement is NODE {
    return keyOrNodeOrEntryOrRawElement instanceof AVLTreeMultiMapNode;
  }

  /**
   * The function `keyValueOrEntryOrRawElementToNode` converts a key, value, entry, or raw element into
   * a node object.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The
   * `keyOrNodeOrEntryOrRawElement` parameter can be of type `R` or `BTNKeyOrNodeOrEntry<K, V, NODE>`.
   * @param {V} [value] - The `value` parameter is an optional value that can be passed to the
   * `override` function. It represents the value associated with the key in the data structure. If no
   * value is provided, it will default to `undefined`.
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
      const [key, entryValue] = this.toEntryFn(keyOrNodeOrEntryOrRawElement as R);
      if (key) return this.createNode(key, entryValue ?? value, count);
    }

    if (this.isEntry(keyOrNodeOrEntryOrRawElement)) {
      const [key, value] = keyOrNodeOrEntryOrRawElement;
      if (key === undefined || key === null) return;
      else return this.createNode(key, value, count);
    }

    if (this.isKey(keyOrNodeOrEntryOrRawElement)) return this.createNode(keyOrNodeOrEntryOrRawElement, value, count);

    return;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the add method of a TypeScript class to add a new node to a data structure
   * and update the count.
   * @param {R | BTNKeyOrNodeOrEntry<K, V, NODE>} keyOrNodeOrEntryOrRawElement - The
   * `keyOrNodeOrEntryOrRawElement` parameter can accept a value of type `R`, which can be any type. It
   * can also accept a value of type `BTNKeyOrNodeOrEntry<K, V, NODE>`, which represents a key, node,
   * entry, or raw element
   * @param {V} [value] - The `value` parameter represents the value associated with the key in the
   * data structure. It is an optional parameter, so it can be omitted if not needed.
   * @param [count=1] - The `count` parameter represents the number of times the key-value pair should
   * be added to the data structure. By default, it is set to 1, meaning that the key-value pair will
   * be added once. However, you can specify a different value for `count` if you want to add
   * @returns a boolean value.
   */
  override add(keyOrNodeOrEntryOrRawElement: R | BTNKeyOrNodeOrEntry<K, V, NODE>, value?: V, count = 1): boolean {
    const newNode = this.keyValueOrEntryOrRawElementToNode(keyOrNodeOrEntryOrRawElement, value, count);
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
   * The `delete` function in a binary tree data structure deletes a node based on its identifier and
   * returns the deleted node along with the parent node that needs to be balanced.
   * @param identifier - The identifier parameter is the value used to identify the node that needs to
   * be deleted from the binary tree. It can be of any type and is the return type of the callback
   * function.
   * @param {C} callback - The `callback` parameter is a function that is used to determine the
   * equality of nodes in the binary tree. It is optional and has a default value of
   * `this._DEFAULT_CALLBACK`. The `callback` function takes a single argument, which is the identifier
   * of a node, and returns a value that
   * @param [ignoreCount=false] - A boolean flag indicating whether to ignore the count of the node
   * being deleted. If set to true, the count of the node will not be considered and the node will be
   * deleted regardless of its count. If set to false (default), the count of the node will be taken
   * into account and the node
   * @returns an array of `BinaryTreeDeleteResult<NODE>`.
   */
  override delete<C extends BTNCallback<NODE>>(
    identifier: ReturnType<C>,
    callback: C = this._DEFAULT_CALLBACK as C,
    ignoreCount = false
  ): BinaryTreeDeleteResult<NODE>[] {
    const deletedResult: BinaryTreeDeleteResult<NODE>[] = [];
    if (!this.root) return deletedResult;
    callback = this._ensureCallback(identifier, callback);

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
          if (fp === 'LEFT' || fp === 'ROOT_LEFT') {
            parent.left = curr.right;
          } else if (fp === 'RIGHT' || fp === 'ROOT_RIGHT') {
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
   * The `perfectlyBalance` function takes a sorted array of nodes and builds a balanced binary search
   * tree using either a recursive or iterative approach.
   * @param {IterationType} iterationType - The `iterationType` parameter is an optional parameter that
   * specifies the type of iteration to use when building the balanced binary search tree. It has a
   * default value of `this.iterationType`, which means it will use the iteration type currently set in
   * the object.
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
   * The `_swapProperties` function swaps the properties (key, value, count, height) between two nodes
   * in a binary search tree.
   * @param {R | BSTNKeyOrNode<K, NODE>} srcNode - The `srcNode` parameter represents the source node
   * that will be swapped with the `destNode`.
   * @param {R | BSTNKeyOrNode<K, NODE>} destNode - The `destNode` parameter represents the destination
   * node where the properties will be swapped with the source node.
   * @returns The method is returning the `destNode` after swapping its properties with the `srcNode`.
   * If either `srcNode` or `destNode` is undefined, it returns `undefined`.
   */
  protected override _swapProperties(
    srcNode: R | BSTNKeyOrNode<K, NODE>,
    destNode: R | BSTNKeyOrNode<K, NODE>
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function replaces an old node with a new node and updates the count property of the new node.
   * @param {NODE} oldNode - The oldNode parameter represents the node that needs to be replaced in the
   * data structure. It is of type NODE.
   * @param {NODE} newNode - The `newNode` parameter is an instance of the `NODE` class.
   * @returns The method is returning the result of calling the `_replaceNode` method from the
   * superclass, which is of type `NODE`.
   */
  protected override _replaceNode(oldNode: NODE, newNode: NODE): NODE {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
