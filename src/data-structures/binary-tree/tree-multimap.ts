/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { BTNKey, TreeMultimapNodeNested, TreeMultimapOptions } from '../../types';
import { BiTreeDeleteResult, BTNCallback, CP, FamilyPosition, IterationType, TreeMultimapNested } from '../../types';
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

  override options: TreeMultimapOptions;

  /**
   * The constructor function for a TreeMultimap class in TypeScript, which extends another class and sets an option to
   * merge duplicated values.
   * @param {TreeMultimapOptions} [options] - An optional object that contains additional configuration options for the
   * TreeMultimap.
   */
  constructor(options: TreeMultimapOptions = { iterationType: IterationType.ITERATIVE }) {
    super(options);
    if (options) {
      this.options = { iterationType: IterationType.ITERATIVE, comparator: (a, b) => a - b, ...options }
    } else {
      this.options = { iterationType: IterationType.ITERATIVE, comparator: (a, b) => a - b };
    }
  }

  private _count = 0;

  get count(): number {
    return this._count;
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
    return new TreeMultimap<V, N, TREE>({ ...this.options, ...options }) as TREE;
  }

  /**
   * Time Complexity: O(log n) - logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (AVLTree) has logarithmic time complexity.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
   */

  /**
   * Time Complexity: O(log n) - logarithmic time, where "n" is the number of nodes in the tree. The add method of the superclass (AVLTree) has logarithmic time complexity.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
   *
   * The `add` function adds a new node to the tree multimap, updating the count if the key already
   * exists, and balances the tree if necessary.
   * @param {BTNKey | N | null | undefined} keyOrNode - The `keyOrNode` parameter can be one of the
   * following types:
   * @param {V} [value] - The `value` parameter represents the value associated with the key that is
   * being added to the tree. It is an optional parameter, so it can be omitted if not needed.
   * @param [count=1] - The `count` parameter is an optional parameter that specifies the number of
   * times the key-value pair should be added to the multimap. If not provided, the default value is 1.
   * @returns a node (`N`) or `undefined`.
   */
  override add(keyOrNode: BTNKey | N | null | undefined, value?: V, count = 1): N | undefined {
    if (keyOrNode === null) return undefined;
    let inserted: N | undefined = undefined,
      newNode: N | undefined;
    if (keyOrNode instanceof TreeMultimapNode) {
      newNode = this.createNode(keyOrNode.key, keyOrNode.value, keyOrNode.count);
    } else if (keyOrNode === undefined) {
      newNode = undefined;
    } else {
      newNode = this.createNode(keyOrNode, value, count);
    }
    if (!this.root) {
      this._setRoot(newNode);
      this._size = this.size + 1;
      if (newNode) this._count += newNode.count;
      inserted = this.root;
    } else {
      let cur = this.root;
      let traversing = true;
      while (traversing) {
        if (cur) {
          if (newNode) {
            if (this._compare(cur.key, newNode.key) === CP.eq) {
              cur.value = newNode.value;
              cur.count += newNode.count;
              this._count += newNode.count;
              traversing = false;
              inserted = cur;
            } else if (this._compare(cur.key, newNode.key) === CP.gt) {
              // Traverse left of the node
              if (cur.left === undefined) {
                //Add to the left of the current node
                cur.left = newNode;
                this._size = this.size + 1;
                this._count += newNode.count;

                traversing = false;
                inserted = cur.left;
              } else {
                //Traverse the left of the current node
                if (cur.left) cur = cur.left;
              }
            } else if (this._compare(cur.key, newNode.key) === CP.lt) {
              // Traverse right of the node
              if (cur.right === undefined) {
                //Add to the right of the current node
                cur.right = newNode;
                this._size = this.size + 1;
                this._count += newNode.count;

                traversing = false;
                inserted = cur.right;
              } else {
                //Traverse the left of the current node
                if (cur.right) cur = cur.right;
              }
            }
          } else {
            // TODO may need to support undefined inserted
          }
        } else {
          traversing = false;
        }
      }
    }
    if (inserted) this._balancePath(inserted);
    return inserted;
  }

  /**
   * Time Complexity: O(1) - constant time, as it performs basic pointer assignments.
   * Space Complexity: O(1) - constant space, as it only uses a constant amount of memory.
   */

  /**
   * Time Complexity: O(k log n) - logarithmic time for each insertion, where "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted. This is because the method iterates through the keys and calls the add method for each.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
   *
   * The function `addMany` takes an array of keys or nodes and adds them to the TreeMultimap,
   * returning an array of the inserted nodes.
   * @param {(BTNKey | N | undefined)[]} keysOrNodes - An array of keys or nodes. Each element can be
   * of type BTNKey, N, or undefined.
   * @param {V[]} [data] - The `data` parameter is an optional array of values that correspond to the
   * keys or nodes being added. It is used to associate data with each key or node being added to the
   * TreeMultimap. If provided, the length of the `data` array should be the same as the length of the
   * @returns The function `addMany` returns an array of nodes (`N`) or `undefined` values.
   */
  override addMany(keysOrNodes: (BTNKey | N | undefined)[], data?: V[]): (N | undefined)[] {
    const inserted: (N | undefined)[] = [];

    for (let i = 0; i < keysOrNodes.length; i++) {
      const keyOrNode = keysOrNodes[i];

      if (keyOrNode instanceof TreeMultimapNode) {
        inserted.push(this.add(keyOrNode.key, keyOrNode.value, keyOrNode.count));
        continue;
      }

      if (keyOrNode === undefined) {
        inserted.push(this.add(NaN, undefined, 0));
        continue;
      }

      inserted.push(this.add(keyOrNode, data?.[i], 1));
    }
    return inserted;
  }

  /**
   * Time Complexity: O(k log n) - logarithmic time for each insertion, where "n" is the number of nodes in the tree, and "k" is the number of keys to be inserted. This is because the method iterates through the keys and calls the add method for each.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
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
  override perfectlyBalance(iterationType = this.options.iterationType): boolean {
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
   * Time Complexity: O(n log n) - logarithmic time for each insertion, where "n" is the number of nodes in the tree. This is because the method calls the add method for each node.
   * Space Complexity: O(n) - linear space, as it creates an array to store the sorted nodes.
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
          orgCurrent = this._swap(curr, leftSubTreeRightMost);
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
   * Time Complexity: O(log n) - logarithmic time, where "n" is the number of nodes in the tree. The delete method of the superclass (AVLTree) has logarithmic time complexity.
   * Space Complexity: O(1) - constant space, as it doesn't use additional data structures that scale with input size.
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
  protected override _addTo(newNode: N | undefined, parent: BTNKey | N | undefined): N | undefined {
    parent = this.ensureNotKey(parent);
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
   * The `_swap` function swaps the key, value, count, and height properties between two nodes.
   * @param {BTNKey | N | undefined} srcNode - The `srcNode` parameter represents the source node from
   * which the values will be swapped. It can be of type `BTNKey`, `N`, or `undefined`.
   * @param {BTNKey | N | undefined} destNode - The `destNode` parameter represents the destination
   * node where the values from the source node will be swapped to.
   * @returns either the `destNode` object if both `srcNode` and `destNode` are defined, or `undefined`
   * if either `srcNode` or `destNode` is undefined.
   */
  protected _swap(srcNode: BTNKey | N | undefined, destNode: BTNKey | N | undefined): N | undefined {
    srcNode = this.ensureNotKey(srcNode);
    destNode = this.ensureNotKey(destNode);
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
}
