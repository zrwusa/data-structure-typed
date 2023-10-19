/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {BinaryTreeNodeKey, TreeMultisetNodeNested, TreeMultisetOptions} from '../../types';
import {BinaryTreeDeletedResult, CP, DFSOrderPattern, FamilyPosition, LoopType} from '../../types';
import {IBinaryTree} from '../../interfaces';
import {AVLTree, AVLTreeNode} from './avl-tree';

export class TreeMultisetNode<
  V = any,
  FAMILY extends TreeMultisetNode<V, FAMILY> = TreeMultisetNodeNested<V>
> extends AVLTreeNode<V, FAMILY> {
  /**
   * The constructor function initializes a BinaryTreeNode object with a key, value, and count.
   * @param {BinaryTreeNodeKey} key - The `key` parameter is of type `BinaryTreeNodeKey` and represents the unique identifier
   * of the binary tree node.
   * @param {V} [val] - The `val` parameter is an optional parameter of type `V`. It represents the value of the binary
   * tree node. If no value is provided, it will be `undefined`.
   * @param {number} [count=1] - The `count` parameter is a number that represents the number of times a particular value
   * occurs in a binary tree node. It has a default value of 1, which means that if no value is provided for the `count`
   * parameter when creating a new instance of the `BinaryTreeNode` class.
   */
  constructor(key: BinaryTreeNodeKey, val?: V, count = 1) {
    super(key, val);
    this.count = count;
  }

  count: number;
}

/**
 * The only distinction between a TreeMultiset and a AVLTree lies in the ability of the former to store duplicate nodes through the utilization of counters.
 */
export class TreeMultiset<N extends TreeMultisetNode<N['val'], N> = TreeMultisetNode>
  extends AVLTree<N>
  implements IBinaryTree<N>
{
  /**
   * The constructor function for a TreeMultiset class in TypeScript, which extends another class and sets an option to
   * merge duplicated values.
   * @param {TreeMultisetOptions} [options] - An optional object that contains additional configuration options for the
   * TreeMultiset.
   */
  constructor(options?: TreeMultisetOptions) {
    super(options);
  }

  private _count = 0;

  get count(): number {
    return this._count;
  }

  /**
   * The function creates a new BSTNode with the given key, value, and count.
   * @param {BinaryTreeNodeKey} key - The key parameter is the unique identifier for the binary tree node. It is used to
   * distinguish one node from another in the tree.
   * @param {N} val - The `val` parameter represents the value that will be stored in the binary search tree node.
   * @param {number} [count] - The "count" parameter is an optional parameter of type number. It represents the number of
   * occurrences of the value in the binary search tree node. If not provided, the count will default to 1.
   * @returns A new instance of the BSTNode class with the specified key, value, and count (if provided).
   */
  override createNode(key: BinaryTreeNodeKey, val?: N['val'], count?: number): N {
    return new TreeMultisetNode(key, val, count) as N;
  }

  /**
   * The function swaps the location of two nodes in a tree data structure.
   * @param {N} srcNode - The source node that we want to swap with the destination node.
   * @param {N} destNode - The `destNode` parameter represents the destination node where the values from `srcNode` will
   * be swapped with.
   * @returns the `destNode` after swapping its values with the `srcNode`.
   */
  override swapLocation(srcNode: N, destNode: N): N {
    const {key, val, count, height} = destNode;
    const tempNode = this.createNode(key, val, count);
    if (tempNode) {
      tempNode.height = height;

      destNode.key = srcNode.key;
      destNode.val = srcNode.val;
      destNode.count = srcNode.count;
      destNode.height = srcNode.height;

      srcNode.key = tempNode.key;
      srcNode.val = tempNode.val;
      srcNode.count = tempNode.count;
      srcNode.height = tempNode.height;
    }

    return destNode;
  }

  /**
   * The `add` function adds a new node to a binary search tree, maintaining the tree's properties and balancing if
   * necessary.
   * @param {BinaryTreeNodeKey | N} keyOrNode - The `keyOrNode` parameter can be either a `BinaryTreeNodeKey` or a `N` (which
   * represents a `BinaryTreeNode`).
   * @param [val] - The `val` parameter represents the value to be added to the binary tree node.
   * @param {number} [count] - The `count` parameter is an optional parameter that specifies the number of times the
   * value should be added to the binary tree. If the `count` parameter is not provided, it defaults to 1.
   * @returns The method `add` returns either the inserted node (`N`), `null`, or `undefined`.
   */
  override add(keyOrNode: BinaryTreeNodeKey | N | null, val?: N['val'], count = 1): N | null | undefined {
    let inserted: N | null | undefined = undefined,
      newNode: N | null;
    if (keyOrNode instanceof TreeMultisetNode) {
      newNode = this.createNode(keyOrNode.key, keyOrNode.val, keyOrNode.count);
    } else if (keyOrNode === null) {
      newNode = null;
    } else {
      newNode = this.createNode(keyOrNode, val, count);
    }
    if (!this.root) {
      this._setRoot(newNode);
      this._setSize(this.size + 1);
      newNode && this._setCount(this.count + newNode.count);
      inserted = this.root;
    } else {
      let cur = this.root;
      let traversing = true;
      while (traversing) {
        if (cur) {
          if (newNode) {
            if (this._compare(cur.key, newNode.key) === CP.eq) {
              cur.val = newNode.val;
              cur.count += newNode.count;
              this._setCount(this.count + newNode.count);
              traversing = false;
              inserted = cur;
            } else if (this._compare(cur.key, newNode.key) === CP.gt) {
              // Traverse left of the node
              if (cur.left === undefined) {
                //Add to the left of the current node
                cur.left = newNode;
                this._setSize(this.size + 1);
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
                this._setSize(this.size + 1);
                this._setCount(this.count + newNode.count);

                traversing = false;
                inserted = cur.right;
              } else {
                //Traverse the left of the current node
                if (cur.right) cur = cur.right;
              }
            }
          } else {
            // TODO may need to support null inserted
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
   * The function adds a new node to a binary tree if there is an available slot on the left or right side of the parent
   * node.
   * @param {N | null} newNode - The `newNode` parameter represents the node that needs to be added to the tree. It can
   * be either a node object (`N`) or `null`.
   * @param {N} parent - The `parent` parameter represents the parent node to which the new node will be added as a
   * child.
   * @returns The method returns either the `parent.left`, `parent.right`, or `undefined`.
   */
  override _addTo(newNode: N | null, parent: N): N | null | undefined {
    if (parent) {
      if (parent.left === undefined) {
        parent.left = newNode;
        if (newNode !== null) {
          this._setSize(this.size + 1);
          this._setCount(this.count + newNode.count);
        }

        return parent.left;
      } else if (parent.right === undefined) {
        parent.right = newNode;
        if (newNode !== null) {
          this._setSize(this.size + 1);
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
   * The `addMany` function takes an array of node IDs or nodes and adds them to the tree multiset, returning an array of
   * the inserted nodes.
   * @param {(BinaryTreeNodeKey | null)[] | (N | null)[]} keysOrNodes - An array of BinaryTreeNodeKey or BinaryTreeNode
   * objects, or null values.
   * @param {N['val'][]} [data] - The `data` parameter is an optional array of values (`N['val'][]`) that corresponds to
   * the nodes being added. It is used when adding nodes using the `keyOrNode` and `data` arguments in the `this.add()`
   * method. If provided, the `data` array should
   * @returns The function `addMany` returns an array of `N`, `null`, or `undefined` values.
   */
  override addMany(
    keysOrNodes: (BinaryTreeNodeKey | null)[] | (N | null)[],
    data?: N['val'][]
  ): (N | null | undefined)[] {
    const inserted: (N | null | undefined)[] = [];

    for (let i = 0; i < keysOrNodes.length; i++) {
      const keyOrNode = keysOrNodes[i];

      if (keyOrNode instanceof TreeMultisetNode) {
        inserted.push(this.add(keyOrNode.key, keyOrNode.val, keyOrNode.count));
        continue;
      }

      if (keyOrNode === null) {
        inserted.push(this.add(NaN, null, 0));
        continue;
      }

      inserted.push(this.add(keyOrNode, data?.[i], 1));
    }
    return inserted;
  }

  /**
   * The `perfectlyBalance` function takes a binary tree, performs a depth-first search to sort the nodes, and then
   * constructs a balanced binary search tree using either a recursive or iterative approach.
   * @returns The function `perfectlyBalance()` returns a boolean value.
   */
  override perfectlyBalance(): boolean {
    const sorted = this.dfs('in', 'node'),
      n = sorted.length;
    if (sorted.length < 1) return false;

    this.clear();

    if (this.loopType === LoopType.RECURSIVE) {
      const buildBalanceBST = (l: number, r: number) => {
        if (l > r) return;
        const m = l + Math.floor((r - l) / 2);
        const midNode = sorted[m];
        this.add(midNode.key, midNode.val, midNode.count);
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
            this.add(midNode.key, midNode.val, midNode.count);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
      return true;
    }
  }

  /**
   * The `remove` function removes a node from a binary search tree and returns the deleted node along with the parent
   * node that needs to be balanced.
   * @param {N | BinaryTreeNodeKey | null} nodeOrKey - The `nodeOrKey` parameter can be one of the following:
   * @param {boolean} [ignoreCount] - The `ignoreCount` parameter is an optional boolean parameter that determines
   * whether to ignore the count of the node being removed. If `ignoreCount` is set to `true`, the count of the node will
   * not be taken into account when removing it. If `ignoreCount` is set to `false
   * @returns The function `remove` returns an array of `BinaryTreeDeletedResult<N>` objects.
   */
  override remove(nodeOrKey: N | BinaryTreeNodeKey, ignoreCount = false): BinaryTreeDeletedResult<N>[] {
    const bstDeletedResult: BinaryTreeDeletedResult<N>[] = [];
    if (!this.root) return bstDeletedResult;

    const curr: N | null = this.get(nodeOrKey);
    if (!curr) return bstDeletedResult;

    const parent: N | null = curr?.parent ? curr.parent : null;
    let needBalanced: N | null = null,
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
        const leftSubTreeRightMost = curr.left ? this.getRightMost(curr.left) : null;
        if (leftSubTreeRightMost) {
          const parentOfLeftSubTreeMax = leftSubTreeRightMost.parent;
          orgCurrent = this.swapLocation(curr, leftSubTreeRightMost);
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
      this._setSize(this.size - 1);
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
   * The function `getSubTreeCount` calculates the number of nodes and the sum of their counts in a subtree, using either
   * recursive or iterative traversal.
   * @param {N | null | undefined} subTreeRoot - The `subTreeRoot` parameter represents the root node of a subtree in a
   * binary tree.
   * @returns The function `getSubTreeCount` returns an array `[number, number]`.
   */
  getSubTreeCount(subTreeRoot: N | null | undefined) {
    const res: [number, number] = [0, 0];
    if (!subTreeRoot) return res;

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        res[0]++;
        res[1] += cur.count;
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(subTreeRoot);
      return res;
    } else {
      const stack: N[] = [subTreeRoot];

      while (stack.length > 0) {
        const cur = stack.pop()!;
        res[0]++;
        res[1] += cur.count;
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
      }

      return res;
    }
  }

  /**
   * The function `subTreeSumCount` calculates the sum of the `count` property of each node in a subtree, either
   * recursively or iteratively.
   * @param {N | BinaryTreeNodeKey | null} subTreeRoot - The `subTreeRoot` parameter represents the root node of a subtree
   * in a binary tree. It can be either a `BinaryTreeNodeKey` (a unique identifier for a node in the binary tree) or
   * `null` if the subtree is empty.
   * @returns the sum of the count values of all nodes in the subtree rooted at `subTreeRoot`.
   */
  subTreeSumCount(subTreeRoot: N | BinaryTreeNodeKey | null): number {
    if (typeof subTreeRoot === 'number') subTreeRoot = this.get(subTreeRoot, 'key');

    if (!subTreeRoot) return 0;

    let sum = 0;

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N): void => {
        sum += cur.count;
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(subTreeRoot);
    } else {
      const stack: N[] = [subTreeRoot];

      while (stack.length > 0) {
        const cur = stack.pop()!;
        sum += cur.count;
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
      }
    }

    return sum;
  }

  /**
   * The function `subTreeAddCount` recursively or iteratively traverses a binary tree and adds a given delta value to
   * the `count` property of each node.
   * @param {N | BinaryTreeNodeKey | null} subTreeRoot - The `subTreeRoot` parameter represents the root node of a subtree
   * in a binary tree. It can be either a `BinaryTreeNodeKey` (a unique identifier for a node in the binary tree), a
   * `BinaryTreeNode` object, or `null` if the subtree is empty.
   * @param {number} delta - The delta parameter is a number that represents the amount by which the count of each node
   * in the subtree should be increased or decreased.
   * @returns a boolean value.
   */
  subTreeAddCount(subTreeRoot: N | BinaryTreeNodeKey | null, delta: number): boolean {
    if (typeof subTreeRoot === 'number') subTreeRoot = this.get(subTreeRoot, 'key');

    if (!subTreeRoot) return false;

    const _addByProperty = (cur: N) => {
      cur.count += delta;
      this._setCount(this.count + delta);
    };

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        _addByProperty(cur);
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(subTreeRoot);
    } else {
      const stack: N[] = [subTreeRoot];

      while (stack.length > 0) {
        const cur = stack.pop()!;

        _addByProperty(cur);
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
      }
    }
    return true;
  }

  /**
   * The function `getNodesByCount` returns an array of nodes that have a specific count property, either recursively or
   * using a queue.
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or a
   * `N`. It represents the property of the nodes that you want to search for.
   * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
   * return only one node that matches the `nodeProperty` or all nodes that match the `nodeProperty`. If `onlyOne` is set
   * to `true`, the function will return only one node. If `onlyOne`
   * @returns an array of nodes that match the given nodeProperty.
   */
  getNodesByCount(nodeProperty: BinaryTreeNodeKey | N, onlyOne = false): N[] {
    if (!this.root) return [];
    const result: N[] = [];

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        if (cur.count === nodeProperty) {
          result.push(cur);
          if (onlyOne) return;
        }

        if (!cur.left && !cur.right) return;
        cur.left && _traverse(cur.left);
        cur.right && _traverse(cur.right);
      };

      _traverse(this.root);
    } else {
      const queue: N[] = [this.root];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur) {
          if (cur.count === nodeProperty) {
            result.push(cur);
            if (onlyOne) return result;
          }

          cur.left && queue.push(cur.left);
          cur.right && queue.push(cur.right);
        }
      }
    }

    return result;
  }

  /**
   * The BFSCount function returns an array of counts from a breadth-first search of nodes.
   * @returns The BFSCount() function returns an array of numbers, specifically the count property of each node in the
   * bfs traversal.
   */
  BFSCount(): number[] {
    const nodes = super.bfs('node');
    return nodes.map(node => node.count);
  }

  /**
   * The function "listLevelsCount" takes a node and returns an array of arrays, where each inner array contains the
   * count property of each node at that level.
   * @param {N | null} node - The parameter `node` is of type `N | null`. This means that it can either be an instance of
   * the class `N` or `null`.
   * @returns a 2D array of numbers. Each inner array represents a level in the binary tree, and each number in the inner
   * array represents the count property of a node in that level.
   */
  listLevelsCount(node: N | null): number[][] {
    const levels = super.listLevels(node, 'node');
    return levels.map(level => level.map(node => node.count));
  }

  /**
   * The `morrisCount` function returns an array of counts for each node in a binary tree, based on a specified traversal
   * pattern.
   * @param {'in' | 'pre' | 'post'} [pattern] - The `pattern` parameter is an optional parameter that specifies the
   * traversal pattern for the Morris traversal algorithm. It can have one of three values: 'in', 'pre', or 'post'.
   * @returns The function `morrisCount` returns an array of numbers.
   */
  morrisCount(pattern: DFSOrderPattern = 'in'): number[] {
    const nodes = super.morris(pattern, 'node');
    return nodes.map(node => node.count);
  }

  /**
   * The function dfsCountIterative performs an iterative depth-first search and returns an array of node counts based on
   * the specified traversal pattern.
   * @param {'in' | 'pre' | 'post'} [pattern] - The pattern parameter is a string that specifies the traversal order for
   * the Depth-First Search (dfs) algorithm. It can have three possible values: 'in', 'pre', or 'post'.
   * @returns The dfsCountIterative function returns an array of numbers, which represents the count property of each node
   * in the dfs traversal.
   */
  dfsCountIterative(pattern: DFSOrderPattern = 'in'): number[] {
    const nodes = super.dfsIterative(pattern, 'node');
    return nodes.map(node => node.count);
  }

  /**
   * The dfsCount function returns an array of counts for each node in a depth-first search traversal.
   * @param {DFSOrderPattern} [pattern] - The pattern parameter is an optional parameter that specifies the order in which
   * the Depth-First Search (dfs) algorithm should traverse the nodes. It can have one of the following values:
   * @returns The dfsCount function returns an array of numbers, specifically the count property of each node in the dfs
   * traversal.
   */
  dfsCount(pattern: DFSOrderPattern = 'in'): number[] {
    const nodes = super.dfs(pattern, 'node');
    return nodes.map(node => node.count);
  }

  /**
   * The `lesserSumCount` function calculates the sum of the counts of all nodes in a binary tree that have a lesser
   * value than a given node.
   * @param {N | BinaryTreeNodeKey | null} beginNode - The `beginNode` parameter can be one of the following:
   * @returns the sum of the counts of nodes in the binary tree that have a lesser value than the given beginNode.
   */
  lesserSumCount(beginNode: N | BinaryTreeNodeKey | null): number {
    if (typeof beginNode === 'number') beginNode = this.get(beginNode, 'key');
    if (!beginNode) return 0;
    if (!this.root) return 0;
    const key = beginNode.key;

    let sum = 0;

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N): void => {
        const compared = this._compare(cur.key, key);
        if (compared === CP.eq) {
          if (cur.right) sum += this.subTreeSumCount(cur.right);
          return;
        } else if (compared === CP.lt) {
          if (cur.left) sum += this.subTreeSumCount(cur.left);
          sum += cur.count;
          if (cur.right) _traverse(cur.right);
          else return;
        } else {
          if (cur.left) _traverse(cur.left);
          else return;
        }
      };

      _traverse(this.root);
    } else {
      const queue: N[] = [this.root];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur) {
          const compared = this._compare(cur.key, key);
          if (compared === CP.eq) {
            if (cur.right) sum += this.subTreeSumCount(cur.right);
            return sum;
          } else if (compared === CP.lt) {
            // todo maybe a bug
            if (cur.left) sum += this.subTreeSumCount(cur.left);
            sum += cur.count;
            if (cur.right) queue.push(cur.right);
            else return sum;
          } else {
            if (cur.left) queue.push(cur.left);
            else return sum;
          }
        }
      }
    }

    return sum;
  }

  /**
   * The function `allGreaterNodesAddCount` updates the count property of all nodes in a binary tree that have an ID
   * greater than a given ID by a specified delta value.
   * @param {N | BinaryTreeNodeKey | null} node - The `node` parameter can be one of the following:
   * @param {number} delta - The `delta` parameter is a number that represents the amount by which the `count` property
   * of each node should be increased.
   * @returns a boolean value.
   */
  allGreaterNodesAddCount(node: N | BinaryTreeNodeKey | null, delta: number): boolean {
    if (typeof node === 'number') node = this.get(node, 'key');
    if (!node) return false;
    const key = node.key;
    if (!this.root) return false;

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        const compared = this._compare(cur.key, key);
        if (compared === CP.gt) cur.count += delta;

        if (!cur.left && !cur.right) return;
        if (cur.left && this._compare(cur.left.key, key) === CP.gt) _traverse(cur.left);
        if (cur.right && this._compare(cur.right.key, key) === CP.gt) _traverse(cur.right);
      };

      _traverse(this.root);
      return true;
    } else {
      const queue: N[] = [this.root];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur) {
          const compared = this._compare(cur.key, key);
          if (compared === CP.gt) cur.count += delta;

          if (cur.left && this._compare(cur.left.key, key) === CP.gt) queue.push(cur.left);
          if (cur.right && this._compare(cur.right.key, key) === CP.gt) queue.push(cur.right);
        }
      }
      return true;
    }
  }

  /**
   * The clear() function clears the data and sets the count to 0.
   */
  clear() {
    super.clear();
    this._setCount(0);
  }

  /**
   * The function "_setCount" is used to set the value of the "_count" property.
   * @param {number} v - number
   */
  protected _setCount(v: number) {
    this._count = v;
  }
}
