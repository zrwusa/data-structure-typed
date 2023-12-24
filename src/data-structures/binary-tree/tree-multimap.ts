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
  TreeMultimapNested,
  TreeMultimapNodeNested,
  TreeMultimapOptions
} from '../../types';
import { FamilyPosition, IterationType } from '../../types';
import { IBinaryTree } from '../../interfaces';
import { AVLTree, AVLTreeNode } from './avl-tree';

export class TreeMultimapNode<
  K = any,
  V = any,
  N extends TreeMultimapNode<K, V, N> = TreeMultimapNodeNested<K, V>
> extends AVLTreeNode<K, V, N> {
  count: number;

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
}

/**
 * The only distinction between a TreeMultimap and a AVLTree lies in the ability of the former to store duplicate nodes through the utilization of counters.
 */
export class TreeMultimap<
  K = any,
  V = any,
  N extends TreeMultimapNode<K, V, N> = TreeMultimapNode<K, V, TreeMultimapNodeNested<K, V>>,
  TREE extends TreeMultimap<K, V, N, TREE> = TreeMultimap<K, V, N, TreeMultimapNested<K, V, N>>
>
  extends AVLTree<K, V, N, TREE>
  implements IBinaryTree<K, V, N, TREE> {
  constructor(keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, N>> = [], options?: TreeMultimapOptions<K>) {
    super([], options);
    if (keysOrNodesOrEntries) this.addMany(keysOrNodesOrEntries);
  }

  private _count = 0;

  // TODO the _count is not accurate after nodes count modified
  get count(): number {
    let sum = 0;
    this.subTreeTraverse(node => (sum += node.count));
    return sum;
  }

  /**
   * The function creates a new BSTNode with the given key, value, and count.
   * @param {K} key - The key parameter is the unique identifier for the binary tree node. It is used to
   * distinguish one node from another in the tree.
   * @param {N} value - The `value` parameter represents the value that will be stored in the binary search tree node.
   * @param {number} [count] - The "count" parameter is an optional parameter of type number. It represents the number of
   * occurrences of the value in the binary search tree node. If not provided, the count will default to 1.
   * @returns A new instance of the BSTNode class with the specified key, value, and count (if provided).
   */
  override createNode(key: K, value?: V, count?: number): N {
    return new TreeMultimapNode(key, value, count) as N;
  }

  override createTree(options?: TreeMultimapOptions<K>): TREE {
    return new TreeMultimap<K, V, N, TREE>([], {
      iterationType: this.iterationType,
      variant: this.variant,
      ...options
    }) as TREE;
  }

  /**
   * The function `exemplarToNode` converts an keyOrNodeOrEntry object into a node object.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is of type `KeyOrNodeOrEntry<K, V, N>`, which means it
   * can be one of the following:
   * @param {V} [value] - The `value` parameter is an optional argument that represents the value
   * associated with the node. It is of type `V`, which can be any data type. If no value is provided,
   * it defaults to `undefined`.
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the value should be added to the node. If not provided, it defaults to 1.
   * @returns a node of type `N` or `undefined`.
   */
  override exemplarToNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, N>, value?: V, count = 1): N | undefined {
    let node: N | undefined;
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
    } else if (this.isNotNodeInstance(keyOrNodeOrEntry)) {
      node = this.createNode(keyOrNodeOrEntry, value, count);
    } else {
      return;
    }
    return node;
  }

  /**
   * The function checks if an keyOrNodeOrEntry is an instance of the TreeMultimapNode class.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter is of type `KeyOrNodeOrEntry<K, V, N>`.
   * @returns a boolean value indicating whether the keyOrNodeOrEntry is an instance of the TreeMultimapNode
   * class.
   */
  override isNode(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, N>): keyOrNodeOrEntry is N {
    return keyOrNodeOrEntry instanceof TreeMultimapNode;
  }

  /**
   * The function "isNotNodeInstance" checks if a potential key is a K.
   * @param {any} potentialKey - The potentialKey parameter is of type any, which means it can be any
   * data type.
   * @returns a boolean value indicating whether the potentialKey is of type number or not.
   */
  override isNotNodeInstance(potentialKey: KeyOrNodeOrEntry<K, V, N>): potentialKey is K {
    return !(potentialKey instanceof TreeMultimapNode);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   * logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (AVLTree) has logarithmic time complexity. constant space, as it doesn't use additional data structures that scale with input size.
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
  override add(keyOrNodeOrEntry: KeyOrNodeOrEntry<K, V, N>, value?: V, count = 1): boolean {
    const newNode = this.exemplarToNode(keyOrNodeOrEntry, value, count);
    if (newNode === undefined) return false;

    const orgNodeCount = newNode?.count || 0;
    const inserted = super.add(newNode);
    if (inserted) {
      this._count += orgNodeCount;
    }
    return true;
  }

  /**
   * Time Complexity: O(k log n)
   * Space Complexity: O(1)
   * logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (AVLTree) has logarithmic time complexity. constant space, as it doesn't use additional data structures that scale with input size.
   */

  /**
   * Time Complexity: O(k log n)
   * Space Complexity: O(1)
   *
   * The function overrides the addMany method to add multiple keys, nodes, or entries to a data
   * structure.
   * @param keysOrNodesOrEntries - The parameter `keysOrNodesOrEntries` is an iterable that can contain
   * either keys, nodes, or entries.
   * @returns The method is returning an array of type `N | undefined`.
   */
  override addMany(keysOrNodesOrEntries: Iterable<KeyOrNodeOrEntry<K, V, N>>): boolean[] {
    return super.addMany(keysOrNodesOrEntries);
  }

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   * logarithmic time for each insertion, where "n" is the number of nodes in the tree. This is because the method calls the add method for each node. linear space, as it creates an array to store the sorted nodes.
   */

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
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
   * Time Complexity: O(k log n)
   * Space Complexity: O(1)
   * logarithmic time for each insertion, where "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted. This is because the method iterates through the keys and calls the add method for each. constant space, as it doesn't use additional data structures that scale with input size.
   */

  /**
   * Time Complexity: O(k log n)
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
   * @returns an array of `BinaryTreeDeleteResult<N>`.
   */
  override delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C = this._defaultOneParamCallback as C,
    ignoreCount = false
  ): BinaryTreeDeleteResult<N>[] {
    const deletedResult: BinaryTreeDeleteResult<N>[] = [];
    if (!this.root) return deletedResult;

    const curr: N | undefined = this.getNode(identifier, callback) ?? undefined;
    if (!curr) return deletedResult;

    const parent: N | undefined = curr?.parent ? curr.parent : undefined;
    let needBalanced: N | undefined = undefined,
      orgCurrent: N | undefined = curr;

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
   * @param {K | N | undefined} srcNode - The `srcNode` parameter represents the source node from
   * which the values will be swapped. It can be of type `K`, `N`, or `undefined`.
   * @param {K | N | undefined} destNode - The `destNode` parameter represents the destination
   * node where the values from the source node will be swapped to.
   * @returns either the `destNode` object if both `srcNode` and `destNode` are defined, or `undefined`
   * if either `srcNode` or `destNode` is undefined.
   */
  protected override _swapProperties(srcNode: BSTNKeyOrNode<K, N>, destNode: BSTNKeyOrNode<K, N>): N | undefined {
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

  protected _replaceNode(oldNode: N, newNode: N): N {
    newNode.count = oldNode.count + newNode.count;
    return super._replaceNode(oldNode, newNode);
  }
}
