/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  AVLTreeMultiMapNested,
  AVLTreeMultiMapNodeNested,
  AVLTreeMultiMapOptions,
  BinaryTreeDeleteResult,
  BSTNOptKeyOrNode,
  BTNRep,
  IterationType
} from '../../types';
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
    R = object,
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
  implements IBinaryTree<K, V, R, NODE, TREE>
{
  /**
   * The constructor initializes a new AVLTreeMultiMap object with optional initial elements.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter is an
   * iterable object that can contain either keys, nodes, entries, or raw elements.
   * @param [options] - The `options` parameter is an optional object that can be used to customize the
   * behavior of the AVLTreeMultiMap. It can include properties such as `compareKeys` and
   * `compareValues` functions to define custom comparison logic for keys and values, respectively.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<R | BTNRep<K, V, NODE>> = [],
    options?: AVLTreeMultiMapOptions<K, V, R>
  ) {
    super([], options);
    if (keysNodesEntriesOrRaws) this.addMany(keysNodesEntriesOrRaws);
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
      isMapMode: this._isMapMode,
      comparator: this._comparator,
      toEntryFn: this._toEntryFn,
      ...options
    }) as TREE;
  }

  /**
   * The function checks if the input is an instance of AVLTreeMultiMapNode.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The parameter
   * `keyNodeEntryOrRaw` can be of type `R` or `BTNRep<K, V, NODE>`.
   * @returns a boolean value indicating whether the input parameter `keyNodeEntryOrRaw` is
   * an instance of the `AVLTreeMultiMapNode` class.
   */
  override isNode(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R): keyNodeEntryOrRaw is NODE {
    return keyNodeEntryOrRaw instanceof AVLTreeMultiMapNode;
  }

  /**
   * The function `keyValueNodeEntryRawToNodeAndValue` converts a key, value, entry, or raw element into
   * a node object.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The
   * `keyNodeEntryOrRaw` parameter can be of type `R` or `BTNRep<K, V, NODE>`.
   * @param {V} [value] - The `value` parameter is an optional value that can be passed to the
   * `override` function. It represents the value associated with the key in the data structure. If no
   * value is provided, it will default to `undefined`.
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the key-value pair should be added to the data structure. If not provided, it defaults to 1.
   * @returns either a NODE object or undefined.
   */
  override keyValueNodeEntryRawToNodeAndValue(
    keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R,
    value?: V,
    count = 1
  ): [NODE | undefined, V | undefined] {
    if (keyNodeEntryOrRaw === undefined || keyNodeEntryOrRaw === null) return [undefined, undefined];
    if (this.isNode(keyNodeEntryOrRaw)) return [keyNodeEntryOrRaw, value];

    if (this.isEntry(keyNodeEntryOrRaw)) {
      const [key, entryValue] = keyNodeEntryOrRaw;
      if (key === undefined || key === null) return [undefined, undefined];
      const finalValue = value ?? entryValue;
      return [this.createNode(key, finalValue, count), finalValue];
    }

    if (this.isKey(keyNodeEntryOrRaw)) return [this.createNode(keyNodeEntryOrRaw, value, count), value];

    if (this.isRaw(keyNodeEntryOrRaw)) {
      if (this._toEntryFn) {
        const [key, entryValue] = this._toEntryFn(keyNodeEntryOrRaw as R);
        const finalValue = value ?? entryValue;
        if (this.isKey(key)) return [this.createNode(key, finalValue, count), finalValue];
      }
      return [undefined, undefined];
    }

    return [undefined, undefined];
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the add method of a TypeScript class to add a new node to a data structure
   * and update the count.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The
   * `keyNodeEntryOrRaw` parameter can accept a value of type `R`, which can be any type. It
   * can also accept a value of type `BTNRep<K, V, NODE>`, which represents a key, node,
   * entry, or raw element
   * @param {V} [value] - The `value` parameter represents the value associated with the key in the
   * data structure. It is an optional parameter, so it can be omitted if not needed.
   * @param [count=1] - The `count` parameter represents the number of times the key-value pair should
   * be added to the data structure. By default, it is set to 1, meaning that the key-value pair will
   * be added once. However, you can specify a different value for `count` if you want to add
   * @returns a boolean value.
   */
  override add(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R, value?: V, count = 1): boolean {
    const [newNode, newValue] = this.keyValueNodeEntryRawToNodeAndValue(keyNodeEntryOrRaw, value, count);
    if (newNode === undefined) return false;

    const orgNodeCount = newNode?.count || 0;
    const inserted = super.add(newNode, newValue);
    if (inserted) {
      this._count += orgNodeCount;
    }
    return true;
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function overrides the delete method in a binary tree data structure, handling deletion of
   * nodes and maintaining balance in the tree.
   * @param {BTNRep<K, V, NODE> | R} keyNodeEntryOrRaw - The `predicate`
   * parameter in the `delete` method is used to specify the condition for deleting a node from the
   * binary tree. It can be a key, node, or entry that determines which
   * node(s) should be deleted.
   * @param [ignoreCount=false] - The `ignoreCount` parameter in the `override delete` method is a
   * boolean flag that determines whether to ignore the count of the node being deleted. If
   * `ignoreCount` is set to `true`, the method will delete the node regardless of its count. If
   * `ignoreCount` is set to
   * @returns The `delete` method overrides the default delete behavior in a binary tree data
   * structure. It takes a predicate or node to be deleted and an optional flag to ignore count. The
   * method returns an array of `BinaryTreeDeleteResult` objects, each containing information about the
   * deleted node and whether balancing is needed in the tree.
   */
  override delete(keyNodeEntryOrRaw: BTNRep<K, V, NODE> | R, ignoreCount = false): BinaryTreeDeleteResult<NODE>[] {
    const deletedResult: BinaryTreeDeleteResult<NODE>[] = [];
    if (!this.root) return deletedResult;

    const curr: NODE | undefined = this.getNode(keyNodeEntryOrRaw) ?? undefined;
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
        const leftSubTreeRightMost = curr.left ? this.getRightMost(node => node, curr.left) : undefined;
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
      this._size = this._size - 1;
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
  override clone(): TREE {
    const cloned = this.createTree();
    if (this._isMapMode) this.bfs(node => cloned.add(node.key, undefined, node.count));
    else this.bfs(node => cloned.add(node.key, node.value, node.count));
    if (this._isMapMode) cloned._store = this._store;
    return cloned;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `_swapProperties` function swaps the properties (key, value, count, height) between two nodes
   * in a binary search tree.
   * @param {R | BSTNOptKeyOrNode<K, NODE>} srcNode - The `srcNode` parameter represents the source node
   * that will be swapped with the `destNode`.
   * @param {R | BSTNOptKeyOrNode<K, NODE>} destNode - The `destNode` parameter represents the destination
   * node where the properties will be swapped with the source node.
   * @returns The method is returning the `destNode` after swapping its properties with the `srcNode`.
   * If either `srcNode` or `destNode` is undefined, it returns `undefined`.
   */
  protected override _swapProperties(
    srcNode: R | BSTNOptKeyOrNode<K, NODE>,
    destNode: R | BSTNOptKeyOrNode<K, NODE>
  ): NODE | undefined {
    srcNode = this.ensureNode(srcNode);
    destNode = this.ensureNode(destNode);
    if (srcNode && destNode) {
      const { key, value, count, height } = destNode;
      const tempNode = this.createNode(key, value, count);
      if (tempNode) {
        tempNode.height = height;

        destNode.key = srcNode.key;
        if (!this._isMapMode) destNode.value = srcNode.value;
        destNode.count = srcNode.count;
        destNode.height = srcNode.height;

        srcNode.key = tempNode.key;
        if (!this._isMapMode) srcNode.value = tempNode.value;
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
