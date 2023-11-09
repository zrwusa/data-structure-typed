/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {BTNKey, TreeMultimapNodeNested, TreeMultimapOptions} from '../../types';
import {BiTreeDeleteResult, BTNCallback, CP, FamilyPosition, IterationType} from '../../types';
import {IBinaryTree} from '../../interfaces';
import {AVLTree, AVLTreeNode} from './avl-tree';

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
export class TreeMultimap<V = any, N extends TreeMultimapNode<V, N> = TreeMultimapNode<V, TreeMultimapNodeNested<V>>>
  extends AVLTree<V, N>
  implements IBinaryTree<V, N>
{
  /**
   * The constructor function for a TreeMultimap class in TypeScript, which extends another class and sets an option to
   * merge duplicated values.
   * @param {TreeMultimapOptions} [options] - An optional object that contains additional configuration options for the
   * TreeMultimap.
   */
  constructor(options?: TreeMultimapOptions) {
    super(options);
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

  /**
   * The `add` function adds a new node to a binary search tree, updating the count if the key already
   * exists, and balancing the tree if necessary.
   * @param {BTNKey | N | undefined} keyOrNode - The `keyOrNode` parameter can be either a
   * `BTNKey` (which represents the key of the node to be added), a `N` (which represents a
   * node to be added), or `undefined` (which represents a undefined node).
   * @param [value] - The `value` parameter represents the value associated with the key that is being
   * added to the binary tree.
   * @param [count=1] - The `count` parameter represents the number of occurrences of the key/value
   * pair that will be added to the binary tree. It has a default value of 1, which means that if no
   * count is specified, the default count will be 1.
   * @returns The function `add` returns a value of type `N | undefined | undefined`.
   */
  override add(keyOrNode: BTNKey | N | null | undefined, value?: V, count = 1): N | undefined {
    if(keyOrNode === null) return undefined;
    let inserted: N  | undefined = undefined,
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
      newNode && this._setCount(this.count + newNode.count);
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
              this._setCount(this.count + newNode.count);
              traversing = false;
              inserted = cur;
            } else if (this._compare(cur.key, newNode.key) === CP.gt) {
              // Traverse left of the node
              if (cur.left === undefined) {
                //Add to the left of the current node
                cur.left = newNode;
                this._size = this.size + 1;
                this._setCount(this.count + newNode.count);

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
                this._setCount(this.count + newNode.count);

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
   * The function adds a new node to a binary tree if there is an available slot in the parent node.
   * @param {N | undefined} newNode - The `newNode` parameter represents the node that needs to be added to
   * the tree. It can be either a node object (`N`) or `undefined`.
   * @param {N} parent - The `parent` parameter represents the parent node to which the new node will
   * be added as a child.
   * @returns The method `_addTo` returns either the `parent.left`, `parent.right`, or `undefined`.
   */
  override _addTo(newNode: N | undefined, parent: N): N | undefined {
    if (parent) {
      if (parent.left === undefined) {
        parent.left = newNode;
        if (newNode !== undefined) {
          this._size = this.size + 1;
          this._setCount(this.count + newNode.count);
        }

        return parent.left;
      } else if (parent.right === undefined) {
        parent.right = newNode;
        if (newNode !== undefined) {
          this._size = this.size + 1;
          this._setCount(this.count + newNode.count);
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
   * The `addMany` function adds multiple keys or nodes to a TreeMultimap and returns an array of the
   * inserted nodes.
   * @param {(BTNKey | undefined)[] | (N | undefined)[]} keysOrNodes - An array of keys or nodes to be
   * added to the multiset. Each element can be either a BTNKey or a TreeMultimapNode.
   * @param {V[]} [data] - The `data` parameter is an optional array of values that correspond
   * to the keys or nodes being added to the multiset. It is used to associate additional data with
   * each key or node.
   * @returns The function `addMany` returns an array of `N`, `undefined`, or `undefined` values.
   */
  override addMany(keysOrNodes: (BTNKey | undefined)[] | (N | undefined)[], data?: V[]): (N | undefined)[] {
    const inserted: (N | undefined | undefined)[] = [];

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
   * The `perfectlyBalance` function in TypeScript takes a sorted array of nodes and builds a balanced
   * binary search tree using either a recursive or iterative approach.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when building a balanced binary search tree. It can have two possible
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
   * The `delete` function in a binary search tree deletes a node from the tree and returns the deleted
   * node along with the parent node that needs to be balanced.
   * @param {ReturnType<C>} identifier - The `identifier` parameter is either a
   * `BTNKey` or a generic type `N`. It represents the property of the node that we are
   * searching for. It can be a specific key value or any other property of the node.
   * @param callback - The `callback` parameter is a function that takes a node as input and returns a
   * value. This value is compared with the `identifier` parameter to determine if the node should be
   * included in the result. The `callback` parameter has a default value of
   * `this.defaultOneParamCallback`
   * @param [ignoreCount=false] - A boolean flag indicating whether to ignore the count of the node
   * being deleted. If set to true, the count of the node will not be considered and the node will be
   * deleted regardless of its count. If set to false (default), the count of the node will be
   * decremented by 1 and
   * @returns The method `delete` returns an array of `BiTreeDeleteResult<N>` objects.
   */
  override delete<C extends BTNCallback<N>>(
    identifier: ReturnType<C>,
    callback: C = this.defaultOneParamCallback as C,
    ignoreCount = false
  ): BiTreeDeleteResult<N>[] {
    const bstDeletedResult: BiTreeDeleteResult<N>[] = [];
    if (!this.root) return bstDeletedResult;

    const curr: N | undefined = this.getNode(identifier, callback) ?? undefined;
    if (!curr) return bstDeletedResult;

    const parent: N | undefined = curr?.parent ? curr.parent : undefined;
    let needBalanced: N | undefined = undefined,
      orgCurrent = curr;

    if (curr.count > 1 && !ignoreCount) {
      curr.count--;
      this._setCount(this.count - 1);
    } else {
      if (!curr.left) {
        if (!parent) {
          if (curr.right !== undefined) this._setRoot(curr.right);
        } else {
          const {familyPosition: fp} = curr;
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
      this._setCount(this.count - orgCurrent.count);
    }

    bstDeletedResult.push({deleted: orgCurrent, needBalanced});

    if (needBalanced) {
      this._balancePath(needBalanced);
    }

    return bstDeletedResult;
  }

  /**
   * The clear() function clears the contents of a data structure and sets the count to zero.
   */
  clear() {
    super.clear();
    this._setCount(0);
  }

  /**
   * The function swaps the values of two nodes in a binary tree.
   * @param {N} srcNode - The source node that needs to be swapped with the destination node.
   * @param {N} destNode - The `destNode` parameter represents the destination node where the values
   * from `srcNode` will be swapped into.
   * @returns The method is returning the `destNode` after swapping its properties with the `srcNode`.
   */
  protected override _swap(srcNode: N, destNode: N): N {
    const {key, value, count, height} = destNode;
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

  /**
   * The function sets the value of the "_count" property.
   * @param {number} v - number
   */
  protected _setCount(v: number) {
    this._count = v;
  }
}
