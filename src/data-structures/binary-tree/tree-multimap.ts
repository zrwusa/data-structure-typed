/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  BSTNodeKeyOrNode,
  BTNKey,
  BTNodeExemplar,
  TreeMultimapNodeNested,
  TreeMultimapOptions
} from '../../types';
import { BiTreeDeleteResult, BTNCallback, FamilyPosition, IterationType, TreeMultimapNested } from '../../types';
import { IBinaryTree } from '../../interfaces';
import { AVLTree, AVLTreeNode } from './avl-tree';

export class TreeMultimapNode<
  V = any,
  N extends TreeMultimapNode<V, N> = TreeMultimapNodeNested<V>
> extends AVLTreeNode<V, N> {
  count: number;

  /**
   * The constructor function initializes a BinaryTreeNode object with a key, value, and count.
   * @param {BTNKey} key - The `key` parameter is of type `BTNKey` and represents the unique identifier
   * of the binary tree node.
   * @param {V} [value] - The `value` parameter is an optional parameter of type `V`. It represents the value of the binary
   * tree node. If no value is provided, it will be `undefined`.
   * @param {number} [count=1] - The `count` parameter is a number that represents the number of times a particular value
   * occurs in a binary tree node. It has a default value of 1, which means that if no value is provided for the `count`
   * parameter when creating a new instance of the `BinaryTreeNode` class.
   */
  constructor(key: BTNKey, value?: V, count = 1) {
    super(key, value);
    this.count = count;
  }
}

/**
 * The only distinction between a TreeMultimap and a AVLTree lies in the ability of the former to store duplicate nodes through the utilization of counters.
 */
export class TreeMultimap<V = any, N extends TreeMultimapNode<V, N> = TreeMultimapNode<V, TreeMultimapNodeNested<V>>,
  TREE extends TreeMultimap<V, N, TREE> = TreeMultimap<V, N, TreeMultimapNested<V, N>>>
  extends AVLTree<V, N, TREE>
  implements IBinaryTree<V, N, TREE> {

  constructor(elements?: Iterable<BTNodeExemplar<V, N>>, options?: Partial<TreeMultimapOptions>) {
    super([], options);
    if (elements) this.addMany(elements);
  }

  private _count = 0;

  // TODO the _count is not accurate after nodes count modified
  get count(): number {
    let sum = 0;
    this.subTreeTraverse(node => sum += node.count);
    return sum;
  }

  /**
   * The function creates a new BSTNode with the given key, value, and count.
   * @param {BTNKey} key - The key parameter is the unique identifier for the binary tree node. It is used to
   * distinguish one node from another in the tree.
   * @param {N} value - The `value` parameter represents the value that will be stored in the binary search tree node.
   * @param {number} [count] - The "count" parameter is an optional parameter of type number. It represents the number of
   * occurrences of the value in the binary search tree node. If not provided, the count will default to 1.
   * @returns A new instance of the BSTNode class with the specified key, value, and count (if provided).
   */
  override createNode(key: BTNKey, value?: V, count?: number): N {
    return new TreeMultimapNode(key, value, count) as N;
  }

  override createTree(options?: TreeMultimapOptions): TREE {
    return new TreeMultimap<V, N, TREE>([], {
      iterationType: this.iterationType,
      comparator: this.comparator, ...options
    }) as TREE;
  }

  /**
   * The function checks if an exemplar is an instance of the TreeMultimapNode class.
   * @param exemplar - The `exemplar` parameter is of type `BTNodeExemplar<V, N>`.
   * @returns a boolean value indicating whether the exemplar is an instance of the TreeMultimapNode
   * class.
   */
  override isNode(exemplar: BTNodeExemplar<V, N>): exemplar is N {
    return exemplar instanceof TreeMultimapNode;
  }

  /**
   * The function `exemplarToNode` converts an exemplar object into a node object.
   * @param exemplar - The `exemplar` parameter is of type `BTNodeExemplar<V, N>`, where `V` represents
   * the value type and `N` represents the node type.
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the node should be created. If not provided, it defaults to 1.
   * @returns a value of type `N` (the generic type parameter) or `undefined`.
   */
  override exemplarToNode(exemplar: BTNodeExemplar<V, N>, count = 1): N | undefined {
    let node: N | undefined;
    if (exemplar === undefined || exemplar === null) {
      return;
    } else if (this.isNode(exemplar)) {
      node = exemplar;
    } else if (this.isEntry(exemplar)) {
      const [key, value] = exemplar;
      if (key === undefined || key === null) {
        return;
      } else {
        node = this.createNode(key, value, count);
      }
    } else if (this.isNodeKey(exemplar)) {
      node = this.createNode(exemplar, undefined, count);
    } else {
      return;
    }
    return node;
  }

  /**
   * Time Complexity: O(log n) - logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (AVLTree) has logarithmic time complexity.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
   */

  /**
   * Time Complexity: O(log n) - logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (AVLTree) has logarithmic time complexity.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
   *
   * The `add` function overrides the base class `add` function to add a new node to the tree multimap
   * and update the count.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can be one of the following:
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the key or node or entry should be added to the multimap. If not provided, the default value
   * is 1.
   * @returns either a node (`N`) or `undefined`.
   */
  override add(keyOrNodeOrEntry: BTNodeExemplar<V, N>, count = 1): N | undefined {
    const newNode = this.exemplarToNode(keyOrNodeOrEntry, count);
    if (newNode === undefined) return;

    const orgNodeCount = newNode?.count || 0;
    const inserted = super.add(newNode);
    if (inserted) {
      this._count += orgNodeCount;
    }
    return inserted;
  }

  /**
   * Time Complexity: O(k log n) - logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (AVLTree) has logarithmic time complexity.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
   */

  /**
   * Time Complexity: O(k log n) - logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (AVLTree) has logarithmic time complexity.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
   *
   * The function overrides the addMany method to add multiple keys, nodes, or entries to a data
   * structure.
   * @param keysOrNodesOrEntries - The parameter `keysOrNodesOrEntries` is an iterable that can contain
   * either keys, nodes, or entries.
   * @returns The method is returning an array of type `N | undefined`.
   */
  override addMany(keysOrNodesOrEntries: Iterable<BTNodeExemplar<V, N>>): (N | undefined)[] {
    return super.addMany(keysOrNodesOrEntries);
  }

  /**
   * Time Complexity: O(1) - constant time, as it performs basic pointer assignments.
   * Space Complexity: O(1) - constant space, as it only uses a constant amount of memory.
   */

  /**
   * Time Complexity: O(n log n) - logarithmic time for each insertion, where "n" is the number of nodes in the tree. This is because the method calls the add method for each node.
   * Space Complexity: O(n) - linear space, as it creates an array to store the sorted nodes.
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
        this.add([midNode.key, midNode.value], midNode.count);
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
            this.add([midNode.key, midNode.value], midNode.count);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
      return true;
    }
  }

  /**
   * Time Complexity: O(k log n) - logarithmic time for each insertion, where "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted. This is because the method iterates through the keys and calls the add method for each.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
   */

  /**
   * Time Complexity: O(log n) - logarithmic time, where "n" is the number of nodes in the tree. The delete method of the superclass (AVLTree) has logarithmic time complexity.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
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
   * @returns an array of `BiTreeDeleteResult<N>`.
   */
  override delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C = this._defaultOneParamCallback as C,
    ignoreCount = false
  ): BiTreeDeleteResult<N>[] {
    const deletedResult: BiTreeDeleteResult<N>[] = [];
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
   * Time Complexity: O(n log n) - logarithmic time for each insertion, where "n" is the number of nodes in the tree. This is because the method calls the add method for each node.
   * Space Complexity: O(n) - linear space, as it creates an array to store the sorted nodes.
   */

  /**
   * The clear() function clears the contents of a data structure and sets the count to zero.
   */
  override clear() {
    super.clear();
    this._count = 0;
  }

  /**
   * Time Complexity: O(1) - constant time, as it performs basic pointer assignments.
   * Space Complexity: O(1) - constant space, as it only uses a constant amount of memory.
   *
   * The function adds a new node to a binary tree, either as the left child or the right child of a
   * given parent node.
   * @param {N | undefined} newNode - The `newNode` parameter represents the node that needs to be
   * added to the binary tree. It can be of type `N` (which represents a node in the binary tree) or
   * `undefined` if there is no node to add.
   * @param {BTNKey | N | undefined} parent - The `parent` parameter represents the parent node to
   * which the new node will be added as a child. It can be either a node object (`N`) or a key value
   * (`BTNKey`).
   * @returns The method `_addTo` returns either the `parent.left` or `parent.right` node that was
   * added, or `undefined` if no node was added.
   */
  protected override _addTo(newNode: N | undefined, parent: BSTNodeKeyOrNode<N>): N | undefined {
    parent = this.ensureNode(parent);
    if (parent) {
      if (parent.left === undefined) {
        parent.left = newNode;
        if (newNode !== undefined) {
          this._size = this.size + 1;
          this._count += newNode.count;
        }

        return parent.left;
      } else if (parent.right === undefined) {
        parent.right = newNode;
        if (newNode !== undefined) {
          this._size = this.size + 1;
          this._count += newNode.count;
        }
        return parent.right;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  /**
   * The `_swapProperties` function swaps the key, value, count, and height properties between two nodes.
   * @param {BTNKey | N | undefined} srcNode - The `srcNode` parameter represents the source node from
   * which the values will be swapped. It can be of type `BTNKey`, `N`, or `undefined`.
   * @param {BTNKey | N | undefined} destNode - The `destNode` parameter represents the destination
   * node where the values from the source node will be swapped to.
   * @returns either the `destNode` object if both `srcNode` and `destNode` are defined, or `undefined`
   * if either `srcNode` or `destNode` is undefined.
   */
  protected override _swapProperties(srcNode: BSTNodeKeyOrNode<N>, destNode: BSTNodeKeyOrNode<N>): N | undefined {
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
    newNode.count = oldNode.count + newNode.count
    return super._replaceNode(oldNode, newNode);
  }
}
